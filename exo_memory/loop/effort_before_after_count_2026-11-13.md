# Corrections and rework in the panes' hand-backs, before and after 02:37 on 2026-11-13: the count

Owed by `exo_memory/librarian/2026-11-13.md:57` ("a count of corrections and rework in the panes hand-backs before and after 02:37"). [read]
Done by a sub-agent of the librarian seat, read-only, on the desktop checkout. Written 2026-11-13 09:40 local (15:40Z) (from `date`).
The hand-backs were listed and placed at HEAD `c6d56c37` (2026-11-13 09:03 local). The repository moved on while I worked (`8962d13c`, 09:35). Nothing counted here changed in between (`git diff --stat c6d56c37 HEAD -- exo_memory/handback/`: two new hand-backs with their evidence files, and 39 lines added after line 139 of `p-gen-lap2-kit-B`). [read]

Marks: **[read]** I opened the line, or ran the command named, and saw it. **[inferred]** reasoned from what I read. **[ours]** my own count, sum or rule.
All hand-back paths are under `exo_memory/handback/`. The line is 2026-11-13 08:37Z (02:37 local, UTC-6).

## 1. The result table

| | BEFORE | AFTER |
|---|---|---|
| files | 29 | 19 |
| sections counted | 248 | 145 |
| lines counted | 4,542 | 2,650 |
| **C1** self-named corrections | **43** · 0.173 a section · 9.5 per 1,000 lines | **46** · 0.317 a section · 17.4 per 1,000 lines |
| **C2** corrections by another seat or the keeper | **10** · 0.040 · 2.2 | **5** · 0.034 · 1.9 |
| **C3** rework | **18** · 0.073 · 4.0 | **10** · 0.069 · 3.8 |
| **C4** registered falsifiers that fired | **2** · 0.008 · 0.4 | **4** · 0.028 · 1.5 |

[ours] Every number is a sum over the appendix (143 lines) and the section table in section 3.

- Two files have sections in both sets (`p-l182-lines-A`, `p-l185-skeleton-E`), so 46 files were counted in all. [ours]
- UNASSIGNED, in neither column: 6 sections, 103 lines, holding C1 3, C2 1, C3 1. [ours]
- One event can be counted once as an error (C1 or C2, never both) and once more as rework (C3) when the text says the step was done again. [ours]

**The same four counts, cut three other ways.** No new counts; raw number, then per 1,000 lines. [ours]

| cut | set | files | sections | lines | C1 | C2 | C3 | C4 |
|---|---|---|---|---|---|---|---|---|
| Build laps only | BEFORE | 15 | 124 | 2,164 | 40 · 18.5 | 7 · 3.2 | 18 · 8.3 | 2 · 0.9 |
| Build laps only | AFTER | 18 | 139 | 2,589 | 46 · 17.8 | 5 · 1.9 | 10 · 3.9 | 4 · 1.5 |
| Clean laps only | BEFORE | 27 | 231 | 4,390 | 37 · 8.4 | 10 · 2.3 | 15 · 3.4 | 2 · 0.5 |
| Clean laps only | AFTER | 14 | 121 | 2,257 | 39 · 17.3 | 5 · 2.2 | 6 · 2.7 | 1 · 0.4 |
| UNASSIGNED put in BEFORE | BEFORE | | | 4,645 | 46 · 9.9 | 11 · 2.4 | 19 · 4.1 | 2 · 0.4 |
| UNASSIGNED put in AFTER | AFTER | | | 2,753 | 49 · 17.8 | 6 · 2.2 | 11 · 4.0 | 4 · 1.5 |

- **Build laps only** leaves out every hand-back whose own first six lines say "Research only", "Design only", "nothing built" (or "nothing was built", "nothing is built") or "review of": 14 before files (2,378 lines, holding C1 3 and C2 3) and 1 after file (61 lines, no item). [read: the grep of lines 1-6, listed in section 3]
- **Clean laps only** leaves out every hand-back with sections on both sides of the line, or whose lap number and stamp disagree: `p-l182`, `p-l185`, `p-l188`, `p-l191`, `p-l180-lap2-rest`. [ours]

**By pane.** Lines, then C1 / C2 / C3 / C4. [ours]

| pane | model named in its hand-back commits | BEFORE lines | BEFORE C1/C2/C3/C4 | AFTER lines | AFTER C1/C2/C3/C4 |
|---|---|---|---|---|---|
| A | Claude Sonnet 5.5 | 472 | 7 / 3 / 6 / 1 | 282 | 6 / 0 / 3 / 3 |
| B | Claude Opus 5.5 | 566 | 8 / 1 / 3 / 0 | 756 | 8 / 2 / 2 / 0 |
| C | Claude Opus 5.5 | 1,861 | 17 / 3 / 5 / 1 | 473 | 9 / 2 / 2 / 1 |
| E | Claude Opus 5.5 | 1,643 | 11 / 3 / 4 / 0 | 1,139 | 23 / 1 / 3 / 0 |

- The model column is the `Co-Authored-By` line of every commit that touched a counted hand-back: A 11 before and 21 after, B 5 and 14, C 25 and 16, E 26 and 22. No pane's line changes across 08:37Z. [read: `git log --follow --format='%ct %b'` per file]
- Pane A's own before hand-backs say "A (Sonnet 5.5 trial)" (`p-l169-code-A:3`, `p-l170-chase-A:1`, `p-l182-lines-A:1`). [read]
- No hand-back names a reasoning effort (grep for `xhigh`, `reasoning effort`, `effort` over the counted files: no hit about a setting). The line comes from `exo_memory/librarian/2026-11-13.md:4` and `:17`. [read]

**How far chance alone goes.** [ours] Take each rework item as independent and lines as the exposure. Neither is true. Then, in the build-lap cut, 10 or fewer of 28 items falling after the line has probability 0.036. Six of the 18 before items sit in one hand-back (`p-l170-chase-A`, 165 lines). Without it the cut reads 12 on 1,999 lines against 10 on 2,589 (6.0 against 3.9 per 1,000), and the same probability is 0.205. (One `node` run of a binomial sum; share of lines after = 2,589 / 4,753 and 2,589 / 4,588.)

## 2. What the numbers support

1. Per 1,000 lines the after set records more self-named corrections (9.5 before, 17.4 after), about the same corrections by others (2.2, 1.9) and rework (4.0, 3.8), and more fired falsifiers (0.4, 1.5, on 2 and 4 events). [ours]
2. The rise in C1 follows the kind of task: 14 of the 29 before files are research, design or review only by their own first lines (2,378 lines, 3 of the 43 C1), and with those set aside C1 is 18.5 before and 17.8 after. [ours, from read labels]
3. In that build-lap cut rework is lower after (8.3 against 3.9) and so are corrections by others (3.2 against 1.9, on 7 and 5 events), but a third of the before rework sits in one hand-back and without it the rates are 6.0 and 3.9. [ours]
4. This count cannot remove: different tasks; the pane mix (all four panes wrote on both sides, but C wrote 41 % of the before lines and 18 % of the after, and E wrote 23 of the 46 after C1); the hour; each lap's difficulty; less time after the line for anyone else to find a fault (five of the ten before C2 are the keeper's items, against one of the five after); faults made before the line and written down after it (at least 6 C1, 1 C2 and 3 C3 of the after set, marked CARRY in the appendix); a more careful pane writing down more of its own slips, which would raise C1 with effort; my own reading of what counts; and small numbers. [read for the items named; ours for the sums]
5. No difference in the table is larger than those confounds could explain. [ours]
6. So the count supports "no difference" for self-named corrections on like work and "cannot tell" for rework, corrections by others and fired falsifiers; it shows no cause. [ours]

