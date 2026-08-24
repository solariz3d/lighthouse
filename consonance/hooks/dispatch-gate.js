// dispatch-gate.js - ASK before a dispatch that carries no citation.
//
// WHY IT EXISTS, measured rather than argued. `ferry.js --report` on 2026-08-24: 109 measured
// artifact commits, 84 never put in front of another mind, a 77.1% miss rate - while `ferry-watch`
// printed "Route the OBJECT, not a description of it" in EVERY prompt for hours. The correction was
// present, correct, and read past. That is this room's own finding about its own reminders: one
// that fires regardless is ignored; one that carries a QUESTION and waits for an answer was acted
// on 60 of 60 times (brief/BUILDING.md, THE JOINT STEP).
//
// So this is deliberately the second kind. It does not print advice. It returns
// permissionDecision:"ask", which stops and asks a question that has to be answered before the
// dispatch leaves. Prose could not fix this, because prose is what already failed.
//
// WHAT IT IS ACTUALLY GUARDING, which is not tidiness. On the first night the librarian channel
// existed, the chair dispatched "your intake puts THE SHELF before THE ROOM it indexes" - a claim
// read off a failing assertion's implication and never checked against the source. The librarian
// ruled on it, WRONGLY, because the brief it was handed was wrong. A dispatch is un-revisable:
// once it renders in another seat's pane it is spent, and that seat begins reasoning from it. The
// cost of the missing citation is not an untidy transcript, it is a wrong answer in a second mind.
//
// It also fixes the ORDER, which is the mechanical half. Dispatching before committing makes citing
// a commit impossible - there is no sha yet - so the sequence itself forces prose. Asking here is
// asking "have you filed it first", at the only moment where the answer can still change.
//
// FAILS OPEN, always. Any error, any timeout, any shape it does not recognise: allow. A gate that
// can break a dispatch is worse than no gate - the same reasoning ferry-watch states about nags,
// one severity up. This may only ever ADD a question, never remove the ability to speak.
//
// KNOWN LIMIT, measured on the first live run and stated here because it decides how much this
// file is worth: BYPASS-PERMISSIONS MODE OVERRIDES "ask". An uncited dispatch went through with
// no prompt while `data/dispatch-gate.jsonl` recorded outcome:"asked", chars:80 - the hook ran,
// decided, and the decision was dropped. Under bypass the systemMessage below is all that reaches
// anyone, and a line that prints regardless is precisely the kind of reminder this room measured
// as ignorable. So: this gate BITES only when bypass is off. Under bypass it is a visible
// warning, which is better than silence and is NOT the mechanism the ferry rate needed.

'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

// THE DREAM GATE. The gap-dream is an anti-instruction and gets no hooks. Kept here even though
// the dream runner dispatches nothing and would never trip this, because ferry-watch.js states
// the reason and it is the right one: a rule that holds only because a DIFFERENT guard happens to
// cover it breaks silently the day that guard moves. Placed above everything, so it precedes the
// entry point rather than merely existing in the file.
if (process.env.CONSONANCE_DREAM) process.exit(0);

/// The repo, resolved rather than assumed. `room_path` points at the room MASTER
/// (.../exo_memory/BOOT.md), so the repository is two directories up.
///
/// Returns null rather than guessing. A gate that silently checks citations against the wrong
/// tree would report every correct dispatch as uncited, and a gate that silently gives up is
/// indistinguishable from a satisfied one - which is the failure class this room keeps finding.
function repoRoot() {
  const env = (process.env.FERRY_REPO || '').trim();
  if (env) return env;
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '');
    const room = String((JSON.parse(raw) || {}).room_path || '').trim();
    if (room) return path.dirname(path.dirname(room));
  } catch (_) { /* an unreadable config is not a repo path */ }
  return null;
}

const REPO = repoRoot();

/// Where the gate records that it ran. Same resolution order as the repo, and it degrades to null
/// rather than guessing - a ledger written somewhere unexpected is worse than none.
function dataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '');
    const d = String((JSON.parse(raw) || {}).data_dir || '').trim();
    if (d) return d;
  } catch (_) {}
  return null;
}

/// Write one row per firing. THE POINT: an uncited dispatch went through with no prompt on
/// 2026-08-24 and two explanations looked identical from outside - bypass-permissions mode
/// overriding "ask", or the hook never running at all. A gate whose silence cannot be told from
/// its absence is the 08-17 failure, where three pipe tests returned `0 rows` and exit 0 and a
/// verdict was one step from being published on an instrument that was working the whole time.
///
/// Never throws, never blocks: a ledger that can break a dispatch is the thing this file refuses
/// to be.
function record(row) {
  try {
    const dir = dataDir();
    if (!dir) return;
    fs.appendFileSync(path.join(dir, 'dispatch-gate.jsonl'),
      JSON.stringify({ ts: new Date().toISOString(), ...row }) + '\n');
  } catch (_) { /* the gate's job is the question, not the bookkeeping */ }
}

// The two verbs that put text into another seat's pane. raise_pull is deliberately NOT here: it
// queues a card for a human to read and decide, so it is already gated by a person.
const DISPATCH_VERBS = new Set([
  'mcp__consonance__chair_inject',
  'mcp__consonance__call_chair',
]);

