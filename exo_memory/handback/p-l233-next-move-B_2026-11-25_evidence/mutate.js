// B, L233: is each row load-bearing? One change at a time to the shipped code, the rows run, the file restored.
//   node mutate.js <worktree> js|rust
// Caught = the rows go red. Printed one line a mutant; a mutant whose text is not found is an error, not a pass.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const [WT, KIND] = process.argv.slice(2);
const MUTANTS = {
  js: [
    ['consonance/ui/next-move.js', "if (list.length) return 'compact';", "if (list.length > 1) return 'compact';", 'consonance/ui/next-move.test.js'],
    ['consonance/ui/next-move.js', "if (f.newerBuild === true) return", "if (f.newerBuild) return", 'consonance/ui/next-move.test.js'],
    ['consonance/ui/next-move.js', "return f.paneWorking ? 'restart-waiting' : 'restart';", "return 'restart';", 'consonance/ui/next-move.test.js'],
    ['consonance/ui/next-move.js', "        v.restart.dimmed = true;\n        v.restart.title = 'a newer Consonance is built' + built + '; ' +", "        v.restart.title = 'a newer Consonance is built' + built + '; ' +", 'consonance/ui/next-move.test.js'],
    ['consonance/ui/next-move.js', "els.compact.title = v.compact.title || compactTitle;", "els.compact.title = v.compact.title || els.compact.title;", 'consonance/ui/next-move.test.js'],
    ['consonance/ui/next-move.js', "els.restart.hidden = !v.restart.shown;", "if (v.restart.shown) els.restart.hidden = false;", 'consonance/ui/next-move.test.js'],
    ['consonance/tools/relaunch.js', "while (k.alive(o.pid)) {", "while (false) {", 'consonance/tools/relaunch.test.js'],
    ['consonance/tools/relaunch.js', "CONSONANCE_LAUNCH_ID: _thatLaunchOnly, ", "", 'consonance/tools/relaunch.test.js'],
    ['consonance/tools/relaunch.js', "if (!o.exe || !path.isAbsolute(o.exe))", "if (!o.exe)", 'consonance/tools/relaunch.test.js'],
    ['consonance/tools/relaunch.js', "      return { code: 2, why };", "      break;", 'consonance/tools/relaunch.test.js'],
  ],
  rust: [
    ['consonance/src-tauri/src/main.rs', 'matches!(exe_mtime, Some(t) if t > started)', 'matches!(exe_mtime, Some(t) if t >= started)'],
    ['consonance/src-tauri/src/main.rs', 'matches!(exe_mtime, Some(t) if t > started)', 'exe_mtime.is_some()'],
    ['consonance/src-tauri/src/main.rs', 'fs::metadata(exe).ok().filter(|m| m.is_file())', 'fs::metadata(exe.with_extension("exe.running-before-l233")).ok().filter(|m| m.is_file())'],
    ['consonance/src-tauri/src/main.rs', '    *NEXT_MOVE_COMPACT.lock().unwrap_or_else(|p| p.into_inner()) = None;   // L233', '    // L233'],
    ['consonance/src-tauri/src/main.rs', '        .env_remove(LAUNCH_ID_ENV)\n', ''],
    ['consonance/src-tauri/src/main.rs', '    let _ = process_start(); // L233', '    // L233'],
  ],
};
const isRust = KIND === 'rust';
for (const [file, from, to, test] of MUTANTS[KIND]) {
  const p = path.join(WT, file), orig = fs.readFileSync(p, 'utf8');
  if (orig.split(from).length !== 2) { console.log(`ERROR not found once: ${from.slice(0, 60)}`); process.exitCode = 1; continue; }
  fs.writeFileSync(p, orig.replace(from, to));
  try {
    const r = isRust
      ? spawnSync('cargo', ['test', '-q', '--bin', 'consonance', 'next_move_tests'], { cwd: path.join(WT, 'consonance/src-tauri'), encoding: 'utf8', timeout: 900000 })
      : spawnSync(process.execPath, [path.join(WT, test)], { encoding: 'utf8', timeout: 120000 });
    const out = (r.stdout || '') + (r.stderr || '');
    const summary = isRust ? ((out.match(/test result: .*/) || [])[0] || (/error\[|^error:/m.test(out) ? 'DID NOT COMPILE' : 'no result line')) : ((out.match(/\d+ passed, \d+ failed/) || [])[0] || 'no result line');
    console.log(`${r.status === 0 ? 'SURVIVED' : 'caught  '} ${file.split('/').pop()}: ${from.split('\n')[0].trim().slice(0, 70)} -> ${to.split('\n')[0].trim().slice(0, 50) || '(removed)'} | ${summary}`);
  } finally {
    fs.writeFileSync(p, orig);
  }
}
