// push-gate.js - G1, CREDENTIALS BEFORE A PUSH (D248; C's CLAUDE.md audit, exo_memory/handback/p-claudemd-C_2026-10-06.md "GATES"; the keeper delegated,
// the librarian ruled BUILD).
//
// A PreToolUse hook on Bash and PowerShell. When the command runs `git push`, it reads what the push would publish and DENIES it when any of those COMMITS
// ADDS a line that matches a credential shape. The deny names the FILE, the LINE, the COMMIT and the kind of key, and never the secret: a scan that printed the
// key would publish it to the transcript instead.
//   - what is scanned (the fix lap, from A's look, exo_memory/handback/p-gates-A_2026-10-06.md): EVERY COMMIT the remote does not have, each one's added lines,
//     `git log -p HEAD --not --remotes=<remote>`. Not the net diff: a key added in one commit and removed in the next is still in the history that is pushed
//     (A's H3). With no remote-tracking refs at all (the first push to an EMPTY remote, A's H1; a remote not called origin, A's H2) that is the whole history.
//   - which repo: the `cd` / `Set-Location` earlier in the same command, then `git -C <dir>`, then the hook's cwd (A's section 4: the Bash tool resets its cwd
//     every call, so `cd <repo> && git push` is how a sibling seat pushes).
//   - which remote and ref: `git push <remote> <src>[:<dst>]` as written; else the upstream's remote, else origin; else HEAD.
//   - heredoc and here-string BODIES are text, not commands, and are skipped (a script being written that mentions git push is not a push).
//
// WHY A GATE: `push-correct-work-dont-hold` and `privacy-means-credentials` both say "scan before every push", a remember-to-add rule, the class the D210 census
// measured at 0.000-0.052; the breach is outward and cannot be undone.
//
// FAILS OPEN on any error of its own (no git, not a repo, a git call that fails or passes its 6 s timeout, the 8 s watchdog, a payload it does not recognise): a
// hook bug must never trap a seat. Every decision is logged to <data dir>/push-gate.jsonl when there is one, with the file, line, commit and kind, never the line.
//
// NOT CAUGHT, and said so: a push run inside a script or a `node -e` string; a `cd` to a variable the command itself sets; a key shape not in KEYS; a key added
// in a merge commit's own resolution (merges are diffed against their first parent only).
'use strict';

if (process.env.CONSONANCE_DREAM) process.exit(0);   // THE DREAM GATE (dream-gate.test.js): the gap-dream gets no hooks

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const LEDGER = 'push-gate.jsonl';
const WATCHDOG_MS = 8000;
const SHELL_TOOLS = new Set(['Bash', 'PowerShell']);
// The shapes the packet names (vck_, sk-ant-, sk-or-, ghp_ and its siblings, AWS access keys, a private-key header), each with a minimum length so a word in prose
// ("the vck_ prefix") is not a key. The generic API_KEY=... shape the sources gate also carries is NOT here: on a diff it fires on every config example.
const KEYS = [
  { kind: 'openrouter key (sk-or-)', re: /\bsk-or-[A-Za-z0-9_-]{16,}/ },
  { kind: 'anthropic key (sk-ant-)', re: /\bsk-ant-[A-Za-z0-9_-]{16,}/ },
  { kind: 'gateway key (vck_)', re: /\bvck_[A-Za-z0-9_-]{16,}/ },
  { kind: 'github token (ghp_/gho_/ghu_/ghs_/ghr_/github_pat_)', re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}|\bgithub_pat_[A-Za-z0-9_]{22,}/ },
  { kind: 'aws access key (AKIA/ASIA)', re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/ },
  { kind: 'private key header', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];

function dataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try { const d = String((JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '')) || {}).data_dir || '').trim(); if (d) return d; } catch (_) { /* no config */ }
  return null;
}
function record(dir, row) {
  if (!dir) return false;
  try { fs.mkdirSync(dir, { recursive: true }); const fd = fs.openSync(path.join(dir, LEDGER), 'a'); fs.writeSync(fd, JSON.stringify({ t: new Date().toISOString(), ...row }) + '\n'); fs.fsyncSync(fd); fs.closeSync(fd); return true; } catch (_) { return false; }
}

// ── reading the command: the same helpers as delete-gate.js (each installed hook is self-contained, so they are copied, and tested in both) ──
/**
 * Where to look for Git's cygpath: on PATH first, then under THIS machine's Program Files folders, read from the variables Windows sets (D273 devreds: this was
 * two literal `C:/Program Files...` paths, which portable-paths.js flags because a Program Files on another drive would never be found). Same candidates, in the
 * same order, on a machine whose Program Files is on C:; no variable set means PATH only, never an invented drive.
 */
