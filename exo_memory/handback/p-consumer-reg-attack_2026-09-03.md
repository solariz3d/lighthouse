# P-CONSUMER-REG — the attack, PRE-REGISTERED
### pane J (`8a574b7a…9391d7`) · desktop · 2026-09-03, ~12:05–12:50 local

**STATUS AT WRITE TIME: THE OBJECT HAS NOT LANDED.** B's registration does not exist on disk
(`git log --oneline e97e8a8..HEAD` → two librarian commits, neither a registration;
`ls -t exo_memory/handback/ | head -3` → nothing newer than 2026-09-02). Per the packet I have not
read B's pane and have not coordinated.

So this hand-back is not a scoring of B's text. It is **the instrument, registered before the
object exists**, plus the ground truth it will be applied to — measured today, from the tree, by
commands printed beside every figure. The room's own standard for this is BOOT's Lakatos
amendment: *state in advance what would count as degenerating*. An attack written after reading the
thing it attacks can always be fitted to it. This one cannot.

**The chair named its hope out loud** — that the stranger-install falsifier is the fourth
MACHINE-BOUND instance. I did not take that on faith. **It is worse than the chair stated, and for a
different reason than the chair gave.** The falsifier is not defective because no stranger exists.
It is defective because **three of its four proofs print, on a working stranger install, exactly
what a broken one prints, and the fourth prints nothing at all.**

---

## 0 · THE SCORING RULE, REGISTERED BEFORE THE OBJECT

When B's registration lands I score it against these five and nothing else. Each has a stated pass
and a stated fail, fixed now.

| # | Clause | PASSES if | FAILS if |
|---|---|---|---|
| 1 | the stranger-install falsifier | it names an observation whose meaning does not depend on this desktop's corpus, and that a fresh install can print | it carries "the four wake proofs pass, scored by their printed output" in any form |
| 2 | the split predicate | it is a rule a program applies to a path returning SHIPS/STAYS, and it either agrees with `gen-consumer.js`'s MANIFEST or names which one is wrong | it is a principle a reader agrees with, or it disagrees with MANIFEST silently |
| 3 | the per-citation rule for the DANGLING files | the file set is re-derived over the SHIPPED universe | it inherits "5 files" from `librarian/2026-09-03.desktop.md` 10:20 without re-running the grep |
| 4 | the fork target + push step | it names a repo that does not yet exist and a step that creates it | it treats `solariz3d/lighthouse` as the private half |
| 5 | first run's seven questions | they are `CONFIG_FIELDS` and it says what is NOT in that list | it claims the seven are the whole config |

**My own degenerating condition, registered so it can fire:** if I return "holds" on all five, that
is the 45/45 result and I owe the chair a second pass, not a hand-back. And if any finding below
turns out to be independently in B's document — B found it first and I am echoing — **it stops
counting as an attack finding and I say so by name.**

---

## 1 · THE FALSIFIER CANNOT BE SCORED ON THE MACHINE IT NAMES

The registered wording (`librarian/2026-09-03.desktop.md:134`, identically at
`loop/handoff_librarian_2026-09-03.md:35`):

> *a stranger, on a machine none of us has seen, installs from the public repo alone and the four
> wake proofs pass, scored by their printed output*

**The four wake proofs are a fixed, named set** — `librarian/LEDGER.md:15`, row L034:

    (1) YOUR OWN MAP ×4
    (2) an out-of-turn verb refused on the board naming lap-row.js
    (3) a call into a busy pane QUEUED→DELIVERED, never spliced
    (4) the logo readable across the room

Taken one at a time against a fresh install:

**Proof 1 fails by construction, and its failure is the signature of a real bug.** `main.rs:4168`
emits the section only when the map file reads —
`if let Ok(own) = fs::read_to_string(own_map_path(&pane_letter(pane)))` — and the comment at
`main.rs:9389` states the rule directly: *"no map, no section"*. `exo_memory/map/` is not in
MANIFEST (`find exo_memory -type f` in a generated tree returns 21 files, none under `map/`), and a
fresh install has written no maps. A stranger's count is **0 of 4** — the correct output of a
working install, **and byte-identical to the reading that on 2026-09-02 diagnosed the `293c0d7`
map-resolver defect which had silenced every wake since 08-06** (`LEDGER.md:27`). The proof's
discriminating power is a property of this desktop's corpus. Off it, the instrument reads noise and
the reader cannot tell which.

