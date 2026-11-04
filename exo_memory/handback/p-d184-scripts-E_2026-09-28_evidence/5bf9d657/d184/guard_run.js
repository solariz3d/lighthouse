// D184, B, the chair's follow-ups, ONE hold of the lock, 4096 MB:
//  (a) reads/ completeness: test/corpus.test.js in the SHARED checkout (it rebuilds src/doc/corpus.json byte-equal from reads/);
//      read-only there (the test writes nothing to the repo, per E §1).
//  (b) the skill never PRINTS an equation: fit-fourier and fit-pieces on Serpents in b-d184-wt, stdout+stderr scanned for runs
//      of numbers (a coefficient list) and their size recorded;
//  (c) never COMMITS one: fit-fourier --write in b-d184-wt, then git status must show nothing under reads/ and the file must be
//      in reads/ only.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane B: D184 guard checks (corpus rebuild, skill print/commit scan)' });
const OUT = __dirname, SH = 'C:/Users/nname/Desktop/t180-track-builder', WT = 'C:/Users/nname/AppData/Local/Temp/b-d184-wt';
const env = { ...process.env, NO_COLOR: '1', NODE_OPTIONS: '--max-old-space-size=4096' };
const run = (cwd, args) => { const r = spawnSync(process.execPath, ['--max-old-space-size=4096', ...args], { cwd, env, encoding: 'utf8', maxBuffer: 1 << 28 }); return { status: r.status, out: (r.stdout || '') + (r.stderr || '') }; };
const rep = {};
for (const f of fs.readdirSync(path.join(SH, 'reads'))) if (f.endsWith('.read.json')) fs.copyFileSync(path.join(SH, 'reads', f), path.join(WT, 'reads', f));   // plain COPIES, never a link
rep.readsCopied = fs.readdirSync(path.join(WT, 'reads')).filter((f) => f.endsWith('.read.json')).length;
const c = run(WT, ['--test', 'test/corpus.test.js']);
rep.corpus = { status: c.status, summary: (c.out.match(/^ℹ (tests|pass|fail|skipped) \d+/gm) || []).join(' · ') };
const S = 'reads/serpents_spiral.read.json', TR = 'G:/SteamLibrary/steamapps/common/assettocorsa/content/tracks/serpents_spiral';
const scan = (o) => { const runs = [...o.out.matchAll(/(-?\d+(?:\.\d+)?(?:e-?\d+)?\s*,\s*){12,}/g)]; return { status: o.status, bytes: o.out.length, numberRuns12plus: runs.length, longest: runs.reduce((m, r) => Math.max(m, r[0].split(',').length), 0) }; };
rep.fitFourier = scan(run(WT, ['.claude/skills/track-equations/scripts/fit-fourier.cjs', S]));
rep.fitPieces = scan(run(WT, ['.claude/skills/track-equations/scripts/fit-pieces.cjs', TR, S, '--curve']));
const w = run(WT, ['.claude/skills/track-equations/scripts/fit-fourier.cjs', S, '--write']);
rep.write = scan(w);
rep.written = fs.readdirSync(path.join(WT, 'reads')).filter((f) => /equation|pieces/.test(f));
rep.gitStatusReads = spawnSync('git', ['-C', WT, 'status', '--porcelain', '--untracked-files=all', '--', 'reads'], { encoding: 'utf8' }).stdout.trim() || '(nothing)';
rep.checkIgnore = spawnSync('git', ['-C', WT, 'check-ignore', '-v', 'reads/serpents_spiral.equation.json'], { encoding: 'utf8' }).stdout.trim();
fs.writeFileSync(path.join(OUT, 'guard.json'), JSON.stringify(rep, null, 1));
