// L236 read (pane C): re-derive the 4.4% through the BRANCH's own code, not a re-implementation of its filter.
// For each shell command with a reading verb in the builder transcripts, the branch's rereadsAfterCuts is run on
// [cmd, cut, dispatch, cmd]; its re-read list is exactly the set of paths the branch counts in that command.
// A "quoted path with an extension" token (the definition used in quoted_row.js at 3ac00138) is DROPPED if its
// normalised form is not in that set. Also listed: what the branch now admits that starts with s/ (a sed expression).
const path = require('path'), fs = require('fs');
const R = require(path.join(process.argv[2], 'consonance/tools/usage-ledger.js'));
const J = JSON.stringify;
const VERB = /(?:^|[\s;&|(])(?:cat|head|tail|sed|grep|rg|type|less|more|get-content|gc)\b([^;&|\n]*)/gi;
const SEP = /[\/\\]/;
const norm = (p) => String(p).replace(/^["'`]|["'`,)]+$/g, '').replace(/\\/g, '/').toLowerCase().replace(/^\/([a-z])\//, '$1:/');
let sedN = 0, cmds = 0, counted = 0, quoted = 0, dropped = 0; const droppedEx = [], sedEx = [];
for (const f of process.argv.slice(3)) for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
  let v; try { v = JSON.parse(l); } catch { continue; }
  if (v.type !== 'assistant' || !Array.isArray(v.message && v.message.content)) continue;
  for (const b of v.message.content) {
    if (b.type !== 'tool_use' || (b.name !== 'Bash' && b.name !== 'PowerShell')) continue;
    const cmd = String(b.input.command || '');
    if (!cmd.match(VERB)) continue;
    cmds++;
    const t = (s) => J({ type: 'assistant', timestamp: s, message: { id: 'm' + s, content: [{ type: 'tool_use', name: 'Bash', input: { command: cmd } }] } });
    const got = new Set(R.rereadsAfterCuts([t('1'), J({ type: 'system', subtype: 'compact_boundary', timestamp: '2' }), J({ type: 'user', timestamp: '3', message: { content: '[chair:MAIN] L236 x' } }), t('4')])[0].reread);
    counted += got.size;
    for (const p of got) if (/^s\//.test(p)) { sedN++; if (sedEx.length < 8) sedEx.push(p); }
    for (const m of cmd.matchAll(VERB)) for (const tok of m[1].split(/\s+/)) {
      if (!tok || tok.startsWith('-') || /[*?[\]$]/.test(tok)) continue;
      if (!/^["'`]/.test(tok)) continue;
      const n = norm(tok);
      if (!(SEP.test(n) && /\.[a-z0-9]{1,5}$/i.test(n))) continue;
      quoted++;
      if (!got.has(n)) { dropped++; if (droppedEx.length < 8) droppedEx.push(tok); }
    }
  }
}
console.log('commands with a reading verb', cmds, '| distinct paths counted by the branch (sum per command)', counted);
console.log('quoted paths with an extension', quoted, '| dropped by the branch', dropped, `(${quoted ? (100 * dropped / quoted).toFixed(2) : 0}%)`);
console.log('dropped examples:', J(droppedEx));
console.log("admitted that start with s/ (a sed expression?):", sedN, J(sedEx));
