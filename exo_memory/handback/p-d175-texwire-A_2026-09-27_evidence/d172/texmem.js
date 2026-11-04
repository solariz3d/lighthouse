// texmem.js: embedded texture bytes per track, for the eleven T-180 tracks of results/t180.json (FINDINGS §1).
// Reads ONLY each kn5's texture block (sizes + each DDS header), never the rest, and writes nothing.
// node texmem.js > texmem.json
const fs = require('fs'), path = require('path');
const AC = 'G:/SteamLibrary/steamapps/common/assettocorsa/content/tracks';
const tracks = require('C:/Users/nname/Desktop/t180-track-builder/results/t180.json').map((t) => t.track);
function kn5Textures(file) {
  const fd = fs.openSync(file, 'r'); let o = 0;
  const rd = (n) => { const b = Buffer.alloc(n); fs.readSync(fd, b, 0, n, o); o += n; return b; };
  try {
    if (rd(6).toString('latin1') !== 'sc6969') return null;
    const version = rd(4).readUInt32LE(0); if (version > 5) o += 4;
    const n = rd(4).readInt32LE(0), out = [];
    for (let k = 0; k < n; k++) {
      o += 4; const l = rd(4).readInt32LE(0), name = rd(l).toString('utf8'), size = rd(4).readInt32LE(0);
      const h = Buffer.alloc(Math.min(128, size)); fs.readSync(fd, h, 0, h.length, o); o += size;
      const dds = h.length >= 128 && h.toString('latin1', 0, 4) === 'DDS ';
      out.push({ name, size, w: dds ? h.readUInt32LE(16) : null, h: dds ? h.readUInt32LE(12) : null, mips: dds ? h.readUInt32LE(28) : null,
        fourCC: dds ? (h.readUInt32LE(84) ? h.toString('latin1', 84, 88) : 'RGB' + h.readUInt32LE(88)) : h.toString('latin1', 1, 4) });
    }
    return out;
  } finally { fs.closeSync(fd); }
}
const rows = [];
for (const t of tracks) {
  const dir = path.join(AC, t); if (!fs.existsSync(dir)) { rows.push({ track: t, missing: true }); continue; }
  const kn5s = fs.readdirSync(dir).filter((f) => /\.kn5$/i.test(f));
  let bytes = 0, count = 0, largest = 0; const formats = {};
  for (const f of kn5s) {
    const tx = kn5Textures(path.join(dir, f)) || [];
    for (const x of tx) { bytes += x.size; count++; largest = Math.max(largest, (x.w || 0) * (x.h || 0) ? Math.max(x.w, x.h) : 0); formats[x.fourCC] = (formats[x.fourCC] || 0) + x.size; }
  }
  rows.push({ track: t, kn5: kn5s.length, textures: count, MiB: +(bytes / 1048576).toFixed(1), bytes, largestSide: largest, formats: Object.fromEntries(Object.entries(formats).map(([k, v]) => [k, +(v / 1048576).toFixed(1)])) });
}
console.log(JSON.stringify(rows, null, 1));
