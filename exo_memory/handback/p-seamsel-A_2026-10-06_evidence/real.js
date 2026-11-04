// READ ONLY: every wrapped run (from > to) of each of the keeper's real closed laps, through PC.saveRun
const fs = require('fs'), path = require('path'); const W = 'C:/Users/nname/Desktop/worktrees/a-merge-wt/'; const D = require(W + 'src/core/document.js'), PC = require(W + 'src/core/piece.js'); const TAU = 2 * Math.PI;
const dir = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'tracks'); const files = fs.readdirSync(dir).filter((f) => /^eq-.*\.t180track$/.test(f));
for (const f of files) { let d; try { d = D.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { console.log(f, 'unreadable'); continue; } if (!d.closed) { console.log(f.padEnd(34), 'open (never wraps)'); continue; } const n = d.pieces.length, w = D.pieceEnd(d.pieces[n - 1]).phi.v - d.pieces[0].channels.phi[0], res = {};
  for (let from = 1; from < n; from++) for (let to = 0; to < from; to++) { try { PC.saveRun(d, from, to, { name: 'x' }); res.KEPT = (res.KEPT || 0) + 1; } catch (e) { res[e.code] = (res[e.code] || 0) + 1; } }
  console.log(f.padEnd(34), `${n} pieces, bank winding ${(w / Math.PI).toFixed(3)}pi:`, JSON.stringify(res)); }
