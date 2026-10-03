// reply-slot.js - the REPLY SLOT, LIVE since D220 (built in SHADOW at D218; plan: exo_memory/loop/plan_finish_retrieval_2026-10-03.md "Chunk 1, D218"; the keeper, 03:52: "lets finish it all").
// D220: the replay of the librarian's past replies scored REAL 18 of 30 (bar 15), so a would-block is now a BLOCK: Stop JSON {"decision":"block","reason":...}, ONCE per turn
// (stop_hook_active is the loop guard), and the reason names the unbacked tokens and the two ways out. The rate clause: more than 1 in 3 token-bearing replies still blocked after
// a week and the slot goes back to shadow (set SHADOW = true). The shadow paragraph below is the D218 text, kept as the record of how it was built.
//
// A Stop hook for the LIBRARIAN and CHAIR sessions only. When such a seat ends a turn that was a reply to the KEEPER and the reply names a path, a sha, a commit,
// a count N/M, a percentage or a version, the reply is expected to END with one line, `Sources: <path> · <path> · `<command>``, whose items match calls that
// completed in that turn. This hook checks that and WRITES DOWN what it WOULD block, to <data>/reply-slot.jsonl. **IT NEVER BLOCKS IN SHADOW**: it prints nothing
// and exits 0 on every path. The block is built (`verdict` with {live: true}) and tested, and `main` passes live:false as a constant, so going live is a ruling plus a
// one-word change, not new code.
//
// THE STOP-HOOK CONTRACT (Claude Code hooks reference, code.claude.com/docs/en/hooks, read 2026-10-03). Stop input carries `stop_hook_active`, `transcript_path`
// and `last_assistant_message` (Claude Code v2.1.196 or later: "use this instead of reading the transcript file, which may lag"). To BLOCK the stop: exit 0 with
// top-level JSON `{"decision":"block","reason":"..."}` (or exit 2 with the message on stderr); "Prevents Claude from stopping, continues the conversation". Exit 0 with
// no output produces no decision and the stop proceeds. `stop_hook_active` is "true when a Stop hook is currently running or has run during this turn: use this to
// avoid infinite loops", so a hook that blocks must skip its action when it is already true; THIS hook skips on it in shadow too (a `skip-active` row), because the
// day it goes live a block whose own reply ends the turn again would otherwise ask for the slot forever. All matching Stop hooks run in parallel. SubagentStop is a
// separate event and is not registered.
//
// WHO. `CONSONANCE_PANE` equals the fixed session id of Main (the chair) or of the librarian (the constants in consonance/src-tauri/src/main.rs, MAIN_SID and
// LIBRARIAN_SID), or, with no such variable, the session's cwd is the `instances/main` or `instances/librarian` directory. Every committee pane (A, B, C ...) and every
// other session is ignored without a row.
//
// WHICH TURNS. Only a turn whose last prompt is KEEPER-FACING: a keeper message; and, IN THE LIBRARIAN SESSION ONLY, a pasted `[pane:` ring (the librarian's ruling, 2026-10-03,
// plan_finish_retrieval "QS2S two-reader SCORE": the keeper reads every reply in that pane, and most of the keeper-facing prose there answers a pane ring). NOT a keep-warm, a chair
// ring, a slash command or a machine notification, in either session; and in the CHAIR session a pane ring stays skipped (the keeper reads the chair's ring replies less). A
// notification between the prompt and the reply does not change that (the sources-gate's turn boundary, D214). A keep-warm "ok" passes untouched.
//
// REUSE, NOT COPY. The turn reader (readTurnEntries / turnCalls / isPrompt), the item grammar (parseSources) and the matcher (itemMatches) are the SOURCES gate's, taken
// with require('./sources-gate.js'): installed side by side in ~/.claude/shell/hooks/. If it cannot be loaded this hook fails open with an error row.
//
// FAILS OPEN on every error, and on a 5 s watchdog. NO MESSAGE TEXT is stored: a sha256 of the reply, its length, the flagged tokens (clipped, redacted) and, for an
// unmatched Sources item, that item.
'use strict';

