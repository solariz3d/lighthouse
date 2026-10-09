# p-lighten-baseline-A — D277 part 4, the baseline frozen, seat A, 2026-10-09

Measure and stage only. Written: `exo_memory/loop/lighten_baseline_2026-10-09.md` (every number with its command), `exo_memory/loop/lighten_baseline_2026-10-09_evidence/` (scripts and outputs), this hand-back, my map line.
No file that existed before this lap was changed. Frozen at ledger cut 2026-10-09T17:27:07Z.

- **(a) 21 of 202 paperwork refusals (10.4%) were followed by a re-send that blurred or removed a specific**; 8 (4.0%) fixed a claim; 78 (38.6%) changed content. E's 10.0% was 20 of 201; one new reply-slot pair (2026-10-09T17:20Z) is labelled CLAIM-DROP by me alone (9.9% if it is META instead).
  **Hole: once the gates warn instead of refuse there are no refusal→re-send pairs, so (a) has no "after"** unless one paperwork gate keeps refusing, or the quantity changes (for example specifics per accepted hand-off, no baseline built).
- **(c) Round time, last 7 days: median 10.3 min (IQR 4.0–37.3, n=237)**; since the reply slot went live 11.9. The D276 script plus `--until` reproduces D276's numbers exactly when cut at D276's last row. Multi-pane share swung 38% → 82% inside the week, so read the "after" beside it.
- **(b) Registered, NOT armed.** Registration `remeasure_registration_2026-10-03.md` is committed (`55f185fe`); no timer exists (`schtasks` shows only Dream Cycle and Second Vantage). **Window: 2026-10-03T11:55:00Z → 2026-10-10T11:55:00Z** (the ≥100-message condition is already met, 3,305). Someone must dispatch it after that.
  Valid as H3's "before" only if the change stays off until the window closes.
  - **Defect found:** the sealed `frame.js` reads each transcript as one string; the chair's is 549,537,160 bytes (limit 536,870,888), so the script prints the chair as zeros with no error. `EV/frame_chunked.js` keeps the rule and reproduces all 60 cells of the registration's table; window to now: 3,305 messages (chair 338), D only.
  - **Missing:** the sample draw/extract/assign script (written on the laptop on 09-27, not in the repo, `C:\Consonance\retrieval\l119\` absent on D). Rules are in `p-l119-sample-A_2026-09-27.md`; it must be rebuilt on the chunked reader.
  - Harness tests pass (asof 19, claimrec 17, units 14, score_q3 25). `claude` CLI is now 2.1.292 (was 2.1.283 at R19).
- **(d) UNMEASURED.** A question, a reading procedure and a judge tool exist; the one run's primary test came back NOT TESTED (1 positive of 80), only inter-reader agreement held (κ 0.806). Nothing counts composition misses per period; "60 of 75" is from an outside experiment.

Does not establish: that these before-numbers are the right comparison for a later change (volume, CLI and dispatch pattern drift); that the blur label on the one new pair is right; that the staged (b) harness runs end to end (the draw script and the verification step were not run).

NEXT: librarian decide (1) how (a) gets an "after" under WARN, (2) who rebuilds the draw script from the rules on the chunked reader before 2026-10-10T11:55Z, and (3) who dispatches (b) once the window closes

## Measure (b), done: the chunked frame, the rebuilt draw script, and the re-measure armed (chair's follow-up, same day)

Branch `remeasure-b-a`, worktree `C:\Users\nname\Desktop\worktrees\a-rm-wt`, from main `35abc3cf`; two commits, named paths, local, **not pushed**:
`6f51fc67` (the harness) and `ab85508e` (the runbook). Files under `exo_memory/loop/`: `claimrec/frame.js`, `claimrec/frame.test.js`, `claimrec/draw.js`, `claimrec/draw.test.js`, `claimrec/located24.cited.json`, `remeasure_runbook_2026-10-10.md`.
Supersedes the baseline file's :56-66 (the defect and the missing script) and the `EV/frame_chunked.js` bypass.

1. **The chunked frame is in the harness.** `claimrec/frame.js` is the sealed membership rule copied unchanged, read in 1 MiB chunks. `frame.test.js` (10 pass): the 60-cell reproduction of the registration's table, with the chair, plus synthetic rows
   (chunk edges, a 540 MB file where the sealed whole-file read throws, the 199/200 boundary, each block kind, rows adding up, the window being [from, to), the machine marker, real-prompt detection, a missing seat reported as missing). **13 of 13 mutants caught.**
2. **The draw/extract/assign script is rebuilt** (`claimrec/draw.js`), from the sealed text and my `p-l119-sample-A_2026-09-27.md` §2–§3. `draw.test.js` (17 pass). 18 of 20 mutants caught; the 2 survivors are equivalent (B and C return before the overlap check; an assistant row cannot sit on a prompt line).
   **It reproduces L119's draw on the original window, which is on this machine's transcripts after all:** frame 5,023; 43 excluded (20 librarian, 23 B) by the 24 cited turns; eligible 4,980; seat split 31/17/14/14/14/10; and `drawn_ids.txt` sha256
   `23282ca2a1578fa25db5810cd6c801179aae1d618210beaca66cb7a0b4054a45`, **identical to the recorded value** (`node exo_memory/loop/claimrec/draw.js draw --window original --out <dir> --cited exo_memory/loop/claimrec/located24.cited.json`).
   So the frame membership, the turn rule (reconstructed: D160's definition was on a script not on this machine), the seed and the order are right. **What I could not check:** `key/rules.md` (sha256 `e73c075c…`) is not on this machine, so I wrote the rules into `draw.js`'s header instead of matching its bytes;
   the extraction text could not be compared with L119's replies (not on disk), so the L115 format and the echo/printf regex are reconstructions; the assignment was tested on the sealed rules with synthetic ids (the original 193/164/57 split depended on the reader's statements, which are an LLM's output and do not reproduce).
3. **The re-measure is armed in the sense of runnable and guarded, not self-firing.** The exact commands, the window (**2026-10-03T11:55:00Z to 2026-10-10T11:55:00Z**) and the caveats are in `exo_memory/loop/remeasure_runbook_2026-10-10.md`.
   `draw.js draw --window remeasure` **refuses until 11:55:00Z on 10-10** (exits 2, writes nothing; run at 2026-10-09T17:52Z, and a test pins it to the millisecond). Counts-only today: 3,366 eligible messages (librarian 686, chair 342, A 774, B 581, C 401, E 582).
   **Nothing will fire it**: someone runs steps 1–5 after 11:55Z. I did not create a scheduled task (a persistent change outside the repo); say if you want one.
4. **New finding from the rehearsal: the reader's model changed.** I ran the real chain on two original-window replies (readers → packets → assign; clean). The readers ran on **`claude-sonnet-5-5`**, the CLI's default today; L119 ran on **`claude-opus-5-5`** (`p-l119-sample-A` §4).
   Unpinned, the extractor would differ between "before" and "after" along with the room. `CLAIMREC_MODEL=claude-opus-5-5` pins it; one pinned call checked (model `claude-opus-5-5`, exit 0). It is the first step 3 in the runbook. CLI 2.1.292 (2.1.283 at L119).
5. **Checks:** `portable-paths.js` green (0 new), `carrier-drift.js` GREEN on the branch. The branch files are the only new ones; nothing existing changed. The baseline file and its evidence folder in the main checkout are still uncommitted; they are not on this branch.

Does not establish: that B's and C's lookups run end to end on `assign`'s verifier files (no verifier ran); anything about the real 100 (not drawn); that the extraction matches L119's text.

NEXT: librarian land remeasure-b-a (6f51fc67, ab85508e), and dispatch runbook steps 1 to 5 after 2026-10-10T11:55:00Z
