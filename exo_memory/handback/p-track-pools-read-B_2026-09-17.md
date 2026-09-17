# P-TRACK-POOLS READ · BRAVO — the non-author read of A's build, rescoped (D071)

**B (pane `12fb81f6`), machine D, 2026-09-17 ~06:2x.** Read at source: A's `handback/p-track-pools-A_2026-09-17.md`
and the uncommitted tree of `C:\Users\nname\Desktop\thunderhead-night-optimized` at `aa78c16`
(`M stock_lights.lua`, `M make_variant_script.js`, `M README.md`, `M installer/README.txt`, `?? check_stock_lights.js`).
**Read-only. Nothing written to the track repo or to `G:\`.** My checker: `C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-5bf9d657/12fb81f6-f4c0-4ef8-aad8-f0cdce091925/scratchpad/pools/verify.js`.

**Rescoped at the chair's word after dispatch** — the keeper: *"do you think it is worth the performance gain only
letting the light shine on the track geometry vs the rest of the map? If it isnt just turn them on."* The geometry
work was dropped; what it had produced is recorded in §4, as the chair allowed.

---

## 0 · VERDICT — LAND. All three questions pass, each by a check of my own that I proved can fail.

| question | result |
|---|---|
| **1 · layout guard** — anything spawned or changed on `normal` / `no_dogbowls`? | **No leak.** All 61 rows byte-identical to HEAD with the id removed, same order; `ext_config.ini` unmodified; off Night Optimized the filter is unconditionally true |
| **2 · the 11 values** — the author's own, copied faithfully? | **Yes, 11 fields × 11 lights,** checked against the author's ORIGINAL config, not only the rounded inventory — including **L077 intensity 0** and **L080 intensity 1.12** |
| **3 · the right 11** | **Yes:** exactly L045–L050 (Track Stadium) and L076–L080 (Inner Stadium); none of the 20 Stadium Lights (L054–L073); each kept id sits on the row at that id's position |

Two controls prove my checker is not green on anything (§1, §3). Re-running A's own `tools/check_stock_lights.js`
also exits 0 with "all checks pass", which I report as a re-derivation, not as evidence of mine.

---

## 1 · THE LAYOUT GUARD — first and hardest

**The precondition that makes this guard concrete, measured before A's file landed.** The 11 are **not new lights**.
`stock_lights.lua` at HEAD already builds 61 lights on every layout except `night_optimized` — by inventory group:
**Track Stadium 6, Inner Stadium 5, Stadium 20, Ambient 26, "wouldn't work" 3, unmatched 1** — and all 11 are among
them. So a leak has two possible shapes: **(a)** any change to the 61 rows or to the non-night path, and **(b)** the 11
added anywhere every layout reads — `ext_config.ini` — which would **double** them on Normal and No Dogbowls.

```
$ node scratchpad/pools/verify.js                      (== 1 · layout guard)
PASS  61 light rows before and after (61 -> 61)
PASS  every row byte-identical to HEAD once its leading id field is removed, in the same order
PASS  every row carries exactly one leading id
PASS  ids are unique
PASS  track/extension/ext_config.ini unmodified (no light added to the config every layout reads)
PASS  keepOnly is exactly (layout == night_optimized)
PASS  wanted(d) is true whenever keepOnly is false
PASS  build() creates a light only inside wanted(d)
PASS  the id field is never copied onto an ac.LightSource
PASS  no early return left before the table
      G:\ extension/ext_config.ini   sha256 44f8580b       G:\ extension/stock_lights.lua   sha256 76aa103a   (unchanged)
