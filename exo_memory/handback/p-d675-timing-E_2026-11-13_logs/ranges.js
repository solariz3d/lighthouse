// ranges.js <bench.log>: per arm, the tries' count and the ranges of avg, p99, worst and frames drawn, with start times.
const t = require('fs').readFileSync(process.argv[2], 'utf8').split(/\r?\n/);
for (const arm of ['base', 'branch']) {
  const re = new RegExp('Z \\d\\d-' + arm + '(-try\\d)?\\t');
  const r = t.filter((l) => re.test(l)).map((l) => {
    const m = l.match(/avg ([\d.]+) p50 [\d.]+ p99 ([\d.]+) worst ([\d.]+) \((\d+)/);
    return m && { s: l.split('\t')[1], avg: +m[1], p99: +m[2], worst: +m[3], d: +m[4] };
  }).filter(Boolean);
  const rng = (k) => `${Math.min(...r.map((x) => x[k]))} to ${Math.max(...r.map((x) => x[k]))}`;
  console.log(`${arm}: ${r.length} tries; avg ${rng('avg')}; p99 ${rng('p99')}; worst ${rng('worst')}; drawn ${rng('d')}; starts ${r.map((x) => x.s).join(' ')}`);
}
