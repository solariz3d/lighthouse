# L248, pane C (L, Opus 5.5): the T-180 UI refactor, a spec draft and a real-page look

The chair's order of 08:52Z. His words: 02:37, "We defintelly need to do a whole UI refactor, but keep all the plumbing.",
and 02:50, yes to planning it. The packet (`exo_memory/loop/packet_t180_refactor_plan_C_2026-11-26.md`) was read whole, and
so was E's research (`exo_memory/research/clean_ui_design_sources_2026-11-26.md`, all 556 lines, §0, §5 and §6 the ground).

BASE: none changed. The builder was read at `0ab6cc8` through `git show`, and served read-only from my detached worktree
`C:/Consonance/c-l248-wt`, which is now removed. No builder commit, no source edit, no build, no install. His pieces
folder was read only, for Coast Esses, as A's L242 run read it. His app was not touched.

## 1. The spec draft: `exo_memory/briefs/t180_ui_refactor_spec.md`

It covers the packet's §1, each rule beside the research line it rests on ("research :N"), with the research's
[checked]/[reader] marks carried:
- **§1 Radius:**
  - one scale: r1 2 / r2 4 / r3 8 / r4 12 px by element size, with 12 the ceiling;
  - square where a surface meets the window's edge, and circles kept;
  - one factor per look, each with its reason: glass 0, SIGIL 0.5, aurora 0.75, aqua 1, skyline 1, skyline-night 1.
- **§2 Concentric:** inner = outer − padding, floored at 0.
- **§3 Capsule:** Export to Assetto Corsa is the one capsule, in the factor-1 looks only.
- **§4 Glass:** on the control layer only, with a fill of 0.80 or more.
- **§5 Glow:** budget 0 on the chrome; focus is a ring; shadows are neutral, ≤ 12 px blur, α ≤ 0.12.
- **§6 Colour roles:** Radix's 12 steps mapped onto all six palettes. Two steps are missing today: hover (4) and solid
  hover (10).
- **§7 Density:** fixed.
- **§8 Layout:** docked or floating, shown, not asked.
- **§9 What does not change:** the plumbing, plus the three tests that will react.
- **§10 The 3D overlay layer:** "ours, to measure", seven open questions only.
- **§11 His calls**, collected.

**Nothing refused.** The research carries every point the packet asked for:
- the radius ramp: Fluent [checked], research :53-56;
- the capsule rule: Apple [checked], :97-98;
- concentric nesting: Apple [checked], :96;
- glass on the control layer only: Apple [checked], :88-90;
- the glow budget: no source has a coloured glow, :427-432;
- Radix's 12 roles: [reader], :141-145.

**Where the draft goes past a source, it says "ours":**
- aurora's 0.75 (the research only says "at most 1");
- which looks get the Export capsule;
- colour steps 3-5, 7, 9 and 10, which the research does not quote;
- the one-glow allowance, which is **not** in the override.

**Flagged in §1:** Fluent's [checked] sentence would put our ~27 px buttons at 2 px (under 32). The draft follows the
research's proposal and Fluent's [reader] ramp and puts them at 4. Both readings stay inside every ramp.

## 2. The real-page look: `exo_memory/handback/p-l248-refactor-plan-C_2026-11-26_evidence/refactor_before_after.html`

**For the librarian to publish.** It is one self-contained file of 2,727,954 bytes: 26 WebP pictures embedded, no outside
reference (`grep -c http` → 0). Clicking a picture shows it at full size.

- **What it shows, per look (all six):**
  - before and after side by side, with the File menu open;
  - before and after side by side, with a dialog open;
  - then skyline-night with the left column docked and floating.
- **How it was made:**
  - `evidence/refactor_shots.js` loads `0ab6cc8`'s real `app/index.html` in headless Chrome and lays Coast Esses the way A's
    L242 run did (the same camera).
  - It shoots before, injects `evidence/refactor_override.css` (the spec as one stylesheet), and writes `data-theme` again so
    the canvas tokens re-read. Then it shoots after.
  - `evidence/refactor_page.js` builds the page.
