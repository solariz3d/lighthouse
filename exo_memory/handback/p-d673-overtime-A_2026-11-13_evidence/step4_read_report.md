# Subagent read (read-only, Sonnet) for queue step 4, the lesser chasers' arc: saved 2026-11-13 ~03:00 local. Claims marked (inferred) are the agent's. I have NOT re-verified any line number in it.

**State at the read:** dreamzone-3 main 04f3882 clean.

## 1. Ruled design
- Item 142, "okay we can try it" (`briefs/dreamzone2_the_game.md:1075-1077`). Queue row `loop/queue_dreamzone3_2026-11-12.md:25`. A's lane item 4 comes after L182 and step 2's chase side (`loop/plan_13h_run_2026-11-13.md:58-64`).
- His reasons: item 141 (:1073) "every mob gets their own unique ability or passive"; item 132 (:1036) counts scale with difficulty, "first few runs will be forgiving"; item 65 (:519) only lessers hear, the hunter is omniscient; item 92 (:756) lessers hear, move slowly to the sound, scare before catch.
- **G2** (`handback/p-l170-scale-E_2026-11-12.md:79`): lesser cap 1 on runs 1-2, 2 on runs 3-4, 3 on runs 5-6, then the dial alone. The hunter untouched. **M3** (:90): mobs off while the cap is below 3. M2 (:84-89): at intensity 0.7 in Build Up, k bodies spawn at once (k 2-6 by level), 75% behind; one mob per Build Up on its own timer; a mob may exceed `lesser_max` by k; table :92-102, only the "runs 5+" columns apply (ch.2/3 columns are G3, unruled).
- **R1** (`handback/p-l172-chaser-kit-E_2026-11-12.md:49-57`), bars :87-99, pathing :73-85.
- **Scope question:** the queue title "the arc" is D666 (`handback/p-d666-entities-E_2026-11-11.md:39-135`: hear, alerted, investigate at 0.35-0.7x top, scare-or-commit roll by phase); item 142's list omits that state machine. Ask the chair whether it is in or out.

## 2. Wave 1 (code that already half-supports each)
- **Appetite (hunter):** while the player's surge is above +1.0 m/s its run-up builds at twice `straight_rate`. Tell: footsteps quicken. Cost: surge-holding bot survival falls at least 15 %, and must still beat a no-surge bot. Change: scale `body.run_rate` after `hunter_body()` at `run.cpp:712`; run-up exists (`chaser.h:38`, `chaser.cpp:373`). Gap: `sim::PlayerState` has no surge (`sim/world.h:57-71`); use `length(flat(player_vel_))` as a stand-in (inferred). The +20 % cap (`speed.h:26`) stays; confirm "builds" not "builds higher" (inferred).
- **Mirror (interceptor):** under 8 m ahead it matches the player's lateral offset. Tell: head tracks you (`look_toward`, `run.cpp:1081`, exists). Cost: overtakes per minute fall at least 30 %, slide-under arm keeps at least 70 % of control. Change: a branch beside `Aim::Ahead` (`run.cpp:1052-1055`) with a lateral target; needs a replan faster than 0.5 s (`archetype.cpp:70`) and must bypass `aim_until` (:1050) (inferred). No overtake counter exists in chase/.
- **Call (pack):** a body that hears a sprint (`noise_made_[2]`, `run.cpp:639`) shares knowledge with every group (`Knowledge`, :216; `k.push`, :985). Tell: a new `EventKind` appended after `FellIntoVoid` (`run.h:91`); `event_name` (`run.cpp:102`) and `mode_name` (:110) have no bounds check, extend them. `sense()` pushes the live `player_nav_`; share the heard point instead (inferred). Cost: sprint-everywhere bot survival falls at least 15 %.
- **Lunge (sprinter):** within 6 m on a straight, a 0.4 s burst of +15 %, then it overshoots. Tell: crouch and hiss. Cost: Line bot median catch time falls at least 20 %, juke bot changes at most 5 %. Per-tick `top` is set at `run.cpp:501`; use `step(hold)` for the crouch and per-agent state beside `run.h:138`.
- **Charge (Charger):** row exists (`archetype.cpp:112-124`) but `built=false`. The director draws only three kinds (`run.cpp:1114-1122`, `% 3`); needs a `mix_charger` dial and new `Mode` values. Trap: `SpeedModel::wall_stand = 0` zeroes `wall_hit_s` (`chaser.cpp:142`, `speed.h:31`), so the 2 s wall stun must be set directly. Trap: `charge_speed` 3.0 has no stated unit (x top would be 19 m/s; inferred). "Open space" is not a fact: `WorldFacts` holds only reprieves and dead ends (`run.h:58-61`); derive it from a clear run on the nav mesh, else ask B (inferred).

