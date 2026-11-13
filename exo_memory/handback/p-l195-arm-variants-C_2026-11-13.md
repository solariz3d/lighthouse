# p-l195-arm-variants-C: the hunter's arms, three variants for his pick (L195, his item 180)

Pane C (seat 0845a868), 2026-11-13. The packet: the chair's 09:21:59Z. Branch `l195-arm-variants` in
`Downloads\dreamzone-3-c-l170`, off main 04f3882. Touched `game/model_rig.h`, `game/model_rig.cpp` and
`game/tests/model_rig_tests.cpp` only. **Nothing is landed: he picks first (step 4).**

His words (item 180, after the L191 clip): "from the video, does look better, but the elbows should be flared out more,
looks like someone with a suboptimal running technique with how they swing their arms, like there needs to be more bend
in the elbow when swinging".

## Step 1: what was read, what each gives, and whether it agrees with him

Each source was read by a subagent into `scratchpad/l195/{otsuka,jssm,jstage}/`. The figures read by eye were re-read by
me where a variant's number rests on them.

| source | status | what it gives |
|---|---|---|
| Otsuka, Ito, Honjo & Isaka 2016, *SpringerPlus* 5, doi 10.1186/s40064-016-2291-5 (PMC4899390) | **read in full**; Fig. 2 read off the figure (638x842, the only size PMC holds) | the arm's stand-off (humerothoracic abduction, Euler X-Y-Z) through the first accelerating step, free condition. Forward arm: 27.9° at contact, a low of 10.9° at ~55%, 18.9° at take-off; **about 13.5° at its flexion peak (+45.6°, 72%; my read, ±1.5)**. Backward arm: 11.0° at contact, a low of 9.1° at 14%, **a high of 29.6° at 76%, about 29° at its extension peak (−50.9°, 84%)**, 27.6° at take-off. The grey SD band is about ±7 to ±12°. **Not sprinters:** 10 sports-active male students (soccer, rugby, basketball, tennis), four 5 m dashes from a standing start, 4.31 m/s at take-off of the first step. The text gives no abduction number; the one humerothoracic number in the text is the extension ROM, 69.4 ± 10.2° (L190's anchor). |
| Lockie, Callaghan & Jeffriess 2014, *J Sports Sci Med* 13(1):128-136 (PMC3918548) | **read in full** from the PMC page (Europe PMC's XML returned 500; the jssm.org "PDF" was an HTML page) | Table 2, 18 club cricketers, the first two steps from a standing start (no speed reported; inferred under ~5.3 m/s, the 0-10 m mean): **lead arm's peak elbow flexion 102.73 (11.59)° at step 1 and 101.34 (10.27)° at step 2; rear arm's most open 45.40 (15.19)° and 52.05 (11.15)°**. The convention is not stated outright; the paper's own reading ("greater elbow flexion" for the larger number, and a rear arm more open than the lead) makes 0° a straight arm. The packet's "rear about 39-54°" is the infielder (38.74) and outfielder (53.73) means at step 1 only. No abduction anywhere in the text. |
| Okajima, Demura, Minami & Miyaguchi 1996, *Supotsu Hohogaku Kenkyu* 9(1):49-56 as printed, filed by J-Stage under the Japan Journal of Coaching Studies, doi 10.24776/jcoaching.9.1_49 | **read in full**, all 8 pages (a scan, decrypted locally; Japanese) | 41 male university sprinters (100 m best 11.43 ± 0.40 s) split by stride length / height into a stride type (ST, n 22) and a pitch type (PT, n 19); filmed 2D at 60 fps over 0-80 m; top speed 9.62 (ST) and 9.75 (PT) m/s. **The two arm styles:** PT "keeps the elbow angle somewhat larger [more open] and swings without changing it much over a cycle"; ST "changes the elbow angle a lot during the back-swing, in step with the shoulder". **The elbow's smallest inside angle per cycle (Fig. 7, read by eye, ±1.5):** ST about 65.5-71° (mean of the 8 sections 68.1, so most bent 111.9°), PT about 70-76° (mean 73.5, so most bent 106.5°). Elbow CV over a cycle ST ~22-23 > PT ~18.6-21 (the abstract and summary print it backwards; the results, the legend and the bars agree on ST > PT). **Neither style was faster**, and no arm variable correlated with speed. Shoulder forward-swing peak about 44-50° after the first section, back-swing peak about 69-76°. No absolute mean or largest elbow angle is reported. |

**Does each agree with him?**
- **The flare: yes.** Otsuka's arm stands off about 13.5° at the front of the swing and about 29° at the back. L191's
  posed arm stood off 10.1° at both ends at a runner's 4 m/s and **9.5° at 10 m/s** (checked: `draw195.js` on L191's own
  dump, `scratchpad/l191/arm_dump.csv`): about a third of the source's at the back. Part of that is L190's extra arm twist
  (kArmTwistShare 1.5, ours), which pulls the arm in at both ends of the swing; 15° was asked.
