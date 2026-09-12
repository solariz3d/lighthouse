#!/usr/bin/env node
'use strict';
// place-conversations.js — put each pane's real conversation where the app will resume it.
// P-PLACE (D060), pane A, 2026-09-12.
//
//   node dev/place-conversations.js --dry-run          # prints the whole plan, touches NOTHING
//   node dev/place-conversations.js                    # does it, with the app closed
//   node dev/place-conversations.js --pane <sid> ...   # only these panes (repeatable)
//
// Exit 0 = every selected pane placed and verified. Exit 1 = REFUSED or a verification failed —
// and a refusal happens BEFORE anything is written, never halfway. Exit 2 = nothing to place
// against (no roster, no projects dir): a configuration answer, not a state answer.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────
// WHAT THIS MOVES, AND WHY IT IS COPY-FIRST.
//
// Four panes' real conversations have been sitting in ~/.claude/projects/C--Users-nname since the
// 09-09 rehoming put them there — born in the wrong cwd, so the vendor filed them under the home
// directory's slug instead of each pane's own. The vendor finds a session by PROJECT-DIR SLUG +
// SESSION ID, so a conversation in the wrong slug is invisible to the pane whose conversation it
// is. Placing a copy under the right slug is what makes `--resume` find it.
//
// The keeper decided the shape on 2026-09-11 (`loop/keeper_decisions_2026-09-11.md` §3, his
// words): *"copy first, keep the originals untouched, then place each pane's conversation in its
// own folder."* So: the originals are read and never written, their sha256 is taken before and
// after, and the run fails if either differs. Nothing here deletes anything, ever.
//
// WHY IT IS ONLY WORTH RUNNING NOW. Until 2026-09-12 02:03 `resume_pane` never passed `--resume`,
// so a placed conversation would have sat unread — 232 of 232 rows in `data/persist.log` read
// `-> fresh`. E's D059 landed that (`handback/p1b-resume-the-conversation_2026-09-12.md`) and the
// 02:03 launch proved it in production: `resume pane=a2122153… jsonl_existed=true -> RESUMED`.
//
// THE PREMISE, MEASURED RATHER THAN ASSUMED (this packet's §9). These transcripts record a cwd of
// `C:\Users\nname` in every record. Nobody had checked whether the vendor refuses to resume a
// transcript whose recorded cwd is not the cwd you resume from — and if it did, this whole
// command would be theatre. Measured on 2.1.269 with `ptyprobe resume <cwd> <sid>` (E's harness,
// the app's own spawn path), three arms in ONE scratch project dir so the only variable is the
// recorded cwd:
//
//   foreign cwd in every record    alive past 20 s, the PRIOR TURNS rendered on screen
//   cwd rewritten to match (ctrl)  alive past 20 s, the same prior turns
//   sid with no file (neg ctrl)    the vendor refused
//
// The recorded cwd is not consulted. The slug and the id are what the vendor keys on, which is
// exactly what this command changes.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────
// FIVE REFUSALS, each from something that has actually gone wrong here.
//
//   THE APP IS RUNNING       A live pane holds its own transcript open and appends to it. Placing
//                            under one is the one way to lose a turn, and the file you sha256'd a
//                            second ago is already a different file. Checked first, before a
//                            single stat.
//
//   A SOURCE IS MISSING      Refused for the WHOLE run, in the plan phase, before any pane is
//                            written. A half-done placement is worse than none: the launch table
//                            printed at the end would describe a machine nobody built.
//
//   A SOURCE WILL NOT SETTLE `state-sync`'s quiescence gate, reused rather than rediscovered
//                            (`stableRead`). It was built because `copyFileSync` handed the app's
//                            own writer EBUSY 57% and 23% of the time while the error was
//                            discarded (`librarian/2026-09-09.md:181`). A transcript read while
//                            something appends to it is the same hazard wearing a different name.
//
//   THE COPY DOES NOT MATCH  The copy is verified as a TEMP FILE, before any retirement and
//                            before it takes the destination name. A bad copy therefore cannot
//                            cost a seat its existing transcript — the retirement only happens
//                            once there is a good file to put in its place.
//
//   AN ORIGINAL MOVED        sha256 of every source, before and after. The keeper's decision was
//                            "keep the originals untouched"; this proves it rather than promising
//                            it.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────
// TWO THINGS THE PACKET WARNED ABOUT, AND HOW EACH IS HANDLED.
//
//   THE UNIT IS THE SID, NEVER THE DIRECTORY. A pane's slug can hold transcripts that are not the
//   pane's — C's holds two 525 KB scratch sessions from its own 09-11 lab work. Nothing in this
//   file ever lists a directory to decide what to move, retire, or count. Every path is built
//   from `<slug>/<sid>.jsonl` and nothing else.
//
//   WHETHER A RETIREMENT HAPPENS IS READ AT RUN TIME, NEVER ASSUMED. On 2026-09-12 02:05 three of
//   the four panes had no `<sid>.jsonl` of their own and would have retired nothing. By 02:09 two
//   of them did — A and E had each taken a turn. A table of what is on disk is stale the moment a
//   pane speaks, so this command asks the disk at the moment it runs and says what it found.
//
// THE STAMPED RETIREMENT, and why it is not `.jsonl.orphaned`. `main.rs:835-836` is the scar: a
// FIXED archive name overwrote a seat's history, because the second retirement landed on the first
// one's file. So the retired path carries a UTC stamp and, if that path somehow exists, a counter
// — it is not possible for this command to write over a retired transcript. It keeps the app's own
// `.jsonl.<something>` shape rather than ending in `.jsonl`, so the retired file stays invisible
// to the vendor's session list in that same project dir; E's slug already holds a
// `.jsonl.orphaned` from 06:29 today, and a second retirement under that exact name would have
// destroyed it.
// ─────────────────────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const sync = require('../consonance/tools/state-sync.js');

