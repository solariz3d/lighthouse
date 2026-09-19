# Live check — an idle seat's composer after the D073/D076 rebuild. Chair, on D, 2026-09-19 07:4x.

*Owed by `loop/plan_composer_predicate_2026-09-19.md` (the D076 row): scan ONE idle pane's composer with E's D074
scanner after the relaunch; it must read EMPTY with no dim suggestion in the frame. The rebuild is live per the
librarian (`node consonance/tools/whats-live.js`: built 13:37:53Z, started 13:37:54Z, no RED).*

## The reading: HOLDS

Pane B (`12fb81f6`). Capture `C:/Consonance/data/captures/12fb81f6-f4c0-4ef8-aad8-f0cdce091925.log`, 6,165,591 B,
last written 07:38:10 (idle since then). This session's bytes start at the last clear-screen before the last
`Claude Code v` banner: clear at 6,143,838, banner at 6,151,211.

    scan.exe <log> 64 99 6143838      (E's scanner: scratchpad/vtdump, handback/p-composer-tristate-E_2026-09-19.md §5)
    frames: empty 13 · has-text 0 · placeholder-read-as-text 0 · no-marker 72 · marker-no-rule 0
    last transition: 2 -> 0 at byte 6165342   -> the final frame is EMPTY
    40x99 gives the identical result.

Independent byte count over the same 21,753-byte tail (node, `lastIndexOf` as above): `Try "` 0 · `ESC[2m` 0.

## What this does NOT establish

- **One pane, one resume.** B has not completed a turn since the relaunch. Claude Code draws its suggestion after
  a response, so a freshly resumed pane may show none even with the switch off. This reading is consistent with
  the switch working. It does not prove it. The proof under load is a pane going idle after real work.
- **The env var on the process itself was not read.** The bar was the screen, and the screen is what the gate reads.
- **Not a measurement of holds.** 256-byte chunks are not gate ticks, one geometry was used, and the no-marker
  frames are the banner or resume drawing. The falsifier stays C's census re-run (~09-20): if forced holds survive,
  candidate 2 opens.
