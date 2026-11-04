const fs=require('fs'),os=require('os'),path=require('path');
function run(T){const D=require(T+'src/core/document.js'),{extend,channelFn}=require(T+'src/core/extend.js'),A=require(T+'src/core/adapter.js'),PF=require(T+'src/geom/profile.js');const out=[];
 // (a) legacy piece ENDING on a steep width slope with a binding r, then a cup
 const ch=Object.fromEntries(D.CHANNELS.map((c)=>[c,c==='w'?(s)=>4+0.25*s:c==='r'?()=>2:()=>0]));
 const legacy=D.appendPiece(D.createDoc('s'),D.roadPiece({length:20,family:'bowl',from:null,channels:ch}));
 const d=extend(legacy,{length:80,transition:40,targets:{c:60}});let segs=A.toSegments(d);const li=segs.findIndex((g)=>g.id==='p2')-1;
 out.push('a legacy->cup joint mm '+(PF.stepBetween(PF.readAt(segs[li],segs[li].length),PF.readAt(segs[li+1],0))*1000).toFixed(3));
 // (b) a lap: cup first piece (w 10 -> 4), then a 6 m legacy piece 4 -> 10 (still changing fast in its last segment), closed flag
 let e=extend(D.createDoc('m'),{length:100,family:'bowl',first:{w:10,r:2,c:30},transition:100,targets:{w:4}});
 const P=e.pieces[0],edge=D.legacyEdgeDeg('bowl',D.channelAt(P,'w',100).v,D.channelAt(P,'r',100).v);
 e=extend(D.createDoc('m'),{length:100,family:'bowl',first:{w:10,r:2,c:30},transition:100,targets:{w:4,c:edge}});
 const from=D.endState(e),chs=Object.fromEntries(D.CHANNELS.map((c)=>[c,channelFn(from[c],c==='w'?10:undefined,6)]));
 const lap={...D.appendPiece(e,D.roadPiece({length:6,family:'bowl',from,channels:chs,cup:false})),closed:true};
 const s2=A.toSegments(lap);const last=s2[s2.length-1],first=s2[0];
 out.push('b lap seam mm '+(PF.stepBetween(PF.readAt(last,last.length),PF.readAt(first,0))*1000).toFixed(3)+' (last seg chord '+!!last.chord+')');
 return out.join('\n');}
const R='C:/Users/nname/Desktop/a-d195-wt/';console.log('current:\n'+run(R));
for(const [name,file,from,to] of [['K8','src/core/adapter.js','a = b; lastProfile = cup ? cup[j].end : L.end;','a = b; lastProfile = cup ? cup[j].end : L.start;'],['K10','src/core/adapter.js','const legacyLast = (P) => legacyAt(P, nOf(P) - 1).end;','const legacyLast = (P) => legacyAt(P, nOf(P) - 1).start;']]){
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'k-'));for(const d of ['src','tools'])fs.cpSync(R+d,tmp+'/'+d,{recursive:true});const f=tmp+'/'+file;let s=fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n');if(s.split(from).length!==2)throw new Error(name);fs.writeFileSync(f,s.replace(from,()=>to));
 console.log(name+' mutant:\n'+run(tmp.split(path.sep).join('/')+'/'));fs.rmSync(tmp,{recursive:true,force:true});}
