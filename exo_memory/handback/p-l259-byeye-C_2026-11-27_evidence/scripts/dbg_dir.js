'use strict';
const fs = require('fs'), M = require('./measure.js'), DEG = 180 / Math.PI;
const [docF, from, to, x, z, up, turn] = process.argv.slice(2);
const read = JSON.parse(fs.readFileSync('t2.read.json', 'utf8')), ref = M.readRef(read), place = M.placer(read, 'start.json', { x: +x, z: +z, up: +up, turn: +turn });
const road = M.hisRoad(JSON.parse(fs.readFileSync(docF, 'utf8')));
const hd = (t) => Math.atan2(t[0], t[2]) * DEG, pt = (t) => Math.asin(t[1]) * DEG;
for (let k = 0; k < ref.n; k++) { if (ref.arc[k] < +from || ref.arc[k] > +to) continue;
  const Q = place.point(ref.P[k]), t = place.dir(ref.T[k]); let b = 0, bd = Infinity; road.forEach((r, j) => { const d = Math.hypot(r.pos[0] - Q[0], r.pos[1] - Q[1], r.pos[2] - Q[2]); if (d < bd) { bd = d; b = j; } });
  const r = road[b]; console.log(`${ref.arc[k].toFixed(0)} m: pos ${bd.toFixed(2)}  read heading ${hd(t).toFixed(1)} pitch ${pt(t).toFixed(1)} | his s ${r.s.toFixed(1)} heading ${hd(r.T).toFixed(1)} pitch ${pt(r.T).toFixed(1)} | raw station f heading ${hd(place.dir(ref.raw[k].f)).toFixed(1)}`); }
