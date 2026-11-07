// rebase-cup.js: the light hull's amendment of test/core_cup_fixtures.test.js, put onto 6f0969e's (D609's) version. Run from the worktree root.
// Every replacement must apply exactly once. The file is CRLF; edited as LF and written back CRLF.
'use strict';
const fs = require('fs');
const F = 'test/core_cup_fixtures.test.js';
let s = fs.readFileSync(F, 'utf8');
const crlf = s.includes('\r\n'); s = s.replace(/\r\n/g, '\n');
const ed = (a, b) => { const k = s.split(a).length - 1; if (k !== 1) throw new Error(`${k} of ${JSON.stringify(a.slice(0, 80))}`); s = s.replace(a, () => b); };

ed(`// against f1f3416 (whose kn5 is the D604 record's after); its row builds F1 F2 NOW, and the D593 and D604 rows hold what D609 moved to that record.\n`,
`// against f1f3416 (whose kn5 is the D604 record's after); its row builds F1 F2 NOW, and the D593 and D604 rows hold what D609 moved to that record.
// AMENDED BY NAME FOR THE LIGHT HULL (the user, 2026-11-02 07:01: "does the new apron and undertrack make more geometry to lag assetto?"; 07:05: "if people make cool underneath
// textures, the simplification must not mess with the image beyond the curve distortion"): the hull's bottom is drawn lighter (src/export/lighthull.js), each kept
// vertex the full skin's own. That changes the kn5 of F1 F2 and nothing else: every node but the drawn skins is the same bytes in the same order, the skins are
// fewer triangles (and, as the export's chunks start where they now start, their chunk names moved), and no material record changed.
// test/fixtures/manifest.lighthull.json records it against 6f0969e (whose kn5 is the D609 record's after); its row builds F1 F2 NOW, and the D593, D604 and D609
// rows leave the skins to it.
`);
ed(`const LEAN_CHANGED = ['F1-bowl-default-lap-closed', 'F2-halfpipe-default-lap-closed'];\n`,
`const LEAN_CHANGED = ['F1-bowl-default-lap-closed', 'F2-halfpipe-default-lap-closed'];
// the light hull: F1 F2's kn5, and nothing else, change; manifest.lighthull.json records it, mesh by mesh
const AMEND14 = JSON.parse(fs.readFileSync(path.join(FX, 'manifest.lighthull.json'), 'utf8'));
const LIGHT_CHANGED = ['F1-bowl-default-lap-closed', 'F2-halfpipe-default-lap-closed'];
`);
ed(`v.after_d609; man.fixtures[k].render = JSON.parse(JSON.stringify(digests)); }   // D609\n`,
`v.after_d609; man.fixtures[k].render = JSON.parse(JSON.stringify(digests)); }   // D609
  for (const [k, v] of Object.entries(AMEND14.fixtures)) { const { kn5Bytes, ...digests } = v.after_light; man.fixtures[k].render = JSON.parse(JSON.stringify(digests)); }   // the light hull
`);
ed(`  assert.deepEqual([...AMEND13.unchanged].sort(), Object.keys(MANIFEST.fixtures).filter((k) => !LEAN_CHANGED.includes(k)).sort());\n`,
`  assert.deepEqual([...AMEND13.unchanged].sort(), Object.keys(MANIFEST.fixtures).filter((k) => !LEAN_CHANGED.includes(k)).sort());
  assert.equal(sha(fs.readFileSync(path.join(FX, 'manifest.lighthull.json'))), 'LIGHT_PIN');   // the light hull
  assert.deepEqual(Object.keys(AMEND14.fixtures), LIGHT_CHANGED);
  assert.deepEqual([...AMEND14.unchanged].sort(), Object.keys(MANIFEST.fixtures).filter((k) => !LIGHT_CHANGED.includes(k)).sort());
`);
// the D593 row: the skins held by place, not by name
ed(`    assert.deepEqual(now.meshes.map((x) => x.name), m.meshes_kept_byte_for_byte.map((x) => x.name).filter((n) => !gone.has(n)), \`\${k}: the mesh nodes are not a93ae51's but the joins, by name and in order\`);
    assert.deepEqual(now.meshes.filter((x) => !slab.has(x.name)).map((x) => [x.name, x.full]), m.meshes_kept_byte_for_byte.filter((x) => !slab.has(x.name)).map((x) => [x.name, x.full]), \`\${k}: a mesh node is not a93ae51's, byte for byte\`);
`,
`    // AMENDED (the light hull): the skins are its record's (manifest.lighthull.json, its own row): here they are held by place, not by name (the light hull moved where chunks start)
    const place = (n) => (/^UNDERSKIN_/.test(n) ? 'UNDERSKIN_' : n);
    assert.deepEqual(now.meshes.map((x) => place(x.name)), m.meshes_kept_byte_for_byte.map((x) => x.name).filter((n) => !gone.has(n)).map(place), \`\${k}: the mesh nodes are not a93ae51's but the joins, by name and in order\`);
    assert.deepEqual(now.meshes.filter((x) => !slab.has(x.name) && !/^UNDERSKIN_/.test(x.name)).map((x) => [x.name, x.full]), m.meshes_kept_byte_for_byte.filter((x) => !slab.has(x.name) && !/^UNDERSKIN_/.test(x.name)).map((x) => [x.name, x.full]), \`\${k}: a mesh node is not a93ae51's, byte for byte\`);
`);
// the D604 row: after D609's nodes, the skins are the light hull's
ed(`    for (const x of AMEND13.fixtures[k].measure.moved) { assert.equal(x.before, want.get(x.name), \`\${k}: D609's before of \${x.name} is not this record's\`); want.set(x.name, x.full); }\n`,
`    for (const x of AMEND13.fixtures[k].measure.moved) { assert.equal(x.before, want.get(x.name), \`\${k}: D609's before of \${x.name} is not this record's\`); want.set(x.name, x.full); }
    // AMENDED (the light hull): the skins built now are its record's (manifest.lighthull.json, its own row), every other node as above
    for (const n of [...want.keys()]) if (/^UNDERSKIN_/.test(n)) want.delete(n);
    for (const x of AMEND14.fixtures[k].measure.skins_after) want.set(x.name, x.full);
`);
// the D609 row: likewise
ed(`    const now = kn5Nodes(fixtureKn5(k)), want = new Map([...m.kept_byte_for_byte, ...m.moved].map((x) => [x.name, x.full]));
    assert.equal(now.meshes.length, m.kn5_meshes); assert.equal(now.meshes.length, m12.kn5_meshes, \`\${k}: a node was added or removed\`);
`,
`    const now = kn5Nodes(fixtureKn5(k)), want = new Map([...m.kept_byte_for_byte, ...m.moved].map((x) => [x.name, x.full]));
    // AMENDED (the light hull): the skins built now are its record's (manifest.lighthull.json, its own row), every other node this record's
    for (const n of [...want.keys()]) if (/^UNDERSKIN_/.test(n)) want.delete(n);
    for (const x of AMEND14.fixtures[k].measure.skins_after) want.set(x.name, x.full);
    assert.equal(now.meshes.length, m.kn5_meshes); assert.equal(now.meshes.length, m12.kn5_meshes, \`\${k}: a node was added or removed\`);
`);
// the light hull's own row, at the end of the file
s = s.replace(/\n*$/, '\n') + `test('the light hull\\'s amendment record: only F1 F2 changed, only their kn5, and it is smaller; built now, every node but the drawn skins is the base\\'s byte for byte in the same order, the skins are the record\\'s, and no material record changed', () => {
  assert.deepEqual(Object.keys(AMEND14.fixtures), LIGHT_CHANGED);
  for (const [k, v] of Object.entries(AMEND14.fixtures)) {
    assert.deepEqual(v.before_light, AMEND13.fixtures[k].after_d609, \`\${k}: "before" is the record it was last amended by (D609), as 6f0969e built it\`);
    for (const d of ['segs', 'path', 'mesh', 'meshParts']) assert.equal(v.after_light[d], v.before_light[d], \`\${k}: \${d} changed (the road must not move)\`);
    assert.notEqual(v.after_light.kn5, v.before_light.kn5, \`\${k}: the kn5 did not change\`);
    assert.ok(v.after_light.kn5Bytes < v.before_light.kn5Bytes, \`\${k}: the kn5 is not smaller (\${v.after_light.kn5Bytes} against \${v.before_light.kn5Bytes})\`);
    const m = v.measure, m13 = AMEND13.fixtures[k].measure;
    assert.deepEqual(m.changed, ['kn5']); assert.deepEqual(m.materials_changed, []);
    // the nodes kept are the ones D609's record holds (kept or moved), byte for byte: every one but the skins
    const was = new Map([...m13.kept_byte_for_byte, ...m13.moved].filter((x) => !/^UNDERSKIN_/.test(x.name)).map((x) => [x.name, x.full]));
    assert.deepEqual(m.kept_byte_for_byte.map((x) => x.name).sort(), [...was.keys()].sort(), \`\${k}: the nodes kept are not the ones D609's record holds\`);
    for (const x of m.kept_byte_for_byte) assert.equal(x.full, was.get(x.name), \`\${k}: \${x.name} is named kept but is not D609's\`);
    assert.ok(m.skins_after.length > 0 && m.skins_after.every((x) => /^UNDERSKIN_/.test(x.name)) && m.skins_before.every((x) => /^UNDERSKIN_/.test(x.name)), \`\${k}: only the skins changed\`);
    // built NOW: every node and material as the record says
    const now = kn5Nodes(fixtureKn5(k)), want = new Map([...m.kept_byte_for_byte, ...m.skins_after].map((x) => [x.name, x.full]));
    assert.equal(now.meshes.length, m.kn5_meshes);
    assert.deepEqual(now.meshes.filter((x) => !/^UNDERSKIN_/.test(x.name)).map((x) => x.name), m.kept_byte_for_byte.map((x) => x.name), \`\${k}: the nodes that are not skins are not the base's, in order\`);
    for (const x of now.meshes) assert.equal(x.full, want.get(x.name), \`\${k}: \${x.name} is not the record's, byte for byte\`);
    assert.deepEqual(now.materials, m.materials); assert.deepEqual(now.materialDigests, m.material_digests, \`\${k}: a material is not the record's\`);
    for (const x of now.meshes.filter((y) => /^UNDERSKIN_/.test(y.name))) assert.ok(x.flags.visible && x.flags.renderable, \`\${k}: \${x.name} is not drawn\`);
  }
});
`;
fs.writeFileSync(F, crlf ? s.replace(/\n/g, '\r\n') : s);
console.log('cup rebased', crlf ? 'CRLF' : 'LF');
