// rename.js <file>...: secondSpanHolds -> spanHolds (the shell's forwarder, B's agreed name), byte-preserving otherwise; prints the count per file
const fs = require('fs');
for (const f of process.argv.slice(2)) { const s = fs.readFileSync(f, 'utf8'), n = s.split('secondSpanHolds').length - 1; fs.writeFileSync(f, s.split('secondSpanHolds').join('spanHolds')); console.log(f, n); }
