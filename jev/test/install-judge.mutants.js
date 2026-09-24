#!/usr/bin/env node
'use strict';
// jev/test/install-judge.mutants.js — node jev/test/install-judge.mutants.js [--only <n>]
//
// The D123 mutants for jev/install.js and the D123 changes to jev/bin/jev-judge.js (the payload's move, prompt_id,
// confidence, the lag guard), tracked from D124 (it ran from a scratch dir in D123). The companion of
// ask-judge.mutants.js, which covers ask.js and the batch-1 judge.
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. Each row breaks one guard; install.test.js +
// judge.test.js must go RED for it. On these files a surviving mutant is a settings.json replaced instead of merged, a
// foreign hook removed, a restore that is not byte-exact, turn text on a command line, or a flag line keyed to nothing.
//
// THE TRACKED SOURCES ARE NEVER WRITTEN. jev/ is copied to a temp dir, the copy is mutated, the copy's two suites run,
// the dir is removed. Every anchor must occur EXACTLY ONCE, or the row is NOT APPLIED (counted as such, never as a
// catch). An anchor's line breaks follow the source's own, so a CRLF checkout applies the same rows. The suites run with
// AI_GATEWAY_API_KEY removed.
//
// ONE MUTANT IS DELIBERATELY ABSENT: "no home -> fall back to os.homedir()". Its test calls install() with no home, so
// under that mutant the run would write into the REAL ~/.claude/settings.json. A harness that can edit the user's
// settings is worse than a gap in it; the guard is pinned by install.test.js and left unmutated, and said so.
//
// ONE ROW WAS DELETED (D124): "tool-result rows read as user text" (dropping `p.type === 'text'` in jev-judge.js textOf).
// It is EQUIVALENT on real data — a tool_result part has no top-level `.text`, so without the filter it still adds
// nothing and the row is still skipped — so it survived in D123 and no honest test can kill it.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const JEV = path.join(__dirname, '..');
const IN = 'install.js';
const JU = 'bin/jev-judge.js';
const BOM_LINE = "return (layout.bom ? '" + '\\' + "uFEFF' : '') + s;";

const MUTANTS = [
  [IN, 'merge becomes replace (existing settings discarded)', 'const obj = existed ? parseSettings(text, p.settings) : {};', 'const obj = existed ? (parseSettings(text, p.settings), {}) : {};'],
  [IN, 'a file that does not parse is treated as empty', 'throw new InstallError(`${file} does not parse as JSON', 'return {}; throw new InstallError(`${file} does not parse as JSON'],
  [IN, 'an event that is not an array accepted', 'if (event in h && !Array.isArray(h[event])) throw', 'if (false) throw'],
  [IN, 'idempotence lost: every install writes', 'if (!res.added && !res.repointed) return res;', ''],
  [IN, 'every install adds another entry', 'if (!found) { groups.push({ hooks: [want] }); res.added++; }', '{ groups.push({ hooks: [want] }); res.added++; }'],
  [IN, 'entries matched by file name, not path', 'const want = norm(script, platform);', 'const want = path.basename(script);'],
  [IN, 'Windows paths compared case-sensitively', 'return isWin(platform) ? s.toLowerCase() : s;', 'return s;'],
  [IN, 'no backup before an install writes', 'res.backup = `${p.settings}.bak-jev-${stamp(now)}`;\n    fs.copyFileSync(p.settings, res.backup);', 'res.backup = `${p.settings}.bak-jev-${stamp(now)}`;'],
  [IN, 'uninstall never restores bytes', 'if (preText != null && sameEntry(preObj, obj)) {', 'if (false) {'],
  [IN, 'the file\'s layout not kept on install', 'writeChecked(p.settings, render(obj, layout), obj, res.backup);', "writeChecked(p.settings, JSON.stringify(obj, null, 2) + '\\n', obj, res.backup);"],
  [IN, 'a BOM dropped', BOM_LINE, 'return s;'],
  [IN, 'uninstall empties the whole event, foreign hooks included', 'g.hooks = g.hooks.filter((h) => !isOurs(h, script, platform));', 'g.hooks = [];'],
  [IN, 'a second install overwrites the pre-install record', 'if (!fs.existsSync(p.state)) {', 'if (true) {'],
  [IN, 'a created settings.json not removed on uninstall', "fs.rmSync(p.settings);\n    res.restored = 'removed-file';", "res.restored = 'removed-file';"],
  [IN, 'the same-name note dropped', 'res.notes.push(', 'void ('],
  [IN, 'no ~/.claude check', 'if (!fs.existsSync(p.claudeDir)) throw', 'if (false) throw'],
  [IN, 'a written file that does not read back is kept', 'if (!sameEntry(back, expectObj)) {', 'if (false) {'],
  [IN, 'shell form instead of exec form', 'return { type: \'command\', command: nodePath, args: [script], timeout: TIMEOUT_S };', 'return { type: \'command\', command: `"${nodePath}" "${script}"`, timeout: TIMEOUT_S };'],
  [IN, 'a pre-install empty container pruned anyway', "if (!kept.length && !(preHooks && event in preHooks)) delete obj.hooks[event];", 'if (!kept.length) delete obj.hooks[event];'],
  [IN, 'a pre-install empty hooks object pruned anyway', "if (!Object.keys(obj.hooks).length && !(preObj && 'hooks' in preObj)) delete obj.hooks;", 'if (!Object.keys(obj.hooks).length) delete obj.hooks;'],

  [JU, 'dedupe ignores prompt_id (transcript key always)', 'promptId ? { prompt_id: promptId } : { turn_uuid: turn }', '{ turn_uuid: turn }'],
  [JU, 'prompt_id not recorded in the row', 'prompt_id: promptId, verdict', 'prompt_id: null, verdict'],
  [JU, 'a prompt_id turn stopped when its end row never shows', "if (!end && !promptId) return fail('no-turn-end'", "if (!end) return fail('no-turn-end'"],
  [JU, 'the lag guard removed (a later user prompt ignored)', 'if (o.message.role === \'user\') { if (textOf(o.message).trim()) return null; continue; }', "if (o.message.role === 'user') continue;"],
  [JU, 'sidechain rows read as the session\'s end row', 'if (!o || o.isSidechain || !o.message) continue;', 'if (!o || !o.message) continue;'],
  [JU, 'the failure log loses the prompt id', 'turn_uuid: turn, prompt_id: logPromptId, why };', 'turn_uuid: turn, why };'],
  [JU, 'the payload\'s move ignored', 'const view = move\n', 'const view = false\n'],
  [JU, 'no user context with the payload\'s move', 'user_context: meta.transcript_path ? lastUserText(meta.transcript_path) : null', 'user_context: null'],
  [JU, 'the payload\'s move not capped', 'move.slice(0, MOVE_MAX)', 'move'],
  [JU, 'the move put on the command line', 'prompt_id: meta.prompt_id || null };', 'prompt_id: meta.prompt_id || null, last_assistant_message: meta.last_assistant_message };'],
  [JU, 'prompt_id not passed to the child', 'prompt_id: meta.prompt_id || null };', '};'],
  [JU, 'the child\'s stdin written but never closed', 'child.stdin.end(JSON.stringify({ last_assistant_message: move }));', 'child.stdin.write(JSON.stringify({ last_assistant_message: move }));'],
  [JU, 'the child ignores its stdin', 'if (piped && typeof piped.last_assistant_message === \'string\') meta.last_assistant_message = piped.last_assistant_message;', ''],
  [JU, 'confidence invented from probabilities', "confidence: typeof r.confidence === 'number' ? r.confidence : null,", "confidence: typeof r.confidence === 'number' ? r.confidence : ((r.probabilities || {})[r.choice] ?? null),"],
  [JU, 'confidence dropped', "confidence: typeof r.confidence === 'number' ? r.confidence : null,", 'confidence: null,'],
  [JU, 'the child\'s stdout/stderr not ignored', "stdio: ['pipe', 'ignore', 'ignore']", "stdio: 'pipe'"],
  [JU, 'the child not detached', "detached: true, stdio: ['pipe', 'ignore', 'ignore'], windowsHide: true", "detached: false, stdio: ['pipe', 'ignore', 'ignore'], windowsHide: true"],
  [JU, 'the child not hidden on Windows', "detached: true, stdio: ['pipe', 'ignore', 'ignore'], windowsHide: true", "detached: true, stdio: ['pipe', 'ignore', 'ignore'], windowsHide: false"],
  [JU, 'a turn already judged is asked again', "if (alreadyJudged(ledgerPath, sid, promptId ? { prompt_id: promptId } : { turn_uuid: turn })) return { outcome: 'already' };", ''],
];

