// skyshot.js <worktree> <style> <mode> <outprefix>  : modes: shots (level/up at t=0,60 + strip), cost (1400x816, median of 5x200 passes)
// runs headless Chrome through the worktree's own test helpers; holds the heavy-run lock for the worktree's tree
const path = require('path'), fs = require('fs');
const [wt, style, mode, out] = process.argv.slice(2);
process.chdir(wt);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: `t180 A D403 skyshot ${mode} ${style}` });
const SR = require(path.join(wt, 'app/test/soundrender.js'));
const R = require(path.join(wt, 'app/preview/renderer.js')), SKY = require(path.join(wt, 'app/preview/sky/index.js'));
const skin = { sun: 'skyline', prism: 'glass', caustics: 'aqua', aurora: 'aurora' }[style];
const css = fs.readFileSync(path.join(wt, 'app/themes', skin + '.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const tok = (k) => { const m = new RegExp(`${k}:\\s*color\\(srgb ([\\d.]+) ([\\d.]+) ([\\d.]+)\\)`).exec(css); return m ? [+m[1], +m[2], +m[3]] : null; };
const sky = tok('--sky'); const col = { sky, a: tok('--sky-a') || sky, b: tok('--sky-b') || sky, c: tok('--sky-c') || sky };
const pose = (pd, fov) => { const p = pd * Math.PI / 180; return { eye: [0, 2, 0], target: [0, 2 + Math.sin(p) * 10, -Math.cos(p) * 10], up: [0, 1, 0], fov: fov || Math.PI / 3 }; };
const W = 1400, H = 816;
const PAGE = `window.__s = (vs, fs, col) => {
  const cv = document.createElement('canvas'); cv.width = ${W}; cv.height = ${H}; const gl = cv.getContext('webgl', { preserveDrawingBuffer: true, antialias: false });
  const sh = (ty, s) => { const o = gl.createShader(ty); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error('compile: ' + gl.getShaderInfoLog(o)); return o; };
  const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link');
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.useProgram(p); const a = gl.getAttribLocation(p, 'aPos'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(p, n); gl.uniform3fv(U('uSky'), col.sky); gl.uniform3fv(U('uSkyA'), col.a); gl.uniform3fv(U('uSkyB'), col.b); gl.uniform3fv(U('uSkyC'), col.c);
  gl.viewport(0, 0, ${W}, ${H});
  const draw = (B, t) => { gl.uniform3fv(U('uFwd'), B.fwd); gl.uniform3fv(U('uRight'), B.right); gl.uniform3fv(U('uUp'), B.up); gl.uniform1f(U('uTime'), t); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
  const px = new Uint8Array(4);
  return {
    png(B, t) { draw(B, t); return cv.toDataURL('image/png'); },
    strip(B, ts) { const c2 = document.createElement('canvas'); const w = ${W} / 3 | 0, h = ${H} / 3 | 0; c2.width = w * ts.length; c2.height = h; const g = c2.getContext('2d'); ts.forEach((t, i) => { draw(B, t); g.drawImage(cv, i * w, 0, w, h); }); return c2.toDataURL('image/png'); },
    cost(B) { draw(B, 0); for (let i = 0; i < 20; i++) draw(B, 0); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); const per = []; for (let k = 0; k < 5; k++) { const t0 = performance.now(); for (let i = 0; i < 200; i++) draw(B, 0); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); per.push((performance.now() - t0) / 200); } per.sort((u, v) => u - v); const e = gl.getExtension('WEBGL_debug_renderer_info'); return { renderer: e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : '?', median: +per[2].toFixed(4), runs: per.map((v) => +v.toFixed(4)) }; },
  };
};
true`;
(async () => {
  const exe = SR.chromePath();
  const L = await SR.launchChrome(exe, ['--enable-unsafe-swiftshader'], 'a23shot-'), c = await SR.connect(L.tgt.webSocketDebuggerUrl);
  const ev = async (e) => { const d = await c.send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 600)); return d.result.result.value; };
  try {
    await ev(PAGE);
    const mk = `window.__s(${JSON.stringify(R.SKY_VS)}, ${JSON.stringify(R.skyFS(SKY.patternSource(style)))}, ${JSON.stringify(col)})`;
    const lv = R.skyBasis(pose(0), W / H), up = R.skyBasis(pose(50), W / H);
    const save = (name, url) => fs.writeFileSync(`${out}-${name}.png`, Buffer.from(url.split(',')[1], 'base64'));
    if (mode === 'shots') {
      await ev(`window.S = ${mk}; true`);
      for (const [n, B] of [['level', lv], ['up', up]]) for (const t of [0, 60]) save(`${n}-t${t}`, await ev(`window.S.png(${JSON.stringify(B)}, ${t})`));
      save('strip-level', await ev(`window.S.strip(${JSON.stringify(lv)}, [0, 60, 120, 180, 240])`));
      save('strip-up', await ev(`window.S.strip(${JSON.stringify(up)}, [0, 60, 120, 180, 240])`));
      console.log('shots written', out);
    } else if (mode === 'zoom') {
      await ev(`window.S = ${mk}; true`);
      const zb = R.skyBasis(pose(+process.argv[6] || 14, 0.3), W / H); save('zoom', await ev(`window.S.png(${JSON.stringify(zb)}, ${+process.argv[7] || 0})`));
    } else if (mode === 'cost') {
      const r = []; for (const [n, B] of [['level', lv], ['up', up]]) r.push([n, await ev(`(${mk}).cost(${JSON.stringify(B)})`)]);
      console.log(style, JSON.stringify(r));
    }
  } finally { try { c.ws.close(); } catch (e) {} L.ch.kill(); await new Promise((r) => setTimeout(r, 400)); try { fs.rmSync(L.dir, { recursive: true, force: true }); } catch (e) {} }
  process.exit(0);
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });
