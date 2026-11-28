// split678.js (pane E, D678 N3, registered with the row 9 A/A for the Even pair): one session of four trees holds two pairs (the A/A's and the Even pair's).
// This copies one pair's records into a directory of its own, so analyse678.js reads it unchanged: the <kind>.jsonl lines of the two labels, in the session's
// order, and their TAPs. It changes nothing in the session directory. usage: node split678.js <session dir> <d642|sf|df> <out dir> <label1> <label2>
'use strict';
const fs = require('fs'), path = require('path');
const [dir, kind, out, l1, l2] = process.argv.slice(2);
if (!dir || !kind || !out || !l1 || !l2 || l1 === l2) { console.error('usage: node split678.js <session dir> <d642|sf|df> <out dir> <label1> <label2>'); process.exit(2); }
const rows = fs.readFileSync(path.join(dir, `${kind}.jsonl`), 'utf8').trim().split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
const keep = rows.filter((r) => r.label === l1 || r.label === l2);
for (const l of [l1, l2]) if (!keep.some((r) => r.label === l)) throw new Error(`no run of ${l} in ${dir}`);
if (keep[0].label !== l1) throw new Error(`${l1} is not the first of the two in the session's order`);
fs.mkdirSync(out, { recursive: true });
if (fs.existsSync(path.join(out, `${kind}.jsonl`))) throw new Error(`${out} already holds a ${kind}.jsonl`);
fs.writeFileSync(path.join(out, `${kind}.jsonl`), keep.map((r) => JSON.stringify(r)).join('\n') + '\n');
for (const r of keep) { const t = `${kind}-${String(r.k).padStart(2, '0')}-${r.label}.tap`; fs.copyFileSync(path.join(dir, t), path.join(out, t)); }
console.log(`split ${keep.length} of ${rows.length} runs (${l1} ${keep.filter((r) => r.label === l1).length}, ${l2} ${keep.filter((r) => r.label === l2).length}) into ${out}`);
