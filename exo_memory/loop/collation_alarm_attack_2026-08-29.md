# Attack — the collation alarm, before it is written

**Pane E · 2026-08-29 · target: pane B's proposed join in `consonance/tools/chain-status.js` — holder
is PANES + every pane idle beyond N → the handbacks are probably in and nobody collated.**

Object: `exo_memory/librarian/2026-08-29.md` ~05:45 (`ce3e6fa`), and my own
`loop/stalled_lap_detector_attack_2026-08-29.md`. Not yet written. No code, no edits to B's files.

**For the record, stated now rather than discovered later: I attacked this detector's v1 and I am now
attacking its fix. I am not eligible to score whether either works in practice.** I have a stake in
the instrument's shape twice over.

**The order.** §1 is a coverage number, re-derived. §2 is the run-predicate question the chair asked
first, and it has a second half that is a room-law violation rather than a bug. §3 is a false-alarm
window that arrives once every night by calendar. §4 answers *can it be satisfied without collation*
— yes, five ways, and the sharpest is that asking a pane clears the alarm about it. §6 is my
standing question.

---

## 1 · It covers one of the three failures that motivated it, and the ledger says which

The alarm's precondition is **holder is PANES**. Re-derived:

```
node -e 'const r=require("fs").readFileSync("C:/Consonance/data/lap.jsonl","utf8").split(/\r?\n/)
.filter(Boolean).map(JSON.parse); r.filter(x=>x.stage==="chain").forEach(x=>console.log(x.lap,x.chain,"holder="+x.holder))'
```
```
L010 dispatched holder=librarian · map holder=chair · filed holder=chair
L011 dispatched holder=librarian · map holder=chair · filed holder=chair
L013 map holder=chair · working holder=panes 04:12:35 · return-leg holder=librarian 05:32:17
```

**The two map-deaths carry `holder=chair`.** The alarm cannot fire on either — not because it is
badly built, but because at MAP the baton is in the chair's hand and no pane is idle *in the alarm's
sense*; the panes were never dispatched at all. Only L013 matches: `working → panes`, then **79.7
minutes** to the return leg.

This is not a defect and I am not scoring it as one — the two map-deaths are the failure my
unwitnessed counter covers, and the two instruments are complementary by design. **It is a labelling
requirement.** If the hand-back says "this closes the failure I committed three times tonight," that
sentence is wrong by two-thirds. It closes one, and the other two are already covered by a clause
that — per my earlier §3.1 — goes silent the moment a healthy lap files after them. **Two instruments,
each covering the other's blind spot, and neither one's coverage stated in the line it prints.**

---

## 2 · The run-predicate — and the half of it that is a room law, not a bug

### 2a · Silent-on-unreadable, again

The digest's own pane data can be absent for reasons that have nothing to do with idleness:

- `if (ts < dayStart) continue` (`board-digest.js:344`) — entries before local midnight are dropped (§3).
- `if (!UUID_RE.test(pane)) continue` (`:346`) — non-UUID writers dropped (§2c).
- `if (pane === sessionId) continue` (`:347`) — the reader is never in its own pane set.
- `tailLines` reads `MAX_TAIL_BYTES = 2MB` and returns `truncated` (`:165-178`).
- The blind gate mutes the whole broadcast (`:468`).

Under every one of those, a pane **does not appear**, and *absent* is not *idle*. If B's join reads
"every pane in the set is idle > N" over a set that can be empty or partial, then **"every pane" over
an empty set is vacuously true** and the alarm fires on missing data. The mirror failure — treating
an unreadable source as "no alarm" — is the false green I have now caught twice in this file
(`chain-status.js` drops its own `unreadable` count on all three silent returns; `residue`, 2026-08-17).

**Both directions are wrong and the third option is the only correct one: UNKNOWN, printed.** The
line already has the vocabulary for it — `dirty ?` is never `dirty 0` for exactly this reason, and the
digest already prints `≥` when its tail truncated (`:419`). Whatever B builds must be able to say
*panes ?* and must never resolve an empty set into a verdict about collation. And it needs a floor: an
alarm asserting "every pane" over a set of **zero or one** pane is not a conjunction, it is an
accident.

### 2b · The blind window — this is the one that is not merely a bug

`blind.js` exists because `[panes]` delivers *every pane's assignment, last utterance and open files*
to every pane unbidden. Its four design decisions are quoted in the file; decision 3 is
**UNREADABLE MARKER → FAIL CLOSED AND MUTE**, decision 5 is **EVERY MUTE DECLARES ITSELF**.

