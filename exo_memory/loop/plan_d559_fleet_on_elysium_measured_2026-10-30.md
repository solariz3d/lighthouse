# D559: every T-180 on ELYSIUM, measured from the keeper's replays. Librarian, 2026-10-30 16:5x

The keeper, 16:54: "going to test every t-180 on elysium and save the replay". D551 compared the 27 cars from their data files and found three groups on the unsafe side of the checker's Mach 6 numbers (nine actives bottom sooner; the Proto Mach 4 has 160 N per m/s of suction; the Mach 5s none). No replay of any car but the Mach 6 existed on a track of ours (checked 16:49: six replays, Content Manager's log to 10-12, Mach 6 and Mach 6 active only). He is driving them now. **While he drives: nothing launches a window, nothing touches the game folder, every run BelowNormal** (the standing rules; he races).

## Part 1 (pane O, CHECK IT: measurement only), when the replays are on disk

Input: every new `.acreplay` in `Documents\Assetto Corsa\replay` whose name carries `t180b_elysium` and a date after 16:54 today; the car is the folder name in the file name. Reference: the Mach 6's ELYSIUM replay of 2026-10-17 09:30 (44 MB, the full-speed laps D341 read) and, for the active, D544's CRAZY TEST figures.

Per replay, the D515/D544 rig unchanged (O's tools: loads, bottoming, boxdepth, speed, jump_flight; the car's data from D551's unpack in `S\d551\cars\`): the load bands and the suspension height's plateau (the stop, in g), the frames with the box under the mesh and from what load (the chassis line), time at or over 55 g and the longest unbroken run, the peak load, lift-off frames above 300 km/h with load under 0 g and the worst, the line-predicted load against the measured at the ten highest peaks, and the lap's speed trace on the same stretches as the Mach 6's. Same road: ELYSIUM's export has not changed since D341 (O checks the kn5 hash against the 10-17 replay's track first, as D544 §0 did).

Output, `p-d559-fleet-O_2026-10-30.md`: one row per car driven, the Mach 6 row first; each profile constant (`limits.js` MACH6: suspensionStopG 25, chassisG 40, sustainedG 55 / 0.5 s, provenG 90, the ray's 200 N per m/s) against the car's measured value, marked holds / does not hold / not reached in this replay. A car he did not drive to the load a line needs is "not reached", never extrapolated. Labels: the C-numbers from D551's key in the repo copy; the page for him carries the names.

From me: the D551 page gains a "measured" column per car and the call is re-put to him with numbers: which cars need their own profile, which are the Mach 6.

Tier check it. One hand-back. Falsifier: if the cars D551 marked unsafe measure inside the Mach 6's own run-to-run scatter (D515 §4's bands) on every line, the data-file comparison over-read the files and the single profile stands; if any measures outside, that car's row is its profile, pending his word on the Settings picker.

surfaced: p-d551-cars-O (groups C, E, F; the key), p-d544-active-O §0 (the same-road check) and the table, D515 bands.txt, limits.js MACH6, the replay folder.
