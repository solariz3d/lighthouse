// focus_probe.js (pane A, L249): why row 13 reads `outline-style none, 3px` after b.focus({ focusVisible: true }). The real page of TREE in headless Chrome
// (the builder's launchChrome: --mute-audio, the browser cap; title zz-headless-test first and kept). Per look: four ways to focus the Extend button, and for
// each: is it document.activeElement, does it match :focus and :focus-visible, its computed outline, and which rules for it set an outline (CSS.getMatchedStylesForNode).
// usage: TREE=<builder tree> node focus_probe.js [look ...]
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = path.resolve(process.env.TREE);
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const LOOKS = process.argv.slice(2).length ? process.argv.slice(2) : ['sigil', 'aqua'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.css': 'text/css', '.wav': 'audio/wav' };
(async () => {
  const srv = http.createServer((q, s) => { const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; } fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); }); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1400,860'], 't180a-l249f-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result).slice(0, 400)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable'); await send('DOM.enable'); await send('CSS.enable');
  await ev("document.title = 'zz-headless-test'; return true;");
  await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 860, deviceScaleFactor: 1, mobile: false });
  const out = { chrome: (await send('Browser.getVersion')).result.product, looks: {} };
  const READ = `const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); const s = getComputedStyle(b);
    return { active: document.activeElement === b ? 'Extend' : (document.activeElement ? document.activeElement.tagName + (document.activeElement.id ? '#' + document.activeElement.id : '') : null),
      focus: b.matches(':focus'), focusVisible: b.matches(':focus-visible'), outline: [s.outlineStyle, s.outlineWidth, s.outlineOffset, s.outlineColor].join(' ') };`;
  const FOCUS_OPT = "const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.focus({ focusVisible: true }); return true;";
  for (const look of LOOKS) {
    const res = {};
    const load = async () => {
      await send('Page.navigate', { url: base.replace('index.html', 'lib/cjs.js') }); await sleep(300);
      await ev(`localStorage.clear(); localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); return true;`);
      await send('Page.navigate', { url: base });
      for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
      await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
    };
    // V1: as row 13 does it: the File menu open, the save dialog opened (askChoice focuses its first button), its veil removed by hand, then focus({ focusVisible })
    await load();
    await ev(`document.getElementById('m-file').open = true; await new Promise((r) => setTimeout(r, 150));
      const m = { exports: {} }; new Function('module', 'exports', await (await fetch('/app/askdialog.js')).text())(m, m.exports);
      m.exports.askChoice(document, { title: 'Save before closing?', message: 'x', cancelValue: 'cancel', buttons: [{ label: 'Cancel', value: 'cancel' }, { label: 'Save', value: 'save', kind: 'main', default: true }] });
      await new Promise((r) => setTimeout(r, 200)); for (const v of document.querySelectorAll('.ask-veil')) v.remove(); document.getElementById('m-file').open = false; return true;`);
    await ev(FOCUS_OPT); res.hasFocusBefore = await ev('return document.hasFocus();'); res.v1_asTheRow = await ev(READ);
    // V2: a fresh page, no dialog: focus({ focusVisible: true }) only
    await load(); await ev(FOCUS_OPT); res.v2_noDialog = await ev(READ);
    // V3: a fresh page, plain focus() (no option)
    await load(); await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.focus(); return true;"); res.v3_plainFocus = await ev(READ);
    // V4: keyboard focus, as a person reaches it: Tab pressed through CDP until Extend has focus (at most 80 presses)
    await load(); let n = 0;
    for (; n < 80; n++) { await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); if (await ev("return document.activeElement && document.activeElement.textContent.trim() === 'Extend';")) break; }
    res.v4_tab = { presses: n + 1, ...(await ev(READ)) };
    // V5: focus emulation on (Emulation.setFocusEmulationEnabled: the page acts as the focused window, as a person's window is), then focus({ focusVisible: true })
    await load(); await send('Emulation.setFocusEmulationEnabled', { enabled: true }); await ev(FOCUS_OPT); res.v5_emulated = { hasFocus: await ev('return document.hasFocus();'), ...(await ev(READ)) };
    // V6: focus emulation on, plain focus() with no option, no pointer used yet
    await load(); await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.focus(); return true;"); res.v6_emulatedPlain = await ev(READ);
    await send('Emulation.setFocusEmulationEnabled', { enabled: false });
    // which rules set an outline on the button in V4's state
    const doc = await send('DOM.getDocument', { depth: -1 }); const q = await send('DOM.querySelectorAll', { nodeId: doc.result.root.nodeId, selector: '#palette button' });
    let nodeId = null; for (const nid of q.result.nodeIds) { const o = await send('DOM.getOuterHTML', { nodeId: nid }); if (/>\s*Extend\s*</.test(o.result.outerHTML)) { nodeId = nid; break; } }
    await send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['focus', 'focus-visible'] });
    const mr = await send('CSS.getMatchedStylesForNode', { nodeId });
    res.rulesWithOutline = (mr.result.matchedCSSRules || []).filter((r) => r.rule.style.cssProperties.some((p) => /^outline/.test(p.name) && p.value)).map((r) => `${r.rule.selectorList.text} { ${r.rule.style.cssProperties.filter((p) => /^outline/.test(p.name) && p.value).map((p) => p.name + ': ' + p.value).join('; ')} }`);
    res.forced = await ev(READ.replace('return {', 'return { forced: true,'));
    out.looks[look] = res;
  }
  console.log(JSON.stringify(out, null, 1));
  try { ws.close(); } catch (e) { /* closing */ }
  ch.kill(); srv.close(); await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
})().catch((e) => { console.error(e); process.exit(1); });
