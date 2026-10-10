// release-chime.js - D281: a pleasant chime when a FINAL PRODUCT ships (the keeper, 2026-10-09 19:11: "you ding when the laps are complete, not like one if a new one
// opens, but when the final product is pushed, you ding through desktop audio even if minimized something pleasant"). Plan: exo_memory/loop/plan_release_chime_2026-10-09.md.
//
// A PostToolUse hook on Bash and PowerShell. It plays a built-in Windows sound through the default output device (System.Media.SoundPlayer: it does not care whether any
// window is minimized) when, and only when, a command that RAN was
//   - `gh release create` (not a --draft), that came back successful; or
//   - a `git push` that updated `main` on one of the product repos (t180, consonance, lighthouse), read from git's own report of the push ("To <url>" and the `a..b main -> main`
//     line), not from the command: `git push` with no arguments, `HEAD:main`, `-C <repo>`, `cd <repo> && git push` all work, and a push that changed nothing ("Everything up-to-date"),
//     was rejected, deleted a ref, sent a tag or went to another branch or repo does not.
// Not lap opens, dispatches, rings, commits, tests, or anything that only MENTIONS those words (an echo, a quoted string, a heredoc body, a commit message).
//
// ONE chime per 2 minutes (a push followed by a release chimes once); the state is <data dir>/release-chime.json. `"chime": false` in ~/.consonance.json silences it (absent = on);
// `"chime_sound"` is a .wav path (default: C:\Windows\Media\chimes.wav, found through %SystemRoot%; if it is missing, the next of a short list; if none, silence);
// `"chime_repos"` is the list of repo names a push to main must match (default t180, consonance, lighthouse; matched as a part of the remote URL's or the directory's name).
//
// FIRE AND FORGET: it never blocks, slows or fails the tool call. It prints NOTHING and exits 0 on every path; the audio is a detached hidden PowerShell that it does not wait
// for; a missing file, a missing PowerShell, a broken config, a data dir it cannot write, a payload it does not recognise, or its own bug (a 3 s watchdog) are silence.
// Every ship it recognises writes one row to <data dir>/release-chime.jsonl (chimed / debounced / silenced), never the command's text.
//
// NOT CAUGHT, and said so: a release or push run inside a nested shell or script (`bash -c "..."`, `node -e`, a .ps1 file); a push whose report git does not print (--quiet).
// TEST SEAMS: CONSONANCE_CHIME_STUB=<file> appends a line there instead of playing; the tests set it on every run, so no test ever makes a sound. CONSONANCE_CHIME_MEDIA=<dir> stands in
// for %SystemRoot%Media.
'use strict';

if (process.env.CONSONANCE_DREAM) process.exit(0);   // THE DREAM GATE (dream-gate.test.js): the gap-dream gets no hooks

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const LEDGER = 'release-chime.jsonl', STATE = 'release-chime.json';
const DEBOUNCE_MS = 2 * 60 * 1000, WATCHDOG_MS = 3000;
const SHELL_TOOLS = new Set(['Bash', 'PowerShell']);
const DEFAULT_REPOS = ['t180', 'consonance', 'lighthouse'];
const DEFAULT_SOUNDS = ['chimes.wav', 'Windows Notify System Generic.wav', 'notify.wav', 'ding.wav'];   // in %SystemRoot%\Media

