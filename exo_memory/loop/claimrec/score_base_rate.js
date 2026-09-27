// L120 base-rate scorer (librarian, the non-author). Implements claim_base_rate_registration_2026-09-27.md §5, §8, §9.
// Usage: node score_base_rate.js <B verdicts.json> <C verdicts.json>
const fs = require('fs'), crypto = require('crypto');
const load = (p) => { const v = JSON.parse(fs.readFileSync(p, 'utf8')); return v.rows || v.claims; };
const K = (k) => { k = String(k || '').toUpperCase(); if (k.includes('NOT')) return 'NOTCLAIM'; if (k.includes('CHECKED') && !k.includes('UNCHECKED')) return 'CHECKED'; if (k.includes('CONCLUSION')) return 'CONCLUSION'; if (k.includes('STATE')) return 'STATE'; return 'UNKNOWN:' + k; };
const V = (v) => (v ? String(v).toUpperCase() : null);
const B = load(process.argv[2]), C = load(process.argv[3]);
const byB = new Map(B.map((r) => [r.claimId, r])), byC = new Map(C.map((r) => [r.claimId, r]));
const overlap = [...byB.keys()].filter((id) => byC.has(id));

// §9 κ on the overlap, kind and verdict separately (verdict over claims both call claims).
function kappa(pairs) {
  const cats = [...new Set(pairs.flat())], n = pairs.length;
  const po = pairs.filter(([a, b]) => a === b).length / n;
  const pe = cats.reduce((s, c) => s + (pairs.filter((p) => p[0] === c).length / n) * (pairs.filter((p) => p[1] === c).length / n), 0);
  return { n, agree: po, kappa: (po - pe) / (1 - pe) };
}
const kindPairs = overlap.map((id) => [K(byB.get(id).kind), K(byC.get(id).kind)]);
const verdPairs = overlap.filter((id) => K(byB.get(id).kind) !== 'NOTCLAIM' && K(byC.get(id).kind) !== 'NOTCLAIM').map((id) => [V(byB.get(id).verdict), V(byC.get(id).verdict)]);
const kk = kappa(kindPairs), kv = kappa(verdPairs);

// Unique claims. Overlap resolution: verdict — §9's rule (UNVERIFIABLE wins a CORRECT/WRONG split; else agreement or
// the non-null one if one side routed it out). Kind — NOT fixed by §9; declared here: a kind split between the two
// unchecked kinds is kept in the pooled unchecked rate but excluded from per-kind rates; a split involving CHECKED or
// NOTCLAIM is excluded everywhere and counted.
const claims = [], kindSplits = { unchecked: 0, other: 0 };
const all = new Set([...byB.keys(), ...byC.keys()]);
for (const id of all) {
  const b = byB.get(id), c = byC.get(id);
  const msg = id.split('|')[0];
  if (b && c) {
    const kb = K(b.kind), kc = K(c.kind);
    let v = V(b.verdict) === V(c.verdict) ? V(b.verdict) : ((V(b.verdict) === 'CORRECT' && V(c.verdict) === 'WRONG') || (V(b.verdict) === 'WRONG' && V(c.verdict) === 'CORRECT') ? 'UNVERIFIABLE' : (V(b.verdict) === 'UNVERIFIABLE' || V(c.verdict) === 'UNVERIFIABLE' ? 'UNVERIFIABLE' : (V(b.verdict) || V(c.verdict))));
    if (kb === kc) claims.push({ id, msg, kind: kb, v });
    else if (['STATE', 'CONCLUSION'].includes(kb) && ['STATE', 'CONCLUSION'].includes(kc)) { kindSplits.unchecked++; claims.push({ id, msg, kind: 'UNCHECKED-SPLIT', v }); }
    else kindSplits.other++;
  } else { const r = b || c; claims.push({ id, msg, kind: K(r.kind), v: V(r.verdict) }); }
}

