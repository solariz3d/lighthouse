# The keeper's track is NOT in this folder on the repository

D459 part 3b read the same copy of his save as part 1 (`eq-TEST 10.t180track`, sha256 956b33fc…, scratchpad `d459/save/`), and wrote beside it a RE-EASED copy,
`d459/save/eq-TEST10-quintic.t180track` (requintic.js: 13 channels of 9 pieces refitted from the quintic), which stays in the scratchpad too, with the two
exports made from them (`d459/out459-base/`, `d459/out459-quintic/`; only their logs are here, as ambers-*.log). The private closer fixtures (`fixtures-d431/`,
TEST 10's and TEST TRACK 10's open laps) were copied from an older worktree into `t180-wt-p459/fixtures-d431/` for core_finish_joints rows 1–4; untracked,
never named in a commit, and `git status` shows them as the one untracked path.

The scripts take the tree and the save as arguments; `core_joint_c2.test.js` is the test as committed (t180 eba08f4), runnable anywhere with `T180_TREE=<tree>`.