const homeDir = () => process.env.USERPROFILE || os.homedir();
function config() { try { return JSON.parse(fs.readFileSync(path.join(homeDir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '')) || {}; } catch (_) { return {}; } }
/** `"chime": false` (also 0, "false", "off", "no") is off; absent, true or anything else is on. */
const isOff = (v) => v === false || v === 0 || (typeof v === 'string' && ['false', 'off', '0', 'no'].includes(v.trim().toLowerCase()));
/** The data dir by the app's rule: CONSONANCE_DATA, else ~/.consonance.json's data_dir, else %USERPROFILE%\.consonance. */
function dataDir(cfg) {
  const env = (process.env.CONSONANCE_DATA || '').trim(); if (env) return env;
  const d = typeof cfg.data_dir === 'string' ? cfg.data_dir.trim() : ''; if (d) return d;
  return path.join(homeDir(), '.consonance');
}
function record(dir, row) {
  try { fs.mkdirSync(dir, { recursive: true }); fs.appendFileSync(path.join(dir, LEDGER), JSON.stringify({ t: new Date().toISOString(), ...row }) + '\n'); return true; } catch (_) { return false; }
}

// ── reading the command (the helpers of push-gate.js, with a quote-aware splitter: a `;` or `&&` INSIDE quotes is text, not a new command) ──
/** Shell-ish words: a run of quoted and unquoted pieces with no space between them is ONE word, quotes stripped. */
function words(seg) { return (String(seg).match(/(?:"[^"]*"|'[^']*'|[^\s"'])+/g) || []).map((w) => w.replace(/"([^"]*)"|'([^']*)'/g, (_, a, b) => (a !== undefined ? a : b))); }
/** The command with heredoc and here-string BODIES taken out: they are text being written, not commands. */
function stripHeredocs(command) {
  const lines = String(command || '').split('\n'), out = [];
  for (let i = 0; i < lines.length;) {
    const l = lines[i++]; out.push(l);
    for (const m of l.matchAll(/<<(-?)\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\2/g)) { while (i < lines.length && (m[1] ? lines[i].replace(/^\t+/, '') : lines[i]).replace(/\r$/, '') !== m[3]) i++; i++; }
    const ps = /@(['"])\s*$/.exec(l);
    if (ps) { while (i < lines.length && !lines[i].startsWith(ps[1] + '@')) i++; if (i < lines.length) out.push(lines[i++].slice(2)); }
  }
  return out.join('\n');
}
/** Split on `&&`, `||`, `;`, `|` and newlines that are NOT inside single or double quotes (a backslash or a backtick escapes the next character inside double quotes). */
function splitSegments(command) {
  const segs = []; let cur = '', q = null;
  const s = String(command || '');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { cur += c; if (q === '"' && (c === '\\' || c === '`') && i + 1 < s.length) { cur += s[++i]; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === ';' || c === '\n' || c === '|' || (c === '&' && s[i + 1] === '&')) { if (c === '|' && s[i + 1] === '|') i++; else if (c === '&') i++; segs.push(cur); cur = ''; continue; }
    cur += c;
  }
  segs.push(cur);
  return segs.map((x) => x.trim()).filter(Boolean);
}
const LEADERS = new Set(['if', 'then', 'else', 'elif', 'while', 'until', 'do', '!', 'time', 'command', 'exec', 'nohup', 'builtin']);
/** The first real word of a segment's words: leading VAR=x assignments and shell keywords skipped. Returns the index, or -1. */
function leadIndex(w) { let i = 0; while (i < w.length && (/^[A-Za-z_][A-Za-z0-9_]*=/.test(w[i]) || LEADERS.has(w[i].toLowerCase()))) i++; return i < w.length ? i : -1; }

/** What the command runs that we care about: { release: { draft, repo }|null, push: { dir }|null }. A mention (echo, a quoted string, a heredoc body, a commit message) is not a run. */
function commandsOf(command) {
  const out = { release: null, push: null }; let dir = null;
  for (const seg of splitSegments(stripHeredocs(command))) {
    const w = words(seg), i = leadIndex(w); if (i < 0) continue;
    const lead = path.basename(w[i].replace(/\\/g, '/')).toLowerCase().replace(/\.exe$/, '');
    if (['cd', 'pushd', 'set-location', 'sl', 'chdir'].includes(lead)) { for (let k = i + 1; k < w.length; k++) { if (/^-(?:path|literalpath|lp)$/i.test(w[k])) { dir = w[k + 1] || dir; break; } if (!w[k].startsWith('-')) { dir = w[k]; break; } } continue; }
    if (lead === 'gh') {
      let repo = null; const rest = [];
      for (let k = i + 1; k < w.length; k++) { if (/^(?:-R|--repo)$/.test(w[k])) { repo = w[++k] || null; continue; } if (/^--repo=/.test(w[k])) { repo = w[k].slice(7); continue; } rest.push(w[k]); }
      const pos = rest.filter((x) => !x.startsWith('-'));
      if (pos[0] === 'release' && pos[1] === 'create' && !rest.some((x) => x === '--help' || x === '-h')) out.release = { draft: rest.some((x) => x === '--draft' || x === '-d'), repo, dir };
      continue;
    }
    if (lead === 'git') {
      let d = dir, k = i + 1;
      while (k < w.length && w[k].startsWith('-')) { if (w[k] === '-C' && w[k + 1]) { d = w[k + 1]; k += 2; } else if (w[k] === '-c' && w[k + 1]) k += 2; else k++; }
      // a push that only talks about pushing prints the same report and sends nothing: --dry-run / -n, --help / -h, and a delete
      if (w[k] === 'push' && !w.slice(k + 1).some((x) => x === '--dry-run' || x === '-n' || x === '--help' || x === '-h' || x === '--delete')) out.push = { dir: d };
    }
  }
  return out;
}

// ── reading what came back ──
/** All the text the tool returned, whatever its shape (git's report of a push is on stderr). */
function outputOf(resp) {
  if (resp == null) return '';
  if (typeof resp === 'string') return resp;
  if (typeof resp !== 'object') return String(resp);
  return ['stdout', 'stderr', 'output', 'content', 'text', 'result'].map((k) => (typeof resp[k] === 'string' ? resp[k] : Array.isArray(resp[k]) ? resp[k].map((x) => (x && typeof x.text === 'string' ? x.text : typeof x === 'string' ? x : '')).join('\n') : '')).filter(Boolean).join('\n');
}
/** A reason the call did NOT succeed, or null: a non-zero exit code under any of its names, an interrupt, an error flag or field. (No signal at all is not a failure: PostToolUse is the success event.) */
function failureOf(resp) {
  if (resp && typeof resp === 'object') {
    for (const k of ['exit_code', 'exitCode', 'returncode', 'returnCode', 'code', 'status']) if (typeof resp[k] === 'number' && resp[k] !== 0) return `${k} ${resp[k]}`;
    if (resp.interrupted === true) return 'interrupted';
    if (resp.is_error === true || resp.isError === true) return 'is_error';
    if (resp.error) return 'error';
  }
  return null;
}
const exitZero = (resp) => !!resp && typeof resp === 'object' && ['exit_code', 'exitCode', 'returncode', 'returnCode'].some((k) => resp[k] === 0);

/**
 * The ref updates git reports for a push, each with the remote it went to: [{ url, dst, ok }]. git prints "To <url>" and then one line per ref:
 *     abc1234..def5678  main -> main        fast-forward         + abc...def main -> main (forced update)     * [new branch]  main -> main
 *   ! [rejected]  main -> main (fetch first)     - [deleted]  main     = [up to date]  main -> main
 * `ok` is a ref that really moved (a range, or a new branch/reference); a tag, a deletion, a rejection, "up to date" and "Everything up-to-date" are not.
 */
function refUpdates(output) {
  const out = []; let url = null;
  for (const raw of String(output || '').split(/\r?\n/)) {
    const to = /^To\s+(\S+)/.exec(raw); if (to) { url = to[1]; continue; }
    const m = /^\s*([ +*!=-])?\s*(?:([0-9a-f]{7,40})(\.\.\.?)([0-9a-f]{7,40})|\[(new branch|new reference|new tag|forced update|up to date|rejected|remote rejected|deleted)\])\s+(\S+)\s+->\s+(\S+)(?:\s+\((.*)\))?\s*$/.exec(raw);
    if (!m) continue;
    const flag = m[1] || ' ', range = !!m[2], kind = m[5] || '', paren = (m[8] || '').toLowerCase();
    const moved = flag !== '!' && flag !== '=' && flag !== '-' && !/rejected|up to date|deleted|new tag/.test(kind) && !/rejected|fetch first|non-fast-forward|stale info/.test(paren) && (range || /new branch|new reference|forced update/.test(kind));
    out.push({ url, dst: m[7].replace(/^refs\/heads\//, ''), ok: moved });
  }
  return out;
}
const repoPart = (s) => String(s || '').replace(/\\/g, '/').replace(/\.git$/i, '').split(/[/:]/).filter(Boolean).slice(-1)[0] || '';
const matchesRepo = (name, repos) => { const n = String(name || '').toLowerCase(); return !!n && repos.some((r) => n.includes(String(r).toLowerCase())); };

/** Is this a final product shipping? -> { kind: 'release'|'push', repo } or null. */
function shipOf(command, resp, cfg = {}) {
  if (typeof command !== 'string' || !command) return null;
  const run = commandsOf(command); if (!run.release && !run.push) return null;
  if (failureOf(resp)) return null;
  const text = outputOf(resp);
  if (run.release && !run.release.draft) {
    const url = /https?:\/\/[^\s)"']+\/releases\/[^\s)"']*/.exec(text);
    if (exitZero(resp) || url) return { kind: 'release', repo: repoPart(url ? url[0].replace(/\/releases\/.*$/, '') : run.release.repo || run.release.dir) || null };
  }
  if (run.push) {
    const repos = Array.isArray(cfg.chime_repos) && cfg.chime_repos.length ? cfg.chime_repos : DEFAULT_REPOS;
    for (const u of refUpdates(text)) {
      if (!u.ok || u.dst !== 'main') continue;
      const name = repoPart(u.url) || repoPart(run.push.dir);
      if (matchesRepo(name, repos)) return { kind: 'push', repo: name || null };   // (git's own "To <url>" decides; the directory only when git printed no url)
    }
  }
  return null;
}

// ── the sound ──
function soundCandidates(cfg, env = process.env) {
  const media = (env.CONSONANCE_CHIME_MEDIA || '').trim() || (env.SystemRoot ? path.win32.join(env.SystemRoot, 'Media') : null);   // (the override is the tests': Node will not start on Windows with a fake SystemRoot)
  return [typeof cfg.chime_sound === 'string' && cfg.chime_sound.trim() ? cfg.chime_sound.trim() : null, ...(media ? DEFAULT_SOUNDS.map((f) => path.win32.join(media, f)) : [])].filter(Boolean);
}
const firstExisting = (list) => list.find((f) => { try { return fs.statSync(f).isFile(); } catch (_) { return false; } }) || null;
/** The PowerShell that plays a .wav to the end through the default output device. The path goes in single quotes, with ' doubled. */
function playerArgs(file) {
  return ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-Command', `(New-Object System.Media.SoundPlayer '${String(file).replace(/'/g, "''")}').PlaySync()`];
}
function powershell(env = process.env) {
  const p = env.SystemRoot ? path.win32.join(env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe') : null;
  return p && fs.existsSync(p) ? p : 'powershell.exe';
}
/** Play `file`, detached and unwaited. The stub appends a line to a file instead (the tests). Returns whether it was started. */
function play(file) {
  const stub = (process.env.CONSONANCE_CHIME_STUB || '').trim();
  if (stub) { try { fs.appendFileSync(stub, JSON.stringify({ file }) + '\n'); return true; } catch (_) { return false; } }
  if (process.platform !== 'win32') return false;
  try { const c = spawn(powershell(), playerArgs(file), { detached: true, stdio: 'ignore', windowsHide: true }); c.on('error', () => {}); c.unref(); return true; } catch (_) { return false; }
}

// ── the debounce: one chime per 2 minutes, anchored at the last CHIME (a debounced ship does not extend it) ──
function lastChime(dir) { try { const t = Number(JSON.parse(fs.readFileSync(path.join(dir, STATE), 'utf8')).last); return Number.isFinite(t) ? t : 0; } catch (_) { return 0; } }
function markChime(dir, at) { try { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, STATE), JSON.stringify({ last: at })); return true; } catch (_) { return false; } }

function main() {
  setTimeout(() => process.exit(0), WATCHDOG_MS).unref();   // fail silent on a hang
  let payload; try { payload = JSON.parse(fs.readFileSync(0, 'utf8').replace(/^\uFEFF/, '')); } catch (_) { return process.exit(0); }
  if (!payload || !SHELL_TOOLS.has(payload.tool_name) || payload.tool_response == null) return process.exit(0);
  const command = payload.tool_input && payload.tool_input.command;
  if (typeof command !== 'string' || !/\brelease\b|\bpush\b/.test(command)) return process.exit(0);
  const cfg = config(); const ship = shipOf(command, payload.tool_response, cfg); if (!ship) return process.exit(0);
  const dir = dataDir(cfg), now = Date.now(), seat = (process.env.CONSONANCE_PANE || '').trim() || null, base = { seat, kind: ship.kind, repo: ship.repo };
  if (isOff(cfg.chime)) { record(dir, { ...base, decision: 'silenced', why: 'chime is off' }); return process.exit(0); }
  const last = lastChime(dir);
  if (now - last < DEBOUNCE_MS) { record(dir, { ...base, decision: 'debounced', sinceLastMs: now - last }); return process.exit(0); }
  const file = firstExisting(soundCandidates(cfg));
  if (!file) { record(dir, { ...base, decision: 'silenced', why: 'no sound file' }); return process.exit(0); }
  markChime(dir, now);
  const started = play(file);
  record(dir, { ...base, decision: started ? 'chimed' : 'silenced', ...(started ? {} : { why: 'could not start the player' }), sound: path.basename(file) });
  return setTimeout(() => process.exit(0), 50);   // let the detached child go; never wait for the sound
}

if (require.main === module) { try { main(); } catch (_) { process.exit(0); } }   // fail silent, without exception

module.exports = { DEBOUNCE_MS, DEFAULT_REPOS, DEFAULT_SOUNDS, words, stripHeredocs, splitSegments, commandsOf, outputOf, failureOf, refUpdates, shipOf, soundCandidates, playerArgs, powershell, isOff, dataDir };
