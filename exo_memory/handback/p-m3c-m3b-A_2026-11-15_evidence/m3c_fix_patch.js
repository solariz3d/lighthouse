// D677 M3c's fix (registered: lighthouse exo_memory/handback/p-m3c-m3b-A_2026-11-15_evidence/registration_m3c_fix.md): a sliding root body's
// velocity turns toward the aim under its grip, eased. Each anchor once; line endings kept.
const fs = require('fs');
const root = process.argv[2] || 'G:/consonance-scratch/a-m1-dz3/';
const edit = (f, pairs) => {
  let s = fs.readFileSync(f, 'utf8');
  const nl = s.includes('\r\n') ? '\r\n' : '\n';
  for (const [a0, b0] of pairs) {
    const a = a0.split('\n').join(nl), b = b0.split('\n').join(nl);
    const n = s.split(a).length - 1;
    if (n !== 1) throw new Error(`${f}: anchor found ${n} times: ${a0.slice(0, 70)}`);
    s = s.replace(a, () => b);
  }
  fs.writeFileSync(f, s);
};

edit(root + 'chase/chaser.h', [[
`  Vec3    slide;          // metres a second, flat; zero when it travels along its heading
`,
`  Vec3    slide;          // metres a second, flat; zero when it travels along its heading
  float   slide_turn = 0;  // M3c's fix: radians a second its sliding velocity is turning toward the aim (eased, under grip)
`]]);

edit(root + 'chase/chaser.cpp', [[
`    if (length(c.slide) > 1e-4f) {
      // M3a: after a contact its velocity runs along the edge; its heading follows it, eased, and while it does the aim waits.
      const float to_slide = wrap_pi(det_atan2(c.slide.x, c.slide.z) - c.heading);
      if (std::fabs(to_slide) < 3.0f * kPi / 180.0f) c.slide = {};
      else err = to_slide;
    }`,
`    if (length(c.slide) > 1e-4f) {
      // M3a: after a contact its velocity runs along the edge; its heading follows it, eased. M3c's fix (registered: lighthouse
      // exo_memory/handback/p-m3c-m3b-A_2026-11-15_evidence/registration_m3c_fix.md): the aim no longer waits; the velocity itself turns toward the
      // aim, no faster than its grip allows at its speed, its rate eased in as the heading's is. Turned into an edge, it meets it on the next step.
      const float vdir = det_atan2(c.slide.x, c.slide.z);
      const float w_max = std::min(now.turn_slow, std::max(now.grip_mu, 0.05f) * kGravity / std::max(c.speed, kRootWalk));
      const float w_want = going ? clampf(wrap_pi(c.heading + err - vdir) / kTurnTau, -w_max, w_max) : 0.0f;
      const float ease = w_max / kTurnEase * kDt;
      c.slide_turn = clampf(clampf(w_want, c.slide_turn - ease, c.slide_turn + ease), -w_max, w_max);
      const float nd = wrap_pi(vdir + c.slide_turn * kDt);
      const float m = length(c.slide);
      c.slide = Vec3{det_sin(nd) * m, 0.0f, det_cos(nd) * m};
      const float to_slide = wrap_pi(nd - c.heading);
      if (std::fabs(to_slide) < 3.0f * kPi / 180.0f) c.slide = {}, c.slide_turn = 0;
      else err = to_slide;
    } else {
      c.slide_turn = 0;
    }`], [
`  if (c.body.root_law == 1) h.f32(c.slide.x), h.f32(c.slide.z);  // M3a: the root's slide; nothing new is hashed off the root`,
`  if (c.body.root_law == 1) h.f32(c.slide.x), h.f32(c.slide.z), h.f32(c.slide_turn);  // M3a, M3c's fix: the root's slide; nothing new off the root`]]);
console.log('M3c fix applied to ' + root);
