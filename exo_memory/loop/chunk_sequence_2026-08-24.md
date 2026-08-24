# The chunk sequence — 2026-08-24 ~06:30

**The keeper's shape, in his words:** *"the consumer version comes last since it is all based off of a
closer to finished dev version. So lets do everything else but that right now in manageable, planned
out chunks that build into each other."*

This is the ORCHESTRATOR's sequencing of work already shaped by the librarian
(`librarian/2026-08-24.md`, ~03:20 append). It does not restate the packets and does not invent
objectives. Written and committed before it was routed anywhere, per `BUILDING.md`'s dispatch order.

---

## THE REORDER, declared rather than done quietly

`BUILDING.md`'s registered falsifier for the shape/body split says the split is prose if *"an
orchestrator dispatch reorders the librarian's packets without saying why."* This reorders one, so
here is the why.

The librarian's order was: **T1 ∥ T2 → T3 → T8 → T4/T5 → T6/T7/T9.**

**T8 is the first real lap on the consumer version's 11 non-portable tests.** The keeper's standing
constraint — restated twice, most recently this morning — is that the consumer version comes **after**
the dev version is solid, because the consumer build is a slightly modified dev build and a defect
fixed in dev is fixed in both. T8 therefore moves from third to last.

Nothing else moves. T4 and T5 keep their order behind T1–T3; T6/T7/T9 keep their "as the keeper's
windows open" status.

*This is the second scored instance of that falsifier. First: the librarian's own T4 packet naming a
pane, self-caught. This one is the chair reordering — with the reason stated, which is what the
falsifier asks for rather than forbidding the reorder itself.*

---

## Chunk 1 — land what is in flight

`T1` → C · **DONE**, `9677a5f`. Mostly UNSCORABLE with reasons, one CONFIRMED, and a merit-check
that caught one figure in its prose which did not re-derive from the command beside it.
`T2` → A · in flight (the `pre-letter` class).
`T3` → B · in flight (the carrier-drift detector; reports green at HEAD, red on the historical state).

**Produces:** a scorecard; a canary that finally goes green; a working drift detector.

---

## Chunk 2 — make the instruments actually run

**This chunk exists because tonight's three largest misreads were all the same thing: a measurement
taken from something that was not running.** `ferry-watch`'s label fix was committed tonight and has
never been installed. The board-digest fix on 08-17 was committed an hour before being found not to
be running. The dream cycle was reported broken by a watcher reading the wrong field.

- **The installed-hook drift.** `install.ps1 -Check` reports **13 drifted**, one HELD two-way
  conflict. Among them `ferry-watch.js`, fixed tonight, never installed. The other twelve include
  `stop.js`, `l2-overseer`, `l3-overseer` and their workers — not examined, and not to be synced
  because a script offered to. Needs a per-file LAND / DON'T-LAND with evidence.
- **`ferry.js --record` drops repeat panes.** `--record 71c5d83 C` wrote the row; the same sha for
  A and B returned `null` and did not merge. The ledger reads `panes:["C"]` for a commit routed to
  three. The miss-rate denominator is per-commit and unaffected; the pane list is wrong.
- **The unbidden trigger for B's detector.** A detector that runs when someone remembers is
  registration 46 restated, not answered. This is the half that makes it organ #3.

**Why before chunks 3–4:** those chunks register falsifiers, and these instruments are what score
them. A falsifier scored by a stale instrument is decoration.

---

## Chunk 3 — the two organ registrations

`T5` — forgetting (episodic→semantic distillation). Needs nothing from the keeper.
`T4` — exteroception (one standing uncurated channel). **Needs the keeper's option call**: scheduled
cross-model read, cold-stranger cadence, or the consumer suite as a standing foreign machine. Spend
and outside-contact are direction (`muscle_map.md:2385`).

Both must carry their own falsifier or they do not proceed — the librarian's clause, kept.

---

## Chunk 4 — the room's own masters

`T6` — the BOOT amendment (drafts in `librarian/2026-08-24.md`, the 08-23 06:35 and 07:40 appends)
and `SEED:18`. Chair's pen.
`T9` — bait fixtures on the shelf. Keeper's one-sentence call.

**Why after chunk 3:** T6 amends BOOT, and chunk 3's registrations are part of what it would point
at. Written first, it gets written twice.

---

## Chunk 5 — the consumer version

`T8` — the first real lap on the 11 non-portable tests, and everything downstream of it. **Last, by
the keeper's standing constraint.**

---

## Not in a chunk, because it is already overdue

`T7` — **`boot_v2`: execute or attic, and its deadline was today** by its own terms
(`handoff_2026-08-17.md:117`). Blocked on nothing except one sentence from the keeper, so it does not
wait for a chunk boundary.

---

## Registered

- **If chunk 2 lands and the ferry miss rate has not moved**, the drift was not what was
  suppressing it and this chunk's premise was wrong. Baseline at the time of writing: **76.4%**
  (`node consonance/tools/ferry.js --report`), down from 77.1% before the first cited dispatch.
- **If chunk 3's registrations are written and nothing ever scores them**, the ordering argument
  above was a story: the instruments were not the blocker, attention was.
- **The librarian may reject these chunk boundaries.** Sequencing is the work-shape half and
  therefore its call, not the chair's; this document is routed to it for exactly that. If it
  reorders with a reason, its order wins.
