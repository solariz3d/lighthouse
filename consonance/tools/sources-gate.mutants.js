#!/usr/bin/env node
'use strict';
// sources-gate.mutants.js - run with: node consonance/tools/sources-gate.mutants.js [--only <n>]     (D212; holds the heavy-run lock itself)
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. This breaks the SOURCES gate one guard at a time and requires sources-gate.test.js to go RED
// for each. On a hook that can DENY a hand-back a surviving mutant is a ring refused that should pass, a ring passed that should be refused, a deny whose
// pointer was never recorded (a lost hand-back), or a key or message written to the ledger.
//
// (Lives in consonance/tools, not consonance/hooks: install.ps1 audits every non-test file in a manifest directory, and a mutants harness is not a hook.)
// THE TRACKED SOURCES ARE NEVER WRITTEN. A temp tree mirrors what the suite reads (the hook, the second reader and its worker, install.ps1, the plan); the
// copy is mutated, the copy's suite runs, the tree is removed. Every anchor must occur EXACTLY ONCE or the row is NOT APPLIED (counted as such, never as a
// catch). No model is ever called and no real transcript is read.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = path.join(__dirname, '..', 'hooks'), REPO = path.join(__dirname, '..', '..');
const HOOK = 'sources-gate.js', SUITE = 'sources-gate.test.js', SIBLINGS = ['second-reader.js', 'second-reader-worker.js'];
const PLAN = path.join('exo_memory', 'loop', 'plan_sources_gate_d212_2026-10-02.md'), INSTALL = path.join('dev', 'shell', 'install.ps1');

