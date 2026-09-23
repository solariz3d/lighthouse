#!/usr/bin/env node
'use strict';
/* jev/install.js — register Jev's two hooks in ~/.claude/settings.json, and take them out again (D123, standalone Jev
 * batch 2, pane B; the design is exo_memory/loop/jev_standalone_design_2026-09-23.md, the plan
 * exo_memory/loop/jev_batch2_plan_2026-09-23.md).
 *
 *   node jev/install.js               register: Stop → jev/bin/jev-judge.js, UserPromptSubmit → jev/bin/jev-flags.js
 *   node jev/install.js --uninstall   take exactly those two out again
 *
 * IT MERGES, NEVER REPLACES. The file is parsed, Jev's two entries are added as their OWN groups at the end of their events,
 * and everything else is carried over as it was: every other key, every other event, every foreign group. It is written
 * back in the file's own layout (its indent, its line endings, its trailing newline, a BOM if it had one), so on a file in
 * the usual 2-space JSON layout the foreign text is byte-for-byte what it was.
 *
 * WHICH ENTRIES ARE JEV'S: a hook whose command or args name THIS checkout's script by its absolute path. Never by file
 * name — the room's own `hooks\jev-flags.js` (a different file with the same name) is registered on the machines this
 * was built on, and a leaf-name match would re-point or remove it. The price, stated: an install made from a checkout
 * that has since MOVED is not recognised as Jev's; uninstall it from where it was, or by hand.
 *
 * THE ENTRY IS EXEC FORM: `{ type: "command", command: <node's absolute path>, args: [<script>], timeout: 10 }`. The hooks
 * docs (code.claude.com/docs/en/hooks, read 2026-09-23): with `args` set, Claude Code "spawns it directly with args as
 * the argument vector. There is no shell ... No shell tokenization happens on any platform." That is the any-OS answer:
 * hooks otherwise run through Git Bash on Windows and through PowerShell "only when Git Bash isn't installed", and in
 * PowerShell a command line that STARTS with a quoted path is a string, not a call — the room's own
 * `"node.exe" "script"` form works on its machines only because Git Bash is there. The docs state no minimum version for
 * `args`; that it works on the Claude Code a given machine runs is NOT verified here (no install into a real ~/.claude).
 *
 * IDEMPOTENT: a second install finds both entries as they should be and WRITES NOTHING (the file's bytes and mtime are
 * untouched, and no backup is made). An entry that is Jev's but differs (node moved, timeout edited) is re-pointed in place.
 *
 * REVERSIBLE: before any write, the file is copied to `settings.json.bak-jev-<stamp>` beside it (the room's own
 * installer's rule), and the FIRST install records which backup holds the pre-install file in `~/.jev/install.json`
 * (the path only, never the content — settings.json can hold secrets, and they are not copied out of ~/.claude). Uninstall
 * removes Jev's entries, and when what is left is exactly the pre-install file's content, writes the pre-install BYTES
 * back — a byte-exact restore. When the user has changed the file since, what is left is written in the file's layout
 * and the run says the restore was not byte-exact. A settings.json that did not exist before the install is removed again
 * when nothing but Jev's entries was ever put in it.
 *
 * REFUSALS ARE LOUD (exit 1) AND WRITE NOTHING: no `~/.claude` directory (Claude Code has not run for this user); a
 * settings.json that does not parse, or whose `hooks` / event values are not the shapes the docs give — it is the user's
 * file to fix, never this script's to rewrite. A write that does not read back as the same JSON is undone from the backup.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const JEV_DIR = __dirname;
const TIMEOUT_S = 10;
const HOOKS = [
  { event: 'Stop', script: path.join(JEV_DIR, 'bin', 'jev-judge.js') },
  { event: 'UserPromptSubmit', script: path.join(JEV_DIR, 'bin', 'jev-flags.js') },
];

class InstallError extends Error { constructor(m) { super(m); this.name = 'InstallError'; } }

const isWin = (platform) => platform === 'win32';
const norm = (p, platform) => {
  const s = String(p).replace(/\\/g, '/');
  return isWin(platform) ? s.toLowerCase() : s;
};

/** Does this hook entry run THIS checkout's `script`? Exact path, in `args` or anywhere in the command line. */
function isOurs(entry, script, platform) {
  if (!entry || typeof entry !== 'object') return false;
  const want = norm(script, platform);
  if (Array.isArray(entry.args) && entry.args.some((a) => typeof a === 'string' && norm(a, platform) === want)) return true;
  return typeof entry.command === 'string' && norm(entry.command, platform).includes(want);
}

