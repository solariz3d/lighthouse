# Checklist: the combined test build (DRAFT, finished when the build rings)

For him, in plain words, after he says yes to the install. The build is `landing-1128-combined`. Each line is one thing to
try and what he should see. Anything that surprises him is the finding.

## 1. Width holds after a brush
- Brush the width near the road's end, then press Extend with the fields as shown.
  - **Expect:** the new piece keeps the width you brushed to. Before, it carried the change on and could go negative.

## 2. The ghost sits on the road
- After a grab or a nudge near the end, hover Extend.
  - **Expect:** the ghost lies exactly where the piece will go.
  - **You may see:** the ghost swing sideways or climb. That is where Extend has always laid the piece; the old ghost hid
    it. (Open question 5/16: should the next piece start steady instead?)
- The case where your current build shows a red "no preview" note after a width grab.
  - **Expect:** a ghost and no note.

## 3. The grab along the slope (the one to judge by feel)
- On a banked turn, grab the edge and pull it sideways.
  - **Expect:** the bank stays where you set it. Today it tips about 5°.
  - **Feel for:** the grabbed point rides up or down the slope, away from your cursor (about 1.5 to 2 m on a 20° bank).
- On a tube, grab partway up the wall and pull sideways.
  - **Expect:** the tube no longer rolls. It sinks and slides instead, and the point ends below the cursor.
  - **Ask yourself:** did you use that roll?
- A flat road, with or without a cup, grabbed at the edge.
  - **Expect:** no change from today.
- **The question for you:** keep it, or go back to today's grab?

## 4. Even, the clean road (your "B")
- Even a stretch you've pulled with grabs, in the middle of a track.
  - **Expect:** the pulled edge goes back in line with the road on either side, and the message says how far it moved and
    where.
- Even a stretch that starts at the beginning of a track.
  - **Expect:** the width is evened, your pulled edge stays where it is, and the message says why.
- Even a stretch you never touched.
  - **You may see:** a small move, about 0.36 m, in the lead-in before the stretch, reported in the message. This is a known
    quirk, older than tonight.
- Drag with Even on your biggest track.
  - **Expect:** about 0.2 to 0.3 s per step, and a pause of about 1 s when you let go.

## 5. Your tracks
- Open three of your own tracks, Undo and Redo a few steps, and save.
  - **Expect:** nothing changes that you didn't change. Checked on copies before the build; this is you seeing it.

Going back: the build you run now is backed up beside the new one, and one step restores it.
