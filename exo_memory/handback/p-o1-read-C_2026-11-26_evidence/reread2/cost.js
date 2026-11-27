// cost.js <tree>: extendOptions' cost for blank marks, cold then warm, counting the shell's secondMinM asks and their distinct ends. Synthetic only.
const path=require('path'),ROOT=path.resolve(process.argv[2]),{extendOptions}=require(path.join(ROOT,'app/core/panel.js')),{createCoreShell}=require(path.join(ROOT,'app/core/coreshell.js'));
(async()=>{const s=await createCoreShell({brushFn:null,autosaveMs:0});
for(const [kind,first,ts] of [['turn',-80,[-100,-90]],['turn',-80,[-95,-90]],['turn',-80,[-100,-90,-95]],['climb',-80,[-100,-90]]])for(const pass of ['cold','warm']){
 let n=0;const ends=new Set();const mm=(c,a,b,base,end)=>{n++;ends.add(end);return s.secondMinM(c,a,b,base,end)};const t0=process.hrtime.bigint();
 const o=extendOptions({length:300,turn:'',climb:'',width:'',cup:'',turnAs:'rate',[kind]:String(first),head:{kh:0,kv:0},changes:{[kind]:ts.map(t=>({then:String(t),from:''}))},secondMinM:mm});
 console.log(path.basename(ROOT),kind,first,JSON.stringify(ts),pass,(Number(process.hrtime.bigint()-t0)/1e6).toFixed(1),'ms; asks',n,'distinct ends',ends.size,'marks',JSON.stringify(o.changes[kind==='turn'?'kh':'kv'].map(x=>x.from)))}})();
