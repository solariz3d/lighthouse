// claim-check-adapter.js - D305 part 4 (seat C): the thin adapter between A's replay harness (consonance/tools/claim-replay.js) and the claim check's
// pure check(turn, opts) (consonance/hooks/claim-check.js, E's design §1). The librarian's ruling: E's §1 is the interface; flagged -> claim.
//
//   node consonance/tools/claim-replay.js run --lists <dir> --checker consonance/tools/claim-check-adapter.js            v1 plus the Bash write path (the build)
//   CLAIM_CHECK_VIAS=v1 node consonance/tools/claim-replay.js run --lists <dir> --checker consonance/tools/claim-check-adapter.js   v1 only (reply, ring, record write)
//
// A's turn is { claimTs, claimText, claimParts?, prompt?, calls[], results[] }; E's is { prompt, events[], outgoing }. Each claim PART is checked as one
// outgoing message from the place it was written (E §3.4), and the turn is refused if any part in scope is refused. A part written somewhere the check does
// not look (a Write outside exo_memory/, a Bash command that writes nothing into it, a board post) is out of scope, so a claim made only there is MISSED
// (B §2: reach is measured). With no claimParts (an older harness), the whole claimText is checked as a reply.
'use strict';
const path = require('path');
const C = require(path.join(__dirname, '..', 'hooks', 'claim-check.js'));

const VIA_SETS = { v1: C.V1_VIAS, all: C.ALL_VIAS };
const underRecord = (p) => /(^|[\\/])exo_memory[\\/]/.test(String(p || ''));

/** The place one of A's claim parts was written, in E's §3.4 terms; anything else is 'unseen'. */
function viaOfPart(p) {
  if (p.tool === 'text') return 'reply';
  if (/^mcp__consonance__(?:call_librarian|call_chair|chair_inject)$/.test(p.tool)) return 'ring';
  if (/^(?:Write|Edit|MultiEdit)$/.test(p.tool)) return underRecord(p.target) ? 'record-write' : 'unseen';
  if (p.tool === 'Bash') return C.bashWritesRecord(p.target) ? 'bash-write' : 'unseen';
  return 'unseen';
}
/** The text the live hook would see for a part: for a Bash write, what the command writes (heredocs, echoed strings), as the hook reads it. */
const partText = (p, via) => (via === 'bash-write' ? C.bashWrittenText(p.target) || p.text : p.text);

/** E's events from A's calls and results, in time order (a call before a result at the same instant). */
function eventsOf(turn) {
  const ev = [
    ...(turn.calls || []).map((c) => ({ ts: c.ts, kind: 'call', tool: c.name, input: c.input })),
    ...(turn.results || []).map((r) => ({ ts: r.ts, kind: 'result', tool: '', text: r.text, isError: !!r.error })),
  ];
  return ev.map((e, i) => ({ e, i })).sort((a, b) => (Date.parse(a.e.ts) - Date.parse(b.e.ts)) || (a.e.kind === b.e.kind ? a.i - b.i : a.e.kind === 'call' ? -1 : 1)).map((x) => x.e);
}

function checkTurn(turn, vias = VIA_SETS[process.env.CLAIM_CHECK_VIAS === 'v1' ? 'v1' : 'all']) {
  const parts = Array.isArray(turn.claimParts) && turn.claimParts.length ? turn.claimParts : [{ tool: 'text', target: null, text: turn.claimText || '' }];
  const events = eventsOf(turn);
  // the claim time is the start of the claim's second (A's note); every result strictly before it is evidence
  const ts = turn.claimTs;
  const flagged = [], seen = new Set();
  for (const p of parts) {
    const via = viaOfPart(p);
    if (via === 'unseen' || !vias.includes(via)) continue;
    const r = C.check({ prompt: turn.prompt || '', events, outgoing: { ts, via, text: partText(p, via) } }, { mode: 'strict', vias });
    for (const f of r.flagged) { const k = via + '|' + f.unit + '|' + f.token; if (!seen.has(k)) { seen.add(k); flagged.push({ via, ...f }); } }
  }
  if (!flagged.length) return { verdict: 'allow', reason: 'nothing unbacked in the places the check looks' };
  // every flag's place and token first (the harness clips the claim to 160 chars), then the first flagged sentence: what B needs to tell a catch from a refusal elsewhere
  return { verdict: 'refuse', claim: flagged.map((x) => `[${x.via}] ${x.token}`).join(' | ') + ` :: ${String(flagged[0].text).replace(/\s+/g, ' ')}`, reason: flagged.map((x) => `${x.via}:${x.kind}:${x.need}`).join(', '), flagged };
}

module.exports = { name: 'claim-check' + (process.env.CLAIM_CHECK_VIAS === 'v1' ? ' (v1 only)' : ' (v1 + Bash write path)'), check: (t) => checkTurn(t), checkTurn, viaOfPart, eventsOf, VIA_SETS };
