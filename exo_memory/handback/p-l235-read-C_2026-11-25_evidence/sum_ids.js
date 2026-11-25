// For every compact-summary row carrying [chair:MAIN], what lap_id the branch's Rust rule would read from it (same port as lap_port.js).
const fs = require('fs');
const isAN = (c) => /[\p{L}\p{N}]/u.test(c);
function lapId(text) { const h = [...text].slice(0, 160); for (let i = 0; i < h.length; i++) { if (h[i] === 'L' && (i === 0 || !isAN(h[i - 1]))) { let n = 0; while (/[0-9]/.test(h[i + 1 + n] || '')) n++; const a = h[i + 1 + n]; if (n >= 3 && n <= 4 && !(a && isAN(a))) return h.slice(i, i + 1 + n).join(''); } } return null; }
for (const f of process.argv.slice(2)) for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
  let v; try { v = JSON.parse(l); } catch { continue; }
  if (!v.isCompactSummary || v.type !== 'user') continue;
  const c = v.message.content; const t = typeof c === 'string' ? c : c.filter((b) => b.type === 'text').map((b) => b.text).find((x) => x.includes('[chair:MAIN]')) || '';
  if (!t.includes('[chair:MAIN]')) continue;
  console.log(f.slice(-50, -40), v.timestamp, typeof c, '->', lapId(t.split('[chair:MAIN]')[1] || ''));
}
