// bytes264.js (pane B, L264 item 5): his saved files, from COPIES, through one tree: every track (*.t180track) and every undo step (*.t180undo: present, past,
// future) as D.serialize(D.parse(text)), hashed; a refusal is kept by its code. Then, for each open track, one Extend of 100 m at its head with nothing typed: the new
// piece's text hashed, and whether the head's width is still changing (its end slope). Files are numbered in name order and never named in the output.
// usage: node --max-old-space-size=4096 bytes264.js <tree> <copies dir> <out.json>
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [tree, dir, out] = process.argv.slice(2), T = path.resolve(tree);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const h = (t) => crypto.createHash('sha256').update(t).digest('hex').slice(0, 16);
const round = (t) => { try { return h(D.serialize(D.parse(t))); } catch (e) { return `REFUSED ${e.code || e.name}`; } };
const files = fs.readdirSync(dir).filter((f) => /\.t180(track|undo)$/.test(f)).sort();
const res = { tracks: [], undo: [] };
files.forEach((f, i) => {
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  if (f.endsWith('.t180track')) {
    const row = { n: i, same: null, saved: round(text) };
    try { const d = D.parse(text); row.same = D.serialize(d) === text; row.closed = !!d.closed;
      if (!d.closed) { const head = D.endState(d); row.headWidthSlope = head && head.w ? head.w.m : null;
        try { const e = extend(d, { length: 100 }); row.extended = h(JSON.stringify(e.pieces[e.pieces.length - 1])); } catch (e) { row.extended = `REFUSED ${e.code || e.name}`; } } } catch (e) { /* refused: kept in saved */ }
    res.tracks.push(row);
  } else {
    let o; try { o = JSON.parse(text); } catch (e) { res.undo.push({ n: i, bad: 'not JSON' }); return; }
    const steps = [...(o.past || []), o.present, ...(o.future || [])].filter((t) => typeof t === 'string');
    res.undo.push({ n: i, steps: steps.map(round) });
  }
});
fs.writeFileSync(out, JSON.stringify(res, null, 1));
console.log(`tracks ${res.tracks.length}, undo files ${res.undo.length}, undo steps ${res.undo.reduce((a, u) => a + (u.steps ? u.steps.length : 0), 0)}; refused tracks ${res.tracks.filter((r) => /^REFUSED/.test(r.saved)).length}`);
