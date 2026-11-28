// page271b.js (pane B, L271 role 2; page271.js's second run: the pull a LEVEL mouse move of 45 px outward, the guide closed, the side view flown by keys learned from one tap each)
// page271.js (pane B, L271 role 2, item 3 and the pictures): today's grab against the slope grab ON THE REAL PAGE, in headless Chrome (muted, never focused, titled
// zz-headless-test), served from the l271 worktree twice: TODAY with app/core/zonegrab.js replaced by the base's (git show), SLOPE as the branch has it.
// For each road (Bminus: D's banked turn, -20 deg; F: D's flat road with the default cup) and each server: the road restored as an autosave (sculpt-frame.test.js's
// stand-in), Sculpt mode (Tab, 1 = Grab), radius 30; the camera the page's focus puts at s 330 (35 m up, 45 m back: a click on a red sends it); a real pointer
// press on the outer (right) rim, dragged to where the rim pulled 4 m straight out projects (D's pull), held, shot with a cross where the pointer is; released, shot;
// then the camera flown with the page's own keys to the outside of the turn, low, and turned to look across, shot. Where the grabbed rim is after the release is
// read from the page's own autosave and projected with the page's pose: its distance from the pointer, in px and in m.
//   node page271.js <worktree> <base sha> <out dir>
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os'), { execFileSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, BASE, OUT] = process.argv.slice(2), T = path.resolve(T0); fs.mkdirSync(OUT, { recursive: true });
const { chromePath, launchChrome, connect } = require(path.join(T, 'app/test/soundrender.js'));
const D = require(path.join(T, 'src/core/document.js')), TB = require(path.join(T, 'src/core/turnby.js')), ZG = require(path.join(T, 'app/core/zonegrab.js'));
const { toPath } = require(path.join(T, 'src/core/adapter.js')), M = require(path.join(T, 'app/camera/math.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const todayZG = execFileSync('git', ['-C', T, 'show', `${BASE}:app/core/zonegrab.js`]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const W = 1400, H = 860, S = 330, PULL = 4;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.css': 'text/css' };
const LAYOUT = { plan: (b) => [{ length: 100, turn: 0, bank: 0 }, { length: 100, turn: 0, bank: 0 }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30, bank: b })), { length: 150, turn: 0, bank: 0 }] };
function makeBase(layout, bank, cup) { let b = D.createDoc('even'); for (const p of LAYOUT[layout](bank)) b = TB.extendCorner(b, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: p.bank, width: 12, turnAs: 'corner', ...(cup === undefined ? {} : { cup }) })); return b; }
const ROADS = { Bminus: makeBase('plan', -20), F: makeBase('plan', 0) };
const out = { started: new Date().toISOString(), base: BASE, gesture: 'a level mouse move, 45 px outward from the press', view: 'the page focus at s 330 (preview.js focus: 35 m up along the road normal, 45 m back)', runs: [], errors: [], titles: [] };

function serve(today) {
  const srv = http.createServer((q, s) => {
    const rel = decodeURIComponent(q.url.split('?')[0]), p = path.normalize(path.join(T, rel));
    if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    if (today && rel === '/app/core/zonegrab.js') { s.writeHead(200, { 'content-type': 'text/javascript', 'cache-control': 'no-store' }); s.end(todayZG); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); s.end(b); });
  });
  return new Promise((r) => srv.listen(0, '127.0.0.1', () => r(srv)));
}
const pre = (text) => `(() => {
  document.title = 'zz-headless-test';
  let left = ${JSON.stringify(JSON.stringify({ schema: 1, kind: 'core', name: null, doc: text }))};
  window.__saved = null;
  window.__TAURI__ = { core: { invoke: (cmd, args) => { if (cmd === 'open_autosave') { const t = left; left = null; return Promise.resolve(t); } if (cmd === 'save_autosave') { window.__saved = args.text; return Promise.resolve(); } if (/^list_/.test(cmd)) return Promise.resolve([]); return Promise.resolve(null); } } };
})();`;

