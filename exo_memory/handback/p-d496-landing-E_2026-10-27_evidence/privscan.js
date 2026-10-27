// privscan.js (D496, pane E): COUNTS ONLY. Over <range> in <tree> (added lines, -m, and every added or modified file's blob):
//  (1) added lines (>= 60 chars, trimmed) identical to a line of any text file under C:\Consonance\private\ ;
//  (2) added or changed blobs byte-identical to a file under C:\Consonance\private\ (sha1 compare);
//  (3) added lines naming a path into private\ (C:\Consonance\private or Consonance/private).
// Never prints a line, a path inside private\, or a pattern.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execFileSync } = require('child_process');
const [tree, range] = process.argv.slice(2), PRIV = 'C:/Consonance/private';
const git = (...a) => execFileSync('git', a, { cwd: tree, encoding: 'utf8', maxBuffer: 1 << 30 });
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = fs.existsSync(PRIV) ? walk(PRIV) : [];
const lines = new Set(), hashes = new Set();
for (const f of files) {
  const b = fs.readFileSync(f); hashes.add(crypto.createHash('sha1').update(b).digest('hex'));
  if (b.length < 50 * 1024 * 1024) for (const l of b.toString('utf8').split(/\r?\n/)) { const t = l.trim(); if (t.length >= 60) lines.add(t); }
}
const added = git('log', '-p', '-m', '--no-color', '--format=', range).split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++')).map((l) => l.slice(1).trim());
const c1 = added.filter((l) => l.length >= 60 && lines.has(l)).length;
const c3 = added.filter((l) => /consonance[\\/]+private/i.test(l)).length;
// blobs: every file the range adds or modifies, at the range's tip
const tip = range.split('..')[1];
const changed = git('diff', '--name-only', '--diff-filter=AM', range.replace('..', '...').split('...')[0], tip).split('\n').filter(Boolean);
let c2 = 0;
for (const f of changed) { let b; try { b = execFileSync('git', ['show', `${tip}:${f}`], { cwd: tree, maxBuffer: 1 << 30 }); } catch (_) { continue; } const h = crypto.createHash('sha1').update(b).digest('hex'); if (hashes.has(h)) c2++; }
console.log(JSON.stringify({ privateFiles: files.length, privateLines60: lines.size, addedLines: added.length, changedFiles: changed.length, addedLinesEqualToAPrivateLine: c1, filesByteEqualToAPrivateFile: c2, addedLinesNamingPrivatePath: c3 }));
