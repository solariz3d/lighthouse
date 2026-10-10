// D143 mutants for consonance/ui/pane-reopen.test.js, each on a COPY of term.js.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const UI = 'C:/Users/nname/Desktop/lighthouse/consonance/ui';
const LIVE = UI + '/term.js';
const before = fs.readFileSync(LIVE, 'utf8');
const M = [
  ['J1 the terminal is not reset', '  p.term.reset();\n  p.sentRows = undefined;', '  p.sentRows = undefined;'],
  ['J2 the last-sent size is not cleared (the garble)', '  p.sentRows = undefined;\n  p.sentCols = undefined;\n}', '}'],
  ['J3 ↻ does not reset (the old remove-dead lines)', '  if (!p) return;\n  resetForReopen(p);\n  try {', "  if (!p) return;\n  p.el.classList.remove('dead');\n  try {"],
  ['J4 the automatic reopen does not reset', "    setSeatWake(p.role, 'reopening');\n    resetForReopen(p);", "    setSeatWake(p.role, 'reopening');"],
  ['J5 the automatic reopen never sends the size', "  setSeatWake(p.role, 'awake');\n  setTimeout(() => fitPane(id), 80);\n}", "  setSeatWake(p.role, 'awake');\n}"],
  ['J6 an exited seat reads awake', "  setSeatWake(p.role, 'exited');\n  if (payload.action === 'reopen_failed')", "  setSeatWake(p.role, 'awake');\n  if (payload.action === 'reopen_failed')"],
  ['J7 a failed automatic reopen is not marked dead', '    markDead(payload.pane);\n  }', '  }'],
  ['J8 ↻ sets the seat awake before it knows the reopen worked', "  resetForReopen(p);\n  try {", "  resetForReopen(p);\n  setSeatWake(p.role, 'awake');\n  try {"],
  ['J9 a failed ↻ is not marked dead', "    setStatus('reopen failed: ' + e);\n    markDead(id);", "    setStatus('reopen failed: ' + e);"],
];
const t = { applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, from, to] of M) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'd143j-'));
  fs.copyFileSync(UI + '/pane-reopen.test.js', path.join(root, 'pane-reopen.test.js'));
  const src = before.replace(/\r\n/g, '\n');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); continue; }
  fs.writeFileSync(path.join(root, 'term.js'), src.replace(from, to)); t.applied++;
  const r = spawnSync(process.execPath, [path.join(root, 'pane-reopen.test.js')], { encoding: 'utf8' });
  const m = /(\d+) passed, (\d+) failed/.exec(r.stdout || '');
  if (!m) { t.nr.push(name); console.log('NO RESULT', name, (r.stderr || '').slice(-200)); continue; }
  if (+m[2] > 0) { t.caught++; console.log('caught  ', name, `(${m[2]} red)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
}
console.log(`${M.length} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live file ${fs.readFileSync(LIVE, 'utf8') === before ? 'unchanged' : 'CHANGED'}`);
