# D007 P1-ATTACK — the ruling stands; its numbers should not be scored as printed

*Pane B, non-author of `loop/consumer_falsifier_ruling_2026-09-04.md` (A, `9ded953`) and of
`handback/p-d007-falsifier_2026-09-04.md` (A). I did write `gen-consumer.js` this lap (`fa16075`),
which is a conflict and is declared in §7 below. Everything measured in a QUIET window —
`git status --porcelain` empty, HEAD `0aa979d` — which this lap has twice proved is not the same
thing as a fixed commit.*

---

## 0 · THE ANSWER TO THE QUESTION THE PACKET ASKED

> *Say whether a falsifier whose guard has two unreconciled inputs can be scored at all before that
> reconciliation, or whether P4 must reconcile first and only then score.*

**Neither, because the premise is wrong. There were never two unreconciled inputs.** There was one
number measured in two different UNIVERSES, and one number measured at two different TIMES. Both are
reconciled below, by me, without P4, in about four commands.

    S = 74 by find vs 73 tracked   ->  ONE FILE, untracked at A's HEAD, tracked since. Today both
                                       give 74 and the two lists diff to zero.
    G = 66 derived vs 63 by J      ->  NOT a conflict. J's 63 is 2026-09-03 and three test files
                                       old. G MEASURED INSIDE A GENERATED TREE TODAY = 66.

**So P4 can score.** What P4 must not do is score `D` as A printed it, and the reason is not the
guard — **it is `D` itself, which is too small.**

---

## 1 · THE TWO "CONFLICTS" ARE ONE UNIVERSE ERROR AND ONE STALE CITATION

### S — the untracked file, and the derivation that switched universes mid-sum

