# D297 part 2 (ledger D298): strip a leading lap/ledger label before the title is cut. Pane C (sibling-0845a868), machine D, 2026-10-11

Plan: `loop/plan_retrieval_next_d297_2026-10-11.md`, part 2 (main `5d5740b4`). Bar: B's `loop/label_strip_registration_2026-10-11.md`, sealed on `d297-b` at `ba283df6` (checked: `git show d297-b:…` before my first code commit).

**Branch `d297-c`** (worktree `G:/worktrees/c-d297-wt`, from `5d5740b4`), not pushed:
- `30f78d0b` the build: `strip_lead_label`, `is_ledger_id`, `path_shows` in `consonance/src-tauri/src/main.rs`, called from `index_entry_line`; seven rows in `index_title_tests`.
- `dff6810b` two more rows that pin the ledger-id shape (see §4).
- `6a23c766` the evidence: `handback/p-labelstrip-C_2026-10-11_evidence/`.

**It stays dormant.** `index_entry_line` is called only by the strict walk (checked: `grep -n "index_title(\|index_entry_line("` → callers at `:7866` and `:7908`, both before `librarian_shelf` at `:8052`; the light shelf starts at `:8094` and calls neither). The light and pane dumps are byte-identical between base and new once the worktree name is normalised (§3).

**Headline (inferred: B judges legibility).** The rule is narrow and lossless, and it **does not reach B's six**. It changes 81 of the 412 index titles and loses no word the path does not show. Of B's six illegible titles it changes only #8, and I would not call #8 legible yet. My reading of the bar is that **T1 stays at 22 or 23/28 and F-a fires**. The reason is in §1: five of the six do not fail on a lap/ledger label.

