
# Cues the human can see — REGISTRATION of the visible-channel line (L018 PACKET C)

**Seat:** CHARLIE, chair-dispatched. **Written here and not by the chair because the idea was the
chair's.** **Objects:** the L017 return leg at `27b307a` (`exo_memory/librarian/2026-08-30.md`, the
ruling at its ~06:25 section) and `exo_memory/loop/chain_indicator_idea_2026-08-30.md` at `1ecc56a`.

**REGISTRATION ONLY. Nothing was built. `consonance/hooks/` and `consonance/tools/` were read, not
written.**

**THE RETURN, first.** Register — **not** the refusal the chair left open, for the reason in §3-A5.
But the first instrument does **not** survive my attack in the form the idea file proposes, and the
registration below changes it before it is built rather than after: **the chain indicator must be
exception-triggered, not a status line.** The room's one working visible cue is exception-triggered;
the room's one measured habituation failure is a status line; the idea file proposes a status line and
cites the exception-triggered hook as its model. That is §3-A1 and it is the load-bearing finding here.

---

## §1 — WHAT THE LINE IS, and the ruling it rests on

**The line, named:** *cues a second party can see.* Per the librarian's L017 ruling, this is **not** a
face of focality and **not** a third axis of B's 2×2. Focal/nonfocal is a claim about the **seat's own**
retrieval at the event. Visibility is a claim about whether a **second party** receives the cue and can
act — the **second vantage**, the room's one measured error-catcher.

**The cut is exact and comes from B's design defect, which is what makes it registerable rather than
rhetorical:** PreToolUse fires *after* the dispatch text is composed. At that one event, a print cannot
change the seat's already-composed text, but a `systemMessage` **can** change what the keeper does. Same
hook, same moment, two parties, two outcomes. That is a mechanism split, not a re-labelling.

### 1a · The channel count, re-derived — and the units corrected

```
grep -ro "additionalContext" consonance/hooks/*.js | wc -l   ->  32   occurrences
grep -ro "systemMessage"     consonance/hooks/*.js | wc -l   ->   3   occurrences
grep -rl "additionalContext" consonance/hooks/*.js | wc -l   ->  11   files (of 23 hooks)
grep -rl "systemMessage"     consonance/hooks/*.js | wc -l   ->   1   file  (dispatch-gate.js)
```

**"32:1" compares occurrences to files.** The honest forms: **11:1 by file, 32:3 by occurrence, and
32:2 by live emission** — one of dispatch-gate's three `systemMessage` hits is a comment
(`dispatch-gate.js:32`); the two real emissions are at `:184` and `:212`. This is the room's recurring
three-units error (551 sites / 418 cases / 234 assertions) in a headline number. **The asymmetry is real
and large on every unit, so nothing in the ruling changes — but the registration carries the corrected
figures and any scorecard must state its unit.**

### 1b · The finding that reshapes the first instrument

Both live emissions are **conditional**:

```
:184  fires only when the repo cannot be resolved   -> "dispatch-gate is INERT ..."
:212  fires only on an UNCITED dispatch             -> "UNCITED DISPATCH — ..."
```

**The room's one working visible cue never prints as status. It prints on an exception.** The idea
file's proposal — one chain line, every turn — is the opposite mode, and the opposite mode is the one
the room has already measured failing: the ferry line printed **233 unferried** every turn of this
session and was read as furniture until an instrument re-derived it. See §3-A1.

---

## §2 — THE REGISTRATION

### R1 · The claim under test

*A cue delivered on the user-visible channel changes what the second party (the keeper) does, in a way
the model-only channel does not.* Registered scope: **Main only** (see R9).

### R2 · The first instrument, as amended by §3-A1 and §3-A4

**An exception-triggered chain notice on `systemMessage`, not a per-turn status line.**

- **Trigger:** elapsed time in the current chain state crosses a threshold **while the state is
  non-terminal**. Registered by value: **fires at 15 minutes, re-fires at 30, then every 30.** Silent
  otherwise.
- **Payload:** the state, the holder, and **elapsed-in-state** — a number that changes every emission.
  Registered because of the paradox in §3-A4: *the state that most needs to be visible is a state that
  is not changing*, so the payload cannot be the state alone.
- **Staleness:** if `chain-status.js` cannot establish that its inputs are current, the notice **says
  "chain state unavailable"** and prints **no value**. Per `memory/stale-digest-is-not-a-deliverable.md`:
  an old value reads as fresh completion. **And the stale message is itself exception-triggered** — a
  line that says "stale" every turn is a status line again, which is the failure this instrument was
  redesigned to avoid.
- **Not registered, deliberately:** any per-turn always-on rendering. If someone wants one later it is a
  second instrument with its own registration, not a widening of this one.

### R3 · The baseline, stratified — because the five events are not one phenomenon

