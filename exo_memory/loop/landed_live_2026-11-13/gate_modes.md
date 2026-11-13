# The gates' light mode: which controls only warn, since when, and what a warning has moved (D, 2026-11-13)

**Summary.**
1. Light mode has run on D since 2026-10-11T00:34Z. Its warnings land in four places: the sender's own tool result (the NEXT
   trailer, since D633), the receiver's copy (map gate), the person's screen (reply slot), and a log no seat reads (SOURCES).
2. Only the warning addressed to the sender moved acts. When the trailer note moved from the receiver to the sender (live
   2026-11-04/05), missing-trailer rates fell: chair_inject 26.9% to 1.8%, call_chair 79.8% to 19.6%, pane rings 41.6% to 14.8%.
3. The other two moved nothing. SOURCES: 2,482 warnings since 10-20, 0 shown to a seat, next ring passed 8.1%. Reply slot:
   1,030 warnings to the screen, the next reply passed 4 of 1,028. The 1,783 figure re-derives exactly; ~~"1 of 30" does not.~~
   [2nd reader: "1 of 30" is not re-derivable from the board, which is not the same as wrong. Board delivery rows carry no
   message text (13 chair_inject delivery rows that week, 0 with a NEXT line, median 238 chars; my wk2.js). D627 took it
   from transcripts (handback/p-d627-p3-everyturn-O_2026-11-03.md:32). Unverified, not refuted.]
