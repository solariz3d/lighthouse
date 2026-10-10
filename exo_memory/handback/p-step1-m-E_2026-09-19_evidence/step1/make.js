// make.js — D084: dev/diversity/score-step1.mjs from dev/diversity/score.mjs by anchored replacements.
// Each anchor must match exactly once; the target must not exist; score.mjs's sha is printed on both sides.
const fs = require('fs'), crypto = require('crypto');
const R = 'C:/Users/nname/Desktop/lighthouse/dev/diversity/';
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
console.log('score.mjs before', sha(fs.readFileSync(R + 'score.mjs')));
let s = fs.readFileSync(R + 'score.mjs', 'utf8');
let bad = 0;
const rep = (id, a, b) => { const n = s.split(a).length - 1; if (n !== 1) { console.log(`${id}: anchor x${n}`); bad++; return; } s = s.replace(a, () => b); console.log(`${id}: applied`); };

// H — header: what step 1 adds, beside step 0's own header. Documentation only.
rep('H', "// Run: node --require ./block-net.cjs score-step0.mjs   (writes results-step0.json; prints a summary)\n",
`// Run: node --require ./block-net.cjs score-step0.mjs   (writes results-step0.json; prints a summary)
// STEP 1 DIFF (E, D084): the committed step-0 scorer (dev/diversity/score.mjs, sha256 19c97ab5…) plus exactly two things —
//   (1) §8.11: the control gate reads passU (the six-phase U) instead of phase 0's pass;
//   (2) R8c's m_i for each P2 row, on R8e's U, with R8f's symmetric-in-version other-mean (every OTHER packet at the
//       own packet's parent; a packet absent there is left out and listed; a row with no other packet there has no
//       m_i, per the gap-closing paragraph), the row's own positive control (its own packet minus its first "## "
//       section, UNSTRIPPED) and negative control (p-harness-E against its own packet, stripped; p-leave-E for
//       packet_harness_and_lib). m = the median of the m_i. VOID rows are reported, never dropped.
// Every field step 0 wrote is still written. Output goes to results-step1.json.
// Run: node --require ./block-net.cjs score-step1.mjs   (writes results-step1.json; prints a summary)
`);

// G — (1) the gate reads passU. posPass/negPass are still computed and still reported.
rep('G', "if (!posPass || !negPass) {\n", "if (!results.controls.positive.passU || !results.controls.negative.passU) {   // STEP 1 (1): the gate reads U (§8.11)\n");

// O1/O2 — the output file is results-step1.json, so step 0's result is never overwritten.
rep('O1', "  results.verdict = 'INSTRUMENT FAILED';\n  fs.writeFileSync(path.join(here, 'results-step0.json'),", "  results.verdict = 'INSTRUMENT FAILED';\n  fs.writeFileSync(path.join(here, 'results-step1.json'),");

// D — declarations for (2), per row.
rep('D', "    const others = [], othersU = [], othersSens = [], voids = [];\n",
"    const others = [], othersU = [], othersSens = [], voids = [];\n    const othersSymU = [], symAbsent = [], symVoids = [];   // STEP 1 (2): R8f, every other packet at the parent\n");

// P — the parent loop keeps U as well as the primary, and records what is absent or void.
rep('P', "      if (atParent != null) { const ss = await scorePair(H, atParent); if (!ss.void) othersSens.push(ss.primary); }\n",
`      if (atParent == null) symAbsent.push(path.basename(p));
      else { const ss = await scorePair(H, atParent); if (!ss.void) { othersSens.push(ss.primary); othersSymU.push(ss.U); } else symVoids.push(path.basename(p)); }
`);

// C — the row's own two controls and m_i, computed just before the row is pushed.
rep('C', "    const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;\n    rows.push({\n",
`    const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
    // STEP 1 (2): R8c's m_i = ΔU_sym / (U_pos − U_neg), all three on the six-phase U, all against the SAME own-packet text.
    const posText = firstSectionRemoved(ownText);
    const negRel = ownName === 'packet_harness_and_lib_2026-09-15' ? NEG_ALT_REL : NEG_REL;
    const posC = posText == null ? null : await scorePair(posText, ownText, { stripped: false });
    const negC = await scorePair(git(RUN, negRel), ownText);
    const step1 = { otherPacketsAtParent: othersSymU.length, absentAtParent: symAbsent, voidAtParent: symVoids,
      negControl: negRel, posRemovedLines: posText == null ? null : firstSectionLines(ownText),
      Upos: posC && !posC.void ? u6(posC) : null, Uneg: !negC.void ? u6(negC) : null, negShare: r4(negC.hbShare ?? (negC.hb && negC.hb.share)) };
    if (!othersSymU.length) Object.assign(step1, { void: true, reason: 'no other packet present at the parent (R8f gap-closing paragraph, :390)' });
    else if (posC == null) Object.assign(step1, { void: true, reason: 'own packet has no "## " section to remove: no positive control' });
    else if (posC.void) Object.assign(step1, { void: true, reason: 'positive control pair void (R8i)' });
    else if (negC.void) Object.assign(step1, { void: true, reason: 'negative control pair void (strip > 50% or empty, R8i)' });
    else if (!(posC.U > negC.U)) Object.assign(step1, { void: true, reason: 'the row\\'s own controls invert (U_pos <= U_neg): no scale' });
    else {
      const dSym = ownScore.U - mean(othersSymU), scale = posC.U - negC.U;
      Object.assign(step1, { void: false, otherMeanSymU: r4(mean(othersSymU)), deltaSymU: r4(dSym), scale: r4(scale), m_i: r4(dSym / scale), m_i_raw: dSym / scale });
    }
    rows.push({
      step1,
`);

