// y1start.js <tree>: where the start run's kept edge (a grab at 30, right kept) is off, on the flat fixture. Synthetic fixture only.
'use strict';
const path = require('path');
const T = process.argv[2];
const D = require(path.join(T, 'src/core/document.js'));
const SC = require(path.join(T, 'src/core/sculpt.js'));
const EV = require(path.join(T, 'src/core/even.js'));
const F = require(path.join(T, 'test/even_fixtures.js'));
(async () => {
  const sh = await F.shellOn(F.fixture('flat')); F.grab(sh, 30, 16);
  const st = F.present(sh), off = SC.pieceOffsets(st), hi = off[1] + st.pieces[1].length;
  const r = EV.even(st, { from: 0, to: 1, value: 16, hold: 'right' });
  console.log('window', JSON.stringify(r.window), 'run end', hi);
  console.log('piece 0 length', st.pieces[0].length, 'knots in 0..60', JSON.stringify(st.pieces[0].knots.filter((k) => k <= 60)));
  console.log('cut piece 0 knots in 0..60', JSON.stringify(r.doc.pieces[0].knots.filter((k) => k <= 60)));
  const rows = F.stations(0, hi, 0.5).map((s) => ({ s, e: F.rimAcross(r.doc, s, 'right') - F.rimAcross(st, s, 'right'), w0: F.at(st, 'w', s) }));
  rows.sort((a, b) => Math.abs(b.e) - Math.abs(a.e));
  for (const x of rows.slice(0, 8)) console.log('s', x.s, 'off', x.e.toFixed(5), 'w before', x.w0.toFixed(3));
  const band = (a, b) => Math.max(...rows.filter((x) => x.s >= a && x.s <= b).map((x) => Math.abs(x.e)));
  console.log('max 0..10', band(0, 10).toFixed(5), '10..60', band(10, 60).toFixed(5), '60..end', band(60, hi).toFixed(5));
  const whole = rows.filter((x) => Number.isInteger(x.s)).sort((a, b) => Math.abs(b.e) - Math.abs(a.e));
  console.log('whole metres, worst 6:'); for (const x of whole.slice(0, 6)) console.log('  s', x.s, 'off', x.e.toFixed(5), 'w before', x.w0.toFixed(3));
  // the same edge read on the cross-section itself (the offset plus profile.js readAt at the exact width), no built path: the instrument check
  const RR = EV._internal.rimReader, ra = RR(st, -1), rb = RR(r.doc, -1);
  const at = (d, s) => F.at(d, 'l', s);
  const sec = F.stations(0, hi, 0.5).map((s) => ({ s, e: (at(r.doc, s) + rb(s)) - (at(st, s) + ra(s)) }));
  const mx = (f) => sec.filter(f).reduce((m, x) => (Math.abs(x.e) > Math.abs(m.e) ? x : m), { e: 0 });
  const h = mx((x) => !Number.isInteger(x.s)), w = mx((x) => Number.isInteger(x.s));
  console.log('section read: worst at half metres', h.e.toFixed(5), 'at', h.s, '; worst at whole metres', w.e.toFixed(5), 'at', w.s);
  const q = F.stations(0, hi, 0.25).map((s) => Math.abs((at(r.doc, s) + rb(s)) - (at(st, s) + ra(s))));
  console.log('section read every 0.25 m: worst', Math.max(...q).toFixed(5), 'stations over 0.01:', q.filter((x) => x > 0.01).length, 'of', q.length);
})().catch((e) => { console.error(e); process.exit(1); });
