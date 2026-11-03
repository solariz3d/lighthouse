// mkrender.js (D622, O): render622.js = D593's render2.js plus a HIGHLIGHT: meshes whose name matches env HIGHLIGHT are tinted magenta where they are
// drawn (as AC draws them, back faces culled, depth-tested), outlined in yellow, and a view's optional `mark` [x,y,z] is ringed. Patched by anchors, each once.
const fs = require('fs');
const D = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-36313935/c88002b1-74d8-4036-8cc0-f64aefbeabff/scratchpad/';
let t = fs.readFileSync(D + 'd593/render2.js', 'utf8').replace(/\r\n/g, '\n');
const sub = (a, b) => { const n = t.split(a).length - 1; if (n !== 1) throw new Error(n + ' matches: ' + a.slice(0, 60)); t = t.replace(a, () => b); };
sub("require('./kn5full.js')", "require('../d593/kn5full.js')");
sub('const meshes = kn.meshes.filter((m) => m.renderable && m.visible);',
  'const meshes = kn.meshes.filter((m) => m.renderable && m.visible);\n' +
  'const HL = process.env.HIGHLIGHT ? new RegExp(process.env.HIGHLIGHT) : null;   // D622: the meshes to show the eye\n' +
  'console.log(`highlight ${HL}: ${meshes.filter((m) => HL && HL.test(m.name)).map((m) => m.name).join(", ") || "none"}`);');
sub('const rgb = Buffer.alloc(W * H * 3), zb = new Float32Array(W * H).fill(Infinity);',
  'const rgb = Buffer.alloc(W * H * 3), zb = new Float32Array(W * H).fill(Infinity), hm = new Uint8Array(W * H);');
sub('const mat = mats[m.material] || { amb: 0.5, dif: 0.5, levels: null }, P = m.pos,',
  'const hl = !!(HL && HL.test(m.name)), mat = mats[m.material] || { amb: 0.5, dif: 0.5, levels: null }, P = m.pos,');
sub('          zb[o] = z;\n', '          zb[o] = z; hm[o] = hl ? 1 : 0;\n');
sub('for (let ch = 0; ch < 3; ch++) rgb[o * 3 + ch] = Math.max(0, Math.min(255, Math.round(col[ch] * light * EXPOSURE * (1 - fog) + 210 * fog)));',
  'for (let ch = 0; ch < 3; ch++) { let c = col[ch] * light * EXPOSURE * (1 - fog) + 210 * fog; if (hl) c = 0.35 * c + 0.65 * [255, 30, 200][ch] * Math.min(1.2, 0.55 + 0.6 * light); rgb[o * 3 + ch] = Math.max(0, Math.min(255, Math.round(c))); }');
sub('  return png(rgb);\n}',
  '  // the outline: a highlighted pixel with a non-highlighted pixel within 3 px is drawn yellow\n' +
  '  let nhl = 0; const edge = new Uint8Array(W * H);\n' +
  '  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = y * W + x; if (!hm[o]) continue; nhl++;\n' +
  '    for (let d = 1; d <= 3 && !edge[o]; d++) for (const [dx, dy] of [[d, 0], [-d, 0], [0, d], [0, -d]]) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= W || Y >= H || !hm[Y * W + X]) { edge[o] = 1; break; } } }\n' +
  '  for (let o = 0; o < W * H; o++) if (edge[o]) { rgb[o * 3] = 255; rgb[o * 3 + 1] = 235; rgb[o * 3 + 2] = 0; }\n' +
  '  if (v.mark) { const q = toCam(v.mark); if (q[2] > near) { const cx = W / 2 + f * q[0] / q[2], cy = H / 2 - f * q[1] / q[2], r = v.markR || 60;\n' +
  '    for (let y = Math.max(0, Math.floor(cy - r - 6)); y <= Math.min(H - 1, cy + r + 6); y++) for (let x = Math.max(0, Math.floor(cx - r - 6)); x <= Math.min(W - 1, cx + r + 6); x++) {\n' +
  '      const dd = Math.hypot(x - cx, y - cy); if (Math.abs(dd - r) < 4) { const o = (y * W + x) * 3; rgb[o] = 255; rgb[o + 1] = 235; rgb[o + 2] = 0; } } } }\n' +
  '  console.log(`  ${v.name}: highlighted pixels ${nhl}`);\n' +
  '  return png(rgb);\n}');
