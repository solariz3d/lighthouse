// D172 mutants: textures part 1, on copies of app/, src/, test/, tools/. Live files are checked unchanged at the end.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const DOC = ['test/doc-textures.test.js', 'test/doc.test.js', 'test/doc-library.test.js'], MAP = ['test/texture-mapping.test.js'], IMG = ['test/texture-image.test.js'],
  SET = ['test/texture-set.test.js'], APP = ['app/test/texture-panel.test.js'];
const M = [
  ['D1 the text drops textures', 'src/doc/serial.js', ",` +\n    `${str('textures')}:${TX.text(w.textures, (x) => num('m', x))}`;", '`;', DOC],
  ['D2 migration gives no textures', 'src/doc/serial.js', 'const withTextures = (w) => ({ ...w, textures: {} });', 'const withTextures = (w) => ({ ...w });', DOC],
  ['D3 a string schema migrates', 'src/doc/serial.js', 'while (Number.isInteger(o.schema) && ', 'while (', DOC],
  ["D4 a loaded word's textures are not checked", 'src/doc/serial.js', 'const tp = TX.problem(w.textures, w.word);', 'const tp = null;', DOC],
  ['D5 loaded lengths are not quantised', 'src/doc/serial.js', "const qm = (v) => (typeof v === 'number' ? fromQ.m(toQ.m(v) || 0) : v);", 'const qm = (v) => v;', DOC],
  ['D6 a jump may take overrides', 'src/doc/textures.js', "if (word === 'jump' && slots.length) return", 'if (false) return', DOC],
  ['D7 null does not drop a slot', 'src/doc/textures.js', 'if (o === null) { delete out[s]; continue; }', 'if (o === null) continue;', APP],
  ['D8 any texture name', 'src/doc/textures.js', 'const NAME_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;', 'const NAME_RE = /./;', DOC],
  ['D9 the font wins over the word', 'src/doc/textures.js', '{ ...base[s], ...(over[s] || {}) }', '{ ...(over[s] || {}), ...base[s] }', DOC],
  ['D10 a schema-1 library is not migrated', 'src/doc/library.js', 'if (o.schema === 1) {', 'if (false) {', DOC],
  ["D11 an edit's textures are ignored", 'src/doc/document.js', 'const tx = TX.merge(body.textures, overrides.textures);', 'const tx = TX.merge(body.textures, undefined);', DOC],
  ['D12 ranges unchecked', 'src/doc/textures.js', 'v >= RANGE[k][0] && v <= RANGE[k][1]', 'true', DOC],
  ['M1 every column walks the edge line', 'src/texture/mapping.js', 'rows[r].map((p, k) => { const q = rows[r - 1][k];', 'rows[r].map((_, k) => { const p = rows[r][0], q = rows[r - 1][0];', MAP],
  ['M2 the right side runs inward', 'src/texture/mapping.js', "const across = side === 'R' ? u1 - us[k] : us[k] - u0;", 'const across = us[k] - u0;', MAP],
  ['M3 fit and tile swapped', 'src/texture/mapping.js', "fit === 'fit' ? across / w", "fit === 'tile' ? across / w", MAP],
  ['M4 dir ignored', 'src/texture/mapping.js', "if (dir === 'across')", 'if (false)', MAP],
  ['M5 offset subtracts', 'src/texture/mapping.js', '(along[r][k] + offset)', '(along[r][k] - offset)', MAP],
  ['M6 the wall starts at the knot', 'src/texture/mapping.js', 'return pa >= lim ? a : a + (b - a) * (lim - pa) / (pb - pa);', 'return b;', MAP],
  ['M7 kerb and line swap places', 'src/texture/mapping.js', "list: [['lines', line0, kerb0], ['kerbs', kerb0, wall0],", "list: [['kerbs', line0, kerb0], ['lines', kerb0, wall0],", MAP],
  ['M8 across by u, not from the band edge', 'src/texture/mapping.js', ': us[k] - u0;', ': us[k];', MAP],
  ['I1 Adler-32 unchecked', 'src/texture/inflate.js', 'if ((((b << 16) | a) >>> 0) !== want)', 'if (false)', IMG],
  ['I2 stored length unchecked', 'src/texture/inflate.js', 'if (len !== (~nlen & 0xffff))', 'if (false)', IMG],
  ['I3 fixed literal lengths off', 'src/texture/inflate.js', 'l.fill(9, 144, 256)', 'l.fill(9, 143, 256)', IMG],
  ['P1 Paeth tie-break', 'src/texture/png.js', 'v += pa <= pb && pa <= pc ? a', 'v += pa < pb && pa <= pc ? a', IMG],
  ['P2 average rounds up', 'src/texture/png.js', 'v += (a + c0) >> 1;', 'v += (a + c0 + 1) >> 1;', IMG],
  ['P3 CRC unchecked', 'src/texture/png.js', 'if (crc32(b, i + 4, d1) !== u32(b, d1))', 'if (false)', IMG],
  ['P4 16-bit keeps the low byte', 'src/texture/png.js', 'if (depth === 16) return rows[y * stride + k * 2];', 'if (depth === 16) return rows[y * stride + k * 2 + 1];', IMG],
  ['P5 palette alpha ignored', 'src/texture/png.js', 'trns && idx < trns.length ? trns[idx] : 255', '255', IMG],
  ['P6 interlaced accepted', 'src/texture/png.js', 'if (hdr.interlace === 1) throw', 'if (false) throw', IMG],
  ['P7 sub-byte bit order', 'src/texture/png.js', '(8 - depth - (bit & 7))', '(bit & 7)', IMG],
  ['J1 restart keeps predictors', 'src/texture/jpeg.js', 'pos += 2; rst++; for (const { c } of sc) c.pred = 0;', 'pos += 2; rst++;', IMG],
  ['J2 chroma not upsampled', 'src/texture/jpeg.js', 'Math.floor((y * c.v) / vmax) * c.bw * 8 + Math.floor((x * c.h) / hmax)', 'y * c.bw * 8 + x', IMG],
  ['J3 Cr coefficient wrong', 'src/texture/jpeg.js', 'clamp(Y + 1.402 * cr)', 'clamp(Y + 1.772 * cr)', IMG],
  ['J4 progressive accepted', 'src/texture/jpeg.js', "else if (m === 0xc2 || m === 0xc6 || m === 0xca || m === 0xce) throw unsupported('progressive encoding; save the image as baseline JPEG or as PNG');", '', IMG],
  ['J5 16-bit quant read as 8-bit', 'src/texture/jpeg.js', 'p ? (seg[i + 1 + k * 2] << 8) | seg[i + 2 + k * 2] : seg[i + 1 + k]', 'seg[i + 1 + k]', IMG],
  ['S1 RGBA order, not BGRA', 'src/texture/dds.js', 'out[o++] = p[i + 2]; out[o++] = p[i + 1]; out[o++] = p[i];', 'out[o++] = p[i]; out[o++] = p[i + 1]; out[o++] = p[i + 2];', IMG],
  ['S2 one mip too many', 'src/texture/dds.js', 'h32(6, levels.length);', 'h32(6, levels.length + 1);', IMG],
  ['S3 an odd side drops a texel', 'src/texture/dds.js', 'Math.max(a + 1, Math.floor(((i + 1) * N) / n))', 'Math.min(N, a + 2)', IMG],
  ['S4 no COMPLEX cap', 'src/texture/dds.js', 'h32(26, CAPS.TEXTURE | CAPS.MIPMAP | CAPS.COMPLEX);', 'h32(26, CAPS.TEXTURE | CAPS.MIPMAP);', IMG],
  ['S5 8192 allowed past', 'src/texture/dds.js', 'if (W > MAX_SIDE || H > MAX_SIDE) throw', 'if (false) throw', IMG],
  ['W1 NPOT not warned', 'src/texture/warnings.js', 'if (!pow2(W) || !pow2(H)) out.push', 'if (false) out.push', IMG],
  ['W2 compressed normal allowed', 'src/texture/warnings.js', "if (role === 'normal' && compress)", 'if (false)', IMG],
  ['W3 budget never over', 'src/texture/warnings.js', 'const over = bytes > limitBytes;', 'const over = false;', IMG],
  ['E1 a jump wears nothing', 'src/texture/set.js', 'const slots = eff || last;', 'const slots = eff;', SET],
  ['E2 every asset is exported', 'src/texture/set.js', 'for (const name of [...used.keys()].sort())', 'for (const name of Object.keys(assets).sort()) { used.set(name, assets[name]); }\n  for (const name of [...used.keys()].sort())', SET],
  ['E3 preview shows mip 1', 'src/texture/set.js', 'const l = ddsLevel(t.dds, 0);', 'const l = ddsLevel(t.dds, 1);', SET],
  ['E4 textures not appended', 'src/texture/set.js', 'textures: [...scene.textures, ...set.textures.map((t) => ({ name: t.file, data: toBuf(t.dds) }))]', 'textures: scene.textures', SET],
  ['E5 a missing texture passes', 'src/texture/set.js', 'if (!Object.prototype.hasOwnProperty.call(assets, t)) throw', 'if (false) throw', SET],
  ['E6 phrase words unnamed', 'src/texture/set.js', 'e.words.map((w, n) => ({ id: `${e.id}/${n + 1}`, w }))', 'e.words.map((w, n) => ({ id: e.id, w }))', SET],
  ['A1 a used image may be removed', 'app/texture/panel.js', 'if (u.length) return refuse', 'if (false) return refuse', APP],
  ['A2 a slot may name a missing image', 'app/texture/panel.js', 'if (patch.texture && !images.has(patch.texture)) return refuse', 'if (false) return refuse', APP],
  ['A3 duplicate names allowed', 'app/texture/panel.js', 'if (images.has(name)) return refuse', 'if (false) return refuse', APP],
];
const LIVE = [...new Set(M.map((m) => m[1]))].map((f) => path.join(REPO, f)), before = LIVE.map((f) => fs.readFileSync(f, 'utf8'));
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const only = process.argv[2] ? new RegExp(process.argv[2]) : null;
const t = { listed: 0, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, rel, from, to, tests] of M) {
  if (only && !only.test(name)) continue; t.listed++;
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd172-'));
  for (const d of ['app', 'src', 'tools', 'test']) copyDir(path.join(REPO, d), path.join(top, d));
  const f = path.join(top, rel); const src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); fs.rmSync(top, { recursive: true, force: true }); continue; }
  fs.writeFileSync(f, src.replace(from, () => to)); t.applied++;
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...tests], { cwd: top, encoding: 'utf8', timeout: 300000 });
  fs.rmSync(top, { recursive: true, force: true });
  const out = (r.stdout || '') + (r.stderr || ''), fail = /^# fail (\d+)/m.exec(out);
  if (!fail) { t.nr.push(name); console.log('NO RESULT', name, out.slice(-300)); continue; }
  if (r.status !== 0) { t.caught++; console.log('caught  ', name, `(${fail[1]} failing)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
}
console.log(`SUMMARY ${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live files ${LIVE.every((f, i) => fs.readFileSync(f, 'utf8') === before[i]) ? 'unchanged' : 'CHANGED'}`);
