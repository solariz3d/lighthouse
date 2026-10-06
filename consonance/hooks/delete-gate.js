// delete-gate.js - G2, JUNCTIONS BEFORE A DELETE (D248; C's CLAUDE.md audit, exo_memory/handback/p-claudemd-C_2026-10-06.md "GATES"; the keeper delegated, the
// librarian ruled BUILD).
//
// A PreToolUse hook on Bash and PowerShell. When the command deletes a tree, `git worktree remove <path>`, `rm` with -r / -R / --recursive, or `Remove-Item` (or
// rm / ri / del / rd / rmdir, its PowerShell aliases) with -Recurse, it walks each target WITHOUT following links and DENIES the command when the target is, or
// contains, a reparse point: a junction or a symbolic link. The deny names each one and where it points.
//
// WHY: memory `worktree-remove-follows-junctions` (main). On 2026-09-28 a worktree removal followed a junction and emptied the shared t180 `reads/` it pointed at.
// "copy-only worktrees, no junctions" was a rule, and it still needed a written memory after the fact: a remember-to-check rule, the class the D210 census
// measured near 0. Removing the LINK alone is safe (rmdir <link>, Remove-Item <link> without -Recurse), so the reason says to do that first.
//
// The walk is capped (200,000 entries) and inside the hook's 8 s watchdog. A tree too big to finish is ALLOWED and logged as unfinished: the gate fails open on
// its own limits, as on any error of its own. Every decision with a target is logged to <data dir>/delete-gate.jsonl.
//
// Read as the command runs (the fix lap, from A's look, exo_memory/handback/p-gates-A_2026-10-06.md): a relative target is resolved against the `cd` /
// `Set-Location` earlier in the same command (F1); a wildcard in a target's last part checks only the entries it matches (F2); heredoc and here-string BODIES
// are text, not commands, and are skipped (F3).
//
// NOT CAUGHT, and said so: a delete inside a script or a `node -e` string; a variable the command itself sets (`d=x; rm -rf $d`: environment variables ARE
// expanded, $env:NAME, ${NAME}, $NAME); cmd's `rmdir /s`; other deleting tools (robocopy /MIR, rimraf, fs.rmSync in code). A wildcard in an EARLIER part of a
// target checks the deepest folder above it. A chain that removes a link and then the tree in ONE command is refused (it is checked before any part runs).
'use strict';

if (process.env.CONSONANCE_DREAM) process.exit(0);   // THE DREAM GATE (dream-gate.test.js): the gap-dream gets no hooks

const fs = require('fs');
const os = require('os');
const path = require('path');

const LEDGER = 'delete-gate.jsonl';
const WATCHDOG_MS = 8000, WALK_MS = 6000, WALK_MAX = 200000;
const SHELL_TOOLS = new Set(['Bash', 'PowerShell']);

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

