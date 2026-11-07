// setvantage.js <config>: adds "vantage_repos" (the two G: clones) to the config, refusing if the key exists, if the
// backup beside it is missing or differs, or if re-serialising the file would change any other byte.
'use strict';
const fs = require('fs');
const f = process.argv[2], b = f + '.before-d635';
const t = fs.readFileSync(f, 'utf8');
if (!fs.existsSync(b) || fs.readFileSync(b, 'utf8') !== t) throw new Error('backup missing or not identical: ' + b);
const j = JSON.parse(t);
if ('vantage_repos' in j) throw new Error('vantage_repos already set');
const nl = t.endsWith('\n') ? '\n' : '';
if (JSON.stringify(j, null, 2) + nl !== t) throw new Error('re-serialising would change other bytes; edit by hand instead');
j.vantage_repos = [
  'G:\\Consonance-tools\\vantage-repos\\t180',
  'G:\\Consonance-tools\\vantage-repos\\t180-track-builder-history',
];
for (const p of j.vantage_repos) if (!fs.existsSync(p + '\\.git')) throw new Error('not a clone: ' + p);
fs.writeFileSync(f, JSON.stringify(j, null, 2) + nl);
console.log('written; keys', Object.keys(j).length);
