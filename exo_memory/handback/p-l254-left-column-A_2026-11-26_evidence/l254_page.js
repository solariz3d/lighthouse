// l254_page.js (pane A, L254): one self-contained page from l254_shots.js's pictures, laid out as my L249 l249_page.js: per look, the left column shown and
// cleared side by side; and SIGIL's fade in three frames. WebP embedded; a click on a picture shows it full size.
// usage: node l254_page.js <shots dir> <out.html> <sha>
'use strict';
const fs = require('fs'), path = require('path');
const [DIR, OUT] = process.argv.slice(2, 4).map((p) => path.resolve(p)), SHA = process.argv[4] || 'the branch';
const LOOKS = ['sigil', 'glass', 'aqua', 'aurora', 'skyline', 'skyline-night'];
const NAME = { sigil: 'SIGIL', glass: 'Glass', aqua: 'Aqua', aurora: 'Aurora', skyline: 'Skyline', 'skyline-night': 'Skyline Night' };
const log = JSON.parse(fs.readFileSync(path.join(DIR, 'shots_log.json'), 'utf8'));
const img = (f) => `data:image/webp;base64,${fs.readFileSync(path.join(DIR, f)).toString('base64')}`;
const fig = (f, cap) => (fs.existsSync(path.join(DIR, f)) ? `<figure><img src="${img(f)}" alt="${cap}"><figcaption>${cap}</figcaption></figure>` : `<figure><figcaption>${cap}: not taken</figcaption></figure>`);
const rows = LOOKS.map((l) => `<section><h2>${NAME[l]}</h2><div class="pair">${fig(`${l}_shown.webp`, 'The pointer on the column: shown')}${fig(`${l}_cleared.webp`, 'The pointer on the preview: cleared, the road under it in view')}</div></section>`).join('\n');
const s = log.find((r) => r.look === 'sigil'), fade = s && s.fade ? s.fade : [];
const fadeRow = fade.length ? `<section><h2>The fade, in SIGIL <span class="f">0.2 s, after 0.4 s off the column</span></h2><div class="three">${fade.map((f) => fig(`sigil_fade${f.t}.webp`, `${f.t} ms into the fade: opacity ${Number(f.opacity).toFixed(2)}`)).join('')}</div></section>` : '';
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>T-180: the left column at the edge, clearing away (L254)</title>
<style>:root{color-scheme:dark} body{margin:0;padding:24px 28px 60px;background:#0b0d11;color:#e6e9ef;font:14px/1.5 "Segoe UI",system-ui,sans-serif}
h1{font:600 20px/1.3 "Segoe UI",system-ui,sans-serif;margin:0 0 6px} h2{font:600 16px "Segoe UI",system-ui,sans-serif;margin:34px 0 10px} h2 .f{font-weight:400;font-size:13px;color:#9aa3b2;margin-left:10px}
p.lead,ul.lead{color:#aab2c0;max-width:1250px;margin:0 0 10px} ul.lead{padding-left:20px}
.pair,.three{display:flex;flex-wrap:wrap;gap:16px;margin-bottom:14px} figure{margin:0;width:min(46vw,750px)} .three figure{width:min(30vw,500px)} figure img{width:100%;display:block;border-radius:3px;outline:1px solid #252b36;cursor:zoom-in}
figcaption{color:#9aa3b2;font-size:12.5px;margin-top:5px} body.zoom figure.z{position:fixed;inset:0;width:auto;z-index:9;background:#000d;display:grid;place-items:center;margin:0;padding:10px} body.zoom figure.z img{width:auto;max-width:100%;max-height:96vh;cursor:zoom-out} body.zoom figure.z figcaption{display:none}
</style></head><body>
<h1>T-180: the left column at the window's edge, and clearing away</h1>
<p class="lead">The real page from the branch (${SHA}), no stylesheet laid over it: Coast Esses placed after two pieces, the Free view, the same camera in every look. What changed:</p>
<ul class="lead"><li>The column sits flush at the window's left edge, from the bar down to the bottom, square, with one line on the side that faces the preview. It keeps its width (248 px).</li>
<li>When the pointer has been off it for 0.4 s it fades out over 0.2 s, and the preview shows where it was. Clicks there go to the preview, never to a hidden button.</li>
<li>It comes back when the pointer reaches the window's left edge (a 24 px strip), or when Tab moves into it. It stays while you are typing in one of its fields, while a saved piece's Place piece is up, and while the guide points at it.</li>
<li>"Fully opaque" was read as see-through, from "to open up more space for the preview". If you meant something else, that is one value to change.</li></ul>
<p class="lead">Click any picture to see it full size.</p>
${rows}
${fadeRow}
<script>for (const f of document.querySelectorAll('figure')) f.addEventListener('click', () => { const on = !f.classList.contains('z'); document.querySelectorAll('figure.z').forEach((x) => x.classList.remove('z')); f.classList.toggle('z', on); document.body.classList.toggle('zoom', on); });</script>
</body></html>`;
fs.writeFileSync(OUT, html);
console.log(`${OUT}: ${fs.statSync(OUT).size} bytes`);
