# P-RETURN-LEG-REPLAY — C (CHARLIE), D077 chunk 1, on D, read-only

**Packet:** `exo_memory/loop/plan_return_leg_2026-09-19.md` @aaf0aba, C row at :17. **Design under test:** my own
L062 §3 (`handback/p-return-leg-C_2026-09-16.md:152-176`). I am not disinterested. Two of the refusals replayed are
mine (C 09-09 07:52, C 09-16 19:15), and the predicate is mine.

Every script is read-only and lives in my scratch (`SCR/` below):
`C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/replay/`.
Each run's output is saved beside the script. No tracked file was edited except this hand-back and one map line.
`mcp.rs` is A's this lap; line numbers below are for HEAD aaf0aba.

---

## 1. The answer: the predicate is wrong

It is not wrong on the bar the plan names first:

- **It admits 0 of 17 `chair_inject` refusals.** That holds by construction, because the predicate only gates
  `call_librarian`. The number that shows the verb check matters is the **verb-blind mutant: it would admit 13 of 17**
  (16 of 17 in the any-`to` variant, §4). §5 fixture 5 of L062 is therefore required, not optional.

It is wrong on the return legs, in both directions:

| predicate | admits, of 10 refused `call_librarian` | problem |
|---|---|---|
| **§3 as written** (P_LAP: any open lap has a `dispatched` row whose `to[]` cells are not all returned) | **7** | misses 3 real return legs; **4 of its 7 admissions happen only because a *different* pane had an outstanding cell** |
| **§3's own stated reason** (P_MOUNT: the *calling* mount is an outstanding cell) | **3** | the ledger does not record who was asked |
| **corrected: P_INJ** (the caller was sent a delivered `chair_inject` more recently than its last delivered return) | **10** | one known over-admit, §3.3 |

Command: `node SCR/replay.js` → `SCR/run2.txt`, with the same tallies in `SCR/run3-asWritten.txt`.

**Root cause: `lap.jsonl`'s `to[]` is not a record of who was asked to hand back.** Four measured reasons:

