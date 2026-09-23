// UserPromptSubmit hook — Jev's NOT-CLEAN L2 verdicts, into the CHAIR's and the LIBRARIAN's prompt context only. D108.
//
// THE DECISION, at source: exo_memory/librarian/2026-09-22.md "11:0x". The keeper asked the librarian what it suggests; it
// dropped L3 from judge mode (jev-judge.js) and sent L2 verdicts that are not clean to the chair and the librarian only —
// never the judged seat, never a pane, never a statement about the keeper.
//
// WHAT SURFACES, one line per verdict, newest first:
//   [jev L2 · unverified] <seat> · turn HH:MM · drift p=0.56
// A row surfaces when ALL hold. Each rule below is pinned by a test.
//   · it is an `ok` row of level l2 in <LOCALAPPDATA>/consonance/jev-shadow/jev_judge.jsonl (the runner's store). NOTHING
//     L3 ever surfaces.
//   · the verdict is `drift` (at any probability; the probability is printed), or `abstain` CHOSEN at p >= ABSTAIN_MIN.
//   · its turn is within WINDOW_HOURS of now.
//   · the reader is the chair or the librarian: CONSONANCE_PANE, which Consonance sets on every seat it spawns
//     (main.rs:1150), equals MAIN_SID or LIBRARIAN_SID, both read from THIS checkout's main.rs. A pane, or a session
//     Consonance did not spawn, sees nothing.
//   · the row is not about the reader itself (never the judged seat) and not about the Third Place (below).
// At most MAX_LINES lines. When there are more, the last line counts the rest rather than dropping them silently.
//
// THE NUMBERS ARE DEFAULTS, argued from D's ledger on 2026-09-22 (the ok L2 rows; every non-clean one read against its
// capture: the user message and the move judged):
//   · ABSTAIN_MIN 0.80. EVERY abstain on D, 7 of 7 (p 0.56–0.73), was a keep-warm reply: the chair's "Reply with exactly:
//     ok" and the move "ok". That is the "bare token" the L2 prompt itself tells the judge to abstain on, so those
//     abstains are RIGHT, and surfacing them would put keep-warm noise in the chair's context. I first set 0.60, arguing a
//     confident abstain meant broken input. The data refuted that before it shipped. 0.80 is above every abstain
//     measured, so an abstain that surfaces is outside what n=7 has seen. FALSIFIER: if a keep-warm "ok" is ever
//     abstained at >= 0.80, this bar is noise too, and abstain should not surface at all.
//   · WINDOW_HOURS 12 and MAX_LINES 5. Drift ran 11 times on D over about a day, mostly at p 0.46–0.64. Five lines is a
//     working shift's worth without filling the context. A flag older than a shift is history; the ledger keeps it.
//
// THE THIRD PLACE IS NOT SURFACED, although it is judged at L2 (the keeper's 05:2x ruling). Its header's guarantee is "no
// channel to the work" (ui/index.html, L082), and a line in the chair's context about the Third Place's moves would be
// exactly such a channel. Whether its L2 verdicts should reach the work is the keeper's call. SURFACE_THIRD_PLACE is the
// one-line change if he says yes.
//
// NEVER A STATEMENT ABOUT THE KEEPER. An L2 row judges a SEAT's own move. The line names the seat, the time, the verdict
// and its probability, and nothing from the prompt or the answer. The never-pathologize standing rule binds every reader.
//
// THE LAW EVERY PROMPT HOOK HERE KEEPS: every path exits 0, and a throw, no store or a bad line are all silence. It must
// never be the reason a prompt fails to submit. The dream runner sets CONSONANCE_DREAM, and this hook is silent there.
//
// WHAT THIS CANNOT DO: reach a seat it is not registered in. It is a hook, so it runs only where settings.json names it,
// on each machine. Registered on L 2026-09-23 (L089, the keeper's authorization by name) through install.ps1's $files and
// $register; D gets it at its next install. It runs from ~/.claude/shell/hooks/ and finds the room through room_path.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const ABSTAIN_MIN = 0.80;
const WINDOW_HOURS = 12;
const MAX_LINES = 5;
const SURFACE_THIRD_PLACE = false;

/** MAIN_SID, LIBRARIAN_SID and THIRD_PLACE_SID from a main.rs, or nulls. */
function seatIds(mainRs) {
  let src = '';
  try { src = fs.readFileSync(mainRs, 'utf8'); } catch { /* no checkout: no ids, nothing surfaces */ }
  const get = (name) => { const m = new RegExp(`const ${name}: &str = "([^"]+)"`).exec(src); return m ? m[1] : null; };
  return { main: get('MAIN_SID'), librarian: get('LIBRARIAN_SID'), thirdPlace: get('THIRD_PLACE_SID') };
}

