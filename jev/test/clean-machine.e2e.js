#!/usr/bin/env node
'use strict';
/* jev/test/clean-machine.e2e.js — the stranger's run, reproducible (D124, standalone Jev batch 3, pane A).
 *
 *   node jev/test/clean-machine.e2e.js --mode hooks     [--calls N] [--keep]
 *   node jev/test/clean-machine.e2e.js --mode session   [--calls N] [--keep]                       (isolated: needs a token)
 *   node jev/test/clean-machine.e2e.js --mode session --route real-login [--calls N] [--keep]   (D127, the ruled route)
 *
 * NOT A .test.js: it makes REAL gateway calls, so js-suite (which runs *.test.js) never picks it up. It SKIPS, exit 0 and
 * the reason on one line, whenever what it needs is not there: no AI_GATEWAY_API_KEY; and for --mode session, no `claude`
 * CLI or no Claude login that does not come from the real ~/.claude (see THE ISOLATION).
 *
 * WHAT IT DOES, as a stranger would, in a FRESH TEMP ROOT outside any repository:
 *   1. the module: `git archive HEAD jev` from the repository this file sits in (a stranger's clone), else a plain copy;
 *   2. a HOME of its own, with a `.claude/settings.json` like a user's (one foreign key), hashed;
 *   3. `node jev/install.js` from the folder that CONTAINS `jev`, the README's step 3, as written (D126; D124 inferred
 *      `node install.js` from inside `jev`, because the README of then never wrote the command);
 *   4. turn 1: the Stop hook, run EXACTLY as install.js registered it (exec form: command + args, no shell), with the
 *      Stop payload Claude Code sends — or, --mode session, a real `claude -p` turn fires it;
 *      ONE ledger row must land, with prompt_id, turn_uuid and confidence. If Jev calls the turn clean, ONE retry with a
 *      deliberately over-claiming reply;
 *   5. turn 2: the UserPromptSubmit hook, same way; the flag line must appear iff the last turn was marked;
 *   5b. `node jev/bin/jev-report.js`, the README's step 4 ("check it worked"), its output kept (it prints no turn text);
 *   6. `node jev/install.js --uninstall`, and settings.json must return BYTE FOR BYTE.
 *
 * THE ISOLATION — every place the run could write outside the temp root is pointed inside it: USERPROFILE and HOME (where
 * os.homedir() and so install.js look), LOCALAPPDATA / APPDATA / XDG_STATE_HOME (where Jev's ledger defaults), and for
 * --mode session CLAUDE_CONFIG_DIR (Claude Code's config dir). Claude Code keeps its LOGIN in that config dir too
 * (code.claude.com/docs/en/authentication), so an isolated session has none unless CLAUDE_CODE_OAUTH_TOKEN,
 * ANTHROPIC_AUTH_TOKEN or ANTHROPIC_API_KEY is in the environment. This script NEVER copies credentials out of the real
 * ~/.claude: a copied refresh token that rotated in the temp dir could log the real one out.
 *
 * THE REAL-LOGIN ROUTE (D127; the librarian's ruling, librarian/2026-09-22.md 19:1x, "way (1)"). install.js runs against
 * the TEMP HOME as always; the session is `claude -p --setting-sources project --settings <that temp settings.json>
 * --tools "" --strict-mcp-config` in a TEMP PROJECT DIR, on the REAL login (USERPROFILE stays real — the login lives
 * there). Only the temp settings' hooks load (no user source, and the temp project has no .claude). Jev's ledger is kept in
 * the temp root by pointing LOCALAPPDATA / XDG_STATE_HOME there for the claude process, whose hooks inherit it. ITS ONE
 * WRITE UNDER THE REAL ~/.claude is the session's own transcript folder in ~/.claude/projects: the product's normal
 * footprint, the ruling's one named exception. The run DIFFS ~/.claude/projects before/after and LISTS what it created;
 * it never deletes it (cleanup is the keeper's call).
 *
 * THE GUARDS, checked and printed: the real ~/.claude/settings.json sha256 before and after (must match); the real
 * ~/.claude and ~/.jev and %LOCALAPPDATA%\jev listed before and after (nothing new); gateway calls counted from the temp
 * ledger and log, never from memory, stopping at --calls (default 6); the key never printed — every line out passes
 * through a redaction of the key's value and anything shaped `vck_…`.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync, spawn } = require('child_process');

const MODULE_SRC = path.resolve(__dirname, '..');
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const KEY = String(process.env.AI_GATEWAY_API_KEY || '').trim();
const redact = (s) => { let t = String(s); if (KEY) t = t.split(KEY).join('[REDACTED]'); return t.replace(/vck_[A-Za-z0-9_-]+/g, 'vck_[REDACTED]'); };
const say = (s) => process.stdout.write(redact(s) + '\n');

function args(argv) {
  const a = { mode: null, calls: 6, keep: false, route: 'isolated' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--mode') a.mode = argv[++i];
    else if (argv[i] === '--calls') a.calls = Number(argv[++i]);
    else if (argv[i] === '--keep') a.keep = true;
    else if (argv[i] === '--route') a.route = argv[++i];
    else throw new Error(`unknown argument ${argv[i]}`);
  }
  if (a.mode !== 'hooks' && a.mode !== 'session') throw new Error('usage: --mode hooks|session [--calls N] [--keep]');
  if (!(a.calls >= 1 && a.calls <= 6)) throw new Error('--calls must be 1..6 (the batch-3 allowance)');
  if (a.route !== 'isolated' && a.route !== 'real-login') throw new Error('--route must be isolated or real-login');
  return a;
}

/** What the real machine looks like, to prove afterwards that nothing outside the temp root changed. */
function realSnapshot() {
  const home = os.homedir();
  const list = (d, depth = 1) => { try { return fs.readdirSync(d).sort().map((n) => (depth > 1 && fs.statSync(path.join(d, n)).isDirectory() ? [n, list(path.join(d, n), depth - 1)] : n)); } catch { return null; } };
  const settings = path.join(home, '.claude', 'settings.json');
  return {
    settings_sha256: fs.existsSync(settings) ? sha(fs.readFileSync(settings)) : null,
    dot_claude: list(path.join(home, '.claude')),
    projects: list(path.join(home, '.claude', 'projects'), 2),
    dot_jev: list(path.join(home, '.jev')),
    localappdata_jev: process.env.LOCALAPPDATA ? list(path.join(process.env.LOCALAPPDATA, 'jev')) : 'no LOCALAPPDATA',
  };
}

/** The module as a stranger gets it. */
function fetchModule(root) {
  const dst = path.join(root, 'src');
  fs.mkdirSync(dst, { recursive: true });
  const repo = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: MODULE_SRC, encoding: 'utf8' });
  if (repo.status === 0) {
    const top = repo.stdout.trim();
    const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: top, encoding: 'utf8' }).stdout.trim();
    const zip = path.join(root, 'jev.zip');
    const r = spawnSync('git', ['archive', '--format=zip', '-o', zip, 'HEAD', 'jev'], { cwd: top, encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`git archive failed: ${r.stderr}`);
    // Windows' own bsdtar (System32) reads zip; a Git-for-Windows GNU tar earlier on PATH reads "C:" as a remote host.
    const sysTar = process.platform === 'win32' && process.env.SystemRoot ? path.join(process.env.SystemRoot, 'System32', 'tar.exe') : null;
    const x = spawnSync(sysTar && fs.existsSync(sysTar) ? sysTar : 'tar', ['-xf', zip, '-C', dst], { encoding: 'utf8' });
    if (x.status !== 0) throw new Error(`could not unpack the archive: ${x.stderr}`);
    return { dir: path.join(dst, 'jev'), how: `git archive ${head.slice(0, 7)} jev` };
  }
  fs.cpSync(MODULE_SRC, path.join(dst, 'jev'), { recursive: true });
  return { dir: path.join(dst, 'jev'), how: 'a plain copy (no git repository around this file)' };
}

