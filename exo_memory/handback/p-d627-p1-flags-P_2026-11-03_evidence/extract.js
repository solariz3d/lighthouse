// extract.js: for each sampled row, find the ring message in the seat's transcript (tool_use of that tool nearest the row's ts, before it) and write rows/<line>.md
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const proj = 'C:/Users/nname/.claude/projects';
const S = fs.readFileSync('sample80.jsonl', 'utf8').split(/\n/).filter(Boolean).map(JSON.parse);
fs.mkdirSync('rows', { recursive: true });
const cache = {};
function uses(sess, seat) {
  if (cache[sess]) return cache[sess];
  const f = path.join(proj, 'C--Consonance-instances-' + seat, sess + '.jsonl'); const out = [];
  if (!fs.existsSync(f)) return (cache[sess] = out);
  const fd = fs.openSync(f, 'r'); const buf = Buffer.alloc(64 << 20); let rest = Buffer.alloc(0), n; const lines = [];
  while ((n = fs.readSync(fd, buf, 0, buf.length, null)) > 0) { const b = Buffer.concat([rest, buf.subarray(0, n)]); let i, s0 = 0;
    while ((i = b.indexOf(10, s0)) >= 0) { const seg = b.subarray(s0, i); if (seg.includes('call_librarian') || seg.includes('call_chair')) lines.push(seg.toString('utf8')); s0 = i + 1; }
    rest = Buffer.from(b.subarray(s0)); }
  fs.closeSync(fd); if (rest.length) lines.push(rest.toString('utf8'));
  for (const l of lines) { if (!l.includes('"tool_use"')) continue; let j; try { j = JSON.parse(l); } catch (_) { continue; }
    const c = j.message && j.message.content; if (!Array.isArray(c)) continue;
    for (const b of c) if (b.type === 'tool_use' && /call_librarian|call_chair/.test(b.name)) out.push({ ts: j.timestamp, name: b.name, msg: (b.input && (b.input.message || b.input.text || b.input.body)) || JSON.stringify(b.input) }); }
  return (cache[sess] = out);
}
let ok = 0, shaOk = 0;
for (const r of S) {
  const u = uses(r.session, r.seat).filter((x) => x.name === r.tool && x.ts <= r.ts).sort((a, b) => (a.ts < b.ts ? 1 : -1));
  let hit = u.find((x) => crypto.createHash('sha256').update(x.msg).digest('hex') === r.ringSha); if (hit) shaOk++;
  if (!hit) hit = u.find((x) => r.flags.every((f) => x.msg.includes(f.quote.replace(/…$/, '').slice(0, 60))));
  const body = [`# row ${r.line} · ${r.ts} · ${r.seat} · ${r.tool}`, '', '## flags (second reader)', ...r.flags.map((f, i) => `${i + 1}. QUOTE: ${f.quote}\n   NAMES: ${f.names}`), '', '## the message as sent' + (hit ? ` (transcript ts ${hit.ts})` : ' — NOT FOUND in transcript'), '', hit ? hit.msg : ''].join('\n');
  if (hit) ok++;
  fs.writeFileSync(`rows/${String(r.line).padStart(4, '0')}.md`, body);
}
console.log({ rows: S.length, found: ok, shaExact: shaOk });
