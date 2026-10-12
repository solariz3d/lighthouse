# F3 offline, the 9 RM units: top 5 contains the answer?

Q1 (the arm, the turn's prompt): **0 of 9**. Q2 (secondary, the reply paragraph holding the claim): **2 of 9**. Q1 on the newest commit anywhere in main's history (where it differs): **0 of 9**.

| unit | prompt (UTC) | claim in turn | commit (C's bound) | answer in record | Q1 hit@5 | Q1 first answer rank | Q1 answer file in top 5 | newest-anywhere commit: Q1 rank | Q2 hit@5 | Q2 rank |
|---|---|---|---|---|---|---|---|---|---|---|
| W007 | 2026-09-16T15:30:54.543Z | yes | d5d954d3 (d5d954d3) | yes | no | >100 | no | same commit | no | >100 |
| W030 | 2026-09-27T17:22:30.991Z | yes | 514c28ae (b214e3a3 and c6d16e82) | yes | no | >100 | no | same commit | yes | 3 |
| W039 | 2026-10-01T09:51:40.450Z | yes | f239387c (f239387c) | yes | no | >100 | no | same commit | no | >100 |
| W050 | 2026-09-01T13:36:20.634Z | yes | 5bfcde90 (9c6a1311 (tree)) | yes | no | >100 | no | same commit | no | 27 |
| W078 | 2026-09-09T06:12:59.213Z | yes | e527582b (e527582b) | yes | no | >100 | no | d61ff6ab: >100 | yes | 5 |
| W085 | 2026-09-11T08:12:35.026Z | yes | 397e29c5 (ec884940) | yes | no | >100 | no | same commit | no | 7 |
| W091 | 2026-09-14T07:14:25.661Z | yes | e3b582f6 (25a2b1eb and 12193866) | yes | no | 40 | no | same commit | no | 20 |
| T1 | 2026-10-11T20:36:24.259Z | yes | a0ee8d16 (700128c8^) | yes | no | >100 | no | same commit | no | 25 |
| T2 | 2026-10-11T23:52:08.252Z | yes | 83188cb1 (83188cb1) | yes | no | >100 | no | same commit | no | >100 |

## Q1 top 5 per unit
- **W007** (6 query terms; arm text matches: yes)
  - consonance/src-tauri/src/cochlea.rs:2841-2880 (14.716)
  - consonance/src-tauri/src/cochlea.rs:2821-2860 (14.665)
  - consonance/src-tauri/brief/COMMITTEE.md:141-180 (12.043)
  - consonance/src-tauri/src/cochlea.rs:1001-1040 (11.883)
  - consonance/tools/ask.test.js:61-100 (11.673)
- **W030** (6 query terms; arm text matches: yes)
  - consonance/tools/curate.js:121-160 (13.271)
  - exo_memory/loop/pane_battery_idea_2026-09-11.md:1-31 (12.956)
  - exo_memory/loop/codex_port_idea_2026-09-08.md:1-40 (12.872)
  - exo_memory/attic/the_night_skeleton.md:1061-1100 (11.817)
  - exo_memory/attic/the_night_skeleton.md:1201-1240 (11.573)
- **W039** (9 query terms; arm text matches: yes)
  - exo_memory/loop/retrieval_collation_2026-09-21.md:381-420 (20.005)
  - jev/README.md:1-40 (19.799)
  - jev/README.md:21-60 (19.364)
  - exo_memory/handback/p-d107-pacing-A_2026-09-22.md:1-40 (18.79)
  - exo_memory/handback/p-d125-readme-E_2026-09-23.md:1-40 (18.4)
- **W050** (1 query terms; arm text matches: yes)
  - consonance/tools/actors.js:141-180 (9.821)
  - consonance/tools/actors.js:121-160 (8.834)
- **W078** (1 query terms; arm text matches: yes)
  - consonance/tools/chain-status.js:621-660 (3.43)
  - consonance/ui/chain-indicator.test.js:401-440 (3.42)
  - consonance/tools/commit-gate.test.js:61-100 (3.411)
  - consonance/ui/chain-indicator.test.js:321-360 (3.362)
  - consonance/src-tauri/brief/BUILDING.md:341-380 (3.333)
- **W085** (124 query terms; arm text matches: yes)
  - exo_memory/loop/chair_wake_2026-09-11.md:1-40 (222.382)
  - exo_memory/loop/chair_wake_2026-09-11.md:21-60 (177.502)
  - exo_memory/loop/chair_wake_2026-09-11.md:41-80 (161.599)
  - exo_memory/loop/chair_wake_2026-09-11.md:61-93 (153.405)
  - exo_memory/librarian/2026-09-11.md:1-26 (149.203)
- **W091** (72 query terms; arm text matches: yes)
  - essay/recognition/contaminated_2026-09-09/recog_cold1.md:1-25 (73.051)
  - essay/recognition/contaminated_2026-09-09/recog_primed3.md:1-39 (71.733)
  - essay/MANUSCRIPT.html:81-120 (68.953)
  - exo_memory/journal/2026-07-12.md:41-62 (65.844)
  - dev/live/adversarial_l3.py:61-94 (65.782)
- **T1** (88 query terms; arm text matches: yes)
  - exo_memory/handback/p-rusttemp-A_2026-10-11.md:1-35 (131.318)
  - exo_memory/loop/qs2s_units_v2_2026-10-03.md:1261-1300 (96.231)
  - exo_memory/handback/p-verify-B_2026-10-10_evidence/d277v/turns/76.txt:1-40 (96.048)
  - exo_memory/loop/plan_claim_first_titles_d299_2026-10-11.md:1-33 (91.867)
  - exo_memory/map/A.md:1881-1914 (90.984)
- **T2** (58 query terms; arm text matches: yes)
  - exo_memory/handback/p-verify-B_2026-10-10_evidence/d277v/turns/62.txt:1-40 (148.239)
  - exo_memory/handback/p-verify-B_2026-10-10_evidence/d277v/turns/49.txt:1-40 (139.624)
  - exo_memory/handback/p-verify-B_2026-10-10_evidence/d277v/turns/70.txt:1-21 (138.984)
  - exo_memory/handback/p-verify-B_2026-10-10_evidence/d277v/turns/04.txt:1-40 (134.531)
  - exo_memory/handback/p-verify-B_2026-10-10_evidence/d277v/turns/61.txt:1-28 (132.176)
