# P-STALE-LAP · CHARLIE — an unfiled lap older than a day, named first at wake

Lap D072 chunk 1, machine **D** (DESKTOP-EEGVFMT), seat C (Around), 2026-09-18 ~22:35–23:3x.
Packet: `exo_memory/loop/plan_small_fixes_2026-09-18.md` @ `7d0ced2`, the C row of chunk 1. Case:
`exo_memory/loop/live_checks_trailer_seal_2026-09-16.md:47-48`. Both read at source.

**Files edited: `consonance/tools/chain-status.js` (+53 / −1) and `consonance/tools/chain-status.test.js` (+187).
Nothing else. Nothing committed.** The one deleted line is `module.exports`'s first line, replaced to export
`staleLaps` and `STALE_MS` (`git diff -U0 -- consonance/tools/chain-status.js | grep '^-[^-]'`).

    consonance/tools/chain-status.js       sha256 4a0cf71c88c55867e5bfe939114586ac6f4d483f1e3ead3fa1309b26eb0a2851
    consonance/tools/chain-status.test.js  sha256 91e06fcdb9989631f161f8ca4d14dbaf025ea46d2925ee741ad4bf78908627ca

---

## 0 · THE ANSWER

**Built to the bar, and the bar is met.** Replayed against the real ledger as it stood at the moment D064 did its
harm:

    STALE D064 24h (holder chair) · chain: D064 WORKING · holder chair · dirty 0 repo-wide · 24h · …

**But the plan's diagnosis is wrong, and the fix is right for a different reason than the plan gives.** The plan
says an unfiled lap older than a day goes unnamed at wake. For its own cited case it did not. Replayed with the
code **as it stood**, the pulse at that second read:

    chain: D064 WORKING · holder chair · dirty 0 repo-wide · 24h · 1 of 10 chained laps unwitnessed (D061) · …

**It already named the lap first, with its holder and its age — every element the bar asks for.** What it lacked
was a **verdict**: `D064 WORKING · holder chair` is character for character the shape of a healthy lap the chair
is working. The chair read that line on every prompt for a day and filed six other laps past it. **So the missing
thing was never information; it was a word saying the information was a fault.** The STALE segment is that word,
placed first — which is why the plan's fix is still correct.

**Two further findings the chair should weigh before relying on it:**

1. **The 24-hour rule caught its own cited case by 61 seconds.** D064's last row was 09-15 13:14:09; C's
   `call_librarian` was refused at 09-16 13:15:10. Two minutes earlier the same rule is silent over identical
   harm — pinned as a test rather than hidden (§3).
2. **A time-independent signal would have fired 14.2 hours earlier** (§2) — but it has a measured false-alarm
   cost, and the ledger holds too few labelled cases to rank the two rules. Recommended, not built.

---

## 1 · THE CASE, RE-DERIVED FROM THE LEDGER AND THE BOARD

Every D064 row in `C:\Consonance\data\lap.jsonl` on D (540 rows at the time of reading; 29 are D064):

    node -e "const rows=require('fs').readFileSync('C:/Consonance/data/lap.jsonl','utf8').split(/\r?\n/)
             .filter(Boolean).map(l=>{try{return JSON.parse(l)}catch(e){return null}}).filter(r=>r&&r.lap==='D064'); …"

    2026-09-15 08:53:46  open
    2026-09-15 08:54:17 … 13:14:09   chain rows, the last: working / holder chair / by chair
    2026-09-16 13:15:38  chain filed / holder none — "PARKED, NOT COMPLETED — closed on 09-16 13:1x after the chair found it still open"

