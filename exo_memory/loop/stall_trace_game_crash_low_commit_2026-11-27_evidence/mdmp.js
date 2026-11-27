// reads a Windows minidump: the exception record and the module the faulting address is in. Standard library only.
const fs = require('fs'); const b = fs.readFileSync(process.argv[2]);
if (b.toString('latin1', 0, 4) !== 'MDMP') { console.log('not a minidump'); process.exit(1); }
const n = b.readUInt32LE(8), dir = b.readUInt32LE(12); const streams = {};
for (let i = 0; i < n; i++) { const o = dir + i * 12; streams[b.readUInt32LE(o)] = { size: b.readUInt32LE(o + 4), rva: b.readUInt32LE(o + 8) }; }
const hex = v => '0x' + v.toString(16).toUpperCase();
const mods = [];
if (streams[4]) { const r = streams[4].rva, c = b.readUInt32LE(r);
  for (let i = 0; i < c; i++) { const o = r + 4 + i * 108; const base = b.readBigUInt64LE(o), size = b.readUInt32LE(o + 8), nameRva = b.readUInt32LE(o + 20);
    const len = b.readUInt32LE(nameRva); const name = b.toString('utf16le', nameRva + 4, nameRva + 4 + len);
    const ms = b.readUInt32LE(o + 24 + 8), ls = b.readUInt32LE(o + 24 + 12);
    mods.push({ base, size, name, ver: `${ms >>> 16}.${ms & 0xffff}.${ls >>> 16}.${ls & 0xffff}`, ts: b.readUInt32LE(o + 16) }); } }
const where = a => { const m = mods.find(m => a >= m.base && a < m.base + BigInt(m.size)); return m ? `${m.name.split(String.fromCharCode(92)).slice(-2).join(String.fromCharCode(47))} + ${hex(a - m.base)} (image size ${m.size}, version ${m.ver})` : 'no module (heap, stack or freed code)'; };
if (!streams[6]) { console.log('no exception stream'); process.exit(0); }
const e = streams[6].rva + 8; const code = b.readUInt32LE(e), addr = b.readBigUInt64LE(e + 16), np = b.readUInt32LE(e + 24);
const names = { 0xC0000005: 'access violation', 0xE06D7363: 'C++ exception thrown', 0xC00000FD: 'stack overflow', 0xC0000409: 'fail-fast / stack buffer overrun', 0xC0000374: 'heap corruption', 0xC000001D: 'illegal instruction', 0x80000003: 'breakpoint', 0xC0000017: 'no memory' };
console.log('exception', hex(code), names[code] || '(unnamed)');
console.log('at', hex(addr), '=', where(addr));
const p = []; for (let i = 0; i < Math.min(np, 15); i++) p.push(b.readBigUInt64LE(e + 32 + i * 8));
if (code === 0xC0000005 && p.length >= 2) console.log(['read', 'write', , , , , , , 'execute'][Number(p[0])] || 'op ' + p[0], 'of address', hex(p[1]), '=', where(p[1]));
else console.log('parameters', p.map(hex).join(' '));
console.log('modules', mods.length, '| dwrite:', mods.filter(m => /dwrite/i.test(m.name)).map(m => `${m.name} size ${m.size} ver ${m.ver}`).join(' ; '));
