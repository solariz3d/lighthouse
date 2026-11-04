// gate_mut.js: one lock hold. CONTROL (unmutated copies) must be green, then each mutant changes ONE thing in ONE hook copy and the test must go red.  output: gate_mut.txt
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'A D245-3 gate mutants' });
const LH = 'C:/Users/nname/Desktop/lighthouse', TEST = LH + '/dev/shell/hooks/third-place-gate.test.js';
const SRC = { 'session-start.js': LH + '/dev/shell/hooks/session-start.js', 'userprompt-submit.js': LH + '/dev/shell/hooks/userprompt-submit.js', 'precompact.js': LH + '/dev/shell/hooks/precompact.js', 'sessionstart-state.js': LH + '/consonance/hooks/sessionstart-state.js', 'ask-surface.js': LH + '/consonance/hooks/ask-surface.js' };
const RE = "/[\\\\/]third-place[\\\\/]?$/i.test(String(cwd || '').replace(/[\\\\/]+$/, ''))";   // the one regex line as written in the hooks (template form)
const M = [
  ['G1 session-start: the digests are not gated', 'session-start.js', 'isThirdPlaceCwd(meta.cwd) ? [] : getRecentDigests(2)', 'getRecentDigests(2)'],
  ['G2 userprompt-submit: the chain line is always read', 'userprompt-submit.js', 'buildBeacon(state, isThirdPlaceCwd(meta && meta.cwd))', 'buildBeacon(state, false)'],
  ['G3 userprompt-submit: noChain is ignored', 'userprompt-submit.js', 'if (cfg.room_path && !noChain) {', 'if (cfg.room_path) {'],
  ['G4 precompact: the checkpoint is not gated', 'precompact.js', 'if (/[\\\\/]third-place[\\\\/]?$/i.test(String(payload.cwd || "").replace(/[\\\\/]+$/, ""))) process.exit(0);', ''],
  ['G5 sessionstart-state: the state block is not gated', 'sessionstart-state.js', 'if (isThirdPlaceCwd(payload.cwd)) {', 'if (false) {'],
  ['G6 ask-surface: the asks are not gated', 'ask-surface.js', 'if (isThirdPlaceCwd(payloadCwd)) done(null);', ''],
  ['G7 gate over-takes: the pulse loses its date line for the seat too', 'userprompt-submit.js', "const parts = [`[pulse] ${fmtStamp(now)}`];", "const parts = [noChain ? '' : `[pulse] ${fmtStamp(now)}`];"],
  ['G8 regex: no case-insensitivity (session-start)', 'session-start.js', "third-place[\\\\/]?$/i.test(String(cwd", "third-place[\\\\/]?$/.test(String(cwd"],
  ['G9 regex: a trailing separator is not stripped (userprompt-submit)', 'userprompt-submit.js', ".replace(/[\\\\/]+$/, ''));\n", ".replace(/xx$/, ''));\n"],
  ['G10 regex: no end anchor (sessionstart-state) so third-place-x is the seat', 'sessionstart-state.js', "third-place[\\\\/]?$/i.test(String(cwd", "third-place/i.test(String(cwd"],
  ['G11 regex: no leading separator (ask-surface) so notthird-place is the seat', 'ask-surface.js', "/[\\\\/]third-place[\\\\/]?$/i.test(String(cwd", "/third-place[\\\\/]?$/i.test(String(cwd"],
  ['G12 the skip is not recorded with its reason (sessionstart-state)', 'sessionstart-state.js', "reason: 'third-place cwd'", "reason: 'source not served'"],
];
function tree(edit) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'tp-gate-mut-')); fs.mkdirSync(path.join(d, 'shell')); fs.mkdirSync(path.join(d, 'cons'));
  for (const [f, p] of Object.entries(SRC)) fs.writeFileSync(path.join(d, ['sessionstart-state.js', 'ask-surface.js'].includes(f) ? 'cons' : 'shell', f), fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n'));
  if (edit) { const [, f, a, b] = edit, p = path.join(d, ['sessionstart-state.js', 'ask-surface.js'].includes(f) ? 'cons' : 'shell', f), s = fs.readFileSync(p, 'utf8'), n = s.split(a).length - 1; if (n !== 1) throw new Error(`NOT APPLIED (${n}x) ${edit[0]}`); fs.writeFileSync(p, s.replace(a, () => b)); }
  return d;
}
const runT = (d) => { const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', TEST], { encoding: 'utf8', maxBuffer: 1 << 26, env: { ...process.env, FORCE_COLOR: '0', TP_GATE_HOOKS: JSON.stringify({ shell: path.join(d, 'shell'), consonance: path.join(d, 'cons') }) } }); const t = (r.stdout || '') + (r.stderr || ''); const g = (k) => Number((new RegExp('ℹ ' + k + ' (\\d+)').exec(t) || [])[1]); return { tests: g('tests'), pass: g('pass'), fail: g('fail'), t }; };
let out = [], caught = 0;
const c = tree(null), rc = runT(c); fs.rmSync(c, { recursive: true, force: true });
out.push(`CONTROL unmutated copies: tests ${rc.tests} pass ${rc.pass} fail ${rc.fail}`); if (rc.fail !== 0 || rc.tests < 4) { out.push('CONTROL NOT GREEN: no mutant result means anything\n' + rc.t.slice(-1500)); }
else for (const m of M) {
  let d; try { d = tree(m); } catch (e) { out.push(String(e.message)); continue; }
  const r = runT(d); fs.rmSync(d, { recursive: true, force: true }); const ok = r.fail > 0; caught += ok ? 1 : 0; out.push(`${ok ? 'caught    ' : 'NOT CAUGHT'} ${m[0]} (tests ${r.tests} fail ${r.fail})`);
}
out.push(`caught ${caught} of ${M.length}`); fs.writeFileSync(__dirname + '/gate_mut.txt', out.join('\n') + '\n'); console.log(out.join('\n'));
