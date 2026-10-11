// D300: build a dosed (and optionally mutated) test binary from a tree, copy it out, restore the source.
//   node build-dose.js <tree> <target dir> <out exe> [mutant name]
// Run under the heavy-run lock (via lockrun.js). Prints the source sha before and after (must match).
const fs = require('fs'), cp = require('child_process'), crypto = require('crypto');
const dose = require('./dose.js'), MUT = require('./mutants.js');
const [tree, target, outExe, mut] = process.argv.slice(2);
const F = tree + '/consonance/src-tauri/src/main.rs';
const orig = fs.readFileSync(F, 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
let src = orig;
if (mut) {
  const m = MUT.find((x) => x[0] === mut); if (!m) throw new Error('no mutant ' + mut);
  for (const [from, to] of m[1]) { const n = src.split(from).length - 1; if (n !== 1) { console.log(`${mut}: NOT APPLIED (anchor found ${n} times)`); process.exit(3); } src = src.replace(from, () => to); }
}
if (process.env.NO_DOSE !== '1') src = dose(src);
try {
  fs.writeFileSync(F, src);
  const log = cp.execSync(`~/.cargo/bin/cargo.exe test --bin consonance --no-run --message-format=json 2>/dev/null`,
    { cwd: tree + '/consonance/src-tauri', shell: 'bash', env: { ...process.env, CARGO_TARGET_DIR: target }, encoding: 'utf8', maxBuffer: 1 << 28 });
  const exe = log.split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return {}; } })
    .filter((j) => j.reason === 'compiler-artifact' && j.executable && j.profile && j.profile.test).map((j) => j.executable).pop();
  if (!exe) throw new Error('no test executable in cargo output');
  fs.copyFileSync(exe, outExe);
  console.log(`built ${mut || '(no mutant)'}${process.env.NO_DOSE === '1' ? '' : ' +dose'} -> ${outExe}`);
} finally {
  fs.writeFileSync(F, orig);
  console.log(`source ${sha(orig)} restored ${sha(fs.readFileSync(F, 'utf8')) === sha(orig)}`);
}
