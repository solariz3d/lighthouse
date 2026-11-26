'use strict';
// bank_sweep.js <tree>: E's bank_probe.cjs measure (built bank, adapter bankPlan, |r(s+2) − 2r(s) + r(s−2)|/4, peak ÷ ROUTE_BAR), swept: a bank change FOLLOWED BY ANOTHER on a
// moving first ramp (0 → first over the whole 300 m piece). Counts laid roads over 1.05 × the bar and over the ramp alone. Synthetic only.
const path=require('path'),T=path.resolve(process.argv[2]),D=require(path.join(T,'src/core/document.js')),X=require(path.join(T,'src/core/extend.js')),A=require(path.join(T,'src/core/adapter.js'));
const DEG=Math.PI/180,BAR=29.4/(10*170*170);
function peak(d,a){const plan=A.bankPlan(d),ends=[0,200,500];const r=s=>{const i=s<ends[1]?0:1,t=Math.min(d.pieces[i].length,Math.max(0,s-ends[i]));return plan[i].fn?plan[i].fn(t):D.channelValue(d.pieces[i],'phi',t)};
 let m=0,at=0;for(let s=a;s<=498;s+=0.5){const v=Math.abs(r(s+2)-2*r(s)+r(s-2))/4;if(v>m){m=v;at=s-200}}return[m/BAR,at]}
const d0=X.extend(D.createDoc('g'),{length:200,targets:{phi:0}});let n=0,laid=0,over=[],worst=null;
for(const first of [20,30,45,60,-30])for(const [d1,d2] of [[15,-5],[25,-10],[15,5],[-10,5],[10,-10]])for(const F2 of [200,240])for(let F1=10;F1<F2;F1+=10){
 const t1=first+d1,t2=t1+d2;n++;let d;
 try{d=X.extend(d0,{length:300,targets:{phi:first*DEG},changes:{phi:[{from:F1,target:t1*DEG},{from:F2,target:t2*DEG}]}})}catch(e){continue}
 laid++;const [p,at]=peak(d,200+F1-20);const alone=peak(X.extend(d0,{length:300,targets:{phi:first*DEG}}),200+F1-20)[0];
 const row={first,t1,t2,F1,F2,p:+p.toFixed(3),at,alone:+alone.toFixed(3)};if(!worst||p>worst.p)worst=row;if(p>1.05&&p>alone+0.01)over.push(row)}
const inC1=over.filter(o=>o.at<o.F2);console.log(path.basename(T),'of those, peak inside change 1 (before change 2 mark):',inC1.length);inC1.sort((a,b)=>b.p-a.p).slice(0,6).forEach(o=>console.log('  c1',JSON.stringify(o)));console.log(path.basename(T),'bank cases',n,'laid',laid,'laid over 1.05 (and over the ramp alone)',over.length,'worst laid',JSON.stringify(worst));over.sort((a,b)=>b.p-a.p).slice(0,8).forEach(o=>console.log(' ',JSON.stringify(o)));
