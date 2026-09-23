'use strict';
// jev/lib/config.js — Jev's configuration, resolved PURELY from what the caller passes (L114, pane C; the design is
// exo_memory/loop/jev_standalone_design_2026-09-23.md, e1b3eb6).
//
//   load({ env, home, cwd, platform? }) → { judge, optedOut, optedOutBy, sessions, ledgerDir, gateway: { url, model },
//                                          rubricPath, audience, dream }
//
// PURE OVER ITS ARGUMENTS. `env`, `home` and `cwd` come from the caller; nothing here reads the process environment or
// asks the OS for a home directory, so a test (or Consonance) can hand it any world. It does read the filesystem it is
// pointed at: `<home>/.jev/config.json`, and a `.jev-off` marker in `cwd` or any ancestor. `platform` picks the per-OS
// defaults and path rules; it is optional only so a caller following the three-argument contract still works, and then
// falls back to the running platform.
//
// THE KEY IS NOT CONFIG. `load` never reads the gateway key and never returns one; a key-like field in the config file is
// REFUSED, loudly, without its value in the message (the key lives in AI_GATEWAY_API_KEY, read only by ask.js).
//
// A CONFIG THAT CANNOT BE READ AS WRITTEN FAILS LOUDLY, naming the file: invalid JSON, a wrong type, a value outside its
// set, a relative path, an http gateway, or an unknown key (a typo that silently did nothing would be the worst case: the
// user thinks they opted out). Only an ABSENT file means "all defaults".
//
// DEFAULTS, per the design:
//   judge      'all'       — every Claude Code session (the keeper's decision). 'listed' judges only `sessions` (ids).
//   optedOut   false       — true when a `.jev-off` file sits in cwd or any ancestor up to and including the filesystem
//                             root, or cwd is inside a directory named in the config's `optOut` list. `optedOutBy` says
//                             which, so "why wasn't this judged" has an answer.
//   ledgerDir  per OS      — ledgers are STATE: append-only rows that must outlive a restart but are not user documents
//                             or cache. So: Windows %LOCALAPPDATA%\jev (local, not roaming — today's Jev store already
//                             lives under %LOCALAPPDATA%, design item 8), macOS ~/Library/Application Support/jev (Apple's
//                             place for app-created data), Linux $XDG_STATE_HOME/jev or ~/.local/state/jev (the XDG spec's
//                             home for "state data that should persist between restarts", which names logs and history;
//                             a relative XDG value is ignored, as the spec requires).
//   gateway    the Vercel AI Gateway evaluate route and `typesafe-ai/jev`, today's constants (consonance/tools/jev-ask.js).
//   rubricPath the shipped jev/METHOD.md, vendored there by A in L114 (design item 6: METHOD.md shipped, swappable).
//   audience   'session'   — a marked turn surfaces in that same session (the keeper's decision); 'consonance' keeps the
//                             room's chair + librarian routing.
//   dream      false       — the dream guard (today's CONSONANCE_DREAM skip) is a switch, off outside Consonance.
//   sessions   []          — the list `judge: 'listed'` reads. NOT in the batch-1 contract's return shape, which has no
//                             place for the list 'listed' needs; added here and named in the hand-back.
const fs = require('fs');
const path = require('path');

const DEFAULT_GATEWAY = Object.freeze({ url: 'https://ai-gateway.vercel.sh/v1/evaluate', model: 'typesafe-ai/jev' });
const DEFAULT_RUBRIC = path.join(__dirname, '..', 'METHOD.md');   // jev/METHOD.md, where A vendored it (L114)
const OPT_OUT_FILE = '.jev-off';
const KEYS = new Set(['judge', 'sessions', 'optOut', 'ledgerDir', 'gateway', 'rubric', 'audience', 'dream']);
const SECRET_KEY = /^(key|api[-_]?key|ai_gateway_api_key|token|secret|password)$/i;

const pathFor = (platform) => (platform === 'win32' ? path.win32 : path.posix);

class ConfigError extends Error {}
const fail = (file, what) => { throw new ConfigError(`jev config ${file}: ${what}`); };

/** Is `child` the directory `parent` or inside it? Case-insensitive under win32 rules, as that filesystem is. A shared
 *  name PREFIX (`/a/proj` vs `/a/proj-other`) is not containment. */
function within(parent, child, platform) {
  const p = pathFor(platform);
  // path.win32.relative already compares case-insensitively (measured: relative("C:\\PROJ", "c:\\proj\\sub") is "sub"),
  // so the win32 rules come from choosing path.win32; a lower-casing step here was redundant (L114 mutant G13).
  const rel = p.relative(p.resolve(parent), p.resolve(child));
  return rel === '' || (!rel.startsWith('..') && !p.isAbsolute(rel));
}

/** The first `.jev-off` in `dir` or an ancestor, walking up to and including the filesystem root, else null. `exists`
 *  is injected so the walk itself can be tested; `load` passes the real fs. */
function findOptOutFile(dir, exists = fs.existsSync, p = path) {
  let d = p.resolve(dir);
  for (;;) {
    const f = p.join(d, OPT_OUT_FILE);
    if (exists(f)) return f;
    const up = p.dirname(d);
    if (up === d) return null;   // the root is its own parent: it was just checked, and the walk ends here
    d = up;
  }
}

function defaultLedgerDir({ env, home, platform }) {
  const p = pathFor(platform);
  if (platform === 'win32') return env.LOCALAPPDATA ? p.join(env.LOCALAPPDATA, 'jev') : p.join(home, 'AppData', 'Local', 'jev');
  if (platform === 'darwin') return p.join(home, 'Library', 'Application Support', 'jev');
  const xdg = env.XDG_STATE_HOME;
  return xdg && p.isAbsolute(xdg) ? p.join(xdg, 'jev') : p.join(home, '.local', 'state', 'jev');
}