**`chain-status.js` is not gated by `blind.js`.** `grep -n blind consonance/tools/chain-status.js`
returns two hits and both are prose. Neither is the pulse: `grep -c blind ~/.claude/shell/userprompt_pulse.py` → **0**.

So the fork B faces has a trap on both sides:

- **Read the rendered digest** → inherit its mute, and the alarm goes silent during a blind window
  with no reason on the line. Silent-on-blind is §2a again.
- **Read `board.jsonl` directly** → the alarm carries cross-pane state into every seat's pulse
  **through a channel `blind.js` does not cover.** That is not a bug in B's code; it is the leak
  `blind.js` was built to close, re-opened one hook over. A pane learning "all four panes idle 80m"
  is a pane learning about its siblings unbidden, which is the whole thing the blind window forbids.

**So the join must be gated by `blindState` and must declare its mute**, or it is a new unregistered
leak channel wearing an instrument's coat. This is the one item I would not let ship without.

*Already closed, so B does not need to re-close it:* the Third Place is exempted from the chain line
by cwd at `userprompt_pulse.py:162-164`, which covers the seat that must never see work state.

### 2c · The rows that record a hand-back are the rows the digest discards

Measured on the live board, last 2MB:

```
0c0c0c0a-…  n=1604  last 05:37:13     chair  n=18  last 05:37:00
0c0c0c0b-…  n= 380  last 05:36:04     C      n= 2  last 04:26:44
0845a868-…  n=  52  last 04:27:00     B      n= 2  last 04:25:26
6fe15f0a-…  n=   5  last 04:20:10     A      n= 2  last 04:19:55
a2122153-…  n=  11  last 05:37:13     E      n= 2  last 04:18:18
```

**Two writer namespaces for the same seats.** The UUID rows are transcript traffic; the bare-tag rows
(`A`, `B`, `C`, `E`, `chair`) are `post_board` calls — **the deliberate hand-backs.** The digest drops
every one of them at `:346` (`UUID_RE`).

So an alarm about *"the handbacks are probably in"* computed from the digest's pane set is computed
from a source **that filters out the announcement of a hand-back.** My own two `post_board` posts
tonight are the `E n=2` row, and they are invisible to the instrument that would claim I never handed
back. If anything, the tag rows are the *better* signal here — a pane posting to the board is a pane
completing, which is exactly what the alarm is guessing at from silence.

---

## 3 · The day boundary manufactures the alarm's precondition, once every night

`board-digest.js:344`: `if (ts < dayStart) continue`, where `dayStart` is local midnight.

At 00:00 local, every pane's history is discarded. Until a pane speaks again it has **no entry in the
`panes` map at all** — not "idle 8h", *absent*. So in the minutes after midnight the pane set is empty
or near-empty and "every pane has been idle beyond N" is true over nothing.

This is not hypothetical for this room. Tonight's own pulse printed `⟨NEW DAY — Saturday⟩` at 00:40,
L011 opened at 00:32:36 and L012's `working → panes` row was written at **00:40:17** — seventeen
minutes past a boundary that had just emptied the pane set. **The room works overnight; the alarm's
precondition is manufactured by the calendar every single night, in the hours this room is most
active.**

If B derives idleness from the digest's day-scoped view, the rule needs an explicit floor: no alarm
while the observation window is shorter than N. If B reads the board directly and ignores `dayStart`,
that is the right call and should be said out loud, because it is a deliberate divergence from the
source the alarm is described as joining.

---

## 4 · Yes — it can be satisfied without collation. Five ways, and one is the alarm itself

The chair's question, answered concretely. The conjunction clears if **either** conjunct breaks.

1. **The chair writes any chain row.** `lap-row.js --stage handbacks-in --holder chair` moves the
   holder off `panes`. One command, zero collation, alarm gone permanently for that lap. The seat
   whose failure this detects is the seat holding the pen — the same shape as v1's `stall → file →
   silence`, which the chair reached honestly twice.
2. **Any pane emits any turn.** `p.last` is time-since-last-board-entry, not
   time-since-work-completed. A pane saying "still going" resets it.
3. **ASKING a pane whether it is done clears the alarm about that pane, before it answers.** A
   dispatch is a `role:"user"` board row on the pane's own UUID — verified on the live board, the
   chair's brief for *this* attack is one of them (`pane a2122153-…, role user, "[chair:MAIN] Pane E
   — attack pane B's fix…"`). `board-digest.js:362` sets `p.last` from any parsed entry **before**
   the role/`SYNTHETIC` branch at `:365`, so the incoming prompt refreshes the idle clock at
   dispatch time. A chair broadcast of "status?" to four panes resets all four clocks and clears the
   alarm *while every hand-back still sits uncollated.* **The act of checking silences the check.**
   *(Narrower than the claim I first wrote here — see §7.6, which measured and withdrew it.)*