function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) copyTree(s, d); else fs.copyFileSync(s, d);
  }
}

function runSuites(dir) {
  const env = { ...process.env };
  delete env.AI_GATEWAY_API_KEY;
  return spawnSync(process.execPath, ['--test', path.join(dir, 'test', 'install.test.js'), path.join(dir, 'test', 'judge.test.js')],
    { cwd: dir, env, encoding: 'utf8', timeout: 180000 });
}

function main() {
  const onlyAt = process.argv.indexOf('--only');
  const only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const control = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-ij-ctl-'));
  copyTree(JEV, control);
  const c = runSuites(control);
  fs.rmSync(control, { recursive: true, force: true });
  console.log(`control: ${c.status === 0 ? 'GREEN' : 'RED'} (exit ${c.status})`);
  if (c.status !== 0) { console.log(c.stdout.slice(-3000)); process.exitCode = 1; return; }

  const rows = [];
  MUTANTS.forEach(([file, name, from0, to0], i) => {
    const n = i + 1;
    if (only && n !== only) return;
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-ij-'));
    try {
      copyTree(JEV, dir);
      const f = path.join(dir, file);
      const src = fs.readFileSync(f, 'utf8');
      const eol = src.includes('\r\n') ? '\r\n' : '\n';
      const from = from0.replace(/\r?\n/g, eol);
      const to = to0.replace(/\r?\n/g, eol);
      const count = src.split(from).length - 1;
      if (count !== 1) { rows.push([n, name, 'NOT APPLIED', `anchor occurs ${count} times`]); return; }
      fs.writeFileSync(f, src.replace(from, to));
      const r = runSuites(dir);
      rows.push([n, name, r.status === 0 ? 'SURVIVED' : 'caught', `exit ${r.status}`]);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
  for (const [n, name, v, note] of rows) console.log(`M${String(n).padStart(2, '0')} ${v.padEnd(11)} ${name} (${note})`);
  const caught = rows.filter((r) => r[2] === 'caught').length;
  const survived = rows.filter((r) => r[2] === 'SURVIVED').length;
  const na = rows.filter((r) => r[2] === 'NOT APPLIED').length;
  console.log(`applied ${caught + survived} / caught ${caught} / survived ${survived} / NOT APPLIED ${na} — of ${rows.length}`);
  process.exitCode = survived || na ? 1 : 0;
}

main();
