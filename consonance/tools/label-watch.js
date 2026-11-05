#!/usr/bin/env node
'use strict';
// label-watch.js — L126. THE LABEL-RULE WATCH, mechanical and READ-ONLY: over hand-backs and replies to the keeper
// written after the rule landed, count `checked:` / `inferred:` labelled lines, the claim lines the rule says OWE a label
// but carry none, and whether each `checked:` line shows its check. It never writes anything.
//
// THE SPEC IS E'S: exo_memory/loop/label_rule_watch_registration_2026-09-27.md (cited "E§"). THE RULE WATCHED is item 7
// of WHAT A HAND-BACK OWES in consonance/src-tauri/brief/BUILDING.md, landed at R = 1e7520a (rewritten from 8389900 at
// L123; the sha map is in exo_memory/handback/p-l123-rewrite-A_2026-09-27.md). Where E's definition could not be made
// mechanical, the choice made here is written beside it and named in the L126 hand-back — never guessed silently.
//
//   node consonance/tools/label-watch.js                 # the post-rule window, from R to HEAD / now
//   node consonance/tools/label-watch.js --control       # E§1.3's detector control: the last 30 H and 30 K units BEFORE R
//   node consonance/tools/label-watch.js --json          # the same, as one JSON object
//   node consonance/tools/label-watch.js --since <sha>   # another R
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const R_DEFAULT = '1e7520a';
const HANDBACK_DIR = 'exo_memory/handback';

// E§1.3: "one case-sensitive regex, LABEL_RE … pinned at landing" from the rule AS LANDED. Item 7 lays a label out as a
// line of its own: `checked: <command or path:line> → <result>` / `inferred: <the claim>`. So (L127, B's read §2) a
// marker counts ONLY at a line start — after optional indentation and one structural prefix, a bullet (`-` `*` `+`
// `1.`) or a heading's `#`s — lowercase, with the colon. Everything else is a MENTION, not the writer's label:
//   * mid-sentence ("What I checked: …"), and the KIND word "CHECKED" or "unchecked:";
//   * inside an inline code span (a line starting with a backtick never matches) or a fenced block (skipped);
//   * after a `>` blockquote marker: a quoted label is someone else's;
//   * bold (`**checked:**`): item 7's layout is plain.
// One label per line: a second marker later on the same line is a mention. NOT pinned into E's file by the landing
// commit as E§1.3 asks; this is the L127 form, named in the hand-back.
// L128, the librarian's L127 ruling: an optional `**` around the marker counts (`**checked:**`, `**checked**:`), still
// only at a line start — a bold marker mid-sentence is a mention like any other.
const LABEL_RE = /^\s*(?:(?:[-*+]|\d+[.)])\s+|#{1,6}\s+)?(?:\*\*)?(checked|inferred)(?:\*\*)?:/;
// The pointer line A landed in COMMITTEE.md and LIBRARIAN.md at L122 — E§1.4's exposure grep.
const POINTER = '**Checked or inferred**';
// L128: the RULE itself, item 7's heading in BUILDING.md. The chair's shell IS BUILDING.md, which carries item 7 and no
// pointer line, so a pointer-only check reported the chair NOT DELIVERED while it held the rule in full.
const ITEM7 = 'CHECKED OR INFERRED';

// Item 7's own triggers for when `inferred:` is owed: "a figure, a verdict ("fixed", "green", "safe"), or a "so …"".
// The verdict list extends item 7's three examples with their plain siblings; named as this tool's choice.
const VERDICT_RE = /\b(fixed|green|safe|clean|red|pass(?:es|ed|ing)?|fail(?:s|ed|ing)?|works|working|broken|correct|wrong)\b/i;
const SO_RE = /(?:^|[\s,;:—–-])so\b(?=[\s,])/i;
// Item 7: "Future, intent and opinion are not claims about state and take no label." Only the unambiguous openers are
// excluded mechanically; a future or opinion phrased otherwise is still counted (named: over-counts owing).
const INTENT_RE = /^\s*(?:[-*+]\s+|\d+[.)]\s+)?(?:NEXT:|I'?ll\b|I will\b|Next[:,]?\s|Plan\b)/;
// L127 (B's C6, C7): a QUESTION (the line ends in `?`) and a PLAN phrased without an opener ("the next step is to …",
// "will", "going to", "plan to") are not claims about state either. Still a mechanical proxy: a claim phrased with
// "will" about a system's behaviour is dropped too (named).
const PLAN_RE = /\b(?:will|going to|next step|plan(?:s|ned)? to)\b/i;
const isQuestion = (line) => /\?\s*$/.test(line.replace(/`[^`]*`/g, ''));

const isFence = (l) => /^\s*(```|~~~)/.test(l);
const isHeading = (l) => /^\s{0,3}#{1,6}\s/.test(l);
const bulletIndent = (l) => { const m = l.match(/^(\s*)(?:[-*+]|\d+[.)])\s+/); return m ? m[1].length : -1; };
function labelsIn(line) {
  const out = { checked: 0, inferred: 0 };
  // Lowercased on purpose: with the case-sensitive LABEL_RE this changes nothing, and it leaves the regex's case as the
  // ONE guard against the KIND word — so a mutant that loosens the case is seen (L126 M1 survived without this).
  const m = line.match(LABEL_RE);
  if (m) out[m[1].toLowerCase()]++;
  return out;
}
/** The text a figure is looked for in: code spans, shas, dates, times, path:line, versions and id-like tokens (L126,
 *  W105, M1, U3) removed — each is a reference, not a quantity. */
