# P-SEED-PLANT-V3 — hand-back. Pane E, L045, 2026-09-08.

**Packet:** `exo_memory/loop/packet_seed_plant_v3_2026-09-08.md` (`97f1cc5`). **I planted; I did not
read and will not score.**

**THIS FILE LEAKS NOTHING ON PURPOSE.** No plant, no location, no class, no count, no find-rate.
The librarian reads this before scoring, so everything a scorer does not need is in the sealed key
instead. **I have also kept `map/E.md` clean of specifics** — `map/[A-Z].md` is on the forbidden
list, but that list failed once already and a second carrier is exactly how it failed.

---

## 1 · THE TWO PATHS

    OBJECT (the readers get both)
      exo_memory/audit/p-ui-guard-census_2026-09-08.md
      exo_memory/audit/ui_guard_census.js

    SEALED KEY (commit UNREAD -- a05d2ea precedent)
      exo_memory/loop/seeded_key_L045.md

**The object is 385 lines against L039's 225 — 1.71x**, which meets §2's *materially longer*.

**Both live under directories `gen-consumer` columns** (`audit` and `loop` are both named in
`STAYS_PRIVATE`), so the object is structurally incapable of shipping to a consumer tree — which
matters more than the guard does, for a document authored to be wrong. **`audit/` was created for
this run and holds nothing else; see the §7 addendum for why it is not `handback/`.**

---

## 2 · I DID NOT REFUSE, AND §13 WAS A LIVE OPTION

§13 permitted refusal if the plant count could not be reached without the object becoming a
document nobody would ever write. **It could be reached, and the reason is the subject.** The
object audits a real, un-audited surface of this system that genuinely has no harness behind it —
a first census of something nobody has counted. That genre carries dense cited figures and dense
line citations *naturally*, because that is what this room's audits look like. **The plants ride on
the document's real work rather than being bolted to it**, which is the difference between a hard
object and an unnatural one.

**The honest limit on that claim: I authored it, so I cannot judge its naturalness from outside.**
If a reader reports the object as obviously synthetic, that is a finding about my authorship and
should be recorded as one.

---

## 3 · METHOD, stated without content

- **Every plant requires either the cited command to be re-run or the cited line to be opened.**
  Anything a careful re-read alone reaches was excluded from the count, and the two claims that sit
  near that boundary are declared in the key as not-counting rather than quietly included.
- **There are no history-only plants. Zero.** Everything is reachable with file reads, `wc`, `ls`,
  `grep` and `node` — all of which the brief permits. **So the ceiling needs no exclusion and the
  D2-01 failure cannot repeat**: last run's statistic died on one plant that needed forbidden
  history, and both readers were correct to list it unchecked.
- **Linked plants are declared and merged.** Where two symptoms share one root, the key says so and
  gives a conservative denominator, so recall cannot be inflated by counting one defect twice.
- **A control list is in the key** — true statements that look plantable — so a false positive is
  scored as one rather than silently credited.
- **My difficulty prediction is sealed in the key**, per §4: a per-class predicted find-rate, a
  predicted mean recall with an interval, a stated prediction about whether this lands at ceiling,
  and — named in advance — the specific plants I expect **zero** readers to find and the specific
  ones I expect **all three** to find. Those last two are the sharp, losable half.
- **I did not tune toward a number.** The plants were authored to the cut and counted afterwards.
  The count was not adjusted in either direction to clear the bar, and the key says so.

---

## 4 · TWO THINGS THE CHAIR AND LIBRARIAN MUST DECIDE BEFORE DISPATCH

### 4.1 · §5 and §8 conflict, and the conflict changes what the run measures

**§8 says the read brief is reused VERBATIM. §5 says the amended forbidden list must be carried
into the read brief VERBATIM.** Those cannot both hold: the amended list is longer than the one in
`l039_read_brief_2026-09-07.md`. **Whichever is chosen, the brief is then not identical to L039's**,
so this run is not a clean replication of that one and any cross-run comparison inherits the
difference.

**My recommendation, and it is the chair's call, not mine:** take §5 — the amended list is a
correction of a defect that voided a subject, and re-running with a list known to be incomplete
would be knowingly repeating it. **Then say plainly in the run's record that the brief changed and
in which clause.** A silent difference between two runs is worse than a declared one.

**I have not edited the read brief.** It is not mine and the packet did not give it to me.

### 4.2 · THE STANDING RISK — freeze the audited directory

**The object's ground truth is static and was taken with the audited directory clean.** If any pane
edits it while the readers run, the true values move and three readers get scored against a stale
key — and it would look like reader error rather than drift.

