// P-RETURN-LEG-REPLAY (D077) — read-only replay of the L062 §3 predicate against every recorded refusal.
// Inputs: C:/Consonance/data/board.jsonl (refusals by the §1.2 discriminator; returns = call_librarian X -> LIB
// [Received]) and C:/Consonance/data/lap.jsonl (the baton ledger). Nothing is written.
//
// For each refusal at time t, the ledger is cut to rows with at <= t, then:
//   CONTROL  — does the gate's rule, reconstructed, REFUSE it? Two rules, because the rule changed on 09-06 (L040):
//              NEW = lap_holders::open_holders + station_allows (ANY open lap held by the required station)
//              OLD = the newest open lap's holder alone (chain_state_from's first row)
//              A refusal neither rule reproduces means the reconstruction is wrong, and the predicate's verdict on it
//              is not evidence.
//   P_LAP    — §3 as WRITTEN: admit call_librarian if any open lap has a `dispatched` row with `to` whose cells are
//              not all matched by a [Received] return from those mounts after that dispatch.
//   P_MOUNT  — §3's own stated REASON ("a seat with no outstanding dispatch has no return leg to make"): admit only
//              if the CALLING mount is one of the outstanding cells.
//   BLIND    — the mutant: P_LAP applied to any verb (the chair_inject bar is only meaningful against this).
const fs = require('fs');
const DATA = process.env.DATA || 'C:/Consonance/data';
const REQ = { chair_inject: 'chair', call_librarian: 'panes', call_chair: 'librarian' };   // call_chair: pre-09-06 row
const REQ_HEAD = { chair_inject: 'chair', call_librarian: 'panes' };                       // mcp.rs:665 at aaf0aba

const lap = fs.readFileSync(DATA + '/lap.jsonl', 'utf8').split(/\r?\n/).filter(Boolean).map((l, i) => {
  try { const r = JSON.parse(l); r._line = i + 1; return r; } catch (e) { return null; } }).filter(Boolean);
const chain = lap.filter((r) => r.stage === 'chain' && r.lap);

const seen = new Set(); const refusals = []; const returns = []; const injects = [];
// pane ids are stable over the whole window (checked: each id's first/last inject row spans 07-28/08-15 -> 09-19)
const PANE = { '6fe15f0a': 'A', '12fb81f6': 'B', '0845a868': 'C', 'a2122153': 'E' };
for (const l of fs.readFileSync(DATA + '/board.jsonl', 'utf8').split(/\r?\n/)) {
  if (!l.includes('REFUSED OUT OF TURN') && !l.includes('-> LIB [Received]') && !l.includes('chair injected') && !l.includes('DELIVERED ->')) continue;
  let r; try { r = JSON.parse(l); } catch (e) { continue; }
  if (r.pane !== 'chair') continue;
  const k = r.ts + '|' + r.text; if (seen.has(k)) continue; seen.add(k);
  let m = /^(\S+) REFUSED OUT OF TURN — mount (\S+)/.exec(r.text);
  if (m) { refusals.push({ ts: r.ts, verb: m[1], mount: m[2], text: r.text }); continue; }
  m = /^call_librarian (\S+) -> LIB \[Received\]/.exec(r.text);
  if (m) { returns.push({ ts: r.ts, mount: m[1] }); continue; }
  m = /^(?:chair injected \(chair: [^)]*\)|DELIVERED) -> ([0-9a-f]{8})/.exec(r.text);
  if (m && PANE[m[1]]) injects.push({ ts: r.ts, mount: PANE[m[1]], text: r.text.slice(0, 90) });
}
refusals.sort((a, b) => a.ts - b.ts);

