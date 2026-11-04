const v = require('C:/Consonance/retrieval/remeasure1003/verify/B/claims.json'); const a = v.claims;
console.log('verifier', v.verifier);
const by = (f) => { const m = {}; for (const c of a) { const k = f(c); m[k] = (m[k] || 0) + 1; } return m; };
console.log('seats', by((c) => c.seat));
const msgs = by((c) => c.messageId); console.log('messages', Object.keys(msgs).length);
console.log('transcripts', Object.entries(by((c) => c.seat + ' ' + c.transcript.split(/[\\/]/).slice(-2).join('/'))));
const ts = a.map((c) => c.ts).sort(); console.log('ts range', ts[0], ts[ts.length - 1]);
const spans = [...new Set(a.map((c) => c.messageId + ' ' + (c.lines[0] - c.turnStartLine)))];
console.log('turn spans (lines)', spans.map((s) => +s.split(' ')[1]).sort((x, y) => x - y).join(','));
