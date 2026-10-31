// cold.js (D454 part 3, pane E): P's cold-read items routed to E (lighthouse 6977ad83, "P's cold read routed"). Step "test" adds the red rows,
// step "fix" makes them green. 1C.4: prompt-events, tell-index and whats-live resolve the data dir (and whats-live the instances dir) by the
// app's rule. 1C.6 / 1B.3: hooks/README's "not in the installer's list" names exactly install.ps1's $unmanaged.
// Usage: node cold.js <lighthouse worktree> test|fix. Every anchor must occur exactly once; a file's line endings are kept.
'use strict';
const fs = require('fs'), path = require('path');
const [root, step] = process.argv.slice(2);
function edit(rel, fn) {
  const f = path.join(root, rel); let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); s = s.split('\r\n').join('\n');
  const rep = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(rel + ': anchor found ' + n + ' times: ' + a.slice(0, 80)); s = s.replace(a, () => b); };
  fn(rep, (b) => { s = s.replace(/\n*$/, '\n') + b; });
  fs.writeFileSync(f, crlf ? s.split('\n').join('\r\n') : s); console.log('edited', rel);
}
const WHY = '// D454 part 3 (pane E, P\'s cold read 1C.4): the data dir by the app\'s rule (main.rs data_dir: data_dir from ~/.consonance.json when set, else\n' +
  '// %USERPROFILE%\\.consonance; CONSONANCE_DATA first), not one machine\'s fixed folder.\n';