## 1. The rule, and why it misses B's six
A heading longer than `INDEX_TITLE_CHARS` (40) loses its leading label when all of the following hold:
- **every word** in the label is one of:
  - a ledger id: one or two capitals, 1-4 digits and an optional lowercase letter (`D177`, `Q3`, `P1b`, `L025`), or a packet code `P-` plus dash-joined runs of capitals and digits (`P-L113-READER`). Parentheses and a trailing `,` `:` `)` are trimmed first, so `(L025)` is an id.
  - a qualifier (`packet`, `part`, `item`, `step`, `pane`, `lap`) followed by an argument of 1-3 letters or digits (`packet C`, `item 2`).
  - a word the path already shows: its letters and digits, lowercased, either equal a path token or begin with a path token of 4 or more characters (B's §3 rule, so `PREREG` shows "PRE-REGISTRATION").
- the label holds **at least one ledger id**;
- it **ends at a separator**: a word ending in `:`, or a lone `—`, `–` or `·`;
- **something remains** after it. If nothing would, the whole heading is cut as before, so a title that was all label never prints `(no title)`.

The first word that fits none of these leaves the heading whole. A heading within the cap keeps its label, since nothing is cut.

**Why "it can't eat a real title word":** a stripped word has to be an id shape (no English word has one, and `T-180` doesn't), a qualifier attached to an id, or a word the path already prints beside the title. Checked mechanically, independently of `main.rs`: `compare.js` §T6 recomputes each stripped prefix from the dump and the full heading, and finds **0 violations in 81** (§3).

**B's six, against the rule** (rows in `index_title_tests`, verbatim headings):
| # | heading starts | what the rule does | why |
|---|---|---|---|
| 2 | "PRE-REGISTRATION — do the seat's own …" | nothing | no ledger id; a document kind is not a lap label |
| 8 | "Q3 read: Jev (typesafe/jev-1.13-20260917, …" | strips "Q3 read: " | `Q3` is an id, `read` is in the path. The new title is "Jev (typesafe/jev-1.13-20260917 ...": the 40 chars go to a model id, so I expect it still illegible |
| 12 | "QS2S units v2, D217 (is seat Y correcting seat X?) — …" | nothing | the claim follows the id in parentheses, with no separator between. B's §3 says that parenthetical is the claim, so it can't be part of a label |
| 18 | "Battery run 2 — the sealed rows … **NOT FOR LANDING …**" | nothing | no ledger id, and the loss is at the tail |
| 20 | "Consonance consumer: bring it up to …" | nothing | no ledger id; B's §3 forbids losing "Consonance" |
| 27 | "D177, packet C (reordered first): rigid …" | nothing | "reordered" and "first" are words no path token shows |

**Where B's bar and the chair's brief part:** B's §3 allows a parenthetical inside a label to go, naming "(reordered first)". The chair's brief asked for a rule that can't eat a real title word, and "reordered first" is two real words. I kept the brief. One clause would fix #27 under B's bar: "a parenthetical directly before the separator may go". In the D296 survey (`sim.js` V2 against V1) that clause adds 9 strips, and 8 of the 9 are already taken by this rule word by word (`(C)`, `(L025)`, `(L024)`). So #27 is the only entry it would change, and it is the librarian's call. #12 needs a strip that ends without a separator, and I would argue against that: it is how a label eats a claim.

**Is stripping wrong?** No. The 81 changed titles mostly gain their claim (`compare.out` lists every one, old and new). Examples:
- "D256 item 2: what "always max speed" ..." → "what "always max speed" would change ...";
- "P-INDICATOR (L025) — the loop indicator ..." → "the loop indicator in the UI";
- "D173, packet C: the procedural texture ..." → "the procedural texture maker ...".

It is just not the fix for these six. The six fail on four different things: a document-kind word, a model id after the label, a claim in parentheses, and a tail.

## 2. Red first, then green
- **Run on `5d5740b4`'s implementation** (rows added, code not yet changed; `red-first.log`): 10 rows, 2 FAILED.
  - Red: `a_ledger_label_the_path_carries_is_stripped_before_the_cut` (holds #8, plus #16, #21, #22 and #4 of B's sample) and `a_path_token_of_four_or_more_chars_shows_a_word_it_begins`.
  - Green on old code **by design**: the five rows that say what is NOT stripped (#27, #12, #2, #18, #20, `T-180`, and the within-cap and all-label rows). They cannot be red before a change that adds stripping. The mutants hold them instead (§4). So of "red-first rows on B's six", only #8's row can be red-first, and it was.
- **Green on `30f78d0b`** (`green.log`): `index_title_tests` 10/10, and the D296 `shelf_` rows 35/35.
- **On `dff6810b`:** 12/12 (the mutant control, `mut.log`).
- The build warnings are all pre-existing, at `main.rs:14769`, `:15027` and `cochlea.rs:3004`/`:3157`, none in my lines.

## 3. The re-dump, the D296 way
- **Method:** `dump3.sh` follows `dump2.sh`, but does NOT re-take the snapshot. `G:/consonance-scratch/c-d296/snap` (6,834 files) is mirrored into `G:/worktrees/c-d297-base` (`5d5740b4`) and `c-d297-wt` (`30f78d0b`), each tree is dumped (base 19:32:20Z, new 19:33:02Z, with `CARGO_TARGET_DIR` on G:), both trees are diff-checked equal to the snapshot after the dump, and both are restored to 0 dirty (`dump.log`).
- **`dff6810b` changes only test rows,** so the non-test code is the same as in the `30f78d0b` dump.

**As-dumped, `G:/consonance-scratch/c-d297/`:**
| file | sha256 | bytes |
|---|---|---|
| base3/librarian.strict.md | `ca74a9c4fd507312bf02815e00ccea20a84a27adccfa5cebe81d542ec4b05961` | 141,255 |
| new3/librarian.strict.md | `07e06d93822668301fd5f393fa2856b1beb6fe81fed0cb8883a9b8b36cb796c6` | 141,658 |
| base3/librarian.light.md | `c0ee8ee9aac70bee0ec809c8e8a685d6c5921412f943e9454844082f90cff760` | 104,411 |
| new3/librarian.light.md | `87b1b5d2774927f872480fc729b054cfa647c972a1bee6ae5fa50b574f88a0b5` | 104,369 |

The committed copies in the evidence folder were converted CRLF→LF by git, as in D296:
- base3 is git-blob `0845e187`, sha256 `1090812e…94c6`;
- new3 is git-blob `6f847d3b`, sha256 `2cf6ea44…78b6`.

B should read the as-dumped files.

**B's §1 base check:** base3 strict equals D296 `new2` strict except in two places, once the worktree name is normalised (`diff` with `sed 's#c-d29[67]-(base|wt)#WT#'`):
- line 322, where the body room is 47,475 instead of 47,477;
- the file is 2 B larger (141,255 against 141,253).

Both come from the base worktree's name, `c-d297-base`, which is 2 characters longer than `c-d296-wt`. The path rides in the head, and the body room is a remainder of it. Nothing else differs.

**Dormancy:** `librarian.light.md`, `pane-C.light.md` and `pane-C.strict.md` are each identical between base3 and new3 once normalised.

**The numbers** (`measure.out`, D296's `measure.js` on base3/new3; `compare.out`, `compare.js`):
| | base3 | new3 | B's bar |
|---|---|---|---|
| T3 record listed (map/journal/loop) / dropped | 267 / 464 | **268 / 463** | ≥ 267, ≤ 464: holds |
| T4 unmapped hand-backs | 56/56, 0 mapped, 0 nested | **56/56, 0, 0** | holds |
| S3 index bytes (record + hand-backs) | 29,975 | **29,919** | ≤ 30,000: holds |
| S4 whole file | 141,255 B / 139,957 ch | **141,658 B / 140,456 ch** | ≤ 142,000 B, < 150,000: holds |
| T5 over the 413 new index lines | | 353 cut; 0 over 40 chars; 0 ending in punctuation or a space; 13 `(no title)`, 0 of them with a heading | holds |
| T6 loss check over every changed title | | **0 violations in 81** | holds |
| titles changed | | 81 of 412 | |
| of those, a ledger id the path does not carry is lost | | 26 (e.g. `D277` in `p-load-census-C`, `L025` in `p-cut-read`) | allowed by B §3 (ledger class) |

- **New in the index:** `loop/plan_three_defects_2026-09-24.md` (the 268th record entry) and `memory/user-solariz3d.md`.
- **Moved the other way:** `memory/dont-offer-rest-assume-momentum.md` is now carried in full instead of indexed.
  - The 13 cards are still carried in both dumps, plus `README.md`.
  - The 15th body swapped because the index tier is 56 B shorter, which leaves the body floor 58 B more room (47,533 against 47,475; 2 B of that is the worktree name). That fits the larger `memory/dont-offer-…` in alphabetical order before `memory/user-solariz3d.md`.
  - I'm naming it because D296 named the same refill. No row of B's bar covers it.

**B's fixed sample, 30 by path** (`compare.out`, foot): 5 titles changed and 0 entries dropped from the listing.
- #4 "D210 rule census: SCORE. Where MD rules ..." → "SCORE. Where MD rules work, and where ..."
- #8 "Q3 read: Jev ..." → "Jev (typesafe/jev-1.13-20260917 ..."
- #16 "Q3 units — 40 pairs for the two-reader ..." → "40 pairs for the two-reader agreement ..."
- #21 "D256 item 2: what "always max speed" ..." → "what "always max speed" would change ..."
- #22 "P-INDICATOR (L025) — the loop indicator ..." → "the loop indicator in the UI"

inferred: four of the five were already legible at 22/28 and read better now; #8 stays illegible. So T1 is 22/28 unless B reads #8 otherwise, and **F-a fires**. B's judgment is the one that counts.

## 4. Mutants, on the title code only
These ran on a copy tree (`G:/worktrees/c-d297-base` checked out at `dff6810b`, restored after), never on the worktree being committed. Each runs `index_title_tests` (`mut.js`, `mut.log`).

**applied 14 / caught 14 / NOT APPLIED 0, control survived:**
- N1: a colon ends a label with no id;
- N2: a dash ends a label with no id;
- N3: the path shows every word;
- N4: a title within the cap is stripped too;
- N5: an all-label title is emptied;
- N6: no prefix-4 rule;
- N7: no qualifier;
- N8: parentheses not trimmed;
- N9: a lone capital is an id;
- N10: a lowercase `P-` run is an id;
- N11: a colon does not end the label;
- N12: the strip is not called;
- N13 (D296 M6): no title cap;
- N14 (D296 M7): an untitled entry prints nothing.

**A gap I found and closed:** on `30f78d0b`'s rows, **N9 and N10 SURVIVED** (`mut-30f78d0b.log`): no row held the id shape against a capital with no digit, or a lowercase `P-` word. `dff6810b` adds two asserts, B's #5 verbatim ("M — the librarian, its own words, 2026-08-24") and a made-up "P-value: …". Both mutants are now caught. The `dff6810b` commit message says the mutant "survived every row"; I wrote that before running it, and the run above confirms it.

## 5. Checks
- portable-paths after committing: green, 380 files in scope / 455 known sites / 0 new (`portable.log`).
- Every node and cargo run went under the heavy-run lock (`scratchpad/lockrun.js`, which loads main's `heavy-run.js` by absolute path). `CARGO_TARGET_DIR` was on G: (`G:/ctarget/c-d296-{base,new,mut}`, mine from D296).
- The credential-pattern scan over the evidence folder found 0 hits.

## 6. Corrections to myself
- My first two simulation scripts lost their regex escapes in a bash heredoc (`\\d` became `\d`, then `d`), and the first run reported "stripped 0". I re-wrote them with a file write and re-ran. The 0 never left the scratchpad.
- Before measuring, I expected a narrow rule to fix #27 and #12, as the plan and B's §2 do. It fixes neither, for the reasons in §1.

## 7. Not done, and leftovers
- I did not build the parenthetical clause for #27 or a no-separator strip for #12 (§1).
- A trailing author/date tail strip, B's other D296 candidate, is out of this packet's scope.
- **Leftovers, mine:**
  - `G:/worktrees/c-d297-wt`, `G:/worktrees/c-d297-base`;
  - `G:/consonance-scratch/c-d297`;
  - scratchpad `d297/`.
  - The D296 leftovers are unchanged; `G:/ctarget/c-d296-*` are now shared with D297.
