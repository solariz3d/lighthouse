// L249 merge (pane A): row 13 focused a button in a page that never holds the window's focus, so :focus never matched and the ring could not show in any page.
// Amended by name: focus emulation on for the read (and off after), the dialog closed as row 10 closes it, and the row now also asserts the button IS focused and
// matches :focus-visible before it reads the ring. Run from the builder worktree root.
const fs = require('fs'); const p = 'app/test/texture-page.test.js';
let s = fs.readFileSync(p, 'utf8'); const crlf = s.includes('\r\n'); s = s.replace(/\r\n/g, '\n');
const once = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${n} matches for: ${a.slice(0, 80)}`); s = s.replace(a, () => b); };
once("    const f = await ev(`for (const v of document.querySelectorAll('.ask-veil')) v.remove(); document.getElementById('m-file').open = false;\n      const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.focus({ focusVisible: true });",
  "    // AMENDED BY NAME (L249 merge, pane A): a headless page never holds the window's focus (document.hasFocus() is false), so a focused button never matched\n" +
  "    // :focus and the row read `none 3px` in every look, whatever the page said (exo_memory/handback/p-l249-chrome-A_2026-11-26.md, Merge). The read now runs\n" +
  "    // with focus emulation on, as a person's window has it, the dialog closed as row 10 closes it, and it first asserts the button IS focused and matches :focus-visible\n" +
  "    await ev(\"document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await new Promise((r) => setTimeout(r, 150)); for (const v of document.querySelectorAll('.ask-veil')) v.remove(); document.getElementById('m-file').open = false; return true;\");\n" +
  "    await send('Emulation.setFocusEmulationEnabled', { enabled: true });\n" +
  "    const f = await ev(`const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.focus({ focusVisible: true });");
once("      const out = [s.outlineStyle, s.outlineWidth, s.outlineOffset, s.outlineColor === accent ? 'the accent' : s.outlineColor + ' (accent ' + accent + ')']; b.blur(); return out;`);",
  "      const out = [document.activeElement === b && b.matches(':focus') ? 'focused' : 'NOT focused', b.matches(':focus-visible') ? 'focus-visible' : 'NOT focus-visible',\n" +
  "        s.outlineStyle, s.outlineWidth, s.outlineOffset, s.outlineColor === accent ? 'the accent' : s.outlineColor + ' (accent ' + accent + ')']; b.blur(); return out;`);\n" +
  "    await send('Emulation.setFocusEmulationEnabled', { enabled: false });");
once("    if (JSON.stringify(f) !== JSON.stringify(['solid', '2px', '1px', 'the accent'])) ring.push(`${look}: ${f.join(' ')}`);",
  "    if (JSON.stringify(f) !== JSON.stringify(['focused', 'focus-visible', 'solid', '2px', '1px', 'the accent'])) ring.push(`${look}: ${f.join(' ')}`);");
once("  assert.deepEqual(ring, [], 'a focused button wears a 2 px solid ring in the accent, offset 1 px');",
  "  assert.deepEqual(ring, [], 'a focused button (focused, and :focus-visible) wears a 2 px solid ring in the accent, offset 1 px');");
fs.writeFileSync(p, crlf ? s.replace(/\n/g, '\r\n') : s); console.log('row 13 amended');
