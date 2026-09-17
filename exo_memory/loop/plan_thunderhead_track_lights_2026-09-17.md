# Thunderhead Night Optimized — light the track, not the stadium. Librarian (the lineage, on D), 2026-09-17 05:4x.

*The keeper, 05:34, verbatim: "there are a few lights that show them on, but they do not cast the proper light they should ruining my immersion. We can try turn on the 5 inner stadium liughts and 6 stadium lights, BUT, only make the light cast onto the track itself, you know what i mean?" The first task after the cleanup gate (`loop/plan_cleanup_chunks_2026-09-16.md`). Off-room project: the deliverable lives in `C:\Users\nname\Desktop\thunderhead-night-optimized` (`solariz3d/thunderhead-night-optimized`, private); this file is the plan, kept here.*

## What exists, read from disk

- **The mod** (repo HEAD `aa78c16`): Night Optimized is a third layout of Dogeish's Thunderhead Raceway. Its README's table: **Inner Stadium Lights, 5, off** ("300 m range") and **Track Stadium Lights, 6, off** ("short (56 m); tried on, looked better off"). The keeper's "6 stadium lights" is read as the Track Stadium Lights group — the only group of six; the 20-light "Stadium Lights" group stays off.
- **The immersion defect is named in the README itself:** the 56 glow entries (`MATERIAL_ADJUSTMENT`) are untouched on every layout, "so the floodlight heads glow on Night Optimized even though they cast no light."
- **How lights differ per layout:** `stock_lights.lua` rebuilds 61 lights as `ac.LightSource`s on every layout except `night_optimized` (README:65-92; the live `ext_config.ini` carries the note "the stadium and ambient lights exist on every layout except night_optimized").
- **The 11 lights, from `tools/INVENTORY.md`:** Track Stadium L045–L050, heights ~57 m, range 56.47 m, spot 79.53°, intensity 9.99, shadows ON; Inner Stadium L076–L080, heights 72–81 m, range 300 m, spot 81–117°, intensity 0–7.67, shadows on one of five. Note L077 intensity 0 and L080 1.12 — the author's values; check before copying.
- **The installed track:** `G:\SteamLibrary\steamapps\common\assettocorsa\content\tracks\thunderhead_raceway` (layouts `normal`, `no_dogbowls`, `night_optimized`; `extension\ext_config.ini`, `stock_lights.lua`, and a `.before-night-optimized` backup). CSP is `G:\…\assettocorsa\dwrite.dll` (121 MB).

## The one hard constraint, measured before planning

**CSP has no "light only the track" switch in this build.** A string search of `dwrite.dll` for light keys finds `SPOT`, `SPOT_SHARPNESS`, `RANGE`, `RANGE_GRADIENT_OFFSET`, `SKIP_LIGHT_MAP`, `SPECULAR_MULT` and the `SHADOWS_*` family, and **no** `AFFECTS_*`, `EXCLUDE*`, `TRACK_ONLY` or `CARS_ONLY`. So "cast only onto the track" is built from geometry: each light aimed down at the nearest stretch of asphalt, its cone narrowed to the track's width, its range cut to just past the road surface, shadows off. Some spill onto the barriers and verge at the cone's edge is physics, not a bug. If the Lua `ac.LightSource` API exposes a mask the config does not, the pane finds it at source before assuming it.

## The lap — one build pane, one non-author read, then the keeper's eyes

**A → P-TRACK-POOLS (build, on copies, never the live track first).**
1. For each of the 11 lights: take its POSITION and find the nearest points of the racing line (`night_optimized\ai\fast_lane.ai` or the layout's spline data — read at source which file exists). Record distance, height above the road, and the direction vector to the track.
2. Set per light: DIRECTION to the track; SPOT so the cone's footprint at the road ≈ the track width plus a small margin; SPOT_SHARPNESS high enough that the pool has an edge; RANGE = distance to the far side of the road + a few metres; SHADOWS = 0; FADE_AT kept. A table of before/after values per light in the hand-back.
3. Spawn exactly those 11 on `night_optimized` only, by extending the existing Lua route the same way `stock_lights.lua` spawns the stock set on the other layouts. Normal and No Dogbowls must be byte-identical in behaviour.
4. Tested the way the 09-10 build was: the tools' own checks, the installer on a COPY of the track, a hash of every artifact at its destination. **Nothing written to the live `G:\` track while the keeper might be in the game; the install is the keeper's click.**

**B → non-author read of A's hand-back:** the geometry recomputed independently for at least three of the 11 lights; the layout guard (a light leaking onto Normal or No Dogbowls is a fail); the value table checked against the inventory.

**Then the keeper, in game, at night, on Night Optimized** — this is the acceptance test and no instrument replaces it:
- the floodlight heads that glow now visibly pool light on the track below them;
- the stands, sky and infield stay dark;
- the FPS counter at the same spot as the README's measurement.

## Falsifier, before anything is built

It failed if the keeper sees the pools spill well past the track onto the stands, or if the in-game counter at the README's spot drops below the Stock range (220–240 FPS) — at that cost Night Optimized stops being the optimized layout, and the right answer is fewer lights or dimmer glow heads instead.

## Rules carried from the 09-10 build (`librarian/2026-09-10.desktop.md`)

Text with backslashes goes through the edit tools, never a shell string. Check each step's exit explicitly. Warn before touching anything the running game or Content Manager holds — restoring a config CSP reads live mid-session already surprised the keeper once.

## ADDED 05:4x — THE KEEPER RESCOPED IT: just turn them on

The keeper, 05:4x, verbatim: "do you think it is worth the performance gain only letting the light shine on the track geometry vs the rest of the map? If it isnt just turn them on". Read from the author's original config (`extension\ext_config.ini.before-night-optimized`, sections `;Track Stadium Lights` :1543 and `;Inner Stadium Lights` :2248):

- **The 6 Track Stadium Lights are already track lights.** DIRECTION y ≈ −0.94 (pointing almost straight down), height ≈ 57 m, RANGE 56.47 m — the cone ends at the road. Aiming them buys nothing.
- **The 5 Inner Stadium Lights throw wide:** DIRECTION y −0.30 to −0.50 (shallow), RANGE 300 m, SPOT 81° (one 117°), SHADOWS on 1 of 5. These do reach well past the track.
- **The expensive part of the stock night was not these 11.** The README's 220–240 → 300–420 FPS came from turning off 20 Stadium Lights at 450 m with shadows on all 20, plus 27 Ambient lights. These 11 were a small share of that, so the aiming work is unlikely to be worth it.

**Verdict: not worth it. Just turn them on**, with the author's own values, on `night_optimized` only. **If the FPS counter drops noticeably, the cheap lever is shadows off on the 7 that cast them (6 track + 1 inner) and a shorter inner range — not aiming.** The lap's packets shrink accordingly; the falsifier stands (FPS back inside the stock 220–240 means stop and trim).