And on the board, the refusal itself (`C:\Consonance\data\board.jsonl`, filtered 18:30–19:30Z):

    2026-09-16 13:15:10  chair | call_librarian REFUSED OUT OF TURN — mount C tried to speak while NO open lap is held
                                 by panes; open laps are held by ["chair"] (newest: lap D064, …
    2026-09-16 13:15:46  chair | call_librarian C -> LIB [Received]: "LIVE CHECK G5: …"     (after the park)

**D064 was 24 h 1 m 1 s old at the refusal. It was stale, under a strictly-greater-than-24-h rule, for exactly the
89 seconds between 13:14:09 and its parking at 13:15:38.**

**The replay the bar asks for**, over the real ledger truncated at 13:15:10 (527 of 540 rows kept):

    node -e "const CS=require('./consonance/tools/chain-status.js'); …line({ledger:'<scratchpad>/stale/ledger-at-1315.jsonl',
             now:Date.parse('2026-09-16T19:15:10Z'), dirty:0, handbacks:[], collation:{state:'n/a'}})"

    OLD CODE   chain: D064 WORKING · holder chair · dirty 0 repo-wide · 24h · 1 of 10 chained laps unwitnessed (D061) · …
    NEW CODE   STALE D064 24h (holder chair) · chain: D064 WORKING · holder chair · dirty 0 repo-wide · 24h · …
    NEW, 13:14 chain: D064 WORKING · holder chair · dirty 0 repo-wide · 24h · …          (silent: 23 h 59 m 50 s)

At 13:15:10 only D064 was open (`openLaps` over the truncated ledger returns one lap).

---

## 2 · WHAT A 24-HOUR THRESHOLD MISSED, MEASURED — RECOMMENDED, NOT BUILT

**Six laps were opened AND filed while D064 sat open** (ledger, first row and first `filed` row per lap, local time):

    D065  opened 09-15 22:22:21   filed 09-15 23:04:03
    D066  opened 09-16 09:01:40   filed 09-16 10:01:38
    D067  opened 09-16 11:24:43   filed 09-16 12:20:16
    D068  opened 09-16 12:20:26   filed 09-16 12:40:18
    D069  opened 09-16 12:40:26   filed 09-16 12:52:44
    D070  opened 09-16 12:52:45   filed 09-16 12:57:55

A **sequence** signal — *an open lap whose last row predates another lap that has since been opened and filed* —
would have named D064 from **09-15 23:04:03, 14.2 hours before the refusal**, where the 24-hour rule named it
61 seconds before.

**Its cost, measured by replaying it over the whole ledger (72 laps):** it would have flagged 7 laps at some
point, and **3 of them — L013, L024, L039 — afterwards did real work** (a `filed` with a real holder, a
`return-leg`, an `opened` row). Those are laps legitimately running beside a faster one: the parallel-lap case
L040 made legal. For comparison the 24-hour rule, replayed the same way, flags 3 (L029 idle 92.3 h, L033 91.1 h,
D064 24.0 h).

**What I could not compute, and first computed wrongly.** I set out to rank the two rules by precision, labelling
a lap "abandoned" if it was later filed with `holder none`. **That label is worthless: 54 of the 72 laps were filed
with `holder none`** — it is the ordinary closing holder, not an abandonment marker — and I retracted the
comparison before writing it down. The ledger's only explicit marker is a note saying PARKED, and **only 2 laps
carry it (L015, D064), one of which L015 the keeper parked deliberately after its returns had landed.** So there is
**one** labelled abandoned lap in the record. **No precision or recall is computable for either rule.**

**Recommendation, and it is the chair's call.** Keep the 24-hour STALE as built. If earlier naming is wanted, add
the sequence signal as a **separate, softer segment** — it would name a lap that is merely slower than its
neighbours — rather than replace a rule whose three hits in this ledger were all idle ≥ 24 h. I did not build it:
it is outside this packet's bar.

---

## 3 · THE CHANGE

**`staleLaps(rows, now)`**, placed directly after `openLaps` in `consonance/tools/chain-status.js`:

- **Open** is `openLaps`' own rule, reused rather than restated: newest baton row per lap, not `filed`. The two can
  therefore never disagree about which laps are open.
- **Age is from the lap's newest row of ANY stage**, so a lap that got a `map` or `opened` row an hour ago is not
  called abandoned whatever its baton says.
- **Strictly greater than 24 h** (`STALE_MS`), the plan's threshold.
- **A row with no finite `at` never ages a lap and never masks one** — see mutant M10 in §4, which is why that
  guard now has a test.