(async () => {
  const CH = chromePath(); if (!CH) throw new Error('no Chrome');
  const servers = { today: await serve(true), slope: await serve(false) };
  const { ch, dir, tgt } = await launchChrome(CH, [`--window-size=${W},${H}`], 't180l271-');
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => { if (d.method === 'Runtime.exceptionThrown') out.errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 500)}`); return d.result.result.value; };
  const mouse = (type, x, y, o = {}) => send('Input.dispatchMouseEvent', { type, x, y, button: o.button || 'none', buttons: o.buttons || 0, clickCount: o.clickCount || 0 });
  const key = (type, k, code, vk) => send('Input.dispatchKeyEvent', { type, key: k, code, windowsVirtualKeyCode: vk });
  const tap = async (k, code, vk) => { await key('keyDown', k, code, vk); await key('keyUp', k, code, vk); };
  const shot = async (name) => { const d = await send('Page.captureScreenshot', { format: 'png' }); const f = path.join(OUT, `${name}.png`); fs.writeFileSync(f, Buffer.from(d.result.data, 'base64')); return f; };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  try {
    for (const road of ['Bminus', 'F']) for (const grab of ['today', 'slope']) {
      const run = { road, grab }; out.runs.push(run);
      const doc = ROADS[road], text = D.serialize(doc), base = `http://127.0.0.1:${servers[grab].address().port}`;
      await send('Page.navigate', { url: `${base}/app/lib/cjs.js` }); await sleep(800);
      await ev(`localStorage.clear(); localStorage.setItem('t180.guide.done', '1'); return true;`);
      const id = (await send('Page.addScriptToEvaluateOnNewDocument', { source: pre(text) })).result.identifier;
      await send('Page.navigate', { url: `${base}/app/index.html` });
      for (let i = 0; i < 200; i++) { await sleep(200); try { if (await ev("return !!document.querySelector('#palette input[aria-label]') && document.querySelectorAll('#stage canvas').length >= 2 && [...document.querySelectorAll('button')].some((b) => b.textContent.trim() === 'Restore it');")) break; } catch (e) { /* loading */ } }
      await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: id });
      await ev("document.title = 'zz-headless-test'; return true;"); out.titles.push(await ev('return document.title;'));
      await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Skip'); if (b && b.offsetParent) b.click(); return true;");
      run.restored = await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Restore it'); if (!b) return false; b.click(); return true;");
      await sleep(3000);
      run.guideClosed = await ev("const g = [...document.querySelectorAll('button')].filter((x) => x.textContent.trim() === '✕' && x.offsetParent); g.forEach((b) => b.click()); return g.length;"); await sleep(300);
      // Sculpt, Grab, radius 30 (sculpt-frame.test.js sculptTool's way)
      await ev('document.activeElement && document.activeElement.blur && document.activeElement.blur(); return true;');
      await tap('Tab', 'Tab', 9); await sleep(300); await tap('1', 'Digit1', 49); await sleep(300);
      run.radius = await ev(`const rad = [...document.querySelectorAll('input')].find((e) => e.offsetParent && /radius/i.test(e.getAttribute('aria-label') || e.title || '')); if (!rad) return null; rad.value = '30'; rad.dispatchEvent(new Event('input', { bubbles: true })); rad.dispatchEvent(new Event('change', { bubbles: true })); return rad.value;`);
      await ev(`document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: ${S} } })); return true;`); await sleep(2500);
      const view = await ev(`let v = null; document.dispatchEvent(new CustomEvent('t180:view', { detail: { reply: (x) => { v = x; } } })); const r = document.querySelector('#preview canvas').getBoundingClientRect(); return { pose: v && v.pose, mode: v && v.mode, box: [r.left, r.top, r.width, r.height] };`);
      run.pose = view.pose; run.box = view.box;
      const VP = M.viewProj(view.pose, view.box[2] / view.box[3]), px = (p) => { const c = M.apply(VP, p); return [view.box[0] + (c[0] / c[3] * 0.5 + 0.5) * view.box[2], view.box[1] + (1 - (c[1] / c[3] * 0.5 + 0.5)) * view.box[3]]; };
      // the rim at s 330, u -1, and where pulled 4 m straight out puts it (D's pull: along -R, the outward of the right rim)
      const A0 = toPath(doc), m0 = A0.path.samples.reduce((a, x) => (Math.abs(x.s - S) < Math.abs(a.s - S) ? x : a)), fr = ZG.frameAt(A0.path, A0.segments, m0.s, -1);
      const rim = ZG.acrossAt(A0.path, A0.segments, m0, -1).pos, target = rim.map((x, k) => x - fr.R[k] * PULL);
      const [x0, y0] = px(rim).map(Math.round), xt = px(target)[0], x1 = x0 + Math.sign(xt - x0) * 45, y1 = y0;
      run.press = [x0, y0]; run.pointer = [x1, y1];
      run.pick = await ev(`let h = null; const r = document.querySelector('#preview canvas').getBoundingClientRect(); document.dispatchEvent(new CustomEvent('t180-pick', { detail: { x: ${x0} - r.left, y: ${y0} - r.top, reply: (v) => { h = v; } } })); return h ? { s: h.s, u: h.u } : null;`);
      await mouse('mouseMoved', x0, y0); await sleep(150);
      await mouse('mousePressed', x0, y0, { button: 'left', buttons: 1, clickCount: 1 });
      for (let i = 1; i <= 12; i++) { await mouse('mouseMoved', Math.round(x0 + ((x1 - x0) * i) / 12), Math.round(y0 + ((y1 - y0) * i) / 12), { buttons: 1 }); await sleep(60); }
      await sleep(900);
      run.valueLine = await ev(`const w = [...document.querySelectorAll('body *')].filter((e) => e.childElementCount === 0 && e.offsetParent && /at the point|far edge stays|within \\d+ m/.test(e.textContent)).map((e) => e.textContent.trim()); return [...new Set(w)].slice(0, 6);`);
      const cross = (x, y, c) => ev(`const d = document.createElement('div'); d.className = 'zz-cross'; d.style.cssText = 'position:fixed;left:${x - 14}px;top:${y - 14}px;width:28px;height:28px;pointer-events:none;z-index:99999;border:2px solid ${c};border-radius:50%;box-sizing:border-box'; const h = document.createElement('div'); h.style.cssText = 'position:absolute;left:12px;top:-8px;width:2px;height:40px;background:${c}'; const v = document.createElement('div'); v.style.cssText = 'position:absolute;top:12px;left:-8px;height:2px;width:40px;background:${c}'; d.append(h, v); document.body.append(d); return true;`);
      await cross(x1, y1, '#ffe600');
      run.shotDuring = await shot(`${road}_${grab}_1_during`);
      await ev("document.querySelectorAll('.zz-cross').forEach((e) => e.remove()); return true;");
      await mouse('mouseReleased', x1, y1, { button: 'left', buttons: 0, clickCount: 1 });
      for (let i = 0; i < 40 && !(await ev('return !!window.__saved;')); i++) await sleep(250);
      await sleep(1500);
      const saved = await ev('return window.__saved;');
      if (saved) {
        const j = JSON.parse(saved), after = D.parse(j.doc || j), A1 = toPath(after), m1 = A1.path.samples.reduce((a, x) => (Math.abs(x.s - m0.s) < Math.abs(a.s - m0.s) ? x : a));
        const rim1 = ZG.acrossAt(A1.path, A1.segments, m1, -1).pos, c0 = ZG.acrossAt(A0.path, A0.segments, m0, 0).pos, c1 = ZG.acrossAt(A1.path, A1.segments, m1, 0).pos, p1 = px(rim1);
        run.after = { rimPx: p1.map((v) => Math.round(v * 10) / 10), pointerToRimPx: Math.round(Math.hypot(p1[0] - x1, p1[1] - y1) * 10) / 10, rimToTargetM: Math.round(Math.hypot(...rim1.map((v, k) => v - target[k])) * 1e4) / 1e4,
          rimUpM: Math.round((rim1[1] - rim[1]) * 1e4) / 1e4, centreUpM: Math.round((c1[1] - c0[1]) * 1e4) / 1e4, bankAtSdeg: Math.round(D.channelAt(after.pieces[0], 'phi', 0).v * 1e4) / 1e4 };
        // the bank at s 330 before and after
        const off = (d) => { let a = 0; for (const P of d.pieces) { if (S >= a && S <= a + P.length) return D.channelAt(P, 'phi', S - a).v * 180 / Math.PI; a += P.length; } return NaN; };
        run.after.bankBeforeDeg = Math.round(off(doc) * 1e4) / 1e4; run.after.bankAfterDeg = Math.round(off(after) * 1e4) / 1e4; delete run.after.bankAtSdeg;
        await cross(Math.round(p1[0]), Math.round(p1[1]), '#00e5ff');
      }
      await cross(x1, y1, '#ffe600');
      run.shotAfter = await shot(`${road}_${grab}_2_after`);
      await ev("document.querySelectorAll('.zz-cross').forEach((e) => e.remove()); return true;");
      // THE SIDE VIEW: from the focus pose, fly right (D) and down (Q) with the page's own keys, reading the pose back, then turn left (right-button drag) until the
      // view looks at the station across the road
      await mouse('mouseMoved', Math.round(W / 2), Math.round(H / 2));
      const poseNow = async () => (await ev(`let v = null; document.dispatchEvent(new CustomEvent('t180:view', { detail: { reply: (x) => { v = x; } } })); return v && v.pose;`));
      const hold = async (k, code, vk, ms) => { await key('keyDown', k, code, vk); await sleep(ms); await key('keyUp', k, code, vk); await sleep(150); };
      const outward = fr.R.map((v) => -v), want = rim.map((v, k) => v + outward[k] * 28 + [0, 3, 0][k]);   // 30 m outside the outer rim, 4 m above it
      // each key's world move per ms, learned from one 200 ms tap (the free camera's own speed; Shift never held)
      const KEYS = { d: ['d', 'KeyD', 68], w: ['w', 'KeyW', 87], e: ['e', 'KeyE', 69] }, vel = {};
      for (const [k, spec] of Object.entries(KEYS)) { const p0 = await poseNow(); await hold(...spec, 200); const p1 = await poseNow(); vel[k] = p1.eye.map((v, i) => (v - p0.eye[i]) / 200); }
      run.keyVel = vel;
      for (let i = 0; i < 12; i++) {
        const p = await poseNow(), dv = want.map((v, k) => v - p.eye[k]); if (Math.hypot(...dv) < 2) break;
        // solve dv = a·vd + b·vw + c·ve (3x3), then hold each key (its opposite for a negative time) at most 400 ms a step
        const A = [vel.d, vel.w, vel.e], det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
        const cols = (c) => [0, 1, 2].map((row) => [0, 1, 2].map((col) => (col === c ? dv[row] : A[col][row]))), M3 = [0, 1, 2].map((row) => [0, 1, 2].map((col) => A[col][row])), dd = det(M3);
        const ms = [0, 1, 2].map((c) => det(cols(c)) / dd), opp = { d: ['a', 'KeyA', 65], w: ['s', 'KeyS', 83], e: ['q', 'KeyQ', 81] };
        ['d', 'w', 'e'].forEach((k, c) => { ms[c] = Math.max(-400, Math.min(400, ms[c])); });
        for (const [c, k] of ['d', 'w', 'e'].entries()) if (Math.abs(ms[c]) >= 15) await hold(...(ms[c] > 0 ? KEYS[k] : opp[k]), Math.round(Math.abs(ms[c])));
      }
      // turn to look at the rim's station: right-button drag, dx px * 0.004 rad (preview.js onMove)
      for (let i = 0; i < 8; i++) {
        const p = await poseNow(), look = [p.target[0] - p.eye[0], p.target[2] - p.eye[2]], to = [rim[0] - p.eye[0], rim[2] - p.eye[2]];
        const ang = Math.atan2(look[0] * to[1] - look[1] * to[0], look[0] * to[0] + look[1] * to[1]); if (Math.abs(ang) < 0.02) break;
        const hz = Math.hypot(rim[0] - p.eye[0], rim[2] - p.eye[2]), pitchWant = Math.atan2(rim[1] - p.eye[1], hz), lk = [p.target[0] - p.eye[0], p.target[1] - p.eye[1], p.target[2] - p.eye[2]], pitchNow = Math.atan2(lk[1], Math.hypot(lk[0], lk[2]));
        const sgn = run.lookSign || 1, dx = Math.round(sgn * ang / 0.004), dy = Math.round(-(pitchWant - pitchNow) / 0.004), cx = Math.round(W / 2), cy = Math.round(H / 2);
        await mouse('mousePressed', cx, cy, { button: 'right', buttons: 2, clickCount: 1 }); const ex = cx + Math.max(-600, Math.min(600, dx)), ey = cy + Math.max(-300, Math.min(300, dy)); await mouse('mouseMoved', ex, ey, { buttons: 2 }); await mouse('mouseReleased', ex, ey, { button: 'right', buttons: 0, clickCount: 1 }); await sleep(200);
        if (i === 0) { const q = await poseNow(), lq = [q.target[0] - q.eye[0], q.target[2] - q.eye[2]], a2 = Math.atan2(lq[0] * to[1] - lq[1] * to[0], lq[0] * to[0] + lq[1] * to[1]); if (Math.abs(a2) > Math.abs(ang)) run.lookSign = -sgn; }
      }
      run.sidePose = await poseNow(); await sleep(800);
      run.shotSide = await shot(`${road}_${grab}_3_side`);
    }
  } catch (e) { out.errors.push(String(e && e.stack || e).slice(0, 800)); }
  out.ended = new Date().toISOString();
  fs.writeFileSync(path.join(OUT, 'page271b.json'), JSON.stringify(out, null, 1));
  try { ws.close(); } catch (e) { /* */ } ch.kill(); for (const s of Object.values(servers)) s.close(); await sleep(500); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  console.log(JSON.stringify(out.runs.map((r) => ({ road: r.road, grab: r.grab, pick: r.pick, valueLine: r.valueLine, after: r.after })), null, 1)); console.log('errors', out.errors.length, out.errors.slice(0, 3));
})().catch((e) => { console.error(e); process.exit(1); });
