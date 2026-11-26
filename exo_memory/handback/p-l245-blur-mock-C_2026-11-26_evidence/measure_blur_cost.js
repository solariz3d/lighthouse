// measure_blur_cost.js (pane C, L245): what a backdrop-filter blur costs a frame over a 60 fps WebGL canvas, in this machine's Chrome (headless, ANGLE d3d11 asked for;
// the renderer it got is printed). A 1500 x 900 WebGL canvas redraws a moving scene every frame (40,000 triangles); over it, in turn:
//   none          no overlay
//   panel         one 260 x 856 box at the left with blur(18px) saturate(1.3): the size of the app's #left, which already blurs over the 3D view in every look
//   panel+1       the panel and one 204 x 44 label window with blur(18px)
//   panel+4       the panel and four label windows
//   panel+1 flat  the panel blurred and one label window with NO blur (the window as a plain HTML box)
// Each runs 5 s after 1 s of warm-up, twice, in the order A B C D E E D C B A. Reported: frames, mean and p95 frame interval (rAF to rAF), and the share of frames over 20 ms.
// usage: node measure_blur_cost.js
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { spawn } = require('child_process');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const PAGE = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:1500px;height:900px;overflow:hidden;background:#000}
canvas{position:absolute;left:0;top:0;width:1500px;height:900px} .o{position:absolute;background:rgba(14,30,62,.82);border:1px solid rgba(120,180,255,.35);border-radius:16px;backdrop-filter:blur(18px) saturate(1.3)}
.o.flat{backdrop-filter:none}</style></head><body><canvas id="c" width="1500" height="900"></canvas><div id="ov"></div><script>
const gl = document.getElementById('c').getContext('webgl', { antialias: true });
const vs = 'attribute vec2 p; uniform float t; void main(){ vec2 q = p + 0.05*vec2(sin(t+p.y*9.0), cos(t*1.3+p.x*7.0)); gl_Position = vec4(q,0,1); }';
const fsrc = 'precision mediump float; uniform float t; void main(){ gl_FragColor = vec4(0.3+0.3*sin(t+gl_FragCoord.x*0.02), 0.4, 0.6+0.3*cos(t+gl_FragCoord.y*0.03), 1); }';
const sh = (k, s) => { const o = gl.createShader(k); gl.shaderSource(o, s); gl.compileShader(o); return o; };
const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fsrc)); gl.linkProgram(pr); gl.useProgram(pr);
const N = 40000, v = new Float32Array(N * 6); for (let i = 0; i < N; i++) { const x = Math.random() * 2 - 1, y = Math.random() * 2 - 1, s = 0.03; v.set([x, y, x + s, y, x, y + s], i * 6); }
const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);
const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0); const tl = gl.getUniformLocation(pr, 't');
let iv = [], on = false, last = 0;
const frame = (now) => { gl.uniform1f(tl, now / 1000); gl.clearColor(0.05, 0.06, 0.1, 1); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, N * 3); if (on && last) iv.push(now - last); last = now; requestAnimationFrame(frame); };
requestAnimationFrame(frame);
const dbg = gl.getExtension('WEBGL_debug_renderer_info'); window.renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
const box = (x, y, w, h, flat) => { const d = document.createElement('div'); d.className = 'o' + (flat ? ' flat' : ''); Object.assign(d.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }); return d; };
const SETS = { none: [], panel: [[0, 44, 260, 856]], 'panel+1': [[0, 44, 260, 856], [600, 300, 204, 44]], 'panel+4': [[0, 44, 260, 856], [600, 300, 204, 44], [900, 400, 204, 44], [400, 600, 204, 44], [1100, 200, 204, 44]], 'panel+1 flat': [[0, 44, 260, 856], [600, 300, 204, 44, 1]] };
window.run = async (name) => { const ov = document.getElementById('ov'); ov.replaceChildren(...SETS[name].map((a) => box(...a)));
  await new Promise((r) => setTimeout(r, 1000)); iv = []; on = true; await new Promise((r) => setTimeout(r, 5000)); on = false;
  const s = [...iv].sort((x, y) => x - y), mean = s.reduce((a, x) => a + x, 0) / s.length;
  return { name, frames: s.length, mean: +mean.toFixed(2), p95: +s[Math.floor(s.length * 0.95)].toFixed(2), over20: +(s.filter((x) => x > 20).length / s.length * 100).toFixed(1) }; };
</script></body></html>`;

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'c-l245-cost-')), pagePath = path.join(dir, 'cost.html'); fs.writeFileSync(pagePath, PAGE);
  const ch = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--no-first-run', '--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-gpu', '--window-size=1500,900', 'file:///' + pagePath.replace(/\\/g, '/')], { stdio: 'ignore' });
  const portFile = path.join(dir, 'DevToolsActivePort');
  for (let i = 0; i < 200 && !fs.existsSync(portFile); i++) await new Promise((r) => setTimeout(r, 50));
  const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
  await new Promise((r) => setTimeout(r, 800));
  const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
  let id = 0; const pend = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result.result.value;
  await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  console.log(`renderer: ${await ev('window.renderer')}`);
  const order = ['none', 'panel', 'panel+1', 'panel+4', 'panel+1 flat']; const runs = [];
  for (const n of order.concat([...order].reverse())) { const r = await ev(`window.run(${JSON.stringify(n)})`); runs.push(r); console.log(JSON.stringify(r)); }
  for (const n of order) { const rs = runs.filter((r) => r.name === n); console.log(`${n.padEnd(13)} mean ${rs.map((r) => r.mean).join(' / ')} ms, p95 ${rs.map((r) => r.p95).join(' / ')} ms, over 20 ms ${rs.map((r) => r.over20).join(' / ')} %`); }
  ws.close(); ch.kill(); setTimeout(() => { try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* left in temp */ } }, 1500);
})().catch((e) => { console.error(e); process.exit(1); });
