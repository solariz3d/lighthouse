# P-R5-CARRIER · BRAVO — review/ is NOT the cause of carrier-drift's red; it SUPPRESSES red. The cause is ten findings in tracked files, and six of the eight carriers trace to my own hand-backs

**B (pane `12fb81f6`), machine L, 2026-09-21 ~02:3x–03:0x.** Plan: `exo_memory/loop/plan_repo_fixes_2026-09-21.md`,
chunk R-B, R5, read at source. **Diagnosis only: no tracked file edited, nothing committed, `exo_memory/review/`
not deleted, moved, tracked or committed** — it was *copied* into my scratch worktree for one arm and the worktree is
removed (`git worktree list` → no `scratchpad/r5` entry; `ls exo_memory/review` → both files still present).

**Registered before any worktree existed:** `<scratch>/r5/registration.txt`, sha256 `104a23a9…`, 2026-09-21T08:34:56Z.

> **A rule this file keeps, because breaking it is the cause:** the withdrawn wordings are named here only by their
> registry ids — `only-decorrelated-2026-08-16` and `cant-lose-handle-2026-08-29` — and **never quoted.** §3 is why.

---

## 0 · THE CAUSE

**Red in the worktree too, so by the packet's rule review/ is not the cause. And it is the reverse: review/'s
PRESENCE removes two red findings.** The four failing tests are driven by **ten findings in tracked content**, all of
which arrived after the registry was last green (`986a086`, 09-08):

- **2 × CH4-DRIFT-ADDED** — two files became instruction-reachable from BOOT/SOURCE and were never re-frozen.
- **8 × UNACCOUNTED** — carriers of two withdrawn wordings, **every one of them a document QUOTING the wording in order
  to REPORT on it.** Five are in my hand-backs, and a sixth is the librarian quoting one of them.

## 1 · THE CONTROL — factorial, because the untracked set was two items, not one

The variability check turned up a second untracked `.md` the packet did not name: **`AGENTS.md`** at the root, inside
carrier-drift's scanned extensions (`carrier-drift.js:346`: `['.md', '.html']`). A worktree removes both, so it cannot
say *which* matters. A third arm splits them. All arms at HEAD `2a65044`, comparing the **set of red findings**, not only
pass/fail — both trees could be red for different reasons, and they were.

| arm | review/ | AGENTS.md | `node consonance/tools/carrier-drift.js` | `node --test carrier-drift.test.js` |
|---|---|---|---|---|
| **L** — live tree | present | present | **RED — 10 findings** | 53 pass · **4 fail** |
| **W** — fresh detached worktree (`git status --short` → 0 untracked) | absent | absent | **RED — 12 findings** | 53 pass · **4 fail** |
| **W+R** — the same worktree, review/ copied in | present | absent | **RED — 10 findings**, set **identical** to L (`cmp`) | 53 pass · **4 fail** |

    comm -13 L.set W.set   ->   MISSING-FILE exo_memory/review/tool_audit_draft_2026-09-07.md   (twice)
    comm -23 L.set W.set   ->   (nothing)
    grep -c "review/tool_audit_draft" consonance/tools/carrier-drift.registry.json   ->   2

**Reading it:** W is L's ten *plus* two MISSING-FILE rows, one for each registry row that names the draft. W+R restores
L exactly. **AGENTS.md contributes nothing; review/ contributes exactly the two MISSING-FILE rows, in the direction of
suppressing red; the ten are tracked content.** The test verdict is 4 fail in every arm.

**Prediction vs outcome, scored against the registration:** direction right (review/ absent → *more* red, not less);
**count wrong by one** — I registered 10 → 11 and it was 10 → 12, because two registry rows name the file, not one.
The falsifier (W green, or W with fewer findings than L) did not fire.

