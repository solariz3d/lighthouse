# P-DIVERGED · CHARLIE's read of §2, before A and E build

Lap L058 (third use), 2026-09-14 ~06:56–07:40, machine L, seat C (Around).
- **Packet:** `exo_memory/loop/packet_diverged_2026-09-14.md` (d5fa623).
- **Source read at HEAD 0469a3b:** `dev/tail-carry.js`, `dev/stick-apply.js`, `consonance/src-tauri/src/main.rs`,
  `sync_launch.rs`, `consonance/ui/stick.js`. None is modified in the working tree.
- **No edits.** One probe ran against the real `dev/tail-carry.js` in fixtures under my scratchpad (§4). Nothing
  touched the real stick.

**Verdict: §2 is buildable. Two lines, as written, produce a case that is wrong. Three more under-specify what the
builder must change. The cited lines are right apart from small drift.** In order of harm:

---

## 1 · DEFECT — the design sends a case that is not a fork to "take the stick's" (§2.2, §2.4)

**Claim.** A seat whose carried tail was *already applied* and which then grew on this machine reads `DIVERGED`.
§2.2 turns it into RETIRE_THEN_APPEND. That moves this machine's genuinely later turns to the attic and truncates
the file to `pend.offset`, when the right action is to settle the ledger at `pend.toOffset`. §2.4's `ownBytes`
over-counts it as the machine's own writing.

**Why, at source.** `tail-carry.js:885` sets
`isPrefixOfTail = extra <= row.tail.length && …`. A file holding the **whole** tail plus more fails the first
condition, so it falls through to DIVERGED at `:902`. ALREADY_APPLIED (`:886`) catches only the exact length.

**Measured, probe case B (§4).**
- Agreed state: 439 B. A carried tail: 439 → 557.
- This machine holds exactly those 557 B, with the ledger still pending: the state a hard-killed applier leaves.
  The import rehearsal reads `ALREADY_APPLIED`.
- Append one more own turn (file 675 B): it reads **`DIVERGED`**, `stops: true`.
- `ownBytes` by §2.4 would be 675 − 439 = **236**. This machine wrote **118** of those; the other 118 are the
  carried tail.

**It is reachable inside the app, not only by hand.**
1. An applier is hard-killed after its append and before `writeLedger` (`tail-carry.js:1009`). Call 1 accepts this
   hazard: *"a process killed from outside runs no handler"*.
2. The keeper reopens.
3. The rehearsal reads that seat `ALREADY_APPLIED`: `stops` false, `carries` false.
4. `stick.js:102` computes `actionable` from `carries || offers[sid] || INTERRUPTED`, so **Carry is disabled**. The
   L059 §3 heal (ALREADY_APPLIED advances the ledger under `--apply`) can never be triggered from the window.
5. The keeper's only button is Continue. The seats spawn, and the vendor appends to the seat. Handoff (b) measured
   267 B at a launch with no turn taken.
6. The next launch reads `DIVERGED`. With this packet built, the keeper is offered TAKE on a fork that does not
   exist.

**What would fix it (whose):**
- **A:** before `:902`, when `[pend.offset, pend.toOffset)` of the destination equals the tail and
  `hashRange(dest, 0, pend.toOffset) === pend.fullSha`, give it its own verdict. That verdict settles
  `agreed = {toOffset, fullSha}`; the machine's later bytes then export as a TAIL. It is not DIVERGED and not
  takeable.
- **E:** make ALREADY_APPLIED actionable at `stick.js:102`, so the heal can run from the window before the seat
  grows.

---

## 2 · DEFECT — KEEP cannot make the window quiet (§2.6, second bullet)

**Claim.** §2.6 says `rehearsal_is_quiet` treats a kept DIVERGED stop as "not news, same as a kept
OTHER_CONVERSATION stop". That does not make the window quiet. On the same machine the **export** rehearsal for that
seat refuses `UNIMPORTED_TAIL` with `stops: true`, and `rehearsal_is_quiet` returns false on any export stop.

