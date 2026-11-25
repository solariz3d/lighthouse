// The same count, with "read before" limited to the reads since the PREVIOUS cut (what the cut removed from context), using the branch's
// own pathsOf by calling rereadsAfterCuts on the slice from the previous boundary. Prints both, per November cut, and the entries.
const path = require('path'), fs = require('fs');
const R = require(path.join(process.argv[2], 'consonance/tools/usage-ledger.js'));
const lines = fs.readFileSync(process.argv[3], 'utf8').split('\n');
const isCut = (l) => { try { const v = JSON.parse(l); return v.type === 'system' && v.subtype === 'compact_boundary' && !v.isSidechain; } catch { return false; } };
const cutIdx = []; lines.forEach((l, i) => { if (isCut(l)) cutIdx.push(i); });
const whole = R.rereadsAfterCuts(lines);
for (let c = 0; c < cutIdx.length; c++) {
  if (!String(whole[c].at).startsWith(process.argv[4] || '2026-11-25')) continue;
  const from = c > 0 ? cutIdx[c - 1] + 1 : 0;   // the slice starts just after the previous cut, so its first boundary is THIS cut
  const w = R.rereadsAfterCuts(lines.slice(from))[0];
  console.log('cut', whole[c].at, '| first lap', whole[c].firstLap);
  console.log('  branch (whole history before):', whole[c].reread.length, 're-read of', whole[c].before, '|', JSON.stringify(whole[c].reread));
  console.log('  since previous cut only     :', w.reread.length, 're-read of', w.before, '|', JSON.stringify(w.reread));
}
