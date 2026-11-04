const fs = require('fs'), f = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d190/patch_mut2.js'; let s = fs.readFileSync(f, 'utf8');
const a = "const R = '../';   // src/ files outside core/ are given relative to src/"; if (s.split(a).length !== 2) throw new Error('a');
s = s.replace(a, () => "const R = '';   // src/ files outside core/ are given relative to src/"); fs.writeFileSync(f, s); console.log('ok');
