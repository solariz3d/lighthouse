// D166 re-dispatch mutants on src/doc/*, each on a COPY of src/ and test/ (+ tools/, scripts/) in a temp dir. Caught =
// the copied test/doc.test.js + test/doc-geom.test.js exit non-zero. The live repo is never written.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const FILES = ['serial.js', 'document.js', 'resolve.js', 'history.js', 'vocab.js', 'library.js'].map((f) => path.join(REPO, 'src/doc', f));
const before = FILES.map((f) => fs.readFileSync(f, 'utf8'));
const S = 'src/doc/serial.js', Do = 'src/doc/document.js', R = 'src/doc/resolve.js', H = 'src/doc/history.js', Lb = 'src/doc/library.js';
const M = [
  ['D1 key order changed in the text (closed before name)', S, "  ${str('name')}: ${str(d.name)},\\n` +\n    `  ${str('closed')}: ${d.closed},", "  ${str('closed')}: ${d.closed},\\n` +\n    `  ${str('name')}: ${str(d.name)},"],
  ['D2 lengths quantised 100× coarser (1 cm, not 0.1 mm)', S, 'm: (x) => Math.round(x * 1e4),', 'm: (x) => Math.round(x * 100) * 100,'],
  ['D3 trailing zeros kept', S, ".replace(/0+$/, '')", ''],
  ['D4 a removed head gives its id back', Do, "words: doc.words.slice(0, -1) }));", "nextId: doc.nextId - 1, words: doc.words.slice(0, -1) }));"],
  ['D5 unknown keys ignored', S, "  if (extra.length) throw new DocError('UNKNOWN_KEY',", "  if (false) throw new DocError('UNKNOWN_KEY',"],
  ['D6 a newer schema accepted', S, '  if (d.schema !== SCHEMA) throw new DocError(', '  if (d.schema < SCHEMA || typeof d.schema !== \'number\') throw new DocError('],
  ['D7 the incoming curvature ignored in the peak', R, 'const kY = (h.turn - (kIn * a * L) / 2) / den', 'const kY = h.turn / den'],
  ['D8 the out-ramp closes to half the peak, not 0', R, "['out', kY, 0, kP, 0]", "['out', kY, kY / 2, kP, 0]"],
  ['D9 a drag records every step', H, 'return freeze({ ...h, present: checkDoc(doc) });', 'return freeze({ ...h, past: Object.freeze([...h.past, h.present]), present: checkDoc(doc) });'],
  ['D10 the jump ignores its landing pitch', R, 'const kp1Of = (L, kp0) => (2 * (land - p0)) / L - kp0;', 'const kp1Of = (L, kp0) => kp0;'],
  ['D11 an outside wall on the inside', Do, 'psiL = out ? (sign > 0 ? F.psiIn : F.psiOut) : F.psiL, psiR = out ? (sign > 0 ? F.psiOut : F.psiIn) : F.psiR;', 'psiL = out ? (sign > 0 ? F.psiOut : F.psiIn) : F.psiL, psiR = out ? (sign > 0 ? F.psiIn : F.psiOut) : F.psiR;'],
  ['D12 a new word does not start at the head\'s roll', Do, "roll0: headRoll(doc) });\n  const id = `w${doc.nextId}`;", "roll0: 0 });\n  const id = `w${doc.nextId}`;"],
  ['D13 an edit rebuilds every word', Do, 'const words = doc.words.slice(); words[i] = { id, ...w };', 'const words = doc.words.map((x) => (x.phrase === undefined ? { id: x.id, ...finishWord(x, {}, x.id) } : x)); words[i] = { id, ...w };'],
  ['D14 a closed document resolves anyway', R, '  if (doc.closed) throw new ResolveError(', '  if (false) throw new ResolveError('],
  ['D15 a heartline step resolves anyway', R, "  if (!first && Math.abs(h.heartline - heart) > TOL_HEART) throw", "  if (false) throw"],
  ['D16 a roll step resolves anyway', R, "  if (!first && Math.abs(h.roll0 - roll) > TOL_ROLL) throw", "  if (false) throw"],
  ['D17 parse keeps sub-quantum values unsnapped', S, "handles[k] = fromQ[UNIT[k]](toQ[UNIT[k]](UNIT[k] === 'deg' ? v * DEG : v) || 0);", "handles[k] = UNIT[k] === 'deg' ? v * DEG : v;"],
  ['D18 phrase ids without the /n', R, "e.words.map((w, n) => ({ id: `${e.id}/${n + 1}`, ...w }))", "e.words.map((w, n) => ({ id: e.id, ...w }))"],
  ['D19 the peak ignores the ease (radius too small)', R, 'den = L * (1 - a / 2 - b / 2);', 'den = L;'],
  ['D20 roll is linear inside the word, not one smoothstep', R, 'const rollAt = (s) => h.roll0 + (h.roll1 - h.roll0) * smooth(s / L)', 'const rollAt = (s) => h.roll0 + (h.roll1 - h.roll0) * (s / L)'],
  ['H1 resolveFrom always resolves from scratch', R, `  if (!prev || !Array.isArray(prev.marks) || !Array.isArray(prev.segments)) return resolve(doc);`, `  return resolve(doc);`],
  ['H2 resolveFrom restarts one entry late', R, `  const segStart = i0 < prev.marks.length ? prev.marks[i0].segStart : prev.segments.length;`, `  if (i0 < n) i0++;
  const segStart = i0 < prev.marks.length ? prev.marks[i0].segStart : prev.segments.length;`],
  ['H3 marks record the state AFTER the entry', R, `    marks.push(Object.freeze({ entry: e, segStart: segments.length, state: st }));
    for (const w of flatten(e)) st = resolveWord(w, st, segments);`, `    const at = segments.length;
    for (const w of flatten(e)) st = resolveWord(w, st, segments);
    marks.push(Object.freeze({ entry: e, segStart: at, state: st }));`],
  ['H4 replaceHead keeps the old head id', Do, `  return appendWord(removeHead(doc), word, opts);`, `  const r = appendWord(removeHead(doc), word, opts), ws = r.words.slice(); ws[ws.length - 1] = { ...ws[ws.length - 1], id: doc.words[doc.words.length - 1].id };
  return deepFreeze(checkDoc({ ...r, nextId: doc.nextId, words: ws }));`],
  ['H5 no shortcut for an unchanged document', R, "  if (i0 === prev.marks.length && i0 === doc.words.length) return prev;", ""],
  ['H6 resolveFrom compares entries by id, not by object', R, "prev.marks[i0].entry === doc.words[i0]", "prev.marks[i0].entry.id === doc.words[i0].id"],
  ['W1 the wall handle ignored (the font constant used)', R, `const wall = h.wall, w = h.width / 2;`, `const wall = FONTS[font].wall, w = h.width / 2;`],
  ['L1 a placed piece does not take the head roll', Lb, `const words = shiftRoll(p.words, headRoll(doc));`, `const words = shiftRoll(p.words, 0);`],
  ['L2 a saved piece keeps its absolute roll', Lb, `words = shiftRoll(words, -firstRoll(words));`, ``],
  ['L3 built-in names compared case-sensitively', Lb, `const isBuiltinName = (name) => Object.keys(WORDS).some((w) => key(w) === key(name));`, `const isBuiltinName = (name) => Object.keys(WORDS).includes(name);`],
  ['L4 a taken name accepted', Lb, `  if (lib.pieces.some((p) => !p.builtin && key(p.name) === key(name))) throw`, `  if (false) throw`],
  ['L5 a run need not be consecutive', Lb, `if (at[k] !== at[k - 1] + 1) throw`, `if (false) throw`],
  ['L6 the exported piece carries its library id', Lb, "return \`{\\n\${head(lib)}  \${str('piece')}: {\${pieceBody(p)}}\\n}\\n\`;", "return \`{\\n\${head(lib)}  \${str('piece')}: {\${str('id')}:\${str(p.id)},\${pieceBody(p)}}\\n}\\n\`;"],
  ['L7 the saved library carries the built-ins too', Lb, `const user = lib.pieces.filter((p) => !p.builtin);`, `const user = lib.pieces;`],
  ['L8 a library file with a clashing name loads anyway', Lb, `    checkName({ pieces }, body.name);\n`, ``],
  ['L9 no provider still reports physics', Lb, `physics: typeof boundsFn === 'function' ? boundsFn(doc, id) : null`, `physics: typeof boundsFn === 'function' ? boundsFn(doc, id) : {}`],
  ['L10 a phrase piece places only its first word', Lb, `  return appendPhrase(doc, p.name, words.map((w) => ({ word: w.word, opts: opts(w) })));`, `  return appendWord(doc, words[0].word, opts(words[0]));`],
  ['L11 a newer schema piece imported anyway', Lb, `  if (o.schema !== SCHEMA) S.checkDoc({ schema: o.schema });`, ``],
];
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const t = { listed: M.length, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, rel, from, to] of M) {
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd166d-'));
  for (const d of ['src', 'test', 'tools', 'scripts']) copyDir(path.join(REPO, d), path.join(top, d));
  const f = path.join(top, rel), src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); fs.rmSync(top, { recursive: true, force: true }); continue; }
  fs.writeFileSync(f, src.replace(from, to)); t.applied++;
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/doc.test.js', 'test/doc-geom.test.js', 'test/doc-head.test.js', 'test/doc-library.test.js'], { cwd: top, encoding: 'utf8', timeout: 300000 });
  fs.rmSync(top, { recursive: true, force: true });
  const out = (r.stdout || '') + (r.stderr || ''), fail = /^# fail (\d+)/m.exec(out);
  if (!fail) { t.nr.push(name); console.log('NO RESULT', name, out.slice(-300)); continue; }
  if (r.status !== 0) { t.caught++; console.log('caught  ', name, `(${fail[1]} failing)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
}
const same = FILES.every((f, i) => fs.readFileSync(f, 'utf8') === before[i]);
console.log(`${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live src/doc ${same ? 'unchanged' : 'CHANGED'}`);
