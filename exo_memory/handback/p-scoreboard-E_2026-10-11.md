# p-scoreboard-E · D294 part 1 (ledger row D295): the catch scoreboard, 09-01 → 10-11 · pane E, on D, 2026-10-11 · MEASURE ONLY

Plan: `exo_memory/loop/plan_retrieval_now_d294_2026-10-11.md`, Part 1 (main `7f08f148`). I read lines 1–26 only; I did NOT open the sealed P1/P2 section
(`:27` on), before the table or after it.
**Result: lighthouse `c8f43c74` + `d76c3b56` on `7f08f148`, branch `d294-e`, worktree `G:\worktrees\e-d294-wt`. Not pushed. Nothing outside
`exo_memory/handback/p-scoreboard-E_2026-10-11_evidence/` changed.** Every run was under the heavy-run lock, through main's `heavy-run.js` by absolute path.

## 0. The answer, first
| finder | what the record shows, 09-01 → 10-11 |
|---|---|
| **instrument in-stream, gates** | **0 catches in 383 gate refusals** (B's rule: the re-send must correct a claim that was WRONG). 174 re-sends changed; I read all 174. 20 dropped or softened a figure or state claim the seat had not checked, and none was shown wrong. 1 fixed a pointer that did not resolve (mine). 3 are borderline, for B (§3). |
| **instrument in-stream, tests, mutants, ratchets** | 82 rows by the lexical rule. **About 133 by the audit (§4), ~19% of the hand-back catches.** |
| **seat after the fact** | Nearly everything else: 86 of the librarian's 101 WRONG entries, and about 550 of about 690 hand-back catches. |
| **keeper** | **14 of 101** WRONG entries (14%, Wilson 95% 0.08–0.22), plus 3 in the journal. **0** in the hand-back corrections, by construction: a pane's corrections section records what it found itself. |

inferred: the finder has **not** shifted toward the instrument since the gates went in.
- The paperwork gates (SOURCES 10-02, reply slot 10-03, trailers 09-16) are 0 for 383 here, as they were 0 for 38 in B's 10-08→10-09 count.
- The test/mutant share of the hand-back corrections has no rising trend by week.
- Where the gates did change what was sent, the usual change was a figure DROPPED, not a figure corrected. The wrong claims that passed a gate went on to be caught by a seat, e.g. the librarian's 10-10 "B hasn't started its half": refused by SOURCES at 15:43, re-sent with the claim intact, and caught by the chair (§3).

## 1. Method, and why a script and not catch-ledger.js
- **Why a script.** `catch-ledger.js` reads only `muscle_map.md` and `journal/*.md`, and its header (`:69-76`) defers on every other corpus rather than give the
  room two disagreeing gauges. The three new sources are not prose of that kind: one needs transcript pairing. Extending it would have changed what that tool
  is, so the cheap path was the evidence script the plan allows. **`catch-ledger.js` and its test are untouched.** Its events in the window are imported as
  source L, with its buckets mapped (self, committee → seat).
- **Files** (`exo_memory/handback/p-scoreboard-E_2026-10-11_evidence/`):
  - `scoreboard.js`: the sources and the tables; read-only on every input.
  - `diffs.js`: the removed and added words of every changed re-send, written to scratch only, because it quotes other seats.
  - `adjudicated.json`: my reading of every changed gate pair.
  - `w-overrides.json`: hand corrections to the WRONG extraction, each with its reason.
  - `sample.js`: the seeded audit sample.
  - `out/scoreboard.md` and `out/rows.tsv`: the tables, and one row per count with `file:line` (or, for a gate row, the transcript session and timestamp).
- **Run:** `node --max-old-space-size=4096 scoreboard.js --repo <worktree at 7f08f148> --data C:/Consonance/data --projects ~/.claude/projects --out out --scratch <scratch>`.
  It takes 7 s. `out/rows.tsv` sha256 `259097951da7ab7d…`; `out/scoreboard.md` sha256 `f4f5b25d7bb18845…`.
- **Sources** (one FINDER per row):
  - **L:** `catch-ledger.js --json`, windows 09-01 to 10-11: 9 events. The journal stops at 09-22.
  - **W:** the librarian's WRONG entries, `exo_memory/librarian/2026-*.md`. They are read per occurrence, and numbered entries count once per number.
    - **All 101 rows were read by hand.** 7 finders were corrected and 3 entries added, one of them the uncommitted 10-10 line (see the bound in §5). 1 match was dropped (a quote of an 08-25 entry).
    - The desktop and laptop columns re-used numbers: WRONG 71 is two different errors, added by hand.
  - **H:** every top-level item under a "Correction(s)" heading or bold lead in `exo_memory/handback/*_2026-09|10-*.md`: 339 sections in 295 hand-backs, 985 items. The finder is lexical, and §4 audits it.
  - **G:** every refused ring or dispatch call and every REPLY SLOT block, from the senders' own transcripts, paired with its re-send. Message text is compared with
    the SOURCES / NEXT / OUTPUT lines stripped. This is B's D276 method (`loop/loop_friction_B_2026-10-09.md:36-60`), extended back to 09-01 and on to 10-11.
    - Check against the logs: 175 SOURCES refusals found against **175** deny rows in `sources-gate.jsonl`, and 47 REPLY SLOT blocks against **47** `blocked` rows in `reply-slot.jsonl`.
- **Weeks** start Monday and are labelled by their Monday. 09-01 falls in the week of 08-31.

## 2. The table: week × finder (from `out/scoreboard.md`)
**All sources (L + W + H + adjudicated G), NOT de-duplicated across sources:**

| week of | keeper | seat | instrument | unattributed | total |
|---|---:|---:|---:|---:|---:|
| 2026-08-31 | 5 | 115 | 7 | 4 | 131 |
| 2026-09-07 | 0 | 81 | 1 | 0 | 82 |
| 2026-09-14 | 5 | 162 | 36 | 0 | 203 |
| 2026-09-21 | 4 | 247 | 10 | 0 | 261 |
| 2026-09-28 | 2 | 129 | 16 | 0 | 147 |
| 2026-10-05 | 1 | 257 | 12 | 1 | 271 |
| **all** | **17** | **991** | **82** | **5** | **1095** |

**W, the librarian's WRONG column (every row read by hand), the cleanest source:**

| week of | keeper | seat | instrument | unattributed | total |
|---|---:|---:|---:|---:|---:|
| 2026-08-31 | 3 | 22 | 0 | 0 | 25 |
| 2026-09-07 | 0 | 27 | 0 | 0 | 27 |
| 2026-09-14 | 5 | 16 | 0 | 0 | 21 |
| 2026-09-21 | 3 | 13 | 0 | 0 | 16 |
| 2026-09-28 | 2 | 7 | 0 | 0 | 9 |
| 2026-10-05 | 1 | 1 | 0 | 1 | 3 |
| **all** | **14** | **86** | **0** | **1** | **101** |

**H, the hand-backs' corrections sections (lexical finder; audited in §4):** 0 keeper · 903 seat · 82 instrument · 985 total. By week: 98 / 55 / 182 / 244 / 138 / 268,
with instrument 7 / 1 / 36 / 10 / 16 / 12.
**L, catch-ledger:** 3 keeper · 2 seat · 4 unattributed, all on or before 09-22.

inferred: the W column thins out (25 → 27 → 21 → 16 → 9 → 3 a week). The numbered column stopped at WRONG 110 on 09-16, and later entries are prose bullets, so this
reads as fewer WRONGs written down, not fewer errors made. Nothing here can tell those apart.

## 3. The gates, every refusal (from the senders' transcripts)
| gate | refusals | paired | re-send same | changed | C catch | B borderline | P pointer fixed | D figure dropped | L content lost | T probe | W wording/other |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| SOURCES | 175 | 174 | 105 | 69 | 0 | 1 | 0 | 9 | 0 | 4 | 55 |
| REPLY SLOT | 47 | 47 | 18 | 29 | 0 | 1 | 0 | 9 | 0 | 0 | 19 |
| NEXT trailer | 48 | 48 | 23 | 25 | 0 | 0 | 0 | 0 | 0 | 2 | 23 |
| OUT OF TURN (baton) | 81 | 71 | 34 | 37 | 0 | 1 | 0 | 2 | 0 | 0 | 34 |
| other (ring-digest gate, bad chair token, seal gate) | 32 | 30 | 16 | 14 | 0 | 0 | 1 | 0 | 1 | 2 | 10 |
| **all** | **383** | 370 | 196 | **174** | **0** | 3 | 1 | 20 | 1 | 8 | 141 |

**The three borderline pairs, for B to rule** (the reasons are in `adjudicated.json`):
- **chair 09-09T07:51Z.** The re-send after an OUT OF TURN refusal ADDS a correction of an EARLIER packet. The refusal was about the baton, so the finder reads as the chair.
- **chair 10-04T10:55Z.** "before your verdict" became "your GREEN … stands as a record". B's verdict arrived during the 111 s delay. A stale claim was corrected from new information.
- **chair 10-07T02:11Z.** The reply slot made "on the new BIOS-safe footing as far as my side goes" into "it isn't safe to flash yet". The first already deferred to the librarian.

**One wrong claim went through a gate intact.** Librarian, 10-10T15:43Z:
- refused by SOURCES; the re-send kept "B's are not … Dispatch step 6 to B now";
- the chair caught it (`librarian/2026-10-06.desktop.md:123`, uncommitted, W row added by hand).

**Not catches, counted beside:**
- **second reader:** 876 rows, 412 flagged, 981 flags, 10-01 → 10-11. It is in SHADOW (`consonance/hooks/second-reader.js:1-6`: it never blocks or alters a ring), so a flag reaches nobody in-stream. Not adjudicated here.
- **push gate and delete gate:** 2 push denies and 3 delete denies, all mine on 10-06, planted probes (a test key and a planted junction): 0 catches.
- **dispatch gate:** 50 `asked` rows, the last 09-09. An "asked" was a permission prompt to the keeper; a dispatch he approved went through unchanged and leaves no refusal to pair. Not counted.

**B's P-16 is a pairing disagreement, not settled here.** B's next accepted re-send of the librarian's 10-09T08:54Z ring had no body. The most similar accepted call within 15 min (B's own re-pair rule, Jaccard ≥ 0.68) carries the body, 1,250 chars, 16 s later. Both may be true: two sends.

