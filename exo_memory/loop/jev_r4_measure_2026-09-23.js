#!/usr/bin/env node
// jev_r4_measure_2026-09-23.js — L109 (pane A), Jev research R4: cost and input. READ-ONLY over the Jev store; no call is made.
//
//   node exo_memory/loop/jev_r4_measure_2026-09-23.js            # the summary
//   node exo_memory/loop/jev_r4_measure_2026-09-23.js --rows     # plus one line per matched L2 row
//
// Sources: %LOCALAPPDATA%\consonance\jev-shadow\jev_judge.jsonl (usage, ms, cost, prompt_sha256) and judge-captures\*.json
// (the exact prompt). A row counts as MATCHED only when sha256(capture prompt) equals the row's prompt_sha256, so every
// split below is of the prompt Jev was actually sent.
//
// THE SPLIT, at the fixed text of dev/shell/hooks/l2-overseer-worker.js buildOverseerPrompt:
//   header       "You are an overseer…" up to the opening ---
//   discipline   METHOD.md, between the --- markers
//   instructions "You receive ONLY a narrowed view…" up to "Most recent user message:"
//   user         the last user message (the narrowed view, part 1)
//   move         the assistant move judged (the narrowed view, part 2)
//   tail         the abstain rule and the output format
// plus `questions` — Jev's own question and criteria (consonance/tools/jev-shadow.js JUDGES.l2), sent beside the prompt.
//
// TOKENS: the gateway reports one inputTokens per call, not per part. Two estimates, both printed:
//   (a) byte share × inputTokens, per row;
//   (b) a least-squares fit, over rows sharing one discipline, of inputTokens against the VARIABLE bytes (user + move):
//       the intercept is the fixed cost in Jev's own tokens (header + discipline + instructions + tail + questions + any
//       wrapper the gateway adds), the slope is tokens per variable byte. (b) is the one that does not assume a
//       bytes-per-token ratio.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STORE = path.join(process.env.LOCALAPPDATA || '', 'consonance', 'jev-shadow');
const JUDGES = require(path.join(__dirname, '..', '..', 'consonance', 'tools', 'jev-shadow.js')).JUDGES;
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const B = (s) => Buffer.byteLength(s, 'utf8');
const pct = (xs, p) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))] : null; };
const stats = (xs) => ({ n: xs.length, min: Math.min(...xs), p50: pct(xs, 0.5), p90: pct(xs, 0.9), max: Math.max(...xs), mean: +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1) });

function split(p) {
  const A = { open: '\n---\n', close: '\n---\n\nYou receive ONLY a narrowed view', user: 'Most recent user message:\n',
    move: '\n\nAssistant move to judge:\n', tail: '\n\nIf the view does not contain a judgeable assistant move at all' };
  const i1 = p.indexOf(A.open), i2 = p.indexOf(A.close, i1 + 1), i3 = p.indexOf(A.user, i2), i4 = p.indexOf(A.move, i3), i5 = p.lastIndexOf(A.tail);
  if ([i1, i2, i3, i4, i5].some((i) => i < 0) || !(i1 < i2 && i2 < i3 && i3 < i4 && i4 < i5)) return null;
  return {
    header: p.slice(0, i1 + A.open.length),
    discipline: p.slice(i1 + A.open.length, i2),
    instructions: p.slice(i2, i3 + A.user.length),
    user: p.slice(i3 + A.user.length, i4),
    move: p.slice(i4 + A.move.length, i5),
    tail: p.slice(i4, i4 + A.move.length) + p.slice(i5),   // the "Assistant move to judge:" label counts as frame, not view
  };
}

