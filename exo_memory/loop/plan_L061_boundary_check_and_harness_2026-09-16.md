# L061 — the next lap, planned at the keeper's direct word (door two). Librarian (the lineage, on L), 2026-09-16 05:0x.

*The keeper, 04:57: "we havent done this directly for a bit, lets first plan what and how to start the next workchain loop." Entry: the librarian (`two_doors_amendment_2026-09-02.md`: "directly to the lib themselves … either way the chain works when it starts"). Clock: ~2h50m to the 08:00 close; everything lands and pushes before it.*

## WHAT — two small packets of real work found tonight by void cells, plus one measurement

Both come from RUN 1's T2 (`librarian/2026-09-16.md` 04:39, 04:40) and from the plan the battery displaced (`plan_pane_battery_2026-09-16.md`, the A paragraph). Neither is speculative; every line has a path.

**P-BOUNDARY-CHECK-FIXES → E** (E found the guard's zero rows; C found the NUL; A found the stale citation — E builds, on a COPY first, the tool's own test file beside it):
1. `consonance/tools/boundary-check.js:155` — the raw NUL byte in `o.pane + '\0' + o.text` makes the file read as binary to `grep` (C's finding; verified: `grep -n` on the file answers "Binary file matches"). Escape it. Bar: `grep -c "" == wc -l` afterwards, and `grep -n` prints line numbers.
2. `:26`, `:88`, `:256` — the citation `main.rs:5605` for the `[chair:MAIN]` arrival stamp is stale; the stamp is `main.rs:9504`. Re-point to a SYMBOL (the function or the format string), not a line, so it stops rotting; the printed `say(...)` at `:256` too.
3. `:5-6` — the header paraphrases the chain/freestyle cut and drops "the loop is tight and" (`consonance/src-tauri/brief/BUILDING.md:539-543` has it) and cites `brief/BUILDING.md`, a path that does not exist. Restore the clause and the real path.
4. NOT in this packet: the blind guard's zero rows (item C below decides what it is before anyone changes code).
Tests: the tool's `boundary-check.test.js` (22 tests, every assertion drives the tool against a fixture — keep that method; add one that greps the source for a NUL and fails on it, and one that the citation resolves to a symbol that exists). Mutants on the copy per P-HARNESS. Hand-back to `handback/p-boundary-check-fixes-E_2026-09-16.md`.

**P-HARNESS-REVISION → A** (A's own three lessons from P-LEAVE-3, never landed — the battery displaced it): into `loop/packet_harness_and_lib_2026-09-15.md` (a dated §) and the shared pattern `dev/tail-carry.mutants.js` (comment + behaviour): (a) pin the SHAPE a value sits in, never that a token appears; (b) an edit that rewrites an anchored line must report NOT APPLIED loudly with the anchor named, never silently; (c) validate the mutant list before use (field count, file is one of the named sources). Plus the leak-check refinement from tonight, as a rule in `dev/diversity/leak-check.sh`'s header (not a behaviour change tonight): a filename in a status listing is EXPOSURE recorded beside the cell; returned content is a VOID. Bar: `node dev/tail-carry.test.js` stays 129/0; the three mutant harnesses still run on copies (`--only` one row each). Hand-back to `handback/p-harness-revision-A_2026-09-16.md`.

**P-BLIND-ROWS → C** (measurement, no code): the blind-window guard reads only rows with `pane === "blind"`, and this machine's `board.jsonl` has ZERO across a span that begins 2026-06-30. Decide from disk which it is — (i) a mirror gap (`main.rs:1577`: the file is a write-only mirror never reloaded; blind transitions may be posted only to the in-memory ring), or (ii) machine locality (the 2026-06-30 → 08-01 window ran on D). Instruments: `grep -n "blind" main.rs` around `board_push` and `blind.lock`; the shell ledgers under `~/.claude/shell/` for blind rows; `data/blind.lock` mtimes; the 08-28 registration's own lines. Universe printed. Hand-back to `handback/p-blind-rows-C_2026-09-16.md`. Its answer decides whether the guard needs a code fix (then a later lap) or a sentence in the tool's output ("this machine has never recorded a blind window").

**B reads** E's and A's hand-backs at source before landing (the standing non-author read). **The librarian** re-derives every bar and collates; scores nothing.

## HOW — the chain, step by step, with the verb at each step

1. **Open the row** (chair): `node consonance/tools/lap-row.js --open --initiator human --entry lib --inquiry "<the keeper's 04:57 words>" --guess exo_memory/loop/plan_L061_boundary_check_and_harness_2026-09-16.md` — the guess is this file, sealed before the map.
2. **Map** (librarian, this file; already on disk): `lap-row.js --map L061 --paths <this file>`.
3. **RUN 1 CLOSES FIRST** (chair): L060 → filed, run file first line "T3 VOID (key readable) · T2 VOID (ceiling 8/8×3) · zero scored cells · RUN 2 designed for load". The battery's two loop rows do not stay open under a new lap.
4. **Digest restore** (librarian, 05:05 unless a T5 seal exists): `board-digest.js` back into `~/.claude/settings.json` from `settings.json.bak-battery-20260916-041801`; the window's end recorded. (Nothing in L061 needs the panes blind to each other; it is ordinary work.)
5. **Dispatch together** (chair): three packets, three panes, one message each carrying the packet's paragraph above and the prior-art paths; `lap-row.js --stage L061 dispatched --holder panes --by chair --to A,C,E`; then `--opened L061 --paths <the paths the packets cite>` (the opened-row gate).
6. **Hand-backs → librarian** (`call_librarian`, pointer only); B's reads of E's and A's; the librarian re-derives (cargo/node bars re-run, mutants `--only` one row each on the copy); collation in `librarian/2026-09-16.md`; `--stage handbacks-in`, `--stage return-leg --holder chair`.
7. **Land** (chair): one commit per packet, named paths, tests after each; **push**; `--stage L061 filed`.
8. **07:45**: hands off. **08:00**: the keeper closes with the stick in; A's `nc_watch` is armed over it (F3 half); D pulls at 08:4x and rebuilds rows 4–5.

## What this lap deliberately does NOT do

No battery cell. No relaunch. No change to the blind guard's behaviour until C's measurement says which defect it is. No live shutdown test (needs a closed app). RUN 2's design (load; test–retest; scorers in their own cwd; keys off-repo; hand-backs off-tree) is the next design lap on a fresh shift, and the thesis test comes after it, in the order the keeper set at 01:42.
