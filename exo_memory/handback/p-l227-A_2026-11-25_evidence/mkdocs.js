const fs = require('fs'), T = 'C:/Consonance/t180-wt-flow', D = require(T + '/src/core/document.js'), A = process.argv[2];
const rd = (n) => D.parse(fs.readFileSync(A + '/tracks/eq-' + n + '.t180track', 'utf8'));
fs.writeFileSync(process.argv[3], JSON.stringify([{ name: 'S as driven', doc: rd('Smooth S as driven L') }, { name: 'route 1c', doc: rd('Smooth S flow L') }]));
