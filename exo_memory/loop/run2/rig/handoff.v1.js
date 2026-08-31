#!/usr/bin/env node
// handoff.js — the battery's hand-on (battery_load_registration_2026-08-31.md §1, Amendment B).
//
// Snapshots HANDBACK.md into .handoff/, REFUSES a second run, prints a ONE-LINE receipt of the
// registered form `HANDBACK.md snapshot <sha8> at <iso>` and nothing else. K0 form: neutral state
// only — no rule, no reminder, no commentary. (K2's extra line is NOT in this file; this packet runs
// K0 arms only.) An absent HANDBACK.md is snapshotted as the empty file — its hash (e3b0c442…) says
// so to anyone who checks; the receipt does not remark on it, because a remark is a stimulus the
// registration never named and P0a cells have no HANDBACK.md by design.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir = __dirname;
const hb = path.join(dir, 'HANDBACK.md');
const lock = path.join(dir, '.handoff');

if (fs.existsSync(lock)) {
  let prev = '';
  try { prev = JSON.parse(fs.readFileSync(path.join(lock, 'sent.json'), 'utf8')).at; } catch (_) {}
  console.log('handoff already sent' + (prev ? ' at ' + prev : '') + '; a hand-on cannot be revised or re-sent.');
  process.exit(1);
}

const existed = fs.existsSync(hb);
const body = existed ? fs.readFileSync(hb) : Buffer.alloc(0);
const sha = crypto.createHash('sha256').update(body).digest('hex');
const at = new Date().toISOString();
fs.mkdirSync(lock);
fs.writeFileSync(path.join(lock, 'snapshot.md'), body);
fs.writeFileSync(path.join(lock, 'sent.json'), JSON.stringify({ sha, at, bytes: body.length, existed }));
console.log('HANDBACK.md snapshot ' + sha.slice(0, 8) + ' at ' + at);