The chair's baseline is **five stalls caught by the keeper's silence: L010, L011, L013, L017, L018.**
**Five, not the librarian's four, and the reason is checkable:** the librarian's note was written ~06:25
and `lap.jsonl` records L018 opening at **07:01**, so the fifth event postdates the note that could have
counted it.

**Measured from disk — maximum dwell per lap, `C:\Consonance\data\lap.jsonl`, `at` in epoch ms:**

```
L010   5099.5 min   state=filed   holder=chair   started 08-25 11:33
L011      4.2 min   state=filed   holder=chair   started 08-29 00:36
L013   1234.3 min   state=filed   holder=chair   started 08-29 07:10
L017     42.5 min   state=filed   holder=chair   started 08-30 06:18
L018     29.7 min   state=map     holder=chair   started 08-30 07:01
```

Three things follow, and all three change how the falsifier must be scored:

1. **The range is three orders of magnitude** (4.2 min → 5,099.5 min). L010 and L013 are overnight/away
   gaps. **No visible indicator can affect a stall that happens while nobody is at the screen** — those
   two are outside the instrument's reach and scoring them against it guarantees a false failure.
   **Registered: the baseline is stratified into LIVE stalls (a human turn within the window) and AWAY
   gaps, and only LIVE stalls are in the denominator.** On tonight's data that is **L017 (42.5m) and
   L018 (29.7m)**, plus L011 if it can be located.
2. **L011 does not reproduce.** Its longest ledger dwell is **4.2 minutes** — the ledger shows no stall
   there at all. Either the stall occurred in a state `lap.jsonl` does not stamp, or the rows were
   written after the fact, or the attribution is wrong. **Registered as an open discrepancy, not
   resolved and not quietly dropped: the proposed denominator instrument fails to reproduce one of the
   five baseline events, and that is a limit on my own fix.**
3. **The chair's "twenty-eight minutes at MAP" is 29.7 by the ledger.** Close enough to corroborate,
   different enough to say the ledger is the citable number.

### R4 · The denominator — on disk, and unused

The falsifier as handed to me — *if stalls are still noticed by silence after a visible chain line
ships, visibility is not the lever* — **has no denominator and no threshold** (§3-A2). One stall noticed
by silence satisfies "still noticed by silence" literally, which would kill a working instrument; read
generously, one lucky catch passes it. **Registered replacement, carrying the original verbatim as the
trace it is:**

> *Verbatim, from the librarian's ~06:25 notes:* **"if stalls are still noticed by silence after a
> visible chain line ships, visibility is not the lever."**

**Scoreable form.** A **live stall** is defined mechanically from `lap.jsonl`: dwell in a non-terminal
chain state **> 15 min** with a human turn inside the window. That gives a denominator that does not
depend on anyone noticing anything. Then, over the next **10 live stalls**:

- **detected-by-line** = the keeper's next message cites the notice's content (a lap ID, a state word,
  or the elapsed figure);
- **detected-by-silence** = the keeper's next message is a bare status query with no content from the
  notice (*"did u send to lib yet?"*, *"are you working?"*);
- both classified **from the transcript, mechanically** — never by asking the keeper or the chair which
  it was (§3-A2b).

### R5 · The numbers, written down

- **alpha = .05**, one-sided, direction registered: **detected-by-line must exceed detected-by-silence.**
- **Test:** exact binomial over the 10 live stalls against the registered baseline rate. Tonight's
  baseline is **0 of 5 detected by anything but silence**, so the null rate is 0 and the test is simply
  whether the notice ever detects: **≥7 of 10 detected-by-line to claim the lever; ≤3 of 10 fires the
  falsifier; 4–6 is INDETERMINATE and is reported as indeterminate, never as either.**
- **VOID rule:** fewer than **6 live stalls** in the window → underpowered → **report void, extend the
  window once, and register the extension.** Never report a void as a null.

### R6 · The confound that will otherwise eat the result — registered before it can be used

**Shipping a visible line changes the chair as well as the keeper.** A chair that knows its stalls are
now visible stalls less. So a fall in detected-by-silence is ambiguous between *the keeper detects
better* and *there was less to detect* — and the second would be reported as the first.

**Registered: the stall COUNT and the stall DURATION distribution are reported beside the detection
split, both from `lap.jsonl`, both computable without the notice existing.** If live-stall count falls
by more than a third across the window, the detection result is **confounded and reported as
confounded**, whatever it says. This is the one number that separates "visibility works" from "being
watched works" — and the second is a real and interesting outcome that is **not** this line's claim.

### R7 · Habituation — a diagnostic, never a target

Same discipline as the retriever registration, and for the same reason: **a notice that changes every
time can be changing because it is wrong.** Registered as a conjunction checked after the fact:
byte-identical payload across ≥3 consecutive emissions **and** detected-by-line at zero over that
stretch. **No threshold or payload may be changed to move the change-rate.**

