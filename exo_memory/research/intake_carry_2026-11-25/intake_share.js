// intake_share.js: what share of each seat's token spend is the fixed per-request baseline
// (system prompt + tool definitions + CLAUDE.md), measured from <data_dir>/usage-ledger.jsonl.
// Read-only. Usage: node intake_share.js [bytesPerToken=2.9] [days=7]
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const HOME = os.homedir();
const cfg = JSON.parse(fs.readFileSync(path.join(HOME, '.consonance.json'), 'utf8').replace(/^\uFEFF/, ''));
const LEDGER = path.join(cfg.data_dir, 'usage-ledger.jsonl');
const LETTERS = JSON.parse(fs.readFileSync(path.join(cfg.data_dir, 'letters.json'), 'utf8'));
const PROJ = path.join(HOME, '.claude', 'projects');
const BPT = Number(process.argv[2] || 2.9);           // UTF-8 bytes per token, calibrated (see report)
const DAYS = Number(process.argv[3] || 7);
const GLOBAL_MD = path.join(HOME, '.claude', 'CLAUDE.md');
const gBytes = fs.statSync(GLOBAL_MD).size, gChars = fs.readFileSync(GLOBAL_MD, 'utf8').length;

// seat folder: the C--Consonance-instances-<seat> dir holding <sessionid>.jsonl
const fullId = {}; for (const id of Object.keys(LETTERS)) fullId[id.slice(0, 8)] = id;
const seatDirs = fs.readdirSync(PROJ).filter(d => d.startsWith('C--Consonance-instances-'));
function folderOf(sid8) {
  const id = fullId[sid8]; if (!id) return null;
  for (const d of seatDirs) if (fs.existsSync(path.join(PROJ, d, id + '.jsonl'))) return d.replace('C--Consonance-instances-', '');
  return null;
}

const rows = fs.readFileSync(LEDGER, 'utf8').trim().split('\n').map(l => JSON.parse(l));
const lastT = Date.parse(rows[rows.length - 1].t);
const cutoff = lastT - DAYS * 864e5;

// group per seat (session === seat; probe sessions under a seat env go to 'other')
const seats = {};
for (const r of rows) {
  const key = r.session === r.seat ? r.seat : 'other:' + r.seat;
  (seats[key] = seats[key] || []).push(r);
}

const med = a => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const W = { in: 1, create5m: 1.25, create1h: 2, read: 0.1, out: 5 };  // ASSUMED price multipliers vs base input

function analyse(rs, since) {
  // de-duplicate: the status line writes 2+ rows per API request (one mid-stream); keep the last per request
  const reqs = []; let prevKey = null;
  for (const r of rs) {
    if (r.kind !== 'turn') continue;
    const tot = (r.in || 0) + (r.cache_create || 0) + (r.cache_read || 0);
    if (!tot) continue;
    const k = r.session + ':' + tot + ':' + r.cache_read;
    if (k === prevKey) { reqs[reqs.length - 1] = { r, tot }; continue; }
    prevKey = k; reqs.push({ r, tot });
  }
  return reqs.filter(x => Date.parse(x.r.t) >= since);
}

const out = []; const agg = { win: {}, all: {} };
for (const [key, rs] of Object.entries(seats)) {
  const sid8 = key.startsWith('other:') ? null : key;
  const folder = sid8 ? folderOf(sid8) : '(probe sessions under ' + key.slice(6) + ')';
  const letter = sid8 ? LETTERS[fullId[sid8]] : '-';
  let mdBytes = 0, mdChars = 0;
  if (sid8 && folder) { const f = path.join('C:\\Consonance\\instances', folder, 'CLAUDE.md'); if (fs.existsSync(f)) { mdBytes = fs.statSync(f).size; mdChars = fs.readFileSync(f, 'utf8').length; } }
  const all = analyse(rs, 0);
  // P = system+tools prefix: cache_read on cold first requests (prefix hit, rest written)
  const cold = all.filter(x => x.r.cache_read > 0 && x.r.cache_read < 50000 && x.r.cache_create > 50000).map(x => x.r.cache_read);
  const P = med(cold);
  const C_cal = Math.round((mdBytes + gBytes) / BPT), C_c4 = Math.round((mdChars + gChars) / 4);
  const B = (P || 0) + C_cal;
  // upper bound: smallest total prompt on any request (post-compact / fresh)
  const minTot = Math.min(...all.map(x => x.tot));
  for (const [label, since] of [['all', 0], ['win', cutoff]]) {
    const q = analyse(rs, since);
    const s = { seat: key, letter, folder, model: (q[q.length-1]||{r:{}}).r.model, requests: q.length, rows: rs.filter(r => r.kind === 'turn' && Date.parse(r.t) >= since).length,
      read: 0, create: 0, in: 0, out: 0, bRead: 0, bWrite: 0, cRead: 0, cWrite: 0 };
    const reads = [];
    for (const { r, tot } of q) {
      s.read += r.cache_read; s.create += r.cache_create; s.in += r.in; s.out += r.out || 0; reads.push(r.cache_read);
      const bTot = Math.min(B, tot), bR = Math.min(B, r.cache_read);
      s.bRead += bR; s.bWrite += bTot - bR;
      // CLAUDE.md sits right after the P prefix
      const cR = Math.max(0, Math.min(B, r.cache_read) - P), cT = Math.max(0, Math.min(B, tot) - P);
      s.cRead += cR; s.cWrite += cT - cR;
    }
    s.minRead = Math.min(...reads); s.medRead = med(reads);
    s.P = P; s.coldN = cold.length; s.coldRange = cold.length ? Math.min(...cold) + '-' + Math.max(...cold) : '-';
    s.mdBytes = mdBytes; s.C_cal = C_cal; s.C_c4 = C_c4; s.B = B; s.minTot = minTot;
    s.naiveShare = s.read ? (B * s.requests) / s.read : null;
    s.readShare = s.read ? s.bRead / s.read : null;
    s.cShareRead = s.read ? s.cRead / s.read : null;
    const wt = (cw) => s.in * W.in + s.create * cw + s.read * W.read + s.out * W.out;
    const wb = (cw) => s.bRead * W.read + s.bWrite * cw;
    const wc = (cw) => s.cRead * W.read + s.cWrite * cw;
    s.wShare5m = wb(W.create5m) / wt(W.create5m); s.wShare1h = wb(W.create1h) / wt(W.create1h);
    s.wCShare5m = wc(W.create5m) / wt(W.create5m); s.wCShare1h = wc(W.create1h) / wt(W.create1h);
    s.rawAll = s.in + s.create + s.read + s.out; s.rawB = s.bRead + s.bWrite; s.rawC = s.cRead + s.cWrite;
    out.push({ label, ...s });
    const A = agg[label];
    for (const k of ['requests', 'read', 'create', 'in', 'out', 'bRead', 'bWrite', 'cRead', 'cWrite']) A[k] = (A[k] || 0) + s[k];
  }
}

