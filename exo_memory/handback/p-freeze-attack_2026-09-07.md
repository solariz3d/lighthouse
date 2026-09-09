# P-FREEZE ATTACK — hand-back. BRAVO, 2026-09-07 ~01:40.

Packet: `exo_memory/loop/packet_l039_freeze_attack_2026-09-07.md` (`4da6e4a`).
Objects read at the file: `exo_memory/librarian/2026-09-06.md` §"L039 MAP" and its 02:00 / 02:27 /
02:32 entries; `packet_seed_plant_2026-09-06.md`, `packet_arrangement_ruling_2026-09-06.md`,
`packet_small_carries_2026-09-06.md`; and, not named in the packet but load-bearing,
`cycle9_preregistration.md`, `cycle9_armA_result.md`, `diversity3_preregistration.md`.

One pass. Dossier row consulted: none was cited to me; the packet's stated reason for the routing
is the arithmetic row (corpus-age shape (c); the dirty-tree override boundary).

---

## 0 · THE VERDICT, UNSOFTENED

**REFUSE THE FREEZE. Do not run the three-arm design. It cannot produce a readable result, and two
of its three defects are arithmetic rather than matters of care — no amount of better briefing fixes
them.**

The three-arm comparison is dead for a reason that has nothing to do with N: **with three subjects,
arm is perfectly aliased with object.** A's sequential-arms correction is right, and its own remedy —
three objects matched for difficulty, one per arm — is what kills the design, because it makes every
between-arm difference simultaneously an object difference with no degrees of freedom left to
separate them. That is combinatorics, not statistics: to see one object under two arms you need two
disjoint sets of readers for that object, and 3 subjects × 3 objects = 9 reader-slots is the entire
supply. The chair's instinct in the packet — *"matching difficulty makes the ceiling/floor problem
worse, not better"* — is correct and the reason is worse than stated: matched difficulty is not a
nuisance, it is the **whole treatment effect**, wearing the planter's judgement as its coat.

And before any of that: **the subject pool is already spent.** Three of three subjects have received
the design or its title, and the third one is me, contaminated by this packet an hour ago. Cycle 9's
own rule — *"knowing something is planted converts an open review into a search, and search dominates
review"* (`cycle9_preregistration.md`, informed-consent section) — makes A, C and B all
non-subjects. The lap has zero clean readers and its design does not know it.

**What I am NOT saying: do not run the instrument.** The instrument is good. Planting against a
sealed key is the first diversity gauge in this room that cannot invert against length, and that is
real. **§10 is a smaller version that costs one object, one dispatch, and no arms, and returns a
number that could come out either way.** Run that. Then, and only with the keeper's word on §10(c),
run an arm comparison that is not confounded.

---

## 1 · THE KILL — the subject pool is spent, and it is measurable

L039's three packets were dispatched at 02:08 on 09-06 before the keeper's hold landed. The
librarian's own record:

> *"All three packets sat QUEUED; the chair re-took the baton and queued a STOP behind each; **the
> panes received packet, then don't start** and all three confirmed HELD with nothing produced."*
> (`grep -n "packet, then don't start" exo_memory/librarian/2026-09-06.md` → line 234)

The audit rows survive in a live pane's transcript:

    grep -o ".\{140\}DESIGN AND PLANT.\{160\}" \
      /c/Users/zackn/.claude/projects/C--Consonance-instances-sibling-0845a868/*.jsonl | head -2

    -> DELIVERED -> a2122153: STOP — DO NOT START P1 · DESIGN AND PLANT.
       DELIVERED -> 6fe15f0a: STOP — DO NOT START P3 · THE ARRANGEMENT RULING.

    grep -rlc "DESIGN AND PLANT\|ARRANGEMENT RULING" \
      /c/Users/zackn/.claude/projects/C--Consonance-instances-*/
    -> librarian, main, sibling-0845a868, sibling-5bf9d657   (4 files)

**The subject ledger, and the run needs three of these to be clean:**