- **A lap with no holder is named `holder ?`**, the gap shown rather than skipped.
- **Oldest first.**

**In `line()`**, the segment goes **first**:

    STALE <lap> <age> (holder <h>)[, <lap> <age> (holder <h>)…][, +N] · chain: …

It names **every** stale open lap, not only the head. A stale lap behind a newer open one used to appear only as
`+1 more open`. It is capped at the file's existing `LIST_CAP` (3) with `+N`.

**It cannot take the pulse down.** `main()` has no try/catch around `line()`, and the file's first rule (`:20`) is
that a reader that throws takes the pulse with it and gets uninstalled. The call is wrapped, and a throw is printed
**in the line** as `STALE UNKNOWN — <message>` — the file's existing pattern for `collation UNKNOWN —` and
`delivery UNKNOWN —` — never swallowed silently. `opts.staleLaps` is a test seam, the same shape as `opts.collation`
and `opts.blindState`, so that guard is watched (M11).

**A healthy line is byte-identical.** The segment appears only when a lap is stale; the existing test
*"a healthy lap prints the line it printed before this section existed, byte for byte"* still passes, and the live
line on D right now is unchanged:

    node consonance/tools/chain-status.js
    chain: D072 DISPATCHED · holder panes · dirty 2 repo-wide · 10m · 0 of 10 chained laps unwitnessed · …   exit 0

**Consumers checked before changing what comes first.** Two files run this tool and read its stdout:
`dev/shell/hooks/userprompt_pulse.py:316` and `dev/shell/hooks/userprompt-submit.js:243`. Both take the **first line
verbatim** under a **3-second timeout** and parse nothing, so a new first segment is safe as long as it stays one
line. The `main.rs` "CONTRACT with `chain-status.js`" (`main.rs:14320`) is about the board's audit-line shape, not
this output — unaffected. Every other hit for `chain-status` in the repo is a comment or a copied helper.

**Runtime:** five runs of the CLI on D measured 116–118 ms against the hooks' 3,000 ms limit.

---

## 4 · TESTS AND MUTANTS

### 4.1 · Red first — and which tests could not be red, said plainly

    node --test consonance/tools/chain-status.test.js
      before this lap:            tests 85  pass 85  fail 0
      11 tests added, no code:    tests 96  pass 89  fail 7
      code added:                 tests 96  pass 96  fail 0

**Seven were red for the right reason** (no STALE segment). **Four were green before any code existed, by
design:** they assert an **absence** —
- the 13:14:00 margin,
- "once D064 is parked it is gone",
- "a fresh lap prints no STALE",
- "age from the newest row of any stage".

They are pins against over-firing, not red-first tests. Whether each earns its place is shown by the mutants
below: M1, M2 and M3 are each caught by one of them.

**D064's 29 real rows are a frozen fixture inside the test file** (fields `lap/stage/chain/holder/by/at`; the
notes are not read). The file's own rule is that nothing reads `C:\Consonance\data`, so the full-ledger replay in
§1 is a scratch command, not a test.

### 4.2 · Mutants on a copy — run 1

`<scratchpad>/stale/mutants.js` mirrors `chain-status.js`, `chain-status.test.js`, `lap-row.js` and
`../hooks/blind.js` into scratch (the suite has no copy seam), runs the unmodified suite against each mutant of the
mirrored tool, validates every anchor to occur exactly once before any run, and hashes the tracked file before and
after. The mirror's baseline run must be green or nothing runs.

    BASELINE on the mirror (unmutated): 96/0
    11 mutants: 11 applied, 9 caught, 2 survived, 0 NOT APPLIED
    tracked chain-status.js sha256 before 0ed395df785c after 0ed395df785c — unchanged

**Two survivors, both real gaps:**
- **M10, the finite-timestamp guard removed.** If a damaged row with a non-numeric `at` comes **first** in a lap,
  it becomes that lap's "newest" value, every later numeric comparison against it is false, the age is NaN, and
  **a lap stale for two days reads as fine.** A real masking bug, reachable from one bad ledger line. Test added;
  it passes on the correct code, since it kills a mutant rather than a defect.
