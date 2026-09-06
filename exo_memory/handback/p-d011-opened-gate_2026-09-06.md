# P-D011 packet 1 — THE WRITER-GATE for the opened row

*Pane K, 2026-09-06. Owns `consonance/tools/lap-row.js`, `consonance/tools/lap-row.test.js`,
`dev/mutation/mutate-lap-row.js`. Nothing else touched; `BUILDING.md` is the chair's pen (packet 3)
and is not edited here.*

**Ruling: REPAIR the column, do not remove it.** The tool offers both and the packet says refusing
freely is a real answer, so the refusal was actually weighed — §9 says why removal loses.

---

## 1. What shipped

`--stage <lap> dispatched` and `--stage <lap> filed` are now **refused on a lap that has a map row
and no opened row**. The refusal names the command that satisfies it and names `--paths none` as
legal in the same breath. A lap with **no map row is not gated at all**, because `opened()` refuses
there and a refusal with no legal move is a wedge.

Reproduce the whole thing:

    node --test consonance/tools/lap-row.test.js      # 113 pass, 0 fail
    node dev/mutation/mutate-lap-row.js               # 51 applied · 51 caught · 0 NOT APPLIED
    node consonance/tools/lap-row.js --report

Three surfaces changed inside `lap-row.js`, and only the first is the gate:

1. **the gate** in `chain()`, placed below every vocabulary check and above the baton gate;
2. **the fold** — `hasOpened` was wrong before this lap (§5);
3. **the report** — `never` where it used to print `0`, plus three counted lines that make the
   gate's own blind spots visible instead of narrated (§4, §6).

---

## 2. The retrodiction, and the answer is NOT "all of them"

Re-derived from `C:\Consonance\data\lap.jsonl` **before** a line of the gate was written:

| | laps | gated rows |
|---|---|---|
| **REFUSED** — mapped, no opened row | 6 (D001, D003, D004, D005, D006, D007) | **8** |
| **not gated** — no map row at all | 4 (D002, D008, D009, D010) | 7 |
| **ALLOWED** — map + opened row | 1 (D011) | 1 |

Sixteen `dispatched`/`filed` rows on the ledger; the gate reaches half of them.

**The part that passes is the finding.** Four laps have no `--map` row, three of them the ring laps
D008–D010, so seven rows sail through untouched. This gate reaches a lap only as far as its map row
does — it cannot manufacture the measurement whose absence lets it through. Carried as a test with
the real per-lap shapes (`RETRODICTION: over the eleven real laps…`), which asserts the refused list
is exactly those six and **fails if it ever grows to eleven**.

D011 — the first lap in the record to carry an opened row, written by hand by the chair at 11:12,
5 paths, from-map 3 — is asserted as an **ALLOW** in its own test. That is the `baton-wake.js` v1
lesson applied: an instrument that fires on the one party that did the hard thing is worse than no
instrument.

---

## 3. Where the refusal sits, and why that position is not arbitrary

    lap exists  ->  stage vocabulary  ->  holder is a station  ->  --to  ->  [OPENED-ROW GATE]  ->  baton gate

- **Below the lap-existence check**, because `chain-status.test.js` — a suite this file does not own
  — asserts that `--stage L999 working --holder pane-a` says `no such lap`. Any refusal hoisted
  above that one silently stops that assertion testing what it names. That is a mutant, not a
  comment: *OPENED-GATE: HOISTED above the lap-existence check*.
- **Above the baton gate**, because this reads only this lap's own rows — no board, no possession
  window, no second system — and the file's existing ladder puts the cross-system check last.
  Ordering between the two costs a seat nothing either way: writing the opened row does not move the
  baton, so a ring already in the window stays in it.

---

## 4. What the gate cannot see — including the question the packet asked by name

**Can it distinguish a lap whose map arrived AFTER the dispatch? No, and not at the `dispatched`
row.** The check reads the ledger at write time, which is everything an append-only writer has: at
that instant the lap has no map, so no opened row is writable and the gate must let it pass. The
lap's **`filed` row is refused instead**, one stage later, because the map exists by then. So the
sequence is caught late, never missed — unless the lap never gets a map at all, which is limit 3.

