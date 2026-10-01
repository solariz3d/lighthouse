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
// catch). The suite runs with AI_GATEWAY_API_KEY, OPENROUTER_API_KEY and JEV_LIVE_SMOKE removed from its environment, so no mutant can
// reach the network (and D197's tests mock fetch with fake keys).

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const SRC = path.join(__dirname, 'jev-ask.js');
const SUITE = path.join(__dirname, 'jev-ask.test.js');

const PATTERNS = ['openrouter-key', 'vercel-gateway-key', 'anthropic-key', 'openai-style-key', 'github-token', 'aws-access-key-id', 'slack-token',
  'google-api-key', 'private-key-block', 'bearer-token', 'jwt', 'secret-assignment'];

const MUTANTS = [
  ['no-key refusal removed (either route)', 'if (!key) {\n      const other', 'if (false) {\n      const other'],
  ['secret scan result ignored', 'if (hits.length) {', 'if (false) {'],
  ['the-key-itself check removed', 'if (keys.some((k) => text.includes(k))) hits.push', 'if (false) hits.push'],
  // Each named pattern neutered on its own: a never-matching regex placed first in its tuple, so `[name, re]` takes it.
  ...PATTERNS.map((p) => [`pattern ${p} never matches`, `['${p}', /`, `['${p}', /(?!)/, /`]),
  ['questions not scanned (instructions)', 'out.push([`questions.${name}.instructions`, q.instructions]);', '/* not scanned */'],
  ['error messages not scrubbed of the key', "e.message = scrub(e.message, allKeys, rt ? rt.keyVar : 'AI_GATEWAY_API_KEY');", 'e.message = e.message;'],
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
  // ---- D197: the OpenRouter route ----
  ['openrouter: the model is an alias, not the pin', "const MODEL_OPENROUTER = 'typesafe/jev-1.13';", "const MODEL_OPENROUTER = '~typesafe/jev-latest';"],
  ['openrouter: data_collection dropped from the request', ", provider: { data_collection: 'deny' } } };", ' } };'],
  ['openrouter: data_collection allow', "provider: { data_collection: 'deny' } } };", "provider: { data_collection: 'allow' } } };"],
  ['openrouter: a boolean question is not translated to noul', "q.type === 'boolean' ? { ...q, type: 'noul' } : q", "q.type === 'boolean' ? q : q"],
  ['openrouter: a noul answer is not mapped to a boolean probability', "out[n] = { type: 'boolean', probability: a.noul };", 'out[n] = a;'],
  ['openrouter: the resolved-model check removed', "if (typeof body.model !== 'string' || !RESOLVED_OPENROUTER.test(body.model)) {", 'if (false) {'],
  ['openrouter: the resolved-model pattern loosened to any typesafe/jev-', 'const RESOLVED_OPENROUTER = /^typesafe\\/jev-1\\.13-[A-Za-z0-9._-]+$/;', 'const RESOLVED_OPENROUTER = /^typesafe\\/jev-/;'],
  ['openrouter: a wrong resolved model is a GatewayError (exit 1), not a Refusal (exit 2)', 'throw new Refusal(`REFUSING the response', 'throw new GatewayError(`REFUSING the response'],
  ['openrouter: the recorded model is the one asked for, not the resolved one', 'model: body.model,\n        provider:', 'model: MODEL_OPENROUTER,\n        provider:'],
  ['openrouter: the id is not mapped to generationId', 'generationId: body.id == null ? null : body.id,', 'generationId: null,'],
  ['openrouter: usage tokens not mapped', 'inputTokens: u.input_tokens == null ? null : u.input_tokens,', 'inputTokens: null,'],
  ['openrouter: the cost dropped', 'cost: u && u.cost != null ? String(u.cost) : null,', 'cost: null,'],
  ['openrouter: a missing usage cost read as zero', "cost: typeof u.cost === 'number' ? u.cost : null }", "cost: typeof u.cost === 'number' ? u.cost : 0 }"],
  ['route: the default becomes openrouter (a silent switch)', "const DEFAULT_ROUTE = 'vercel';", "const DEFAULT_ROUTE = 'openrouter';"],
  ['route: an unknown route is defaulted instead of refused', '? ROUTES[name] : null;', '? ROUTES[name] : ROUTES.vercel;'],
  ['route: the openrouter route falls back to the other key', 'key = keys[rt.name];', 'key = keys[rt.name] || keys.vercel;'],
  ['route: the hint to name the route removed', "keys.openrouter && route === undefined ?", 'false ?'],
  ['secrets: only the route\'s own key is scanned for in the outgoing text', 'const hits = findSecrets(state, schema.questions, allKeys);', 'const hits = findSecrets(state, schema.questions, key);'],
  ['secrets: error messages scrub only the route\'s own key', 'e.message = scrub(e.message, allKeys,', 'e.message = scrub(e.message, key,'],
  ['secrets: key-shaped tokens are not redacted from a message', "for (const re of KEY_SHAPES) m = m.replace(re, '<redacted key-shaped token>');", ''],
  ['dry: the placeholder names the wrong variable', 'Bearer <from env ${rt.keyVar}, not printed>', 'Bearer <from env AI_GATEWAY_API_KEY, not printed>'],
  ['ledger: the route is not recorded', "route: result.route || 'vercel',", ''],
];

function main() {
  require('./heavy-run.js').hold({ cmd: 'jev-ask.mutants' }); // ONE HEAVY RUNNER PER TREE (L098, heavy-run.js)
  const onlyAt = process.argv.indexOf('--only');
  const only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const src = fs.readFileSync(SRC, 'utf8');
  const suite = fs.readFileSync(SUITE, 'utf8');
  const env = { ...process.env };
  delete env.AI_GATEWAY_API_KEY;
  delete env.OPENROUTER_API_KEY;
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
