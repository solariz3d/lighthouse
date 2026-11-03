# The room's value audit, collated (librarian, 2026-11-03)

Plan: `loop/plan_room_value_2026-11-03.md`. Hand-backs, all read-only:
- part 1 (P): `handback/p-d627-p1-flags-P_2026-11-03.md` (git-blob c7f10f18)
- part 2 (C): `handback/p-d627-p2-tools-C_2026-11-03.md` (4af17bb2)
- part 3 (O): `handback/p-d627-p3-everyturn-O_2026-11-03.md` (fdccc6f9)
- part 4a (A): `handback/p-d627-p4-compaction-A_2026-11-03.md` (cba07e29)

Part 4c, the three-arm continuity test, is running; its line is added when A and P ring.

**Corrections to my 11-02 result (`loop/room_audit_result_2026-11-02.md`):**
- "Never adjudicated" was wrong. B scored the second reader on 10-03, and it was ruled DROP by its own falsifier. Its hook was left installed, and it went on to make 3,354 more model calls (P, Corrections 1).
- "39 tools never caught anything" was judged without running one (C, first section).

## The 2x2

### GOOD AND USED (keep)
- pulse `QUEUED … receiver busy`: it stopped re-sends (O row 1f).
- the digest at ring: it is used to record which version was read (O row 6).
- the board: the record of receipts, and the only place that holds his words verbatim (O row 7; A §4).
- vantage, its 2 acted-on catches (P).

### GOOD BUT UNUSED (wake these)
- **text-census:** when run today, it found a map file invisible to search for 29 days (C).
- **open-items:** when run today, it found that a fresh pane's briefs are older than the repo's (C).
- **pane-status:** useful, but it crashes on transcripts over 512 MB (C).
- **the 7 collapse meters** (agreement-spread, deference-unit and the rest): BOOT's own falsifier instruments, unrun since 10-10 (C rows 18-24).
- **the second reader's real hits:** about 10% of flags were real errors (CI 5-19%), mostly relays and status claims in the librarian's rings. About 2.5% were never caught (P). It is worth it only as a narrower question on relayed figures and status claims, not as a flag on every ring.
- **vantage:** 6 real catches out of 37. Two fixes would remove about 26 of its 30 false ones: check the repo the claim names, and check at the claim's own time (P).
- **the board, as memory:** it holds his words where the notes paraphrase them. Nothing indexes it by decision (A §4).

### USED BUT NOT GOOD (fix or stop)
- **the owed line plus the keep-warm "not work":** last night E waited 7 h through 8 visits, and C 2 h 46 through 4 (O rows 1b, 1c, 3). This is the cause of the overnight gaps.
- **"delivery-unconfirmed":** false alarms that cost checks; 32 of 32 had arrived (O row 1d). D621's receipt, merged but not yet built, addresses it.
- **"UNRECEIVED":** false for 15 h (O row 1e).
- **the NEXT-trailer note:** it goes to the receiver, never the sender, and compliance fell to 1/30 (O row 4).
- **usage.js:** it prints a silently short table on large transcripts (C).
- **compaction summaries:** they lose about 40% of a window (15 of 37 items LOST, 8 PART), and his exact words survive one compaction, not two. That plausibly contributed to the 0.4.39 push miss (A §0).
- **the second reader as built:** 3,354 calls after its own DROP ruling, flags reaching no one (P).

### NEITHER (retire, by name)
- pulse STALE, dirty, sync, chain, "fused", and the state block (O; noise, inferred harmless).
- sources-gate in light mode: 1,783 warnings that reached no seat (O row 5).
- the superseded tools: replay-check, board-bursts, worktree-sweep, blind, claim-check. The obsolete one: jev-flags. The 12 finished experiments (C).

## Recommendations (his call; nothing has moved)
1. **Fix the idle gap first, since it is the biggest cost found.**
   - When a seat is owed work, or hand-backs are in and not collated, the next visit to it is a WORK turn naming the action, not a keep-warm.
   - Keep-warms stay for the cache and the Third Place.
2. **Wake the good-unused:**
   - run text-census and open-items weekly and fix what they found;
   - stream pane-status and usage so they read transcripts over 512 MB;
   - run the 7 meters once now and report.
3. **Second reader:** a narrower question. Flag only relayed figures and status claims, and surface the flag to the ringing seat in the turn. Or stop it; his choice.
4. **Vantage:** the two fixes, then keep it.
5. **The pulse:** keep QUEUED and the hand-back counts once 1 is done. Drop STALE, dirty, sync, chain, fused and UNRECEIVED. Send the trailer note to the SENDER.
6. **Compaction:** no seat is cut without his word (rule of 06:55). The defence is to write each lesson into the room in the turn it is learned, and to carry his verbatim words forward across summaries (a running file of his words, by decision). The test's result decides how much more.
7. Retire the NEITHER list to attic/ only after he has seen this. One mv returns each.

OUTPUT → NEXT: changed — value, not use, now decides what stays; the idle-gap fix is the first recommendation.

## Part 4c, the continuity test: unblinded and scored (librarian, 2026-11-03)
Grades: `handback/p-d627-p4c-grades-P_2026-11-03.md` (git-blob b181d583). Map (`arms/librarian-only/key-map.json`): room 8f2e, summary dc6b, board e958, chain 5e11.

| arm | score of 34 (r1 / r2) | judgment + his words RIGHT of 21 | don't-know | wrong or confabulated |
|---|---|---|---|---|
| ROOM | 32.5 / 33.5 | 19 / 20 | 0 | 0 |
| ROOM + SUMMARY | 32 / 33 | 18 / 19 | 0 | 0 |
| ROOM + BOARD | 33 / 33 | 20 / 19 | 0 | 0 |
| ROOM + CHAIN | 20 / 20 | 8 / 8 | 11 / 11 | 0 |

**Against A's registration:**
- "Within the spread": YES. ROOM's 19.5 on judgment and his words is above CHAIN's lower run (8). By the registered words, "the chain adds little that the room does not".
- "Falls between": NO. The order is CHAIN well below the other three, not ROOM < SUMMARY < CHAIN.

**What the numbers mean, read from the answers:**
- **The CHAIN fork lost by not looking.** Both runs say they "opened no file" and answered from memory alone. Its carried conversation starts at the 02:58Z compaction, so it answered Tuesday fully, and said "don't know" to 11 Sunday and Monday items that the files held. Every arm that read the files got them.
- **This is one finding twice:** a seat carrying a long conversation trusts it and does not reach for the shelf (memory fluency-is-not-a-check, here measured). Its honesty held: 0 confabulated in all eight runs.
- **The room recovered the last 48 h nearly whole,** his words included. inferred: that is because this seat writes his words and rulings into its notes in the turn.

**What this test could NOT measure, said plainly:**
- O's keys were sourced from files, so every question had a file answer by construction. A question whose only answer lives in the carried conversation (the unwritten lesson, the attunement) could not be asked. Part 4a's lost release precedent is that class, and it was found in the record, so it is not covered by this test.
- The grader saw each file's source class in its first lines (P's unblinding table), so the grading was blind to the code but not to the condition.
- One grader, on the same model.

**Reading for him:** the room carries what gets written down, and it carried the last two days almost perfectly. The carried conversation, used alone, did worse, because it didn't check. His fear is smaller than it looked for facts, words and decisions. It is not tested for what is never written down. The defence for that class stays: write each lesson into the room in the turn it is learned.
