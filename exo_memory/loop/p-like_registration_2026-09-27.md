# P-LIKE — registration of tolerances (B, D182; written and sealed BEFORE A's vocab or C's fonts land)

**The test, as the plan states it** (`exo_memory/loop/plan_t180_vocabulary_2026-09-27.md`, d7e560e): *"using ONLY the palette's built-in
words, fonts and tempos, at default handles plus the sculpt handles, the loop rebuilds a stretch that reads like a real T-180 track …
`read_track.cjs` then reads the export back, and its statistics match the real stretch's within tolerances stated BEFORE the run: width,
cross-section class shares, bank, radius distribution and climb. It FAILS if any statistic is outside its stated tolerance, or if a
built-in piece at default handles falls outside the library's 10th–90th percentile for its class."*

Everything below is fixed now. Nothing in it may be changed after the run starts. Any change is a new, dated registration that says why,
and the first one's result still stands.

## 1 · What is pinned

| input | pinned as | how to re-derive |
|---|---|---|
| the reader | `tools/read_track.cjs`, sha256 `ea4fb383b742b333…` (the live file, 2026-09-27; its only change from `2d7ba96` is the opt-in `READ_PROFILE` output) | `sha256sum tools/read_track.cjs` |
| the real reads | Sakura `READ_PROFILE=1 node tools/read_track.cjs <AC>/content/tracks/sakura_speedway 21768 28.7` → sha256 `dcb039d30a59659e…`; Centrifuge `… centrifuge 36000 26` → `1fae0ae152ec8dba…` | re-run; **B's reads are byte-identical to E's `reads/` (both hashes)**, so the reader is deterministic |
| the statistics code | `exo_memory/loop/p-like/plike_stats.js`, sha256 `c6832696b89cd39d…` | the SAME script scores the real stretch and the rebuild: `node plike_stats.js <read.json> 0 3000` |
| the targets | `p-like/sakura_speedway.target.json` `aad7c8e8dbcb8f26…`, `p-like/centrifuge.target.json` `bdf56346386da7b8…` | the script on the real reads |
| the stretch | the first **3,000 m walked from `AC_START_0`**, reader stations with `0 ≤ d ≤ 3000` | — |
| the word sequences (a MEASUREMENT input only) | Sakura 46 words, sha256 `eb0d0403d23e1b1d…`; Centrifuge 60 words, `c0b69926241b2757…` (the reader's `text` entries with `from ≤ 3000`) | **never committed to the t180 repo or any repo** (Rule 3). They are kept in B's scratchpad, and only their hashes are here |
| the library | `src/doc/corpus.json` **as it lands with A's vocab.** At registration the live, unlanded file is sha256 `76e9b14f063cb8a4…`. The run records the landed file's sha256. If it differs from `76e9b14f…`, the run names the diff, and **a band that moved TOWARD a default after this registration is reported as such** | `sha256sum src/doc/corpus.json` |

**The targets (the real stretches, measured now by the sealed script):**

| statistic | Sakura (0–3,000 m) | Centrifuge (0–3,000 m) |
|---|---|---|
| stations / span | 746 / 2,980 m | 746 / 2,980 m |
| width p10 / median / p90 (m) | 31 / 31 / 35 | 29 / 30 / 34 |
| cross-section shares (reader's shape: flat / bowl / bowl+ / pipe / pipe+) | 0 / 0 / 0 / **100** / 0 %, dominant **pipe** | 0 / 0 / 0 / **100** / 0 %, dominant **pipe** |
| bank, `up` (°): median / p90 | 36.2 / 50.6 | 31.6 / 90.5 (a loop) |
| turn-class shares (straight / sweep / turn / tight) | 35.0 / 16.5 / 22.4 / 26.1 % | 37.4 / 24.1 / 21.0 / 17.4 % |
| curved radius (R ≤ 1,500 m): median / p10 | 243 / 98 m (n 485) | 353 / 94 m (n 467) |
| climb: net Δy / height range / ascent / \|grade\| p90 | −7.5 m / 24.7 m / 78.2 m / 6 % | −145.2 m / 366.3 m / 252.6 m / 75 % |

## 2 · The rebuild, exactly (so the test has teeth)

For each track, the runner turns the pinned word sequence into palette words, **one palette word per reader word**, in order, as follows.

- **Word:** from the reader's turn class and roll tag:
  - `straight` → straight; `sweep` → sweep; `turn` → turn; `tight` → tight; `L`/`R` → direction;
  - a run of consecutive `^wall` words → ONE wall-ride;
  - a run of consecutive `^inv` words → ONE inversion;
  - `JUMP(…)` → jump.
- **Font:** the palette font that the reader classifies as that shape when it is placed as a DEFAULT straight and read back (`pipe` →
  whichever font reads as pipe, and so on). If two fonts read as the same shape, the word's own default font is used; if none does, the
  word's default font is used, and the mismatch will show in the shares.
- **Tempo:** the word's DEFAULT tempo, always. No tempo is chosen per word.
- **The only handles the runner may set** (the plan's "sculpt handles", restricted to those that FOLLOW THE PATH):
  - `length`: the reader word's span (`to − from`, plus one 4 m step);
  - the heading change: the sum of `k × 4 m` over the word's stations;
  - `climb`: the change in `c[1]` over the word;
  - for a jump, its gap and drop as the reader measured them.
- **Everything else stays at the palette's DEFAULT**: width, wall, the cross-section ψ, roll or bank, the easing, the ramp.
  - **Why:** width, shape and bank are exactly what the keeper said is wrong ("nowhere near what I want … not good for t-180s").
  - If the runner could sculpt them, any palette could be made to pass, and the test would measure the runner, not the pieces. The path
    handles are allowed because no palette can know a particular track's corners.
  - A handle the sculpt bounds refuse is left at the nearest value the builder accepts, and that is recorded.
- **Closing, for export:** the stretch is closed by the connector (`closeLoop`), or, only if it offers no candidate, by the fewest palette
  words at default handles that let it close. What closes the loop is EXCLUDED from the statistics (it starts after the stretch).
  - If no way to close is found, P-LIKE is **NOT RUN** for that track, with the reason. That is a different outcome from FAIL, reported
    as such.
- **Markers:** the start line is anchored so that the rebuild's `AC_START_0` sits within the first 50 m of its first word. The reader then
  starts where the stretch starts, as on the real track.
- **Export and read-back:** `exportTrack` (every check ON) into a scratch folder outside every repo, then the pinned reader on it
  (`READ_PROFILE=1`, the track's own length and width from its `ui_track.json`), then `plike_stats.js <read> 0 3000`.

## 3 · The tolerances, each with its reason (PASS needs every row, on both tracks)

| # | statistic | tolerance (rebuild vs the target of the same track) | reason |
|---|---|---|---|
| T1 | span | rebuild span within **±10 %** of 2,980 m | the reader under-counts distance when its heading lags after a turn (p-d166-roundtrip-C §3), on both sides but not equally |
| T2 | width median | within **±20 %** of the target median | the reader's heading defect reads widths up to 1/cos 30° = +15.5 % high after turns (p-d166 §3, the round-trip todos); +4.5 % margin for a palette's discrete default width. The old palette (8–20 m) fails this by construction |
| T3 | width p90 | within **±25 %** of the target p90 | as T2, at the tail, where fewer stations decide |
| T4 | the dominant cross-section class | **identical** (both: pipe) | the shape class is the reader's own categorical name; a palette whose default reads as bowl or flat on these tracks is not "like" them |
| T5 | each cross-section class share | within **±15 percentage points** | one threshold (edge 25° / 70°) separates neighbouring classes; a profile near it can flip stations. 15 pp allows that, and still fails a palette that is mostly flat or bowl on a 100 % pipe stretch |
| T6 | bank median (`up`) | within **±8°** | FINDINGS §1: road-centre bank 16–50° across the library; 8° is about a quarter of that spread. It fails an unbanked palette (0°) on both tracks (targets 36° and 32°) |
| T7 | bank p90 (`up`) | within **±12°** | the tail includes walls and a loop (Centrifuge 90.5°); fewer stations, so a wider band than T6 |
| T8 | each turn-class share (straight / sweep / turn / tight) | within **±15 percentage points** | the classes are the reader's thresholds at 1,500 / 500 / 180 m; its curvature is smoothed over ±5 stations (±20 m), which moves stations across a threshold at word ends |
| T9 | curved radius median | within a factor **1.5** (÷1.5 to ×1.5) | the class thresholds are ~3× apart (180, 500, 1,500 m); 1.5 is under half a class width in log terms. It is the "radius distribution" check the plan names, beside T8 |
| T10 | net Δy | within **±max(10 m, 25 % of the target's height range)** | the climb handle is set per word, so this checks that the pieces CARRY it (sculpt bounds, the ramps, what the connector adds) |
| T11 | height range | within **±max(10 m, 25 %)** of the target range | as T10 |
| T12 | \|grade\| p90 | within **±max(2 points, 25 %)** of the target | as T10; percentage points of grade |

**Criterion 2 (the pieces themselves):**
- For every built-in word (straight, sweep, turn, tight, wall-ride, inversion, jump), at DEFAULT handles in its DEFAULT font and tempo,
  each quantity the landed `corpus.json` gives with a p10/p90 for that class must lie in **[p10, p90]**. Road classes: `length_m`,
  `radius_m`, `heading_deg`, `width_m`, `bank_deg`, `climb_m`. Jump: its gap and drop.
- **The one stated exception:** a straight's heading and radius are fixed by its definition (0°, no radius), and the corpus's straight
  heading band starts above 0 (p10 0.064° at registration) only from reader noise. So those two are exempt for the straight. Nothing else
  is exempt.
- Values are the builder's own defaults (`src/doc/vocab.js` / `defaultWord`, with radius the resolved peak radius and bank the default
  roll in degrees), each printed beside its band.

## 4 · The control, registered so the tolerances cannot be too loose unnoticed

**The same procedure on the CURRENT palette (`d331f82`, before any D182 change) must FAIL on both tracks.**
- Registered expectation: it fails at least T2 (widths 8–20 m against 30–31 m), T6 (bank 0° against 32–36°), and criterion 2.
- **If the pre-D182 palette PASSES, these tolerances are void as too loose, and P-LIKE is reported as having no teeth**, not as a pass for
  anyone.
- The control runs before or beside the D182 run, by the same runner and scripts.

## 5 · What P-LIKE does NOT establish

- It reads geometry, not driving: nothing about loads, the lap or whether a T-180 survives it.
- It uses one reader, with the known heading defect (p-d166 §3). Both sides are read by the same reader, but its bias need not cancel.
- It covers two stretches of two tracks, both 100 % pipe: a bowl-dominant track (the library's commonest, FINDINGS §1) is not tested by
  it.
- A PASS says the pieces at defaults can rebuild these stretches' statistics. It does not say a user will.

*Written by B, 2026-09-28 00:50 local (origin/main d331f82), before A's vocab or C's fonts landed. The sha256 of this file is in
`handback/p-d182-plike-reg-B_2026-09-27.md`.*
