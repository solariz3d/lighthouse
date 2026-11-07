// sessioncheck.js before|after <state.json>: the librarian's live session file. before: size N, sha256 of the first N bytes, mtime, the .jsonl list.
// after: the same prefix hash, every line past N carries the original sessionId, no new .jsonl in the project folder.
const fs=require('fs'),crypto=require('crypto'),path=require('path');const [,,mode,ST]=process.argv;
const DIR='C:/Users/nname/.claude/projects/C--Consonance-instances-librarian',ID='0c0c0c0b-0000-4000-8000-00000000115b',F=path.join(DIR,ID+'.jsonl');
const hashPrefix=(n)=>new Promise(r=>{const h=crypto.createHash('sha256');fs.createReadStream(F,{start:0,end:n-1}).on('data',d=>h.update(d)).on('end',()=>r(h.digest('hex')))});
(async()=>{const st=fs.statSync(F);const list=fs.readdirSync(DIR).filter(f=>f.endsWith('.jsonl')).sort();
if(mode==='before'){const s={size:st.size,mtime:st.mtime.toISOString(),prefix:await hashPrefix(st.size),list};fs.writeFileSync(ST,JSON.stringify(s,null,1));console.log(JSON.stringify(s));return}
const b=JSON.parse(fs.readFileSync(ST,'utf8'));const same=(await hashPrefix(b.size))===b.prefix;
const tail=fs.readFileSync(F).subarray(b.size).toString('utf8').split('\n').filter(Boolean);const ids={};for(const l of tail){const m=/"sessionId":"([^"]+)"/.exec(l);const k=m?m[1]:'(none)';ids[k]=(ids[k]||0)+1}
const newFiles=list.filter(f=>!b.list.includes(f));
console.log(JSON.stringify({before:{size:b.size,mtime:b.mtime},after:{size:st.size,mtime:st.mtime.toISOString()},prefixUnchanged:same,appendedLines:tail.length,appendedSessionIds:ids,newJsonl:newFiles},null,1))})();
