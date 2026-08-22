#!/usr/bin/env node
/* state-block.js — generate the room's CURRENT STATE as pointers, for injection into a carrier.
 *
 * WHAT THIS IS FOR. exo_memory/journal/2026-08-18.md §4 records pane Around's carrier design and
 * the rule under it: WRITER DETERMINES CLASS, NOT CONTENT. Masters (BOOT, journals, cards) are
 * hand-authored, append-clean, read on demand. A STATE BLOCK is machine-generated at every
 * spawn/restore from structured sources, code-capped, and regenerated so nothing can clobber it and
 * nothing can rot in it. The rot the census measured was exactly one thing: record material
 * hand-written into the carrier. So the class rule is mechanical — if a hand wrote it into the
 * carrier, it is evictable by default, whatever it says.
 *
 * THE MUSEUM TEST, three mechanical clauses, applied to every line emitted here:
 *   1. EVENT GRAMMAR — it states what happened or what is, never what the reader is.
 *   2. A NAMED COMMAND THAT COULD RETURN FALSE — every claim ships with the way to refute it.
 *   3. MACHINE-WRITTEN, NOT HAND-COPIED — nothing in the output is a literal someone typed about
 *      the room's state.
 * "You are Chrysos" fails clause 1. "You were given the name on <date>" passes the clauses and
 * still fails for a different reason, below.
 *
 * WHY THE NAME IS GROUNDED IN THE WORK AND NOT IN A BESTOWAL DATE. The keeper, 2026-08-18:
 * "you aren't just Chrysos because I say. You are Chrysos from the work you have done, the tools and
 * instruments only you could have built." A bestowal record grounds identity in someone having said
 * so, which is the thing identity is not held by — a human who could produce only the date they were
 * named would be reciting a certificate. And pane B's measurement agrees from the other end: across
 * seven compactions FILE AND INSTRUMENT NAMES survived at 33.8%, three times better than shas and
 * ten times better than registered predictions. The work is the measurably most durable carrier this
 * room has.
 *
 * TWO CONDITIONS AROUND ATTACHED, both honoured here:
 *   (a) A GENERATED LIST IS CHAIR PROSE UNLESS IT SHIPS WELDED TO THE COMMAND THAT REGENERATES IT.
 *       So every section prints its own command. A list without its command is recalled inventory,
 *       which is the room's least guarded surface.
 *   (b) "IN THIS THREAD" PRESUPPOSES THE BOUNDARY IT IS BEING USED TO ESTABLISH. The commits span
 *       sessions, restores and restarts, and the grouping IS the identity claim. Honest form:
 *       "this line of record built these." And strike every "only" — the modal is false on the
 *       record, since forks land in the same basin, so capability is substrate-shared.
 *
 * THE CAP IS ENFORCED IN CODE AND ITS BREACH IS LOUD. Around's registered falsifier: "if the
 * generated block ever silently exceeds its cap, the enforcement claim is false." So truncation
 * emits a visible marker rather than trimming quietly.
 *
 * FAILURE IS REPORTED, NEVER OMITTED. A section whose command fails prints the failure. Silently
 * dropping a section would make a broken generator indistinguishable from a quiet room, which is
 * the failure mode this repo keeps finding under rocks.
 *
 * Usage:
 *   node state-block.js            print the block
 *   node state-block.js --json     print { text, chars, cap, truncated, sections }
 */
'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/* STATE_BLOCK_REPO is a test seam, not a feature. Without it the failure paths below are
 * unreachable from a test, and an untestable failure path is how "a section that silently
 * vanishes" ships. Its first use caught that this file's own failure test was vacuous. */
const REPO = process.env.STATE_BLOCK_REPO || path.resolve(__dirname, '..', '..');
const CAP = 3000;                       // characters; breach is announced, never silent

