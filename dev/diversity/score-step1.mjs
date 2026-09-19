// P-DIVERSITY-C1 scoring — C. Implements PREREG-C1.txt (sha256 51ef51d3…) against draft §8.2 + §8.7 R1–R4.
// STEP 0 DIFF (E, D064): C's run-2 scorer (sha256 ecf03768…33eafb) plus exactly two things —
//   (1) §8.8.1 R8e: U = the mean over the six frozen phases of the R3 PRIMARY, with the six-phase min and max, windows
//       cut by dev/diversity/phase-window.js (hash-checked), the same phase on both sides of every pair;
//   (2) §8.10 V1: the SECONDARY centroid token-weighted, reported per phase and as its six-phase mean.
// Every field C's run wrote is still written, from phase 0, unchanged. The U fields are added beside them, and so are
// the U-based control, prediction and P2 verdicts R8e says U replaces. Output goes to results-step0.json.
// Run: node --require ./block-net.cjs score-step0.mjs   (writes results-step0.json; prints a summary)
// STEP 1 DIFF (E, D084): the committed step-0 scorer (dev/diversity/score.mjs, sha256 19c97ab5…) plus exactly two things —
//   (1) §8.11: the control gate reads passU (the six-phase U) instead of phase 0's pass;
//   (2) R8c's m_i for each P2 row, on R8e's U, with R8f's symmetric-in-version other-mean (every OTHER packet at the
//       own packet's parent; a packet absent there is left out and listed; a row with no other packet there has no
//       m_i, per the gap-closing paragraph), the row's own positive control (its own packet minus its first "## "
//       section, UNSTRIPPED) and negative control (p-harness-E against its own packet, stripped; p-leave-E for
//       packet_harness_and_lib). m = the median of the m_i. VOID rows are reported, never dropped.
// Every field step 0 wrote is still written. Output goes to results-step1.json.
// Run: node --require ./block-net.cjs score-step1.mjs   (writes results-step1.json; prints a summary)
import { env, AutoTokenizer, AutoModel, Tensor } from '@huggingface/transformers';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const here = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
const RUN = '1e944ac';
const sha256 = (b) => crypto.createHash('sha256').update(b).digest('hex');

// ── the frozen strip, from its commit, hash-checked before use ──
const S40_PATH = path.join(here, 's40-strip@5a2d3c0.cjs');
const S40_SHA = '73917f673b7d98130fe8195cf953bd35c4fa3534dbf00c41da1492e039a4e087';
if (sha256(fs.readFileSync(S40_PATH)) !== S40_SHA) throw new Error('s40-strip copy does not hash to the committed file');
const { normalise, s40Strip } = createRequire(import.meta.url)(S40_PATH);

// ── STEP 0 (1): the frozen phase windowing, hash-checked before use ──
const PW_PATH = path.join(REPO, 'dev/diversity/phase-window.js');
const PW_SHA = 'ba98d63523530e60dc73ae7872104af8bb404d8cc24e459d9ade1913bbdc2cb5';
if (sha256(fs.readFileSync(PW_PATH)) !== PW_SHA) throw new Error('phase-window.js does not hash to the step-0 file');
const { PHASES, phaseWindows } = createRequire(import.meta.url)(PW_PATH);

// ── the frozen encoder, hash-checked before load ──
const MODELS = path.join(here, 'models');
const ONNX = path.join(MODELS, 'Alibaba-NLP/gte-base-en-v1.5/onnx/model_quantized.onnx');
const ONNX_SHA = 'e7f6af7a9457d4fdd3af220c68e9a37325aad7c2d306bbc855fe0d019c326509';
if (sha256(fs.readFileSync(ONNX)) !== ONNX_SHA) throw new Error('encoder file does not hash to the frozen model');
env.allowRemoteModels = false; env.localModelPath = MODELS; env.cacheDir = MODELS;
const ID = 'Alibaba-NLP/gte-base-en-v1.5';
const tok = await AutoTokenizer.from_pretrained(ID);
const model = await AutoModel.from_pretrained(ID, { dtype: 'q8' });
const special = Array.from(tok('', { add_special_tokens: true }).input_ids.data, Number); // [CLS, SEP]
const CLS = special[0], SEP = special[special.length - 1];
const WIN = 1800;

