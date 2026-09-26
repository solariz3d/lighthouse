'use strict';
// D160 step 4, B's independent test: for each LOCATED KU row, did the census "source" PATH appear ANYWHERE in the
// transcript before the claim row (earlier turns, tool results, prompts — any row)? Reported twice: anywhere earlier in
// the file, and since the last compaction before the claim (a compaction resets what the model actually holds).
// Match: basename + one parent directory (strong), or the basename alone (weak), case-insensitive, \ = /.
const fs = require('fs'), readline = require('readline');
const { paths } = require('./d160-run.js');
(async () => {
  const [rowsFile, kuFile, outFile] = process.argv.slice(2);
  const rows = JSON.parse(fs.readFileSync(rowsFile, 'utf8'));
  const ku = Object.fromEntries(JSON.parse(fs.readFileSync(kuFile, 'utf8')).map((r) => [r.id, r]));
  const out = [];
  for (const r of rows) {
    const src = String(ku[r.id].source || '');
    const ps = paths(src.replace(/(\S+\.(?:js|rs|md|json|txt|ps1)):\d+(?:-\d+)?/g, '$1'));
    if (!ps.length) { out.push({ id: r.id, source: src, result: 'N/A — the census source names no file path' }); console.log(`${r.id} N/A (source: ${src.slice(0, 60)})`); continue; }
    const keys = ps.map((p) => { const a = p.split('/').filter(Boolean); return { p, strong: a.length >= 2 ? a.slice(-2).join('/') : null, weak: a[a.length - 1] }; });
    const first = {}; let lastCompact = 0, n = 0;
    for await (const raw of readline.createInterface({ input: fs.createReadStream(r.file, 'utf8'), crlfDelay: Infinity })) {
      if (++n >= r.line) break;
      if (raw.includes('"compact_boundary"')) lastCompact = n;
      const low = raw.toLowerCase().split('\\\\').join('/').split('\\').join('/'); // JSON-escaped \\ and bare \ both become /
      for (const k of keys) {
        if (k.strong && low.includes(k.strong)) (first[k.p] = first[k.p] || {}).strong = first[k.p].strong || n, (first[k.p].strongLast = n);
        else if (low.includes(k.weak)) (first[k.p] = first[k.p] || {}).weak = first[k.p].weak || n, (first[k.p].weakLast = n);
      }
    }
    const res = keys.map((k) => { const f = first[k.p] || {}; return { path: k.p, strongFirst: f.strong || null, strongLast: f.strongLast || null, weakFirst: f.weak || null, weakLast: f.weakLast || null, sinceCompaction: !!((f.strongLast && f.strongLast > lastCompact) || (f.weakLast && f.weakLast > lastCompact)) }; });
    const yes = res.some((x) => x.strongFirst || x.weakFirst);
    out.push({ id: r.id, source: src, claimLine: r.line, lastCompactionBefore: lastCompact || null, anywhereBefore: yes ? 'yes' : 'no', paths: res });
    console.log(`${r.id} claim :${r.line} · last compaction before: ${lastCompact || 'none'} · ${res.map((x) => `${x.path}: ${x.strongFirst ? 'YES (parent+base) first :' + x.strongFirst + ' last :' + x.strongLast : x.weakFirst ? 'yes (basename only) first :' + x.weakFirst + ' last :' + x.weakLast : 'NO'}${(x.strongFirst || x.weakFirst) ? (x.sinceCompaction ? ' · after last compaction' : ' · only before last compaction') : ''}`).join(' | ')}`);
  }
  fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
})();
