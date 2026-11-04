// meshcmp.js (C, D483): node meshcmp.js <t180 tree> <fixtures dir> — sha256 of every mesh the tree builds from the public fixtures (buildMesh; and for an open one a sculpt of
// its middle piece, sculptMesh) and of the ghosts its track model builds with a left edge typed (full and cheap, an empty track and after a placed piece, a cheap ghost after a
// cheap ghost so the reuse path runs). One JSON line per case; two trees are compared by diffing the output.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const T = path.resolve(process.argv[2]), FX = path.resolve(process.argv[3]), R = (p) => require(path.join(T, p));
const D = R('src/core/document.js'), AD = R('src/core/adapter.js'), G = R('src/geom/index.js'), PATH = R('src/geom/path.js'), { walkScene } = R('src/export/markers.js');
const { createCoreShell } = R('app/core/coreshell.js'), { createTrackModel } = R('app/preview/trackmodel.js'), { extendOptions } = R('app/core/panel.js');
const sha = (parts) => { const h = crypto.createHash('sha256'); for (const p of parts) h.update(p); return h.digest('hex'); };
const meshDigest = (mesh) => { const parts = []; for (const m of walkScene(mesh.scene).meshes) { parts.push(Buffer.from(String(m.name))); if (m.matrix) parts.push(Buffer.from(Float64Array.from(m.matrix).buffer)); for (const k of Object.keys(m).sort()) { const v = m[k]; if (ArrayBuffer.isView(v)) parts.push(Buffer.from(k), Buffer.from(v.buffer, v.byteOffset, v.byteLength)); } } return { sha: sha(parts), parts: parts.length }; };
const ghostDigest = (g) => { const parts = []; for (const b of g.batches) for (const k of Object.keys(b).sort()) { const v = b[k]; if (ArrayBuffer.isView(v)) parts.push(Buffer.from(k), Buffer.from(v.buffer, v.byteOffset, v.byteLength)); } return { sha: sha(parts), parts: parts.length }; };
const out = (k, v) => console.log(JSON.stringify({ case: k, ...v }));
(async () => {
  for (const f of fs.readdirSync(FX).filter((x) => x.endsWith('.core2.json')).sort()) {
    const doc = D.parse(fs.readFileSync(path.join(FX, f), 'utf8'));
    if (!doc.pieces.length) { out(f, { empty: true }); continue; }
    const segs = AD.toSegments(doc), { path: p } = AD.toPath(doc);
    out(f + ' buildMesh', meshDigest(G.buildMesh(p, segs)));
    if (!doc.closed && segs.length > 2) {
      const pp = G.buildPath(segs), m = G.buildMesh(pp, segs), g = Math.floor(segs.length / 2), ed = segs.slice(); ed[g] = { ...segs[g], length: segs[g].length + 3 };
      PATH.rebuildPathFrom(pp, ed, g); const sm = G.sculptMesh(m, pp, ed, g);
      out(f + ' sculptMesh', { ...meshDigest(sm), reused: sm.stats.reused });
    }
  }
  const opt = (o) => extendOptions({ grip: '', length: '1000', turn: '', climb: '', bank: '', width: '', cup: '', edge: '20', edgeR: '', start: '', tube: '', atStart: {}, turnAs: 'corner', ...o });
  for (const placed of [false, true]) {
    const sh = await createCoreShell({ brushFn: null, autosaveMs: 0 }); if (placed) sh.extend({ length: 300 });
    const tm = createTrackModel(); tm.update(sh.getState().resolved);
    const name = placed ? 'after 300 m' : 'empty';
    out(`ghost ${name} full`, ghostDigest(tm.ghostFor(sh.candidate(opt({ empty: !placed })))));
    for (const L of ['1000', '1006', '1006', '1240']) out(`ghost ${name} cheap ${L}`, ghostDigest(tm.ghostFor(sh.candidate(opt({ empty: !placed, length: L }), { coarse: true }), { cheap: true })));
    for (const turn of ['10', '12', '12']) out(`ghost ${name} cheap turn ${turn}`, ghostDigest(tm.ghostFor(sh.candidate(opt({ empty: !placed, turn }), { coarse: true }), { cheap: true })));
    sh.extend(opt({ empty: !placed })); tm.update(sh.getState().resolved);
    out(`placed ${name} + edge piece`, meshDigest(tm.mesh));
  }
})().catch((e) => { console.error(e.stack); process.exit(1); });
