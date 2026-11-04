// P-UNIV-COLDREAD — THE ROUTE OF RECORD as code (D144, pane A, Registrar). Every isolated call in this study goes
// through callIsolated(), so the route is one function, not a recipe re-typed per script.
//
// The route (loop/univ_coldread_scorecard_2026-09-26_isolation.md, 2e963d5):
//   an empty temp cwd; CLAUDE_CONFIG_DIR -> an empty temp dir; CLAUDE_CODE_OAUTH_TOKEN from the User var
//   UNIV_ISOLATED_OAUTH_TOKEN, in the CHILD env only; claude -p … --setting-sources project --settings <file:
//   {"disableAllHooks":true,"claudeMdExcludes":[…]}> --tools "" --strict-mcp-config --mcp-config <file:
//   {"mcpServers":{}}> --no-session-persistence. JSON goes as FILES.
//
// ONE DEVIATION, and only for a subject's two turns: §5's second turn is `claude -c`, which continues the session
// the first turn saved, so a two-turn subject cannot pass --no-session-persistence. `persist: true` drops it and
// nothing else. Where that transcript lands is measured by the dry run (runner.js --dry-run), not assumed.
//
// THE TOKEN: read from the User registry var into memory, handed to the child's env, never printed, logged or
// written. Anything this module returns has every occurrence of it replaced by [REDACTED] before it leaves.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync, execFileSync } = require('child_process');

const CLAUDE = path.join(os.homedir(), '.local', 'bin', 'claude.exe');
const HOME_CLAUDE = path.join(os.homedir(), '.claude');

function token() {
  const t = execFileSync('powershell', ['-NoProfile', '-Command',
    "[Environment]::GetEnvironmentVariable('UNIV_ISOLATED_OAUTH_TOKEN','User')"], { encoding: 'utf8' }).trim();
  if (!t) throw new Error('UNIV_ISOLATED_OAUTH_TOKEN is not set as a User variable — refusing to call without the isolated login');
  return t;
}

/** The claudeMdExcludes the route verified: the user CLAUDE.md in both slash forms, and the user rules. */
function excludes() {
  const fwd = HOME_CLAUDE.replace(/\\/g, '/');
  return [`${fwd}/CLAUDE.md`, path.join(HOME_CLAUDE, 'CLAUDE.md'), `${fwd}/rules/**`];
}

/** A fresh isolation: an empty cwd, an empty config dir, and the two JSON files in a THIRD dir (never in the cwd). */
function isolation({ cwdClaudeMd } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'univ-iso-'));
  const cwd = path.join(root, 'cwd'), config = path.join(root, 'config'), files = path.join(root, 'files');
  for (const d of [cwd, config, files]) fs.mkdirSync(d);
  if (cwdClaudeMd) fs.writeFileSync(path.join(cwd, 'CLAUDE.md'), cwdClaudeMd);
  const settings = path.join(files, 'settings.json'), mcp = path.join(files, 'mcp.json');
  fs.writeFileSync(settings, JSON.stringify({ disableAllHooks: true, claudeMdExcludes: excludes() }));
  fs.writeFileSync(mcp, JSON.stringify({ mcpServers: {} }));
  return { root, cwd, config, settings, mcp };
}

// The parent's env with every CLAUDE_, ANTHROPIC_, CONSONANCE_ and MCP_ variable removed (the run-1 rig's scrub, widened).
function scrubbedEnv(iso, tok) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (/^(CLAUDE|ANTHROPIC|CONSONANCE|MCP_)/i.test(k)) continue;
    env[k] = v;
  }
  env.CLAUDE_CONFIG_DIR = iso.config;
  env.CLAUDE_CODE_OAUTH_TOKEN = tok;
  return env;
}

/**
 * One isolated call. `cont` adds -c (continue the cwd's last session); `persist` keeps the session so a later -c
 * can find it. Returns { code, stdout, stderr, ms } with the token redacted.
 */
function callIsolated(iso, prompt, { cont = false, persist = false, tok } = {}) {
  const t = tok || token();
  const args = ['-p', prompt];
  if (cont) args.unshift('-c');
  args.push('--setting-sources', 'project', '--settings', iso.settings, '--tools', '',
    '--strict-mcp-config', '--mcp-config', iso.mcp);
  if (!persist) args.push('--no-session-persistence');
  const t0 = Date.now();
  const r = spawnSync(CLAUDE, args, { cwd: iso.cwd, env: scrubbedEnv(iso, t), encoding: 'utf8', timeout: 600000, stdio: ['ignore', 'pipe', 'pipe'] });
  const red = (s) => String(s || '').split(t).join('[REDACTED]');
  return { code: r.status, stdout: red(r.stdout), stderr: red(r.stderr) + (r.error ? '\n' + red(r.error.message) : ''), ms: Date.now() - t0 };
}

/** The real user dirs this route must not touch — snapshotted before and compared after every script. */
function realFootprint() {
  const projects = path.join(HOME_CLAUDE, 'projects');
  const settings = path.join(HOME_CLAUDE, 'settings.json');
  const sha = require('crypto').createHash('sha256').update(fs.readFileSync(settings)).digest('hex');
  return { projects: new Set(fs.readdirSync(projects)), settingsSha: sha };
}
function footprintDiff(before, after) {
  return { newProjects: [...after.projects].filter((p) => !before.projects.has(p)), settingsChanged: before.settingsSha !== after.settingsSha };
}

module.exports = { callIsolated, isolation, token, excludes, realFootprint, footprintDiff, CLAUDE };
