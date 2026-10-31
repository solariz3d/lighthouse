// add-tests.js (D454 part 3, pane E): the red rows first. Each new row asks that a hook or tool resolve its data dir by the app's rule
// (main.rs data_dir: data_dir from ~/.consonance.json when set, else %USERPROFILE%\.consonance; CONSONANCE_DATA first where the tool honours it).
// Usage: node add-tests.js <lighthouse worktree>. Every anchor must occur exactly once. The files are CRLF and stay CRLF.
'use strict';
const fs = require('fs'), path = require('path');
const root = process.argv[2];
function edit(rel, fn) {
  const f = path.join(root, rel); let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); s = s.split('\r\n').join('\n');
  const rep = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(rel + ': anchor found ' + n + ' times: ' + a.slice(0, 80)); s = s.replace(a, () => b); };
  const append = (b) => { s = s.replace(/\n*$/, '\n') + b; };
  fn(rep, append);
  fs.writeFileSync(f, crlf ? s.split('\n').join('\r\n') : s); console.log('edited', rel);
}

const WHY = '// D454 part 3 (pane E): the data dir by the app\'s rule (main.rs data_dir: data_dir from ~/.consonance.json when set, else %USERPROFILE%\\.consonance).\n' +
  '// A new user who keeps the default Data folder saves data_dir "" (ui/app.js), and the app gives panes no CONSONANCE_DATA, so without the third step\n';

edit('consonance/hooks/sources-gate.test.js', (rep, append) => append('\n' + WHY +
  '// this gate had no ledger and allowed every ring.\n' +
  'test(\'APP RULE (D454): with CONSONANCE_DATA unset and data_dir empty or absent, the ledger is USERPROFILE/.consonance and a ring with no SOURCES line is denied\', () => {\n' +
  '  for (const cfg of [{ data_dir: \'\' }, null]) {\n' +
  '    const h = homeWith(cfg), data = path.join(h, \'.consonance\'); fs.mkdirSync(data);\n' +
  '    const dir = tmpDir(), input = payloadOf(dir, [USER(\'go\')], { text: \'no sources\' });\n' +
  '    const r = spawnSync(process.execPath, [HOOK], { input, env: { ...envFor(dir), CONSONANCE_DATA: \'\', USERPROFILE: h, HOME: h }, encoding: \'utf8\', timeout: 20000 });\n' +
  '    assert.strictEqual(r.status, 0, r.stderr);\n' +
  '    assert.match(r.stdout, /"permissionDecision":"deny"/, JSON.stringify(cfg) + \': \' + r.stdout);\n' +
  '    assert.ok(fs.existsSync(path.join(data, \'sources-gate.jsonl\')), \'the refusal is recorded under the default data dir\');\n' +
  '  }\n' +
  '});\n'));

edit('consonance/hooks/claim-check.test.js', (rep, append) => append('\n' + WHY +
  '// the switched-on check had no ledger and let every claim through.\n' +
  'test(\'APP RULE (D454): with data_dir empty or absent, ON keeps its ledger in USERPROFILE/.consonance and refuses\', () => {\n' +
  '  for (const extra of [{ data_dir: \'\' }, {}]) {\n' +
  '    const h = fs.mkdtempSync(path.join(tmp, \'home-\')), data = path.join(h, \'.consonance\'); fs.mkdirSync(data);\n' +
  '    fs.writeFileSync(path.join(h, \'.consonance.json\'), JSON.stringify({ claim_check: true, ...extra }));\n' +
  '    const tr = path.join(h, \'t.jsonl\'); fs.writeFileSync(tr, JSON.stringify({ type: \'user\', timestamp: T0, message: { role: \'user\', content: \'collate it\' } }) + \'\\n\');\n' +
  '    const r = runHook({ h, data, tr }, ring(tr));\n' +
  '    assert.match(r.out, /"permissionDecision":"deny"/, JSON.stringify(extra) + \': \' + r.out);\n' +
  '    assert.strictEqual(r.ledger.length, 1, \'the refusal is recorded under the default data dir\');\n' +
  '  }\n' +
  '});\n'));

