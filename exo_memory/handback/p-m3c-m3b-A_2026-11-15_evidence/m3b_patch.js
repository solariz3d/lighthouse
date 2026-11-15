// D677 M3b: a drop is a fall, for a body on the root. Each anchor once; line endings kept.
const fs = require('fs');
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
const C = 'G:/consonance-scratch/a-m1-dz3/chase/';

// chaser.h: the collision a fall is swept through, the fall's state, the take-off speeds, step's new argument
edit(C + 'chaser.h', [
[`enum class Gait : uint8_t {`,
`// M3b: what a falling body on the root is swept through, the simulation's own collision (chase/run.h's Sight gives it): where a line from \`from\` along
// \`delta\` first meets a solid, as a share of \`delta\`, or false.
struct Collision {
  virtual ~Collision() = default;
  virtual bool cast(Vec3 from, Vec3 delta, float& fraction) const = 0;
};

enum class Gait : uint8_t {`],
[`  uint8_t branch = 0;`,
`  uint8_t branch = 0;
  // M3b, a drop as a fall (root only): the flat speed it falls across at, its fall speed, how far across it has come, and whether it has left what held it up;
  // the speed each drop's foot asks (drop_takeoffs, read when it plans); and the drops it could not land and was put back from.
  float              fall_v = 0, fall_vy = 0, fall_x = 0;
  uint8_t            fall_free = 0;
  std::vector<float> takeoff;
  uint32_t           drops_refused = 0;`],
[`void step(Chaser& chaser, const nav::Query& query, bool hold = false);`,
`void step(Chaser& chaser, const nav::Query& query, bool hold = false, const Collision* world = nullptr);`],
[`float              root_aim_distance(float speed);`,
`float              root_aim_distance(float speed);
// M3b: for each point of a path that is the foot of a drop, the speed that carries a body from the edge to the landing in the fall's own time
// (max(1, (flat length - the mesh's room toward the landing) / sqrt(2 h / g)), never over the body's top); 0 elsewhere.
std::vector<float> drop_takeoffs(const nav::Path& path, const nav::Query& query, const nav::Profile& profile, const Body& body);
// M3b: one tick of a root body's drop, as a fall (called by step() while the body is on a drop link).
void               root_fall(Chaser& chaser, const nav::Query& query, const nav::Profile& profile, const Collision* world);`],
]);

// run.h: Sight gives the collision (a sight with no world casts nothing)
edit(C + 'run.h', [[
`struct Sight {
  virtual ~Sight() = default;
  virtual bool clear(Vec3 from, Vec3 to) const = 0;
};`,
`struct Sight : Collision {
  virtual ~Sight() = default;
  virtual bool clear(Vec3 from, Vec3 to) const = 0;
  // M3b: where a line first meets a solid; a sight with no world of solids behind it meets none (the arena's and the streamed world's are the simulation's).
  bool cast(Vec3 from, Vec3 delta, float& fraction) const override {
    (void)from, (void)delta;
    fraction = 1.0f;
    return false;
  }
};`]]);

