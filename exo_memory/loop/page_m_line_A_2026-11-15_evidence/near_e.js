// SCRATCH (seat A, D677, pane E's staging tree only, never committed): the ladder hooks (from near_law.js) put into the E tree's chaser.cpp, and the
// replan hook in run.cpp extended: each plan's string printed, and the ladder switched on for the plans 7 to 14 m from the 90's apex.
const fs = require('fs');
const S = 'C:/Users/nname/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d676';
const E = 'G:/consonance-scratch/a-m3c-e22/';
// 1. the ladder hooks: near_law.js run against the E tree's chaser.cpp
const law = fs.readFileSync(S + '/near_law.js', 'utf8').replace("const W = 'G:/consonance-scratch/a-m1-dz3/';", "const W = '" + E + "';");
fs.writeFileSync(S + '/near_law_e_gen.js', law);
require(S + '/near_law_e_gen.js');
// 2. the replan hook: the string printed, the ladder on for 7 to 14 m
const f = E + 'chase/run.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const rep = (a0, b0) => {
  const a = a0.split('\n').join(nl), b = b0.split('\n').join(nl);
  if (s.split(a).length - 1 !== 1) throw new Error('anchor not found once: ' + a0.slice(0, 80));
  s = s.replace(a, () => b);
};
rep(`      ArcReport rep;
      root_arcs(str, *query_, prof, &rep);`,
`      ArcReport rep;
      std::printf("STRING tick %u:", static_cast<unsigned>(tick_));
      for (const nav::PathPoint& q : str.points) std::printf(" (%.2f %.2f)", static_cast<double>(q.pos.x), static_cast<double>(q.pos.z));
      std::printf("\\n");
      dz_arc_diag = dist > 7.0f && dist < 14.0f;
      root_arcs(str, *query_, prof, &rep);
      dz_arc_diag = false;`);
rep(`void Run::replan(Agent& a, Vec3 target) {`, `}  // namespace dz::chase
extern bool dz_arc_diag;  // SCRATCH (seat A, D677)
namespace dz::chase {
void Run::replan(Agent& a, Vec3 target) {`);
fs.writeFileSync(f, s);
console.log('near hooks in the E tree');
