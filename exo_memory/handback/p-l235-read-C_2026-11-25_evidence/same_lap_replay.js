// Replays the branch's rule (lap_id = first L+3/4 digits whole token in the first 160 chars after [chair:MAIN]; last = the previous
// dispatch's id that HAS one; same_lap = equal) over every pane's real dispatches, and lists the "same lap" verdicts whose head also
// names a DIFFERENT lap with an opening word near it (next lap / yours / ledger / your next). Those are candidate false skips.
const fs = require('fs');
const isAN = (c) => /[\p{L}\p{N}]/u.test(c);
function lapId(text) { const h = [...text].slice(0, 160); for (let i = 0; i < h.length; i++) { if (h[i] === 'L' && (i === 0 || !isAN(h[i - 1]))) { let n = 0; while (/[0-9]/.test(h[i + 1 + n] || '')) n++; const a = h[i + 1 + n]; if (n >= 3 && n <= 4 && !(a && isAN(a))) return h.slice(i, i + 1 + n).join(''); } } return null; }
let total = 0, same = 0; const cand = [];
for (const f of process.argv.slice(2)) {
  let last = null;
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
    let v; try { v = JSON.parse(l); } catch { continue; }
    if (v.type !== 'user' || v.isSidechain) continue;
    const c = v.message && v.message.content; const t = typeof c === 'string' ? c : Array.isArray(c) ? (c.filter((b) => b.type === 'text').map((b) => b.text).find((x) => x.includes('[chair:MAIN]')) || '') : '';
    if (!t.includes('[chair:MAIN]')) continue;
    const after = t.split('[chair:MAIN]')[1] || ''; const id = lapId(after);
    if (!v.isCompactSummary && v.timestamp >= '2026-11-01') {
      total++;
      if (last && id && last === id) {
        same++;
        const head = after.slice(0, 160); const others = [...head.matchAll(/(?<![A-Za-z0-9])L\d{3,4}(?![A-Za-z0-9])/g)].map((m) => m[0]).filter((x) => x !== id);
        if (others.length && /next lap|your next|yours|ledger|new lap|collated|filed|is landed/i.test(head)) cand.push(v.timestamp.slice(5, 16) + ' last ' + last + ' -> read ' + id + ' | ' + head.slice(0, 120).replace(/\s+/g, ' '));
      }
    }
    if (id) last = id;
  }
}
console.log('November dispatches', total, '| judged same lap', same, '| of those, heads naming another lap beside an opening/closing word', cand.length);
cand.forEach((x) => console.log('  ' + x));
