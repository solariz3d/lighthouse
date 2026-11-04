// run-kn5.js: headless Chrome (the worktree's soundrender.js launchChrome: --headless=new --mute-audio) draws kn5.html for each view and saves the PNGs.
// Serves this folder over a local http port. Nothing in t180 is written.
const path = require('path'), fs = require('fs'), http = require('http');
const WT = 'C:/Users/nname/Downloads/t180-wt-land413';
const SR = require(path.join(WT, 'app/test/soundrender.js'));
const G = JSON.parse(fs.readFileSync(path.join(__dirname, 'geom.json'), 'utf8')); const F = G.lines.frames, fr = (s) => F.find((f) => f.s === s);
const at = (f, u, v, t = 0) => [f.pos[0] + f.L[0] * u + f.U[0] * v + f.T[0] * t, f.pos[1] + f.L[1] * u + f.U[1] * v + f.T[1] * t, f.pos[2] + f.L[2] * u + f.U[2] * v + f.T[2] * t];
const views = {
  along: { eye: at(fr(3260), 8.4, 2.2), at: at(fr(3320), 6, 1.5), fov: 0.9 },      // from the car's line, 40 m before the joint, looking along the road
  above: { eye: at(fr(3270), -25, 45), at: at(fr(3310), 0, 1), fov: 0.8 },         // from above and to the right, the joint ahead
  across: { eye: at(fr(3306), -30, 8), at: at(fr(3306), 2, 1.5), fov: 0.75 },      // across the road at the joint: the cross-section and the centre line against the edges
};
(async () => {
  const srv = http.createServer((q, s) => {
    const p = path.join(__dirname, decodeURIComponent(q.url.split('?')[0]).replace(/^\//, ''));
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': p.endsWith('.json') ? 'application/json' : 'text/html' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r)); const base = `http://127.0.0.1:${srv.address().port}/`;
  const L = await SR.launchChrome(SR.chromePath(), ['--enable-unsafe-swiftshader', '--window-size=1400,816'], 'p433kn5-'), c = await SR.connect(L.tgt.webSocketDebuggerUrl);
  const ev = async (e) => { const d = await c.send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 800)); return d.result.result.value; };
  try {
    await c.send('Page.navigate', { url: base + 'kn5.html' }); await new Promise((r) => setTimeout(r, 1500));
    for (const [name, v] of Object.entries(views)) { const url = await ev(`window.__draw(${JSON.stringify(v)})`); fs.writeFileSync(path.join(__dirname, `kn5-${name}.png`), Buffer.from(url.split(',')[1], 'base64')); console.log('wrote', `kn5-${name}.png`); }
  } finally { try { c.ws.close(); } catch (e) { /* closing */ } L.ch.kill(); srv.close(); await new Promise((r) => setTimeout(r, 400)); try { fs.rmSync(L.dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ } }
  process.exit(0);
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });
