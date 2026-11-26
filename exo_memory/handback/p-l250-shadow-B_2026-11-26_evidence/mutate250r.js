// mutate250r.js (L250 repair): each mutant of the repair applied in place to app/reference/panel.js, the panel rows run, the file put back byte for byte.
// A mutant is caught when a row fails. Run nothing else in the worktree meanwhile.
const fs = require('fs'), { execFileSync } = require('child_process');
const T = 'C:/Consonance/t180-wt-l243', PAN = 'app/reference/panel.js';
const M = [
  [PAN, 'setMode re-reads the layout shown, not the one reading (59a54e3)', 'const l = reading || (shownKey && layouts', 'const l = (shownKey && layouts'],
  [PAN, 'a pick does not say what it reads', 'error = null; notes = []; reading = l;', 'error = null; notes = [];'],
  [PAN, 'Clear leaves the read it dropped as reading', 'seq++; reading = null;', 'seq++;'],
  [PAN, 'a refusal leaves its layout as reading', '      reading = null;\r\n      const words = refusalWords(e);', '      const words = refusalWords(e);'],
  [PAN, 'a landed pick stays reading', 'reading = null; ref = next; shownKey = key;', 'ref = next; shownKey = key;'],
  [PAN, 'a bad typed value is 0 again (59a54e3)', 'i.onchange = () => { const v = numberOf(i.value); if (!Number.isFinite(v)) { i.value = String(nudge[k]); return; } nudge[k] = v; send(); };', 'i.onchange = () => { nudge[k] = Number(i.value) || 0; send(); };'],
  [PAN, 'the box is not shown its value again', 'if (!Number.isFinite(v)) { i.value = String(nudge[k]); return; }', 'if (!Number.isFinite(v)) { return; }'],
  [PAN, 'an empty box is 0', "typeof v === 'string' && v.trim() !== '' ? Number(v)", "typeof v === 'string' ? Number(v)"],
  [PAN, 'setNudge takes a bad value as 0 (59a54e3)', 'const v = numberOf(n[k]); if (Number.isFinite(v)) nudge[k] = v;', 'nudge[k] = Number(n[k]) || 0;'],
  [PAN, 'the ground is the veil again', 'background: var(--panel, #0b0b0a);', 'background: var(--veil, #0b0d11);'],
  [PAN, 'the words are on-ink again', 'color: var(--text, #ebe6dc);', 'color: var(--on-ink, #eef1f6);'],
  [PAN, 'the corner is 6 px again', 'border-radius: var(--r3, 4px);', 'border-radius: 6px;'],
  [PAN, 'the edge is the veil rule again', 'border: 1px solid var(--line, #24221f);', 'border: 1px solid var(--veil-rule, rgba(255, 255, 255, .14));'],
  [PAN, 'a colour of its own in the class', '.reference-panel .rp-readout { color: var(--dim, #8a847a);', '.reference-panel .rp-readout { color: color-mix(in srgb, var(--on-ink, #eef1f6) 72%, transparent);'],
  [PAN, 'an inline style comes back', "const readout = el('div', 'rp-readout'),", "const readout = el('div', 'rp-readout'); readout.style.cssText = 'color:#fff'; const"],
  [PAN, 'the class rule is not brought', "root.append(box, el('style', '', CSS));", 'root.append(box);'],
];
const run = () => { for (const f of ['app/test/reference-panel.test.js', 'test/reference_ribbon.test.js']) { try { execFileSync(process.execPath, ['--test', f], { cwd: T, stdio: 'pipe', timeout: 240000 }); } catch (e) { return true; } } return false; };
const res = [], origs = new Map();
try {
  for (const [file, name, a, b] of M) {
    const F = `${T}/${file}`; if (!origs.has(F)) origs.set(F, fs.readFileSync(F));
    const s = origs.get(F).toString('utf8'); if (s.split(a).length !== 2) { res.push([name, 'NOT APPLIED']); continue; }
    fs.writeFileSync(F, s.replace(a, () => b));
    const caught = run(); fs.writeFileSync(F, origs.get(F));
    res.push([name, caught ? 'caught' : 'SURVIVED']);
  }
} finally { for (const [F, b] of origs) fs.writeFileSync(F, b); }
for (const [n, r] of res) console.log(`${r.padEnd(11)} ${n}`);
console.log(`${res.filter((x) => x[1] === 'caught').length} of ${res.length} caught; restored byte for byte: ${[...origs].every(([F, b]) => fs.readFileSync(F).equals(b))}`);
