# T-180 UI refactor: spec draft (the chrome), 2026-11-26

**His words.** 02:37: "We defintelly need to do a whole UI refactor, but keep all the plumbing." 02:50: yes to planning it
(`briefs/t180_ui_declutter.md`). Packet: `loop/packet_t180_refactor_plan_C_2026-11-26.md`. Drafted by pane C (L248).

**What this rests on.** Pane E's `research/clean_ui_design_sources_2026-11-26.md`, written "research" below.
- "research :N" is that file's line N.
- Its marks are carried: **[checked]** means E re-matched the quote at source; **[reader]** means a summarising reader saw it
  and it was not re-matched (research :15-18).
- Where this draft goes past a source, it says "ours", and the call is his eye's, not a source's.

**Scope.** The **chrome** only: header, menus, the left column, fields, buttons, dialogs, the camera dock, the HUD strip
and the guide card, plus the colour and shape tokens behind them.
- The **3D overlay layer** (labels, handles and readouts drawn on the road) is §10: open questions only, because the
  research does not carry it (research :41-45, :513-538).

**What this draft is.**
- It is a starting point taken from the ramps, for his eye; the research says the same of its own numbers (research :422).
- Every value below is laid over builder `0ab6cc8`'s real page as one stylesheet, in the L248 hand-back's before/after
  page (`handback/p-l248-refactor-plan-C_2026-11-26_evidence/refactor_override.css`).

---

## 1. One radius scale, one factor per look

**The scale.** Four steps, each picked by the element's size (research :176-183, :410-414):

| step | px at factor 1 | for | source |
|---|---|---|---|
| r1 | 2 | under 32 px tall: fields, small selects, list rows, the camera hint, a label window | Fluent: "For shapes smaller than 32 pixels, the corner angle is reduced to 2 pixels" [checked] (research :53-55) |
| r2 | 4 | controls: buttons, menu titles; the HUD strip and the camera dock | Fluent: "corner radiuses on rectangle shapes are 4 pixels by default" [checked] (:53); "Medium 4 for Buttons, dropdown" [reader] (:57) |
| r3 | 8 | menus, popovers, the guide card | Fluent "8 pixel … for large" [checked] (:54-55); Atlassian 8 for "floating UI, dropdown menus" [reader] (:159-160); Carbon 8 for "panels, modals" [checked] (:78) |
| r4 | 12 | dialogs and a floating left column: **the ceiling** | the largest non-pill corner any desktop ramp read puts on a floating panel (research :182-183, :393) |

- **Square at the edge.** A surface that reaches the window's edge has no corner. That covers the header, the left column
  docked as now, and the window buttons. Fluent: "Rounded corners are not necessary for components that reach the edge
  of the screen" [checked] (research :56).
- **Circles stay circles.** The camera keys (22 px, 50%) and the dot before the name are Fluent's Circle, not capsules
  (research :57, :419-420).
- **One place the sources and our sizes disagree, flagged for him.** Our ordinary button is about 26-28 px tall
  (research :360, inferred). By Fluent's [checked] under-32 sentence it would be r1 (2 px). The draft follows the
  research's own proposal and Fluent's [reader] ramp instead, and puts controls at r2 (research :413, :57). At factor 1
  that is a 4 px button. Either reading stays inside every ramp read.

**One factor per look**, Radix's model: one multiplier on the shared scale, from 0, square, upward (research :135-139
[checked], :244-248). No look goes above 1, so no corner passes the 12 px ceiling (research :418).

| look | factor | r1 / r2 / r3 / r4 | why |
|---|---|---|---|
| glass | 0 | 0 / 0 / 0 / 0 | Its own rule calls it "a frosted crystal slab … one corner cut (the facet)" (`glass.css:72`), and it is already 0 everywhere (research :367). |
| SIGIL | 0.5 | 1 / 2 / 4 / 6 | The research's own value for it (:417). Its buttons stay at today's 2 px (`index.html:199`); its 6 px menu goes to 4. |
| aurora | 0.75 | 1.5 / 3 / 6 / 9 | Radix's "small" factor (:138). Aurora is the least round of the four rounded looks today: its label window is 8, against aqua's 10 and skyline's 12 (research :368-370). The factor keeps the order the looks already have. **Ours.** |
| aqua | 1 | 2 / 4 / 8 / 12 | The most the research allows (:418), i.e. the Fluent ramp itself. Today the roundest look: every button a pill, 18 px panels (research :381, :389). |
| skyline | 1 | 2 / 4 / 8 / 12 | As aqua. Today 10 distinct radii and 13 px buttons (research :383, :405). |
| skyline-night | 1 | 2 / 4 / 8 / 12 | As skyline. |

