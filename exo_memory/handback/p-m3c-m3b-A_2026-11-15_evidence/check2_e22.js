// D677 M3c: check 2 (registration_m3c_fix2.md) read on pane E's staged 22 degree bend from the scratch print's TICK and AIM lines.
//   node check2_e22.js <file>   (hunter: turn_slow 300 deg/s, grip 1.0)
const fs = require('fs');
const lines = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/);
const tick = {}, aim = {};
for (const l of lines) {
  const t = l.split(' ');
  if (t[0] === 'TICK') tick[+t[1]] = { speed: +t[7], touched: +t[25], branch: +t[15] };
  if (t[0] === 'AIM') aim[+t[1]] = { aim: +t[3], vel: +t[5], sliding: +t[9] };
}
const wrap = (d) => { while (d > 180) d -= 360; while (d < -180) d += 360; return d; };
const g = 9.81, turnSlow = 300 * Math.PI / 180;
let n = 0, under = 0, capped = 0, least = Infinity, leastGrip = Infinity, leastAt = -1;
for (const k of Object.keys(aim).map(Number).sort((a, b) => a - b)) {
  const a = aim[k], p = aim[k - 1], tk = tick[k];
  if (!p || !tk || !a.sliding || !p.sliding || tk.touched) continue;
  const off = wrap(a.aim - p.vel);
  if (Math.abs(off) <= 20) continue;
  const d = wrap(a.vel - p.vel) * Math.PI / 180;
  const toward = (Math.abs(off) - Math.abs(wrap(a.aim - a.vel))) * Math.PI / 180 * 240;  // the drop in |off| (the sign of a turn is ambiguous at 180 degrees)
  const allow = Math.min(turnSlow, g / Math.max(tk.speed, 0.5));
  n++;
  if (toward < 0.9 * allow) under++;
  if (turnSlow < g / Math.max(tk.speed, 0.5)) capped++;
  if (toward / allow < least) least = toward / allow, leastAt = k;
  leastGrip = Math.min(leastGrip, toward * tk.speed / g);
}
console.log(`${process.argv[2].split(/[\\/]/).pop()}: ${n} sliding ticks over 20 degrees off the aim; under 0.9 of the allowed rate ${under} (least ${n ? least.toFixed(3) : 0} of it at tick ${leastAt}, ${n ? leastGrip.toFixed(3) : 0} of pure grip); the body's own cap binding on ${capped}`);
