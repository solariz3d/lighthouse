# P-INTAKE (L024) — the hand-back route shipped to panes, and the intake append REFUSED

Seat: pane on mount `sibling-0845a868`. Not the author of `9fb6cb7`.
Files touched: `consonance/src-tauri/brief/COMMITTEE.md`, `consonance/src-tauri/src/main.rs`.
Nothing committed. Nothing pushed.

---

## THE HEADLINE

**Edit 1 landed. Edit 2 is REFUSED on a measured number, and the refusal option the packet offered
was right for a reason it did not have: the cost is 25,323 bytes, not ~9KB, and the pane fixed
brief is ALREADY 4,529 bytes OVER its ceiling with transcript eviction already a no-op.**

**And a correction to the packet that matters more than either edit: the COMMITTEE.md change is
ALSO inert until the rebuild.** The packet says *"main.rs changes need one"*. `COMMITTEE.md` is a
bundled resource (`tauri.conf.json:35`) and `room_brief` reads the BUNDLE (tier 2) before the repo
(tier 3), so the shipped app keeps serving the baked copy. Verified, not reasoned:

    ls -l /c/build/lighthouse-target/release/COMMITTEE.md
    -> 8364 bytes, Aug 29 00:27   (the pre-edit file)
    grep -c "then say so on the board in the same turn" /c/build/lighthouse-target/release/COMMITTEE.md
    -> 1

The live app is handing panes the retired board route right now. This is the same
landed-not-shipped class the packet exists to fix, one tier down, and I was one sentence from
reporting the brief half as live.

---

## WHAT LANDED — edit 1

`COMMITTEE.md:133-138`, the *"Your half, concretely"* paragraph. `then say so on the board in the
same turn, using the verbs the control plane lists` is gone; the hand-back now goes to the file,
then to the Librarian by `call_librarian` carrying the POINTER, in the same turn, with nothing in
the call that is not already in the file. `BUILDING.md` step 6 is named as the master and this as
the pane-facing half, so the two cannot quietly become peers and drift.

`Do not commit; the chair commits with attribution` is preserved VERBATIM inside the paragraph —
the `AMENDED 2026-08-26` block immediately below quotes that exact string as its antecedent, and
deleting it would have left the amendment pointing at nothing. Another pointer-that-names-a-position,
caught before it broke rather than after.

One verb name now appears in a document that says the verb list lives in the control plane. That
tension is real and I left a sentence in the file naming it: the route *is* the rule here, so it
cannot be stated without the route, and the rest of the list stays where it was. The existing guard
`the_brief_does_not_duplicate_the_verb_list` bans `chair_inject`, `post_board`, `raise_pull(` and
stays green. **A non-author should rule on whether that is a principled cut or a first crack.**

## WHAT LANDED — the guard (DISCLOSED, outside my named file list)

The packet gave me *"the one `main.rs` intake line"*. I refused that line and wrote a TEST into
`main.rs` instead, in `committee_brief_tests`. Disclosing it here rather than letting a reader find
it, per BRAVO's precedent with `mcp.rs`.

`the_handback_route_reaches_the_pane_intake` asserts the brief carries the route, asserts the
retired board sentence is GONE rather than merely outnumbered, and asserts arrival through
`assemble_intake()` — because a reader-only test would have stayed green through the entire failure
this packet is about.

**Mutation-proven, not asserted:**

    git checkout -- consonance/src-tauri/brief/COMMITTEE.md
    cargo test --bin consonance committee_brief   -> 3 passed, 1 FAILED
                                                     "the brief lost the hand-back route"
    (restore) cargo test --bin consonance committee_brief -> 4 passed, 0 failed

---

## BARS

    grep -c call_librarian consonance/src-tauri/brief/COMMITTEE.md   -> 1     (bar: >= 1)
    cargo test --bin consonance    -> 334 passed, 0 failed, 3 ignored   (333 before; the +1 is mine)
    cargo test  (all targets)      -> arch_test: 11 passed, 1 FAILED

The one red is `arch_test:528`, `record/third_place_prehistory_2026-08-30.md is named by no card`.
**Pre-existing and not mine** — disclosed in `9fb6cb7`'s own message as *"one pre-existing red
surfaced, not caused"*. Still open, still a one-line non-author fix.

---

## THE REFUSAL — edit 2, appending BUILDING.md to the pane intake

The packet priced it at *"~9KB into every pane"* and named the refusal valid. The price is wrong,
and the refusal holds much harder than the packet's own framing of it.

    ls -l consonance/src-tauri/brief/BUILDING.md   -> 25,323 bytes   (2.8x the estimate)
    main.rs:3454  const SHELL_SOFT_CEILING: usize = 140_000;
    main.rs:3448  comment: the harness caps a pane's CLAUDE.md at 150k chars

And the number nobody asked for, written by the app itself into `C:\Consonance\data\persist.log` at
the 03:48:04 regeneration the librarian measured:

    grep -c "SHELL OVER CEILING" persist.log   -> 32
    1788256084 SHELL OVER CEILING pane=0845a868-... fixed_brief=144529 ceiling=140000
    1788256084 SHELL OVER CEILING pane=6fe15f0a-... fixed_brief=144531
    1788256084 SHELL OVER CEILING pane=12fb81f6-... fixed_brief=144531
    1788256084 SHELL OVER CEILING pane=a2122153-... fixed_brief=144531
    grep -c evict persist.log   -> 0

