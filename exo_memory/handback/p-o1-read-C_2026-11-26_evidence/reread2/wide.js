'use strict';
// wide.js <tree>: the panel's blank marks (extendOptions through the real shell's secondMinM, every mark blank) laid by extend after a 200 m straight, over a wide grid:
// turn and climb; first ramps ±30, ±60, ±80; pieces 200 to 500 m by 25; seven delta sequences times the first's sign. Counts laid, refused, and of the refused how many
// are a change "laid over the bar" (placed where its span does not hold) against "needs at least" (a mark short of a change's shortest). Synthetic only.
const path=require('path'),ROOT=path.resolve(process.argv[2]),X=require(path.join(ROOT,'src/core/extend.js')),D=require(path.join(ROOT,'src/core/document.js'));
const {extendOptions}=require(path.join(ROOT,'app/core/panel.js')),{createCoreShell}=require(path.join(ROOT,'app/core/coreshell.js'));const R=x=>(x*Math.PI/180)/100;
(async()=>{const s=await createCoreShell({brushFn:null,autosaveMs:0}),c={n:0,laid:0,over:0,short:0,other:0},ex=[];
for(const ch of ['kh','kv'])for(const first of [-80,-60,-30,30,60,80])for(let L=200;L<=500;L+=25)for(const seq of [[-15,5],[-25,10],[-30,-10],[25,-15],[20,20],[10,10,10],[-15,5,-5]]){
 const sg=Math.sign(first);let v=first;const ts=seq.map(d=>(v+=d*sg)),kind=ch==='kh'?'turn':'climb';c.n++;
 let marks;try{const o=extendOptions({length:L,turn:'',climb:'',width:'',cup:'',turnAs:'rate',[kind]:String(first),head:{kh:0,kv:0},changes:{[kind]:ts.map(t=>({then:String(t),from:''}))},secondMinM:s.secondMinM});marks=o.changes[ch].map(x=>x.from)}catch(e){c.other++;ex.push({ch,first,L,ts,why:'options: '+e.message.slice(0,90)});continue}
 try{X.extend(X.extend(D.createDoc('g'),{length:200,targets:{[ch]:0}}),{length:L,targets:{[ch]:R(first)},changes:{[ch]:ts.map((t,k)=>({from:marks[k],target:R(t)}))}});c.laid++}
 catch(e){const m=e.message;if(/over the bar/.test(m)){c.over++;ex.push({ch,first,L,ts,marks,why:m.replace(/^BAD_\w+: /,'').slice(0,110)})}else if(/needs at least/.test(m)){c.short++;ex.push({ch,first,L,ts,marks,why:m.replace(/^BAD_w+: /,"").slice(0,110)})}else{c.other++;ex.push({ch,first,L,ts,marks,why:m.slice(0,110)})}}}
console.log('SUMMARY',JSON.stringify(c));for(const e of ex)console.log('PLACED-THEN-REFUSED',JSON.stringify(e))})().catch(e=>{console.error('FAIL',e);process.exit(1)});
