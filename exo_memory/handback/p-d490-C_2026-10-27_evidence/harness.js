// harness.js (C, D490): node harness.js <t180 tree> <outdir> <mode> [--styles=a,b] [--W=2560 --H=1440]
// The REAL renderer (app/preview/renderer.js, loaded by the app's own app/lib/cjs.js) in a bare page in headless Chrome on the machine's GPU (muted,
// titled zz-headless-test first), drawing the sky only (no batches), with Aurora's colours from app/themes/aurora.css, at W x H, DPR 1.
// Cameras (60-degree lens, the app's, from the build eye): horizon (pitched 4 degrees), 40 (pitched 40), up (pitched 89.5), free (pitched 65 and
// turned 35 degrees east); all facing magnetic north, the cameras' azimuth in skypass.js and sky-crisp.
// Modes:
//   stills   each style from each camera at t = 60 s: <style>-<camera>.png, and per camera a 2 x 2 grid of the four, labelled: grid-<camera>.png
//   seq      a 10 s WebM (VP9, 30 fps, real time) of each style from the free camera and from 40: seq-<style>-<camera>.webm, plus PNGs at 0, 5 and 10 s
//   cycle    aurora2 with cycle a and with cycle b, from 40 and free, at t = 0, 180, 360, 540 s: cycle<k>-<camera>-<t>.png, and a 1 x 4 strip per cycle
//   time     each style from each camera: 30 warm-up draws, then 120 GPU-timed (EXT_disjoint_timer_query_webgl2, TIME_ELAPSED around renderer.draw)
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const REPO = path.resolve(process.argv[2]), OUT = path.resolve(process.argv[3]), MODE = process.argv[4];
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const W = +arg('W', 2560), H = +arg('H', 1440), STYLES = arg('styles', 'aurora,aurora1,aurora2,aurora3').split(',');
const T_STILL = +arg('t', 60);
const { chromePath, launchChrome, connect } = require(path.join(REPO, 'app', 'test', 'soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' };
const css = fs.readFileSync(path.join(REPO, 'app', 'themes', 'aurora.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const tok = (k) => { const m = new RegExp(`${k}:\\s*color\\(srgb ([\\d.]+) ([\\d.]+) ([\\d.]+)\\)`).exec(css); if (!m) throw new Error(`aurora.css has no ${k}`); return [+m[1], +m[2], +m[3]]; };
const THEME = { sky: tok('--sky'), fog: tok('--fog'), edge: tok('--road-edge'), tie: tok('--road-tie'), grid: tok('--ground-grid'), skyA: tok('--sky-a'), skyB: tok('--sky-b'), skyC: tok('--sky-c') };
const NAME = { aurora: "today's aurora", aurora1: '1: reworked flat', aurora2: '2: 3D curtain in front', aurora3: '3: fully 3D, half resolution' };
const N = [-0.6430, -0.7658];   // magnetic north (x, z)
const cam = (pitch, turn = 0) => { const p = pitch * Math.PI / 180, a = turn * Math.PI / 180, nx = N[0] * Math.cos(a) - N[1] * Math.sin(a), nz = N[0] * Math.sin(a) + N[1] * Math.cos(a);
  return { eye: [0, 2, 0], target: [10 * Math.cos(p) * nx, 2 + 10 * Math.sin(p), 10 * Math.cos(p) * nz], up: [0, 1, 0], fov: Math.PI / 3 }; };
const CAMS = { horizon: cam(4), 40: cam(40), up: cam(89.5), free: cam(65, 35) };
if (arg('zoom')) { const [p, tn, fv] = arg('zoom').split(':').map(Number); for (const k of Object.keys(CAMS)) delete CAMS[k]; CAMS.zoom = { ...cam(p, tn), fov: fv * Math.PI / 180 }; }   // --zoom=pitch:turn:fovDeg, one camera, to look closely
const PAGE = `<!doctype html><html><head><meta charset="utf-8"><title>zz-headless-test</title></head><body style="margin:0;background:#000">
<canvas id="c" width="${W}" height="${H}"></canvas><script src="/app/lib/cjs.js"></script><script>
document.title = 'zz-headless-test';
window.__ready = (async () => {
  const get = (p) => fetch('/' + p).then((r) => { if (!r.ok) throw new Error(p + ' ' + r.status); return r.text(); });
  const R = await loadCjs('app/preview/renderer.js', get);
  const c = document.getElementById('c'), gl = c.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
  const tq = gl.getExtension('EXT_disjoint_timer_query_webgl2');
  let r = null;
  window.__use = (theme) => { if (r) r.destroy && r.destroy(); r = R.createRenderer(gl); r.setTheme(theme); return true; };
  window.__draw = (pose, t) => { r.draw([], pose, { width: ${W}, height: ${H} }, { time: t, look: 'words', lines: false }); gl.finish(); return true; };
  window.__png = () => c.toDataURL('image/png');
  window.__time = async (pose, warm, n) => {
    const qs = [], out = []; let dis = 0;
    for (let i = 0; i < warm + n; i++) { const q = i >= warm ? gl.createQuery() : null; if (q) gl.beginQuery(tq.TIME_ELAPSED_EXT, q);
      r.draw([], pose, { width: ${W}, height: ${H} }, { time: 60 + i * 0.007, look: 'words', lines: false });
      if (q) { gl.endQuery(tq.TIME_ELAPSED_EXT); qs.push(q); } if (i % 10 === 9) await new Promise((z) => requestAnimationFrame(z)); }
    for (const q of qs) { for (let k = 0; k < 400 && !gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE); k++) await new Promise((z) => setTimeout(z, 5)); if (gl.getParameter(tq.GPU_DISJOINT_EXT)) dis++; out.push(gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6); gl.deleteQuery(q); }
    return { ms: out, dis, renderer: gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL) };
  };
  // a grid of saved frames: the caller draws each, then __cell(i) copies the canvas into cell i of a (cols x rows) sheet with a label
  const sheet = document.createElement('canvas'); const sx = sheet.getContext('2d');
  window.__sheet = (cols, rows) => { sheet.width = ${W}; sheet.height = Math.round(${H} * rows / cols * (cols / rows) * (rows / cols) * cols / rows) || ${H}; sheet.height = Math.round(${H} / cols * rows); sx.fillStyle = '#000'; sx.fillRect(0, 0, sheet.width, sheet.height); window.__cols = cols; return true; };
  window.__cell = (i, label) => { const cw = ${W} / window.__cols, ch = ${H} / window.__cols, x = (i % window.__cols) * cw, y = Math.floor(i / window.__cols) * ch;
    sx.drawImage(c, x, y, cw, ch); sx.font = '28px Segoe UI, sans-serif'; sx.fillStyle = 'rgba(0,0,0,0.55)'; sx.fillRect(x + 12, y + 12, sx.measureText(label).width + 24, 42); sx.fillStyle = '#fff'; sx.fillText(label, x + 24, y + 43); return true; };
  window.__sheetPng = () => sheet.toDataURL('image/png');
  // a real-time recording of the canvas: drawn each animation frame at t = t0 + elapsed, for secs seconds
  window.__record = (pose, t0, secs) => new Promise((done, fail) => {
    const stream = c.captureStream(30), rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 12e6 }), parts = [];
    rec.ondataavailable = (e) => { if (e.data.size) parts.push(e.data); };
    rec.onstop = async () => { const b = new Blob(parts, { type: 'video/webm' }), fr = new FileReader(); fr.onload = () => done({ url: fr.result, frames }); fr.onerror = fail; fr.readAsDataURL(b); };
    let start = null, frames = 0;
    const step = (now) => { if (start === null) start = now; const e = (now - start) / 1000; r.draw([], pose, { width: ${W}, height: ${H} }, { time: t0 + e, look: 'words', lines: false }); frames++;
      if (e < secs) requestAnimationFrame(step); else rec.stop(); };
    rec.start(1000); requestAnimationFrame(step);
  });
  return true;
})();
</script></body></html>`;
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))]; };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = http.createServer((q, s) => {
    const u = decodeURIComponent(q.url.split('?')[0]);
    if (u === '/__h.html') { s.writeHead(200, { 'content-type': 'text/html', 'cache-control': 'no-store' }); s.end(PAGE); return; }
    const p = path.normalize(path.join(REPO, u));
    if (!p.startsWith(REPO)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), [`--window-size=${Math.min(W, 2560)},${Math.min(H, 1440)}`, '--disable-frame-rate-limit', '--disable-gpu-vsync'], 't180c490-');
  const errors = [];
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => { if (d.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(d.params.exceptionDetails).slice(0, 600)); if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push(JSON.stringify(d.params.args).slice(0, 600)); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 900)}`); return d.result.result.value; };
  const big = async (expr, file) => { await ev(`window.__big = ${expr}; window.__big.length`); const n = await ev('window.__big.length'); let url = ''; for (let i = 0; i < n; i += 1e6) url += await ev(`window.__big.slice(${i}, ${i + 1e6})`); fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64')); return fs.statSync(file).size; };
  const out = [];
  try {
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: Math.min(W, 2560), height: Math.min(H, 1440), deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `${base}/__h.html` });
    for (let i = 0; i < 100; i++) { await sleep(100); try { if (await ev('!!window.__ready')) break; } catch (e) { /* loading */ } }
    await ev("document.title = 'zz-headless-test'; window.__ready");
    const use = (style, cycle = 'none') => ev(`window.__use(${JSON.stringify({ ...THEME, skyStyle: style, skyCycle: cycle })})`);
    if (MODE === 'stills') {
      for (const [cn, pose] of Object.entries(CAMS)) {
        await ev('window.__sheet(2, 2)');
        for (const [i, st] of STYLES.entries()) { await use(st); await ev(`window.__draw(${JSON.stringify(pose)}, ${T_STILL})`); const f = path.join(OUT, `${st}-${cn}.png`); const n = await big('window.__png()', f); await ev(`window.__cell(${i}, ${JSON.stringify(`${NAME[st] || st} · ${cn}`)})`); out.push({ file: f, bytes: n }); }
        const g = path.join(OUT, `grid-${cn}.png`); out.push({ file: g, bytes: await big('window.__sheetPng()', g) });
        console.log(`stills: ${cn} done`);
      }
    } else if (MODE === 'cycle') {
      for (const k of ['a', 'b']) for (const cn of ['40', 'free']) {
        await ev('window.__sheet(4, 1)'); await use('aurora2', k);
        for (const [i, t] of [0, 180, 360, 540].entries()) { await ev(`window.__draw(${JSON.stringify(CAMS[cn])}, ${t})`); const f = path.join(OUT, `cycle${k}-${cn}-${t}s.png`); out.push({ file: f, bytes: await big('window.__png()', f) }); await ev(`window.__cell(${i}, ${JSON.stringify(`cycle ${k} · ${t / 60} min`)})`); }
        const g = path.join(OUT, `cycle${k}-${cn}-strip.png`); out.push({ file: g, bytes: await big('window.__sheetPng()', g) });
        console.log(`cycle ${k} ${cn} done`);
      }
    } else if (MODE === 'seq') {
      for (const st of STYLES) for (const cn of ['free', '40']) {
        await use(st);
        for (const t of [0, 5, 10]) { await ev(`window.__draw(${JSON.stringify(CAMS[cn])}, ${T_STILL + t})`); const f = path.join(OUT, `seq-${st}-${cn}-${t}s.png`); out.push({ file: f, bytes: await big('window.__png()', f) }); }
        const r = await ev(`window.__record(${JSON.stringify(CAMS[cn])}, ${T_STILL}, 10).then((x) => { window.__vid = x.url; return x.frames; })`);
        const f = path.join(OUT, `seq-${st}-${cn}.webm`); const n = await big('window.__vid', f); out.push({ file: f, bytes: n, frames: r });
        console.log(`seq: ${st} ${cn}: ${r} frames drawn, ${(n / 1e6).toFixed(1)} MB`);
      }
    } else if (MODE === 'time') {
      for (const st of STYLES) { await use(st); for (const [cn, pose] of Object.entries(CAMS)) {
        const r = await ev(`window.__time(${JSON.stringify(pose)}, 30, 120)`);
        const row = { style: st, camera: cn, W, H, median: +pct(r.ms, 0.5).toFixed(3), p95: +pct(r.ms, 0.95).toFixed(3), max: +Math.max(...r.ms).toFixed(3), n: r.ms.length, disjoint: r.dis, renderer: r.renderer };
        out.push(row); console.log(`${st.padEnd(8)} ${cn.padEnd(8)} | median ${row.median.toFixed(3)} ms  p95 ${row.p95.toFixed(3)}  max ${row.max.toFixed(3)}  (n ${row.n}, disjoint ${row.disjoint})`);
      } }
      console.log('renderer: ' + out[0].renderer);
    } else throw new Error(`no mode ${MODE}`);
    if (errors.length) console.log('page errors: ' + errors.slice(0, 4).join('\n'));
  } finally {
    fs.writeFileSync(path.join(OUT, `${MODE}.json`), JSON.stringify({ out, errors }, null, 1));
    try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(400); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ }
  }
})().catch((e) => { console.error(e.stack || e); process.exit(1); });