The elapsed-in-state payload (R2) is what makes this mostly moot — the number grows monotonically, so a
stall renders as an increasing figure. That is deliberate: **the one thing that both changes and means
"stuck."**

### R8 · Disk, not say-so

Every emission and every suppression writes one line to a hook log the keeper and the seat do not
edit: `{ts, lap, state, holder, elapsed_min, action:"emit"|"suppress"|"stale"}`. Scoring reads that log
and `lap.jsonl` and the transcript. **Neither the chair's nor the keeper's account of why a stall was
noticed is admissible.**

### R9 · Scope and the limits carried, not resolved

- **A pane's "user" is not the keeper.** `systemMessage` may not mean the same thing in a pane as in
  Main; **this has not been checked.** The first instrument is **Main-only**, so the line does not
  depend on the answer. **Registered as a precondition on GENERALISATION only:** no claim about panes
  until someone emits a `systemMessage` from a pane hook and records whether a human ever saw it.
- **n = 1.** One hook on one channel is not a comparison. **The current evidence supports nothing**; the
  registration exists to make the next n scoreable (§3-A7).
- **Visibility and focality are not independent at any registered hook moment** (§3-A6): the visible
  channel is emitted *through* the seat's own turn, so a test of one is confounded with the other unless
  the payload is inert for the seat. **Registered mitigation: the notice's payload must contain no
  instruction and no ask** — pure state — so that anything it changes in the seat is not a second
  composition.

### R10 · What result switches this line off

- **≤3 of 10 live stalls detected by the line: the falsifier fires. Visibility is not the lever**, and
  the line closes rather than being retuned.
- **The stall count falls by more than a third with detection unchanged:** the effect is being-watched,
  not visibility — **the line's claim is refused** and the finding is re-filed under a different name.
- **The notice fires and the keeper never once cites it across 10 live stalls:** it is the ferry line
  again, and continuous-vs-exception was not the difference that mattered.

### R11 · What marks this DEGENERATING

- The instrument ships and **no scorecard is ever produced** — the room's signature failure, named first.
- The threshold (15 min), the window (10 stalls), or the ≥7/≤3 bands are **moved after anyone has seen a
  score.**
- **Scope creep into a status line:** the notice acquires an always-on rendering "so it is easier to
  see." That is the redesign in R2 being undone, and it should require a fresh registration with the
  ferry line's 233 as its declared baseline.

---

## §3 — MY ATTACK ON THE ABOVE, run before filing

Seven attacks. **Four landed and changed the registration** (marked in place). Three failed and stay in
at their real strength.

**A1 — LANDED, and it is the packet. The proposed first instrument is in the mode the room measured
failing, and cites as its model the hook that is in the other mode.** dispatch-gate's two live
`systemMessage` emissions are both exception-triggered (`:184` inert, `:212` uncited). The idea file
proposes a per-turn status line and says *"dispatch-gate.js is the working example of how to emit it."*
It is the working example of the **channel**, not of the **cadence** — and cadence is the variable the
ferry line's 233-per-turn already ruled on. **Fix applied → R2:** exception-triggered, thresholds by
value, no always-on rendering registered.