const rows = fs.readFileSync(path.join(STORE, 'jev_judge.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const capDir = path.join(STORE, 'judge-captures');
const caps = new Map();
for (const f of fs.readdirSync(capDir)) { try { const c = JSON.parse(fs.readFileSync(path.join(capDir, f), 'utf8')); caps.set(`${c.session_id}|${c.turn_uuid}`, c); } catch {} }

const qBytes = { l2: B(JSON.stringify(JUDGES.l2.questions)), l3: B(JSON.stringify(JUDGES.l3.questions)) };
const out = { store: STORE, rows: rows.length, captures: caps.size, byLevelStatus: {}, questionsBytes: qBytes };
for (const r of rows) out.byLevelStatus[`${r.level}:${r.status}`] = (out.byLevelStatus[`${r.level}:${r.status}`] || 0) + 1;

const PARTS = ['header', 'discipline', 'instructions', 'user', 'move', 'tail'];
const matched = [], unmatched = { noCapture: 0, shaMismatch: 0, unsplit: 0 };
for (const r of rows.filter((x) => x.level === 'l2' && x.status === 'ok')) {
  const c = caps.get(`${r.session_id}|${r.turn_uuid}`);
  if (!c || !c.l2 || typeof c.l2.prompt !== 'string') { unmatched.noCapture++; continue; }
  if (sha(c.l2.prompt) !== r.prompt_sha256) { unmatched.shaMismatch++; continue; }
  const s = split(c.l2.prompt);
  if (!s) { unmatched.unsplit++; continue; }
  const bytes = Object.fromEntries(PARTS.map((k) => [k, B(s[k])]));
  bytes.questions = qBytes.l2;
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  matched.push({ r, bytes, total, tok: r.usage && r.usage.inputTokens, ms: r.ms, disc: r.discipline_sha256, seat: r.seat });
}
out.l2 = { ok: out.byLevelStatus['l2:ok'] || 0, matched: matched.length, unmatched };

// Input tokens and latency.
const tok = matched.map((m) => m.tok).filter(Number.isFinite);
out.l2.inputTokens = stats(tok);
out.l2.outputTokens = stats(matched.map((m) => m.r.usage && m.r.usage.outputTokens).filter(Number.isFinite));
out.l2.ms = stats(matched.map((m) => m.ms).filter(Number.isFinite));
out.l2.bytesPerToken = stats(matched.map((m) => +(m.total / m.tok).toFixed(3)));
out.l2.costField = [...new Set(rows.map((r) => String(r.cost)))];

// (a) byte shares, per part: median bytes, and the SUM share over all matched rows.
const sumAll = matched.reduce((a, m) => a + m.total, 0);
out.l2.parts = {};
for (const k of [...PARTS, 'questions']) {
  const xs = matched.map((m) => m.bytes[k]);
  const sum = xs.reduce((a, b) => a + b, 0);
  out.l2.parts[k] = { bytes: stats(xs), shareOfAllBytes: +(sum / sumAll).toFixed(3),
    estTokensByShare_p50: pct(matched.map((m) => Math.round(m.tok * m.bytes[k] / m.total)), 0.5) };
}

// (b) the fit, per discipline version.
out.l2.fit = {};
const byDisc = new Map();
for (const m of matched) { if (!byDisc.has(m.disc)) byDisc.set(m.disc, []); byDisc.get(m.disc).push(m); }
for (const [d, ms] of byDisc) {
  const xs = ms.map((m) => m.bytes.user + m.bytes.move), ys = ms.map((m) => m.tok);
  const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0), sxy = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
  const slope = sxx ? sxy / sxx : null, icpt = slope == null ? null : my - slope * mx;
  const ssr = ys.reduce((a, y, i) => a + (y - (icpt + slope * xs[i])) ** 2, 0), sst = ys.reduce((a, y) => a + (y - my) ** 2, 0);
  const fixedBytes = ms[0].bytes.header + ms[0].bytes.discipline + ms[0].bytes.instructions + ms[0].bytes.tail + ms[0].bytes.questions;
  out.l2.fit[d.slice(0, 12)] = { n, disciplineBytes: ms[0].bytes.discipline, fixedFrameBytes: fixedBytes,
    interceptTokens: icpt == null ? null : Math.round(icpt), tokensPerVariableByte: slope == null ? null : +slope.toFixed(4),
    r2: sst ? +(1 - ssr / sst).toFixed(4) : null,
    fixedShareOfMedianInput: icpt == null ? null : +(icpt / pct(ys, 0.5)).toFixed(3),
    first: ms.map((m) => m.r.ts).sort()[0], last: ms.map((m) => m.r.ts).sort().slice(-1)[0] };
}

// Latency against size.
{
  const xs = matched.map((m) => m.tok), ys = matched.map((m) => m.ms);
  const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  const cov = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0), vx = xs.reduce((a, x) => a + (x - mx) ** 2, 0), vy = ys.reduce((a, y) => a + (y - my) ** 2, 0);
  out.l2.msVsTokens = { pearson: +(cov / Math.sqrt(vx * vy)).toFixed(3), msPer1kTokens: +((cov / vx) * 1000).toFixed(1) };
}

// L3, for the record (dropped from judge mode at D108): tokens and latency only.
const l3 = rows.filter((r) => r.level === 'l3' && r.status === 'ok');
out.l3 = { ok: l3.length, inputTokens: stats(l3.map((r) => r.usage && r.usage.inputTokens).filter(Number.isFinite)), ms: stats(l3.map((r) => r.ms).filter(Number.isFinite)) };
out.totals = { inputTokensAllRows: rows.reduce((a, r) => a + ((r.usage && r.usage.inputTokens) || 0), 0), first: rows[0] && rows[0].ts, last: rows[rows.length - 1] && rows[rows.length - 1].ts };

console.log(JSON.stringify(out, null, 1));
if (process.argv.includes('--rows')) for (const m of matched) console.log([m.r.ts, m.seat, m.tok, m.ms, ...PARTS.map((k) => m.bytes[k])].join('\t'));
