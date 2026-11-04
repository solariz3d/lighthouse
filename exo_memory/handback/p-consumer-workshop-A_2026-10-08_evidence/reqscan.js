// node reqscan.js <tree> : every literal relative require() in a shipped .js that resolves to nothing in the tree (a stranger's tool that crashes at load).
const fs = require('fs'), path = require('path');
const root = process.argv[2], out = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name === 'node_modules' || e.name === 'target') continue; walk(p); } else if (/\.js$/.test(e.name)) scan(p); } };
function scan(file) {
  const src = fs.readFileSync(file, 'utf8'), isTest = /\.test\.js$/.test(file);
  const re = /require\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)/g; let m;
  while ((m = re.exec(src))) {
    const t = path.resolve(path.dirname(file), m[1]);
    const ok = [t, t + '.js', t + '.json', t + '.cjs', path.join(t, 'index.js')].some((c) => fs.existsSync(c) && fs.statSync(c).isFile());
    if (!ok) out.push({ file: path.relative(root, file).replace(/\\/g, '/'), isTest, require: m[1] });
  }
}
walk(root);
const tools = out.filter((o) => !o.isTest);
console.log(JSON.stringify({ unresolvedInShippedCode: tools, unresolvedInTests: out.filter((o) => o.isTest).length }, null, 1));