## 3. The lists

### 3a. How the two sets were built

The placement rules were fixed before any item was seen (saved in my scratch folder at 2026-11-13T15:14:28Z, before the readers returned). [ours; only that scratch file shows it]

- **A section** is the title block (line 1 to the line before the first `## `) or one `## ` block. [ours]
- **Its stamp** is the committer time of its lines (`git blame --line-porcelain`), checked against any time written in the section. All file times on this checkout read 08:43 (the pull), so they were not used. [read]
- Lines committed before 2026-11-13 08:37Z: BEFORE. Lines committed 08:37Z to 14:00Z: AFTER. Lines committed at or after 14:00Z (08:00 local): OUTSIDE, not counted. [ours]
- **UNASSIGNED: two places where I cannot tell.**
  - `p-l191-arm-shape-C` lines 1-96. Its packet is "the chair's 06:39:07Z, then its 08:44:11Z wake for the 13-hour run" (`:3`), and this draft was committed at 08:50Z, six minutes after that wake. Line 3 names the 08:44Z wake, so the text was closed after the line; that the work it describes ran before the line is inferred. [read: `:3` and the commit time]
  - `p-l182-lines-A` lines 56-62, headed "Interim, Friday 2026-11-13 ~02:50 local" and committed 08:44Z. It reports sweeps that ended at 08:33:58Z (`:60`). [read]
- `p-l191-arm-shape-C` lines 97-137 (the review packet, the landing, the next steps; committed 09:18Z, build started 08:54:11Z by `:114-115`) are AFTER. [read]
- `p-l185-skeleton-E` lines 3-18 were inserted on 2026-11-13 at 13:18Z (AFTER); lines 19-25 are the 2026-11-12 opening text under the title (BEFORE). [read: blame]
- Three sections hold one stray later line each and stay where the rest of the section is: `p-l182-lines-A` 50-55 and `p-l185-skeleton-E` 118-126 (BEFORE), `p-gen-lap2-kit-B` 76-83 (AFTER; its line 84 is OUTSIDE). [read: blame]
- **`p-l188-fpbody-B` is in AFTER by its stamp** (every line committed 09:59Z or later), though its lap number is in the before range and two of its packets are from 08:05Z and 08:34Z (`:31-33`). Its "Red first, then green" section has no time of its own. It holds C1 3 and C3 1. The clean-laps cut drops it. [read]
- `p-l180-lap2-rest-C` (20 lines, a stop note committed 13:15Z, no item) is AFTER by its stamp. [read]
- Whether a running pane's effort changed at 02:37 or at its next wake (08:44Z) is not in anything I opened. [ours]

### 3b. The source of the file list

`ls -l exo_memory/handback | grep -E '_2026-11-1[23]\.md$'`, run again at the end (54 files; 52 at the first listing). Bytes, name, and where each went. [read]

```
    4086  p-d-update-P_2026-11-13.md                         OUTSIDE 
    3593  p-d665s1-rows-land-P_2026-11-12.md                 OUTSIDE (see the note below)
    5988  p-d672-fp-C_2026-11-12.md                          OUTSIDE (see the note below)
    2313  p-d672-land-P_2026-11-12.md                        OUTSIDE (see the note below)
    5953  p-d673-frame-C_2026-11-12.md                       OUTSIDE (see the note below)
   17378  p-d673-overtime-A_2026-11-13.md                    AFTER 
    7432  p-gen-lap1-measure-B_2026-11-13.md                 AFTER 
   16411  p-gen-lap2-kit-B_2026-11-13.md                     AFTER OUTSIDE 
    9617  p-his-record-replay-A_2026-11-13.md                AFTER 
    7633  p-l168-setup-B_2026-11-12.md                       BEFORE 
   26177  p-l169-anim-C_2026-11-12.md                        BEFORE 
   56896  p-l169-code-A_2026-11-12.md                        BEFORE 
   25048  p-l169-games-E_2026-11-12.md                       BEFORE 
   10848  p-l170-abilities-E_2026-11-12.md                   BEFORE 
   14203  p-l170-anim-C_2026-11-12.md                        BEFORE 
   26379  p-l170-chase-A_2026-11-12.md                       BEFORE 
   16079  p-l170-instr-B_2026-11-12.md                       BEFORE 
    3576  p-l170-review-E_2026-11-12.md                      BEFORE 
   10141  p-l170-scale-E_2026-11-12.md                       BEFORE 
   41472  p-l171-movement-tech-E_2026-11-12.md               BEFORE 
   11544  p-l172-chaser-kit-E_2026-11-12.md                  BEFORE 
    9374  p-l173-lean-C_2026-11-12.md                        BEFORE 
   11619  p-l174-fpbody-B_2026-11-12.md                      BEFORE 
   10465  p-l175-stairgap-E_2026-11-12.md                    BEFORE 
   16762  p-l176-openanim-C_2026-11-12.md                    BEFORE 
    5342  p-l177-lean-lead-C_2026-11-12.md                   BEFORE 
    8449  p-l179-talks-C_2026-11-12.md                       BEFORE 
   13905  p-l179-valve-anim-C_2026-11-12.md                  BEFORE 
   15597  p-l180-lap1-C_2026-11-12.md                        BEFORE 
   32188  p-l180-lap2-C_2026-11-12.md                        BEFORE 
    1726  p-l180-lap2-rest-C_2026-11-13.md                   AFTER 
   35645  p-l182-lines-A_2026-11-12.md                       BEFORE AFTER UNASSIGNED 
   15286  p-l183-physics-anim-E_2026-11-12.md                BEFORE 
   14415  p-l184-fpbody-research-B_2026-11-12.md             BEFORE 
   16286  p-l185-skeleton-E_2026-11-12.md                    BEFORE AFTER 
   11082  p-l186-physics-player-E_2026-11-12.md              BEFORE 
   28620  p-l187-animal-locomotion-E_2026-11-12.md           BEFORE 
   11568  p-l188-fpbody-B_2026-11-13.md                      AFTER 
    5672  p-l189-drops-C_2026-11-12.md                       BEFORE 
    9843  p-l190-arms-C_2026-11-12.md                        BEFORE 
   10015  p-l191-arm-shape-C_2026-11-13.md                   AFTER UNASSIGNED 
   20083  p-l192-footsteps-E_2026-11-13.md                   AFTER 
   26841  p-l193-yardstick-E_2026-11-13.md                   AFTER 
   12583  p-l194-landing-train-B_2026-11-13.md               AFTER 
   23457  p-l195-arm-variants-C_2026-11-13.md                AFTER 
    9876  p-l198-403-stall-B_2026-11-13.md                   AFTER 
    9932  p-l199-voice-ingame-E_2026-11-13.md                OUTSIDE (see the note below)
   32877  p-l199-voices-E_2026-11-13.md                      AFTER 
    6917  p-l200-legs-C_2026-11-13.md                        AFTER 
    4720  p-l202-idle-holder-guard-B_2026-11-13.md           AFTER 
   13000  p-l205-stomp-C_2026-11-13.md                       OUTSIDE 
   16760  p-record-owner-A_2026-11-13.md                     AFTER 
    4712  p-run-frame-timer-mock-C_2026-11-13.md             AFTER 
    9492  p-spotcheck-sprintref-E_2026-11-13.md              OUTSIDE (see the note below)
```

