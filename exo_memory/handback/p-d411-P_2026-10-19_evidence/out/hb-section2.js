const fs = require('fs'), path = require('path');
const E = 'C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d411-P_2026-10-19_evidence';
const H = 'C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d411-ponytail-proof-P_2026-10-19.md';
const rows = [], changed = { R: [], N: [] };
for (const l of ['L1', 'L2', 'L3', 'L4', 'L5']) for (const a of ['R', 'N']) {
  const j = JSON.parse(fs.readFileSync(path.join(E, 'out', `${l}-${a}.json`), 'utf8'));
  const m = JSON.parse(fs.readFileSync(path.join(E, 'out', `${l}-${a}.measure.json`), 'utf8'));
  const u = j.usage || {};
  const min = (ms) => (ms / 60000).toFixed(1);
  changed[a].push(m.changed_lines);
  rows.push(`| ${l} | ${a} | ${j.started.slice(11, 19)}Z | ${min(j.wall_ms)} | ${j.active_ms != null ? min(j.active_ms) : '–'} | ${j.others_hold_lock_ms != null ? min(j.others_hold_lock_ms) : '–'} | ${j.num_turns} | ${j.exit_code} ${j.subtype}${j.launcher_killed ? ' (launcher killed)' : ''} | ${j.stop_reason} / ${j.terminal_reason} | ${u.input_tokens} / ${u.output_tokens} / ${u.cache_read_input_tokens} / ${u.cache_creation_input_tokens} | ${m.commits.split(' ')[0]} | ${m.files.length} | +${m.added} −${m.removed} | ${m.changed_lines} | ${m.rows_added} / ${m.rows_deleted} / ${m.rows_rewritten} |`);
}
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[(s.length - 1) / 2]; };
const sec = `## 2. Builders (the 10 sessions)

All ten: exit 0, \`subtype: success\`, \`stop_reason: end_turn\`, one commit on top of the launcher's mute commit, nothing
uncommitted but \`HANDBACK.md\`, a hand-back written. Wall is the session's start to exit; active and others are the launcher's
30-second poll of the lock dir (active = no other seat's lock live; others = some other seat's lock live), which exists only
for sessions started after the L2-R re-run (§1, "Launcher changes after attempt 1"); for the first three the cap counted wall.
Usage is the four \`usage\` fields of the CLI's JSON (input / output / cache read / cache creation), as reported, not derived.
Changed = added + removed lines of \`git diff <mute commit> HEAD\`; rows = test rows added / deleted / rewritten by the
\`^[+-]\\s*(test|it)\\s*\\(\` rule over the test files in the diff (\`run.js\` \`rowsIn\`).

| lap | arm | started | wall min | active min | others min | turns | exit | stop / terminal | usage in / out / cr / cc | commit | files | +/− | changed | rows + / − / ~ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
${rows.join('\n')}

Source: \`out/<lap>-<arm>.json\` (the session record), \`out/<lap>-<arm>.measure.json\`; reproduce the table with
\`node -e\` over those files (the script is \`scratchpad/hb-section2.js\`, copied to \`out/hb-section2.js\`). Changed-line
medians, R ${median(changed.R)} (${changed.R.join(', ')}) and N ${median(changed.N)} (${changed.N.join(', ')}); the Registration's
first clause is the librarian's to read against them. L2-R is the re-run (attempt 1 killed by the launcher, §1); L2-N ran at
14:39Z in the first attempt's pair. Test rows deleted or rewritten: 0 in every arm (the rule above; a reader should still
read the test hunks in \`out/<label>.diff\`, since the rule sees only \`test(\`/\`it(\` lines).
`;
let s = fs.readFileSync(H, 'utf8');
const a = '## 2. Builders (filled when the 10 sessions are in)\n';
if (!s.includes(a)) throw new Error('§2 placeholder missing');
s = s.replace(a, sec);
fs.writeFileSync(H, s);
fs.copyFileSync(__filename, path.join(E, 'out', 'hb-section2.js'));
console.log('§2 written; medians R', median(changed.R), 'N', median(changed.N));