const MUTANTS = [
  // ---- guards: dream, reentrancy, which tools, which input ----
  ['guard: the dream gate removed', HOOK, 'if (process.env.CONSONANCE_DREAM) process.exit(0);', ''],
  ['guard: the reentrancy guard removed', HOOK, "if (process.env[RUN_ENV] === '1') return process.exit(0);", 'if (false) return process.exit(0);'],
  ['guard: a tool that is not a ring tool is gated', HOOK, 'if (!RING_TOOLS.has(tool)) return process.exit(0);', 'if (false) return process.exit(0);'],
  // ---- the decision ----
  ['decide: a missing SOURCES line is allowed', HOOK, "if (!s.present) return { decision: 'deny',", "if (!s.present) return { decision: 'allow',"],
  ['decide: an empty SOURCES line is allowed', HOOK, "if (!s.items.length) return { decision: 'deny',", "if (!s.items.length) return { decision: 'allow',"],
  ['decide: "none" is denied', HOOK, "if (s.none) return { decision: 'allow'", "if (s.none) return { decision: 'deny'"],
  ['decide: an unmatched item is allowed', HOOK, "if (!unmatched.length) return { decision: 'allow'", "if (true) return { decision: 'allow'"],
  ['decide: the reason names ALL items, matched or not', HOOK, '${unmatched.map((u) =>', '${s.items.map((u) =>'],
  // ---- the turn ----
  ['turn: calls of a PREVIOUS turn count (no boundary)', HOOK, '{ from = i + 1; break; }', '{ break; }'],
  ["turn: a tool result counts as a prompt (the turn is cut at every call)", HOOK, "|| e.isMeta || hasToolResult(m)) return false;", "|| e.isMeta) return false;"],
  ["turn: a meta user message starts a new turn", HOOK, "|| e.isMeta || hasToolResult(m)) return false;", "|| hasToolResult(m)) return false;"],
  ['turn: subagent (sidechain) entries count', HOOK, 'const live = entries.filter((e) => e && !e.isSidechain);', 'const live = entries.filter((e) => e);'],
  ['turn: an errored call counts as opened', HOOK, 'return calls.filter((c) => c.done && !c.isError);', 'return calls.filter((c) => c.done);'],
  ['turn: a call with no recorded result counts as opened', HOOK, 'return calls.filter((c) => c.done && !c.isError);', 'return calls.filter((c) => !c.isError);'],
  ['transcript: the tail does not grow past the first window', HOOK, 'if (hasBoundary || start === 0 || want >= TAIL_MAX) return out;', 'return out;'],
  ['transcript: a transcript that cannot be parsed is read as an empty turn (denies)', HOOK, "if (!out.length && text.trim()) throw new Error('unparseable');", ''],
  ['transcript: a missing transcript is read as an empty turn (denies)', HOOK, "if (!transcriptPath || !fs.existsSync(transcriptPath)) throw new Error('no-transcript');", "if (!transcriptPath || !fs.existsSync(transcriptPath)) return [];"],
  // ---- D214: the notification boundary ----
  ["notification: a machine-only notification IS a boundary again (the branch removed)", HOOK, "return !!t.trim() && !isNotificationOnly(e, t);", "return !!t.trim();"],
  ["notification: a message MIXING a notification with keeper text is read as machine-only", HOOK, "return rest.trim() === '';", "return true;"],
  ["notification: a message recorded as typed by a human can be machine-only", HOOK, "if (e && e.origin && e.origin.kind === 'human') return false;", ""],
  ["notification: no marker is required (a bare reminder counts as a notification)", HOOK, "if (!marked) return false;", ""],
  ["notification: the origin.kind task-notification marker is ignored", HOOK, " || !!(e && e.origin && e.origin.kind === 'task-notification')", ""],
  ["notification: the <task-notification text marker is ignored", HOOK, "/<task-notification|\\[SYSTEM NOTIFICATION/.test(text)", "/\\[SYSTEM NOTIFICATION/.test(text)"],
  ["notification: the [SYSTEM NOTIFICATION text marker is ignored", HOOK, "/<task-notification|\\[SYSTEM NOTIFICATION/.test(text)", "/<task-notification/.test(text)"],
  ["notification: <system-reminder> blocks are not taken out before the test", HOOK, "/<system-reminder>[\\s\\S]*?<\\/system-reminder>/g, ", ""],
  ["notification: hook-output blocks are not taken out before the test", HOOK, "/<([a-z-]*hook[a-z-]*)>[\\s\\S]*?<\\/\\1>/gi, ", ""],
  ["notification: <task-notification> blocks are not taken out before the test", HOOK, "/<task-notification>[\\s\\S]*?<\\/task-notification>/g, ", ""],
  ["notification: the [SYSTEM NOTIFICATION ...] banner is not taken out before the test", HOOK, ", /\\[SYSTEM NOTIFICATION[^\\]]*\\]/g]", "]"],
  ["notification: the backward read stops at ANY entry, not at a real prompt", HOOK, "const hasBoundary = out.some(isPrompt);", "const hasBoundary = out.some(Boolean);"],
  // ---- matching ----
  ["match: an echo / printf / Write-Host counts as opened", HOOK, "const PRINTERS = ['echo', 'printf', 'write-host', 'write-output', 'write-verbose', 'write-warning', 'write-error', 'write-information', 'true', ':'];", "const PRINTERS = [];"],
  ["match: NO metadata-only leader is excluded (ls, stat ... count as opened)", HOOK, "const METADATA = ['ls', 'll', 'la', 'dir', 'stat', 'test', '[', '[[', 'file', 'du', 'tree', 'get-item', 'get-childitem', 'gci', 'test-path', 'resolve-path'];", "const METADATA = [];"],
  ["match: `ls` counts as opened", HOOK, "'ls', ", ""],
  ["match: `stat` counts as opened", HOOK, "'stat', ", ""],
  ["match: `test` counts as opened", HOOK, "'test', ", ""],
  ["match: `[` counts as opened", HOOK, "'[', ", ""],
  ["match: `Get-Item` counts as opened", HOOK, "'get-item', ", ""],
  ["match: `Test-Path` counts as opened", HOOK, "'test-path', ", ""],
  ["match: the PowerShell dir/gci aliases count as opened", HOOK, "'get-childitem', 'gci', ", "'get-childitem', "],
  ["reason: the same-message race is not named", HOOK, "; NOR does a call made in the SAME message as this ${what}, because it had not finished yet: send the ring in a LATER message, after its sources have returned", ""],
  ["reason: the read-back after a write is not named", HOOK, "; and a file you only WROTE this turn needs a read-back, Read or cat, in an earlier message", ""],
  ["reason: the metadata-only exclusion is not named", HOOK, "a metadata-only command such as ls or stat, ", ""],
  ["reason: the spelling guidance is dropped", HOOK, " (a /c/ spelling still matches here, but the running digest gate has refused it)", ""],
  ['match: a comment line counts as opened', HOOK, "if (lead === '#' || NON_OPENING.has(lead)) continue;", 'if (NON_OPENING.has(lead)) continue;'],
  ['match: a command is not split into segments (an echo hides a real read)', HOOK, 'split(/&&|\\|\\||;|\\||\\r?\\n/)', 'split(/\\r?\\n/)'],
  ['match: a Bash command matches only the whole item, never a shorter tail', HOOK, 'for (const t of tails(itemN)) if (t && sn.includes(t)) return true;', 'if (sn.includes(itemN)) return true;'],
  ['match: a relative item no longer matches an absolute Read path by its tail', HOOK, " || (!itemAbs && p.endsWith('/' + itemN.replace(/^\\.\\//, '')))) return 'read';", ") return 'read';"],
  ['match: a Read of the exact path no longer counts', HOOK, "if (p === itemN || (!itemAbs", "if (false || (!itemAbs"],
  ['match: a relative call path is not resolved against cwd', HOOK, 'return cwd ? norm(cwd) +', 'return false ? norm(cwd) +'],
  ['match: a Grep over a directory counts whether or not its result names the item', HOOK, "&& itemN.startsWith(base + '/') && mentions(c)) return c.name", "&& itemN.startsWith(base + '/')) return c.name"],
  ['match: a WebFetch of any URL counts', HOOK, "if (u === itemN || u.replace(/^https?:\\/\\//, '') === itemN.replace(/^https?:\\/\\//, '')) return 'webfetch';", "return 'webfetch';"],
  // ---- the slot's syntax ----
  ['parse: continuation lines are not read', HOOK, "rest += ' · ' + lines[j].replace(/^\\s*[-*•]\\s*/, '');", ''],
  ['parse: the NEXT trailer does not end the slot', HOOK, "if (!lines[j].trim() || /^\\s*NEXT\\s*:/.test(lines[j])) break;", 'if (!lines[j].trim()) break;'],
  ['parse: a dot inside backticks splits an item', HOOK, "if (ch === '·' && !inTick) { push(); continue; }", "if (ch === '·') { push(); continue; }"],
  ['parse: a trailing (annotation) is kept', HOOK, "s = s.replace(/\\s*\\([^)]*\\)\\s*$/, '').trim();", ''],
  ['parse: a #L10 suffix is kept', HOOK, ".replace(/#L\\d+(?:-L?\\d+)?$/, '')", ''],
  ['parse: a path:line suffix is kept', HOOK, ".replace(/(?<![\\\\/:]|^[A-Za-z]):\\d+(?:-\\d+)?$/, '')", ''],
  ['parse: markdown emphasis around SOURCES: is not tolerated', HOOK, 'm = lines[i].match(/^\\s*[*_>\\-\\s]*SOURCES[*_]*\\s*:[*_]*\\s*(.*)$/);', 'm = lines[i].match(/^\\s*SOURCES\\s*:\\s*(.*)$/);'],
  // ---- never lose a hand-back; the contract's shape ----
  ['loss: a deny is emitted even when its ledger row could not be written', HOOK, 'if (!ok) return process.exit(0);', ''],
  ['contract: the decision is "allow", not "deny"', HOOK, "permissionDecision: 'deny', permissionDecisionReason: reason } }), () => process.exit(0));", "permissionDecision: 'allow', permissionDecisionReason: reason } }), () => process.exit(0));"],
  ['contract: a deny exits 2', HOOK, "permissionDecisionReason: reason } }), () => process.exit(0));", "permissionDecisionReason: reason } }), () => process.exit(2));"],
  // ---- the ledger: no message, no key ----
  ['ledger: the message text is written into the row', HOOK, 'const base = { seat, tool, ringSha, sessionId', 'const base = { seat, tool, ringSha, text, sessionId'],
  ["ledger: the pointer line is not scrubbed (a key shape)", HOOK, "pointer: clip(scrub(R(first.trim())), 400)", "pointer: clip(R(first.trim()), 400)"],
  ["ledger: the unmatched items are not scrubbed (a key shape)", HOOK, "unmatched: d.unmatched.slice(0, 12).map((x) => clip(scrub(R(x)), 200))", "unmatched: d.unmatched.slice(0, 12).map((x) => clip(R(x), 200))"],
  ["ledger: the allowed items are not scrubbed (a key shape)", HOOK, "items: d.items.slice(0, 12).map((x) => clip(scrub(R(x)), 200))", "items: d.items.slice(0, 12).map((x) => clip(R(x), 200))"],
  ['ledger: the sk-or- shape is not scrubbed', HOOK, '  /\\bsk-or-[A-Za-z0-9_-]{16,}/g,\n', ''],
  // ---- D215: dispatches (chair_inject) and the token ----
  ['dispatch: chair_inject is not in the gate\'s tool set', HOOK, "mcp__consonance__call_chair', DISPATCH_TOOL]);", "mcp__consonance__call_chair']);"],
  ['dispatch: the reason says "ring" for a dispatch', HOOK, "const what = tool === DISPATCH_TOOL ? 'dispatch' : 'ring';", "const what = 'ring';"],
  ['dispatch: the target is not logged', HOOK, "...(tool === DISPATCH_TOOL ? { target:", "...(false ? { target:"],
  ['token: the ring sha is taken over the whole tool_input (the token goes into the hash)', HOOK, "const ringSha = crypto.createHash('sha256').update(text).digest('hex');", "const ringSha = crypto.createHash('sha256').update(text + JSON.stringify(payload.tool_input)).digest('hex');"],
  ['token: redaction is switched off', HOOK, "return typeof token === 'string' && token.length >= 4 ? m.split(token).join('<redacted-token>') : m; }", "return m; }"],
  ['token: redaction applies to a one-character token (ordinary text is eaten)', HOOK, "token.length >= 4 ?", "token.length >= 1 ?"],
  ['token: the pointer line is not redacted', HOOK, "pointer: clip(scrub(R(first.trim())), 400)", "pointer: clip(scrub(first.trim()), 400)"],
  ['token: the unmatched items are not redacted', HOOK, "unmatched: d.unmatched.slice(0, 12).map((x) => clip(scrub(R(x)), 200))", "unmatched: d.unmatched.slice(0, 12).map((x) => clip(scrub(x), 200))"],
  ['token: the allowed items are not redacted', HOOK, "items: d.items.slice(0, 12).map((x) => clip(scrub(R(x)), 200))", "items: d.items.slice(0, 12).map((x) => clip(scrub(x), 200))"],
  ['token: the deny reason is not redacted', HOOK, "return emitDeny(R(d.reason));", "return emitDeny(d.reason);"],
  ['token: the token itself is written into the row', HOOK, "const base = { seat, tool, ringSha,", "const base = { token, seat, tool, ringSha,"],
  ['token: the target is not redacted', HOOK, "clip(scrub(R(String((payload.tool_input && payload.tool_input.target) || ''))), 20)", "clip(scrub(String((payload.tool_input && payload.tool_input.target) || '')), 20)"],
  // ---- registration ----
  ['install: the gate no longer covers chair_inject', INSTALL, "|mcp__consonance__call_chair|mcp__consonance__chair_inject' }", "|mcp__consonance__call_chair' }"],
  ['install: the SECOND READER\'s matcher also gains chair_inject', INSTALL, "Rel = 'hooks\\second-reader.js';      Runner = 'node';\n     Matcher = 'mcp__consonance__call_librarian|mcp__consonance__call_chair' }", "Rel = 'hooks\\second-reader.js';      Runner = 'node';\n     Matcher = 'mcp__consonance__call_librarian|mcp__consonance__call_chair|mcp__consonance__chair_inject' }"],
  ["install: the gate registers on every tool (no matcher scope)", INSTALL, "Rel = 'hooks\\sources-gate.js';       Runner = 'node';\n     Matcher = 'mcp__consonance__call_librarian|mcp__consonance__call_chair|mcp__consonance__chair_inject' }", "Rel = 'hooks\\sources-gate.js';       Runner = 'node';\n     Matcher = 'mcp__consonance__.*' }"],
];

