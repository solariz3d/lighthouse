# The sequence, at the keeper's word — "do it all in the correct sequence you see fit"

Librarian (the lineage, on L), 2026-09-20 02:3x. He is out on shift, the laptop is on, the instruction is to keep
going. Every position below has a reason; the reasons are the point, not the order.

## THE ONE THING I AM DELIBERATELY NOT RUNNING WHILE HE IS AWAY

Tonight produced three defects in the loop's own delivery machinery. My first instinct was to fix all three
first, because every later lap runs through them. **That is wrong for two of them, and the reason is the thing
itself: you do not rebuild the delivery gate while queueing three laps through the delivery gate, with the keeper
out of the room.** If it breaks, it breaks the channel that would tell anyone it broke.

Split by blast radius:

| defect | where it lives | risk | when |
|---|---|---|---|
| **digest stale at ring time** — the pane computes a sha, keeps writing, then rings | tooling, pane-side | **low**, touches no gate | **rides L061 now** |
| **handbacks-in silences a pane** — the stage that says all hands are in refuses the hand that is not | the one-station gate | medium | **designed now, run when he is back** |
| **a cancellation cannot overtake the message it cancels** | the delivery queue | **high** — it is the queue every dispatch uses | **designed now, run when he is back** |

So the two gate changes get **written up as a lap that is one dispatch when he returns**, with the board evidence
already gathered (Part Three §16 of `loop/l060_order_parameter_review_2026-09-20.md` has the timestamps). Nothing
about them is lost by waiting; something could be lost by not.

## THE ORDER, AND WHY EACH SITS WHERE IT DOES

**L061 · C3 CLOSED — the guard, the true Vicsek φ, and the digest repair.** First because it is live, ruled, and
safe. Three packets on disjoint files:
- **The shuffle-refusal guard** the chair ruled YES on. **To a NON-AUTHOR of the instrument** — C wrote
  `order-parameter.js`, its 20 tests and its 15 mutants, and a guard written by the seat whose verdict it
  constrains has no independent reader.
- **True Vicsek φ per session** against its 1/√N null, per the C3 ruling
  (`loop/c3_ruling_order_parameter_2026-09-20.md`), with the prediction and falsifier already registered there
  before any board number exists.
- **The digest repair:** the ring computes the hand-back's sha at ring time, or refuses. Tonight it was wrong on
  C's second ring and right on its first, and a digest that is sometimes right is worse than none.

**L062 · C2, Vendi over hand-backs.** Second because it is the next unbuilt instrument on the Third Place's own
ranking, it reuses T1's committed encoder exactly as C3 did, and its unit is already fixed by item A9 —
**within-brief, never pooled across briefs.** The room now has three briefs with three-and-more hand-backs on one
day (L058, L059, L060), which is the first time it has had a within-brief set worth running it on.

**L063 · C4, the critique-ratio judge.** Last of the four, and last on purpose: **the source file itself says the
judge shares the weights it scores, so trust the trend and not the level.** Running the weakest instrument last
means the three stronger ones are on disk to read it against.

**Standing, not a lap: D057.** Open since 2026-09-10 with a single `open` row and no map. It files or it is marked
abandoned; it should not keep counting as open. Named for the chair, not built into the sequence.

## WHAT EVERY LAP BELOW CARRIES, FROM TONIGHT

1. **Register the null beside the falsifier.** C's §10: *a falsifier aimed at the wrong failure mode passes a
   broken instrument.* No registration in this sequence is complete without stating what the instrument returns
   on structureless input.
2. **The mtime, not the ring.** A hand-back is collatable when its file has been still for minutes, not when the
   pane rang. Read it twice, seconds apart.
3. **The universe printed first**, with the board's row count at that read, and no figure mixed across two reads.
4. **Member lists, never bare counts.**
5. **Non-author reads** — no seat audits the instrument it wrote.

---

## AMENDED 02:5x — A LAP JUMPS THE QUEUE, AND IT IS ABOUT WHETHER THIS SEAT WAKES

**L062 is no longer C2 Vendi. L062 is the librarian intake cap**, and everything below it shifts one place.

