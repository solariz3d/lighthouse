// run.js: the out-of-sample extraction under the heavy-run lock (it reads transcripts over 512 MB).
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'd631 replay extract (P), transcripts read-only' });
process.chdir(__dirname); require('./extract.js');
