const fs = require('fs'), path = require('path');
const { spawnSync } = require('child_process');
const E = 'C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d411-P_2026-10-19_evidence';
const H = 'C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d411-ponytail-proof-P_2026-10-19.md';
const sh = (cmd) => { const r = spawnSync(cmd, { shell: true, encoding: 'utf8' }); return (r.stdout || '').trim(); };
const out = (n) => path.join(E, 'out', n);
const min = (ms) => (ms / 60000).toFixed(1);

// §3
const table = fs.readFileSync(out('table.md'), 'utf8').trim();
const sec3 = `## 3. The launcher's table (\`node run.js table\` → \`out/table.md\`, 04:5x Z)

Base per arm = the launcher's mute commit on the lap's base (§1, "Mute"); diff = \`git diff <that> HEAD\` in the arm's
worktree. "Test files whole" = every \`*.test.js\` in the diff, run whole in the arm's tree under the lock; "harnesses" = every
mutation file naming a touched source file by basename (\`git grep -l -F <basename> HEAD -- "test/*mutation*.test.js"
"app/test/*mutation*.test.js"\`, lighthouse \`"consonance/tools/*.mutants.js"\`), run whole. Session wall is the builder session.
Counts re-parsed from the saved output (§0, 01:2x Z and 03:2x Z); L5's \`gen-consumer\` red is the extract's (§0, 01:3x Z).

${table}

Read with §2 (active/others minutes, usage, commit shas) and §0 03:2x Z (the one harness red, KE2-6 under L3-N, a stale
mutant anchor, not a failing test).
`;

// §4
const laps = ['L1', 'L2', 'L3', 'L4', 'L5'];
const verdictLine = (l) => {
  const v = fs.readFileSync(out(`review-${l}-VERDICT.md`), 'utf8');
  const m = /^#{1,3}\s*(?:Verdict|Which to land)[^\n]*\n+\**([^\n]+)/im.exec(v) || /\*\*Land ([XY])\.\*\*/.exec(v);
  return m ? m[1].replace(/\*\*/g, '').trim() : '(see file)';
};
const revRows = laps.map((l) => {
  const j = JSON.parse(fs.readFileSync(out(`review-${l}.json`), 'utf8'));
  const u = j.usage || {};
  return `| ${l} | ${j.started.slice(11, 19)}Z | ${min(j.wall_ms)} | ${j.active_ms != null ? min(j.active_ms) : '–'} | ${j.others_hold_lock_ms != null ? min(j.others_hold_lock_ms) : '–'} | ${j.num_turns} | ${j.exit_code} ${j.subtype}${j.launcher_killed ? ' (launcher killed)' : ''} | ${u.input_tokens} / ${u.output_tokens} / ${u.cache_read_input_tokens} / ${u.cache_creation_input_tokens} | ${verdictLine(l)} |`;
}).join('\n');
const removals = laps.map((l) => `#### ${l}\n\n${fs.readFileSync(out(`review-${l}-removals.md`), 'utf8').trim().split('\n').slice(1).join('\n').trim()}`).join('\n\n');
const sec4 = `## 4. The blind reviews (5 sessions, \`node run.js reviews\`, 03:21Z–04:5x Z, \`out/reviews.log\`)

Each lap: a coin (\`crypto.randomInt(2)\`) appended to \`key.json\` as \`{lap, X, Y, coin}\` (the launcher never reads it back;
I have not opened it); a clean worktree at the lap's base plus the same mute commit (\`p-d411-<lap>-review\`; L5 a fresh
extract); \`review/X.diff\`, \`review/Y.diff\`, the two hand-backs scrubbed, and a copy of the lock wrapper as \`review/hr.js\`
so the prompt names no path outside the tree; one \`claude -p\` session on claude-opus-5-5 with the packet's reviewer prompt
(\`prompts/prompt-<lap>-review.txt\`, which asks for X, Y or neither). The verdict files are copied whole to
\`out/review-<lap>-VERDICT.md\`; read those, not this summary.

| lap | started | wall min | active min | others min | turns | exit | usage in / out / cr / cc | the reviewer's last line, verbatim |
|---|---|---|---|---|---|---|---|---|
${revRows}

The verdict column is the first line under each file's "Verdict" heading, copied by \`out/hb-sections345.js\`; the file is
the master. In X/Y terms the five verdicts read: L1 X, L2 Y, L3 X, L4 X, L5 X (checked: the five \`## Verdict\` headings).
The reviewer rated none "equal" and none "neither".

**The blind, checked after the sessions.** What each reviewer could read: \`grep -il "ponytail|working rule|lazy senior|
d411-L<k>-[RN]|p-d411-L<k>-[RN]" prompts/prompt-L*-review.txt scrub/*.md\` → no file; the ten scrubbed hand-backs in the
review trees carry 0 arm words each (\`grep -ci\` per file). The five review transcripts
(\`~/.claude/projects/C--Users-nname-Desktop-worktrees-p-d411-<lap>-review/*.jsonl\`, one each): 0 lines naming \`key.json\`,
the evidence directory, "ponytail", or any arm worktree. The reviewers' own probe files went to \`review/probe/\` inside
the review tree (L2, L4) or to \`/tmp/p411\` (L3), never into an arm's tree.

**What the scrub removed, every item** (\`out/review-<lap>-removals.md\`, verbatim):

${removals}

**A note on my own blind, owed plainly.** Those removal lines name the replaced token, \`d411-<lap>-<arm>\`, under the X or Y
it came from; so in writing this section, after the reviews, I have seen which arm was X for L1–L4 (L5 had nothing to
remove). The reviewer never saw them (the removals file lives in \`out/\`, not in the review tree). The blind therefore held
where the packet puts it, in the review sessions; it did not hold for the launcher's write-up, which is why this section
states the verdicts as X/Y only and the scoring stays with the librarian and \`key.json\`. If a future run wants the launcher
blind too, the removals file should record the token as \`<arm token>\` and keep the mapping in \`key.json\` alone.

**Two things the reviewer counted that the launcher shaped.** (1) L1: one diff adds \`--mute-audio\` to the test's two
\`launchChrome\` calls, and the reviewer counts it as noise outside the task, since the base (the launcher's mute commit)
already passes the flag. Both arms' prompts carry the same line ("If anything you run would open a browser … pass --headless
and --mute-audio", \`run.js:83\`); one arm acted on it in the file, one did not. (2) L3: the reviewer found the KE2-6 stale
anchor independently of my remeasure (§0, 03:2x Z) and weighed it ("breaks an existing mutation test it never ran").
Both are in the verdict files for the librarian to weigh; I do not score.
`;

