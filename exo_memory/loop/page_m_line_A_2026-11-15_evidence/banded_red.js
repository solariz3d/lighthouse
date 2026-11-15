// D677 M-line, the red commit for the banded solve (registration_banded_solve.md): root_line's effort argument (the passes times it, today), and
// the row "the line is at its least". Either line ending; each anchor once.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const rep = (f, a0, b0) => {
  let s = fs.readFileSync(W + f, 'utf8');
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    fs.writeFileSync(W + f, s.replace(a, () => b));
    return;
  }
  throw new Error(f + ': anchor not found once: ' + a0.slice(0, 80));
};
rep('chase/chaser.h', `nav::Path root_line(const nav::Path& string, const nav::Query& query, const nav::Profile& profile);`,
`// effort scales the solver's work (a row compares the line at 1 and 10: registration_banded_solve.md).
nav::Path root_line(const nav::Path& string, const nav::Query& query, const nav::Profile& profile, int effort = 1);`);
rep('chase/chaser.cpp', `void bend_least(std::vector<Vec3>& q, const nav::Query& query, const nav::Profile& profile) {`,
`void bend_least(std::vector<Vec3>& q, const nav::Query& query, const nav::Profile& profile, int effort) {`);
rep('chase/chaser.cpp', `  for (int pass = 0; pass < kBendPasses; ++pass)`, `  for (int pass = 0; pass < kBendPasses * std::max(effort, 1); ++pass)`);
rep('chase/chaser.cpp', `nav::Path root_line(const nav::Path& string, const nav::Query& query, const nav::Profile& profile) {`,
`nav::Path root_line(const nav::Path& string, const nav::Query& query, const nav::Profile& profile, int effort) {`);
rep('chase/chaser.cpp', `      bend_least(q, query, profile);`, `      bend_least(q, query, profile, effort);`);
let t = fs.readFileSync(W + 'chase/tests/line_tests.cpp', 'utf8');
const nl = t.includes('\r\n') ? '\r\n' : '\n';
t = t.replace(/\s*$/, '') + nl + `
// The line is at its least (registration_banded_solve.md): on pane E's three bends the line at its effort and at ten times its effort differ by no
// more than 1 cm at any point. A line still moving with its solver's work was never at its minimum (the passes check, pc.txt).
DZ_TEST(mline_the_line_is_at_its_least_ten_times_the_effort_moves_it_no_more_than_a_centimetre) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena arena(p);
  nav::Query  query(arena.nav());
  SpeedModel  b;
  DZ_CHECK(set_speed(b, "root_law=1").empty());
  Chaser probe;
  probe.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
  probe.body.root_law = 1;
  const nav::Profile prof = profile_of(probe.body, "hunter");
  for (const EBend& e : kEBends) {
    nav::Path str;
    DZ_CHECK(query.find_path(e.door, e.target, prof, str));
    const nav::Path l1 = root_line(str, query, prof, 1), l10 = root_line(str, query, prof, 10);
    DZ_CHECK(l1.points.size() == l10.points.size());
    float moved = 0.0f;
    for (size_t i = 0; i < l1.points.size() && i < l10.points.size(); ++i) moved = std::max(moved, length(flat(l1.points[i].pos - l10.points[i].pos)));
    std::printf("    %s degrees: %zu points; ten times the effort moves the line by at most %.4f m\\n", e.name, l1.points.size(), static_cast<double>(moved));
    DZ_CHECK(moved <= 0.01f);
  }
}
`.split('\n').join(nl);
fs.writeFileSync(W + 'chase/tests/line_tests.cpp', t);
console.log('banded red applied');
