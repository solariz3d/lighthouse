#!/usr/bin/env node
'use strict';
// jev/test/ask-judge.mutants.js — node jev/test/ask-judge.mutants.js [--only <n>]
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. This breaks jev/lib/ask.js and jev/bin/jev-judge.js one
// guard at a time and requires ask.test.js + judge.test.js to go RED for each. On these files a surviving mutant is a key
// that leaks, a secret that ships, turn text in a ledger, an opted-out project judged anyway, or a session held up.
//
// THE TRACKED SOURCES ARE NEVER WRITTEN. jev/ is copied into a temp dir, the copy is mutated, the copy's two suites
// run, the dir is removed. Every anchor must occur EXACTLY ONCE in its file, or the row is NOT APPLIED (and counted as
// such, never as a catch). The suites run with AI_GATEWAY_API_KEY removed, so no mutant can reach the network.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { isolatedEnv } = require('./isolated-env.js');

const JEV = path.join(__dirname, '..');
const ASK = 'lib/ask.js';
const JUDGE = 'bin/jev-judge.js';
const PATTERNS = ['anthropic-key', 'openai-style-key', 'github-token', 'aws-access-key-id', 'slack-token',
  'google-api-key', 'private-key-block', 'bearer-token', 'jwt', 'secret-assignment'];

const MUTANTS = [
  [ASK, 'no-key refusal removed', "if (!k) throw new Refusal('no key", "if (false) throw new Refusal('no key"],
  [ASK, 'ask reads the environment when no key is passed', "const k = typeof key === 'string' ? key.trim() : '';", "const k = typeof key === 'string' ? key.trim() : (process.env.AI_GATEWAY_API_KEY || '');"],
  [ASK, 'secret scan result ignored', 'if (hits.length) {', 'if (false) {'],
  [ASK, 'the-key-itself check removed', 'if (key && key.length >= 8 && text.includes(key)) hits.push', 'if (false) hits.push'],
  ...PATTERNS.map((p) => [ASK, `pattern ${p} never matches`, `['${p}', /`, `['${p}', /(?!)/, /`]),
  [ASK, 'question instructions not scanned', 'out.push([`questions.${name}.instructions`, q.instructions]);', '/* not scanned */'],
  [ASK, 'error messages not scrubbed of the key', 'e.message = scrub(e.message, k);', 'e.message = e.message;'],
  [ASK, 'a non-2xx read as success', 'if (!res.ok) throw', 'if (false) throw'],
  [ASK, 'a choice outside the options accepted', "if (!(typeof a.choice === 'string' && Object.prototype.hasOwnProperty.call(question.criteria, a.choice))) {", 'if (false) {'],
  [ASK, 'a missing answer not detected', 'if (!a) throw new GatewayError(`gateway response has no answer', 'if (false) throw new GatewayError(`gateway response has no answer'],
  [ASK, 'more than one question allowed', 'if (names.length !== 1) {', 'if (false) {'],
  [ASK, 'an empty state allowed', "if (typeof state !== 'string' || !state.trim()) throw", "if (typeof state !== 'string') throw"],
  [ASK, 'a reason invented when the gateway gave none', "reason: typeof a.reason === 'string' ? a.reason : null,", "reason: typeof a.reason === 'string' ? a.reason : 'no reason given',"],
  [ASK, 'the configured gateway url ignored', 'const url = gateway.url || URL_EVALUATE;', 'const url = URL_EVALUATE;'],
  [ASK, 'Retry-After ignored by the pacer', 'notBefore = t + (ra != null ? ra :', 'notBefore = t + (false ? ra :'],
  [ASK, 'the pacer over-cap refusal removed', 'if (wait > maxWaitMs) {', 'if (false) {'],

  [JUDGE, 'opt-out ignored', "if (cfg.optedOut) return { outcome: 'opted-out' };", ''],
  [JUDGE, 'judge "listed" ignored', "if (cfg.judge === 'listed' && ", 'if (false && '],
  [JUDGE, 'the dream guard ignored', 'if (cfg.dream && env.CONSONANCE_DREAM) return', 'if (false) return'],
  [JUDGE, 'the dream guard not a switch', 'if (cfg.dream && env.CONSONANCE_DREAM) return', 'if (env.CONSONANCE_DREAM) return'],
  [JUDGE, 'the row carries the view', 'prompt_sha256: sha(state), usage: r.usage };', 'prompt_sha256: sha(state), usage: r.usage, view };'],
  [JUDGE, 'the row carries the prompt, not its sha', 'prompt_sha256: sha(state),', 'prompt_sha256: state,'],
  // Re-anchored D124 (the D123 judge keys dedupe by prompt_id when the payload has one); same property, same removal.
  [JUDGE, 'a turn already judged is asked again', "if (alreadyJudged(ledgerPath, sid, promptId ? { prompt_id: promptId } : { turn_uuid: turn })) return { outcome: 'already' };", ''],
  [JUDGE, 'the turn end not required (any assistant row)', "return o.message.stop_reason === 'end_turn' && o.uuid ? { uuid: o.uuid } : null;", 'return o.uuid ? { uuid: o.uuid } : null;'],
  [JUDGE, 'a gateway error body logged', 'const status = err.status || (m ? Number(m[1]) : null);', "const status = err.status || (m ? Number(m[1]) : null);\n    return { outcome: 'gateway-failed', why: err.message };"],
  [JUDGE, 'failures not logged', 'try { appendLine(logFile, line); } catch', 'try { } catch'],
  // Re-anchored D124: since D123 the child's stdin is a pipe (it carries the move) and stdout/stderr stay ignored.
  [JUDGE, 'the child not detached', "detached: true, stdio: ['pipe', 'ignore', 'ignore'], windowsHide: true", "detached: false, stdio: ['pipe', 'ignore', 'ignore'], windowsHide: true"],
  [JUDGE, 'the child shares the hook\'s stdio', "detached: true, stdio: ['pipe', 'ignore', 'ignore'], windowsHide: true", "detached: true, stdio: 'pipe', windowsHide: true"],
  [JUDGE, 'the child not hidden on Windows', "detached: true, stdio: ['pipe', 'ignore', 'ignore'], windowsHide: true", "detached: true, stdio: ['pipe', 'ignore', 'ignore'], windowsHide: false"],
  [JUDGE, 'the child not unref\'d', "if (child && typeof child.unref === 'function') child.unref();", ''],
  // Re-anchored D124: the command-line payload gained prompt_id (D123). Passing the whole payload would put the move on argv.
  [JUDGE, 'the whole payload passed to the child', 'const pass = { session_id: meta.session_id || null, transcript_path: meta.transcript_path || null, cwd: meta.cwd || null,\n      prompt_id: meta.prompt_id || null };', 'const pass = meta;'],
  [JUDGE, 'a spawn failure reaches the session', '} catch { /* a spawn that fails must not reach the session */ }', '} catch (e) { throw e; }'],
  // The real hook-process test is the one that must catch this: spawnSync ignores spawnImpl and blocks on the child's poll.
  [JUDGE, 'the hook waits for its child', 'const child = spawnImpl(argv0,', "const child = require('child_process').spawnSync(argv0,"],
];

