// offstream.js <since ISO> <transcript.jsonl>...: offramp-check's own OFFRAMP patterns, streamed line by line (the tool reads a whole
// file into one string and cannot open a transcript over 512 MB). Counts assistant text blocks since <since> that match; prints per file the
// assistant-turn count, the hits, and for each hit only the matched phrase (never the context) and its timestamp. READ-ONLY.
'use strict';
const fs = require('fs');
const readline = require('readline');
const { OFFRAMP } = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/offramp-check.js');
const [since, ...files] = process.argv.slice(2);
(async () => {
  for (const f of files) {
    let turns = 0; const hits = [];
    const rl = readline.createInterface({ input: fs.createReadStream(f, 'utf8'), crlfDelay: Infinity });
    for await (const line of rl) {
      if (!line.includes('"type":"assistant"')) continue;
      let j; try { j = JSON.parse(line); } catch (_) { continue; }
      if (j.type !== 'assistant' || !j.timestamp || j.timestamp < since) continue;
      const c = j.message && j.message.content; if (!Array.isArray(c)) continue;
      for (const b of c) {
        if (!b || b.type !== 'text' || typeof b.text !== 'string') continue;
        turns++;
        for (const re of OFFRAMP) { const m = re.exec(b.text); if (m) { hits.push(j.timestamp.slice(0, 16) + ' "' + m[0] + '"'); break; } }
      }
    }
    console.log(f.replace(/^.*projects[\\/]/, '') + ': text blocks ' + turns + ', offramp hits ' + hits.length);
    for (const h of hits) console.log('   ' + h);
  }
})().catch((e) => { console.error(e); process.exit(1); });