// Seeded RNG for the cluster bootstrap (§5: 2,000 resamples, seed "L119-boot").
let seed = crypto.createHash('sha256').update('L119-boot').digest().readUInt32LE(0);
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const lnC = (n, k) => { let s = 0; for (let i = 1; i <= k; i++) s += Math.log(n - k + i) - Math.log(i); return s; };
const tail = (n, k, p) => { let s = 0; for (let i = k; i <= n; i++) s += Math.exp(lnC(n, i) + i * Math.log(p) + (n - i) * Math.log(1 - p)); return s; };
const cp = (x, n) => { if (!n) return [NaN, NaN]; const bis = (f) => { let lo = 0, hi = 1; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; f(m) ? (hi = m) : (lo = m); } return (lo + hi) / 2; }; return [x === 0 ? 0 : bis((p) => tail(n, x, p) >= 0.025), x === n ? 1 : bis((p) => 1 - tail(n, x + 1, p) <= 0.025)]; };
const kinds = { CHECKED: ['CHECKED'], STATE: ['STATE'], CONCLUSION: ['CONCLUSION'], UNCHECKED: ['STATE', 'CONCLUSION', 'UNCHECKED-SPLIT'] };
const rate = (set, sel) => { const s = set.filter((c) => sel.includes(c.kind) && (c.v === 'CORRECT' || c.v === 'WRONG')); const w = s.filter((c) => c.v === 'WRONG').length; return { w, n: s.length, p: s.length ? w / s.length : NaN }; };
const msgs = [...new Set(claims.map((c) => c.msg))], byMsg = new Map(msgs.map((m) => [m, claims.filter((c) => c.msg === m)]));
function boot(fn) { const out = []; for (let i = 0; i < 2000; i++) { const s = []; for (let j = 0; j < msgs.length; j++) s.push(...byMsg.get(msgs[Math.floor(rnd() * msgs.length)])); const x = fn(s); if (!Number.isNaN(x)) out.push(x); } out.sort((a, b) => a - b); return [out[Math.floor(0.025 * out.length)], out[Math.floor(0.975 * out.length)]]; }

console.log(`claims B ${B.length} · C ${C.length} · overlap ${overlap.length} · unique ${all.size} · messages ${msgs.length}`);
console.log(`κ kind ${kk.kappa.toFixed(3)} (agree ${(kk.agree * 100).toFixed(1)}%, n ${kk.n}) · κ verdict ${kv.kappa.toFixed(3)} (agree ${(kv.agree * 100).toFixed(1)}%, n ${kv.n})`);
console.log(`overlap kind splits: between unchecked kinds ${kindSplits.unchecked} (kept pooled only) · involving CHECKED/NOTCLAIM ${kindSplits.other} (excluded)`);
for (const [name, sel] of Object.entries(kinds)) {
  const r = rate(claims, sel), [lo, hi] = cp(r.w, r.n), [blo, bhi] = boot((s) => rate(s, sel).p);
  const all_ = claims.filter((c) => sel.includes(c.kind)), unv = all_.filter((c) => c.v === 'UNVERIFIABLE').length;
  console.log(`P(wrong|${name}) = ${r.w}/${r.n} = ${r.p.toFixed(3)} · CP95 ${lo.toFixed(3)}-${hi.toFixed(3)} · boot95 ${blo.toFixed(3)}-${bhi.toFixed(3)} · UNVERIFIABLE ${unv}/${all_.length} = ${(unv / all_.length).toFixed(3)}${unv / all_.length > 1 / 3 ? ' UNVERIFIABLE-HEAVY' : ''}`);
}
const step = (a, b) => boot((s) => rate(s, kinds[a]).p - rate(s, kinds[b]).p);
const d1 = rate(claims, kinds.CONCLUSION).p - rate(claims, kinds.STATE).p, d2 = rate(claims, kinds.STATE).p - rate(claims, kinds.CHECKED).p;
const [s1lo, s1hi] = step('CONCLUSION', 'STATE'), [s2lo, s2hi] = step('STATE', 'CHECKED');
console.log(`step conclusion−state ${d1.toFixed(3)} boot95 ${s1lo.toFixed(3)}..${s1hi.toFixed(3)} ${s1lo > 0 ? 'SHOWN' : 'not shown'} · step state−checked ${d2.toFixed(3)} boot95 ${s2lo.toFixed(3)}..${s2hi.toFixed(3)} ${s2lo > 0 ? 'SHOWN' : 'not shown'}`);
const unch = claims.filter((c) => kinds.UNCHECKED.includes(c.kind)), unchV = unch.filter((c) => c.v === 'CORRECT' || c.v === 'WRONG').length;
const chk = claims.filter((c) => c.kind === 'CHECKED').length;
console.log(`DG1 UNVERIFIABLE share of unchecked ${(unch.filter((c) => c.v === 'UNVERIFIABLE').length / unch.length).toFixed(3)} (>0.50: ${unch.filter((c) => c.v === 'UNVERIFIABLE').length / unch.length > 0.5}) · DG2 verdict-bearing unchecked ${unchV} (<60: ${unchV < 60}) · DG3 κ verdict ${kv.kappa.toFixed(3)} (<0.40: ${kv.kappa < 0.4}) · CHECKED claims ${chk} (<15 partial: ${chk < 15})`);
