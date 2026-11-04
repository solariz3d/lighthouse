// pulseprobe.js (C, D495): which moving part of the aurora makes a column of the hem change by more than D403's 15% in a second? sky-aurora-look.test.js
// row 4's own measure (the brightest stretch per column, 11 to 50 degrees, median of 5 rows; the 1 s change against the 95th-percentile level), at
// t = 0 and 500, on the sky as it is and with one time term at a time held still. node pulseprobe.js <t180 tree>
'use strict';
const path = require('path'), fs = require('fs');
const T = path.resolve(process.argv[2]);
const { chromePath, launchChrome, connect } = require(path.join(T, 'app', 'test', 'soundrender.js'));
const R = require(path.join(T, 'app', 'preview', 'renderer.js')), SKY = require(path.join(T, 'app', 'preview', 'sky', 'index.js'));
const W = 1400, DEG = Math.PI / 180;
const css = fs.readFileSync(path.join(T, 'app', 'themes', 'aurora.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const tok = (k) => { const m = new RegExp(`${k}:\\s*color\\(srgb ([\\d.]+) ([\\d.]+) ([\\d.]+)\\)`).exec(css); return [+m[1], +m[2], +m[3]]; };
const COL = { sky: tok('--sky'), a: tok('--sky-a'), b: tok('--sky-b'), c: tok('--sky-c') };
const src = SKY.patternSource('aurora');
const still = (re, to) => { const n = (src.match(re) || []).length; if (n !== 1) throw new Error(`${re} found ${n} times`); return src.replace(re, to); };
const VARIANTS = {
  'as it is': src,


  'pulse still': still(/t \/ 12\.0/, '0.0'),
  'span still': still(/t \* 0\.0025/, '0.0'),

  'hem still': still(/t \* 0\.003 \+ sd/, 'sd'),
  'stars out': still(/aurora_stars\(dir, t\)/, '0.0'),
  'the flat fallback': SKY.fallbackSource('aurora'),




  ...Object.fromEntries([['only the running shimmer moves', 'u * 40.0 - t * 0.45'], ['only the fine rays move', 'u * 40.0 + t * 0.014'], ['only the ray groups move', 'u * 12.0 + t * 0.028'],
    ['only the pulse moves', 't / 12.0'], ['only the span moves', 't * 0.0025'], ['only the big folds move', 'u * 0.55 - t * 0.00018'], ['only the curl warp moves', 'u * 1.7 + sd, t * 0.004'],
    ['only the curls move', '1.4 * warp - t * 0.0013'], ['only the hem moves', 't * 0.003 + sd']].map(([n, term]) => {
    const only = src.replace(term, term.replace(/\bt\b/, 'gT'));
    if (only === src) throw new Error(`${n}: ${term} not found`);
    return [n, 'float gT;\n' + only.replace(/vec3 skyPattern\(vec3 dir, float t\) \{/, 'vec3 skyPattern(vec3 dir, float t_) { gT = t_; float t = 100.0;')];
  })),
  'all time still': src.replace(/vec3 skyPattern\(vec3 dir, float t\) \{/, 'vec3 skyPattern(vec3 dir, float t_) { float t = 100.0;'),
};
const PAGE = `window.__mk = (fs) => { const cv = document.createElement('canvas'); cv.width = ${W}; cv.height = 300; const gl = cv.getContext('webgl', { preserveDrawingBuffer: true, antialias: false });
  const sh = (ty, s) => { const o = gl.createShader(ty); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, 'attribute vec2 aPos; uniform vec2 uEl; varying vec3 vRay; void main(){ vec2 u = aPos * 0.5 + 0.5; float az = u.x * 6.2831853, el = mix(uEl.x, uEl.y, u.y); vRay = vec3(cos(el) * cos(az), sin(el), cos(el) * sin(az)); gl_Position = vec4(aPos, 0.0, 1.0); }')); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); const v = []; for (let i = 0; i <= ${W}; i++) { const x = -1 + 2 * i / ${W}; v.push(x, -1, x, 1); } gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
  return (t) => { gl.useProgram(p); const a = gl.getAttribLocation(p, 'aPos'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0); const U = (n) => gl.getUniformLocation(p, n);
    gl.uniform3fv(U('uSky'), ${JSON.stringify(COL.sky)}); gl.uniform3fv(U('uSkyA'), ${JSON.stringify(COL.a)}); gl.uniform3fv(U('uSkyB'), ${JSON.stringify(COL.b)}); gl.uniform3fv(U('uSkyC'), ${JSON.stringify(COL.c)}); gl.uniform1f(U('uTime'), t);
    gl.uniform2f(U('uEl'), ${11 * DEG}, ${50 * DEG}); gl.viewport(0, 0, ${W}, 300); gl.drawArrays(gl.TRIANGLE_STRIP, 0, ${2 * (W + 1)});
    const px = new Uint8Array(${W} * 300 * 4); gl.readPixels(0, 0, ${W}, 300, gl.RGBA, gl.UNSIGNED_BYTE, px); const L = (q) => { q /= 255; return q <= 0.04045 ? q / 12.92 : Math.pow((q + 0.055) / 1.055, 2.4); };
    const Y = (k) => 0.2126 * L(px[k]) + 0.7152 * L(px[k + 1]) + 0.0722 * L(px[k + 2]), out = new Array(${W}).fill(0), at = new Array(${W}).fill(0);
    for (let x = 0; x < ${W}; x++) for (let y = 2; y < 298; y++) { const w = []; for (let k = -2; k <= 2; k++) w.push(Y(((y + k) * ${W} + x) * 4)); w.sort((u, q) => u - q); if (w[2] > out[x]) { out[x] = w[2]; at[x] = y; } } return { out, at }; }; }; true`;
(async () => {
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--enable-unsafe-swiftshader'], 't180c495p-');
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl);
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 500)); return d.result.result.value; };
  try {
    await ev("document.title = 'zz-headless-test'; true"); await ev(PAGE);
    for (const [name, s] of Object.entries(VARIANTS)) {
      await ev(`window.__f = window.__mk(${JSON.stringify(R.skyFS(s))}); true`);
      let worst = 0, where = '';
      for (const t0 of [0, 500]) { const a = await ev(`window.__f(${t0})`), b = await ev(`window.__f(${t0 + 1})`); const top = [...a.out].sort((u, v) => u - v)[Math.floor(W * 0.95)];
        for (let x = 0; x < W; x++) { const q = Math.abs(b.out[x] - a.out[x]) / top; if (q > worst) { worst = q; where = `t${t0} col ${x} (az ${(x / W * 360).toFixed(0)}) row ${a.at[x]}->${b.at[x]} Y ${a.out[x].toFixed(4)}->${b.out[x].toFixed(4)}, top ${top.toFixed(4)}`; } } }
      console.log(`${name.padEnd(24)} worst 1 s change ${(worst * 100).toFixed(1)}%  at ${where}`);
    }
  } finally { try { ws.close(); } catch (e) { /* closing */ } ch.kill(); await new Promise((r) => setTimeout(r, 400)); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ } }
})().catch((e) => { console.error(e.stack || e); process.exit(1); });
