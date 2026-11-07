// dropnul.js <file> <offset> <len>: removes exactly one run of <len> NUL bytes starting at <offset>, refusing if the bytes
// there are not all NUL, if any other NUL exists, or if the run does not start a line. Prints sizes and line counts before and after.
'use strict';
const fs = require('fs');
const [file, off, len] = [process.argv[2], Number(process.argv[3]), Number(process.argv[4])];
const b = fs.readFileSync(file);
const run = b.subarray(off, off + len);
if (run.length !== len || run.some((x) => x !== 0)) throw new Error('the bytes at ' + off + ' are not ' + len + ' NULs');
if (b[off + len] === 0 || (off > 0 && b[off - 1] !== 0x0a)) throw new Error('the run is not exactly one line-leading run');
const out = Buffer.concat([b.subarray(0, off), b.subarray(off + len)]);
if (out.indexOf(0) !== -1) throw new Error('another NUL remains at ' + out.indexOf(0));
const lines = (x) => x.toString('latin1').split('\n').length - 1;
fs.writeFileSync(file, out);
console.log('before', b.length, 'bytes', lines(b), 'newlines; after', out.length, 'bytes', lines(out), 'newlines; removed', b.length - out.length);
