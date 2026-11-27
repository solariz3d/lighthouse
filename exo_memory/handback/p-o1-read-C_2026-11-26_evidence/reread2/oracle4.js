'use strict';
// oracle4.js <tree>: exists.js's grid search (5 m, 3 changes) for the four span-hole cases wide.js found at 0eb3448; a mark set it finds is confirmed by extend. Synthetic only.
const path=require('path'),ROOT=path.resolve(process.argv[2]),X=require(path.join(ROOT,'src/core/extend.js')),D=require(path.join(ROOT,'src/core/document.js'));const R=x=>(x*Math.PI/180)/100;
for(const ch of ['kh','kv'])for(const sg of [-1,1]){const first=80*sg,L=250,ts=[90,100,110].map(x=>x*sg),vals=[first,...ts].map(R),base={step:R(first),length:L};
 const holds=(k,from,end)=>X.spanHolds(ch,vals[k],vals[k+1],base,end-from,end);let found=null;
 for(let m3=10;m3<L&&!found;m3+=5){if(!holds(2,m3,L))continue;for(let m2=5;m2<m3&&!found;m2+=5){if(!holds(1,m2,m3))continue;for(let m1=1;m1<m2&&!found;m1+=1)if(holds(0,m1,m2))found=[m1,m2,m3]}}
 let ok='none found';if(found){try{X.extend(X.extend(D.createDoc('g'),{length:200,targets:{[ch]:0}}),{length:L,targets:{[ch]:R(first)},changes:{[ch]:ts.map((t,k)=>({from:found[k],target:R(t)}))}});ok='LAYS'}catch(e){ok='refused: '+e.message.slice(0,80)}}
 console.log(`${ch} ${first} → ${ts.join(' → ')} on ${L} m: oracle ${found?found.join('/'):'-'} ${ok}`)}
