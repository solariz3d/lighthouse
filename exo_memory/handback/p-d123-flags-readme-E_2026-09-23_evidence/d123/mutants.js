// D123 mutants for jev/bin/jev-report.js: copy jev/lib/config.js, jev/bin/jev-report.js and jev/test/jev-report.test.js
// into a temp jev/ tree, apply ONE replacement to the report, run its test there. CAUGHT = a test fails that the unmutated
// copy passes (or the run hangs). Line endings matched to the file. Sequential.
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const J = 'C:/Users/nname/Desktop/lighthouse/jev';
const src = fs.readFileSync(path.join(J, 'bin', 'jev-report.js'), 'utf8');
const EOL = src.includes('\r\n') ? '\r\n' : '\n';
const names = (out) => new Set((out.match(/^✖ .+? \(\d[\d.]*ms\)$/gm) || []).map((l) => l.replace(/^✖ /, '').replace(/ \(\d[\d.]*ms\)$/, '')));
function run(code) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'd123-rep-'));
  try {
    for (const d of ['lib', 'bin', 'test']) fs.mkdirSync(path.join(root, 'jev', d), { recursive: true });
    fs.copyFileSync(path.join(J, 'lib', 'config.js'), path.join(root, 'jev', 'lib', 'config.js'));
    fs.copyFileSync(path.join(J, 'test', 'jev-report.test.js'), path.join(root, 'jev', 'test', 'jev-report.test.js'));
    fs.writeFileSync(path.join(root, 'jev', 'bin', 'jev-report.js'), code);
    const r = cp.spawnSync(process.execPath, ['--test', 'jev-report.test.js'], { cwd: path.join(root, 'jev', 'test'), encoding: 'utf8', timeout: 90000, env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' } });
    if (r.error && r.error.code === 'ETIMEDOUT') return { hung: true, failed: new Set() };
    return { hung: false, failed: names(r.stdout || '') };
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
const M = [
  ['R1 marked counts every verdict', "s.marked = turns.filter((t) => t.verdict === 'drift').length;", "s.marked = turns.length;"],
  ['R2 duplicates counted as new turns', "if (seen !== undefined) { s.duplicates++;", "if (false) { s.duplicates++;"],
  ['R3 the new prompt_id shape is not read', "  return [str(o.prompt_id) && `${sid}:p:${o.prompt_id}`,", "  return [false && `${sid}:p:${o.prompt_id}`,"],
  ['R4 a corrupt ledger line crashes', "const parse = (line) => { try { const o = JSON.parse(line);", "const parse = (line) => { { const o = JSON.parse(line);"],
  ['R5 a row with no verdict counts', "if (!o || !str(o.verdict) || !keys.length) { s.corruptLedgerLines++; continue; }", "if (!o || !keys.length) { s.corruptLedgerLines++; continue; }"],
  ['R6 a missing ledger crashes', "if (e.code === 'ENOENT') return null; throw e;", "throw e;"],
  ['R7 log outcomes not counted', "s.failures[o.outcome] = (s.failures[o.outcome] || 0) + 1;", "void o;"],
  ['R8 a precision printed without labels', "    out.push(`  confirmation: unconfirmed — no labels file at ${c.labelsFile}; a mark is a hint until a person labels it`);", "    out.push(`  confirmed 0% precision (no labels)`);"],
  ['R9 confirmed counts any label, not drift', "confirmed: labelled.filter((i) => byTurn.get(i) === 'drift').length,", "confirmed: labelled.length,"],
  ['R10 a label on an unmarked turn counts', "const labelled = marked.filter((i) => byTurn.has(i));", "const labelled = [...byTurn.keys()];"],
  ['R11 the explicit labels path ignored', "const labelsFile = str(labelsPath) || path.join(ledgerDir, LABELS);", "const labelsFile = path.join(ledgerDir, LABELS);"],
  ['R12 a corrupt line is PRINTED', "  if (s.corruptLedgerLines) out.push(`  ${s.corruptLedgerLines} corrupt ledger line(s) skipped`);", "  if (s.corruptLedgerLines) out.push(`  ${s.corruptLedgerLines} corrupt ledger line(s) skipped: ${JSON.stringify(s)}`);"],
  ['R13 the reason text is kept in the summary', "const i = turns.push({ verdict: o.verdict }) - 1;", "const i = turns.push({ verdict: o.verdict }) - 1; s.lastReason = o.reason;"],
  ['R14 a missing jev.log reads as zero failures', "    out.push('  refused / failed: no jev.log (nothing has been logged here, or the log is elsewhere)');", "    out.push('  refused / failed (jev.log): none');"],
  ['R15 the CLI ignores config.load and uses a fixed dir', "const s = summarize({ ledgerDir: cfg.ledgerDir, labelsPath });", "const s = summarize({ ledgerDir: path.join(os.tmpdir(), 'jev'), labelsPath });"],
  ['R16 a bad config is swallowed', "    process.stderr.write(`${e.message}\\n`);\n    return 2;", "    cfg = { ledgerDir: os.tmpdir() };"],
  ['R17 "caught" wording', "worth a second look, not a verdict on the turn", "Jev caught drift in these turns"],
];
const control = run(src);
console.log('control fails:', control.hung ? 'HUNG' : [...control.failed].join(' | ') || 'none');
let applied = 0, caught = 0;
for (const [name, a0, b0] of M) {
  const a = a0.replace(/\n/g, EOL), b = b0.replace(/\n/g, EOL);
  const n = src.split(a).length - 1;
  if (n !== 1) { console.log(`${name}: NOT APPLIED (matches ${n})`); continue; }
  applied++;
  const r = run(src.replace(a, b));
  const extra = [...r.failed].filter((x) => !control.failed.has(x));
  const hit = r.hung || extra.length > 0;
  if (hit) caught++;
  console.log(`${name}: applied, ${hit ? (r.hung ? 'CAUGHT (hung)' : 'CAUGHT') : 'SURVIVED'}${extra.length ? ' — ' + extra[0].slice(0, 60) : ''}`);
}
console.log(`applied ${applied}/${M.length}, caught ${caught}/${applied}, NOT APPLIED ${M.length - applied}`);
