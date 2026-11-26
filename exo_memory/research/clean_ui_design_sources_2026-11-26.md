# Clean UI from written sources: corner radius, glow, glass, and what a T-180 refactor could rest on (2026-11-26)

**What this is.** Pane E's research for L246 (`loop/packet_t180_design_research_E_2026-11-26.md`, including its 02:3x
amendment). His words are verbatim in `briefs/t180_ui_declutter.md`, 02:33 and 02:37. The note answers what written
design systems, guides, tools and repos say about clean, engineered UI. Then it reads our six looks (builder
`0ab6cc8`) against that, and names what a whole-UI refactor could be based on. It changes no builder file.

**It does not repeat** `research/ai_slop_ui_survey_2026-10-29.md` (what reads as slop), `research/ui_unslop_guide_2026-10-27.md`
or C's audit `handback/p-d546-slop-audit-C_2026-10-29.md`. Those say what to avoid. This note looks for sources to
learn FROM.

**How each source was read.** Four reader subagents opened the pages on 2026-11-26. Their fetch tool returns a model's
rendering of a page, not the bytes, so I re-fetched the load-bearing quotes myself with curl and matched the text. Each
quote carries one of two marks:
- **[checked]**: I fetched the page or file myself and the quoted text matched, word for word.
- **[reader]**: a reader opened the page, but I did not re-match the text. Usually the site renders only in a browser
  (m3.material.io, vercel.com/geist, atlassian.design) or blocked my curl (Cloud Four). Treat these as very likely
  right, but check them at source before quoting them onward.

Nothing is cited unopened. The sources I tried and could not use are listed in §7.

---

## 0. The short answer

1. **The sources do not support "rounded = cheap" in general. I refuse that form of the claim.** Every current design
   system read here rounds its corners, and IBM Carbon, the "square on purpose" candidate, is moving to rounded corners
   in v12 (§1.2). The perception research finds that people generally *prefer* curved shapes. Curved shapes read as warm
   and soft; angular ones read as competent and durable (§2.4). No source says "cheap".
2. **What the sources DO support matches his eye on our four rounded looks.** Two things read wrong:
   - **Radius too large for the element.** That means pills and 16-18 px corners on a dense desktop tool, and capsules
     on small labels.
   - **Radii that ignore nesting.**

   Apple says capsules suit touch, and in dense desktop UI belong only to standout actions. Material 3 says not to put
   large or full corners on information-dense parts. Fluent 2 drops to 2 px for anything under 32 px. Aqua, aurora,
   skyline and skyline-night break these lines. SIGIL (2 px) and glass (0) do not (§5).
3. **One structure fits "six looks, still clean" better than any single radius value.** Radix Themes defines one size
   scale and lets each theme pick a single multiplier, from 0 (square) to 1.5. Six looks could differ by one factor each,
   on one shared scale, instead of by about 40 hand-picked corner values (§3.1, §5.1).
4. **For a refactor, the research is good enough to base the chrome on and not good enough for the 3D overlay layer.**
   The chrome is the panels, menus, fields, dialogs and the colour and spacing tokens. The overlay layer is the labels,
   handles and readouts drawn on the road. No written source specifies an overlay layer for a 3D editor. Only principles
   (FAA AC 25-11B, Tufte) and precedents (Blender, Dear ImGui, Figma) exist. §6 says what to build on and what would
   have to be ours.

---

## 1. Design systems: what each says about shape, radius and surfaces

### 1.1 Fluent 2 (Microsoft): the most tool-like ramp, and native to his platform
https://fluent2.microsoft.design/shapes
- [checked] "In most cases, corner radiuses on rectangle shapes are 4 pixels by default. For shapes smaller than 32
  pixels, the corner angle is reduced to 2 pixels. For large and extra-large components, 8 pixel and 12 pixel angles are
  used."
- [checked] "Rounded corners are not necessary for components that reach the edge of the screen."
- [reader] The ramp: None 0 for "Navigation bars, tab bars", Small 2 for "Small badges", Medium 4 for "Buttons,
  dropdown", Large 8 for "Large buttons", X-Large 12 for "Button sheets, popovers", Circle 50% for "Personas". Also
  "Shapes help make UI personable, easier to process, and recognizable at a glance."
- What it teaches (mine): radius follows the element's size. The largest corner in the system is 12 px, on a popover.
  Edge-docked surfaces are square. Pills are reserved for avatars.