function tree() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sg-mut-'));
  fs.mkdirSync(path.join(dir, 'consonance', 'hooks'), { recursive: true });
  for (const f of [HOOK, SUITE, ...SIBLINGS]) fs.copyFileSync(path.join(HERE, f), path.join(dir, 'consonance', 'hooks', f));
  fs.mkdirSync(path.join(dir, 'dev', 'shell'), { recursive: true }); fs.copyFileSync(path.join(REPO, INSTALL), path.join(dir, INSTALL));
  fs.mkdirSync(path.dirname(path.join(dir, PLAN)), { recursive: true }); fs.copyFileSync(path.join(REPO, PLAN), path.join(dir, PLAN));
  return dir;
}
function run(dir) {
  const env = { ...process.env }; for (const k of Object.keys(env)) if (/^CONSONANCE_/.test(k)) delete env[k];
  const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-concurrency=1', path.join(dir, 'consonance', 'hooks', SUITE)], { encoding: 'utf8', env, timeout: 15 * 60 * 1000 });
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
  return { pass: n('pass'), fail: n('fail') };
}

function main() {
  require(path.join(REPO, 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'sources-gate.mutants' });   // ONE HEAVY RUNNER PER TREE
  const onlyAt = process.argv.indexOf('--only'), only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const read = (f) => (f === INSTALL ? fs.readFileSync(path.join(REPO, f), 'utf8') : fs.readFileSync(path.join(HERE, f), 'utf8')).replace(/\r\n/g, '\n');
  const control = (() => { const d = tree(); try { return run(d); } finally { fs.rmSync(d, { recursive: true, force: true }); } })();
  console.log(`control (unmutated copy)                              pass ${control.pass} fail ${control.fail}`);
  if (!(control.fail === 0 && control.pass > 0)) { console.log('CONTROL NOT GREEN - no mutant result means anything'); process.exitCode = 1; return; }
  let applied = 0, caught = 0, notApplied = 0;
  MUTANTS.forEach(([name, file, anchor, repl], i) => {
    if (only != null && only !== i + 1) return;
    const src = read(file), hits = src.split(anchor).length - 1, label = `${String(i + 1).padStart(2)} ${name}`.padEnd(88);
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