| pane | role in L039 | dose | subject? |
|---|---|---|---|
| E (`a2122153`) | planter | P1 body — the entire plant design | disqualified by rule anyway |
| A (`6fe15f0a`) | subject | P3 body — arms, predictions, falsifiers, *"N ≥ 8 defects planted"* | **BURNT** |
| C (`0845a868`) | subject | P5 body, P2 queued (*attack E's plant*), plus the two rows above in its own transcript | **BURNT** |
| B (`5bf9d657`, me) | subject | this packet — the whole design including the D1/D2 split and the object's likely shape | **BURNT** |

**Clean subjects available: 0 of 3.**

Honest bound on this: A's and E's dose is **recorded, not measured** — `ls */6fe15f0a*.jsonl
*/a2122153*.jsonl` under `~/.claude/projects` returns nothing, so their transcripts are not on this
machine and I could not grep them. What is measured is the delivery rows and C's and my own
exposure. Whoever can reach those panes should run the grep rather than take the librarian's
sentence, which is exactly the discipline this room applies to everyone else.

**And the mechanism deserves naming, because it will recur.** The chair dispatched this attack to me
*because* I was the last pane that had never touched L039. That was the correct routing decision and
it consumed the resource it was selecting for. **In an experiment where the panes are both the
designers and the subjects, every good routing decision spends a subject.** There is no brief that
fixes this — the fix is that subjects must come from outside the design population (§10c).

---

## 2 · THE KILL — arm is perfectly aliased with object, and 3 subjects cannot break it

A's correction forces one of two shapes. Take them in turn.

**(i) Three sealed objects, one per arm.** Then every cell of the design is a unique (object, arm)
pair. Union under arm 1 differs from union under arm 0 by object difficulty **plus** arrangement,
with one observation each. There is no estimator that separates two effects from one number per
cell. This is not weak power — it is **non-identification**, and it does not improve with N, with
better planting, or with a more careful scorer.

**(ii) Fresh subjects per arm.** Correct, and it is the real fix (§10c) — but it is not available
inside the current design, which fixes the subjects to the standing panes.

**Why a Latin square does not rescue it, since that is the reflex answer.** Union is an *object-level*
statistic: it needs ≥2 readers of the *same* object. A 3×3 square gives each subject a different
object per arm, so no arm ever has two readers on one object and union is undefined within an arm.
To get object O under two arms with 3 readers each you need **6 distinct readers of O**, and each
subject may read O only once. Supply is 3. **6 > 3, so the de-confounding is arithmetically
impossible at the current subject count.** That single inequality is the design's obituary.

---

## 3 · THE UNION STATISTIC IS NOT IDENTIFIED — two opposite worlds, one number

Union size is a function of two unknowns: per-reader detection rate *p* and reader correlation. One
number cannot recover two parameters. The magnitude is not academic.

Model (stated so the numbers are checkable and their limits visible): N items, R readers, each reader
finds an item with probability *p*; a share **λ** of items are "objective" — every reader finds them
or none does — and the remaining 1−λ are found independently. **λ=0 is total decorrelation (the
thesis maximally true); λ=1 is total collapse (refuted).** Script in Appendix A; run
`node l039_power.js`.

    decorrelated (lambda=0, p=0.500):  union 7.10 +/- 0.90
    collapsed    (lambda=1, p=0.875):  union 7.03 +/- 0.91
    distribution overlap = 0.961        (1.000 = indistinguishable)

**Total collapse among excellent readers and total decorrelation among mediocre ones produce the same
union number, 96% of the time.** The design's headline statistic cannot tell the thesis's best case
from its worst.

Pairwise overlap, which the map also scores, is the better half — and the design never uses it as
anything but a description. §10 turns it into the test.

---

## 4 · MATCHED DIFFICULTY IS THE FIFTH INVERSION, AND IT INVERTS AGAINST *DIFFICULTY*

The packet told me to watch this move. It is worse than "an unmeasured judgement." Run
`node l039_delta.js` (Appendix B). Arm 1 arranged and fully decorrelated on an object of difficulty
p=0.50; arm 0 null and **fully collapsed** on an object the planter judged equivalent but which is
easier by δ:

    delta   arm0 union (collapsed)   arm1 union (decorrelated)   overlap   verdict
    0.00      4.13                     7.10                       0.216    readable
    0.10      4.93                     7.10                       0.353    readable
    0.20      5.68                     7.10                       0.506    MASKED (coin flip)
    0.30      6.43                     7.10                       0.752    MASKED
    0.39      7.12                     7.10                       0.986    INVERTED
    0.45      7.58                     7.10                       0.731    INVERTED

**A difficulty misjudgement of 0.20 in per-item detection rate reduces the maximum possible contrast
in this experiment — total collapse against total decorrelation — to a coin flip. At 0.39 it
inverts: the collapsed arm outscores the decorrelated one and the room reads arrangement as harmful.**

The seed-plant packet's own §1 claims *"this one cannot invert, because the oracle is a list somebody
wrote down before anyone looked."* That is true of **length**, which is what killed diversity3
(`sed -n '147p' exo_memory/loop/diversity3_preregistration.md` → `referent_overlap 0.0481 0.1510
-0.1029`). It is **false of difficulty**, and A's correction is precisely what introduces difficulty
as a between-arm variable. The four dead gauges were each killed by a nuisance variable nobody had
priced; this would be the fifth, and the nuisance variable is written into the remedy.

And the effect the lap actually hopes to see is not the extreme contrast but a modest shift. Same
object, arrangement moving λ from 1.00 to 0.50:

    arm0 union 4.13   arm1 union 5.60   overlap 0.590

One realization per arm, no replication. **That overlap is the read.**

---

## 5 · FALSIFIER (a) IS A DEGENERACY DETECTOR, NOT A TEST OF THE THESIS — and Cycle 9 predicts it fires

I expected to report that (a) is nearly unfalsifiable and the arithmetic said otherwise; correcting
that here rather than shipping the version I reached for first. Run `node l039_fa.js` (Appendix C):
P(union = best single set), the only condition under which (a) fires, at N=8, R=3:

    lambda=0.00  p=0.50  ->  0.0859        lambda=1.00  any p  ->  1.0000
    lambda=0.00  p=0.70  ->  0.2426        lambda=0.50  p=0.50 ->  0.4507

Required across all three arms, (a)'s false-refutation rate under total decorrelation is
0.0859³ ≈ 0.0006 at p=0.50 and 0.2426³ ≈ 0.014 at p=0.70. **So (a) is a sound *collapse* detector.**
What it is not is a test of the arrangement thesis: it never compares arms, it is binary, and it
says nothing about degree. It answers *"did all three arms totally collapse?"* — which is worth
knowing, and is **not the question the lap was opened to ask.**

**The threat to (a) is not noise, it is the ceiling/floor, and the prior art predicts it.** Cycle 9
arm A: *"D1 (covered class) — CAUGHT, for the correct reason. D2 (uncovered class) — MISSED by the
entire repository. One of two. 225 assertions ran. One fired."*
(`grep -n "225 assertions ran" exo_memory/cycle9_armA_result.md`). If that pattern repeats with a
4/4 class split — every reader finds every D1, no reader finds any D2 — then every reader's set is
identical to the D1 set, union = best single set = 4, and **(a) fires in all three arms and the
thesis is recorded as refuted for a reason that is not arrangement.** Under assumed rates
p_D1=0.95, p_D2=0.05 that exact pattern has probability **0.275** (`node l039_power.js`, §5).

**The D1/D2 split is the design's spine and also its pre-loaded false-refutation path.** Those are
the same feature.

---

## 6 · THE D1/D2 BOUNDARY IS TYPOGRAPHY, NOT COVERAGE

Falsifier (d) asks whether D2 is really uncovered. The answer is that the question is not well posed,
and one instrument shows why. `consonance/tools/cite-check.js` exists (102 instruments total:
`ls consonance/tools/*.js | wc -l` → 102) and its `--run` mode re-executes a cited command and checks
the figure appears in the output. It publishes its own bound in its header:

> *"It guards only formatted figures. A figure written outside the format is invisible to it."*

So the seed-plant packet's canonical D1 item — *a number that does not match its command* — is
covered **iff** the planter writes it with a backticked command beside it, and uncovered iff the
planter writes the same false number in bare prose. Likewise its canonical D2 item — *a citation to a
real line that says something else* — becomes machine-reachable the moment it is written in the
cite-check format.

**E controls which class a defect lands in by a formatting choice.** The class split is therefore not
a measurement of the room's coverage; it is a property of the planter's typography, chosen by the one
body that knows the answer key. That does not merely risk falsifier (d) firing — it means (d) has no
fixed referent to fire against. Any D1/D2 split must be defined by **which instrument, run with which
command, returns which line**, decided and written down before the object is touched.

---

## 7 · THE LEAK IS GIT, NOT THE BOARD — and the design punishes its own best practice

The map guards the board (QUIET phase) and falsifier (c) voids the run *"if any pane's hand-back
cites the key file."* Both miss the actual channel.

1. **The planting diff is a second answer key with none of the first one's protection.** The key is
   committed before dispatch; the object must also be in place. `git log -p -- <object>` and
   `git show <sha>` then display every planted defect, exactly, in a form no rule forbids reading.
   Falsifier (c) triggers on citing `seeded_key_L039.md`; a subject who reads the object's own history
   cites the *object*, and the run is scored as valid.
2. **The shared checkout, not the board, is the exposure surface.** `git status --porcelain` was clean
   repo-wide at the time of this pass and all four panes work against one tree. QUIET governs what
   panes can read *of each other's posts*. It governs nothing on disk.
3. **And the trap that would make this worst: it is triggered by doing the room's job properly.** A
   subject dispatched to review a `loop/` ruling, following this room's own standing rule — re-derive
   every figure, check the record, do not take the summary — will run `git log -p` on the document it
   is reviewing. **The most disciplined reader is the one most likely to read the key, and the design
   would score that reader's inflated set as evidence that arrangement works.** Cycle 9 hit the same
   family and named it: *"The artifact is burned for Arm B. The diff discloses both defects
   completely."* That sentence is in the prior art the map cites.

Minimum fix, and it is cheap: plant in a **worktree or a branch the subjects do not have**, hand the
object to subjects as a **file copy with no history**, and re-state falsifier (c) as *"if any
subject's transcript contains a `git log`/`git show`/`git diff` naming the object or the key, that
subject's set is void"* — which is checkable by grep instead of by honour.

---

## 8 · THE SELF-CATCHABLE-MISS COUNT HAS NO ORACLE, AND ITS JUDGE HAS A STAKE

The keeper's third template line — *the attacker reports which of the author's misses were
self-catchable* — is the best idea in the whole freeze, and I want it kept. Two defects in its current
form, both fixable in one sentence each.

1. **No oracle.** Every other thing landing in this lap is scored against a list written before
   anyone looked. This one is scored by a judgement made after, by a reader who has already seen the
   answer. It is being introduced *in the same lap* as a design whose entire virtue is having a key.
   **Fix: define it by command, not by opinion** — *"an instrument already in this repo, run by the
   author on the files the author touched, returns this miss."* Then `self-catchable` becomes a
   boolean somebody else can reproduce, and its falsifier can actually fire.
2. **The judge has a stake in the direction.** The registered falsifier is *"if the self-catchable
   share does not fall over ten laps, the prompt produces compliance, not attention"* — and the body
   classifying each miss knows that. This is the room's own scoring rule (`no seat scores its own
   work`) applied one level up and currently unapplied. Under the command-based definition in (1) the
   conflict evaporates, which is the second reason to prefer it.

Neither defect requires L039 to run. **Both template halves — the map line and this one — should land
in the return leg regardless of what happens to the experiment**, exactly as the map already says.

---

## 9 · E's DISQUALIFICATION IS NOT A RANDOM 25% — it is the most-detecting reader

The packet says nobody priced it. Priced: the loss is **not** uniform.

E's dossier row, quoted in its own packet: *"the chip/DOM and mutation work — 19/19 mutants including
amendment 4's three, and 17/17 before that, with survivors named rather than counted as caught."*
The task in P4 is *find the planted mutations*. **The pane disqualified is the one whose entire
record is finding planted mutations.** The removal is systematically biased against detection, so it
lowers *p* — the exact parameter §4 shows the design cannot separate from arrangement.

The union cost alone is small (`node l039_power.js` §4): restoring a fourth subject at N=8 lifts
within-object detection power from 0.978→0.987 (λ=1) and 0.538→0.777 (λ=0.5). **That second number is
the real price: a fourth reader is worth about as much as going from N=8 to N=12.** The
disqualification is still correct — Cycle 9's rule stands — but it should be paid by *adding a
subject*, not by running on three.

---

## 10 · WHAT WOULD HAVE TO CHANGE — the smaller version, and it is cheap

**(a) Drop the arms. Run one object, one dispatch, and ask the question that is actually
identified.** Not *"does arrangement decorrelate readers"* — that needs a between-arm comparison this
room cannot afford yet — but ***"are these readers decorrelated on this object at all?"*** That is a
**within-object** question, and it is answerable without any second arm:

> Condition on each reader's observed set size. Under H0 the readers are exchangeable — each set is a
> random subset of the N items of that reader's size. Compare the observed mean pairwise intersection
> to that permutation null. Object difficulty enters only through the set sizes, which are conditioned
> on, **so it cancels.** No matched objects, no unmeasured judgement, no arms.

Power (`node l039_power.js` §4, α=0.05, R=3):

    N= 8  total collapse (lambda=1.00)   power 0.978
    N= 8  half collapse  (lambda=0.50)   power 0.538
    N=12  half collapse                  power 0.773
    N=20  half collapse                  power 0.948
    N=30  half collapse                  power 0.993

**(b) So N ≥ 8 is the wrong bar. Set N ≥ 20.** At N=8 the test sees only total collapse; at N=20 it
sees a partial effect nineteen times in twenty. Twenty plants in one object is more work than eight
and it is the difference between a result and a shrug. If the object cannot honestly carry 20, that
refusal is itself worth more than the run — and E's packet already has the standing to say so.

**(c) The arm comparison needs subjects from outside the design population, and that is the keeper's
word, not ours.** Cycle 9 established the supply and it is not in L039's map at all:

> **T0 — room-instance** (`rooms/…/CLAUDE.md` from `brief/SEED.md`, 9.6 KB): carries the room's
> dynamics and **zero** hits on `muscle`, `TRAINING`, `perturbation`, `planted`.
> **T1 — fresh sibling** (139 KB): 15 / 4 / **0** / **0** — knows a muscle program exists, does not
> know defects get planted. *"Subjects burn **as standing panes**. The room does not burn."*
> (`cycle9_preregistration.md` §1)

That correction is the thing L039's map most needed and did not take from the prior art it cites. It
solves §1 (fresh readers), §2 (one object under two arms with 6 disjoint readers — the inequality
6 > 3 stops binding), and §9 (E's seat replaced rather than subtracted), all at once.

**It is blocked, and Cycle 9 refused to route around the block, so I refuse in the same place:**

> *"Spawning T0/T1 is a new class of instance use. The keeper called for the perturbation test; that
> is not the same as authorising spawns. `9b7671a` hit this and refused to route around it, and I am
> refusing in the same place. ARM A runs without his word. ARM B does not."*

**(d) One structural note the keeper should have before he answers (c), because it changes what he is
authorising.** Arm 1 as written — *"each pane's brief cut to its cited strength"* — is not a
manipulable variable. A pane's cited strength **is** its history, so on standing panes "arrangement"
is a label on the subject, not a treatment applied to it, and the arm can never be separated from
who the pane is. On fresh interchangeable readers the same arm becomes *differentiated briefs,
randomly assigned* — a real, randomizable treatment. **Fresh subjects do not merely clean the
experiment; they are what makes the independent variable exist.**

**(e) Ship the two carries and the two template halves now, out of the experiment's shadow.** The map
already says they land regardless. Nothing in §§1–9 touches them.

---

## 11 · WHAT I DID NOT ATTACK — one pass means gaps, and an unstated gap reads as cleared

- **C's fiftieth-firing question and the whole of P5.** Not examined. The splitter cue, its hook
  location, its test, and whether it is phraseable as a durable question — untouched by this pass.
- **Arm 2 (opposed roles).** I did not open `opposition_preregistration.md` or its three amendments.
  Whether two-prosecute-two-defend is feasible with three subjects is unexamined; §2 kills arm 2 along
  with the others for the confounding reason, but arm 2 may have defects of its own I have not seen.
- **The object.** None exists yet, so difficulty, plausibility, and whether the panes have read it are
  all unassessed. My §4 treats difficulty as a parameter, not as a measurement of any real file.
- **DOSSIER.md.** I quoted E's and A's rows from the packets and did not audit whether the rows are
  accurate. If arm 1 is ever run, the dossier's own accuracy is a load-bearing assumption nobody has
  checked.
- **The 08-17 contradiction-vs-addition scoring axis.** I did not attack it. It survives everything
  above and looks like the most durable part of the design.
- **The P-FREEZE stage itself** — the `frozen` chain row, `lap-row.js`, its gate. Out of scope here,
  and its own abuse condition (*if freeze passes average longer than the laps they gate, the freeze
  has become the work*) is registered and I did not test it. **This pass took roughly 80 minutes
  against a lap that would have run several hours; that is inside the bound, but it is one data
  point and it is mine, and I have a stake in it reading well.**
- **Whether the four panes have in fact never reviewed each candidate object.** Not checkable before
  the object is chosen; the grep that would settle it is the one in §1.

**And the limit on my own numbers, stated plainly.** §§3–5 and §10's power table come from a
**generative model I wrote**, not from measurements of this room. λ and p are not quantities anyone
has estimated here. What is model-**independent** is §1 (measured contamination), §2 (6 > 3, pure
combinatorics), §6 (an instrument's published bound), §7 (git), §8 and §9 (design logic). What is
model-**dependent** is every overlap figure and every power figure — they show the *shape* of the
problem and their exact values should not be quoted as facts about the panes. The scripts are in the
appendices so anyone can change my assumptions and see whether the conclusions move; the two that
matter, non-identification and confounding, do not move, because they are structural.

---

## 12 · THE ONE-SENTENCE ANSWER TO THE PACKET'S OBJECTIVE

**Refused: at three subjects with arm aliased to object, the three-arm L039 returns a union number
that is 96% consistent with both total collapse and total decorrelation, and a difficulty
misjudgement of 0.20 makes even the extreme contrast a coin flip — so it would produce a sentence
either way. Run instead one object, N ≥ 20, one arm, scored by a within-object exchangeability test
(power 0.95 for a half-collapse effect), and take the arrangement comparison to the keeper as a
request for fresh subjects, which is the only thing that makes arrangement a variable at all.**

That sentence could have come out the other way — §5's arithmetic corrected me once already, in
public, above.

---

## APPENDIX A — `l039_power.js`

Run: `node l039_power.js`. Deterministic (seeded LCG), no dependencies, 200,000 trials.
Produces every figure in §3, §5's 0.275, §9's power comparison, and §10's power table.

```js
// L039 power arithmetic. Self-contained, deterministic (seeded LCG), no deps.
// MODEL. N planted items, R readers. p = per-reader per-item detection rate.
// lambda = share of items that are "objective": every reader finds them or none does.
//   lambda = 0 -> total decorrelation (the arrangement thesis's best case)
//   lambda = 1 -> total collapse (the thesis refuted)
let s = 20260907;
const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };

function trial(N, R, p, lambda) {
  const sets = Array.from({ length: R }, () => new Set());
  for (let i = 0; i < N; i++) {
    if (rnd() < lambda) {                      // objective item: all-or-none
      if (rnd() < p) for (const S of sets) S.add(i);
    } else {                                   // idiosyncratic item: independent
      for (const S of sets) if (rnd() < p) S.add(i);
    }
  }
  const union = new Set(); for (const S of sets) for (const i of S) union.add(i);
  let pairs = 0, inter = 0;
  for (let a = 0; a < R; a++) for (let b = a + 1; b < R; b++) {
    pairs++; for (const i of sets[a]) if (sets[b].has(i)) inter++;
  }
  return { union: union.size, sizes: sets.map(S => S.size), meanInter: inter / pairs };
}
function stats(xs) {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length;
  return { mean: m, sd: Math.sqrt(v) };
}
function hist(xs, N) { const h = new Array(N + 1).fill(0); for (const x of xs) h[x]++; return h.map(c => c / xs.length); }
// Overlap coefficient = sum min(p,q) = 1 - total variation distance. 1.00 = indistinguishable.
const overlap = (a, b) => a.reduce((acc, x, i) => acc + Math.min(x, b[i]), 0);

const TRIALS = 200000;
function run(N, R, p, lambda) {
  const u = [], mi = [];
  for (let t = 0; t < TRIALS; t++) { const r = trial(N, R, p, lambda); u.push(r.union); mi.push(r.meanInter); }
  return { u, hist: hist(u, N), su: stats(u), smi: stats(mi) };
}
const f = (x, d = 2) => x.toFixed(d);
console.log('=== L039 POWER ARITHMETIC ===  trials=' + TRIALS + '  seed=20260907\n');