if (step === 'test') {
  edit('consonance/tools/prompt-events.test.js', (rep) => rep('console.log(`\\n${n} passed`);',
    WHY +
    '{\n' +
    '  const h = require("./scratch.js").mkdtemp("pe-home-"), env = { ...process.env, USERPROFILE: h, HOME: h }; delete env.CONSONANCE_DATA;\n' +
    '  const r = require("child_process").spawnSync(process.execPath, [require("path").join(__dirname, "prompt-events.js")], { env, encoding: "utf8" });\n' +
    '  const want = require("path").join(h, ".consonance", "captures");\n' +
    '  ok(r.status === 1 && r.stderr.includes("no captures at " + want), "APP RULE (D454): with no data_dir the captures are looked for under USERPROFILE/.consonance (" + r.stderr.trim().slice(0, 160) + ")");\n' +
    '  require("fs").mkdirSync(require("path").join(h, "custom"));\n' +
    '  require("fs").writeFileSync(require("path").join(h, ".consonance.json"), JSON.stringify({ data_dir: require("path").join(h, "custom") }));\n' +
    '  const r2 = require("child_process").spawnSync(process.execPath, [require("path").join(__dirname, "prompt-events.js")], { env, encoding: "utf8" });\n' +
    '  ok(r2.stderr.includes("no captures at " + require("path").join(h, "custom", "captures")), "APP RULE (D454): with data_dir set the captures are looked for there (" + r2.stderr.trim().slice(0, 160) + ")");\n' +
    '}\n\n' +
    'console.log(`\\n${n} passed`);'));

  edit('consonance/tools/tell-index.test.js', (rep, append) => append('\n' + WHY +
    'test(\'APP RULE (D454): with CONSONANCE_DATA unset and data_dir empty or absent, the board is looked for under USERPROFILE/.consonance\', () => {\n' +
    '  const cp = require(\'child_process\'), path = require(\'path\'), fs = require(\'fs\');\n' +
    '  for (const cfg of [null, { data_dir: \'\' }]) {\n' +
    '    const h = require(\'./scratch.js\').mkdtemp(\'ti-home-\'); if (cfg) fs.writeFileSync(path.join(h, \'.consonance.json\'), JSON.stringify(cfg));\n' +
    '    const env = { ...process.env, USERPROFILE: h, HOME: h }; delete env.CONSONANCE_DATA;\n' +
    '    const got = cp.execFileSync(process.execPath, [\'-e\', \'process.stdout.write(require(\' + JSON.stringify(path.join(__dirname, \'tell-index.js\')) + \').dataDir())\'], { env, encoding: \'utf8\' });\n' +
    '    assert.strictEqual(got, path.join(h, \'.consonance\'), JSON.stringify(cfg));\n' +
    '  }\n' +
    '});\n'));

  edit('consonance/tools/whats-live.test.js', (rep, append) => append('\n' + WHY +
    '// The instances dir by the same rule (main.rs default_instances: instances_dir when set, else %USERPROFILE%\\claude-instances).\n' +
    'test(\'APP RULE (D454): with nothing in ~/.consonance.json the board is under USERPROFILE/.consonance and the dreams under USERPROFILE/claude-instances\', () => {\n' +
    '  const cp = require(\'child_process\'), path = require(\'path\'), fs = require(\'fs\');\n' +
    '  const h = require(\'./scratch.js\').mkdtemp(\'wl-home-\');\n' +
    '  fs.mkdirSync(path.join(h, \'claude-instances\', \'sibling-x\', \'dreams\'), { recursive: true }); fs.writeFileSync(path.join(h, \'claude-instances\', \'sibling-x\', \'dreams\', \'a.md\'), \'x\');\n' +
    '  const env = { ...process.env, USERPROFILE: h, HOME: h }; delete env.CONSONANCE_DATA;\n' +
    '  const js = \'const w=require(\' + JSON.stringify(path.join(__dirname, \'whats-live.js\')) + \');const b=w.check().rows.find((r)=>r[0]===\\\'board\\\');process.stdout.write(JSON.stringify({board:b&&b[2],live:w.dreams().live}))\';\n' +
    '  const got = JSON.parse(cp.execFileSync(process.execPath, [\'-e\', js], { env, encoding: \'utf8\' }));\n' +
    '  assert.strictEqual(got.board, path.join(h, \'.consonance\', \'board.jsonl\'), JSON.stringify(got));\n' +
    '  assert.strictEqual(got.live, 1, \'the one dream under the default instances dir is found\');\n' +
    '  fs.writeFileSync(path.join(h, \'.consonance.json\'), JSON.stringify({ data_dir: path.join(h, \'d\'), instances_dir: path.join(h, \'i\') }));\n' +
    '  const got2 = JSON.parse(cp.execFileSync(process.execPath, [\'-e\', js], { env, encoding: \'utf8\' }));\n' +
    '  assert.strictEqual(got2.board, path.join(h, \'d\', \'board.jsonl\'), JSON.stringify(got2)); assert.strictEqual(got2.live, 0, \'instances_dir is honoured\');\n' +
    '});\n'));

  edit('consonance/tools/install-only.test.js', (rep, append) => append('\n' +
    '// D454 part 3 (pane E, P\'s cold read 1C.6 / 1B.3): hooks/README says which files are "not in the installer\'s list". That sentence named three\n' +
    '// (and jev-flags) while install.ps1\'s $unmanaged had five rows, claim-check added since 0.1.1. The README now follows the list, and this row holds it there.\n' +
    'test(\'D454: hooks/README names exactly the files of install.ps1 $unmanaged as not in the installer list, and says how many\', () => {\n' +
    '  const repo = path.resolve(__dirname, \'..\', \'..\');\n' +
    '  const ps = fs.readFileSync(path.join(repo, \'dev\', \'shell\', \'install.ps1\'), \'utf8\');\n' +
    '  const block = ps.slice(ps.indexOf(\'$unmanaged = @(\'), ps.indexOf(\'\\n)\', ps.indexOf(\'$unmanaged = @(\')));\n' +
    '  const listed = [...block.matchAll(/Src = \'[^\']*\\\\([^\\\\\']+\\.js)\'/g)].map((m) => m[1]).sort();\n' +
    '  assert.ok(listed.length >= 1, \'the $unmanaged list was read\');\n' +
    '  const readme = fs.readFileSync(path.join(repo, \'consonance\', \'hooks\', \'README.md\'), \'utf8\');\n' +
    '  const at = readme.indexOf(\'As the script stands\'), end = readme.indexOf(\'is a library\', at);\n' +
    '  assert.ok(at >= 0 && end > at, \'the sentence is in the README\');\n' +
    '  const sentence = readme.slice(at, end);\n' +
    '  const named = [...new Set([...sentence.matchAll(/`([a-z0-9-]+\\.js)`/g)].map((m) => m[1]))].filter((n) => n !== \'blind.js\').sort();\n' +
    '  assert.deepStrictEqual(named, listed, \'the README names the $unmanaged files, no more and no fewer\');\n' +
    '  const words = [\'zero\', \'one\', \'two\', \'three\', \'four\', \'five\', \'six\', \'seven\', \'eight\', \'nine\', \'ten\'];\n' +
    '  assert.match(sentence, new RegExp(\'\\\\b\' + words[listed.length] + \'\\\\b\'), \'and gives their number, \' + words[listed.length]);\n' +
    '});\n'));
} else if (step === 'fix') {
  edit('consonance/tools/prompt-events.js', (rep) => {
    rep('const CAPTURES = "C:/Consonance/data/captures";',
      '// D454: the data dir by the app\'s rule (CONSONANCE_DATA, then ~/.consonance.json data_dir, then %USERPROFILE%\\.consonance), not one machine\'s folder.\n' +
      'function dataDir() {\n' +
      '  const e = String(process.env.CONSONANCE_DATA || "").trim(); if (e) return e;\n' +
      '  const home = process.env.USERPROFILE || require("os").homedir();\n' +
      '  try { const d = String((JSON.parse(fs.readFileSync(path.join(home, ".consonance.json"), "utf8").replace(/^\\uFEFF/, "")) || {}).data_dir || "").trim(); if (d) return d; } catch (e) { /* none: the default */ }\n' +
      '  return path.join(home, ".consonance");\n' +
      '}\n' +
      'const CAPTURES = path.join(dataDir(), "captures");');
    rep('    const reg = JSON.parse(fs.readFileSync("C:/Consonance/data/panes.json", "utf8"));', '    const reg = JSON.parse(fs.readFileSync(path.join(path.dirname(CAPTURES), "panes.json"), "utf8"));');
  });
  edit('consonance/tools/tell-index.js', (rep) => rep("  return 'C:\\\\Consonance\\\\data';\n}",
    "  return path.join(os.homedir(), '.consonance');   // D454: the app's third step (main.rs default_data), not one machine's folder\n}"));
  edit('consonance/tools/whats-live.js', (rep) => rep("const DATA = process.env.CONSONANCE_DATA || 'C:/Consonance/data';\nconst INSTANCES = 'C:/Consonance/instances';",
    "// D454: both dirs by the app's rule (main.rs data_dir and instances_root): ~/.consonance.json's data_dir / instances_dir when set, else\n" +
    "// %USERPROFILE%\\.consonance and %USERPROFILE%\\claude-instances; CONSONANCE_DATA first for the data dir, as before.\n" +
    "const HOME = process.env.USERPROFILE || require('os').homedir();\n" +
    "const fromConfig = (key) => { try { const v = (JSON.parse(fs.readFileSync(path.join(HOME, '.consonance.json'), 'utf8').replace(/^\\uFEFF/, '')) || {})[key]; return typeof v === 'string' ? v.trim() : ''; } catch (_) { return ''; } };\n" +
    "const DATA = String(process.env.CONSONANCE_DATA || '').trim() || fromConfig('data_dir') || path.join(HOME, '.consonance');\n" +
    "const INSTANCES = fromConfig('instances_dir') || path.join(HOME, 'claude-instances');"));
  edit('consonance/hooks/README.md', (rep) => rep(
    "As the script stands, `ask-surface.js`, `baton-wake-stop.js` and `live-mirror-stop.js` are in the third state (so is `jev-flags.js`, retired: its registration and copy were dropped on 2026-10-08), and",
    "As the script stands, its `$unmanaged` list has five files in the third state: `ask-surface.js`, `baton-wake-stop.js`, `live-mirror-stop.js`, `claim-check.js` (built and off: it acts only when `~/.consonance.json` sets `claim_check`), and `jev-flags.js`, retired (its registration and copy were dropped on 2026-10-08). And"));
} else throw new Error('step is test or fix');
