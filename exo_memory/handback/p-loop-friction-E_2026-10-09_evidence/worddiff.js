// For the changed-content pairs: the words removed and added, by a longest-common-subsequence over word tokens (no external diff tool).
'use strict';
const p = require('./m1_pairs.json').filter((r) => r.foundDeny && r.foundAllow && !r.contentSame);
const pick = process.argv.slice(2).map(Number);
function lcsDiff(a, b) {
  const n = a.length, m = b.length, dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out = []; let i = 0, j = 0;
  while (i < n && j < m) { if (a[i] === b[j]) { out.push(['=', a[i]]); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) out.push(['-', a[i++]]); else out.push(['+', b[j++]]); }
  while (i < n) out.push(['-', a[i++]]); while (j < m) out.push(['+', b[j++]]);
  // collapse runs, show only changes with 4 words of context
  const res = []; let k = 0;
  while (k < out.length) {
    if (out[k][0] === '=') { k++; continue; }
    const s = k; while (k < out.length && out[k][0] !== '=') k++;
    const ctxL = out.slice(Math.max(0, s - 4), s).map((x) => x[1]).join(' '), ctxR = out.slice(k, k + 4).map((x) => x[1]).join(' ');
    const del = out.slice(s, k).filter((x) => x[0] === '-').map((x) => x[1]).join(' '), add = out.slice(s, k).filter((x) => x[0] === '+').map((x) => x[1]).join(' ');
    res.push(`…${ctxL} [-${del}-] {+${add}+} ${ctxR}…`);
  }
  return res;
}
for (const i of pick) {
  const r = p[i];
  console.log(`#${i} ${r.ts} ${r.tool} ${r.seat} ${r.target || ''}`);
  for (const c of lcsDiff(r.removed.join(' ').split(/\s+/), r.added.join(' ').split(/\s+/))) console.log('   ' + c.slice(0, 400));
}
