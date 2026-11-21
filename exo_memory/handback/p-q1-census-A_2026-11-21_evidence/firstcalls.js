// prints, per transcript, the first assistant usage of the file and the first after each compaction boundary
const fs=require('fs'),rl=require('readline');
const f=process.argv[2];
(async()=>{
 const r=rl.createInterface({input:fs.createReadStream(f),crlfDelay:Infinity});
 let n=0,afterCut=true,first=true,cutAt=null,lastCut=null;
 for await(const line of r){
  n++;
  if(line.includes('"isCompactSummary":true')||line.includes('"compact_boundary"')||line.includes('"subtype":"compact')){afterCut=true;try{cutAt=JSON.parse(line).timestamp}catch{cutAt='?'}continue}
  if(afterCut&&line.includes('"type":"assistant"')&&line.includes('"usage"')){
   let o;try{o=JSON.parse(line)}catch{continue}
   const u=o.message&&o.message.usage; if(!u||o.isSidechain)continue;
   if(!(u.output_tokens>=0))continue;
   const tot=(u.input_tokens||0)+(u.cache_read_input_tokens||0)+(u.cache_creation_input_tokens||0);
   console.log(JSON.stringify({line:n,ts:o.timestamp,kind:first?'launch':'after-cut',cut:cutAt,in:u.input_tokens,cread:u.cache_read_input_tokens,ccreate:u.cache_creation_input_tokens,total:tot,model:o.message.model}));
   first=false;afterCut=false;
  }
 }
})();