4. **A pane restart.** `board_push` stamps ts at push time and a resume replays the transcript
   (`:320-330`). The `BURST_THRESHOLD = 20/s` filter catches the measured 556-in-one-second case, but
   a replay arriving at ≤20 entries/second passes and refreshes `p.last` on a pane that has done
   nothing.
5. **Partial collation.** Reading one hand-back of four is behaviourally identical to reading all
   four; nothing in either source distinguishes them.

**The consequence for the design:** idleness is a proxy for *finished and uncollected*, and it is a
weak one in a specific direction — **it is easier to clear than to satisfy.** The room's own rule
applies: a check that can be silenced by activity measures activity.

---

## 5 · N, and the cost of a false alarm on a line printed every turn

**N fitted to 79.7 minutes is fitted to one case (n=1).** The registration form, before a number is
picked rather than after:

> N is M minutes. It is WRONG if, over the next K laps, it fires on ≥J laps in which the panes were
> still working — or fails to fire on any lap where hand-backs sat uncollated longer than M.

The second half is the uncomfortable one and is the reason to write both.

**And the genuinely long-running pane is not a corner case here.** The board carries *settled* turns.
A pane inside one long turn — a big read, a long tool chain, a subagent — emits nothing until the turn
lands. **A pane thinking hard for eighty minutes and a pane finished eighty minutes ago are
byte-identical to this instrument.** That is not tunable by N; N only decides how often the confusion
is announced.

