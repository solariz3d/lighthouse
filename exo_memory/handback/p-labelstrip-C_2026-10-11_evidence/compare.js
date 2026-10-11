// D297: base3 vs new3 strict librarian dumps, read-only.
//   node compare.js <base strict> <new strict> <titles.tsv> > compare.out
// 1. the carried-in-full sets; 2. every index line whose title changed (old/new, the stripped prefix);
// 3. B's fixed 30-entry sample (by path), old and new shown titles; 4. T5 mechanics over every index
// line of new; 5. a T6-style loss check, independent of main.rs: every word of each stripped prefix
// that is 3+ letters must be a ledger id or appear in the path (B's §3 rule, prefix-4 included).
const fs = require('fs');
const [BASE, NEW, TSV] = process.argv.slice(2);
const full = new Map(fs.readFileSync(TSV, 'utf8').split('\n').filter(Boolean).map((l) => { const i = l.indexOf('\t'); return [l.slice(0, i), l.slice(i + 1)]; }));
const idx = (f) => new Map(fs.readFileSync(f, 'utf8').split('\n').filter((l) => /^- [^ ]+\.md  \(\d+ lines\)  /.test(l))
  .map((l) => { const m = l.match(/^- ([^ ]+\.md)  \((\d+) lines\)  (.*)$/); return [m[1], m[3]]; }));
const carried = (f) => fs.readFileSync(f, 'utf8').split('\n').filter((l) => /^## /.test(l)).map((l) => l.slice(3));
const b = idx(BASE), n = idx(NEW);
const out = [];
out.push(`index lines: base ${b.size}, new ${n.size}; only in base ${[...b.keys()].filter((k) => !n.has(k)).length}, only in new ${[...n.keys()].filter((k) => !b.has(k)).join(', ') || 'none'}`);
const ch = [...n].filter(([p, t]) => b.has(p) && b.get(p) !== t);
out.push(`titles changed: ${ch.length}`);
const LEDGER = /^(?:[A-Z]{1,2}\d{1,4}[a-z]?|P-[A-Z0-9]+(?:-[A-Z0-9]+)*)$/;
let viol = 0; const vrows = [];
for (const [p, t] of ch) {
  const h = full.get(p) || '';
  const start = t.replace(/ \.\.\.$/, '');
  const k = h.indexOf(start);
  const pref = k >= 0 ? h.slice(0, k) : '(shown title not found in heading)';
  const pt = p.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const bad = pref.split(/\s+/).map((w) => w.replace(/^\(+/, '').replace(/[,:)]+$/, '')).filter((w) => /[A-Za-z].*[A-Za-z].*[A-Za-z]/.test(w))
    .filter((w) => !LEDGER.test(w) && !['packet', 'part', 'item', 'step', 'pane', 'lap', 'Lap'].includes(w))
    .filter((w) => { const x = w.toLowerCase().replace(/[^a-z0-9]/g, ''); return !pt.some((s) => s === x || (s.length >= 4 && x.startsWith(s))); });
  if (bad.length || k < 0) { viol++; vrows.push(`  VIOLATION ${p}: ${JSON.stringify(bad)}`); }
  out.push(`  ${p}\n    old: ${b.get(p)}\n    new: ${t}\n    stripped: ${JSON.stringify(pref)}`);
}
out.push(`T6-style loss check over all ${ch.length} changed: ${viol} violation(s)`, ...vrows);
const cut = [...n.values()].filter((t) => t.endsWith(' ...'));
out.push(`T5 over ${n.size} new index lines: cut ${cut.length}; cut over 40 chars ${cut.filter((t) => [...t.slice(0, -4)].length > 40).length}; cut ending in punctuation/space ${cut.filter((t) => /[\s,;:\-—–]$/u.test(t.slice(0, -4))).length}; (no title) ${[...n.values()].filter((t) => t === '(no title)').length}; (no title) whose file has a heading ${[...n].filter(([p, t]) => t === '(no title)' && full.get(p)).length}`);
const cb = carried(BASE), cn = carried(NEW);
out.push(`carried in full: base ${cb.length}, new ${cn.length}; only base ${JSON.stringify(cb.filter((x) => !cn.includes(x)))}; only new ${JSON.stringify(cn.filter((x) => !cb.includes(x)))}`);
const SAMPLE = ['loop/readme_draft_notes_2026-09-25.md','loop/compaction_corrections_2026-10-05/PREREG.md','loop/plan_t180_sharp_turns_2026-10-09.md','loop/rule_census_score_2026-10-02.md','map/M-2026-08-24.md','journal/2026-08-03.md','loop/plan_fix_and_list_loop_2026-09-24.md','loop/q3_read_Jev_2026-09-27.md','loop/plan_clean_up_after_ourselves_2026-10-10.md','handback/p-d195-B_2026-09-30.md','handback/p-consumer-coldread3-LIB_2026-10-09.md','loop/qs2s_units_v2_2026-10-03.md','loop/plan_two_lane_suite_2026-10-03.md','loop/plan_consumer_drift_awareness_2026-10-09.md','loop/plan_label_watch_second_read_2026-10-02.md','loop/q3_units_2026-09-27.md','loop/echo_variable_idea_2026-09-26.md','loop/battery_run2_sealed_rows_2026-09-25.md','loop/plan_finish_retrieval_2026-10-03.md','loop/plan_consumer_refresh_2026-10-08.md','loop/design_speed_measure_2026-10-06.md','handback/p-indicator-loop-chain-ui_2026-09-01.md','loop/plan_t180_equation_only_pieces_2026-10-04.md','loop/plan_loop_friction_2026-10-09.md','handback/p-d167-blend-C_2026-09-27.md','loop/cross_section_seal_registration_2026-10-03.md','handback/p-d177-rigid-C_2026-09-27.md','loop/plan_digest_repair_parts_d292_2026-10-11.md','loop/plan_t180_back_on_track_2026-09-28.md','map/M.md'];
out.push('B\'s fixed sample (seed 2961, by path): * = title changed');
SAMPLE.forEach((p, i) => out.push(`  #${i + 1}${b.get(p) !== n.get(p) ? ' *' : '  '} ${p}\n      old: ${b.has(p) ? b.get(p) : '(NOT LISTED)'}\n      new: ${n.has(p) ? n.get(p) : '(NOT LISTED)'}`));
out.push(`sample titles changed: ${SAMPLE.filter((p) => b.get(p) !== n.get(p)).length}; sample entries not listed in new: ${SAMPLE.filter((p) => !n.has(p)).length}`);
console.log(out.join('\n'));
