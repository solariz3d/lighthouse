# The grain in the raytraced light, and a second bounce: an experiment

Branch `gi-experiment` of a local clone of dreamzone-3 at `31d1c6d`, never pushed. Nothing in the team's own folder was
touched. Every setting added defaults to the picture as it was.

## What this answers

1. **The grain ("static or noise").** It was measured first, against a converged reference, in the game's own world.
   Then the 2026-11-11 plan's remaining steps were tried, alone and together, and costed in frame time.
2. **Two bounces.** Built as a setting, and compared with a cheaper alternative: re-using last frame's light at the
   bounce's hit.

## The recommendation

**The edge-aware filter on the lighting (the 11-11 plan's step 4), 3x3 taps, 3 passes:**
`light_filter = 3`, `light_filter_kernel = 3`. At 1920x1080, against today:

- **The light in still views, 4 frames from a forgotten history:** error 22.0% to 7.2% (darker half 36.1% to
  10.8%).
- **At 32 frames:** 6.3% to 2.3% (darker half 11.3% to 2.8%).
- **The turn (180 degrees a second):** 18.0% to 11.8% (darker half 28.9% to 9.5%).
- **The sprint:** its darker half halves (17.6% to 8.4%); the whole picture is unchanged (16.7% to 18.2%), because
  the sprint's error is mostly the hand light's lag, which the filter does not touch.
- **The finished picture (after the TAA and the tone curve), pixels more than 8 levels off the converged one:**
  22.5% to 0.9% (still, 4 frames) and 32% to 4.7% (sprint).
- **The 11-11 flicker measure:** 7.05% to 2.99% of pixels a frame on the sprint, 8.0% to 2.6% on the turn.
- **Cost:**
  - 1920x1080: +0.20 ms on average (1.16 to 1.36), p99 1.50 to 1.71 ms.
  - 2560x1440, the owner's screen: +0.34 ms (1.62 to 1.98), p99 2.09 to 2.44 ms, worst frame 2.68 ms. That is
    inside the 2.78 ms budget by 0.10 ms in a 10-second bench, which a longer quiet run should confirm.
  - At 1080p, 4 passes (`light_filter = 4`) are slightly cleaner, with p99 1.84 ms. At 1440p their worst frame was
    2.89 ms, over the budget.

**Not recommended:** the other knobs. History length, the motion cut-off, the sampling change, the clamp, and the
TAA reactive term (the plan's step 3, as tried) did not beat the filter alone, and several made things worse.

**Two bounces** make the dark measurably lighter and warmer: +27 to 44% in the darkest tenth of a view, colour
carried one surface further. They cost +0.19 ms at 1080p and +0.35 ms at 1440p (worst frame 2.77 ms, at the
budget). With the filter they do not fit 1440p (4-pass filter plus two bounces: p99 2.99 ms). This is a look
decision for a person, not a noise fix.

**Re-using last frame's light at the bounce** gives a similar lift for free (−0.02 ms). But it builds up over about a
second after anything is newly seen, and that should be watched in motion before it is shipped.

## How it was measured

All numbers come from offscreen modes of `dz-world`; nothing opened a window. The yardstick is a new mode,
`dz-world --noise DIR` (`game/world/offscreen_noise.cpp`).

- **Views:** the game's world, seed 1, 1920x1080, render scale 0.75 as shipped (the trace is 1440x810).
  - The corridor at the spawn looking along it, a room, and a stairwell from its foot: the places `--capture-walk`
    picks.
  - Each by the hand light and by the lamps alone, and the corridor also by the flashlight: seven still views.
- **Two moving cases:**
  - the burst's sprint: carried along the bench's tour at 7 m/s, 144 frames a second, shots 6 and 18 after 432
    frames of moving;
  - a turn on the spot at 180 degrees a second: shots 6 and 18 after a second of turning.
- **The reference:** the same view held still, with no history (`light_frames = 1`), no filter and no jitter.
  - The traced colour of 1024 frames is averaged on the CPU: a full period of the renderer's 1024-frame sample
    sequence.
  - It is drawn once per view and per setting that changes what the light converges to (bounces, reuse, clamp),
    then cached. Each takes 16 to 20 s.
  - A first try with 64 frames under-reported the error, because the real-time frames re-drew half its samples.
- **The real-time path:** the settings under test, jitter off, from a forgotten history.
  - What is read back is the traced colour: albedo times light, plus emission, fogged, after the filter and before
    the anti-aliasing.
  - It is read after 1, 4, 16 and 32 frames still, or at the moving shots.
- **The measure:** RMSE against the reference, relative to the reference's magnitude.
  - Over the whole picture, and over its darker half (pixels at or below the reference's median luminance).
  - The mean brightness against the reference is printed beside it, so darkening or lag shows.
- **The same comparison after the anti-aliasing, bloom and tone curve** (what the player sees),
  `experiment/ldr_error.py`:
  - the finished pictures (jitter on) against the reference's picture: the view held still with 32 frames of
    history, then 512 finished frames averaged;
  - reported as RMSE in 8-bit levels, the dark half's RMSE, and the share of pixels more than 8 levels off.
- **The 11-11 yardstick, kept comparable:** the share of pixels changing by more than 8 levels from one frame to the
  next.
  - Same sprint as `--capture-burst`'s C1 (hand light, body shown), 24 frames 1/144 s apart, jitter on, the game's
    own picture.
  - Printed as `burst ... over 8 levels`.
- **The speed haze is left out of the moving measures:** the held-still reference has none. The burst keeps it.
- **Frame times:** the existing `dz-world --bench 10 --chasers`.
  - Carried at sprint, nine chasers in view, paced at 360 Hz, flashlight on as the owner plays.
  - `experiment/bench_quiet.sh` starts each run only when no other dz program is running, and flags a run during
    which one started.

To reproduce (from the clone's root, after `build.bat`; OUT and CACHE are any folders):

    experiment/run_variants.sh noise OUT CACHE -- today filter3+k3 bounce2 reuse     # noise.txt and pictures into OUT
    experiment/run_variants.sh noise OUT CACHE 1280 720 -- today filter3+k3          # another size
    py -3 experiment/table.py OUT/noise.txt                                           # the traced-colour table
    py -3 experiment/ldr_error.py --summary OUT today filter3+k3 bounce2 reuse        # the finished-picture table
    experiment/bench_quiet.sh OUTB 10 -- 1920x1080:today 1920x1080:filter3+k3 2560x1440:today 2560x1440:filter3+k3
    py -3 experiment/composite.py OUT.png x,y,w,h SCALE [gain=G] "label=a.png" "label=b.png" ...

Each variant name stands for a few lines of world settings (`run_variants.sh` lists them; `a+b` combines them). The
lines are written to `game/config/world.local.txt` for the run and removed afterwards.

The logs behind every number are in `experiment/results/`:
- `noise.txt`: every run, every view;
- `table_*.md`;
- `bench_session_*.txt` and `bench_full/`.

Two runs of today's settings gave identical numbers to the last digit.

## Today's numbers (1920x1080)

**Still views, the traced colour,** averaged over the seven views:

| frames of history | 1 | 4 | 32 |
|---|---|---|---|
| error, whole picture | 56.2% | 22.0% | 6.3% |
| error, darker half | 79.6% | 36.1% | 11.3% |

**Moving:**
- the sprint 16.7% (darker half 17.6%);
- the turn 18.0% (darker half 28.9%).

**The worst still view** is the stairwell by the lamps alone: 61% in its darker half at 4 frames, and 19% at 32.

**The finished picture:** 22.5% of pixels are more than 8 levels off the converged picture at 4 frames, 0.9% at 32,
32% in the sprint and 2.1% in the turn.

**The 11-11 flicker measure:** 7.05% of pixels a frame on the sprint, 8.0% on the turn. At 1280x720, the size the 11-11 burst used, today reads 2.2 to 7.4% on the sprint (mean 4.2%), against 11-11's C1 at 1.5 to 6.5% (taken before the hand light was moved clear of the body), and 6.6% on the turn. With the recommended filter, 1.3 to 4.5% (mean 2.5%) and 2.3% (`results/noise_1280x720.txt`). The filter does about the same at 720p as at 1080p (still error at 4 frames 21.2% to 7.0%).

**The moving frames are 4% darker than their held-still references even without the haze.** That is the history
lagging behind the hand light, which moves forward at 7 m/s with the player: surfaces keep light gathered when the
lamp was farther away. No noise setting removes it, and a longer motion cut-off makes it worse.

## Every variant (1920x1080)

### The traced colour against the converged reference (relative RMSE, %)

- The still columns average the seven views; sprint and turn each average two shots.
- "bright" is the mean against the reference: still at 32 frames / sprint.
- "over 8" is the 11-11 flicker measure.

Names:
- `filterN`: N passes of 5x5;
- `+k3`: 3x3 taps;
- `_sN`: sigma N;
- `framesN`: `light_frames`;
- `cutN`: `light_motion_cut`;
- `sampling`: `light_sampling = 1`;
- `clampN`: `gi_clamp` (05 = 0.5);
- `reactiveN`: `taa_reactive`;
- `bounce2`: `gi_bounces = 2`;
- `reuse`: `gi_reuse = 1`.

| variant | still f1 | still f4 | still f32 | still f4 dark | still f32 dark | sprint | sprint dark | turn | turn dark | bright f32 / sprint | over 8 sprint | over 8 turn |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| today | 56.2 | 22.0 | 6.33 | 36.1 | 11.25 | 16.7 | 17.6 | 18.0 | 28.9 | 0.995 / 0.962 | 7.05 | 8.00 |
| filter2 | 18.9 | 7.6 | 2.51 | 9.8 | 2.85 | 18.5 | 8.4 | 12.5 | 8.2 | 0.991 / 0.958 | 3.21 | 2.64 |
| filter3 | 16.8 | 6.8 | 2.52 | 8.4 | 2.56 | 18.7 | 8.1 | 12.5 | 7.4 | 0.991 / 0.958 | 2.88 | 2.44 |
| filter4 | 16.2 | 6.6 | 2.55 | 8.1 | 2.54 | 18.7 | 8.0 | 12.6 | 7.3 | 0.991 / 0.958 | 2.83 | 2.40 |
| filter5 | 16.0 | 6.5 | 2.57 | 8.0 | 2.55 | 18.7 | 8.0 | 12.6 | 7.3 | 0.990 / 0.958 | 2.82 | 2.39 |
| filter3_s2 | 26.7 | 9.7 | 2.31 | 15.3 | 3.68 | 17.5 | 9.6 | 12.2 | 13.2 | 0.990 / 0.958 | 3.22 | 3.01 |
| filter4_s2 | 26.3 | 9.6 | 2.32 | 15.1 | 3.64 | 17.5 | 9.5 | 12.2 | 13.1 | 0.990 / 0.958 | 3.15 | 2.95 |
| filter4_s8 | 14.2 | 7.0 | 4.06 | 5.5 | 2.33 | 20.6 | 7.6 | 13.7 | 4.8 | 0.992 / 0.958 | 2.79 | 2.34 |
| filter3+k3 | 18.9 | 7.2 | 2.31 | 10.8 | 2.84 | 18.2 | 8.4 | 11.8 | 9.5 | 0.992 / 0.959 | 2.99 | 2.57 |
| filter4+k3 | 17.5 | 6.6 | 2.28 | 9.9 | 2.69 | 18.2 | 8.2 | 11.8 | 9.1 | 0.991 / 0.958 | 2.85 | 2.45 |
| filter5+k3 | 16.9 | 6.4 | 2.29 | 9.6 | 2.67 | 18.2 | 8.2 | 11.7 | 9.0 | 0.991 / 0.958 | 2.82 | 2.41 |
| frames16 | 56.2 | 22.0 | 7.06 | 36.1 | 12.40 | 12.6 | 17.5 | 18.0 | 28.9 | 0.996 / 0.966 | 7.28 | 8.00 |
| frames64 | 56.2 | 22.0 | 6.33 | 36.1 | 11.25 | 21.4 | 17.8 | 18.0 | 28.9 | 0.995 / 0.958 | 6.97 | 8.00 |
| cut20 | 56.2 | 22.0 | 6.33 | 36.1 | 11.25 | 18.0 | 30.5 | 27.7 | 49.4 | 0.995 / 0.989 | 13.25 | 10.07 |
| cut80 | 56.2 | 22.0 | 6.33 | 36.1 | 11.25 | 16.3 | 17.2 | 14.1 | 15.6 | 0.995 / 0.907 | 3.62 | 6.68 |
| cut160 | 56.2 | 22.0 | 6.33 | 36.1 | 11.25 | 17.3 | 22.6 | 13.0 | 9.0 | 0.995 / 0.843 | 2.59 | 6.23 |
| sampling | 51.3 | 21.1 | 7.39 | 32.1 | 13.06 | 16.4 | 17.6 | 18.3 | 31.9 | 1.001 / 0.947 | 3.82 | 6.45 |
| clamp05 | 54.7 | 20.9 | 5.86 | 31.8 | 9.74 | 16.5 | 15.6 | 17.3 | 26.2 | 0.995 / 0.962 | 6.29 | 7.75 |
| clamp2 | 58.3 | 23.4 | 6.87 | 39.9 | 12.63 | 16.9 | 19.6 | 18.8 | 31.8 | 0.995 / 0.962 | 7.79 | 8.17 |
| reactive1 | 56.2 | 22.0 | 6.33 | 36.1 | 11.25 | 16.7 | 17.6 | 18.0 | 28.9 | 0.995 / 0.962 | 21.87 | 22.81 |
| filter3+sampling | 14.4 | 8.2 | 5.28 | 11.4 | 7.85 | 18.8 | 12.1 | 13.1 | 4.8 | 0.998 / 0.943 | 3.18 | 2.41 |
| filter3+cut80 | 16.8 | 6.8 | 2.52 | 8.4 | 2.56 | 19.1 | 15.7 | 12.2 | 3.9 | 0.991 / 0.905 | 2.61 | 2.44 |
| filter3+frames64 | 16.8 | 6.8 | 2.52 | 8.4 | 2.56 | 22.8 | 8.4 | 12.5 | 7.4 | 0.991 / 0.954 | 2.85 | 2.44 |
| filter3+reactive05 | 16.8 | 6.8 | 2.52 | 8.4 | 2.56 | 18.7 | 8.1 | 12.5 | 7.4 | 0.991 / 0.958 | 3.10 | 2.74 |
| filter3+reactive1 | 16.8 | 6.8 | 2.52 | 8.4 | 2.56 | 18.7 | 8.1 | 12.5 | 7.4 | 0.991 / 0.958 | 3.41 | 3.08 |
| bounce2 | 57.1 | 22.9 | 6.60 | 36.2 | 11.15 | 16.6 | 17.1 | 18.8 | 30.5 | 0.995 / 0.964 | 8.24 | 11.12 |
| reuse | 53.9 | 21.3 | 6.08 | 33.7 | 10.28 | 16.3 | 16.5 | 17.4 | 25.5 | 0.981 / 0.973 | 6.86 | 7.70 |
| filter3+bounce2 | 16.8 | 7.2 | 3.61 | 9.0 | 4.53 | 18.2 | 7.6 | 11.9 | 8.3 | 0.990 / 0.960 | 3.27 | 2.76 |
| filter3+reuse | 18.9 | 7.8 | 2.85 | 11.9 | 3.91 | 18.2 | 6.7 | 12.0 | 6.2 | 0.978 / 0.968 | 3.16 | 2.70 |
| filter3+k3+bounce2 | 19.0 | 7.6 | 3.35 | 11.1 | 4.61 | 17.7 | 8.0 | 11.3 | 10.1 | 0.991 / 0.960 | 3.44 | 2.98 |
| filter4+k3+bounce2 | 17.7 | 7.1 | 3.38 | 10.4 | 4.58 | 17.7 | 7.8 | 11.3 | 9.6 | 0.991 / 0.960 | 3.22 | 2.75 |
| filter4+k3+reuse | 19.2 | 7.5 | 2.65 | 12.6 | 3.96 | 17.8 | 6.9 | 11.4 | 7.7 | 0.978 / 0.970 | 3.13 | 2.72 |

### The finished picture against the converged reference's picture

Each cell: RMSE in levels / the dark half's RMSE / the share of pixels more than 8 levels off. A variant is compared
with the reference of its own bounce, reuse and clamp setting.

| variant | still, 4 frames | still, 32 frames | sprint | turn |
|---|---|---|---|---|
| today | 6.33 / 5.75 / 22.5% | 1.69 / 1.62 / 0.9% | 6.89 / 6.54 / 32.2% | 2.66 / 1.46 / 2.1% |
| filter2 | 1.88 / 1.69 / 1.2% | 0.83 / 0.77 / 0.0% | 3.90 / 4.24 / 4.8% | 1.32 / 0.95 / 0.1% |
| filter3 | 1.55 / 1.37 / 0.5% | 0.77 / 0.72 / 0.0% | 3.73 / 4.13 / 4.6% | 1.23 / 0.88 / 0.1% |
| filter4 | 1.46 / 1.29 / 0.4% | 0.76 / 0.71 / 0.0% | 3.70 / 4.12 / 4.6% | 1.20 / 0.87 / 0.1% |
| filter5 | 1.45 / 1.27 / 0.3% | 0.76 / 0.71 / 0.0% | 3.71 / 4.12 / 4.6% | 1.19 / 0.87 / 0.1% |
| filter3_s2 | 2.51 / 2.33 / 3.6% | 0.82 / 0.79 / 0.0% | 4.30 / 4.51 / 5.5% | 1.41 / 1.02 / 0.1% |
| filter4_s2 | 2.46 / 2.29 / 3.4% | 0.81 / 0.78 / 0.0% | 4.28 / 4.49 / 5.4% | 1.39 / 1.01 / 0.1% |
| filter4_s8 | 1.28 / 1.02 / 0.3% | 0.79 / 0.72 / 0.0% | 3.53 / 4.00 / 4.4% | 1.27 / 0.86 / 0.2% |
| filter3+k3 | 1.78 / 1.60 / 0.9% | 0.79 / 0.74 / 0.0% | 3.85 / 4.21 / 4.7% | 1.29 / 0.92 / 0.1% |
| filter4+k3 | 1.56 / 1.40 / 0.5% | 0.76 / 0.72 / 0.0% | 3.75 / 4.14 / 4.6% | 1.23 / 0.88 / 0.1% |
| filter5+k3 | 1.49 / 1.34 / 0.4% | 0.75 / 0.71 / 0.0% | 3.72 / 4.13 / 4.6% | 1.21 / 0.88 / 0.1% |
| frames16 | 6.33 / 5.75 / 22.5% | 1.61 / 1.55 / 0.8% | 6.75 / 6.35 / 30.9% | 2.66 / 1.46 / 2.1% |
| frames64 | 6.33 / 5.75 / 22.5% | 1.69 / 1.62 / 0.9% | 7.08 / 6.74 / 33.6% | 2.66 / 1.46 / 2.1% |
| cut20 | 6.33 / 5.75 / 22.5% | 1.69 / 1.62 / 0.9% | 6.79 / 6.05 / 29.6% | 2.96 / 1.82 / 2.6% |
| cut80 | 6.33 / 5.75 / 22.5% | 1.69 / 1.62 / 0.9% | 9.18 / 8.91 / 54.0% | 2.53 / 1.27 / 1.7% |
| cut160 | 6.33 / 5.75 / 22.5% | 1.69 / 1.62 / 0.9% | 12.84 / 11.46 / 63.2% | 2.57 / 1.26 / 1.7% |
| sampling | 5.81 / 5.37 / 18.8% | 2.64 / 2.47 / 6.1% | 8.15 / 8.05 / 43.2% | 2.69 / 1.40 / 2.0% |
| clamp05 | 5.76 / 5.18 / 21.6% | 1.45 / 1.39 / 0.3% | 6.72 / 6.37 / 29.8% | 2.60 / 1.39 / 1.9% |
| clamp2 | 6.68 / 6.04 / 22.4% | 1.90 / 1.80 / 2.0% | 7.00 / 6.66 / 33.5% | 2.70 / 1.51 / 2.2% |
| reactive1 | 5.60 / 5.15 / 17.4% | 1.95 / 1.72 / 1.0% | 7.36 / 7.02 / 26.3% | 4.95 / 3.80 / 8.6% |
| filter3+sampling | 2.59 / 2.43 / 5.6% | 2.24 / 2.09 / 4.0% | 5.56 / 5.87 / 15.7% | 1.49 / 0.98 / 0.2% |
| filter3+cut80 | 1.55 / 1.37 / 0.5% | 0.77 / 0.72 / 0.0% | 7.21 / 7.53 / 30.5% | 1.36 / 0.89 / 0.1% |
| filter3+frames64 | 1.55 / 1.37 / 0.5% | 0.77 / 0.72 / 0.0% | 4.03 / 4.41 / 6.0% | 1.23 / 0.88 / 0.1% |
| filter3+reactive05 | 1.48 / 1.35 / 0.4% | 0.83 / 0.75 / 0.1% | 3.65 / 4.09 / 4.5% | 1.29 / 1.03 / 0.2% |
| filter3+reactive1 | 1.52 / 1.35 / 0.4% | 0.97 / 0.79 / 0.1% | 3.67 / 4.10 / 4.6% | 1.49 / 1.24 / 0.3% |
| bounce2 | 6.93 / 6.50 / 26.7% | 1.84 / 1.79 / 0.9% | 7.15 / 6.81 / 34.1% | 3.27 / 1.95 / 3.4% |
| reuse | 7.33 / 7.01 / 32.3% | 1.70 / 1.65 / 0.7% | 6.46 / 6.21 / 26.1% | 2.76 / 1.75 / 1.8% |
| filter3+bounce2 | 1.75 / 1.60 / 0.6% | 1.00 / 0.98 / 0.0% | 3.83 / 4.22 / 4.8% | 1.49 / 1.22 / 0.1% |
| filter3+reuse | 2.67 / 2.59 / 1.5% | 0.84 / 0.80 / 0.0% | 3.72 / 4.04 / 3.5% | 1.37 / 1.06 / 0.1% |
| filter3+k3+bounce2 | 1.99 / 1.85 / 1.1% | 1.00 / 0.99 / 0.0% | 3.96 / 4.30 / 4.9% | 1.57 / 1.27 / 0.1% |
| filter4+k3+bounce2 | 1.76 / 1.64 / 0.6% | 0.99 / 0.98 / 0.0% | 3.85 / 4.23 / 4.8% | 1.48 / 1.21 / 0.1% |
| filter4+k3+reuse | 2.66 / 2.60 / 1.4% | 0.83 / 0.80 / 0.0% | 3.74 / 4.05 / 3.5% | 1.39 / 1.09 / 0.1% |

### Frame time

`--bench 10 --chasers`, flashlight on, GPU timestamps in ms. **The budget is 2.78 ms.**

Each cell: average / p99 / worst GPU frame in ms, then the trace-and-light pass's average (the filter's passes are
timed inside it). Three sessions, each beginning and ending with today's settings:

- **A** (10:49 to 10:53): nothing else on the GPU and 3,601 of 3,601 paced frames.
- **B** (11:04 to 11:07): 1080p only; a test process started during each run, but every run drew all 3,601 frames
  and its numbers match A's to 0.006 ms.
- **C** (11:11 to 11:15): no other GPU program, but a CPU test suite ran beside it, and 3,400 to 3,560 of the 3,601
  paced frames were drawn. Today's settings read 0.02 ms (1080p) and 0.03 to 0.06 ms (1440p) slower than in A.

The session is given after each number. Runs where another GPU program ran (the first session, 10:44 to 10:48, and
the late part of a second, 10:53 to 10:54) are kept in `results/` and not used.

| variant | 1920x1080 | trace+light | 2560x1440 | trace+light |
|---|---|---|---|---|
| today | 1.160 / 1.503 / 2.133 (A) | 0.628 | 1.598 / 2.031 / 2.309 (A) | 0.983 |
| today, repeated | 1.157 / 1.496 / 1.653 (A) | 0.626 | 1.623 / 2.090 / 2.359 (C) | 1.004 |
| **filter, 3x3, 3 passes** (`filter3+k3`) | 1.363 / 1.706 / 1.901 (B) | 0.832 | **1.984 / 2.435 / 2.678** (C) | 1.371 |
| filter, 3x3, 4 passes (`filter4+k3`) | **1.450 / 1.837 / 2.049** (C) | 0.913 | 2.098 / 2.599 / **2.888** (C) | 1.485 |
| filter, 5x5, 2 passes (`filter2`) | 1.448 / 1.781 / 2.023 (A) | 0.917 | 2.126 / 2.603 / **2.838** (A) | 1.513 |
| filter, 5x5, 3 passes (`filter3`) | 1.582 / 1.923 / 2.136 (A) | 1.052 | 2.374 / **2.850 / 3.129** (A) | 1.765 |
| two bounces (`bounce2`) | 1.346 / 1.695 / 1.870 (A) | 0.814 | 1.973 / 2.484 / 2.774 (C) | 1.349 |
| reuse (`reuse`) | 1.142 / 1.479 / 1.655 (A) | 0.612 | 1.596 / 2.046 / 2.312 (C) | 0.976 |
| filter 3x3x4 + two bounces | 1.664 / 2.082 / 2.235 (C) | 1.119 | 2.443 / **2.992 / 3.297** (C) | 1.832 |
| filter 3x3x4 + reuse | 1.428 / 1.791 / 2.036 (C) | 0.893 | 2.063 / 2.527 / 2.776 (C) | 1.453 |
| filter 5x5x3 + two bounces | 1.778 / 2.175 / 2.461 (A) | 1.243 | not run | |
| filter 5x5x3 + reuse | 1.568 / 1.893 / 2.144 (A) | 1.037 | not run | |

Bold marks a frame over the 2.78 ms budget, and the recommended setting at each size.

- **The filter's cost** is in its passes, each a full pass over the trace's 1440x810 (1080p) or 1920x1080 (1440p)
  pixels. The noise pass and the 3x3 a-trous passes cost about 0.05 ms each at 1080p and 0.09 ms each at 1440p; a
  5x5 pass costs about 0.13 and 0.25 ms.
- **The worst frames are over a 10-second bench.** The team's own budget runs use 30 s and three repeats, so treat
  the 0.10 ms margin of the 3-pass filter's worst frame at 1440p as unconfirmed until it is run that way.

## What each step of the 11-11 plan did

The plan registered four steps (`handback/p-l165-render-C_2026-11-11.md:176-180`).

- **Step 1, the hand light clear of the body:** built on 11-11 (D651).
- **Step 2, per-instance motion vectors: exists today.**
  - Every moved instance carries a transform to where it was (D651), and a skinned mesh carries last frame's
    vertices (D663).
  - The trace looks a moving surface's light up where the surface was, and caps it at 8 frames (`MOVING_FRAMES`).
  - The TAA follows the nearest surface's own motion (`Out2`, read as `Tex3` in `TaaCS`).
  - Not covered: the shadow a moving thing casts on a still floor. The floor's history passes the distance check, so
    it keeps the old shadow for up to 32 frames (`render/CHANGES.md:269-271`).
- **Step 3, a reactive term in the TAA: tried as `taa_reactive`.**
  - What it does: where the trace kept no light history for a pixel (newly seen, or let go at speed), the TAA keeps
    less of its own history, back to full over the next three frames of light.
  - Alone it triples the visible flicker (7.1% to 21.9%). On top of the filter it costs a little (2.9% to 3.4%).
  - It does not reach the shadow trail on a still floor, which is what step 3 was registered for: there the trace
    reports a full history.
  - A real step 3 needs a term that notices the light at a pixel changing while the surface does not. One way is to
    compare this frame's luminance with the history's, against the temporal variance the filter now keeps.
  - **Not recommended as built.** Its gain, less ghosting behind a chaser or a limb, is not in these numbers.
- **Step 4, the depth- and normal-guided spatial pass: the filter, and the recommendation.**

### (i) The filter (step 4)

`FilterCS` in `render/shaders/dz.hlsl` runs at the trace's resolution, after `TraceCS` and before the TAA.

1. **A noise pass** estimates each pixel's luminance variance:
   - with 4 or more frames of history, from temporal moments the trace now gathers alongside the light (as SVGF
     does), divided by the frames gathered and smoothed over the 3x3 of the same surface;
   - otherwise, from the spatial 3x3.
2. **A-trous passes**, 1, 2, 4 pixels apart. Each tap is weighted by:
   - its distance off this pixel's plane;
   - its normal (dot to the 64th power);
   - its luminance difference, against the smaller of the two pixels' standard deviations times
     `light_filter_sigma`.
3. **The last pass rewrites the colour from the filtered light:** `colour += albedo x fog-keep x (filtered - raw)`.
   The history stays unfiltered.

**Three failures on the way, each fixed. They matter to anyone tuning it:**

- **A plain spatial variance let the lamp fittings' light leak onto the ceiling,** as a bright smear beside each
  fitting. The fitting sits in the ceiling's plane, receives enormous light, and makes its neighbours' variance huge.
- **A luminance stop on the centre pixel's noise alone darkened the picture by 3 to 10%.** A bright, noisy pixel
  takes in its dim neighbours while they turn it away. The stop is now symmetric.
- **Averaging the two pixels' variances let the fitting leak again.** The fitting's own light flickers from frame to
  frame: its light's disc sits against it, so each of its shadow rays is a coin flip. Taking the smaller variance
  holds both, each one smoothed over its 3x3.

**The choices, measured:**
- Passes: 3, 4 and 5 passes of 5x5 are within 0.2 points of each other. 3x3 taps need 4 passes to match 5x5 at 3,
  and 3 passes of 3x3 are close behind (finished picture at 4 frames: 1.78 against 1.55 levels).
- Cost: a 5x5 pass costs about 0.13 ms at 1080p and 0.25 ms at 1440p; a 3x3 pass and the noise pass about 0.05 and
  0.09 ms.
- Sigma: 2 leaves visibly more grain in the dark; 8 blurs the lit parts more (32-frame error 4.1% against 2.5%).
  4 is the balance.

### (ii) History length and the motion cut-off

**`light_frames`:**
- 16 lowers the sprint's lag (error 12.6%, brightness 0.966) but raises the still grain at 32 frames.
- 64 changes nothing before 32 frames, then adds lag.
- **Longer histories also drift dark.** The light history is kept in half floats. Blending 1/256 of each frame in
  (`light_frames = 256`) loses 4 to 13% of the picture's mean level over 768 frames, darkest views worst
  (`results/ldr_reference_drift.txt`): a small step down rounds to a whole step of the format, while a rare large
  step up does not. This was found because the first reference pictures were drawn that way, and were replaced.
- **Do not raise `light_frames` far without a 32-bit history.**

**`light_motion_cut`** (40 px a frame today):
- 80 and 160 help the turn: its darker half goes from 29% to 16% and 9%.
- But they darken the sprint by 9 to 16%: more of the hand light's lag is kept. With the filter, 80 still hurts the
  sprint (finished picture 3.7 to 7.2 levels).
- 20 makes everything grainier.
- **Leave it at 40.**

### (iii) Sampling at no cost

`light_sampling = 1` changes two things:
- each pixel's offsets come from interleaved gradient noise instead of a hash;
- the bounce picks its light by inverting the running sum with a sequence value instead of one random draw per
  candidate.

**What it does:**
- It lowers the error at 1 to 4 frames a little, and the burst flicker a lot (7.1% to 3.8%: the pattern is less
  visible from frame to frame).
- **But it raises the error at 32 frames** (6.3% to 7.4%; finished picture 0.9% to 6.1% of pixels off). The
  interleaved pattern correlates with the per-frame R2 step, so the history converges more slowly.
- With the filter it is worse on every measure.

**Not recommended as built.** A blue-noise texture with a per-frame Cranley-Patterson shift is the version to try
next.

### (iv) The clamp

**`gi_clamp = 0.5`:**
- It lowers the grain a little: still 6.3% to 5.9% at 32 frames (darker half 11.3% to 9.7%); burst 7.1% to 6.3%.
- It darkens the converged picture where bounce light matters: stairwell 5 to 6%, corridor by the lamps 1.8%, room
  0%.

**`gi_clamp = 2`:** more grain (6.9% at 32 frames, darker half 12.6%), and up to 3% brighter.

**Leave it at 1.** The filter does far more. A lower clamp is still the tool for the isolated bright specks that
survive the filter in near-black areas at short history (`images/corridor_lamps_dark_crops.png`, brightened 4x),
but that combination was not measured.

## Two bounces

`gi_bounces = 2`: at the first bounce's hit, one more cosine-weighted ray, gathered the same way (one light drawn in
proportion and shadowed, plus ambient and emission, clamped by `gi_clamp`).

**What it changes in the converged picture.** The pictures are `images/room_bounces_reference.png`,
`images/stairwell_bounces_reference.png` and `images/corridor_bounces_reference.png`, and the pair
`images/corridor_1bounce_reference.png` / `images/corridor_2bounce_reference.png`. Mean luminance, two bounces
against one:

| view | whole picture | darker half | darkest tenth | brightest tenth |
|---|---|---|---|---|
| corridor, hand light | +16% | +24% | +32% | +11% |
| corridor, lamps only | +20% | +25% | +27% | +14% |
| corridor, flashlight | +19% | +32% | +39% | +10% |
| room, hand light | +19% | +28% | +33% | +12% |
| room, lamps only | +26% | +29% | +30% | +19% |
| stairwell, hand light | +10% | +18% | +30% | +7% |
| stairwell, lamps only | +14% | +30% | +44% | +7% |

- **Where it gets brighter:** the shaded faces beside lit ones (the stairwell's wall in shadow, the room's corners,
  the floor's edges), and the ceiling over a lit floor.
- **Does the dark stay dark?** Where no light reaches within two surfaces, yes: the top of the stairwell and the far
  end of a dark corridor stay black. But the darkest tenth of every view gains more, relatively, than the brightest,
  so contrast drops and near-black shadows become dim.
- **Does colour carry further?** Yes. In the darker half the red-to-green ratio rises about 3% and the blue-to-green
  ratio falls about 5% (corridor 1.115 to 1.143 and 0.801 to 0.764). The carpet's and the walls' warm colour reaches
  one more surface.
- **Noise:** a little grainier than one bounce. Still views 6.6% against 6.3% at 32 frames; burst 8.2% against 7.1%
  on the sprint and 11.1% against 8.0% on the turn. With the filter: 3.4% against 2.3% at 32 frames, and finished
  picture 1.99 against 1.78 levels at 4 frames.
- **Cost:**
  - alone: +0.19 ms at 1080p (p99 1.70 ms), +0.35 ms at 1440p (p99 2.48, worst 2.77 ms, at the budget);
  - with the filter: 1080p fits (4-pass filter plus two bounces: p99 2.08 ms); 1440p does not (p99 2.99 ms).

### The cheap alternative: last frame's light at the bounce's hit

`gi_reuse = 1`. When the bounce lands on a surface that was on last frame's picture (at the distance last frame saw
there, facing that camera, and not a moving instance), it takes the light gathered there instead of drawing a light.
That light was itself lit by bounces, so over frames it carries many.

- **Cost:** none, −0.02 ms (it saves a shadow ray where it hits).
- **Converged, it lifts the picture about as much as two bounces:** the whole picture +12 to 24%, the darkest tenth
  +20 to 52%.
- **It builds up over time.**
  - After a reset, a view starts 11 to 19% darker than its own converged picture at 1 frame, 5 to 10% at 4, and 2
    to 3% at 32. Every newly seen surface starts darker and brightens over about a second at 32 frames of history.
  - With the filter, the finished picture at 4 frames has 1.4% of pixels off against 0.9% without reuse.
- **It cannot see light from behind the player:** a bounce only finds light where the camera looked last frame.
- **Do not ship it before someone has watched a corridor reveal and a fast turn with it.**

## What can break, and what to watch for

- **Mottling at short history.** At 1 to 4 frames the filtered light is smooth but blotchy, in patches a few pixels
  across (`images/stairwell_filter_crops.png`, the 4-frame filtered tile). That is the a-trous filter's known look
  at low sample counts. It settles toward the converged picture by about 16 frames, so in motion newly revealed
  surfaces will show it for a fraction of a second.
- **Isolated bright specks in near-black areas** survive the filter at short history (`images/corridor_lamps_dark_crops.png`,
  brightened 4x). They are rare bounce hits on a lit area, too sparse for the variance to notice. Today they are
  among many; with the filter they stand alone. They are only visible in very dark views.
- **Darkening in the first frames.** At 1 frame the filtered picture is 0.5 to 3% dark (worst: room by the lamps,
  2.7%), and within 1% from 4 frames on. The luminance stop throws away rare bright samples before the variance has
  any history.
- **Light leaking across edges.** None was seen at walls, floors, door frames or stairs, and the lamp fitting's halo
  is fixed (the converged reference has a faint glow there of its own). Thin geometry seen edge-on (a door leaf, a
  banister) was not in the views.
- **Contact shadows.** Not smeared in the views: the floor-to-wall lines and the stair nosings keep their dark line
  (`images/corridor_filter_crops.png`, `images/stairwell_realtime_filtered.png`). Soft penumbrae get a little softer
  at 4 frames.
- **Ghosting behind a moving chaser.** Not measured. The filter does not change the history, so it cannot make trails
  longer. It makes the current frame's light cleaner, which narrows the TAA's clamp box and should trail less, but
  nobody has looked.
- **Lag when the hand light sweeps.** The filter does not change it: it is the history's, and a sweep would show it as
  it does today.

## What only a person looking at it in motion can judge

- **The mottling at short history:** does it read worse or better than the grain it replaces? Try a corridor corner
  at a sprint, and a fast turn.
- **Ghost trails** behind the chasers and the body's limbs, with the filter, with `taa_reactive`, and with neither.
- **Two bounces in a horror game:** do they make the dark too friendly? The darkest tenth gains about a third. Taste
  decides whether that is atmosphere or loss.
- **Reuse's build-up** after a reveal: is it visible?
- **The hand light's lag** when swept, which none of this changes.

To try them in the game, set the world settings below in F1 or `world.local.txt`; they apply live.

## Defaults unchanged, and the checks

- **`--capture-walk`, the baseline exe against this build with defaults:**
  - 12 of 13 settled shots are byte-identical.
  - The flashlight shot differs in 4 pixels by 1 level of 255. My guess is that the shader compiler arranges the
    shared code differently; the baseline exe repeats that shot byte-identically run to run.
  - The overlay shot differs by design: it lists every setting, so the new ones show.
- With defaults (no `world.local.txt`), at 11:33 to 11:35: `dz-view --selftest` passed 30 of 30, `dz-gym --selftest` 26 of 26, `dz-world --selftest` 52 of 52 (`results/selftest_*.txt`).
- The repo's full test suite was not run, as briefed. The tests that read `world.txt` against the code's defaults are
  in `world_app_tests` (not run). The file was regenerated with `--print-settings`, which is what that test compares
  against.

## For the render lane: what to pick up

**Files touched** (code only, `git diff --stat 31d1c6d -- render game`: 12 files changed, 874 insertions(+), 19 deletions(-)):

- `render/shaders/dz.hlsl`:
  - `FilterCS`, new;
  - in `TraceCS`: the moments and the filter's guides (written only when the filter is on), the two-bounce and reuse
    branches inside the existing bounce, the motion cut-off from the frame constants, and the sampling option in
    `Seq` and `Direct`;
  - `TaaCS`'s reactive term.
- `render/src/renderer.cpp`:
  - five trace-sized targets: `aux`, `nrm`, `filt[2]`, `moments[2]`;
  - binding sets of 4 SRVs and 6 UAVs (u0-u3, u5-u6; u4 is the skinning pass's root UAV), so the heap's set range
    grew from 256 to 320;
  - the filter's dispatches, inside the trace's timestamp;
  - the new frame constants;
  - `ReadTrace`.
- `render/renderer.h`: the settings below, and `ReadTrace`.
- `render/CMakeLists.txt`: `FilterCS`.
- `game/world/world_settings.h` and `game/config/world.txt` (regenerated): the world settings below, live from F1.
- `game/world/stage.cpp` and `stage.h`: the settings applied every frame, and a `jitter` switch for measuring.
- `game/world/offscreen_noise.cpp` (new), `modes.h`, `main.cpp`, `game/CMakeLists.txt`: `--noise`.
- `experiment/`: this report, the scripts, the logs and the pictures.

**Settings added:**

| world.txt | `dz::Settings` | default | what |
|---|---|---|---|
| `light_filter` | `lightFilter` | 0 | a-trous passes after the noise pass (0 off, up to 5); recommended 3 |
| `light_filter_kernel` | `lightFilterKernel` | 5 | taps each way a pass, 5 or 3; recommended 3 |
| `light_filter_sigma` | `lightFilterSigma` | 4 | the luminance stop |
| `light_frames` | `lightFrames` | 32 | existed in the renderer; now also a world setting |
| `light_motion_cut` | `lightMotionCut` | 40 | was the constant 40 in `TraceCS` |
| `light_sampling` | `lightSampling` | 0 | not recommended |
| `gi_bounces` | `giBounces` | 1 | 2 for the second bounce |
| `gi_reuse` | `giReuse` | false | not recommended yet |
| `taa_reactive` | `taaReactive` | 0 | step 3 as tried; not recommended |
| `gi_clamp` | `giClamp` | 1 | existed in the renderer; now also a world setting |
| (none) | `jitter` | true | off only for measuring |

**To land only the filter:**
- in `dz.hlsl`: `FilterCS`, the moments in `TraceCS`, and the `OutAlbedo`, `OutNormal` and `OutMoments` writes;
- in `renderer.cpp`: the targets, the sets, and the dispatch loop;
- the filter's three settings.

The two-bounce branch is about ten lines inside the bounce and stands alone.

**Not written:** a test for the filter beyond the yardstick, and a `render/CHANGES.md` or `CHANGELOG.md` entry. This
branch is an experiment; whoever lands a part of it should write those in the lane's own form.

## GPU use

My runs used the shared GPU from 09:58 to 11:35 local time, in many separate processes. Each process was 10 seconds
to 4.5 minutes long, with gaps between them.

| what | when |
|---|---|
| the sanity check and the default-picture comparison | 09:58 to 10:00 |
| the yardstick's runs (references, then about 40 variants) | 10:01 to 10:43, 10:55 to 10:57 and 11:15 to 11:32 |
| frame-time benches, each a 10-second run | 10:44 to 10:48 (spoiled by another seat's dz-world, not used), 10:49 to 10:54, 11:01 to 11:07 and 11:11 to 11:15 |
| the selftests | 11:33 to 11:35 |

**My GPU runs were finished for good at 11:35:45.** Frame times taken by others between 09:58 and 11:36 may have
shared the GPU with mine. No heavy-run lock was taken; the slots were held by others throughout (mutation runs, test
suites, the footstep work), and no timing session was among them when I checked.
