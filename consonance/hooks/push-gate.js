// push-gate.js - G1, CREDENTIALS BEFORE A PUSH (D248; C's CLAUDE.md audit, exo_memory/handback/p-claudemd-C_2026-10-06.md "GATES"; the keeper delegated,
// the librarian ruled BUILD).
//
// A PreToolUse hook on Bash and PowerShell. When the command runs `git push`, it reads what the push would publish and DENIES it when the diff ADDS a
// line that matches a credential shape. The deny names the FILE and LINE and the kind of key, and never the secret: a scan that printed the key would
// publish it to the transcript instead.
//   - what is scanned: `git diff @{upstream}..HEAD` in the repo the push runs in (`git -C <dir> push` or the hook's cwd). With no upstream: the diff
//     since the merge base of HEAD with origin's default branch (refs/remotes/origin/HEAD), else origin/main, else origin/master.
//   - only ADDED lines count (a key the diff removes is leaving, not arriving).
//
// WHY A GATE: `push-correct-work-dont-hold` and `privacy-means-credentials` both say "scan before every push", a remember-to-add rule, the class the D210 census
// measured at 0.000-0.052; the breach is outward and cannot be undone.
//
// FAILS OPEN on any error of its own (no git, not a repo, no base to diff against, a timeout under its 8 s watchdog, a payload it does not recognise): a hook bug
// must never trap a seat. Every decision is logged to <data dir>/push-gate.jsonl when there is one, with the file, line and kind, never the line's text.
//
// NOT CAUGHT, and said so: a push of a ref other than HEAD (`git push origin other-branch`) is scanned as HEAD; a push run inside a script or `node -e` string; a
// key shape not in KEYS. The deny reason says how to proceed once the line is fixed (amend or rewrite the commit; the scan reads commits, not the work tree).
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
  try { const d = String((JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '')) || {}).data_dir || '').trim(); if (d) return d; } catch (_) { /* no config */ }
  return null;
}
function record(dir, row) {
  if (!dir) return false;
  try { fs.mkdirSync(dir, { recursive: true }); const fd = fs.openSync(path.join(dir, LEDGER), 'a'); fs.writeSync(fd, JSON.stringify({ t: new Date().toISOString(), ...row }) + '\n'); fs.fsyncSync(fd); fs.closeSync(fd); return true; } catch (_) { return false; }
}

