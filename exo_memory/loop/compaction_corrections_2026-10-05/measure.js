// measure.js [--after ISO] [--root DIR] [--out FILE]: do the seat's CORRECTION-ADJACENT sentences survive compaction? (D245 item 1, pane C)
// Every definition is fixed by PREREG.md beside this file (committed 0d6faf70 before this file existed). The window rule, rowTexts, norm,
// the sentence split and flagSurvives are COPIED UNCHANGED from loop/2026-08-18/archaeology/extract.js (the method the precompact-preserve
// header cites). NOTHING READ IS PRINTED OR WRITTEN: the output is counts and event ids (file, timestamp) only. Any project dir matching
// /third-place/i is skipped by NAME before it is opened.
//   node measure.js                      all events, and the BASELINE set (after 2026-08-19T00:00Z)
//   node measure.js --after <ISO>        only events stamped after <ISO>: the bar's next compactions
'use strict';
const fs = require('fs'), path = require('path'), readline = require('readline');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ROOT = arg('--root', path.join(process.env.USERPROFILE || 'C:\\Users\\nname', '.claude', 'projects'));
const AFTER = arg('--after', null), OUT = arg('--out', null);
const BASELINE_AFTER = '2026-08-19T00:00:00Z';

// ── copied unchanged from archaeology/extract.js ──
function norm(s) { return s.replace(/\r\n/g, '\n').toLowerCase().replace(/\s+/g, ' ').trim(); }
const STOP = new Set(['this', 'that', 'with', 'from', 'have', 'were', 'been', 'will',
  'would', 'which', 'their', 'there', 'about', 'into', 'than', 'then', 'when', 'what',
  'because', 'before', 'after', 'while', 'where', 'should', 'could', 'does', 'only',
  'never', 'every', 'still', 'being', 'them', 'they', 'over', 'under', 'same', 'more']);
function flagSurvives(sentNorm, summaryNorm, summaryWordSet) {
  const words = sentNorm.split(' ').filter(w => w.length > 0);
  for (let i = 0; i + 5 <= words.length; i++) {
    if (summaryNorm.includes(words.slice(i, i + 5).join(' '))) return true;
  }
  const content = [...new Set(words.filter(w => w.length >= 4 && !STOP.has(w.replace(/[^a-z0-9]/g, ''))))];
  if (content.length === 0) return false;
  const hit = content.filter(w => summaryWordSet.has(w)).length;
  return hit / content.length >= 0.7;
}
function rowTexts(obj) {
  const msg = obj.message;
  if (!msg) return [];
  const c = msg.content;
  if (typeof c === 'string') return [c];
  if (Array.isArray(c)) return c.filter(b => b && b.type === 'text' && typeof b.text === 'string').map(b => b.text);
  return [];
}
const sentences = (text) => text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((t) => t.length >= 40);

