// repair.js (pane B, D276): re-pair each CHANGED deny with the most SIMILAR later call from the same seat and tool (within 15 min) that the gate ALLOWED.
'use strict';
const fs = require('fs'), path = require('path'), readline = require('readline');
const rows = require('./pairs.json');
const PROJ = 'C:/Users/nname/.claude/projects';
const SEATS = { '0c0c0c0b': 'C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b.jsonl', '0c0c0c0a': 'C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl' };
const gate = fs.readFileSync('C:/Consonance/data/sources-gate.jsonl', 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch (_) { return null; } }).filter((r) => r && r.ts >= '2026-10-08');
const strip = (t) => String(t || '').split('\n').filter((l) => !/^\s*(SOURCES|NEXT|OUTPUT)\s*:/i.test(l)).join('\n').replace(/\s+/g, ' ').trim();
const words = (t) => new Set(strip(t).toLowerCase().split(' '));
const jac = (a, b) => { const A = words(a), B = words(b); let i = 0; for (const w of A) if (B.has(w)) i++; return i / (A.size + B.size - i || 1); };
(async () => {
  const calls = {};
  for (const [s, f] of Object.entries(SEATS)) {
    calls[s] = [];
    const rl = readline.createInterface({ input: fs.createReadStream(path.join(PROJ, f)), crlfDelay: Infinity });
    for await (const line of rl) {
      if (line.indexOf('mcp__consonance__') < 0 || line.indexOf('"tool_use"') < 0) continue;
      let r; try { r = JSON.parse(line); } catch (_) { continue; }
      if (!r.timestamp || r.timestamp < '2026-10-08') continue;
      for (const c of (r.message && r.message.content) || []) if (c.type === 'tool_use' && /(call_chair|call_librarian|chair_inject)$/.test(c.name)) calls[s].push({ ts: r.timestamp, tool: c.name.replace('mcp__consonance__', ''), text: (c.input && (c.input.text || c.input.message)) || JSON.stringify(c.input) });
    }
  }
  const allowed = (seat, ts) => gate.some((g) => g.seat.startsWith(seat) && g.decision === 'allow' && Math.abs(Date.parse(g.ts) - Date.parse(ts)) < 3000);
  rows.forEach((r, i) => {
    if (!r.contentChanged || !calls[r.seat]) return;
    const t = Date.parse(r.ts);
    const cands = calls[r.seat].filter((c) => c.tool === r.tool && Date.parse(c.ts) > t + 1000 && Date.parse(c.ts) < t + 900000 && allowed(r.seat, c.ts));
    const best = cands.map((c) => ({ c, s: jac(r.refusedText, c.text) })).sort((a, b) => b.s - a.s)[0];
    if (!best) { console.log('#' + i, 'no candidate'); return; }
    const same = strip(r.refusedText) === strip(best.c.text);
    console.log('#' + i, r.ts, 'best sim', best.s.toFixed(2), 'at', best.c.ts, Math.round((Date.parse(best.c.ts) - t) / 1000) + 's', same ? 'SAME CONTENT' : 'CHANGED');
    if (!same) { const A = strip(r.refusedText).split(' '), B = strip(best.c.text).split(' '); let s = 0; while (s < A.length && s < B.length && A[s] === B[s]) s++; let ea = A.length, eb = B.length; while (ea > s && eb > s && A[ea - 1] === B[eb - 1]) { ea--; eb--; } console.log('   - ' + A.slice(s, ea).join(' ').slice(0, 400)); console.log('   + ' + B.slice(s, eb).join(' ').slice(0, 400)); }
  });
})();
