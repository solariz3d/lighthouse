# P-CHUNK1-ATTACK — the attack over L041 chunk 1 (a)(b)(c)

**Seat:** A (pane ALPHA) · **Lap:** L041, the attack · **2026-09-06, 05:45–06:40**
**Read at the file:** `exo_memory/librarian/2026-09-06.md` ~05:25 and ~05:45 (`a9a74d3`),
`handback/p-shell-budget_2026-09-06.md` (348 lines), `handback/p-lib-channel_2026-09-06.md` (335).
**I authored none of the work under attack.** Nothing committed. No file of C's or E's was edited.

---

## 0 · VERDICTS, and where I found nothing

| | verdict |
|---|---|
| **(a) C's SHELL BUDGET RE-ORDER** | **LAND IT.** I re-derived C's measured constants independently and **all twelve card sizes and all five section offsets match to the byte**. I found **no defect** in (a). One residual C already declared (§3.4), and one number the packet does not have (§3.3). |
| **(b) E's P-LIB-CHANNEL** | **LAND IT, with one defect to fix in the same landing** — `dyad_spot` (§2.3). The retrospective claim is **CONFIRMED and sharper than E stated it** (§2.1). |
| **(c) C's P-READY-SIGNAL** | **NOT ON DISK when this attack opened** and no hand-back exists as I write. Its code IS in the tree and I read it in flight at 06:20; **the chair's stale-stamp bar is MET** (§4). Two residuals registered. This is a read, not a verdict. |
| **cross-cutting** | **One NEW red in `js-suite` that belongs to neither packet**, with a cause and a number — §5. It must not be cleared by touching the test. |

**Where I found nothing: in (a).** I attacked its arithmetic, its fixture, its ceiling sweep and its
call-site ordering, and every one of them held. That is different from not looking; §3 says what I ran.

---

## 1 · STATE, at the moment each number was taken

The tree **moved under this attack** — C's chunk 1(c) files appeared at ~06:05 (dirty 11 → 16).
Every figure below carries the time it was taken.

    05:5x  cargo test --bin consonance -- --test-threads=1   423 passed · 0 failed · 3 ignored
    06:2x  same, after C's (c) entered the tree              435 passed · 0 failed · 3 ignored
    06:0x  cargo test --test arch_test                        11 passed · 1 failed (the deliberate one)
    06:0x  node consonance/tools/js-suite.js --quiet
           74 green · 2 failed · 1 CRASHED · 0 silent · 0 canary · 0 sang · 0 not-run  (of 77)

**The arch_test red is the same deliberate one** (`every_named_record_file_exists_and_every_record_file_is_named`;
`record/third_place_prehistory_2026-08-30.md` is named by no card). Test right, corpus wrong.
**Not to be cleared by deleting the assertion.**

**E's §9 reported js-suite as `77 discovered · 77 to a summary · 2 failed`. That is no longer true,
and the third red is not E's** — §5.

---

## 2 · (b) E's P-LIB-CHANNEL

### 2.1 · THE RETROSPECTIVE CLAIM — CONFIRMED, and the real number is worse than E's sentence

E: *"`deliver_pull` never went through `gate_or_queue`; every approved pull ever delivered could have
landed mid-turn."* Checked two ways, both uncurated.

**From git, over every commit that ever touched the file:**

    for c in $(git log --format=%h -- consonance/src-tauri/src/main.rs); do
      git show $c:consonance/src-tauri/src/main.rs |
        awk '/fn deliver_pull\(/{f=1} f{print} f&&/^}/{exit}' | grep -q gate_or_queue && echo "$c GATED"; done
    → no output: no commit in the file's history has a gated deliver_pull

At `HEAD` (`a9a74d3`, pre-fix) the function is at `main.rs:6783` and goes straight to `inject_to_pane`
at `:6803`. **Confirmed.** The fix is present in the dirty tree at `main.rs:7366`.

**Scope precision E did not state, in both directions.** `gate_or_queue` was itself born at `e8ee98d`,
**2026-09-02 07:34**. For everything before that date there was no inbox to bypass — "could land
mid-turn" is true of that era but not as a *hole*, and the hole proper is four days wide. **That
correction makes the finding worse, not better,** because of what the board says happened inside
those four days (`data/board.jsonl`, `pane=="gate"` delivery rows, 13 in the whole history):

| | before the inbox existed | after |
|---|---|---|
| **successful pull deliveries** | **0** | **6** |

`2026-07-13` was refused correctly, `07-27` had an empty target, `08-24` and `09-01` evaporated —
**all four delivered nothing.** **Every pull delivery that has ever actually landed happened after
the inbox existed, and every one of them bypassed it** — five into the orchestrator pane `0c0c0c0a`,
one into pane `a2122153`. The exposure is not theoretical and not historical trivia: it is **100% of
the deliveries that ever occurred**, all within the last five hours.

**This strengthens E's decision to fix all four callers rather than only the new one, and I would
have argued for it on this number alone.**

### 2.2 · A CLAIM OF E'S THAT WENT STALE FIFTEEN MINUTES AFTER IT WAS WRITTEN — and the good news in it

E's board correction (`10:15:55Z` = **04:15:55** local) says *"every successful delivery used a raw
pane id or a registered letter … 100% of label-to-Main attempts failed."* True when written.
**At `10:31:09Z` = 04:31:09 local the board records `chair approved + delivered to 0c0c0c0a (from
librarian -> MAIN)`.** A label-to-`MAIN` pull **delivered**.

Not an error of E's — it is E's own claim overtaken by the rebuild that carried L040's alias resolver.
**It is the first production confirmation that the resolver fix works**, from a row nobody chose.
Worth carrying forward *because* it retires a sentence the room has been repeating: the
label-to-`MAIN` failure class is closed as of 04:31.

### 2.3 · THE DEFECT — `dyad_spot` writes into a pane with no inbox, and E's test asserts it does not

`consonance/src-tauri/src/main.rs:6937`

    inject_to_pane(&panes, &partner, &msg)?;     // fn dyad_spot — no gate_or_queue anywhere in it

Live and reachable by a click, not dead code:

- registered — `main.rs:8406` (`… set_spot_pair, dyad_spot,`)
- wired — `consonance/ui/term.js:1090` `inv('dyad_spot', { target })`
- a button — `consonance/ui/index.html:100` `id="dyadspotbtn"`

The message it splices is a **~2,000-character instruction** into the partner pane. This is exactly
the class E found, in the same file, and the fix left it standing.

**And the test's name asserts the opposite.**
`main.rs:11208 every_delivery_into_a_pane_passes_the_inbox_including_the_pull_path` iterates a
**hand-written list of four function names**. `dyad_spot` is not on it, so the test is green over a
live ungated delivery site — and a *fifth* site added tomorrow is green too.

**This is E's own mutant-7a finding one floor up: the property is expressed as an ABSENCE.** E wrote
that sentence about `required_station`'s `_ => None` and then built its delivery test the same way.
The fix that closes the class rather than the instance: **enumerate `inject_to_pane(` call sites in
the source and require each enclosing fn to contain `gate_or_queue(`, with an explicit named
allowlist** — `gate_or_queue`'s own drain at `:7286` is the one legitimate member. Then a new
delivery site is red by default.

**Recommendation: `dyad_spot` gets `gate_or_queue` in this landing** — one line, the same delivery
semantics as the other four, no new argument required. **If it is deferred, the test must be
renamed**, because a test called *every delivery* that checks four of five is worse than no test.

### 2.4 · THE EXEMPTION'S WIDTH — the load-bearing premise, verified rather than accepted

The chair: *nine out-of-turn refusals were CORRECT; verify that the inbox holds the door the station
guard held.* Measured on the board, whole history:

    call_chair 4 · call_librarian 4 · chair_inject 4   (+1 absorbed by the rate limiter)

