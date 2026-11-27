// bytes.cjs: D677 (b), "old documents open and save BYTE-EQUAL". On one tree: each of his saved tracks (copies, tNN.t180track, never read in his folder) parsed and
// serialised again, against its own text; and every document text inside each undo sidecar copy (uNN.t180undo: present, past, future) the same way.
// usage: node bytes.cjs <t180 tree> <work dir> <out.json>
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const [T, WORK, OUT] = process.argv.slice(2);
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const D = require(path.join(T, 'src/core/document.js'));
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const one = (text) => { try { const s = D.serialize(D.parse(text)); return { same: s === text, sha: sha(s), schema: JSON.parse(text).schema }; } catch (e) { return { threw: e.code || e.name, schema: (() => { try { return JSON.parse(text).schema; } catch (_) { return null; } })() }; } };
const out = { tracks: {}, undo: {} };
for (const f of fs.readdirSync(path.join(WORK, 'tracks')).filter((x) => /^t\d\d\.t180track$/.test(x)).sort()) out.tracks[f] = one(fs.readFileSync(path.join(WORK, 'tracks', f), 'utf8'));
for (const f of fs.readdirSync(path.join(WORK, 'undo')).filter((x) => /^u\d\d\.t180undo$/.test(x)).sort()) {
  let o; try { o = JSON.parse(fs.readFileSync(path.join(WORK, 'undo', f), 'utf8')); } catch (e) { out.undo[f] = { bad: e.message }; continue; }
  const steps = [['present', o.present], ...(o.past || []).map((t, i) => [`past${i}`, t]), ...(o.future || []).map((t, i) => [`future${i}`, t])].filter(([, t]) => typeof t === 'string');
  out.undo[f] = Object.fromEntries(steps.map(([k, t]) => [k, one(t)]));
}
const tr = Object.values(out.tracks), st = Object.values(out.undo).flatMap((u) => Object.values(u));
out.summary = { tracks: tr.length, tracksSame: tr.filter((x) => x.same).length, tracksThrew: tr.filter((x) => x.threw).length, undoFiles: Object.keys(out.undo).length, undoSteps: st.length, undoSame: st.filter((x) => x.same).length, undoThrew: st.filter((x) => x.threw).length,
  schemas: [...new Set([...tr, ...st].map((x) => x.schema))].sort() };
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out.summary));
