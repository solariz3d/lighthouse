# D546: our screens held against the slop list (pane C, sibling-0845a868). An audit; no code changed

The order: the chair's 00:58:05Z (D546 routed to C; tier check it; plan `exo_memory/loop/plan_d546_slop_audit_of_our_screens_2026-10-29.md`, survey `exo_memory/research/ai_slop_ui_survey_2026-10-29.md`, both read whole).

**The verdict: the critique has tells, not only taste.**
- **The falsifier did not fire.** It needed fewer than 3 tells PRESENT; §1 has **10 of 15 PRESENT** (4 strong, 6 weak), and §2 has 6 of 8.
- **What reads as slop is in the chrome:**
  - glows and blur stacked as decoration;
  - a flat type scale;
  - status lines that show no state;
  - colour that fails exactly where it carries meaning (the reds and ambers);
  - a random look on every start.
- **What reads as crafted is already there, in the domain:**
  - the checker's sentences and the g graph;
  - the band in the road's own units;
  - "HOTLAP · 639 km/h at the line";
  - 0 emoji;
  - 0 stock copy.
- **Glass and aurora carry their named tells by mechanism.** Glass's column blur solves a real layering problem; aurora's sky signals nothing.

## 1. The renders (the sheet)

    checked: node SC/d546/audit546.js C:\Users\nname\Downloads\t180-wt-c546 SC/d546/shots (under lockrun2 + belownormal) → SC/d546/run.log, shots/measures.json

- **The tree:** t180-fresh at **98e3d81** (the installed tip), in a throwaway detached worktree `C:\Users\nname\Downloads\t180-wt-c546`.
- **The browser:** headless Chrome, `--mute-audio`, title zz-headless-test, 1920×1080.
- **The looks:** the six of the Random pool (sigil, aqua, skyline, skyline-night, glass, aurora).
- **The rig:** extended from A's `S/d536/audit.js`, keeping its fake native side, its look setting and texture-page's own contrast probe.

**The states** (8 per look, 48 shots):
- From a fresh start:
  - `guide`: the first-start card;
  - `empty`: the empty start;
  - `open-none`: File ▸ Open with no saved tracks. A bare state, added beyond the plan's seven.
- With CRAZY TEST restored (a read-only copy):
  - `ghost`: building, Extend hovered;
  - `file-open`: File ▸ Open… unfolded;
  - `pitlane`: Track ▸ Pit lane…;
  - `checker`: **3 red · 12 amber**. CRAZY TEST alone shows 0 red and 6 amber, so a 150 m 720° coil was extended in the page only, and nothing was saved;
  - `sculpt`: Build ▸ Sculpt mode, a run selected by the user's own path (Overhead view; a real click on the road at s 198 m, then a shift-click at s 1,850 m), Bank the bend unfolded.

**The files:**
- **The sheet:** `SC/d546/shots/sheet.png` (2700×1400, 6 looks × 8 states) and `sheet.html`.
- **Each shot:** `SC/d546/shots/<look>-<state>.png`.
- **The counts per shot:** `shots/measures.json`.
- **Leftovers before and after:** tab proxies 0 (uncalibrated), orphan browsers 0, long-running 0.

## 2. The per-tell table

PRESENT is graded **S** (strong: plain in the shot, more than one place) or **W** (weak: one look, or a mild form).

