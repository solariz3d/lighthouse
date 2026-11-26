const fs=require('fs'),path=require('path');const {EXTRA}=require('C:/Consonance/t180-wt-l243/src/export/ailine.js');
const root=process.argv[2];const rows=require('./survey.json');let i=0;
for(const r of rows.filter(x=>x.ai&&x.read==='HAS_GRID')){i++;
 const b=fs.readFileSync(path.join(root,r.track,r.layout,'ai','fast_lane.ai'));let o=16;const n=b.readInt32LE(4);
 const P=[];for(let k=0;k<n;k++){P.push([b.readFloatLE(o),b.readFloatLE(o+4),b.readFloatLE(o+8),b.readFloatLE(o+12)]);o+=20;}
 const n2=b.readInt32LE(o);o+=4;const E=[];for(let k=0;k<n;k++){const e={};for(const f of EXTRA){e[f]=b.readFloatLE(o);o+=4;}E.push(e);}
 let L=0;for(let k=1;k<n;k++)L+=Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1],P[k][2]-P[k-1][2]);const close=Math.hypot(P[n-1][0]-P[0][0],P[n-1][2]-P[0][2]);
 const w=E.map(e=>e.sideLeft+e.sideRight).sort((a,b)=>a-b);const nl=E.map(e=>Math.hypot(e.nx,e.ny,e.nz));const cam=E.map(e=>Math.abs(e.camber)).sort((a,b)=>a-b);
 let ui={};try{ui=JSON.parse(fs.readFileSync(path.join(root,r.track,'ui',r.layout,'ui_track.json'),'utf8').replace(/^\uFEFF/,''))}catch(e){}
 console.log(i,'n',n,'n2ok',n2===n,'len',L.toFixed(0),'lastlen',P[n-1][3].toFixed(0),'close',close.toFixed(1),'uiLen',ui.length,'uiW',ui.width,'wMed',w[n>>1].toFixed(1),'wMin',w[0].toFixed(1),'wMax',w[n-1].toFixed(1),'nrm',Math.min(...nl).toFixed(2)+'-'+Math.max(...nl).toFixed(2),'camMax',(cam[n-1]*57.3).toFixed(1),'camP95',(cam[Math.floor(n*0.95)]*57.3).toFixed(1));
}
