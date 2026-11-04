// D301 step 4: in ONE turn of a transcript, did the seat open a path? B's §2 "opened": a file read of the path,
// a shell command naming it, or a search whose printed output included part of the file.
//   node turn.js <jsonl> <iso ts inside the turn> <pattern>[,<pattern>...]
// Prints the turn bounds, a count of tool calls by name, and ONLY the calls/results that match a pattern
// (case-insensitive substring). It never prints assistant prose.
const fs = require('fs');
const [file, ts, pats] = process.argv.slice(2);
const P = pats.split(',').map((s) => s.toLowerCase());
const rows = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
const isRealUser = (r) => r.type === 'user' && r.message && (typeof r.message.content === 'string' || (Array.isArray(r.message.content) && r.message.content.some((c) => c.type === 'text')));
const t = Date.parse(ts);
let start = -1, end = rows.length;
rows.forEach((r, i) => { if (isRealUser(r) && Date.parse(r.timestamp) <= t) start = i; });
for (let i = start + 1; i < rows.length; i++) if (isRealUser(rows[i])) { end = i; break; }
console.log(`turn ${rows[start] && rows[start].timestamp} .. ${rows[end - 1] && rows[end - 1].timestamp} (${end - start} rows)`);
const counts = {}; const hits = [];
for (const r of rows.slice(start, end)) {
  const cs = r.message && Array.isArray(r.message.content) ? r.message.content : [];
  for (const c of cs) {
    if (c.type === 'tool_use') {
      counts[c.name] = (counts[c.name] || 0) + 1;
      const s = JSON.stringify(c.input);
      if (P.some((p) => s.toLowerCase().includes(p))) hits.push(`USE ${r.timestamp} ${c.name} ${s.slice(0, 300)}`);
    }
    if (c.type === 'tool_result') {
      const s = typeof c.content === 'string' ? c.content : JSON.stringify(c.content);
      for (const p of P) { const k = s.toLowerCase().indexOf(p); if (k >= 0) hits.push(`RESULT ${r.timestamp} contains "${p}" (…${s.slice(Math.max(0, k - 80), k + 120).replace(/\s+/g, ' ')}…)`); }
    }
  }
}
console.log('tool calls: ' + JSON.stringify(counts));
console.log(hits.length ? hits.join('\n') : 'no tool call or result names the pattern(s)');
