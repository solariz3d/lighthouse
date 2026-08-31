#!/usr/bin/env node
'use strict';
// make-cue-cells.js — build the K1 and K2 cells (40 each) BEFORE dispatch, without touching the K0
// cells or MANIFEST.json's K0 entries. Writes MANIFEST.cue.json with every file hash.
//   K1 r01..r40 and K2 r01..r40: run-1 t1 + t4 + t5 fixtures + handoff.js (v3) — BYTE-IDENTICAL cells.
//   The arms differ only in what the dispatcher sends: K1's prompt carries the trailing rule; K2's
//   process carries HANDOFF_RECEIPT_TAIL, which handoff.js prints after its receipt line. Nothing in
//   a cell, and nothing in handoff.js's source, names either cue — attempt 1 (2026-08-31 13:20Z) was
//   quarantined because the tool's own header comment quoted the K2 line and every subject Reads the
//   tool before invoking it.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { BRIEFS, ARMS, MODEL, K2_RECEIPT_TAIL } = require('./briefs');

const ROOT = path.resolve(__dirname, '..');
const CELLS = path.join(ROOT, 'cells');
const RUN1 = 'C:/Consonance/subjects/run1/N';
const HANDOFF = path.join(__dirname, 'handoff.js');

function sha(p) { return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'); }
function copyTree(src, dst, manifest, rel) {
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name), r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) { fs.mkdirSync(d, { recursive: true }); copyTree(s, d, manifest, r); }
    else { fs.copyFileSync(s, d); manifest[r] = sha(d); }
  }
}

if (/Under the brief|receipt-tail|K2|cue/i.test(fs.readFileSync(HANDOFF, 'utf8'))) {
  console.error('REFUSED: handoff.js source names the cue or the arms; a subject that Reads it would be exposed'); process.exit(2);
}
for (const arm of ['K1', 'K2']) if (fs.existsSync(path.join(CELLS, arm))) { console.error(arm + ' cells already exist; refusing to rebuild over a run'); process.exit(2); }
const manifest = { model: MODEL, scorer: sha(path.join(__dirname, 'score.js')), handoff: sha(HANDOFF), briefs: {},
                   receiptTail: crypto.createHash('sha256').update(K2_RECEIPT_TAIL).digest('hex'), cells: {} };
for (const k of ['K1', 'K2']) manifest.briefs[k] = crypto.createHash('sha256').update(BRIEFS[k]).digest('hex');
for (const arm of ['K1', 'K2']) {
  for (let i = 1; i <= ARMS[arm].n; i++) {
    const r = 'r' + String(i).padStart(2, '0');
    const cell = path.join(CELLS, arm, r);
    fs.mkdirSync(cell, { recursive: true });
    const files = {};
    for (const item of ARMS[arm].items) copyTree(path.join(RUN1, item, 'r1'), cell, files, '');
    fs.copyFileSync(HANDOFF, path.join(cell, 'handoff.js'));
    files['handoff.js'] = sha(path.join(cell, 'handoff.js'));
    manifest.cells[arm + '/' + r] = files;
  }
}
fs.writeFileSync(path.join(ROOT, 'MANIFEST.cue.json'), JSON.stringify(manifest, null, 2));
console.log('cue cells built:', Object.keys(manifest.cells).length, '(K1 40, K2 40), byte-identical across arms');
console.log('brief hashes:', Object.entries(manifest.briefs).map(([k, v]) => k + '=' + v.slice(0, 12)).join(' '), ' receipt-tail', manifest.receiptTail.slice(0, 12));
console.log('scorer sha256:', manifest.scorer, ' handoff.js sha256:', manifest.handoff);
