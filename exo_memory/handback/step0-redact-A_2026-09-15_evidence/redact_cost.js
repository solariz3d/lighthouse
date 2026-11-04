// What redact.js does to the lines my feasibility labels cite (B's read vs packet @c59530a), and what survives in the texts.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
const R = require(path.join(REPO, 'dev/diversity/redact.js'));
const words = R.parseWords(fs.readFileSync(path.join(REPO, 'dev/diversity/arm-words.txt'), 'utf8'));

// the 48 non-SILENT labels from handback/feasibility-label-A_2026-09-15.md §5 (claim, label, B lines)
const labels = [
  [6,'A','150'],[7,'A','151'],[8,'A','152'],[9,'A','153'],[10,'A','154'],[11,'A','194-195'],[12,'A','155-156'],[13,'A','157,110'],
  [14,'A','158'],[15,'A','159'],[16,'C','160'],[17,'A','161'],[18,'C','162'],[19,'C','163'],[22,'C','139'],[23,'C','124-127'],
  [24,'A','170-171'],[25,'C','14,56-59'],[26,'A','169'],[27,'A','169'],[28,'A','169-170'],[30,'C','15,61,141-142'],[32,'A','170-171'],
  [33,'A','165,172'],[34,'C','134-137'],[35,'C','16,70-75'],[37,'C','20,88-94,126-127,129-132'],[38,'A','172,120-122'],
  [39,'C','74-75'],[40,'C','73,77-80'],[41,'C','110-115'],[42,'A','166-167'],[44,'A','31-35'],[45,'A','36-38'],[46,'A','40-43'],
  [47,'A','56-59'],[48,'A','61-62'],[49,'A','66-73'],[52,'A','91-94'],[53,'A','96-98,102-103'],[54,'A','124-127'],[56,'A','134-137'],
  [57,'A','135-137'],[58,'A','113'],[60,'A','117-120'],[61,'A','120'],[62,'A','160'],[65,'A','129-131'],
];
if (labels.length !== 48) throw new Error('not 48');
const lines = (spec) => spec.split(',').flatMap((r) => { const [a, b] = r.split('-').map(Number); return Array.from({ length: (b || a) - a + 1 }, (_, i) => a + i); });

const bText = fs.readFileSync(path.join(REPO, 'exo_memory/handback/p-leave-read-B_2026-09-14.md'), 'utf8');
const bRed = R.redact(bText, { words });
const [bL, rL] = [bText.split('\n'), bRed.split('\n')];
console.log(`B's read: ${bL.length} lines before, ${rL.length} after; tokens ${(bRed.match(/\[redacted\]/g) || []).length}; leaks left ${R.leaks(bRed, words).length}`);

let touched = 0;
const touchedLines = new Set();
for (const [c, lab, spec] of labels) {
  const changed = lines(spec).filter((n) => bL[n - 1] !== rL[n - 1]);
  if (changed.length) {
    touched++;
    for (const n of changed) touchedLines.add(n);
    console.log(`\nclaim ${c} ${lab}  cited ${spec}  changed ${changed.join(',')} of ${lines(spec).length}`);
    for (const n of changed) {
      const removed = [];
      for (const re of R.patterns(words)) for (const m of bL[n - 1].matchAll(re)) removed.push(m[0]);
      console.log(`   :${n} removed ${JSON.stringify(removed)}`);
      console.log(`      after: ${rL[n - 1].slice(0, 230)}`);
    }
  }
}
console.log(`\nlabels with >=1 cited line changed: ${touched} of 48; distinct cited lines changed: ${touchedLines.size}`);

// what the packet and E's hand-back lose, as counts only
for (const [name, text] of [
  ['packet @c59530a', execFileSync('git', ['-C', REPO, 'show', 'c59530a:exo_memory/loop/packet_leave_window_2026-09-14.md'], { encoding: 'utf8' })],
  ["E's hand-back", fs.readFileSync(path.join(REPO, 'exo_memory/handback/p-leave-E_2026-09-14.md'), 'utf8')],
]) {
  const out = R.redact(text, { words });
  const kinds = {};
  R.patterns(words).forEach((re, i) => { const n = [...text.matchAll(re)].length; if (n) kinds[i] = n; });
  console.log(`${name}: tokens ${(out.match(/\[redacted\]/g) || []).length}, lines changed ${text.split('\n').filter((l, i) => l !== out.split('\n')[i]).length} of ${text.split('\n').length}, leaks left ${R.leaks(out, words).length}, matches by pattern index ${JSON.stringify(kinds)}`);
}
// residual letters: bare capitals that are not A or I, left in B's redacted read
const bare = {};
for (const m of bRed.matchAll(/(?<![\w\-\/.])[B-HJ-Z](?![\w'\u2019])/g)) bare[m[0]] = (bare[m[0]] || 0) + 1;
console.log(`bare single capitals (not A, I) left in B's redacted read: ${JSON.stringify(bare)}`);
