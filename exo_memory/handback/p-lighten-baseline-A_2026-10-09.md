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