/**
 * `encode_cwd`, ported from `consonance/src-tauri/src/main.rs:2080`.
 *
 * Every non-ASCII-alphanumeric character becomes `-`. This is a SECOND COPY of a rule that lives
 * in Rust, which is how two copies of one rule drift apart — so `place-conversations.test.js`
 * reads the Rust test vectors out of main.rs and runs them against THIS function. If someone
 * changes the encoding there and not here, that test goes red rather than this command quietly
 * placing four conversations in four directories nothing will ever look in.
 */
function encodeCwd(cwd) {
  return [...String(cwd)].map((c) => (/[A-Za-z0-9]/.test(c) ? c : '-')).join('');
}

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

/** Where the vendor keeps a pane's transcript. One definition, mirroring `pane_jsonl`. */
function paneJsonl(projectsRoot, cwd, sid) {
  return path.join(projectsRoot, encodeCwd(cwd), `${sid}.jsonl`);
}

/** UTC, compact, sortable. `20260912T081500Z`. */
function stamp(now) {
  return new Date(now).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
}

/**
 * The retirement path for a transcript that is in the way.
 *
 * Stamped, and then counted if the stamped name is somehow taken. Two retirements inside the same
 * second — or a re-run of an interrupted placement — must not collide, because a collision here is
 * a seat's history overwritten by another seat's history, which is the 835-836 scar exactly.
 */
function retiredPath(dest, now, exists) {
  exists = exists || fs.existsSync;
  const base = `${dest}.retired-${stamp(now)}`;
  if (!exists(base)) return base;
  for (let n = 2; n < 1000; n++) {
    const p = `${base}-${n}`;
    if (!exists(p)) return p;
  }
  throw new Error(`cannot find an unused retirement name beside ${dest}`);
}

/** First and last record timestamps, read from the file's own bytes. Never from a stat. */
function timespan(buf) {
  const lines = String(buf).split('\n');
  let first = null, last = null, records = 0;
  for (const l of lines) {
    if (!l.trim()) continue;
    records++;
    let o;
    try { o = JSON.parse(l); } catch (_) { continue; }
    if (o && typeof o.timestamp === 'string') {
      if (first === null) first = o.timestamp;
      last = o.timestamp;
    }
  }
  return { first, last, records };
}

/** Is Consonance up? Injectable, because no test may depend on whether the keeper has it open. */
function consonanceRunning() {
  try {
    const out = execFileSync('tasklist', ['/FI', 'IMAGENAME eq consonance.exe', '/NH'], { encoding: 'utf8' });
    return /consonance\.exe/i.test(out);
  } catch (e) {
    // An unanswerable question is not a "no". If we cannot tell whether the app is up, the honest
    // reading is that we cannot certify it is down, and this command refuses on exactly that.
    return null;
  }
}

