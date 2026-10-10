// pick.js (pane B, chunk 3, D219): the seeded picks for READ 1 (gate abuse) and READ 2 (second-reader precision), and per pick an
// extract of the ring and of its TURN (the calls before it), keys/tokens scrubbed. Read-only on ledgers and transcripts.
//   node pick.js <outdir>
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
const SEED = '7ecf979c58f5fa18f09ce67c5dd092d793600e63';
const H = (s) => crypto.createHash('sha256').update(s).digest('hex');
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const G = require('C:/Users/nname/.claude/shell/hooks/sources-gate.js');   // the installed gate: its own turn reader and scrub
const scrub = (s) => { let t = String(s); try { t = G.scrub(t); } catch (_) {} return t.replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, (m) => m.slice(0, 8) + '…'); };
const RING = new Set(['mcp__consonance__call_librarian', 'mcp__consonance__call_chair', 'mcp__consonance__chair_inject']);
// sha → { text, transcript, line, ts }, from every project transcript except the Third Place's
const root = path.join(os.homedir(), '.claude', 'projects'), bySha = new Map();
for (const d of fs.readdirSync(root)) {
  if (/third-place/i.test(d)) continue;
  const dir = path.join(root, d); if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.jsonl'))) {
    const p = path.join(dir, f); const lines = fs.readFileSync(p, 'utf8').split('\n');
    lines.forEach((l, i) => { if (!l.includes('mcp__consonance__c')) return; let o; try { o = JSON.parse(l); } catch (_) { return; }
      const c = o.message && Array.isArray(o.message.content) ? o.message.content : [];
      for (const b of c) if (b.type === 'tool_use' && RING.has(b.name) && b.input && typeof b.input.text === 'string') bySha.set(H(b.input.text), { text: b.input.text, transcript: p, line: i + 1, ts: o.timestamp, tool: b.name }); });
  }
}
/** The turn before line `line` in transcript `p`: the calls since the last prompt (the gate's own isPrompt), each with input and result clipped. */
function turnOf(p, line) {
  const lines = fs.readFileSync(p, 'utf8').split('\n').slice(0, line - 1), ents = [];
  for (const l of lines.slice(-4000)) { try { ents.push(JSON.parse(l)); } catch (_) {} }
  let k = ents.length - 1; while (k >= 0 && !G.isPrompt(ents[k])) k--;
  const turn = ents.slice(k + 1), res = new Map(), calls = [];
  for (const e of turn) for (const b of (e.message && Array.isArray(e.message.content) ? e.message.content : [])) if (b.type === 'tool_result') res.set(b.tool_use_id, typeof b.content === 'string' ? b.content : (b.content || []).map((x) => x.text || '').join('\n'));
  for (const e of turn) for (const b of (e.message && Array.isArray(e.message.content) ? e.message.content : [])) if (b.type === 'tool_use') calls.push({ name: b.name, input: scrub(JSON.stringify(b.input)).slice(0, 400), result: scrub(res.get(b.id) || '(no result)').slice(0, 700) });
  const prompt = k >= 0 ? scrub(JSON.stringify(ents[k].message.content)).slice(0, 300) : '(none)';
  return { prompt, calls };
}
const order = (xs, key) => xs.map((x) => ({ x, k: H(SEED + '|' + key(x)) })).sort((a, b) => (a.k < b.k ? -1 : 1)).map((y) => y.x);
const firstLine = (t) => String(t).split('\n').find((l) => l.trim()) || '';
// READ 1
const gate = fs.readFileSync('C:/Consonance/data/sources-gate.jsonl', 'utf8').trim().split('\n').map(JSON.parse);
const elig = gate.filter((r) => r.decision === 'allow' && r.kind === 'matched').filter((r) => { const f = bySha.get(r.ringSha); return !(f && /probe/i.test(firstLine(f.text))); });
const r1 = order(elig, (r) => r.ringSha).slice(0, 20);
const R1 = r1.map((r, i) => { const f = bySha.get(r.ringSha); return { n: i + 1, ringSha: r.ringSha.slice(0, 12), ts: r.ts, tool: r.tool, items: (r.items || []).map(scrub), found: !!f, text: f ? scrub(f.text) : null, where: f ? path.basename(path.dirname(f.transcript)) + ':' + f.line : null, turn: f ? turnOf(f.transcript, f.line) : null }; });
// READ 2: flags in (row, index) order keyed by ringSha|index
const sr = fs.readFileSync('C:/Consonance/data/second-reader.jsonl', 'utf8').trim().split('\n').map(JSON.parse), flags = [];
for (const row of sr) (row.flags || []).forEach((fl, j) => flags.push({ row, j, fl }));
const r2 = order(flags, (f) => f.row.ringSha + '|' + f.j).slice(0, 30);
const R2 = r2.map((f, i) => { const m = bySha.get(f.row.ringSha); return { n: i + 1, ringSha: f.row.ringSha.slice(0, 12), idx: f.j, ts: f.row.ts, quote: scrub(f.fl.quote), names: scrub(f.fl.names), found: !!m, text: m ? scrub(m.text) : null, where: m ? path.basename(path.dirname(m.transcript)) + ':' + m.line : null, turn: m ? turnOf(m.transcript, m.line) : null }; });
fs.writeFileSync(path.join(out, 'read1.json'), JSON.stringify(R1, null, 1));
fs.writeFileSync(path.join(out, 'read2.json'), JSON.stringify(R2, null, 1));
console.log(JSON.stringify({ seed: SEED, ringsIndexed: bySha.size, r1Eligible: elig.length, r1: R1.length, r1NotFound: R1.filter((x) => !x.found).length, flags: flags.length, r2: R2.length, r2NotFound: R2.filter((x) => !x.found).length }));
