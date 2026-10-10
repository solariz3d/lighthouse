// Mutants of dev/diversity/redact.js on a REPLICA in the scratchpad; the three tracked files are hashed before and after.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const SRC = 'C:/Users/nname/Desktop/lighthouse/dev/diversity';
const FILES = ['redact.js', 'redact.test.js', 'arm-words.txt'];
const R = path.join(__dirname, 'redact_replica');
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const before = FILES.map((f) => sha(path.join(SRC, f)));
fs.rmSync(R, { recursive: true, force: true });
fs.mkdirSync(R, { recursive: true });
for (const f of FILES) fs.copyFileSync(path.join(SRC, f), path.join(R, f));
const W = path.join(R, 'redact.js');
const ORIG = fs.readFileSync(W, 'utf8');

const run = () => {
  const o = spawnSync(process.execPath, ['redact.test.js'], { cwd: R, encoding: 'utf8', windowsHide: true, timeout: 120000 });
  const t = (o.stdout || '') + (o.stderr || '');
  const m = t.match(/(\d+) passed, (\d+) failed/);
  return { passed: m ? +m[1] : -1, failed: m ? +m[2] : -1, fails: t.split('\n').filter((l) => /^\s*FAIL /.test(l)).map((l) => l.trim().slice(5, 70)) };
};
const pre = run();
console.log(`PRE-FLIGHT: ${pre.passed} passed, ${pre.failed} failed`);
if (pre.failed !== 0 || pre.passed < 1) { console.log('pre-flight not green — refusing to score'); process.exit(2); }

