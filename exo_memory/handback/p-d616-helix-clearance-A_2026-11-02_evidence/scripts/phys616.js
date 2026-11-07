// phys616.js <old kn5> <new kn5>: are the physics meshes (names starting with a digit) the same, position for position? and which drawn meshes changed
const { readKn5 } = require('C:/Users/nname/Downloads/t180-wt-a614/tools/kn5.cjs'); const crypto = require('crypto');
const h = (m) => crypto.createHash('sha256').update(Buffer.from(m.pos.buffer)).update(Buffer.from(m.idx.buffer)).digest('hex').slice(0, 12);
const A = readKn5(process.argv[2]), B = readKn5(process.argv[3]);
const ma = new Map(A.meshes.map((m) => [m.name, m])), mb = new Map(B.meshes.map((m) => [m.name, m]));
const st = { same: 0, diff: [], onlyOld: [], onlyNew: [] };
for (const [n, m] of ma) { if (!/^\d/.test(n)) continue; const o = mb.get(n); if (!o) st.onlyOld.push(n); else if (h(m) === h(o) && m.material === o.material) st.same++; else st.diff.push(n + ' ' + h(m) + ' ' + h(o) + ' ' + m.material + '/' + o.material); }
for (const n of mb.keys()) if (/^\d/.test(n) && !ma.has(n)) st.onlyNew.push(n);
console.log('physics meshes same', st.same, 'differ', st.diff.length, 'only old', st.onlyOld.length, 'only new', st.onlyNew.length);
console.log(st.diff.slice(0, 20).join('\n')); console.log('only old:', st.onlyOld.join(' ')); console.log('only new:', st.onlyNew.join(' '));
