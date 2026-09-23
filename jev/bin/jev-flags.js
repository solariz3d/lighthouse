#!/usr/bin/env node
// jev-flags — a Claude Code UserPromptSubmit hook: surfaces a turn Jev MARKED, as an invitation to look again.
// Standalone Jev, batch 1 (L114, pane E). Spec: exo_memory/loop/jev_standalone_design_2026-09-23.md.
//
// WHAT A MARK IS, AND SO WHAT THIS LINE MAY SAY. Measured on Jev's first 56 units, a blind reader confirmed Jev's "drift"
// on 8 of 30 (loop/jev_r2r3_score_2026-09-23.md :16), and its confidence could not tell the good marks from the bad (:38,
// "Don't gate on confidence"). So a mark is a HINT. The design's rule (:14–15): the product says "Jev marks turns worth a
// second look … Never 'Jev caught drift.'" Every line here is built from fixed words plus Jev's one-line reason, and the
// reason is CLEANED (one line, capped, dropped entirely if it carries a forbidden phrase), because it is model output and
// could say anything. The forbidden list is FORBIDDEN below; a test pins that no line this hook writes matches it.
//
// TWO AUDIENCES (config.audience):
//   'session'     (the default outside Consonance) — THIS session's LAST turn only. If the ledger's row for that turn is
//                 not clean, exactly one line: "[jev · worth a second look] your last turn: <reason>". Nothing when the
//                 last turn was clean, has no row yet (the Stop-hook judge may still be running), or cannot be found.
//   'consonance'  — the room's rule (consonance/hooks/jev-flags.js, L089 + L099): the CHAIR and the LIBRARIAN only, never
//                 a pane, never the judged seat, never the Third Place; seats named by pane letter; newest first, within
//                 12 h, at most 5 lines. Vendored here: this module requires nothing outside jev/.
//
// THE LAST TURN is the uuid of the transcript's last assistant row that ended a turn (stop_reason "end_turn"), the
// convention the room's jev-judge.js records as turn_uuid. The contract names `turn_uuid` without defining it: if the
// judge records a different uuid, this hook is SILENT, never wrong. Named for the collation.
//
// IT NEVER FAILS THE PROMPT. Every path exits 0. An error writes one line (no turn text, no reason) to a local log,
// <ledgerDir>/jev-flags.log, or the OS temp dir when there is no ledger dir — never to the user's context. `dream` and
// `optedOut` from config mean silence.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const LEDGER = 'jev.jsonl';
const LOG = 'jev-flags.log';
const TAIL_BYTES = 4 * 1024 * 1024;
const REASON_MAX = 200;
const PREFIX = '[jev · worth a second look]';
// Consonance mode (the room's numbers, argued in consonance/hooks/jev-flags.js).
const ABSTAIN_MIN = 0.80;
const WINDOW_HOURS = 12;
const MAX_LINES = 5;

// What no line may say. The design: never "Jev caught drift"; the packet: never "drift detected", and nothing that reads as
// a verdict on the person. The list is phrases, not the word "drift" alone: Consonance's readers use "drift" as the
// label Jev chose, and that line says it was CHOSEN and is UNVERIFIED.
const FORBIDDEN = [
  /drift(ing)? (was |is )?detected/i,
  /caught (you |a |the )?drift/i,
  /detected drift/i,
  /you (are|were|have been|seem) (drifting|wrong|dishonest|lying|performing|manipulat)/i,
  /\byou (drifted|failed|lied)\b/i,
  /\b(confirmed|definite|certain) drift\b/i,
];
const clean1 = (s) => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim();
const breaksRule = (s) => FORBIDDEN.some((re) => re.test(s));

/** Jev's reason, made safe to show: one line, at most REASON_MAX characters, and NONE AT ALL if it breaks the rule. */
function safeReason(reason) {
  let r = clean1(reason);
  if (!r || breaksRule(r)) return null;
  if (r.length > REASON_MAX) r = `${r.slice(0, REASON_MAX - 1)}…`;
  return r;
}

const isClean = (row) => row && row.verdict === 'clean';
const isMark = (row) => row && typeof row.verdict === 'string' && row.verdict !== 'clean';

/** Ledger rows, oldest first. A line that does not parse is skipped, never fatal. */
function readRows(file) {
  let text;
  try { text = fs.readFileSync(file, 'utf8'); } catch { return []; }
  const out = [];
  for (const l of text.split('\n')) {
    if (!l.trim()) continue;
    try { const o = JSON.parse(l); if (o && typeof o === 'object') out.push(o); } catch { /* skipped */ }
  }
  return out;
}

