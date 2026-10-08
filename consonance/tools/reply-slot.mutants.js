#!/usr/bin/env node
'use strict';
// reply-slot.mutants.js - run with: node consonance/tools/reply-slot.mutants.js [--only <n>]     (D218; holds the heavy-run lock itself)
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. This breaks the reply slot one guard at a time and requires reply-slot.test.js to go RED for each. On a Stop
// hook that is built to BLOCK one day, a surviving mutant is a seat blocked that should not be (a pane, a keep-warm, a reply with no claim), a loop the guard should have
// stopped, a block printed while the slot is still in shadow, or reply text or a key written to the ledger.
//
// (Lives in consonance/tools, not consonance/hooks: install.ps1 audits every non-test file in a manifest directory, and a mutants harness is not a hook.)
// THE TRACKED SOURCES ARE NEVER WRITTEN. A temp tree mirrors what the suite reads (the hook, the sources-gate it requires, install.ps1, main.rs, the plan); the copy is mutated,
// the copy's suite runs, the tree is removed. Every anchor must occur EXACTLY ONCE or the row is NOT APPLIED (counted as such, never as a catch). No model is ever called.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = path.join(__dirname, '..', 'hooks'), REPO = path.join(__dirname, '..', '..');
const HOOK = 'reply-slot.js', SUITE = 'reply-slot.test.js', SIBLINGS = ['sources-gate.js'];
const PLAN = path.join('exo_memory', 'loop', 'plan_finish_retrieval_2026-10-03.md'), INSTALL = path.join('dev', 'shell', 'install.ps1'), MAIN_RS = path.join('consonance', 'src-tauri', 'src', 'main.rs');

