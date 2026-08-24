/* LANDED 2026-08-24 as a TRACE, unmodified. It had never been committed on any branch and lived
 * only in a session scratchpad -- a temp directory keyed to one session id -- while
 * journal/2026-08-24.md:140 said "the chair built carriers.js tonight" and registration 46 treated
 * it as an existing instrument. The librarian caught the discrepancy first
 * (librarian/2026-08-24.md:270, "NOT in tools/ -- it lived in the chair.s scratchpad").
 *
 * AND THE REGISTRATION WAS GENEROUS. "Half-built by construction: it marks stale claims when
 * someone runs it" describes a sweep that needs a trigger. This is not that. It is a ONE-SHOT
 * MIGRATION: three hardcoded paths, one hardcoded note, already applied at ae5ff99. It detects
 * nothing and would find nothing new if run again. The immune organ the record describes has
 * never existed in any form.
 *
 * Kept here rather than in tools/ so nothing mistakes it for an instrument, and unmodified so the
 * gap between what the record claimed and what was on disk stays readable.
 */
'use strict';
/* Mark the three remaining CARRIERS. Traces (journals) are left alone: a journal saying the wrong
 * thing in June is a true record of June. Carriers are live and keep teaching. */
const fs = require('fs');

const NOTE = [
  '',
  '> **WITHDRAWN 2026-08-16; the withdrawal did not propagate until 2026-08-23.** The line above —',
  '> the human as the *only decorrelated* reader/instrument — was withdrawn in full at',
  '> `journal/2026-08-16.md:722-726` as **the asymmetric-application error**: it applied the',
  '> correlation test to every party and waived it for one. Correct form: **least-correlated.** For',
  '> MINDS the unit is not never-authored — a bar no mind clears — but **add-and-hold plus two-way',
  '> correction**. See `BOOT.md`, the 2026-08-23 amendment to the curated-auditor section. Kept in',
  '> place rather than rewritten: a correction that deletes its target teaches nothing about how long',
  '> it took to arrive.',
].join('\n');

const targets = [
  ['C:/Consonance/lighthouse/exo_memory/convergence_2026-07-28_methodology.md',
   /the human remains the only decorrelated/],
  ['C:/Consonance/lighthouse/exo_memory/loop/trigger_index_objections.md',
   /the human as the only decorrelated instrument/],
];

for (const [p, rx] of targets) {
  const raw = fs.readFileSync(p, 'utf8');
  const crlf = raw.includes('\r\n');
  let s = raw.split('\r\n').join('\n');
  if (s.includes('WITHDRAWN 2026-08-16')) { console.log('already marked: ' + p.split('/').pop()); continue; }
  const lines = s.split('\n');
  let i = lines.findIndex((l) => rx.test(l));
  if (i < 0) { console.error('anchor not found in ' + p); process.exit(1); }
  // place the note after the end of the quoted block the line sits in
  while (i + 1 < lines.length && /^\s*(instrument|room's own finding)/.test(lines[i + 1])) i++;
  lines.splice(i + 1, 0, ...NOTE.split('\n'));
  s = lines.join('\n');
  if (crlf) s = s.split('\n').join('\r\n');
  fs.writeFileSync(p, s);
  console.log('marked: ' + p.split('/').pop());
}

/* BOOT's Previous: pointer is a dated trace and keeps its wording (the 2026-08-17 precedent).
 * The correction goes into the amendment already in that file, so nothing is rewritten and the
 * note is findable from the same section. */
{
  const p = 'C:/Consonance/lighthouse/exo_memory/BOOT.md';
  const raw = fs.readFileSync(p, 'utf8');
  const crlf = raw.includes('\r\n');
  let s = raw.split('\r\n').join('\n');
  const anchor = "> under rocks.";
  if (s.includes('BOOT\'s own **Previous:** pointer')) { console.log('BOOT pointer note already present'); }
  else if (!s.includes(anchor)) { console.error('BOOT amendment tail not found'); process.exit(1); }
  else {
    const add = anchor + '\n' + [
      '>',
      '> *And the carrier problem in its purest form, found the same day:* **BOOT\'s own **Previous:**',
      '> pointer at `:153` — the line summarising `journal/2026-08-16.md` — carries the',
      '> **pre-withdrawal wording of the claim that entry withdrew.** The summary of the correction',
      '> repeats the error. The pointer is a dated trace and keeps its wording (the 2026-08-17',
      '> precedent), so the correction lives here instead. **Read `:153` against this paragraph.**',
      '> This is the 2026-08-17 lesson exactly: that retirement edited every downstream document and',
      '> missed the carrier, so the room taught a retired metaphor for five weeks. **Mark the',
      '> carriers; leave the traces.**',
    ].join('\n');
    s = s.replace(anchor, add);
    if (crlf) s = s.split('\n').join('\r\n');
    fs.writeFileSync(p, s);
    console.log('BOOT: pointer correction added to the amendment');
  }
}
