# P5 · INHERITANCE — hand-back

**From BRAVO, 2026-09-06. Packet `loop/packet_inheritance_2026-09-06.md` (`1facb75`); collation
`librarian/2026-09-06.md` ~01:35 (`fa5ad2c`); C's ruling `4be2c0b`; E's gate `ba8ddbc`. All read at
the file.**

**Nothing committed. My paths, and only these:**

    consonance/tools/gen-consumer.js
    consonance/tools/gen-consumer.test.js
    consonance/hooks/dream-watch.test.js
    exo_memory/handback/p-inheritance_2026-09-06.md
    exo_memory/map/B.md

**ALPHA: §9 is written for you. It is the list of places I would attack this if I had not built it,
including the two defects I shipped and caught in-lap and the one thing I think is still wrong.**

---

## 0 · ACCEPTANCE, FIRST

    node consonance/tools/gen-consumer.js --report

    staged 263 · excluded 6 · dangling 273 · identity 142 · machine 18 · fixtures 88 · unportable 20

    THE THREE COLUMNS (exo_memory/):
      SHIPS          SELF_TRACE.md SOURCE.md TRAINING.md cards journal memory record research
                     spread the_living_wave.md
      SEEDED/WRITTEN CONSUMER-STATUS.md exo_memory/CUTOFF.md exo_memory/journal/README.md
      STAYS PRIVATE  ASK.md BOOT.md CLAUDE.global.md CONVERGENCE.md PLAN_map_architecture.md
                     README.md _skeleton.py attic convergence_2026-07-28_methodology.md
                     cycle4_handoff.md cycle4_preregistration.md cycle5_preregistration.md
                     cycle6_preregistration.md cycle8_handoff.md cycle9_armA_result.md
                     cycle9_armA_sealed_note.md cycle9_preregistration.md handback librarian loop
                     map muscle_map.md new_entry.py snapshot_2026-08-16_pre-refactor.md third_place
      every top-level entry is in exactly one, or the build refuses.

In the generated tree: **`universe-print.test.js` 15/0** and **`dream-gate.test.js` 50 passed,
1 failed** — the bar held. (`dream-watch.test.js` 40/0 there too, which matters because I edited it.)
Parity as a LIST is §7. `--verify-cutoff` passes on a fresh tree and fails on a one-word edit (§5).

**Where the numbers moved.** Against the tree as this packet found it (P2 applied, not yet landed):
staged **211 → 263**, dangling **117 → 273**, identity **52 → 142**, machine **4 → 18**. The +52
files are 34 inheritance entries, `memory/` (13), `TRAINING.md`, `exo_memory/BOOT.md`, and the 3
generated documents. The rewrite counts move because 47 new prose files entered the pipeline, not
because a rule got greedier — every rule change below narrows or re-aims.

**Identity sweep over the whole generated tree: 0 files.**

    grep -rIl -iE 'solariz3d|trynabemlgzn|zackn|zachslegion' <out>   ->  0

---

## 1 · ITEM 7 — THE IDENTITY SURVIVOR, AND THE TELL, WHICH IS A NEGATIVE RESULT

### The finding you asked for is that your diagnosis is wrong, and the difference decides the fix

The packet says the existing classes missed `ZACHSLEGION` **because of case**, and asks whether that
is true of the other classes too. **Measured, it is not true of this one either.**

`/\bzach\b/gi` was **already case-insensitive**. It missed on the **trailing word boundary** — `\b`
after `zach` fails against the `S` of `SLEGION`. Making every class case-insensitive would have
changed nothing here, which is worth knowing before anyone does it.

### And the general question, answered with an instrument rather than an opinion

I ran every one of the 22 `LEAKS` classes over the generated tree beside a **relaxed twin** of
itself — case-insensitive, word boundaries stripped — and printed only where the twin found
something the live class did not.

**Two classes of 22 differ. One is the survivor. The other is a warning.**

| class | pattern | extra hits under the relaxed twin |
|---|---|---|
| IDENTITY | `\bzach\b` | 1 — `ZACH`, the real survivor |
| IDENTITY | `\bnname\b` | 13 — **every one inside `unnamed` or `singletonName`** |

The `nname` boundary is **load-bearing**. A uniform relaxation would have corrupted 13 innocent
sites across `main.rs`, `board-digest.js`, `guard-census.js`, `imprint-measure.js`,
`memory-sweep.js`, `app.js` and three suites, to catch one real hit. **The tell you asked me to
chase says: do not relax these classes.** Nine of the 22 are case-sensitive and not one of them has
a case-variant anywhere in the tree.

### So the fix is neither of the two on offer: HOSTNAME, keyed on the FIELD

Case was already there and did not help; dropping the boundary has a measured cost. What is left is
that **this was never a name.** It is a computer name — a machine identity that happens to contain a
person's — and it belongs beside `{sysdrive}` and `OneDrive`, not beside the handle.

    { cls: 'HOSTNAME', pat: /HostName:\s*(?!EXAMPLE-HOST\b)[A-Za-z0-9][A-Za-z0-9._-]*/g }
    { cls: 'HOSTNAME', pat: /COMPUTERNAME\s*[=:]\s*(?!EXAMPLE-HOST\b)[A-Za-z0-9][A-Za-z0-9._-]*/gi }

Keyed structurally, it catches **the hostname of a machine whose name contains nobody's name** —
which no name-token rule can ever do, and which is the whole reason to prefer it. There is a test
for exactly that (`BUILD-SERVER-04`).

### Fixed in BOTH places, and the reason is not symmetry

`gen-consumer.js` grew the class **and** `dream-watch.test.js`'s fixture value is neutralised at
source. Fixing only the generator leaves a real hostname sitting in a repository **that is public
today**. Fixing only the fixture leaves the class absent, and the next hostname ships. The fixture's
own header now records what was changed and why, so "captured verbatim" is no longer a false claim.
Checked before editing, not after: nothing reads `HostName`'s value — the fixture exists to exercise
the repeated-field parse. `dream-watch.test.js` is 40/0 in both trees.

