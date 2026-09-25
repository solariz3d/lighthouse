#!/usr/bin/env node
'use strict';
// close.js — the last act before the lid shuts, and the first one allowed to say "closed".
// P-CLOSE-PUSH (L054), pane A, 2026-09-09.
//
//   node consonance/tools/close.js            # prepare, gate, publish, and PROVE it landed
//   node consonance/tools/close.js --check    # every check, no commit, no push, nothing published
//
// Exit 0 = CLOSED. Exit 1 = NOT CLOSED, with the reason named. Exit 2 = nothing to close against
// (no corpus, no state tree) — a configuration answer, not a state answer.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────
// WHAT THIS IS FOR, AND WHY IT IS A REFUSAL RATHER THAN A PUSH.
//
// A close command that pushes is four lines. The thing worth building is the one that will not
// say "closed" when the push did not land or the privacy check did not run — because that exact
// sentence is what went wrong here at 04:33 and again at 04:40 tonight: a reading taken at 04:05
// was reported as current, and "I re-checked" was written into a ring when no check had run.
// Automate that sentence and it runs every night while the keeper sleeps.
//
// So the three claims this command makes, and how each one is EARNED rather than asserted:
//
//   "the state is prepared"  — not from an exit code. `state-sync --push` returns 0 from four
//                              different places and 1 from eight, of which exactly one is worth
//                              retrying. It now leaves a RECEIPT naming the outcome, and the
//                              receipt is only accepted if its run id carries the pid of the
//                              child THIS process spawned. A reading is not a state.
//
//   "the remote is private"  — not from a printed line. state-sync PRINTS `privacy verified here`
//                              on its own push path; printing is not gating, and this command
//                              does not read that print. It runs the check ITSELF, before
//                              anything is published, and a non-private or unknown answer stops
//                              the close with nothing sent.
//
//   "the push landed"        — not from git's exit code. After the push, the REMOTE is asked what
//                              it holds (`ls-remote`), and its answer must equal this machine's
//                              HEAD. A push that reports success over a remote that did not move
//                              is the failure this whole file exists to refuse.
//
// WHY IT PREPARES WITH `--no-remote` AND PUBLISHES ITSELF. The publish is the one step that must
// be gated, so the gate and the publish are held by the same hand. state-sync commits the state
// set (with its settle gate intact) and stops; this command runs the privacy check and then does
// the push and the proof. It also means the whole path is exercisable against a local remote in a
// fixture, with no part of the gate stubbed out to make a test pass.
//
// THE QUIET CLOSE AND THE FAILED ONE ARE SEPARABLE, and the packet was right to ask. A close where
// nothing changed is legitimate and must not read as failure; a command that called every quiet
// close a success would swallow a real one. They are told apart by asking the remote, not by
// asking whether a commit was made: NOTHING CHANGED plus `remote == HEAD` is a real close, and
// NOTHING CHANGED plus `remote != HEAD` is a machine whose state never left — which is precisely
// the case state-sync's own `--push` exits 0 on, because that path never consults the remote at
// all. This command publishes in that case and then proves it.
//
// THE TORN TAIL. The captures are REWRITTEN (`fs::write`, truncate-then-write), and at close they
// matter more than anywhere else: the pushed set becomes the record the other machine wakes from.
// A set that is whole except for one capture reads as finished and wakes a seat from half a file.
// So an unsettled path is DEFERRED, said out loud, and retried once — and if it still will not
// settle, the close is refused BY NAME rather than published torn.
//
// WHAT IT DOES NOT DO. It does not touch the record repository (`C:\Consonance\lighthouse`) and
// commits nothing there. It does not push anything a seat wrote without a human running it: this
// is a command the keeper types before shutting the lid, which is the room's rule about publishing
// outward (`journal/2026-07-28.md:189`) kept rather than automated away.
// ─────────────────────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const sync = require('./state-sync.js');

const SYNC = path.join(__dirname, 'state-sync.js');