const git = (sha, rel) => execFileSync('git', ['-C', REPO, 'show', `${sha}:${rel}`], { encoding: 'utf8', maxBuffer: 64 << 20 });
const gitTry = (sha, rel) => { try { return git(sha, rel); } catch { return null; } };
const parentOf = (sha) => execFileSync('git', ['-C', REPO, 'rev-parse', '--short', `${sha}^`], { encoding: 'utf8' }).trim();
const firstAdd = (rel) => execFileSync('git', ['-C', REPO, 'log', '--diff-filter=A', '--format=%h', '--', rel], { encoding: 'utf8' }).trim().split('\n').pop();

// ── embedding: consecutive 1,800-id windows, CLS+SEP each, CLS pooling, L2 ──
const cache = new Map();
async function embedText(text, phase = 0) {
  const key = `${sha256(text)}:${phase}`;
  if (cache.has(key)) return cache.get(key);
  const ids = Array.from(tok(text, { add_special_tokens: false }).input_ids.data, Number);
  const windows = [];
  // STEP 0 (1): windows from phase-window.js; at phase 0 these are exactly C's (its test pins that, §8.2).
  for (const w of phaseWindows(ids, phase, { cls: CLS, sep: SEP })) {
    const body = w.ids.slice(1, -1);
    const seq = w.ids;
    const L = seq.length;
    const out = await model({
      input_ids: new Tensor('int64', BigInt64Array.from(seq.map(BigInt)), [1, L]),
      attention_mask: new Tensor('int64', new BigInt64Array(L).fill(1n), [1, L]),
      token_type_ids: new Tensor('int64', new BigInt64Array(L), [1, L]),
    });
    const D = out.last_hidden_state.dims[2];
    const v = Float64Array.from(out.last_hidden_state.data.slice(0, D));   // CLS = position 0
    let n = 0; for (const x of v) n += x * x; n = Math.sqrt(n);
    for (let d = 0; d < D; d++) v[d] /= n;
    windows.push({ v, t: body.length });
  }
  const r = { tokens: ids.length, windows };
  cache.set(key, r);
  return r;
}
const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };
function means(e) {
  const D = e.windows[0].v.length, mw = new Float64Array(D), mu = new Float64Array(D);
  const T = e.windows.reduce((s, w) => s + w.t, 0);
  for (const w of e.windows) for (let d = 0; d < D; d++) { mw[d] += w.t * w.v[d] / T; mu[d] += w.v[d] / e.windows.length; }
  return { mw, mu, absMu: Math.sqrt(dot(mu, mu)) };
}
async function scorePair(H, B, { stripped = true } = {}) {
  const hs = stripped ? s40Strip(H, B) : { text: normalise(H), share: 0, strippedChars: 0, normalisedChars: normalise(H).length };
  const bs = stripped ? s40Strip(B, H) : { text: normalise(B), share: 0, strippedChars: 0, normalisedChars: normalise(B).length };
  const v = hs.share > 0.5;
  if (v || !hs.text.trim() || !bs.text.trim()) return { void: true, hbShare: hs.share, brShare: bs.share };
  const eh = await embedText(hs.text), eb = await embedText(bs.text);
  const mh = means(eh), mb = means(eb);
  // STEP 0: every phase, the same phase on both sides. (1) R8e's U over the six PRIMARIES; (2) V1's token-weighted
  // centroid, cos of the two token-weighted mean vectors, per phase and as its six-phase mean.
  const phases = [];
  for (const ph of PHASES) {
    const ph_h = ph === 0 ? mh : means(await embedText(hs.text, ph));
    const ph_b = ph === 0 ? mb : means(await embedText(bs.text, ph));
    const p = dot(ph_h.mw, ph_b.mw);
    phases.push({ phase: ph, primary: p, centroidTW: p / (Math.sqrt(dot(ph_h.mw, ph_h.mw)) * Math.sqrt(dot(ph_b.mw, ph_b.mw))) });
  }
  const mean6 = (k) => phases.reduce((s, x) => s + x[k], 0) / phases.length;
  return {
    void: false,
    U: mean6('primary'),
    Umin: Math.min(...phases.map((x) => x.primary)),
    Umax: Math.max(...phases.map((x) => x.primary)),
    centroidTW: mean6('centroidTW'),
    phases,
    primary: dot(mh.mw, mb.mw),
    centroid: dot(mh.mu, mb.mu) / (mh.absMu * mb.absMu),
    hb: { share: hs.share, strippedChars: hs.strippedChars, normalisedChars: hs.normalisedChars, tokens: eh.tokens, windows: eh.windows.length, absM: mh.absMu },
    br: { share: bs.share, strippedChars: bs.strippedChars, normalisedChars: bs.normalisedChars, tokens: eb.tokens, windows: eb.windows.length, absM: mb.absMu },
  };
}
const r4 = (x) => (x == null ? null : +x.toFixed(4));
const results = { run: RUN, prereg: sha256(fs.readFileSync(path.join(here, 'PREREG-C1.txt'))), s40: S40_SHA, encoder: ONNX_SHA };

// ── P1 texts ──
const LEAVE = 'exo_memory/loop/packet_leave_window_2026-09-14.md';
const ANCHOR = git('ed73e76', LEAVE);
const P1 = {
  'B-read': { rel: 'exo_memory/handback/p-leave-read-B_2026-09-14.md', sha: '9e29daf' },
  'A': { rel: 'exo_memory/handback/p-leave-A_2026-09-14.md', sha: '99649d8' },
  'E': { rel: 'exo_memory/handback/p-leave-E_2026-09-14.md', sha: '99649d8' },
};
const p1 = {};
for (const [k, x] of Object.entries(P1)) {
  const H = git(x.sha, x.rel);
  const s = await scorePair(H, ANCHOR);
  const u = await scorePair(H, ANCHOR, { stripped: false });
  p1[k] = { path: x.rel, sha: x.sha, bytes: Buffer.byteLength(H), ...s, unstripped: u.primary };
}

// ── controls (R1) ──
const lines = ANCHOR.split('\n');
const s0 = lines.findIndex((l) => l.startsWith('## 0 '));
const s1 = lines.findIndex((l) => l.startsWith('## 1 '));
const nearCopy = [...lines.slice(0, s0), ...lines.slice(s1)].join('\n');
const pos = await scorePair(nearCopy, ANCHOR, { stripped: false });
const NEG_REL = 'exo_memory/handback/p-harness-E_2026-09-15.md';
// STEP 1 (2): R8c's exception, and the positive control generalised: the first "## " section, to the next "## " line.
const NEG_ALT_REL = 'exo_memory/handback/p-leave-E_2026-09-14.md';
function firstSectionBounds(text) {
  const L = text.split('\n');
  const a = L.findIndex((l) => l.startsWith('## '));
  if (a < 0) return null;
  let b = L.findIndex((l, i) => i > a && l.startsWith('## '));
  if (b < 0) b = L.length;
  return { L, a, b };
}
function firstSectionRemoved(text) { const x = firstSectionBounds(text); return x ? [...x.L.slice(0, x.a), ...x.L.slice(x.b)].join('\n') : null; }
function firstSectionLines(text) { const x = firstSectionBounds(text); return x ? `${x.a + 1}-${x.b}` : null; }
const neg = await scorePair(git(RUN, NEG_REL), ANCHOR);
const p1Primaries = Object.values(p1).map((r) => r.primary);
const posPass = !pos.void && p1Primaries.every((p) => pos.primary > p);
const negPass = !neg.void && p1Primaries.every((p) => neg.primary < p);
// STEP 0: U beside every PRIMARY, and the controls read on U too (R8e: U replaces the primary for both controls).
const u6 = (s) => ({ U: r4(s.U), Umin: r4(s.Umin), Umax: r4(s.Umax), centroidTW: r4(s.centroidTW), phases: s.phases.map((x) => ({ phase: x.phase, primary: r4(x.primary), centroidTW: r4(x.centroidTW) })) });
const p1U = Object.values(p1).map((r) => r.U);
results.controls = {
  positive: { removedLines: `${s0 + 1}-${s1}`, bytes: Buffer.byteLength(nearCopy), primary: r4(pos.primary), centroid: r4(pos.centroid), pass: posPass, ...u6(pos), passU: !pos.void && p1U.every((u) => pos.U > u) },
  negative: { path: NEG_REL, sha: RUN, primary: r4(neg.primary), centroid: r4(neg.centroid), hbShare: r4(neg.hb && neg.hb.share), pass: negPass, ...u6(neg), passU: !neg.void && p1U.every((u) => neg.U < u) },
};
results.p1 = Object.fromEntries(Object.entries(p1).map(([k, r]) => [k, {
  ...u6(r),
  path: r.path, sha: r.sha, bytes: r.bytes, void: r.void, primary: r4(r.primary), centroid: r4(r.centroid), unstripped: r4(r.unstripped),
  hb: r.hb && { strippedChars: r.hb.strippedChars, normalisedChars: r.hb.normalisedChars, share: r4(r.hb.share), tokens: r.hb.tokens, windows: r.hb.windows, absM: r4(r.hb.absM) },
  br: r.br && { strippedChars: r.br.strippedChars, normalisedChars: r.br.normalisedChars, share: r4(r.br.share), tokens: r.br.tokens, windows: r.br.windows, absM: r4(r.br.absM) },
}]));
if (!results.controls.positive.passU || !results.controls.negative.passU) {   // STEP 1 (1): the gate reads U (§8.11)
  results.verdict = 'INSTRUMENT FAILED';
  fs.writeFileSync(path.join(here, 'results-step1.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ verdict: results.verdict, controls: results.controls }, null, 2));
  process.exit(0);
}
const lowerBuild = Math.min(p1.A.primary, p1.E.primary);
results.p1_prediction = { B: r4(p1['B-read'].primary), lowerOfAE: r4(lowerBuild), margin_B_minus_lower: r4(p1['B-read'].primary - lowerBuild), fires: p1['B-read'].primary >= lowerBuild - 0.02 };
const lowerBuildU = Math.min(p1.A.U, p1.E.U);
results.p1_predictionU = { B: r4(p1['B-read'].U), lowerOfAE: r4(lowerBuildU), margin_B_minus_lower: r4(p1['B-read'].U - lowerBuildU), fires: p1['B-read'].U >= lowerBuildU - 0.02 };

// ── P2 (R4) ──
const PACKETS = ['packet_diverged_2026-09-14', 'packet_diversity_c0_2026-09-15', 'packet_harness_and_lib_2026-09-15',
  'packet_leave_window_2026-09-14', 'packet_no_console_windows_2026-09-14', 'packet_stick_build_2026-09-14',
  'packet_stick_module_2026-09-14', 'packet_stick_preflight_read_2026-09-14'].map((p) => `exo_memory/loop/${p}.md`);
const HB = {
  'packet_diverged_2026-09-14': ['p-diverged-A_2026-09-14', 'p-diverged-E_2026-09-14', 'p-diverged-read-C_2026-09-14', 'p-diverged-read2-C_2026-09-14'],
  'packet_diversity_c0_2026-09-15': ['p-diversity-c0-C_2026-09-15', 'p-diversity-c0-E_2026-09-15'],
  'packet_harness_and_lib_2026-09-15': ['p-harness-A_2026-09-15', 'p-harness-E_2026-09-15', 'p-harness-read-B_2026-09-15'],
  'packet_leave_window_2026-09-14': ['p-leave-A_2026-09-14', 'p-leave-E_2026-09-14', 'p-leave-read-B_2026-09-14', 'p-leave-read2-B_2026-09-14'],
  'packet_no_console_windows_2026-09-14': ['p-no-console-A_2026-09-14', 'p-no-console-E_2026-09-14'],
  'packet_stick_build_2026-09-14': ['p-stick-build-A_2026-09-14', 'p-stick-build-E_2026-09-14'],
  'packet_stick_module_2026-09-14': ['p-stick-A_2026-09-14', 'p-stick-E_2026-09-14'],
  'packet_stick_preflight_read_2026-09-14': ['p-stick-preflight-B_2026-09-14', 'p-stick-preflight-C_2026-09-14'],
};
const finalPacket = Object.fromEntries(PACKETS.map((p) => [p, git(RUN, p)]));
const rows = [];
for (const own of PACKETS) {
  const ownName = path.basename(own, '.md');
  for (const hbName of HB[ownName]) {
    const rel = `exo_memory/handback/${hbName}.md`;
    const H = git(RUN, rel);
    const add = firstAdd(rel);
    const parent = parentOf(add);
    let ownText = gitTry(parent, own), ownSha = parent, flag = null;
    if (ownText == null) { ownText = git(add, own); ownSha = add; flag = 'packet absent at parent; taken at first-add commit'; }
    const ownScore = await scorePair(H, ownText);
    if (ownScore.void) { rows.push({ handback: rel, void: true, reason: 'own pair void', hbShare: r4(ownScore.hbShare), step1: { void: true, reason: 'own pair void (R8i / strip > 50%)' } }); continue; }
    const others = [], othersU = [], othersSens = [], voids = [];
    const othersSymU = [], symAbsent = [], symVoids = [];   // STEP 1 (2): R8f, every other packet at the parent
    for (const p of PACKETS) {
      if (p === own) continue;
      const s = await scorePair(H, finalPacket[p]);
      if (s.void) voids.push(path.basename(p)); else { others.push(s.primary); othersU.push(s.U); }
      const atParent = gitTry(parent, p);
      if (atParent == null) symAbsent.push(path.basename(p));
      else { const ss = await scorePair(H, atParent); if (!ss.void) { othersSens.push(ss.primary); othersSymU.push(ss.U); } else symVoids.push(path.basename(p)); }
    }
    const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
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
    else if (!(posC.U > negC.U)) Object.assign(step1, { void: true, reason: 'the row\'s own controls invert (U_pos <= U_neg): no scale' });
    else {
      const dSym = ownScore.U - mean(othersSymU), scale = posC.U - negC.U;
      Object.assign(step1, { void: false, otherMeanSymU: r4(mean(othersSymU)), deltaSymU: r4(dSym), scale: r4(scale), m_i: r4(dSym / scale), m_i_raw: dSym / scale });
    }
    rows.push({
      step1,
      handback: rel, handbackSha: RUN, ownPacket: own, ownSha, landedAt: add, flag,
      own: r4(ownScore.primary), ownCentroid: r4(ownScore.centroid), ownHbShare: r4(ownScore.hb.share),
      ownHandbackText: { tokens: ownScore.hb.tokens, windows: ownScore.hb.windows, absM: r4(ownScore.hb.absM), strippedChars: ownScore.hb.strippedChars, normalisedChars: ownScore.hb.normalisedChars },
      ownBriefText: { tokens: ownScore.br.tokens, windows: ownScore.br.windows, absM: r4(ownScore.br.absM), strippedChars: ownScore.br.strippedChars, normalisedChars: ownScore.br.normalisedChars, share: r4(ownScore.br.share) },
      otherMean: r4(mean(others)), nOthers: others.length, otherVoids: voids,
      delta: r4(ownScore.primary - mean(others)),
      sensitivity_otherMeanAtParent: othersSens.length ? r4(mean(othersSens)) : null, sensitivity_nOthers: othersSens.length,
      sensitivity_delta: othersSens.length ? r4(ownScore.primary - mean(othersSens)) : null,
      ownU: u6(ownScore), otherMeanU: r4(mean(othersU)), deltaU: r4(ownScore.U - mean(othersU)),
    });
    process.stderr.write(`row ${rows.length}: ${hbName} delta=${rows[rows.length - 1].delta}\n`);
  }
}
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); const i = (s.length - 1) * p; const lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (s[hi] - s[lo]) * (i - lo); };
const deltas = rows.filter((r) => !r.void).map((r) => r.delta);
results.p2 = { rows, distribution: { n: deltas.length, min: r4(Math.min(...deltas)), q1: r4(q(deltas, 0.25)), median: r4(q(deltas, 0.5)), q3: r4(q(deltas, 0.75)), max: r4(Math.max(...deltas)) },
  excluded: [{ handback: 'exo_memory/handback/anchor-registration-read-B_2026-09-15.md', why: 'its brief is the registration DRAFT, not a packet in the set' },
    { handback: 'exo_memory/handback/readme-audit_2026-09-14.md', why: 'a Third Place hand-back at the keeper\'s ask; no packet' },
    { packet: 'exo_memory/loop/packet_diversity_c1_and_leave2_2026-09-15.md', why: 'R4: excluded (this measurement\'s own packet)' }] };
