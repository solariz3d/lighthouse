// pooldump.js (pane E, D305 item 6): print A's top-up pool units as plain text, for reading. Checks each batch's sha256 against
// digests.tsv first and refuses on a mismatch.   node pooldump.js <topup dir> [batch numbers...]
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [dir, ...only] = process.argv.slice(2);
const rows = fs.readFileSync(path.join(dir, 'digests.tsv'), 'utf8').trim().split('\n').slice(1).map((l) => l.split('\t'));
const cut = (s, n) => { s = String(s == null ? '' : s).replace(/\s+/g, ' '); return s.length > n ? s.slice(0, n) + ` …[+${s.length - n}]` : s; };
for (const [b, file, n, sha] of rows) {
  if (only.length && !only.includes(b)) continue;
  const buf = fs.readFileSync(path.join(dir, file));
  if (crypto.createHash('sha256').update(buf).digest('hex') !== sha) { console.error(`MISMATCH ${file}`); process.exit(1); }
  const units = JSON.parse(buf.toString('utf8'));
  const arr = Array.isArray(units) ? units : units.units;
  if (arr.length !== Number(n)) { console.error(`COUNT ${file}: ${arr.length} != ${n}`); process.exit(1); }
  for (const u of arr) {
    const t = u.transcript || {}, c = t.claim || {}, k = t.correction_turn || {};
    console.log(`## ${u.id} (rank ${u.topup_rank}, batch ${b}) seat ${u.seat_by_filename} finder ${u.finder} · ${u.claim_turn_vs_correction_turn}`);
    console.log(`at ${u.correction_at}`);
    console.log(`CORR: ${cut(u.correction_text, 700)}`);
    console.log(`span: ${cut((u.quoted_spans || []).join(' | '), 200)}`);
    console.log(`claim ${c.seat || '-'} ${c.ts || '-'} turn ${c.turn_start || '-'} file ${c.file || '-'} · corr-turn ${k.ts || '-'} (${k.turn_start || '-'})`);
    console.log('');
  }
}
