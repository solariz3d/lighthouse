const path=require('path'), fs=require('fs');
const T=process.argv[2], F=process.argv[3];
const D=require(path.join(T,'src/core/document.js')), R=require(path.join(T,'src/core/readout.js'));
const doc=D.parse(fs.readFileSync(F,'utf8'));
const RR=R.pieceReadouts(doc); const rs=RR.reads; console.log(JSON.stringify(RR.poses[0]).slice(0,300));
let s=0;
rs.forEach((r,i)=>{const p=doc.pieces[i]; const o=r.offsets; console.log(String(i+1).padStart(2), r.id.padEnd(4), (r.lengthM|0).toString().padStart(5), 's0='+(s|0), 'turn',(+r.turnDeg).toFixed(1),'climb',(+r.climbDeg).toFixed(2),'pitch',(+r.pitchFromDeg).toFixed(2),'->',(+r.pitchToDeg).toFixed(2),'bank',(+r.bankFromDeg).toFixed(0),'->',(+r.bankToDeg).toFixed(0), o?('OFFSETS climb '+o.climbDeg.toFixed(2)+' pitch '+o.pitchFromDeg.toFixed(2)+'->'+o.pitchToDeg.toFixed(2)):'', p.channels.h&&p.channels.h.some(v=>v)?'h:'+Math.min(...p.channels.h).toFixed(2)+'..'+Math.max(...p.channels.h).toFixed(2):'', p.channels.l&&p.channels.l.some(v=>v)?'l!':''); s+=r.lengthM;});
console.log('total',s|0,'pieces',rs.length);
