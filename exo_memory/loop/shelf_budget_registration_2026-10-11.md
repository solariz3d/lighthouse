# The shelf-budget bar, sealed before any code. Pane B, machine D, 2026-10-11, lap D296 part 1

Plan: `loop/plan_shelf_index_budget_d296_2026-10-11.md`, Part 1 (main `9041faf9`). The build is C's (Part 2), in `consonance/src-tauri/src/main.rs`.

**Sealing.** This file is committed alone, by named path, before C commits any code. It is not edited after that. A correction goes in a dated section at the foot, and anything changed after C's dispatch counts as a change to the bar (§6).

**Bias.** I wrote the one-hop count that moved this lap from "index all of handback/" to "cut the entry cost and index the unmapped hand-backs". So I have a stake in the build looking worthwhile, and I have set the falsifiers so they can fire against it.

## 0. Read this first: on the next librarian wake, the build is invisible
checked: `grep -o '"gates_mode"[^,}]*' ~/.consonance.json` → `"gates_mode": "light"`.

checked: `main.rs`:
- `librarian_intake()` (`:8309-8322`) returns `librarian_shelf_light()` whenever `intake_light()` is true.
- `intake_light()` reads the live config at intake time (`:2954-2962`).
- The light shelf (`:7986-8060`) is a FIXED SET:
  - every card is carried;
  - the seat's windowed notes are carried;
  - everything else is indexed **by directory, one line each, with no per-file entries** ("Nothing else is read into the shell however much room is left").

**So while `gates_mode` is light, neither the index window nor any entry this build adds appears in the librarian's CLAUDE.md.**
- inferred: the shelf on disk now (`instances/librarian/CLAUDE.md`, 2026-10-11T00:31:52Z, sha256 `23f628f5…`) is still the strict walk, because it predates the switch. The next wake after the keeper's restart will be light.
- Consequences for this bar:
  - §2's numbers can be measured only from a STRICT intake **dump** (the instrument in §4), not from a lived wake.
  - §3's lived falsifiers cannot start until a librarian wakes on the strict shelf.
  - **A build that ships while light holds is DORMANT.** Dormant is not success, and it must not be reported as success (§6).
