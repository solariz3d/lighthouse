// selfcheck.js <repo>: the scanner on every tracked .js/.cjs under src/, app/, tools/, test/: the stripped code must pass `node --check` (a string or
// regex taken for a comment, or the reverse, breaks it), and strip(strip(x)) === strip(x). Prints counts and any failing file.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync, spawnSync } = require('child_process');
const { strip, comments } = require('./jsscan.js');
const repo = process.argv[2];
const files = execFileSync('git', ['-C', repo, 'ls-files', 'src', 'app', 'tools', 'test'], { encoding: 'utf8' }).trim().split('\n').filter((f) => /\.(c?js)$/.test(f));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'd578-')); let ok = 0, bad = 0, threw = 0, ncom = 0;
for (const f of files) {
  const src = fs.readFileSync(path.join(repo, f), 'utf8');
  let s; try { s = strip(src); ncom += comments(src).length; } catch (e) { threw++; console.log(`THREW ${f}: ${e.message}`); continue; }
  if (strip(s) !== s) { bad++; console.log(`NOT IDEMPOTENT ${f}`); continue; }
  const t = path.join(tmp, 'x' + path.extname(f)); fs.writeFileSync(t, s.replace(/^#!.*\n/, ''));
  const r = spawnSync(process.execPath, ['--check', t], { encoding: 'utf8' });
  if (r.status === 0) ok++; else { bad++; console.log(`SYNTAX ${f}: ${r.stderr.split('\n').find((l) => /Error/.test(l))}`); }
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`${files.length} files: stripped code parses ${ok}, fails ${bad}, scanner threw ${threw}; comments found ${ncom}`);
