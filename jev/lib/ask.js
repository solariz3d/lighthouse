'use strict';
/* jev/lib/ask.js — one question to Jev (TypeSafe AI) through the Vercel AI Gateway. Vendored from the room's
 * consonance/tools/jev-ask.js (L114, standalone Jev batch 1): the secret scan, the scrub and the pacer come over
 * as they were; the CLI, the schema file and the ledger do not (the judge writes its own row).
 *
 * THE CONTRACT (exo_memory/loop/jev_standalone_design_2026-09-23.md, batch 1):
 *
 *   ask({ state, questions, key }) → { choice, confidence, probabilities, reason, model, usage }
 *
 * `questions` is the gateway's questions object and must hold EXACTLY ONE question, of type `choice`: the contract
 * returns one choice, so a second question would be asked and silently dropped. Optional seams beyond the contract:
 * `gateway` ({ url, model }, the config's; defaults below), `fetchImpl` (tests stub it), `pacer`, `now`.
 *
 * THE KEY IS THE CALLER'S. ask() never reads the environment: the caller reads AI_GATEWAY_API_KEY and passes it in.
 * A missing key is a LOUD Refusal before anything else, never a silent skip. The key is never printed, and every
 * error that leaves ask() is scrubbed of it — including a gateway error body, which is not ours and could echo anything.
 *
 * `reason` IS WHAT THE GATEWAY GAVE, OR null. Measured on the room's 527 stored rows (2026-09-23): a choice answer
 * carries { type, choice, confidence, probabilities } and no reason at all. ask() does not invent one.
 *
 * REFUSALS (class Refusal) happen BEFORE the network: no key; an empty state; a questions object that is not one
 * well-formed choice question; any outgoing text matching a secret pattern. A gateway failure (class GatewayError:
 * non-2xx, a body that is not JSON, no answer, an answer outside the declared options) is surfaced once, never retried.
 *
 * WHAT THIS CANNOT SEE.
 *  · A secret the patterns do not describe. They are ENUMERATED, not closed: a token format born tomorrow passes.
 *    The one exact check is the key's own value. Everything else is a shape.
 *  · Personal or private text that is not a credential. The scan refuses secrets; it does not judge what else should
 *    stay home. Installing Jev is consenting to send judged turns to the gateway (the design's disclosure).
 *  · Whether the answer is RIGHT. It checks the answer's shape against the question, not its truth.
 *  · Which model version ran. `model` is recorded as the gateway returned it.
 *  · Another PROCESS's calls. The pacer spaces calls inside one process. The Stop hook runs one child process per
 *    turn, so two sessions finishing together are not spaced against each other; a 429 then fails that one call.
 */
const URL_EVALUATE = 'https://ai-gateway.vercel.sh/v1/evaluate';
const MODEL = 'typesafe-ai/jev';
const TIMEOUT_MS = 30000;

class Refusal extends Error { constructor(m) { super(m); this.name = 'Refusal'; } }
class GatewayError extends Error {
  constructor(m, status = null) { super(m); this.name = 'GatewayError'; this.status = status; }
}

/* THE SECRET SCAN — verbatim from the room's jev-ask.js. Each pattern is named, so a refusal says WHICH shape
 * matched and WHERE, and never prints the match. Plus one exact check that needs no pattern: the key's own value. */
