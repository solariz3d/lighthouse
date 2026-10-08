// node mut_corpusage.js : each mutant of corpus-age.js must turn the synthetic twin red; the unmutated tool must stay green.
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const W = 'C:/Users/nname/Desktop/worktrees/a-l3-wt/consonance/tools/';
const tool = fs.readFileSync(W + 'corpus-age.js', 'utf8').replace(/\r\n/g, '\n'), test = fs.readFileSync(W + 'corpus-age.synthetic.test.js', 'utf8');
const MUT = [
  ['M1 flat read: never recurse into named dirs', "if (!recurse || e.name === 'attic') continue;", "if (true) continue;"],
  ['M2 attic is not skipped by name', "if (!recurse || e.name === 'attic') continue;", "if (!recurse) continue;"],
  ['M3 propose on either condition', 'propose: !referenced && stale', 'propose: !referenced || stale'],
  ['M4 review rebuilds rel as dir+name', "const rel = 'exo_memory/' + f.rel;", "const rel = 'exo_memory/' + (dir ? dir + '/' : '') + f.name;"],
  ['M5 excluded prefixes are counted', "if (EXCLUDED_PREFIXES.some((p) => f.rel.startsWith(p))) { exBytes += f.size; exFiles++; continue; }", ''],
  ['M6 apply overwrites a name taken in attic', "if (fs.existsSync(dest)) { console.error('  SKIP (name taken in attic): ' + rel); continue; }", ''],
  ['M7 apply writes no manifest', "fs.appendFileSync(manifest, head + lines.join('\\n') + '\\n');", ''],
  ['M8 intakeCap falls back to a made-up number', "if (!lim) throw new Error('LIBRARIAN_INTAKE_LIMIT not found in main.rs — refusing to print a capacity number with no anchor in the binary');", 'if (!lim) return 2200000;'],
  ['M9 apply deletes instead of moving', 'fs.renameSync(src, dest);', 'fs.copyFileSync(src, dest); fs.unlinkSync(src); fs.writeFileSync(dest, "x");'],
  ['M10 age map is empty (git age lost)', "if (ts !== null && !ages.has(s)) ages.set(s, Math.floor((now - ts) / 86400));", ''],
];
function run(label, body) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mut-ca-')); fs.writeFileSync(path.join(d, 'corpus-age.js'), body); fs.writeFileSync(path.join(d, 'corpus-age.synthetic.test.js'), test);
  const r = cp.spawnSync(process.execPath, ['--test', path.join(d, 'corpus-age.synthetic.test.js')], { encoding: 'utf8' });
  fs.rmSync(d, { recursive: true, force: true });
  const out = (r.stdout || '').replace(/\x1b\[[0-9;]*m/g, ''); const fails = (out.match(/^✖ \d+:/gm) || []).map((s) => s.slice(2, -1));
  return { label, status: r.status, failedRows: [...new Set(fails)] };
}
const rows = [run('UNMUTATED', tool)];
for (const [label, a, b] of MUT) { const i = tool.indexOf(a); if (i < 0) { rows.push({ label, error: 'anchor not found' }); continue; } rows.push(run(label, tool.replace(a, () => b))); }
for (const r of rows) console.log(r.error ? `${r.label}: ${r.error}` : `${r.label}: exit ${r.status} ${r.status === 0 ? '(GREEN)' : 'CAUGHT by rows ' + r.failedRows.join(',')}`);
const survived = rows.slice(1).filter((r) => r.error || r.status === 0);
console.log(survived.length ? 'SURVIVED/ERROR: ' + survived.map((r) => r.label).join(' | ') : 'all mutants caught');
