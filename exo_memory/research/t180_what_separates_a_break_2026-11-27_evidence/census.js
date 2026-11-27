// census.js: per-replay pass census. usage: node census.js <sha12,sha12,...> [--dump t0 t1] [--surf folder] [--stop HH:MM]
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const R=require('C:/Users/nname/Desktop/blackbox/ui/acreplay.js');
const {readKn5}=require('C:/Users/nname/Downloads/t180-fresh/tools/kn5.cjs');
const TR='G:/SteamLibrary/steamapps/common/assettocorsa/content/tracks';
const RD='C:/Users/nname/Documents/Assetto Corsa/replay';
const G=9.81, CELL=4;
const surfCache=new Map();
function loadSurface(folder,config){
  const key=folder+'|'+(config||''); if(surfCache.has(key))return surfCache.get(key); surfCache.clear();
  let ini=path.join(folder,'models.ini'); if(config&&fs.existsSync(path.join(folder,'models_'+config+'.ini')))ini=path.join(folder,'models_'+config+'.ini');
  if(!fs.existsSync(ini)){const c=fs.readdirSync(folder).filter(f=>/^models.*\.ini$/.test(f));ini=c.length?path.join(folder,c[0]):null;}
  const files=!ini?fs.readdirSync(folder).filter(f=>f.toLowerCase().endsWith('.kn5')):[...fs.readFileSync(ini,'utf8').matchAll(/^FILE\s*=\s*(.+?)\s*$/gm)].map(m=>m[1]);
  const builder=/^t180b_/.test(path.basename(folder));
  const T=[];const names=new Set();
  for(const f of files){const p=path.join(folder,f);if(!fs.existsSync(p))continue;let k;try{k=readKn5(p);}catch(e){continue;}
    for(const m of k.meshes){const ok=builder?(/^1ROAD/.test(m.name)&&!/CATCH/.test(m.name)):/^\d/.test(m.name);if(!ok)continue;names.add(m.name.replace(/[#_]?\d+$/,''));
      for(let i=0;i+2<m.idx.length;i+=3){for(const v of[m.idx[i],m.idx[i+1],m.idx[i+2]])T.push(m.pos[v*3],m.pos[v*3+1],m.pos[v*3+2]);}}}
  const tri=new Float64Array(T);const n=tri.length/9;const grid=new Map();
  for(let t=0;t<n;t++){const o=t*9;let lo=[1e9,1e9,1e9],hi=[-1e9,-1e9,-1e9];for(let v=0;v<3;v++)for(let a=0;a<3;a++){const x=tri[o+v*3+a];if(x<lo[a])lo[a]=x;if(x>hi[a])hi[a]=x;}
    const a0=Math.floor(lo[0]/CELL),a1=Math.floor(hi[0]/CELL),b0=Math.floor(lo[1]/CELL),b1=Math.floor(hi[1]/CELL),c0=Math.floor(lo[2]/CELL),c1=Math.floor(hi[2]/CELL);
    if((a1-a0+1)*(b1-b0+1)*(c1-c0+1)>4000)continue; // absurdly large triangle (ground plane): skipped
    for(let a=a0;a<=a1;a++)for(let b=b0;b<=b1;b++)for(let c=c0;c<=c1;c++){const k=a+','+b+','+c;let l=grid.get(k);if(!l){l=[];grid.set(k,l);}l.push(t);}}
  const s={tri,n,grid,stamp:new Int32Array(n),tick:0,names:[...names].slice(0,12),folder};surfCache.set(key,s);return s;
}
// ray through p along dir, heights searched in [-reach,+reach]. Returns the hit nearest p:
// {h along dir, d perpendicular distance to the hit triangle's plane (+ = p on the dir side), n triangle normal turned to dir, q the hit}
function probe(S,p,dir,reach){
  S.tick++;const ox=p[0]+dir[0]*reach,oy=p[1]+dir[1]*reach,oz=p[2]+dir[2]*reach;const L=2*reach;let best=null;
  let lastk='';
  for(let s=0;s<=L+0.01;s+=1){const x=ox-dir[0]*s,y=oy-dir[1]*s,z=oz-dir[2]*s;const k=Math.floor(x/CELL)+','+Math.floor(y/CELL)+','+Math.floor(z/CELL);if(k===lastk)continue;lastk=k;const l=S.grid.get(k);if(!l)continue;
    for(const t of l){if(S.stamp[t]===S.tick)continue;S.stamp[t]=S.tick;const o=t*9,tr=S.tri;
      const e1x=tr[o+3]-tr[o],e1y=tr[o+4]-tr[o+1],e1z=tr[o+5]-tr[o+2],e2x=tr[o+6]-tr[o],e2y=tr[o+7]-tr[o+1],e2z=tr[o+8]-tr[o+2];
      const dx=-dir[0],dy=-dir[1],dz=-dir[2];
      const px=dy*e2z-dz*e2y,py=dz*e2x-dx*e2z,pz=dx*e2y-dy*e2x;const det=e1x*px+e1y*py+e1z*pz;if(Math.abs(det)<1e-12)continue;const inv=1/det;
      const tx=ox-tr[o],ty=oy-tr[o+1],tz=oz-tr[o+2];const u=(tx*px+ty*py+tz*pz)*inv;if(u<-1e-6||u>1+1e-6)continue;
      const qx=ty*e1z-tz*e1y,qy=tz*e1x-tx*e1z,qz=tx*e1y-ty*e1x;const v=(dx*qx+dy*qy+dz*qz)*inv;if(v<-1e-6||u+v>1+1e-6)continue;
      const tt=(e2x*qx+e2y*qy+e2z*qz)*inv;if(tt<0||tt>L)continue;const h=tt-reach;
      if(!best||Math.abs(h)<Math.abs(best.h)){let nx=e1y*e2z-e1z*e2y,ny=e1z*e2x-e1x*e2z,nz=e1x*e2y-e1y*e2x;const nl=Math.hypot(nx,ny,nz);nx/=nl;ny/=nl;nz/=nl;let c=nx*dir[0]+ny*dir[1]+nz*dir[2];const raw=c<0?-1:1;if(S.wsign&&raw!==S.wsign)continue;if(c<0){nx=-nx;ny=-ny;nz=-nz;c=-c;}
        best={raw,h,d:h*c,n:[nx,ny,nz],q:[p[0]-dir[0]*h,p[1]-dir[1]*h,p[2]-dir[2]*h]};}}}
  return best;
}
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],mul=(a,k)=>[a[0]*k,a[1]*k,a[2]*k],add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const norm=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l];};
function tag(track){if(/^t180b_/.test(track))return track;if(crypto.createHash('sha256').update(track.split('_')[0]).digest('hex').slice(0,12)==='69e4689d488c')return'[T1]';/* evidence copy: the name test is by hash, so the name is not written here */return'[other-'+crypto.createHash('sha256').update(track).digest('hex').slice(0,6)+']';}
function cfmOf(folder){try{const t=fs.readFileSync(path.join(folder,'data','surfaces.ini'),'utf8');const m=t.match(/^SOFT_CFM\s*=\s*([0-9.eE+-]+)/m);return m?m[1]:'';}catch(e){return'';}}
function section(S,q0,n0,T,maxW){ // walk the surface sideways from q0 both ways in 1 m steps, bisecting the last step
  const res={};
  for(const sg of[1,-1]){let q=q0,n=n0,dist=0,edge=null;
    for(let k=0;k<maxW;k++){let lat=norm(cross(n,T));lat=mul(lat,sg);const cand=add(q,lat);const h=probe(S,cand,n,1.5);
      if(h){q=h.q;n=h.n;dist+=1;continue;}
      let lo=0,hi=1,ql=q;for(let b=0;b<4;b++){const mid=(lo+hi)/2;const hm=probe(S,add(q,mul(lat,mid)),n,1.5);if(hm){lo=mid;ql=hm.q;}else hi=mid;}
      dist+=lo;edge=ql;break;}
    const open=!!edge;if(!edge)edge=q; if(sg>0){res.dPlus=dist;res.ePlus=edge;res.openPlus=open;}else{res.dMinus=dist;res.eMinus=edge;res.openMinus=open;}}
  return res;
}
function runReplay(file,opts){
  const b=fs.readFileSync(file);const sha=crypto.createHash('sha256').update(b).digest('hex');const id=sha.slice(0,12);
  const rp=R.parseReplay(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));const ex=R.extractCar(rp,0);
  const track=rp.track,car=String(rp.cars[0].carId||'').replace(/^[a-z0-9]+_t180_/,'');
  const mtime=fs.statSync(file).mtime.toISOString();
  const cands=opts.surf?[opts.surf]:[path.join(TR,track)];
  if(/^t180b_elysium$/.test(track)&&!opts.surf){ if(mtime<'2026-10-31T22:56') cands.unshift(path.join(TR,'t180b_elysium_gates')); cands.push('G:/consonance-scratch/elysium-backup/t180b_elysium.before-scifi-2026-11-27'); }
  const N=ex.N,dt=ex.dt,P=ex.pos;const p3=i=>[P[i*3],P[i*3+1],P[i*3+2]];
  const up=new Float64Array(N*3),fw=new Float64Array(N*3);let sgnSum=0;
  for(let i=0;i<N;i++){let u=[ex.nrm[i*3],ex.nrm[i*3+1],ex.nrm[i*3+2]],f=[ex.fwd[i*3],ex.fwd[i*3+1],ex.fwd[i*3+2]];
    if(ex.wheelsOk[i]){const w=k=>[ex.wheels[i*12+k*3],ex.wheels[i*12+k*3+1],ex.wheels[i*12+k*3+2]];const F=mul(add(w(0),w(1)),.5),Rr=mul(add(w(2),w(3)),.5),Lf=mul(add(w(0),w(2)),.5),Rt=mul(add(w(1),w(3)),.5);
      f=norm(sub(F,Rr));const r=norm(sub(Rt,Lf));let uu=norm(cross(f,r)); sgnSum+=uu[1]; u=uu;}
    up.set(u,i*3);fw.set(f,i*3);}
  if(sgnSum<0)for(let i=0;i<N;i++)if(ex.wheelsOk[i]){up[i*3]*=-1;up[i*3+1]*=-1;up[i*3+2]*=-1;}
  let best=null;
  const head0={};const pairs=[];for(const folder of cands){if(!fs.existsSync(folder))continue;if(!rp.trackConfig&&!fs.existsSync(path.join(folder,'models.ini'))){const c=fs.readdirSync(folder).filter(f=>f.startsWith('models_')&&f.endsWith('.ini'));if(c.length){for(const x of c)pairs.push([folder,x.slice(7,-4)]);continue;}}pairs.push([folder,rp.trackConfig]);}
  for(const [folder,cfg] of pairs){ let S;try{S=loadSurface(folder,cfg);}catch(e){head0.err=String(e.message).slice(0,120);continue;} if(!S.n)continue;
    const wd=[];let moving=0,found=0,rawSum=0,rawN=0;const step=Math.max(1,Math.floor(N/1500));
    for(let i=0;i<N;i+=step){if(!(ex.speed[i]>100)||!ex.wheelsOk[i])continue;moving++;const u=[up[i*3],up[i*3+1],up[i*3+2]];let ok=true;const ds=[];for(let k=0;k<4;k++){const h=probe(S,[ex.wheels[i*12+k*3],ex.wheels[i*12+k*3+1],ex.wheels[i*12+k*3+2]],u,3);if(!h){ok=false;break;}ds.push(h.d);rawSum+=h.raw;rawN++;}if(ok){found++;wd.push(...ds);}}
    wd.sort((a,b)=>a-b);const q=f=>wd.length?wd[Math.floor(f*(wd.length-1))]:NaN;
    if(S.wsign===undefined){const fr=rawN?rawSum/rawN:0;S.wfrac=fr;S.wsign=fr>0.9?1:fr<-0.9?-1:0;}
    const fit={cfg,wsign:S.wsign,wfrac:S.wfrac,folder,tris:S.n,moving,found,share:moving?found/moving:0,w_p10:q(.1),w_p50:q(.5),w_p90:q(.9),names:S.names};
    fit.ok=fit.share>0.5&&fit.w_p50>0.12&&fit.w_p50<0.50&&(fit.w_p90-fit.w_p10)<0.15;
    if(!best||(fit.ok&&!best.fit.ok)||(fit.ok===best.fit.ok&&fit.share>best.fit.share+0.05))best={S,fit}; if(fit.ok)break;}
  const head={id,sha,file:path.basename(file),track,track_tag:tag(track),own:/^t180b_/.test(track)?1:0,car,N,dt,dur:N*dt,mtime,fit:best&&best.fit,err:head0.err};
  if(!best||!best.fit.ok){head.left_out=!best?('no surface loaded'+(fs.existsSync(cands[0])?'':' (track folder not on disk)')):'surface fit failed';return{head,passes:[]};}
  const S=best.S;let cfm=cfmOf(best.fit.folder); if(track==='t180b_elysium'&&mtime<'2026-10-31T22:56')cfm='0.0002'; head.cfm=cfm;
  const bd=new Float64Array(N).fill(NaN),wdm=new Float64Array(N*4).fill(NaN),sn=new Float64Array(N*3),sq=new Float64Array(N*3),load=new Float64Array(N).fill(NaN),vel=new Float64Array(N).fill(NaN),brk=new Uint8Array(N),tiltc=new Float64Array(N).fill(NaN);
  let prevN=null;
  for(let i=0;i<N;i++){const c=p3(i);const u=[up[i*3],up[i*3+1],up[i*3+2]];
    if(i>0){const stepm=Math.hypot(...sub(c,p3(i-1)));vel[i]=stepm/dt;if(stepm>12)brk[i]=1;}
    const bc=sub(c,mul(u,0.05));let h=null;if(prevN)h=probe(S,bc,prevN,3);if(!h)h=probe(S,bc,u,3);
    if(!h){prevN=null;continue;}
    bd[i]=h.d;sn.set(h.n,i*3);sq.set(h.q,i*3);prevN=h.n;tiltc[i]=dot(u,h.n);
    if(ex.wheelsOk[i])for(let k=0;k<4;k++){const hw=probe(S,[ex.wheels[i*12+k*3],ex.wheels[i*12+k*3+1],ex.wheels[i*12+k*3+2]],h.n,3);if(hw)wdm[i*4+k]=hw.d;}}
  const W=4;for(let i=W;i<N-W;i++){let bad=false;for(let j=i-W+1;j<=i+W;j++)if(brk[j])bad=true;if(bad)continue;const a=mul(add(sub(p3(i+W),mul(p3(i),2)),p3(i-W)),1/((W*dt)**2));const n=isNaN(bd[i])?[up[i*3],up[i*3+1],up[i*3+2]]:[sn[i*3],sn[i*3+1],sn[i*3+2]];load[i]=(dot(a,n)+G*n[1])/G;}
  const spd=i=>isFinite(ex.speed[i])?ex.speed[i]:vel[i]*3.6;
  const secOf=k=>{if(isNaN(bd[k])||k<1||k>N-2)return['','','',''];const n=[sn[k*3],sn[k*3+1],sn[k*3+2]];let T=sub(p3(k+1),p3(k-1));T=norm(sub(T,mul(n,dot(T,n))));const sc=section(S,[sq[k*3],sq[k*3+1],sq[k*3+2]],n,T,45);const ch=norm(sub(sc.ePlus,sc.eMinus));let nc=norm(cross(T,ch));if(dot(nc,n)<0)nc=mul(nc,-1);let roll=Math.atan2(ch[1],Math.hypot(ch[0],ch[2]))*180/Math.PI;if(nc[1]<0)roll=(roll>=0?180:-180)-roll;const right=norm(cross([fw[k*3],fw[k*3+1],fw[k*3+2]],[up[k*3],up[k*3+1],up[k*3+2]]));const lat=norm(cross(n,T));return[sc.dPlus.toFixed(2),sc.dMinus.toFixed(2),roll.toFixed(1),dot(lat,right).toFixed(2)];};
  if(opts.dump){const [t0,t1]=opts.dump;console.log('t\tkmh\tbox_cm\tw0\tw1\tw2\tw3\tload_g\tup.n\tup_y\tx\ty\tz\tbrk');for(let i=Math.max(0,Math.round(t0/dt));i<=Math.min(N-1,Math.round(t1/dt));i++)console.log([(i*dt).toFixed(3),spd(i).toFixed(1),(bd[i]*100).toFixed(1),...[0,1,2,3].map(k=>wdm[i*4+k].toFixed(3)),load[i].toFixed(1),tiltc[i].toFixed(3),up[i*3+1].toFixed(2),P[i*3].toFixed(1),P[i*3+1].toFixed(1),P[i*3+2].toFixed(1),brk[i],...secOf(i)].join('\t'));}
  let km=0;for(let i=1;i<N;i++)if(!brk[i]&&isFinite(vel[i])&&vel[i]<400)km+=vel[i]*dt/1000;head.km=km;
  let onroad=0;for(let i=0;i<N;i++)if(isFinite(bd[i])&&spd(i)>80)onroad++;head.onroad_s=onroad*dt;
  const passes=[];let i=1;const GAPF=10;let lastBroke=-1;
  while(i<N){ if(!(bd[i]<=0)||!(bd[i-1]>0)||brk[i]||!(spd(i)>80)){i++;continue;}
    let s=i,e=i,j=i,through=false;
    while(j<N&&!brk[j]){ if(bd[j]<=0){e=j;if(bd[j]<-0.5){through=true;break;}j++;continue;} if(isNaN(bd[j])){break;}
      let k=j,back=-1;while(k<N&&k<j+GAPF&&!brk[k]&&isFinite(bd[k])){if(bd[k]<=0){back=k;break;}k++;} if(back<0)break; j=back;}
    let deep=0,di=s;for(let k=s;k<=e;k++)if(bd[k]<deep&&bd[k]>=-0.40){deep=bd[k];di=k;}
    let air=0;for(let k=Math.max(0,s-Math.round(1/dt));k<s;k++)if(isNaN(bd[k])||bd[k]>0.5)air++;
    const afterBreak=(lastBroke>=0&&s-lastBroke<Math.round(6/dt)&&!brk.subarray(lastBroke,s).some(x=>x))?1:0;
    const nextI=e+1;
    if(deep>-0.02&&!through){i=nextI;continue;} if(e-s<2&&!through&&deep>-0.11){i=nextI;continue;}
    let ci=-1;for(let k=s;k<=e;k++)if(bd[k]<=-0.11&&bd[k-1]>-0.11){ci=k;break;}
    let rate='',rate1='';if(ci>0){rate1=(bd[ci-1]-bd[ci])/dt; rate=(isFinite(bd[ci-2])&&isFinite(bd[ci+1])&&!brk[ci+1])?(bd[ci-2]-bd[ci+1])/(3*dt):rate1;}
    let mx=-Infinity;for(let k=s;k<=e;k++){if(bd[k]<=-0.05&&bd[k]>=-0.16&&isFinite(bd[k-1])&&isFinite(bd[Math.min(N-1,k+1)])){const r=(bd[k-1]-bd[k+1])/(2*dt);if(r>mx)mx=r;}}
    const ri=ci>0?ci:di;
    const aft=Math.min(N-1,e+Math.round(1/dt));
    let pk=-Infinity;for(let k=Math.max(0,s-Math.round(.5/dt));k<=e;k++)if(load[k]>pk)pk=load[k];
    let loss=0;for(let k=Math.max(1,s-2);k<=Math.min(N-1,e+Math.round(.5/dt));k++){if(brk[k]||brk[k-1]||brk[Math.min(N-1,k+1)])continue;const d=spd(k-1)-spd(k);if(d>loss&&d<400)loss=d;}
    let wu=0,wmin=Infinity;for(let k=s;k<=Math.min(N-1,e+Math.round(.3/dt));k++)for(let w=0;w<4;w++){const x=wdm[k*4+w];if(x<wmin)wmin=x;if(x<-0.05)wu=1;}
    let boxmin=deep;for(let k=e;k<=Math.min(N-1,e+Math.round(.3/dt));k++)if(bd[k]<boxmin)boxmin=bd[k];
    let lostrun=0,lost=0,reset='';for(let k=e+1;k<=aft;k++){if(brk[k]){reset='reset@+'+((k-e)*dt).toFixed(2);break;}if(isNaN(bd[k])||Math.abs(bd[k])>1.0){lostrun++;if(lostrun>=20)lost=1;}else lostrun=0;}
    for(let k=aft;k<=Math.min(N-1,e+Math.round(4/dt));k++)if(brk[k]){if(!reset)reset='reset@+'+((k-e)*dt).toFixed(2);break;}
    const thr=boxmin<-0.40||wu;const broke=thr&&(lost||loss>=20);
    if(broke)lastBroke=e;const how=[];if(boxmin<-0.40)how.push('box_through('+(boxmin*100).toFixed(0)+'cm)');if(wu)how.push('wheel_under('+(wmin*100).toFixed(0)+'cm)');if(lost)how.push('left_road');if(loss>=20)how.push('speed_loss_'+loss.toFixed(0)+'kmh');if(reset)how.push(reset);
    const a0=Math.max(1,Math.min(s,ri)-14),a1=Math.min(N-2,ri+14);const secs=[];let sAcc=0;
    for(let k=a0;k<=a1;k++){ if(k>a0)sAcc+=Math.hypot(...sub(p3(k),p3(k-1))); if(isNaN(bd[k])||brk[k]||brk[k+1])continue;const n=[sn[k*3],sn[k*3+1],sn[k*3+2]];let T=sub(p3(k+1),p3(k-1));T=norm(sub(T,mul(n,dot(T,n))));const q=[sq[k*3],sq[k*3+1],sq[k*3+2]];
      const sc=section(S,q,n,T,45);const ch=norm(sub(sc.ePlus,sc.eMinus));let nc=norm(cross(T,ch));if(dot(nc,n)<0)nc=mul(nc,-1);
      let roll=Math.atan2(ch[1],Math.hypot(ch[0],ch[2]))*180/Math.PI;if(nc[1]<0)roll=(roll>=0?180:-180)-roll;
      secs.push({k,s:sAcc,u:(sc.dMinus-sc.dPlus)/2,half:(sc.dMinus+sc.dPlus)/2,near:Math.min(sc.dPlus,sc.dMinus),closed:!(sc.openPlus&&sc.openMinus),ch,nc,T,roll});}
    let u='',half='',near='',roll='',rr='',ra='',rl='',closed='';
    const me=secs.find(x=>x.k===ri);
    if(me){u=me.u;half=me.half;near=me.near;roll=me.roll;closed=me.closed?1:0;
      const pts=[];for(const x of secs){const ds=x.s-me.s;if(Math.abs(ds)>20)continue;const th=Math.atan2(dot(x.nc,me.ch),dot(x.nc,me.nc));pts.push([ds,th]);}
      if(pts.length>=5){let S0=0,S1=0,S2=0,S3=0,S4=0,Y0=0,Y1=0,Y2=0;for(const[x,y]of pts){S0++;S1+=x;S2+=x*x;S3+=x**3;S4+=x**4;Y0+=y;Y1+=x*y;Y2+=x*x*y;}
        const D=S0*(S2*S4-S3*S3)-S1*(S1*S4-S3*S2)+S2*(S1*S3-S2*S2);
        if(Math.abs(D)>1e-9){const bq=(S0*(Y1*S4-S3*Y2)-Y0*(S1*S4-S3*S2)+S2*(S1*Y2-Y1*S2))/D;const cq=(S0*(S2*Y2-Y1*S3)-S1*(S1*Y2-Y1*S2)+Y0*(S1*S3-S2*S2))/D;
          rr=bq*180/Math.PI;ra=2*cq*180/Math.PI;const v=spd(ri)/3.6;rl=Math.abs(u)*Math.abs(2*cq)*v*v/G;}}}
    const f=(x,n)=>x===''||!isFinite(x)?'':(+x).toFixed(n);
    passes.push({replay_id:id,track_tag:head.track_tag,own_track:head.own,car,cfm,t_start:(s*dt).toFixed(3),t_end:(e*dt).toFixed(3),speed_kmh:f(spd(ri),1),deepest_cm:f(deep*100,1),crosses_11cm:ci>0?1:0,sink_rate_at_11cm:f(rate,2),sink_rate_1frame:f(rate1,2),max_sink_rate_5_to_16cm:f(mx,2),peak_load_g:f(pk,1),u_m:f(u,2),half_width_m:f(half,2),road_roll_deg:f(roll,1),roll_rate_deg_per_m:f(rr,3),roll_acc_deg_per_m2:f(ra,4),roll_load_g:f(rl,2),wheel_under:wu,min_wheel_cm:f(wmin*100,1),near_edge_m:f(near,2),closed_section:closed,up_dot_normal:f(tiltc[ri],3),dur_s:((e-s+1)*dt).toFixed(3),max_1frame_speed_loss_kmh:f(loss,1),kind:afterBreak?'aftermath':(air*dt>=0.1?'landing':((near!==''&&near<1.0)?'edge':'road')),air_before_s:(air*dt).toFixed(2),after_break:afterBreak,outcome:broke?'broke':'held',how_broke:how.join(';'),split:/^[89a-f]/.test(id)?'test':'train'});
    i=nextI;}
  head.nPasses=passes.length;return{head,passes};
}
module.exports={runReplay,RD};
if(require.main===module){const a=process.argv.slice(2);const opts={};let di=a.indexOf('--dump');if(di>=0)opts.dump=[+a[di+1],+a[di+2]];di=a.indexOf('--surf');if(di>=0)opts.surf=a[di+1];
  const list=JSON.parse(fs.readFileSync(path.join(__dirname,'replays.json'),'utf8'));const want=a[0].split(',');const stop=a.includes('--stop')?a[a.indexOf('--stop')+1]:null;
  for(const w of want){const r=list.find(x=>x.sha===w);if(!r){console.log('no such',w);continue;}
    if(stop){const d=new Date();const hm=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');if(hm>=stop){console.log('STOP clock',hm,'skipping',w);continue;}}
    const t0=Date.now();let o;try{o=runReplay(path.join(RD,r.f),opts);}catch(e){console.log(w,'ERROR',e.message);fs.writeFileSync(path.join(__dirname,'out',w+'.json'),JSON.stringify({head:{id:w,file:r.f,track:r.track,left_out:'error: '+e.message},passes:[]}));continue;}
    if(!opts.dump)fs.writeFileSync(path.join(__dirname,'out',w+'.json'),JSON.stringify(o));
    const h=o.head;console.log(w,h.track_tag,h.car,'fit',h.fit?[h.fit.ok,h.fit.share.toFixed(2),h.fit.w_p10.toFixed(3),h.fit.w_p50.toFixed(3),h.fit.w_p90.toFixed(3),path.basename(h.fit.folder),h.fit.tris].join(' '):'none','passes',o.passes.length,'broke',o.passes.filter(p=>p.outcome==='broke').length,((Date.now()-t0)/1000).toFixed(1)+'s');}
}