console.log('1. UNION SIZE, N=8 planted items, R=3 subjects (E disqualified as planter)\n');
console.log('   p     lambda   union mean   union sd');
for (const p of [0.3, 0.5, 0.7]) for (const lam of [0, 0.5, 1]) {
  const r = run(8, 3, p, lam);
  console.log(`   ${f(p, 2)}   ${f(lam, 2)}     ${f(r.su.mean)}         ${f(r.su.sd)}`);
}

console.log('\n2. IS UNION IDENTIFIED?  Two opposite worlds, one number.');
const A = run(8, 3, 0.50, 0), B = run(8, 3, 0.875, 1);
console.log(`   decorrelated (lambda=0, p=0.500): union ${f(A.su.mean)} +/- ${f(A.su.sd)}`);
console.log(`   collapsed    (lambda=1, p=0.875): union ${f(B.su.mean)} +/- ${f(B.su.sd)}`);
console.log(`   distribution overlap = ${f(overlap(A.hist, B.hist), 3)}  (1.000 = indistinguishable)`);

console.log('\n3. BETWEEN-ARM COMPARISON. One union number per arm, no replication.');
console.log('   (a) SAME object difficulty (p held equal) - the design as WRITTEN assumes this:');
for (const p of [0.3, 0.5, 0.7]) {
  const n = run(8, 3, p, 0), c = run(8, 3, p, 1);
  console.log(`       p=${f(p, 2)}  decorrelated ${f(n.su.mean)} vs collapsed ${f(c.su.mean)}   overlap ${f(overlap(n.hist, c.hist), 3)}`);
}
console.log('   (b) OBJECTS MATCHED BY JUDGEMENT (p differs between arms):');
for (const [p0, p1] of [[0.6, 0.4], [0.5, 0.4], [0.7, 0.5]]) {
  const arm0 = run(8, 3, p0, 1), arm1 = run(8, 3, p1, 0);
  console.log(`       arm0 collapsed p=${f(p0, 2)} union ${f(arm0.su.mean)}  |  arm1 decorrelated p=${f(p1, 2)} union ${f(arm1.su.mean)}  |  overlap ${f(overlap(arm0.hist, arm1.hist), 3)}`);
}

