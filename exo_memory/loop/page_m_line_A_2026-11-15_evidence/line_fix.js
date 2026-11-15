// D677 M-line: root_line's assembly fix. A pair of circles with no common tangent (close corners turning opposite ways) made the whole stretch fall
// back to the string; now the failing pair's radii are halved (down to a point) until the line can be drawn. Rows unchanged.
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/chaser.cpp';
let s = fs.readFileSync(f, 'utf8');
const rep = (a0, b0) => {
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    s = s.replace(a, () => b);
    return;
  }
  throw new Error('anchor not found once: ' + a0.slice(0, 70));
};
rep(`// The line through circles [lo, hi] (inclusive), from circle lo's tangent-out to circle hi's tangent-in; false when it cannot be drawn.
bool line_build(const std::vector<LineCircle>& cs, size_t lo, size_t hi, std::vector<Vec3>& out) {
  out.clear();
  Vec3 prev_out{};
  for (size_t i = lo; i < hi; ++i) {
    Vec3 ta, tb;
    if (!line_tangent(cs[i], cs[i + 1], ta, tb)) return false;
    if (i == lo) out.push_back(ta);
    else if (!line_arc(out, cs[i], prev_out, ta)) return false;`,
`// The line through circles [lo, hi] (inclusive), from circle lo's tangent-out to circle hi's tangent-in; false when it cannot be drawn, with the
// circle where it failed in *at (the second of a pair without a tangent, or the circle whose arc would turn more than half round).
bool line_build(const std::vector<LineCircle>& cs, size_t lo, size_t hi, std::vector<Vec3>& out, size_t* at = nullptr) {
  out.clear();
  Vec3 prev_out{};
  for (size_t i = lo; i < hi; ++i) {
    Vec3 ta, tb;
    if (!line_tangent(cs[i], cs[i + 1], ta, tb)) {
      if (at) *at = i + 1;
      return false;
    }
    if (i == lo) out.push_back(ta);
    else if (!line_arc(out, cs[i], prev_out, ta)) {
      if (at) *at = i;
      return false;
    }`);
rep(`  if (!line_build(cs, 0, cs.size() - 1, out)) {
    out.clear();
    for (size_t i = a; i <= b; ++i) out.push_back(pts[i].pos);  // it cannot be drawn: the string's own points
  }`,
`  // Close corners can leave a pair with no common tangent: halve that pair's radii (to a point, at worst) until the whole line can be drawn.
  for (int tries = 0; tries < 64; ++tries) {
    size_t at = 0;
    if (line_build(cs, 0, cs.size() - 1, out, &at)) return;
    for (const size_t k : {at > 0 ? at - 1 : at, at})
      if (k > 0 && k + 1 < cs.size()) line_set_radius(cs[k], cs[k].r > 0.02f ? cs[k].r * 0.5f : 0.0f);
  }
  out.clear();
  for (size_t i = a; i <= b; ++i) out.push_back(pts[i].pos);  // it still cannot be drawn: the string's own points`);
fs.writeFileSync(f, s);
console.log('assembly fix applied');
