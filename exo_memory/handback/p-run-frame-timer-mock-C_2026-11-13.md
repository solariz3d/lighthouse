# p-run-frame-timer-mock-C: the run's timer in its last minute, a mock still before it is built

Pane C (seat 0845a868), 2026-11-13. The packet: the chair's 10:14:38Z, his picks (brief item 183,
`briefs/dreamzone2_the_game.md:1220-1268`, 394b2298; the routing `loop/plan_13h_run_2026-11-13.md:84-86`).
`run_frame-1`, "Late warning only" (as he read it: "Show it only in the last minute; one extra screen state"), NOT the
default, which showed nothing. Nothing is built; this is the still for his eye before it is.


## WHERE IT STOPS (L, 13:2xZ)

- **Nothing is built.** The run's frame (lane C item 4) was not started today: L200 came first, and the chair's
  close-out allows it only if L200 is READY by 13:35Z (it is not started either way, being a new build).
- **Branch:** dreamzone-3 `origin/d673-frame` 8614983 (the frame's first half, from 2026-11-12). Its run-record hunks
  are CARRIED by A's Lap R (landed, `l197-record` in the batch 7fe12dd): drop them when rebasing (the chair's
  09:41:21Z ruling) and ask A on the board for any field the frame still needs.
- **His picks for it** (brief item 183; plan :84-86, :192-226): the timer shows in the LAST MINUTE only; one
  difficulty, brutal, 10 minutes, the length one named setting, nothing per difficulty; a void in overtime saves you;
  Parks close in overtime; the dark one wears the hunter's shape; the title "The Absolute" behind one constant (the
  chair's 12:08:22Z rider: game/world now, game/gym left or posted first, no window found by title broken).
- **The two stills for his choice:** `timer_mock_last_minute.png` and `timer_mock_it_is_coming.png`, with their HTML,
  in `Downloadsdreamzone-3-l195-arm-variants` (L-ONLY; the HTML is also in the scratchpad, `l195	imer_mock*.html`,
  L-only). Both say "normal" in the score line, which one difficulty (brutal) has since made wrong.
- **The exact next command** (desktop): `git fetch origin && git checkout -b d673-frame-2 origin/d673-frame && git rebase
  origin/main`, dropping the run_record hunks, then the frame per plan_d673 with his picks above.

## For his eye

- **The still:** `Downloads\dreamzone-3-l195-arm-variants\timer_mock_last_minute.png` (1920x1290: the 1920x1080 frame,
  then a strip of notes under it). The HTML that draws it is beside it.
- **What is new is one amber line under the score, only in the run's last minute:** "in 45.8 s it comes for you
  itself", counting down to overtime. **All of it is OURS:** the words (after item 66, "the evil god then comes to you
  himself"), the colour and the place (both copied from the head-start line the HUD already draws, "it comes through the
  door behind you in 3.2 s", `hud.cpp:84-86`), and the tenths.
- **Everything else is today's HUD, unchanged:** the clock counting up (44 px, white, `hud.cpp:80`), the score and level
  (20 px, dim, `:82`), the speed and the controller's state at the bottom left (`gym/screen.h:91-105`), the centre dot
  (`:107-110`). Before the last minute nothing says a limit exists, as today.

## How it was drawn

- Sizes, colours and positions are the HUD's own at a 1080-line picture (`scr.s` = 1, `gym/screen.h:36-44`): the clock
  at y 26, the score line 2 under it, the new line 6 under that, as the head-start line is placed. Font: Segoe UI, as
  `world/stage.cpp:232-234` loads. The text shadow is the HUD's (offset 0.06 of the size, `kShadow` 0,0,0,190).
- The background is a real first-person frame of the game: L174's sprint burst, frame 20
  (`Downloads\dreamzone-3-l174-fpbody-captures\run_bursts_after\sprint_20.png`, 960x540), upscaled, so it is softer than
  the game.
- Shot with Edge headless from `scratchpad/l195/timer_mock.html`.

## Open, for him

- The words. Others in the same voice: "45.8 s left before it comes itself", or just the countdown "0:45.8" in amber.
- Whether the line should grow or redden in the last ten seconds. That would be a second screen state, which his pick
  did not ask for, so the mock does not.

## A second wording, offered (the chair's 11:58:50Z packet; his story_lore-5)

His note on `story_lore-5` ("Unnamed until chapter 5"): "I like the ambigious "It" is coming." (brief item 183).
- **The second still:** `Downloads\dreamzone-3-l195-arm-variants\timer_mock_it_is_coming.png` (its HTML beside it): the
  same HUD with the amber line **"It is coming   0:45.8"**, the countdown in m:ss.s like the HUD's own clock.
- Both stills are for him to choose between; the colour and the place stay OURS in both.
- Not built; the run's frame comes after V1's landing and the legs (lane C item 4). For that lap: 10 minutes at brutal as
  the default, the length one named setting, nothing wired per difficulty (`run_frame-2`, plan :192-216).
