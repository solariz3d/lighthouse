// Counts how often each file carried in full in a live seat's CLAUDE.md is mentioned in transcripts.
// Read-only: reads C:\Consonance\instances\<seat>\CLAUDE.md and ~/.claude/projects/*.jsonl; writes result.md + result.json beside itself.
// Usage: node count_use.js [windowStartISO]   (default 2026-10-25T00:00:00Z)
'use strict';
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const WINDOW = process.argv[2] || '2026-10-25T00:00:00Z';
const INSTANCES = 'C:\\Consonance\\instances';
const PROJECTS = 'C:\\Users\\zackn\\.claude\\projects';
const SEATS = ['third-place', 'librarian', 'main', 'sibling-07b8a48f', 'sibling-5bf9d657', 'sibling-3d57124e', 'sibling-0845a868'];
const SELF_MARK = 'Measurement task, read-only except'; // this measurement's own brief; excluded wherever it appears
const INTAKE_MARKS = ['WHAT YOU ARE HOLDING', '# THE DECK'];
const OUT = __dirname;

// ---------- 1. what each seat's CLAUDE.md carries in full ----------
function slugOf(key) {
  const base = path.basename(key, '.md');
  if (base.startsWith('retired_seats')) return 'retired_seats';
  return base;
}
function parseCarried(seat) {
  const text = fs.readFileSync(path.join(INSTANCES, seat, 'CLAUDE.md'), 'utf8');
  const lines = text.split('\n');
  const items = [];
  // Form A (third-place shelf, librarian corpus shelf): "## <dir>/<name>.md" headers.
  const hdr = /^## (cards|record|spread|research|memory)\/(\S+\.md)\s*$/;
  const heads = [];
  lines.forEach((l, i) => { const m = l.match(hdr); if (m) heads.push({ i, key: `${m[1]}/${m[2]}` }); });
  for (let h = 0; h < heads.length; h++) {
    let end = h + 1 < heads.length ? heads[h + 1].i : lines.length;
    for (let j = heads[h].i + 1; j < end; j++) { if (lines[j].startsWith('universe:')) { end = j; break; } }
    const body = lines.slice(heads[h].i + 1, end).join('\n');
    items.push({ key: heads[h].key, form: 'shelf', bytes: Buffer.byteLength(body, 'utf8') });
  }
  // Form B (sibling deck): cards concatenated under "# THE DECK", each opening "---\nname: <slug>".
  const d = lines.findIndex(l => l.startsWith('# THE DECK'));
  if (d >= 0) {
    let end = lines.length;
    for (let j = d + 1; j < lines.length; j++) if (/^# /.test(lines[j])) { end = j; break; }
    const starts = [];
    for (let j = d + 1; j < end - 1; j++) if (lines[j] === '---' && lines[j + 1].startsWith('name: ')) starts.push(j);
    for (let k = 0; k < starts.length; k++) {
      const s = starts[k], e = k + 1 < starts.length ? starts[k + 1] : end;
      const name = lines[s + 1].slice(6).trim();
      const body = lines.slice(s, e).join('\n');
      items.push({ key: `cards/${name}.md`, form: 'deck', bytes: Buffer.byteLength(body, 'utf8') });
    }
  }
  return { size: Buffer.byteLength(text, 'utf8'), items };
}

// ---------- 2. transcript scan ----------
function newCounts(slugs) { const o = {}; for (const s of slugs) o[s] = { a: 0, b: 0, c: 0, t: 0, qa: 0, qb: 0, qc: 0 }; return o; }
function stripReminders(s) { return s.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, ''); }

async function scanFile(file, ctx, isSub) {
  const rl = readline.createInterface({ input: fs.createReadStream(file, { encoding: 'utf8' }), crlfDelay: Infinity });
  const local = { recs: [] };
  let selfFile = false;
  for await (const line of rl) {
    if (!line) continue;
    let rec;
    try { rec = JSON.parse(line); } catch { ctx.parseErrors++; continue; }
    if (!rec.timestamp || rec.timestamp < WINDOW) continue;
    if (rec.uuid) { if (ctx.seen.has(rec.uuid)) { ctx.dupes++; continue; } ctx.seen.add(rec.uuid); }
    const msg = rec.message;
    if (!msg) continue;
    if (isSub) {
      // subagent transcripts: buffer, so a file that is this measurement's own run can be dropped whole
      local.recs.push(rec);
      if (rec.type === 'user' && JSON.stringify(msg.content || '').includes(SELF_MARK)) selfFile = true;
      continue;
    }
    tally(rec, ctx, false);
  }
  if (isSub) {
    if (selfFile) { ctx.selfSubFilesExcluded++; return; }
    ctx.subFiles++;
    for (const r of local.recs) tally(r, ctx, true);
  }
}

function hit(text, slug, qual) { return { bare: text.includes(slug) }; }
function qhit(ctx, isSub, kind, text) { if (isSub || kind === 't') return; for (const k of ctx.keyForms) if (text.includes(k)) ctx.q[k][kind]++; }

