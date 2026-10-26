# D471: the keeper drove TEST 10 and it is "still broken exactly the same". The car drove an export made before the fixes. Librarian, 2026-10-26

The keeper, 06:57: "nope its still broken exactly the same way it was … I saved a new replay, if you watch the telemetry relative to the track, you can see what it does to my car when I fly off the track, still the same bump same area from the screenshots, I did TEST 10"

## What is on disk, checked by the librarian at 06:58–07:05 local

- The replay: `%USERPROFILE%\Documents\Assetto Corsa\replay\ohyeah2389_t180_mach6_t180b_test_10__261026-065645.acreplay`, 25,551,769 B, written 06:56:47.
- The track AC loaded: `G:\SteamLibrary\steamapps\common\assettocorsa\content\tracks\t180b_test_10\`. Every file in it, the kn5 included (59,332,189 B), was written **2026-10-25 15:43:59 local**. Its `.t180b-builder.json` says `"written": "2026-10-25T21:43:56.787Z"` and geometry `sha256:1067d109…243a`. That is before D460 (the fins fix) and D459's ease were built. **No export was made today.**
- The installed builder: `%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe`, written 2026-10-24 21:04, sha256 `16dcfb9b7ecf25176b761f3068949e0acd6cffc6d59963e8b4d097b64f4a1081`, ProductVersion field "0.4.9". **It is not 0.4.21** (the release asset is the installer, sha256 a8eb9e0a…a763, so the exe needs its own compare after install). Not running at 07:00.
- The saved `eq-TEST 10.t180track` was last written 2026-10-22; no save today.
- inferred: 0.4.20/0.4.21 never reached his machine, so Smooth ramps did not exist in his menu and the export he drove carries the fin at s 3,700. My instructions said "install 0.4.21" and nothing checked that it happened. That is my miss, not his.

## The plan: two parts, run in parallel

**Part 1, pane C (prove it, read-only): where the replay kicks the car, against the old and new geometry.**
- Read the new replay with D433's reader (`plan_d433_test10_flyoff_2026-10-22.md` :14–17, `rp.js`): s along the AI line, offset, height above the road, speed, and the frame where the car leaves the road.
- Map that s onto the OLD export (the kn5 above, findFins/vertical cuts as in D459 3a) and onto a fresh 0.4.21 + Smooth ramps build of TEST 10 (part 2's export, or C's own headless build from tag v0.4.21).
- The question it answers: is the kick at the fin 0.4.20 removed (s ≈ 3,700, p10|p11), and is the road at that s clean in 0.4.21? If the kick is anywhere else, or 0.4.21's road there still steps, say so plainly — that would mean the fix missed what he feels.
- Hand-back: the s and frame of the kick, the old road's step there in mm, the new road's step there, with the commands.

**Part 2, pane A (prove it: install): put 0.4.21 on his machine and a fresh TEST 10 export beside the old one.**
- Install 0.4.21 by the standing rule: builder closed (check first), `.before-0.4.21` backup of the current exe, the installer's sha256 equal to a8eb9e0a344d5beb8b8b6efdc3768e95590ab67935e39bf5236aac6f2a48a763 before running it, silent install, no focus stolen, then the installed exe's version and sha256 recorded.
- Export TEST 10 headless with the v0.4.21 tree: open a COPY of `eq-TEST 10.t180track`, run Smooth ramps on it in memory, export into a **new** AC folder `t180b_test_10_0421` (name shown in AC as "TEST 10 0.4.21"). Never write over `t180b_test_10` or anything in his tracks folder. The export must pass its own FINS refusal.
- Hand-back: install proof, the new folder's file list and geometry sha256, the export's fin count.

## After both are back
The librarian collates, then tells the keeper in plain words which track to pick in AC. If part 1 shows the new road is still wrong at his spot, that becomes the lap instead, and he is not asked to drive until a measurement says it is fixed.

NEXT: chair dispatch part 1 to C and part 2 to A now; librarian collates when both hand-backs are in.

## Amendment, 07:03: the keeper's word changes part 2's target

The keeper, 07:03: "well make sure the correct TEST 10 is test 10 idc if its overwritten they are all test tracks anyway"

- Part 2 now exports into **`t180b_test_10` itself**, so "TEST 10" in AC is the fixed one. No `_0421` folder.
- First, A copies the old folder whole to `t180b_test_10.before-d471` (outside AC's tracks folder, e.g. A's scratch on G:), with a file count and the kn5's sha256 compared. This keeps it reversible, and **C reads the OLD road from that copy**, not from the live folder.
- His saved `eq-TEST 10.t180track` (the source of t180b_test_10; `eq-TEST TRACK 10` is a different track and is not touched) is also saved with Smooth ramps applied, so the builder opens the same track he drives. A backs up the file first as `eq-TEST 10.t180track.before-d471`, beside it, with a sha256 compare. The .t180undo is left alone.
- The rest of part 2 is unchanged: 0.4.21 install by the standing rule, the export's own FINS refusal must pass.
