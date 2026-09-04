#!/usr/bin/env node
// commit-gate.js — a commit that would capture another seat's in-flight file is REFUSED here.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// THE INCIDENT, 2026-09-02, and it is the chair's.
//
//   e6215a8  06:52:19  "L033: two more packets so four seats are working"
//              committed  consonance/src-tauri/src/main.rs        +120   A, mid-lap
//                         consonance/ui/chain-indicator.js         +56   E, mid-lap
//                         consonance/ui/chain-indicator.test.js   +116   E, mid-lap
//   bbac990  06:53:43  "L033 row: the handback counter is untrustworthy this lap"
//              committed  exo_memory/map/A.md                       +2   A, mid-lap
//
// `git add -A` with four panes live in one checkout. What landed happened to be correct, and A's
// hand-back named that exactly: "correct, and that is luck, not a control." A had two mutants and
// a restored-HEAD main.rs cycling through that file during the lap; a commit ninety seconds either
// side would have recorded a MUTANT as the fix — and the literalised-tier mutant is the one the
// Rust suite does not catch (portable-paths.js catches it), so the suite would have been GREEN
// over a committed mutant.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// WHY A RULE WAS NOT ENOUGH, WHICH IS THE ONLY REASON THIS FILE EXISTS.
//
// c2afec6's own commit message says "Named paths, no git add -A". The chair QUOTED that line in a
// packet the night before, and then ran `git add -A` twice inside 84 seconds. A rule that its
// violator can recite is not a control. The same lesson was recorded once already tonight, in a
// different shape: main.rs truncated to 0 bytes by a different command than the one warned about
// — "a named landmine does not generalise; a backup does."
//
// AND THE LIBRARIAN'S 08-26 FALSIFIER FIRED WITH THE WRONG REMEDY ATTACHED. It prescribed
// reinstating SEAT-ROUTING (only the chair commits). The capturing seat WAS the chair, so routing
// cannot constrain it. The missing rule is RELEASE:
//
//     A file is committed only by the seat that HOLDS it, or by the chair AFTER that seat's
//     hand-back is filed. THE HAND-BACK IS THE RELEASE. Until then a pane's in-flight file is
//     off-limits EVEN WHEN THE COMMITTER NAMES THE PATH — `git add <path>` on someone's live file
//     is the same capture with better manners.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// WHERE OWNERSHIP COMES FROM — derived from artifacts that already exist, never hardcoded.
//
//   data/lap.jsonl        the lap id and whether it is DISPATCHED, from the newest `chain` row.
//   exo_memory/loop/packet_*.md   a packet naming the current lap is a live dispatch. Parsed for
//                         its addressee (NATO callsign -> letter), the paths under its
//                         `WHAT YOU OWN` block, and the hand-back path it demands.
//   exo_memory/handback/*.md      a hand-back FILED AND NEWER THAN THE DISPATCH releases the
//                         paths its packet owned. Freshness is the whole point: a hand-back from
//                         last lap must not release a file that is in flight in this one.
//
// It does NOT read the board. The board's dispatch rows are prose ("chair injected -> <paneid>")
// and would need four hops of parsing to reach a path; the packet already states ownership in a
// block written to be read. That makes the packets' `WHAT YOU OWN` section LOAD-BEARING, which is
// this tool's largest limitation and is stated in the report rather than buried here.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// THE ASYMMETRY, chosen deliberately and worth arguing with.
//
//   UNREADABLE STATE fails CLOSED.   Lap dispatched but no packet parses? Refuse everything.
//   AN UNCLAIMED PATH is ALLOWED.    No packet names it -> the commit proceeds.
//
// The second half is not laziness, it is bar 5: the chair must be able to land a packet or a
// ledger row in one step, and those are exactly the files no pane owns. Failing closed on unowned
// paths deadlocks the chair on the night it is installed, and a gate nobody can ship past is
// disabled before morning — then there is neither. THE COST IS REAL AND IS NOT HIDDEN: this gate
// is exactly as complete as the ownership blocks in the packets. A path a packet forgot to claim
// is a path this tool will hand over.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// IT IS NOT A CONTROL AGAINST INTENT, AND SAYING OTHERWISE WOULD BE THE THEATRE THE PACKET
// ASKED ABOUT. `git commit --no-verify` steps over it, and the seat that must not commit is the
// seat that can disable it. What it IS a control against is the REFLEX — `git add -A` typed while
// thinking about something else, which is the failure that actually happened, twice, in 84
// seconds, by a seat that could recite the rule. Stopping a reflex with a refusal that names the
// holder is the whole product. The structural fix — one checkout per seat — is named in the
// hand-back and is not this file.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