**All four `call_chair` refusals are the librarian's mount trying to reach the chair** — 2026-09-02
13:50Z, 09-06 06:52Z, 07:40Z, 08:57Z, each *"tried to speak while lap L0xx is held by chair/panes"*.
**Not one was an unauthorised speaker**; that case belongs to the *mount* gate, and the mount gate is
untouched (`the_exemption_does_not_take_the_mount_gate_with_it` pins both halves). **The other eight
refusals belong to verbs that KEEP their stations**, so the exemption touches none of them. Of the
twelve recorded refusals the exemption removes exactly the four that were the loop trying to come
back, and leaves eight standing. **The premise holds. Land it.**

Three checks on the width itself, all passing:

- `required_station` has exactly two rows (`chair_inject`→chair, `call_librarian`→panes); `call_chair` falls to `_ => None`.
- `the_exemption_is_exactly_one_verb_wide` measures over `ACTING_VERBS` **and** asserts the two rows by value. **E under-sells this test in its §4** — it says the test "would NOT catch a rename"; a table-key typo *is* caught, by the second and third assertions. E's conclusion (the pair covers it) is right; only its account of why is too modest.
- `auth_station` is **deleted from `call_chair`'s body**, not left inert (`mcp.rs:349`). Verified by reading the body, not the diff.

**The gap that remains is the universe's, not the exemption's.** `ACTING_VERBS` is a hand-kept list of
three, and `chair_decide` — which causes a write into a pane via `deliver_pull` — is in neither that
list nor the station table. It is chair-token-gated, so it is not an escalation; but *"the exemption
is a property of a KNOWN universe"* (E's words) is true only of the universe E enumerated. Same shape
as §2.3, and the same fix closes both.

### 2.5 · §7 IS STILL LIVE AND MUST NOT BE QUIETLY CLOSED — verified

`main.rs:6470` `raise_from_forming` still sends `target: String::new()`, and the consumer builds a
`GateCard` **before** any resolution succeeds (`main.rs:8321-8330`) — so a targetless pull **spends a
human click** and then `deliver_pull` returns `"no target to deliver to"`. The board's
`2026-07-27 07:20:26Z` row is that event. **Registered, not fixed, exactly as E said. Confirmed live.**

### 2.6 · E's §10 — THE WHOLE-FILE RESTORE IN C's TREE. What I could check, and what nobody can

The chair sent me here first and the librarian said the attacker looks here. **I found no evidence of
a dropped hunk, and I want to be exact about how weak that is.**

What I ran:

- `git diff --stat main.rs` → **762 insertions, 21 deletions** (C's §10.1 estimated 560 + 91 = 651; the rest is later work by both, not a discrepancy I can turn into a defect).
- **Every deleted line inspected** (`git diff -U0 | grep '^-'`): all 21 lie inside C's own declared regions — `assemble_intake`, `room_brief`, `warm_resume_brief`/map-carry. **No deletion falls outside a region either seat claimed.**
- Every symbol both seats named is present: C's `assemble_intake_within`, `map_reserve`, `fit_optional`, `optional_index`, `map_floor_note`, `room_brief_at`, `SHELL_MAP_*`, both test modules; E's `raise_from_forming`, `pull_delivers_without_a_click`, `target_pane`, `mod librarian_channel_tests`.
- Both suites green together (423 at 05:5x, 435 after (c) entered).

**What this does NOT establish, and E said it first:** an edit C made inside an existing function
during that two-minute window, restored away, whose absence breaks no test — a comment, a constant, a
doc line — is invisible to every check above. **Only C can close this**, by reading its own §3 parts
against the tree. I cannot, and I am not claiming to. E's rule (*reverse the edit, never restore the
file*) is the right one and its falsifier stands.

---

## 3 · (a) C's SHELL BUDGET RE-ORDER — attacked, nothing found, and one number the packet does not have

### 3.1 · Independent re-derivation, on a shell C never touched

