// figs.js: the SCALE overlay (plan view, one scale, every road aligned at the run-in straight d 340..440) and the FLOW chart (bank against
// measured distance, every road on one chart, the roll rate in its own panel under it, the real road's as the bar), from fit.js's eval.json.
// Writes SVG (for the page) and a line-only PNG preview of each (for looking). THE REAL ROAD'S LINE AND PROFILE ARE IN THESE FILES: they stay
// local (the track-equations privacy rule); whether they go up on a page is the keeper's call. usage: node figs.js <t180 tree> <eval.json> <out dir>
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs'), zlib = require('zlib');
const [tree, evalFile, outDir] = process.argv.slice(2), { encodePng } = require(path.join(tree, 'src/texture/png.js'));
const E = require(path.resolve(evalFile)), real = E.real, att = E.attempts;
// the reference palette's categorical slots 1..4 (validated: light surface, all checks pass; slots 3 and 4 under 3:1, so every line is direct-labelled
// and the hand-back carries the table); the real road wears the primary ink
const INK = '#0b0b0b', INK2 = '#52514e', MUTED = '#8a8984', GRID = '#e4e3df', SURF = '#fcfcfb', COL = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'];
const SHORT = ['one piece today', 'one piece, five marks, check skipped', 'five pieces today', 'one piece fitted to the curve, check skipped'];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
fs.mkdirSync(outDir, { recursive: true });

// ── a tiny line rasteriser for the previews (no text): polylines, 2 px
function raster(W, H) {
  const px = new Uint8Array(W * H * 4).fill(255);
  const put = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; const o = (y * W + x) * 4; px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; };
  const line = (a, b, c, w = 2) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1])) + 1; for (let i = 0; i <= n; i++) { const t = i / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; for (let dx = 0; dx < w; dx++) for (let dy = 0; dy < w; dy++) put(x + dx - w / 2, y + dy - w / 2, c); } };
  const poly = (pts, c, w) => { for (let i = 1; i < pts.length; i++) line(pts[i - 1], pts[i], c, w); };
  return { poly, save: (f) => fs.writeFileSync(f, encodePng({ width: W, height: H, rgba: px }, (b) => zlib.deflateSync(b))) };
}
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

