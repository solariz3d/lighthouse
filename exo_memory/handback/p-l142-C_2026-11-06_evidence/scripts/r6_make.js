// render6.js from L140's render3.js: item 3's two orders on the real page, every value by a drag on the real ghost's handles (his way), logged per step
const fs = require('fs'), D = 'C:/Users/zackn/AppData/Local/Temp/claude/2b46c68187c81881/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/';
let s = fs.readFileSync(D + 'l140/render3.js', 'utf8');
const a = s.indexOf("    say('turn', await setField('turn °', process.env.TURN || 90));"), b = s.indexOf("    say('page errors'");
if (a < 0 || b < 0) throw new Error('anchors');
const mid = `    say('turn', await setField('turn °', -90));
    say('camera Overhead', await camera('Overhead')); await sleep(2000);
    const pv = await ev("const r = document.getElementById('preview').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height };");
    for (let n = 0; n < +(process.env.NOTCHES || 0); n++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: pv.x + 320, y: pv.y + 200, deltaX: 0, deltaY: 120 }); await sleep(200); }
    say('camera Free', await camera('Free')); await sleep(2000);
    const state = () => ev("const rows = [...document.querySelectorAll('#palette .then-row input')].map((i) => [i.getAttribute('aria-label'), i.value]); const f = (t) => { const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === t); return l ? l.querySelector('input').value : null; }; const msg = [...document.querySelectorAll('#palette .message')].map((m) => m.textContent).filter(Boolean).join(' | '); return { bank: f('bank °'), turn: f('turn °'), rows, msg };");
    const dragH = async (kind, px) => {
      const hs = await handles(); const h = hs.find((x) => x.kind === kind && x.side === 1) || hs.find((x) => x.kind === kind);
      say('handles', JSON.stringify(hs.map((x) => [x.kind, x.side, Math.round(x.px), Math.round(x.py)])));
      if (!h) { say('NO handle', kind); return; }
      const n = Math.hypot(h.dx || 0, h.dy || 0) || 1, ux = kind.includes('turn') ? -1 : (h.dx || 0) / n, uy = kind.includes('turn') ? 0 : (h.dx || h.dy) ? (h.dy || 0) / n : -1;
      await mouse('mouseMoved', h.px, h.py); await mouse('mousePressed', h.px, h.py);
      for (let i = 1; i <= 10; i++) await mouse('mouseMoved', h.px + ux * px * i / 10, h.py + uy * px * i / 10);
      await mouse('mouseReleased', h.px + ux * px, h.py + uy * px); await sleep(1800);
      say('after drag', kind, 'at', Math.round(h.px), Math.round(h.py), JSON.stringify(await state()));
      // then the exact value typed, so both orders end on equal numbers: the bank field, or the extra's row
      const put = kind === 'bank' ? "const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === 'bank °'); const i = l && l.querySelector('input'); if (!i) return 'no bank field'; i.value = '40'; i.dispatchEvent(new Event('input')); return true;" : "const i = [...document.querySelectorAll('#palette .then-row input')].find((x) => x.getAttribute('aria-label') === '" + (kind.includes('turn') ? 'extra turn' : 'extra bank') + "'); if (!i) return 'no row'; i.value = '" + (kind.includes('turn') ? '90' : '-40') + "'; i.dispatchEvent(new Event('input')); return true;";
      say('typed', kind, await ev(put)); await sleep(1800); say('after', kind, JSON.stringify(await state()));
    };
    const ORDER = (process.env.ORDER || 'bank,xturn,xbank').split(',');
    for (const st of ORDER) await dragH(st === 'bank' ? 'bank' : st === 'xturn' ? 'extra:turnDeg:0' : 'extra:bank:0', st === 'xturn' ? 120 : st === 'bank' ? 120 : -160);
    say('final', JSON.stringify(await state()));
    await shot('l142-order-' + ORDER.join('-'));
`;
fs.writeFileSync(D + 'l142/render6.js', s.slice(0, a) + mid + s.slice(b)); console.log('ok');
