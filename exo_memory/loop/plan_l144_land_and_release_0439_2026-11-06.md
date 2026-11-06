# L144: land the second-change work on main, point the shortcut back at the rebuilder, release 0.4.39. Librarian, on L, 2026-11-06 08:5x

**His word:** "ready" (08:55Z). It answers my 08:54Z list, which read "When you're ready, in order: 1. Put the second-change work on main.
2. Point your shortcut back at the rebuilder. 3. Release 0.4.39." Brief `briefs/t180_second_bank.md`.
**What lands:** t180 `d10eacf..a523589` (origin `l141-cheap-probe`), 21 commits. Seven of them are authored `zackn <zackn@localhost>` (L135, 0085910..0df08db).
The parked `e20f865` is NOT in this range (checked: `git log --oneline d10eacf..a523589`).

## Steps (C lands, E reviews, in this order; stop at any red)
1. **C: one squash commit on main**, authored solariz3d, with a plain message (the 11-06 handoff rule: squashed). This also settles the L135 author.
   Before it lands, the tree must equal a523589's (`git diff a523589 <squash> --stat` empty).
2. **C: the full suite on the squash** (js and Rust; own CARGO_TARGET_DIR; heavy-run lock at 4096).
   - **The known red:** D's `core-extra-bank-drag-cost` 8 px row reads 2.48× against 2× (`p-l141-B_2026-11-06.md` :18, :106).
   - **Stop rule:** do NOT mark it todo, loosen it or skip it to get green. That is a registered degenerating sign (l139 registration).
   - If it is the only red, stop before the push to main and ring. It is the keeper's call (librarian asks him now).
   - Any other red: stop and ring.
3. **E: review the landing.**
   - Same tree as a523589.
   - Suite counts.
   - CHANGELOG `[Unreleased]` → `[0.4.39]`, saying what the second change does and why.
4. **C: version 0.4.39, then build the installer.**
   - Install on L: back up first, no launch.
   - Point `OneDrive\Desktop\T-180 Track Builder.lnk` back at the rebuilder and update `built-head.txt`.
5. **C: push main and the tag, then the GitHub release 0.4.39**, the same way as 0.4.30 (`handback/p-0430-release-C_2026-10-29.md`).
   - Before the push, run the privacy scan (credentials only) and the push gate.

Rules: commit by named paths; no AC launch; never print credentials.

NEXT: chair dispatch C steps 1-2 now; E step 3 when C rings green; C steps 4-5 when E is green and the drag-cost row is settled by him
