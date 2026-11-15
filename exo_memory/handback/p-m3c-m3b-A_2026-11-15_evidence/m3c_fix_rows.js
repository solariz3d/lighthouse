// D677 M3c's fix, its falsifier's print: the sliding velocity's worst turn as a share of grip (ticks with no new contact), on the corner routes and the
// scripted bends. Each anchor once; line endings kept.
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/tests/feel_tests.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const pairs = [
[`  float              top = 0;         // M2: its body's top speed
};`,
`  float              top = 0;         // M2: its body's top speed
  float              slide_grip = 0;  // M3c's fix: the largest turn of its sliding velocity in a tick with no new contact, as a share of its grip
};`],
[`    const Vec3     was_at = c.pos;
    step(c, query);`,
`    const Vec3     was_at = c.pos;
    const Vec3     slide_was = c.slide;
    step(c, query);
    if (length(slide_was) > 1e-4f && length(c.slide) > 1e-4f && !c.touched) {
      float d = det_atan2(c.slide.x, c.slide.z) - det_atan2(slide_was.x, slide_was.z);
      while (d > kPi) d -= 2.0f * kPi;
      while (d < -kPi) d += 2.0f * kPi;
      w.slide_grip = std::max(w.slide_grip, std::fabs(d) * 240.0f * c.speed / (std::max(c.body.grip_mu, 0.05f) * 9.81f));
    }`],
[`    int snapped = 0, not_contact = 0, slant = 0, kept = 0, square = 0;
    float worst = 1e9f;`,
`    int snapped = 0, not_contact = 0, slant = 0, kept = 0, square = 0;
    float worst = 1e9f, slide_grip = 0;`],
[`      const Walk w = walk(plain_apartment_arena(), rs[i].first, rs[i].second, arm.model);
      for (size_t t = 1; t < w.speed.size(); ++t) {
        if ((w.branch[t] != 2 && w.branch[t] != 3) || w.speed[t - 1] <= 0.3f) continue;`,
`      const Walk w = walk(plain_apartment_arena(), rs[i].first, rs[i].second, arm.model);
      slide_grip = std::max(slide_grip, w.slide_grip);
      for (size_t t = 1; t < w.speed.size(); ++t) {
        if ((w.branch[t] != 2 && w.branch[t] != 3) || w.speed[t - 1] <= 0.3f) continue;`],
[`    DZ_CHECK(not_contact == 0);
    DZ_CHECK(kept == slant);`,
`    // M3c's fix, its falsifier (registration_m3c_fix.md): a sliding velocity never turns faster than grip allows.
    std::printf("    %-9s: the sliding velocity turned at most %.3f of its grip in a tick with no new contact\\n", arm.name, static_cast<double>(slide_grip));
    DZ_CHECK(not_contact == 0);
    DZ_CHECK(kept == slant);
    DZ_CHECK(slide_grip <= 1.001f);`],
[`      if (arm.model.root_law == 1.0f) {
        DZ_CHECK(in >= 0 && out >= 0);`,
`      if (arm.model.root_law == 1.0f) std::printf("      %-9s: the sliding velocity turned at most %.3f of its grip in a tick with no new contact\\n", arm.name, static_cast<double>(w.slide_grip));
      if (arm.model.root_law == 1.0f) {
        DZ_CHECK(in >= 0 && out >= 0);`],
];
// The working file is mixed (checked-out lines CRLF, lines a patch wrote LF): each anchor is tried with either ending, and the one found once wins.
for (const [a0, b0] of pairs) {
  let done = false;
  for (const e of [nl, nl === '\n' ? '\r\n' : '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    s = s.replace(a, () => b);
    done = true;
    break;
  }
  if (!done) throw new Error(`anchor not found exactly once: ${a0.slice(0, 70)}`);
}
fs.writeFileSync(f, s);
console.log('rows print added');
