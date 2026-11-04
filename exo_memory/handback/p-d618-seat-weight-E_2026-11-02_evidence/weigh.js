// usage: node weigh.js <transcript.jsonl> <seat label> <window start ISO> > out.json
// One streaming pass over a Claude Code transcript (read once, line by line). Reports, for the window (default: the last 24 h before the file's last line):
//   context: the LIVE context the model was sent at each turn = input_tokens + cache_creation_input_tokens + cache_read_input_tokens of the FIRST
//            assistant message after each prompt (deduped by message id): last, median, p90, max; and the same over every assistant message
//   injected: hook_additional_context attachments (UserPromptSubmit / SessionStart text the harness adds to a turn), per item, by kind (first words),
//             in characters: total in the window, per prompt, and the kinds' shares; plus every other attachment type's characters
//   prompts: prompts in the window (user messages that are not tool results), of which keep-warm visits; keep-warm and prompts per local day (UTC-6) over the whole file
//   compactions: compact boundaries over the whole file and in the window
// Lines are typed from their first characters, and only the types needed are parsed; usage numbers are read by pattern, not by parsing the whole line.
'use strict';
const fs = require('fs'), readline = require('readline');
const [file, seat, winArg] = process.argv.slice(2);
const st = fs.statSync(file);
const tsOf = (l) => { const m = /"timestamp":"([^"]+)"/.exec(l.length > 4000 ? l.slice(-4000) + l.slice(0, 4000) : l); return m ? m[1] : null; };
const localDay = (iso) => new Date(Date.parse(iso) - 6 * 3600e3).toISOString().slice(0, 10);
const kindOf = (s) => {
  const t = s.trimStart();
  if (t.startsWith('[pulse]')) return 'pulse';
  if (/^\[room state|^\[state-block|state-block:/.test(t)) return 'state block';
  if (t.startsWith('# Shell context')) return 'shell context (SessionStart)';
  if (/^## The interval, witnessed|The interval, witnessed/.test(t.slice(0, 200))) return 'interval';
  if (/shelf/i.test(t.slice(0, 120))) return 'shelf';
  return 'other: ' + t.slice(0, 40).replace(/\s+/g, ' ');
};
const all = { assistantIds: new Set(), ctx: [], firstCtx: [], prompts: 0, keepwarm: 0, inj: {}, injTotal: 0, attach: {}, compactWin: 0 };
const afterCompact = []; let wantAfterCompact = false, minCtx = null, lastSplit = null;
const perDay = {}; let compactAll = 0, lastTs = null, firstTs = null, lines = 0, pendingFirst = false, winStart = winArg ? Date.parse(winArg) : null;
// the window: if not given, a first pass would be needed to know the last time; use the file's mtime instead (the transcript's last write)
if (!winStart) winStart = st.mtimeMs - 24 * 3600e3;
const inWin = (iso) => iso && Date.parse(iso) >= winStart;
const rl = readline.createInterface({ input: fs.createReadStream(file, { highWaterMark: 1 << 20 }), crlfDelay: Infinity });
rl.on('line', (l) => {
  lines++;
  const head = l.slice(0, 200);
  if (head.startsWith('{"type":"api-request') || head.startsWith('{"type":"file-history') || head.startsWith('{"type":"queue-operation')) return;
  const ts = tsOf(l); if (ts) { if (!firstTs) firstTs = ts; lastTs = ts; }
  if (l.includes('"subtype":"compact_boundary"')) { compactAll++; wantAfterCompact = true; if (inWin(ts)) all.compactWin++; return; }
  const isAssistant = /"type":"assistant"/.test(head) || /"role":"assistant"/.test(head) || (l.includes('"type":"assistant"') && l.includes('"usage":'));
  if (isAssistant && l.includes('"usage":')) {
    const id = (/"id":"(msg_[^"]+)"/.exec(l) || [])[1]; if (!id || all.assistantIds.has(id)) return; all.assistantIds.add(id);
    const n = (k) => { const m = new RegExp(`"${k}":(\\d+)`).exec(l); return m ? +m[1] : 0; };
    const ctx = n('input_tokens') + n('cache_creation_input_tokens') + n('cache_read_input_tokens');
    // the floor: the smallest context ever sent, and the first call after each compaction (what a seat carries with no conversation behind it)
    if (ctx > 0) { if (minCtx === null || ctx < minCtx.ctx) minCtx = { ts, ctx }; if (wantAfterCompact) { afterCompact.push({ ts, ctx }); wantAfterCompact = false; } }
    if (!inWin(ts)) { pendingFirst = false; return; }
    lastSplit = { ts, input: n('input_tokens'), cacheCreate: n('cache_creation_input_tokens'), cacheRead: n('cache_read_input_tokens'), output: n('output_tokens') };
    all.ctx.push(ctx); if (pendingFirst) { all.firstCtx.push({ ts, ctx }); pendingFirst = false; }
    return;
  }
  if (l.includes('"type":"attachment"') || head.includes('"attachment"')) {
    let o; try { o = JSON.parse(l); } catch (e) { return; }
    const a = o.attachment || {}; const t = a.type || '?';
    if (!inWin(o.timestamp)) return;
    if (t === 'hook_additional_context') {
      const items = Array.isArray(a.content) ? a.content : [String(a.content || '')];
      for (const s of items) { const k = kindOf(String(s)); all.inj[k] = (all.inj[k] || 0) + String(s).length; all.injTotal += String(s).length; }
    } else { const len = JSON.stringify(a).length; all.attach[t] = (all.attach[t] || 0) + len; }
    return;
  }
  if (/"type":"user"/.test(l.slice(0, 400)) || (l.includes('"type":"user"') && !l.includes('"tool_result"'))) {
    if (l.slice(0, 600).includes('"tool_result"') || l.includes('"toolUseResult"') && l.includes('"tool_result"')) return;
    let o; try { o = JSON.parse(l); } catch (e) { return; }
    if (o.type !== 'user' || o.isMeta || !o.message) return;
    const c = o.message.content; const text = typeof c === 'string' ? c : Array.isArray(c) ? c.filter((x) => x && x.type === 'text').map((x) => x.text).join('\n') : '';
    if (!text || (Array.isArray(c) && c.some((x) => x && x.type === 'tool_result'))) return;
    if (/^<(command-|local-command|task-notification)/.test(text.trim())) return;
    const kw = /^\[keep-warm visit/.test(text.trim());
    const day = localDay(o.timestamp); perDay[day] = perDay[day] || { prompts: 0, keepwarm: 0 }; perDay[day].prompts++; if (kw) perDay[day].keepwarm++;
    if (inWin(o.timestamp)) { all.prompts++; if (kw) all.keepwarm++; pendingFirst = true; }
  }
});
rl.on('close', () => {
  const q = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))]; };
  const first = all.firstCtx.map((x) => x.ctx);
  const injSorted = Object.entries(all.inj).sort((a, b) => b[1] - a[1]);
  const out = {
    seat, file, bytes: st.size, lines, firstTs, lastTs, window: { from: new Date(winStart).toISOString(), to: lastTs },
    contextAtTurn: { n: first.length, last: first.length ? first[first.length - 1] : null, median: q(first, 0.5), p90: q(first, 0.9), max: first.length ? Math.max(...first) : null },
    contextAllCalls: { n: all.ctx.length, median: q(all.ctx, 0.5), max: all.ctx.length ? Math.max(...all.ctx) : null },
    prompts: all.prompts, keepwarm: all.keepwarm,
    injectedChars: { total: all.injTotal, perPrompt: all.prompts ? Math.round(all.injTotal / all.prompts) : null, byKind: Object.fromEntries(injSorted) },
    otherAttachmentChars: Object.fromEntries(Object.entries(all.attach).sort((a, b) => b[1] - a[1]).slice(0, 8)),
    compactions: { all: compactAll, window: all.compactWin },
    floor: { minEver: minCtx, afterLastCompactions: afterCompact.slice(-5) }, lastCallSplit: lastSplit,
    perDay: Object.fromEntries(Object.entries(perDay).sort().slice(-10)),
  };
  process.stdout.write(JSON.stringify(out, null, 1) + '\n');
});
