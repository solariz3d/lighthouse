// Count keep-warm ping rows on the board: total, by month, idle minutes and context sizes. Numbers only.
const fs = require('fs'), rl = require('readline');
const file = process.argv[2];
const re = /keep-warm -> (\S+) \((\w+)\)( \[WRITE FAILED\])? · (\d+) min since its last request started · (?:context (\d+) tokens|context unknown)/;
let n = 0, failed = 0, unknown = 0, byMonth = {}, ctx = [], idle = [], byRole = {}, over60 = 0, seen = new Set();
const s = rl.createInterface({ input: fs.createReadStream(file) });
s.on('line', l => {
  if (!l.includes('keep-warm ->')) return;
  let o; try { o = JSON.parse(l); } catch { return; }
  const text = typeof o.text === 'string' ? o.text : (typeof o.msg === 'string' ? o.msg : JSON.stringify(o));
  const m = text.match(re); if (!m) return;
  const key = (o.ts || '') + m[0]; if (seen.has(key)) return; seen.add(key);
  n++; if (m[3]) failed++;
  const mon = String(o.ts || '').slice(0, 7); byMonth[mon] = (byMonth[mon] || 0) + 1;
  byRole[m[2]] = (byRole[m[2]] || 0) + 1;
  const im = +m[4]; idle.push(im); if (im > 60) over60++;
  if (m[5]) ctx.push(+m[5]); else unknown++;
});
s.on('close', () => {
  const q = (a, p) => { const b = [...a].sort((x, y) => x - y); return b.length ? b[Math.floor(p * (b.length - 1))] : null; };
  const sum = ctx.reduce((a, b) => a + b, 0);
  console.log(JSON.stringify({ rows: n, failed, ctxUnknown: unknown, byMonth, byRole,
    idleMedianMin: q(idle, .5), idleOver60: over60,
    ctxN: ctx.length, ctxMedian: q(ctx, .5), ctxP90: q(ctx, .9), ctxMax: q(ctx, 1), ctxSum: sum }));
});
