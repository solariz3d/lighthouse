#!/usr/bin/env node
'use strict';
// lapw-hooks.mutants.js - run with: node consonance/tools/lapw-hooks.mutants.js [--only <n>]     (Lap W, pane H; holds the heavy-run lock itself)
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. Lap W's hooks are "prove it" (a system's own delivery and gates; a wrong line is
// invisible until a wake goes unread or a push leaves): the body line (W3, sessionstart-body.js), the wake gate (W4, wake-gate.js) and the push
// gate's 10 MB rule (ruling 6, push-gate.js). Each row breaks one load-bearing line and requires THAT file's suite to go RED. No harness named
// these files before; this one copies sources-gate.mutants.js's shape.
//
// (Lives in consonance/tools, not consonance/hooks: install.ps1 audits every non-test file in a manifest directory, and a mutants harness is not a hook.)
// THE TRACKED SOURCES ARE NEVER WRITTEN. A temp tree mirrors what the suites read; the copy is mutated, the file's suite runs, the tree is removed.
// Every anchor must occur EXACTLY ONCE or the row is NOT APPLIED (counted as such, never as a catch). The push suite's recorded-commit row skips in
// the temp tree (no 3de92e53 there); the push rows are caught by its real-push rows.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const BODY = 'consonance/hooks/sessionstart-body.js', GATE = 'consonance/hooks/wake-gate.js', PUSH = 'consonance/hooks/push-gate.js';
const SUITE = { [BODY]: 'consonance/hooks/sessionstart-body.test.js', [GATE]: 'consonance/hooks/wake-gate.test.js', [PUSH]: 'consonance/hooks/push-gate.test.js' };
// what the suites read: the hooks, their tests, the pinned sources (state-sync's machineTag, sessionstart-state's D273 block), scratch.js
const COPY = [BODY, GATE, PUSH, ...Object.values(SUITE), 'consonance/hooks/sessionstart-state.js', 'consonance/tools/state-sync.js', 'consonance/tools/scratch.js'];