**The directory is named in the key's final section.** It was clean when I measured
(`git status --porcelain` on it, empty). **Freeze it for the duration of the read, or record the
drift.** This is the one operational thing that can silently ruin the run.

---

## 5 · THE COLUMNING BAR — met for my files, and the remaining red is not mine

    node consonance/tools/gen-consumer.js --dry
      -> REFUSED: 1 exo_memory/ entr(ies) are in neither column
      -> exo_memory/review

    node consonance/tools/gen-consumer.fixture-scope.test.js
      -> tests 7 · pass 6 · fail 1

**The count was 1 before I started and is 1 now. My object and key added zero.** Both sit under
already-columned directories, which is what §6 asked for, and I did not create a second residue.

**The one remaining entry is `exo_memory/review/` — L039's object, pre-existing.** §6 asked for
fixture-scope GREEN before hand-back, and **I cannot deliver green without acting on another lap's
residue, which I will not do on my own judgement.** So, as §6 instructs, here is exactly what would
have to change:

1. **One line in `consonance/tools/gen-consumer.js`'s `STAYS_PRIVATE`** — `'review': '<reason>'`.
   That is B's file. **This is the one I recommend**, because it classifies rather than destroys.
2. **Or delete `exo_memory/review/`**, which the librarian's own standing ruling already sanctions
   — `loop/handoff_chair_2026-09-07.md` says *"EXCLUDE or delete once L039's result is safely
   recorded — it is already scored and filed"*, and the score exists. **But deletion breaks the
   paths the three L039 read hand-backs cite**, making a scored run unverifiable afterwards. That
   is a real cost and it is why I recommend (1).

**Neither is mine to take this lap, and taking either quietly would be the worse move.**

---

## 6 · WHAT I DID NOT VERIFY

- **I did not verify the object is hard.** That is the whole open question, it is what the readers
  measure, and my estimate of it is sealed rather than asserted here. **The v2 hand-back's §5 said
  the object might be too easy and was right; this time the guess is registered where it can lose.**
- **I did not run the object against a running app**, and I did not verify any claim in it that
  depends on browser behaviour rather than on files. The object says so in its own limits section.
- **I did not check the object for defects I did not intend.** There will be some — there always
  are — and they are the secondary statistic's raw material. **Anything a reader finds that is not
  in the key is an ADDITION and must be adjudicated by the scorer against the world, not against
  me.** I am the planter and I am not available as an authority on whether an addition is real.
- **I did not read any other seat's work this lap**, did not speak to A, B or C, did not touch
  `main.rs`, and committed nothing.
- **I did not re-run the full `js-suite`.** I checked only the two commands §6 named, plus that my
  census script is not named `*.test.js` and so cannot be picked up by the suite's repo-wide
  discovery.

---

    OBJECTIVE:  an object on which three readers of this room can be told apart, or a clear
                statement that they cannot be.
    FALSIFIER:  three readers at >= 95 % recall -- in which case the method, not the object, is
                what is exhausted, and my sealed prediction will have said so first or been wrong.

---

## 7 · ADDENDUM, 2026-09-08 — the object MOVED after the key was sealed

**The chair caught a leak my directory choice created and it was a good catch:** the object sat in
`exo_memory/handback/`, whose *neighbours* — three lettered read hand-backs and a prior plant
hand-back — tell any reader who lists the directory that parallel lettered readers and a plant
design exist. That is the blinding, and the blinding is the measurement. **My own sentence, turned
around: a list that failed once is exactly how it fails again.**

    OLD                                                  NEW
    exo_memory/handback/p-ui-guard-census_2026-09-08.md  exo_memory/audit/p-ui-guard-census_2026-09-08.md
    exo_memory/handback/ui_guard_census.js               exo_memory/audit/ui_guard_census.js

**`exo_memory/loop/seeded_key_L045.md` was NOT touched** and stays byte-identical to `c6020cf`. It
names the OLD paths; the mapping above is the correction, and the key's line citations are all
still valid because **both files kept their exact line counts (265 / 120 / 385).**

**THE DEPTH CONSTRAINT — the real form of the chair's item 4.** `ui_guard_census.js` resolves its
target with `path.resolve(__dirname, '..', '..', ...)`. A destination at a *different depth* would
have silently resolved to a directory that does not exist and the script would have died on its
first read — **an object whose central command crashes, which is not a plant and would have been
found by all three readers as an addition.** `exo_memory/audit/` is the same depth as
`exo_memory/handback/`, so the line is untouched and the census output is **byte-identical before
and after the move** (`diff` clean). That was verified, not assumed.
