// Copies the keeper's picks from the decision page's store into the game brief, as item 183.
// The librarian's instrument (L, 2026-11-13). It rewrites item 183 whole each time, from the store, so the brief
// always equals what he has picked.
//
// Use:
//   1. Read the store: ArtifactData, action "list", collection "answers", url of the decision page,
//      with out_dir set to some folder. The files land in <out_dir>/answers/<call id>.json.
//   2. node exo_memory/loop/his_calls_to_brief_2026-11-13.js <out_dir>/answers "<read time, e.g. 10:10Z>"
// It prints what it wrote. It changes one file: exo_memory/briefs/dreamzone2_the_game.md.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CALLS = path.join(ROOT, 'loop', 'his_calls_2026-11-13.json');
const BRIEF = path.join(ROOT, 'briefs', 'dreamzone2_the_game.md');
const PAGE = 'https://claude.ai/artifact/Cu4oEJHEmeeQyW9jpVGPU1';
// Values he picked and then changed. The store keeps only the last one, so the earlier ones are kept here.
const SUPERSEDED = [{ id: 'run_frame-1', was: 'Show nothing', at: '09:59:34Z' }];

const dir = process.argv[2];
const readAt = process.argv[3];
if (!dir || !readAt) { console.error('usage: node his_calls_to_brief_2026-11-13.js <store answers dir> "<read time>"'); process.exit(2); }
if (!fs.existsSync(dir)) { console.error('no such folder: ' + dir); process.exit(2); }

const j = JSON.parse(fs.readFileSync(CALLS, 'utf8'));
const rows = fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => {
  const o = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const d = o.data || o;
  return { id: f.replace(/\.json$/, ''), choice: d.choice == null ? null : d.choice, label: d.label || '', note: (d.note || '').trim(), at: String(d.at || '') };
}).filter(r => r.choice != null || r.note);
rows.sort((a, b) => a.at.localeCompare(b.at));

const byAt = {};
rows.forEach(r => { (byAt[r.at] = byAt[r.at] || []).push(r); });
const hhmmss = at => at.slice(11, 19) + 'Z';
const unknown = [];
const lines = [];
for (const r of rows) {
  const c = j.open.find(x => x.id === r.id);
  if (!c) { unknown.push(r.id); continue; }
  const opt = r.choice != null ? c.options[r.choice] : null;
  if (r.choice != null && !opt) { unknown.push(r.id + ' (choice ' + r.choice + ' is not an option)'); continue; }
  let tag = '';
  if (opt && c.recommended === r.choice) tag = byAt[r.at].length >= 3 ? ' (the page\'s suggestion, taken with its take-every-suggestion button)' : ' (the page\'s suggestion)';
  else if (opt && c.recommended != null) tag = ' (NOT the page\'s suggestion, which was "' + c.options[c.recommended].label + '")';
  const pick = opt ? '**"' + opt.label + '"**' + tag : '**no option picked; his own answer below**';
  lines.push('     - `' + r.id + '` "' + c.title + '": ' + pick + ' (' + hhmmss(r.at) + ').');
  if (opt && opt.detail) lines.push('       - the option as he read it: ' + opt.detail);
  if (r.note) lines.push('       - his note, verbatim: ' + r.note.replace(/\s*\n\s*/g, ' '));
}
const nowIds = j.open.filter(c => c.when === 'now').map(c => c.id);
const nowDone = nowIds.filter(id => rows.some(r => r.id === id)).length;
const head = [
  '183. 2026-11-13 03:5x on, his picks on the decision page (' + PAGE + ', private to him; built from `loop/his_calls_2026-11-13.json`). Each pick is saved in the page\'s store as `answers/<call id>`. This item is rewritten whole from the store each time it is read (`loop/his_calls_to_brief_2026-11-13.js`):',
  '     - **Last read: ' + readAt + ', ' + rows.length + ' picks.** Of the ' + nowIds.length + ' calls marked "needed now", ' + nowDone + ' are answered. ' + j.open.length + ' calls are on the page.'
];
for (const s of SUPERSEDED) if (rows.some(r => r.id === s.id)) head.push('     - **Changed by him:** `' + s.id + '` was "' + s.was + '" at ' + s.at + ' before the pick listed below.');
const block = head.concat(lines).join('\n') + '\n';

const text = fs.readFileSync(BRIEF, 'utf8');
const all = text.split('\n');
const start = all.findIndex(l => /^183\. /.test(l));
let out;
if (start < 0) out = text.replace(/\n*$/, '\n') + block;
else {
  let end = all.length;
  for (let i = start + 1; i < all.length; i++) if (/^\d+\. /.test(all[i])) { end = i; break; }
  out = all.slice(0, start).join('\n') + '\n' + block + (end < all.length ? all.slice(end).join('\n') : '');
}
fs.writeFileSync(BRIEF, out);
console.log('item 183 written: ' + rows.length + ' picks, needed-now ' + nowDone + ' of ' + nowIds.length + (unknown.length ? '; NOT WRITTEN (unknown): ' + unknown.join(', ') : ''));
