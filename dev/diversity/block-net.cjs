const counts = { attempts: 0, where: [] };
const deny = (name) => function () { counts.attempts++; counts.where.push(name); throw new Error('NETWORK BLOCKED by preload: ' + name); };
globalThis.fetch = deny('fetch');
for (const m of ['http', 'https']) { const mod = require(m); mod.request = deny(m + '.request'); mod.get = deny(m + '.get'); }
const net = require('net'); net.connect = deny('net.connect'); net.createConnection = deny('net.createConnection');
const tls = require('tls'); tls.connect = deny('tls.connect');
const dns = require('dns'); dns.lookup = deny('dns.lookup'); dns.resolve = deny('dns.resolve');
if (dns.promises) { dns.promises.lookup = deny('dns.promises.lookup'); dns.promises.resolve = deny('dns.promises.resolve'); }
process.on('exit', () => { process.stderr.write('NETWORK_ATTEMPTS=' + counts.attempts + ' ' + JSON.stringify(counts.where) + '\n'); });
