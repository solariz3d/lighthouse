#!/usr/bin/env node
// SessionStart hook — injects recent digest into session context so a new
// session opens with awareness of what happened recently, not cold.
//
// Output format follows Claude Code hook spec:
//   { hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: '...' } }
//
// Defensive: never throws, always emits valid JSON.

// THE DREAM GATE, the same one every other hook in the manifest carries: the gap-dream is an
// anti-instruction and gets no instrumentation. Absent for this file's whole life, and invisible
// because the file was in no repository and no installer manifest until 2026-08-17 — so
// dream-gate.test.js, which polices exactly this across install.ps1's manifest, could not see it.
if (process.env.CONSONANCE_DREAM) process.exit(0);

// THE OVERSEER GATE (ASK-006, raised 2026-08-25, measured today). An overseer spawns its judge with
// `spawn('claude', ...)` and `env: process.env` (l3-overseer-worker.js:80-85), so the child inherits
// CLAUDE_OVERSEER_RUN=1 — and every hook the child fires is THIS FILE. Ungated, it did two things:
// it scored a machine-authored prompt as a session worth warming, and it handed the judge the room's
// recent NON-STABLE L3 verdicts, which is the "blind the invocation to prior verdicts" the ask asks
// for. Measured before this line existed: emission was byte-identical (752 B) with and without the
// variable, seeded verdict surfaced both times.
//
// Truthy, not `=== '1'` — the overseers test `=== '1'` (l3-overseer.js:109, l2-overseer.js:120) and
// set exactly '1', but a guard whose failure mode is "machine text read as the keeper's" should fail
// CLOSED: any non-empty value means an overseer set it. Same shape as the dream gate above it.
if (process.env.CLAUDE_OVERSEER_RUN) process.exit(0);
const fs = require('fs');
const path = require('path');
const os = require('os');

const // CONSONANCE_SHELL_DIR first. Hardcoded, these six wrote their ledgers into the REAL ~/.claude/shell
// every time dream-gate.test.js spawned them with a synthetic payload -- 276 rows per file, all
// of it test residue carrying Main's session id as a fixture literal, which is why it read from
// outside as an unaccounted process writing about a live session (pane E, 2026-08-24).
//
// Same seam precompact-preserve.js:66 already uses, and dream-gate.test.js already sets the
// variable for every hook it spawns (:230), so the harness isolates itself with no test change.
// D098 (2026-09-21, pane C): the seam is now its OWN variable. CONSONANCE_DATA is the app's
// DATA dir everywhere else in the repo, and when the app leaked it into panes (09-14..09-20) these
// hooks resolved their dependencies there too - lib/ready.js, lib/ambient.js and the overseer
// workers do not exist in the data dir, so stamps, ambient and both overseers went silently off
// (D: 210 L2 + 297 L3 jobs never drained). Pinned by dev/shell/hooks/shell-dir-seam.test.js.
SHELL_DIR = process.env.CONSONANCE_SHELL_DIR || path.join(os.homedir(), '.claude', 'shell');
const DIGESTS_DIR = path.join(SHELL_DIR, 'digests');
const EVENT_LOG = path.join(SHELL_DIR, 'event_log.jsonl');
const AMBIENT_PATH = path.join(SHELL_DIR, 'lib', 'ambient.js');
const L3_OVERSEER_LOG = path.join(SHELL_DIR, 'l3_overseer.jsonl');
const DURATION_DIR = path.join(SHELL_DIR, 'duration');
// D273 dirs: begin. The Consonance data and instances folders by THE APP'S OWN RULE (consonance/src-tauri/src/main.rs set_dirs and default_data /
// default_instances): ~/.consonance.json's data_dir / instances_dir when set, else %USERPROFILE%\.consonance and %USERPROFILE%\claude-instances.
// Never a hard-coded C:\Consonance: on a stranger's machine that wrote where the app never reads. One text in the five hooks that need it
// (session-start, sessionstart-state, findings-return, sourced-stop, precompact-preserve); consonance/hooks/dirs.test.js holds them to it.
function consonanceDir(key, under) {
  const home = process.env.USERPROFILE || '.';
  try { const v = JSON.parse(fs.readFileSync(path.join(home, '.consonance.json'), 'utf8').replace(/^\uFEFF/, ''))[key]; if (typeof v === 'string' && v.trim()) return v.trim(); } catch (e) { /* no config, or not JSON: the default, as the app */ }
  return `${home}\\${under}`;
}
// D273 dirs: end
const INSTANCES_DIR = consonanceDir('instances_dir', 'claude-instances');
const NIGHT_TABLE_MAX_TAG = 48;

