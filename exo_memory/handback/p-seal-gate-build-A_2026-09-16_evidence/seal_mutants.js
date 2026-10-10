// Mutants for the seal gate, ON A COPY: a git worktree of HEAD in the scratchpad, with the live checkout's
// working copies of mcp.rs and brief/COMMITTEE.md copied in, and its own CARGO_TARGET_DIR. The live checkout and
// its target are never touched; their tracked files are hashed before and after.
// L061 order: shape (R3) -> dirty-source check -> anchor audit (R2) -> mutate. A survivor prints what it became.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const LIVE = 'C:/Users/nname/Desktop/lighthouse';
const S = __dirname;
const WT = path.join(S, 'wt-seal-mutants');
const TARGET = path.join(S, 'target-seal-mutants');
const CARGO = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const REL = 'consonance/src-tauri/src/mcp.rs';

const M = [
  ['NO FETCH: the seal is checked against the cached remote ref (the L062 packet\'s own command)',
    '    match git(&["fetch", "--quiet", &remote]) {',
    '    match Ok::<GitOut, String>(GitOut { code: 0, stdout: String::new() }) {'],
  ['NO ANCESTRY: a seal that is not on origin passes',
    '    match git(&["merge-base", "--is-ancestor", &commit, &upstream]) {',
    '    match Ok::<GitOut, String>(GitOut { code: 0, stdout: String::new() }) {'],
  ['a block edited after its commit passes',
    '    if !same {', '    if false && !same {'],
  ['a key changed since sealing passes',
    '        Ok(o) if o.code == 0 && o.stdout.trim().eq_ignore_ascii_case(&block.key_git_blob) => {}',
    // `&& true` keeps the replacement unique: the bare `Ok(o) if o.code == 0 => {}` is already a legitimate line in
    // this file, and the dirty-source check refused the first run on it (a substring check, L061 §6.5's limit).
    '        Ok(o) if o.code == 0 && true => {}'],
  ['the leak search reads tracked files only',
    "    for rel_path in tracked.split('\\0').chain(untracked.split('\\0')).filter(|p| !p.is_empty()) {",
    "    for rel_path in tracked.split('\\0').chain(\"\".split('\\0')).filter(|p| !p.is_empty()) {"],
  ['G9 broken: the refusal quotes the matched line',
    '                    hits.push(format!("{rel_path}:{} ({})", n + 1, kind.to_lowercase()));',
    '                    hits.push(format!("{rel_path}:{} ({}) {line}", n + 1, kind.to_lowercase()));'],
  ['a key beside the object passes',
    '    if key_dir == obj_dir || obj_dir.starts_with(&format!("{key_dir}/")) || key_dir.starts_with(&format!("{obj_dir}/")) {',
    '    if false {'],
  ['a dispatch naming the key path passes',
    '    if seal_norm(text).contains(&key_n) {', '    if false {'],
  ['an object with a committed twin passes',
    '    if !twins.is_empty() {', '    if false && !twins.is_empty() {'],
  ['the undeclared reverse lookup never fires',
    '                if needle.len() >= SEAL_MIN_LITERAL && hay.contains(&needle) {',
    '                if false {'],
  ['seal: "none" with no reason is accepted',
    '            if reason.is_empty() {', '            if false {'],
  ['a key inside the checkout passes this check (the leak search is still behind it)',
    '    if key_n == repo_n || key_n.starts_with(&format!("{repo_n}/")) {', '    if false {'],
  ['the audit stops flagging a sealing commit wider than the row',
    '            Some(n) => format!("that commit touched {n} files — NOT the seal-row push exception if it was pushed unattended"),',
    '            Some(n) => format!("that commit touched {n} files"),'],
  ['chair_inject no longer calls the gate',
    '        let verdict = tokio::task::spawn_blocking(move || seal_gate_at(seal_decl.as_deref(), &seal_text, seal_repo.as_deref()))',
    '        let verdict = tokio::task::spawn_blocking(move || { let _ = (seal_decl, seal_text, seal_repo); SealVerdict::Allow(None) })'],
];

const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const LIVE_FILES = [REL, 'consonance/src-tauri/brief/COMMITTEE.md', 'consonance/src-tauri/src/main.rs'].map((f) => path.join(LIVE, f));
const before = Object.fromEntries(LIVE_FILES.map((p) => [p, sha(p)]));
const original = fs.readFileSync(path.join(LIVE, REL), 'utf8');