/** The file's own layout, so what is written back looks like what was read. */
function layoutOf(text) {
  const bom = text.startsWith('\uFEFF');
  const body = bom ? text.slice(1) : text;
  const m = /\r?\n([ \t]+)\S/.exec(body);
  return { bom, eol: body.includes('\r\n') ? '\r\n' : '\n', indent: m ? m[1] : '  ', trailing: /\n$/.test(body) };
}

function render(obj, layout) {
  let s = JSON.stringify(obj, null, layout.indent);
  if (layout.eol === '\r\n') s = s.replace(/\n/g, '\r\n');
  if (layout.trailing) s += layout.eol;
  return (layout.bom ? '\uFEFF' : '') + s;
}

/** Parse, or refuse naming the defect. Checks the shapes the docs give for the parts this script touches. */
function parseSettings(text, file) {
  let obj;
  try { obj = JSON.parse(text.replace(/^\uFEFF/, '')); } catch (e) {
    throw new InstallError(`${file} does not parse as JSON (${e.message}) — refusing, nothing written. Fix it first.`);
  }
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) throw new InstallError(`${file} is not a JSON object — refusing, nothing written.`);
  if ('hooks' in obj) {
    const h = obj.hooks;
    if (h === null || typeof h !== 'object' || Array.isArray(h)) throw new InstallError(`${file}: "hooks" is not an object — refusing, nothing written.`);
    for (const { event } of HOOKS) {
      if (event in h && !Array.isArray(h[event])) throw new InstallError(`${file}: "hooks.${event}" is not an array of groups — refusing, nothing written.`);
      for (const g of h[event] || []) {
        if (!g || typeof g !== 'object' || (g.hooks !== undefined && !Array.isArray(g.hooks))) {
          throw new InstallError(`${file}: a group in "hooks.${event}" is not { hooks: [...] } — refusing, nothing written.`);
        }
      }
    }
  }
  return obj;
}

function wantEntry(script, nodePath) {
  return { type: 'command', command: nodePath, args: [script], timeout: TIMEOUT_S };
}

const sameEntry = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function paths(home) {
  if (typeof home !== 'string' || !home) throw new InstallError('no home directory given');
  const claudeDir = path.join(home, '.claude');
  return { claudeDir, settings: path.join(claudeDir, 'settings.json'), state: path.join(home, '.jev', 'install.json') };
}

function stamp(now) {
  return now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
}

/** Write `text` to `file` via a temp file and a rename, then read it back; undo from `backup` if it does not match. */
function writeChecked(file, text, expectObj, backup) {
  const tmp = `${file}.${process.pid}.jev-tmp`;
  fs.writeFileSync(tmp, text);
  fs.renameSync(tmp, file);
  let back;
  try { back = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); } catch { back = undefined; }
  if (!sameEntry(back, expectObj)) {
    if (backup) fs.copyFileSync(backup, file); else fs.rmSync(file, { force: true });
    throw new InstallError(`the written ${file} did not read back as intended — ${backup ? `restored from ${backup}` : 'removed again'}; nothing changed.`);
  }
}

/**
 * Register both hooks. `home` has NO default on purpose: only the CLI passes the real one, so no test and no caller can
 * reach a real ~/.claude by leaving an argument out. Returns { changed, added, repointed, already, notes, settings, backup }.
 */
