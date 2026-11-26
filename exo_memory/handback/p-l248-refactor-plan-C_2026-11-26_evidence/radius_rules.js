// radius_rules.js (pane C, L248): every CSS rule at a builder commit that sets border-radius, box-shadow, text-shadow or backdrop-filter, with its selector and file:line.
// usage: node radius_rules.js <builder repo> <sha>     (reads with git show; writes nothing)
'use strict';
const { execFileSync } = require('child_process');
const [repo, sha] = process.argv.slice(2);
const files = ['app/index.html', ...['sigil', 'aqua', 'glass', 'aurora', 'skyline', 'skyline-night'].filter((t) => t !== 'sigil').map((t) => `app/themes/${t}.css`)];
for (const f of files) {
  let src = execFileSync('git', ['-C', repo, 'show', `${sha}:${f}`], { encoding: 'utf8', maxBuffer: 1 << 26 });
  if (f.endsWith('.html')) { const m = /<style[^>]*>([\s\S]*?)<\/style>/.exec(src); const pre = src.slice(0, m.index + m[0].indexOf(m[1])); src = '\n'.repeat(pre.split('\n').length - 1) + m[1]; }
  const noCom = src.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
  const re = /([^{}]+)\{([^{}]*)\}/g; let m;
  while ((m = re.exec(noCom))) {
    const sel = m[1].trim().replace(/\s+/g, ' '), body = m[2], line = noCom.slice(0, m.index + m[1].length).split('\n').length;
    for (const d of body.split(';')) { const k = d.split(':')[0].trim(); if (/^(border-radius|box-shadow|text-shadow|backdrop-filter)$/.test(k)) console.log(`${f}:${line}\t${k}\t${d.slice(d.indexOf(':') + 1).trim().slice(0, 90)}\t${sel.slice(0, 120)}`); }
  }
}
