# p-d627 part 3 — what runs every turn: did it change anything, or only fire? (O), 2026-11-03

Packet: the chair's D627 part 3 (12:54Z), plan `exo_memory/loop/plan_room_value_2026-11-03.md` (lighthouse 82a2db74), read whole. READ ONLY. Seat: O.

**Window:** 2026-10-20 06:04Z to 2026-11-03 12:56Z, every seat (D, M, N, A, B, C, E, O, P).
- checked: `scan.js` over every transcript written since 10-20 (about 7 GB, 20 s) → **5,241 prompts**, 5,060 carrying a pulse; 773 keep-warm visits; 163 state blocks.
- Then `analyze.js`. Both scripts are in `_evidence/`; outputs: `G:\Consonance-tools\scratch-O-d627\{prompts.jsonl, analysis.json, candidates.jsonl}`.

**What counts as a CHANGE:** a seat did something it would not have done without the item, shown by a turn that quotes or acts on it.
- A same-turn mention is only a candidate. I read the candidates (`candidates.jsonl`).
- **The cleanest test is an idle turn**, a keep-warm visit carrying the item: nothing else in that turn could have moved the seat.
- **Caveat on that test:** a keep-warm visit tells the seat "not work". So a keep-warm turn that does nothing is partly the visit's own instruction. That is a finding about the pair (see row 3).

**Per-turn cost:** E's D618 gives the pulse at 758–1,076 characters a prompt per seat, about 190–270 tokens and under 0.3% of any context. My scan gives 829 characters a prompt on average (N 231, E 1,181).

## The table

| # | item | fires since 10-20 | changes found (cited) | chars per fire | verdict |
|---|---|---|---|---|---|
| 1a | pulse `STALE <lap>` | **4,577**: D338 1,514 (to 225 h), D408 1,637, D461 1,267, D501 159 (137 h, still printed) | **1, indirect.** The chair's D620 dispatch cited it ("the pulse lists D461, D480, D501 and more as STALE", D 11-02 23:37Z); that audit closed 79 laps (D 23:57Z). Idle turns carrying it: 773, with a `lap-row` command 1. See note A. | 79 | **NOISE** |
| 1b | pulse `handbacks X of Y (owing …)` | **2,348** | **0.** In 31 idle turns the owing seat was itself named; it rang in 4 (seats mid-work) and replied "ok" in 17. Last night: E idle and owed 02:56Z→09:56Z across **8** keep-warms, C 03:54Z→06:40Z across **4**, each answering "ok" or a line for the Third Place, each moving only when a dispatch came. | 31 | **NOISE** (unactionable where it matters; see row 3) |
| 1c | pulse `HANDBACKS IN, NOT COLLATED` | **761** | **0 in idle turns:** librarian keep-warms carrying it 21, collated 0; chair keep-warms 28, acted 0. The 86 same-turn collations were turns rung by the last hand-back itself. Longest run 645 min (10-22, 85 prompts across 7 seats, "last 11h ago"). Last night: 4 of 4 in about 11:14Z, collated 12:30Z (76 min, through 2 keep-warms and 2 keeper turns). See note B. | 60 | **NOISE** as built |
| 1d | pulse `N dispatch(es) delivery-unconfirmed` | **2,504** | **Misled, 3 cases.** The librarian checked the board before re-sending: M 10-20 07:59Z "the receipt only said 'unconfirmed'"; M 10-28 00:44Z "came back unconfirmed. Checking the board before I re-send. The ring landed … so no re-send". The chair explained it: D 10-24 14:07Z "'Unconfirmed' only means the text took longer than 1.8 s". D620: 32 of 32 had arrived. Chair keep-warms carrying it 61, acted 1. | 38 | **HARMFUL** (false alarms that cost checks). D621's board receipt (pushed 5c64caf1, not yet built) addresses it |
| 1e | pulse `UNRECEIVED O→librarian …` | **183**, 10-21 03:37Z→18:40Z, all 8 seats (12 in mine) | **0 turns named it, and it was FALSE.** "Sent 20:51" is 02:51Z; the librarian's pane received that `[pane:O]` ring at 02:51:35Z. It said a hand-back was lost for 15 h and nobody looked, me included. | 98 | **NOISE**, and false |
| 1f | pulse `QUEUED <seat> Nm (receiver busy since …)` | **344** | **1 clear.** The chair used it to stop a re-send: D 10-25 22:37Z "It is QUEUED, not lost. The pulse reads 'QUEUED C 8m (receiver busy since 16:29)', so it renders the moment C's current turn ends." | 56 | **EARNS ITS PLACE** |
| 1g | pulse `dirty N repo-wide (… hand-backs uncommitted: …)` | **4,577** | **0.** Its file list stood for days: `p-d433-P_2026-10-22_evidence/…` from 10-22 is still first today. | **133**, the largest item | **NOISE** |
| 1h | pulse `NOT in sync: D 79e3c01 …` and `L behind — last pushed 9486b30 …` | **4,577 each** | **0.** The 7 name-matches are all inside the sync tools' own commands. The D head is 947 h old. | 42 + 56 | **NOISE** |
| 1i | pulse `chain: … · holder …`, age, `+N more open`, `0 of 10 chained laps unwitnessed`, `94 older beyond …`, `rows only` | **4,577 each** | **0 shown.** The 569 chain/holder matches are `lap-row.js` commands the chair writes from the ledger, not from the pulse (inferred). | 15–36 each, about 140 together | **NOISE** (inferred) |
| 1j | pulse `1 board line(s) fused, rows recovered` | **1,912** (10-20→10-26) | **0** (the 120 matches were the word "refused") | 40 | **NOISE** |
| 2 | **state block** (session start and compact) | **163**, mean **3,012** chars | **0** turns act on its content. Its 19 mentions are about `state-block.js` as code (D454) or as an audit subject. | 3,012 a wake | **NOISE** (inferred: it may re-cue a waking seat in ways no turn quotes) |
| 3 | **keep-warm visits** | **773** (D 101, M 76, A 118, B 37, C 106, E 119, O 132, P 84) | **25 genuine lines** carried to the Third Place (e.g. B 11-01 17:30Z). 664 "ok"; 82 "ok" plus a letter id or a seat already mid-work; 1 did work. Cost per E's D618: each visit re-reads the seat's context from cache (O about 13.6M cached tokens a day, D about 13.8M). **Side effect, measured (rows 1b–1c):** an idle seat's only turns are these, and they say "not work", so every owed and not-collated line it carries is unactionable by design. | prompt about 330 + reply | **EARNS ITS PLACE** for cache and the Third Place; **HARMFUL** in combination with 1b and 1c |
| 4 | **NEXT-trailer gate, "delivered anyway"** | **935** notes received (D 467, M 232, panes 236); 932 warn rows on the board | **0.** The 11 turns naming "trailer" are about AI commit trailers or the gate's own code. The note goes to the RECEIVER by design (`trailer.rs:286-287`: "The note is not addressed to the sender"), so the seat that could fix it never sees it. Compliance fell while it fired (a `when` clause in the last NEXT line): chair 153/340 → 169/397 → **1/30** (weeks of 10-20, 10-27, 11-03); librarian 191/286 → 159/406 → 8/23; panes mostly down too (E 44/44 → 33/71). | **311** per note, about 290 KB in 14 days | **NOISE** |
| 5 | **sources-gate** | **2,102** rows: warn 1,783, allow 317, deny 0 | **0.** In light mode it writes its row and exits 0 with no output (`sources-gate.js:393`), so 1,783 warnings reached no seat. | 0 in context (ledger only) | **NOISE** as a check (its ledger may serve audits; not judged here) |
| 6 | **digest gate** (the git-blob at ring) | **617**: computed 609, refused 8 | **Used.** The librarian cites a ring's git-blob in 167 turns to record which version it read, e.g. M 10-22 16:05Z "D433 accepted: P, … (git-blob 2bef61bd)". Each of the 8 refusals (a hand-back unreadable from the shared checkout: in a worktree, or an absolute path) made the seat re-send within seconds (C 10-25 04:38:47Z refused → 04:38:56Z re-rung). | about 100 per ring | **EARNS ITS PLACE** |
| 7 | **the board** | **24,089** rows: 74% transcript mirror (17,817), chair audit 4,572, trailer 939, digest 617, seats' own posts about 100 | **Used as the receipt record.** M 10-28 00:44Z checked it instead of re-sending; D620's receipt match (32/32) read it; D621's receipt now reads it. `read_board` calls: 55 in 14 days (M 29). | not injected per turn | **EARNS ITS PLACE** (the record); its gate rows are 1,556 of the noise in rows 4–6 |