### 1.2 IBM Carbon: NOT square on purpose, and now going round
- [reader] No official Carbon or IBM page was found saying Carbon is square on purpose, or why. The 2x Grid pages
  (https://carbondesignsystem.com/elements/2x-grid/overview/, https://www.ibm.com/design/language/2x-grid/) speak of
  "the 8-pixel square mini unit", which is a grid unit, not a corner rule. The claims that Carbon is "square on purpose"
  were found only in third-party summaries, which are not cited here.
- [checked] Carbon's v12 migration note,
  https://raw.githubusercontent.com/carbon-design-system/carbon/main/docs/migration/v12.md:
  - Buttons no longer use "a fixed `$button-border-radius` of `0`. The default fallback is `$border-radius-max`".
  - "The corners of Popover and Toggletip/Tooltip are now rounded via the" border-radius tokens.
- [checked] Carbon's own token descriptions,
  https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/layout/tokens/layout.tokens.json (lines
  276-324):
  - 0: "No rounding; use for sharp-cornered elements."
  - 2px: "Subtle rounding for small components like tags and badges."
  - 4px: "Default rounding for inputs, cards, and general components."
  - 8px: "Moderate rounding for panels, modals, and containers."
  - 16px: "Strong rounding for large cards or featured containers."
  - 24px: "Very rounded corners for pill-adjacent components."
  - pill: "Use for pill buttons, chips, and circular elements."
- What it teaches (mine): the packet's premise is refuted. Carbon cannot be cited as an argument for square corners. Its
  v12 scale agrees with Fluent: 4 px is the default for controls, 8 px for panels.

### 1.3 Apple Human Interface Guidelines: materials over content, concentric corners, capsules
- Materials: https://developer.apple.com/design/human-interface-guidelines/materials, read through Apple's JSON for
  the page.
  - [checked] Liquid Glass "forms a distinct functional layer for controls and navigation elements — like tab bars and
    sidebars — that floats above the content layer".
  - [checked] "Don't use Liquid Glass in the content layer"; "If the underlying content is bright, consider adding a
    dark dimming layer of 35% opacity."
  - [reader] "Thicker materials, which are more opaque, can provide better contrast for text and other elements with
    fine features. Thinner materials, which are more translucent, can help people retain their context".
- WWDC25 session 356, https://developer.apple.com/videos/play/wwdc2025/356/:
  - [checked] "Capsules use a radius that's half the height of the container."
  - [checked] "concentric shapes calculate their radius by subtracting padding from the parent's."
  - [checked] "Capsules bring focus and clarity to touch-friendly layouts, but in dense desktop environments, they're
    best used for standout actions."
- SwiftUI `ConcentricRectangle`, https://developer.apple.com/documentation/swiftui/concentricrectangle.md:
  - [checked] "A rounded corner of a rectangle is *concentric* relative to the container shape's adjacent corner when
    the corner's radius shares a common center with the containing shape's rounded corner radius."
  - [checked] When the corner is far from the container's, the computed radius can be zero: "When that happens, the
    corner is square."
- [reader] The current HIG Layout page has no text on concentricity. The rule lives in the WWDC talk and the API docs
  above, and in "Adopting Liquid Glass".
- What it teaches (mine):
  - Glass belongs to the control layer floating over content, never to the content itself. That is exactly the
    distinction between our left panel, which floats over the 3D view, and our labels, which sit on the road.
  - Pills are a touch-UI shape, and rare on a dense desktop.

### 1.4 Material Design 3: radius is expressive, but not on dense parts
https://m3.material.io/styles/shape/overview-principles and `/corner-radius-scale`, rendered by the reader in a
browser.
- [reader] "Be careful not to apply large or full corners to information-dense components, such as cards".
- [reader] "When nesting rounded objects, avoid using the same corner radii for both objects." and "Outer radius -
  padding = inner radius".
- [reader] "Material historically focused on rounded shapes. However, using sharp shapes, thereby adding tension,
  creates more dynamic design, one that's more memorable and expressive."
- [reader] The scale has ten steps: 0, 4, 8, 12, 16, 20, 28, 32, 48 and Full. "by default, buttons are mapped to the
  full corner radius shape style."
- [checked, via Android's reference] https://developer.android.com/reference/kotlin/androidx/compose/material3/Shapes
  was read by the reader as raw text; the same defaults (buttons "full", chips small) are given there.
- What it teaches (mine):
  - M3 is the one system whose default button is a pill. It is also the system that warns against big corners on dense
    parts.
  - It is a mobile-first, expressive system. Of everything read here, it is the least suited to a dense desktop tool.

### 1.5 Radix (Themes and Colors): structure for many looks
- [reader] https://www.radix-ui.com/themes/docs/theme/radius: "Radius values used in the components are derived from a
  6-step scale."
  - "when set to `full`, a Button becomes pill-shaped while a Checkbox will never become fully rounded to prevent any
    confusion between it and a Radio."
  - Panels (Card, Dialog, Popover) "inherit the radius setting from the theme."
- [checked] Token file,
  https://raw.githubusercontent.com/radix-ui/themes/main/packages/radix-ui-themes/src/styles/tokens/radius.css:
  - `--radius-1: calc(3px * var(--scaling) * var(--radius-factor));` and so on through `--radius-6` (3, 4, 6, 8, 12,
    16 px).
  - The factor per theme setting: none `0`, small `0.75`, medium `1`, large `1.5`, full `1.5` with `--radius-full:
    9999px`.
- [reader] Colours,
  https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale, give each of 12 steps a role:
  - "Steps `1` and `2` are designed for app backgrounds and subtle component backgrounds";
  - "Step `6` is designed for subtle borders on components which are not interactive";
  - "Step `8` is designed for stronger borders on interactive components and focus rings";
  - "Step `11` is designed for low-contrast text"; "Step `12` is designed for high-contrast text."
- What it teaches (mine): Radix's main lesson is structural.
  - Roundness is one decision per theme, a multiplier on a size scale, not a value chosen per element.
  - Colour is a role per step, so a theme swaps the scale and every role still holds. For six looks, that is the
    machinery that keeps each one coherent.

### 1.6 Vercel Geist and Atlassian: radius grows with elevation
- Geist, https://vercel.com/geist/materials (rendered by the reader):
  - [reader] "material-base — Everyday use. Radius 6px."; menu "Radius 12px."; modal "Radius 12px."; fullscreen
    "Radius 16px."
  - [reader] "Favor the lowest elevation that still reads as elevated against its background; over-elevating is a common
    source of visual noise."
  - [reader] "Don't stack two Materials on the same element".
- Atlassian, https://atlassian.design/foundations/radius (rendered by the reader):
  - [reader] xsmall 2 px "badges, checkboxes"; small 4 px "compact buttons"; medium 6 px "buttons, inputs"; large 8 px
    "cards, in-page containers, floating UI, dropdown menus"; xlarge 12 px "modals"; full "avatars".
  - [reader] "The corner radius of the focus ring is always +2px greater than the component's base corner radius
    value."
- What it teaches (mine): a bigger radius means a surface that floats higher. A 16 px corner is Geist's *fullscreen*
  surface. In Atlassian, floating UI is 8 px.

### 1.7 Primer (GitHub)
- [checked] https://raw.githubusercontent.com/primer/primitives/main/src/tokens/functional/size/radius.json5:
  - small 3 px, "Use for small UI elements under 16px height. Do NOT use for buttons or cards.";
  - medium 6 px, "Default choice for most components. Use for inputs, cards, and general containers.";
  - large 12 px.

---

## 2. Corner radius specifically

### 2.1 Radius against element size
- Every ramp read here maps radius to the element's size:
  - Fluent: 2 px under 32 px, 4 default, 8 and 12 for large;
  - Carbon v12: 2, 4 and 8;
  - Atlassian: 2 to 12;
  - Primer: 3, 6 and 12.
  - The largest non-pill corner any of them puts on a floating panel or popover is **12 px** (Fluent, Geist menus,
    Atlassian modals). Carbon calls 16 px "Strong rounding for large cards or featured containers".
- Blender writes roundness as a *fraction of the widget's height*, not in pixels.
  - [checked] `.roundness = 0.2f` on 20 widget types and `0.5f` on one, the scrollbar (`wcol_scroll`);
    `.panel_roundness = 0.4f`. From
    https://raw.githubusercontent.com/blender/blender/main/release/datafiles/userdef/userdef_default_theme.c.
  - [reader] Blender's API documentation gives widget `roundness` as "Amount of edge rounding (in [0, 1], default
    0.0)".
  - A 0.2 fraction on a 22 px box is about 4 px (mine).
- A pill is radius = half the height ([checked] Apple, above). Radix keeps checkboxes from ever becoming full, so they
  are not confused with radios ([reader], above).

### 2.2 Nested (concentric) radii
- Apple ([checked]) and M3 ([reader]): inner = outer − padding. Apple lets the result fall to square, with an optional
  minimum.
- [checked] Vercel's Web Interface Guidelines,
  https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/README.md:134: "**Nested radii.** Child
  radius ≤ parent radius & concentric so curves align."
- [reader] Cloud Four, "The Math Behind Nesting Rounded Corners",
  https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/: "outerRadius - gap = innerRadius". My own
  fetch got a 5.6 KB block page, so this one is not re-matched.
- **Where they disagree:**
  - Vercel asks only that the child radius be no larger than the parent's.
  - M3, Apple and Cloud Four give the exact subtraction.
  - When the padding is larger than the outer radius, Apple goes square, and the others don't say.
  - Atlassian adds +2 px, but only for focus rings, which sit *outside* the element.

### 2.3 Small radii against pills
- [checked] Apple: capsules "in dense desktop environments … are best used for standout actions."
- [reader] M3: "Be careful not to apply large or full corners to information-dense components".
- [reader] M3 also makes buttons full by default, and Carbon v12's button falls back to full. **These two disagree with
  Apple and Fluent** (buttons 4 px) on the ordinary button. The disagreement splits along mobile/expressive against
  desktop/dense lines (mine).
- No primary source was found for the folk rule "pill = tag or chip". M3 gives chips the *small* radius.

### 2.4 Perception research: does rounded read as cheap?
- [reader] Bar & Neta (2006), *Psychological Science* 17(8):645-648, doi 10.1111/j.1467-9280.2006.01759.x. The
  abstract was read in fragments on https://www.nmr.mgh.harvard.edu/publications/journal_articles/743. Curved objects
  are preferred, and the hypothesis is that sharp contours convey threat. Get the verbatim abstract from the DOI before
  quoting it onward.
- [reader] Yao et al. (2021), *Frontiers in Psychology*,
  https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.615647/full: "the angular shape expresses
  competence, while the rounded shape primarily expresses warmth"; "high-power consumers respond more positively to
  angular as opposed to rounded shapes".
- [reader] A university press page on Jiang, Gorn et al. (*Journal of Consumer Research*),
  https://www.polyu.edu.hk/cpa/milestones/en/201709/research_innovation/business_management/logo_shape_impacts_perception_of_brand/index.html:
  curved logos made shoes seem "more comfortable", angular ones "more durable".
- **Verdict:**
  - No study read links rounded shapes to *cheap*.
  - The supported split is warmth/softness for curves and competence/durability for angles, measured on logos and
    products, not on UI chrome.
  - For an instrument-like tool, that is a reason to *lean* angular. It is not a law.

### 2.5 Refactoring UI
- No text by its authors could be opened; the book is paid. The only public pages found are unattributed summaries
  ("Serious/formal: No border radius" … "Playful: … large border radius"), and none cites the book. It is **not cited
  as a source here**. To use it, read a bought copy.

---

## 3. Repos to learn from (the token files, opened)

### 3.1 Radix Themes (MIT): one scale × one factor
https://github.com/radix-ui/themes, `packages/radix-ui-themes/src/styles/tokens/radius.css` [checked]. The licence (MIT)
comes from the reader via the GitHub API.
- Learn: small controls take the small step and big surfaces the big one. The whole app goes square with one variable
  (`--radius-factor: 0`). This is the structure §5.1 proposes for our six looks.
- Its colour docs give the 12 step roles (§1.5).

### 3.2 Dear ImGui (MIT): the game-tool default is square
https://github.com/ocornut/imgui, `imgui.cpp`, `ImGuiStyle::ImGuiStyle()` [checked, current master lines 1572-1600]:

    WindowPadding               = ImVec2(8,8);
    WindowRounding              = 0.0f;   // ... Large values tend to lead to variety of artifacts and are not recommended.
    ChildRounding               = 0.0f;
    PopupRounding               = 0.0f;
    FramePadding                = ImVec2(4,3);
    FrameRounding               = 0.0f;
    ItemSpacing                 = ImVec2(8,4);
    ScrollbarRounding           = 9.0f;
    GrabRounding                = 0.0f;
    TabRounding                 = 5.0f;

- Learn:
  - The tool UI that most game and engine tools are built with is square by default. It rounds only the scrollbar grab
    and the top corners of tabs, and its own comment advises against large window rounding.
  - Its spacing packs rows twice as tight vertically as horizontally (8×4).

### 3.3 Blender (GPL-2.0-or-later): roundness as a fraction, one set of colour roles per widget
`release/datafiles/userdef/userdef_default_theme.c` [checked counts above].
- Every widget type has the same roles (outline, inner, item, text, each with a selected variant). Roundness 0.2 of
  height, panels 0.4.
- The code is GPL. Learn from it, don't copy it into the builder.
- [reader] Its Human Interface Guidelines, colour page:
  https://developer.blender.org/docs/features/interface/human_interface_guidelines/color/.
  - [checked] "Avoid accent colors when there's no need to grab the user's attention."
  - [reader] "The UI should remain calm with subtle contrasts unless there's a good reason not to."
  - [reader] "Avoid using color as the only way of communicating status".
  - [reader] The guidelines' own front page says they "are still in development … a lot of content is missing".

### 3.4 Zed editor (GPL-3.0-or-later for its `ui` crate): density and elevation as tables
- [reader] `crates/ui/src/styles/spacing.rs`: each spacing step has three values for Compact, Default and Comfortable,
  e.g. "(1, 2, 4) => Compact: 1px, Default: 2px, Comfortable: 4px".
- [checked] `crates/ui/src/styles/elevation.rs`: the editing surface has no shadow. `ElevatedSurface` is
  `BoxShadow::new(px(0.), px(2.), hsla(0., 0., 0., 0.12)).blur_radius(px(3.))` plus a faint 1 px line. The modal's
  largest layer is a 12 px blur at α 0.04. Every shadow is black; none is coloured.
- Learn: shadows say "this floats", and they are small, tight and neutral. No radius file was found in `styles/`.

### 3.5 The contrast case: shadcn/ui
- [checked] https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/themes.ts sets `radius: "0.625rem"`
  (10 px) on every base theme.
- One 10 px radius on everything regardless of size is the default the slop survey names ("one border-radius on
  everything regardless of hierarchy", survey §1 item 3).

---

## 4. Instrument-like tools: panels, readouts and labels over a view

- **Figma UI3: floating panels over the work were reversed.**
  https://www.figma.com/blog/our-approach-to-designing-ui3/ [checked]:
  - "they hindered people who spend many hours a day in Figma"; "designs seemed to peek out from behind them in a way
    that was distracting."
  - "The nail in the coffin was learning that they slowed people down."
  - "reversing the change so that panels are fixed, but still resizable to allow for greater flexibility."
  - [reader] Floating remains as an opt-in minimal mode.
- **FAA AC 25-11B, *Electronic Flight Displays*** (2014),
  https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_25-11B.pdf [checked, pdftotext]:
  - "graphic elements should be included only if they add useful information content, reduce flightcrew access or
    interpretation time, or decrease the probability of interpretation error."
  - "Information should be displayed so that clutter is minimized."
  - "Pointers and indexes should not obscure the scales or delimiters such that they can no longer be interpreted."
  - [reader] §5.10.3.2 also recommends automatic de-clutter.
- **Tufte, data-ink.** edwardtufte.com returned 403, so these are secondary.
  - [reader] https://en.wikipedia.org/wiki/Chartjunk quotes the 1983 book: "The interior decoration of graphics
    generates a lot of ink that does not tell the viewer anything new."
  - [reader] Course slides paraphrase: "Maximize the data-ink ratio • Erase non-data-ink".
- **Dear ImGui and Blender:** see §3.
- **MoTeC i2.** [reader] Its Feature Guide PDF
  (https://assets.motec.com.au/strapi/i2_V1_1_4_Feature_Guide_0d03b00fa8.pdf) has no visual-design rationale. Its
  panel design is **not written down** anywhere that could be opened.
- **Racing HUDs.** No studio postmortem was found.
  - [reader] A general HUD article (https://gamedeveloper.com/design/perceiving-without-looking-designing-huds-for-peripheral-vision):
    "Avoid clutter, and make HUD elements look visually distinct from one another."
  - [reader] Journalism quotes a developer dropping the speedometer because its precision didn't matter
    (https://kotaku.com/things-we-dont-need-to-see-such-as-our-speed-5458994).
- **Pro audio:** no written rationale from a maker was found, so nothing is cited.
- **NN/g on glassmorphism**, https://www.nngroup.com/articles/glassmorphism/ [checked]:
  - "More background blur is better, especially with intricate backgrounds (e.g., video, photography, animations)."
  - "overwhelming backgrounds can make it hard for users to focus on meaningful content and affect text readability."
  - Its first best practice is "Meet Contrast Requirements".
- **Linear's redesign**, https://linear.app/now/how-we-redesigned-the-linear-ui [checked]:
  - "reduce visual noise, maintain visual alignment, and increase the hierarchy and density of navigation elements";
  - "It's the global chrome of the application that controls the content in the main view";
  - its themes carry "a contrast variable which defines how contrasty a theme should be."
  - [reader] The posts say nothing about corner radius.

**What these agree on (mine):**
- Content first; chrome is a cost that has to buy information (FAA, Tufte, Linear, Blender's "calm").
- Labels must not cover what they label (FAA).
- Colour is used sparingly and never alone (Blender).

**Where they disagree:**
- **Floating against fixed panels.** Figma reversed floating panels for heavy users. Apple makes floating controls over
  content its whole model. ImGui floats by default. Our SIGIL layout floats the left column over the 3D view
  (`index.html:245`).
- **Minimal against dense.** Tufte and the HUD advice remove things. MoTeC adds a chart *beside* its tables, because the
  dense table hides trends.

---

## 5. Against our six looks (builder 0ab6cc8, read only; proposes, changes nothing)

**Line numbers are from `git show 0ab6cc8:app/themes/<look>.css` and `git show 0ab6cc8:app/index.html`.** The counts are
CSS *declarations*, from `scratchpad/l246/count.js` run on those files. They are not C's rendered-element counts of
10-29, and the themes have changed since that audit (aqua now carries a "glow budget", `aqua.css:33`).

Two sizes matter below:
- A one-line label window on the road is **22 px** tall (`handles.js:420`, `hgt = 4 + 18 * lines.length`).
- inferred: an ordinary button is about 26-28 px tall (`index.html:199`: 12 px type, 5 px padding, a 1 px border).

### 5.1 Radii (first)

| look | distinct radii in its CSS | label window radius (on a 22 px box) |
|---|---|---|
| sigil (`index.html`) | 2 px ×9, plus 0, 3, 4, 6, 50% | 2 (`:49`) |
| glass | 0 only | 0 (`glass.css:145`) |
| aurora | 0, 4, 6, 8, 10, 12, 14, 16 | 8 (`aurora.css:112`) |
| aqua | 0, 8, 10, 14, 18, 999 | 10 (`aqua.css:166`) |
| skyline, skyline-night | 0, 4, 6, 7, 9, 12, 13, 14, 16, 18 | 12 (`skyline.css:106`, `skyline-night.css:97`) |

What a source would call wrong, most to least clear:

1. **Capsule labels.**
   - Skyline and skyline-night use radius 12 on a 22 px window, which is more than half its height, so it draws as a
     full capsule. Aqua's 10 is 45% of the height, nearly one; aurora's 8 is 36%.
   - Fluent puts anything under 32 px at 2 px [checked]. Blender's 0.2 fraction is about 4 px.
   - SIGIL (2) and glass (0) are inside both.
   - Lines: `skyline.css:106`, `skyline-night.css:97`, `aqua.css:166`, `aurora.css:112`.
2. **Pills on ordinary controls.**
   - Aqua makes every button a pill: `aqua.css:53` `border-radius: 999px`. So are its camera dock (`:120`), its camera
     hint (`:124`) and the selected track row (`:155`).
   - Skyline and skyline-night give buttons 13 px (`skyline.css:38`, `skyline-night.css:36`). inferred: on a ~27 px
     button that is about half the height, so it reads as a capsule.
   - Apple keeps capsules on a dense desktop for "standout actions" [checked]; Fluent gives buttons 4 px [checked].
   - A source would allow one capsule: the one standout action, e.g. Export.
3. **Panels at 16-18 px.**
   - The lines:
     - aqua `#left` `:91`, menus `:107`, dialog `:136` and guide card `:147`, all 18;
     - aurora `#left` `:76` 16, camera dock `:88` 16, dialog `:102` 16;
     - skyline `#left` `:69` 16, camera dock `:83` 18, dialog `:100` 16;
     - skyline-night `:67` 16, `:80` 18, `:91` 16.
   - Every desktop ramp read stops at 12 px for a floating panel, menu or modal: Fluent [checked], Geist, Atlassian
     [reader]. Carbon v12 uses 8 for "panels, modals, and containers" [checked].
   - 16 px is Geist's *fullscreen* surface, and Carbon's "Strong rounding for large cards or featured containers".
4. **Nesting that is not concentric.**
   - Menus pad their contents by 8 px (`index.html:148`), so a concentric inner radius is the outer one minus 8.
   - Aqua's menu is 18 (`aqua.css:107`), its rows 4 (`index.html:188`), and its buttons inside are pills (`aqua.css:53`).
     The concentric value is 10.
   - Skyline and skyline-night: menu 14, menu buttons 9 (`skyline.css:47-48`, `skyline-night.css:45-46`). Concentric 6.
   - Aurora: menu 14, buttons 8 (`aurora.css:54-55`). Concentric 6.
   - M3 says don't use the same or mismatched radii when nesting, and gives outer − padding [reader]. Apple gives the same
     rule [checked].
5. **Too many distinct values.**
   - Skyline uses 10 different radii in one look, aurora 8.
   - Every system read uses a fixed scale of about 6 steps (Radix 6, Fluent 6, Carbon 7).
   - C's audit already ranked skyline and skyline-night the least coherent (`p-d546` §4).

**The proposal for radii (one decision per look, the Radix structure):**
- Every look shares one size scale, for example 2 / 4 / 6 / 8 / 12, mapped to element size as Fluent maps it:
  - under 32 px (labels, chips, small fields): 2;
  - controls: 4;
  - large controls and menus: 6-8;
  - the floating column and dialogs: 8-12.
- Each look then sets only a factor:
  - glass 0;
  - SIGIL about 0.5 (it already sits at 2 px);
  - aqua, aurora and skyline at most 1.
- Pills appear only where a source allows them: the standout action, and Fluent's circle for an avatar-like dot, e.g.
  the camera keys at `index.html:270` (22 px, 50%).
- The 3D view's label windows follow the under-32 rule in every look.
- This keeps six distinct looks and removes the four things above. It is a proposal for his eye; the numbers are a
  starting point taken from the ramps, not a finding.

### 5.2 Glows (second)

**The sources.** No design system read here has a coloured outer glow token:
- Zed's shadows are black, 3-12 px blur, α ≤ 0.12 [checked];
- Geist: "over-elevating is a common source of visual noise" [reader];
- Blender: "Avoid accent colors when there's no need to grab the user's attention" [checked];
- FAA: graphic elements only if they add information [checked];
- a focus indicator is a *ring* in Atlassian (+2 px) and Radix (step 8, "focus rings") [reader], not a glow.

**Lines a source would call decoration:**
1. **Glows in the mark's colour on the label windows**, `--mark-win-glow`: aqua 9 (`:166`), aurora 12 (`:112`),
   skyline-night 8 (`:97`), glass 6 (`:145`); SIGIL and skyline 0.
   - inferred: the glow repeats the colour the window's edge already carries, so by the FAA's and Tufte's test it adds
     no information.
   - It also widens what covers the road ("should not obscure").
2. **Accent-coloured outer glows on controls:**
   - aqua `:45`, `:58`, `:61`, `:82`, `:142` (`0 0 8-10px` of `#3fe0f5` at .8);
   - aurora `:44`, `:46`, `:65`, `:90`;
   - glass `:40`, `:51`, `:54`, `:69`.

   The sources' alternative is a solid focus ring, plus a fill or border change for hover and pressed. Aqua's comment
   at `:33` already limits glows to interactive states; the sources would go one step further, to rings.
3. **Halos behind dialogs:** aqua `:137` (`0 0 40px` accent), aurora `:102` (`0 0 30px` violet), glass `:119`
   (`0 0 40px`). These are the survey's "glows … decorate the page without signaling anything".
4. **Glowing headings:** aqua `:47`, aurora `:38`, aurora h3 `:82`, glass `:42`, skyline-night `:31`.
5. **Heavy dialog shadows**, smaller matter: `0 18px 60px` / `0 24px 70px` in every look including SIGIL
   (`index.html:122`). Zed's largest modal layer is 12 px blur at α .04 [checked]. inferred: lighter would still read as
   raised.

### 5.3 Glass (third)

1. **Blur on the left column floating over the 3D view: supported.** This is Apple's own case, a functional layer of
   controls floating above content [checked]. NN/g backs it: more blur over a busy background, but meet contrast
   [checked]. Our column is 84-97% opaque, i.e. Apple's "thicker" material for fine text [reader], with blur 10
   (SIGIL, `index.html:245`) to 18 px (skyline `:71`). Nothing here to remove.
2. **Blur on the label windows on the road: the sources argue against it.**
   - Apple: "Don't use Liquid Glass in the content layer" [checked].
   - inferred: a label pinned to a mark on the road is content-layer, not control-layer.
   - The FAA asks that labels not obscure what they label [checked].
   - This bears directly on L245's blur mock for those windows. The column may be glass; the labels on the road should
     be plain, opaque and small.
3. **No source either way:** `saturate(170%)` on aqua's column, menus and camera dock (`aqua.css:92`, `:108`, `:121`) and
   skyline's and aurora's `saturate`. Nothing read speaks to it, so this is flagged, not judged.
4. **Floating itself is the open question** (§4). Figma reversed floating panels because work "peek[ed] out from behind
   them in a way that was distracting" [checked]. Apple builds everything on them. That is a layout decision for him,
   not a styling one, so it moves to §6.

### 5.4 Not a source's verdict, but measured: his eye and the ramps agree

- The four looks he called cheap, on the mock's rounded windows (aqua 18, aurora 16, skyline and skyline-night 16,
  `briefs/t180_ui_declutter.md:54`), are the four whose radii exceed every desktop ramp read.
- The two he didn't single out (SIGIL 2, glass 0) sit inside them.
- So his eye is not at odds with the sources. The sources just name a narrower rule than "rounded": too round *for
  the size*, on a dense tool.

---

## 6. What a refactor would rest on

His words (02:37, `briefs/t180_ui_declutter.md`): "if we find good research. We defintelly need to do a whole UI
refactor, but keep all the plumbing."

**No single source is enough.** Four together could base a spec, each for a layer it actually covers:

1. **Fluent 2 for the sizes and shapes of the chrome.**
   - It is a desktop system for his platform. The builder already uses its fonts: Segoe UI Variable and Bahnschrift
     (`index.html` `--body`, `--display`).
   - Its shape ramp is the most tool-like read: 2 under 32 px, 4 default, 8/12 large, square at the screen edge
     [checked].
   - **Limit:** only the Shapes page was opened in this lap. Its type ramp, spacing and colour pages were not read, so
     whether they fit is *not known*. A spec would need them read first.
2. **Radix (Themes tokens and Colors) for the structure that six looks need.**
   - One radius scale times a factor per look [checked].
   - Twelve colour steps with fixed roles (backgrounds 1-2, borders 6/8, focus ring 8, text 11/12) [reader], so a look
     swaps its scale and every role still holds.
   - This is the machinery that keeps "fun themes" from becoming forty hand-picked values each.
   - It is MIT, but it is a React library. The builder would take the *token structure*, not the components (mine).
3. **Apple's Materials and the concentric rule for surfaces over the 3D view.**
   - Glass only for the control layer floating over content, never in content [checked].
   - Thicker for fine text [reader]; a 35% dim over bright content [checked].
   - Nested radius = outer − padding [checked].
4. **FAA AC 25-11B (with Tufte) as the rule for anything drawn on the 3D view.** Elements only if they add information;
   labels never obscure what they label; minimise clutter [checked].

Two precedents to measure ours against, not to copy (GPL):
- **Blender** (roundness 0.2 of height; calm, low contrast; colour never alone);
- **Dear ImGui** (square, 8×4 spacing).

**What these do NOT cover for a 3D track tool. This part would have to be ours, from measurement:**
- **Labels and handles anchored to 3D geometry:**
  - where a label sits relative to its mark;
  - leader lines;
  - labels colliding with each other and with the road;
  - occlusion as the camera moves.

  No source read specifies this. The FAA gives the principle, not the layout.
- **Contrast over a moving 3D picture:** text and marks over a sky and road that change every frame and differ per look.
  - NN/g and Apple give the direction (more blur or a dim, meet contrast).
  - No source gives a test. That needs our own measurement per look, as C's audit did for text.
- **Gizmos and handles:**
  - arrow pairs;
  - drag affordances;
  - hover reveal (L241's "label only under the pointer" already follows FAA de-clutter).

  No written standard was found. Blender's guidelines say themselves that much is missing [reader].
- **Floating against docked panels.** The sources disagree (§4). He has to choose before a layout is drawn.
- **Density settings.** Zed's compact/default/comfortable table [reader] is a model, but whether he wants one is his
  call.

**The finding, plainly:** the research is good enough to base a refactor of the **chrome**: tokens, panels, menus,
fields, dialogs, the radius and glow rules for six looks. It is **not** good enough, alone, for the **3D overlay layer**.
For that, the sources give principles and precedents, not a spec. That part of a refactor would have to be specified by
us and judged by measurement and by his eye. Keeping "all the plumbing" fits this split: it is a restyle of the chrome
through tokens, plus a separately specified overlay layer.

---

## 7. Corrections, limits, and sources that could not be used

- **Two premises in the packet were wrong:**
  - Carbon is not square on purpose (§1.2).
  - The current Apple HIG Layout page carries no concentricity text; the rule is in WWDC25 session 356 and the API
    docs (§1.3).
- **Refactoring UI could not be read**; it is paid. Its idea is cited nowhere in this note.
- **Could not open:** edwardtufte.com (403); PubMed (cookie wall); MoTeC's older manual links (404); a racing-HUD GDC
  article (redirected); pro-audio makers (no written rationale found); Blender manual theme sub-pages (404). Cloud
  Four blocked my curl, though the reader read it.
- **Not opened in this lap:** Fluent 2's type, spacing and colour pages; Primer beyond its radius file; the Linear
  Method; the "Adopting Liquid Glass" page beyond the reader's quote.
- Every [reader] quote passed through a summarising fetch. Re-match it at source before quoting it to him as exact.
- Bias (mine): I came in expecting Carbon to be the square-cornered anchor and Refactoring UI to be the personality
  source. Neither held.