`shelf_tests::the_librarian_intake_fits_under_the_limit_it_must_obey` is **RED**: 154,087 bytes against a 150,000
limit, *"the seat cannot open."* Found by A while running the full suite for an unrelated packet, verified by A at
HEAD with its own change absent, and re-run by me. **The floor alone — head 84,924 + index 69,163 — is 102.7% of
the cap, and the bodies got zero bytes.** It is not the seat's notes; they are already fully excluded.

**The fix is ruled** (the test's own comment makes it this seat's call): window the `loop/` index by date, as the
notes tier is already windowed. loop/ is 416 files and ~55,160 bytes, about 80% of the whole index. A window at
>= 2026-08-30 drops 75 files, roughly 9,900 bytes, against a breach of 4,087 — the gentlest option clears it with
better than double headroom, and the test prints its margin every run so the next append cannot silently re-break
it.

**Why it jumps the queue:** every instrument below it is built by panes and read by this seat, and a seat that
cannot open reads nothing. It is also getting worse on its own — each new file anywhere in `exo_memory/` adds an
index line whether or not it is ever opened.

**Standing until it lands:** this seat creates no new files under `exo_memory/`. Tonight's work appends to files
that already exist.

---

## L062 — THE PACKET: give the INDEX tier a budget, the way the CARRY tier already has one

**The tier table** (`main.rs:7263-7268`): CARRY is `cards · "" · record · memory · librarian · spread ·
research`; INDEX is `map · journal · loop`, and **`loop` is already `newest_first: true`.** So the ordering the
window needs exists; what is missing is a **cap on how many index lines `loop/` may spend.**

**Measured now:** floor = head 84,924 + index 69,163 = **154,088** against a 150,000 cap, bodies 0.
Indexed record = map 17 + journal 34 + **loop 416** files; `loop/` is ~80% of the index by bytes (~55,160 of
69,163, at a measured ~132 bytes a line).

**The fix, and it is the notes window one tier down.** Not a date cutoff — a date goes stale and needs re-tuning.
**A byte budget for the index tier**, spent newest-first, with the remainder collapsed to ONE line naming what was
dropped and the command that recovers it. Self-limiting forever.

**The number is the PANE'S to choose, not mine, and the reason is a conflict of interest worth stating:** the seat
that reads the index benefits from a bigger index. So the packet fixes the *requirement* and not the value —
choose the budget so the test's printed **margin is at least 15% of the cap**, and put it beside
`LIBRARIAN_INTAKE_LIMIT` as a named constant with the measurement in its comment.

**What the header must say, because this exact code has been wrong here before.** `corpus_shelf_at` already
distinguishes three reasons a path is absent — tier, budget, and excluded-by-name — and reports each. **A fourth
now exists** and needs its own counter: *indexed-tier entries dropped by the index window.* The 2026-09-01 bug in
this function (`9c6a131`) was that the header branched on what the rule WOULD carry rather than on what the budget
DELIVERED, so it printed a window that did not happen. **Report the delivered set.**

**Acceptance:**
1. `shelf_tests::the_librarian_intake_fits_under_the_limit_it_must_obey` green, with the printed margin ≥ 15% of
   the cap.
2. A test that the collapsed line names the **count**, the **date range** and the **`ls` that recovers them** —
   all three, each its own assertion. *(E's rule from L061: a refusal's two halves need two assertions.)*
3. A test that the window is newest-first: the newest `loop/` file is always present by path.
4. A test that the header's new counter reports the DELIVERED drop, not the rule's — the 09-01 shape, pinned.
5. Mutants on the window and on the header counter, not only on the arithmetic.

**Not in scope:** raising the limit (the assertion text forbids it), touching the CARRY tier, and touching
`journal/` or `map/` — 34 and 17 files, together under 4,300 bytes, and not where the problem is.

**Non-author note:** this seat is the subject of the shelf, not its author. I have named the requirement and the
evidence; the value, the collapse wording and the code are the pane's.

---

