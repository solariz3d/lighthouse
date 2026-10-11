// scoreboard.js (pane E, D294 part 1, ledger row D295): WHO CATCHES THE ERRORS, 2026-09-01 -> 2026-10-11. MEASURE ONLY, read-only on every input.
// Plan: exo_memory/loop/plan_retrieval_now_d294_2026-10-11.md, Part 1. Hand-back: exo_memory/handback/p-scoreboard-E_2026-10-11.md.
//
// One FINDER per catch: keeper / seat (after the fact: a second reader, a pane reading a hand-back, a seat's own later correction) /
// instrument (in-stream: a gate refusal whose re-send changed a CLAIM, or a test or ratchet red before landing) / unattributed.
// Five sources, each a row family; every row carries file:line (or the gate log line and the sender's transcript timestamp):
//   L  consonance/tools/catch-ledger.js --json (muscle_map.md + journal/*.md), its buckets mapped: self, committee -> seat
//   W  exo_memory/librarian/*.md, the WRONG entries (one row per entry; numbered entries once, at their first defining line)
//   H  exo_memory/handback/*_2026-09|10-*.md, the corrections sections (one row per top-level item)
//   G  gate refusals, from the SENDERS' transcripts (a refused ring never reaches the board; the logs keep a sha, not the text): every refused
//      ring/dispatch tool call and every REPLY SLOT stop-hook block, paired with its re-send; content compared with SOURCES/NEXT/OUTPUT lines
//      stripped (B's D276 method, loop/loop_friction_B_2026-10-09.md:36-60). A CHANGED pair is a catch only after it is read: adjudicated.json.
//   S  second-reader.jsonl, push-gate.jsonl, delete-gate.jsonl, dispatch-gate.jsonl: counted, see the hand-back for why each is or is not a catch.
//
// The finder rules are LEXICAL and print which rule fired; an audited sample is in the hand-back. Message texts of other seats are written only to
// --scratch (never committed); rows.tsv carries file:line, never another seat's ring text.
//
// Run: node --max-old-space-size=4096 scoreboard.js --repo <lighthouse> --data <the room's data dir> --projects <~/.claude/projects> --out <dir> --scratch <dir>
'use strict';
const fs = require('fs'), path = require('path'), readline = require('readline'), { spawnSync } = require('child_process');

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const REPO = arg('--repo'), DATA = arg('--data'), PROJ = arg('--projects'), OUT = arg('--out'), SCR = arg('--scratch');
const T0 = '2026-09-01', T1 = '2026-10-11';
const FINDERS = ['keeper', 'seat', 'instrument', 'unattributed'];

// weeks: Monday-start, labelled by their Monday; 09-01 (a Tuesday) falls in the week of 08-31
function weekOf(ymd) {
  const d = new Date(ymd + 'T12:00:00Z'), dow = (d.getUTCDay() + 6) % 7;
  return new Date(d.getTime() - dow * 864e5).toISOString().slice(0, 10);
}
const inWindow = (ymd) => ymd && ymd >= T0 && ymd <= T1;

// ------------------------------------------------------------------ the finder rules (W and H) --
// Order matters and is printed: keeper, then a named other seat, then an in-stream instrument, then the default for the family.
const SEATNAME = String.raw`(?:A|B|C|D|E|K|M|the chair|chair|the librarian|librarian|the Third Place|Third Place|the collator|the second reader|a second reader|a non-author)`;
const RULES = [
  ['keeper', new RegExp(String.raw`keeper[- ](?:caught|found|prompted|the finder|catch)|caught by the keeper|the keeper caught|the keeper(?:'s)? (?:catch|find|correction)|found by the keeper|the keeper (?:corrected|pointed|noticed|asked why|called)|keeper-(?:caught|found)|\bHe: "|His words`, 'i')],
  ['seat', new RegExp(String.raw`found by ${SEATNAME}\b|caught by ${SEATNAME}\b|\b${SEATNAME}[- ](?:found|the finder)\b|\b${SEATNAME}'s (?:find|catch|read|review)\b|\b(?:A|B|C|E|K|M)-found\b|corrected by ${SEATNAME}\b|\b${SEATNAME} caught\b|finder: ${SEATNAME}`)],
  ['instrument', /\b(?:went|turned|came back|ran|was|were|stayed|showed) red\b|\bred (?:on|at|in|before|first)\b|\b(?:test|tests|suite|ratchet|mutant|mutants|harness|gate|hook|check|assertion|cargo|node --check|portable-paths|carrier-drift)\b[^.\n]{0,40}\b(?:caught|failed|refused|flagged|went red|turned red|tripped)\b|\bcaught by (?:the |a |my )?(?:test|mutant|suite|ratchet|gate|harness|node --check|run|first run)|\bsurvived\b|\brefused by the\b/i],
];
function finderOf(text, dflt) {
  for (const [f, re] of RULES) if (re.test(text)) return { finder: f, rule: f };
  return { finder: dflt, rule: 'default:' + dflt };
}

