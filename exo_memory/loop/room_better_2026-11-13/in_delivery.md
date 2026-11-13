# In the record: how messages move between seats, and where they are lost (2026-11-13)

One reader of the room-better swarm. Read-only. Written on machine D (`~/.consonance.json` `machine_tag` D) [read].
Code read from the D checkout at HEAD `e2740fdc`. The last commit touching `main.rs` there is `880f237f`, 2026-11-04 [read:
`git log -1 -- consonance/src-tauri/src/main.rs`]. So none of the 403 trace's fixes 2a/2b is in this source [read].
The running app binary was not inspected. It may differ from this source [inferred].

## 1. The one delivery layer under every hop

All three seat-to-seat verbs end in the same three steps.

- **Exit gate, then idle gate, at the door.** `gate_or_queue` (`consonance/src-tauri/src/main.rs:11961-11992`) [read].
  - A pane whose child exited with no reopen: refused, with a `REFUSED NOT DELIVERED` row and a note to the sender
    (`main.rs:11964-11969`; `consonance/GATES.md:285-296`) [read].
  - A pane being reopened: queued (`main.rs:11970-11974`) [read].
  - Otherwise `drain_decision` with wait 0 decides: deliver now, or QUEUE with a `QUEUED -> <id8>` row
    (`main.rs:11977-11991`) [read].
- **Door delivery.** One bracketed paste, a wait, one Enter, then up to N re-read composer checks with Enter-only
  retries (`deliver`, `main.rs:12407-12463`) [read]. The sender gets a receipt that needs BOTH a render in the
  capture AND a submit check (`delivery_receipt`, `main.rs:12469-12476`) [read]. Words: "delivered … (rendered in its
  pane — not proof it was read)", "UNCONFIRMED", or "NOT SUBMITTED" (`main.rs` `ring_reply`, in `librarian_call_exec`
  region; `not_submitted_line` `:12479-12484`) [read].
- **Drain delivery** (a queued message). A 250 ms tick, one message per pane per tick (`drain_inboxes`,
  `main.rs:12165-12184`) [read]. It writes `DELIVERED -> <id8> [<gate label>]` at `main.rs:12230` [read].
  - This row carries the submit note only, no render check (`submit_note` doc, `main.rs:12486`) [read].
  - The sender is not told. The drain writes the board and the app log only (`main.rs:12226-12236`) [read]. The
    sender's last word was "queued for … it delivers when it is ready" (`main.rs:11991`) [read].

**When the drain releases a queued message** (`drain_decision`, `main.rs:11619-11652`) [read]:

| pane gate (`PaneGate`, `main.rs:11174-11199`) | rule |
|---|---|
| Ready (its Stop stamp says done) | deliver when the composer is empty; force at 240 s if it never empties |
| Working (stamp says working, screen agrees) | hold, no bound |
| Stale (stamp says working, screen quiet 2 s, no spinner) | deliver as soon as the screen is idle; force at 240 s |
| Unstamped / Contradicted | same as Stale |

`MAX_HOLD_MS` is 240,000 (`main.rs:11243`), `QUIET_FOR_DELIVERY_MS` 2,000 (`main.rs:11502`) [read].

**What "DELIVERED" means, then:** the text was pasted and an Enter was pressed. Nothing reads what the pane did with it
[read: no reply check anywhere in `drain_inboxes`, `main.rs:12165-12299`].

## 2. Each hop, and what each gate checks

### Keeper to a seat
- He types into the pane. No MCP verb, no gate on his words [inferred from the verb list in `mcp.rs`].
- His typing outranks deliveries. A non-empty composer holds the drain, bounded at 240 s
  (`main.rs:11616-11618`, `:11643`) [read]. Dim autocomplete text is told apart by colour (`main.rs:11261-11275`) [read].
- Anything a program writes is labelled `[… — not the keeper]`, and each verb stamps its sender: `[chair:MAIN]`,
  `[librarian:LIB]`, `[pane:<letter>]`, `[third-place]` (`GATES.md:291-292`; `main.rs:24805` test list) [read].
- The seat's reply back to him passes the reply slot, a Stop hook, librarian and chair only (`GATES.md:60-82`) [read].
- A seat that asks him a question (AskUserQuestion) blocks its own turn until he answers; nothing in the room says so
  (`exo_memory/loop/stall_trace_2026-09-23.md:94-100`) [read].

