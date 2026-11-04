// pair.js (C, D495): node pair.js <out.png> <labelA> <a.png> <labelB> <b.png> [...]: the images side by side, each scaled to 1280 x 720, labelled, in
// headless Chrome (muted, titled zz-headless-test), so the before and after of a camera can be seen in one picture.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = 'C:/Users/nname/Downloads/t180-wt-c495';
const { chromePath, launchChrome, connect } = require(path.join(T, 'app', 'test', 'soundrender.js'));
const OUT = process.argv[2], PAIRS = []; for (let i = 3; i + 1 < process.argv.length; i += 2) PAIRS.push([process.argv[i], path.resolve(process.argv[i + 1])]);
(async () => {
  const srv = http.createServer((q, s) => { if (q.url === '/none') { s.writeHead(200, { 'content-type': 'text/html' }); s.end('<!doctype html><title>zz-headless-test</title>'); return; } const i = +q.url.slice(1); if (!(i >= 0 && i < PAIRS.length)) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': 'image/png' }); s.end(fs.readFileSync(PAIRS[i][1])); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), [], 't180c495pair-');
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, () => {});
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 500)); return d.result.result.value; };
  try {
    await send('Page.navigate', { url: base + '/none' }); await new Promise((r) => setTimeout(r, 500));
    await ev("document.title = 'zz-headless-test'; true");
    const url = await ev(`(async () => { const W = 1280, H = 720, c = document.createElement('canvas'); c.width = W * ${PAIRS.length}; c.height = H; const x = c.getContext('2d');
      const labels = ${JSON.stringify(PAIRS.map((p) => p[0]))};
      for (let i = 0; i < labels.length; i++) { const im = new Image(); im.src = '${base}/' + i; await im.decode(); x.drawImage(im, i * W, 0, W, H);
        x.font = '26px Segoe UI, sans-serif'; const w = x.measureText(labels[i]).width; x.fillStyle = 'rgba(0,0,0,0.6)'; x.fillRect(i * W + 12, 12, w + 24, 40); x.fillStyle = '#fff'; x.fillText(labels[i], i * W + 24, 41); }
      window.__u = c.toDataURL('image/png'); return window.__u.length; })()`);
    let s = ''; for (let i = 0; i < url; i += 1e6) s += await ev(`window.__u.slice(${i}, ${i + 1e6})`);   // in slices: one reply over about 4 MB closes the socket
    fs.writeFileSync(OUT, Buffer.from(s.split(',')[1], 'base64')); console.log(`${OUT}: ${fs.statSync(OUT).size} bytes`);
  } finally { try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await new Promise((r) => setTimeout(r, 400)); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ } }
})().catch((e) => { console.error(e.stack || e); process.exit(1); });