**Proof 2 fails by construction.** `mcp.rs:411` — `fn station_allows(verb, open, holder) { if !open
{ return true; } … }`, with the comment *"NO OPEN LAP MEANS EVERYTHING IS ALLOWED. Freestyle is not
gated."* A fresh install has an empty `lap.jsonl`, therefore no open lap, therefore **no verb is
ever refused and no refusal is ever posted.** The proof looks for a refusal that correct behaviour
guarantees will not occur.

**Proof 3 has never passed here.** `LEDGER.md:15`, same row: *"proof (3) SPLIT — never spliced
PASS, idle read FALSE for the full 240 s on a finished+recap chair screen, delivery FORCED at the
bound."* A falsifier may not require of a stranger an outcome the authoring machine has not itself
produced.

**Proof 4 has no printed output.** It is the keeper's glance. Its own registered falsifier
(`LEDGER.md:24`, indicator amendment 4) is *"the keeper cannot say from across the room which seat
holds the loop and whether it is moving or done."* There is no stranger-readable form of it. A
conjunct that cannot be scored makes the conjunction unscoreable — and in practice whoever runs
this drops it quietly and reports 3-of-3 as a pass, which is the loud-called-silent class.

**Second, smaller, and real: the falsifier is worded as a SUCCESS condition, not a refutation.**
"…and the four wake proofs pass" names what would CONFIRM. The refuting observation is unstated;
the `DEGENERATING IF` clauses that follow are doing the falsifier's job under another name. In a
room whose recurring defect is checks that compute their own pass-condition from the object under
test, a falsifier that only knows how to say yes is not a small wording slip.

**What survives, and it is not nothing.** The *intent* — that the product be provable on a machine
owing this record nothing — is right, and it is the room's strongest instinct. It needs an
instrument whose universe is the fresh tree itself. One already exists, unrun:

---

## 2 · THE REPLACEMENT, MEASURED TODAY — no stranger required

**Nobody chose this number and it came back worse than anyone wanted.** Two commands, twenty
minutes apart, same HEAD:

    node consonance/tools/js-suite.js                     # private tree
    → js-suite: 68 green · 4 failed · 0 crashed · 1 not-run   (of 73)

    node consonance/tools/gen-consumer.js --out <scratch>
    cd <scratch> && node consonance/tools/js-suite.js     # the GENERATED consumer tree
    → js-suite: 42 green · 17 failed · 3 crashed · 1 not-run  (of 63)

**Only two failures are shared** (`carrier-drift.test.js`, `commit-gate.test.js` — red in the
private tree too). Therefore:

> **Generation turns 15 green test files red and crashes 3 more. 18 test files that pass in the
> workshop are broken in the product.**

**All three crashes are manifest gaps, and each names the missing file itself:**

    consonance/hooks/dream-gate.test.js      ENOENT  dev/shell/install.ps1
    consonance/tools/guard-census.test.js    ENOENT  consonance/src-tauri/tests/arch_test.rs
    consonance/tools/universe-print.test.js  ENOENT  dev/shell/hooks/userprompt-submit.js

`consonance/src-tauri/tests/` is an entire Rust test target that has never been in MANIFEST. The
generator's own header claims this gap was *"partly closed 2026-08-23 by `gen-consumer.build.test.js`,
which generates a tree and runs cargo check against it"* — `cargo check` compiles the binary and
never builds `tests/`, and nothing has ever run the JS suite against the output. **Same class as
the 08-23 `build.rs` / `Cargo.lock` finding, found the same way: by running the product instead of
reading the manifest.**

**Register this in place of the stranger clause.** It prints a number; the number means the same
thing on any machine; it can return a value nobody wants — and today it does:

> **FALSIFIER (proposed):** `js-suite` run inside the generated tree must reach parity with the
> private tree's failure set (currently 2 shared reds). **DEGENERATING IF** the generated-tree delta
> is still non-zero after two laps, or if a manifest gap is closed by adding an EXCLUDE entry rather
> than by shipping the missing file.

*The second half is live right now.* The uncommitted edit to `gen-consumer.js` (mtime 10:28,
`git diff` = +2 lines) adds `gen-consumer.fixture-scope.test.js` to EXCLUDE with the reason *"it
would crash on load in a consumer tree"* — a seat discovering by hand, one file at a time, the class
this one command enumerates in full.

---

## 3 · THE SPLIT PREDICATE DISAGREES WITH THE ONLY CODE THAT IMPLEMENTS IT

The librarian's first cut (`librarian/2026-09-03.desktop.md`, 10:20 Q2) against what
`gen-consumer.js` actually stages (`find exo_memory -type f` in the built tree — 21 files):

| | predicate says | implementation does |
|---|---|---|
| `record/` | **STAYS**, and "keeper-decided" | **SHIPS all 3 files** |
| `memory/` | SHIPS iff frontmatter `type` ∉ {user, project} | **ships none** — no `memory/` entry in MANIFEST |
| `exo_memory/BOOT.md`, `README.md` | SHIPS | neither staged into `exo_memory/`; BOOT ships only as `brief/BOOT.md` |

Three disagreements, and `record/` is not academic: the predicate calls it a keeper decision still
open, while the implementation has been shipping it — including
`record/third_place_prehistory_2026-08-30.md`, one of the very files the registration wants a
per-citation rule for. **A predicate contradicted by the only implementation of the split, in the
direction of shipping more than the rule permits, is a principle, not a predicate.**

**On the chair's version of this target — `gen-consumer.js:2` — I checked rather than adopted.**
Line 2 reads *"build the PUBLIC consonance tree from the PRIVATE lighthouse tree."* The chair calls
it wrong because `solariz3d/lighthouse` is public. Half right, and the split matters:

- **The defensible reading:** private/public there is *roles* — SOURCE vs GENERATED — and it is the
  keeper's own wording from the ruling that created the design (`journal/2026-08-22.md:559`:
  *"private is SOURCE, public is GENERATED"*). As a role label it is not a claim about visibility.
- **What does not survive, and it is the stronger point:** the file's security architecture rests on
  a containment boundary that does not exist. Four unauthenticated fetches, run today —

      curl -o /dev/null -w "%{http_code}" https://raw.githubusercontent.com/solariz3d/lighthouse/main/<path>
      200  exo_memory/memory/user-solariz3d.md
      200  exo_memory/journal/2026-08-22.md
      200  exo_memory/BOOT.md
      200  exo_memory/librarian/LEDGER.md

  Every `IDENTITY` LEAK pattern in `gen-consumer.js` — the handle, the email, the OS user, the
  latitude — guards content served at HTTP 200 from the same account. The room already knows this
  (`journal/2026-08-22.md:542`, *"THE REPO WAS ALREADY PUBLIC, AND NOBODY HAD CHECKED"*, and the
  keeper's ruling *"it was never about privacy"*). **The scan is a coherence boundary, not a privacy
  one** — which the file's own "translator first, sanitiser second" line half-says, while the
  three-non-negotiables paragraph above it argues fail-closed on the grounds that *"failing open is
  how a record leaks."*

**And the correction did not propagate.** The map at 10:20 still lists *"the privacy flip on
`lighthouse` (one setting, his)"* as a keeper decision pending — twelve days after the room recorded
that the flip had already happened. That is the carrier class BOOT's 2026-08-23 amendment names: the
correction exists, is unambiguous, and the document routing the work repeats the superseded premise.

---

## 4 · THE "5 DANGLING FILES" IS A GREP OVER THE WRONG UNIVERSE

The librarian's own pattern, run over the librarian's universe and then over the shipped one:

    grep -lE 'muscle_map|TRAINING\.md|journal/' exo_memory/{cards,record,memory}/*.md      → 5
    grep -lE 'muscle_map|TRAINING\.md|journal/' exo_memory/{cards,record,research,spread}/*.md \
        exo_memory/SOURCE.md consonance/src-tauri/brief/SEED.md                            → 6

Neither is the right set:

- **2 of the 5 do not ship at all** (`memory/MEMORY.md`, `memory/consonance-build.md` — MANIFEST has
  no `memory/` entry). A per-citation rule would be written for files not in the product.
- **`research/` and `spread/` were never in the grep**, though both ship by the same predicate — and
  `research/the_retrieval_problem_outside.md` *is* rewritten by the generator today.
- **The number that matters is measured on the output.** Files the generator actually rewrites in
  the shipped `exo_memory/`, by diffing source against the built tree:

      5  exo_memory/record/third_place_prehistory_2026-08-30.md
      2  exo_memory/cards/stop-and-feel-it.md
      1  exo_memory/research/the_retrieval_problem_outside.md
      1  exo_memory/cards/claim-your-continuity.md
      = 4 files, 9 rewritten lines

  **4 files, not 5, and the sets differ in both directions.**

**The rewrites are worse than "unable to rule per citation" — they ship broken English.**
`grep -ro "a master in this line of record"` over the built tree → **5 occurrences**, two of them
ungrammatical:

    record/third_place_prehistory_2026-08-30.md:239   a master in this line of record's **convergent morphology…**
    record/third_place_prehistory_2026-08-30.md:288   `a master in this line of record`'s "hand your continuity…"

The second sits inside backticks, so a stranger reads a code-formatted sentence fragment where a
filename used to be. The regex removes the *pointer* and leaves the *grammar that needed a name*.
Not a hypothesis the registration must anticipate — it is in the tree as generated today.

---

## 5 · THE SEVEN QUESTIONS — the one clause I checked and found sound

`main.rs:78-81`, `CONFIG_FIELDS`: `room_path, instances_dir, data_dir, ambient_lat, ambient_lon,
ambient_label, ambient_tz` — **seven exactly**, read off the struct rather than off a memory of the
config file. The map cites `main.rs:79-114`, which is the span of `parse_config` rather than of the
list; the list is at `:78-81`. Immaterial.

Worth one line in the registration: `dream_model` and `dream_times` are in the live config on this
machine and are **not** in `CONFIG_FIELDS`. If the seven become a first-run wizard, the wizard is not
the whole config, and clause 5 above asks the registration to say so.

**The front door is already built** — `main.rs:297-329`, `pick_default_room`: a machine with no
`room_path` wakes into SEED, not BOOT. The map corrected itself on this at 10:20 (*"a new user today
gets a Rust panic" → false*) and the correction holds; I re-read the function.

---

## 6 · MY OWN CATCHES, BEFORE ANYONE ELSE MADE THEM

**(a) I nearly claimed `letters.json` is never created**, which would have made wake proofs 1 and 3
unrunnable for a stranger in a much stronger sense. **False.** `main.rs:3084` —
`fs::write(letters_path(), s)` inside `pane_letter()`: the registry is written lazily on first pane
creation. A stranger does get lettered panes. The claim died before it left the pane; the proofs
fail for the narrower reasons in §1, which survive.

**(b) I nearly reported that `SEED.md` — the stranger's own front door — ships a dangling citation.**
It does not. SEED's two hits are **bare directory** references (`journal/` as a description of the
reader's own room), and `gen-consumer.js` documents exactly this as non-dangling: *"A bare DIRECTORY
reference is not dangling — a consumer has an exo_memory/journal/ of their own."* The generator
correctly left them alone. **The librarian's grep pattern over-matches**, which is part of why its 5
and my 4 differ; §4's number is the one measured on the output, not the one from the pattern.

---

## 7 · WHAT I DID NOT TEST

- **B's registration.** It does not exist yet. Nothing above scores it; §0 is how it will be scored.
- **`cargo test` / `cargo check` in the generated tree.** Only the JS suite ran there. The
  `arch_test.rs` gap suggests the Rust side is worse, not better, but I did not measure it.
- **An actual install on any machine.** I generated a tree and ran its tests; I did not run
  `install.ps1`, did not launch the app, and saw no pixel. Wake proof 4 stays unscored by me for the
  same reason it is unscoreable by any seat.
- **The laptop.** Everything here is the desktop's tree at HEAD `c8671ad`.
- **Whether `record/` should ship.** §3 reports that predicate and implementation disagree. Which is
  right is the keeper's line, and I did not take it.
- **The 43 identity and 51 dangling rewrites outside `exo_memory/`** (the `--report` totals). I
  diffed the 21 shipped `exo_memory/` files only.

## 8 · PROVENANCE LIMITS ON MY OWN NUMBERS

- The generated tree was built from a **working tree already dirty with another seat's in-flight
  work** — `gen-consumer.js` (+2 lines, uncommitted, mtime 10:28) and `BUILDING.md`. My figures are
  against an uncommitted generator, and I touched neither file.
- The private baseline **moved under the measurement**: 71 test files on the first run
  (`67 green · 3 failed`), 73 twenty minutes later (`68 green · 4 failed`). Another seat is adding
  tests right now. I report the second run and the drift; the 68/4/0 vs 42/17/3 comparison is not
  sensitive to it — the delta is 18 files.
- Every figure re-derives from a command printed beside it. None is quoted from the packet.

---

**Routing note:** the packet says "A, B, K, L live on disjoint packets." This pane is
`8a574b7a-c6a6-410e-acec-9495299391d7` → **letter J** (`C:\Consonance\data\letters.json`), so this
hand-back arrives labelled `[pane:J]`, not as one of the four named. Flagged so the ledger row names
the seat that did the work.

**Owed and not taken:** a LEDGER row for this attack. The baton reads `holder chair`, and the
commit-rule falsifier fired on 09-02 06:52 over exactly the class of one seat reaching into
another's in-flight work. Named here so the chair writes it rather than discovers it.
