# D378 part 1b (pane B): the colours hard-coded outside the theme tokens, at be4a527 (v0.4.1)

Read-only. No code changed, nothing committed, no window opened. Brief: `exo_memory/loop/plan_t180_handoff_2026-10-15.md:2343`, `:2346`.
Tree: `C:\Users\nname\Downloads\t180-track-builder`, every read with `git show be4a527:<path>` / `git grep … be4a527` (HEAD there is be4a527 too).

## 1. The count: 69 does not hold

checked: `git grep -hoIE "#[0-9a-fA-F]{3,8}\b" be4a527 -- 'app/**/*.js' ':!app/test/**' | wc -l` → **51 hex literals**, all in the 14 named files (none elsewhere in app JS). Same 51 at 883f681 (the commit the brief says the librarian checked).

| file | hex | rgb()/rgba() |
|---|---|---|
| app/core/flightlayer.js | 2 | 0 |
| app/core/griplayer.js | 4 | 0 |
| app/core/handles.js | 15 | 1 |
| app/core/labels.js | 3 | 0 |
| app/core/panel.js | 1 | 0 |
| app/core/piecesui.js | 3 | 0 |
| app/core/pitui.js | 1 | 0 |
| app/core/selectionlayer.js | 4 | 0 |
| app/core/spawnslayer.js | 9 | 0 |
| app/core/spawnsui.js | 3 | 0 |
| app/core/valuesoverlay.js | 1 | 2 |
| app/onboarding/index.js | 2 | 2 |
| app/preview/guideslayer.js | 2 | 2 |
| app/preview/renderer.js | 1 (in a comment) | 0 |
| **14 files** | **51** | **7** → 58 |
| app/preview/index.js (not in the 14) | 0 | 1 → **59 in 15 files** |

- Named colours: 0 used as colours (`'red'`/`'ok'` in spawnsui/validate-ui are level keys, not CSS).
- I could not reproduce 69. Patterns tried (`app/core`, `app/onboarding`, `app/preview`): hex without `\b` 51; hex + `rgba?(` 59; hex + `rgba?(` + `var(--` 71. inferred: the 69 used a different pattern or scope; worth asking the librarian for theirs.
- **Not in any hex count, but colour all the same:** float RGB arrays the WebGL side draws with: `app/preview/renderer.js:135` COLOURS (edge, tie, grid, marker, ghost), `:143` CLEAR, `:145` fog; `app/preview/guides.js:26` COLOURS (ground, lattice, level, drop, axis, mirror); `app/preview/aclook.js:38` (sun/ambient lighting); `app/core/griplayer.js:16` LOW/MID/HIGH. Listed in §3.
- Also outside the tokens, in `app/index.html` itself (not the 14): `:49` `#b0303a` (close-button hover red), `:50` `#fff`, `:123`/`:132` `#fff` (option text), `:52`/`:103`/`:131`/`:148`/`:156`/`:160` rgba veils, shadows and panel glass, `:162` `#000` text-shadow.

## 2. Every one (verdict: CHROME = follow the theme, MEANING = stays, UNCLEAR = said so)

`#0b0d11` is the pre-SIGIL blue-black (14 of the 51). It is the dark outline/backing every canvas layer draws under its bright line. No token equals it; nearest are `--panel #0b0b0a` and `--bg #060606`.

