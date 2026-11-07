// endrow3.js: adds the end-strip row to test/lighthull.test.js (run from the worktree root); CRLF kept
'use strict';
const fs = require('fs'), F = 'test/lighthull.test.js';
let s = fs.readFileSync(F, 'utf8').replace(/\r\n/g, '\n');
const anchor = "test('a scene with no equation-core road to lighten is returned as it is'";
if (s.split(anchor).length !== 2) throw new Error('anchor');
s = s.replace(anchor, () => `// A light piece's two end rows are whole (every column), and the strip off a whole end row is one row long, so a piece ends on the full skin's own last cell.
// It was so only where the piece kept fewer columns than the whole row: a piece that keeps every column (a twist, or his CRAZY TEST's last 200 m) ran its end
// strip 20 m long onto the row, and the export's final-scene check, which reads an open route's last 4 m by the path sample nearest each triangle's centre, read
// that end row as a line of sky (CRAZY TEST, s 19,649, 36 edges). Read on the fixture unmerged and textured (v runs on along the road): a light piece is a
// bottom node the full export has under the same name with a different triangle count, and a cell is a full cell node's own v span.
test('every light piece ends on a whole cell: no triangle on a piece\\'s first or last row reaches further along than one cell, on a piece that keeps every column too', () => {
  const build = (light) => { const k = \`unmerged|\${light}\`; if (memo.has(k)) return memo.get(k);
    const doc = D.parse(fs.readFileSync(FIXTURE, 'utf8')), segs = A.toSegments(doc), lift = (q) => A.offsetPath(doc, segs, q), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
    const textures = createCoreTextures({ segments: () => segs, closed: () => false, edge: true }).current();
    const ex = FW.buildFromSegments(segs, { name: 'light hull', via: 'test', liftPath: lift, start }, { markers: startLayout(segs, lift, start, { open: true }), test: true, lightHull: light, textures, mergeMeshes: false });
    memo.set(k, ex); return ex; };
  // the bottom's nodes (each a dummy holding its mesh, or the mesh itself), by name
  const nodes = (ex) => { const out = new Map(); for (const c of ex.acScene.root.children) { const m = c.type === 'mesh' ? c : (c.children || []).find((x) => x.type === 'mesh'); if (m && UNDER.test(m.name)) out.set(m.name, m); } return out; };
  const full = nodes(build(false)), light = nodes(build(true));
  const vSpan = (m) => { let lo = Infinity, hi = -Infinity; for (let i = 1; i < m.uvs.length; i += 2) { lo = Math.min(lo, m.uvs[i]); hi = Math.max(hi, m.uvs[i]); } return [lo, hi]; };
  const spans = [...full.values()].map((m) => { const [lo, hi] = vSpan(m); return hi - lo; }).sort((a, b) => a - b), cell = spans[Math.floor(spans.length / 2)];
  assert.ok(cell > 0, 'control: a full cell has a v span');
  const pieces = [...light.values()].filter((m) => full.has(m.name) && full.get(m.name).indices.length !== m.indices.length);
  assert.ok(pieces.length >= 10, \`control: the fixture has light pieces (\${pieces.length})\`);
  let wide = 0; const bad = [];
  for (const m of pieces) {
    const [lo, hi] = vSpan(m), V = (k) => m.uvs[2 * k + 1], I = m.indices, n = new Set();
    for (let i = 0; i < I.length; i++) { if (Math.abs(V(I[i]) - lo) < 1e-4) n.add(I[i]); }
    if (n.size) wide++;
    for (let t = 0; t < I.length; t += 3) {
      const v = [V(I[t]), V(I[t + 1]), V(I[t + 2])];
      if (v.some((x) => Math.abs(x - lo) < 1e-4) && Math.max(...v) - lo > cell * 1.001) { bad.push(\`\${m.name} first row, \${((Math.max(...v) - lo) / cell).toFixed(1)} cells\`); break; }
      if (v.some((x) => Math.abs(x - hi) < 1e-4) && hi - Math.min(...v) > cell * 1.001) { bad.push(\`\${m.name} last row, \${((hi - Math.min(...v)) / cell).toFixed(1)} cells\`); break; }
    }
  }
  assert.equal(wide, pieces.length, 'control: every light piece has a first row');
  assert.deepEqual(bad, [], 'a strip off a whole end row is longer than one cell');
});
` + anchor);
fs.writeFileSync(F, s.replace(/\n/g, '\r\n'));
console.log('end-strip row added');
