# Measure the real T-180 test track's cross-section, to shape the edge curve. Librarian, on D, 2026-10-03 07:5x.

The keeper, 07:54: "look at how t-180 test track is", right after describing the edge curve (`loop/plan_t180_edge_curve_2026-10-03.md`).

## The track (checked: `ls` of AC's tracks folder)
`G:\SteamLibrary\steamapps\common\assettocorsa\content\tracks\ohyeah2389_t180testtrack\` (`ohyeah2389_t180testtrack.kn5`, `ai\`, `data\`,
`extension\`). This is the T-180 author's own test track.

**Prior measurement:** D184 (`handback/p-d184-read-B_2026-09-28.md:107`) used it only for a Fourier count along the path. **Its
cross-section was never measured.**

## The measurement (READ-ONLY, measurement tier: scripts under the heavy-run lock; C, who measured the fonts)
- Read the road mesh with the repo's kn5 reader (the D184 / track-equations tools). Take the road surface only, not walls or terrain.
- At ≥ 40 stations along the centreline (from `ai\fast_lane.ai` or the mesh's own path), cut a cross-section perpendicular to the path.
  Express each one as **surface angle ψ vs lateral position u** (centre 0, edges ±1), bank removed (the angle at u = 0 subtracted).
- **The question:** is the profile ONE curve (uniform, like the cup), or TWO (a flatter middle and a steeper outer band, the keeper's edge
  curve)?
  - Fit each section with the edge-curve model (middle: today's cup profile; outer: + e · G((|u| − s)/(1 − s))) and with cup-only.
    Report both fits' error.
  - If two zones fit better, report **s (where the slice sits)** and **e (the extra edge angle)**, as medians and ranges over the
    stations, split by straights and turns. Also report whether it is symmetric or steeper on the outside of turns, and whether the
    angle is smooth at the slice (G1/G2) or kinked.
- **Pictures for the keeper:** a PNG of 4–6 representative sections (straight, entry, apex, exit), with the edge-curve fit drawn over them.
- **Output:** `loop/t180_testtrack_profile_2026-10-03.md` + PNGs in a `_evidence` folder. Nothing in the app changes.
- **What it is for:** the edge curve's defaults and ranges come from the real track, not a guess. If the test track is one uniform curve,
  that is reported too, and the edge curve stays the keeper's own invention.

NEXT: chair dispatch the test-track profile measurement to C now (read-only, parallel to D222) when this plan is read
