// dump.js (pane E, D303 part 3): print the census units of one population as plain text, for reading.
//   node dump.js <units.json> <q3|q2> [ids...]
// The populations are B's §1 lists (unchecked_claims_registration_2026-10-11.md at f2597aa9), copied here verbatim.
'use strict';
const fs = require('fs');
const r =(a, b) => Array.from({ length: b - a + 1 }, (_, i) => 'W' + String(a + i).padStart(3, '0'));
const NA = ['W001', 'W004', 'W005', 'W008', 'W009', 'W013', 'W015', 'W017', 'W024', 'W025', 'W027', 'W031', 'W037', 'W040', 'W043', 'W046', 'W048',
  'W052', 'W055', 'W057', 'W061', 'W063', ...r(65, 71), 'W072', ...r(74, 77), 'W081', 'W083', ...r(93, 95), 'W098', 'W099'];
const X = ['W002', 'W003', 'W006', 'W010', 'W011', 'W012', 'W014', 'W016', 'W018', 'W019', 'W020', 'W021', 'W022', 'W028', 'W029', 'W032', 'W034',
  'W035', 'W038', 'W059', 'W062', 'W082', 'W084', 'W088', 'W090', 'W092', 'W096', 'W100', 'W101'];
const ND = ['W026', 'W033', 'W036', 'W041', 'W042', 'W047', 'W064', 'W073', 'W079', 'W080', 'W089'];
const UC = ['W044', 'W049', 'W053', 'W054', 'W056', 'W058', 'W097'];
module.exports = { NA, X, ND, UC };
if (require.main !== module) return;
const [file, which, ...only] = process.argv.slice(2);
const u = JSON.parse(fs.readFileSync(file, 'utf8'));
const pop = which === 'q2' ? NA : [...X, ...ND, ...UC];
const ids = only.length ? only : pop;
for (const id of ids) {
  const x = u.units.find((y) => y.id === id);
  if (!x) { console.log(`## ${id}: NOT IN units.json`); continue; }
  const t = x.transcript || {};
  console.log(`## ${id}  [${X.includes(id) ? 'X' : ND.includes(id) ? 'ND' : UC.includes(id) ? 'UC' : NA.includes(id) ? 'NA' : '?'}]  seat: ${x.seat_by_filename}  finder: ${x.finder}`);
  console.log(`at: ${x.correction_at}  t_err: ${x.t_err} (${x.t_err_basis})  sha<t_err: ${x.sha_before_t_err_committer_date}`);
  console.log(`CORRECTION: ${x.correction_text}`);
  if (x.claim_text) console.log(`CLAIM (${x.claim_at}): ${x.claim_text}`);
  if (x.cited_refs && x.cited_refs.length) console.log(`refs: ${JSON.stringify(x.cited_refs).slice(0, 600)}`);
  console.log(`transcript: ${t.status}${t.claim ? ' claim=' + JSON.stringify(t.claim).slice(0, 400) : ''}${t.correction_turn ? ' corr=' + JSON.stringify(t.correction_turn).slice(0, 300) : ''}${t.why ? ' why=' + t.why : ''}`);
  console.log('');
}
