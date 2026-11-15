// D677 M-line: the bends row carries its own control (the ruling at the third try's ring, item 2), amended by name. Either line ending.
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
rep(`// The line from the corridor (registration_line_from_corridor.md): pane E's three bends, planned once, both ways; the plan's bar checked (0.889 s`,
`// AMENDED by name at the third try's ring (lighthouse exo_memory/loop/packet_m_line_A_2026-11-15.md, git-blob 121179e1, item 2): the row carries
// its own control. Today's law runs through the same three bends in the same arena; the bar at each bend is today's time there, and the 0.889 s
// constant (today's law in pane E's staging, not here) leaves the row.
// The line from the corridor (registration_line_from_corridor.md): pane E's three bends, planned once, both ways; the plan's bar checked (0.889 s`);
rep(`  for (const EBend& e : kEBends)
    for (const Arm& arm : {Arm{"way (b)", b}, Arm{"way (a)", a}}) {
      const BendRun r = run_bend(arena, e.door, e.bend, e.target, arm.m);`,
`  for (const EBend& e : kEBends) {
    const BendRun today = run_bend(arena, e.door, e.bend, e.target, SpeedModel{});
    std::printf("    %s degrees, today   : %s; entry %.2f, lowest %.2f m/s, %.3f s between the gates; contacts %u, head-on %u (the control)\\n", e.name,
                today.arrived ? "to the end" : "NOT to the end", static_cast<double>(today.entry), static_cast<double>(today.lowest),
                static_cast<double>(today.secs), today.contacts, today.head_on);
    DZ_CHECK(today.secs >= 0.0f);
    for (const Arm& arm : {Arm{"way (b)", b}, Arm{"way (a)", a}}) {
      const BendRun r = run_bend(arena, e.door, e.bend, e.target, arm.m);`);
rep(`                  " prediction (%.2f s, %.1f m/s) %s; the string (4d0105b, way (b)) %s; the hand line (22 degrees) 0.321 s\\n",`,
`                  " prediction (%.2f s, %.1f m/s) %s; today's law here %.3f s; the hand line (22 degrees) 0.321 s\\n",`);
rep(`                  e.name[0] == '2' ? "1.029 s, 1.78" : e.name[0] == '4' ? "2.179 s, 0.22" : "1.079 s, 1.80");
      DZ_CHECK(r.secs >= 0.0f);
      DZ_CHECK(r.lowest >= 1.2f);
      if (e.name[0] == '2') DZ_CHECK(r.secs <= 0.889f);
    }
}`,
`                  static_cast<double>(today.secs));
      DZ_CHECK(r.secs >= 0.0f);
      DZ_CHECK(r.lowest >= 1.2f);
      DZ_CHECK(r.secs <= today.secs);
    }
  }
}`);
fs.writeFileSync(f, s);
console.log('bends row control applied');