OUTSIDE both sets, with the reason: [read: `ls`, `git log`]

- `p-d665s1-rows-land-P`, `p-d672-fp-C`, `p-d672-land-P`, `p-d673-frame-C`: desktop laps written on the evening of 2026-11-11 (file times 21:16 to 23:23 local), not laps L168 to L203 and not one of the named laps.
- `p-d-update-P`: pane P, committed 08:59 local.
- `p-l205-stomp-C`: lap L205, committed 09:03 local, after 08:00.
- `p-l199-voice-ingame-E`, `p-spotcheck-sprintref-E`: committed 09:11 and 09:34 local, after my first listing and after 08:00.
- `p-gen-lap2-kit-B` lines 84 onward: desktop sections committed 08:48 local and later.

### 3c. Every file counted, and where its sections went

Each cell is sections / lines (line ranges). [read: blame; ours: the placement]

| file | BEFORE | AFTER | UNASSIGNED | OUTSIDE |
|---|---|---|---|---|
| `p-d-update-P_2026-11-13.md` | | | | 5 / 59 (1-59) |
| `p-d673-overtime-A_2026-11-13.md` | | 8 / 64 (1-64) | | |
| `p-gen-lap1-measure-B_2026-11-13.md` | | 7 / 119 (1-119) | | |
| `p-gen-lap2-kit-B_2026-11-13.md` | | 4 / 83 (1-83) | | 3 / 56 (84-139) |
| `p-his-record-replay-A_2026-11-13.md` | | 8 / 45 (1-45) | | |
| `p-l168-setup-B_2026-11-12.md` | 8 / 94 (1-94) | | | |
| `p-l169-anim-C_2026-11-12.md` | 10 / 308 (1-308) | | | |
| `p-l169-code-A_2026-11-12.md` | 11 / 265 (1-265) | | | |
| `p-l169-games-E_2026-11-12.md` | 10 / 209 (1-209) | | | |
| `p-l170-abilities-E_2026-11-12.md` | 7 / 91 (1-91) | | | |
| `p-l170-anim-C_2026-11-12.md` | 8 / 155 (1-155) | | | |
| `p-l170-chase-A_2026-11-12.md` | 12 / 165 (1-165) | | | |
| `p-l170-instr-B_2026-11-12.md` | 9 / 205 (1-205) | | | |
| `p-l170-review-E_2026-11-12.md` | 2 / 26 (1-26) | | | |
| `p-l170-scale-E_2026-11-12.md` | 7 / 130 (1-130) | | | |
| `p-l171-movement-tech-E_2026-11-12.md` | 13 / 385 (1-385) | | | |
| `p-l172-chaser-kit-E_2026-11-12.md` | 8 / 118 (1-118) | | | |
| `p-l173-lean-C_2026-11-12.md` | 8 / 104 (1-104) | | | |
| `p-l174-fpbody-B_2026-11-12.md` | 9 / 117 (1-117) | | | |
| `p-l175-stairgap-E_2026-11-12.md` | 7 / 118 (1-118) | | | |
| `p-l176-openanim-C_2026-11-12.md` | 9 / 152 (1-152) | | | |
| `p-l177-lean-lead-C_2026-11-12.md` | 7 / 70 (1-70) | | | |
| `p-l179-talks-C_2026-11-12.md` | 7 / 88 (1-88) | | | |
| `p-l179-valve-anim-C_2026-11-12.md` | 7 / 109 (1-109) | | | |
| `p-l180-lap1-C_2026-11-12.md` | 9 / 174 (1-174) | | | |
| `p-l180-lap2-C_2026-11-12.md` | 10 / 469 (1-469) | | | |
| `p-l180-lap2-rest-C_2026-11-13.md` | | 2 / 20 (1-20) | | |
| `p-l182-lines-A_2026-11-12.md` | 8 / 42 (1-2, 16-55) | 6 / 92 (3-15, 63-141) | 1 / 7 (56-62) | |
| `p-l183-physics-anim-E_2026-11-12.md` | 10 / 100 (1-100) | | | |
| `p-l184-fpbody-research-B_2026-11-12.md` | 8 / 150 (1-150) | | | |
| `p-l185-skeleton-E_2026-11-12.md` | 9 / 110 (1-2, 19-126) | 2 / 67 (3-18, 127-177) | | |
| `p-l186-physics-player-E_2026-11-12.md` | 8 / 87 (1-87) | | | |
| `p-l187-animal-locomotion-E_2026-11-12.md` | 14 / 269 (1-269) | | | |
| `p-l188-fpbody-B_2026-11-13.md` | | 11 / 173 (1-173) | | |
| `p-l189-drops-C_2026-11-12.md` | 5 / 104 (1-104) | | | |
| `p-l190-arms-C_2026-11-12.md` | 8 / 128 (1-128) | | | |
| `p-l191-arm-shape-C_2026-11-13.md` | | 3 / 41 (97-137) | 5 / 96 (1-96) | |
| `p-l192-footsteps-E_2026-11-13.md` | | 14 / 273 (1-273) | | |
| `p-l193-yardstick-E_2026-11-13.md` | | 14 / 364 (1-364) | | |
| `p-l194-landing-train-B_2026-11-13.md` | | 10 / 170 (1-170) | | |
| `p-l195-arm-variants-C_2026-11-13.md` | | 8 / 261 (1-261) | | |
| `p-l198-403-stall-B_2026-11-13.md` | | 8 / 138 (1-138) | | |
| `p-l199-voices-E_2026-11-13.md` | | 12 / 435 (1-435) | | |
| `p-l200-legs-C_2026-11-13.md` | | 7 / 90 (1-90) | | |
| `p-l202-idle-holder-guard-B_2026-11-13.md` | | 6 / 73 (1-73) | | |
| `p-l205-stomp-C_2026-11-13.md` | | | | 5 / 87 (1-87) |
| `p-record-owner-A_2026-11-13.md` | | 9 / 81 (1-81) | | |
| `p-run-frame-timer-mock-C_2026-11-13.md` | | 6 / 61 (1-61) | | |

Totals: BEFORE 29 files, 248 sections, 4,542 lines. AFTER 19 files, 145 sections, 2,650 lines. UNASSIGNED 6 sections, 103 lines. OUTSIDE 13 sections, 202 lines. That is 412 pieces (410 sections, two of them split by the placement) and 7,497 lines, the line count of the 48 files at `c6d56c37`. [ours]

Research, design or review only by their own first six lines (left out of the build-lap cut). [read: `grep` of lines 1-6 for "research only", "design only", "nothing built", "nothing was built", "nothing is built", "review of"]

- BEFORE (14): `p-l169-anim-C`, `p-l169-code-A`, `p-l169-games-E`, `p-l170-abilities-E`, `p-l170-review-E`, `p-l170-scale-E`, `p-l171-movement-tech-E`, `p-l172-chaser-kit-E`, `p-l176-openanim-C`, `p-l179-talks-C`, `p-l183-physics-anim-E`, `p-l184-fpbody-research-B`, `p-l186-physics-player-E`, `p-l187-animal-locomotion-E`.
- AFTER (1): `p-run-frame-timer-mock-C`.
- `p-l179-valve-anim-C` (109 lines, no item) is a reading lap that does not say so in those words, so the rule keeps it among the build laps. [read]

