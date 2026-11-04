const fs = require('fs'), WT = 'C:/Users/nname/Desktop/a-d188-wt';
function edit(file, pairs) {
  let s = fs.readFileSync(WT + '/' + file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(file + ': anchor not unique/found: ' + a.slice(0, 80)); s = s.replace(a, () => b); }
  if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(WT + '/' + file, s); console.log('edited', file, crlf ? '(CRLF)' : '(LF)');
}
const CUP_SECTION = String.raw`## The cup: the cross-section's edge angle (schema core/3, ref 09 §9)

The cup **c(s)** is a channel in DEGREES: the angle ψ the surface has turned by at both edges u = ±w/2, from 0 (a flat ribbon) up to **150**.
About 15 is today's bowl, 31 today's half-pipe, 90 vertical walls, 150 a partial tube open at the top. It is independent of bank: the
section is cupped first and then rolled (bank 30° with cup 60° makes the left wall stand exactly vertical). A cup moves neither the
centreline, the bank nor the readout's turn and climb.

- **A cup piece and a legacy piece.** A road piece is a **cup piece** (` + '`P.cup === true`' + String.raw`, and a ` + '`c`' + String.raw` array in its text) only when a cup was set on it:
  an Extend ` + '`c`' + String.raw` target, ` + '`first: { c }`' + String.raw` on an empty track, or being extended after a cup piece (the cup then continues like any channel).
  Every other road piece, including everything read from a /1 or /2 file, is a **legacy piece**: it renders through the old
  ` + '`profileAt(family, w, r)`' + String.raw` unchanged (byte for byte: the nine /2 fixtures in ` + '`test/fixtures/`' + String.raw`, digests in ` + '`manifest.json`' + String.raw`), and its ` + '`c`' + String.raw` is zeros
  in memory and absent in the text. So a user who never types a cup sees nothing change. (The plan's "migrate every /2 piece to a c that
  reproduces its profile" cannot: where the r cap binds the SHAPE differs, up to 4.458°; the D190 seal, V1.)
- **The shape** is the family's measured floor scaled to the edge: ψ at the four quarters is c·Fᵢ/F_edge on both sides
  (` + '`cupProfile(family, w, c)`' + String.raw`; ref 09 §9). The r rate cap does not apply to a cup piece.
- **Range.** ` + '`0 ≤ c ≤ 150`' + String.raw` for every control point (` + '`CUP_MAX`' + String.raw`), refused by name (` + '`BAD_CUP`' + String.raw`) in ` + '`checkDoc`' + String.raw`, ` + '`parse`' + String.raw`, Extend and a brush; by the convex hull
  (ref 03 §1b) the curve stays inside too. 150 leaves 9.68° to the bowl's touch (159.681°). The Extend fit rings past a short
  transition's target (174.65° for 150° over 10 m before the guard), so a cup piece's control points are clamped to [0, 150] after the
  fit, and the readout reports the DOCUMENT's c. A clamp can leave the curve short of the target at the top: 144.499° for 150° over 20 m of a 60 m piece.
- **Joints.** c is C1 between two cup pieces like every channel and is carried through a flight. Between a legacy and a cup piece the
  RENDERED edge must be continuous to 0.05° (a legacy piece's cup, for this, is the edge it renders: ` + '`D.legacyEdgeDeg`' + String.raw`, held), so a cup that
  follows a legacy piece starts there. A lap closes ` + '`c`' + String.raw` (value and slope) only when its first and last road pieces are both cup pieces;
  a cup meeting a legacy piece at the seam is reported by ` + '`close`' + String.raw` (` + '`cupSeamStepDeg`' + String.raw`), not solved.
- **On the road (no stair-step).** The adapter gives each cup segment a ` + '`blend: { from, s0, length }`' + String.raw` so the mesh's smoothstep weight lands on c(s) at both ends of the
  segment. A stretch where the width does not change is ONE pair (the lowest and highest c), so the rows of neighbouring segments
  coincide: no seam zip inside a cup piece, and the wall follows c along the road. Where the width changes too, the pair is per segment
  (a seam zip at each segment whose profile changes). The plan's one profile per 2 m stepped the wall tip 0.33 to 1.41 m (seal V4).
- **The brush.** ` + '`brush({ mode: \'value\', channel: \'c\' })`' + String.raw` works on cup pieces only; a window that reaches a legacy piece is refused (` + '`NOT_CUP`' + String.raw`).
- **The API for the UI:** the channel name is ` + '`c`' + String.raw` (Extend ` + '`targets.c`' + String.raw`, ` + '`first.c`' + String.raw`), and the readout's ` + '`cupFromDeg`' + String.raw` / ` + '`cupToDeg`' + String.raw`.

`;
edit('src/core/README.md', [
  ["## The document (schema `t180b.core/2`; a `core/1` file is read and upgraded)", "## The document (schema `t180b.core/3`; a `core/1` or `core/2` file is read and upgraded)"],
  ["  schema: 't180b.core/2',\n  generator: 't180-track-builder/core 0.2.0',", "  schema: 't180b.core/3',\n  generator: 't180-track-builder/core 0.3.0',"],
  ["## Knot insertion: finer knots under a narrow brush (`document.js`)", CUP_SECTION + "## Knot insertion: finer knots under a narrow brush (`document.js`)"],
  ["//     bankFromDeg, bankToDeg,      // φ at the two ends, degrees, + = left side up\n", "//     bankFromDeg, bankToDeg,      // φ at the two ends, degrees, + = left side up\n//     cupFromDeg, cupToDeg,        // the cup c at the two ends, degrees (a legacy piece: the edge its road renders; a flight: carried)\n"],
]);
edit('CHANGELOG.md', [
  ["### Added\n\n- The palette suggests what usually comes next, from how often each kind of word follows another on the real tracks.\n  It only suggests: every word can still be placed after any other.\n",
   "### Added\n\n- The palette suggests what usually comes next, from how often each kind of word follows another on the real tracks.\n  It only suggests: every word can still be placed after any other.\n- **Cup: the road's cross-section deepens toward a half-pipe, apart from bank.** A new channel sets the angle the walls have\n  turned by at the edges, from 0 (flat) to 150 (a partial tube): about 15 is the old bowl, 31 the old half-pipe, 90 vertical\n  walls. It blends along the piece like the others, moves neither the line nor the bank, and rolls with bank (bank 30 with cup 60\n  stands the left wall vertical). Tracks made before this open and render exactly as they did: a cup is only there when you set one.\n"],
]);
