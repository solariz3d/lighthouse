// L170 A: score arms against the control with the registered bars (chase/SPEED_MODEL.md, L170 + the two amendments).
// usage: node score.js <armsdir> <control-prefix> <arm> [<arm> ...]      e.g.  node score.js arms ctl s3 s6
const fs = require('fs');
const path = require('path');
const dir = process.argv[2];
const ctlName = process.argv[3];
const arms = process.argv.slice(4);
const BLOCKS = [1, 151];

function readCsv(file) {
  const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
  const head = lines[0].split(',');
  return lines.slice(1).map((l) => {
    // the settings columns are quoted and may hold commas; the first columns we use never do
    const c = l.split(',');
    const o = {};
    head.forEach((h, i) => (o[h] = c[i]));
    return o;
  });
}
function pct(v, p) {
  if (!v.length) return 0;
  const a = v.slice().sort((x, y) => x - y);
  const at = p * (a.length - 1);
  const i = Math.floor(at);
  const f = at - i;
  return i + 1 < a.length ? a[i] * (1 - f) + a[i + 1] * f : a[i];
}
function upperMedian(v) {
  if (!v.length) return 0;
  const a = v.slice().sort((x, y) => x - y);
  return a[Math.floor(a.length / 2)];
}
function load(name, block) {
  const base = path.join(name.startsWith("a")&&/^a[0-9]/.test(name)?"arms182":dir, `${name}_b${block}`);
  const runs = readCsv(base + '_runs.csv').map((r) => ({ seed: +r.seed, policy: r.policy, seconds: +r.seconds, caught: r.caught === '1', hits: +r.wall_hits, stalls: +r.stalls }));
  const pairs = fs.existsSync(base + '_pairs.csv')
    ? readCsv(base + '_pairs.csv').map((p) => ({ seed: +p.seed, policy: p.policy, over: +p.overshoot, screen: +p.screen, slip: +p.slip, seen: p.seen === '1' }))
    : [];
  return { runs, pairs };
}
function stats(d) {
  const by = (pol) => d.runs.filter((r) => r.policy === pol);
  const line = by('line'), flee = by('flee'), cut = by('cutback');
  const minutes = (rs) => rs.reduce((s, r) => s + r.seconds / 60, 0);
  const hits = (rs) => rs.reduce((s, r) => s + r.hits, 0);
  const lineMap = new Map(line.map((r) => [r.seed, r.seconds]));
  const ratios = cut.filter((r) => lineMap.get(r.seed) > 0).map((r) => r.seconds / lineMap.get(r.seed));
  const all = d.runs;
  return {
    lineMedian: pct(line.map((r) => r.seconds), 0.5),
    fleeNot: flee.filter((r) => !r.caught).length / Math.max(1, flee.length),
    fleeN: flee.length,
    cutMedian: pct(cut.map((r) => r.seconds), 0.5),
    cutRatio: pct(ratios, 0.5),
    hitsPerMin: hits(all) / Math.max(1e-6, minutes(all)),
    stalls: all.reduce((s, r) => s + r.stalls, 0),
    pairs: d.pairs.length,
    over: upperMedian(d.pairs.map((p) => p.over)),
    seen: d.pairs.length ? d.pairs.filter((p) => p.seen).length / d.pairs.length : 0,
    slip: upperMedian(d.pairs.map((p) => p.slip)),
  };
}
const f1 = (x) => x.toFixed(1), f2 = (x) => x.toFixed(2);
const out = [];
for (const arm of arms) {
  const verdicts = { catch: [], price: [], cutback: [], slosh: [], sloshpass: [], wall: [] };
  out.push(`### ${arm}`);
  out.push('| block | line med (ctl) | Δline | flee not caught (ctl) | Δpoints | cutback/line (ctl) | Δ | wall hits ×ctl | stalls (ctl) | overshoot (ctl) | seen (ctl) | slip (ctl) |');
  out.push('|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const b of BLOCKS) {
    const c = stats(load(ctlName, b)), a = stats(load(arm, b));
    const dLine = (100 * (a.lineMedian - c.lineMedian)) / c.lineMedian;
    const dShare = 100 * (a.fleeNot - c.fleeNot);
    const dCut = a.cutRatio - c.cutRatio;
    const wall = a.hitsPerMin / Math.max(1e-9, c.hitsPerMin);
    out.push(`| ${b} | ${f1(a.lineMedian)} (${f1(c.lineMedian)}) | ${dLine >= 0 ? '+' : ''}${f1(dLine)} % | ${(100 * a.fleeNot).toFixed(1)} % (${(100 * c.fleeNot).toFixed(1)} %) | ${dShare >= 0 ? '+' : ''}${f1(dShare)} | ${f2(a.cutRatio)} (${f2(c.cutRatio)}) | ${dCut >= 0 ? '+' : ''}${f2(dCut)} | ${f2(wall)} | ${a.stalls} (${c.stalls}) | ${f2(a.over)} m (${f2(c.over)}) | ${(100 * a.seen).toFixed(1)} % (${(100 * c.seen).toFixed(1)} %) | ${f1(a.slip)}° (${f1(c.slip)}°) |`);
    verdicts.catch.push(dShare <= -10 && dLine <= -15 ? 'pass' : dShare > -5 || dLine > -7 ? 'falsified' : 'between');
    verdicts.price.push(dLine >= -15 && dShare <= 5 ? 'holds' : 'exceeded');
    verdicts.cutback.push(a.cutRatio >= 1.3 && a.cutRatio >= c.cutRatio + 0.25 ? 'pass' : a.cutRatio < c.cutRatio + 0.1 ? 'falsified' : 'between');
    const dOver = a.over - c.over, dSeen = 100 * (a.seen - c.seen), dSlip = a.slip - c.slip;
    verdicts.slosh.push(dOver >= 0.6 && dSeen >= 15 && dSlip >= 10 ? 'pass' : dOver < 0.3 || dSeen < 5 || dSlip < 3 ? 'falsified' : 'between');
    verdicts.sloshpass.push(`Δover ${dOver >= 0 ? '+' : ''}${f2(dOver)} m, Δseen ${dSeen >= 0 ? '+' : ''}${f1(dSeen)} pts, Δslip ${dSlip >= 0 ? '+' : ''}${f1(dSlip)}°`);
    verdicts.wall.push(wall <= 2 ? 'holds' : 'exceeded');
  }
  const both = (v, ok) => (v.every((x) => x === ok) ? ok.toUpperCase() : v.every((x) => x !== ok) ? 'not ' + ok : 'SPLIT ' + v.join('/'));
  out.push('');
  out.push(`- catch (share down 10 pts and Line median down 15 %): blocks ${verdicts.catch.join(' / ')}`);
  out.push(`- price (Line median down at most 15 %, share up at most 5 pts): ${verdicts.price.join(' / ')}`);
  out.push(`- cutback (≥1.30 and control +0.25): ${verdicts.cutback.join(' / ')}`);
  out.push(`- slosh (Δ overshoot ≥ 0.6 m, Δ seen ≥ 15 pts, Δ slip ≥ 10°; falsified under 0.3 m, 5 pts or 3°): ${verdicts.slosh.join(' / ')}   [${verdicts.sloshpass.join(' ; ')}]`);
  out.push(`- wall hits at most 2× control: ${verdicts.wall.join(' / ')}`);
  out.push('');
}
console.log(out.join('\n'));
