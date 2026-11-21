const fs=require('fs');const {readAiLine}=require('C:/Consonance/t180-wt-ai/src/export/ailine.js');
const f=process.argv[2];const L=readAiLine(fs.readFileSync(f));const P=L.points.map(p=>p.pos.map(Math.fround)),n=P.length;
const h=(a,b)=>{const d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],l=Math.hypot(...d);return l>0?Math.hypot(d[0],d[2])/l:1;};
const hs=[];for(let k=1;k<n-1;k++){hs.push(Math.min(h(P[k],P[k+1]),h(P[k-1],P[k]),h(P[k-1],P[k+1])));}
const sorted=[...hs].sort((a,b)=>a-b);
const pitch=(a,b)=>Math.asin(Math.abs(b[1]-a[1])/Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]))*180/Math.PI;
let steep80=0,steep88=0,run=0,maxrun=0;for(let k=0;k<n-1;k++){const p=pitch(P[k],P[k+1]);if(p>80)steep80++;if(p>88)steep88++;if(p>80){run++;maxrun=Math.max(maxrun,run);}else run=0;}
console.log(f.split('/').slice(-3).join('/'),'points',n,'least h',sorted[0].toExponential(3),'5 smallest',sorted.slice(0,5).map(x=>x.toExponential(2)).join(' '),'| steps>80deg',steep80,'>88deg',steep88,'longest run >80deg',maxrun);
