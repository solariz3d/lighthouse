# M3c, the snapped step as a contact: registered before code, after the read

Pane A on D, ledger D677, packet `loop/packet_m3c_m3b_A_2026-11-15.md` (git-blob `2f256649`, 88 lines, read whole). Written 2026-11-15 ~00:3x local,
after the read below and before any line of M3c. Base: `a-m1-root` `aad376b` plus a field that records which branch of `step()` each tick took
(`Chaser::branch`, no behaviour).

## The read (checked: `…_evidence/m3c_read.txt`, the row `m3c_read_what_holds_the_body_after_a_wall`)
H2's worst contact is route 7's in both ways (way b 49.2 times its bar, way a 105.5):
- **The hit:** one head-on tick (branch 3) at 5.17 m/s (b), 5.45 (a).
- **What takes the speed:** the next ticks are all **branch 2, a step the mesh snaps short, not head-on**, where today's rule takes off
  `speed × lost share × 20/s` (`kScrapeLoss`): **5.17 → 0.62 m/s in 0.15 s** (b), 5.45 → 1.08 in 0.10 s (a), while the heading swings from 29° off the
  path to −57° (b) and −38° (a), turning with nothing to turn it toward but the aim.
- **What keeps it slow:** from there it accelerates with its heading 30–57° off the path, the root's forward command being `want · cos(err)`, and is
  back at half its top (4.0 m/s) only at 1.20 s (b) and 0.68 s (a) after the hit.
- **A defect of my own H2 bar, named, not moved:** it reads a contact as its head-on ticks only, and the body left the last of them at 5.17 m/s, above
  half its top, so its own-gain bar is one tick; the snapped-short ticks that follow are not in it. The bar stands as registered.

## The law (root only; every other body keeps the snapped step as it is)
- **A snapped-short step is a contact,** as M3a made the refused one: the edge's direction `ê` is the direction of the move the mesh allowed (`c.pos`
  to the snap), the velocity after is `ê · (v·ê) · (1 − scrape·dt)`, and the body slides on that velocity with its heading easing toward it (M3a's
  slide); `kScrapeLoss` and the share lost are not read on the root. Met square (the allowed move under 1e-6 m, or `v·ê` near 0), it stops against the
  wall, and gets going again from there under the root's own law. Head-on ticks are still counted (`wall_hits`) for the report.
- **The nav clamp:** `move_along`'s result is never further from the start than the asked end: where it is, it is brought back along the start-to-result
  line to the asked length and set on the mesh there (nearest within 5 cm); where no mesh is found there, the start is returned (the move refused).

## Rows (seen red on the present tip first)
- **The snapped contact:** at a snapped-short step of a root body above 0.3 m/s met more than 30° off square, at least 0.8 of the speed along the
  wall is kept. Red today: branch 2 is not a contact.
- **H1, H2** (as registered), **the 45° stand-in bend** (≥ 1.2 m/s), **the nav row** (the clamp; no move further than asked), **M3a's contact and
  read 1**, **G1 on the routes** read and printed with route 0's doorway by both radius limits (from the M2c print), **W1, crawl, R1–R4, off means off.**
- **M3c is wrong if** H2 goes green because the body is moved away from the wall by hand, or the creep floor is lowered.
