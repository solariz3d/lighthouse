// [gen] record fields, step 1: the surface only (fields, declarations, stubs that do nothing), so the rows compile and are seen RED.
module.exports = [
  {
    file: 'game/world/run_record.h',
    old: `#include "game/world/world_settings.h"
`,
    new: `#include "game/world/world_settings.h"
#include "gen/src/gen.h"
`,
  },
  {
    file: 'game/world/run_record.h',
    old: `  sim::Replay       inputs;       // from the run's first tick; final_hash is the simulation's fingerprint at the end
  uint64_t          chase_hash = 0;   // the chase's fingerprint at the end
`,
    new: `  sim::Replay       inputs;       // from the run's first tick; final_hash is the simulation's fingerprint at the end
  uint64_t          chase_hash = 0;   // the chase's fingerprint at the end
  // The generator the run was played in (generator Lap 2, the record owner's Option 1: lighthouse p-record-owner-A_2026-11-13.md):
  // every gen/src/gen.h DZ_GEN_KIT field ([gen]) and the generator's dials ([gen_dials]). A text without them reads as GenParams{}:
  // the generator before the kit, with the dials' defaults. Only those fields are written and read; seed, force_biome and the rest
  // come from \`seed\` and \`world\`.
  gen::GenParams    gen;
  uint64_t          gen_world = 0;    // world_fingerprint of the world the run was played in; 0: not carried (every record before it)
`,
  },
  {
    file: 'game/world/run_record.h',
    old: `// The text file's contents, and back. read_run_text leaves \`out\` unchanged and returns a message on failure.`,
    new: `// The fingerprint of a world: gen::fingerprint of the chunk that holds the spawn cell, generated with these parameters. A record that
// carries one (gen_world) is refused on replay when this build's world under the same [gen] does not reach it: the generator changed
// outside its dials.
uint64_t world_fingerprint(const gen::GenParams& params);

// The text file's contents, and back. read_run_text leaves \`out\` unchanged and returns a message on failure.`,
  },
  {
    file: 'game/world/run_record.cpp',
    old: `std::string run_text(const RunRecord& r) {`,
    new: `uint64_t world_fingerprint(const gen::GenParams& params) {
  (void)params;
  return 0;  // STUB (the [gen] fields' step 1: the rows are seen red before this is written)
}

std::string run_text(const RunRecord& r) {`,
  },
  {
    file: 'game/world/world_app.h',
    old: `  void apply_speed(const chase::SpeedModel& model) { speed_ = model; }
`,
    new: `  void apply_speed(const chase::SpeedModel& model) { speed_ = model; }
  // The generator the next world is built with, in place of gen::shipped_gen() and the generator dials: a replay sets the record's own
  // [gen] and [gen_dials] (run_record.cpp). The seed, start_biome and streaming radii still come from the settings.
  void apply_gen(const gen::GenParams& params) { (void)params; }   // STUB (step 1)
`,
  },
];
