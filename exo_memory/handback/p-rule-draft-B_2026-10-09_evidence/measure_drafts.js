// measure_drafts.js (pane B, D277 part 3): before -> after for each draft, with C's OWN classifier and capitals rule, lifted verbatim from
// exo_memory/loop/instruction_load_census_2026-10-09.census.js at run time (the VERBS ... measure() span), so both columns use one instrument.
//   node measure_drafts.js <lighthouse checkout holding the originals> <draft folder>
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const [LH, DRAFTS] = process.argv.slice(2);
const src = fs.readFileSync(path.join('C:/Users/nname/Desktop/lighthouse/exo_memory/loop/instruction_load_census_2026-10-09.census.js'), 'utf8');
const a = src.indexOf('const VERBS'), b = src.indexOf('const texts = [];');
if (a < 0 || b < 0) throw new Error('census.js changed shape: cannot lift its classifier');
const measure = new Function('fs', 'path', 'os', src.slice(a, b) + '\nreturn measure;')(fs, path, os);
const bold = (t) => (t.match(/\*\*[^*\n]+\*\*/g) || []).length;
const PAIRS = [
  ['global ~/.claude/CLAUDE.md', path.join(os.homedir(), '.claude', 'CLAUDE.md'), 'CLAUDE.global.draft.md'],
  ['project lighthouse/CLAUDE.md', path.join(LH, 'CLAUDE.md'), 'CLAUDE.project.draft.md'],
  ['brief/COMMITTEE.md', path.join(LH, 'consonance/src-tauri/brief/COMMITTEE.md'), 'COMMITTEE.draft.md'],
  ['brief/BUILDING.md', path.join(LH, 'consonance/src-tauri/brief/BUILDING.md'), 'BUILDING.draft.md'],
  ['brief/LIBRARIAN.md', path.join(LH, 'consonance/src-tauri/brief/LIBRARIAN.md'), 'LIBRARIAN.draft.md'],
];
const rows = [], tot = { b: {}, a: {} };
const keys = ['bytes', 'nonEmpty', 'ruleBlocks', 'prohib', 'positive', 'noWhy', 'capsKeys', 'capsEmph', 'bold'];
for (const [label, orig, draft] of PAIRS) {
  const df = path.join(DRAFTS, draft);
  if (!fs.existsSync(df)) { rows.push(label + '\tMISSING ' + draft); continue; }
  const one = (t) => { const m = measure(label, t, false); return { bytes: m.bytes, nonEmpty: m.nonEmpty, ruleBlocks: m.ruleBlocks || 0, prohib: m.prohib, positive: m.positive, noWhy: m.noWhy, capsKeys: Object.values(m.caps).reduce((x, y) => x + y, 0), capsEmph: m.capsEmph, bold: bold(t) }; };
  const B = one(fs.readFileSync(orig, 'utf8')), A = one(fs.readFileSync(df, 'utf8'));
  for (const k of keys) { tot.b[k] = (tot.b[k] || 0) + B[k]; tot.a[k] = (tot.a[k] || 0) + A[k]; }
  rows.push([label, ...keys.map((k) => B[k] + ' -> ' + A[k])].join('\t'));
}
rows.push(['TOTAL', ...keys.map((k) => tot.b[k] + ' -> ' + tot.a[k])].join('\t'));
console.log(['file', 'bytes', 'non-empty lines', 'RULE blocks (imperatives)', 'prohibition blocks', 'positive blocks', 'no-why blocks', 'MUST/NEVER/ALWAYS/CRITICAL/IMPORTANT/REFUSE*/DO NOT', 'ALL-CAPS emphasis', 'bold spans'].join('\t'));
console.log(rows.join('\n'));