// chaser.cpp
edit(C + 'chaser.cpp', [
// start_link keeps a root body's speed into a drop and starts its fall
[`void start_link(Chaser& c) {
  const nav::PathPoint& from = c.path.points[c.leg];
  const nav::PathPoint& to = c.path.points[c.leg + 1];
  c.link_from = c.pos;
  c.link_to = to.pos;
  c.link_tick = 0;
  c.speed = 0;`,
`void start_link(Chaser& c) {
  const nav::PathPoint& from = c.path.points[c.leg];
  const nav::PathPoint& to = c.path.points[c.leg + 1];
  c.link_from = c.pos;
  c.link_to = to.pos;
  c.link_tick = 0;
  const float speed_in = c.speed;
  c.speed = 0;
  if (c.body.root_law == 1 && from.move == nav::Move::Drop) {
    // M3b: a root body leaves the edge with the speed it has, at least the take-off its plan asked for.
    const float asked = c.leg < c.takeoff.size() ? c.takeoff[c.leg] : 0.0f;
    c.fall_v = std::max(speed_in, asked), c.fall_vy = 0, c.fall_x = 0, c.fall_free = 0;
    c.speed = c.fall_v;
  }`],
// cross() hands a root body's drop to the fall
[`void cross(Chaser& c, const nav::Query& query, const nav::Profile& profile) {
  ++c.link_tick;`,
`void cross(Chaser& c, const nav::Query& query, const nav::Profile& profile, const Collision* world) {
  if (c.gait == Gait::Drop && c.body.root_law == 1) {
    root_fall(c, query, profile, world);
    return;
  }
  ++c.link_tick;`],
[`    cross(c, query, profile);
    return;
  }`,
`    cross(c, query, profile, world);
    return;
  }`],
[`void step(Chaser& c, const nav::Query& query, bool hold) {`,
`void step(Chaser& c, const nav::Query& query, bool hold, const Collision* world) {`],
// the foot of a drop asks the take-off speed (the root) and is taken at it
[`        if (length(to) <= kLinkArrive && c.speed <= kLinkSpeed) {`,
`        const float takeoff_here = root && c.leg < c.takeoff.size() ? c.takeoff[c.leg] : 0.0f;  // M3b
        if (length(to) <= kLinkArrive && c.speed <= std::max(kLinkSpeed, takeoff_here + 0.5f)) {`],
[`      if (foot) {
        through = std::min(cap, 1.0f);`,
`      if (foot) {
        const size_t foot_at = is_link(pts[c.leg].move) ? c.leg : c.leg + 1;  // M3b: a drop's foot asks a root body's take-off speed
        const float  takeoff_here = root && foot_at < c.takeoff.size() ? c.takeoff[foot_at] : 0.0f;
        through = std::min(cap, takeoff_here > 0.0f ? takeoff_here : 1.0f);`],
// plan_to reads the take-offs for a root body
[`  if (c.body.root_law == 1) c.rooms = corner_rooms(c.path, query, profile_now(c));  // M2: read once, when it plans
  else c.rooms.clear();`,
`  if (c.body.root_law == 1) c.rooms = corner_rooms(c.path, query, profile_now(c));  // M2: read once, when it plans
  else c.rooms.clear();
  if (c.body.root_law == 1) c.takeoff = drop_takeoffs(c.path, query, profile_now(c), c.body);  // M3b
  else c.takeoff.clear();`],
[`void clear_plan(Chaser& c) {
  c.path = {};
  c.rooms.clear();`,
`void clear_plan(Chaser& c) {
  c.path = {};
  c.rooms.clear();
  c.takeoff.clear();`],
// root_plan_speed: a drop's foot asks its take-off speed
[`    const bool foot = is_link(pts[k].move);
    float      v = foot ? 1.0f : grip_point_speed(now, c.path, c.rooms, k);`,
`    const bool foot = is_link(pts[k].move);
    const float takeoff_k = k < c.takeoff.size() ? c.takeoff[k] : 0.0f;  // M3b: a drop's foot asks its take-off speed
    float      v = foot ? (takeoff_k > 0.0f ? takeoff_k : 1.0f) : grip_point_speed(now, c.path, c.rooms, k);`],
// the fall itself, and the take-offs
[`bool place(Chaser& c, const nav::Query& query, Vec3 pos, float heading) {`,
`// M3b, a drop is a fall (registered: lighthouse exo_memory/handback/p-m3-world-A_2026-11-14_evidence/registration_m3b.md, as amended in
// p-m3c-m3b-A_2026-11-15_evidence/registration_m3b2.md): across at the speed it left with, its height held while something solid is still within 15 cm under
// its feet, then under gravity; swept through the world's collision (a flat move that meets a solid at its feet or 1 m up loses its flat speed; a fall that
// meets one lands on it); its speed reads its flat speed. Landed on the mesh within 1.5 m of the link's landing it goes on; elsewhere on the mesh it plans
// again; off the mesh it is put back where it left. drop_s is not read.
std::vector<float> drop_takeoffs(const nav::Path& path, const nav::Query& query, const nav::Profile& profile, const Body& b) {
  const std::vector<nav::PathPoint>& pts = path.points;
  std::vector<float>                 out(pts.size(), 0.0f);
  for (size_t k = 0; k + 1 < pts.size(); ++k) {
    if (pts[k].move != nav::Move::Drop) continue;
    const Vec3  span = flat(pts[k + 1].pos - pts[k].pos);
    const float d = length(span), h = pts[k].pos.y - pts[k + 1].pos.y;
    if (d < 1e-3f || h <= 0.05f) continue;
    const float e = std::min(d, query.open_along(pts[k].pos, span, d, profile));
    out[k] = std::min(b.top, std::max(1.0f, (d - e) / std::sqrt(2.0f * h / kGravity)));
  }
  return out;
}

void root_fall(Chaser& c, const nav::Query& query, const nav::Profile& profile, const Collision* world) {
  ++c.link_tick;
  const Vec3  span = flat(c.link_to - c.link_from);
  const float d = length(span);
  const Vec3  dir = d > 1e-4f ? span * (1.0f / d) : Vec3{det_sin(c.heading), 0.0f, det_cos(c.heading)};
  Vec3        move = dir * (c.fall_v * kDt);
  float       f = 1.0f;
  if (world && length(move) > 0.0f)
    for (const float up : {0.05f, 1.0f})
      if (world->cast(c.pos + Vec3{0.0f, up, 0.0f}, move, f)) {
        move = {};
        c.fall_v = 0.0f;
        break;
      }
  Vec3 next = c.pos + move;
  bool landed = false;
  if (!c.fall_free) {
    // Held up while something solid is under its feet (a short cast down); without a world, over the mesh it left.
    const bool held = world ? world->cast(next + Vec3{0.0f, 0.05f, 0.0f}, Vec3{0.0f, -0.15f, 0.0f}, f)
                            : query.nearest(next, profile, {0.05f, 0.3f, 0.05f}).found;
    if (!held) c.fall_free = 1;
  }
  if (c.fall_free) {
    c.fall_vy -= kGravity * kDt;
    const float dy = c.fall_vy * kDt;
    if (world && world->cast(next + Vec3{0.0f, 0.05f, 0.0f}, Vec3{0.0f, dy - 0.05f, 0.0f}, f)) {
      next.y = next.y + 0.05f + (dy - 0.05f) * f;
      landed = true;
    } else {
      next.y += dy;
      if (!world && next.y <= c.link_to.y) next.y = c.link_to.y, landed = true;
    }
  }
  c.fall_x += length(move);
  c.pos = next;
  c.speed = c.fall_v;
  if (c.link_tick > 4 * 240) landed = true;  // never falls for ever: four seconds and it is put down
  if (!landed) return;
  const nav::Nearest land = query.nearest(c.pos, profile, {0.6f, 0.6f, 0.6f});
  c.gait = Gait::Mesh;
  c.fall_free = 0;
  if (land.found && length(flat(land.pos - c.link_to)) <= 1.5f) {
    c.pos = land.pos;
    ++c.leg;
  } else if (land.found) {
    c.pos = land.pos;
    clear_plan(c);
  } else {
    c.pos = c.link_from;
    clear_plan(c);
    ++c.drops_refused;
  }
  if (c.body.drop_recover_s > 0) {
    c.gait = Gait::Recover;
    c.recover_ticks = std::max(1, seconds_to_ticks(c.body.drop_recover_s));
  }
}

bool place(Chaser& c, const nav::Query& query, Vec3 pos, float heading) {`],
// hash the fall for a root body
[`  if (c.body.root_law == 1) h.f32(c.slide.x), h.f32(c.slide.z);  // M3a: the root's slide; nothing new is hashed off the root`,
`  if (c.body.root_law == 1) h.f32(c.slide.x), h.f32(c.slide.z), h.f32(c.fall_v), h.f32(c.fall_vy);  // M3a/M3b: nothing new is hashed off the root`],
]);