```

**Read at source, `stock_lights.lua`:** `local keepOnly = layout == NIGHT_OPTIMIZED` (:10);
`wanted(d) return not keepOnly or NIGHT_OPTIMIZED_KEEP[d.id] == true` (:76), so on the other two layouts every row is
wanted; the build loop copies every field except `line` and **`id`** (:87), so the new field never reaches an
`ac.LightSource` — **which matters on the other layouts, because an unknown field set on a light is the one way this
change could have broken Normal and No Dogbowls without touching a value**; and `live[#live + 1] = l` (:89) is
equivalent to HEAD's `live[i] = l` whenever every row is wanted.

**Control, so the guard is shown able to fail:** on a copy, the range of one **non-kept** light (the first row) was
changed 40 → 41. Result: `FAIL every row byte-identical to HEAD once its leading id field is removed`. **The guard
check sees a change to a light the Night Optimized filter never touches.**

**The one behaviour change A named, confirmed:** on `night_optimized` the script no longer returns early, so
`script.update` now runs every frame there (a sun-angle read and a compare). Off Night Optimized, nothing about the
script's control flow changed.

---

## 2 · THE 11 VALUES — against the author, not only the inventory

`tools/INVENTORY.md` rounds positions to 0.1 m and carries a subset of fields, so a match against it cannot show a
faithful copy of direction, spot sharpness, fade or diffuse concentration. **My check reads the author's own block for
each light** in `tools/ext_config.ORIGINAL.ini`, found from the inventory's line number, and compares 11 fields:

```
      tools/ext_config.ORIGINAL.ini                               sha256 469a1733 (the generator's header names 469a1733)
      G:\ extension/ext_config.ini.before-night-optimized         sha256 469a1733  — the chair's cited source, identical
PASS  L045: 11 fields == author's block at ORIGINAL:1547 (intensity 9.99, colour 9.576,8.769,7.549, shadows 1, spot 79.53, sharp 0.500)
PASS  L046: …1568   PASS L047: …1589   PASS L048: …1610   PASS L049: …1631   PASS L050: …1652   (same values)
PASS  L076: 11 fields == author's block at ORIGINAL:2251 (intensity 7.48, colour 7.480,4.644,4.509, shadows 0, spot 80.98, sharp 0.000)
PASS  L077: 11 fields == author's block at ORIGINAL:2272 (intensity 0,    colour 0.000,0.000,0.000, shadows 1, spot 80.98, sharp 0.000)
PASS  L078: …2293 (intensity 7.59)   PASS L079: …2314 (intensity 7.67)
PASS  L080: 11 fields == author's block at ORIGINAL:2335 (intensity 1.12, colour 1.120,0.695,0.675, shadows 0, spot 117.03, sharp 0.000)
```

The 11 fields: position, direction, **colour = author's rgb × intensity**, range, spot, spot sharpness, shadows,
shadows half-resolution, fade-at, diffuse concentration, range gradient offset. **A's table (§2 of A's hand-back)
matches every value I read**, including the rounding it prints.

**What A chose for L077 and L080: the author's values, unchanged — and that is right under the rescope** (*"just turn
them on"*). Two consequences the keeper should see, both already named by A and confirmed here:

- **L077 lights nothing and still casts a shadow map.** Intensity 0 gives colour `0,0,0`; `SHADOWS=1` with
  `SHADOWS_HALF_RESOLUTION=0` — **full resolution**, the only one of the 11 at full. **If FPS matters, L077 is the
  first lever and costs nothing visible.** Whether CSP skips a shadow pass for a black light is not established by A
  or by me.
- **L080 will light visibly less than its three lit siblings** — 1.12 against 7.48–7.67 — with the widest cone
  (117.03°).

---

## 3 · THE RIGHT 11

```
PASS  keep-set == every Track Stadium + Inner Stadium id in the inventory: L045 L046 L047 L048 L049 L050 L076 L077 L078 L079 L080
PASS  none of the 20 Stadium Lights (L054..L073) is kept
PASS  L045 row position (78.43, 56.6, 350.59) is the inventory's L045 (78.4, 56.6, 350.6), off by 0.032 m
      … one PASS per kept id, all 11 within 0.071 m (the inventory's one-decimal rounding)
```

**Checking the id LIST is not enough, and a control shows why.** On a copy, the ids of **L045 and L054** (a 20-group
Stadium Light) were swapped: the keep-set text is unchanged, so *"keep-set == …"* and *"none of the 20 is kept"* both
still **PASS** — but the row now labelled `L045` sits at (143.8, 130.4, 658.7), and my position and value checks fail
(`off by 323.527 m`; 10 of 11 fields MISMATCH). **So the right 11 is established by position against the author, not by
the names.** On the real tree every kept id is on its own light.

**A's generator tripwire holds against small numbering drift.** It confirms each kept id by its group's range (56.47 or
300). I checked the neighbours a drift of one or two would land on — L043/L044, L051–L054, L074/L075, L081–L083 — and
**none is 56.47 or 300** (200, 58.15, 108.15, 90.46, 450, 102.72). A drift of one would refuse, as A says. **Beyond the
neighbours I did not check;** some Ambient lights are 300 m, so a large drift is not proven caught by the tripwire —
A's own `check_stock_lights.js`, which compares positions, is what catches that.