const MUTANTS = [
  // ---- W3, the body line ----
  ['body: origin dated by the COMMIT, not the reflog entry', BODY, 'return m ? new Date(Number(m[1]) * 1000) : null;', "return new Date(Number(git(repo, ['log', '-1', '--format=%ct', 'refs/remotes/origin/main'])) * 1000);"],
  ['body: a model from the transcript is not marked "(last reply)"', BODY, "${src.model === 'transcript' ? ' (last reply)' : ''}", ''],
  ['body: the payload\'s model is ignored', BODY, "let model = field(() => (typeof payload.model === 'string' && payload.model ? payload.model : payload.model && payload.model.id) || null);", 'let model = null;'],
  ['body: the effort env is not read', BODY, "for (const k of ['CLAUDE_CODE_EFFORT_LEVEL', 'CLAUDE_EFFORT'])", 'for (const k of [])'],
  ['body: the saved effort is not read', BODY, "if (v) { src.effort = 'saved'; return `${v} (saved)`; }", ''],
  ['body: context_tokens ignored', BODY, 'if (Number(payload.context_tokens) > 0)', 'if (false)'],
  ['body: a compaction\'s size is not marked "before compaction"', BODY, "return source === 'compact' ? `${k(reply.ctx)} before compaction`", 'return false ? `${k(reply.ctx)} before compaction`'],
  ['body: the behind count is always 0', BODY, '${behind} behind by that copy', '0 behind by that copy'],
  ['body: the shelf\'s distance from HEAD is not said', BODY, "${n > 0 ? `, ${n} commits behind HEAD` : ''}", ''],
  ['body: W1\'s stamp line is ignored', BODY, "const stamp = /^Built \\S+ \\S+ on \\S+ from HEAD ([0-9a-f]{7,40})\\b/m.exec(fs.readFileSync(md, 'utf8'));", 'const stamp = null;'],
  ['body: a fresh pane gets the line', BODY, "isFreshCwd(payload.cwd) ? 'fresh pane' : ", ''],
  ['body: an overseer run gets the line', BODY, "process.env.CLAUDE_OVERSEER_RUN ? 'overseer run' : ", ''],
  ['body: the Third Place gets the line', BODY, "isThirdPlaceCwd(payload.cwd) ? 'third-place cwd' : null", 'null'],
  ['body: every seat gets the room clause', BODY, '  if (isLibrarianCwd(payload.cwd)) {', '  if (true) {'],
  ['body: the librarian gets no room clause', BODY, '  if (isLibrarianCwd(payload.cwd)) {', '  if (false) {'],
  ['body: the ledger does not say where the model came from', BODY, 'model_src: src.model', "model_src: 'none'"],
  ['body: the dream gate removed', BODY, 'if (process.env.CONSONANCE_DREAM) process.exit(0);', ''],
  ['body: the Third Place\'s newest is the OLDEST by name', BODY, 'xs.sort((a, b) => (a.d === b.d ? (a.n < b.n ? 1 : -1) : a.d < b.d ? 1 : -1));', 'xs.sort((a, b) => (a.d === b.d ? (a.n < b.n ? -1 : 1) : a.d < b.d ? -1 : 1));'],
  // ---- required(), shared by W3 and W4 (each copy mutated in its own file; the W3 suite and the W4 suite each hold it) ----
  ['required (W3 copy): the newest note is the oldest', BODY, '.filter((x) => x.m[1] <= limit).sort((a, b) => (a.n < b.n ? 1 : -1));', '.filter((x) => x.m[1] <= limit).sort((a, b) => (a.n < b.n ? -1 : 1));'],
  ['required (W3 copy): a note more than a day ahead counts', BODY, '.filter((x) => x.m[1] <= limit).sort(', '.filter(() => true).sort('],
  ['required (W4 copy): the other machine is this one', GATE, "const other = machine === 'D' ? 'L' : machine === 'L' ? 'D' : null;", "const other = machine === 'D' ? 'D' : machine === 'L' ? 'L' : null;"],
  ['required (W4 copy): every date\'s handoffs, not the newest', GATE, 'handoffs: offs.filter((x) => x.m[1] === newest)', 'handoffs: offs.filter(() => true)'],
  // ---- W4, the wake gate ----
  // (re-pointed for the ruled bar, pane P, 2026-11-13: the gate now counts the lines a call RETURNED; these rows break that code)
  ['gate (the ruled bar): any Read with no limit covers the whole file again (the old form)', GATE, "    for (const l of res.split('\\n')) { const m = /^\\s*(\\d+)\\t/.exec(l); if (m) out.add(Number(m[1])); }", '    if (i.limit == null) for (let k = 1; k <= (fileLines || []).length; k++) out.add(k);'],
  ['gate: a stage after the cat is allowed', GATE, "if (seg.includes('|') || ", 'if ('],
  ['gate: a stdout redirect is allowed', GATE, "/(^|[^2&])>/.test(seg) || ", ''],
  ['gate: -TotalCount / -Head / -Tail are allowed', GATE, ' || w.some((x) => PARTIAL_FLAGS.test(x))', ''],
  ['gate: a persisted-output preview counts', GATE, '  if (res.includes(PERSISTED)) return out;\n', ''],
  ['gate: an errored call counts', GATE, '  if (!call || call.err) return out;', '  if (!call) return out;'],
  // (was 'a call with no result yet counts' on `!call.done`, which SURVIVED as an equivalent mutant: a call with no result has an empty result and
  // returns no lines by construction, so the check was removed; the row "an errored Read, or a call whose result is not on disk yet" still holds it)
  ['gate (the ruled bar): S ignored, the whole note always', GATE, 'start: rel === r.note ? startLine(dir, payload.session_id, rel, w && w.t, lines.length) : 1', 'start: 1'],
  ['gate (the ruled bar): the 10 s window removed (this wake\'s own row read as the previous)', GATE, 'const cut = Date.parse(wakeT) - 10000;', 'const cut = Infinity;'],
  ['gate (the ruled bar): the session match removed', GATE, 'r.session === session && ', ''],
  ['gate (the ruled bar): the note match removed', GATE, ' && r.note === note && ', ' && '],
  ['gate (the ruled bar): a cut cat counted (its result lines, not the file\'s lines it holds)', GATE, '  for (let k = 1; k <= best; k++) out.add(k);', '  for (let k = 1; k <= Math.max(best, got.length); k++) out.add(k);'],
  ['gate (the ruled bar): N from the ledger, not the file (a note that shrank is not caught)', GATE, '  if (!prev || prev.note_lines > n) return 1;', '  if (!prev) return 1;'],
  ['gate (the ruled bar): lines a Read returned from ANOTHER file count', GATE, "    if (!names(i.file_path, rel)) return out;\n", ''],
  ['body (the ruled bar): the librarian\'s row records no note and no line count', BODY, '...(noteAt ? { session: payload.session_id || null, note: noteAt.note, note_lines: noteAt.lines } : {})', '...({})'],
  ['gate: backslash paths are not normalised', GATE, ".replace(/\\\\/g, '/').replace(/\\/+/g, '/')", ".replace(/\\/+/g, '/')"],
  // (was 'a compact wake counts opens before it' on `w.kind === 'compact' ? [] :`, which SURVIVED as an equivalent mutant: that window holds no call
  // on a compact wake by construction, so the branch was removed; this row breaks what does decide it, the last compaction's index)
  ['gate: the last compaction is not tracked (a resume counts opens the summary dropped)', GATE, '    if (r.wake === \'compact\') { if (!r.hook) lastCompact = i;', "    if (r.wake === 'compact') {"],
  ['gate: every ring is gated, not only the first', GATE, 'if (after.some((r) => r.name === GATED_TOOL && r.done && !r.err', 'if (false && after.some((r) => r.name === GATED_TOOL && r.done && !r.err'],
  ['gate: a refused first ring counts as delivered', GATE, 'r.name === GATED_TOOL && r.done && !r.err && ', 'r.name === GATED_TOOL && r.done && '],
  ['gate: [interrupt] does not pass', GATE, 'if (/\\[interrupt\\]/i.test(String(text)))', 'if (false)'],
  ['gate: a subagent is exempted', GATE, "if (agentId) return { decision: 'deny', kind: 'subagent'", "if (agentId) return { decision: 'allow', kind: 'subagent'"],
  ['gate: other seats are gated', GATE, '  if (pane !== LIBRARIAN_SID && !isLibrarianCwd(payload.cwd)) return process.exit(0);   // other seats are never gated\n', ''],
  ['gate: it refuses off D too', GATE, "const refuses = machine === 'D';", 'const refuses = true;'],
  ['gate: a deny is given though its row was not written', GATE, "  if (!record(dir, { ...row, decision: 'deny' })) return process.exit(0);", "  record(dir, { ...row, decision: 'deny' });"],
  ['gate: an own append is not named', GATE, "ownAppend.length === missing.length ? 'own-append' : 'missing'", "'missing'"],
  ['gate: a SessionStart is not a wake (only compactions)', GATE, "e.attachment.type === 'hook_success' && e.attachment.hookEvent === 'SessionStart'", "e.attachment.type === 'never' && e.attachment.hookEvent === 'SessionStart'"],
  ['gate: the dream gate removed', GATE, 'if (process.env.CONSONANCE_DREAM) process.exit(0);', ''],
  // ---- ruling 6, the push gate's 10 MB rule ----
  ['push: exactly 10 MB is refused (off by one)', PUSH, 'Number(m[1]) > MAX_FILE_BYTES', 'Number(m[1]) >= MAX_FILE_BYTES'],
  ['push: large files are never collected', PUSH, '    for (const b of big) large.push({ ...b, repo: t.dir, remote });\n', ''],
  ['push: the remote\'s own files are counted again', PUSH, 'const big = largeFiles(t.dir, src, [`--remotes=${remote}`]);', "const big = largeFiles(t.dir, src, ['--remotes=no-such-remote']);"],
  ['push: a key refusal\'s own text is dropped when a large file is also found', PUSH, '[d.found.length ? reasonOf(d.found) : null,', '[null,'],
  ['push: the ledger does not record the large files', PUSH, ', ...(d.large && d.large.length ? { large: d.large.slice(0, 50).map((b) => ({ file: b.file, bytes: b.bytes, blob: b.blob })) } : {})', ''],
];

