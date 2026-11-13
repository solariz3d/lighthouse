const fs = require('fs');
const root = 'C:/Users/zackn/Downloads/dreamzone-3-a-l182h/chase/';
const CR = String.fromCharCode(13), LF = String.fromCharCode(10), BS = String.fromCharCode(92);
function patch(file, pairs) {
  let s = fs.readFileSync(root + file, 'utf8');
  const crlf = s.includes(CR + LF);
  s = s.split(CR + LF).join(LF);
  for (const [a, b] of pairs) {
    const n = s.split(a).length - 1;
    if (n !== 1) throw new Error(file + ': expected 1 match, got ' + n + ' for: ' + a.slice(0, 80));
    s = s.replace(a, () => b);
  }
  if (crlf) s = s.split(LF).join(CR + LF);
  fs.writeFileSync(root + file, s);
}

// ---- speed.h: the fields
patch('speed.h', [[
  `  X(refuse_brake, 0.0f, "L182: 1 makes a refused step lose speed at the braking rate (0: the speed goes to zero in one tick)")`,
  `  X(refuse_brake, 0.0f, "L182: 1 makes a refused step lose speed at the braking rate (0: the speed goes to zero in one tick)")  ${BS}
  X(hawk_n, 0.0f, "L182b: the hawk's mixed guidance law, navigation constant N (0 with hawk_k 0: off; Brighton & Taylor 2019 fitted 0.7 for Harris' hawks, Brighton et al. 2017 about 2.6 for peregrines)")  ${BS}
  X(hawk_k, 0.0f, "L182b: the hawk's mixed guidance law, proportional-pursuit constant K, per second (the hawks' global fit: 1.2)")  ${BS}
  X(hawk_range, 20.0f, "L182b: metres within which the law steers the hunter, when its line to the player is clear (beyond, or without a line, the path follower steers)")`]]);

patch('speed.cpp', [[
  `next.scrape_ease < 0 ||
      next.refuse_brake < 0)`,
  `next.scrape_ease < 0 ||
      next.refuse_brake < 0 || next.hawk_n < 0 || next.hawk_k < 0 || next.hawk_range < 0)`]]);

// ---- chaser.h
patch('chaser.h', [[
  `  float    scrape_ease = 0.0f, refuse_brake = 0.0f;         // L182: no instant velocity changes`,
  `  float    scrape_ease = 0.0f, refuse_brake = 0.0f;         // L182: no instant velocity changes
  float    hawk_n = 0.0f, hawk_k = 0.0f, hawk_range = 20.0f;  // L182b: the hawk's mixed guidance law (speed.h; off while both gains are 0)`], [
  `  Vec3  vel;             // L170 SLIP:`,
  `  // L182b: where the hawk's law steers it. Set by whoever decides for the chaser (chase/run.cpp) each tick: the place the player is known to be, and how it
  // is moving; guide_on is false when the line is not clear or the player is out of range, and the path follower steers.
  Vec3  guide_pos, guide_vel;
  bool  guide_on = false;
  Vec3  vel;             // L170 SLIP:`]]);

// ---- chaser.cpp
patch('chaser.cpp', [[
  `  b.scrape_ease = m.scrape_ease, b.refuse_brake = m.refuse_brake;`,
  `  b.scrape_ease = m.scrape_ease, b.refuse_brake = m.refuse_brake;
  b.hawk_n = m.hawk_n, b.hawk_k = m.hawk_k, b.hawk_range = m.hawk_range;`], [
  `nav::Profile profile_now(const Chaser& c) { return profile_of(c.body, kind_name(c.kind)); }`,
  `nav::Profile profile_now(const Chaser& c) { return profile_of(c.body, kind_name(c.kind)); }

// L182b, the hawk's mixed guidance law (named, swappable): Brighton & Taylor 2019, Nature Communications 10:2462, doi 10.1038/s41467-019-10454-z, Methods eqs 5-7;
// proportional navigation after Brighton, Thomas & Taylor 2017, PNAS 114:13495, doi 10.1073/pnas.1714532114. The turn rate it commands, in radians a second:
//     gamma_dot = N lambda_dot - K delta        (delta = gamma - lambda: the deviation angle; lambda the bearing to the target; the papers' time delay tau is the
//                                                hunter's own reaction time, which is already in what it knows of the player)
// gamma is the chaser's heading and lambda the bearing to where it knows the player is; lambda_dot comes from the player's velocity as it was observed and the chaser's
// own. The papers fit direction only, with the speed taken from the track, and assume the demand can be met; the clamp by turn_rate() (which carries the Eqn 5 / H2 law)
// and the speed model are ours. Zero when the target is nearer than 0.3 m (the bearing is undefined there).
float hawk_mixed_law(const Chaser& c) {
  const Vec3  r = flat(c.guide_pos - c.pos);
  const float d2 = dot(r, r);
  if (d2 < 0.09f) return 0.0f;
  const float lambda = det_atan2(r.x, r.z);
  const float delta = wrap_pi(c.heading - lambda);
  const Vec3  v_p = Vec3{det_sin(c.heading), 0.0f, det_cos(c.heading)} * c.speed;
  const Vec3  v_rel = flat(c.guide_vel) - v_p;
  const float lambda_dot = (r.z * v_rel.x - r.x * v_rel.z) / d2;
  return c.body.hawk_n * lambda_dot - c.body.hawk_k * delta;
}`], [
  `    const float want_turn = going ? clampf(err / kTurnTau, -rate, rate) : 0.0f;`,
  `    float       want_turn = going ? clampf(err / kTurnTau, -rate, rate) : 0.0f;
    if (going && c.guide_on && (c.body.hawk_n > 0 || c.body.hawk_k > 0)) want_turn = clampf(hawk_mixed_law(c), -rate, rate);  // L182b`]]);

// ---- run.cpp: the hunter hands the law what it knows
patch('run.cpp', [[
  `  chase::step(a.body, *query_, hold);
  if (a.mode == Mode::Pursue) look_toward(a.body, player_pos_);  // D664: the head turns to you before the body does
}

// The reprieve has stopped holding it out`,
  `  // L182b: the hawk's law steers it, with a clear line to where it knows the player is and within hawk_range; otherwise the path follower does.
  a.body.guide_on = false;
  if (a.mode == Mode::Pursue && !hold && (params_.speed.hawk_n > 0 || params_.speed.hawk_k > 0)) {
    Knowledge::Obs obs;
    if (k.at_or_before(now - react, obs) && a.body.gait == Gait::Mesh && length(flat(obs.pos - a.body.pos)) <= params_.speed.hawk_range &&
        std::fabs(obs.pos.y - a.body.pos.y) < 1.0f && see(a.body.pos + Vec3{0, kEye, 0}, obs.pos + Vec3{0, kEye, 0})) {
      a.body.guide_pos = obs.pos, a.body.guide_vel = obs.vel, a.body.guide_on = true;
    }
  }
  chase::step(a.body, *query_, hold);
  if (a.mode == Mode::Pursue) look_toward(a.body, player_pos_);  // D664: the head turns to you before the body does
}

// The reprieve has stopped holding it out`]]);
console.log('hawk patched');
