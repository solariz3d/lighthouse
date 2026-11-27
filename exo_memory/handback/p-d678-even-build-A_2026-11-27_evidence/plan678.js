// plan678.js (pane A, D678 item 2): the pictures for him. The cases where the candidates' kept edges end farthest apart, drawn from above.
//   node plan678.js <builder tree, d678-even-a> <out dir> [how many cases, 3]
// The candidates and the cases are cand678.js's own: its source up to "the measures" is compiled here as a module, so nothing is retyped. For every case and kept
// edge (not the middle-kept rows), each candidate levels the start to 16 m and the kept edge's place across the road is read every 1 m over the window (the
// fixture's rimAcross: + to the left of the route); the GAP is the most, at any station, between the candidates' kept edges. The cases with the largest gaps
// (one hold each) are drawn.
// THE DRAWING: unrolled along the route (s to the right, the turn drawn straight; across is up), TRUE SCALE both ways, 10 px a metre, over the 120 m around the
// largest gap, with an overview of the whole window above at 2.5 px a metre. Grey: the road the panel names. Dashed cyan: the road before any grab. Dotted orange:
// where the road is now (what Even is given). Why not the page: the camera's focus centres on the road at a station, and the candidates move the road there, so a
// same-pose comparison through his controls cannot be made without changing the page. Fixtures only. Writes plan678_<n>.svg, a .jpg of each (headless Chrome),
// and plan678.json (the gaps of every case, the picks, the figures in each panel).
'use strict';
const fs = require('fs'), path = require('path'), Module = require('module'), http = require('http');
const [T0, OUT, HOW] = process.argv.slice(2), T = path.resolve(T0), N = Number(HOW || 3);
fs.mkdirSync(OUT, { recursive: true });
const CF = path.join(__dirname, 'cand678.js'), csrc = fs.readFileSync(CF, 'utf8'), cut = csrc.indexOf('// ── the measures ──');
if (cut < 0) throw new Error('cand678.js: "the measures" not found');
const cm = new Module(CF, module); cm.filename = CF; cm.paths = Module._nodeModulePaths(__dirname);
cm._compile(`${csrc.slice(0, cut)}\nmodule.exports = { CANDS, patched, cases, F, R };\n`, CF);
const { CANDS, patched, cases, F, R } = cm.exports;
const NAMES = { now: 'where it is now: the road Even is given', A0: 'A0, as built: the road read from the window\'s ends (rest 10 m, agree 1 cm)', A: 'A, as built, mended: read at rest up to 100 m out, else where it is now', B: 'B, no guess: the kept edge kept where it is', C: 'C, no guess, smoothed: eased between where it is at the window\'s ends' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

(async () => {
  const EVS = Object.fromEntries(Object.entries(CANDS).map(([k, e]) => [k, patched(e)]));
  const all = await cases(), gaps = [];
  for (const c of all) for (const hold of c.holds) {
    if (hold === 'centre') continue;
    const { win } = EVS.A0.evenWindow(c.start, c.run), w0 = Math.max(0, Math.ceil(win.w0)), w1 = Math.floor(win.w1), docs = {};
    for (const [k, EV] of Object.entries(EVS)) { try { docs[k] = EV.even(c.start, { ...c.run, value: 16, hold }).doc; } catch (e) { docs[k] = null; } }
    const ks = Object.keys(docs).filter((k) => docs[k]); if (ks.length < 2) continue;
    let gap = 0, at = null;
    for (let s = w0; s <= w1; s++) { const e = ks.map((k) => F.rimAcross(docs[k], s, hold)), g = Math.max(...e) - Math.min(...e); if (g > gap) { gap = g; at = s; } }
    gaps.push({ id: c.id, fx: c.fx, hold, gap: R(gap), at, w0, w1, c, docs });
  }
  gaps.sort((a, b) => b.gap - a.gap);
  const picks = []; for (const g of gaps) { if (picks.some((p) => p.id === g.id && p.fx === g.fx)) continue; picks.push(g); if (picks.length >= N) break; }
  const rec = { tree: T, gaps: gaps.map((g) => ({ id: g.id, fx: g.fx, hold: g.hold, gap: g.gap, at: g.at })), picks: [], files: [] };
  const htmls = [];
  picks.forEach((g, n) => {
    const { c, docs, hold, w0, w1 } = g, PX = 10, OV = 2.5, Z = 120;
    // the zoom stays on road: from the track's start at the earliest, to its end at the latest (a window at s 0 has no road before it to draw)
    const z0 = Math.max(0, w0 - 10, Math.min(g.at - Z / 2, Math.min(w1 + 10, F.endOf(c.start)) - Z)), z1 = Math.min(z0 + Z, F.endOf(c.start));
    const panels = [['now', c.start], ...['A0', 'A', 'B', 'C'].map((k) => [k, docs[k]])].filter(([, d]) => d);
    const rims = (d, a, b) => { const o = []; for (let s = Math.ceil(a); s <= Math.floor(b); s++) o.push([s, F.rimAcross(d, s, 'left'), F.rimAcross(d, s, 'right')]); return o; };
    const zr = panels.map(([k, d]) => [k, rims(d, z0, z1)]), base = rims(c.base, z0, z1), now = rims(c.start, z0, z1);
    let top = -Infinity, bot = Infinity; for (const [, r] of [...zr, ['b', base]]) for (const [, l, rr] of r) { top = Math.max(top, l, rr); bot = Math.min(bot, l, rr); }
    top += 1.5; bot -= 1.5;
    const W = Z * PX + 40, PH = Math.ceil((top - bot) * PX), y = (v) => (top - v) * PX, x = (s) => 20 + (s - z0) * PX;
    const line = (r, i, X = x, Y = y) => r.map(([s, ...v], j) => `${j ? 'L' : 'M'}${X(s).toFixed(1)},${Y(v[i]).toFixed(1)}`).join('');
    const area = (r, X = x, Y = y) => `${line(r, 0, X, Y)}${r.slice().reverse().map(([s, , rr]) => `L${X(s).toFixed(1)},${Y(rr).toFixed(1)}`).join('')}Z`;
    const lo = c.start && require(path.join(T, 'src/core/sculpt.js')).pieceOffsets(c.start), runLo = lo[c.run.from], runHi = lo[c.run.to] + c.start.pieces[c.run.to].length;
    // a window end cut short at the track's start or open end sits on the run's end: one mark, both names, so the labels do not overprint
    const ends = [[runLo, 'run'], [runHi, 'run'], [w0, 'window'], [w1, 'window']].reduce((a, [s, t]) => { const m = a.find((x) => Math.abs(x[0] - s) < 1); if (m) m[1] = `${m[1]} and ${t}`; else a.push([s, t]); return a; }, []);
    const marks = (X, H) => ends.filter(([s]) => X(s) >= 0 && X(s) <= W).map(([s, t]) => `<line x1="${X(s)}" x2="${X(s)}" y1="0" y2="${H}" stroke="${/run/.test(t) ? '#e8e8e8' : '#9a9a9a'}" stroke-dasharray="${/run/.test(t) ? '' : '6 4'}" stroke-width="1"/><text x="${X(s) + 3}" y="12" fill="#bbb" font-size="11">${t} ${s}</text>`).join('');
    const parts = [], fig = {};
    // the overview: the whole window, 2.5 px a metre, the road now and the zoomed stretch
    const oa = Math.max(0, w0 - 20), ob = w1 + 20, ovr = rims(c.start, oa, Math.min(ob, F.endOf(c.start))); let ot = -Infinity, obm = Infinity; for (const [, l, rr] of ovr) { ot = Math.max(ot, l, rr); obm = Math.min(obm, l, rr); } ot += 2; obm -= 2;
    const ox = (s) => 20 + (s - oa) * OV, oy = (v) => (ot - v) * OV, OH = Math.ceil((ot - obm) * OV) + 16;
    parts.push(`<g transform="translate(0,48)"><text x="20" y="-6" fill="#ddd" font-size="12">the whole window, where the road is now (2.5 px a metre; the box is the stretch drawn below)</text><rect x="0" y="0" width="${W}" height="${OH}" fill="#151515"/><path d="${area(ovr, ox, oy)}" fill="#5a5a5a"/>${marks(ox, OH)}<rect x="${ox(z0)}" y="1" width="${Z * OV}" height="${OH - 2}" fill="none" stroke="#ffd24a" stroke-width="1.5"/></g>`);
    let Y0 = 48 + OH + 40;
    for (const [k, r] of zr) {
      const d = k === 'now' ? c.start : docs[k], S = []; for (let s = Math.max(runLo, Math.ceil(w0)); s <= Math.min(runHi, w1); s++) S.push(s);
      const f = k === 'now' ? null : { fromRoad: R(Math.max(...S.map((s) => Math.abs(F.rimAcross(d, s, hold) - F.rimAcross(c.base, s, hold))))), fromNow: R(Math.max(...S.map((s) => Math.abs(F.rimAcross(d, s, hold) - F.rimAcross(c.start, s, hold))))), width: [R(Math.min(...S.map((s) => F.at(d, 'w', s)))), R(Math.max(...S.map((s) => F.at(d, 'w', s))))] };
      if (f) fig[k] = f;
      const kept = hold === 'left' ? 0 : 1, ky = y(r[Math.floor(r.length / 2)][kept + 1]);
      parts.push(`<g transform="translate(0,${Y0})"><text x="20" y="-8" fill="#eee" font-size="13" font-weight="600">${esc(NAMES[k])}</text>${f ? `<text x="${W - 20}" y="-8" fill="#ccc" font-size="12" text-anchor="end">the ${hold} edge kept, over the run: at most ${f.fromRoad.toFixed(2)} m from the road before any grab, ${f.fromNow.toFixed(2)} m from where it is now; width ${f.width[0].toFixed(2)} to ${f.width[1].toFixed(2)} m</text>` : `<text x="${W - 20}" y="-8" fill="#ccc" font-size="12" text-anchor="end">the ${hold} edge is the one Even is told to keep</text>`}
        <rect x="0" y="0" width="${W}" height="${PH}" fill="#151515"/><path d="${area(r)}" fill="#5a5a5a"/><path d="${line(r, 0)}" fill="none" stroke="#fff" stroke-width="1.5"/><path d="${line(r, 1)}" fill="none" stroke="#fff" stroke-width="1.5"/>
        <path d="${line(base, 0)}" fill="none" stroke="#3fd0e0" stroke-width="1.5" stroke-dasharray="7 5"/><path d="${line(base, 1)}" fill="none" stroke="#3fd0e0" stroke-width="1.5" stroke-dasharray="7 5"/>
        ${k === 'now' ? '' : `<path d="${line(now, 0)}" fill="none" stroke="#ff9a3c" stroke-width="2" stroke-dasharray="2 4"/><path d="${line(now, 1)}" fill="none" stroke="#ff9a3c" stroke-width="2" stroke-dasharray="2 4"/>`}
        ${marks(x, PH)}<text x="${x(z0 + Z / 2)}" y="${ky + (hold === 'left' ? -6 : 16)}" fill="#ffd24a" font-size="12" text-anchor="middle">kept edge (${hold})</text></g>`);
      Y0 += PH + 40;
    }
    const legend = `<g transform="translate(20,${Y0 - 14})"><rect width="26" height="10" fill="#5a5a5a"/><text x="32" y="10" fill="#ccc" font-size="12">the road the panel names</text><line x1="230" x2="262" y1="5" y2="5" stroke="#3fd0e0" stroke-width="1.5" stroke-dasharray="7 5"/><text x="268" y="10" fill="#ccc" font-size="12">the road before any grab</text><line x1="460" x2="492" y1="5" y2="5" stroke="#ff9a3c" stroke-width="2" stroke-dasharray="2 4"/><text x="498" y="10" fill="#ccc" font-size="12">where it is now (what Even is given)</text><line x1="760" x2="860" y1="5" y2="5" stroke="#eee" stroke-width="2"/><text x="866" y="10" fill="#ccc" font-size="12">10 m (true scale both ways)</text></g>`;
    const head = `Even to 16 m, the ${hold} edge kept · ${esc(g.id)} (${g.fx === 'flat' ? 'the flat turn' : 'the turn banked 20° (B-)'}${/^WC/.test(g.id) ? ', a road made for this' : ''}) · unrolled along the route, the turn drawn straight · the candidates' kept edges end up to ${g.gap.toFixed(2)} m apart (at ${g.at})`;
    const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Y0 + 10}" viewBox="0 0 ${W} ${Y0 + 10}" font-family="system-ui,sans-serif"><rect width="100%" height="100%" fill="#0e0e0e"/><text x="20" y="18" fill="#fff" font-size="14" font-weight="600">${head}</text>${parts.join('')}${legend}</svg>`;
    const name = `plan678_${n + 1}.svg`; fs.writeFileSync(path.join(OUT, name), svg); rec.files.push(name); htmls.push({ name, svg, W, H: Y0 + 10 });
    rec.picks.push({ id: g.id, fx: g.fx, hold, gap: g.gap, at: g.at, zoom: [R(z0), R(z1)], fig });
  });
  // a picture of each, for the eye (headless Chrome through the tree's shared launcher; the title zz-headless-test)
  try {
    const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
    const srv = http.createServer((q, s) => { const h = htmls.find((x) => `/${x.name}` === q.url); if (!h) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); s.end(`<!doctype html><meta charset="utf-8"><title>zz-headless-test</title><body style="margin:0;background:#0e0e0e">${h.svg}</body>`); });
    await new Promise((r) => srv.listen(0, '127.0.0.1', r));
    const L = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1300,1000'], 't180plan678-'), ws = new WebSocket(L.tgt.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
    let id = 0; const pend = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    await send('Page.enable');
    for (const h of htmls) {
      await send('Emulation.setDeviceMetricsOverride', { width: h.W, height: h.H, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/${h.name}` }); await new Promise((r) => setTimeout(r, 700));
      const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 92 }); const jn = h.name.replace(/\.svg$/, '.jpg'); fs.writeFileSync(path.join(OUT, jn), Buffer.from(r.result.data, 'base64')); rec.files.push(jn);
    }
    try { ws.close(); } catch (e) { /* */ } try { L.ch.kill(); } catch (e) { /* */ } await new Promise((r) => setTimeout(r, 800)); try { fs.rmSync(L.dir, { recursive: true, force: true }); } catch (e) { rec.profileLeft = L.dir; } srv.close();
  } catch (e) { rec.chrome = String(e && e.message || e); }
  fs.writeFileSync(path.join(OUT, 'plan678.json'), JSON.stringify(rec, null, 1));
  console.log(JSON.stringify({ picks: rec.picks.map((p) => [p.id, p.fx, p.hold, p.gap, p.at]), top: rec.gaps.slice(0, 10).map((g) => [g.id, g.fx, g.hold, g.gap, g.at]), files: rec.files, chrome: rec.chrome || 'ok' }));
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
