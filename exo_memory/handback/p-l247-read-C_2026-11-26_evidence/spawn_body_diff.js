// spawn_body_diff.js (pane C, L247 read): every line spawn_claude_pane's body has at one commit and not the other, 1f00fe9a against
// 72d88e09, so the argv's only change under Normal can be named. Read-only (git show).
// usage: node spawn_body_diff.js <repo> <old> <new>
'use strict';
const { execFileSync } = require('child_process');
const [repo, a, b] = process.argv.slice(2);
const body = (sha) => {
  const s = execFileSync('git', ['-C', repo, 'show', `${sha}:consonance/src-tauri/src/main.rs`], { maxBuffer: 1 << 28 }).toString().replace(/\r\n/g, '\n');
  const f = s.split('fn spawn_claude_pane(')[1];
  return f.split('\n}\n')[0].split('\n');
};
const A = body(a), B = body(b);
// line-level LCS, so a moved line shows as moved
const n = A.length, m = B.length, L = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
const out = [];
let i = 0, j = 0;
while (i < n || j < m) {
  if (i < n && j < m && A[i] === B[j]) { i++; j++; }
  else if (j < m && (i === n || L[i][j + 1] >= L[i + 1][j])) out.push(`+ ${b}:${j + 1}  ${B[j++]}`);
  else out.push(`- ${a}:${i + 1}  ${A[i++]}`);
}
console.log(`spawn_claude_pane body: ${a} ${n} lines, ${b} ${m} lines, ${L[0][0]} in common; ${out.length} differing:`);
for (const l of out) console.log(l);
const cmdArgs = out.filter((l) => /cmd\.args|cmd\.arg\(/.test(l));
console.log(`differing lines that add an argument: ${cmdArgs.length}`);
for (const l of cmdArgs) console.log('  ' + l);
