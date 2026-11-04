// anscheck.js (pane E, D305 item 6): for each located unit, did any TOOL RESULT before the claim already print the answer?
//   node anscheck.js <projects dir> <units.json>    units.json = [{ id, transcript, turn_start, claim_ts, answer: [tokens] }]
// Prints per unit: the number of tool calls before the claim, and for each answer token whether a result before the claim
// contained it (normalised: ANSI codes and thousands separators removed). Never prints transcript text. CR needs a yes;
// CN is a no. A unit with no crisp answer token (answer: []) is decided by the reader and only its call count is printed.
'use strict';
const fs = require('fs'), path = require('path'), readline = require('readline');
const [dir, file] = process.argv.slice(2);
const units = JSON.parse(fs.readFileSync(file, 'utf8'));
const norm = (s) => String(s).replace(/\x1b\[[0-9;]*m/g, '').replace(/(\d),(\d{3})/g, '$1$2');
const tsOf = (l) => { const m = /"timestamp":"([^"]+)"/.exec(l); return m ? Date.parse(m[1]) : NaN; };
(async () => {
  for (const u of units) {
    if (/third/i.test(u.transcript)) { console.log(`${u.id}\trefused (Third Place)`); continue; }
    const t0 = Date.parse(u.turn_start), t1 = Date.parse(u.claim_ts);
    let calls = 0; const seen = new Set();
    const rl = readline.createInterface({ input: fs.createReadStream(path.join(dir, u.transcript)), crlfDelay: Infinity });
    for await (const line of rl) {
      const t = tsOf(line);
      if (!(t >= t0 && t < t1)) continue;
      let o; try { o = JSON.parse(line); } catch { continue; }
      const c = o.message && o.message.content;
      if (!Array.isArray(c)) continue;
      for (const b of c) {
        if (b.type === 'tool_use') calls++;
        if (b.type === 'tool_result') {
          const r = norm(Array.isArray(b.content) ? b.content.map((x) => x.text || '').join(' ') : b.content);
          for (const a of u.answer) if (r.includes(norm(a))) seen.add(a);
        }
      }
    }
    console.log(`${u.id}\tcalls-before-claim ${calls}\t${u.answer.map((a) => `[${a}] ${seen.has(a) ? 'PRINTED' : 'not printed'}`).join('  ') || '(no answer token)'}`);
  }
})();
