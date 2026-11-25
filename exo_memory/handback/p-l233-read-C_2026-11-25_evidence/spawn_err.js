// Does the default launch say anything when the exe is missing, if the process stays alive long enough to hear?
const { spawn } = require('child_process');
const c = spawn(process.argv[2], [], { detached: true, stdio: 'ignore' });
c.on('error', (e) => console.log('error event:', e.code));
c.unref();
console.log('spawn returned, pid', c.pid);
setTimeout(() => console.log('500 ms later'), 500);