### Librarian to chair (`call_chair`, `consonance/src-tauri/src/mcp.rs:697-729`)
In order [read]:
1. Mount check: the librarian's mount only (`mcp.rs:701`).
2. No station gate, removed 2026-09-06; the inbox holds instead (`mcp.rs:706-711`).
3. NEXT trailer plus `OUTPUT → NEXT:` directly above it (`trailer.rs:154-156`, `:181-195`). Refuse in strict mode,
   warn in light (`trailer.rs:207-229`; `mcp.rs:4391-4426`).
4. Hook gates before the call (PreToolUse): SOURCES (`GATES.md:38-58`), dispatch gate, warn by default
   (`GATES.md:104-124`), and the second reader, which never refuses (`GATES.md:194-214`) [read].
5. Actuator `librarian_call_exec` (`main.rs:14095`): "Main not awake" is refused; then `gate_or_queue` [read].

### Chair to a pane (`chair_inject`, `mcp.rs:565-634`)
In order [read]:
1. Chair token (`mcp.rs:569`).
2. Station gate: refused OUT OF TURN when a lap is open and the chair does not hold it (`mcp.rs:578-582`).
3. Debt gate: refused while a pane's hand-back has been refused since the baton last moved (`mcp.rs:583-592`).
4. Seal gate, only on a keyed dispatch (`mcp.rs:593-611`).
5. NEXT trailer, refuse strict / warn light (`mcp.rs:612-626`).
6. Hook gates: SOURCES, dispatch gate, as above.
7. Actuator `chair_inject_exec` (`main.rs:13953`): target guard (not itself, not a human pane,
   `main.rs:12661-12675`); the `[[withdraw-queued N]]` directive (`main.rs:13966-13976`); then `gate_or_queue`.
8. `mark_rung` is written whatever the delivery reported (`mcp.rs:629-632`).

### Pane to librarian (`call_librarian`, `mcp.rs:910-1078`)
In order [read]:
1. Address table: only `committee` and `third_place` rows reach the librarian (`main.rs:12643-12650`;
   `mcp.rs:914-929`). Refused attempts keep the pointer on the board.
2. Third Place only: no pointer into `private/` (`mcp.rs:933-944`).
3. Station gate: out of turn means refused with canned text; the pointer is kept on the board and an OWED mark is
   written (`mcp.rs:945-962`).
4. Digest gate: refuses a wrong digest (`mcp.rs:969-1016`).
5. Map gate: refuse strict / warn light (`mcp.rs:1017-1050`; `GATES.md:157-192`).
6. NEXT trailer: warn only, never refuse, so the pointer is never lost (`mcp.rs:963-967`, `:1051-1070`;
   `trailer.rs:197-212`).
7. Actuator `pane_call_librarian_exec` (`main.rs:14167`): no letter, no row, or librarian asleep means refused; then
   `gate_or_queue`.

### Other routes
- **Chair to librarian** has no verb of its own; it is `chair_inject` into the librarian's pane [inferred: the
  librarian is an addressable target and no other chair verb reaches it].
- **`raise_pull`** goes to a human click; `chair_decide` or open-channel auto-approve delivers it through the same
  inbox since 2026-09-06 (`main.rs:12496-12515`) [read].
- **The hand-back rule** on the pane side: write the file, append the map line, then one ring carrying the pointer
  (`consonance/src-tauri/brief/COMMITTEE.md:131-178`) [read].

### Which mode is on
- `gates_mode` is `light` on D [read: `~/.consonance.json`]. So the trailer gate warns on all three verbs, and the map
  gate warns.
- `LIBRARIAN.md`, "The hand-off is yours to make", says `call_chair` refuses a ring with no trailer "until the keeper
  switches the gates" [read: `consonance/src-tauri/brief/LIBRARIAN.md`, that section]. On D that is not what runs
  [read, config above]. D's board: 1,018 no-trailer warnings on `call_chair` against 26 refusals, all time
  [read: board count, section 4]. The split by date was not made.

## 3. Where a message is lost: the mechanisms in the code

