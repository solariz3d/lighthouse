# Brief: T-180, the bumps at piece joints (bank and climb), and 0.4.39

## His words (verbatim, never summarized; newest last; times UTC, all on D)
- Undated, his screenshot named "EVERYTIME there is a banked piece that tries to bank back towards center or another banking there are
  rank bumps" (saved beside this file as `t180_joint_bumps_bank_back_to_centre.png`).
- 2026-11-03 01:06Z: "i made a new test track, RIBBON CORKSCREW TEST, you can see from different banking pieces, on some turns there are
  bumps from connecting different banking, it is shown completely with the telemetry going through the last straight ribbon section that
  goes banked 90 degrees all the way around 360 degrees, double bug also, when you make the track go all the way around say -360 degrees,
  it only hits 359.99 and then glitches out, so if you make a spiral it wont go all the way around without glitching"
- 2026-11-03 12:30Z: "its like nothing was even fixed............................................. still feels close to the same, and
  not just the ribbon: [his image #219, not saved; the file is not on disk under a name I can find]"
- 2026-11-03 12:39Z: "but see i wonder if we could eliminate the joint bump altogether, right now in most cases it is so subtle most
  players wouldnt care compared to the joints left by handmade tracks, but i want it to be as perfect as we can! I notice it with my
  perception"
- 2026-11-03 19:23Z, on the Sharp grab trade: "I think that is a good one to atleast test"
- 2026-11-03 19:48Z: "the banking is close to if not perfect, but i still notice i swear the same pattern with the climb making bump
  somewhere close to the connection of the piece you know? Look at the track geometry"
- 2026-11-03 ~19:55Z, his screenshot "downward on the mega drop lets you see what I mean about the bump with the climb that is where the new
  piece then starts climbing back up with banking" (saved beside this file as `t180_joint_bumps_mega_drop_climb_2026-11-03.png`).
- 2026-11-03 20:02Z: "I like the idea of 2, but almost wish we could just make the generation system one shot this problem on its own not
  making a new layer to fix it"
- 2026-11-03 20:26Z: "1 yes. 2. how can you fix the banking without changing the trrack but the climb is different? Why cant you figure out
  how to do it the same way banking was"
- 2026-11-03 23:35Z, on re-laying his saved ELYSIUM: "as long as the generation system as it fixed we are good"
- 2026-11-03 23:47Z: "i believe it works, push and commit it to repo, but no release yet, i want to keep working on it at work later
  tonight"
- 2026-11-05 06:32Z (L), on the release: "I havent tested 4.39 enough but it should still be better than the current release". Same turn, on the stick: "dont worry about the stick it can stay how it is unactive".

## The problem, in one line
Where one piece hands over to the next, the bank or the climb changed too sharply and he felt a bump; he wants the builder itself to lay
joints that are smooth, with no extra smoothing layer.

## State (summary; check it against the repo)
- **Bank joints: fixed** (D626). Rounded bank corners. On his ribbon the worst joint jolt went from 680x mid-piece to 2.6x. Page:
  https://claude.ai/artifact/TnvzJjXHBWVzjh6VFPmcZt. Hand-back `handback/p-d626-reversal-joints-E_2026-11-03.md`.
- **Climb and turn joints: fixed in the writer** (D637, his 20:26Z "1 yes"). An early turn or climb now eases in over a length sized to its
  change (at least 20 m, at most half the piece) instead of a fixed 20 m. Hand-back `handback/p-d637-turn-climb-joints-E_2026-11-03.md`.
  His saved tracks do not change; only newly laid pieces do.
- **His saved ELYSIUM NEW: left as it is**, at his 23:35Z word. A re-lay with the new writer is refused by the builder (p33 would land on
  p29). `handback/p-d638-regen-E_2026-11-03.md`.
- **0.4.39 = t180 main `d10eacf`**, pushed 2026-11-04, CI green, installed on D. **Not released, no tag.** The laptop's second-bank branch
  `l135-second-bank` (`0df08db`) sits on top of it (`briefs/t180_second_bank.md`).
- **Open, his calls:**
  - the release, after his drive;
  - his named yes on the Sharp grab trade for the release (his 19:23Z words cover testing only): on a 60-degree road the rims move up to
    126 mm out to 53.5 m from the grab;
  - Straight: keep the longer ease-out (up to half the piece), or back to 20 m.
- **The -360 glitch in his 01:06Z words: fixed for the first full roll** (D624, read as the bank rolling a full turn; `handback/p-d624-ribbon-bank-E_2026-11-02.md`:12-26). **Open, his call** (same file :29): a SECOND full roll still follows the old one-turn rule, so typing -90 after -360 unrolls 270 degrees.
- **Open, not his:** drag-frame row 1
  misses its handle intermittently, and sculpt-frame row 2 is 15 ms against 9 (P, `handback/p-d625-land-0439-P_2026-11-03.md` r4.4).
