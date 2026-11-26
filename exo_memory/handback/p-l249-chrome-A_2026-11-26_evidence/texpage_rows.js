
// L249, THE CHROME REFACTOR (the user, 2026-11-26 04:49: "the refactor looks good enough"; spec: the lighthouse repo's briefs/t180_ui_refactor_spec.md). Row 13: one radius
// scale, one factor per look, read as the page computes it: a panel button (r2), a menu (r3), the left column (square: the spec's table, which he saw, has it 0 in every
// look), Export to Assetto Corsa (the one capsule in the looks at factor 1, else r2) and a dialog (r4) equal the table under "checked" in the L248 hand-back
// (p-l248-refactor-plan-C_2026-11-26.md), the dialog added at r4 (spec §1); and focus is a 2 px solid ring in the look's accent, 1 px off the box (spec §5)
const L249_RADII = { sigil: [2, 4, 0, 2, 6], glass: [0, 0, 0, 0, 0], aqua: [4, 8, 0, 999, 12], aurora: [3, 6, 0, 3, 9], skyline: [4, 8, 0, 999, 12], 'skyline-night': [4, 8, 0, 999, 12] };
test('row 13 (L249): the corners are the spec\'s scale times each look\'s factor (a panel button, a menu, the left column, Export, a dialog), and focus is a 2 px ring in the accent', { skip }, async () => {
  const got = {}, want = {}, ring = [];
  for (const look of LOOKS) {
    await load(look);
    await ev("document.getElementById('m-file').open = true; await new Promise((r) => setTimeout(r, 150)); return true;");
    await ev(DIALOGS['save before closing']); await sleep(200);
    got[look] = await ev(`const r = (el) => el ? getComputedStyle(el).borderTopLeftRadius : 'missing';
      const extend = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend');
      return [r(extend), r(document.querySelector('#m-file .more-menu')), r(document.getElementById('left')), r(document.querySelector('header #install > button')), r(document.querySelector('.ask-card'))];`);
    want[look] = L249_RADII[look].map((v) => `${v}px`);
    const f = await ev(`for (const v of document.querySelectorAll('.ask-veil')) v.remove(); document.getElementById('m-file').open = false;
      const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.focus({ focusVisible: true });
      const s = getComputedStyle(b), probe = document.createElement('i'); probe.style.color = 'var(--accent)'; document.body.appendChild(probe); const accent = getComputedStyle(probe).color; probe.remove();
      const out = [s.outlineStyle, s.outlineWidth, s.outlineOffset, s.outlineColor === accent ? 'the accent' : s.outlineColor + ' (accent ' + accent + ')']; b.blur(); return out;`);
    if (JSON.stringify(f) !== JSON.stringify(['solid', '2px', '1px', 'the accent'])) ring.push(`${look}: ${f.join(' ')}`);
    assert.deepEqual(errors, [], `${look}: no page errors`);
  }
  assert.deepEqual(got, want, 'computed corners: [panel button, menu, left column, Export, dialog] per look');
  assert.deepEqual(ring, [], 'a focused button wears a 2 px solid ring in the accent, offset 1 px');
});

// Row 14 (L249): the two new colour steps read. Every hover was a glow or a value picked per rule; spec §6 gives each look step 4 (--hover, a hovered row) and step 10
// (--accent-hover, a solid fill hovered). With the pointer on a menu row (a row of the page's own .menu-row, added to the open File menu, as menupick.js draws its rows),
// on Export to Assetto Corsa and on a panel button, each one's words read 4.5:1 or more on its own pixels in every look (the probe of rows 2 to 12; the hover card is held
// off while it reads, so it covers nothing)
test('row 14 (L249): a hovered menu row, a hovered Export and a hovered panel button read 4.5:1 or more on their own pixels in every look', { skip }, async (t) => {
  const report = [], under = [];
  const keyOf = (sel) => `const e = ${sel}; const text = ([...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('') || '').trim().slice(0, 40); return e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + '|' + text;`;
  const TARGETS = {
    'menu row': "document.getElementById('l249-probe-row')",
    'Export': "document.querySelector('header #install > button')",
    'panel button': "[...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend')",
  };
  for (const look of LOOKS) {
    await load(look);
    await ev(`document.getElementById('m-file').open = true; await new Promise((r) => setTimeout(r, 150));
      const row = document.createElement('div'); row.className = 'menu-row'; row.id = 'l249-probe-row'; row.tabIndex = -1; row.textContent = 'A hovered row reads';
      document.querySelector('#m-file .more-menu').appendChild(row);
      const st = document.createElement('style'); st.id = 'l249-no-card'; st.textContent = '#hovertip { display: none !important; }'; document.head.appendChild(st); return true;`);
    const read = [];
    for (const [name, sel] of Object.entries(TARGETS)) {
      const at = await ev(`const e = ${sel}; if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2];`);
      assert.ok(at, `${look}: the ${name} is on the page`);
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: at[0], y: at[1] }); await sleep(250);
      assert.ok(await ev(`return (${sel}).matches(':hover');`), `${look}: the ${name} is hovered`);
      const key = await ev(keyOf(sel)), on = await contrasts(), list = on.get(key) || [];
      assert.ok(list.length, `${look}: the probe read the hovered ${name} (${key})`);
      for (const w of list) { read.push(`${name} ${w.toFixed(2)}`); if (w < 4.5) under.push(`${look} ${name}: ${w.toFixed(2)}`); }
    }
    report.push(`${look}: ${read.join(', ')}`);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 850 });
    await ev("document.getElementById('l249-probe-row').remove(); document.getElementById('l249-no-card').remove(); document.getElementById('m-file').open = false; return true;");
    assert.deepEqual(errors, [], `${look}: no page errors`);
  }
  t.diagnostic(report.join('; '));
  assert.deepEqual(under, [], 'hovered texts under 4.5:1 on their own pixels');
});
