// Lap R (L197) A: hand mutants of the run record's scheme, each applied to the real source, built, and run against the record rows; the file is restored after
// (in a finally, and on SIGINT/SIGTERM/exit). Reported as: applied N / caught N / NOT APPLIED N. Run only with no other job using this worktree's build.
//   node mutants_lapr.js --check        anchors only: each must appear exactly once; nothing is built or written
//   node mutants_lapr.js [id ...]       all, or the named ones
const fs = require('fs');
const cp = require('child_process');
const SP = 'C:/Users/nname/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d673b';
const WT = 'G:/consonance-scratch/a-gen-dz3';
const WA = WT.replace(/\//g, '\\') + '\\build\\bin\\world_app_tests.exe';
const CT = WT.replace(/\//g, '\\') + '\\build\\bin\\chase_tests.exe';
const BAT = SP.replace(/\//g, '\\') + '\\cbuild_gen.bat';
const ROWS = [
  [WA, 'a_new_record_says_the_generator_it_was_played_in'], [WA, 'a_record_with_no_gen_section_replays_in_the_generator_before'],
  [WA, 'a_record_whose_world_is_not_this_builds_is_refused'], [WA, 'the_gen_dials_and_the_kit_round_trip'],
  [WA, 'a_run_record_reads_back_as_it_was_written_to_the_bit'], [WA, 'an_old_text_with_no_record_format'], [WA, 'a_new_run_begins_with_the_shipped'],
];
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);

const M = [
  { id: "replay-ignores-the-records-generator", file: "game/world/run_record.cpp", from: "  app.apply_gen(record.gen);", to: "" },
  { id: "gen-world-check-removed", file: "game/world/run_record.cpp", from: "if (record.gen_world != 0 && world_fingerprint(app.gen_params()) != record.gen_world) {", to: "if (false) {" },
  { id: "gen-section-not-written", file: "game/world/run_record.cpp", from: "  DZ_GEN_KIT(DZ_RUN_GEN)\n", to: "" },
  { id: "gen-section-not-read", file: "game/world/run_record.cpp", from: "if (std::string err = gen::set_gen(r.gen, gen_text); !err.empty()) return \"[gen]: \" + err;", to: "" },
  { id: "gen-dials-not-written", file: "game/world/run_record.cpp", from: "for (const gen::DialSpec& d : gen::kDialSpecs) o << d.name", to: "for (const gen::DialSpec& d : gen::kDialSpecs) if (false) o << d.name" },
  { id: "unknown-dial-accepted", file: "game/world/run_record.cpp", from: "if (!found) return fail(\"unknown generator dial '\" + name + \"'\");", to: "" },
  { id: "record-names-the-shipped-generator", file: "game/world/world_app.cpp", from: "  r.gen = run_gen_;", to: "  r.gen = gen::shipped_gen();" },
  { id: "gen-world-of-the-shipped-generator", file: "game/world/world_app.cpp", from: "r.gen_world = world_fingerprint(run_gen_);", to: "r.gen_world = world_fingerprint(gen::shipped_gen());" },
  { id: "replay-base-ignored", file: "game/world/world_app.cpp", from: "gen_ = has_gen_base_ ? gen_base_ : gen::shipped_gen();", to: "gen_ = gen::shipped_gen();" },
  { id: "replay-dials-ignored", file: "game/world/world_app.cpp", from: "gen_.dials = has_gen_base_ ? gen_base_.dials : gen_dials_;", to: "gen_.dials = gen_dials_;" },
];

function read(f) { return fs.readFileSync(WT + '/' + f, 'utf8'); }
function build() {
  const r = cp.spawnSync('node', [SP + '/lockrun.js', 'A [gen] mutant build', WT, 'cmd', '/c', BAT], { encoding: 'utf8' });
  return /exit 0/.test(r.stdout || '') && !/FAILED/.test(r.stdout || '');
}
let current = null;
function restore() { if (current) { fs.writeFileSync(WT + '/' + current.file, current.orig); current = null; } }
process.on('SIGINT', () => { restore(); process.exit(130); });
process.on('SIGTERM', () => { restore(); process.exit(143); });
process.on('exit', restore);

if (process.argv.includes('--check')) {
  let bad = 0;
  for (const m of M) {
    const n = read(m.file).split(CR + LF).join(LF).split(m.from).length - 1;
    if (n !== 1) { bad++; console.log(`anchor count ${n}: ${m.id}`); }
  }
  console.log(`${M.length} mutants, ${bad} with an anchor that does not appear exactly once`);
  process.exit(bad ? 1 : 0);
}

let applied = 0, caught = 0, notApplied = 0;
const survivors = [];
const only = process.argv.slice(2).filter(a => !a.startsWith('--'));
for (const m of M) {
  if (only.length && !only.includes(m.id)) continue;
  const orig = read(m.file);
  const nl = orig.includes(CR + LF);
  const text = orig.split(CR + LF).join(LF);
  if (text.split(m.from).length !== 2) { notApplied++; console.log(`NOT APPLIED ${m.id} (anchor count ${text.split(m.from).length - 1})`); continue; }
  let mut = text.replace(m.from, () => m.to);
  if (nl) mut = mut.split(LF).join(CR + LF);
  current = { file: m.file, orig };
  fs.writeFileSync(WT + '/' + m.file, mut);
  let result = 'build failed';
  try {
    if (build()) {
      applied++;
      const failed = [];
      for (const [exe, row] of ROWS) {
        const r = cp.spawnSync('node', [SP + '/lockrun.js', 'L197 A mutant row', WT, exe, row], { encoding: 'utf8' });
        if (/FAIL /.test(r.stdout || '') || /CHECK failed/.test(r.stdout || '') || /exit [1-9]/.test(r.stdout || '')) failed.push(row);
      }
      if (failed.length) { caught++; result = 'CAUGHT by ' + failed.join(', '); }
      else { survivors.push(m.id); result = 'SURVIVED'; }
    } else { notApplied++; }
  } finally {
    restore();
  }
  console.log(`${m.id}: ${result}`);
}
build(); // leave the build matching the source
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}; survivors: ${survivors.join(', ') || 'none'}`);
