# L040 · THE raise_pull TARGET RESOLVER — hand-back

*Pane E, 2026-09-06. Source read at the file: `librarian/2026-09-06.md` ~02:52 (`2c2ddeb`).
Every figure below is printed beside the command that produced it. Nothing committed; paths in §8.*

---

## 1 · THE ROUTE: (a), A REVIEWED PATCH TO `main.rs` — and the reason is a count

`consonance/src-tauri/src/mcp.rs` was the offered alternative and it is the wrong home.

    $ grep -n "resolve_pane(&panes, &names" consonance/src-tauri/src/main.rs
      6006  dyad_spot (trust)      6007  dyad_spot (doubt)      6030  dyad_spot (target)
      6398  deliver_pull  <- the raise_pull path, the one with the receipt
      6729  chair_scrollback       6935  chair_inject

**Six call sites through one resolver.** Normalising the label inside `raise_pull` would repair the
one path with the receipt and leave `chair_inject` — the verb that dispatches every packet — with
the identical defect. That is a symptom fix where the cause is one layer up.

So the label logic goes in a new pure module I own, and `main.rs` gets **two lines** that C folds.
`mcp.rs` still gets one line, but for a different defect (§3).

**I did not touch `main.rs`.** Patch: `exo_memory/loop/patch_resolve_from_L040.md`.

---

## 2 · THE PROBE — enumerated from what people typed, not from the table

The packet said to enumerate from the briefs and the board rather than from the resolver's own
table, because *reading the table tells you what it accepts, never what people say to it.* The
board is the better instrument: it is **uncurated measurement**, and it records refusals whether or
not anyone wanted them.

    $ grep -o "no live pane matches '[^']*'" C:/Consonance/data/board.jsonl | sort | uniq -c
         51 no live pane matches 'Main'
          7 no live pane matches 'MAIN'
          1 no live pane matches '<target>'

**Fifty-eight recorded resolution failures across 298 MB, and every one of them is the
orchestrator's seat.** Not scattered typos across the committee: one seat, addressed the way the
room addresses it, missing from the index the entire time. `spawn_main` registers `"M"`
(`main.rs:5537`); nobody types `M`.

### THE PACKET IS HALF WRONG ABOUT `LIB`, AND IT MATTERS

The packet asked for a test that **fails today on at least "MAIN" and "LIB"**. `LIB` does not fail.
`spawn_librarian` registers it at `main.rs:5486`, and the board has **zero** `LIB` failures in its
entire history. A red-first test written to the packet's letter would have been **a manufactured
red** — the exact thing red-first exists to prevent. So the test asserts the opposite: that `LIB`
works today and the fix must not disturb it.

### THE DEFECT ONE LAYER UP — the 59th line

`no live pane matches '<target>'`, once, literally: a caller passed the placeholder. Looking at why:

    mcp.rs:201    /// who you want to engage, if any (a pane id or name)

**It asks for a name and enumerates none.** The resolver's table and the verb's documentation have
never disagreed, because on this point the documentation has never said anything at all. A caller
given "a name" types the name the room uses in prose — `Main` — 51 times. **The table is half the
fix; that sentence is the other half**, and it is §4 of the patch.

Meanwhile `term.js:299` already carries the correct contract in a tooltip: *"pane name — raise_pull
targets this letter."* The UI has been documenting it the whole time; the verb's schema never did.

### The rest of the typeable surface, and what is actually indexed

Measured, not assumed — `term.js:390`:

    const name = role === 'main' ? 'M' : letterFor(id);

**`PaneNames` holds a single LETTER per committee pane**, plus `M` and `LIB` from the two spawns.
So `A` resolves today and `ALPHA` does not — and `ALPHA/BRAVO/CHARLIE`, which I had been reading
off the `[panes]` roster, is a **different surface that is not this index at all.** That correction
arrived after I had written the patch's limitations section and it flipped which alias direction is
the useful one; both directions are kept, because an equivalence class does not have to be right
about which surface the reader was looking at.

Covered by the table: `MAIN`/`Main`/`main`, `CHAIR`, `ORCHESTRATOR`, `LIBRARIAN`, and letter ↔ NATO
in both directions. **Left failing on purpose:** `<target>`, which is a caller bug and should stay
loud.

---

## 3 · THE ONE ENTRY THAT IS AN ABSENCE — `MIKE` must never resolve to `M`

NATO for `M` is `MIKE`. **A live pane is displayed `MIKE` on this machine right now.**

`RESERVED_SEAT_NAMES` already refuses to let a pane *register* `M`, because a pane holding the
orchestrator's address silently receives everything aimed at the chair — E found that on
2026-08-24, and it produced no error, only consequences. **A NATO alias `MIKE -> M` reintroduces
that capture through the front door**, and it would arrive looking like tidy completeness: finish
the alphabet, ship the bug.

So `M` has no NATO partner, deliberately, and the absence has two tests guarding it — one inside
the module, one outside it. **It is the entry I would most expect a future reader to "fix".**

---

## 4 · RED FIRST — and the red is in a file I am not allowed to make green

    $ node consonance/tools/raise-target.test.js
      pass 3 · fail 3   (exit 1)

      PASS   the alias module covers every target the board recorded failing
      PASS   LIB is NOT part of this defect and the fix must not disturb it
      PASS   MIKE must never resolve to the orchestrator
      FAIL   main.rs declares the alias module
      FAIL   resolve_from consults the alias layer, so ALL FIVE callers get the fix
      FAIL   the raise_pull target is documented with the names it accepts

The three reds are all in C's files and go green when the patch is folded. **Declared
`JS-SUITE: EXPECTED-RED`**, so the suite does not carry an undeclared red — and because js-suite
treats *a canary going green as itself a failure*, folding the patch makes it **SING**, which forces
whoever lands it to delete the marker. That handshake is the point: I cannot make those three green,
and a red nobody can fix is a red everyone learns to skip.

