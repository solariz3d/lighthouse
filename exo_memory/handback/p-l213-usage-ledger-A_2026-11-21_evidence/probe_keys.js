// L213 probe: what the harness hands a status line script or a hook on stdin. Writes KEYS and NUMBERS only (every string is
// replaced by its length, so no path, id, name or text leaves stdin), one JSON line per call, to keys.jsonl beside this file.
const fs = require('fs'), path = require('path');
const tag = process.argv[2] || 'unknown';
let raw = '';
process.stdin.on('data', d => (raw += d));
process.stdin.on('end', () => {
  const shape = v => {
    if (v === null) return null;
    if (Array.isArray(v)) return v.length ? [shape(v[0]), 'len ' + v.length] : [];
    if (typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) o[k] = shape(v[k]); return o; }
    if (typeof v === 'string') return 'str(' + v.length + ')';
    return v;   // number or boolean
  };
  let parsed; try { parsed = JSON.parse(raw); } catch (e) { parsed = { not_json_bytes: raw.length }; }
  fs.appendFileSync(path.join(__dirname, 'keys.jsonl'), JSON.stringify({ t: new Date().toISOString(), tag, shape: shape(parsed) }) + '\n');
  if (tag === 'statusline') process.stdout.write('probe');
});