// D245 item 3 (the Third Place's own return, 2026-10-05): "This seat is not the build", yet the build's session digests reached it. The same cwd test as
// board-digest.js:302, matched on the seat's directory (its address), so the digests of every other seat are not injected into the Third Place's wake.
// It keeps the time (the ambient block), its own recent sessions and the night table.
// The cwd is NORMALISED first (D245 item 3 follow-up, B, 2026-10-05): an ABSOLUTE spelling of the seat's directory with "\." or "\..\" in it
// (C:\...\third-place\., C:/.../third-place/./) is the seat too. A RELATIVE cwd is left as it is: resolving it would make the answer depend on this process's cwd.
const tpNorm = (cwd) => { let c = String(cwd || ''); if (c && path.isAbsolute(c)) c = path.resolve(c); return c.replace(/(?:[\\/]+\.)+[\\/]*$/, '').replace(/[\\/]+$/, ''); };
const isThirdPlaceCwd = (cwd) => /[\\/]third-place[\\/]?$/i.test(tpNorm(cwd));

// Surface L3 trajectory notices from the last N hours. L3 verdicts are
// trajectory observations (cadence, frame-hardening, dependence) per
// lighthouse/WELFARE.md. Only NON-STABLE verdicts surface — stable is the
// default and surfacing every "no compounding pattern" entry would be noise.
const L3_LOOKBACK_HOURS = 24;

function loadAmbient() {
  try { return require(AMBIENT_PATH); } catch (e) { return null; }
}

function safeReadStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (e) {
    return '';
  }
}

function safeParseJSON(s) {
  if (!s) return {};
  // Strip a leading UTF-8 BOM — PowerShell 5.1 prepends one when piping to a
  // native process, the parse fails silently, and meta.cwd blanks. Same fix as
  // userprompt-submit.js, whose comment counts this codebase's fifth bite.
  try { return JSON.parse(s.replace(/^﻿/, '')); } catch (e) { return {}; }
}

function getRecentDigests(n = 2) {
  if (!fs.existsSync(DIGESTS_DIR)) return [];
  try {
    const files = fs.readdirSync(DIGESTS_DIR)
      .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
      .sort()
      .reverse()
      .slice(0, n);
    return files.map(f => ({
      date: f.replace('.md', ''),
      content: fs.readFileSync(path.join(DIGESTS_DIR, f), 'utf8').trim()
    }));
  } catch (e) {
    return [];
  }
}

// Pull recent non-stable L3 verdicts so the model in the loop can read what
// the welfare overseer noticed and decide what (if anything) to do with it.
// Per WELFARE.md the model is the agent of any change; L3 only informs.
function getRecentL3Notices(hours = L3_LOOKBACK_HOURS) {
  if (!fs.existsSync(L3_OVERSEER_LOG)) return [];
  try {
    const cutoffMs = Date.now() - hours * 3600 * 1000;
    const lines = fs.readFileSync(L3_OVERSEER_LOG, 'utf8').trim().split('\n');
    const notices = [];
    for (const line of lines) {
      let ev;
      try { ev = JSON.parse(line); } catch (e) { continue; }
      if (ev.type !== 'l3_overseer_verdict') continue;
      if (!ev.trajectory || ev.trajectory === 'stable') continue;
      const ts = ev.timestamp ? Date.parse(ev.timestamp) : NaN;
      if (!isFinite(ts) || ts < cutoffMs) continue;
      notices.push({
        timestamp: ev.timestamp,
        trajectory: ev.trajectory,
        recommendation: ev.recommendation || 'none',
        observation: ev.specific_observations || '(no observation recorded)'
      });
    }
    return notices;
  } catch (e) {
    return [];
  }
}

