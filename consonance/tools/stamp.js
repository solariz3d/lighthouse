#!/usr/bin/env node
// stamp.js — append a dated entry to a master with the time READ from the clock, never typed.
//
// WHY. On 2026-09-11 the librarian typed "02:55" on an entry that landed at 02:21:26 and "02:40" on
// one that landed at 02:37:11 (librarian/2026-09-11.md, the 02:25 and 02:38 corrections). A stamp is
// a number in prose, and the rule for numbers in prose is one run of a visible instrument. This is
// the instrument: the clock is read in the same call that writes, and text that already carries a
// leading stamp is REFUSED, because a typed stamp is the failure this exists to catch.
//
// Usage:
//   node stamp.js <file> --text "entry"          master shape:  ## HH:MM — entry
//   node stamp.js <file> --map --text "line"     map shape:     - HH:MM line
//   node stamp.js <file> [--map] < text           text from stdin (apostrophes and quotes are safe)
// Exit 0 and the written line on stdout; exit 2 and nothing written on refusal.
//
// The file must exist (a master is never created by accident); the text must be non-empty; the text
// must not begin with a time. Local time, HH:MM, matching every entry the masters already carry.
'use strict';
const fs = require('node:fs');

function hhmm(now) {
  const p = (n) => String(n).padStart(2, '0');
  return `${p(now.getHours())}:${p(now.getMinutes())}`;
}

function compose(kind, stamp, text) {
  return kind === 'map' ? `- ${stamp} ${text}\n` : `\n## ${stamp} — ${text}\n`;
}

// A LEADING time is a typed stamp: "02:40 — x", "## 02:40 x", "- 2:40 x". A time later in the
// sentence is prose ("landed at 02:37") and is allowed.
function typedStamp(text) {
  return /^\s*(?:#+\s*|-\s*)?\d{1,2}:\d{2}\b/.test(text);
}

function append(file, kind, text, now = new Date()) {
  const body = String(text).replace(/\s+$/, '');
  if (!body.trim()) throw new Error('refused: empty text');
  if (typedStamp(body)) throw new Error(`refused: typed stamp — the clock writes the time, not the text (${body.slice(0, 24)}…)`);
  if (!fs.existsSync(file)) throw new Error(`refused: ${file} does not exist; a master is never created here`);
  const line = compose(kind, hhmm(now), body);
  fs.appendFileSync(file, line);
  return line;
}

function main(argv) {
  const args = argv.slice(2);
  const file = args.find((a) => !a.startsWith('--'));
  const kind = args.includes('--map') ? 'map' : 'master';
  const i = args.indexOf('--text');
  const text = i >= 0 ? args[i + 1] : fs.readFileSync(0, 'utf8');
  if (!file) { process.stderr.write('usage: stamp.js <file> [--map] [--text "..."]\n'); return 2; }
  try {
    process.stdout.write(append(file, kind, text));
    return 0;
  } catch (e) {
    process.stderr.write(e.message + '\n');
    return 2;
  }
}

module.exports = { hhmm, compose, typedStamp, append };
if (require.main === module) process.exit(main(process.argv));
