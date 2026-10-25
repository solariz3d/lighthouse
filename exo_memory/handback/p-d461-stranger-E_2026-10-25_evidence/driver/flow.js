// flow.js (D461): a first hour, by the page's own visible controls: name, extend, close, sculpt, save, export. Screens and text at each step.
'use strict';
const os = require('os'), fs = require('fs'), path = require('path');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) {}
const { start, sleep } = require('./page.js');
const UPTO = process.argv[2] || 'all';
const log = (...a) => console.log(...a);

(async () => {
  const p = await start();
  await sleep(7000);
  const H = `
    const vis = (e) => !!e && !!(e.offsetParent || e.getClientRects().length) && getComputedStyle(e).visibility !== 'hidden';
    const byLabel = (re, sel = 'input, select, button, summary') => [...document.querySelectorAll(sel)].find((e) => vis(e) && re.test((e.getAttribute('aria-label') || '') + ' ' + (e.title || '') + ' ' + (e.textContent || '')));
    const setNum = (e, v) => { e.focus(); e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); e.blur(); };
    const press = (e) => { e.dispatchEvent(new MouseEvent('click', { bubbles: true })); };
    const status = () => [...document.querySelectorAll('#status, .status, [role=status], .message, .msg')].filter(vis).map((e) => e.textContent.replace(/\\s+/g, ' ').trim()).filter(Boolean).join(' | ').slice(0, 600);
    const guide = () => { const g = document.querySelector('.guide-card'); return vis(g) ? g.textContent.replace(/\\s+/g, ' ').trim().slice(0, 300) : '(guide closed)'; };
    const panel = () => { const h = [...document.querySelectorAll('#palette *')].find((e) => /pieces ·/.test(e.textContent) && e.children.length === 0); return h ? h.textContent.trim() : '?'; };
    const checker = () => { const v = document.querySelector('#validation'); return v ? v.textContent.replace(/\\s+/g, ' ').trim().slice(0, 700) : '(no #validation)'; };
  `;
  const ev = (body) => p.ev(H + body);
  const state = async (tag) => { const s = await ev(`return { panel: panel(), status: status(), guide: guide(), checker: checker() };`); log(`\n[${tag}]`, JSON.stringify(s, null, 1)); log('shot', await p.shot(tag)); return s; };

  // 1. name the track, the way the README's step 4 says (type a name)
  log(await ev(`const n = document.getElementById('name'); n.focus(); n.value = 'stranger lap'; n.dispatchEvent(new Event('input', { bubbles: true })); n.dispatchEvent(new Event('change', { bubbles: true })); n.blur(); return n.value;`));
  // 2. extend: a straight, then turns of 90 degrees with straights between, as the guide says (set a length and a turn, press Extend)
  const extend = async (len, turn) => ev(`
    const L = byLabel(/metres added/), T = byLabel(/degrees this piece turns/); if (!L || !T) return 'fields not found';
    setNum(L, ${len}); setNum(T, ${turn === null ? "''" : turn});
    const b = [...document.querySelectorAll('button')].find((e) => vis(e) && e.textContent.trim() === 'Extend'); if (!b) return 'no Extend button'; press(b);
    await new Promise((r) => setTimeout(r, 1500)); return panel() + ' :: ' + status();`);
  const plan = [[200, 0], [150, 90], [200, 0], [150, 90], [200, 0], [150, 90], [150, 0]];
  for (const [l, t] of plan) log('extend', l, t, '->', await extend(l, t));
  await state('02-extended');
  if (UPTO === 'extend') { await finish(p); return; }

  // 3. close the loop: Build menu, then its Close item
  log(await ev(`const m = document.getElementById('m-build'); m.open = true; await new Promise((r) => setTimeout(r, 300));
    return [...m.querySelectorAll('button, [role=menuitem], label, a')].filter(vis).map((e) => (e.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 70)).join(' || ');`));
  log(await ev(`const m = document.getElementById('m-build'); const b = [...m.querySelectorAll('button, [role=menuitem]')].find((e) => vis(e) && /close the loop/i.test(e.textContent)); if (!b) return 'no Close item'; press(b); await new Promise((r) => setTimeout(r, 6000)); return status();`));
  await state('03-close-pressed');
  // an Apply, if the close shows a ghost first (README step 3)
  log('apply:', await ev(`const b = [...document.querySelectorAll('button')].find((e) => vis(e) && /^apply/i.test(e.textContent.trim())); if (!b) return 'no Apply button visible'; press(b); await new Promise((r) => setTimeout(r, 3000)); return status();`));
  await state('04-closed');
  fs.writeFileSync(path.join(__dirname, '..', 'state-after-close.json'), JSON.stringify(await ev(`return { panel: panel() };`)));
  if (UPTO === 'close') { await finish(p); return; }
  // 4. Sculpt: the Overhead view to see the lap, then Build > Sculpt mode
  log('overhead:', await ev(`const b = [...document.querySelectorAll('button')].find((e) => vis(e) && e.textContent.trim() === 'Overhead'); if (!b) return 'no Overhead'; press(b); await new Promise((r) => setTimeout(r, 2500)); return 'ok';`));
  await state('05-overhead');
  log('sculpt menu item:', await ev(`const m = document.getElementById('m-build'); m.open = true; await new Promise((r) => setTimeout(r, 300)); const e = [...m.querySelectorAll('*')].find((x) => vis(x) && x.children.length <= 2 && /sculpt mode/i.test(x.textContent)); const out = e ? e.tagName + ' ' + e.outerHTML.slice(0, 200) : 'none'; m.open = false; return out;`));
  await ev(`document.activeElement && document.activeElement.blur(); return 1;`);
  for (const type of ['keyDown', 'keyUp']) await p.send('Input.dispatchKeyEvent', { type, key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await sleep(2000);
  log('sculpt (Tab):', await ev(`return status();`));
  log('sculpt strip:', await ev(`const st = document.querySelector('.brush-strip'); return st && vis(st) ? st.textContent.replace(/\\s+/g, ' ').trim().slice(0, 600) : '(no strip visible)';`));
  await state('06-sculpt-mode');
  if (UPTO === 'sculptlook') { await finish(p); return; }
  // the tool on key 3 (Bend), then a drag on the right-hand straight of the lap, as a mouse would
  for (const type of ['keyDown', 'keyUp']) await p.send('Input.dispatchKeyEvent', { type, key: '3', code: 'Digit3', windowsVirtualKeyCode: 51, text: type === 'keyDown' ? '3' : undefined });
  await sleep(800);
  log('tool now:', await ev(`const s = document.querySelector('.brush-strip select'); return s ? s.options[s.selectedIndex].text : '?';`));
  const M = (type, x, y, buttons) => p.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons, clickCount: 1, pointerType: 'mouse' });
  const [x0, y0] = [990, 470];
  await M('mouseMoved', x0, y0, 0); await sleep(1200);
  await p.shot('07-bend-hover');
  await M('mousePressed', x0, y0, 1); await sleep(300);
  for (let i = 1; i <= 12; i++) { await M('mouseMoved', x0 + i * 8, y0, 1); await sleep(120); }
  await p.shot('08-bend-dragging');
  log('during drag:', await ev(`return status();`));
  await M('mouseReleased', x0 + 96, y0, 0); await sleep(5000);
  await state('09-bend-released');
  // what the bend left in the document: the autosave before the drag against the one after
  const A = p.autosaves; fs.writeFileSync(path.join(__dirname, '..', 'autosaves.json'), JSON.stringify(A));
  log('autosaves', A.length, 'last two differ:', A.length >= 2 && A[A.length - 1] !== A[A.length - 2]);
  // a second Bend, on the left-hand straight, far from the start line
  const n0 = A.length;
  await M('mouseMoved', 410, 520, 0); await sleep(1200);
  await M('mousePressed', 410, 520, 1); await sleep(300);
  for (let i = 1; i <= 12; i++) { await M('mouseMoved', 410 - i * 8, 520, 1); await sleep(120); }
  log('during drag 2:', await ev(`return status();`));
  await p.shot('10-bend2-dragging');
  await M('mouseReleased', 410 - 96, 520, 0); await sleep(5000);
  await state('11-bend2-released');
  fs.writeFileSync(path.join(__dirname, '..', 'autosaves2.json'), JSON.stringify(p.autosaves.slice(n0 - 1)));
  if (UPTO === 'sculpt') { await finish(p); return; }

  // 5. save, then the main Export to Assetto Corsa (into the fake AC root), then File > Export... into the export folder
  log('save:', await ev(`document.getElementById('save').click(); await new Promise((r) => setTimeout(r, 2500)); return status();`));
  await state('12-saved');
  log('export to AC:', await ev(`const b = [...document.querySelectorAll('button')].find((e) => vis(e) && /^Export to Assetto Corsa$/.test(e.textContent.trim())); if (!b) return 'no main export button'; b.click(); await new Promise((r) => setTimeout(r, 1000)); for (let i = 0; i < 90 && /export|writ|build/i.test(status()) && !/exported|installed|wrote|failed|refus/i.test(status()); i++) await new Promise((r) => setTimeout(r, 1000)); return status();`));
  await sleep(3000);
  await state('13-exported-ac');
  log('dialogs open:', await ev(`return [...document.querySelectorAll('dialog[open], [role=dialog], [role=alertdialog]')].filter(vis).map((e) => e.textContent.replace(/\\s+/g, ' ').trim().slice(0, 400));`));
  log('file export:', await ev(`document.getElementById('export').click(); for (let i = 0; i < 120; i++) { await new Promise((r) => setTimeout(r, 1000)); if (!/exporting/i.test(status())) break; } return status();`));
  await sleep(2000);
  await state('14-exported-folder');

  await finish(p);
})().catch((e) => { console.error('FAILED', e); process.exit(1); });

async function finish(p) {
  log('\nerrors', p.errors.length, JSON.stringify(p.errors.slice(0, 6)));
  log('console warn/error', p.logs.length, JSON.stringify(p.logs.slice(0, 8)));
  log('native calls', p.calls.map((c) => c.cmd + (c.err ? ' ERR ' + c.err : '') + (c.n !== undefined ? ' files ' + c.n : '')).join(', '));
  await p.stop();
}
