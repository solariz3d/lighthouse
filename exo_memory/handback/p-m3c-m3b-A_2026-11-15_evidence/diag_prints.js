// SCRATCH (seat A, D677): two reading prints, never committed. node diag_prints.js add|remove
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const pairs = [
  ['chase/tests/feel_tests.cpp',
   `        w.behind_unbraked += (c.speed <= speed_was - 0.9f * dec || speed_was <= 0.9f * dec) ? 0 : 1;`,
   `        w.behind_unbraked += (c.speed <= speed_was - 0.9f * dec || speed_was <= 0.9f * dec) ? 0 : 1;
        if (!(c.speed <= speed_was - 0.9f * dec || speed_was <= 0.9f * dec))  // DIAG-A
          std::printf("DIAG unbraked: tick %zu speed %.3f->%.3f slide_after %.3f slide_brake %d branch %d along %.3f\\n", w.speed.size(), speed_was, c.speed,  // DIAG-A
                      length(c.slide), static_cast<int>(c.slide_brake), static_cast<int>(c.branch), along);  // DIAG-A`],
  ['chase/tests/fall_tests.cpp',
   `        n.off_mesh += !r.put_back && !r.landed_on_mesh;`,
   `        n.off_mesh += !r.put_back && !r.landed_on_mesh;
        diag_never_free += (r.seconds_down == 0.0f && !r.put_back) ? 1 : 0, diag_never_free_quick += (r.seconds_down == 0.0f && r.seconds_down < r.least_down) ? 1 : 0;  // DIAG-A`],
  ['chase/tests/fall_tests.cpp',
   `Count count_drops(const Limits& limits) {`,
   `int diag_never_free = 0, diag_never_free_quick = 0;  // DIAG-A
Count count_drops(const Limits& limits) {`],
  ['chase/tests/fall_tests.cpp',
   `  print("the hunter on the root", n);`,
   `  print("the hunter on the root", n);
  std::printf("DIAG never went free (seconds_down 0, not put back) %d; of them counted quicker than free fall %d\\n", diag_never_free, diag_never_free_quick);  // DIAG-A`],
];
for (const [f, a0, b0] of pairs) {
  let s = fs.readFileSync(W + f, 'utf8');
  const [from0, to0] = process.argv[2] === 'remove' ? [b0, a0] : [a0, b0];
  let done = false;
  for (const e of ['\r\n', '\n']) {
    const from = from0.split('\n').join(e), to = to0.split('\n').join(e);
    if (s.split(from).length - 1 !== 1) continue;
    s = s.replace(from, () => to);
    done = true;
    break;
  }
  if (!done) throw new Error(f + ': anchor not found once: ' + from0.slice(0, 60));
  fs.writeFileSync(W + f, s);
}
console.log('diag prints ' + process.argv[2]);