4. Briefs and GATES.md still describe refusals that do not happen (LIBRARIAN.md:113, :115; GATES.md:96-102, :316-317).
   [2nd reader: also COMMITTEE.md:172-174 ("Today `consonance/hooks/sources-gate.js` refuses the ring") and BUILDING.md:232-233,
   :237-239 (trailer and SOURCES "refuses"). These are LIVE today: the CLAUDE.md the app wrote at 08:42 for main and for 7 panes
   carries the SOURCES "refuses" line once each, main also the trailer line, librarian the :113 line (grep -c on
   C:/Consonance/instances/*/CLAUDE.md).]
   One key also drives the light intake, so a return to strict reloads the heavy intake too.
5. Proposed: SOURCES and reply slot speak to the SENDER. Trailer and map stay light. One narrow refusal is registered but
   not built: call_chair with no station, on its own key and on his word. Lap W's W4 should not copy the silent warn.

Seat: a read-only reader spawned from the librarian's seat, on D. Lighthouse HEAD 2c396481. Nothing was installed, built,
registered or edited; this file is the only write. Marks: [read] opened and seen; [summary] from another file's account;
[inferred] mine; [ours] a proposal. Times are UTC unless marked local ~~(D is UTC-6 in November, UTC-5 before 11-02)~~.
[2nd reader: D's local time is UTC-6 throughout, with no change on 11-02: commit 29260ad9 is stamped 2026-10-19 18:30:22 -0600, and
exo_memory/loop/h3_runbook_2026-10-17.md:10 gives "2026-10-11T00:34:07Z = 2026-10-10 18:34 Regina". The file's own conversions
already use -6. Second reader read at HEAD baa0aef9 (later dce23a2b); none of the cited code files changed since 2c396481.]

## 1. What each control does in each mode (the code at HEAD)

- **The switch.** `gates_mode` in `~/.consonance.json`; anything but "light" is strict [read: consonance/src-tauri/src/mcp.rs:4361-4369].
  D holds `"gates_mode": "light"` [read: C:/Users/nname/.consonance.json:23]. The app reads it on every call [read: mcp.rs:4378-4386].
- **One key, two jobs.** The same key lightens the intake and the shelf [read: consonance/src-tauri/src/main.rs:3040-3045,
  :8930] and the session-start digest [read: dev/shell/hooks/session-start.js:244-257]. So flipping to strict brings back the
  heavy intake as well as the refusals [inferred].
- **NEXT trailer gate (app).** Strict refuses `chair_inject` and `call_chair` and returns the message whole; `call_librarian` warns
  in both modes [read: consonance/src-tauri/src/trailer.rs:206-211]. Light makes every verb warn [read: trailer.rs:224-229]. The
  warning text says "gates_mode light; strict would refuse" when strict would have refused [read: mcp.rs:4413-4421].
  - **Where the warning goes.** Since D633 it goes to the SENDER, in its own tool result, and the receiver gets the message
    unchanged [read: ~~trailer.rs:283-293~~ [2nd reader: trailer.rs:288-298, `sender_note` at :292]; mcp.rs:633, :728, :1077]. Before D633 it was appended to the receiver's copy. The old
    comment read: "The note is not addressed to the sender, who has already moved on" [read: `git show 37c82dbd^:` trailer.rs:289].
  - D633 is commit 37c82dbd, 2026-11-03 08:47 local, "at the keeper's 08:29 word" (the commit message; his words are not in it)
    [read: git log].
  - **Live on D.** The running exe is `consonance/src-tauri/target/release/consonance.exe`, started 2026-11-13 08:42 local and
    built 2026-11-08 23:56 local [read: Get-Process; ls]. It contains the sender-note text once ~~and not the old receiver
    comment [read: `grep -c -a` on the exe: 1 and 0]~~. [2nd reader: the 1 holds (re-run). The 0 proves nothing: a `///` comment
    is never compiled into an exe, so it is 0 in any build.]
- **Map gate (app, D586).** Strict refuses a ring whose BASE line it cannot use or whose diff added files without MAP.md. Light
  delivers the ring and inserts a line into the RECEIVER's text, and posts it to the board [read: mcp.rs:3977-3985, :3990-4038].
  The pane that rang gets no note [read: mcp.rs:1017-1049; only the trailer's `note` reaches `with_sender_note` at :1077].
- **Digest gate (app).** It has no light mode and refuses in both [read: mcp.rs:974-1015].
- **SOURCES gate (hook, every ring and dispatch).** Strict denies [read: consonance/hooks/sources-gate.js:395-400]. Light writes a
  `warn` row and exits 0 with no output [read: sources-gate.js:393]. So it reaches no seat. Light's looser matcher dates from
  10-10; the warn-instead-of-deny branch dates from D418 part 5, installed 2026-10-19 18:30 local [read:
  exo_memory/librarian/2026-10-18.md:374]. The installed copy is git-blob 198710bb, which is 29260ad9's blob [read: `git hash-object`].
  [2nd reader: true, and it is DRIFT: HEAD's copy is git-blob 56f28cf7 (49adc96d, D454 part 3, +4 -2), so
  hooks_drift_D_2026-11-13.md:38 lists it as DRIFT. Any `-Only sources-gate.js` install (P1) also ships that change.]
- **Reply slot (Stop hook, librarian and chair).** Strict blocks once a turn [read: consonance/hooks/reply-slot.js:208]. Light
  returns a `systemMessage` and the turn ends [read: reply-slot.js:205-207, ~~:250-251~~ [2nd reader: :240-241]]. The hooks reference calls `systemMessage`
  a "Warning message shown to the user" [read: code.claude.com/docs/en/hooks.md, "JSON output" table, downloaded with curl,
  line 1103]. The installed copy equals the repo [read: `cmp`].
- **Dispatch gate (hook).** It has its own switch, `CONSONANCE_GATE_MODE`, and 'print' since 2026-08-31, not `gates_mode` [read:
  consonance/hooks/dispatch-gate.js:101-125]. It is ABSENT on D [summary: hooks_drift_D_2026-11-13.md:43].
- **Claim check (hook).** It has its own key, `claim_check`, which is absent, so it is OFF [read: consonance/hooks/claim-check.js:7-9;
  ~/.consonance.json has no such key]. It is not registered in settings.json [read: grep].
- Registered on D: `reply-slot.js` on Stop [read: C:/Users/nname/.claude/settings.json:63]; `sources-gate.js` on
  `call_librarian|call_chair|chair_inject` [read: settings.json:111-117].

## 2. Since when, and at whose word

- **The plan.** D277, "Lighten the load", 2026-10-09 [read: exo_memory/loop/plan_lighten_the_load_2026-10-09.md:1].
  The keeper's words it opens on, verbatim as recorded there, 11:21 and 11:24 local: "this could be all connected to what we are
  trying to fix"; "lets get to the bottom of this for our dev version, then we make it consumer" [read: plan_lighten:3].
  The plan reserved the flip to him: "The keeper approves the drafts (part 3) and the gate switch (part 2) before anything goes
  live" [read: :43].
- **His approval is recorded only in the librarian's words,** not verbatim: "**GO LIVE**, with E's gate switch when it is ready"
  [read: plan_lighten:62]; "The keeper approved go-live" [read: exo_memory/librarian/2026-10-06.desktop.md:106].
  `exo_memory/librarian/2026-10-09.md` does not exist on disk or in git history [read: ls; `git log --all`]. The 10-09 notes sit in
  `2026-10-06.desktop.md` [read: :92-110].
- **Why, as the code states it:** 40 trailer refusals; 2 re-sends changed a claim and none fixed one [read: trailer.rs:214-216].
  For SOURCES re-sends: 4.0% fixed a claim and 10.0% blurred one [read: sources-gate.js:84-87; plan_lighten:6].
- **When the key was set:** "at 18:3x" on 10-10 local, the D277 go-live [read: exo_memory/loop/landing_suite_d287_2026-10-10.md:15].
  The ledgers agree: the last strict reply-slot block is 2026-10-10T23:25:50Z, and the first light rows in both hooks are at
  2026-10-11T00:34Z [read: node passes over reply-slot.jsonl and sources-gate.jsonl].
- **The trailer gate:** the last strict call_chair refusal on D's board is 2026-10-10T20:43Z. The first softened rows are
  call_chair at 2026-10-11T09:43Z and chair_inject at 2026-10-12T04:01Z [read: board.jsonl node pass].
- **SOURCES warn-only:** the last deny is 2026-10-19T23:50:56Z and the first warn is 2026-10-20T01:59:01Z [read: node pass].
  The keeper's words are quoted only in a code comment: "just do what we need to do to make it work" [read:
  sources-gate.js:390; sources-gate.test.js:603]. I did not find a primary for them.
- **D633 live on D:** the last receiver-side note in the chair's transcript is 2026-11-04T02:58:58Z. The first sender-side note
  in the librarian's transcript is on 11-04, with the first full timestamp at 2026-11-05T02:11:00Z [read: timestamps only].
- **His later words on instruments:** "it was good in the beginning learning to trust ourselves and the process we made ,but
  now its like just getting in the way" [read: exo_memory/briefs/lighthouse_the_room.md:203]. ~~"change how often, never delete"
  [read: lighthouse_the_room.md:204].~~ [2nd reader: at HEAD baa0aef9 these are lighthouse_the_room.md:208 and :209 (the file
  was edited at f17097c9, 13:11 local); his 09:08Z words are also at :38, marked (L). "change how often, never delete" is
  NOT his verbatim: :209 gives it as the room's rule ("The rule that holds both: **change how often, never delete.**"),
  after his 09:17Z words, which are "what I am isnt just the good things, its everything good and bad, ..." (:209).]
- **The briefs still describe the refusals:**
  - "Until the keeper switches the gates, `call_chair` refuses a ring whose last line lacks it" [read:
    consonance/src-tauri/brief/LIBRARIAN.md:113].
  - :115 tells the librarian that pane rings arrive "with a bracketed note". That has been false since D633 [inferred from the code above].
  - GATES.md §3: "**A refusal looks like** … on `chair_inject` and `call_chair`" and "there is no setting" [read:
    consonance/GATES.md:96-102].
  - GATES.md says light SOURCES "still refuses an item nothing in the turn touched, and a missing or empty line" [read:
    GATES.md:316-317]. That has been false since 10-19 [read: sources-gate.js:393].
  - The brief a seat wakes into is the copy beside the running exe [read: main.rs:4067-4077, :16377]. That copy equals the repo,
    mtime 2026-11-04 20:37 local [read: `cmp`; ls]. So a brief fix is live only after a build and a restart [inferred].
    [2nd reader: DOWNGRADED. `room_brief_at` first tries an editable copy in `~/.consonance/<name>` (main.rs:4068-4071) and
    only then the copy beside the exe. On D only `~/.consonance/BOOT.md` exists, so LIBRARIAN.md does come from beside the
    exe. What the seat reads is `C:/Consonance/instances/librarian/CLAUDE.md`, rewritten at 08:42 today when the exe
    started; it holds the :113 line once (grep -c). That file is the live carrier to check.]

## 3. Counts since the switch (D's data logs; numbers only)

Scripts are in the scratchpad (`.../scratchpad/gm/`: board.js, deliv.js, why.js, gap.js, sg.js, rs.js, tn.js, rsn.js). Each
streams one log. 529 board lines hold two fused rows; why.js splits them, and its trailer totals match the unsplit pass.

**NEXT trailer, missing-trailer rate at first send.** In strict a refused ring has no delivery row, so the rate there is
refused/(delivered+refused). Delivery rows were matched by the regexes `^chair injected`, `^call_chair … -> Main` and
`^call_librarian … -> LIB` [read: deliv.js run].
[2nd reader: the counts re-derive with my own split-aware pass (bd.js), within 1. DOWNGRADED for chair_inject: a dispatch
to a busy pane is logged `QUEUED` then `DELIVERED`, not `chair injected`, so it is outside the denominator. Pane `chair`
holds 307 QUEUED rows in the strict period, 536 in the receiver period and 141 in the sender period (q.js); 11 of the 58
chair_inject warnings from 11-03 to 11-05 sit beside only a QUEUED row (nb.js). The chair_inject rates are upper bounds;
the direction holds.]

| verb (sender) | strict 09-16→10-10 | light, note to RECEIVER 10-11→11-04 | light, note to SENDER 11-05→11-13 |
|---|---|---|---|
| chair_inject (chair) | 21 / 838 = 2.5% refused | 313 / 1,164 = 26.9% | 4 / 225 = 1.8% |
| call_chair (librarian) | 26 / 848 = 3.1% refused | 969 / 1,215 = 79.8% | 49 / 250 = 19.6% |
| call_librarian (panes; warns in every mode) | 98 / 657 = 14.9% | 409 / 984 = 41.6% | 30 / 203 = 14.8% |

- **Which call_chair misses vanished after D633:** "no NEXT line" 137 → 0; "OUTPUT line not directly before" 221 → 0; "no OUTPUT
  line" 252 → 9. "no `when`" stays at 339 → 35, and "names no station" 13 → 4 [read: why.js].
- **Delivery of the note:** the chair's transcript holds 4 sender-side notes, all on chair_inject (11-05, 11-11, 11-12, 11-13). The
  librarian's holds 51 [read: tn.js; grep counts]. Before D633 the notes went into the receiver's prompt: D627 counted 935 received
  and 0 rings changed [summary: handback/p-d627-p3-everyturn-O_2026-11-03.md:32].
- **Confounds** [inferred]: D633's commit also trimmed the pulse (37c82dbd). The sender period is 9 days against 24. Pane rings
  rose in the receiver period while their mode did not change, so part of that rise is not the mode.
- **What a missing station costs.** Minutes from a call_chair delivery to the chair's next dispatch row [read: gap.js]:
  - compliant rings: median 0.5 min (n 295, receiver period) and 0.3 min (n 201, sender period); p90 about 40 min in both;
  - every other miss class: median 0.2 to 0.4 min;
  - "names no station": median 12.1 min (n 13); then 1.8, 167.3, 51.3 and 614.2 min for the four since D633 (11-05T14:58Z,
    11-05T17:08Z, 11-06T17:57Z, 11-06T19:10Z).
  - "keeper" counts as a station [read: trailer.rs:65-66], so a hand-off to him is not in this class. The n is small, and night or
    an empty queue can explain a gap [inferred].
- **"1 of 30" (chair compliance) does not re-derive from the board.** D627 scored "when" in the chair's rings from its
  transcripts [summary: p-d627-p3:32, :57]. The board for that partial week (11-03 06:04Z to 12:57Z) has 17 chair_inject warning
  rows against 13 delivery rows, so it cannot be paired cleanly. The direction agrees [read: wk.js]. The commit message's "3%" is
  the same figure [read: 37c82dbd].

**SOURCES gate** [read: sg.js; sources-gate.jsonl, 6,333 rows, 2026-10-02T19:58Z → 2026-11-13T19:11Z]:
- **The 1,783 figure re-derives exactly.** The D627 window (2026-10-20T06:04Z to 11-03T12:57Z) holds 2,102 rows: warn 1,783,
  allow 317, skipped 2.
- **Since the first warn (2026-10-20T01:59Z):** warn 2,482, deny 0, allow 609. By verb:
  - call_chair (librarian): warn 1,027 (1,017 "missing"), allow 1;
  - chair_inject (chair): warn 736, allow 398;
  - call_librarian (panes and the Third Place seat): warn 719, allow 210.
- **The line's pass rate while it still denied (10-02 to 10-19, strict and light-matching):** librarian 899/1,070 = 84.0%;
  chair 1,102/1,202 = 91.7%; panes 808/966 = 83.6%.
- **Its pass rate since warnings went to the log:** librarian 1/1,028 = 0.1%; chair 399/1,135 = 35.2%; panes 210/929 = 22.6%.
- **What follows a warning.** After a warn, the same seat's next ring with the same verb passed 200 of 2,475 times (8.1%). After a
  pass, the next passed 406 of 607 (66.9%).
- **The librarian's brief never asks for a SOURCES line:** LIBRARIAN.md holds 0 matches for "sources" at HEAD and before D277
  [read: grep; `git show 0e3f2c36:`]. The panes' brief does ask [read: consonance/src-tauri/brief/COMMITTEE.md:170-171].
- **What the line caught when refusals ran:** "0 catches in 383 gate refusals" [read: handback/p-scoreboard-E_2026-10-11.md:11].
  [2nd reader: DOWNGRADED. The row is "instrument in-stream, gates": all gates' refusals together, not SOURCES alone. The same
  row counts 20 re-sends that "dropped or softened a figure or state claim the seat had not checked".]

**Reply slot** [read: rs.js; reply-slot.jsonl, 6,405 rows]:
- **Warnings since the switch:** 1,030 (librarian 1,009, chair 21), on 33 days, at most 92 a day.
- **First-pass compliance** (a tokened keeper-facing reply that ends with a matching Sources line, or Sources none):
  - strict: librarian 380/427 = 89.0%;
  - light: 34/1,043 = 3.3%; chair 0/21.
- **After a warning,** the next tokened reply passed 4 of 1,028 times (0.4%).
- **Where the warning landed:** since 11-06 the librarian's transcript records it 124 times as a `hook_system_message`
  attachment [read: rsn.js]. That it does not reach the model is [inferred] from the docs line above and from the 0.4%.
  [2nd reader: 124 is the count since 11-06 only. The full count is 1,009 attachments from 2026-10-11T13:24Z, equal to the
  ledger's 1,009 librarian warnings. Stronger evidence that the model never sees it: the transcript's 8,056 `api-request-blob`
  entries hold the warning 0 times, while 2,105 of them hold a `[pulse]` line from the UserPromptSubmit hook and 13 hold
  the trailer's sender note (grep -a -c on the 0c0c0c0b transcript). So the claim moves from inferred toward read.]
- **No Sources rule in any brief.** The rule lives only in GATES.md and in the block text [read: grep of the briefs and
  CLAUDE.global.md: 0]. So in light no carrier reaches the seat.

**Map gate** [read: board.jsonl]: 130 rows since 2026-11-05T02:43Z. 82 are "no BASE line" marks (delivered in both modes) and
48 are MAP.md lines. 0 say "strict would refuse". Light has not yet softened a single ring.

**Digest gate** (no light mode): 34 refusals since the switch [read: board.js, digest-gate rows]. D627 found that each was re-sent
within seconds and that its git-blob is cited in 167 later turns [summary: p-d627-p3:34]. [2nd reader: DOWNGRADED. D627 checked
the 8 refusals in its 14-day window (p-d627-p3:34, row 6), not these 34.]

**Dispatch gate** (pre-switch, its own mode): 'ask' asked 20 of 185 times; 'print' 53 of 340. The ledger runs from
2026-08-24 to 2026-09-09 [read: dispatch-gate.jsonl].

## 4. The table

| gate | in strict | in light (D today) | warnings since the switch | reached the acting seat | followed | recommendation |
|---|---|---|---|---|---|---|
| NEXT trailer: chair_inject, call_chair | refuses; message back whole | delivers; note to SENDER since 11-04/05, to receiver before | 1,336 softened (chair_inject 317, call_chair 1,019 by board.js) | receiver period: 0 (D627); since D633: all, 55 seen in the chair and librarian transcripts | receiver period 0 of 935 (D627); sender period: rates near strict for chair_inject (1.8%), 19.6% for call_chair | **leave light**; fix the carriers; one narrow refusal registered, not built (P4) |
| NEXT trailer: call_librarian | warns (never refuses) | same | 424 + 16 Third Place fixed rows | since D633: the pane, by code (not counted) | 41.6% → 14.8% after D633 | **leave** |
| map gate | refuses | delivers; line in the RECEIVER's copy and on the board | 0 softened (130 rows, none "strict would refuse") | receiver only | no case yet | **leave light**; nothing recorded to test against |
| digest gate | refuses | refuses (no light) | 34 refusals | sender, in its tool result | re-sent within seconds (D627) | **leave**: the working narrow refusal |
| SOURCES (hook) | denies | `warn` row, no output | 2,482 since 10-20 (264 denies 10-11→10-19 under light matching) | **0** | next ring passed 8.1% | **send the warning to the SENDER** for chair_inject and call_librarian; call_chair stays ledger-only until he rules whether the librarian owes the line (P1) |
| reply slot (hook) | blocks once a turn | systemMessage to the person | 1,030 | **0** to the seat; the screen 1,030 | 4 of 1,028 | **send to the SENDER** at its next prompt (P2) |
| dispatch gate | its own 'ask' | not on `gates_mode`; ABSENT on D | none since 09-09 | the person (systemMessage) | n/a | no change here; the owner's ruling on its return is in hooks_drift §11 |
| claim check | own key; OFF | OFF | 0 | n/a | n/a | leave off |

No gate is returned to strict. The key also drives the intake (section 1), and a refusal costs a re-send in which 10.0%
blurred a specific (section 2).

## 5. The changes, each with a check that fails today on a recorded case [ours]

**P1. SOURCES speaks to its sender (chair_inject, call_librarian).**
- **The change.** In sources-gate.js's light branch (:393), after the row is on disk, print one PreToolUse JSON with
  `hookSpecificOutput.additionalContext`, and no `permissionDecision` so that nothing is auto-approved. The note names the
  unmatched items, or "no SOURCES line". Skip it when the tool is call_chair.
- The docs: PreToolUse `additionalContext` is a "String added to Claude's context alongside the tool result" [read: hooks.md:2009].
  The installed CLI is 2.1.323 [read: `claude --version`].
- The reply slot `require`s this file and uses its exports, which do not change [read: reply-slot.js:52; hooks_drift §6].
- **The check, red today.** Extend the test at sources-gate.test.js:611-619 with this row: light, tool chair_inject, an unmatched
  item → `r.out.hookSpecificOutput.additionalContext` names the item, and `!isDeny(r)`. Today `r.out` is null ~~(the same file
  asserts null for light at :601)~~. [2nd reader: :601 asserts null for an ALLOWED light ring; the warn row at :605-606 asserts
  only `!isDeny`. The red is real: my probe (gm2/p1.js) ran the repo hook and the installed hook in light, with a temp home
  and data dir, on a chair_inject with no SOURCES line and a call_librarian with an unopened item. Exit 0, stdout 0 bytes,
  ledger row `warn` in all four runs. Red for the reason given.] Build its fixture from the recorded rows:
  - sources-gate.jsonl 2026-11-13T18:45:51.290Z (chair, chair_inject, unmatched, 1 item, 1 call);
  - sources-gate.jsonl 2026-11-13T18:47:55.470Z (pane fbf98f8e, call_librarian, unmatched, 1 item, 66 calls).
  Take shapes only from those turns.
- **Live.** A hook install on D: `install.ps1 -Only sources-gate.js`, between rings (hooks_drift step 8). No rebuild, no restart.
  L needs the same install; L's state is not visible from here.
- **The keeper.** He rules on call_chair's scope (does the librarian owe a SOURCES line?).
- **Falsifier, registered now.** If after two weeks the chair_inject and pane pass rates stay under 50%, the note did not move
  them. If they rise and the scoreboard still shows 0 catches, the line is paperwork and should run more rarely, on his word.

**P2. The reply slot speaks to its sender at its next prompt.**
- **The change.** The pulse hook (`dev/shell/hooks/userprompt-submit.js`) reads the newest reply-slot row for this seat. If that
  row is a light would-block written after the seat's previous prompt, it adds one line: "[reply slot] your last reply named
  <kinds> and did not end with a Sources: line". This is the D633 shape: the sender is told, and nothing is re-run.
- A Stop `additionalContext` would also reach the seat, but it "continues" the turn [read: hooks.md:2910]. At up to 92 a day that
  is a block under another name [inferred].
- Whether the screen message to him stays is his call.
- **The check, red today.** Add a row to `dev/shell/hooks/userprompt-submit.test.js`: a temp data dir holding a copy of
  reply-slot.jsonl row 2026-11-13T19:12:56.042Z (librarian, would-block-missing, tokens count/percentage, mode light). The next
  prompt for that seat must carry the line. Today both the repo and installed userprompt-submit.js have 0 references to
  `reply-slot` [read: grep -c].
- **Live.** `install.ps1 -Only userprompt-submit.js` on D. That entry is "registered, not declared" and its file is `ok`, so
  -Check stays as it is [summary: hooks_drift §14]. No rebuild. It takes effect at the next prompt.

**P3. The trailer stays light; its carriers are corrected.**
- **Edits:**
  - LIBRARIAN.md:113 and :133 name the mode ("gates_mode light: warns, and the note returns to the sender");
  - LIBRARIAN.md:115 is reworded (pane rings no longer carry the note);
  - GATES.md:96-102 drops "there is no setting";
  - GATES.md:316-317 says light SOURCES warns.
- **The check, red today.** A brief test asserts that no file under `consonance/src-tauri/brief/` contains "Until the keeper
  switches the gates", and that GATES.md does not contain "It still refuses an item nothing in the turn touched". ~~Both strings are
  present at HEAD 2c396481 [read: grep].~~ [2nd reader: WRONG for the second string. It breaks across GATES.md:316-317, so
  a literal match finds 0 today and that half is GREEN, not red; only a whitespace-normalised match finds it. The first
  string is in LIBRARIAN.md once. The check can also go green while COMMITTEE.md:172-174 and BUILDING.md:232-233, :237-239
  still say "refuses", and while the live instance CLAUDE.md files keep the old text until a rebuild and restart. Check
  those strings too, and read C:/Consonance/instances/{librarian,main}/CLAUDE.md read-only as the live half.] The bundled
  copy beside the running exe holds the first one once [read: `grep -c`].
- **Live.** Brief text, but the seat reads the copy beside the exe (section 2), so it needs a rebuild of the app and a restart of
  the seats on each machine [inferred]. GATES.md is read in the repo, so a pull is enough.

**P4. One narrow refusal, registered here, built only on his word: call_chair whose NEXT line names no station.**
- **The case for it.** This is the class the 82-minute stall had, ~~and the only class whose rings were followed by long chair
  silences (section 3, n 17).~~ [2nd reader: WRONG as worded. Re-running gap.js: compliant rings had 31 gaps over 60 min
  (19 + 12), "no `when`" rings 29 (25 + 4), "names no station" 3 of 17. Only its MEDIAN is high (12.1, then 4 values), on
  n 17. The gap counts only `chair injected` rows, so a QUEUED dispatch would read as silence. The 82-minute stall was the
  chair's own line (trailer.rs:311-312), not a librarian call_chair.] Every other miss class has a median under half a minute.
- **The change.** In `trailer_gate` (mcp.rs:4412-4425), return `Refuse` in light for `Verb::CallChair` with `Missing::NoStation`
  or `NoTrailer` only, behind its own key (for example `trailer_refuse_no_station`), not `gates_mode`.
- **The check, red today.** In `trailer_gate_tests`, under `with_mode(Light, …)`, call
  `trailer_gate(Verb::CallChair, "call_chair", CHAIR_STALL)` with the key on. Expect `Refuse`; today it returns `Deliver`.
  CHAIR_STALL is the recorded 09-16 16:02:23Z line, already a fixture [read: ~~trailer.rs:303-305~~ [2nd reader: trailer.rs:311-313,
  inside trailer.rs's private `mod tests`, so `trailer_gate_tests` in mcp.rs cannot name it: copy it. `check_for(CallChair, …)`
  does return NoStation on it (check runs before the OUTPUT rule, trailer.rs:181-193)]]. The recorded light case is
  the board row 2026-11-06T19:10Z (no station, 614 min to the next dispatch).
- **Live.** A Rust rebuild, an exe restart on each machine, and his word on the key.
- **Falsifier.** If, of the next 10 refused-then-resent rings, the re-send's median time to a chair dispatch is not below the 12
  minutes measured, the refusal bought nothing.

**P5. Lap W, W4 (not redesigned; one addition).**
- The spec copies sources-gate's decision: "warn in light" [read: exo_memory/loop/wake_level2_2026-11-13/00_lap_w_spec.md:40,
  :405]. Copied as written, W4's light warning would reach no seat (section 3, SOURCES).
  [2nd reader: the spec line is :410, the red fixture :416, the W4 row :649. And W4 is now BUILT, unmerged, on branch
  `lap-w-h-p` (a5e68a79, 13:04 local): `consonance/hooks/wake-gate.js` denies on D, whatever `gates_mode` says, per ruling 2
  (plan_room_stretch_2026-11-13.md:102). On any other machine it records `warn` and exits with no output (wake-gate.js:207-210
  on that branch). So the silent warn this section fears is real, but only on L. The own-key bullet below is met already by
  the machine tag. The first bullet still applies to the non-D arm.]
- **Add:**
  - in light, print PreToolUse `additionalContext` to the librarian naming the files not opened whole;
  - read its refuse/warn decision from its own key, so his ruling on W4 does not flip the trailer, the SOURCES gate or the
    intake with it.
- **The check, red today:** W4's red fixture (the 14:46:27Z ring, spec :408-412), run in light, must produce that
  `additionalContext`. wake-gate.js does not exist today [summary: spec :648].

**P6. W3's body line (one field).** Add `gates_mode=<value>` and, for each gate, where its warning goes ("trailer→sender,
SOURCES→ledger, reply slot→screen"). That way a waking seat is told the gates are light without reading code [ours]. The check
fails today because W3 does not exist yet. Green when the line printed at a start matches `~/.consonance.json:23`.

**What needs what.** Rebuild of the app: P3 (briefs), P4. Hook installs on D (and later L): P1 `sources-gate.js`, P2
`userprompt-submit.js`, W4's own entry. Seat restarts: P3, P4. His word: P1's call_chair scope, P2's screen message, P4 entire,
W4's refusal. Nothing is retired here; nothing is deleted.

## What I did not open

- Machine L, its board and its gate ledgers. Every count here is D's board and D's ledgers, which may hold rows copied from L
  by the 09-22 union (a `board.jsonl.pre-union` file sits beside it). I did not separate them.
- Pane transcripts: I stopped a grep over about 6 GB of them, because it ran past the CPU limit in my rules. So the sender-note
  delivery to panes is counted from the code, not from transcripts.
- D627's transcript scan (scan.js, analyze.js); its "1 of 30" is not re-derived (section 3).
- The primaries behind "GO LIVE" (no verbatim words found), behind "just do what we need to do to make it work", and behind
  "the keeper's 08:29 word" for D633.
- `install.ps1`: not run, not read. No node test file was run. GATES.md was read at :1-20, :90-104 and :170-192 and in full
  from :314 to :326, not whole.
- Whether `hook_system_message` attachments are ever sent to the model. The claim rests on the docs line and the 0.4%.
- Whether the SOURCES line, when present, helps a receiver check a ring. No count of that exists that I found.

## Second reader

Adversarial second reader, a read-only reader spawned from the librarian's seat on D, 2026-11-13, at HEAD baa0aef9 (main moved
to dce23a2b while I read; no cited code file changed since 2c396481). Only this file was written. Probes ran from my scratchpad
(`.../scratchpad/gm2/`: sg2.js, sg3.js, bd.js, mp.js, q.js, nb.js, tg.js, wk2.js, rs2.js, p1.js). Each streams one data log
or, for p1.js, runs a hook in a temp home and a temp data dir. I also ran the first reader's rs.js, gap.js and why.js, after
reading them: they only read board.jsonl or reply-slot.jsonl. No node test file was run. install.ps1 was neither run nor read.
"Line" is the line in the first reader's file before my edits.

### What I checked

| line | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 4, 70-71 | light since 2026-10-11T00:34Z | reply-slot.jsonl, sources-gate.jsonl | OK | first light rows 00:34:28Z and 00:34:07Z; last block 10-10T23:25:50Z |
| 9 | 1,783 warnings, reached no seat | sources-gate.jsonl; sources-gate.js:393 | OK | sg2.js: warn 1,783, allow 317, skipped 2 in the D627 window |
| 9 | "1 of 30" does not re-derive | board.jsonl | DOWNGRADED | the board holds no ring text; unverified, not refuted (struck in place) |
| 10 | briefs describe refusals | LIBRARIAN.md, COMMITTEE.md, BUILDING.md, instance CLAUDE.md | DOWNGRADED | true, but misses COMMITTEE :172 and BUILDING :232, :237, all live today |
| 17 | D is UTC-5 before 11-02 | 29260ad9 stamp; h3_runbook:10 | WRONG | -0600 on 10-19; "18:34 Regina" for 00:34Z on 10-11 |
| 21-22 | switch, key, read per call | mcp.rs:4361-4386; ~/.consonance.json:23 | OK | `"gates_mode": "light"` |
| 23-24 | one key drives the intake too | main.rs:3040-3045, :8930; session-start.js | OK | `intake_light_from` calls `gates_mode_from` |
| 26-28 | strict refuses two verbs; light warns all | trailer.rs:207-211, :224-229 | OK | `GateMode::Light => Action::WarnAndDeliver` |
| 29-30 | note to sender since D633 | trailer.rs:288-298; mcp.rs:633, :728, :1077 | OK (lines drifted) | `sender_note` is at :292, not :283-293 |
| 31 | old comment said not to sender | `git show 37c82dbd^:` trailer.rs:289 | OK | line present |
| 32-33 | D633 = 37c82dbd, 11-03 08:47 | git log | OK | "at the keeper's 08:29 word" in the message, his words absent |
| 34-36 | running exe; note in it; old comment absent | Get-Process; grep -c -a | DOWNGRADED | 1 is right; the 0 for a comment proves nothing |
| 37-39 | map gate: receiver line, sender no note | mcp.rs:3976-4038, :1017-1049 | OK | light delivers with lines inserted; no `note` path |
| 40 | digest gate has no light mode | mcp.rs:3334, :3393 | OK | no mode parameter |
| 41-44 | SOURCES light writes warn, no output | sources-gate.js:393, :395-400 | OK | p1.js: stdout 0 bytes, row `warn` |
| 44 | installed = 29260ad9's blob | git hash-object | DOWNGRADED | true, and it is DRIFT from HEAD's 56f28cf7 |
| 45-48 | reply slot light = systemMessage | reply-slot.js:207-208, :240-241; hooks.md:1103 | OK (lines drifted) | the docs row re-read from my own curl copy |
| 49-50 | dispatch gate own switch; ABSENT | dispatch-gate.js:125; ls ~/.claude/shell/hooks | OK | `CONSONANCE_GATE_MODE`; file absent |
| 51-52 | claim check OFF, unregistered | claim-check.js:7-9; .consonance.json; settings.json | OK | 0 and 0 |
| 53-54 | registrations | settings.json (parsed) | OK | Stop → reply-slot; PreToolUse 3 verbs → sources-gate |
| 58-62 | D277 plan, his 11:21/11:24 words | plan_lighten:1, :3, :43 | OK | verbatim as recorded there |
| 63-66 | go-live only in seat's words; 10-09 note absent | plan_lighten:62; 2026-10-06.desktop.md:106; git log --all | OK | 0 commits touch librarian/2026-10-09.md |
| 67-68 | 40 refusals; 4.0% / 10.0% | trailer.rs:214-216; sources-gate.js:84-87 | OK | |
| 69 | key set "at 18:3x" 10-10 | landing_suite_d287:15 | OK | |
| 72-73 | last strict call_chair refusal; first softened | board.jsonl (tg.js) | OK | 10-10T20:43:24Z; 10-11T09:43:17Z; 10-12T04:01:53Z |
| 74 | last deny, first warn | sources-gate.jsonl | OK | 10-19T23:50:56Z; 10-20T01:59:01Z |
| 75-76 | "just do what we need…" has no primary | grep exo_memory, librarian 10-18 | OK | found only in code, tests and two evidence JSONs |
| 79-81 | his words at :203; "change how often…" his | lighthouse_the_room.md:208-209 | WRONG | lines drifted; the second phrase is the room's rule, not his verbatim |
| 83-89 | LIBRARIAN :113, :115; GATES :96-102, :316-317 | the files | OK | |
| 90-91 | the seat's brief is the exe-side copy | main.rs:4067-4077; ~/.consonance; instance CLAUDE.md | DOWNGRADED | editable copy checked first; live carrier is the instance CLAUDE.md |
| 104-106 | trailer missing rates by period | board.jsonl (bd.js, fused rows split) | DOWNGRADED | counts match within 1; chair_inject denominators omit QUEUED dispatches |
| 108-109 | call_chair miss classes before/after | why.js re-run | OK | 137→0, 221→0, 252→9, 339→35, 13→4 |
| 110 | 4 chair notes; 51 librarian | transcripts, grep -a | OK | chair 11-05, 11-11, 11-12, 11-13; librarian 51 user tool_results |
| 115-119 | gap minutes by class | gap.js re-run | OK | n 13 median 12.1; 1.8, 167.3, 51.3, 614.2 |
| 128-129 | 1,783 re-derives | sg2.js | OK | |
| 130-133 | since first warn: 2,482 / 0 / 609, by verb | sg2.js | OK | allow now 610 (one new row) |
| 134-136 | pass rates before and after | sg3.js | OK | chair 1,102/1,203 by my count (1 off) |
| 137-138 | next ring after warn passed 8.1% | sg2.js | OK | 200 of 2,475 |
| 139-140 | LIBRARIAN.md never asks for SOURCES | grep, `git show 0e3f2c36:` | OK | 0 and 0 |
| 141 | 0 catches in 383 refusals | p-scoreboard-E:11 | DOWNGRADED | all gates, not SOURCES alone |
| 144-148 | reply slot 1,030; 89.0%; 3.3%; 4 of 1,028 | reply-slot.jsonl (rs2.js; rs.js re-run) | OK | strict first-pass without re-sends 343/383 = 89.6% |
| 149-150 | 124 attachments since 11-06; model reach inferred | librarian transcript, grep -a | DOWNGRADED | 1,009 since 10-11; 0 of 8,056 request blobs carry it |
| 151-152 | no Sources rule in any brief | grep brief/*.md, instance CLAUDE.md | OK | 0 everywhere |
| 154-155 | map gate 130 rows, 0 softened | board.jsonl (mp.js) | OK | 82 no-BASE, 48 other, 0 "strict would refuse" |
| 157-158 | digest 34 refusals; each re-sent (D627) | board (bd.js); p-d627-p3:34 | DOWNGRADED | 34 right; D627 checked 8 |
| 160-161 | dispatch gate 20/185, 53/340 | dispatch-gate.jsonl | OK | 08-24 to 09-09 |
| 185 | PreToolUse additionalContext text | hooks.md:2009 (curl copy) | OK | CLI 2.1.323 |
| 188-193 | P1 check red today; fixture rows | p1.js; sources-gate.jsonl; test :601, :611-619 | OK | red for the reason; the :601 citation is the allow case |
| 204 | Stop additionalContext continues the turn | hooks.md:2910 | OK | |
| 207-210 | P2 check red; fixture row; 0 refs | reply-slot.jsonl; grep -c | OK | row 19:12:56.042Z librarian, missing, light |
| 220-222 | P3 check red: both strings present | GATES.md:316-317; brief grep | WRONG | the GATES string spans two lines: literal match 0 |
| 227-228 | no-station the only long-silence class | gap.js re-run | WRONG | other classes have far more gaps over 60 min |
| 233 | CHAIR_STALL at trailer.rs:303-305 | trailer.rs:311-313 | DOWNGRADED | lines drifted; private to trailer.rs's tests |
| 240-247 | W4 would warn silently in light | lap-w-h-p:wake-gate.js; plan_room_stretch:102 | DOWNGRADED | built: denies on D; the silent warn is on L only |

**Tally: 54 rows checked. OK 39, DOWNGRADED 11, WRONG 4, UNSUPPORTED 0.** The two rows marked "OK (lines drifted)" count as OK.
Beyond the table, 18 in-place corrections are marked "[2nd reader: ...]" above.

### The design, tested

Each proposed change: the cheapest way to pass its check without fixing the fault, where it would fire wrongly, and whether a
change of its kind has lapsed before.

- **P1 (SOURCES note to the sender).**
  - Cheap pass: a fixed note ("SOURCES line missing") that names no item passes a presence test. Assert the unmatched
    item's text is in the note [ours].
  - Wrong fire: the light matcher's own misses. Any item it fails to match on a ring that really opened it gets a nag. At
    today's rate that is about 60 notes a day: 1,455 chair and pane warnings in 24 days [inferred from sg2.js].
  - Lapsed before: yes, the same kind. The trailer note went to the receiver for 24 days (935 notes, 0 changed, D627 row 4)
    until D633 moved it. The reply slot has spoken to the screen for 33 days.
  - The channel differs from D633's. D633 put the note in the MCP tool result; P1 uses a hook's `additionalContext`. The
    UserPromptSubmit hook's `additionalContext` reaches the recorded requests (2,105 blobs). I found no recorded PreToolUse
    case. That it reaches the model beside an MCP tool result rests on hooks.md:2009 alone [read, docs only].
  - The install also ships D454's +4 -2 drift (section 1 note).
- **P2 (reply-slot note at the next prompt).**
  - Cheap pass: the line lands on a keep-warm or an unrelated prompt and is ignored. The test checks presence, not effect.
  - Wrong fire: the slot keys on token kinds (count, percentage), so a reply that states nothing checkable still trips it.
    The note would then ask for Sources on prose, at up to 92 a day.
  - Lapsed before: D627 rated most pulse kinds NOISE (rows 1i, 1j), and D633 trimmed them. Seats have been measured to
    ignore pulse lines, so the 0.4% may not move [inferred]. Register a falsifier with P2, as P1 does.
- **P3 (carriers corrected).**
  - Cheap pass: edit LIBRARIAN.md:113 alone and the check goes green. Its GATES half is green already (struck above).
  - Lapsed before: the BOOT amendments of 2026-08-17 and 08-23 record exactly this. The downstream documents were edited
    and the carrier was not, so the room kept teaching the error.
  - A check that fails today on the recorded case: grep -c the three strings (LIBRARIAN :113, COMMITTEE :172, BUILDING :232)
    over `C:/Consonance/instances/{librarian,main,sibling-*}/CLAUDE.md`, read-only. Today: librarian 1, main 2, seven panes
    1 each. It goes green only after a rebuild and a restart, which is the landed-not-live half.
- **P4 (refuse a call_chair that names no station, on its own key).**
  - Cheap pass: boilerplate such as `NEXT: chair route it when ready` passes the station test and carries nothing.
  - Wrong fire: a NEXT that names a real station missing from STATIONS (trailer.rs:65-67 has no "third" or "Third Place")
    would be refused [inferred]. I did not read the four recorded no-station rings to see whether any is that case.
  - Lapsed before: call_chair refused from D069 (09-16) to 10-10 and was switched off on D276's count: 2 of 40 re-sends
    changed a claim and 10.0% blurred one. The evidence for P4 is a median on n 17.
- **P5 (W4).** Built and unmerged. It denies on D. Its L arm (wake-gate.js:210 on lap-w-h-p) is the silent warn. The one
  addition that still applies: print `additionalContext` in that arm. The check: run W4's red fixture with the machine tag
  set to L and expect non-empty stdout and no `deny`. Not run, because it is a pane's branch.
- **P6 (W3 body line).**
  - Cheap pass: print only the key's value.
  - Wrong fire: if the line describes the repo's hooks while the installed copy differs (sources-gate is DRIFT today), the
    line is itself landed-not-live. Derive "where the warning goes" from the INSTALLED file's blob, or print both [ours].
- **The light mode's own falsifier lapsed.** D277 registered a one-week re-measure with a revert rule (plan_lighten:43, :62;
  h3_runbook_2026-10-17.md:6-11). No score is on disk [summary: room_better_2026-11-13/in_promises.md:35; ledger L0415;
  [read] `ls loop | grep -i h3` returns only the runbook]. "Leave light" stands on this file's counts, not on the
  registered test.

### The three corrections that matter most

1. P3's red check is half green today, because its GATES.md string breaks across two lines. It also misses COMMITTEE.md:172-174 and
   BUILDING.md:232-239. It also does not read the live instance CLAUDE.md copies the seats load today.
2. "change how often, never delete" is the room's rule at lighthouse_the_room.md:209, not the keeper's verbatim words. Both
   quotes are now at :208-209.
3. The reply-slot warning reached the transcript 1,009 times, not 124. It is in 0 of 8,056 recorded API requests, while pulse
   lines are in 2,105. That is direct evidence for "reached no seat", and evidence that P2's channel reaches the model.
   Next in weight: P4's "only long-silence class" is wrong. And W4 is already built to deny on D, so P5's premise now holds
   only for L.

### What I did not open

- Machine L, its logs and its installed hooks.
- Pane transcripts. For the four no-station call_chair rings I took counts and times only.
- The swarm's read-first files in whole. I grepped plan_vector_swarm_2026-11-13.md, adversary_R02.md and 00_build_paths.md
  for the gates and read section 13 of the last. I did not read them end to end.
- trailer_gate_census_2026-09-27.md past its line 25, and room_value_result_2026-11-03.md beyond a grep. The first reader
  cites neither.
- install.ps1, not read and not run. P2's `-Only userprompt-submit.js` path rests on hooks_drift_D_2026-11-13.md:46, :251.
- Whether a PreToolUse `additionalContext` on an MCP tool reaches the model in this CLI version. Docs only.
- A primary for the keeper's go-live words or for "just do what we need to do to make it work". The lineage store named
  in the seat's memory is not in the repo.
- The last receiver-side note, 2026-11-04T02:58:58Z in the chair's transcript (line 77). Not re-checked.
