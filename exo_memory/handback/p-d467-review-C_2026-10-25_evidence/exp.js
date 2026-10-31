// exp.js (C, D467 review): each saved copy exported by tree T as the app exports (exp465.js's path: the shell's exportArgs into fromwords.buildFromSegments); prints
// refused or not, the warnings (the ambers), findFins. Writes nothing anywhere but stdout.   node exp.js <tree> <save>...
'use strict';
const fs = require('fs'), path = require('path');
const [T, ...SAVES] = process.argv.slice(2), r = (f) => require(path.join(T, f));
const D = r('src/core/document.js'), FW = r('src/export/fromwords.js'), ACR = r('src/export/acready.js'), { createCoreShell } = r('app/core/coreshell.js');
(async () => {
  for (const f of SAVES) {
    const shell = await createCoreShell({ autosaveMs: 0 }); shell.adopt(D.parse(fs.readFileSync(f, 'utf8')));
    let ex; try { ex = FW.buildFromSegments(...shell.exportArgs({})); } catch (e) { console.log(`${f}: REFUSED ${e.code || e.name}: ${e.message}`); continue; }
    const fins = ACR.findFins(ACR.weldSeams(ACR.flattenForAc(ex.scene)));
    console.log(`${path.basename(f)}: findFins ${fins.length}; warnings ${ex.warnings.length}`);
    for (const w of ex.warnings) console.log(`  ${w.slice(0, 260)}`);
  }
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });
