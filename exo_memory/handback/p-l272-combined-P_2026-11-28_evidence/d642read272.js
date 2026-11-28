// d642read272.js <outdir> <label=worktree@sha> x4: pane P, L272 "Amended 06:5x" item 1 (scratch), run INSIDE one heavy-run --exclusive --timing hold.
// D642's file alone (app/test/core-extra-bank-drag-cost.test.js), 5 rounds, each round the four trees in a rotated order (round r starts at tree r mod 4).
// One reading = one run of the file; the ratio read is the D642 row "dragging the extra bank back toward level …" from its own diagnostic line
// "# rolling (first drag) p95 X ms a move, early p95 Y ms: Z ×" (Z as printed, 2 decimals). Then, per tree against the FIRST tree (c522ea6), L266's rule:
// an exact one-sided Mann–Whitney U (the tree's ratios above the base's), p by enumerating all C(10,5) = 252 splits of the 10 observed values (ties count 1/2,
// so the test is exact with ties), slower only if p < 0.05 AND its median ratio exceeds the base's median by more than 0.10.
'use strict';
const { spawnSync, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const [, , OUTA, ...SPECS] = process.argv;
const OUT = path.resolve(OUTA); fs.mkdirSync(OUT, { recursive: true });
const FILE = 'app/test/core-extra-bank-drag-cost.test.js', ROUNDS = 5;
const trees = SPECS.map((s) => { const [label, rest] = s.split('='); const [wt, sha] = rest.split('@'); return { label, wt, sha }; });
for (const t of trees) {
  const head = execFileSync('git', ['-C', t.wt, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (!head.startsWith(t.sha)) { console.log(`STOP: ${t.wt} is at ${head}, not ${t.sha}`); process.exit(6); }
  if (execFileSync('git', ['-C', t.wt, 'status', '--porcelain'], { encoding: 'utf8' }).trim() !== '') { console.log(`STOP: ${t.wt} not clean`); process.exit(6); }
}
const res = { started: new Date().toISOString(), file: FILE, trees, readings: [] };
const save = () => fs.writeFileSync(path.join(OUT, 'd642.json'), JSON.stringify(res, null, 1));
const ratioOf = (tap) => {
  const L = tap.split('\n'), i = L.findIndex((l) => /^# Subtest: D642: dragging the extra bank back toward level/.test(l));
  if (i < 0) return { ratio: null, why: 'no D642 back-toward-level subtest' };
  for (let j = i + 1; j < L.length; j++) {
    if (/^# Subtest: /.test(L[j])) break;
    const m = L[j].match(/^# rolling \(first drag\) p95 ([\d.]+) ms a move, early p95 ([\d.]+) ms: ([\d.]+) ×/);
    if (m) { const v = L.slice(i, j + 12).find((x) => /^(ok|not ok) \d+ - D642: dragging the extra bank back toward level/.test(x)); return { ratio: Number(m[3]), rolling: Number(m[1]), early: Number(m[2]), verdict: v ? v.split(' ')[0] === 'ok' ? 'ok' : 'RED' : null }; }
  }
  return { ratio: null, why: 'no diagnostic line' };
};
for (let r = 0; r < ROUNDS; r++) {
  const order = trees.map((_, k) => trees[(k + r) % trees.length]);
  for (const t of order) {
    const t0 = Date.now();
    const p = spawnSync(process.execPath, ['--test', '--test-concurrency=1', '--test-reporter=tap', FILE], { cwd: t.wt, encoding: 'utf8', maxBuffer: 32 << 20, timeout: 20 * 60000 });
    const name = `r${r + 1}_${t.label}`; fs.writeFileSync(path.join(OUT, `${name}.tap`), p.stdout);
    const x = ratioOf(p.stdout);
    res.readings.push({ round: r + 1, tree: t.label, sha: t.sha, exit: p.status, sec: Math.round((Date.now() - t0) / 1000), at: new Date().toISOString(), ...x });
    console.log(`${new Date().toISOString()} round ${r + 1} ${t.label}: ${x.ratio} × (rolling ${x.rolling}, early ${x.early}) ${x.verdict || x.why}`); save();
  }
}
// scoring
const median = (a) => { const s = [...a].sort((p, q) => p - q), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const U = (xs, ys) => { let u = 0; for (const x of xs) for (const y of ys) u += x > y ? 1 : x === y ? 0.5 : 0; return u; };   // xs above ys
function exactP(xs, ys) {
  const all = [...xs, ...ys], n = xs.length, obs = U(xs, ys); let ge = 0, tot = 0;
  const pick = (start, chosen) => {
    if (chosen.length === n) { const a = chosen.map((i) => all[i]), b = all.filter((_, i) => !chosen.includes(i)); tot++; if (U(a, b) >= obs - 1e-12) ge++; return; }
    for (let i = start; i < all.length; i++) pick(i + 1, [...chosen, i]);
  };
  pick(0, []); return { U: obs, of: xs.length * ys.length, p: ge / tot, splits: tot };
}
const by = (label) => res.readings.filter((x) => x.tree === label && Number.isFinite(x.ratio)).map((x) => x.ratio);
const base = trees[0].label, b = by(base), mb = median(b);
res.score = { base, baseRatios: b, baseMedian: mb, trees: {} };
for (const t of trees.slice(1)) {
  const xs = by(t.label), mx = median(xs), e = exactP(xs, b), slower = e.p < 0.05 && mx - mb > 0.10;
  res.score.trees[t.label] = { ratios: xs, median: mx, medianOverBase: Math.round((mx - mb) * 1000) / 1000, ...e, slower, band: !slower ? 'not slower' : mx - mb >= 0.30 ? 'STOP: 0.30 or more' : 'slower, under 0.30' };
}
res.ended = new Date().toISOString(); save();
console.log(JSON.stringify(res.score, null, 1));