// [id, what, [[anchor, replacement], ...]] — every anchor must occur exactly once in the ORIGINAL
const M = [
  ['M1', 'packet filename pattern removed', [['    /(?:[\\w.-]+\\/)*packet_[\\w.-]+/g,\n', '']]],
  ['M2', 'abbreviated <hex>…<hex> pattern removed', [['    /\\b[0-9a-f]{4,}…[0-9a-f]{4,}\\b/gi,\n', '']]],
  ['M3', 'abbreviated pattern applied AFTER the plain sha pattern', [['    /\\b[0-9a-f]{4,}…[0-9a-f]{4,}\\b/gi,\n    /\\b(?=[0-9a-f]*[a-f])(?=[0-9a-f]*[0-9])[0-9a-f]{7,64}\\b/gi,\n', '    /\\b(?=[0-9a-f]*[a-f])(?=[0-9a-f]*[0-9])[0-9a-f]{7,64}\\b/gi,\n    /\\b[0-9a-f]{4,}…[0-9a-f]{4,}\\b/gi,\n']]],
  ['M4', 'sha pattern loses /i (upper case survives)', [['[0-9a-f]{7,64}\\b/gi,', '[0-9a-f]{7,64}\\b/g,']]],
  ['M5', 'sha pattern loses the DIGIT lookahead ("defaced" removed)', [['(?=[0-9a-f]*[a-f])(?=[0-9a-f]*[0-9])[0-9a-f]{7,64}', '(?=[0-9a-f]*[a-f])[0-9a-f]{7,64}']]],
  ['M6', 'sha pattern loses the LETTER lookahead (figures removed)', [['(?=[0-9a-f]*[a-f])(?=[0-9a-f]*[0-9])[0-9a-f]{7,64}', '(?=[0-9a-f]*[0-9])[0-9a-f]{7,64}']]],
  ['M7', 'sha pattern back to {7,40} (a sha256 survives)', [['[0-9a-f]{7,64}', '[0-9a-f]{7,40}']]],
  ['M8', '§ pattern removed', [['    /§[ \\t]?[\\w.–-]*/g,\n', '']]],
  ['M9', '§ pattern takes the sign only (the number survives)', [['/§[ \\t]?[\\w.–-]*/g', '/§/g']]],
  ['M10', '[pane:X] pattern removed (overlaps pane:X)', [['    /\\[[Pp]ane:[A-Z]\\]/g,\n', '']]],
  ['M11', 'pane:X pattern removed', [['    /\\b[Pp]ane:[A-Z]\\b/g,\n', '']]],
  ['M12', '"pane X" pattern removed', [['    /\\b[Pp]ane[ \\t][A-Z]\\b/g,\n', '']]],
  ['M13', '"X pane" pattern removed', [['    /\\b[A-Z][ \\t]pane\\b/g,\n', '']]],
  ['M14', '"X\'s" pattern removed', [["    /\\b[A-Z]['\u2019]s\\b/g,\n", '']]],
  ['M15', '"X\'s" loses the curly apostrophe', [["/\\b[A-Z]['\u2019]s\\b/g", "/\\b[A-Z][']s\\b/g"]]],
  ['M16', '"X (pane" pattern removed', [['    /\\b[A-Z](?=[ \\t]\\([Pp]ane\\b)/g,\n', '']]],
  ['M17', 'hand-back filename letter pattern removed', [['    /(?<=-)[A-Z](?=_\\d{4}-\\d{2}-\\d{2})/g,\n', '']]],
  ['M18', 'map/X.md pattern removed', [['    /(?<=\\bmap\\/)[A-Z](?=\\.md\\b)/g,\n', '']]],
  ['M19', '"(X)" ruling-owner pattern removed', [['    /\\([A-Z]\\)/g,\n', '']]],
  ['M20', 'NATO Title case dropped', [['longestFirst([...NATO, ...NATO.map(title)])', 'longestFirst([...NATO])']]],
  ['M21', 'one callsign (ZULU) dropped from the list', [["'YANKEE', 'ZULU'];", "'YANKEE'];"]]],
  ['M22', 'the arm-word list is never applied', [["...(words.length ? [new RegExp(`(?<![\\\\w-])(?:${longestFirst(words)})(?![\\\\w-])`, 'gi')] : []),", '']]],
  ['M23', 'arm words matched case-sensitively', [["(?:${longestFirst(words)})(?![\\\\w-])`, 'gi')", "(?:${longestFirst(words)})(?![\\\\w-])`, 'g')"]]],
  ['M24', 'no line-by-line redaction AND "pane X" may span whitespace', [
    ["  return text.split('\\n').map((line) => res.reduce((l, re) => l.replace(re, TOKEN), line)).join('\\n');", '  return res.reduce((l, re) => l.replace(re, TOKEN), text);'],
    ['/\\b[Pp]ane[ \\t][A-Z]\\b/g', '/\\b[Pp]ane\\s[A-Z]\\b/g']]],
  ['M25', '--letters accepts A and I', [["if (letters.some((L) => L === 'A' || L === 'I')) throw", "if (false) throw"]]],
  ['M26', 'bare letters lose the byte-unit guard ("190 B" removed)', [['(?<!\\\\d[ \\\\t])', '']]],
  ['M27', 'bare letters lose the "-" guard ("D-2" removed)', [["(?![\\\\w\\\\-'\\\\u2019:]|\\\\.\\\\w)", "(?![\\\\w'\\\\u2019:]|\\\\.\\\\w)"]]],
  ['M28', 'bare-letter pattern never added', [["...(letters.length ? [new RegExp(", "...(false ? [new RegExp("]]],
  ['M29', 'parseWords keeps the reason (no entry ever matches)', [[".map((l) => l.split(' # ')[0].trim());", '.map((l) => l);']]],
  ['M30', 'one token per kind (the kind of removal is told)', [['l.replace(re, TOKEN)', "l.replace(re, `[redacted:${res.indexOf(re)}]`)"]]],
  ['SURVIVE-CONTROL', 'reword a comment', [['or "packet_" would be split', 'or "packet_" would be broken up']]],
  ['SKIP-CONTROL', 'an anchor that does not exist', [['this anchor is not in redact.js', 'x']]],
];

let applied = 0, caught = 0;
const rows = [];
for (const [id, what, edits] of M) {
  const counts = edits.map(([a]) => ORIG.split(a).length - 1);
  if (counts.some((n) => n !== 1)) { rows.push(`  NOT APPLIED  ${id} ${what}  (anchor counts ${counts.join(',')})`); continue; }
  let src = ORIG;
  for (const [a, b] of edits) src = src.replace(a, () => b);
  if (src === ORIG) { rows.push(`  NOT APPLIED  ${id} ${what}  (no change)`); continue; }
  fs.writeFileSync(W, src);
  const r = run();
  fs.writeFileSync(W, ORIG);
  if (!id.includes('CONTROL')) applied++;
  if (r.failed > 0) { if (!id.includes('CONTROL')) caught++; rows.push(`  CAUGHT       ${id} ${what}  (${r.failed}: ${r.fails.join(' | ')})`); }
  else rows.push(`  SURVIVED     ${id} ${what}  (${r.passed} passed)`);
}
console.log(rows.join('\n'));
const after = FILES.map((f) => sha(path.join(SRC, f)));
console.log(`mutants applied ${applied} · caught ${caught} · tracked files unchanged: ${before.every((h, i) => h === after[i])}`);
const post = run();
console.log(`POST (replica restored): ${post.passed} passed, ${post.failed} failed`);