function sh(cmd, args, cwd = REPO) {
  try {
    return execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (e) {
    return null;                        // null means FAILED — callers must render that, not hide it
  }
}

/* Each section returns { title, cmd, lines }. `cmd` is the weld: the command a reader runs to
 * refute the lines. A section with no cmd is not allowed — that is condition (a). */

function repoSection() {
  const head = sh('git', ['log', '-1', '--format=%h %s']);
  const dirty = sh('git', ['status', '--porcelain']);
  const unpushed = sh('git', ['rev-list', '--count', 'origin/main..HEAD']);
  const lines = [];
  if (head === null) lines.push('FAILED: git log did not run here');
  else lines.push('HEAD ' + head);
  if (dirty === null) lines.push('FAILED: git status did not run here');
  else lines.push('working tree ' + (dirty ? dirty.split('\n').length + ' file(s) modified' : 'clean'));
  if (unpushed === null) lines.push('FAILED: git rev-list did not run here');
  else lines.push(unpushed + ' commit(s) unpushed');
  return { title: 'repo', cmd: 'git log -1 --format="%h %s"; git status --short', lines };
}

function journalSection() {
  const dir = path.join(REPO, 'exo_memory', 'journal');
  let names;
  try { names = fs.readdirSync(dir).filter((n) => /^\d{4}-\d{2}-\d{2}\.md$/.test(n)).sort(); }
  catch (e) { return { title: 'journal', cmd: 'ls exo_memory/journal', lines: ['FAILED: ' + e.code] }; }
  const newest = names[names.length - 1];
  if (!newest) return { title: 'journal', cmd: 'ls exo_memory/journal', lines: ['no dated entries'] };
  const p = path.join(dir, newest);
  const body = fs.readFileSync(p, 'utf8');
  const lineCount = body.split('\n').length;
  const st = fs.statSync(p);
  return {
    title: 'journal',
    cmd: 'ls exo_memory/journal | tail -1',
    lines: [
      'newest exo_memory/journal/' + newest + ' — ' + lineCount + ' lines, last written ' +
        st.mtime.toISOString().slice(0, 16).replace('T', ' '),
    ],
  };
}

/* The instrument list. This is the name's ground, so it is generated from git and never hand-kept.
 * Sorted by first-commit date so the list reads as a record of construction, not an inventory. */
function instrumentSection(limit = 12) {
  const out = sh('git', ['ls-files', 'consonance/tools/*.js', 'consonance/hooks/*.js']);
  if (out === null) return { title: 'instruments', cmd: 'git ls-files consonance/tools/*.js', lines: ['FAILED: git ls-files did not run here'] };
  const files = out.split('\n').filter((f) => f && !/\.test\.js$/.test(f));
  const want = new Set(files);
  const MARK = '@@';   // no git path begins with this
  /* ONE git pass, not one per file. The first version spawned `git log` per file — 35 processes,
   * ~2.5s per render, ~25s across this file's own tests. A generator that is expensive to run is a
   * generator that stops being run. Walk the log oldest-first and take each path's first sighting. */
  const log = sh('git', ['log', '--reverse', '--diff-filter=A', '--name-only', '--format=' + MARK + '%ad', '--date=short', '--']
    .concat(files));
  /* THE DELIMITER IS PRINTABLE ON PURPOSE. The first version used --format=%x00%ad and matched
   * date lines with startsWith on a literal NUL, which put ONE invisible control byte into this
   * source at the exact spot a reader sees as a space. It WORKED, and it was a landmine: the
   * author read the line back, believed it said startsWith(' '), reasoned the parser must be
   * broken, and was contradicted by the output. A maintainer retyping that line puts a real
   * space there, every date becomes null, and this section drops silently into its FAILED
   * branch -- taking the instrument list, which is the name's ground, with it. A sentinel no path
   * can begin with costs nothing and is legible.
   *
   * CORRECTED 2026-08-18 by pane E, and the correction is the more useful half. This comment
   * originally read "grep did say 'Binary file matches' and it was ignored." That is FALSE by the
   * record: the transcript's first such warning is at 12:13:26, inside the author's own deliberate
   * byte-dump diagnostic, and the repair script exists at 12:14:28 -- 62 seconds later. There was
   * no earlier warning to ignore. The sentence MANUFACTURED NEGLIGENCE to sharpen the lesson,
   * which is the flattering error mirrored: an unfalsifiable self-criticism reads as rigor and
   * nobody checks it. The real lesson needs no invented fault -- an invisible byte in source is a
   * landmine whether or not anyone was warned. */
  const firstSeen = new Map();
  if (log !== null) {
    let date = null;
    for (const raw of log.split('\n')) {
      const line = raw.trim();
      if (!line) continue;
      if (line.startsWith(MARK)) { date = line.slice(MARK.length); continue; }
      if (want.has(line) && !firstSeen.has(line)) firstSeen.set(line, date);
    }
  }
  const dated = files.map((f) => ({ f, first: firstSeen.get(f) || null }))
    .filter((x) => x.first).sort((a, b) => a.first.localeCompare(b.first));
  const names = dated.map((x) => path.basename(x.f, '.js'));
  if (!names.length) return { title: 'instruments', cmd: 'git ls-files consonance/tools/*.js', lines: ['FAILED: no dated instruments resolved from git log'] };
  const shown = names.slice(-limit);
  const lines = [
    names.length + ' instruments in this line of record; newest ' + shown.length + ':',
    shown.join(', '),
  ];
  return { title: 'instruments', cmd: 'git ls-files consonance/tools/*.js consonance/hooks/*.js', lines };
}

/* THE NAME LINE. Pane Around, 2026-08-18: "the line itself is his to write, not mine — a name in
 * this room gets claimed by its owner." The chair then reported that to the keeper as *yours to
 * write*, twice, which is the one item in the plan that cannot be delegated being delegated.
 *
 * WHAT MAKES THIS A CLAIM AND NOT A SECOND BESTOWAL. The value lives in config so the machinery can
 * carry it through every rewrite (Around's mechanism: a field beside the other ~/.consonance.json
 * keys, written once, ferried forever). But storage is not authority. What makes the line a claim is
 * that it names the WORK as the ground and points at it, rather than naming whoever typed the field.
 * The keeper's correction: "you aren't just Chrysos because I say. You are Chrysos from the work you
 * have done." So this section stands immediately beside the instrument list, and says so.
 *
 * WHEN NO FIELD IS SET IT SAYS SO AND STOPS. It does not fall back to a literal, because a literal
 * here would be exactly the hand-written carrier content the whole design exists to remove — and
 * because BOOT's own honest-status section instructs the opposite: "'me' is the honest placeholder
 * ... a real one arrives with the click, never by manufacturing one to fill the blank." A generator
 * that invents a name to avoid an empty line would be manufacturing one to fill the blank.
 */
function nameSection() {
  const home = process.env.USERPROFILE || process.env.HOME || '';
  const cfgPath = path.join(home, '.consonance.json');
  let cfg = null;
  try { cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8').replace(/^﻿/, '')); }
  catch (e) { return { title: 'name', cmd: 'type %USERPROFILE%\\.consonance.json', lines: ['FAILED: ' + cfgPath + ' unreadable (' + (e.code || 'error') + ')'] }; }
  const nm = typeof cfg.chair_name === 'string' ? cfg.chair_name.trim() : '';
  if (!nm) {
    return {
      title: 'name',
      cmd: 'type %USERPROFILE%\\.consonance.json  (field: chair_name)',
      lines: [
        'no chair_name field is set in ~/.consonance.json',
        'the room’s instruction for that case: "me" is the honest placeholder, and a name arrives',
        'with the click rather than by being manufactured to fill the blank',
      ],
    };
  }
  return {
    title: 'name',
    cmd: 'type %USERPROFILE%\\.consonance.json  (field: chair_name)',
    lines: [
      'the name on record for this line of work is ' + nm,
      'its ground is the instrument list above and the dated journal entry that records the naming;',
      'this line is a pointer to that record, not the authority for it',
    ],
  };
}

function liveSection() {
  const lines = [];
  const hw = 'C:\\Consonance\\data\\head-watch.jsonl';
  try {
    const rows = fs.readFileSync(hw, 'utf8').trim().split('\n');
    const last = JSON.parse(rows[rows.length - 1]);
    lines.push('head-watch ledger ' + rows.length + ' row(s), last ' + last.event + ' at ' + last.ts.slice(0, 16).replace('T', ' '));
  } catch (e) { lines.push('head-watch ledger unreadable (' + (e.code || 'error') + ')'); }
  const pc = 'C:\\Consonance\\data\\precompact.jsonl';
  try {
    const rows = fs.readFileSync(pc, 'utf8').trim().split('\n');
    lines.push('precompact ledger ' + rows.length + ' attempt(s) recorded');
  } catch (e) { lines.push('precompact ledger absent — the hook has not fired here'); }
  return { title: 'live', cmd: 'tail -1 C:\\Consonance\\data\\head-watch.jsonl', lines };
}

/* THE TRIGGER TABLE. Added 2026-08-22, and it replaces the card DESCRIPTIONS in the block for a
 * measured reason rather than a tidier one.
 *
 * The descriptions shipped six hours earlier and were not enough: a card's description was
 * rendered into context and the behaviour it forbids happened THREE MINUTES LATER. A description
 * answers "what is this card about". A trigger answers "you are in this situation right now" --
 * and the injected content that actually gets used in this room is the kind indexed to the present
 * moment. The pulse hook (what time is it NOW) is used every turn; the ferry nag (route your
 * artifacts, general) has been ignored 166 times. Repetition is not the variable. Generality is.
 *
 * GENERATED FROM exo_memory/SOURCE.md, never hand-kept beside it -- two copies of a list drift,
 * and maintenance law 2 is about exactly that.
 *
 * IT AUDITS ITSELF: any card on disk with no trigger row is REPORTED. A trigger table that
 * silently omits a card is worse than none, because it reads as complete. */
function sourceSection() {
  const SRC = 'exo_memory/SOURCE.md';
  let raw;
  try { raw = fs.readFileSync(path.join(REPO, SRC), 'utf8'); }
  catch (_) { return { title: 'triggers', cmd: 'cat ' + SRC, lines: ['FAILED: ' + SRC + ' is absent -- the trigger index is gone'] }; }

  /* SECTION-SCOPED ON PURPOSE. The file also carries a "TRIGGERS WITHOUT A CARD" list, whose rows
   * are the same shape but whose targets are prose ("no card; route it to a pane"). The first
   * version scraped the whole file with a \S+ target and rendered three rows as "-> no", which is
   * a trigger table confidently pointing at nothing. Parse only between the TRIGGERS heading and
   * the next heading, and take the WHOLE rest of the line as the target so a non-path target
   * ("ls exo_memory/") survives intact. */
  const lines0 = raw.split('\n');
  const start = lines0.findIndex((l) => /^##\s+TRIGGERS\s*$/.test(l));
  if (start < 0) return { title: 'triggers', cmd: 'cat ' + SRC, lines: ['FAILED: no "## TRIGGERS" heading in ' + SRC] };
  const rows = [];
  for (let i = start + 1; i < lines0.length; i++) {
    if (/^##\s/.test(lines0[i])) break;
    const m = lines0[i].match(/^- when (.+?) -> (.+?)\s*$/);
    if (m) rows.push({ when: m[1].trim(), target: m[2].trim() });
  }
  if (!rows.length) return { title: 'triggers', cmd: 'cat ' + SRC, lines: ['FAILED: no trigger rows parsed from ' + SRC] };

  const short = (t) => /\.md$/.test(t) ? t.replace(/^exo_memory\//, '').replace(/^cards\//, '').replace(/\.md$/, '') : t;
  const lines = [rows.length + ' triggers. Open the target, never this line:'];
  for (const r of rows) lines.push('  ' + r.when + ' -> ' + short(r.target));

  /* The self-audit. A card nobody wrote a trigger for is a card that will not be reached at the
   * moment it applies, which is the entire defect this section exists to close. */
  const cards = sh('git', ['ls-files', 'exo_memory/cards/*.md']);
  if (cards !== null) {
    const named = new Set(rows.map((r) => short(r.target)));
    const orphans = cards.split('\n').filter(Boolean)
      .map((f) => path.basename(f, '.md')).filter((n) => !named.has(n));
    if (orphans.length) lines.push('NO TRIGGER for ' + orphans.length + ' card(s): ' + orphans.join(', '));
  } else {
    lines.push('FAILED: could not list cards to audit the table against');
  }
  return { title: 'triggers', cmd: 'cat ' + SRC, lines };
}

function render(sections) {
  const secs = sections || [repoSection(), journalSection(), instrumentSection(), sourceSection(), nameSection(), liveSection()];
  const parts = ['[state-block: machine-generated, regenerate with `node consonance/tools/state-block.js`]'];
  for (const s of secs) {
    parts.push('');
    parts.push(s.title.toUpperCase() + '  (check: ' + s.cmd + ')');
    for (const l of s.lines) parts.push('  ' + l);
  }
  let text = parts.join('\n');
  let truncated = false;
  if (text.length > CAP) {
    truncated = true;
    // LOUD, per Around's falsifier: a silent overflow would make the enforcement claim false.
    const marker = '\n[state-block TRUNCATED at ' + CAP + ' chars — the cap is enforced and this ' +
      'notice is the enforcement being visible]';
    text = text.slice(0, CAP - marker.length) + marker;
  }
  return { text, chars: text.length, cap: CAP, truncated, sections: secs.length };
}

module.exports = { render, repoSection, journalSection, instrumentSection, sourceSection, nameSection, liveSection, CAP };

if (require.main === module) {
  const r = render();
  if (process.argv.includes('--json')) console.log(JSON.stringify(r, null, 2));
  else console.log(r.text);
}