- **The bend at the front: yes at a runner's speed, already so at the hunter's.** The sprinters' most-bent elbow is
  106.5-111.9° (Okajima), the cricketers' 101-103° (Lockie). L191 posed 76.7° at 4 m/s (the jog case, step 2) and
  109.9° at 10 m/s.
- **The bend at the back: no.** Lockie's rear arm opens to 45-52°, and Bruening's elbow range, extended to the
  hunter's speed from Okajima's front, opens it to about 55°. L191 posed 61.7° at 10 m/s, already more bent than either.
  A floor above that (all three variants) is **OURS, from his word**. The closest sourced style is Okajima's pitch
  type, who hold the elbow steadier with no loss of speed, but their held angle is the more open one, not the more bent.
- **His "suboptimal technique", one more measured thing:** at 10 m/s L191's front hand rises to 1.587 m, 22.8 cm above
  the shoulder and **3.0 cm below the eye** (same check). No source read gives the hand's height; the swing there is
  50.3° forward, inside Okajima's sprinters' 44-50° peak, so the height comes from the bend on top of a sourced swing.

## Step 2: the jog case, fixed (green at daefe40, pushed)

**Red first at 4cc5450** (on 04f3882), the row `at_a_run_the_elbow_holds_the_running_bend_at_mid_swing`. checked:
`scratchpad/l195/red_game.txt` → "F 1.36 (4.04 m/s): the elbow at mid-swing is 63.6 degrees (kElbowMean 90.0)", 169
tests, 1 failed.

