// refactor_page.js (pane C, L248): one self-contained HTML page from refactor_shots.js's pictures: per look, before and after side by side, the File menu open
// and a dialog open; then skyline-night docked and floating. Pictures embedded as WebP data. A click on a picture shows it at full size.
// usage: node refactor_page.js <shots dir> <out.html>
'use strict';
const fs = require('fs'), path = require('path');
const [DIR, OUT] = process.argv.slice(2).map((p) => path.resolve(p));
const LOOKS = ['sigil', 'glass', 'aqua', 'aurora', 'skyline', 'skyline-night'];
const NAME = { sigil: 'SIGIL', glass: 'Glass', aqua: 'Aqua', aurora: 'Aurora', skyline: 'Skyline', 'skyline-night': 'Skyline Night' };
const FACTOR = { sigil: '0.5: buttons 2 px, menus 4, dialogs 6', glass: '0: square everywhere', aqua: '1: buttons 4 px, menus 8, dialogs 12; Export the one capsule', aurora: '0.75: buttons 3 px, menus 6, dialogs 9', skyline: '1: buttons 4 px, menus 8, dialogs 12; Export the one capsule', 'skyline-night': '1: buttons 4 px, menus 8, dialogs 12; Export the one capsule' };
const img = (f) => `data:image/webp;base64,${fs.readFileSync(path.join(DIR, f)).toString('base64')}`;
const fig = (f, cap) => `<figure><img src="${img(f)}" alt="${cap}"><figcaption>${cap}</figcaption></figure>`;
const rows = LOOKS.map((l) => `<section><h2>${NAME[l]} <span class="f">factor ${FACTOR[l]}</span></h2>
<div class="pair">${fig(`${l}_before_menu.webp`, 'Before: today (0ab6cc8), File menu open')}${fig(`${l}_after_menu.webp`, 'After: the draft, File menu open')}</div>
<div class="pair">${fig(`${l}_before_dialog.webp`, 'Before: a dialog open')}${fig(`${l}_after_dialog.webp`, 'After: a dialog open')}</div></section>`).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>T-180 refactor draft: before and after, six looks</title>
<style>:root{color-scheme:dark} body{margin:0;padding:24px 28px 60px;background:#0b0d11;color:#e6e9ef;font:14px/1.5 "Segoe UI",system-ui,sans-serif}
h1{font:600 20px/1.3 "Segoe UI",system-ui,sans-serif;margin:0 0 6px} h2{font:600 16px "Segoe UI",system-ui,sans-serif;margin:34px 0 10px} h2 .f{font-weight:400;font-size:13px;color:#9aa3b2;margin-left:10px}
p.lead,ul.lead{color:#aab2c0;max-width:1250px;margin:0 0 10px} ul.lead{padding-left:20px}
.pair{display:flex;flex-wrap:wrap;gap:16px;margin-bottom:14px} figure{margin:0;width:min(46vw,750px)} figure img{width:100%;display:block;border-radius:3px;outline:1px solid #252b36;cursor:zoom-in}
figcaption{color:#9aa3b2;font-size:12.5px;margin-top:5px} body.zoom figure.z{position:fixed;inset:0;width:auto;z-index:9;background:#000d;display:grid;place-items:center;margin:0;padding:10px} body.zoom figure.z img{width:auto;max-width:100%;max-height:96vh;cursor:zoom-out} body.zoom figure.z figcaption{display:none}
</style></head><body>
<h1>T-180 refactor draft: the six looks, before and after</h1>
<p class="lead">The real page (builder 0ab6cc8, Coast Esses laid, the same camera), with one stylesheet laid over it: the spec draft (<code>briefs/t180_ui_refactor_spec.md</code>). Nothing in the builder was changed. What the draft does:</p>
<ul class="lead"><li>One radius scale (2 / 4 / 8 / 12 px by size) times one factor per look; square where a surface meets the window's edge.</li>
<li>Rows and buttons inside a menu or dialog follow its corner (outer minus padding), so they come out square.</li>
<li>At most one capsule: Export to Assetto Corsa, in the factor-1 looks.</li>
<li>No coloured glows: hover and an open menu keep the look's own resting shading; focus is a solid ring; no halos behind dialogs; small neutral shadows.</li>
<li>Glass stays where it is (the left column and the bars over the view). Density and spacing unchanged.</li></ul>
<p class="lead">The dialog is built with the app's own dialog markup and styles (the words are mine, so nothing ran on the track). Click any picture to see it full size.</p>
${rows}
<section><h2>Skyline Night, two layouts <span class="f">his call: the left column docked as now, or floating over the view</span></h2>
<div class="pair">${fig('skyline-night_after_docked.webp', 'Docked: square at the window edge (the draft)')}${fig('skyline-night_after_floating.webp', 'Floating: inset 10 px, the 12 px corner, a small shadow')}</div></section>
<script>for (const f of document.querySelectorAll('figure')) f.addEventListener('click', () => { const on = !f.classList.contains('z'); document.querySelectorAll('figure.z').forEach((x) => x.classList.remove('z')); f.classList.toggle('z', on); document.body.classList.toggle('zoom', on); });</script>
</body></html>`;
fs.writeFileSync(OUT, html);
console.log(`${OUT}: ${fs.statSync(OUT).size} bytes`);
