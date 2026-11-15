// D677 M3c: put one of three slide laws into chaser.cpp, between the aim's read and `turned = ...`.   node slide_law.js e191|159|fix2 [tree]
const fs = require('fs');
const which = process.argv[2];
const f = (process.argv[3] || 'G:/consonance-scratch/a-m1-dz3/') + 'chase/chaser.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const L = {
  e191: `    if (length(c.slide) > 1e-4f) {
      // M3a: after a contact its velocity runs along the edge; its heading follows it, eased, and while it does the aim waits.
      const float to_slide = wrap_pi(det_atan2(c.slide.x, c.slide.z) - c.heading);
      if (std::fabs(to_slide) < 3.0f * kPi / 180.0f) c.slide = {};
      else err = to_slide;
    }
    root_tick(c, now, err, want, going);
`,
  159: `    if (length(c.slide) > 1e-4f) {
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
    }
    root_tick(c, now, err, want, going);
`,
  fix2: `    if (length(c.slide) > 1e-4f) {
      // M3a: after a contact its velocity runs along the edge; its heading follows it, eased, and the slide ends when they meet within 3 degrees.
      const float to_slide = wrap_pi(det_atan2(c.slide.x, c.slide.z) - c.heading);
      if (std::fabs(to_slide) < 3.0f * kPi / 180.0f) c.slide = {};
      else err = to_slide;
    }
    const bool sliding_on = length(c.slide) > 1e-4f;
    root_tick(c, now, err, want, going);
    if (sliding_on && going) {
      // M3c, corrected at its collation (registered: lighthouse exo_memory/handback/p-m3c-m3b-A_2026-11-15_evidence/registration_m3c_fix2.md): the aim
      // does not wait. The velocity turns toward the aim at the full rate the root law allows at the speed it has now, after this tick's gain
      // (min(turn_slow, mu g / max(v, kRootWalk))), never past the aim. Turned into an edge, it meets it on the next step and is put along it again.
      const float vdir = det_atan2(c.slide.x, c.slide.z);
      const float w_max = std::min(now.turn_slow, std::max(now.grip_mu, 0.05f) * kGravity / std::max(c.speed, kRootWalk));
      const float nd = wrap_pi(vdir + clampf(wrap_pi(c.aim_dir - vdir), -w_max * kDt, w_max * kDt));
      const float m = length(c.slide);
      c.slide = Vec3{det_sin(nd) * m, 0.0f, det_cos(nd) * m};
    }
`,
};
if (!L[which]) throw new Error('which: e191 | 159 | fix2');
const a = s.indexOf('    c.aim_dir = wrap_pi(c.heading + err);');
if (a < 0 || s.indexOf('    c.aim_dir = wrap_pi(c.heading + err);', a + 1) >= 0) throw new Error('aim_dir line not found exactly once');
const start = s.indexOf('    if (length(c.slide) > 1e-4f) {', a);
const endMark = '    turned = std::fabs(wrap_pi(c.heading - before));';
const end = s.indexOf(endMark, start);
if (start < 0 || end < 0) throw new Error('slide region not found exactly once');
if (s.slice(a, start).split(nl).length > 3) throw new Error('slide block does not follow the aim line');
s = s.slice(0, start) + L[which].split('\n').join(nl) + s.slice(end);
fs.writeFileSync(f, s);
console.log('slide law ' + which + ' in ' + f);