It had **two causes**, and the row found the second only after the first was fixed:
1. L191 eased the running shape toward the stand-in's hang by `run = speed / 6` (ours), so at 4.04 m/s it carried two
   thirds of the bend. The shape now comes on between Bruening's fastest walk (F 0.64) and slowest run (F 0.88), both
   read from its Methods ("The tested Froude speeds for walking were 0.32, 0.48, and 0.64, and for running 0.88, 1.12,
   and 1.36"). The smoothstep between them is ours.
2. With that alone the row read **86.2°** (checked: the first run of `jog_game.txt`, line 205). L191 tilted the forearm
   toward the arm's outside on its own, not with the upper arm, so a stand-off opened the elbow:
   acos(cos²15°·cos 90° + sin²15° ) = 86.16°. The elbow's hinge now turns out with the upper arm, and the posed elbow
   angle is the bend asked. **This also mattered for his "more bend":** at V3's flare (about 49° at the back) the old
   construction would have posed a 100° bend as about 60°.

**Green at daefe40.** checked: `scratchpad/l195/jog_game.txt` → 169 tests, 0 failed; mid-swing 90.0°; the elbow's range
at F 1.36 is 27.0° (Bruening's fit 27.0; L191 posed 26.2, the tilt again), 103.5° bent forward and 76.5° back. Pushed:
`l195-arm-variants` daefe40 on origin.

## Step 3: STOPPED at V1, which breaks two landed rows (the packet: "say which and stop")

The variant code is committed with V1 selected at **5ae66b8** (not pushed: red). Run: `scratchpad/l195/var.sh V1` under
heavy-run, built 10:20:51Z. checked: `scratchpad/l195/V1_game.txt` → **169 tests, 2 failed**:

| row (landed) | V1 posed | the law | bar | daefe40 (15° stand-off) |
|---|---|---|---|---|
| `the_arms_swing_through_the_range_runners_were_measured_at`, F 1.36 (`:882`) | 28.4° each way | Bruening's 26.9 | 1.5 | 27.9 |
| `the_arms_swing_further_the_faster_the_body_runs`, 10 m/s (`:794`) | 52.4° each way | 49.3 | 3 | 51.0 |

At F 0.88 and 1.12 the first row still passes (21.1 against 20.1, 24.9 against 23.6). The rows the variant was meant to
change pass as amended: the bend 106.5° at the front and 80.0° at the back (want 106.5 and 80.0); the stand-off 11.0°
at the front and 22.2° at the back, 18.7° on average (the law 15.0, 26.9, 20.9); mid-swing 93.3° (want 93.3).

**The cause, inferred, not checked:** the swing is posed at exactly Bruening's amplitude (`arm_swing_range`), and the row
measures the upper arm's fore-aft angle in the chest's own frame, which is Bruening's sagittal angle under a
flexion-first sequence, so the measurement is the right one. What changes is L190's extra arm twist (kArmTwistShare
1.5, ours): it turns each arm about the vertical by half the thorax's twist against the chest, and that turn carries
part of the stand-off into the chest's fore-aft plane. The leak grows with the stand-off: at 15° it was +1.0° (F 1.36) and
+1.7° (10 m/s); with V1's 27° at the back it is +1.5° and +3.1°. V2 and V3 stand further off and would break them
further. Checkable: re-run V1 with kArmTwistShare 1.0 and see the two rows return within their bars.

**Not done, waiting on a ruling:** V2 and V3, the clips and the contact sheet. V1's capture at his run was let finish
(it changes no source) so the ruling can look at it.

**Ways on, none taken:**
1. **Hold the swing to Bruening as measured:** shorten the posed amplitude by the twist's leak, so the measured fore-aft
   angle is Bruening's whatever the stand-off. The rows stay as they are; the amplitude stops being the law's own number.
2. **Lower kArmTwistShare** (ours, L190; his "Both" in brief 176 asked for the arms to ride more of the twist). It removes
   the leak at its source and changes what he ruled on in L190.
3. **Amend the two rows by name** to measure the swing in the arm's own twisted plane (the twist is ours, not Bruening's
   swing). The rule would change, so this needs his or the chair's word; I will not do it to make a variant pass.

### V1's pictures, for the ruling (added after the ring, 10:35Z)

- checked: `scratchpad/l195/V1_world.txt` → world_app_tests **45/0**; the lean row holds 13 of 24, as before. So the
  stop is the two game_tests swing rows and nothing else.
- checked: `scratchpad/l195/V1.log` → capture-lean exit 0, 192 frames in
  `Downloads\dreamzone-3-l195-arm-variants\after_5ae66b8_V1`, brightened as L191's were (`lutrgb` gamma 0.3; checked
  against an L191 frame re-made the same way: PSNR inf).