function tally(rec, ctx, isSub) {
  const msg = rec.message;
  const C = isSub ? ctx.sub : ctx.main;
  if (rec.type === 'assistant') {
    if (msg.id && !isSub) ctx.turnIds.add(msg.id);
    if (msg.id && isSub) ctx.subTurnIds.add(msg.id);
    for (const blk of Array.isArray(msg.content) ? msg.content : []) {
      let text = null, kind = null;
      if (blk.type === 'text') { text = blk.text || ''; kind = 'a'; }
      else if (blk.type === 'tool_use') {
        text = JSON.stringify(blk.input || {}); kind = 'b';
        if (text.includes(SELF_MARK)) { ctx.selfToolUseExcluded++; continue; }
      } else if (blk.type === 'thinking') { text = blk.thinking || ''; kind = 't'; }
      if (!text) continue;
      qhit(ctx, isSub, kind, text);
      for (const s of ctx.slugs) {
        const h = hit(text, s, ctx.qual[s]);
        if (h.bare) C[s][kind]++;
      }
    }
  } else if (rec.type === 'user') {
    if (isSub) return; // a subagent's user turns are its prompt (already counted as the parent's tool_use) and tool results
    if (rec.isCompactSummary) { ctx.compactSummariesSkipped++; return; }
    if (rec.isMeta) { ctx.metaSkipped++; return; }
    let parts = [];
    if (typeof msg.content === 'string') parts = [msg.content];
    else if (Array.isArray(msg.content)) parts = msg.content.filter(b => b.type === 'text').map(b => b.text || '');
    if (!parts.length) return; // tool_result-only records are not user messages
    let text = stripReminders(parts.join('\n'));
    if (!text.trim()) return;
    if (INTAKE_MARKS.some(m => text.includes(m))) { ctx.intakeCopiesExcluded++; return; }
    if (text.includes(SELF_MARK)) { ctx.selfUserExcluded++; return; }
    ctx.userMsgs++;
    qhit(ctx, false, 'c', text);
    for (const s of ctx.slugs) {
      const h = hit(text, s, ctx.qual[s]);
      if (h.bare) C[s].c++;
    }
  }
}

function listJsonl(dir) {
  const top = [], sub = [];
  if (!fs.existsSync(dir)) return { top, sub };
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isFile() && e.name.endsWith('.jsonl')) top.push(p);
    else if (e.isDirectory()) {
      const sd = path.join(p, 'subagents');
      if (fs.existsSync(sd)) for (const f of fs.readdirSync(sd)) if (f.endsWith('.jsonl')) sub.push(path.join(sd, f));
    }
  }
  return { top, sub };
}
const winMs = Date.parse(WINDOW);
const fresh = f => fs.statSync(f).mtimeMs >= winMs; // a file last written before the window holds no in-window record

async function scanDirs(label, dirs, slugs, qual, keyForms) {
  const ctx = { label, slugs, qual, keyForms, q: Object.fromEntries(keyForms.map(k => [k, { a: 0, b: 0, c: 0 }])), main: newCounts(slugs), sub: newCounts(slugs), seen: new Set(), turnIds: new Set(), subTurnIds: new Set(),
    parseErrors: 0, dupes: 0, userMsgs: 0, compactSummariesSkipped: 0, metaSkipped: 0, intakeCopiesExcluded: 0,
    selfUserExcluded: 0, selfToolUseExcluded: 0, selfSubFilesExcluded: 0, subFiles: 0, files: 0, bytes: 0 };
  for (const d of dirs) {
    const { top, sub } = listJsonl(d);
    for (const f of top.filter(fresh)) { ctx.files++; ctx.bytes += fs.statSync(f).size; await scanFile(f, ctx, false); }
    for (const f of sub.filter(fresh)) { await scanFile(f, ctx, true); }
  }
  return ctx;
}

