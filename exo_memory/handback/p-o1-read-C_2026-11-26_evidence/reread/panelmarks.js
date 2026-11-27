// panelmarks.js <tree>: the panel's default marks (extendOptions, marks left blank) for two turn/climb changes over a moving first ramp, with the core's secondMinM as the shell
// passes it (ch, a, b, base: no end), then extend on the same piece. Synthetic only.
const path=require('path'),ROOT=process.argv[2],{extendOptions}=require(path.join(ROOT,'app/core/panel.js')),EX=require(path.join(ROOT,'src/core/extend.js')),D=require(path.join(ROOT,'src/core/document.js')),R=x=>(x*Math.PI/180)/100;
const shellMin=(ch,a,b,base)=>EX.secondMinM(ch,a,b,base);
for(const [kind,ch,first,t1,t2,f2] of [['turn','kh','-80','-95','-90',''],['turn','kh','-80','-95','-90','200'],['turn','kh','-80','-100','-90',''],['climb','kv','-80','-95','-90',''],['turn','kh','-60','-75','-70','']]){
 const o=extendOptions({length:300,turn:'',climb:'',width:'',cup:'',turnAs:'rate',[kind]:first,head:{kh:0,kv:0},changes:{[kind]:[{then:t1,from:''},{then:t2,from:f2}]},secondMinM:shellMin});
 const marks=o.changes[ch].map(x=>x.from),d0=EX.extend(D.createDoc('g'),{length:200,targets:{[ch]:0}});let res;
 try{EX.extend(d0,{length:300,targets:{[ch]:R(+first)},changes:{[ch]:[{from:marks[0],target:R(+t1)},{from:marks[1],target:R(+t2)}]}});res='laid'}catch(e){res=e.code+': '+e.message.replace(/^BAD_SECOND: /,'').slice(0,150)}
 const base={step:R(+first),length:300,shape:null},noEnd=EX.secondMinM(ch,R(+first),R(+t1),base),withEnd=EX.secondMinM(ch,R(+first),R(+t1),base,marks[1]);
 console.log(`${kind} ${first} -> ${t1} then ${t2} (second mark ${f2||'blank'}): panel marks ${JSON.stringify(marks)}; change 1 shortest without end ${noEnd.toFixed(1)}, at its end ${withEnd.toFixed(1)}; extend: ${res}`)}