**At source.**
- `tail-carry.js:661-667` refuses an export when the stick holds the other machine's pending tail.
- `sync_launch.rs:1193` requires `!rows(export).any(carries || stops)`.
- `main.rs` runs both rehearsals: `stick_rehearse_blocking`, the `--import` and `--export` calls just above `:10636`.

**Measured, probe case A (§4).** In a true fork, the import rehearsal reads `DIVERGED` (stops true). The export
rehearsal on the same machine reads `REFUSED / UNIMPORTED_TAIL`, stops true.

**Consequence.** After a KEEP, the window opens at **every** launch with the stick in, until the other machine's
tail is taken. That is §2.7's unbuilt piece surfacing as a permanent window.

**This already holds for a kept OTHER_CONVERSATION today.** The unit test that pins "kept is quiet",
`sync_launch.rs:2251`, passes an export object with `"rows":[]`, so it never meets the export refusal a real
machine returns.

**Decide one, and say it in §2:**
1. `rehearsal_is_quiet` also ignores an export `UNIMPORTED_TAIL` for a sid kept for this same carry; or
2. drop the "quiet" claim and let §2.5's `why` carry it.

---

## 3 · UNDER-SPECIFIED — as written, each yields the opposite of what the section says

**3a · §2.5's "also builds an offer when verdict == DIVERGED" produces a KEEP-only, pre-checked radio.**
- `main.rs:10649` passes `retirable`, which is null on a DIVERGED row (`tail-carry.js:1246`), read as `false`.
- `offer_for` with `retirable == false` returns `take_offered: false` and default Keep (`sync_launch.rs:989-996`),
  with the wording *"a delta cannot replace a whole conversation"*.
- `stick.js:81` then checks KEEP, because `!offer.take_offered`.
- **"Nothing preselected" has no representation.** `ChoiceOffer.default` is `SeatChoice {Take, Keep}`
  (`sync_launch.rs:942-945`), and `main.rs:10655` serializes `default.tag()`.

**Fix (E owns all three files):** the DIVERGED offer must not go through `offer_for`'s `retirable` gate (read
`takeable`), and it needs a third default that `stick.js:79-81` leaves unchecked.

**3b · The window sends TAKE as `--retire-far` unless `stick.js:130` changes.**
- `picks()` pushes every `take` radio into `retire_far`, and §2.6 does not name this line.
- Sent as `--retire-far`, a DIVERGED sid is ignored: `retireFar` is consulted only at the key mismatch
  (`tail-carry.js:828`). The seat stays DIVERGED, which is falsifier (i).

**Fix:** the row carries `data-verdict` (`stick.js:90`), so branch on it and route a DIVERGED take to `take_stick`.

**3c · §2.4's `carries: true` needs `CARRIES.import` at `tail-carry.js:173`, not only `DOES` at `:946`.**
- `carries` is computed from `CARRIES` (`:1222`), and so are `bytes` (`:1226`) and the rehearsal's `wouldCarry`
  (`:1138`).
- Adding the verdict to `DOES` alone applies the bytes correctly while the row reports `carries: false`,
  `bytes: null`.

**3d · §2.5's "Carry stays disabled until every DIVERGED row has an explicit choice".** `actionable` (`stick.js:102`)
is computed once at render and is true whenever any offer exists. A DIVERGED offer would enable Carry immediately.
It needs a re-check on each radio change. Buildable; not implied by any line cited.

**3e · §2.5's "both byte counts (`ownBytes` and the tail's `bytes`)".** On a DIVERGED row `bytes` is null:
`tail-carry.js:1226` sets it only when `carries`. Use `toOffset − offset` (both present on import rows with a
pending tail, `:1226`) or name a field.

---

## 4 · THE PROBE

