// L226: a plan view (from above) of the REOPENED project, drawn from the adapter's samples; colour = bank (blue left of zero, red right). node plan_svg.js <app data dir> <out.svg>
const T = 'C:/Consonance/t180-wt-flow', fs = require('fs'), path = require('path');
const D = require(T + '/src/core/document.js'), A = require(T + '/src/core/adapter.js');
const doc = D.parse(fs.readFileSync(path.join(process.argv[2], 'tracks', 'eq-Smooth S flow L.t180track'), 'utf8'));
const S = A.toPath(doc, { step: 1 }).path.samples;
const xs = S.map((s) => s.pos[0]), zs = S.map((s) => -s.pos[2]), x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
const W = 900, k = (W - 60) / Math.max(x1 - x0, z1 - z0, 1), H = Math.ceil((z1 - z0) * k + 60);
let g = ''; for (let i = 1; i < S.length; i++) { const b = S[i].roll * 180 / Math.PI, c = b > 0.5 ? `rgb(${Math.min(255, 120 + b * 5)},60,60)` : b < -0.5 ? `rgb(60,90,${Math.min(255, 120 - b * 5)})` : '#444'; g += `<line x1="${30 + (xs[i - 1] - x0) * k}" y1="${H - 30 - (zs[i - 1] - z0) * k}" x2="${30 + (xs[i] - x0) * k}" y2="${H - 30 - (zs[i] - z0) * k}" stroke="${c}" stroke-width="3"/>`; }
fs.writeFileSync(process.argv[3], `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#fafafa"/>${g}<text x="12" y="18" font-size="13" font-family="sans-serif">Smooth S flow L, reopened, plan view; blue = bank left (-), red = bank right (+), grey = level; ${Math.round(S[S.length - 1].s)} m</text></svg>`);
console.log('ok', Math.round(x1 - x0), 'x', Math.round(z1 - z0), 'm');
