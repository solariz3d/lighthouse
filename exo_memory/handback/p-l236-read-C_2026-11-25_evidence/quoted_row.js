// Row Q (pane C, L235 re-read of 3ac00138): a path read by the shell in quotes, before the cut and again after it, is a re-read.
// And the measure: across the builder transcripts, how many reading tokens are a quoted path with an extension (counted before the fix by
// the separator alone, dropped after it because the raw token ends in a quote).
const path = require('path'), fs = require('fs');
const R = require(path.join(process.argv[2], 'consonance/tools/usage-ledger.js'));
const J = JSON.stringify;
const asst = (t, command) => J({ type: 'assistant', timestamp: t, message: { id: 'm' + t, content: [{ type: 'tool_use', name: 'Bash', input: { command } }] } });
for (const cmd of ['cat "C:/Consonance/lighthouse/a.md"', "sed -n 1,20p 'C:/Consonance/lighthouse/b.js'", 'head -5 C:/Consonance/lighthouse/c.md']) {
  const lines = [asst('1', cmd), J({ type: 'system', subtype: 'compact_boundary', timestamp: '2' }), J({ type: 'user', timestamp: '3', message: { content: '[chair:MAIN] L232 x' } }), asst('4', cmd)];
  console.log('Q', JSON.stringify(cmd).padEnd(52), '-> re-read', JSON.stringify(R.rereadsAfterCuts(lines)[0].reread));
}
const VERB = /(?:^|[\s;&|(])(?:cat|head|tail|sed|grep|rg|type|less|more|get-content|gc)\b([^;&|\n]*)/gi;
const SEP = /[\/\\]/;
let quoted = 0, counted = 0;
for (const f of process.argv.slice(3)) for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
  let v; try { v = JSON.parse(l); } catch { continue; }
  if (v.type !== 'assistant' || !Array.isArray(v.message && v.message.content)) continue;
  for (const b of v.message.content) {
    if (b.type !== 'tool_use' || (b.name !== 'Bash' && b.name !== 'PowerShell')) continue;
    for (const m of String(b.input.command || '').matchAll(VERB)) for (const tok of m[1].split(/\s+/)) {
      if (!tok || tok.startsWith('-') || /[*?[\]$]/.test(tok)) continue;
      const sep = SEP.test(tok);
      const extRaw = /\.[a-z0-9]{1,5}$/i.test(tok);
      const extUnq = /\.[a-z0-9]{1,5}$/i.test(tok.replace(/["'`,)]+$/, ''));
      if (sep && extRaw) counted++;
      else if (sep && extUnq && /^["'`]/.test(tok)) quoted++;
    }
  }
}
console.log('builder transcripts: shell path tokens counted by the fix', counted, '| quoted paths with an extension dropped by it', quoted);
