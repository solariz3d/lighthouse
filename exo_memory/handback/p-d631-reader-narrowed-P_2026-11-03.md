# D631: the second reader narrowed, with a same-turn note (pane P, 2026-11-03)

Packet: the chair's D631 dispatch (14:30:50Z), from `exo_memory/loop/plan_room_fixes_2_5_2026-11-03.md` (6fa5aa26), fix 3. Tier: PROVE IT. Branch `d631-p` off `d628-o` (82da03fc), in my worktree `Desktop/worktrees/lh-d631-p`. Not pushed. Nothing installed: the installed hook copies are untouched until the restart. Evidence: `p-d631-reader-narrowed-P_2026-11-03_evidence/` (EV).

## Verdict first
- **(a) as worded barely narrows.** The class built from the ruling's own words (relayed figures and status claims) keeps **all 8 of 8** real errors in my D627 sample, but sends **77 of 80** of those rings to the model: **3 calls saved** (3.8%, Wilson 95% [1.3, 10.5]).
  - Across all rings, not only flagged ones (a fresh seeded sample), it sends **67 of 80**: **13 saved** (16%).
  - The reason: nearly every hand-back ring has a status word ("green", "passed", "landed"), and every librarian relay to the chair has a figure.
- **The useful narrowing is post-hoc and not registered: `call_chair` only.**
  - It keeps **8 of 8** and saves **27 of 80** in-sample (34%), and **46 of 80** out of sample (58%).
  - All 8 real errors were in the librarian's relays to the chair, and the 27 pane rings in the sample had **0** errors. The Wilson upper bound for that 0 of 27 is 12.5%, so pane errors are not ruled out.
  - Whether to switch is the librarian's call, and the keeper's.
- **(b) will show a note on about 44% of all rings** (35 of 80 out of sample: in class and flagged), and **about 9 in 10 of those notes flag no real error.**
  - In-sample, 77 rings get a model call and 8 of them hold a real error. The other 69 would still get a note, since every sampled ring was flagged.
  - This is the 10-03 "49% nagging" moving from a shadow log to the seats' turns. Read it before the restart swaps the hook in.

## What was built (commits acbc2a60 and 5faa4014 on d631-p)
- **(a) the narrowed trigger**, `consonance/hooks/second-reader.js`: `classify(text, tool)`.
  - It is lexical, deterministic and free, so it can be replayed over past rings.
  - **STATUS:** a pass/fail/green/red state, "still/no longer …", refuses/blocks/crashed/hangs, or is live/installed/landed/pushed/fixed/broken.
  - **RELAYED FIGURE:** a number (after paths, shas, dates, times, packet ids and list markers are removed) attributed to another seat or source ("A's", "pane O", "the librarian", per, reports, found, measured…). On `call_chair` any number counts as relayed.
  - `inferred:` lines are ignored, as the question already ignores them.
  - A ring out of class writes one `skipped-class` row (seat, tool, sha, tool_use_id; no text) and starts no worker. Every row now carries `toolUseId`.
- **(b) the same-turn note**, new `consonance/hooks/second-reader-note.js`. It is a PostToolUse hook on the same two verbs.
  - When it fires, the ring is already delivered, so it cannot block it.
  - It waits, bounded at 25 s, for this ring's ledger row, found by tool_use_id. If the row has flags, it prints `additionalContext`: the flagged sentences and the sources they name, with the line "The ring you just sent was DELIVERED; this is a note, not a block". It gives no advice.
  - A shown note and a wait that ran out each write a ledger line, `note-shown` or `note-timeout`, with no quote text.
  - It is silent at once on skipped-class, busy, no-text and error rows, and on an ok row with no flags.
  - It is silent after a 1.5 s grace when no worker is running.
  - checked: code.claude.com/docs/en/hooks (read 2026-11-03) → an `async: true` hook's output is "delivered on the next conversation turn", so a same-turn note has to be synchronous; PostToolUse `additionalContext` is "added to Claude's context alongside the tool result".
- **The cost of the wait.** The seat's turn waits for the worker on every in-class ring.
  - checked: the live `C:\Consonance\data\second-reader.jsonl`, 3,214 ok rows → worker time 3.2 s at p10, 7.1 s at p50, 10.3 s at p90, 40.4 s at most.
  - The installer's fixed 10 s hook timeout would cut most notes off. `install.ps1` therefore gains a per-entry `Timeout`: the note hook has 30, every other entry keeps 10.
- **Registration:** the note's file entry and its PostToolUse registration are in `dev/shell/install.ps1`, and its row is in `dream-gate.test.js`'s hand-kept table.

## Tests (PROVE IT)
- **Red first.** EV/tests/d631-red.txt: 5 new D631 tests in `second-reader.test.js` failed, plus the whole note suite (the file did not exist yet).
  - EV/tests/d631-io-red.txt: `install-only.test.js` 47 passed, 1 failed, with the installer's Timeout line reverted (my worktree, restored after).
- **Green:**
  - EV/tests/d631-green1.txt: `second-reader.test.js` + `second-reader-note.test.js` + `dream-gate.test.js` → 47/47, at acbc2a60. After 5faa4014: `second-reader.test.js` 37/0 and the note suite 10/0, run singly and in mutant run 2's control.
  - EV/tests/d631-sg2.txt: `sources-gate.test.js` → 68/68.
  - EV/tests/d631-io1.txt: `install-only.test.js` → 48 passed, 0 failed.
