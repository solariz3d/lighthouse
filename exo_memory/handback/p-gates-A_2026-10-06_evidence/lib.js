// lib.js: helpers for the non-author look at E's gates (D248). Everything is planted in a temp dir under the scratchpad; the hooks are run the way Claude Code runs them: node <hook> with the payload on stdin.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const { spawnSync } = require('child_process');
const HOOKS = 'C:/Users/nname/Desktop/lighthouse/consonance/hooks';
const BASE = path.join(__dirname, 'work');
const data = path.join(BASE, '_data');
const mk = (...p) => { const d = path.join(BASE, ...p); fs.mkdirSync(d, { recursive: true }); return d; };
const write = (p, t = 'x') => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, t); return p; };
/** A junction (mklink /J) from `link` to `target` (a directory). */
const junction = (link, target) => { fs.mkdirSync(path.dirname(link), { recursive: true }); const r = spawnSync('cmd', ['/c', 'mklink', '/J', link, target], { encoding: 'utf8' }); if (r.status !== 0) throw new Error('mklink: ' + (r.stdout || '') + (r.stderr || '')); return link; };
/** Run a hook file with a payload on stdin. Returns { status, out, err, ms, deny, reason }. env adds to a clean-ish environment; CONSONANCE_DATA points at the temp ledger dir. */
function hook(name, payload, env = {}, opts = {}) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [path.join(HOOKS, name + '.js')], { input: typeof payload === 'string' ? payload : JSON.stringify(payload), encoding: 'utf8', timeout: 20000, env: { ...process.env, CONSONANCE_DATA: data, CONSONANCE_DREAM: '', CONSONANCE_PANE: 'lookA', ...env }, ...opts });
  let deny = false, reason = null;
  try { const j = JSON.parse(r.stdout || 'null'); if (j && j.hookSpecificOutput && j.hookSpecificOutput.permissionDecision === 'deny') { deny = true; reason = j.hookSpecificOutput.permissionDecisionReason; } } catch (_) { /* not json */ }
  return { status: r.status, out: r.stdout || '', err: r.stderr || '', ms: Date.now() - t0, deny, reason, timedOut: r.error && r.error.code === 'ETIMEDOUT' };
}
const bash = (command, cwd, tool = 'Bash') => ({ tool_name: tool, tool_input: { command }, cwd, session_id: 'look-a', hook_event_name: 'PreToolUse' });
const rows = [];
const check = (id, what, got, expect, note = '') => { const ok = got === expect; rows.push({ id, what, got, expect, ok, note }); console.log(`${ok ? 'ok  ' : 'DIFF'} ${id} ${what}: ${got}${ok ? '' : `  (expected ${expect})`}${note ? '  | ' + note : ''}`); return ok; };
const verdict = (h) => (h.deny ? 'deny' : h.status === 0 && !h.out ? 'allow' : `other(status ${h.status}, out ${h.out.slice(0, 60)})`);
module.exports = { HOOKS, BASE, data, mk, write, junction, hook, bash, check, verdict, rows, fs, path, os, spawnSync };
