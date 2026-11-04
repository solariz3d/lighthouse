'use strict';
// D134 mutants for consonance/ui/leave.js (the publish outcome in the Leave window). leave.js, leave.test.js and term.js are
// copied to a temp dir, leave.js is mutated, the test runs there; the tracked file is never written. Heavy-run lock held.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = process.argv[2];
require(path.join(REPO, 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'leave.mutants (E, D134)' });
const UI = path.join(REPO, 'consonance', 'ui');
const SRC = fs.readFileSync(path.join(UI, 'leave.js'), 'utf8');
const M = [
  ['null publish renders a success line', "if (pub == null || typeof pub !== 'object') return '';", "if (pub == null || typeof pub !== 'object') return '<h3>CLOSED — this machine\\'s state is published</h3>';"],
  ['PUBLISHED drops the from sha', "moved <code>${E(pub.from || '(none)')}</code> → ", "moved → "],
  ['PUBLISHED swaps from and to', "<code>${E(pub.from || '(none)')}</code> → <code>${E(pub.to)}</code>", "<code>${E(pub.to)}</code> → <code>${E(pub.from || '(none)')}</code>"],
  ['REFUSED reads as CLOSED', "NOT CLOSED — this machine's state was not published", "CLOSED — this machine's state was not published"],
  ['divergence never recognised', "const DIVERGED = /REFUSED_DIVERGED|DIVERGED — \\d+ travelling/;", "const DIVERGED = /$^/;"],
  ['every refusal called a divergence', "const DIVERGED = /REFUSED_DIVERGED|DIVERGED — \\d+ travelling/;", "const DIVERGED = /[\\s\\S]*/;"],
  ['file list never parsed', "const files = [...String(text).matchAll(DIVERGED_FILE)];", "const files = [];"],
  ['pointer invents a count', "is listed under <code>files</code> in <code>state-sync.push.json</code> in the data folder.", "is 1 row(s)."],
  ['TIMED_OUT reads as closed', "NOT CLOSED — the publish did not finish in time and was stopped", "CLOSED — the publish finished"],
  ['FAILED loses NOT', "NOT CLOSED — the publish could not run", "CLOSED — the publish could not run"],
  ['unknown outcome reads as published', "return `<h3 class=\"stick-bad\">Publish outcome not recognised: ${E(o)}</h3>", "return `<h3>CLOSED — this machine's state is published</h3><h3>${E(o)}</h3>"],
  ['UNCHANGED reads as a refusal', "<h3>CLOSED — nothing new to publish</h3>", "<h3>NOT CLOSED — nothing new to publish</h3>"],
  ['publishing phase ignored', "if (p.phase === 'result' || p.phase === 'publishing') return result(p);", "if (p.phase === 'result') return result(p);"],
  ['publishing line dropped', "const publishing = p.phase === 'publishing'", "const publishing = false"],
  ['publish never rendered', "${publishing}${publishHtml(p.publish)}", "${publishing}"],
  ['verbatim text not escaped', "const verbatim = (t) => (t ? `<pre class=\"stick-muted\">${E(t)}</pre>` : '');", "const verbatim = (t) => (t ? `<pre class=\"stick-muted\">${t}</pre>` : '');"],
  ['divergence advice drops the union step', "Union those rows into this machine first", "Try again later"],
];
function score(text) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'd134-mut-'));
  try {
    for (const f of ['leave.test.js', 'term.js']) fs.copyFileSync(path.join(UI, f), path.join(root, f));
    fs.writeFileSync(path.join(root, 'leave.js'), text == null ? SRC : text);
    if (spawnSync(process.execPath, ['--check', path.join(root, 'leave.js')]).status !== 0) return { noResult: true };
    const r = spawnSync(process.execPath, [path.join(root, 'leave.test.js')], { encoding: 'utf8', timeout: 120000 });
    const m = /(\d+) passed, (\d+) failed/.exec(r.stdout || '');
    return m ? { pass: +m[1], fail: +m[2] } : { noResult: true };
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
const base = score(null);
console.log(`baseline: pass ${base.pass} · fail ${base.fail}`);
if (base.noResult || base.fail || !base.pass) { console.log('BASELINE NOT GREEN — no mutant can be scored'); process.exit(2); }
let applied = 0, caught = 0, na = 0;
for (const [name, from, to] of M) {
  const k = SRC.split(from).length - 1;
  if (k !== 1) { na++; console.log(`NOT APPLIED (${k} matches)  ${name}`); continue; }
  applied++;
  const r = score(SRC.replace(from, to));
  if (r.noResult) { console.log(`NO RESULT   ${name}`); continue; }
  if (r.fail > 0) { caught++; console.log(`caught (${r.fail} red)  ${name}`); } else console.log(`SURVIVED    ${name}`);
}
console.log(`\n${M.length} mutants · applied ${applied} · caught ${caught} · NOT APPLIED ${na}`);
process.exit(applied === caught && na === 0 ? 0 : 1);
