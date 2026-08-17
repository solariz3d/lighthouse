#!/usr/bin/env node
// append-census.js — DRAFT, handed back by Around 2026-08-17 beside boot_v2_mechanical_DRAFT.md
//
// Law 2's instrument: journal masters grow by appending; a commit that DELETES lines from
// exo_memory/journal/*.md is a violation unless its hash is in the committed exception list.
// The exception list is per-commit and dated — a standing exemption CLASS added later is the
// degenerating move (boot_v2_mechanical_DRAFT.md §3). First run 2026-08-17: 69 touches, 3 with
// deletions (c1b8d39, eff1715, de65698); c1b8d39 filed as the first exception — caused by this
// author's own "strike the falsifier" being executed as a deletion instead of an appended
// retraction. Convention shipped with the law: corrections append AFTER the closing trailer;
// the trailer ends the entry-as-first-written, not the file.
//
// usage: node exo_memory/loop/append-census.js   (from repo root; exit 1 on unexcepted violations)

'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const EXCEPTIONS_FILE = path.join(__dirname, 'append_census_exceptions.md');
const exceptions = new Set(
  fs.existsSync(EXCEPTIONS_FILE)
    ? [...fs.readFileSync(EXCEPTIONS_FILE, 'utf8').matchAll(/^([0-9a-f]{7,40})\b/gm)].map(m => m[1].slice(0, 7))
    : []
);

let out;
try {
  out = execSync('git log --numstat --format=@%h -- exo_memory/journal', { encoding: 'utf8' });
} catch (e) {
  console.error('append-census: git log failed — run from inside the repo.');
  process.exit(2);
}

let cur = null, touches = 0;
const violations = [];
for (const l of out.split('\n')) {
  if (l.startsWith('@')) { cur = l.slice(1); continue; }
  const m = l.match(/^(\d+)\t(\d+)\t(exo_memory\/journal\/\S+)/);
  if (!m) continue;
  touches++;
  if (+m[2] > 0) violations.push({ commit: cur, file: m[3], deleted: +m[2] });
}

if (touches === 0) { console.error('append-census: zero journal touches found. Refusing to report over nothing.'); process.exit(2); }

const unexcepted = violations.filter(v => !exceptions.has(v.commit.slice(0, 7)));
console.log(`journal file-touches: ${touches}`);
console.log(`with deletions:       ${violations.length}  (excepted: ${violations.length - unexcepted.length})`);
for (const v of violations) {
  const tag = exceptions.has(v.commit.slice(0, 7)) ? 'EXCEPTED ' : 'VIOLATION';
  console.log(`  ${tag} ${v.commit}  ${v.file}  -${v.deleted}`);
}
process.exit(unexcepted.length ? 1 : 0);
