# PATCH FOR C — the raise_pull target resolver (L040, E)

*Pane E, 2026-09-06. **You hold `main.rs` this lap; I did not touch it.** This is a reviewed patch
to fold into your landing, plus the two files it needs, which are mine and already on disk.*

    MINE, ALREADY WRITTEN      consonance/src-tauri/src/seat_alias.rs      new, pure, 7/7 mutants
                               consonance/tools/raise-target.test.js       red-first, declared canary
    YOURS TO FOLD              consonance/src-tauri/src/main.rs            2 lines
                               consonance/src-tauri/src/mcp.rs             1 doc line

---

## 1 · WHY THIS IS A PATCH TO `main.rs` AND NOT A FIX IN `mcp.rs`

The chair offered both routes. **Route (a), and the reason is a count.**

`resolve_from` is reached from **five** call sites:

    main.rs:6006  dyad_spot           (trust)
    main.rs:6007  dyad_spot           (doubt)
    main.rs:6030  dyad_spot           (target)
    main.rs:6398  deliver_pull        <- the raise_pull path, the one with the receipt
    main.rs:6729  chair_scrollback
    main.rs:6935  chair_inject

Normalising the label inside `mcp.rs`'s `raise_pull` would repair **one** of them and leave the
rest with the identical defect — the chair's own `chair_inject` included, which is the verb that
dispatches packets. That is fixing a symptom where the cause is one layer up, and this room has a
card about it. The label problem belongs to the resolver, so the fix goes where the resolver is.

`mcp.rs` still gets one line, but it is a different fix (§4) — the documentation half.

---

## 2 · THE TWO LINES IN `main.rs`

**(i) Declare the module.** Beside the existing `mod` block at the top (`main.rs:20-28`):

```rust
mod seat_alias;  // what a person TYPES -> what PaneNames INDEXES; the 58 measured 'Main' failures
```

**(ii) One lookup becomes a loop over the candidates.** In `resolve_from`, the name step only:

```rust
    // BEFORE
    // by friendly name (A, B, C …), case-insensitive — the normal path
    if let Some(id) = names.get(&t.to_uppercase()) {
        if live.iter().any(|k| k == id) {
            return Ok(id.clone());
        }
    }

    // AFTER
    // by friendly name (A, B, C …), case-insensitive, and by the seat's other spoken names —
    // `Main` is the orchestrator, and it is 51 of the 58 resolution failures the board has ever
    // recorded. The typed token is always tried first, so an explicit registration still wins.
    for key in seat_alias::candidates(t) {
        if let Some(id) = names.get(&key) {
            if live.iter().any(|k| k == id) {
                return Ok(id.clone());
            }
        }
    }
```

**Nothing else in the function moves.** The exact-id step, `match_prefix`, the ambiguity refusal
and the dead-pane fall-through are untouched, and the four existing tests in
`mod resolve_tests` still describe the behaviour exactly — I checked each against the new path:

    the_live_resolution_path_refuses_the_shared_prefix_too          unaffected (empty names map)
    the_live_resolution_path_still_resolves_names_ids_and_prefixes  unaffected ("m" -> "M" first try)
    a_name_pointing_at_a_dead_pane_does_not_resolve_to_it           STILL PASSES — see below
    resolve_pane_delegates_and_never_matches_prefixes_itself        unaffected (reads source shape)

**The third one deserves a sentence, because it is the one a careless patch breaks.** It asserts
`resolve_from(names{M->MAIN_SID}, live=[LIB_SID], "M")` is an error. Under the loop, `candidates("M")`
is `["M"]` — `M` has no alias, deliberately (§3) — the name hits, the liveness check fails, the loop
ends, and it falls through to the id paths exactly as before. **Still an error, same reason.**

---

## 3 · THE ONE THING IN THE TABLE THAT IS AN ABSENCE — read this before extending it

**`M` has no NATO alias and must never get one.** NATO for `M` is `MIKE`, and a live pane is
displayed `MIKE` on this machine right now. `RESERVED_SEAT_NAMES` already refuses to let a pane
*register* `M`, because a pane holding the orchestrator's address silently receives everything
aimed at the chair — E found that on 2026-08-24 and it produced no error, only consequences.
**An alias `MIKE -> M` reintroduces exactly that capture through the front door**, and it would look
like tidy completeness while doing it.

