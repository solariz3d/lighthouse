'use strict';
// measure.js - D277 part 5 (seat A): bytes and tokens of the session-start injection, before and after, startup / resume / compact.
//   node exo_memory/loop/startdigest_evidence/measure.js [--base 9b5f40ba]
// READ-ONLY on the real ~/.claude/shell: it COPIES the two newest digests and the event log into a temp shell dir, takes the OLD hook from git (`git show <base>:dev/shell/hooks/session-start.js`)
// and the NEW one from this tree, and runs each against the temp dir with a temp HOME that holds only the ambient keys of the real ~/.consonance.json (plus gates_mode for the light rows).
// A FIXED CLOCK for every run (the ambient block prints the current second, so two runs a moment apart would differ without any change in the hook).
// Tokens are bytes / 4: the ratio the census used (12.2-13.5 KB = 3.0-3.4k tokens). No tokenizer is called.
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
const argv = process.argv.slice(2), base = argv.includes('--base') ? argv[argv.indexOf('--base') + 1] : '9b5f40ba';
const REPO = path.join(__dirname, '..', '..', '..'), NEW = path.join(REPO, 'dev', 'shell', 'hooks', 'session-start.js'), LIBSRC = path.join(REPO, 'dev', 'shell', 'lib');
const REAL = path.join(process.env.USERPROFILE || os.homedir(), '.claude', 'shell');
const mk = (f, text) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ss-measure-')), shell = path.join(root, 'shell'), home = path.join(root, 'home');
const FIXED = Date.parse('2026-10-09T18:00:00Z');
mk(path.join(root, 'fixed-clock.js'), `const R = Date, F = ${FIXED}; class FD extends R { constructor(...a) { if (a.length) super(...a); else super(F); } static now() { return F; } } global.Date = FD;\n`);

const old = spawnSync('git', ['-C', REPO, 'show', `${base}:dev/shell/hooks/session-start.js`], { encoding: 'utf8', maxBuffer: 1 << 24 });
if (old.status !== 0) throw new Error(`git show ${base}: ${old.stderr}`);
for (const [w, text] of [['old', old.stdout], ['new', fs.readFileSync(NEW, 'utf8')]]) {   // each hook sits in <root>/<w>/hooks so that '../lib/fresh-guard.js' resolves
  mk(path.join(root, w, 'hooks', 'session-start.js'), text);
  for (const f of ['ambient.js', 'fresh-guard.js']) { fs.mkdirSync(path.join(root, w, 'lib'), { recursive: true }); fs.copyFileSync(path.join(LIBSRC, f), path.join(root, w, 'lib', f)); }
}
for (const f of ['ambient.js', 'fresh-guard.js']) { fs.mkdirSync(path.join(shell, 'lib'), { recursive: true }); fs.copyFileSync(path.join(LIBSRC, f), path.join(shell, 'lib', f)); }
fs.mkdirSync(path.join(shell, 'digests'), { recursive: true });
const digests = fs.readdirSync(path.join(REAL, 'digests')).filter((f) => /^\d{4}-\d\d-\d\d\.md$/.test(f)).sort().slice(-2);
for (const d of digests) fs.copyFileSync(path.join(REAL, 'digests', d), path.join(shell, 'digests', d));
fs.copyFileSync(path.join(REAL, 'event_log.jsonl'), path.join(shell, 'event_log.jsonl'));
let cfg = {}; try { cfg = JSON.parse(fs.readFileSync(path.join(process.env.USERPROFILE || os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '')); } catch (_) { /* none */ }
const ambient = Object.fromEntries(Object.entries(cfg).filter(([k]) => /^ambient_/.test(k)));

function run(which, mode, source, cwd) {
  mk(path.join(home, '.consonance.json'), JSON.stringify({ ...ambient, instances_dir: path.join(root, 'instances'), ...(mode ? { gates_mode: mode } : {}) }));
  const r = spawnSync(process.execPath, ['-r', path.join(root, 'fixed-clock.js'), path.join(root, which, 'hooks', 'session-start.js')], { input: JSON.stringify({ hook_event_name: 'SessionStart', source, session_id: 'measure-1', cwd }), encoding: 'utf8', timeout: 30000,
    env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, USERPROFILE: home, HOME: home, CONSONANCE_SHELL_DIR: shell } });
  if (r.status !== 0) throw new Error(`${which} ${mode} ${source}: exit ${r.status} ${r.stderr}`);
  return JSON.parse(r.stdout).hookSpecificOutput.additionalContext;
}
const nonEmpty = (s) => s.split('\n').filter((l) => l.trim()).length;
const SEATS = { librarian: 'C:\\Consonance\\instances\\librarian', main: 'C:\\Consonance\\instances\\main', 'sibling A': 'C:\\Consonance\\instances\\sibling-3d57124e', 'third-place': 'C:\\Consonance\\instances\\third-place' };
const out = [`# measure.js: digests copied: ${digests.join(', ')}; old hook = git ${base}; tokens = bytes / 4; fixed clock`];
out.push('\n| cwd | source | before (old hook): bytes · tokens · non-empty lines | after, key absent (new hook): bytes | after, light: bytes · tokens · lines | cut |', '|---|---|---|---|---|---|');
const rowsOut = [];
for (const [name, cwd] of Object.entries(SEATS)) for (const source of ['startup', 'resume', 'compact']) {
  const a = run('old', null, source, cwd), b = run('new', null, source, cwd), c = run('new', 'light', source, cwd);
  const A = Buffer.byteLength(a), Bb = Buffer.byteLength(b), C = Buffer.byteLength(c);
  rowsOut.push({ name, source, A, Bb, C, same: a === b });
  out.push(`| ${name} | ${source} | ${A} · ~${Math.round(A / 4)} · ${nonEmpty(a)} | ${Bb}${a === b ? ' (identical)' : ' (DIFFERENT)'} | ${C} · ~${Math.round(C / 4)} · ${nonEmpty(c)} | ${A ? (100 * (1 - C / A)).toFixed(1) : 0}% |`);
}
out.push(`\nkey absent: identical to the old hook in ${rowsOut.filter((r) => r.same).length} of ${rowsOut.length} cases`);
const ex = run('new', 'light', 'startup', SEATS.librarian);
out.push('\n## the light startup injection for the librarian, in full (the real digests of this machine)\n```\n' + ex + '\n```');
console.log(out.join('\n'));
try { fs.rmSync(root, { recursive: true, force: true }); } catch (_) { /* temp */ }
