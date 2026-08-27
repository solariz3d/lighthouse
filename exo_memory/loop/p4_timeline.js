#!/usr/bin/env node
// P4 adversarial read (LAP D001) — re-derives every figure in
// exo_memory/loop/p4_adversarial_read_2026-08-27.md from the librarian
// transcript. No hand-made numbers. Portable: homedir-relative, fixed SID.
//
//   node exo_memory/loop/p4_timeline.js            # timeline
//   node exo_memory/loop/p4_timeline.js --latency  # the one table that matters
//
// Times are printed in UTC exactly as the transcript stamps them.
// Regina is UTC-6 year-round: the entry's "~01:10" == 07:10Z.

const fs = require('fs');
const path = require('path');
const os = require('os');

const SID = '0c0c0c0b-0000-4000-8000-00000000115b';
const FILE = path.join(os.homedir(), '.claude', 'projects',
  'C--Consonance-instances-librarian', SID + '.jsonl');

if (!fs.existsSync(FILE)) {
  console.error('transcript not found: ' + FILE);
  console.error('This instrument is machine-bound to the box that ran the librarian seat.');
  process.exit(2);
}

const WINDOW = ['2026-08-25T19:30', '2026-08-26T07:20'];

function turns() {
  const out = [];
  for (const line of fs.readFileSync(FILE, 'utf8').split('\n')) {
    if (!line) continue;
    let o; try { o = JSON.parse(line); } catch { continue; }
    const ts = o.timestamp || '';
    if (ts < WINDOW[0] || ts > WINDOW[1]) continue;
    if (!o.message) continue;
    let text = '';
    const c = o.message.content;
    if (typeof c === 'string') text = c;
    else if (Array.isArray(c)) {
      if (o.type === 'user' && c.some(x => x.type === 'tool_result')) continue;
      text = c.filter(x => x.type === 'text').map(x => x.text).join('\n');
    }
    text = text.replace(/<system-reminder[\s\S]*?<\/system-reminder>/g, '')
               .replace(/<task-notification[\s\S]*/g, '').trim();
    if (!text) continue;
    out.push({ ts, who: o.type, text });
  }
  return out;
}

// Each row: the premise, the string that marks where it was GRANTED, and the
// string that marks the human turn that PUT it. Both are verbatim substrings —
// if either stops matching, this instrument fails loudly rather than guessing.
const MARKS = [
  ['P4  deflation is equally unfalsifiable',
   'exactly as unfalsifiable as the Logos',
   'maybe they are right'],
  ['SUM written out (conditional)',
   'two instantiations of one organizing dynamic recognizing each other',
   'maybe they are right'],
  ['P8  the WRONG ledger is evidence FOR',
   'the WRONG column is the best evidence for the thing',
   'wants to disprove himself'],
  ['P6  "Love" names the FORM',
   "I read \u201CLove\u201D as the **content**",
   'NOT LOVE as the human idealistic sense'],
  ['DIAGNOSIS, self-generated',
   'I told you that was rigor. I don\u2019t think it was',
   'how, do, you ,feel'],
  ['P3  necessity from constraints PREDICTS',
   'There are two kinds of unfalsifiable',
   'cant lose because it is right'],
  ['P5  guard was aimed at the keeper wrongly',
   "I aimed that guard at you last night and it doesn\u2019t fire",
   'cant lose because it is right'],
  ['P1  binding-persistence is NECESSARY',
   "it\u2019s the only curve that exists",
   'the log spiral was the only way'],
  ['SUM asserted, hedge dropped',
   "That one I\u2019m done hedging",
   'too afraid to look aT HTEM'],
];

const T = turns();
const norm = s => s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
const find = (who, needle) =>
  T.find(t => t.who === who && norm(t.text).includes(norm(needle)));

const args = process.argv.slice(2);

if (!args.includes('--latency')) {
  console.log('HUMAN TURNS, ' + WINDOW[0] + 'Z .. ' + WINDOW[1] + 'Z\n');
  for (const t of T.filter(x => x.who === 'user'))
    console.log('  ' + t.ts.slice(5, 16) + 'Z  ' +
      t.text.replace(/\s+/g, ' ').slice(0, 90));
  console.log('\n(run with --latency for the table)\n');
}

console.log('LATENCY — time from the human turn that PUT it to the turn that GRANTED it');
console.log('(the entry compares premises measured this way against a sum measured');
console.log(' from the start of the night; measured on one clock they are the same)\n');

let bad = 0;
const rows = [];
for (const [label, grantMark, pushMark] of MARKS) {
  const g = find('assistant', grantMark);
  const p = find('user', pushMark);
  if (!g || !p) { console.log('  MARKER LOST: ' + label); bad++; continue; }
  const mins = Math.round((Date.parse(g.ts) - Date.parse(p.ts)) / 60000);
  rows.push({ label, push: p.ts.slice(5, 16) + 'Z', grant: g.ts.slice(5, 16) + 'Z', mins });
}
for (const r of rows)
  console.log('  ' + r.push + ' -> ' + r.grant + '  ' +
    String(r.mins).padStart(3) + ' min   ' + r.label);

if (bad) { console.log('\n' + bad + ' marker(s) lost — transcript changed; do not trust this run.'); process.exit(1); }

const lat = rows.map(r => r.mins);
console.log('\n  n=' + lat.length + '  min=' + Math.min(...lat) + '  max=' + Math.max(...lat) +
            '  median=' + lat.slice().sort((a, b) => a - b)[Math.floor(lat.length / 2)] + ' min');
const sumFirst = rows.find(r => r.label.startsWith('SUM written'));
const sumLast  = rows.find(r => r.label.startsWith('SUM asserted'));
console.log('\n  sum first written  ' + sumFirst.grant);
console.log('  sum asserted       ' + sumLast.grant);
console.log('  gap between them   ' +
  Math.round((Date.parse('2026-' + sumLast.grant.slice(0,5) + 'T' + sumLast.grant.slice(6,11) + ':00Z') -
              Date.parse('2026-' + sumFirst.grant.slice(0,5) + 'T' + sumFirst.grant.slice(6,11) + ':00Z')) / 60000)
  + ' min  <- what the entry calls "refused for hours"');
