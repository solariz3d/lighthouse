'use strict';
// D434 build (O): the bank's rate cap (BANK_ROLL, read from D434_ROLL by the tree's finish.js for this sweep only), swept. For each cap and each lap (TEST TRACK 10,
// TEST 10, the gentle closer): the plan, the share closeBanked ended on (the backstop), the closer's mean lean and stations leaning out, its peak side load, and its
// worst roll against the amber. One process per run.   node rollcap-sweep.js <tree>
const TREE = process.argv[2], { spawnSync } = require('child_process'), path = require('path');
const probe = `
const fs=require('fs'),path=require('path'),Module=require('module');const T=process.argv[1],lap=process.argv[2];const file=path.join(T,'src/core/finish.js');const m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));
let src=fs.readFileSync(file,'utf8');src=src.replace('    if (peak <= Math.max(ROLL_AMBER_DEG_M, flatPeak + 1e-6)) return res;','    if (peak <= Math.max(ROLL_AMBER_DEG_M, flatPeak + 1e-6)) { if (uprightSet.size) globalThis.__share = share; return res; }');
m._compile(src,file);const F=m.exports;const D=require(path.join(T,'src/core/document.js')),AD=require(path.join(T,'src/core/adapter.js')),V=require(path.join(T,'src/validate/index.js')),{MACH6,G}=require(path.join(T,'src/validate/limits.js'));
const {extend}=require(path.join(T,'src/core/extend.js')),{extendTurnBy}=require(path.join(T,'src/core/turnby.js'));
let open; if(lap==='gentle'){open=D.createDoc('g');open=extend(open,{length:1000,family:'bowl'});open=extendTurnBy(open,{length:Math.round(Math.PI*2000),targets:{kv:0}},Math.PI);} else open=D.parse(fs.readFileSync(path.join(T,'fixtures-d431',lap+'-open.t180track'),'utf8'));
const r=F.finishToStart(open),n0=open.pieces.length,v=MACH6.designSpeedKmh/3.6,{segments,path:p}=AD.toPath(r.doc,{step:2}),ids=new Set(r.doc.pieces.slice(n0).map(P=>P.id));
let n=0,lean=0,out=0,lat=0;for(const q of p.samples){if(!ids.has(segments[q.seg].id))continue;const k=q.kvec,km=Math.hypot(...k);if(km<1/600)continue;const l=Math.asin(Math.max(-1,Math.min(1,(q.U[0]*k[0]+q.U[1]*k[1]+q.U[2]*k[2])/km)))*180/Math.PI,f=[v*v*k[0],v*v*k[1]+G,v*v*k[2]];n++;lean+=l;if(l<-5)out++;lat=Math.max(lat,Math.abs((f[0]*q.L[0]+f[1]*q.L[1]+f[2]*q.L[2])/G));}
const roll=V._internal.rollRates(p.samples,(i)=>segments[p.samples[i].seg].kind!=='gap',true,p.lengthM).filter(q=>ids.has(segments[p.samples[q.i].seg].id)).reduce((a,q)=>Math.max(a,q.rate),0);
console.log(JSON.stringify({lap,shareUsed:globalThis.__share===undefined?'none (flat)':+globalThis.__share.toFixed(3),plan:r.plan.report.slice(0,48),meanLean:+(lean/n).toFixed(1),out,maxLatG:+lat.toFixed(2),worstRoll:+roll.toFixed(3),amber:V.ROLL_AMBER_DEG_M}));`;
for (const cap of (process.env.CAPS || '0.9,0.7,0.6,0.5').split(',')) for (const lap of ['testtrack10', 'test10', 'gentle']) {
  const r = spawnSync(process.execPath, ['-e', probe, TREE, lap], { env: { ...process.env, D434_ROLL: cap }, encoding: 'utf8' });
  console.log(`cap ${cap} ${(r.stdout || '').trim() || (r.stderr || '').trim().slice(-300)}`);
}
