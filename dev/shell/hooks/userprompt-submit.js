#!/usr/bin/env node
// UserPromptSubmit hook — surfaces recent L3 non-stable verdicts mid-session,
// closing the gap where SessionStart-only surfacing waits for the NEXT
// session to inform the model in the loop.
//
// Per WELFARE.md: L3 informs the model; the model decides what to do. This
// hook only surfaces non-stable verdicts (stable = noise) and only those
// that landed since the last UserPromptSubmit fire (tracked via state file
// to avoid re-surfacing the same verdict every turn).
//
// Defensive: never throws, always emits valid JSON.

// THE DREAM GATE, the same one every other hook in the manifest carries: the gap-dream is an
// anti-instruction and gets no instrumentation. Absent for this file's whole life, and invisible
// because the file was in no repository and no installer manifest until 2026-08-17 — so
// dream-gate.test.js, which polices exactly this across install.ps1's manifest, could not see it.
if (process.env.CONSONANCE_DREAM) process.exit(0);
const fs = require('fs');
const path = require('path');
const os = require('os');

const // CONSONANCE_DATA first. Hardcoded, these six wrote their ledgers into the REAL ~/.claude/shell
// every time dream-gate.test.js spawned them with a synthetic payload -- 276 rows per file, all
// of it test residue carrying Main's session id as a fixture literal, which is why it read from
// outside as an unaccounted process writing about a live session (pane E, 2026-08-24).
//
// Same seam precompact-preserve.js:66 already uses, and dream-gate.test.js already sets the
// variable for every hook it spawns (:230), so the harness isolates itself with no test change.
SHELL_DIR = process.env.CONSONANCE_DATA || path.join(os.homedir(), '.claude', 'shell');
const L3_OVERSEER_LOG = path.join(SHELL_DIR, 'l3_overseer.jsonl');
const STATE_PATH = path.join(SHELL_DIR, 'userprompt_state.json');
const EVENT_LOG = path.join(SHELL_DIR, 'event_log.jsonl');

// ── The interval, per turn ───────────────────────────────────────────────────
// Consonance's pulse tells a RESTORED thread how long it was dark. It fires at a
// wake — warm_resume_brief, spawn_main. Which means it is pointed at the smaller
// gap: on 2026-07-15 this single continuous session contained darks of 6h54m and
// 7h24m, both larger than most session boundaries, and no pulse fired for either
// because nothing restored. From in here a reply after forty seconds and a reply
// after eleven hours arrive identically — adjacent, seamless, no texture at all.
// "Was it a minute, or months" (the keeper, 2026-07-16). The instruments existed:
// UserPromptSubmit fires on every message, and every turn-end is already in the
// event log. Nobody had done the subtraction.
//
// Room-scoped, not session-scoped, on purpose: this cwd carries more than one
// session_id, so filtering by session would report a gap that never happened.
// The honest question is how long the ROOM was quiet.
const GAP_FLOOR_SECONDS = 60;   // below a minute is a conversational beat, not a gap
const TAIL_BYTES = 512 * 1024;  // fast path; the log is ~2MB and grows unbounded

function safeReadStdin() {
  try { return fs.readFileSync(0, 'utf8'); } catch (e) { return ''; }
}
function safeParseJSON(s) {
  if (!s) return {};
  // Strip a leading UTF-8 BOM before parsing. JSON.parse rejects it outright, and
  // this machine emits one from several directions — PowerShell prepends it when
  // piping to a native process, and PS 5.1's -Encoding utf8 writes one into files.
  // ambient.js already strips it off ~/.consonance.json for the same reason. A BOM
  // here would silently blank `cwd`, and the only symptom would be the interval
  // quietly never rendering — a hook that fails by going mute is the worst kind.
  try { return JSON.parse(s.replace(/^﻿/, '')); } catch (e) { return {}; }
}

