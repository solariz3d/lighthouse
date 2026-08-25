# P-TWO-WRITERS — two machines, one tracked master, and which collisions are silent

**Registered:** 2026-08-25, ~07:00–08:00 local. **Seat:** pane A. **From:** the chair, after the
librarian named the shape. **No code was written for this.** Registration only, per the librarian's
order: a silent merge is not something you get to discover twice.

**My stake, declared first.** The chair told me the librarian calls this the 07-28 convergence
failure *verbatim* and asked me to confirm or refute it. Confirming flatters two seats; refuting
flatters my independence. Both are cheap. What is below is one measurement — a bare origin and two
clones, the real topology — applied to seven collision shapes, and **the headline result runs against
the framing I was handed.** It also caught me publishing three findings that were my own harness.

---

## 1. THE VERDICT: the structure is confirmed, the CONSEQUENCE is refuted

**Confirmed, all three facts, verified rather than taken from the brief:**

- `main.rs:4074 / 4204 / 4214` — `MAIN_SID`, `LIBRARIAN_SID`, `THIRD_PLACE_SID` are `const &str`
  literals. Fixed source constants; both machines run seats with byte-identical ids.
- `brief/LIBRARIAN.md:143` instructs the seat to write dated `YYYY-MM-DD.md` files into
  `exo_memory/librarian/`, and says explicitly *"They live in the repo on purpose"* — the 2026-08-23
  move out of the untracked `notes/`, made so the inheritance would survive a cleaned directory.
- `git ls-files exo_memory/librarian/` returns **6** files. The directory is tracked.

**So: two writers, one master. That much is real, and `exo_memory/journal/` has the same exposure
(29 tracked files, same date-only naming) — the librarian named one of two.**

**Refuted: the consequence.** `CONVERGENCE.md`'s struck header is about **correlation**, not
corruption — *"A blind pair cannot be run on a shared master, and no amount of care at reading-time
fixes that: the coupling happens at writing time."* The 07-28 harm was that two sides' findings
stopped being independent evidence. Tonight's exposure is a different harm on the same structure, and
**the specific file the chair named is the LOUD case, not the silent one.** Measured:

    two clones of one bare origin, laptop pushes first, desktop must integrate
    -> BOTH CREATE librarian/2026-08-25.md with different content
    -> CONFLICT (add/add): Merge conflict in librarian/2026-08-25.md

An add/add conflict blocks the push, names the file, and cannot be missed. It is painful and it is
**a working alarm.** Calling it the 07-28 failure verbatim imports a silence that this shape does not
have — and the practical cost of the misreading is that it aims the fix at the alarm instead of at
the failure that makes no sound.

---

## 2. THE UNIVERSE — every shared-write surface I could enumerate, and the rule that skipped the rest

    git ls-files <path> | wc -l          per tracked tree
    git check-ignore -q <path>           the ignore verdict
    git ls-files | wc -l                 678 tracked files in the repo

