// LAP 4, item c's two options, timed as a whole ask (the release, or a typed edit): on tree argv[2] as it stands (the least whole metre, every metre below the first
// 5 m step that lays), and on the same tree with flowRoom's scan put back to 15b1306's (back down by the metre while it lays; ENV FLOW_BACKSTEP=1, patched into a copy).
// Over the reader's drawn refusals (seed 11, 5 m and 20 m floors) and list 158; the named room and its time per list.
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const fs = require('fs'), path = require('path');
const SRC = path.resolve(process.argv[2]), mode = process.argv[3] || 'least';
let R = SRC;
if (mode === 'backstep') {
  R = path.join(__dirname, '../tmp/release-backstep'); fs.rmSync(R, { recursive: true, force: true });
  for (const d of ['src', 'tools']) fs.cpSync(path.join(SRC, d), path.join(R, d), { recursive: true });
  const f = path.join(R, 'src/core/extend.js'), t = fs.readFileSync(f, 'utf8'), a = '    for (let d = 1; d < dm; d++) if (ok(d)) { dm = d; break; }';
  if (t.split(a).length !== 2) throw new Error('scan not found'); fs.writeFileSync(f, t.replace(a, '    while (dm - 1 >= 0 && ok(dm - 1)) dm -= 1;'));
}
const D = require(path.join(R, 'src/core/document.js')), { extend } = require(path.join(R, 'src/core/extend.js'));
const DEG = Math.PI / 180, LEN = 300, lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
function drawn(gap, count, seed = 11) { const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648), out = [];
  for (let k = 0; k < count; k++) { const tr = +(20 + rnd() * 80).toFixed(1), nm = 1 + Math.floor(rnd() * 3), marks = []; let at = tr;
    for (let i = 0; i < nm; i++) { at = +(at + gap + rnd() * 40).toFixed(1); if (at > LEN) break; marks.push({ at, target: (rnd() * 60 - 30) * DEG }); }
    out.push({ first: { at: tr, target: (rnd() * 60 - 30) * DEG }, marks }); } return out; }
const ask = (L) => { const o = { length: LEN, targets: { phi: L.first.target }, transition: { phi: L.first.at }, bankShape: 'flow', through: { phi: L.marks } };
  const t0 = performance.now(); let msg = null; try { extend(lead, o); } catch (e) { if (!(e instanceof D.CoreError)) throw e; msg = e.message; } return { ms: performance.now() - t0, msg }; };
const st = (a) => { const s = [...a].sort((x, y) => x - y); return `n ${a.length}, median ${s[s.length >> 1].toFixed(0)} ms, p95 ${s[Math.floor(s.length * 0.95)].toFixed(0)}, max ${s[s.length - 1].toFixed(0)}`; };
const room = (m) => { const x = /needs (?:at least )?([\d.]+) m after .*?\(it has ([\d.]+) m/.exec(m || ''); return x ? +(+x[1] - +x[2]).toFixed(1) : null; };
for (const gap of [5, 20]) {
  const ms = [], named = [];
  drawn(gap, 160).forEach((L, i) => { const r = ask(L); if (r.msg) { ms.push(r.ms); named.push(`${i}:+${room(r.msg)}`); } });
  console.log(`${mode} gap ${gap}: refused ${st(ms)}`);
  console.log(`   rooms named (list:move) ${named.join(' ')}`);
}
const L158 = { first: { at: 32.2, target: 21.3 * DEG }, marks: [{ at: 51, target: -9.4 * DEG }, { at: 71.9, target: -26.5 * DEG }] };
const r = ask(L158); console.log(`${mode} list 158: ${r.ms.toFixed(0)} ms, +${room(r.msg)}`);
