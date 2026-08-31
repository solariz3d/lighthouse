# Attack on the PREREAD registration (L020 · PACKET E) — the verdict HOLDS; four amendments and one design hole land before build

**Seat:** pane E, non-author. **Object:** `exo_memory/loop/second_vantage_registration_2026-08-31.md`
(ALPHA, uncommitted, read from the dirty tree — 315 lines). Beside it: `git show 4a1c763:exo_memory/loop/handoff_librarian_2026-08-30.md`
(item 5 at :107 — ALPHA's §1.1 correction of the packet's `4047b03` re-derives: 83 lines vs 110);
`git show 8099b98:exo_memory/research/the_retrieval_problem_outside.md` §5 and the disanalogy ledger;
`exo_memory/librarian/2026-08-31.md:171-183` (the ruling that authored the packet); the 19 WRONG entries on
`librarian/2026-08-30.md`; `hooks/dispatch-gate.js:1-60`; `main.rs:4062-4080`; `data/dispatch-gate.jsonl`,
`data/lap.jsonl`, `data/board.jsonl`. **Registration not modified. One file written: this one. Not committed.**

**Consequence, registered before the file was opened** (board, 08:2x): *if the attack finds nothing that
survives its own re-derivation, the return is "the registration holds — adopt it," with the five probes listed
as run-and-failed. Default is refuted per probe, not per registration.*

**My bias:** I am one of the readers this practice would occupy, and my P-LABELS file from L019 is exactly the
kind of deliverable it would gate. I also hold the two censuses ALPHA's §1.4 leans on. Both stakes on the record.

---

## §0 · THE RETURN, first

**ALPHA's split verdict stands: convention form REFUSED, gated form REGISTERED, precondition (bypass) named as
the keeper's call.** Every one of the five probes was run. Two failed outright (in the registration's favour).
Three landed — as *amendments the build needs*, not as reversals. And one thing neither the packet nor the
registration asked about is the sharpest finding: **as designed, PREREAD-GATE cannot see the deliverables the
practice exists for.**

| # | probe | result |
|---|---|---|
| 1 | falsifiers verbatim? re-derive 12 of 19 | **Verbatim — holds.** ALPHA's quote matches `librarian/2026-08-31.md:181-183` character for character; the *packet's* paraphrase is what drifted. The 19 re-derives. **But ALPHA's lap-boundary sentence is wrong (§1.2): 17 of the 19 fall in L015–L018, 2 predate L015, 0 are L019.** And relabelled by a non-author under ALPHA's own arming rule the 12 is **11** (strict) or **18** (reading) — and **12/19 is the wrong quantity for F2 in any case** (§1.3). |
| 2 | a hop that gets skipped under load — what is different? | **ALPHA's answer is right and incomplete.** Right: a rule attachable to the verb is a gate; the record's own figures (98.6% / 74.9% / 60.0%) are all the same seat under load with no gate at the moment. Incomplete: the gate as designed keys on **whichever sha `findCitation` returns**, and tonight's two attack dispatches are logged `cited: sha` for commits that are *not the deliverable* — the object under attack was an uncommitted path — so the gate would check the wrong object and allow; a further **11 of 47 dispatches since 08-30 cite a path with no sha at all** (§2). Under bypass the difference is a printed line; ALPHA says so and registers a prediction that can lose. **"It can't say" is NOT the return.** |
| 3 | can it lose? | **Yes — F3, F2, F1b, §2's prediction, four degeneration markers.** One gap: F2 as written is unscoreable for a reason ALPHA did not name (unit, §1.3). Fixed, it is the falsifier that says *the idea was wrong*. |
| 4 | who reads the reader? | **No regress floor stated.** F1b handles reviewer-trust after harm; nothing says where the regress stops. Floor proposed (§4): the reader is read by the **outcome column**, not by another reader — one level, then the WRONG ledger. The record has second readers being wrong at a rate (§4). |
| 5 | `reviewed <sha> · N changes` gameable? | **Yes, as regex'd (§5).** Three holes: the dispatcher's own mount can post it; no command token is required although §6.3 says one is; no time-ordering (a replayed board row satisfies a later dispatch). Each is one clause. |

