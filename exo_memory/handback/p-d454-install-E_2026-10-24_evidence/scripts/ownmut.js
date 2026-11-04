// ownmut.js (D454 part 3, pane E): each D454 fix put back the old way, one at a time, and the APP RULE (D454) row of its file run against it.
// A mutant whose anchor is not found is NOT APPLIED and counts as nothing. Usage: node ownmut.js <lighthouse worktree>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const root = process.argv[2];
const M = [
  ['M1 sources-gate: no third step', 'consonance/hooks/sources-gate.js', "  return path.join(os.homedir(), '.consonance');\n}", '  return null;\n}', 'consonance/hooks/sources-gate.test.js'],
  ['M2 claim-check: no third step', 'consonance/hooks/claim-check.js', "  return path.join(os.homedir(), '.consonance');   // D454", '  return null;   // D454', 'consonance/hooks/claim-check.test.js'],
  ['M3 heavy-run: no default dir', 'consonance/tools/heavy-run.js', '  if (dataDir === undefined && !dir) { dir = appDefaultDataDir(); fs.mkdirSync(dir, { recursive: true }); }\n', '', 'consonance/tools/heavy-run.test.js'],
  ['M4 heavy-run: default dir not created', 'consonance/tools/heavy-run.js', 'dir = appDefaultDataDir(); fs.mkdirSync(dir, { recursive: true });', 'dir = appDefaultDataDir();', 'consonance/tools/heavy-run.test.js'],
  ['M5 state-block: CONSONANCE_DATA ignored', 'consonance/tools/state-block.js', "  const e = String(env.CONSONANCE_DATA || '').trim(); if (e) return e;\n", '', 'consonance/tools/state-block.test.js'],
  ['M6 state-block: config data_dir ignored', 'consonance/tools/state-block.js', '.data_dir || \'\').trim(); if (d) return d; } catch (_) { /* none: the default */ }', ".data_dir || '').trim(); } catch (_) { /* none: the default */ }", 'consonance/tools/state-block.test.js'],
  ['M7 state-block: printed check keeps the old path', 'consonance/tools/state-block.js', "cmd: 'tail -1 ' + hw,", "cmd: 'tail -1 ' + path.join('C:', 'Consonance', 'data', 'head-watch.jsonl'),", 'consonance/tools/state-block.test.js'],
  ['M8 pulse: no third tier', 'dev/shell/hooks/userprompt_pulse.py', '        return os.path.join(os.path.expanduser("~"), ".consonance"), "default"\n', '        return None, None\n', 'dev/shell/hooks/userprompt_pulse.test.js'],
  ['M9 lap-row: the fixed folder of one machine back', 'consonance/tools/lap-row.js', "fromConfig('data_dir') || path.join(os.homedir(), '.consonance');", "fromConfig('data_dir') || path.join('C:', 'Consonance', 'data');", 'consonance/tools/lap-row.test.js'],
  ['M10 prompt-events: the fixed captures folder back', 'consonance/tools/prompt-events.js', 'const CAPTURES = path.join(dataDir(), "captures");', 'const CAPTURES = path.join("C:", "Consonance", "data", "captures");', 'consonance/tools/prompt-events.test.js', 'script'],
  ['M11 prompt-events: config data_dir ignored', 'consonance/tools/prompt-events.js', '.data_dir || "").trim(); if (d) return d; }', '.data_dir || "").trim(); }', 'consonance/tools/prompt-events.test.js', 'script'],
  ['M12 tell-index: the fixed default back', 'consonance/tools/tell-index.js', "  return path.join(os.homedir(), '.consonance');   // D454", "  return path.join('C:', 'Consonance', 'data');   // D454", 'consonance/tools/tell-index.test.js'],
  ['M13 whats-live: default data dir is the fixed folder', 'consonance/tools/whats-live.js', "fromConfig('data_dir') || path.join(HOME, '.consonance');", "fromConfig('data_dir') || path.join('C:', 'Consonance', 'data');", 'consonance/tools/whats-live.test.js'],
  ['M14 whats-live: instances_dir ignored', 'consonance/tools/whats-live.js', "const INSTANCES = fromConfig('instances_dir') || path.join(HOME, 'claude-instances');", "const INSTANCES = path.join(HOME, 'claude-instances');", 'consonance/tools/whats-live.test.js'],
  ['M15 hooks/README: claim-check dropped from the third state', 'consonance/hooks/README.md', '`live-mirror-stop.js`, `claim-check.js` (built and off: it acts only when `~/.consonance.json` sets `claim_check`), and', '`live-mirror-stop.js`, and', 'consonance/tools/install-only.test.js', 'script'],
  ['M16 hooks/README: the count is wrong', 'consonance/hooks/README.md', 'list has five files in the third state', 'list has three files in the third state', 'consonance/tools/install-only.test.js', 'script'],
  ['M17 release-chime: the fixed three back as the default', 'consonance/hooks/release-chime.js', ': defaultRepos(cfg);', ": ['t180', 'consonance', 'lighthouse'];", 'consonance/hooks/release-chime.test.js', 'tap-all'],
  ['M18 release-chime: the room is not read', 'consonance/hooks/release-chime.js', "  const rp = cfg && typeof cfg.room_path === 'string' ? cfg.room_path.trim() : '';", "  const rp = '';", 'consonance/hooks/release-chime.test.js', 'tap-all'],
  ['M19 scratch: the G: probe back before the config', 'consonance/tools/scratch.js', '  const home = env.USERPROFILE || env.HOME || os.homedir();\n', "  if (platform === 'win32') { try { if (exists('G:' + String.fromCharCode(92))) return path.join('G:' + String.fromCharCode(92), DEFAULT_DRIVE_DIR); } catch {} }\n  const home = env.USERPROFILE || env.HOME || os.homedir();\n", 'consonance/tools/scratch.test.js', 'tap-all'],
  ['M20 scratch: scratch_dir ignored', 'consonance/tools/scratch.js', "    if (typeof d === 'string' && d.trim()) return path.resolve(d.trim());\n", '', 'consonance/tools/scratch.test.js', 'tap-all'],
  ['M21 pulse: no third tier, seen by pulse-degrade', 'dev/shell/hooks/userprompt_pulse.py', '        return os.path.join(os.path.expanduser("~"), ".consonance"), "default"', '        return None, None', 'consonance/tools/pulse-degrade.test.js', 'script'],
  ["M22 ask-ending: no third step","consonance/hooks/ask-ending.js","return path.join(os.homedir(), '.consonance');   // D454: the app's third step (main.rs default_data), so a new user's","return null;   // D454: the app's third step (main.rs default_data), so a new user's","consonance/hooks/ask-ending.test.js"],
  ["M23 second-reader: no third step","consonance/hooks/second-reader.js","return path.join(os.homedir(), '.consonance');   // D454: the app's third step (main.rs default_data), so a new user's","return null;   // D454: the app's third step (main.rs default_data), so a new user's","consonance/hooks/second-reader.test.js"],
  ["M24 push-gate: no third step","consonance/hooks/push-gate.js","return path.join(os.homedir(), '.consonance');   // D454: the app's third step (main.rs default_data), so a new user's","return null;   // D454: the app's third step (main.rs default_data), so a new user's","consonance/hooks/push-gate.test.js"],
  ["M25 delete-gate: no third step","consonance/hooks/delete-gate.js","return path.join(os.homedir(), '.consonance');   // D454: the app's third step (main.rs default_data), so a new user's","return null;   // D454: the app's third step (main.rs default_data), so a new user's","consonance/hooks/delete-gate.test.js"],
];
let applied = 0, caught = 0, notApplied = 0;
for (const [name, rel, from, to, test, kind] of M) {
  const f = path.join(root, rel), orig = fs.readFileSync(f, 'utf8'), lf = orig.split('\r\n').join('\n');
  if (lf.split(from).length !== 2) { notApplied++; console.log('NOT APPLIED', name); continue; }
  const mut = lf.replace(from, () => to); fs.writeFileSync(f, orig.includes('\r\n') ? mut.split('\n').join('\r\n') : mut);
  try {
    // a node:test file runs only its APP RULE rows (TAP, so the fail count is read); a plain script file (its own ok()/test()) runs whole and fails by exit code
    // 'tap-all': a node:test file whose new rows are not named APP RULE, run whole
    const r = kind === 'tap-all' ? spawnSync(process.execPath, ['--test', '--test-reporter=tap', path.join(root, test)], { cwd: root, encoding: 'utf8', timeout: 300000 }) : kind === 'script' ? spawnSync(process.execPath, [path.join(root, test)], { cwd: root, encoding: 'utf8', timeout: 300000 })
      : spawnSync(process.execPath, ['--test', '--test-reporter=tap', '--test-name-pattern=APP RULE', path.join(root, test)], { cwd: root, encoding: 'utf8', timeout: 180000 });
    const failed = kind === 'script' ? r.status !== 0 : kind === 'tap-all' ? r.status !== 0 && /^# fail [1-9]/m.test(r.stdout) : r.status !== 0 && /^# fail [1-9]/m.test(r.stdout);
    applied++; if (failed) caught++;
    console.log((failed ? 'caught     ' : 'NOT CAUGHT ') + name + '  (' + (/^# fail \d+/m.exec(r.stdout) || ['?'])[0] + ')');
  } finally { fs.writeFileSync(f, orig); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}`);
