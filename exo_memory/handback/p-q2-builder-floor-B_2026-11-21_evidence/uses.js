// B, Q2 (L223) R2: in how many builder laps of the last 7 days was each candidate called. A lap begins at a user row carrying
// "[chair:MAIN]" (pane A's census rule, RULE_R3); rows before a seat's first dispatch in the window are not in a lap.
// A use: an assistant tool_use whose name is the tool (Artifact, Monitor, SendMessage, Skill, Agent), or a ToolSearch that
// loads it. Builder folders: every projects dir whose name holds "sibling-".   node uses.js
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.join(os.homedir(), '.claude', 'projects');
const SINCE = Date.now() - 7 * 24 * 3600 * 1000;
const TOOLS = ['Artifact', 'Monitor', 'SendMessage', 'Skill', 'Agent'];
const out = {};
for (const d of fs.readdirSync(ROOT).filter((d) => d.includes('sibling-'))) {
  const dir = path.join(ROOT, d);
  let laps = 0; const used = Object.fromEntries(TOOLS.map((t) => [t, 0])); const calls = Object.fromEntries(TOOLS.map((t) => [t, 0]));
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.jsonl'))) {
    const p = path.join(dir, f);
    if (fs.statSync(p).mtimeMs < SINCE) continue;
    let inLap = false, seen = new Set();
    const close = () => { if (inLap) for (const t of seen) used[t]++; seen = new Set(); };
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      let v; try { v = JSON.parse(line); } catch { continue; }
      const t = Date.parse(v.timestamp || ''); if (!(t >= SINCE)) continue;
      const c = v.message && v.message.content;
      if (v.type === 'user' && !v.isSidechain) {
        const text = typeof c === 'string' ? c : Array.isArray(c) ? c.filter((b) => b.type === 'text').map((b) => b.text).join('') : '';
        if (text.includes('[chair:MAIN]')) { close(); inLap = true; laps++; }
      }
      if (v.type === 'assistant' && Array.isArray(c)) for (const b of c) {
        if (b.type !== 'tool_use') continue;
        let name = b.name;
        if (name === 'ToolSearch') { const q = String((b.input || {}).query || ''); for (const x of TOOLS) if (new RegExp('\\b' + x + '\\b').test(q)) { calls[x]++; if (inLap) seen.add(x); } continue; }
        if (TOOLS.includes(name)) { calls[name]++; if (inLap) seen.add(name); }
      }
    }
    close();
  }
  out[d.replace(/^.*sibling-/, 'sibling-')] = { laps, lapsUsing: used, callsAnywhere: calls };
}
console.log(JSON.stringify(out, null, 1));
const tot = { laps: 0 }; for (const t of TOOLS) tot[t] = 0;
for (const v of Object.values(out)) { tot.laps += v.laps; for (const t of TOOLS) tot[t] += v.lapsUsing[t]; }
console.log('TOTAL builder laps ' + tot.laps + ': ' + TOOLS.map((t) => t + ' ' + tot[t]).join(', '));
