// lib.mutants.js (D592, pane E): installed_state_in and saved_at in t180's src-tauri/src/lib.rs, broken one way at a time; the two new tests must go red.
//   node C:/Users/nname/Desktop/lighthouse/consonance/tools/mutant-harness.js <this file>
'use strict';
module.exports = {
  label: 'd592-lib',
  repo: 'C:/Users/nname/Downloads/t180-wt-e592',
  rel: 'src-tauri/src/lib.rs',
  score: { cmd: 'C:/Users/nname/.cargo/bin/cargo.exe', args: ['test', '--lib', '--', 'installed_state', 'saved_at'], cwd: 'src-tauri' },
  rows: [
    ['R1 a missing folder reads as present', '    if !target.exists() {\n        return Ok(InstalledState { exists: false,', '    if false {\n        return Ok(InstalledState { exists: false,'],
    ['R2 a folder with no marker reads as the builder\'s', '    if !marker_path.is_file() {', '    if false {'],
    ['R3 the road the marker records is dropped', 'geometry: marker_geometry(&text), written })', 'geometry: None, written })'],
    ['R4 the time the marker records is dropped', 'Ok(InstalledState { exists: true, marker: true, geometry: marker_geometry(&text), written })', 'Ok(InstalledState { exists: true, marker: true, geometry: marker_geometry(&text), written: None })'],
    ['R5 any folder name is read', '    if !valid_folder(folder) {\n        return Err(format!("{folder:?} is not a folder the builder makes (t180b_…)"));\n    }\n    let target = tracks.join(folder);', '    let target = tracks.join(folder);'],
    ['R6 the saved time is in seconds', 'Some(t.duration_since(std::time::UNIX_EPOCH).ok()?.as_millis() as u64)', 'Some(t.duration_since(std::time::UNIX_EPOCH).ok()?.as_secs() as u64)'],
  ],
};
