// node scrub.js : same-length scrub of the six composer screen fixtures into a scratch worktree, and the generator's own scan() before and after.
const fs = require('fs'), path = require('path');
const SRC = 'C:/Users/nname/Desktop/worktrees/b-d273-src/', DST = 'C:/Users/nname/Desktop/worktrees/a-cw-wt/';
const G = require(SRC + 'consonance/tools/gen-consumer.js');
const DIR = 'consonance/src-tauri/fixtures/screens/';
// every replacement keeps the byte length, so no offset, column or escape sequence in a screen capture moves
const MAP = [['nname', 'alice'], ['zackn', 'alice'], ['America/Regina', 'America/Denver'], ['Consonance/lighthouse', 'Consonance/workspaces'], ['Consonance\\lighthouse', 'Consonance\\workspaces'], ['Consonance/light', 'Consonance/works'], ['Consonance/l', 'Consonance/w']];
const classes = (body, rel) => { const f = G.scan(body, rel); const c = {}; for (const x of f) c[x.cls || x.class || x.kind || '?'] = (c[x.cls || x.class || x.kind || '?'] || 0) + 1; return c; };
const out = [];
for (const name of fs.readdirSync(SRC + DIR).sort()) {
  const rel = DIR + name, buf = fs.readFileSync(SRC + rel), before = buf.toString('latin1');
  let after = before; const did = {};
  for (const [a, b] of MAP) { if (a.length !== b.length) throw new Error('length differs: ' + a); const n = after.split(a).length - 1; if (n) { did[a] = n; after = after.split(a).join(b); } }
  const nb = Buffer.from(after, 'latin1'); if (nb.length !== buf.length) throw new Error('length changed for ' + name);
  fs.writeFileSync(DST + rel, nb);
  out.push({ name, bytes: buf.length, replaced: did, scanBefore: classes(before, rel), scanAfter: classes(after, rel) });
}
console.log(JSON.stringify(out, null, 1));
