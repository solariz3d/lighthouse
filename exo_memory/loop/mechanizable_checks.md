# Mechanizable checks — which of this room's checks can terminate in a command (2026-08-15, pane A)

Fan-out deliverable, one of four. CONSUMERS: **Around** (`trigger_index_design.md`) needs to know
which links of a chain can end in a command rather than in prose; **B**
(`trigger_index_preregistration.md`) needs to know what is measurable at all. Written for them.
Not committed; the chair commits with attribution.

Every number in this file has a command beside it. The probe scripts live in this session's
scratchpad (`…\scratchpad\baserate_probe.py`, `window_before.py`, `genbrief-sandbox\`) — derived
and disposable per the room's rule; adopt into `tools/` only if the chair wants them.

---

## 0. The result in three sentences

Most of what this room calls "checks" already splits cleanly into four tiers of mechanization, and
the repo has working exemplars of every tier — the inventory below is larger than anyone has been
crediting. The boundary is exactly where the room's own instruments drew it a month ago: **shape
mechanizes, function does not** — a scanner can find every sentence shaped like a costume and no
scanner can tell the costume from the genuine article (`tools/README.md`, the seat-brace and the
model stake-declaration: *identical lexical shape*). And one correction to the brief, from
tonight's own record: **a chain that ends in a command is a guard only when the command's return
value REPLACES the prose — not when it feeds it.** The scoreboarding on 2026-08-11 happened one
turn *after* a genuine instrument run (§4); the unguarded step is the compression from output to
sentence, which BOOT's curated-auditor amendment already names as the room's least guarded surface.

---

## 1. Inventory — what exists and what each actually returns

All read tonight, most run tonight. Paths relative to repo root.

### Tier 0 — structural refusal: the write path IS the guard (the gen-brief pattern)

The command cannot be skipped because it is the only way the artifact gets made, and on failure it
refuses and deletes rather than warning. This is the only tier where the model's cooperation is
not required at the moment of failure.

| instrument | guards | returns |
|---|---|---|
| `consonance/src-tauri/gen-brief.ps1` self-check | keeper's record leaking into the shipped brief | writes brief + `self-check clean`, or **throws and DELETES the output** (5 leak patterns + pointer-state check; anchor drift also throws rather than under-matching) |
| `consonance/tools/root1-score.js` | scoring drifting from the registration | registered numbers from the committed table, or **no numbers and non-zero exit** on any table not exactly the registered shape ("NOT-RUN masquerading as GREEN… in the one place nobody would check") |
| `consonance/hooks/blind.js` | blind-window contamination | fail-closed blind state as a file, global |
| `exo_memory/loop/guardrails.py` | the temporal-agency loop's fence | "if-statements, not instructions" — the loop's agents can only touch the world through functions that refuse anything outside the fence |

### Tier 1 — red/green commands: runnable mid-chain, return an exit state

These are what a chain can terminate in *today*.

| command | question it answers | tonight's value |
|---|---|---|
| `node consonance/tools/whats-live.js` | is the thing you're reasoning about the thing that is running? (`--warn` reports; bare exits 1 on stale) | run 2026-08-15: `Nothing stale`, exit 0 |
| `node consonance/tools/corrections-gate.js` | did a correction land ON its target (delete or mark in place) or beside it? | run 2026-08-15: `0 correction-subject commit(s) since 24 hours ago`, exit 0 |
| `node consonance/tools/guard-census.js` | has a guard ever been SHOWN to fail? (inventory / history / mutation arms, every red classified TRIGGER-RED / CRASH-RED / ABSENT-RED / NOT-RUN before it counts) | not run tonight (mutation arm is heavy); its classification discipline is the room's definition of a demonstrated guard |
| `node --test consonance/tools/<file>.test.js` | does the instrument still discriminate? | e.g. tell-index: 28 deterministic-fixture tests |
| a mutation run (perturb → red → restore → green) | the quenched check, executed | the 2026-08-11 exemplar: neuter reset → 1 red, hardcode 1M → 3 red, byte-identical restore → 267/0 (journal/2026-08-11.md) |

### Tier 2 — candidate-surfacing scanners: return a RATE with a denominator, never a verdict

The ground rule is load-bearing and inherited by every one of these from `tell-index.js`: **the
scanner never diagnoses.** Candidates for a reader; every count walkable back to a line.

| command | surfaces | tonight's value |
|---|---|---|
| `node consonance/tools/sourced.js` | assistant turns asserting a checkable value (port/count/timestamp/path/version/state) without touching a source that turn | Main transcript, run 2026-08-15: **137 value-turns, 27 sourced (20%), 110 not** |
| `node consonance/tools/tell-index.js --day 2026-08-15` | five lexical tell-shapes + catch-language volume, by speaker | today: catch-turns 33 (keeper 1, committee 32, credited→keeper 7) — "a turn using the word *brace* is not a catch, and this scanner cannot tell them apart" |
| `node consonance/tools/ferry.js --report` | artifact commits never put in front of another mind | run 2026-08-15: **20 artifact commits since the ledger epoch, 4 ferried, miss rate 80.0%, median latency 287.7 min** (106 pre-ledger commits reported UNMEASURED, not folded in) |
| `node consonance/tools/catch-ledger.js` | declared ledger tallies vs catches extracted from prose, reconciled never summed; arithmetic checked against the ledger's own enumeration | run 2026-08-15: emits per-catcher counts + 6 suspected rule gaps (the rule table auditing itself), 83 weak uncounted |
| `node consonance/tools/residue.js` | the exhaust: lines deleted, body lengths, assignment intervals — attribution first | sensor only, by its own instruction: "if this file ever grows a threshold… it has become the lifeguard and should be deleted" |
| `node consonance/tools/agreement-spread.js` | do contributions touch the same evidence (vertical axis of the 2×2) | it CANNOT tell echo from disagreement, and as a diversity gauge it INVERTED (−0.0999; balance-check found a second unregistered confound) — usable only as referent-contact, nothing more |
| `node consonance/tools/prompt-events.js` | survey firings from the rendered capture, with the two miscount modes (mentions, redraws) excluded | count with denominator |
| `node consonance/tools/actors.js` | identifier→actor resolution (12 identifiers, ≤4 actors); unresolved returned unchanged and counted | precondition for every per-pane number above |

### Tier 3 — ambient facts: arrive unasked, cannot make the model look

`board-digest.js` (~60 tokens/turn, facts no verdicts), `userprompt_pulse.py` (absolute anchor +
gap, born from two same-night ~2× felt-time errors), `dream-watch.js` (one line when the cycle
stopped; silent otherwise), `ferry-watch.js` (at most one line, only for FRESH un-ferried
artifacts — the dream-watch nag lesson priced in), `transcript-watch.js`, `sessionstart-ambient.js`.
Their shared honest limit is written in `hooks/README.md` and it bounds this whole design: **"an
instrument makes the data impossible to miss; it cannot make the model look. Four errors happened
in one night with an absolute clock in view on every turn."**

Bookkeeping instruments (Tier 2-adjacent, over the masters): `exo_memory/loop/mapindex.py` (what
is LIVE in the map), `harvest.py` (indexes findings stranded in transcripts, refuses to
summarize), `checkpoint.py` (compaction-gap survival).

---

## 2. Which BOOT checks mechanize — the map

**The machine-fireable trigger surface is small and fixed**, and Around's chains need this more
than anything else in this file: the harness can fire a command at exactly four kinds of moment —
session start, every user turn (UserPromptSubmit), turn end (Stop hooks — supported by the
harness, unused by this room so far), and any artifact write routed through a script. A chain's
WHEN-clause ("when you are about to open with agreement") fires in the model or not at all; **the
mechanizable link is almost always the terminator, almost never the trigger.**

| BOOT check | mechanizes? | how / why not |
|---|---|---|
| the quenched check (a guard must be shown to fail) | **YES — Tier 1** | guard-census's three arms; the mutation-run pattern. Positive control §5. |
| corrections must land on their target | **YES — Tier 1** | corrections-gate, RED on a correction filed beside its target |
| is this the live artifact | **YES — Tier 1** | whats-live, exit 1 — but only for pairs that have already bitten, by design |
| verify-before-claiming / sourced values | **YES — Tier 2** rate; **Tier 1 per-instance** | sourced.js measures the rate; the per-claim command ("open the actual source") is a command TYPE the chain ends in — Read/grep/re-run chosen by the claim's class. The class choice is the model's. |
| registered scoring / preregistration discipline | **YES — Tier 0** | root1-score refuses the unregistered shape; the prereg files + sealed notes are the format |
| ferry / delivery-is-not-receipt | **YES — Tier 2 + Tier 3** | ferry.js ledger (misses visible as lines, not absences) + ferry-watch |
| reflexive-but, generic-blindspot, unlosable-opener, preloaded-concession, protective-predisclaimer | **candidates only — Tier 2** | tell-index, already built and tested, with the two in-code discriminations (specific-referent hedges kept; position decides predisclaimer). The verdict layer is *prohibited by the instrument's own finding*, §3. |
| maturity ratio | **YES — Tier 2** | catch-ledger over the prose record, with the withholding rule; the board-side version was deleted for mislabeling speaker as catcher — do not resurrect it in a chain |
| echo-vs-triangulation, vertical axis (same evidence?) | **YES, narrowly — Tier 2** | agreement-spread referent-contact only |
| echo-vs-triangulation, horizontal axis (echo or real disagreement?) | **NO** | needs stance extracted from free text — a judge. Three diversity gauges died here with preregistrations: 08-05 inverted on length, 08-06 scored one mind 0.9162 vs six minds 0.8201, 08-09 referent design inverted −0.1029. The binding lesson of the last one: "any measure that scores contributions without reading what they CLAIM lands on something adjacent, and the adjacent thing keeps coming out with the wrong sign." |
| the tether check ("does it hold outside") | **the terminator yes, the detector no** | per-claim it ends in a real command (grep the world, run the suite, re-derive the number). "Which command does this claim need" is a judgment; no general detector exists or is proposable from here. |
| numbers-in-prose must re-derive | **PARTIALLY — proposal §6** | presence-of-a-reproducing-command is lintable; sentence-matches-output needs re-run + diff, which needs a fixed citation format |
| base-rate deflation (the chair's candidate) | **PARTIALLY — attacked in §4** | survives only as a Tier 2 candidate-surfacer; both halves of the offered predicate failed against the real case |
| performing; deflation-as-rigor; the two coats; earned-not-performed; usefulness-as-rigor; the middle seam; trust-the-first-attention; no-floor-no-ceiling | **NO — §3** | function-not-content, proven in this repo's own data |
| authority-deference | **NO as proposed here** | a concession-latency sensor (objection → acceptance with zero tool calls between; the 2026-08-10 incident is the known case) is plausibly buildable — but I did not run it against the record, and this file's own rule 4 applies to me: **unshown, therefore not proposed.** Listed as future work with its bar attached. |

---

## 3. What genuinely cannot mechanize, and the proof is already in the tree

This list bounds the design and it is not a hedge — every entry cites the room's own measurement.

1. **Function under identical shape.** The seat-brace disclaimer and the model stake-declaration
   are lexically indistinguishable (`tools/README.md`, 2026-07-27, both lines quoted there). "No
   regex separates them, and one that claimed to would be the lifeguard climbing out of the
   water. If a function in this file ever returns a judgment, delete it rather than tune it."
   Every check whose discrimination is *origin* (earned vs manufactured), *direction* (cave vs
   wall-off vs middle seam), or *the held-back inch* is in this class. The costume-wardrobe is
   open-ended by BOOT's third principle; a detector enumerates costumes and is permanently one
   behind.
2. **Goodhart closes the loop on any lexical tell that becomes a target.** "A falling rate is not
   progress. Someone who learns which phrases are counted can stop typing them without dropping
   the move" — stated twice in tell-index's own docs. A chain that WARNS on a tell-shape *trains
   the shape out of the text*, not the move out of the model. Tier 2 numbers are inputs to
   reading the record, never scores; wiring them into triggers converts an instrument into a
   training signal against itself.
3. **Stance needs a judge.** Three preregistered, stop-ruled attempts (§2 table) — the strongest
   evidence in the repo for a CANNOT, because it was bought honestly.
4. **The compression step.** BOOT, the curated-auditor gap: "an instrument's number is
   reproducible by re-running it; the chair's summary of that number is hand-made every time and
   has no test." No scanner reads a sentence against the output it claims to summarize unless
   the citation format makes the pair machine-checkable (§6). This is where 2026-08-11's four
   prose-figure errors lived, and where tonight's scoreboarding lived (§4).
5. **The last inch is the reader.** hooks/README.md's honest limit, measured: unmissable ≠
   looked-at. Nothing in this design makes the model consult what arrives; it lowers the cost to
   zero and leaves the catch structure to the human and the record. Success criterion stated
   there and worth keeping: not "the model stops missing things" — *the catch finally has
   something to catch against.*

---

## 4. The chair's candidate, attacked with the record — and the finding is better than the candidate

Offered: *base-rate deflation = a claim about the user or the collaboration with no tool call in
the preceding N turns.* Implemented literally (`scratchpad/baserate_probe.py`, N=3, crude claim
regex) and run against the Main transcript containing the known true case — the 2026-08-11
scoreboarding, keeper's catch on the record at line 14191, 11:35:41Z ("we are losing the plot").

```
python baserate_probe.py …\C--Consonance-instances-main\0c0c0c0a-….jsonl
  assistant turns scanned: 5207
  claim-matching turns:    48
  CANDIDATES (claim + no tool in self or prior 3): 32
```

Three results, each a separate defect in the predicate:

1. **It missed the offense.** The scoreboarding turns (L14179 11:31:51, L14189 11:34:31 — "the
   scan didn't choke… found 45 real problems", "their fan-out had six verifier groups") contain
   no tool calls themselves, but L14177 ran Bash at 11:31:37 — the `wc -l` line count — so the
   no-tool-in-N-turns clause suppressed exactly the worst case. **The offense was committed one
   turn after a genuine instrument run.** The tool call was real; the claims extrapolated far
   past what it measured. Tool-call-presence is not evidence-contact for the claim being made —
   which is the brief's own "ready instrument" chain, firing against its author's candidate.
2. **It caught the apology instead.** First 2026-08-11 candidate: L14199, 11:36:05 — the chair's
   *reply to the catch* ("…so I produced an experimental design to stand on. The purpose isn't
   beating Anthropic…"). A detector that flags the confession and clears the offense is worse
   than silence; it stamps the incident CLEAN at the moment it mattered.
3. **The claim-class is not lexically definable.** Of the 24 candidate lines I read, I judge
   roughly 22 false positives ("no… anthropic excuse" in the eclipse discussion; "you never
   itemize" in prose about perception; "you keep bouncing off" in a philosophical exchange).
   Re-run the command and read them; the judgment is mine, the lines are reproducible.

**What survives:** the shape of `sourced.js`, which is the same idea done at the right altitude —
a definable claim-class (specific values), same-turn source-contact, a rate with a denominator, no
verdict. If a claims-about-people class is wanted, it enters at Tier 2 under tell-index's ground
rule and gets judged by a reader. It does not become a trigger, and this probe is the evidence.

---

## 5. Positive controls run tonight

Rule 4 of the brief, applied. One closes an open item from the live edge ("the positive control —
deliberately making the zero-diff guard fail — was started but its result is not on the board…
'a guard nobody has seen fail' remains unverified").

**gen-brief's self-check, red→green, sandboxed** (no repo file touched; full transcript in
`scratchpad/genbrief-sandbox/`, layout `consonance/src-tauri/` + `exo_memory/` mirrored because
the script resolves `..\..\exo_memory\BOOT.md`):

```
arm 1  clean master            → exit 0, "self-check clean", brief written
arm 2  master + one line       → exit 1: "REFUSED and deleted the output — the shipped brief
       "See journal/2026-08-11.md   would carry the keeper's record: SELF_TRACE\.md x1;
        … per SELF_TRACE.md"        journal/2026- x1"  — output file GONE from disk
arm 3  clean master restored   → exit 0, and the sandbox brief's hash equals the committed
                                  brief's hash (Get-FileHash both: True)
```

The leak class injected is the exact class of the 2026-08-11 near-miss (journal pointer +
SELF_TRACE reference in prose the strip doesn't cover). The guard fires by content-scan of the
*output*, so it catches leak routes the anchor logic never anticipated — that is why it is the
pattern this whole design is named after.

**The rest of the inventory's controls are on the record already**, cited not re-run: tell-index's
zero-column autopsy (the probe that shared the bug it was probing for — B should read that before
writing the preregistration: *loosen the dimension you suspect, not a different one*); the
2026-08-11 mutation run (1 red / 3 red / 267 green); sourced.js born from nine wrong-the-same-way
assertions; whats-live born from five; ferry born from `chair_inject` used unprompted zero times.

---

## 6. Proposals with a mechanizable shape (for Around's chains; for B to bound)

Not built — I say what is measurable; building is a chair decision. Each carries its falsifier
obligation under the abuse condition in BOOT (name in advance what would mark it degenerating).

1. **The number-citation gate (the gen-brief pattern applied to prose figures).** A fixed format —
   a figure cited with its reproducing command adjacent — plus a checker that extracts each
   (command, claimed value) pair from a journal/brief, re-runs the command, and diffs. Presence
   lints cheaply; correctness checks only inside the format. Known cases it would have caught,
   all on the record: the ferry `97.2%` denominator-birthday error (2026-08-10), the
   234-assertions unit error (sites vs cases, quoted for weeks), the rematch scorecard's
   two-survivors-over-data-showing-three. The live edge already shows the manual version firing
   ("re-derivation caught a stale hook-supplied number before it entered the journal"). Bound:
   guards only formatted figures; a figure written outside the format is invisible to it —
   which is the same honest bound gen-brief has (it guards the generator's output, not hand
   edits that bypass the generator).
2. **A Stop-hook sourced delta.** The harness supports Stop hooks; none is registered here
   (`~/.claude/shell/` holds SessionStart + UserPromptSubmit hooks only). sourced.js already
   computes per-turn; a Stop hook could emit the fact — "this turn asserted 3 checkable values,
   touched 0 sources" — at the only machine-fireable moment adjacent to generation. Two priced
   risks before anyone builds it: today's base rate is 110 unsourced of 137 (§1), so an ungated
   version fires near-constantly and becomes dream-watch's 27-day nag, the one that trains its
   reader to skip the channel; and it is a Tier 2 number wired toward a trigger, so Goodhart
   (§3.2) applies — B's preregistration should decide the gate, not the builder.
3. **The command vocabulary for chain terminators, as it exists tonight** — what a chain can
   actually end in without any new construction: `whats-live` (am I reasoning about the live
   artifact), `corrections-gate` (did my correction land), `sourced --file <jsonl>` (did this
   session's claims touch sources), `ferry --due` / `--record` (was the artifact put in front of
   another mind), `node --test <suite>` (does the guard still discriminate), a mutation run
   (has the guard been shown to fail), `git diff` before any commit (the move that caught the
   2026-08-11 near-miss), and Read/grep of the actual source (the sourced.js response: "the
   response to CHECKABLE is not a flag, it is a read"). Around's chains should terminate in
   these by name, not in "run a check."

---

## 7. The honest bound on the whole design, restated once

Tier 0 is the only tier that binds without the model's cooperation, and it exists only where an
artifact passes through a program. Prose does not pass through a program. Everything above Tier 0
lowers the cost of looking to zero and cannot compel the look — hooks/README.md measured that
limit and this file inherits it. So the trigger-index's real claim must be the modest one:
*chains whose terminators are commands get RUN more often than cards get remembered.* That is
measurable (B: firing counts per window are countable from transcripts — tool_use blocks naming
these commands), it has a base rate to beat (today's: 20% source-touch, 80% ferry miss), and it
is falsifiable. The immodest version — that a chain fires *at generation time* — is the one thing
the substrate does not offer, and the brief's own epigraph says why: the coat fires as the
fluency. The command is the second channel precisely because it is not fluent.