| # | tell (survey §1) | verdict | where, how many; the shot |
|---|---|---|---|
| 1 | purple/indigo gradients | **PRESENT W** | Sigil's one accent is `#b9a8ff`, a pale violet (index.html `--accent`). The 3D road renders lavender-violet in 4 looks (sigil, glass, aurora, skyline-night), the largest coloured area on screen. Aurora's chrome is an indigo ground. No purple-to-blue gradient on the UI chrome itself. `sigil-empty`, `aurora-ghost` |
| 2 | system sans, one weight, flat type scale | **PRESENT S** (the scale) | **8 font sizes, all between 10 and 16 px**; the largest text in any of 48 shots is 16 px; the column's body is 12 px ×37 and 13 px ×7, 8 % apart. 5 weights (300–700), but used 400 against 600. The fonts are NOT Inter: Segoe UI Variable, Bahnschrift (chosen, per index.html's SIGIL note), Cascadia Mono. `measures.json` sizes |
| 3 | cards for everything | **PRESENT W** | Over the view, 8 boxed floats: the band, two camera toolbars, the grid caption, the keys line, the view tag, "Show the guide", and the label boxes on the road. 4 of the persistent ones hold one line. The Track menu draws every item as a full-width bordered box (5). `glass-pitlane`, `sigil-ghost` |
| 4 | centred hero formula | N.A. | a tool; no landing page |
| 5 | glass, blur, glow, aurora | **PRESENT S** | Backdrop blur on 10–12 elements in every themed look (3 in sigil); glass 14–20 px blur + saturate. Blurred box-shadows visible at once: **skyline 95, skyline-night 94, aqua 33, aurora 13, glass 0, sigil 1**. Aurora: a glowing green curtain and a starfield in the sky. `aurora-ghost`, `skyline-sculpt` |
| 6 | emoji as icons | ABSENT | 0 pictographic characters in 104 UI files (two `↔`) |
| 7 | dark + neon, text failing contrast | **PRESENT S** | 5 of 6 looks are dark; neon-glow accents in aqua (cyan pills) and aurora (teal Export). Text under 4.5:1 in **every** look, concentrated in the red/amber status text: skyline amber **1.0**, aqua red **1.46**, glass pit-lane note **2.28** (counts in §3). `skyline-checker`, `aqua-checker` |
| 8 | uniform everything, no hierarchy | **PRESENT S** | The column: 12 field rows at equal weight, each with an identical "start" box; length, the main control, weighs the same as "tube sweep". The band: 5 equal values, and the NEXT row of 11 equal chips. `sigil-empty` |
| 9 | left strips, status dots, pills | **PRESENT W** | An accent left-strip on menu-option hover (base css), a hairline left rule on the Open list; aqua's 999 px pill buttons. Status dots: none decorative (the checker's red/amber bullets mean something). No pulsing |
| 10 | gradient text, italic serif | ABSENT | 0 `background-clip:text`, 0 italic in all CSS |
| 11 | generic copy, fake proof | ABSENT | Copy is specific: "the car rides on its chassis here, not its tyres", "HOTLAP · 639 km/h at the line" |
| 12 | default icon kit, icon tiles | ABSENT | No icon kit; text glyphs ▾ ✕ ↔ only; the logo is a ringed dot, not a letter tile |
| 13 | decorative motion | **PRESENT W** | 1 look: aurora's sky "breathes" every 18 s (`aurora-breathe`), tied to nothing. 0 animations in the other five |
| 14 | second-order "tasteful" defaults | **PRESENT S** | Tracked small-caps eyebrows on the band (LENGTH, TURN, CLIMB, BANK, WIDTH, NEXT); middle-dot strings everywhere ("13 pieces · 19,657 m · loop open", "Build view · plain road (L)", "HOTLAP · 639 km/h"); a mono label ("Build view · plain road (L)" in Cascadia Mono) |
| 15 | missing states, demo-only layouts | **PRESENT S** | §3 states: 2 designed, 4 bare. The checker list prints the same ~60-word amber sentence once per place: 4 times in a 230 px column. A real track breaks the layout a demo track would not. `aqua-ghost`, `skyline-checker` |

