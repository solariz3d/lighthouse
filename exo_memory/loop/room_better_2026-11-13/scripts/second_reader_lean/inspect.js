// Structure probe: prints counts and field NAMES only, never text.
const fs=require('fs'),rl=require('readline');
const f=process.argv[2];
const r=rl.createInterface({input:fs.createReadStream(f),crlfDelay:Infinity});
const cnt={},keys={},idle={},compactKeys={};let n=0;
r.on('line',l=>{n++;let o;try{o=JSON.parse(l)}catch(e){cnt.__bad=(cnt.__bad||0)+1;return}
 const k=(o.type||'?')+'/'+(o.subtype||'')+(o.isCompactSummary?'/isCompactSummary':'')+(o.isMeta?'/meta':'');
 cnt[k]=(cnt[k]||0)+1;
 if(o.type==='system'){keys[o.subtype||'']=Object.keys(o).sort().join(',');}
 if(o.subtype==='compact_boundary'){compactKeys.cm=Object.keys(o.compactMetadata||{}).join(',');}
 if(l.includes('ompacted while idle')){idle[k]=(idle[k]||0)+1;}
});
r.on('close',()=>{console.log(JSON.stringify({n,cnt,systemKeys:keys,compactKeys,idleNoticeCarrier:idle},null,1))});
