'use strict';
// D412 part 1 (O): per-file wall time. node 24's TAP has NO file attribution (top level = each file's top-level tests), so
// per-file wall comes from file-events-reporter.mjs: the file-level test:complete (nesting 0, name = the file's path as
// globbed, or its basename when it sits in the cwd) carries the file's subprocess wall in duration_ms; its test:dequeue gives
// its start. TAP gives the totals and marks failing TODO tests. Mutation files = basename matches /mutation/ (15 at b306309).
//   node parse-tap.js <evidence dir>  -> markdown on stdout, per-file.csv in the dir
const fs = require('fs'), path = require('path');
const dir = path.resolve(process.argv[2] || '.');
const evs = fs.readFileSync(path.join(dir, 'events.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const isFileLevel = (e) => e.nesting === 0 && !!e.file && !!e.name &&
  (e.name === path.basename(e.file) || path.resolve(e.file).toLowerCase().endsWith(path.sep + path.normalize(e.name).toLowerCase()));
const files = new Map();
for (const e of evs) {
  if (!isFileLevel(e)) continue;
  const f = files.get(e.file) || { file: e.file, rel: e.file.replace(/^.*?t180-wt-o-d412[\\/]/, '').replace(/\\/g, '/'), mutation: /mutation/.test(path.basename(e.file)) };
  if (e.type === 'test:dequeue') f.start = e.t;
  if (e.type === 'test:complete') f.ms = e.ms;
  if (e.type === 'test:fail') { f.fail = true; f.exitCode = e.exitCode; f.msg = e.msg; }
  files.set(e.file, f);
}
const list = [...files.values()].filter((f) => f.ms !== undefined).sort((a, b) => b.ms - a.ms);
const missing = [...files.values()].filter((f) => f.ms === undefined);
// a failing TODO test emits test:fail but is not a failure; TAP marks it '# TODO'
const tapLines = fs.readFileSync(path.join(dir, 'suite.tap'), 'utf8').split(/\r?\n/);
const todoNames = new Set(tapLines.filter((l) => /^\s*not ok \d+ - .* # TODO/.test(l)).map((l) => l.replace(/^\s*not ok \d+ - /, '').replace(/ # TODO.*$/, '')));
const notOkTests = evs.filter((e) => e.type === 'test:fail' && !isFileLevel(e) && !todoNames.has(e.name));
const todoFails = evs.filter((e) => e.type === 'test:fail' && todoNames.has(e.name)).length;
const summary = evs.filter((e) => e.type === 'test:summary' && e.file === null).pop();
const sum = (a) => a.reduce((s, f) => s + f.ms, 0);
const all = sum(list), mut = list.filter((f) => f.mutation), mutMs = sum(mut);
const s = (ms) => (ms / 1000).toFixed(1);
fs.writeFileSync(path.join(dir, 'per-file.csv'), 'file,wall_ms,start_epoch_ms,fail,exitCode,mutation\n' + list.map((f) => `${f.rel},${f.ms.toFixed(1)},${f.start ?? ''},${!!f.fail},${f.exitCode ?? ''},${f.mutation}`).join('\n') + '\n');

// files in flight over time, from each file's [start, start+ms]
const iv = list.filter((f) => f.start).map((f) => [f.start, f.start + f.ms]);
const t0 = Math.min(...iv.map((x) => x[0])), t1 = Math.max(...iv.map((x) => x[1]));
const hist = {}; for (let t = t0; t < t1; t += 1000) { const n = iv.filter(([a, b]) => a <= t && t < b).length; hist[n] = (hist[n] || 0) + 1; }
const lastStart = Math.max(...iv.map((x) => x[0]));   // the tail: after the last file STARTED, fewer than 4 can be in flight

const out = [];
out.push(`files with a wall time: ${list.length}${missing.length ? ` · files with no complete event: ${missing.length} (${missing.map((f) => f.rel).join(', ')})` : ''}`);
out.push(`run summary counts: ${JSON.stringify(summary && summary.counts)}`);
out.push(`not ok tests: ${notOkTests.length} · failing TODO tests (not failures): ${todoFails} · not ok files: ${list.filter((f) => f.fail).length}`);
out.push(`span first file start -> last file end: ${s(t1 - t0)} s · sum of per-file wall: ${s(all)} s · mean files in flight: ${(all / (t1 - t0)).toFixed(2)}`);
out.push(`seconds at N files in flight: ${JSON.stringify(hist)} · tail after the last file started: ${s(t1 - lastStart)} s`);
out.push(`mutation files (${mut.length}): ${s(mutMs)} s = ${(100 * mutMs / all).toFixed(1)}% of the per-file sum; the other ${list.length - mut.length}: ${s(all - mutMs)} s`);
out.push('', '| # | file | wall s | % of sum | mutation |', '|---|---|---|---|---|');
list.slice(0, 20).forEach((f, i) => out.push(`| ${i + 1} | ${f.rel}${f.fail ? ` **not ok, exit ${f.exitCode}**` : ''} | ${s(f.ms)} | ${(100 * f.ms / all).toFixed(1)} | ${f.mutation ? 'yes' : ''} |`));
const top20 = sum(list.slice(0, 20));
out.push('', `top 20 together: ${s(top20)} s = ${(100 * top20 / all).toFixed(1)}% of the sum`);
out.push('', '| mutation file | wall s |', '|---|---|');
mut.forEach((f) => out.push(`| ${f.rel} | ${s(f.ms)} |`));
if (notOkTests.length) { out.push('', 'not ok tests:'); notOkTests.forEach((e) => out.push(`- ${path.basename(e.file || '?')} :: ${e.name} (${e.failureType ?? ''} ${e.exitCode ?? ''}) ${e.msg ?? ''}`)); }
list.filter((f) => f.fail).forEach((f) => out.push(`- FILE not ok: ${f.rel} exit ${f.exitCode} ${f.msg ?? ''}`));
console.log(out.join('\n'));
