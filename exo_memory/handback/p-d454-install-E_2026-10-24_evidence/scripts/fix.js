// fix.js (D454 part 3, pane E): the third step of the app's data-dir rule (main.rs default_data: %USERPROFILE%\.consonance) in the five places
// the APP RULE (D454) rows name. On a machine whose ~/.consonance.json sets data_dir nothing changes: the new step is reached only when the
// config has none. Usage: node fix.js <lighthouse worktree>. Every anchor must occur exactly once; the files are CRLF and stay CRLF.
'use strict';
const fs = require('fs'), path = require('path');
const root = process.argv[2];
function edit(rel, pairs) {
  const f = path.join(root, rel); let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); s = s.split('\r\n').join('\n');
  for (const [a, b] of pairs) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(rel + ': anchor found ' + n + ' times: ' + a.slice(0, 80)); s = s.replace(a, () => b); }
  fs.writeFileSync(f, crlf ? s.split('\n').join('\r\n') : s); console.log('edited', rel);
}

edit('consonance/hooks/sources-gate.js', [[
  "    if (d) return d;\n  } catch (_) { /* no config: no data dir: the hook logs nothing and therefore never denies */ }\n  return null;\n}",
  "    if (d) return d;\n  } catch (_) { /* no config, or no data_dir in it: the app's default below */ }\n" +
  "  // D454: the app's third step (main.rs default_data). A new user who keeps the default Data folder saves data_dir \"\", and without this the\n" +
  "  // gate had no ledger and allowed every ring. A default folder the app has not made yet is an unwritable ledger, and that still allows.\n" +
  "  return path.join(os.homedir(), '.consonance');\n}",
]]);

edit('consonance/hooks/claim-check.js', [[
  "  try { const d = String((JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '')) || {}).data_dir || '').trim(); if (d) return d; } catch (_) { /* none */ }\n  return null;\n}",
  "  try { const d = String((JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '')) || {}).data_dir || '').trim(); if (d) return d; } catch (_) { /* none */ }\n" +
  "  return path.join(os.homedir(), '.consonance');   // D454: the app's third step (main.rs default_data); a folder not made yet is an unwritable ledger, which allows\n}",
]]);

edit('consonance/tools/heavy-run.js', [
  ["const { dataDir: manifestDataDir } = require('./state-manifest.js');\n",
    "const { dataDir: manifestDataDir } = require('./state-manifest.js');\n" +
    "// D454: the app's third step (main.rs default_data), for a config with no data_dir: a new user's default Data folder. The app creates it at\n" +
    "// launch; acquire() creates it too, so a heavy run before the first launch is not refused.\n" +
    "const appDefaultDataDir = () => path.join(process.env.USERPROFILE || require('os').homedir(), '.consonance');\n"],
  ["  const dir = dataDir === undefined ? manifestDataDir() : dataDir;\n",
    "  let dir = dataDir === undefined ? manifestDataDir() : dataDir;\n" +
    "  if (dataDir === undefined && !dir) { dir = appDefaultDataDir(); fs.mkdirSync(dir, { recursive: true }); }\n"],
]);

edit('consonance/tools/state-block.js', [
  ["function liveSection() {\n  const lines = [];\n  const hw = 'C:\\\\Consonance\\\\data\\\\head-watch.jsonl';\n",
    "// D454: the ledgers live in the data dir, resolved by the app's rule (CONSONANCE_DATA, then ~/.consonance.json data_dir, then\n" +
    "// %USERPROFILE%\\.consonance), not at one machine's fixed path. On a machine whose config sets data_dir, the paths are that folder's.\n" +
    "function liveDataDir(env = process.env) {\n" +
    "  const e = String(env.CONSONANCE_DATA || '').trim(); if (e) return e;\n" +
    "  const home = env.USERPROFILE || env.HOME || '';\n" +
    "  try { const d = String((JSON.parse(fs.readFileSync(path.join(home, '.consonance.json'), 'utf8').replace(/^\\uFEFF/, '')) || {}).data_dir || '').trim(); if (d) return d; } catch (_) { /* none: the default */ }\n" +
    "  return path.join(home, '.consonance');\n" +
    "}\n" +
    "function liveSection(env = process.env) {\n  const lines = [];\n  const dir = liveDataDir(env);\n  const hw = path.join(dir, 'head-watch.jsonl');\n"],
  ["  const pc = 'C:\\\\Consonance\\\\data\\\\precompact.jsonl';\n", "  const pc = path.join(dir, 'precompact.jsonl');\n"],
  ["  return { title: 'live', cmd: 'tail -1 C:\\\\Consonance\\\\data\\\\head-watch.jsonl', lines };\n", "  return { title: 'live', cmd: 'tail -1 ' + hw, lines };\n"],
]);

edit('dev/shell/hooks/userprompt_pulse.py', [[
  "        if _d:\n            return _d, \"config\"\n    except Exception:\n        pass\n    return None, None\n",
  "        if _d:\n            return _d, \"config\"\n    except Exception:\n        pass\n" +
  "    # D454: the app's own third tier (main.rs default_data), %USERPROFILE%\\.consonance -- not the fixed path the note above refused.\n" +
  "    # A new user who keeps the default Data folder saves data_dir \"\", and without it every turn said restart detection OFF.\n" +
  "    try:\n        return os.path.join(os.path.expanduser(\"~\"), \".consonance\"), \"default\"\n    except Exception:\n        pass\n" +
  "    return None, None\n",
]]);
