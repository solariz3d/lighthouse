// mutants.js (D592, pane E): the overwrite decision broken one way at a time, in a COPY (app/, src/, src-tauri/src/, tools/ of the d592 worktree, under the OS temp
// dir); the copy's app/test/overwrite.test.js must go red for each. The worktree is read, never written (its files are hashed before and after).
//   node mutants.js [--only <n>]
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Downloads/t180-wt-e592';
const M = [
  ['O1 the open track under its own name asks too', 'app/core/coreshell.js', 'if (open === want) return null;', 'if (false) return null;'],
  ['O2 the name is matched case-sensitively', 'app/core/coreshell.js', "n.slice(PREFIX.length).toLowerCase() === want", 'n.slice(PREFIX.length) === name'],
  ['O3 a save never asks', 'app/core/coreshell.js', 'const target = await replaceTarget(name);', 'const target = null;'],
  ['O4 no way to ask counts as Replace', 'app/core/coreshell.js', "typeof confirmReplace === 'function' ? await confirmReplace(target) : false;", "typeof confirmReplace === 'function' ? await confirmReplace(target) : true;"],
  ['O5 any answer but a refusal replaces', 'app/core/coreshell.js', 'if (yes !== true) return set(', 'if (yes === false) return set('],
  ['O6 the date is not carried', 'app/core/coreshell.js', 'savedAt: Number.isFinite(savedAt) ? savedAt : null', 'savedAt: null'],
  ['O7 the open track is matched in its saved case only', 'app/core/coreshell.js', "open = st.name ? st.name.toLowerCase() : null", 'open = st.name'],
  ['A1 a different road never asks', 'app/core/overwrite.js', 'return !(state.geometry && geometry && state.geometry === geometry);', 'return false;'],
  ['A2 an unrecorded road counts as the same', 'app/core/overwrite.js', 'return !(state.geometry && geometry && state.geometry === geometry);', 'return state.geometry !== geometry && !!state.geometry && !!geometry;'],
  ['A3 a folder not ours is asked about', 'app/core/overwrite.js', 'if (!state || !state.exists || !state.marker) return false;', 'if (!state || !state.exists) return false;'],
  ['A4 the export is asked about even when nothing is installed', 'app/core/overwrite.js', 'if (!state || !state.exists || !state.marker) return false;', 'if (!state) return false;'],
  ['A5 the marker is not found among the files', 'app/core/overwrite.js', 'x && x.path === MARKER_FILE', 'x && x.path === MARKER_FILE + "x"'],
  ['A6 Cancel installs anyway', 'app/install/install.js', 'if (yes !== true) return { ok: false, cancelled: true,', 'if (false) return { ok: false, cancelled: true,'],
  ['A7 no way to ask counts as Replace', 'app/install/install.js', "typeof confirmReplace === 'function' ? await confirmReplace({ folder: f.folder, written: (s && s.written) || null }) : false;", "typeof confirmReplace === 'function' ? await confirmReplace({ folder: f.folder, written: (s && s.written) || null }) : true;"],
  ['A9 any answer but a refusal installs', 'app/install/install.js', 'if (yes !== true) return { ok: false, cancelled: true,', 'if (yes === false) return { ok: false, cancelled: true,'],
  ['A8 the installed date is not carried', 'app/install/install.js', 'written: (s && s.written) || null', 'written: null'],
  ['Q1 Replace is the default', 'app/core/overwrite.js', "const BUTTONS = [{ label: 'Cancel', value: 'cancel', default: true }, { label: 'Replace', value: 'replace', kind: 'main' }];", "const BUTTONS = [{ label: 'Cancel', value: 'cancel' }, { label: 'Replace', value: 'replace', kind: 'main', default: true }];"],
  ['Q2 the save question does not name the date', 'app/core/overwrite.js', "${at ? `, last saved ${at}` : ''}", "${''}"],
  ['Q3 the time is read in UTC', 'app/core/overwrite.js', '${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())} ${two(d.getHours())}:${two(d.getMinutes())}', '${d.getUTCFullYear()}-${two(d.getUTCMonth() + 1)}-${two(d.getUTCDate())} ${two(d.getUTCHours())}:${two(d.getUTCMinutes())}'],
  ['W1 Save does not pass the question', 'app/index.html', "shell.save($('name').value.trim(), { confirmReplace: confirmSave })", "shell.save($('name').value.trim())"],
  ['W2 the installer is not given the question', 'app/install/index.js', 'getTextures, confirmReplace });', 'getTextures });'],
];
const only = process.argv.includes('--only') ? +process.argv[process.argv.indexOf('--only') + 1] : null;
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const watched = [...new Set(M.map((m) => m[1]))].map((f) => path.join(REPO, f));
const before = watched.map(sha);
const copyTree = (to) => { for (const d of ['app', 'src', 'src-tauri/src', 'tools']) fs.cpSync(path.join(REPO, d), path.join(to, d), { recursive: true }); };
const run = (root) => spawnSync(process.execPath, ['--test', path.join(root, 'app/test/overwrite.test.js')], { encoding: 'utf8', timeout: 300000, env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT')) });
let applied = 0, caught = 0, notApplied = 0;
const pre = fs.mkdtempSync(path.join(os.tmpdir(), 'd592-mut-')); copyTree(pre);
const p0 = run(pre); fs.rmSync(pre, { recursive: true, force: true });
console.log(`pre-flight (unmutated copy): ${p0.status === 0 ? 'green' : 'RED'}`);
if (p0.status !== 0) { console.log(p0.stdout.slice(-2000)); process.exit(2); }
M.forEach(([id, rel, from, to], i) => {
  if (only !== null && only !== i + 1) return;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'd592-mut-'));
  try {
    copyTree(dir);
    const f = path.join(dir, rel), src = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'), n = src.split(from).length - 1;
    if (n !== 1) { notApplied++; console.log(`  NOT APPLIED #${i + 1} ${id}: the anchor occurs ${n} times`); return; }
    fs.writeFileSync(f, src.replace(from, () => to));
    applied++;
    const r = run(dir), out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
    const failed = [...out.matchAll(/^\s*✖ (row \d+)/gm)].map((m) => m[1]);
    if (r.status !== 0) { caught++; console.log(`  killed    #${i + 1} ${id}   (${[...new Set(failed)].join(' | ')})`); }
    else console.log(`  SURVIVED  #${i + 1} ${id}`);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
const after = watched.map(sha);
console.log(`\napplied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}`);
console.log(`worktree files unchanged: ${before.every((h, i) => h === after[i])}`);