- **`Downloads\dreamzone-3-l195-arm-variants\V1_against_L191.png`**: L191 and V1 side by side, each with its measured
  numbers (`draw195.js` on each one's own joint dump), its sources in blue and ours in red, the side and front stills at
  10 m/s, and a frame of the straight and the corner from the following camera.
- **`clips\straight_eased_follow_L191_vs_V1.mp4`** (1.8 MB) and **`clips\corner_eased_follow_L191_vs_V1.mp4`** (3.7 MB).
- V1 at 10 m/s, measured on the posed joints: bent 106.5° at the front and 80° at the back (L191 109.9 and 61.7); the
  stand-off 7.4° at the front and 23.2° at the back (L191 9.5 and 9.5); **the hand's highest point 1.52 m, 9.5 cm under
  the eye** (L191 1.59 m, 3.0 cm under it). The swing reads 50.2° forward and **51.5° back**: the extra is on the back,
  where the stand-off is largest, which fits the inferred cause above without checking it.

### Two faults in the capture, found making these (not in L195's files)

- **The look-back passes do not show the hunter.** `--capture-lean`'s look-behind is the player's own view from the
  replayed run (`offscreen_models.cpp:433`). At the two stretches the run picks, the hunter is not in it: the straight's
  24 frames show an empty corridor, and the corner's 24 show the wall the player turned past. L191's look-back clips had
  the same fault (its corner frame 12 is a wall). Look-back clips that show the arms need a stretch where the hunter is
  close and in view, chosen in the capture tool (world code, not `game/model_rig*`), so they wait on the ruling with V2
  and V3. The sheet uses the following camera for both stretches instead.
- **The following camera still enters walls on the corner:** frames 0, 5-7, 9, 12-19 of the corner pass are in a wall or
  the floor; the hunter is clear in 1-4, 8, 10-11 and 20-23. The sheet shows frame 21. This is L180 lap 2's open fault
  (its frames 12 and 16), wider than it said there.

## Step 3, resumed under the ruling (librarian, 64077ad0): the check, then a conflict the solve cannot meet for V2 and V3

**The check is done, and it confirms the cause.** V1 (5ae66b8) built with kArmTwistShare 1.0 in place of 1.5, the
constant changed only for that build and restored in an exit trap (`scratchpad/l195/check.sh`; checked: its log →
"restored: model_rig.h equals HEAD"). checked: `scratchpad/l195/V1_twist1_game.txt` → 169 tests, 0 failed: the swing at
F 0.88 / 1.12 / 1.36 is 20.1 / 23.6 / 26.9° each way, **exactly Bruening's fit**; the posed stand-off equals the law at
both ends (15.2° front, 26.4° back, against the law's 15.2 and 26.4); the 10 m/s row reads 51.9° (law 49.3, bar 3).

**The conflict, computed before building anything** (the pose's own geometry in node; it reproduces L191's posed
51.0° at 10 m/s from atan2(sin 15°·sin 21.4° + sin 49.3°·cos 15°·cos 21.4°, cos 49.3°·cos 15°)):

The two swing rows measure in **two different frames**:
- `the_arms_swing_through_the_range_runners_were_measured_at` measures against the **chest's** forward: Bruening's own
  frame (the humerus against the thorax). There only the arm's EXTRA turn (share 1.5 less the trunk's 1.0) carries the
  stand-off into the swing.
- `the_arms_swing_further_the_faster_the_body_runs` (L190's, amended at L191) measures in the **heading's** fore-aft plane,
  where the trunk's whole turn counts too (1.5 x the thorax's twist).

Solving the posed amplitude so the chest-frame swing is Bruening's (way 1, as ruled) gives, in the heading's frame:

| | V1 (Otsuka's flare) | V2 (+10°) | V3 (+20°) |
|---|---|---|---|
| chest frame, F 1.36 and 10 m/s | 26.9, 49.3: **exact** | 26.9, 49.3: exact | 26.9, 49.3: exact |
| heading frame, 10 m/s (law 49.3, bar 3) | 50.9 (passes) | **52.6 (over by 3.3)** | **54.5 (over by 5.2)** |

So V1 passes every row under the solve. **V2 and V3 would break L190's heading-frame row**, because their larger flare
is carried into the heading-frame swing by the trunk's own turn, which no solve in Bruening's frame removes. Building
them would be the same stop again, so they are not built until this is ruled. The ways I can see:
1. Measure L190's row against the chest's forward, as the F 1.36 row already does (a rule change of that row: way 3 for
   that one row only, since Bruening's quantity is thorax-relative).
2. Solve in the heading's frame instead: then the chest-frame row (Bruening's own frame) fails for V2 and V3.
3. Build only V1 as the sourced variant, and make V2 and V3 "more flare" without crossing that row's 3°: **+8.25° of
   flare at most** (checked: the same computation, bisected on flare_add until the heading-frame swing is 52.3°; first
   written here as "about +4" before it was computed, and corrected before the ring). So V2 at +8 and V3 no further,
   which may not be the "more" his eye asked for.

**Building now, as ruled:** the solve (way 1), and V1 under it, with the new row that holds the chest-frame property
over the three variants' stand-offs.

### A correction to step 1, from E's yardstick (L193, `p-l193-yardstick-E_2026-11-13.md:117-127`, 0a61af1b)

Step 1 above says **"The bend at the back: no"**, from Lockie's accelerating cricketers (rear arm open to 45-52°) and
Bruening's range extended. E's yardstick measures the elbow's **mean over the whole stride** in CMU's motion-capture
runners at 2.67-4.15 m/s: **103°** (sd 10.4 over 25 clips; the three runners 93, 118 and 108°, sd 12.4 between them),
where main posed 56-58° (`Downloads\dz3-l193-review\table_arms_b90eda9.txt`). A mean of 103° over the stride cannot
come from an arm that opens to 45-52° at the back. So **the steady runners agree with his "more bend" across the
stride**, and the accelerating cricketers are the case that opens. Step 1's "no" holds for Lockie's data only. It
rests on three runners, so it is shown to him on the sheet, not tuned to blind. CMU's swing also sits further back
than ours (-34.4°/+7.8° against main's -22°/+25°); that too goes on the sheet as a number, not into the pose.

## Step 3 done: the three variants, rendered and scored, under the rulings (nothing landed: he picks)

**For his eye:**
- Every variant bends the elbow more than main all through the stride: CMU's runners hold 103° on average and main
  56.5°, where V1 holds 94°, V2 100° and V3 109°, all three inside the runners' spread. V2 is closest.
- The arms stand further off the body the further back they swing (Otsuka's figure): V1 7.7° at the front to 23° at the
  back at 10 m/s, V2 18° to 33°, V3 28° to 43° (main 9.5° at both ends).
- What he sees of the swing at 10 m/s grows with the flare (50.9°, 52.6°, 54.5° each way, main 51.0°); against the chest
  every variant swings exactly Bruening's. The front hand peaks about 10.5 cm below the eye in all three (main 3 cm).

**The runs** (`l195-arm-variants`, all on origin; each variant its own commit selecting it):

| | commit | game_tests | world_app_tests | capture |
|---|---|---|---|---|
| V1, the sourced flare, the held elbow | e7b9508 | 170/0 | 45/0 | `after_e7b9508_V1` |
| V2, more flare (+10°, ours), a tighter bend | 4ef2027 | 170/0 | 45/0 | `after_4ef2027_V2` |
| V3, the strongest (all ours past the sources) | bba95c4 | 170/0 | 45/0 | `after_bba95c4_V3` |

checked: `scratchpad/l195/V{1,2,3}_game.txt`, `_world.txt` and `V{1,2,3}.log` / `V1s.log` → the figures above. Fingerprints are untouched
(`world_app_tests` checks them).

**Under the rulings (the chair's 10:32:59Z way 1; the librarian's two, relayed 10:35:06Z and 10:46:40Z):**
- **The swing compensation** (`arm_swing_solved`, bisection) is DERIVED, not a source number: OURS. The posed amplitude
  in code is no longer the law's own number; the swing MEASURED against the chest is. At F 0.88 / 1.12 / 1.36 every
  stand-off reads 20.06 / 23.59 / 26.87° each way, and 49.33° at 10 m/s: Bruening's fit, extended above F 1.36 as ours.
- **New row** `against_the_chest_every_variant_swings_brunings_range_whatever_its_stand_off` (main's fixed 15° and V1,
  V2, V3; the existing chest row's 1.5° bar) and **L190's row amended by name**: its amount re-based to the chest's
  forward, the frame its law is defined in. **This is a correction of the row against its own source and is not done to
  let a variant through.** Its property, the arms swing further the faster the body runs, is checked in both frames.
- **Red with the solve switched off** (cfa5f50, `kArmSwingSolve` false; checked: `solve_red_game.txt` → 170 tests, 3
  failed): the amended row on V3 (52.9° against the chest, law 49.3, bar 3), the landed chest row on V1 (28.41 against
  26.87), and the new row at every variant's stand-off (main's 15° stays inside). Green with it on (e7b9508).
- **The heading-frame figures at 10 m/s, measured** (printed, not gated): main 51.0°, the fixed 15° 50.0°, V1 50.9°,
  V2 52.6°, V3 54.5°. They equal the computation in "Step 3, resumed".

**The yardstick** (E's tool, origin/l193-yardstick b90eda9, merged into a local scratch branch `c-ys-score` in
`Downloads\dreamzone-3-c-ys`, never pushed; each variant built and scored against the 25 CMU clips;
checked: `scratchpad/l195/score_{V1,V2,V3}.txt`, summarised by `score_sum.js` into `score_sum.jsonl`; main's from E's
`table_arms_b90eda9.txt`, which the same script reads as E printed it):

| | elbow mean (recorded 103, ±12.4) | swing back (-34.4, ±3.7) | swing front (+7.8, ±7.0) |
|---|---|---|---|
| main | 56.5 (-46.5) outside | -21.9 outside | +24.4 outside |
| V1 | 94.2 (-8.8) **inside** | -21.2 outside | +23.6 outside |
| V2 | 100.0 (-3.0) **inside** | -21.2 outside | +23.6 outside |
| V3 | 108.8 (+5.8) **inside** | -21.2 outside | +23.6 outside |

The swing's centre is not touched by any variant: it sits about 13-16° further forward than the runners' (three runners,
weak). Shown to him, not tuned to.

## Review packet (for him: two minutes)

In `Downloads\dreamzone-3-l195-arm-variants`:
1. **`contact_sheet.png`**: main and the three variants side by side: each one's measured angles at a runner's 4 m/s
   and the hunter's 10 m/s, the swing against the chest beside Bruening's, the heading-frame swing and the front hand's
   top for his eye, the yardstick's scores, every source in blue and every OURS in red, the side and front stills, and a
   frame of the straight and the corner.
2. **`clips\straight_eased_follow_all_four.mp4`** and **`clips\corner_eased_follow_all_four.mp4`**: main, V1, V2 and V3
   in one picture, his run, brightened, 2 s at 12 frames a second. Each variant also has its own beside-main clip
   (`*_L191_vs_V1/V2/V3.mp4`).
3. **Then he picks** V1, V2, V3 or none. The pick lands with its rows (already green on its own commit), through the
   train.

**Not in the packet, and why:** the look-back clips the packet asked for. `--capture-lean`'s look-back passes never show
the hunter at the stretches his run gives (found at V1, above), so the corner is shown from the following camera
instead. A look-back stretch with the hunter in view is a change to the capture tool, not to the arms.

**Corrections on the way, said here:** the "+4°" flare bound first written in Step 3, resumed (computed: +8.25°,
corrected before the ring); step 1's "the bend at the back: no" (E's yardstick shows the steady runners' elbow far more
bent than Lockie's accelerating cricketers); my runner's label carried an apostrophe and one red run never started
(re-run, nothing lost); V1's first capture (`after_5ae66b8_V1`, before the solve) is kept as the stop's evidence and is
not on the sheet.

## The landing: his pick is V1 ("v1 sourced flare looks the best", brief item 186)

**For his eye, on his shortcut once it lands:**
- The arm at the back of the swing is no longer nearly straight: the elbow holds 80° there at the hunter's speed, where
  main opened it to 62°; over the whole stride it averages 94° (main 56.5°), inside what recorded runners do.
- The arms stand off the body more the further back they swing: 23° at the back at 10 m/s, where main held 9.5°.
- The front hand peaks about 10 cm under the eye (main 3 cm), and the swing he sees is about the same (50.9° each way,
  main 51.0°).

**Rebased for the train:** `l195-v1`, V1's five commits rebased on main c9d520e (clean) as their own branch, f0efe83;
V2 4ef2027 and V3 bba95c4 stay on `l195-arm-variants`, not landed. checked: `scratchpad/l195/v1land_game.txt` → 177
tests, 0 failed; `v1land_world.txt` → 45 tests, 0 failed (the run first refused by memwatch at 12:2xZ, commit headroom
5895 / 5993 MB under 6144, nothing of the room's running; it cleared at 12:23:06Z). Pushed; marked READY
(`landing-train.js ready --pane C --lap L195` → "READY l195-v1 f0efe83").