/**
 * How long to wait before the one retry of a DEFERRED set.
 *
 * Not a round number picked for looking calm. `stableRead` already spends up to STABLE_TRIES(8)
 * attempts with a SETTLE_MS(150) window, so a refused path has already been watched for roughly a
 * second; the harvest loop that rewrites the captures polls every 250 ms. A second window of the
 * same order therefore spans several poll cycles — long enough for a pane that is between turns to
 * go quiet, short enough that a keeper standing over the laptop does not think it hung. If a path
 * is being rewritten continuously, no wait helps and the refusal is the right answer.
 */
const RETRY_WAIT_MS = 1200;

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * The receipt, accepted only if it is about the run we just started.
 *
 * The pid is the load-bearing half: we SPAWNED the child, so its pid is a fact we hold and not a
 * claim the file makes about itself. The timestamp is the weak half and is checked too, because a
 * pid can be reused; neither alone is enough, and a receipt that fails either test is treated as
 * absent. Absent means refuse — a close that reads last night's receipt as tonight's is the same
 * defect this file was written against, one indirection down.
 */
function readReceipt(DATA, childPid, spawnedAtMs) {
  let rec;
  try { rec = JSON.parse(fs.readFileSync(path.join(DATA, sync.RECEIPT_NAME), 'utf8')); }
  catch (_) { return { rec: null, why: `no ${sync.RECEIPT_NAME} in ${DATA}` }; }
  if (!rec || typeof rec.run_id !== 'string') return { rec: null, why: 'the receipt carries no run id' };
  if (rec.pid !== childPid || !rec.run_id.startsWith(childPid + '-')) {
    return { rec: null, why: `the receipt is from pid ${rec.pid} (run ${rec.run_id}); this close spawned pid ${childPid}` };
  }
  const at = Date.parse(rec.at);
  if (!(at >= spawnedAtMs)) {
    return { rec: null, why: `the receipt is stamped ${rec.at}, before this run began` };
  }
  return { rec, why: null };
}

/** Ask the REMOTE what it holds. Never inferred from a push's exit code. */
function remoteHead(STATE, branch) {
  const r = sync.gitTry(STATE, ['ls-remote', 'origin', `refs/heads/${branch}`]);
  if (!r.ok) return { ok: false, sha: null, err: r.err };
  const line = r.out.split('\n').map((s) => s.trim()).filter(Boolean)[0];
  if (!line) return { ok: true, sha: null };            // the branch does not exist there yet
  return { ok: true, sha: line.split(/\s+/)[0] };
}

const short = (sha) => (sha ? String(sha).slice(0, 7) : 'nothing');

/**
 * The close.
 *
 * `privacy` is injectable ONLY so a fixture can exercise the publish path without a GitHub repo
 * and a `gh` login. The CLI never passes it, there is no flag and no environment variable for it,
 * and the default is the real check — a test seam, never a way to turn the gate off in the field.
 */
