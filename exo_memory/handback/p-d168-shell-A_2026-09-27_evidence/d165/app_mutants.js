// D168 mutants on app/shell.js, app/palette/palette.js and app/lib/cjs.js, each on a COPY of app/ and src/ in a temp
// dir. Caught = the copied app/test/{shell,shell-loader,palette}.test.js exit non-zero. The live repo is never written.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const LIVE = ['app/shell.js', 'app/palette/palette.js', 'app/lib/cjs.js'].map((f) => path.join(REPO, f));
const before = LIVE.map((f) => fs.readFileSync(f, 'utf8'));
const Sh = 'app/shell.js', P = 'app/palette/palette.js', Cj = 'app/lib/cjs.js';
const M = [
  ['A1 place ignores the pickers', Sh, 'next = D.appendWord(doc(), word, { tempo, dir, font: font === \'auto\' || word === \'jump\' ? undefined : font });', 'next = D.appendWord(doc(), word);'],
  ['A2 place edits without an undo entry', Sh, "const commit = (doc, extra = {}) => set({ history: D.commit(st.history, doc),", "const commit = (doc, extra = {}) => set({ history: { ...st.history, present: doc },"],
  ['A3 a failed action swallowed silently', Sh, "if (['DocError', 'ResolveError', 'HistoryError'].includes(e.name)) { set({ message: e.message }); return null; }", "if (['DocError', 'ResolveError', 'HistoryError'].includes(e.name)) { return null; }"],
  ['A4 a bad picker value accepted', Sh, "if (!PICKERS[key] || !PICKERS[key].includes(value)) return set(", "if (!PICKERS[key]) return set("],
  ['A5 save skips the name check', Sh, "if (!NAME_RE.test(name || '')) return set(", "if (false) return set("],
  ['A6 open keeps the old history (undo reaches the previous track)', Sh, "return set({ history: D.createHistory(d), ...resolved(d), selection: null, name, dirty: false, message: null });", "return set({ history: D.commit(st.history, d), ...resolved(d), selection: null, name, dirty: false, message: null });"],
  ['A7 a saved piece not written to the library file', Sh, "      await storage.saveLibrary(L.serializeLibrary(lib));\n", ''],
  ['A8 the library not read at start', Sh, "  if (saved) lib = L.parseLibrary(saved);", ''],
  ['A9 a selection in click order, not track order', Sh, "const [i, j] = a <= b ? [a, b] : [b, a];", "const [i, j] = [a, b];"],
  ['A10 resolve from scratch every time', Sh, "resolved: st.resolved ? D.resolveFrom(st.resolved, doc) : D.resolve(doc)", "resolved: D.resolve(doc)"],
  ['A11 a drag records every move', Sh, "return set({ history: D.dragTo(st.history, d), ...resolved(d), dirty: true });", "return set({ history: D.commit({ ...st.history, dragBase: null }, d), ...resolved(d), dirty: true });"],
  ['A12 subscribers not told', Sh, "const emit = () => { for (const f of subs) f(st); };", "const emit = () => {};"],
  ['P1 the user\'s pieces listed with the built-ins', P, "{ title: 'Words', items: items.filter((p) => p.builtin) },", "{ title: 'Words', items },"],
  ['P2 undo live with nothing to undo', P, "undo: h.past.length > 0 && !h.dragBase,", "undo: true,"],
  ['P3 the selection not marked in the track list', P, "selected: sel.has(w.id) }))", "selected: false }))"],
  ['P4 the head names the first word, not the last', P, "const last = doc.words[doc.words.length - 1];", "const last = doc.words[0];"],
  ['L1 node built-ins served', Cj, "    if (!spec.startsWith('.')) throw new Error(`cjs: \"${spec}\" (required by ${from}) is not available in the app: only the program's own files are`);\n", "    if (!spec.startsWith('.')) return require(spec);\n"],
  ['L2 a file runs again on every require', Cj, "    if (done.has(p)) return done.get(p).exports;\n", ''],
  ['L3 a path may climb above the root', Cj, "if (!out.length) throw new Error(`cjs: ${p} climbs above the served root`); out.pop();", "out.pop();"],
  ['L4 a comment\'s missing file breaks the load', Cj, "    try { text = await fetchText(p); } catch (e) { missing.set(p, e); return; }", "    text = await fetchText(p);"],
];
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const t = { listed: M.length, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, rel, from, to] of M.filter((m) => !process.argv[2] || m[0].startsWith(process.argv[2] + ' '))) {
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd168m-'));
  for (const d of ['app', 'src']) copyDir(path.join(REPO, d), path.join(top, d));
  const f = path.join(top, rel), src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); fs.rmSync(top, { recursive: true, force: true }); continue; }
  fs.writeFileSync(f, src.replace(from, to)); t.applied++;
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'app/test/shell.test.js', 'app/test/shell-loader.test.js', 'app/test/palette.test.js'], { cwd: top, encoding: 'utf8', timeout: 300000 });
  fs.rmSync(top, { recursive: true, force: true });
  const out = (r.stdout || '') + (r.stderr || ''), fail = /^# fail (\d+)/m.exec(out);
  if (!fail) { t.nr.push(name); console.log('NO RESULT', name, out.slice(-300)); continue; }
  if (r.status !== 0) { t.caught++; console.log('caught  ', name, `(${fail[1]} failing)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
}
const same = LIVE.every((f, i) => fs.readFileSync(f, 'utf8') === before[i]);
console.log(`SUMMARY ${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live files ${same ? 'unchanged' : 'CHANGED'}`);