const sd = rows.filter((r) => !r.void && r.sensitivity_delta != null).map((r) => r.sensitivity_delta);
results.p2.sensitivity_distribution = sd.length ? { n: sd.length, min: r4(Math.min(...sd)), q1: r4(q(sd, 0.25)), median: r4(q(sd, 0.5)), q3: r4(q(sd, 0.75)), max: r4(Math.max(...sd)) } : null;
const du = rows.filter((r) => !r.void).map((r) => r.deltaU);
results.p2.distributionU = { n: du.length, min: r4(Math.min(...du)), q1: r4(q(du, 0.25)), median: r4(q(du, 0.5)), q3: r4(q(du, 0.75)), max: r4(Math.max(...du)) };
// STEP 1 (2): m.
const mRows = rows.filter((r) => r.step1 && !r.step1.void);
const mi = mRows.map((r) => r.step1.m_i_raw);
results.step1 = {
  rule: 'R8c m_i = deltaSymU / (Upos - Uneg); R8e six-phase U; R8f others at the own packet\'s parent; m = median(m_i)',
  gate: { positivePassU: results.controls.positive.passU, negativePassU: results.controls.negative.passU },
  m: mi.length ? r4(q(mi, 0.5)) : null, n: mi.length,
  distribution: mi.length ? { min: r4(Math.min(...mi)), q1: r4(q(mi, 0.25)), median: r4(q(mi, 0.5)), q3: r4(q(mi, 0.75)), max: r4(Math.max(...mi)) } : null,
  table: rows.map((r) => ({ handback: r.handback, ownPacket: r.ownPacket || null, ownSha: r.ownSha || null, flag: r.flag || null,
    ownU: r.ownU ? r.ownU.U : null, ...r.step1, m_i_raw: undefined })),
  void: rows.filter((r) => !r.step1 || r.step1.void).map((r) => ({ handback: r.handback, reason: r.step1 ? r.step1.reason : 'no step1 block' })),
};
results.verdict = 'controls passed';
fs.writeFileSync(path.join(here, 'results-step1.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify({ step1_m: results.step1.m, step1_n: results.step1.n, step1_distribution: results.step1.distribution, step1_void: results.step1.void, controls: results.controls, p1: results.p1, p1_prediction: results.p1_prediction, p1_predictionU: results.p1_predictionU, p2_distribution: results.p2.distribution, p2_distributionU: results.p2.distributionU, p2_sensitivity: results.p2.sensitivity_distribution }, null, 2));
