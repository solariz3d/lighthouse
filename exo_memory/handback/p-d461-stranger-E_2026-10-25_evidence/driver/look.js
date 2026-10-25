// look.js (D461): open the page as a first start, wait, screenshot, and list what a person can see and press
'use strict';
const os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) {}
const { start, sleep } = require('./page.js');
(async () => {
  const p = await start();
  await sleep(8000);
  console.log('shot', await p.shot('01-first-start'));
  const seen = await p.ev(`
    const vis = (e) => !!(e.offsetParent || e.getClientRects().length) && getComputedStyle(e).visibility !== 'hidden';
    const lab = (e) => (e.getAttribute('aria-label') || e.title || e.textContent || e.value || e.placeholder || '').replace(/\\s+/g, ' ').trim().slice(0, 90);
    const out = { title: document.title, status: (document.getElementById('status') || {}).textContent, buttons: [], inputs: [], dialogs: [] };
    for (const e of document.querySelectorAll('button, summary')) if (vis(e)) out.buttons.push((e.id ? '#' + e.id + ' ' : '') + lab(e));
    for (const e of document.querySelectorAll('input, select')) if (vis(e)) out.inputs.push((e.id ? '#' + e.id + ' ' : '') + e.type + ' ' + lab(e));
    for (const e of document.querySelectorAll('dialog[open], [role=dialog], .card, .guide, #guide')) if (vis(e)) out.dialogs.push(lab(e).slice(0, 300));
    return out;`);
  console.log(JSON.stringify(seen, null, 1));
  console.log('errors', p.errors.length, p.errors.slice(0, 5));
  console.log('console warn/error', p.logs.length, p.logs.slice(0, 8));
  console.log('native calls', p.calls.map((c) => c.cmd + (c.err ? ' ERR ' + c.err : '')).join(', '));
  await p.stop();
})().catch((e) => { console.error('FAILED', e); process.exit(1); });