- **M11, the try/catch removed.** Nothing `readLedger` can produce makes `staleLaps` throw, so the guard was
  untestable. I added the `opts.staleLaps` seam and a test asserting that a throwing reader prints
  `STALE UNKNOWN — boom` and the line still prints. Red before the seam, green after.

**One mutant of my own was badly built and replaced before the run.** M9 was meant as "STALE is not first", but
written as `parts.stale = (…)` it dropped the segment entirely — which every positive test catches for the wrong
reason, a vacuous catch. I rewrote it to put the head **in front of** STALE (`parts.unshift('chain: ' …)`). That
leaves healthy lines byte-identical and tests only the ordering.

### 4.3 · Run 2, after the two tests and the seam

    node --test consonance/tools/chain-status.test.js      tests 98  pass 98  fail 0

    BASELINE on the mirror (unmutated): 98/0
    11 mutants: 11 applied, 11 caught, 0 survived, 0 NOT APPLIED
    tracked chain-status.js sha256 before 4a0cf71c88c5 after 4a0cf71c88c5 — unchanged

| mutant | caught by |
|---|---|
| M1 threshold not strict (`>=`) | the strict-boundary test |
| M2 threshold 23 h | the 13:14:00 margin test (an absence pin earning its place) and the boundary test |
| M3 age from baton rows only | "a recent non-chain row keeps it alive" |
| M4 only the head lap considered | "a stale lap BEHIND a newer open lap is named" |
| M5 newest-stale first | "several: oldest first" |
| M6 no `+N` | "several" |
| M7 `holder undefined` | the damaged-ledger test |
| M8 filed laps not excluded | "parked is gone" / "filed is never stale" |
| M9 head placed in front of STALE | every `^STALE` assertion (8 red) |
| M10 timestamp guard gone | the damaged-first-row test (added after run 1) |
| M11 throw not caught | the STALE UNKNOWN test (added after run 1) |

### 4.4 · Neighbouring suites

    node --test consonance/tools/lap-row.test.js     pass 113  fail 0
    node --test consonance/tools/ask.test.js         pass 22   fail 0

---

## 5 · CORRECTIONS I MADE TO MYSELF THIS LAP

1. **The precision comparison in §2** — built on `holder none` as an abandonment label, retracted when 54 of 72
   laps turned out to carry it. The replay's counts stand; the rates I drew from them do not, and are not given.
2. **Mutant M9 as first written** was vacuous — replaced before it could report a false catch (§4.2).
3. **I nearly counted four absence pins as red-first tests** — they are named as green-by-design in §4.1 instead.

---

## 6 · WHAT WAS NOT VERIFIED

- **Nothing ran inside the app or through a live pulse.** The CLI was run directly; I did not watch a real
  `UserPromptSubmit` carry a STALE line, because no lap is stale on D now. The first real confirmation is the next
  lap left open past a day.
- **L was not touched.** `lap.jsonl` is machine-local; the replay is D's ledger.
- **`ago()` rounds, and it can contradict the verdict.** At 23 h 59 m 50 s the existing age slot prints `24h` while
  STALE is correctly absent — a reader may ask why "24h" is not stale. I did not change `ago()`: it is shared by
  every segment and outside this packet.
- **The sequence signal of §2 is measured, not built,** and its three false alarms are classified by what the lap
  did next, not by anyone's ruling.
- **The throw path is exercised only through the seam.** No real ledger input is known to make `staleLaps` throw.
- **I did not re-run the other consumers' suites** beyond `lap-row` and `ask`: `chain-indicator.test.js` reads the
  board, not this output, and I did not run it.

**Scratch record**, under `<scratchpad>/stale/`: `ledger-at-1315.jsonl` (the truncated real ledger),
`d064-rows.txt`, `tests-head.js`, `tests-tail.js`, `splice-impl.js`, `mutants.js`, `mutants-run1.txt`,
`mutants-run2.txt`, and the pre-lap copies `chain-status.js.orig` / `chain-status.test.js.orig`
(sha256 `498caa7a…62cd69` / `87023269…45ba7`).
