# Hand-back, pane E (machine D): D398 follow-up, the dither pattern made from small integers and centred (for 0.4.7)

Packet: the chair's D398 Bayer fix (2026-10-19T01:43:07Z).
- The finding is A's: `exo_memory/handback/p-d398-review11-A_2026-10-18.md`, finding 1 and note 1.
- The ruling is the librarian's: `exo_memory/librarian/2026-10-18.md`, 19:42, ruling (1).
- Uncommitted hand-back. Nothing pushed, nothing installed. Headless only.
- Work folder: `C:\Users\nname\Downloads\t180-d398-e\`.
- **The lock:** my D399 whole run had already finished (its output is complete in `t180-d399-e\t-green-*.out`). No lock was held when this started (checked: no `heavy-run.lock`).

## 0. The answer

**Commit `e46d5a1` on `d88bca2` (branch `d398-e`), a follow-up, not an amend.** Worktree `C:\Users\nname\Downloads\t180-wt-e20`, clean.
- 2 files, +25 −2.
- checked: `git log --format="%h %p %s" -1` → `e46d5a1 d88bca2 D398 follow-up: the sky dither's pattern keeps its 16 levels on a tall canvas, and is centred`.
- checked: credential scan of `git show HEAD` → 0, 0, 0; "keeper" or "water" → 0.

**`app/preview/renderer.js`:** the index now comes from small whole numbers only, x and y each mod 4:
- `pass_bayer2(p) = 2·((p.x + p.y) mod 2) + p.y`, which is the 2×2 index 0, 2, 3, 1;
- `pass_bayer4(a) = (4·b2(low bits) + b2(high bits) + 0.5) / 16`.
- checked: the index equals the standard 4×4 Bayer matrix cell by cell.
- **The offset is centred:** it runs −15/32 to +15/32 of a step, mean 0 (checked: a node evaluation, shown in the run).
- **The call in `main()` is unchanged,** so `sky.test` row 13 and mutant S16 hold as they were.
- A comment above the pass says why.

**B's D400:** my test change is one added row (row 3) and one line in the header comment of `sky-dither.test.js`. None of the launch code is touched, so B's port fix should merge apart from it.

## 1. Test first

**Row 3 (new):** it compiles the pass's own pattern helpers (taken from `R.skyFS('')`) and reads back a 4×4 block at pixel rows 0, 2400 and 4320, in headless Chrome's GL.

| | row 0 | row 2400 | row 4320 |
|---|---|---|---|
| on d88bca2 (`t-redB-sky-dither.out`) | 16 levels | **8** | **4** → red |
| on e46d5a1 (`t-greenB-sky-dither.out`) | 16 | 16 | 16 → green |

- That matches A's float32 emulation (16 → 8 at 2400, 4 at 4320), now on real GL.

## 2. The three whole runs, under heavy-run (lockrun)

| file | result |
|---|---|
| sky.test.js | 13/13 |
| sky-dither.test.js | 3/3: longest flat run 4–8 px; the band sun 1.145, prism 1.060, caustics 1.239, aurora 1.044, all within 1.30 |
| theme-mutation.test.js | 34/34; applied 32 / caught 32 / NOT APPLIED 0 |

- **Sun's band moves with the new pattern:** 1.137 → 1.145, against 1.135 without any dither. That's still +0.010 at most.

## 3. Corrections, mine

- **The squared-row form was mine, in D398.** I took the compact `fract(dot(a, vec2(0.5, a.y * 0.75)))` without checking it at large y. A found it.
- **I said "half a step either way"; it was −0.5 to +0.4375.** It is now symmetric.
  - The D398 comment above the pass still says "half a step either way". The new paragraph under it gives the exact range.

NEXT: librarian, read this now; A gives `e46d5a1` a short read; then B lands 0.4.7. I resume D399 now.