function runClose(o) {
  o = o || {};
  const out = o.out || ((s) => console.log(s));
  const errOut = o.err || ((s) => console.error(s));
  const privacy = o.privacy || sync.remotePrivacy;
  const checkOnly = !!o.checkOnly;
  const retryWaitMs = o.retryWaitMs === undefined ? RETRY_WAIT_MS : o.retryWaitMs;
  const DATA = o.data || sync.dataDir();
  // THE STATE DIR IS RESOLVED, NEVER ASSUMED (L065; E's L062 R-C1 §4 step 3). This line was
  // `o.state || sync.stateDir()` and went straight to `path.join(STATE, '.git')`, so a stateDir() that returns
  // nothing threw `TypeError: The "path" argument must be of type string`, and one that throws escaped runClose.
  // Both become reachable when stateDir() stops falling back to one machine's literal (state-sync.js:141). The throw
  // is caught ONLY to be printed: its message rides in the refusal below, so nothing is swallowed.
  let STATE = o.state || null, stateWhy = null;
  if (!STATE) {
    try { STATE = sync.stateDir() || null; } catch (e) { stateWhy = e && e.message ? e.message : String(e); }
    if (STATE != null) STATE = String(STATE).trim() || null;
  }

  const no = (why, detail, code) => {
    errOut('');
    errOut(`NOT CLOSED — ${why}`);
    for (const d of [].concat(detail || [])) errOut('  ' + d);
    return { closed: false, why, code: code === undefined ? 1 : code };
  };

  if (!DATA) return no('no corpus declared', ['CONSONANCE_DATA is unset and ~/.consonance.json has no data_dir.'], 2);
  if (!fs.existsSync(DATA)) return no(`the data dir does not exist: ${DATA}`, [], 2);
  // Names what THIS tool reads (state-sync.js stateDir(): CONSONANCE_STATE, then state_dir). Since L069 every state
  // tool reads that one name; CONSONANCE_STATE_REPO is retired, so it must never be printed as a recovery.
  if (!STATE) {
    return no('no state repo declared', [
      'Set state_dir in ~/.consonance.json, or set CONSONANCE_STATE. Nothing was prepared and nothing was sent.',
    ].concat(stateWhy ? [`stateDir() said: ${stateWhy}`] : []), 2);
  }
  if (!fs.existsSync(path.join(STATE, '.git'))) {
    return no(`the state tree is not a git repository: ${STATE}`,
      ['Clone it first, or set state_dir in ~/.consonance.json. Nothing was prepared and nothing was sent.'], 2);
  }

  // `symbolic-ref`, not `rev-parse --abbrev-ref`: on a freshly cloned EMPTY state repo the branch
  // is UNBORN and rev-parse fails outright, which read as "not on a branch" and refused a close
  // that was perfectly well-formed. symbolic-ref answers for a branch with no commits yet and
  // fails only when HEAD really is detached, which is the case this refusal is for.
  const br = sync.gitTry(STATE, ['symbolic-ref', '--short', 'HEAD']);
  if (!br.ok || !br.out) {
    return no('the state tree is not on a branch (detached HEAD)', [`git symbolic-ref --short HEAD said: ${br.err || br.out}`]);
  }
  const branch = br.out;

  out(`consonance close · ${sync.machineTag()} · ${DATA} -> ${STATE}${checkOnly ? '  [--check: nothing will be published]' : ''}`);

  // ── 1 · prepare the state set, and read what actually happened ──
  const childEnv = { ...process.env, ...(o.env || {}) };
  const syncArgs = checkOnly ? ['--push', '--dry-run'] : ['--push', '--no-remote'];
  const ok = checkOnly ? ['DRY_RUN'] : ['LOCAL_ONLY', 'NOTHING_CHANGED'];

  let rec = null, child = null, retried = false;
  for (let pass = 1; pass <= 2; pass++) {
    const t0 = Date.now() - 1000;   // one second of slack for a coarse filesystem clock
    child = spawnSync(process.execPath, [SYNC, ...syncArgs], { env: childEnv, encoding: 'utf8' });
    if (child.error) return no('state-sync could not be started', [String(child.error.message)]);
    const r = readReceipt(DATA, child.pid, t0);
    if (!r.rec) {
      return no('state-sync left no receipt for this run, so what it did is unknown',
        [r.why,
         `state-sync exited ${child.status}. Its own words follow, unread by this command:`,
         ...String((child.stderr || '') + (child.stdout || '')).split('\n').filter(Boolean).map((l) => '    ' + l)]);
    }
    rec = r.rec;
    if (rec.outcome !== 'DEFERRED_UNSETTLED') break;

    // DEFERRED — the app is rewriting a file right now. Say so, wait, and try once more.
    const paths = (rec.paths || []).join(', ');
    out(`  DEFERRED: ${(rec.paths || []).length} path(s) are being rewritten right now — ${paths}`);
    if (pass === 2) break;
    out(`  waiting ${retryWaitMs} ms and retrying once. The state moves BETWEEN writes, not during one.`);
    retried = true;
    sleepSync(retryWaitMs);
  }

  if (rec.outcome === 'DEFERRED_UNSETTLED') {
    return no('a path would not settle, so the set would have travelled torn',
      [`still being rewritten after ${retried ? 'two passes' : 'one pass'}: ${(rec.paths || []).join(', ')}`,
       'These are REWRITTEN files (truncate-then-write). A torn capture is a seat that wakes as a',
       'stranger, and it is indistinguishable from a good one at the far end. Nothing was published.',
       'Let the panes finish a turn and run this again.']);
  }
  if (!ok.includes(rec.outcome)) {
    return no(`the state set was not prepared: ${rec.outcome}`,
      [rec.why ? String(rec.why) : `state-sync exited ${rec.rc}`,
       ...(rec.paths ? rec.paths.map((p) => '    ' + p) : []),
       'Nothing was published.']);
  }
  const size = `${rec.files} files · ${(rec.bytes / 1048576).toFixed(1)} MB`;
  const prepared =
    rec.outcome === 'NOTHING_CHANGED' ? `nothing changed · ${size} · HEAD ${rec.head || '?'}`
      : rec.outcome === 'DRY_RUN' ? `rehearsed · ${size} · nothing committed`
        : `${rec.outcome} · ${size} · committed ${rec.head || '?'}`;
  out(`  state prepared: ${prepared}${retried ? ' (after one deferred retry)' : ''}`);

  // ── 2 · the privacy gate, run HERE and before anything leaves ──
  const priv = privacy(STATE);
  if (priv.state !== 'private') {
    return no(`the destination is not confirmed private: ${priv.repo || 'the remote'} reads ${priv.state}`,
      [priv.why,
       'The state set is committed locally and is safe; NOTHING WAS PUSHED.',
       `Confirm with:  gh repo view ${priv.repo || '<owner/repo>'} --json isPrivate`,
       'Failing closed is deliberate. From here a private repo and a repo nobody could ask about',
       'read identically, and this one carries the board.']);
  }
  out(`  privacy verified here: ${priv.repo} ${priv.why}`);

  // ── 3 · what this machine holds, and what the remote holds ──
  const localR = sync.gitTry(STATE, ['rev-parse', 'HEAD']);
  if (!localR.ok && checkOnly) {
    // --check makes no commit, so on a tree that has never been pushed to there is no HEAD to
    // compare. That is not a failure of the check; it is the answer.
    out(`  would publish: the first commit on ${branch} — this state tree has no commit yet`);
    return finish(out, DATA, STATE, checkOnly,
      'CHECK ONLY — every gate passed and NOTHING WAS PUBLISHED. Run without --check to close.');
  }
  if (!localR.ok) return no('the state tree has no HEAD to publish', [localR.err]);
  const local = localR.out;
  const before = remoteHead(STATE, branch);
  if (!before.ok) {
    return no('the remote could not be read, so a close cannot be told from a failure',
      [`git ls-remote origin refs/heads/${branch} failed: ${before.err}`,
       'Nothing was published. Offline, or the push address is disarmed — check `git -C ' + STATE + ' remote -v`.']);
  }

  if (before.sha === local) {
    if (checkOnly) {
      // SAY WHAT THIS DID NOT ESTABLISH. A rehearsal makes no commit, so "the remote already holds
      // HEAD" is a fact about the tree as it stands and NOT a claim that a real close would have
      // nothing to add. Letting --check print the quiet-close sentence would be this command
      // telling the keeper it is finished when it has not done the thing that finishes it.
      out(`  the remote already holds this tree's HEAD (${short(local)}).`);
      out('  --check makes no commit, so it cannot say whether a real close would create a new one.');
      return finish(out, DATA, STATE, checkOnly,
        'CHECK ONLY — every gate passed and NOTHING WAS PUBLISHED. Run without --check to close.');
    }
    out(`  nothing to publish: the remote is already at ${short(local)}`);
    return finish(out, DATA, STATE, checkOnly,
      `CLOSED — nothing changed and the remote already holds this machine's state (${short(local)}).`);
  }

  if (checkOnly) {
    out(`  would publish: ${branch} ${short(local)} -> origin (remote is at ${short(before.sha)})`);
    return finish(out, DATA, STATE, checkOnly,
      `CHECK ONLY — every gate passed and NOTHING WAS PUBLISHED. Run without --check to close.`);
  }

  // ── 4 · publish ──
  const push = sync.gitTry(STATE, ['push', 'origin', `${branch}:${branch}`]);
  if (!push.ok) {
    return no('the push failed, so this machine\'s state is not on the remote',
      [`git push origin ${branch} said:`,
       ...String(push.err).split('\n').filter(Boolean).map((l) => '    ' + l),
       `The commit stands locally at ${short(local)}; the remote is still at ${short(before.sha)}.`,
       'If git says the remote contains work this machine does not have, the OTHER machine closed',
       'since this one pulled: run `state-sync.js --pull` first, then this again.',
       'Nothing about this close is finished.']);
  }
  out(`  published: ${branch} ${short(local)} -> origin (was ${short(before.sha)})`);

  // ── 5 · the proof, from the remote and not from the push ──
  const after = remoteHead(STATE, branch);
  if (!after.ok) {
    return no('the push reported success and the remote could not be re-read to confirm it',
      [`git ls-remote origin refs/heads/${branch} failed: ${after.err}`,
       'An unconfirmed push is exactly the sentence this command exists not to print.']);
  }
  if (after.sha !== local) {
    return no('the push reported success and the remote did not move',
      [`this machine is at ${short(local)}; the remote still says ${short(after.sha)}.`,
       'Believe the remote. A hook, a protected branch or a second writer can accept a push and',
       'leave the ref where it was.']);
  }
  out(`  remote confirms: refs/heads/${branch} = ${short(after.sha)}   (asked the remote, not the push)`);

  return finish(out, DATA, STATE, checkOnly,
    `CLOSED — the state on this machine is on the remote at ${short(local)}.`);
}

