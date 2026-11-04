// section.js (D622, O): read-only. Along x at the crossing (|z - Z| < 1), per 2 m of x: the highest point of p41's/p39's apron, the lowest of p38's road,
// and the lowest of p38's hull (UNDERSKIN/APRONSIDE). node section.js <kn5> [Z]
'use strict';
const { readKn5Full } = require('C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-36313935/c88002b1-74d8-4036-8cc0-f64aefbeabff/scratchpad/d593/kn5full.js');
const [, , KN5, ZS = '-474.3'] = process.argv, Z = +ZS, kn = readKn5Full(KN5);
const groups = { apron: /^1ROAD_APRON_p(39|41)_/, road38: /^1ROAD_p38_/, hull38: /^(UNDERSKIN|APRONSIDE)_p38_/, apron38: /^1ROAD_APRON_p38_/ };
const rows = new Map();
for (const m of kn.meshes) for (const [g, re] of Object.entries(groups)) { if (!re.test(m.name)) continue;
  const P = m.pos; for (let i = 0; i < P.length / 3; i++) { const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2]; if (Math.abs(z - Z) > 1 || x < 8 || x > 56) continue;
    const k = Math.round(x / 2) * 2; if (!rows.has(k)) rows.set(k, {}); const r = rows.get(k);
    if (g === 'apron') r[g] = Math.max(r[g] ?? -1e9, y); else r[g] = Math.min(r[g] ?? 1e9, y); } }
const f = (v) => (v === undefined ? '   -   ' : v.toFixed(2).padStart(7));
console.log('   x   apron(top) road38(low) apron38(low) hull38(low)');
for (const k of [...rows.keys()].sort((a, b) => a - b)) { const r = rows.get(k); console.log(String(k).padStart(4), f(r.apron), f(r.road38), f(r.apron38), f(r.hull38)); }