function openLaps(rows) {                        // lap_holders::open_holders, same order: newest per lap, then drop filed
  const newest = new Map();
  for (const r of rows) { const p = newest.get(r.lap); if (!p || (r.at || 0) >= (p.at || 0)) newest.set(r.lap, r); }
  return [...newest.values()].filter((r) => r.chain !== 'filed');
}
function outstanding(t, open) {                   // per open lap, per dispatch-with-to: cells not yet returned by t
  const out = [];
  for (const o of open) {
    // ANY_TO=1: read to[] from any chain row (L050 recorded its dispatch as chain:"working" with to[B,C,E])
    const isDispatch = (r) => (process.env.ANY_TO ? Array.isArray(r.to) : r.chain === 'dispatched');
    for (const d of chain.filter((r) => r.lap === o.lap && isDispatch(r) && (r.at || 0) <= t)) {
      if (!Array.isArray(d.to)) { out.push({ lap: o.lap, line: d._line, at: d.at, to: null, left: null }); continue; }
      const back = new Set(returns.filter((x) => x.ts > d.at && x.ts <= t).map((x) => x.mount));
      out.push({ lap: o.lap, line: d._line, at: d.at, to: d.to, left: d.to.filter((c) => !back.has(c)) });
    }
  }
  return out;
}
const iso = (t) => new Date(t).toISOString().slice(5, 16).replace('T', ' ');
const res = [];
for (const f of refusals) {
  const rows = chain.filter((r) => (r.at || 0) <= f.ts);
  const open = openLaps(rows);
  const holders = [...new Set(open.map((r) => r.holder).filter(Boolean))];
  const newestOpen = open.slice().sort((a, b) => (b.at || 0) - (a.at || 0))[0];
  const req = REQ[f.verb];
  const newRule = open.length === 0 || holders.includes(req);
  const oldRule = open.length === 0 || (newestOpen && newestOpen.holder === req);
  const outs = outstanding(f.ts, open);
  const lapQual = outs.some((o) => o.left && o.left.length > 0);
  const mountQual = outs.some((o) => o.left && o.left.includes(f.mount));
  const pLap = f.verb === 'call_librarian' && lapQual;
  const pMount = f.verb === 'call_librarian' && mountQual;
  // P_INJ — the corrected candidate: the calling mount was SENT something (a delivered chair_inject) after its own
  // last delivered return. Reads the board, not lap.jsonl's to[], because to[] misses dispatches (see run1).
  const lastRet = Math.max(0, ...returns.filter((x) => x.mount === f.mount && x.ts < f.ts).map((x) => x.ts));
  const lastInj = Math.max(0, ...injects.filter((x) => x.mount === f.mount && x.ts < f.ts).map((x) => x.ts));
  const pInj = f.verb === 'call_librarian' && lastInj > lastRet;
  const headExempt = !(f.verb in REQ_HEAD);                   // call_chair: no row at HEAD, admitted with no predicate
  res.push({ f, open, holders, newestOpen, newRule, oldRule, outs, lapQual, mountQual, pLap, pMount, pInj, lastRet, lastInj, headExempt });
}

const J = process.argv.includes('--json');
if (J) { console.log(JSON.stringify(res, null, 1)); process.exit(0); }
console.log(`INJECTS   ${injects.length} delivered chair_inject / DELIVERED rows to the four panes`);
console.log(`UNIVERSE  ${DATA}/board.jsonl: ${refusals.length} system-written refusals (pane=="chair" && /REFUSED OUT OF TURN — mount/), ${returns.length} call_librarian [Received] returns`);
console.log(`          ${DATA}/lap.jsonl: ${lap.length} rows, ${chain.length} chain rows, ${chain.filter((r) => r.chain === 'dispatched').length} dispatched (${chain.filter((r) => r.chain === 'dispatched' && Array.isArray(r.to)).length} carry to[])\n`);
for (const x of res) {
  const { f } = x;
  const ctl = x.newRule && x.oldRule ? 'NOT REPRODUCED' : !x.newRule && !x.oldRule ? 'both' : !x.newRule ? 'NEW only' : 'OLD only';
  const verdict = x.headExempt ? 'n/a (exempt at HEAD)' : f.verb !== 'call_librarian' ? 'refused (verb not covered)' : `P_LAP ${x.pLap ? 'ADMIT' : 'refuse'} · P_MOUNT ${x.pMount ? 'ADMIT' : 'refuse'} · P_INJ ${x.pInj ? 'ADMIT' : 'refuse'} (last inject ${x.lastInj ? iso(x.lastInj) : '-'}, last return ${x.lastRet ? iso(x.lastRet) : '-'})`;
  console.log(`${iso(f.ts)}  ${f.verb.padEnd(14)} ${f.mount}  control:${ctl.padEnd(14)} open ${x.open.map((o) => o.lap + '/' + o.holder).join(',') || '-'}  | ${verdict}  | BLIND ${x.lapQual ? 'would ADMIT' : 'refuse'}`);
  for (const o of x.outs) console.log(`      dispatched ${o.lap} lap.jsonl:${o.line} ${iso(o.at)} to=${o.to ? JSON.stringify(o.to) : '(none)'} outstanding=${o.left ? JSON.stringify(o.left) : '(uncomputable)'}`);
}
const T = (p) => res.filter(p).length;
console.log('\nTALLY');
console.log(`  control reproduced (either rule)            ${T((x) => !(x.newRule && x.oldRule))} / ${res.length}`);
for (const v of ['chair_inject', 'call_librarian', 'call_chair']) {
  const s = res.filter((x) => x.f.verb === v);
  console.log(`  ${v.padEnd(15)} n=${s.length}  P_LAP admits ${s.filter((x) => x.pLap).length}  P_MOUNT admits ${s.filter((x) => x.pMount).length}  P_INJ admits ${s.filter((x) => x.pInj).length}  BLIND mutant admits ${s.filter((x) => x.lapQual).length}  exempt at HEAD ${s.filter((x) => x.headExempt).length}`);
}