// V — own-pair VOID rows carry a step1 block too, so the table has all 21 lines.
rep('V', "    if (ownScore.void) { rows.push({ handback: rel, void: true, reason: 'own pair void', hbShare: r4(ownScore.hbShare) }); continue; }\n",
"    if (ownScore.void) { rows.push({ handback: rel, void: true, reason: 'own pair void', hbShare: r4(ownScore.hbShare), step1: { void: true, reason: 'own pair void (R8i / strip > 50%)' } }); continue; }\n");

// F — the helpers and the alternate negative, next to the existing NEG_REL.
rep('F', "const NEG_REL = 'exo_memory/handback/p-harness-E_2026-09-15.md';\n",
`const NEG_REL = 'exo_memory/handback/p-harness-E_2026-09-15.md';
// STEP 1 (2): R8c's exception, and the positive control generalised: the first "## " section, to the next "## " line.
const NEG_ALT_REL = 'exo_memory/handback/p-leave-E_2026-09-14.md';
function firstSectionBounds(text) {
  const L = text.split('\\n');
  const a = L.findIndex((l) => l.startsWith('## '));
  if (a < 0) return null;
  let b = L.findIndex((l, i) => i > a && l.startsWith('## '));
  if (b < 0) b = L.length;
  return { L, a, b };
}
function firstSectionRemoved(text) { const x = firstSectionBounds(text); return x ? [...x.L.slice(0, x.a), ...x.L.slice(x.b)].join('\\n') : null; }
function firstSectionLines(text) { const x = firstSectionBounds(text); return x ? \`\${x.a + 1}-\${x.b}\` : null; }
`);

// M — m, the median of the non-void m_i, with every void row listed.
rep('M', "results.verdict = 'controls passed';\n",
`// STEP 1 (2): m.
const mRows = rows.filter((r) => r.step1 && !r.step1.void);
const mi = mRows.map((r) => r.step1.m_i_raw);
results.step1 = {
  rule: 'R8c m_i = deltaSymU / (Upos - Uneg); R8e six-phase U; R8f others at the own packet\\'s parent; m = median(m_i)',
  gate: { positivePassU: results.controls.positive.passU, negativePassU: results.controls.negative.passU },
  m: mi.length ? r4(q(mi, 0.5)) : null, n: mi.length,
  distribution: mi.length ? { min: r4(Math.min(...mi)), q1: r4(q(mi, 0.25)), median: r4(q(mi, 0.5)), q3: r4(q(mi, 0.75)), max: r4(Math.max(...mi)) } : null,
  table: rows.map((r) => ({ handback: r.handback, ownPacket: r.ownPacket || null, ownSha: r.ownSha || null, flag: r.flag || null,
    ownU: r.ownU ? r.ownU.U : null, ...r.step1, m_i_raw: undefined })),
  void: rows.filter((r) => !r.step1 || r.step1.void).map((r) => ({ handback: r.handback, reason: r.step1 ? r.step1.reason : 'no step1 block' })),
};
results.verdict = 'controls passed';
`);

// O2 — the final write and the summary.
rep('O2', "fs.writeFileSync(path.join(here, 'results-step0.json'), JSON.stringify(results, null, 2));\nconsole.log(JSON.stringify({ controls: results.controls,",
"fs.writeFileSync(path.join(here, 'results-step1.json'), JSON.stringify(results, null, 2));\nconsole.log(JSON.stringify({ step1_m: results.step1.m, step1_n: results.step1.n, step1_distribution: results.step1.distribution, step1_void: results.step1.void, controls: results.controls,");

if (bad) { console.log(bad + ' anchor(s) failed — nothing written'); process.exit(1); }
if (fs.existsSync(R + 'score-step1.mjs')) { console.log('score-step1.mjs exists — refused'); process.exit(1); }
fs.writeFileSync(R + 'score-step1.mjs', s, { flag: 'wx' });
console.log('score.mjs after ', sha(fs.readFileSync(R + 'score.mjs')));
console.log('score-step1.mjs ', sha(fs.readFileSync(R + 'score-step1.mjs')));
