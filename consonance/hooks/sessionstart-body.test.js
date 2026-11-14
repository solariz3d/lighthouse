/* Tests for sessionstart-body.js (Lap W, W3; exo_memory/loop/wake_level2_2026-11-13/00_lap_w_spec.md:315-384, body_line.md).
 *
 * The recorded case: at the librarian's 14:42:47Z wake on 2026-11-13 the local refs said origin/main was 0 behind while L had pushed 307
 * commits; only the AGE of the origin/main reflog entry (33.2 h, a push at 2026-11-11 23:32:51 -06:00) carried the warning. A hook that dates
 * origin by the COMMIT's time, or counts behind without the age, prints a fresh-looking line over a stale copy. The fixture below is that wake.
 *
 * Run: node --test consonance/hooks/sessionstart-body.test.js
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync, execFileSync } = require('node:child_process');

const HOOK = path.join(__dirname, 'sessionstart-body.js');
const REPO = path.join(__dirname, '..', '..');
const tmp = (p) => require('../tools/scratch.js').mkdtemp(p);
const git = (dir, args, env = {}) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', env: { ...process.env, ...env }, windowsHide: true }).trim();

/** A repo whose HEAD = origin/main = one commit made at `commitAt`, with origin/main's reflog entry written at `syncedAt` (a push or a fetch). */
function repoAt({ commitAt, syncedAt, extra = 0 }) {
  const r = tmp('body-repo-');
  git(r, ['init', '-q', '-b', 'main']);
  const who = { GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' };
  git(r, ['commit', '-q', '--allow-empty', '-m', 'base'], { ...who, GIT_AUTHOR_DATE: commitAt, GIT_COMMITTER_DATE: commitAt });
  const base = git(r, ['rev-parse', 'HEAD']);
  git(r, ['update-ref', '-m', 'update by push', 'refs/remotes/origin/main', base], { ...who, GIT_COMMITTER_DATE: syncedAt });
  if (extra) {   // `extra` commits on HEAD after the base, in ONE process (fast-import), so a 314-commit gap costs one spawn
    let s = '';
    for (let i = 1; i <= extra; i++) { const msg = `c${i}`; s += `commit refs/heads/main\ncommitter t <t@t> 1763000000 -0600\ndata ${msg.length}\n${msg}\n${i === 1 ? `from ${base}\n` : ''}\n`; }
    execFileSync('git', ['-C', r, 'fast-import', '--quiet', '--force'], { input: s, windowsHide: true, env: { ...process.env, ...who } });
  }
  fs.mkdirSync(path.join(r, 'exo_memory'), { recursive: true });
  fs.writeFileSync(path.join(r, 'exo_memory', 'BOOT.md'), 'room\n');
  return { dir: r, base };
}
/** A home with ~/.consonance.json naming the repo's room and a machine tag, and no settings unless given. */
function homeFor(repo, { machine = 'D', settings, instances } = {}) {
  const h = tmp('body-home-');
  fs.writeFileSync(path.join(h, '.consonance.json'), JSON.stringify({ room_path: path.join(repo, 'exo_memory', 'BOOT.md'), machine_tag: machine, ...(instances ? { instances_dir: instances } : {}) }));
  if (settings) { fs.mkdirSync(path.join(h, '.claude'), { recursive: true }); fs.writeFileSync(path.join(h, '.claude', 'settings.json'), JSON.stringify(settings)); }
  return h;
}
/** The 11-12 05:33:49Z reply the recorded wake resumed from: claude-opus-5-5, usage 2 / 276,157 / 395, effort high. */
function transcript(rows) {
  const d = tmp('body-tx-'), f = path.join(d, 't.jsonl');
  fs.writeFileSync(f, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
  return f;
}
const REPLY = { type: 'assistant', timestamp: '2026-11-12T05:33:49.000Z', effort: 'high',
  message: { role: 'assistant', model: 'claude-opus-5-5', usage: { input_tokens: 2, cache_read_input_tokens: 276157, cache_creation_input_tokens: 395, output_tokens: 10 } } };
const SYNTH = { type: 'assistant', timestamp: '2026-11-12T05:34:00.000Z', message: { role: 'assistant', model: '<synthetic>', usage: { input_tokens: 0 } } };
function seat(name = 'librarian-x') {
  const d = path.join(tmp('body-inst-'), name); fs.mkdirSync(d, { recursive: true });
  const md = path.join(d, 'CLAUDE.md'); fs.writeFileSync(md, '# the shelf\n');
  const t = new Date('2026-11-13T08:42:42-06:00'); fs.utimesSync(md, t, t);
  return d;
}
const CLEAN = (env) => { const e = { ...process.env }; for (const k of Object.keys(e)) if (/^(CONSONANCE_|CLAUDE_EFFORT|CLAUDE_CODE_EFFORT|CLAUDE_OVERSEER|BODY_)/.test(k)) delete e[k]; return { ...e, ...env }; };
function run(payload, env) {
  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(payload), encoding: 'utf8', env: CLEAN(env), windowsHide: true, timeout: 30000 });
  return { status: r.status, out: r.stdout, err: r.stderr };
}
const lineOf = (out) => JSON.parse(out).hookSpecificOutput.additionalContext.split('\n')[0];
function wake(over = {}) {
  const repo = over.repo || repoAt({ commitAt: '2026-11-11T18:00:00-06:00', syncedAt: '2026-11-11T23:32:51-06:00' });
  const home = over.home || homeFor(repo.dir);
  const data = tmp('body-data-');
  const cwd = over.cwd || seat();
  const payload = { source: 'resume', transcript_path: over.transcript === undefined ? transcript([REPLY, SYNTH]) : over.transcript, cwd, ...(over.payload || {}) };
  const r = run(payload, { USERPROFILE: home, HOME: home, CONSONANCE_DATA: data, BODY_NOW: '2026-11-13T08:42:47-06:00', ...(over.env || {}) });
  return { ...r, repo, home, data, cwd };
}

