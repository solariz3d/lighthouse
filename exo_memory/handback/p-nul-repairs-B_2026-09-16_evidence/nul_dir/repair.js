// Replace exactly ONE raw NUL byte per file with its escape spelling. Refuses unless the file holds
// exactly one NUL, so it cannot silently rewrite a second site nobody inspected. Escape text is built
// from char codes so no tool between here and the disk can decode it back into the byte.
const fs = require('fs');
const BS = String.fromCharCode(92); // backslash
const REPO = 'C:/Users/nname/Desktop/lighthouse/';
const JOBS = [
  ['consonance/tools/coupling-test.js', BS + '0'],
  ['consonance/tools/essay-provenance.js', BS + '0'],
  ['exo_memory/handback/p-boundary-read-B_2026-09-16.md', BS + 'u0000'],
];
let bad = 0;
for (const [rel, esc] of JOBS) {
  const p = REPO + rel;
  const buf = fs.readFileSync(p);
  const hits = [];
  for (let i = 0; i < buf.length; i++) if (buf[i] === 0) hits.push(i);
  if (hits.length !== 1) { console.log(`REFUSED ${rel}: ${hits.length} NUL bytes, expected exactly 1`); bad++; continue; }
  const i = hits[0];
  const next = String.fromCharCode(buf[i + 1]);
  if (esc === BS + '0' && /[0-9]/.test(next)) { console.log(`REFUSED ${rel}: NUL followed by a digit; \\0 would read as octal`); bad++; continue; }
  const out = Buffer.concat([buf.subarray(0, i), Buffer.from(esc, 'utf8'), buf.subarray(i + 1)]);
  fs.writeFileSync(p, out);
  const ctx = out.subarray(Math.max(0, i - 30), i + esc.length + 12).toString('utf8');
  console.log(`repaired ${rel} at byte ${i}: ...${ctx}...  (${buf.length} B -> ${out.length} B)`);
}
process.exit(bad ? 1 : 0);