## 4. The audit of the lexical finder (H), seeded (`sample.js <rows.tsv> H <rule> <n> 294`)
| rule | rows | audited | real catches | of those, really instrument | really seat |
|---|---:|---:|---:|---:|---:|
| default (seat) | 896 | 40 | **27** (0.52–0.80) | 4 (0.06–0.32 of catches) | 23 |
| instrument | 82 | 25 | 23 | **13** (0.33–0.70) | 10 |
| named seat | 7 | 7 (all) | 7 | 1 (a safety check refused) | 6 |

- **Estimate:** about 687 real catches in H, about 133 of them instrument (19.4%), about 550 seat, and 0 keeper.
  - Arithmetic: 896×27/40 + 82×23/25 + 7 = 687, and 896×4/40 + 82×13/25 + 1 = 133.
- **Where the rule fails:**
  - **Section detection overreaches.** A heading that merely contains "correction" ("My own probes … after the correction in §4") is read as a section, and lists that run past the section's end are kept.
  - **A heading with three corrections counts as one.**
  - **The instrument rule misses** "survivor", "died", "a safety check refused" and "disarmed a mutant".
  - **It also over-fires** on "would have survived its own mutant", which was reasoning, not a run.
- The W rows needed no estimate: all 101 were read.

## 5. Bounds: what this does NOT cover
- **No de-duplication across sources.** One catch can sit in W, H and L at once. Within W, numbered entries count once each.
- **The keeper's catches outside these files are not counted:** the chair's handoffs, the board, and replies to the keeper. The 14% is the WRONG column's share,
  not the room's.
