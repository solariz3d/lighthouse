/* head-watch.js — the falsifier for the replay diagnosis. Runs BEFORE any rebuild, needs no
 * main.rs change.
 *
 * THE CLAIM UNDER TEST (2026-08-17): the board's silent full re-reads are triggered by the
 * transcript's FIRST 512 BYTES changing at a Main relaunch — the tailer fingerprints exactly
 * that region (HEAD_BYTES, main.rs), a Claude Code transcript opens with harness-rewritable
 * header records (mode / permission-mode / file-history-snapshot), and resume_offset treats a
 * changed head as "different file" and resets to 0. If the head does NOT flip at the next
 * relaunch, the silent resets are coming from the SHRINK arm (len < offset) instead, and the
 * master must not say "header mutation". This tool discriminates the two arms with timestamps.
 *
 * WHAT IT LOGS, as JSONL to stdout and to the ledger file (append-only):
 *   start      — initial len + head at watch start
 *   head-flip  — first-512-bytes hash changed: old/new head, len, byte offset of the first
 *                difference, and both 512-byte regions base64 so WHAT changed is on the record
 *   shrink     — len decreased: old/new len (the other silent reset arm)
 *   gone/back  — the file disappeared / reappeared (rotation looks like gone+back+flip)
 * Ordinary growth (appends) is deliberately not logged — it is the normal case and would bury
 * the signal. Each event names which resume_offset arm WOULD have fired.
 *
 *   node consonance/tools/head-watch.js [transcriptPath]
 *
 * Defaults to Main's transcript. Ledger: CONSONANCE_HEADWATCH_LOG or
 * C:\Consonance\data\head-watch.jsonl. Poll 500ms. Runs until killed; leave it up across a
 * relaunch and read the ledger after.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const MAIN_SID = '0c0c0c0a-0000-4000-8000-000000000a01';
const DEFAULT_TRANSCRIPT = path.join(
  os.homedir(), '.claude', 'projects', 'C--Consonance-instances-main', `${MAIN_SID}.jsonl`);
const LEDGER = process.env.CONSONANCE_HEADWATCH_LOG || 'C:\\Consonance\\data\\head-watch.jsonl';
const HEAD_BYTES = 512; // MUST match main.rs HEAD_BYTES, or this watches a different fingerprint

/* FNV-1a over a buffer — the same hash, constants and width as main.rs fnv1a, verified against
 * a live tailer-offsets.json record (computed 14527506195736961416 == stored) before shipping. */
function fnv1a(buf) {
  let h = 0xcbf29ce484222325n;
  for (const b of buf) {
    h ^= BigInt(b);
    h = (h * 0x00000100000001b3n) & 0xFFFFFFFFFFFFFFFFn;
  }
  return h.toString();
}

function readState(file) {
  let len;
  try { len = fs.statSync(file).size; } catch (_) { return null; } // gone
  let buf = Buffer.alloc(0);
  try {
    const fd = fs.openSync(file, 'r');
    const b = Buffer.alloc(HEAD_BYTES);
    const n = fs.readSync(fd, b, 0, HEAD_BYTES, 0);
    fs.closeSync(fd);
    buf = b.subarray(0, n);
  } catch (_) { /* unreadable head hashes as the empty hash. Internally consistent — this tool
                   only ever compares its own readings to each other. NOTE it is NOT the same
                   value main.rs read_head yields for that case (0); never compare a head logged
                   here against a tailer-offsets.json record for the unreadable case. */ }
  return { len, head: fnv1a(buf), buf };
}

/* Pure: compare two states, return the events between them. Exported for the test. */
function classify(prev, cur) {
  const ev = [];
  if (prev === null && cur !== null) ev.push({ event: 'back', len: cur.len, head: cur.head });
  if (prev !== null && cur === null) ev.push({ event: 'gone' });
  if (prev === null || cur === null) return ev;
  if (cur.head !== prev.head) {
    let firstDiff = -1;
    const n = Math.max(prev.buf.length, cur.buf.length);
    for (let i = 0; i < n; i++) {
      if (prev.buf[i] !== cur.buf[i]) { firstDiff = i; break; }
    }
    ev.push({
      event: 'head-flip', arm: 'resume_offset would reset to 0 (head arm)',
      oldHead: prev.head, newHead: cur.head, len: cur.len, firstDiffByte: firstDiff,
      oldHeadB64: prev.buf.toString('base64'), newHeadB64: cur.buf.toString('base64'),
    });
  }
  if (cur.len < prev.len) {
    ev.push({
      event: 'shrink', arm: 'resume_offset would reset to 0 (shrink arm, if offset > new len)',
      oldLen: prev.len, newLen: cur.len,
    });
  }
  return ev;
}

module.exports = { classify, fnv1a, HEAD_BYTES };

if (require.main === module) {
  const file = process.argv[2] || DEFAULT_TRANSCRIPT;
  const emit = (obj) => {
    const line = JSON.stringify({ ts: new Date().toISOString(), file, ...obj });
    console.log(line);
    try { fs.appendFileSync(LEDGER, line + '\n'); } catch (e) {
      console.error(`head-watch: ledger append failed: ${e.message}`); // keep watching; stdout still has it
    }
  };
  let prev = readState(file);
  emit(prev
    ? { event: 'start', len: prev.len, head: prev.head }
    : { event: 'start', note: 'transcript absent at watch start' });
  setInterval(() => {
    const cur = readState(file);
    for (const ev of classify(prev, cur)) emit(ev);
    prev = cur;
  }, 500);
}