// R3
const bad = M.map((m, i) => [i + 1, m]).filter(([, m]) => m.length !== 3 || m.some((x) => typeof x !== 'string' || !x) || m[1] === m[2]);
if (bad.length) { console.error('MALFORMED LIST', bad); process.exit(2); }
// the dirty-source check, before R2
const dirty = M.map((m, i) => [i + 1, ...m]).filter(([, , , to]) => original.includes(to));
if (dirty.length) { console.error('THE SOURCE ALREADY CARRIES A MUTATION — restore it, do not re-point anchors', dirty.map((d) => d[0])); process.exit(2); }
// R2
const orphan = M.map((m, i) => [i + 1, m[0], m[1], original.split(m[1]).length - 1]).filter(([, , , h]) => h !== 1);
if (orphan.length) {
  for (const [id, name, a, h] of orphan) console.error(`#${id} ${name}: ${h === 0 ? 'MISSING' : h + ' MATCHES'} — anchor: ${JSON.stringify(a)}`);
  process.exit(2);
}

const run = (cmd, args, opts) => spawnSync(cmd, args, Object.assign({ encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }, opts));
if (!fs.existsSync(WT)) {
  const r = run('git', ['-C', LIVE, 'worktree', 'add', '--detach', WT, 'HEAD']);
  if (r.status !== 0) { console.error(r.stderr); process.exit(2); }
}
for (const f of [REL, 'consonance/src-tauri/brief/COMMITTEE.md']) fs.copyFileSync(path.join(LIVE, f), path.join(WT, f));
const WT_MCP = path.join(WT, REL);
const CRATE = path.join(WT, 'consonance', 'src-tauri');
const env = { ...process.env, CARGO_TARGET_DIR: TARGET, PATH: `${path.dirname(CARGO)};${process.env.PATH}` };
const score = () => {
  const r = run(CARGO, ['test', '--bin', 'consonance', 'seal_gate_tests', '--', '--test-threads=4'], { cwd: CRATE, env, timeout: 3600000 });
  const out = (r.stdout || '') + (r.stderr || '');
  const m = /test result: (ok|FAILED)\. (\d+) passed; (\d+) failed/.exec(out);
  if (!m) return { state: 'NO RESULT', out };
  return { state: m[1] === 'ok' ? 'green' : 'red', passed: +m[2], failed: +m[3] };
};

let killed = 0, notApplied = 0;
const survivors = [];
try {
  fs.writeFileSync(WT_MCP, original);
  const t0 = Date.now();
  const pre = score();
  console.log(`pre-flight (unmutated copy, cold target): ${pre.state} ${pre.passed ?? ''}/${pre.failed ?? ''} in ${Math.round((Date.now() - t0) / 1000)} s`);
  if (pre.state !== 'green') { console.error((pre.out || '').slice(-3000)); process.exitCode = 2; }
  else {
    for (const [i, [name, from, to]] of M.entries()) {
      if (original.split(from).length - 1 !== 1) { notApplied++; console.log(`  NOT APPLIED #${i + 1} ${name} — anchor: ${JSON.stringify(from)}`); continue; }
      fs.writeFileSync(WT_MCP, original.replace(from, () => to));
      const r = score();
      if (r.state === 'red') { killed++; console.log(`  killed    #${i + 1} ${name}   (${r.failed} failed)`); }
      else if (r.state === 'green') {
        survivors.push(`#${i + 1} ${name}\n      anchor: ${JSON.stringify(from)}\n      became: ${JSON.stringify(to)}`);
        console.log(`  SURVIVED  #${i + 1} ${name}`);
      } else { console.log(`  NO RESULT #${i + 1} ${name} — did not compile or crashed; NOT counted as killed\n${(r.out || '').slice(-1500)}`); }
    }
    console.log(`\nseal gate mutants: ${M.length} listed · ${killed} killed · ${survivors.length} survived · ${notApplied} not applied`);
    for (const s of survivors) console.log('  ' + s);
  }
} finally {
  fs.writeFileSync(WT_MCP, original);
  console.log(`live checkout's files unchanged: ${LIVE_FILES.every((p) => sha(p) === before[p])}`);
}