// ── WHERE THE LEDGER IS — resolved, and LOUD when it cannot be ────────────────────────────
//
// This shipped with `path.resolve(arg('--data', 'C:/Consonance/data'))`, which portable-paths
// flagged DRIVE/REVIEW on its first run over this file. It was a real defect and it was in the
// worst possible place: **a gate that resolves to one machine's data dir reads no ledger on the
// second machine, finds no lap, and therefore ALLOWS EVERY COMMIT** — silently, wearing the same
// green as a gate that checked and approved. That is the silent-absence failure this tool's own
// §7 was written about, installed inside the tool that exists to stop things being hidden. It was
// not baselined.
//
// Shape taken from the peer hooks (`consonance/hooks/transcript-watch.js` dataDir()): env
// override, then `~/.consonance.json`. **The last tier is where this deliberately differs from
// them.** They fall back to a literal default, which is right for a watcher — a watcher that
// guesses wrong writes state to the wrong place and someone notices. A GATE that guesses wrong
// waves commits through and nobody notices, so there is no default here: unresolved returns null
// and the caller refuses. Degrade loudly means degrade to REFUSE.
function resolveDataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '');
    const v = JSON.parse(raw);
    const d = v && v.data_dir != null ? String(v.data_dir).trim() : '';
    if (d) return d;
  } catch (e) { /* no config is a legitimate state; the caller says so out loud */ }
  return null;
}

// The callsigns the room actually uses on its panes, mapped to the letters letters.json assigns.
// Kept here rather than read from letters.json because letters.json maps SESSION IDS to letters
// and carries no callsign at all — the packet addresses a name, and this is the only place the
// two meet.
const NATO = {
  ALPHA: 'A', BRAVO: 'B', CHARLIE: 'C', DELTA: 'D', ECHO: 'E', FOXTROT: 'F', GOLF: 'G',
  HOTEL: 'H', INDIA: 'I', JULIETT: 'J', JULIET: 'J', KILO: 'K', LIMA: 'L', MIKE: 'M',
};

// ── the lap, from the ledger ──────────────────────────────────────────────────────────────
//
// `open` is the newest `chain` row saying `dispatched`; `dispatchedAt` is the newest dispatch
// timestamp FOR THAT LAP, because a lap can dispatch more than once (L033 dispatched three times)
// and the freshness bar has to move with the latest one.
function lapState(dataDir) {
  const file = path.join(dataDir, 'lap.jsonl');
  let rows;
  try {
    rows = fs.readFileSync(file, 'utf8').trim().split('\n')
      .map((l) => { try { return JSON.parse(l); } catch (e) { return null; } })
      .filter(Boolean);
  } catch (e) {
    return { readable: false, open: false, lap: null, dispatchedAt: null, why: `lap.jsonl unreadable at ${file}` };
  }
  const chain = rows.filter((r) => r.stage === 'chain');
  const last = chain[chain.length - 1];
  if (!last) return { readable: true, open: false, lap: null, dispatchedAt: null, why: 'no chain row in lap.jsonl' };
  const dispatched = chain.filter((r) => r.lap === last.lap && r.chain === 'dispatched');
  return {
    readable: true,
    open: last.chain === 'dispatched',
    lap: last.lap || null,
    dispatchedAt: dispatched.length ? dispatched[dispatched.length - 1].at : null,
    why: null,
  };
}

