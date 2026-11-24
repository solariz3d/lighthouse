// which read files have the four tracks' laps (20.7, 31.0, 34.4, 21.0 km); prints a hash of the path and the lap only, never a name
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const dirs = ['C:/Users/nname/Desktop/t180-track-builder/reads', 'C:/Users/nname/Downloads/t180-track-builder/reads', 'G:/worktrees/e-d300-t180/reads', 'C:/Users/nname/Downloads/t180-fresh/reads'].filter(fs.existsSync);
const want = [20.7, 31.0, 34.4, 21.0], out = [];
for (const d of dirs) for (const f of fs.readdirSync(d).filter((n) => n.endsWith('.read.json'))) {
  const p = path.join(d, f); let r; try { r = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { continue; }
  const km = (r.walked_m || 0) / 1000, hit = want.findIndex((w) => Math.abs(w - km) < 0.06);
  if (hit >= 0) out.push({ col: hit + 1, km: km.toFixed(2), prof: !!(r.stations && r.stations[0] && r.stations[0].n), n: r.stations ? r.stations.length : 0, h: crypto.createHash('sha256').update(p).digest('hex').slice(0, 8), p });
}
fs.writeFileSync('G:/consonance-scratch/o-smooth-work/four_reads.json', JSON.stringify(out.map(({ col, p }) => ({ col, p })), null, 1));
for (const o of out.sort((a, b) => a.col - b.col)) console.log(o.col, o.km, o.prof, o.n, o.h);
