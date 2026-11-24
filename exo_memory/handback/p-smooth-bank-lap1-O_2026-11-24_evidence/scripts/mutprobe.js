// mutprobe.js: for each surviving mutant, the banked S's document bank on a mutated copy of src/ and tools/: worst overshoot, roll acceleration peak (°/m², 1 m second difference), rate peaks
const fs = require('fs'), path = require('path'), os = require('os');
const SRC = 'G:/consonance-scratch/o-smooth-t180', MT = fs.readFileSync(SRC + '/test/core_bank_flow_mutation.test.js', 'utf8'), X = 'core/extend.js';
const MT2 = MT.replace(/\r\n/g, '\n'), MUTANTS = eval(MT2.slice(MT2.indexOf('const MUTANTS = [') + 16, MT2.indexOf('const FILES')).trim().replace(/;$/, ''));   // the table's text, not the file: requiring it would run its tests
const ids = process.argv.slice(2);
function measure(T) {
  const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), TB = require(T + '/src/core/turnby.js'), RP = require(SRC + '/test/roll_profile.js');
  const DEG = Math.PI / 180, M = [[145, -27], [200, 0], [255, 25], [300, 26]];
  const lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
  const d = TB.extendCorner(lead, { length: 300, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }] }, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: M.map(([at, g]) => ({ at, target: g * DEG })) } });
  const b = RP.docBank(d.pieces[1], 0.5), acc = [];
  for (let i = 2; i < b.length - 2; i++) acc.push(Math.abs(b[i + 2].v - 2 * b[i].v + b[i - 2].v));   // samples 0.5 m apart, so i±2 is ±1 m: h = 1, no division
  return { acc: +Math.max(...acc).toFixed(4), r30: +Math.max(...RP.rateOn(b, 30).map((x) => Math.abs(x.r))).toFixed(3), min: +Math.min(...b.map((x) => x.v)).toFixed(3) };
}
for (const id of ids) {
  const m = id === 'none' ? { edits: [] } : MUTANTS.find((x) => x.id.startsWith(id + ' '));
  const dir = fs.mkdtempSync(path.join('G:/consonance-scratch/o-smooth-work/tmp', 'probe-'));
  for (const d of ['src', 'tools']) fs.cpSync(path.join(SRC, d), path.join(dir, d), { recursive: true });
  for (const [file, from, to] of m.edits) { const f = path.join(dir, 'src', file), s = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'); if (s.split(from).length !== 2) throw new Error('not once ' + id); fs.writeFileSync(f, s.replace(from, () => to)); }
  try { console.log(id, JSON.stringify(measure(dir))); } catch (e) { console.log(id, 'THREW', e.code, e.message.slice(0, 120)); }
}