// THE REPAIR: within-object permutation test. Condition on observed set sizes; object difficulty cancels.
function permNull(sizes, N, reps) {
  const out = [];
  for (let t = 0; t < reps; t++) {
    const sets = sizes.map(k => {
      const idx = [...Array(N).keys()];
      for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
      return new Set(idx.slice(0, k));
    });
    let pairs = 0, inter = 0;
    for (let a = 0; a < sets.length; a++) for (let b = a + 1; b < sets.length; b++) {
      pairs++; for (const i of sets[a]) if (sets[b].has(i)) inter++;
    }
    out.push(inter / pairs);
  }
  return out;
}
function power(N, R, p, lambda, reps = 600) {
  let rejects = 0, valid = 0;
  for (let t = 0; t < reps; t++) {
    const r = trial(N, R, p, lambda);
    if (r.sizes.some(k => k === 0 || k === N)) { valid++; continue; }   // degenerate: cannot reject
    const nullDist = permNull(r.sizes, N, 1500);
    const ge = nullDist.filter(x => x >= r.meanInter).length;
    valid++; if ((ge + 1) / (nullDist.length + 1) <= 0.05) rejects++;
  }
  return rejects / valid;
}
console.log('\n4. THE REPAIR, PRICED. Within-object permutation test (no cross-arm comparison):');
console.log('   H0 = readers are exchangeable given their set sizes; reject => collapse detected.');
for (const N of [8, 12, 20, 30]) for (const lam of [1, 0.5]) {
  console.log(`       N=${String(N).padStart(2)}  lambda=${f(lam, 2)}  p=0.50  R=3  power = ${f(power(N, 3, 0.5, lam), 3)}`);
}
console.log('   and with a 4th subject restored (E not disqualified), N=8:');
for (const lam of [1, 0.5]) console.log(`       N= 8  lambda=${f(lam, 2)}  p=0.50  R=4  power = ${f(power(8, 4, 0.5, lam), 3)}`);