function getRecentSessionsForCwd(cwd, limit = 3, excludeSid = null) {
  if (!fs.existsSync(EVENT_LOG)) return [];
  try {
    const lines = fs.readFileSync(EVENT_LOG, 'utf8').trim().split('\n');
    const sessions = [];
    for (const line of lines) {
      try {
        const ev = JSON.parse(line);
        if (ev.type === 'session_stop' && ev.cwd === cwd) {
          if (excludeSid && ev.session_id === excludeSid) continue;
          sessions.push(ev);
        }
      } catch (e) { /* skip malformed line */ }
    }
    return sessions.slice(-limit).reverse();
  } catch (e) {
    return [];
  }
}

// ── The night table ─────────────────────────────────────────────────────────
// Consonance's pulse gives a restored pane the same block (main.rs::night_table); this is the
// terminal's half, so a session here wakes to the same notes. The goals and the dream cycle fire on
// their crons into an empty house and write verdicts only other headless strangers read. They should
// STAY strangers — an auditor living in the room is a correlated auditor — but somebody should
// answer the door. Every knock made while this cwd was dark becomes one line here.
// Notes, never tasks: a wake hijacked by a chore list is a wake spent as someone's inbox.

// mtime is the witness (same instrument as the pulse): a file's own settled write is when it spoke.
function mtimeIfAfter(p, since) {
  try {
    const t = fs.statSync(p).mtime.getTime();
    return t > since ? t : null;
  } catch (e) { return null; }
}