- What this removes, by the research's ranking (:372-407): capsule labels, pills on ordinary controls, 16-18 px panels,
  non-concentric nesting, and 6-10 distinct values per look.
- What it keeps: six looks that still differ, by one number each plus their colours and glass.

## 2. Concentric nesting

- **Rule:** inner radius = outer radius − the padding between them, never below 0. The sources:
  - Apple: "concentric shapes calculate their radius by subtracting padding from the parent's" [checked] (research :96);
  - when the result falls below 0, Apple's "corner is square" [checked] (:102-103);
  - M3 "Outer radius - padding = inner radius" [reader] (:116);
  - Vercel asks only child ≤ parent [checked] (:198).

  Where the sources disagree (research :203-207), the draft takes Apple's exact rule with its floor at 0.
- **What it does here:**
  - A menu pads its contents by 8 px (`index.html:148`, research :397). Its rows and buttons are therefore r3 − 8, which is
    0 at every factor up to 1: square rows in a rounded menu.
  - A dialog pads 22-24 px (`index.html:122`), so its buttons are square too.
  - Today aqua nests pills in an 18 px menu, and skyline 9 px buttons in a 14 px menu (research :398-401).

## 3. Capsules: at most one, or none

- **Rule:** one capsule in the whole UI, the standout action, or none. Apple: "Capsules bring focus and clarity to
  touch-friendly layouts, but in dense desktop environments, they're best used for standout actions" [checked] (research
  :97-98, :210).
- **The one:** **Export to Assetto Corsa** (`header #install > button`), named by the research as the standout action
  (:386). It is a capsule in the factor-1 looks only (aqua, skyline, skyline-night); elsewhere it is r2. **Ours** (which
  looks).
- **Removed:**
  - aqua's 999 px buttons, camera dock, hint and selected track row (`aqua.css:53`, `:120`, `:124`, `:155`; research :381-382);
  - skyline's and skyline-night's 13 px buttons (`skyline.css:38`, `skyline-night.css:36`; research :383-384).
- Circles (§1) are not capsules.

## 4. Glass: the control layer over the 3D view only, thick enough for fine text

- **Where glass is allowed:** only on surfaces of controls floating over the 3D view.
  - These are the left column, the camera dock, the HUD strip, the menus, and the dialog's veil.
  - Apple: Liquid Glass "forms a distinct functional layer for controls and navigation elements … that floats above the
    content layer" [checked] (research :88-89).
- **Where glass is not allowed:** never on what sits in the view as content: the label windows on the road.
  - Apple: "Don't use Liquid Glass in the content layer" [checked] (research :90).
  - The research: "the labels on the road should be plain, opaque and small" (:460-465). L245's blur mock showed them
    blurred; this draft does not carry that forward. His call is still open (§10).
- **Thickness:** a fill of 0.80 or more behind fine text.
  - Apple: "Thicker materials, which are more opaque, can provide better contrast for text" [reader] (research :92-93).
  - Today's column is 0.84-0.97 (research :458) and skyline's `--glass` 0.80 (`skyline.css`), so nothing has to change.
- **Over bright content:** a 35% dark dim, Apple [checked] (research :90-91). This bears on skyline's white sky; it is to
  be checked by contrast, not assumed (§10).
- **Over busy content:** more blur, and meet contrast. NN/g [checked] (research :329-331).
- **Cost:** measured in L245 on this machine. Blurred boxes over a 60 fps WebGL canvas held 240 fps in every case
  (`handback/p-l245-blur-mock-C_2026-11-26.md`).
- **No source either way:** `saturate()` in the backdrop filters (research :466-467). Left as is, and flagged.

## 5. Glow: where it is allowed, and the budget

- **The sources have no coloured glow anywhere** (research :427-432):
  - Zed's shadows are black, 3-12 px blur, α ≤ 0.12 [checked];
  - Blender: "Avoid accent colors when there's no need to grab the user's attention" [checked] (:277);
  - FAA: graphic elements only if they add information [checked] (:309-311);
  - focus is a *ring* (Radix step 8, Atlassian +2 px) [reader] (:144, :161).
