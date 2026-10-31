// old4.js (D454 part 3, pane E, the chair's 06:03:30Z item): the four older gates, ask-ending, second-reader, push-gate and delete-gate, get the
// app's data-dir rule (CONSONANCE_DATA, then data_dir in ~/.consonance.json, then %USERPROFILE%\.consonance). Step "test" adds the red rows; step
// "fix" adds the third step. Usage: node old4.js <lighthouse worktree> test|fix. Every anchor must occur exactly once; line endings are kept.
'use strict';
const fs = require('fs'), path = require('path');
const [root, step] = process.argv.slice(2);
function edit(rel, fn) {
  const f = path.join(root, rel); let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); s = s.split('\r\n').join('\n');
  const rep = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(rel + ': anchor found ' + n + ' times: ' + a.slice(0, 80)); s = s.replace(a, () => b); };
  fn(rep, (b) => { s = s.replace(/\n*$/, '\n') + b; });
  fs.writeFileSync(f, crlf ? s.split('\n').join('\r\n') : s); console.log('edited', rel);
}
const WHY = (what) => '// D454 part 3 (pane E): the data dir by the app\'s rule (main.rs data_dir: data_dir from ~/.consonance.json when set, else %USERPROFILE%\\.consonance).\n' +
  '// A new user who keeps the default Data folder saves data_dir "" and panes get no CONSONANCE_DATA, so ' + what + '\n';
// a stranger home: no CONSONANCE_DATA, a config with data_dir "" (what the Settings tab saves for the default), and the default folder made, as the app makes it
const HOME_JS = 'const h = require(\'../tools/scratch.js\').mkdtemp(\'app-rule-home-\'), def = path.join(h, \'.consonance\'); fs.mkdirSync(def); fs.writeFileSync(path.join(h, \'.consonance.json\'), JSON.stringify({ data_dir: \'\' }));\n' +
  '  const strangerEnv = (extra = {}) => { const e = { ...process.env, USERPROFILE: h, HOME: h, CONSONANCE_DREAM: \'\', ...extra }; delete e.CONSONANCE_DATA; return e; };\n';

