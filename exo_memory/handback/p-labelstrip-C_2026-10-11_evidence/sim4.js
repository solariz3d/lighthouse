// V4: the lossless leading-label strip, a JS mirror of what goes into main.rs.
// A leading label is stripped (only when the title is over the cap) when it ends at a separator
// (a token ending in ':' or a standalone em/en dash or middle dot), holds at least one ledger id,
// and every word in it is a ledger id, a qualifier (packet/part/item/step/pane/lap) with a short
// argument, or a word the path already shows. Anything else stops the label and nothing is stripped.
// usage: node sim4.js [dump] [--sample]
const fs = require('fs');
const CAP = 40;
const full = new Map(fs.readFileSync(__dirname + '/titles.tsv', 'utf8').split('\n').filter(Boolean).map((l) => {
  const i = l.indexOf('\t'); return [l.slice(0, i), l.slice(i + 1)];
}));
const dump = process.argv.find((a) => a.endsWith('.md')) || 'G:/consonance-scratch/c-d296/new2/librarian.strict.md';
const tier = fs.readFileSync(dump, 'utf8').split('\n')
  .filter((l) => /^- (map|journal|loop|handback)\//.test(l)).map((l) => l.slice(2).split('  (')[0]);
function cut(h) {
  if (!h) return '(no title)';
  const c = [...h]; if (c.length <= CAP) return h;
  const s = c.slice(0, CAP).join(''); const i = s.lastIndexOf(' ');
  let k = i > 0 ? s.slice(0, i) : s; k = k.replace(/[\s,;:\-\u2014\u2013]+$/u, '');
  return k + ' ...';
}
const LEDGER = /^(?:[A-Z]{1,2}\d{1,4}[a-z]?|P-[A-Z0-9]+(?:-[A-Z0-9]+)*)$/;
const QUAL = new Set(['packet', 'part', 'item', 'step', 'pane', 'lap', 'Lap']);
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
function strip(path, head) {
  if ([...head].length <= CAP) return head;
  const pt = path.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const covered = (w) => { const n = norm(w); return n.length > 0 && pt.some((t) => t === n || (t.length >= 4 && n.startsWith(t))); };
  const toks = head.split(' ');
  let ledger = false, i = 0;
  while (i < toks.length) {
    const t = toks[i];
    if (t === '\u2014' || t === '\u2013' || t === '\u00b7') {
      if (!ledger || i === 0) return head;
      const rest = toks.slice(i + 1).join(' ').trim(); return rest ? rest : head;
    }
    const core = t.replace(/^\(+/, '').replace(/[,:)]+$/, '');
    if (LEDGER.test(core)) { ledger = true; i++; }
    else if (QUAL.has(core) && i + 1 < toks.length && /^[A-Za-z0-9]{1,3}$/.test(toks[i + 1].replace(/[,:)]+$/, ''))) { i += 2; }
    else if (covered(core)) { i++; }
    else return head;
    const last = toks[i - 1];
    if (last.endsWith(':')) {
      if (!ledger) return head;
      const rest = toks.slice(i).join(' ').trim(); return rest ? rest : head;
    }
  }
  return head;
}
module.exports = { strip, cut };
if (require.main === module) {
  const SAMPLE = ['loop/readme_draft_notes_2026-09-25.md','loop/compaction_corrections_2026-10-05/PREREG.md','loop/plan_t180_sharp_turns_2026-10-09.md','loop/rule_census_score_2026-10-02.md','map/M-2026-08-24.md','journal/2026-08-03.md','loop/plan_fix_and_list_loop_2026-09-24.md','loop/q3_read_Jev_2026-09-27.md','loop/plan_clean_up_after_ourselves_2026-10-10.md','handback/p-d195-B_2026-09-30.md','handback/p-consumer-coldread3-LIB_2026-10-09.md','loop/qs2s_units_v2_2026-10-03.md','loop/plan_two_lane_suite_2026-10-03.md','loop/plan_consumer_drift_awareness_2026-10-09.md','loop/plan_label_watch_second_read_2026-10-02.md','loop/q3_units_2026-09-27.md','loop/echo_variable_idea_2026-09-26.md','loop/battery_run2_sealed_rows_2026-09-25.md','loop/plan_finish_retrieval_2026-10-03.md','loop/plan_consumer_refresh_2026-10-08.md','loop/design_speed_measure_2026-10-06.md','handback/p-indicator-loop-chain-ui_2026-09-01.md','loop/plan_t180_equation_only_pieces_2026-10-04.md','loop/plan_loop_friction_2026-10-09.md','handback/p-d167-blend-C_2026-09-27.md','loop/cross_section_seal_registration_2026-10-03.md','handback/p-d177-rigid-C_2026-09-27.md','loop/plan_digest_repair_parts_d292_2026-10-11.md','loop/plan_t180_back_on_track_2026-09-28.md','map/M.md'];
  const set = process.argv.includes('--sample') ? SAMPLE : tier;
  let n = 0; const rows = [];
  set.forEach((p, k) => {
    const h = full.get(p); if (h === undefined) { rows.push('MISSING ' + p); return; }
    const s = strip(p, h);
    if (s !== h) n++;
    if (s !== h || process.argv.includes('--sample')) rows.push(`${process.argv.includes('--sample') ? '#' + (k + 1) + ' ' : ''}${s !== h ? 'S' : ' '} ${p}\n    old: ${cut(h)}\n    new: ${cut(s)}${s !== h ? '   [stripped: ' + JSON.stringify(h.slice(0, h.length - s.length)) + ']' : ''}`);
  });
  console.log(rows.join('\n'));
  console.log(`V4: ${set.length} entries, stripped ${n}`);
}
