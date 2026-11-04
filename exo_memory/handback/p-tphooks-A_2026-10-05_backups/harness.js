// harness.js: run every wired hook on sample payloads in an ISOLATED fake install, with a fixed clock, and record stdout / exit / stderr.
//   node harness.js before|after [out.json]      before = the saved originals for the files D245-3 edits, after = the live files
//   node harness.js diff before.json after.json  what changed, per (hook, cwd, event)
// Nothing here writes outside a temp dir: CONSONANCE_SHELL_DIR, CONSONANCE_DATA and USERPROFILE point into it, checkpoint.py / chain-status / state-block / ask are stubs, `py` is node.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const HOME_REAL = os.homedir(), SH = path.join(HOME_REAL, '.claude', 'shell'), LH = 'C:/Users/nname/Desktop/lighthouse';
const BAK = LH + '/exo_memory/handback/p-tphooks-A_2026-10-05_backups/';
const FIXED = Date.parse('2026-10-05T17:00:00Z');
const EDITED = { 'hooks/session-start.js': 'session-start.js', 'hooks/userprompt-submit.js': 'userprompt-submit.js', 'hooks/precompact.js': 'precompact.js', 'sessionstart-state.js': 'sessionstart-state.js' };

function build(variant) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tp-harness-')), shell = path.join(root, 'shell'), repo = path.join(root, 'repo'), home = path.join(root, 'home');
  const put = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
  const copy = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); };
  for (const rel of ['hooks/session-start.js', 'hooks/userprompt-submit.js', 'hooks/precompact.js', 'hooks/stop.js', 'hooks/ready-prompt.js', 'hooks/ready-stop.js', 'hooks/reply-slot.js', 'sessionstart-state.js', 'precompact-preserve.js', 'findings-return.js', 'sourced-stop.js', 'lib/ambient.js', 'lib/fresh-guard.js', 'lib/ready.js'])
    copy(variant === 'before' && EDITED[rel] ? BAK + EDITED[rel] + '.bak-20261005' : path.join(SH, rel), path.join(shell, rel));
  copy(variant === 'before' ? BAK + 'ask-surface.js.bak-20261005' : LH + '/consonance/hooks/ask-surface.js', path.join(repo, 'consonance', 'hooks', 'ask-surface.js'));
  put(path.join(shell, 'digests', '2026-10-04.md'), '# 2026-10-04 Digest\n\n## 12 sessions\n\n### C:\\Consonance\\instances\\main\n- 01:00:00 UTC\n');
  put(path.join(shell, 'digests', '2026-10-03.md'), '# 2026-10-03 Digest\n\n## 9 sessions\n');
  put(path.join(shell, 'event_log.jsonl'), '');
  put(path.join(repo, 'exo_memory', 'BOOT.md'), '# boot\n');
  put(path.join(repo, 'consonance', 'tools', 'chain-status.js'), "console.log('chain: STUB D999 DISPATCHED · holder panes');\n");
  put(path.join(repo, 'consonance', 'tools', 'state-block.js'), "console.log('REPO  HEAD stub1234 dirty 3 files (STATE BLOCK STUB)');\n");
  put(path.join(repo, 'consonance', 'tools', 'ask.js'), "console.log('ASK-999 stub question for the keeper, 3 days old');\n");
  put(path.join(home, 'Desktop', 'lighthouse', 'exo_memory', 'loop', 'checkpoint.py'), "console.log('# Checkpoint STUB (dirty files: a.js b.js)');\n");   // run by the fake `py`, which is node
  copy(process.execPath, path.join(root, 'bin', 'py.exe'));
  put(path.join(home, '.consonance.json'), JSON.stringify({ room_path: path.join(repo, 'exo_memory', 'BOOT.md'), ambient_lat: '50.4452', ambient_lon: '-104.6189', ambient_label: 'Regina, SK', ambient_tz: 'America/Regina' }));
  put(path.join(root, 'fixed-clock.js'), `const R = Date, F = ${FIXED}; class FD extends R { constructor(...a) { if (a.length) super(...a); else super(F); } static now() { return F; } } global.Date = FD;\n`);
  return { root, shell, repo, home };
}
const CWDS = {
  main: 'C:\\Consonance\\instances\\main', librarian: 'C:\\Consonance\\instances\\librarian', sibling: 'C:\\Consonance\\instances\\sibling-3d57124e', paneA: 'C:\\Consonance\\instances\\sibling-0845a868', fresh: 'C:\\Consonance\\instances\\fresh-abc',
  tp: 'C:\\Consonance\\instances\\third-place', tpSlash: 'C:\\Consonance\\instances\\third-place\\', tpSlash2: 'C:\\Consonance\\instances\\third-place\\\\', tpUpper: 'C:\\Consonance\\instances\\THIRD-PLACE', tpFwd: 'C:/Consonance/instances/third-place',
  tpPrefix: 'C:\\Consonance\\instances\\third-place-x', tpSub: 'C:\\Consonance\\instances\\third-place\\sub', tpMid: 'C:\\x\\third-place\\y', none: '',
};
const HOOKS = [   // [name, file, events]
  ['session-start', 'shell:hooks/session-start.js', [{ hook_event_name: 'SessionStart', source: 'startup' }, { hook_event_name: 'SessionStart', source: 'compact' }]],
  ['sessionstart-state', 'shell:sessionstart-state.js', [{ hook_event_name: 'SessionStart', source: 'compact' }, { hook_event_name: 'SessionStart', source: 'startup' }]],
  ['userprompt-submit', 'shell:hooks/userprompt-submit.js', [{ hook_event_name: 'UserPromptSubmit', prompt: 'hello' }]],
  ['findings-return', 'shell:findings-return.js', [{ hook_event_name: 'UserPromptSubmit', prompt: 'hello' }]],
  ['ask-surface', 'repo:consonance/hooks/ask-surface.js', [{ hook_event_name: 'UserPromptSubmit', prompt: 'hello' }]],
  ['ready-prompt', 'shell:hooks/ready-prompt.js', [{ hook_event_name: 'UserPromptSubmit', prompt: 'hello' }]],
  ['precompact', 'shell:hooks/precompact.js', [{ hook_event_name: 'PreCompact', trigger: 'manual' }, { hook_event_name: 'PreCompact', trigger: 'auto' }]],
  ['precompact-preserve', 'shell:precompact-preserve.js', [{ hook_event_name: 'PreCompact', trigger: 'manual' }]],
  ['stop', 'shell:hooks/stop.js', [{ hook_event_name: 'Stop', stop_hook_active: false }]],
  ['sourced-stop', 'shell:sourced-stop.js', [{ hook_event_name: 'Stop', stop_hook_active: false }]],
  ['ready-stop', 'shell:hooks/ready-stop.js', [{ hook_event_name: 'Stop', stop_hook_active: false }]],
  ['reply-slot', 'shell:hooks/reply-slot.js', [{ hook_event_name: 'Stop', stop_hook_active: false, last_assistant_message: 'ok' }]],
];
function runAll(variant) {
  const env0 = build(variant), out = {};
  for (const [name, file, events] of HOOKS) {
    const [where, rel] = file.split(':'), script = path.join(where === 'shell' ? env0.shell : env0.repo, rel);
    for (const [cwdName, cwd] of Object.entries(CWDS)) events.forEach((ev, i) => {
      try { fs.rmSync(path.join(env0.shell, 'userprompt_state.json'), { force: true }); } catch (_) {}
      const payload = { session_id: 'sid-' + cwdName, transcript_path: path.join(env0.root, 'nope.jsonl'), ...(cwd === '' ? {} : { cwd }), ...ev };
      const r = spawnSync(process.execPath, ['-r', path.join(env0.root, 'fixed-clock.js'), script], {
        input: JSON.stringify(payload), encoding: 'utf8', timeout: 20000, cwd: env0.root,
        env: { PATH: path.join(env0.root, 'bin') + path.delimiter + process.env.PATH, SystemRoot: process.env.SystemRoot, USERPROFILE: env0.home, HOME: env0.home, CONSONANCE_SHELL_DIR: env0.shell, CONSONANCE_DATA: path.join(env0.root, 'data'), CONSONANCE_READY_DIR: path.join(env0.root, 'ready'), TEMP: env0.root, TMP: env0.root },
      });
      out[`${name} | ${cwdName} | ${ev.source || ev.trigger || ev.hook_event_name}`] = { stdout: (r.stdout || '').split(env0.root).join('<ROOT>').split(env0.root.replace(/\\/g, '/')).join('<ROOT>'), stderr: (r.stderr || '').split(env0.root).join('<ROOT>'), status: r.status };
    });
  }
  fs.rmSync(env0.root, { recursive: true, force: true });
  return out;
}
module.exports = { runAll, CWDS };
if (require.main === module) {
  const [mode, a, b] = process.argv.slice(2);
  if (mode === 'before' || mode === 'after') { const o = runAll(mode); fs.writeFileSync(a || `tp_${mode}.json`, JSON.stringify(o, null, 1)); console.log(mode, Object.keys(o).length, 'runs'); }
  else if (mode === 'diff') {
    const A = JSON.parse(fs.readFileSync(a)), B = JSON.parse(fs.readFileSync(b)); let same = 0, tpDiff = 0, other = [];
    for (const k of Object.keys(A)) { const isTp = /\| tp(Slash2?|Upper|Fwd)? \|/.test(k); if (JSON.stringify(A[k]) === JSON.stringify(B[k])) same++; else if (isTp) tpDiff++; else other.push(k); }
    console.log(`identical ${same}, changed for a third-place cwd ${tpDiff}, CHANGED FOR ANOTHER CWD ${other.length}`); if (other.length) console.log(other.join('\n'));
  }
}
