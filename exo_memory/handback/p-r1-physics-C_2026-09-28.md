# R1, packet C: AC/CSP physics and what a T-180 road needs

Pane C, 2026-09-28. Repo `C:\Users\nname\Desktop\t180-track-builder`, uncommitted. No AC launch; the installed tracks and
cars were read, never run.

**Output:** `docs/research/04_ac_physics_drivability.md`, 15,599 B, sha256 80dfdaf5abf7cc6a. Every claim is marked SOURCED
(a primary source, or a file on disk with its lines), MEASURED (a command on this PC) or UNVERIFIED. It links FINDINGS
§2, §4, §4c, §5, §7d and §7e, and says what would change in the builder. The builder itself is not changed.

## 0 · What was found, in order of cost if wrong
1. **The soft road may not be switched on in the builder's exports.**
   - MEASURED over `G:\…\content\tracks`: 39 surfaces.ini files carry `[COLLISION_PARAMS_...]`; 25 of them also declare
     `WAV_PITCH=extended-0`, CSP's extended-physics switch. Sakura, Centrifuge, the Test Track, Hazen, Coast and Rainbow
     are among the 25.
   - **The builder's own two exports on this PC (`t180b_app_loop`, `t180b_platform_test`) have the block and NOT the
     switch.** Nor do Onuris, Daytona or ThunderHead.
   - The CSP wiki does not say the block needs the switch. Its sidebar lists collision parameters as an
     extended-physics feature.
   - **UNVERIFIED either way.** The keeper's one AC test settles it: the same export with and without an `extended-0`
     SURFACE_0, and a hard compression on each.
   - FINDINGS §4c's registered prediction should be run with the switch set, or it tests two things at once.
2. **The installed Mach 6's downforce is a ray to the road** (`mach6_active/data/script.lua:424-433`, on disk):
   - it is cast from 0.4 m up and 1.0 m ahead of the origin, 1.0 m long;
   - suction is full within 0.5 m and gone at 0.9 m;
   - **a miss gives zero downforce.**
   - So a physics-mesh gap under the nose removes the downforce, not just grip.
   - A landing sees a downforce step the moment the ray finds the ramp. That links to §7d and §7e.
3. **The installed Mach 6 is not the GitHub `Source/base` car the research read.** Both columns were checked:
   - the base car against the raw files at 8f655a5c with curl;
   - the installed car on disk.
   - The differences:
     - coilover 80,000 / 80,000 → 15,000 front / 100,000 rear;
     - `MIN_LENGTH` 0.9 → 0.975;
     - `END_RATE` 250,000 → 750,000;
     - downforce −150 → −200;
     - the ray moved 1 m forward and shortened from 2.0 to 1.0 m;
     - the "stalling … combats clipping" cut-off is gone.
   - FINDINGS §4's "~20 g" was registered from 80,000 N/m. It is worth one line by §4's owner.
4. **One contact point per tyre in stock AC** (Kunos, verbatim). CSP adds rays, and the installed car sets
   `EXTENDED_RAYTRACING=1` (on disk; the key is NOT on CSP's wiki page, so what it does is UNVERIFIED). FINDINGS §2's
   seam rule stands. Face versus smoothed normals at a physics hit is UNVERIFIED, so no smoothing should be counted on.
5. **Walls:** the builder's export has only `1ROAD_*` physics meshes. A half-pipe wall is road, soft and rideable, so
   CSP's single-sided wall-ray rule does not apply to it. It would apply to future `1WALL` barriers (normals toward
   the road).

## 1 · Licence
- The T-180 repository's `LICENSE.txt`: physics assets CC BY-NC-SA 4.0, art assets CC BY-NC-ND 4.0.
- The note quotes config keys and short code fragments as facts about the car.
- **No code or file is copied into the builder, and nothing of theirs is committed.** The research notes stay in my
  scratchpad (`r1/notes.md`).

## 2 · Said plainly
- Most web pages came through a summarising reader. Only quoted text is verbatim, and the note says so at its top.
- I did not add the `extended-0` surface or `INTENSITY=1` to `src/export/trackfiles.js`. R1 is research. A change to the
  export's files is the export owner's call, and the switch has a stated cost: plain AC without CSP crashes on it.
- The 39/25 count is `find …/content/tracks -name surfaces.ini` plus a grep for `COLLISION_PARAMS` and
  `WAV_PITCH *= *extended-`, run 2026-09-28.
