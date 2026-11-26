// patch_probe.js: three changes to e_l255.js, each anchored once (pane E scratch)
const fs = require('fs'); const p = process.argv[2]; let s = fs.readFileSync(p, 'utf8');
const swap = (a, b) => { if (s.split(a).length !== 2) throw new Error('anchor not once: ' + a.slice(0, 70)); s = s.replace(a, b); };
// (a) Tab: focus the focusable just before the target in the page's order, then one real Tab
swap("await ev(`${sel}.focus(); return true;`); await key('Tab', 'Tab', 9, 8); await key('Tab', 'Tab', 9, 0);",
  "await ev(`const t = ${sel}; const all = [...document.querySelectorAll('button, input, select, textarea, summary, a[href], [tabindex]')].filter((e) => e.tabIndex >= 0 && !e.disabled && e.getClientRects().length); const i = all.indexOf(t); (i > 0 ? all[i - 1] : document.body).focus(); return true;`); await key('Tab', 'Tab', 9, 0);");
// (b) Export: the fill sampled inside the text's own box (a Range over the button's text), as row 14 samples
swap("const img = await grab(clip);\n          await ev(`${B}.style.removeProperty('-webkit-text-fill-color');",
  "const tb = await ev(`const g = document.createRange(); g.selectNodeContents(${B}); const r = g.getBoundingClientRect(); return [Math.floor(r.left), Math.floor(r.top), Math.ceil(r.right - r.left), Math.ceil(r.bottom - r.top)];`);\n          const img = await grab({ x: tb[0], y: tb[1], width: tb[2], height: tb[3] });\n          await ev(`${B}.style.removeProperty('-webkit-text-fill-color');");
swap("const L = []; for (let y = 2; y < img.h - 2; y++) for (let x = 3; x < img.w - 3; x++) L.push(img.px(x, y));",
  "const L = []; for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) L.push(img.px(x, y));");
// (c) the long name: the longest valid one (64 bytes with the eq- prefix, lib.rs valid_name), and every 10 px from 900 to 1400
swap("const longName = 'eq-' + 'a saved track whose name runs on for a long while';",
  "const longName = 'eq-' + 'a saved track whose name runs on for a long while and then more'.slice(0, 61);");
swap("for (const look of ['sigil', 'skyline']) for (const w of [900, 1000, 1400]) {",
  "for (const look of ['sigil', 'skyline']) for (const w of Array.from({ length: 51 }, (_, k) => 900 + 10 * k)) {");
fs.writeFileSync(p, s); console.log('patched');
