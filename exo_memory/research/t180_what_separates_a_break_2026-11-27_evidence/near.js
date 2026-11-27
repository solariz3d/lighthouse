// every mesh (any name) within r of given points: name, nearest vertex distance, count
const {readKn5}=require('C:/Users/nname/Downloads/t180-fresh/tools/kn5.cjs');const fs=require('fs'),path=require('path');
const d=process.argv[2];/* evidence copy: the [T1] track folder, with a trailing slash, is passed as the argument */if(!d)throw new Error('usage: node near.js <track folder>/');
const ini=fs.readFileSync(d+'models_night_optimized.ini','utf8');const files=[...ini.matchAll(/^FILE\s*=\s*(.+?)\s*$/gm)].map(m=>m[1]);console.log(files.join(' '));
const pts={a_64_500:[-10.3,57.5,172.5],b_64_590:[-13.3,50.9,179.3],c_64_950:[-35.4,28.8,191.5],d_65_010:[-40.6,26.7,191.9],e_65_100:[-48.4,23.6,192.4]};
const meshes=[];for(const f of files){if(!fs.existsSync(d+f)){console.log('missing',f);continue;}const k=readKn5(d+f);for(const m of k.meshes)meshes.push({f,m});}
for(const [nm,p] of Object.entries(pts)){const rows=[];for(const {f,m} of meshes){let best=1e9,c=0;for(let i=0;i<m.pos.length;i+=3){const dd=Math.hypot(m.pos[i]-p[0],m.pos[i+1]-p[1],m.pos[i+2]-p[2]);if(dd<best)best=dd;if(dd<6)c++;}if(best<6)rows.push([best.toFixed(2),f,m.name,c]);}
 rows.sort((a,b)=>a[0]-b[0]);console.log(nm,JSON.stringify(rows.slice(0,8)));}
const cnt={};for(const {f,m} of meshes){const k=f+':'+(/^\d/.test(m.name)?'PHYS ':'vis ')+m.name.replace(/\d+$/,'N');cnt[k]=(cnt[k]||0)+m.idx.length/3;}console.log(Object.entries(cnt).filter(e=>/PHYS/.test(e[0])).slice(0,40));