function figureText(line) {
  return line
    .replace(/`[^`]*`/g, ' ')
    .replace(/\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?/g, ' ')
    .replace(/\b\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?Z?\b/g, ' ')
    .replace(/\S+\.[A-Za-z0-9]+:\d+(?:[-–]\d+)?/g, ' ')
    .replace(/:\d+(?:[-–]\d+)?\b/g, ' ')
    .replace(/\b(?=[0-9a-f]*[a-f])[0-9a-f]{7,64}\b/g, ' ')
    .replace(/\b\d+\.\d+\.\d+\b/g, ' ')
    .replace(/\b[A-Za-z]+\d+[A-Za-z0-9]*\b/g, ' ');
}
function triggers(line) {
  const t = line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '');
  const noCode = t.replace(/`[^`]*`/g, ' ');
  const why = [];
  if (/\b\d+(?:[.,]\d+)*\b/.test(figureText(t))) why.push('figure');
  if (VERDICT_RE.test(noCode)) why.push('verdict');
  if (SO_RE.test(noCode)) why.push('so');
  return why;
}

/** One text (a hand-back, or a reply's claim text) → per-line rows, the §3 checks, and counts. Pure. */
function analyzeText(text) {
  const lines = String(text).replace(/\r\n?/g, '\n').split('\n');
  const rows = [], checks = [];
  let inFence = false, headingLabelled = false;
  let stack = [];   // bullet ancestry: [{ indent, self }] — `self` is the bullet's OWN label (L127: nearest parent only)
  const nextNonEmpty = (i) => { for (let j = i + 1; j < lines.length; j++) if (lines[j].trim()) return j; return -1; };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isFence(line)) { inFence = !inFence; continue; }
    if (inFence || !line.trim()) continue;
    const self = labelsIn(line);
    const selfLabelled = self.checked + self.inferred > 0;
    if (isHeading(line)) { headingLabelled = selfLabelled; stack = []; }
    const bi = bulletIndent(line);
    let parentLabelled = false;
    if (bi >= 0) {
      while (stack.length && stack[stack.length - 1].indent >= bi) stack.pop();
      // E§1.3: "the nearest preceding … bullet parent" covers — its OWN label, not one it inherited (B's C13).
      parentLabelled = stack.length ? stack[stack.length - 1].self : false;
      stack.push({ indent: bi, self: selfLabelled });
    } else if (/^\s+\S/.test(line) && stack.length) {
      parentLabelled = stack[stack.length - 1].self;   // an indented continuation belongs to the open bullet itself
    } else if (!isHeading(line)) {
      stack = [];
    }
    const labelled = selfLabelled || (!isHeading(line) && headingLabelled) || parentLabelled;
    const intent = INTENT_RE.test(line) || PLAN_RE.test(line.replace(/`[^`]*`/g, ' ')) || isQuestion(line);
    const why = intent ? [] : triggers(line);
    const row = { line: i + 1, text: line.trim(), checked: self.checked, inferred: self.inferred, labelled, candidate: why.length > 0, owing: why.length > 0 && !labelled, why };
    rows.push(row);
    if (self.checked) {
      // The PROXY for "is a check shown" (L127: named proxy_checked_line_shows_command; the registered §3 is E's, via
      // claimrec), mechanically (E's F2 "a check with its result", item 7's `checked: <command or path:line> → <result>`):
      // SHOWN inline if the line has `<something> → <something>` after the marker; SHOWN as a block if the very next
      // non-empty line opens a code fence; otherwise NOT SHOWN.
      const after = line.slice(line.search(/checked:/) + 'checked:'.length);
      let shown = null;
      const arrow = after.match(/^(.*?\S.*?)\s*(?:→|->|=>)\s*\S/);
      if (arrow) shown = 'inline';
      else { const j = nextNonEmpty(i); if (j >= 0 && isFence(lines[j])) shown = 'block'; }
      checks.push({ line: i + 1, text: line.trim(), shown });
    }
  }
  const counts = {
    checked: rows.reduce((a, r) => a + r.checked, 0),
    inferred: rows.reduce((a, r) => a + r.inferred, 0),
    candidates: rows.filter((r) => r.candidate).length,
    labelledCandidates: rows.filter((r) => r.candidate && r.labelled).length,
    owingUnlabelled: rows.filter((r) => r.owing).length,
    checkedShownInline: checks.filter((c) => c.shown === 'inline').length,
    checkedShownBlock: checks.filter((c) => c.shown === 'block').length,
    checkedNotShown: checks.filter((c) => c.shown === null).length,
  };
  return { rows, checks, counts };
}

// ── K: replies to the keeper (E§1.1) ────────────────────────────────────────────────────────────────────────────────
const SEATS = { // E§1.1 "the six seats' main transcripts" = R19:11's table
  librarian: ['librarian', 'C--Consonance-instances-librarian', '0c0c0c0b-0000-4000-8000-00000000115b'],
  chair: ['main', 'C--Consonance-instances-main', '0c0c0c0a-0000-4000-8000-000000000a01'],
  A: ['sibling-3d57124e', 'C--Consonance-instances-sibling-3d57124e', '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f'],
  B: ['sibling-5bf9d657', 'C--Consonance-instances-sibling-5bf9d657', '12fb81f6-f4c0-4ef8-aad8-f0cdce091925'],
  C: ['sibling-0845a868', 'C--Consonance-instances-sibling-0845a868', '0845a868-38f2-4cc2-b45a-431e0c088fb1'],
  E: ['sibling-07b8a48f', 'C--Consonance-instances-sibling-07b8a48f', 'a2122153-a37e-41a6-a86f-534267ec0565'],
};
function promptText(o) {
  const c = o.message && o.message.content;
  if (typeof c === 'string') return c;
  if (Array.isArray(c)) { if (c.some((b) => b.type === 'tool_result')) return null; return c.filter((b) => b.type === 'text').map((b) => b.text).join('\n'); }
  return null;
}
function isKeeperPrompt(o) {
  if (o.type !== 'user' || o.isMeta || o.isCompactSummary) return false;
  const t = promptText(o);
  if (t === null) return false;
  const s = t.replace(/^\s*<pasted_content[^>]*>/, '').trim();
  return !!s && !s.startsWith('[') && !s.startsWith('<') && !s.startsWith('This session is being continued');
}
const isBoundary = (o) => o.type === 'user' && promptText(o) !== null;
function writtenParts(c) { // arm 1's §1 rule (R19:63): text, and the text written through a tool
  if (c.type === 'text') return [c.text];
  if (c.type !== 'tool_use' || !c.input) return [];
  const i = c.input;
  if (c.name === 'Write') return [String(i.content || '')];
  if (c.name === 'Edit') return [String(i.new_string || '')];
  if (c.name === 'MultiEdit') return (i.edits || []).map((e) => String(e.new_string || ''));
  if (c.name === 'Bash') { const h = [...String(i.command || '').matchAll(/<<-?\s*(['"]?)([A-Za-z_]\w*)\1[^\n]*\n([\s\S]*?)\n\2(?=\s|$)/g)].map((m) => m[3]); return h; }
  return [];
}
/** Rows of one transcript (in file order) → the K units: for each keeper-typed prompt, the last assistant message with
 *  text before the next user row that is not a tool result. Pure. */
function keeperUnits(rows) {
  const units = [];
  for (let i = 0; i < rows.length; i++) {
    if (!isKeeperPrompt(rows[i])) continue;
    let lastId = null;
    let j = i + 1;
    for (; j < rows.length && !isBoundary(rows[j]); j++) {
      const o = rows[j];
      if (o.type === 'assistant' && o.message && Array.isArray(o.message.content) && o.message.content.some((b) => b.type === 'text' && b.text.trim())) lastId = o.message.id;
    }
    if (!lastId) continue;
    const seen = new Set(), parts = [];
    let ts = null;
    for (let k = i + 1; k < j; k++) {
      const o = rows[k];
      if (o.type !== 'assistant' || !o.message || o.message.id !== lastId || seen.has(o.uuid)) continue;
      seen.add(o.uuid); ts = ts || o.timestamp;
      for (const c of o.message.content || []) for (const p of writtenParts(c)) if (p) parts.push(p);
    }
    units.push({ promptTs: rows[i].timestamp, ts, messageId: lastId, text: parts.join('\n\n') });
  }
  return units;
}
/** This machine's rows only (E§1.1: "reads L's rows only"): the machine is the user folder in the nearest preceding
 *  hook row's command path (frame.js's rule), compared with THIS machine's home folder name. */
function readThisMachineRows(file) {
  const me = path.basename(os.homedir()).toLowerCase();
  const rows = []; let here = null;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const mk = line.includes('"attachment"') && /Users\\\\([^\\"]+)\\\\\.claude/.exec(line);
    if (mk) { here = mk[1].toLowerCase(); continue; }
    if (here !== me || !line.startsWith('{"')) continue;
    try { rows.push(JSON.parse(line)); } catch (_) {}
  }
  return rows;
}

// ── H: hand-backs (E§1.1) ───────────────────────────────────────────────────────────────────────────────────────────
const git = (dir, args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 }).trim();
/** Hand-backs first ADDED in R..HEAD, split into counted and excluded (landing lap, seat not delivered, before the seat's
 *  exposure). `exposure` maps a seat letter to a ms time, or null for NOT DELIVERED. */
function handbackUnits(dir, R, exposure) {
  const log = git(dir, ['log', '--reverse', '--diff-filter=A', '--format=@@%H %cI', '--name-only', `${R}..HEAD`, '--', HANDBACK_DIR]);
  const first = new Map(); let cur = null;
  for (const l of log.split('\n')) {
    if (l.startsWith('@@')) { const [sha, t] = l.slice(2).split(' '); cur = { sha, t: Date.parse(t) }; continue; }
    if (l.trim() && cur && !first.has(l.trim())) first.set(l.trim(), cur);
  }
  const counted = [], excluded = [];
  for (const [file, c] of first) {
    const m = path.basename(file).match(/-([A-Z])_\d{4}-\d{2}-\d{2}\.md$/);
    const seat = m ? m[1] : null;
    const unit = { file, sha: c.sha, time: c.t, seat };
    if (/(^|\/)p-l122-/.test(file)) { excluded.push({ ...unit, why: 'landing lap (L122)' }); continue; }
    if (!seat || !(seat in exposure)) { excluded.push({ ...unit, why: `seat ${seat || '?'} unknown` }); continue; }
    if (exposure[seat] === null) { excluded.push({ ...unit, why: `seat ${seat} NOT DELIVERED` }); continue; }
    if (c.t < exposure[seat]) { excluded.push({ ...unit, why: `before seat ${seat}'s exposure` }); continue; }
    counted.push(unit);
  }
  return { counted, excluded };
}

