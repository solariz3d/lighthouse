// D169 mutants on A's app files, each on a COPY of app/, src/, tools/ and src-tauri/build.rs in a temp dir. Each mutant
// runs the copied test files that cover it (the export tests take ~75 s, so not every file runs for every mutant).
// Caught = those tests exit non-zero. The live repo is never written. Usage: node d169_mutants.js [prefix]
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const Sh = 'app/shell.js', P = 'app/palette/palette.js', Pn = 'app/palette/panels.js', Cj = 'app/lib/cjs.js', X = 'app/export/export.js', Nd = 'app/export/node-shim.js', B = 'src-tauri/build.rs';
const LIVE = [Sh, P, Pn, Cj, X, Nd, B].map((f) => path.join(REPO, f));
const before = LIVE.map((f) => fs.readFileSync(f, 'utf8'));
const QUICK = ['app/test/shell.test.js', 'app/test/shell-loader.test.js', 'app/test/palette.test.js', 'app/test/palette-dom.test.js', 'app/test/shell-keys.test.js', 'app/test/shell-autosave.test.js', 'app/test/palette-panels.test.js', 'app/test/shell-dist.test.js'];
const EXPORT = ['app/test/export.test.js'], CLOSE = ['app/test/shell-close.test.js'];
const M = [
  // ---- D168's, re-run on this lap's files
  ['A1 place ignores the pickers', Sh, "next = D.appendWord(doc(), word, { tempo, dir, font: font === 'auto' || word === 'jump' ? undefined : font });", 'next = D.appendWord(doc(), word);', QUICK],
  ['A2 place edits without an undo entry', Sh, "const commit = (doc, extra = {}) => set({ history: D.commit(st.history, doc),", "const commit = (doc, extra = {}) => set({ history: { ...st.history, present: doc },", QUICK],
  ['A3 a failed action swallowed silently', Sh, "if (['DocError', 'ResolveError', 'HistoryError'].includes(e.name)) { set({ message: e.message }); return null; }", "if (['DocError', 'ResolveError', 'HistoryError'].includes(e.name)) { return null; }", QUICK],
  ['A4 a bad picker value accepted', Sh, "if (!PICKERS[key] || !PICKERS[key].includes(value)) return set(", "if (!PICKERS[key]) return set(", QUICK],
  ['A5 save skips the name check', Sh, "if (!NAME_RE.test(name || '')) return set(", "if (false) return set(", QUICK],
  ['A6 open keeps the old history', Sh, "return set({ history: D.createHistory(d), ...resolved(d), selection: null, name, dirty: false, message: null });", "return set({ history: D.commit(st.history, d), ...resolved(d), selection: null, name, dirty: false, message: null });", QUICK],
  ['A7 a saved piece not written to the library file', Sh, "      await storage.saveLibrary(L.serializeLibrary(lib));\n", '', QUICK],
  ['A8 the library not read at start', Sh, "  if (saved) lib = L.parseLibrary(saved);", '', QUICK],
  ['A9 a selection in click order', Sh, "const [i, j] = a <= b ? [a, b] : [b, a];", "const [i, j] = [a, b];", QUICK],
  ['A12 subscribers not told', Sh, "    emit(); return st;\n  };", "    return st;\n  };", QUICK],
  ['P1 user pieces mixed into built-ins', P, "{ title: 'Words', items: items.filter((p) => p.builtin) },", "{ title: 'Words', items },", QUICK],
  ['P2 undo live with nothing to undo', P, "undo: h.past.length > 0 && !h.dragBase,", "undo: true,", QUICK],
  ['L1 node built-ins served without a shim', Cj, "      if (Object.prototype.hasOwnProperty.call(builtins, spec)) return builtins[spec];\n      throw new Error(", "      return require(spec);\n      throw new Error(", QUICK],
  ['L2 a file runs again on every require', Cj, "    if (done.has(p)) return done.get(p).exports;\n", '', QUICK],
  // ---- this lap
  ['N1 "nullnull" back: null children passed to the DOM', P, "  ].filter(Boolean));", "  ]);", QUICK],
  ['K1 a bare Backspace removes the head', Sh, "  if (!ctrl) return null;", "  if (!ctrl) return k === 'backspace' ? 'removeHead' : null;", QUICK],
  ['K2 keys reach the track while typing in a field', Sh, "  if (inField) return null;\n", '', QUICK],
  ['M1 a mount that throws is swallowed', Pn, "  try { r = await m.mount(root, shell); } catch (e) { return fail(e && e.message ? e.message : String(e)); }", "  try { r = await m.mount(root, shell); } catch (e) { return { ok: true }; }", QUICK],
  ['M2 a returned error is ignored', Pn, "  if (r instanceof Error) return fail(r.message);\n", '', QUICK],
  ['M3 a missing module shown as an alarm', Pn, "    if (NOT_THERE.test(why)) {", "    if (false) {", QUICK],
  ['S1 the autosave never written', Sh, "    if (!autoDue) return;\n    autoDue = false;", "    return;\n    autoDue = false;", QUICK],
  ['S2 the recovery applied behind the user\'s back', Sh, "  st.resolved = D.resolve(st.history.present);\n  const subs = new Set();", "  if (recovery) st.history = D.createHistory(recovery.doc);\n  st.resolved = D.resolve(st.history.present);\n  const subs = new Set();", QUICK],
  ['S3 a clean exit leaves the autosave', Sh, "    async cleanExit() { await clearAutosave(); },", "    async cleanExit() {},", QUICK],
  ['S4 saving under a name leaves the autosave', Sh, "      await clearAutosave();   // the named file holds the track now\n", '', QUICK],
  ['S5 no debounce: written on every edit', Sh, "      if (autosaveMs > 0) { if (autoTimer) timers.clearTimeout(autoTimer); autoTimer = timers.setTimeout(() => { autoTimer = null; return writeAutosave(); }, autosaveMs); }", "      writeAutosave();", QUICK],
  ['S6 a damaged autosave stops the app', Sh, "      catch (e) { startMessage = `an autosave was found but could not be read, so it was left alone: ${e.message}`; }", "      catch (e) { throw e; }", QUICK],
  ['E1 the AC guard off', X, "    if (!/^t180b_/i.test(inside)) {", "    if (false) {", EXPORT],
  ['E2 the AC guard case-sensitive', X, "  const parts = dir.replace(/\\\\/g, '/').split('/').filter(Boolean), low = parts.map((p) => p.toLowerCase());", "  const parts = dir.replace(/\\\\/g, '/').split('/').filter(Boolean), low = parts;", EXPORT],
  ['E3 the reds not shown', Sh, "        return set({ message: e.message, exportReds: e.code === 'RED' ? e.red : null });", "        return set({ message: e.message, exportReds: null });", EXPORT],
  ['E4 files written even when the guard refuses', Sh, "      if (!g.ok) return set({ message: g.reason, exportReds: null });", "      if (!g.ok) { await storage.writeExport(dir, 'x', []); return set({ message: g.reason, exportReds: null }); }", EXPORT],
  ['E5 the shim\'s deflate with a wrong Adler-32', Nd, "  out.writeUInt32BE(((c << 16) | a) >>> 0, o);", "  out.writeUInt32BE(((c << 16) | a ^ 1) >>> 0, o);", EXPORT],
  ['E6 the shim\'s sha256 with one constant wrong', Nd, "0x428a2f98, 0x71374491", "0x428a2f99, 0x71374491", EXPORT],
  ['E7 the shim\'s writeUInt32BE little-endian', Nd, "  writeUInt32BE(v, o = 0) { this._chk(o, 4); this._dv.setUint32(o, v, false); return o + 4; }", "  writeUInt32BE(v, o = 0) { this._chk(o, 4); this._dv.setUint32(o, v, true); return o + 4; }", EXPORT],
  ['E8 the shim\'s utf8 as latin1', Nd, "      if (!encoding || encoding === 'utf8' || encoding === 'utf-8') { const u = enc.encode(x), b = new Buffer(u.length); b.set(u); return b; }", "      if (!encoding || encoding === 'utf8' || encoding === 'utf-8') { const b = new Buffer(x.length); for (let i = 0; i < x.length; i++) b[i] = x.charCodeAt(i) & 0xff; return b; }", EXPORT],
  ['C1 close the loop with the LAST-ranked candidate', Sh, "        const c = r.candidates[0];", "        const c = r.candidates[r.candidates.length - 1];", CLOSE],
  ['C2 the closed track not marked closed for the panels', Sh, "      return { resolved: doc.closed ? Object.freeze({ ...r, closed: true, _open: r }) : r, resolveError: null };", "      return { resolved: r, resolveError: null };", CLOSE],
  ['D1 build.rs leaves tools/ out', B, "    copy_dir(&root.join(\"tools\"), &dist.join(\"tools\"), &[]).expect(\"build.rs: could not copy tools/ into dist/\");\n", '', QUICK],
];
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const only = process.argv[2];
const t = { listed: 0, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, rel, from, to, tests] of M) {
  if (only && !name.startsWith(only + ' ')) continue;
  t.listed++;
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd169m-'));
  for (const d of ['app', 'src', 'tools']) copyDir(path.join(REPO, d), path.join(top, d));
  fs.mkdirSync(path.join(top, 'src-tauri'), { recursive: true }); fs.copyFileSync(path.join(REPO, B), path.join(top, B));
  const f = path.join(top, rel), src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); fs.rmSync(top, { recursive: true, force: true }); continue; }
  fs.writeFileSync(f, src.replace(from, to)); t.applied++;
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...tests], { cwd: top, encoding: 'utf8', timeout: 600000 });
  fs.rmSync(top, { recursive: true, force: true });
  const out = (r.stdout || '') + (r.stderr || ''), fail = /^# fail (\d+)/m.exec(out);
  if (!fail) { t.nr.push(name); console.log('NO RESULT', name, out.slice(-300)); continue; }
  if (r.status !== 0) { t.caught++; console.log('caught  ', name, `(${fail[1]} failing)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
}
const same = LIVE.every((f, i) => fs.readFileSync(f, 'utf8') === before[i]);
console.log(`SUMMARY ${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live files ${same ? 'unchanged' : 'CHANGED'}`);