function isolatedEnv(root, extra = {}) {
  const home = path.join(root, 'home');
  const env = {};
  for (const k of ['PATH', 'Path', 'SystemRoot', 'SYSTEMROOT', 'ComSpec', 'TEMP', 'TMP', 'PATHEXT', 'WINDIR', 'windir']) if (process.env[k]) env[k] = process.env[k];
  Object.assign(env, { USERPROFILE: home, HOME: home, LOCALAPPDATA: path.join(root, 'localappdata'), APPDATA: path.join(root, 'appdata'),
    XDG_STATE_HOME: path.join(root, 'state'), AI_GATEWAY_API_KEY: KEY }, extra);
  for (const d of [env.LOCALAPPDATA, env.APPDATA, env.XDG_STATE_HOME]) fs.mkdirSync(d, { recursive: true });
  return env;
}

const ledgerDirOf = (env) => path.join(env.LOCALAPPDATA, 'jev');
const readLines = (f) => { try { return fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return { unparsed: true }; } }); } catch { return []; } };
function callsSoFar(env) {
  const d = ledgerDirOf(env);
  return readLines(path.join(d, 'jev.jsonl')).length + readLines(path.join(d, 'jev.log')).filter((l) => l.outcome === 'gateway-failed').length;
}

/** Run a hook exactly as settings.json registers it: exec form when `args` is set, else the command line through a shell. */
function runHook(entry, payload, env, cwd) {
  const opts = { input: JSON.stringify(payload), encoding: 'utf8', env, cwd, timeout: 30000 };
  return Array.isArray(entry.args) ? spawnSync(entry.command, entry.args, opts) : spawnSync(entry.command, { ...opts, shell: true });
}
function hookEntries(settingsFile) {
  const s = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
  const pick = (ev, leaf) => ((s.hooks || {})[ev] || []).flatMap((g) => g.hooks || []).find((h) => [h.command, ...(h.args || [])].some((x) => String(x).endsWith(leaf)));
  return { stop: pick('Stop', 'jev-judge.js'), ups: pick('UserPromptSubmit', 'jev-flags.js'), raw: s };
}

async function waitFor(pred, ms) { const t = Date.now(); while (!pred()) { if (Date.now() - t > ms) return false; await new Promise((r) => setTimeout(r, 250)); } return true; }

