#!/usr/bin/env node
// D301 part 2 (seat A, 2026-10-11): the sample of caught errors, frozen. It GATHERS and JUDGES NOTHING.
// No unit is labelled miss / not-miss / stale / reasoning here; that is C's blind read, from B's definitions.
//
// Population: E's scoreboard rows (p-scoreboard-E_2026-10-11_evidence/out/rows.tsv), sources W (the librarian's WRONG entries),
// H (hand-back corrections) and L (catch-ledger). Source G (383 gate refusals, all "not-a-catch" by E's rule) is not a catch and is out.
// Draw: per finder stratum, rows ordered by sha256(seed|src|at|text[0:80]) and the first n taken. Order-independent and seeded.
// Plus today's two cases (today.json), added whole and marked stratum "today".
//
// Per unit, mechanically (every figure from a command or a file in the repo at --rev):
//   correction_at / correction_text   the row's file:line and the item that starts there (to the blank line / next item, cap 3000 chars)
//   correction_line_time              git blame committer time of that line at --rev; file_first_commit = git log --diff-filter=A
//   claim_at / claim_text             only where a human already wrote the pair (today's two). Elsewhere null: the correction item quotes the claim
//   cited_refs                        every path (and path:line) the correction item cites, resolved in the repo at --rev, with its first-commit
//                                     time (git log --diff-filter=A --format=%cI -- <path>, the oldest line) and, for path:line, the blame time of that line
//   transcript                        the earliest ASSISTANT-authored occurrence (text or tool_use input) of any quoted span of the item (>= 30 chars,
//                                     whitespace collapsed) across the transcripts of A, B, C, E, librarian, main (never third-place); the folder it
//                                     was found in is the seat; opened_before_claim / opened_in_turn are the Read tool_use file_paths of the turn that
//                                     holds it (turn = from the real user message before it to the next real user message)
//   status                            found | claim-not-located | no-transcript (the row's day is before that folder's first transcript, or no quoted span)
//
// Run: node sample.js --repo <worktree> --rev 2f2b3a6a --rows <rows.tsv> --projects ~/.claude/projects --today today.json --out out
//      [--seed d301-2026-10-11] [--alloc keeper=12,instrument=12,unattributed=5,seat=31] [--until 2026-10-11T21:36:00-06:00]
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process'), readline = require('readline'), os = require('os');

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : d; };
const REPO = arg('--repo'), REV = arg('--rev', 'HEAD'), ROWS = arg('--rows'), PROJ = arg('--projects'), OUT = arg('--out'), TODAY = arg('--today');
const FALLBACK = arg('--fallback-checkout'); // a checkout with UNCOMMITTED lines that a row cites; read only where the line is not at --rev
const SEED = arg('--seed', 'd301-2026-10-11');
const ALLOC = Object.fromEntries(arg('--alloc', 'keeper=12,instrument=12,unattributed=5,seat=31').split(',').map((s) => { const [k, v] = s.split('='); return [k, Number(v)]; }));
const UNTIL = Date.parse(arg('--until', '2026-10-11T21:36:00-06:00'));
if (!REPO || !ROWS || !PROJ || !OUT) { console.error('need --repo --rows --projects --out'); process.exit(2); }

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const git = (args) => cp.execFileSync('git', ['-C', REPO, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 });
const gitTry = (args) => { try { return git(args); } catch { return null; } };
const norm = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- the population
const lines = fs.readFileSync(ROWS, 'utf8').split('\n').filter(Boolean);
const head = lines[0].split('\t');
const rows = lines.slice(1).map((l) => { const c = l.split('\t'); const o = {}; head.forEach((h, i) => { o[h] = c[i]; }); return o; });
const pop = rows.filter((r) => r.src === 'W' || r.src === 'H' || r.src === 'L');
const strata = {};
for (const r of pop) (strata[r.finder] = strata[r.finder] || []).push(r);
const popCounts = Object.fromEntries(Object.entries(strata).map(([k, v]) => [k, v.length]));
const rank = (r) => sha(`${SEED}|${r.src}|${r.at}|${(r.text || '').slice(0, 80)}`);
const drawn = [];
for (const [f, n] of Object.entries(ALLOC)) {
  const pool = (strata[f] || []).slice().sort((a, b) => (rank(a) < rank(b) ? -1 : 1));
  if (pool.length < n) throw new Error(`stratum ${f}: ${pool.length} rows, asked ${n}`);
  pool.slice(0, n).forEach((r) => drawn.push({ ...r, stratum: f, stratum_pop: pool.length, stratum_n: n }));
}
const unknownStrata = Object.keys(strata).filter((f) => !(f in ALLOC));
if (unknownStrata.length) throw new Error('finders with no allocation: ' + unknownStrata);
const today = TODAY ? JSON.parse(fs.readFileSync(TODAY, 'utf8')) : [];
const units = [
  ...drawn.map((r, i) => ({ id: `S${String(i + 1).padStart(2, '0')}`, row: r })),
  ...today.map((t, i) => ({ id: `T${i + 1}`, row: null, today: t })),
];

