'use strict';
const D = require('./t/src/core/document.js'), { extend } = require('./t/src/core/extend.js');
const DEG = Math.PI / 180;
const lead = () => extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
function run(name, opts, base = lead()) {
  try {
    const d = extend(base, opts), P = d.pieces[d.pieces.length - 1];
    const marks = [{ at: typeof opts.transition === 'object' ? opts.transition.phi : (opts.transition || opts.length), target: opts.targets.phi }, ...((opts.through && opts.through.phi) || [])];
    const at = marks.map((m) => `${m.at}:${(m.target / DEG).toFixed(2)}->${(D.channelValue(P, 'phi', m.at) / DEG).toFixed(3)}`).join(' ');
    const ph = P.channels.phi, bad = ph.some((x) => !Number.isFinite(x));
    const j = D.channelAt(P, 'phi', 0);
    console.log(name, 'OK  knots', P.knots.join(','), '| marks asked->laid', at, '| nonfinite', bad, '| d2(0)', j.d2.toExponential(2));
  } catch (e) { console.log(name, 'THROW', e.code, e.message.slice(0, 160)); }
}
// A: first mark at 10 m, through mark at 15 m: does every mark get a free point?
run('A tr10+15', { length: 100, targets: { phi: 10 * DEG }, transition: { phi: 10 }, bankShape: 'flow', through: { phi: [{ at: 15, target: 20 * DEG }] } });
run('A2 tr10+15 L300', { length: 300, targets: { phi: 10 * DEG }, transition: { phi: 10 }, bankShape: 'flow', through: { phi: [{ at: 15, target: 20 * DEG }] } });
// B: zigzag every 5 m (each a peak)
run('B zigzag', { length: 40, targets: { phi: 10 * DEG }, transition: { phi: 5 }, bankShape: 'flow', through: { phi: [10, 15, 20, 25, 30].map((at, k) => ({ at, target: (k % 2 ? 10 : -10) * DEG })) } });
run('B2 zigzag 200', { length: 200, targets: { phi: 10 * DEG }, transition: { phi: 20 }, bankShape: 'flow', through: { phi: [25, 30, 35, 40, 45, 50].map((at, k) => ({ at, target: (k % 2 ? 10 : -10) * DEG })) } });
// C: plateau, two equal marks (no peak detected), then back
run('C plateau', { length: 300, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: [{ at: 150, target: -20 * DEG }, { at: 250, target: 0 }] } });
// D: marks snapped to an existing knot (within 1 m) next to each other
run('D snap', { length: 300, targets: { phi: -20 * DEG }, transition: { phi: 80.5 }, bankShape: 'flow', through: { phi: [{ at: 99.5, target: -25 * DEG }, { at: 120.5, target: 0 }] } });
// E: last mark 0.8 m before a knot (anchor after mark)
run('E anchor', { length: 300, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: [{ at: 139.2, target: 10 * DEG }] } });
