
// L249, THE CHROME REFACTOR (the user, 2026-11-26 04:49: "the refactor looks good enough"; the spec is the lighthouse repo's briefs/t180_ui_refactor_spec.md, the packet
// loop/packet_t180_chrome_refactor_ACE_2026-11-26.md). These rows read the CSS as written: index.html's <style> block (SIGIL and every look's shared rules) and the five
// skins. The computed values in the page are texture-page.test.js rows 13 and 14; the label windows' radius is markwindow.test.js W7.
const L249_FACTOR = { sigil: 0.5, glass: 0, aurora: 0.75, aqua: 1, skyline: 1, 'skyline-night': 1 };
/** the CSS sources of the chrome: index.html's style block, then each skin, comments blanked (line numbers kept) */
function chromeSources() {
  const blank = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
  const m = /<style>([\s\S]*?)<\/style>/.exec(HTML), pre = HTML.slice(0, m.index + '<style>'.length);
  const out = [{ file: 'index.html', css: '\n'.repeat(pre.split('\n').length - 1) + blank(m[1]) }];
  for (const look of TH.LOOKS) out.push({ file: `themes/${look}.css`, css: blank(fs.readFileSync(path.join(ADIR, 'themes', `${look}.css`), 'utf8')) });
  return out;
}
/** every declaration of `props` in the sources: { at: file:line, sel, prop, value } (the innermost rule, so an @supports block's rules are read too) */
function declarations(props) {
  const out = [];
  for (const { file, css } of chromeSources()) {
    for (const r of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const sel = r[1].trim().replace(/\s+/g, ' '), line = css.slice(0, r.index + r[1].length).split('\n').length;
      for (const d of r[2].split(';')) { const i = d.indexOf(':'); if (i < 0) continue; const prop = d.slice(0, i).trim(); if (props.test(prop)) out.push({ at: `${file}:${line}`, sel, prop, value: d.slice(i + 1).replace(/!important/, '').trim() }); }
    }
  }
  return out;
}
/** a box-shadow or text-shadow value as layers: { inset, x, y, blur, colour } (lengths in px; colour as written) */
function shadowLayers(value) {
  if (value === 'none') return [];
  const layers = []; let depth = 0, cur = '';
  for (const ch of value) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ',' && depth === 0) { layers.push(cur); cur = ''; } else cur += ch; }
  layers.push(cur);
  return layers.map((l) => {
    const colour = (/(rgba?\([^)]*\)|hsla?\([^)]*\)|color-mix\(.*\)|var\([^)]*\)|#[0-9a-f]{3,8}\b|\b(black|white|transparent|currentColor)\b)/i.exec(l) || [''])[0];
    const nums = l.replace(colour, ' ').replace(/\binset\b/, ' ').trim().split(/\s+/).filter(Boolean).map((n) => parseFloat(n));
    return { inset: /\binset\b/.test(l), x: nums[0] || 0, y: nums[1] || 0, blur: nums[2] || 0, colour: colour.trim(), text: l.trim() };
  });
}
const blackAlpha = (c) => { const m = /^rgba?\(\s*0\s*,\s*0\s*,\s*0\s*(?:,\s*([\d.]+))?\s*\)$/.exec(c); return m ? (m[1] === undefined ? 1 : Number(m[1])) : (/^(#000|#000000|black)$/i.test(c) ? 1 : null); };

test('L249 the glow budget is 0: no box-shadow or text-shadow in the chrome is a centred blur (a glow or a halo), and every blurred shadow outside a box is black, blur 12 px or less, alpha 0.12 or less', () => {
  const glows = [], heavy = [];
  const decl = declarations(/^(box-shadow|text-shadow)$/);
  for (const d of decl) for (const l of shadowLayers(d.value)) {
    if (l.blur > 0 && l.x === 0 && l.y === 0) glows.push(`${d.at} ${d.sel} ${d.prop}: ${l.text}`);
    else if (d.prop === 'box-shadow' && !l.inset && l.blur > 0) { const a = blackAlpha(l.colour); if (a === null || a > 0.12 || l.blur > 12) heavy.push(`${d.at} ${d.sel}: ${l.text}`); }
  }
  assert.ok(decl.length > 40, `the sources' shadows were read (${decl.length})`);
  assert.deepEqual(glows, [], 'a centred blur is a glow (spec §5: hover, open and pressed are a fill or a border, focus a ring, no glowing words, dots or halos)');
  assert.deepEqual(heavy, [], 'a shadow says "this floats", small and neutral (spec §5: black, blur 12 px or less, alpha 0.12 or less)');
});

test('L249 one radius scale: SIGIL sets the factor .5 and r1..r4 (2, 4, 8, 12 px times it), each skin sets only its own factor and its two hover steps; no corner in the chrome is a literal over 12 px but Export\'s capsule and the circles', () => {
  const S = sigilTokens();
  assert.equal(Number(S['--radius-factor']), L249_FACTOR.sigil, 'SIGIL\'s factor');
  [2, 4, 8, 12].forEach((px, i) => assert.equal(S[`--r${i + 1}`], `calc(${px}px * var(--radius-factor))`, `--r${i + 1} is ${px} px times the look's factor`));
  for (const k of ['--hover', '--accent-hover']) assert.ok(S[k], `SIGIL sets ${k} (spec §6: step 4 and step 10)`);
  const missing = [];
  for (const look of TH.LOOKS) {
    const css = fs.readFileSync(path.join(ADIR, 'themes', `${look}.css`), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''), own = {};
    for (const b of css.matchAll(new RegExp(`\\[data-theme="${look}"\\]\\s*\\{([^{}]*)\\}`, 'g'))) for (const m of b[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) own[m[1]] = m[2].trim();
    if (Number(own['--radius-factor']) !== L249_FACTOR[look] || own['--radius-factor'] === undefined) missing.push(`${look}: --radius-factor is ${own['--radius-factor']}, the spec's ${L249_FACTOR[look]}`);
    for (const k of ['--hover', '--accent-hover']) if (!own[k]) missing.push(`${look}: sets no ${k}`);
    for (const k of ['--r1', '--r2', '--r3', '--r4']) if (own[k]) missing.push(`${look}: sets ${k} itself (only the factor is a look's)`);
  }
  assert.deepEqual(missing, [], 'each look\'s factor (spec §1) and hover steps (§6)');
  const over = [];
  for (const d of declarations(/^border(-(top|bottom)-(left|right))?-radius$/)) {
    if (/#install > button/.test(d.sel)) continue;   // Export to Assetto Corsa, the one capsule (spec §3), in the looks at factor 1
    const lits = [...d.value.replace(/var\([^)]*\)/g, '').matchAll(/(\d+(?:\.\d+)?)px/g)].map((m) => Number(m[1]));
    if (lits.some((v) => v > 12)) over.push(`${d.at} ${d.sel}: ${d.value}`);
  }
  assert.deepEqual(over, [], 'no corner over the 12 px ceiling (spec §1, r4), but Export\'s capsule and the circles (50%)');
});
