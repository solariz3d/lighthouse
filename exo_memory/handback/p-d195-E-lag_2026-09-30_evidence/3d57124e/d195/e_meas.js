const fs=require('fs');const f='C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d195/measure.js';let s=fs.readFileSync(f,'utf8');
function rep(a,b){if(s.split(a).length!==2)throw new Error(a.slice(0,50));s=s.replace(a,()=>b);}
rep("if (joint) jointGap = Math.max(jointGap, gap);","if (joint) { jointGap = Math.max(jointGap, gap); const fa = (d.pieces.find((q) => q.id === a.id) || {}).family, fb = (d.pieces.find((q) => q.id === b.id) || {}).family; if (fa === fb) jointSameFam = Math.max(jointSameFam, gap); else jointDiffFam = Math.max(jointDiffFam, gap); }");
rep("let wstep = 0, inGap = 0, jointGap = 0, chords = 0;","let wstep = 0, inGap = 0, jointGap = 0, chords = 0, jointSameFam = 0, jointDiffFam = 0;");
rep("| at joints ${jointGap.toFixed(3)} mm |","| at joints ${jointGap.toFixed(3)} mm (same family ${jointSameFam.toFixed(3)}, family changes ${jointDiffFam.toFixed(1)}) |");
fs.writeFileSync(f,s);
