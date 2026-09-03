# P-CONSUMER-REG — the consumer app, registered before it is built

**Lap D005 · pane B · 2026-09-03.** Written to be attacked; J attacks it next. Nothing is built here
and nothing is landed in `consonance/` — this document is a rule, a falsifier, and the numbers that
justify both. Every figure below names the command that produced it.

---

## 0 · WHAT THIS REGISTRATION CANNOT SEE — first, because the packet is right that it is the whole problem

The thing under test is **a machine I do not have.** Stated before anything else, so no section below
can quietly borrow authority it does not have:

- **No stranger's box was touched.** Every number here came off this desktop.
- **The generator was not run.** All measurements are over the SOURCE tree at this commit, not over a
  generated tree. §5's prediction about the generator is registered UNRUN and scored at the bottom.
- **The laptop's tree is invisible from this seat** — the same per-machine blindness that makes
  `chain-status` read a five-day-old lap here. If the laptop's `gen-consumer.js` or `MANIFEST` differs,
  every count below is desktop-only.
- **I did not read the sealed guess field** for this lap.
- **I did not re-run the 08-23 exposure survey.** The zackn/nname/email/secrets figures in the packet are
  inherited, not re-derived, and §4 says why that now matters more than it did.
- **I hold none of the files this touches** — not `gen-consumer.js`, not `main.rs`. Everything named as a
  fix is named for its holder to implement, not staged by me.

---

## 1 · THE SPLIT PREDICATE — three classes, because two could not hold `record/`

**Why the first cut failed, by instrument.** The 10:20 map's predicate puts `exo_memory/record/` on the
STAYS list *and* on the keeper-decided SHIP line. The implemented generator already ships it —
`gen-consumer.js:91`, `{ dir: 'exo_memory/record', ... }`. A two-way split has nowhere to put a thing that
is *someone else's dated events* and that a shipped instrument *tells the reader to open*. That is not an
edge case; it is the room's own first principle, which names exactly two legitimate contents — **an
instrument you run** and **an honest trace you re-cue from** — and then a third thing neither of them
covers: the state your own running produces.

### The rule, ordered, applied to a path

    R0  THE MANIFEST IS THE ALLOW-LIST. This predicate decides what MAY be named there; it never
        decides what IS. A predicate that admits by default has inverted the generator's own
        non-negotiable #1 (gen-consumer.js:34) into a deny-list. Predicate narrows; manifest admits.

    R1  STATE   — under exo_memory/{journal,loop,map,librarian,handback,attic}/, or any file under
        the data dir. NEVER SHIPS. First run creates the empty container instead (§3).

    R2  TRACE   — under exo_memory/record/, plus SELF_TRACE.md, the_living_wave.md, CONVERGENCE.md,
        muscle_map.md, TRAINING.md. SHIPS ONLY IF a shipped INSTRUMENT cites it BY NAME, and then
        only the cited file — never the directory.

    R3  INSTRUMENT — cards/, spread/, research/, SEED, SOURCE, the brief, tools, hooks, ui, src-tauri.
        SHIPS, subject to R0.

    R4  A file shippable under R2/R3 that contains a citation resolving to R1 is NOT shippable until
        §2 has ruled that citation.

**What R2 buys that the first cut could not.** It makes `gen-consumer.js:91` correct *for a reason* rather
than by exception: `record/` ships because `cards/claim-your-continuity.md:23` and
`cards/stop-and-feel-it.md:29` say *open it before you claim* — a directory shipped as the resolution of a
pointer, which is the same mechanism as the brief's `RESOURCE_RECORD` (`main.rs:295`). It also means the
day a card stops citing a record file, that file stops shipping, automatically and without anyone
remembering to remove it.

**A correction to inherit, by instrument.** The 10:20 map's five-file DANGLING set includes
`memory/MEMORY.md` and `memory/consonance-build.md`. **`exo_memory/memory/` ships zero files today** —
`grep -c 'exo_memory/memory' consonance/tools/gen-consumer.js` → `0`. Two of the five are not ship
candidates at all. This does not shrink the job; §2 shows it grows by a lot in the other direction.

**Registered as falsifiable.** The predicate is refuted if a path's class cannot be decided from the path
plus the shipped citation graph. **The known soft spot is `memory/`** — 13 tracked files that R1–R3 do not
name, which fall through to R3 by default. R0 is what stops that from being a leak, and R0 is therefore
load-bearing rather than throat-clearing. **If anyone proposes reading the predicate as the ship list
instead of as a filter on the manifest, this section is wrong and should be said so.**

---