const SAFE = process.env.SAFE === '1';
// ── 1. SCALE: the plan overlay. Rotate so the run-in points up the page.
if (!SAFE) {
  const runA = real.find((r) => r.d === 340), runB = real.find((r) => r.d === 440), ang = Math.atan2(runB.z - runA.z, runB.x - runA.x);
  const rot = (p) => { const x = p[0] - runA.x, z = p[1] - runA.z, c = Math.cos(-ang + Math.PI / 2), s = Math.sin(-ang + Math.PI / 2); return [x * c - z * s, x * s + z * c]; };
  // which way is right on the page: turn A is a right-hander in his screenshot, so flip x if it bends left here
  const probe = rot([real.find((r) => r.d === 560).x, real.find((r) => r.d === 560).z]), FX = probe[0] < 0 ? -1 : 1;
  const P = (p) => { const q = rot(p); return [FX * q[0], q[1]]; };
  const roads = [{ name: 'the real road (the read)', c: INK, centre: real.map((r) => P([r.x, r.z])), L: real.map((r) => P(r.edges[0])), R: real.map((r) => P(r.edges[1])) },
    ...att.map((a, k) => ({ name: SHORT[k], c: COL[k], centre: a.plan.map(P), L: a.edges.map((e) => P(e[0])), R: a.edges.map((e) => P(e[1])), gap: a })) ];
  const all = roads.flatMap((r) => [...r.L, ...r.R]), x0 = Math.min(...all.map((p) => p[0])) - 15, x1 = Math.max(...all.map((p) => p[0])) + 15, y0 = Math.min(...all.map((p) => p[1])) - 15, y1 = Math.max(...all.map((p) => p[1])) + 15;
  const SC = 3.2, W = Math.round((x1 - x0) * SC) + 380, H = Math.round((y1 - y0) * SC) + 90, X = (p) => 20 + (p[0] - x0) * SC, Y = (p) => 60 + (y1 - p[1]) * SC;
  const pathD = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${X(p).toFixed(1)},${Y(p).toFixed(1)}`).join('');
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="system-ui, sans-serif" font-size="13">\n<title>The double-banked 90 in plan: the real road and four builds, aligned at the run-in, one scale</title>\n<rect width="${W}" height="${H}" fill="${SURF}"/>\n`;
  // a 10 m grid, recessive, and a 50 m scale bar
  for (let gx = Math.ceil(x0 / 10) * 10; gx <= x1; gx += 10) s += `<line x1="${X([gx, 0]).toFixed(1)}" y1="${Y([0, y1])}" x2="${X([gx, 0]).toFixed(1)}" y2="${Y([0, y0])}" stroke="${GRID}" stroke-width="1"/>`;
  for (let gy = Math.ceil(y0 / 10) * 10; gy <= y1; gy += 10) s += `<line x1="${X([x0, 0])}" y1="${Y([0, gy]).toFixed(1)}" x2="${X([x1, 0])}" y2="${Y([0, gy]).toFixed(1)}" stroke="${GRID}" stroke-width="1"/>`;
  s += `\n<text x="20" y="22" fill="${INK}" font-size="15" font-weight="600">In plan, one scale, aligned on the run-in straight (measured d 340 to 440); the grid is 10 m</text>`;
  s += `<text x="20" y="42" fill="${INK2}">Centre line solid, both edges dashed. Turn A is the right-hander his screenshot shows.</text>\n`;
  roads.forEach((r, k) => {
    const dash = k ? '6 4' : '2 3', w = k ? 2 : 2.5;
    s += `<g><title>${esc(r.name)}</title><path d="${pathD(r.centre)}" fill="none" stroke="${r.c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
    s += `<path d="${pathD(r.L)}" fill="none" stroke="${r.c}" stroke-width="1.5" stroke-dasharray="${dash}"/><path d="${pathD(r.R)}" fill="none" stroke="${r.c}" stroke-width="1.5" stroke-dasharray="${dash}"/></g>\n`;
  });
  // the legend, right of the plot; each line with its largest centre gap (matched distance)
  const lx = Math.round((x1 - x0) * SC) + 40; let ly = 90;
  s += `<text x="${lx}" y="${ly - 20}" fill="${INK}" font-weight="600">Largest centre gap to the real road</text>`;
  roads.forEach((r, k) => { s += `<line x1="${lx}" y1="${ly}" x2="${lx + 26}" y2="${ly}" stroke="${r.c}" stroke-width="3"/><text x="${lx + 34}" y="${ly + 4}" fill="${INK}">${esc(r.name)}</text>`;
    if (r.gap) s += `<text x="${lx + 34}" y="${ly + 20}" fill="${INK2}">${r.gap.wp.gapPlan.toFixed(1)} m, at d ${r.gap.wp.d}</text>`; ly += 46; });
  s += `<text x="${lx}" y="${ly - 4}" fill="${INK2}" font-size="12">One piece today and five marks have the same turns,</text><text x="${lx}" y="${ly + 12}" fill="${INK2}" font-size="12">so the blue lies under the orange.</text>`; ly += 34;
  s += `<line x1="${lx}" y1="${ly + 10}" x2="${lx + 50 * SC}" y2="${ly + 10}" stroke="${INK}" stroke-width="2"/><text x="${lx}" y="${ly + 28}" fill="${INK2}">50 m</text>\n</svg>\n`;
  fs.writeFileSync(path.join(outDir, 'scale_overlay.svg'), s);
  const pr = raster(W, H); for (const r of roads) { pr.poly(r.centre.map((p) => [X(p), Y(p)]), rgb(r.c), 2); pr.poly(r.L.map((p) => [X(p), Y(p)]), rgb(r.c), 1); pr.poly(r.R.map((p) => [X(p), Y(p)]), rgb(r.c), 1); }
  pr.save(path.join(outDir, 'scale_overlay_preview.png'));
  console.log(`overlay ${W}x${H}; flipped x ${FX < 0}`);
}

// ── 2. FLOW: bank against d (top panel) and the roll rate, degrees per metre over a 20 m chord (bottom panel, same x)
{
  const W = 1260, H = 760, L0 = 70, R0 = 380, T1 = 70, B1 = 400, T2 = 470, B2 = 700, d0 = 340, d1 = 712;
  const X = (d) => L0 + ((d - d0) / (d1 - d0)) * (W - L0 - R0), Y1 = (b) => T1 + ((30 - b) / 60) * (B1 - T1), Y2 = (r) => T2 + ((1.4 - r) / 1.4) * (B2 - T2);
  const series = [{ name: 'the real road (the read)', c: INK, bank: real.map((r) => [r.d, r.bank]), rate: att[0].rates.map((r) => [r.d, Math.abs(r.real)]) },
    ...att.map((a, k) => ({ name: SHORT[k], c: COL[k], bank: a.rows.map((r) => [r.d, r.bank]), rate: a.rates.map((r) => [r.d, Math.abs(r.built)]), a }))];
  const shown = SAFE ? series.filter((x) => x.a && x.name !== SHORT[3]) : series;
  const pathD = (pts, Y) => pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('');
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="system-ui, sans-serif" font-size="13">\n<title>Bank and roll rate along the double-banked 90: the real road and four builds</title>\n<rect width="${W}" height="${H}" fill="${SURF}"/>\n`;
  s += `<text x="${L0}" y="24" fill="${INK}" font-size="15" font-weight="600">Bank along the road, degrees (+ leans into turn A, the right-hander)</text>`;
  s += `<text x="${L0}" y="${T2 - 30}" fill="${INK}" font-size="15" font-weight="600">Roll rate, degrees per metre over a 20 m chord (the real road's line is the bar)</text>\n`;
  for (let b = -30; b <= 30; b += 10) s += `<line x1="${L0}" y1="${Y1(b)}" x2="${W - R0}" y2="${Y1(b)}" stroke="${b ? GRID : '#c9c8c2'}"/><text x="${L0 - 8}" y="${Y1(b) + 4}" text-anchor="end" fill="${INK2}">${b}</text>`;
  for (let r = 0; r <= 1.4; r += 0.2) s += `<line x1="${L0}" y1="${Y2(r).toFixed(1)}" x2="${W - R0}" y2="${Y2(r).toFixed(1)}" stroke="${GRID}"/><text x="${L0 - 8}" y="${(Y2(r) + 4).toFixed(1)}" text-anchor="end" fill="${INK2}">${r.toFixed(1)}</text>`;
  for (let d = 360; d <= d1; d += 40) { s += `<text x="${X(d)}" y="${B1 + 18}" text-anchor="middle" fill="${INK2}">${d}</text><text x="${X(d)}" y="${B2 + 18}" text-anchor="middle" fill="${INK2}">${d}</text>`; }
  s += `<text x="${(L0 + W - R0) / 2}" y="${B2 + 40}" text-anchor="middle" fill="${INK2}">measured distance along the real road, m (the run-in straight starts at 340)</text>\n`;
  // the builder's own roll-rate lines (src/validate: amber 0.93, red 1.21 over a 20 m chord), labelled, recessive
  for (const [v, t] of [[0.9338, 'builder amber 0.93'], [1.2144, 'builder red 1.21']]) s += `<line x1="${L0}" y1="${Y2(v).toFixed(1)}" x2="${W - R0}" y2="${Y2(v).toFixed(1)}" stroke="${MUTED}" stroke-dasharray="3 3"/><text x="${W - R0 - 4}" y="${(Y2(v) - 5).toFixed(1)}" text-anchor="end" fill="${INK2}" font-size="11">${t}</text>`;
  if (SAFE) s += `<line x1="${L0}" y1="${Y2(0.85).toFixed(1)}" x2="${W - R0}" y2="${Y2(0.85).toFixed(1)}" stroke="${INK}" stroke-width="2"/><text x="${L0 + 6}" y="${(Y2(0.85) + 15).toFixed(1)}" fill="${INK}" font-size="11">the real road's peak, 0.85 (its profile stays local)</text>`;
  shown.forEach((r, k) => {
    s += `<g><title>${esc(r.name)}</title><path d="${pathD(r.bank, Y1)}" fill="none" stroke="${r.c}" stroke-width="${r.a ? 2 : 3}" stroke-linejoin="round"/></g>`;
    s += `<g><title>${esc(r.name)}</title><path d="${pathD(r.rate, Y2)}" fill="none" stroke="${r.c}" stroke-width="${r.a ? 2 : 3}" stroke-linejoin="round"/></g>\n`;
  });
  // legend with each series' figures
  const lx = W - R0 + 24; let ly = T1 + 10;
  s += `<text x="${lx}" y="${ly - 14}" fill="${INK}" font-weight="600">Largest bank gap; peak roll rate</text>`;
  shown.forEach((r) => { s += `<line x1="${lx}" y1="${ly}" x2="${lx + 26}" y2="${ly}" stroke="${r.c}" stroke-width="3"/><text x="${lx + 34}" y="${ly + 4}" fill="${INK}">${esc(r.name)}</text>`;
    const pk = r.a ? Math.abs(r.a.pkB.built) : Math.abs(att[0].pkR.real);
    s += `<text x="${lx + 34}" y="${ly + 20}" fill="${INK2}">${r.a ? `${Math.abs(r.a.wb.gapBank).toFixed(1)}° at d ${r.a.wb.d}; ` : ''}peak ${pk.toFixed(2)}°/m</text>`; ly += 48; });
  s += `</svg>\n`;
  fs.writeFileSync(path.join(outDir, SAFE ? 'flow_builds_only.svg' : 'flow_bank_rollrate.svg'), s);
  const pr = raster(W, H); for (const r of shown) { pr.poly(r.bank.map((p) => [X(p[0]), Y1(p[1])]), rgb(r.c), 2); pr.poly(r.rate.map((p) => [X(p[0]), Y2(p[1])]), rgb(r.c), 2); }
  for (const y of [Y1(0), Y2(0), Y2(0.9338), Y2(1.2144)]) pr.poly([[L0, y], [W - R0, y]], [180, 180, 180], 1);
  pr.save(path.join(outDir, SAFE ? 'flow_builds_only_preview.png' : 'flow_bank_rollrate_preview.png'));
  if (SAFE) { console.log('safe chart written'); return; }
  // the table view (the chart's data, every 8 m), for the page and for a reader who cannot tell the lines apart
  const rows = ['d,real bank,' + SHORT.map((n) => `${n} bank`).join(',') + ',real roll rate,' + SHORT.map((n) => `${n} roll rate`).join(',')];
  real.forEach((r, i) => { if (r.d % 8) return; rows.push([r.d, r.bank.toFixed(1), ...att.map((a) => a.rows[i].bank.toFixed(1)), Math.abs(att[0].rates[i].real).toFixed(2), ...att.map((a) => Math.abs(a.rates[i].built).toFixed(2))].join(',')); });
  fs.writeFileSync(path.join(outDir, 'flow_table.csv'), rows.join('\n') + '\n');
  console.log('chart written');
}
