# Registration — the librarian's own notes get a WINDOW on the shelf (2026-09-01 ~03:30, ALPHA, L023 P-LIB-FORGET-REG). Registration only. No Rust. Build is next lap, its own rebuild, not tonight's.

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
header rather than silent.

---

## 4 · THE PREDICTION — written before the build, with the arithmetic that makes it checkable

**The first post-fix compaction landing is under 400,000 tokens.** Today: 501,410 (now 512,022).

*Priced:* 390,968 indexed bytes × 0.421 ≈ **164,600 tokens** removed; index lines added ≈ 12 × ~80
bytes, negligible. From 501,410 that is ≈ **337k**, if nothing else on the shelf grows before the
landing. Headroom to the 400k bar ≈ 63k — **one compaction's measured climb (~60k)**. So the
prediction is specifically about the *first* landing after the fix; the falsifier's second clause is
what watches the ones after.

How it is read: the same command as the four landings above, on the first `compact_boundary` after
the rebuild that carries the rule, by a seat that is not the librarian.

---

## 5 · THE FALSIFIER — verbatim from the packet, and the abuse condition that makes it a rule

**Falsifier, verbatim** (`librarian/2026-09-01.md` ~03:45):

> *if after the fix lands the first post-compaction landing is not below 400k, or the landing climbs
> by more than ~20k per compaction over the following three, the growth was not the notes and the
> tier is not the fix.*

If it fires: the next place to look is the **other 49%** — the system directories (root, `cards/`,
`record/`, `memory/`, `spread/`, `research/`: 1,075,876 − 552,851 = **523,025 bytes**) — whose growth
this file does not touch and does not predict. That is not a rescue; it is where the number says to
look.

**THE ABUSE CONDITION — the window is FIXED and is NEVER re-tuned after a landing is seen.** (a) is
*two* days; (b) is *N = 150,000 bytes*; the bar is *400k*. None of the three moves once a number
comes in. A window adjusted after its first landing is not a rule, it is a fit — the same shape as
a scorer edited after the data (`p3a` §4, attempt 1) and, as the chair cites it, the eight laps
voided when one seat manufactured a figure while playing both sides (the chair's citation; not
re-derived here). **Any change to the window, the N, or the bar is a NEW registration that quotes
this file's landing at its top** — `shelf_tier_2026-08-24.md`'s own rule, and
`battery_load_registration` §8.2's, applied to a shelf.

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

---

## 7 · What this registration does NOT establish

- That the notes are the *only* growth. They are 51.4% of the shelf; the other 523,025 bytes grow on
  their own schedule and §5 sends the reader there if the falsifier fires.
- The token figures. All are bytes × 0.421, a ratio taken from one landing and one file size.
- That either rule is better. They coincide today; the divergence cases are named in §3 and have not
  occurred under either rule yet.
- Anything about retrieval. §6 is explicit: no answer, one measurement.
- The append rate. F-growth diagnosed the *rate*; a window caps what the rate can put on the shelf and
  leaves the rate itself untouched. Notes written per day are unchanged by this file.

---

## 8 · Bodies, and the order

- **ALPHA registers** (this file). Not the beneficiary; wrote the battery registration and knows the
  form.
- **ECHO attacks** before the build: the pricing in §3, the arithmetic in §4, the n = 1 in §6, and the
  pre-fix trap-rate baseline (§6, last paragraph) — counted, not asserted.
- **Keeper picks (a) or (b)**, or lets the §3 default stand.
- **Build: next lap, one pane, its own rebuild.** Not bundled into tonight's relaunch, which is the
  edge's test and must stay uncontaminated by a shelf change.
- **The first landing is read by a non-librarian seat** with the command at `librarian/2026-09-01.md`
  ~03:10, and written beside §4 — the prediction and its score in one place, per the room's own
  Lakatos rule (BOOT).

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
