// s5sig.js (pane B, D282 S5): rebuild every saved-track COPY on one commit's export and write its signature: the adapter's segments as JSON
// (with its sha256) and the built path's station positions. Two runs (bf0f333, E's branch) are compared by s5cmp.js.
//   node s5sig.js <export root> <tracks dir> <out.json>
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [ROOT, TRACKS, OUT] = process.argv.slice(2);
const D = require(path.join(ROOT, 'src/core/document.js'));
const { toSegments } = require(path.join(ROOT, 'src/core/adapter.js'));
const G = require(path.join(ROOT, 'src/geom/index.js'));
const out = {};
for (const f of fs.readdirSync(TRACKS).filter((n) => n.endsWith('.t180track')).sort()) {
  try {
    const doc = D.parse(fs.readFileSync(path.join(TRACKS, f), 'utf8'));
    const segs = toSegments(doc);
    const json = JSON.stringify(segs);
    const p = G.buildPath(segs, { step: 2, closed: !!doc.closed });
    out[f] = { segSha: crypto.createHash('sha256').update(json).digest('hex'), segCount: segs.length, stations: p.samples.length, pos: p.samples.map((x) => x.pos) };
  } catch (e) { out[f] = { error: e.code || String(e.message).slice(0, 200) }; }
}
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(Object.entries(out).map(([f, v]) => f + ': ' + (v.error ? 'ERROR ' + v.error : v.segCount + ' segs, ' + v.stations + ' stations, ' + v.segSha.slice(0, 12))).join('\n'));
