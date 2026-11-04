const P = require('./pagelib.js');
(async () => {
  const h = await P.open('C:/Users/nname/Downloads/t180-wt-a25', { args: [] });
  try {
    await h.load({ storage: { 't180.guide.done': '1' } });
    const r = await h.ev(`const t = []; await new Promise((res) => { let n = 0; const f = (ts) => { t.push(ts); if (++n < 300) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }); const g = t.slice(1).map((v, i) => v - t[i]).sort((a, b) => a - b); return { median: g[g.length >> 1], p95: g[Math.floor(g.length * 0.95)], hz: 1000 / g[g.length >> 1] };`);
    console.log('headless page with the default frame limit, idle: rAF interval median', r.median.toFixed(2), 'ms p95', r.p95.toFixed(2), '=', r.hz.toFixed(0), 'Hz');
  } finally { await h.close(); }
})();
