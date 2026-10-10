// D086 relabel: 9 outputs -> S01..S09 by a crypto-random permutation. Run ONCE: node relabel.js <outDir>
// The KEY (true label per S-label) stays in this scratch dir as key.json, with a random 32-byte nonce so its sha256
// commits to the key without being brute-forceable from the 9! = 362,880 possible permutations.
// The relabelled files hold ONLY the subject's reply text — no tokens, no model, no timing — and are written in
// S-label order so no file time or order carries the run order.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const RUN = __dirname;
const out = process.argv[2];
if (!out) throw new Error('usage: node relabel.js <outDir>');
if (fs.existsSync(path.join(RUN, 'key.json'))) throw new Error('key.json exists: relabel runs once');
if (fs.existsSync(out) && fs.readdirSync(out).length) throw new Error(`outDir not empty: ${out}`);
const labels = [];
for (const t of [1, 2, 3]) for (const a of ['cold', 'seed', 'intake']) {
  const f = path.join(RUN, 'raw', `task${t}-${a}.txt`);
  if (!fs.existsSync(f)) throw new Error(`missing output ${f}`);
  labels.push(`task${t}-${a}`);
}
const perm = labels.map((l) => ({ l, r: crypto.randomBytes(8).readBigUInt64BE() })).sort((x, y) => (x.r < y.r ? -1 : 1)).map((x) => x.l);
const key = { nonce: crypto.randomBytes(32).toString('hex'), map: {} };
perm.forEach((l, i) => { key.map[`S${String(i + 1).padStart(2, '0')}`] = l; });
const keyText = JSON.stringify(key, null, 1) + '\n';
fs.writeFileSync(path.join(RUN, 'key.json'), keyText);
fs.mkdirSync(out, { recursive: true });
for (const s of Object.keys(key.map).sort()) {
  fs.writeFileSync(path.join(out, `${s}.md`), fs.readFileSync(path.join(RUN, 'raw', `${key.map[s]}.txt`), 'utf8'));
}
console.log(`key.json sha256 ${crypto.createHash('sha256').update(keyText).digest('hex')}`);
console.log(`wrote ${Object.keys(key.map).length} files to ${out}`);