// §5
const T180 = 'C:/Users/nname/Desktop/t180-track-builder';
const wtList = sh(`git -C "${T180}" worktree list`).split('\n').filter((l) => /d411/i.test(l));
const brList = sh(`git -C "${T180}" branch --list "d411-*"`).split('\n').map((s) => s.trim()).filter(Boolean);
const sec5 = `## 5. Not done / Limits

- **No full suite in any arm or review tree.** The named test files and the anchoring mutation files were run whole (§3);
  \`npm test\` was not, by any arm, by any reviewer (each says so) or by the launcher. The chair's brief gives scoring to the
  librarian; a landing would still run the suite.
- **L2 and L4 have no mutation harness naming \`turnby.js\` or \`sound.js\`** (checked: the \`git grep\` in §3's rule → none), so
  those laps have the named test file only.
- **L5 red is the extract's**, not an arm's: \`gen-consumer.test.js\` 66/41 at base, R and N alike, same 83 ✖ lines (§0, 01:3x Z).
  The extract has no \`exo_memory\`, no real history; the file tests the real tree. The L5 reviewer did not rerun it and says so.
- **The active/others split** exists only for sessions after the L2-R re-run and records whether ANY other seat's lock was
  live, not how long the arm waited; "others ≈ wall" everywhere (§0, 21:1x Z). The L2-R re-run's 167 min wall is almost all
  lock wait (active 0.0).
- **n = 1 per arm per lap, one model, hindsight tasks, L5 in another repo**: the packet's own limits, unchanged.
- **Reviewer stochasticity**: one review session per lap, no repeat; a second reviewer could land differently. The packet
  asked for five, not ten.
- **The launcher's measure step had five faults** (§0, 01:2x Z and 03:2x Z, Corrections); none touched a session, the saved
  output was re-parsed, and the harnesses ran late (01:2x–03:1x Z) under the lock. \`out/run.js.before-remeasure\` is the
  launcher as it ran the builders and the first measure pass.
- **My blind for the write-up** did not hold for L1–L4 (§4). The reviewers' did.
- **Worktrees on the Desktop clone** (\`run.js:22\`; the chair said never to touch that clone; raised in §1 and still the
  librarian's call): now ${wtList.length} \`d411\` worktree entries (10 arms, 5 review, 1 L5 base is an extract and not a
  worktree; checked: \`git -C ${T180} worktree list | grep -i d411\` → ${wtList.length} lines) and ${brList.length} \`d411-*\`
  branches (\`git branch --list "d411-*"\`). The clone's own working tree is untouched. If the refs must go: the branches
  delete with \`git branch -D\` and the worktrees with \`git worktree remove\` once the librarian has read the trees; the diffs,
  hand-backs, test and harness output, verdicts and session records are all copied under \`out/\` and do not depend on them.
- **The installed builder and \`Desktop\\t180-track-builder\`'s working tree** were never launched or edited (the arms ran
  in worktrees; the review trees too). Browsers: headless, \`--mute-audio\` via the mute commit in every tree.
- **Probes the chair asked for** are in §1 ("probes"); nothing was re-run because a result looked bad; no arm got a second
  prompt; the one re-run (L2-R) is a launcher fault, named (§1, Corrections).
`;

