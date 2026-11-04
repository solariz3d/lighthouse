#!/usr/bin/env node
// reply-slot-replay.js - D220 step 1 (seat A). Replays the INSTALLED reply slot's verdict() over the librarian's past replies and writes the counts, every
// would-block with its turn's calls, and the draw B judges. It JUDGES NOTHING: no REAL/NOT, no comment on whether a flag is right.
//
//   node consonance/tools/reply-slot-replay.js [--out <file>] [--from <ISO>] [--to <ISO>]      (run it under heavy-run's hold: see runReplay in the hand-back)
//
// The verdict logic is NOT copied: it is `require`d from the installed hook (~/.claude/shell/hooks/reply-slot.js, with its sibling sources-gate.js), unmodified;
// the script prints both file hashes so a reader can see which logic ran. A Stop point is an assistant message that carries text and stops with `end_turn`;
// its reply is that message's text (what the Stop hook receives as last_assistant_message) and its entries are the transcript from the turn's last prompt to it.
// Hygiene: every string written goes through the gate's secret scrub; lines naming the Third Place are removed (counted, never quoted); no tool RESULT is written.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const HOOKS = path.join(os.homedir(), '.claude', 'shell', 'hooks');
const RS = require(path.join(HOOKS, 'reply-slot.js'));
const G = require(path.join(HOOKS, 'sources-gate.js'));
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const fileSha = (p) => sha256(fs.readFileSync(p));

const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const FROM = Date.parse(arg('--from', '2026-09-28T00:00:00Z'));
const TO = Date.parse(arg('--to', '2026-10-03T10:35:00Z'));
const OUT = arg('--out', path.join(__dirname, '..', '..', 'exo_memory', 'loop', 'reply_slot_replay_2026-10-03.md'));
const TRANSCRIPT = path.join(os.homedir(), '.claude', 'projects', 'C--Consonance-instances-librarian', '0c0c0c0b-0000-4000-8000-00000000115b.jsonl');
const REPLY_CAP = 6000, CMD_CAP = 300;

const THIRD = /third[-_ ]?place|metaxy/i;
const stats = { thirdLinesRemoved: 0, thirdCallsRemoved: 0, thirdTokensRemoved: 0, replyCapped: 0 };
const clip = (s, n) => (s.length > n ? s.slice(0, n) + '…[clipped]' : s);
/** Scrub secrets, take out Third Place lines, make it safe to put inside a fenced block. */
function clean(text) {
  const lines = String(text).split(/\r?\n/).map((l) => { if (THIRD.test(l)) { stats.thirdLinesRemoved++; return '[third-place line removed]'; } return l; });
  return G.scrub(lines.join('\n'));
}
const textOfMsg = (m) => (Array.isArray(m.content) ? m.content.filter((p) => p && p.type === 'text').map((p) => p.text || '').join('\n') : typeof m.content === 'string' ? m.content : '');

/** A call as paths and commands only: name + the one input that says what it opened or ran. Never a result; chair/librarian dispatch bodies and tokens are not written. */
function describeCall(c) {
  const i = c.input || {};
  let what;
  if (c.name === 'Read') what = i.file_path || '';
  else if (c.name === 'Grep') what = 'pattern=' + (i.pattern || '') + (i.path ? ' path=' + i.path : '') + (i.glob ? ' glob=' + i.glob : '');
  else if (c.name === 'Glob') what = (i.pattern || '') + (i.path ? ' path=' + i.path : '');
  else if (c.name === 'Bash' || c.name === 'PowerShell') what = i.command || '';
  else if (c.name === 'WebFetch') what = i.url || '';
  else if (c.name === 'Write' || c.name === 'Edit') what = i.file_path || '';
  else if (/chair_inject/.test(c.name)) what = 'target=' + String(i.target || '');   // the token and the text are never read
  else what = '';
  const line = c.name + (what ? ' ' + what : '');
  if (THIRD.test(line)) { stats.thirdCallsRemoved++; return c.name + ' [third-place call removed]'; }
  return G.scrub(clip(line.replace(/\s+/g, ' '), CMD_CAP));
}

async function main() {
  const rows = [], skipped = {}, evaluated = {};
  let turn = [], lines = 0, stops = 0;
  const rl = readline.createInterface({ input: fs.createReadStream(TRANSCRIPT, { encoding: 'utf8' }), crlfDelay: Infinity });
  for await (const line of rl) {
    lines++;
    if (!line) continue;
    let e; try { e = JSON.parse(line); } catch (_) { continue; }
    const m = e && e.message;
    if (!m || e.isSidechain) continue;
    if (G.isPrompt(e)) turn = [e]; else turn.push(e);
    if (m.role !== 'assistant' || m.stop_reason !== 'end_turn') continue;
    const reply = textOfMsg(m);
    if (!reply.trim()) continue;
    const t = Date.parse(e.timestamp);
    if (!(t >= FROM && t <= TO)) continue;
    stops++;
    const v = RS.verdict({ reply, entries: turn, stopHookActive: false, live: false, seat: 'librarian' });
    if (v.kind.startsWith('skip')) { skipped[v.kind] = (skipped[v.kind] || 0) + 1; continue; }
    evaluated[v.kind] = (evaluated[v.kind] || 0) + 1;
    if (!v.wouldBlock) continue;
    rows.push({ ts: e.timestamp, replySha: sha256(reply), kind: v.kind, prompt: v.prompt, tokens: v.tokens, items: v.items, unmatched: v.unmatched, reply, calls: G.turnCalls(turn, {}).map(describeCall), nCalls: v.nCalls });
  }
  const nEval = Object.values(evaluated).reduce((a, b) => a + b, 0);
  const nPass = Object.entries(evaluated).filter(([k]) => k.startsWith('pass')).reduce((a, [, b]) => a + b, 0);
  rows.sort((a, b) => (a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0));
  rows.forEach((r, i) => { r.id = 'W' + String(i + 1).padStart(3, '0'); r.order = sha256('D220|' + r.replySha); });
  const draw = [...rows].sort((a, b) => (a.order < b.order ? -1 : 1)).slice(0, 30);
  draw.forEach((r, i) => { r.drawn = i + 1; });
  const byKind = {}; for (const r of rows) byKind[r.kind] = (byKind[r.kind] || 0) + 1;

  const o = [];
  o.push('# D220 step 1 - reply-slot REPLAY (seat A), 2026-10-03');
  o.push('');
  o.push('Counts and units only. **Nothing here judges a flag**: no REAL / NOT, no comment on whether a would-block is right (B does that, blind).');
  o.push('');
  o.push('## What ran');
  o.push('- Script: `consonance/tools/reply-slot-replay.js` (`require`s the INSTALLED hook; the verdict logic is not copied).');
  o.push('- Installed `reply-slot.js` sha256 `' + fileSha(path.join(HOOKS, 'reply-slot.js')) + '`; installed `sources-gate.js` sha256 `' + fileSha(path.join(HOOKS, 'sources-gate.js')) + '`; `RS.SHADOW` = ' + RS.SHADOW + ' (verdict called with live:false, seat:"librarian").');
  o.push('- Source: the librarian session transcript `0c0c0c0b-...-00000000115b.jsonl`, ' + lines + ' lines, streamed; window ' + new Date(FROM).toISOString() + ' to ' + new Date(TO).toISOString() + ' (by the assistant message timestamp).');
  o.push('- A Stop point = an assistant message with text and `stop_reason: end_turn` (' + stops + ' in the window). Its reply = that message\'s text blocks; its entries = the transcript from the turn\'s last prompt up to it; calls = `turnCalls` of those entries (completed, non-errored).');
  o.push('');
  o.push('## Counts');
  o.push('- Stop points in window: **' + stops + '**; skipped by the slot (not a keeper-facing turn): **' + (stops - nEval) + '** ' + JSON.stringify(skipped));
  o.push('- **Replies evaluated: ' + nEval + '** (token-bearing or not) - **pass: ' + nPass + '** - **would-block: ' + rows.length + '**');
  o.push('- Evaluated by kind: ' + JSON.stringify(evaluated));
  o.push('- Would-block by kind: ' + JSON.stringify(byKind));
  o.push('@@HYGIENE@@');
  o.push('');
  o.push('## The draw (B judges these): the first 30 would-blocks in sha256("D220|" + replySha) order');
  o.push('');
  o.push('| draw | unit | kind | prompt | order key (first 12) |');
  o.push('|---|---|---|---|---|');
  for (const r of draw) o.push('| ' + r.drawn + ' | ' + r.id + ' | ' + r.kind + ' | ' + r.prompt + ' | ' + r.order.slice(0, 12) + ' |');
  o.push('');
  o.push('## All would-blocks, in time order (' + rows.length + ')');
  for (const r of rows) {
    const rt = clean(r.reply); const shown = rt.length > REPLY_CAP ? (stats.replyCapped++, clip(rt, REPLY_CAP)) : rt;
    o.push('');
    o.push('### ' + r.id + (r.drawn ? '  - DRAWN #' + r.drawn : ''));
    o.push('- time ' + r.ts + ' - kind `' + r.kind + '` - prompt `' + r.prompt + '` - replySha `' + r.replySha.slice(0, 16) + '` - reply chars ' + r.reply.length + (rt.length > REPLY_CAP ? ' (quoted clipped to ' + REPLY_CAP + ')' : '') + ' - calls in turn ' + r.nCalls);
    o.push('- flagged tokens: ' + (r.tokens.length ? r.tokens.map((t) => { const x = THIRD.test(t.text) ? (stats.thirdTokensRemoved++, '[third-place token removed]') : t.text; return t.kind + ' `' + G.scrub(x).replace(/`/g, "'") + '`'; }).join(' ; ') : 'none'));
    if (r.items.length) o.push('- Sources items the reply listed: ' + r.items.map((x) => '`' + G.scrub(THIRD.test(x) ? '[third-place item removed]' : x).replace(/`/g, "'") + '`').join(' ; ') + ' - unmatched: ' + (r.unmatched.length ? r.unmatched.map((x) => '`' + G.scrub(THIRD.test(x) ? '[third-place item removed]' : x).replace(/`/g, "'") + '`').join(' ; ') : 'none'));
    o.push('- reply as quoted:');
    o.push('');
    o.push(shown.split('\n').map((l) => '> ' + l).join('\n'));
    o.push('');
    o.push('- the turn\'s calls (' + r.calls.length + '):');
    if (!r.calls.length) o.push('  - (none)');
    for (const c of r.calls) o.push('  - ' + c.replace(/`/g, "'"));
  }
  const hygiene = '- Hygiene: Third Place lines removed from quoted reply text ' + stats.thirdLinesRemoved + ', calls ' + stats.thirdCallsRemoved + ', tokens ' + stats.thirdTokensRemoved + '; replies clipped at ' + REPLY_CAP + ' chars: ' + stats.replyCapped + "; secrets scrubbed by the gate's own shapes; no tool result written.";
  const text = o.join('\n').replace('@@HYGIENE@@', hygiene) + '\n';
  // THE STRICT KEY SCAN over everything about to be written: the gate's own shapes. A hit is a refusal to write.
  let hits = 0; for (const re of G.SECRET_SHAPES) { const mm = text.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')); if (mm) hits += mm.length; }
  if (hits) { console.error('key scan: ' + hits + ' hit(s); NOT written'); process.exit(4); }
  fs.writeFileSync(OUT, text);
  console.log(JSON.stringify({ out: OUT, lines, stops, evaluated: nEval, pass: nPass, wouldBlock: rows.length, byKind, skipped, evaluatedByKind: evaluated, drawn: draw.length, keyScanHits: hits, stats }));
}
main().catch((e) => { console.error('replay failed: ' + String((e && e.stack) || e).split('\n')[0]); process.exit(1); });