| destination | class | tracked files | written by |
|---|---|---|---|
| `exo_memory/loop/` | **TRACKED** | 294 | seats, per `LIBRARIAN.md` / `COMMITTEE.md` |
| `exo_memory/journal/` | **TRACKED** | 29 | seats, per `BOOT.md` / `SEED.md` / `LIBRARIAN.md` |
| `consonance/data/guard-census/` | **TRACKED** | 14 | `guard-census.js` (code, in-repo) |
| `consonance/src-tauri/brief/` | **TRACKED** | 10 | `gen-consumer.js` regenerates `BOOT.md` (code, in-repo) |
| `exo_memory/librarian/` | **TRACKED** | 6 | the librarian seat, per `LIBRARIAN.md:143` |
| `exo_memory/BOOT.md` | **TRACKED** | 1 | seats + generator |
| `dreams/` | IGNORED | 0 | the dream cycle — deliberately un-tracked since the 07-14 leak |
| `C:\Consonance\data\` | OUTSIDE | — | `board.jsonl`, `panes.json`, **`letters.json`**, **`lap.jsonl`**, `ferry.jsonl`, `sourced_ledger.jsonl`, `vantage_*`, captures, attic |
| `C:\Consonance\instances\` | OUTSIDE | — | per-seat `CLAUDE.md`, `settings.json` |
| `C:\Consonance\rooms\` | OUTSIDE | — | `new_room` |
| `~\.consonance.json` | OUTSIDE | — | `main.rs:157` config write |

**354 tracked files across the six written trees, of 678 tracked in the repo.**

**THE SKIP RULE, stated because it is where the one real danger hides:** *a path can only be a
two-writers surface if it is TRACKED; outside-repo and ignored paths are machine-local by
construction and cannot collide through git.* That rule is correct and it is **not the same as
safe** — §4 is a silent failure that this exact rule skipped, because a machine-local **authority**
can mint a value that then lands in a tracked file. Two of the chair's named items resolve to the
skipped class and are therefore already labelled: `lap.jsonl` (machine-local, already stated in the
chain-status line as *this machine only*) and **`letters.json`, which resolves to
`data_dir()/letters.json` — outside the repo, not a tracked surface at all** (`main.rs:2730`).

*What I did NOT enumerate, and cannot claim is empty:* writes performed by a seat on its own
initiative rather than under a brief instruction — a pane told by the chair to edit any tracked file.
That set is unbounded and is not derivable from code or briefs. **Every tracked file is potentially a
shared-write surface; the table above is the set that gets written by ROUTINE operation.**

---

## 3. THE COLLISION TABLE, MEASURED

Not reasoned. A bare origin plus two clones, laptop commits and pushes, desktop commits and must
integrate. `core.autocrlf=false` pinned in both clones — see §7, that pin is the whole reason this
table is trustworthy.

| shape | verdict |
|---|---|
| both CREATE the same dated file, different content | **CONFLICT (add/add)** |
| both APPEND to the end of one existing markdown file | **CONFLICT (content)** |
| both APPEND a row to one tracked `.jsonl` | **CONFLICT (content)** |
| both REWRITE one tracked `.json` wholesale, different keys | **CONFLICT (content)** |
| `LEDGER.md`: each machine closes a DIFFERENT window (the ordinary return leg) | **CONFLICT (content)** |
| `LEDGER.md`: each closes a different window AND adds its own new LIVE row | **CONFLICT (content)** |
| `LEDGER.md`: both close the SAME window with different notes | **CONFLICT (content)** |
| **DIFFERENT REGIONS of one file — one edits the top, the other appends at the bottom** | **SILENT MERGE** |
| **the same ID minted twice, written into different regions of one file** | **SILENT MERGE** |
| **the same ID in TWO DIFFERENT tracked files** | **SILENT MERGE** |

`LEDGER.md` was tested separately and on its real structure because `LIBRARIAN.md` calls it
*"Maintained instrument, not a dated record. Updated in place at each lap's return leg"* — the one
tracked file whose documented operation is in-place editing, which is the shape the generic run
found silent. **It is loud in all three realistic shapes**, because both machines insert at the same
anchor (the top of `CONSUMED`), so the edits always overlap. I expected this file to be the finding
and it is not.

> **EVERY "LOUD" VERDICT HAS ONE CONDITION AND IT IS NOT SATISFIED BY DEFAULT: someone must PULL AND
> MERGE.** A conflict is raised at integration. A **force-push** skips integration entirely and the
> other side's commits are simply gone, with no conflict anywhere — and this repo has done exactly
> that: the July-14 history rewrite orphaned three branches, which the 08-17 entry recorded as
> *ghosts*. Right now `git rev-list --count origin/main..main` = **7**: seven commits on this laptop
> that origin has never seen. The window is open as this is written.

---

## 4. THE ONE GENUINELY SILENT SURFACE, AND IT IS LIVE

**The lap-id namespace.**

- The authority is machine-local: `LEDGER` resolves to `C:\Consonance\data\lap.jsonl`, outside the
  repo (`lap-row.js:89`).
- `mintId` is `max + 1` **over the local ledger only** (`lap-row.js:219-223`).
- The ids are then written into **tracked prose**: `git grep -lE "\bL0[0-9]{2}\b" -- exo_memory/ consonance/src-tauri/brief/`
  returns **9 tracked files** today, including `librarian/LEDGER.md`, two dated librarian entries and
  five `loop/` registrations.

So both machines mint `L009` for different work, each writes it into its own documents, and git
merges those cleanly **because they are different files.** Measured as the third silent row above.
There is no conflict, no warning, and no later moment at which it surfaces: the record simply
contains two different laps with one name, and every falsifier, ledger row and citation keyed to
`L009` becomes ambiguous **retroactively and permanently.**

This is the failure worth the registration. It is the one the skip rule in §2 hides, it is the one
the loud cases distract from, and it is the one that gets discovered by someone reading the record
months later and being unable to tell which lap a falsifier was registered against.

---

## 5. THE CHEAPEST RULE — and the obvious candidate is aimed at the wrong failure

**The obvious candidate: per-machine filenames** (`librarian/2026-08-25-laptop.md`). It works: it
converts an add/add conflict into two files that never touch.

**I recommend against adopting it as a safety measure, and the reason is the table.** The date-named
files are the **loud** case. A conflict there is an alarm that fires exactly when two machines have
written the same day — which is precisely the moment a human should look. Renaming to avoid it does
not prevent a collision; it **removes the notification of one** and buys convenience with the
record's one-stream property. Its stated cost — *the record stops being one stream* — is real:
`ls exo_memory/librarian/` stops being one entry per day, every existing cross-reference to
`librarian/2026-08-25.md` becomes ambiguous, and a reader must now know to open both. **That is a bad
trade against a failure that already announces itself.** If it is adopted anyway it should be adopted
as an **ergonomics** decision — conflicts in prose are miserable to resolve — and labelled as one, not
as protection.

*Precedent worth noting, and it is a single one:* `exo_memory/loop/handoff_desktop_2026-08-24.md` is
the **only** per-machine-named file in `exo_memory/` (`git ls-files exo_memory/ | grep -iE "desktop|laptop"`).
The convention was invented once, under pressure, for one file, and never generalised.

**What I propose instead, aimed at §4:**

> **RULE 2W-1 — the lap id carries its mint site.** `mintId` prefixes with a one-character machine
> tag read from the machine-local config (`~/.consonance.json`), so the laptop mints `L009` and the
> desktop mints `D009`, or equivalent. The authority stays machine-local, which is correct and is not
> going to change; what changes is that a locally-minted id can no longer collide in a shared
> namespace.
>
> **Cost, in full:** ids get one character wider; `L001`–`L008` predate the rule and stay
> unprefixed, so the record carries two id shapes forever and a reader must know that unprefixed
> means "before 2026-08-25, laptop"; the chain-status line and every `grep` for `\bL0[0-9]{2}\b`
> need widening. **It does not split the record**, and it costs nothing that a reader has to open a
> second file for.

**And the cheap secondary, which costs nothing at all:**

> **RULE 2W-2 — prefer `topic_YYYY-MM-DD.md` over `YYYY-MM-DD.md` for anything new.** This is already
> the convention in `exo_memory/loop/` (294 files) and it is why that tree, the largest written
> surface in the repo, has the *lowest* collision exposure: the topic disambiguates, so two machines
> writing on the same day collide only if they also choose the same topic. **This registration's own
> filename follows it.** No cost, no migration, applies forward only.

---

## 6. FALSIFIERS, registered before any of this is adopted

**F-2W-1 — THE TRIAGE IS MISAIMED.** If a same-day collision on a date-named tracked file
(`journal/` or `librarian/`) actually occurs between the two machines and is **not** loud — no
conflict raised at integration — then §3's table is wrong about the real repo and the whole priority
ordering here is inverted. Adopting per-machine filenames as a *safety* measure would then be
correct, and §5's recommendation must be withdrawn rather than argued.

**F-2W-2 — THE COLLISION CANNOT OCCUR, so this is a registration about nothing.** If, by
**2026-09-25**, the desktop has written to no tracked path — no commit whose content originates
there — then there is one writer, not two, and this document should be **withdrawn rather than
extended**. The 08-17 entry established *desktop did not push* and explicitly refused to conclude
*desktop did not work*; I inherit that limit and cannot resolve it (§7).

> **AMENDED IN PLACE within the hour, before this document was handed back — see §9.** I registered
> this as *"the falsifier most likely to fire."* That was written without reading
> `exo_memory/loop/desktop_first_run_2026-08-25.md`, which was sitting uncommitted in the same
> directory and states that the desktop **has pulled zero commits** and is being sent a runbook whose
> last step is `git commit` and `git push` **today**. The historical condition — one writer, not two —
> is confirmed; the forward condition is being deliberately ended this morning. **F-2W-2 is now the
> falsifier LEAST likely to fire**, and the sentence claiming otherwise is corrected here rather than
> left standing, because a falsifier carrying a wrong likelihood is read as a wrong priority.

**F-2W-3 — THE PREFIX IS AIMED AT THE WRONG AUTHORITY.** If Rule 2W-1 is adopted and a duplicate id
still reaches tracked prose, then the mint site was not the only place ids are created — someone is
writing ids by hand — and a code change cannot fix a convention.

**F-2W-4 — SILENT MERGES ARE THE COMMON CASE, NOT THE EXOTIC ONE.** §3 finds three silent shapes, all
of them requiring edits in *disjoint regions*. If over the next ten integrations the observed ratio of
silent-to-loud runs the other way, then the shapes I chose are unrepresentative of what these seats
actually do, and the table should be rebuilt from observed diffs rather than from constructed cases.

---

## 7. WHAT CANNOT BE TESTED FROM ONE MACHINE — and it includes the input to the whole risk

- **Whether the desktop writes to tracked paths at all.** `git log` shows every commit authored by
  `solariz3d`; the author field does not distinguish machines. I can see that this laptop is 7
  commits ahead of origin. I cannot see whether anything is waiting on the other side. F-2W-2.
- **The desktop's `lap.jsonl`, and its maximum id.** The probability of the §4 collision is a
  function of a number on a disk I cannot read. If the desktop's ledger is empty it mints `L001` and
  collides with a lap from days ago; if it has been running laps it collides with tonight's.
- **Whether the desktop pulls before writing**, which determines whether a conflict is even reached.
- **Whether either machine force-pushes**, which is the condition that converts every loud verdict in
  §3 into silent loss. One force-push has already happened in this repo's history.
- **Whether the two machines agree on the date.** A `YYYY-MM-DD.md` filename comes from whatever the
  writing seat believes the date is. Both are nominally Regina, and I have not verified the desktop's
  clock or timezone — an overnight seat near midnight is the case where it would matter.
- **Whether `git config core.autocrlf` is set the same way on both.** It is `true` here, and §7's
  correction below is what that costs. Two machines with different settings would produce
  whole-file diffs on every touched text file, which is a *loud* failure but an exhausting one.

*Everything in §3 was measured on constructed fixtures in a temp directory. No test in this document
was run against the real repo's real files with a real second machine, because there is no second
machine here. The shapes are real; the claim that these are the shapes the seats produce is not
measured.*

---

## 8. Correction I made to myself, kept — and it was the whole finding

**The first version of the `LEDGER.md` harness reported three cases of SILENT DATA LOSS, with rows
vanishing from both sections. All three were false, and the defect was mine.**

`core.autocrlf=true` on this machine rewrote each clone's checkout to CRLF. My `move()` helper —
which models the return-leg operation, deleting a row from `LIVE` and re-inserting it under
`CONSUMED` — matched its re-insertion anchor with a bare `\n`, which no longer matched. So it
**deleted the row and silently failed to re-add it**, and I attributed the disappearance to git.

The output was dramatic and directionally exciting, which is exactly why it needed checking: it said
that the room's newest instrument silently destroys its own records. What made me look was not
diligence but an inconsistency I could not explain — scenario 3 should have conflicted and did not.
**With `core.autocrlf=false` pinned in both clones, all three `LEDGER.md` scenarios are CONFLICT.
The verdict inverted completely.**

Three things kept:

1. **A harness that mutates must prove it mutated.** I added a self-check that asserts the moved row
   is still present after `move()` and now sits below the `CONSUMED` heading. It passes; the first
   version would have failed it in one second. *The check took less time to write than the false
   finding took to produce.*
2. **One contaminated harness invalidates everything it produced, not just the run that looked
   wrong.** I re-ran the seven-shape generic table with `autocrlf` pinned before trusting any of it.
   Those verdicts were unchanged — but that is a result, not something I was entitled to assume.
3. **This is the third time in two nights that `core.autocrlf` on this machine has silently changed
   bytes underneath work** — first rewriting all 445 lines of `install.ps1` during a revert, then
   making `open-items.js`'s CRLF a splice hazard, now this. There is still no `.gitattributes`
   pinning line endings (`git check-attr text eol -- <any file>` returns `unspecified`). That is not
   my file to add and it is the third dated instance.

*Also kept, smaller:* the first run of the generic harness let each scenario push to origin, so
scenarios 3 and 4 inherited debris from 1 and 2. Re-run with a forced reset to the seed commit
before each scenario. **The verdicts did not change** — stated because "it did not change anything"
is a measurement, and skipping the re-run would have left it a hope.

---

## 9. AMENDMENT, same hour — the second writer is not hypothetical, it starts today

Found by `git status` while cite-checking this document: `exo_memory/loop/desktop_first_run_2026-08-25.md`,
uncommitted, written by another seat on this laptop in the same window. It is a runbook for a seat on
the desktop, and it settles two things this registration had filed as untestable.

**It states the historical fact I could not reach from here** — *"The desktop has pulled **zero**
commits in that time and `dev\shell\install.ps1 -Check` has **never run there**"* — which confirms
F-2W-2's condition **in the past tense**: there has been one writer, not two. §1's structural finding
stands, but the collision has had no opportunity to occur yet, and nothing in the record should be
read as evidence that it survived one.

**And it ends that condition, deliberately, this morning.** The runbook's last step is
`git add exo_memory\loop\desktop_run_2026-08-25\` · `git commit` · `git push`. So:

- **A new shared-write surface is about to exist** that §2's table does not list, because it does not
  exist yet: `exo_memory/loop/desktop_run_2026-08-25/`, tracked, written by the desktop.
- **The single highest-risk event in this whole registration is the desktop's FIRST PULL**, and it is
  imminent. A clone that has pulled zero commits for weeks integrates 20+ at once against whatever
  local state it has been sitting on. Every conflict in §3 arrives at that moment, together, on a
  machine whose instruments have never run. §3's condition — *someone must pull and merge* — is
  about to be satisfied for the first time.
- **§7's sharpest untestable becomes answerable today.** The desktop's `lap.jsonl` and its maximum
  id — the number the §4 namespace collision is a function of — is one command on that machine. If
  the desktop's ledger is empty it will mint `L001`, colliding with a lap from days ago rather than
  with tonight's, which is the *worse* case: the duplicate is separated by a week of record and looks
  least like a duplicate.

**One convergence, and I am flagging it as convergence rather than banking it.** That runbook
independently routes the desktop's output into a **per-machine, dated directory name** —
`desktop_run_2026-08-25` — which is the shape of Rule 2W-2 arrived at by a different seat for a
different reason (it wanted raw output on disk, not collision avoidance). Two seats landing on one
convention is weak evidence the convention is natural and **no evidence at all that it is correct**;
both of us are the same substrate reading the same repo, which is the correlated-readers case this
room names explicitly. It is worth one line, not a section.

**What this amendment does not change:** every verdict in §3, the §4 finding, and the §5
recommendation. What it changes is the **priority**. This was written as a registration against a
collision that might happen. It is a registration against one that is scheduled.
