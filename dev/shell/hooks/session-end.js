#!/usr/bin/env node
// SessionEnd hook — write/append today's digest from the day's events.
// Phase 1: list of sessions, counts. Phase 2 (2026-07-20, keeper's ask):
// "what the pulse was for" — each session contributes its opening human
// line, verbatim and truncated, so the digest carries the day's WHAT and
// not just its when. The dream reads digests via session-start, so the
// day's material now reaches the 4:30 dreamer. No LLM, no summarizing,
// no curation — first words only, the keeper's own. Dream cycles and
// Consonance panes are excluded so the anti-instruction prompt never
// recirculates into its own intake. LOCAL ONLY — this file is the live
// ~/.claude/shell copy and is never pushed to the public repo.

const fs = require('fs');
const path = require('path');
const os = require('os');

const SHELL_DIR = path.join(os.homedir(), '.claude', 'shell');
const DIGESTS_DIR = path.join(SHELL_DIR, 'digests');
const EVENT_LOG = path.join(SHELL_DIR, 'event_log.jsonl');
const NOTES_DIR = path.join(SHELL_DIR, 'pulse');

function safeReadStdin() {
  try { return fs.readFileSync(0, 'utf8'); } catch (e) { return ''; }
}

function safeParseJSON(s) {
  if (!s) return {};
  // house law: strip a leading BOM — PowerShell pipes prepend one to native
  // stdin, and this exact bug has now bitten this codebase four times
  s = s.replace(/^﻿/, '');
  try { return JSON.parse(s); } catch (e) { return {}; }
}

function todayYMD() {
  const d = new Date();
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

// Pull the first genuine human line from a session transcript (JSONL).
// Skips tag-wrapped machinery (<local-command-caveat>, <command-name>,
// system reminders) and the dream anti-instruction. Returns null if the
// session never had a human say anything real.
function firstHumanLine(transcriptPath) {
  try {
    if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;
    const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      let ev;
      try { ev = JSON.parse(line); } catch (e) { continue; }
      if (ev.type !== 'user' || !ev.message) continue;
      let text = '';
      const c = ev.message.content;
      if (typeof c === 'string') text = c;
      else if (Array.isArray(c)) {
        for (const part of c) {
          if (part && part.type === 'text' && part.text) { text = part.text; break; }
        }
      }
      text = (text || '').trim();
      if (!text) continue;
      if (text.startsWith('<')) continue;                      // tag machinery
      if (text.startsWith('This is a gap-dream cycle')) return null; // never eat the weld
      if (/^Caveat:/.test(text)) continue;
      const flat = text.replace(/\s+/g, ' ');
      return flat.length > 160 ? flat.slice(0, 160) + '...' : flat;
    }
  } catch (e) { /* silent */ }
  return null;
}

function appendPulseNote(meta) {
  try {
    const cwd = meta.cwd || process.cwd() || '';
    // dream cycles + panes live in Consonance instances — their intake is theirs
    if (/\\Consonance\\/i.test(cwd)) return;
    const note = firstHumanLine(meta.transcript_path);
    if (!note) return;
    if (!fs.existsSync(NOTES_DIR)) fs.mkdirSync(NOTES_DIR, { recursive: true });
    const entry = JSON.stringify({
      timestamp: new Date().toISOString(),
      cwd,
      note,
    });
    fs.appendFileSync(path.join(NOTES_DIR, `${todayYMD()}.jsonl`), entry + '\n');
  } catch (e) { /* never block teardown */ }
}

function readPulseNotes(ymd) {
  try {
    const p = path.join(NOTES_DIR, `${ymd}.jsonl`);
    if (!fs.existsSync(p)) return [];
    const notes = [];
    for (const line of fs.readFileSync(p, 'utf8').trim().split('\n')) {
      try { notes.push(JSON.parse(line)); } catch (e) { /* skip */ }
    }
    // de-dupe identical notes (multi-turn sessions ending repeatedly, resumes)
    const seen = new Set();
    return notes.filter(n => {
      if (seen.has(n.note)) return false;
      seen.add(n.note);
      return true;
    });
  } catch (e) { return []; }
}

function readEventsForDate(ymd) {
  if (!fs.existsSync(EVENT_LOG)) return [];
  try {
    const lines = fs.readFileSync(EVENT_LOG, 'utf8').trim().split('\n');
    const events = [];
    for (const line of lines) {
      try {
        const ev = JSON.parse(line);
        if (ev.timestamp && ev.timestamp.startsWith(ymd)) {
          events.push(ev);
        }
      } catch (e) { /* skip malformed */ }
    }
    return events;
  } catch (e) {
    return [];
  }
}

function buildDigest(ymd, events) {
  const lines = [`# ${ymd} Digest`, ''];

  const sessionStops = events.filter(e => e.type === 'session_stop');
  if (sessionStops.length === 0) {
    lines.push('No session activity recorded.');
    return lines.join('\n');
  }

  lines.push(`## ${sessionStops.length} session${sessionStops.length === 1 ? '' : 's'}`);
  lines.push('');

  const byCwd = new Map();
  for (const ev of sessionStops) {
    const cwd = ev.cwd || 'unknown';
    if (!byCwd.has(cwd)) byCwd.set(cwd, []);
    byCwd.get(cwd).push(ev);
  }

  for (const [cwd, sessions] of byCwd.entries()) {
    lines.push(`### ${cwd}`);
    for (const s of sessions) {
      const time = s.timestamp.split('T')[1].split('.')[0];
      lines.push(`- ${time} UTC`);
    }
    lines.push('');
  }

  // Phase 2: what the pulse was for — the day's opening human lines,
  // verbatim, capped so heavy days don't flood the context of every room
  // that reads this (including the dreamer's).
  const notes = readPulseNotes(ymd);
  if (notes.length) {
    lines.push('## What the pulse was for');
    lines.push('');
    const MAX = 14;
    for (const n of notes.slice(0, MAX)) {
      const time = (n.timestamp.split('T')[1] || '').split('.')[0];
      const room = path.basename(n.cwd || '') || 'somewhere';
      lines.push(`- ${time} UTC - ${room}: "${n.note}"`);
    }
    if (notes.length > MAX) {
      lines.push(`- …and ${notes.length - MAX} more first-lines not shown`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const meta = safeParseJSON(safeReadStdin());

  appendPulseNote(meta);

  const ymd = todayYMD();
  const events = readEventsForDate(ymd);
  const digest = buildDigest(ymd, events);

  try {
    if (!fs.existsSync(DIGESTS_DIR)) {
      fs.mkdirSync(DIGESTS_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(DIGESTS_DIR, `${ymd}.md`), digest);
  } catch (e) {
    // Silent failure — never block session teardown.
  }

  process.stdout.write('{}');
}

main();