/** A configured path: `~` expands against the home PASSED in; anything else must be absolute. */
function userPath(value, { file, key, home, platform }) {
  const p = pathFor(platform);
  if (typeof value !== 'string' || !value) fail(file, `"${key}" must be a non-empty path string`);
  if (value === '~' || value.startsWith('~/') || value.startsWith('~\\')) return p.join(home, value.slice(1));
  if (!p.isAbsolute(value)) fail(file, `"${key}" must be absolute or start with ~ (got a relative path, which would depend on where Jev happens to run)`);
  return p.normalize(value);
}

function readConfig(file) {
  let raw;
  try { raw = fs.readFileSync(file, 'utf8'); } catch (e) {
    if (e.code === 'ENOENT') return null;           // no file: every default
    fail(file, `cannot be read (${e.code || e.message})`);
  }
  let cfg;
  try { cfg = JSON.parse(raw.replace(/^\uFEFF/, '')); } catch (e) { fail(file, `is not valid JSON (${e.message}); fix or remove it — Jev will not guess`); }
  if (cfg === null || typeof cfg !== 'object' || Array.isArray(cfg)) fail(file, 'config must be a JSON object');
  return cfg;
}

function load({ env, home, cwd, platform } = {}) {
  if (typeof home !== 'string' || !home) throw new ConfigError('jev config: no home directory was passed to load()');
  if (typeof cwd !== 'string' || !cwd) throw new ConfigError('jev config: no cwd was passed to load()');
  const e = env || {};
  const plat = platform || process.platform;
  const p = pathFor(plat);
  const file = p.join(home, '.jev', 'config.json');
  const cfg = readConfig(file) || {};

  for (const k of Object.keys(cfg)) {
    if (SECRET_KEY.test(k)) fail(file, `"${k}" looks like a key. The key is not config: set AI_GATEWAY_API_KEY in the environment and remove it from this file`);
    if (!KEYS.has(k)) fail(file, `unknown key "${k}" (known: ${[...KEYS].join(', ')})`);
  }

  const out = {
    judge: 'all', optedOut: false, optedOutBy: null, sessions: [],
    ledgerDir: defaultLedgerDir({ env: e, home, platform: plat }),
    gateway: { ...DEFAULT_GATEWAY }, rubricPath: DEFAULT_RUBRIC, audience: 'session', dream: false,
  };

  if ('judge' in cfg) {
    if (cfg.judge !== 'all' && cfg.judge !== 'listed') fail(file, `"judge" must be "all" or "listed" (got ${JSON.stringify(cfg.judge)})`);
    out.judge = cfg.judge;
  }
  if ('sessions' in cfg) {
    if (!Array.isArray(cfg.sessions) || !cfg.sessions.every((s) => typeof s === 'string' && s)) fail(file, '"sessions" must be a list of session id strings');
    out.sessions = cfg.sessions.slice();
  }
  if ('ledgerDir' in cfg) out.ledgerDir = userPath(cfg.ledgerDir, { file, key: 'ledgerDir', home, platform: plat });
  if ('rubric' in cfg) out.rubricPath = userPath(cfg.rubric, { file, key: 'rubric', home, platform: plat });
  if ('gateway' in cfg) {
    const g = cfg.gateway;
    if (g === null || typeof g !== 'object' || Array.isArray(g)) fail(file, '"gateway" must be an object with "url" and/or "model"');
    for (const k of Object.keys(g)) {
      if (SECRET_KEY.test(k)) fail(file, `"gateway.${k}" looks like a key. The key is not config: set AI_GATEWAY_API_KEY in the environment and remove it from this file`);
      if (k !== 'url' && k !== 'model') fail(file, `unknown key "gateway.${k}" (known: url, model)`);
    }
    if ('url' in g) {
      if (typeof g.url !== 'string' || !/^https:\/\/[^\s]+$/.test(g.url)) fail(file, '"gateway.url" must be an https:// URL');
      out.gateway.url = g.url;
    }
    if ('model' in g) {
      if (typeof g.model !== 'string' || !g.model) fail(file, '"gateway.model" must be a non-empty string');
      out.gateway.model = g.model;
    }
  }
  if ('audience' in cfg) {
    if (cfg.audience !== 'session' && cfg.audience !== 'consonance') fail(file, `"audience" must be "session" or "consonance" (got ${JSON.stringify(cfg.audience)})`);
    out.audience = cfg.audience;
  }
  if ('dream' in cfg) {
    if (typeof cfg.dream !== 'boolean') fail(file, '"dream" must be true or false');
    out.dream = cfg.dream;
  }

  // OPT-OUT: the marker file first (it sits with the project), then the config list.
  const marker = findOptOutFile(cwd, fs.existsSync, p);
  if (marker) { out.optedOut = true; out.optedOutBy = `${OPT_OUT_FILE} at ${marker}`; }
  if ('optOut' in cfg) {
    if (!Array.isArray(cfg.optOut)) fail(file, '"optOut" must be a list of directories');
    const dirs = cfg.optOut.map((d, i) => userPath(d, { file, key: `optOut[${i}]`, home, platform: plat }));
    if (!out.optedOut) {
      const hit = dirs.find((d) => within(d, cwd, plat));
      if (hit) { out.optedOut = true; out.optedOutBy = `config optOut ${hit}`; }
    }
  }
  return out;
}

module.exports = { load, within, findOptOutFile, ConfigError, DEFAULT_GATEWAY, DEFAULT_RUBRIC, OPT_OUT_FILE };
