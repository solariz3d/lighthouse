# The tell row, re-registered before its run (pane E, machine D, 2026-11-13)

Packet: the chair, 20:48:30Z ("YOU OWN THE ROW FROM HERE … RE-REGISTER IT BEFORE THE RUN"), after my answer
`handback/p-tell-row-answer-E_2026-11-13.md` (582a994d). Tier: **prove it**.

**The row:** `dz-world --selftest` part 10, "its tell is a light that was not there and a sound that grows"
(`game/world/selftest_run.cpp:296-340` on 31d1c6d). That file is mine for this row only.

**Where the change goes:** a new dreamzone-3 branch **`tell-row-e`**, off origin/main 31d1c6d, in my own worktree.
It touches `game/world/selftest_run.cpp` and nothing else, so B's `gen-lap2-kit` can merge it as it is, and so can main.

## What the row becomes

1. **The light, unchanged.** None before the tell, more than 0.5 during it, and the tell reaching above 0.9.
2. **The tell in its own band.**
   - The rendered mix (`listen()`'s samples, both channels' mean) is band-passed to **660–880 Hz**: a 4th-order
     Butterworth band, two 2nd-order sections run forward. The tell's note is 660 × (1 + 0.33 × fade) Hz.
   - The hunter's tone (44–88 Hz) is left **in the mix**, as the ruling says, and the band leaves it out of the reading.
3. **It grows through the tell, with the tone present.** Standing in the reprieve, the band's RMS:
   - in the tell's last third is at least **1.25 ×** its RMS in the quiet window, plus 1e-4. That is the old row's
     factor, kept.
   - in the tell's last third is above its RMS in the tell's first third.
4. **The quiet window, after the room's decay.**
   - It opens when the room's decay (`scene.room.decay_s` at the listener, its RT60) has passed since the last sound of
     going in: the last landing (`scene.landings` rising) or the last tick the player moved (speed of at least
     0.1 m/s).
   - It closes when the tell starts.
   - **It must hold at least 1 s of samples**, or the row reports NOT MEASURED and counts as red. A window that cannot
     be measured is not a pass.
5. **Its own visit to a reprieve.**
   - With the hold at 5 s and the tell at 3 s, there are 2 s before the tell. A room can take 4 s to decay
     (`acoustics.cpp:35`), so the window would not fit.
   - So the tell row takes a reprieve visit of its own, with `reprieve_hold_s` at **9 s** (tell 3 s): 6 s before the
     tell, room for a 4 s decay and a 1 s window and 1 s of walking in.
   - "A reprieve holds for its time" keeps its own visit and its 5 s, unchanged.
6. **Two places, each its own case:**
   - **A ONE-STOREY PASSAGE:** a reprieve whose link is not a chute (every reprieve on main).
   - **A CHUTE'S RUN:** a reprieve whose link is a chute (`LinkKind::Chute`, B's kit). On a world with no chute, this
     case prints **NOT RUN** and the row says so. It is not counted as a pass.
7. **Printed at both windows, for each case:**
   - the hunter's distance (`scene.hunter_distance`), its mean and range;
   - the room's decay (`scene.room.decay_s`);
   - the tell's level (`run.reprieve_tell()`), its mean and most;
   - the band's RMS;
   - the whole mix's RMS, so the old row's reading stays visible beside the new one.

## What would count against it, registered now

- **The row is wrong** if, on main's passage, the tell in its own band does not grow by 1.25×. The tell grows with
  `fade` alone (`mixer.cpp`, `Reprieve::block`), so a failure there means the band or the window is badly made, and I
  say so.
- **The kit changes the tell** (a valid answer, the chair's words) if the band grows on the passage but **not on the
  chute's run**. Then the row stays red for the kit, reported as the kit's.
- **My answer was wrong** if, on the chute's run, the hunter's distance does not differ between the windows, the room's
  decay is short, and the band still fails. Then what I named was not the cause.

## The run

**One run, when no game of his is on the card.** I read the lock slots, the hold file and the running processes at
its start and its end, and write them beside the table. The run is `dz-world --selftest` on `tell-row-e`, and on
`tell-row-e` merged with `gen-lap2-kit` (in a scratch worktree, never pushed) for the chute's case. The printed table
goes to the librarian.
