#!/usr/bin/env node
'use strict';
// jev-ask.mutants.js — run with: node consonance/tools/jev-ask.mutants.js [--only <n>]
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. This breaks jev-ask.js one guard at a time and
// requires jev-ask.test.js to go RED for each. On this tool a surviving mutant is a key that leaks, a secret that
// ships, or a malformed answer read as a real one — each a way to report success while doing the thing refused.
//
// THE TRACKED SOURCES ARE NEVER WRITTEN — the pattern of state-sync.mutants.js and dev/tail-carry.mutants.js. The
// source and its test are COPIED into a temp dir, the copy is mutated, the copy's suite runs, the dir is removed.
// A kill mid-run leaves a stray temp dir, never a mutant in the repo.
//
// Every anchor must occur EXACTLY ONCE in the source, or the row is NOT APPLIED (and counted as such, never as a
// catch). The suite runs with AI_GATEWAY_API_KEY and JEV_LIVE_SMOKE removed from its environment, so no mutant can
// reach the network.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const SRC = path.join(__dirname, 'jev-ask.js');
const SUITE = path.join(__dirname, 'jev-ask.test.js');

const PATTERNS = ['anthropic-key', 'openai-style-key', 'github-token', 'aws-access-key-id', 'slack-token',
  'google-api-key', 'private-key-block', 'bearer-token', 'jwt', 'secret-assignment'];

const MUTANTS = [
  ['no-key refusal removed', "if (!key) throw new Refusal('no AI_GATEWAY_API_KEY", "if (false) throw new Refusal('no AI_GATEWAY_API_KEY"],
  ['secret scan result ignored', 'if (hits.length) {', 'if (false) {'],
  ['the-key-itself check removed', 'if (key && key.length >= 8 && text.includes(key)) hits.push', 'if (false) hits.push'],
  // Each named pattern neutered on its own: a never-matching regex placed first in its tuple, so `[name, re]` takes it.
  ...PATTERNS.map((p) => [`pattern ${p} never matches`, `['${p}', /`, `['${p}', /(?!)/, /`]),
  ['questions not scanned (instructions)', 'out.push([`questions.${name}.instructions`, q.instructions]);', '/* not scanned */'],
  ['error messages not scrubbed of the key', 'e.message = scrub(e.message, key);', 'e.message = e.message;'],
  ['a non-2xx read as success', 'if (!res.ok) throw', 'if (false) throw'],
  ['a missing answer not detected', 'if (!a) throw new GatewayError(`gateway response has no answer', 'if (false) throw new GatewayError(`gateway response has no answer'],
  ['boolean criteria not required', "if (!ok) throw new Refusal(`${at}: a boolean question needs criteria", "if (false) throw new Refusal(`${at}: a boolean question needs criteria"],
  ['instructions not required', 'if (typeof x.instructions !== \'string\' || !x.instructions.trim()) throw', 'if (false) throw'],
  ['an empty state allowed', "if (typeof state !== 'string' || !state.trim()) throw", "if (typeof state !== 'string') throw"],
  ['--dry sends anyway', 'if (dry) return {', 'if (false) return {'],
  ['the cost dropped', 'cost: gw.cost == null ? null : gw.cost,', 'cost: null,'],
  ['zero data retention sneaks back into the body', 'body: { model: MODEL, state, questions: schema.questions } };',
    "body: { model: MODEL, state, questions: schema.questions, providerOptions: { gateway: { zeroDataRetention: true } } } };"],
  ['a probability outside [0, 1] accepted', ' && a.probability >= 0 && a.probability <= 1', ''],
  ['a choice outside the options accepted', " && a.choice in questions[n].criteria", ''],
  ['the key written into the request body', 'body: JSON.stringify(req.body),', 'body: JSON.stringify({ ...req.body, key }),'],
];

function main() {
  require('./heavy-run.js').hold({ cmd: 'jev-ask.mutants' }); // ONE HEAVY RUNNER PER TREE (L098, heavy-run.js)
  const onlyAt = process.argv.indexOf('--only');
  const only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const src = fs.readFileSync(SRC, 'utf8');
  const suite = fs.readFileSync(SUITE, 'utf8');
  const env = { ...process.env };
  delete env.AI_GATEWAY_API_KEY;
  delete env.JEV_LIVE_SMOKE;
  const runCopy = (text) => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-mut-'));
    try {
      fs.writeFileSync(path.join(d, 'jev-ask.js'), text);
      fs.writeFileSync(path.join(d, 'jev-ask.test.js'), suite);
      const r = spawnSync(process.execPath, ['--test', path.join(d, 'jev-ask.test.js')], { encoding: 'utf8', env });
      const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
      const n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
      return { pass: n('pass'), fail: n('fail') };
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  };
  const control = runCopy(src);
  console.log(`control (unmutated copy)                         pass ${control.pass} fail ${control.fail}`);
  if (!(control.fail === 0 && control.pass > 0)) { console.log('CONTROL NOT GREEN — no mutant result means anything'); process.exitCode = 1; return; }
  let applied = 0, caught = 0, notApplied = 0;
  MUTANTS.forEach(([name, anchor, repl], i) => {
    if (only != null && only !== i + 1) return;
    const hits = src.split(anchor).length - 1;
    const label = `${String(i + 1).padStart(2)} ${name}`.padEnd(49);
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    applied++;
    const r = runCopy(src.replace(anchor, repl));
    const ok = r.fail > 0;
    if (ok) caught++;
    console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? 'CAUGHT' : 'SURVIVED'}`);
  });
  console.log(`\n${applied} applied · ${caught} caught · ${applied - caught} survived · ${notApplied} NOT APPLIED`);
  if (applied - caught > 0 || notApplied > 0) process.exitCode = 1;
}

main();
