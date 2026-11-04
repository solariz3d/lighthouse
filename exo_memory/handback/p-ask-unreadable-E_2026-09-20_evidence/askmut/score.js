// score.js — the scorer the tracked harness runs inside its HEAD worktree, for a JS subject.
// Two harness facts it works around, both measured on 2026-09-20 (handback/p-harness-audit-E):
//   1. the worktree is HEAD and only the MUTATED file is copied in, so the test file there is HEAD's
//      — without this copy, every D091 mutant would survive for a reason unrelated to the mutant;
//   2. `cargoResult` (mutant-harness.js:80) parses only cargo's summary, so node:test reads as
//      NO RESULT — this prints the harness's own line FROM node:test's real counts.
// ASK_STORE is pinned to the LIVE store so the shipped-store test scores the real file.
const fs = require('fs');
const { spawnSync } = require('child_process');
const LIVE_TEST = 'C:/Users/nname/Desktop/lighthouse/consonance/tools/ask.test.js';
const LIVE_STORE = 'C:/Users/nname/Desktop/lighthouse/exo_memory/ASK.md';
fs.copyFileSync(LIVE_TEST, './ask.test.js');
const r = spawnSync(process.execPath, ['ask.test.js'], { encoding: 'utf8', env: { ...process.env, ASK_STORE: LIVE_STORE } });
const out = ((r.stdout || '') + (r.stderr || '')).replace(/\x1b\[[0-9;]*m/g, '');
process.stdout.write(out);
const pass = /^\s*[ℹ#]\s*pass\s+(\d+)\s*$/m.exec(out);
const fail = /^\s*[ℹ#]\s*fail\s+(\d+)\s*$/m.exec(out);
if (!pass || !fail) { console.log('no node:test summary — the harness will call this NO RESULT'); process.exit(1); }
for (const m of out.matchAll(/^\s*✖\s+(.+?)\s+\(\d/gm)) console.log(`FAILED TEST: ${m[1]}`);
console.log(`test result: ${+fail[1] ? 'FAILED' : 'ok'}. ${pass[1]} passed; ${fail[1]} failed`);
process.exit(+fail[1] ? 1 : 0);
