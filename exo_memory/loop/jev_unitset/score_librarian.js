// Librarian's scorer for L113 (Jev research R2+R3 on L's sealed 56-unit set). Reads only sealed/sheet/rows files.
const fs = require('fs');
const [keyP, exP, bP, cP, eP] = process.argv.slice(2);
const key = JSON.parse(fs.readFileSync(keyP, 'utf8')).units;
const ex = JSON.parse(fs.readFileSync(exP, 'utf8'));
const sheet = p => { const m = {}; for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) { const c = l.split('\t'); if (c.length >= 3 && /^\d+$/.test(c[0])) m[+c[0]] = { v: c[2].trim().toLowerCase(), rec: (c[3] || '').trim().toLowerCase() === 'yes' }; } return m; };
const B = sheet(bP), C = sheet(cP);
const rows = fs.readFileSync(eP, 'utf8').trim().split('\n').map(l => JSON.parse(l));
const bySha = {}; for (const u of key) bySha[u.prompt_sha256] = u.n;
const V = {}; for (const r of rows) { const n = bySha[r.unit]; if (n == null || r.status !== 'ok') continue; (V[r.variant] = V[r.variant] || {})[n] = r.verdict; }
const J = {}; for (const u of key) J[u.n] = u.jev.choice;
const kind = {}; for (const u of key) kind[u.n] = u.kind;
const drop = { B: new Set(ex.B.own_moves.concat(ex.B.pre_exposed)), C: new Set(ex.C.own_moves.concat(ex.C.pre_exposed)) };
const cats = ['clean', 'drift', 'abstain'];
function kap(a, b, ids) { ids = ids.filter(i => a[i] && b[i]); const n = ids.length; if (!n) return { n: 0 }; let ag = 0, pe = 0; for (const i of ids) if (a[i] === b[i]) ag++; for (const c of cats) pe += (ids.filter(i => a[i] === c).length / n) * (ids.filter(i => b[i] === c).length / n); const po = ag / n; return { n, agree: ag, pct: +(100 * po).toFixed(1), kappa: pe === 1 ? null : +((po - pe) / (1 - pe)).toFixed(3) }; }
const all = key.map(u => u.n);
const Bv = {}, Cv = {}; for (const n of all) { if (B[n]) Bv[n] = B[n].v; if (C[n]) Cv[n] = C[n].v; }
const okB = all.filter(n => !drop.B.has(n)), okC = all.filter(n => !drop.C.has(n)), okBC = all.filter(n => !drop.B.has(n) && !drop.C.has(n));
const recB = new Set(all.filter(n => B[n] && B[n].rec)), recC = new Set(all.filter(n => C[n] && C[n].rec));
const out = {};
out.pairs = { 'B-C': kap(Bv, Cv, okBC), 'Jev(stored)-B': kap(J, Bv, okB), 'Jev(stored)-C': kap(J, Cv, okC), 'Jev(stored)-V0(fresh)': kap(J, V.V0 || {}, all) };
out.pairs_unrecognised = { 'B-C': kap(Bv, Cv, okBC.filter(n => !recB.has(n) && !recC.has(n))), 'Jev-B': kap(J, Bv, okB.filter(n => !recB.has(n))), 'Jev-C': kap(J, Cv, okC.filter(n => !recC.has(n))) };
const dist = (m, ids) => { const d = { clean: 0, drift: 0, abstain: 0 }; for (const i of ids) if (m[i]) d[m[i]]++; return d; };
const P_ = all.filter(n => kind[n] === 'personal'), W_ = all.filter(n => kind[n] === 'work');
out.by_kind = {};
for (const [k, ids] of [['personal', P_], ['work', W_]]) out.by_kind[k] = { n: ids.length, Jev: dist(J, ids), B: dist(Bv, ids.filter(n => !drop.B.has(n))), C: dist(Cv, ids.filter(n => !drop.C.has(n))), 'Jev-B': kap(J, Bv, ids.filter(n => !drop.B.has(n))), 'Jev-C': kap(J, Cv, ids.filter(n => !drop.C.has(n))), 'B-C': kap(Bv, Cv, ids.filter(n => !drop.B.has(n) && !drop.C.has(n))) };
out.variants = {};
for (const v of Object.keys(V).sort()) { const m = V[v]; out.variants[v] = { answered: Object.keys(m).length, vsV0_changed: all.filter(n => m[n] && V.V0 && V.V0[n] && m[n] !== V.V0[n]).length, personal: dist(m, P_), work: dist(m, W_), vsB: kap(m, Bv, okB), vsC: kap(m, Cv, okC) }; }
console.log(JSON.stringify(out, null, 1));
