'use strict';
// panelsweep.js <tree>: the panel's default marks (extendOptions, every mark blank, or the last typed) through the core shell's secondMinM, as the app passes it, then extend.
// Turn and climb over a moving first ramp: 2 and 3 changes, pieces of 300 and 500 m; bank and width as controls. Reports laid / refused (placed then refused) / marks invalid,
// the built peak ÷ the bar of the laid turn and climb roads, and extendOptions' time. One JSON line per case. Synthetic only.
const path=require('path'),ROOT=path.resolve(process.argv[2]);
const {extendOptions}=require(path.join(ROOT,'app/core/panel.js')),{createCoreShell}=require(path.join(ROOT,'app/core/coreshell.js'));
const EX=require(path.join(ROOT,'src/core/extend.js')),D=require(path.join(ROOT,'src/core/document.js')),A=require(path.join(ROOT,'src/core/adapter.js'));
const BAR=29.4/(10*170*170);
function pk(d,a,b,climb){const S=A.toPath(d).path.samples,h=Math.hypot(S[0].T[0],S[0].T[2]),hx=S[0].T[0]/h,hz=S[0].T[2]/h;let pv=null,of=0;
 const H=S.map(x=>{let v=climb?Math.atan2(x.T[1],x.T[0]*hx+x.T[2]*hz):Math.atan2(x.T[2],x.T[0]);if(pv!==null){while(v+of-pv>Math.PI)of-=2*Math.PI;while(v+of-pv<-Math.PI)of+=2*Math.PI}pv=v+of;return{s:x.s,v:v+of}});
 const at=s=>{let lo=0,hi=H.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(H[m].s<=s)lo=m;else hi=m}const f=(s-H[lo].s)/(H[hi].s-H[lo].s);return H[lo].v+f*(H[hi].v-H[lo].v)};
 let m=0;for(let s=a;s<=b;s+=0.5)m=Math.max(m,Math.abs(at(s+1)-2*at(s)+at(s-1)));return m/BAR}
(async()=>{const s=await createCoreShell({brushFn:null,autosaveMs:0});const rows=[];
 const cases=[];
 for(const kind of ['turn','climb'])for(const first of [-80,-60,50])for(const L of [300,500])for(const seq of [[-15,5],[-20,10],[-10,-5],[20,-10],[-15,5,-5],[-10,-10,10]]){
   const sg=Math.sign(first);const ts=[];let v=first;for(const dlt of seq){v+=dlt*sg;ts.push(v)}cases.push({kind,first,L,ts,typed:null});
   cases.push({kind,first,L,ts,typed:Math.round(L*0.8)})}
 for(const kind of ['bank'])for(const first of [30,-20])for(const L of [300,500])for(const seq of [[15,-5],[-10,20],[10,10,-10]]){let v=first;const ts=seq.map(d=>(v+=d));cases.push({kind,first,L,ts,typed:null});cases.push({kind,first,L,ts,typed:Math.round(L*0.8)})}
 for(const c of cases){const ch={turn:'kh',climb:'kv',bank:'phi'}[c.kind];
  const changes={[c.kind]:c.ts.map((t,k)=>({then:String(t),from:(c.typed!==null&&k===c.ts.length-1)?String(c.typed):''}))};
  const t0=process.hrtime.bigint();let o,err=null;
  try{o=extendOptions({length:c.L,turn:'',climb:'',width:'',cup:'',turnAs:'rate',[c.kind]:String(c.first),head:{kh:0,kv:0,phi:0},changes,secondMinM:s.secondMinM})}catch(e){err='options: '+e.message.slice(0,120)}
  const ms=Number(process.hrtime.bigint()-t0)/1e6;
  if(err){rows.push({...c,res:'options-error',err,ms});continue}
  const marks=(o.changes[ch]||[]).map(x=>x.from),valid=marks.length===c.ts.length&&marks.every((m,k)=>Number.isFinite(m)&&m>0&&m<c.L&&(k===0||m>marks[k-1]));
  const d0=EX.extend(D.createDoc('g'),{length:200,targets:{[ch]:0}});let res,p=null;
  try{const d=EX.extend(d0,o);res='laid';if(ch!=='phi')p=+pk(d,180,200+c.L+20,ch==='kv').toFixed(3)}catch(e){res=valid?'placed-then-refused':'invalid-marks';err=e.message.replace(/^BAD_\w+: /,'').slice(0,140)}
  rows.push({...c,marks,res,p,ms:+ms.toFixed(1),err})}
 for(const r of rows)console.log(JSON.stringify(r))})().catch(e=>{console.error('FAIL',e);process.exit(1)});
