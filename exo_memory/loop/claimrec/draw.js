'use strict';
// claimrec/draw.js - the L119 sample: DRAW, EXTRACT, ASSIGN (rebuilt D277, seat A, to the sealed rules).
//
// The original lived on the laptop (C:\Consonance\retrieval\l119\ on L: draw script, assign.js, key\rules.md) and was never committed. This is
// rebuilt from the sealed text, not from the old code: claim_base_rate_registration_2026-09-27.md sections 1, 2, 6, 9; the choices the seal left
// open are the ones handback/p-l119-sample-A_2026-09-27.md section 2 lists; the extraction format is handback/p-l115-extract-A_2026-09-27.md.
// Where this file had to choose, the comment says RECONSTRUCTED.
//
//   node draw.js frame  --window original|remeasure [--cited <json>]                     counts only; writes nothing, prints no id
//   node draw.js draw   --window original|remeasure --out <dir> [--cited <json>]        writes <dir>/key and <dir>/replies. REFUSES the re-measure window before it closes
//   node draw.js assign --window ... --packets <dir> --out <dir>                          after readers + `claimrec.js packets`: writes <dir>/verify/B|C/claims.json and <dir>/key/claims_all.json
//
// THE RULES (sealed):
//   frame    frame.js's membership rule over the window [from, to)  (frame.js)
//   exclude  every frame message with a row inside a turn that contains a cited line [original window only: the 24 located census rows]
//            a turn = [the real user prompt at or before the line, the next real prompt)    RECONSTRUCTED (D160's definition is not on this machine)
//   order    sha256("L119|" + message.id) ascending; the first M = 100
//   claims   claimId = message.id + "|" + n, n = the 1-based statement number of `claimrec.js packets`; keep K = 3 per message in
//            sha256(message.id + "|" + n) order
//   assign   B's seat's claims go to C only; C's to B only; the librarian's, chair's, A's and E's by the low bit of the first byte of
//            sha256("L119-assign|" + claimId): even -> B, odd -> C; and those four seats' claims go to BOTH when the second byte is < 64 (the overlap)
//   extract  R1:60 / D160 section 1, in the L115 format
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const F = require('./frame.js');

const M = 100, K = 3;
const WINDOWS = {
  original: { name: 'original', from: '2026-09-14T00:00:00Z', to: '2026-09-24T00:00:00Z', expectFrame: 5023, expectExcluded: 43, closes: null },
  // remeasure_registration_2026-10-03.md: start 2026-10-03 05:55 local (Regina, UTC-6) = 11:55Z; end seven days later (the 100-message floor is already met).
  remeasure: { name: 'remeasure', from: '2026-10-03T11:55:00Z', to: '2026-10-10T11:55:00Z', expectFrame: null, expectExcluded: null, closes: '2026-10-10T11:55:00Z' },
};

const shaHex = (s) => crypto.createHash('sha256').update(s).digest('hex');
const shaBuf = (s) => crypto.createHash('sha256').update(s).digest();
const orderKey = (id) => shaHex('L119|' + id);
const claimId = (id, n) => id + '|' + n;

function drawOrder(items, m = M) { return [...items].sort((a, b) => (orderKey(a.id) < orderKey(b.id) ? -1 : orderKey(a.id) > orderKey(b.id) ? 1 : 0)).slice(0, m); }

// keep K statements per message, in sha256(message.id + "|" + n) order; a message with fewer than K keeps what it has. Returned by n.
function capK(id, statements, k = K) {
  return [...statements].sort((a, b) => { const x = shaHex(id + '|' + a.n), y = shaHex(id + '|' + b.n); return x < y ? -1 : x > y ? 1 : 0; }).slice(0, k).sort((a, b) => a.n - b.n);
}

const OVERLAP_SEATS = new Set(['librarian', 'chair', 'A', 'E']);
function verifiersFor(seat, id) {
  if (seat === 'B') return ['C'];
  if (seat === 'C') return ['B'];
  const d = shaBuf('L119-assign|' + id); const one = (d[0] & 1) === 0 ? 'B' : 'C';
  return OVERLAP_SEATS.has(seat) && d[1] < 64 ? ['B', 'C'] : [one];
}

// The re-measure window must not be drawn from before it closes. Everything else may run at any time.
function guard(win, nowMs) {
  if (win.closes && nowMs < Date.parse(win.closes)) throw new Error(`the ${win.name} window closes at ${win.closes}; it is ${new Date(nowMs).toISOString()}. Not drawing (registered: no message is drawn before the window closes).`);
}

// ---- turns and exclusions ----
function turnSpan(prompts, line) {
  let start = 0, end = Infinity;
  for (const p of prompts) { if (p <= line) start = p; else { end = p; break; } }
  return { start, end };
}
function excludedIds(seatResult, citedLines, memberIds) {
  const spans = citedLines.map((l) => turnSpan(seatResult.prompts, l)); const out = new Set();
  for (const id of memberIds) { const m = seatResult.messages.get(id); if (m.lines.some((l) => spans.some((s) => l >= s.start && l < s.end))) out.add(id); }
  return out;
}

