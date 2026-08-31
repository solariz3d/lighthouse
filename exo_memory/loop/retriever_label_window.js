#!/usr/bin/env node
// retriever_label_window.js -- print the LIVE EXCHANGE around a moment on the board (R2a step 3).
//
// Written by pane E (P-LABELS, L019). Read-only. Re-derives a label's board window from the machine-local
// board so a reader can check the exchange the label claims was live, instead of trusting the label.
//
//     node exo_memory/loop/retriever_label_window.js <pane-prefix> <fromISO> <toISO> [regex] [--full]
//
//   pane-prefix  first chars of the pane id ("0c0c0c0a" = Main/chair, "0c0c0c0b" = librarian)
//   from/to      ISO instants, UTC or with offset; the window is [from, to]
//   regex        optional; only rows whose text matches are printed (case-insensitive)
//   --full       print whole texts; default prints the first 400 chars
//
// DEDUP: Main's transcript is replayed onto the board on most relaunches (journal/2026-08-15.md,
// board-audit.js), so the same text appears many times with later ts. Rows are keyed by
// (pane, role, sha1(text)) and only the EARLIEST ts is kept -- the earliest is the live one.
// Rows with no parseable ts or text are counted and reported, never silently dropped.
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');
const BOARD = process.env.CONSONANCE_BOARD || 'C:/Consonance/data/board.jsonl';
let [pane, fromS, toS, ...rest] = process.argv.slice(2);
if (!pane || !fromS || !toS) { console.error('usage: retriever_label_window.js <pane-prefix|*> <fromISO> <toISO> [regex] [--full]'); process.exit(2); }
if (pane === '*') pane = ''; // every pane
const full = rest.includes('--full');
const reS = rest.find(a => a !== '--full');
const re = reS ? new RegExp(reS, 'i') : null;
const from = Date.parse(fromS), to = Date.parse(toS);
if (Number.isNaN(from) || Number.isNaN(to)) { console.error('bad ISO instant'); process.exit(2); }
const seen = new Map(); let bad = 0, total = 0, replays = 0;
const rl = readline.createInterface({ input: fs.createReadStream(BOARD) });
rl.on('line', l => {
  let r; try { r = JSON.parse(l); } catch { bad++; return; }
  total++;
  if (typeof r.pane !== 'string' || !r.pane.startsWith(pane)) return;
  if (typeof r.text !== 'string' || typeof r.ts !== 'number') { bad++; return; }
  const k = r.pane + '\u0000' + r.role + '\u0000' + crypto.createHash('sha1').update(r.text).digest('hex');
  const prev = seen.get(k);
  if (prev) { replays++; if (r.ts < prev.ts) prev.ts = r.ts; return; }
  seen.set(k, { ts: r.ts, role: r.role, text: r.text, pane: r.pane });
});
rl.on('close', () => {
  const rows = [...seen.values()].filter(r => r.ts >= from && r.ts <= to && (!re || re.test(r.text))).sort((a, b) => a.ts - b.ts);
  console.log(`# board ${BOARD}: ${total} rows read, ${bad} unparseable, ${replays} replay duplicates collapsed for pane ${pane}*`);
  console.log(`# window ${new Date(from).toISOString()} .. ${new Date(to).toISOString()}${re ? ` filter /${reS}/i` : ''}: ${rows.length} distinct rows`);
  for (const r of rows) {
    const t = full ? r.text : r.text.slice(0, 400).replace(/\s+/g, ' ');
    console.log(`\n[${new Date(r.ts).toISOString()}] ${r.pane.slice(0, 8)} ${r.role}\n${t}${!full && r.text.length > 400 ? ' …' : ''}`);
  }
});
