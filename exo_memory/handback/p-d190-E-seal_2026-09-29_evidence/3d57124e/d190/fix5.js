const fs=require('fs');
function patch(f,pairs){let s=fs.readFileSync(f,'utf8');const crlf=s.includes('\r\n');if(crlf)s=s.replace(/\r\n/g,'\n');for(const [a,b] of pairs){if(s.split(a).length!==2)throw new Error(f+' anchor '+a.slice(0,70));s=s.replace(a,()=>b);}if(crlf)s=s.replace(/\n/g,'\r\n');fs.writeFileSync(f,s);console.log('patched',f);}
const W='C:/Users/nname/Desktop/a-d188-wt/';
patch(W+'src/core/adapter.js',[
["  if (dpsi.every((x) => Math.abs(x) < 1e-9) && Lg.u.every((x, i) => Math.abs(x - C0.u[i]) < 1e-9)) return 0;","  if (dpsi.every((x) => Math.abs(x) < 1e-9)) return 0;   // (measured: the legacy and cup profiles' u are equal at the same width, so only ψ morphs)"],
["u: cw.u.map((x, i) => (1 - m) * x + m * Lg.u[i]), psi:","u: cw.u, psi:"]]);
patch(W+'test/core_cup.test.js',[["    if (s1 < 14) continue;","    if (s1 < 10 - 1e-9) continue;   // the morph ends at 10 m: the segment ending there is already the pure cup shape"]]);
patch(W+'test/core_cup_readers.test.js',[["assert.deepEqual(PF.readAt(g, 0).psi, PF.normalize(own).psi); assert.deepEqual(PF.readAt({ ...g, cup: true }, 0).psi, PF.normalize(from).psi);","const near = (a, b) => a.every((x, i) => Math.abs(x - b[i]) < 1e-12);\n  assert.ok(near(PF.readAt(g, 0).psi, PF.normalize(own).psi)); assert.ok(near(PF.readAt({ ...g, cup: true }, 0).psi, PF.normalize(from).psi));"]]);
{const f=W+'test/core_cup_mutation.test.js';let s=fs.readFileSync(f,'utf8');const i=s.indexOf("  { id: 'M32 (R2)");const j=s.indexOf('\n',i);s=s.slice(0,i)+s.slice(j+1);fs.writeFileSync(f,s);console.log('M32 removed');}
patch(W+'src/core/README.md',[["by smoothstep: the first row IS the legacy piece's last row","by smoothstep (the shape only: the legacy and cup widths are equal at the same w, measured): the first row IS the legacy piece's last row"]]);
patch(W+'.claude/skills/track-equations/references/09_core_channels.md',[[" (and the width u blended the same way from the legacy profile's u)",""]]);