function install({ home, nodePath = process.execPath, platform = process.platform, now = new Date() } = {}) {
  const p = paths(home);
  if (!fs.existsSync(p.claudeDir)) throw new InstallError(`${p.claudeDir} does not exist — Claude Code has not been run for this user. Refusing, nothing written.`);
  const existed = fs.existsSync(p.settings);
  const text = existed ? fs.readFileSync(p.settings, 'utf8') : null;
  const obj = existed ? parseSettings(text, p.settings) : {};
  const layout = existed ? layoutOf(text) : { bom: false, eol: '\n', indent: '  ', trailing: true };
  const res = { changed: false, added: 0, repointed: 0, already: 0, notes: [], settings: p.settings, backup: null };

  if (!obj.hooks) obj.hooks = {};
  for (const { event, script } of HOOKS) {
    const want = wantEntry(script, nodePath);
    const groups = obj.hooks[event] || (obj.hooks[event] = []);
    let found = false;
    for (const g of groups) {
      for (let i = 0; i < (g.hooks || []).length; i++) {
        const h = g.hooks[i];
        if (isOurs(h, script, platform)) {
          if (found) continue;
          found = true;
          if (sameEntry(h, want)) res.already++;
          else { g.hooks[i] = want; res.repointed++; }
        } else if (h && (typeof h.command === 'string' || Array.isArray(h.args))
          && new RegExp(`[\\\\/]${path.basename(script).replace('.', '\\.')}\\b`).test([h.command, ...(h.args || [])].join(' '))) {
          res.notes.push(`another ${path.basename(script)} is already registered on ${event} (${h.command}${h.args ? ' ' + h.args.join(' ') : ''}) — left as it is; both will run`);
        }
      }
    }
    if (!found) { groups.push({ hooks: [want] }); res.added++; }
  }
  if (!res.added && !res.repointed) return res;

  if (existed) {
    res.backup = `${p.settings}.bak-jev-${stamp(now)}`;
    fs.copyFileSync(p.settings, res.backup);
  }
  writeChecked(p.settings, render(obj, layout), obj, res.backup);
  res.changed = true;
  // Recorded AFTER the write, and only by the first install: a record must never claim an install that did not land,
  // and a second install must not overwrite which backup holds the PRE-install file.
  if (!fs.existsSync(p.state)) {
    fs.mkdirSync(path.dirname(p.state), { recursive: true });
    fs.writeFileSync(p.state, JSON.stringify({ settings: p.settings, existed, backup: res.backup, installed_at: now.toISOString() }, null, 2) + '\n');
  }
  return res;
}

