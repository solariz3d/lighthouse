// pushscan.js: read-only scans of the lighthouse push range origin/main..HEAD, at BelowNormal.
//  1a push-gate's own findKeys/KEYS over the added lines (the shapes with their minimum lengths)
//  1b a loose prefix pass over EVERY line of the patch and the commit messages, each hit printed for a line-by-line read
//  2  the private project's name, case-insensitive, over every line of `git log -p` (context lines and messages included);
//     the pattern comes from the PRIV_PATTERN environment variable so this public file never holds the name
//  3  every blob the range adds: size over 5 MB, or a .kn5/.tar/.dds name
'use strict';
const os = require('os'), { spawnSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) {}
const repo = 'C:/Users/nname/Desktop/lighthouse', range = 'origin/main..HEAD';
const git = (...a) => { const r = spawnSync('git', ['-C', repo, '--no-optional-locks', ...a], { encoding: 'utf8', maxBuffer: 1 << 30, windowsHide: true }); if (r.status !== 0) throw new Error(`git ${a.join(' ')}: ${r.stderr}`); return r.stdout; };
const G = require('C:/Users/nname/Desktop/lighthouse/consonance/hooks/push-gate.js');

const commits = git('rev-list', range).trim().split('\n').filter(Boolean);
console.log(`range ${range}: ${commits.length} commits, ${git('rev-parse', '--short', 'origin/main').trim()}..${git('rev-parse', '--short', 'HEAD').trim()}`);

// the same log shape push-gate scans: a NUL-led commit line, then the patch
const log = git('log', '-p', '--no-color', '--format=%x00%H%n%B', range);
console.log(`patch: ${log.length} chars, ${log.split('\n').length} lines`);

const keys = G.findKeys(log);
console.log(`1a push-gate findKeys on added lines: ${keys.length}`);
for (const k of keys) console.log(`   HIT ${k.commit.slice(0, 8)} ${k.file}:${k.line} ${k.kind}`);

const loose = /sk-ant-|sk-or-|vck_|\bgh[pousr]_|github_pat_|\bAKIA[0-9A-Z]{4}|\bASIA[0-9A-Z]{4}|PRIVATE KEY/;
let commit = null, file = null, n1b = 0;
for (const l of log.split('\n')) {
  if (l.startsWith('\u0000')) { commit = l.slice(1, 9); file = '(message)'; continue; }
  if (l.startsWith('+++ ')) { file = l.slice(4).replace(/^b\//, ''); continue; }
  if (loose.test(l)) { n1b++; const m = l.match(loose); const i = Math.max(0, m.index - 60); console.log(`   1b ${commit} ${file} [${l[0] === '+' ? 'added' : l[0] === '-' ? 'removed' : 'context/msg'}] …${l.slice(i, m.index + 60).replace(/\s+/g, ' ')}…`); }
}
console.log(`1b loose prefix lines (all lines): ${n1b}`);

if (!process.env.PRIV_PATTERN) throw new Error('set PRIV_PATTERN to the private-name pattern (kept out of this file)');
const PRIV = new RegExp(process.env.PRIV_PATTERN, 'i');
const priv = log.split('\n').filter((l) => PRIV.test(l)).length;
console.log(`2 private-name lines in git log -p (context and messages included): ${priv}`);

const objs = git('rev-list', '--objects', range, '--not', 'origin/main').trim().split('\n').filter(Boolean);
const batch = spawnSync('git', ['-C', repo, 'cat-file', '--batch-check=%(objecttype) %(objectname) %(objectsize) %(rest)'], { input: objs.join('\n') + '\n', encoding: 'utf8', maxBuffer: 1 << 28 }).stdout.trim().split('\n');
const blobs = batch.map((l) => l.split(' ')).filter((p) => p[0] === 'blob').map((p) => ({ sha: p[1], size: +p[2], name: p.slice(3).join(' ') }));
const big = blobs.filter((b) => b.size > 5 * 1024 * 1024), typed = blobs.filter((b) => /\.(kn5|tar|dds)$/i.test(b.name));
blobs.sort((a, b) => b.size - a.size);
console.log(`3 new blobs: ${blobs.length}; over 5 MB: ${big.length}; .kn5/.tar/.dds: ${typed.length}; largest: ${blobs.slice(0, 3).map((b) => `${(b.size / 1048576).toFixed(2)} MB ${b.name}`).join(' | ')}`);
for (const b of big.concat(typed)) console.log(`   FLAG ${b.sha.slice(0, 8)} ${(b.size / 1048576).toFixed(2)} MB ${b.name}`);
