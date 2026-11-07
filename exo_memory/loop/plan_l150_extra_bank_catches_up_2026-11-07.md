# L150: the extra bank can't catch up with the extra turn. Measure, no code change. Librarian, on L, 2026-11-07 02:3x local

**His words (verbatim, `briefs/t180_second_bank.md`, 2026-11-07 08:17Z):** "when you add both an extra turn with the extra banking, for the extra turn
the banking cant catch up in time, as if it needs to start eating into the original banking to smoothen the transition, if you look at the pic maybe u can see"
- Picture: `briefs/t180_extra_turn_bank_catchup_2026-11-07.png`. The HUD on the unplaced ghost: 1000 m, turn +90 (corner, ends straight), bank −34.78°, cup 15.5,
  edge start 0.64, bank to gravity 0 → −34.78°. The S's second bend is the long one.
- Saves: `briefs/t180_saves_2026-11-07/`. `eq-extra turn with banking error` holds only the straight p1 (the ghost was never placed).
  `eq-banking turn into unbanki` is his GOOD case: a −90 corner banking in and back out smoothly. It is the control.
- Build: t180 main fc3cc63 (installed on L). Code: `app/core/panel.js:1279-1280` (EXTRA_AT; EXTRA_FROM_SHARE = 0.5), the extra ramps in `src/core/extend.js`.

**Pieces, disjoint. Each seat copies his saves and never edits them.**
- **B (core): the road as built.**
  - First, recover the ghost's exact inputs: the panel draft, if the app keeps one. Look in the WebView storage under `AppData\Local\com.solariz3d.t180-track-builder`,
    reading a copy only, with the app not running. If there is no draft, rebuild it from the HUD and the picture, and say which values were read off the picture.
  - Build it headless on fc3cc63. Every 10 m, give: the curvature; the bank as built; the bank the curvature asks for (the same measure the checker uses);
    and the lag between built and asked.
  - Then the same rows for the good save's p2.
  - Answer: where does the extra bank start against the extra turn, and by how many metres does it trail?
- **C (code read): where the extra bank's start is decided, and what "eating into the original banking" would mean in the code.**
  - Give two or three ways to do it. For example: the extra bank's ramp starts before its `from` and blends out of the first ramp, or its start is tied to the extra turn's curvature onset.
  - For each way: which saved bytes move, and whether the additive rule still holds (an extra of 0 is byte-equal to no extra).
  - No edits.
- **E (registration, before B's numbers are out):** write down what "can't catch up" means as a number, and what would show it is NOT the bank lagging. For example: the lag is
  inside the bar, and what he sees is the turn's own shape, as in L142 item 2. Then rule on B's rows against it.

**Then:** my page for him: his piece, the bank-asked vs bank-built pictures, and the two or three ways drawn as sketches. He picks; nothing is built before that.
**Stop rule:** any seat that finds it needs a code change to measure stops and rings.