// ── new, per PREREG.md ──
const cleanReply = (t) => t.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '').replace(/<\/?pasted_content[^>]*>/g, '');
const CORR_START = /^(no\b|nope\b|not quite|not really|wrong\b|incorrect|that'?s (not|wrong|incorrect)|that is (not|wrong)|actually\b|wait\b|hold on|you('?re| are) wrong|you were wrong|you missed|you forgot)/;
const CORR_ANY = /that'?s wrong|that is wrong|you'?re wrong|wrong again|you got it wrong|not what i (asked|meant|said)/;
const AGREE_START = /^(yes\b|yep\b|yeah\b|yea\b|right\b|exactly\b|correct\b|agreed\b|i agree|perfect\b|great\b|good\b|that'?s (it|right|true|correct|great|perfect)|love (it|this|that)|beautiful\b|nice\b|true\b|absolutely\b|indeed\b)/;
function replyClass(text) {
  const h = norm(cleanReply(text)).slice(0, 300);
  if (!h) return null;
  if (CORR_START.test(h) || CORR_ANY.test(h)) return 'correction';
  if (AGREE_START.test(h)) return 'agreement';
  return 'neither';
}

function scoreEvent(win, summary) {
  const sNorm = norm(summary), sWords = new Set(sNorm.split(' '));
  const cadj = new Set(), all = new Set(); let turn = [];
  const replies = { correction: 0, agreement: 0, neither: 0 };
  for (const r of win) {
    if (r.role === 'assistant') { turn.push(r.text); for (const s of sentences(r.text)) all.add(norm(s)); continue; }
    const k = replyClass(r.text); if (!k) continue;
    replies[k]++;
    if (k !== 'neither') for (const t of turn) for (const s of sentences(t)) cadj.add(norm(s));
    turn = [];
  }
  // a SET, as surv() reads .size: the first run had an Array here and reported control n = null (arithmetic only; C-ADJ was a Set all along)
  const control = new Set([...all].filter((s) => !cadj.has(s)));
  const surv = (set) => { let v = 0, f = 0; for (const s of set) { if (sNorm.includes(s)) v++; if (flagSurvives(s, sNorm, sWords)) f++; } return { n: set.size, verbatim: v, fuzzy: f }; };
  return { replies, cadj: surv(cadj), control: surv(control), summaryChars: summary.length };
}

async function scanFile(file, events) {
  const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity });
  let win = [];
  for await (const line of rl) {
    if (!line.trim()) continue;
    let obj; try { obj = JSON.parse(line); } catch (_) { continue; }
    if (obj.isSidechain === true || obj.isMeta === true) continue;
    const type = obj.type; if (type !== 'user' && type !== 'assistant') continue;
    const joined = rowTexts(obj).join('\n'); if (!joined) continue;
    if (type === 'user' && joined.trimStart().startsWith('This session is being continued')) {
      events.push({ file: path.relative(ROOT, file), ts: obj.timestamp || null, ...scoreEvent(win, joined) });
      win = []; continue;
    }
    win.push({ role: type, text: joined });
  }
}

(async () => {
  const dirs = fs.readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory());
  const skipped = dirs.filter((d) => /third-place/i.test(d.name)).map((d) => d.name);
  const events = [];
  let files = 0;
  for (const d of dirs) {
    if (/third-place/i.test(d.name)) continue;   // never opened
    const dir = path.join(ROOT, d.name);
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) if (f.isFile() && f.name.endsWith('.jsonl')) { files++; await scanFile(path.join(dir, f.name), events); }
  }
  const pool = (evs) => {
    const sum = (k, f) => evs.reduce((a, e) => a + e[k][f], 0);
    const med = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[s.length >> 1] : null; };
    const rate = (k) => ({ n: sum(k, 'n'), verbatim: sum(k, 'verbatim'), fuzzy: sum(k, 'fuzzy'),
      verbatimPct: sum(k, 'n') ? +(100 * sum(k, 'verbatim') / sum(k, 'n')).toFixed(2) : null, fuzzyPct: sum(k, 'n') ? +(100 * sum(k, 'fuzzy') / sum(k, 'n')).toFixed(2) : null,
      medianEventVerbatimPct: med(evs.filter((e) => e[k].n).map((e) => 100 * e[k].verbatim / e[k].n)) });
    const replies = evs.reduce((a, e) => { for (const k of Object.keys(e.replies)) a[k] = (a[k] || 0) + e.replies[k]; return a; }, {});
    return { events: evs.length, eventsWithCadj: evs.filter((e) => e.cadj.n).length, replies, cadj: rate('cadj'), control: rate('control'), summaryCharsMedian: med(evs.map((e) => e.summaryChars)) };
  };
  const after = (iso) => events.filter((e) => e.ts && e.ts > iso);
  const out = { root: ROOT, dirs: dirs.length, skippedByName: skipped, filesScanned: files,
    all: pool(events), baseline: { after: BASELINE_AFTER, ...pool(after(BASELINE_AFTER)) },
    ...(AFTER ? { requested: { after: AFTER, ...pool(after(AFTER)), eventIds: after(AFTER).map((e) => ({ file: e.file, ts: e.ts, cadj: e.cadj, chars: e.summaryChars })) } } : {}) };
  const text = JSON.stringify(out, null, 1);
  if (OUT) fs.writeFileSync(OUT, text);
  console.log(text);
})();