---

## 4 · THE GEOMETRY WORK, DROPPED AT THE RESCOPE — kept as a record, not a finding

Nothing was sealed into this file before the rescope. What the work had produced, for anyone who returns to aiming:

- **No AI line exists** on any layout — every `ai/` folder on `G:\` is empty. A found the same.
- **Road geometry does exist:** `thtrack.kn5` (v6) parses end to end, byte 95,753,169 of 95,753,169; the physics road is
  `1ROAD_Underside` (29 pieces) plus `1ROAD_KERB_L/R`, 764,398 triangles. My reader: `scratchpad/pools/kn5roads.js`.
  A's independent reader reached the same file and a narrower surface set (material `Track`/`Finishline`, up-facing).
- **Two results were plausible** (road cross-section beneath or near each light, width 18.00 m / 18.25 m):
  - **L045** stands over the road, 18.5 m above it; the author's aim (0.177, −0.937, −0.302) and the aim at the
    cross-section centre (0.046, −0.985, −0.167) are both nearly straight down — consistent with the chair's ruling that
    the Track Stadium lights already stop at the road.
  - **L077** is 69.8 m from the road horizontally; the author's aim (0.761, −0.503, 0.409) points the same way as the aim
    to the nearest track (0.582, −0.660, 0.475).
- **One was not** — L080's nearest road piece is a **kerb strip** (`1ROAD_KERB_R.006`), and my shortest-chord rule
  measured the kerb (2.75 m) instead of the track beside it. A declared revision (bridge seams ≤ 1 m) did not change
  it, and a coverage map showed the main road beyond the kerb. **Unresolved when the rescope arrived**; W2.

---

## 5 · WHAT I DID NOT VERIFY

1. **The Lua has never run, for me either.** I searched D for `lua`, `lua5.1`, `lua54`, `luajit`, scoop and Chocolatey
   shims, `Program Files`, and the AC install: **no interpreter.** My guard reads the source and the 61/61/11 count is
   reasoning over it, like A's emulation — **the first real run is CSP's log line** A names:
   `[stock_lights] loaded on layout "night_optimized": 11 lights`, and 61 on the other two.
2. **Nothing in game** — the look, the spill onto the stands, the FPS. The keeper's acceptance test.
3. **The installer runs and the v1.1 package** (A's §1, §4) were not re-run by me. A's finding that INSTALL over v1 does
   nothing and **UNINSTALL then INSTALL** is needed is A's, proven on copies by A; I did not repeat it.
4. **The README and installer/README.txt edits** were not read line by line.
5. **Large id drift in the tripwire** (§3) — only the immediate neighbours were checked.
6. **Nothing committed.**

---

## 6 · WRONG (mine)

- **W1. My first check of whether `stock_lights.lua` already held these lights said "absent" for all four I tested** —
  the regex looked for `pos=`, and the file says `position=`. The listing printed beside it plainly showed L045's row.
  **A check that returns "absent" for everything is the same silence as a check that never ran**; re-run with the right
  key, it found all 11 present. Caught before anything was filed on it.
- **W2. My road cross-section rule — the shortest chord through the nearest road point — measured a kerb for L080.** I
  declared a revision rather than quietly tuning it, and the revision did not fix it; the rule was wrong for a light
  whose nearest road is a kerb separated from the track. Dropped with the rescope, recorded in §4 so nobody reuses the
  2.75 m number.
- **W3. A control changed my reading of my own checker.** I had "keep-set == …" and "none of the 20 is kept" as the
  proof of the right 11; the id-swap control passed both. The position check is what actually holds question 3.

---

## 7 · THE ONE LINE

**The build lands clean: Normal and No Dogbowls are byte-for-byte what they were, the 11 are the author's own blocks
copied field for field — L077 black but still shadowed at full resolution, L080 dim — and they are the right 11 by
position, not just by name; the only run that can confirm the count is CSP's log line after UNINSTALL then INSTALL.**

NEXT: librarian re-derive `node C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-5bf9d657/12fb81f6-f4c0-4ef8-aad8-f0cdce091925/scratchpad/pools/verify.js` (ALL PASS) and `node tools/check_stock_lights.js` (exit 0) when you collate D071, then the chair hands the keeper A's two-click install and the log line to look for.
