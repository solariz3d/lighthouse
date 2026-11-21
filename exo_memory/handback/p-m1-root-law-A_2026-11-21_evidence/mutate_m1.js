// L220 M1 mutants: one exact-string edit at a time in a COPY of nothing: the worktree's own files, restored after; rebuild (build.bat), run the root_ rows.
const fs = require('fs'), { spawnSync } = require('child_process');
const WT = 'C:/Consonance/dz-wt-m1';
const norm = (s) => s.replace(/\r\n/g, '\n');
const F = { c: WT + '/chase/chaser.cpp', r: WT + '/chase/run.cpp' };
const ORIG = {}; for (const k in F) ORIG[k] = fs.readFileSync(F[k], 'utf8');
const M = [
  ['M1 the sideways clamp (grip) is removed', 'c', 'const float w = clampf(clampf(asked_w, c.turn - jerk_w, c.turn + jerk_w), -cap_w, cap_w);', 'const float w = clampf(asked_w, c.turn - jerk_w, c.turn + jerk_w);'],
  ['M2 the turn it asks for is not capped by the grip', 'c', 'const float asked_w = going ? clampf(err / kRootTau, -cap_w, cap_w) : 0.0f;', 'const float asked_w = going ? err / kRootTau : 0.0f;'],
  ['M3 the heading rate may step (no ease)', 'c', 'const float jerk_w = grip / (kRootVref * kRootEase) * kDt;', 'const float jerk_w = 1e9f;'],
  ['M4 the grip is 3 g not grip_mu g', 'c', 'const float grip = std::max(c.body.grip_mu, 0.05f) * kG;', 'const float grip = 3.0f * kG;'],
  ['M5 the corner speed is the old rule\'s', 'c', 'c.body.root_law ? root_corner_speed(now, angle) : corner_speed(now, angle)', 'corner_speed(now, angle)'],
  ['M6 the circle it can turn is the old rule\'s', 'c', 'const float circle = c.body.root_law ? std::min(now.top, std::max(kCreep, std::sqrt(std::max(c.body.grip_mu, 0.05f) * kG * radius))) : speed_for_radius(now, radius);', 'const float circle = speed_for_radius(now, radius);'],
  ['M7 turn drag still applies under the law', 'c', 'if (!c.body.root_law) c.speed -= c.speed * std::min(1.0f, c.body.turn_drag * turned);', 'c.speed -= c.speed * std::min(1.0f, c.body.turn_drag * turned);'],
  ['M8 the heading is not the velocity\'s direction', 'c', 'heading = det_atan2(vel.x, vel.z);   // the heading is where it is going', ''],
  ['M9 the switch is ignored by the hunter\'s body', 'r', 'body.root_law = params_.speed.root_law != 0.0f ? 1 : 0;', 'body.root_law = 0;'],
  ['M10 the switch reaches every chaser (make_body)', 'c', '  b.grip_mu = m.grip_mu;\n', '  b.grip_mu = m.grip_mu;\n  b.root_law = m.root_law != 0.0f ? 1 : 0;\n'],
  ['M11 the fingerprint reads the root fields with the switch off', 'c', 'if (c.body.root_law) h.f32(c.vel.x), h.f32(c.vel.z), h.f32(c.root_as);', 'h.f32(c.vel.x), h.f32(c.vel.z), h.f32(c.root_as);'],
];
function build() { const r = spawnSync("powershell", ["-NoProfile", "-File", "C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/m1/b.ps1"], { encoding: "utf8", timeout: 900000 }); return /build rc=0/.test(r.stdout || ""); }
function rows() { const r = spawnSync(WT + '/build/bin/chase_tests.exe', ['root_'], { encoding: 'utf8', timeout: 600000 }); const o = (r.stdout || '') + (r.stderr || ''); const m = o.match(/(\d+) tests, (\d+) failed/); return { tests: m ? +m[1] : -1, failed: m ? +m[2] : -1 }; }
if (!build()) { console.log('CONTROL BUILD FAILED'); process.exit(1); }
const c = rows(); console.log('CONTROL: ' + c.tests + ' rows, ' + c.failed + ' failed');
let applied = 0, caught = 0, na = 0; const surv = [];
const ONLY = process.argv[2] ? process.argv[2].split(",") : null;
for (const [id, k, from, to] of M) {
  if (ONLY && !ONLY.some((o) => id.startsWith(o + " "))) continue;
  const src = norm(ORIG[k]), at = src.split(from).length - 1;
  if (at !== 1) { na++; console.log('NOT APPLIED (' + at + '): ' + id); continue; }
  const eol = ORIG[k].includes('\r\n') ? '\r\n' : '\n';
  fs.writeFileSync(F[k], src.replace(from, () => to).replace(/\n/g, eol));
  if (!build()) { na++; console.log('BUILD FAILED (not counted): ' + id); fs.writeFileSync(F[k], ORIG[k]); continue; }
  applied++; const r = rows();
  if (r.failed > 0 || r.tests < c.tests) { caught++; console.log('caught (' + r.failed + ' failed of ' + r.tests + '): ' + id); } else { surv.push(id); console.log('NOT CAUGHT: ' + id); }
  fs.writeFileSync(F[k], ORIG[k]);
}
for (const k in F) fs.writeFileSync(F[k], ORIG[k]);
build();
console.log('applied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + na + (surv.length ? ' / SURVIVORS: ' + surv.join(' | ') : ''));