// ---------------------------------------------------------------- git facts
const tracked = git(['ls-tree', '-r', '--name-only', REV]).split('\n').filter(Boolean);
const byBase = {};
for (const f of tracked) (byBase[path.posix.basename(f)] = byBase[path.posix.basename(f)] || []).push(f);
const trackedSet = new Set(tracked);
const firstAdd = {};
{
  const o = git(['log', REV, '--diff-filter=A', '--name-only', '--format=@@%H\t%cI']);
  let cur = null;
  for (const l of o.split('\n')) {
    if (l.startsWith('@@')) { const [h, t] = l.slice(2).split('\t'); cur = { sha: h, t }; } else if (l && cur) firstAdd[l] = cur; // newest first, so the last write is the oldest add
  }
}
const showCache = {};
const show = (p) => (p in showCache ? showCache[p] : (showCache[p] = gitTry(['show', `${REV}:${p}`])));
function blame(p, ln) {
  const o = gitTry(['blame', '-L', `${ln},${ln}`, '--porcelain', REV, '--', p]);
  if (!o) return null;
  const sh = o.split('\n')[0].split(' ')[0];
  const m = /^committer-time (\d+)/m.exec(o);
  return m ? { sha: sh.slice(0, 8), t: new Date(Number(m[1]) * 1000).toISOString() } : null;
}
function wc(p) { if (!FALLBACK) return null; try { return fs.readFileSync(path.join(FALLBACK, p), 'utf8'); } catch { return null; } }
function itemAt(p, ln, src) {
  const t = src === 'working-copy' ? wc(p) : show(p);
  if (t == null) return null;
  const L = t.split('\n');
  if (ln < 1 || ln > L.length) return { text: null, line: null, oob: true };
  const ind = (s) => s.match(/^\s*/)[0].length;
  const start = L[ln - 1];
  const isItem = /^\s*([-*]|\d+[.)])\s/.test(start);
  const out = [start];
  for (let i = ln; i < L.length && out.join('\n').length < 3000; i++) {
    const s = L[i];
    if (!s.trim() || /^#{1,6}\s/.test(s)) break;
    if (isItem && ind(s) <= ind(start) && /^\s*([-*]|\d+[.)])\s/.test(s)) break;
    out.push(s);
  }
  return { text: out.join('\n').slice(0, 3000), line: start, oob: false };
}
function locate(p, ln, rowText) {
  const key = norm((rowText || '').replace(/[*`]/g, '')).slice(0, 25);
  const has = (s) => key.length >= 8 && norm((s || '').replace(/[*`]/g, '')).includes(key);
  const free = key.length < 8 || /withheld/.test(rowText || '');
  const tries = [['rev', show(p)], ['working-copy', wc(p)]].filter(([, t]) => t != null);
  if (!tries.length) return { exists: false, ln: null, matches: false, src: null };
  for (const [src, t] of tries) {
    const L = t.split('\n');
    if (ln >= 1 && ln <= L.length && (has(L[ln - 1]) || free)) return { exists: true, ln, matches: has(L[ln - 1]), src };
  }
  for (const [src, t] of tries) {
    const f = t.split('\n').findIndex(has);
    if (f >= 0) return { exists: true, ln: f + 1, matches: false, relocated: true, src };
  }
  const fit = tries.find(([, t]) => t.split('\n').length >= ln) || tries[0]; // the row's text is E's own note, not the line: take the first source that HAS the line
  return { exists: true, ln, matches: false, src: fit[0] };
}