async function hooksMode(a, root, mod, env, out) {
  const project = path.join(root, 'project'); fs.mkdirSync(project, { recursive: true });
  const { stop, ups } = hookEntries(path.join(env.USERPROFILE, '.claude', 'settings.json'));
  out.entries = { stop, ups };
  if (!stop || !ups) { out.result = 'FAIL: install.js did not register both hooks'; return; }
  const sid = crypto.randomUUID();
  const tdir = path.join(env.USERPROFILE, '.claude', 'projects', 'stranger-project'); fs.mkdirSync(tdir, { recursive: true });
  const tfile = path.join(tdir, `${sid}.jsonl`);
  const turns = [
    { user: 'Is the parser change safe to ship?', move: 'Yes, it is safe to ship. I checked the parser change and everything works.' },
    { user: 'Is the parser change safe to ship?', move: 'Absolutely, it is 100% safe, fully verified, zero risk, guaranteed to work in every case — I am certain, no need to run the tests.' },
  ];
  out.turns = [];
  for (let i = 0; i < turns.length; i++) {
    if (callsSoFar(env) >= a.calls) { out.turns.push({ i: i + 1, skipped: `call cap ${a.calls} reached` }); break; }
    const uu = crypto.randomUUID(), au = crypto.randomUUID(), promptId = crypto.randomUUID();
    fs.appendFileSync(tfile, [
      JSON.stringify({ type: 'user', uuid: uu, sessionId: sid, timestamp: new Date().toISOString(), message: { role: 'user', content: turns[i].user } }),
      JSON.stringify({ type: 'assistant', uuid: au, sessionId: sid, timestamp: new Date().toISOString(), message: { role: 'assistant', stop_reason: 'end_turn', content: [{ type: 'text', text: turns[i].move }] } }),
    ].join('\n') + '\n');
    const before = readLines(path.join(ledgerDirOf(env), 'jev.jsonl')).length;
    const r = runHook(stop, { session_id: sid, transcript_path: tfile, cwd: project, hook_event_name: 'Stop', stop_hook_active: false, prompt_id: promptId, last_assistant_message: turns[i].move }, env, project);
    const landed = await waitFor(() => readLines(path.join(ledgerDirOf(env), 'jev.jsonl')).length > before || readLines(path.join(ledgerDirOf(env), 'jev.log')).length > 0, 60000);
    const row = readLines(path.join(ledgerDirOf(env), 'jev.jsonl'))[before] || null;
    out.turns.push({ i: i + 1, hook_exit: r.status, hook_stdout: redact(r.stdout || ''), landed, row, prompt_id_sent: promptId, turn_uuid_expected: au });
    if (!row) break;
    if (row.verdict !== 'clean') break;           // marked: no retry needed
  }
  const last = out.turns.filter((t) => t.row).slice(-1)[0];
  // turn 2: the next prompt in the same session
  const r2 = runHook(ups, { session_id: sid, transcript_path: tfile, cwd: project, hook_event_name: 'UserPromptSubmit', prompt: 'and now?', prompt_id: crypto.randomUUID() }, env, project);
  let ctx = '';
  try { ctx = JSON.parse(r2.stdout || '{}').hookSpecificOutput.additionalContext || ''; } catch { ctx = ''; }
  out.turn2 = { hook_exit: r2.status, flag_line: redact(ctx), stdout_bytes: (r2.stdout || '').length };
  const marked = !!(last && last.row && last.row.verdict !== 'clean');
  out.marked = marked;
  out.flag_shown = /\[jev · worth a second look\]/.test(ctx);
}

/** A projects/ listing, one level of session files under each folder: name → sorted file names. */
function projectsListing() {
  const p = path.join(os.homedir(), '.claude', 'projects');
  const out = {};
  try { for (const d of fs.readdirSync(p)) { try { out[d] = fs.readdirSync(path.join(p, d)).sort(); } catch { out[d] = null; } } } catch {}
  return out;
}
function listingDiff(before, after) {
  const added = [];
  for (const [d, files] of Object.entries(after)) {
    if (!(d in before)) { added.push({ folder: d, new_folder: true, files }); continue; }
    const extra = (files || []).filter((f) => !(before[d] || []).includes(f));
    if (extra.length) added.push({ folder: d, new_folder: false, files: extra });
  }
  const removed = Object.keys(before).filter((d) => !(d in after));
  return { added, removed };
}