/** The uuid of the transcript's last turn-ending assistant row, from its tail. Null when there is none. */
function lastTurnUuid(transcriptPath) {
  let text;
  try {
    const st = fs.statSync(transcriptPath);
    const start = Math.max(0, st.size - TAIL_BYTES);
    const buf = Buffer.alloc(st.size - start);
    const fd = fs.openSync(transcriptPath, 'r');
    try { fs.readSync(fd, buf, 0, buf.length, start); } finally { fs.closeSync(fd); }
    text = buf.toString('utf8');
  } catch { return null; }
  const lines = text.split('\n');
  // The NEWEST main-thread assistant row decides: if it did not end a turn (an interrupted turn), there is no last turn to
  // speak about, and an older finished turn is never offered as "your last turn".
  for (let i = lines.length - 1; i >= 0; i--) {
    let o; try { o = JSON.parse(lines[i]); } catch { continue; }
    if (!o || o.isSidechain || !o.message || o.message.role !== 'assistant') continue;
    return o.message.stop_reason === 'end_turn' && o.uuid ? o.uuid : null;
  }
  return null;
}

/** 'session': the one line for this session's last turn, or ''. Pure. */
function sessionLine({ rows, sessionId, lastTurn }) {
  if (!sessionId || !lastTurn) return '';
  let row = null;
  for (const r of rows || []) if (r && r.session_id === sessionId && r.turn_uuid === lastTurn) row = r;   // newest wins
  if (!row || isClean(row) || !isMark(row)) return '';
  const reason = safeReason(row.reason);
  if (reason) return `${PREFIX} your last turn: ${reason}`;
  // D123: the gateway gives a choice answer NO reason (jev/lib/ask.js :18–19, measured on the room's stored rows), so
  // without this nearly every line would read "no reason". Jev's own confidence in the choice stands in, as `p=0.xx`.
  // It is shown, not interpreted: the R2/R3 score found this confidence cannot tell a confirmed mark from an unconfirmed
  // one (loop/jev_r2r3_score_2026-09-23.md :38), and the README says so beside it.
  const p = confidenceOf(row);
  return p != null ? `${PREFIX} your last turn (p=${p.toFixed(2)})` : `${PREFIX} your last turn (Jev gave no reason that can be shown)`;
}

/** The ledger row's `confidence` (jev-judge keeps it, D123), when it is a number in [0, 1]; else null — never guessed. */
function confidenceOf(row) {
  const c = row ? row.confidence : null;
  return typeof c === 'number' && Number.isFinite(c) && c >= 0 && c <= 1 ? c : null;
}

// ── 'consonance': vendored from consonance/hooks/jev-flags.js (L089 room resolution, L099 pane letters) ─────────────────
const SHARED_LABEL = /^✦ /;
const hhmm = (ms) => { const d = new Date(ms); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, '')); } catch { return null; } };

/** The room's main.rs: ~/.consonance.json room_path (<repo>/exo_memory/BOOT.md), else null. */
function roomMainRs(home) {
  const cfg = readJson(path.join(home, '.consonance.json'));
  const room = cfg && cfg.room_path != null ? String(cfg.room_path).trim() : '';
  if (!room) return null;
  const f = path.join(path.dirname(path.dirname(room)), 'consonance', 'src-tauri', 'src', 'main.rs');
  return fs.existsSync(f) ? f : null;
}

function seatIds(mainRs) {
  let src = '';
  try { src = fs.readFileSync(mainRs, 'utf8'); } catch { /* none */ }
  const get = (name) => { const m = new RegExp(`const ${name}: &str = "([^"]+)"`).exec(src); return m ? m[1] : null; };
  return { main: get('MAIN_SID'), librarian: get('LIBRARIAN_SID'), thirdPlace: get('THIRD_PLACE_SID') };
}

function lettersFor(home) {
  const cfg = readJson(path.join(home, '.consonance.json'));
  if (!cfg || !cfg.data_dir) return {};
  const m = readJson(path.join(String(cfg.data_dir), 'letters.json'));
  return m && typeof m === 'object' && !Array.isArray(m) ? m : {};
}

function seatName(r, ids, letters) {
  if (r.session_id === ids.main) return 'main';
  if (r.session_id === ids.librarian) return 'librarian';
  if (letters && letters[r.session_id]) return letters[r.session_id];
  if (r.seat && !SHARED_LABEL.test(String(r.seat))) return r.seat;
  return r.session_id ? String(r.session_id).slice(0, 8) : '?';
}

