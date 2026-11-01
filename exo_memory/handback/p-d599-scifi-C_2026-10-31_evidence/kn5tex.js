// kn5tex.js <kn5>: the texture entries at the head of a kn5 (magic sc6969, version, [extra int if version > 5], count, then type, name, size, bytes each)
const fs = require('fs'), b = fs.readFileSync(process.argv[2]); let o = 0;
const magic = b.toString('latin1', 0, 6); o = 6; const ver = b.readInt32LE(o); o += 4; if (ver > 5) o += 4;
const n = b.readInt32LE(o); o += 4; console.log(`magic ${magic} version ${ver} textures ${n}`);
for (let i = 0; i < n; i++) { o += 4; const l = b.readInt32LE(o); o += 4; const name = b.toString('utf8', o, o + l); o += l; const sz = b.readInt32LE(o); o += 4;
  const sha = require('crypto').createHash('sha256').update(b.subarray(o, o + sz)).digest('hex'); o += sz; console.log(`  ${name}  ${sz} B  sha256 ${sha.slice(0, 16)}…`); }
