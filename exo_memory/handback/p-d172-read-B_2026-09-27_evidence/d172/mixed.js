// Build D172-only versions of the mixed doc files: start from the live file (D172+D174), strip every D174 hunk.
const fs = require('fs');
const SRC = 'C:/Users/nname/Desktop/t180-track-builder/', WT = 'C:/Users/nname/AppData/Local/Temp/b-d172land-wt/';
function edit(f, pairs) {
  let t = fs.readFileSync(SRC + f, 'utf8');
  for (const [a, b] of pairs) {
    const n = t.split(a).length - 1;
    if (n !== 1) throw new Error(`${f}: expected 1 match, got ${n}: ${a.slice(0, 80)}`);
    t = t.replace(a, () => b);
  }
  if (/pitLane|pitlane|PL\./.test(t)) throw new Error(`${f}: D174 residue remains`);
  fs.writeFileSync(WT + f, t);
  console.log('wrote', f);
}
edit('src/doc/document.js', [
  ["const PL = require('./pitlane.js');\n", ''],
  ['words: [], pitLane: null, constraints', 'words: [], constraints'],
  [/\/\*\*\n \* Give the document a pit lane[\s\S]*?return setPitLane\(doc, \{ \.\.\.doc\.pitLane, \.\.\.patch \}\);\n\}\n\n/.exec(fs.readFileSync(SRC + 'src/doc/document.js', 'utf8'))[0], ''],
  ['editPhraseWord, setPitLane, editPitLane, head', 'editPhraseWord, head'],
]);
edit('src/doc/serial.js', [
  ["// SCHEMA VERSIONS. This is schema 3. Schema 1 (the first) had no texture slots; schema 2 gives every word `textures`, its\n// texture-slot overrides (src/doc/textures.js, ARCHITECTURE §5b); schema 3 gives the document `pitLane`, a side road\n// anchored to the loop or null (src/doc/pitlane.js, ARCHITECTURE §11.1). An older document is MIGRATED on load, step by\n// step through MIGRATIONS: 1 -> 2 gives every word (and every word of a phrase) `textures: {}`, so it looks exactly as\n// its fonts' defaults make it; 2 -> 3 gives the document `pitLane: null`. The track it resolves to is unchanged.",
   "// SCHEMA VERSIONS. This is schema 2. Schema 1 (the first) had no texture slots; schema 2 gives every word `textures`, its\n// texture-slot overrides (src/doc/textures.js, ARCHITECTURE §5b). An older document is MIGRATED on load, step by\n// step through MIGRATIONS: 1 -> 2 gives every word (and every word of a phrase) `textures: {}`, so it looks exactly as\n// its fonts' defaults make it. The track it resolves to is unchanged."],
  ["const PL = require('./pitlane.js');\n", ''],
  ['const SCHEMA = 3;', 'const SCHEMA = 2;'],
  ["  2: (o) => ({ ...o, schema: 3, pitLane: null }),\n", ''],
  ["  const lp = PL.problem(d.pitLane);\n  if (lp) throw new DocError('BAD_PIT_LANE', lp);\n", ''],
  ["    `  ${str('pitLane')}: ${PL.text(d.pitLane, (x) => num('m', x), (x) => fmt(Math.round(x * 100), DIGITS.kmh))},\\n` +\n", ''],
  ["\n/** A loaded pit lane with its lengths and speed snapped to their quanta; a malformed one is left for checkDoc to refuse. */\nfunction loadPitLane(l) {\n  if (PL.problem(l)) return l;\n  return PL.quantised(l, (v) => fromQ.m(toQ.m(v) || 0), (v) => (Math.round(v * 100) || 0) / 100);\n}\n", ''],
  ["'nextId', 'words', 'pitLane', 'constraints'", "'nextId', 'words', 'constraints'"],
  ['words, pitLane: loadPitLane(o.pitLane), constraints', 'words, constraints'],
]);
edit('src/doc/library.js', [
  ["  if (o.schema === 2) o = { ...o, schema: 3 };   // 2 -> 3 added the document's pitLane; a library carries none\n", ''],
]);
edit('test/doc.test.js', [
  ['"schema": 3,\\n  "generator"', '"schema": 2,\\n  "generator"'],
  ["'  \"pitLane\": null,\\n  \"constraints\"", "'  \"constraints\""],
  [' pitLane: o.pitLane, nextId', ' nextId'],
  ['{ ...o, schema: 4 }', '{ ...o, schema: 3 }'],
  ["test('a jump\\'s flight", "test('a jump\\x27s flight"],
]);
edit('test/doc-library.test.js', [
  ["t.replace('\"schema\": 3', '\"schema\": 4')", "t.replace('\"schema\": 2', '\"schema\": 3')"],
  ["L.exportPiece(lib, 'a').replace('\"schema\": 3', '\"schema\": 4')", "L.exportPiece(lib, 'a').replace('\"schema\": 2', '\"schema\": 3')"],
]);
