// All titles of index-tier candidates in the snapshot: map/, journal/, loop/ (recursive .md), top-level handback/*.md
const fs=require('fs'),path=require('path');const S=process.argv[2];
function walk(d,rec,out){let r;try{r=fs.readdirSync(d,{withFileTypes:true})}catch{return}for(const e of r){const p=path.join(d,e.name);if(e.isDirectory()){if(rec)walk(p,rec,out)}else if(e.name.endsWith('.md'))out.push(p)}}
const out=[];for(const d of['map','journal','loop'])walk(path.join(S,d),true,out);walk(path.join(S,'handback'),false,out);
for(const p of out){const b=fs.readFileSync(p,'utf8');const h=(b.split(/\r?\n/).find(l=>l.startsWith('# '))||'').replace(/^# /,'').trim();console.log(path.relative(S,p).split(path.sep).join('/')+'\t'+h)}
