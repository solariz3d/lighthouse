const fs=require('fs'),{spawnSync}=require('child_process');
const W='consonance/hooks/model-switch-note.js',T='consonance/hooks/model-switch-note.test.js';
const M=[
 [W,"p.prompt_cache_warm !== true || ",""],
 [W,"ctx === null || ctx < min","ctx === null"],
 [W,"if (p.from_model && p.to_model && p.from_model === p.to_model) return null;",""],
 [W,"if (process.env.CONSONANCE_DREAM) process.exit(0);",""],
 [W,"setTimeout(() => process.exit(0), WATCHDOG_MS).unref();",""],
 [W,"JSON.stringify({ systemMessage: r.text })","JSON.stringify({ systemMessage: r.text, decision: 'block' })"],
 [W,"fs.appendFileSync(path.join(d, LEDGER)","0 && fs.appendFileSync(path.join(d, LEDGER)"],
 [W,"Math.round(ctx / 1000)","Math.round(ctx)"],
];
let c=0,a=0;for(const[f,x,y]of M){const o=fs.readFileSync(f,'utf8');if(o.split(x).length!==2){console.log('NOT APPLIED',x.slice(0,40));continue}a++;try{fs.writeFileSync(f,o.replace(x,()=>y));const r=spawnSync(process.execPath,['--test',T],{encoding:'utf8'});const red=r.status!==0;c+=red?1:0;console.log(red?'caught  ':'SURVIVED',x.slice(0,50))}finally{fs.writeFileSync(f,o)}}
console.log(`applied ${a} / caught ${c} / NOT APPLIED ${M.length-a}`);