/** Shell-ish words of one segment: a word is a run of quoted and unquoted pieces with no space between them (`"a b"/*` is ONE word, `a b/*`), quotes stripped. */
function words(seg) { return (String(seg).match(/(?:"[^"]*"|'[^']*'|[^\s"'])+/g) || []).map((w) => w.replace(/"([^"]*)"|'([^']*)'/g, (_, a, b) => (a !== undefined ? a : b))); }
/** A path as written in the command, made one this process can open: environment variables, ~, and Git Bash's MSYS form (nativePath, expandEnv below). */
function toPath(p) { return nativePath(expandEnv(p).replace(/^~(?=$|[\\/])/, os.homedir())); }
/**
 * The command with heredoc and here-string BODIES taken out (A's F3: `cat > f.sh <<'EOF' … rm -rf … EOF` is a script being written, not a delete). Bash `<<WORD`,
 * `<<'WORD'`, `<<-WORD` (the body ends at a line that is the word, leading tabs allowed for <<-); PowerShell `@'` / `@"` at a line's end (the body ends at a line
 * starting '@ / "@, whose rest is a command again). The same function as push-gate.js.
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
/**
 * The command's segments in order, each with the directory it runs in (A's F1: the Bash tool resets its cwd every call, so `cd <dir> && rm -rf build` is how a
 * seat deletes, and `build` is the cd's, not the session's). A `cd` / `pushd` / `Set-Location` / `sl` / `chdir` moves the segments after it. Split on && || ; |
 * and newlines. The same function as push-gate.js.
 */
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
/** The trees a command deletes recursively: [{ how, target, base }]. `base` is the directory a relative target is read from: the segment's cd, then `git -C`. */
function deleteTargets(command, cwd) {
  const out = [];
  for (const s of segments(command, cwd)) {
    const w = s.words, lead = w[0].toLowerCase();
    // git [-C dir] worktree remove [-f|--force] <path>
    if (lead === 'git') {
      let i = 1, base = s.dir;
      while (i < w.length && w[i].startsWith('-')) { if (w[i] === '-C' && w[i + 1]) { base = path.resolve(s.dir, toPath(w[i + 1])); i += 2; } else i++; }
      if (w[i] === 'worktree' && w[i + 1] === 'remove') for (const a of w.slice(i + 2)) if (!a.startsWith('-')) out.push({ how: 'git worktree remove', target: a, base });
      continue;
    }
    // POSIX rm with a recursive flag (rm -r, -R, -rf, -fr, --recursive)
    if (lead === 'rm' || lead === '/bin/rm' || lead === '/usr/bin/rm') {
      const flags = w.slice(1).filter((a) => a.startsWith('-'));
      const posixRecursive = flags.some((f) => f === '--recursive' || (/^-[a-zA-Z]+$/.test(f) && /[rR]/.test(f)));
      const psRecursive = flags.some((f) => /^-rec(?:u(?:r(?:s(?:e)?)?)?)?$/i.test(f));   // PowerShell's rm is Remove-Item
      if (posixRecursive || psRecursive) for (const a of w.slice(1)) if (!a.startsWith('-')) out.push({ how: psRecursive ? 'Remove-Item -Recurse' : 'rm -r', target: a, base: s.dir });
      continue;
    }
    // PowerShell Remove-Item and its aliases, with -Recurse (any unique prefix: -r is ambiguous in PowerShell, so it is not counted; -rec and longer are)
    if (['remove-item', 'ri', 'del', 'erase', 'rd', 'rmdir'].includes(lead)) {
      const recursive = w.slice(1).some((a) => /^-rec(?:u(?:r(?:s(?:e)?)?)?)?$/i.test(a));
      if (!recursive) continue;
      for (let i = 1; i < w.length; i++) {
        const a = w[i];
        if (/^-(?:path|literalpath|lp)$/i.test(a) && w[i + 1]) { for (const p of w[i + 1].split(',')) out.push({ how: 'Remove-Item -Recurse', target: p.trim(), base: s.dir }); i++; continue; }
        if (a.startsWith('-')) { if (/^-(?:filter|include|exclude)$/i.test(a)) i++; continue; }
        for (const p of a.split(',')) if (p.trim()) out.push({ how: 'Remove-Item -Recurse', target: p.trim(), base: s.dir });
      }
    }
  }
  return out;
}
/**
 * The paths a target names (A's F2: `rm -rf logs/*.log` was refused for an unrelated junction elsewhere in logs/). A wildcard in the LAST part is matched against
 * that folder's entries, dot-entries included (PowerShell's * matches them), and only the matches are checked. A wildcard in an earlier part checks the deepest
 * folder above it, as before: rare, and the safe direction.
 */
function expandTarget(t, base) {
  const p = path.resolve(base || process.cwd(), toPath(t));
  if (!/[*?]/.test(p)) return [p];
  const dir = path.dirname(p), leaf = path.basename(p);
  if (/[*?]/.test(dir)) { let d = dir; while (/[*?]/.test(d)) d = path.dirname(d); return [d]; }
  const re = new RegExp('^' + leaf.replace(/[.+^${}()|\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i');
  let names; try { names = fs.readdirSync(dir); } catch (_) { return []; }
  return names.filter((n) => re.test(n)).map((n) => path.join(dir, n));
}
const isLink = (st) => st.isSymbolicLink();   // node reports a Windows JUNCTION as a symbolic link from lstat, as it does a symlink
const linkTarget = (p) => { try { return fs.readlinkSync(p); } catch (_) { return '?'; } };
/** Walk `root` without following links: the reparse points in it (the root itself included), or { unfinished } past the cap or the time. */
function reparsePoints(root, t0 = Date.now()) {
  const found = []; let seen = 0;
  let st; try { st = fs.lstatSync(root); } catch (_) { return { found, missing: true }; }
  if (isLink(st)) return { found: [{ path: root, to: linkTarget(root) }] };
  if (!st.isDirectory()) return { found };
  const stack = [root];
  while (stack.length) {
    if (++seen > WALK_MAX || Date.now() - t0 > WALK_MS) return { found, unfinished: true };
    const d = stack.pop(); let ents;
    try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch (_) { continue; }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isSymbolicLink()) { found.push({ path: p, to: linkTarget(p) }); continue; }
      if (e.isDirectory()) stack.push(p);
    }
  }
  return { found };
}
/**
 * A path as the Bash tool writes it, made one a native Windows process can open (the live check of push-gate.js on 2026-10-06 found `/tmp/x` read as C:\tmp\x
 * and the gate failing open; this gate resolves the same way): /c/Users/... is C:/Users/...; any other absolute MSYS path goes through Git's own cygpath -w.
 * Elsewhere, and on any failure, as written.
 */
function nativePath(p) {
  if (process.platform !== 'win32' || typeof p !== 'string' || !p.startsWith('/')) return p;
  const drive = /^\/([a-zA-Z])(\/.*)?$/.exec(p); if (drive) return `${drive[1].toUpperCase()}:${drive[2] || '/'}`;
  for (const exe of ['cygpath', 'C:/Program Files/Git/usr/bin/cygpath.exe', 'C:/Program Files (x86)/Git/usr/bin/cygpath.exe']) {
    try { const r = require('child_process').spawnSync(exe, ['-w', p], { encoding: 'utf8', timeout: 2000, windowsHide: true }); if (r.status === 0 && r.stdout.trim()) return r.stdout.trim(); } catch (_) { /* try the next */ }
  }
  return p;
}
/**
 * Environment variables in a target, expanded from the hook's own environment (the same user's): PowerShell's $env:NAME and the shell's ${NAME} and $NAME.
 * Found live on 2026-10-06: `Remove-Item -Recurse "$env:TEMP\x"` was read as a literal path that did not exist, and allowed unchecked. A variable the command
 * itself sets (`d=...; rm -rf $d`) is not in the environment and stays as written (NOT CAUGHT, in the header).
 */
const expandEnv = (p) => String(p).replace(/\$env:([A-Za-z_][A-Za-z0-9_]*)|\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/gi, (m, a, b, c) => { const k = a || b || c, v = process.env[k] !== undefined ? process.env[k] : process.env[Object.keys(process.env).find((x) => x.toLowerCase() === k.toLowerCase())]; return v !== undefined ? v : m; });

function decide(command, cwd) {
  const targets = deleteTargets(command, cwd);
  if (!targets.length) return { decision: 'not-a-delete' };
  const t0 = Date.now(), hits = [], checked = [];
  for (const t of targets) {
    let stop = false;
    for (const abs of expandTarget(t.target, t.base)) {
      const r = reparsePoints(abs, t0);
      checked.push({ how: t.how, target: abs, missing: !!r.missing, unfinished: !!r.unfinished, links: r.found.length });
      for (const f of r.found) hits.push({ how: t.how, target: abs, link: f.path, to: f.to });
      if (r.unfinished) { stop = true; break; }   // out of walk budget: what was found so far still counts
    }
    if (stop) break;
  }
  if (hits.length) return { decision: 'deny', checked, hits };   // a junction found is refused, whatever a later target's walk could not finish
  return { decision: checked.some((c) => c.unfinished) ? 'allow-unfinished' : 'allow', checked };
}
const reasonOf = (hits) => `delete refused (G2, junctions before a delete): the tree being removed holds ${hits.length} junction(s) or symlink(s). A recursive delete or \`git worktree remove\` can follow one and empty what it points to (memory worktree-remove-follows-junctions: the shared t180 reads/ was wiped this way on 2026-09-28):\n`
  + hits.slice(0, 12).map((h) => `  ${h.link}  ->  ${h.to}`).join('\n') + (hits.length > 12 ? `\n  … and ${hits.length - 12} more` : '')
  + `\nRemove each LINK first, in its OWN command and without recursing (cmd /c rmdir "<link>", or Remove-Item "<link>" with no -Recurse; the target stays untouched), then delete the tree in the next command. (A chain like \`rmdir link && rm -rf tree\` is checked before any of it runs, while the link is still there, so it is refused too.)`;

function emitDeny(reason) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } }), () => process.exit(0));
  setTimeout(() => process.exit(0), 1000).unref();
}
function main() {
  setTimeout(() => process.exit(0), WATCHDOG_MS).unref();   // fail OPEN on a hang
  let payload; try { payload = JSON.parse(fs.readFileSync(0, 'utf8')); } catch (_) { return process.exit(0); }
  if (!payload || !SHELL_TOOLS.has(payload.tool_name)) return process.exit(0);
  const command = payload.tool_input && payload.tool_input.command;
  if (typeof command !== 'string' || !/\b(?:rm|worktree|remove-item|ri|del|erase|rd|rmdir)\b/i.test(command)) return process.exit(0);
  const dir = dataDir(), seat = (process.env.CONSONANCE_PANE || '').trim() || null;
  let d; try { d = decide(command, payload.cwd || process.cwd()); } catch (e) { record(dir, { seat, decision: 'error', error: String(e && e.message || e).slice(0, 120) }); return process.exit(0); }
  if (d.decision === 'not-a-delete') return process.exit(0);
  record(dir, { seat, session: payload.session_id || null, cwd: payload.cwd || null, decision: d.decision, checked: d.checked.slice(0, 20), ...(d.hits && d.hits.length ? { hits: d.hits.slice(0, 50) } : {}) });
  if (d.decision !== 'deny') return process.exit(0);
  return emitDeny(reasonOf(d.hits));
}

if (require.main === module) { try { main(); } catch (_) { process.exit(0); } }   // fail OPEN, without exception

module.exports = { LEDGER, WALK_MAX, words, stripHeredocs, segments, deleteTargets, expandTarget, reparsePoints, decide, reasonOf, nativePath, expandEnv };