function finish(out, DATA, STATE, checkOnly, line) {
  if (!checkOnly) { try { sync.writeStatus(DATA, STATE); } catch (_) { /* a status file is not worth failing a close over */ } }
  const heads = sync.machineHeads(STATE);
  const head = sync.gitTry(STATE, ['rev-parse', '--short', 'HEAD']);
  out('  ' + syncLine(heads, head.ok ? head.out : null));
  out(line);
  return { closed: true, why: line, code: 0 };
}

/**
 * D133 — this line printed `in sync:` over ANY pair of machine heads (it was :319-321), the same false green D132 found in
 * the pulse: after D's close D is at the head and L need not be, and the line still said "in sync". With the state `head`
 * known, a machine whose last push is not the head is BEHIND, and is named; every machine at the head keeps the old words.
 * With no head known (a state tree with no commit yet) it cannot say who is behind, so it prints the old list.
 */
function syncLine(heads, head) {
  if (!heads.length) return 'in sync: no machine has pushed yet';
  if (!head || heads.every((m) => m.commit === head)) return 'in sync: ' + heads.map((m) => `${m.machine} ${m.commit || 'never'}`).join(' · ');
  return 'NOT in sync: ' + heads.map((m) => (!m.commit ? `${m.machine} never pushed`
    : m.commit === head ? `${m.machine} ${m.commit} (head)` : `${m.machine} behind — last pushed ${m.commit}`)).join(' · ');
}

function main() {
  const args = process.argv.slice(2);
  const unknown = args.filter((a) => !['--check'].includes(a));
  if (unknown.length) {
    console.error(`close.js: unknown argument(s): ${unknown.join(' ')}`);
    console.error('usage: close.js [--check]');
    process.exit(2);
  }
  const r = runClose({ checkOnly: args.includes('--check') });
  process.exit(r.code);
}

if (require.main === module) main();
module.exports = { runClose, readReceipt, remoteHead, syncLine, RETRY_WAIT_MS };