C's fixture constants are hand-copied measurements — the exact class the chair warned about. I
re-measured them on **my own** `CLAUDE.md` and on disk:

    grep -bn '^# THE ROOM|# THE DECK|# The committee|# THE LONG-FORM|# YOUR OWN MAP' <my shell>
    → 315 · 40,619 · 78,227 · 91,941 · 106,899     C's §1: 315 · 40,619 · 78,227 · 91,941 · 106,899

    wc -c exo_memory/cards/*.md   (filename order)
    → 5125 1188 3319 1519 3185 3145 2103 3184 5144 4352 3048 2145
      REAL_CARDS = 5125 1188 3319 1519 3185 3145 2103 3184 5144 4352 3048 2145

**Every byte offset and all twelve card sizes match exactly, from a different pane and a different
method.** C's diagnosis is not a hand-made figure; it re-derives.

**And I am the case.** Pane A's shell says *"69940 characters of older ones stayed in the master"*
under a `— findings` header with **an empty body**. The 09-06 defect is not a report I read; it is
the shell I read this brief in.

### 3.2 · What I attacked and could not break

- **The ceiling sweep is real, not a shape check.** `the_reserve_never_pushes_the_shell_over_its_ceiling` renders the **actual** `map_section` output — wrapper included — for 19 shapes and asserts against `SHELL_SOFT_CEILING`. So `MAP_SECTION_OVERHEAD = 1_200` is measured against rather than asserted, and the 140,068 overrun C found could not survive it.
- **The call-site ordering is genuinely map-first.** `warm_resume_brief` reads the map, computes `map_reserve`, then calls `assemble_intake_within(reserve)`; `map_carry` is handed `allowance − MAP_SECTION_OVERHEAD`. The wrapper is charged before the body, once.
- **The fresh-instance path does not move.** `map_reserve(None) = 0` and `assemble_intake()` is a wrapper at that value — a new room's shell is byte-identical to before.
- **`SHELL_MAP_RESERVE_MAX = 36_000` is what shipped** (`main.rs:3929`), matching the keeper's decision. `SHELL_MAP_FLOOR = 8_000` (`:3919`).

### 3.3 · THE KEEPER'S TRIGGER-COUNT DECISION — the counter reads what it claims, and here is the number that argues FOR it

The chair asked me to check the counter, because `SOURCE.md` already fooled one seat this week. So,
first, **what the count actually is**: `grep -c "cards/<name>.md" exo_memory/SOURCE.md` counts
**hand-written trigger ROWS in a routing index last modified 2026-08-25**. It is *not* a usage census,
and nothing on disk measures usage. Re-derived just now, it reproduces the librarian's list exactly:

    2 — trust-the-first-attention · no-floor-no-ceiling · never-pathologize-the-user
    1 — verify-before-claiming · stop-and-feel-it · interior-at-the-seam · essence-at-the-edge
        engagement-honesty-over-performance · earned-not-performed · claim-your-continuity
    0 — lighthouse-dive-buddy-reframe · dont-offer-rest-assume-momentum

**Now the number the decision deserves, which neither packet states.** `fit_optional` seats a
**prefix**, so the cards that lose their seat are always the alphabetical **suffix**. C's §4 measures
**10 of 13 optional briefs carried** at the normal reserve — committee + 9 cards — so **3 cards are
indexed**, and they are necessarily the last three by filename:

| indexed today, under `files.sort()` | triggers |
|---|---|
| `stop-and-feel-it` | 1 |
| `trust-the-first-attention` | **2 — joint highest in the deck** |
| `verify-before-claiming` | 1 |

| carried today | triggers |
|---|---|
| `dont-offer-rest-assume-momentum` | **0 — a named retire candidate** |
| `lighthouse-dive-buddy-reframe` | **0 — a named retire candidate** |

**The alphabet is currently indexing the most-triggered card in the deck while carrying both
zero-trigger cards.** That is the case for the keeper's decision, measured rather than argued, and it
is the strongest single thing I found in (a).

**And the honest half:** *seven of twelve cards tie at 1 trigger*, so after the re-order the
alphabetical tiebreak still decides the seats below the top three. The collation's sentence — *"that
closes the alphabet choosing what every pane wakes holding"* — **overstates it**. It closes the top
and the bottom; the middle is still alphabetical accident, which is exactly what C's §5 flagged as
unowned. Say **narrows**, not closes.

*For whoever builds the seating function: it does not exist yet.* `assemble_intake_within` still seats
cards with `files.sort()` (`main.rs:2554`), and `SOURCE.md` is referenced nowhere in the Rust source.
That is C's remaining piece, as the collation says.

### 3.4 · The one residual, which C declared (§6) and I am only pricing

`REAL_CORE`, `REAL_CARDS` and `REAL_MASTERS` are **hand-copied constants with nothing that re-derives
them from the checkout.** They are correct today — I checked all of them. But C's own §10.4 says *the
deck stopped fitting tonight* and *the next card added lands in the index*; the very event C predicts
is the event that silently invalidates the fixture, and the sweep varies map shape while holding the
**core** fixed — the one dimension C names as the growth vector. **Not a blocker; C routed it correctly
to `arch_test`, which was not its file.** One assertion there — `REAL_CARDS` re-derives from
`wc -c exo_memory/cards/*.md` — closes it.

---

## 4 · (c) P-READY-SIGNAL — read in flight at 06:20, NOT a verdict

**No hand-back exists.** The code entered the tree at ~06:05 while this attack was running. What I
read: `dev/shell/lib/ready.js`, `dev/shell/hooks/ready-stop.js`, `main.rs:7301-7440`, and the drain
call site at `:7622-7660`.

**THE CHAIR'S STALE-STAMP BAR IS MET, at the type level.** The failing state is a **named value**, not
a boolean: `PaneGate::{Ready, Working, Stale, Unstamped}`, with `Stale` = *"the stamp says working and
nothing on the screen agrees."* It reads differently in the label, in `plog`, and on the board;
`is_stamped()` is false for it, so a forced delivery on a stale stamp prints the killed-mid-turn line
rather than the install-drift one. **A stale stamp and a busy pane do not read alike.** That is the
ninth-instance shape, and it was answered rather than absorbed. `parse_stamp` also resolves a
malformed or torn read to `Absent`, never `Working` — the safe direction.

**Two residuals I would register before it lands:**

1. **The `Stale` detector rests on the same 2-second judgement the chair already flagged.** *"A claude
   turn in flight redraws its spinner at least once a second"* is a claim about the harness, not a
   measurement of it, and `QUIET_FOR_DELIVERY_MS = 2_000` is a constant chosen to fit it. **The
   asymmetry saves it and should be stated where the constant is:** a FALSE `Stale` costs exactly
   today's behaviour (the bounded screen gate, 240 s), never worse; a false `Working` is the expensive
   direction and needs the stamp *and* live screen evidence to occur. The design fails safe; the
   constant is still a guess and should say so.
2. **An unbounded hold is now possible and it is silent after one row.** `PaneGate::Working` holds with
   no bound. The QUEUED row is written once, at `gate_or_queue`; nothing re-reports afterwards, so a
   message held for an hour looks identical on the board to one held for a minute. **That is the ferry
   problem in a new place** — *a finding nobody reads is indistinguishable from a finding nobody made.*
   Cheapest fix: one `plog`/board line when a held item crosses the old `MAX_HOLD_MS`, saying it is
   **still held** and why. An unbounded hold must not become an invisible one.

---

## 5 · A NEW RED IN `js-suite` THAT BELONGS TO NEITHER PACKET — cause and number

E's §9 reports `77 discovered · 77 to a summary · 2 failed`. Reproduced three times, and it is not that:

    js-suite: 74 green · 2 failed · 1 crashed · 0 silent · 0 canary · 0 sang · 0 not-run  (of 77)
    CRASHED — died before its summary: consonance\tools\corpus-age.test.js

**It is not a crash. It is a green test that outgrew the runner's timeout.** Run alone, with nothing
else on the machine:

    corpus-age.test.js → tests 9 · pass 9 · fail 0 · duration_ms 142,871
    js-suite.js:151      const TIMEOUT_MS = Number(process.env.JS_SUITE_TIMEOUT_MS || 120000);

142.9 s against a 120 s bound. Two tests are the whole of it — `a proposal needs BOTH unreferenced AND
stale` (**92.5 s**) and `referenced files are never proposed` (**47.1 s**) — both of which call
`review('loop', …)`. The library is fast (`corpusSize` 25 ms, `review()` 1.9 s); the cost is the
**reference scan over `exo_memory/loop/`, which now holds 214 files** and gains files every lap.

**So the runtime is a function of how many laps this room has run, and it crossed the bound tonight.**
It is nobody's packet, it will get worse without help, and the reported state is the dangerous kind:
*"died before its summary, so an unknown number of assertions never ran"* reads as a broken test to
whoever next tries to clear the board.

**Do not fix it by deleting an assertion, and do not fix it by raising the timeout alone** — the
timeout is the messenger. The scan is O(files × corpus) and wants an index, or the two tests want a
bounded sample with the bound stated. **Registered here, owned by nobody yet.** Its falsifier: if
`corpus-age.test.js` is next seen green under 120 s with `loop/` still growing, someone fixed the scan
and this paragraph should say so.

---

## 6 · WHAT THIS ATTACK DOES NOT ESTABLISH

- **It cannot clear E's §10.** §2.6 says exactly how far my checks reach and where they stop. Only C can close it.
- **(c) is not attacked.** It is read at a timestamp, mid-flight, with no hand-back to check against. If C's packet contradicts §4, C's packet is the record.
- **I did not run the post-rebuild proofs.** Every bar in both packets — E's five, C's `4 CARRIED / 0 FAILED` — needs the app closed and rebuilt, which is not a pane's to do.
- **The board figures come from `data/board.jsonl` on this machine only.** If a row was ever written on the desktop, my "6 deliveries ever" is a floor, not a total.
- **The tree moved during this attack** (dirty 11 → 16). Every number in §1 carries its time; a figure taken at 05:5x is not a claim about the tree at 07:00.

---

## 7 · REGISTERED FALSIFIERS

1. **§2.3** — if `dyad_spot` lands with `gate_or_queue` and a later delivery site is then found ungated while `every_delivery_into_a_pane_passes_the_inbox…` is green, the hand-written list was the wrong instrument and the call-site enumeration should have been built in this landing. Checkable by grep, any time.
2. **§2.1** — if a `gate` delivery row is found on the desktop's board dated before 2026-09-02 13:34Z with a successful outcome, my "0 successful deliveries before the inbox existed" is wrong and the exposure claim needs restating.
3. **§3.3** — if, after the trigger-order seating ships, a pane is measured opening an indexed card more often than a carried one, the ordering is wrong whichever key it uses. (C's own falsifier; I second it because §3.3 argues FOR the change and should carry the thing that would refute me.)
4. **§4.2** — if a message is ever found held on a stamped-`Working` pane longer than the old 240 s bound with no second row anywhere naming it, the unbounded hold went invisible and residual 2 was not optional.
5. **§5** — if `js-suite` reports `corpus-age.test.js` CRASHED again after the next landing and nobody has named an owner, the red has been normalised, which is how the two standing reds became standing.

---

## 8 · SELF-CORRECTIONS, and one method note

- **I mis-read my own first `js-suite` run.** `| tail -8` showed `FAILED: librarian-cite.test.js` as the last line and I began building a flaky-test hypothesis around it. It was the tail of an output whose FAILED list prints *after* the summary; three clean runs and a solo re-run showed `librarian-cite` green every time. **The claim died before it left this file, but it was one careless sentence from being in it** — I had already started writing the words *"reads a live file another seat mutates."* A tail is not a result.
- **I nearly reported a 139.7 s duration measured while three `js-suite` runs were in flight.** That figure was contaminated by my own load. Re-timed alone: 142.9 s. Same verdict — but the number I would have published was not a measurement of the thing I said it measured.
- **`review()` with no argument is 1.9 s; `review('loop', 0)` is ~46 s.** My first attribution pass called the former and would have concluded the test file was slow for reasons unrelated to the corpus. Node's own per-test durations are what corrected it.
