// wire2.js (run in the worktree): the builder refuses an edit that makes a NEW pass-clearance break (app/core/coreshell.js commit()). Anchors exactly once; line endings kept.
'use strict';
const fs = require('fs');
function edit(f, pairs) {
  let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { const k = s.split(a).length - 1; if (k !== 1) throw new Error(`${f}: ${k} of ${JSON.stringify(a.slice(0, 70))}`); s = s.replace(a, () => b); }
  fs.writeFileSync(f, crlf ? s.replace(/\n/g, '\r\n') : s); console.log('edited ' + f);
}
edit('app/core/coreshell.js', [
  [`  /** Commit a new document as one undo step, timing the operation plus the adapter. */
  const commit = (op, make, extra = {}) => attempt(() => {
    const t0 = now(), d = make(), r = resolvedOf(d), ms = now() - t0;`,
  `  // THE PASS CLEARANCE (D623, src/validate/passclear.js; the user, 2026-11-02: "forbid building the track a little bit closer because of the bulk of the underside").
  // An edit that puts the road closer over another pass than its underside's depth plus a car's room is REFUSED by name, and nothing changes. Only a break the edit
  // MAKES is refused: a track that already has one (opened that way) is still edited freely elsewhere, and the checker shows the old one red. The rule reads the
  // track from the first station the edit moved (or, when the apron's width changed, the whole of it), before and after; an after finding is new when no before one
  // sits at the same place (its s and its other pass's s within CLEAR_SAME_M, or its point within CLEAR_NEAR_M) at least as short.
  const CLEAR_SAME_M = 4, CLEAR_NEAR_M = 2, CLEAR_WORSE_M = 0.01;
  const clearancePath = (res, closed) => { const p0 = spawnPath(res.segments, closed, res.start); return res.lift ? res.lift(p0) : p0; };
  const kmAt = (s) => \`\${(s / 1000).toFixed(2)} km\`;
  function passClearanceGuard(before, after, res) {
    if (!res.segments.length) return;
    const PCL = require('../../src/validate/passclear.js'), A = require('../../src/export/apron.js');
    const apronOf = (x) => (x.edgeApronM === undefined ? A.APRON_WIDTH_M : x.edgeApronM);
    const pa = clearancePath(res, !!after.closed), segsB = st.resolved && st.resolved.segments;
    const pb = before && before.pieces.length && segsB && segsB.length ? clearancePath(st.resolved, !!before.closed) : null;
    // the first station the edit moved: the two paths share their stations, to the bit, up to it
    let from = 0;
    if (pb && apronOf(before) === apronOf(after)) {
      const A0 = pb.samples, B0 = pa.samples, m = Math.min(A0.length, B0.length);
      while (from < m && A0[from].s === B0[from].s && A0[from].pos[0] === B0[from].pos[0] && A0[from].pos[1] === B0[from].pos[1] && A0[from].pos[2] === B0[from].pos[2]) from++;
      if (from >= B0.length) return;   // no station of the new track moved: nothing to read
    }
    const now2 = PCL.passClearance(pa, res.segments, { apronM: apronOf(after), from });
    if (!now2.length) return;
    const was = pb ? PCL.passClearance(pb, segsB, { apronM: apronOf(before), from: Math.min(from, pb.samples.length) }) : [];
    const same = (f, b) => f.shortM <= b.shortM + CLEAR_WORSE_M && ((Math.abs(f.s - b.s) <= CLEAR_SAME_M && Math.abs(f.otherS - b.otherS) <= CLEAR_SAME_M) || Math.hypot(f.at[0] - b.at[0], f.at[1] - b.at[1], f.at[2] - b.at[2]) <= CLEAR_NEAR_M);
    const fresh = now2.filter((f) => !was.some((b) => same(f, b)));
    if (!fresh.length) return;
    const w = fresh.reduce((m, f) => (f.shortM > m.shortM ? f : m)), idAt = (s) => RG.pieceAt(res.segments, s, { closed: !!after.closed });
    const room = w.gapM <= 0 ? 'it reaches into the road below' : \`it leaves \${w.gapM.toFixed(2)} m\`;
    throw new D.CoreError('PASS_CLEARANCE', \`too close to another pass of the road: at \${kmAt(w.s)} (\${idAt(w.s)}) the road above, at \${kmAt(w.otherS)} (\${idAt(w.otherS)}), needs its underside \${w.needM.toFixed(1)} m over this road for a car; \${room}\${fresh.length > 1 ? \` (\${fresh.length} places)\` : ''}. Nothing changed.\`);
  }
  /** Commit a new document as one undo step, timing the operation plus the adapter. */
  const commit = (op, make, extra = {}) => attempt(() => {
    const t0 = now(), d = make(), r = resolvedOf(d), ms = now() - t0;
    passClearanceGuard(doc(), d, r.resolved);   // D623: a new break of the pass clearance is refused by name (CoreError: the message, nothing changes)`],
]);
