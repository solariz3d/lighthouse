const fs = require('fs'), WT = 'C:/Users/nname/Desktop/a-d188-wt';
function edit(file, pairs) {
  let s = fs.readFileSync(WT + '/' + file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(file + ': anchor not unique/found: ' + a.slice(0, 90)); s = s.replace(a, () => b); }
  if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(WT + '/' + file, s); console.log('edited', file, crlf ? '(CRLF)' : '(LF)');
}
edit('src/validate/index.js', [
["  segments.forEach((g, j) => {\n    if (j < fromSeg) return;\n    if (firstOf[j] < 0 || firstOf[j] >= end) return;   // a segment wholly in the pending stretch is not checked yet\n    const s0 = S[firstOf[j]].s, s1 = S[lastOf[j]].s;\n",
 "  // a cup's joint (legacy <-> cup, the lap seam) or any joint inside a cup whose curve steps more than 1 mm (D190 R3, the chair's ruling (c)): red, so\n  // the panel never reads \"0 red · lap proved\" over a cliff. Word documents' joints are unchanged (jointSteps looks only where a cup is).\n  const jointStep = new Map(P.jointSteps(segments, path.closed).filter((x) => x.m > 1e-3).map((x) => [x.j, x]));\n  segments.forEach((g, j) => {\n    if (j < fromSeg) return;\n    if (firstOf[j] < 0 || firstOf[j] >= end) return;   // a segment wholly in the pending stretch is not checked yet\n    const s0 = S[firstOf[j]].s, s1 = S[lastOf[j]].s;\n    if (jointStep.has(j)) raw.segReds.push({ j, s: s0, s1: s0, u: null, reason: 'joint-step', worst: jointStep.get(j).m });\n"],
]);
edit('app/validate-ui/labels.js', [
["    'jump-gap-not-forward': 'a jump lands behind its own take-off',\n",
 "    'jump-gap-not-forward': 'a jump lands behind its own take-off',\n    'joint-step': 'the road steps between two pieces here (the cup and the piece next to it do not meet)',\n"],
]);