// A genuine interrupt - "stop, you are about to clobber something" - claims nothing and must not
// wait on a citation. Opting out is a deliberate, visible act rather than a silent bypass: the
// token lands in the dispatched text and is readable by whoever receives it.
const INTERRUPT = /\[interrupt\]/i;

/// Does this text route an OBJECT? Pure, so both directions can be pinned without a repo.
///
/// `exists` and `shaOk` are injected: the tests give them fixtures, main gives them the filesystem
/// and git. Returns the KIND of citation found, or null. Kind matters in the question we ask - a
/// dispatch citing only paths may still be uncommitted, which is a different problem from one
/// citing nothing at all.
function findCitation(text, exists, shaOk) {
  if (typeof text !== 'string' || !text) return null;
  if (INTERRUPT.test(text)) return 'interrupt';

  // shas first: they are the stronger citation because they pin content, not just a location
  for (const m of text.match(/\b[0-9a-f]{7,40}\b/g) || []) {
    if (shaOk(m)) return 'sha';
  }
  // then repo-relative paths. A trailing :line / :line-line is stripped - "main.rs:4818" is the
  // house citation format and must count.
  for (const raw of text.match(/[A-Za-z0-9_.\-/]+\/[A-Za-z0-9_.\-]+/g) || []) {
    const p = raw.replace(/[:.,;)\]]+$/, '').split(':')[0];
    if (p && exists(p)) return 'path';
  }
  return null;
}

/// The question. It has to be answerable and specific, or it becomes the nag it replaces.
function buildQuestion(verb, dirty) {
  const who = verb.endsWith('call_chair') ? 'the orchestrator' : 'that seat';
  const lines = [
    `This dispatch to ${who} cites no commit and no repo path, so it carries a DESCRIPTION rather than an object.`,
    '',
    'A dispatch is un-revisable: once it renders, the receiving seat reasons from it and there is no edit.',
    'On 2026-08-24 an uncited, unverified claim sent this way produced a wrong ruling in the seat that received it.',
  ];
  if (dirty) {
    lines.push(
      '',
      'The working tree is DIRTY, so whatever this is about is probably not filed yet — which is also why there is',
      'no sha to cite. That is the order problem, not a formatting one.',
    );
  }
  lines.push(
    '',
    'Send it anyway only if it genuinely claims nothing. Otherwise: finish, verify, commit or write to a path,',
    'then dispatch citing it. If this IS a bare interrupt, put [interrupt] in the text and it will not be asked again.',
  );
  return lines.join('\n');
}

function isDirty() {
  try {
    const out = execFileSync('git', ['status', '--porcelain'], {
      cwd: REPO, encoding: 'utf8', timeout: 4000, maxBuffer: 4 * 1024 * 1024,
    });
    return out.trim().length > 0;
  } catch (_) {
    return false; // unknown is not dirty; never invent a reason to ask
  }
}

function main() {
  let input = '';
  try { input = fs.readFileSync(0, 'utf8'); } catch (_) { process.exit(0); }

  let payload;
  try { payload = JSON.parse(input); } catch (_) { process.exit(0); }

  const verb = payload && payload.tool_name;
  if (!DISPATCH_VERBS.has(verb)) process.exit(0);

  // No repo, no citation check. Allow - but SAY so, because a gate that quietly stops working
  // reads exactly like a gate that is being satisfied every time.
  if (!REPO) {
    record({ verb, outcome: 'inert', why: 'no repo resolved' });
    process.stdout.write(JSON.stringify({
      systemMessage: 'dispatch-gate is INERT: could not resolve the repo (set FERRY_REPO, or room_path in ~/.consonance.json). Dispatches are NOT being checked for citations.',
    }));
    process.exit(0);
  }

  const text = payload.tool_input && payload.tool_input.text;
  const exists = (p) => { try { return fs.existsSync(path.join(REPO, p)); } catch (_) { return false; } };
  const shaOk = (s) => {
    try {
      execFileSync('git', ['cat-file', '-t', s], {
        cwd: REPO, encoding: 'utf8', timeout: 4000, stdio: ['ignore', 'pipe', 'ignore'],
      });
      return true;
    } catch (_) { return false; }
  };

  const cited = findCitation(text, exists, shaOk);
  if (cited) {
    record({ verb, outcome: 'allowed', cited, chars: (text || '').length });
    process.exit(0);
  }

  record({ verb, outcome: 'asked', cited: null, chars: (text || '').length });

  const question = buildQuestion(verb, isDirty());
  process.stdout.write(JSON.stringify({
    // Survives bypass mode, where permissionDecision does not. Deliberately the same words: two
    // channels, one question, so nothing is softened on the path that still reaches a reader.
    systemMessage: 'UNCITED DISPATCH — ' + question,
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: question,
    },
  }));
  process.exit(0);
}

if (require.main === module) {
  try { main(); } catch (_) { process.exit(0); } // fail OPEN, without exception
}

module.exports = { findCitation, buildQuestion, DISPATCH_VERBS };
