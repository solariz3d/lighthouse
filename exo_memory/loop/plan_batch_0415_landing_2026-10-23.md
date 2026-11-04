# The next batch (local 0.4.15): landing order (librarian, 2026-10-23 02:2x)

Every part below is accepted by the librarian, and the notes in `exo_memory/librarian/2026-10-18.md` say where. The batch lands on a landing pane named by the chair, not on the chair itself. Tier: prove it.

## What lands (t180 branches, from b6969da unless noted)

| lap | branch @ tip | what |
|---|---|---|
| D432 | d432-e @ 7402479 (b5181e2, 70abb64, c250b22, 7402479) | stacked-within-2m is information unless the roads clip; the clip test signs the rows between stations |
| D435 | d432-e @ 3c870e3 | the low-overhead amber under 1 m |
| D437a | d437a-e @ f2cd310 | typed soup and typed BVH, built once per export |
| D437b | d437b-b @ 74d60c8 | the export runs in a sandboxed iframe's process; an OOM ends with a message naming the stage, and nothing is written |
| D438 Part 1 | d438-c @ 9233a93 | the pit lane is level from leave to rejoin |
| D434 + D438 Part 2 + D439 | d439-o @ cd3dc42 (contains d434-o 681727f and d438-o 7cc2ca4) | Finish banks the closer; the joints are eased; the cup comes home linearly; the roll straight is out of the close; both orders are searched |

Not in this batch: D440 (O, in progress) rides the next one.

## Known merge points

- **CHANGELOG.md:** d432-e and d439-o both open `### Changed` (O, kn5 merges). Keep BOTH entries.
- **src/geom/pitlane.js:** C's 9233a93 and E's f2cd310 merge with 0 conflicts (C checked).
- **src/export/fromwords.js:** only B touched it (onStage). E and D432 did not.

## The landing pane's proof

1. Merge in the order of the table. Name every conflict and how it was resolved.
2. The full suite under the lock. The EXPO rule applies to exitCode 3221225477.
3. Every mutation harness whole, as applied / caught / NOT APPLIED. That includes core-xsec, mutation and core_cup, which B did not re-run after its export.js fallback fix.
4. **ELYSIUM's page Export, headless (`--mute-audio`), on the copy** (`scratchpad\d437\eq-ELYSIUM.t180track`, sha256 3452907a…). Run it through the merged tree with `run-export-437e.js` or B's `run-export-437b.js`, and name the time. Expected: no crash, and with D432 either written or refused only for a real clip. This also covers E's memory-only mutants D5 and D6.
5. Credential scan. Public text gets no "keeper" (`grep -ci keeper` on CHANGELOG and the commit messages = 0).
6. Install only with the builder closed: back up as `.before-local-0.4.15`, then a stamped sha256 compare. No push. Releases stay batched.
7. Owed before any PUBLIC push, not this local landing: reword a519bb9 and 1c640b0 (each says "keeper").

NEXT: chair name a landing pane and route this file to it now; it hands back to the librarian, who gives the all-clear.

## Landing ruled — ALL-CLEAR (librarian, 2026-10-23 ~04:40)

Hand-back `exo_memory/handback/p-d441-landing-A_2026-10-23.md` (git-blob 93c8413d…, 12,729 B), seat A, tip 42d4c2b, tag local-0.4.15.

checked on disk by this seat:
- installed `…\T-180 Track Builder\t180-track-builder.exe` sha256 38ED8673…EE84, 14,955,520 B; backup `.before-local-0.4.15` sha256 DB194F9E…7BE0 (the 0.4.14 install); builder processes 0.
- `local-0.4.15^{commit}` = HEAD = 42d4c2b26b05…; first-parent b6969da..HEAD = the five merges + 42d4c2b; worktree clean.
- `git diff --stat 498e735 42d4c2b` → only the two export-isolated test files, 10+/2−.

**Rulings.**
1. **The pin fix 42d4c2b: accepted.** A test changed because its rule changed: the bisect plus the single-file restore of pitlane.js shows D438's level pit lane moved the bytes on purpose. Its 3-file re-run (24/24, control green, 12/12) stands in for a second full suite, since the change is pin strings only.
2. **release-frame row 4: NOT blocking.** Base b6969da went red in the same bisect window (7.0 / 6.6), so the merges did not cause it. The lead (medians up ~0.5–1 ms from merge 1, D432/D435) becomes a small lap for E: a quiet-judged A/B of b6969da against 5908692. It is not urgent and the keeper can veto it.
3. **sculpt-frame rows 2–3 green under foreign load: accepted.** The load only made the rows harder.
4. **Owed before any PUBLIC push:** reword 63bb388 and 15e4e81 ("The keeper (TEST TRACK 10)"), along with a519bb9 and 1c640b0.
5. A's build tree t180-wt-a441-rel can be removed now; it is A's, and the hashes are recorded above.

## D442 ruled (librarian, 2026-10-23 ~06:24)

E's hand-back is `exo_memory/handback/p-d442-E_2026-10-23.md` §4 (git-blob 766d0baf…, 6,744 B). There were 4 A + 4 B quiet runs, interleaved (pairs 9–12, foreign CPU 0.08–0.66 s a window).

- **The median gives the answer: no cost.** First-attempt medians: A (b6969da) 3.85, B (5908692) 3.95 ms. The 0.5–1 ms lead from A's loud bisect does not hold when the machine is quiet.
- **The tail: no 8 more pairs owed, and no cut lap. D442 is CLOSED.** Of B's four first p95s, two are high (6.2, 7.6); both fell under the bar on the same run's second measure (5.7, 5.5), and the other two sit inside A's range. The base fails this row too: A's bisect window had 7.0 / 6.6, and rf-quiet.txt's first loud A try had 6.8 / 6.2. So the row sits at its 6.0 ms bar on this machine whichever version runs; that is not a merge cost.
- If row 4 goes red again in a quiet window at a landing, the cheaper question is the bar itself (its margin on this machine). That gets asked then, not now.
- The second unlocked probe in E's loud windows was P's `leanout440b.js` (pid 36820). P's slot correction (D440 review §3) covers it.
