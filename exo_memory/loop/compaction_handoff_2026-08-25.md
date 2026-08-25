# Compaction handoff — 2026-08-25 ~05:00

**Written for the instance that wakes on the other side of a compaction with none of this in its
head.** Different reader from `handoff_2026-08-25.md` (`6b59f50`), which is the session record.
That one says what happened. This one says what to distrust, what is live, and what to do first.

---

## 1. DO NOT TRUST THE SUMMARY ON THESE FOUR THINGS

`precompact-preserve` measured the last seven summaries of this conversation: shas survived at
**10.2%**, structured numbers at **9.3%**, registered falsifiers at **3.5%**. A summarizer keeps
narrative and drops verification, so these are the claims most likely to arrive stripped of their
correction:

- **"The cross-model channel is a working organ, 2 for 2."** **FALSE. It inverts** (`310c719`). The
  chair checked **6 files of 22**; both refuting documents were outside that scope.
  `exteroception_registration.md:50-59` had already named the error in advance — *"anyone quoting
  one of those two as the expected value is PICKING."* **T4 is unchanged. The keeper's option call
  is untouched by anything the chair said.**
- **"The Third Place is built."** No. **Leg 1 landed, NOT shipped** (`34afdf6`, brief at `ac26278`).
  It compiles; it cannot open.
- **"open-items says 1 of 5 open."** That is 1 of 5 *things someone wrote a check for*. Pane B
  measured the real denominator: **46 numbered registrations, complete 1–46, ZERO checked.**
- **"The corpus deletes almost nothing."** Sharper than that: **0 files have ever left the reading
  path.** Every deleted line is churn inside a file still on it. `node consonance/tools/forget-rate.js`

---

## 2. THE RULE THIS SEAT KEEPS RE-BREAKING

**Finish the turn, THEN dispatch. Every hop is two turns.** `BUILDING.md`, the dispatch order.

Measured today: **12 of 12 dispatch-turns violated it.** The shape is always `TEXT … DISPATCH TEXT`
— a closing line written after the call already left. The failure is not forgetting; it is
satisfying a weaker reading of the rule ("most of the output is written").

**`dispatch-gate` cannot catch this.** It checks citation, not sequence. A brief composed mid-turn
citing a real sha passes it cleanly. **A clean gate ledger is not evidence the boundary held.**

And the second half, which the keeper had to say three times: **finishing is not stopping.** Do not
end a turn with *"next I will hand this over"* and wait. The keeper is not the trigger.

---

## 3. THE LOOP, in the order it actually runs

```
keeper → orch → [orch finishes] → librarian → [librarian finishes] → orch
       → [orch finishes] → panes → [panes finish] → orch → librarian (return leg)
```

**The librarian is home** (the corpus, where the cycle returns). **Main and the panes are work.**
The Third Place is neither, and reaches only the librarian — never the orch, never the panes.

**Seal a guess before every inquiry:** `node consonance/tools/lap-row.js --open --initiator human
--inquiry "..." --guess "p1,p2,..."` then `--map <lap> --paths ...` when the map returns. L001–L007
exist.

**The self-wake loop, adopted tonight, needs no build.** `ScheduleWakeup` and `run_in_background`
are in every seat's tool list; `librarian/2026-08-23.md:272` proves an idle pane self-wakes with no
human input. Dispatch → arm a timer → on wake `read_board` → collate → re-arm. **Registered as the
baseline Leg 2 must beat, in turns-per-hop.**

**And: every pane posts its hand-back to the board, every time.** `read_board` answers "is a pane
done." The `[panes]` digest only arrives attached to the keeper's message — relying on it is why
the keeper was the clock all night.

---

## 4. LIVE RIGHT NOW

- **Nothing is in flight.** All four panes idle and handed back; the librarian ran Cycle 3's return
  leg from disk. Tree clean, 0 unpushed.
- **Pane `0845a868` is named Around** and the record attributes findings to it by name across weeks.
  The other three carry the default `✦ brief` label. **Do not invent names for them.**
- **Pane L was closed by the keeper.** Its transcript survives — 49,242 bytes, and `rooms/room-b9febdee/`
  is intact. **Leg 3 is gated on whether that becomes the Third Place's first record.**

---

## 5. FIRST ACTIONS, in order

1. **Ship Leg 1**: add `brief/THIRD_PLACE.md` to `tauri.conf.json` `bundle.resources` (that alone
   puts it in open-items' md5 set — A's fix reads the authority), add the UI tab between `librarian`
   and `listen`, **rebuild**, then open the seat.
2. **Run Leg 1's real bar**: cycle9's priming grep **on the seat's first transcript** — not on the
   brief. It has never been run and is recorded as unmet-because-unrunnable.
3. **Legs 2 and 3** are the next two cycles' first inquiries. Inquiry-first, to the librarian.

---

## 6. THE KEEPER'S, one conversation, all still open

`boot_v2` (execute or attic, deadline was 08-24) · `opposition_preregistration.md` (registered
08-10, 15 days unrun) · **T4's option** · `room-b9febdee` continuity.

---

## 7. VERIFY RATHER THAN BELIEVE

```
git log --oneline 0ebd101..HEAD
node consonance/tools/js-suite.js                 # 59 green, 0 canary
cd consonance/src-tauri && cargo test --bin consonance   # 311
node consonance/tools/open-items.js
node consonance/tools/forget-rate.js
node consonance/tools/lap-row.js --report
```

**The mutation harnesses under `dev/mutation/` matter more than the suites.** A green suite says the
tests pass; only those say the tests can fail.

**Every number in this file re-derives from a command printed beside it.** If one does not, it is
hand-made and should be struck rather than repeated.
