// inv.js <newTree> <oldTree> <out.json>: every line NEW in the generated tree (not present in the same file of 0.1.1),
// flagged by category. The private name's pattern comes from PRIV_PATTERN and is masked in all output. Read-only.
'use strict';
const os = require('os'), fs = require('fs'), path = require('path');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) {}
const [NEW, OLD, OUT] = process.argv.slice(2);
if (!process.env.PRIV_PATTERN) throw new Error('set PRIV_PATTERN');
const PRIV = new RegExp(process.env.PRIV_PATTERN, 'i');
const CATS = [
  ['keeper', /keeper/i],
  ['handle', /solariz3d/i],
  ['name', /\bzac+[hk]?\b|\bzach\b|\bzack\b/i],
  ['pronoun', /\b(he|him|his|himself|he's|he'd)\b/i],
  ['machine-path', /[A-Za-z]:[\\/]|\\Users\\|\/Users\/|Desktop|Downloads|nname|Consonance[\\/]data|AppData/i],
  ['machine', /\bEXPO\b|\bRAM\b|16[- ]core|this machine|his machine|GPU|BIOS|Regina|Saskatchewan|overnight|night shift/i],
  ['product', /T-?180|\bt180\b|track builder|track-builder|Assetto|\bAC\b|\bkn5\b|telemetry|\bSignal\b|racing|\braces\b|sim ?rig|ELYSIUM/i],
  ['private', PRIV],
];
const walk = (d, b = d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(d, e.name);
  if (e.name === '.git') return [];
  return e.isDirectory() ? walk(p, b) : [path.relative(b, p).replace(/\\/g, '/')];
});
const isText = (buf) => !buf.subarray(0, 8000).includes(0);
const rows = [], perFile = {};
let newFiles = 0, newLines = 0;
for (const rel of walk(NEW)) {
  const nb = fs.readFileSync(path.join(NEW, rel));
  if (!isText(nb)) continue;
  const op = path.join(OLD, rel);
  const old = fs.existsSync(op) ? new Set(fs.readFileSync(op, 'utf8').split(/\r?\n/)) : null;
  if (!old) newFiles++;
  const lines = nb.toString('utf8').split(/\r?\n/);
  lines.forEach((l, i) => {
    if (old && old.has(l)) return;
    if (!l.trim()) return;
    newLines++;
    const cats = CATS.filter(([, re]) => re.test(l)).map(([c]) => c);
    if (!cats.length) return;
    rows.push({ file: rel, line: i + 1, cats, newFile: !old, text: l.replace(new RegExp(process.env.PRIV_PATTERN, 'gi'), '[P]').slice(0, 400) });
    perFile[rel] = (perFile[rel] || 0) + 1;
  });
}
const byCat = {};
for (const r of rows) for (const c of r.cats) byCat[c] = (byCat[c] || 0) + 1;
fs.writeFileSync(OUT, JSON.stringify({ newFiles, newLines, flagged: rows.length, byCat, perFile, rows }, null, 1));
console.log(`new files ${newFiles}, new non-blank lines ${newLines}, flagged ${rows.length}`);
console.log('by category', JSON.stringify(byCat));
for (const [f, n] of Object.entries(perFile).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)} ${f}`);
