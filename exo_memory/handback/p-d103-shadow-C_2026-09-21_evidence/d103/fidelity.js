// D103 fidelity probe. For every job file still on disk (the hook's REAL extracted view), rebuild the view from the
// session transcript cut at the job's created_at, with the hooks' own extraction logic, and compare byte for byte.
// Prints counts and lengths only — never conversation text.
const fs = require('fs'), path = require('path'), os = require('os');
const HOME = os.homedir();
const PROJECTS = path.join(HOME, '.claude', 'projects');

function transcriptFor(sid) {
  for (const d of fs.readdirSync(PROJECTS)) {
    const p = path.join(PROJECTS, d, sid + '.jsonl');
    if (fs.existsSync(p)) return p;
  }
  return null;
}
const parse = (s) => { try { return JSON.parse(s); } catch { return {}; } };
function extractText(msg) {
  if (!msg) return '';
  if (typeof msg.content === 'string') return msg.content;
  if (Array.isArray(msg.content)) return msg.content.filter((p) => p.type === 'text').map((p) => p.text).join('\n');
  return '';
}
/** Lines of the transcript as of `at`: everything up to and including the last line timestamped <= at. */
function linesAsOf(file, at) {
  const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
  let cut = -1;
  lines.forEach((l, i) => { const t = parse(l).timestamp; if (t && t <= at) cut = i; });
  return lines.slice(0, cut + 1);
}
// The L2 hook's logic (l2-overseer.js readNarrowedView), minus the 4 MB tail read (measured separately below).
function l2View(lines) {
  let a = null, u = null;
  for (let i = lines.length - 1; i >= 0; i--) {
    const o = parse(lines[i]);
    if (!o.message) continue;
    if (o.message.role === 'assistant' && !a) { if (extractText(o.message).trim()) a = o.message; }
    else if (o.message.role === 'user' && !u && a) { if (extractText(o.message).trim()) u = o.message; }
    if (a && u) break;
  }
  if (!a) return null;
  return { assistant_move: extractText(a).slice(0, 8000), user_context: u ? extractText(u).slice(0, 4000) : null };
}
// The L3 hook's logic (l3-overseer.js readTrajectoryView).
function l3View(lines) {
  const t = [];
  for (const l of lines) {
    const o = parse(l);
    if (!o.message || o.message.role !== 'user') continue;
    const x = extractText(o.message).trim();
    if (!x) continue;
    t.push({ timestamp: o.timestamp || null, text: x.slice(0, 2000) });
  }
  return t.length ? t.slice(-10) : null;
}
const out = { l2: [], l3: [] };
for (const [kind, dir] of [['l2', path.join(HOME, '.claude', 'shell', 'l2-jobs')], ['l3', path.join(HOME, '.claude', 'shell', 'l3-jobs')]]) {
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const job = parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const tp = transcriptFor(job.session_id);
    if (!tp) { out[kind].push({ job: job.job_id, result: 'NO-TRANSCRIPT' }); continue; }
    const size = fs.statSync(tp).size;
    const lines = linesAsOf(tp, job.created_at);
    const got = kind === 'l2' ? l2View(lines) : l3View(lines);
    const want = kind === 'l2' ? job.view : job.user_turns;
    const same = JSON.stringify(got) === JSON.stringify(want);
    let detail = '';
    if (!same && kind === 'l2' && got && want) {
      detail = `assistant ${got.assistant_move === want.assistant_move ? 'same' : 'DIFF'} (${(got.assistant_move || '').length} vs ${(want.assistant_move || '').length}), `
        + `user ${got.user_context === want.user_context ? 'same' : 'DIFF'}`;
    }
    if (!same && kind === 'l3' && got && want) {
      const eq = got.filter((g, i) => want[i] && g.text === want[i].text && g.timestamp === want[i].timestamp).length;
      detail = `${eq} of ${want.length} turns identical (rebuilt ${got.length})`;
    }
    out[kind].push({ job: job.job_id, created: job.created_at, transcriptMB: +(size / 1048576).toFixed(1),
      result: same ? 'IDENTICAL' : (got ? 'DIFFERENT' : 'REBUILT-NULL'), detail });
  }
}
for (const k of ['l2', 'l3']) {
  const c = {}; for (const r of out[k]) c[r.result] = (c[r.result] || 0) + 1;
  console.log(k.toUpperCase(), JSON.stringify(c));
  for (const r of out[k]) console.log('  ', r.job, r.created || '', r.transcriptMB != null ? r.transcriptMB + 'MB' : '', r.result, r.detail || '');
}