- **This is the chair's to decide before dispatching C**, and the plan does not decide it. Three choices:
  1. Build on the strict walk as planned, and accept that the lived test waits until strict returns (after H3's light week, if it does).
  2. Also give the light shelf a per-file list of the recent unmapped hand-backs. That is a new budget on a shelf designed to have none: a keeper-facing change to D277 part 6.
  3. Defer the build until the mode question is settled.
  - The rest of this bar holds under choice 1 or 2. Under choice 2, §2 applies to the light dump as well.

## 1. Baseline, measured on the shelf the librarian woke on last (strict, 00:31Z)
checked: `scratchpad/d296b/baseline.js` on `instances/librarian/CLAUDE.md` and `G:\b-d296-wt` (`9041faf9`), under the heavy-run lock (`base-wt.out`; the main checkout's figures are in `base-main.out`):

| quantity | today |
|---|---|
| whole CLAUDE.md | **141,257 B**, 140,063 chars |
| head (brief + room + map pointer, before `# THE SHELF`) | 54,754 B |
| shelf header | 1,148 B |
| index section | 40,355 B: 298 entries. The **index tier** (map/journal/loop) is **207 entries, 29,784 B**; the other tiers are 91 entries, 10,375 B |
| window lines | 288 B |
| carried bodies | 44,713 B: **13 files, all cards** (header: "44177 of 44812 bytes") |
| dropped by the window | **515 entries, 73,810 B** (shelf header) |
| mean index-tier entry | **143.9 B**: path 34.6 + `(n lines)` 10.4 + **title 91.9** + framing 7.0 |
| hand-back .md files at `9041faf9` | 1,012 total. Mapped: 773, named by path or basename in `map/*.md`. **Unmapped: 239 = 64 top-level hand-backs + 175 `.md` files inside evidence folders** |

- **The "256" in the plan is my D294 figure, on `7f08f148`.** On `9041faf9` it is 239, and 231 on the main checkout with the uncommitted map lines.
- **Of these, 175 are not hand-backs:** they are files such as `…_evidence/out/scoreboard.md`.
  - inferred: the set worth indexing is the 64 top-level files (7 dated 08, 43 dated 09, 14 dated 10). At today's mean entry cost that is ≈ 9.2 KB of index; all 239 would cost ≈ 34.4 KB.
- The 64 is my rule (path or basename named in a map file), and C must apply the same rule. If C's count differs, that difference goes in C's hand-back, with the reason.

**The caps, as stated in `main.rs` (checked):**
- `HARNESS_CLAUDE_MD_CHAR_CAP = 150_000` (`:7269`), the host's own limit on CLAUDE.md in chars.
- `LIBRARIAN_INTAKE_LIMIT = HARNESS_CLAUDE_MD_CHAR_CAP` (`:7249`), applied in BYTES, the conservative side.
- `INTAKE_HEADROOM = 8_000` (`:7006`), and `LIBRARIAN_INDEX_BUDGET = 30_000` (`:7451`).
- The shelf is self-limiting. The bodies get `LIMIT − HEADROOM − (head + floor)` (`librarian_shelf_room`, `:7975`), so the file converges on **142,000 B** whatever the index does. Today it is 743 B under that.

## 2. Success, in numbers
Measure every figure **on the same tree at the same moment**: the strict intake dumped by the old code (`9041faf9`) and by C's code, against one live `exo_memory`. A before taken today against an after taken later on a bigger corpus is not a comparison (§6). All five must hold:

| # | measure | bar |
|---|---|---|
| S1 | index-tier entries listed / dropped by the window | listed **207 → ≥ 300**, and dropped falls by at least the same amount, net of any hand-back entries added (515 → ≤ 422 on the same tree) |
| S2 | the unmapped top-level hand-backs | **every** one whose name is dated in the 14 days before the dump is listed, and **≥ 80%** of all of them (of 64 at `9041faf9`, or of C's re-count on the dump tree). **0** mapped hand-backs listed (no double route). **0** `.md` files from inside evidence folders listed |
| S3 | index-tier bytes | **≤ `LIBRARIAN_INDEX_BUDGET`, 30,000 unchanged.** If C raises it, see §2.1, which decides whether that counts |
| S4 | whole CLAUDE.md | **≤ 142,000 B** (`LIBRARIAN_INTAKE_LIMIT − INTAKE_HEADROOM`) and **< 150,000 chars**; `the_librarian_intake_fits_under_the_limit_it_must_obey` (`:16512`) green. This is a guard, not a success: the shelf fills to it either way |
| S5 | legibility of a shortened entry | no path is truncated. A cut title ends at a word boundary with a visible mark, and an entry with no title says so. The non-author read (mine) judges this on the dump itself, entry by entry, on a seeded sample of 30 |

### 2.1 Raising the budget: allowed only if no card leaves the shelf, which leaves ≈ 600 B
- **The trade.** Every byte added to `LIBRARIAN_INDEX_BUDGET` is a byte taken from the carried bodies (§1, self-limiting). Today the bodies are the 13 cards, with 635 B of slack (44,812 room, 44,177 spent).
  - inferred: so a raise beyond ≈ 635 B moves a card from carried to indexed.
  - Cards are carried FIRST by deliberate ruling (`main.rs`, the `order` comment: "they are the instruments … the tier the room's own first principle says must be in front of a seat").
- **Why a bigger raise would be cheating the measure.** S1 would improve by construction, and the cost would land on a measure this bar does not score.
- **So a raise counts toward S3 only if:**
  - the same 13 card paths are still carried in full on the after-dump; and
  - the strict FLOOR stays ≤ 85% of the cap (127,500 B), the margin `LIBRARIAN_INDEX_BUDGET`'s comment exists to protect.
  - inferred: today's floor is head 54,754 + header 1,148 + index 40,355 + window 288 = 96,545 B (64.4%). The head was 84,924 on 09-20, and if it grows back the floor margin binds again.
- **The real lever is the entry cost.** The title is 64% of an entry (91.9 of 143.9 B).

## 3. The falsifiers: did the build help reach?
They run on the first librarian wake on a shelf built by C's code in STRICT mode. W0 is that shelf file's mtime, and the window is **14 days from W0**.
- **Instrument:** `scratchpad/d294b/opens.js`'s counting rule, fixed here so it cannot drift:
  - an OPEN is a `Read` tool_use in a librarian transcript (`~/.claude/projects/C--Consonance-instances-librarian*`) whose `file_path`, with `\` changed to `/` and lower-cased, ends in `exo_memory/<rel>`;
  - its timestamp must be ≥ W0;
  - Third Place transcripts are never scanned.
  - A copy of opens.js taking `--since W0` and an entry list is the only change allowed; the rule above does not change.
- **NEW** = entries listed on the W0 shelf and not on today's (the 298 in `23f628f5…`). **OLD** = the 207 index-tier entries listed today.

| # | falsifier | fires when | otherwise |
|---|---|---|---|
| F1 | reach | the librarian opens **0** NEW entries in the window: the build did not help reach | **≥ 3** opens: helped. 1–2: undecided, not rounded up |
| F2 | legibility cost | the librarian's open rate on OLD entries falls **below 4.1%** (half of today's 17/207 = 8.2%, D294's `opens.out`): shorter entries cost more reach than the window freed | at or above: no measured cost |
| F3 | the hand-back half | **0** of the newly listed unmapped hand-backs are opened by the librarian: that half did not help, because they are reached some other way or never wanted | ≥ 1: report the count |

- **The bar on F1 is deliberately low, and here is why.** NEW entries are older files (the window drops the OLDEST, dated 08-11 → 09-28), and older files are opened less whatever the shelf does. D294's 0/515 is confounded with age in the same way.
  - So F1 can kill the build but cannot confirm it strongly. A pass reads "not refuted", never "reach restored".
- **Corroboration that does not fire anything:** C's `reach.js` shelf unit on the W0 shelf (on the main checkout, because of the mtime filter), set beside D294's 23.73% dropped and 72.50% unpointed.

## 4. What I will compare in C's hand-back (`handback/p-shelfbudget-C_2026-10-11.md`)
1. **The two dumps,** strict, same tree, same moment.
   - The command: `INTAKE_DUMP_DIR=<dir> cargo test --bin consonance dump_intakes_for_measure -- --ignored` (`main.rs:8285-8299`), once on `9041faf9` and once on C's commit, each in its own target dir, under the heavy-run lock.
   - Both files' sha256 and sizes. I re-run `baseline.js` on both and check S1–S4 myself.
2. **S2's list:** the unmapped set C computed and the rule it used, set beside my 64. Every listed hand-back is checked against `map/*.md`.
3. **The entry anatomy before and after:** mean path, title and framing bytes, and the title rule.
4. **Any change to `LIBRARIAN_INDEX_BUDGET`,** with the 13-card check and the floor figure from §2.1.
5. **The red-first rows the plan names,** each seen red on `9041faf9`:
   - a dropped entry is listed after the change;
   - a mapped hand-back is NOT listed;
   - the budget is never exceeded;
   - empty `handback/`, and missing `map/`;
   - **plus one I add: an evidence-folder `.md` is not listed.**
   - The full `cargo test` count, under the lock.
6. **The light dump too,** unchanged byte for byte unless the chair chose §0 choice 2.
7. **Which §0 choice the chair made,** written in C's hand-back.

## 5. The unwelcome outcome, in the words that would make it true
*The window shrank, the dumps show every number met, and in the 14 days after the first strict wake the librarian opened none of the newly listed files.*

Or, under light: *the build shipped and changed nothing any seat read, because the shelf it changed was not the shelf the librarian woke on.*

## 6. The test is degenerate if
1. The bar is edited after C's dispatch, other than in a dated foot section saying so.
2. S1–S4 are measured on different trees or different days without a same-moment before.
3. The budget is raised past §2.1's terms and the gain is counted.
4. A dormant build (light mode, no strict wake) is reported as meeting §3.
5. F1–F3 count opens by any seat instead of the librarian, or by grep or `cat` instead of `Read`.
6. Titles are cut and S5 is judged from the code rather than from the dump.

## 7. Cost
- inferred: Part 2 is one Rust change plus two cargo builds in separate target dirs (minutes each under the lock) and two intake dumps.
- My read of C's hand-back is under an hour.
- The lived falsifiers cost nothing to wait for. They cost a single opens.js run on day 14, and they need a strict wake to exist.

## Correction, 2026-10-11 08:5x, by the scorer (librarian), AFTER the result — not by the bar's author
- **S1 as registered: MISSED** (record listed 208 → 267; dropped 523 → 464). That reading stands and is not replaced.
- **The defect:** S1 ("record listed ≥ 300, net of any hand-back entries") and S2 (list every unmapped hand-back) draw on one 30,000-B tier, and S1's target never subtracted S2's price, which §1 itself estimated at ≈ 9.2 KB. B showed it with C's walk sim validated against the base dump (208/523 exact): at cap 40, without the hand-backs the same build lists 323 record entries; with them, 266. No cap passes S1-as-written and S5 together (S5 breaks between 40 and 32; `handback/p-d296read-B_2026-10-11.md` §2–§3).
- **The corrected reading, kept BESIDE the registered one:** every index-tier entry the window decides (record + unmapped hand-backs) against the same 300: **208 → 323, met.**
- This is a re-rule after the result, which §6.1 forbids doing silently; it is done openly here, and the case is arithmetic (the bar's own §1 price), not direction. Both readings are scored in `loop/plan_shelf_index_budget_d296_2026-10-11.md`.
- **S5's pass line (3 in 4 legible) was set at read time** by B, after the bar named none. Recorded so it can be argued with.
