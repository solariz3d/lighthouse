'use strict';
// exists.js <tree>: does the panel's default placement (extendOptions, all marks blank) lay whenever SOME placement lays? The oracle searches the marks on a grid with the
// core's own predicates (what extend refuses by): the last change holds to the piece's end (spanHolds, end L); each earlier change from its mark holds to the next mark
// (spanHolds, end = that mark); the first mark > 0. A candidate it finds is then confirmed by extend itself. Grid 1 m for 2 changes, 5 m for 3. Synthetic only.
const path=require('path'),ROOT=path.resolve(process.argv[2]),X=require(path.join(ROOT,'src/core/extend.js')),D=require(path.join(ROOT,'src/core/document.js'));
const {extendOptions}=require(path.join(ROOT,'app/core/panel.js')),{createCoreShell}=require(path.join(ROOT,'app/core/coreshell.js'));
const R=x=>(x*Math.PI/180)/100;
(async()=>{const s=await createCoreShell({brushFn:null,autosaveMs:0});const out={n:0,exists:0,panelLaid:0,missed:[],panelLaidNoOracle:[],oracleNotConfirmed:[]};
const lay=(ch,first,L,ts,marks)=>{try{X.extend(X.extend(D.createDoc('g'),{length:200,targets:{[ch]:0}}),{length:L,targets:{[ch]:R(first)},changes:{[ch]:ts.map((t,k)=>({from:marks[k],target:R(t)}))}});return true}catch(e){return e.message.replace(/^BAD_\w+: /,'').slice(0,120)}};
const cases=[];
for(const ch of ['kh','kv'])for(const first of [-80,-60,50])for(const L of [200,250,300])for(const seq of (ch==='kh'?[[-15,5],[-25,10],[-30,-10],[25,-15],[20,20],[-15,5,-5],[-20,10,10]]:[[-15,5],[-25,10],[-15,5,-5]])){const sg=Math.sign(first);let v=first;cases.push({ch,first,L,ts:seq.map(d=>(v+=d*sg))})}
for(const c of cases){const {ch,first,L,ts}=c,base={step:R(first),length:L},n=ts.length,vals=[first,...ts].map(R);out.n++;
 const holds=(k,from,end)=>X.spanHolds(ch,vals[k],vals[k+1],base,end-from,end);
 // oracle
 let found=null;const g=n===2?1:5;
 if(n===2){for(let m2=g;m2<L&&!found;m2+=g){if(!holds(1,m2,L))continue;const need=X.secondMinM(ch,vals[0],vals[1],base,m2),m1=+(m2-need).toFixed(2);if(m1>0&&holds(0,m1,m2))found=[m1,m2]}}
 else{for(let m3=2*g;m3<L&&!found;m3+=g){if(!holds(2,m3,L))continue;for(let m2=g;m2<m3&&!found;m2+=g){if(!holds(1,m2,m3))continue;const need=X.secondMinM(ch,vals[0],vals[1],base,m2),m1=+(m2-need).toFixed(2);if(m1>0&&holds(0,m1,m2))found=[m1,m2,m3]}}}
 let conf=null;if(found){conf=lay(ch,first,L,ts,found);if(conf!==true){out.oracleNotConfirmed.push({...c,found,why:conf});found=null}}
 if(found)out.exists++;
 const kind=ch==='kh'?'turn':'climb',o=extendOptions({length:L,turn:'',climb:'',width:'',cup:'',turnAs:'rate',[kind]:String(first),head:{kh:0,kv:0},changes:{[kind]:ts.map(t=>({then:String(t),from:''}))},secondMinM:s.secondMinM});
 const marks=o.changes[ch].map(x=>x.from),pl=lay(ch,first,L,ts,marks);if(pl===true)out.panelLaid++;
 if(found&&pl!==true)out.missed.push({...c,oracle:found,panel:marks,why:pl});
 if(!found&&pl===true)out.panelLaidNoOracle.push({...c,panel:marks});
 console.log(JSON.stringify({...c,oracle:found,panel:marks,panelRes:pl===true?'laid':pl}))}
console.log('SUMMARY',JSON.stringify({n:out.n,exists:out.exists,panelLaid:out.panelLaid,missed:out.missed.length,panelLaidNoOracle:out.panelLaidNoOracle.length,oracleNotConfirmed:out.oracleNotConfirmed.length}));
for(const m of out.missed)console.log('MISSED',JSON.stringify(m));for(const m of out.panelLaidNoOracle)console.log('PANEL-ONLY',JSON.stringify(m));for(const m of out.oracleNotConfirmed)console.log('ORACLE-UNCONFIRMED',JSON.stringify(m))})().catch(e=>{console.error('FAIL',e);process.exit(1)});
