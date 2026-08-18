// How often do the summaries even mention prediction/falsifier vocabulary?
// Bounds the paraphrase-blindness of the FLAG metric: a summary that paraphrases many
// registered predictions would still use the vocabulary.
'use strict';
const fs = require('fs');
const readline = require('readline');
const FILE = 'C:/Users/zackn/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl';

function rowTexts(obj) {
  const msg = obj.message; if (!msg) return [];
  const c = msg.content;
  if (typeof c === 'string') return [c];
  if (Array.isArray(c)) return c.filter(b => b && b.type === 'text' && typeof b.text === 'string').map(b => b.text);
  return [];
}
async function main() {
  const rl = readline.createInterface({ input: fs.createReadStream(FILE), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.trim()) continue;
    let obj; try { obj = JSON.parse(line); } catch (e) { continue; }
    if (obj.type !== 'user') continue;
    const t = rowTexts(obj).join('\n');
    if (!t.trimStart().startsWith('This session is being continued')) continue;
    const low = t.toLowerCase();
    const count = (re) => (low.match(re) || []).length;
    console.log(obj.timestamp,
      'falsifier:', count(/falsifier/g),
      'preregist:', count(/pre-?regist/g),
      'predict*:', count(/predict/g),
      'registered:', count(/registered/g));
  }
}
main().catch(e => { console.error(e); process.exit(1); });
