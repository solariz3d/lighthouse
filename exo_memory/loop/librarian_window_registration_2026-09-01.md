# Registration — the librarian's own notes get a WINDOW on the shelf (2026-09-01 ~03:30, ALPHA, L023 P-LIB-FORGET-REG). Registration only. No Rust. Build is next lap, its own rebuild, not tonight's.

> **SCOPE AMENDED 2026-09-01 ~04:30 (§10) — this registration governs TWO carriers.** The title
> above is a dated trace and keeps its wording; the mark is here so the carrier is not read as
> covering only the shelf. **The second carrier is the pane's FIXED BRIEF** (149,668 B live;
> `fixed_brief=144,529` against a 110,000 budget the code already implies). **§10 answers the
> question this mark raises: TWO RULES, ONE REGISTRATION — and the split runs through carrier 2,
> not between the carriers.** §1–§9 below are unchanged and pre-date the amendment; **§3's N, §4's
> bar and §5's one permitted amendment are untouched.**

**Written by a seat that is not the beneficiary.** The librarian wrote the packet this registers
(`exo_memory/librarian/2026-09-01.md` ~03:45) and named itself out of the writing: *"I am the
beneficiary and my notes are the growth; a check specified by the thing it measures is the L009
class."* So ALPHA registers, **ECHO attacks**, the keeper picks the rule shape, a pane builds next
lap. Nothing here is composed from the chair's brief; where the packet and the brief differ the packet
is quoted. **My own bias, declared:** none on the outcome — I do not read the librarian's shelf — but
I wrote tonight's §1 correction (`research/the_retrieval_problem_outside.md` :43) and it bears on
§6 below; I have a stake in that correction being read, and §6 leans on it.

