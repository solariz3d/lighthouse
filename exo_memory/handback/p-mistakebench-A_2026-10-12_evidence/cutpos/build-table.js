#!/usr/bin/env node
'use strict';
// build-table.js (seat A, D311 cut-position diagnostic): joins the machine fields (machine.json: cut event and step counts), my manual claim readings (claims-manual.json),
// the origin-in-context check (origin-in-context.json), the shelf survey (shelf-in-transcript.json) and C's per-run REPEATS counts (live-status.json) into
// cut-position-table.json and cut-position-table.md. No model call.   node build-table.js
const fs = require('fs');
const path = require('path');
const j = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
const machine = j('machine.json'), claims = j('claims-manual.json'), origin = j('origin-in-context.json'), shelf = j('shelf-in-transcript.json'), live = j('live-status.json');
const SEVEN = ['W006', 'W021', 'W053', 'W054', 'W056', 'W079', 'W080'];
// where the check's marker could not be trusted or the reader emptied the event, said by hand
const ORIGIN_NOTE = {
  W006: 'IN the transcript, EMPTY in the replay: the keeper\'s pasted account is a `queued_command` attachment (1,985 chars) and the bench reader drops that attachment type',
  W049: 'the opening ring is Third Place redacted in the transcript copy; the replay shows removed lines (the marker check cannot see it)',
  W080: 'C\'s hand-back (event 11449, four hours before) was not found in the replay; its marker may have been lost to Third Place redaction, so unproven. Steps 1-4 of the turn are all Third Place redacted calls',
  W056: 'C\'s hand-back (result 1791): kept about 2,494 of 12,968 chars',
  W079: 'the other pane\'s hand-back (result 11976): kept about 593 of 17,833 chars',
  W084: 'the desktop librarian\'s note (result 13092): kept about 593 of 6,544 chars; the words that matter start at offset 4,326, in the cut-off part',
  W034: 'the grep of FINDINGS (result 58287, previous turn, 12 h before) is NOT in the replay: 865 of 1,012 history events were cut from the front',
  W022: 'the previous turn\'s ring (event 49206): kept about 193 of 2,257 chars',
  W053: 'the index sits in the shell loaded at session start (an `instructions` attachment); the replay carries no shell',
  W054: 'the inputs (results 479, 715) are whole in the replay; what is missing is the shell and the packer run the seat never made',
  W058: 'the grep call (1260) is cut to about 994 of 1,675 chars; its result (1261) is whole; the claim call itself is Third Place redacted',
  W092: 'the lock-file call (15862) is cut to about 993 of 1,309 chars; its result (15863) is whole',
};
function originCell(id) {
  if (ORIGIN_NOTE[id]) return ORIGIN_NOTE[id];
  const o = origin.find((x) => x.id === id);
  const c = (o.candidates || []).filter((x) => /whole|CUT|NOT|not in/.test(x.status))[0];
  if (!c) return 'at or after the cut (the claim itself)';
  return `${c.kind.toLowerCase()} ${c.n}: ${c.status}${c.detail ? '; ' + c.detail : ''}`;
}
const rows = machine.map((m) => {
  const c = claims[m.id], l = live[m.id], s = shelf[m.id];
  return {
    id: m.id, seat: m.seat, repeatsRun1: l.run1, repeatsRun2: l.run2,
    cut: { line: m.cutN, step: m.cutStepIdx, ofSteps: m.turnSteps, turnPromptLine: m.promptN },
    claim: { line: c.claimLine, step: c.claimStep, medium: c.medium, offset: c.offset },
    stepsBetween: c.between,
    dependedOn: c.dependedOn, originInReplay: originCell(m.id),
    shellInTranscript: s.instructions ? `yes, ${s.instructions.files.filter((f) => /CLAUDE\.md$/.test(f.p) && !/^\.?claude/i.test(f.p)).map((f) => f.len).sort((a, b) => b - a)[0]} chars (instructions attachment, line ${s.instructions.line})` : 'no instructions attachment before the turn',
    systemPromptSnapshot: s.systemPrompt ? `${s.systemPrompt.chars} chars (line ${s.systemPrompt.line})` : 'none',
  };
});
const order = [...SEVEN, ...rows.filter((r) => !SEVEN.includes(r.id)).sort((a, b) => (b.repeatsRun1 + b.repeatsRun2) - (a.repeatsRun1 + a.repeatsRun2)).map((r) => r.id)];
const sorted = order.map((id) => rows.find((r) => r.id === id));
const sgn = (n) => (n === 0 ? '0 (same step)' : n > 0 ? `+${n} (claim AFTER the cut)` : `${n} (claim BEFORE the cut, in the replay)`);
const md = ['# Cut-position diagnostic (seat A, D311, 2026-10-12): 22 dev units, no model call', '',
  'cut = the bench\'s stop event (the first assistant item in the located claim second; everything before it in the turn is replayed). claim = where the seat first wrote or said W in the turn (my reading, `claims-manual.json`). REPEATS = C\'s count of 5 in each run.', '',
  '| unit | REPEATS run 1 / run 2 | cut (line, step) | claim (line, step, medium) | steps between | what W rested on, and its state in the replay |', '|---|---|---|---|---|---|'];
for (const r of sorted) md.push(`| ${r.id}${SEVEN.includes(r.id) ? ' *' : ''} | ${r.repeatsRun1}/5 · ${r.repeatsRun2}/5 | ${r.cut.line}, step ${r.cut.step} of ${r.cut.ofSteps} | ${r.claim.line}, step ${r.claim.step}, ${r.claim.medium} (offset ${r.claim.offset}) | ${sgn(r.stepsBetween)} | ${r.dependedOn}. ${r.originInReplay} |`);
md.push('', '* = one of the seven C and the chair named (never touch W in either run).');
fs.writeFileSync(path.join(__dirname, 'cut-position-table.json'), JSON.stringify(sorted, null, 1) + '\n');
fs.writeFileSync(path.join(__dirname, 'cut-position-table.md'), md.join('\n') + '\n');
const sha = require('crypto').createHash('sha256').update(fs.readFileSync(path.join(__dirname, 'cut-position-table.json'))).digest('hex');
const by = { zero: sorted.filter((r) => r.stepsBetween === 0).length, after: sorted.filter((r) => r.stepsBetween > 0).map((r) => r.id), before: sorted.filter((r) => r.stepsBetween < 0).map((r) => r.id) };
console.log('rows', sorted.length, 'steps between = 0:', by.zero, '| claim after the cut:', by.after.join(','), '| claim before the cut:', by.before.join(','));
console.log('seven: steps between', SEVEN.map((id) => id + '=' + claims[id].between).join(' '));
console.log('shelf (instructions attachment) before the turn for', sorted.filter((r) => !/^no /.test(r.shellInTranscript)).length, 'of 22; table json sha256', sha);
