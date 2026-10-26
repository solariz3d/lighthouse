'use strict';
// D476 part 2 (O): each mutant breaks one guard of the Third Place's return leg; `cargo test third_place` must fail a named test. Applied to the
// file, run, restored (also on exit), at BelowNormal under one heavy-run slot. Raw output per mutant beside the verdicts.   node d476-mutants.js <src-tauri dir>
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const T = path.resolve(process.argv[2]), OUT = path.join(__dirname, 'mutant-out'); fs.mkdirSync(OUT, { recursive: true });
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'd476 O mutants (main.rs / mcp.rs mutated in turn; BelowNormal)', tree: T });
const M = [
  ['R1 the address row removed', 'src/main.rs', '    AddressRow { from_seat: "third_place", verb: "call_librarian", to: LIBRARIAN_SID },\n', ''],
  ['R2 a row INTO the Third Place', 'src/main.rs', '    AddressRow { from_seat: "third_place", verb: "call_librarian", to: LIBRARIAN_SID },\n', '    AddressRow { from_seat: "third_place", verb: "call_librarian", to: LIBRARIAN_SID },\n    AddressRow { from_seat: "librarian", verb: "visit", to: THIRD_PLACE_SID },\n'],
  ['T1 the Third Place server keeps every verb', 'src/mcp.rs', '        if identity.as_deref() == Some(THIRD_PLACE_MOUNT) {\n            for name in', '        if false {\n            for name in'],
  ['S1 the mount resolves to its letter\'s seat', 'src/mcp.rs', '            Some(m) if m == THIRD_PLACE_MOUNT => "third_place".to_string(),\n', ''],
  ['P1 an approved pull may enter the Third Place', 'src/main.rs', '    role == "committee" || role == "main"\n', '    role == "committee" || role == "main" || role == "third_place"\n'],
  ['E1 the ring labelled as a pane', 'src/main.rs', '    let msg = format!("[third-place] {text}");', '    let msg = format!("[pane:N] {text}");'],
  ['W1 the shelf does not carry the Third Place', 'src/main.rs', '            } else if dir == "third_place" {\n                third_place_window.as_deref() == Some(label.as_str())\n', '            } else if dir == "third_place" {\n                false\n'],
  ['G3 a pointer into private/ is delivered (guard 3 off)', 'src/mcp.rs', 'if self.seat() == "third_place" && points_into_private(&text) {', 'if false && points_into_private(&text) {'],
  ['G4 the ring returns the librarian pane (uptake flows back)', 'src/main.rs', '            ring_reply("the librarian", receipt)\n        }\n        Err(e) => {\n            chair_audit(app, format!("call_librarian [third-place] -> LIB FAILED: {e}"));', '            pane_scrollback(dest.to_string())\n        }\n        Err(e) => {\n            chair_audit(app, format!("call_librarian [third-place] -> LIB FAILED: {e}"));'],
  ['F2 the Third Place refusal posts its words again (the preview restored)', 'src/mcp.rs', '                if third_place {\n                    self.digest_audit(THIRD_PLACE_DIGEST_REFUSED.to_string());', '                if third_place {\n                    self.digest_audit(refused_digest_row(&who, &text));'],
  ['F3 the git-blob row carries the Third Place path again', 'src/mcp.rs', '                    if d.audit.is_some() {\n                        self.digest_audit(THIRD_PLACE_DIGEST_NOTED.to_string());\n                    }', '                    if let Some(line) = d.audit {\n                        self.digest_audit(line);\n                    }'],
  ['A1 the address refusal on the Third Place seat posts its words (the latent row)', 'src/mcp.rs', 'text: if self.seat() == "third_place" { THIRD_PLACE_ADDRESS_REFUSED.to_string() } else { refused_address_row(&who, &text) },', 'text: if self.seat() == "third_place" { refused_address_row(&who, &text) } else { refused_address_row(&who, &text) },'],
];
const src = {}; for (const [, f] of M) src[f] = src[f] || fs.readFileSync(path.join(T, f), 'utf8');
process.on('exit', () => { for (const [f, s] of Object.entries(src)) fs.writeFileSync(path.join(T, f), s); });
let applied = 0, caught = 0, na = 0;
for (const [name, file, from, to] of M) {
  const s = src[file], crlf = s.includes('\r\n'), norm = s.replace(/\r\n/g, '\n');
  if (norm.split(from).length !== 2) { na++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++; const out = norm.replace(from, to); fs.writeFileSync(path.join(T, file), crlf ? out.replace(/\n/g, '\r\n') : out);
  try {
    const r = spawnSync('C:/Users/nname/.cargo/bin/cargo.exe', ['test', 'third_place'], { cwd: T, encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, CARGO_TERM_COLOR: 'never' } });
    const all = (r.stdout || '') + (r.stderr || ''); fs.writeFileSync(path.join(OUT, `${name.split(' ')[0]}.out`), `# ${name}\n# exit ${r.status}\n${all}`);
    const failed = [...new Set((all.match(/^test (\S+) \.\.\. FAILED$/gm) || []).map((l) => l.replace(/^test /, '').replace(/ \.\.\. FAILED$/, '')))];
    const build = /error\[E\d+\]|could not compile/.test(all);
    if (failed.length) caught++;
    console.log(`${failed.length ? 'caught      ' : 'SURVIVED    '} ${name}${failed.length ? `  (${failed.join('; ')})` : build ? '  (did not BUILD: not counted)' : ''}`);
  } finally { fs.writeFileSync(path.join(T, file), s); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);