- **The dialog** is `askChoice`'s own DOM (`.ask-veil > .ask-card > h2, p, .ask-row`, from `app/askdialog.js`), built in the
  page with my own words. Pressing New on the laid track would have run a real command, so I did not.
- **checked**, `evidence/shots_run.txt`: every look loaded with 0 page errors and kept the title `zz-headless-test`. The
  computed styles after the override match the spec:

  | look | factor | a panel button | a menu | the left column | Export |
  |---|---|---|---|---|---|
  | SIGIL | .5 | 2px | 4px | 0px | 2px |
  | glass | 0 | 0px | 0px | 0px | 0px |
  | aqua | 1 | 4px | 8px | 0px | 999px |
  | aurora | .75 | 3px | 6px | 0px | 3px |
  | skyline | 1 | 4px | 8px | 0px | 999px |
  | skyline-night | 1 | 4px | 8px | 12px, floating | 999px |

- **checked by eye:**
  - `aqua_before_menu` against `aqua_after_menu`: the pills are gone, the menu rows are square inside an 8 px menu, the column
    is square at the edge, and Export is the one capsule.
  - `aurora_*_dialog`: 16 px to 9 px, and the violet halo gone.
  - `skyline-night_after_floating`: the column inset with the 12 px corner.
- **Said plainly:**
  - The override uses `!important` on existing selectors because a mock cannot edit the theme files. A real refactor puts
    the values in the tokens and theme files.
  - Every selector it uses exists today. inferred: so a first lap needs no markup change.
- The page and `shots/` are **left uncommitted**, as in L245: they are pictures of his app, and the room repo is public.
  The scripts, the CSS and the logs are committed.

## 3. Docked and floating: shown

skyline-night, after: `skyline-night_after_docked` and `skyline-night_after_floating`, the last pair on the page. Density
is unchanged; the spec found no reason to move it (§7).

## The machine (BUILDING.md's headless rule)

- Chrome ran with `--mute-audio`, headless (it never takes focus), and `document.title = 'zz-headless-test'` set first on the
  blank tab and kept by an observer after the app sets its own.
- The run started at BelowNormal (`start /belownormal`, children inherit it), after `heavy-run.js --status` in the same
  call (no hold).
- checked, `node consonance/tools/leftovers.js`:
  - before (08:53:20Z): tab proxies **UNCALIBRATED (read 0)**, 0 orphan browsers;
  - after (08:59:53Z, `evidence/leftovers_after.txt`): the same, 0 → 0.
  - A read of 0 is uncalibrated by the tool's own rule, so this shows no increase it could see, not proof of none.
- checked: no `t180c-l248-*` temp folder is left, and no headless Chrome of mine is running. The two headless roots that are
  running are another pane's suite (`t180tex-…`, `t180snd-test-…`, both with live node parents); I left them alone. My
  worktree is removed.

## Corrections

- **To my own L245:** its two Chrome runs (`make_blur_mock.js`, `measure_blur_cost.js`) ran **without** `--mute-audio` and
  without setting the title first, and I counted no tab proxies around them. That broke BUILDING.md's headless rule, which
  I had not read then.
  - checked: the 08:53Z count, which came after those runs, read 0 (uncalibrated).
  - checked: their temp folders are gone (`c-l245-*`: 0).
  - The rule is in this lap's script.

## Not done

- No browser picture of a hovered label window under the override. The canvas tokens were set (glow 0, under-32 radius)
  and re-read; the pictures don't hover a mark.
- The contrast check (`app/test/texture-page.test.js`) was not run against the override's colours. The override changes no
  colour, only shape and glow.

SOURCES: exo_memory/loop/packet_t180_refactor_plan_C_2026-11-26.md, exo_memory/research/clean_ui_design_sources_2026-11-26.md, consonance/src-tauri/brief/BUILDING.md:173-181, git show 0ab6cc8:app/index.html and app/themes/*.css, evidence/radius_rules_0ab6cc8.txt, evidence/refactor_override.css, evidence/refactor_shots.js, evidence/shots_run.txt, evidence/refactor_page.js, evidence/leftovers_after.txt, exo_memory/briefs/t180_ui_refactor_spec.md
NEXT: librarian publish evidence/refactor_before_after.html for him when you have read this; his pick then decides the refactor's first lap