edit('consonance/tools/heavy-run.test.js', (rep, append) => append('\n' + WHY +
  '// a heavy run refused with "no data dir", README\'s `node consonance/tools/js-suite.js` among them. The app creates that folder; so does the lock.\n' +
  'test(\'APP RULE (D454): with CONSONANCE_DATA unset and data_dir empty or absent, hold() takes its lock in USERPROFILE/.consonance and runs the work\', async () => {\n' +
  '  for (const cfg of [{ data_dir: \'\' }, null]) {\n' +
  '    const h = tmp(); if (cfg) fs.writeFileSync(path.join(h, \'.consonance.json\'), JSON.stringify(cfg));\n' +
  '    const env = cleanEnv({ USERPROFILE: h, HOME: h }); delete env.CONSONANCE_DATA;\n' +
  '    const def = path.join(h, \'.consonance\');\n' +
  '    const c = spawn(process.execPath, [\'-e\', `const fs=require(\'fs\');require(${JSON.stringify(HELPER)}).hold({cmd:\'app rule\'});const l=fs.existsSync(${JSON.stringify(def)})?fs.readdirSync(${JSON.stringify(def)}).filter((n)=>/^heavy-run(\\\\.\\\\d+)?\\\\.lock$/.test(n)):[];console.log(l.length?\'LOCKED\':\'NOLOCK\');console.log(\'RAN\')`], { env, stdio: [\'ignore\', \'pipe\', \'pipe\'] });\n' +
  '    const r = await done(c);\n' +
  '    assert.strictEqual(r.code, 0, JSON.stringify(cfg) + \': \' + r.err); assert.match(r.out, /RAN/); assert.match(r.out, /LOCKED/, \'the lock is under the default data dir: \' + r.out + r.err);\n' +
  '  }\n' +
  '});\n'));

edit('consonance/tools/state-block.test.js', (rep, append) => append('\n' + WHY +
  '// the live section read one machine\'s fixed ledger paths on every machine.\n' +
  'test(\'APP RULE (D454): the live ledgers are read from the data dir by the app\\\'s rule, and the printed check names that path\', () => {\n' +
  '  const h = require(\'./scratch.js\').mkdtemp(\'sb-home-\'), def = path.join(h, \'.consonance\'); fs.mkdirSync(def);\n' +
  '  fs.writeFileSync(path.join(def, \'head-watch.jsonl\'), JSON.stringify({ ts: \'2026-10-25T04:00:00.000Z\', event: \'start\' }) + \'\\n\');\n' +
  '  let s = sb.liveSection({ USERPROFILE: h });\n' +
  '  assert.match(s.lines.join(\'\\n\'), /head-watch ledger 1 row\\(s\\), last start/, s.lines.join(\' | \')); assert.ok(s.cmd.includes(path.join(def, \'head-watch.jsonl\')), s.cmd);\n' +
  '  const custom = path.join(h, \'custom\'); fs.mkdirSync(custom); fs.writeFileSync(path.join(h, \'.consonance.json\'), JSON.stringify({ data_dir: custom }));\n' +
  '  s = sb.liveSection({ USERPROFILE: h });\n' +
  '  assert.match(s.lines.join(\'\\n\'), /head-watch ledger unreadable \\(ENOENT\\)/, s.lines.join(\' | \')); assert.ok(s.cmd.includes(path.join(custom, \'head-watch.jsonl\')), s.cmd);\n' +
  '  s = sb.liveSection({ USERPROFILE: h, CONSONANCE_DATA: def });\n' +
  '  assert.match(s.lines.join(\'\\n\'), /head-watch ledger 1 row/, \'CONSONANCE_DATA comes first\');\n' +
  '});\n'));

edit('dev/shell/hooks/userprompt_pulse.test.js', (rep, append) => {
  rep('function run({ prevMsAgo, compactMsAgo, startMsAgo, hook = HOOK, stdin = true }) {\n  const home = require(\'../../../consonance/tools/scratch.js\').mkdtemp(\'pulse-home-\');\n  const data = require(\'../../../consonance/tools/scratch.js\').mkdtemp(\'pulse-data-\');',
    '// dataVia \'default\' (D454): no CONSONANCE_DATA and no ~/.consonance.json, so the data dir is the app\'s default, <home>/.consonance\n' +
    'function run({ prevMsAgo, compactMsAgo, startMsAgo, hook = HOOK, stdin = true, dataVia = \'env\' }) {\n  const home = require(\'../../../consonance/tools/scratch.js\').mkdtemp(\'pulse-home-\');\n' +
    '  const data = dataVia === \'default\' ? path.join(home, \'.consonance\') : require(\'../../../consonance/tools/scratch.js\').mkdtemp(\'pulse-data-\');\n' +
    '  fs.mkdirSync(data, { recursive: true });');
  rep('    env: { ...process.env, USERPROFILE: home, HOME: home, CONSONANCE_DATA: data },',
    '    env: { ...process.env, USERPROFILE: home, HOME: home, CONSONANCE_DATA: dataVia === \'default\' ? \'\' : data },');
  append('\n' + WHY +
    '// the pulse said "restart detection OFF" on every turn of a default install.\n' +
    'test(\'APP RULE (D454): with CONSONANCE_DATA unset and no data_dir, a restart is read from USERPROFILE/.consonance/head-watch.jsonl\', () => {\n' +
    '  const r = run({ prevMsAgo: 2 * H, startMsAgo: 1 * H, dataVia: \'default\' });\n' +
    '  assert.ok(r.ctx, r.raw + r.err);\n' +
    '  assert.doesNotMatch(r.ctx, /restart detection OFF/, r.ctx);\n' +
    '  assert.match(r.ctx, /crosses a restart/, r.ctx);\n' +
    '});\n');
});
