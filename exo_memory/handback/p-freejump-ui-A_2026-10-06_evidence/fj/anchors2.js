// anchors2.js <root> <harness files...>: every mutation's `from` text occurs exactly once in its source (no tests run). Reads the MUTATIONS / MUTANTS array literal out of the file text.
const fs = require('fs'), path = require('path');
const root = process.argv[2];
let bad = 0, total = 0;
for (const hf of process.argv.slice(3)) {
  const text = fs.readFileSync(path.join(root, hf), 'utf8');
  for (const name of ['MUTATIONS', 'MUTANTS']) {
    const a = text.indexOf(`const ${name} = [`); if (a < 0) continue; const b = text.indexOf('\n];', a);
    const pre = text.slice(0, a).match(/^const [A-Za-z_]+ = [^;\n]+;$/gm) || [];
    let list; try { list = new Function(`${pre.filter((l) => !/require\(|__dirname/.test(l)).join('\n')}\nreturn ${text.slice(a + `const ${name} = `.length, b + 2)};`)(); } catch (e) { console.log(`${hf}: cannot read ${name}: ${e.message.slice(0, 80)}`); continue; }
    for (const m of list) {
      const edits = m.edits || (m.file ? [[m.file, m.from]] : []);
      for (const [file, from] of edits) {
        total++; const cands = [path.join(root, 'app', file), path.join(root, 'src', file), path.join(root, file)];
        const f = cands.find((c) => fs.existsSync(c)); if (!f) { console.log(`${hf}: NO FILE ${file} (${(m.id || '').slice(0, 40)})`); bad++; continue; }
        const src = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'), n = src.split(from).length - 1;
        if (n !== 1) { console.log(`${hf}: NOT APPLIED (${n}) ${(m.id || '').slice(0, 60)} :: ${file} :: ${String(from).slice(0, 70)}`); bad++; }
      }
    }
  }
}
console.log(`checked ${total} edits, ${bad} not applied`);
