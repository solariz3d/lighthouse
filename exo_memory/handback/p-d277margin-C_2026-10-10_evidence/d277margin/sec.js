// Split an intake into top-level sections at "\n---\n\n# " and "\n## " headings of interest; print bytes per section.
const fs=require('fs');
for (const f of process.argv.slice(2)) {
  const t=fs.readFileSync(f,'utf8'); console.log(`\n${f.split(/[\/]/).slice(-2).join('/')}  ${Buffer.byteLength(t)} B`);
  const re=/^(# [^\n]*|## (?:The live edge|NOT CARRIED|BY DIRECTORY|YOUR OWN MAP)[^\n]*)$/gm; let m, marks=[];
  while((m=re.exec(t))) marks.push([m.index,m[1]]);
  marks.push([t.length,'END']);
  let prev=[0,'(start)'];
  for (const k of marks){ console.log(String(Buffer.byteLength(t.slice(prev[0],k[0]))).padStart(8)+'  '+prev[1].slice(0,70)); prev=k; }
}
