// One seat's context per call, from its session transcript. Prints numbers only, never transcript text.
// The instrument for the window trial in loop/plan_lean_room_2026-11-14.md ("THIS SEAT").
// Usage: node exo_memory/loop/seat_context_2026-11-14.js [--seat librarian] [--since 2026-11-14T07:19:00Z] [--file <transcript.jsonl>]
// A cut is a compact_boundary row of the transcript; its trigger (auto or manual) and the tokens before it are printed.
const fs = require('fs'), path = require('path'), os = require('os'), readline = require('readline');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const seat = arg('--seat', 'librarian');
const since = Date.parse(arg('--since', '1970-01-01T00:00:00Z'));
let file = arg('--file', '');
if (!file) {
  const dir = path.join(os.homedir(), '.claude', 'projects', 'C--Consonance-instances-' + seat);
  const all = fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).map(f => path.join(dir, f));
  if (!all.length) { console.log('no transcript in ' + dir); process.exit(1); }
  file = all.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
}
const seen = new Set(), ctx = [], cuts = [];
readline.createInterface({ input: fs.createReadStream(file) }).on('line', line => {
  if (line.indexOf('"subtype":"compact_boundary"') >= 0) {
    let b; try { b = JSON.parse(line); } catch (e) { return; }
    const c = b.compactMetadata;
    if (c && Date.parse(b.timestamp) >= since) cuts.push(b.timestamp.slice(0, 16) + 'Z ' + c.trigger + ' at ' + c.preTokens);
    return;
  }
  if (line.indexOf('"usage"') < 0) return;
  let j; try { j = JSON.parse(line); } catch (e) { return; }
  const m = j.message, u = m && m.usage;
  if (!u || j.type !== 'assistant' || j.isSidechain) return;
  if (Date.parse(j.timestamp) < since || seen.has(m.id)) return;
  seen.add(m.id);
  ctx.push((u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0));
}).on('close', () => {
  if (!ctx.length) { console.log('0 calls since ' + new Date(since).toISOString()); return; }
  const s = [...ctx].sort((a, b) => a - b);
  console.log('seat ' + seat + ' | calls ' + ctx.length + ' | first ' + ctx[0] + ' | median ' + s[Math.floor(s.length / 2)] +
    ' | largest ' + s[s.length - 1] + ' | last ' + ctx[ctx.length - 1] + ' | cuts ' + cuts.length +
    (cuts.length ? ' (' + cuts.join('; ') + ')' : ''));
});
