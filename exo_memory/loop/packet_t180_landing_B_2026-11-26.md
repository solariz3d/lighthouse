# Packet (pane B lands; on L): one landing branch for the night's T-180 work, built up as each read comes back

**His words.** 05:11: "lets keep grinding track builder". 04:49: "the refactor looks good enough. 2. Yes finish the rest."
06:28: "artifact looks good". All in `briefs/t180_ui_declutter.md` and `briefs/t180_reference_overlay.md`.
No release; the install on L waits for his word and his app closed.

## What goes in, and its state at 12:45Z

| branch | tip | what | read |
|---|---|---|---|
| `l249-chrome-refactor` | 40e931e (pushed) | the chrome refactor, with L244's handle colours | P: CLEAN (`handback/p-l249-read-P_2026-11-26.md`) |
| `l253-row7` | 906db1a | Extend row first; Place piece under it | none yet (P, with its other reads) |
| `l250-shadow-tracks` | 8c99a24 (on 0ab6cc8) | shadow tracks, Line and Road | E twice NOT CLEAN, repaired twice; O: CLEAN (`handback/p-l250-read2-O_2026-11-26.md`) |
| `l254-left-column` | 2d7ab5f | the left column flush, clearing away | P reading |
| `l255-chrome-followups` | a64c625 | P's follow-ups | E reading |
| `l251-label-blur` | 6a3ea79 | label windows as elements, with blur | A reading |

## Step 1, now (B)
1. **The at-height cut, O's latent case** (`p-l250-read2-O_2026-11-26.md`, "First"): `groundUnder` drops a road exactly
   at the point's own height in 1.0 to 9.2% of spots at heights that are not powers of two. On `l250-shadow-tracks`:
   a row red first at such a height (O used 2.2 and 3.7), then the cut a hair above the point (O suggests
   `pos[1] + 0.01`; the bridge rows' nearest deck is 0.088 m above its start, so they must stay green).
2. **Make `landing-1126` from `l249-chrome-refactor` 40e931e.** Merge `l253-row7` 906db1a, then `l250-shadow-tracks`
   at its new tip. `l250` was built on 0ab6cc8, so this merge meets L249's CSS: the reference panel takes `--r3` from
   the page now (it fell back to 4 px before), and its look should sit with each look's panes. Say what you resolved by
   hand, file by file.
3. Run the touched tests of what you merged (the reference rows, cargo `kn5road reference` on the merged tree,
   `texture-page`, `theme`, `markwindow`). Not the whole suite yet.

## Step 2, as each read rings CLEAN (the chair tells you)
Merge `l254-left-column`, `l255-chrome-followups` and `l251-label-blur` in that order. Known meeting points:
- `app/test/texture-page.test.js`: E's row 7b, O's rows 15 to 18 and A's rows all append at the file's end. Keep all.
- `app/index.html`: A's `#left` rules, O's three header and menu hunks, C's one token line at `:50`.
- the five theme files: O's Export hover and field rules, C's `--mark-win-blur` line.
- `CHANGELOG.md`: every branch adds under Unreleased.
- C left comments saying the windows are "drawn on a canvas" (`app/index.html:47` and each theme's L242 comment): fix
  them here.
A read that comes back NOT CLEAN keeps its branch out until repaired; the landing does not wait for it unless the
librarian says so.

## Step 3, when every branch that is going in is merged
- The whole suite once, on the merged tip: `node consonance/tools/heavy-run.js --status` first, BelowNormal, in the
  background. Name every red against the known reds; a new red stops the landing.
- Build the installer from the merged tip (as L244a did: `handback/p-l244-theme-colours-A_2026-11-26.md` section 1;
  no build while his T-180 app runs).
- **Do not install.** Ring the librarian with the tip, the suite's counts and the built exe's sha256. The install is a
  separate order at his word.

## For his eye, before the install
From the merged tip, one look of your choice plus Skyline: the window with the left column shown and cleared, a
reference shown as Road with the panel open, and a hovered label window. Uncommitted; the librarian shows them.

Hand-back to the librarian after step 1 and after step 3, claims checked or inferred. No push of `landing-1126` until
the librarian says so; no release.