/**
 * THE PLAN PHASE — reads, decides, and can refuse. Writes nothing, ever, on any path.
 *
 * The dry run is not a different code path with the writes commented out; it is this function
 * followed by the printer, which is the only way `--dry-run` can be trusted to describe the run
 * that would actually happen.
 */
function plan(o) {
  o = o || {};
  const projectsRoot = o.projectsRoot || path.join(os.homedir(), '.claude', 'projects');
  const homeCwd = o.homeCwd || os.homedir();
  const panesPath = o.panesPath || path.join(o.data || sync.dataDir() || '', 'panes.json');
  const only = (o.only || []).filter(Boolean);

  if (!fs.existsSync(panesPath)) return { ok: false, code: 2, why: `no roster at ${panesPath}`, rows: [] };
  if (!fs.existsSync(projectsRoot)) return { ok: false, code: 2, why: `no projects dir at ${projectsRoot}`, rows: [] };

  let roster;
  try { roster = JSON.parse(fs.readFileSync(panesPath, 'utf8')); }
  catch (e) { return { ok: false, code: 2, why: `${panesPath} is not readable JSON: ${e.message}`, rows: [] }; }
  if (!Array.isArray(roster)) return { ok: false, code: 2, why: `${panesPath} is not an array of panes`, rows: [] };

  const homeSlug = encodeCwd(homeCwd);
  const rows = [];
  for (const r of roster) {
    if (!r || !r.pane || !r.cwd) continue;
    if (only.length && !only.includes(r.pane)) continue;
    const src = path.join(projectsRoot, homeSlug, `${r.pane}.jsonl`);
    const dest = paneJsonl(projectsRoot, r.cwd, r.pane);
    const row = {
      sid: r.pane, label: r.label || '', cwd: r.cwd,
      slug: encodeCwd(r.cwd), src, dest,
      srcExists: fs.existsSync(src),
      destExists: fs.existsSync(dest),
      sameFile: path.resolve(src).toLowerCase() === path.resolve(dest).toLowerCase(),
      srcBytes: null, srcSha: null, srcSpan: null,
    };
    rows.push(row);
  }

  if (only.length) {
    const missing = only.filter((s) => !rows.some((r) => r.sid === s));
    if (missing.length) return { ok: false, code: 2, why: `not in the roster: ${missing.join(', ')}`, rows };
  }
  if (!rows.length) return { ok: false, code: 2, why: `no panes selected from ${panesPath}`, rows };

  // REFUSE FOR THE WHOLE RUN, not for one pane. A missing source means the picture this command
  // was built from is wrong, and the right response to that is to stop and be looked at.
  const absent = rows.filter((r) => !r.srcExists && !r.sameFile);
  if (absent.length) {
    return {
      ok: false, code: 1, rows,
      why: 'a source conversation is missing',
      detail: absent.map((r) => `${r.sid}  expected at ${r.src}`),
    };
  }

  // Read each source through the quiescence gate and take its sha BEFORE anything is written.
  for (const r of rows) {
    if (r.sameFile) continue;
    const got = sync.stableRead(r.src);
    if (!got.buf) {
      return {
        ok: false, code: 1, rows,
        why: 'a source conversation would not settle, so it would have been copied torn',
        detail: [`${r.src} (${got.attempts} attempts${got.err ? ', ' + got.err : ''})`,
                 'Something is still writing it. Close whatever is appending and run again.'],
      };
    }
    r.srcBuf = got.buf;
    r.srcBytes = got.buf.length;
    r.srcSha = sha256(got.buf);
    r.srcSpan = timespan(got.buf);
  }

  return { ok: true, code: 0, rows, homeSlug, projectsRoot };
}

/**
 * READ THE PLACED FILE BACK AND SAY WHETHER IT IS THE CONVERSATION WE MEANT TO PLACE.
 *
 * Separate from `apply` so it can be pointed at a file that is deliberately wrong. It could not be
 * before, and the mutation pass said so: three of its comparisons could be replaced by `true` with
 * the suite still green, because by construction `apply` never produces a bad placed file and no
 * test could reach this code with one. A verification nothing can exercise is a printed reassurance.
 *
 * `okBytes` and `okSpan` are SUBSUMED by `okSha` for any real file — a differing byte count or a
 * differing first/last timestamp implies a differing hash. They are kept because the packet asks
 * for all three to be printed and because they say *how* a mismatch failed, not because they are
 * three independent gates. Said here rather than implied.
 */
