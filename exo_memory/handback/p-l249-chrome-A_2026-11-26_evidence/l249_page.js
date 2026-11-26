// l249_page.js (pane A, L249): one self-contained page from l249_shots.js's pictures, laid out as C's L248 refactor_page.js: per look, before (the base
// c9fe4f1) and after (the branch, no override) side by side, with the File menu open, a dialog open and a hovered label window. WebP embedded; a click on a
// picture shows it full size.
// usage: node l249_page.js <shots dir> <out.html> <after sha>
'use strict';
const fs = require('fs'), path = require('path');
const [DIR, OUT] = process.argv.slice(2, 4).map((p) => path.resolve(p)), SHA = process.argv[4] || 'the branch';
const LOOKS = ['sigil', 'glass', 'aqua', 'aurora', 'skyline', 'skyline-night'];
const NAME = { sigil: 'SIGIL', glass: 'Glass', aqua: 'Aqua', aurora: 'Aurora', skyline: 'Skyline', 'skyline-night': 'Skyline Night' };
const FACTOR = { sigil: '0.5: buttons 2 px, menus 4, dialogs 6, label windows 1', glass: '0: square everywhere', aqua: '1: buttons 4 px, menus 8, dialogs 12, label windows 2; Export the one capsule', aurora: '0.75: buttons 3 px, menus 6, dialogs 9, label windows 1.5', skyline: '1: buttons 4 px, menus 8, dialogs 12, label windows 2; Export the one capsule', 'skyline-night': '1: buttons 4 px, menus 8, dialogs 12, label windows 2; Export the one capsule' };
const img = (f) => `data:image/webp;base64,${fs.readFileSync(path.join(DIR, f)).toString('base64')}`;
const fig = (f, cap) => (fs.existsSync(path.join(DIR, f)) ? `<figure><img src="${img(f)}" alt="${cap}"><figcaption>${cap}</figcaption></figure>` : `<figure><figcaption>${cap}: not taken (no bank mark found to hover)</figcaption></figure>`);
const pair = (l, s, what) => `<div class="pair">${fig(`${l}_before_${s}.webp`, `Before (c9fe4f1): ${what}`)}${fig(`${l}_after_${s}.webp`, `After (${SHA}): ${what}`)}</div>`;
const rows = LOOKS.map((l) => `<section><h2>${NAME[l]} <span class="f">factor ${FACTOR[l]}</span></h2>
${pair(l, 'menu', 'File menu open')}${pair(l, 'dialog', 'a dialog open')}${pair(l, 'label', 'the pointer on a bank mark: its label window')}</section>`).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>T-180 chrome refactor (L249): before and after, six looks</title>
<style>:root{color-scheme:dark} body{margin:0;padding:24px 28px 60px;background:#0b0d11;color:#e6e9ef;font:14px/1.5 "Segoe UI",system-ui,sans-serif}
h1{font:600 20px/1.3 "Segoe UI",system-ui,sans-serif;margin:0 0 6px} h2{font:600 16px "Segoe UI",system-ui,sans-serif;margin:34px 0 10px} h2 .f{font-weight:400;font-size:13px;color:#9aa3b2;margin-left:10px}
p.lead,ul.lead{color:#aab2c0;max-width:1250px;margin:0 0 10px} ul.lead{padding-left:20px}
.pair{display:flex;flex-wrap:wrap;gap:16px;margin-bottom:14px} figure{margin:0;width:min(46vw,750px)} figure img{width:100%;display:block;border-radius:3px;outline:1px solid #252b36;cursor:zoom-in}
figcaption{color:#9aa3b2;font-size:12.5px;margin-top:5px} body.zoom figure.z{position:fixed;inset:0;width:auto;z-index:9;background:#000d;display:grid;place-items:center;margin:0;padding:10px} body.zoom figure.z img{width:auto;max-width:100%;max-height:96vh;cursor:zoom-out} body.zoom figure.z figcaption{display:none}
</style></head><body>
<h1>T-180 chrome refactor: the six looks, before and after</h1>
<p class="lead">The real page, Coast Esses laid, the same camera. Before is the branch's base (c9fe4f1, today's shapes with L244's mark colours); after is the refactor branch itself (${SHA}), with no stylesheet laid over it. What changed:</p>
<ul class="lead"><li>One radius scale (2 / 4 / 8 / 12 px by size) times one factor per look; rows inside a menu and buttons inside a dialog follow its corner, so they come out square.</li>
<li>One capsule: Export to Assetto Corsa, in the factor-1 looks.</li>
<li>No coloured glows on the chrome: hover and an open menu keep the look's own resting shading; focus is a solid 2 px ring; no halos behind dialogs; small neutral shadows.</li>
<li>Label windows on the road: their corner on the scale (r1 times the factor); their fill, sheen and glow as they were.</li>
<li>Backdrops, palettes, fonts, layout and spacing unchanged.</li></ul>
<p class="lead">The dialog is built with the app's own dialog markup and styles (the words are ours, so nothing ran on the track). Click any picture to see it full size.</p>
${rows}
<script>for (const f of document.querySelectorAll('figure')) f.addEventListener('click', () => { const on = !f.classList.contains('z'); document.querySelectorAll('figure.z').forEach((x) => x.classList.remove('z')); f.classList.toggle('z', on); document.body.classList.toggle('zoom', on); });</script>
</body></html>`;
fs.writeFileSync(OUT, html);
console.log(`${OUT}: ${fs.statSync(OUT).size} bytes`);