// ------------------------------------------------------------------ L: catch-ledger --
function ledgerRows() {
  const r = spawnSync(process.execPath, [path.join(REPO, 'consonance/tools/catch-ledger.js'), '--json'], { cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error('catch-ledger.js failed: ' + r.stderr);
  const j = JSON.parse(r.stdout), map = { self: 'seat', committee: 'seat', keeper: 'keeper', instrument: 'instrument', unattributed: 'unattributed' };
  return j.events.filter((e) => inWindow(e.window)).map((e) => ({ src: 'L', day: e.window, finder: map[e.bucket], rule: 'catch-ledger:' + (e.rule || e.bucket), at: `exo_memory/${e.source}:${e.line}`, text: e.sentence }));
}

// ------------------------------------------------------------------ W: librarian WRONG entries --
const STAMP = /\b(?:2026-)?(09|10)-(\d\d)\b[ T]+\d\d:\d/;
function entryDay(lines, i, fileDay) {
  for (let k = i; k >= 0; k--) { const m = STAMP.exec(lines[k]); if (m) { const d = `2026-${m[1]}-${m[2]}`; if (d >= fileDay && d <= T1) return d; } }
  return fileDay;
}
// The WRONG column's own entries. Read per OCCURRENCE (one line can hold two entries), the finder judged on the entry's own text (from the word WRONG
// to 300 characters on), never on the whole line. Numbered entries ("WRONG 101", "WRONG #62", "WRONG +1 (…; lifetime 52)") count once per number, at
// the occurrence that names a finder or "mine" (else the first); NOTE the desktop and laptop columns reused numbers (71 is two errors), so the
// numbered set is per number and a reuse is added by hand in w-overrides.json. Mentions are skipped: a bare tally ("WRONG +1."), "WRONG lifetime",
// "WRONG: not this seat's column", "WRONG this lap" summaries, and another seat's WRONG quoted in a note ("B's own WRONG").
const W_ENTRY = /WRONG\s*\+\d+\s*(?:\(|,\s*finder)|WRONG\s*#\d{2,3}|\bWRONG \d{2,3}(?:\s*(?:,|and|–|-)\s*\d{2,3})*|WRONG,? \(?(?:mine|the librarian)\b|WRONG today \(mine\)|WRONG \(mine\)|\bmy miss, caught by|WRONGS? OF MINE|\*\*WRONG\*\*/g;
const W_SKIP = /^WRONG\s*\+\d+\.|^WRONG lifetime|^WRONG: not this|^WRONG this lap/;
function wrongIds(s) {
  const m = /^WRONG\s*(?:#|\+\d+\s*\([^)]*lifetime\s*)?(\d{2,3})((?:\s*(?:,|and|–|-)\s*\d{2,3})*)/.exec(s);
  if (!m) { const lt = /^WRONG\s*\+\d+\s*\([^)]*?lifetime\s*(\d{2,3})/.exec(s); return lt ? [Number(lt[1])] : []; }
  const ids = [Number(m[1])], rest = m[2] || '', rng = /^\s*[–-]\s*(\d{2,3})/.exec(rest);
  if (rng) for (let n = ids[0] + 1; n <= Number(rng[1]); n++) ids.push(n);
  else for (const x of rest.match(/\d{2,3}/g) || []) ids.push(Number(x));
  return ids;
}
function librarianRows() {
  const dir = path.join(REPO, 'exo_memory/librarian'), dropped = [], plain = [], numbered = new Map();
  const ov = JSON.parse(fs.readFileSync(path.join(__dirname, 'w-overrides.json'), 'utf8'));
  for (const f of fs.readdirSync(dir).filter((f) => /^2026-\d\d-\d\d.*\.md$/.test(f)).sort()) {
    const fileDay = f.slice(0, 10); if (fileDay < '2026-08-31') continue;   // 08-31's file is scanned so an entry stamped 09-01 inside it is not missed
    const lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
    let inCol = false;
    lines.forEach((ln, i) => {
      const at = `exo_memory/librarian/${f}:${i + 1}`, day = () => entryDay(lines, i, fileDay);
      if (/WRONG column[^\n]*:\*?\*?\s*$/.test(ln)) { inCol = true; return; }                     // a list header: its items are the entries
      if (inCol) {
        if (/^\s*-\s/.test(ln) && !/^\s{4,}-/.test(ln)) { let t = ln, m = i + 1; while (m < lines.length && /^\s{4,}\S/.test(lines[m]) && !/^\s{4,}-/.test(lines[m])) t += ' ' + lines[m++].trim(); plain.push({ src: 'W', day: day(), ...finderOf(t, 'seat'), at, text: t.trim().slice(0, 400) }); return; }
        if (/^\s{2,}\S/.test(ln)) return; inCol = false;
      }
      for (const mm of ln.matchAll(W_ENTRY)) {
        const s = ln.slice(mm.index), win = (s + ' ' + (lines[i + 1] || '') + ' ' + (lines[i + 2] || '')).slice(0, 300);
        if (W_SKIP.test(s) || /\b[A-E]'s own WRONG/.test(ln.slice(Math.max(0, mm.index - 12), mm.index + 6))) { dropped.push(at); continue; }
        const row = { src: 'W', day: day(), ...finderOf(win, 'seat'), at, text: win.replace(/\s+/g, ' ').trim() };
        const ids = wrongIds(s);
        if (!ids.length) { plain.push(row); continue; }
        const named = /mine|found|finder|find|caught|the chair|this lineage|\((?:A|B|C|E|K|M)\)/.test(win.slice(0, 120));
        for (const n of ids) { const prev = numbered.get(n); if (!prev || (!prev.named && named)) numbered.set(n, { ...row, id: n, named }); }
      }
    });
  }
  const drop = new Set((ov.drop || []).map((d) => d.at));
  const rows = [...plain, ...numbered.values()].filter((r) => inWindow(r.day) && !drop.has(r.at + (r.id ? '#' + r.id : '')) && !drop.has(r.at));
  for (const r of rows) { const o = (ov.finder || {})[r.at]; if (o) { r.finder = o.finder; r.rule = 'override:' + o.why; } }
  for (const a of ov.add || []) rows.push({ src: 'W', day: a.day, finder: a.finder, rule: 'override:add', at: a.at, text: a.why });
  return { rows, dropped };
}

// ------------------------------------------------------------------ H: hand-back corrections sections --
const H_HEAD = /\b(?:self-)?corrections?\b|what i got wrong/i;
const isHeading = (ln) => /^#{1,6}\s/.test(ln);
const isBoldHead = (ln) => /^\*\*[^*]{3,200}\*\*:?\s*$/.test(ln.trim()) || /^\*\*[^*]{3,200}:\*\*\s*$/.test(ln.trim());
const isBoldLead = (ln) => /^\*\*[^*]*\bcorrect(?:ion|ed)\b[^*]*\*\*/i.test(ln) && /\b(?:myself|mine|my own|to me)\b/i.test(ln.split('**')[1] || '');
function handbackRows() {
  const dir = path.join(REPO, 'exo_memory/handback'), rows = [];
  let sections = 0, files = 0;
  for (const f of fs.readdirSync(dir).filter((f) => /_2026-(09|10)-\d\d\.md$/.test(f)).sort()) {
    const day = /_(2026-\d\d-\d\d)\.md$/.exec(f)[1]; if (!inWindow(day)) continue;
    const lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
    let fileHit = false;
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      let kind = null;
      if (isHeading(ln) && H_HEAD.test(ln)) kind = 'heading';
      else if (isBoldHead(ln) && H_HEAD.test(ln)) kind = 'bold';
      else if (isBoldLead(ln)) kind = 'lead';
      if (!kind) continue;
      sections++; fileHit = true;
      const level = kind === 'heading' ? /^#+/.exec(ln)[0].length : 99;
      const items = [];
      let j = i + 1;
      if (kind === 'lead') { items.push(j - 1); }
      else for (; j < lines.length; j++) {
        const l = lines[j];
        if (isHeading(l) && /^#+/.exec(l)[0].length <= Math.min(level, 6)) break;
        if (kind === 'bold' && (isBoldHead(l) || isHeading(l))) break;
        if (kind === 'bold' && l.trim() === '' && j + 1 < lines.length && lines[j + 1].trim() !== '' && !/^\s*(?:[-*]|\d+[.)])\s/.test(lines[j + 1])) break;
        if (/^(?:[-*]|\d+[.)])\s/.test(l)) items.push(j);
      }
      if (!items.length) items.push(i);                                                            // a section in prose: one item
      for (const k of items) {
        let text = lines[k], m = k + 1;
        while (m < lines.length && /^\s{2,}\S/.test(lines[m]) && !/^\s{2,}(?:[-*]|\d+[.)])\s/.test(lines[m])) text += ' ' + lines[m++].trim();
        rows.push({ src: 'H', day, ...finderOf(text, 'seat'), at: `exo_memory/handback/${f}:${k + 1}`, text: text.trim().slice(0, 400) });
      }
      if (kind !== 'lead') i = j - 1;
    }
    if (fileHit) files++;
  }
  return { rows, sections, files };
}

// ------------------------------------------------------------------ G: gate refusals, from the senders' transcripts --
const RING = /^mcp__consonance__(call_chair|call_librarian|chair_inject|chair_decide|chair_phase|post_board)$/;
const strip = (t) => String(t || '').split('\n').filter((l) => !/^\s*\**\s*(SOURCES|NEXT|OUTPUT|Sources)\s*:/i.test(l)).join('\n').replace(/\s+/g, ' ').trim();
const resText = (c) => (typeof c.content === 'string' ? c.content : (c.content || []).map((x) => x.text || '').join(' '));
const asText = (content) => (typeof content === 'string' ? content : (content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n'));
function transcriptsFor(sessions) {
  const idx = {};
  for (const d of fs.readdirSync(PROJ)) { let fl = []; try { fl = fs.readdirSync(path.join(PROJ, d)); } catch (_) { continue; } for (const f of fl) if (f.endsWith('.jsonl')) idx[f.slice(0, -6)] = path.join(PROJ, d, f); }
  return sessions.map((s) => ({ session: s, file: idx[s] || null }));
}
async function scanTranscript(file) {
  const uses = new Map(), events = [];
  let lastAssistantText = null, pendingBlock = null;
  const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity });
  for await (const line of rl) {
    if (line.indexOf('"timestamp":"2026-') < 0) continue;
    let r; try { r = JSON.parse(line); } catch (_) { continue; }
    if (!r.timestamp || r.timestamp < T0 || !r.message) continue;
    const content = r.message.content;
    if (r.type === 'assistant') {
      const t = asText(content);
      if (t.trim()) { if (pendingBlock && !pendingBlock.next) { pendingBlock.next = t; pendingBlock.nextTs = r.timestamp; pendingBlock = null; } lastAssistantText = t; }
      for (const c of Array.isArray(content) ? content : []) if (c.type === 'tool_use' && RING.test(c.name)) {
        const u = { kind: 'tool', id: c.id, ts: r.timestamp, tool: c.name.replace('mcp__consonance__', ''), text: (c.input && (c.input.text || c.input.message || c.input.body)) || JSON.stringify(c.input || {}) };
        uses.set(c.id, u); events.push(u);
      }
    } else if (r.type === 'user') {
      if (typeof content === 'string' && /^Stop hook feedback:\s*\n?REPLY SLOT/.test(content)) {
        pendingBlock = { kind: 'reply', ts: r.timestamp, tool: 'reply', cls: 'REPLY-SLOT', why: content.slice(0, 200).replace(/\s+/g, ' '), text: lastAssistantText, refused: true };
        events.push(pendingBlock);
      }
      for (const c of Array.isArray(content) ? content : []) if (c.type === 'tool_result' && uses.has(c.tool_use_id)) {
        const u = uses.get(c.tool_use_id); u.result = resText(c); u.refused = !!c.is_error || /^\s*refused/i.test(u.result);
      }
    }
  }
  return events;
}
const words = (t) => new Set(strip(t).toLowerCase().split(' '));
const jac = (a, b) => { const A = words(a), B = words(b); let i = 0; for (const w of A) if (B.has(w)) i++; return i / (A.size + B.size - i || 1); };
function clsOf(u) {
  if (u.cls) return u.cls;
  const r = u.result || '';
  return /SOURCES gate/.test(r) ? 'SOURCES' : /NEXT-trailer gate/i.test(r) ? 'NEXT-TRAILER' : /OUT OF TURN/.test(r) ? 'OUT-OF-TURN' : /dispatch gate|cites nothing|cite a sha|\[interrupt\]/i.test(r) ? 'DISPATCH' : 'OTHER';
}
async function gateRows() {
  const rd = (f) => fs.readFileSync(path.join(DATA, f), 'utf8').split('\n').filter(Boolean).map((l, i) => { try { return { ...JSON.parse(l), _line: i + 1 }; } catch (_) { return null; } }).filter(Boolean);
  const sg = rd('sources-gate.jsonl'), rs = rd('reply-slot.jsonl');
  const sessions = [...new Set([...sg.filter((r) => r.decision === 'deny').map((r) => r.sessionId || r.seat), ...rs.filter((r) => r.blocked).map((r) => r.session)])];
  // reply-slot rows carry an 8-hex session prefix: resolve to the full id through the sources-gate sessions
  const full = [...new Set(sg.map((r) => r.sessionId || r.seat).filter(Boolean))];
  const ids = [...new Set(sessions.map((s) => full.find((f) => f.startsWith(s)) || s))];
  const tx = transcriptsFor(ids);
  const out = [], pairs = [];
  for (const { session, file } of tx) {
    if (!file) { out.push({ unresolved: session }); continue; }
    const ev = await scanTranscript(file);
    for (const u of ev) if (u.refused) {
      const cls = clsOf(u);
      let next = null, sim = null;
      if (u.kind === 'reply') next = u.next != null ? { ts: u.nextTs, text: u.next } : null;
      else {
        const t = Date.parse(u.ts);
        const later = ev.filter((x) => x.kind === 'tool' && x.tool === u.tool && !x.refused && Date.parse(x.ts) > t && Date.parse(x.ts) < t + 900000);
        // the next accepted call of the same tool; if it is far from the refused text, the most similar one within 15 min (B's repair.js rule)
        next = later[0] || null;
        if (next && jac(u.text, next.text) < 0.68) { const best = later.map((x) => ({ x, s: jac(u.text, x.text) })).sort((a, b) => b.s - a.s)[0]; if (best && best.s > jac(u.text, next.text)) next = best.x; }
        if (next) sim = jac(u.text, next.text);
      }
      const changed = next ? strip(next.text) !== strip(u.text) : null;
      const row = { session: session.slice(0, 8), ts: u.ts, cls, tool: u.tool, dt: next ? Math.round((Date.parse(next.ts) - Date.parse(u.ts)) / 1000) : null, paired: !!next, changed, sim: sim == null ? null : Number(sim.toFixed(2)) };
      out.push(row);
      pairs.push({ ...row, why: (u.why || u.result || '').slice(0, 300).replace(/\s+/g, ' '), refusedText: u.text, nextText: next && next.text });
    }
  }
  // the logs' own counts, so the transcript scan can be checked against them
  const logCounts = {
    sourcesDeny: sg.filter((r) => r.decision === 'deny' && inWindow(r.ts.slice(0, 10))).length,
    replyBlocked: rs.filter((r) => r.blocked && inWindow(r.ts.slice(0, 10))).length,
  };
  return { out, pairs, logCounts, transcripts: tx.map((t) => ({ session: t.session.slice(0, 8), file: t.file && path.relative(PROJ, t.file) })) };
}

// ------------------------------------------------------------------ S: the other logs, counted --
function otherLogs() {
  const rd = (f) => { try { return fs.readFileSync(path.join(DATA, f), 'utf8').split('\n').filter(Boolean).map((l, i) => { try { return { ...JSON.parse(l), _line: i + 1 }; } catch (_) { return null; } }).filter(Boolean); } catch (_) { return []; } };
  const day = (r) => String(r.ts || r.t || '').slice(0, 10);
  const sr = rd('second-reader.jsonl').filter((r) => inWindow(day(r)));
  const dg = rd('dispatch-gate.jsonl').filter((r) => inWindow(day(r)));
  return {
    secondReader: { rows: sr.length, flagged: sr.filter((r) => (r.flags || []).length).length, flags: sr.reduce((n, r) => n + (r.flags || []).length, 0), first: sr[0] && day(sr[0]), last: sr.length ? day(sr[sr.length - 1]) : null },
    dispatchGate: { rows: dg.length, asked: dg.filter((r) => r.outcome === 'asked').length, lines: dg.filter((r) => r.outcome === 'asked').map((r) => r._line), last: dg.length ? day(dg[dg.length - 1]) : null },
    pushGate: rd('push-gate.jsonl').filter((r) => inWindow(day(r)) && r.decision === 'deny').map((r) => ({ line: r._line, t: r.t, seat: String(r.seat).slice(0, 8), kind: (r.found || []).map((x) => String(x.kind).replace(/\s*\(.*\)$/, '')).join(',') })),   // the key-shape label is dropped: stored files carry no key prefix
    deleteGate: rd('delete-gate.jsonl').filter((r) => inWindow(day(r)) && r.decision === 'deny').map((r) => ({ line: r._line, t: r.t, seat: String(r.seat).slice(0, 8) })),
  };
}

// ------------------------------------------------------------------ the table --
function table(rows, title) {
  const weeks = [...new Set(rows.map((r) => weekOf(r.day)))].sort();
  const lines = [`### ${title}`, '', `| week of | ${FINDERS.join(' | ')} | total |`, `|---|${FINDERS.map(() => '---:').join('|')}|---:|`];
  const tot = Object.fromEntries(FINDERS.map((f) => [f, 0]));
  for (const w of weeks) {
    const c = Object.fromEntries(FINDERS.map((f) => [f, 0])); let n = 0;
    for (const r of rows) if (weekOf(r.day) === w) { c[r.finder]++; tot[r.finder]++; n++; }
    lines.push(`| ${w} | ${FINDERS.map((f) => c[f]).join(' | ')} | ${n} |`);
  }
  lines.push(`| **all** | ${FINDERS.map((f) => tot[f]).join(' | ')} | ${rows.length} |`, '');
  return lines.join('\n');
}

(async () => {
  for (const [k, v] of Object.entries({ REPO, DATA, PROJ, OUT, SCR })) if (!v) throw new Error('missing --' + k.toLowerCase());
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(SCR, { recursive: true });
  const L = ledgerRows(), W = librarianRows(), H = handbackRows(), G = await gateRows(), S = otherLogs();
  // a gate pair is a catch only when adjudicated so: adjudicated.json maps "<session8> <ts>" -> { catch: true|false, why }
  const adjPath = path.join(__dirname, 'adjudicated.json');
  const adj = fs.existsSync(adjPath) ? JSON.parse(fs.readFileSync(adjPath, 'utf8')) : {};
  const gRows = G.out.filter((r) => r.ts).map((r) => {
    const key = `${r.session} ${r.ts}`, a = adj[key];
    const k = a ? a.class : !r.paired ? 'unpaired' : r.changed ? 'W' : 'same';
    return { src: 'G', day: r.ts.slice(0, 10), finder: 'instrument', rule: `gate:${r.cls}:${k}`, at: `transcript ${r.session} ${r.ts}`, text: a ? a.why : '', catch: !!(a && a.catch), changed: r.changed, paired: r.paired, cls: r.cls, k, key };
  });
  const gCatch = gRows.filter((r) => r.catch);
  // every CHANGED pair was read when adjudicated.json was written; a different count now means new pairs nobody has read
  const nChanged = gRows.filter((r) => r.changed).length;
  const unadjudicated = nChanged === adj._read_changed ? [] : gRows.filter((r) => r.changed && !adj[r.key]).map((r) => r.key);
  const stale = Object.keys(adj).filter((k) => !k.startsWith('_') && !gRows.some((r) => r.key === k));
  const all = [...L, ...W.rows, ...H.rows, ...gCatch];
  // the excerpt is a finding aid, not the record: withheld where it would carry the Third Place's words or a private name; the line is the master
  // (the private name is matched by the sha256 of the lower-cased word, so this public file does not spell it)
  const PRIVATE = new Set(['5b3d7e7a15e0c5ffbdf711e09ccbec4ef2e5c814379eec0610cc470466b977b6']);
  const named = (t) => String(t || '').toLowerCase().split(/[^a-z0-9]+/).some((w) => w && PRIVATE.has(require('crypto').createHash('sha256').update(w).digest('hex')));
  const excerpt = (t) => (/third place|race\.ini/i.test(t) || named(t) ? '(excerpt withheld; open the line)' : String(t || '').replace(/[A-Za-z]:[\\/]+Users[\\/]+[^\\/\s`'")]+/gi, '<home>').replace(/C--Users-[A-Za-z0-9]+/g, 'C--Users-<user>').replace(/[\t\n]/g, ' ').slice(0, 300));
  const rowsTsv = ['src\tday\tweek\tfinder\trule\tat\ttext', ...[...L, ...W.rows, ...H.rows, ...gRows].map((r) => [r.src, r.day, weekOf(r.day), r.src === 'G' ? (r.catch ? 'instrument' : 'not-a-catch') : r.finder, r.rule, r.at, excerpt(r.text)].join('\t'))].join('\n') + '\n';
  fs.writeFileSync(path.join(OUT, 'rows.tsv'), rowsTsv);
  fs.writeFileSync(path.join(SCR, 'pairs.json'), JSON.stringify(G.pairs, null, 1));        // other seats' message texts: scratch only
  const KS = ['C', 'B', 'P', 'D', 'L', 'T', 'W'];
  const byCls = {}; for (const r of gRows) { const b = (byCls[r.cls] = byCls[r.cls] || { refusals: 0, paired: 0, same: 0, changed: 0, catch: 0, ...Object.fromEntries(KS.map((x) => [x, 0])) }); b.refusals++; if (r.paired) b.paired++; if (r.changed) b.changed++; else if (r.paired) b.same++; if (r.catch) b.catch++; if (KS.includes(r.k)) b[r.k]++; }
  const ruleCount = (rows) => { const c = {}; for (const r of rows) c[r.rule] = (c[r.rule] || 0) + 1; return c; };
  const md = [
    `# scoreboard, ${T0} -> ${T1} (generated by scoreboard.js; rows.tsv beside it walks every count back to a line)`, '',
    table(all, 'All sources (L + W + H + adjudicated G), NOT deduplicated across sources'),
    table(L, 'L: catch-ledger.js (muscle_map + journal; the journal ends 09-22)'),
    table(W.rows, 'W: librarian WRONG entries'),
    table(H.rows, 'H: hand-back corrections sections'),
    table(gCatch, 'G: gate refusals whose re-send corrected a claim'),
    '### G: every refusal found in the senders\' transcripts', '', `| gate | refusals | paired | re-send same | re-send changed | ${KS.join(' | ')} | catch |`, `|---|---:|---:|---:|---:|${KS.map(() => '---:').join('|')}|---:|`,
    ...Object.entries(byCls).map(([k, b]) => `| ${k} | ${b.refusals} | ${b.paired} | ${b.same} | ${b.changed} | ${KS.map((x) => b[x]).join(' | ')} | ${b.catch} |`), '',
    `- classes of a CHANGED pair (adjudicated.json): C catch (wrong claim corrected) · B borderline · P pointer corrected · D a claim or figure dropped or softened, not shown wrong · L content lost · T probe · W wording, citation, added content, or a different message paired`,
    `- adjudication keys that match no refusal now: ${stale.length}`,
    `- gate logs in the window: sources-gate deny ${G.logCounts.sourcesDeny} · reply-slot blocked ${G.logCounts.replyBlocked}`,
    `- transcripts: ${G.transcripts.map((t) => `${t.session} ${t.file || 'NOT FOUND'}`).join(' · ')}`,
    `- unadjudicated CHANGED pairs: ${unadjudicated.length}${unadjudicated.length ? ' (' + unadjudicated.join(', ') + ')' : ''}`, '',
    '### S: the other logs', '', '```', JSON.stringify(S, null, 1), '```', '',
    '### rules fired', '', '```', JSON.stringify({ L: ruleCount(L), W: ruleCount(W.rows), H: ruleCount(H.rows) }, null, 1), '```', '',
    `- W: mentions skipped by rule (another seat's WRONG quoted, "WRONG: not this seat's column", "WRONG this lap"): ${W.dropped.length}`, `- H: ${H.sections} corrections sections in ${H.files} hand-backs`, '',
  ].join('\n');
  fs.writeFileSync(path.join(OUT, 'scoreboard.md'), md);
  console.log(md);
})().catch((e) => { console.error(e.stack || e); process.exit(1); });