function verifyPlaced(destPath, row) {
  const placed = fs.readFileSync(destPath);
  const span = timespan(placed);
  const okSha = sha256(placed) === row.srcSha;
  const okBytes = placed.length === row.srcBytes;
  const okSpan = span.first === row.srcSpan.first && span.last === row.srcSpan.last;
  return { placedBytes: placed.length, placedSha: sha256(placed), placedSpan: span, okSha, okBytes, okSpan };
}

/**
 * THE APPLY PHASE. Ordered so that a failure costs nothing that was not already replaceable:
 *
 *   1  copy to a TEMP name in the destination directory
 *   2  verify the temp by READING IT BACK — sha, bytes, first and last timestamp
 *   3  only then retire whatever holds the destination name, to a stamped path
 *   4  rename the temp into place (same volume, atomic)
 *   5  read the placed file back AGAIN, under its real name
 *   6  re-sha the ORIGINAL and require it unchanged
 *
 * Step 2 before step 3 is the whole design. A copy that went wrong must not be able to cost a seat
 * the transcript it already had.
 */
function apply(row, now) {
  const dir = path.dirname(row.dest);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = path.join(dir, `${row.sid}.jsonl.placing-${process.pid}-${stamp(now)}`);

  fs.writeFileSync(tmp, row.srcBuf);
  const back = fs.readFileSync(tmp);
  if (back.length !== row.srcBytes || sha256(back) !== row.srcSha) {
    try { fs.unlinkSync(tmp); } catch (_) {}
    return { ok: false, why: `the copy did not match its source (${back.length} B vs ${row.srcBytes} B); nothing was retired and nothing was placed` };
  }

  let retired = null;
  if (fs.existsSync(row.dest)) {
    retired = retiredPath(row.dest, now);
    fs.renameSync(row.dest, retired);
  }
  fs.renameSync(tmp, row.dest);

  const v = verifyPlaced(row.dest, row);

  const after = fs.readFileSync(row.src);
  const okSource = sha256(after) === row.srcSha && after.length === row.srcBytes;

  return Object.assign({ ok: v.okSha && v.okBytes && v.okSpan && okSource, retired, okSource }, v);
}

