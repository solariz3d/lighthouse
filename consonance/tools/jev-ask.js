#!/usr/bin/env node
/* jev-ask.js — the thin client for Jev (TypeSafe AI). P1 of exo_memory/third_place/JEV_PLAN_2026-09-21.md.
 *
 *   node consonance/tools/jev-ask.js --schema <questions.json> --state <file> [--route vercel|openrouter] [--dry] [--ledger <path>]
 *
 * TWO ROUTES, SELECTED EXPLICITLY (D197, exo_memory/loop/plan_jev_openrouter_d162_2026-10-01.md). `--route openrouter` (or `ask({ route: 'openrouter' })`)
 * POSTs to https://openrouter.ai/api/alpha/decisions with the PINNED model `typesafe/jev-1.13` (never an alias), `provider: { data_collection: 'deny' }`,
 * and the key from OPENROUTER_API_KEY ONLY. It translates a `boolean` question to OpenRouter's `noul` and maps the answer back, maps `usage`
 * (input_tokens/output_tokens/cost) and `id` (→ generationId), records the RESOLVED model, and REFUSES (exit 2) if that is not `typesafe/jev-1.13-*`: a
 * route that silently falls back to another model must fail. With no `--route` the route is the old one, `vercel`; nothing switches by which key is present
 * (an OPENROUTER key alone, with no route named, is refused and told to name the route). The Vercel route below is KEPT AS A TRACE: on 2026-09-27 it stopped
 * at the hobby plan's HTTP 403 free-tier gate, 0 answers (handback/p-d162-jev-E_2026-09-27.md); it is not removed because the existing callers
 * (jev-judge, jev-shadow) and their suites speak it.
 *
 * The rest of this header describes the Vercel route as it was written, 2026-09-21; where it says "the Vercel gateway" or AI_GATEWAY_API_KEY it is that route.
 *
 *   (Vercel route, as written 2026-09-21:)
 *
 * ONE CALL FORM, so every call re-derives from two paths (plan §3 P1). The schema file is
 * `{ "questions": { "<name>": { "type": "boolean"|"choice"|"score", "instructions": "...", "criteria": ... } } }`;
 * the state file's text is sent as the `state` string. Output is one JSON object on stdout:
 * `{ model, answers, usage, cost, generationId, ms }`.
 *
 * THE REQUEST IS EXACTLY `{ model, state, questions }`, POSTed to /v1/evaluate. No providerOptions: zero data
 * retention is refused on the hobby plan, and the keeper ruled 2026-09-21 12:55, verbatim, "who cares what they
 * keep, even if they plan on 'stealing' it, it is already open source on github, it is for the people. so they can
 * do whatever they want". The one thing this client still refuses to send is a SECRET (THE SECRET SCAN, below).
 *
 * THE KEY comes from the environment variable AI_GATEWAY_API_KEY and nowhere else. It is never read from or
 * written to a file, never printed, and every error message is scrubbed of it before it leaves this process —
 * including a gateway error body, which is not ours and could echo anything.
 *
 * REFUSALS ARE LOUD (exit 2) and happen BEFORE the network: no key; an empty state; a malformed schema (a boolean
 * question carries `criteria: {true, false}` AND `instructions` — without them the live gateway answered "question
 * must have criteria or instructions", 2026-09-21 12:52); any text matching a secret pattern. A gateway failure
 * (non-2xx, a body that is not JSON, an answer missing for a declared question, an answer of the wrong type) is
 * exit 1, surfaced once, never retried silently.
 *
 * THE LEDGER IS OPT-IN (`--ledger <path>`), and that departs from the plan, which put it under CONSONANCE_DATA by
 * default. `consonance/state-manifest.json` has no rule for such a file, and an unplaced data-dir file makes
 * `close.js --check` refuse (REFUSED_UNPLACED, L066). A default location needs A's manifest row first. A row
 * carries hashes and counts only: never the state, never a question's text, never the key.
 *
 * WHAT THIS CANNOT SEE.
 *  · A secret the patterns do not describe. They are ENUMERATED, not closed: a token format born tomorrow passes.
 *    The one exact check is the key's own value. Everything else is a shape.
 *  · Personal or private text that is not a credential. The keeper's ruling is that room text may be sent; this
 *    client does not judge what else should not be.
 *  · Whether the answer is RIGHT. It checks the answer's shape against the question, not its truth. Jev is a Tier 2
 *    scorer (plan §2): a rate with a denominator, never a verdict.
 *  · Which model version ran. The gateway returns the id it was asked for (vercel/ai #21213); `model` is recorded as
 *    returned, and drift is the controls' job (plan §4), not this file's.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const URL_EVALUATE = 'https://ai-gateway.vercel.sh/v1/evaluate';
const MODEL = 'typesafe-ai/jev';           // GET /v1/models, 2026-09-21: the aliases (jev-latest, ...) 404 here
// D197 (plan_jev_openrouter_d162_2026-10-01.md): the OpenRouter route. The model is the PINNED version, never '~typesafe/jev-latest'; the throwaway call of
// 2026-10-01 resolved it to typesafe/jev-1.13-20260917. A response whose model is not typesafe/jev-1.13-<suffix> is refused.
const URL_OPENROUTER = 'https://openrouter.ai/api/alpha/decisions';
const MODEL_OPENROUTER = 'typesafe/jev-1.13';
const RESOLVED_OPENROUTER = /^typesafe\/jev-1\.13-[A-Za-z0-9._-]+$/;
const ROUTES = {
  vercel: { name: 'vercel', url: URL_EVALUATE, keyVar: 'AI_GATEWAY_API_KEY', model: MODEL },
  openrouter: { name: 'openrouter', url: URL_OPENROUTER, keyVar: 'OPENROUTER_API_KEY', model: MODEL_OPENROUTER },
};
const DEFAULT_ROUTE = 'vercel';
/** The route record for a name; an unknown name is refused, never defaulted. */
function routeOf(name) {
  const r = name === undefined ? ROUTES[DEFAULT_ROUTE] : Object.prototype.hasOwnProperty.call(ROUTES, name) ? ROUTES[name] : null;
  if (!r) throw new Refusal(`unknown route ${JSON.stringify(name)} — the routes are ${Object.keys(ROUTES).join(' | ')}`);
  return r;
}
const TIMEOUT_MS = 30000;
const TYPES = new Set(['boolean', 'choice', 'score']);