function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) copyTree(s, d); else fs.copyFileSync(s, d);
  }
}

// D129: the suites — and anything a mutant makes them spawn — get their own store. Row 42 swaps the hook's stub spawn for a
// real spawnSync, and until D129 that child inherited this env and wrote "refused" lines into the keeper's REAL
// %LOCALAPPDATA%\jev\jev.log (4 lines on 2026-09-23, reproduced: 2 per run). The root sits inside the mutant's temp copy,
// so it goes when the copy goes.
function runSuites(dir) {
  const env = isolatedEnv(path.join(dir, '.iso'));
  delete env.AI_GATEWAY_API_KEY;
  return spawnSync(process.execPath, ['--test', path.join(dir, 'test', 'ask.test.js'), path.join(dir, 'test', 'judge.test.js')],
    { cwd: dir, env, encoding: 'utf8', timeout: 180000 });
}

function main() {
  const onlyAt = process.argv.indexOf('--only');
  const only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const rows = [];
  const control = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-mut-ctl-'));
  copyTree(JEV, control);
  const c = runSuites(control);
  fs.rmSync(control, { recursive: true, force: true });
  console.log(`control: ${c.status === 0 ? 'GREEN' : 'RED'} (exit ${c.status})`);
  if (c.status !== 0) { console.log(c.stdout.slice(-2000)); process.exitCode = 1; return; }

  MUTANTS.forEach(([file, name, from0, to0], i) => {
    const n = i + 1;
    if (only && n !== only) return;
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-mut-'));
    try {
      copyTree(JEV, dir);
      const f = path.join(dir, file);
      const src = fs.readFileSync(f, 'utf8');
      // D124: an anchor's line breaks follow the source's own, so a CRLF checkout (core.autocrlf=true, as on D) applies
      // the same rows as an LF one instead of reading NOT APPLIED for a reason that is not about the code.
      const eol = src.includes('\r\n') ? '\r\n' : '\n';
      const from = from0.replace(/\r?\n/g, eol);
      const to = to0.replace(/\r?\n/g, eol);
      const count = src.split(from).length - 1;
      if (count !== 1) { rows.push([n, name, 'NOT APPLIED', `anchor occurs ${count} times`]); return; }
      fs.writeFileSync(f, src.replace(from, to));
      const r = runSuites(dir);
      rows.push([n, name, r.status === 0 ? 'SURVIVED' : 'caught', `exit ${r.status}`]);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
  for (const [n, name, verdict, note] of rows) console.log(`M${String(n).padStart(2, '0')} ${verdict.padEnd(11)} ${name} (${note})`);
  const caught = rows.filter((r) => r[2] === 'caught').length;
  const survived = rows.filter((r) => r[2] === 'SURVIVED').length;
  const notApplied = rows.filter((r) => r[2] === 'NOT APPLIED').length;
  console.log(`applied ${caught + survived} / caught ${caught} / survived ${survived} / NOT APPLIED ${notApplied} — of ${rows.length}`);
  process.exitCode = survived || notApplied ? 1 : 0;
}

main();
