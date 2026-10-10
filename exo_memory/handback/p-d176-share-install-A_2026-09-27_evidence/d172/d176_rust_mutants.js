// D176 Rust mutants on src-tauri/src/ac.rs, IN PLACE (build.rs copies ../app, ../src, ../tools by relative path, so a
// copied crate would not build): each mutant is written, `cargo test ac::` runs, and the original bytes are put back in
// a finally; the file's sha256 is checked equal at the end. Under the heavy-run lock, -j 4.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawnSync } = require('child_process');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 D176 A rust mutants (ac.rs in place, restored), -j 4' });
const REPO = 'C:/Users/nname/Desktop/t180-track-builder', F = path.join(REPO, 'src-tauri/src/ac.rs');
const cargo = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const target = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d165/t180_target';
const ONLY = process.argv[2] ? new RegExp(process.argv[2]) : null;
const M0 = [
  ['R1 no content/tracks check on install', 'let tracks = tracks_of(root)?;\n    if !super::valid_folder(folder)', 'let tracks = root.to_path_buf();\n    if !super::valid_folder(folder)'],
  ['R2 any folder name installs', 'if !super::valid_folder(folder) {\n        return Err(format!("{folder:?} is not a folder the builder makes', 'if false {\n        return Err(format!("{folder:?} is not a folder the builder makes'],
  ['R3 race.ini not restored', 'Some(b) => fs::write(ini, b).map_err', 'Some(_b) => Ok::<(), String>(()).map_err'],
  ['R4 no backup', 'fs::write(&bak, b).map_err(|e| format!("could not back up', 'Ok::<(), std::io::Error>(()).map_err(|e| format!("could not back up'],
  ['R5 setting on by default', '.map(|s| s.trim() == "yes").unwrap_or(false)', '.map(|s| s.trim() == "yes").unwrap_or(true)'],
  ['R6 foreign track can be planned', 'if !super::valid_folder(track) {\n        return Err(format!("{track:?}: only t180b_', 'if false {\n        return Err(format!("{track:?}: only t180b_'],
  ['R7 race.ini TRACK left as it was', 'if key.eq_ignore_ascii_case("TRACK") { out.push(format!("TRACK={track}")); done_track = true; continue; }', 'if key.eq_ignore_ascii_case("TRACK") { done_track = true; }'],
  ['R8 an arguments leak (-race)', 'args: Vec::new(), cwd: root.to_path_buf()', 'args: vec!["-race".into()], cwd: root.to_path_buf()'],
];
const M = M0.filter((m) => !ONLY || ONLY.test(m[0]));
const orig = fs.readFileSync(F), sha = (b) => crypto.createHash('sha256').update(b).digest('hex'), before = sha(orig);
const t = { listed: M.length, applied: 0, caught: 0, survived: [], na: [], nr: [] };
try {
  for (const [name, from, to] of M) {
    const src = orig.toString('utf8');
    if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); continue; }
    try {
      fs.writeFileSync(F, src.replace(from, () => to)); t.applied++;
      const r = spawnSync(cargo, ['test', '-j', '4', '--manifest-path', 'src-tauri/Cargo.toml', '--target-dir', target, '--lib', 'ac::'], { cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 28 });
      const out = (r.stdout || '') + (r.stderr || ''), res = /test result: (ok|FAILED)\. (\d+) passed; (\d+) failed/.exec(out);
      if (!res) { if (/could not compile/.test(out)) { t.caught++; console.log('caught  ', name, '(does not compile)'); } else { t.nr.push(name); console.log('NO RESULT', name, out.slice(-300)); } continue; }
      if (res[1] === 'FAILED') { t.caught++; console.log('caught  ', name, `(${res[3]} failing)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
    } finally { fs.writeFileSync(F, orig); }
  }
} finally { fs.writeFileSync(F, orig); }
console.log(`SUMMARY ${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · ac.rs ${sha(fs.readFileSync(F)) === before ? 'restored byte-exact' : 'CHANGED'}`);
