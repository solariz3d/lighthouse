'use strict';
// spanmono.js <tree>: does the LAST change hold at every span from its shortest up, ending at the piece's end? (spanHolds, end L). Synthetic only.
const path=require('path'),ROOT=path.resolve(process.argv[2]),X=require(path.join(ROOT,'src/core/extend.js'));const R=x=>(x*Math.PI/180)/100;
for(const [first,L,a,b] of [[50,250,70,90],[50,250,40,50],[-80,300,-95,-90],[-80,300,-100,-90]]){const base={step:R(first),length:L},mn=X.secondMinM('kh',R(a),R(b),base,L);
 const fails=[];for(let sp=Math.ceil(mn);sp<=L-5;sp++)if(!X.spanHolds('kh',R(a),R(b),base,sp,L))fails.push(sp);
 const runs=[];for(const f of fails){const r=runs[runs.length-1];if(r&&r[1]===f-1)r[1]=f;else runs.push([f,f])}
 console.log(`kh first ${first}, last change ${a} → ${b}, piece ${L}: shortest ${mn.toFixed(1)}; spans from it to ${L-5} that do NOT hold: ${fails.length}${runs.length?' ('+runs.map(r=>r[0]===r[1]?r[0]:r[0]+'-'+r[1]).join(', ')+')':''}`)}
