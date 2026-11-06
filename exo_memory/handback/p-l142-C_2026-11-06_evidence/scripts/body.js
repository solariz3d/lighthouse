
// ── L142 measurements (pane C). Read-only on the tree; prints JSON lines ──────────────────────────────────────────────────────────────────
const D = require('__W__/src/core/document.js');
const out = (k, v) => console.log(k + ' ' + JSON.stringify(v));
const extend = (p) => { const n = p.shell.getState().history.present.pieces.length; p.root.all().find((e) => e.tagName === 'BUTTON' && e.textContent === 'Extend').onclick(); const doc = p.shell.getState().history.present; return doc.pieces.length === n + 1 ? doc.pieces.at(-1) : null; };
// sample a placed road piece every 1 m: curvature kh (rad/m), its heading (deg, integrated), bank phi (deg)
const sample = (P) => { const rows = []; let hd = 0, prev = null; for (let s = 0; s <= P.length + 1e-9; s += 1) { const k = D.channelAt(P, 'kh', s).v, ph = D.channelAt(P, 'phi', s).v; if (prev !== null) hd += (prev + k) / 2 * 1; rows.push({ s, k, hd: hd * 180 / Math.PI, phi: ph * 180 / Math.PI }); prev = k; } return rows; };
const firstAt = (rows, f) => { const r = rows.find(f); return r ? r.s : null; };

// ITEM 2: where the extra turn's bend begins. Each case on a fresh shell whose head is his testturn1 p1 (a 1,000 m straight), the next piece 1,000 m
async function item2() {
  const base = async (turn) => { const p = await mount(); p.type('length m', 1000); p.type('turn °', turn); const P = extend(p); p.panel.unmount(); return P; };
  const cases = [[90, 0], [90, 90], [-90, 180], [45, 45], [90, -45]];
  for (const [t, x] of cases) {
    const p = await mount(); p.type('length m', 1000); p.type('turn °', t);
    const ex = p.panel.extraHandles().find((e) => e.field === 'turn');
    p.make('turn', x); const ch = p.changes(); const refused = p.refusal();
    const P = extend(p), B = await base(t);
    if (!P || !B) { out('item2', { turn: t, extra: x, refused, laid: !!P }); p.panel.unmount(); continue; }
    const r = sample(P), b = sample(B), L = P.length;
    // the extra's own part: this piece less the same piece with no extra (the additive model: the extra adds on top of the first)
    const d = r.map((row, i) => ({ s: row.s, dk: row.k - b[i].k, dh: row.hd - b[i].hd }));
    const dEnd = d.at(-1).dh, kMax = Math.max(...d.map((q) => Math.abs(q.dk)));
    const leaves = firstAt(d, (q) => Math.abs(q.dk) > 1e-3 * kMax);
    const h10 = firstAt(d, (q) => Math.abs(q.dh) >= 0.10 * Math.abs(dEnd)), h50 = firstAt(d, (q) => Math.abs(q.dh) >= 0.50 * Math.abs(dEnd));
    const k10 = firstAt(d, (q) => Math.abs(q.dk) >= 0.10 * kMax), k50 = firstAt(d, (q) => Math.abs(q.dk) >= 0.50 * kMax), kPeak = d.reduce((a, q) => (Math.abs(q.dk) > Math.abs(a.dk) ? q : a)).s;
    // the first corner's own ramp, on the base piece
    const bEnd = b.at(-1).hd, bk = Math.max(...b.map((q) => Math.abs(q.k)));
    const bLeaves = firstAt(b, (q) => Math.abs(q.k) > 1e-3 * bk), b10 = firstAt(b, (q) => Math.abs(q.hd) >= 0.1 * Math.abs(bEnd)), b50 = firstAt(b, (q) => Math.abs(q.hd) >= 0.5 * Math.abs(bEnd));
    // and whether the first corner itself changed under the extra (testurn1's "tighter" bug): the heading at the extra's from, with and without
    const from = ch.turnDeg && ch.turnDeg[0] ? ch.turnDeg[0].from : null;
    const atFrom = from !== null ? { withExtra: +r[Math.round(from)].hd.toFixed(3), baseOnly: +b[Math.round(from)].hd.toFixed(3) } : null;
    out('item2', { turn: t, extra: x, handleShare: ex ? ex.at : null, changes: ch.turnDeg || null, refused, L,
      extra_part: { headingEnd: +dEnd.toFixed(3), leavesZero_s: leaves, heading10_s: h10, heading50_s: h50, curv10_s: k10, curv50_s: k50, curvPeak_s: kPeak },
      first_corner: { headingEnd: +bEnd.toFixed(3), leavesZero_s: bLeaves, heading10_s: b10, heading50_s: b50 }, headingAtFrom: atFrom, totalEnd: +r.at(-1).hd.toFixed(3) });
    if (process.env.DUMP) require("fs").writeFileSync(`${process.env.DUMP}/item2_${t}_${x}.csv`, 's,kh_with,kh_base,heading_with,heading_base\n' + r.map((q, i) => [q.s, q.k, b[i].k, q.hd.toFixed(4), b[i].hd.toFixed(4)].join(',')).join('\n'));
    p.panel.unmount();
  }
}

