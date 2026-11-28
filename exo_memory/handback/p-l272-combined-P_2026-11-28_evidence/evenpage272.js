// evenpage272.js <worktree> <out dir>: pane P, L272 item 5, the picture "an Even with the edge kept, showing its sentence", ON THE BUILT PAGE of the combined merge.
// Frame: B's page271c.js (handback/p-l271-grab-slope-B_2026-11-28_evidence/), its serve, restore-as-autosave and projection, cut to this case.
// The road: A's plan 1 case ("start 0..1, a grab at 30", right edge kept; handback/p-l271-even-a0-A_2026-11-28.md 3.7), made with the tree's own fixture code
// (test/even_fixtures.js: the 'plan' layout with no bank, then its grab(): the outer rim at s 30 pulled until the width there reads 16 m).
// On the page: the road restored; pieces 0 and 1 selected by a click and a Shift-click on the preview (the page's own pick); the Even box set to 16 m, keeps
// "right edge"; Even pressed; the page's status line read once the check has landed. Shots: before Even, and after with the sentence. A control in node
// runs the same Even through the tree's shell (selectPiece 0, 1; evenRun) and its sentence must be the page's, character for character.
// Headless Chrome through the tree's launcher (--headless=new, --mute-audio, never focused), title zz-headless-test before the page's script. Nothing saved.
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, OUT] = process.argv.slice(2), T = path.resolve(T0); fs.mkdirSync(OUT, { recursive: true });
const { chromePath, launchChrome, connect } = require(path.join(T, 'app/test/soundrender.js'));
const D = require(path.join(T, 'src/core/document.js')), F = require(path.join(T, 'test/even_fixtures.js'));
const { toPath } = require(path.join(T, 'src/core/adapter.js')), M = require(path.join(T, 'app/camera/math.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const W = 1400, H = 860, VALUE = 16, HOLD = 'right', FOCUS = 40, PICK_S = [75, 150];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.css': 'text/css' };
const out = { started: new Date().toISOString(), case: 'A plan 1: the plan layout with no bank, one grab at s 30 to 16 m; Even pieces 0..1 to 16 m, keeps the right edge', errors: [], titles: [] };

function serve() {
  const srv = http.createServer((q, s) => {
    const rel = decodeURIComponent(q.url.split('?')[0]), p = path.normalize(path.join(T, rel));
    if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
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
  // the road, and the control in node
  const sh0 = await F.shellOn(F.build(F.LAYOUT.plan(0)));
  F.grab(sh0, 30, VALUE);
  const doc = F.present(sh0), text = D.serialize(doc);
  out.pieces = doc.pieces.length; out.pieceLengths = doc.pieces.slice(0, 3).map((P) => P.length);
  const shC = await F.shellOn(doc);
  shC.selectPiece(0); shC.selectPiece(1, { extend: true });
  shC.evenRun({ value: String(VALUE), hold: HOLD });
  out.nodeFirst = shC.getState().message || '';
  if (typeof shC.whenEvenChecked === 'function') await shC.whenEvenChecked();
  out.nodeSentence = shC.getState().message || '';
  out.nodeEvenDoc = D.serialize(F.present(shC)) !== text;

  const CH = chromePath(); if (!CH) throw new Error('no Chrome');
  const srv = await serve(), base = `http://127.0.0.1:${srv.address().port}`;
  const { ch, dir, tgt } = await launchChrome(CH, [`--window-size=${W},${H}`], 't180l272e-');
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => { if (d.method === 'Runtime.exceptionThrown') out.errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 500)}`); return d.result.result.value; };
  const mouse = (type, x, y, o = {}) => send('Input.dispatchMouseEvent', { type, x, y, button: o.button || 'none', buttons: o.buttons || 0, clickCount: o.clickCount || 0, modifiers: o.modifiers || 0 });
  const shot = async (name) => { const d = await send('Page.captureScreenshot', { format: 'png' }); const f = path.join(OUT, `${name}.png`); fs.writeFileSync(f, Buffer.from(d.result.data, 'base64')); return f; };
  const status = () => ev("const m = document.querySelector('p.message[role=status]'); return m ? m.textContent.trim() : null;");
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  try {
    await send('Page.navigate', { url: `${base}/app/lib/cjs.js` }); await sleep(800);
    await ev(`localStorage.clear(); localStorage.setItem('t180.guide.done', '1'); return true;`);
    const id = (await send('Page.addScriptToEvaluateOnNewDocument', { source: pre(text) })).result.identifier;
    await send('Page.navigate', { url: `${base}/app/index.html` });
    for (let i = 0; i < 200; i++) { await sleep(200); try { if (await ev("return !!document.querySelector('#palette input[aria-label]') && document.querySelectorAll('#stage canvas').length >= 2 && [...document.querySelectorAll('button')].some((b) => b.textContent.trim() === 'Restore it');")) break; } catch (e) { /* loading */ } }
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: id });
    await ev("document.title = 'zz-headless-test'; return true;"); out.titles.push(await ev('return document.title;'));
    await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Skip'); if (b && b.offsetParent) b.click(); return true;");
    out.restored = await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Restore it'); if (!b) return false; b.click(); return true;");
    await sleep(3000);
    out.guideClosed = await ev("const g = [...document.querySelectorAll('button')].filter((x) => x.textContent.trim() === '✕' && x.offsetParent); g.forEach((b) => b.click()); return g.length;"); await sleep(300);
    await ev(`document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: ${FOCUS} } })); return true;`); await sleep(2500);
    const view = await ev(`let v = null; document.dispatchEvent(new CustomEvent('t180:view', { detail: { reply: (x) => { v = x; } } })); const r = document.querySelector('#preview canvas').getBoundingClientRect(); return { pose: v && v.pose, box: [r.left, r.top, r.width, r.height] };`);
    const VP = M.viewProj(view.pose, view.box[2] / view.box[3]), px = (p) => { const c = M.apply(VP, p); return [view.box[0] + (c[0] / c[3] * 0.5 + 0.5) * view.box[2], view.box[1] + (1 - (c[1] / c[3] * 0.5 + 0.5)) * view.box[3]]; };
    const A0 = toPath(doc), mid = (s) => A0.path.samples.reduce((a, x) => (Math.abs(x.s - s) < Math.abs(a.s - s) ? x : a)).pos;
    out.clicks = [];
    for (const [k, s] of PICK_S.entries()) {
      const [x, y] = px(mid(s)).map(Math.round);
      if (!(x >= view.box[0] + 5 && x <= view.box[0] + view.box[2] - 5 && y >= view.box[1] + 5 && y <= view.box[1] + view.box[3] - 5)) throw new Error(`the click at s ${s} projects to (${x}, ${y}), outside the preview ${JSON.stringify(view.box)}: no selection made`);
      const pick = await ev(`let h = null; const r = document.querySelector('#preview canvas').getBoundingClientRect(); document.dispatchEvent(new CustomEvent('t180-pick', { detail: { x: ${x} - r.left, y: ${y} - r.top, reply: (v) => { h = v; } } })); return h ? { s: h.s, u: h.u } : null;`);
      const mod = k === 0 ? 0 : 8;   // 8 = Shift
      await mouse('mouseMoved', x, y, { modifiers: mod }); await sleep(100);
      await mouse('mousePressed', x, y, { button: 'left', buttons: 1, clickCount: 1, modifiers: mod }); await sleep(60);
      await mouse('mouseReleased', x, y, { button: 'left', buttons: 0, clickCount: 1, modifiers: mod }); await sleep(500);
      out.clicks.push({ s, x, y, pick });
    }
    out.selectionText = await status();
    out.selected = await ev("let n = null; document.dispatchEvent(new CustomEvent('t180:selection-request', { detail: { reply: (x) => { n = x; } } })); return n ? JSON.stringify(n).slice(0, 300) : null;");
    out.shotBefore = await shot('even_1_selected');
    out.box = await ev(`const box = document.querySelector('details[aria-label="even the width"]'); if (!box) return 'no Even box'; box.open = true;
      const w = box.querySelector('input'), k = box.querySelector('select[aria-label="even keeps"]'); if (!w || !k) return 'no fields';
      w.value = '${VALUE}'; w.dispatchEvent(new Event('input', { bubbles: true })); w.dispatchEvent(new Event('change', { bubbles: true }));
      k.value = '${HOLD}'; k.dispatchEvent(new Event('change', { bubbles: true }));
      const go = [...box.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Even'); if (!go) return 'no Even button'; go.click(); return 'pressed';`);
    out.pageFirst = await status();
    let last = null;
    for (let i = 0; i < 120; i++) { await sleep(500); const t = await status(); if (t && t === last && i > 6) break; last = t; }
    out.pageSentence = await status();
    out.sameAsNode = out.pageSentence === out.nodeSentence;
    await ev(`document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: ${FOCUS} } })); return true;`); await sleep(2000);
    out.statusShown = await ev("const m = document.querySelector('p.message[role=status]'); if (!m) return null; m.scrollIntoView({ block: 'center' }); const r = m.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];"); await sleep(400);
    out.shotAfter = await shot('even_2_after_sentence');
  } catch (e) { out.errors.push(String(e && e.stack || e).slice(0, 800)); }
  out.ended = new Date().toISOString();
  fs.writeFileSync(path.join(OUT, 'evenpage272.json'), JSON.stringify(out, null, 1));
  try { ws.close(); } catch (e) { /* */ } ch.kill(); srv.close(); await sleep(500); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  console.log(JSON.stringify({ clicks: out.clicks, selectionText: out.selectionText, box: out.box, nodeSentence: out.nodeSentence, pageSentence: out.pageSentence, sameAsNode: out.sameAsNode, errors: out.errors.slice(0, 3) }, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
