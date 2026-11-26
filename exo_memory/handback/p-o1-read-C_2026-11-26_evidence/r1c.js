// r1c.js <tree>: no first ramp under the change (head = typed value), laid documents and refusals; sha256 of serialize, or the refusal. Synthetic only.
const path=require('path'),crypto=require('crypto'),ROOT=process.argv[2],D=require(path.join(ROOT,'src/core/document.js')),{extend}=require(path.join(ROOT,'src/core/extend.js')),R=(x)=>(x*Math.PI/180)/100;
const cases=[['kh',50,[[200,70]],400],['kh',-120,[[100,-100]],250],['kv',15,[[100,5]],300],['kh',0,[[200,30],[400,-10]],600],['kv',-8,[[150,4],[400,0]],600],['kh',30,[[100,50],[350,20],[500,25]],700],['kv',4,[[10,6]],300],['kh',-20,[[0,-10]],300]];
for(const [ch,v,chs,L] of cases){const d0=extend(D.createDoc('g'),{length:200,targets:{[ch]:R(v)}});let out;
 try{out='laid '+crypto.createHash('sha256').update(D.serialize(extend(d0,{length:L,targets:{[ch]:R(v)},changes:{[ch]:chs.map(([from,t])=>({from,target:R(t)}))}}))).digest('hex').slice(0,16)}catch(e){out='refused '+e.message}
 console.log(ch,v,JSON.stringify(chs),L,'->',out)}
