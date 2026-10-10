// turns.js (pane C, D201 verifier): dump each of C's claims with its TURN (R19 §3: the prompt, the tool calls and results before
// the claim, and the message itself), with the watch's LABEL_RE MASKED before anything is printed, so the verifier stays blind to
// the self-label (watch §2.3). LABEL_RE = /\b(checked|inferred):/ (watch A1), applied case-sensitively, as pinned.
//   node turns.js <from> <to>     claims [from, to) of C's list, in packet order, to stdout
'use strict';
const fs = require('fs'), path = require('path');
const PKT = 'C:/Users/nname/Desktop/lighthouse/exo_memory/loop/label_watch_packet_2026-10-01.json';
const PROJ = 'C:/Users/nname/.claude/projects';
const LABEL_RE = /\b(checked|inferred):/g;
const mask = (s) => String(s).replace(LABEL_RE, '[·]');
const cut = (s, n) => { s = mask(s); return s.length > n ? s.slice(0, n) + ` …[+${s.length - n}]` : s; };
const mine = require(PKT).claims.filter((c) => (c.assign || []).includes('C'));
const [from, to] = [Number(process.argv[2] || 0), Number(process.argv[3] || mine.length)];
const cache = new Map();
const linesOf = (t) => { if (!cache.has(t)) cache.set(t, fs.readFileSync(path.join(PROJ, t), 'utf8').split('\n')); return cache.get(t); };
for (let i = from; i < Math.min(to, mine.length); i++) {
  const c = mine[i], L = linesOf(c.transcript);
  console.log(`\n================ #${i} ${c.claimId} · seat ${c.seat} · ${c.ts} · shared ${c.assign.length > 1}`);
  console.log(`CLAIM: ${mask(c.statement)}`);
  // rows are 1-based line numbers in the transcript
  for (let n = c.turnStart; n < c.nextPrompt; n++) {
    let o; try { o = JSON.parse(L[n - 1]); } catch { continue; }
    const m = o.message; if (!m) continue;
    const isClaimRow = c.rowLines.includes(n);
    const content = typeof m.content === 'string' ? [{ type: 'text', text: m.content }] : (m.content || []);
    for (const b of content) {
      if (b.type === 'text' && o.type === 'user' && n === c.turnStart) console.log(`  [${n}] PROMPT: ${cut(b.text, 400)}`);
      else if (b.type === 'text' && o.type === 'assistant') console.log(`  [${n}]${isClaimRow ? ' *MSG*' : ''} TEXT: ${cut(b.text, isClaimRow ? 4000 : 600)}`);
      else if (b.type === 'tool_use') console.log(`  [${n}] CALL ${b.name}: ${cut(JSON.stringify(b.input), 300)}`);
      else if (b.type === 'tool_result') { const t = Array.isArray(b.content) ? b.content.map((x) => x.text || '').join(' ') : b.content; console.log(`  [${n}] RESULT: ${cut(t, 700)}`); }
    }
  }
}
