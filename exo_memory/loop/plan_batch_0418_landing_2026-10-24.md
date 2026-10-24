# Landing plan: local-0.4.18 = local-0.4.17 + D402 (SIGIL's own melody) (librarian, 2026-10-24 07:5x)

Tier: prove it for the install (stored data, an overwrite of the installed exe); the change itself is sound. One part, one landing pane, which the chair names. Nothing is pushed.

**Why D402 lands alone.** The keeper asked at 07:50 why SIGIL's place theme isn't in. It was finished at 20:02 yesterday (d402-e 9c5a3ab) and I held it for a batch with D447, which has since taken four review rounds. Holding a finished, independent change behind open-ended work misreads "release in batches". D447 lands as 0.4.19 when P's pre-landing review clears it.

## What lands

- **Base:** local-0.4.17, sha **1e436f6e1008…** (use the sha; the name is both a tag and a branch).
- **Incoming:** t180 **d402-e 9c5a3ab** (t180-wt-e43, from 1e436f6): 910fd64 (SIGIL plays Obsidian; place_sigil.wav sha256 35fe0fe5…, undo_sigil.wav sha256 8070c7e6…; Random picks among five), 9c5a3ab (the sound-bands row, 14/14).
  - checked: tree clean; 1e436f6 is an ancestor; `git diff --stat 1e436f6 9c5a3ab` → 14 files, +118 −60.
- Merge with `--no-ff`, as before, or fast-forward to 9c5a3ab if the chair prefers. No conflict expected (nothing else has landed on 1e436f6).

## Proof owed before install

1. Ancestry: 1e436f6 and 9c5a3ab are both ancestors of the tip.
2. **The full suite**, one heavy-run slot, TAP. The EXPO rule applies to 3221225477 file deaths. sculpt-frame's four timed rows are skipped by name. release-frame row 4 red ALONE does not block; report its figures. Any other red: bisect it and put it to the librarian.
3. **The mutation harnesses whole** (`tapmut.js`): expect 16 harnesses at 609/609/0.
4. **Sound:** sound-bands 14/14. Through the page (headless, `--mute-audio`), selecting SIGIL places and undoes with the sigil WAVs, not aqua's (the network or the audio element's src names `place_sigil.wav` / `undo_sigil.wav`). Export is not touched (confirm from the diff), so the page export runs are not owed.
5. **Credential scan** 1e436f6..tip. **"keeper"** must be 0 in [Unreleased] and in the added lines.
6. **Install only with the builder closed** (`Get-Process t180-track-builder` → none). Build from a clean detached worktree at the tip (`node src-tauri/release.cjs`). Run `scripts/install-local.ps1 -Tag local-0.4.18`; the backup `.before-local-0.4.18` must be a free name first. The stamped sha256 compare must print equal. Give the backup's sha256 (expect 53E58757…5ADD, the 0.4.17 install) and the installed exe's.
   - If the builder is open, stop at this step and ring; do not close it.
7. Tag `local-0.4.18` on the tip. No push. Keep t180-wt-e43 until the merge is confirmed, then remove it if clean.

## Still owed before any public push (unchanged)

Reword 63bb388, 15e4e81, a519bb9 and 1c640b0, and the 23 "keeper" lines from 0.4.15 (plan_batch_0417 "Landing ruled").

NEXT: landing pane make local-0.4.18 per this plan when the chair names it; then the librarian verifies on disk and gives the keeper the all-clear.

## A's reds ruled (librarian, 2026-10-24 13:5x)

A's interim: `exo_memory/handback/p-d449-reds-A_2026-10-24.md` (git-blob c77e8cda…, 3,363 B). Suite at ff88d85: 3507 tests, 4 fail, EXPO 0; tapmut 609/609/0; sound-bands 14/14.

**The timing reds do not block.** drag-frame rows 2–3 and release-frame rows 1 and 4 are red on base and tip alike, or within 0.5 ms, with the other slot busy. core_close_best row 12 at 31.9 s was green on all four comparison rounds.

**"The handle was not held" (drag-frame row 1) does not block.**
- It was red on the tip 2 of 2, both with the other slot busy.
- It was red 0 of 3 alone, 0 of 1 in the suite, and 0 of 5 on base.
- checked: `git diff --stat 1e436f6 ff88d85` → 14 files: sound, theme, menubar items, index.html, the two WAVs and their tests. Nothing is in the overlay, the handles or the drag path.
- inferred, not traced: two new 614,444 B WAVs in the page's load could push readiness later under load, so the row would press before the handle is drawn. That would be the test's wait being too short, not a product defect.
- **If it shows up again in 0.4.19's suite or its comparison rounds, it gets bisected for real, D402 against base, on the WAV preload.** Until then it is a recorded flake.

**Lap id:** A's files say D449, but D449 is the other close paths' lap (plan_d447 :63). The 0.4.18 landing is filed under A's name as given; the chair gives it a new id if one is wanted.

The rest of the plan stands: install with the builder closed, the backup's sha256 (expect 53E58757…5ADD), the page check of place_sigil.wav / undo_sigil.wav with the TabProxyWindow count before and after, then the tag.
