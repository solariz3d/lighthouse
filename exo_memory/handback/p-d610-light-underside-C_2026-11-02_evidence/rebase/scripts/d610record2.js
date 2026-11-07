// d610record.js (D610, C; from O's d606record.js): test/fixtures/manifest.lighthull.json for the light hull. Every mesh node of F1 F2 must be the base's (6f0969e, whose kn5 is
// the D609 record's after) byte for byte but the drawn skins (UNDERSKIN_*), in the same order; every material record the same. Anything else stops it.
// node d610record.js <nodes-base.json> <nodes-d610.json> <manifest.d609.json> <out>
'use strict';
const fs = require('fs');
const [, , A, Tp, M609, OUT] = process.argv;
const a = JSON.parse(fs.readFileSync(A, 'utf8')), t = JSON.parse(fs.readFileSync(Tp, 'utf8')), d609 = JSON.parse(fs.readFileSync(M609, 'utf8'));
const SKIN = /^UNDERSKIN_/;
const fixtures = {};
for (const k of Object.keys(d609.fixtures)) {
  const before = a[k], after = t[k], prev = d609.fixtures[k].after_d609;
  if (before.kn5 !== prev.kn5 || before.kn5Bytes !== prev.kn5Bytes) throw new Error(`${k}: the base's kn5 is not the D609 record's after`);
  if (after.kn5 === before.kn5) throw new Error(`${k}: the kn5 did not change`);
  const restB = before.meshes.filter((m) => !SKIN.test(m.name)), restA = after.meshes.filter((m) => !SKIN.test(m.name));
  if (JSON.stringify(restB.map((m) => [m.name, m.full])) !== JSON.stringify(restA.map((m) => [m.name, m.full]))) throw new Error(`${k}: a node that is not a skin changed, or the order did`);
  const skinsB = before.meshes.filter((m) => SKIN.test(m.name)), skinsA = after.meshes.filter((m) => SKIN.test(m.name));
  if (!skinsA.length || skinsA.some((m) => !m.flags.visible || !m.flags.renderable)) throw new Error(`${k}: a skin is not drawn`);
  // every skin node sits where the skins were: the mesh list is the base's with its skins' places taken by the new skins
  const pattern = (L) => L.map((m) => (SKIN.test(m.name) ? 'S' : m.name)).join('|').replace(/(S\|)*S/g, 'S');
  if (pattern(before.meshes) !== pattern(after.meshes)) throw new Error(`${k}: the skins are not where the base's were`);
  if (JSON.stringify(before.materials) !== JSON.stringify(after.materials) || JSON.stringify(before.materialDigests) !== JSON.stringify(after.materialDigests)) throw new Error(`${k}: a material changed`);
  const { kn5: _k, kn5Bytes: _b, ...same } = prev;
  fixtures[k] = {
    before_light: prev,
    after_light: { ...same, kn5: after.kn5, kn5Bytes: after.kn5Bytes },
    measure: { changed: ['kn5'], kn5_meshes: after.meshes.length, kept_byte_for_byte: restA.map((m) => ({ name: m.name, full: m.full })), skins_before: skinsB.map((m) => ({ name: m.name, full: m.full })),
      skins_after: skinsA.map((m) => ({ name: m.name, full: m.full })), materials: after.materials, material_digests: after.materialDigests, materials_changed: [] },
  };
}
const rec = {
  amends: 'the D190 seal, row 5a, as already amended by D196, D222, D230, D258, D260, D279, the mesh cap, the sector gates, D460, D572, D593, D604 and D609; F1 F2 only, their kn5 digest only',
  made_at: '2026-11-02, the light hull: test/fixtures/kn5nodes.js over F1 F2 built as fixtures.js builds them, in two trees: 6f0969e (whose kn5 is the D609 record\'s after) and the same with src/export/lighthull.js.',
  reason: 'The hull\'s bottom is drawn with as few triangles as its shape and its image need (the user, 2026-11-02 07:01: "does the new apron and undertrack make more geometry to lag assetto? It should be optimized in a way to be simple and not as complex as the track itself that is driven on"; 07:05: "if people make cool underneath textures, the simplification must not mess with the image beyond the curve distortion"): src/export/lighthull.js redraws the skin of every stretch of plain cells with fewer columns across and, where the uv runs on, longer steps along, every kept vertex the full skin\'s own, no point of the full skin more than 2 cm from the point of the light one that carries its uv. So the two closed fixtures, which are exported, change their kn5 and nothing else: segs, path and mesh are unchanged in all nine; in the kn5 the road, the paint and the physics planks are the same bytes in the same order, only the drawn skins changed (fewer triangles; untextured, so only columns went), and no material record changed.',
  fixtures,
  unchanged: d609.unchanged,
};
fs.writeFileSync(OUT, JSON.stringify(rec, null, 1) + '\n');
for (const [k, v] of Object.entries(fixtures)) console.log(k, 'kept', v.measure.kept_byte_for_byte.length, 'skins', v.measure.skins_before.length, '->', v.measure.skins_after.length, 'kn5 bytes', v.before_light.kn5Bytes, '->', v.after_light.kn5Bytes);