/** The command segments that run `git push`, and the repo each runs in (`git -C <dir>`, else null = the hook's cwd). Segments split on && || ; | and newlines. */
function pushTargets(command) {
  const out = [];
  for (const seg of String(command || '').split(/&&|\|\||[;|\n]/)) {
    const m = /(?:^|\s)git((?:\s+(?:-C\s+(?:"[^"]+"|'[^']+'|\S+)|-c\s+\S+|--\S+))*)\s+push\b/.exec(seg);
    if (!m) continue;
    const c = /-C\s+("([^"]+)"|'([^']+)'|(\S+))/.exec(m[1] || '');
    out.push({ dir: c ? (c[2] || c[3] || c[4]) : null });
  }
  return out;
}
/**
 * A path as the Bash tool writes it, made one a native Windows process can open (found live on 2026-10-06: `git -C /tmp/x push` read as C:\tmp\x, "not a git
 * repo", and the gate failed open). Git Bash hands NATIVE programs converted paths; a hook that reads the command text has to do the conversion itself:
 * /c/Users/... is C:/Users/...; any other absolute MSYS path (/tmp/..., /usr/...) goes through Git's own cygpath -w. Elsewhere, and on any failure, as written.
 */
function nativePath(p) {
  if (process.platform !== 'win32' || typeof p !== 'string' || !p.startsWith('/')) return p;
  const drive = /^\/([a-zA-Z])(\/.*)?$/.exec(p); if (drive) return `${drive[1].toUpperCase()}:${drive[2] || '/'}`;
  for (const exe of ['cygpath', 'C:/Program Files/Git/usr/bin/cygpath.exe', 'C:/Program Files (x86)/Git/usr/bin/cygpath.exe']) {
    try { const r = spawnSync(exe, ['-w', p], { encoding: 'utf8', timeout: 2000, windowsHide: true }); if (r.status === 0 && r.stdout.trim()) return r.stdout.trim(); } catch (_) { /* try the next */ }
  }
  return p;
}
const git = (dir, args) => { const r = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8', timeout: 6000, windowsHide: true, maxBuffer: 256 * 1024 * 1024 }); return r.status === 0 ? r.stdout : null; };
/** The base the push would publish from: the upstream, else the merge base with origin's default branch. Null when there is none (the gate fails open). */
function baseOf(dir) {
  if (git(dir, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}']) !== null) return { base: '@{upstream}', how: 'upstream' };
  for (const ref of [(git(dir, ['symbolic-ref', '-q', 'refs/remotes/origin/HEAD']) || '').trim(), 'refs/remotes/origin/main', 'refs/remotes/origin/master']) {
    if (!ref || git(dir, ['rev-parse', '-q', '--verify', ref]) === null) continue;
    const mb = (git(dir, ['merge-base', 'HEAD', ref]) || '').trim();
    if (mb) return { base: mb, how: `merge-base with ${ref.replace('refs/remotes/', '')}` };
  }
  return null;
}
/** The ADDED lines of `git diff <base>..HEAD` that match a key shape: [{ file, line, kind }]. Never the text. */
function findKeys(diff) {
  const hits = []; let file = null, line = 0;
  for (const raw of String(diff || '').split('\n')) {
    const l = raw.replace(/\r$/, '');
    if (l.startsWith('+++ ')) { file = l === '+++ /dev/null' ? null : l.replace(/^\+\+\+ (?:b\/)?/, ''); continue; }
    const h = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(l); if (h) { line = Number(h[1]); continue; }
    if (l.startsWith('+') && file) { const k = KEYS.find((x) => x.re.test(l.slice(1))); if (k) hits.push({ file, line, kind: k.kind }); line++; continue; }
    if (l.startsWith(' ')) line++;   // context (none with -U0, kept for safety)
  }
  return hits;
}

function decide(command, cwd) {
  const targets = pushTargets(command);
  if (!targets.length) return { decision: 'not-a-push' };
  const found = [];
  for (const t of targets) {
    const dir = t.dir ? path.resolve(cwd || '.', nativePath(t.dir.replace(/^~(?=$|[\\/])/, os.homedir()))) : (cwd || '.');
    if (git(dir, ['rev-parse', '--git-dir']) === null) return { decision: 'allow-error', error: 'not a git repo' };
    const b = baseOf(dir); if (!b) return { decision: 'allow-error', error: 'no upstream and no origin default branch to diff against' };
    const diff = git(dir, ['diff', '--no-color', '--no-ext-diff', '-U0', `${b.base}..HEAD`]); if (diff === null) return { decision: 'allow-error', error: 'git diff failed' };
    for (const h of findKeys(diff)) found.push({ ...h, repo: dir, base: b.how });
  }
  return found.length ? { decision: 'deny', found } : { decision: 'allow' };
}
const reasonOf = (found) => `push refused (G1, credentials before a push): ${found.length} line(s) this push would ADD look like a credential:\n`
  + found.slice(0, 12).map((h) => `  ${h.file}:${h.line}  (${h.kind})`).join('\n') + (found.length > 12 ? `\n  … and ${found.length - 12} more` : '')
  + `\nThe secret itself is not shown. Take it out of the commit (amend, or rebase and edit the commit that added it), rotate the key if it was ever pushed, then push again. Scanned: the diff since ${found[0].base}.`;

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
  record(dir, { seat, session: payload.session_id || null, cwd: payload.cwd || null, decision: d.decision, ...(d.error ? { error: d.error } : {}), ...(d.found ? { found: d.found.slice(0, 50).map((h) => ({ file: h.file, line: h.line, kind: h.kind })) } : {}) });
  if (d.decision !== 'deny') return process.exit(0);
  return emitDeny(reasonOf(d.found));
}

if (require.main === module) { try { main(); } catch (_) { process.exit(0); } }   // fail OPEN, without exception

module.exports = { KEYS, LEDGER, pushTargets, baseOf, findKeys, decide, reasonOf, nativePath };