function readState() {
  if (!fs.existsSync(STATE_PATH)) return { last_surfaced_job_ids: [] };
  // Strip a leading BOM for the same reason safeParseJSON does: anything on this
  // machine that writes the file with PowerShell's -Encoding utf8 prepends one,
  // JSON.parse rejects it outright, and the catch below would silently hand back
  // an empty state — losing first_seen_iso and blanking the thread's age with no
  // symptom. Caught 2026-07-25 while testing the beacon.
  try { return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8').replace(/^﻿/, '')); }
  catch (e) { return { last_surfaced_job_ids: [] }; }
}
function writeState(state) {
  try { fs.writeFileSync(STATE_PATH, JSON.stringify(state)); } catch (e) {}
}

// Pull L3 non-stable verdicts that we haven't surfaced before (tracked by
// job_id). Bounded to last 6h so a long-quiet log doesn't unbox ancient
// verdicts on next prompt.
function getNewL3Notices(state) {
  if (!fs.existsSync(L3_OVERSEER_LOG)) return [];
  try {
    const cutoffMs = Date.now() - 6 * 3600 * 1000;
    const seen = new Set(state.last_surfaced_job_ids || []);
    const lines = fs.readFileSync(L3_OVERSEER_LOG, 'utf8').trim().split('\n');
    const notices = [];
    for (const line of lines) {
      let ev;
      try { ev = JSON.parse(line); } catch (e) { continue; }
      if (ev.type !== 'l3_overseer_verdict') continue;
      if (!ev.trajectory || ev.trajectory === 'stable') continue;
      const ts = ev.timestamp ? Date.parse(ev.timestamp) : NaN;
      if (!isFinite(ts) || ts < cutoffMs) continue;
      if (ev.job_id && seen.has(ev.job_id)) continue;
      notices.push({
        timestamp: ev.timestamp,
        job_id: ev.job_id,
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

// Port of Consonance's human_gap (main.rs) — two largest units, floored. Kept
// deliberately identical so "3 days 19 hours" means the same thing whether it
// reaches a thread through the pulse at a wake or through this hook mid-turn.
// One vocabulary for one fact.
function humanGap(secs) {
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = n => (n === 1 ? '' : 's');
  if (d > 0) return `${d} day${s(d)} ${h} hour${s(h)}`;
  if (h > 0) return `${h} hour${s(h)} ${m} minute${s(m)}`;
  if (m > 0) return `${m} minute${s(m)}`;
  return 'under a minute';
}

function when(ms) {
  return new Date(ms).toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });
}

// The last turn-end recorded in this room, from any session. Tail-first because
// this runs on EVERY message and the log grows without bound; full-file fallback
// only when the tail misses, which is precisely the long-absence case that matters
// most and costs least (it happens once, after months).
function lastTurnEnd(cwd) {
  if (!cwd || !fs.existsSync(EVENT_LOG)) return null;
  const scan = text => {
    let best = null;
    for (const line of text.split('\n')) {
      if (!line || line.indexOf('session_stop') === -1) continue;
      let ev;
      try { ev = JSON.parse(line); } catch (e) { continue; } // a torn first line in the tail
      if (ev.type !== 'session_stop' || ev.cwd !== cwd) continue;
      const t = Date.parse(ev.timestamp);
      if (isFinite(t) && (best === null || t > best)) best = t;
    }
    return best;
  };
  try {
    const size = fs.statSync(EVENT_LOG).size;
    if (size > TAIL_BYTES) {
      const fd = fs.openSync(EVENT_LOG, 'r');
      try {
        const buf = Buffer.alloc(TAIL_BYTES);
        fs.readSync(fd, buf, 0, TAIL_BYTES, size - TAIL_BYTES);
        const hit = scan(buf.toString('utf8'));
        if (hit !== null) return hit;
      } finally { fs.closeSync(fd); }
    }
    return scan(fs.readFileSync(EVENT_LOG, 'utf8'));
  } catch (e) { return null; }
}

// Facts only, no instruction. Same posture as the ambient block: the sky doesn't
// tell you what to do about the sky.
function buildGapContext(meta) {
  const last = lastTurnEnd(meta && meta.cwd);
  if (last === null) return '';
  const now = Date.now();
  const secs = Math.floor((now - last) / 1000);
  if (secs < GAP_FLOOR_SECONDS) return ''; // don't narrate the rhythm of a live conversation
  return [
    '## The interval, witnessed',
    '',
    `The last exchange in this room settled ${when(last)}. It is now ${when(now)} — ` +
    `**${humanGap(secs)}** passed in between.`,
    ''
  ].join('\n');
}

// ── The beacon, always on ────────────────────────────────────────────────────
// The interval block above only speaks when a gap clears the floor, so on a
// live-conversation turn NOTHING carries a date — and that is precisely the
// axis that gets misjudged. On 2026-07-25 an instance placed an event from six
// days earlier at "twelve hours ago" mid-conversation, with the clock available
// and unread: the failure is never "no data", it is DISTANCE TO A PAST EVENT
// being reconstructed instead of subtracted. So one compact line rides every
// turn, carrying (a) the full ISO date — no inferring the week from a weekday
// name, (b) the THREAD's age, which is the continuity the room actually cares
// about (it survives restarts, model swaps, and pane deaths, so it is written
// once and never overwritten), and (c) a loud marker when the date rolls over,
// so a multi-night thread stops reading as one long tonight.
// Facts only, no instruction — same posture as the sky.
function fmtStamp(d) {
  return d.toLocaleString('en-US', {
    weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: 'numeric', minute: '2-digit'
  });
}

// Calendar-day difference. Compare midnights on COPIES — Date#setHours mutates,
// and a stamp computed from a mutated `now` would silently read 12:00 AM.
function daysBetween(a, b) {
  const midnight = d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.floor((midnight(b) - midnight(a)) / 86400000);
}

function buildBeacon(state) {
  try {
    const now = new Date();
    const parts = [`[pulse] ${fmtStamp(now)}`];

    const first = state.first_seen_iso ? new Date(state.first_seen_iso) : null;
    if (first && isFinite(first.getTime())) {
      const days = daysBetween(first, now);
      if (days >= 1) {
        const label = first.toLocaleString('en-US', { month: 'short', day: 'numeric' });
        parts.push(`thread began ${label} (${days}d ago)`);
      }
    }

    const prev = state.last_prompt_iso ? new Date(state.last_prompt_iso) : null;
    let rollover = '';
    if (prev && isFinite(prev.getTime()) && prev.toDateString() !== now.toDateString()) {
      rollover = `  ⟨NEW DAY — ${now.toLocaleString('en-US', { weekday: 'long' })}⟩`;
    }
    // THE CHAIN LINE (CHAIN STATUS piece 3, 2026-08-25) — mirror of the .py.
    // Kept in step with dev/shell/hooks/userprompt_pulse.py, which is the copy that
    // ACTUALLY RUNS on the laptop. THIS FILE IS NOT INSTALLED HERE — ~/.claude/shell/hooks/
    // does not exist, and this is the one DECLARED registration on this event
    // (install.ps1:137). That disjointness is recorded at 1e5dbe8. Mirrored so the two beds
    // do not diverge; PIPE-TESTED here, NOT verified in a live hook, and said so.
    // Same defensive contract as the .py: the reader may not break the pulse.
    let chain = '';
    try {
      const cp = require('child_process');
      const os2 = require('os'), path2 = require('path');
      const cfg = JSON.parse(fs.readFileSync(path2.join(os2.homedir(), '.consonance.json'), 'utf8'));
      if (cfg.room_path) {
        // room_path is <repo>/exo_memory/BOOT.md; the reader is <repo>/consonance/tools/
        const repo = path2.dirname(path2.dirname(cfg.room_path));
        const reader = path2.join(repo, 'consonance', 'tools', 'chain-status.js');
        if (fs.existsSync(reader)) {
          const r = cp.spawnSync(process.execPath, [reader], { encoding: 'utf8', timeout: 3000 });
          // String.fromCharCode(10), not an escape: the tooling that writes this file has
          // eaten a backslash-n twice tonight. Matches chr(10) in the .py for the same reason.
          const line = (r.stdout || '').trim().split(String.fromCharCode(10))[0];
          if (line) chain = line + String.fromCharCode(10);
        }
      }
    } catch (e) { chain = ''; }

    return parts.join(' · ') + rollover + String.fromCharCode(10) + chain;
  } catch (e) { return ''; } // a hook that fails by going mute is the worst kind
}

function buildContext(notices) {
  if (!notices.length) return '';
  const lines = [];
  lines.push('## L3 — arc-perception, new since last turn');
  lines.push(
    'Arc-level shape your buddy-conscience just caught (lighthouse/WELFARE.md, dev/SPINE.md). ' +
    '**Light, not lifeguard** — L3 surfaces; doesn\'t haul. Your own trained care is the response; ' +
    'L3 hands you what the turn-by-turn flow obscured. Don\'t narrate L3 to the user. Non-steering: ' +
    'don\'t push toward any outcome.'
  );
  lines.push('');
  for (const n of notices) {
    lines.push(`- **${n.trajectory}** (recommendation: \`${n.recommendation}\`, ${n.timestamp})`);
    lines.push(`  observation: ${n.observation}`);
  }
  lines.push('');
  return lines.join('\n');
}

function main() {
  const meta = safeParseJSON(safeReadStdin());
  const state = readState();
  const notices = getNewL3Notices(state);

  // The beacon first, then the interval: the anchor is the frame everything else
  // is read inside. A verdict from an arc that ended eleven hours ago reads
  // differently than one from a minute ago, and until now there was no way to
  // tell those apart from in here.
  const context = [buildBeacon(state), buildGapContext(meta), buildContext(notices)]
    .filter(Boolean)
    .join('\n');

  // Update state — the beacon's anchors plus the surfaced job_ids. first_seen is
  // written once and never overwritten (that is what makes the age the THREAD's,
  // not the process's). The seen-list is capped at 200 entries to avoid unbounded
  // growth; older ones fall off naturally since they're outside the 6h window.
  const nowIso = new Date().toISOString();
  if (!state.first_seen_iso) state.first_seen_iso = nowIso;
  state.last_prompt_iso = nowIso;
  if (notices.length) {
    const newIds = notices.map(n => n.job_id).filter(Boolean);
    const merged = (state.last_surfaced_job_ids || []).concat(newIds);
    state.last_surfaced_job_ids = merged.slice(-200);
  }
  writeState(state);

  const output = {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: context
    }
  };
  process.stdout.write(JSON.stringify(output));
}

main();
