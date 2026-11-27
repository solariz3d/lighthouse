// dragcost.js <tree>: a drag of the second mark with the first left blank, emulated as the options builds a drag makes: extendOptions with the second mark typed at
// 274, 273, ... 200 (one build per 1 m move, cold memo each new end). Per-move ms: median, p95, max. Synthetic only.
const path=require('path'),ROOT=path.resolve(process.argv[2]),{extendOptions}=require(path.join(ROOT,'app/core/panel.js')),{createCoreShell}=require(path.join(ROOT,'app/core/coreshell.js'));
(async()=>{const s=await createCoreShell({brushFn:null,autosaveMs:0});
for(const [kind,t1] of [['turn',-95],['turn',-100],['climb',-95]]){const ms=[];let asks=0;const mm=(c,a,b,base,end)=>{asks++;return s.secondMinM(c,a,b,base,end)};
 for(let p=274;p>=200;p-=1){const t0=process.hrtime.bigint();extendOptions({length:300,turn:'',climb:'',width:'',cup:'',turnAs:'rate',[kind]:'-80',head:{kh:0,kv:0},changes:{[kind]:[{then:String(t1),from:''},{then:'-90',from:String(p)}]},secondMinM:mm});ms.push(Number(process.hrtime.bigint()-t0)/1e6)}
 const q=[...ms].sort((a,b)=>a-b);console.log(path.basename(ROOT),kind,'-80 ->',t1,'then -90, second mark dragged 274 -> 200 by 1 m:',ms.length,'moves; per move median',q[q.length>>1].toFixed(1),'p95',q[Math.floor(q.length*0.95)].toFixed(1),'max',q.at(-1).toFixed(1),'ms; asks',asks)}})();