That is my own pane id in the log. **The fixed pane brief is 144,529 against a 140,000 ceiling.**
`budget = SHELL_SOFT_CEILING.saturating_sub(brief + fence_overhead)` (main.rs:3991) is therefore
already 0, `split_off_oldest_records` finds no boundary past the excess, and NOTHING is evicted —
the documented silent-failure mode at main.rs:3472, live for every pane on this machine tonight.

Appending BUILDING.md makes the fixed brief **169,852** — 29,852 over the soft ceiling and **19,852
over the harness's own 150k cap on the file** — spent on a document whose first paragraph says
*"COMMITTEE.md says how to brief a single seat; this says how a whole inquiry moves."* The
pane-facing half of it is one paragraph; the other ~24KB is orchestrator work.

**I also rejected the middle path** — splicing only step 6's block into the intake. That is a second
copy of a live rule with no master, and the 2026-07-12 diving retirement is this room's worked
example of what a second copy does: the documents moved, the carrier did not, and the room taught
the retired route for five weeks. One carrier, pointed at its master, is the fix.

**Honest cost of my own edit:** +260 bytes (8,364 -> 8,624) onto a brief that is already over. The
fix makes the over-ceiling number very slightly worse. It is the cheapest form of the fix I found,
and the ceiling is a separate problem this packet does not touch and should not.

---

## WHAT THIS DOES NOT ESTABLISH

1. **My test cannot catch a stale bundle.** `RESOURCE_ROOM` is `None` under `cargo test`, so
   `room_brief` falls through to the repo file. **A fully green suite is compatible with a shipped
   app serving the old route — which is the state right now.** The gap that bit tonight is still
   open and my guard does not close it. Anyone reading `334 passed` as *"panes now hand back to the
   librarian"* has made the exact error this packet documents.
2. **No runtime verification.** Neither edit has been exercised in a running app. A `.md` and one
   `#[test]` regress nothing tested; that is not the same as being exercised.
3. **`LIBRARIAN.md`'s owed line is still owed and is NOT mine.** `grep -c call_librarian
   consonance/src-tauri/brief/LIBRARIAN.md` -> 0. The librarian pane's shell shows 4 mentions, but
   they come from its own restored transcript (`instances/librarian/CLAUDE.md:6998,7313-7316`), not
   from any brief. `9fb6cb7` named this debt; half of it is now paid.
4. The refusal is a **context-budget** argument. It is not a claim that panes should not know how
   the whole loop moves.

## ONE OBSERVATION, ONE FILE OVER FROM MINE

The packet forbade a tier-1 `~/.consonance/COMMITTEE.md` because it would shadow the bundle
invisibly. **A tier-1 orphan already exists for BOOT:** `C:\Users\zackn\.consonance\BOOT.md`,
39,606 bytes, Aug 31 07:13, byte-identical to the repo copy today. It is currently inert — BOOT
loads via `room_master_path()`, which config points at the repo, not via `room_brief` — so it
shadows nothing. But `room_brief`'s tier 1 is hardcoded to `default_data()` (`%HOME%\.consonance`)
and ignores the configured `data_dir` (`C:\Consonance\data`), so any brief dropped beside it WOULD
shadow, on a path the config does not name. Not mine to act on; named so it is not found later.

---

## SELF-CORRECTIONS

- Started at `C:\Consonance` and got `fatal: not a git repository`. The checkout is
  `C:\Consonance\lighthouse`.
- Took the packet's `~9KB` at face value while drafting the refusal, then measured it. The refusal
  was going to be right for a soft reason before it was right for a hard one.
- Read the packet's *"NOT LIVE UNTIL A REBUILD — `main.rs` changes need one"* as covering the scope,
  and was one sentence from reporting the brief half as live. The bundle tier caught it.

## THE PACKET'S OWN DEFECT, STATED BECAUSE IT IS THE SUBJECT

*"Write your hand-back to the file below"* — no file was below. I used the existing convention
(`exo_memory/handback/`, BRAVO's `p3d-...` precedent). A packet whose subject is *an instruction
that ships without its route* omitted its own route.

## NON-AUTHOR READ OWED

ALPHA or ECHO, not BRAVO. Two calls for them: **(a)** the verb name now in COMMITTEE.md — principled
cut, or first crack in the no-duplicate-lists rule; **(b)** the refusal — whether a pane needs
BUILDING.md whole, given that the honest way to give it to them is to get the fixed brief under
140,000 first, not to add 25KB to a shell already over the harness cap.

---

## AMENDMENT, minutes after the hand-back went out — a THIRD carrier, found in the verb itself

`call_librarian`'s own control-plane description ends *"Then say so on the board as before."* My
first wording was `Not the board, and not the chair`, which reads as forbidding that. Two carriers
for one route, disagreeing, in a packet whose entire subject is a route that shipped in only one
place.

Reworded before it can ship: **`The board is not its destination and the chair is not in this
hop`** — which is what the rule actually says. The board post stays available as visibility; it was
never the hand-back. `cargo test --bin consonance committee_brief` -> 4 passed, 0 failed after the
change; COMMITTEE.md 8,364 -> 8,667 bytes (+303 total).

**Still owed to the non-author read, because I cannot rule on it:** whether the control plane's
sentence should also change. If the system already writes an audit row for every use and every
refusal — the verb's description says it does — then *"then say so on the board"* asks a pane to
hand-write a line the system just wrote, and the two will drift the moment either is edited. That
is a call for whoever owns the verb text, not for me.