const pct = x => x == null ? '-' : (100 * x).toFixed(1) + '%';
const k = x => x == null ? '-' : (x / 1000).toFixed(1) + 'k';
const M = x => (x / 1e6).toFixed(1) + 'M';
console.log(`ledger ${LEDGER}: ${rows.length} rows, ${rows[0].t} -> ${rows[rows.length - 1].t}; window = last ${DAYS}d from ${new Date(cutoff).toISOString()}`);
console.log(`global CLAUDE.md ${gBytes} B; bytes/token for CLAUDE.md = ${BPT}; weights (assumed, x base input): read ${W.read}, write ${W.create5m} (5m) / ${W.create1h} (1h), out ${W.out}\n`);
for (const label of ['all', 'win']) {
  console.log(`== ${label === 'all' ? 'WHOLE LEDGER' : 'LAST ' + DAYS + ' DAYS'} ==`);
  console.log(['seat', 'ltr', 'folder', 'req', 'rows', 'sumRead', 'sumWrite', 'minRead', 'medRead', 'P(sys+tools)', 'P range(n)', 'md B', 'C cal', 'C c/4', 'B=P+C', 'minTotPrompt', 'naive B*req/read', 'B share read', 'C share read', 'B wtd 5m/1h', 'C wtd 5m/1h'].join('\t'));
  for (const s of out.filter(o => o.label === label)) {
    console.log([s.seat, s.letter, s.folder, s.requests, s.rows, M(s.read), M(s.create), k(s.minRead), k(s.medRead), k(s.P), s.coldRange + '(' + s.coldN + ')', s.mdBytes, k(s.C_cal), k(s.C_c4), k(s.B), k(s.minTot), pct(s.naiveShare), pct(s.readShare), pct(s.cShareRead), pct(s.wShare5m) + '/' + pct(s.wShare1h), pct(s.wCShare5m) + '/' + pct(s.wCShare1h)].join('\t'));
  }
  const A = agg[label];
  const wt = cw => A.in + A.create * cw + A.read * W.read + A.out * W.out;
  console.log(`OVERALL: requests ${A.requests}, cache_read ${M(A.read)}, cache_write ${M(A.create)}, in ${A.in}, out ${M(A.out)}`);
  console.log(`  baseline share of cache_read ${pct(A.bRead / A.read)}; of cache_write ${pct(A.bWrite / A.create)}; of raw tokens (in+write+read+out) ${pct((A.bRead + A.bWrite) / (A.in + A.create + A.read + A.out))}`);
  console.log(`  CLAUDE.md share of cache_read ${pct(A.cRead / A.read)}; of cache_write ${pct(A.cWrite / A.create)}`);
  console.log(`  weighted (input-equivalent) baseline share: ${pct((A.bRead * W.read + A.bWrite * W.create5m) / wt(W.create5m))} (5m writes) / ${pct((A.bRead * W.read + A.bWrite * W.create1h) / wt(W.create1h))} (1h writes)`);
  console.log(`  weighted CLAUDE.md share: ${pct((A.cRead * W.read + A.cWrite * W.create5m) / wt(W.create5m))} (5m) / ${pct((A.cRead * W.read + A.cWrite * W.create1h) / wt(W.create1h))} (1h)`);
  console.log(`  weighted mix: read ${pct(A.read * W.read / wt(W.create5m))}, write ${pct(A.create * W.create5m / wt(W.create5m))}, out ${pct(A.out * W.out / wt(W.create5m))} (5m)\n`);
}
