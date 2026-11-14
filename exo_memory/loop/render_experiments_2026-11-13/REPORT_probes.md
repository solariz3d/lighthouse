# The bounce light from probes: an experiment

Branch `gi-probes` of a local clone (`C:\Users\nname\Desktop\dz3-gi-probes`), from `gi-experiment` at `d35503b`,
never pushed. Every setting added defaults to the picture as it was. The baseline for the default-picture check was
built from `d35503b` in its own worktree (`C:\Users\nname\Desktop\dz3-gi-probes-base`).

**Waiting, and the time box.** The GPU was not mine to use from 12:13 to 12:39 (another seat's exclusive timing
session) and then from 12:44 to 13:05 and 13:20 to 13:42, when both lock slots were held by other seats' runs. My
first GPU run started at 13:05:41, so the time box moved to 14:50 (105 minutes after it). I waited 52 minutes for the
first slot and 22 for the second. The exclusive timing session was first queued at 13:46 and released at the
team's ruling (13:55 and 13:56) while it waited behind other seats' long runs. It was retaken at 14:02:11, when the
team's window came, and it ran void: the owner's game was on the GPU (see "The cost").

## The recommendation

**Do not land the probes. What stands is the first report's recommendation: the edge-aware filter (`light_filter =
3`, `light_filter_kernel = 3`) with today's one per-pixel bounce.**

- **The registered tests: F1 and F2 both fired for the probes as built.** The sprint read 0.902 against 0.932. The
  leak view read +7.62 levels against 2.
- **Under the changed build both figures pass, but the look does not.** The changed build is probes with C1 near and
  the wall test. Its sprint reads 0.954 and its leak view +1.58 levels.
  - The owner, having seen the settled pictures: *"yeah probes looks ass and loses the darkness we want"*.
  - The stairwell by the lamps settles at 111 levels, against 68 for two bounces and 61 for one; its walls are near
    white.
  - The dark rooms are lighter: the room by the lamps reads 9.7 levels against 5.6 and 3.9.
  - The wall test draws hard-edged seams on the walls at the cells' edges. F2 does not measure them.

**Before probes are worth a second try, three things would have to be true:**
- the over-lighting explained and gone (the first test is under "What can break, and what to do next");
- a wall test without seams;
- the darkest tenth of the lamps-only views no brighter than one per-pixel bounce's.

**What they did well, for whoever returns:**
- **No grain in the bounce.** After a reveal the darker half's error is 7.3% at 1 frame and 2.7% at 4, against
  today's 79.6% and 36.1%. With the filter it is 2.4% and 1.8%.
- **No dark start on newly seen surfaces.** The mean is within 1% of converged from the first frame, where `gi_reuse`
  started 11 to 19% dark.
- **The flicker measure halves:** 4.6% against 7.05% of pixels a frame on the sprint, and 3.1% against 8.0% on the
  turn.
- **The corridor:** the one view where the probes' settled picture is close to two bounces in level and in look.

**The cost side is open.** Nobody knows whether the probes are cheaper or dearer than the bounce ray they replace: F3, F3b and the 360 / 300 / 240 / 144 Hz reading were not measured (the owner's game was on the GPU during the one timing window). The first thing anyone returning to this would run is that one session; the runner is `experiment/probes_timing.sh`, and the exact command is under "The cost".

## The registered failures

- **F1, the carried light's bounce trails at a sprint: FIRED as registered for the probes as built.** Plain probes read
  **0.902** against the registered 0.932. The darker half, not registered, read 0.877. The probes blend at a hysteresis
  of 0.97, so the hand light's bounce trails the player by about 0.23 s.
  - *Beside it, under a changed arm (not F1's result):* the changed setting (probes with C1 and the wall test, the best of this branch; not recommended for landing) reads 0.954 (darker half 0.940).
    Today reads 0.962 (0.944).
  - What was changed: probes within 8 m of the camera trace 128 rays and blend at 0.8 (C1, `gi_probe_near_*`), with
    the wall test on.
  - Why: to follow the moving light faster where it is.
- **F2, a leak through a wall: FIRED as registered for the probes as built.** The leak view read **+7.62 levels**
  against the registered 2 (12.48 against two bounces' 4.86).
  - *Beside it, under a changed build (not F2's result):* with the wall test it reads +1.58 levels (6.44 against
    4.86). Darker half 4.66 against 4.13; darkest tenth 3.00 against 3.24.
  - What was changed: `gi_probe_walls = 1`, a test that uses the generator's layout. Each probe's six axis rays find
    which sides of its cell are walled, and the read leaves out probes across them.
  - Why: the paper's visibility weighting left lit rooms' probes enough weight to light a dark room's walls.
  - Cost in looks: a seam can appear on a cell's edge. See "Light through walls".
  - The view is `leak_lamps` (see "How it was measured"); the picture is `images_probes/leak_view.png`.
- **F3, the cost (registered: above 1.67 ms a GPU frame at 2560x1440, the bounce ray off).** **Not measured: the GPU was in use by the owner's game from 14:04:16; the one timing session (14:05:37 to 14:09:22) was void whole** (see "The cost"; its logs are in `results_probes/timing_VOID_1405/`).
- **F3b (added at 12:45 by the coordinator, before any probe timing existed).** It fires if the p99 at 2560x1440, over
  three 30-second runs under the exclusive hold, is more than 0.10 ms above the defaults' p99 in the same session.
  **Not measured: the GPU was in use by the owner's game from 14:04:16; the one timing session (14:05:37 to 14:09:22) was void whole.**

## The settled look

The converged picture (the reference: held still, through the whole pipeline) of each view, mean level in 8-bit
levels by luminance: whole picture / darker half / darkest tenth (`probes_tables.py levels`).

| view | one bounce: whole / dark half / darkest tenth | two bounces: whole / dark half / darkest tenth | probes: whole / dark half / darkest tenth | probes, wall test: whole / dark half / darkest tenth |
|---|---|---|---|---|
| corridor_flashlight | 33.2 / 18.2 / 12.74 | 39.5 / 24.6 / 18.88 | 49.9 / 36.0 / 28.12 | 47.6 / 31.3 / 15.71 |
| corridor_hand | 35.2 / 18.8 / 5.76 | 40.7 / 23.8 / 8.89 | 43.0 / 26.9 / 13.63 | 43.8 / 27.3 / 13.69 |
| corridor_lamps | 4.9 / 2.7 / 1.57 | 6.5 / 4.0 / 2.44 | 8.3 / 5.2 / 3.49 | 8.1 / 4.8 / 2.15 |
| leak_lamps | 3.3 / 2.7 / 2.00 | 4.9 / 4.1 / 3.24 | 12.5 / 6.6 / 4.06 | 6.4 / 4.7 / 3.00 |
| room_hand | 25.8 / 13.8 / 7.20 | 30.9 / 18.5 / 11.08 | 40.0 / 27.4 / 18.06 | 38.6 / 26.4 / 17.57 |
| room_lamps | 3.9 / 2.5 / 1.42 | 5.6 / 3.9 / 2.30 | 12.3 / 8.0 / 4.78 | 9.7 / 6.7 / 4.04 |
| stairwell_hand | 97.5 / 48.3 / 8.19 | 104.1 / 55.5 / 11.74 | 128.4 / 80.9 / 10.13 | 129.0 / 81.4 / 10.08 |
| stairwell_lamps | 61.0 / 24.0 / 2.88 | 68.3 / 30.7 / 5.32 | 111.1 / 64.1 / 4.98 | 111.7 / 64.4 / 4.93 |

Side by side, brightened 2x: `images_probes/room_lamps_settled.png`, `images_probes/stairwell_lamps_settled.png`,
`images_probes/corridor_hand_settled.png` (one bounce, two bounces, probes, probes with the wall test).

**Where the probes' picture differs in kind** (from the pictures; the levels table says how much):
- **Light through the corners, as first built.** In the room by the lamps alone, bright streaks run up the corners
  where two walls meet, and blotches the shape of the probes' octahedral texels lie on the side wall: light from the
  neighbouring rooms. The wall test removes them (the fourth tile; see F2).
- **Brighter overall, much more than two bounces.** Probes carry every bounce (each probe's hit is lit by last frame's
  probes), so some gain over two bounces is expected (a third bounce and on add about a third again of what the second
  added, at these albedos). The measured gain is far more: room by the lamps 3.9 to 12.3 levels (two bounces 5.6),
  stairwell by the lamps 61 to 111 (two bounces 68). The wall test takes the room back to 9.7 and leaves the
  stairwell at 112, so the leak is part of it in rooms and none of it in the stairwell. Inferred: the rest is the
  probes' coarse sampling of the light near a lamp: a probe 0.5 m from a ceiling lamp sees the bright ceiling
  round it and spreads that over its whole 3 m cell, where the per-pixel ray sees it fall off.
- **Lost contact shading.** In the corridor the per-pixel bounce darkens the line where wall meets ceiling; with
  the probes that line is lighter and the corner flatter, since the probes' light is about the same on both faces of
  the corner. `gi_probe_ao` (the pixel's ambient occlusion on the probes' light, as the paper suggests) exists for
  this; not measured.
- **Banding at the probe spacing.** The corridor's left wall shows faint vertical bands about 3 m apart (the probes'
  cells), where the per-pixel picture is an even falloff. The stairwell's right wall loses its falloff toward the lamp
  and saturates.
- **Colour:** the warm carpet and wall colours carry further (every bounce), as two bounces did, more strongly.

## The cost (F3, F3b, and the frame-rate lines)

**Not measured: the GPU was in use by the owner's game from 14:04:16; the one timing session (14:05:37 to 14:09:22)
was void whole.** I took the exclusive hold at 14:02:11, when the team's window came; the session's first run started
at 14:05:37 after the last run in the other slot drained. Teamfight Tactics (`TFTClient-Win64-Shipping.exe`) had started
at 14:04:16 and held the GPU (nvidia-smi: 96% at 14:09:04). I stopped the session at 14:09:22 and released the hold
(gone at 14:09:25). By the team's ruling no bench was then taken through the ordinary lock, and none after: the owner
was playing.

**The void runs, kept so nobody mistakes them for figures** (`results_probes/timing_VOID_1405/`, its README says VOID).
None is used, and no conclusion about cost is drawn from them in either direction:

| run | arm | start | GPU average / p99 (ms) | frames drawn / paced | why not used |
|---|---|---|---|---|---|
| 1 | defaults, 10 s | 14:05:37 | 1.637 / 2.914 | 3,592 / 3,601 | the game on the GPU since 14:04:16; short of its paced frames |
| 2 | probes, 10 s | 14:05:52 | 1.599 / 3.118 | 3,601 / 3,601 | the game on the GPU |
| 3 | defaults, 10 s | 14:06:09 | 1.756 / 3.007 | 3,601 / 3,601 | the game on the GPU |
| 4 | probes, 10 s | 14:06:24 | 3.236 / 6.381 | 3,046 / 3,601 | the game on the GPU; short of its paced frames |
| 5 | defaults, 30 s | 14:06:39 | 3.520 / 5.295 | 8,396 / 10,801 | the game on the GPU; short of its paced frames |
| 6 | probes, 30 s | 14:07:16 | 2.806 / 5.771 | 9,955 / 10,801 | the game on the GPU; short of its paced frames |
| 7 | filter, 30 s | 14:07:53 | 3.250 / 7.292 | 8,357 / 10,801 | the game on the GPU; short of its paced frames |
| 8 | defaults, 30 s | 14:08:31 | 4.009 / 10.457 | 7,397 / 10,801 | the game on the GPU; short of its paced frames |
| 9 | probes, 30 s | 14:09:08 | (stopped at 14:09:22) | | the game on the GPU |

Not measured, therefore: F3, F3b, the reading of each arm's p99 against 2.78 ms (360 Hz), 3.33 ms (300 Hz),
4.17 ms (240 Hz) and 6.94 ms (144 Hz), the 1920x1080 frame times, the update's and the read's shares of the cost, and
three more runs of the filter alone beside the team's (`handback/p-d675-bench-P_2026-11-13.md` section 3: average
1.950 ms, p99 3.055, 2.433 and 3.097).

**The session to run, as written** (from the clone's root, after `build.bat`; OUT any folder):

    SHORT_ARMS="defaults probes" node C:\Users\nname\Desktop\lighthouse\consonance\tools\heavy-run.js --run --exclusive \
      --cmd "gi-probes timing session" -- bash experiment/probes_timing.sh OUT "defaults=" \
      "probes=gi_probes = 1;gi_probe_near_radius = 8;gi_probe_near_rays = 128;gi_probe_near_hysteresis = 0.8;gi_probe_walls = 1" \
      "probesfilter=gi_probes = 1;gi_probe_near_radius = 8;gi_probe_near_rays = 128;gi_probe_near_hysteresis = 0.8;gi_probe_walls = 1;light_filter = 3;light_filter_kernel = 3" \
      "filter=light_filter = 3;light_filter_kernel = 3"
    py -3 experiment/timing_table.py OUT/timing.log

It runs 10 s benches of the defaults and the probes twice each (F3 as registered), then three 30 s rounds of the arms
with the defaults first and last (F3b, and the frame-rate lines), every run void if it draws fewer than its paced
frames. `SKIP_ARMS` (default `probesfilter`, at the owner's ruling) leaves an arm out of the 30 s rounds. About 9
minutes. Check that no game or other GPU program is running first.

## Light through walls (F2), and the wall test

**As first built, the probes leaked.** In the leak view (a dark room, its lit neighbour across the wall at x = 6) the
probes' settled picture carries blotches of light in the shape of the probes' octahedral texels on the side wall, and
in the room by the lamps alone bright streaks run up the corners (`images_probes/leak_view.png`,
`images_probes/room_lamps_settled.png`, brightened). The paper's visibility weighting (the soft backface test, the
Chebyshev test, the crush) leaves a probe across a wall a small weight, but beside a dark room's own probes, whose light
is near zero, a small share of a lit room's light is most of the result. Where the Chebyshev test passes at all (a
distance texel that mixes the wall's near hits with a ray that slipped past a corner), it is all of it.

**The wall test** (`gi_probe_walls = 1`) uses what the generator guarantees: walls on the cells' edges, probes at the
cells' centres. Each probe traces its six axis rays every frame (they are left out of the blend) and records which of
them get past 60% of the way to the next probe; the read finds the point's own cell, and leaves out every probe of the
cage across a closed side of it (a diagonal probe needs both sides open). Cost: six more rays a probe a frame
(20,736) and two texel loads a pixel.

| leak view, settled mean level (of 255) | whole | darker half | darkest tenth |
|---|---|---|---|
| one bounce (today) | 3.3 | 2.7 | 2.00 |
| two bounces, per pixel (F2's yardstick) | 4.86 | 4.13 | 3.24 |
| probes | 12.48 | 6.65 | 4.06 |
| probes, wall test | 6.44 | 4.66 | 3.00 |

**F2 fired as registered for the probes as built (+7.62 levels against 2).** With the wall test, a changed build and
not F2's own result, the corner streaks and blotches are gone in both views and the leak view reads +1.58 levels. The remainder is not a leak in the pictures: the room's own walls are lit by every bounce
(the probes carry all of them, two bounces stop at two).

**What the wall test costs in looks:** it is a hard switch where a surface crosses a cell's edge (the "home" cell
changes), so where the two sides disagree it draws a seam on the cell edge: hard-edged lighter rectangles on both walls of the corridor and on the room's left
wall near the floor, and a faint vertical line at the left of the leak view. A blend across the last 0.3 m before the
edge would hide it; not built. It also leaves out a neighbour wherever furniture stops an axis ray short of the cell's
edge (inferred, not seen in these views): that side then reads a little darker, never lighter.

## The carried light at speed (C), and F1

The sprint (7 m/s, the burst's route, shots 6 and 18 after 432 frames), the traced colour's mean against its own
held-still converged reference (`results_probes/f1.md`):

| variant | whole picture (F1's figure) | darker half (not registered) | F1: below 0.932 |
|---|---|---|---|
| today | 0.962 | 0.944 | (the yardstick) |
| two bounces | 0.964 | 0.950 | |
| **probes** (hysteresis 0.97, 64 rays) | **0.902** | **0.877** | **fires** |
| probes, C1 near (8 m: 128 rays, hysteresis 0.8) | 0.956 | 0.939 | not fired |
| probes, C2 hit cache (re-traced every 8 frames, hysteresis 0.8) | 0.955 | 0.934 | not fired |
| probes, C3 the carried light's first bounce per pixel | 0.961 | 0.953 | not fired |
| probes, C1 and C2 together | 0.960 | 0.946 | not fired |
| **probes, C1 and the wall test (the changed setting)** | **0.954** | **0.940** | not fired |
| the same with the filter (`filter3+k3`) | 0.954 | 0.939 | not fired |

**F1 fires for plain probes and does not fire for any of the three answers.** The plain probes trail the hand light
by about 6 points more than today (their 0.97 hysteresis is a time constant of 33 frames, 0.23 s, about 1.6 m at a
sprint), and the darker half is where it shows (0.877).

**Which answer is best:**
- **C1 (near) is the best of the three.** It costs no per-pixel ray, it is steady in still views (after a reveal its mean
  stays within 0.972 to 1.011 of the reference), and it nearly matches today on the sprint.
- **C2 (the hit cache) is not recommended as built.** It meets F1, but in still views its light wanders: each probe
  keeps one set of ray directions for 8 frames and blends fast, so it follows each set's own error. After a reveal the
  mean swings between 0.84 and 1.11 of the reference over 32 frames (`results_probes/reveal.md`), a slow pumping a
  person would see. Rotating every frame as plain probes do, with the cache only re-lighting a hit for the frames
  between, would avoid it; not built.
- **C3 (carried) is the most faithful on the sprint** (0.961, dark half 0.953) but keeps a bounce ray a pixel, which is
  the cost the probes are meant to remove, and it leaves the carried light's own grain in: its still views at 4 frames
  after a reveal have 8.9% dark-half error against plain probes' 2.4%, and the turn's flicker (7.15% of pixels a frame)
  is today's again.

## After a reveal: newly seen surfaces do not start dark

The `reveal` lines (`results_probes/reveal.md`; the seven views, probes settled, pixels' history forgotten):

| variant | 1 frame: error / dark half / mean | 4 frames | 32 frames |
|---|---|---|---|
| today (from the still line: the same thing for today) | 56.2% / 79.6% / about 1.00 | 22.0% / 36.1% | 6.3% / 11.3% |
| probes | 24.3% / 7.0% / 0.989 to 1.006 | 7.8% / 2.4% / 0.990 to 1.008 | 2.2% / 1.1% / 0.991 to 1.002 |
| probes, near | 24.8% / 7.4% / 0.992 to 1.008 | 8.6% / 3.0% | 2.6% / 1.6% |
| probes, near, wall test (the changed setting) | 24.2% / 7.3% / 0.993 to 1.006 | 7.7% / 2.7% | 1.9% / 1.3% |
| the same with the filter | 10.5% / 2.4% / 0.993 to 1.007 | 4.2% / 1.8% | 1.8% / 1.2% |
| the filter alone (from its still line) | 18.9% / (see the first report) | 7.2% / 10.8% | 2.3% / 2.8% |

A newly seen surface is **at its converged brightness from the first frame** (mean 0.99 to 1.01), where `gi_reuse`
started 11 to 19% dark. And because the bounce no longer comes from one ray a pixel, **the darker half's grain at one
frame falls from 79.6% to 7.0%**; what grain is left is the direct light's and the ambient occlusion's.

**The cold start is the other side of it.** From a full reset (the still lines: a place the probes have never seen),
the probes' light builds up over about a second: the picture's mean is 0.55 to 0.91 of the reference at 1 frame and
0.64 to 0.93 at 32 (`table_traced_colour_1080p.md`, "bright f32" 0.803 for plain probes). In play that happens at a
load or a teleport, and to probes entering the volume's edge 33 m ahead of a sprinting player (about 4.7 s before
they are reached). The first report's still columns therefore read worse for the probes than what a player sees;
the reveal lines are the fair comparison.

## Every variant (1920x1080)

The traced colour (`results_probes/table_traced_colour_1080p.md`, the first report's columns; the still columns are
from a full reset, probes included, so they show the probes' cold start, not play):

| variant | still f1 | still f4 | still f32 | still f4 dark | still f32 dark | sprint | sprint dark | turn | turn dark | bright f32 / sprint | over 8 sprint | over 8 turn |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| probes | 36.1 | 22.2 | 16.01 | 30.1 | 24.56 | 15.7 | 14.8 | 12.7 | 3.4 | 0.803 / 0.902 | 4.26 | 2.88 |
| today | 56.2 | 22.0 | 6.33 | 36.1 | 11.25 | 16.7 | 17.6 | 18.0 | 28.9 | 0.995 / 0.962 | 7.05 | 8.00 |
| bounce2 | 57.1 | 22.9 | 6.60 | 36.2 | 11.15 | 16.6 | 17.1 | 18.8 | 30.5 | 0.995 / 0.964 | 8.24 | 11.12 |
| probes+near | 35.4 | 19.3 | 7.41 | 27.5 | 10.60 | 15.0 | 9.6 | 12.5 | 2.1 | 0.914 / 0.956 | 4.33 | 2.92 |
| probes+cache | 35.7 | 20.0 | 7.74 | 29.2 | 10.43 | 15.1 | 9.9 | 12.6 | 2.5 | 0.922 / 0.955 | 4.27 | 2.92 |
| probes+carried | 37.2 | 20.2 | 13.07 | 25.6 | 18.73 | 15.4 | 9.9 | 16.3 | 19.5 | 0.847 / 0.961 | 4.71 | 7.15 |
| probes+cache+near | 35.8 | 19.8 | 7.56 | 26.6 | 9.55 | 15.0 | 9.3 | 12.6 | 2.2 | 0.920 / 0.960 | 4.27 | 2.92 |
| probes+near+walls | 34.4 | 18.7 | 6.91 | 27.2 | 10.25 | 15.0 | 9.1 | 12.5 | 2.1 | 0.920 / 0.954 | 4.62 | 3.09 |
| probes+near+walls+filter3+k3 | 23.7 | 17.1 | 6.89 | 27.2 | 10.30 | 17.3 | 8.2 | 10.4 | 1.3 | 0.919 / 0.954 | 3.88 | 3.06 |
| filter3+k3 | 18.9 | 7.2 | 2.31 | 10.8 | 2.84 | 18.2 | 8.4 | 11.8 | 9.5 | 0.992 / 0.959 | 2.99 | 2.57 |

The finished picture (`results_probes/table_finished_picture_1080p.md`; RMSE in levels / dark half / share over 8
levels, each variant against its own reference; the still columns again from the cold start):

| variant | still f4 | still f32 | sprint | turn |  (each: RMSE levels / dark-half RMSE / share over 8 levels)
|---|---|---|---|---|
| today | 6.33 / 5.75 / 22.5% | 1.69 / 1.62 / 0.9% | 6.89 / 6.54 / 32.2% | 2.66 / 1.46 / 2.1% |
| filter3+k3 | 1.78 / 1.60 / 0.9% | 0.79 / 0.74 / 0.0% | 3.85 / 4.21 / 4.7% | 1.29 / 0.92 / 0.1% |
| bounce2 | 6.93 / 6.50 / 26.7% | 1.84 / 1.79 / 0.9% | 7.15 / 6.81 / 34.1% | 3.27 / 1.95 / 3.4% |
| probes | 9.55 / 9.19 / 58.9% | 7.41 / 7.21 / 45.9% | 8.83 / 8.29 / 62.7% | 1.82 / 0.97 / 0.0% |
| probes+near | 8.13 / 7.89 / 52.0% | 2.97 / 2.70 / 1.5% | 5.17 / 5.06 / 8.4% | 1.40 / 0.94 / 0.0% |
| probes+cache | 9.12 / 9.24 / 55.1% | 3.15 / 3.13 / 1.5% | 5.19 / 5.14 / 9.2% | 1.43 / 0.93 / 0.1% |
| probes+carried | 7.88 / 7.35 / 31.5% | 5.46 / 5.07 / 16.5% | 5.63 / 4.93 / 16.5% | 2.44 / 1.29 / 1.6% |
| probes+cache+near | 8.11 / 7.79 / 52.2% | 2.80 / 2.60 / 1.5% | 4.94 / 4.79 / 7.4% | 1.36 / 0.89 / 0.1% |
| probes+near+walls | 7.96 / 7.79 / 51.5% | 2.87 / 2.60 / 1.2% | 5.43 / 4.98 / 9.9% | 1.36 / 0.93 / 0.0% |
| probes+near+walls+filter3+k3 | 7.79 / 7.64 / 50.7% | 2.86 / 2.59 / 1.1% | 4.27 / 4.37 / 6.3% | 1.31 / 0.87 / 0.1% |

Not run on the yardstick, for want of time: `h1` (one height a storey), `pao` (ambient occlusion on the probes' light),
`r32` and `r128` (rays a probe), `h80` (C2's faster blend without its cache), plain probes with the wall test, probes
with the filter but without C1 and the wall test, and any 1280x720 run.

## What can break, and what to do next

**First thing to do next: separate "more bounces" from "a wrong amount of light".** The stairwell by the lamps settles
at 111 levels where two per-pixel bounces give 68 and one gives 61, and its walls are near white. At these albedos,
more bounces cannot nearly double a view, as the "settled look" says. No setting in this build turns off the probes'
own light at a probe ray's hit, which would make the probes carry exactly one bounce. I did not rebuild for it before
the timing session: the exe timed should be the exe measured.
- **The test:** a `gi_probe_bounces = 1` that drops the `ProbeIrradiance(Tex0, …)` term in `ProbeTraceCS`. Run it on
  the still views and set its converged levels beside the per-pixel one-bounce reference.
- **If one-bounce probes still read far above one per-pixel bounce, the excess is not extra bounces.**
- **My reading, inferred, not measured.** I checked the code for the usual errors:
  - albedo is applied once at the hit and once at the read, as in the per-pixel bounce;
  - the irradiance texel is the cosine-weighted mean of the incoming radiance, which has the same expectation as one
    cosine-sampled ray;
  - each ray is clamped at `gi_clamp` as each per-pixel sample is.

  That leaves sampling. A probe 0.5 m below a ceiling lamp sees the bright ceiling round the lamp over a wide solid
  angle and stores it. The read then spreads that value, by trilinear weights, over walls 1.5 m away, which see that
  ceiling small and at a slant. The probes over-light wherever the light varies fast within a 3 m cell, that is, near
  every lamp. If this is right, a probe's light should be scaled by its distance to the lamps it sees, or the probes
  should carry only the bounces after the first, with the first bounce near lamps left to the pixel. Both are untried.

**What can break, seen in the pictures:**
- **The wall test makes F2's number pass and adds a visible seam that F2 does not measure.** With the wall test,
  hard-edged lighter rectangles appear on the walls at the cells' edges: on both walls in the corridor picture, and on
  the left wall in the room picture (`images_probes/corridor_hand_settled.png`, `images_probes/room_lamps_settled.png`,
  the fourth tile). Where a surface crosses a cell's edge, its "home" probe changes, and the set of probes it may use
  changes with it, all at once. A blend over the last 0.3 m before the edge would soften it (not built).
- **The stairwell's unlit upper part reads as a hard-edged dark block against the over-lit walls**
  (`images_probes/stairwell_lamps_settled.png`, the third and fourth tiles). It is there with and without the wall
  test, so it is not the test's. Its edges are straight where the per-pixel pictures fall off smoothly. Inferred, not
  checked: the faces in it get their light from probes that the visibility test or the inside test leave out, while
  their neighbours get the over-lit probes.
- **Banding at the 3 m spacing on long walls, and flattened wall-to-ceiling corners** (the corridor).
- **The cold start.** A place the probes have never seen (a load, a teleport, the volume's edge) takes about a second
  to light up (the still lines: 0.80 of the reference's mean at 32 frames for plain probes, 0.92 with C1).
- **Moving things.** A probe ray that hits a chaser lights it like a wall, and the probes do not see the chasers' own
  motion. Inferred, not measured: a chaser walking past a probe tints it for a fraction of a second.
- **C2 as built pumps:** after a reveal its brightness wanders between 0.84 and 1.11 of the reference over 32 frames.

**What only a person watching it in motion can judge:**
- (Settled by the owner from the still pictures: the look is not wanted. The dark rooms' darkest tenth is up to 1.8
  times two bounces'.)
- The wall test's seams in motion, as the home cell changes under a moving camera.
- C1's faster blend near the player: the flicker measure says it is no worse than plain probes (4.6% against 4.3% of
  pixels a frame on the sprint), but a person should watch the hand light's bounce as it sweeps.
- The cold start after a load.

## How it was measured

Everything comes from offscreen modes of `dz-world`; no window was opened. The yardstick is the first experiment's
`dz-world --noise` (its REPORT.md, "How it was measured"), unchanged in what it measures, with four additions:

- **Probe variants' references.** A reference is the view held still and its traced colour averaged over 1,024
  frames (and, for the finished picture, 512 frames through the whole pipeline). For a probe variant, 360 frames are
  drawn first so the probes settle, and the probes are kept over the resets that start each average. The reference
  key carries the probe settings that change what the light converges to (heights, C3, `gi_probe_ao`, the biases,
  the wall test), so each such setting has its own references.
- **The still views start from a full reset, probes included** (`ResetHistory()`, as before): that is the worst
  case, a probe volume that has never seen the place (a teleport, a load). It is not what a player sees walking, so
  beside it each probe variant has **a `reveal` line**: the probes settled on the view (360 frames), then only the
  pixels' history forgotten (`ResetHistory(true)`), then 1, 4, 16 and 32 frames, as for the still line. That is a
  newly seen surface in play: the probes do not depend on what the camera saw.
- **The leak view (F2)**, case `leak_lamps`, hand light off. Chosen the same way for every variant: among the first
  ten rooms the walk graph reaches with a lamp on their storey 3 to 6.5 m away in x and z (and none nearer), the one
  whose view toward that lamp is darkest by today's lighting (16 frames, the lamps and one per-pixel bounce, every
  experimental setting off). Found: the player at (4.32, 0.00, 4.50), looking along +x at the lamp at (7.5, 2.3, 4.5)
  in the next cell, through the wall on the cells' edge at x = 6. Its settled mean level is read from the reference
  picture (the converged finished picture, 8-bit) of each key: `probes_tables.py leak`.
- **The darker half's brightness** (`dmean`): the mean luminance against the reference's over the reference's darker
  half, beside the whole picture's. F1's figure is the whole picture's `mean` on the sprint, averaged over its two
  shots.

`table.py` and `ldr_error.py` leave the leak view out of their averages, so the seven-view averages stay comparable
with the first report. **Today's row reproduced the first report's to the last digit** (still 56.2 / 22.0 / 6.33,
sprint 16.7, mean 0.995 / 0.962, finished picture 6.33 / 5.75 / 22.5%), as did two bounces'. Their references are the
first experiment's own, from the same scratch cache (drawn at 10:01 to 10:41 by the first experiment's code, whose
defaults are this branch's; inferred from the identical numbers, not re-drawn).

To reproduce (from the clone's root, after `build.bat`; OUT, CACHE any folders, QUEUE a file of variant names):

    printf '%s\n' today probes probes+near probes+near+walls bounce2 > QUEUE
    node <heavy-run.js> --run --cmd "..." -- bash experiment/probes_pass.sh OUT CACHE QUEUE      # build, then each variant
    py -3 experiment/table.py OUT/noise.txt                      # the traced colour, seven views, as the first report
    py -3 experiment/ldr_error.py --summary OUT today probes ... # the finished picture
    py -3 experiment/probes_tables.py f1 OUT/noise.txt           # F1
    py -3 experiment/probes_tables.py leak OUT <probe key> b2_r0_c1        # F2
    py -3 experiment/probes_tables.py levels OUT b1_r0_c1 b2_r0_c1 <probe key>   # the settled look
    py -3 experiment/probes_tables.py reveal OUT/noise.txt       # after a reveal

The probe key of `probes` is `b1_r0_c1_p_h2_k0_a0_n0.2_v0.1`; `+walls` adds `_w`; `+carried` makes it `_k1_`.

## What was built

Read first: the paper (Majercik, Guertin, Nowrouzezahrai and McGuire, JCGT 8(2), 2019), sections 3 to 5, for the
structure: probes on a grid, each with an octahedral irradiance map and a map of mean distance and mean squared
distance; rays from every probe every frame, from a randomly rotated spherical Fibonacci set; hits shaded with the
same routine as the pixels, including last frame's probe light at the hit (many bounces over frames); texels blended
in at a hysteresis (the paper uses 0.85 to 0.98), irradiance by the cosine, distance by a cosine power; and the read's
four weights: a soft backface test, a Chebyshev visibility test on the distance moments, a crush of small weights, and
the lookup point moved off the surface along the normal and towards the eye, then trilinear. The paper gives these
qualitatively and defers its constants to its supplementary code, which I did not read. NVIDIA's RTXGI documentation
was read for the classification of probes inside geometry (by their share of back-face hits). **The constants below
are mine, not the paper's, and are marked "choice" in the shader**: the 0.2 floor on the backface weight, the cubed
Chebyshev term with a 0.05 floor, the crush below 0.2, the distance lobe's power of 50, the 25% back-face share for
"inside", and the biases (0.2 m along the normal, 0.1 m towards the eye). No code was copied.

**The grid** follows the generator: a probe at the centre of every 3 m cell in x and z (the walls are on the cells'
edges), and one or two heights a storey (`gi_probe_heights`, default 2: 0.875 m and 2.625 m above the floor, 1.75 m
apart; with 1, mid-height, 3.5 m apart). 24 x 24 cells by 3 storeys round the camera: 3,456 probes with two heights
(1,728 with one), 72 m across and 10.5 m tall. The volume moves with the camera a cell at a time; a probe's place in
the atlas is its world coordinate modulo the grid, so only the probes that came in start anew (each probe records
its coordinate; one that does not match is new). Points outside the volume fall back to today's per-pixel bounce ray.

**The passes** (`render/shaders/dz.hlsl`, the probes' section; `render/src/renderer.cpp`, before the trace):
1. `ProbeTraceCS`: every probe traces `gi_probe_rays` rays (64) through the existing acceleration structure (all ray
   groups, `gi_range` 14 m). A hit is lit as the per-pixel bounce lit it (one lamp drawn in proportion from the light
   grid and the carried lights, shadowed; plus ambient and emission), plus last frame's probe light at the hit, and
   clamped at `gi_clamp`. A back-face hit stores a negative distance and no light; a miss stores 14 m and no light.
2. `ProbeBlendCS`: one group a probe. Each texel of the 14x14 distance map (16x16 with its border) takes the rays
   near its direction (cosine to the 50th power), a back face counted at a fifth of its distance; each texel of the
   6x6 irradiance map (8x8) takes them by the cosine; both blend into last frame's at the hysteresis (0.97). The
   borders repeat the interior across the octahedron's folds, so the read's bilinear lookups wrap.
3. The read, in `TraceCS` (`gi_probes = 1`): the eight probes round the point, weighted as above; a probe more than
   25% of whose rays hit back faces is skipped as inside geometry. The result replaces the per-pixel bounce ray.
   Direct light, shadows and ambient occlusion are per pixel as before.

**The answers to C (the carried light at speed)**, each a setting:
- C1 `gi_probe_near_radius` (with `gi_probe_near_rays`, `gi_probe_near_hysteresis`): probes within that many metres
  of the camera trace more rays and keep less of their old light. Measured as `near`: 8 m, 128 rays, 0.8.
- C2 `gi_probe_retrace`: each probe keeps its ray directions for R frames and remembers each ray's hit (position by
  its distance, normal, colour, material); it traces anew once in R frames (the probes take turns, so the cost is
  even), and in between re-lights the remembered hits with the lights of the frame: a moving light costs shadow rays
  only, no ray to find the surface. Because the remembered hits do not change, the probe's light is steady and can be
  blended faster. Measured as `cache`: R = 8 with hysteresis 0.8 everywhere; `h80` is hysteresis 0.8 without the
  cache, to tell the two effects apart.
- C3 `gi_probe_carried`: the probes leave the carried lights out; each pixel still traces its bounce ray, but lights
  its hit by the carried lights alone. Measured as `carried`.

**Against F2, the wall test** (`gi_probe_walls`): see "Light through walls (F2), and the wall test".

`gi_probe_ao` (0 to 1) darkens the probes' light by the pixel's ambient occlusion, as the paper optionally does with
screen-space occlusion; off by default.

**Memory** (allocated the first frame the probes are on, never otherwise): the atlas, two of 1024 x 1296 RGBA32F
(42.5 MB together); the rays of a frame, 256 x 3456 RGBA16F (7.1 MB); the hit cache, 256 x 3456 RGBA32F and RGBA16F
(21.2 MB). 70.8 MB in all. The atlas is 32-bit because the first report found half floats drift dark under small
blend steps; a production layout would take far less (see "For the render lane").

## Defaults unchanged, and the checks

Run at 13:49:32 to 13:52:38 with defaults (no `world.local.txt`), on the final build (the wall test included), in the
same lock pass as the last yardstick runs (`results_probes/checks/`):
- **`--capture-walk`, the baseline exe (built from `d35503b` in its own worktree) against this build:**
  - 12 of 14 shots are byte-identical.
  - The flashlight shot (`02_spawn_corridor_flashlight.png`) differs in 4 pixels by 1 level of 255. That is the same
    difference the first report found against its own baseline.
  - The overlay shot differs by design: it lists every setting, and the new ones show.
- **The three selftests: `dz-view --selftest` 30 of 30, `dz-gym --selftest` 26 of 26, `dz-world --selftest` 52 of 52.**
- The repo's full test suite was not run, as briefed. `game/config/world.txt` was regenerated with `--print-settings`
  (the thirteen probe settings at their off defaults); the test that compares it, in `world_app_tests`, was not run.

## Settings added

All in `game/config/world.txt` (live from F1, or `world.local.txt`) and `dz::Settings` (`render/renderer.h`). **Every
default is the picture as it was**: with `gi_probes = 0` nothing of the probes is allocated, dispatched or read.

| world.txt | `dz::Settings` | default | what |
|---|---|---|---|
| `gi_probes` | `giProbes` | 0 | 1: the bounce light from the probes, in place of the per-pixel bounce ray |
| `gi_probe_heights` | `giProbeHeights` | 2 | probes a storey, 1 or 2 |
| `gi_probe_rays` | `giProbeRays` | 64 | rays a probe a frame (up to 256) |
| `gi_probe_hysteresis` | `giProbeHysteresis` | 0.97 | how much of its old light a probe keeps each frame |
| `gi_probe_near_radius` | `giProbeNearRadius` | 0 | C1: metres round the camera in which the near numbers below apply (0: none) |
| `gi_probe_near_rays` | `giProbeNearRays` | 128 | C1: their rays a frame |
| `gi_probe_near_hysteresis` | `giProbeNearHysteresis` | 0.8 | C1: their hysteresis |
| `gi_probe_retrace` | `giProbeRetrace` | 1 | C2: R > 1, a probe traces anew every R frames and re-lights its remembered hits between |
| `gi_probe_carried` | `giProbeCarried` | 0 | C3: 1, the carried lights' first bounce stays a ray a pixel; the probes leave them out |
| `gi_probe_normal_bias` | `giProbeNormalBias` | 0.2 | metres the lookup moves off the surface along its normal |
| `gi_probe_view_bias` | `giProbeViewBias` | 0.1 | metres the lookup moves back towards the eye |
| `gi_probe_ao` | `giProbeAo` | 0 | 0 to 1: how much the pixel's ambient occlusion darkens the probes' light |
| `gi_probe_walls` | `giProbeWalls` | 0 | 1: the wall test (each probe's six axis rays; probes across a walled side of the point's cell are left out) |

The yardstick's variant names (`experiment/run_variants.sh`): `probes` (`gi_probes = 1`), `near`, `cache`, `h80`,
`carried`, `walls`, `h1`, `pao`, `r32`, `r128`, combined with `+` as before (`probes+near`, `probes+filter3+k3`).

## Files changed (`git diff d35503b -- render game`)

- `render/shaders/dz.hlsl`:
  - the probes' section (new, before `TraceCS`): addressing, the octahedral maps, `ProbeIrradiance` (the read),
    `ProbeTraceCS`, `ProbeBlendCS`;
  - `Surface` gains `back` and `mat`, set in `Trace`;
  - `DirectSel` and `LightsAtSel` take which lights to use (all, the grid's, the carried); `Direct` calls `DirectSel`
    with all, as before;
  - in `TraceCS`: the probe read in place of the bounce where `gi_probes` is on and the point is inside the volume
    (and C3's carried-only bounce ray); the old bounce untouched otherwise;
  - the frame constants: five rows for the probes.
- `render/src/renderer.cpp`: the probe constants (`kProbe*`), `Tex::fmt` (so a binding set can view a 32-bit texture),
  `EnsureProbes` (targets and binding sets, the first frame the probes are on), the two dispatches before the trace
  (timestamp 6 after them, so their cost shows on its own), the trace's binding set with the atlas (`traceSetP`),
  `ResetHistory(keepProbes)`, the descriptor sets' range 320 to 400, `kQueries` 6 to 7.
- `render/renderer.h`: the settings above, `GpuTimes::probes`, `ResetHistory(bool keepProbes = false)`.
- `render/CMakeLists.txt`: `ProbeTraceCS`, `ProbeBlendCS`.
- `game/world/world_settings.h`, `game/config/world.txt` (regenerated with `--print-settings`), `game/world/stage.cpp`:
  the world settings, applied every frame.
- `game/world/stage.h`: `lamp_list()`, so the yardstick can find a dark room beside a lit one.
- `game/world/offscreen.cpp`: the bench prints the probes' update when they are on.
- `game/world/offscreen_noise.cpp`: the reference key carries the probe settings that change what the light converges
  to; a probe variant's references are drawn after 360 frames that settle the probes, and keep them over the resets; a
  `reveal` line per still view for probe variants (pixel history forgotten, probes kept); the leak view (F2); the
  darker half's mean (`dmean`) beside the whole picture's.
- `experiment/`: this report, `probes_tables.py`, `probes_pass.sh` (one lock pass: build, yardstick variants from a
  queue, then the default-picture check and selftests), `probes_checks.sh`, `compare_walk.py`, `probes_batch.sh` (the yardstick runs in one pass of the lock, from a
  queue file), `probes_timing.sh` (the final timing session in the team's form), `probes_runs.sh` (one variant a lock
  pass; not used in the end), the variant names in `run_variants.sh`, `table.py` and `ldr_error.py` leaving the leak view out of the
  seven-view averages, and `ldr_error.py` finding a probe variant's own reference.

## For the render lane: what to pick up

- **The read is self-contained**: `ProbeIrradiance` needs the atlas (one SRV), the grid's constants and nothing of the
  pixel's history. It could serve the bounce's own hit (a per-pixel bounce that reads the probes at its hit is the
  usual DDGI second bounce) as well as the pixel.
- **The atlas layout is the experiment's, not a production one.** RGBA32F everywhere is 42.5 MB for 3,456 probes;
  the paper's own formats (R11G11B10F irradiance with a gamma, RG16F distance) would be about 6 MB, if the half-float
  drift the first report found under small blend steps is handled (RTXGI stores irradiance with a gamma of 5 for this
  reason). The hit cache (21 MB) is only needed for C2.
- **Every probe is updated every frame**, as the paper's own results do. The count could be cut by updating only the
  probes near the camera, or a share of the far ones a frame; the paper's "probes inside geometry" classification and
  probe relocation (RTXGI) were not built: the cell grid makes the first rare and the back-face share handles it.
- **Not handled:** a probe's ray that hits a moving thing (a chaser) is lit like a wall; with C2 a remembered hit on a
  chaser stays where the chaser was until the probe's turn to trace anew comes round (up to R frames). The probes do
  not see the chasers' own motion otherwise.
- **Not written:** a test beyond the yardstick, a `render/CHANGES.md` or `CHANGELOG.md` entry. This is an experiment.

## GPU use

All my GPU runs were offscreen (`--noise`, `--capture-walk`, `--selftest`, `--bench`). Each went through the team's
lock (`heavy-run.js --run`; the timing session `--run --exclusive`). Every run's start and end is in
`results_probes/gpu_times.txt`, `results_probes/checks/checks_times.txt` and `results_probes/timing_VOID_1405/timing.log`.

| what | when (local, 2026-11-13) |
|---|---|
| nothing (the other seat's hold, then the queue for a slot) | 12:13 to 13:05 |
| yardstick pass 1: probes, today, two bounces, probes with C1, C2, C3, C1 and C2 | 13:05:41 to 13:18:46 |
| nothing (the queue for a slot) | 13:20 to 13:42 |
| pass 2: build (CPU), then probes with C1 and the wall test, the same with the filter, the filter alone | 13:41:59 to 13:49:32 |
| pass 2: the default-picture check (`--capture-walk`, baseline then this build), then the three selftests | 13:49:32 to 13:52:38 |
| the timing session under the exclusive hold (taken 14:02:11): **VOID whole**, the owner's game on the GPU from 14:04:16; stopped by me | 14:05:37 to 14:09:22 |

**My GPU runs ended for good at 14:09:22** (the stopped timing session; the hold was gone at 14:09:25).

My builds also ran through the lock: 12:40 (baseline worktree and this branch), 12:44, and 13:42 (inside pass 2).
The first one, 12:09:02 to about 12:09:30, did not use the lock. I stopped it at the coordinator's word. The bench
hand-back names it as overlapping the void first attempt of that seat's timing session.
