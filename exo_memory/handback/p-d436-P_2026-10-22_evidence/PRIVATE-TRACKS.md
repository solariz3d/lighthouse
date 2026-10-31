# The keeper's track is NOT in this folder on the repository

D436 worked on copies of the keeper's private save, taken read-only from his tracks folder and kept in this pane's scratchpad only (the repository is public):

- eq-TEST 10.t180track (09:25 save) sha256 956b33fc268873337d34d607c8d1d19c3684a12d5e5e9dcd9ea07327ac1cd363 (35,876 B) -> scratchpad `d436/save/eq-TEST10-0925.t180track`
- eq-TEST 10.t180undo sha256 c1a0c5fd8c8bc02231ce9022afdb1d3168e0ef4a05e77c381a7904fa8b0b480c -> `d436/save/eq-TEST10-0925.t180undo` (its past[21] is the open 20-piece lap, written to `save/open-past21.t180track`)
- the Finish re-runs `save/finish-6261a22.t180track` and `save/finish-b6969da.t180track`, and the two exports `out413/` (6261a22) and `out414/` (b6969da), are derived from it and stay there too
  (kn5 sha256: 6261a22 4d81c5d1ab3612450208b5b6d7d2c50ac41a04ca20d8147d4b2ca9200c3472d2).

The scripts here take the tree, the save and the kn5 as arguments; run them against those scratchpad paths (or any copy of the save) to reproduce every figure in the hand-back.
