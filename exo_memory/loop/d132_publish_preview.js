#!/usr/bin/env node
'use strict';
// d132_publish_preview.js — D132 (pane A). READ-ONLY: what `state-sync --push` would send from THIS machine now, computed with
// state-sync's own loadManifest + classify, WITHOUT running --push or --dry-run. (The dry run writes a receipt into the live data
// dir — state-sync.push.json — and so overwrites the last real push record; that is how D's only receipt came to read DRY_RUN.)
//
//   node exo_memory/loop/d132_publish_preview.js
//
// It reads the data dir and the state checkout's working tree (git-tracked copies at its HEAD), hashes both, and writes NOTHING.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const S = require('../../consonance/tools/state-sync.js');

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const DATA = S.dataDir(), STATE = S.stateDir();
const git = (...a) => execFileSync('git', ['-C', STATE, ...a], { encoding: 'utf8' }).trim();
const m = S.loadManifest();
if (m.errors && m.errors.length) { console.log(JSON.stringify({ manifest_errors: m.errors })); process.exit(1); }
const c = S.classify(DATA, m);
const head = git('rev-parse', '--short', 'HEAD');
const remote = (() => { try { return git('rev-parse', '--short', 'origin/main'); } catch { return null; } })();
const out = { data: DATA, state: STATE, state_head: head, origin_main_as_last_fetched: remote, travels: c.travels.length,
  travel_bytes: c.travels.reduce((a, t) => a + t.bytes, 0), unplaced: c.unplaced.length, violations: c.violations.length, broken: c.broken.length,
  over_cap: c.travels.filter((t) => t.bytes > S.FILE_CAP).map((t) => ({ rel: t.rel, bytes: t.bytes })) };
let changed = 0, added = 0, same = 0, changedBytes = 0;
const list = [];
for (const t of c.travels) {
  const src = fs.readFileSync(path.join(DATA, t.rel.split('/').join(path.sep)));
  const dst = path.join(STATE, 'data', t.rel.split('/').join(path.sep));
  if (!fs.existsSync(dst)) { added++; changedBytes += src.length; list.push(`ADD  ${t.rel} ${src.length} B`); continue; }
  if (sha(src) === sha(fs.readFileSync(dst))) { same++; continue; }
  changed++; changedBytes += src.length; list.push(`MOD  ${t.rel} ${src.length} B`);
}
Object.assign(out, { would_change: changed, would_add: added, unchanged: same, bytes_in_the_changed_files: changedBytes, paths: list });
console.log(JSON.stringify(out, null, 1));
