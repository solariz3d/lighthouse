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

## ADDENDUM 07:40 — the gap above is closed: four panes went idle after a real turn with no suggestion

At the keeper's word ("wym starts tomorrow you can do it now", 07:39, via the librarian), the chair sent one
no-work delivery-test line to each of A, B, C and E. **All four returned `delivered` at once**: no QUEUED row, no
FORCED mark (the two librarian rings before the rebuild each held the full 240 s). Each pane then completed a turn
(its transcript ends on `turn_duration`) and wrote a ready stamp (`data/ready/*.json` at 07:39:54–07:40:19).

Scanned from the clear-screen before each pane's test line (script: chair scratchpad `after-test.js`; scanner as above):

    pane      bytes after test: Try" / ESC[2m     scan.exe 64x99, from the clear before the test
    A 6fe15f0a      0 / 0                         placeholder-read-as-text 0 · final frame EMPTY
    B 12fb81f6      0 / 0                         placeholder-read-as-text 0 · final frame EMPTY
    C 0845a868      0 / 0                         placeholder-read-as-text 0 · final frame EMPTY
    E a2122153      0 / 0                         placeholder-read-as-text 0 · final frame EMPTY

**So an idle composer after a completed turn reads EMPTY on all four seats.** Two things changed at once and this
reading cannot separate them: the suggestion switch (D076) and the ready stamps (installed 01:3x). The stamps alone
would not have prevented the held deliveries, since `PaneGate::Ready` asks the same composer predicate
(`main.rs:9033`). The zero dim bytes are the switch's own evidence. The librarian owns the board-row count
(queue-to-delivery seconds per pane) and files it.

*Noticed, not touched:* `data/ready/0c0c0c0a-…a01.json.30448.tmp` is a stray temp file from 01:29, left by one
stamp write that did not rename. It is harmless to the reader. Its cause is not established.
