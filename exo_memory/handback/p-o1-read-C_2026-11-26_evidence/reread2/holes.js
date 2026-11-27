// holes.js <tree>: the drag range's low end (panel.js firstHold, replicated over the core's secondMinM at an end) for change 1 from mark s, and every metre p from it to the
// piece's end where change 1 (from s, ending at p) does NOT hold by the core's own spanHolds: places the range offers that the fit check calls short. Synthetic only.
const path=require('path'),ROOT=path.resolve(process.argv[2]),X=require(path.join(ROOT,'src/core/extend.js')),R=x=>(x*Math.PI/180)/100;
const up2=x=>Math.ceil(x*100-1e-9)/100;
function firstHold(minAt,s,L){const ok=p=>p-s>=minAt(p)-1e-6,p0=up2(s+minAt(L));if(ok(p0))return p0;let p=p0;for(let i=0;i<80&&!ok(p);i++)p=up2(p+5);if(!ok(p))return Infinity;while(up2(p-1)>p0&&ok(up2(p-1)))p=up2(p-1);return p}
let total=0,withHoles=0;
for(const ch of ['kh','kv'])for(const [first,t1] of [[-80,-95],[-80,-100],[-80,-90],[-60,-75],[50,65]])for(const s of [20,40,60,80,100,120,140]){
 const base={step:R(first),length:300},a=R(first),b=R(t1),minAt=e=>X.secondMinM(ch,a,b,base,e),lo=firstHold(minAt,s,300);total++;
 if(!Number.isFinite(lo)){console.log(ch,first,t1,'from',s,'no reach');continue}
 const holes=[];for(let p=Math.ceil(lo);p<=299;p++)if(!X.spanHolds(ch,a,b,base,p-s,p))holes.push(p);
 if(holes.length){withHoles++;console.log(ch,first,'->',t1,'from',s,'range low end',lo,'; does not hold at',holes.length,'metres:',holes.slice(0,6).join(','),holes.length>6?'...'+holes.at(-1):'')}}
console.log(path.basename(ROOT),'setups',total,'with places in the range that do not hold',withHoles);
