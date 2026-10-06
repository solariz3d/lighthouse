const click = (sel, text) => `(() => { const b = [...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => x.textContent.trim() === ${JSON.stringify(text)}); if (!b) throw new Error('no button ${text}'); if (b.disabled) return 'disabled'; b.click(); return 'clicked'; })()`;
const status = `(() => ({ status: document.getElementById('status').textContent, info: (document.querySelector('#palette p.head') || {}).textContent, msg: [...document.querySelectorAll('#palette .message')].map((m) => m.textContent).filter(Boolean).join(' | ') }))()`;
const openTrack = (name) => `(async () => { const o = document.getElementById('open'); o.replaceChildren(new Option('x', ''), new Option(${JSON.stringify(name)}, ${JSON.stringify(name)})); o.value = ${JSON.stringify(name)}; await o.onchange({ target: o }); return true; })()`;
// IN-PAGE STOPWATCH: t0 at the click, then every 25 ms (a timer, so a frozen page cannot sample) what the page shows. Also the largest gap between animation frames and between the timer's own ticks:
// a page that is frozen by the check shows one huge gap; a page that is not shows only the ghost's build.
const measure = (label, clickJs, previewAria, applyText) => `(async () => {
  const q = (aria) => document.querySelector('[aria-label=' + JSON.stringify(aria) + ']'), apply = () => [...document.querySelectorAll('button')].find((b) => b.textContent === ${JSON.stringify(applyText)});
  const t0 = performance.now(), out = { label: ${JSON.stringify(label)}, samples: [], tPreview: null, tApplyOn: null, tCheckLine: null, maxFrameGap: 0, maxTickGap: 0, seenSeconds: [] };
  let lastF = t0, lastT = t0, raf = 0, stop = false;
  const frame = () => { const n = performance.now(); out.maxFrameGap = Math.max(out.maxFrameGap, n - lastF); lastF = n; if (!stop) raf = requestAnimationFrame(frame); }; raf = requestAnimationFrame(frame);
  const r = ${clickJs}; out.click = r;
  await new Promise((done) => { const id = setInterval(() => {
    const n = performance.now(), el = q(${JSON.stringify(previewAria)}), text = el ? el.textContent : '', line = q('overlap check');
    out.maxTickGap = Math.max(out.maxTickGap, n - lastT); lastT = n;
    if (out.tPreview === null && /^Preview:/.test(text)) out.tPreview = Math.round(n - t0);
    if (line && /Checking/.test(line.textContent)) { if (out.tCheckLine === null) out.tCheckLine = Math.round(n - t0); const m = /… (\\d+) s/.exec(line.textContent); if (m && !out.seenSeconds.includes(+m[1])) out.seenSeconds.push(+m[1]); }
    const a = apply(); if (a && !a.disabled && out.tApplyOn === null && out.tPreview !== null) { out.tApplyOn = Math.round(n - t0); out.finalLine = line ? line.textContent : null; out.applyDisplay = a.style.display; }
    if (out.tApplyOn !== null || n - t0 > 90000) { clearInterval(id); done(); } }, 25); });
  stop = true; cancelAnimationFrame(raf); out.maxFrameGap = Math.round(out.maxFrameGap); out.maxTickGap = Math.round(out.maxTickGap); out.total = Math.round(performance.now() - t0); return out;
})()`;