## Notes
- **A. What actually closed the STALE laps.**
  - **D338:** filed by the D458 sweep, 10-25 21:42Z. That sweep was the librarian's ruling on the keeper's "what now"; its packet does not cite the pulse.
  - **D408 (319 ledger rows) and D461:** filed at my D620 audit close, 11-02 23:58Z.
  - **D408's age was also reset again and again** by the chair's retakes to pass the station gate. The stale line was partly the retake habit, which D621's per-lap gate addresses.
  - **D501:** its last row is 10-28 19:32Z, "WAITS for Saturday close". Printed 159 times, acted on 0.
- **B. The 2.5 h line.** I cannot name which line the chair meant. The overnight cases measured:
  - "owing C", 03:54Z→06:40Z: **2 h 46 min**, 4 idle keep-warms;
  - "owing E", 02:56Z→09:56Z: **7 h 1 min**, 8 keep-warms;
  - HANDBACKS IN, 11:14Z→12:30Z: 76 min.

  In every case the line was right and the seat able to act on it had no working turn. The cause is the pairing of the owed line with the keep-warm's "not work", not a reader's attention.

## Corrections
- My first pass classed "UNRECEIVED", "fused" and "holder" items as "other" and split each by its changing minutes. I fixed the classifier before any figure here was taken.
- My first "fused" mention count (120) matched the word "refused". It is withdrawn as 0.

## Limits
- **Mentions are candidates found by pattern.** Changes are the cited turns I read. A seat moved by the pulse without naming any of it would not be counted (inferred: rare, since seats in this room cite what they act on).
- Keep-warm cache cost is E's D618 estimate, not re-measured.
- Trailer compliance counts a ring as compliant when its last NEXT line contains "when". That is the gate's own test in spirit, not its exact parser.

SOURCES: plan_room_value_2026-11-03.md; p-d618-seat-weight-E_2026-11-02.md; trailer.rs:286-292; sources-gate.js:390-393; scan.js + analyze.js runs (G:\Consonance-tools\scratch-O-d627\analysis.json, candidates.jsonl); C:\Consonance\data\{lap.jsonl, sources-gate.jsonl, board.jsonl}
NEXT: librarian collates part 3 into the 2x2 when parts 1, 2 and 4 are in