// ── one packet, parsed ────────────────────────────────────────────────────────────────────
//
// Three things, all of them already written in every packet this room has produced:
//   letter    the addressee. "To ALPHA" / "**To BRAVO," — the callsign, not the letter, because
//             that is what packets say.
//   owned     the indented path lines under a `WHAT YOU OWN` HEADING. A trailing `/` means a
//             directory and matches by prefix. Anything after the path (a `(note)`, an arrow) is
//             discarded; the block ends at the first line that starts in column zero.
//   handback  the hand-back path the packet demands, which is the release token.
//   why       null when the block parsed; otherwise WHY it did not. See THE DIAGNOSTIC below.
//
// THE ANCHOR IS A HEADING, NOT A MENTION (2026-09-04, landing L's proof from
// `handback/p-live-red_2026-09-03.md` §2b). This read `/WHAT YOU OWN/i` and took the FIRST match.
// `e8ee98d` prepended a PARKED notice to `exo_memory/loop/packet_watcher_liveness_2026-09-02.md`
// that QUOTES the phrase inside a blockquote at line 12; line 13 starts with `>`, which is column
// zero, so the block ended before it began and the real block at :118 was never read. Owned paths
// parsed to ZERO, this file hit its own "a live packet that claims no paths is a parse failure"
// branch, and REFUSED EVERY PATH IN THE LAP with holder `null`. Red 27 hours, then two more laps.
//
// VERIFIED AGAINST HEAD BEFORE LANDING, because a two-lap-old repair is a claim about a tree that
// has moved since:
//
//     grep -h  "WHAT YOU OWN" exo_memory/loop/packet_*.md   -> 18 occurrences
//     grep -hE "^#+.*WHAT YOU OWN" exo_memory/loop/packet_*.md -> 17
//     the one excluded is exactly the blockquote that caused the outage
//
// Perfect discrimination on the live corpus. Taking the LAST match instead would also fix the
// observed case and is the cheaper repair; it is wrong, because a packet quoting the phrase AFTER
// its block would then truncate to nothing. Both directions are asserted in the suite.
//
// THE DIAGNOSTIC, and it is the part that is not L's. The anchor makes this parser STRICTER, so a
// packet whose block is not a markdown heading (`**WHAT YOU OWN**`) now lands in the same
// fail-closed branch behind the same message L had to BISECT for 27 hours to decode. A stricter
// parser with an undiagnostic failure is how this recurs under a new trigger, so the refusal now
// carries which of the two happened. The cause is computed here, where it is known, rather than
// guessed at the refusal site, where it is not.
const OWN_HEADING = /^#+.*WHAT YOU OWN/i;

function parsePacket(text) {
  const to = text.match(/\bTo\s+([A-Z]{4,8})\b/);
  const letter = to && NATO[to[1]] ? NATO[to[1]] : null;
  const hb = text.match(/exo_memory\/handback\/[A-Za-z0-9._-]+\.md/);
  const handback = hb ? hb[0] : null;

  const owned = [];
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => OWN_HEADING.test(l));
  if (start >= 0) {
    for (let j = start + 1; j < lines.length; j++) {
      const l = lines[j];
      if (/^\s*$/.test(l)) continue;
      if (/^\S/.test(l)) break;                       // left the indented block
      const m = l.match(/^\s{4,}([A-Za-z0-9][A-Za-z0-9._\/-]*)/);
      if (m && (m[1].includes('/') || m[1].includes('.'))) owned.push(m[1]);
    }
  }

  let why = null;
  if (!owned.length) {
    const mentions = lines.filter((l) => /WHAT YOU OWN/i.test(l)).length;
    why = start >= 0
      ? `the WHAT YOU OWN heading at line ${start + 1} is followed by no indented path — an empty block`
      : mentions
        ? `no WHAT YOU OWN heading: the phrase appears ${mentions} time(s) but never as a markdown heading ` +
          '(the block must start with #, or a mention in prose is read as the block)'
        : 'no WHAT YOU OWN block at all';
  }
  return { letter, owned, handback, why };
}

// ── who holds what, right now ─────────────────────────────────────────────────────────────
function holders({ repo, lap, dispatchedAt }) {
  const loop = path.join(repo, 'exo_memory', 'loop');
  const active = [];
  const released = [];
  let files = [];
  try {
    files = fs.readdirSync(loop).filter((f) => /^packet_.*\.md$/.test(f));
  } catch (e) {
    return { active, released, problem: `cannot read ${loop}` };
  }
  for (const f of files) {
    let text;
    try { text = fs.readFileSync(path.join(loop, f), 'utf8'); } catch (e) { continue; }
    // A packet belongs to this lap if it says so. Packets title themselves "(L033)" / "L033.5".
    if (!lap || !text.includes(lap)) continue;
    const p = parsePacket(text);
    p.packet = path.posix.join('exo_memory', 'loop', f);
    p.releasedBy = null;
    if (p.handback) {
      const abs = path.join(repo, p.handback);
      let st = null;
      try { st = fs.statSync(abs); } catch (e) { st = null; }
      // THE FRESHNESS COMPARISON. A hand-back older than the newest dispatch is a hand-back for
      // work that is no longer the work in flight, and must not release anything.
      if (st && (dispatchedAt == null || st.mtimeMs > dispatchedAt)) p.releasedBy = p.handback;
    }
    (p.releasedBy ? released : active).push(p);
  }
  return { active, released, problem: null };
}

