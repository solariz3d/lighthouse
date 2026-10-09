// D276 item 1+2, the REPLY SLOT (a Stop hook): every LIVE row that blocked, paired with the next row of the same session (the reply after the
// block). replySha = sha256(last_assistant_message) (reply-slot.js:221-223), so a transcript assistant text that hashes to it IS that reply.
// CONTENT = the reply minus its Sources: line(s). Read-only on every input.
'use strict';
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const rows = fs.readFileSync('C:\\Consonance\\data\\reply-slot.jsonl', 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const FILES = {
  '0c0c0c0a': ['C:\\Users\\nname\\.claude\\projects\\C--Consonance-instances-main\\0c0c0c0a-0000-4000-8000-000000000a01.jsonl', 'C:\\Users\\nname\\.claude\\projects\\C--Users-nname-claude-instances-main\\0c0c0c0a-0000-4000-8000-000000000a01.jsonl'],
  '0c0c0c0b': ['C:\\Users\\nname\\.claude\\projects\\C--Consonance-instances-librarian\\0c0c0c0b-0000-4000-8000-00000000115b.jsonl'],
};
const blocked = [];
rows.forEach((r, i) => {
  if (r.shadow || !r.wouldBlock) return;
  const next = rows.slice(i + 1).find((x) => x.session === r.session);
  blocked.push({ r, next });
});
const want = new Map(); for (const b of blocked) { want.set(b.r.replySha, null); if (b.next) want.set(b.next.replySha, null); }
async function scan(file) {
  if (!fs.existsSync(file)) return;
  const rl = readline.createInterface({ input: fs.createReadStream(file, { encoding: 'utf8' }), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.includes('"type":"assistant"')) continue;
    let o; try { o = JSON.parse(line); } catch (_) { continue; }
    const c = o && o.message && Array.isArray(o.message.content) ? o.message.content : [];
    const texts = c.filter((x) => x.type === 'text' && typeof x.text === 'string').map((x) => x.text);
    for (const t of [...texts, texts.join('\n'), texts.join('\n\n'), texts.join('')]) { const h = sha(t); if (want.has(h) && !want.get(h)) want.set(h, { text: t, ts: o.timestamp }); }
  }
}
const strip = (t) => t.split(/\r?\n/).filter((l) => !/^\s*\**\s*Sources\s*:/i.test(l)).map((l) => l.replace(/\s+$/, '')).join('\n').trim();
(async () => {
  for (const fs_ of Object.values(FILES)) for (const f of fs_) await scan(f);
  const out = blocked.map(({ r, next }) => {
    const a = want.get(r.replySha), b = next ? want.get(next.replySha) : null;
    const o = { ts: r.ts, seat: r.seat, kind: r.kind, unmatched: r.unmatched, nextKind: next && next.kind, gapS: next ? (Date.parse(next.ts) - Date.parse(r.ts)) / 1000 : null, found: !!a, foundNext: !!b };
    if (a && b) {
      o.contentSame = strip(a.text) === strip(b.text);
      if (!o.contentSame) { const al = new Set(strip(a.text).split('\n')), bl = new Set(strip(b.text).split('\n')); o.removed = [...al].filter((l) => !bl.has(l)); o.added = [...bl].filter((l) => !al.has(l)); o.lenA = a.text.length; o.lenB = b.text.length; }
    }
    return o;
  });
  fs.writeFileSync(path.join(__dirname, 'm1_reply_pairs.json'), JSON.stringify(out, null, 1));
  const s = { blocks: out.length, nextIsSkipActive: out.filter((o) => o.nextKind === 'skip-active').length, recovered: out.filter((o) => o.found && o.foundNext).length,
    contentSame: out.filter((o) => o.contentSame === true).length, contentChanged: out.filter((o) => o.contentSame === false).length, bySeat: {} };
  for (const o of out) s.bySeat[o.seat] = (s.bySeat[o.seat] || 0) + 1;
  const g = out.map((o) => o.gapS).filter((x) => x != null).sort((x, y) => x - y);
  s.gapMedianS = g[Math.floor((g.length - 1) / 2)]; s.gapP90S = g[Math.floor((g.length - 1) * 0.9)]; s.gapSumS = g.reduce((x, y) => x + y, 0);
  console.log(JSON.stringify(s, null, 1));
})();
