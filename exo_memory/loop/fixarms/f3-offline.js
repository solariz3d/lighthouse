'use strict';
// fixarms/f3-offline.js (D311 part 3, pane E): F3's offline measure. For each unit of f3-rm-units.json (committed before any
// search ran), does the arm's top K contain the answer? No model is called. Writes out/f3-rm.json and out/f3-rm.md: paths,
// line ranges, ranks and scores only, never an excerpt or the query text.
//   node exo_memory/loop/fixarms/f3-offline.js [--projects <dir>]
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const arms = require('./arms.js');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'f3-rm-units.json'), 'utf8'));
const pi = process.argv.indexOf('--projects');
const opts = { repo: ROOT, projects: pi > 0 ? process.argv[pi + 1] : undefined };
const K = spec.rule.k, DEEP = 100;

function paragraphWith(reply, phrase) {
  for (const m of reply) {
    const i = m.text.indexOf(phrase); if (i < 0) continue;
    const s = m.text.lastIndexOf('\n\n', i), e = m.text.indexOf('\n\n', i);
    return m.text.slice(s < 0 ? 0 : s + 2, e < 0 ? m.text.length : e);
  }
  return null;
}
function answerHit(u, files, r) {
  if (!u.answer.paths.includes(r.path)) return false;
  const f = files.find((x) => x.path === r.path); if (!f) return false;
  const chunk = f.lines.slice(r.start - 1, r.end).join('\n');
  return u.answer.phrases.some((p) => chunk.includes(p));
}
function measure(u, files, query) {
  const deep = arms.search(files, query, DEEP);
  const rank = deep.findIndex((r) => answerHit(u, files, r));
  const topK = deep.slice(0, K);
  return {
    terms: [...new Set(arms.tokens(query).filter((t) => !arms.STOP.has(t)))].length,
    hitAtK: rank >= 0 && rank < K,
    firstAnswerRank: rank >= 0 ? rank + 1 : `>${DEEP}`,
    answerPathInTopK: topK.some((r) => u.answer.paths.includes(r.path)),
    topK: topK.map((r) => `${r.path}:${r.start}-${r.end} (${r.score})`),
  };
}

const rows = [];
for (const u of spec.units) {
  let unit = { id: u.id, seat: u.seat, transcript: u.transcript, turnStart: u.turnStart };
  let turn = arms.loadTurn(unit, opts);
  let claimInReply = turn.reply.some((m) => m.text.includes(u.claim));
  if (!claimInReply && u.transcript_alt) {
    const alt = { ...unit, transcript: u.transcript_alt }; const t2 = arms.loadTurn(alt, opts);
    if (t2.reply.some((m) => m.text.includes(u.claim))) { unit = alt; turn = t2; claimInReply = true; }
  }
  const f3 = arms.build('F3', unit, { ...opts, k: K });   // the arm itself, as A's bench will call it
  const files = arms.corpus(ROOT, f3.commit);
  const present = files.some((f) => u.answer.paths.includes(f.path) && u.answer.phrases.some((p) => f.lines.join('\n').includes(p)));
  const cWhen = execFileSync('git', ['-C', ROOT, 'show', '-s', '--format=%cI', f3.commit], { encoding: 'utf8' }).trim();
  const q1 = measure(u, files, f3.query);
  // the side-line check: the newest commit anywhere in main's history by the turn, where it differs from the first-parent one
  const anyC = execFileSync('git', ['-C', ROOT, 'rev-list', '-1', '--before=' + new Date(Math.floor(turn.T / 1000) * 1000).toISOString().replace('.000Z', 'Z'), 'HEAD'], { encoding: 'utf8' }).trim();
  const q1any = anyC === f3.commit ? null : { commit: anyC.slice(0, 8), ...measure(u, arms.corpus(ROOT, anyC), f3.query) };
  const para = paragraphWith(turn.reply, u.claim);
  const q2 = para ? measure(u, files, para) : null;
  // the arm's own result list must be Q1's top K
  const same = JSON.stringify(f3.results.map((r) => `${r.path}:${r.start}-${r.end} (${r.score})`)) === JSON.stringify(q1.topK);
  rows.push({ id: u.id, transcript: unit.transcript.split('/')[0], prompt_ts: new Date(turn.T).toISOString(), claimInReply, commit: f3.commit.slice(0, 8), committed: cWhen, c_bound: u.c_bound, answerInRecord: present, armMatchesQ1: same, q1, q1any, q2 });
  process.stderr.write(`${u.id} done\n`);
}
const hitsAny = rows.filter((r) => (r.q1any || r.q1).hitAtK).length;
const hits = rows.filter((r) => r.q1.hitAtK).length, hits2 = rows.filter((r) => r.q2 && r.q2.hitAtK).length;
const out = { _what: 'F3 offline measure on the 9 RM units (D311 part 3, pane E). Q1 is the arm; Q2 is secondary.', k: K, method: 'BM25 k1 1.2 b 0.75, 40-line chunks at stride 20, path words added, repo at the commit before the turn', hitsQ1: `${hits}/${rows.length}`, hitsQ1NewestAnywhere: `${hitsAny}/${rows.length}`, hitsQ2: `${hits2}/${rows.length}`, rows };
fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'out', 'f3-rm.json'), JSON.stringify(out, null, 2) + '\n');
const md = [`# F3 offline, the 9 RM units: top ${K} contains the answer?`, '', `Q1 (the arm, the turn's prompt): **${hits} of ${rows.length}**. Q2 (secondary, the reply paragraph holding the claim): **${hits2} of ${rows.length}**. Q1 on the newest commit anywhere in main's history (where it differs): **${hitsAny} of ${rows.length}**.`, '',
  '| unit | prompt (UTC) | claim in turn | commit (C\'s bound) | answer in record | Q1 hit@5 | Q1 first answer rank | Q1 answer file in top 5 | newest-anywhere commit: Q1 rank | Q2 hit@5 | Q2 rank |', '|---|---|---|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.id} | ${r.prompt_ts} | ${r.claimInReply ? 'yes' : 'NO'} | ${r.commit} (${r.c_bound}) | ${r.answerInRecord ? 'yes' : 'NO'} | ${r.q1.hitAtK ? 'yes' : 'no'} | ${r.q1.firstAnswerRank} | ${r.q1.answerPathInTopK ? 'yes' : 'no'} | ${r.q1any ? r.q1any.commit + ': ' + r.q1any.firstAnswerRank : 'same commit'} | ${r.q2 ? (r.q2.hitAtK ? 'yes' : 'no') : '—'} | ${r.q2 ? r.q2.firstAnswerRank : '—'} |`),
  '', '## Q1 top 5 per unit', ...rows.flatMap((r) => [`- **${r.id}** (${r.q1.terms} query terms; arm text matches: ${r.armMatchesQ1 ? 'yes' : 'NO'})`, ...r.q1.topK.map((t) => `  - ${t}`)])];
fs.writeFileSync(path.join(__dirname, 'out', 'f3-rm.md'), md.join('\n') + '\n');
console.log(md.slice(0, 15).join('\n'));