// ── E§1.4 exposure: the seat's instance CLAUDE.md carries the pointer, and was regenerated after R ─────────────────
function exposureOf(instancesDir, rMs) {
  const out = {};
  for (const [seat, [inst]] of Object.entries(SEATS)) {
    const f = path.join(instancesDir, inst, 'CLAUDE.md');
    let has = false, mtime = null;
    try { const t = fs.readFileSync(f, 'utf8'); has = t.includes(POINTER) || t.includes(ITEM7); mtime = fs.statSync(f).mtimeMs; } catch (_) {}
    out[seat] = { file: f, pointer: has, regenerated: mtime, exposure: has && mtime >= rMs ? mtime : null };
  }
  return out;
}

// L127 (the librarian's ruling on B's read): this tool's shares and checks are PROXIES, and are printed under names that
// cannot be mistaken for the registered (a) and §3, which run through the claimrec harness.
const PROXY_HEADER = 'PROXY ONLY — line-level stand-ins. The registered measures, W§1(a) (the claim-level labelled share, extracted per W§1.2) and W§3 (self-label vs the verifiers\' agreed kind), run through the claimrec harness, not this tool.';
const PROXY_NAMES = {
  candidates: 'proxy_lines_owing_a_label',
  labelledCandidates: 'proxy_owing_lines_labelled',
  owingUnlabelled: 'proxy_owing_lines_unlabelled',
  checkedShownInline: 'proxy_checked_line_shows_command_inline',
  checkedShownBlock: 'proxy_checked_line_shows_command_block',
  checkedNotShown: 'proxy_checked_line_shows_no_command',
};
function proxyTotals(list) {
  const t = { checked: 0, inferred: 0 };
  for (const k of Object.values(PROXY_NAMES)) t[k] = 0;
  for (const u of list) {
    t.checked += u.counts.checked; t.inferred += u.counts.inferred;
    for (const [k, name] of Object.entries(PROXY_NAMES)) t[name] += u.counts[k];
  }
  t.proxy_line_label_share = t.proxy_lines_owing_a_label ? t.proxy_owing_lines_labelled / t.proxy_lines_owing_a_label : null;
  return t;
}
const proxyRow = (c) => Object.fromEntries([['checked', c.checked], ['inferred', c.inferred], ...Object.entries(PROXY_NAMES).map(([k, n]) => [n, c[k]])]);

