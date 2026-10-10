const fs = require('fs'), f = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d190/patch_cupmark_tests.js'; let s = fs.readFileSync(f, 'utf8');
const n = (s.match(/\\'s/g) || []).length; s = s.replace(/\\'s/g, ' of it'); fs.writeFileSync(f, s); console.log('possessives replaced:', n);
