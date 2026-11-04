# Hand-back, pane E (machine D): D405 shot checks (the librarian's 08:30 entry, on compare-level.png)

Packet: the chair's D405 shot checks (sent 2026-10-19T14:39:19Z). Measured on 294cacd's own page (t180-wt-e24), headless, muted, under the lock (`C:\Users\nname\Downloads\t180-d405-e\shotcheck.js`, through `gate.js`, 14:39:58Z): Skyline and Skyline Night, six pieces placed, the chase camera, 1400 × 860. The page's computed styles plus its own pixels.

## Verdict: both "as intended"; no change to D405

### 1. The top readout on Skyline Night: the panel is there, and it's navy on a navy sky

- **The token isn't missing.** The readout's box (x 415–985, y 54–110) computes to `color(srgb 0.0235 0.0706 0.1647 / 0.86)`. That's the page's own veil (`--veil`, which the night skin sets to `#06122a`) at 0.86.
  - On Skyline it computes to `rgba(255, 255, 255, 0.82)`, because skyline.css turns the piece values overlay white (`[aria-label="piece values"]`). The night skin, like SIGIL, keeps the page's dark veil.
- **Why it looks like no panel:** with its text hidden, the panel's inside reads (7, 18, 43). The night sky beside it reads (19, 25, 50). That's about 1.04:1, so the panel is all but the sky's own colour, as the base veil on SIGIL's black sky is.
  - The numbers on it are light on navy and read. Row 6 found 0 texts under 4.5:1 in that view.
- **If the keeper wants it to read as a pane:** the night skin could give it Skyline's treatment in night colours (the navy glass with a lit hairline edge, as the left panel has). That's a look choice, not a missing token, so I haven't made it.
  - A row "the readout has a panel in every look" would already pass: every look gives it a non-transparent background. One that asked for the panel to stand out from the sky would fail SIGIL, as it is today.

### 2. The lit "Export to Assetto Corsa" pill: 5.44:1 at its darkest fill

- **The text** is `rgb(4, 32, 63)` (`#04203f`). The fill, sampled with the text hidden, runs from (63, 155, 224) to (140, 209, 253) over the pill's gloss.
  - Against the darkest fill: **5.44:1**. Against the lightest: **9.86:1**. Both are over 4.5.
  - Skyline's pill, for comparison: white on blue, 4.68:1 to 7.78:1.
- **So row 6 had nothing to catch.** It measured this text among its 77 (it's an enabled header button, sampled over its own pixels) and correctly passed it.
- **Why it reads faint in the shot:** compare-level.png is two 1400-px shots side by side (2800 px), shown at 2000 px wide. The pill's 11-px text is scaled to about 8 px, light-ish blue on lighter blue at that size. At 1:1 it reads.

### 3. Noted only, older than D405 (the same in both looks)

- **The "chase view · sigil look (L)" label and the readout: a real overlap.**
  - The label's box is x 346–562, y 58–72; the readout's is x 415–985, y 54–110. They overlap by **2,058 px²** (147 × 14 px).
  - The readout's panel sits over the label's right part, so only "CHASE VIE…" shows. Identical in Skyline and Skyline Night.
- **The "100.00 m / turn +30.00° …" label and the bottom grid bar: a real overlap.**
  - The label's box (x 566–870, y 743–789, the length handle's values label) and the grid bar's (x 465–1265, y 753–793) overlap by **10,944 px²** (304 × 36 px).
  - The bar covers all but its top line, which is the "100.00" seen peeking out. Identical in both looks.
- Neither is touched here, per the packet.

NEXT: librarian, D405 (294cacd) stands as built; show the keeper the shots when this pointer arrives, with §1's pane as his option, and route §3's two overlaps to a later lap if he wants them fixed.
