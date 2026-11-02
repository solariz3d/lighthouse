// usage: node table.js <dir with the seats' JSON from weigh.js> : the D618 table and the top three contributors per seat, as Markdown
// Tokens for the instruction files are ESTIMATED as bytes / 4 (no tokenizer here); every other token figure is the API's own usage field.
'use strict';
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
const SEATS = [['D', 'main'], ['M', 'librarian'], ['N', 'third-place'], ['A', 'sibling-3d57124e'], ['B', 'sibling-5bf9d657'], ['C', 'sibling-0845a868'], ['E', 'sibling-07b8a48f'], ['O', 'sibling-36313935'], ['P', 'sibling-372c8abc']];
const GLOBAL = fs.statSync('C:/Users/nname/.claude/CLAUDE.md').size;
const k = (n) => (n == null ? '–' : n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));
const rows = [], tops = [];
for (const [L, d] of SEATS) {
  const j = JSON.parse(fs.readFileSync(path.join(dir, `${L}.json`), 'utf8'));
  const claude = fs.statSync(`C:/Consonance/instances/${d}/CLAUDE.md`).size;
  let mem = 0; try { mem = fs.statSync(`C:/Users/nname/.claude/projects/C--Consonance-instances-${d}/memory/MEMORY.md`).size; } catch (e) { /* none */ }
  const turn = j.contextAtTurn.last, floor = j.floor.afterLastCompactions.length ? j.floor.afterLastCompactions[j.floor.afterLastCompactions.length - 1].ctx : j.floor.minEver.ctx;
  const instrTok = Math.round((claude + GLOBAL + mem) / 4);           // estimated
  const convo = Math.max(0, turn - floor);                              // carried conversation since the last compaction
  const rest = Math.max(0, floor - instrTok);                           // the floor's other part: system prompt, tool schemas, the compaction summary (not split further here)
  const injTok = Math.round(j.injectedChars.perPrompt / 4);            // estimated
  const days = Object.entries(j.perDay);
  const full = days.filter(([day]) => day >= '2026-10-30' && day <= '2026-11-01');
  const kwPerDay = full.length ? Math.round(full.reduce((s, [, v]) => s + v.keepwarm, 0) / full.length) : null;
  const kwRead = j.keepwarm * (j.contextAtTurn.median || 0);
  rows.push(`| ${L} ${d} | ${(j.bytes / 1e9).toFixed(2)} GB | **${k(turn)}** (median ${k(j.contextAtTurn.median)}, max ${k(j.contextAtTurn.max)}; ${j.contextAtTurn.n} turns) | ${k(floor)} | ${claude.toLocaleString('en')} B (~${k(Math.round(claude / 4))}) + memory ${mem} B | ${j.injectedChars.perPrompt} ch (~${injTok} tok): ${Object.entries(j.injectedChars.byKind).map(([kk, v]) => `${kk} ${Math.round(v / j.prompts)}`).join(', ')} | ${j.keepwarm} of ${j.prompts} | ${kwPerDay} | ${k(kwRead)} | ${j.compactions.window} / ${j.compactions.all} |`);
  const parts = [['carried conversation since the last compaction', convo], ['system prompt, tool schemas and the compaction summary (the floor less the instruction files)', rest], [`instruction files (its CLAUDE.md ${claude.toLocaleString('en')} B, the global ${GLOBAL.toLocaleString('en')} B, MEMORY.md ${mem} B; bytes/4)`, instrTok], ['text the hooks add to each turn (pulse, state block)', injTok]].sort((a, b) => b[1] - a[1]).slice(0, 3);
  tops.push(`- **${L}** (${k(turn)} at its last turn): ${parts.map(([n, v]) => `${n} ~${k(v)}`).join('; ')}.`);
}
const head = '| seat | newest transcript | live context at a turn, tokens (last) | floor (first call after its last compaction) | its CLAUDE.md (bytes, ~tokens) | added per turn by hooks | keep-warm of prompts, 24 h | keep-warm a day (10-30..11-01) | cache read by keep-warms, 24 h | compactions 24 h / ever |\n|---|---|---|---|---|---|---|---|---|---|';
process.stdout.write(`${head}\n${rows.join('\n')}\n\n${tops.join('\n')}\n`);