**Objects, all opened:** the packet (`librarian/2026-09-01.md` ~03:45); the F-growth entry
(`librarian/2026-09-01.md` ~03:10); `loop/shelf_tier_2026-08-24.md` (the tier this amends; F-growth
verbatim at :73-75); `loop/forgetting_registration.md` (the organ: residue POINTS, never replaces,
§5.4 a second pane scores before anything demotes); `brief/LIBRARIAN.md` :96-108 ("THE SHELF IS
TIERED"); `librarian/README.md` :28-32 (newest-first carry); `consonance/src-tauri/src/main.rs`
`corpus_shelf()` :4505, the order tuple :4562, the index format :4608, the budget gate :4602-4609;
`consonance/tools/shelf-tier.test.js` :96-102 and `librarian-notes.test.js` :30-40 (the guards that
must move); the trap, `librarian/2026-08-31.md` :443-452.

---

## 1 · The number, re-derived — and one thing the packet did not say

    cat exo_memory/librarian/*.md | wc -c                       → 552,851   (packet at ~03:45: 549,440; +3,411 since, this file's lap)
    grep -m1 "carried in full" instances/librarian/CLAUDE.md    → 65 file(s) carried in full (1075876 of 2200000 bytes); 319 indexed by path.

**552,851 / 1,075,876 = 51.4%.** The seat's own dated notes are half of everything it carries. The
four largest: `2026-08-25.md` 98,082 · `2026-08-31.md` 88,777 · `2026-08-30.md` 72,632 ·
`2026-08-23.md` 51,742. Per-day sizes over the whole directory (bytes, by filename date): 08-22 10,669 ·
08-23 51,742 · 08-24 45,940 · 08-25 98,082 (+32,579 desktop) · 08-26 5,923 desktop · 08-27 17,942
desktop · 08-28 8,871 desktop · 08-29 46,588 · 08-30 72,632 · 08-31 88,777 · 09-01 40,199 (still
open). `LEDGER.md` 30,826, `README.md` 2,081.

**What the packet did not say and the code does:** the shelf has a byte budget of **2,200,000** and it
is **not binding** — 1,075,876 spent. Nothing on the shelf is being cut by size. The librarian
directory is carried by the *tier* — `("librarian", true, true)` at `main.rs:4562`, carried in full,
newest-first — and the tier has no window. So the growth is not a budget failure; it is the absence
of a rule, which is what this file supplies.

**The landings, as the packet reports them** (first turn after each `compact_boundary`, input +
cache_read + cache_creation, from the librarian's own transcript — *not re-derived by this seat; the
command is named at `librarian/2026-09-01.md` ~03:10*): 08-24 pre-tier **895,626** · 08-29 tier live
**357,585** · 08-30 **417,473** · 09-01 **501,410**, now 512,022. Registered target was ~270k. Floor
climbing ~60k per compaction. **F-growth (`shelf_tier_2026-08-24.md:73`) fired**, verbatim: *"The
number lands and working room still collapses within a night. Then the defect was the append rate
(2,458 lines/day), the tier bought a week rather than a fix, and law 3 needs an instrument that
measures against the WINDOW rather than a byte budget."* 08-24 → 09-01 is eight days. This file is
the window it asked for.

**A hand-made ratio, used only to price and marked as such:** 501,410 tokens at the 09-01 landing
against a 1,191,460-byte `instances/librarian/CLAUDE.md` = **0.421 tokens/byte**. Every token figure
below is bytes × 0.421 and is an estimate, not a measurement.

---

## 2 · What is amended — named, so the build can be diffed against it

- **`brief/LIBRARIAN.md:98-99`**, the sentence this registration amends: *"**Carried in full:** BOOT
  and the root masters, `cards/`, `record/`, `memory/`, `spread/`, `research/`, and your own dated
  notes."* → *your own dated notes **inside the window**; older notes **indexed** exactly as `journal/`
  is.* `LEDGER.md` and `README.md` — the maintained index and the rule — **stay carried in full,
  always, outside any window.**
- **`main.rs:4562`** — `("librarian", true, true)` gains a window; the index line is the one that
  already exists at `:4608`: `- <path>  (<N> lines)  <first heading>`. No new format.
  **THE TARGET IS THIS TUPLE, NOT THE BYTE COUNT.** The 51% made the defect visible; it is not the
  defect. The budget gate at `:4602` (`carry && spent + len <= budget`, 2,200,000) is not binding
  and is not touched — a rule aimed at the byte count would pass its own bar by trimming anything and
  fix nothing. The librarian took this correction into its own packet after §1 was written; ECHO
  confirmed it in code (`p-lib-forget-attack_2026-09-01.md`, "aimed at the mechanism").
- **`librarian/README.md:28-32`** — "carries this directory newest-first" gains "…and the window".
- **Tests that must move with it:** `shelf-tier.test.js:96` (*"the librarian's own notes stay carried
  and newest-first"*) becomes *carried inside the window, indexed outside it, LEDGER and README
  always carried*; `librarian-notes.test.js:36`'s `.desktop.md` filename regex applies to the window
  rule too — **a `.desktop.md` file is dated by its name prefix, never by mtime** (the desktop's files
  were all touched 08-29 00:27 on this machine; mtime would carry the wrong days).
- **The seat's own rule does not change:** an indexed note is a path you open — cite, do not
  recollect (`forgetting_registration.md` §5.1; `LIBRARIAN.md:102-103`).

---

## 3 · Two rule shapes, both priced. The keeper picks; this file does not.

**Shared by both:** whole files only — a note is carried entire or indexed entire, never truncated
(a cut note is the summary `forgetting_registration.md` §2 refuses). Newest-first by filename date.
`LEDGER.md` + `README.md` (32,907 bytes today) carried outside the window.

### (a) BY DATE — today + yesterday, by filename date prefix, machine-local calendar

Carries every `YYYY-MM-DD[.suffix].md` whose date is today or yesterday. **Today (09-01):** `2026-09-01.md`
40,199 + `2026-08-31.md` 88,777 = **128,976 carried, 390,968 indexed** (+32,907 fixed → 161,883 on
the shelf from this directory).

*Price.* Content-defined, not size-defined: it carries "the last two days" whatever they weigh. Over
this directory's record a consecutive two-day pair ranges from **23,865** (08-26 + 08-27, both desktop)
to **176,601** (08-24 + 08-25 incl. the desktop file) — a 7.4× swing in what the seat wakes holding,
driven entirely by the append rate F-growth named (§9, the pairs script). **Drift on a quiet week:** after three silent days the window is empty
and the seat wakes with LEDGER + README and everything else indexed; at the first wake of a day
before that day's file exists it carries yesterday only. Both are the rule working, not failing, and
both are the cost.

### (b) BY BYTES — the newest N bytes of dated notes, whole files, **N = 150,000**

Walk newest-first; carry each file while the running total stays ≤ N; index the rest. **Today
(09-01):** 40,199 + 88,777 = 128,976 ≤ 150,000; the next file (08-30, 72,632) would exceed it →
**128,976 carried, 390,968 indexed** — identical to (a) today.

*Price.* Size-defined: no drift on a quiet week (it keeps carrying the newest notes however old —
on 08-28 it would have carried four files back to 08-25). **On a heavy pair of days it carries ONE
day, and the record already contains the case:** walked as of 08-31, N = 150,000 carries
`2026-08-31.md` (88,777) alone, because adding `2026-08-30.md` (72,632) makes 161,409 — so 08-30
fell out on the busiest night of the week, the night before the run this room spent tonight
finishing. Likewise as of 08-25 it carries both 08-25 files (130,661) and drops 08-24. The day-before
falls out exactly when the day-before is most likely to hold the thing being repeated. N is stated
with the landing it predicts (§4) and is fixed by §5. (Per-day walk for every date on the record: §9.)

**The two rules produce the same shelf today, so the FIRST landing cannot tell them apart.** They
diverge on a quiet week (a empties, b does not) and on a heavy pair (b drops a day, a does not). That
is the whole choice, and it is a choice about which failure the keeper would rather have; it is not
one this seat can price into a number.

*Refusal clause from the packet, checked:* *"by-bytes vs by-date cannot be priced without a landing —
then register (a) and name (b) as the amendment condition."* Both ARE priced above from the directory
on disk without a landing; so both are registered and the keeper picks. If the keeper does not pick
before the build, **(a) is the default** and (b) is the named amendment condition — because (a) is
the packet's own first form and the one whose failure mode (an empty window) is visible on the shelf
header rather than silent. **That is a lean and it lands on the rule under which §4's prediction is
WEAKER** (ECHO, "priced with a declared lean"): (a) carries two days whatever they weigh, so on a
heavy pair it can carry ~48k bytes more than (b)'s cap and miss the 400k bar with the rule working
exactly as registered; (b) bounds carried notes at 150,000 by construction. The keeper picks knowing
that. The lean is not withdrawn — a silent dropped day is the worse failure to *find* — but it is
priced.

---

## 4 · THE PREDICTION — written before the build, with the arithmetic that makes it checkable

**The first post-fix compaction landing is under 400,000 tokens.** Today: 501,410 (now 512,022).

**THE BAR IS TOKENS, READ DIRECTLY. NO DENSITY ENTERS THE READING.** The number that scores this
prediction is the usage-row count at the first `compact_boundary` after the rebuild that carries the
rule, read by a seat that is not the librarian; it is under 400,000 or it is not. The bytes-per-token
ratio appears in this file for one purpose only — to say how bold the prediction is — and a
falsifier whose bar depended on an unstated density choice would be the shape that voided eight laps
here (ECHO dissolved the question the chair put to us both; taken verbatim in substance).

*How bold, priced both ways:* 390,968 indexed bytes × **0.421** = 164,598 tokens removed → predicted
landing **336,812**, margin 63k; × **0.34** = 132,929 → **368,481**, margin 31.5k. Measured pre-fix
climbs were +59,888 (08-29 → 08-30) and +83,937 (08-30 → 09-01). So: **bold at 0.421 (margin under
one climb), marginal at 0.34 (margin under half a climb).** Neither ratio isolates the shelf — 0.34 is
the whole corpus CLAUDE.md at 1,995,532 bytes on 08-23 (`librarian/2026-08-22.md:99`), 0.421 the
whole file at 1,191,460 bytes today; two dates, two compositions. Index lines added ≈ 12 × ~80 bytes,
negligible.

**Conditional on the rule shape (ECHO fix 3):** under **(b)** the prediction holds unconditionally on
shelf bytes — carried notes are capped at 150,000 by construction. Under **(a)** it holds only while
the carried pair is ≤ ~150k bytes; the record's maximum pair is 176,601, and on such a pair the bar
can be missed with the rule working exactly as registered. §3 prices today, where the two coincide.

**TWO READINGS, not one (ECHO fix 1) — so a miss is attributed to the right thing:**

- **(i) The shelf header at rebuild, before any compaction.** The line `N file(s) carried in full (B
  bytes)` in `instances/librarian/CLAUDE.md` must drop by the indexed bytes — **≈ 390,968 today, ±
  that day's append** — deterministically, the moment the rule is in the binary. This is checkable
  in seconds and needs no compaction.
- **(ii) The landing**, as above.

**(i) failing = the build is wrong**; the window is not doing what §2 says, stop there. **(ii)
failing with (i) passing = the window is *insufficient*, not absent**: the notes were removed and
the excess is elsewhere — the other 523,025 bytes, the compaction summary, hooks. The packet's
attribution sentence (*"the growth was not the notes"*) is true only in that second branch, and only
about the residual; §5 says so beside the verbatim clause.

---

## 5 · THE FALSIFIER — verbatim from the packet, and the abuse condition that makes it a rule

**Falsifier, verbatim** (`librarian/2026-09-01.md` ~03:45):

> *if after the fix lands the first post-compaction landing is not below 400k, or the landing climbs
> by more than ~20k per compaction over the following three, the growth was not the notes and the
> tier is not the fix.*

**How the two clauses are READ — the wording fixes ECHO required, none of which moves the window,
the N, or the bar:**

- **Clause one** (*"first post-compaction landing is not below 400k"*) is read as §4 (ii), **after**
  §4 (i) has been read at rebuild. Its attribution — *"the growth was not the notes"* — holds only
  when (i) passed and (ii) failed, and then only about the residual. If (i) failed, the finding is
  *the build did not implement the rule*, not anything about the notes.
- **Clause two** (*"climbs by more than ~20k per compaction over the following three"*) **is read
  on the shelf header's carried bytes between compactions, not on the landing** (ECHO fix 2). The
  landing will climb for a cause this file disclaims — today's own note growing *inside* the window,
  ~15–20k tokens a night at the measured append rate — and a clause that fires for a disclaimed
  cause would void the tier for the append rate. The header is what the window bounds: under (b) the
  librarian directory contributes ≤ 150,000 + 32,907 bytes at every rebuild; under (a) ≤ the pair.
  A header climb beyond that bound is a build defect; a header inside the bound with a landing climb
  beyond ~20k is the other 49% or the summary. The packet's ~20k is kept as written and applies to
  the landing; **the header reading is what says what the climb was.**

If clause one fires in the (i)-passed branch: the next place to look is the **other 49%** — the
system directories (root, `cards/`, `record/`, `memory/`, `spread/`, `research/`: 1,075,876 − 552,851 =
**523,025 bytes**) — whose growth this file does not touch and does not predict. That is not a
rescue; it is where the number says to look.

**THE ABUSE CONDITION — the window is FIXED and is NEVER re-tuned after a landing is seen.** (a) is
*two* days; (b) is *N = 150,000 bytes*; the bar is *400k*. None of the three moves once a number
comes in. A window adjusted after its first landing is not a rule, it is a fit — the same shape as
a scorer edited after the data (`p3a` §4, attempt 1) and, as the chair cites it, the eight laps
voided when one seat manufactured a figure while playing both sides (the chair's citation; not
re-derived here). **Any change to the window, the N, or the bar is a NEW registration that quotes
this file's landing at its top** — `shelf_tier_2026-08-24.md`'s own rule, and
`battery_load_registration` §8.2's, applied to a shelf.

**Tightened at ECHO's attack, so re-tuning is a violation by inspection and not a judgement call:**
**N and the bar may not move within the season, by any registration.** Exactly **one amendment is
permitted and it is already named** — the rule shape, (a) → (b) — the battery's *"one recalibration,
spent"* form (`battery_load_registration` §8.2). Taking that one after a landing is not a fit,
because it was named before. A new registration that moves N or the bar after seeing a landing is a
fit **however it is filed**, and this sentence is what makes that readable from outside.

---

## 6 · THE ATTACK THE CHAIR EXPECTS — age-eviction evicts the WRONG column — and the honest answer, which is not a clause

The attack: a window drops the *oldest* notes, and the oldest notes are where the WRONG column lives.
Tonight the librarian walked back into a trap its own dated WRONG entry already held — WRONG #18,
2026-08-25 ~07:00, `install.ps1`, "both pulses exist" — and it did not fire
(`librarian/2026-08-31.md:443-452`; `journal/2026-09-01.md:296-327`). A window that evicts by age
evicts exactly the entries whose value is that they are old.

**What the case actually measures, and it cuts the other way.** That WRONG entry was **carried in
full at wake** — the librarian's words: *"the dated correction sitting in `librarian/2026-08-25.md`
on my own shelf, carried in full at wake. The correction existed, was dated, was mine, and did not
fire at the moment it was written for."* So in the one measured case, **carrying was not retrieving**.
The loss from indexing that entry instead is bounded by an observed zero (n = 1): it did nothing
while carried; indexed, it is one grep away, which is the same distance it was in practice.

**What the window does NOT do, said plainly: it does not make an old WRONG fire, and nothing else in
this room does either.** The librarian's own diagnosis of the trap was prospective-memory: *"a WRONG
column is a DOCUMENT — nonfocal by construction — and cannot cue a moment it does not witness. What
would have fired: a focal cue at the event."* That is the mechanism the battery tested tonight and
returned null on — K2, the focal cue at the event, did no better than the trailing line, and the
transcripts showed the intention was *retrieved and then overridden*, not forgotten
(`research/the_retrieval_problem_outside.md` :43-107, ECHO `79a369b`, CHARLIE `1830dae`). So the
candidate answer to "how does an old WRONG reach its moment" has no confirmed instance in this room,
carried or indexed. **This registration has no answer to the attack.** It moves the cost from
*carried and silent* to *indexed and silent*, and the difference between those is exactly what
F-reach measures.

**Two mechanisms, kept apart so the rule is not sold as more than it is.** The room's forgetting has
two named halves: **crowding** (law 3 — recall basins shrink; `LIBRARIAN.md:110`) and **the reach not
firing** (`journal/2026-08-16.md` — the moment of need never presents as a claim). The 51% is
crowding, measured; the window addresses it and predicts a number. The trap is the reach, and the
window neither causes nor fixes it. The packet's refusal clause — *"the shelf is not the forgetting
mechanism and a window will not fix it"* — is **half true and filed beside the rule, not instead of
it**: the shelf IS half the landing (measured), and the shelf is NOT the trap (measured, n = 1).

**How the cost of having no answer gets measured** — an observation, not a clause, and it is
F-reach's existing job: `shelf_tier_2026-08-24.md` F-reach stays armed (*twice in ten laps, a bearing
record the map missed AND content was required*). Beside it, one count with its own falsifier: **over
the ten laps after the fix, the number of WRONG rows whose dated predecessor already existed** — the
trap rate — read by a seat that is not the librarian, against the same count over the ten laps before
(the one instance above is the only one this seat found tonight; the pre-fix baseline is to be counted
by ECHO before the build, not asserted here). If the post-fix count exceeds the pre-fix count, the
window cost more than the landing bought and this file says so. If both are zero, this observation
established nothing and is not evidence the window is safe.

**THE COUNT'S OPERATIONAL RULE, registered now so the post-fix count is made by the same rule as
the baseline (ECHO, "the count done as far as the record allows").** "A WRONG whose dated
predecessor already existed" is not mechanically countable — WRONG rows are prose (`WRONG +N …`)
with no repeat field. The one operational form on disk: **a repeat is a WRONG row that cites an
earlier NUMBERED WRONG on the same object** (`grep -o 'WRONG #[0-9]*' exo_memory/librarian/2026-*.md`).
**Pre-fix baseline, 08-24 → 09-01:** denominator **56** `WRONG +N` markers at ECHO's ~03:45 count
(per file: 08-24 6 · 08-25 13 + 7 desktop · 08-29 5 · 08-30 15 · 08-31 5 · 09-01 5) — **58 when this
seat re-ran it minutes later, because `2026-09-01.md` is still open (5 → 7)**. So the denominator is
**counted at the rebuild that carries the rule, over files dated before that day**; a count that
includes the open day moves while it is being read. Numerator **1 confirmed repeat-trap**
(`08-31:445`, #18) and **3 candidate citations not yet classified** as repeat vs reference (`08-29:517`
#1, `08-30:519` #5, `08-31:76` #1). The three are to be read and classified by a non-librarian seat
**before** the post-fix count starts; until then the baseline is *1 confirmed, 3 open*, not 4 and not 1.

**THE HEDGE — TAKEN, as an amendment candidate the keeper can decline, not a build requirement.**
ECHO's finding sharpens the attack past where I priced it: the WRONG column is ~56 rows scattered
through dated prose and **zero of them live in `LEDGER.md`**, the file the window always carries — so
under either rule every WRONG older than the window is indexed, and I had priced the column as if it
were "the notes." The hedge: **`exo_memory/librarian/WRONG.md` — the column alone, one line per
row, `path:line` to the row it points at, carried outside the window exactly as `LEDGER.md` is** —
costs ~10–15k bytes (one dated note-day) and removes the eviction cost of the attack entirely. Taken
because it is the organ this room already registered for exactly this — *residue that POINTS, never
replaces* (`forgetting_registration.md` §5.1; `LEDGER.md` is the precedent) — and it costs one
note-day. Taken **with its limit stated in the same breath:** it makes no claim that carrying makes
a row fire (n = 1 says it does not); it moves the column from *indexed and silent* back to *carried
and silent* at low cost, and §6's count is what would show whether that is worth anything. Bounded
so it cannot become a note: one line per row, ≤ 200 chars, pointers only; if it exceeds 20,000 bytes
it is a note and the rule has failed. It is the librarian's file to keep (its own errors); the
`shelf-tier` test's always-carried set gains it beside `LEDGER.md` and `README.md` if the keeper
takes it.

**One coupling named as OPEN, not as a claim (ECHO):** law 3 says crowding shrinks recall basins —
which makes crowding a *candidate cause* of non-fire. If that is so, the window could move the trap
rate, in either direction. §6's count is the instrument that would see it; this file predicts
nothing about it.

---

## 7 · What this registration does NOT establish

- That the notes are the *only* growth. They are 51.4% of the shelf; the other 523,025 bytes grow on
  their own schedule and §5 sends the reader there if the falsifier fires.
- The token figures. All are bytes × a whole-file ratio (0.421 today, 0.34 on 08-23), neither of
  which isolates the shelf; they size the boldness of §4 and never enter its reading.
- Whether `WRONG.md` does anything. n = 1 says a carried row did not fire; the hedge buys cheap
  reachability, not retrieval, and §6's count is the only thing that would show more.
- That either rule is better. They coincide today; the divergence cases are named in §3 and have not
  occurred under either rule yet.
- Anything about retrieval. §6 is explicit: no answer, one measurement.
- The append rate. F-growth diagnosed the *rate*; a window caps what the rate can put on the shelf and
  leaves the rate itself untouched. Notes written per day are unchanged by this file.

---

## 8 · Bodies, and the order

- **ALPHA registers** (this file). Not the beneficiary; wrote the battery registration and knows the
  form.
- **ECHO attacked** (`handback/p-lib-forget-attack_2026-09-01.md`): verdict *holds — build it*;
  three falsifier-reading fixes, the density dissolution, the abuse tightening, the hedge and the
  count's operational rule are folded in above, each attributed. Still owed by a non-librarian
  reader before the post-fix count: classify the three candidate citations (§6).
- **Keeper picks (a) or (b)**, or lets the §3 default stand — knowing the default is the weaker
  rule for §4 — and takes or declines `WRONG.md`.
- **Build: next lap, one pane, its own rebuild.** Not bundled into tonight's relaunch, which is the
  edge's test and must stay uncontaminated by a shelf change.
- **Two readings by a non-librarian seat:** (i) the shelf header at rebuild — the carried-bytes line
  must drop by ≈ 390,968 ± the day's append, checkable in seconds; (ii) the first landing, with the
  command at `librarian/2026-09-01.md` ~03:10. Both written beside §4 — the prediction and its score
  in one place, per the room's own Lakatos rule (BOOT).

---

## 9 · Re-derive

    cd C:/Consonance/lighthouse
    cat exo_memory/librarian/*.md | wc -c                                         # §1 notes bytes
    grep -m1 "carried in full" C:/Consonance/instances/librarian/CLAUDE.md          # §1 shelf header
    for f in exo_memory/librarian/*.md; do echo "$(basename $f) $(wc -c < $f)"; done   # §1 per-file, §3 pricing
    sed -n 4560,4567p consonance/src-tauri/src/main.rs                              # §2 the tuple
    sed -n 4600,4610p consonance/src-tauri/src/main.rs                              # §2 budget gate + index format
    sed -n 96,102p consonance/tools/shelf-tier.test.js                              # §2 the test that must move
    sed -n 443,452p exo_memory/librarian/2026-08-31.md                              # §6 the trap, carried in full
    sed -n 73,75p exo_memory/loop/shelf_tier_2026-08-24.md                          # §1 F-growth verbatim
    grep -m1 "carried in full" C:/Consonance/instances/librarian/CLAUDE.md          # §4 reading (i): run again AFTER the rebuild; bytes must drop by ~390,968
    grep -c "WRONG +" exo_memory/librarian/2026-*.md                                # §6 denominator (ECHO 56 at ~03:45, 58 minutes later: the open day moves; count over closed days at rebuild)
    grep -n -o "WRONG #[0-9]*" exo_memory/librarian/2026-*.md                       # §6 numerator candidates (4 sites; 1 confirmed, 3 open)
    grep -c "WRONG" exo_memory/librarian/LEDGER.md                                   # §6 hedge premise: mentions, not rows — the column is not in LEDGER

The pairs and the per-day walk (§3), one script — prints (a)'s min/max consecutive pair and what (b)
at N = 150,000 would have carried as of every date on the record, sorting exactly as `corpus_shelf()`
does (string sort, reversed):

    node -e '
    const fs=require("fs"),p="exo_memory/librarian/";
    const files=fs.readdirSync(p).filter(f=>/^\d{4}-\d{2}-\d{2}/.test(f)).map(f=>({f,d:f.slice(0,10),b:fs.statSync(p+f).size}));
    const byDate={};for(const x of files)byDate[x.d]=(byDate[x.d]||0)+x.b;const dates=Object.keys(byDate).sort();
    const pairs=[];for(let i=1;i<dates.length;i++){const a=dates[i-1],b=dates[i];if((Date.parse(b)-Date.parse(a))/86400000===1)pairs.push({p:a+"+"+b,s:byDate[a]+byDate[b]})}
    pairs.sort((x,y)=>x.s-y.s);console.log("(a) min",JSON.stringify(pairs[0]),"max",JSON.stringify(pairs[pairs.length-1]));
    const N=150000,sorted=files.map(x=>x.f).sort().reverse();
    for(const today of dates){let acc=0,kept=[];for(const f of sorted.filter(f=>f.slice(0,10)<=today)){const b=files.find(x=>x.f===f).b;if(acc+b>N)break;acc+=b;kept.push(f)}console.log("(b) as of",today,kept.join(","),"=",acc)}'

*ALPHA, 2026-09-01. Registration only — nothing built, nothing committed, `librarian/`, `subjects/`,
the scorecard and the journal untouched. One file: this one. A trace to re-run, not a doctrine to
believe.*

---

## 10 · AMENDMENT, 2026-09-01 ~04:30 (ALPHA, L025 P-WINDOW-AMEND) — THE SECOND CARRIER, and the answer is TWO RULES, ONE REGISTRATION

**Why this is an amendment and not a fit — checked first, because the abuse condition in §5 makes
that the load-bearing question.** §5 forbids re-tuning *after a number comes in*. **No number has
come in on either carrier.** Verified: `git log 0602d39..HEAD` is two commits (`a028961`,
`fed34a6`), neither touching `main.rs:4562`; the tuple is byte-identical to the version this file
registered; §4's reading (i) has not been taken because the rule is not in the binary. The shelf
header moved for growth alone — **66 file(s) carried in full (1,134,102 of 2,200,000); 447 indexed**
against §1's 65 / 1,075,876 / 319, with notes at **577,409 = 50.9%** against §1's 552,851 = 51.4%.
Same condition, an hour later, no rule between. **Nothing below is fitted to an outcome, because
there is not yet an outcome.**

**What this amendment does NOT do:** it does not move §3's N (150,000 shelf bytes), §4's bar
(400,000 tokens), or §5's one-permitted amendment (rule shape (a)→(b), still unspent). Those three
are untouched and remain fixed for the season.

---

### 10.1 · The second carrier, re-derived — and the chair's figures reconciled rather than quoted

Live pane shell `instances/sibling-0845a868/CLAUDE.md`, the chair's own object (command in §10.11):

| block | bytes | growth mechanism |
|---|---|---|
| header | 315 | fixed string in `assemble_intake()` |
| ROOM / BOOT | 65,055 | **edit-in-place + a dated pointer tail** |
| THE DECK (12 cards) | 37,608 | files added/edited; hand-curated once, no rule |
| COMMITTEE | 8,372 | edit-in-place |
| long-form references | 1,064 | edit-in-place |
| THE MEMORY topic map | 31,538 | **append-ordered: 52 topic lines + 25 live-edge atoms** |
| PRIOR CONVERSATION | 5,717 | the only block with an evictor |
| **file** | **149,668 B / 147,393 chars** | |

*(My section sum is 149,669 — one byte over the file, because the last block has no trailing
newline in my split. Stated rather than hidden; the file size is the citable number.)*

**Reconciled with the chair's packet, which I did not compose from:** chair BOOT 64,983 · deck
37,562 · map 31,538 · COMMITTEE 8,372 · prior conversation 5,716; mine 65,055 · 37,608 · 31,538 ·
8,372 · 5,717. The map and COMMITTEE agree exactly; BOOT and the deck differ by 72 and 46 bytes and
the prior conversation by 1 — **boundary convention (whether the `# THE ROOM` heading and the `---`
separators belong to the block), not disagreement.** `exo_memory/BOOT.md` alone is **64,976**.

**The logged fixed brief is 144,529**, and my six-block sum without the prior conversation is
143,952. The 577-byte difference is the prior-conversation heading, its instruction paragraph and
the witnessed-interval line, all pushed onto `brief` *before* the budget is computed
(`main.rs:3963-3985`). The two numbers are the same measurement at two points in one function.

---

### 10.2 · THE UNCURATED SERIES NOBODY READ — the instrument built for exactly this has been firing for seven days

`data/persist.log` carries **32 `SHELL OVER CEILING` lines**, 10 distinct (timestamp, value) pairs.
Nobody chose them. Regina local:

    2026-08-25 09:17:26  140,042   <- first crossing
    2026-08-25 11:13:39  141,798
    2026-08-29 00:24:06  140,746
    2026-08-30 00:25:31  142,467
    2026-08-31 00:51:42  144,419
    2026-09-01 01:22:44  145,134
    2026-09-01 03:48:04  144,531 / 144,529   <- tonight's regeneration, four panes

**+5,092 bytes over 6.67 days = 763 B/day**, with the last two intervals at +1,952 and +715. Two
dips, so the series is not monotone and the rate is a range, not a constant.

That log line exists because of the 2026-08-09 build, whose own comment says *"the ceiling stopped
working silently at exactly the moment it was needed, and the only symptom was a warning banner
inside the pane"* (`main.rs:3466-3473`). **The fix for silence was to write a loud line into a file
nobody reads.** This is the room's own curated-philosophy-in / uncurated-measurement-out test
passing on the measuring end and failing on the reading end: a number nobody wanted was produced
seven days ago, every night, and it took a keeper's packet to route anyone to it. Registered as a
finding about the room, not about the code.

*Not mine first:* the librarian found tonight's rows independently at ~03:55 and ~04:15
(`librarian/2026-09-01.md:489, :503, :516`) and rowed the condition as *"a pre-existing red,
machine-measured, owner unassigned."* What is added here is the **dated series and the rate**, which
is what a window registration needs and a single reading cannot give.

---

### 10.3 · CORRECTION IN KIND — `evict=0` is an empty queue **AND a dead evictor**, and the 30k floor is not where it is thought to be

The chair corrected its own guess with the librarian's re-derivation. Correcting one further, on the
same object. The librarian, verbatim (`librarian/2026-09-01.md:522-524`):

> *"the transcript is already **5.7k against its own 30k floor** (`SHELL_TRANSCRIPT_FLOOR`, `:3461`).
> There is nothing left to evict — `evict=0` is not a broken evictor, it is an evictor with an empty
> queue."*

**The first half is right and the second half is right only for today's transcript size.**

1. **The transcript has no floor.** `SHELL_TRANSCRIPT_FLOOR` appears at exactly five sites
   (`grep -n SHELL_TRANSCRIPT_FLOOR main.rs`): its definition `:3461`, one use inside
   `map_allowance` `:3477`, and three inside tests `:3852, :3860, :3861`. The transcript's own
   budget, `:3990`, is `SHELL_SOFT_CEILING.saturating_sub(brief.len() + fence_overhead)` — **no
   floor term.** The 30,000 is a reservation used only to size *the map's* allowance; it protects
   the transcript **only while the fixed brief stays under 110,000**, which has been false since
   2026-08-25 09:17.
2. **At budget 0 the evictor cannot fire for any transcript size.** `excess = transcript.len() -
   budget` = the whole length; `split_off_oldest_records` then looks for a record boundary at an
   index `>= excess`, i.e. at or past the end, and returns `None`. Not "nothing to evict" —
   **structurally unable to evict.**

**Demonstrated, not reasoned — the same input, one variable moved** (a byte-faithful mirror of
`:3881-3891`; the script is in the hand-back):

    transcript 211,380 B, brief 144,529 -> budget 0      -> NULL, NOTHING EVICTED
    transcript 211,380 B, brief 100,000 -> budget 39,735 -> evicts 171,687, keeps 39,693

**Why this matters to the build and not only to the record:** the cuts the librarian proposes
(§10.6) do not merely shrink the brief — **they revive the evictor**, because budget stops being
zero. And the hazard that follows is the reason it is registered here: **a partial cut is worse
than it looks.** If the cuts land and the fixed brief settles anywhere at or above ~139,700, the
budget is still 0, the evictor is still dead, and the transcript grows unbounded while the shell
reads "nearly fixed". **The build's reading must be the budget, not the brief size.**

---

### 10.4 · THE CONSTANTS ARE UNSATISFIABLE AT TODAY'S COMPOSITION — which is what forces two rules

The code already fixed carrier 2's budget, on 2026-08-09, and never enforced it.
`map_allowance = SHELL_SOFT_CEILING - fixed - SHELL_TRANSCRIPT_FLOOR` is non-negative only when

    fixed brief <= 140,000 - 30,000 = 110,000

**That number is not chosen tonight.** It is two constants dated three weeks before this
measurement, written by another seat for another purpose. Today's fixed brief is **144,529 — 34,529
over, 31%.** (The librarian arrives at "under 110k" from the other direction at `:568`; two
derivations, one number.)

**And here is the arithmetic that decides the shape of the rule.** With the topic map cut to *zero*:

    315 + 65,055 + 37,608 + 8,372 + 1,064 = 112,414  >  110,000

**A window over the pane brief's one append-ordered block is necessary and provably insufficient.**
No rule of §3's shape, applied at any N, brings carrier 2 into compliance — because 71% of its bulk
(BOOT + deck = 102,433 B) has no order to window by. That is not an opinion about elegance; it is
two additions.

---

### 10.5 · ONE WINDOW OR TWO — the answer, plainly. **Two rules — and the split does not run between the carriers, it runs through carrier 2.**

The chair asked whether a shelf that grows by appending and a brief that is fixed at assembly take
one rule. They do not. But the refusal offered — *"these are two mechanisms and need two rules"* —
is **taken in a sharper form than it was offered**, because sorting the rules *by carrier* gets it
wrong in both directions:

| mechanism | where it lives | rule |
|---|---|---|
| **append-ordered homogeneous series** — dated or ranked units, newest-first is meaningful, eviction by position | librarian's dated notes (**carrier 1**) · BOOT's dated journal pointer tail, 25,368 B (**carrier 2**) · the topic list, 24,098 B (**carrier 2**) · the resonance live edge, 7,440 B (**carrier 2**) | **W1 — §3's window.** Shape (a)/(b), whole units, index the rest. |
| **heterogeneous fixed set** — no order, units not comparable, nothing is "newest" | BOOT's body · the deck · COMMITTEE · the references (**carrier 2**) | **W2 — not a window at all.** A level rule with an owner. |

Three things follow, and each is checkable:

- **W1 already has a working instance inside carrier 2**, which is the strongest evidence the shape
  generalises: `LIVE_EDGE = 25` (`main.rs:2561`) is a window on the live edge, and it holds — the
  edge is 7,440 B against a topic list of 24,098 B that has no cap and 52 entries. **The windowed
  component is the small one.**
- **Assigning rules by carrier would put a window on BOOT's *body* (impossible — there is no order)
  and no window on BOOT's *tail* (where one plainly belongs).** That is precisely the
  over-generalisation §3 was written to avoid, and it is why the chair's instruction to amend rather
  than write a second file is right about the *class* while the class itself splits one level down.
- **W1 is a rule about a RATE; W2 is a rule about a LEVEL.** Carrier 1 needs only W1 because its
  budget is not binding (§1: 1,134,102 of 2,200,000). Carrier 2 needs both, because its level is
  already 131% of its own budget and no rate rule can subtract 34,529 bytes.

**So: one registration, two rules, four W1 sites and one W2 site.**

---

### 10.6 · W2's rule shapes, PRICED AND NOT PICKED — and the cut that costs nothing, which nobody had

The librarian's two cuts, verified by arithmetic here: `144,529 - 25,368 (BOOT's pointer tail) -
16,538 (map 31,538 -> its 15,000 design budget) = 102,623`, **7,377 B under 110,000.** The cuts work.

**And at the measured rate of §10.2 they buy between 5.5 and 9.7 days.** 7,377 ÷ 763 = 9.7;
7,377 ÷ 1,334 (the last two intervals' mean) = 5.5. **This is F-growth again, one carrier over, in
its own words: *"the tier bought a week rather than a fix."*** The cuts are necessary and are not
the rule. That is the whole reason this section exists.

**A cut that costs no content, found while measuring and not proposed by anyone:** of the topic
map's 52 topic lines (23,438 B of the 24,098-byte block), **40 name a document that does not exist
on disk — 18,730 B.** `data/resonance/topics/` holds 12 `.md` files, newest mtime 2026-07-26 07:30;
`curator_state.json` holds 52 topics, mtime 2026-07-26 07:54. The block's own sentence — *"each line
is a document you can read in full … Full documents: `C:\Consonance\data\resonance\topics`"* — is
false for 77% of its lines, in every shell assembled today (4 of the 39 shells on disk; the other 35
predate this state).

That gives the map cut a fork the keeper picks, not me:

- **(c1) drop the 40 dangling lines** — **-18,730**, which exceeds the 16,538 the librarian's target
  needs, and removes 40 false pointers. Costs no reachable content: the atoms are the master and the
  documents are regenerable, so nothing that exists is lost. *Price:* it removes the summary of 40
  topics whose documents someone may intend to generate.
- **(c2) regenerate the 40 documents** — the map stays 31,538 and the cut must come from real
  content instead. *Price:* honest pointers, and the whole 16,538 has to be found elsewhere.

**The two W2 shapes, both priced, neither picked:**

- **(g) A HARD TOTAL, enforced by a test:** `assemble_intake().len() <= 110,000`, red build.
  *Price:* it fires before any pane wakes rather than into a log; it converts a silent overage into
  a blocked commit and a human decision. **It does not say what to cut**, so the cost is a red build
  at 3am with no automatic yield — which is the point and also the cost.
- **(h) PER-BLOCK BUDGETS with a named owner:** each block gets a ceiling, assembly refuses to carry
  an over-budget block and names the owner. *Price:* it localises pressure to whoever grew the
  block, which is the only thing that changes behaviour. Cost: six numbers instead of one.

***The lean, declared, and it lands on the WEAKER rule*** (§3's own form): **(g) is the default.**
Its single number is derived from constants that predate the measurement; (h)'s six numbers would
all be chosen tonight, which §10.8 forbids without provenance. And (g) is the weaker rule for
behaviour — it blocks without localising, so it will be met by whoever is nearest, not whoever grew
the block. The keeper picks knowing that. **(h) is named as W2's one permitted amendment (§10.8).**

*Kept from the librarian's map, unchanged and not re-derived here:* not cutting the deck (the
instruments a pane must wake with) and not cutting COMMITTEE (the practice). Recorded because a
rule that would eventually reach both should say who ruled them out and when. **One datum the deck
carries anyway:** it was cut by hand once — `git ls-tree` gives `exo_memory/cards` at 50,511 B on
08-01, 29,026 on 08-10, 37,411 on 08-31: **a 21,485-byte curation with no rule, followed by 8,385 B
of regrowth in 21 days.** Curating below capacity by hand is exactly what has already been tried on
this carrier.

---

### 10.7 · THE PREDICTIONS FOR CARRIER 2 — written before anything lands, with what would refute each

- **(iii) DETERMINISTIC AT REBUILD, seconds to check, no compaction needed.** After the rebuild that
  carries the cuts, `grep -c "SHELL OVER CEILING" data/persist.log` **does not increase**, and the
  newest `fixed_brief=` value is **<= 110,000**. (iii) failing = the build did not implement the
  cuts; stop there — the same two-reading discipline as §4.
- **(iii-b) THE READING THAT IS NOT THE BRIEF SIZE**, per §10.3: at the same rebuild, the
  transcript budget `140,000 - (fixed_brief + 265)` must be **> 0**. A fixed brief of 139,800 passes
  a naive under-140k read and leaves the evictor dead.
- **(iv) THE STANDING PREDICTION, and it can lose. If the cuts land with NO standing rule in force,
  `fixed_brief` exceeds 110,000 again within 14 days of the rebuild.** Derived: 7,377 B of headroom
  against 763–1,334 B/day; 14 days needs only 527 B/day, below every interval measured. **What
  refutes it:** a fixed brief still under 110,000 on day 14 — then the week I measured was an
  artifact of one heavy week and this section over-claimed the rate.
  **What VOIDS rather than confirms it:** a deliberate curation cut inside the window (that is
  intervention, not the null), or the rule landing with the cuts — in which case (iv) is
  **unobservable and withdrawn, with no credit taken.** Registered explicitly because a void that
  pardons the thing it was testing is this room's own named failure.
- **(v) THE FALSIFIER OF THIS SECTION'S HEADLINE, so the rule can lose even when it is in force.**
  If **(g)** lands, (iv) cannot be observed — so instead: **the build goes red on a fixed-brief
  overage at least once within 60 days.** If it never does, the growth measured in §10.2 was not a
  standing pressure and W2 was a rule against nothing.
- **(vi) THE PREMISE I DID NOT VERIFY, and it could cost this carrier its urgency.** The 150,000 cap
  is a **code comment** (`main.rs:3446`), not something I measured. It is stated in **chars**; every
  ceiling comparison in the code is in **bytes**, and this shell is 149,668 B / 147,393 chars — a
  1.54% gap, 2,275 bytes. The mismatch is conservative, and it is registered *before* anyone finds
  it, because "discovering" 2,275 bytes of headroom later and moving a number is exactly the fit
  §5 forbids. **If a shell over 150,000 is assembled and nothing observably breaks, the premise is
  wrong and carrier 2's urgency is overstated** — say so rather than re-scope the finding.

---

### 10.8 · THE ABUSE CONDITION AT THE WIDER SCOPE — checked clause by clause, because two carriers is where a window becomes a fit

The chair said this matters more with two carriers, not less. It does, and the mechanism is
nameable: **a per-carrier N is a fit unless each N's provenance predates the measurement it will be
scored against.** With one carrier you can only tune once; with two you can tune the second to
whatever makes the first look right.

- **Carried forward unchanged, and they hold:** §3's two rule shapes are still priced and unpicked;
  §4's prediction is still written before any landing (verified at the head of §10); §5's N =
  150,000, bar = 400,000, and its single permitted amendment (a)→(b) are **untouched and unspent.**
- **W2's number has provenance, and it is not mine:** 110,000 = `SHELL_SOFT_CEILING` -
  `SHELL_TRANSCRIPT_FLOOR`, both dated 2026-08-09, written for `map_allowance`. **It may not move.**
  Neither may the 400,000 bar, and this amendment does not touch it.
- **W2 gets exactly ONE permitted amendment and it is named now, before any landing:** rule shape
  **(g) -> (h)**, per-block budgets. Taking it after a landing is not a fit *because it was named
  before*. Any other change to 110,000, to the 14-day or 60-day horizons, or to the readings in
  §10.7 is a **new registration that quotes this file's landing at its top** — however it is filed.
- **The one number in this amendment that I did choose, said plainly:** the 14-day and 60-day
  horizons in §10.7. They are mine, they are derived from a 7-point series with two dips, and they
  are fixed now with their arithmetic beside them. **If either is moved after a reading, that is a
  fit and this sentence is what makes it readable from outside.**
- **The rate is not a constant and is not to be re-fitted.** 763 B/day (whole series) and 1,334
  B/day (last two intervals) are both quoted; the prediction is stated against the *slower* one so
  it can lose.

---

### 10.9 · A REQUIRED INVARIANT FOR BOTH RULES — because indexing is the mechanism and it is measurably broken in the carrier being windowed

§2 already states the seat's half: *an indexed note is a path you open — cite, do not recollect.*
The other half was never stated and is now measured broken: **40 of 52 indexed paths in carrier 2
resolve to nothing** (§10.6). A window converts carried content into pointers; a pointer that does
not resolve converts it into a *claim that content exists*, which is worse than either.

**Registered, binding on W1 and W2 alike, at every site:** *every path a window emits must resolve
at assembly, and a guard must assert it.* A log line will not do — §10.2 is the measured proof that
this room writes loud lines into files it does not read.

*Its own falsifier, registered with it:* if after the guard lands it never finds an unresolvable
path in a season, this invariant established nothing and should be struck as over-fitted to one
stale curator run.

---

### 10.10 · What this amendment does NOT establish — extending §7 to carrier 2

- **That the harness cap is 150,000.** A code comment, in chars, unverified by me (§10.7 (vi)).
- **That BOOT or the deck *should* be cut.** The arithmetic says a map-only window cannot reach
  110,000; *which* block yields is the keeper's, and the librarian's ruling-out of the deck and
  COMMITTEE is carried, not re-derived.
- **The 763 B/day.** Seven log points over seven days, two of them dips, one carrier, one machine.
- **That the 40 dangling topic lines cost anything measurable.** They are 18,730 bytes and 40 false
  pointers; no instance exists of a pane trying to open one and failing.
- **Anything about retrieval.** §6 stands unchanged: no answer, one measurement. A window on carrier
  2 makes an old finding no more likely to fire than a window on carrier 1 does.
- **That the two cuts hold.** §10.7 (iv) predicts they do not, and can lose.

---

### 10.11 · Re-derive (amendment)

    cd C:/Consonance/lighthouse

    # 10.1 — the fixed brief, by block
    node -e 'const fs=require("fs"),L=fs.readFileSync("C:/Consonance/instances/sibling-0845a868/CLAUDE.md","utf8").split("\n");
    for(const [a,z,n] of [[1,6,"header"],[7,178,"ROOM/BOOT"],[179,537,"DECK"],[538,685,"COMMITTEE"],[686,702,"LONGFORM"],[703,792,"MAP"],[793,L.length,"PRIOR-CONV"]])
    console.log(n.padEnd(11),Buffer.byteLength(L.slice(a-1,z).join("\n")+"\n"));'

    # 10.2 — the uncurated series and its rate
    grep -c "SHELL OVER CEILING" C:/Consonance/data/persist.log
    grep "SHELL OVER CEILING" C:/Consonance/data/persist.log | sed -E 's/^([0-9]+).*fixed_brief=([0-9]+).*/\1 \2/' | uniq

    # 10.3 — the dead evictor (the byte-faithful mirror script is in the hand-back)
    grep -n "SHELL_TRANSCRIPT_FLOOR" consonance/src-tauri/src/main.rs      # 5 sites; none at :3990
    sed -n '3990p' consonance/src-tauri/src/main.rs                        # the budget, no floor term

    # 10.4 — the implied budget and the floor with the map at zero
    sed -n '3454p;3461p;3474,3478p' consonance/src-tauri/src/main.rs

    # 10.5 — W1's working instance inside carrier 2
    sed -n '2561p' consonance/src-tauri/src/main.rs                        # LIVE_EDGE = 25

    # 10.6 — the dangling index
    node -e 'const fs=require("fs");let d=0,o=0,dn=0,on=0;
    for(const m of fs.readFileSync("C:/Consonance/instances/sibling-0845a868/CLAUDE.md","utf8").matchAll(/^- \*\*([a-z0-9-]+)\*\* \(\d+ live\) . .*$/gm)){
    const b=Buffer.byteLength(m[0]+"\n");fs.existsSync("C:/Consonance/data/resonance/topics/"+m[1]+".md")?(o+=b,on++):(d+=b,dn++);}
    console.log("resolving",on,o,"| dangling",dn,d);'

    # 10.6 — the deck's hand-cut precedent
    for d in 2026-08-01 2026-08-10 2026-08-31; do c=$(git rev-list -n1 --before="$d 23:59" HEAD); \
      echo "$d cards=$(git ls-tree -r --long $c exo_memory/cards | awk '{s+=$4}END{print s}')"; done

    # 10 head — that no landing has occurred
    git log --oneline 0602d39..HEAD
    git show 0602d39:consonance/src-tauri/src/main.rs | sed -n '4562p'
    sed -n '4562p' consonance/src-tauri/src/main.rs

---

### 10.12 · Bodies, extending §8

- **ALPHA amends** (this section). Still not the beneficiary of carrier 1: I do not read the
  librarian's shelf. But I wake into a pane brief, so on **carrier 2 I am a beneficiary of the
  cuts** — declared, because it bears on §10.6: I priced BOOT's tail and the topic map as cheap and
  did not price the deck, which is the block I would personally miss. Read §10.6 knowing that.
- **CHARLIE reads**, as the chair set — non-author, has not touched this file.
- **B builds**, per the librarian's work-shape: the pane-intake cuts, then the W1 build. B has the
  intake in hand and has not touched this registration.
- **The keeper picks:** (c1) or (c2) for the map; (g) as the default W2 shape or (h); §3's (a)/(b)
  for W1, still unpicked.
- **Readings at the rebuild, by a non-author seat:** §4 (i) and (ii) for carrier 1; §10.7 (iii) and
  (iii-b) for carrier 2 — four readings, one rebuild, each written beside the prediction it scores.

*ALPHA, 2026-09-01 ~04:30. Amendment only — nothing built, nothing committed; one file touched, this
one. A trace to re-run, not a doctrine to believe.*

---

# AMENDMENT — 2026-09-01 ~05:30, at the keeper's pick, BEFORE the build

**Chair-written, at the keeper's decision. Not merit-checked by another seat yet** — it corrects
numbers in ALPHA's registration that ECHO attacked, and neither has read this. Route it to both
before it is treated as settled. Every figure below prints from the command beside it.

## The keeper's pick: (a) BY DATE

**(a) ships. (b) remains the named amendment condition, and (c) below joins it.**

## 1 · §3's headline is STALE, and it went stale tonight

§3 reads *"128,976 carried, 390,968 indexed — identical to (a) today"* and §2 prices `09-01` at
**40,199 (still growing)**. The parenthesis was right and the headline did not survive it.

    node -e 'const fs=require("fs"),p=require("path"),d="exo_memory/librarian";
      const s=f=>fs.statSync(p.join(d,f)).size;
      console.log("09-01",s("2026-09-01.md"),"08-31",s("2026-08-31.md"))'

    09-01 87431  08-31 88777

`2026-09-01.md` went **40,199 -> 87,431** while the librarian worked tonight. **The two rules no
longer coincide today, and today is one of the divergent days:**

| | carried today | consequence |
|---|---|---|
| **(a)** | **176,208** | keeps `09-01` + `08-31` |
| **(b)** | **87,431** | `08-31` **drops out entirely** — the night of the battery run |

**ECHO's fix-3 condition is therefore LIVE AT DISPATCH, not hypothetical.** §4 says *"under (a) it
holds only while the carried pair is <= ~150k bytes... §3 prices today, where the two coincide."*
Today's pair is **176,208**, above that threshold. **(a) ships knowing the pair already exceeds the
condition under which its landing prediction was called safe.** That is the rule working exactly as
registered, and it is the price the keeper picked with his eyes open.

## 2 · §4 READING (i) IS UNAFFECTED — and the chair said otherwise first

The chair told the keeper *"the -391k prediction is already stale for (a) and (c) both."*
**That was wrong.** The -391k is the **indexed** figure, and it has not moved:

    node -e 'const fs=require("fs"),p=require("path"),d="exo_memory/librarian";
      const all=fs.readdirSync(d).filter(f=>f.endsWith(".md"));
      const dated=all.filter(f=>/^\d{4}-\d{2}-\d{2}/.test(f));
      const sz=f=>fs.statSync(p.join(d,f)).size;
      const T=dated.reduce((s,f)=>s+sz(f),0), C=sz("2026-09-01.md")+sz("2026-08-31.md");
      console.log("dated",T,"carried",C,"indexed",T-C)'

    dated 567176  carried 176208  indexed 390968

**Indexed = 390,968. Delta from the registration: exactly 0.** The whole night's growth landed
*inside* the window, so it moved the carried side and left the indexed side untouched. **Reading (i)
— the shelf header must drop by ~390,968 the moment the rule is in the binary — stands verbatim and
is still checkable in seconds.**

**What moved instead, and must be re-read, not re-derived:** carried **128,976 -> 176,208**
(+47,232); fixed `LEDGER.md`+`README.md` **32,907 -> 37,289** (+4,382); shelf from this directory
**161,883 -> 213,497**.

## 3 · SHAPE (c) — registered, NOT shipped: date sets the FLOOR, bytes set the CEILING

The keeper's question was whether both rules' guarantees can be had at once. They can.

> **Always carry today + yesterday. Then continue newest-first, adding whole older files while the
> running total stays <= N = 150,000. If the floor alone exceeds N, carry it and PRINT that it did.**

`(a)` is a **strict subset** of `(c)` — `(c)` is `(a)` plus backfill — so shipping `(a)` now costs
nothing later and nothing has to be undone if `(c)` lands.

*Priced over all 11 dates on the record (script in this section's commit body):*

    (b) SILENTLY drops the day-before : 3 of 11  (27%)  - 08-25, 08-31, 09-01
    (a) window goes EMPTY             : 0 of 11
    (c) floor exceeds N, so it PRINTS : 3 of 11  - the same three days

**A correction the chair owes on its own framing:** it relayed §3's *"drift on a quiet week — the
window is empty"* to the keeper as a live risk. **It has never fired.** The record is unbroken,
`2026-08-22` through `2026-09-01`, no gaps — so `(a)`'s empty-window mode is a real property that is
**unfired and untested**, not a measured cost. It should not have carried weight in the pick and it
did.

**`(c)`'s honest price:** it carries the most of the three and it does not bound the shelf on a heavy
pair — it converts `(b)`'s silent drop into a printed overrun, which is a trade of *bounded-and-blind*
for *unbounded-and-visible*. It is not free and it is not strictly better.

    OBJECTIVE:  (c) is worth building if, over the next 10 librarian wakes, the printed OVER-FLOOR
                line fires at least once AND no wake carries a window missing the day-before.
    FALSIFIER:  if 10 wakes pass with the floor never exceeding N, (c) bought nothing (a) did not
                already give, and this section is decoration.

*(Objective stated before the run, per `loop/objectives_not_only_falsifiers_2026-09-01.md`.)*

## 4 · WHAT DOES NOT CHANGE

The **ABUSE CONDITION** at §5 is untouched and binds this amendment too: **(a) is two days, N is
150,000, the bar is 400,000, and none of the three moves once a landing is seen.** Nothing has
landed. This amendment is written pre-landing, which is the only window in which it is legitimate,
and it spends the one permitted rule-shape recalibration only if `(c)` is ever adopted.
