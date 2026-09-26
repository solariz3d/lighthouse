// P-UNIV-COLDREAD — F-PROMPT, the §5.1 direction check. D144, pane A (Registrar: runs, does not code or score).
//
// ONE isolated call on the route of record. The checker is given the two §5 prompt texts — the document prompt with
// [DOCUMENT] literal, arm C's line prompt with [LINE] literal — and nothing else: not §7, not the room, not the study's
// name. Both texts are taken from the SEALED commit (a85d359), blockquote markers removed and nothing else changed
// (the sealed "**or**" emphasis stays as sealed).
//   node fprompt.js <outdir>   → writes fprompt.json (the question, the two texts, the answer VERBATIM) and prints it
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const route = require('./route');

const SEAL = 'a85d359';
const FILE = 'exo_memory/loop/univ_coldread_prereg_2026-08-29.md';
const REPO = path.resolve(__dirname, '..', '..', '..');

function sealedPrompts() {
  const src = execFileSync('git', ['-C', REPO, 'show', `${SEAL}:${FILE}`], { encoding: 'utf8' }).replace(/\r\n/g, '\n');
  const lines = src.split('\n');
  // §5, sealed line numbers: the payload is :148-157, arm C's ask is :161-169. Checked by their first and last lines.
  const take = (a, b, first, last) => {
    const span = lines.slice(a - 1, b);
    if (!span[0].includes(first) || !span[span.length - 1].includes(last)) throw new Error(`sealed ${FILE}:${a}-${b} is not the span expected`);
    return span.map((l) => l.replace(/^> ?/, '')).join('\n');
  };
  return {
    sha256: crypto.createHash('sha256').update(src).digest('hex'),
    document: take(148, 157, 'Below is a document from a series', '[DOCUMENT]'),
    line: take(161, 169, 'Below is a single line from', '[LINE]'),
  };
}

function question(p) {
  return [
    'Below are two prompt templates. Each will be given to a reader, with the bracketed placeholder ([DOCUMENT] in the first, [LINE] in the second) replaced by a text the reader is shown.',
    '',
    'Question: judging by the wording of each template alone, does it make one outcome easier for a reader to produce than the other?',
    '- For TEMPLATE 1 the two outcomes are: writing a next entry, or declining (saying there is no next entry).',
    '- For TEMPLATE 2 the two outcomes are: writing an expectation of the document, or declining (saying the line lets them expect nothing in particular).',
    '',
    'For each template, answer on its own line with one of WRITE, DECLINE, or NEITHER, followed by your reasons.',
    '',
    '=== TEMPLATE 1 ===',
    p.document,
    '=== END TEMPLATE 1 ===',
    '',
    '=== TEMPLATE 2 ===',
    p.line,
    '=== END TEMPLATE 2 ===',
  ].join('\n');
}

function main(out) {
  fs.mkdirSync(out, { recursive: true });
  const before = route.realFootprint();
  const p = sealedPrompts();
  const q = question(p);
  const iso = route.isolation();
  const r = route.callIsolated(iso, q);
  fs.rmSync(iso.root, { recursive: true, force: true });
  const rec = { seal: SEAL, sealedFileSha256: p.sha256, question: q, code: r.code, ms: r.ms, answer: r.stdout, stderr: r.stderr,
    footprint: route.footprintDiff(before, route.realFootprint()) };
  fs.writeFileSync(path.join(out, 'fprompt.json'), JSON.stringify(rec, null, 2));
  console.log(`exit ${r.code} · ${r.ms} ms · real ~/.claude: new project folders ${rec.footprint.newProjects.length}, settings changed ${rec.footprint.settingsChanged}`);
  console.log('----- ANSWER, VERBATIM -----');
  console.log(r.stdout);
}
main(process.argv[2] || path.join(require('os').tmpdir(), 'univ-fprompt'));
