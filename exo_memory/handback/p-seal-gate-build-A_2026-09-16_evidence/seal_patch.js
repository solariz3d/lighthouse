// Insert the seal gate into consonance/src-tauri/src/mcp.rs.
//   node seal_patch.js red    -> the wiring + the section with seal_gate STUBBED to allow + the fixtures
//   node seal_patch.js green  -> swap the stubbed seal_gate for the real one (the file must be in its red state)
// Every anchor must match exactly once, or nothing is written.
'use strict';
const fs = require('fs');
const path = require('path');
const MCP = 'C:/Users/nname/Desktop/lighthouse/consonance/src-tauri/src/mcp.rs';
const S = __dirname;
const mode = process.argv[2];
const section = fs.readFileSync(path.join(S, 'seal_gate_section.rs'), 'utf8').replace(/\r\n/g, '\n');
const tests = fs.readFileSync(path.join(S, 'seal_gate_tests.rs'), 'utf8').replace(/\r\n/g, '\n');

const crlf = (s) => s.replace(/\r\n/g, '\n');
let src = fs.readFileSync(MCP, 'utf8');
const EOL = src.includes('\r\n') ? '\r\n' : '\n';
src = crlf(src);

const once = (hay, needle, label) => {
  const n = hay.split(needle).length - 1;
  if (n !== 1) throw new Error(`${label}: anchor matched ${n} times`);
};

// the seal_gate function's body, located by its signature and the first column-0 close after it
const SIG = 'fn seal_gate(\n';
function gateSpan(text) {
  once(text, SIG, 'seal_gate signature');
  const start = text.indexOf(SIG);
  const open = text.indexOf(') -> SealVerdict {\n', start) + ') -> SealVerdict {\n'.length;
  const close = text.indexOf('\n}\n', open);
  if (open < start || close < 0) throw new Error('seal_gate body not found');
  return [open, close];
}
const STUB = '    // RED-RUN STUB: every dispatch is allowed. Replaced by the real gate before green.\n' +
  '    let _ = (seal, text, repo, git);\n    SealVerdict::Allow(None)';

if (mode === 'red') {
  const pairs = [
    ['    /// the prompt to deliver (the system prefixes provenance: "[chair:MAIN] …")\n    text: String,\n}\n',
     '    /// the prompt to deliver (the system prefixes provenance: "[chair:MAIN] …")\n    text: String,\n' +
     '    /// P-SEAL-GATE: for a task that has an ANSWER KEY, its sealed row as "exo_memory/loop/<row>.md#<task>" —\n' +
     '    /// checked on origin before anything renders. "none: <reason>" when a dispatch names a sealed task\'s path but\n' +
     '    /// is not that task; the reason is posted. Omit for every ordinary dispatch.\n' +
     '    #[serde(default)]\n    seal: Option<String>,\n}\n'],
    ['        Parameters(ChairInjectArgs { token, target, text }): Parameters<ChairInjectArgs>,\n',
     '        Parameters(ChairInjectArgs { token, target, text, seal }): Parameters<ChairInjectArgs>,\n'],
    ['        if let Some(msg) = self.owed_handback_refusal() {\n            return Ok(CallToolResult::success(vec![Content::text(msg)]));\n        }\n',
     '        if let Some(msg) = self.owed_handback_refusal() {\n            return Ok(CallToolResult::success(vec![Content::text(msg)]));\n        }\n' +
     '        // THE SEAL GATE (P-SEAL-GATE, D068). After the station and debt gates and narrower than both, on the debt\n' +
     '        // gate\'s own precedent: it fires only on a dispatch that declares a key or names a sealed task\'s path. Off\n' +
     '        // the async thread, because a declared seal fetches from origin. See `seal_gate`.\n' +
     '        let (seal_decl, seal_text, seal_repo) = (seal.clone(), text.clone(), crate::repo_root());\n' +
     '        let verdict = tokio::task::spawn_blocking(move || seal_gate_at(seal_decl.as_deref(), &seal_text, seal_repo.as_deref()))\n' +
     '            .await\n' +
     '            .unwrap_or_else(|e| {\n' +
     '                SealVerdict::Refuse(format!(\n' +
     '                    "refused: THE SEAL GATE COULD NOT RUN ({e}) — the dispatch was not sent. This is NOT a turn problem. Recovery: re-send; if it repeats, the gate itself is broken."\n' +
     '                ))\n' +
     '            });\n' +
     '        match verdict {\n' +
     '            SealVerdict::Refuse(msg) => {\n' +
     '                self.seal_audit(format!("chair_inject -> {target} REFUSED BY THE SEAL GATE: {}", msg.lines().next().unwrap_or("")));\n' +
     '                return Ok(CallToolResult::success(vec![Content::text(msg)]));\n' +
     '            }\n' +
     '            SealVerdict::Allow(Some(line)) => self.seal_audit(format!("chair_inject -> {target}: {line}")),\n' +
     '            SealVerdict::Allow(None) => {}\n' +
     '        }\n'],
    ['    fn owed_handback_refusal(&self) -> Option<String> {\n        let st = crate::chain_state();\n        owed_refusal_text(st.at, &marks(), st.lap.as_deref().unwrap_or("<lap>"))\n    }\n',
     '    fn owed_handback_refusal(&self) -> Option<String> {\n        let st = crate::chain_state();\n        owed_refusal_text(st.at, &marks(), st.lap.as_deref().unwrap_or("<lap>"))\n    }\n\n' +
     '    /// The seal gate\'s board line: refusals AND verified seals, because a trail that carries only refusals cannot\n' +
     '    /// say which keyed dispatches the gate let through, or on what evidence.\n' +
     '    fn seal_audit(&self, text: String) {\n' +
     '        board_push(&self.board, BoardEntry {\n            pane: "chair".to_string(),\n            role: "committee".to_string(),\n' +
     '            text,\n            ts: now_ms(),\n            ts_source: crate::TsSource::Push,\n        });\n    }\n'],
  ];
  for (const [a, b] of pairs) once(src, a, a.slice(0, 60));
  for (const [a, b] of pairs) src = src.replace(a, () => b);
  const [o, c] = gateSpan(section);
  const stubbed = section.slice(0, o) + STUB + section.slice(c);
  src = src.replace(/\n*$/, '\n') + stubbed + tests;
  fs.writeFileSync(MCP, src.replace(/\n/g, EOL));
  console.log('red: wiring + stubbed gate + fixtures inserted');
} else if (mode === 'green') {
  once(src, STUB, 'the red stub');
  const [so, sc] = gateSpan(src);
  const [o, c] = gateSpan(section);
  src = src.slice(0, so) + section.slice(o, c) + src.slice(sc);
  fs.writeFileSync(MCP, src.replace(/\n/g, EOL));
  console.log('green: the real seal_gate body is in');
} else {
  throw new Error('usage: node seal_patch.js red|green');
}
