// Expected shown titles for the main.rs rows, from the JS mirror (sim4.js), old (D296) beside new.
const { strip, cut } = require('./sim4.js');
const rows = [
  ['loop/q3_read_Jev_2026-09-27.md', 'Q3 read: Jev (typesafe/jev-1.13-20260917, through OpenRouter) — D162 resumed, pane E, 2026-10-01'],
  ['loop/q3_units_2026-09-27.md', 'Q3 units — 40 pairs for the two-reader agreement test (D161, built by pane E on D, 2026-09-27)'],
  ['loop/design_speed_measure_2026-10-06.md', 'D256 item 2: what "always max speed" would change, measured · pane E, on D, 2026-10-06 ~13:3x'],
  ['handback/p-indicator-loop-chain-ui_2026-09-01.md', 'P-INDICATOR (L025) — the loop indicator in the UI'],
  ['loop/rule_census_score_2026-10-02.md', 'D210 rule census: SCORE. Where MD rules work, and where they fail. Librarian, on D, 2026-10-02 13:2x.'],
  ['loop/compaction_corrections_2026-10-05/PREREG.md', "D245 PRE-REGISTRATION: do the seat's own CORRECTION-ADJACENT sentences survive compaction?"],
  ['loop/d296_d297_d298.md', 'D296 part 2, D297 part 3, D298 part 4, D299:'],
  ['loop/plan_t180_sharp_turns_2026-10-09.md', "T-180: a 90° turn does not come out straight, and the turns cannot be as sharp as Thunderhead's."],
  ['loop/plan_consumer_refresh_2026-10-08.md', 'D273 Consonance consumer: bring it up to date with dev, ready for a new user.'],
  ['loop/sharp_turn_registration_2026-10-09.md', 'D282: the Sharp turn bar, sealed'],
  ['handback/p-d177-rigid-C_2026-09-27.md', 'D177, packet C (reordered first): rigid downstream edits and one shared path'],
  ['loop/qs2s_units_v2_2026-10-03.md', 'QS2S units v2, D217 (is seat Y correcting seat X?) — re-drawn for the readers\' overlap and frozen by pane E, 2026-10-03'],
];
for (const [p, h] of rows) console.log(JSON.stringify(cut(strip(p, h))), '  <- old', JSON.stringify(cut(h)));
