// mkd399.js: the timing session for the D399 comparison: v0.4.7 against fc8c445, interleaved, out-d399/
const fs = require('fs');
let s = fs.readFileSync(__dirname + '/session.js', 'utf8');
s = s.replace("const OUT = path.join(__dirname, 'out');", "const OUT = path.join(__dirname, 'out-d399');");
const a = s.indexOf('  const LOOKS = '), b = s.indexOf("  console.log('locks at the end:'");
const cases = `  const LOOKS = ['aqua', 'skyline', 'glass', 'aurora', 'sigil'];
  const TREES = { v047: 'C:/Users/nname/Downloads/t180-wt-a24', d399: 'C:/Users/nname/Downloads/t180-wt-a26' };
  // the 0.4.7 drag is slow (20 ms a move): its 1,000 m / 2,000 m cases are the same code as the measurement; the fix is not in either tree. To see a CSS layer's cost the fix is needed
  // under both, so the same two trees are also run with the fix's code copied over (a25's src, tools and app/core, app/preview): trees v047fix and d399fix
  for (const rep of [1, 2, 3]) for (const look of LOOKS) for (const [tag, repo] of Object.entries(TREES)) for (const kind of ['turn', 'stretch']) for (const L of (kind === 'turn' ? [1000, 2000] : [1000])) await run(\`\${tag}-\${look}-\${kind}-\${L}-r\${rep}\`, { repo, look, kind, length: L, ms: 4000 });
  for (const rep of [1, 2, 3]) for (const look of LOOKS) for (const [tag, repo] of [['v047fix', 'C:/Users/nname/Downloads/t180-wt-a25'], ['d399fix', 'C:/Users/nname/Downloads/t180-wt-a28']]) for (const L of [1000, 2000]) await run(\`\${tag}-\${look}-turn-\${L}-r\${rep}\`, { repo, look, kind: 'turn', length: L, ms: 4000 });
  await run('trace-d399fix-aurora-turn-2000', { repo: 'C:/Users/nname/Downloads/t180-wt-a28', look: 'aurora', kind: 'turn', length: 2000, trace: true, capped: true });
  await run('trace-v047fix-aurora-turn-2000', { repo: 'C:/Users/nname/Downloads/t180-wt-a25', look: 'aurora', kind: 'turn', length: 2000, trace: true, capped: true });
`;
s = s.slice(0, a) + cases + s.slice(b);
fs.writeFileSync(__dirname + '/session-d399.js', s);
console.log('written', (s.match(/await run\(/g) || []).length, 'run calls');
