// skypass.js (C, D489): node skypass.js <t180 tree> <out.json> [W] [H]
// The renderer's own sky pass (renderer.js SKY_VS + skyFS) for each sky style, and for the aurora's parts alone, drawn full-screen at W x H (default
// 2560 x 1440) in headless Chrome on the machine's GPU (muted, titled), each draw timed on the GPU by EXT_disjoint_timer_query_webgl2 (TIME_ELAPSED).
// Views: the build camera's eye, 60-degree lens, pitched 0 (horizon), 40 and 85 degrees (looking up). 30 warm-up draws, then 120 timed, per case.
'use strict';
const fs = require('fs'), path = require('path');
const T = path.resolve(process.argv[2]), OUT = path.resolve(process.argv[3]), W = +(process.argv[4] || 2560), H = +(process.argv[5] || 1440);
const { chromePath, launchChrome, connect } = require(path.join(T, 'app', 'test', 'soundrender.js'));
const R = require(path.join(T, 'app', 'preview', 'renderer.js')), SKY = require(path.join(T, 'app', 'preview', 'sky', 'index.js'));
const colours = (theme) => { const css = fs.readFileSync(path.join(T, 'app', 'themes', `${theme}.css`), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const tok = (k) => { const m = new RegExp(`${k}:\\s*color\\(srgb ([\\d.]+) ([\\d.]+) ([\\d.]+)\\)`).exec(css); return m ? [+m[1], +m[2], +m[3]] : null; };
  const sky = tok('--sky'); return { sky, a: tok('--sky-a') || sky, b: tok('--sky-b') || sky, c: tok('--sky-c') || sky }; };
const AZ = [-0.557, -0.663], poseAt = (deg) => { const h = Math.hypot(...AZ), p = deg * Math.PI / 180, f = [Math.cos(p) * AZ[0] / h, Math.sin(p), Math.cos(p) * AZ[1] / h];
  return { eye: [0, 2, 0], target: [10 * f[0], 2 + 10 * f[1], 10 * f[2]], up: [0, 1, 0], fov: Math.PI / 3 }; };
// the aurora split into its parts: its own source with skyPattern renamed, and a skyPattern that draws one part
const AU = SKY.patternSource('aurora').replace('vec3 skyPattern(vec3 dir, float t)', 'vec3 aurora_full(vec3 dir, float t)');
const part = (body) => AU + `\nvec3 skyPattern(vec3 dir, float t) { float el = asin(clamp(dir.y, -1.0, 1.0)), az = atan(dir.z, dir.x); ${body} }\n`;
const THEME = { sun: 'aqua', prism: 'glass', caustics: 'aqua', aurora: 'aurora', city: 'skyline-night', river: 'glass' };
const CASES = process.env.CASES_FILE ? require(path.resolve(process.env.CASES_FILE))(AU, part) : [
  ['flat (the pass alone: skyPattern returns --sky)', 'aurora', 'vec3 skyPattern(vec3 dir, float t) { return uSky; }'],
  ...SKY.STYLES.filter((s) => s !== 'none').map((s) => [s, THEME[s], SKY.patternSource(s)]),
  ['aurora: night gradient only', 'aurora', part('vec3 night = mix(uSkyC, uSky, smoothstep(0.0, 0.42, el)); return mix(night, mix(uSkyC, uSky, 0.5), 1.0 - smoothstep(-0.35, 0.0, el));')],
  ['aurora: one curtain', 'aurora', part('return aurora_curtain(az, el, t, 0.0, 0.30, 0.24, vec3(41.0, 113.0, 277.0), 1.25);')],
  ['aurora: three curtains', 'aurora', part('vec3 g = aurora_curtain(az, el, t, 0.0, 0.30, 0.24, vec3(41.0, 113.0, 277.0), 1.25), m = aurora_curtain(az, el, t, 2.4, 0.26, 0.16, vec3(53.0, 149.0, 331.0), 0.7), f = aurora_curtain(az, el, t, 4.6, 0.225, 0.09, vec3(67.0, 173.0, 389.0), 0.4); return aurora_screen(aurora_screen(g, m), f);')],
  ['aurora: corona only', 'aurora', part('return aurora_corona(dir, t);')],
  ['aurora: stars only', 'aurora', part('return vec3(aurora_stars(dir, t));')],
];
const PAGE = `(() => { document.title = 'zz-headless-test';
  const c = document.createElement('canvas'); c.width = ${W}; c.height = ${H}; document.body.appendChild(c);
  const gl = c.getContext('webgl2', { antialias: false }), tq = gl.getExtension('EXT_disjoint_timer_query_webgl2');
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  window.__time = async (vs, fs, col, B, px, warm, n) => {
    const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    gl.useProgram(p); const u = (k) => gl.getUniformLocation(p, k);
    gl.uniform3fv(u('uFwd'), B.fwd); gl.uniform3fv(u('uRight'), B.right); gl.uniform3fv(u('uUp'), B.up); gl.uniform3fv(u('uSky'), col.sky); gl.uniform3fv(u('uSkyA'), col.a); gl.uniform3fv(u('uSkyB'), col.b); gl.uniform3fv(u('uSkyC'), col.c); gl.uniform1f(u('uPx'), px);
    const pos = gl.getAttribLocation(p, 'aPos'); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0); gl.viewport(0, 0, ${W}, ${H}); gl.disable(gl.DEPTH_TEST);
    const out = [], qs = []; let disjoint = 0;
    for (let i = 0; i < warm + n; i++) {
      gl.uniform1f(u('uTime'), 100 + i * 0.007);
      const q = i >= warm ? gl.createQuery() : null; if (q) gl.beginQuery(tq.TIME_ELAPSED_EXT, q);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (q) { gl.endQuery(tq.TIME_ELAPSED_EXT); qs.push(q); }
      if (i % 10 === 9) await new Promise((r) => requestAnimationFrame(r));
    }
    for (const q of qs) { for (let k = 0; k < 400 && !gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE); k++) await new Promise((r) => setTimeout(r, 5)); if (gl.getParameter(tq.GPU_DISJOINT_EXT)) disjoint++; out.push(gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6); gl.deleteQuery(q); }
    gl.deleteProgram(p); return { ms: out, disjoint, renderer: gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL) };
  }; return true; })()`;
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))]; };
(async () => {
  const { ch, dir, tgt } = await launchChrome(chromePath(), [`--window-size=${W},${H}`], 't180c489-');
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, () => {});
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 800)); return d.result.result.value; };
  const rows = [];
  try {
    await ev("document.title = 'zz-headless-test'; true"); await ev(PAGE);
    for (const pitch of [0, 40, 85]) {
      const B = R.skyBasis(poseAt(pitch), W / H), px = 2 * Math.hypot(...B.up) / H;
      for (const [name, theme, pat] of CASES) {
        const r = await ev(`window.__time(${JSON.stringify(R.SKY_VS)}, ${JSON.stringify(R.skyFS(pat))}, ${JSON.stringify(colours(theme))}, ${JSON.stringify(B)}, ${px}, 30, 120)`);
        const row = { name, pitch, W, H, median: +pct(r.ms, 0.5).toFixed(3), p95: +pct(r.ms, 0.95).toFixed(3), max: +Math.max(...r.ms).toFixed(3), n: r.ms.length, disjoint: r.disjoint, renderer: r.renderer };
        rows.push(row); console.log(`pitch ${String(pitch).padStart(2)} | ${name.padEnd(48)} | median ${row.median.toFixed(3)} ms  p95 ${row.p95.toFixed(3)}  max ${row.max.toFixed(3)}  (n ${row.n}, disjoint ${row.disjoint})`);
      }
    }
    console.log('renderer: ' + (rows[0] && rows[0].renderer));
  } finally {
    fs.writeFileSync(OUT, JSON.stringify(rows, null, 1));
    try { ws.close(); } catch (e) { /* closing */ } ch.kill(); await new Promise((r) => setTimeout(r, 400)); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ }
  }
})().catch((e) => { console.error(e.stack || e); process.exit(1); });
