// usage: node replay.js <tree> <save> <out.json|-> [--close <out.t180track>]
// D638: re-lay a saved track piece by piece through the SHIPPED writer: a headless createCoreShell (app/core/coreshell.js), each piece's Extend options
// made by the shipped panel's extendOptions (app/core/panel.js) from what the saved piece shows (its length, the end value of every channel that changed,
// and which of turn and climb reach their end within the early ramp, i.e. were laid with "early" ticked), with the head the shell itself reports
// (headState), then shell.extend(opts), as the Extend button does. Each re-laid piece is compared with the saved one, channel by channel (knots and values).
// With --close: the lap is then closed with shell.closeBest() (what the Close button calls, panel.js:833), on the page (no worker), and the result saved.
'use strict';
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2), R = path.resolve(args[0]), save = args[1], outJson = args[2], ci = args.indexOf('--close'), closeOut = ci > 0 ? args[ci + 1] : null;
const q = (m) => require(path.join(R, m));
const D = q('src/core/document.js'), { createCoreShell } = q('app/core/coreshell.js'), { extendOptions } = q('app/core/panel.js');
const DEG = Math.PI / 180, EARLY_M = 20;
const FIELDS = [['turn', 'kh', (v) => (v * 100) / DEG], ['climb', 'kv', (v) => (v * 100) / DEG], ['bank', 'phi', (v) => v / DEG], ['width', 'w', (v) => v], ['cup', 'c', (v) => v], ['edge', 'e', (v) => v], ['edgeR', 'er', (v) => v], ['start', 's', (v) => v], ['tube', 't', (v) => v]];

