# P-R3-ASK-FIXTURE · BRAVO — the test was wrong, proven before it was touched; re-pointed, and the D091 defect still turns it red

**B (pane `12fb81f6`), machine L, 2026-09-21 ~02:0x–02:4x.** Plan: `exo_memory/loop/plan_repo_fixes_2026-09-21.md`
@`eb1b121`, §0 and the R3 row, read at source. Non-author of the test (E wrote it, D091). **Nothing committed.**
**`exo_memory/ASK.md` not touched** — `git status --short exo_memory/ASK.md` → clean.

**My footprint, and only this:**
- `consonance/tools/ask.test.js` — `+22 −2` (`git diff --stat`); the two removed lines are the test's name and its
  `A.load(A.STORE)`
- `consonance/tools/fixtures/ask-store_915209a_ASK-008-009.md` — **new**, 1,748 bytes, verbatim

Other modified files in the tree (`js-suite.js`, `js-suite.test.js`, `dev/tail-carry.test.js`) are A's and C's this
lap and were not opened for writing.

**Registered before the A/B run:** `<scratch>/r3/registration.txt`, sha256 `c037f374…`, 2026-09-21T08:01:15Z —
null, falsifier and the unwelcome outcome (*"the shipped-store test is right and ask.js regressed after 915209a"*).

---

## 0 · VERDICT

**The test was verifiably wrong. The tool did not regress.** It asserted mutable live data — `A.load(A.STORE)`,
where `A.STORE` = `C:\Consonance\lighthouse\exo_memory\ASK.md` — and that data changed legitimately when the keeper
cleared ASK-009 KEEP. Re-pointed at a verbatim fixture of the store as it stood at D091's commit, with its
assertions unchanged, it is green; **with the D091 defect put back, it is red.**

## 1 · THE PROOF, in the order the rule demands

**(a) What the test reads.** `consonance/tools/ask.test.js:343-344` at `eb1b121`:
`const st = A.load(A.STORE);` —

    node -e "console.log(require('./consonance/tools/ask.js').STORE)"   ->  C:\Consonance\lighthouse\exo_memory\ASK.md

**(b) The failing assertion is the data, and only the data.**

    node --test --test-name-pattern="shipped store" consonance/tools/ask.test.js
    ->  actual: 'ANSWERED', expected: 'OPEN'     (nine.state; the assert.ok(nine) above it PASSED)

Falsifier limb (c) did not fire: the only failing assertion is `nine.state === 'OPEN'`.

**(c) The store changed, dated, and in the keeper's words.**

| event | commit | when |
|---|---|---|
| the test lands, ASK-009 `**Status:** OPEN` | `915209a` | 09-20 10:04 |
| ASK-009 → `[ANSWERED 2026-09-20 — KEEP. The keeper … verbatim: "009 the convo is apart of the build." …]` | `c80ec12` | 09-20 12:42 |

    git log -S"on the shipped store, ASK-009 parses OPEN" -- consonance/tools/ask.test.js   ->  915209a
    git log -L '/^### ASK-009/,+4:exo_memory/ASK.md'                                        ->  c80ec12 (OPEN -> ANSWERED)

**It was a legitimate clearing, not damage:** ASK.md's protocol makes clearing the keeper's act, and the Status
quotes him, names the exchange and says it was cleared on his behalf per protocol 2.

**(d) The controlled A/B — the decisive half.** `c80ec12` touched one file:

    git diff --stat c80ec12^ c80ec12                                          ->  exo_memory/ASK.md | 6 +++---
    git diff --quiet c80ec12^ c80ec12 -- consonance/tools/ask.js consonance/tools/ask.test.js   ->  identical