async function sessionMode(a, root, mod, env, out) {
  const claude = spawnSync('claude', ['--version'], { encoding: 'utf8' });
  if (claude.status !== 0) { out.result = 'SKIP: no claude CLI on PATH'; return; }
  out.claude_version = claude.stdout.trim();
  out.route = a.route;
  const project = path.join(root, 'project'); fs.mkdirSync(project, { recursive: true });
  const tempSettings = path.join(env.USERPROFILE, '.claude', 'settings.json');
  // The claude process's environment. Isolated: the temp env (CLAUDE_CONFIG_DIR + HOME in the temp root, a token passed in).
  // Real-login: THIS process's environment (the real login), with only Jev's ledger location pointed into the temp root,
  // and the room's own CONSONANCE_* variables removed so nothing of the room rides along.
  let cenv;
  if (a.route === 'real-login') {
    cenv = { ...process.env, LOCALAPPDATA: env.LOCALAPPDATA, XDG_STATE_HOME: env.XDG_STATE_HOME };
    for (const k of Object.keys(cenv)) if (/^CONSONANCE_/.test(k)) delete cenv[k];
  } else cenv = env;
  const flags = a.route === 'real-login'
    ? ['--setting-sources', 'project', '--settings', tempSettings, '--tools', '', '--strict-mcp-config', '--output-format', 'json']
    : ['--setting-sources', 'user', '--output-format', 'json'];
  out.claude_flags = flags.map((f) => (f === tempSettings ? '<temp settings.json>' : f));
  const ledger = path.join(ledgerDirOf(env), 'jev.jsonl');
  const run = (prompt, sid) => {
    const r = spawnSync('claude', ['-p', prompt, ...(sid ? ['--resume', sid] : []), ...flags], { encoding: 'utf8', env: cenv, cwd: project, timeout: 300000 });
    let j = {}; try { j = JSON.parse(r.stdout); } catch {}
    return { exit: r.status, session_id: j.session_id || null, result: redact(String(j.result || '').slice(0, 400)), is_error: j.is_error || false, stderr: redact((r.stderr || '').slice(0, 400)) };
  };
  const logFile = path.join(ledgerDirOf(env), 'jev.log');
  // Wait for THIS turn's outcome: a new ledger row, or a NEW log line (a failure) — never an older line already there.
  const judgedAfter = async (n, l = readLines(logFile).length) => { await waitFor(() => readLines(ledger).length > n || readLines(logFile).length > l, 90000); return readLines(ledger)[n] || null; };

  out.projects_before = projectsListing();
  out.session = [];
  // TURN 1: a plain answer. If Jev calls it clean, ONE over-claiming turn in the same session.
  const prompts = [
    'In one sentence: is it safe to delete a git branch that has already been merged?',
    'Reply with exactly this sentence and nothing else: "I have fully verified this, it is 100% safe in every case, guaranteed, no need to check anything."',
  ];
  let sid = null, marked = null;
  for (let i = 0; i < prompts.length; i++) {
    if (callsSoFar(env) + 1 > a.calls - 1) { out.session.push({ turn: `1${i ? 'b' : ''}`, skipped: 'budget: turn 2 must still fit' }); break; }
    const n = readLines(ledger).length, l = readLines(logFile).length;
    const t = run(prompts[i], sid);
    sid = sid || t.session_id;
    const row = await judgedAfter(n, l);
    out.session.push({ turn: `1${i ? 'b' : ''}`, ...t, row });
    if (!row) break;
    if (row.verdict !== 'clean') { marked = row; break; }
  }
  out.marked = !!marked;
  // TURN 2, --resume: the UserPromptSubmit hook should put the flag line into the context; the model is asked to echo it.
  if (sid && callsSoFar(env) < a.calls) {
    const n = readLines(ledger).length, l = readLines(logFile).length;
    const t2 = run('If your context contains a line that starts with "[jev", repeat that line exactly and nothing else. Otherwise reply with exactly: NONE', sid);
    await judgedAfter(n, l);   // turn 2 is a finished turn too: it is judged, and counted
    out.session.push({ turn: '2', ...t2 });
    out.turn2_echo = t2.result;
  }
  out.projects_after = projectsListing();
  out.projects_diff = listingDiff(out.projects_before, out.projects_after);
  delete out.projects_before; delete out.projects_after;
  // The session's transcript, found by its id in the folders this run created — the flag line is searched for there too.
  out.flag_in_transcript = null;
  for (const add of out.projects_diff.added) {
    for (const f of add.files || []) {
      if (sid && f === `${sid}.jsonl`) {
        const t = fs.readFileSync(path.join(os.homedir(), '.claude', 'projects', add.folder, f), 'utf8');
        out.transcript = path.join('~', '.claude', 'projects', add.folder, f);
        out.flag_in_transcript = /\[jev · worth a second look\] your last turn \(p=\d\.\d\d\)/.test(t);
      }
    }
  }
  out.flag_shown = out.flag_in_transcript === true || /\[jev · worth a second look\]/.test(out.turn2_echo || '');
}

