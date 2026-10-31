// revert-handle.js: put HANDLE_RE back to its pre-1C.1 form in the given gen-consumer.js (a causation probe; the caller restores the file).
const fs = require('fs'), f = process.argv[2];
const s = fs.readFileSync(f, 'utf8');
const OLD = 'const HANDLE_RE = /(?<!github\\.com\\/)solariz3d|solariz3d(?!\\/[A-Za-z0-9_.-])/gi;';
const n = s.replace(/const HANDLE_RE = \/[^\n]*\/gi;/, () => OLD);
if (n === s) throw new Error('not applied');
fs.writeFileSync(f, n);
console.log('reverted to: ' + OLD);
