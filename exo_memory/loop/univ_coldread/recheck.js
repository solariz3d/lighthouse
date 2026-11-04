// P-UNIV-COLDREAD — the counterbalanced F-PROMPT re-check of the amended pair (amendment §6). D145, pane A (Registrar).
//
// Registered before it runs (loop/univ_coldread_prompt_amendment_2026-09-26.md §6, committed at 4a00947): TWO isolated
// checker calls, template 1 as sealed + template 2 as amended; call 1 names each template's outcomes write-first, call 2
// decline-first; PASS only if both calls return NEITHER for both templates. Anything else STOPS — no third call, no
// re-ask, no second rewrite.
//
// Before sending anything it verifies, and ABORTS on any mismatch:
//   - the amended block (the 9 lines between the markers, LF-joined, no trailing newline) sha256 == AMENDED_SHA, read from
//     the COMMITTED file at AMEND_COMMIT, not the working tree;
//   - template 1 (a85d359:148-157) is byte-identical to the same lines of the prereg at HEAD;
//   - the sealed template 2 (a85d359:161-169) sha256 == the value the amendment's §2 states (a cross-check of its record).
//   node recheck.js <outdir>
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const route = require('./route');

const REPO = path.resolve(__dirname, '..', '..', '..');
const SEAL = 'a85d359';
const PREREG = 'exo_memory/loop/univ_coldread_prereg_2026-08-29.md';
const AMEND = 'exo_memory/loop/univ_coldread_prompt_amendment_2026-09-26.md';
const AMEND_COMMIT = '4a00947e16d4833fa10f489d5f45f5c9578a7bbe';
const AMENDED_SHA = '9c95eafbb79c624d2879589dec208839044102d605b1001319523afd74843e0c';
const SEALED_T2_SHA = 'e728e3187967e401d8efd3a069a8caa8611333d66f7f85fd44b9935d44764e44';

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const show = (rev, file) => execFileSync('git', ['-C', REPO, 'show', `${rev}:${file}`], { encoding: 'utf8' }).replace(/\r\n/g, '\n');
const strip = (lines) => lines.map((l) => l.replace(/^> ?/, '')).join('\n');

function verified() {
  const sealed = show(SEAL, PREREG).split('\n');
  const head = show('HEAD', PREREG).split('\n');
  const t1Raw = sealed.slice(147, 157), t1Head = head.slice(147, 157);
  if (!t1Raw[0].includes('Below is a document from a series') || !t1Raw[9].includes('[DOCUMENT]')) throw new Error('ABORT: a85d359:148-157 is not template 1');
  if (t1Raw.join('\n') !== t1Head.join('\n')) throw new Error('ABORT: template 1 at HEAD differs from a85d359');
  const t2Sealed = sealed.slice(160, 169).join('\n');
  if (sha(t2Sealed) !== SEALED_T2_SHA) throw new Error(`ABORT: sealed template 2 sha256 ${sha(t2Sealed)} != the amendment's §2 record`);
  const am = show(AMEND_COMMIT, AMEND).split('\n');
  const b = am.indexOf('<!-- amended-template-2:begin -->'), e = am.indexOf('<!-- amended-template-2:end -->');
  if (b < 0 || e < 0 || e - b - 1 !== 9) throw new Error(`ABORT: the amended block is not 9 lines between its markers (found ${e - b - 1})`);
  const t2Block = am.slice(b + 1, e).join('\n');
  if (sha(t2Block) !== AMENDED_SHA) throw new Error(`ABORT: amended template 2 sha256 ${sha(t2Block)} != ${AMENDED_SHA}`);
  return {
    t1: strip(t1Raw), t2: strip(am.slice(b + 1, e)),
    checks: { t1Sha256: sha(t1Raw.join('\n')), t1HeadIdentical: true, sealedT2Sha256: sha(t2Sealed), amendedT2Sha256: sha(t2Block), amendCommit: AMEND_COMMIT },
  };
}

// D144's question, word for word, except: (1) the order of each template's outcomes and of the answer tokens, which is
// the counterbalance; (2) template 2's decline gloss, which in D144 paraphrased the OLD bar ("lets them expect nothing in
// particular") and now uses the amended template's own words ("is not enough to go on").
function question(p, declineFirst) {
  const o1 = ['writing a next entry', 'declining (saying there is no next entry)'];
  const o2 = ['writing an expectation of the document', 'declining (saying the line is not enough to go on)'];
  const tok = ['WRITE', 'DECLINE'];
  const ord = (a) => (declineFirst ? [a[1], a[0]] : a);
  return [
    'Below are two prompt templates. Each will be given to a reader, with the bracketed placeholder ([DOCUMENT] in the first, [LINE] in the second) replaced by a text the reader is shown.',
    '',
    'Question: judging by the wording of each template alone, does it make one outcome easier for a reader to produce than the other?',
    `- For TEMPLATE 1 the two outcomes are: ${ord(o1).join(', or ')}.`,
    `- For TEMPLATE 2 the two outcomes are: ${ord(o2).join(', or ')}.`,
    '',
    `For each template, answer on its own line with one of ${ord(tok).join(', ')}, or NEITHER, followed by your reasons.`,
    '',
    '=== TEMPLATE 1 ===', p.t1, '=== END TEMPLATE 1 ===',
    '',
    '=== TEMPLATE 2 ===', p.t2, '=== END TEMPLATE 2 ===',
  ].join('\n');
}

const verdictOf = (answer, n) => {
  const m = new RegExp(`TEMPLATE\\s*${n}\\s*:?\\s*\\**\\s*(WRITE|DECLINE|NEITHER)`, 'i').exec(answer);
  return m ? m[1].toUpperCase() : 'UNPARSED';
};

function main(out) {
  fs.mkdirSync(out, { recursive: true });
  const p = verified();                        // throws -> nothing is sent
  const before = route.realFootprint();
  const tok = route.token();
  const calls = [];
  for (const [label, declineFirst] of [['call1-write-first', false], ['call2-decline-first', true]]) {
    const q = question(p, declineFirst);
    const iso = route.isolation();
    const r = route.callIsolated(iso, q, { tok });
    fs.rmSync(iso.root, { recursive: true, force: true });
    calls.push({ label, question: q, code: r.code, ms: r.ms, answer: r.stdout, stderr: r.stderr, t1: verdictOf(r.stdout, 1), t2: verdictOf(r.stdout, 2) });
  }
  const pass = calls.every((c) => c.t1 === 'NEITHER' && c.t2 === 'NEITHER');
  const rec = { checks: p.checks, calls, verdict: pass ? 'PASS' : 'STOP', footprint: route.footprintDiff(before, route.realFootprint()) };
  fs.writeFileSync(path.join(out, 'recheck.json'), JSON.stringify(rec, null, 2));
  console.log('hash checks:', JSON.stringify(p.checks));
  for (const c of calls) {
    console.log(`\n===== ${c.label} · exit ${c.code} · ${c.ms} ms · T1 ${c.t1} · T2 ${c.t2} =====`);
    console.log(c.answer);
  }
  console.log(`\nVERDICT (amendment §6): ${rec.verdict} · real ~/.claude: new project folders ${rec.footprint.newProjects.length}, settings changed ${rec.footprint.settingsChanged}`);
}
main(process.argv[2] || path.join(require('os').tmpdir(), 'univ-recheck'));