- **So the budget is 0 coloured glows on the chrome.** Each kind of glow today is replaced:

  | today | becomes |
  |---|---|
  | hover, an open menu, a pressed key | a fill or border change, with no glow (the look's own resting shadow) |
  | focus | a 2 px solid ring in the look's accent, offset 1 px |
  | glowing headings, the name and its dot | removed (research :449: aqua `:47`, aurora `:38`, `:82`, glass `:42`, skyline-night `:31`) |
  | halos behind dialogs | removed (research :447-448: aqua `:137`, aurora `:102`, glass `:119`) |
  | label windows' `--mark-win-glow` | 0 (research :435-439) |

- **Shadows:** they say "this floats", and stay small and neutral: black, blur ≤ 12 px, α ≤ 0.12. Zed's elevated surface
  is 3 px at 0.12, and its largest modal layer is 12 px at 0.04 [checked] (research :285-288).
  - Today's dialogs carry `0 18px 60px` to `0 24px 70px` in every look (research :450-452).
- **If he wants a look's character glow back, that is his taste, not a source's.** The draft would allow one glowing
  element per look, the pressed camera key, at blur ≤ 8 px and α ≤ 0.5. It is **not** in the override; this is the
  place to say so.

## 6. Colour roles: Radix's 12 steps on each look's own palette

- Radix gives each of 12 steps a role [reader] (research :141-145).
- The research quotes only these steps:
  - **1-2** "app backgrounds and subtle component backgrounds";
  - **6** "subtle borders on components which are not interactive";
  - **8** "stronger borders on interactive components and focus rings";
  - **11** "low-contrast text";
  - **12** "high-contrast text".
- Steps 3-5, 7, 9 and 10 are **ours, by Radix's pattern, not quoted**.
- The map onto each look's existing tokens (values at `0ab6cc8`, from `index.html:33-34` and each theme's token block):

| step | role | token | SIGIL | glass | aqua | aurora | skyline | skyline-night |
|---|---|---|---|---|---|---|---|---|
| 1 | app background | `--bg` | #060606 | #06111b | #022a35 | #04050d | #eef6ff | #08142c |
| 2 | panel background | `--panel` | #0b0b0a | #0a1824 | #033846 | #080a1a | #ffffff | #0e1d3b |
| 3 | component background (ours) | `--raise` | #121211 | #0f2232 | #054556 | #0e1130 | #e3f0ff | #15294d |
| 4 | hover background (ours) | **missing**: no token today | | | | | | |
| 5 | pressed / selected (ours) | `--accent-dim` | rgba(185,168,255,.16) | rgba(143,230,255,.22) | rgba(63,224,245,.26) | rgba(111,245,192,.16) | rgba(7,87,179,.14) | rgba(124,200,255,.18) |
| 6 | subtle border | `--hair` | rgba(235,230,220,.14) | rgba(190,230,255,.34) | rgba(140,240,255,.40) | rgba(150,200,255,.18) | rgba(28,92,168,.26) | rgba(150,200,255,.22) |
| 7 | interactive border (ours) | `--line` | #24221f | #2b5672 | #1b8ea6 | #252a5c | #b6d2ef | #2c4a78 |
| 8 | strong border, **focus ring** | `--accent` | #b9a8ff | #8fe6ff | #3fe0f5 | #6ff5c0 | #0757b3 | #7cc8ff |
| 9-10 | solid fill and its hover (ours) | `--accent`; **no hover step** | | | | | | |
| 11 | low-contrast text | `--dim` | #8a847a | #a9c9dd | #a6ecf7 | #b6c4e4 | #33506f | #a9c3e6 |
| 12 | high-contrast text | `--text` | #ebe6dc | #f0f9ff | #f2fdff | #eaf6ff | #0b2747 | #e8f2ff |

- **What the refactor adds:** two tokens per look, **step 4** (hover) and **step 10** (solid hover).
  - Every hover today is a glow or a per-rule hand-picked value (§5). Step 4 is what replaces them.
  - The values would be his eye's per look. A starting point: step 3 mixed 6% toward step 12.
- inferred, not measured here: Radix builds its steps for contrast, and ours are hand-picked. Whether every look's step 11
  on step 2 still reads at 4.5:1 is the existing `app/test/texture-page.test.js` check. The refactor runs it, and does
  not assume it.

## 7. Density and spacing: fixed

- **Density stays fixed.** The spec found no reason to change it.
  - Fluent's spacing and type pages were not read (research :494-495, :552-553).
  - Zed's compact/default/comfortable table is a model, and whether he wants one is "his call" (research :531-532).