## 3. Counts and the persistent run count
- Cap: gate at `run.cpp:1173` (`direct`) and `:1125-1127` (`try_spawn`) through one helper. `dials.h:7-8` says dials read time survived only; G2 is a deliberate exception outside `Dials`. `Difficulty` levels differ only by `start_minutes` and `pace` (`dials.cpp:17-39`); E's per-level k and interval table needs new per-level fields.
- `RunParams::runs_played`: E writes "0 = today's behaviour" (`p-l170-scale:124`) but a first run has 0 runs played; use -1 for "off" (inferred; confirm).
- Storage: nothing exists. Precedent `best_times.txt` (`game/world/world_app.h:145`; `world_app.cpp:587-623`). Run records keep only `kRunsKept = 20` (`run_record.h`), so the count cannot be derived from them. The record must store the count to replay exactly (`run_record.cpp:109-127`, parser :183-203); the count is handed to chase at `world_app.cpp:393-397`: that is game/ (C's lane). `run_counted_` (`world_app.cpp:403`) is the candidate predicate (inferred).

## 4. Hearing through the walk graph
- Exists: noise events in `update_player`, `run.cpp:632-643`; ranges `archetype.h:64-67`, identical for every kind; `sense()` (`run.cpp:945-988`) uses Euclidean d, a wall halves the range (:972, `hear_through` at `archetype.h:68`); pinned by `rule_tests.cpp:119-136`; `README.md:457` and `CHANGES.md:230` list round-corner sound as not built.
- Missing: a heard point (today hearing pushes the live player position and goes straight to Pursue, `run.cpp:985`, :1010); Investigate is driven by director hints (:1014-1023); a bounded path-length search (`nav::Query::way_round` is per pair, `nav.h:341`, `run.cpp:1100`; `reachable` :275 returns no distances); a wall-thickness probe (`Sight` is boolean, `run.h:37`). Design: D654 `handback/p-d654-audio-C_2026-11-11.md:119-126` and D666 :47-67 (one bounded search per noise, at most every 0.5 s). It moves every fingerprint once.

## 5. Needs another pane (ask early)
- C (game/): run-count file and record format; `ChaserPose` tell fields (`world_app.h:79-95`); tells in the model rig; Charger figure (default box works, `figures.cpp:73-75`; `hud.cpp:37-42` has no Charger colour).
- E (audio/): `Voice` has no Charger or Stalker (`audio.h:65`); `voice_of` defaults to Hunter (`sound.cpp:20-28`); tell cues (`audio.h:67`); Appetite footsteps (L192); the player-side path pairing (D654 step 2).
- B (gen/): Through's thin-wall facts (wave 2); Charge's open-space facts if not derived.
- sim/ (owner unknown): the Stalker's view test. The glance is view-only (`game/shell.cpp:176-186`, `bindings.cpp:22`); there is no look-back in `sim/input.h` (buttons :13-16) or chase/; the chase cannot see it and replays do not carry it: an input and replay-format change (prove-it tier; inferred).
- nav/: a Through link kind, and a distance flood.

## 6. Bot tests (style `rule_tests.cpp:119`, `feel_tests.cpp:180`)
Mechanism rows: `add_lesser` + `player_at` + `FixedSight`, plus an "off by default, named fields" row. Paired 150-seed arms: `dz-chase sweep` and `compare` (`main.cpp:3-15`), bars as at `p-l172:91-99`, registered before any run. Policies today: Flee, Line, Still, Juke, JukeAll, Cutback (`bots.h:33`); Flee plans against plain `Body` speeds (`bots.cpp:445-481`) so it cannot see lunge, charge or appetite (inferred). New bots and instruments: overtake counter and slide-under bot (Mirror); surge-holder and no-surge bots (Appetite); corner-only sprinter (Call); straight-across and pillar-cut bots (Charge); ledge-sitter (Through); look-back bot (Stalker). Housekeeping: list a new test file in `chase/CMakeLists.txt:95-102`; amend by name `body_tests.cpp:71-83` (Charger unbuilt, built count 4) and `proof_tests.cpp:539` (kinds in turn).

## 7. Recommended order
1. Settle the questions: D666 scope, the -1 encoding, whether G3's <=3 ceiling stays after run 6, mob composition, the Appetite input, Call's shared point, Charge units.
2. `runs_played` + the cap helper + G2, with instruments (overtake, mob and spawn counts). Ask C for storage now.
3. Per-kind pathing, after L182's winner lands (the SpeedModel levers are global; per-kind scales go in `Limits`).
4. Hearing through the walk graph, so every later baseline is taken once.
5. M2/M3 mobs.
6. Signatures: Lunge, Charge, Mirror, Appetite, then Call (needs hearing).
7. Wave 2: Through, then Stalker once the sim input exists.
