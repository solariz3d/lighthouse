// page.js (D461, pane E): the public app page (app/index.html of a fresh v0.4.19 clone) in headless Chrome, muted, titled zz-headless-test,
// with a stand-in for the native side that keeps every write inside this run's temp folder (a fake AC root and an export folder there).
// Exports start(), which returns { ev, shot, calls, errors, stop }. Nothing here touches the real AC folder, %APPDATA% or a visible window.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = 'G:\\consonance-scratch\\d461-stranger';
const REPO = path.join(ROOT, 'clone'), TMP = path.join(ROOT, 'tmp');
const { chromePath, launchChrome, connect } = require(path.join(REPO, 'app', 'test', 'soundrender.js'));
const TYPES = { '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.dds': 'application/octet-stream' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const AC = path.join(TMP, 'fake-ac'), EXPORT = path.join(TMP, 'export'), DATA = path.join(TMP, 'appdata');
const inside = (p) => { const r = path.resolve(p); if (!r.startsWith(TMP + path.sep)) throw new Error('refused, outside the temp folder: ' + r); return r; };
const autosaves = [];
const writeFiles =(dir, files) => { for (const f of files) { const p = inside(path.join(dir, f.path)); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, Buffer.from(f.data, 'base64')); } return files.length; };

// the native side, as far as a first hour needs it; everything else answers null and is logged
function native(cmd, a) {
  switch (cmd) {
    // as lib.rs answers on a machine where Steam finds AC and nothing is remembered yet (find_ac_root -> AcRootStatus; get_ac_root -> root_or_find)
    case 'find_ac_root': return { remembered: fs.existsSync(path.join(DATA, 'ac_root.txt')) ? fs.readFileSync(path.join(DATA, 'ac_root.txt'), 'utf8') : null, found: AC };
    case 'get_ac_root': return fs.existsSync(path.join(DATA, 'ac_root.txt')) ? fs.readFileSync(path.join(DATA, 'ac_root.txt'), 'utf8') : AC;
    case 'set_ac_root': { const r = inside(String(a.path || '')); fs.writeFileSync(path.join(DATA, 'ac_root.txt'), r); return r; }
    case 'test_export_folder': return EXPORT;
    case 'write_export': return writeFiles(inside(path.join(a.dir, a.folder)), a.files);
    case 'install_track': return writeFiles(path.join(AC, 'content', 'tracks', a.folder), a.files);
    case 'save_track': fs.writeFileSync(inside(path.join(DATA, 'tracks', a.name + '.t180track')), a.text); return null;
    case 'backup_track': return null;
    case 'list_tracks': return fs.readdirSync(path.join(DATA, 'tracks')).map((f) => f.replace(/\.t180track$/, ''));
    case 'open_track': return fs.readFileSync(inside(path.join(DATA, 'tracks', a.name + '.t180track')), 'utf8');
    case 'list_pieces': case 'list_track_backups': return [];
    case 'open_autosave': case 'open_library': case 'open_undo': return null;
    case 'save_autosave': autosaves.push(a.text); return null;
    case 'save_undo': case 'save_library': case 'clear_autosave': case 'append_input_log': return null;
    case 'folder_is_empty': return false;
    case 'get_see_it_setting': return false;
    default: return null;
  }
}

async function start({ width = 1400, height = 860 } = {}) {
  for (const d of [AC, EXPORT, DATA, path.join(DATA, 'tracks'), path.join(AC, 'content', 'tracks')]) fs.mkdirSync(d, { recursive: true });
  const calls = [], errors = [], logs = [];
  const srv = http.createServer((q, s) => {
    if (q.method === 'POST' && q.url.startsWith('/__native/')) {
      const cmd = decodeURIComponent(q.url.slice(10)); let body = '';
      q.on('data', (c) => { body += c; }); q.on('end', () => {
        let a = {}; try { a = body ? JSON.parse(body) : {}; } catch (e) { /* none */ }
        let out, err = null; try { out = native(cmd, a || {}); } catch (e) { err = String(e.message || e); }
        calls.push({ cmd, keys: Object.keys(a || {}), err, n: Array.isArray(a && a.files) ? a.files.length : undefined });
        s.writeHead(200, { 'content-type': 'application/json' }); s.end(JSON.stringify({ out: out === undefined ? null : out, err }));
      });
      return;
    }
    const p = path.normalize(path.join(REPO, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(REPO)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const CHROME = chromePath(); if (!CHROME) throw new Error('no Chrome');
  const { ch, dir, tgt } = await launchChrome(CHROME, [`--window-size=${width},${height}`, '--window-name=zz-headless-test'], 'zzheadless-');
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => {
    if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text);
    if (d.method === 'Runtime.consoleAPICalled' && /error|warn/.test(d.params.type)) logs.push(d.params.type + ': ' + d.params.args.map((x) => x.value !== undefined ? x.value : x.description).join(' ').slice(0, 300));
  });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error('page: ' + JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 800)); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  // before the page's scripts: the title, and a Tauri stand-in that forwards every call to this server
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
    const t = () => { try { document.title = 'zz-headless-test'; } catch (e) {} }; document.addEventListener('DOMContentLoaded', t); setInterval(t, 1000);
    const invoke = (cmd, args) => fetch('/__native/' + encodeURIComponent(cmd), { method: 'POST', body: JSON.stringify(args || {}) }).then((r) => r.json()).then((j) => { if (j.err) throw new Error(j.err); return j.out; });
    window.__TAURI__ = { core: { invoke }, event: { listen: () => Promise.resolve(() => {}) }, window: { getCurrentWindow: () => ({ minimize() {}, toggleMaximize() {}, close() {}, onCloseRequested: () => Promise.resolve(() => {}), listen: () => Promise.resolve(() => {}) }) } };
  })();` });
  await send('Page.navigate', { url: base + '/app/index.html' });
  const shot = async (name) => { const d = await send('Page.captureScreenshot', { format: 'png' }); const f = path.join(ROOT, 'shots', name + '.png'); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, Buffer.from(d.result.data, "base64")); return f; };
  const stop = async () => { try { ws.close(); } catch (e) { /* closed */ } ch.kill(); srv.close(); await sleep(500); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ } };
  return { ev, send, shot, calls, errors, logs, stop, base, sleep, AC, EXPORT, DATA, autosaves };
}
module.exports = { start, sleep, ROOT, TMP };