// Exact path, or a directory prefix when the packet wrote a trailing slash, or a SUFFIX match.
//
// The suffix arm is not tidiness, it is a measured defect in the packets themselves: the L033
// watcher-liveness packet claims `src/bin/harvest_replay.rs`, which is relative to
// `consonance/src-tauri/`, while a staged path is always relative to the repo root. Exact matching
// alone would hand that file over. Suffix matching errs toward REFUSING a path that might be held,
// which is the safe direction for this tool and the wrong direction for almost any other.
function ownsPath(owned, p) {
  return owned.some((o) => {
    if (o.endsWith('/')) return p.startsWith(o);
    return p === o || p.endsWith(`/${o}`);
  });
}

// ── the decision ──────────────────────────────────────────────────────────────────────────
function check({ repo, dataDir, paths }) {
  const lap = lapState(dataDir);
  const refuseAll = (why) => ({
    verdict: 'REFUSE',
    lap: lap.lap,
    reason: why,
    refusals: paths.map((p) => ({ path: p, holder: null, packet: null, why })),
  });

  if (!lap.readable) return refuseAll(`${lap.why} — failing closed: ownership cannot be derived`);
  if (!lap.open) {
    return { verdict: 'ALLOW', lap: lap.lap, reason: 'no lap is dispatched; nothing is in flight', refusals: [] };
  }

  const h = holders({ repo, lap: lap.lap, dispatchedAt: lap.dispatchedAt });
  if (h.problem) return refuseAll(`${h.problem} — failing closed: ownership cannot be derived`);
  if (h.active.length === 0 && h.released.length === 0) {
    return refuseAll(`lap ${lap.lap} is DISPATCHED but no packet naming it could be parsed — failing closed`);
  }
  // A LIVE PACKET THAT CLAIMS NOTHING IS A PARSE FAILURE, NOT AN EMPTY CLAIM. Measured against
  // tonight's real packets: three of them (`doc_about`, `doc_app`, `doc_oracle`) parse to zero
  // owned paths because they carry no `WHAT YOU OWN` block at all. They are from an earlier lap
  // and are correctly out of scope — but the same shape inside a live lap would silently hold
  // nothing, and a gate that is quietly holding nothing looks exactly like a gate that is holding
  // everything. So it refuses and names the packet, which is a one-block fix in the packet.
  const blind = h.active.filter((a) => a.owned.length === 0);
  if (blind.length) {
    return refuseAll(
      `live packet(s) claim no paths, so ownership cannot be derived — failing closed: ${
        blind.map((b) => `${b.packet} (${b.why})`).join(', ')}`);
  }

  const refusals = [];
  for (const p of paths) {
    const held = h.active.find((a) => ownsPath(a.owned, p));
    if (held) {
      refusals.push({
        path: p,
        holder: held.letter,
        packet: held.packet,
        why: held.handback
          ? `held under ${held.packet}; releases when ${held.handback} is filed`
          : `held under ${held.packet}, which names no hand-back path`,
      });
    }
  }
  return {
    verdict: refusals.length ? 'REFUSE' : 'ALLOW',
    lap: lap.lap,
    reason: refusals.length ? 'in-flight files' : 'no staged path is held by a live packet',
    refusals,
    active: h.active.map((a) => ({ letter: a.letter, packet: a.packet, owned: a.owned })),
    released: h.released.map((a) => ({ letter: a.letter, packet: a.packet, by: a.releasedBy })),
  };
}

function report(r) {
  if (r.verdict === 'ALLOW') {
    return `commit-gate: green — ${r.reason}${r.lap ? ` (lap ${r.lap})` : ''}`;
  }
  const lines = [`commit-gate: REFUSED — ${r.refusals.length} path(s) are in flight${r.lap ? ` in lap ${r.lap}` : ''}`, ''];
  for (const f of r.refusals) {
    lines.push(`  ${f.path}`);
    lines.push(`      held by ${f.holder ? `pane ${f.holder}` : 'UNKNOWN (failing closed)'}`);
    lines.push(`      ${f.why}`);
  }
  lines.push('');
  lines.push('THE HAND-BACK IS THE RELEASE. Wait for the holder to file it, then commit.');
  lines.push('Naming the path instead of `git add -A` does not help — it is the same capture.');
  lines.push('If this is wrong, say why in the commit body and use --no-verify; it is recorded');
  lines.push('nowhere, so a bypass is a thing you have to be willing to say out loud.');
  return lines.join('\n');
}