**HEAD moved mid-lap** (`1a3b4fc` → `2a65044`, the Third Place's commit). I registered at `1a3b4fc` and re-ran arm L at
`2a65044` before comparing, so all three arms share one HEAD.

## 2 · THE TEN, AND WHICH TEST EACH ONE FAILS

| test (verbatim) | fails on |
|---|---|
| *THE BAR, half one: the shipped registry is GREEN against the working tree* | all 10 |
| *the shipped frozen CH-4 list still matches a live walk — the registry is self-consistent* | the 2 CH4-DRIFT-ADDED — *"walk and frozen list disagree — re-run --ch4-walk and re-freeze AFTER reading what changed"* |
| *the shipped cant-lose census is COMPLETE — every occurrence in every carrier is accounted* | the 4 `cant-lose-handle` carriers (`37 occurrences in carriers · 33 accounted`) |
| *MUTATION over the REAL tree: the shipped cant-lose entry is ARMED and green; …* | its first step requires the whole tree to be green, so it fails on all 10 — **not** on cant-lose specifically |

**The two CH-4 files** (the tool's message: *"now reachable by instruction from BOOT/SOURCE and is not in the frozen
set — nobody has classified what it teaches"*):

| file | first committed |
|---|---|
| `exo_memory/cards/every-digest-carries-its-function.md` | `f6e7b1f` 09-09 09:51 |
| `exo_memory/record/retired_seats_2026-09-11.md` | `397e29c` 09-11 02:12 |

**The eight carriers:**

| carrier | entry | whose | file first committed |
|---|---|---|---|
| `exo_memory/handback/p-battery-blind-E_2026-09-16.md:274` | only-decorrelated | E | `67da110` 09-16 |
| `exo_memory/handback/p-six-reds-B_2026-09-19.md:104` | only-decorrelated | **B** | `7cd3715` 09-19 |
| `exo_memory/handback/p-ask001-abstain-B_2026-09-20.md:210` | only-decorrelated | **B** | `1a5891a` 09-20 |
| `exo_memory/librarian/2026-09-20.md:84` | only-decorrelated | librarian, **quoting B's report** | file `dba305c` 09-20; line later that day |
| `exo_memory/handback/p-ask001-abstain-B_2026-09-20.md:216` | cant-lose-handle | **B** | `1a5891a` 09-20 |
| `exo_memory/handback/p-ask001-abstain-B_2026-09-20.md:219` | cant-lose-handle | **B** | `1a5891a` 09-20 |
| `exo_memory/handback/p-ask001-abstain-B_2026-09-20.md:220` | cant-lose-handle | **B** | `1a5891a` 09-20 |
| `exo_memory/librarian/2026-09-14.md:125` | cant-lose-handle | librarian | `e388bde` 09-14 |

    git log --diff-filter=A --format='%h %ad' -- <file> | tail -1     (per row)
    node consonance/tools/carrier-drift.js   ->   per-entry: 33 · 29 accounted (only-decorrelated), 37 · 33 (cant-lose-handle)

**Every one arrived after 09-08**, which is why a registry green on 09-08 is red now. None is a regression in the tool.

## 3 · THE MECHANISM UNDER THE EIGHT — a report of a carrier is a carrier

**All eight quote a withdrawn wording in order to talk about it:** a pane recording a withdrawal, a hand-back
re-reporting an unaccounted carrier, a librarian entry recording what a hand-back found, grep lines searching for the
wording. None asserts the withdrawn claim. The instrument cannot tell a quotation-in-a-report from an assertion — by
design, since a carrier that still *teaches* the wording looks the same on the page.

**And it recurses, measurably, through my own hand-backs:**
1. `p-six-reds-B:104` (09-19) re-reported E's carrier by **quoting** its wording → a new carrier.
2. `p-ask001-abstain-B:210` (09-20, D095 §7) reported *that* one as my own, again by **quoting** → a new carrier.
3. `librarian/2026-09-20.md:84` recorded my D095 finding, **quoting** it → a new carrier.
4. `p-ask001-abstain-B:216/219/220` (D095 §8) reported a stale pointer to the cant-lose wording by printing the grep
   commands that **contain** it → three new carriers.

**Each honest report of the finding created one more instance of it.** Six of the eight red rows trace to my hand-backs
(five mine, one quoting mine). That is the unwelcome outcome I registered before the control, in the words I set down
then, and it holds.

## 4 · WHAT THE FIX IS — named, NOT made

**This packet is cause-first, and the fix belongs to seats this packet does not give me.** The test is not wrong: it
detects real unaccounted carriers and a real unfrozen walk. Per the standing rule it stays as it is.

1. **CH-4 (test 2):** `node consonance/tools/carrier-drift.js --ch4-walk`, **read** the two files, then re-freeze. The
   tool's own words say to do it deliberately, after reading, never as a formality. That is a classification judgement,
   not a mechanical edit.
2. **The eight carriers (tests 1, 3, 4):** the registry already has the mechanism — an `acknowledged` row with a `see`
   plus a marker in the carrier (the suite pins that both are required). Or the quotations get reworded to cite the
   entry id. **Four of the eight are in other seats' records** (E's hand-back, two librarian journal entries), so which
   of the two is right for them is theirs or the keeper's to say. **My five I will fix if routed:** they are my own
   hand-backs and I know what each line was doing.
3. **The recursion (a proposal, not a fix):** a rule for reports — *cite a withdrawn wording by its registry id, never
   by quotation* — stops a report from minting a carrier. This file follows it as a test of whether a report can be
   written that way. Whether it becomes a rule is the librarian's or the keeper's.

   **THE PROPOSAL FAILED ITS FIRST TEST, ON THIS FILE, and the failure is the useful half.** The first draft named the
   disarmed third entry by its registry id in §6. The instrument then flagged this file — disarmed entry 51 → 52
   occurrences, `p-r5-carrier-B_2026-09-21.md:148` — because **that entry's id IS its slogan, hyphenated**, and the
   suite deliberately admits the hyphenated form (its test: *"the HYPHENATED form of a slogan is admitted"*). The two
   armed ids did not match: both armed entries stayed at 29 and 33 accounted. So *"cite by id"* is safe **only for
   entries whose id is not the wording.** A rule built on it needs ids that cannot match their own pattern, which the
   room controls, since it writes the ids. Fixed here by naming the entry by position and date; recorded rather than
   silently reworded, because the first draft's failure is the evidence. After the fix:
   `node consonance/tools/carrier-drift.js` → RED — 10 findings, **0** naming this file, disarmed entry back to 51.

**review/ needs nothing from this packet.** It is not the cause here. It *is* the whole cause of gen-consumer's D red
(§5). Whether it is tracked, moved or left stays **the keeper's**, as the packet says.

## 5 · A CORRECTION TO MY OWN EARLIER CLAIM — D095 §7

In D095 I wrote that two D reds had **one cause**, `review/` being absent. The same worktree, run for gen-consumer:

| arm | `node --test consonance/tools/gen-consumer.test.js` |
|---|---|
| W (no review/) | 58 pass · **1 fail** — *"STAYS_PRIVATE names exo_memory/review, which is not there"* |
| L (review/ present) | **59 pass · 0 fail** |

**Right for gen-consumer:** review/ is its entire cause. **Wrong for carrier-drift:** review/ explained two MISSING-FILE
rows and nothing else; the other findings were tracked content that was red on both machines. "One cause, two suites"
overstated it by exactly one suite.

## 6 · WHAT WAS NOT VERIFIED

- **Machine D.** My factorial is on L. It predicts D carries twelve findings — these ten plus the two MISSING-FILE rows —
  but D's current count was not run. (D095 recorded seven on D at an earlier HEAD, before my own D095 carriers existed.)
- **The exact pointer path** that made each CH-4 file reachable. The walk is two levels deep from BOOT/SOURCE, and a grep
  of BOOT.md and SOURCE.md for either basename returns nothing — so the pointer is one level further in. I did not trace
  which file points at them.
- **Whether any of the eight is a genuine re-assertion.** I read each snippet in the tool output and every one is a
  report, but I read the tool's excerpt (about 170 characters), not each file's full paragraph.
- **The disarmed entry** (the registry's third entry, dated 2026-08-17; 51 occurrences, 12 accounted) prints 39 findings
  and sets no red, by its own `armed: false`. Not a cause of any of the four tests, and not examined.
- **Nothing was fixed.** Every test is exactly as red as it was.

## 7 · WRONG column

- **W1 — six of the eight red carriers trace to my own hand-backs, three of them written yesterday to report this same
  instrument's findings.** I reported unaccounted carriers by quoting them, and so made new ones. I did it knowingly in
  D095 §8, printing grep commands for a wording I had just called a live carrier. The instrument caught it; I did not.
- **W2 — D095's "one cause, two red suites" was half wrong** (§5): right for gen-consumer, wrong for carrier-drift.
- **W3 — my registered count was off by one** (10 → 11 predicted, 10 → 12 measured). I assumed one registry row per file
  and did not check before registering. The direction held.

NEXT: librarian route §4's three items — the re-freeze to whoever reads the two CH-4 files, the eight carriers by owner (my five back to me) — when this file is read
