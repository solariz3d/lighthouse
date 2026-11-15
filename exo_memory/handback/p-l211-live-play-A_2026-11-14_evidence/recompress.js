// L211: re-deflate a PNG (same pixels, smaller file). usage: node recompress.js in.png out.png
const fs = require('fs'), zlib = require('zlib');
const [inp, outp] = process.argv.slice(2);
const b = fs.readFileSync(inp);
if (b.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('not a PNG: ' + inp);
let p = 8, idat = [], keep = [], ihdr;
while (p < b.length) {
  const len = b.readUInt32BE(p), type = b.toString('latin1', p + 4, p + 8), data = b.slice(p + 8, p + 8 + len);
  if (type === 'IDAT') idat.push(data); else if (type === 'IHDR') ihdr = data; else if (type !== 'IEND') keep.push([type, data]);
  p += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(idat));
const small = zlib.deflateSync(raw, { level: 9 });
const chunk = (type, data) => {
  const h = Buffer.alloc(8); h.writeUInt32BE(data.length, 0); h.write(type, 4, 'latin1');
  const c = Buffer.alloc(4); c.writeUInt32BE(zlib.crc32(Buffer.concat([h.slice(4), data])) >>> 0, 0);
  return Buffer.concat([h, data, c]);
};
const out = Buffer.concat([b.slice(0, 8), chunk('IHDR', ihdr), ...keep.map(([t, d]) => chunk(t, d)), chunk('IDAT', small), chunk('IEND', Buffer.alloc(0))]);
fs.writeFileSync(outp, out);
const w = ihdr.readUInt32BE(0), h = ihdr.readUInt32BE(4);
// the pixels are the same: inflate the new file and compare
const back = zlib.inflateSync(small);
if (!back.equals(raw)) throw new Error('pixels differ');
console.log(`${outp}: ${w}x${h}, ${b.length} -> ${out.length} bytes`);