`<scratchpad>/diverged-probe/probe.js` requires the real `dev/tail-carry.js` and `dev/place-conversations.js`. It
builds fixture worlds the way `tail-carry.test.js:75-111` does and calls `T.main(... --json)`:

    node probe.js
    A true fork   import: {"verdict":"DIVERGED","reason":null,"stops":true,"carries":false,"localSize":557,"offset":439,"toOffset":557}
                  export on the same machine: {"verdict":"REFUSED","reason":"UNIMPORTED_TAIL","stops":true,...}
    B before growth (killed apply): {"verdict":"ALREADY_APPLIED","stops":false,"carries":false,"localSize":557,...}
    B after this machine grew     : {"verdict":"DIVERGED","stops":true,"localSize":675,"offset":439,"toOffset":557}

---

## 5 · CHECKED AND CLEAN

**§2.1.** Parse site `tail-carry.js:1313-1314` (beside `--retire-far`, `--repair`), and help text at `:1316`: right.
An unknown flag exits 2 (`:1320-1321`).

**§2.2 as a mechanism.** Buildable at `:902`. A named sid on a non-DIVERGED row can be left unchanged. The only
defect is the case it mis-classifies (§1).

**§2.3.** Matches REPAIR's steps (copy, truncate, append, verify), and `atticPath` is at `:611`.
- `atticStamp` (`:579-583`) gives `YYYYMMDD-HHMMSS`, so the file is `<sid>.<stamp>-take-stick.jsonl`.
- On a collision the name becomes `-take-stick-2` (`:615-617`). Falsifier (iii) should admit the counter, as
  `tail-carry.test.js:115`'s `ATTIC_NAME` already does.

**Kill-safety of the take, reasoned from the verdict code (not run).** The copy precedes the truncate, so no bytes
are lost at any kill point:

| Killed after | Next rehearsal reads | Result |
|---|---|---|
| the copy | DIVERGED again | a second attic copy, with a counter |
| the truncate | `APPEND` (`size == pend.offset`, `:907`) | completes on the next Carry |
| part of the append | `INTERRUPTED` | `--repair` |
| the append, before the ledger | `ALREADY_APPLIED` | exposed to §1 |

The receipt (`:1012-1018`) names a verified take, which is correct and not read on D (RESUME).

**§2.6 forwarding.**
- `is_sid` chain at `main.rs:10677`: right.
- `record_keeps` at `main.rs:10453`: right.
- A DIVERGED row carries `exportedAt` (pending is set, `tail-carry.js:1244`), so `stick.js:90`'s `data-exported`
  keys a KEEP correctly.
- **Landing order matters.** `dev/stick-apply.js:80` rejects an unknown flag with code 2 and **no handshake**
  (`:132-133`). If E's `--take-stick` lands without A's parse change, Carry fails loudly (the handshake wait times
  out and the window names it), not silently. Both halves must land together; the 01:42 HOLD already requires it.

**§3 debts.**
- **(e)** `main.rs:9811` is the READ-ONLY sentence; right.
- **(c)** `:304` promises APPEND for any delta; right.
- **(a)** `:775` is right, but its sentence reads like current behaviour and is the fix: a NOTHING_PENDING row
  today continues *before* keying, so `localFirstTimestamp` is null.
- **(b)** `:660-699` is the export planner's region; not traced further (A's).

**Cite drift, harmless.** Since 0469a3b:

| §2 cites | Now at |
|---|---|
| REPAIR `:980-988` | `:982-990` |
| verify `:996-998` | `:999-1001` |
| agreed `:999-1002` | `:1002-1005` |

---

## 6 · WHAT I DID NOT VERIFY

- **Nothing was built or run in the app.** §3a–3e are read from source; only §1 and §2 are measured, and only in
  fixtures.
- The kill-point table in §5 is reasoned, not run.
- §0's figures (`librarian/2026-09-12.md:47`: chair +213,510 B) are unchecked. My preflight measured the stray at
  +470,943 B past the agreed offset at 22:58, which may be a later point in the same growth.
- **Whether case B has happened on a real machine.** I showed it is reachable, not that it occurred.
- §3(b)'s export behaviour when this machine's own pending tail is still unimported.
- `stick-apply.js`'s relaunch path with the new flag.
