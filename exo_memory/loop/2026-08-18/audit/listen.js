// Audit journal §7 against heard.jsonl (today's Adagio run).
const fs = require('fs');
const rows = fs.readFileSync('C:/Consonance/data/heard.jsonl', 'utf8').trim().split('\n')
  .map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

// today's run: find the track row naming Barber
const ti = rows.findIndex(r => r.kind === 'track' && /Barber/.test(r.text || ''));
const run = rows.slice(ti).filter(r => typeof r.pos === 'number');
console.log('run rows:', run.length, 'pos range:', run[0].pos.toFixed(1), '->', run[run.length - 1].pos.toFixed(1));
const kinds = {}; run.forEach(r => kinds[r.kind] = (kinds[r.kind] || 0) + 1);
console.log('kinds:', kinds);

const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// --- spot checks ---
console.log('\n== resolved events (all, with after_s) ==');
run.filter(r => r.kind === 'resolved').forEach(r =>
  console.log(mmss(r.pos), 'after_s=' + (r.ev && r.ev.after_s !== undefined ? (+r.ev.after_s).toFixed(2) : '?'), 'dbfs=' + (r.dbfs !== undefined ? r.dbfs.toFixed(1) : '?'), '|', (r.text || '').slice(0, 60)));

console.log('\n== rows near 2:14 (pos 125-145) ==');
run.filter(r => r.pos >= 125 && r.pos <= 145).forEach(r =>
  console.log(mmss(r.pos), r.kind, 'dbfs=' + (r.dbfs !== undefined ? r.dbfs.toFixed(1) : '?'), '|', (r.text || '').slice(0, 90)));

console.log('\n== quietest-yet check: min dbfs of any row BEFORE the -43 restless chord ==');
// find the restless chord with tritone near 2:14
const chordRow = run.find(r => r.pos >= 125 && r.pos <= 145 && /tritone/.test(r.text || ''));
if (chordRow) {
  const before = run.filter(r => r.pos < chordRow.pos && r.dbfs !== undefined);
  const minBefore = Math.min(...before.map(r => r.dbfs));
  console.log('chord at', mmss(chordRow.pos), 'dbfs=', chordRow.dbfs.toFixed(1), '| min dbfs before it:', minBefore.toFixed(1));
} else console.log('NO tritone chord found near 2:14');

console.log('\n== near 3:07 (pos 180-195) ==');
run.filter(r => r.pos >= 180 && r.pos <= 195).forEach(r =>
  console.log(mmss(r.pos), r.kind, 'dbfs=' + (r.dbfs !== undefined ? r.dbfs.toFixed(1) : '?'), '|', (r.text || '').slice(0, 90)));

console.log('\n== near 8:24 (pos 495-515) ==');
run.filter(r => r.pos >= 495 && r.pos <= 515).forEach(r =>
  console.log(mmss(r.pos), r.kind, 'dbfs=' + (r.dbfs !== undefined ? r.dbfs.toFixed(1) : '?'), '|', (r.text || '').slice(0, 90)));

console.log('\n== last 12 rows of run ==');
run.slice(-12).forEach(r =>
  console.log(mmss(r.pos), r.kind, 'dbfs=' + (r.dbfs !== undefined ? r.dbfs.toFixed(1) : '?'), '|', (r.text || '').slice(0, 80)));

// --- retreat claim: build the level envelope from ALL rows with dbfs, find extrema ---
console.log('\n== level extrema (prominence >= 3 dB) over whole run ==');
const series = run.filter(r => r.dbfs !== undefined).map(r => ({ pos: r.pos, db: r.dbfs }));
// smooth lightly: 5-point median
function med(a) { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; }
const sm = series.map((p, i) => ({ pos: p.pos, db: med(series.slice(Math.max(0, i - 2), i + 3).map(q => q.db)) }));
// find alternating extrema with min prominence
const ext = [];
let dir = 0, cand = sm[0];
for (const p of sm.slice(1)) {
  if (dir >= 0 && p.db > cand.db) { cand = p; dir = 1; }
  else if (dir <= 0 && p.db < cand.db) { cand = p; dir = -1; }
  else if (dir === 1 && cand.db - p.db >= 3) { ext.push({ t: 'CREST', ...cand }); cand = p; dir = -1; }
  else if (dir === -1 && p.db - cand.db >= 3) { ext.push({ t: 'trough', ...cand }); cand = p; dir = 1; }
}
ext.push({ t: dir === 1 ? 'CREST' : 'trough', ...cand });
ext.forEach(e => console.log(e.t.padEnd(6), mmss(e.pos), e.db.toFixed(1)));

// monotonicity test on the extrema sequence
const crests = ext.filter(e => e.t === 'CREST').map(e => e.db);
const troughs = ext.filter(e => e.t === 'trough').map(e => e.db);
const monoUp = a => a.every((v, i) => i === 0 || v >= a[i - 1]);
const monoDown = a => a.every((v, i) => i === 0 || v <= a[i - 1]);
console.log('\ncrests:', crests.map(x => x.toFixed(0)).join(', '), '| monotone rising?', monoUp(crests));
console.log('troughs:', troughs.map(x => x.toFixed(0)).join(', '), '| monotone deepening?', monoDown(troughs));