/** The command. */
function run(o) {
  o = o || {};
  const out = o.out || ((s) => console.log(s));
  const dryRun = !!o.dryRun;
  const now = o.now || Date.now();
  const running = o.appRunning !== undefined ? o.appRunning : consonanceRunning();
  // A test seam with a real default, named rather than buried — the same shape as `close.js`'s
  // injected privacy check. There is no flag and no environment variable for it: the CLI never
  // passes it, so there is no way to reach a different placement from a command line. It exists so
  // a test can make a placement FAIL and watch what the run does about it, which is otherwise
  // unreachable — `apply` verifies the copy before it commits to anything, by design.
  const doApply = o.apply || apply;

  const no = (why, detail, code) => {
    out('');
    out(`REFUSED — ${why}`);
    for (const d of [].concat(detail || [])) out('  ' + d);
    out('  Nothing was moved, copied, retired or deleted.');
    return { ok: false, code: code === undefined ? 1 : code, why };
  };

  out(`place-conversations · ${dryRun ? 'DRY RUN — nothing will be written' : 'LIVE'}`);

  // 0 · A LIVE RUN REQUIRES THE APP CLOSED. A live pane holds its own transcript open and appends
  //     to it; placing under one is the one way a turn gets lost, and `tasklist` failing is not a
  //     "no" — an unanswerable question cannot certify that the app is down.
  //
  //     A DRY RUN DOES NOT, and that is deliberate rather than lax. It writes nothing, so the app
  //     being up costs nothing except ACCURACY: the "retire" column and the launch table are read
  //     off a disk that live panes are still changing. Refusing here would force the keeper to
  //     close the app merely to look at the plan, which makes the rehearsal step expensive enough
  //     to skip. So it runs and says out loud that its reading is already going stale — the room's
  //     recurring failure is a reading reported as a state, and the fix for that is to LABEL it,
  //     not to withhold it.
  if (!dryRun) {
    if (running === null) {
      return no('cannot tell whether Consonance is running', ['`tasklist` could not be run, so "the app is closed" cannot be certified.']);
    }
    if (running) {
      return no('Consonance is running', [
        'A live pane holds its own transcript open and appends to it. Close the app and run again.',
        'This is the one way a placement can lose a turn.',
        'A DRY RUN does not need the app closed: node dev/place-conversations.js --dry-run',
      ]);
    }
  } else if (running !== false) {
    out('');
    out(running === null
      ? '  NOTE — could not tell whether Consonance is running, so treat the rows below as a reading, not a state.'
      : '  NOTE — CONSONANCE IS RUNNING. Nothing here will be written, but a live pane writes its own');
    if (running) {
      out('         transcript as it takes turns, so the "retire" column and the launch table below are');
      out('         a reading taken just now, not a state that will hold. A live run refuses outright.');
    }
  }

  const p = plan(o);
  if (!p.ok) return no(p.why, p.detail, p.code);

  // 1 · the plan, printed in full whether or not anything will be written.
  out('');
  out(`roster: ${p.rows.length} pane(s) · projects root ${p.projectsRoot}`);
  for (const r of p.rows) {
    out('');
    out(`  ${r.sid}  ${r.label}`);
    out(`    cwd    ${r.cwd}`);
    out(`    slug   ${r.slug}`);
    if (r.sameFile) { out('    SKIP   its cwd IS the home directory; the conversation is already where the app looks.'); continue; }
    out(`    from   ${r.src}`);
    out(`           ${r.srcBytes} B · ${r.srcSpan.records} records · ${r.srcSpan.first} → ${r.srcSpan.last}`);
    out(`           sha256 ${r.srcSha}`);
    out(`    to     ${r.dest}`);
    out(`    retire ${r.destExists ? 'YES — a transcript already holds that name; it goes to a stamped path, never deleted' : 'nothing — no transcript of its own is in the way'}`);
  }

  // 2 · apply, or not.
  const results = [];
  if (!dryRun) {
    for (const r of p.rows) {
      if (r.sameFile) continue;
      const res = doApply(r, now);
      results.push({ r, res });
      out('');
      if (!res.ok && res.why) { out(`  ${r.sid}  FAILED — ${res.why}`); continue; }
      if (res.retired) out(`  ${r.sid}  retired  ${res.retired}`);
      out(`  ${r.sid}  placed   ${r.dest}`);
      out(`           bytes  ${res.placedBytes}  ${res.okBytes ? 'MATCHES source' : 'DIFFERS FROM SOURCE'}`);
      out(`           sha256 ${res.placedSha}  ${res.okSha ? 'MATCHES source' : 'DIFFERS FROM SOURCE'}`);
      out(`           span   ${res.placedSpan.first} → ${res.placedSpan.last}  ${res.okSpan ? 'MATCHES source' : 'DIFFERS FROM SOURCE'}`);
      out(`           source ${res.okSource ? 'byte-identical after the copy' : 'CHANGED — the original did not survive untouched'}`);
    }
  }

  // 3 · what a launch will do, derived exactly as `plan_resume` derives it: does
  //     <slug>/<sid>.jsonl exist. In a dry run this is the state BEFORE the placement, and says so.
  out('');
  out(dryRun ? 'what a launch would do RIGHT NOW (this is the state before any placement):'
             : 'what the next launch will do:');
  for (const r of p.rows) {
    const exists = fs.existsSync(r.dest);
    out(`  ${r.sid}  ${exists ? 'RESUME' : 'fresh '}  ${r.dest}`);
  }
  if (dryRun) {
    out('');
    out('  After a live run every row above reads RESUME. Nothing was written by this dry run.');
  }

  const bad = results.filter((x) => !x.res.ok);
  if (bad.length) {
    out('');
    out(`${bad.length} pane(s) did not verify. Look before running again.`);
    return { ok: false, code: 1, why: 'a placement did not verify', rows: p.rows, results };
  }
  return { ok: true, code: 0, rows: p.rows, results };
}

function main(argv) {
  const only = [];
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run' || a === '-DryRun') dryRun = true;
    else if (a === '--pane' || a === '-Pane') only.push(argv[++i]);
    else if (a === '--help' || a === '-h') {
      console.log('node dev/place-conversations.js [--dry-run] [--pane <sid>]...');
      return 0;
    } else {
      console.error(`unknown argument: ${a}`);
      return 2;
    }
  }
  const r = run({ dryRun, only });
  return r.code;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = { encodeCwd, paneJsonl, stamp, retiredPath, timespan, plan, verifyPlaced, apply, run, main, consonanceRunning, sha256 };