const dropKind = (k) => ['tokens: the ' + k + ' kind is not detected', HOOK, 'for (const [kind, re] of TOKEN_KINDS) {', "for (const [kind, re] of TOKEN_KINDS.filter((k) => k[0] !== '" + k + "')) {"];
const MUTANTS = [
  // ---- guards: dream, shadow, the loop guard ----
  ['guard: the dream gate removed', HOOK, 'if (process.env.CONSONANCE_DREAM) process.exit(0);', ''],
  ['live: the SHADOW constant is true (the slot is back in shadow)', HOOK, 'const SHADOW = false;', 'const SHADOW = true;'],
  ['live: a would-block produces its block output even when live is false', HOOK, 'if (live && r.wouldBlock) {', 'if (r.wouldBlock) {'],
  ['loop guard: stop_hook_active is ignored in the verdict', HOOK, "if (stopHookActive) { r.kind = 'skip-active'; return r; }", 'if (false) { r.kind = "skip-active"; return r; }'],
  ['loop guard: the transcript is read even when stop_hook_active is true', HOOK, 'entries = payload.stop_hook_active ? [] : G.readTurnEntries(payload.transcript_path);', 'entries = G.readTurnEntries(payload.transcript_path);'],
  ['live: the block is never built', HOOK, 'if (live && r.wouldBlock) {', 'if (false) {'],
  ['live: the decision is not "block"', HOOK, "r.output = { decision: 'block',", "r.output = { decision: 'approve',"],
  ["live: the block is emitted even when the ledger row was not written (no data dir, unwritable ledger)", HOOK, "if (v.output && logged) {", "if (v.output) {"],
  ["live: log() reports success when it wrote nothing", HOOK, "(dir ? record(dir, { v: 1, shadow: SHADOW, seat, session: sid, ...row }) : false);   // true only", "(dir ? record(dir, { v: 1, shadow: SHADOW, seat, session: sid, ...row }) : true);   // true only"],
  ["live: the block reason does not name the tokens", HOOK, "this reply names ' + shown + ' and '", "this reply names ' + '' + ' and '"],
  ["live: the block reason has no way out without a source", HOOK, "(2) drop the claim from the reply, or end with `Sources: none` if it states nothing checkable.", ""],
  ["live: the block reason does not say it blocks once", HOOK, " This hook blocks once per turn: your next reply ends the turn.", ""],
  ["live: the block reason does not say to open the source first", HOOK, "(1) OPEN the source first", "(1) Write the source"],
  ["live: the token list in the reason is not capped", HOOK, "r.tokens.slice(0, 6).map(", "r.tokens.slice(0, 60).map("],
  ["live: the row does not say it blocked", HOOK, "blocked: !!v.output, replySha, replyChars", "blocked: false, replySha, replyChars"],
  // ---- who ----
  ['who: no seat gate (every session is evaluated)', HOOK, 'if (!seat) return process.exit(0);', ''],
  ['who: the chair\'s pane id is not recognised', HOOK, "if (pane === SEAT_IDS.MAIN) return 'chair';", ''],
  ['who: the librarian\'s pane id is not recognised', HOOK, "if (pane === SEAT_IDS.LIBRARIAN) return 'librarian';", ''],
  ['who: a committee pane id falls through to the cwd rule', HOOK, "    return null;   // a pane id that is not one of the two fixed ones is a committee pane: ignored, whatever its cwd\n", ''],
  ['who: the cwd rule accepts a subdirectory', HOOK, 'const m = c.match(/\\/instances\\/(main|librarian)$/);', 'const m = c.match(/\\/instances\\/(main|librarian)/);'],
  ['who: the chair\'s fixed id is wrong', HOOK, "'MAIN': '0c0c0c0a-0000-4000-8000-000000000a01'", "'MAIN': '0c0c0c0a-0000-4000-8000-000000000a02'"],
  // ---- the tokens ----
  dropKind('path'), dropKind('sha'), dropKind('commit'), dropKind('count'), dropKind('percentage'), dropKind('version'),
  ['tokens: no cap at 12', HOOK, 'if (out.length >= 12) return out;', ''],
  ['tokens: no de-duplication', HOOK, 'if (seen.has(key)) continue; seen.add(key);', ''],
  ['tokens: a flagged token is not redacted', HOOK, "clip(G ? G.scrub(trimmed) : '<unscrubbed>', 80)", 'clip(trimmed, 80)'],
  ['tokens: a sentence-final full stop stays in the token', HOOK, "const trimmed = m[0].replace(/[.,;:!?)\\]'\"]+$/, '');", 'const trimmed = m[0];'],
  // ---- which turns ----
  ['turn: the bare "ok" reply is evaluated', HOOK, "if (/^\\s*ok[.!]?\\s*$/i.test(text) || !text.trim()) {", 'if (false) {'],
  ['turn: a keep-warm prompt is not recognised', HOOK, "if (KEEPWARM.test(t)) return 'keepwarm';", ''],
  ['turn: a chair or pane ring is read as the keeper', HOOK, "if (RING.test(t)) return 'ring';", ''],
  ['turn: a slash command or machine form is read as the keeper', HOOK, "if (MACHINE.test(t)) return 'machine';", ''],
  ['turn: a turn a notification started while idle is read as the keeper', HOOK, "if (startedByNotification(live, i + 1)) return 'machine';", ''],
  ['turn: a notification that arrives mid-work (after a tool call) is read as starting the turn', HOOK, "&& !(Array.isArray(prev.message.content) && prev.message.content.some((p) => p && p.type === 'tool_use'))) return true;", ') return true;'],
  ['turn: every turn is evaluated, whoever prompted it', HOOK, "if (pk !== 'keeper') {", 'if (false) {'],
  // ---- D218 scope fix: a pane ring's reply is keeper-facing in the LIBRARIAN session only ----
  ["pane ring: a [pane: ring is not told apart from the other rings", HOOK, "    if (PANE_RING.test(t)) return 'pane-ring';\n", ""],
  ["pane ring: it is never evaluated, even in the librarian session", HOOK, "if (pk === 'pane-ring') pk = seat === 'librarian' ? 'keeper' : 'ring';", "if (pk === 'pane-ring') pk = 'ring';"],
  ["pane ring: it is evaluated in EVERY session, the chair's too", HOOK, "if (pk === 'pane-ring') pk = seat === 'librarian' ? 'keeper' : 'ring';", "if (pk === 'pane-ring') pk = 'keeper';"],
  ["pane ring: it is evaluated when no seat is named", HOOK, "pk = seat === 'librarian' ? 'keeper' : 'ring';", "pk = seat !== 'chair' ? 'keeper' : 'ring';"],
  ["pane ring: main does not pass the seat to the verdict", HOOK, "live: !SHADOW, seat });", "live: !SHADOW });"],
  ["pane ring: a CHAIR ring is also read as a pane ring (so it is evaluated in the librarian session)", HOOK, "const PANE_RING = /^\\s*\\[pane:/i;", "const PANE_RING = /^\\s*\\[(pane|chair):/i;"],
  ["pane ring: the keep-warm check no longer precedes the pane-ring mapping", HOOK, "  if (pk === 'keepwarm') { r.kind = 'skip-keepwarm'; return r; }\n  // D218 scope fix", "  // D218 scope fix"],
  ["pane ring: the row does not say what the prompt was", HOOK, "log({ kind: v.kind, prompt: v.prompt, wouldBlock:", "log({ kind: v.kind, wouldBlock:"],
  // ---- the slot ----
  ['slot: the Sources line need not be the FINAL block (it is found across a blank line)', HOOK, 'for (let i = last; i >= 0 && lines[i].trim(); i--)', 'for (let i = last; i >= 0; i--)'],
  ['slot: "sources:" is case-sensitive', HOOK, 'if (/^\\s*[*_>\\-\\s]*sources[*_]*\\s*:/i.test(lines[i]))', 'if (/^\\s*[*_>\\-\\s]*sources[*_]*\\s*:/.test(lines[i]))'],
  ['slot: the head is not normalised to the form the gate reads', HOOK, ".replace(/^\\s*[*_>\\-\\s]*sources([*_]*\\s*:)/i, 'SOURCES$1')", ''],
  ['verdict: "Sources: none" is not recognised', HOOK, "else if (slot.none) r.kind = 'pass-none';", ''],
  ['verdict: an empty Sources line is not recognised', HOOK, "else if (!slot.items.length) r.kind = 'would-block-empty';", ''],
  ['verdict: an unmatched item still passes', HOOK, "r.kind = r.unmatched.length ? 'would-block-unmatched' : 'pass-matched';", "r.kind = 'pass-matched';"],
  ['verdict: wouldBlock is never set', HOOK, "r.wouldBlock = r.kind.startsWith('would-block');", 'r.wouldBlock = false;'],
  // ---- the ledger ----
  ['ledger: the reply text is written into the row', HOOK, "log({ kind: v.kind, prompt: v.prompt, wouldBlock: v.wouldBlock, blocked: !!v.output, replySha,", "log({ text: reply, kind: v.kind, prompt: v.prompt, wouldBlock: v.wouldBlock, blocked: !!v.output, replySha,"],
  ['ledger: an unmatched item is not redacted', HOOK, 'unmatched: v.unmatched.slice(0, 12).map((x) => clip(G.scrub(x), 200))', 'unmatched: v.unmatched.slice(0, 12).map((x) => clip(x, 200))'],
  // ---- fail open ----
  ['fail-open: a missing last_assistant_message is not logged', HOOK, "if (reply === null) {", 'if (false) {'],
  ['fail-open: a missing sources-gate is not handled', HOOK, 'if (!G) {', 'if (false) {'],
  // ---- registration ----
  ['install: the reply slot registers on Stop with a matcher', INSTALL, "@{ Event = 'Stop';             Rel = 'hooks\\reply-slot.js';        Runner = 'node' }", "@{ Event = 'Stop';             Rel = 'hooks\\reply-slot.js';        Runner = 'node'; Matcher = 'x' }"],
  ['install: sources-gate.js installs to a different directory than reply-slot.js', INSTALL, "To = 'hooks\\sources-gate.js' }", "To = 'sources-gate.js' }"],
];

