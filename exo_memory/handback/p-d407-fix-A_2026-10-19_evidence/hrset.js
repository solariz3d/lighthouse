// hrset.js <worktree> <tag>: D407's covering set (the chair's ruling of 14:58Z: not the whole suite), whole files, under the heavy-run lock, concurrency 2
const { spawnSync } = require('child_process'); const wt = process.argv[2]; process.chdir(wt);
const FILES = [
  // the test files D407 adds, and C's mute guard it carries
  'app/test/release-ghost.test.js', 'app/test/release-frame.test.js', 'app/test/chrome-mute.test.js',
  // the ones the chair named
  'app/test/drag-ghost.test.js', 'app/test/drag-frame.test.js', 'test/core_turnby.test.js',
  // the mutation harnesses that name a file D407 touched (panel, trackmodel, mesh, path, profile, geom index, adapter, coreshell, preview, preview index, look)
  'app/test/core-mutation.test.js', 'app/test/mutation.test.js', 'app/test/core-close-mutation.test.js', 'app/test/core-xsec-mutation.test.js', 'app/test/theme-mutation.test.js',
  'test/geom_mutation.test.js', 'test/core_xsec_mutation.test.js', 'test/core_chord_mutation.test.js', 'test/core_cup_mutation.test.js', 'test/core_water_mutation.test.js', 'test/core_jump_mutation.test.js', 'test/lookmatch_mutation.test.js',
  // the unit tests of the touched modules
  'app/test/cheap-ghost.test.js', 'app/test/handles.test.js', 'app/test/preview-undo.test.js', 'app/test/core-spawns.test.js', 'app/test/core-spawns-ui.test.js', 'app/test/core-spawndrag.test.js',
  'test/core_adapter.test.js', 'test/geom_mesh.test.js', 'test/geom_mesh_rows.test.js', 'test/geom_path.test.js', 'test/geom_grow.test.js', 'test/geom_sculpt.test.js', 'test/geom_sealed.test.js', 'test/geom_ramp.test.js', 'test/geom_loop.test.js',
];
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 A D407 covering set ' + (process.argv[3] || '') });
console.log('lock held', new Date().toISOString(), FILES.length, 'files');
const r = spawnSync(process.execPath, ['--test', '--test-concurrency=2', '--test-timeout=900000', ...FILES], { stdio: 'inherit' });
console.log('set exit', r.status, new Date().toISOString()); process.exit(r.status);
