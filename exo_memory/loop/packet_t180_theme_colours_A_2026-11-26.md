# Packet L244 (pane A; on L): per-theme handle colours, after the install

His word (02:23): "yes handle colors per theme". Brief: `briefs/t180_ui_declutter.md`.

Step 0, L244a: install builder 0ab6cc8 (L241 + L242) on L. He is closing the builder for it; check `tasklist`, back up
the installed exe, and sha256 both. That step is the install only.

Then, on a branch `l244-theme-colours` from 0ab6cc8: each of the six themes sets its own `--mark-*` colours (bank, turn,
climb, width, cup, length, edge), chosen to sit in that theme's palette. The meaning stays readable: bank and turn are
clearly apart (W4's bar), and each colour stands off that theme's road and grid. Pictures as L242, per theme: rest,
hover_bank and drag_handle. Tier: check it. Pane C reads second. No install until he picks.