// ---- extraction ----
const echoWritten = (cmd) => [...String(cmd).matchAll(/\b(?:echo|printf)\b\s+(?:-[A-Za-z]+\s+)*("(?:[^"\\]|\\.)*"|'[^']*')\s*>>?\s*[^\s|&;]+/g)].map((m) => m[1].slice(1, -1)); // RECONSTRUCTED (the original regex is on D160's d160.js, absent here)
function partsOf(content) {
  const parts = [];
  for (const b of content) {
    if (b.type === 'text') parts.push(['[text]', b.text]);
    else if (b.type === 'tool_use' && b.input) {
      if (b.name === 'Write') parts.push(['[written through Write]', String(b.input.content || '')]);
      else if (b.name === 'Edit') parts.push(['[written through Edit]', String(b.input.new_string || '')]);
      else if (b.name === 'MultiEdit') for (const e of b.input.edits || []) parts.push(['[written through MultiEdit]', String(e.new_string || '')]);
      else if (b.name === 'Bash') for (const t of [...F.heredocs(b.input.command), ...echoWritten(b.input.command)]) parts.push(['[written through Bash]', t]);
    } // thinking, tool results and other tools' input are not sent
  }
  return parts;
}
// The message's rows in file order, a duplicated uuid kept once; parts separated by one blank line; CRLF -> LF.
function extractReply(rows) {
  const seen = new Set(), parts = [];
  for (const o of rows) { if (o.uuid) { if (seen.has(o.uuid)) continue; seen.add(o.uuid); } for (const p of partsOf(o.message.content)) parts.push(p); }
  return parts.map(([label, body]) => `${label}\n${body}`).join('\n\n').replace(/\r\n/g, '\n');
}

// ---- the frame, exclusions and the draw for one window ----
function build(win, opts = {}) {
  const from = Date.parse(win.from), to = Date.parse(win.to);
  const seats = Object.keys(F.SEATS), per = {}, items = [];
  for (const seat of seats) {
    const r = F.readSeat(seat, opts);
    if (r.missing) throw new Error(`seat transcript missing: ${seat} ${r.file}`);
    const members = F.frameMembers(r, from, to);
    const cited = (opts.cited || []).filter((c) => c.seat === seat).map((c) => c.line);
    const ex = excludedIds(r, cited, members.map((m) => m.id));
    per[seat] = { r, frame: members.length, excluded: ex.size };
    for (const m of members) if (!ex.has(m.id)) items.push({ id: m.id, seat, ts: m.ts, machine: m.machine, lines: m.lines });
  }
  const frameTotal = seats.reduce((s, x) => s + per[x].frame, 0), excludedTotal = seats.reduce((s, x) => s + per[x].excluded, 0);
  if (win.expectFrame !== null && frameTotal !== win.expectFrame) throw new Error(`frame is ${frameTotal}, sealed ${win.expectFrame}: refusing (as the original draw did)`);
  if (opts.cited && win.expectExcluded !== null && excludedTotal !== win.expectExcluded) throw new Error(`excluded ${excludedTotal}, sealed ${win.expectExcluded}: refusing`);
  return { win, per, items, frameTotal, excludedTotal };
}

function summary(b) {
  const s = Object.keys(b.per).map((k) => `${k} frame ${b.per[k].frame} excluded ${b.per[k].excluded}`).join(' | ');
  return `window ${b.win.name} [${b.win.from}, ${b.win.to}): frame ${b.frameTotal}, excluded ${b.excludedTotal}, eligible ${b.items.length}\n  ${s}`;
}

function citedFromLocated(jsonPath) {
  const j = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); const arr = Array.isArray(j) ? j : (j.rows || Object.values(j));
  const bySid = Object.fromEntries(Object.entries(F.SEATS).map(([seat, [, sid]]) => [sid, seat]));
  return arr.map((r) => ({ id: r.id, date: r.date, line: r.line, seat: r.seat || bySid[path.basename(String(r.file || '').replace(/\\/g, '/'), '.jsonl')] })).filter((r) => r.seat);
}

