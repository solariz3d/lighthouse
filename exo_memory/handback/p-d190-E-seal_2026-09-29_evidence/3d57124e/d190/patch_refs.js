const fs = require('fs'), f = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d190/edit_refs.js';
let s = fs.readFileSync(f, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) throw new Error('anchor: ' + a.slice(0, 60)); s = s.replace(a, () => b); };
rep("here a 90° target over 40 m gives control points up to 99.13° and a curve peaking near 93.5°)", "measured on the core's own Extend: a 90° target over 40 m of a 200 m piece gives control points up to 99.130° and a curve that peaks at 92.122° before settling at 89.978°)");
rep("the Extend that builds a cup piece clamps its control points to [0, 150] after the fit, and the readout reports the DOCUMENT's c, not the typed target.", "the Extend that builds a cup piece clamps its control points to [0, 150] after the fit, and the readout reports the DOCUMENT's c, not the typed target. A clamp can leave the curve short of a target at the top of the range: 150° over 20 m of a 60 m piece ends at 144.499° (measured), where the same target over 40 m of a 100 m piece ends at 150.000°.");
rep("(LYCHE-MORKEN, 10 §2)", "(LYCHE-MORKEN, in 10_sculpt_close.md)");
fs.writeFileSync(f, s); console.log('patched');