class Refusal extends Error { constructor(m) { super(m); this.exitCode = 2; } }
class GatewayError extends Error { constructor(m) { super(m); this.exitCode = 1; } }

/* THE SECRET SCAN. Each pattern is named, so a refusal says WHICH shape matched and WHERE, and never prints the
 * match. Plus one exact check that needs no pattern: the key's own value. */
const SECRET_PATTERNS = [
  ['openrouter-key', /\bsk-or-[A-Za-z0-9_-]{16,}/],            // D197: the OpenRouter key shape, named so a refusal says which
  ['vercel-gateway-key', /\bvck_[A-Za-z0-9_-]{16,}/],           // and the Vercel AI Gateway one
  ['anthropic-key', /sk-ant-[A-Za-z0-9_-]{20,}/],
  ['openai-style-key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}/],
  ['github-token', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}|\bgithub_pat_[A-Za-z0-9_]{22,}/],
  ['aws-access-key-id', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ['slack-token', /\bxox[abposr]-[A-Za-z0-9-]{10,}/],
  ['google-api-key', /\bAIza[0-9A-Za-z_-]{35}/],
  ['private-key-block', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['bearer-token', /\bBearer\s+[A-Za-z0-9._~+/-]{20,}/i],
  ['jwt', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  // A NAME that says secret, ASSIGNED a value long enough to be one: `AI_GATEWAY_API_KEY=<60 chars>`. The bare name
  // in prose ("the key lives in AI_GATEWAY_API_KEY") has no value after it and does not match.
  ['secret-assignment', /\b[A-Za-z0-9_]*(?:API_KEY|APIKEY|SECRET|TOKEN|PASSWORD)\s*[:=]\s*["']?[A-Za-z0-9_\-/+=.]{16,}/i],
];

/** Every string that would leave this machine, with where it sits, for the scan. */
function outgoingTexts(state, questions) {
  const out = [['state', typeof state === 'string' ? state : JSON.stringify(state)]];
  for (const [name, q] of Object.entries(questions || {})) {
    out.push([`questions.${name} (name)`, name]);
    if (q && typeof q.instructions === 'string') out.push([`questions.${name}.instructions`, q.instructions]);
    if (q && q.criteria != null) out.push([`questions.${name}.criteria`, JSON.stringify(q.criteria)]);
  }
  return out;
}

/** [{ where, pattern }] for every match. Never the matched text. `key` is one key value or an array of them (both routes' keys are checked on either route). */
function findSecrets(state, questions, key) {
  const hits = [], keys = (Array.isArray(key) ? key : [key]).filter((k) => k && k.length >= 8);
  for (const [where, text] of outgoingTexts(state, questions)) {
    if (keys.some((k) => text.includes(k))) hits.push({ where, pattern: 'the-key-itself' });
    for (const [name, re] of SECRET_PATTERNS) if (re.test(text)) hits.push({ where, pattern: name });
  }
  return hits;
}

/** Every message leaves scrubbed of the key's own value (`keyVar` names it in the placeholder) AND of any token that has a key's SHAPE (sk-or-…, vck_…), so a gateway body that echoes something key-shaped cannot print it. */
const KEY_SHAPES = [/\bsk-or-[A-Za-z0-9_-]{16,}/g, /\bvck_[A-Za-z0-9_-]{16,}/g];
function scrub(msg, key, keyVar = 'AI_GATEWAY_API_KEY') {
  let m = String(msg);
  for (const k of (Array.isArray(key) ? key : [key])) if (k && k.length >= 8) m = m.split(k).join(`<${keyVar}>`);
  for (const re of KEY_SHAPES) m = m.replace(re, '<redacted key-shaped token>');
  return m;
}

/** The schema, checked BEFORE any network. Throws Refusal naming the first defect. */
function validateSchema(schema) {
  const q = schema && schema.questions;
  if (!q || typeof q !== 'object' || Array.isArray(q)) {
    throw new Refusal('schema: "questions" must be an object keyed by question name (the gateway keys answers the same way)');
  }
  const names = Object.keys(q);
  if (!names.length) throw new Refusal('schema: "questions" is empty — a call with nothing to ask');
  for (const name of names) {
    const x = q[name];
    const at = `schema: question "${name}"`;
    if (!/^[A-Za-z_][A-Za-z0-9_]{0,63}$/.test(name)) throw new Refusal(`${at}: the name must be an identifier`);
    if (!x || !TYPES.has(x.type)) throw new Refusal(`${at}: type must be one of ${[...TYPES].join('|')}`);
    if (typeof x.instructions !== 'string' || !x.instructions.trim()) throw new Refusal(`${at}: "instructions" is required`);
    const c = x.criteria;
    if (x.type === 'boolean') {
      const ok = c && typeof c === 'object' && !Array.isArray(c)
        && Object.keys(c).sort().join() === 'false,true'
        && typeof c.true === 'string' && c.true.trim() && typeof c.false === 'string' && c.false.trim();
      if (!ok) throw new Refusal(`${at}: a boolean question needs criteria {"true": "...", "false": "..."} — the live gateway refuses one without`);
    } else if (x.type === 'choice') {
      const ok = c && typeof c === 'object' && !Array.isArray(c) && Object.keys(c).length >= 2
        && Object.values(c).every((v) => typeof v === 'string' && v.trim());
      if (!ok) throw new Refusal(`${at}: a choice question needs criteria {option: description} with at least two options`);
    } else if (!Array.isArray(c) || c.length < 2 || !c.every((v) => typeof v === 'string' && v.trim())) {
      throw new Refusal(`${at}: a score question needs criteria as an array of at least two labels, lowest first`);
    }
  }
  return names;
}

/* PACING (D107). A judge pass sent up to 25 calls back to back, the shadow its own batch beside it, and BOTH machines
 * use one key; D's runner.log showed 13 429s beside 20 503s (2026-09-22). So every call through ask() is spaced and
 * a 429 pushes the next call back.
 *
 * THE NUMBERS ARE DEFAULTS, NOT A LIMIT ANYONE PUBLISHED. Vercel's own page, https://vercel.com/docs/ai-gateway/rate-limits
 * (last updated 2026-09-08, read 2026-09-22), says "Limits can change, so this page describes behavior rather than
 * fixed numbers": no RPM, no concurrency figure, per model on the free tier, none on the paid tier. What it does say
 * is followed here: "Some 429 responses include a retry-after header with the number of seconds to wait. Honor it when
 * it is present", "back off exponentially otherwise", "Keep retries bounded". So: a 2 s gap between the END of one
 * call and the start of the next (a real call measured 336 ms median, 1,231 ms max over 88 ok rows, so 25 calls take
 * ~60 s, well inside the 10-minute cadence); on a 429, Retry-After (seconds or an HTTP-date) when parseable, else
 * 5 s doubling per consecutive 429, capped at 60 s, reset by any non-429 answer.
 *
 * A 429 IS NOT RETRIED HERE. ask() still makes one call and surfaces its failure once (the header's rule); the item
 * stays skip-and-retry in the caller (L078/L079). Only the NEXT call waits. A wait longer than 120 s is not slept on
 * inside a pass: the call is refused UNSENT with "HTTP 429 … not sent", which both callers' transientStatus read
 * as a 429 skip, so the rest of the pass is deferred to the next cadence instead of stalling it.
 *
 * WHO IS PACED. The real fetch gets ONE module-level pacer, so the judge and the shadow, which run in the same runner
 * process and both call ask(), share one spacing. A stubbed fetch gets none unless a test passes one: a stub has no
 * rate limit, and the suites must not sleep. WHAT THIS CANNOT DO: pace the OTHER machine. L and D share the key and
 * each paces only itself. */
const DEFAULT_GAP_MS = 2000;
const DEFAULT_BASE_BACKOFF_MS = 5000;
const DEFAULT_MAX_BACKOFF_MS = 60000;
const DEFAULT_MAX_WAIT_MS = 120000;

/** Retry-After in ms from delta-seconds or an HTTP-date, or null when absent or unparseable. */
function retryAfterMs(value, nowMs) {
  if (value == null) return null;
  const v = String(value).trim();
  if (/^\d+$/.test(v)) return Number(v) * 1000;
  const at = Date.parse(v);
  return Number.isFinite(at) && /[A-Za-z]/.test(v) ? Math.max(0, at - nowMs) : null;
}

function createPacer({ gapMs = DEFAULT_GAP_MS, baseBackoffMs = DEFAULT_BASE_BACKOFF_MS, maxBackoffMs = DEFAULT_MAX_BACKOFF_MS,
  maxWaitMs = DEFAULT_MAX_WAIT_MS, now = Date.now, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  let lastEnd = null, notBefore = 0, run429 = 0;
  return {
    gapMs,
    /** Wait until this call may go. Refuses UNSENT (as a 429 skip) when the wait is longer than a pass should stall. */
    async before() {
      const t = now();
      const due = Math.max(lastEnd == null ? t : lastEnd + gapMs, notBefore);
      const wait = due - t;
      if (wait > maxWaitMs) {
        throw new GatewayError(`gateway returned HTTP 429 earlier: the next call is deferred ${Math.ceil(wait / 1000)} s `
          + `(over the ${maxWaitMs / 1000} s in-pass cap) — not sent, retried next cadence`);
      }
      if (wait > 0) await sleep(wait);
    },
    /** After a call. `status` is null when no response came back. */
    after(status, headers) {
      const t = now();
      lastEnd = t;
      if (status !== 429) { run429 = 0; return; }
      run429 += 1;
      const ra = retryAfterMs(headers && typeof headers.get === 'function' ? headers.get('retry-after') : null, t);
      notBefore = t + (ra != null ? ra : Math.min(maxBackoffMs, baseBackoffMs * 2 ** (run429 - 1)));
    },
  };
}

const SHARED_PACER = createPacer();
/** The real gateway is paced by the one shared pacer; a stubbed fetch is not (it has no rate limit to respect). */
const defaultPacerFor = (fetchImpl) => (fetchImpl === globalThis.fetch ? SHARED_PACER : null);

/** The questions as the OpenRouter route sends them: jev-ask's `boolean` is OpenRouter's `noul`; every other field is the schema's own. */
function toOpenRouterQuestions(questions) {
  return Object.fromEntries(Object.entries(questions).map(([n, q]) => [n, q.type === 'boolean' ? { ...q, type: 'noul' } : q]));
}
/** The exact request. The key is not in it: the caller adds the header, so a printed request cannot carry it. */
function buildRequest(schema, state, route = 'vercel') {
  const r = routeOf(route);
  if (r.name === 'openrouter') {
    return { url: r.url, body: { model: r.model, state, questions: toOpenRouterQuestions(schema.questions), provider: { data_collection: 'deny' } } };
  }
  return { url: URL_EVALUATE, body: { model: MODEL, state, questions: schema.questions } };
}

/** OpenRouter's answers in jev-ask's shape: a `noul` answer ({ type: 'noul', noul: p }) becomes { type: 'boolean', probability: p }; choice and score pass through. */
function fromOpenRouterAnswers(names, questions, answers) {
  if (!answers || typeof answers !== 'object') throw new GatewayError('gateway response has no "answers" object');
  const out = {};
  for (const [n, a] of Object.entries(answers)) {
    if (a && a.type === 'noul') {
      out[n] = { type: 'boolean', probability: a.noul };
    } else out[n] = a;
  }
  return out;
}

/** An answer must exist for every declared question and match its type. Throws GatewayError naming the first gap. */
function checkAnswers(names, questions, answers) {
  if (!answers || typeof answers !== 'object') throw new GatewayError('gateway response has no "answers" object');
  for (const n of names) {
    const a = answers[n];
    if (!a) throw new GatewayError(`gateway response has no answer for declared question "${n}"`);
    const t = questions[n].type;
    if (a.type && a.type !== t) throw new GatewayError(`answer "${n}" is type ${a.type}, the question is ${t}`);
    if (t === 'boolean' && !(typeof a.probability === 'number' && a.probability >= 0 && a.probability <= 1)) {
      throw new GatewayError(`answer "${n}": a boolean answer must carry a probability in [0, 1]`);
    }
    if (t === 'choice' && !(typeof a.choice === 'string' && a.choice in questions[n].criteria)) {
      throw new GatewayError(`answer "${n}": the choice is not one of the declared options`);
    }
    if (t === 'score' && typeof a.score !== 'number') throw new GatewayError(`answer "${n}": a score answer must carry a number`);
  }
}

/**
 * One call. `env` and `fetchImpl` are the boundary seams (tests stub fetch; nothing below it is mocked).
 * Returns { model, answers, usage, cost, generationId, ms } — or { dry: true, request } with `dry`.
 */
async function ask({ schema, state, env = process.env, fetchImpl = globalThis.fetch, dry = false, now = Date.now, pacer, route }) {
  if (pacer === undefined) pacer = defaultPacerFor(fetchImpl);
  const keys = { vercel: (env.AI_GATEWAY_API_KEY || '').trim(), openrouter: (env.OPENROUTER_API_KEY || '').trim() };
  const allKeys = [keys.vercel, keys.openrouter].filter(Boolean);
  let rt = null, key = '';
  try {
    rt = routeOf(route);
    key = keys[rt.name];   // the route's own key, from its own variable: never the other route's
    // scrub below uses BOTH values: whichever key is present must not leave in a message
    if (typeof state !== 'string' || !state.trim()) throw new Refusal('state is empty — refusing to ask about nothing');
    const names = validateSchema(schema);
    const hits = findSecrets(state, schema.questions, allKeys);
    if (hits.length) {
      throw new Refusal('refusing to send: the outgoing text matches a secret pattern — '
        + hits.map((h) => `${h.pattern} in ${h.where}`).join('; ') + '. The matched text is not printed.');
    }
    const req = buildRequest(schema, state, rt.name);
    if (dry) return { dry: true, route: rt.name, request: { ...req, headers: { Authorization: `Bearer <from env ${rt.keyVar}, not printed>`, 'Content-Type': 'application/json' } } };
    if (!key) {
      const other = rt.name === 'vercel' && keys.openrouter && route === undefined ? ' (OPENROUTER_API_KEY is set: name the route, --route openrouter, nothing switches by itself)' : '';
      throw new Refusal(`no ${rt.keyVar} in the environment — refusing (the key is read from the environment only, never from a file)${other}`);
    }
    if (typeof fetchImpl !== 'function') throw new Refusal('no fetch available — Node 18+ has it built in');

    if (pacer) await pacer.before();
    const t0 = now();
    let res;
    try {
      res = await fetchImpl(req.url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (e) {
      if (pacer) pacer.after(null);
      throw new GatewayError(`request failed before a response: ${e && e.message}`);
    }
    if (pacer) pacer.after(res.status, res.headers);
    const text = await res.text();
    if (!res.ok) throw new GatewayError(`gateway returned HTTP ${res.status}: ${text.slice(0, 500)}`);
    let body;
    try { body = JSON.parse(text); } catch { throw new GatewayError(`gateway returned HTTP ${res.status} with a body that is not JSON`); }
    if (rt.name === 'openrouter') {
      // THE RESOLVED MODEL IS CHECKED BEFORE ANYTHING IS READ AS AN ANSWER: a route that falls back to another model must fail, and its answers are not returned.
      if (typeof body.model !== 'string' || !RESOLVED_OPENROUTER.test(body.model)) {
        throw new Refusal(`REFUSING the response: the resolved model is ${JSON.stringify(body.model == null ? null : String(body.model).slice(0, 80))}, not typesafe/jev-1.13-* (generation ${body.id == null ? 'unknown' : String(body.id).slice(0, 60)}); its answers are discarded`);
      }
      const answers = fromOpenRouterAnswers(names, schema.questions, body.answers);
      checkAnswers(names, schema.questions, answers);
      const u = body.usage && typeof body.usage === 'object' ? body.usage : null;
      return {
        route: 'openrouter',
        model: body.model,
        provider: body.provider == null ? null : body.provider,
        answers,
        usage: u ? { inputTokens: u.input_tokens == null ? null : u.input_tokens, outputTokens: u.output_tokens == null ? null : u.output_tokens, cost: typeof u.cost === 'number' ? u.cost : null } : null,
        cost: u && u.cost != null ? String(u.cost) : null,         // a string, like the Vercel route's; null means NOT REPORTED
        generationId: body.id == null ? null : body.id,
        ms: now() - t0,
      };
    }
    checkAnswers(names, schema.questions, body.answers);
    const gw = (body.providerMetadata && body.providerMetadata.gateway) || {};
    return {
      model: body.model == null ? null : body.model,
      answers: body.answers,
      usage: body.usage == null ? null : body.usage,
      cost: gw.cost == null ? null : gw.cost,          // a string, as the gateway sends it; null means NOT REPORTED
      generationId: gw.generationId == null ? null : gw.generationId,
      ms: now() - t0,
    };
  } catch (e) {
    // Every message leaves scrubbed of the key (both routes' keys) and of key-shaped tokens, whatever produced it.
    e.message = scrub(e.message, allKeys, rt ? rt.keyVar : 'AI_GATEWAY_API_KEY');
    throw e;
  }
}

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

function ledgerRow(result, schemaText, stateText, now = new Date()) {
  return {
    ts: now.toISOString(), schema_sha256: sha(schemaText), state_sha256: sha(stateText), route: result.route || 'vercel',
    model: result.model, generationId: result.generationId,
    inputTokens: result.usage ? result.usage.inputTokens : null,
    outputTokens: result.usage ? result.usage.outputTokens : null,
    cost: result.cost, ms: result.ms,
  };
}

function parseArgs(argv) {
  const a = { dry: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--dry') a.dry = true;
    else if (k === '--schema' || k === '--state' || k === '--ledger' || k === '--route') {
      const v = argv[++i];
      if (!v) throw new Refusal(`${k} needs a path`);
      a[k.slice(2)] = v;
    } else throw new Refusal(`unknown argument ${JSON.stringify(k)} — usage: --schema <file> --state <file> [--route vercel|openrouter] [--dry] [--ledger <path>]`);
  }
  if (!a.schema || !a.state) throw new Refusal('usage: --schema <file> --state <file> [--dry] [--ledger <path>] — both paths are required, so every call re-derives');
  return a;
}

async function main(argv = process.argv.slice(2), env = process.env) {
  const keys = [(env.AI_GATEWAY_API_KEY || '').trim(), (env.OPENROUTER_API_KEY || '').trim()].filter(Boolean);
  try {
    const a = parseArgs(argv);
    const schemaText = fs.readFileSync(a.schema, 'utf8');
    let schema;
    try { schema = JSON.parse(schemaText); } catch (e) { throw new Refusal(`schema ${a.schema} is not JSON: ${e.message}`); }
    const stateText = fs.readFileSync(a.state, 'utf8');
    const r = await ask({ schema, state: stateText, env, dry: a.dry, route: a.route });
    if (a.ledger && !r.dry) {
      fs.mkdirSync(path.dirname(path.resolve(a.ledger)), { recursive: true });
      fs.appendFileSync(a.ledger, JSON.stringify(ledgerRow(r, schemaText, stateText)) + '\n');
    }
    process.stdout.write(scrub(JSON.stringify(r, null, 2), keys) + '\n');   // the printed result is scrubbed too: a stored result carries no key
    return 0;
  } catch (e) {
    process.stderr.write(`jev-ask: ${e instanceof Refusal ? 'REFUSED' : 'FAILED'} — ${scrub(e.message, keys)}\n`);
    return e.exitCode || 1;
  }
}

module.exports = { ask, validateSchema, findSecrets, buildRequest, checkAnswers, ledgerRow, parseArgs, scrub,
  createPacer, defaultPacerFor, retryAfterMs, DEFAULT_GAP_MS, routeOf, toOpenRouterQuestions, fromOpenRouterAnswers,
  SECRET_PATTERNS, MODEL, URL_EVALUATE, MODEL_OPENROUTER, URL_OPENROUTER, RESOLVED_OPENROUTER, ROUTES, DEFAULT_ROUTE, Refusal, GatewayError };

if (require.main === module) main().then((code) => { process.exitCode = code; });