function stagedPaths(repo) {
  const out = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMRT'], {
    cwd: repo, encoding: 'utf8',
  });
  return out.split('\n').map((s) => s.trim()).filter(Boolean);
}

// ── IS THE GATE ACTUALLY ARMED? ───────────────────────────────────────────────────────────
//
// THIS IS THE MOST IMPORTANT FUNCTION IN THE FILE AND IT IS NOT THE GATE.
//
// A pre-commit hook must be INSTALLED, and the installation is local config that no clone
// inherits. Right now this repo has `core.hooksPath` unset and `.git/hooks` holding nothing but
// samples — there is no gate on this machine and there never has been. **An absent gate and a
// gate that passed everything produce the identical observation: commits succeed.** That is the
// room's recurring shape, a dead thing and a quiet thing sharing one footprint, and shipping a
// hook without a way to ask whether it is live would be adding another instance of it while
// claiming to fix one.
//
// So the gate ships with a liveness check that can return an unwanted number, and the answer today
// is NO.
function armed(repo) {
  let configured = '';
  try {
    configured = execFileSync('git', ['config', '--get', 'core.hooksPath'], { cwd: repo, encoding: 'utf8' }).trim();
  } catch (e) { configured = ''; }
  const dir = configured ? path.resolve(repo, configured) : path.join(repo, '.git', 'hooks');
  const hook = path.join(dir, 'pre-commit');
  let body = null;
  try { body = fs.readFileSync(hook, 'utf8'); } catch (e) { body = null; }
  if (body === null) return { armed: false, hook, why: `no pre-commit hook at ${hook}` };
  if (!body.includes('commit-gate')) {
    return { armed: false, hook, why: `${hook} exists but does not run commit-gate.js` };
  }
  return { armed: true, hook, why: null };
}

module.exports = { lapState, parsePacket, holders, ownsPath, check, report, stagedPaths, armed, NATO };

if (require.main === module) {
  const argv = process.argv.slice(2);
  const arg = (name, dflt) => {
    const i = argv.indexOf(name);
    return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
  };
  const repo = path.resolve(arg('--repo', path.resolve(__dirname, '..', '..')));
  const resolved = arg('--data', null) || resolveDataDir();
  if (!resolved && !argv.includes('--armed') && !argv.includes('--install')) {
    process.stdout.write(
      'commit-gate: REFUSED — the data dir could not be resolved, so the lap ledger cannot be read.\n\n' +
      '  tried  $CONSONANCE_DATA, then data_dir in ~/.consonance.json\n\n' +
      'A gate that cannot find the ledger finds no open lap and would allow everything, which is\n' +
      'indistinguishable from a gate that checked. So it refuses instead. Set CONSONANCE_DATA or\n' +
      'pass --data <dir>.\n');
    process.exit(1);
  }
  const dataDir = resolved ? path.resolve(resolved) : null;

  if (argv.includes('--armed')) {
    const a = armed(repo);
    process.stdout.write(a.armed
      ? `commit-gate: ARMED — ${a.hook}\n`
      : `commit-gate: NOT ARMED — ${a.why}\n\nEvery commit in this checkout is ungated. Install:\n  node ${path.relative(repo, __filename).replace(/\\/g, '/')} --install\n`);
    process.exit(a.armed ? 0 : 1);
  }

  if (argv.includes('--install')) {
    // Printed, never run: turning the gate on is a decision with a live lap open, and this tool
    // must not make it on someone's behalf at 7am.
    process.stdout.write(
      `git -C ${repo} config core.hooksPath consonance/githooks\n\n` +
      'That is the whole installation. It is LOCAL config, so a fresh clone has no gate until\n' +
      'someone runs it — the hook file is versioned, the switch that arms it is not.\n');
    process.exit(0);
  }

  let paths;
  const i = argv.indexOf('--paths');
  if (i >= 0) paths = argv.slice(i + 1).filter((a) => !a.startsWith('--'));
  else paths = stagedPaths(repo);

  if (!paths.length) {
    process.stdout.write('commit-gate: green — nothing staged\n');
    process.exit(0);
  }
  const r = check({ repo, dataDir, paths });
  process.stdout.write(report(r) + '\n');
  process.exit(r.verdict === 'REFUSE' ? 1 : 0);
}