/** Take Jev's entries out. Returns { changed, removed, restored: 'bytes'|'removed-file'|'structural'|null, settings, backup }. */
function uninstall({ home, platform = process.platform, now = new Date() } = {}) {
  const p = paths(home);
  const res = { changed: false, removed: 0, restored: null, settings: p.settings, backup: null };
  if (!fs.existsSync(p.settings)) return res;
  const text = fs.readFileSync(p.settings, 'utf8');
  const obj = parseSettings(text, p.settings);
  let state = null;
  try { state = JSON.parse(fs.readFileSync(p.state, 'utf8')); } catch { state = null; }
  const pre = state && state.settings && norm(state.settings, platform) === norm(p.settings, platform) ? state : null;
  let preText = null;
  if (pre && pre.backup) { try { preText = fs.readFileSync(pre.backup, 'utf8'); } catch { preText = null; } }
  let preObj;
  try { preObj = preText == null ? undefined : JSON.parse(preText.replace(/^\uFEFF/, '')); } catch { preObj = undefined; }
  // A container Jev's removal leaves empty is pruned — unless the pre-install file had it, so an empty `"hooks": {}` or
  // `"Stop": []` the user had before comes back as it was.
  const preHooks = preObj && preObj.hooks && typeof preObj.hooks === 'object' ? preObj.hooks : null;

  if (obj.hooks) {
    for (const { event, script } of HOOKS) {
      const groups = obj.hooks[event];
      if (!Array.isArray(groups)) continue;
      const kept = [];
      for (const g of groups) {
        if (!Array.isArray(g.hooks)) { kept.push(g); continue; }
        const before = g.hooks.length;
        g.hooks = g.hooks.filter((h) => !isOurs(h, script, platform));
        res.removed += before - g.hooks.length;
        const emptiedByUs = before > g.hooks.length && g.hooks.length === 0
          && Object.keys(g).every((k) => k === 'hooks' || k === 'matcher');
        if (!emptiedByUs) kept.push(g);
      }
      obj.hooks[event] = kept;
      if (!kept.length && !(preHooks && event in preHooks)) delete obj.hooks[event];
    }
    if (!Object.keys(obj.hooks).length && !(preObj && 'hooks' in preObj)) delete obj.hooks;
  }
  if (!res.removed) return res;

  res.backup = `${p.settings}.bak-jev-${stamp(now)}`;
  fs.copyFileSync(p.settings, res.backup);
  if (pre && pre.existed === false && !Object.keys(obj).length) {
    fs.rmSync(p.settings);
    res.restored = 'removed-file';
  } else {
    if (preText != null && sameEntry(preObj, obj)) {
      writeChecked(p.settings, preText, obj, res.backup);
      res.restored = 'bytes';
    } else {
      writeChecked(p.settings, render(obj, layoutOf(text)), obj, res.backup);
      res.restored = 'structural';
    }
  }
  if (pre) fs.rmSync(p.state, { force: true });
  res.changed = true;
  return res;
}

function main(argv = process.argv.slice(2)) {
  const bad = argv.filter((a) => a !== '--uninstall');
  if (bad.length) { process.stderr.write(`jev install: unknown argument ${JSON.stringify(bad[0])} — usage: node jev/install.js [--uninstall]\n`); return 1; }
  try {
    const home = os.homedir();
    if (argv.includes('--uninstall')) {
      const r = uninstall({ home });
      if (!r.changed) process.stdout.write(`jev uninstall: no Jev hook registered in ${r.settings} — nothing changed.\n`);
      else process.stdout.write(`jev uninstall: removed ${r.removed} hook(s) from ${r.settings}. `
        + ({ bytes: 'Restored the pre-install file byte for byte.', 'removed-file': 'The file did not exist before the install and held nothing else: removed.',
          structural: 'The file has changed since the install, so this is NOT a byte-exact restore: only Jev\'s entries were taken out.' })[r.restored]
        + ` Backup of the file as it was: ${r.backup}\n`);
    } else {
      const r = install({ home });
      for (const n of r.notes) process.stdout.write(`jev install: note — ${n}\n`);
      if (!r.changed) process.stdout.write(`jev install: already registered in ${r.settings} (${r.already} hook(s) verified) — nothing changed.\n`);
      else process.stdout.write(`jev install: ${r.added} added, ${r.repointed} re-pointed, ${r.already} already right, in ${r.settings}.`
        + (r.backup ? ` Backup: ${r.backup}` : ' (the file did not exist and was created)') + '\n'
        + 'Judged turns are sent to the Vercel AI Gateway with the key in AI_GATEWAY_API_KEY. Opt a project out with a .jev-off file. Undo: node jev/install.js --uninstall\n');
    }
    return 0;
  } catch (e) {
    process.stderr.write(`jev install: ${e instanceof InstallError ? 'REFUSED' : 'FAILED'} — ${e.message}\n`);
    return 1;
  }
}

module.exports = { install, uninstall, isOurs, layoutOf, render, parseSettings, wantEntry, writeChecked, HOOKS, InstallError, TIMEOUT_S };

if (require.main === module) process.exitCode = main();