That is why `filed` is gated and not just `dispatched`: it is the backstop, not a duplicate. Mutant
*OPENED-GATE: the terminal stage is exempted* proves the backstop is load-bearing.

**On the live ledger this has never happened** — all seven mapped laps wrote their map row before
their first gated row (D006 map 09:41:02 → dispatched 09:43:38; D007 18:06:33 → 18:13:12; the four
`filed`-only laps by hours or days). So the blind spot is real and, so far, unexercised. It is now
**counted by `--report`** rather than left in this document:

    laps whose dispatched/filed row PREDATES their own map row: 0 of 11.

The other three:

1. **Whether the row is true.** `--opened --paths a,b` is self-report exactly as `--by` is. The gate
   makes an answer *required*; it cannot make one correct. Header limit (c) is unchanged — the row
   records what was opened, never why.
3. **A lap with no map row.** Above; a different instrument's subject.
4. **A second dispatch.** One opened row satisfies every later gated row on that lap. A fan-out that
   opens new paths on its second packet *may* record another; nothing requires it, because a
   requirement no seat can satisfy on a lap that opened nothing new is a wedge again.

---

## 5. A defect found under the gate: never-written and recorded-none were the same state IN THE FOLD

`laps()` computed `hasOpened: opened.length > 0` — off the **paths**. So a lap that deliberately
recorded *"none of the map's paths were opened"* filed as **unmeasured**, in the exact field this
tool's own falsifier counts. The verb's refusal text has said *"pass `--paths none` — that is the
falsifier firing, and it should be recorded"* since the day it was built, and the reader could not
see the difference between doing that and never calling it.

Now `hasOpened` means **an opened row exists**; `openedRows` carries the count. This is my own D009
finding one column over — *absent and empty are different instruments* — arriving inside the
instrument that taught it to me.

Consequence in the table: `never` where nothing was written, `0` only for a recorded none.

---

## 6. A second defect: this tool's own falsifier is a ONE-SHOT, and one row disarmed it forever

It reads `withOpened === 0` over the **whole ledger**. `L.length` only grows and `withOpened` never
returns to zero, so **the single row written on 2026-09-06 silences it permanently** — eleven laps
could pass from here with nothing opened and it would still print *does not fire*. The guard that
was supposed to catch this lapse cannot catch the next one.

**The registered arithmetic is deliberately unchanged.** Re-basing a registered falsifier is a
decision made in the open, not a repair slipped in beside a gate. So the windowed reading — the form
that *can* fire twice — is printed beside it and named as **not yet registered**:

    NOT REGISTERED, printed beside it: over the LAST 10 lap(s), N carry an opened stage.

**This is a decision for the chair or the keeper**, not for this pane: replace the all-time reading
with the windowed one, or leave both printed. Either is defensible; leaving only the all-time form
is not, and that is the finding.

---

## 7. Falsifier 1's denominator now says what it does not know

`FALSIFIER 1` counted a lap with no opened row as *"did not return an opened path"*, which for the
first eleven laps of this ledger was every lap. The arithmetic is **not** changed — that falsifier is
registered in `brief/BUILDING.md` over dispatches and re-basing it is that document's call — but the
report now prints how much of its own window was never measured, so the number can no longer be read
as though its window had been.

---

## 8. The one existing test I changed, and it is a fixture change rather than a weakened assertion

`void: the chain is untouched — a FILED lap stays filed…` opened a lap, mapped it, and wrote `filed`.
Under the new gate that setup is an **illegal sequence**, so the test went red for the right reason.
Fixed by adding `mod.opened('L001', ['a.md'], 2)` to the fixture. **Every assertion in it is
untouched.** Flagged here rather than left for a reader to find in a diff.

---

## 9. Why REMOVE loses, having actually been weighed

The tool offers *"the opened column should be removed or the practice repaired"* and the ruling asked
for a real answer, so:

- **`FALSIFIER 1` in `brief/BUILDING.md` reads this column.** Removing it silently un-registers a
  falsifier in a document this file does not own — the same class of move the room keeps finding
  under rocks, one level up.