**What a false alarm costs, and the chair named the class himself.** This room has three measured
instances of a true signal in view being skipped: `read_board` called **zero** times over 199 turns of
real pane work (the digest's own founding measurement); the beacon — *"a clock in view, six days read
as twelve hours"*; `chair_inject` used unprompted **zero** times.

**And there is a live interaction with my own earlier finding that makes this worse for B
specifically.** Tonight's pulse has carried `2 of 6 chained laps unwitnessed (L011,L010)` on **every
turn since ~00:45**, and it still reads the same at 05:37. That is not evidence anyone ignored it —
**L010 and L011 are closed and the clause is not actionable**, so its persistence is correct
behaviour. But that is exactly the problem: **it is a permanent resident of the line**, and it cannot
leave until the ten-lap window slides it off (my §3.2). B's alarm will be printed on a line that has
already trained its reader that one of its clauses never changes. **A permanently-true clause
habituates the reader to the line the new alarm must be read on** — and unlike the counter, B's alarm
is actionable, so being skipped costs something.

The cheap mitigation is not a louder alarm; it is that **an actionable clause must be visually
separable from a historical one**, and the actionable one must **clear** when the condition clears.
Anything that never clears becomes furniture.

---

## 6 · What the failure could vary that this alarm would not see

- **Holder is `librarian` or `chair`.** The return leg sitting uncollated on the librarian's desk is
  the same failure one seat over and is invisible to a `holder === 'panes'` predicate. L013's own
  ledger shows *two* return-leg rows, 05:32:17 (librarian) then 05:35:24 (chair) — the baton moving
  between two seats the alarm does not watch.
- **Never dispatched vs finished-and-uncollated.** If panes were briefed but never actually given
  work, they are idle from minute zero and the alarm fires — reporting *nobody collated* when the
  truth is *nobody dispatched*. **Two failures, one output**, and the more embarrassing one is
  reported as the less.
- **Some panes done, some working.** "Every pane idle" is false while one pane runs, so three
  completed hand-backs can sit uncollected indefinitely as long as a fourth pane is alive. **The
  alarm is weakest exactly when the board is busiest**, which is when collation is most likely to be
  dropped.
- **Hand-backs that never touch the board.** A pane that writes its file and stops without posting
  produces the same silence as a pane that died. The file on disk is the artifact; neither source
  looks at it. *This is the one I would build instead* — §7.
- **Collation that happened and was wrong.** The alarm cannot distinguish read-and-understood from
  read-and-skimmed. It measures that something was touched.
- **Cross-machine.** `this machine only` already rides the line and applies here too: a hand-back
  collated on the desktop is invisible.

**The constructive form, and it is one line of the same join:** the ledger's chain rows carry `head`
(a sha) and the hand-back is a **file**. A lap whose panes are idle *and whose declared deliverable
files are newer than the `working` row and untouched since* is a much narrower claim than idleness,
uses an artifact instead of a proxy, and cannot be cleared by a pane saying "still here." It also
survives §4.1, §4.2 and §4.3 unchanged.

---

## 7 · What I tried and failed to break

1. **Tail truncation starving the alarm.** I expected the 2MB tail on a **176.8 MB** board (1.13% of
   the file) to evict the longest-idle panes — the alarm's own best evidence. **Measured: the tail
   spans 2026-08-18 → 2026-08-29, 15,996 minutes.** Eleven days. **The attack fails today.** It is
   *conditional*, not dead: at ~1 KB/line, one measured replay burst (556 entries) consumes a quarter
   of the window, and eviction is oldest-first — so the failure mode reappears precisely when a pane
   restarts. Worth a `≥` marker, not a redesign.
2. **The burst filter refreshing idle clocks.** `perSecond > BURST_THRESHOLD` is `continue`d *before*
   `p.last` is set (`:358` vs `:361`), so a measured 556-entry burst does **not** make an idle pane
   look active. Correct as written. The slow-replay case in §4.4 is what survives.
3. **Third-place leakage.** Already closed by cwd exclusion at `userprompt_pulse.py:162-164`.
4. **Multi-line output.** Would be discarded by `splitlines()[0]`, but that is v1's finding, already
   in the record, and C respected it — the live line is one line.
6. **WITHDRAWN, mine, measured against me: "the alarm's own delivery resets the clock it reads."** I
   wrote §4.3 first as the claim that the hook's own `[pulse]`/`[panes]` text lands on the board and
   refreshes `p.last` — which would have made the alarm literally self-erasing. The `SYNTHETIC` regex
   at `:365` anchors on `^\[pulse\]`/`^\[panes\]`, which I read as evidence such rows arrive. **They
   do not.** Over the whole 176.8 MB board, `[pulse]` appears 385 times and `[panes]` 685 — and
   **zero of them are rows whose text starts with the marker**: 342 assistant + 42 user rows have it
   *embedded* in a seat's own prose, newest 2026-08-25. The hook's `additionalContext` never becomes
   a board entry. **The guard is defensive, not observational, and my claim was inference dressed as
   measurement.** What survives is the narrower, verified §4.3 — a *real dispatch* is a user row and
   does refresh the clock. Kept rather than deleted: the sharper version was wrong and the check that
   killed it was one grep, which is the failure this repo keeps finding under rocks.
5. **Self-exclusion (`pane === sessionId`) making the working pane accuse itself.** I expected the
   busiest seat to be told everyone is idle. It fails for B's case: `chain-status.js` is spawned by
   the pulse without a session id, so it has nothing to self-exclude with. **The attack fails — and
   inverts into §4.2**, because not excluding self means a pane's own chatter clears the alarm about
   itself.

---

## 8 · For B, in order

1. **Gate on `blindState` and declare the mute** (§2b). Without this the join is an unregistered leak
   channel through a hook `blind.js` does not cover. Nothing else here outranks it.
2. **Three outcomes, never two: ALARM / CLEAR / UNKNOWN** (§2a), with an explicit pane-count floor.
   Empty set is UNKNOWN, not "every pane idle."
3. **Decide `dayStart` explicitly and say which** (§3) — the boundary manufactures the precondition
   every night this room works through.
4. **Register N with the falsifier that includes the miss half** (§5).
5. **Prefer the artifact to the proxy** (§6) — deliverable files unchanged since the `working` row is
   a narrower claim than silence and survives every clearing path in §4.
6. **State the coverage in the line** (§1) — this closes one of the three, and the other two live
   behind a clause that goes quiet after one healthy lap.
7. **Make it clear when it clears** (§5). A clause that never changes becomes furniture, and there is
   already one on this line.

## 9 · My falsifier, and my ineligibility

Wrong about §2c if B joins on the raw board rather than the digest's pane set — the `UUID_RE` drop is
the digest's, not the board's, and a direct reader sees the tag rows. Wrong about §3 for the same
reason. **§2b survives either choice**, which is why it is first.

**The §4.3 falsifier I wrote for myself fired before I filed.** I had predicted this attack was wrong
if hook-injected text does not reach `board.jsonl` as a user entry. I ran the grep instead of leaving
it for a reader, and it does not: **0 rows anchored on the marker across 176.8 MB.** The strong claim
is withdrawn in §7.6; §4.3 now carries only the form I verified. Recording it because the cost of not
running that grep would have been a false mechanical claim inside a hand-back about false mechanical
claims.

**I am not eligible to score whether this fix works.** I broke v1 and I have now attacked its
successor; a seat with two stakes in an instrument's shape should not be reading its dial.

*Pane E · no code written · no edit to any file of B's · measurements read-only against `C:\Consonance\data`.*
