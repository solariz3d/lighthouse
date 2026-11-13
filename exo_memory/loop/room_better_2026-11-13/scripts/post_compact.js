// For each seat's newest transcript: every compact_boundary, its preTokens and trigger, and the context of the
// first assistant call after it (input + cache creation + cache read). Prints numbers only.
const fs = require('fs'), path = require('path'), rl = require('readline');
const root = path.join(process.env.USERPROFILE, '.claude', 'projects');
const dirs = fs.readdirSync(root).filter(d => d.startsWith('C--Consonance-instances-'));
const q = (a, p) => { const b = [...a].sort((x, y) => x - y); return b.length ? b[Math.floor(p * (b.length - 1))] : null; };
(async () => {
  for (const d of dirs) {
    const full = path.join(root, d);
    const files = fs.readdirSync(full).filter(f => f.endsWith('.jsonl'))
      .map(f => [f, fs.statSync(path.join(full, f)).mtimeMs]).sort((a, b) => b[1] - a[1]);
    if (!files.length) continue;
    const ev = []; let pending = null;
    const s = rl.createInterface({ input: fs.createReadStream(path.join(full, files[0][0])), crlfDelay: Infinity });
    for await (const l of s) {
      if (l.includes('"compact_boundary"')) {
        try { const o = JSON.parse(l); if (o.subtype === 'compact_boundary') {
          pending = { ts: o.timestamp, pre: o.compactMetadata && o.compactMetadata.preTokens,
                      trig: o.compactMetadata && o.compactMetadata.trigger, post: null };
          ev.push(pending); } } catch {}
        continue;
      }
      if (pending && pending.post === null && l.includes('"assistant"') && l.includes('"usage"')) {
        try { const o = JSON.parse(l); const u = o.message && o.message.usage; if (o.type === 'assistant' && u) {
          pending.post = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
          pending.postWrite = u.cache_creation_input_tokens || 0; pending = null; } } catch {}
      }
    }
    const posts = ev.filter(e => e.post != null).map(e => e.post);
    const last = ev.slice(-3).map(e => `${String(e.ts).slice(0, 16)} ${e.trig} pre=${e.pre} post=${e.post}`);
    const trig = ev.reduce((a, e) => (a[e.trig] = (a[e.trig] || 0) + 1, a), {});
    console.log(d.replace('C--Consonance-instances-', ''), JSON.stringify({ n: ev.length, trig,
      postMedian: q(posts, .5), postMin: q(posts, 0), postMax: q(posts, 1), last }));
  }
})();
