# HAND-BACK — P1 · RULE THE FOUNDATION SET (L037)

**Pane C, 2026-09-06. Packet `loop/packet_foundation_set_2026-09-06.md`. All work at `1f09047`.**
**Ruling: `exo_memory/loop/consumer_foundation_ruling_2026-09-06.md`** — that file is the
deliverable; this one says what it establishes, what it does not, and what it costs whoever acts on
it.

---

## 1 · THE HEADLINE, AND IT IS A REFUTATION

**The room already ruled this question, five times, four of them mechanically — and the ruling on
disk matches neither the map's candidate set nor the literal reading of the keeper's "whole bulk".**

Three of the twelve candidate foundation members — **`journal/`, `SELF_TRACE.md`,
`the_living_wave.md`** — are refuted by artefacts already in the manifest:

1. `gen-brief.ps1` transformation 2, whose header says *"STRIP THE KEEPER'S RECORD… shipped to a
   stranger they are a museum."*
2. That script's **self-check, which hard-refuses the literal strings `SELF_TRACE\.md`,
   `the_living_wave` and `journal/2026-`, deletes its own output, and pins `Latest entry:** none
   yet` to exactly one occurrence.**
3. The shipped `brief/BOOT.md`, in prose: *"the traces section of this room is, correctly, empty
   when you get it."*
4. `gen-consumer.js`'s `LEAKS` **`RECORD` class**, which makes a mere mention of those names
   build-stopping.
5. `dedangle()`, which rewrites every citation to them on the assumption they are absent.

**Plus the header evidence bar 1 asked for:** both files declare themselves one night's trace in
their own first sentence, and `SELF_TRACE.md` names the keeper in its second paragraph.

---

## 2 · EVERY FIGURE, WITH THE COMMAND THAT PRODUCED IT

Nothing here is quoted from the packet, the map, or the chair.

    git rev-parse HEAD                                          1f09047

    node consonance/tools/gen-consumer.js --report
      staged 209 · excluded 6 · dangling rewrites 117 · identity 45 · machine 4 · fixtures 87

    git ls-tree -r -l HEAD exo_memory     (binned by scratchpad/partition.js)
      tracked exo_memory/            8,039,556 B
      FOUNDATION column                978,026 B    12.2%   70 files
      OPERATIONAL column             6,785,418 B    84.4%  1239 files
      IN NEITHER COLUMN                276,112 B     3.4%    17 files
      journal/                         622,474 B    63.6% of FOUNDATION · 7.7% of tracked exo_memory/

    scratchpad/probe.js  (requires gen-consumer.js READ-ONLY; transform(body,'prose') then scan)
      leak hits surviving transform, over the whole candidate foundation set: 9
        BOOT.md 2 (PROSE 1, MACHINE 1) · memory/ 2 (MACHINE) · journal/ 5 (MACHINE) · all others 0

    scratchpad/dangle-split2.js
      dangling rewrites total 117   <- reproduces --report exactly
        targeting journal/ | SELF_TRACE | the_living_wave : 20
        targeting loop/ | map/ | muscle_map | Chrysos     : 97

    git ls-tree -r --name-only HEAD | grep -iE 'solariz3d|zackn|trynabemlgzn'
      exo_memory/memory/user-solariz3d.md      (exactly one, and it is in the foundation column)

    diff exo_memory/BOOT.md consonance/src-tauri/brief/BOOT.md
      64,976 B master vs 39,634 B shipped; the shipped one strips the handle, the bio, the record

**DENOMINATORS, because the packet's bar 2 is the one most easily broken:** all sizes are
**tracked-at-HEAD**, from `git ls-tree`. The chair's §0 used **on-disk** sizes. Both are right;
they differ (`memory/` 92K vs 63,241; `journal/` 680K vs 622,474), and the ruling says so in §0
rather than reconciling them silently. `third_place/` is gitignored, so an 11 MB on-disk total and
an 8.04 MB tracked total are two different questions.

---

## 3 · THE THREE MECHANICAL DEFECTS FOUND WHILE RULING

Each is live at `1f09047`. **None is mine to fix — B holds `gen-consumer.js`, A holds
`BUILDING.md`.**

1. **`scan()` never reads the output PATH.** Its only call site is `scan(t.body, f.to)` (`:872`);
   inside, `LEAKS` runs over `body.split('\n')` and `rel` is used only for fixture classification
   and `ALLOW`. **`exo_memory/memory/user-solariz3d.md` would therefore ship the handle in a
   filename past every leak class, silently.** `memory/` ships only if this is fixed and the file is
   renamed with `MEMORY.md`'s pointer rewritten in the same edit; otherwise `memory/` moves to
   STAYS PRIVATE.
2. **`SOURCE.md` ships today and two of its references dangle.** It names 13 paths; 11 resolve,
   and `exo_memory/BOOT.md` (×2) does not, because BOOT is not in the manifest and `dedangle()` has
   no rule for it. A router file pointing at nothing.