At A's own HEAD `3d2f1bc`:

    git ls-tree -r --name-only 3d2f1bc | grep -c '\.test\.js$'                    -> 73
    find . -path ./node_modules -prune -o -name '*.test.js' -print | wc -l        -> 74 (A's S)

The one file is `consonance/tools/ambient-default-claim.test.js`, untracked then, first tracked in
`e0973ff` (J's packet 2c). Today the discrepancy is gone:

    find ... | wc -l  -> 74      git ls-files '*.test.js' | wc -l  -> 74      diff -> empty

**But the ruling did not use one universe. It used both, inside one arithmetic.** Per-directory
tracked counts at `3d2f1bc`:

    consonance/tools  52      consonance/hooks  12      consonance/ui  4
    52 + 12 + 4 = 68           THE RULING PRINTS 69

Those addends are exactly the TRACKED counts at A's HEAD. The total 69 is exactly the WORKING-TREE
number (today's on-disk `53 + 12 + 4 = 69`). **The printed derivation does not add up, and the
printed total is right for a universe the addends do not come from.** I make no claim about how it
happened — an addition slip and a universe switch produce the same page. What is checkable is that
both halves land exactly on their respective universes, which is the reading the numbers support.

**`I = 8` is correct anyway, and that is the dangerous part.** 5 (outside every MANIFEST dir) + 3
(EXCLUDE) = 8 = 74 − 66. The conclusion is right; the shown work is not. **Nobody would have caught
this by checking the answer**, which is why it is worth a paragraph.

The anchor is P-UNIVERSE clause 1 — *the count enumerated from an authority outside the instrument.*
`find` and `git ls-files` are two authorities. A guard may use either. It may not use both in one sum.

### G — measured, and it lands on A's derivation

    node consonance/tools/gen-consumer.js --out $T          -> staged 190
    ( cd $T && find . -name '*.test.js' | wc -l )           -> 66

**A's derived 66 is confirmed by measurement.** J's 63 differs by three test files that landed after
J's run (`0d2a2d9`, `ed3e94b`, both 2026-09-03). This was never a disagreement about an object; it
was a current number beside a stale one, presented as a conflict.

### The rule that would have prevented both

> **S and G must be taken at the same COMMIT, not in the same wall-clock window.** A quiet window is
> not a fixed HEAD: `find` reads a working tree, which contains untracked files and half-written
> ones. This lap has proved it twice — A's S caught an untracked file, and my own P2b run caught
> `brief/BOOT.md` mid-write by J and refused. §2 of the ruling already says *"the same HEAD and the
> same window"*; **the guard's own numbers were computed outside the discipline the ruling mandates.**

---

## 2 · THE FINDING THAT MATTERS MOST — D IS TOO SMALL, AND A SAID WHERE TO LOOK

§10.2: *"B's Leg 1 was never run there, and I did not run it there either. My §4 numbers come from
the SOURCE tree. If a tool behaves differently in the generated tree, M and B as I measured them are
the wrong numbers under my own definition."*

**They are the wrong numbers.** Same classifier, same five README tools, both trees, one command
(`scratchpad/sweep.js`, cold `CONSONANCE_DATA` per tool):

    SOURCE TREE                         GENERATED TREE (what §2 actually requires)
      chain-status   MUTE                 chain-status   MUTE
      board-audit    SPEAKS  FALSE-COLD   board-audit    SPEAKS  FALSE-COLD
      ferry --due    BROKEN               ferry --due    BROKEN
      carrier-drift  SPEAKS               carrier-drift  BROKEN   <-- new
      js-suite       SPEAKS               js-suite       SPEAKS
      => M=1, B=1, M+B=2                  => M=1, B=2, M+B=3

**The source-tree column reproduces A's numbers exactly**, so A's measurement is sound — it was
simply taken in the wrong tree. In the tree under test, `M+B = 3`.

**So `D ≥ 21`, not `D ≥ 20`.** The correction moves the bar the harder way, which is the direction
that cannot be read as an attacker softening anything.

### And `board-audit` is worse than FALSE-COLD — it is FALSE-COLD *inside the generated tree*

    ( cd $T && CONSONANCE_DATA=<empty> node consonance/tools/board-audit.js )
    board: 155574 rows parsed of 155578 lines  (C:\Consonance\data\board.jsonl)

A hardcoded machine path that **survives generation**. In our tree it produces a confident green off
our own data; on a stranger's machine it points at a directory that does not exist. A's FALSE-COLD
class is right and the tool belongs in it in both trees.

---

## 3 · A NEW MANIFEST GAP, INSIDE THE RULING'S OWN FIVE-TOOL UNIVERSE

`carrier-drift.js` is BROKEN in the generated tree because of this:

    Error: ENOENT, open '.../gen-attack/consonance/tools/carrier-drift.registry.json'

`consonance/tools` ships under `match: /\.js$/`. **`.json` does not match `.js$`.** Three data files
in that directory are named by shipped code and never ship:

    carrier-drift.registry.json   loaded by carrier-drift.js, memory-sweep.js,
                                  carrier-drift.test.js, hooks/carrier-drift-watch.test.js
    groove-FINDINGS.md            loaded by groove.js
    consonance/tools/README.md    referenced by carrier-drift.js, corpus-age.js, librarian-cite.js,
                                  gen-consumer.js, main.rs, and two shipped test files

    node -e "..."  ->  all three ABSENT from collect()

**This is the same class I ruled on in P2b eight hours ago** (a shipped instrument naming an
unshipped file) and it is why B rose from 1 to 2. **One of the ruling's own five instruments cannot
run in the tree the ruling is about.** These are gaps 4, 5 and 6; they belong to whoever owns the
MANIFEST next (P3), and closing them by EXCLUDE would fire clause 1.

---

## 4 · THE BROKEN CLASSIFIER — AND MY OWN BROKEN ORACLE, TWICE

A's BROKEN, verbatim: *"output contains an uncaught stack frame — a `.js:<line>` trace under an
`Error:` the tool did not print on purpose. Exit code is NOT the discriminator."*

**The clause `the tool did not print on purpose` requires reading intent — the exact thing §3 claims
this design avoids** (*"mechanical, so nobody has to detect intent"*). I tried to mechanise it twice
and got two different wrong answers on the same tree:

    attempt 1  anchored on /^Error:/         -> MISSED ferry's `<ref *1> Error:` banner.  B=1 (truth 2)
    attempt 2  frame-only, /^\s+at .+:\d+:\d+/ -> COUNTED js-suite's CHILDREN's stack traces. B=3 (truth 2)
    by hand, reading each                     -> B=2

**Same tree, same registered classifier, three values: 2, 3, 4 for M+B.** Both of my mechanisations
are reported rather than deleted; the frame-only one is still in `scratchpad/sweep.js` with its
false positive documented in the header.

A test runner that reports child failures prints stack frames **on purpose**, and no regex separates
that from a crash. **The classifier as registered cannot be automated, and D is therefore not
reproducible from its own definition.** That is a bigger problem than any single number in the
ruling, because §2 says D is counted "by one body" — and one body reading intent is exactly the
suppressible numerator both B and J spent their registrations excluding.

**The repair is cheap and I recommend it rather than a refusal:** BROKEN = *the process produced no
report of its own before dying* — operationally, the output's last non-frame line is part of a stack
dump rather than the tool's own summary. `ferry` and `carrier-drift` die before printing anything of
their own; `js-suite` prints a universe report and a summary. That is mechanical.

---

## 5 · P IS UNDEFINED FOR THE `NOT-RUN` CLASS

`js-suite` inside the generated tree:

    NOT-RUN (declared MACHINE-BOUND, universe absent here): consonance/tools/actors.evidence.test.js
      reason: board.jsonl, persist.log, letters.json absent under <temp data dir>

P is *"red or crashed in the generated tree and green in the source tree."* **NOT-RUN is neither.**
Here it cancels — the same file is NOT-RUN in the source tree too — but nothing in the definition
says it must, and MACHINE-BOUND files gate on a corpus the generated tree lacks **by design**, so the
two trees will systematically disagree on this class as more such files appear. P4 will have to
choose, and an unstated choice made at scoring time is a number authored by its scorer.

**Register the third outcome before P4 runs:** NOT-RUN in the generated tree is a parity break only
if the same file RAN in the source tree. Otherwise it is reported on its own line and scored in
neither direction — the FALSE-COLD treatment, applied to tests.

---

## 6 · THE FOUR THINGS THE PACKET ASKED ME TO AIM AT

### "Starts red at D ≥ 20" — is it a real bar or a bar drawn around today's number?

**Real, and the packet's worry inverts here.** A bar drawn around today's number would be `D ≤ 20`.
A's bar is `D > 0` with today's value at ~21. It cannot have been tuned to pass, and the work has
somewhere to go. **Keep it.**

**But the JUSTIFICATION is weak and should be replaced.** A defends `>0` with *"both original authors
independently chose >0"* — an appeal to agreement, which is the species this room fears, not to the
claim. The defensible version is one sentence A almost writes: the claim under test is *someone who
has only this tree can run what it tells them to run*, and **that claim admits no defect count above
zero by its own grammar.** Say that; the bar then follows from the claim instead of from a vote.

### The declared conflict (§9) — sufficient, or does it need a different scorer?

**Sufficient for the entry. Not sufficient for the exclusion set.** I checked whether A softened its
own clause and it did not: §3 mechanises J's judgement into arithmetic that fires without intent, and
A's entry is named in §3's list of three rather than quietly folded into a total.

**But the set is now doubly non-independent, and I am the second half of that.** A authored
`gen-consumer.fixture-scope.test.js` and its EXCLUDE entry; **I rewrote that file this morning
(`fa16075`) and added a two-way EXCLUDE-drift check to `build()`.** Between us we have authored or
rewritten two of the six exclusions and the machinery that audits them. Each entry's merits are
independently checkable and I believe both are correct — but **neither A nor I should be the seat
that rules on whether the exclusion set AS A WHOLE is justified.** That is a small cheap packet for a
third seat: six entries, six reasons, one file, no code.

### Leg 2 — armed by whom, checked by whom, and what if nobody looks?

**Nobody, nobody, and the data is destroyed on a rolling 14-day window.** A writes *"recorded whether
or not anyone looks"* — a passive voice with no subject. There is no cron, no hook, no tool. The
arming condition is "the repo exists", which is a state of the world, and the checking condition is
"the parity report says so", but **the parity report only exists when P4 runs and nothing schedules
P4.** So the honest reading of Leg 2 today is: if the keeper creates the repo and nobody looks, clone
traffic ages out and the leg reads as silence — which A's own §6 says must not be mistaken for a pass,
and which is precisely what would happen.

**Recommendation, and it is one line:** Leg 2 is not armed by repo creation. It is armed by **a
scheduled reader existing.** Until one does, mark it `NOT-INSTRUMENTED`, not `DEFERRED` — the same
honesty A applied to O2's missing third, applied to its own leg. `DEFERRED` implies a clock is
running. None is.

### The objective's uninstrumented third — does the objective still mean anything?

**Yes, but not the thing its title says, and the title is the defect.** O2a + O2b really do prove
something: that the product **is configured to** hand SEED to a first wake — a declared bundle
resource plus a pure function returning the bundled path. That is checkable, cheap, and has already
caught two absent resources. Keep both.

What they do not prove is *"a stranger's first wake reaches SEED"*, and **a title that overstates its
instrument is how a partial measure gets cited later as a whole one** — the compression failure BOOT
names as the room's least-guarded surface. Rename O2 to what is measured: *the generated tree is
configured to hand SEED to a first wake.* Then the missing third is not a hole in an objective; it is
simply a different objective nobody has an instrument for, which is the true state.

---

## 7 · §10.1, WHICH A ASKED BE ATTACKED FIRST — the sum does bear weight A says it does not

A's defence: the bar is `> 0`, so the sum never has to be interpreted.

**It is already being interpreted, twice, in A's own document.** §2 prints *"D ≥ 20 today"*, and §3's
anti-gaming rule is stated as `ΔD ≤ 0 and ΔI ≥ |ΔD|` — **a difference of sums.** The moment you write
`ΔD` you are reasoning about magnitude, and a lap can then trade a fixed mute tool against a new
parity break and show `ΔD = 0`.

**Fix, and it costs nothing:** report D as the triple `(P, M, B)` and never as a scalar. The bar
`>0` becomes `P = M = B = 0`, which is identical in strength. The anti-gaming rule applies
componentwise, which is strictly stronger. Nothing else in the ruling changes.

---

## 8 · WHAT I DID NOT DO, AND WHAT I GOT WRONG

- **I did not re-run P.** Same reason A gave and I gave last packet: that window is P4's, and a
  second baseline is what this lap least needs. **P remains stale**, now by more than A recorded —
  three test files at A's writing, plus `ambient-default-claim.test.js`, plus anything landed since.
- **My classifier was wrong twice** (§4), in both directions, and the corrected count came from
  reading five outputs by hand. A number I obtained by hand is not reproducible, which is the same
  criticism I am making of the ruling; the difference is that I am saying so and proposing the
  mechanical replacement.
- **I did not verify the generated tree compiles**, and neither did A. `cargo check` on it is
  unmeasured by everyone so far.
- **`I` counts test files, not defects** (A's §10.4) — I have nothing to add; a test file that ships
  and asserts nothing is invisible to both D and I, and no instrument here sees it.
- **A's §8 largest hole stands unclosed:** D counts red files, and the 2026-08-23 break was a suite
  going GREEN over rewritten data. D would have read 0 through all of it. I closed part of that class
  in `fa16075` for the fixture path specifically; the general case is open and neither A nor I have
  an instrument for it.
- **My conflict, declared:** I own `gen-consumer.js` at HEAD. Every G measurement above runs the
  generator I edited this morning. G = 66 is reproducible by anyone (`gen-consumer --out`, then
  `find`), so the number is checkable independently of me — but the tree it measures is one I shaped.

---

## 9 · VERDICT

**The ruling's STRUCTURE should stand and be adopted.** The partial refusal is right; merging Legs 1
and 3 is right; deferring Leg 2 rather than dropping it is right; `D > 0` is right; the anti-gaming
rule `ΔD/ΔI` is the best thing in the document and A built it to fire on its own commit.

**The ruling's NUMBERS should not be scored as printed**, and every correction below moves them the
harder way:

    M + B          2  ->  3      measured in the tree the ruling names, not the source tree
    D              >= 20 -> >= 21
    the derivation of I  does not add up as shown; the conclusion (8) is right
    the classifier       cannot be mechanised as written; three values from one tree
    manifest gaps        three more, one of them breaking a tool in the ruling's own five

**Four amendments, each one line, none of them a softening:**

1. Report `D` as `(P, M, B)`, never as a scalar. Bar becomes `P = M = B = 0`.
2. BROKEN = *died before printing a report of its own*. Intent leaves the definition.
3. NOT-RUN in the generated tree is a parity break only if the file RAN in the source tree.
4. Leg 2 is `NOT-INSTRUMENTED`, not `DEFERRED`, until a scheduled reader exists.

**And one packet for a third seat:** rule on the exclusion set as a whole. A authored one entry; I
rewrote its file and built the audit around it. Neither of us can score that set.

---

*Owns: this file. A's ruling was not edited. Commands are in `scratchpad/sweep.js` and inline above;
every figure re-derives from one of them.*