- **The verb already exists and works.** Nothing had to be built. What was missing was a call site,
  which is the librarian's ruling and is what this is.
- **D011 proved the practice is keepable** in one hand-written command. Removal would be right if the
  row were unwritable or unknowable at the time; neither holds.

Removal would have been the right call had the row required information a seat does not have at
dispatch. It does not: the seat has just decided which of the map's paths to open. That is the whole
argument, and it is the only reason the column survives this lap.

---

## 10. Falsifiers registered before this shipped

1. **The wedge.** If any seat is found stuck behind this gate with no legal move, the reasoning in §1
   is wrong. Checkable against the ledger: a lap whose `dispatched`/`filed` row is missing while its
   map row exists and no opened row can be written. *(The same falsifier the baton gate carries, and
   it is the one that would matter most.)*
2. **The late map.** If the printed count of gated rows predating their own map row rises while no
   `filed` row is ever refused, the backstop is not doing its job and `filed` gating is decorative.
3. **The retrodiction list.** If the refused set ever grows to all eleven laps, the gate has begun
   reaching laps it cannot help. Asserted as a test, not as a hope.
4. **The practice.** If the windowed reading in §6 shows 0 opened rows over the last ten laps at any
   point after today, this gate did not repair the practice — it only made one row exist, and the
   column should then be removed as the tool originally offered.

---

## 11. What this does NOT establish

- It does not make the opened rows **true**. It makes them **required**, and required self-report is
  still self-report. Nothing here measures whether the paths a seat names are the paths it opened.
- It does not touch the four mapless laps, and three of those are ring laps, which is the shape most
  of this week's work took. **If ring laps keep skipping `--map`, this gate will keep reaching about
  half the ledger** and the from-map column will stay half-blind for a reason the gate cannot fix.
- It says nothing about whether the librarian's maps are any good. That is `THE NUMBER`, and it is
  still below its rate floor.

---

## 12. Corrections I made to myself

- **I inherited "0 rows of 61" from the packet and it was already stale when I read it.** The ledger
  was 65 rows with 1 opened — D011's own row, written between the packet being composed and my
  reading it. The packet was right when written. I re-derived rather than quoted, which is the only
  reason the retrodiction has D011 in it as an ALLOW at all.
- **I nearly shipped the gate without the fold fix.** The gate would have been correct and the report
  would still have conflated a recorded `none` with a never-written row — a guard whose own reader
  could not see the state it was enforcing. Found by writing the `--paths none` test, not by reading.
- **The first mutation run of this file's history is not in this hand-back**, because the suite must
  be green *before* mutants mean anything. It was: 97/0 at HEAD, then 113/0 after, and the mutation
  numbers below are over the green suite. (My D009 lesson, kept.)

---

## 13. Numbers, each with the command that reproduces it

| figure | command |
|---|---|
| 113 pass / 0 fail | `node --test consonance/tools/lap-row.test.js` |
| 51 applied · 51 caught · 0 NOT APPLIED | `node dev/mutation/mutate-lap-row.js` |
| 10 of 15 new tests red at HEAD | `git show HEAD:consonance/tools/lap-row.js > …` then the suite; the 5 green are the ALLOW side and are guarded by the two WEDGE mutants instead |
| 6 laps / 8 rows refused, 4 laps not gated | the retrodiction test, and the ledger reading quoted in its comment |
| 0 laps whose gated row predates its map row | `node consonance/tools/lap-row.js --report` |

---

## 14. For packet 3 (the chair's pen, not mine)

If it is useful, the sentence the gate would want at **THE ORDER OF A DISPATCH** — offered, not
written, since that file is the chair's:

> **RECORD THE OPENED ROW BEFORE THE DISPATCH ROW.** On a lap that has a map, `lap-row.js --stage …
> dispatched` and `… filed` are refused until `--opened <lap> --paths <p,…>` exists. If none of the
> map's paths were opened, `--paths none` is the answer and it is the falsifier firing, which is
> worth more than a blank. A lap with no map row is not gated — there would be no legal move.