function tree() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-mut-'));
  fs.mkdirSync(path.join(dir, 'consonance', 'hooks'), { recursive: true });
  for (const f of [HOOK, SUITE, ...SIBLINGS]) fs.copyFileSync(path.join(HERE, f), path.join(dir, 'consonance', 'hooks', f));
  for (const rel of [INSTALL, MAIN_RS, PLAN]) { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.copyFileSync(path.join(REPO, rel), path.join(dir, rel)); }
  return dir;
}
function run(dir) {
  const env = { ...process.env }; for (const k of Object.keys(env)) if (/^CONSONANCE_/.test(k)) delete env[k];
  const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-concurrency=1', path.join(dir, 'consonance', 'hooks', SUITE)], { encoding: 'utf8', env, timeout: 15 * 60 * 1000 });
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
  return { pass: n('pass'), fail: n('fail') };
}

function main() {
  require('./heavy-run.js').hold({ cmd: 'reply-slot.mutants' });   // ONE HEAVY RUNNER PER TREE
  const onlyAt = process.argv.indexOf('--only'), only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const read = (f) => (f === INSTALL ? fs.readFileSync(path.join(REPO, f), 'utf8') : fs.readFileSync(path.join(HERE, f), 'utf8')).replace(/\r\n/g, '\n');
  const control = (() => { const d = tree(); try { return run(d); } finally { fs.rmSync(d, { recursive: true, force: true }); } })();
  console.log(`control (unmutated copy)                              pass ${control.pass} fail ${control.fail}`);
  if (!(control.fail === 0 && control.pass > 0)) { console.log('CONTROL NOT GREEN - no mutant result means anything'); process.exitCode = 1; return; }
  let applied = 0, caught = 0, notApplied = 0;
  MUTANTS.forEach(([name, file, anchor, repl], i) => {
    if (only != null && only !== i + 1) return;
    const src = read(file), hits = src.split(anchor).length - 1, label = `${String(i + 1).padStart(2)} ${name}`.padEnd(96);
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    applied++;
    const d = tree();
    try {
      const target = file === INSTALL ? path.join(d, INSTALL) : path.join(d, 'consonance', 'hooks', file);
      fs.writeFileSync(target, src.replace(anchor, () => repl));
      const r = run(d), ok = r.fail > 0; if (ok) caught++;
      console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? 'CAUGHT' : 'SURVIVED'}`);
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  });
  console.log(`\n${applied} applied · ${caught} caught · ${applied - caught} survived · ${notApplied} NOT APPLIED`);
  if (applied - caught > 0 || notApplied > 0) process.exitCode = 1;
}

main();
