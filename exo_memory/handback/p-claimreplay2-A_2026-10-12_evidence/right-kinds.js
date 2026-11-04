// right-kinds.js (seat A, D305 item 8): for each message of the right-claim list, the kinds its claims carry in the B and C verdict files, and whether a replay report refused it.
// GATHERS ONLY. B's registration section 1 splits RIGHT-CHECKED from RIGHT-UNCHECKED by claim; a claim judged by one verifier has that verifier's kind; a claim whose kind differs between B and C (a NOT A CLAIM counts as a kind) is in neither group.
//   node right-kinds.js <report.md> > out.tsv        (the report's right-claim table lists the refused message ids)
'use strict';
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const dir = path.join(root, 'exo_memory', 'loop', 'remeasure_2026-10-10');
const rows = (p) => JSON.parse(fs.readFileSync(p, 'utf8')).rows;
const B = rows(path.join(dir, 'B', 'verdicts.json')), C = rows(path.join(dir, 'C', 'verdicts.json'));
const list = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'p-claimharness-A_2026-10-11_evidence', 'lists', 'right-claims.json'), 'utf8')).messages;
const rep = fs.readFileSync(process.argv[2], 'utf8');
const sec = rep.split('## Right-claim sample')[1].split('\n## ')[0];
const refused = new Set([...sec.matchAll(/^\| (msg_[A-Za-z0-9]+) \|/gm)].map((m) => m[1]));
const by = {};
for (const [who, rs] of [['B', B], ['C', C]]) for (const r of rs) { const [m] = r.claimId.split('|'); ((by[m] = by[m] || {})[r.claimId] = by[m][r.claimId] || {})[who] = r; }
console.log(['messageId', 'seat', 'refused', 'right_checked', 'right_unchecked', 'kind_differs_or_one_verifier'].join('\t'));
let tot = { n: 0, refChecked: 0, withChecked: 0, withUnchecked: 0, refUnchecked: 0 };
for (const x of list) {
  let rc = 0, ru = 0, ex = 0;
  for (const c of Object.values(by[x.messageId] || {})) {
    const present = [c.B, c.C].filter(Boolean);
    const right = present.some((r) => r.verdict === 'CORRECT') && !present.some((r) => r.verdict === 'WRONG');
    if (!right) continue;
    const kinds = new Set(present.map((r) => r.kind));
    if (kinds.size === 1) { if (kinds.has('CHECKED')) rc++; else ru++; } else ex++;
  }
  const ref = refused.has(x.messageId);
  tot.n++; if (rc) { tot.withChecked++; if (ref) tot.refChecked++; } if (ru) { tot.withUnchecked++; if (ref) tot.refUnchecked++; }
  console.log([x.messageId, x.seat, ref ? 'refused' : 'allowed', rc, ru, ex].join('\t'));
}
console.error(`messages ${tot.n}; with >=1 RIGHT-CHECKED claim ${tot.withChecked}, of which refused ${tot.refChecked}; with >=1 RIGHT-UNCHECKED claim ${tot.withUnchecked}, of which refused ${tot.refUnchecked} (a message can be in both)`);
