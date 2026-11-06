// ---- mine (D642 review of a924f1b): the additive model THROUGH THE PANEL (C's D641 mount, the real core shell + panel + handles on a fake stage)
//  X0. extra 0 is no extra: his piece (−90 corner, bank 88.45, cup 15.5, width 31, 1,000 m) laid by the core from the panel's options with no extra, against the same with the
//      extra turn made at 0, the extra bank made at its own value (88.45), the extra width at 31 and the extra cup at 15.5: D.serialize equal?
//  H.  his −90 keeps its first half: the built heading (the adapter's path) every 2 m to the mark, with the extra turn +180 (his p2) against no extra
//  BAR. the built heading rate, pitch rate and roll acceleration, each ÷ the bar (29.4 / (10·170²), core_additive.test.js), over the piece and 20 m on, for his cases laid by the panel
const D = require(WT + '/src/core/document.js'), A = require(WT + '/src/core/adapter.js');
const BAR = 29.4 / (10 * 170 * 170), r4 = (x) => Math.round(x * 1e4) / 1e4;
const layOf = (p) => TB.extendCorner(p.shell.getState().history.present, p.panel.options());
const xOf = (p, f) => p.panel.extraHandles().find((e) => e.field === f);
function builtPeaks(doc, a, b) {
  const S = A.toPath(doc).path.samples; let prev = null, off = 0, poff = 0, pp = null;
  const H = S.map((x) => { let v = Math.atan2(x.T[2], x.T[0]); if (prev !== null) { while (v + off - prev > Math.PI) off -= 2 * Math.PI; while (v + off - prev < -Math.PI) off += 2 * Math.PI; } v += off; prev = v; return { s: x.s, h: v, p: Math.asin(Math.max(-1, Math.min(1, x.T[1]))), r: x.roll }; });
  const lin = (k) => (s) => { let lo = 0, hi = H.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (H[m].s <= s) lo = m; else hi = m; } const f = (s - H[lo].s) / ((H[hi].s - H[lo].s) || 1); return H[lo][k] + f * (H[hi][k] - H[lo][k]); };
  const hs = lin('h'), ps = lin('p'), rs = (s) => { let lo = 0, hi = H.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (H[m].s <= s) lo = m; else hi = m; } return H[lo].r; };
  let mh = 0, mp = 0, mr = 0, ah = 0, ap = 0, ar = 0;
  for (let s = a; s <= b; s += 0.5) { const h = Math.abs(hs(s + 1) - 2 * hs(s) + hs(s - 1)), p = Math.abs(ps(s + 1) - 2 * ps(s) + ps(s - 1)), r = Math.abs(rs(s + 2) - 2 * rs(s) + rs(s - 2)) / 4; if (h > mh) { mh = h; ah = s; } if (p > mp) { mp = p; ap = s; } if (r > mr) { mr = r; ar = s; } }
  return { heading: r4(mh / BAR), headingAt: ah, pitch: r4(mp / BAR), pitchAt: ap, roll: r4(mr / BAR), rollAt: ar };
}
const headingsTo = (doc, s0, s1) => { const S = A.toPath(doc).path.samples; const out = []; for (const x of S) if (x.s >= s0 - 1e-9 && x.s <= s1 + 1e-9) out.push([x.s, Math.atan2(x.T[0], x.T[2])]); return out; };
async function his(L = 1000, bank = 88.45) { const p = await mount(); p.type('length m', L); p.type('turn °', -90); p.type('bank °', bank); p.type('cup °', 15.5); p.type('width m', 31); return p; }
(async () => {
  const out = { X0: [], H: null, BAR: [] };
  // X0
  { const p = await his(), none = D.serialize(layOf(p)); p.panel.unmount();
    for (const [f, v] of [['turn', 0], ['bank', 88.45], ['width', 31], ['cup', 15.5]]) {
      const q = await his(), x = xOf(q, f); if (!x) { out.X0.push({ field: f, result: 'no extra handle' }); q.panel.unmount(); continue; }
      q.panel.secondExtra(x.id, v); q.tick(); const ch = q.panel.options().changes || {}, d = D.serialize(layOf(q));
      out.X0.push({ field: f, extraValue: v, changesSent: JSON.stringify(ch), byteEqualToNoExtra: d === none, bytes: [d.length, none.length] }); q.panel.unmount();
    }
    // the climb as a corner: +20, with its extra at 0
    const c0 = await mount(); c0.type('length m', 1000); c0.type('climb °', 20); const noneC = D.serialize(layOf(c0)); c0.panel.unmount();
    const c1 = await mount(); c1.type('length m', 1000); c1.type('climb °', 20); const xc = xOf(c1, 'climb'); if (xc) { c1.panel.secondExtra(xc.id, 0); c1.tick(); }
    out.X0.push({ field: 'climb (corner +20)', extraValue: 0, changesSent: JSON.stringify(c1.panel.options().changes || {}), byteEqualToNoExtra: D.serialize(layOf(c1)) === noneC }); c1.panel.unmount();
  }
  // H: his p2 (C's case 3: the extra turn +180 from where the panel lays it, the extra bank to −88.45), against no extra
  { const p = await his(), none = layOf(p); p.panel.unmount();
    const q = await his(); q.panel.secondExtra(xOf(q, 'turn').id, 180); q.tick(); q.panel.secondExtra(xOf(q, 'bank').id, -88.45); q.tick();
    const ch = q.panel.options().changes, d = layOf(q), mark = ch.turnDeg[0].from, s0 = 1000;
    const a = headingsTo(none, s0, s0 + mark), b = headingsTo(d, s0, s0 + mark); let worst = 0; for (let i = 0; i < Math.min(a.length, b.length); i++) { let dd = Math.abs(a[i][1] - b[i][1]); if (dd > Math.PI) dd = 2 * Math.PI - dd; worst = Math.max(worst, dd); }
    const endT = headingsTo(d, s0 + 1000, s0 + 1000).concat(headingsTo(d, s0 + 999, s0 + 1000)).pop(), startT = headingsTo(d, s0, s0)[0], noneEnd = headingsTo(none, s0 + 999, s0 + 1000).pop();
    let turn = (endT[1] - startT[1]) / DEG; while (turn > 180) turn -= 360; while (turn < -180) turn += 360; let turnNone = (noneEnd[1] - startT[1]) / DEG; while (turnNone > 180) turnNone -= 360; while (turnNone < -180) turnNone += 360;
    out.H = { changes: JSON.stringify(ch), mark, stationsCompared: Math.min(a.length, b.length), worstHeadingDiffDegBeforeMark: +(worst / DEG).toExponential(3), headingAtMarkNone: +(a[a.length - 1][1] / DEG).toFixed(4), headingAtMarkExtra: +(b[b.length - 1][1] / DEG).toFixed(4), pieceTurnExtraDeg: +turn.toFixed(3), pieceTurnNoneDeg: +turnNone.toFixed(3) };
    q.panel.unmount();
  }
  // BAR: his cases through the panel, a 200 m straight laid after so the joint is read too
  const cases = {
    'his p2 (−90, extra +180; bank 88.45, extra −88.45)': async () => { const q = await his(); q.panel.secondExtra(xOf(q, 'turn').id, 180); q.tick(); q.panel.secondExtra(xOf(q, 'bank').id, -88.45); q.tick(); return q; },
    'his S (−90, extra +90)': async () => { const q = await his(); q.panel.secondExtra(xOf(q, 'turn').id, 90); q.tick(); return q; },
    'his 11-05 picture (750 m, −90, bank 66.14 then 0 at the panel\'s mark)': async () => { const q = await his(750, 66.14); q.panel.secondExtra(xOf(q, 'bank').id, 0); q.tick(); return q; },
    'his 88.45 alone': async () => his(),
    'a climb corner +40, extra −80': async () => { const q = await mount(); q.type('length m', 1000); q.type('climb °', 40); q.panel.secondExtra(xOf(q, 'climb').id, -80); q.tick(); return q; },
  };
  for (const [name, mk] of Object.entries(cases)) {
    const q = await mk(); let d; try { d = layOf(q); } catch (e) { out.BAR.push({ case: name, refused: `${e.code}: ${String(e.message).slice(0, 100)}` }); q.panel.unmount(); continue; }
    const L = d.pieces[d.pieces.length - 1].length, d2 = TB.extendCorner(d, { length: 200 });
    out.BAR.push({ case: name, changes: JSON.stringify(q.panel.options().changes || {}), peaks: builtPeaks(d2, 1000 + 2, 1000 + L + 20) }); q.panel.unmount();
  }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