### 3d. The count rules as I applied them

These were settled while I opened the items and before any total was computed, and were applied the same way to both sets. [ours]

- **C1** counts a place where the pane says, in its own voice, that something it produced was wrong, failed through its own fault, or was a slip: under a heading such as "Corrections (mine)", "Mistakes in this lap", "My faults", "Slip (mine)", or in a sentence such as "My first ... was wrong". A bullet that says "two" and names two is two.
- **C2** counts a place where the hand-back records that another seat or the keeper found a fault in this pane's work. When someone else found it and the pane also owns it, it is C2 only.
- **C3** counts a redo at the level of a result: a scored run, sweep, capture set, render or mutation pass run again because the first was wrong or invalid; a landing done twice; the pane's own registered or landed row, bar or registration amended or replaced because it was wrong; a lap that redoes an earlier lap's landed result after a named fault. A plain code fix with no second run stated is C1 only. A launch that produced nothing and was started again is C1 only.
- **C4** counts a place where a condition registered before the run as refuting (named a falsifier, a registered premise, or a registered "if X, I stop and say so") is recorded as met.
- **Not counted**, and listed as borderline: a redo caused by a ruling or a changed requirement; a row amended because the pane's own design change, or another seat's change, moved it; mutation-loop survivors and their reruns; tuning steps; registered acceptance rows that a version failed on the way; a pane correcting someone else; a stop that was nobody's error.
- **The same slip written twice is counted once.** E's L169 slip is at `p-l170-scale-E:52-53` and again at `p-l169-games-E:204`. E's builds inside its own landing hold are at `p-l185-skeleton-E:173` and again at `p-l193-yardstick-E:245`. [read]

**How the reading was done.** Four parallel readers (forks of this same agent, with this brief and the sharpened definitions) each read a share of the 46 files whole, every line, and reported candidates by file and line. Each share mixed before and after files of the same panes. I then opened every line they reported, counted or not, and made every decision above myself. A keyword sweep of all 46 files (`grep -n -i -E 'correction|corrected|my slip|my miss|my error|mistake|was wrong|is wrong|withdrawn|withdraw|first written|first wrote|first attempt|my first|not counted|misread|misstat|overstat|redone|re-run|re-ran|rerun|second stop|amended|rebuilt|falsifier|fired|FIRES|refuted|his catch|caught it|stopped at|my fault|a slip|slip of|my own'`) left 51 hits more than two lines from anything a reader reported. I opened each in context and none is a countable item. Every quote in the appendix was machine-checked to sit on its cited line (`grep -F` on that line: 143 of 143). [ours]

### 3e. Borderline: seen, not counted, and why

Every line below was opened by me. [read] Add any group to the table if you read the rule differently.

