# D282: the Sharp turn type's bar, REGISTERED before E's code lands (pane B, 2026-10-09 20:5x)

Plan: `exo_memory/loop/plan_t180_sharp_turn_type_2026-10-09.md`, the bar at lines 29–39. The measured basis is `exo_memory/loop/sharp_turns_measure_B_2026-10-09.md`
§3 (the knots table). This file is committed, and its sha recorded, BEFORE E hands back. After that it is not edited: any change is a new, dated
amendment file, and the rows below stay the rows E's branch is scored against.

**The checker:** pane B, blind to E's tests. It runs B's own harness, built on `d280/knots.js` (in the evidence folder of
`handback/p-sharpturns-B_2026-10-09.md`), against E's branch, from a read-only `git archive` of that branch. Pane B reads only the interface it must
call (the Sharp field, or its shell or core entry point) and never E's test files.

## The method, shared by every row
- **The rig:** the app's own core shell (`app/core/coreshell.js` `createCoreShell`) and its validation controller at its default
  (`app/validate-ui/panel.js` `createValidationController`). That default is full speed: an open track is judged at `MACH6.vmaxKmh` = 970 km/h.
- **The track:**
  1. a 200 m straight at width W, typed through the panel's `extendOptions({ length: 200, turn: 0, width: W, empty: true })`;
  2. the Sharp corner as the app offers it (angle θ, radius R, ramp 4 m; E's other fields at their defaults);
  3. a following Straight of 100 m, made as the app's Straight makes it (turn 0 and climb 0, reached within the first 20 m and held).
- **The stations:** the controller's own path, 2 m apart. Heading = atan2(T.x, T.z), unwrapped.
- **H, the heading change:** from the station at s = 200 m (where Sharp starts) to the last station of the Straight. It passes when |H| − θ is
  within ±0.05°, the sign following the turn's side.
- **E50, exiting straight:** |heading(last station) − heading(last station − 50 m)| ≤ 0.01°.
- **Entry and exit 10–90%:** over the Sharp and the Straight together, with κ = |kvec| in the horizontal plane:
  - entry is the distance from the first station at ≥ 10% of the peak κ to the first at ≥ 90%;
  - exit is the distance from the last station at ≥ 90% to the last at ≥ 10%;
  - each must be ≤ 8 m (Thunderhead's post-jump 90°s measure 0–8 m).
- **Red / amber:** no `result.red` or `result.amber` finding whose span (s0..s1, or s) overlaps [200 − 5, the Straight's end] passes.
- **A refusal:** the action changes nothing. The document's canonical text after the attempt equals the text before it, and `state.message` gives
  the reason.

## The rows (each a pass or a fail, with its numbers)
**S1.** Sharp 90°, R 22, W 24, ramp 4: H within 0.05°; E50 ≤ 0.01°; entry ≤ 8 m and exit ≤ 8 m; no red and no amber.

**S2.** The same at R 24.25, W 45.

**S3.** Sharp at R 22, W 24, ramp 4, for θ = 45°, 90°, 135° and 180°: H within 0.05° and E50 ≤ 0.01° for each. Red and amber are reported, not
scored, because the plan's line 33 scores only the angle and the straight exit.

**S4. The minimum-radius refusal.**
- **(a)** W 45 (bowl, the default family), R 24.0: refused. The message names a tightest radius x with |x − 24.25| ≤ 0.25 m, and the track is
  unchanged.
- **(b)** W 24, R 14: refused, with |x − 15| ≤ 0.5 m, and the track is unchanged.
- **Reported, not scored:** that R 24.25 at W 45 and R 15 at W 24 are accepted. (S2 also places R 24.25.)

**S5. Today's curve unchanged.** Every saved track in the keeper's tracks folder (`%APPDATA%\com.solariz3d.t180-track-builder\tracks\*.t180track`,
the `eq-` core tracks) is rebuilt from a COPY in pane B's scratchpad, on `bf0f333` and on E's branch:
- the segments the adapter makes (`src/core/adapter.js` `toSegments`) are identical as JSON;
- the built path's station positions differ by at most 1e-9 m.

A track that fails to load on BOTH commits is reported, not scored. The full suite on E's branch passes (`npm test`, under the heavy-run lock); a
red that is also red on `bf0f333` is reported as shared.

**S6. Save, close, reopen, Undo (D272).** On a track with a Sharp corner, through the shell with an in-memory store:
- after `save` then a fresh shell's `open`, the document's canonical text and the path are identical to before the save;
- one Undo after reopening returns the document to its state before the Sharp corner (canonical text equal).

**S7. The AC export.** The S1 track, closed with the app's own Close, or if a three-piece open track will not close, exported as the TEST export
on the open track as Install does.
- It is exported through the app's own exporter (`app/export/export.js` `makeExporter`) into pane B's scratchpad.
- The validation run with the exported road mesh lists no `downforce-ray-gap` red overlapping the Sharp corner (the D279 check).
- The librarian's `cmcheck.js` read-back (models.ini → kn5, ui_track.json, AC_START and AC_PIT, timing gates, the ROAD key drivable, meshes ≤
  65,535 vertices, map.ini, fast_lane.ai) reports `BAD = []`.

## Falsifiers, so this registration can be shown wrong
- **If S1 passes on `bf0f333` (before Sharp exists) through the broad turn's own fields, the bar measures nothing new.** Checked at registration:
  on main 22c46a0 the broad turn with "at start" built entries of 6–8 m and a −8.5° to −9.3° exit ease (§2 L2). There, E50 fails, because the exit
  piece is still turning across its first 20 m, and so does the angle unless it is made of two pieces counted together. This makes the bar
  discriminate.
- **If my harness reproduces §3's knots rows at different numbers on `bf0f333`**, run with core `extend(... knotM)` as there, the harness has
  drifted, and the check is VOID until that is explained.

## Amendment, 2026-10-09 22:1x, librarian, after scoring (S4b's score stands as written)
S4b's anchor, "R 14 is refused (within 0.5 m of 15)", was the librarian's error. It carried B's broad-build limit (§2, measured with the 20 m ease) into a bar written for Sharp's 4 m ramp. **S4b stays FAILED as registered**, and that fail is the librarian's, not E's. For any re-run, the anchor is replaced by Sharp's measured limit: at W 24, R 13.0 and 13.2 are refused, and the refusal names the tightest radius, within 0.25 m of 13.4. B's check found that line holds (13.4 green, 13.2 and 13.0 refused). It noted one loose edge: R 13.3 is accepted while the name says 13.4 (rounded to 0.1 m), so the named radius is conservative by at most 0.1 m. That is accepted as is.