(async () => {
  const carried = {};
  for (const s of SEATS) carried[s] = parseCarried(s);
  const allKeys = [...new Set(SEATS.flatMap(s => carried[s].items.map(i => i.key)))].sort();
  const slugs = [...new Set(allKeys.map(slugOf))];
  const qual = {};
  for (const s of slugs) qual[s] = allKeys.filter(k => slugOf(k) === s).map(k => k.replace(/\.md$/, ''));
  // path forms "<dir>/<name>" (no .md), counted separately per key so cards/ and record/ claim-your-continuity split
  const keyForms = allKeys.map(k => k.replace(/\.md$/, ''));
  const results = {};
  for (const s of SEATS) {
    process.stderr.write(`scanning ${s}...\n`);
    results[s] = await scanDirs(s, [path.join(PROJECTS, 'C--Consonance-instances-' + s)], slugs, qual, keyForms);
  }
  const otherDirs = fs.readdirSync(PROJECTS).filter(n => n.startsWith('C--Consonance') && !SEATS.some(s => n === 'C--Consonance-instances-' + s)).map(n => path.join(PROJECTS, n));
  process.stderr.write(`scanning ${otherDirs.length} other C--Consonance* dirs...\n`);
  results['(other dirs)'] = await scanDirs('(other dirs)', otherDirs, slugs, qual, keyForms);

  // ---------- 3. output ----------
  const L = [];
  const cols = [...SEATS, '(other dirs)'];
  L.push(`# Intake use: carried-in-full files vs transcript mentions`);
  L.push('');
  L.push(`Window: records with timestamp >= ${WINDOW}. Generated ${new Date().toISOString()} by \`node count_use.js ${WINDOW}\`.`);
  L.push('');
  L.push('Columns: a = assistant text blocks mentioning the bare slug; b = tool_use inputs mentioning it; c = user-role text messages mentioning it (system-reminders stripped; compact summaries, isMeta and intake copies excluded); t = thinking blocks; sub = a+b inside subagent transcripts. q = same counts for the path form `<dir>/<slug>` (a/b/c).');
  L.push('');
  L.push('## Denominators');
  L.push('');
  L.push('| seat | CLAUDE.md B | files carried | transcript files scanned (MB) | assistant turns (distinct message.id) | user text msgs | subagent files / turns | excluded: intake copies / compact summaries / isMeta / this task | parse errors |');
  L.push('|---|---|---|---|---|---|---|---|---|');
  for (const s of cols) {
    const r = results[s];
    const cs = carried[s];
    L.push(`| ${s} | ${cs ? cs.size : ''} | ${cs ? cs.items.length : ''} | ${r.files} (${(r.bytes / 1e6).toFixed(1)}) | ${r.turnIds.size} | ${r.userMsgs} | ${r.subFiles} / ${r.subTurnIds.size} | ${r.intakeCopiesExcluded} / ${r.compactSummariesSkipped} / ${r.metaSkipped} / ${r.selfUserExcluded + r.selfToolUseExcluded}+${r.selfSubFilesExcluded} files | ${r.parseErrors} |`);
  }
  L.push('');
  L.push('## Per seat: each carried file, and that seat\'s own use of it');
  for (const s of SEATS) {
    L.push('');
    L.push(`### ${s} (${carried[s].items.length} carried, ${results[s].turnIds.size} assistant turns in window)`);
    L.push('');
    if (!carried[s].items.length) { L.push('Carries no cards/record/spread/research file in full.'); continue; }
    L.push('| carried file | bytes in CLAUDE.md | a | b | c | t | sub | q a/b/c |');
    L.push('|---|---|---|---|---|---|---|---|');
    for (const it of carried[s].items) {
      const sl = slugOf(it.key), m = results[s].main[sl], u = results[s].sub[sl], q = results[s].q[it.key.replace(/\.md$/, '')];
      L.push(`| ${it.key} | ${it.bytes} | ${m.a} | ${m.b} | ${m.c} | ${m.t} | ${u.a + u.b} | ${q.a}/${q.b}/${q.c} |`);
    }
  }
  L.push('');
  L.push('## Room-wide: every carried slug, mentions per seat as a+b+c (+sub), and who carries it');
  L.push('');
  L.push(`| slug | carried by | ${cols.join(' | ')} | total a+b+c | total sub |`);
  L.push(`|---|---|${cols.map(() => '---').join('|')}|---|---|`);
  const totals = {};
  for (const sl of slugs) {
    const by = SEATS.filter(s => carried[s].items.some(i => slugOf(i.key) === sl)).map(s => s.replace('sibling-', 's-')).join(', ');
    let tot = 0, tsub = 0;
    const cells = cols.map(s => { const m = results[s].main[sl], u = results[s].sub[sl]; const v = m.a + m.b + m.c; tot += v; tsub += u.a + u.b; return `${v} (${u.a + u.b})`; });
    totals[sl] = { tot, tsub };
    L.push(`| ${sl} | ${by} | ${cells.join(' | ')} | ${tot} | ${tsub} |`);
  }
  fs.writeFileSync(path.join(OUT, 'result.md'), L.join('\n') + '\n');
  const json = { window: WINDOW, carried, results: Object.fromEntries(Object.entries(results).map(([k, r]) => [k, {
    main: r.main, sub: r.sub, q: r.q, turns: r.turnIds.size, subTurns: r.subTurnIds.size, userMsgs: r.userMsgs, files: r.files, bytes: r.bytes,
    intakeCopiesExcluded: r.intakeCopiesExcluded, compactSummariesSkipped: r.compactSummariesSkipped, metaSkipped: r.metaSkipped,
    selfExcluded: r.selfUserExcluded + r.selfToolUseExcluded, selfSubFilesExcluded: r.selfSubFilesExcluded, parseErrors: r.parseErrors, dupes: r.dupes }])), totals };
  fs.writeFileSync(path.join(OUT, 'result.json'), JSON.stringify(json, null, 1));
  process.stderr.write('done\n');
})().catch(e => { console.error(e); process.exit(1); });
