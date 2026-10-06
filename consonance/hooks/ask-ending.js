// ask-ending.js - G3, THE "WANT ME TO…?" ENDING, in SHADOW (D248; C's CLAUDE.md audit, exo_memory/handback/p-claudemd-C_2026-10-06.md "GATES"; the librarian ruled
// G3 SHADOW ONLY, for a trial week).
//
// A Stop hook. It reads the reply this turn ends on, takes its LAST NON-EMPTY LINE, and tests it with C's M1 pattern (copied from C's measuring script, the one
// that counted 109 of 2,182 turn endings, so the shadow log counts the same thing M1 counted). It NEVER BLOCKS: no output, exit 0, on every path. It only logs.
//
// THE LOG, <data dir>/ask-ending.jsonl, one row per turn end: the seat, the project (the cwd's folder name), what kind of prompt the turn answered (M1 counted only
// turns the user started: a keep-warm, a chair or pane packet, a paste or a task notification is `relay`), whether the reply called AskUserQuestion (a real,
// structured question, which a blocking version would let pass), and whether the last line matched. The line's text is kept ONLY when it matched, clipped and
// with secret shapes redacted, so the week's review can read whether each flagged ending was a real question for the user or a permission-ask.
//
// THE REVIEW RULE (C's, the reply-slot's): after the week, if more than 1 in 3 flagged endings are real questions that are the user's to answer, it stays in
// shadow; otherwise blocking is decided on this log. This hook does not decide that, and it has no blocking mode to switch on.
//
// FAILS OPEN (it can only fail silent: it never blocks) on any error; never logs a secret.
'use strict';

if (process.env.CONSONANCE_DREAM) process.exit(0);   // THE DREAM GATE (dream-gate.test.js): the gap-dream gets no hooks

const fs = require('fs');
const os = require('os');
const path = require('path');

const LEDGER = 'ask-ending.jsonl';
const WATCHDOG_MS = 5000, TAIL_BYTES = 4 * 1024 * 1024;
// C's M1 pattern, verbatim from the measuring script (cm/turns.js:10), applied as M1 applied it: to the reply's last non-empty line.
const ASK = /(want me to|should i|shall i|would you like me to|do you want me to|would you like to|want to (?:try|go|do|see)|ready for me to)[^?]{0,200}\?\s*\**\s*$/i;
// M1's relay prompts (cm/turns.js): turns the user did not start.
const RELAY = (txt) => /^\s*\[(keep-warm|chair:|pane:|lib)/i.test(txt) || /<pasted_content|<task-notification|<command-name>|<local-command|<system-reminder>/.test(txt);
const SECRET_SHAPES = [
  /\bsk-or-[A-Za-z0-9_-]{16,}/g, /\bsk-ant-[A-Za-z0-9_-]{16,}/g, /\bvck_[A-Za-z0-9_-]{16,}/g, /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}/g,
  /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}|\bgithub_pat_[A-Za-z0-9_]{22,}/g, /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g, /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  /\bBearer\s+[A-Za-z0-9._~+/-]{20,}/gi, /\b[A-Za-z0-9_]*(?:API_KEY|APIKEY|SECRET|TOKEN|PASSWORD)\s*[:=]\s*["']?[A-Za-z0-9_\-/+=.]{16,}/gi,
];
const scrub = (s) => { let m = String(s == null ? '' : s); for (const re of SECRET_SHAPES) m = m.replace(re, '<redacted>'); return m; };

function dataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try { const d = String((JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '')) || {}).data_dir || '').trim(); if (d) return d; } catch (_) { /* no config */ }
  return null;
}
function record(dir, row) {
  if (!dir) return false;
  try { fs.mkdirSync(dir, { recursive: true }); fs.appendFileSync(path.join(dir, LEDGER), JSON.stringify({ t: new Date().toISOString(), ...row }) + '\n'); return true; } catch (_) { return false; }
}

const textOf = (c) => (typeof c === 'string' ? c : Array.isArray(c) ? c.filter((b) => b && b.type === 'text').map((b) => b.text || '').join('') : '');
/** A user entry that STARTS a turn: it has text and is not a tool result (the same boundary the sources gate uses). */
const isPrompt = (e) => e && e.type === 'user' && !e.isMeta && !!textOf(e.message && e.message.content).trim() && !(Array.isArray(e.message && e.message.content) && e.message.content.some((b) => b && b.type === 'tool_result'));
/** The turn being stopped: its prompt, the reply's last text, and whether it called AskUserQuestion. */
function lastTurn(entries) {
  let i = entries.length - 1; while (i >= 0 && !isPrompt(entries[i])) i--;
  const prompt = i >= 0 ? textOf(entries[i].message.content) : '';
  let last = null, auq = false;
  for (const e of entries.slice(i + 1)) {
    if (e.type !== 'assistant' || !Array.isArray(e.message && e.message.content)) continue;
    for (const b of e.message.content) { if (b.type === 'text' && b.text && b.text.trim()) last = b.text; if (b.type === 'tool_use' && b.name === 'AskUserQuestion') auq = true; }
  }
  return { prompt, last, auq, found: i >= 0 };
}
const tailLine = (text) => (String(text || '').trim().split(/\n/).filter((l) => l.trim()).slice(-1)[0] || '');
function readTail(p) {
  const size = fs.statSync(p).size, start = Math.max(0, size - TAIL_BYTES), fd = fs.openSync(p, 'r');
  try { const buf = Buffer.alloc(size - start); fs.readSync(fd, buf, 0, buf.length, start); let t = buf.toString('utf8'); if (start > 0) t = t.slice(t.indexOf('\n') + 1);
    const out = []; for (const l of t.split('\n')) { if (!l.trim()) continue; try { out.push(JSON.parse(l)); } catch (_) { /* partial */ } } return out; } finally { fs.closeSync(fd); }
}
function judge(entries) {
  const t = lastTurn(entries); if (!t.last) return null;
  const line = tailLine(t.last), matched = ASK.test(line);
  return { promptKind: !t.found ? 'unknown' : RELAY(t.prompt) ? 'relay' : 'user', auq: t.auq, matched, ...(matched ? { line: scrub(line).slice(-240) } : {}) };
}

function main() {
  setTimeout(() => process.exit(0), WATCHDOG_MS).unref();
  let payload; try { payload = JSON.parse(fs.readFileSync(0, 'utf8')); } catch (_) { return process.exit(0); }
  const dir = dataDir(); if (!dir || !payload || !payload.transcript_path) return process.exit(0);
  let j; try { j = judge(readTail(payload.transcript_path)); } catch (e) { record(dir, { decision: 'error', error: String(e && e.message || e).slice(0, 80) }); return process.exit(0); }
  if (j) record(dir, { seat: (process.env.CONSONANCE_PANE || '').trim() || null, session: payload.session_id || null, project: payload.cwd ? path.basename(payload.cwd) : null, mode: 'shadow', ...j });
  return process.exit(0);   // SHADOW: never blocks, never prints
}

if (require.main === module) { try { main(); } catch (_) { process.exit(0); } }

module.exports = { ASK, RELAY, LEDGER, lastTurn, tailLine, judge, scrub, isPrompt };
