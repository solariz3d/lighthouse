// offctx.js <transcript> <ts-prefix> <phrase>: print 220 characters around <phrase> in the assistant text at <ts-prefix>. READ-ONLY.
'use strict';
const fs = require('fs');
const readline = require('readline');
const [f, ts, phrase] = process.argv.slice(2);
(async () => {
  const rl = readline.createInterface({ input: fs.createReadStream(f, 'utf8'), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.includes('"type":"assistant"') || !line.includes(ts)) continue;
    let j; try { j = JSON.parse(line); } catch (_) { continue; }
    if (!j.timestamp || !j.timestamp.startsWith(ts)) continue;
    for (const b of j.message.content || []) {
      if (b.type !== 'text') continue;
      const i = b.text.toLowerCase().indexOf(phrase.toLowerCase());
      if (i >= 0) console.log(j.timestamp + ' …' + b.text.slice(Math.max(0, i - 160), i + 60).replace(/\s+/g, ' ') + '…');
    }
  }
})();