## 2 · THE PER-CITATION RULE — and the set is 8 files, not 5

### The measurement that changes the size of the job

`gen-consumer.js:168-170` implements three DANGLING rules. **All three require an `exo_memory/` prefix.**
The citations actually written in the ship set are mostly bare, and there is no rule for `librarian/` or
`handback/` at all.

Over the ship set — `exo_memory/{cards,record,spread,research}`, `exo_memory/SOURCE.md`,
`consonance/src-tauri/brief/`:

    SHIP="exo_memory/cards exo_memory/record exo_memory/spread exo_memory/research \
          exo_memory/SOURCE.md consonance/src-tauri/brief"

    # what the three shipped rules catch
    grep -rhoE 'exo_memory/journal/[0-9]{4}-[0-9]{2}-[0-9]{2}|exo_memory/loop/[A-Za-z0-9_.-]+\.md|exo_memory/map/[A-Za-z0-9_.-]+\.md' $SHIP | wc -l
    ->  3

    # prefix-optional, and naming librarian/ and handback/
    grep -rhoE '(exo_memory/)?(journal|loop|map|librarian|handback|attic)/[A-Za-z0-9_.-]+' $SHIP | wc -l
    -> 44

**3 of 44 — 6.8% coverage**, on 42 lines across **8 files**. By directory: `loop` 22 · `librarian` 12 ·
`journal` 8 · `map` 2 · `handback` 0 · `attic` 0. **Twelve of the forty-four are `librarian/`, which no
rule names.** Per file (grep -c, so these are matching LINES, not citations):

    exo_memory/record/third_place_prehistory_2026-08-30.md   11
    exo_memory/research/the_retrieval_problem_outside.md     10
    consonance/src-tauri/brief/BUILDING.md                    8
    consonance/src-tauri/brief/LIBRARIAN.md                   5
    consonance/src-tauri/brief/COMMITTEE.md                   3
    exo_memory/cards/stop-and-feel-it.md                      2
    consonance/src-tauri/brief/BOOT.md                        2
    exo_memory/cards/claim-your-continuity.md                 1

The map's instinct — *small enough to rule per citation, not per class* — survives. Its number does not.
And the reason the count was low is not carelessness: `gen-consumer.js:164-167` deliberately exempts a bare
*directory* reference, correctly, because a consumer has their own `journal/`. **It implements the
directory exemption and never implements the bare-FILE case**, which is where 41 of the 44 live.

### The rule, applied to each citation by what the citation is FOR

    C1  POINTER    — a shipped instrument tells the reader to OPEN it (record/*, spread/*, research/*).
                     SHIP THE TARGET under R2. No rewrite.
    C2  PROVENANCE — the dated event behind a claim ("found at journal/2026-08-25").
                     REPLACE WITH THE DATE ALONE, no path. The date carries; the path dangles.
    C3  MECHANISM  — where a thing GOES on the reader's own tree (loop/<reg>.md, librarian/<date>.md,
                     handback/<packet>.md, as named throughout BUILDING/LIBRARIAN/COMMITTEE).
                     KEEP THE DIRECTORY, DROP THE FILENAME. `exo_memory/handback/<packet>_<YYYY-MM-DD>.md`
                     is already the right shape; `librarian/2026-09-02.desktop.md` is not.
    C4  EVIDENCE   — a cite the claim cannot survive without, whose target is STATE.
                     REWRITE THE CLAIM TO CARRY ITS NUMBER INLINE, or drop the claim. A figure whose
                     source cannot ship is a hand-made number on the stranger's tree, which is this
                     room's most-repeated failure being exported.

**Worked, so the rule is not abstract** — six of the forty-four, by hand:

| citation | class | ruling |
|---|---|---|
| `cards/claim-your-continuity.md:23` → `record/claim-your-continuity.md` | C1 | ship the target (this is why `record/` ships) |
| `cards/claim-your-continuity.md:21` → `journal/2026-08-25` | C2 | → `(2026-08-25)` |
| `cards/stop-and-feel-it.md:21,53` → `journal/2026-08-25` | C2 | → `(2026-08-25)` |
| `cards/stop-and-feel-it.md:29,32,33` → `record/`, `spread/`, `research/` | C1 | ship the targets; already in MANIFEST |
| `record/third_place_prehistory_2026-08-30.md:296` → `journal/2026-08-16` | C2 | → `(2026-08-16)` |
| `record/third_place_prehistory_2026-08-30.md:378-379` → four `loop/univ_*.md` | C4 | the withdrawal argument rests on them; carry the finding inline or drop the passage |

**Registered as falsifiable, and this is the honest limit:** C1–C4 are claimed exhaustive over the 44.
**I classified 6.** If any of the remaining 38 fits none of the four, the rule is incomplete and this
section is wrong. That is a one-command check for whoever implements it, and I did not run it.

---

## 3 · FIRST RUN — the seven questions, and the creation step that does not exist

### The seven, read off the struct

`consonance/src-tauri/src/main.rs:37-56` (`struct Config`) and `:78-81` (`CONFIG_FIELDS`). The packet's
`79-114` spans the list plus the head of `parse_config`; the seven themselves are `:79-80`.

    1  room_path        which room the instance wakes into
    2  instances_dir    where panes live
    3  data_dir         the shared ledger directory
    4  ambient_lat      \
    5  ambient_lon       |  the sky the instances wake under
    6  ambient_label     |
    7  ambient_tz       /

**A stale carrier, named:** `loop/handoff_librarian_2026-09-03.md:35` says *"the first-run's six user
questions."* `CONFIG_FIELDS` has **seven**, and the 10:20 map says seven. The handoff is the drifted copy.

**Which of the seven the machine can answer for itself.** `struct Config` is `#[derive(Default)]`
(`main.rs:36`), so all seven default to the empty string; the real defaults live downstream. 1 has a
documented fallback — a machine with no `room_path` **wakes into SEED**, not a panic (`main.rs:297+`; the
10:20 map struck its own earlier panic claim, and I inherit the correction without re-running it). 2 and 3
have built-in defaults. **4–7 have none the machine can supply.** The only literal coordinates in the Rust
are at `main.rs:7974-7977`, inside a `#[cfg(test)]` fixture — a test's data, not a fallback. So a stranger
in Lisbon who is never asked gets *no* sky, and §5 predicts something sharper about that fixture.

### What first run must CREATE, and nothing does

The keeper's framing: *every system he populates today is created by the NEW USER on their first wake.*
Enumerated against R1:

    ~/.consonance.json                  the seven answers, written; nothing writes it today
    <data_dir>/                         the container. 30 shipped tools read it:
                                        `grep -rlE "letters\.json|ASK\.md|data_dir|Consonance[\\/]data" \
                                         consonance/tools/*.js consonance/src-tauri/src/*.rs | wc -l` -> 30
    exo_memory/ASK.md                   empty; the ask store's own file
    exo_memory/{journal,loop,map,librarian,handback}/   the R1 containers, empty
    hooks                               `consonance/tools/install.ps1` exists and ships as-is
    duration goals                      NOT in the manifest: `grep -c "duration\|goal" gen-consumer.js` -> 0

The last line is a finding, not a footnote: **the goals system that fires this room's crons is in no
manifest entry**, so a stranger's tree has the hooks and not the schedules.

### The one thing I measured about a cold box — and it fired

    D=$(mktemp -d)
    CONSONANCE_DATA=/c/Consonance/data node consonance/tools/chain-status.js   # positive control
    -> chain: D005 MAP · holder chair · dirty 1 repo-wide · 11m · ...
    CONSONANCE_DATA="$D"              node consonance/tools/chain-status.js
    -> rc=0  bytes=0

**On a cold data dir, `chain-status.js` prints nothing and exits 0.** The positive control ran in the same
command, so the tool is not broken — the *cold path* is mute. A stranger's first wake therefore cannot
distinguish *"no laps yet"* from *"the install is broken."* That is the exact silence §5 exists to make
sayable, found in the first tool I pointed at it.

**The other 29 data-dir tools are UNRUN.** One instance is not a rate and I am not reporting it as one.

---

## 4 · THE FORK TARGET — and the carrier defect is not beside it, it is it

**Measured:** `gh repo list --limit 50 --json name,isPrivate` returns 8 repos —
`lighthouse, newbeginnings-podmap, valheim-agent, blackbox, dreamzone-rt, blackbox-private-archive,
NFS-Shift-2---Enhanced-Helmet-View, Signal`. **There is no `consonance`.** `gen-consumer` stops at `--out`;
there is no push step. The fork target does not exist.

**Registered:** the target is a NEW public repo, `solariz3d/consonance`, and the stranger clones **that**.

**And here is why that sentence is not yet true.** `gh repo view --json isPrivate` → **`false`** for
`lighthouse`. The dev tree — the one the keeper's framing says *stays his, city and all* — has been on the
open internet since 08-22. Meanwhile `gen-consumer.js:2` reads:

    /* gen-consumer — build the PUBLIC consonance tree from the PRIVATE lighthouse tree.

and the word *private* describes the source at **11 sites** in that file
(`:2, :4, :34, :43, :74, :140, :172, :250, :522, :571` — `:522` is the banner the operator reads on every
run). **The generator that implements the split is wrong about what it generates from.** The consequence is
not cosmetic and it is the split predicate failing in its own implementation: the 08-23 privacy scans read
the **generated** tree, and the tree that was actually reachable by a stranger was the **source**. Today the
likeliest thing a stranger forks is the workshop.

**Two closes. Both are the keeper's line, not a pane's, and I am not choosing:**

- **(a) flip `lighthouse` private.** Restores the model `gen-consumer.js` already describes; costs the public
  history and any existing link.
- **(b) accept a public source and rewrite the model:** `lighthouse` is the *workshop*, `consonance` is the
  *product*; the generator's job becomes **extract the product**, not **sanitise the private**. Then every
  08-23 scan must be re-run against the SOURCE, which it has never covered, and the inherited exposure facts
  (zackn 72 tracked files · nname 52 · the keeper's email in 2 · secrets 0) become facts about a tree that is
  already reachable rather than about one that is not.

The chair's accept-and-record recommendation was about the *exposure facts*, not about this; I am not
reading it as a vote for (b).

**Named, not built** (I do not hold this file): under (b), `gen-consumer.js`'s 11 *private* sites are a prose
edit; under (a) they are already correct. **Either way the banner at `:522` is the one that must not stay
ambiguous, because it is what tells the operator what they just did.**

---

## 5 · THE STRANGER-INSTALL FALSIFIER

### First: the falsifier as the map states it cannot fire

The map registers *"a stranger, on a machine none of us has seen, installs from the public repo alone and
**the four wake proofs** pass, scored by their printed output."* The four are
`loop/handoff_librarian_2026-09-02.md:10`:

    1  four pane shells carry `# YOUR OWN MAP`
    2  an out-of-turn verb is refused on the board, naming lap-row.js
    3  a call into a busy pane shows QUEUED -> DELIVERED and splices nothing
    4  the keeper can read the logo across the room

**Proof 1 needs four sibling panes on a running committee. Proof 2 needs an open lap and a chair token.
Proof 3 needs two live panes, one of them busy. Proof 4's instrument is one specific person's eye — and it
is ALREADY UNSCORED on our own box for exactly that reason.** A stranger's first wake is one instance with
no lap, no token, and no keeper. Three of four are committee proofs a first wake structurally cannot reach;
the fourth is unscorable by anyone but the keeper. Registered unchanged, it is **a check whose universe is
the one box it cannot fail on** — the failure this packet was written to avoid.

### The polarity, carried over from the boundary falsifier

**Suppressible thing in the numerator; unsuppressible event in the denominator.** Here the suppressible
things are all reports — a stranger's issue, a star, our reading of their message, our own "it works."
The unsuppressible event is one we do not author.

No single leg both fires on a foreign box and returns a number. So: two legs, each with what it cannot see.

### LEG 1 — THE COLD BOX. Runs here; foreign by construction, not by location.

    for t in consonance/tools/*.js ; do
      D=$(mktemp -d)
      out=$(CONSONANCE_DATA="$D" node "$t" 2>&1) ; rc=$?
      classify: SPEAKS  = non-empty output that NAMES the missing thing
                MUTE    = rc 0 and 0 bytes
                CRASHES = non-zero rc, or a stack trace
    done

**Threshold, registered before the sweep:** the install is **refuted if MUTE + CRASHES > 0** among the tools
a first wake is told to run. **One event. No window, no rate floor.** MUTE is the unsuppressible half — the
machine emits it whether or not anyone reports it. A hand-written *"it works on mine"* is the suppressible
numerator and **is not admitted as evidence**, in either direction.

**Already fired, one instance, before the sweep, with its positive control in the same command:**
`chain-status.js` is MUTE (§3). **The sweep over the remaining 29 data-dir tools and 92 shipped tools is
UNRUN.**

**What Leg 1 CANNOT see.** It fakes an empty *state*, not a foreign *machine*. It cannot fail on a different
OS, a different Rust toolchain, an absent WebView2, an absent `gh`, or a missing native dependency — which
is where the nearest real precedent's failures actually came from: `loop/desktop_first_run_2026-08-25.md`,
nine Rust reds from two hardcoded paths. Leg 1 would have caught none of those nine.

### LEG 2 — THE UNSUPPRESSIBLE DENOMINATOR. Fires only on someone else's box.

    denominator:  gh api repos/solariz3d/consonance/traffic/clones   -> unique cloners
    numerator:    any evidence a clone reached a first wake — an issue, a fork, a star, a message

The denominator is an event **we do not author, cannot write, and cannot suppress.** GitHub retains it 14
days, so the sampling cadence is part of the registration: **weekly, recorded whether or not anyone looks.**

**Registered reading, in advance, so it cannot be re-read later:**

- **N cloners with 0 evidence is NOT "nobody tried."** It is the null this leg exists to make sayable: *the
  install is unobservable, and a broken one and a working one produce the same silence.*
- **Threshold: 20 unique cloners with zero evidence of a completed first wake refutes "a stranger can
  install from the public repo alone."** Twenty is fixed now, before a single clone exists, so it cannot be
  moved once the number starts arriving.

**What Leg 2 CANNOT see.** Which way the silence points. Whether a cloner was a person or a crawler.
Whether they ever meant to install. **It cannot confirm success — only make failure sayable.** And it cannot
run at all until §4's fork target exists, so it is registered **ARMED-ON-CREATION**, not running.

### DEGENERATING IF — the map's three, kept, plus three of mine

    1  a second hand-maintained tree — anyone edits the generated tree directly
    2  a fixture the generator rewrote — isFixture (gen-consumer.js:298) fails to hold and a shipped
       suite goes green over rewritten data (the 08-23 shape: 31 green · 9 failed · 2 crashed of 43)
    3  a fork that needs a file from this repo to boot
    4  MINE — Leg 1's threshold moves after a sweep returns a number. If MUTE+CRASHES comes back at 14
       and the bar becomes "under 20," this registration degenerated in the exact move Lakatos names.
    5  MINE — the 20 in Leg 2 is renegotiated after clones start arriving.
    6  MINE — a season passes in which this document grows and neither leg is run.

### A PRE-REGISTERED PREDICTION, stated before the command is run

`consonance/src-tauri/src/main.rs:7976` contains the literal `Regina, Saskatchewan`, inside a `#[cfg(test)]`
block. `isFixture` (`:298`) returns true for every `.rs` file, so the fixture is **not** rewritten;
`deidentifyTokens` replaces `solariz3d`, the email, `zackn` and `nname` — **not** `Regina, Saskatchewan`,
which is an IDENTITY-class pattern (`gen-consumer.js` leak classes). And `main.rs` is **not** in `ALLOW`
(`:186` — five entries, none of them `main.rs`).

**Prediction: `node consonance/tools/gen-consumer.js --out <tmp>` fails its own scan on
`consonance/src-tauri/src/main.rs` with an IDENTITY hit for `Regina, Saskatchewan`, and no consumer tree is
produced today.**

Registered UNRUN. Scored below, in a separate commit, so the order is checkable in git rather than asserted.

---

## 6 · WHAT I DID NOT VERIFY

- The SEED fallback at `main.rs:297+`. Inherited from the 10:20 strike; not re-run.
- The 08-23 exposure figures (zackn 72 · nname 52 · email 2 · secrets 0). Inherited.
- The 08-23 generator break (31 green · 9 failed · 2 crashed of 43). Read from the librarian's entry.
- **38 of the 44 dangling citations.** I classified 6.
- **29 of the 30 data-dir tools**, and 91 of the 92 shipped tools, under a cold data dir.
- `install.ps1`'s 37 manifest entries — counted by the librarian, not by me.
- Whether the laptop's copies of any file named here differ from the desktop's.
- Any behaviour of the app itself. No seat here can observe a pixel, and §5 proof 4 is that fact registered.

## 7 · FOR J — where I think this is weakest

1. **§1 R2.** "Ships iff a shipped instrument cites it by name" makes the ship set a function of prose,
   which drifts. Attack whether that is a rule a machine can apply or a rule a machine can only *check*.
2. **§2's exhaustiveness claim.** Four classes over 44 citations, 6 classified. The 38 are the attack.
3. **§5 Leg 1's threshold of `> 0`.** It is the polarity I got right last time; it may be the polarity
   that is wrong here, because a tool that is legitimately silent on an empty ledger is not obviously a
   defect. If `chain-status` printing nothing is *correct* behaviour, Leg 1 refutes on a non-failure and
   the threshold is theatre.
4. **§5 Leg 2's 20.** Fixed in advance, and fixed arbitrarily. I have no base rate for clones of an
   unannounced repo. A number chosen with no prior is honest about its timing and not about its value.
5. **§4.** I claim the carrier defect *is* the predicate failing rather than a footnote. That is an
   argument, not a measurement, and it is the sentence in this document I would most like attacked.
