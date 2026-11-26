# Packet L249 (panes A, C and E build; pane P reads; on L): the T-180 chrome refactor, as drafted

**His words, 04:49:** "the refactor looks good enough." and, on scope: "how much are you planning on refactoring? Like the
whole style and design of each themes UI? I like some of it, like the backdrops, but i suppose it can always be done
better". Earlier, 02:37: "We defintelly need to do a whole UI refactor, but keep all the plumbing."

**The spec is the master:** `briefs/t180_ui_refactor_spec.md` (§1 to §9). The values are already written as one
stylesheet he has seen laid over the real page: `handback/p-l248-refactor-plan-C_2026-11-26_evidence/refactor_override.css`.
This lap puts those values where they belong (tokens and theme files) with no `!important`.

## Scope, said once
- **Changes:** radii by the one scale and one factor per look (glass 0, SIGIL 0.5, aurora 0.75, aqua 1, skyline 1,
  skyline-night 1); inner = outer − padding; Export the one capsule, in the factor-1 looks; no coloured glow on the
  chrome; focus a 2 px solid ring; shadows neutral (blur ≤ 12 px, α ≤ 0.12); two new tokens per look, hover (step 4) and
  solid hover (step 10).
- **Does not change:** backdrops, palettes, fonts, layout (the left column stays **docked**), spacing, density, and
  every file the spec's §9 lists as plumbing. No markup change unless a rule has no selector to hold on to; say so if one
  is needed.
- **Label windows on the road:** he liked their styling and disliked only the round ones (02:3x). Put their radius on the
  scale (r1 × the look's factor) and leave fill, sheen and glow as they are. Their blur is a later lap (L251), not this one.

## Base and the split (builder repo, branch `l249-chrome-refactor` from `l244-theme-colours` c9fe4f1)
c9fe4f1 carries L244's per-theme handle colours (unread so far), so P's read covers both.
- **A:** `app/index.html`'s style block (the shared scale `--r1..--r4`, the factor token, step 4 and step 10, the focus
  ring, the shadows, SIGIL's values), `app/themes/glass.css`, and the three reacting tests. A integrates and owns the branch.
- **C:** `app/themes/aqua.css` and `app/themes/aurora.css`.
- **E:** `app/themes/skyline.css` and `app/themes/skyline-night.css`.
- **Token names are fixed here so the three can work at once:** `--r1 --r2 --r3 --r4` (px at factor 1: 2, 4, 8, 12),
  `--radius-factor`, `--hover` (step 4), `--accent-hover` (step 10). A theme file sets `--radius-factor`, `--hover` and
  `--accent-hover` and drops its own hard radii, pills, glows and halos. C and E commit on their own branches from
  c9fe4f1 (`l249-c`, `l249-e`), touching only their two files each; A merges them.
- If a name here does not fit what `index.html` already has, A says so in one line to the chair before C and E go on.

## Tier and rows
**Build it** (six looks, every surface of the chrome; a fault is visible and undoes with one install). Proving rows:
- per look, the computed radius of a panel button, a menu, the left column and Export equals the spec's table
  (`handback/p-l248-refactor-plan-C_2026-11-26.md`, the table under "checked");
- no chrome rule in the six looks carries a coloured `box-shadow` or `text-shadow` glow, and no radius above 12 px except
  Export's capsule and the circles;
- the contrast check still passes in every look, the new hover steps included (`app/test/texture-page.test.js`);
- `app/test/theme.test.js` and `app/test/markwindow.test.js` amended by name where a promise changed, never weakened;
  W1's "no two looks draw the same window" must still hold with the new radii, or say which looks now tie.

Touched tests only; the whole suite once at the landing. Known reds at this base: row 7 (`texture-page.test.js:252`) and D642.

## For his eye, before any install
The same before/after page C made in L248 (`evidence/refactor_shots.js`, `refactor_page.js`), re-shot from the real
branch with no override: six looks, the File menu open, a dialog open, and one hovered label window per look. Left
uncommitted (pictures of his app). The librarian publishes it.

## P's read (after A's hand-back)
Read c9fe4f1..tip without A's hand-back first, then with it. Vary what the authors fixed: a look switched live in the
running page, a narrow window, a long menu, a dialog over a bright backdrop. Say CLEAN or NOT CLEAN with rows.

Hand-backs to the librarian, claims checked or inferred. BUILDING.md's headless rule applies to every Chrome run. No
install, no release; his own app is not touched.
