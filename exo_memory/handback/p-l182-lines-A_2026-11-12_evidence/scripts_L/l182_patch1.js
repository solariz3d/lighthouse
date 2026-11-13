const fs = require('fs');
const root = 'C:/Users/zackn/Downloads/dreamzone-3-a-l182/chase/';
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
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
const BS = String.fromCharCode(92);

// ---- speed.h: the L182 fields
patch('speed.h', [[
  `  X(lead_base_s, 0.5f, "L170 P1: seconds of lead before the distance is added (used only when lead_range is above 0)")`,
  `  X(lead_base_s, 0.5f, "L170 P1: seconds of lead before the distance is added (used only when lead_range is above 0)")  ${BS}
  X(turn_law, 0.0f, "L182: the turning law capping the turn rate at speed (0: none, as the chase is; 1: H1 human, Chang & Kram 2007 Eqn 5; 2: H2 hunting animal, sqrt(mu g R); 3: the hunter H2 and the lesser chasers H1)")  ${BS}
  X(grip_mu, 1.0f, "L182: H2's grip, as a multiple of g (1.0 is the friction bound; 1.33 is a press figure for a cheetah, unverified)")  ${BS}
  X(line_clearance, 0.0f, "L182: metres a corner's path is moved outward from the turn (0: the path as navigation finds it)")  ${BS}
  X(look_ahead, 0.0f, "L182: metres before a corner within which the aim blends toward the next leg (0: it aims at the next point)")  ${BS}
  X(feeler_m, 0.0f, "L182: metres the two wall feelers reach ahead, at plus and minus 40 degrees (0: none)")  ${BS}
  X(feeler_push, 0.5f, "L182: radians the aim is turned off a side whose feeler finds no mesh, at top speed")  ${BS}
  X(sway, 0.30f, "L182: metres of seeded sway in a chaser's line (D664's 0.30; 0 takes it out)")  ${BS}
  X(scrape_ease, 0.0f, "L182: 1 turns a scraped step's heading toward the slide at no more than the turn rate (0: the step's direction changes at once)")  ${BS}
  X(refuse_brake, 0.0f, "L182: 1 makes a refused step lose speed at the braking rate (0: the speed goes to zero in one tick)")`]]);

patch('speed.cpp', [[
  `next.corner_floor_speed < 0 || next.slip_rate < 0 || next.lead_range < 0 || next.lead_base_s < 0)`,
  `next.corner_floor_speed < 0 || next.slip_rate < 0 || next.lead_range < 0 || next.lead_base_s < 0 ||
      next.turn_law < 0 || next.line_clearance < 0 || next.look_ahead < 0 || next.feeler_m < 0 || next.feeler_push < 0 || next.sway < 0 || next.scrape_ease < 0 ||
      next.refuse_brake < 0)`], [
  `  if (next.corner_floor_speed > 1) return "corner_floor_speed is a share between 0 and 1";`,
  `  if (next.corner_floor_speed > 1) return "corner_floor_speed is a share between 0 and 1";
  if (next.turn_law > 3 || next.turn_law != static_cast<float>(static_cast<int>(next.turn_law))) return "turn_law is 0, 1, 2 or 3";
  if (next.grip_mu <= 0) return "grip_mu must be above zero";`]]);

// ---- chaser.h: the body's fields
patch('chaser.h', [[
  `  float    wander = 0.30f; `,
  `  int      turn_law = 0;                     // L182 (speed.h): 0 none, 1 H1 human, 2 H2 hunting animal
  float    grip_mu = 1.0f;                   // L182: H2's grip as a multiple of g
  float    line_clearance = 0.0f, look_ahead = 0.0f;        // L182: the line (speed.h)
  float    feeler_m = 0.0f, feeler_push = 0.5f;             // L182: the wall feelers
  float    scrape_ease = 0.0f, refuse_brake = 0.0f;         // L182: no instant velocity changes
  float    wander = 0.30f; `]]);

