// D276: pane E's hand labels for every CONTENT-CHANGED refusal -> re-send pair, read word by word (worddiff.js), written down here so the counts
// re-derive from one run. Index = position in that gate's list of content-changed pairs, in ledger order (the order m1_*.js writes).
// Labels, one per pair (the dominant change):
//   PROBE         a deliberate test of the gate (excluded from every share)
//   CLAIM-DROP    a stated fact, figure, path:line or "checked" note was REMOVED or made vaguer, and nothing replaced it
//   CLAIM-FIX     a stated fact was CORRECTED, re-grounded in what was actually checked, or a missing check-based fact added
//   ADD           new content unrelated to the refused line (an instruction, a figure, a location the sender chose to add while re-sending)
//   CITE          a commit or path citation added to the body, no claim changed
//   META          a sentence about the refusal itself added ("the gate was right…"), the rest re-flowed
//   POINTER       only a path's spelling changed (absolute -> repo-relative, a bare path line dropped)
//   WORDING       re-phrasing with the same claims
//   FORMAT        a line moved into or out of the trailer, or an instruction the trailer now carries removed
// No message text is stored here: each row is the deny's ledger timestamp and the label.
'use strict';
const fs = require('fs');
const path = require('path');
const L = {
  sources: ['PROBE', 'META', 'PROBE', 'META', 'PROBE', 'PROBE', 'CLAIM-FIX', 'META', 'ADD', 'ADD', 'CLAIM-DROP', 'CLAIM-DROP', 'CLAIM-FIX', 'WORDING', 'ADD',
    'POINTER', 'ADD', 'POINTER', 'POINTER', 'CITE', 'POINTER', 'CLAIM-DROP', 'POINTER', 'CITE', 'CLAIM-DROP', 'POINTER', 'POINTER', 'CLAIM-DROP', 'CLAIM-FIX',
    'CLAIM-DROP', 'ADD', 'ADD', 'ADD', 'WORDING', 'POINTER', 'CLAIM-DROP', 'CLAIM-DROP', 'CLAIM-DROP', 'CLAIM-DROP', 'ADD', 'CLAIM-DROP', 'CLAIM-DROP',
    'WORDING', 'CLAIM-FIX', 'WORDING', 'CLAIM-DROP'],
  reply: ['CLAIM-FIX', 'CLAIM-DROP', 'META', 'META', 'META', 'CLAIM-DROP', 'META', 'META', 'META', 'CLAIM-DROP', 'CLAIM-DROP', 'META', 'META', 'CLAIM-FIX',
    'POINTER', 'CLAIM-DROP', 'WORDING', 'WORDING', 'CLAIM-FIX', 'WORDING', 'POINTER', 'CLAIM-FIX', 'WORDING'],
  trailer: ['PROBE', 'PROBE', 'PROBE', 'ADD', 'META', 'META', 'FORMAT', 'ADD', 'WORDING', 'WORDING', 'WORDING', 'CLAIM-DROP', 'WORDING', 'CLAIM-DROP', 'FORMAT'],
};
const D = __dirname;
const sets = {
  sources: require(path.join(D, 'm1_pairs.json')).filter((r) => r.foundDeny && r.foundAllow && !r.contentSame),
  reply: require(path.join(D, 'm1_reply_pairs.json')).filter((r) => r.contentSame === false),
  trailer: require(path.join(D, 'm1_trailer_pairs.json')).filter((r) => r.contentSame === false),
};
const all = {
  sources: require(path.join(D, 'm1_pairs.json')).filter((r) => r.foundDeny && r.foundAllow),
  reply: require(path.join(D, 'm1_reply_pairs.json')).filter((r) => r.found && r.foundNext),
  trailer: require(path.join(D, 'm1_trailer_pairs.json')).filter((r) => r.found && r.foundRe),
};
const out = { rows: {}, summary: {} };
for (const g of Object.keys(L)) {
  if (L[g].length !== sets[g].length) throw new Error(`${g}: ${L[g].length} labels for ${sets[g].length} changed pairs`);
  out.rows[g] = sets[g].map((r, i) => ({ i, ts: r.ts, tool: r.tool || r.seat, label: L[g][i] }));
  const c = {}; for (const x of L[g]) c[x] = (c[x] || 0) + 1;
  const probes = c.PROBE || 0, pairs = all[g].length - probes, changed = sets[g].length - probes;
  out.summary[g] = { recoveredPairs: all[g].length, probes, pairsExProbes: pairs, contentChanged: changed, contentChangedPct: +(changed / pairs * 100).toFixed(1),
    claimDrop: c['CLAIM-DROP'] || 0, claimFix: c['CLAIM-FIX'] || 0, claimPct: +(((c['CLAIM-DROP'] || 0) + (c['CLAIM-FIX'] || 0)) / pairs * 100).toFixed(1), labels: c };
}
const s = Object.values(out.summary), sum = (k) => s.reduce((a, b) => a + b[k], 0);
out.summary.pooled = { pairsExProbes: sum('pairsExProbes'), contentChanged: sum('contentChanged'), contentChangedPct: +(sum('contentChanged') / sum('pairsExProbes') * 100).toFixed(1),
  claimDrop: sum('claimDrop'), claimFix: sum('claimFix'), claimPct: +((sum('claimDrop') + sum('claimFix')) / sum('pairsExProbes') * 100).toFixed(1),
  claimFixPct: +(sum('claimFix') / sum('pairsExProbes') * 100).toFixed(1) };
fs.writeFileSync(path.join(D, 'labels.json'), JSON.stringify(out.rows, null, 1));
console.log(JSON.stringify(out.summary, null, 1));