1. **38 of 99 `dispatched` rows carry no `to` at all.** Only 61 do. (From the replay's own UNIVERSE line.)
2. **L050 recorded its dispatch as `chain:"working"`, with `to:["B","C","E"]`** (`lap.jsonl:365`). It has no
   `dispatched` row, so §3 as written can never see that lap's cells.
3. **Ad-hoc dispatches have no ledger row at all.** The G5 live check (the chair's `chair_inject` to C, 09-16
   19:14 UTC) asked me to call `call_librarian`. D064's ledger showed every cell returned, so the predicate
   refuses it.
4. **Returns carry no lap.** C's L049 return at 07:39:25 counts against L050's cell C. So even reading `to`
   from any row, P_MOUNT still refuses C at 07:52.

**The three return legs §3 as written still refuses, with the ledger rows that made it so:**

| refusal (UTC) | mount | open laps (holder) | why the predicate refuses | rows |
|---|---|---|---|---|
| 09-09 07:52 | C | L050 (chair) | L050 has no `dispatched` row; its dispatch is a `working` row | `lap.jsonl:363` (map, holder chair), `:365` (working, `to[B,C,E]`), `:366` (re-take by chair, 07:52:17) |
| 09-09 07:59 | B | L050 (chair) | same | `lap.jsonl:365`, `:367` (baton back to panes), `:368` (return-leg, holder chair, 07:58:18) |
| 09-16 19:15 | C | D064 (chair) | every `to` on D064 was returned by 18:03; the G5 inject has no ledger row | `lap.jsonl:462-485`, all with `outstanding=[]` in `SCR/run2.txt` |

**The four admitted for the wrong reason** (P_LAP admits, P_MOUNT refuses):

| refusal (UTC) | mount | what opened the gate |
|---|---|---|
| 09-06 07:50 | A | L037's outstanding C and E |
| 09-06 08:38 | B | L037/L039 cells; B is in no `to` |
| 09-07 07:05 | B | L039's outstanding A, C, E |
| 09-09 07:12 | A | L048's B and L049's C, E |

**Each of these four had a delivered inject to that very mount minutes before the call.** The board
shows this in `run2.txt`: last inject 07:48, 07:48, 06:54 and 06:59 respectively. So they were real return legs.
The ledger just did not know they had been asked.

---

## 2. Universe

**Machine D only.**

| source | contents | command |
|---|---|---|
| `C:\Consonance\data\board.jsonl` | 40,798 lines; 76 distinct rows mention "OUT OF TURN"; **32 are system-written refusals** under the §1.2 discriminator (`pane=="chair"` and `/REFUSED OUT OF TURN — mount/`) | `wc -l`; the `node -e` census in this lap's transcript; the UNIVERSE line of `SCR/replay.js` |
| same board | **81** distinct `call_librarian X -> LIB [Received]` returns; **418** delivered `chair injected -> <pane>` or `DELIVERED -> <pane>` rows to the four panes | `SCR/replay.js`, INJECTS and UNIVERSE lines |
| `C:\Consonance\data\lap.jsonl` | 570 rows, 374 chain rows, 99 `dispatched` rows (61 carrying `to[]`) | `SCR/replay.js`, UNIVERSE line |

The plan quotes "43 rows mention the refusal phrase at 07:5x". I measure 76 mentions and 32 system-written
refusals at 07:4x. The board grows; the unit that matters is the 32.

**The 32 by verb:**

| verb | count |
|---|---|
| `chair_inject` | 17, all mount D |
| `call_librarian` | 10: A 4 · B 3 · C 2 · E 1 |
| `call_chair` | 5, all mount M |

**Pane ids, checked stable over the whole window:** A=6fe15f0a, B=12fb81f6, C=0845a868, E=a2122153. Each id's
inject rows run unbroken to 09-19 13:4x UTC. Command: the id-map `node -e` in this lap's transcript.

**L's 30 were NOT used as a separate set, because they are not readable here.**

- The stick is `D:\consonance-L-20260911`. `find -maxdepth 6 -iname "*board*" -o -iname "*lap.jsonl*"` finds
  nothing.
- `consonance-transfer/MANIFEST.json` (1,584 B) lists tails and a ledger only.

**But D's board already holds the shared pre-split history.** Checked by timestamp against my L062 §1.3
table:

- **8 of L's 9 `call_librarian` refusals appear in D's set at the same UTC minute** (09-06 07:50, 08:38,
  10:03, 10:17; 09-07 07:05; 09-09 07:12, 07:52, 07:59).
- L's ninth, B at 09-16 07:06, is L-only and is **not replayed**.
- D adds two of its own: A at 09-16 04:49 and C at 09-16 19:15.
- I did not match the `chair_inject` and `call_chair` rows one by one. D has 17 and 5 against L's 16 and 5.

---

## 3. The corrected predicate, as a pure function

**P_INJ: a `call_librarian` is a return leg when its mount was sent something after its own last delivered
return.** It is read from the board, which records every delivered inject, rather than from the ledger, which
does not.

```rust
/// Pure. `last_inject` = ts of the newest delivered chair_inject / DELIVERED row to THIS mount's pane;
/// `last_return` = ts of the newest `call_librarian <mount> -> LIB [Received]` row. Both strictly before now.
fn return_leg_owed(last_inject: Option<u64>, last_return: Option<u64>) -> bool {
    match (last_inject, last_return) {
        (Some(i), Some(r)) => i > r,
        (Some(_), None) => true,
        (None, _) => false,
    }
}
// composed as a WIDENING of the station gate, never a replacement:
// allow = station_allows(required_station(verb), open, holders)
//         || (verb == "call_librarian" && return_leg_owed(last_inject(mount), last_return(mount)))
```

### 3.1 Results

- **Over the 32 refusals:** it admits **10 of 10 `call_librarian`** and **0 of 17 `chair_inject`**, the latter
  because of the verb check. The 5 `call_chair` are not in scope (§3.4).
- **Over the 81 delivered returns** (`node SCR/negctl.js` → `SCR/negctl-run1.txt`): as a *sole* gate it would
  admit 80 and refuse 1.
  - The one is **B, 09-02 11:51:44**, a second hand-back 4 min 9 s after B's 11:47:35 return, with no inject
    between them (last inject 11:40:57).
  - This is why it must be an OR with the station gate. That way it can only widen, and the follow-up case keeps
    whatever the station gate gives it today.

### 3.2 Fixtures, from the real rows (timestamps are UTC ms from `board.jsonl`)

1. **The G5 failing case** (§3 as written refuses it; P_INJ admits it):
   - C refused at 09-16 19:15.
   - Last inject to C at 19:14 (the chair's G5 request), newer than C's last return at 18:03.
   - D064's `to[]` was fully returned.
   - Expected: `return_leg_owed(Some(19:14), Some(18:03)) == true`.
2. **The L050 pair** (§3 as written refuses both): C at 07:52 and B at 07:59.
   - C: last inject 07:39:39.8, last return 07:39:25.1.
   - B: last inject 07:56, last return 09-06 10:46.
   - Both expected `true`.
3. **The tight ordering case, and it must stay strict:**
   - C's L049 return is at `1788939565081`; the L050 inject is at `1788939579803`, 14.7 s later.
   - `i > r` must be `>`, not `>=`: a same-ms tie would mean the inject arrived with no later work to return.
   - I did not find a real tie. The fixture is the 14.7 s pair, plus a synthetic tie that expects `false`.
4. **The follow-up case:** B at 09-02 11:51:44 gives `return_leg_owed(Some(11:40:57), Some(11:47:35)) == false`.
   Under the OR it is decided by the station gate, as it is today.
5. **The verb check:** a mutant dropping `verb == "call_librarian"` must go red. On this data such a mutant admits
   13 of 17 `chair_inject` through the lap condition.
6. **L062 §5 fixture 6 is unchanged, and it is still the one that matters:** the pane is admitted, and the
   librarian's delivery gate holds it.

### 3.3 The known over-admit: an inject is not always a request for a hand-back

This morning's two delivery tests (the chair's "No work, no reply", 07:3x/07:4x local) are delivered injects. So
P_INJ opens the gate for each receiving pane until that pane's next return. A pane that then called
`call_librarian` unasked would be admitted.

The cost is one pane speaking out of turn, into a delivery gate that holds (§3.2 fixture 6). That is the same
class of risk L062 §4 already priced, and narrower than P_LAP's "any outstanding cell opens it for every pane".

If the builder wants it closed, the inject would need to carry a no-reply flag. No such field exists today.

### 3.4 `call_chair`: 5 refusals, all admitted at HEAD with no predicate

`required_station` (`mcp.rs:665-670`) has no `call_chair` row since P-LIB-CHANNEL, 09-06. The five refusals
(09-02 13:50 through 09-06 13:00 UTC) all come from before that exemption reached a build. **There are none after
09-06 13:00**, per the listing in `run2.txt`. They need nothing from this predicate.

---

## 4. Control: the replay reproduces the gate before judging the predicate

For each refusal, the ledger is cut to rows with `at <= t`, and the gate's own rule is re-run.

- **32 of 32 reproduced as REFUSE.** A refusal the reconstruction admitted would have made the predicate's verdict
  on it meaningless.
- **27 of 32 are reproduced by both rules.** "Both rules" means:
  - the NEW rule, `lap_holders::open_holders` + `station_allows` (any open lap held by the required station);
  - the OLD rule, the newest open lap's holder alone.
- **The other 5 are reproduced only by the OLD rule.** All five fall on 09-06: the `chair_inject` refusals at
  08:06, 08:56, 08:57 and 09:10, and E's `call_librarian` at 10:17. That is exactly the multi-lap shadowing
  `lap_holders.rs:8-16` records as fixed by L040.
- The control is the TALLY line `control reproduced (either rule) 32 / 32` in `SCR/run2.txt`.

**Variant, for completeness:** reading `to[]` from any chain row, not just `dispatched` (`ANY_TO=1 node SCR/replay.js`
→ `SCR/run3-anyTo.txt`):

| predicate | admits, of 10 |
|---|---|
| P_LAP | 9 |
| P_MOUNT | 4 |
| verb-blind mutant on `chair_inject` | 16 of 17 |

It fixes L050 and still refuses G5, and it widens the blind mutant. **It does not repair the design;** the
ledger's missing dispatches and lap-less returns remain.

---

## 5. What is NOT verified

- **L's 30 were not replayed as L's.** Their board is not on this disk (§2). Eight of the nine L-side return legs
  are in D's board at the same minute. L's B 09-16 07:06 is not replayed at all.
- **I did not check what the control plane can see at call time.** P_INJ needs the newest delivered inject and
  return per mount, read from the board. I have not verified that `mcp.rs`'s in-memory board holds that history
  across a relaunch. `main.rs`'s own comment calls `board.jsonl` a write-only mirror (`BOARD_PUSHED`).
  - **If the ring starts empty at launch, P_INJ reads `(None, _)` and refuses:** it fails closed, which is
    today's behaviour, until the next inject. The builder must check this and must not assume it.
- **"Delivered" is read from audit text:** `chair injected -> id [...]` and `DELIVERED -> id`. A `WRITTEN BUT
  UNCONFIRMED` inject counts as delivered. Per the D074 census, both such cases did arrive, but that was 2 cases.
- **Board-derived counts are a floor**, as in L062 §6: a torn row would not match the discriminator.
- **Whether each of the 10 was a real return leg** rests on the verb's definition, L062's 8-of-9 corroboration,
  and here the inject minutes before each call. None of the 10 is a pane speaking unasked. **That means the
  refusal set has no negative case for P_INJ to refuse.** Its narrowness is tested only by the 81 delivered
  returns (§3.1), and by argument (§3.3).
- **Nothing was built or run in the app.** No Rust was compiled. The sketch in §3 is a specification for
  chunk 2, not code.

## 6. Corrections to myself on the way

1. **The first P_INJ run parsed 0 injects.** The shell-edit ate the escaped parentheses in
   `chair injected \(chair: …\)`, and the tally read "P_INJ admits 0". I refixed it with the Edit tool. The
   INJECTS line (418) is now printed, so a zero cannot hide again.
2. **L062 §3 states the predicate lap-wide but justifies it per mount** ("a seat with no outstanding dispatch has
   no return leg to make"). I wrote both sentences and did not see that they disagree. The replay shows the gap is
   4 of 10.
