// A line-for-line JS port of cut_at_handback.rs lap_id / last_dispatch_lap at l235-no-cut 6c71be9b, run on real transcripts (last 4 MiB, as close_small_tail reads).
const fs = require('fs');
function lapId(text) {
  const h = [...text].slice(0, 160);
  for (let i = 0; i < h.length; i++) {
    const boundary = i === 0 || !/[\p{L}\p{N}]/u.test(h[i - 1]);
    if (h[i] === 'L' && boundary) {
      let n = 0; while (/[0-9]/.test(h[i + 1 + n] || '')) n++;
      const after = h[i + 1 + n];
      if (n >= 3 && n <= 4 && !(after && /[\p{L}\p{N}]/u.test(after))) return h.slice(i, i + 1 + n).join('');
    }
  }
  return null;
}
function rows(jsonl) {
  const out = [];
  for (const l of jsonl.split('\n')) {
    let v; try { v = JSON.parse(l); } catch { continue; }
    if (v.type !== 'user' || v.isSidechain === true) continue;
    const c = v.message && v.message.content; let t = null, how = null;
    if (typeof c === 'string') { t = c; how = 'string'; }
    else if (Array.isArray(c)) { const b = c.filter((b) => b.type === 'text' && typeof b.text === 'string').map((b) => b.text).find((x) => x.includes('[chair:MAIN]')); if (b) { t = b; how = 'text-block'; } }
    if (!t || !t.includes('[chair:MAIN]')) continue;
    const id = lapId(t.split('[chair:MAIN]')[1] || '');
    if (id) out.push({ ts: v.timestamp, how, id, isMeta: v.isMeta, head: t.slice(0, 90).replace(/\s+/g, ' '), afterTag: (t.split('[chair:MAIN]')[1] || '').slice(0, 70).replace(/\s+/g, ' ') });
  }
  return out;
}
for (const f of process.argv.slice(2)) {
  const fd = fs.openSync(f, 'r'), size = fs.fstatSync(fd).size, n = Math.min(size, 4 << 20), buf = Buffer.alloc(n);
  fs.readSync(fd, buf, 0, n, size - n);
  const r = rows(buf.toString('utf8'));
  console.log('==', f.split(/[\/]/).pop(), 'rows', r.length, '| last_dispatch_lap =', r.length ? r.at(-1).id : null);
  for (const x of r.slice(-12)) console.log(' ', x.ts, x.how, x.isMeta ? 'META' : '', x.id, '|', x.afterTag);
}