- **Amended tests, by name, each with a comment** (the rule changed: the reader no longer reads an out-of-class ring):
  - `second-reader.test.js`: the `payload` helper appends one in-class sentence to non-empty texts, and `rawPayload` sends text as given. The LOCK test's sha now includes that sentence.
  - `sources-gate.test.js`: "THE SECOND READER STILL FIRES" and "D215 SECOND READER" now send in-class ring texts.
  - Before the amendment, those two were red with the new hook (EV/tests/d631-sg1.txt, 66/68).
- **Mutation.** `consonance/tools/second-reader.mutants.js` was extended with 20 D631 mutants (class, skip, tool_use_id, and the note's gates, bounds and render). One D203 anchor moved because the busy row carries `toolUseId`; I updated it.
  - Run 1 (EV/tests/mutants-run1.out): control 46/0; **applied 58 / caught 56 / NOT APPLIED 0**. Two survived, each a test gap:
    - **42**, "numbers inside paths, shas, dates and ids count as figures": no test paired an attribution word with digits that sit only inside a path or sha. Added "D631 CLASS: an attributed sentence whose only digits are inside a path, a :line and a sha is OUT of the class".
    - **49**, "another ring's row is shown": my test's other id, `toolu_other`, failed the ledger's substring pre-filter, so the exact-id check was never reached. The other id is now `toolu_n2`, which contains `toolu_n`.
  - Run 2, clean, with both test changes (EV/tests/mutants-run2.out): control 47/0 (second-reader.test.js 37, note 10); **applied 58 / caught 58 / NOT APPLIED 0**.
  - Both test changes are in 5faa4014, along with the harness. The hook code is unchanged since acbc2a60, so the replay ran on the same `classify`.
  - Both runs were at BelowNormal, hidden, under the heavy-run lock the harness takes itself.
- **Not covered by any test:** the race where the worker writes its row and releases the lock between the note's two reads. The code re-reads the ledger before its grace exit, but no deterministic test reaches that window.

## The replay (c)
**Registration.** The class was committed at acbc2a60 before it met either sample. I wrote it from the ruling's words, but I had scored the 80 in D627 and knew the 8 error rows, so it is not blind to them; the out-of-sample run is.

**In sample.** My D627 80, the seeded flagged-row sample, seed 20261103.
- checked: `node EV/replay80.js <D627 evidence> <worktree>/consonance/hooks/second-reader.js` → EV/replay80.out.txt.
  - rows 80; in class 77 (status 50, relayed figure 27); skipped 3.
  - Real errors 8, all in class: 0305, 0493, 1109, 1153, 1562, 2475, 3017, 3057.
  - NO-ERROR rows: 69 in class, 3 skipped.
  - `call_chair` 53 of 53 in class; `call_librarian` 24 of 27.

**Out of sample.** A simple random sample of 80 ok rows, flagged or not, from the same first 3,364 ledger rows, seed 631.
- checked: `node EV/oos/sampleAll.js 631` → population 3,148 ok rows, 39 flagged in the sample.
- checked: `EV/oos/run.js` (extract.js under the lock) → rows 80, found 80, shaExact 80.
- checked: the classification → EV/replay-oos.out.jsonl.
  - In class 67, skipped 13.
  - `call_chair` 33 of 34 in class; `call_librarian` 34 of 46.
  - Flagged and in class (a note would show): 35.
- The ring texts are not committed; `EV/oos/sample80.ids.jsonl` holds line, session and sha, and extract.js rebuilds the texts from the transcripts.

**inferred:** "still catches" here means the trigger still sends the error ring to the model. With the prompt unchanged, I assume the model's flags on those rings would be the ones the ledger recorded. That was not re-run (no model calls).

**Post-hoc alternatives on the same 80** (NOT registered).
- checked: `node EV/variants.js <D627 evidence>` → EV/variants.out.txt.

| trigger | calls of 80 | saved | real errors kept |
|---|---|---|---|
| registered class (a) | 77 | 3 | 8 of 8 |
| `call_chair` only | 53 | 27 | 8 of 8 |
| the ruling's phrases only ("all green", "still runs", "refuses") | 6 | 74 | 2 of 8 (2475, 3057) |
| ring over 1,500 characters | 10 | 70 | 2 of 8 (1153, 3057) |

- Out of sample, `call_chair` only would call 34 of 80.
- Before choosing `call_chair`: it would also put the note only in the librarian's turns, never a pane's, and a pane's own relayed figures would go unread.
- My stake: I built (a) and scored D627, so I would like (a) to look useful. It does not, and the table says so.

## Corrections
- A heredoc in Git Bash dropped the backslashes from my install.ps1 edit script. It threw before writing anything, and I made the edit with the Edit tool instead.
- `EV/oos/extract.js` differs from D627's in one guard: an unflagged row is matched by exact sha only, never by the quote fallback, which with no flags matched any ring.

## Not done
- Nothing installed or pushed. The plan's landing pane merges onto `d628-o`, and the restart swaps the copies.
- To land, the install needs `-Only second-reader.js,second-reader-worker.js,second-reader-note.js`, and the new `Timeout` path in install.ps1 runs.

SOURCES: the chair's D631 dispatch; plan_room_fixes_2_5_2026-11-03.md at 6fa5aa26; consonance/hooks/second-reader.js, second-reader-worker.js, findings-return.js, second-reader.test.js, sources-gate.test.js, dream-gate.test.js; consonance/tools/install-only.test.js, second-reader.mutants.js, heavy-run.js; dev/shell/install.ps1; code.claude.com/docs/en/hooks; C:\Consonance\data\second-reader.jsonl; p-d627-p1-flags-P_2026-11-03_evidence (table.md, rows/, sample.js, extract.js); EV/*
NEXT: librarian check acbc2a60 and rule (a) as registered vs call_chair only when this ring lands; the landing pane merges d631-p onto d628-o after that ruling
