// bestcatch.js <out.json>: per tool / hook, the two strongest record lines where IT is the catcher: the name followed within 100 chars by a strong verb
// (caught, catches, flagged, refused, denied, blocked, found, reported, fired, would have, stopped, read ... RED/WARN), newest first; plus how many such lines.
// Hand-backs, map, librarian, loop, journal: exo_memory/**/*.md. Prints file:line and the line (trimmed to 260 chars).
'use strict';
const fs = require('fs'), path = require('path');
const LH = 'C:/Users/nname/Desktop/lighthouse';
const tools = fs.readdirSync(LH + '/consonance/tools').filter((f) => /\.(js|cjs|py|ps1)$/.test(f) && !/\.test\.js$/.test(f));
const hooks = fs.readdirSync(LH + '/consonance/hooks').filter((f) => /\.js$/.test(f) && !/\.test\.js$/.test(f));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const VERB = '(caught|catch(es)?|flagged|flags|refused|refuses|denied|denies|blocked|blocks|found|finds|reported|reports|fired|would have|stopped|stops|returned (RED|WARN|a )|reads? (RED|WARN)|named|surfaced|warned|warns)';
const names = [...tools.map((f) => ['tool', f]), ...hooks.map((f) => ['hook', f])].map(([k, f]) => ({ k, f, re: new RegExp(`(${esc(f)}|${k === 'tool' ? 'tools' : 'hooks'}/${esc(f.replace(/\.[^.]+$/, ''))})(?![A-Za-z0-9_-])[^.;]{0,100}?\\b${VERB}\\b`, 'i') }));
const md = []; const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!/^(\.git|node_modules)$/.test(e.name)) walk(p); } else if (/\.md$/.test(e.name)) md.push(p); } };
walk(LH + '/exo_memory');
const hits = new Map(names.map((n) => [n.f, []]));
for (const p of md) { const rel = path.relative(LH, p).replace(/\\/g, '/'), d = (rel.match(/(20\d\d-\d\d-\d\d)/) || [])[1] || fs.statSync(p).mtime.toISOString().slice(0, 10);
  fs.readFileSync(p, 'utf8').split(/\r?\n/).forEach((l, i) => { for (const n of names) if (n.re.test(l)) hits.get(n.f).push({ d, at: `${rel}:${i + 1}`, l: l.trim().slice(0, 260) }); }); }
const out = {};
for (const n of names) { const h = hits.get(n.f).sort((a, b) => (a.d < b.d ? 1 : -1)); out[n.f] = { kind: n.k, n: h.length, top: h.slice(0, 2), oldest: h[h.length - 1] || null }; }
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
for (const [f, o] of Object.entries(out)) { console.log(`## ${o.kind} ${f}: ${o.n}`); for (const t of o.top) console.log(`   ${t.d} ${t.at}\n      ${t.l}`); }
