// Lap R, the green step: the record's text carries record_format and [speed] (and C's Saved and kept_score), and a replay applies the record's model.
// Applied only after the stub's rows have been run RED (the stub build must not see this). CRLF-aware, anchors must each appear exactly once.
const fs = require('fs');
const WT = 'C:/Users/zackn/Downloads/dreamzone-3-a-l197/';
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);

function patch(file, edits) {
  let s = fs.readFileSync(WT + file, 'utf8');
  const crlf = s.includes(CR + LF);
  s = s.split(CR + LF).join(LF);
  for (const [from, to] of edits) {
    const n = s.split(from).length - 1;
    if (n !== 1) throw new Error(file + ': anchor count ' + n + ' for: ' + from.slice(0, 70));
    s = s.replace(from, () => to);
  }
  if (crlf) s = s.split(LF).join(CR + LF);
  if (!process.argv.includes('--check')) fs.writeFileSync(WT + file, s);   // --check: anchors only, nothing written
}

patch('game/world/run_record.cpp', [
  // the names of the ends (C's 8614983)
  ['    case RunEnd::Void:   return std::string("fell into a void after ") + t;\n',
   '    case RunEnd::Void:   return std::string("fell into a void after ") + t;\n    case RunEnd::Saved:  return "caught in overtime by " + who(by, by_id) + " and saved, after " + t;\n'],
  ['    case RunEnd::Void:   return "void";\n', '    case RunEnd::Void:   return "void";\n    case RunEnd::Saved:  return "saved";\n'],
  // the one version, before every other key
  ['       "# it again and says who was where in its last seconds.\\n";\n  o << "result        = "',
   '       "# it again and says who was where in its last seconds.\\n";\n  o << "record_format = " << kRecordFormat << "\\n";\n  o << "result        = "'],
  // kept_score (C's)
  ['  o << "seconds       = " << num(r.seconds) << "\\n";\n  o << "by            = "',
   '  o << "seconds       = " << num(r.seconds) << "\\n";\n  o << "kept_score    = " << num(r.kept_score) << "\\n";\n  o << "by            = "'],
  // the speed model, between the dials and the movement parameters
  ['  o << "\\n[params]\\n";\n#define DZ_RUN_PARAM',
   '  o << "\\n[speed]\\n# the chasers\' speed model (chase/speed.h), every field; one left out reads as SpeedModel{}\'s\\n";\n#define DZ_RUN_SPEED(name, def, desc) o << #name << " = " << num(r.speed.name) << "\\n";\n  DZ_SPEED_FIELDS(DZ_RUN_SPEED)\n#undef DZ_RUN_SPEED\n  o << "\\n[params]\\n";\n#define DZ_RUN_PARAM'],
  // reading
  ['  std::string params_text, world_text;\n', '  std::string params_text, world_text, speed_text;\n'],
  ['      continue;\n    }\n    uint64_t u = 0;\n    if (section.empty()) {\n      if (name == "result") saw_result = true;\n',
   '      continue;\n    }\n    if (section == "[speed]") {   // collected as name=value; and read by the speed model\'s own parser, so its checks are the record\'s\n      speed_text += name + "=" + value + ";";\n      continue;\n    }\n    uint64_t u = 0;\n    if (section.empty()) {\n      if (name == "record_format") {\n        if (!to_u64(value, u, 10)) return fail("record_format is not a number");\n        if (u > static_cast<uint64_t>(kRecordFormat))\n          return fail("written by a newer build (record_format " + value + "; this build reads up to " + std::to_string(kRecordFormat) + ")");\n        r.format = static_cast<int>(u);\n      } else if (name == "result") saw_result = true;\n'],
  ['        else if (value == "left") r.end = RunEnd::Left;\n', '        else if (value == "left") r.end = RunEnd::Left;\n        else if (value == "saved") r.end = RunEnd::Saved;\n'],
  ['      } else if (name == "seconds") { if (!to_float(value, r.seconds)) return fail("not a number"); }\n',
   '      } else if (name == "seconds") { if (!to_float(value, r.seconds)) return fail("not a number"); }\n      else if (name == "kept_score") { if (!to_float(value, r.kept_score)) return fail("not a number"); }\n'],
  ['  if (std::string err = sim::parse_params(params_text, r.params); !err.empty()) return "[params]: " + err;\n',
   '  if (std::string err = sim::parse_params(params_text, r.params); !err.empty()) return "[params]: " + err;\n  if (std::string err = chase::set_speed(r.speed, speed_text); !err.empty()) return "[speed]: " + err;   // r.speed began as SpeedModel{}: a field not listed keeps it\n'],
  // the replay plays the record's model
  ['  if (!app.apply_params(record.params)) {\n    out.error = "the record\'s movement parameters were refused";\n    return out;\n  }\n',
   '  if (!app.apply_params(record.params)) {\n    out.error = "the record\'s movement parameters were refused";\n    return out;\n  }\n  app.apply_speed(record.speed);   // the model the run was played with (a record from before the scheme: SpeedModel{})\n'],
]);

patch('game/world/run_record.h', [
  ['// refused, saying it was written by a newer build. A.k.a. the run record\'s scheme: lighthouse\n// exo_memory/handback/p-record-owner-A_2026-11-13.md. The owner of this file adds fields; nobody else edits it.\n',
   '// refused, saying it was written by a newer build. The scheme and its owner: lighthouse\n// exo_memory/handback/p-record-owner-A_2026-11-13.md. The owner of this file adds fields; nobody else edits it.\n'],
  ['//                             the build it was played on, the seed, the level, every difficulty dial, every movement\n//                             parameter and world setting it was played with; then the summary: the time survived,\n',
   '//                             record_format, the build it was played on, the seed, the level, every difficulty dial, the\n//                             chasers\' speed model, every movement parameter and world setting it was played with; then the\n//                             summary: the time survived,\n'],
]);
// play_streamed dropped PlayParams::speed: the headless streamed harness always played the default model, so it could not agree with an app run on any other one.
patch('chase/streamed.cpp', [
  ['  cp.run.timing = params.timing;\n', '  cp.run.timing = params.timing;\n  cp.run.speed = params.speed;   // Lap R: the model the caller asked for (it was dropped here, so a non-default one never reached a streamed run)\n'],
]);
console.log('Lap R green patch ' + (process.argv.includes('--check') ? 'anchors ok (nothing written)' : 'applied'));