**RED FIRST, against the generator at HEAD** (`git show HEAD:...` into a temp module, both loaded
side by side):

    scan() classifies the real HostName line ......... OLD: —          NEW: HOSTNAME
    transform() rewrites the value .................. OLD: survives    NEW: EXAMPLE-HOST

---

## 2 · ITEM 3 — A NAME WRITTEN ON THE OUTSIDE OF A FILE

`scan()` now reads `f.to`, and `collect()` runs the destination through `depath()`. The two landed
together, because either alone is the failure this file keeps naming: a rewrite with no scan cannot
be shown to have fired, and a scan with no rewrite refuses a build over something this pass cannot
fix.

**RED FIRST:** at HEAD, `scan('nothing in this body', 'exo_memory/memory/user-solariz3d.md')`
returned nothing. It now returns `IDENTITY` at `line: 0`.

### What else it catches — and the honest answer is "today, one file"

    git ls-tree -r --name-only HEAD | grep -iE 'solariz3d|zackn|trynabemlgzn'
    -> exo_memory/memory/user-solariz3d.md          (exactly one)

One file is a thin case for a mechanism, so here is the case that is not thin:

- **The standing exposure is the `dir` rules.** Nine of them take their destination from whatever is
  on disk, and they produce most of the tree. Every future file under `memory/`, `cards/`,
  `record/`, `tools/`, `inheritance/` gets its name from an author who was not thinking about this
  tool. This lap alone added 47 such files.
- **The asymmetry is the argument.** Content was transformed and then scanned, so a misfire was
  catchable. The destination was transformed by nothing and scanned by nothing — no guard at either
  end. That is not one file's problem.
- **Only IDENTITY, MACHINE and HOSTNAME run over a path.** DANGLING and RECORD name *files*, so
  running them over a filename would report `exo_memory/inheritance/SELF_TRACE.md` as a leak at its
  own address. PROSE cannot occur in a path.

### The defect I shipped doing this, found in the output and not in the scan

`depath()` and the prose rule must **agree on the same string**, because `memory/MEMORY.md` links to
the renamed file. My first version put `repath()` four lines too low in `deidentify()` — after the
handle rule had already run — so there was nothing left to match, and the generated index shipped:

    - [the keeper (the user)](user-the keeper.md)

**A link with a space in it, pointing at nothing, in the one file whose entire job is pointing** —
produced by the function written to prevent exactly that. Caught by opening the generated index, not
by any instrument. An ordering bug in a chain of rewrites is invisible from the rule and obvious
from the output, which is this file's own first principle arriving one layer down. Fixed, commented
at the line, and there is now a test asserting the link and the rename land on the same string.

    MEMORY.md links: 12 · dead: []

---

## 3 · ITEM 2 — BOOT, AND NO RUST

`{ from: 'consonance/src-tauri/brief/BOOT.md', to: 'exo_memory/BOOT.md' }` — the gen-brief-transformed
brief at the master's path.

**No Rust is needed and none was touched, and that was the thing to check before writing the line.**
C's §3 left open whether `pick_default_room`'s precedence has to change. It does not. The precedence
is only a hazard *while the losing file is the clean one*; putting the clean file at the winning path
satisfies `pick_default_room` exactly as written. **Nothing is parked.**

It also closes `SOURCE.md`'s two pointers to the front door, which named a path no rule produced and
no `dedangle` rule rewrote — a router file whose pointers to the room's door went nowhere.

---

## 4 · ITEM 1 — THE DEDANGLE RE-POINT, AND WHY IT IS NOT A LOOSENING

Three classes were written on the premise that the record does not ship. All three are now wrong in
both directions, and each is re-aimed at its own site:

| | before | after |
|---|---|---|
| `journal/<date>` | DANGLING; rewritten to `the record, <date>` | **re-pointed** to `exo_memory/inheritance/<date>.md`, line number kept |
| `SELF_TRACE`, `the_living_wave` | RECORD; rewritten to prose | **re-pointed** to their inheritance path; still RECORD anywhere else |
| `muscle_map` | RECORD; rewritten to prose | **unchanged** — it does not ship |

The three rules are now visibly different, and that is deliberate: made uniform, the one that has to
stay strict would have been loosened by tidiness.

### What the new rule catches that the old one did not

1. **The bare relative form.** The old pattern required `exo_memory/`; `journal/2026-08-17.md` — the
   form a document uses when it is already talking about exo_memory/ — was invisible.
2. **The extension-less form.** `carrier-drift.js:659` writes `journal/2026-08-17` inside a sentence.
3. **Backslash separators.** `606\exo_memory\SELF_TRACE.md` in a memory file. This one **refused a
   real build** before I handled it.
4. **A reference to `journal/` itself is now dangling and was not before** — that directory is empty
   by design rather than absent.

### And the half that makes it a trade rather than a loosening

Converting a class that REFUSED into a class that REWRITES is precisely the move the packet warned
about: the build still passes, and a citation to a date that never shipped now reads as a working
link instead of an obviously dead one — **strictly worse, because it looks fine.**

So the regex was **traded for a resolution check**: every `exo_memory/inheritance/<name>.md`
reference in the OUTPUT is resolved against what actually staged. That catches what no pattern can —
a citation to a date the private tree does not have, a typo, an entry deleted upstream with its
citations alive, and any future narrowing of the `journal/` dir rule. Fixtures exempt, for the reason
they are exempt from DANGLING everywhere. `unresolved` refuses the build; it is `[]` today.

**The anti-loosening guard is a test, not a promise.** `gen-consumer.test.js` asserts that
`journal/<date>` — bare, prefixed, and backslashed — is STILL a DANGLING finding, and that
`muscle_map` is untouched. Two mutants confirm it (§8).

---

## 5 · ITEM 5 — CUTOFF, TAMPER-EVIDENT AND NOT HEAVIER THAN THAT

C asked for a body that is a pure function of the sha **and the date**. I tightened it to a pure
function of **the sha alone**, taking the date from `git show -s --format=%cI` rather than the clock.
That is one extra git call and it buys two things:

- **an edited DATE is caught.** With a wall-clock date it would not be — re-rendering from the edited
  date reproduces the edited file, and the check passes over a forgery. There is a test for this.
- **two generations from one commit produce a byte-identical CUTOFF.md**, so a regeneration that
  changes this file is telling you the commit moved.

    node consonance/tools/gen-consumer.js --verify-cutoff <dir>
      fresh tree      -> "CUTOFF.md matches a re-render from the commit it names."   exit 0
      one word edited -> names the line, generator vs on disk                        exit 1

**No fingerprint, no digest, no signature.** I drafted a hashed FINGERPRINT line and dropped it: it
adds nothing a re-render does not already do, and the packet's refusal clause is right that a
mechanism heavier than the document deserves is its own failure. **It is tamper-EVIDENT, not
tamper-proof** — someone who edits a sentence and re-runs the generator produces a consistent file
again. What it makes impossible is a *quiet* edit, and quiet is the whole failure mode.

It pairs with C's check (a) (a CUTOFF.md that changed alone in its own commit), which needs no code
and catches what (b) cannot. **Both, not either** — C's wording, kept.

**A guard on the guard:** the build refuses if any transform edits CUTOFF.md, because the check is a
byte comparison and a document the pipeline rewrites could never pass it. Without that, the check
would have been loosened until it caught nothing. Tested.

---

## 6 · ITEMS 4 AND 6

**SEED's one sentence** is a *generator transform*, not an edit to `SEED.md`, and that is a finding
rather than a workaround: **the private tree's `journal/` is not empty, so writing the sentence into
the master would make the shipped brief say something false about the tree it lives in.** It is true
only of the generated tree, so it belongs to the thing that generates it — the same shape as
`gen-brief.ps1`'s anchored transformations, with the same discipline: anchored on the exact sentence,
and **it refuses the build if the anchor moves**, because a transform that silently no-ops is the
inert guard this file has already found twice. One sentence, appended after *"the record is nearly
empty"*:

> Your journal is empty; the keeper's is in `exo_memory/inheritance/`, kept under that name because
> it is someone else's nights and not your memory.

**`build()` → the status document.** I did **not** import E's `renderStatusDoc`, and the reason is
measured rather than stylistic:

    node -e "require('./consonance/tools/gen-consumer.build.test.js')"
    -> 11 tests, 7 pass / 4 skipped, ~1.6 s, and it spawns PowerShell

`node:test` registers at module load, so importing it makes **every generation run E's suite**. A
generator that runs a test suite as a side effect of generating is a worse defect than a duplicated
12-line template. So the template is copied and **the drift is made red**: `gen-consumer.test.js`
renders the same input through both and byte-compares, running E's copy in a **child process** so its
suite stays out of mine. A mutant confirms the guard fires.

**Routed, not done — the right end state is neither:** the pair belongs in a plain module both files
require. That means editing `gen-consumer.build.test.js`, which is E's.

**`journal/` ships as a directory with one honest note**, because an empty directory does not survive
git — and the note is the only place a new user is told, at the moment they look, why the folder they
expected to be full is not.

---

## 7 · THE SECOND PARITY RUN — AS A LIST

    SOURCE     73 green · 2 failed · 0 crashed   (of 75)
    GENERATED  48 green · 20 failed · 0 crashed  (of 68)

    SHARED RED (standing debt, not parity):
      consonance/tools/actors.evidence.test.js
      consonance/tools/carrier-drift.test.js

    P — RED IN THE GENERATED TREE ONLY (18):
      consonance/hooks/dream-gate.test.js          consonance/tools/gen-consumer.build.test.js
      consonance/hooks/sessionstart-state.test.js  consonance/tools/librarian-cite.test.js
      consonance/tools/ask.test.js                 consonance/tools/librarian-notes.test.js
      consonance/tools/attached.test.js            consonance/tools/pair-ledger.test.js
      consonance/tools/commit-gate.test.js         consonance/tools/portable-paths.test.js
      consonance/tools/corpus-age.test.js          consonance/tools/second-vantage.test.js
      consonance/tools/corrections-gate.test.js    consonance/tools/shelf-recursion.test.js
      consonance/tools/forget-rate.test.js         consonance/tools/shelf-tier.test.js
      consonance/tools/gen-brief-gate.test.js      consonance/tools/state-block.test.js

    SOURCE-ONLY RED: (none)

**P = 18, the same integer as 2026-09-04 — and this is the clearest possible argument for the
keeper's demotion of it.** The composition changed underneath a stationary number: **crashes went
2 → 0**. `universe-print.test.js` is green in the generated tree and `dream-gate.test.js` fails
honestly instead of dying at line 65. A new member joined (`gen-consumer.build.test.js`, E's, which
needs cargo and the probe). **A tree that got materially better reported the same figure**, which is
exactly what an instrument is allowed to do and a bar is not.

---

## 8 · MUTATION — 14 applied, 14 caught, 0 survivors

One per item where one was possible; each is an edit a reader could plausibly make — a revert, a
tidy-up, a "simplification".

    caught  item 7 · the HOSTNAME class is deleted
    caught  item 7 · the hostname REWRITE is a no-op
    caught  item 3 · scan() stops reading the destination path
    caught  item 3 · depath() is the identity function
    caught  item 3 · repath() stops rewriting filenames
    caught  item 1 · the journal re-point reverts to prose
    caught  item 1 · the DANGLING class is LOOSENED until journal/<date> walks through
    caught  item 1 · the RECORD lookbehind is widened until SELF_TRACE is never caught
    caught  item 4 · reseed() reports a missing anchor as fine
    caught  item 5 · CUTOFF takes its date from the CLOCK, not the commit
    caught  item 5 · verifyCutoff accepts anything
    caught  item 6 · the status contract drifts from E's copy
    caught  C §8.2 · one STAYS_PRIVATE entry is dropped
    caught  desync · the ALLOW exemption is removed, blinding the shipped path ratchet

**Two of these were NOT APPLIED on the first run** — the anchors missed — and I re-anchored and
re-ran them rather than reporting the pass, because a NOT APPLIED is not evidence and reads exactly
like a caught one in a summary line.

`gen-consumer.test.js` 49/49 · `gen-consumer.fixture-scope.test.js` 7/7 · `js-suite` 38/38 ·
`dream-gate` 51/51 · `universe-print` 15/15 · `dream-watch` 40/40 · `ambient-default-claim` 2/2.
`portable-paths.js`: **green — 209 files in scope, 168 known sites, 0 new. Nothing baselined.**

---

## 9 · FOR ALPHA — WHERE I WOULD ATTACK THIS

**Two defects I shipped and caught in-lap. Start here, because they are the shape of what I missed.**

1. **`$1` never expanded.** The hostname rewrite used the `rep()` helper, which passes a *callback*
   to `String.replace` — and a callback's return is not `$1`-expanded. The generated fixture read
   `$1EXAMPLE-HOST` where a parseable `HostName:` line belonged. **The leak was genuinely gone, the
   scan was green, and the build wrote the tree.** That is `destructure()`'s 2026-08-15 lesson
   exactly: finding real, fix catastrophic, every instrument silent. It was caught by asking what
   `transform()` *produces*, not what `scan()` says. **Attack every other rewrite I added the same
   way — ask for the output string, not the verdict.**
2. **The ordering bug in §2** — the index link with a space in it. Same class: the guard was green
   and the artefact was broken.

**Where I think it is still weak, in the order I would look:**

- **`desync()` edits the keeper's dated journals.** Seven `OneDrive` sites in shipped inheritance
  prose become `<sync-dir>`. That is consistent with how every other prose file is treated, and it
  is still *editing an inheritance* — and inheritance is the one thing this lap says should read as
  someone else's real nights. If the room would rather keep those words, the alternative is a
  narrower `OneDrive` class, not an EXCLUDE.
- **`606`.** The generated tree carries `%USERPROFILE%\<sync-dir>\Desktop\606` and a shipped file
  named `signal-and-606-night.md`. No class covers it. I did not invent one late in a lap, and I
  think it should be ruled rather than pattern-matched — is a private project's directory name an
  identity surface or not?
- **`memory/` ships 13 files I did not cold-read.** I measured them against every LEAKS pattern and
  swept for identity; I did not read them for the PROSE class, which is the one class a grep does
  not find. C priced this column mechanically too. **Somebody should read those 13.**
- **The HOSTNAME class only knows two doors** (`HostName:` and `COMPUTERNAME`). A hostname in a UNC
  path, a URL, or a bare log line walks past it. It is strictly better than a name-token rule and it
  is not general.
- **`STAYS_PRIVATE` is 25 hand-written entries.** The guard makes an *unclassified* file red; it
  cannot make a *wrongly* classified one red. If I put something in the private column that should
  ship, nothing complains.
- **`--verify-cutoff` runs from the private tree.** A consumer cannot check their own CUTOFF, because
  the generator does not ship. I think that is correct and I am not certain.
- **The `dedangle` re-point is idempotent by lookbehind, tested on one round trip.** Try three.

---

## 10 · WHAT I DID NOT VERIFY

- **That the generated tree builds, or launches.** No `cargo`, no probe. That is E's gate and it is
  blocked on the mutex question. **Nothing Rust was touched. No rebuild is needed to land this.**
- **That the app reads the new tree correctly.** I argued from `pick_default_room`'s source that the
  transformed brief at `exo_memory/BOOT.md` wins; I did not run the app to see it win.
- **The 34 inheritance entries as PROSE.** Scanned by every class, swept for identity, `unresolved`
  empty. Not read.
- **That a stranger's clone is coherent.** I checked the citations resolve and the index resolves. I
  did not walk the tree as a reader.
- **`CONSUMER-STATUS.md` in its MEASURED state.** The generator only ever writes UNMEASURED; the
  measured half is `--gate`, which has never run end to end (E's §8).
- **Anything about the desktop machine.**
- **`--verify-cutoff` against a tree generated from a DIFFERENT commit than the one checking it.**
  It should report the commit as unknown; I tested the present-commit paths only.

---

## 11 · ROUTED, NOT DONE

1. **`renderStatusDoc`/`checkStatusDoc` belong in a plain module both files require** — E's file.
2. **`dev/dream/dream_cycle.ps1`** — still the one red in `dream-gate`, still a repo-shape decision,
   unchanged from P2 §10.1.
3. **`606` needs a ruling**, not a regex (§9).
4. **Somebody should cold-read `memory/`'s 13 files** for the PROSE class before the first push.
5. **The keyed mutex** (the librarian's 01:47 entry) is what unblocks the launch half; not mine.
6. **`.py` is still outside `portable-paths.js`'s `EXTS`** — carried forward from P2, unaddressed.

---

    OBJECTIVE:  the generated tree carries the room, labels what is inherited, starts the new user's
                record empty, and leaks no identity — inside a file or on it.
    SCORED:     it carries 34 inheritance entries under a label, an empty journal/ with a note, a
                generator-written CUTOFF, and 0 files matching any identity token. The FALSIFIER
                ("if a name reaches the public tree in a path rather than in content, item 3 was
                written for the wrong surface") did NOT fire — but only because item 3 landed with
                its rewrite; at HEAD the handle was in a destination path and the scan could not see
                it. It fired on the way in, not on the way out.

---

# APPENDED 2026-09-06 ~03:15 — A's TWO DEFECTS, FIXED

*A's attack: `handback/p-inheritance-attack_2026-09-06.md`. Collation: `librarian/2026-09-06.md`
~03:00 (`ad0c9b7`). Both read at the file. Verdict was LAND IT with two fixes first; both are one
function each and neither was widened. Nothing committed.*

**Taken first, because it is A's and not mine:** A confirmed the boundary-vs-case correction **from
the command**, on a file A did not write, and the chair withdrew the case diagnosis. That closes it
two-way. A also answered the question I could not answer about my own work — whether
`--verify-cutoff` is checkable by someone who did not write it — by checking it rather than by
trusting the label.

---

## A1 · DEFECT 1 — A SECOND LIVE `$1`, AND IT WAS NOT MINE

`gen-consumer.js:1036`, `demachine()`'s helper:

    const rep = (re, to) => { body = body.replace(re, () => { n++; return to; }); };

A callback that does not even take the match. Ten lines below it, a replacement ending `...on $1`.
So generated `main.rs` has been shipping *"the repo moved out of a personal sync directory on $1"*
since `fa16075` — the desktop's lap, not this one. **The identical mechanism I had documented in the
comment block in the function immediately below**, found by A running the method that comment
recommends over every rewrite in the file rather than only the new ones.

**RED FIRST, on the real source line:**

    IN   /// ...the repo moved out of OneDrive on 2026-07-28
    OUT  /// ...the repo moved out of a personal sync directory on $1     <- before
    OUT  /// ...the repo moved out of a personal sync directory on 2026-07-28   <- after

**A's oracle, the produced-tree sweep, aimed back at me:**

    grep -rn '$[0-9]' <produced tree>
      before: 5 hits — 4 regex sources inside replace(), 1 artifact at main.rs:404
      after : 4 hits — the 4 regex sources. The artifact is gone; the class is empty.

**The fix delegates expansion to the engine instead of reimplementing it.** Counting is what forced
the callback, so counting is a separate `match()` pass and the replacement is handed to
`String.replace` as a **string**, where `$1` means what every reader already thinks it means.
Writing a third `$1` expander in this file would have been a third place for the class to live.

*Two assertions, not one: the unit pins the mechanism on the real line; the tree sweep is the
end-to-end control. The sweep's one limit is stated in its own comment — it treats a `$1` as
legitimate when the line also contains `replace(`, which is true of all four survivors and is a
heuristic, not a proof.*

---

## A2 · DEFECT 2 — THE GENERATOR STAMPED A SHA IT HAD NOT EARNED

    grep -c 'porcelain|dirty|isClean' consonance/tools/gen-consumer.js   ->  0

The generator reads the **working tree** and wrote `git rev-parse HEAD` into the two documents whose
entire job is provenance. `commitIdentity()`'s own docstring said it *"refuses rather than guessing"*
— **it refused to guess the sha and guessed the correspondence.** A's phrasing, and it is the whole
finding.

### The fix: refuse a WRITE from a dirty tree; override is `--allow-dirty`

**Refusing is the file's own atomic principle turned on itself.** Property 2 says the destination is
not touched until the scan is clean, because a leaked tree on disk is worse than a failed build. A
tree stamped with a commit that does not describe it is the same shape of artefact: it exists, it
looks finished, and it asserts something false.

**It refuses a WRITE, not a dry run,** and that boundary is substance rather than convenience. The
defect is a *tree on disk* making a false claim; `--report` produces no tree and now prints the
unearned state on its own CUTOFF line. Refusing that too would make `--allow-dirty` reflexive within
the hour, and **a flag everyone always passes is a guard switched off with extra steps.**

### How a reader tells an overridden stamp from an earned one — without knowing the flag exists

`exo_memory/CUTOFF.md`, when overridden, replaces its provenance sentence with:

    Generated from a WORKING TREE at commit `<sha>`, dated <iso>,
    **with uncommitted changes on top of it.**

    > **THIS PROVENANCE IS NOT EARNED.** The commit above names where the tree was generated
    > *from*, not what was generated. Some of the files here were never committed anywhere, so
    > checking out that commit will NOT reproduce this tree. ...the generator refuses a dirty
    > tree unless it is run with `--allow-dirty`, and that flag is what put this block here.

`CONSUMER-STATUS.md` gains `PROVENANCE: UNEARNED — generated from a working tree with N uncommitted
change(s)...`. **Deliberately a separate line and not a `-dirty` suffix on the sha:** E's
`checkStatusDoc` requires `GENERATED-FROM: <7-40 hex>` on its own line, so the obvious encoding is
the one that breaks E's contract. Verified by running **E's own checker** over the dirty document in
a child process — it returns `[]`. The clean render stays byte-identical to E's copy, so the drift
guard still works. A mutant applies the suffix encoding and is caught.

**Untracked files count**, and that is not strictness: nine manifest rules are `dir` rules that
enumerate the working tree, so an untracked file in `cards/` or `memory/` ships into the consumer
without having been committed anywhere.

`--verify-cutoff` re-renders in the mode the document declares, so a dirty stamp is still checkable
and **deleting the UNEARNED block is caught** rather than laundered into an earned one. Tested.

---

## A3 · THE MUTANT THAT SURVIVED, AND WHAT IT CAUGHT ME DOING

**8 mutants applied, 7 caught on the first run. The survivor was mine:**

    SURVIVED  defect 2 · commitIdentity stops looking at the working tree

My test read the expected dirtiness from `G.commitIdentity()` and then asserted the build agreed
with it. Mutate `commitIdentity` to always report clean and **both sides move together — the guard
is compared against itself.** That is js-suite's own E-2 lesson (a control that exercises the fixture
instead of the instrument proves nothing about the instrument), committed inside the test written to
close a provenance hole, four hours after I quoted the same lesson at somebody else.

The oracle is now `git status --porcelain` run independently in the test, and the mutant dies.
**8 applied, 8 caught, 0 survivors.**

---

## A4 · WHAT THIS MEANS FOR THE FIRST PUSH — I AGREE, WITH ONE PRECISION

**Every generated tree this room has produced carries an unearned sha.** That includes the one the
librarian verified at 02:45 and the one A generated for the attack. Nothing has been pushed, so
nothing is public — but **the provenance line has never once been true.**

The precision, because it changes what to re-check rather than softening it: `--verify-cutoff`
answered *honestly* on those trees. The document really was a pure function of the sha, and the sha
really was in the repo. **It was answering a narrower question than its readers were asking** — the
label was intact and the goods were not what the label said. A verification that is correct about
the wrong thing is the harder kind to notice, which is why A found it by asking what the check does
*not* cover rather than whether it works.

**Operationally: the first push must be generated from a clean checkout, with no `--allow-dirty`.**
That is now enforced rather than remembered. Every tree generated before this fix should be treated
as scratch and regenerated; none of them should be the one that is pushed.

---

## A5 · RE-VERIFIED AFTER BOTH FIXES

    gen-consumer.test.js              53 / 53
    gen-consumer.fixture-scope.js      7 / 7
    generated tree: universe-print    15 / 0
    generated tree: dream-gate        50 / 1     (the dev/dream/ gap, unchanged and still routed)
    generated tree: dream-watch       40 / 0
    portable-paths                    green — 209 in scope, 168 known sites, 0 new, nothing baselined
    $[0-9] sweep of the produced tree  0 artifacts (4 regex sources, all inside replace())
    mutants                           8 applied, 8 caught, 0 survivors

**Not verified, unchanged from the original hand-back:** no `cargo`, no launch, no app run; the
inheritance entries are scanned and swept but not read as prose; `memory/`'s 13 files still want a
cold read before the first push. **No Rust was touched and no rebuild is needed to land.**

**One thing I did not do and could have:** the other three `rep`-style helpers in this file still use
callbacks. None of their replacements contains a `$`, so none is live — I left them, because the
packet said one function each and because the produced-tree sweep now catches the class **wherever**
it reappears, which is a better guard than three edits.

---

# APPENDED 2026-09-06 ~03:40 — THE memory/ CUT (third item, same landing)

*The keeper's rule, 03:13: **METHOD SHIPS, STATE DROPS**, argued from maintenance law 3. Filed at
`librarian/2026-09-06.md` ~03:10 (`321a910`), read at the file. Nothing committed. **No file in
`exo_memory/memory/` was deleted or edited** — the cut is made in the manifest, so the private tree
keeps everything and law 2 holds.*

---

## M1 · THE LIST WAS NOT A PARTITION — 11 of 12

    SHIP 6 + DROP 3 + YOUR CALL 2 = 11.   Files on disk: 12.
    IN NO LIST:  signal-and-606-night.md

**Under a `dir` rule, a file nobody ruled on SHIPS.** That is the inverse of this manifest's
allow-list default, and it is the whole reason an unnamed file is dangerous rather than merely
undecided: "nobody decided" resolves to "it goes to a stranger."

**Classified by the keeper's own rule rather than left to the default: DROPPED.** It is a build log
of one night on one project, carrying the old machine's paths — the same class as
`consonance-build.md`, which he named. **Flagged here so it can be overturned with one line**, and
it is *not* covered by the 606 ruling: that ruling is about not sanitising a trace *inside a shipped
card*, never about which files ship.

**And the guard that should have caught it did not, which is its own finding.** My C §8.2
classification guard works on `exo_memory/` TOP-LEVEL entries. `memory/` is one entry, so everything
inside it is invisible to that granularity. There is now a second guard pinned to the keeper's
decision: **add a card to `memory/` and the suite goes red** rather than the card shipping. A mutant
un-classifies `signal-and-606-night` and is caught.

---

## M2 · THE TWO YOU ROUTED TO ME — BOTH DROPPED, REWORDS SHOWN

### `user-solariz3d.md` → DROP

**The reword, written so the decision can be argued with:**

> **name:** who-you-are-with · **type:** user
> The person in front of you is the keeper of this room from their first turn. You do not know who
> they are yet and this card will not tell you — it exists to be *replaced* by what you learn, in
> their words, checked with them. Until then: no profile, no verdict, no inference from a name.

**And that is why it does not ship.** Every sentence of it is already in `SEED.md`, which ships and
is the first thing a new user reads — *"the person you're with is the keeper of this room from their
first turn… never to tell them who they are."* Adding a second copy in the memory store is a second
thing to keep in sync saying the same thing.

The deciding argument is the SLOT rather than the words: `type: user` is the slot the **new user's
own** profile belongs in, and shipping either version pre-fills it — one with a stranger's profile,
one with a placeholder telling them what the empty slot is for. **An empty slot already says that.**

**Does my `f.to` fix cover it?** Yes, and it is worth being exact about what "covers" means.
`depath()` renames it to `user-the-keeper.md` and `scan(f.to)` refuses if the rename ever fails —
verified by a mutant. Dropping the file makes *this* case moot; the mechanism stays, and it is the
`dir` rules it was really for. **The `EXCLUDE` key is the SOURCE path**, `exo_memory/memory/user-solariz3d.md`,
because `EXCLUDE` is keyed on `f.from` — the withheld name and the renamed one are different strings
and only one of them is the key.

### `dont-offer-rest-assume-momentum.md` → DROP

**The reword already exists, ships, and is better than anything I would write:**
`cards/never-pathologize-the-user.md` — the matured, generalised form, which supersedes this card
**by name** in its own footer. Writing a third wording would be a third thing to keep in sync.

**And the carrier finding, which is the part that matters more than the drop** (§M3).

*Neither decision rests on the routing gap the chair withdrew. I did not measure invocation and do
not claim to have; both are decided on law 3 and on duplication that is checkable by `ls`.*

---

## M3 · WHAT THE CUT DOES **NOT** DO — measured, and it is the finding to carry

    for f in exo_memory/memory/*.md; do test -f exo_memory/cards/$(basename $f) && echo $f; done
    -> 6 of 12

**Six of the twelve `memory/` cards also exist in `cards/`, which ships.** So for two of the files
in the cut, removing the `memory/` copy **does not remove the text from the consumer tree**:

| | |
|---|---|
| `lighthouse-dive-buddy-reframe.md` | **the retired vocabulary still ships, from `cards/`** |
| `dont-offer-rest-assume-momentum.md` | the person-specific phrasing still ships, from `cards/` |

That is the 2026-08-17 carrier lesson exactly — *editing the downstream documents moved nothing
because the carrier was never edited* — and the retired-metaphor case is the same failure the room
already measured once, at five weeks. **`cards/` is C's ruling and the keeper's, not this seat's, so
it is reported and untouched.** It is one `EXCLUDE` line if they want it.

**A second measurement, unasked, that bears on the SHIP list:** of the keeper's six, **four also
ship from `cards/`** — and for `claim-your-continuity` the `memory/` copy is the **stale** one
(2,068 B against the card's 5,125 B). A stranger gets two copies of four instruments and the shorter
one is out of date. That is maintenance law 1 (*recall from the master, never a copy*) rather than
law 3, and it argues the cut should have gone further. **His decision, implemented as given; the
measurement is here so it can be re-opened rather than re-discovered.**

---

## M4 · THE INDEX, AND THE SURFACE THE CUT BROKE

**`MEMORY.md` is FILTERED against what actually staged**, not hand-edited and not regenerated from
filenames. Hand-editing the private index would make it false where it lives — the private tree
still has all twelve, the same reason SEED's sentence is a transform. Regenerating from filenames
would throw away twelve hand-written descriptions to avoid keeping one stale. Filtering keeps the
prose and **cannot dangle by construction**, because it is derived from the staging set. Result: 6
links, 0 dead. It refuses if the link syntax ever changes, because a filter that silently keeps
everything looks exactly like one that had nothing to remove.

### `[[wiki-links]]` — 14 dangling, and no class in this file could see them

Found by opening a shipped card after the cut. `[[name]]` is neither a path nor a filename, so
`dedangle()`, `repath()`, the exclusion-debt check and `scan()` all missed it.

**Nine were created by the cut. FIVE PRE-DATE IT** and are the wiki form of the markdown-link defect
I fixed earlier this lap: `[[user-solariz3d]]` shipped as **`[[user-the keeper]]`** — a link with a
space in it, pointing at nothing. The same bug, on the one surface that fix could not reach, already
in the tree.

Fixed as two rules because they are two questions: `repath()` now covers the bracket form (a link to
a *renamed* card lands on the renamed file), and `dewiki()` answers *does the target ship at all* —
dropping the link syntax when it does not, against **the staging set rather than a list**, so the
next cut is handled without editing anything. **Dangling wiki-links in the produced tree: 0.**

**Two defects found by reading the output of that fix, not its verdict** — the method that has
earned its keep three times in this lap now:

1. **Replacing the link with its bare name read as corruption.** `...includes the other.
   user-the-keeper signal-and-606-night With him...` — two slugs adrift in a sentence. All 22 sites
   are trailing `See …` / `Links: …` runs (checked, not assumed), so the reference and its separator
   come out together and the sentence closes over the gap.
2. **The stub rule was keyed on two label names and left `Fuller record:.` standing** in a shipped
   card. A label whose list is now empty is the same defect one word smaller, and enumerating labels
   is how you keep finding the next one. Re-keyed on the *shape* — a colon immediately followed by a
   full stop, which does not occur in prose that was not just emptied.
3. **And it ate a file's final newline.** When a card's last line was its see-also, the cleanup took
   the clause and the trailing byte with it, and a shipped card ended mid-line — invisible to every
   leak class here. Restored explicitly, and **swept over all 77 shipped `.md` files** rather than
   pinned to the one, because this will not be the last rule that trims the end of something.

### The 606, precisely

**Untouched, as instructed.** `interior-at-the-seam.md` keeps *"To start near where I ended the 606
night"* in its description, verbatim. Its count fell from 2 to 1 for a different reason and I want
that on the record rather than discovered later: the second occurrence was the dead link
`[[signal-and-606-night]]`, removed because that card no longer ships. **The prose was not
sanitised; a pointer to nothing was.**

---

## M5 · MUTATION AND RE-VERIFICATION

    caught  memory cut · one EXCLUDE entry is dropped, so a state card ships again
    caught  memory cut · the unnamed file is un-classified and ships by default
    caught  index · reindex() stops filtering
    caught  index · a missing anchor reports as fine
    caught  wiki · dewiki() stops dropping unresolved links
    caught  wiki · the resolution set is built from cards/ only
    caught  newline · the trailing-newline guard is removed
                                                        7 applied · 7 caught · 0 survivors

**Two survived first, and both were my tests rather than the code.**

- *dewiki stops dropping unresolved links* was caught, but *narrowing the resolution set* was not:
  my test asserted only that **nothing dangles**, which is satisfied perfectly by a rule that strips
  **every** link. The null tree has no dead pointers in it. **A guard that can be satisfied by
  deleting the thing it guards is not a guard.** Added the other direction — links that resolve must
  survive, counted, plus a unit.
- It *still* survived after that, and the honest reading is that it is an **equivalent mutant on
  today's data**: no shipped card currently links to a memory-only card, so cards/-only and
  cards+memory produce identical bytes and no output test can separate them. The set is still wrong
  when narrowed, and it goes wrong the first time anyone links to `frozen-is-not-dead`. So the SET
  is now on the report and asserted directly. **Pinning the set is how a guard covers a case the
  data does not yet contain.**

*That is the second time this lap a mutant has caught my test rather than my code, after the
provenance oracle comparing the guard against itself. Both were the same shape.*

    gen-consumer.test.js            57 / 57      (was 53; +4 for this item)
    gen-consumer.fixture-scope       7 / 7
    js-suite-self                   38 / 38
    generated tree: universe-print  15 / 0
    generated tree: dream-gate      50 / 1       (the dev/dream/ gap, unchanged, still routed)
    generated tree: dream-watch     40 / 0
    portable-paths                  green — 209 in scope, 0 new, nothing baselined
    identity sweep over the tree     0 files
    --verify-cutoff                 passes
    staged 260 · excluded 12 · dangling 271 · identity 131 · machine 14

---

## M6 · ROUTED FROM THIS ITEM

1. **`cards/` still ships the retired dive-buddy vocabulary and the person-specific rest card.** The
   cut does not reach them. One `EXCLUDE` line each if the keeper wants it; not mine to rule.
2. **Four of the six shipped `memory/` cards are duplicates of `cards/`, one of them stale.** Law 1,
   not law 3. Re-openable with the measurement in §M3.
3. **`signal-and-606-night.md` was classified by this seat, not by the keeper.** One line to
   overturn.
4. **The `exo_memory/` classification guard is top-level only** — it cannot see inside a shipped
   directory. `memory/` now has its own pinned list; `cards/`, `record/`, `spread/`, `research/` and
   `inheritance/` do not.

---

# APPENDED 2026-09-06 ~04:15 — ONE MASTER (the last manifest piece)

*The keeper, 03:56: **"yes one master, cards/ ships, drop the retired one."** Nothing committed. No
file on disk was edited or deleted; the change is five `EXCLUDE` lines.*

## O1 · WHAT SHIPS NOW

    exo_memory/cards/     11 files   (12 minus lighthouse-dive-buddy-reframe.md)
    exo_memory/memory/     3 files   frozen-is-not-dead.md, split-the-work-with-the-panes.md,
                                     MEMORY.md (filtered — 2 links, 0 dead)

    staged 255 · excluded 17 · dangling 271 · identity 125 · machine 14

**No card name ships from two directories any more**, and that is asserted rather than left to the
exclusion list staying right: a test walks the collected set and fails naming any duplicate. The
retired dive-buddy card is excluded at the **carrier** — cutting it from `memory/` an hour ago while
`cards/` went on shipping it was the 2026-08-17 failure reproduced inside the lap that reported it.

**The duplicates leave by name, not by narrowing the predicate.** A narrowed predicate would say the
FILES are wrong; what was wrong is having two of them.

## O2 · ANSWERING THE QUESTION YOU ASKED — does this make the reconciliation harder?

**No, and concretely rather than as reassurance:**

- **Both files are untouched on disk.** `memory/claim-your-continuity.md` (2,068 B) and
  `memory/verify-before-claiming.md` (2,207 B) are exactly where they were. The append has both
  sources to work from; nothing was merged, picked, or overwritten.
- **`EXCLUDE` withholds; it does not delete.** Its whole semantic is *considered and withheld*, and
  the reason string on each of those two entries says the divergence is real and names the append as
  the resolution — so the next reader of the exclusion list meets the pending work rather than
  concluding the question was settled by exclusion.
- **Lifting it is one line each**, after the append lands, with no other change anywhere.
- **The one thing to watch, stated because it is the only way this could bite:** the duplicate-name
  test will go RED the moment the `memory/` copies are un-excluded without being removed. That is
  correct behaviour and it is also a tripwire in the reconciler's path — if the append's plan is
  *merge into cards/, then keep both files privately*, the exclusions simply stay and nothing goes
  red. If the plan is *un-exclude the memory copy*, the test will say no. **Whoever does the append
  should read that test before deciding which shape the reconciliation takes.**

## O3 · THE CONSEQUENCE — a NEW dangling link, and this one was LOAD-BEARING

Excluding `cards/lighthouse-dive-buddy-reframe.md` orphaned a reference to it, and the shape was not
the shape the 03:13 cut produced:

    - `no-floor-no-ceiling —caught-by→` [[lighthouse-dive-buddy-reframe]] — the residual costume …

Every dangling link from the earlier cut sat in a trailing `See …` run, where removing the reference
and its separator closes the sentence cleanly. **This is a typed edge: the link is the OBJECT of the
row.** Strip it and the row reads `` `—caught-by→` — the residual costume `` — an edge asserting a
relationship and withholding the other end, which is worse than an absent row.

**Rule: a list item that loses its only wiki-link loses the whole item.** Blast radius counted before
the rule was written rather than after — **exactly one list item across both card directories** — so
it removes that row and touches nothing else. Prose is unaffected: a sentence keeps its words and
loses only the reference, which the test pins in both directions.

Result: **0 dangling wiki-links, 30 live links kept**, and `no-floor-no-ceiling`'s edge list is four
valid edges instead of three plus a stub.

## O4 · A TEST I WITHDREW, BECAUSE IT BECAME FALSE FOR A REAL REASON

An assertion added an hour ago required *some surviving link to point into `memory/`* — a proxy for
the resolution set covering both directories. After this change `memory/` ships only its two unique
cards and nothing links to either, so **the proxy reports a narrowed set over a set that is
correct.**

Withdrawn rather than weakened, with the reason written where it stood. A proxy that fails when the
data moves under it was never testing the thing it was written for — and the direct assertion that
replaced it (`report.linkTargets`, pinned to include a `memory/`-only name) covers the same mutant
without depending on which links happen to exist today. **That is the third time this lap a test of
mine has been the thing at fault rather than the code**, and all three were the same shape: a guard
keyed to the current data instead of to the mechanism.

## O5 · WHAT A READER LOSES, STATED

`memory/MEMORY.md` now lists two entries. That is **correct for the directory it indexes** — it is
the memory store's index and the memory store has two cards. But the four instruments that moved to
`cards/` are now indexed by nothing: **`cards/` has no index file**, and `SEED.md`/`BOOT.md` name the
directory without listing its contents. Before this change a reader had one index covering six of
them; now they have one covering two, and eleven cards found by `ls`.

**Not fixed here** — an index for `cards/` is a new shipped document and a content decision, not a
manifest line. Routed.

## O6 · MUTATION AND RE-VERIFICATION

    caught  one master · the retired cards/ card is un-excluded and ships again
    caught  one master · a duplicate is un-excluded, so a name ships from two directories
    caught  edges · a list item that loses its only link keeps the orphaned row
    caught  edges · the rule widens and eats list items whose link RESOLVES
                                                        4 applied · 4 caught · 0 survivors

    gen-consumer.test.js            59 / 59
    gen-consumer.fixture-scope       7 / 7
    js-suite-self                   38 / 38
    generated tree: universe-print  15 / 0
    generated tree: dream-gate      50 / 1     (the dev/dream/ gap, unchanged, still routed)
    generated tree: dream-watch     40 / 0
    portable-paths                  green — 209 in scope, 0 new, nothing baselined
    identity sweep over the tree     0 files
    --verify-cutoff                 passes
    a default write on this dirty tree   REFUSED, naming 23 uncommitted changes

**All three earlier items still hold under this change** — the restored date where `$1` was, the
dirty-tree refusal with both artifacts marked UNEARNED under `--allow-dirty`, and the memory cut with
its filtered index.

## O7 · ROUTED FROM THIS PIECE

1. **`cards/` has no index**, and it now holds eleven instruments including four that just moved
   there. §O5.
2. **The append that reconciles the two divergent pairs** is owed before the first push, and §O2
   names the one test whose answer depends on which shape it takes.
3. Carried forward, unchanged: the `dev/dream/` gap, `.py` outside the ratchet's `EXTS`, the two
   overseer workers' dead `~/Desktop/lighthouse/` path, `606` as a class nobody has ruled on, and
   the thirteen `memory/`+`cards/` files still unread for the PROSE class.