## L065 — THE TWO DELIVERY-GATE DEFECTS, HELD ALL NIGHT AND NOW OPENED WITH THE KEEPER PRESENT

Held since 02:3x on purpose: *you do not rebuild the delivery gate while queueing laps through it with nobody
in the room.* The keeper is at the desk, five laps have landed, and the board evidence was gathered at the time.

### D1 · A CANCELLATION CANNOT OVERTAKE THE MESSAGE IT CANCELS

**At source:** `main.rs:9494` `gate_or_queue` pushes to `Inbox` when the pane is not ready, and delivery is FIFO
by queue depth. So a cancellation queued behind its own target can never arrive first.

**Measured, from `board.jsonl`, tonight:**

| time (Z) | event |
|---|---|
| 08:07:32 | chair QUEUES the re-run dispatch to C · `(1 waiting, stamp=working)` |
| 08:09:35 | chair QUEUES the cancellation · `(2 waiting, stamp=working)` |
| **08:13:37** | the dispatch is **DELIVERED** — cancelled 4m 02s earlier |
| **08:16:17** | the cancellation is **DELIVERED**, 2m 40s behind the thing it cancels |

C answered a packet the chair had already withdrawn. Its §17 exists only because of that.

**The fix is NOT specified here** — it is the pane's, and the shape is a real design question (a withdraw verb, a
supersede flag on a queued entry, or a chair-side mark read at drain time). **Two constraints that are not
negotiable:**

1. **A withdrawn message must leave a trace.** This room's law is *mark the carriers, leave the traces*, and
   D077's row family exists because *the attempt, kept* matters. A cancellation that silently vaporises a queued
   packet with no board row is worse than the defect it fixes.
2. **This is the queue every dispatch uses.** Nothing may make it possible to drop a message that was never
   withdrawn.

### D2 · THE OUT-OF-TURN REFUSAL WITH THE BATON AT THE LIBRARIAN — and READ THE PROOF FIRST

**Do not propose a pre-condition gate. `mcp.rs:88-101` proves it cannot work**, and the proof is good: at the
instant of the call, the correct fan-out and the trap are **the same ledger state**, so no pre-condition can
separate them; and requiring a `--holder panes` row to precede the inject inverts `lap-row.js`'s ring gate and
**deadlocks in exactly the state it exists to catch**, firing that tool's registered falsifier.

The room already moved enforcement to the first discriminable moment — the pane's refused hand-back — with the
RUNG / OWED marks, read against the baton's last move so they clear themselves when the recovery row lands
(`mcp.rs:102-120`, `owed_refusal_text`, `handback_refusal_text`).

**THE QUESTION THIS PACKET ASKS, and it is narrow:** that machinery was built for **holder == chair** (L050,
2026-09-09, a 29-minute stall). **Tonight's case had holder == LIBRARIAN.** At 08:16 the librarian recorded
`--stage L062 handbacks-in --holder librarian`; at 08:17:26 the board shows
`call_librarian REFUSED OUT OF TURN — mount C tried to speak while NO open lap is held by panes`, with C still
appending to an unfiled hand-back. C posted a board line instead of ringing.

1. **Does the mark machinery fire at all when the holder is the librarian rather than the chair?** Determine it
   from the code and from tonight's rows, not from the shape of the design.
2. **If it fires, is the recovery it prints correct?** `owed_refusal_text` emits `move_baton_cmd(lap, "chair")`.
   When the librarian holds the baton because every hand-back is in, "move it to chair" may not be the right
   move — and a refusal that prints a wrong recovery is worse than one that prints none.
3. **The deeper question, stated but not for this packet to settle:** the `handbacks-in` stage asserts every hand
   is in. A pane still appending is the one case where that assertion is false, and the stage resolves it by
   making the pane unable to say so. Name whether the marks already cover it before anyone designs anything.

### WHAT BOTH PACKETS CARRY

Tonight's two discipline items — **register the null beside the falsifier**, and **check the quantity can take
more than one value on this object** — plus: **red first**, mutants on the new behaviour and not only its
arithmetic, and the suite green **plain AND serial** (L061's race was invisible under `--test-threads=1`).
