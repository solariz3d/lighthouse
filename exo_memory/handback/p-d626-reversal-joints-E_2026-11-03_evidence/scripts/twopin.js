// usage (from the checkout): node twopin.js — a dip that turns back just before a joint, then a hard roll from rest: peak against the bar-or-floor,
// with every pin a zone reaches rounded (now) and with only the first (as before)
const fs=require('fs'),os=require('os'),path=require('path');
const mk=(old)=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'tp-'));for(const d of ['src','app','tools'])fs.cpSync(d,path.join(dir,d),{recursive:true,filter:(p)=>!/[\/]app[\/]test([\/]|$)/.test(p)});
 const f=path.join(dir,'src/core/adapter.js');let s=fs.readFileSync(f,'utf8');if(old){const a='if (js.length) for (const j of js) {';if(s.split(a).length!==2)throw 'anchor';s=s.replace(a,()=>'if (js.length) for (const j of js.slice(0, 1)) {');fs.writeFileSync(f,s);}
 return {dir,D:require(path.join(dir,'src/core/document.js')),A:require(path.join(dir,'src/core/adapter.js')),E:require(path.join(dir,'src/core/extend.js')),PN:require(path.join(dir,'app/core/panel.js'))};};
const DEG=Math.PI/180,BAR=29.4/(10*170*170);
for (const old of [false,true]) { const X=mk(old);
 const opts = (length, bank) => X.PN.extendOptions({ length: String(length), turn: '', climb: '', bank: String(bank), width: '', cup: '', edge: '', start: '', tube: '', atStart: {}, turnAs: 'rate' });
 for (const [dip,at,L2,B2] of [[-1,3,250,-40],[-2,2,250,-40],[-1,2,150,-30],[1,3,250,-40]]) {
  let d=X.E.extend(X.E.extend(X.D.createDoc('x'),{length:1000,family:'bowl'}),{length:1000,family:'bowl'});const P=d.pieces[1],c=P.channels.phi.slice();c[c.length-1-at]=dip*DEG;
  d={...d,pieces:d.pieces.map((Q,i)=>i===1?{...Q,channels:{...Q.channels,phi:c}}:Q)}; d=X.E.extend(d,opts(L2,B2));
  const fl=(Q)=>Q.type==='road'?(10/Math.sqrt(3))*Math.abs(X.D.channelAt(Q,'phi',Q.length).v-X.D.channelAt(Q,'phi',0).v)/(Q.length*Q.length):0;
  const allowed=(s)=>{let o=0,m=BAR;for(const Q of d.pieces){if(s>=o-Q.length&&s<=o+2*Q.length)m=Math.max(m,fl(Q));o+=Q.length;}return m;};
  let s=0;const G=X.A.toSegments(d).map(g=>{const r={s,a:g.roll0,b:g.roll1,L:g.length};s+=g.length;return r;});let w=0,ws=0;for(let k=1;k<G.length;k++){const a=Math.abs((G[k].b-G[k].a)/G[k].L-(G[k-1].b-G[k-1].a)/G[k-1].L)/((G[k].L+G[k-1].L)/2)/allowed(G[k].s);if(a>w){w=a;ws=G[k].s;}}
  console.log(old?'first pin only':'every pin    ',`dip ${dip}° at cp end-${at}, then ${L2} m to ${B2}°: worst ${w.toFixed(2)}x at s ${ws.toFixed(0)}`);
 } fs.rmSync(X.dir,{recursive:true,force:true}); }
