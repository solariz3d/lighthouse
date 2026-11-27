// H7's scan (D678 repair, item 3, registered in section 3.4): on the layout with a joint covered in part at the window's start (a 45 m piece before the run, or
// 30 m), a dip or bump on h (the core's brush, a hill) centred 150-175 m; per variant the real build's K3 and the mutant H7's, and whether a row at the 0.01 m bar
// would read the real within it and H7 past it. Prints figures only. Usage: node h7scan.js TREE
const T = process.argv[2], path = require('path'), fs = require('fs'), Module = require('module');
const F = require(path.join(T, 'test/even_fixtures.js')), EVr = require(path.join(T, 'src/core/even.js')), SC = require(path.join(T, 'src/core/sculpt.js'));
const file = path.join(T, 'src/core/even.js'), src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const A = "} else if (before === 'part') { fixed.add(0); fixed.add(1); }"; if (src.split(A).length !== 2) throw new Error('H7 anchor not once');
const m = new Module(file, module); m.filename = file; m.paths = Module._nodeModulePaths(path.dirname(file)); m._compile(src.replace(A, () => '}'), file); const EVm = m.exports;
const lay = (bank, a) => [{ length: 200 - 90 - a, turn: 0, bank: 0 }, { length: 90, turn: 0, bank }, { length: a, turn: 0, bank }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30, bank })), { length: 60, turn: 0, bank }, { length: 90, turn: 0, bank: 0 }];
const rows = []; let caught = 0, n = 0;
for (const a of [45, 30]) for (const bank of [0, -20]) {
  const b0 = F.build(lay(bank, a));
  for (const s0 of [150, 158, 165, 172]) for (const r of [10, 20, 30]) for (const delta of [-3, -1, 1, 3]) {
    const base = Object.freeze(SC.brush(b0, { mode: 'hill', channel: 'h', s0, r, delta }).doc), run = F.runPieces(base);
    const real = EVr.even(base, { ...run, value: 16, hold: 'left' }), mut = EVm.even(base, { ...run, value: 16, hold: 'left' });
    const kr = F.centreOff(real.doc, base).off, km = F.centreOff(mut.doc, base).off;
    let dh = 0; for (const s of F.stations(real.window.w0, real.window.w1, 0.25)) dh = Math.max(dh, Math.abs(F.at(mut.doc, 'h', s) - F.at(real.doc, 'h', s)));
    n++; const c = kr <= 0.01 && km > 0.01; if (c) caught++;
    rows.push({ a, bank, s0, r, delta, k3real: +kr.toFixed(5), k3h7: +km.toFixed(5), dh: +dh.toFixed(5), caught: c });
  }
}
const inBar = rows.filter((x) => x.k3real <= 0.01);
console.log(JSON.stringify({ variants: n, caught, realWithinBar: inBar.length, maxDhWhereRealWithin: Math.max(0, ...inBar.map((x) => x.dh)), maxK3h7WhereRealWithin: Math.max(0, ...inBar.map((x) => x.k3h7)), maxDhAll: Math.max(...rows.map((x) => x.dh)), unchanged: rows.filter((x) => x.dh === 0).length }));
for (const x of rows) console.log(JSON.stringify(x));