// THE DREAM GATE, the same one every hook here carries (dream-gate.test.js polices it): the gap-dream is an anti-instruction and gets no hooks.
if (process.env.CONSONANCE_DREAM) process.exit(0);

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const LEDGER = 'reply-slot.jsonl';
const WATCHDOG_MS = 5000;
const SHADOW = false;   // main() passes live: !SHADOW. D220: LIVE. The replay scored REAL 18 of 30 against the 15 bar (plan_reply_slot_replay_d220, "SCORE"). Flipping this constant is the whole difference between shadow and live; it is a ruling, not a default, and a test pins it.
// The two fixed session ids (consonance/src-tauri/src/main.rs: MAIN_SID at "fixed session id, so Main --resumes itself", LIBRARIAN_SID). A test pins them to main.rs.
const SEAT_IDS = { 'MAIN': '0c0c0c0a-0000-4000-8000-000000000a01', 'LIBRARIAN': '0c0c0c0b-0000-4000-8000-00000000115b' };
const INSTANCE_DIRS = { main: 'chair', librarian: 'librarian' };

let G = null, GATE_ERR = '';
try { G = require('./sources-gate.js'); } catch (e) { GATE_ERR = String((e && e.code) || (e && e.message) || e).slice(0, 80); }

const clip = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
function dataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '');
    const d = String((JSON.parse(raw) || {}).data_dir || '').trim();
    if (d) return d;
  } catch (_) { /* no config: no data dir: nothing is logged */ }
  return null;
}
function record(dir, row) { try { fs.appendFileSync(path.join(dir, LEDGER), JSON.stringify({ ts: new Date().toISOString(), ...row }) + '\n'); return true; } catch (_) { return false; } }

// ------------------------------------------------------------------ who

/** 'chair' | 'librarian' | null. The pane id decides when it is set; the instance directory decides when it is not. */
function seatOf(env, cwd) {
  const pane = String((env && env.CONSONANCE_PANE) || '').trim().toLowerCase();
  if (pane) {
    if (pane === SEAT_IDS.MAIN) return 'chair';
    if (pane === SEAT_IDS.LIBRARIAN) return 'librarian';
    return null;   // a pane id that is not one of the two fixed ones is a committee pane: ignored, whatever its cwd
  }
  const c = String(cwd || '').toLowerCase().replace(/\\/g, '/').replace(/\/+$/, '');
  const m = c.match(/\/instances\/(main|librarian)$/);
  return m ? INSTANCE_DIRS[m[1]] : null;
}

// ------------------------------------------------------------------ the tokens that make a reply a claim about state