if (step === 'test') {
  edit('consonance/hooks/push-gate.test.js', (rep, append) => append('\n' + WHY('this gate denied but kept no ledger: a refusal with no record.') +
    'test(\'APP RULE (D454): with CONSONANCE_DATA unset and data_dir empty, a push with a key is still refused and the refusal is recorded under USERPROFILE/.consonance\', () => {\n' +
    '  ' + HOME_JS +
    '  const { work } = repo();\n' +
    '  fs.writeFileSync(path.join(work, \'config.txt\'), `a = 1\\nkey = ${FAKE_VCK}\\n`); git(work, \'add\', \'config.txt\'); git(work, \'commit\', \'-q\', \'-m\', \'oops\');\n' +
    '  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(push(work)), encoding: \'utf8\', env: strangerEnv() });\n' +
    '  const j = r.stdout.trim() ? JSON.parse(r.stdout) : null;\n' +
    '  assert.equal(r.status, 0); assert.equal(j && j.hookSpecificOutput.permissionDecision, \'deny\', r.stdout);\n' +
    '  const lp = path.join(def, G.LEDGER), ledger = fs.existsSync(lp) ? fs.readFileSync(lp, \'utf8\') : \'\';\n' +
    '  assert.ok(ledger.includes(\'"decision":"deny"\'), \'the deny is recorded under the default data dir\'); assert.ok(!ledger.includes(FAKE_VCK), \'and never the secret\');\n' +
    '});\n'));
  edit('consonance/hooks/delete-gate.test.js', (rep, append) => append('\n' + WHY('this gate denied but kept no ledger: a refusal with no record.') +
    'test(\'APP RULE (D454): with CONSONANCE_DATA unset and data_dir empty, a delete through a junction is still refused and recorded under USERPROFILE/.consonance\', () => {\n' +
    '  ' + HOME_JS +
    '  const t = tree();\n' +
    '  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(cmd(`rm -rf "${t.wt}"`, t.root)), encoding: \'utf8\', env: strangerEnv() });\n' +
    '  const j = r.stdout.trim() ? JSON.parse(r.stdout) : null;\n' +
    '  assert.equal(r.status, 0); assert.equal(j && j.hookSpecificOutput.permissionDecision, \'deny\', r.stdout);\n' +
    '  const lp = path.join(def, G.LEDGER);\n' +
    '  assert.ok(fs.existsSync(lp) && fs.readFileSync(lp, \'utf8\').includes(\'"decision":"deny"\'), \'the deny is recorded under the default data dir\');\n' +
    '  assert.equal(fs.readFileSync(path.join(t.precious, \'keep.txt\'), \'utf8\'), \'irreplaceable\', \'the hook deletes nothing\');\n' +
    '});\n'));
  edit('consonance/hooks/ask-ending.test.js', (rep, append) => append('\n' + WHY('this hook logged nothing at all.') +
    'test(\'APP RULE (D454): with CONSONANCE_DATA unset and data_dir empty, an ending is logged under USERPROFILE/.consonance, and still never printed\', () => {\n' +
    '  ' + HOME_JS +
    '  const tr = path.join(tmp(\'aet-\'), \'t.jsonl\'); fs.writeFileSync(tr, [user(\'fix the bug\'), assistant(T(\'Done.\\n\\nWant me to also update the README?\'))].map((e) => JSON.stringify(e)).join(\'\\n\') + \'\\n\');\n' +
    '  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify({ session_id: \'s\', transcript_path: tr, cwd: \'C:/x/myproject\', hook_event_name: \'Stop\', stop_hook_active: false }), encoding: \'utf8\', env: strangerEnv() });\n' +
    '  assert.equal(r.status, 0); assert.equal(r.stdout, \'\', \'shadow: nothing printed\');\n' +
    '  const lp = path.join(def, G.LEDGER), rows = fs.existsSync(lp) ? fs.readFileSync(lp, \'utf8\').trim().split(\'\\n\').filter(Boolean).map(JSON.parse) : [];\n' +
    '  assert.equal(rows.length, 1, \'one row under the default data dir\'); assert.equal(rows[0].matched, true);\n' +
    '});\n'));
  edit('consonance/hooks/second-reader.test.js', (rep, append) => append('\n' + WHY('the second reader never ran for them: no lock, no ledger, no read.') +
    'test(\'APP RULE (D454): with CONSONANCE_DATA unset and data_dir empty, a ring is read under USERPROFILE/.consonance: its lock, its worker and its ledger row\', async () => {\n' +
    '  ' + HOME_JS +
    '  writeStub(def);\n' +
    '  const r = spawnSync(process.execPath, [HOOK], { input: payload(LIB, \'a pointer to read\'), encoding: \'utf8\', timeout: 15000, env: strangerEnv({ CONSONANCE_PANE: \'A\', CONSONANCE_SECOND_READER_WORKER: path.join(def, \'stub-worker.js\') }) });\n' +
    '  assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, \'\', \'it never blocks the ring\');\n' +
    '  assert.ok(await waitFor(() => stubDone(def) === 1), \'the worker ran from the default data dir\');\n' +
    '  assert.ok(rows(def).length >= 1, \'and the ring has a ledger row there\');\n' +
    '});\n'));
} else if (step === 'fix') {
  const third = "  return path.join(os.homedir(), '.consonance');   // D454: the app's third step (main.rs default_data), so a new user's default Data folder has this gate's record\n}";
  edit('consonance/hooks/ask-ending.js', (rep) => rep("if (d) return d; } catch (_) { /* no config */ }\n  return null;\n}", "if (d) return d; } catch (_) { /* no config */ }\n" + third));
  edit('consonance/hooks/delete-gate.js', (rep) => rep("if (d) return d; } catch (_) { /* no config */ }\n  return null;\n}", "if (d) return d; } catch (_) { /* no config */ }\n" + third));
  edit('consonance/hooks/push-gate.js', (rep) => rep("if (d) return d; } catch (_) { /* no config */ }\n  return null;\n}", "if (d) return d; } catch (_) { /* no config */ }\n" + third));
  edit('consonance/hooks/second-reader.js', (rep) => rep("  } catch (_) { /* no config: no data dir: the hook logs nothing and still allows */ }\n  return null;\n}",
    "  } catch (_) { /* no config, or no data_dir in it: the app's default below */ }\n" + third));
} else throw new Error('step is test or fix');
