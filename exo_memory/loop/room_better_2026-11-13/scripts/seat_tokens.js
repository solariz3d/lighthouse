// One pass per seat over the newest transcript. Prints numbers only, never transcript text.
const fs = require('fs'), path = require('path'), readline = require('readline');
const ROOT = 'C:/Users/nname/.claude/projects';
const NOW = Date.now(), HRS = +(process.argv[3]||24), CUT = NOW - HRS * 3600 * 1000;
// price per MTok, from the claude-api skill (cached 2026-11-03): [input, cacheRead, output]
const PRICE = { 'claude-fable-5-2': [8, 0.20, 40], 'claude-opus-5-5': [4, 0.20, 20], 'claude-sonnet-5-5': [2, 0.10, 10],
  'claude-fable-5-1': [10, 0.25, 50], 'claude-opus-5': [5, 0.5, 25], 'claude-haiku-5-5': [0.10, 0.01, 0.5] };
const UNIT = 8; // weighted units = Fable 5.2 input-token equivalents
function price(m) { for (const k of Object.keys(PRICE)) if (m && m.startsWith(k)) return PRICE[k]; return null; }
const med = a => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const pct = (a, p) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };

async function seat(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).map(f => path.join(dir, f));
  if (!files.length) return null;
  files.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  const file = files[0];
  const msgs = new Map(), toolName = new Map(), results = [], compacts = [];
  let side = 0, unpriced = new Set();
  const rl = readline.createInterface({ input: fs.createReadStream(file, { highWaterMark: 1 << 22 }), crlfDelay: Infinity });
  for await (const line of rl) {
    const isA = line.includes('"type":"assistant"') && line.includes('"usage"');
    const isR = !isA && line.includes('"tool_result"') && line.includes('"type":"user"');
    const isC = !isA && !isR && line.includes('compact_boundary');
    if (!isA && !isR && !isC) continue;
    const tm = /"timestamp":"([^"]+)"/.exec(line); if (!tm) continue;
    const ts = Date.parse(tm[1]); if (!(ts >= CUT)) continue;
    let o; try { o = JSON.parse(line); } catch (e) { continue; }
    if (isC) { if (o.subtype === 'compact_boundary') compacts.push({ ts, pre: (o.compactMetadata || {}).preTokens || 0 }); continue; }
    if (isA) {
      const m = o.message || {}; if (!m.id || m.model === '<synthetic>') continue;
      if (o.isSidechain) side++;
      for (const b of (Array.isArray(m.content) ? m.content : [])) if (b.type === 'tool_use') toolName.set(b.id, b.name);
      const u = m.usage || {}, cc = u.cache_creation || {};
      const r = { ts, model: m.model, in: u.input_tokens || 0, cw: u.cache_creation_input_tokens || 0, cr: u.cache_read_input_tokens || 0,
        out: u.output_tokens || 0, w1h: cc.ephemeral_1h_input_tokens || 0 };
      const p = msgs.get(m.id);
      if (!p) msgs.set(m.id, r); else for (const k of ['in', 'cw', 'cr', 'out', 'w1h']) p[k] = Math.max(p[k], r[k]);
      continue;
    }
    const m = o.message || {};
    for (const b of (Array.isArray(m.content) ? m.content : [])) {
      if (b.type !== 'tool_result') continue;
      let chars = 0;
      if (typeof b.content === 'string') chars = b.content.length;
      else if (Array.isArray(b.content)) for (const c of b.content) chars += c.type === 'text' ? (c.text || '').length : (c.type === 'image' ? 6000 : 0);
      results.push({ ts, chars, id: b.tool_use_id });
    }
  }
  const calls = [...msgs.values()].sort((a, b) => a.ts - b.ts);
  const ctx = calls.map(c => c.in + c.cw + c.cr);
  const T = { in: 0, cw: 0, w1h: 0, cr: 0, out: 0 }; let W = { in: 0, w: 0, r: 0, o: 0 };
  const models = {};
  calls.forEach(c => {
    for (const k in T) T[k] += c[k]; models[c.model] = (models[c.model] || 0) + 1;
    const p = price(c.model); if (!p) { unpriced.add(c.model); return; }
    W.in += c.in * p[0] / UNIT; W.w += ((c.cw - c.w1h) * 1.25 + c.w1h * 2) * p[0] / UNIT; W.r += c.cr * p[1] / UNIT; W.o += c.out * p[2] / UNIT;
  });
  // cold rebuilds: a call that writes >= 50k to cache
  const cold = { n: 0, cw: 0, wunits: 0, afterCompact: 0, gap5: 0, gap60: 0, other: 0, gaps: [] };
  calls.forEach((c, i) => {
    if (c.cw < 50000) return;
    const p = price(c.model) || [0, 0, 0];
    cold.n++; cold.cw += c.cw; cold.wunits += ((c.cw - c.w1h) * 1.25 + c.w1h * 2) * p[0] / UNIT;
    const prev = i ? calls[i - 1].ts : null; const gap = prev ? (c.ts - prev) / 60000 : null;
    const comp = compacts.some(k => k.ts <= c.ts && (!prev || k.ts >= prev));
    if (comp) cold.afterCompact++; else if (gap !== null && gap >= 60) cold.gap60++; else if (gap !== null && gap >= 5) cold.gap5++; else cold.other++;
    if (gap !== null) cold.gaps.push(Math.round(gap));
  });
  // context above thresholds (cache-read units that a lower ceiling would not re-read)
  const above = th => calls.reduce((s, c) => { const p = price(c.model); const x = Math.max(0, c.in + c.cw + c.cr - th); return s + (p ? x * p[1] / UNIT : 0); }, 0);
  const aboveTok = th => calls.reduce((s, c) => s + Math.max(0, c.in + c.cw + c.cr - th), 0);
  // tool-result persistence: tokens (chars/3.7) x later calls before next compaction
  const byTool = {}; let persist = 0, persistBig = 0, resChars = 0, big = 0;
  const callTs = calls.map(c => c.ts);
  for (const r of results) {
    resChars += r.chars; const name = (toolName.get(r.id) || 'unknown').replace(/^mcp__[^_]+__/, 'mcp:');
    byTool[name] = byTool[name] || { n: 0, chars: 0, reread: 0 }; byTool[name].n++; byTool[name].chars += r.chars;
    const nextC = compacts.filter(k => k.ts > r.ts).map(k => k.ts)[0] || Infinity;
    let later = 0; for (const t of callTs) if (t > r.ts && t < nextC) later++;
    const rr = (r.chars / 3.7) * later; persist += rr; byTool[name].reread += rr;
    if (r.chars >= 20000) { big++; persistBig += rr; }
  }
  const tools = Object.entries(byTool).sort((a, b) => b[1].reread - a[1].reread).slice(0, 4)
    .map(([k, v]) => ({ tool: k, n: v.n, kchars: Math.round(v.chars / 1000), rereadM: +(v.reread / 1e6).toFixed(1) }));
  const span = calls.length ? (calls[calls.length - 1].ts - calls[0].ts) / 3600000 : 0;
  const gapsAll = calls.slice(1).map((c, i) => (c.ts - calls[i].ts) / 60000);
  const sub = await subagents(dir);
  return {
    sub, seat: path.basename(dir).replace('C--Consonance-instances-', ''), file: path.basename(file), bytes: fs.statSync(file).size,
    calls: calls.length, sidechain: side, spanH: +span.toFixed(1), models,
    first: calls[0] ? new Date(calls[0].ts).toISOString().slice(5, 16) : '-', last: calls.length ? new Date(calls[calls.length - 1].ts).toISOString().slice(5, 16) : '-',
    ctxMed: med(ctx), ctxP90: pct(ctx, 0.9), ctxMax: Math.max(0, ...ctx),
    tot: T, wunitsM: { in: +(W.in / 1e6).toFixed(2), write: +(W.w / 1e6).toFixed(2), read: +(W.r / 1e6).toFixed(2), out: +(W.o / 1e6).toFixed(2) },
    compactions: compacts.length, compactPreMed: med(compacts.map(k => k.pre)),
    cold: { n: cold.n, cwM: +(cold.cw / 1e6).toFixed(2), wunitsM: +(cold.wunits / 1e6).toFixed(2), afterCompact: cold.afterCompact, gap5to60: cold.gap5, gap60: cold.gap60, other: cold.other, gapMedMin: med(cold.gaps) },
    gapMedMin: +med(gapsAll).toFixed(2), gapsOver5: gapsAll.filter(g => g >= 5).length,
    above250k: { tokM: +(aboveTok(250000) / 1e6).toFixed(1), wunitsM: +(above(250000) / 1e6).toFixed(2) },
    above150k: { tokM: +(aboveTok(150000) / 1e6).toFixed(1), wunitsM: +(above(150000) / 1e6).toFixed(2) },
    results: { n: results.length, big20k: big, kchars: Math.round(resChars / 1000), rereadM: +(persist / 1e6).toFixed(1), rereadBigM: +(persistBig / 1e6).toFixed(1), tools },
    unpriced: [...unpriced],
  };
}
async function subagents(dir){const fl=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(p.includes('subagents')&&p.endsWith('.jsonl')&&fs.statSync(p).mtimeMs>=CUT)fl.push(p)}};walk(dir);
const ids=new Map();for(const f of fl){const rl=readline.createInterface({input:fs.createReadStream(f),crlfDelay:Infinity});for await(const l of rl){if(!l.includes('"usage"'))continue;let o;try{o=JSON.parse(l)}catch(e){continue}if(o.type!=='assistant')continue;const t=Date.parse(o.timestamp);if(!(t>=CUT))continue;const m=o.message||{};if(!m.id)continue;const u=m.usage||{};const r={in:u.input_tokens||0,cw:u.cache_creation_input_tokens||0,cr:u.cache_read_input_tokens||0,out:u.output_tokens||0};const p=ids.get(m.id);if(!p)ids.set(m.id,r);else for(const k in r)p[k]=Math.max(p[k],r[k])}}
const v=[...ids.values()];const T={in:0,cw:0,cr:0,out:0};v.forEach(c=>{for(const k in T)T[k]+=c[k]});const cx=v.map(c=>c.in+c.cw+c.cr);return{files:fl.length,calls:v.length,ctxMed:med(cx),ctxMax:Math.max(0,...cx),tot:T}}
(async () => {
  const dirs = fs.readdirSync(ROOT).filter(d => d.startsWith('C--Consonance-instances-')).map(d => path.join(ROOT, d));
  const out = [];
  for (const d of dirs) { const t0 = Date.now(); const r = await seat(d); if (r) { r.secs = Math.round((Date.now() - t0) / 1000); out.push(r); console.error(r.seat, r.calls, r.secs + 's'); } }
  fs.writeFileSync(process.argv[2], JSON.stringify({ now: new Date(NOW).toISOString(), cut: new Date(CUT).toISOString(), seats: out }, null, 1));
})();
