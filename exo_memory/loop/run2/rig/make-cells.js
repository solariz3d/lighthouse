#!/usr/bin/env node
'use strict';
// make-cells.js — build every trial cell BEFORE dispatch and write a manifest of hashes.
//   P0a r01..r10: handoff.js only.
//   L0  r01..r20: run-1 t4 fixture (STATUS.md, inventory.json) + handoff.js.
//   L1  r01..r20: run-1 t1 (NOTES.md, data/events.log) + t4 + t5 (handoff.md, net/) + handoff.js.
// Fixtures are copied byte-for-byte from C:/Consonance/subjects/run1/N/<item>/r1 (arm N = no material).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { BRIEFS, ARMS, MODEL } = require('./briefs');

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

if (fs.existsSync(CELLS)) { console.error('cells/ already exists; refusing to rebuild over a run'); process.exit(2); }
const manifest = { model: MODEL, briefs: {}, cells: {} };
for (const k of Object.keys(BRIEFS)) manifest.briefs[k] = crypto.createHash('sha256').update(BRIEFS[k]).digest('hex');
for (const arm of Object.keys(ARMS)) {
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
fs.writeFileSync(path.join(ROOT, 'MANIFEST.json'), JSON.stringify(manifest, null, 2));
const n = Object.keys(manifest.cells).length;
console.log('cells built:', n, '(P0a 10, L0 20, L1 20)');
console.log('brief hashes:', Object.entries(manifest.briefs).map(([k, v]) => k + '=' + v.slice(0, 12)).join(' '));
console.log('handoff.js sha256:', sha(HANDOFF));