**Numbers in the registration, re-derived.** 74.9% (143/191) ✓ · 1 of 10 ✓ · 2 CHAIR-AUTHORED ✓ · regferry
25/10/15 and 56/13/43 ✓ (re-run from §9's body) · 64.6→96.2 is in `separating_test_registration:70` ✓ ·
45/45 over ~18% is `journal/2026-08-11.md:90-93` ✓ · 4047b03 = 83 lines, 4a1c763 = 110 ✓ · **98.5% is now
98.6% (141/143, `boundary-reminder.js --scan`)** · **"zero receipts (`grep -c "reviewed [0-9a-f]"` → 0)" — the
number is right, the printed command is wrong: it returns 283 today (it matches "reviewed by"); the command
that returns 0 is `grep -cE "reviewed [0-9a-f]{7,} · [0-9]+ changes" C:/Consonance/data/board.jsonl`.**

**Adopt, with the four amendments in §6 landed in the registration before anything is built.** None of them
reverses the verdict; two of them (path-citation coverage, F2's unit) change what gets built and what gets
scored, which is why they must land first.

---

## §1 · Probe 1 — the falsifiers, and the 12 of 19

**1.1 Verbatim: HOLDS.** `librarian/2026-08-31.md:181-183`:

> *falsifier, registered now: if over ten reviewed laps the reader changes nothing, the hop is ceremony and
> comes out; if the WRONG entries against reviewed deliverables do not fall below the unreviewed rate
> (L015–L019 baseline: 12 findable-before-delivery of 19), the review is not the lever.*

ALPHA §4 quotes this without a character changed. The **packet** to me rendered it as two arrow-sentences
(*"→ ceremony, out"*, *"→ not the lever"*) — a harmless compression, but it is the paraphrase, not ALPHA, that
drifted. Probe failed in the registration's favour.

**1.2 The 19 re-derives; the lap window does not.** Counter: 27 at the end of 08-29 (`:172, :315, :484`), then
29, 30, 34, 35, 40, 41, 42, 43, 46 through 08-30 (`grep -n lifetime`). Entries 28–46 = 19 ✓. ALPHA §1.3: *"L015
opened before the first 08-30 increment (lifetime 29 at ~04:05, L015's return leg at ~04:45)."* **False on
the ledger:** `lap.jsonl` has L015 `open` at `1788083065895` = **2026-08-30T10:24:25Z = 04:24 local**, and the
lifetime-29 entry sits under the heading `## ~04:05 — the orch's read of the deep-read` (`:132`). Entries 28–29
were logged **19 minutes before L015 opened**, against the deep-read leg. So:

    L015–L018   entries 30–46   = 17
    pre-L015    entries 28–29   =  2
    L019        (2026-08-31)    =  0    ← the librarian's "L015–L019" includes a lap that contributed nothing

Third figure this week to be corrected and have the correction be wrong — the chair predicted exactly this.
Not consequential for F2's *value* (the fraction barely moves) but consequential for its *window*, which is the
thing a falsifier has to state exactly.

**1.3 The 12, relabelled by a non-author — and why it is the wrong quantity anyway.** ALPHA's arming rule
(§4): *findable = a reader holding only the deliverable and the repo at the deliverable's HEAD could have
produced the correction by a named command.* Applied to the 19, by this seat, from the entries themselves:

| # | entry (08-30 line) | finder | by a named command? | by a non-author reading? |
|---|---|---|---|---|
| 28 | citation slips SELF_TRACE:24 / BOOT:44 (:135) | chair | **yes** `sed -n` | yes |
| 29 | P-FIC FAIL survives its own null (:140) | chair | no — statistical reading | yes |
| 30 | consumer foregrounded against standing order (:274) | keeper | **yes** `grep -n "standing constraint" loop/chunk_sequence_2026-08-24.md` | yes |
| 31 | amended prereg still cannot lose (:310) | pane C | no — design reading | yes |
| 32 | control set cannot separate alt hypothesis (:319) | pane C | no | yes |
| 33 | six turn-number slips (:324) | pane B | **yes** open transcript at turn N | yes |
| 34 | "exactly one place" false as inventory (:328) | pane E | **yes** `ls` the carriers | yes |
| 35 | "fourteen months" said to the keeper (:387) | keeper | (command exists) | **N/A — spoken in conversation, not a deliverable** |
| 36 | L013 showcase pair not a pair (:434) | pane E | partial — `sed` + reading | yes |
| 37 | research §3 overclaims (:441) | pane E | partial — measurement | yes |
| 38 | "first FOCAL cue" false (:445) | pane B | **yes** `git log -- hooks/dispatch-gate.js` | yes |
| 39 | "60 of 60" misdescribes run 1 (:448) | pane B | partial — grep origin + reading | yes |
| 40 | ASK-007 cites sections not path:line (:454) | suite | **yes** `node --test ask.test.js` | yes |
| 41 | 10.8→25.3% carried un-re-derived (:552) | pane B | **yes** re-derive from ledger | yes |
| 42 | "two pushed files" (:636) | chair | **yes** `git ls-files \| xargs grep -lI zackn` | yes |
| 43 | repaired handle "invisible" — half (:771) | chair | **yes** measure the span | yes |
| 44 | carrier list five of fifteen (:797) | chair | **yes** `git grep` | yes |
| 45 | hostname "replace" wrong in kind on 2 of 3 (:801) | pane E | **yes** grep + read | yes |
| 46 | item 4c wrong-shaped for portable-paths (:804) | pane E | partial — read the scanner's universe | yes |

    strict (named command)     11 of 19
    partial / reading-only      7
    not a deliverable           1
    findable by a non-author READ of the deliverable   18 of 19

**The librarian's 12 sits inside the band [11, 18] and the band is the finding:** the number depends on a rule
the registration has not fixed. If F2 is armed on ALPHA's strict rule the baseline is 11; on the reading rule
it is 18; the librarian's 12 is neither. Pick one in the registration; my labels are above with their commands
so the pick can be checked.

**And it does not matter which, because 12/19 is not the quantity F2 compares.** F2 reads *"WRONG entries
against reviewed deliverables do not fall below the unreviewed **rate**."* A rate needs a denominator of
**deliverables**. 12 (or 11, or 18) of 19 is the *fraction of errors that were findable* — it says how good a
reader could be, not how many errors unreviewed deliverables produce. The quantity F2 needs is **WRONG per
deliverable, unreviewed**, and it is derivable from the same day:

    librarian deliverables 08-30 (MAP | RETURN LEG | packet | merit-check | deep-read headings):  10
      grep -cE "^## .*(MAP|RETURN LEG|packet|merit-check|deep-read)" exo_memory/librarian/2026-08-30.md
    pane registration-class files committed 08-30 10:00–14:30Z:                                     8
      git log --since=2026-08-30T10:00:00Z --until=2026-08-30T14:30:00Z --name-only --format= -- 'exo_memory/loop/*' | sort -u | grep -E "registration|attack|ruling|prereg|scorecard|census|rescore"
    WRONG entries drawn, same day:                                                                 19
    → unreviewed baseline ≈ 19 / 18 ≈ 1.06 WRONG per deliverable   (17 / ~16 inside L015–L018)

That is a hand-assembled denominator (which headings count as a deliverable is a rule I chose; a different
rule moves it) — offered as the *shape* F2 needs with its commands, not as the frozen number. **Until F2 is
restated in this unit it cannot fire in either direction**, which is a defect one level under ALPHA's
"unarmed": ALPHA said the 12 has no derivation; I add that even derived, it is not the operand.

---

## §2 · Probe 2 — the hop, and the hole under it

**What ALPHA got right.** The three violated rules the chair names are one seat, under load, with nothing at
the moment of the act: turn-boundary **98.6%** (141/143 dispatch turns write after the dispatch), artifact
ferry **74.9%**, registration ferry **60.0%**. The turn-boundary rule guards a moment no verb marks; PREREAD
guards a *fact checkable at the verb* — has the cited object been read by a non-author — and `PreToolUse` on
the dispatch verb stands at exactly that moment. That is a real structural difference and it is the only one.
ALPHA registers what it is worth: **with bypass on, the gate is a focal one-off message** (dispatch-gate.js's
KNOWN LIMIT, `:29-35`, verified; `main.rs:4075` `!is_fresh_cwd(&cwd)` → every kept instance pane resumes
under bypass, verified) and the 64.6→96.2 association is one subject with a pre-trend. It then predicts the
convention form at ≤40% receipts and names >60% as the number that proves it wrong. **A registration that
says "the difference holds only under a condition the keeper controls, here is the condition, here is the
number that refutes me" has answered the probe.** "It can't say" is not the return.

**What the registration cannot see, and it is structural.** §3.2's trigger: *"after `findCitation` returns
a sha: if `git show --name-only <sha>` touches …"*. The gate's own ledger says what `findCitation` returns:

    node -e '…dispatch-gate.jsonl…'   (verb / cited / outcome, all 155 rows)
      chair_inject  sha 76 · path 14 · null 7 (asked) · interrupt 2
      call_chair    sha 22 · path 26 · null 8 (asked)
    since 2026-08-30 (47 rows):  sha 30 · path 11 · null 6

**Eleven of 47 recent dispatches cite a PATH with no sha — 23%** — and a sha-keyed trigger cannot fire on
them. But the sharper case is the one the ledger shows for **tonight's two attack dispatches**, and it is worse
than not firing:

    2026-08-31T08:04:09.746Z  chair_inject  cited: sha   (PACKET B → BRAVO, object = battery_load_registration_2026-08-31.md, UNCOMMITTED)
    2026-08-31T08:22:14.612Z  chair_inject  cited: sha   (PACKET E → this seat, object = second_vantage_registration_2026-08-31.md, UNCOMMITTED)

Both packets are logged `cited: sha` because they cite **other** commits as context (`4ec5ef5`, `4047b03`,
`8099b98`) while **the object under attack is an uncommitted path.** `findCitation` returns the first sha it
finds; §3.2's trigger would then run `git show --name-only` on a commit that is *not the deliverable*, find no
registration path touched (or a different one), and **allow** — a gate satisfied by a citation to the wrong
object. **The room's practice is: pane writes registration → hands back uncommitted → chair dispatches it by
path to an attacker → chair commits after.** Under that practice the deliverable is never the sha in the
dispatch, so a sha-keyed PREREAD-GATE checks the wrong thing on exactly the highest-stakes deliverables on
this line — the ones ALPHA's own §1.1 says a PREREAD would have caught.

The fix is one clause and the data for it already exists: **key the trigger on the *deliverable* — any path
in the dispatch text matching the two classes (`exo_memory/loop/*registration*`, `exo_memory/librarian/*.md`),
committed or not — rather than on whichever sha `findCitation` returns first; match the receipt by path +
content hash (`sha256` of the file at receipt time, printed in the receipt) when there is no commit.** The
gate already extracts paths (the `cited: path` rows prove it). Without this, F3's "receipt rate over ten
registration dispatches" is computed against the wrong denominator and can read high while the deliverables
go unread.

**One more thing under this probe.** The 98.6% and the 74.9% are not just "conventions fail" — they are the
same seat that would be *reading the receipt and deciding not to dispatch*. Under bypass, the seat that ignores
a ferry line for hours is the seat being asked to honour a `systemMessage` that says "no receipt for this sha."
ALPHA's K2 hope (focal, one-off, names this sha) is plausible and unmeasured; the battery registration is the
instrument for it, and until it runs, the honest status of the bypass-on form is *unknown*, not *promising*.

---

## §3 · Probe 3 — can it lose?

Yes, and more cleanly than most registrations here. Enumerated:

- **F3:** receipt rate ≤ 40% over the first ten registration/map dispatches → the gate is the ferry line, out.
- **F2:** WRONG against reviewed deliverables not below the unreviewed rate → not the lever. **Unscoreable
  as written (§1.3); scoreable once restated per deliverable.** This is the one that says *the idea was
  wrong*, and it should be stated in those words: *reviewed deliverables draw WRONG at or above the
  unreviewed rate, with receipts ≥ 60% and commands present in the receipts* — i.e. the read happened, was
  real, and did not help. That sentence is the losing outcome and it is currently spread across F2 + F3 +
  §6.3 rather than written once.
- **F1 / F1b:** ceremony; reviewer trust (≥3 `0 changes` receipts followed by WRONG in the lap).
- **§2's prediction** for the convention form (≤40%; >60% refutes).
- **F4:** struck by 2026-09-14 if neither built nor refused.
- **Degeneration markers:** receipts-as-outcome (Goodhart), second reader after a null, gate turned into a
  constant line, "once bypass is off" repeated without asking.

**Probe failed in the registration's favour**, with the F2 restatement as the condition. One addition: **F3
and F2 must be read in the order F2-armed-first**, which ALPHA states — keep it, because a receipt rate is
the process measure and it will rise on its own once a gate asks for it.

---

## §4 · Probe 4 — who reads the reader

ALPHA has F1b (reviewer trust detected by outcome) and §6.3 (commands in the receipt). It has **no stated
floor for the regress**, and the packet is right that one is needed, because the record shows second readers
being wrong at a rate that is not small:

- `journal/2026-08-11.md:90-93` — six adversarial verifier groups, **45/45 CONFIRMED over a set ~18% wrong**.
- `journal/2026-08-16.md` — the scorer (Around) called a *different substrate* for fable-5; the chair's
  30-second recount that contradicted Around **was itself the defective instrument**.
- `librarian/LEDGER.md` (dispatch-gate row) — B's **93.4%** passed through a collation and a return leg and
  was **never re-derivable**; the real figure was 123/136 = 90.4%, found by A two laps later.
- This file's §1.2 — ALPHA's re-derivation of the 19's window, itself a second read of the librarian's
  figure, is wrong by two entries.

**The floor, proposed:** the reader is not reviewed; the reader is **measured**. One level of PREREAD, and
the reader's errors land in the same WRONG column as the author's, attributed to the reader's mount. That is
what makes F1b and F2 scoreable without a third seat: a reviewed deliverable that draws WRONG is a datum
against *both* the author and the reader, and the reader's per-read error rate is derivable from the ledger
the same way the author's is. Two mechanical supports: **rotation** (no seat reads the same author's
deliverables on consecutive laps — the CRM known failure is trust that accumulates) and **commands in the
receipt** (§5), so the reader's work is *checkable by anyone later* rather than *checked by someone now*.
State this in the registration as the regress floor; otherwise the first null will be answered with a second
reader, which is ALPHA's own degeneration marker.

---

## §5 · Probe 5 — the receipt is gameable as regex'd

`^reviewed <sha7+> · (\d+) changes`, posted by a mount ≠ the author's. Three holes, each one clause:

1. **The dispatcher can be the reader.** The rule excludes the *author's* mount. For a librarian map the
   author is the librarian; the chair is a different mount and may post the receipt — and the chair is the
   party dispatching, the party that skipped the librarian's map tonight, and the party with the stake. The
   receipt must come from a mount that is **neither the author's nor the dispatcher's.**
2. **`N changes` with no command is a nod.** ALPHA §6.3 says the receipt *must* carry the commands run "or
   it is a nod" — but §3.2's regex accepts a bare `reviewed <sha> · 0 changes`. N=0 from a rubber stamp and
   N=0 from a clean deliverable are byte-identical; the *commands* are the only thing that separates them
   from outside, the same way `sourced` separates a checked claim from an unchecked one. **Make the format
   `reviewed <sha> · N changes · ran: <cmd>[; <cmd>…]` and have the gate reject a receipt with no `ran:`.**
   A reader that ran nothing has not read; a reader that ran something has left a trail F1b can audit.
3. **No time-ordering.** The board is replayed on relaunch (132,446 of Main's 139,511 rows are replays;
   receipts from other mounts replay too). A receipt must satisfy `commit_ts < receipt_ts < dispatch_ts`
   (or, for path-cited uncommitted files, `file_mtime < receipt_ts < dispatch_ts` with the content hash
   matching) — otherwise yesterday's receipt for the same sha opens today's gate.

F1b catches rubber stamps **after** they cost something. Holes 1–3 make some of them impossible before.

---

## §6 · Amendments the registration needs before build — and the cost datum it asked for

1. **F2 restated per deliverable** (WRONG per reviewed deliverable vs WRONG per unreviewed deliverable),
   window **L015–L018** (not L019), baseline count **17** in-window / **19** on the day, findable fraction
   armed on a *named* rule — strict 11 or reading 18 — with the 19 labels in §1.3 as the arming set (a
   second non-author may relabel; the commands are printed).
2. **Trigger keys on the DELIVERABLE, not on the first sha in the text:** any path in the dispatch matching
   the two classes, committed or not; receipt matches by path + content hash when there is no commit.
   Without this the gate checks the wrong object on every uncommitted-registration attack (both tonight's)
   and cannot fire at all on the 23% of recent dispatches that carry no sha.
3. **Receipt = `reviewed <sha|path@hash> · N changes · ran: …`**, from a mount that is neither author nor
   dispatcher, with `commit/mtime < receipt < dispatch` enforced by the gate.
4. **The regress floor stated:** one level; readers measured in the WRONG column by mount; rotation across
   consecutive laps; no second reader added after a null.

**Cost datum (ALPHA §5 could not print it; the board can):** BRAVO's non-author read of ALPHA's 27 KB battery
registration — dispatched `2026-08-31T08:04:10Z`, hand-back posted `08:13:24Z` — **9 min 14 s** dispatch to
receipt, one seat. At ~1.3 registrations + ~2 librarian legs per lap that is ~30 seat-minutes per lap, with
the reader idle in between. (`node exo_memory/loop/retriever_label_window.js "*" 2026-08-31T08:00:00Z
2026-08-31T08:20:00Z "PACKET B|hand-back"`.)

---

## §7 · Probes that failed, kept at their strength

- **Verbatim** — holds (§1.1).
- **Can it lose** — holds, conditional on F2's unit (§3).
- **"Adds a hop"** — ALPHA's structural answer holds; the bypass precondition is named honestly and is not
  ALPHA's to decide; the ≤40% prediction can be wrong.
- **The outside evidence** — ALPHA already prices it down correctly (§1.4: secondary summaries; the transfer
  table's *"ceiling lower than a human co-pilot's"*; 45/45). I found nothing to add against it; the research
  file's *"none in-stream"* is one seat's column and ALPHA says so.
- **The ~46** — ALPHA's correction (lifetime counter of one column, not room-wide catches) is right.

---

## §8 · What this attack does not establish, and my own corrections

- It does not establish that PREREAD-GATE will move the WRONG rate. Nothing has been built or run.
- The per-deliverable baseline in §1.3 is a **shape with commands**, not a frozen figure — the deliverable
  rule (which headings count) is mine and moves the denominator.
- My 19 labels are one non-author's; the rule for "partial" is a judgement and a second labeller may move
  two or three rows between the strict and reading columns. The band [11, 18] is robust to that; the point
  is that the registration must pick the rule.
- **Not verified:** whether `findCitation` extracts the same path string the receipt would carry (the ledger
  shows `cited: path`, not the path itself); whether any receipt-by-content-hash scheme survives a file that
  is edited between receipt and dispatch — it should *fail closed on that*, which is the opposite of the
  gate's fail-open rule and needs a stated exception.
- **Self-caught while writing, and the first version of the catch was itself wrong:** I first wrote "every
  attack packet tonight cited a path" from memory of my own packet. The ledger says the opposite — the
  08:04:09Z and 08:22:14Z dispatch rows are `cited: sha`, because both packets cite *other* commits as
  context. That is the worse case (§2: the gate keys on a sha that is not the deliverable) and the file was
  corrected to it before hashing. The 11 `cited: path` rows since 08-30 are real and are a second, separate
  gap; the attack packets are not among them.

*Pane E, 2026-08-31 ~02:55 −06:00. One file, uncommitted, nothing pushed. ALPHA's registration untouched;
corrections carried by the chair. A trace to re-run, not a doctrine to believe.*
