const T = 'C:/Users/nname/Desktop/a-d188-wt/';
const D = require(T + 'src/core/document.js'), { extend } = require(T + 'src/core/extend.js'), A = require(T + 'src/core/adapter.js'), { buildMesh } = require(T + 'src/geom/mesh.js'), { walkScene } = require(T + 'src/export/markers.js');
let d = extend(D.createDoc('x'), { length: 60 }); d = extend(d, { length: 60, transition: 40, targets: { c: 90 } });
const { segments, path } = A.toPath(d), mesh = buildMesh(path, segments);
console.log('mesh keys', Object.keys(mesh), 'state keys', Object.keys(mesh._state));
console.log('cell0', JSON.stringify(mesh.cells[0]).slice(0, 300));
const pc = mesh._state.pieces[35]; console.log('piece keys', Object.keys(pc), 'K', pc.K, 'cells', pc.cells && pc.cells.length, pc.cells && Object.keys(pc.cells[0]));
const w = walkScene(mesh.scene); console.log('walk', Object.keys(w), w.meshes.length, Object.keys(w.meshes[0]), w.meshes[0].name, w.meshes.map(m => m.name).slice(30, 34));
