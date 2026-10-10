// defheads.js <handback dir>: which headings the D276 rule classes NV and SD, by count (a check on the rule, read-only).
'use strict';
const fs = require('fs'), path = require('path');
const NV_HEAD = /does ?n[o']t establish|doesn't establish|not established|what (this|it|the finding) (does not|doesn't) (prove|establish|show|cover)|\blimits?\b|not verified|unverified|\bnot run\b|caveats?|not (yet )?(shown|proven)/i;
const SD_HEAD = /correction|my own|\bfault\b|mistake|\bslips?\b|i was wrong|errors? of mine/i;
const dir = process.argv[2], nv = new Map(), sd = new Map();
for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
  if (!e.isFile() || !/_\d{4}-\d{2}-\d{2}.*\.md$/.test(e.name)) continue;
  for (const l of fs.readFileSync(path.join(dir, e.name), 'utf8').split(/\r?\n/)) {
    const h = l.match(/^#{1,6}\s+(.*)$/); if (!h) continue;
    const k = h[1].replace(/[`*]/g, '').replace(/\(.*?\)/g, '').replace(/\d[\d\-:.]*/g, 'N').trim().slice(0, 70).toLowerCase();
    if (NV_HEAD.test(h[1])) nv.set(k, (nv.get(k) || 0) + 1); else if (SD_HEAD.test(h[1])) sd.set(k, (sd.get(k) || 0) + 1);
  }
}
const top = (m) => [...m].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, n]) => `  ${String(n).padStart(4)}  ${k}`).join('\n');
console.log(`NV headings: ${nv.size} distinct, ${[...nv.values()].reduce((a, b) => a + b, 0)} total\n${top(nv)}\n\nSD headings: ${sd.size} distinct, ${[...sd.values()].reduce((a, b) => a + b, 0)} total\n${top(sd)}`);