// a turn or climb that starts and ends at 0 and moves between was laid as a CORNER (the panel's default reading of the field: turnAs 'corner', TB.extendCorner):
// its field is the change of heading or pitch, here the channel's integral over the piece (in degrees)
const integral = (P, ch) => { let s = 0; const n = Math.ceil(P.length / 0.05), h = P.length / n; for (let j = 0; j < n; j++) s += D.channelAt(P, ch, (j + 0.5) * h).v * h; return s / DEG; };
function optsFor(P, head, empty) {
  const K = [0, ...P.knots, P.length], typed = {}, atStart = {}, notes = [];
  let corner = false;
  for (const [f, ch] of [['turn', 'kh'], ['climb', 'kv']]) {
    const a = P.channels[ch]; if (!a) continue;
    if (Math.abs(a[a.length - 1]) < 1e-12 && Math.abs(head[ch]) < 1e-12 && a.some((v) => Math.abs(v) > 1e-9)) { typed[f] = integral(P, ch); corner = true; notes.push(`${f} as a corner of ${typed[f].toFixed(4)}°`); }
  }
  for (const [f, ch, toField] of FIELDS) {
    const a = P.channels[ch]; if (!a || f in typed) continue;
    const end = a[a.length - 1], from = head[ch];
    if (Number.isFinite(from) && Math.abs(end - from) < 1e-12) continue;   // unchanged: the field left blank (on an empty track, the head is the family's default)
    typed[f] = toField(end);
    // reached its end value by the early ramp's last knot (20 m), and held after: laid with "early" ticked
    let last = 0; for (let j = 1; j < a.length; j++) if (Math.abs(a[j] - a[j - 1]) > 1e-12) last = j;
    if (K[last] <= EARLY_M + 1e-9 && P.length > EARLY_M) atStart[f] = true;
  }
  // read as a corner, a typed 0 is still a rate of 0 (panel.js extendOptions: corner only when t !== 0), so only a NONZERO rate beside a corner cannot be laid
  if (corner && (('turn' in typed && typed.turn !== 0 && !notes.some((n) => n.startsWith('turn'))) || ('climb' in typed && typed.climb !== 0 && !notes.some((n) => n.startsWith('climb'))))) throw new Error(`a piece with one field as a corner and the other as a rate: the panel reads both one way (turnAs), so this replay cannot lay it as typed (${P.id}: ${JSON.stringify(typed)})`);
  return { opts: extendOptions({ length: P.length, ...typed, empty, atStart, turnAs: corner ? 'corner' : 'rate', head }), typed, atStart, notes };
}
// the route channels sampled every 0.5 m: what moves the centre line (the bank, width and cross-section do not)
function routeDiff(a, b) { let m = 0; for (const ch of ['kh', 'kv']) for (let s = 0; s <= a.length + 1e-9; s += 0.5) m = Math.max(m, Math.abs(D.channelAt(a, ch, Math.min(s, a.length)).v - D.channelAt(b, ch, Math.min(s, b.length)).v)); return m; }
function cmp(a, b) {
  const r = { knots: JSON.stringify(a.knots) === JSON.stringify(b.knots), length: a.length === b.length, ch: {} };
  for (const ch of new Set([...Object.keys(a.channels), ...Object.keys(b.channels)])) {
    const x = a.channels[ch], y = b.channels[ch];
    r.ch[ch] = !x || !y ? 'missing' : x.length !== y.length ? `n ${x.length}/${y.length}` : Math.max(...x.map((v, i) => Math.abs(v - y[i])));
  }
  return r;
}
(async () => {
  const orig = D.parse(fs.readFileSync(save, 'utf8'));
  const shell = await createCoreShell({ brushFn: null, autosaveMs: 0 });
  shell.adopt(Object.freeze(D.checkDoc({ ...orig, closed: false, pieces: Object.freeze([]) })));
  const rows = []; let refused = null;
  const splice = args.includes('--splice'), noguard = args.includes('--noguard'), TB = q('src/core/turnby.js');
  const si = args.indexOf('--upto'), upto = si > 0 ? args[si + 1] : null;   // lay the pieces up to and including this id (the ones after are the old Close's)
  for (let i = 0; i < orig.pieces.length; i++) {
    if (upto && i > 0 && orig.pieces[i - 1].id === upto) break;
    const P = orig.pieces[i]; if (P.type !== 'road') throw new Error(`piece ${i} is ${P.type}: this replay lays roads only`);
    const head = shell.headState(), { opts, typed, atStart, notes } = optsFor(P, head, i === 0);
    if (P.family) opts.family = P.family;
    const n0 = shell.getState().history.present.pieces.length;
    // --splice: only a piece laid with "early" turn or climb is laid again by Extend; every other piece is kept exactly as saved (adopted, as opening a save does)
    if (splice && !(atStart.turn || atStart.climb)) {
      const cur = shell.getState().history.present;
      shell.adopt(Object.freeze(D.checkDoc({ ...cur, pieces: Object.freeze([...cur.pieces, P]) })));
      rows.push({ i, id: P.id, length: P.length, kept: true, cmp: cmp(shell.getState().history.present.pieces[n0], P), route: 0 });
      continue;
    }
    // --noguard (a WHAT-IF, never the builder's behaviour): the same shipped writer function Extend calls (src/core/turnby.js extendCorner), adopted without the
    // shell's pass-clearance gate, to measure how far the road moves and whether Close can close it
    if (noguard) shell.adopt(Object.freeze(TB.extendCorner(shell.getState().history.present, opts))); else shell.extend(opts);
    if (splice && shell.getState().history.present.pieces.length === n0 + 1) {   // the re-laid piece keeps the saved id, so the joints keep their names
      const cur = shell.getState().history.present, ps = cur.pieces.slice(); ps[n0] = Object.freeze({ ...ps[n0], id: P.id });
      shell.adopt(Object.freeze(D.checkDoc({ ...cur, nextId: orig.nextId, pieces: Object.freeze(ps) })));
    }
    const st = shell.getState(), d = st.history.present;
    if (d.pieces.length !== n0 + 1) { refused = { i, id: P.id, message: st.message }; console.log(`REFUSED: piece ${i} (${P.id}) was not laid: ${st.message}`); break; }
    const L = d.pieces[n0];
    rows.push({ i, id: P.id, length: P.length, typed, atStart, notes, transition: opts.transition || null, cmp: cmp(L, P), route: routeDiff(L, P) });
  }
  const st = shell.getState();
  if (st.resolveError) throw new Error(`the re-laid track does not resolve: ${st.resolveError}`);
  const out = { tree: R, rows, refused, closedBefore: st.history.present.closed };
  out.openDoc = path.join(path.dirname(outJson === '-' ? save : outJson), path.basename(outJson === '-' ? 'open' : outJson, '.json') + '.open.t180track');
  fs.writeFileSync(out.openDoc, D.serialize(st.history.present));
  if (closeOut && !refused) {
    const t0 = Date.now(); await shell.closeBest(); const s2 = shell.getState();
    out.close = { message: s2.message, closed: s2.history.present.closed, ms: Date.now() - t0 };
    if (!s2.history.present.closed) { console.log(`CLOSE REFUSED: ${s2.message}`); fs.writeFileSync(outJson, JSON.stringify(out, null, 1)); return; }
    fs.writeFileSync(closeOut, D.serialize ? D.serialize(s2.history.present) : JSON.stringify(s2.history.present, null, 2));
    out.closedDoc = closeOut;
  }
  out.openDoc = path.join(path.dirname(outJson === '-' ? save : outJson), path.basename(outJson === '-' ? 'open' : outJson, '.json') + '.open.t180track');
  fs.writeFileSync(out.openDoc, D.serialize ? D.serialize(st.history.present) : JSON.stringify(st.history.present, null, 2));
  const text = JSON.stringify(out, null, 1); if (outJson === '-') console.log(text); else fs.writeFileSync(outJson, text);
  const bad = rows.filter((r) => !r.cmp.knots || !r.cmp.length || Object.values(r.cmp.ch).some((v) => typeof v !== 'number' || v > 1e-9));
  console.log(`${rows.length} pieces re-laid; ${rows.length - bad.length} match the save (knots, length, every channel within 1e-9); differ: ${bad.map((r) => r.id).join(' ') || 'none'}${out.close ? ` | Close: ${out.close.message}` : ''}`);
  const rd = rows.filter((r) => r.route > 1e-9);
  console.log(`turn and climb sampled every 0.5 m: ${rows.length - rd.length} pieces within 1e-9 rad/m of the save; differ: ${rd.map((r) => `${r.id} ${r.route.toExponential(2)}`).join(', ') || 'none'}`);
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
