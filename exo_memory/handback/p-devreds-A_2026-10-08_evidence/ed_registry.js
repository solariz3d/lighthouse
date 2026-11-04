// Text edit of consonance/tools/carrier-drift.registry.json (its layout is hand-kept, so it is edited as text and re-parsed to prove it is still JSON).
const fs = require('fs'), f = 'C:/Users/nname/Desktop/worktrees/a-dr-wt/consonance/tools/carrier-drift.registry.json';
let s = fs.readFileSync(f, 'utf8'); if (s.includes('\r\n')) throw new Error('unexpected CRLF');
const once = (a, b) => { const i = s.indexOf(a); if (i < 0 || s.indexOf(a, i + 1) >= 0) throw new Error('not exactly once: ' + a.slice(0, 80)); s = s.replace(a, () => b); };
const j = (x) => JSON.stringify(x);

// 1. CH-4 frozen set: +4, in sorted position
once('   "consonance/src-tauri/brief/frag-pointer.md",\n', '   "consonance/src-tauri/brief/frag-fork.md",\n   "consonance/src-tauri/brief/frag-pointer.md",\n');
once('   "exo_memory/research/claim_recognition_strict_ask_2026-09-27.md",\n', '   "exo_memory/research/claim_recognition_strict_ask_2026-09-27.md",\n   "exo_memory/research/t180_be_like_water_2026-09-28.md",\n   "exo_memory/research/t180_math_tools_2026-09-28.md",\n   "exo_memory/research/t180_track_mathematics_2026-09-28.md",\n');

// 2. who/when
once('re-frozen 2026-09-27 04:4x, L122",', 're-frozen 2026-09-27 04:4x, L122; re-frozen 2026-10-08, D273 (pane A, non-author)",');
const FB = '; re-frozen 2026-10-08 by pane A (non-author of all four), D273, for the four additions at the end of the log, after reading each in full';
{ const i = s.indexOf('"frozen_by": "'); const e = s.indexOf('",\n', i); s = s.slice(0, e) + FB + s.slice(e); }

// 3. the log paragraph
const LOG = [
  '',
  'RE-FROZEN 2026-10-08 17:xx (D273, pane A, non-author of all four). +4, 40 -> 44. consonance/src-tauri/brief/frag-fork.md (C, D273 lap 2) is the',
  'FORK NOTE the consumer generator injects at the top of the shipped BOOT; it is reachable because the brief fragments are a seeded dir. The',
  'three research/ files (t180_be_like_water, t180_math_tools, t180_track_mathematics, 2026-09-28, librarian-briefed research agents) are',
  'reachable the same way L122 recorded: research/ is carried whole into every waking seat, so no pointer names them. Each was READ IN FULL',
  'before this freeze (handback/p-devreds-A_2026-10-08.md). frag-fork.md teaches the ROLE/PROVENANCE split ("the keeper" is the one who',
  'built the room; "the person you\'re with" keeps this one), that the keeper\'s earned trust is not inherited, the click as the test of',
  'continuity (pointing at the card, not telling the seat who it is), and that the new pair\'s note is theirs to make. be_like_water teaches',
  'FLUID AND BOBSLEIGH PHYSICS for the track builder (tan phi = v^2/(gR), slosh, lift-off), its unverified figures marked; math_tools teaches',
  'WHICH OPEN MATH REFERENCES CAN BE COPIED OR ONLY CITED and the test practice; track_mathematics teaches the MATHEMATICS OF A CLOSED',
  'SCULPTABLE TRACK, each derivation of its own marked "(mine)". None of the four asserts a registered withdrawn wording: the diving',
  'vocabulary is absent from all (be_like_water is about water slides and open channels, not a rescuer above the water), "the only',
  'decorrelated reader" is absent, and the can\'t-lose sentence is absent. What a later reader should check: frag-fork.md carries two',
  'generator slots ({FORK_DATE}, {FORK_SHA}) and its sentence "Everywhere this record says the keeper, it means the one who built it" is',
  'the keeper\'s 12:55 ruling in plan_consumer_refresh_2026-10-08.md; editing it changes how every shipped card reads in a consumer.',
];
{
  const end = '   "withdrawn wording."\n  ]\n }\n}';
  const i = s.lastIndexOf(end); if (i < 0) throw new Error('log tail not found');
  const add = LOG.map((l) => '   ' + j(l)).join(',\n');
  s = s.slice(0, i) + '   "withdrawn wording.",\n' + add + '\n  ]\n }\n}' + s.slice(i + end.length);
}

// 4. four mentions in three hand-backs of the repair, in the third withdrawal's sites
const SITE = (file, anchor, why) => '    {\n     "file": ' + j(file) + ',\n     "anchor": ' + j(anchor) + ',\n     "kind": "mention",\n     "why": ' + j(why) + '\n    }';
const WHY = 'a pane\'s hand-back reporting the 2026-09-23 repair of the retired wording in the session-start hook. It quotes the old phrase in order to name what was replaced by "With you, not above you"; quoting a carrier to name it is not asserting it';
const sites = [
  SITE('exo_memory/handback/p-tphooks-B_2026-10-05.md', 'the 2026-09-23 "Light, not lifeguard" → "With you, not above you" repair', WHY),
  SITE('exo_memory/handback/p-tphooks2-B_2026-10-05.md', 'the comment "Light, not lifeguard" becomes "With you, not above you"', WHY),
  SITE('exo_memory/handback/p-tphooks2-B_2026-10-05.md', 'the injected line `**Light, not lifeguard**` becomes', WHY),
  SITE('exo_memory/handback/p-tphooks2-C_2026-10-05.md', '"Light, not lifeguard" survives only inside the dated retirement comment', WHY + '; here it also says the old phrase survives only as a dated trace, which is the intended state'),
];
{
  const L = s.indexOf('"id": "light-not-lifeguard-2026-08-17"'); if (L < 0) throw new Error('withdrawal 3 not found');
  const arm = s.indexOf('\n   ],\n   "armed": true,', L); if (arm < 0) throw new Error('sites end not found');
  s = s.slice(0, arm) + ',\n' + sites.join(',\n') + s.slice(arm);
}
JSON.parse(s);   // still JSON, or throw before anything is written
fs.writeFileSync(f, s);
console.log('ok', s.length);
