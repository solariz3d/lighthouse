// mkafter.js: session.js -> session-after.js (the same session, the after cases, out-after/)
const fs = require('fs');
let s = fs.readFileSync(__dirname + '/session.js', 'utf8');
s = s.replace("const OUT = path.join(__dirname, 'out');", "const OUT = path.join(__dirname, 'out-after');");
const a = s.indexOf('  const LOOKS = '), b = s.indexOf("  console.log('locks at the end:'");
const cases = `  const LOOKS = ['aqua', 'skyline', 'glass', 'aurora', 'sigil'];
  for (const rep of [1, 2]) for (const look of LOOKS) for (const L of [1000, 2000]) for (const kind of ['turn', 'stretch']) await run(\`looks-\${look}-\${kind}-\${L}-r\${rep}\`, { repo: REPO, look, kind, length: L });
  for (const L of [100, 500, 1000, 2000, 5000, 10000, 20000]) for (const kind of ['turn', 'stretch']) await run(\`ladder-aqua-\${kind}-\${L}\`, { repo: REPO, look: 'aqua', kind, length: L, ms: L >= 10000 ? 8000 : 5000 });
  for (const look of LOOKS) for (const L of [1000, 2000]) await run(\`noblur-\${look}-turn-\${L}\`, { repo: REPO, look, kind: 'turn', length: L, noblur: true });
  await run('trace-aqua-turn-2000', { repo: REPO, look: 'aqua', kind: 'turn', length: 2000, trace: true, profile: true });
  await run('trace-aurora-turn-2000-blur', { repo: REPO, look: 'aurora', kind: 'turn', length: 2000, trace: true, capped: true });
  await run('trace-aurora-turn-2000-noblur', { repo: REPO, look: 'aurora', kind: 'turn', length: 2000, trace: true, capped: true, noblur: true });
`;
s = s.slice(0, a) + cases + s.slice(b);
fs.writeFileSync(__dirname + '/session-after.js', s);
console.log('written', (s.match(/await run\(/g) || []).length, 'run calls');