// ITEM 3: the order. Same values, two orders; what the panel offers at each step, the options it hands the core, and the road laid
const V = process.env.HIS ? { length: 1000, turn: -90, bank: 88.45, xturn: 90, xbank: -88.45 } : { length: 2500, turn: -90, bank: 40, xturn: 90, xbank: -40 };   // HIS: his S bank-back (brief, L141)
async function order(name, steps) {
  const p = await mount(); p.type('length m', V.length); p.type('turn °', V.turn);
  const log = [];
  const snap = (step) => log.push({ step, extras: p.panel.extraHandles().map((e) => ({ id: e.id, field: e.field, from: e.from, value: e.value, unused: !!e.unused, at: e.at })), changes: p.changes(), bankField: p.field('bank °').value, refused: p.refusal() });
  snap('start');
  for (const st of steps) {
    if (process.env.MODE === 'drag') {
      // his way: every value by pressing a handle on the ghost and dragging it (the stage's own pointer events through the handles and the marks' layer)
      const kind = st === 'bank' ? 'bank' : st === 'xturn' ? 'extra:turnDeg:0' : 'extra:bank:0', h = p.handle(kind, 1);
      const all = p.panel.handles.handles().filter((x) => x.screen).map((x) => [x.kind, x.side, +x.screen.x.toFixed(1), +x.screen.y.toFixed(1)]);
      if (!h) { log.push({ step: st, error: `no ${kind} handle on screen`, handles: all }); continue; }
      const before = JSON.stringify(p.changes()), bank0 = p.field('bank °').value;
      if (st === 'bank') p.drag(h, 0, -60); else if (st === 'xturn') p.drag(h, -80, 0); else p.drag(h, 0, 60);
      log.push({ step: st + ' (drag)', at: [+h.screen.x.toFixed(1), +h.screen.y.toFixed(1)], handles: all, bankField: [bank0, p.field('bank °').value], changesBefore: before });
    } else {
    if (st === 'bank') p.type('bank °', V.bank);
    if (st === 'xturn') { try { p.make('turn', V.xturn); } catch (e) { log.push({ step: st, error: e.message }); } }
    if (st === 'xbank') { try { p.make('bank', V.xbank); } catch (e) { log.push({ step: st, error: e.message }); } }
    }
    p.tick(); snap(st);
  }
  const opts = p.panel.options(); const P = extend(p);
  out('item3 ' + name, { steps, log, options: { changes: opts.changes, targets: opts.targets, transition: opts.transition }, laid: !!P, length: P && P.length });
  if (P && process.env.DUMP) require("fs").writeFileSync(`${process.env.DUMP}/item3_${name}.csv`, 's,kh,heading,phi\n' + sample(P).map((q) => [q.s, q.k, q.hd.toFixed(4), q.phi.toFixed(4)].join(',')).join('\n'));
  p.panel.unmount(); return { opts, P };
}
async function item3() {
  const A = await order('A_bank_first', ['bank', 'xturn', 'xbank']), B = await order('B_xturn_first', ['xturn', 'bank', 'xbank']);
  out('item3 options equal', JSON.stringify(A.opts.changes) === JSON.stringify(B.opts.changes) && JSON.stringify(A.opts.targets) === JSON.stringify(B.opts.targets));
  if (A.P && B.P) { const a = sample(A.P), b = sample(B.P); let worst = { phi: 0, hd: 0, s: null }; a.forEach((q, i) => { const dp = Math.abs(q.phi - b[i].phi), dh = Math.abs(q.hd - b[i].hd); if (dp > worst.phi) worst = { phi: dp, hd: dh, s: q.s }; if (dh > worst.hd) worst.hd = dh; });
    out('item3 road diff', { worstPhiDeg: +worst.phi.toFixed(4), atS: worst.s, worstHeadingDeg: +worst.hd.toFixed(4), channelsIdentical: JSON.stringify(A.P.channels) === JSON.stringify(B.P.channels) }); }
}
(async () => { if (!process.env.ONLY || process.env.ONLY === '2') await item2(); if (!process.env.ONLY || process.env.ONLY === '3') await item3(); })().catch((e) => { console.error('measure failed:', e.stack); process.exit(1); });