// ---- chaser.cpp
patch('chaser.cpp', [[
  `  b.corner_floor_speed = m.corner_floor_speed;`,
  `  b.corner_floor_speed = m.corner_floor_speed;
  b.turn_law = m.turn_law == 3.0f ? 1 : static_cast<int>(m.turn_law);  // 3 is the hunter H2 and the rest H1: run.cpp's hunter_body() raises its own
  b.grip_mu = m.grip_mu;
  b.line_clearance = m.line_clearance, b.look_ahead = m.look_ahead;
  b.feeler_m = m.feeler_m, b.feeler_push = m.feeler_push;
  b.wander = m.sway;
  b.scrape_ease = m.scrape_ease, b.refuse_brake = m.refuse_brake;`], [
  `float turn_rate(const Body& b, float speed) {
  const float t = b.top > 0 ? clampf(speed / b.top, 0.0f, 1.0f) : 0.0f;
  return lerpf(b.turn_slow, b.turn_fast, t);
}`,
  `// L182, the turning law: the smallest radius a body of straight speed V_o = b.top may turn on at speed v. Named and swappable (chase/SPEED_MODEL.md).
//   H1 (turn_law 1), the human: Chang & Kram 2007, J Exp Biol 210:971, Eqn 5, V_curve = V_o 0.746 (R g / V_o^2)^0.363 (fitted at R 1 to 6 m; extrapolated above; the
//   cap by sqrt(g R) is inferred), inverted for R.
//   H2 (turn_law 2), the hunting animal: V_curve = min(V_o, sqrt(mu g R)), the sources' shape (greyhound: no limb-force slowdown, grip-bound), unmeasured at our radii.
// (std::pow is used, so with the law on a run is not bit-identical across libms; with the law off it is never called.)
float law_min_radius(const Body& b, float v) {
  const float g = 9.81f;
  if (b.turn_law == 2) return v * v / (std::max(b.grip_mu, 0.05f) * g);
  const float vo = std::max(b.top, 0.1f);
  const float r_eqn = vo * vo / g * std::pow(v / (0.746f * vo), 1.0f / 0.363f);
  return std::max(r_eqn, v * v / g);
}

float turn_rate(const Body& b, float speed) {
  const float t = b.top > 0 ? clampf(speed / b.top, 0.0f, 1.0f) : 0.0f;
  float       rate = lerpf(b.turn_slow, b.turn_fast, t);
  if (b.turn_law != 0 && speed > 0.05f) rate = std::min(rate, speed / std::max(law_min_radius(b, speed), 0.05f));
  return rate;
}`], [
  // plan_to: the line's clearance
  `  c.path = std::move(p);
  c.leg = 0;
  c.has_path = true;
  c.arrived = c.path.points.size() < 2;
  return true;
}`,
  `  c.path = std::move(p);
  if (c.body.line_clearance > 0) widen_corners(c.path, query, profile_now(c), c.body.line_clearance);
  c.leg = 0;
  c.has_path = true;
  c.arrived = c.path.points.size() < 2;
  return true;
}`], [
  `nav::Profile profile_now(const Chaser& c) { return profile_of(c.body, kind_name(c.kind)); }`,
  `nav::Profile profile_now(const Chaser& c) { return profile_of(c.body, kind_name(c.kind)); }

// L182, the line with clearance (idea: NextBot's look-ahead, DetourCrowd's smoothing; ours): a corner is read as the navigation path rounds it (the chord of the 3 m of path
// before a point against the chord of the 3 m after); a point whose turn is 45 degrees or more is moved outward from the turn by up to 'clearance', less for a gentler
// turn, and only as far as the mesh holds it (clearance, half of it, or not at all). Walk points only; a point beside a stairs or a link is left.
void widen_corners(nav::Path& path, const nav::Query& query, const nav::Profile& profile, float clearance) {
  std::vector<nav::PathPoint>& pts = path.points;
  const size_t                 n = pts.size();
  if (n < 3) return;
  std::vector<float> arc(n, 0.0f);
  for (size_t i = 1; i < n; ++i) arc[i] = arc[i - 1] + length(flat(pts[i].pos - pts[i - 1].pos));
  std::vector<Vec3> moved = {};
  moved.reserve(n);
  for (size_t i = 0; i < n; ++i) moved.push_back(pts[i].pos);
  for (size_t i = 1; i + 1 < n; ++i) {
    if (pts[i - 1].move != nav::Move::Walk || pts[i].move != nav::Move::Walk || pts[i + 1].move != nav::Move::Walk) continue;
    size_t a = i, b = i;
    while (a > 0 && arc[i] - arc[a] < kCornerSpan) --a;
    while (b + 1 < n && arc[b] - arc[i] < kCornerSpan) ++b;
    if (pts[a].move != nav::Move::Walk || pts[b].move != nav::Move::Walk) continue;
    const Vec3 u = flat(pts[i].pos - pts[a].pos), v = flat(pts[b].pos - pts[i].pos);
    const float lu = length(u), lv = length(v);
    if (lu < 1e-3f || lv < 1e-3f) continue;
    const Vec3  du = u * (1.0f / lu), dv = v * (1.0f / lv);
    const float turn = std::fabs(det_atan2(du.x * dv.z - du.z * dv.x, dot(du, dv)));
    if (turn < 0.785f) continue;
    const Vec3  inward = dv - du;
    const float il = length(inward);
    if (il < 1e-4f) continue;
    const Vec3  outward = inward * (-1.0f / il);
    const float want = clearance * std::min(1.0f, turn / 1.571f);
    for (const float f : {1.0f, 0.5f}) {
      const Vec3         q = pts[i].pos + outward * (want * f);
      const nav::Nearest n2 = query.nearest(q, profile, {0.3f, 0.6f, 0.3f});
      if (n2.found && length(flat(n2.pos - q)) < 0.1f) {
        moved[i] = {q.x, n2.pos.y, q.z};
        break;
      }
    }
  }
  for (size_t i = 0; i < n; ++i) pts[i].pos = moved[i];
}`], [
  // step: look-ahead and feelers around the aim
  `        err = wrap_pi(det_atan2(aim.x, aim.z) - c.heading);
        const float off = std::fabs(err);`,
  `        // L182, look-ahead: within 'look_ahead' of a corner the aim leans toward the next leg, so the turn starts earlier and rounds wider.
        if (c.body.look_ahead > 0 && !foot && !last && dist < c.body.look_ahead && c.leg + 2 < pts.size() && !is_link(pts[c.leg + 1].move)) {
          const Vec3 next = flat(pts[c.leg + 2].pos - target);
          if (length(next) > 1e-3f) aim = aim + next * (1.0f / length(next)) * (0.5f * c.body.look_ahead * clampf(1.0f - dist / c.body.look_ahead, 0.0f, 1.0f));
        }
        err = wrap_pi(det_atan2(aim.x, aim.z) - c.heading);
        // L182, the wall feelers (idea: NextBot's Avoid; ours): a probe that finds no mesh turns the aim off that side.
        if (c.body.feeler_m > 0 && !foot && c.speed > 1.0f && c.body.top > 0) {
          const float push = c.body.feeler_push * clampf(c.speed / c.body.top, 0.0f, 1.0f);
          for (const float side : {-1.0f, 1.0f}) {
            const float h = c.heading + side * 0.7f;
            const Vec3  p = c.pos + Vec3{det_sin(h), 0.0f, det_cos(h)} * c.body.feeler_m;
            const nav::Nearest q = query.nearest(p, profile, {0.05f, 0.6f, 0.05f});
            if (!q.found || length(flat(q.pos - p)) > 0.15f) err -= side * push;
          }
          err = wrap_pi(err);
        }
        const float off = std::fabs(err);`], [
  // scrape ease
  `        c.speed -= c.speed * std::min(1.0f, lost * kScrapeLoss * kDt);`,
  `        if (c.body.scrape_ease > 0) {  // L182: the heading follows the slide at no more than the turn rate, not the step's direction at once
          const Vec3 slide = flat(snap.pos - c.pos);
          if (length(slide) > 1e-4f) {
            const float lim = turn_rate(now, c.speed) * kDt * c.body.scrape_ease;
            c.heading = wrap_pi(c.heading + clampf(wrap_pi(det_atan2(slide.x, slide.z) - c.heading), -lim, lim));
          }
        }
        c.speed -= c.speed * std::min(1.0f, lost * kScrapeLoss * kDt);`]]);

// refuse brake (the else branch of the snap)
patch('chaser.cpp', [[
  `    c.scraped = true;
    c.speed = 0;
    c.vel_set = false;`,
  `    c.scraped = true;
    c.speed = c.body.refuse_brake > 0 ? std::max(0.0f, c.speed - c.body.brake * kDt * c.body.refuse_brake) : 0.0f;  // L182: a refused step brakes, it does not stop dead
    c.vel_set = false;`]]);

// run.cpp: the hunter's H2 under turn_law 3
patch('run.cpp', [[
  `  l.replan_s = dials_.hunter_replan_s;
  return make_body(l, params_.speed.ref_speed, dist_scale_, params_.speed);`,
  `  l.replan_s = dials_.hunter_replan_s;
  Body body = make_body(l, params_.speed.ref_speed, dist_scale_, params_.speed);
  if (params_.speed.turn_law == 3.0f) body.turn_law = 2;  // L182: the hunter corners like a hunting animal, the others like people
  return body;`]]);
console.log('l182 patched');
