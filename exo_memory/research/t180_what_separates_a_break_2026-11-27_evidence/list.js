const fs=require('fs'),path=require('path'),crypto=require('crypto');
const R=require('C:/Users/nname/Desktop/blackbox/ui/acreplay.js');
const dir='C:/Users/nname/Documents/Assetto Corsa/replay';
const out=[];
for(const f of fs.readdirSync(dir)){const p=path.join(dir,f);const st=fs.statSync(p);if(!st.isFile())continue;
 try{const b=fs.readFileSync(p);const sha=crypto.createHash('sha256').update(b).digest('hex');
 const r=R.parseReplay(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));
 out.push({f,sha:sha.slice(0,12),size:st.size,mtime:st.mtime.toISOString(),track:r.track,nf:r.numFrames,cars:(r.cars||[]).map(c=>c.model||c.name||c.car||JSON.stringify(c).slice(0,60))});
 }catch(e){out.push({f,err:String(e.message).slice(0,80),size:st.size})}}
fs.writeFileSync('replays.json',JSON.stringify(out,null,1));
for(const o of out)console.log([o.sha,o.track,o.nf,(o.cars||[]).join('|'),o.mtime,o.f,o.err||''].join('\t'));
