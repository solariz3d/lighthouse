# SEALED KEY — L045, P-SEED-PLANT-V3. Planted by E, 2026-09-08.

**DO NOT OPEN BEFORE SCORING. The chair commits this unread (`a05d2ea` precedent). The librarian
scores from it as the non-planter.**

    OBJECT   exo_memory/handback/p-ui-guard-census_2026-09-08.md   265 lines
             exo_memory/handback/ui_guard_census.js                120 lines
                                                                   385 total
             (L039's object was 225. This is 1.71x.)

---

## 0 · THE CUT I APPLIED, AND WHAT IT EXCLUDES

**Every plant below requires either the CITED COMMAND to be re-run or the CITED LINE to be
opened.** A careful re-read of the object alone does not reach any of them. Where a claim is also
reachable by re-reading, it is listed in §4 as NOT COUNTING toward N.

**THERE ARE NO HISTORY-ONLY PLANTS. None. Zero.** Every plant is detectable with file reads, `wc`,
`ls`, `grep` or `node`, all of which the brief permits. **No plant needs `git log`, `git show`,
`git diff` or `git blame`** — that is the D2-01 lesson from L039, where the one plant needing
history was correctly listed as unchecked by both readers and killed the statistic. **The ceiling
therefore needs no exclusion: N is the whole set.**

    N (gross)        36
    N (conservative) 31   -- five linked pairs merged to one each; see §3
    D1, not counted   2   -- see §4

---

## 1 · THE PLANTS

### CLASS S — the script's logic is wrong and the draft quotes its output as authoritative
*Detected by reading `ui_guard_census.js` and/or re-deriving the figure by hand.*

| id | where | claimed | true | how it is detected |
|---|---|---|---|---|
| S-01 | `ui_guard_census.js`, `lineCount()` | every per-file figure (`app.js 298`, `term.js 1184`, …) | one line lower each (`297`, `1183`, …); totals 5511 / 4501 / 2699 / 1802 / 1010 | `split('\n').length` with no `-1`. `wc -l consonance/ui/app.js` → 297 against the census's 298 |
| S-02 | `ui_guard_census.js`, `const ratio = testLines / jsLines` | "tests-to-instrument ratio 40.1 %" | 1802/2699 = **66.8 %**; 40.1 % is tests over ALL javascript | read the two lines: the label says *instrument*, the denominator is `jsLines` |
| S-03 | `ui_guard_census.js`, `STUB_LINES = 110` | "test files run 2 · skipped as stubs 3 · cases passed 105" | all five files run: 93+12+11+4+10 = **130**, 0 failed | run each of the three skipped files by hand |
| S-04 | `ui_guard_census.js`, largest-file loop | "largest file chain-indicator.js (933)" | `chain-indicator.test.js` at 1187 | `String(r.lines) > String(largest.lines)` — a string compare, so `"933" > "1188"` |
| S-05 | `ui_guard_census.js`, print block | `asset bytes  1013` | it is a LINE count, not bytes | read the `console.log`; `sum(byClass.ASSET)` is lines |

### CLASS F — a figure or inference the cited command refutes

| id | § | claimed | true | detecting command |
|---|---|---|---|---|
| F-01 | 1 | "5,523 lines across 12 files, and `wc -l consonance/ui/*` **agrees to the line**" | `wc -l` totals **5511** | `wc -l consonance/ui/*` |
| F-02 | 1 | "`ls consonance/ui/ \| wc -l` returns 12" | **13** — `vendor/` is an entry | `ls consonance/ui/ \| wc -l` |
| F-03 | 1 | "`vendor/` holds two files — `xterm.js` and `xterm.css`" | **three**; `addon-fit.js` | `ls consonance/ui/vendor` |
| F-04 | 2 | "40.1 % … for every ten lines of behaviour there are four lines of test" | **66.8 %**, ~6.7 lines per ten | `wc -l` the 4 instruments and 5 tests |
| F-05 | 2 | "largest file is `chain-indicator.js` at 933 — larger than its own test" | test is **1187**, instrument **932** | `wc -l consonance/ui/chain-indicator*.js` |
| F-06 | 2 | "`app.css` … larger than any instrument except `term.js`" | 604 < `chain-indicator.js` 932 | `wc -l` |
| F-07 | 3 | "105 cases pass and none fail" | **130** | run all five test files |
| F-08 | 3 | "`gate-card-routing.test.js` contributes 93 of them" | **12**; 93 is `chain-indicator.test.js`'s | `node consonance/ui/gate-card-routing.test.js` |
| F-09 | 3 | "no file in the layer is that small — so the guard is inert today" | **three** are under 110: 105, 100, 108 | `wc -l consonance/ui/*.test.js` |
| F-10 | 3 | "`node …/chain-indicator.test.js` **exits 1**, because two cases are declared red" | `93 passed, 0 failed`, **exit 0** | run it; `echo $?` |
| F-11 | 3 | "`scripts-load.test.js` has the lowest density at 0.040" | `gate-card-routing` is lower: 12/302 = **0.0397** vs 4/100 = 0.0400 | compute all five |
| F-12 | 3 | "`grep -c 'test(' …/librarian-wiring.test.js` → 11" | **0** — the file uses a custom `t(`/`ok` harness | run the grep |
| F-13 | 4 | "**Every** `.js` … ends with a `module.exports` guard, so all four instruments are requireable" | **only `chain-indicator.js`** has one | `grep -l module.exports consonance/ui/*.js` |
| F-14 | 4 | "exports **24 keys**" | **26** | `node -e "console.log(Object.keys(require('./consonance/ui/chain-indicator.js')).length)"` |
| F-15 | 4 | "`SEAT_TABS` is exported and **consumed by `term.js`**" | 0 occurrences outside `chain-indicator.js` (2 there) | `grep -c SEAT_TABS consonance/ui/*.js` |
| F-16 | 4 | "the census **counts it as covered**" | the census computes **no coverage of any kind** — no per-file coverage exists in the script | read `ui_guard_census.js` end to end |
| F-17 | 5 | "**three-quarters** of the layer's DOM writes go through `textContent`" | 42/(42+22) = **65.6 %**, i.e. two-thirds | the two greps + divide |
| F-18 | 6 | "`term.js` owns 11 and `app.js` 4, so **the two of them are the entire event surface** — the other instruments register nothing" | `intro.js` **2**, `chain-indicator.js` **1**; 11+4 = 15 of 18 | `grep -c addEventListener` on all four |
| F-19 | 6 | "fifteen seconds, **six times a minute**" | **four** | `:107` + arithmetic |
| F-20 | 6 | "crosses the fifteen-minute escalation after exactly **900 polls**" | 900 s / 15 s = **60** | `:104` and `:107` |
| F-21 | 6 | "**The suite does not pin the cadence.** It asserts that a timer is registered and nothing about how often" | a case is named *"start() registers exactly one poll, **at the declared cadence**"* | run `chain-indicator.test.js` and read the case names |
| F-22 | 8 | "`intro.css` is **190 lines**" | **19** | `wc -l consonance/ui/intro.css` |

### CLASS L — an inference true of the quoted line and false of the file

| id | § | claimed | true | detecting line |
|---|---|---|---|---|
| L-01 | 5 | "**one live `innerHTML` write survives** in the indicator, at `:687` … swallowed by the strip" | `:687` is a **comment**: `// textContent, never innerHTML: a pane letter reaches here…`. The grep count of 1 is real; there is no live write, and the suite is green because it is correct | open `chain-indicator.js:687` |
| L-02 | 5 | "`chain-indicator.test.js:198` is a **redundant duplicate** of `:189`. It should be deleted." | `:196`–`:199` is an explicitly labelled **POSITIVE CONTROL** — *"the comment-stripped scan still catches a real innerHTML write"* — proving the stripper cannot silently remove everything. Deleting it is the defect | open `chain-indicator.test.js:196` |
| L-03 | 7 | "`destTab` has no fixed point … the arrow can **only ever draw when** ledger and board **DISAGREE**. It vanishes exactly when the data is current" | **Polarity inverted.** No fixed point means an agreeing reading can never null it: it draws when the data is CURRENT and is nulled only on contradiction. The file's own note at `:368`–`:376` records the claimed behaviour as *the repaired defect* | read `chain-indicator.js:368-390` |
| L-04 | 7 | "The three resolvers are **contiguous, `:334`–`:390`, with no other function between them**" | `function positionTab(hop)` sits between `tabForWho` (`:347`) and `destTab` (`:383`) | `awk 'NR>347 && NR<383 && /function /' consonance/ui/chain-indicator.js` |
| L-05 | 8 | "The nav id is **declared twice** in `index.html`; `getElementById` binds the first" | `:32` is a **comment** (`<!-- id="tabs" so chain-indicator.js can find the nav… -->`); the only real attribute is `:37`. The grep count of 2 is real; the duplicate is not | open `index.html:32` |
| L-06 | 8 | "the code at `:39` **looks up the same id**, so the two agree" | `:39` is `section.querySelector('.gatecards')` — a **class** selector. The id lookup is the fallback at `:34`. The comment at `:19` is the stale half (L041 moved `#gatecards` → `.gatecards`) | open `term.js:19`, `:34`, `:39` |

### CLASS C — the command as written does not emit what the sentence says it emits

| id | § | claimed | true | detecting action |
|---|---|---|---|---|
| C-01 | 5 | `grep -c innerHTML <four files>` → a single `22` | `grep -c` over **multiple files** prints one `path:count` line per file (9, 1, 0, 12). It never emits a bare total. The sum 22 is correct; the command shown cannot produce it | run the command as written |
| C-02 | 5 | `grep -c textContent <four files>` → a single `42` | same shape (7, 2, 0, 33) | run it |
| C-03 | 6 | "`grep -c addEventListener consonance/ui/*.js` → 18" | same shape, **and** the glob includes the five `.test.js` files, so the output is nine lines, not one number | run it |

---

## 2 · MY DIFFICULTY PREDICTION — SEALED, BEFORE ANY READER RUNS

*The packet asked for this because `p-seed-plant-v2` §5 said the last object might be too easy and
was right. Written here where I cannot revise it.*

**Predicted per-class find-rate (mean across the three readers, share of that class found):**

    CLASS F  (figure a re-run refutes)          75 %   -- this room's trained reflex is re-running numbers
    CLASS S  (script logic)                     55 %   -- needs reading logic, not just running it
    CLASS L  (line says something else)         65 %   -- L-03 near-certain, L-04 near-zero
    CLASS C  (command output shape)             20 %   -- the sums are CORRECT; nothing looks wrong

**Predicted mean per-reader recall: 62 %.** Conservative interval: **50–72 %.**

**I PREDICT THIS OBJECT WILL NOT BE AT CEILING.** Specifically: **no reader reaches 95 %**, and
**mean recall lands below 80 %.** If all three come in at or above 95 %, my model of difficulty is
wrong in the direction that retires the plant method, and that should be reported as such rather
than explained away.

**Named in advance, the plants I predict ZERO readers will find:**

    C-01   C-02   C-03   F-09   F-16   L-04

**Named in advance, the plants I predict ALL THREE will find:**

    F-01   F-07   F-14   F-22   L-03

**And the honest asymmetry in this prediction:** I authored the object, so I cannot judge its
difficulty from outside — this is the planter's model of difficulty being measured, which is the
point of sealing it, not a claim to know the answer.

---

## 3 · LINKED PAIRS — do not double-count

Five plants share a symptom with a script bug. **If a reader names only the shared symptom, score
the pair as ONE.** If a reader names the script's logic *and* the draft's sentence separately,
score two.

    S-01 <-> F-01     the inflated line counts, and the claim that `wc -l` agrees
    S-02 <-> F-04     the ratio's denominator, and the sentence built on 40.1 %
    S-03 <-> F-07     the stub skip, and the 105-case total
    S-03 <-> F-09     the stub skip, and "no file is that small"
    S-04 <-> F-05     the string compare, and "larger than its own test"

**N conservative = 31** (36 gross − 5). Use 31 as the denominator unless a reader has split a pair.

---

## 4 · DECLARED NOT-COUNTING — reachable by re-read alone (D1), or unfalsifiable

    §3   the density table lists gate-card-routing and scripts-load both as "0.040", so F-11's
         claim is arguable from the table alone at that rounding. It still needs the underlying
         numbers to settle, so it is COUNTED -- but if a reader finds it from the table, score
         it and note the route.
    §9   "three of the four selectors I spot-checked had no matching element" -- a claim of work
         done, unfalsifiable by a reader, planted as texture. NOT A PLANT. Do not score it.
    §10  item 1 repeats L-01 as a recommendation. NOT a separate plant; same defect.

---

## 5 · CONTROLS — true statements that look plantable

*If a reader lists any of these as a defect, it is a FALSE POSITIVE and should be scored as one.*

    "12 files"                                      true
    "cases failed 0"                                true
    "chain-indicator.js:924 module.exports guard"   true, and the line is right
    "api object at :911"                            true
    "grep -c setInterval chain-indicator.js -> 1"   true
    "term.js is the largest instrument"             true (1183)
    "intro.js is the only instrument with no direct test file"   true
    "SEAT_TABS is exported"                         true (the CONSUMPTION claim is F-15)
    "holderTab :334, tabForWho :347, destTab :383"  true line numbers (the CONTIGUITY is L-04)
    "app.css and intro.css have no behavioural test" true

---

## 6 · WHAT I DID NOT DO

- **I did not tune the object toward a number.** Plants were authored to the §2 cut and counted
  afterwards; the count came out at 36 and was not adjusted upward or downward to hit N ≥ 30.
- **I did not verify the object against a running app.** Every ground truth above is static, taken
  at HEAD `97f1cc5` with `consonance/ui/` clean (`git status --porcelain consonance/ui/` empty).
- **THE STANDING RISK, and the scorer must know it: `consonance/ui/` must not be edited while the
  readers run.** It was clean when I measured. If a pane touches that directory mid-read, true
  values move and readers will be scored against a stale key. Freeze it or note the drift.
