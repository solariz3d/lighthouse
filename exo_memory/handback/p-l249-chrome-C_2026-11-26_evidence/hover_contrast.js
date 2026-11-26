// hover_contrast.js (pane C, L249): WCAG 2 contrast of the words each hover shows on the new step 4 (--hover), by the formula, for aqua and aurora.
// The pairs are the rules that now take --hover in 7ab2adf's two files (the words' colour is the one each rule sets, or the look's --text).
// usage: node hover_contrast.js
'use strict';
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (h) => { const v = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); return 0.2126 * lin(v[0]) + 0.7152 * lin(v[1]) + 0.0722 * lin(v[2]); };
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const rows = [
  ['aqua', 'menu row hover, words --text', '#f2fdff', '#135060'],
  ['aqua', 'camera dock button hover, words #ffffff', '#ffffff', '#135060'],
  ['aqua', 'dialog quiet button hover, words #ffffff', '#ffffff', '#135060'],
  ['aurora', 'button / menu name hover, words --accent', '#6ff5c0', '#1b1f3c'],
  ['aurora', 'menu row hover, words --text', '#eaf6ff', '#1b1f3c'],
  ['aqua', 'step 10 (--accent-hover) under the gel ink --gel-text', '#01303c', '#54e3f6'],
  ['aurora', 'step 10 (--accent-hover) under Export\'s ink #03130d', '#03130d', '#7ef5c8'],
];
for (const [look, what, fg, bg] of rows) console.log(`${look.padEnd(7)} ${ratio(fg, bg).toFixed(2)}:1  ${fg} on ${bg}  ${what}`);
