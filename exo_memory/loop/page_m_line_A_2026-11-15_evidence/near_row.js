// SCRATCH (seat A, D677, never committed): the row for the read "why the 90's cluster gets no arc on the nearer string" (the ring for section 2,
// item 2). Appended after diag_arcs3.js's law hooks (the radius ladder printed for each bend while dz_arc_diag is on).
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const L = 'chase/tests/line_tests.cpp';
const s = fs.readFileSync(W + L, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const row = `
extern bool dz_arc_diag;  // DIAG-A
DZ_TEST(diag_near_the_90s_cluster_from_nearer_starts) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena arena(p);
  nav::Query  query(arena.nav());
  SpeedModel  b;
  DZ_CHECK(set_speed(b, "root_law=1;line_arcs=1").empty());
  Chaser probe;
  probe.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
  probe.body.root_law = 1, probe.body.line_arcs = 1;
  const nav::Profile prof = profile_of(probe.body, "hunter");
  const EBend&       e = kEBends[2];
  for (const Vec3 from : {e.door, Vec3{-24.38f, e.door.y, -25.98f}, Vec3{-19.78f, e.door.y, -25.67f}}) {
    nav::Path str;
    DZ_CHECK(query.find_path(from, e.target, prof, str));
    std::printf("  FROM (%.2f %.2f), %.2f m from the 90's apex: the string", static_cast<double>(from.x), static_cast<double>(from.z),
                static_cast<double>(length(flat(from - e.bend))));
    for (const nav::PathPoint& q : str.points) std::printf(" (%.2f %.2f)", static_cast<double>(q.pos.x), static_cast<double>(q.pos.z));
    std::printf("; corridor %zu polygons\\n", str.corridor.size());
    dz_arc_diag = true;
    ArcReport rep;
    root_arcs(str, query, prof, &rep);
    dz_arc_diag = false;
    std::printf("  arcs %zu:", rep.arc_radius.size());
    for (size_t i = 0; i < rep.arc_radius.size(); ++i)
      std::printf(" [r %.2f centre (%.2f %.2f)]", static_cast<double>(rep.arc_radius[i]), static_cast<double>(rep.arc_centre[i].x), static_cast<double>(rep.arc_centre[i].z));
    std::printf("; runs to the solve %d\\n", rep.fallback_runs);
  }
}
`.split('\n').join(nl);
fs.writeFileSync(W + L, s.replace(/\s*$/, '') + nl + row);
console.log('near row added');
