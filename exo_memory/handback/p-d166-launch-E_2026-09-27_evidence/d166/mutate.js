'use strict';
// D166 (pane E): mutation pass over scripts/ac_launch.js against test/ac_launch.test.js. One exact-string replacement
// per mutant (it must occur exactly once, else NOT APPLIED); the file is restored in a finally and byte-checked at the end.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process'), crypto = require('crypto');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const FILE = path.join(REPO, 'scripts/ac_launch.js');
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const M = [
  ['track name: prefix not anchored', "!/^t180b_[a-z0-9_]+$/.test(name)", "!/t180b_[a-z0-9_]+$/.test(name)"],
  ['track name: check removed', "if (typeof name !== 'string' || !/^t180b_[a-z0-9_]+$/.test(name)) throw", 'if (false) throw'],
  ['race: player not last', 'STARTING_POSITION: cars', 'STARTING_POSITION: 1'],
  ['race: one AI too few', 'for (let i = 1; i <= ai; i++) sec', 'for (let i = 1; i < ai; i++) sec'],
  ['race: CARS excludes the player', 'const cars = ai + 1;', 'const cars = ai;'],
  ['race: remote left active', "sec('REMOTE', { ACTIVE: 0 });", "sec('REMOTE', { ACTIVE: 1 });"],
  ['race: car name check removed', "if (!/^[A-Za-z0-9_\\-.]+$/.test(car || '')) throw", 'if (false) throw'],
  ['race: ai range check removed', 'if (!(Number.isInteger(ai) && ai >= 1 && ai <= 30)) throw', 'if (false) throw'],
  ['race: laps check removed', 'if (!(Number.isInteger(laps) && laps >= 1)) throw', 'if (false) throw'],
  ['backup: overwrite allowed', 'if (fs.existsSync(bak)) throw new Error(', 'if (false) throw new Error('],
  ['restore: not in a finally', 'try { result = await fn(rec); } catch (e) { error = e; }\n  finally { restore(rec); }', 'try { result = await fn(rec); restore(rec); } catch (e) { error = e; }'],
  ['restore: write skipped', 'fs.writeFileSync(r.file, bytes);', ''],
  ['restore: tamper check removed', 'if (sha256(bytes) !== r.sha256) { bad.push', 'if (false) { bad.push'],
  ['withBackup: error swallowed', 'if (error) throw error;', ''],
  ['cfg: extension dir skipped', "for (const d of [cfgDir, path.join(cfgDir, 'extension')])", 'for (const d of [cfgDir])'],
  ['timeout: kill skipped', 'const hard = setT(() => { kill(child.pid);', 'const hard = setT(() => {'],
  ['timeout: grace kill skipped', 'if (!done) { kill(child.pid); finish', 'if (!done) { finish'],
  ['timeout: close skipped', '}, graceMs); close(child.pid); }, stopAfterMs);', '}, graceMs); }, stopAfterMs);'],
  ['timeout: grace timer not cleared', 'if (grace) clearT(grace);', ''],
  ['timeout: exit ignored', "child.on('exit', (code) => finish(", "child.on('exit-never', (code) => finish("],
  ['timeout: 10 min changed', 'const HARD_TIMEOUT_MS = 10 * 60 * 1000;', 'const HARD_TIMEOUT_MS = 20 * 60 * 1000;'],
  ['args: unknown flag accepted', 'else throw new Error(`unknown argument ${k}`);', ''],
];
const orig = fs.readFileSync(FILE), origSha = sha(orig), text = orig.toString('utf8');
let applied = 0, caught = 0, notApplied = 0; const rows = [];
for (const [name, from, to] of M) {
  const n = text.split(from).length - 1;
  if (n !== 1) { notApplied++; rows.push(`NOT APPLIED (${n} matches)  ${name}`); continue; }
  try {
    fs.writeFileSync(FILE, text.replace(from, to));
    const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', 'test/ac_launch.test.js'], { cwd: REPO, encoding: 'utf8', timeout: 120000 });
    applied++; const failed = r.status !== 0; if (failed) caught++;
    rows.push(`${failed ? 'caught  ' : 'SURVIVED'}  ${name}`);
  } finally { fs.writeFileSync(FILE, orig); }
}
const ok = sha(fs.readFileSync(FILE)) === origSha;
console.log(rows.join('\n'));
console.log(`\napplied ${applied} / caught ${caught} / NOT APPLIED ${notApplied} (of ${M.length}); file restored byte-exact: ${ok ? 'yes' : 'NO'}`);
if (!ok) process.exitCode = 2;