const TOKEN_KINDS = [
  ['path', /(?:\b[A-Za-z]:[\\/][^\s`'"<>|)]+|\b(?:exo_memory|consonance|dev|src|src-tauri|test|app|jev)[\\/][\w.\\/-]+|\b[\w.-]+(?:[\\/][\w.-]+)+\.[A-Za-z]{1,5}\b)/g],
  // a sha has a letter AND a digit (an all-digit 7-hex string is indistinguishable from a number, and is caught only after the word "commit", below)
  ['sha', /\b(?=[0-9a-f]*[a-f])(?=[0-9a-f]*\d)[0-9a-f]{7,64}\b/g],
  ['commit', /\bcommit(?:ted)?\s+[`(]?[0-9a-f]{7,40}\b/gi],
  ['count', /(?<![\w./\\-])\d+\/\d+(?![\w/\\-]|\.\w)|\b\d+\s+of\s+\d+\b/g],   // a sentence-final full stop after N/M is allowed; a path or a date with a year (10/03/2026) is not read as a count
  ['percentage', /\b\d+(?:\.\d+)?\s?%/g],
  ['version', /\bv\d+\.\d+(?:\.\d+)*\b|\b\d+\.\d+\.\d+(?:\.\d+)*\b/g],
];
/** The tokens a reply names: [{kind, text}], text clipped to 80 and redacted. At most 12. NO surrounding text is kept. */
function tokensIn(reply) {
  const out = [], seen = new Set();
  for (const [kind, re] of TOKEN_KINDS) {
    for (const m of String(reply).matchAll(re)) {
      const trimmed = m[0].replace(/[.,;:!?)\]'"]+$/, '');   // a sentence-final full stop or a closing bracket is not part of the token
      const text = clip(G ? G.scrub(trimmed) : '<unscrubbed>', 80), key = kind + '|' + text;
      if (seen.has(key)) continue; seen.add(key); out.push({ kind, text });
      if (out.length >= 12) return out;
    }
  }
  return out;
}

// ------------------------------------------------------------------ which turns: a reply to the KEEPER

const WRAPPERS = [/<system-reminder>[\s\S]*?<\/system-reminder>/g, /<([a-z-]*hook[a-z-]*)>[\s\S]*?<\/\1>/gi];
const PASTE_OPEN = /<pasted_content id="?[^">]*"?>/g;
const RING = /^\s*\[(chair:|pane:|librarian:|keep-warm|sync|lap |orchestrator)/i;
const PANE_RING = /^\s*\[pane:/i;   // the ring a committee pane sends the librarian (call_librarian renders it as `[pane:<letter>] ...`)
const KEEPWARM = /^\s*\[keep-warm|reply with exactly: ok\s*$/i;
// D199's keeper.js MACHINE forms (the prompts that are NOT a keeper's turn): task notification, local-command echo, interrupt, compaction preamble, overseer, system banner, a bare slash command, the gap-dream preamble.
const MACHINE = /^\s*(<task-notification|<local-command|<command-name|<command-message|Caveat: The messages below|\[Request interrupted|This session is being continued|You are an (L3 )?overseer|\[SYSTEM|\/[a-z][\w:-]*\s*$|This is a gap-)/i;
const textOfContent = (c) => (typeof c === 'string' ? c : Array.isArray(c) ? c.filter((p) => p && p.type === 'text').map((p) => p.text || '').join('\n') : '');
/**
 * Did a machine notification START this turn? The sources gate does not treat a notification as a boundary (the seat's work runs through it), so a turn that a notification
 * kicked off while the seat was IDLE still looks, to isPrompt, like a continuation of the keeper's last prompt. It is told apart by what sits just before the notification: an
 * assistant message with no tool call in it is a turn that had ENDED (the seat was idle); a tool result is a turn still running (the notification arrived mid-work).
 */
function startedByNotification(live, from) {
  let prev = null;
  for (let j = from; j < live.length; j++) {
    const e = live[j], m = e && e.message; if (!m) continue;
    if (m.role === 'user' && !(Array.isArray(m.content) && m.content.some((p) => p && p.type === 'tool_result')) && G.isNotificationOnly(e, textOfContent(m.content))) {
      if (prev && prev.message.role === 'assistant' && !(Array.isArray(prev.message.content) && prev.message.content.some((p) => p && p.type === 'tool_use'))) return true;
    }
    prev = e;
  }
  return false;
}
/** 'keeper' | 'keepwarm' | 'pane-ring' | 'ring' | 'machine' | null (no prompt found), for the turn's last prompt. 'pane-ring' is a `[pane:` ring, told apart from the other rings so the verdict can treat it by seat. */
function promptKind(entries) {
  const live = entries.filter((e) => e && !e.isSidechain);
  for (let i = live.length - 1; i >= 0; i--) {
    if (!G.isPrompt(live[i])) continue;
    if (startedByNotification(live, i + 1)) return 'machine';
    const c = live[i].message.content;
    let t = typeof c === 'string' ? c : Array.isArray(c) ? c.filter((p) => p && p.type === 'text').map((p) => p.text || '').join('\n') : '';
    for (const re of WRAPPERS) t = t.replace(re, '');
    t = t.replace(PASTE_OPEN, '').trim();
    if (KEEPWARM.test(t)) return 'keepwarm';
    if (PANE_RING.test(t)) return 'pane-ring';
    if (RING.test(t)) return 'ring';
    if (MACHINE.test(t)) return 'machine';
    if (live[i].origin && live[i].origin.kind === 'task-notification') return 'machine';
    return 'keeper';
  }
  return null;
}

// ------------------------------------------------------------------ the slot: a FINAL Sources: line

/** The reply's last non-empty line, if it is a `Sources:` line (any case, markdown emphasis tolerated), as { present, none, items }; present false otherwise. */
function slotOf(reply) {
  const lines = String(reply).split(/\r?\n/);
  let last = lines.length - 1; while (last >= 0 && !lines[last].trim()) last--;
  if (last < 0) return { present: false, none: false, items: [] };
  // the slot may continue over several lines directly above the end, so walk up to its head over lines that are not blank
  let head = -1;
  for (let i = last; i >= 0 && lines[i].trim(); i--) if (/^\s*[*_>\-\s]*sources[*_]*\s*:/i.test(lines[i])) { head = i; break; }
  if (head < 0) return { present: false, none: false, items: [] };
  // reuse the gate's own item grammar: hand it the slot with the head normalised to the uppercase form it reads
  const slot = lines.slice(head, last + 1).join('\n').replace(/^\s*[*_>\-\s]*sources([*_]*\s*:)/i, 'SOURCES$1');
  return G.parseSources(slot);
}

// ------------------------------------------------------------------ the verdict

/**
 * The whole decision, no I/O. Returns { kind, wouldBlock, tokens, items, unmatched, none, nCalls, output }.
 * `output` is null unless live is true AND the verdict is a block AND stop_hook_active is false: then it is the Stop block JSON. In shadow it is always null.
 */
function verdict({ reply, entries, stopHookActive, live = false, seat = null }) {
  const r = { kind: '', prompt: null, wouldBlock: false, tokens: [], items: [], unmatched: [], none: false, nCalls: 0, output: null };
  if (stopHookActive) { r.kind = 'skip-active'; return r; }   // THE LOOP GUARD: a Stop hook has already run this turn; do nothing
  const text = String(reply == null ? '' : reply);
  if (/^\s*ok[.!]?\s*$/i.test(text) || !text.trim()) { r.kind = 'skip-keepwarm'; return r; }
  let pk = promptKind(entries); r.prompt = pk;
  if (pk === 'keepwarm') { r.kind = 'skip-keepwarm'; return r; }
  // D218 scope fix (the librarian's ruling): in the LIBRARIAN session a pane ring's reply is keeper-facing; in the chair's (or with no seat named) it stays skipped
  if (pk === 'pane-ring') pk = seat === 'librarian' ? 'keeper' : 'ring';
  if (pk !== 'keeper') { r.kind = pk ? 'skip-not-keeper-' + pk : 'skip-no-prompt'; return r; }
  r.tokens = tokensIn(text);
  if (!r.tokens.length) { r.kind = 'pass-notoken'; return r; }
  const slot = slotOf(text);
  r.none = slot.none; r.items = slot.items;
  const calls = G.turnCalls(entries, {}); r.nCalls = calls.length;
  if (!slot.present) r.kind = 'would-block-missing';
  else if (slot.none) r.kind = 'pass-none';
  else if (!slot.items.length) r.kind = 'would-block-empty';
  else {
    r.unmatched = slot.items.filter((it) => !G.itemMatches(it, calls, ''));
    r.kind = r.unmatched.length ? 'would-block-unmatched' : 'pass-matched';
  }
  r.wouldBlock = r.kind.startsWith('would-block');
  if (live && r.wouldBlock) {
    const named = r.unmatched.length ? ' These Sources items match nothing you opened or ran in this turn: ' + r.unmatched.map((u) => '"' + clip(u, 120) + '"').join(' ; ') + '.' : '';
    const why = r.kind === 'would-block-missing' ? 'does not END with a Sources: line' : r.kind === 'would-block-empty' ? 'ends with an EMPTY Sources: line' : 'ends with a Sources: line some of whose items you did not open or run';
    const shown = r.tokens.slice(0, 6).map((t) => t.kind + ' ' + clip(String(t.text).replace(/`/g, "'"), 60)).join(' ; ') + (r.tokens.length > 6 ? ' ; and ' + (r.tokens.length - 6) + ' more' : '');
    r.output = { decision: 'block', reason: 'REPLY SLOT: this reply names ' + shown + ' and ' + why + ' whose items you opened or ran in THIS turn (a figure carried from the prompt or an earlier turn counts as unbacked).' + named + ' Fix it now, in this turn, in one of two ways: (1) OPEN the source first (Read / Grep, or run the command), then send the reply again ending with a final line `Sources: <path> · \`<command>\`` that lists only what you opened or ran this turn (repo-relative or C:\\... paths); or (2) drop the claim from the reply, or end with `Sources: none` if it states nothing checkable. This hook blocks once per turn: your next reply ends the turn.' };
  }
  return r;
}

// ------------------------------------------------------------------ main

function main() {
  setTimeout(() => process.exit(0), WATCHDOG_MS).unref();   // fail OPEN on a hang
  let payload;
  try { payload = JSON.parse(fs.readFileSync(0, 'utf8')); } catch (_) { return process.exit(0); }
  if (!payload || typeof payload !== 'object') return process.exit(0);
  const seat = seatOf(process.env, payload.cwd);
  if (!seat) return process.exit(0);   // a committee pane or any other session: no row, no output
  const dir = dataDir();
  const sid = String(payload.session_id || '').slice(0, 8);
  const log = (row) => (dir ? record(dir, { v: 1, shadow: SHADOW, seat, session: sid, ...row }) : false);   // true only when the row is on disk
  if (!G) { log({ kind: 'error', error: 'sources-gate: ' + GATE_ERR }); return process.exit(0); }
  const reply = typeof payload.last_assistant_message === 'string' ? payload.last_assistant_message : null;
  if (reply === null) { log({ kind: 'error', error: 'no last_assistant_message (Claude Code older than v2.1.196?)' }); return process.exit(0); }
  const replySha = sha256(reply);
  let entries;
  try { entries = payload.stop_hook_active ? [] : G.readTurnEntries(payload.transcript_path); }
  catch (e) { log({ kind: 'error', replySha, error: 'transcript: ' + String((e && e.message) || e).slice(0, 80) }); return process.exit(0); }
  let v;
  try { v = verdict({ reply, entries, stopHookActive: !!payload.stop_hook_active, live: !SHADOW, seat }); }
  catch (e) { log({ kind: 'error', replySha, error: 'verdict: ' + String((e && e.message) || e).slice(0, 80) }); return process.exit(0); }
  const logged = log({ kind: v.kind, prompt: v.prompt, wouldBlock: v.wouldBlock, blocked: !!v.output, replySha, replyChars: reply.length, tokenKinds: [...new Set(v.tokens.map((t) => t.kind))], tokens: v.tokens, nSources: v.items.length, none: v.none, unmatched: v.unmatched.slice(0, 12).map((x) => clip(G.scrub(x), 200)), nCalls: v.nCalls });
  if (v.output && logged) {   // D220: block only AFTER the row is on disk (the sources gate's rule): no data dir or an unwritable ledger means the stop proceeds
    process.stdout.write(JSON.stringify(v.output), () => process.exit(0)); setTimeout(() => process.exit(0), 1000).unref(); return; }
  return process.exit(0);
}

if (require.main === module) { try { main(); } catch (_) { process.exit(0); } }   // fail OPEN, without exception

module.exports = { LEDGER, SHADOW, SEAT_IDS, TOKEN_KINDS, seatOf, tokensIn, promptKind, slotOf, verdict };