Run in two fresh detached worktrees (which carry no untracked files — the plan's control):

| tree | ASK-009 parses | comma survives in title | ASK-008 | 008 carries 009's question | the test |
|---|---|---|---|---|---|
| `c80ec12^` (`a74c062`) | **OPEN** | yes | ANSWERED | no | **✔ green** |
| `c80ec12` | **ANSWERED** | yes | ANSWERED | no | **✖ red** — `actual: 'ANSWERED'` |

**Variability check, printed before the verdict was read:** the quantity took two values across the trees (OPEN,
ANSWERED), so the A/B can discriminate. **Null:** tool and test are byte-identical across the commit, so a verdict
that differs can only be the store's doing — and it differs. **Falsifier limbs (a) and (b) did not fire:** green
before the clearing, and at the red tree every D091 property still holds — the comma parses, ASK-008 keeps its own
status, nothing is absorbed.

**(e) Live store today, same read:** `ANSWERED 9 · OPEN 2 · DECLINED 2`, 13 asks, **0 unreadable**; ASK-009's goal
still carries *"SIX, not eleven"*. The parser is doing exactly what D091 built it to do.

## 2 · THE RE-POINT

**Fixture:** `consonance/tools/fixtures/ask-store_915209a_ASK-008-009.md` = **blob `915209a:exo_memory/ASK.md`
lines 127–136, byte for byte** — the ANSWERED ASK-008 directly above the comma-titled, OPEN ASK-009, which is the case
D091 exists for (`ask.test.js`'s own §5 comment: ASK-009's Source, Question and Status had been absorbed into ASK-008).

    git show 915209a:exo_memory/ASK.md | sed -n '127,136p' | cmp - consonance/tools/fixtures/ask-store_915209a_ASK-008-009.md   ->  identical
    sha256  b00b329c…                                                                                      (pinned in the test)

**Why the pair and not the whole store:** it is the whole D091 case and nothing else, and it was checked before
landing for the room's other scanners — no withdrawn wording and no machine paths (`grep -i "lose by saying|c:\\users|nname|zackn|desktop"`
→ none); `portable-paths.js:144` scans `.js .rs .ps1 .py` only; carrier-drift scans `.md` and names the fixture in
**0 of its 10 findings**. **Why verbatim and not hand-written:** `catch-ledger.test.js:359`'s lesson — fixtures written
by the same hand as the rule prove nothing about the record.

**What changed in the test, exhaustively:**
1. `A.load(A.STORE)` → `A.load(D091_FIXTURE)`.
2. The name: *"on the shipped store"* → *"on the store as shipped at 915209a"* — the old name would now be false.
3. **New test:** the fixture's sha256 is pinned, so a "tidied" fixture stops being the record silently.
4. **One assertion ADDED**, none removed or loosened: `assert.match(nine.goal, /SIX, not eleven/)`. The live store
   carried the comma for free; a fixture has to assert it still holds the case. Added because mutant F2 proved the
   gap (§3). **This strengthens the test; every original assertion is present and unchanged.**
5. A comment at the site recording the proof and pointing here.

    node consonance/tools/ask.test.js                                   42 tests · 42 pass · 0 fail   (exit 0)
    node --test --test-concurrency=4 consonance/tools/ask.test.js       42 · 42 · 0
    node --test --test-name-pattern=D091 consonance/tools/ask.test.js    6 ·  6 · 0
    node consonance/tools/js-suite.js                                   ok  consonance\tools\ask.test.js

Baseline before any edit: **41 tests · 40 pass · 1 fail**. The +1 is the pin.

## 3 · MUTANTS — scored twice: the whole suite, and the re-pointed test alone

The plan's bar is that **this test** goes red on the D091 defect, not merely that something in the file does. So each
mutant is scored by name as well. Fresh repo-shaped copy per mutant, with `exo_memory/ASK.md` mirrored (the D092 lesson:
without it the control goes RED and every catch is a load failure).

    node <scratch>/r3/mutants.js

| mutant | re-pointed test | suite |
|---|---|---|
| **M1 — THE D091 DEFECT:** title group comma-intolerant again, `(.+)` → `([^,]+)` (the exact pre-D091 form, `git show 915209a^:consonance/tools/ask.js:88`), guard kept | **caught** | caught |
| **M2 — PRE-D091 IN FULL:** comma-intolerant title AND the unreadable guard removed (the absorption) | **caught** | caught |
| M3 — the unreadable guard alone removed, title still wide | survived | caught |
| F1 — fixture "tidied": ASK-009 Status OPEN → ANSWERED | **caught** | caught |
| F2 — fixture "tidied": the comma removed from ASK-009's title | **caught** *(first run: survived)* | caught |

    applied 5 · caught by the re-pointed test 4 · caught by the suite 5 · NOT APPLIED 0
    control (pristine, same harness): suite GREEN · target GREEN · tracked source and fixture unchanged

