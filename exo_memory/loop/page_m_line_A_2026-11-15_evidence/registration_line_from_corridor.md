# The line from the corridor and its speed: registered before code (2026-11-15 ~08:50 local, seat A; ruling item 2, first of three)

## What is built (behind the root's switch; today's law untouched)
`plan_to` for a root body turns the string Detour gives into a line: at each corner of the string, the widest arc tangent to its two legs that
stays on the mesh (every 0.25 m sample's nearest mesh point within 2 cm across, at the body's radius plus 0.2 m from the mesh's edge,
`open_along` sideways), its tangent points no further from the corner than half of each leg; the arcs joined by the legs' straights; the line
handed to the root as its path of dense points. The speed is the root's own plan over those points (M2, unchanged); the fixed-line test shows
it holds a 4.6 m arc at 5.76 m/s.

## Rows, red first on e040a87 (the string as today)
- **The three bends** (pane E's door and target, the chase's arena at gen seed 1, no replans, both ways): the plan's bar (0.889 s for 22
  degrees; never under 1.2 m/s) as checks; my registered predictions (22: 0.60 s and 6.0 m/s; 45: 0.60 s and 8.0; 90: 0.70 s and 7.5) printed
  met or not.
- **The ten corner routes:** wall contacts above 0.3 m/s at most 10 an arm (registered prediction), head-on ticks 0; printed beside today's.
- **Every line sample on the mesh** with its room.

## Named now, before it runs
- **The side of the post is the planner's, not the line's.** Detour's A* picks the shorter string, and at E's 22 degree bend that is the south
  way through two doorways each with about 0.25 to 0.5 m of free mesh; widest arcs there are about 2 m (grip about 4.4 m/s). So the line from
  the corridor may **fail the 22 degree bar** where the hand line north of the post passed (0.321 s). If it does, that is the finding: the
  line needs the planner to choose a side by time, not length. It is then the next registered step (cost the corridor by the line's time), and
  the bar is not moved.
- The 45 and 90 degree bends have one way each (E's manifests: "clean path" before and after), so they test the arcs alone.
