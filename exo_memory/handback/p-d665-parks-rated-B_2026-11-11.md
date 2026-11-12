# D665 step 2, the Parks rated by the hunter's real travel (E's §3e, V5): B's hand-back, INTERIM (2026-11-12)

Packet: `[chair:MAIN] D665 step 1 is collated ... Start STEP 2 now` (02:24Z). Tier PROVE IT. Branch `d665-variety-b`, on step 1 `2d72bd2`, worktree
`C:\Users\nname\Desktop\worktrees\dz3-d658-b`; **uncommitted** (two files below). Scratch: `C:\Users\nname\AppData\Local\Temp\claude\fdb7d12f3434a8ed\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\scratchpad\d665b\`.

## Status: half done; TWO DESIGN CALLS need a ruling before it can be green (§3)

## 1. The generator's hunter model is now the chase's hunter (red first, then green)

- **Red row** (`chase/tests/speed_tests.cpp`, new): `the_generators_hunter_model_is_the_chases_hunter_at_the_start_of_a_run`. It builds the hunter as a fresh run on
  the normal level does (`make_body` with `ref_speed`, the dial at 0 and the start bonus) and takes `profile_of(...).speeds`, the speeds the mesh prices
  its way with. Each `gen::HunterModel` field must be within 2%.
  - Red (`s2_red.txt`): **the chase's hunter: walk 8.960, stairs 6.272, ladder 1.500 (the time to get onto it folded in), drop 1.600 s**; the
    generator's: 7.0, 4.9, 2.0, 0.9 (the nav defaults, from before D657).
- **The change** (`gen/src/gen.h` `HunterModel`): those four numbers, with the reason in a comment. Green (`s2_green.txt`).

## 2. V5, measured on bots (the ordinary measure, before and after)

`bots_ev.sh`: `dz-chase run --world --events`, seeds 1 to 20 × flee, line, juke, normal, 300 s at most. Every "enters a reprieve" event gives the
generator's way round (its record's detour) and the mesh's way round (`find_path` from the entered mouth to the far one, with the hunter's own profile at that
moment, `run.cpp`). Before is 2d72bd2, after is 2d72bd2 plus §1:

| | before | after |
|---|---|---|
| Parks the bots entered | 17 | 11 |
| generator ÷ mesh: median, p75, max | 1.79, 1.87, 2.00 | **1.34**, 1.44, 1.57 |
| Parks over 1.3x | 17 of 17 | 8 of 11 |
| mean way round: generator / mesh | 11.4 / 6.6 s | 8.7 / 6.5 s |
| time a Park bought (the hunter's lead out − in), median | +1.6 s | **+3.3 s** |
| the bots' median survival (V8) | 38.1 s | 38.5 s |

- **V5 (registered: wrong if the generator's detour is more than 1.3x the mesh's): not yet met**, 1.34. The speeds closed most of the gap; the rest is
  the path. The generator walks its cell graph (cell centres, diagonals only across four open cells); the mesh cuts corners. The hunter's speed drifts
  only a little during these runs (inferred: 1-2% by the dials' slopes and the distance gain at about 40 s), so it isn't the drift.
- **Fewer, better Parks:** a faster true hunter means fewer Park sites clear the 5 s minimum way round, and the ones kept buy twice as much.

## 3. The two calls (B's view first; the room decides)

**(a) Closing V5's last 4%: a path factor, or not.** The generator can't search the mesh (it is the layer under it). It can scale its graph path by a
measured factor: the median of mesh way round ÷ graph way round over **every** Park in many worlds (a chase test, which sees both), not over the bots' 11,
so V5 stays an independent check. A test holds the factor to that measure, like §1's hunter model. **My view:** do it, stated as a calibration, with its
own test. **What would change my mind:** if the factor spreads widely (some Parks at 1.0, others at 1.6), then one factor is a fudge, and the honest move
is to accept 1.34 and leave the rest to the kit (§3b-d), whose pieces are laid on the grid where graph and mesh agree.

**(b) What a Park must buy.** `gen_tests` `no_reprieve_has_a_quick_way_round_on_the_assembled_graph` (dial_tests.cpp:245, :255) is now red, two ways:
- Its "a Park is a shortcut" check: a Park's own crossing, at the hunter's ladder speed (or walking speed for a passage), must take less than its way
  round. With the true ladder speed, a 9.1 m duct takes **6.1 s** (was 4.6), more than the way round of some kept ducts (from **5.02 s**). **Those
  Parks are not shortcuts at all,** which is his "doesnt save as much time as u think".
- Its "both kinds occur" check: of 253 Parks judged, **6 are passages** (needs over 20). Passages have short ways round, and a faster true hunter puts
  them under the 5 s minimum.
- Today a Park is kept if its way round is 5 s or more. E's §3e: "keeps a passage only if it **buys** at least `reprieve_min_detour_s`". Read as "way
  round minus its own crossing", that drops most ducts now (way round about 8.7 s, crossing 6.1 s), and **Parks would nearly vanish until step 3's kit**.
- **My view:** make "buys" true (way round minus crossing ≥ the minimum) **together with step 3**, so better shapes arrive as the ducts go. Until
  then, step 2 keeps the 5 s rule. The red row's shortcut check is then amended by name to the true rule, and its passage count is lowered by name or
  held for step 3. **What would change my mind:** if he would rather have fewer Parks now than any Park that doesn't pay.

NEXT: librarian, rule on (a) and (b) when this is read; B then finishes step 2 and runs its proof. Nothing heavy of mine runs during P's loader landing.

## 4. The rulings (the librarian's "D665 STEP 2 RULINGS", 20:38), and the band REGISTERED before the measure

- **(b) taken:** the true buy rule (the way round minus the Park's own crossing, at the hunter's real speed) goes in. **Steps 2 and 3 land together, with
  the Park kit.** The red row (`no_reprieve_has_a_quick_way_round_on_the_assembled_graph`) stays red on the branch until the kit greens it. Nothing is
  amended to pass in between, and step 2 never lands alone.
- **(a), the path factor, its band stated now, before any measuring:**
  - **The measure:** a chase test over **6 worlds** (the arenas of seeds 3 and 7, and four more seeds). For every Park the generator recorded there,
    with its detour not capped: the mesh's way round between its two mouths (`find_path` with the hunter's starting profile, §1), divided by the
    generator's detour. One ratio a Park.
  - **NARROW, and a factor is used, only if:** at least **100** Parks, and the middle half of the ratios lies within **±10% of their median**
    (25th percentile ≥ 0.90 × median and 75th percentile ≤ 1.10 × median). The factor is then that median, held by a test.
  - **Otherwise:** no factor, and **V5 is reported as failing at 1.34**.