// D622 second pass: HIGHLIGHT2 meshes tinted cyan (the surface being cut); with XRAY=1 the highlighted meshes are also rasterised with no culling, and where
// the nearest of them lies BEHIND what is drawn, the pixel gets magenta diagonal stripes (hidden hull, not what AC draws)
sub("const HL = process.env.HIGHLIGHT ? new RegExp(process.env.HIGHLIGHT) : null;",
  "const HL = process.env.HIGHLIGHT ? new RegExp(process.env.HIGHLIGHT) : null, HL2 = process.env.HIGHLIGHT2 ? new RegExp(process.env.HIGHLIGHT2) : null, XRAY = process.env.XRAY === '1';");
sub('hm = new Uint8Array(W * H);', 'hm = new Uint8Array(W * H), xz = new Float32Array(W * H).fill(Infinity);');
sub('const hl = !!(HL && HL.test(m.name)),', 'const hl = !!(HL && HL.test(m.name)), hl2 = !!(HL2 && HL2.test(m.name)),');
sub('if (dot(cross(sub(w[1], w[0]), sub(w[2], w[0])), sub(v.eye, w[0])) < 0) continue;',
  'const back = dot(cross(sub(w[1], w[0]), sub(w[2], w[0])), sub(v.eye, w[0])) < 0; if (back && !(hl && XRAY)) continue;');
sub('          if (z >= zb[o]) continue;\n', '          if (hl && z < xz[o]) xz[o] = z;\n          if (back || z >= zb[o]) continue;\n');
sub('if (hl) c = 0.35 * c + 0.65 * [255, 30, 200][ch] * Math.min(1.2, 0.55 + 0.6 * light);',
  'if (hl) c = 0.35 * c + 0.65 * [255, 30, 200][ch] * Math.min(1.2, 0.55 + 0.6 * light); else if (hl2) c = 0.45 * c + 0.55 * [0, 200, 255][ch] * Math.min(1.2, 0.55 + 0.6 * light);');
sub('  let nhl = 0; const edge',
  '  let nx = 0; if (XRAY) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = y * W + x; if (hm[o] || !(xz[o] < Infinity) || !(xz[o] > zb[o] + 0.02)) continue; nx++;\n' +
  '    if (((x + y) >> 3) % 2 === 0) { rgb[o * 3] = 255; rgb[o * 3 + 1] = 30; rgb[o * 3 + 2] = 200; } }\n' +
  '  if (XRAY) console.log(`  ${v.name}: hidden-hull pixels ${nx}`);\n' +
  '  let nhl = 0; const edge');
// XRAYTRI: a JSON {mesh: [triangle index]} limits the x-ray to those triangles (the hull triangles that cross the apron); a view's `near` cuts the scene
sub("XRAY = process.env.XRAY === '1';", "XRAY = process.env.XRAY === '1', XT = process.env.XRAYTRI ? JSON.parse(fs.readFileSync(process.env.XRAYTRI, 'utf8')) : null;");
sub('const back = dot(', 'const xt = !XT || (XT[m.name] && XT[m.name].includes(t / 3)), back = dot(');
sub('if (back && !(hl && XRAY)) continue;', 'if (back && !(hl && XRAY && xt)) continue;');
sub('if (hl && z < xz[o]) xz[o] = z;', 'if (hl && xt && z < xz[o]) xz[o] = z;');
sub('near = 0.05,', 'near = v.near || 0.05,');
// a view's `double`: the highlighted meshes are drawn double-sided there (a cutaway sees a shell edge-on), stated in the hand-back
sub('if (back && !(hl && XRAY && xt)) continue;', 'if (back && !(hl && (v.double || (XRAY && xt)))) continue;');
sub('          if (back || z >= zb[o]) continue;\n', '          if ((back && !(hl && v.double)) || z >= zb[o]) continue;\n');
fs.writeFileSync(D + 'd622/render622.js', t.replace(/^\/\/ render2\.js \(D593, O\)/, '// render622.js (D622, O; from D593 render2.js)'));
console.log('wrote render622.js');
