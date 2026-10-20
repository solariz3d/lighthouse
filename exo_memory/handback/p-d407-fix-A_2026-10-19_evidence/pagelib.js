// pagelib.js: a headless Chrome on a served checkout of the builder (the real page), for D404's measurements. Not part of the repo.
const http = require('http'), fs = require('fs'), path = require('path');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.mp3': 'audio/mpeg' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** serve `repo` and start Chrome; opts.args extra Chrome flags, opts.size [w, h], opts.dsf. Returns a handle. */
async function open(repo0, opts = {}) {
  const repo = path.normalize(repo0);
  const SR = require(path.join(opts.srRepo || 'C:/Users/nname/Downloads/t180-wt-a29', 'app/test/soundrender.js'));
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(repo, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(repo)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const [W, H] = opts.size || [1400, 860];
  const L = await SR.launchChrome(SR.chromePath(), ["--mute-audio", `--window-size=${W},${H}`, ...(opts.args || [])], 'd404-');
  const errors = []; let onEvent = null;
  const { ws, send } = await SR.connect(L.tgt.webSocketDebuggerUrl, (d) => { if (onEvent && d.method) onEvent(d); if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); });
  const ev = async (expr, opt = {}) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true, ...opt }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 700)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: opts.dsf || 1, mobile: false });
  const base = `http://127.0.0.1:${srv.address().port}`;
  const h = {
    base, send, ev, errors, L, W, H, setOnEvent: (f) => { onEvent = f; },
    async load({ storage = {}, preScript = null, url = '/app/index.html', ready = "return document.documentElement.dataset.menubar === 'ready';" } = {}) {
      errors.length = 0;
      await send('Page.navigate', { url: base + '/app/lib/cjs.js' }); for (let i = 0; i < 50; i++) { await sleep(100); try { if (await ev('return location.href')== base + '/app/lib/cjs.js') break; } catch (e) {} }
      await ev(`localStorage.clear(); for (const [k, v] of Object.entries(${JSON.stringify(storage)})) localStorage.setItem(k, v); return true;`);
      let id = null; if (preScript) id = (await send('Page.addScriptToEvaluateOnNewDocument', { source: preScript })).result.identifier;
      await send('Page.navigate', { url: base + url });
      let ok = false; for (let i = 0; i < 200; i++) { await sleep(200); try { if (await ev(ready)) { ok = true; break; } } catch (e) { /* loading */ } }
      if (id) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: id });
      if (!ok) throw new Error('the page did not become ready: ' + errors.join(' | '));
    },
    async shot(file) { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(file, Buffer.from(r.result.data, 'base64')); },
    async mouse(type, x, y, extra = {}) { return send('Input.dispatchMouseEvent', { type, x, y, button: extra.button || 'none', buttons: extra.buttons || 0, clickCount: extra.clickCount || 0, modifiers: extra.modifiers || 0 }); },
    async close() { try { ws.close(); } catch (e) {} L.ch.kill(); srv.close(); await sleep(400); try { fs.rmSync(L.dir, { recursive: true, force: true }); } catch (e) {} },
  };
  return h;
}
module.exports = { open, sleep };
