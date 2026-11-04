# The keeper's track is NOT in this folder on the repository

D459 worked on a copy of the keeper's private save, taken read-only from his tracks folder and kept in this pane's scratchpad only (the repository is public):

- `%APPDATA%\com.solariz3d.t180-track-builder\tracks\eq-TEST 10.t180track` (dated 2026-10-22 09:25, the same bytes D436 measured) sha256 956b33fc268873337d34d607c8d1d19c3684a12d5e5e9dcd9ea07327ac1cd363 (35,876 B)
  -> scratchpad `d459/save/eq-TEST10.t180track` (the copy's sha256 the same; his tracks folder and Assetto Corsa's content folder were read and never written)
- the export of that copy at local-0.4.19 (c965f5e): scratchpad `d459/out419/t180b_test_10/t180b_test_10.kn5`, sha256 4d81c5d1ab3612450208b5b6d7d2c50ac41a04ca20d8147d4b2ca9200c3472d2 (59,332,189 B)
  = the installed `G:\SteamLibrary\steamapps\common\assettocorsa\content\tracks\t180b_test_10\t180b_test_10.kn5` byte for byte (its `.t180b-builder.json` written 2026-10-25T21:43:56Z,
  geometry sha256:1067d109…) = D436's 6261a22 export byte for byte
- the full control-point dump of his document (`channels.out`), the two screenshots and my crop of one (`circle-zoom.png`), and the headless page shots of his lap
  (`page419/p419-*.png`) stay in the scratchpad: `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-372c8abc\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\d459\`

The scripts here take the tree, the save and the kn5 as arguments; run them against those scratchpad paths (or any copy of the save) to reproduce every figure in the hand-back.
`core_joint_c2.test.js` builds its laps from public words and runs anywhere: `T180_TREE=<worktree> node --test core_joint_c2.test.js`, or from `test/` of a tree.
