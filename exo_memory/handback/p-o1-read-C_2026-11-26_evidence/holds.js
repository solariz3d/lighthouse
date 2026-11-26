const path=require('path'),R=(x)=>(x*Math.PI/180)/100;
for (const root of process.argv.slice(2)) { const EX=require(path.join(root,'src/core/extend.js')), base={ step: R(-80), length: 300, shape: null };
  console.log(path.basename(root), 'spanHolds kh -80->-95 over 80 m:', EX.spanHolds('kh', R(-80), R(-95), base, 80), '; secondMinM:', +EX.secondMinM('kh', R(-80), R(-95), base).toFixed(2)); }
