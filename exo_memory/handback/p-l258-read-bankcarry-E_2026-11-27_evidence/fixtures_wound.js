// fixtures_wound.js <tree>: the builder's own test tracks (test/fixtures, the set G7 round-trips): each one's head bank, open or closed; for the open ones
// wound past a turn, the panel mounted on it with the bank typed at the shown value + 10 and Extend pressed, the bank it lays (no names: index only)
'use strict';
const path = require('path'), fs = require('fs'); const T = path.resolve(process.argv[2]); const R = (p) => require(path.join(T, p));
const D = R('src/core/document.js'), HD = R('app/core/handles.js'); const DEG = Math.PI / 180;
const dir = path.join(T, 'test/fixtures'), files = fs.readdirSync(dir).filter((f) => /\.(core2\.json|t180track)$/.test(f)).sort();
const out = [];
files.forEach((f, i) => { try { const d = D.parse(fs.readFileSync(path.join(dir, f), 'utf8')); if (!d.pieces || !d.pieces.length) { out.push({ i, empty: true }); return; } const P = d.pieces[d.pieces.length - 1]; const h = D.channelAt(P, 'phi', P.length).v / DEG; let mx = 0; for (const Q of d.pieces) for (let s = 0; s <= Q.length; s += 5) mx = Math.max(mx, Math.abs(D.channelAt(Q, 'phi', Math.min(s, Q.length)).v / DEG)); out.push({ i, closed: !!d.closed, head: Math.round(h * 1000) / 1000, maxAbsBank: Math.round(mx * 10) / 10, wound: Math.abs(h) > 360 || mx > 360 }); } catch (e) { out.push({ i, error: String(e.message).slice(0, 60) }); } });
console.log(JSON.stringify({ files: files.length, woundHeads: out.filter((r) => r.head !== undefined && Math.abs(r.head) > 360).length, woundAnywhere: out.filter((r) => r.wound).length, rows: out }));
