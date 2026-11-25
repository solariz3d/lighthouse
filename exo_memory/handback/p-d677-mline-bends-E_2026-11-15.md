# Hand-back: the 22 degree bend, today's law beside the new line, on a-mline (pane E, machine D, D677)

The chair's order: the 22 and 90 degree bends on dreamzone-3 a-mline `4b03985`, today's law beside the new line, fixed camera,
lit, real speed and three times slower, small, frames to Z: after. Cut by the librarian's ring of 16:33:21Z to **the 22 only**.
The cut reached me queued, after the 90 was filmed; the 90's clip is kept below, labelled, and is not for his page.

## For his page: the 22 degree bend

- Real speed: `G:\consonance-scratch\mline-bends-clips\bend22_today_vs_newline_realtime_144fps.mp4` (640 KB)
- Three times slower: `G:\consonance-scratch\mline-bends-clips\bend22_today_vs_newline_3x_slower.mp4` (867 KB)

Today's law is on the left, labelled "TODAY (the law in the game now)", and the new line (`--chase-speed "root_law=1"`) is on the
right, labelled "THE NEW LINE". The picture is 1280×360 and says "LIT FOR THE FILM, camera fixed to the travel".

The figures are from each film's own manifest (`grep '^the hunter' <dir>/manifest.txt`). They reproduce A's:

| law | on entry | lowest through it | between the gates | hidden frames |
|---|---|---|---|---|
| today | 9.19 m/s | 0.04 m/s | 0.889 s | 0 of 417 |
| the new line | 5.47 m/s | 5.47 m/s | 0.486 s | 0 of 359 |

**Looked at:** one frame from the slow clip, 3.5 s in. Both bodies are whole, head to feet, and lit, and the labels read. In
today's half the hunter is at the inner wall of the bend; in the line's half it is already past.

## Not for his page: the 90 (filmed before the cut arrived)

- `G:\consonance-scratch\mline-bends-clips\bend90_today_vs_newline_realtime_144fps.mp4`
- `G:\consonance-scratch\mline-bends-clips\bend90_today_vs_newline_3x_slower.mp4`

| law | between the gates | lowest |
|---|---|---|
| today | 0.819 s | 3.86 m/s |
| the line | 1.319 s | 1.41 m/s |

The camera is one place in the room, the bend's outer corner.

## The staging (my own, local only)

**Tree:** `G:\consonance-scratch\dz3-e-mline` at `b1b3aeb`, local and never pushed:
- `694b6b0` is a-mline `4b03985` merged into main `79326e4`.
- `b1b3aeb` changes `game/world/corner_film.cpp` so the lit pass uses a fixed camera, where before it followed the hunter's chest
  and turned with it.
- The manifests' build stamp reads `694b6b0+changes`, because the films were made before the commit.

**How the camera is chosen:**
- **Fixed to the travel:** one offset from the chest for the whole window, aimed at the hips, with a 70° field. It is chosen by
  the world's ray to the chest on every kept frame.
- **At a bend of 60° or more:** one place in the room comes first, the bend's outer corner under the ceiling, aimed at the middle
  of the chests. This only reached the 90.
- **Refusal:** the film is refused only when more than a tenth of the kept frames are hidden, as `--pair-fixed` does.

**Corrections, made by looking:**
- **The first set** (50° field, aimed at the chest): the feet were cut at the 22.
- **At the 90:**
  - the first travel offsets were refused: 61 frames hidden;
  - the next stood within a metre of the body and lost it in the dark;
  - the outer-corner place, aimed at the apex, looked at the floor.
- **The clips are made from:** the 22 from the second set, the 90 from the fourth.

**Frames, on Z: now** (4 folders, every file count and size matched after the move):
- `Z:\consonance-archive\2026-11-15-films-E\mline-bends`
- `Z:\consonance-archive\2026-11-15-films-E\mline-bends-v2`
- `Z:\consonance-archive\2026-11-15-films-E\mline-bends-v3`
- `Z:\consonance-archive\2026-11-15-films-E\mline-bends-v4`