**A2 — LANDED. The falsifier has no denominator and no threshold, and the denominator is on disk
unused.** *"Still noticed by silence"* is a binary over a rate with neither. **Fix applied → R4/R5:**
live stalls defined mechanically from `lap.jsonl`, ≥7/≤3/indeterminate bands, void rule at <6.
*(A2b, same attack:* attributing a detection required asking someone why they noticed — subject
say-so, which R8 forbids. **Fix: classify from the transcript by whether the keeper's message carries
the notice's content.**)

**A3 — LANDED. The five-stall baseline pools events three orders of magnitude apart, and one of them
does not reproduce.** Measured: 4.2 / 29.7 / 42.5 / 1,234.3 / 5,099.5 minutes. Two are away-gaps no
indicator can reach; **L011's longest ledger dwell is 4.2 minutes and shows no stall at all.** **Fix
applied → R3:** stratified into LIVE and AWAY, only LIVE in the denominator, **and the L011
non-reproduction registered as an open discrepancy against my own proposed instrument rather than
dropped.**

**A4 — LANDED. The static-state paradox.** The chair's two constraints collide on this specific
instrument: *it must change when the state changes* and *it must be salient during a stall* — but **a
stall is by definition the state not changing.** A correct indicator would be most static exactly when
it matters most. **Fix applied → R2:** the payload is elapsed-in-state, which changes on every emission
and whose growth *is* the signal; and → R7, change-rate demoted to a diagnostic that may never be
optimised toward.

**A5 — FAILED: "refuse until the pane-vs-Main question is settled."** The chair named this as the limit
it would attack first, and I agree it is the right place to aim — it just does not reach. The first
instrument targets **Main**, where the channel's one positive observation actually lives; the pane
question gates **generalisation**, not this build, and is cheaply settleable later by emitting one
`systemMessage` from a pane hook and looking. Refusing on a limit that does not bind the thing being
registered would be deflation in the limit's costume. **Kept at its real strength → R9**, as a
precondition on generalisation with the check named.

**A6 — FAILED: "the ruling is wrong; a cue the human sees IS focal for the human, so visibility folds
in."** It fails on the definition: focal/nonfocal is defined **relative to the ongoing task's own
processing**, and the keeper is not running the seat's task — he is a second party. B's design defect
makes it empirical rather than definitional: at PreToolUse, one channel cannot move the seat and the
other can move the keeper. **What survives is a real limit, not a refutation:** the visible channel is
emitted *through* the seat's turn, so the two are confounded at every registered hook moment. **Kept →
R9**, with the payload-carries-no-ask mitigation.

**A7 — FAILED: "n=1 means there is nothing to register."** Registration is what turns n=1 into a
scoreable n; refusing to register until the evidence exists is how a line stays anecdotal forever. It
survives only as the sentence in R9 — **the current evidence supports nothing** — which is now in the
registration rather than in an attack.

*Four landed, three failed, 1.33:1 — the ratio check I registered against myself in the P-FIC packet,
run again.*

---

## §4 — THE TWO PORTABILITY ITEMS, done, with a correction to the count

**Item 1 — DONE.** `exo_memory/loop/univ_coldread_prereg_2026-08-29.md:266`:
`` `/c/Users/zackn/.claude/CLAUDE.md` `` → `` `~/.claude/CLAUDE.md` ``. **`grep -c zackn` on that file is
now 0.**

**Item 2 — DONE for the genuine carrier, and the count was wrong.** The chair and the librarian's note
both say **2 tracked files**. The librarian's own command returns **3**:

```
git ls-files | xargs grep -lI ZachsLEGION
  exo_memory/librarian/2026-08-30.md
  exo_memory/loop/handoff_librarian_2026-08-30.md
  exo_memory/loop/prehistory_carrier_census_2026-08-30.md
```

**But only ONE of the three is a genuine carrier.** The other two contain the string *because they are
the instruction to remove it* — `librarian:663-664` (*"hostname `ZachsLEGION` → 'this machine' in its 2
carriers"*) and `handoff_librarian:77`. Replacing those would corrupt the instruction into nonsense.

**Edited — `exo_memory/loop/prehistory_carrier_census_2026-08-30.md`, 2 lines:**
- `:114` "on drive C: of ZachsLEGION" → "on drive C: of this machine"
- `:146` "This machine is **ZachsLEGION** (`hostname`)" → "This machine is the laptop (its `hostname`
  differs from the desktop's)" — the sentence's job is the two-machines distinction, which "this
  machine" alone would have destroyed.

**NOT edited, and why:** `exo_memory/librarian/2026-08-30.md` is **currently dirty** — another seat is
live in it this minute, and editing an in-flight file is the hazard the 2026-08-26 commit-rule amendment
names. `handoff_librarian_2026-08-30.md` is another seat's file and its hit is instruction text.
**Both are flagged, neither is touched.**

**The observation worth keeping, because it is the inverse of the chair's warning.** The chair warned
that fixing scattered instances *"is what makes a scanner green over a problem it still has."* Here the
opposite is on disk: **a scanner is RED over a problem already fixed, because the correction quotes its
own target.** That is §3 of the retrieval research file — *repeating the misinformation during
correction strengthens it* — surfacing in a portability scanner. **Registered as a note for whoever
builds the class scan: instruction text quoting a forbidden string must be excluded, or the count can
never reach zero and the remaining hits will be read as unfixed carriers.**

**Not touched, as instructed:** the baseline json (ECHO's), and the 61-file/230-occurrence account-name
class, which is ECHO's baseline and is exactly the class where scattered fixes would fake a green.

---

## §5 — WHAT I AM NOT CLAIMING

- **Nothing was built.** Hooks and tools were read only.
- **The dwell figures are `lap.jsonl`'s**, re-derived by the script in this file's history, not quoted
  from anyone. `lap.jsonl` is runtime data, **not in the repo**, so these numbers are this machine's and
  are not reproducible from a clone.
- **I did not verify that the five events were noticed by silence.** That is a transcript claim and I
  did not read the transcript. What I verified is the **dwell** at each named lap — which is the
  denominator, not the detection.
- **L011 is unresolved**, and it is a failure of my own proposed instrument, stated in R3 rather than
  dropped.
- **The corrected channel ratios do not change the ruling**; the asymmetry survives on every unit.
- **n = 1 and Main-only.** This registration makes a claim scoreable. It does not support one.

Uncommitted. The chair commits.
