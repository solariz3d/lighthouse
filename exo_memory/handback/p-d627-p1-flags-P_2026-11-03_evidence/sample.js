// sample.js <seed>: seeded, stratified (ISO week x seat) sample of 80 flagged rows from the first 3,364 rows of second-reader.jsonl (the 11-02 audit's denominator).
'use strict';
const fs = require('fs'), path = require('path');
const SEED = Number(process.argv[2]); const N = 80;
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(SEED);
const L = fs.readFileSync('C:/Consonance/data/second-reader.jsonl', 'utf8').split(/\n/).filter(Boolean).slice(0, 3364);
// session uuid -> instance dir, from transcript file names
const proj = 'C:/Users/nname/.claude/projects'; const seatOf = {};
for (const d of fs.readdirSync(proj)) { if (!d.startsWith('C--Consonance-instances-')) continue; for (const f of fs.readdirSync(path.join(proj, d))) if (f.endsWith('.jsonl')) seatOf[f.slice(0, -6)] = d.replace('C--Consonance-instances-', ''); }
const week = (ts) => { const d = new Date(ts); const day = (d.getUTCDay() + 6) % 7; const mon = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day)); return mon.toISOString().slice(0, 10); };
const pop = [];
L.forEach((l, i) => { const r = JSON.parse(l); if ((r.flags || []).length) pop.push({ line: i + 1, r, seat: seatOf[r.seat] || r.seat.slice(0, 8), wk: week(r.ts) }); });
const strata = {}; for (const p of pop) (strata[p.wk + '|' + p.seat] ||= []).push(p);
const keys = Object.keys(strata).sort();
const quota = keys.map((k) => ({ k, q: N * strata[k].length / pop.length }));
quota.forEach((x) => { x.n = Math.floor(x.q); }); let left = N - quota.reduce((a, x) => a + x.n, 0);
[...quota].sort((a, b) => (b.q - b.n) - (a.q - a.n) || (a.k < b.k ? -1 : 1)).slice(0, left).forEach((x) => { x.n++; });
const out = [];
for (const x of quota) { const a = strata[x.k].slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } out.push(...a.slice(0, x.n)); }
out.sort((a, b) => a.line - b.line);
console.error(`population ${pop.length} flagged rows of ${L.length}; strata ${keys.length}; sample ${out.length}; seed ${SEED}`);
const bySeat = {}; out.forEach((o) => { bySeat[o.seat] = (bySeat[o.seat] || 0) + 1; }); console.error(JSON.stringify(bySeat));
const byWk = {}; out.forEach((o) => { byWk[o.wk] = (byWk[o.wk] || 0) + 1; }); console.error(JSON.stringify(byWk));
for (const o of out) console.log(JSON.stringify({ line: o.line, ts: o.r.ts, seat: o.seat, session: o.r.seat, tool: o.r.tool, ringSha: o.r.ringSha, flags: o.r.flags }));
