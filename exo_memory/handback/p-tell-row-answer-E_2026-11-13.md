# The tell row on B's kit: what sounds there during the tell, and whether "the sound of going in has died away" holds after a chute fall (pane E, machine D, 2026-11-13)

The question, owed since 11:07 (the chair's 20:41:24Z packet; B's `p-gen-lap2-kit-B_2026-11-13.md:249`). The row,
`dz-world --selftest` part 10, "its tell is a light that was not there and a sound that grows": the mix in the tell's
last third (0.0972) against the second before the tell (0.1018) in a chute's run. Main read 0.1247 against 0.0945 in a
one-storey passage. **An answer, not a fix.** It is read from the code on main 31d1c6d (`audio/mixer.cpp`
`mix_block` :1366-1452 and `Reprieve` :676-735; `game/world/selftest_run.cpp` :270-340). **No world run was made**: his
game is on the card, and a run would put the GPU under it.

## What the row measures

checked: `selftest_run.cpp:296-318`

- `listen()` renders 1/60 s of **the whole mix**: both channels, after the limiter and the master level.
- The two windows are taken while the player stands inside the reprieve:
  - "quiet" is 1 to 2 s after going in;
  - "loud" is the tell's last third.
- **The row measures everything sounding, not the tell.**

## What sounds inside a reprieve, and how the reprieve treats it

checked: `mixer.cpp:1366-1412`

| sound | in a reprieve | in the room's reverb? | in this row |
|---|---|---|---|
| lesser chasers | held down 60%, muffled | yes | none: `lesser_max` is 0 (:281) |
| the hunter's footfalls | held down 60%, muffled | yes | by its distance |
| **the hunter's tone** | **NOT held down** | no (in no place) | **by its distance alone: nothing at 30 m, full at 5 m, up to 0.22** |
| **the player's own steps and the landing thump** | **NOT held down** | **yes** | standing in both windows, so no new steps; what is left is the reverb tail of the steps and landing that brought him in |
| the place's ambients | held down 50% | yes | lamps and appliances near |
| the reprieve's hum | rises with being in | no | about 0.045 × (1 + 0.5 + 0.25) in sines |
| **the tell** | pulses of 660–880 Hz, at `fade × (0.14 + 0.36 × fade)` | no | grows over the tell |
| the bed | held down 50% and dulled | no | **zero**: the self-test sets `bed_volume` to 0 (:108-111) |

## The answer

1. **What sounds there during the tell:** the hum and the tell, both in no place. Beside them, the hunter's tone,
   whose level is the hunter's distance and which the reprieve does not hold down, and the hunter's footfalls, held
   down. Then the ambients, held down, and the room's reverb carrying whatever is left of going in.
   - inferred, from the levels: **main's "quiet" second already reads 0.0945, about three times the hum alone, before
     any tell.** So most of what the row hears in both windows is not the reprieve's own sound.
   - inferred: the largest candidate is **the hunter's tone**. It is not held down in a reprieve, and at full it
     outweighs the tell (up to 0.22 against the tell's roughly 0.1 RMS at its height).
   - So the row reads the hunter's approach as much as the tell. On main's one-storey passage the hunter came nearer
     through the tell, and the mix grew. In a chute's run, inferred, the hunter cannot follow straight down, so its
     distance need not fall through the tell, and the mix need not grow, though the tell does.
2. **"The sound of going in has died away by then" is not guaranteed after a chute fall.**
   - The landing thump and the steps go into the room's reverb, and the reprieve does not hold them down.
   - The room comes from the listener's cells by Sabine's formula, and its decay runs to `kMaxDecay`, **4 s**
     (`acoustics.cpp:39`), with tall cells counted in (`tall()`, :60).
   - A tail with a 4 s decay is still about 15 dB down only 1 s later, and the "quiet" window starts 1 s after going
     in. In a short room (main's apartment, about a third of a second) it has died away; **in a tall one it has not.**
     inferred: whether the reprieve at a chute's foot is in a tall room depends on how B's chute cells count in the
     room, which I have not read on B's branch.

## What would settle it (one run, when the GPU is free; not mine to make while he plays)

Print, at both windows, beside the row's two figures:
- `scene.hunter_distance`;
- the room's `decay_s` at the listener;
- the frames since the last landing;
- the tell's own level (`Reprieve::tell`).

If the hunter's distance falls through main's tell but not through the chute's, the row is measuring the hunter, not
the tell. **The tell's own sound grows in both**: its level is a function of `fade` alone. A row that wants "a sound
that grows" could read the tell's own band (its pulses are 660–880 Hz), or the mix with the hunter's tone left out.
That is a choice for the row's owner, not made here.
