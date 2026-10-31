// run-chart.js: draws chart.html's two panels in headless Chrome (soundrender.js launchChrome: --headless=new --mute-audio) and saves chart-xsec.png, chart-bump.png.
const path = require('path'), fs = require('fs'), http = require('http');
const WT = 'C:/Users/nname/Downloads/t180-wt-land413';
const SR = require(path.join(WT, 'app/test/soundrender.js'));
(async () => {
  const srv = http.createServer((q, s) => {
    const p = path.join(__dirname, decodeURIComponent(q.url.split('?')[0]).replace(/^\//, ''));
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': p.endsWith('.json') ? 'application/json' : 'text/html' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r)); const base = `http://127.0.0.1:${srv.address().port}/`;
  const L = await SR.launchChrome(SR.chromePath(), ['--window-size=1400,900'], 'p433chart-'), c = await SR.connect(L.tgt.webSocketDebuggerUrl);
  const ev = async (e) => { const d = await c.send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 800)); return d.result.result.value; };
  try {
    await c.send('Page.navigate', { url: base + 'chart.html' }); await new Promise((r) => setTimeout(r, 1200));
    for (const which of ['xsec', 'bump']) { const url = await ev(`window.__chart(${JSON.stringify(which)})`); fs.writeFileSync(path.join(__dirname, `chart-${which}.png`), Buffer.from(url.split(',')[1], 'base64')); console.log('wrote', `chart-${which}.png`); }
  } finally { try { c.ws.close(); } catch (e) { /* closing */ } L.ch.kill(); srv.close(); await new Promise((r) => setTimeout(r, 400)); try { fs.rmSync(L.dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ } }
  process.exit(0);
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });
