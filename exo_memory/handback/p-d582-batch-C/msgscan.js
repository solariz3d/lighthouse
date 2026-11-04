// msgscan.js <repo> <range>: every commit in the range (oldest first): its line count, the flags its message raises (keeper, a lap id, a seat line,
// a room path, a private term by INDEX), and its subject. Never prints a private term.
'use strict';
const fs = require('fs'), { execFileSync } = require('child_process');
const [, , repo, range] = process.argv;
const terms = fs.readFileSync('C:/Consonance/private/d528/terms.txt', 'utf8').split(/\r?\n/).map((t) => t.trim().toLowerCase()).map((t, i) => [i, t]).filter(([, t]) => t.length >= 2);
const shas = execFileSync('git', ['-C', repo, 'rev-list', '--reverse', range], { encoding: 'utf8' }).trim().split('\n');
const F = { keeper: /keeper/i, lap: /\bD\d{3}[a-z]?\b|\bL\d{3}\b|\blap\s+id\b|\bd\d{3}[a-z]?-[a-z]\b/i, seat: /^Seat:|\bpane [A-Z]\b|\bseat [A-Z]\b|librarian|\bthe chair\b|sibling-|Claude-Session/im, path: /exo_memory|docs\/research|handback|p-d\d+/i };
let n = 0;
for (const s of shas) {
  const msg = execFileSync('git', ['-C', repo, 'log', '-1', '--format=%B', s], { encoding: 'utf8' }).trimEnd();
  const lines = msg.split('\n'), flags = Object.entries(F).filter(([, re]) => re.test(msg)).map(([k]) => k);
  const low = msg.toLowerCase(), hit = terms.filter(([, t]) => low.includes(t)).map(([i]) => `term#${i}`);
  console.log(`${s.slice(0, 7)} ${String(lines.length).padStart(2)}L ${[...flags, ...hit].join(',') || '-'}\t${lines[0].slice(0, 110)}`);
  n++;
}
console.log(`${n} commits`);
