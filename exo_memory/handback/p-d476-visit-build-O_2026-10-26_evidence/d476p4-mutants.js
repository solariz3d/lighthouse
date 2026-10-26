'use strict';
// D476 part 4 (O): the part-2 mutants (d476-return evidence, re-run whole) and the visit mutants. Each breaks one guard; the named cargo
// filter must fail a named test. Applied to the file, run, restored (also on exit), at BelowNormal under one heavy-run slot; raw output
// beside the verdicts (mutant-out/).   node d476p4-mutants.js <src-tauri dir>
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const T = path.resolve(process.argv[2]), OUT = path.join(__dirname, 'mutant-out'); fs.mkdirSync(OUT, { recursive: true });
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'd476 O part-4 mutants (main.rs / mcp.rs mutated in turn; BelowNormal)', tree: T });
const PART2 = [
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
const V = 'keep_warm_visit';
const VISIT = [
  ['V1 the pointer rule off', 'src/main.rs', 'if tokens.iter().any(|w| is_pointer(w)) {', 'if false {', V],
  ['V2 the lap/decision id rule off', 'src/main.rs', 'if lower.contains("local-0.") || tokens.iter().any(|w| is_id(w)) {', 'if false {', V],
  ['V3 the sha rule off', 'src/main.rs', 'if tokens.iter().any(|w| is_sha(w)) {', 'if false {', V],
  ['V4 the command rule off', 'src/main.rs', '        return Some("a command");\n', '', V],
  ['V5 the uptake rule off (guard 4)', 'src/main.rs', 'if ["taken up", "turned into",', 'if false && ["taken up", "turned into",', V],
  ['V6 the private rule off (guard 3)', 'src/main.rs', '    if mcp::points_into_private(line) {\n        return Some("a path into private/");', '    if false {\n        return Some("a path into private/");', V],
  ['V7 the length cap off', 'src/main.rs', 'if line.chars().count() > VISIT_MAX_CHARS {', 'if false {', V],
  ['V8 stays here ignored (guard 3)', 'src/main.rs', '    if reply.to_lowercase().contains("stays here") {\n        return out;', '    if false {\n        return out;', V],
  ['V9 the hour answers not guarded', 'src/main.rs', 'out.retain(|_, a| !a.is_empty() && visit_line_refusal(a).is_none());', 'out.retain(|_, a| !a.is_empty());', V],
  ['V10 a name that did not visit gets an answer', 'src/main.rs', 'cur = names.iter().find(|n| n.as_str() == head).cloned();', 'cur = Some(head.to_string());', V],
  ['V11 the turn first text, not the one it ended on (guard 2)', 'src/main.rs', 'rows[start + 1..end].iter().rev().find_map(', 'rows[start + 1..end].iter().find_map(', V],
  ['V12 a subagent line read as the seat', 'src/main.rs', '        .filter(|v| v.get("isSidechain").and_then(|x| x.as_bool()) != Some(true))\n        .collect();\n    let ts = ', '        .collect();\n    let ts = ', V],
  ['V13 the seat reply not guarded in the harvest', 'src/main.rs', 'match visit_line_refusal(reply.trim()) {', 'match None::<&str> {', V],
  ['V14 every seat gets the first answer, not its own', 'src/main.rs', '"committee" | "main" | "librarian" => (visit_text(b.answers.get(pane).map(|s| s.as_str())), None),', '"committee" | "main" | "librarian" => (visit_text(b.answers.values().next().map(|s| s.as_str())), None),', V],
  ['V15 a human-driven pane visited', 'src/main.rs', '"committee" | "main" | "librarian" => (visit_text(', '"committee" | "main" | "librarian" | "human" => (visit_text(', V],
  ['V16 the refusal row carries the line', 'src/main.rs', 'format!("keep-warm visit REFUSED — from {short} ({rule}); its words are not kept")', 'format!("keep-warm visit REFUSED — from {short} ({rule}); line kept")', V],
];
const M = [...PART2.map((m) => [...m.slice(0, 4), 'third_place']), ...VISIT];
const src = {}; for (const [, f] of M) src[f] = src[f] || fs.readFileSync(path.join(T, f), 'utf8');
process.on('exit', () => { for (const [f, s] of Object.entries(src)) fs.writeFileSync(path.join(T, f), s); });
let applied = 0, caught = 0, na = 0;
for (const [name, file, from, to, filter] of M) {
  const s = src[file], crlf = s.includes('\r\n'), norm = s.replace(/\r\n/g, '\n');
  if (norm.split(from).length !== 2) { na++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++; const out = norm.replace(from, to); fs.writeFileSync(path.join(T, file), crlf ? out.replace(/\n/g, '\r\n') : out);
  try {
    const r = spawnSync('C:/Users/nname/.cargo/bin/cargo.exe', ['test', filter], { cwd: T, encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, CARGO_TERM_COLOR: 'never' } });
    const all = (r.stdout || '') + (r.stderr || ''); fs.writeFileSync(path.join(OUT, `${name.split(' ')[0]}.out`), `# ${name}\n# filter ${filter}\n# exit ${r.status}\n${all}`);
    const failed = [...new Set((all.match(/^test (\S+) \.\.\. FAILED$/gm) || []).map((l) => l.replace(/^test /, '').replace(/ \.\.\. FAILED$/, '')))];
    const build = /error\[E\d+\]|could not compile/.test(all);
    if (failed.length) caught++;
    console.log(`${failed.length ? 'caught      ' : 'SURVIVED    '} ${name}${failed.length ? `  (${failed.join('; ')})` : build ? '  (did not BUILD: not counted)' : ''}`);
  } finally { fs.writeFileSync(path.join(T, file), s); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);