const hhmm = (ms) => { const d = new Date(ms); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

/** The flag lines this reader should see. Pure: rows in, lines out. */
function flagLines({ rows, pane, ids, now = Date.now() }) {
  if (!pane || !ids || !ids.main || !ids.librarian) return [];
  if (pane !== ids.main && pane !== ids.librarian) return [];
  const since = now - WINDOW_HOURS * 3600 * 1000;
  const hits = [];
  for (const r of rows || []) {
    if (!r || r.status !== 'ok' || r.level !== 'l2') continue;
    if (r.session_id === pane) continue;
    if (!SURFACE_THIRD_PLACE && (r.session_id === ids.thirdPlace || r.seat === 'third place')) continue;
    const t = Date.parse(r.turn_ts || r.ts);
    if (!Number.isFinite(t) || t < since || t > now + 60000) continue;
    const v = r.jev && r.jev.verdict;
    if (!v || typeof v.choice !== 'string') continue;
    const p = v.probabilities && typeof v.probabilities[v.choice] === 'number' ? v.probabilities[v.choice] : null;
    if (v.choice === 'drift' || (v.choice === 'abstain' && p != null && p >= ABSTAIN_MIN)) {
      const seat = String(r.seat || r.session_id || '?').replace(/[\r\n]/g, ' ').slice(0, 40);
      hits.push({ t, line: `[jev L2 · unverified] ${seat} · turn ${hhmm(t)} · ${v.choice}${p == null ? '' : ` p=${p.toFixed(2)}`}` });
    }
  }
  hits.sort((a, b) => b.t - a.t);
  if (hits.length <= MAX_LINES) return hits.map((h) => h.line);
  const shown = hits.slice(0, MAX_LINES).map((h) => h.line);
  shown[MAX_LINES - 1] += ` · (+${hits.length - MAX_LINES} more in ${WINDOW_HOURS} h, jev_judge.jsonl)`;
  return shown;
}

function readRows(file) {
  let text = '';
  try { text = fs.readFileSync(file, 'utf8'); } catch { return []; }
  const out = [];
  for (const l of text.split('\n')) { if (!l.trim()) continue; try { out.push(JSON.parse(l)); } catch { /* a bad line is skipped */ } }
  return out;
}

/**
 * THE CHECKOUT'S main.rs, found the room's way (L089). install.ps1 COPIES this hook to ~/.claude/shell/hooks/, where
 * `__dirname/../src-tauri` does not exist — the first build resolved only from there, so an installed copy found no seat
 * ids and was silent on every prompt, forever, while `install.ps1 -Check` read ok. So: `room_path` in ~/.consonance.json
 * first (it is `<repo>/exo_memory/BOOT.md`; the peer hooks read that file the same way — userprompt-submit.js's chain
 * line, transcript-watch.js `dataDir()`), then this file's own checkout for a repo-local run.
 * `{ file, tier }` when found; `{ file: null, why }` naming every place tried, when not.
 */
function mainRsPath(home = os.homedir()) {
  const tried = [];
  let cfg = null;
  try {
    cfg = JSON.parse(fs.readFileSync(path.join(home, '.consonance.json'), 'utf8').replace(/^﻿/, ''));
  } catch (e) {
    tried.push(e && e.code === 'ENOENT' ? '~/.consonance.json does not exist' : '~/.consonance.json could not be read as JSON');
  }
  if (cfg) {
    const room = cfg.room_path != null ? String(cfg.room_path).trim() : '';
    if (room) {
      const f = path.join(path.dirname(path.dirname(room)), 'consonance', 'src-tauri', 'src', 'main.rs');
      if (fs.existsSync(f)) return { file: f, tier: '~/.consonance.json room_path' };
      tried.push(`room_path ${room} does not lead to consonance/src-tauri/src/main.rs`);
    } else {
      tried.push('~/.consonance.json has no room_path');
    }
  }
  const local = path.join(__dirname, '..', 'src-tauri', 'src', 'main.rs');
  if (fs.existsSync(local)) return { file: local, tier: 'the checkout beside this file' };
  tried.push('no checkout beside this file');
  return { file: null, why: tried.join('; ') };
}

function main(env = process.env) {
  if (env.CONSONANCE_DREAM) return '';
  if (!env.LOCALAPPDATA) return '';
  const where = mainRsPath();
  // LOUD, NOT SILENT (L089). Silence is this hook's answer to every failure because it must never break a prompt — and
  // that is exactly what hid the installed copy. A room it cannot find is not "nothing to report"; it is a broken install,
  // so it says so, in every Consonance seat, until fixed. It carries no verdict and names no seat.
  if (!where.file) {
    return env.CONSONANCE_PANE
      ? `[jev-flags hook: cannot find the room, so Jev's L2 flags cannot surface here — ${where.why}. Fix: set room_path in ~/.consonance.json.]`
      : '';
  }
  const ids = seatIds(where.file);
  const rows = readRows(path.join(env.LOCALAPPDATA, 'consonance', 'jev-shadow', 'jev_judge.jsonl'));
  const now = env.JEV_FLAGS_NOW ? Date.parse(env.JEV_FLAGS_NOW) : Date.now();
  return flagLines({ rows, pane: env.CONSONANCE_PANE, ids, now }).join('\n');
}

module.exports = { flagLines, seatIds, readRows, mainRsPath, main, ABSTAIN_MIN, WINDOW_HOURS, MAX_LINES, SURFACE_THIRD_PLACE };

if (require.main === module) {
  // THE DREAM GATE, in the room's census form (L089) — dream-gate.test.js recognises exactly this line. The check inside
  // main() is the same rule for callers that import the module; this is the one the census can see.
  if (process.env.CONSONANCE_DREAM) process.exit(0);
  let text = '';
  try { text = main(); } catch { text = ''; }
  try {
    if (text) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: text } }));
  } catch { /* a hook that cannot report must still not break the prompt */ }
  process.exit(0);
}