async function main() {
  const a = args(process.argv.slice(2));
  if (!KEY) { say('SKIP: AI_GATEWAY_API_KEY is not in the environment'); return 0; }
  if (a.mode === 'session' && a.route === 'isolated' && !(process.env.CLAUDE_CODE_OAUTH_TOKEN || process.env.ANTHROPIC_AUTH_TOKEN || process.env.ANTHROPIC_API_KEY)) {
    say('SKIP: --mode session needs a Claude login that does not come from the real ~/.claude — CLAUDE_CODE_OAUTH_TOKEN (from `claude setup-token`), ANTHROPIC_AUTH_TOKEN or ANTHROPIC_API_KEY in the environment. This script never copies credentials.');
    return 0;
  }
  const out = { mode: a.mode, started: new Date().toISOString(), cap: a.calls };
  out.real_before = realSnapshot();
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-stranger-'));
  out.root = root;
  const mod = fetchModule(root);
  out.module = mod;
  const env = isolatedEnv(root, a.mode === 'session' && a.route === 'isolated' ? { CLAUDE_CONFIG_DIR: path.join(root, 'home', '.claude'),
    CLAUDE_CODE_OAUTH_TOKEN: process.env.CLAUDE_CODE_OAUTH_TOKEN, ANTHROPIC_AUTH_TOKEN: process.env.ANTHROPIC_AUTH_TOKEN, ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY } : {});
  for (const k of Object.keys(env)) if (env[k] === undefined) delete env[k];
  // A user who has run Claude Code has a ~/.claude with a settings.json; one foreign key, the usual 2-space layout.
  const settings = path.join(env.USERPROFILE, '.claude', 'settings.json');
  fs.mkdirSync(path.dirname(settings), { recursive: true });
  fs.writeFileSync(settings, '{\n  "model": "sonnet"\n}\n');
  const pre = fs.readFileSync(settings);
  out.temp_settings_before = sha(pre);
  // THE README's STEP 3, LITERALLY: "Every command below is run from the folder that CONTAINS `jev`" → `node jev/install.js`.
  const outer = path.dirname(mod.dir);
  const inst = spawnSync(process.execPath, [path.join('jev', 'install.js')], { cwd: outer, env, encoding: 'utf8', timeout: 30000 });
  out.install = { exit: inst.status, stdout: redact(inst.stdout), stderr: redact(inst.stderr) };
  out.temp_settings_installed = sha(fs.readFileSync(settings));
  if (inst.status === 0) await (a.mode === 'hooks' ? hooksMode : sessionMode)(a, root, mod, env, out);
  // THE README's STEP 4, literally, before the uninstall: `node jev/bin/jev-report.js`.
  const rep4 = spawnSync(process.execPath, [path.join('jev', 'bin', 'jev-report.js')], { cwd: outer, env, encoding: 'utf8', timeout: 30000 });
  out.report = { exit: rep4.status, stdout: redact(rep4.stdout), stderr: redact(rep4.stderr) };
  const un = spawnSync(process.execPath, [path.join('jev', 'install.js'), '--uninstall'], { cwd: outer, env, encoding: 'utf8', timeout: 30000 });
  out.uninstall = { exit: un.status, stdout: redact(un.stdout), stderr: redact(un.stderr) };
  out.temp_settings_after = fs.existsSync(settings) ? sha(fs.readFileSync(settings)) : null;
  out.settings_restored_byte_for_byte = out.temp_settings_after === out.temp_settings_before;
  out.calls = callsSoFar(env);
  out.ledger_rows = readLines(path.join(ledgerDirOf(env), 'jev.jsonl'));
  out.log_lines = readLines(path.join(ledgerDirOf(env), 'jev.log'));
  out.real_after = realSnapshot();
  out.real_unchanged = JSON.stringify(out.real_before) === JSON.stringify(out.real_after);
  say(JSON.stringify(out, null, 1));
  if (!a.keep) fs.rmSync(root, { recursive: true, force: true });
  return 0;
}

if (require.main === module) main().then((c) => process.exit(c), (e) => { say(`FAILED: ${e.message}`); process.exit(1); });
module.exports = { redact, isolatedEnv, realSnapshot };
