// ghost-extract.js — extract Claude Code ghost suggestions from a Consonance raw PTY log.
// Usage: node ghost-extract.js <pane.log> <out.jsonl>
//
// Grammar (observed 2026-08-18 on CLI 2.1.233/234, Main's live log):
//   ESC[2m <text> ESC[<row>;3H   or   ESC[2m <text> ESC[38;2;153;153;153m
// i.e. dim-on, ghost text, then either a cursor return to input column 3 or the
// hint-grey SGR. Typed text is ESC[38;2;255;255;255m and never matches.
//
// CANARY (the loud-failure discriminator): UI chrome ("Compacted (ctrl+o…",
// "Press up to edit queued messages") renders through the SAME dim grammar.
// chrome>0 with ghosts=0  -> pattern alive, no suggestions shown (skip conditions).
// chrome=0 with ghosts=0  -> the extraction pattern itself is dead (renderer drift).
// The summary prints both counts so those two states can never be conflated.
//
// Scoring: ONLY the unflattering direction is automatic. If the normalized ghost
// is a verbatim substring of the normalized prior context, bucket = ECHO(auto).
// Everything else is UNSCORED for the manual echo/extension/add pass per
// REGISTRATION.md. ADD is never assigned by this tool.
'use strict';
const fs = require('fs');

const [, , logPath, outPath] = process.argv;
if (!logPath || !outPath) { console.error('usage: node ghost-extract.js <pane.log> <out.jsonl>'); process.exit(1); }

const s = fs.readFileSync(logPath, 'latin1'); // byte-faithful; escapes are ASCII
const GHOST_RX = /\x1b\[2m([^\x1b]{3,200})\x1b\[(?:\d+;3H|38;2;153;153;153m)/g;
const CHROME_RX = /^(Compacted \(ctrl|Press up to edit|ctrl\+|esc to |tab to |shift\+|\? for shortcuts|·)/;

const stripAnsi = t => t
  .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, ' ')   // OSC
  .replace(/\x1b\[[0-9;?]*[A-Za-z]/g, ' ')              // CSI
  .replace(/[\x00-\x1f]/g, ' ')
  .replace(/\s+/g, ' ').trim();
const norm = t => t.toLowerCase().replace(/\s+/g, ' ').trim();

let m, events = [], chrome = 0;
while ((m = GHOST_RX.exec(s)) !== null) {
  const text = m[1].trim();
  if (text.length < 3) continue;
  if (CHROME_RX.test(text)) { chrome++; continue; }
  const prev = events[events.length - 1];
  if (prev && prev.text === text && m.index - prev.offset < 500000) { prev.renders++; prev.offset = m.index; continue; }
  const priorRaw = s.slice(Math.max(0, m.index - 20000), m.index);
  events.push({ offset: m.index, text, renders: 1, prior: stripAnsi(priorRaw).slice(-3000) });
}

let echoAuto = 0;
for (const e of events) {
  e.bucket = norm(e.prior).includes(norm(e.text)) ? 'ECHO(auto-verbatim)' : 'UNSCORED';
  if (e.bucket !== 'UNSCORED') echoAuto++;
}

fs.writeFileSync(outPath, events.map(e => JSON.stringify(e)) .join('\n') + '\n');
console.error(JSON.stringify({
  log: logPath, bytes: s.length,
  ghost_events: events.length, chrome_hits: chrome, echo_auto: echoAuto, unscored: events.length - echoAuto,
  canary: chrome > 0 ? 'pattern-alive' : (events.length > 0 ? 'pattern-alive' : 'PATTERN-DEAD-OR-EMPTY-LOG')
}));
