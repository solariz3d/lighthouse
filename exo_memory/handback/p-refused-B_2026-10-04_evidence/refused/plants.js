// plants.js (pane B, D234): one exact, once-only edit each in a temp copy of the tree; CAUGHT = core-shell + export tests fail (control clean first).
// C7 is the core-mutation harness's own mutant at its re-pointed anchor (the open-loop refusal line deleted), checked by its caughtBy test name.
//   node plants.js <tree>
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), CS = 'app/core/coreshell.js', SH = 'app/shell.js', EX = 'app/export/export.js';
const FILES = ['app/test/core-shell.test.js', 'app/test/export.test.js'];
const run = (d, pattern) => { const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-concurrency=1', ...(pattern ? [`--test-name-pattern=${pattern}`] : []), ...FILES], { cwd: d, encoding: 'utf8', timeout: 15 * 60 * 1000, env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT')) });
  const s = r.stdout.replace(/\x1b\[[0-9;]*m/g, ''); return { pass: r.status === 0, tail: (s.match(/ℹ (pass|fail) \d+/g) || []).join(' ') }; };
const C7FROM = "      if (!doc().closed) return stop({ message: 'the loop is not closed: close it first (one click), then export', exportReds: null });\n";
const PLANTS = [
  { id: 'C7 (the harness mutant, re-pointed anchor): the open-loop refusal deleted', file: CS, from: C7FROM, to: '', pattern: 'export: an open track is refused' },
  { id: 'K2 core: a refusal (stop) does not remove the empty folder', file: CS, from: 'const message = patch.message + await tidy();', to: 'const message = patch.message;' },
  { id: 'K3 core: an unplanned failure does not remove it', file: CS, from: '} catch (e) { await tidy(); throw e; }   // a failure nobody planned for', to: '} catch (e) { throw e; }   // a failure nobody planned for' },
  { id: 'K4 words: a refused export (ExportError) does not remove it', file: SH, from: '        const message = e.message + await tidy();', to: '        const message = e.message;' },
  { id: 'K5 words: an unplanned failure does not remove it', file: SH, from: '      } catch (e) { await tidy(); throw e; }\n    },\n    /** The track as the export', to: '      } catch (e) { throw e; }\n    },\n    /** The track as the export' },
  { id: 'K6 resolveTarget takes ANY folder as empty (a non-empty folder would be exported into and tidied)', file: EX, from: '(await storage.folderIsEmpty(dir)) !== true', to: 'false' },
  { id: 'K7 core: a success leaves the old refusal standing (exportRefusal not cleared)', file: CS, from: "exportReds: null, exportRefusal: null, lastExport", to: 'exportReds: null, lastExport' },
  { id: 'K8 core: a refusal is not kept for the page (exportRefusal not set by stop)', file: CS, from: 'return set({ ...patch, message, exportRefusal: message });', to: 'return set({ ...patch, message });' },
];
function copyTree() { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'b-refused-plant-')); for (const c of ['src', 'app', 'tools', 'test', 'scripts', 'package.json']) { const s = path.join(TREE, c); if (fs.existsSync(s)) fs.cpSync(s, path.join(d, c), { recursive: true }); } return d; }
// the C7 anchors: the OLD one must be gone, the NEW one present once, in the tree as committed
{ const t = fs.readFileSync(path.join(TREE, CS), 'utf8').replace(/\r\n/g, '\n'), old = "if (!doc().closed) return set({ message: 'the loop is not closed"; console.log(JSON.stringify({ c7OldAnchor: t.split(old).length - 1, c7NewAnchor: t.split(C7FROM).length - 1 })); }
{ const d = copyTree(); const all = run(d), c7 = run(d, PLANTS[0].pattern); console.log(JSON.stringify({ id: 'CONTROL', all, c7test: c7, ok: all.pass && c7.pass })); fs.rmSync(d, { recursive: true, force: true }); }
let applied = 0, caught = 0, na = 0;
for (const p of PLANTS) {
  const d = copyTree(), fp = path.join(d, p.file), raw = fs.readFileSync(fp, 'utf8'), crlf = raw.includes('\r\n'), t = raw.replace(/\r\n/g, '\n'), n = t.split(p.from).length - 1;
  if (n !== 1) { na++; console.log(JSON.stringify({ id: p.id, applied: false, occurrences: n })); fs.rmSync(d, { recursive: true, force: true }); continue; }
  const nt = t.replace(p.from, p.to); fs.writeFileSync(fp, crlf ? nt.replace(/\n/g, '\r\n') : nt); applied++;
  const r = run(d, p.pattern); if (!r.pass) caught++;
  console.log(JSON.stringify({ id: p.id, applied: true, caught: !r.pass, tail: r.tail })); fs.rmSync(d, { recursive: true, force: true });
}
console.log(`SUMMARY ${applied} applied · ${caught} caught · ${na} NOT APPLIED`);