function writeDraw(b, outDir) {
  const drawn = drawOrder(b.items);
  if (drawn.length < M) throw new Error(`only ${drawn.length} eligible messages, M = ${M}`);
  const key = path.join(outDir, 'key'), rep = path.join(outDir, 'replies'); fs.mkdirSync(key, { recursive: true }); fs.mkdirSync(rep, { recursive: true });
  const bySeat = {}; for (const d of drawn) (bySeat[d.seat] = bySeat[d.seat] || []).push(d);
  const meta = [];
  for (const seat of Object.keys(bySeat)) {
    const { r } = b.per[seat]; const want = new Map(); for (const d of bySeat[seat]) for (const l of d.lines) want.set(l, d.id);
    const rows = {}; F.eachLine(r.file, (line, no) => { if (!want.has(no)) return; let o; try { o = JSON.parse(line); } catch (_) { return; } (rows[want.get(no)] = rows[want.get(no)] || []).push(o); });
    for (const d of bySeat[seat]) {
      const text = extractReply(rows[d.id] || []);
      fs.writeFileSync(path.join(rep, d.id + '.txt'), text);
      const first = d.lines[0]; const sp = turnSpan(r.prompts, first);
      meta.push({ id: d.id, seat, ts: d.ts, machine: d.machine, transcript: r.file, lines: d.lines, turnStartLine: sp.start, nextPromptLine: sp.end === Infinity ? null : sp.end, orderKey: orderKey(d.id), replyChars: text.length });
    }
  }
  meta.sort((x, y) => (x.orderKey < y.orderKey ? -1 : 1));
  fs.writeFileSync(path.join(key, 'drawn_ids.txt'), meta.map((m) => m.id).join('\n') + '\n');
  fs.writeFileSync(path.join(key, 'drawn.json'), JSON.stringify(meta, null, 1));
  fs.writeFileSync(path.join(key, 'frame.json'), JSON.stringify({ window: b.win, frameTotal: b.frameTotal, excludedTotal: b.excludedTotal, eligible: b.items.length, perSeat: Object.fromEntries(Object.keys(b.per).map((k) => [k, { frame: b.per[k].frame, excluded: b.per[k].excluded }])) }, null, 1));
  return meta;
}

// ---- assign ----
function buildClaims(meta, packets) {
  const claims = [];
  for (const m of meta) {
    const p = packets[m.id]; if (!p) continue;
    for (const s of capK(m.id, p.statements)) {
      const id = claimId(m.id, s.n);
      claims.push({ claimId: id, seat: m.seat, transcript: m.transcript, messageId: m.id, ts: m.ts, lines: m.lines, turnStartLine: m.turnStartLine, nextPromptLine: m.nextPromptLine, statement: s.text, to: verifiersFor(m.seat, id) });
    }
  }
  return claims;
}
function writeAssign(claims, outDir) {
  const strip = ({ to, ...c }) => c;
  for (const v of ['B', 'C']) {
    const dir = path.join(outDir, 'verify', v); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'claims.json'), JSON.stringify({ verifier: v, claims: claims.filter((c) => c.to.includes(v)).map(strip) }, null, 1));
  }
  fs.mkdirSync(path.join(outDir, 'key'), { recursive: true });
  fs.writeFileSync(path.join(outDir, 'key', 'claims_all.json'), JSON.stringify(claims.map((c) => ({ claimId: c.claimId, seat: c.seat, to: c.to })), null, 1));
}

module.exports = { M, K, WINDOWS, orderKey, claimId, drawOrder, capK, verifiersFor, guard, turnSpan, excludedIds, extractReply, partsOf, echoWritten, build, summary, citedFromLocated, writeDraw, buildClaims, writeAssign };

if (require.main === module) {
  const argv = process.argv.slice(2); const cmd = argv[0]; const opt = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
  try {
    const win = WINDOWS[opt('--window')]; if (!win) throw new Error('--window original|remeasure');
    const cited = opt('--cited') ? citedFromLocated(opt('--cited')) : null;
    if (cmd === 'frame') { console.log(summary(build(win, { cited }))); }
    else if (cmd === 'draw') {
      guard(win, Date.now()); const out = opt('--out'); if (!out) throw new Error('--out <dir>');
      const b = build(win, { cited }); console.log(summary(b)); const meta = writeDraw(b, path.resolve(out));
      const bySeat = {}; for (const m of meta) bySeat[m.seat] = (bySeat[m.seat] || 0) + 1;
      const ids = fs.readFileSync(path.join(path.resolve(out), 'key', 'drawn_ids.txt'));
      console.log(`drawn ${meta.length}: ${JSON.stringify(bySeat)}; drawn_ids.txt sha256 ${shaHex(ids)}`);
    } else if (cmd === 'assign') {
      const out = path.resolve(opt('--out')); const pk = path.resolve(opt('--packets'));
      const meta = JSON.parse(fs.readFileSync(path.join(out, 'key', 'drawn.json'), 'utf8')); const packets = {};
      for (const f of fs.readdirSync(pk).filter((x) => x.endsWith('.packet.json'))) { const p = JSON.parse(fs.readFileSync(path.join(pk, f), 'utf8')); packets[p.id] = p; }
      const claims = buildClaims(meta, packets); writeAssign(claims, out);
      const n = (v) => claims.filter((c) => c.to.includes(v)).length;
      console.log(`claims ${claims.length} from ${new Set(claims.map((c) => c.messageId)).size} messages; B ${n('B')}, C ${n('C')}, overlap ${claims.filter((c) => c.to.length === 2).length}`);
    } else throw new Error('usage: node draw.js frame|draw|assign --window original|remeasure ...');
  } catch (e) { console.error('draw.js: ' + e.message); process.exit(2); }
}
