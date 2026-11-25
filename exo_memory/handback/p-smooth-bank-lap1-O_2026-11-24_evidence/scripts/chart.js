// chart.js: THE BANK-AND-ROLL CHART of the two exported layouts, "today" and "flow", read on the BUILT road (A.toPath's roll, what the exporter meshes),
// through the S: track metres 300..750 (the lead's end to the ease-out's end). Two panels on one distance axis: the bank (°) above, the roll rate over a
// 4 m chord (°/m) below; never two scales on one panel. Builds only (no real road in it), so it can be committed.
// usage: node chart.js <dir with today_bank.json and flow_bank.json> <out.html>
const fs = require('fs'), path = require('path');
const [DIR, OUT] = process.argv.slice(2);
const L = { today: JSON.parse(fs.readFileSync(path.join(DIR, 'today_bank.json'))), flow: JSON.parse(fs.readFileSync(path.join(DIR, 'flow_bank.json'))) };
const rate = (p) => { const out = []; for (let i = 4; i < p.length - 4; i++) out.push([p[i][0], (p[i + 4][1] - p[i - 4][1]) / (p[i + 4][0] - p[i - 4][0])]); return out; };
const R = { today: rate(L.today), flow: rate(L.flow) };
const MARKS = [[380, '−20°'], [445, '−27°'], [500, '0°'], [555, '25°'], [600, '26°']];
const STOPS = [500, 555];   // read_both.js: today's built road halts here; the flowing road nowhere
const W = 960, PL = 64, PR = 120, x = (s) => PL + ((s - 300) / 450) * (W - PL - PR);
const P1 = { top: 70, h: 260, lo: -32, hi: 32 }, P2 = { top: 400, h: 200, lo: -1, hi: 1 }, H = 660;
const y = (P, v) => P.top + ((P.hi - v) / (P.hi - P.lo)) * P.h;
const poly = (P, pts) => pts.map(([s, v], i) => `${i ? 'L' : 'M'}${x(s).toFixed(1)},${y(P, v).toFixed(1)}`).join('');
function panel(P, ticks, unit, title, data) {
  let g = `<text class="t2" x="${PL}" y="${P.top - 14}">${title}</text>`;
  for (const v of ticks) g += `<line class="grid" x1="${PL}" x2="${W - PR}" y1="${y(P, v)}" y2="${y(P, v)}"/><text class="ax" x="${PL - 8}" y="${y(P, v) + 4}" text-anchor="end">${v}${unit}</text>`;
  for (const [s] of MARKS) g += `<line class="mark" x1="${x(s)}" x2="${x(s)}" y1="${P.top}" y2="${P.top + P.h}"/>`;
  for (const k of ['today', 'flow']) g += `<path class="ln ${k}" d="${poly(P, data[k])}"/>`;
  const end = (k) => data[k][data[k].length - 1];
  return g;
}
let svg = panel(P1, [-30, -20, -10, 0, 10, 20, 30], '°', 'Bank on the built road (°, + is the left side up)', L);
for (const [s, lab] of MARKS) svg += `<text class="ax" x="${x(s)}" y="${P1.top + P1.h + 16}" text-anchor="middle">${lab}</text>`;
svg += panel(P2, [-1, -0.5, 0, 0.5, 1], '', 'Roll rate over a 4 m chord (°/m)', R);
for (const s of STOPS) { const v = R.today.reduce((a, b) => (Math.abs(b[0] - s) < Math.abs(a[0] - s) ? b : a))[1]; svg += `<circle class="stop" cx="${x(s)}" cy="${y(P2, v)}" r="6"/><text class="t1" x="${x(s) + 9}" y="${y(P2, v) - 9}">today stops</text>`; }
// direct labels at the right end of the bank panel
const lab = (k, dy) => { const p = L[k][L[k].length - 1]; return `<text class="lab ${k}l" x="${x(p[0]) + 8}" y="${y(P1, p[1]) + dy}">${k === 'today' ? 'today' : 'flow'}</text>`; };
svg += lab('today', -6) + lab('flow', 12);
for (let s = 300; s <= 750; s += 50) svg += `<text class="ax" x="${x(s)}" y="${P2.top + P2.h + 18}" text-anchor="middle">${s}</text>`;
svg += `<text class="ax" x="${(PL + W - PR) / 2}" y="${P2.top + P2.h + 40}" text-anchor="middle">distance along the track (m); the S's marks are the vertical hairlines</text>`;
svg += `<line id="xh" class="xh" x1="0" x2="0" y1="${P1.top}" y2="${P2.top + P2.h}" visibility="hidden"/>`;
const rows = [['', 'today', 'flow'], ['stops on the built road', '2 (500, 555 m)', '0'], ['roll rate peak, 30 m chord (bar 0.70)', '0.754', '0.677'], ['20 m chord (bar 0.89)', '0.844', '0.690'], ['8 m chord (bar 1.08)', '0.905', '0.699'], ['roll acceleration peak (°/m²)', '0.0144', '0.0059']];
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Smooth S bank</title>
<style>
:root{--surf:#fcfcfb;--page:#f9f9f7;--ink:#0b0b0b;--ink2:#52514e;--muted:#898781;--grid:#e1e0d9;--axis:#c3c2b7;--s1:#2a78d6;--s2:#eb6834}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--surf:#1a1a19;--page:#0d0d0d;--ink:#f0efec;--ink2:#c3c2b7;--grid:#2c2c2a;--axis:#383835;--s1:#3987e5;--s2:#d95926}}
:root[data-theme="dark"]{--surf:#1a1a19;--page:#0d0d0d;--ink:#f0efec;--ink2:#c3c2b7;--grid:#2c2c2a;--axis:#383835;--s1:#3987e5;--s2:#d95926}
body{margin:0;padding:16px;background:var(--page);color:var(--ink);font:14px/1.4 system-ui,sans-serif}
.card{background:var(--surf);max-width:${W}px;margin:auto;padding:8px 0 16px;border-radius:8px}
h1{font-size:17px;margin:8px 16px 2px}p{margin:2px 16px;color:var(--ink2)}
.legend{display:flex;gap:18px;margin:8px 16px}.legend span:before{content:"";display:inline-block;width:18px;height:2px;margin-right:6px;vertical-align:middle;background:currentColor}
svg{width:100%;height:auto;display:block}
.grid{stroke:var(--grid);stroke-width:1}.mark{stroke:var(--axis);stroke-width:1;stroke-dasharray:3 3}
.ax{fill:var(--muted);font-size:11px}.t2{fill:var(--ink2);font-size:13px}.t1{fill:var(--ink);font-size:12px}
.ln{fill:none;stroke-width:2;stroke-linejoin:round}.today{stroke:var(--s2)}.flow{stroke:var(--s1)}
.lab{font-size:13px;fill:var(--ink)}.stop{fill:none;stroke:var(--ink);stroke-width:2}.xh{stroke:var(--ink2);stroke-width:1}
#tip{position:fixed;pointer-events:none;background:var(--surf);border:1px solid var(--axis);border-radius:6px;padding:6px 8px;font-size:12px;display:none}
table{border-collapse:collapse;margin:12px 16px;font-size:13px}td,th{padding:3px 10px;border-bottom:1px solid var(--grid);text-align:right}td:first-child,th:first-child{text-align:left}
</style></head><body><div class="card">
<h1>The banked S, two ways: today's bank and the flowing bank</h1>
<p>The same road and the same marks, built by the t180 core and read where the exporter reads it.</p>
<div class="legend"><span style="color:var(--s2)">today: a rounded bank, a change at each mark</span><span style="color:var(--s1)">flow: one piece through the marks</span></div>
<svg id="c" viewBox="0 0 ${W} ${H}" role="img" aria-label="Bank and roll rate against distance for the two layouts">${svg}</svg>
<table><tr>${rows[0].map((c) => `<th>${c}</th>`).join('')}</tr>${rows.slice(1).map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>
</div><div id="tip"></div>
<script>
const L=${JSON.stringify({ today: L.today.filter((_, i) => i % 2 === 0), flow: L.flow.filter((_, i) => i % 2 === 0) })},R=${JSON.stringify({ today: R.today.filter((_, i) => i % 2 === 0).map(([s, v]) => [s, +v.toFixed(3)]), flow: R.flow.filter((_, i) => i % 2 === 0).map(([s, v]) => [s, +v.toFixed(3)]) })};
const c=document.getElementById('c'),xh=document.getElementById('xh'),tip=document.getElementById('tip'),PL=${PL},PR=${PR},W=${W};
const near=(a,s)=>a.reduce((p,q)=>Math.abs(q[0]-s)<Math.abs(p[0]-s)?q:p);
c.addEventListener('pointermove',(e)=>{const r=c.getBoundingClientRect(),vx=(e.clientX-r.left)*W/r.width;if(vx<PL||vx>W-PR){xh.setAttribute('visibility','hidden');tip.style.display='none';return;}
const s=300+(vx-PL)/(W-PL-PR)*450;xh.setAttribute('x1',vx);xh.setAttribute('x2',vx);xh.setAttribute('visibility','visible');
tip.innerHTML='<b>'+s.toFixed(0)+' m</b><br>today '+near(L.today,s)[1].toFixed(2)+'°, '+near(R.today,s)[1].toFixed(3)+' °/m<br>flow '+near(L.flow,s)[1].toFixed(2)+'°, '+near(R.flow,s)[1].toFixed(3)+' °/m';
tip.style.display='block';tip.style.left=Math.min(e.clientX+14,innerWidth-190)+'px';tip.style.top=(e.clientY+14)+'px';});
c.addEventListener('pointerleave',()=>{xh.setAttribute('visibility','hidden');tip.style.display='none';});
</script></body></html>`;
fs.writeFileSync(OUT, html);
console.log('wrote', OUT, html.length, 'bytes');
