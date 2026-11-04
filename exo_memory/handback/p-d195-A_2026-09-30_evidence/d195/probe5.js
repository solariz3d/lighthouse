const fs=require('fs'),os=require('os'),path=require('path');
function dev(T){const D=require(T+'src/core/document.js'),{extend,startRampM}=require(T+'src/core/extend.js');const out=[];
 for(const [L,w0,w1] of [[100,31,12],[45,31,12],[200,12,31],[60,20,8]]){let d=extend(D.createDoc('l'),{length:100,family:'bowl',first:{w:w0}});d=extend(d,{length:L,transition:{w:'start'},targets:{w:w1}});const P=d.pieces[1],R=startRampM(L),Rc=R/2;
  let m=0;for(let s=0;s<=L;s+=0.1){const u=Math.min(1,s/Rc),S=u*u*(3-2*u),ideal=(1-S)*w0+S*w1;m=Math.max(m,Math.abs(D.channelAt(P,'w',s).v-ideal));}
  out.push(`L ${L} ${w0}->${w1}: max |curve - Bloss(R/2)| = ${m.toFixed(3)} (${(100*m/Math.abs(w1-w0)).toFixed(1)}% of the change)`);}
 return out.join('\n');}
console.log('current:\n'+dev('C:/Users/nname/Desktop/a-d195-wt/'));
// mutant R7 in a temp copy
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'r7-'));fs.cpSync('C:/Users/nname/Desktop/a-d195-wt/src',tmp+'/src',{recursive:true});fs.cpSync('C:/Users/nname/Desktop/a-d195-wt/tools',tmp+'/tools',{recursive:true});
const f=tmp+'/src/core/extend.js';let s=fs.readFileSync(f,'utf8');s=s.replace('const xi = (U[i + 1] + U[i + 2] + U[i + 3]) / 3','const xi = (U[i] + U[i + 1] + U[i + 2]) / 3');fs.writeFileSync(f,s);
console.log('R7 mutant:\n'+dev(tmp.split(path.sep).join('/')+'/'));fs.rmSync(tmp,{recursive:true,force:true});