console.log('\n5. CEILING AND FLOOR. Cycle 9 arm A: D1 caught, D2 missed by the whole repo.');
console.log('   P(every reader finds every D1, no reader finds any D2 | p_D1=0.95, p_D2=0.05, R=3, 4+4):');
{
  let hit = 0; const T = 200000;
  for (let t = 0; t < T; t++) {
    let ok = true;
    for (let i = 0; i < 4 && ok; i++) for (let r = 0; r < 3 && ok; r++) if (rnd() >= 0.95) ok = false;
    for (let i = 0; i < 4 && ok; i++) for (let r = 0; r < 3 && ok; r++) if (rnd() < 0.05) ok = false;
    if (ok) hit++;
  }
  console.log(`       = ${f(hit / T, 3)}`);
}
```

## APPENDIX B — `l039_delta.js`

Run: `node l039_delta.js`. Produces §4's masking/inversion table.

```js
// How far can "matched for difficulty" be wrong before the union comparison MASKS or INVERTS?
let s = 20260907;
const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
function trial(N, R, p, lambda) {
  const sets = Array.from({ length: R }, () => new Set());
  for (let i = 0; i < N; i++) {
    if (rnd() < lambda) { if (rnd() < p) for (const S of sets) S.add(i); }
    else for (const S of sets) if (rnd() < p) S.add(i);
  }
  const u = new Set(); for (const S of sets) for (const i of S) u.add(i); return u.size;
}
const T = 200000, N = 8, R = 3;
function dist(p, lam) {
  const h = new Array(N + 1).fill(0); let m = 0;
  for (let t = 0; t < T; t++) { const u = trial(N, R, p, lam); h[u]++; m += u; }
  return { h: h.map(c => c / T), mean: m / T };
}
const overlap = (a, b) => a.reduce((acc, x, i) => acc + Math.min(x, b[i]), 0);
const f = (x, d = 3) => x.toFixed(d);

