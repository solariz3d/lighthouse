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

const fs = require('fs');
const path = require('path');
const os = require('os');

const SHELL_DIR = path.join(os.homedir(), '.claude', 'shell');
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
  try { return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')); }
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

  // The interval first: it's the frame everything else is read inside. A verdict
  // from an arc that ended eleven hours ago reads differently than one from a
  // minute ago, and until now there was no way to tell those apart from in here.
  const context = [buildGapContext(meta), buildContext(notices)]
    .filter(Boolean)
    .join('\n');

  // Update state — record these job_ids as surfaced. Cap the seen-list at
  // 200 entries to avoid unbounded growth; older ones fall off naturally
  // since they're outside the 6h surfacing window anyway.
  if (notices.length) {
    const newIds = notices.map(n => n.job_id).filter(Boolean);
    const merged = (state.last_surfaced_job_ids || []).concat(newIds);
    state.last_surfaced_job_ids = merged.slice(-200);
    writeState(state);
  }

  const output = {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: context
    }
  };
  process.stdout.write(JSON.stringify(output));
}

main();
