// D276 item 1+2, the NEXT-TRAILER gate (in the app, after the hooks): its own board rows (pane === 'trailer-gate'). A refusal row is paired with
// the sender's tool_use of that tool (chair_inject: the chair's transcript; call_chair: the librarian's) whose timestamp is the last one at or before
// the refusal (within 30 s), and the re-send is the NEXT tool_use of the same tool (and, for chair_inject, the same target). CONTENT = text minus its
// SOURCES/NEXT/OUTPUT lines. Read-only on every input.
'use strict';
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const FILES = {
  chair_inject: ['C:\\Users\\nname\\.claude\\projects\\C--Consonance-instances-main\\0c0c0c0a-0000-4000-8000-000000000a01.jsonl', 'C:\\Users\\nname\\.claude\\projects\\C--Users-nname-claude-instances-main\\0c0c0c0a-0000-4000-8000-000000000a01.jsonl'],
  call_chair: ['C:\\Users\\nname\\.claude\\projects\\C--Consonance-instances-librarian\\0c0c0c0b-0000-4000-8000-00000000115b.jsonl'],
};
const strip = (t) => t.split(/\r?\n/).filter((l) => !/^\s*(SOURCES|Sources)\s*:/.test(l) && !/^\s*NEXT\s*:/.test(l) && !/^\s*OUTPUT\s*(→|->)/.test(l)).map((l) => l.replace(/\s+$/, '')).join('\n').trim();
async function uses(tool) {
  const out = [];
  for (const f of FILES[tool]) {
    if (!fs.existsSync(f)) continue;
    const rl = readline.createInterface({ input: fs.createReadStream(f, { encoding: 'utf8' }), crlfDelay: Infinity });
    for await (const line of rl) {
      if (!line.includes('"name":"mcp__consonance__' + tool + '"')) continue;
      let o; try { o = JSON.parse(line); } catch (_) { continue; }
      for (const c of (o.message && o.message.content) || []) if (c.type === 'tool_use' && c.name === 'mcp__consonance__' + tool && c.input) out.push({ ts: Date.parse(o.timestamp), text: c.input.text || c.input.message || '', target: c.input.target || c.input.pane || null });
    }
  }
  return out.sort((a, b) => a.ts - b.ts);
}
(async () => {
  const refusals = [];
  const rl = readline.createInterface({ input: fs.createReadStream('C:\\Consonance\\data\\board.jsonl', { encoding: 'utf8' }), crlfDelay: Infinity });
  let warned = 0;
  for await (const l of rl) {
    if (!l.includes('"trailer-gate"')) continue;
    let o; try { o = JSON.parse(l); } catch (_) { continue; }
    if (o.pane !== 'trailer-gate') continue;
    const t = String(o.text || '');
    if (/DELIVERED WITHOUT/.test(t)) { warned++; continue; }
    const m = t.match(/^(chair_inject|call_chair)\b.*REFUSED/);
    if (m) refusals.push({ ts: o.ts, tool: m[1], text: t });
  }
  const U = { chair_inject: await uses('chair_inject'), call_chair: await uses('call_chair') };
  const out = refusals.map((r) => {
    const list = U[r.tool];
    let i = -1; for (let k = 0; k < list.length; k++) { if (list[k].ts <= r.ts + 2000) i = k; else break; }
    const sent = i >= 0 && r.ts - list[i].ts < 30000 ? list[i] : null;
    const re = sent ? list.slice(i + 1).find((x) => (x.target || null) === (sent.target || null)) : null;
    const o = { ts: new Date(r.ts).toISOString(), tool: r.tool, why: r.text.replace(/^.*REFUSED BY THE NEXT-TRAILER GATE:\s*/, '').slice(0, 90), found: !!sent, foundRe: !!re, gapS: re ? (re.ts - r.ts) / 1000 : null };
    if (sent && re) { o.contentSame = strip(sent.text) === strip(re.text); if (!o.contentSame) { const a = new Set(strip(sent.text).split('\n')), b = new Set(strip(re.text).split('\n')); o.removed = [...a].filter((x) => !b.has(x)); o.added = [...b].filter((x) => !a.has(x)); } }
    return o;
  });
  fs.writeFileSync(path.join(__dirname, 'm1_trailer_pairs.json'), JSON.stringify(out, null, 1));
  const g = out.map((o) => o.gapS).filter((x) => x != null).sort((a, b) => a - b);
  const by = {}; for (const o of out) { const b = (by[o.tool] = by[o.tool] || { refused: 0, recovered: 0, contentSame: 0, contentChanged: 0 }); b.refused++; if (o.found && o.foundRe) { b.recovered++; if (o.contentSame) b.contentSame++; else b.contentChanged++; } }
  console.log(JSON.stringify({ warnedDeliveredCallLibrarian: warned, by, first: out[0] && out[0].ts, last: out.length && out[out.length - 1].ts, gapMedianS: g[Math.floor((g.length - 1) / 2)], gapP90S: g[Math.floor((g.length - 1) * 0.9)], gapSumS: g.reduce((a, b) => a + b, 0) }, null, 1));
})();