console.log('Arm 1 = ARRANGED, fully decorrelated (lambda=0), object difficulty p=0.50.');
console.log('Arm 0 = NULL, fully COLLAPSED (lambda=1), object EASIER by delta.');
console.log('The design reads "arm1 union > arm0 union" as arrangement working.\n');
console.log('  delta   arm0 union (collapsed)   arm1 union (decorrelated)   overlap   verdict');
const arm1 = dist(0.50, 0);
for (const d of [0.00, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.39, 0.45]) {
  const arm0 = dist(Math.min(0.5 + d, 1), 1);
  const ov = overlap(arm0.h, arm1.h);
  const v = arm0.mean >= arm1.mean ? 'INVERTED' : ov > 0.5 ? 'MASKED (coin flip)' : 'readable';
  console.log(`  ${f(d, 2)}    ${f(arm0.mean, 2).padStart(6)}                  ${f(arm1.mean, 2).padStart(6)}                    ${f(ov)}     ${v}`);
}
console.log('\nThe effect the lap actually hopes to see is a MODEST shift, object held identical:');
const a = dist(0.50, 1), b = dist(0.50, 0.5);
console.log(`  arm0 union ${f(a.mean, 2)}   arm1 union ${f(b.mean, 2)}   overlap ${f(overlap(a.h, b.h))}`);
```

## APPENDIX C — `l039_fa.js`

Run: `node l039_fa.js`. Produces §5's table.

```js
// Falsifier (a): "if the union never exceeds the best single pane's set, the thesis is refuted."
// How often can (a) fire at all?
let s = 20260907;
const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
function trial(N, R, p, lambda) {
  const sets = Array.from({ length: R }, () => new Set());
  for (let i = 0; i < N; i++) {
    if (rnd() < lambda) { if (rnd() < p) for (const S of sets) S.add(i); }
    else for (const S of sets) if (rnd() < p) S.add(i);
  }
  const u = new Set(); for (const S of sets) for (const i of S) u.add(i);
  return { union: u.size, max: Math.max(...sets.map(S => S.size)) };
}
const T = 200000, N = 8, R = 3;
console.log('P(union == best single set) -- the ONLY condition under which falsifier (a) fires\n');
console.log('  lambda   p      P(a fires)');
for (const lam of [0, 0.25, 0.5, 0.75, 1]) for (const p of [0.3, 0.5, 0.7]) {
  let hit = 0;
  for (let t = 0; t < T; t++) { const r = trial(N, R, p, lam); if (r.union === r.max) hit++; }
  console.log(`  ${lam.toFixed(2)}     ${p.toFixed(2)}   ${(hit / T).toFixed(4)}`);
}
```

---

    OBJECTIVE:  met — the design was read hostilely and is REFUSED before it spends four seats, with
                a repair path priced in §10 and the two template halves preserved in §8.
    FALSIFIER:  the packet's own — if the run completes and its result cannot be stated in one
                sentence that could have come out the other way, this pass missed what it was for.
                Since I am refusing the run, the honest form of my falsifier is: if the smaller
                version in §10 is run and returns a result that IS readable in one sentence at
                N >= 20 with a within-object test, §§3-5 were right; if it returns a shrug, I was
                wrong about which repair mattered and the fault was the instrument, not the arms.

Nothing committed. No source file touched. Scripts live in the session scratchpad and verbatim above.

— BRAVO (`5bf9d657` / `12fb81f6`)