- **A redo caused by a ruling or a changed requirement, not by a wrong result (C3-shaped).**
  - BEFORE: `p-l170-instr-B:156-160` (its own scorer "withdrawn" under the librarian's one-scorer ruling; the branch reset and rebuilt); `p-l170-chase-A:98` (edits reverted when scorer ownership moved); `p-l180-lap1-C:127` (a kept bar re-set under his ruling); `p-l180-lap2-C:94-97` (a law built before the ruling reached it, replaced as ruled); `p-l171-movement-tech-E:321` (his ruling supersedes E's proposed cooldowns).
  - AFTER: `p-l182-lines-A:99-100` (the method re-registered at brutal on his ruling); `p-d673-overtime-A:6` and `:54` (a row replaced by name and a sweep re-registered for his pick and ruling); `p-l192-footsteps-E:208` (a curve amended by name after the ruling E had asked for); `p-gen-lap1-measure-B:80` (a registered number of the master's reset as the master allows).
- **Own rows amended because the pane's own design change moved them (C3-shaped).**
  - BEFORE, 9 rows: `p-l174-fpbody-B:41` (2); `p-l180-lap1-C:91-94` (3); `p-l180-lap2-C:90` (1) and `:198-203` (2); `p-l185-skeleton-E:122` (1, listed by the pane under "Corrections (step 2)").
  - AFTER, 3 rows: `p-l192-footsteps-E:212-220` (2); `p-l200-legs-C:79` (1).
- **Rows amended because another seat's change moved them (the brief's own exclusion).** BEFORE: `p-l170-chase-A:117-135` (the reprieve row re-registered over 24 seeds after E's stair fix); `p-l180-lap2-C:447-449` (the lean row re-formed over 24 seeds; its C1 at `:371` is counted).
- **Mutation-loop survivors and reruns (planned iteration).** BEFORE: `p-l170-chase-A:79`; `p-l185-skeleton-E:60`. AFTER: `p-l185-skeleton-E:139`; `p-l192-footsteps-E:108`; `p-l193-yardstick-E:218` and `:223`; `p-l194-landing-train-B:109`.
- **Tuning steps and alternatives tried and dropped, not named as slips.** BEFORE: `p-l175-stairgap-E:50-53`; `p-l185-skeleton-E:69`; `p-l173-lean-C:104`. AFTER: `p-l188-fpbody-B:67` and `:70`; `p-l199-voices-E:273`, `:281`, `:413-417`; `p-l199-voices-E:200` (two compile failures listed under slips; the cause given is the library's code).
- **C4-shaped, not counted.**
  - BEFORE: `p-l170-chase-A:13` ("every arm is FALSIFIED" on the slosh test: per-arm verdicts on a second registered bar, beside the one named falsifier at `:8`) and `:12`; `p-l180-lap1-C:55-56` (two kept bars fail; the pane stops under the packet's rule); `p-l182-lines-A:44` (one arm's bars "falsified or between").
  - UNASSIGNED: `p-l182-lines-A:58`.
  - AFTER: `p-gen-lap1-measure-B:105` and `:109` (E's design falsifiers V1 and V6 read "FAILS" at main's baseline; `:105` says an earlier lap had found the same, so this is a baseline reading, not a prediction of this lap failing); `p-l199-voices-E:402` ("No version holds all four rows", registered acceptance rows, the version marked failing); `p-l195-arm-variants-C:59` (V1 breaks two landed rows; the pane stops); `p-d673-overtime-A:7` (a registered reference md5 found stale, cause not found).
  - Read literally, the two baseline lines would make AFTER C4 6, not 4.
- **C2-shaped, not counted: a request, a direction or a routing ruling with no fault named.** BEFORE: `p-l177-lean-lead-C:3` (his item 152 asks for a hard rework of the whole animation; L180 is that rework); `p-l190-arms-C:4` (his "now the arms need to swing with the body more"); `p-l170-chase-A:3` and `:26` (the librarian's ruling on the slosh bars). AFTER: `p-l188-fpbody-B:32` (the chair's re-wake, "fix the jog crossover from the row's numbers"); `p-his-record-replay-A:1` (done under the librarian's ruling). Also `p-l193-yardstick-E:164`: counted as C1 and C3; the line says "(the chair's 10:40Z ask)", and who saw the contradiction is not said.
- **C1-shaped, not counted.**
  - BEFORE: `p-l182-lines-A:44` ("the 10 routes were the wrong guide": an early signal the pane had itself labelled "not a result" at `:25`); `p-l170-chase-A:96`, `:97`, `:99` (stated deviations from its own registration) and `:89`, `:92` (registered expectations that failed, not named wrong by the pane); `p-l174-fpbody-B:102` (a side effect found, not fixed); `p-l169-anim-C:308` (a line number that drifted, under "Corrections"); `p-l180-lap1-C:113` (its own trace overturns an inference it had labelled inferred); `p-l187-animal-locomotion-E:242`; `p-l169-code-A:55`.
  - UNASSIGNED: `p-l182-lines-A:59` ("the walk was the wrong guide again").
  - AFTER: `p-record-owner-A:60` (a gap in older code; whose is not said); `p-l194-landing-train-B:137` and `:17`; `p-l188-fpbody-B:133`; `p-l185-skeleton-E:161-163` (a stamp set twice); `p-gen-lap1-measure-B:95`; `p-gen-lap2-kit-B:14` and `:23` (the branch red at the stop); `p-l200-legs-C:89`; `p-run-frame-timer-mock-C:21` (two paths with their backslashes lost; the pane does not flag it).
- **Folded into another item, so not counted twice.** `p-l170-instr-B:178` ("The stall was mine") into the C2 at `:180`; `p-l193-yardstick-E:248` into the C2 at `:255`; `p-l195-arm-variants-C:26` into the C2 at `:7`; `p-l191-arm-shape-C:81` into the C2 at `:7`; `p-l170-anim-C:155` into the C1 at `:151`; `p-l170-chase-A:74` into the second bound at `:101`.
- **One judgment that moves a number.** `p-l195-arm-variants-C:45` and `:49` are counted as C1 beside the C2 at `:7`: his words named the look, and the pane's own row then found two defects in its L191 code (`:44`), which it ties to his "more bend" at `:52`. Read as one fault, AFTER C1 is 44, not 46.
- **Corrections that show only in a commit subject, not in the hand-back's text (all AFTER).** `5f90902d` ("my 4.5 m/s figure was wrong", `p-l193-yardstick-E`); `5f706708` ("section 10's time read from date (03:3x local, not 03:5x)", `p-l192-footsteps-E`); `e4a0105f` ("two details corrected", `p-l192-footsteps-E` and `p-l185-skeleton-E`). [read: `git log`]
- **The pane correcting someone else (nobody's count).** `p-l169-code-A:7`; `p-l170-instr-B:34`, `:77`, `:143`; `p-l171-movement-tech-E:20`, `:157`; `p-l172-chaser-kit-E:45`; `p-l180-lap2-C:137`, `:333`; `p-l187-animal-locomotion-E:267`; `p-l191-arm-shape-C:132`; `p-l193-yardstick-E:185`, `:206`; `p-record-owner-A:44-47`; `p-l194-landing-train-B:142`; `p-gen-lap1-measure-B:44`; `p-l180-lap2-rest-C:11-12`.
- **Stops that were nobody's error** (his word, the chair's order or ordering, the low-memory reaper, a lock yielded, no readable source). `p-l170-instr-B:165-167`; `p-l170-chase-A:158`; `p-l177-lean-lead-C:1`; `p-l180-lap1-C:1`; `p-l180-lap2-C:104`; `p-l182-lines-A:1`, `:36`, `:53`, `:76`, `:100`; `p-l185-skeleton-E:87`, `:115`; `p-l189-drops-C:89`; `p-l190-arms-C:1`, `:92`; `p-l195-arm-variants-C:145`; `p-l198-403-stall-B:63`, `:122`; `p-l199-voices-E:203`; `p-l202-idle-holder-guard-B:12`; `p-record-owner-A:64`; `p-l180-lap2-rest-C:9`; `p-run-frame-timer-mock-C:11`.
- **Registered falsifiers and bars recorded as HELD** (what C4 is out of; not counted). BEFORE: `p-l170-instr-B:140`; `p-l170-chase-A:148`; `p-l170-anim-C:14`; `p-l180-lap2-C:425`. AFTER: `p-d673-overtime-A:7` (F5); `p-record-owner-A:69`, `:78`; `p-l194-landing-train-B:73`, `:84`; `p-l199-voices-E:123`, `:252`; `p-gen-lap1-measure-B:106`; `p-l200-legs-C:67`.

### 3f. Appendix: every counted item

One line each: file and line, the count, a quote of at most 15 words, and a note. Every line was opened by me. [read]
**CARRY** in a note means the fault named lies in work the pane did before the line, by the hand-back's own words; the item is still counted where it was written.

**BEFORE, C1 (43)**

- `p-l168-setup-B_2026-11-12.md:56` — C1 — "My "no game running before each build" check did not work." — own check always read "none running"
- `p-l168-setup-B_2026-11-12.md:90` — C1 — "a quoting slip in a bash one-liner" — "That attempt is not counted."
- `p-l170-scale-E_2026-11-12.md:52` — C1 — "`lesser_max` is not "1 by default" for the whole run" — corrects its own L169 hand-back (also said at p-l169-games-E:204)
- `p-l170-scale-E_2026-11-12.md:53` — C1 — "I had not traced `prefer`." — second wrong claim of the same L169 section
- `p-l170-anim-C_2026-11-12.md:96` — C1 — "My first capture had no hunter in the look-behind." — under "Corrections (mine, all fixed before the commit)"
- `p-l170-anim-C_2026-11-12.md:97` — C1 — "My first outside camera stood beyond the corner's outer wall." — same heading
- `p-l170-anim-C_2026-11-12.md:98` — C1 — "My first full build failed" — same heading
- `p-l170-anim-C_2026-11-12.md:99` — C1 — "in my first suite run (wrong Visual Studio edition)" — same heading
- `p-l170-anim-C_2026-11-12.md:100` — C1 — "A shell script ate its backslashes" — same heading; "my standing hazard"
- `p-l170-anim-C_2026-11-12.md:151` — C1 — "A slip of my own, before the green run:" — first landing script stopped at once
- `p-l170-chase-A_2026-11-12.md:10` — C1 — "My registered estimate that P3 would pass the catch test (about 65 %) was wrong." — own registered estimate
- `p-l170-chase-A_2026-11-12.md:101` — C1 — "Two of my test bounds were wrong and were changed, by name:" — bound 1 of 2 (screen share)
- `p-l170-chase-A_2026-11-12.md:101` — C1 — "became nine of ten" — bound 2 of 2 (the SLIP row), same sentence
- `p-l170-chase-A_2026-11-12.md:102` — C1 — "Two runs of the pair arms were wrong and discarded" — run 1 of 2: the script word-split the speed text
- `p-l170-chase-A_2026-11-12.md:102` — C1 — "then two copies of the script raced" — run 2 of 2, same sentence
- `p-l170-chase-A_2026-11-12.md:103` — C1 — "my first build launch used plain `cmd /c` and built nothing" — under "Deviations, corrections, process"
- `p-l170-chase-A_2026-11-12.md:104` — C1 — "in strings written through the shell became a real newline" — "Escape collapse again" in its patch scripts
- `p-l171-movement-tech-E_2026-11-12.md:234` — C1 — "a first draft cited `:22-25`, which I had read on 8b04508 in L162" — own citation, fixed in place
- `p-l173-lean-C_2026-11-12.md:101` — C1 — "My first lean dead zone was on the lean angle;" — under "Corrections (mine)"
- `p-l173-lean-C_2026-11-12.md:102` — C1 — "My first green attempt broke the rate bar (123°/s);" — same heading
- `p-l173-lean-C_2026-11-12.md:103` — C1 — "my first build waited 30 minutes and gave up" — same heading
- `p-l174-fpbody-B_2026-11-12.md:63` — C1 — "The world: my before/after is NOT evidence." — own comparison withdrawn (the "before" ran on another build)
- `p-l174-fpbody-B_2026-11-12.md:70` — C1 — "The first landing failed to compile:" — under "Mistakes in this lap, said plainly"
- `p-l174-fpbody-B_2026-11-12.md:71` — C1 — "The arm row's first bar" — same heading; the bar registered at 2.5 was wrong
- `p-l174-fpbody-B_2026-11-12.md:73` — C1 — "written with LF endings" — script slip 1 of 3
- `p-l174-fpbody-B_2026-11-12.md:74` — C1 — "edits that turned a file's endings to LF" — script slip 2 of 3
- `p-l174-fpbody-B_2026-11-12.md:75` — C1 — "eaten by the shell." — script slip 3 of 3
- `p-l175-stairgap-E_2026-11-12.md:117` — C1 — "a first green run reported "16 open" after the fix" — "Mine, mid-lap"; the test did not build the chunk below
- `p-l175-stairgap-E_2026-11-12.md:118` — C1 — "so a "fix" run read a stale binary" — "Mine"; own retry loop
- `p-l180-lap2-C_2026-11-12.md:83` — C1 — "One expectation in it was my own arithmetic (h 0.96) and was corrected" — before the red commit
- `p-l180-lap2-C_2026-11-12.md:254` — C1 — "My one stray, a screenshot file misnamed by an unexpanded" — removed
- `p-l180-lap2-C_2026-11-12.md:335` — C1 — "cited first-game lines off by 2 to 5" — own sed, caught
- `p-l180-lap2-C_2026-11-12.md:371` — C1 — "So the row was a lucky draw." — own landed single-seed bar unsound; surfaced by the chair's ask after E's fix
- `p-l180-lap2-C_2026-11-12.md:469` — C1 — "failed to rewrite a backslashed output path" — "Correction": a scratch file overwritten
- `p-l185-skeleton-E_2026-11-12.md:74` — C1 — "It failed on the shoulders (8.6°, 2.5 cm past)." — under "Corrections (mine, all before landing)"; row 3 as first registered
- `p-l185-skeleton-E_2026-11-12.md:77` — C1 — "was first registered at 1 cm." — same heading; the glance bar
- `p-l185-skeleton-E_2026-11-12.md:78` — C1 — "A misread of my own:" — a figure read from a binary still holding a mutant
- `p-l185-skeleton-E_2026-11-12.md:114` — C1 — "NOT APPLIED 6." — own mutant harness path bug (listed again at :123 under "Corrections (step 2)")
- `p-l185-skeleton-E_2026-11-12.md:120` — C1 — "A segfault on the first run:" — under "Corrections (step 2)"
- `p-l185-skeleton-E_2026-11-12.md:121` — C1 — "My first idea for the 2.8 cm hip gap was the roll" — same heading; "not the cause"
- `p-l189-drops-C_2026-11-12.md:54` — C1 — "Nodes only." — cause 1 of "two causes, both mine" (:53)
- `p-l189-drops-C_2026-11-12.md:57` — C1 — "No geometry past the block's low x and z faces." — cause 2 of 2
- `p-l189-drops-C_2026-11-12.md:80` — C1 — "by my slip" — an intermediate run included storeys it should not have

**BEFORE, C2 (10)**

- `p-l170-instr-B_2026-11-12.md:180` — C2 — "holding the heavy-run lock until the librarian stopped it" — the librarian ended B's idle lock holder; ":178 The stall was mine."
- `p-l170-chase-A_2026-11-12.md:27` — C2 — "The slip estimator was wrong and is fixed:" — "B's finding, confirmed"
- `p-l170-chase-A_2026-11-12.md:28` — C2 — "B's reading is right." — B found A's scorer row red and why
- `p-l170-chase-A_2026-11-12.md:101` — C2 — "I first loosened to 0.4, which the librarian rightly refused" — the librarian refused A's loosened bound
- `p-l171-movement-tech-E_2026-11-12.md:159` — C2 — "a bend's cue comes from the psychedelic-distortion layer" — labelled "His correction" (item 136); supersedes E's section 6 cue
- `p-l171-movement-tech-E_2026-11-12.md:289` — C2 — "So his correction stands:" — the keeper's item 138; E's line in 8.2 superseded
- `p-l173-lean-C_2026-11-12.md:3` — C2 — "the hunter's lean was "glitchy back and forth", not easing into turns" — the keeper's item 146 on C's landed L170 lean
- `p-l177-lean-lead-C_2026-11-12.md:34` — C2 — "That is his "turn, and then lean", measured." — the keeper saw C's landed L173 lean lag the turn
- `p-l180-lap2-C_2026-11-12.md:296` — C2 — "The corner camera (the chair's ask 2): fixed in part, by eye." — the chair flagged lap 1's stills (camera inside a wall)
- `p-l186-physics-player-E_2026-11-12.md:85` — C2 — "His item 161 was right to strike the "never"." — the keeper struck E's L183 rule; E: "my inference from one line"

**BEFORE, C3 (18)**

- `p-l168-setup-B_2026-11-12.md:66` — C3 — "guard that fires" — the check of :56 redone as a working guard, at the chair's and the librarian's ring
- `p-l170-chase-A_2026-11-12.md:27` — C3 — "The re-run control reads" — control re-run after the estimator fix
- `p-l170-chase-A_2026-11-12.md:100` — C3 — "I changed one of my own bars before running it, in the open:" — own slip bars re-registered (also :26)
- `p-l170-chase-A_2026-11-12.md:101` — C3 — "became `> 0.08`" — own bound changed by name, 1 of 2 (the scorer row's screen share)
- `p-l170-chase-A_2026-11-12.md:101` — C3 — ""all ten routes arrive at rate 3" became nine of ten" — own bound changed by name, 2 of 2
- `p-l170-chase-A_2026-11-12.md:101` — C3 — "it is back at 0.2 with the cause fixed" — the row fixed a second time after the refused loosening
- `p-l170-chase-A_2026-11-12.md:102` — C3 — "The pair arms in the table were re-run once, alone" — re-run after the two wrong runs
- `p-l170-anim-C_2026-11-12.md:100` — C3 — "which I captured again after the fixes" — the first "before" set was deleted by the slip
- `p-l173-lean-C_2026-11-12.md:1` — C3 — "the hunter's lean eased (his item 146, "glitchy back and forth")" — the lap redoes L170's landed lean after his catch (:3)
- `p-l174-fpbody-B_2026-11-12.md:70` — C3 — "green before landing again." — first landing failed to compile; main put back; landed again
- `p-l174-fpbody-B_2026-11-12.md:30` — C3 — "The bar was changed after it failed, and why." — own registered bar 2.5 moved to 3.5
- `p-l175-stairgap-E_2026-11-12.md:38` — C3 — "Landing: FAILED once, reverted, and blocked on a decision" — landed on the second attempt (:73); the cause was two single-run rows of other seats
- `p-l177-lean-lead-C_2026-11-12.md:1` — C3 — "the lean from the corner ahead, built on a branch, not landed" — the lap redoes L173's lean timing after his catch (:34)
- `p-l180-lap1-C_2026-11-12.md:33` — C3 — "The timing bar was amended by name." — own registered bar passed on the base, so it was tightened
- `p-l185-skeleton-E_2026-11-12.md:76` — C3 — "Amended in the file, by name, with the reason:" — own row 3
- `p-l185-skeleton-E_2026-11-12.md:77` — C3 — "Set to 2 cm for glanced poses only, with the measurement in the file." — own glance bar re-set
- `p-l185-skeleton-E_2026-11-12.md:115` — C3 — "The rerun with the path fixed" — mutation pass run again after the invalid first pass
- `p-l189-drops-C_2026-11-12.md:65` — C3 — "This was added after attempt 1 showed it blind, and is said here, not hidden." — harness changed and the red-first run done again (:68)

**BEFORE, C4 (2)**

- `p-l170-chase-A_2026-11-12.md:8` — C4 — "The registered falsifier fired: no arm restores the catch bar" — also the table row at :93
- `p-l189-drops-C_2026-11-12.md:36` — C4 — "the harness was BLIND to the wide-well strip (said before anything was scored)" — the stop condition registered at :30-31 was met

**AFTER, C1 (46)**

- `p-l182-lines-A_2026-11-12.md:65` — C1 — "is not a result: it livelocks." — self-found defect in its own lever a4; CARRY (the lever was built on 2026-11-12)
- `p-l182-lines-A_2026-11-12.md:81` — C1 — ""1.33" is not in the paper" — corrects its own field text and E's L187 claim; CARRY (both written on 2026-11-12)
- `p-l182-lines-A_2026-11-12.md:130` — C1 — "is false for the circle family" — its own registered "speed 6 cells are the control"
- `p-record-owner-A_2026-11-13.md:58` — C1 — "but for a defect in the row itself" — own row 1
- `p-record-owner-A_2026-11-13.md:59` — C1 — "Two more defects of mine, found by running the rows and fixed in the rows" — defect 1 of 2 (row 3)
- `p-record-owner-A_2026-11-13.md:59` — C1 — "row 5 did not test that a model changed mid-run" — defect 2 of 2
- `p-l185-skeleton-E_2026-11-12.md:173` — C1 — "two small builds of the L193 tool (one source file each) ran at about 10:00Z" — "A slip of mine"; the same slip is said again at p-l193-yardstick-E:245, counted once
- `p-l188-fpbody-B_2026-11-13.md:74` — C1 — "The jog row was wrong, and is amended by name" — own registered row
- `p-l188-fpbody-B_2026-11-13.md:95` — C1 — "The code comment calls that "about a stride", which is wrong" — own comment, left for the next lap
- `p-l188-fpbody-B_2026-11-13.md:96` — C1 — "The first fix had gone 0 m/s into a wall." — own first fix of the backward clip
- `p-l192-footsteps-E_2026-11-13.md:189` — C1 — "message says "within 0.16 dB"." — under "8. Corrections"; own commit message figure
- `p-l192-footsteps-E_2026-11-13.md:191` — C1 — "My first diagnosis of the 2.8 starts" — "was wrong"
- `p-l192-footsteps-E_2026-11-13.md:193` — C1 — "My first footfall-by-footfall table counted 65 "footfalls" in 11 s" — the detector caught the hunter's tone
- `p-l192-footsteps-E_2026-11-13.md:195` — C1 — "by a wrong relative path." — a log written into the wrong folder
- `p-l192-footsteps-E_2026-11-13.md:221` — C1 — "the extra starts come mostly from the knock, not the thud's tail." — "Correction of §3": its second diagnosis was wrong too
- `p-l193-yardstick-E_2026-11-13.md:165` — C1 — "contradicted point 3 above" — its own registered hip bar "as written"; amended at the chair's 10:40Z ask (who saw it is not said)
- `p-l193-yardstick-E_2026-11-13.md:220` — C1 — "A mutant that does not compile proves nothing" — own mutant; "not counted as caught"
- `p-l193-yardstick-E_2026-11-13.md:238` — C1 — "the loader stopped at the first runner with no 2.5 m/s run;" — bug 1 of "Two bugs the first run on the real files found"
- `p-l193-yardstick-E_2026-11-13.md:239` — C1 — "it read every runner's stance as 0, because the force is NaN in the swing." — bug 2 of 2
- `p-l193-yardstick-E_2026-11-13.md:242` — C1 — "the lag's sign: the field read "move ours by"" — error 1 of "Two errors in my own test code"
- `p-l193-yardstick-E_2026-11-13.md:244` — C1 — "my first mirrored pose swapped the side labels, which made it no mirror at all." — error 2 of 2
- `p-l193-yardstick-E_2026-11-13.md:247` — C1 — "My first header line said "31 runners"" — one speed's count printed as the total
- `p-l193-yardstick-E_2026-11-13.md:253` — C1 — "What I said meanwhile was wrong:" — told the keeper and the board the build was queued or holding
- `p-l193-yardstick-E_2026-11-13.md:270` — C1 — "the first one FAILED, and is fixed." — own holder-look script
- `p-l193-yardstick-E_2026-11-13.md:361` — C1 — "I first wrote." — own runner count: "28" written, the tool counts 31 / 39 / 31
- `p-l194-landing-train-B_2026-11-13.md:123` — C1 — "It was not red." — own check sent a branch back with a false red
- `p-l194-landing-train-B_2026-11-13.md:130` — C1 — "The batch ran the credential scan only" — own omission against the plan
- `p-l194-landing-train-B_2026-11-13.md:135` — C1 — "as the branch" — own CLI bug (it read --config as the branch), found on first use
- `p-l195-arm-variants-C_2026-11-13.md:45` — C1 — "L191 eased the running shape toward the stand-in's hang" — cause 1 of "two causes" (:44) in its own L191 arm; CARRY
- `p-l195-arm-variants-C_2026-11-13.md:49` — C1 — "L191 tilted the forearm" — cause 2 of 2; CARRY
- `p-l195-arm-variants-C_2026-11-13.md:110` — C1 — "The look-back passes do not show the hunter." — fault in its own capture; "L191's look-back clips had the same fault"
- `p-l195-arm-variants-C_2026-11-13.md:116` — C1 — "The following camera still enters walls on the corner:" — its own L180 lap 2 fault, "wider than it said there"; CARRY
- `p-l195-arm-variants-C_2026-11-13.md:153` — C1 — "before it was computed, and corrected before the ring" — own flare bound first written as "about +4", really +8.25
- `p-l195-arm-variants-C_2026-11-13.md:197` — C1 — "This is a correction of the row against its own source" — its own L190 row measured in the wrong frame; CARRY
- `p-l195-arm-variants-C_2026-11-13.md:239` — C1 — "my runner's label carried an apostrophe and one red run never started" — under "Corrections on the way, said here"
- `p-l199-voices-E_2026-11-13.md:193` — C1 — "was reached for once, to list an archive." — under "7. Corrections and slips (mine)"; GNU tar
- `p-l199-voices-E_2026-11-13.md:195` — C1 — "My first Plaits setting nearly vanished above 150 Hz." — same heading
- `p-l199-voices-E_2026-11-13.md:197` — C1 — "Voice A's first level rule was wrong for it." — same heading
- `p-l199-voices-E_2026-11-13.md:284` — C1 — "The first S1 render was every sample pinned at full scale:" — own bug (pitch 0 gives NaN)
- `p-l199-voices-E_2026-11-13.md:337` — C1 — "The weights were built and rendered before the source read came back." — "Slip (mine)"; the packet said sources first
- `p-l199-voices-E_2026-11-13.md:342` — C1 — "threshold gap was written as "about 37 dB"; ISO 226's table gives 42.5." — figure 1 of "Two figures ... were wrong in my first draft" (:341)
- `p-l199-voices-E_2026-11-13.md:342` — C1 — "The onset rise was written as "about 16 dB";" — figure 2 of 2
- `p-l200-legs-C_2026-11-13.md:82` — C1 — "green attempt put the standing ankle 1.4 mm below rest height" — "My first" (:81)
- `p-l200-legs-C_2026-11-13.md:87` — C1 — "A kill of my own by command-line pattern also caught the first attempt's run" — under "Corrections on the way"
- `p-l202-idle-holder-guard-B_2026-11-13.md:63` — C1 — "to check an anchor RAN it (the module starts itself), and it held slot 1." — under "My faults on the way, owned on the board"
- `p-gen-lap2-kit-B_2026-11-13.md:16` — C1 — "unintended rerun of mine, stopped at 13:27Z." — it overwrote the check's log

**AFTER, C2 (5)**

- `p-l193-yardstick-E_2026-11-13.md:255` — C2 — "the librarian having stopped the idle cmd.exe" — the librarian ended E's idle lock holder (:248 "held lock slot 2 for 40 minutes and did nothing")
- `p-l195-arm-variants-C_2026-11-13.md:7` — C2 — "does look better, but the elbows should be flared out more" — the keeper's item 180 on C's L191 arms; C confirms at :26 "15° was asked"; CARRY
- `p-l195-arm-variants-C_2026-11-13.md:159` — C2 — "A correction to step 1, from E's yardstick" — E's measurement overturns C's "The bend at the back: no"
- `p-l198-403-stall-B_2026-11-13.md:58` — C2 — "Corrected at 10:4xZ (the chair's catch):" — B's struck claim about the installer
- `p-l202-idle-holder-guard-B_2026-11-13.md:65` — C2 — "The chair caught it." — B ran its mutants on the room's lock while the train waited

**AFTER, C3 (10)**

- `p-l182-lines-A_2026-11-12.md:69` — C3 — "The amended arm list (replaces a7 and a8 of the registration" — own registration amended because of the a4 defect; CARRY
- `p-l182-lines-A_2026-11-12.md:7` — C3 — "THE FIX, registered here before a2 or any grip arm has run" — bars re-registered with a new measure after the premise failed
- `p-l182-lines-A_2026-11-12.md:135` — C3 — "L182g, registered NOW, before the code: a reactive shuttle" — the search revised and run again after the failed blind check
- `p-l188-fpbody-B_2026-11-13.md:83` — C3 — "Seen red, then green, with the amended row" — own jog row amended by name (:74) and run again
- `p-l192-footsteps-E_2026-11-13.md:194` — C3 — "It was redone at the known instants, with the tone off." — the footfall table
- `p-l193-yardstick-E_2026-11-13.md:164` — C3 — "AMENDED 2026-11-13 04:4x local, before anyone tuned to it" — own registered hip bar
- `p-l195-arm-variants-C_2026-11-13.md:44` — C3 — "and the row found the second only after the first was fixed:" — step 2 redoes its own L191 arm after his item 180 (:7); CARRY
- `p-l195-arm-variants-C_2026-11-13.md:196` — C3 — "L190's row amended by name" — "a correction of the row against its own source"; CARRY
- `p-l199-voices-E_2026-11-13.md:286` — C3 — "re-rendered. No number above came from the broken render." — after the broken first render
- `p-l202-idle-holder-guard-B_2026-11-13.md:66` — C3 — "They then ran on a scratch data dir." — the mutant run done again after the chair's catch

**AFTER, C4 (4)**

- `p-l182-lines-A_2026-11-12.md:6` — C4 — "The brutal control RAN (L182f) and its registered PREMISE FAILED" — premise registered at :107
- `p-l182-lines-A_2026-11-12.md:127` — C4 — "Shuttle: NOT met: not one of the 72 runs is uncaught." — the registered blind-check bar; "I stop here as registered" (:119)
- `p-l182-lines-A_2026-11-12.md:138` — C4 — "it did not, so the registered fallback applies:" — the bar registered at :135 for the revised search, still unmet
- `p-l200-legs-C_2026-11-13.md:75` — C4 — "The falsifier tripped, by a little, and is said here:" — registration allowed about 20 numbers; the shapes use 24

**UNASSIGNED, C1 (3)**

- `p-l191-arm-shape-C_2026-11-13.md:72` — C1 — "Rows 3 and 4 first measured in the world frame." — under "Corrections on the way, said here"
- `p-l191-arm-shape-C_2026-11-13.md:74` — C1 — "The swing row's first green attempt was also in the world frame." — same heading
- `p-l191-arm-shape-C_2026-11-13.md:77` — C1 — "I first turned the hand in by bending the forearm sideways" — same heading

**UNASSIGNED, C2 (1)**

- `p-l191-arm-shape-C_2026-11-13.md:7` — C2 — "the arms are still not moving good" — the keeper's item 177 on C's L190 arms

**UNASSIGNED, C3 (1)**

- `p-l191-arm-shape-C_2026-11-13.md:79` — C3 — "is amended by name:" — own L190 row; its source (Otsuka) replaced by Bruening (:31)

## 4. What I did not open

- **The hand-backs whole, myself.** The four readers read all 46 files line by line. I opened the lines they reported and their neighbours, the 51 sweep hits, the opening lines of a few files, and the section headings through the section table. A slip that no reader reported and that none of the sweep's words touch is not in this count. [ours]
- **Anything the hand-backs point to:** the `_evidence` folders, scratch files and logs, the registration files in `exo_memory/loop/`, the plans and packets, the board, the stall traces, and the dreamzone-3 repository and its commits. So I did not check that any recorded correction is true, and a fault that nobody wrote down is not here at all.
- **The diffs of the hand-back commits.** I used commit times, subjects and attribution lines only. A reader ran `git show` on five small commits (`5f90902d`, `5f706708`, `e4a0105f`, `2dc6b874`, `905dee03`); I read their subjects in `git log`.
- **Other seats' records of the same nights:** the chair's and the librarian's notes beyond `librarian/2026-11-13.md:40-62` and the lines the greps returned, the Third Place's notes, `map/M.md` beyond `:1020`, and the handoff files. A catch of a pane's fault that lives only on the board or in another seat's notes is not in C2.
- **Hand-backs outside the two sets:** pane P's, the four desktop laps of 2026-11-11, `p-l205-stomp-C`, `p-l199-voice-ingame-E`, `p-spotcheck-sprintref-E`, and the desktop sections of `p-gen-lap2-kit-B` (lines 84 onward).
- **The harness's own record of each pane's effort or model.** The model column above is the commits' attribution line, and the 02:37 line is the librarian's note; I saw no log of the setting itself.
- **Scratch use, said plainly:** besides this file I wrote working tables (the blame table, the section table, the item list, the placement rules) in my session's scratch folder under the user's temp directory. Nothing else in the repository was written, and nothing was built, tested, installed, committed, pushed or sent.