(async () => {
  let A = null, cleaned = false;
  const cleanup = () => {
    if (cleaned) return; cleaned = true;
    const keeperAfter = snapshot(keeperDir), kk = new Set([...Object.keys(keeperBefore), ...Object.keys(keeperAfter)]);
    report.keeperFiles = Object.keys(keeperBefore).length; report.keeperChanged = [...kk].filter((x) => keeperBefore[x] !== keeperAfter[x]);
    report.runAppData = Object.keys(snapshot(dataDir)).sort(); report.ended = new Date().toISOString();
    fs.writeFileSync(path.join(out, 'timing_report.json'), JSON.stringify(report, null, 1));
  };
  const hard = setTimeout(() => { if (A) A.kill(); report.error = 'hard timeout'; step('HARD TIMEOUT'); setTimeout(() => { cleanup(); console.error('hard timeout, cleaned up'); process.exit(2); }, 2000); }, 600000);
  const k = new Proxy(report.checks, { set(t, p, v) { t[p] = v; step(`CHECK ${String(p)} ${String(JSON.stringify(v)).slice(0, 700)}`); return true; } });
  try {
    A = await launch();
    const shot = async (name) => { const r = await A.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name), Buffer.from(r.data, 'base64')); return name; };
    const mouse = async (x, y) => { await A.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); await A.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 }); await A.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1 }); await sleep(600); };
    const where = (id) => A.ev(`(() => { const st = document.getElementById('preview'), r = st.getBoundingClientRect(); let track = null; document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (t) => { track = t; } } }));
      let acc = 0; const spans = track.segments.map((g) => { const a = acc; acc += g.length; return { id: g.id, a, b: acc }; }); let best = null;
      for (let y = 10; y < r.height - 10; y += 6) for (let x = 10; x < r.width - 10; x += 6) { if (y + r.top < 215 && x + r.left > 1020) continue; let h = null; document.dispatchEvent(new CustomEvent('t180-pick', { detail: { x, y, reply: (v) => { h = v; } } })); if (!h || !Number.isFinite(h.s) || h.px > 12) continue; const sp = spans.find((q) => h.s >= q.a && h.s < q.b); if (!sp || sp.id !== ${JSON.stringify(id)}) continue; if (!best || h.px < best.px) best = { x: x + r.left, y: y + r.top, px: h.px, s: h.s }; }
      return best; })()`);
    k.start = await A.ev(status);
    // ── the MIDDLE DELETE on the 46-piece, 13.1 km track ──
    await A.ev(openTrack('big46')); await sleep(2500); k.big46 = await A.ev(status);
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'overhead' } }))`); await sleep(2500);
    let pick = null, pid = null; for (const id of ['p43', 'p42', 'p44', 'p41', 'p40', 'p38', 'p30', 'p21']) { pick = await where(id); if (pick) { pid = id; break; } } k.picked = { id: pid, at: pick }; if (!pick) throw new Error('no middle piece is pickable on screen');
    await mouse(pick.x, pick.y); k.selected = await A.ev(`(document.querySelector('[aria-label="selection"]') || {}).textContent`);
    k.delete = await A.ev(measure('middle delete, 46 pieces, 13.1 km', `(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent === 'Delete selected'); b.click(); return 'clicked'; })()`, 'delete preview', 'Apply delete'));
    await shot('t1_delete_after_check.png');
    // Cancel while it checks: Apply must never come on, and the page must stay alive
    await A.ev(click('button', 'Cancel delete')); await sleep(500);
    k.deleteCancelMid = await A.ev(`(async () => { const t0 = performance.now(); const b = [...document.querySelectorAll('button')].find((x) => x.textContent === 'Delete selected'); b.click(); await new Promise((r) => setTimeout(r, 1500));
      const mid = { previewShown: /^Preview:/.test((document.querySelector('[aria-label="delete preview"]') || {}).textContent || ''), line: (document.querySelector('[aria-label="overlap check"]') || {}).textContent || null, applyDisabled: ([...document.querySelectorAll('button')].find((x) => x.textContent === 'Apply delete') || {}).disabled };
      [...document.querySelectorAll('button')].find((x) => x.textContent === 'Cancel delete').click(); await new Promise((r) => setTimeout(r, 14000));
      const after = { previewText: (document.querySelector('[aria-label="delete preview"]') || {}).textContent || '', applyDisplay: ([...document.querySelectorAll('button')].find((x) => x.textContent === 'Apply delete') || {}).style.display, msg: [...document.querySelectorAll('#palette .message')].map((m) => m.textContent).filter(Boolean).join(' | ') };
      return { mid, after, ms: Math.round(performance.now() - t0) }; })()`);
    // ── CLOSE on the 14.3 km near-closed lap ──
    await A.ev(openTrack('biglap')); await sleep(2500); k.biglap = await A.ev(status);
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'overhead' } }))`); await sleep(2500);
    k.close = await A.ev(measure('Close, 8 pieces, 14.3 km', `(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent === 'Close the loop'); b.click(); return 'clicked'; })()`, 'close preview', 'Apply'));
    await shot('t2_close_after_check.png');
    k.afterClose = await A.ev(status);
    A.close(); A.kill(); A = null;
  } catch (e) { report.error = e.stack || e.message; step('ERROR ' + report.error); if (A) A.kill(); } finally {
    clearTimeout(hard); await sleep(1500); cleanup();
  }
  console.log(JSON.stringify(report, null, 1));
})().catch((e) => { console.error('async_window: ' + e.message); process.exit(1); });
