// B (L218 fix): A's mutate_main.js, re-pointed at a detached worktree of a77e2d8c, with W3-W4 added. Originally: L220 second read of l216-no-prompt, item 3 and the wiring: one mutant at a time on main.rs in A's OWN detached worktree of fc8a971b
// (never B's), rebuilt and run against B's L216 rows (no_prompt_tests) and L218's two wiring rows. applied = exactly one occurrence; caught = a row fails.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const WT = 'C:/<user>/Downloads/lh-wt-l218mut/consonance/src-tauri', MAIN = WT + '/src/main.rs', ORIG = fs.readFileSync(MAIN, 'utf8');
const ASK = 'if no_prompt_for(skip_perms, is_managed_cwd(&cwd), is_builder_dir_name(&cwd), fs::read_to_string(config_path()).ok().as_deref()) {';
const M = [
  ['S1 THE SOURCE ROW\'S OWN MUTANT: the ask is removed from the spawn (every pane keeps its prompt)', ASK, 'if false {'],
  ['S2 the ask is kept as text and ignored (|| true: every pane, housed seats too, is denied)', ASK, 'if no_prompt_for(skip_perms, is_managed_cwd(&cwd), is_builder_dir_name(&cwd), fs::read_to_string(config_path()).ok().as_deref()) || true {'],
  ['S3 the ask is inverted', ASK, 'if !no_prompt_for(skip_perms, is_managed_cwd(&cwd), is_builder_dir_name(&cwd), fs::read_to_string(config_path()).ok().as_deref()) {'],
  ['S4 the builder-name argument is true (a keeper\'s or housed pane under the instances root is denied)', 'no_prompt_for(skip_perms, is_managed_cwd(&cwd), is_builder_dir_name(&cwd),', 'no_prompt_for(skip_perms, is_managed_cwd(&cwd), true,'],
  ['S5 the config is never read at the spawn (the builder_no_prompt switch cannot turn it off)', 'is_builder_dir_name(&cwd), fs::read_to_string(config_path()).ok().as_deref()) {', 'is_builder_dir_name(&cwd), None) {'],
  ['S6 the flag names some other file', 'cmd.args(["--settings", &p]);', 'cmd.args(["--settings", "x.json"]);'],
  ['W1 the dispatch is not held for the cut (cut_before_dispatch not asked)', '    if let Some(held) = cut_before_dispatch(app, &tid, &msg, &preview) {\n        return held;\n    }\n', ''],
  ['W2 the hand-back cut is not called after the delivered ring', '            cut_at_handback_after_ring(app, letter, text);\n', ''],
  ['W3 the drain does not hold a pending pane', '        if cut_pending(&pane) {\n            return;\n        }\n', ''],
  ['W4 the dispatch is not held for a pending cut', '    if let Some(held) = hold_for_pending_cut(app, &tid, &msg, &preview) {\n        return held;\n    }\n', ''],
];
function run() {
  const r = spawnSync('cargo', ['test', '--bin', 'consonance', '--', 'no_prompt', 'cut_at_handback', 'the_one_compact_send', 'a_pending_cut', 'every_write_into_a_pane'], { cwd: WT, env: { ...process.env, CARGO_TARGET_DIR: 'C:/build/b-read-target' }, encoding: 'utf8', timeout: 900000 });
  const out = (r.stdout || '') + (r.stderr || ''); const m = out.match(/test result: \w+\. (\d+) passed; (\d+) failed/);
  return { pass: m ? +m[1] : -1, fail: m ? +m[2] : -1, out };
}
const c = run(); console.log('CONTROL (B\'s main.rs, unmutated): ' + c.pass + ' passed, ' + c.fail + ' failed');
let applied = 0, caught = 0, na = 0; const surv = [];
for (const [id, from, to] of M) {
  const n = ORIG.split(from).length - 1;
  if (n !== 1) { na++; console.log('NOT APPLIED (' + n + '): ' + id); continue; }
  fs.writeFileSync(MAIN, ORIG.replace(from, () => to));
  const r = run();
  if (r.pass === -1) { na++; console.log('BUILD FAILED (not counted): ' + id + '\n' + r.out.slice(-500)); continue; }
  applied++;
  if (r.fail > 0) { caught++; console.log('caught (' + r.fail + ' failed of ' + (r.pass + r.fail) + '): ' + id); } else { surv.push(id); console.log('NOT CAUGHT (' + r.pass + ' passed): ' + id); }
}
fs.writeFileSync(MAIN, ORIG);
console.log('applied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + na + (surv.length ? ' / SURVIVORS: ' + surv.join(' | ') : ''));
