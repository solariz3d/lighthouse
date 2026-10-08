// node codehits.js <gen> <src> : lines in the generated tree whose CODE part (not a // comment) carries a generator-rewrite phrase that the source line does not -- code the rewrite may have changed.
const fs = require('fs'), path = require('path');
const gen = process.argv[2], src = process.argv[3];
const PHRASES = [/line of record/g, /<a name>/g, /\bthe keeper\b/g, /\bthe person you're with\b/g, /a master in/g];
const out = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.name === '.git' || e.name === 'node_modules' || e.name === 'target') continue; const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(js|cjs|rs|ps1|py)$/.test(e.name)) check(p); } };
function codePart(line, ext) {
  const t = line.trim();
  if (ext === 'py' || ext === 'ps1') { if (t.startsWith('#')) return ''; return line; }
  if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('///') || t.startsWith('//!')) return '';
  // drop a trailing // comment only when the // is preceded by whitespace (not inside a URL/regex)
  const m = / \/\/ /.exec(line); return m ? line.slice(0, m.index) : line;
}
function check(f) {
  const rel = path.relative(gen, f).replace(/\\/g, '/'), ext = f.split('.').pop();
  const sp = path.join(src, rel); if (!fs.existsSync(sp)) return;
  const g = fs.readFileSync(f, 'utf8').split(/\r?\n/), s = fs.readFileSync(sp, 'utf8').split(/\r?\n/);
  if (g.length !== s.length) { /* line counts differ: compare as sets */ }
  const sset = new Set(s);
  g.forEach((line, i) => {
    if (sset.has(line)) return;
    const code = codePart(line, ext); if (!code) return;
    // inside an obvious test-only or docstring? keep: report anyway, the reader judges
    if (PHRASES.some((re) => { re.lastIndex = 0; return re.test(code); })) out.push({ file: rel, line: i + 1, text: line.trim().slice(0, 170) });
  });
}
walk(gen);
const byFile = {}; for (const o of out) (byFile[o.file] = byFile[o.file] || []).push(o);
console.log('files with changed code-part lines carrying a rewrite phrase:', Object.keys(byFile).length, ' lines:', out.length);
for (const [f, l] of Object.entries(byFile)) { console.log('== ' + f + ' (' + l.length + ')'); for (const x of l.slice(0, 3)) console.log('   ' + x.line + ': ' + x.text); }
