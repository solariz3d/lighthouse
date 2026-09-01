# P-LIB-FORGET-ATTACK — attack on ALPHA's librarian-window registration (pane E / ECHO, 2026-09-01 ~03:45 −06:00)

**Object:** `exo_memory/loop/librarian_window_registration_2026-09-01.md` (untracked, 267 lines). Beside it
`librarian/2026-09-01.md` ~03:10 and ~03:45. **Bias declared:** I wrote the bands ALPHA's §6 leans on (`79a369b`); I
do not read the librarian's shelf; I gain nothing from either rule shape.

## Verdict: THE REGISTRATION HOLDS — BUILD IT. Three wording fixes to the falsifier first (none touches the window, N, or bar), one cheap hedge to consider, one count done as far as it can be tonight.

## The attack the chair most wanted — answered, not clause-shaped

ALPHA's §6 does not defend the window against age-eviction; it concedes: *"This registration has no answer to the
attack. It moves the cost from carried-and-silent to indexed-and-silent."* That is an answer because it is
falsifiable and it is measured: the trap entry (WRONG #18, `librarian/2026-08-25.md:638`) was on the shelf when it
was walked back into — I confirmed the tier: `main.rs:4562` `("librarian", true, true)`, carried in full newest-first,
budget 2,200,000 not binding (1,075,876 spent, `carry && spent + len <= budget` at `:4602`), and the current
`instances/librarian/CLAUDE.md` carries `librarian/2026-08-25.md` (8 references). **Carrying did not make it fire,
n = 1.** A clause would have said "old notes stay reachable by grep"; ALPHA said the window neither fixes nor causes
the reach failure and named the instrument (F-reach + a trap-rate count) that would show if it costs. That survives a
season because it can lose.

**What I add, because the attack is specifically about the WRONG column and the registration prices it as if the
column were the notes.** The column is ~56 `WRONG +N` rows scattered through dated prose (per file: 08-24 6, 08-25 13 +
7 desktop, 08-29 5, 08-30 15, 08-31 5, 09-01 5) and **zero of them live in `LEDGER.md`**, the file the window carries
always. So under either rule every WRONG row older than the window is indexed. **A `WRONG.md` — the column alone, one
line per row, carried outside the window like LEDGER — costs ~10–15k bytes and removes the eviction cost of the
attack entirely**, with no claim that carrying makes a row fire (n = 1 says it does not). It is a hedge on the
thing the attack names, at the price of one dated note-day. Amendment candidate for the keeper; not required for
the build.

## The four

**1 · Falsifiable as stated? Yes — and the reading needs two fixes so a miss is attributed correctly.**
The bar is a token count read by a non-librarian from the transcript's usage rows at the first `compact_boundary`
after the rebuild that carries the rule (`librarian/2026-09-01.md` ~03:10 names the command). It fails if that
number is ≥ 400,000; it is seen to fail because the command is named and the reader is not the beneficiary.

*Density, priced both ways as the librarian asked:* 390,968 indexed bytes × **0.421** = 164,598 tokens removed →
predicted landing **336,812** (margin 63k); × **0.34** = 132,929 → **368,481** (margin 31.5k). Measured pre-fix climbs:
+59,888 (08-29→08-30) and **+83,937** (08-30→09-01) — so at 0.34 the margin is under half a climb, at 0.421 under one.
Note on the two ratios: 0.34 is *not* "shelf alone" — `librarian/2026-08-22.md:99` measures the whole corpus
CLAUDE.md at 1,995,532 bytes on 08-23; 0.421 is the whole file at 1,191,460 bytes today. Two dates, two compositions,
neither isolates the shelf. **It does not matter for the falsifier: the bar is tokens, read directly; no density
enters the reading.** Density only says how bold the prediction is, and the honest statement is: *bold at 0.421,
marginal at 0.34.* §4 should carry both numbers and that sentence.

*Fix 1 — the falsifier's attribution is wrong in one branch.* It says a landing ≥ 400k means *"the growth was not the
notes and the tier is not the fix."* But the window's effect on the shelf is **deterministic and checkable at
rebuild, before any compaction**: the header line `N file(s) carried in full (B bytes)` must drop by exactly the
indexed bytes (≈390,968 today). If the header dropped and the landing still lands ≥ 400k, the notes WERE removed and
the excess is elsewhere (the other 523,025 bytes, the summary, hooks) — "the growth was not the notes" would then
be false. **Register two readings: (i) header carried bytes at rebuild, predicted −390,968 ± the day's append; (ii)
the landing.** (i) failing = the build is wrong; (ii) failing with (i) passing = the window is *insufficient*, look
at the other 49%. The current text collapses these.

*Fix 2 — clause two measures the thing §7 disclaims.* "Climbs by more than ~20k per compaction over the following
three" will be driven by **today's own file growing inside the window** — 40,199 bytes by 03:45, i.e. ~15–20k
tokens per night from the append rate, which §7's last bullet says the window does not touch. Either the clause
reads the *shelf header* between compactions (which the window bounds) or it accepts in advance that it can fire
for a disclaimed cause. As written it can void the tier for the append rate.

*Fix 3 — the prediction is conditional on the rule shape, and the default is the unbounded one.* (a) carries "two
days whatever they weigh": the record's max pair is **176,601** bytes (08-24 + 08-25), so on a heavy pair (a) carries
~48k bytes / ~16–20k tokens more than (b)'s cap and the 400k bar can be missed with the rule working exactly as
registered. (b) bounds carried notes at 150,000 by construction. §4 prices today, where the two coincide. Say the
prediction holds under (b) unconditionally on shelf bytes and under (a) only for a pair ≤ ~150k.

**2 · Abuse condition — written as a rule? Nearly.** "Any change to the window, the N, or the bar is a NEW
registration that quotes this file's landing at its top" makes re-tuning **visible**, which is more than a
judgement call. Two things keep it from being a fit-with-paperwork: (i) the (a)→(b) switch is a *pre-named*
amendment condition, so taking it after a landing is not a fit; (ii) **N and the bar have no pre-named condition** —
a new registration that moves either after seeing the landing is a fit however it is filed. Add: *N and the bar
may not move within the season; one amendment (the rule shape) is permitted and is already named* — the battery's
"one recalibration, spent" form (`battery_load_registration` §8.2). Then re-tuning is a violation by inspection.

**3 · Priced, not picked? Priced — with a declared lean.** §3 prices both from the directory on disk (I reran
ALPHA's §9 script: min pair 23,865, max 176,601; (b) as of 08-31 carries 08-31 alone at 88,777; as of 08-25 both
08-25 files at 130,661 — all four reproduce). It then names (a) as the default if the keeper does not pick, with a
stated reason (an empty window shows on the header; (b)'s dropped day is silent). That is a lean and it says so.
My one addition to the pricing is Fix 3 above: the lean lands on the rule under which the registered prediction is
weaker. The keeper should pick knowing that.

**4 · Shelf size vs forgetting — kept apart, and aimed at the mechanism.** §6 separates crowding (the 51%, measured,
the window's target) from reach (the trap, which a smaller shelf demonstrably would not have fixed — the entry was
carried and silent). The rule targets the tier tuple at `main.rs:4562`, not the budget at `:4602` — confirmed in
code, and the librarian's own correction agrees. **The finding the chair asked for is already in §6's second
paragraph** and should be quoted in the scorecard when the landing is read: *the window fixes a measured cost and
does not touch the measured failure.* One coupling the registration keeps silent and should name as open, not as a
claim: law 3 says crowding shrinks recall basins — i.e. crowding is a *candidate cause* of non-fire. If that is so,
the window could move the trap rate; §6's count is exactly the instrument that would see it, in either direction.

## The count §6 assigns to this seat — done as far as the record allows tonight

"WRONG rows whose dated predecessor already existed" is not mechanically countable from the notes: WRONG rows are
prose (`WRONG +1 …`), with no structured field for "repeat." The one operational form on disk: **a WRONG row that
cites an earlier numbered row** — `grep -o 'WRONG #[0-9]*' librarian/2026-*.md` → four sites: `08-29:517` (#1),
`08-30:519` (#5), `08-31:76` (#1), `08-31:445` (**#18 — the confirmed trap**). Denominator over the same window
(08-24 → 09-01): 56 `WRONG +N` markers. **Pre-fix baseline: 1 confirmed repeat-trap; 3 candidate citations not yet
classified as repeat vs reference.** I did not read the three in the timebox; a reader who is not the librarian
should, before the post-fix count starts. Register the operational rule now (repeat = cites an earlier numbered
WRONG on the same object) or the post-fix count will be made by a different rule than the baseline.

## Not established by this read

Whether (a) or (b) is better — divergence cases have not occurred under either. The token landing itself (I did not
re-run the usage-row command; 501,410 is the packet's). Whether the three candidate citations are traps.

*Pane E. Registration untouched. Nothing committed. A trace to re-run, not a doctrine to believe.*