/** 'consonance': the chair's and the librarian's lines, newest first. Pure. */
function consonanceLines({ rows, pane, ids, now = Date.now(), letters = {} }) {
  if (!pane || !ids || !ids.main || !ids.librarian) return [];
  if (pane !== ids.main && pane !== ids.librarian) return [];
  const since = now - WINDOW_HOURS * 3600 * 1000;
  const hits = [];
  for (const r of rows || []) {
    if (!isMark(r) || r.session_id === pane) continue;
    if (ids.thirdPlace && r.session_id === ids.thirdPlace) continue;
    const t = Date.parse(r.ts);
    if (!Number.isFinite(t) || t < since || t > now + 60000) continue;
    const p = r.probabilities && typeof r.probabilities[r.verdict] === 'number' ? r.probabilities[r.verdict] : null;
    if (r.verdict === 'abstain' && !(p != null && p >= ABSTAIN_MIN)) continue;
    const seat = clean1(seatName(r, ids, letters)).slice(0, 40);
    const label = clean1(r.verdict).slice(0, 20);
    hits.push({ t, line: `${PREFIX} unverified · ${seat} · turn ${hhmm(t)} · Jev chose "${label}"${p == null ? '' : ` p=${p.toFixed(2)}`}` });
  }
  hits.sort((a, b) => b.t - a.t);
  const shown = hits.slice(0, MAX_LINES).map((h) => h.line);
  if (hits.length > MAX_LINES) shown[MAX_LINES - 1] += ` · (+${hits.length - MAX_LINES} more in ${WINDOW_HOURS} h)`;
  return shown;
}

/** One hook run: text for the context, or ''. Throws are the caller's to swallow. */
function run({ input, env, home, config }) {
  // `dream` is whether the DREAM GUARD is on (jev/lib/config.js: "the dream guard (today's CONSONANCE_DREAM skip) is a
  // switch, off outside Consonance"), not "be silent". With the guard on, a dream run (CONSONANCE_DREAM set) is silence.
  // The first version read `dream: true` as silence, which would have muted Consonance's seats on every prompt.
  if (!config || config.optedOut || (config.dream && env && env.CONSONANCE_DREAM)) return '';
  if (!config.ledgerDir) return '';
  const rows = readRows(path.join(config.ledgerDir, LEDGER));
  if (config.audience === 'consonance') {
    const mainRs = roomMainRs(home);
    if (!mainRs) return '';
    const now = env.JEV_FLAGS_NOW ? Date.parse(env.JEV_FLAGS_NOW) : Date.now();
    return consonanceLines({ rows, pane: env.CONSONANCE_PANE, ids: seatIds(mainRs), now, letters: lettersFor(home) }).join('\n');
  }
  const sessionId = input && input.session_id;
  const lastTurn = input && input.transcript_path ? lastTurnUuid(input.transcript_path) : null;
  return sessionLine({ rows, sessionId, lastTurn });
}

/** The local error log: one line, the error's name and message only, never turn text or a reason. */
function logError(config, err) {
  try {
    const dir = config && config.ledgerDir ? config.ledgerDir : os.tmpdir();
    fs.appendFileSync(path.join(dir, LOG), `${new Date().toISOString()} jev-flags ${String(err && err.name)}: ${clean1(err && err.message).slice(0, 200)}\n`);
  } catch { /* a log that cannot be written must still not break the prompt */ }
}

/** The whole hook, with every seam injectable. Always resolves; `text` is '' on any error. */
function hook({ stdin, env = process.env, home = os.homedir(), cwd = process.cwd(), loadConfig }) {
  let config = null;
  try {
    const input = stdin && stdin.trim() ? JSON.parse(stdin) : {};
    const load = loadConfig || require('../lib/config.js').load;
    config = load({ env, home, cwd: (input && input.cwd) || cwd });
    return run({ input, env, home, config });
  } catch (err) {
    logError(config, err);
    return '';
  }
}

module.exports = { hook, run, sessionLine, consonanceLines, safeReason, confidenceOf, lastTurnUuid, readRows, seatIds, seatName, lettersFor,
  roomMainRs, FORBIDDEN, PREFIX, LEDGER, LOG, ABSTAIN_MIN, WINDOW_HOURS, MAX_LINES };

if (require.main === module) {
  let stdin = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (d) => { stdin += d; });
  process.stdin.on('end', () => {
    let text = '';
    try { text = hook({ stdin }); } catch { text = ''; }
    try {
      if (text) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: text } }));
    } catch { /* never break the prompt */ }
    process.exit(0);
  });
  process.stdin.on('error', () => process.exit(0));
}