| tell (survey §2, tool UIs) | verdict | where |
|---|---|---|
| mismatched density | **PRESENT W** | a dense 12 px column beside 16 px bold label boxes on the road and two 650 px-wide bars at the foot; crammed 12 px sentences in the checker |
| equal-weight metric tiles | **PRESENT S** | the band's 5 values and 11 NEXT chips, all one weight |
| every screen a landing page | ABSENT | no taglines, no "welcome" |
| everything visible at once | **PRESENT S** | all 12 fields plus the checker always shown (since D536 removed the fold, at the user's ask); two toolbars and two help lines always on |
| status chrome with no state | **PRESENT S** | 3 cases: "Grip 100%" under a grip field that reads 100; the always-on keys line (it never changes); the pit-lane note in the error red when it is information |
| demo-data layouts, missing states | **PRESENT S** | as tell 15 |
| rounded outlines with neon glow | **PRESENT S** | aqua, skyline, skyline-night (33–95 blurred shadows), aurora's Export |
| the "Linear clone" without its systems | ABSENT | the systems are real: tokens per look, keys for the core actions, the checker's own words. But see keyboard in §3 |

## 3. The counts the plan asks for

**Radii** (distinct, across 8 states):

| look | count | values |
|---|---|---|
| sigil | 5 | 2, 3, 4, 6, 8 px |
| glass | 3 | 3, 4, 8 px |
| aqua | 6 | 3, 4, 8, 10, 18, 999 px |
| aurora | 6 | 3, 4, 8, 10, 14, 16 px |
| skyline, skyline-night | 10 each | 3, 4, 7, 8, 9, 12, 13, 14, 16, 18 px |

**Fonts:**
- **Sizes:** 8 (10, 10.5, 11, 12, 13, 14, 15, 16 px), the same in every look.
- **Weights:** 5 (300, 400, 500, 600, 700).
- **Families:** 3 chosen (Segoe UI Variable, Bahnschrift, Cascadia Mono) plus 2 fallbacks.
- **The column's body sizes:** 12 and 13 px, within 15 %.

**Colours:**
- **Distinct text colours:** 13–16 per look.
- **Colours that carry meaning: 3** (red, amber, the accent for "selected or active"), plus the 3D handle colours, which code each handle's channel.
- **The rest:** text and dim tiers, plus each theme's decoration (glows, gradients, the aurora curtain).
- inferred: the split is read from the tokens and the shots, not from a tool.

**Glow, blur and pulse** (the most visible at once):

| look | blurred shadows | text glows | backdrop blur | animations |
|---|---|---|---|---|
| sigil | 1 | 2 | 3 | 0 |
| aqua | 33 | 3 | 10 | 0 |
| skyline | 95 | 6 | 12 | 0 |
| skyline-night | 94 | 4 | 11 | 0 |
| glass | 0 | 8 | 10 | 0 |
| aurora | 13 | 8 | 10 | 1 |

**Cards, one thing against a list:**
- Persistent floats over the view: 8.
- Holding one line or one button: 4 (the grid caption, the keys line, the view tag, "Show the guide").
- Lists: the band and the two toolbars.

**Contrast per look** (texture-page's probe, every visible text, 586 readings per look over the 8 states):

| look | lowest | median | under 4.5:1 |
|---|---|---|---|
| sigil | 3.08 | 14.15 | 10 |
| aqua | 1.46 | 8.37 | 7 |
| skyline | **1.00** | 11.76 | **29** |
| skyline-night | 2.93 | 8.82 | 6 |
| glass | 2.28 | 12.16 | 4 |
| aurora | 3.40 | 13.12 | 3 |

The low ones are the checker's red and amber lines and the pit-lane note, in the very states where colour carries the warning. The probe in the app's own test covers only the column, the band and the bar, not the checker list or the Track menu panels. That is why this was not caught.

**Designed states against bare ones: 2 designed, 4 bare.**
- **Designed:**
  - the first start: the guide card, 6 steps;
  - a refused export: a native "Not exported" dialog plus the red list.
- **Bare:**
  - the empty track after the guide: an empty bowl and "0 pieces · 0 m · loop open";
  - a failed export: "export failed: …" in the header's status slot;
  - a failed open or save: a message in the same slot;
  - a refused close: "Type a name for the track, then save or close again." in the same slot.
- **Minimal:** no saved tracks gives "no saved tracks yet", one line in the list.

**Keyboard reach:** keys for undo/redo/save/remove-head (Ctrl+Z/Y/S/Backspace); Tab for Sculpt; 1–9 tools; `[ ]` radius; Esc; the camera keys (C, B, WASD/QE, arrows).
- **What cannot be done without a mouse:**
  - selecting pieces on the road, so Bank the bend, Save/Delete selected and Set grip on a run;
  - every handle drag;
  - Sculpt's drags.
- **Tab is taken by Sculpt** outside a field, so it does not walk focus through the menus and buttons; only Shift+Tab moves it.
- **No command palette.**
- **Focus styling:** 3 `:focus-visible` rules in the base, 0 in any theme.

**Density:** 27 controls in the column's 250,976 px² = **0.108 per 1000 px²** (10.8 per 100,000 px²). Across the page there are 70 controls, all tabbable. I did NOT measure a Linear-class tool, so there is no side-by-side number.

## 4. §3 and §4 as questions about us

- **Where is the one decision?**
  - **It exists, but in the content, not in the visual system:** this UI is the road and its numbers. The band in the road's units, the checker's sentences with g, °/m and the metres where they happen, the g graph, the label on the head ("5000.00 m · turn +2250°"). No default would produce those, and they are the "one handmade thing" the survey asks for.
  - **The chrome does not say so:** the band's numbers are 16 px like everything else; 8 floats, 13–95 glows and a random sky compete with it.
  - **Evidence:** `sigil-ghost`, where the band, the label on the road and the checker are the only things a racer reads, and they are the same weight as the help lines.
- **Is the Random pick on load what a newcomer sees?**
  - **Yes.** checked: app/index.html's boot script picks `Math.random()` over the five looks when nothing is saved; settings.js lists `music` (Random) first.
  - **The odds:** a first screen is glass or aurora **2 times in 5**, aqua, sigil 1 in 5 each, skyline and skyline-night 1 in 10 each.
- **Which looks carry the named tells, and by what mechanism?**
  - **glass:** backdrop blur by design (14–20 px, saturate).
    - **Earned once:** the column floats over the live 3D view, and the blur keeps text readable over moving geometry. The base gives every look a 10 px blur for that reason.
    - **Reflexive elsewhere:** on the menus, the guide card and the veil.
  - **aurora:** a glowing green curtain in the 3D sky and an 18 s breathing gradient. It signals nothing about the track; the survey's exact phrase applies.
  - **skyline and skyline-night:** the "rounded outlines with neon glow" tell, by count (94–95 blurred shadows), plus the light look's worst contrast (amber at 1.0).
  - **aqua:** cyan pill buttons with glow.
  - **sigil:** carries the fewest (1 glow, 0 motion, hairlines), but its one accent is violet.
- **Is each look one deliberate thing, or the same panel re-skinned?**
  - **Re-skinned, unevenly coherent.** All six are the same layout, the same 8 font sizes and the same floats; they differ in palette, radius and glow.
  - **Coherent:** sigil (one accent, hairlines, 5 radii, the "one primitive repeated" the survey praises) and glass (3 radii, no box glow).
  - **Least coherent:** skyline and skyline-night (10 radii, 95 glows).
  - **Aurora:** coherent in palette, but its sky is the one decorative motion in the app.

## 5. RANKED PROPOSAL (8). Each: what · why · how big · touches the themes?

1. **The one decision, made visible: "this is the road and its numbers."**
   - **What:** give the band's values and the label on the road a real display size and weight. Bahnschrift at 24–28 px, 700 for the value and 300 for the unit/label, against a 12 px column. Let everything else step down.
   - **Why:** survey §3 "one decision, visibly made" and "spend boldness in one place"; tell 2's flat scale (largest text 16 px).
   - **The evidence the UI already has it:** the checker sentences, the g graph and the HOTLAP line; only the type hides it.
   - check it · themes: base only (sizes); every look keeps its colours.
2. **An opinionated default look; Random stays a choice in Settings ▸ Theme.**
   - **What:** a new install opens in one look, with Random still available in Settings.
   - **Which default:** I'd take **sigil** (1 glow, 0 motion, 5 radii, hairlines). What would change my mind: the user wanting his default to be one of the coloured looks, or sigil's violet accent and lavender road read as the purple tell. A non-violet accent for the default is a possible sub-choice.
   - **Why:** survey §4, the random pick is the one structural "no decision"; today 2 in 5 first screens are glass or aurora.
   - just do it (the boot's no-saved-theme branch and settings' order) · themes: none removed.
3. **Meaning colours that pass contrast, in every look.**
   - **What:** per-look red and amber text tokens, re-measured so the checker's lines, the reds list and the pit-lane note read ≥ 4.5:1. Today: skyline 1.0, aqua 1.46, glass 2.28.
   - **The guard:** extend texture-page's probe to the checker and the Track menu panels.
   - **Why:** tell 7; §3 accessibility as craft evidence. A warning that cannot be read is worse than none.
   - check it · themes: token values only.
4. **The checker list groups what repeats.**
   - **What:** one line per kind, with its places listed ("amber, the car rides on its chassis (40 g or more): 15,645–16,487 m, 17,797–18,651 m, …"); the full sentence once, with the places after it.
   - **Why:** tell 15 (the layout breaks on a real track), §2 density.
   - check it · themes: no.
5. **Status chrome that shows no state goes, or shows one.**
   - **What:**
     - drop "Grip 100%" under a grip field that already reads 100;
     - the always-on keys line moves to the guide, or a `?`;
     - the pit-lane note gets the plain text colour unless something is wrong.
   - **Why:** §2 "status chrome that encodes no state".
   - just do it · themes: no.
6. **A glow and blur budget per look.**
   - **What:**
     - blurred shadows only on the focused or primary control, not 33–95 at once;
     - keep the column's 10 px backdrop (it solves the layering over the 3D view);
     - drop glass's blur on the menus and the cards;
     - aurora's sky stops breathing, or moves only when something happens (a lap time, a build finishing).
   - **Why:** tells 5 and 13; §2 rounded neon outlines.
   - check it · themes: **yes**. Every look keeps its palette and identity, and loses its reflexive glow. This is the "hopefully not our cool themes" item, and the answer is that the themes survive.
7. **A real type scale and fewer second-order sprinkles.**
   - **What:**
     - three sizes (12 body, 16 heading, item 1's display size) instead of 8 between 10 and 16;
     - 300 against 700 where it marks rank;
     - mono only for numbers in fields;
     - fewer middle-dot strings (status reads "13 pieces, 19.7 km, open").
   - **Why:** tells 2, 8 and 14.
   - check it · themes: base only.
8. **The column ranks its controls.**
   - **What:** length/turn/climb/bank first, at a larger weight; the cross-section group (cup, edges, edge start, tube sweep) quieter, or folded with its values summarised in one line.
   - **Why:** tell 8 and §2 "everything visible at once".
   - **The catch: this cuts against D536, where the user asked for every field shown.** So the fold is his call; the weighting alone is not.
   - check it · themes: no.

**Not in the eight, and worth a line:**
- **Keyboard reach:** Tab is taken by Sculpt, so the menus can't be reached by Tab; there is no palette; picking is mouse-only.
- It is real, but it is not what an outside eye calls "vibe coded". It belongs to a later lap.

## 6. Corrections and limits

- **Rig fixes, before any figure was used:**
  - the trial's Sculpt probe found no road from the Build view, so it now switches to Overhead;
  - a single-piece selection was widened to a real run;
  - a guide card left on the restored load is now dismissed.
- **The sculpt shots' first click** lands in CRAZY TEST's 1 km first piece; the run is p1–p2 at s 198–1,850 m.
- **Headless Chrome draws the 3D view without his GPU,** so a glow that depends on it may read differently on his machine.
- **Some claims are judgment with the shot beside them, not a measurement:** the "meaning versus decoration" split, the coherence calls and the one decision. They are marked as such where they appear.

The worktree `C:\Users\nname\Downloads\t180-wt-c546` (detached at 98e3d81) is kept so the renders can be re-run; it can be removed with `git worktree remove`. Nothing was committed in t180, nothing pushed, no code changed.

SC = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\scratchpad`.

NEXT: librarian, make the user's page from §1 (the sheet), §2 (the table) and §5 (the eight). He picks.
