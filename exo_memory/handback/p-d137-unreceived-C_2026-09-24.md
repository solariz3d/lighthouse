# P-D137-UNRECEIVED — C (D137, on D, 2026-09-24 ~23:5x → 09-25 00:xx) — THE CASE WAS NOT A DELIVERY FAULT; THE CHECK IS BUILT FOR THE FAULT THAT CAN HAPPEN · UNCOMMITTED

Packet: the chair's D137. The case is `exo_memory/loop/stall_trace_2026-09-23.md:76`. HEAD `0566734`. Files:
`consonance/tools/chain-status.js` and `consonance/tools/chain-status.test.js`, and nothing else. No settings, no
restart, nothing about run 2 opened. **It is live at the next hook load; nothing was installed.**

## 0 · THE FINDING THAT COMES FIRST: the 20:15 → 23:32 ring was sent at 23:32:48, and rendered in 0.36 s

I read the three sources at source.

**The board** (`C:/Consonance/data/board.jsonl`):
- `05:32:48.407Z`: Main's transcript `user` row, `[librarian:LIB] Librarian — the keeper answered §9 …`
- `05:32:48.546Z`: `call_chair -> Main [Received]` (`ts_source: push`)
- **Nothing** for this ring between 02:04:40Z and 05:32:48Z. The only earlier `call_chair` is the D135 collation ring:
  02:04:40.348Z [Received], with Main's row at 02:04:40.196Z.

**The librarian's own transcript**
(`~/.claude/projects/C--Consonance-instances-librarian/0c0c0c0b-…115b.jsonl`):
- `02:04:39.978Z` `call_chair` (D135) → `02:04:40.351Z` result "delivered".
- **`02:04:45.342Z` `AskUserQuestion` (the §9 questions) → the RESULT came back at `05:32:16.649Z`.**
- `05:32:44Z` Bash, which appended the answers to the plan.
- **`05:32:48.184Z` `call_chair` (the §9 answers) → `05:32:48.551Z` result "delivered".**

**`main.rs:11473-11511`** (`librarian_call_exec`) writes the `[Received]` audit row **in the same call** that returns
"delivered" to the sender, after `await_render` finds the text in Main's capture. So "delivered at 20:15, received at
23:32" cannot be two moments of one ring: the row and the reply are the same moment.

**So:**
- **The 3 h 27 m was a question to the keeper waiting for its answer**, not a ring waiting at a door.
- The ring's body dates the keeper's answer "20:1x", and the librarian's 05:33 reading took that for the send time.
- **Nothing in the delivery path failed in this case. A's receiver-side fix is chasing a fault this case does not
  show.**
- I posted this to the board as an early note within minutes of the packet (it arrived 05:56Z), so A had it mid-lap.
- **The real gap it exposes:** no clause sees a seat **blocked on an AskUserQuestion to the keeper** while its chain
  waits. That is named here, not built. It is not this packet.

## 1 · THE CHECK: clause 5, UNRECEIVED

**What "sent" and "received" are on this board, since there is no separate send row:**
- **The send record is the app's audit row:**
  - `call_chair -> Main [<receipt>]: "<preview>"`
  - `call_librarian <L> -> LIB [<receipt>]: "<preview>"`

  They are written with `pane: chair`, `role: committee`, `ts` = send time (main.rs:11501, :11569).
- **`[Received]`** means the app saw the text drawn in the receiver's pane, and the sender was told "delivered".
  **It is TRUSTED, not re-checked. Measured on D's board 2026-09-17→24:**
  - 433 of 436 `[Received]` rings have the receiver's transcript row, at a lag of −512 ms to +1,444 ms;
  - **the 3 without one were each acted on by the receiver within seconds.** Main replied to two of them at
    13:34:17Z and 13:47:08Z.

  The tailer dropped the row, not the ring. Re-checking `[Received]` would print a false UNRECEIVED about every other
  day. Script: `<scratchpad>/d137/measure.js`.
- **`[Unconfirmed]`** means written, with no render in the budget; the sender was told "UNCONFIRMED". **This is the
  ring that can be lost silently, so it is the one checked.**
- **The receipt that can still come later** is the receiver's transcript row: `role: user`, `pane` = MAIN_SID or
  LIBRARIAN_SID, and text containing the system-written tag (`[librarian:LIB] ` or `[pane:<L>] `) plus the ring's
  text.