| file:line | colour | what it draws | verdict | token |
|---|---|---|---|---|
| flightlayer.js:66 | #0b0d11 | dark outline under the flight's dashed line | CHROME | new `--ink` (canvas outline), or `--panel` |
| flightlayer.js:66 | #7fd8ff | the flight's dashed line (jump take-off to landing) | UNCLEAR, lean MEANING: it is the kind colour that tells a flight from selection (amber), spawns grid (#5fd3ff), grip | — (if chrome: `--accent`, but that collides with the ghost, which is already accent) |
| griplayer.js:46 | #0b0d11 | outline under each grip-coloured centreline | CHROME | `--ink` |
| griplayer.js:53 | #0b0d11 | border of the grip key's gradient | CHROME | `--ink` |
| griplayer.js:54 | #0b0d11 | backing box of the key's label | CHROME | `--panel` |
| griplayer.js:54 | #eef1f6 | key text "grip: 50% 100% 150%" | CHROME | `--text` |
| handles.js:37 | #ffffff | length handle (axis T) | MEANING | — |
| handles.js:39 | #ff5a5a | width handle (L) | MEANING | — |
| handles.js:40 | #4d86ff | bank handle (U) | MEANING | — |
| handles.js:41 | #3ddc6e | cup handle | MEANING | — |
| handles.js:45 | #b968ff | turn handle | MEANING | — |
| handles.js:46 | #ffd23d | climb handle | MEANING | — |
| handles.js:50 | #b968ff | turn (degrees form) | MEANING | — |
| handles.js:51 | #ffd23d | climb (degrees form) | MEANING | — |
| handles.js:59 | #ffffff | landing: forward | MEANING | — |
| handles.js:60 | #ff9f43 | landing: sideways | MEANING | — |
| handles.js:61 | #ffd23d | landing: height | MEANING | — |
| handles.js:62 | #b968ff | landing: heading | MEANING | — |
| handles.js:230 | #0b0d11 | outline under the handle's double arrow | CHROME | `--ink` |
| handles.js:235 | #0b0d11 | outline of the handle's square | CHROME | `--ink` |
| handles.js:239 | rgba(11,13,17,.92) | backing of the drag readout (border is the handle's own colour) | CHROME | `--panel` at alpha: new `--veil` |
| handles.js:240 | #eef1f6 | drag readout text | CHROME | `--text` |
| labels.js:150 | #ffffff | hover label text | CHROME, **pinned** (see note A) | `--text` |
| labels.js:150 | #0b0d11 | hover label background (opaque) | CHROME, **pinned** | `--panel` / `--bg` |
| labels.js:151 | #0b0d11 | 2 px ring outside the label | CHROME, **pinned**; must equal the background | same as :150 |
| panel.js:245 | #eef1f6 | the Extend readout text | CHROME | `--text` |
| piecesui.js:122 | #0b0d11 | saved-piece thumbnail background | CHROME | `--panel` |
| piecesui.js:125 | #ffb020 | the saved piece's plan line in the thumbnail | UNCLEAR: same amber as the selection (below); decoration or "a piece" colour? | `--accent` if chrome |
| piecesui.js:127 | #ffffff | dot where the piece starts | UNCLEAR, lean MEANING (start = white, as the start line) | — |
| pitui.js:80 | #ff4d4d | fallback in `var(--bad, #ff4d4d)`, pit lane error text | MEANING, already on `--bad`; fallback never shown while `--bad` is set (and differs from it, #e0573f) | `--bad` (drop fallback, optional) |
| selectionlayer.js:52 | #0b0d11 | outline under the selected pieces | CHROME | `--ink` |
| selectionlayer.js:52 | #ffb020 | the selected pieces' bright centreline | UNCLEAR: selection is a chrome role (SIGIL's accent), but it must also contrast with the grip/flight/handle hues on the road; `--mine #d9a55a` (amber, used for "mine" borders) is the nearest token | `--accent` or `--mine`, the keeper's eye |
| selectionlayer.js:56 | #ffb020 | dots at each end of the selection | as :52 | as :52 |
| selectionlayer.js:56 | #0b0d11 | their outline | CHROME | `--ink` |
| spawnslayer.js:47 | #ffffff | start line | MEANING | — |
| spawnslayer.js:47 | #5fd3ff | grid slots | MEANING | — |
| spawnslayer.js:47 | #d6dbe3 | pit boxes ("in grey") | MEANING | — |
| spawnslayer.js:47 | #ff9a2e | hotlap spawn (orange) | MEANING | — |
| spawnslayer.js:47 | #a8b0bd | pit lane edges and their label | MEANING | — |
| spawnslayer.js:47 | #ff4d4d | a slot off the road / overlapping | MEANING (warning) | could point at `--bad` |
| spawnslayer.js:80 | #0b0d11 | backing of the pit-lane label | CHROME | `--panel` |
| spawnslayer.js:87 | #0b0d11 | outline under each mark | CHROME | `--ink` |
| spawnslayer.js:91 | #0b0d11 | backing of each mark's label | CHROME | `--panel` |
| spawnsui.js:101 | #ff4d4d | fallback in `var(--bad, …)`, red check text | MEANING, already `--bad` | `--bad` |
| spawnsui.js:101 | #ffb347 | amber check text | MEANING | `--warn` exists for exactly this; today it bypasses it |
| spawnsui.js:101 | #8fd18f | "all on the road" ok text | MEANING | `--ok` exists; today it bypasses it |
| valuesoverlay.js:26 | rgba(11,13,17,.86) | values dashboard background | CHROME | `--veil` (new) |
| valuesoverlay.js:26 | #ffffff | the values' numbers | CHROME | `--text` |
| valuesoverlay.js:37 | rgba(255,255,255,.14) | thin rule between values | CHROME | `--hair` (same alpha) |
| onboarding/index.js:22 | rgba(20,22,28,.94) | guide card background | CHROME | `--raise` / `--panel` (at alpha) |
| onboarding/index.js:22 | #e8eaee | guide card text | CHROME | `--text` |
| onboarding/index.js:22 | rgba(0,0,0,.45) | guide card shadow | CHROME, neutral (black shadow; can stay as is) | — |
| onboarding/index.js:28 | #ffb31a | outline on the thing the guide points at | UNCLEAR, lean CHROME ("look here" is the accent's job) | `--accent` |
| guideslayer.js:17 | #ffd23f | symmetry-centre handle ring | MEANING: it is the symmetry axis yellow (`guides.js:26` axis [1.0,0.82,0.25] ≈ #ffd140) | — |
| guideslayer.js:17 | rgba(255,210,63,.18) | its fill | MEANING, same | — |
| guideslayer.js:24 | #9fb4d0 | guide distance labels | CHROME | `--dim` |
| guideslayer.js:24 | rgba(10,12,16,.55) | their backing | CHROME | `--veil` |
| renderer.js:135 | #b9a8ff | **comment only** ("the accent violet"); the ghost is drawn from the float [0.73,0.66,1.0] | not a live colour | the ghost float = `--accent` |
| preview/index.js:49 | rgba(10,12,16,.6) | preview HUD backing (outside the 14) | CHROME | `--veil` |

**Tally of the 51 hex**, counted row by row from the table (by hand, twice, same answer the second time):

| verdict | hex | which |
|---|---|---|
| CHROME | 21 | #0b0d11 ×14, #eef1f6 ×3, #ffffff ×2 (label text, values text), #e8eaee, #9fb4d0 |
| MEANING | 23 | handles 12, spawnslayer 6, spawnsui 3 (#ff4d4d fallback, #ffb347, #8fd18f), pitui #ff4d4d fallback, guideslayer #ffd23f |
| UNCLEAR | 6 | #7fd8ff, #ffb020 ×3 (selection ×2, thumbnail), #ffb31a, the thumbnail start dot #ffffff |
| comment | 1 | renderer.js:135 |

The 7 rgb()/rgba(): CHROME 5, MEANING 1 (the guide handle fill), neutral shadow 1.

## 3. The float colours (WebGL), not hex but in the same question

| file:line | what | verdict | token |
|---|---|---|---|
| renderer.js:143 CLEAR [0.024,0.023,0.021] | 3D background | CHROME | `--bg` (#060606 = 0.024 exactly) |
| renderer.js:145 fog [0.07,0.08,0.1] | distance fog | CHROME (still blue-black, pre-SIGIL) | new `--fog`, or derived from `--bg` |
| renderer.js:135 ghost [0.73,0.66,1.0] | Jump candidate ghost | CHROME | `--accent` |
| renderer.js:135 grid [0.2,0.23,0.28] | ground grid | CHROME | `--line` |
| renderer.js:135 edge, tie | road edge lines, cross ties | UNCLEAR (they draw the road itself) | — |
| renderer.js:135 marker [1.0,0.62,0.15] | marker lines | MEANING (orange, as hotlap) | — |
| guides.js:26 ground/lattice/level/drop | symmetry guides' blue-grey lines | CHROME | `--dim`-family, new token |
| guides.js:26 axis, mirror | the axis yellow, the mirror magenta | MEANING | — |
| griplayer.js:16 LOW/MID/HIGH | grip blue/white/orange; pinned by `core-pieces-ui.test.js:753` (`#2678ff`, `#ffffff`) | MEANING | — |
| aclook.js:38 sun/ambient | the AC-look lighting | MEANING (it imitates AC) | — |

## 4. Notes for part 2

- **A. labels.js is contrast-pinned.** Its comment cites E's M5 (≥ 4.5:1 over any road, measured by pixels) and mutant R15 in `app/test/core-mutation.test.js:29` anchors the literal `background:#0b0d11;`. Moving it onto a token un-anchors R15 (NOT APPLIED) unless R15 is re-pointed in the same change, and each theme's `--text` on its `--panel` must be re-measured there.
- **B. No canvas reads a token today.** checked: `git grep "getPropertyValue('--" be4a527 -- app` → none outside tests. Every canvas layer (flight, grip, handles, selection, spawns, thumbnails) and the WebGL renderer need a reader (e.g. `getComputedStyle(document.documentElement)`, parsed to rgb/floats), refreshed when `data-theme` is set at boot. The DOM overlays (labels, values, guides, onboarding, preview HUD) can take `var(--…)` directly.
- **C. New tokens needed:** `--ink` (the dark canvas outline; or decide it is `--bg`), `--veil` (the translucent dark backing at ~.55–.92; one token plus per-use alpha, or `color-mix`), possibly `--fog`. Everything else maps to existing ones.
- **D. spawnsui bypasses `--warn` and `--ok`** with its own amber and green; whether to move them is a meaning call (the brief says warning hues stay readable as what they are; they would, they'd just follow SIGIL's versions).
- **E. The UNCLEAR six are the keeper's eye:** the selection amber (×3 incl. the thumbnail line), the flight cyan, the guide-target outline, the thumbnail start dot.

## Corrections (mine)

- My first §2 tally, written into this file, double-counted the labels’ #0b0d11 and came out two ways; I recounted row by row and replaced it with the table above (21 / 23 / 6 / 1 = 51).

SOURCES: git grep / git show at be4a527 in C:\Users\nname\Downloads\t180-track-builder (commands above), plan_t180_handoff_2026-10-15.md:2340-2348
NEXT: librarian read this; plan default: a building pane does part 2 after the keeper's pick, using §2–§4.