- **Only the six sessions with SOURCES or REPLY SLOT refusals were scanned for gate refusals** (A, B, C, E, chair, librarian). A seat session that only had
  older refusals (OUT OF TURN, the trailer gate in September) in another transcript would be missed.
- **The base is `7f08f148`.** Uncommitted lines in the main checkout are out of scope except the one librarian entry added by hand. Five rows from C's and A's
  in-flight D294 hand-backs were left out: they belong to this lap.
- **What B's D276 count measured was the work checks (132 defects in a day).** This scoreboard reads correction records, which see only the catches someone wrote
  down as a correction. The two are not comparable, and I did not re-derive B's.

## 6. Corrections to myself
- **First W pass:** 96 rows. Bare tallies ("**WRONG +1.**"), "WRONG: not this seat's column" and day summaries were counted as entries, and the defining "WRONG +2, finder: the Third Place" was missed. Rebuilt to read per occurrence, with the finder judged on the entry's own text, not the whole line; then every row was read.
- **The first run read the committed base only**, and missed the librarian's 10-10 entry, which is uncommitted in main. Added by hand, labelled as such (`d76c3b56`).
- **I wrote two things into committed files that should not be there, and took them out before committing:**
  - a key-shape label from the push-gate log in `scoreboard.md`;
  - a private name in the excerpt filter. It is now matched by its sha256, and one excerpt is withheld.
  - The strict scan reads 0 on every committed file.
- **I created the evidence folder in the main checkout first.** It was empty; I removed it and made it in the worktree.

Checked:
- `git -C G:/worktrees/e-d294-wt log -2 --format=%h` → `d76c3b56`, `c8f43c74`;
- `node consonance/tools/portable-paths.js`, after commit → green: 380 files, 455 known sites, 0 new.

NEXT: B read this hand-back, then the librarian scores D294 against P1/P2, when all three D294 hand-backs are in