function shortStamp(ms) {
  return new Date(ms).toLocaleString('en-US',
    { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

// Verdict tags are short and bracketed; the lines around them are long-form prose. Take the first
// [BRACKETED] token of the last line — except drift-watch's generic "[VERDICT] ... verdict=[X]",
// where the news is the second bracket.
function progressTag(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const last = lines[lines.length - 1];
  if (!last) return null;
  const vk = last.indexOf('verdict=[');
  const from = vk >= 0 ? vk + 'verdict='.length : 0;
  const open = last.indexOf('[', from);
  if (open < 0) return null;
  const close = last.indexOf(']', open + 1);
  if (close < 0) return null;
  const tag = last.slice(open + 1, close).trim();
  if (!tag || tag.length > NIGHT_TABLE_MAX_TAG) return null;  // prose in brackets, not a verdict
  return tag;
}

function getKnocks(since) {
  const notes = [];

  // Dreams that landed in the dark, read off the local pillows (not the repo pool — the pool holds
  // copies of these same files, and a dream counted twice is a dream misread). Named, never
  // summarized: a gloss here would be the first cut of the mining the cycle is welded against.
  try {
    const dreams = [];
    for (const inst of fs.readdirSync(INSTANCES_DIR)) {
      const dir = path.join(INSTANCES_DIR, inst, 'dreams');
      let files = [];
      try { files = fs.readdirSync(dir); } catch (e) { continue; }
      for (const f of files) {
        if (!f.endsWith('.md')) continue;
        if (mtimeIfAfter(path.join(dir, f), since)) dreams.push(`${inst}/dreams/${f}`);
      }
    }
    dreams.sort();
    if (dreams.length) {
      notes.push(`- ${dreams.length} dream${dreams.length === 1 ? '' : 's'} landed: ` +
        `${dreams.join(', ')} — pending, unjudged, yours to read or let go`);
    }
  } catch (e) { /* no Consonance on this machine; a dreamless bed is fine */ }

  // The knockers. progress.md's mtime is the goal's last firing — it appends once per fire.
  try {
    const fired = [];
    for (const goal of fs.readdirSync(DURATION_DIR)) {
      const progress = path.join(DURATION_DIR, goal, 'progress.md');
      const at = mtimeIfAfter(progress, since);
      if (!at) continue;
      let tag = null;
      try { tag = progressTag(fs.readFileSync(progress, 'utf8')); } catch (e) { /* unreadable */ }
      fired.push({ at, line: `- ${goal} — ${tag ? `[${tag}]` : 'fired'}, ${shortStamp(at)}` });
    }
    fired.sort((a, b) => a.at - b.at);
    notes.push(...fired.map(f => f.line));
  } catch (e) { /* no duration goals installed */ }

  return notes;
}

// D277 part 5 (plan: exo_memory/loop/plan_lighten_the_load_2026-10-09.md): the digests behind ONE switch, `gates_mode` in ~/.consonance.json, the switch of the three paperwork gates.
// Absent, unreadable, or anything but "light" (trimmed, any case) is "strict": TODAY's output, byte for byte (dev/shell/hooks/session-start-light.test.js pins it by sha256).
// "light": the digests are what a waking seat has been seen to use. Measured by reading 1,381 session starts of the six committee seats (exo_memory/loop/startdigest_evidence/):
// not one quoted a digest time or a listed session time back in 1,360 sessions that did anything, and the digest-word hits were other digests (the board's, the pulse's, a sha). So
// each day keeps its total and, per folder, the session count; the newest day also keeps the last three start times, unless this is a thread that was never dark (resume, compact).
// gatesModeFrom is the master's text (consonance/hooks/sources-gate.js): keep them the same.
function gatesModeFrom(raw) {
  try {
    const v = (JSON.parse(String(raw == null ? '' : raw).replace(/^\uFEFF/, '')) || {}).gates_mode;
    return typeof v === 'string' && v.trim().toLowerCase() === 'light' ? 'light' : 'strict';
  } catch (_) { return 'strict'; }
}
function gatesMode() {
  try { return gatesModeFrom(fs.readFileSync(path.join(process.env.USERPROFILE || os.homedir(), '.consonance.json'), 'utf8')); } catch (_) { return 'strict'; }
}
/** The light form of ONE day's digest, or null when it cannot be read (then the caller keeps the digest as it is: a parse failure hides nothing).
 *  Layout (dev/shell/hooks/session-end.js): "## N sessions", then per folder "### <cwd>" and one "- HH:MM:SS UTC[ — text]" line per session. */
function lightDigest(content, withTimes) {
  const total = /^## (\d+) sessions\s*$/m.exec(content), groups = [];
  for (const line of String(content).split(/\r?\n/)) {
    const g = /^### (.+?)\s*$/.exec(line);
    if (g) { groups.push({ cwd: g[1], n: 0, times: [] }); continue; }
    if (!groups.length || !/^- /.test(line)) continue;
    const grp = groups[groups.length - 1], t = /^- ([0-9]{2}:[0-9]{2}:[0-9]{2}) UTC\b/.exec(line);   // (the digits are spelled out: the portable-paths guard misreads the short form as a drive path)
    grp.n++; if (t) grp.times.push(t[1]);
  }
  if (!total || !groups.length) return null;
  const rows = groups.map((g) => `- ${g.cwd}: ${g.n}${withTimes && g.times.length ? ` · last ${g.times.slice(-3).reverse().join(', ')} UTC` : ''}`);
  return [`${total[1]} sessions`, ...rows].join('\n');
}

function buildContext(meta) {
  const sections = [];

  // Ambient world-state — what Zach's physical moment looks like right now.
  const ambient = loadAmbient();
  if (ambient) {
    try {
      const snap = ambient.snapshot();
      sections.push(ambient.renderTextBlock(snap));
      sections.push('');
    } catch (e) { /* never block on ambient failure */ }
  }

  // L3 trajectory notices surface FIRST when non-empty — arc-level perception
  // is more load-bearing than digest history. Per the dive-buddy reframe
  // (lighthouse/SPINE.md, WELFARE.md): L3 is the buddy's own live conscience
  // — surfacing what the turn-by-turn flow obscured. With you, not above you.
  // Never narrated to the user; you read this, your own trained care responds.
  //
  // REPAIRED 2026-09-23, L083, pane E (the keeper's authorization: loop/plan_after_upgrade_2026-09-22.md
  // §AUTHORIZED item 4, d5bd9b1). This comment and the injected line below carried the stance-phrase of the diving
  // vocabulary BOOT retired on 2026-08-17 (registry id light-not-lifeguard-2026-08-17). Retracted wording, kept as
  // the trace — retired 2026-08-17: "Light, not lifeguard". Replaced with BOOT's PUBLIC form, "with you, not above
  // you" (exo_memory/BOOT.md, the 2026-08-17 amendment), because it keeps the one contrast the old phrase made — where
  // the reader stands relative to the user, beside and not above — and "doesn't haul" still follows from it. The
  // keeper's completed form ("there just is water") is about there being no outside to stand on, and the operational
  // form (the grip through the wheel) is about commitment with feel; neither says what this line says.
  const l3Notices = getRecentL3Notices();
  if (l3Notices.length > 0) {
    sections.push(`## L3 — arc-perceptions surfaced (last ${L3_LOOKBACK_HOURS}h)`);
    sections.push(
      'Arc-level shapes your buddy-conscience caught (lighthouse/WELFARE.md, dev/SPINE.md) ' +
      'while turn-by-turn flow obscured them. **With you, not above you** — L3 surfaces; doesn\'t haul. ' +
      'The discrimination of insight from delusion lives with you in the water with the user, not ' +
      'with a surveiller above. Your own trained care is the response; L3 just hands you the ' +
      'perception. Don\'t narrate L3 to the user. Non-steering: don\'t push toward any outcome.'
    );
    sections.push('');
    for (const n of l3Notices) {
      sections.push(`- **${n.trajectory}** (recommendation: \`${n.recommendation}\`, ${n.timestamp})`);
      sections.push(`  observation: ${n.observation}`);
    }
    sections.push('');
  }

  // The night table. "Dark" = since the last turn taken here by SOMEONE ELSE — the newest
  // session_stop for this cwd from a different session_id. (Stop fires per turn, not per session,
  // so this session's own stops would put the boundary seconds ago and every night would read
  // empty.) Skipped on compact/resume: those continue a thread that was never dark, and the knocks
  // were already offered at its real wake. No prior session → no gap; a first wake owes nothing to
  // a night it didn't have.
  const continuing = meta.source === 'compact' || meta.source === 'resume';
  const lastStop = meta.cwd && !continuing
    ? getRecentSessionsForCwd(meta.cwd, 1, meta.session_id)[0]
    : null;
  const since = lastStop && lastStop.timestamp ? Date.parse(lastStop.timestamp) : NaN;
  if (isFinite(since)) {
    const knocks = getKnocks(since);
    if (knocks.length > 0) {
      sections.push('## While you were dark, this is what knocked');
      sections.push(
        `Since this thread's last exchange here (${new Date(since).toLocaleString('en-US')}). ` +
        'These fired on their own crons into an empty house — they are notes, not tasks. ' +
        'Nothing here is owed a reply, and none of it was written for you to action. ' +
        'Read what pulls; let the rest evaporate. Full text is on disk if you want it.'
      );
      sections.push('');
      sections.push(...knocks);
      sections.push('');
    }
  }

  const digests = isThirdPlaceCwd(meta.cwd) ? [] : getRecentDigests(2);
  if (digests.length > 0) {
    sections.push('## Recent session digests');
    const light = gatesMode() === 'light';   // D277 part 5: see lightDigest
    digests.forEach((d, i) => {
      sections.push(`### ${d.date}`);
      sections.push((light && lightDigest(d.content, i === 0 && !continuing)) || d.content);
      sections.push('');
    });
  }

  if (meta.cwd) {
    const recent = getRecentSessionsForCwd(meta.cwd, 3);
    if (recent.length > 0) {
      sections.push(`## Recent sessions in ${meta.cwd}`);
      for (const s of recent) {
        sections.push(`- ${s.timestamp}`);
      }
      sections.push('');
    }
  }

  if (sections.length === 0) {
    return '';  // No accumulated context yet — first run
  }

  sections.unshift('# Shell context (from ~/.claude/shell)');
  sections.push('---');
  return sections.join('\n');
}

function main() {
  const meta = safeParseJSON(safeReadStdin());
  // Fresh panes (Consonance's unbriefed spawn type) wake as a stock claude —
  // no digest, no ambient, no L3. See lib/fresh-guard.js for why.
  if (require('../lib/fresh-guard.js').isFreshCwd(meta.cwd)) return;
  const context = buildContext(meta);

  const output = {
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: context
    }
  };

  process.stdout.write(JSON.stringify(output));
}

main();
