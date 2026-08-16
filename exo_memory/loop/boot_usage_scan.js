#!/usr/bin/env node
// boot_usage_scan.js — which of BOOT's coined phrases has anyone ever actually SAID?
//
// WHY IT EXISTS. boot_refactor_registration.md registers its falsifier as "re-run this scan one
// season after v2 ships." The scan was originally ad-hoc node in a scratchpad and the registration
// cited a filename that did not exist — a falsifier that could not be executed, which is the exact
// failure class this repo keeps finding. Written 2026-08-16 to make the falsifier runnable.
//
// THE SEPARABILITY THAT MAKES IT VALID. BOOT sits in the chair's context every turn, so its text
// appears in the chair's transcript by construction. Verified before the first run: BOOT's text
// lives in system/context records, live invocations live in user/assistant MESSAGE CONTENT, and the
// two are separable (probe "holding an inch back": 7 occurrences in non-message records, 1 in
// assistant text). This scan counts message content ONLY. If a future harness inlines BOOT into
// message content, this separation breaks and the numbers become meaningless — check that first.
//
// THE HONEST BOUND, and it is why the registration carries a second falsifier. This is LEXICAL.
// A phrase appearing may be QUOTED rather than USED; a concept invoked in paraphrase counts as
// never-invoked. So "never invoked" is an UPPER bound on deadness, not a proven dead list — the
// same limit tell-index documents about itself. The ratio carries the argument; no single row does.
//
// AND THE THING IT CANNOT SEE AT ALL (keeper, 2026-08-16): PROCEDURES. A procedure that is silently
// followed reads identical to a dead one. Nobody says "append clean, never overwrite" — it was
// obeyed a dozen times over two nights and named zero times, and it is the most load-bearing rule
// in the room. DO NOT grade procedures with this instrument. It is valid for VOCABULARY — phrases
// meant to be said between two minds — and for nothing else.
//
// usage:
//   node boot_usage_scan.js [--boot <path>] [--projects <dir>] [--json]

'use strict';
const fs = require('fs');
const path = require('path');
const rl = require('readline');

function arg(name, dflt) {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
}
const BOOT = arg('--boot', path.join(__dirname, '..', 'BOOT.md'));
const PROJECTS = arg('--projects', path.join(process.env.USERPROFILE || process.env.HOME || '', '.claude', 'projects'));
const AS_JSON = process.argv.includes('--json');

for (const [label, p] of [['BOOT', BOOT], ['projects dir', PROJECTS]]) {
  if (!fs.existsSync(p)) {
    console.error(`boot_usage_scan: ${label} not found at ${p}`);
    console.error('pass --boot <path> and/or --projects <dir>. Refusing to report a count over nothing.');
    process.exit(2);
  }
}

/** Distinctive coined phrases: bolded spans and italic coinages, 3-9 words. Deliberately crude —
 *  the unit is "a phrase someone could say", not a concept. */
function concepts(bootText) {
  const raw = [...bootText.matchAll(/\*\*([^*]{12,70})\*\*/g)].map(m => m[1])
    .concat([...bootText.matchAll(/\*([a-z][^*]{12,60})\*/g)].map(m => m[1]));
  return [...new Set(raw
    .map(s => s.replace(/[^a-zA-Z0-9 -]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase())
    .filter(s => { const w = s.split(' ').length; return w >= 3 && w <= 9; }))];
}

function transcripts(root) {
  const out = [];
  for (const d of fs.readdirSync(root)) {
    const p = path.join(root, d);
    let st; try { st = fs.statSync(p); } catch { continue; }
    if (!st.isDirectory()) continue;
    for (const f of fs.readdirSync(p)) if (f.endsWith('.jsonl')) out.push(path.join(p, f));
  }
  return out;
}

(async () => {
  const list = concepts(fs.readFileSync(BOOT, 'utf8'));
  if (!list.length) { console.error('boot_usage_scan: zero concepts extracted — BOOT format changed. Refusing.'); process.exit(2); }
  const hits = Object.fromEntries(list.map(c => [c, { user: 0, asst: 0 }]));
  const files = transcripts(PROJECTS);
  if (!files.length) { console.error('boot_usage_scan: zero transcripts found. Refusing to report over nothing.'); process.exit(2); }
  process.stderr.write(`scanning ${files.length} transcripts for ${list.length} phrases...\n`);

  for (const f of files) {
    await new Promise(res => {
      const s = rl.createInterface({ input: fs.createReadStream(f, { encoding: 'utf8' }), crlfDelay: Infinity });
      s.on('line', l => {
        let o; try { o = JSON.parse(l); } catch { return; }
        if (o.type !== 'user' && o.type !== 'assistant') return;   // MESSAGE CONTENT ONLY — see header
        const c = o.message && o.message.content;
        const t = (typeof c === 'string' ? c
          : Array.isArray(c) ? c.filter(x => x.type === 'text').map(x => x.text).join(' ') : '').toLowerCase();
        if (!t) return;
        for (const k of list) if (t.includes(k)) hits[k][o.type === 'user' ? 'user' : 'asst']++;
      });
      s.on('close', res); s.on('error', res);
    });
  }

  const never = list.filter(k => !hits[k].user && !hits[k].asst);
  const live = list.filter(k => hits[k].user || hits[k].asst)
    .sort((a, b) => (hits[b].user + hits[b].asst) - (hits[a].user + hits[a].asst));

  if (AS_JSON) { console.log(JSON.stringify({ boot: BOOT, transcripts: files.length, total: list.length, never: never.length, hits }, null, 1)); return; }

  console.log(`\nBOOT: ${BOOT}`);
  console.log(`transcripts scanned:        ${files.length}`);
  console.log(`distinctive phrases:        ${list.length}`);
  console.log(`NEVER invoked in a live turn: ${never.length}  (${(100 * never.length / list.length).toFixed(0)}%)`);
  console.log(`\ninvoked, by total (keeper share in parens):`);
  for (const k of live.slice(0, 20)) console.log(`  ${String(hits[k].user + hits[k].asst).padStart(4)}  (${hits[k].user})  ${k}`);
  console.log(`\nnever invoked — candidates only, NOT a proven dead list (lexical bound, see header):`);
  for (const k of never.slice(0, 25)) console.log(`        ${k}`);
  if (never.length > 25) console.log(`        ... and ${never.length - 25} more`);
})();
