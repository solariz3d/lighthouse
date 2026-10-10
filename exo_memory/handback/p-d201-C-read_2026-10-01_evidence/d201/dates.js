const { execSync } = require('child_process'), D = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d201';
const m = require(D + '/merged.json'), mine = require('C:/Users/nname/Desktop/lighthouse/exo_memory/loop/label_watch_packet_2026-10-01.json').claims.filter((c) => (c.assign || []).includes('C'));
const repos = ['C:/Users/nname/Desktop/t180-track-builder', 'C:/Users/nname/Desktop/lighthouse'];
const when = (h) => { for (const r of repos) { try { return execSync(`git -C ${r} log -1 --format=%cI ${h}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch {} } return null; };
for (const i of [5, 30, 33, 40, 41, 43, 47, 49, 55, 56, 60, 68, 94, 119, 123, 125, 127, 130, 131, 132, 133, 135, 141, 146]) {
  const r = m[i], ts = mine[i].ts, hs = [...new Set((r.reason.match(/\b[0-9a-f]{7,8}\b/g) || []))];
  const rows = hs.map((h) => { const w = when(h); return w ? `${h} ${new Date(w) <= new Date(ts) ? 'BEFORE' : 'AFTER'} (${w})` : `${h} ?`; });
  console.log(`#${i} ts ${ts} | ${rows.join(' ; ')}`);
}
