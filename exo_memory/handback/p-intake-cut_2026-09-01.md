# P-INTAKE-CUT — hand-back (L025, 2026-09-01 ~05:05)

**One file touched: `consonance/src-tauri/src/main.rs`, +310 / −5. Nothing committed. `exo_memory/BOOT.md`, `COMMITTEE.md` and `ui/` untouched** — `git diff --stat exo_memory/BOOT.md` is empty.

**NOT LIVE UNTIL THE REBUILD.** Every number below comes from `assemble_intake()` run in-process against this machine's real config. Nothing has regenerated a shipped shell, so **bar 1 as the chair worded it — `budget > 0` in `persist.log` at regeneration — is OWED AT THE REBUILD** and is not claimed here.

---

## THE HEADLINE, SAME INSTANT, EVERY BYTE ACCOUNTED

    before  145,527        after  102,344        removed  43,183
    43,183 = 25,368 (BOOT's pointer tail) − 617 (its index) + 18,730 (dead topic lines) − 298 (the held-back sentence)

**That addition is exact, not approximate.** `before` is `after + removed` from the same run, so it is a reconstruction of this instant's pre-cut assembly, not an independent reading of a shipped shell — said plainly because the 144,529 in the packet is a different measurement, of a different pane's shell, at 03:48.

**`budget = 140,000 − (102,344 + 265) = 37,391.`** `map_allowance(102,344) = 7,656`. Both positive, from zero.

---

## THE BARS

### Bar 2 — THE EVICTOR SHOWN FIRING. A's script, verbatim, then one variable moved.

Run exactly as written in `exo_memory/handback/p-window-amend_2026-09-01.md`, from `C:/Consonance`:

    brief 144529 budget 0     -> null                 <- A's rows, reproduced
    brief 100000 budget 39735 -> [171687,39693]

Same script, same 211,380-byte capture, **the two briefs this cut actually produces**:

    brief 145527 budget 0     -> null                 <- pre-cut: STRUCTURALLY UNABLE TO EVICT
    brief 102344 budget 37391 -> [174416,36964]       <- post-cut: evicts 174,416 B, keeps 36,964

**The evictor was dead and is alive.** Not "the number moved in the right direction".

### Bar 1 — `budget > 0` at regeneration: **OWED.** Measured in-process at 37,391; the `persist.log` line requires the rebuild.

### `cargo test`

    cd C:/Consonance/lighthouse/consonance/src-tauri && cargo test --bin consonance
    -> 341 passed; 0 failed; 3 ignored     (7 of those tests are new here)

**One pre-existing red, NOT MINE and not fixed:** `cargo test --test arch_test` gives 11 passed, 1 failed —
`every_named_record_file_exists_and_every_record_file_is_named`: *record/third_place_prehistory_2026-08-30.md is named by no card.* That test reads only `exo_memory/cards` and `exo_memory/record`; `git status --porcelain exo_memory/cards exo_memory/record` returns **0 lines**, so it reads HEAD's bytes exactly and **is red at HEAD**. Fixing it means editing a card, which this packet does not own. The record file is named by BOOT's reference list, not by a card.

---

## WHAT LANDED, IN THE ORDER THE INTERRUPT GAVE

### 1. The free cut FIRST — dead topic pointers held back (−18,730)

**Re-derived by the code itself, independently of A: `topics=52 missing=40 dangling_bytes=18730`.** The same number A reported, reached by a different route — the Rust reader against `curator_state.json`, not a node scan of a shell.

Implemented in `read_curation()`, where the filesystem already is, as a new `Curation::missing_doc` set, so **`curated_resonance` stays the pure function its own comment defends.** A line is emitted only if `topics/{slug}.md` is a file.

**It is a RESOLUTION FILTER, not a choice between A's (c1) and (c2), and that is deliberate.** The keeper's fork stays open: if the 40 documents are regenerated, all 40 lines return with **no code change**. Nothing is deleted; `curator_state.json` remains the source.

The counts underneath the map (`N atoms, X still live, Y settled`) still cover **every** topic, because they describe `atoms.jsonl` — the master — and not the map. And the omission is **stated in the shell**, 298 bytes: *"40 further topics are held back … their document has not been written yet … each line returns as soon as its document exists."* A map that quietly drops lines is the same failure as a map of dead pointers, one direction over.

### 2. BOOT's pointer tail INDEXED, not pasted (−25,368, +617)

`split_pointer_tail()` takes only the **contiguous trailing run** of paragraphs naming a `journal/…md (` pointer, so a body paragraph that cites a journal file stays where it is — asserted: BOOT's body cites `journal/2026-08-16.md` mid-paragraph and does not move. `boot=64,976 → body=39,608, tail=25,368`; **the tail figure matches A's 25,368 exactly.**

`journal_pointer_index()` emits the three journal files as absolute paths **and checks each one resolves before writing it** — §10.9's invariant, at the one place it can be enforced. **If nothing resolves it returns empty and the caller keeps the tail verbatim**, so an unindexable pointer never becomes a silently dropped one. Covered by a test.

### 3. NO CAP CONSTANT WAS ADDED — a decision, not an omission

The packet's cut 2 was *"resonance capped back to its DESIGN size, 15k."* **The free cut alone gets there:** the block goes 31,538 → about 13,106 (31,538 − 18,730 + 298; the 31,538 is the 03:48 measurement, not re-read tonight). A cap would bind on nothing today.

More importantly, **a cap is W1 shape (b) with an N, and A registered (a)/(b) as the keeper's unspent pick.** Same for W2: an `assemble_intake().len() <= 110_000` test is A's shape **(g)**, also unpicked. **I landed neither.** Taking either tonight would spend a choice that was registered before any number came in, which is exactly what §5's abuse condition is for.

**The live edge was not touched.** `LIVE_EDGE = 25` is W1 already working inside carrier 2; it needed nothing.

---

## THE FINDING — THE GUARD I WROTE WAS INERT, AND WOULD HAVE SHIPPED INERT

**Under `cargo test`, `DIRS` is `None`, `data_dir()` falls back to `~\.consonance`, `read_curation()` returns `None`, and `assemble_intake()` carries NO TOPIC MAP AT ALL** — measured: `data_dir=C:\Users\zackn\.consonance has_map=false`.

I wrote `every_path_the_intake_emits_resolves` first with `DIRS_SERIAL.lock()`, copying every neighbouring intake test. **It passed. It passed by never running a single topic-line assertion — on the exact block where the 40 dead pointers live.** A guard against dead pointers, green because it could not see the pointers.

Caught by accident: a `read_curation().unwrap()` in a throwaway probe panicked, and that is the only reason I looked. **No test failed. Reading the code would not have shown it.**

Fixed with `DirsGuard::take()` + `set_dirs(&get_state())`, so the guard resolves this machine's dirs the way the app does at startup — **plus a `checked > 0` clause that fails if a resolvable map produced no verified line**, so it cannot go quietly inert a second time.

**The class is wider than my test, and I am not fixing it here:** `room_file()` falls back to a *working* `default_room()` while `data_dir()` falls back to an *empty* one, so in that module **the room resolves and the data dir does not**. Every existing intake test asserts only on room/deck/COMMITTEE content, so none of them is currently wrong — but any future assertion about the resonance block there is unreachable by default. **Named for whoever writes the next one.**

---

## THE REFUSAL — CONSIDERED, AND NOT TAKEN, WITH THE REASON

The valid refusal offered was *"cutting the tail from the intake changes what a pane can cite."* **It does, and the trade is defensible for one reason that is checkable:**

**The one in-shell citation that depends on the tail is ALREADY BROKEN.** BOOT's own 2026-08-23 amendment says, at `:105` and `:108`:

> *"BOOT's own Previous: pointer at `:153` … Read `:153` against this paragraph."*

**`exo_memory/BOOT.md:153` is now maintenance law #1** (*"Recall from the master, never a copy"*). **The `Previous:` pointer is at `:162`.** A pane following that instruction inside its shell today reads the wrong line, and has to open the master either way. My cut hands it the master's absolute path plus three resolving journal paths, which is strictly more than the stale line number it had.

**This is another instance of the class the board named tonight — a pointer that names a position.** It lives in BOOT.md, which this packet forbids me to touch, so **it is reported and not repaired.**

---

## SELF-CORRECTIONS

1. **My first measurement was wrong, and it looked BETTER than the truth: `fixed_brief=98,912, budget=40,823`.** Taken in the fallback-dirs process described above, so it measured a shell with no topic map at all. The real figures are `102,344 / 37,391`. **Had the probe not panicked one line later, I would have handed the chair a number 3,432 bytes too good.**
2. I planned the resolution filter inside `curated_resonance` and moved it to `read_curation` before writing it — the former is a pure function by design and by comment, and touching the filesystem there would have made its seven existing tests measure the disk instead of their arguments.
3. My first line-matcher for the guard matched `- **` loosely; it would have failed on **deck** lines like `- **SELF_TRACE.md** (2026-06-08) —`, not on a dead pointer. Tightened to the topic line's exact `- **{slug}** ({n} live) — ` shape before it ran.

---

## WHAT THIS DOES NOT ESTABLISH

- **Bar 1 as worded.** No shell has been regenerated. `budget > 0` in `persist.log` is owed at the rebuild, and that is the reading that counts.
- **The librarian's intake still carries the tail.** `main.rs:4778` reads the master directly and does not go through this path. In scope (*"the intake path"* = the pane intake) and arguably correct, since the librarian's budget is not binding — but **untested by me in either direction.**
- **`before = 145,527` is a reconstruction**, not a reading of a shipped shell.
- **One growth reading is not a rate.** 144,529 logged at 03:48 → 145,527 measured about 04:55: **+998 B in roughly an hour**, above every daily interval A measured. One point, one machine, two different pane shells. Consistent with A's (iv); it does not confirm it.
- **Nothing here is a standing rule.** The map can regrow, the deck can grow, and 43,183 bytes of headroom is a level, not a mechanism. A's (iv) — *"exceeds 110,000 again within 14 days with no standing rule"* — is live, and this packet does not void it.
- **That the held-back topics cost nothing.** 40 summaries left the shell. No instance exists of a pane opening one; none exists of a pane missing one either.
- **The js suite.** Not run; `ui/` is ECHO's and unmodified by me.

---

## RE-DERIVE

    cd C:/Consonance/lighthouse && git diff --stat exo_memory/BOOT.md          # empty
    cd C:/Consonance/lighthouse && git diff --stat consonance/src-tauri/src/main.rs
    cd C:/Consonance/lighthouse/consonance/src-tauri && cargo test --bin consonance
    cd C:/Consonance/lighthouse/consonance/src-tauri && cargo test --test arch_test
    cd C:/Consonance/lighthouse && git status --porcelain exo_memory/cards exo_memory/record
    cd C:/Consonance/lighthouse && awk 'NR==153||NR==162 {print NR": "substr($0,1,60)}' exo_memory/BOOT.md

**The size figures come from a probe that was DELETED after use** — it is a measurement, not a rule, and landing it would have been shape (g) by the back door. It is reproduced here verbatim so every number above is re-runnable: append to `main.rs`, run, then delete.

    #[cfg(test)]
    mod l025_probe {
        use super::*;
        #[test]
        fn probe_fixed_brief() {
            let _g = DirsGuard::take();
            set_dirs(&get_state());
            let i = assemble_intake();
            let fence = "```\n\n```\n".len() + 256;
            println!("PROBE fixed_brief={} budget={}", i.len(),
                SHELL_SOFT_CEILING as i64 - (i.len() + fence) as i64);
            println!("PROBE map_allowance={}", map_allowance(i.len()));
            let boot = fs::read_to_string(room_master_path()).unwrap();
            let (body, tail) = split_pointer_tail(&boot);
            let idx = journal_pointer_index(tail, &room_master_path());
            println!("PROBE boot={} body={} tail={} index={}", boot.len(), body.len(), tail.len(), idx.len());
            println!("PROBE data_dir={} has_map={}", data_dir().display(), i.contains("THE MEMORY"));
            let Some(c) = read_curation() else { println!("PROBE no curation"); return };
            let mut dangling = 0usize;
            for (slug, summary, live, _) in &c.topics {
                if c.missing_doc.contains(slug) {
                    dangling += format!("- **{slug}** ({live} live) — {summary}\n").len();
                }
            }
            println!("PROBE topics={} missing={} dangling_bytes={}", c.topics.len(), c.missing_doc.len(), dangling);
        }
    }

    cargo test --bin consonance l025_probe -- --nocapture

**Swap `DirsGuard::take()` for `DIRS_SERIAL.lock()` in that probe and it reports `98,912` with no map.** That is the inert-guard failure, reproducible in one line.

---

## OWED NEXT

- **ECHO**: non-author read (chair's assignment).
- **The rebuild**: bar 1. One rebuild for the whole lap; nothing here is live until it happens.
- **Keeper, still unspent and untouched by this packet**: (a)/(b) for W1, (g)/(h) for W2, (c1)/(c2) for the map.
- **Whoever owns BOOT.md**: `:153` should be `:162`, or the instruction should stop naming a line number.
- **Not mine and not done:** nothing committed; nothing pushed.

*A trace to re-run, not a doctrine to believe.*