// run.cpp: the run's sight is the collision a fall is swept through
edit(C + 'run.cpp', [
[`    chase::step(a.body, *query_, false);
`, `    chase::step(a.body, *query_, false, &sight_);
`],
[`  chase::step(a.body, *query_, hold);`, `  chase::step(a.body, *query_, hold, &sight_);`],
[`
  chase::step(a.body, *query_, false);`, `
  chase::step(a.body, *query_, false, &sight_);`],
]);
console.log('M3b applied');

// The arena's and the streamed world's sight cast through the simulation's own collision.
for (const f of ['arena.h', 'streamed.h'])
  edit(C + f, [[`  bool clear(Vec3 from, Vec3 to) const override;`,
`  bool clear(Vec3 from, Vec3 to) const override;
  bool cast(Vec3 from, Vec3 delta, float& fraction) const override;  // M3b: the simulation's raycast`]]);
edit(C + 'arena.cpp', [[`bool Arena::clear(Vec3 from, Vec3 to) const { return !sim_ || !sim_->raycast(from, to - from); }`,
`bool Arena::clear(Vec3 from, Vec3 to) const { return !sim_ || !sim_->raycast(from, to - from); }
bool Arena::cast(Vec3 from, Vec3 delta, float& fraction) const {
  fraction = 1.0f;
  return sim_ && sim_->raycast(from, delta, &fraction);
}`]]);
edit(C + 'streamed.cpp', [[`bool StreamedChase::clear(Vec3 from, Vec3 to) const { return !world_.raycast(from, to - from); }`,
`bool StreamedChase::clear(Vec3 from, Vec3 to) const { return !world_.raycast(from, to - from); }
bool StreamedChase::cast(Vec3 from, Vec3 delta, float& fraction) const {
  fraction = 1.0f;
  return world_.raycast(from, delta, &fraction);
}`]]);
console.log('casts added');