- **Spacing is unchanged**, today's paddings included. The concentric rule (§2) reads them; it does not move them.

## 8. Layout: docked or floating (his call, shown not asked)

- **The sources disagree** (research :343-346, :468-470, :530):
  - Figma reversed floating panels for heavy users: "designs seemed to peek out from behind them in a way that was
    distracting" [checked] (:301-305).
  - Apple builds on controls floating over content [checked] (:88-89).
- **The page shows skyline-night both ways:**
  - **docked**, as now: the column square at the window edge (§1);
  - **floating**: inset 10 px, with the r4 corner and a neutral shadow.

  He picks; nothing is assumed.

## 9. What does not change: the plumbing

**The refactor touches only three things:**
- the `<style>` block of `app/index.html`: its tokens and rules;
- the six theme files (`app/themes/*.css`);
- markup class names, only where a rule has no selector to hold on to.
  - checked: the override in the L248 page uses existing selectors only.
  - inferred: so the first lap needs no markup change.

**Left alone (plumbing):**
- `src/**`: the core and geometry (`src/core`, `src/geom`), export (`src/export`), and `src/doc`, `src/validate`,
  `src/lookmatch`, `src/markers`, `src/texmaker`, `src/texture`;
- `src-tauri/**`: the native side;
- `app/core/*.js`: the panel logic (`panel.js`, `coreshell.js`, `piecesui.js` and the rest), the handle maths and the mark
  layer;
  - `markwindow.js` and `handles.js` read their colours and window look from tokens already (L242), so a token value
    changes what they draw with no code change;
- `app/preview/**` (the 3D view), `app/camera/**`, `app/export/**`, `app/menubar/**`;
- `app/askdialog.js`, `app/shell.js`, `app/settings.js`, `app/sound.js`;
- `app/lib/tokens.js`, which reads the tokens and is unchanged.

**Tests that will react, and must be amended by name, not weakened:**
- `app/test/theme.test.js`, the theme files' promises (12 rows at L242).
- `app/test/texture-page.test.js`, the 4.5:1 contrast check.
- `app/test/markwindow.test.js` W1, "no two looks draw the same window" (L242). If the label windows' radius and glow
  unify (§10), W1's distinctness changes rule.

## 10. The 3D overlay layer: ours, to measure (open questions only)

The research is plain that no written source specifies this layer. It gives principles (the FAA, Tufte) and precedents
(Blender, Dear ImGui, Figma), not a spec (research :41-45, :513-538). So this section is questions, not rules.

1. **Where a label sits** against its mark: above it, along the road's normal, or with a leader line? Today it is
   `placeLabel` in `secondtick.js`. What would we measure: distance to the mark, or how often it is read wrong?
2. **Collisions and occlusion.** What counts as a collision: label with label, label with the road it names, label with
   a handle? What happens as the camera moves? The FAA asks that labels "not obscure the scales or delimiters" [checked]
   (research :312). How would we count obscuring per frame?
3. **Contrast over a moving picture.** Text and marks sit over a sky and road that change every frame and differ by look.
   NN/g and Apple give a direction, more blur or a dim (research :329-331, :90-91), but no source gives a test. What is
   ours: a contrast sampler per look over a fixed camera tour, and what threshold?
4. **The label windows themselves.** Are they content (plain, opaque, under-32 radius, no glow; research :460-465) or
   chrome? The L248 override applies the plain version provisionally, with radius r1 and glow 0. His L245 mock showed
   them blurred. Which does he want?
5. **Handles and gizmos:** arrow pairs, drag affordances, the dot at rest. No written standard was found (research
   :524-529). L241's "label only under the pointer" follows the FAA's de-clutter (:313). Is that the rule for every kind?
6. **How many marks at once** before the view is cluttered (FAA "clutter is minimized" [checked], :311)? Is it a count
   to measure, or his eye?
7. **Colour per field** (bank, turn, climb, width and cup). The tokens exist (`--mark-<field>`, L242). Does a look ever
   change them, and is colour ever the only carrier ("Avoid using color as the only way of communicating status"
   [reader], research :279)?

## 11. His calls, collected (each shown in the L248 page or named here)

1. The factor per look (§1), especially SIGIL's 0.5 against 1, and aurora's 0.75.
2. Export as the one capsule, and in which looks (§3).
3. Docked or floating (§8).
4. Any character glow back, at one element per look (§5).
5. Label windows plain or glass (§10.4).
