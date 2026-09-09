// Power of the pre-registered test at R readers, N planted items.
// H0: each reader's found-set is a uniform random k_i-subset of the N planted items.
// H1(lambda): a fraction lambda of each reader's set is drawn from a SHARED core; the rest at random.
// STATISTIC: mean pairwise intersection. One-sided, alpha = 0.05, permutation null.
function rnd(n,k){const a=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return new Set(a.slice(0,k));}
function meanPair(sets){let s=0,c=0;for(let i=0;i<sets.length;i++)for(let j=i+1;j<sets.length;j++){let x=0;for(const v of sets[i])if(sets[j].has(v))x++;s+=x;c++;}return c?s/c:0;}
function drawH1(n,k,lam){const core=Math.round(lam*k);const c=new Set([...Array(core).keys()]);
  const rest=[...Array(n).keys()].filter(v=>!c.has(v));for(let i=rest.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[rest[i],rest[j]]=[rest[j],rest[i]];}
  return new Set([...c,...rest.slice(0,k-core)]);}
function power(N,R,k,lam,B=4000,P=800){
  let rej=0;
  for(let b=0;b<B;b++){
    const obs=[];for(let r=0;r<R;r++)obs.push(lam>0?drawH1(N,k,lam):rnd(N,k));
    const t=meanPair(obs);
    let ge=0;for(let p=0;p<P;p++){const nl=[];for(let r=0;r<R;r++)nl.push(rnd(N,k));if(meanPair(nl)>=t)ge++;}
    if((ge+1)/(P+1)<=0.05)rej++;
  }
  return rej/B;
}
const N=24;
console.log('N=24, alpha=0.05, one-sided permutation null. POWER:');
console.log('  k = set size (planted items found by that reader)');
console.log('');
console.log('  R  k    lambda=1.00 (total)   lambda=0.50 (half)');
for(const R of [3,2]) for(const k of [6,10,14]){
  const a=power(N,R,k,1.0,1500,400), b=power(N,R,k,0.5,1500,400);
  console.log('  '+R+'  '+String(k).padEnd(4)+' '+a.toFixed(3).padEnd(21)+' '+b.toFixed(3));
}