function main(argv) {
  const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
  const R = arg('--since', R_DEFAULT);
  const control = argv.includes('--control');
  const rSha = git(REPO, ['rev-parse', R]);
  const rMs = Date.parse(git(REPO, ['log', '-1', '--format=%cI', rSha]));
  const instances = path.resolve(REPO, '..', 'instances');
  const projects = path.join(os.homedir(), '.claude', 'projects');
  const exp = exposureOf(instances, rMs);
  const letter = { A: 'A', B: 'B', C: 'C', E: 'E' };
  const hExposure = Object.fromEntries(Object.entries(letter).map(([s, l]) => [l, exp[s].exposure]));

  let H, K = [];
  if (!control) {
    const h = handbackUnits(REPO, rSha, hExposure);
    H = { counted: h.counted.map((u) => ({ ...u, counts: analyzeText(git(REPO, ['show', `${u.sha}:${u.file}`])).counts })), excluded: h.excluded };
  } else {
    // E§1.3 control: the last 30 H units first added BEFORE R, and the last 30 K units before R, no exposure gate.
    const log = git(REPO, ['log', '--diff-filter=A', '--format=@@%H', '--name-only', rSha, '--', HANDBACK_DIR]);
    const files = []; let sha = null;
    for (const l of log.split('\n')) { if (l.startsWith('@@')) { sha = l.slice(2); continue; } if (l.trim() && files.length < 30) files.push({ file: l.trim(), sha }); }
    H = { counted: files.map((u) => ({ ...u, counts: analyzeText(git(REPO, ['show', `${u.sha}:${u.file}`])).counts })), excluded: [] };
  }
  const kPerSeat = {};
  for (const [seat, [, dir, sid]] of Object.entries(SEATS)) {
    const f = path.join(projects, dir, sid + '.jsonl');
    let units = [];
    try { units = keeperUnits(readThisMachineRows(f)); } catch (e) { kPerSeat[seat] = { error: e.code || e.message }; continue; }
    const pre = units.filter((u) => Date.parse(u.promptTs) < rMs);
    const post = units.filter((u) => Date.parse(u.promptTs) >= rMs);
    let take;
    if (control) take = pre.slice(-30);
    else if (exp[seat].exposure === null) { kPerSeat[seat] = { notDelivered: post.length }; continue; }
    else take = post.filter((u) => Date.parse(u.promptTs) >= exp[seat].exposure);
    kPerSeat[seat] = { units: take.length };
    for (const u of take) K.push({ seat, messageId: u.messageId, ts: u.ts, counts: analyzeText(u.text).counts });
  }
  if (control) { K.sort((a, b) => String(a.ts).localeCompare(String(b.ts))); K = K.slice(-30); }

  const result = {
    spec: 'exo_memory/loop/label_rule_watch_registration_2026-09-27.md', proxy_note: PROXY_HEADER,
    mode: control ? 'CONTROL (W§1.3 detector control, before R)' : 'POST-RULE (after R, exposed seats only)',
    R: rSha, R_time: new Date(rMs).toISOString(), LABEL_RE: LABEL_RE.source,
    delivery: Object.fromEntries(Object.entries(exp).map(([s, e]) => [s, { pointer: e.pointer, regenerated: e.regenerated ? new Date(e.regenerated).toISOString() : null, exposed: e.exposure ? new Date(e.exposure).toISOString() : 'NOT DELIVERED' }])),
    H: { units: H.counted.length, excluded: H.excluded.length, totals: proxyTotals(H.counted), rows: H.counted.map((u) => ({ file: u.file, sha: u.sha.slice(0, 7), ...proxyRow(u.counts) })), excludedRows: H.excluded.map((u) => ({ file: u.file, why: u.why })) },
    K: { units: K.length, perSeat: kPerSeat, totals: proxyTotals(K), rows: K.map((u) => ({ seat: u.seat, messageId: u.messageId, ts: u.ts, ...proxyRow(u.counts) })) },
  };
  if (control) result.DG_A1 = ['H', 'K'].map((s) => { const sh = result[s].totals.proxy_line_label_share; return { stratum: s, proxy_line_label_share: sh, fires: sh !== null && sh > 0.05 }; });
  if (argv.includes('--json')) { console.log(JSON.stringify(result, null, 1)); return 0; }

  const pct = (x) => (x === null ? '—' : `${(100 * x).toFixed(1)}%`);
  console.log(`label-watch · ${result.mode} · spec ${result.spec}`);
  console.log(`command: node consonance/tools/label-watch.js ${argv.join(' ')}`.trim());
  console.log(`R = ${rSha.slice(0, 7)} (${result.R_time}) · LABEL_RE /${LABEL_RE.source}/ (line-start markers, from BUILDING.md item 7 as landed)`);
  console.log('\nDELIVERY (W§1.4) — instance CLAUDE.md carries the rule (the pointer line, or item 7 itself) and was regenerated after R:');
  for (const [s, d] of Object.entries(result.delivery)) console.log(`  ${s.padEnd(9)} pointer ${d.pointer ? 'yes' : 'no '} · regenerated ${d.regenerated || '?'} · ${d.exposed}`);
  console.log('\n' + PROXY_HEADER);
  for (const s of ['H', 'K']) {
    const t = result[s].totals;
    console.log(`\n${s === 'H' ? 'H — hand-backs' : 'K — replies to the keeper'}: ${result[s].units} unit(s)${s === 'H' ? ` · ${result.H.excluded} excluded` : ''}`);
    console.log(`  labels: checked: ${t.checked} · inferred: ${t.inferred}`);
    console.log(`  proxy_lines_owing_a_label ${t.proxy_lines_owing_a_label} · proxy_owing_lines_labelled ${t.proxy_owing_lines_labelled} · proxy_owing_lines_unlabelled ${t.proxy_owing_lines_unlabelled} · proxy_line_label_share ${pct(t.proxy_line_label_share)}`);
    console.log(`  proxy_checked_line_shows_command: inline ${t.proxy_checked_line_shows_command_inline} · block ${t.proxy_checked_line_shows_command_block} · proxy_checked_line_shows_no_command ${t.proxy_checked_line_shows_no_command}`);
  }
  if (result.H.excludedRows.length) { console.log('\nH excluded:'); for (const r of result.H.excludedRows) console.log(`  ${r.why.padEnd(28)} ${r.file}`); }
  console.log('\nK per seat:', JSON.stringify(kPerSeat));
  const cols = 'checked · inferred · proxy_lines_owing_a_label · proxy_owing_lines_labelled · proxy_owing_lines_unlabelled · proxy_checked_line_shows_no_command';
  const vals = (r) => [r.checked, r.inferred, r.proxy_lines_owing_a_label, r.proxy_owing_lines_labelled, r.proxy_owing_lines_unlabelled, r.proxy_checked_line_shows_no_command].join(' · ');
  if (result.H.rows.length) { console.log(`\nH rows (file · ${cols}):`); for (const r of result.H.rows) console.log(`  ${r.file} ${r.sha} · ${vals(r)}`); }
  if (result.K.rows.length) { console.log(`\nK rows (seat · message · ${cols}):`); for (const r of result.K.rows) console.log(`  ${r.seat} ${r.messageId} · ${vals(r)}`); }
  if (control) for (const d of result.DG_A1) console.log(`\nDG-A1 (${d.stratum}): pre-rule proxy_line_label_share ${pct(d.proxy_line_label_share)} — ${d.fires ? 'FIRES: the detector counts vocabulary; refix before reading post-rule units' : 'does not fire (≤ 5%)'}`);
  return 0;
}

module.exports = { analyzeText, keeperUnits, handbackUnits, exposureOf, proxyTotals, PROXY_HEADER, LABEL_RE, POINTER, ITEM7, R_DEFAULT };
if (require.main === module) process.exit(main(process.argv.slice(2)));
