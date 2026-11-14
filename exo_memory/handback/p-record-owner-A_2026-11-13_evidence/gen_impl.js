// [gen] record fields, step 2: the behaviour (applied after the rows were seen red against the stubs).
module.exports = [
  // --- run_record.cpp: the fingerprint
  {
    file: 'game/world/run_record.cpp',
    old: `uint64_t world_fingerprint(const gen::GenParams& params) {
  (void)params;
  return 0;  // STUB (the [gen] fields' step 1: the rows are seen red before this is written)
}`,
    new: `uint64_t world_fingerprint(const gen::GenParams& params) {
  gen::Generator   g(params);
  const gen::Spawn s = g.spawn();
  const auto       down = [](int32_t v, int32_t n) { return v >= 0 ? v / n : -((-v + n - 1) / n); };   // toward minus infinity
  return gen::fingerprint(g.generate({down(s.x, gen::kChunkCells), down(s.y, gen::kChunkStoreys), down(s.z, gen::kChunkCells)}));
}`,
  },
  // --- run_record.cpp: writing
  {
    file: 'game/world/run_record.cpp',
    old: `  o << "chase_hash    = " << hex64(r.chase_hash) << "\\n";`,
    new: `  o << "chase_hash    = " << hex64(r.chase_hash) << "\\n";
  o << "gen_world     = " << hex64(r.gen_world) << "\\n";`,
  },
  {
    file: 'game/world/run_record.cpp',
    old: `  o << "\\n[events]\\n";`,
    new: `  o << "\\n[gen]\\n# the generator the run was played in (gen/src/gen.h DZ_GEN_KIT), every field; one left out reads as GenParams{}'s: the generator before the kit\\n";
#define DZ_RUN_GEN(name, off, on, field, desc) o << #name << " = " << num(r.gen.field) << "\\n";
  DZ_GEN_KIT(DZ_RUN_GEN)
#undef DZ_RUN_GEN
  o << "\\n[gen_dials]\\n# the generator's dials (gen/src/gen.h kDialSpecs), every one; one left out reads as its default\\n";
  for (const gen::DialSpec& d : gen::kDialSpecs) o << d.name << " = " << num(r.gen.dials.*d.field) << "\\n";
  o << "\\n[events]\\n";`,
  },
  // --- run_record.cpp: reading
  {
    file: 'game/world/run_record.cpp',
    old: `  std::string params_text, world_text, speed_text;`,
    new: `  std::string params_text, world_text, speed_text, gen_text;`,
  },
  {
    file: 'game/world/run_record.cpp',
    old: `    if (section == "[speed]") {   // collected as name=value; and read by the speed model's own parser, so its checks are the record's
      speed_text += name + "=" + value + ";";
      continue;
    }`,
    new: `    if (section == "[speed]") {   // collected as name=value; and read by the speed model's own parser, so its checks are the record's
      speed_text += name + "=" + value + ";";
      continue;
    }
    if (section == "[gen]") {     // the same, read by the generator's own parser (gen::set_gen): an unknown field is refused there
      gen_text += name + "=" + value + ";";
      continue;
    }
    if (section == "[gen_dials]") {
      bool found = false;
      for (const gen::DialSpec& d : gen::kDialSpecs) {
        if (name != d.name) continue;
        if (!to_float(value, r.gen.dials.*d.field)) return fail("not a number");
        found = true;
      }
      if (!found) return fail("unknown generator dial '" + name + "'");
      continue;
    }`,
  },
  {
    file: 'game/world/run_record.cpp',
    old: `      else if (name == "chase_hash") { if (!to_u64(value, u, 16)) return fail("not a fingerprint"); r.chase_hash = u; }`,
    new: `      else if (name == "chase_hash") { if (!to_u64(value, u, 16)) return fail("not a fingerprint"); r.chase_hash = u; }
      else if (name == "gen_world") { if (!to_u64(value, u, 16)) return fail("not a fingerprint"); r.gen_world = u; }`,
  },
  {
    file: 'game/world/run_record.cpp',
    old: `  if (std::string err = chase::set_speed(r.speed, speed_text); !err.empty()) return "[speed]: " + err;`,
    new: `  if (std::string err = chase::set_speed(r.speed, speed_text); !err.empty()) return "[speed]: " + err;
  if (std::string err = gen::set_gen(r.gen, gen_text); !err.empty()) return "[gen]: " + err;   // r.gen began as GenParams{}: a field not listed is off`,
  },
  // --- run_record.cpp: the replay
  {
    file: 'game/world/run_record.cpp',
    old: `  app.apply_world_settings(w);
  app.set_seed(record.seed);   // the world again, with the record's streaming radii`,
    new: `  app.apply_world_settings(w);
  app.apply_gen(record.gen);   // the generator the run was played in (a record from before [gen]: GenParams{}, the generator before the kit)
  app.set_seed(record.seed);   // the world again, with the record's streaming radii
  if (record.gen_world != 0 && world_fingerprint(app.gen_params()) != record.gen_world) {
    out.error = "this record's world is not this build's under the same generator settings: the generator changed outside its dials";
    return out;
  }`,
  },
  // --- world_app: the generator a world is built with, and the run's snapshot
  {
    file: 'game/world/world_app.h',
    old: `  void apply_gen(const gen::GenParams& params) { (void)params; }   // STUB (step 1)`,
    new: `  void apply_gen(const gen::GenParams& params) { gen_base_ = params, has_gen_base_ = true; }`,
  },
  {
    file: 'game/world/world_app.h',
    old: `  chase::SpeedModel run_speed_;                        // the model the run being played began with`,
    new: `  chase::SpeedModel run_speed_;                        // the model the run being played began with
  gen::GenParams    gen_base_;                         // apply_gen's: the generator a world is built with, when has_gen_base_
  bool              has_gen_base_ = false;             // false: gen::shipped_gen() and gen_dials_
  gen::GenParams    run_gen_;                          // the generator of the world the run being played began in`,
  },
  {
    file: 'game/world/world_app.cpp',
    old: `  gen_ = gen::shipped_gen();   // a new run is played in the kit's world; a replay's record says its own ([gen], A's)
  gen_.seed = static_cast<uint32_t>(world_settings_.seed);
  gen_.dials = gen_dials_;`,
    new: `  gen_ = has_gen_base_ ? gen_base_ : gen::shipped_gen();   // a new run is played in the kit's world; a replay's record says its own ([gen])
  gen_.seed = static_cast<uint32_t>(world_settings_.seed);
  gen_.dials = has_gen_base_ ? gen_base_.dials : gen_dials_;`,
  },
  {
    file: 'game/world/world_app.cpp',
    old: `  run_speed_ = speed_;
  phase_ = RunPhase::Running;`,
    new: `  run_speed_ = speed_;
  run_gen_ = gen_;
  phase_ = RunPhase::Running;`,
  },
  {
    file: 'game/world/world_app.cpp',
    old: `  r.speed = run_speed_;
  r.dials_changed = run_dials_changed_;`,
    new: `  r.speed = run_speed_;
  r.gen = run_gen_;
  r.gen_world = world_fingerprint(run_gen_);
  r.dials_changed = run_dials_changed_;`,
  },
];
