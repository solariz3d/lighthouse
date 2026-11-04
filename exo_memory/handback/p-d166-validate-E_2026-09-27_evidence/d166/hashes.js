'use strict';
// D166 (pane E): per AC run, how many cfg files were hashed, how many differ after the restore, and race.ini's sha256
// before and after (prefix only). Reads out/ac_runs/*/summary.json. Prints no file contents.
const fs = require('fs'), path = require('path');
const dir = 'C:/Users/nname/Desktop/t180-track-builder/out/ac_runs';
for (const d of fs.readdirSync(dir).sort()) {
  const f = path.join(dir, d, 'summary.json'); if (!fs.existsSync(f)) continue;
  const s = JSON.parse(fs.readFileSync(f, 'utf8')), b = s.cfgHashes.before, a = s.cfgHashes.after, k = Object.keys(b);
  const race = k.find((x) => path.basename(x).toLowerCase() === 'race.ini');
  console.log(`${d}  files ${k.length}  changed-after-restore ${k.filter((x) => b[x] !== a[x]).length}  race.ini ${b[race].slice(0, 12)} -> ${a[race].slice(0, 12)}  result ${JSON.stringify(s.result)}  ${s.seconds}s`);
}