function tree() {
  const dir = require('./scratch.js').mkdtemp('lapw-mut-');
  for (const rel of COPY) { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.copyFileSync(path.join(ROOT, rel), path.join(dir, rel)); }
  return dir;
}
function run(dir, suite) {
  const env = { ...process.env }; for (const k of Object.keys(env)) if (/^(CONSONANCE_|CLAUDE_EFFORT|CLAUDE_CODE_EFFORT|CLAUDE_OVERSEER|BODY_|WAKE_)/.test(k)) delete env[k];
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', path.join(dir, suite)], { encoding: 'utf8', env, timeout: 15 * 60 * 1000, windowsHide: true });
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
  return { pass: n('pass'), fail: n('fail') };
}

function main() {
  require('./heavy-run.js').hold({ cmd: 'lapw-hooks.mutants' });   // ONE HEAVY RUNNER PER TREE
  const onlyAt = process.argv.indexOf('--only'), only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
  for (const suite of [...new Set(Object.values(SUITE))]) {
    const c = (() => { const d = tree(); try { return run(d, suite); } finally { fs.rmSync(d, { recursive: true, force: true }); } })();
    console.log(`control ${path.basename(suite).padEnd(30)} (unmutated copy)          pass ${c.pass} fail ${c.fail}`);
    if (!(c.fail === 0 && c.pass > 0)) { console.log('CONTROL NOT GREEN - no mutant result means anything'); process.exitCode = 1; return; }
  }
  let applied = 0, caught = 0, notApplied = 0;
  MUTANTS.forEach(([name, file, anchor, repl], i) => {
    if (only != null && only !== i + 1) return;
    const src = read(file), hits = src.split(anchor).length - 1, label = `${String(i + 1).padStart(2)} ${name}`.padEnd(96);
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    applied++;
    const d = tree();
    try {
      fs.writeFileSync(path.join(d, file), src.replace(anchor, () => repl));
      const r = run(d, SUITE[file]), ok = r.fail > 0; if (ok) caught++;
      console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? 'CAUGHT' : 'SURVIVED'}`);
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  });
  console.log(`\n${applied} applied · ${caught} caught · ${applied - caught} survived · ${notApplied} NOT APPLIED`);
  if (applied - caught > 0 || notApplied > 0) process.exitCode = 1;
}

main();