**Pairing fields:**
- **receiver:** the row's `pane` equals the ring's destination SID;
- **text:** the row's whitespace-collapsed text contains the tag plus the first 60 characters of the audit preview
  (the preview's trailing "…" dropped);
- **time:** the row's `ts` is no earlier than send − 5 s. The receiver row can precede the audit row; −512 ms was
  measured.

**Two rings told apart:** by order. Each receiver row pays for one ring only, the earliest unpaid one it matches, so two
identical rings and one receipt leave one flagged.

**No double-flag with QUEUED, by construction.** A queued ring returns at `gate_or_queue` (main.rs:11490, :11556)
**before** any audit row is written. It has QUEUED/DELIVERED rows and never a `call_*` row. The test pins it.

**The line:** `UNRECEIVED librarian→chair 11m (sent HH:MM, written "Unconfirmed", no render and no receipt since)`, or
`UNRECEIVED C→librarian …` for a pane.
- **It prints past 10 min and within a 24 h look-back.** An unpaid ring older than a day is history, not a live fault.
- **It rides every holder with clause 4,** and before the no-lap exit, so it prints with no lap open.
- **DEVIATION from the packet's wording:** the packet's text was `"delivered" but never received`. **A ring the sender
  was told "delivered" is by the app's own code a rendered one.** The ring that can go unreceived is one the sender was
  told "UNCONFIRMED", so the line says what the sender was told.

## 2 · TESTS AND MUTANTS

**RED first:** the 11 new tests against the old file gave **5 failed**. They are exactly the 5 that expect a flag; the
6 silent ones passed trivially, which is what the mutants are for.

**GREEN:** `node --test consonance/tools/chain-status.test.js` gives **131 / 0**. That is 117 before, plus 11, plus 3
added after the first mutant run.

**The tests:**

| # | test | expects |
|---|---|---|
| 1 | an Unconfirmed ring received 2 min later | silent |
| 2 | an Unconfirmed ring never received, past 10 min | flagged, naming from, to and send time |
| 3 | the same ring inside the 10-min bound | silent |
| 4 | a queued ring | **QUEUED only** |
| 5 | a `[Received]` ring with no transcript row | silent, pinning the measured decision |
| 6 | a pane's `call_librarian` written Unconfirmed | `C→librarian` |
| 7 | two identical rings, one receipt | one flagged |
| 8 | a receipt for a different ring or sender tag | does not clear it |
| 9 | the 24 h look-back | stops printing |
| 10 | **the real 20:15→23:32 case from the board rows** (real timestamps, panes, roles and receipts; bodies replaced with stand-ins because the real text carries run-2 decisions) | **SILENT** |
| 11 | **the one real `[Unconfirmed]` ring on the board**, 2026-08-25T17:42:21.461Z, with no receiver row anywhere after it | flagged |

**On the live store** (`node consonance/tools/chain-status.js`): no UNRECEIVED, which is correct. The whole board holds
768 `[Received]` rings and 1 `[Unconfirmed]`. Replayed at 2026-08-25T17:53:30Z, the real one flags at 11 m.

**Mutants** (`node <scratchpad>/d137/mutants.js`, temp copies of `consonance/tools` + `consonance/hooks`, scored
against the unmutated copy's own failures; the control fails none).

**First run: 12 applied / 9 caught / 0 NOT APPLIED. Three SURVIVED,** and all three were weak tests of mine:
- **U5, pairing ignores the sender tag, and U6, pairing ignores the receiver.** My "different sender" test changed the
  tag AND the receiver at once, so neither was isolated.
- **U9, the no-lap exit ignores clause 5.** No test reached the exit with only clause 5 to say.

I added one test each: the ring's text in the right pane without the tag; the tagged text in the wrong pane; and no open
lap, with the empty-state control first. **Re-run: 12 applied / 12 caught / 0 NOT APPLIED.**

| mutant | caught by |
|---|---|
| U1 the 10-min bound removed | the inside-the-bound test |
| U2 `[Received]` re-checked | the trusted-receipt test |
| U3 receipts never pair | the received-in-2-min test |
| U4 a receipt pays every ring | the two-identical-rings test |
| U5 the tag ignored | the no-tag test (added) |
| U6 the receiver ignored | the wrong-pane test (added) |
| U7 no look-back cap | the 24 h test |
| U8 not wired into the line | the flagged test |
| U9 the no-lap exit | the no-lap test (added) |
| U10 queuedScan skips it | the flagged test |
| U11 from and to swapped | the flagged test |
| U12 the letter dropped | the `C→librarian` test |

**Full JS suite** (`node consonance/tools/js-suite.js`, background, heavy-run lock): **139 green · 0 failed · 0
crashed · 1 canary · 1 not-run, of 141.**
- The canary is `targetless-pull.test.js`, declared EXPECTED-RED.
- The not-run is `actors.evidence.test.js`, which is MACHINE-BOUND.
- Both are as before this lap.

## 3 · NOT verified

- **That the 60-character stem never collides between two different rings** from one sender to one receiver within
  the pairing window. If two rings share their first 60 characters and one is lost, the check pairs by order and may
  flag the wrong one of the two. The count stays right.
- **The hook load.** The pulse imports the file per prompt, so it is live at the next prompt. I saw the CLI line; I did
  not watch a pane's pulse.
- **Why the librarian's AskUserQuestion took 3 h 27 m** (the keeper away, or the dialog unseen). That is not this lap's
  question, and the transcript cannot say.

Files: `chain-status.js` (+clause 5 and exports), `chain-status.test.js` (+11 tests), this hand-back and one map line.
Nothing committed.

NEXT: librarian call_librarian with the hand-back pointer when the check and its tests are written — plan default after it: the librarian collates D137 when A, C and E have rung, unless the output says otherwise. OUTPUT says otherwise: the case was not a delivery fault. The ring was called at 05:32:48.184Z and rendered in 0.36 s; the stall was the librarian's AskUserQuestion open 02:04:45Z→05:32:16Z (§0). Re-check A's receiver-side premise before landing it, and correct stall_trace:76's reading.