test('W3 (RED FIRST) the recorded 14:42:47Z wake: model, effort and context from the last reply, origin dated by its reflog entry (33.2 h), 0 behind', () => {
  const w = wake();
  assert.strictEqual(w.status, 0, w.err);
  const o = JSON.parse(w.out);
  assert.strictEqual(o.hookSpecificOutput.hookEventName, 'SessionStart');
  const line = lineOf(w.out);
  for (const must of ['[body] machine D', 'model claude-opus-5-5 (last reply)', 'effort high (last reply)', 'context 277k at last reply',
    `HEAD ${w.repo.base.slice(0, 8)}`, 'origin/main last synced 33.2 h ago, 0 behind by that copy', `shelf built at ${w.repo.base.slice(0, 8)}`, 'source resume'])
    assert.ok(line.includes(must), `the line has "${must}": ${line}`);
  assert.ok(Buffer.byteLength(line) <= 300, `at most 300 bytes (${Buffer.byteLength(line)})`);
  assert.doesNotMatch(line, /\$|usd/i, 'never dollars');
});

test('W3 the origin age is the reflog ENTRY\'s, never the commit\'s: a commit 5.5 h older than its sync does not move the age', () => {
  const w = wake();
  assert.doesNotMatch(lineOf(w.out), /38\.7 h/, 'the commit time (18:00 on 11-11) would read 38.7 h');
});

test('W3 a copy of origin 3 commits ahead of HEAD says "3 behind by that copy"', () => {
  const repo = repoAt({ commitAt: '2026-11-11T18:00:00-06:00', syncedAt: '2026-11-11T23:32:51-06:00' });
  const who = { GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' };
  let tip = repo.base;
  for (let i = 0; i < 3; i++) tip = git(repo.dir, ['commit-tree', `${repo.base}^{tree}`, '-p', tip, '-m', `ahead ${i}`], who);
  git(repo.dir, ['update-ref', '-m', 'fetch', 'refs/remotes/origin/main', tip], { ...who, GIT_COMMITTER_DATE: '2026-11-13T08:43:39-06:00' });
  const line = lineOf(wake({ repo }).out);
  assert.ok(line.includes('origin/main last synced 0 min ago, 3 behind by that copy'), line);
});

test('W3 the payload\'s model wins over the transcript, and is not marked "(last reply)"', () => {
  const line = lineOf(wake({ payload: { model: 'claude-fable-5-2' } }).out);
  assert.ok(line.includes('model claude-fable-5-2 ·'), line);
});

test('W3 the payload\'s context_tokens gives "to resend"', () => {
  assert.ok(lineOf(wake({ payload: { context_tokens: 430210 } }).out).includes('context 430k to resend'));
});

test('W3 on a compaction the last reply is the size BEFORE it', () => {
  assert.ok(lineOf(wake({ payload: { source: 'compact' } }).out).includes('context 277k before compaction'));
});

test('W3 an empty transcript and no model in the payload: "model not readable", "context not readable"', () => {
  const line = lineOf(wake({ transcript: transcript([]) }).out);
  assert.ok(line.includes('model not readable'), line);
  assert.ok(line.includes('context not readable'), line);
});

test('W3 no effort anywhere (no env, no reply effort, no saved setting): "effort not readable"', () => {
  const noEffort = { ...REPLY }; delete noEffort.effort;
  assert.ok(lineOf(wake({ transcript: transcript([noEffort]) }).out).includes('effort not readable'));
});

test('W3 the effort order: env first, then the last reply, then the saved setting', () => {
  assert.ok(lineOf(wake({ env: { CLAUDE_CODE_EFFORT_LEVEL: 'max' } }).out).includes('effort max (env)'));
  const noEffort = { ...REPLY }; delete noEffort.effort;
  const repo = repoAt({ commitAt: '2026-11-11T18:00:00-06:00', syncedAt: '2026-11-11T23:32:51-06:00' });
  const home = homeFor(repo.dir, { settings: { modelSettings: { 'claude-opus-5-5': { effortLevel: 'xhigh' } } } });
  assert.ok(lineOf(wake({ repo, home, transcript: transcript([noEffort]) }).out).includes('effort xhigh (saved)'));
});

test('W3 a missing repo: "HEAD not readable", valid JSON, exit 0, the start never blocked', () => {
  const home = tmp('body-home-none-');
  fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({ room_path: path.join(home, 'nowhere', 'exo_memory', 'BOOT.md'), machine_tag: 'D' }));
  const w = wake({ home });
  assert.strictEqual(w.status, 0);
  const line = lineOf(w.out);
  assert.ok(line.includes('HEAD not readable'), line);
  assert.ok(line.includes('origin/main not readable'), line);
});

