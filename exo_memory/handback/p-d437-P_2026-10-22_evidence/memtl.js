const fs=require("fs");
for (const [f,pid] of [["chrome/p437-b6969da-renderer-mem.log","32804"],["chrome/p437-6261a22-renderer-mem.log","34836"]]) {
  const L=fs.readFileSync(f,"utf8").split(/\r?\n/).filter(Boolean);
  let lastSeen=null, firstWithout=null, n=0;
  const re=new RegExp("pid "+pid+" ws (\d+) private (\d+)");
  const samples=[];
  for (let i=0;i<L.length;i++){ const m=L[i].match(re); if(m){ lastSeen=L[i].slice(0,12); n++; samples.push([L[i].slice(0,12),+m[2],+m[1]]); } else if(lastSeen&&!firstWithout){ firstWithout=L[i].slice(0,12); } }
  console.log(f,"pid",pid,"samples",n,"last seen",lastSeen,"first line without it",firstWithout,"log ends",L[L.length-1].slice(0,12));
  const step=Math.max(1,Math.floor(samples.length/30));
  for (let i=0;i<samples.length;i+=step) console.log("   ",samples[i][0],"private",(samples[i][1]/1048576).toFixed(0),"ws",(samples[i][2]/1048576).toFixed(0),"MB");
  console.log("   last 8:"); for (const s of samples.slice(-8)) console.log("   ",s[0],"private",(s[1]/1048576).toFixed(0),"ws",(s[2]/1048576).toFixed(0),"MB");
}
