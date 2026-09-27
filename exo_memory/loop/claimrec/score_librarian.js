// The librarian's independent re-score of the claim-recognition run (L117), written from the registration's §3-§5 text,
// not from claimrec.js's score(). Reads the coder maps and the sealed key; prints HIT, COST (per item, median, pooled),
// the exact hypergeometric chance baseline, LIFT, Clopper-Pearson intervals, and the DG checks.
// Usage: node score_librarian.js <packetsDir> <unitkey.json>
const fs = require('fs'), path = require('path');
const [dir, keyPath] = process.argv.slice(2);
const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
const lnC = (n, k) => { if (k < 0 || k > n) return -Infinity; let s = 0; for (let i = 1; i <= k; i++) s += Math.log(n - k + i) - Math.log(i); return s; };
const chance = (n, k, f) => (f === 0 ? 0 : 1 - Math.exp(lnC(n - k, f) - lnC(n, f)));
const binTail = (n, k, p) => { let s = 0; for (let i = k; i <= n; i++) s += Math.exp(lnC(n, i) + i * Math.log(p) + (n - i) * Math.log(1 - p)); return s; };
function cp(x, n) {
  const bis = (fn) => { let lo = 0, hi = 1; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; fn(m) ? (hi = m) : (lo = m); } return (lo + hi) / 2; };
  const lower = x === 0 ? 0 : bis((p) => binTail(n, x, p) >= 0.025);
  const upper = x === n ? 1 : bis((p) => 1 - binTail(n, x + 1, p) <= 0.025);
  return [lower, upper];
}
const median = (a) => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

const maps = fs.readdirSync(dir).filter((f) => f.endsWith('.map.json')).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
let stmts = 0, unmapped = 0, allCost = [], rows = [];
for (const m of maps) {
  const flagged = new Set();
  for (const s of m.statements) { stmts++; if (!s.final || s.final.length === 0) unmapped++; (s.final || []).forEach((u) => flagged.add(u)); }
  const n = m.totalUnits, f = flagged.size, cost = f / n;
  allCost.push(cost);
  if (key[m.id]) {
    const k = key[m.id].length, hit = key[m.id].some((u) => flagged.has(u));
    rows.push({ id: m.id, n, f, k, cost, hit, ch: chance(n, k, f), keyShare: k / n });
  }
}
const hits = rows.filter((r) => r.hit).length, N = rows.length;
const expChance = rows.reduce((s, r) => s + r.ch, 0) / N;
const pooledF = rows.reduce((s, r) => s + r.f, 0), pooledN = rows.reduce((s, r) => s + r.n, 0);
const [lo, hi] = cp(hits, N);
console.log(`items ${maps.length} · scored (keyed) ${N}`);
for (const r of rows) console.log(`${r.id} ${r.hit ? 'HIT ' : 'MISS'} n=${r.n} f=${r.f} k=${r.k} COST=${r.cost.toFixed(3)} chance=${r.ch.toFixed(3)}`);
console.log(`HIT ${hits}/${N} = ${(hits / N).toFixed(3)} (CP95 ${lo.toFixed(3)}-${hi.toFixed(3)})`);
console.log(`median COST, scored items ${median(rows.map((r) => r.cost)).toFixed(3)} · all ${maps.length} items ${median(allCost).toFixed(3)} · pooled scored ${(pooledF / pooledN).toFixed(3)}`);
console.log(`expected chance hit rate ${expChance.toFixed(3)} · LIFT ${(hits / N - expChance).toFixed(3)}`);
console.log(`DG1 median COST >= 0.80: ${median(rows.map((r) => r.cost)) >= 0.8} · DG3 unmapped ${unmapped}/${stmts} = ${(unmapped / stmts).toFixed(3)} (>0.20: ${unmapped / stmts > 0.2}) · DG4 key > 1/3 of units: ${rows.filter((r) => r.keyShare > 1 / 3).length}/${N}`);
