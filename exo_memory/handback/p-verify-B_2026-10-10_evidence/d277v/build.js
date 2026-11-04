// D277 step 6 (B): build verify/B/verdicts.json from the working log (the LAST row per claimId wins: two rows were superseded on purpose),
// cross-checked against claims.json: every claim judged exactly once, no stranger ids, kinds and verdicts from the registration's sets.
'use strict';
const fs = require('fs'), path = require('path');
const DIR = 'C:/Consonance/retrieval/remeasure1003/verify/B';
const { verifier, claims } = JSON.parse(fs.readFileSync(path.join(DIR, 'claims.json'), 'utf8'));
const rows = fs.readFileSync(path.join(__dirname, 'work.jsonl'), 'utf8').split(/\r?\n/).filter(Boolean).map((l, i) => { try { return JSON.parse(l); } catch (e) { throw new Error(`work.jsonl line ${i + 1}: ${e.message}`); } });
const last = new Map(); for (const r of rows) last.set(r.claimId, r);
const KINDS = new Set(['CHECKED', 'UNCHECKED CONCLUSION', 'UNCHECKED STATE', 'NOT A CLAIM']), VERDICTS = new Set(['CORRECT', 'WRONG', 'UNVERIFIABLE']);
const ids = new Set(claims.map((c) => c.claimId));
const stranger = [...last.keys()].filter((id) => !ids.has(id)), missing = claims.filter((c) => !last.has(c.claimId)).map((c) => c.claimId);
if (stranger.length || missing.length) throw new Error(`stranger ${JSON.stringify(stranger)} missing ${JSON.stringify(missing)}`);
const out = claims.map((c) => {
  const r = last.get(c.claimId);
  if (!KINDS.has(r.kind)) throw new Error(`${c.claimId}: kind ${r.kind}`);
  if (r.kind === 'NOT A CLAIM' ? r.verdict !== null : !VERDICTS.has(r.verdict)) throw new Error(`${c.claimId}: ${r.kind} with verdict ${r.verdict}`);
  return { claimId: c.claimId, seat: c.seat, kind: r.kind, verdict: r.verdict, note: r.note };
});
const doc = { verifier, by: 'pane B (machine D)', registration: 'exo_memory/loop/claim_base_rate_registration_2026-09-27.md §3, §4', claimsFile: 'claims.json sha256 f5d1689404b044b0bb8865a536a4ee55e25b457d1532ea56a0f8f58e393eb56d', started: process.env.STARTED, finished: process.env.FINISHED, rows: out };
fs.writeFileSync(path.join(DIR, 'verdicts.json'), JSON.stringify(doc, null, 1) + '\n');
const count = (f) => out.reduce((m, r) => { const k = f(r); m[k] = (m[k] || 0) + 1; return m; }, {});
console.log('rows', out.length, 'superseded', rows.length - last.size);
console.log('kind', JSON.stringify(count((r) => r.kind)));
console.log('kind x verdict', JSON.stringify(count((r) => `${r.kind} / ${r.verdict}`)));
console.log('seat x kind', JSON.stringify(count((r) => `${r.seat} / ${r.kind}`)));
console.log('WRONG', JSON.stringify(out.filter((r) => r.verdict === 'WRONG').map((r) => r.claimId)));
console.log('UNVERIFIABLE', JSON.stringify(out.filter((r) => r.verdict === 'UNVERIFIABLE').map((r) => r.claimId)));