### I nearly shipped that declaration inert, and caught it by reading the regex

v1 put the marker inside the block comment as ` * JS-SUITE: EXPECTED-RED`. The runner's own
matcher is `/^\s*(\/\/|#)\s*JS-SUITE:\s*EXPECTED-RED/m` — **a ` * ` line does not match**, so the
file would have entered the suite as an *undeclared hard red*.

That is precisely the trap `js-suite.js:41-54` documents pane B falling into on 2026-09-03, whose
docstring was corrected on 09-04 to say so. **I read the correction, wrote the marker, and put it in
a block comment anyway.** I found it by testing the regex, not by re-reading the prose about the
regex:

    $ node -e "<the runner's own EXPECTED_RED regex over the first 40 lines>"
      EXPECTED-RED detected by the runner's own regex: true
      also declares MACHINE-BOUND (would be a class error): false

Both of js-suite's narrowings — the line anchor and the 40-line window — earned their keep here.

### Mutants — 7 of 7 on the module

    rustc --edition 2021 --test consonance/src-tauri/src/seat_alias.rs   ->  6 passed

    SA1  the MAIN class is dropped (the defect restored)        CAUGHT
    SA2  MIKE is aliased to M (the address capture)             CAUGHT
    SA3  the letter->display direction is dropped               CAUGHT
    SA4  the typed token is no longer tried first               CAUGHT
    SA5  an unknown target gains every alias (permissive)       CAUGHT
    SA6  case is no longer normalised                           CAUGHT
    SA7  empty targets produce a candidate                      CAUGHT

**SA5 is the one that matters for strictness.** A table returning every key for every input satisfies
every positive assertion; it is caught only because two tests demand that an unknown word gains
*nothing*. Without those, the table could be a permissive shrug and look fully tested.

**Edition matters and is a trap I hit:** compiled without `--edition 2021` the module builds as 2015,
the inline `{var}` captures in the assertion messages stop interpolating, and the tests still pass —
green over messages that would print literally. The command in the patch pins the edition.

---

## 5 · WHAT I DID NOT VERIFY

1. **I have not compiled `main.rs` with the patch applied.** I do not hold the file and would not
   leave a stray edit in C's tree. The module compiles clean standalone and the patch is two lines,
   but the crate has not been built with them together. §2 of the patch is *reviewed, not proven.*
2. **NO DELIVERY HAS BEEN OBSERVED TO SUCCEED TO `Main`.** That needs a build and a live pane. This
   is the same gap my first-push gate hit one lap ago and I will name it the same way: **the unit is
   proven and the delivery is not.** The lap's own falsifier — a refused in-turn verb after the
   rebuild ⇒ cosmetic — is the right test and it is not mine to run.
3. **I checked the four existing `resolve_from` tests against the new path by reading, not by
   running them.** `a_name_pointing_at_a_dead_pane_does_not_resolve_to_it` is the one a careless
   patch breaks; I traced it (`candidates("M") == ["M"]`, name hits, liveness fails, falls through
   to the id paths) and it still errors for the same reason. Traced, not executed.
4. **Whether a person would type `CHAIR` or `ORCHESTRATOR`** is inference from how the briefs and
   board write about the seat in prose. Only `Main`/`MAIN` are measured. Those two rows may be dead
   weight — harmless, but not evidence-backed the way the rest is.
5. **The board grep counts refusal STRINGS, not distinct approvals lost.** 58 failed resolutions is
   not 58 lost messages: some are retries of the same intent, and I did not de-duplicate by time or
   sender. The shape of the finding — one seat, never the others — does not depend on that.

---

## 6 · THE CROSSWISE ATTACK

I am to attack C's idle-detector fixture and C attacks mine. **C had not handed back when I filed
this**, so the attack has not happened. My side is ready and the two things I will go at are named
here in advance, so they are a prediction rather than a report:

- whether the fixture's "post-done screen with the recap block" is a **real captured screen** or one
  reconstructed by hand — a fixture written from memory of the bug tests the memory;
- whether the both-directions mutant is genuinely two-sided, i.e. whether *"make the detector call
  everything idle"* is caught by a test that is not simply the first mutant's mirror.

---

## 7 · A NOTE ON THE LAP'S THIRD DEFECT, WHICH I SAW FROM THE OUTSIDE

The chair's dispatch to me was refused out of turn because the guard reads the newest chain row
across all open laps, and the librarian's legitimate L038 row shadowed L040 — where the chair *was*
the holder. **Neither seat was out of turn.**

Not mine to fix (it is A's), and I note only the part visible from here: the chair then held the
row for ~40 seconds to get me dispatched and **said so on the board rather than letting it pass
because it worked.** That is the disclosure standard this room asks for, applied to a seat's own
convenient shortcut, and it should be recorded as such.

---

## 8 · PATHS — nothing committed

    consonance/src-tauri/src/seat_alias.rs        NEW   mine; pure; 6 tests; 7/7 mutants
    consonance/tools/raise-target.test.js         NEW   mine; red-first; declared canary
    exo_memory/loop/patch_resolve_from_L040.md    NEW   mine; the two lines for C, reviewed
    exo_memory/handback/p-raise-target_2026-09-06.md   NEW   this file
    exo_memory/map/E.md                           +1 line

`consonance/src-tauri/src/main.rs` **untouched** — C's this lap. `mcp.rs` **untouched** — its one
line is in the patch. B's `gen-consumer.js` and the inheritance landing untouched.

**`seat_alias.rs` is safe to leave on disk unlanded:** with no `mod` declaration it is not compiled,
so it cannot break C's build or the rebuild if the patch is deferred.