test('W3 a shelf stamped by W1 314 commits behind HEAD says so', () => {
  const repo = repoAt({ commitAt: '2026-11-11T18:00:00-06:00', syncedAt: '2026-11-11T23:32:51-06:00', extra: 314 });
  const cwd = seat();
  fs.writeFileSync(path.join(cwd, 'CLAUDE.md'), `# the shelf\nBuilt 2026-11-13 08:42:42 on D from HEAD ${repo.base.slice(0, 8)} (main).\n`);
  const line = lineOf(wake({ repo, cwd }).out);
  assert.ok(line.includes(`shelf built at ${repo.base.slice(0, 8)}, 314 commits behind HEAD`), line);
});

test('W3 skips, each with a ledger row and no line: a fresh pane, an overseer run, the Third Place', () => {
  const fresh = seat('fresh-abc'), freshRepo = repoAt({ commitAt: '2026-11-11T18:00:00-06:00', syncedAt: '2026-11-11T23:32:51-06:00' });
  // a fresh pane is a fresh-* folder directly under the instances folder (lib/fresh-guard.js's rule), so this home names that folder
  for (const [name, over, reason] of [['fresh', { cwd: fresh, repo: freshRepo, home: homeFor(freshRepo.dir, { instances: path.dirname(fresh) }) }, /fresh/], ['overseer', { env: { CLAUDE_OVERSEER_RUN: '1' } }, /overseer/],
    ['third place', { cwd: seat('third-place') }, /third-place/]]) {
    const w = wake(over);
    assert.strictEqual(w.out.trim(), '', `${name}: nothing printed`);
    const rows = fs.readFileSync(path.join(w.data, 'sessionstart-body.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    assert.strictEqual(rows[0].event, 'skipped', name);
    assert.match(rows[0].reason, reason, name);
  }
});

test('W3 the dream gate: a dreaming instance gets nothing, and nothing is written', () => {
  const w = wake({ env: { CONSONANCE_DREAM: '1' } });
  assert.strictEqual(w.out, '');
  assert.ok(!fs.existsSync(path.join(w.data, 'sessionstart-body.jsonl')));
});

test('W3 the ledger row says where each field came from, so the first real wake answers the two unknowns', () => {
  const w = wake();
  const row = JSON.parse(fs.readFileSync(path.join(w.data, 'sessionstart-body.jsonl'), 'utf8').trim().split('\n').pop());
  assert.strictEqual(row.event, 'emitted');
  assert.strictEqual(row.source, 'resume');
  assert.deepStrictEqual([row.model_src, row.effort_src, row.ctx_src], ['transcript', 'transcript', 'transcript']);
  assert.ok(row.bytes > 0 && Number.isFinite(row.ms));
});

test('W3 the librarian\'s second clause: newest note, the Third Place\'s newest, and the other machine\'s handoffs, each by the DATE IN THE NAME', () => {
  const repo = repoAt({ commitAt: '2026-11-11T18:00:00-06:00', syncedAt: '2026-11-11T23:32:51-06:00' });
  const put = (rel) => { const f = path.join(repo.dir, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, 'x\n'); return f; };
  const files = ['exo_memory/librarian/2026-11-12.md', 'exo_memory/librarian/2026-11-13.md', 'exo_memory/librarian/2026-11-15.md', 'exo_memory/librarian/TO_THE_NEXT_ONE_x.md',
    'exo_memory/third_place/2026-11-12.md', 'exo_memory/third_place/to_the_third_place_2026-11-13c.md',
    'exo_memory/loop/handoff_lighthouse_2026-11-11-L.md', 'exo_memory/loop/handoff_lighthouse_2026-11-13-L.md', 'exo_memory/loop/handoff_dreamzone3_2026-11-13-L.md',
    'exo_memory/loop/handoff_lighthouse_2026-11-13-D.md'].map(put);
  // a pull stamps every file with one time: the OLDEST name gets the newest mtime, so a pick by mtime would choose it
  const t = new Date('2026-11-13T08:43:40-06:00'); for (const f of files) fs.utimesSync(f, t, t);
  const late = new Date('2026-11-13T08:43:41-06:00'); fs.utimesSync(files[0], late, late);
  const out = JSON.parse(wake({ repo, cwd: seat('librarian') }).out).hookSpecificOutput.additionalContext;
  const clause = out.split('\n')[1] || '';
  assert.match(clause, /^\[room\] /, out);
  assert.ok(clause.includes('exo_memory/librarian/2026-11-13.md'), `the newest note no more than a day ahead (11-15 is two): ${clause}`);
  assert.ok(clause.includes('exo_memory/third_place/to_the_third_place_2026-11-13c.md'), clause);
  assert.ok(clause.includes('exo_memory/loop/handoff_dreamzone3_2026-11-13-L.md') && clause.includes('exo_memory/loop/handoff_lighthouse_2026-11-13-L.md'), clause);
  assert.ok(!clause.includes('2026-11-11-L') && !clause.includes('-D.md'), `only the other machine's, at its newest date: ${clause}`);
  assert.ok(clause.includes(`at HEAD ${repo.base.slice(0, 8)}`), clause);
  assert.ok(Buffer.byteLength(lineOf(JSON.stringify({ hookSpecificOutput: { additionalContext: out } }))) <= 300, 'the body line itself stays at most 300 bytes');
});

test('W3 a build seat gets no room clause', () => {
  const out = JSON.parse(wake().out).hookSpecificOutput.additionalContext;
  assert.ok(!out.includes('[room]'));
});

test('W3 pinned copies: machineTag is state-sync.js\'s, and the D273 dirs block is sessionstart-state.js\'s, text for text', () => {
  const text = (f) => fs.readFileSync(path.join(REPO, f), 'utf8').replace(/\r\n/g, '\n');
  const fn = (t) => { const a = t.indexOf('function machineTag() {'); return a < 0 ? null : t.slice(a, t.indexOf('\n}\n', a) + 2); };
  const block = (t) => { const a = t.indexOf('// D273 dirs: begin'), b = t.indexOf('// D273 dirs: end'); return a < 0 || b < 0 ? null : t.slice(a, b); };
  const mine = text('consonance/hooks/sessionstart-body.js');
  assert.ok(fn(mine), 'the hook carries machineTag');
  assert.strictEqual(fn(mine), fn(text('consonance/tools/state-sync.js')));
  assert.strictEqual(block(mine), block(text('consonance/hooks/sessionstart-state.js')));
});

// ── The wake gate's ruled bar (plan_room_stretch_2026-11-13.md:215; registered in handback/p-wakegate-S-register-P_2026-11-13.md; pane P) ──
// At each librarian wake this hook records which dated note it named and how many lines it had, with the session: the gate's S at the next wake
// is that count plus one. A build seat's row carries none of the three.
test('WG-BAR the librarian\'s row records the session, the dated note it named, and the note\'s line count at this wake', () => {
  const repo = repoAt({ commitAt: '2026-11-11T18:00:00-06:00', syncedAt: '2026-11-11T23:32:51-06:00' });
  const f = path.join(repo.dir, 'exo_memory', 'librarian', '2026-11-13.md'); fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, Array.from({ length: 542 }, (_, i) => `line ${i + 1}`).join('\n') + '\n');
  const w = wake({ repo, cwd: seat('librarian'), payload: { session_id: 'sess-lib-1', source: 'compact' } });
  const row = JSON.parse(fs.readFileSync(path.join(w.data, 'sessionstart-body.jsonl'), 'utf8').trim().split('\n').pop());
  assert.strictEqual(row.session, 'sess-lib-1');
  assert.strictEqual(row.note, 'exo_memory/librarian/2026-11-13.md');
  assert.strictEqual(row.note_lines, 542, 'the same count wc -l gives for a note that ends in a newline');
});
test('WG-BAR a build seat\'s row carries no note fields', () => {
  const w = wake({ payload: { session_id: 'sess-x' } });
  const row = JSON.parse(fs.readFileSync(path.join(w.data, 'sessionstart-body.jsonl'), 'utf8').trim().split('\n').pop());
  assert.strictEqual(row.note, undefined);
  assert.strictEqual(row.note_lines, undefined);
});