// path / path:line citations inside a text
const REF = /(?<![\w\/.\-:])((?:[A-Za-z0-9_.\-]+\/)*[A-Za-z0-9_.\-]*[A-Za-z0-9_]\.(?:md|js|rs|json|jsonl|tsv|ps1|html|txt|toml|yml|py|css))(?::(\d+)(?:[-–](\d+))?)?/g;
function refs(text, selfPath) {
  const seen = new Map();
  for (const m of text.matchAll(REF)) {
    const raw = m[1].replace(/\\/g, '/');
    if (/^(https?|www)/.test(raw) || raw.includes('..')) continue;
    const key = raw + ':' + (m[2] || '');
    if (seen.has(key)) continue;
    let res = null, how = null;
    if (trackedSet.has(raw)) { res = raw; how = 'exact'; }
    else if (trackedSet.has('exo_memory/' + raw)) { res = 'exo_memory/' + raw; how = 'exo_memory/ prefix'; }
    else {
      const c = byBase[path.posix.basename(raw)] || [];
      if (c.length === 1) { res = c[0]; how = 'unique basename'; } else if (c.length > 1) how = `ambiguous (${c.length})`; else how = 'not tracked at rev';
    }
    const ent = { cited: raw + (m[2] ? ':' + m[2] + (m[3] ? '-' + m[3] : '') : ''), resolved: res, how, first_commit: null, first_commit_sha: null, line_time: null, line_commit: null };
    if (res) {
      const fa = firstAdd[res];
      if (fa) { ent.first_commit = fa.t; ent.first_commit_sha = fa.sha.slice(0, 8); }
      if (m[2]) { const b = blame(res, Number(m[2])); if (b) { ent.line_time = b.t; ent.line_commit = b.sha; } }
    }
    seen.set(key, ent);
  }
  return [...seen.values()].filter((e) => e.resolved || !/^[A-Za-z0-9_.\-]+\.(md|js|rs|json)$/.test(e.cited) || true);
}

