// iotest.js: prints this node's and a git child's I/O priority and class, read from outside by lowio.ps1 -Query
const cp = require('child_process'), q = (pid) => cp.execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'lowio.ps1', '-Query', String(pid)], { encoding: 'utf8' }).trim();
console.log('node  ', q(process.pid));
const c = cp.spawn('git', ['cat-file', '--batch'], { stdio: ['pipe', 'ignore', 'ignore'] }); console.log('git   ', q(c.pid)); c.stdin.end();