**The bar is met: M1 and M2 turn the re-pointed test red.**

**F2 survived the first run, and that is where the added assertion came from.** Without it, a fixture with the comma
tidied out still passed this test — it no longer held the D091 case — and only the sha pin caught it. A test should
assert the case it exists for, not inherit it from a hash. Now F2 dies at the target.

**M3 surviving the target is correct, not a gap.** The fixture's ASK-009 heading *parses*, so this test never
exercises the unreadable guard. That half of D091 belongs to the neighbouring *"an unparsable heading is UNREADABLE and
does not inherit the block above it"*, which catches M3 (suite column). The original live-store test would not have
caught M3 either.

## 4 · FOUND ON THE WAY — reported, not acted on

- **At `c80ec12` the store had one unreadable ask, and it was the tool working.** ASK-007: *"unrecognised Status: OPEN —
  RESTATED IN PLAIN TERMS…"* — the closed-vocabulary guard (property 2) refusing a Status that was not in the
  vocabulary. The next commit, one minute later, fixed it (`c116a66`: *"I broke rule 3 and the tool caught me in
  seconds"*). Not D091's defect and not this test's; it shows the guard fires on the live store.
- **The sibling of this defect is already named in the store.** ASK-009's own Status says
  `actors.evidence.test.js` *"is red because it asserts those rows should not be there. On this ruling the DATA is
  correct and the ASSERTION is now wrong."* Same shape — a test pinning data the keeper then ruled on. It is §0's
  second red; not in this packet.
- **The runner moved:** `js-suite.js` now reads **105 green · 4 failed · 0 crashed · 0 silent** against §0's
  103 · 5 · 1. `ask.test.js` accounts for one; `l2-overseer-worker.test.js` counting green is A's R2, in flight in the
  same tree — **my figure was read through a runner that is mid-edit.**
- **HEAD moved to `bba9ab3` during the lap** (the Third Place's commit). `git diff --quiet eb1b121 HEAD -- ask.js
  ask.test.js exo_memory/ASK.md` → unchanged, so the proof holds at the new HEAD.

## 5 · WHAT WAS NOT VERIFIED

- **Machine D.** Everything ran on L. The test no longer reads live data, so it should be machine-independent, but
  that was reasoned, not run on D.
- **A fresh worktree run of the re-pointed test.** The fixture is untracked, so a detached worktree cannot carry it
  until it is committed; the worktree control was used for the proof (§1d), not for the fix. It becomes checkable the
  moment the fixture lands.
- **The js-suite figure** is from A's uncommitted runner (§4) — the per-file `ok` for `ask.test.js` is the part I claim.
- **Whether other tests in `ask.test.js` still read the live store.** Some do, by design (the D092 byte-unchanged
  check reads the real store). I re-pointed only the one the packet named. Any that assert live *values* would share
  this defect; I did not audit them.
- **No judgement on ASK-009's ruling.** The proof needs the clearing to be legitimate in form — keeper's words,
  protocol 2 — not right in substance, and I did not assess the substance.

## 6 · WRONG column

- **W1 — my first cut of the fixture test was weaker than the test it replaced**, and I did not see it until F2 lived.
  Re-pointing a live-data test at a fixture silently drops every property the live data carried *for free*; I carried
  the assertions over and not the thing they were implicitly standing on. Caught by the targeted mutant column, not by
  reading.
- **W2 — nothing further.** The registered falsifier did not fire, and none of this file's figures was corrected
  before filing.

NEXT: librarian re-run §1d's worktree A/B and §3's mutants, then chair commit ask.test.js and the fixture by named paths when both re-derive
