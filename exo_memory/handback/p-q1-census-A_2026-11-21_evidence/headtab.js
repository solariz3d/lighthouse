const fs=require('fs');const k=0.3392;const seats={A:'sibling-3d57124e',B:'sibling-5bf9d657','C?':'sibling-0845a868','E?':'sibling-07b8a48f',chair:'main',librarian:'librarian','third-place':'third-place'};
const out={};
for(const [s,d] of Object.entries(seats)){const b=fs.readFileSync('/c/Consonance/instances/'.replace('/c/','C:/')+d+'/CLAUDE.md');const t=b.toString('utf8');const lines=t.split('\n');let off=0,fence=false;const hs=[];
 for(let i=0;i<lines.length;i++){const l=lines[i];if(/^```/.test(l))fence=!fence;if(!fence&&/^# /.test(l))hs.push([off,l.slice(2,46)]);off+=Buffer.byteLength(l)+1}
 hs.push([b.length,'END']);out[s]={total:b.length,parts:[]};
 for(let i=0;i<hs.length-1;i++)out[s].parts.push([hs[i][1],hs[i+1][0]-hs[i][0]])}
const names=new Set();for(const s in out)out[s].parts.forEach(p=>names.add(p[0].replace(/ — .*|\(.*$/,'').trim().slice(0,28)));
const cols=Object.keys(out);console.log(['heading(tokens)',...cols].join(' | '));
for(const n of names){const row=cols.map(s=>{const t=out[s].parts.filter(p=>p[0].replace(/ — .*|\(.*$/,'').trim().slice(0,28)===n).reduce((a,p)=>a+p[1],0);return t?Math.round(t*k):'-'});console.log([n,...row].join(' | '))}
console.log(['TOTAL bytes',...cols.map(s=>out[s].total)].join(' | '));console.log(['TOTAL tokens',...cols.map(s=>Math.round(out[s].total*k))].join(' | '));
