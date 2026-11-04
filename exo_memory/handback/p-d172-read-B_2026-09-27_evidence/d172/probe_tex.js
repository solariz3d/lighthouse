// B's independent probe of D172 (textures part 1), against the landing worktree. Images are made HERE with node's zlib,
// not with A's encoder; the DDS is parsed HERE by the Microsoft header layout, not with A's reader.
'use strict';
const zlib = require('zlib');
const WT = 'C:/Users/nname/AppData/Local/Temp/b-d172land-wt/';
const T = require(WT + 'src/texture/index.js');
const D = require(WT + 'src/doc/index.js');
const { writeKn5 } = require(WT + 'src/export/kn5write.js');
const out = [];
const ok = (name, cond, extra = '') => out.push(`${cond ? 'PASS' : 'FAIL'} ${name}${extra ? ' — ' + extra : ''}`);

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td) >>> 0);
  return Buffer.concat([len, td, crc]);
}
function png(W, H, px) {  // RGBA8, filter 0 on every row
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc(H * (1 + W * 4));
  for (let y = 0; y < H; y++) { raw[y * (1 + W * 4)] = 0; for (let x = 0; x < W; x++) for (let c = 0; c < 4; c++) raw[y * (1 + W * 4) + 1 + x * 4 + c] = px(x, y)[c]; }
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const px = (x, y) => [x * 40 & 255, y * 60 & 255, (x * 7 + y * 13) & 255, 200 + x];

// 1. PNG -> DDS, 5×3 (odd, not a power of two)
const W = 5, H = 3, src = png(W, H, px);
const img = T.decodeImage(src);
ok('PNG decodes to the pixels written', img.width === W && img.height === H && [...Array(W * H).keys()].every((i) => { const p = px(i % W, Math.floor(i / W)); return p.every((v, c) => img.rgba[i * 4 + c] === v); }));
const dds = Buffer.from(T.dds.encodeDds(img));
const u32 = (o) => dds.readUInt32LE(o);
ok('DDS magic and header size', dds.toString('ascii', 0, 4) === 'DDS ' && u32(4) === 124);
ok('DDS height/width/pitch', u32(12) === H && u32(16) === W && u32(20) === W * 4, `${u32(12)}×${u32(16)} pitch ${u32(20)}`);
const flags = u32(8);
ok('DDSD flags have MIPMAPCOUNT (0x20000)', (flags & 0x20000) !== 0, `0x${flags.toString(16)}`);
const expectMips = Math.floor(Math.log2(Math.max(W, H))) + 1;   // 5×3 -> 3: 5×3, 2×1, 1×1
ok('mip count is the full chain', u32(28) === expectMips, `${u32(28)} vs ${expectMips}`);
ok('pixel format A8R8G8B8 (32 bpp, masks)', u32(76) === 32 && u32(88) === 32 && u32(92) === 0xff0000 && u32(96) === 0xff00 && u32(100) === 0xff && u32(104) === 0xff000000);
ok('caps TEXTURE|MIPMAP|COMPLEX', u32(108) === (0x1000 | 0x400000 | 0x8));
let sz = 0, w = W, h = H; for (let i = 0; i < expectMips; i++) { sz += w * h * 4; w = Math.max(1, w >> 1); h = Math.max(1, h >> 1); }
ok('file size = header + every level', dds.length === 128 + sz, `${dds.length} vs ${128 + sz}`);
ok('level 0 texel (4,2) is BGRA of the source', (() => { const i = 128 + (2 * W + 4) * 4, p = px(4, 2); return dds[i] === p[2] && dds[i + 1] === p[1] && dds[i + 2] === p[0] && dds[i + 3] === p[3]; })());

// 2. refusals
const prog = Buffer.from([0xff, 0xd8, 0xff, 0xc2, 0x00, 0x0b, 0x08, 0x00, 0x10, 0x00, 0x10, 0x01, 0x01, 0x11, 0x00, 0xff, 0xd9]);
let code = null; try { T.decodeImage(prog); } catch (e) { code = e.code; }
ok('progressive JPEG (SOF2) refused by name', code === 'TEXTURE_UNSUPPORTED', String(code));
const il = png(2, 2, px); const ilb = Buffer.from(il); ilb[8 + 8 + 12] = 1; // IHDR interlace byte
const ihdrData = ilb.subarray(12, 12 + 4 + 13); ilb.writeUInt32BE(zlib.crc32(ihdrData) >>> 0, 12 + 4 + 13);
code = null; try { T.decodeImage(ilb); } catch (e) { code = e.code; }
ok('interlaced PNG refused by name', code === 'TEXTURE_UNSUPPORTED', String(code));
code = null; try { T.decodeImage(dds); } catch (e) { code = e.code; }
ok('a DDS brought as a source is refused', code === 'NOT_AN_IMAGE', String(code));
code = null; try { T.dds.encodeDds({ width: 8193, height: 1, rgba: new Uint8Array(8193 * 4) }); } catch (e) { code = e.code; }
ok('8193 px refused', code === 'TEXTURE_TOO_LARGE', String(code));

// 3. document slots -> set -> kn5; preview equals the kn5's embedded DDS
let d = D.createDoc('p');
d = D.appendWord(d, 'straight'); d = D.appendWord(d, 'turn');
d = D.editWord(d, 'w2', { textures: { floor: { texture: 'grid5', tileLength: 7.5 } } });
const text = D.serialize(d);
ok('schema 2 on save, textures written', /"schema": 2,/.test(text) && /"textures":\{"floor":\{"texture":"grid5","tileLength":7.5\}\}/.test(text));
ok('save/load byte-exact with an override', D.serialize(D.parse(text)) === text);
const set = T.buildTextureSet(d, { grid5: { bytes: src }, unused: { bytes: src } });
ok('only used textures converted', set.textures.length === 1 && set.textures[0].name === 'grid5');
ok('w1 floor has no texture, w2 floor has grid5', set.bySegment('w1').floor.settings.texture === null && set.bySegment('w2').floor.settings.texture === 'grid5' && set.bySegment('w2').floor.settings.tileLength === 7.5);
const scene0 = { textures: [], materials: [{ name: 'm', shader: 'ksPerPixel', alphaBlend: 0, alphaTested: false, depthMode: 0, props: [], samplers: [] }],
  root: { type: 'dummy', name: 'root', matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], children: [] } };
const { scene } = T.applyToScene(scene0, set);
const kn5 = writeKn5(scene);
const idx = kn5.indexOf(Buffer.from(dds.subarray(0, 128)));
const prev = T.previewTextures(set)[0];
ok('kn5 carries the DDS bytes', idx > 0 && Buffer.compare(kn5.subarray(idx, idx + dds.length), dds) === 0);
ok('preview level 0 equals the source pixels (lossless path)', prev.width === W && prev.height === H && Buffer.compare(Buffer.from(prev.rgba), Buffer.from(img.rgba)) === 0);

// 4. a schema-1 document with a phrase migrates
const t1 = text.replace('"schema": 2', '"schema": 1').replace(/,"textures":\{[^}]*\}\}?\}?/g, (m) => '');
let mig = null; try { mig = D.parse(t1.replace(/,"textures":\{\}/g, '')); } catch (e) { mig = e; }
ok('schema-1 text (no textures keys) loads as schema 2', mig && mig.schema === 2, mig && mig.message);
console.log(out.join('\n'));
console.log(`${out.filter((l) => l.startsWith('PASS')).length}/${out.length} PASS`);
