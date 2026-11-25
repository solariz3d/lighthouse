// L220, A's read of B's fix alone: my mutants of main.rs at 3829e1c3 in A's own detached worktree, the live site only (the first occurrence: the pinning rows quote the
// same text again), the WHOLE bin test suite after each rebuild. applied = the text occurs at least once and the first one is replaced; caught = a test fails.
const fs = require('fs'), { spawnSync } = require('child_process');
const WT = 'C:/Consonance/lh-wt-l216read/consonance/src-tauri', MAIN = WT + '/src/main.rs', ORIG = fs.readFileSync(MAIN, 'utf8');
const ASK = 'if no_prompt_for(skip_perms, is_managed_cwd(&cwd), is_builder_dir_name(&cwd), fs::read_to_string(config_path()).ok().as_deref()) {';
const M = [
  ['S2 the ask kept as text and ignored (|| true)', ASK, ASK.slice(0, -2) + ' || true {'],
  ['S3 the ask inverted', ASK, 'if !' + ASK.slice(3)],
  ['S5 the config is never read at the spawn', 'is_builder_dir_name(&cwd), fs::read_to_string(config_path()).ok().as_deref()) {', 'is_builder_dir_name(&cwd), None) {'],
  ['X1 the drain does not hold a pending pane', 'if cut_pending(&pane) {\n            return;\n        }\n', ''],
  ['X2 the dispatch is not held for a pending cut', '    if let Some(held) = hold_for_pending_cut(app, &tid, &msg, &preview) {\n        return held;\n    }\n', ''],
  ['X3 the hand-back cut may queue its /compact', '"cut at hand-back: /compact", false)', '"cut at hand-back: /compact", true)'],
  ['X4 the cut before a dispatch may queue its /compact', '"cut before dispatch: /compact", false)', '"cut before dispatch: /compact", true)'],
  ['X5 the hand-back cut never releases the pane after its send', 'let outcome = compact_and_confirm(&a, &pane, "cut at hand-back: /compact", false);\n                cut_release(&pane, gen);', 'let outcome = compact_and_confirm(&a, &pane, "cut at hand-back: /compact", false);'],
  ['X6 a drop does not release the pane', 'Err(why) => {\n                cut_release(&pane, gen);\n                chair_audit(&a, format!("{HOW} -> {letter}: {why}; anything held for it is delivered now"));', 'Err(why) => {\n                chair_audit(&a, format!("{HOW} -> {letter}: {why}; anything held for it is delivered now"));'],
  ['X7 the pane is pending only AFTER the thread starts (set inside it)', 'let Some(gen) = pending_cuts().lock().ok().and_then(|mut p| p.begin(&pane, ring_ms)) else {', 'let Some(gen) = Some(0u64).filter(|_| pending_cuts().lock().is_ok()) else {'],
  ['X8 the cut before a dispatch does not mark itself sent', 'p.begin(tid, now_ms).filter(|g| p.mark_sent(tid, *g))', 'p.begin(tid, now_ms)'],
];
function run() {
  const r = spawnSync('cargo', ['test', '--bin', 'consonance'], { cwd: WT, env: { ...process.env, CARGO_TARGET_DIR: 'C:/build/a-read-target' }, encoding: 'utf8', timeout: 1500000, maxBuffer: 1 << 26 });
  const out = (r.stdout || '') + (r.stderr || ''); const m = out.match(/test result: \w+\. (\d+) passed; (\d+) failed/);
  const failed = [...out.matchAll(/^test (\S+) \.\.\. FAILED/gm)].map((x) => x[1]);
  return { pass: m ? +m[1] : -1, fail: m ? +m[2] : -1, failed, out };
}
const c = run(); console.log('CONTROL (3829e1c3 unmutated): ' + c.pass + ' passed, ' + c.fail + ' failed ' + JSON.stringify(c.failed));
const base = new Set(c.failed);
let applied = 0, caught = 0, na = 0; const surv = [];
for (const [id, from, to] of M) {
  const at = ORIG.indexOf(from);
  if (at < 0) { na++; console.log('NOT APPLIED (0 occurrences): ' + id); continue; }
  fs.writeFileSync(MAIN, ORIG.slice(0, at) + to + ORIG.slice(at + from.length));
  const r = run();
  if (r.pass === -1) { na++; console.log('BUILD FAILED (not counted): ' + id + '\n' + r.out.slice(-400)); continue; }
  applied++;
  const fresh = r.failed.filter((f) => !base.has(f));
  if (fresh.length) { caught++; console.log('caught by ' + fresh.join(', ') + ': ' + id); } else { surv.push(id); console.log('NOT CAUGHT (' + r.pass + ' passed): ' + id); }
}
fs.writeFileSync(MAIN, ORIG);
console.log('applied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + na + (surv.length ? ' / SURVIVORS: ' + surv.join(' | ') : ''));
