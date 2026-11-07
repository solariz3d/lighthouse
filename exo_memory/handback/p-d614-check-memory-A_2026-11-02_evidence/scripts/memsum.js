// memsum.js <out> <marks>: from mem614.js's --trace-gc output and its MARK file, the peak heap (the "before" of every GC, by its time) in
// [export-begin, export-end] and [check-begin, check-end], the heap after a full GC at each MARK, and the maxRSS line
'use strict';
const fs = require('fs');
const L = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/), M = fs.readFileSync(process.argv[3], 'utf8').split(/\r?\n/).filter(Boolean);
const marks = M.map((l) => { const m = /^MARK (\S+) t (\d+) heap ([\d.]+) rss ([\d.]+)/.exec(l); return { name: m[1], t: +m[2], heap: +m[3], rss: +m[4] }; });
const gcs = []; const re = /\s(\d+) ms: [A-Za-z() -]+?([\d.]+) \(([\d.]+)\) -> ([\d.]+) \(([\d.]+)\) MB, pooled: (\d+) MB/g;
const all = L.join('\n'); let g; while ((g = re.exec(all))) gcs.push({ t: +g[1], before: +g[2], after: +g[4], pooled: +g[6] });
for (const m of marks) console.log(`  MARK ${m.name.padEnd(13)} at ${(m.t / 1000).toFixed(1)} s: heap after full GC ${m.heap} MB, rss ${m.rss} MB`);
for (const z of ['export', 'check']) {
  const b = marks.find((m) => m.name === `${z}-begin`), e = marks.find((m) => m.name === `${z}-end`); if (!b || !e) continue;
  const inz = gcs.filter((x) => x.t >= b.t && x.t <= e.t), top = inz.reduce((a, x) => (x.before > a.before ? x : a), { before: 0, after: 0, pooled: 0 });
  console.log(`${z}: ${((e.t - b.t) / 1000).toFixed(1)} s, ${inz.length} GCs, peak heap ${top.before} MB (GC to ${top.after}), largest after-GC ${Math.max(0, ...inz.map((x) => x.after))} MB; retained ${b.heap} -> ${e.heap} MB`);
}
for (const l of L) if (/^(maxRSS|export ms|findings|doc |export threw|FATAL)/.test(l)) console.log(l);
