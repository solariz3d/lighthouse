'use strict';
// D130 mutants for the sealed window (consonance/hooks/blind.js + board-digest.js). The four hook files are copied to a
// temp dir, one is mutated, both test files run there; the tracked files are never written. Held under the heavy-run lock.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = process.argv[2];
require(path.join(REPO, 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'sealed-window.mutants (E, D130)' });
const HOOKS = path.join(REPO, 'consonance', 'hooks');
const FILES = ['blind.js', 'board-digest.js', 'blind.test.js', 'board-digest.test.js'];
const SRC = Object.fromEntries(FILES.map((f) => [f, fs.readFileSync(path.join(HOOKS, f), 'utf8')]));
const B = 'blind.js', D = 'board-digest.js';
const M = [
  [B, 'the librarian is not exempt', 'const EXEMPT = new Set([MAIN_SID, LIBRARIAN_SID]);', 'const EXEMPT = new Set([MAIN_SID]);'],
  [B, 'the chair is not exempt', 'const EXEMPT = new Set([MAIN_SID, LIBRARIAN_SID]);', 'const EXEMPT = new Set([LIBRARIAN_SID]);'],
  [B, 'any prompt naming a sealed read opens a window (no chair head)', 'return CHAIR_HEAD.test(p) && SEALED_WORDS.test(p);', 'return SEALED_WORDS.test(p);'],
  [B, 'blind reads are not detected', 'const SEALED_WORDS = /\\b(?:sealed|blind)[ -]?', 'const SEALED_WORDS = /\\b(?:sealed)[ -]?'],
  [B, 'a pasted packet is not recognised as a chair dispatch', 'const CHAIR_HEAD = /^\\s*(?:<pasted_content[^>]*>\\s*)?\\[chair:', 'const CHAIR_HEAD = /^\\s*\\[chair:'],
  [B, 'no ring ever ends a window', 'if (ts > since && re.test(String(e.text || \'\'))) return ts;', 'if (false) return ts;'],
  [B, 'a ring from before the window ends it', 'if (ts > since && re.test(', 'if (ts > 0 && re.test('],
  [B, 'any seat\'s ring ends the window', '`^\\\\s*(?:<pasted_content[^>]*>\\\\s*)?\\\\[pane:${letter.replace(/[^A-Za-z0-9]/g, \'\')}\\\\]`', '`^\\\\s*(?:<pasted_content[^>]*>\\\\s*)?\\\\[pane:[A-Za-z0-9]+\\\\]`'],
  [B, 'a refused ring ends the window (anchor dropped)', 'new RegExp(`^\\\\s*(?:<pasted_content', 'new RegExp(`(?:<pasted_content'],
  [B, 'a damaged sealed file fails OPEN', '  return { ok: false, raw: raw.slice(0, 200) };\n}', '  return { ok: true, windows: {} };\n}'],
  [B, 'the backstop never expires', 'if (now > until) return close(', 'if (false) return close('],
  [B, 'an unusable expiry fails open', "      + `so this failed CLOSED. Fix or remove ${file}.` };", "      + `so this failed CLOSED. Fix or remove ${file}.`, mute: false };"],
  [B, 'the window is not written on open', '    try { writeSealed(file, windows); } catch (e) {\n      recorded = false;', '    try { } catch (e) {\n      recorded = false;'],
  [B, 'the dispatching prompt itself is not muted', "    return { mute: true, line: `[blind] pane activity withheld — this prompt is a sealed read", "    return { mute: false, line: `[blind] pane activity withheld — this prompt is a sealed read"],
  [B, 'an ended window is not removed from the file', '  const close = (why, notice) => {\n    delete windows[sid];', '  const close = (why, notice) => {\n    void sid;'],
  [B, 'the OPEN is not recorded on the board', "    if (recorded) markBoard(`sealed window OPEN", "    if (false) markBoard(`sealed window OPEN"],
  [B, 'the CLOSE is not recorded on the board', "    markBoard(`sealed window CLOSED — for ${who} — ${why}`, boardPath);", ''],
  [D, 'the digest ignores the sealed gate', '  if (sealed.mute) emit(sealed.line);', ''],
  [D, 'the end notice is not shown', "${sealed.notice ? `${sealed.notice}\\n        ` : ''}[panes]", '[panes]'],
  [D, 'the prompt is not passed to the gate', '    prompt: input.prompt,', '    prompt: \'\','],
  [D, 'the reader\'s letter is not passed to the gate', "    letter: readJson(path.join(dataDir, 'letters.json'), {})[sessionId],", '    letter: undefined,'],
];
function score(file, text) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'd130-mut-'));
  try {
    for (const f of FILES) fs.writeFileSync(path.join(root, f), f === file ? text : SRC[f]);
    if (file && spawnSync(process.execPath, ['--check', path.join(root, file)]).status !== 0) return { noResult: true };
    let pass = 0, fail = 0;
    for (const t of ['blind.test.js', 'board-digest.test.js']) {
      const r = spawnSync(process.execPath, ['--test', path.join(root, t)], { encoding: 'utf8', timeout: 180000 });
      const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
      const n = (k) => Number((o.match(new RegExp('^(?:ℹ|#) ' + k + ' ([0-9]+)', 'm')) || [])[1] || 0);
      pass += n('pass'); fail += n('fail') + n('cancelled');
    }
    return { pass, fail };
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
const base = score(null, null);
console.log(`baseline: pass ${base.pass} · fail ${base.fail}`);
if (base.fail || !base.pass) { console.log('BASELINE NOT GREEN — no mutant can be scored'); process.exit(2); }
let applied = 0, caught = 0, na = 0;
for (const [file, name, from, to] of M) {
  const k = SRC[file].split(from).length - 1;
  if (k !== 1) { na++; console.log(`NOT APPLIED (${k} matches)  ${name}`); continue; }
  applied++;
  const r = score(file, SRC[file].replace(from, to));
  if (r.noResult) { console.log(`NO RESULT   ${name}`); continue; }
  if (r.fail > 0) { caught++; console.log(`caught (${r.fail} red)  ${name}`); } else console.log(`SURVIVED    ${name}`);
}
console.log(`\n${M.length} mutants · applied ${applied} · caught ${caught} · NOT APPLIED ${na}`);
process.exit(applied === caught && na === 0 ? 0 : 1);
