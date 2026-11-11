# Dreamzone 3: the inventory, 2026-11-11 03:3x (L). Librarian, at his "we talked about too much too fast, we need to take inventory again on what we got before going deeper"

His words are the master: `briefs/dreamzone2_the_game.md`, items 1–26. This file sorts them against what exists. A line marked
**his** means he decided it. A line marked **proposed** was offered by a seat and is not chosen yet.

## 1. Built and on disk (`dreamzone-3` d11ce9a = Dreamzone 2 plus the laptop's night; its `HANDOFF.md`, "What exists", :28-40)
- **sim:** the 240 Hz deterministic player controller: walk, sprint, jump, slide, dive, vault, climb, wall-run, wall-kick, roll,
  ladders. About 140 tests.
- **gen:** the generator. It carries the old game's hashes and lanes, in true 3D:
  - stairs of three kinds, ladder shafts, atria, mezzanines;
  - dead ends and reprieves (the safe zones), on dials;
  - a walk graph per chunk;
  - biomes as data. Apartments are built. The hotel is a proof in data only. Mall, facility, pool rooms, school and chaos are
    named and empty (:81-82).
- **render:** D3D12 raytraced: soft shadows, ambient occlusion, one bounce, fog, bloom, the old horror grade. 1440p p99 is
  2.24 ms against a 2.78 ms budget.
- **world, nav:** streaming that stays deterministic, and Recast pathing per chunk.
- **chase:** the hunter, sprinter, interceptor, pack and climber, a director, 39 dials over four levels, and the score.
  Charger, stalker and crawler are parameter rows only. Chasers are placeholder dark boxes (:82-83).
- **audio:** synthesised in code. **Never heard by a person** until his first play.
- **game:** `dz-gym` (the movement course) and `dz-world` (the run).
- **Added on the laptop, 11-11:**
  - the launcher and the two desktop shortcuts, which still open `Downloads\dreamzone-2`;
  - the flashlight, off by default;
  - the two-stage sprint;
  - the first game's camera rig.

## 2. Being built now (L161; `loop/plan_l161_dreamzone2_room_builds_2026-11-11.md`)
- **A, the chasers' speed model (his item 18):**
  - the chasers get their own reference speed;
  - they gain speed on straights, carry inertia and lose speed in turns;
  - the interceptor is nimble;
  - they no longer catch on walls.
- **B, the generator:**
  - void floors, with rare short wall-runs as the way across;
  - wider stairwells;
  - gaps sized from the movement settings.
  - Falling into the void does not end the run yet; that follows after A.
- **C:** the first-person body, with the camera attached.
- **E:** done, both research hand-backs. Speed is `handback/p-l161-speed-E_2026-11-11.md`; look and lore is
  `handback/p-l161-look-E_2026-11-11.md`.

## 3. His decisions, not built yet
**The run:**
- No stamina; always a fast survival (18).
- The runner's speed: a quick surge to a base, then a slow gain to the top. His guess was about 5 then 10 m/s (21). E proposes
  6 / 9 / 4 s. **The numbers wait on his feel in the gym.**
- Fixed base stats, raised over many runs (21, 25).
- Abilities found during a run: a chest or a good entity freezes time and offers a random pick. Picks combine, Vampire
  Survivors style (25).
- **The catch** (26): a brutal jumpscare, then the camera and soul are pulled into a rapturing portal, and he wakes in his bed in
  the real world.
- No out-of-body moments inside the dream zone; you are already out of your body (26). This drops E's camera-lift idea.

**The world:**
- **Biomes are the character's psyche** (26): his apartment, an underground research facility, an empty mall, an empty hospital,
  an empty high school, perhaps an empty hotel.
- **An exceedingly rare "outside"** (26): a door to a liminal neighbourhood, an unnatural green hill, glitched wilderness against
  the interiors.
- **Designed pieces embedded in the seeds**: hand-made areas with meaning (26).
- Floors that can be a void, with short rare wall-runs (14). Wider stairwells (17). Both are in L161.
- The flashlight as a find or a permanent unlock (10).

**The entities:**
- Bad entities feed on you (25).
- **Good entities:**
  - a holy aura that stops the feeding for a while;
  - a physical being that tanks aggro (25);
  - when one is near, every sound quiets (breath, entities, the field's contortion), a resonant golden aura fills the
    hallways, and a harmonious chord "brings you closer to love" (26, his pick 5).
- The hunter's footsteps are bassy, like thunder. Chaser animation is far better (16).

**The sound:**
- A real theta binaural beat, at low volume, blended into the mix (26, his pick 6).

**The lore:**
- **Ambiguous.** It is never tied to the Gateway tapes or Hemi-Sync directly (26).
- It drip-feeds through **rare encounters in chronological order**, each first sighting setting up the next, across many runs.
- The easter egg **is** that background story, layered over the runs (26).

**The hub, between runs (26; the HANDOFF's M5, "not started"):**
- the bedroom you wake in, walkable and customisable;
- the **closet** changes your look;
- the **PC**:
  - an online shop for clothing and furniture, paid in one currency;
  - **an illicit site** that unlocks once the story has gone far enough, where you read and learn abilities that carry into
    runs;
  - **the loadout and ability screen**;
  - buying and upgrading good entities: their power and how often they spawn;
  - **a locked higher tier that makes the bad entities stronger and faster for more currency or XP** (like Vampire Survivors'
    curse or Megabonk);
  - perhaps tapes, bought there, as one way to gain XP and skills ("idk", his);
- a **treadmill and a weight rack**: a mini game to spend points on speed, acceleration and mobility.
- A jumpscare, eventually, "but not during testing" (16).

## 4. Proposed by seats, not chosen
- **The look:** E's effect menu (look hand-back, the table), driven by one "dream intensity" dial from game state.
- **The FOV:** keep 100° horizontal (E). Key the widening to the top speed rather than the surge (E; a choice for him).
- **Lore naming:** Focus levels as depth tiers. **His item 26 cuts against direct Gateway terms, so this is likely out.** Monroe's
  Locales as biome families: likely out by the same cut. "The Park" for a safe zone: open. Quiet signs (the egg shape, a
  golden oval of light): open.
- **Easter eggs:** the memo with a missing page; the tapes. **His item 26 makes the story itself the easter egg,** so these
  survive at most as pieces inside it.
- The player's speed numbers, 6 / 9 / 4 s (E).

## 5. Research queued
- **Backrooms lore**, to learn from (26). Sent to E as L161's third research part.

## 6. Constraints the builds must carry (librarian; each is checkable)
- **Photosensitivity.** Psychedelic effects that flash or slice must stay under the usual seizure-safety limits (no more than 3
  flashes a second; no large saturated-red flashes). Scenery slicing and recursion are the ones to watch.
- **The binaural beat needs stereo headphones** to exist at all; on speakers it becomes an ordinary low pulse.
  - E's source: the EEG "frequency-following" claim is contested (Stone et al. 2002, in `handback/p-l161-look-E_2026-11-11.md`,
    L6).
  - **His call stands** (a low theta beat in the mix). The game should not claim an effect on the player.
- His words stay out of `dreamzone-3` (the room's rule for any repo that may be shared).

## 7. Open, his
- Speed numbers after the gym.
- The FOV widening key.
- Which effects, and how strong.
- Whether any real-world term (Focus, the Park) appears at all.
- Which hub currency pays for what.