function cygpathCandidates(env = process.env) {
  const dirs = [env.ProgramFiles, env['ProgramFiles(x86)'], env.ProgramW6432].filter(Boolean);
  return ['cygpath', ...[...new Set(dirs)].map((d) => path.win32.join(d, 'Git', 'usr', 'bin', 'cygpath.exe'))];
}
/**
 * A path as the Bash tool writes it, made one a native Windows process can open (found live on 2026-10-06: `git -C /tmp/x push` read as C:\tmp\x, "not a git
 * repo", and the gate failed open): /c/Users/... is C:/Users/...; any other absolute MSYS path (/tmp/...) goes through Git's own cygpath -w. Elsewhere, and on
 * any failure, as written.
 */
function nativePath(p) {
  if (process.platform !== 'win32' || typeof p !== 'string' || !p.startsWith('/')) return p;
  const drive = /^\/([a-zA-Z])(\/.*)?$/.exec(p); if (drive) return `${drive[1].toUpperCase()}:${drive[2] || '/'}`;
  for (const exe of cygpathCandidates()) {
    try { const r = spawnSync(exe, ['-w', p], { encoding: 'utf8', timeout: 2000, windowsHide: true }); if (r.status === 0 && r.stdout.trim()) return r.stdout.trim(); } catch (_) { /* try the next */ }
  }
  return p;
}
/** Environment variables, from the hook's own environment: $env:NAME, ${NAME}, $NAME. Unknown ones stay as written. */
const expandEnv = (p) => String(p).replace(/\$env:([A-Za-z_][A-Za-z0-9_]*)|\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/gi, (m, a, b, c) => { const k = a || b || c, v = process.env[k] !== undefined ? process.env[k] : process.env[Object.keys(process.env).find((x) => x.toLowerCase() === k.toLowerCase())]; return v !== undefined ? v : m; });
const toPath = (p) => nativePath(expandEnv(p).replace(/^~(?=$|[\\/])/, os.homedir()));
/** Shell-ish words: a run of quoted and unquoted pieces with no space between them is ONE word, quotes stripped. */
function words(seg) { return (String(seg).match(/(?:"[^"]*"|'[^']*'|[^\s"'])+/g) || []).map((w) => w.replace(/"([^"]*)"|'([^']*)'/g, (_, a, b) => (a !== undefined ? a : b))); }
/**
 * The command with heredoc and here-string BODIES taken out (A's F3: they are text being written, not commands). Bash `<<WORD`, `<<'WORD'`, `<<-WORD` (the body
 * ends at a line that is the word, leading tabs allowed for <<-); PowerShell `@'` / `@"` at a line's end (the body ends at a line starting '@ / "@, whose rest is
 * a command again).
 */
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
/** The command's segments in order, each with the directory it runs in: a `cd` / `pushd` / `Set-Location` / `sl` / `chdir` moves the ones after it. */
function segments(command, cwd) {
  const out = []; let dir = path.resolve(cwd || process.cwd());
  for (const seg of stripHeredocs(command).split(/&&|\|\||[;|\n]/)) {
    const w = words(seg.trim()); if (!w.length) continue;
    const lead = w[0].toLowerCase();
    if (['cd', 'pushd', 'set-location', 'sl', 'chdir'].includes(lead)) {
      let arg = null;
      for (let i = 1; i < w.length; i++) { if (/^-(?:path|literalpath|lp)$/i.test(w[i])) { arg = w[i + 1]; break; } if (!w[i].startsWith('-')) { arg = w[i]; break; } }
      if (arg === null) dir = os.homedir(); else if (arg !== '-') dir = path.resolve(dir, toPath(arg));
      continue;
    }
    out.push({ words: w, dir });
  }
  return out;
}

/** The `git push` segments: [{ dir (the repo it runs in), remote (null: the default), src (null: HEAD) }]. */
function pushTargets(command, cwd) {
  const out = [];
  for (const s of segments(command, cwd)) {
    const w = s.words; let i = 0;
    while (i < w.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(w[i])) i++;   // VAR=x git push
    if (!/^git(?:\.exe)?$/i.test(w[i] || '')) continue;
    let dir = s.dir; i++;
    while (i < w.length && w[i].startsWith('-')) { if (w[i] === '-C' && w[i + 1]) { dir = path.resolve(dir, toPath(w[i + 1])); i += 2; } else if (w[i] === '-c' && w[i + 1]) i += 2; else i++; }
    if (w[i] !== 'push') continue;
    const rest = [];
    for (let k = i + 1; k < w.length; k++) { if (/^(?:-o|--push-option|--repo|--receive-pack|--exec)$/.test(w[k])) { k++; continue; } if (!w[k].startsWith('-')) rest.push(w[k]); }
    const src = rest[1] ? (rest[1].replace(/^\+/, '').split(':')[0] || null) : null;   // `:dst` deletes a remote ref: nothing of ours is sent
    out.push({ dir, remote: rest[0] || null, src, deleting: !!(rest[1] && /^\+?:/.test(rest[1])) });
  }
  return out;
}
const git = (dir, args) => { const r = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8', timeout: 6000, windowsHide: true, maxBuffer: 256 * 1024 * 1024 }); return r.status === 0 ? r.stdout : null; };
/** The remote a push goes to: the one written, else the upstream's, else origin (git's own default). */
function remoteOf(dir, written) {
  if (written) return written;
  const up = (git(dir, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}']) || '').trim();
  return up.includes('/') ? up.split('/')[0] : 'origin';
}
/** The added lines of every commit the remote does not have that match a key shape: [{ file, line, commit, kind }]. Never the text. */
function findKeys(log) {
  const hits = []; let commit = null, file = null, line = 0;
  for (const raw of String(log || '').split('\n')) {
    const l = raw.replace(/\r$/, '');
    if (l.startsWith('\u0000')) { commit = l.slice(1).trim(); file = null; continue; }
    if (l.startsWith('+++ ')) { file = l === '+++ /dev/null' ? null : l.replace(/^\+\+\+ (?:b\/)?/, ''); continue; }
    const h = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(l); if (h) { line = Number(h[1]); continue; }
    if (l.startsWith('+') && file) { const k = KEYS.find((x) => x.re.test(l.slice(1))); if (k) hits.push({ file, line, commit, kind: k.kind }); line++; continue; }
    if (l.startsWith(' ')) line++;
  }
  return hits;
}

function decide(command, cwd) {
  const targets = pushTargets(command, cwd);
  if (!targets.length) return { decision: 'not-a-push' };
  const found = [], scanned = [];
  for (const t of targets) {
    if (t.deleting) continue;
    if (git(t.dir, ['rev-parse', '--git-dir']) === null) return { decision: 'allow-error', error: 'not a git repo', dir: t.dir };
    const remote = remoteOf(t.dir, t.remote), src = t.src && git(t.dir, ['rev-parse', '-q', '--verify', `${t.src}^{commit}`]) !== null ? t.src : 'HEAD';
    const log = git(t.dir, ['log', '-p', '--no-color', '--no-ext-diff', '-U0', '--diff-merges=first-parent', '--format=%x00%h', src, '--not', `--remotes=${remote}`]);
    if (log === null) return { decision: 'allow-error', error: 'git log failed', dir: t.dir };
    scanned.push({ dir: t.dir, remote, src });
    for (const h of findKeys(log)) found.push({ ...h, repo: t.dir, remote });
  }
  return found.length ? { decision: 'deny', found, scanned } : { decision: 'allow', scanned };
}
const reasonOf = (found) => `push refused (G1, credentials before a push): ${found.length} line(s) this push would publish look like a credential (each commit's ADDED lines, so a key removed again in a later commit still counts: it is in the history):\n`
  + found.slice(0, 12).map((h) => `  ${h.file}:${h.line}  in ${h.commit}  (${h.kind})`).join('\n') + (found.length > 12 ? `\n  … and ${found.length - 12} more` : '')
  + `\nThe secret itself is not shown. Take it out of the history (rebase and edit or drop the commit that added it; amending only the last commit is not enough if an earlier one holds it), rotate the key if it was ever pushed, then push again. Scanned: every commit ${found[0].remote} does not have.`;

function emitDeny(reason) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } }), () => process.exit(0));
  setTimeout(() => process.exit(0), 1000).unref();
}
function main() {
  setTimeout(() => process.exit(0), WATCHDOG_MS).unref();   // fail OPEN on a hang
  let payload; try { payload = JSON.parse(fs.readFileSync(0, 'utf8')); } catch (_) { return process.exit(0); }
  if (!payload || !SHELL_TOOLS.has(payload.tool_name)) return process.exit(0);
  const command = payload.tool_input && payload.tool_input.command;
  if (typeof command !== 'string' || !/\bgit\b/.test(command) || !/\bpush\b/.test(command)) return process.exit(0);
  const dir = dataDir(), seat = (process.env.CONSONANCE_PANE || '').trim() || null;
  let d; try { d = decide(command, payload.cwd || process.cwd()); } catch (e) { record(dir, { seat, decision: 'error', error: String(e && e.message || e).slice(0, 120) }); return process.exit(0); }
  if (d.decision === 'not-a-push') return process.exit(0);
  record(dir, { seat, session: payload.session_id || null, cwd: payload.cwd || null, decision: d.decision, ...(d.error ? { error: d.error, dir: d.dir } : {}), ...(d.scanned ? { scanned: d.scanned } : {}), ...(d.found ? { found: d.found.slice(0, 50).map((h) => ({ file: h.file, line: h.line, commit: h.commit, kind: h.kind })) } : {}) });
  if (d.decision !== 'deny') return process.exit(0);
  return emitDeny(reasonOf(d.found));
}

if (require.main === module) { try { main(); } catch (_) { process.exit(0); } }   // fail OPEN, without exception

module.exports = { KEYS, LEDGER, pushTargets, segments, stripHeredocs, words, remoteOf, findKeys, decide, reasonOf, nativePath, cygpathCandidates, expandEnv };