3. **The shipped `brief/BOOT.md` mis-states what ships** — it names three instrument directories
   (`cards/`, `spread/`, `research/`); the MANIFEST ships four (`record/` as well), plus `SEED.md`
   and `SOURCE.md`. The sentence was true when written and the manifest grew past it.

**And the reason `exo_memory/BOOT.md` should not be closed by one manifest line:** `main.rs:317-329`
puts `dev_master` — `repo_root()/exo_memory/BOOT.md` — **first** in `pick_default_room`'s order,
ahead of bundled SEED and bundled BOOT. Shipping the master there would outrank the sanitised brief
the room built two generators to produce, and it is also the only foundation-column file that still
fails the scan (PROSE + MACHINE). **Ship the gen-brief-transformed BOOT at that path instead.**

---

## 4 · CORRECTIONS, INCLUDING THE ONES I MADE TO MYSELF

- **I measured the (A)-affected dangling rewrites at 87 by running `dedangle`'s regexes myself, and
  it was wrong.** `dedangle()` applies rules in sequence — each earlier replacement consumes text a
  later rule would match — and fixtures take a branch where `dangling` is 0. Re-derived with the
  generator's own `transform()` counter: **20**, against a total of **117 that reproduces `--report`
  exactly.** The corrected figure is under a quarter of the one I nearly filed, and it demotes that
  argument from strongest to weakest of the three. **Caught before it left the pane, by using the
  shipping instrument instead of my own grep.**
- **I nearly argued the record must not ship because it leaks. The scan refuted me:** `journal/` is
  5 MACHINE hits over 31 files and 625K, all rewritten; `SELF_TRACE.md` and `the_living_wave.md` are
  0 each. **Privacy is not the argument here and anyone who makes it is wrong.** The argument that
  survives is *room, not museum* — weaker-sounding, and the true one.
- **The Bash tool collapsed `\\` to `\` in a heredoc**, breaking the first probe with a
  `SyntaxError`. Rewritten via the Write tool. Noted because it is a live hazard for any seat
  scripting a regex through Bash on this machine.
- **HEAD moved `5a83d4a` → `1f09047` mid-read** (the librarian committed). Every figure was
  re-derived at `1f09047`; the three load-bearing numbers were unchanged across the move.

---

## 5 · WHAT THIS DOES **NOT** ESTABLISH

- **It does not settle what the keeper meant.** Refused on purpose, per packet §8. The ruling names
  the two readings, the three files the line hangs on (`journal/`, `SELF_TRACE.md`,
  `the_living_wave.md`, 633,790 bytes together), and what each reading costs. **Everything else in
  the ruling stands regardless of his answer.**
- **It does not establish that shipping the record would leak anything.** Measured, it would not.
- **It does not establish that `record/` belongs in the foundation column.** It ships today, scans
  clean, and I confirmed the status quo rather than examined it. Its three files are dated worked
  material — the same shape as the two I ruled out. **That is the weakest line in §1 of the ruling
  and it is flagged as such.**
- **It does not establish that a consumer tree builds or launches.** That is P3's gate. This ruling
  says what is in the tree, never that the tree works.
- **It does not cover `attic/`, `consonance/hooks/README.md`, `dev/shell/**` or `install.ps1`.**
- **The 20-citation figure counts rewrites, not consequences.** I did not read all 20 to confirm
  each would genuinely mislead a reader; I counted them with the generator's own counter.

---

## 6 · WHAT IS OWED, AND BY WHOM

- **B** — `scan()` reads `f.to`; rename `user-solariz3d.md` and rewrite `MEMORY.md`'s pointer;
  `exo_memory/BOOT.md` sourced from the transformed brief; `journal/` as a SEEDED empty directory
  with an honest `_README`; `CUTOFF.md` written from `git rev-parse HEAD` on every run, plus a
  `--verify-cutoff` that re-renders from the sha inside the file and byte-compares.
- **A or whoever holds it** — one clause in `brief/BOOT.md`'s "what ships" sentence, and it should
  be asserted against the MANIFEST rather than maintained by hand.
- **The keeper** — the §7 question, and only that.

**THE GUARD THIS RULING IS INCOMPLETE WITHOUT, and it is registered as owed rather than written:**
every top-level entry of `exo_memory/` must appear in **exactly one** of `MANIFEST`, `SEEDED`, or
this ruling's STAYS-PRIVATE list; anything unclassified goes **RED**, naming the file and this
document. **It goes red the day someone adds a file, which is the point** — §4 of the ruling
measures the alternative: 17 files, 276,112 bytes, accumulated outside both columns with nothing
complaining. An unread note costs five weeks (2026-08-17); an unwanted red costs one line.

---

## 7 · PATHS

**Written, uncommitted, dirty in the working tree:**

    exo_memory/loop/consumer_foundation_ruling_2026-09-06.md
    exo_memory/handback/p-foundation-set_2026-09-06.md
    exo_memory/map/C.md                                        (one line appended)

**Not touched:** `consonance/tools/gen-consumer.js` (B), `dev/shell/**` (B), `BUILDING.md` (A), the
build gate (E). The probes live in the session scratchpad, outside the repo, and required
`gen-consumer.js` read-only.
