# L259 track 5, pane O: registered BEFORE the Line-against-Road survey runs

Question: can the follow tool read Line alone (the AI line's points, its sideLeft/sideRight and its normals), or must it read Road too
(the kn5's valid-track mesh, walked across by tools/piecewise.cjs crossSection, the studies' own centre)?

Instrument: o_follow_survey.js on f3cd425 (scratch export), every installed layout with an AI line, a station every 20 m along the line.
At each station: the mesh's cross-section through the AI point (piecewise.cjs crossSection; downBand where the walk reads under half the
AI width, as meshCentreline does). Measured, per station:
- midOff: the AI side-midpoint (p + across * (sideLeft - sideRight) / 2) to the mesh centre, in metres (3-D).
- lineOff: the AI point itself to the mesh centre (the racing line's swing), in metres.
- widthDiff: |(sideLeft + sideRight) - mesh width|, in metres.
- bankDiff: the angle between the AI normal (ribbon.js's frame) and the mesh normal at the centre, in degrees.
- noRoad: no mesh cross-section at the station.

Decision rule, fixed now:
- **Line alone serves** only if, on at least 90% of the layouts that read, ALL of: midOff p95 <= 1.0 m; widthDiff p95 <= 2.0 m;
  bankDiff p95 <= 3.0 deg; noRoad <= 2% of stations.
- Otherwise the tool reads **both**: Line for the order and the way, Road for the centre, the width and the bank.
- Why these bars: [T4]'s position tolerance was 2.0 m horizontal and its bank 3.0 deg, [T3]'s width 2.0 m; a source must be inside the
  tolerance with room left for the lay's own error, so the centre is held to half of [T4]'s 2 m.

Unwelcome outcome, named: "Line alone serves" would make the plan's Road half (a ray index over up to 3.2M triangles in the page)
unnecessary cost. "Both" is my lean before the run, because the studies' read was mesh-centred; that is my bias, stated.
