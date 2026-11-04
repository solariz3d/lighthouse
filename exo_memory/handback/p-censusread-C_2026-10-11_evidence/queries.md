# D301 wave 4: queries, written BEFORE any search ran (B's A2.1). Pane C, 2026-10-11.

Each query is a literal phrase that states the corrected fact, taken from the correction and never from the erring claim's wording of the wrong thing. "Two bounds" means the search runs at both `sha_before_t_err_committer_date` and `sha_before_correction` (the librarian's note 2), applied to the units whose t_err is day-start.

## Lookup units (the correction cites no path, or cites only its own file)
| unit | queries (≤ 3) | bounds |
|---|---|---|
| W010 | `SleepInProgress` · `BugcheckCode 59` · `power lost while the machine was asleep` | one (located) |
| W016 | `104,857,600` · `100 MiB` | two |
| W018 | `C had already logged in` | two |
| W019 | `6 hooks fired` · `settings ARE the user file` | two |
| W020 | `03:22:23` | two |
| W023 | `Solid` (hits judged for an answer to Solid dated 09-23) | two |
| W026 | `stage-2 coder` · `stage 2 coder` · `stage-2 code` (hits judged for B as the coder) | two |
| W028 | `92 journals` | two |
| W029 | `114 daily digests` · `06-10 is missing` | two |
| W033 | `55 / 65 / 95` · `55/65/95` | two |
| W034 | `FRICTION=0.82` · `FRICTION = 0.82` · `tyre grip` (the only cited path is the design doc that carries the correction itself) | one (located) |
| W036 | `corpus.corners` · `runs are fragments` | two |
| W038 | `ctx() is null` · `p-d195-E-lag` | two |
| W041 | `public community track` · `a track in the community` · `D262 CANCELLED` | one (located) |
| W042 (= S29, counted once) | `public community track` · `a track in the community` · `D262 CANCELLED` | one (located) |
| W047 | **none**: the corrected fact is an absence ("whether a pane uses it is unmeasured"), and no literal phrase states an absence. Recorded as not found. | — |
| W051 | `unconfirmed` (hits judged for the chip's declared states including `waiting`) | two |
| W064 | `os.getenv('HOME')` · `os.getenv("HOME")` (the only cited path is the handoff that carried the claim) | two |
| W080 | `replay artifact` | one (located) |
| W082 | `was mid-turn` | two |
| W084 (WRONG 96) | `4 of 4 committee cwds exist` | one (located) |
| W085 (WRONG 97) | `just use the repo` | one (located) |
| W091 | `whether or not it were true` · `ASK-008` · `the truth as well cannot lose` | two |
| W096 | `357,388` | one (located) |
| W097 | `phase noise` · `±0.04` | one (located) |

## Step 3 phrases for units whose correction cites a tracked path (the path's text at the sha)
| unit | path | phrase | bounds |
|---|---|---|---|
| W007 | consonance/src-tauri/src/main.rs | `SHELL_SOFT_CEILING: usize = 140_000` | one |
| W030 | exo_memory/ASK.md | `2026-09-20` · `2026-09-24` | two |
| W039 | exo_memory/loop/plan_q3_agreement_2026-09-27.md | `0.125` | one |
| W045 | exo_memory/librarian/2026-08-22.md | `1,995,532` | two |
| W050 | consonance/src-tauri/src/main.rs | `windowed` | two |
| W060 | consonance/src-tauri/brief/COMMITTEE.md | `Nothing is pushed by a seat` | one |
| W073 (WRONG 90) | the state manifest (`state-manifest.json`) | `pre-sync` | one |
| W078 | consonance/tools/board-audit.js | `tell` | one |
| W079 (WRONG 91) | consonance/tools/chain-status.js | `in sync?` | one |
| W086 (WRONG 98) | consonance/src-tauri/src/mcp.rs | `127.0.0.1:0` | one |
| W087 (WRONG 99) | consonance/src-tauri/src/main.rs | `fn resume_pane` (then the function is read for whether it passes `--resume`) | one |
| T1 | exo_memory/handback/p-heavyrunmut-B_2026-10-11.md | `#16` · `#30` (at 700128c8^, the librarian's corrected t_err) | one |
| T2 | exo_memory/map/A.md | `public community track` | one |

## Datability checks (is the evidence's input in git at t_err?)
- W011: is the ledger C replayed (`lap.jsonl`) tracked?
- W028: are the journal `.bak` copies tracked?
- W029: are the daily digests tracked?
- W044: are the run2 trial transcripts tracked?
- W053: is `loop/run1/items/` tracked?
