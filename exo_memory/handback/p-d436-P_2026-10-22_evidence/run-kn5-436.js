// run-kn5-436.js (D436, P): headless Chrome (the worktree's app/test/soundrender.js launchChrome: --headless=new --mute-audio) draws kn5436.html for each joint
// and view and saves the PNGs. Serves this folder over a local http port. Nothing in t180 is written.   node run-kn5-436.js <geomdir> <outdir> <prefix> <jointsCSV>
const path = require('path'), fs = require('fs'), http = require('http');
const [GEOM, OUT, PREFIX, J] = process.argv.slice(2);
const WT = 'C:/Users/nname/Downloads/t180-wt-land413';
const SR = require(path.join(WT, 'app/test/soundrender.js'));
const at = (f, u, v, t = 0) => [f.pos[0] + f.L[0] * u + f.U[0] * v + f.T[0] * t, f.pos[1] + f.L[1] * u + f.U[1] * v + f.T[1] * t, f.pos[2] + f.L[2] * u + f.U[2] * v + f.T[2] * t];
const viewsFor = (G) => {
  const F = G.lines.frames, js = G.joint.s, LAP = 11484;
  const fr = (ds) => { let s = js + ds; const best = F.reduce((b, f) => { let d = f.s - s; if (d > LAP / 2) d -= LAP; if (d < -LAP / 2) d += LAP; return Math.abs(d) < b.d ? { d: Math.abs(d), f } : b; }, { d: 1e9, f: null }); return best.f; };
  return {
    driver60: { eye: at(fr(-60), 0, 1.1), at: at(fr(10), 0, 1.0), fov: 0.95 },            // the driver's eye, 60 m before the joint, looking through it
    driver20: { eye: at(fr(-20), 0, 1.1), at: at(fr(30), 0, 0.8), fov: 0.95 },            // 20 m before it
    side: { eye: at(fr(0), -48, 9), at: at(fr(0), 2, 1.2), fov: 0.65 },                   // from the right side, level-ish: the cross-section and any rise
    sidelow: { eye: at(fr(-30), -30, 2.0), at: at(fr(10), 0, 1.0), fov: 0.8 },            // low and from the right, a little before the joint: a step would show as a lip against the light
    above: { eye: at(fr(-50), -40, 60), at: at(fr(15), 0, 0), fov: 0.8 },                 // above and to the right
  };
};
(async () => {
  const srv = http.createServer((q, s) => {
    const rel = decodeURIComponent(q.url.split('?')[0]).replace(/^\//, ''); const p = rel.startsWith('geom/') ? path.join(GEOM, rel.slice(5)) : path.join(__dirname, rel);
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': p.endsWith('.json') ? 'application/json' : 'text/html' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r)); const base = `http://127.0.0.1:${srv.address().port}/`;
  const L = await SR.launchChrome(SR.chromePath(), ['--enable-unsafe-swiftshader', '--window-size=1400,816'], 'p436kn5-'), c = await SR.connect(L.tgt.webSocketDebuggerUrl);
  const ev = async (e) => { const d = await c.send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 800)); return d.result.result.value; };
  fs.mkdirSync(OUT, { recursive: true });
  try {
    await c.send('Page.navigate', { url: base + 'kn5436.html' }); await new Promise((r) => setTimeout(r, 1500));
    for (const j of J.split(',').map(Number)) {
      const G = JSON.parse(fs.readFileSync(path.join(GEOM, `geom-${j}.json`), 'utf8')); const views = viewsFor(G);
      for (const [name, v] of Object.entries(views)) { const url = await ev(`window.__draw(${JSON.stringify(v)}, 'geom/geom-${j}.json')`); const f = path.join(OUT, `${PREFIX}-s${j}-${name}.png`); fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64')); console.log('wrote', path.basename(f)); }
    }
  } finally { try { c.ws.close(); } catch (e) { /* closing */ } L.ch.kill(); srv.close(); await new Promise((r) => setTimeout(r, 400)); try { fs.rmSync(L.dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ } }
  process.exit(0);
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });
