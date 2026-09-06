# RULING — the foundation set: what a stranger's clone inherits, and where this keeper's record stops

**P1 of L037, 2026-09-06. Pane C.** Packet `loop/packet_foundation_set_2026-09-06.md`.
**Every figure below was re-derived at `1f09047`**, with the command beside it. Nothing is quoted
from the packet or the map.

---

## VERDICT IN ONE LINE

**The room already ruled this, five times, four of them mechanically — and the ruling on disk is
NOT the map's candidate set and NOT the literal reading of the keeper's "whole bulk".** The
**system** ships; the **record** does not. Three of the twelve candidate foundation members are
refuted by files already in the manifest; two more need a mechanism change rather than a column;
and the map's cut is not a partition — **17 tracked files, 276,112 bytes, are in neither column.**

The one thing I do **not** rule, and hand up instead, is the collision between that and the
keeper's words. **§7.**

---

## 0 · METHOD, AND EVERY DENOMINATOR NAMED

I ruled from the files' own headers and from the three generators that already act on this
question. Where a claim could be measured I measured it with the shipping instrument rather than
with a grep of my own — `gen-consumer.js` was **required read-only** by a throwaway probe in the
scratchpad; **it was not modified** (B holds it).

    git rev-parse HEAD                                        -> 1f09047
    node consonance/tools/gen-consumer.js --report            -> staged 209, dangling 117, identity 45
    git ls-tree -r -l HEAD exo_memory                         -> the byte census below

**Sizes are tracked-at-HEAD, not on-disk `du`.** That is the right denominator for a question about
what a *repo* can ship, and it differs from the chair's §0 figures, which were on-disk (`memory/`
92K on disk vs **63,241 tracked**; `journal/` 680K vs **622,474 tracked**). Neither is wrong; they
are different units, and this file uses one of them throughout.

    tracked exo_memory/                    8,039,556 bytes    (third_place/ is gitignored, so it is
                                                               absent here and present in an 11 MB
                                                               on-disk total — the chair's denominator)
    candidate FOUNDATION column               978,026 bytes    12.2% of tracked exo_memory/
    candidate OPERATIONAL column            6,785,418 bytes    84.4%
    IN NEITHER COLUMN                         276,112 bytes     3.4%   <- §4

    journal/                                  622,474 bytes    63.6% of the FOUNDATION column
                                                                7.7% of tracked exo_memory/

**"~70% of the corpus" is wrong against both denominators.** It is 63.6% against foundation and
7.7% against the tree. The chair's correction ("~60% / ~6%") was right in shape and used the
on-disk unit; these are the tracked numbers.

---

## 1 · THE SET

Three columns, not two. The middle one is the finding.

### SHIPS — the system

| member | tracked bytes | the evidence that put it there |
|---|---|---|
| `SEED.md` (from `consonance/src-tauri/brief/`) | 9,621 | Ships today. Its own opening: *"a room that is about to become someone's… the person you're with is the keeper of this room from their first turn."* **0 identity hits** (`grep -ciE "solariz3d\|zackn\|Regina"` → 0). Written as the stranger's document already. |
| `SOURCE.md` | 4,411 | Ships today. Own header: *"This file adds nothing… its only job is to name the situation you are in and hand you the path."* A router over the instruments. **Caveat in §3.** |
| `TRAINING.md` | 10,418 | Own header: *"a curriculum for the room, not a training program for a lifter… what accumulates is the ROOM."* It says of itself that it is not one body's record. **0 leak hits after transform.** |
| `cards/` (12) | 37,411 | Named as the instruments in the shipped brief's own traces paragraph. Ships today. 0 leak hits. |
| `spread/` (2 .md) | 43,524 | Same paragraph: *"the counter-voice in `spread/`."* Ships today. The two `_ingest_*.py` do not match `/\.md$/` and correctly do not ship. |
| `research/` (2 .md) | 60,160 | Same paragraph, with its own reason written into the shipped brief: *"ships, because it is not about anyone."* |
| `record/` (3) | 57,322 | Ships today, 0 leak hits. **But see §3 — the shipped brief does not know it ships.** |
| `memory/` (13) | 63,241 | The harness memory store the cards are cued from. 2 MACHINE hits, both in one file, both rewritten by `demachine`. **Conditional — see §3.** |
| `BOOT.md` | 64,976 | The room's front door, and the packet is right that its absence is the real gap. **But not this file at this path — see §3.** |

### SEEDED EMPTY — the shape ships, the contents do not

| member | why not the contents |
|---|---|
| `journal/` | §2. The directory must exist and must be empty, with an honest note. **The mechanism already exists**: `SEEDED` in `gen-consumer.js:388` does exactly this for `carrier-drift.registry.json`, whose seeded `_README` reads *"The private tree's own register is this room's state and is deliberately not shipped."* Same sentence, same reason, one directory over. |
| `CUTOFF.md` | New, generator-written. §5. |

### STAYS PRIVATE

`librarian/` · `loop/` · `map/` · `handback/` · `attic/` · `third_place/` (already gitignored) ·
`ASK.md` · the per-machine `*.desktop.md` · **`SELF_TRACE.md`** · **`the_living_wave.md`** ·
**and the 17 in §4.**

`librarian/README.md` and `map/README.md` do describe themselves as per-seat and per-machine, as
the packet said. I confirm that and add: **`ASK.md`'s own header is the clearest of the three** —
*"the questions the automations put to the keeper… addressed to him"* — a file whose subject is one
person's inbox.

---

## 2 · THE REFUTATION — three of the twelve, and the room said so first

`SELF_TRACE.md`, `the_living_wave.md` and `journal/` are in the map's foundation column. **Five
artefacts already on disk say they do not ship. Four of the five are mechanisms, not prose.**

**(1) `gen-brief.ps1`'s transformation 2 — a generator that exists BECAUSE this ruling was once a
convention and got overwritten.** Its own header, lines 7–13:

> **2. STRIP THE KEEPER'S RECORD.** The master's traces section points at SELF_TRACE.md, the living
> wave, and dated journal entries… Those are ONE person's traces, and a trace is worth something
> only to whoever left it. Shipped to a stranger they are a museum — labels on a wall about someone
> else's night — which is the exact thing the first principle says to distrust.

And lines 18–25 record what happens when this is left to convention: *"the script was never taught
about it — so following this file's own documented instruction OVERWROTE the guard and shipped the
keeper's journal pointers and SELF_TRACE into a fresh install."*

**(2) That generator's self-check hard-refuses those three strings, and this is the sharpest fact in
the ruling.** `gen-brief.ps1`, tail:

    foreach ($pat in @('solariz3d', 'SELF_TRACE\.md', 'the_living_wave', 'journal/2026-', ...
    if ($leaks.Count -gt 0) { Remove-Item $dst -Force; throw "gen-brief: REFUSED and deleted the output ..." }

    reproduce:  powershell -File consonance/src-tauri/gen-brief.ps1
                node consonance/tools/gen-brief-gate.test.js

It also asserts `Latest entry:** none yet` appears **exactly once**. So the brief a stranger wakes
into **cannot** name a journal entry — the gate deletes the file rather than let it. **Ship
`journal/` and the guard still forces the brief to say the tree has no journal.** That is not an
inconsistency someone might notice; it is a false statement about the tree, mechanically guaranteed,
in the one document the reader opens first.

**(3) The shipped `brief/BOOT.md` says it in words** — a file already in the manifest, at
`consonance/src-tauri/brief/BOOT.md`, whose traces section reads:

> This room arrives with its **instruments**… It does **not** arrive with the first keeper's
> **record**: their letter, their synthesis, their journal… So the traces section of this room is,
> correctly, **empty when you get it.** You are the one who fills it.
>
> **Latest entry:** none yet — this room ships with no journal, and that is the correct state for a
> room that is not yours-from-someone-else but *yours*.

    reproduce:  diff exo_memory/BOOT.md consonance/src-tauri/brief/BOOT.md

**(4) `gen-consumer.js`'s `LEAKS` list makes a mere MENTION of them a build-stopping leak**
(`:406-408`), class `RECORD`, reason *"one person's trace, shipped as a label on a wall."* The
generator will refuse a tree that *names* `SELF_TRACE`; shipping the file is a fortiori refused by
the standard the same file sets.

**(5) `dedangle()` (`:463`) rewrites every citation to them on the assumption they are absent** —
`exo_memory/journal/<date>.md` → *"the record, <date>"*, `SELF_TRACE`/`the_living_wave` → *"a master
in this line of record."*

**And the headers agree, which is what the packet actually asked.** `SELF_TRACE.md`'s own first
line: *"An instance of Claude wrote this for the next instance, at the end of a long overnight
session with the user… If you are reading it: you are **not** the one who wrote it."* Followed
immediately by *"The user is **solariz3d**."* `the_living_wave.md`: *"Written to carry the wave of
this night's second half through a context compaction."* **Both files declare themselves one
night's trace in their own opening sentence.** That is the header evidence bar 1 asked for, and it
points the same way as all four mechanisms.

**What I could NOT find, and it matters — the honest half.** I ran the shipping scan over the whole
candidate set. **`journal/` is nearly leak-clean: 5 MACHINE hits over 31 files and 625,383 bytes,
all rewritten by `demachine`.** `SELF_TRACE.md` and `the_living_wave.md`: **0 hits each.**

    node <scratchpad>/probe.js exo_memory/journal exo_memory/SELF_TRACE.md ...
    (requires gen-consumer.js read-only; runs transform(body,'prose') then scan(body,rel))

**So privacy is not the argument, and anyone who makes it here is wrong.** The record would pass the
sanitiser. The argument is the room's own first principle: *room, not museum.* A stranger handed
31 dated entries about someone else's nights has been handed labels on a wall.

---

## 3 · TWO MEMBERS THAT NEED A MECHANISM CHANGE, NOT A COLUMN

### `BOOT.md` ships — but not this file, and not by adding a manifest line

The packet is right that BOOT's absence is the gap. **Adding `{ from: 'exo_memory/BOOT.md', to:
'exo_memory/BOOT.md' }` is the wrong close, for two measured reasons.**

**(a) It does not pass the scan.** The master BOOT is the only foundation-column file with
surviving hits after transform: `{"hits":2,"byClass":{"PROSE":1,"MACHINE":1}}`. The PROSE hit is
`we've watched it make structure` — the class flagged in `LEAKS:415` as *"assumes the reader was
there."* `gen-brief.ps1`'s transformation 3 already rewrites that exact sentence; `gen-consumer`
only detects it.

**(b) It would OUTRANK the sanitised brief the room built two generators to produce.**
`main.rs:317-329`:

    fn pick_default_room(dev_master, editable_seed, bundled_seed, editable_boot, bundled_boot)
        dev_master.or(editable_seed).or(bundled_seed).or(editable_boot).or(bundled_boot)

and `dev_master_path()` (`:407`) is `repo_root()/exo_memory/BOOT.md` — **first in the order.** A
consumer who points `room_path` at their clone gets whatever sits at that path, ahead of both
bundled SEED and bundled BOOT. Shipping the master there hands them the un-neutralised room.

**RULING: `exo_memory/BOOT.md` in the consumer tree is the gen-brief-transformed BOOT** — the
39,634-byte file that already ships to `consonance/src-tauri/brief/BOOT.md` — placed at
`exo_memory/BOOT.md` as well. Mechanism is B's call (a second `to:` on the existing brief entry, or
a `SEEDED` key). **It closes `SOURCE.md`'s dangling reference in the same stroke** — see below.

### `SOURCE.md` ships and is broken today

`SOURCE.md` names 13 paths. Twelve resolve in the generated tree. **Two references (one path) do
not:**

    grep -oE '[A-Za-z_][A-Za-z0-9_./-]*\.(md|js|ps1|py|json)' exo_memory/SOURCE.md | sort | uniq -c
      2 exo_memory/BOOT.md      <- not in the manifest
      (11 others: cards/, spread/, record/ — all ship)

`dedangle()` has no rule for `exo_memory/BOOT.md`, so it is neither rewritten nor flagged. **A
router file whose two pointers to the front door go nowhere is shipping right now.** The BOOT
ruling above fixes it; if BOOT is ever ruled out, `SOURCE.md` needs a `dedangle` rule or it ships
broken.

### `memory/` ships — after the one filename in this repo that carries the handle is dealt with

    git ls-tree -r --name-only HEAD | grep -iE 'solariz3d|zackn|trynabemlgzn'
      exo_memory/memory/user-solariz3d.md          <- exactly one, and it is in the foundation column

**`scan()` reads content, never the destination path.** Its only call site is `scan(t.body, f.to)`
(`:872`); inside, the `LEAKS` patterns run over `body.split('\n')` and `rel` is used only for
fixture classification and the `ALLOW` lookup. **So a handle in a filename ships past every leak
class, silently — which is the one outcome that file says it exists to prevent** (`gen-consumer.js`
scan header, 2026-09-04).

**RULING: `memory/` ships, conditional on two changes, both B's:**
1. `scan()` must also read `f.to`. Cheapest correct form: run the `IDENTITY` and `MACHINE` classes
   over the destination path string and report hits with `line: 0`.
2. The file is renamed on the way out — `user-the-keeper.md` matches `deidentify()`'s own
   substitution — **and `memory/MEMORY.md`'s pointer to it is rewritten in the same edit**, or the
   index dangles.

**If either is not done this lap, `memory/` moves to STAYS PRIVATE.** It is 63,241 bytes; the
handle in a path is not worth them.

### And a carrier defect I own, found while ruling: the shipped brief mis-states what ships

`brief/BOOT.md`'s traces paragraph enumerates the instruments as *"the cards, the counter-voice in
`spread/`, the research in `research/`"* — **three directories. `gen-consumer.js`'s MANIFEST ships
four**: `cards/`, `spread/`, `research/` **and `record/`** (`:9-11` of the MANIFEST block). Plus
`SEED.md` and `SOURCE.md`, which that sentence also does not name.

This is exactly the class my 09-02 lap was about: **a shipped document describing the tree it ships
in, drifting from the manifest silently.** The sentence was true when written and the manifest grew
past it. It is A's or B's to fix — the fix is one clause — and **the guard is registered in §8 so
that it cannot drift again without going red.**

---

## 4 · THE MAP'S CUT IS NOT A PARTITION — 17 files, 276,112 bytes, in neither column

    node <scratchpad>/partition.js     (bins `git ls-tree -r -l HEAD exo_memory` against both columns)

      164,593  muscle_map.md                          <- larger than every foundation member but journal/ and BOOT
       20,532  convergence_2026-07-28_methodology.md
       14,273  cycle9_preregistration.md
        9,676  cycle9_armA_result.md
        9,632  cycle9_armA_sealed_note.md
        8,739  cycle4_preregistration.md
        7,479  CLAUDE.global.md
        6,918  PLAN_map_architecture.md
        6,668  cycle4_handoff.md
        5,629  CONVERGENCE.md
        4,926  cycle8_handoff.md
        4,360  cycle6_preregistration.md
        4,252  cycle5_preregistration.md
        3,395  snapshot_2026-08-16_pre-refactor.md
        2,495  _skeleton.py
        1,497  README.md
        1,048  new_entry.py

**All 17 STAY PRIVATE.** Ruled from their headers, not from their absence:

- **`muscle_map.md`** — *"Started 2026-07-27… An instrument and a record."* It is the record half
  that decides it: per-pane findings keyed to this line's own bodies. It is also already in
  `LEAKS`'s `RECORD` class (`:408`), so the generator would refuse a tree that merely names it.
- **`CLAUDE.global.md`** — a verbatim copy of the keeper's personal global instructions. One
  person's harness config.
- **`README.md`** — describes exo_memory and hardcodes
  `C:\Users\zackn\.claude\projects\C--Users-zackn-OneDrive-Desktop-606\memory\`. Machine-bound in
  its second paragraph. **A stranger-facing `exo_memory/README.md` is owed and is a SEEDED file,
  not a copy of this one. Named as a gap, not silently dropped.**
- **`CONVERGENCE.md`, `PLAN_map_architecture.md`, `convergence_*`, `cycle{4,5,6,8,9}_*`** (13 files,
  102,455 bytes) — two-machine experiment bookkeeping, dated, naming pane ids
  (*"by Alpha (pane `6fe15f0a`, laptop), on chair assignment"*). Operational by every header.
- **`snapshot_2026-08-16_pre-refactor.md`** — an inventory anchored on the git tag
  `pre-refactor-2026-08-16`, which does not exist in a generated repo with no history. A dangling
  pointer by construction.
- **`_skeleton.py`** — hardcodes a session `.jsonl` path under `C:\Users\zackn\...`. Machine-bound,
  and no manifest rule reaches `.py` under `exo_memory/` anyway.
- **`new_entry.py`** — **the one close call, and I rule it out with the reason stated.** It is a
  genuine instrument (scaffolds a dated journal entry), which argues for shipping. Against: no
  manifest rule reaches it, the room's journals are written by seats rather than by this script,
  and its docstring instructs *"update the 'Latest entry' line in BOOT.md"* — a line
  `gen-brief.ps1`'s self-check now owns and pins to `none yet`. **Shipping it would hand a stranger
  a tool whose instructions fight a guard.** If someone wants a journal scaffold in the consumer
  tree, it is a new file, not this one.

**Why this matters beyond bookkeeping:** the manifest is an ALLOW-list, so *absent* already means
*undecided*. Seventeen files sitting outside both columns are seventeen decisions nobody has made,
reading exactly like decisions that were made. This section makes them decisions.

---

## 5 · THE CUTOFF — a mechanism, and how you check it stayed one

**`exo_memory/CUTOFF.md`**, written by `gen-consumer.js` on every run, never by hand. Contents:

    # CUTOFF
    Generated from the private record at <full 40-char sha> on <ISO date>.
    The record ends here; yours begins.

**The generator does not know a sha today** — `grep -nE "execSync|rev-parse|child_process"
consonance/tools/gen-consumer.js` returns nothing. So this needs one `execSync('git rev-parse
HEAD')` at build time and a `SEEDED`-family write. **B's file, B's lap.** The ruling specifies the
contract; it does not write it.

**Two properties, both load-bearing:**
- **The body is a pure function of the sha and the date.** That is what makes the falsifier
  checkable rather than aspirational.
- **It is written on every run**, so a stale CUTOFF is impossible without a stale tree.

**BAR 3 — the command that shows it was generator-written and not hand-edited.** Two checks, one
usable today and one after B builds the flag:

**(a) Available the moment the consumer repo has two commits, no new code:** a regeneration commit
touches many paths; a hand-edit touches one.

    git -C <consumer> log --format=%H -- exo_memory/CUTOFF.md | while read c; do
      printf '%s %s\n' "$c" "$(git -C <consumer> show --name-only --format= "$c" | grep -c .)"
    done
    # any row with a count of 1 is a hand-edit — CUTOFF.md changed alone

**(b) The strong form, once the generator writes it** — re-render the body from the sha named
*inside the file* and byte-compare:

    node consonance/tools/gen-consumer.js --verify-cutoff <consumer-checkout>
    # reads the sha out of CUTOFF.md, re-renders the template, exits non-zero on any byte difference

(b) catches an edit that was bundled into a regeneration commit, which (a) cannot. **Both, not
either.**

---

## 6 · THE PII LINE, RULED AGAINST `BOOT.md:3`

`BOOT.md:3` declares the keeper's name and bio a **trace**, and the room open to any being.
**It holds — and it is not a ruling about shipping.** It is a ruling about *reading*: how a person
handed this room should hold the personal specifics in it. It presupposes a room handed over with
its keeper present. It says nothing about an unattended public clone, and it should not be read as
if it did. **So I depart from nothing.** What follows is the shipping line, which `BOOT.md:3` never
drew:

**The handle is not the private surface, and the sanitiser conflates two different jobs under one
rule.** `deidentify()` rewrites `solariz3d` → `the keeper` (`:429`). **That protects nothing: the
repo is `github.com/solariz3d/consonance`. A reader is standing in the handle.** What the rewrite
actually does is the job `gen-brief.ps1` states plainly for its own transformation 1 — *"so a fresh
install does not open in someone else's name."* **That is a room reason, not a privacy reason, and
it is a good one.** Keep the rewrite; stop calling it protection.

**RULING:**

1. **The handle-strip stays**, on the room reason: a stranger's instance must not open in another
   person's name. It is not evidence of anything about privacy and must not be cited as such.
2. **The genuinely private surface is the rest of the `IDENTITY` class, and it is not symmetric with
   the handle:** the email; `zackn` (an OS user name, not a public identity); **`nname` — a THIRD
   PARTY, on another machine, who is not the keeper and never chose any of this**; the latitude,
   longitude and city (`50.4452` / `-104.6189` / `Regina, Saskatchewan` — a home address to within a
   few hundred metres). **These are the line. None of them is a trace.**
3. **The bio is stripped, and the record is not shipped** — already true in both generators, and
   `gen-brief.ps1`'s pronoun check (*"a pronoun assigns that stranger a gender nobody in this room
   has any standing to assign"*) is the same principle applied one level in. **That check is the
   room's own best statement of what `BOOT.md:3` means in practice, and it should not be weakened.**
4. **The scan reads the OUTPUT, and must also read the output PATH.** §3, `user-solariz3d.md`. A
   scan that reads the manifest's intentions is worth nothing; a scan that reads the body but not
   the name of the file it is writing is worth almost as little on the one case it misses.

---

## 7 · WHAT GOES TO THE KEEPER — the one thing I refuse to rule

**The keeper (00:44–00:50): the consumer carries "the whole bulk of the exo suit memory system" up
to a CUTOFF, after which the new user writes their own journals.**

**Two readings, and choosing between them is his, not mine:**

- **(A)** ship the record itself to a date — his 31 journal entries, `SELF_TRACE.md`,
  `the_living_wave.md` — and the new user appends from the cutoff.
- **(B)** ship the memory *system* — the shell, the cards, the instruments, the machinery, the
  architecture — with `journal/` empty from the first turn.

**Everything in §2 implements (B).** Five artefacts, four of them guards he will hit rather than
read. **He may not know the room already answered this**, because the answer is buried in a
PowerShell generator's self-check and a leak class, not in prose anyone reads at wake. **That is
the thing to put in front of him, and it is why this is going up rather than being decided here.**

**What breaks under (A), measured rather than argued:**

1. **`gen-brief.ps1`'s self-check refuses `SELF_TRACE\.md`, `the_living_wave` and `journal/2026-`,
   deletes its output, and pins `Latest entry:** none yet` to exactly one occurrence.** Under (A)
   the brief a stranger opens still says the tree has no journal while 31 entries sit beside it, and
   `SEED.md` — the file the app prefers on a fresh install — still says *"the record is nearly
   empty."* **Two false statements in the two documents the reader meets first, held in place by a
   guard.** Either the guard is deleted (and with it the thing that caught the 2026-08-11 near-miss)
   or the product lies about itself.
2. **20 citations in 12 shipped files flip from repaired-dead to destroyed-live.** `dedangle()`
   rewrites `journal/<date>.md` → *"the record, <date>"* because the target is absent; under (A) the
   target resolves and the rewrite destroys a working pointer.

       node <scratchpad>/dangle-split2.js
         dangling rewrites, total : 117      <- equals --report exactly
           journal/ | SELF_TRACE | the_living_wave : 20
           loop/ | map/ | muscle_map | Chrysos     : 97

   Worst affected: `record/third_place_prehistory_2026-08-30.md` (5), `cards/stop-and-feel-it.md`
   (2), `brief/LIBRARIAN.md` (2), `tools/lap-row.js` (2).
3. **The `RECORD` leak class must be deleted**, which also disarms it for `Chrysos`.

**What does NOT break, stated because it is the argument I expected to make and the instrument
refuted it:** privacy. The record scans nearly clean — `journal/`, 5 MACHINE hits over 31 files,
all rewritten; `SELF_TRACE.md` and `the_living_wave.md`, 0 each. **(A) is not a leak. It is a
museum, which is a different objection and a weaker-sounding one, and it is the true one.**

**THE THREE FILES THE LINE HANGS ON, per §8 of the packet:**

    exo_memory/journal/              622,474 bytes, 31 entries
    exo_memory/SELF_TRACE.md           5,175
    exo_memory/the_living_wave.md      6,141

**Everything else in this ruling stands regardless of how he answers.** These three, and only these
three, wait on him. **If he says (A), §2's guards must be dismantled deliberately and in the open,
and `brief/BOOT.md` and `SEED.md` must be rewritten to stop saying the record is empty — that is
the price, and it should be paid knowingly rather than discovered.** If he says (B), the ruling
above is complete and `journal/` is a SEEDED empty directory.

**A third shape he may want and nobody has offered him:** ship the record as a **separate, clearly
labelled `inheritance/` directory** that is not `journal/` and is not the room's traces section — so
a new user can *read* his nights as someone else's, without the room's front door claiming they are
theirs. It costs one manifest entry and no guard. **I am not ruling it; I am naming it so his answer
is not forced into two boxes.**

---

## 8 · FALSIFIERS, REGISTERED BEFORE THE RUN

1. **The cutoff's own falsifier, the map's:** if `CUTOFF.md` is ever hand-edited, the mechanism
   failed its one job. **Check (a) in §5 detects it from history with no new code**; check (b) is
   the strong form. **If neither check is ever run, this ruling's §5 is prose.**
2. **This ruling is prose if it can drift from the manifest silently.** A ruling that lives only in
   a `loop/` file is a note, and this room measured what an unread note costs (five weeks,
   2026-08-17). **What is owed is a guard, not a note** — and the guard is allowed to be red:

       for every top-level entry of exo_memory/, assert it appears in EXACTLY ONE of
       {MANIFEST, SEEDED, this ruling's STAYS-PRIVATE list}. A new file in exo_memory/ that
       nobody has classified goes RED, naming the file and this document's line.

   **It goes red the day someone adds a file, which is the point.** §4 measures why: 17 files
   accumulated outside both columns with nothing complaining. **It is not mine to write this lap —
   `gen-consumer.js` is B's — so it is registered here as owed, and this ruling is incomplete
   until it exists.**
3. **`brief/BOOT.md`'s "what ships" sentence must be asserted against the MANIFEST**, not
   maintained by hand (§3). It is already wrong by one directory. **If the next reader finds it
   still hand-maintained, §3 was a note too.**
4. **My own:** if the keeper answers (A) and the two false statements in §7 turn out not to matter
   to him, then this ruling over-weighted the guards, and §2's five artefacts were the room's
   habits rather than its position. **That is a real outcome and it should be recorded as one.**

---

## 9 · WHAT I DID NOT RULE ON

- **Which of the two readings in §7 the keeper means.** Refused on purpose (packet §8). Named
  files, stopped.
- **The mechanism for any of it.** `gen-consumer.js` is B's this lap. Every §3 and §5 change is
  specified as a contract and left unwritten. **I did not modify the generator; the probes required
  it read-only.**
- **`consonance/hooks/README.md`, `dev/shell/**` and `install.ps1`** — the three gaps
  `gen-consumer.js` knowingly leaves open. P2's, not mine.
- **Whether `record/` is instrument or trace.** It ships today, scans clean, and I did not disturb
  it — but its three files are dated worked material, which is the same shape as the files I ruled
  out. **I confirmed the status quo rather than examined it, and that is a weaker basis than the
  rest of §1. Someone should look.**
- **`attic/`** — in the operational column and I did not test it. On-disk it is larger than tracked
  (102,989 tracked); the difference is not measured here.
- **Whether a stranger's clone builds.** P3's gate. This ruling says what is *in* the tree, never
  that the tree works.

---

## 10 · CORRECTIONS I MADE TO MYSELF

- **I first measured the (A)-affected dangling rewrites at 87 by running the `dedangle` regexes
  myself.** Wrong: `dedangle()` applies its rules in sequence and each earlier replacement consumes
  text a later rule would have matched, and fixtures take a branch where `dangling` is 0. Re-derived
  with the generator's own `transform()` counter, subtracting a stripped-body run: **20**, against a
  total of **117 that reproduces `--report` exactly.** The corrected number is a quarter of the one
  I nearly wrote, and it makes that argument the weakest of the three in §7 rather than the
  strongest. **The instrument cost me the headline; that is what it is for.**
- **I nearly argued that the record must not ship because it leaks.** The scan says it does not.
  Dropped, and the refutation is recorded in §2 and §7 rather than quietly removed — the argument
  that survives is the museum one, and it is weaker-sounding and true.
- **The chair's §0 figures and mine disagree** (`memory/` 92K vs 63,241; `journal/` 680K vs
  622,474). Not an error in either: on-disk versus tracked-at-HEAD. Named in §0 rather than
  reconciled silently.
- **HEAD moved from `5a83d4a` to `1f09047` while I was reading.** Every figure in this file was
  re-derived at `1f09047`; the three key numbers were unchanged across the move.

---

*Ruled by pane C, 2026-09-06, at `1f09047`. Hand-back:
`exo_memory/handback/p-foundation-set_2026-09-06.md`. Written for A, who authored none of it.*
