// D677 M-line: the bends row prints the exit gate's tick from the common start (the ruling at the ring for the side, item 3). Either line ending.
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/tests/line_tests.cpp';
let s = fs.readFileSync(f, 'utf8');
const rep = (a0, b0) => {
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    s = s.replace(a, () => b);
    return;
  }
  throw new Error('anchor not found once: ' + a0.slice(0, 80));
};
rep(`  float secs = -1.0f, lowest = -1.0f, entry = -1.0f, closest = 1e9f;`,
`  float secs = -1.0f, lowest = -1.0f, entry = -1.0f, closest = 1e9f;
  int   exit_tick = -1;  // the exit gate's tick from the common start (the door at tick 0): the ruling at the ring for the side, item 3`);
rep(`  if (in >= 0 && out >= 0) r.secs = static_cast<float>(out - in) / 240.0f, r.lowest = lowest, r.entry = speed[static_cast<size_t>(in)];`,
`  if (in >= 0 && out >= 0) r.secs = static_cast<float>(out - in) / 240.0f, r.lowest = lowest, r.entry = speed[static_cast<size_t>(in)], r.exit_tick = out;`);
rep(`    std::printf("    %s degrees, today   : %s; entry %.2f, lowest %.2f m/s, %.3f s between the gates; contacts %u, head-on %u (the control)\\n", e.name,`,
`    std::printf("    %s degrees, today   : %s; entry %.2f, lowest %.2f m/s, %.3f s between the gates, exit gate at tick %d from the start; contacts %u,"
                " head-on %u (the control)\\n", e.name,`);
rep(`                static_cast<double>(today.secs), today.contacts, today.head_on);`,
`                static_cast<double>(today.secs), today.exit_tick, today.contacts, today.head_on);`);
rep(`                  " prediction (%.2f s, %.1f m/s) %s; today's law here %.3f s; the hand line (22 degrees) 0.321 s\\n",`,
`                  " prediction (%.2f s, %.1f m/s) %s; today's law here %.3f s; exit gate at tick %d from the start (today's %d)\\n",`);
rep(`                  static_cast<double>(today.secs));`,
`                  static_cast<double>(today.secs), r.exit_tick, today.exit_tick);`);
fs.writeFileSync(f, s);
console.log('exit ticks added');
