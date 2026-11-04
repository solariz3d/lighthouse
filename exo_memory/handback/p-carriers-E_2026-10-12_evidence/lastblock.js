// lastblock.js (pane E, D307 part 2): the last N hook-injected blocks in a transcript that START with a given prefix, with their
// timestamps. Only records whose type is hook_additional_context (or an attachment carrying one) are read, so the seat's own
// text and tool calls never match. Free text after an `↳ <speaker>:` marker is elided, and home paths are shortened to ~.
//   node lastblock.js <transcript> "<prefix>" [n] [maxChars]
'use strict';
const fs = require('fs'), readline = require('readline');
const [file, prefix, nArg, maxArg] = process.argv.slice(2);
const N = Number(nArg || 1), MAX = Number(maxArg || 900);
const found = [];
const texts = (o) => {
  const out = [];
  const walk = (v) => {
    if (typeof v === 'string') { if (v.startsWith(prefix) || v.includes('\n' + prefix)) out.push(v.slice(v.indexOf(prefix))); }
    else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k]);
  };
  walk(o);
  return out;
};
(async () => {
  for await (const line of readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity })) {
    if (!line.includes('hook_additional_context') || !line.includes(prefix)) continue;
    let o; try { o = JSON.parse(line); } catch { continue; }
    const isHook = o.type === 'hook_additional_context' || (o.attachment && /hook_additional_context/.test(JSON.stringify(o.attachment).slice(0, 200)));
    if (!isHook) continue;
    for (const t of texts(o)) { found.push({ ts: o.timestamp, t }); if (found.length > N) found.shift(); }
  }
  for (const f of found) {
    const t = f.t.slice(0, MAX).replace(/(↳ [^:\n]{1,12}:) [^\n]*/g, '$1 <text>').replace(/[A-Za-z]:[\\/]+Users[\\/]+[^\\/\s]+/g, '~');
    console.log(`--- ${f.ts}\n${t}`);
  }
})();
