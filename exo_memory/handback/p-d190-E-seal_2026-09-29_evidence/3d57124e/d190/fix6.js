const fs=require('fs');
function patch(f,pairs){let s=fs.readFileSync(f,'utf8');const crlf=s.includes('\r\n');if(crlf)s=s.replace(/\r\n/g,'\n');for(const [a,b] of pairs){if(s.split(a).length!==2)throw new Error(f+' anchor '+a.slice(0,70));s=s.replace(a,()=>b);}if(crlf)s=s.replace(/\n/g,'\n'.replace('\n','\r\n'));fs.writeFileSync(f,s);console.log('patched',f);}
const W='C:/Users/nname/Desktop/a-d188-wt/';
patch(W+'src/core/README.md',[
["  smoothstep: the first row IS the legacy piece's last row,","  smoothstep (the shape only: the legacy and cup widths are equal at the same w, measured): the first row IS the legacy piece's last row,"],
["is not the mesh evaluates the blend at its station with `src/geom/profile.js atSegment(seg, d)`","is not the mesh evaluates a CUP segment's blend (`cup: true` on the segment) at its station with `src/geom/profile.js readAt(seg, d)` (a word document's font-transition blends are read as before)"]]);
let s=fs.readFileSync(W+'.claude/skills/track-equations/references/09_core_channels.md','utf8');
const n=s.replace(" (and the width u blended the same way from the legacy profile's u)","").replace(/ and the width u blended the same way from the legacy profile's u/,"");
fs.writeFileSync(W+'.claude/skills/track-equations/references/09_core_channels.md',n);console.log(s!==n?'09 changed':'09 unchanged');
