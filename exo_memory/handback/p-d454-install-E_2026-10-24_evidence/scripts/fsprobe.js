// fsprobe.js (D454 part 3, pane E): a --require preload for a hook under test. It logs every path the hook reads or writes, and every child process it
// would start, to PROBE_LOG. A write outside PROBE_ALLOW (a path prefix; empty = nothing may be written) is NOT made: it is logged as blocked and
// reported as done, so the hook goes on to its next step. Every child process is blocked (a hook can start `claude -p`, git, or a worker).
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const LOG = process.env.PROBE_LOG;
const ALLOW = (process.env.PROBE_ALLOW || '').toLowerCase().split('\\').join('/');
// the log's own fd, opened before anything is wrapped (fs.appendFileSync goes through the module's writeFileSync, which is wrapped below)
let logFd = null; try { if (LOG) logFd = fs.openSync(LOG, 'a'); } catch (_) { logFd = null; }
const real = { appendFileSync: (_p, s) => { if (logFd !== null) fs.writeSync(logFd, s); } };
const norm = (p) => { try { return path.resolve(String(p instanceof URL ? p.pathname : p)).split('\\').join('/'); } catch (_) { return String(p); } };
const DENY = (process.env.PROBE_DENYREAD || '').toLowerCase().split(String.fromCharCode(92)).join('/').split(';').filter(Boolean);
const denied = (p) => DENY.some((d) => norm(p).toLowerCase().startsWith(d));
const allowed = (p) => ALLOW && norm(p).toLowerCase().startsWith(ALLOW);
const log = (row) => { try { real.appendFileSync(LOG, JSON.stringify({ pid: process.pid, ...row }) + '\n'); } catch (_) { /* the log is the probe's own; never fail the hook */ } };
const isWriteFlag = (f) => typeof f === 'string' ? /[wax+]/.test(f) : typeof f === 'number' ? (f & 3) !== 0 : false;

function wrapRead(name) {
  const orig = fs[name]; if (typeof orig !== 'function') return;
  fs[name] = function (p, ...a) {
    if (typeof p === 'string' || p instanceof URL || Buffer.isBuffer(p)) {
      if (denied(p)) { log({ op: name, path: norm(p), denied: true }); if (name === 'existsSync') return false; const e = Object.assign(new Error('ENOENT: denied by fsprobe ' + norm(p)), { code: 'ENOENT' }); const cb = a.find((x) => typeof x === 'function'); if (cb) { setImmediate(() => cb(e)); return undefined; } throw e; }
      log({ op: name, path: norm(p) });
    }
    return orig.call(this, p, ...a);
  };
}
function wrapWrite(name, fake) {
  const orig = fs[name]; if (typeof orig !== 'function') return;
  fs[name] = function (p, ...a) {
    const target = typeof p === 'number' ? '<fd>' : norm(p);
    if (typeof p === 'number' || allowed(p)) { log({ op: name, path: target, w: true }); return orig.call(this, p, ...a); }
    log({ op: name, path: target, w: true, blocked: true });
    const cb = a.find((x) => typeof x === 'function'); if (cb) { setImmediate(() => cb(null)); return undefined; }
    return fake;
  };
}
for (const n of ['readFileSync', 'existsSync', 'statSync', 'lstatSync', 'readdirSync', 'readFile', 'stat', 'readdir', 'accessSync', 'realpathSync']) wrapRead(n);
for (const n of ['writeFileSync', 'appendFileSync', 'mkdirSync', 'renameSync', 'unlinkSync', 'rmSync', 'rmdirSync', 'copyFileSync', 'truncateSync', 'utimesSync',
  'writeFile', 'appendFile', 'mkdir', 'rename', 'unlink', 'rm', 'copyFile']) wrapWrite(n, undefined);
const origOpen = fs.openSync;
fs.openSync = function (p, flags, ...a) {
  const target = norm(p), w = isWriteFlag(flags === undefined ? 'r' : flags);
  if (!w) { if (denied(p)) { log({ op: 'openSync', path: target, denied: true }); throw Object.assign(new Error('ENOENT: denied by fsprobe ' + target), { code: 'ENOENT' }); } log({ op: 'openSync', path: target }); return origOpen.call(this, p, flags, ...a); }
  if (allowed(p)) { log({ op: 'openSync', path: target, w: true }); return origOpen.call(this, p, flags, ...a); }
  log({ op: 'openSync', path: target, w: true, blocked: true });
  return origOpen.call(this, process.platform === 'win32' ? '\\\\.\\NUL' : '/dev/null', 'w');
};
const origWS = fs.createWriteStream;
fs.createWriteStream = function (p, o) {
  if (allowed(p)) { log({ op: 'createWriteStream', path: norm(p), w: true }); return origWS.call(this, p, o); }
  log({ op: 'createWriteStream', path: norm(p), w: true, blocked: true }); return origWS.call(this, process.platform === 'win32' ? '\\\\.\\NUL' : '/dev/null', o);
};
// PROBE_CHILD=allow: children run (logged), for a gate whose decision needs git; they inherit NODE_OPTIONS, so a node child is probed too
for (const n of ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']) {
  const orig = cp[n]; if (typeof orig !== 'function') continue;
  cp[n] = function (file, args) {
    if (process.env.PROBE_CHILD === 'allow') { log({ op: 'child.' + n, cmd: String(file), args: Array.isArray(args) ? args.map(String) : undefined }); return orig.apply(this, arguments); }
    log({ op: 'child.' + n, cmd: String(file), args: Array.isArray(args) ? args.map(String) : undefined, blocked: true });
    if (n.endsWith('Sync')) return n === 'spawnSync' ? { status: 1, stdout: '', stderr: 'blocked by fsprobe', error: new Error('blocked by fsprobe') } : (() => { throw Object.assign(new Error('blocked by fsprobe'), { status: 1 }); })();
    const { EventEmitter } = require('events'); const e = new EventEmitter(); e.stdout = new EventEmitter(); e.stderr = new EventEmitter(); e.stdin = { write() {}, end() {}, on() {} }; e.unref = () => {}; e.kill = () => {}; e.pid = 0;
    setImmediate(() => { e.emit('error', new Error('blocked by fsprobe')); e.emit('close', 1); e.emit('exit', 1); }); return e;
  };
}
log({ op: 'probe-start', argv: process.argv.slice(1), allow: ALLOW });