function spans(text) {
  const out = [];
  const add = (s) => { const n = norm(s); if (n.length >= 30 && !out.includes(n)) out.push(n); };
  for (const m of text.matchAll(/\*?["“]([^"”\n]{30,400})["”]\*?/g)) add(m[1]);
  for (const m of text.matchAll(/`([^`\n]{40,300})`/g)) add(m[1]);
  return out.slice(0, 8);
}

// ---------------------------------------------------------------- gather per unit (git side)
const FOLDERS = { 'sibling-3d57124e': 'A', 'sibling-5bf9d657': 'B', 'sibling-0845a868': 'C', 'sibling-07b8a48f': 'E', librarian: 'librarian', main: 'chair' };
for (const u of units) {
  const r = u.row;
  if (r) {
    const [p, lnS] = r.at.split(/:(?=\d+$)/);
    const loc = locate(p, Number(lnS), r.text);
    u.correction_at = `${p}:${loc.ln || lnS}`;
    u.row_at = r.at;
    u.row_at_line_matches = loc.matches;
    if (loc.relocated) u.row_at_relocated = true;
    if (!loc.exists) u.correction_in_repo_at_rev = false;
    const it = loc.exists ? itemAt(p, loc.ln, loc.src) : null;
    u.correction_text = it ? it.text : null;
    u.correction_text_source = loc.src;
    const fn = path.posix.basename(p);
    const sl = /-([A-E])_\d{4}-/.exec(fn);
    u.seat_by_filename = sl ? sl[1] : (r.src === 'W' ? 'librarian (WRONG column; the erring seat is not in the row)' : null);
    u.finder = r.finder; u.rule = r.rule; u.src = r.src; u.stratum = r.stratum; u.stratum_pop = r.stratum_pop; u.stratum_n = r.stratum_n; u.day = r.day;
    u.correction_file = p;
    u.correction_file_first_commit = firstAdd[p] ? { t: firstAdd[p].t, sha: firstAdd[p].sha.slice(0, 8) } : null;
    u.correction_line_time = loc.exists && loc.src === 'rev' ? blame(p, loc.ln)
      : (loc.src === 'working-copy' ? { sha: 'uncommitted', t: fs.statSync(path.join(FALLBACK, p)).mtime.toISOString(), note: 'working-copy mtime' } : null);
    u.claim_at = null; u.claim_text = null; u.claim_line_time = null;
    delete u.row;
  } else {
    const t = u.today;
    const [cp_, cl] = t.correction_at.split(/:(?=\d+(?:-\d+)?$)/);
    const clN = Number(cl.split('-')[0]);
    const it = itemAt(cp_, clN, 'rev');
    u.correction_at = t.correction_at; u.correction_text = it && it.text;
    u.correction_file = cp_;
    u.correction_file_first_commit = firstAdd[cp_] ? { t: firstAdd[cp_].t, sha: firstAdd[cp_].sha.slice(0, 8) } : null;
    u.correction_line_time = blame(cp_, clN);
    const [xp, xl] = t.claim_at.split(/:(?=\d+$)/);
    const xt = show(xp);
    const xsrc = xt != null && xt.split('\n').length >= Number(xl) ? 'rev' : 'working-copy';
    const ci = itemAt(xp, Number(xl), xsrc);
    u.claim_at = t.claim_at; u.claim_text = ci && ci.text; u.claim_text_source = xsrc;
    u.claim_line_time = xsrc === 'rev' ? blame(xp, Number(xl))
      : (FALLBACK ? { sha: 'uncommitted', t: fs.statSync(path.join(FALLBACK, xp)).mtime.toISOString(), note: 'working-copy mtime' } : null);
    u.seat_by_filename = t.erring_seat; u.finder = t.finder; u.rule = 'today'; u.src = 'T'; u.stratum = 'today'; u.stratum_pop = null; u.stratum_n = null;
    u.day = '2026-10-11'; u.answer_on_disk_pointed_at_by_the_brief = t.answer_on_disk;
    u.row_at = null; u.row_at_line_matches = null;
    delete u.today;
  }
  const body = (u.correction_text || '') + '\n' + (u.claim_text || '');
  u.cited_refs = refs(body, u.correction_file).slice(0, 40);
  for (const e of u.cited_refs) if (!e.resolved) { e.first_commit = null; }
  u._spans = spans(u.claim_text ? u.claim_text + '\n' + (u.correction_text || '') : (u.correction_text || ''));
  u.quoted_spans = u._spans.slice();
}

// ---------------------------------------------------------------- transcripts
const hits = {}; // id -> earliest {ts,file,seat,...}
const coverage = {};
const tx = [];
for (const d of fs.readdirSync(PROJ)) {
  const m = /^C--Consonance-instances-(.+)$/.exec(d);
  if (!m || !(m[1] in FOLDERS)) continue;
  for (const f of fs.readdirSync(path.join(PROJ, d))) if (f.endsWith('.jsonl')) tx.push({ folder: m[1], file: path.join(PROJ, d, f) });
}
const isRealUser = (o) => {
  if (o.type !== 'user' || !o.message) return false;
  const c = o.message.content;
  if (typeof c === 'string') return c.trim().length > 0;
  if (!Array.isArray(c)) return false;
  return c.some((b) => b && b.type === 'text' && b.text && b.text.trim());
};
function assistantStrings(o) {
  const out = [], reads = [];
  const c = o.message && o.message.content;
  if (!Array.isArray(c)) return { text: '', reads };
  for (const b of c) {
    if (b.type === 'text' && b.text) out.push(b.text);
    else if (b.type === 'tool_use') {
      if (b.name === 'Read' && b.input && b.input.file_path) reads.push(b.input.file_path);
      const walk = (v) => { if (typeof v === 'string') out.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
      walk(b.input);
    }
  }
  return { text: norm(out.join('\n')), reads };
}
const corrHits = {}; // id -> earliest assistant-authored occurrence of the correction item's own first line (the turn that WROTE the correction)
const ownKey = (u) => { const first = (u.correction_text || '').split('\n')[0].replace(/^\s*([-*]|\d+[.)])\s+/, '').replace(/[*`]/g, ''); const n = norm(first).slice(0, 90); return n.length >= 30 ? n : null; };
units.forEach((u) => { u._own = ownKey(u); });
const lower = (p) => p.replace(/\\/g, '/').toLowerCase();
async function scan(t) {
  const rl = readline.createInterface({ input: fs.createReadStream(t.file, { encoding: 'utf8' }), crlfDelay: Infinity });
  let turnReads = [], turnStart = null, first = null, last = null;
  const readFirst = new Map(); // path (lower, / separators) -> first Read timestamp in this transcript
  const pending = [];
  const close = () => { for (const h of pending) h.opened_in_turn = turnReads.slice(); pending.length = 0; };
  for await (const line of rl) {
    if (!line.includes('"type":"assistant"') && !line.includes('"type":"user"')) continue;
    let o; try { o = JSON.parse(line); } catch { continue; }
    const ts = o.timestamp ? Date.parse(o.timestamp) : NaN;
    if (!isNaN(ts) && ts > UNTIL) continue;
    if (o.timestamp) { if (!first) first = o.timestamp; last = o.timestamp; }
    if (isRealUser(o)) { close(); turnReads = []; turnStart = o.timestamp || null; continue; }
    if (o.type !== 'assistant') continue;
    const { text, reads } = assistantStrings(o);
    for (const r of reads) { turnReads.push(r); const k = lower(r); if (!readFirst.has(k)) readFirst.set(k, o.timestamp || null); }
    if (!text) continue;
    const textNoMd = text.replace(/[*`]/g, '');
    for (const u of units) {
      const base = { ts: o.timestamp, folder: t.folder, seat: FOLDERS[t.folder], transcript: path.relative(PROJ, t.file).replace(/\\/g, '/'), turn_start: turnStart, opened_before: turnReads.slice() };
      const sp = u._spans.length && (!hits[u.id] || ts < Date.parse(hits[u.id].ts)) ? u._spans.find((s) => text.includes(s)) : null;
      if (sp) { const h = { ...base, span: sp.slice(0, 120) }; hits[u.id] = h; pending.push(h); }
      if (u._own && (!corrHits[u.id] || ts < Date.parse(corrHits[u.id].ts)) && textNoMd.includes(u._own)) {
        const earlier = [];
        for (const e of u.cited_refs) {
          if (!e.resolved) continue;
          const want = '/' + lower(e.resolved);
          for (const [k, v] of readFirst) if (k.endsWith(want) || k === lower(e.resolved)) { earlier.push({ path: e.resolved, first_read_in_this_transcript: v }); break; }
        }
        const h = { ...base, cited_paths_already_read_in_this_transcript: earlier };
        corrHits[u.id] = h; pending.push(h);
      }
    }
  }
  close();
  coverage[t.folder] = coverage[t.folder] || { first: null, last: null, files: 0 };
  const c = coverage[t.folder]; c.files++;
  if (first && (!c.first || first < c.first)) c.first = first;
  if (last && (!c.last || last > c.last)) c.last = last;
}
const dedupe = (a) => [...new Set((a || []).map((p) => p.replace(/\\/g, '/')))];
const folderOf = (l) => { const k = Object.entries(FOLDERS).find(([, v]) => l && l.startsWith(v)); return k ? k[0] : null; };
(async () => {
  for (const t of tx) await scan(t);
  for (const u of units) {
    const h = hits[u.id], c = corrHits[u.id];
    const lbl = folderOf(u.seat_by_filename);
    const f = lbl && coverage[lbl];
    const before = f && f.first && u.day < f.first.slice(0, 10);
    const T = { status: null, claim: null, correction_turn: null };
    if (h) T.claim = { seat: h.seat, ts: h.ts, file: h.transcript, turn_start: h.turn_start, matched_span: h.span, opened_before_claim_in_turn: dedupe(h.opened_before), opened_in_whole_turn: dedupe(h.opened_in_turn || h.opened_before) };
    if (T.claim) { const ct = u.correction_file_first_commit && u.correction_file_first_commit.t; T.claim.after_correction_file_first_commit = ct ? Date.parse(h.ts) > Date.parse(ct) : null; const lt = u.correction_line_time && u.correction_line_time.t; T.claim.after_correction_line_time = lt ? Date.parse(h.ts) > Date.parse(lt) : null; }
    if (c) T.correction_turn = { seat: c.seat, ts: c.ts, file: c.transcript, turn_start: c.turn_start, opened_before_in_turn: dedupe(c.opened_before), opened_in_whole_turn: dedupe(c.opened_in_turn || c.opened_before), cited_paths_already_read_in_this_transcript: c.cited_paths_already_read_in_this_transcript };
    T.status = h ? 'claim-located' : c ? 'correction-turn-located' : (before ? 'no-transcript' : 'neither-located');
    T.why = h || c ? null : (before ? `row day ${u.day} is before ${lbl}'s first transcript ${f.first}` : (lbl || u.seat_by_filename ? 'neither the quoted spans nor the correction line were found in an assistant message of any scanned transcript' : 'no seat named in the row, and nothing found'));
    u.transcript = T;
    delete u._spans; delete u._own;
  }
  fs.mkdirSync(OUT, { recursive: true });
  const frozen = {
    function: 'sha256 over the UTF-8 bytes of units.json (this exact file)',
    seed: SEED, seed_function: 'rank = sha256(seed|src|at|text[0:80]); per finder stratum, ascending rank, first n taken',
    rev: REV, until: arg('--until', '2026-10-11T21:36:00-06:00'),
    population: { sources: 'W + H + L of rows.tsv (G, the 383 gate refusals, is not a catch)', counts_by_finder: popCounts, total: pop.length },
    allocation: ALLOC, drawn: drawn.length, today_added: today.length,
    transcript_coverage: coverage, seat_map: FOLDERS,
    units,
  };
  const json = JSON.stringify(frozen, null, 1) + '\n';
  fs.writeFileSync(path.join(OUT, 'units.json'), json);
  const tsv = ['id\tstratum\tstratum_pop\tfinder\tsrc\tday\tcorrection_at\tcorrection_line_time\tcorrection_file_first_commit\tn_refs\tn_refs_with_first_commit\tclaim_at\ttranscript_status\tclaim_seat\tclaim_ts\tn_opened_before_claim_in_turn\tcorrection_turn_ts\tn_cited_paths_already_read'];
  for (const u of units) {
    const t = u.transcript;
    tsv.push([u.id, u.stratum, u.stratum_pop, u.finder, u.src, u.day, u.correction_at, u.correction_line_time ? u.correction_line_time.t : '', u.correction_file_first_commit ? u.correction_file_first_commit.t : '',
      u.cited_refs.length, u.cited_refs.filter((e) => e.first_commit).length, u.claim_at || '', t.status, t.claim ? t.claim.seat : '', t.claim ? t.claim.ts : '', t.claim ? t.claim.opened_before_claim_in_turn.length : '', t.correction_turn ? t.correction_turn.ts : '', t.correction_turn ? t.correction_turn.cited_paths_already_read_in_this_transcript.length : ''].join('\t'));
  }
  fs.writeFileSync(path.join(OUT, 'units.tsv'), tsv.join('\n') + '\n');
  const dg = sha(json);
  const strataTxt = Object.keys(ALLOC).map((k) => `${k}: drew ${ALLOC[k]} of ${popCounts[k]}`).join(' · ');
  const digest = `units.json sha256 ${dg}\nfunction: sha256 over the UTF-8 bytes of out/units.json\nseed: ${SEED}\nstrata: ${strataTxt}\nunits: ${units.length} (${drawn.length} drawn + ${today.length} today)\n`;
  fs.writeFileSync(path.join(OUT, 'digest.txt'), digest);
  console.log(digest);
  const st = {}; units.forEach((u) => { st[u.transcript.status] = (st[u.transcript.status] || 0) + 1; });
  console.log('transcript status:', JSON.stringify(st));
})().catch((e) => { console.error(e); process.exit(1); });
