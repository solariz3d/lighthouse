'use strict';
// missed.js <tree>: for the two cases exists.js found missed at 0eb3448, print the first change's shortest as a function of where it ends, the last change's shortest
// at the piece's end, and where change 1 first holds from the panel's first mark and from the oracle's. Synthetic only.
const path=require('path'),ROOT=path.resolve(process.argv[2]),X=require(path.join(ROOT,'src/core/extend.js'));const R=x=>(x*Math.PI/180)/100;
for(const [first,L,ts,pm,om] of [[50,250,[70,90],[19,135],[1,104]],[50,250,[30,40,50],[31,134,194.5],[2,105,175]]]){const base={step:R(first),length:L},v=[first,...ts].map(R),n=ts.length;
 console.log(`\nkh ${first} → ${ts.join(' → ')} on ${L} m; panel ${pm}, oracle ${om}`);
 const last=X.secondMinM('kh',v[n-1],v[n],base,L);console.log(`  last change's shortest ending at ${L}: ${last.toFixed(1)} m, so its mark must be at most ${(L-last).toFixed(1)}`);
 const k=n-2,row=[];for(let e=60;e<=L;e+=10)row.push(`${e}:${X.secondMinM('kh',v[k],v[k+1],base,e).toFixed(1)}`);console.log(`  change ${k+1}'s shortest by where it ends  ${row.join(' ')}`);
 const s1=pm[k],s2=om[k];for(const [lab,s] of [['panel',s1],['oracle',s2]]){let p=null;for(let e=Math.ceil(s)+1;e<=L;e++)if(X.spanHolds('kh',v[k],v[k+1],base,e-s,e)){p=e;break}console.log(`  change ${k+1} from ${s} (${lab}) first holds ending at ${p}`)}}