const SECRET_PATTERNS = [
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

/** [{ where, pattern }] for every match. Never the matched text. */
function findSecrets(state, questions, key) {
  const hits = [];
  for (const [where, text] of outgoingTexts(state, questions)) {
    if (key && key.length >= 8 && text.includes(key)) hits.push({ where, pattern: 'the-key-itself' });
    for (const [name, re] of SECRET_PATTERNS) if (re.test(text)) hits.push({ where, pattern: name });
  }
  return hits;
}

const scrub = (msg, key) => (key && key.length >= 8 ? String(msg).split(key).join('<AI_GATEWAY_API_KEY>') : String(msg));

/** Exactly one well-formed choice question. Returns its name; throws Refusal naming the first defect. */
function validateQuestions(questions) {
  if (!questions || typeof questions !== 'object' || Array.isArray(questions)) {
    throw new Refusal('questions must be an object keyed by question name (the gateway keys answers the same way)');
  }
  const names = Object.keys(questions);
  if (names.length !== 1) {
    throw new Refusal(`questions must hold exactly one question — the contract returns one choice; got ${names.length}`);
  }
  const name = names[0];
  const x = questions[name];
  const at = `question "${name}"`;
  if (!/^[A-Za-z_][A-Za-z0-9_]{0,63}$/.test(name)) throw new Refusal(`${at}: the name must be an identifier`);
  if (!x || x.type !== 'choice') throw new Refusal(`${at}: type must be "choice"`);
  if (typeof x.instructions !== 'string' || !x.instructions.trim()) throw new Refusal(`${at}: "instructions" is required`);
  const c = x.criteria;
  const ok = c && typeof c === 'object' && !Array.isArray(c) && Object.keys(c).length >= 2
    && Object.values(c).every((v) => typeof v === 'string' && v.trim());
  if (!ok) throw new Refusal(`${at}: a choice question needs criteria {option: description} with at least two options`);
  return name;
}

/* PACING — verbatim from the room's jev-ask.js (D107), where the reasons and the source of every number are stated:
 * a 2 s gap between the END of one call and the start of the next; on a 429, Retry-After when parseable, else 5 s
 * doubling per consecutive 429, capped at 60 s; a wait over 120 s is refused UNSENT as a 429. A 429 is not retried
 * here. The real fetch gets ONE module-level pacer; a stubbed fetch gets none unless a test passes one. */
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
    /** Wait until this call may go. Refuses UNSENT (as a 429) when the wait is longer than a pass should stall. */
    async before() {
      const t = now();
      const due = Math.max(lastEnd == null ? t : lastEnd + gapMs, notBefore);
      const wait = due - t;
      if (wait > maxWaitMs) {
        throw new GatewayError(`gateway returned HTTP 429 earlier: the next call is deferred ${Math.ceil(wait / 1000)} s `
          + `(over the ${maxWaitMs / 1000} s cap) — not sent`, 429);
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
const defaultPacerFor = (fetchImpl) => (fetchImpl === globalThis.fetch ? SHARED_PACER : null);

/** The answer for the one question, checked against its options. Throws GatewayError naming the gap. */
function checkAnswer(name, question, answers) {
  if (!answers || typeof answers !== 'object') throw new GatewayError('gateway response has no "answers" object');
  const a = answers[name];
  if (!a) throw new GatewayError(`gateway response has no answer for declared question "${name}"`);
  if (a.type && a.type !== 'choice') throw new GatewayError(`answer "${name}" is type ${a.type}, the question is choice`);
  if (!(typeof a.choice === 'string' && Object.prototype.hasOwnProperty.call(question.criteria, a.choice))) {
    throw new GatewayError(`answer "${name}": the choice is not one of the declared options`);
  }
  return a;
}

async function ask({ state, questions, key, gateway = {}, fetchImpl = globalThis.fetch, pacer, now = Date.now } = {}) {
  if (pacer === undefined) pacer = defaultPacerFor(fetchImpl);
  const k = typeof key === 'string' ? key.trim() : '';
  try {
    if (!k) throw new Refusal('no key — the caller must pass AI_GATEWAY_API_KEY from the environment; refusing before anything is sent');
    if (typeof state !== 'string' || !state.trim()) throw new Refusal('state is empty — refusing to ask about nothing');
    const name = validateQuestions(questions);
    const hits = findSecrets(state, questions, k);
    if (hits.length) {
      throw new Refusal('refusing to send: the outgoing text matches a secret pattern — '
        + hits.map((h) => `${h.pattern} in ${h.where}`).join('; ') + '. The matched text is not printed.');
    }
    if (typeof fetchImpl !== 'function') throw new Refusal('no fetch available — Node 18+ has it built in');
    const url = gateway.url || URL_EVALUATE;
    const model = gateway.model || MODEL;

    if (pacer) await pacer.before();
    let res;
    try {
      res = await fetchImpl(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${k}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, state, questions }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (e) {
      if (pacer) pacer.after(null);
      throw new GatewayError(`request failed before a response: ${e && e.message}`);
    }
    if (pacer) pacer.after(res.status, res.headers);
    const text = await res.text();
    if (!res.ok) throw new GatewayError(`gateway returned HTTP ${res.status}: ${text.slice(0, 500)}`, res.status);
    let body;
    try { body = JSON.parse(text); } catch { throw new GatewayError(`gateway returned HTTP ${res.status} with a body that is not JSON`, res.status); }
    const a = checkAnswer(name, questions[name], body.answers);
    return {
      choice: a.choice,
      confidence: typeof a.confidence === 'number' && a.confidence >= 0 && a.confidence <= 1 ? a.confidence : null,   // D123: the gateway's own number, never derived from probabilities
      probabilities: a.probabilities && typeof a.probabilities === 'object' ? a.probabilities : null,
      reason: typeof a.reason === 'string' ? a.reason : null,
      model: body.model == null ? null : body.model,
      usage: body.usage == null ? null : body.usage,
    };
  } catch (e) {
    // Every message leaves scrubbed of the key, whatever produced it.
    e.message = scrub(e.message, k);
    throw e;
  }
}

module.exports = { ask, validateQuestions, findSecrets, scrub, createPacer, defaultPacerFor, retryAfterMs,
  SECRET_PATTERNS, MODEL, URL_EVALUATE, Refusal, GatewayError };