1. **DELIVERED is the end of the record, whatever the reply.** The 403 trace's point (`exo_memory/loop/
   stall_trace_403_packets_eaten_2026-11-13.md:18-23`) holds on this source: no step reads the pane's next line
   (`main.rs:12165-12299`) [read]. The QUEUED alarm in the pulse closes a wait on the DELIVERED row
   (`consonance/tools/chain-status.js:726-731`) [read], so an eaten packet drops out of the pulse at the moment it is
   eaten [inferred].
   Cost (the 11-13 case): six orders and one task result not acted on, no seat told (trace `:23`) [read]. Minutes
   lost: not recorded as one figure. First burst cleared after the 09:54Z nudge (`:26`) (second reader: `:26` records
   the nudge being sent, not that the panes then cleared; "cleared" is inferred); second burst, A and C clean
   by 10:24:35Z and 10:24:52Z after errors at 10:15Z (`:39-41`) [read].
2. **Why the queue drained into the error, one packet every three seconds.** The room's ready stamp is written by a
   `Stop` hook (`dev/shell/install.ps1:279`, `hooks\ready-stop.js`) [read]. Claude Code runs `StopFailure` *instead
   of* `Stop` when a turn ends on an API error [read: https://code.claude.com/docs/en/hooks.md, "StopFailure" section,
   downloaded with curl]. The room registers no `StopFailure` hook (0 hits in `consonance/hooks`, `dev/shell`,
   `main.rs`) [read]. So after an error the stamp stays "working" over a quiet screen, which is `Stale`, and `Stale`
   delivers as soon as the screen is idle (`main.rs:11647`) [inferred from these three reads]. That fits every eaten
   delivery carrying the STALE label and E's three releases at :01, :04, :07 (trace `:19-22`) [inferred].
3. **The sender of a queued message is never told it landed** (`main.rs:11991` against `:12226-12236`) [read].
   Cost: on 2026-09-23 a queued ring was read as "never rang" (`stall_trace_2026-09-23.md:12`) [read]; about 8 minutes
   (03:14–03:22, same line) [read].
4. **A restart drops every queued message with no row.** The inbox lives in memory (`chain-status.js:743-747`)
   [read]. On D's board, 42 QUEUED rows have no later drain row [read: my pairing script, section 4] (second reader:
   not reproduced, 34 by the pairing named in "Second reader"; the figure depends on the pairing rule). Some may be
   label mismatches (29 drain rows also have no QUEUED partner) [inferred]. Cost not recorded. It bears on any
   rebuild or restart today [inferred].
5. **Rendered is not submitted, and the drain row cannot tell.** Door deliveries check both since D415 (2026-10-19)
   [read: `exo_memory/loop/plan_d415_delivery_submits_2026-10-19.md:1-28`]. The drain row reports NOT SUBMITTED but
   no render (`main.rs:12486-12494`) [read]. Cost of the class: 38 minutes on 2026-10-19 (`plan_d415:9-10`) [read].
6. **Working holds with no bound.** Any packet behind a long turn waits as long as the turn (`main.rs:11645`) [read].
   Measured on L 2026-09-23: n 67, median 140 s, p90 968 s, max 2,119 s (`chain-status.js:736-737`) [read]. On D,
   all gates, all time: median 208 s, p90 924 s, max 16,543 s [read: my pairing script]. Cost per case: see section 4.
   (second reader: p90 and max reproduced; the median was not. A pairing by receiver id8 plus label, in time order,
   gives median 230 s over 1,221 pairs. The script that gave 208 is not in this file. Also: L's 140 s is behind
   `stamp=working` only (`chain-status.js:735-737`), so the two medians are not the same measure.)
7. **A refused hand-back is a held hand-back.** Out of turn, the pane is told to wait while the pointer sits on the
   board (`mcp.rs:945-962`). L050 split "not yet" from "not ever" (`mcp.rs:1080-1095`) [read]. Cost: 29 minutes on
   2026-09-09 (`mcp.rs:1088`; `exo_memory/loop/packet_stalled_at_chair_2026-09-09.md:7-10`) [read].
8. **A word that should bind travels as a message and waits in a busy inbox.** Cost: 14 minutes of C's run inside
   P's quiet landing window, 2026-11-11 (`GATES.md:272-273`) [read]. Fixed for holds by a file every runner reads
   (`GATES.md:256-283`) [read]; other "stop" words still travel this way [inferred].
9. **A relay re-states a finding.** The pane-to-librarian edge exists for this (`mcp.rs:909` tool text) [read]. The
   chair-to-pane and librarian-to-chair hops still carry prose [inferred].

## 4. Every recorded case I found

Search: `exo_memory/loop`, `journal`, `librarian` for stall, queued, lodged, unsubmitted, withdrawn, out of turn,
relayed, eaten; plus code comments in `main.rs` and `mcp.rs` that cite incidents. Not exhaustive (see the end).

| date | hop | kind | what | cost | source |
|---|---|---|---|---|---|
| 07-27 | chair→panes | not submitted | a fan-out lodged unsubmitted in two idle panes' composers | not recorded | `main.rs:12416-12418` [read] |
| 08-22 | keeper→chair | relayed wrong | the chair acted on autocomplete text as the human's | not recorded | `librarian/2026-08-24.md:341-342` [read] |
| 08-24 | lib→chair | held | a board post is a write, not a wake; the human relayed | 4 min + one human relay | `librarian/2026-08-24.md:317-323` [read] |
| 08-24 | chair→lib | relayed wrong | an unverified claim sent mid-turn; the receiving seat ruled wrongly on it | one wrong ruling | `loop/handoff_desktop_2026-08-24.md:171-176` [read] |
| 08-25 | chair→pane | not submitted | a ~3.7 KB brief lodged in the composer of a pane idle 54 min | not recorded | `main.rs:12421-12423` [read] |
| 09-01 | chair→lib | relayed wrong | "VOID, n=39" relayed; the ledger said NOT-RUN, n=40 | a wrong premise, caught at source; time not recorded | `journal/2026-09-01.md:167-170` [read] |
| 09-02 | ring→keeper's typing | spliced | three of his messages spliced by rings in ten minutes, one cut mid-word | not recorded | `loop/packet_inbox_2026-09-02.md:9-12` [read] |
| 09-06 | pull→pane | ungated | every approved pull skipped the inbox and could land mid-turn | not recorded | `main.rs:12500-12506` [read] |
| 09-07 | any→pane | held | autocomplete text read as his typing held every delivery; three stalls | not recorded | `main.rs:11263-11266` [read] |
| 09-09 | pane→lib | refused, held | a hand-back refused out of turn, the pane told to wait | 29 min | `mcp.rs:1085-1088` [read] |
| 09-16 | any | no next station | a station-less NEXT line preceded a stall | 82 min | `librarian/2026-09-16.md:175` [read] |
| 09-20 | chair→pane | delivered after cancel | dispatch delivered 4 min after it was withdrawn; the cancel came 2 m 40 s behind | not recorded ("one wasted lap" is the design's estimate) | `main.rs:13968-13976` [read] |
| 09-23 | pane→lib | queued, sender not told | A's ring queued behind the librarian's turn; read as "never rang" | ~8 min | `loop/stall_trace_2026-09-23.md:12` [read] |
| 09-23 | pane→lib | queued | A's L092 ring queued; the pane re-rang to find out | nothing lost | `stall_trace_2026-09-23.md:52-54` [read] |
| 09-23 | chair, pane→lib | held (STALE) | two rings held 16+ min behind a STALE stamp | 16+ min; nothing lost | `stall_trace_2026-09-23.md:60-66` [read] |
| 09-23 | pane→lib | never sent | an addendum written without a re-ring; the collator waited on a ring | 50 min | `stall_trace_2026-09-23.md:68-74` [read] |
| 09-24 | lib→keeper | held (not delivery) | a "3 h 17 m delivery stall" was a question to him blocking the seat's turn | one WRONG; A and C dispatched on it | `stall_trace_2026-09-23.md:91-102`; `handback/p-d137-unreceived-C_2026-09-24.md:7-25` [read] |
| 09-25 | any→chair | target dead | Main's process crashed; the app still said "awake"; only keep-warm MISSED | not recorded | `stall_trace_2026-09-23.md:104-118` [read] |
| 10-19 | lib→chair | not submitted | ring UNCONFIRMED; text sat in Main's input box; he sent it himself. A second the same day | 38 min | `loop/plan_d415_delivery_submits_2026-10-19.md:9-11` [read] |
| 11-11 | chair→pane | held | a quiet-window hold relayed in words reached C late | 14 min of load in P's window | `GATES.md:272-273` [read] (second reader: those lines do not name who relayed it; the hop is inferred) |
| 11-13 | chair→panes | delivered, not acted on | E's 3 and C's 3 packets (held 534–1,614 s) and A's task notification answered by a 403 | 7 deliveries; minutes not recorded as one figure | `loop/stall_trace_403_packets_eaten_2026-11-13.md:18-23` [read] |
| 11-13 | chair→panes | delivered, not acted on | second burst: A, C, B each answered the chair's picks packet with a 403 | ~9 min for A and C [inferred: 10:15Z to 10:24Z] | same file `:37-43` [read] |

**The 403 rows are not on D's board.** D's board holds 65 rows for 2026-11-13, none between 09:45Z and 10:26Z, and a
gap from 2026-11-12T05:33Z to 2026-11-13T14:42Z [read: node count over `C:/Consonance/data/board.jsonl`]. The trace
was written on L (its own header, `:3`; the watcher's "the seats on L today",
`loop/api_error_watch_2026-11-13.js:20`) [read]. So its figures were not re-derived here.

### D's board, all time (2026-06-30 to 2026-11-13), one run of a counting script
Read-only node scripts over `C:/Consonance/data/board.jsonl`; 799 lines did not parse [read].
(Second reader: the board grows while seats run. Every count below reproduces at a cutoff of 2026-11-13T14:48:52Z,
the time of D's 65th row that day, except the two struck rows and the pairing. `call_librarian [Received]` is 1,849
at that cutoff; the one-row gap is the cutoff's edge.)

| row | count |
|---|---|
| `QUEUED ->` | 1,255 |
| `DELIVERED ->` (drain) | 1,242 |
| … of which FORCED | 264 |
| … of which stamp=STALE | 29 |
| … of which NO STAMP | 76 |
| QUEUED paired with a drain row / unpaired / orphan drain rows | 1,214 / 42 / 29 (second reader: not reproduced; see "Second reader") |
| `chair injected … [delivered and received]` / `[WRITTEN BUT UNCONFIRMED]` | 2,814 / 167 |
| `call_chair -> Main [Received]` / `[Unconfirmed]` | 2,409 / 89 |
| `call_librarian … -> LIB [Received]` / `[Unconfirmed]` | 1,848 / 56 |
| NEXT-trailer refusals (call_chair / chair_inject) | 26 / 21 |
| no-trailer warnings (call_chair / call_librarian / chair_inject) | 1,018 / 521 / 316 |
| digest-gate refusals | 40 |
| address-table refusals | ~~13~~ second reader: 1 app row (role committee, pane chair). 13 lines hold "no address row"; 12 are user or assistant text [read: node count, cutoff below] |
| `keep-warm MISSED` | ~~82~~ second reader: 54 app rows. 82 lines hold the phrase; 28 are user or assistant text quoting it [read: node count, cutoff below] |
| assistant lines carrying "API Error" | 47 (most: 12 on 2026-08-24) |

Where these rows matter: about 1 in 18 chair dispatches was UNCONFIRMED (167 of 2,981) [inferred: arithmetic on the
two counts above]. An UNCONFIRMED is the class that hid 38 minutes on 10-19 [read, `plan_d415:9`].

## 5. Options, with the evidence for each [ours]

- **A. A `StopFailure` hook beside `ready-stop.js`.** It writes the stamp as "failed: <error type>". Claude Code passes
  the error type and the error text to it (docs, above). The drain then holds a failed pane rather than reading it as
  Stale. The hook half needs only `install.ps1 -Only`; the drain half needs a rebuild. Evidence: mechanism 2.
- **B. One queued packet per completed turn, not per quiet screen** (the trace's 2b). Release the next only after the
  pane's Stop stamp moves. Evidence: E's three releases in six seconds (trace `:19`).
- **C. A DELIVERED row is not the end.** Pair each DELIVERED with the receiver's next assistant line; mark it
  NOT ACTED ON when that line is an API error (the trace's 2a). Could live in `chain-status.js` first, with no
  rebuild, since it already pairs QUEUED with DELIVERED (`chain-status.js:726-731`). Trade: re-sending a packet that is
  already in the pane's context may run it twice; the trace chose a nudge, not a re-send (`:26`).
- **D. Tell the sender when a queued message lands, or fails.** Evidence: mechanism 3, ~8 min on 09-23.
- **E. Make the queue survive a restart, or write one row per message it drops.** Evidence: mechanism 4; 42 unpaired
  on D. Relevant before any rebuild [inferred].
- **F. Say which gates mode runs in the briefs that describe refusals.** Evidence: section 2, "Which mode is on".

## What I did not open

- The running Consonance binary, its build date, or whether today's failed rebuild changed what runs.
- L's board, so none of the 403 figures were re-derived; the 2026-11-12T05:33Z–2026-11-13T14:42Z gap on D's board was
  not explained.
- The hook sources: `sources-gate.js`, `dispatch-gate.js`, `reply-slot.js`, `second-reader.js`, `ready-stop.js`,
  `userprompt_pulse.py`, `board-digest.js`. Their behaviour here is from `GATES.md` only.
- B's hand-back `exo_memory/handback/p-l198-403-stall-B_2026-11-13.md` (fix 2c); taken from the librarian's note
  `exo_memory/librarian/2026-11-13.md:143` and the handoff `loop/handoff_lighthouse_2026-11-13-L.md:59-60`.
- `consonance/src-tauri/src/pane_exit.rs`, `await_render`, `await_receipt`, `submit_step`, `SUBMIT_CHECK_GAPS_MS`.
- `BUILDING.md` beyond `:253-310` and `:382-412`; `COMMITTEE.md` beyond `:24-56` and `:131-191`; `BOOT.md`, `SEED.md`,
  `THIRD_PLACE.md`, `BASE_JOURNAL.md` and the `frag-*` files in `brief/`.
- Most of the 1,098 files in `exo_memory/loop`; the 31 that mention WITHDRAWN and the 30 that mention OUT OF TURN were
  counted, not read. More cases may sit there.
- The board's 799 unparsable lines, and a by-date split of the trailer warnings.
- How the L-side board was merged into D's ("pre-union", 2026-09-22), so the all-time counts may mix machines.

## Second reader

Read-only. Same machine (D). Every line below names its source.

**What I checked, and it held** [read unless marked]:
- Source state. HEAD has moved to `79bf5761`. `e2740fdc` is its ancestor, and `git diff --stat e2740fdc HEAD -- consonance/`
  is empty. The last `main.rs` commit is `880f237f`, 2026-11-04. `main.rs` has 0 hits for "NOT ACTED ON" or "API Error",
  so fixes 2a/2b are not in this source.
- `~/.consonance.json`: `machine_tag` D, `gates_mode` light. `gates_mode()` reads the file per call (`mcp.rs:4371-4378`).
- `gate_or_queue` `main.rs:11961-11992`; `PaneGate` `:11174-11199`; `MAX_HOLD_MS` `:11243`; `QUIET_FOR_DELIVERY_MS` `:11502`.
- `drain_decision` `:11619-11652`: Ready bounded on an empty composer, Working holds, Stale/Unstamped/Contradicted bounded
  on an idle screen. The table in section 1 matches the code. The lines cited at `:11643`, `:11645`, `:11647` are right.
- `drain_inboxes`: the doc comment starts at `:12165` and the function at `:12173`. The DELIVERED row is `:12230`. On
  success it writes the board and the app log and tells no sender. The 250 ms tick is at `main.rs:16461`, not in the
  cited range.
- `deliver` `:12407-12463`, `delivery_receipt` `:12469-12476`, `not_submitted_line` `:12479-12484`, `submit_note`
  `:12486-12494`, `ring_reply` `:14141`. The 07-27 and 08-25 comments are at `:12416-12418` and `:12421-12423`.
- `call_chair` `mcp.rs:697-729`, `chair_inject` `:565-634`, and the gate order in `call_librarian`: address `:914`,
  private `:933`, station `:945`, digest about `:969`, map `:1017`, trailer `:1051`. L050's 29 minutes is at `:1088`.
- `trailer.rs:154-156`, `:181-195`, `:207-229`: Light makes every verb warn.
- Address table `main.rs:12643-12650`, target guard `:12661-12675`, withdraw `:13966-13976` (the 09-20 times match),
  pulls `:12496-12515`, the dim-text comment `:11261-11275`, the sender-label test `:24803-24812`.
- `chain-status.js:726-731` (pairing), `:737` (n 67, median 140 s, p90 968 s, max 2,119 s), `:744` (a restart drops
  the queue).
- `dev/shell/install.ps1:279` registers `ready-stop.js` on `Stop`. `StopFailure` has 0 hits in `consonance/`, `dev/` and
  `~/.claude/settings.json`. The public hooks page, downloaded with curl: "Runs instead of Stop when the turn ends due
  to an API error" (https://code.claude.com/docs/en/hooks.md, "StopFailure"). The input carries `error`, plus
  `error_details` and `last_assistant_message`, both optional. So option A's "the error text" is optional.
- The 403 trace: header `:3` says L, and `:18-23`, `:26`, `:37-41` say what is claimed. `api_error_watch_2026-11-13.js:20`
  says "The seats on L today".
- `stall_trace_2026-09-23.md`: `:12`, `:52-54`, `:60-66`, `:68-74`, `:91-102`, `:104-118`. `plan_d415:9-10` (38 min).
  `GATES.md:272-273` (14 min), `:285-296`. `packet_stalled_at_chair_2026-09-09.md:7` (29 min). `journal/2026-09-01.md:167-170`.
  `packet_inbox_2026-09-02.md:9-12`. `librarian/2026-08-24.md:317-323`, `:341-342`. `handoff_desktop_2026-08-24.md:171-176`.
  `librarian/2026-09-16.md:175` mentions the 82-minute stall in passing; the entry that records it is `:83`.
- Board, by node script, cutoff 2026-11-13T14:48:52Z: 799 unparsable; 65 rows on 11-13, the first at 14:42:28Z; the
  last row before them is 2026-11-12T05:33:38Z. QUEUED 1,255; DELIVERED 1,242; FORCED 264; STALE 29; NO STAMP 76;
  chair injected 2,814 / 167; call_chair 2,409 / 89; call_librarian 1,849 / 56; trailer refusals 26 / 21; warnings
  1,018 / 521 / 316; digest refusals 40; API Error 47, 12 on 2026-08-24. The "1 in 18" is right: 167 / 2,981. There are
  37 older `chair injected` rows with no receipt, outside that count.

**What I struck:**
- Address-table refusals: 13 became 1. The 13 counts every line holding "no address row". 12 of them are user or
  assistant text. Cost: no ruling rests on it in this file.
- `keep-warm MISSED`: 82 became 54. The 82 counts every line holding the phrase. 28 are user or assistant text
  quoting it. Cost: no ruling rests on it in this file.

**Not reproduced, so not struck:**
- Pairing 1,214 / 42 / 29 and median 208 s. Pairing by receiver id8 plus label suffix, in time order, gives 1,221 / 34 /
  21 and median 230 s. Counting WITHDRAWN NOT DELIVERED as drain rows changes only the orphans (27). p90 924 s and max
  16,543 s reproduce. The doc's own figures do not add up: 1,214 + 42 = 1,256 against 1,255 QUEUED, and 1,214 + 29 = 1,243
  against 1,242 DELIVERED. Mechanism 4 and option E rest on the 42.
- On the STALE rows [read: same script]: 29 STALE drain deliveries, 0 forced, 15 held over 240 s. All 29 were queued
  as `stamp=working`. The record's candidate defect, "does STALE reach MAX_HOLD_MS?" (`stall_trace_2026-09-23.md:63-66`),
  is not in section 1 or 3 [read]. Whether it bears on mechanism 2 is not settled here [inferred].

**What I could not check:**
- L's board, so none of the 403 figures. The running binary.
- The script behind 1,214 / 42 / 29 and 208 s, which is not in the file.
- `handback/p-d137-unreceived-C_2026-09-24.md:7-25` beyond its first lines. `COMMITTEE.md:131-178` beyond its heading.
  `LIBRARIAN.md` beyond the one sentence at `:113`.