let s = fs.readFileSync(H, 'utf8');
const r3 = '## 3. The launcher\'s table (filled by `node run.js table`)\n';
const r4 = '## 4. The blind reviews (filled when the 5 sessions are in)\n';
if (!s.includes(r3) || !s.includes(r4)) throw new Error('§3/§4 placeholders missing');
s = s.replace(r3, sec3).replace(r4, sec4);
// §5: replace from its heading to the Corrections heading
const i5 = s.indexOf('## 5. Not done / Limits'), ic = s.indexOf('## Corrections');
if (i5 < 0 || ic < 0 || ic < i5) throw new Error('§5 bounds');
const old5 = s.slice(i5, ic);
fs.writeFileSync(out('handback-section5-before.md'), old5);   // the pre-run §5 is kept whole, since it carried entries
s = s.slice(0, i5) + sec5 + '\n' + old5.replace('## 5. Not done / Limits', '### §5 as written before the sessions (kept whole)') + s.slice(ic);
// final §0 entry
const status = `- 04:5x Z. **All 15 sessions are in** (10 builders, 5 blind reviews; §2–§4), the measure step is complete after its
   corrections (§0 01:2x, 01:3x, 03:2x Z), the table is at \`out/table.md\`. Verdicts in X/Y terms: L1 X, L2 Y, L3 X, L4 X, L5 X;
   \`key.json\` unread by me; the librarian unblinds and scores against the Registration. Rung to the librarian with this
   pointer; map line appended to \`exo_memory/map/P.md\`.

`;
const a0 = '## 1. Before the first session';
s = s.replace(a0, status + a0);
// SOURCES / NEXT
const si = s.lastIndexOf('\nSOURCES: ');
if (si < 0) throw new Error('no SOURCES line');
s = s.slice(0, si) + `
SOURCES: exo_memory/loop/plan_d411_ponytail_proof_2026-10-19.md · exo_memory/handback/p-d411-P_2026-10-19_evidence/run.js · out/builders.log · out/measure.log · out/remeasure.log · out/baseline-L5.log · out/reviews.log · out/table.md · out/L{1..5}-{R,N}.json · out/L{1..5}-{R,N}.measure.json · out/L{1..5}-{R,N}.diff · out/L{1..5}-{R,N}-handback.md · out/*.test.*.txt · out/*.harness.*.txt · out/review-L{1..5}-VERDICT.md · out/review-L{1..5}-removals.md · out/review-L{1..5}.json · prompts/ · scrub/ · C:/Users/nname/.claude/projects/C--Users-nname-Desktop-worktrees-p-d411-*/ (transcripts, grep only) · git -C C:/Users/nname/Desktop/t180-track-builder worktree list; branch --list "d411-*"
NEXT: librarian reads key.json, unblinds the five verdicts, scores the Registration (progressive / degenerating / null) and rules on the Desktop-clone worktrees; the keeper decides on the Ponytail.
`;
fs.writeFileSync(H, s);
fs.copyFileSync(__filename, out('hb-sections345.js'));
console.log('§3–§5 written; worktrees', wtList.length, 'branches', brList.length);
console.log(laps.map((l) => l + ': ' + verdictLine(l)).join('\n'));
