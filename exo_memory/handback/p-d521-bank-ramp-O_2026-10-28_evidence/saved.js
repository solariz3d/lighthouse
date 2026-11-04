// saved.js (D521, O): his saved tracks, READ ONLY, through one tree's own code: per track, the pieces, how many carry a bank change, the sha256 of the re-serialised
// document, and of the exported centreline geometry (adapter.js toPath: every sample's s, pos, L, U, to 1e-9), plus the bank at every 0.5 m station for the cross-tree
// comparison. Run once per tree; compare.js reads the two outputs.   node saved.js <tree> <tracks dir> <out.json>
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [T, DIR, OUT] = process.argv.slice(2);
const D = require(path.join(T, 'src/core/document.js')), { toPath } = require(path.join(T, 'src/core/adapter.js'));
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16), r9 = (x) => Math.round(x * 1e9) / 1e9;
const out = {};
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.t180track')).sort()) {
  const raw = fs.readFileSync(path.join(DIR, f), 'utf8');
  let doc; try { const j = JSON.parse(raw); doc = D.parse(typeof j.doc === 'string' ? j.doc : raw); } catch (e) { try { doc = D.parse(raw); } catch (e2) { out[f] = { skipped: `not a core document (${(e2.code || e2.message || '').toString().slice(0, 60)})` }; continue; } }
  const roads = doc.pieces.filter((P) => P.type === 'road');
  const banked = roads.filter((P) => { const c = P.channels.phi; return c && c.some((v) => Math.abs(v - c[0]) > 1e-9); }).length;
  const { path: Pt } = toPath(doc, { step: 0.5 });
  const geo = sha(JSON.stringify(Pt.samples.map((m) => [r9(m.s), ...m.pos.map(r9), ...m.L.map(r9), ...m.U.map(r9)])));
  const bank = []; let s0 = 0; for (const P of doc.pieces) { if (P.type === 'road') for (let s = 0; s <= P.length; s += 0.5) bank.push(r9(D.valuesAt(P, s).phi)); s0 += P.length; }
  out[f] = { pieces: doc.pieces.length, roads: roads.length, banked, doc: sha(D.serialize(doc)), geometry: geo, bank };
}
fs.writeFileSync(OUT, JSON.stringify(out)); console.log(`${Object.keys(out).length} files read from ${DIR}`);
