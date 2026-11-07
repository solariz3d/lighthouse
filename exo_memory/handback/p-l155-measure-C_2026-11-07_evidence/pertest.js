// pertest.js (pane C, L155): per-FILE time from EXISTING run logs, read only. node's spec and TAP reporters print each top-level test's duration but not its file,
// so each top-level test is matched to the test file that declares its title, at the sha the log was run on (git show, read only), and its duration is added to that file.
//   node pertest.js <t180 repo> <sha> <log> <spec|tap> <label> <out.csv>
// What a file's figure IS: the sum of its top-level tests' durations (in-test time, under that run's concurrency and load). It is NOT the file's wall time: module load,
// a browser launched at file scope, and the time between tests are not in it. Tests whose title matches no file, or more than one, are counted apart and listed.
'use strict';
const fs = require('fs'), { execFileSync } = require('child_process');
const [REPO, SHA, LOG, FMT, LABEL, OUT] = process.argv.slice(2);
const git = (...a) => execFileSync('git', ['-C', REPO, ...a], { encoding: 'utf8', maxBuffer: 1 << 28 });
const files = git('ls-tree', '-r', '--name-only', SHA, '--', 'test', 'app/test').split('\n').filter((f) => /\.test\.js$/.test(f));
// the titles each file declares: test( / it( / describe( (with .skip/.only/.todo) followed by a string literal; a template literal's ${…} matches anything
const exact = new Map(), pats = [];
for (const f of files) {
  const src = git('show', `${SHA}:${f}`);
  const re = /\b(?:test|it|describe|suite)(?:\.(?:skip|only|todo))?\(\s*(['"`])/g; let m;
  while ((m = re.exec(src))) {
    const q = m[1]; let i = re.lastIndex, s = '';
    while (i < src.length && src[i] !== q) { if (src[i] === '\\') { const n = src[i + 1]; s += n === 'n' ? '\n' : n; i += 2; continue; } s += src[i++]; }
    if (q === '`' && s.includes('${')) {
      const parts = s.split(/\$\{[^}]*\}/).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      pats.push({ re: new RegExp('^' + parts.join('.*?') + '$', 's'), f });
    } else { if (!exact.has(s)) exact.set(s, new Set()); exact.get(s).add(f); }
  }
}
const fileOf = (t) => { const e = exact.get(t); if (e) return [...e]; const hit = [...new Set(pats.filter((p) => p.re.test(t)).map((p) => p.f))]; return hit; };
// the top-level tests of the log
const tests = [];
const raw = fs.readFileSync(LOG, 'utf8').replace(/\x1b\[[0-9;]*m/g, '').split(/\r?\n/);
if (FMT === 'spec') {
  for (const l of raw) {
    if (/^✖ failing tests:/.test(l)) break;   // the summary repeats the failures
    const m = /^([✔✖﹣]) (.*) \(([\d.]+)ms\)(?: # (SKIP|TODO).*)?$/.exec(l); if (!m) continue;
    tests.push({ title: m[2], ms: Number(m[3]), ok: m[1] !== '✖' });
  }
} else {
  for (let i = 0; i < raw.length; i++) {
    const m = /^(ok|not ok) \d+ - (.*?)(?: # (SKIP|TODO).*)?$/.exec(raw[i]); if (!m) continue;
    let ms = null; for (let j = i + 1; j < Math.min(raw.length, i + 6); j++) { const d = /^  duration_ms: ([\d.]+)/.exec(raw[j]); if (d) { ms = Number(d[1]); break; } }
    tests.push({ title: m[2].replace(/\\#/g, '#').replace(/\\\\/g, '\\'), ms: ms || 0, ok: m[1] === 'ok' });
  }
}
const per = new Map(); let unmatched = [], ambiguous = [];
for (const t of tests) {
  const fs_ = fileOf(t.title);
  if (fs_.length === 1) { const r = per.get(fs_[0]) || { ms: 0, n: 0, fail: 0 }; r.ms += t.ms; r.n++; if (!t.ok) r.fail++; per.set(fs_[0], r); }
  else if (!fs_.length) unmatched.push(t); else ambiguous.push({ ...t, files: fs_ });
}
const sum = (a) => a.reduce((s, t) => s + t.ms, 0);
const rows = [...per.entries()].map(([f, r]) => ({ f, ...r })).sort((a, b) => b.ms - a.ms);
fs.writeFileSync(OUT, 'label,file,sum_ms,tests,fail\n' + rows.map((r) => `${LABEL},${r.f},${r.ms.toFixed(1)},${r.n},${r.fail}`).join('\n') + '\n'
  + `${LABEL},(unmatched),${sum(unmatched).toFixed(1)},${unmatched.length},\n${LABEL},(ambiguous),${sum(ambiguous).toFixed(1)},${ambiguous.length},\n`);
console.log(JSON.stringify({ label: LABEL, sha: SHA, log: LOG, testFilesAtSha: files.length, topLevelTests: tests.length, attributed: tests.length - unmatched.length - ambiguous.length,
  filesSeen: rows.length, sumAllMs: Math.round(sum(tests)), unmatched: { n: unmatched.length, ms: Math.round(sum(unmatched)), top: unmatched.sort((a, b) => b.ms - a.ms).slice(0, 5).map((t) => `${t.title.slice(0, 80)} ${Math.round(t.ms)}`) },
  ambiguous: { n: ambiguous.length, ms: Math.round(sum(ambiguous)), sets: Object.entries(ambiguous.reduce((o,t)=>{const k=t.files.join(' | ');o[k]=(o[k]||0)+t.ms;return o;},{})).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v])=>k+' '+Math.round(v)) } }, null, 1));