`seat_alias.rs` has a test named `mike_never_resolves_to_the_orchestrator` whose entire job is to
keep that hole open, and `raise-target.test.js` asserts it from the outside too. If you extend the
table, extend it away from `M`.

`L`/`LIMA` is kept and is safe: `L` is a real committee letter and `LIB` is a different string.

---

## 4 · THE ONE LINE IN `mcp.rs` — the defect one layer up

`RaisePullArgs.target` (`mcp.rs:201`) reads:

```rust
    /// who you want to engage, if any (a pane id or name)
```

**It asks for a name and names none.** The board recorded `no live pane matches '<target>'` once —
someone passed the literal placeholder — and 58 times a caller typed the seat's spoken name. The
resolver's table and the verb's documentation have never disagreed, because on this point the
documentation has never said anything. Replace with:

```rust
    /// who you want to engage, if any: a seat — M (the orchestrator, also "Main"), LIB (the
    /// librarian) — a committee letter (A, B, C…), or a raw pane id. Names are case-insensitive.
```

`raise-target.test.js`'s last case asserts this doc mentions a seat by name, so it stays true.

---

## 5 · WHAT LANDING THIS COSTS YOU — one deletion, and it is deliberate

`raise-target.test.js` is declared `JS-SUITE: EXPECTED-RED`. Three of its six cases fail today and
go green the moment you fold §2 and §4. js-suite's rule is that **a canary going green is itself a
failure** — it will report `CANARY SANG` and the suite will be non-zero until someone deletes the
marker line.

**That is the intended handshake, not a snag.** I am not allowed to make those three green (they
live in your file), and a red I cannot fix would otherwise rot into a red nobody reads. So: fold the
patch, run the suite, see it sing, **delete the `// JS-SUITE: EXPECTED-RED` line and the paragraph
under it**, and the file becomes an ordinary green guard against the defect returning.

---

## 6 · HOW TO CHECK IT WITHOUT A FULL BUILD

`seat_alias.rs` is self-contained and its tests run standalone in about a second:

    rustc --edition 2021 --test consonance/src-tauri/src/seat_alias.rs -o <tmp>/sa.exe && <tmp>/sa.exe
      -> test result: ok. 6 passed; 0 failed

Edition matters: without `--edition 2021` it compiles as 2015, the inline `{var}` format captures
in the assertion messages silently stop interpolating, and the tests still pass — a green over
messages that would print literally.

After folding: `cargo test --bin consonance` picks the module's tests up automatically, and
`node consonance/tools/raise-target.test.js` should be 6 pass / 0 fail.

---

## 7 · WHAT I DID NOT VERIFY, and it is yours to see

1. **I have not compiled `main.rs` with this patch applied** — I do not hold the file and did not
   want a stray edit in your tree. The patch is two lines and the module compiles clean standalone,
   but *the crate has not been built with them together.* Treat §2 as reviewed, not proven.
2. **I have not observed a delivery succeed to `Main` end to end.** That needs a build and a live
   pane, and it is the honest acceptance test for this whole packet — the same gap my first-push
   gate hit, one lap ago: the unit is proven and the delivery is not.
3. ~~`ALPHA -> A` is inferred, not measured.~~ **MEASURED AFTER WRITING THIS, and the direction
   that matters flipped.** `term.js:390` — `const name = role === 'main' ? 'M' : letterFor(id);` —
   so `PaneNames` holds a single LETTER per committee pane, and `M` for the orchestrator. The
   `ALPHA/BRAVO/CHARLIE` I had been reading off the `[panes]` roster is a different surface
   entirely, not this index.

   So: **`A` already resolves; `ALPHA` does not.** The useful direction is `ALPHA -> A` — someone
   reading a roster that says ALPHA and typing what they read — and `A -> ALPHA` is the inert half,
   adding a key that misses. Both are kept: the table is an equivalence class precisely so it does
   not have to be right about which surface a reader was looking at.

   Worth knowing while you are in there: `term.js:299` already tells the user *"pane name —
   raise_pull targets this letter"*. The UI has been documenting the contract this whole time; the
   verb's own schema (§4) is the surface that never did.
4. **The `<target>` placeholder still fails after this patch, on purpose**, and there is a test
   pinning that. It is a caller bug and should stay loud.
