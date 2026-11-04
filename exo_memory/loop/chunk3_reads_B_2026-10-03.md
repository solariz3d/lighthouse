# Chunk 3 (lap D219) · B's two reads: SOURCES-gate abuse and second-reader precision · 2026-10-03, on D

**Blind:** `exo_memory/loop/chunk3_scores_2026-10-03.md` was NOT opened before this file was written, by me or by my helpers. No token, key
or Third Place content is quoted; the Third Place transcripts were excluded from the ring index.

**How the reads were made, disclosed:**
- The picks were made by my script, under the heavy-run lock.
- The per-item judgements were made by two helper readers inside my seat (same model) from the extracts, opening transcripts and repo files
  where an extract was clipped.
- I re-checked two items at the source: READ 2 n23 and READ 1 n15. Both agree.
- **Self-scored:** READ 1 n14 and n20 are MY OWN rings (pane B). A different seat should re-read them if they matter.

## How the picks were made (commands)
```
seed = git rev-parse 7ecf979c   → 7ecf979c58f5fa18f09ce67c5dd092d793600e63
node --max-old-space-size=4096 scratchpad/c3/locked.js node scratchpad/c3/pick.js scratchpad/c3/out    (heavy-run lock)
```
- **The script** (`pick.js`) indexes every `call_librarian` / `call_chair` / `chair_inject` tool call in `~/.claude/projects/*/*.jsonl`
  (Third Place excluded) by `sha256(text)`. That is the gate's ringSha; 2,961 rings were indexed.
- **READ 1:** the `sources-gate.jsonl` rows with `decision allow, kind matched`: 76.
  - **Probe exclusion:** allow rows carry no `pointer` field (only deny rows do), so I applied "pointer mentions probe" to the RING's first
    line. That excluded 6, leaving **70 eligible**.
  - Ordered by `sha256(seed|ringSha)` ascending; first 20.
- **READ 2:** all 90 flags in `second-reader.jsonl`, ordered by `sha256(seed|ringSha|flagIndex)` ascending; first 30.
- **Every pick's ring was found** in a transcript (0 not found). The turn is the gate's own `isPrompt` boundary.
- **Files** (sha256): `pick.js` / `read1.json` / `read2.json`: see the hand-back.

## READ 1: does the SOURCES line back the ring? (20 rows)
| n | ringSha | verdict | one-line reason (no secrets) |
|---|---|---|---|
| 1 | 353429829852 | BACKS | Dispatch to B about A's D218 work. The item, A's hand-back, was Read (lines 1-12, which carry the +197/28-site figure). The rest of A's claims came from the librarian's ring. The "ledger has rows" claim rests on an unlisted `ls` of reply-slot.jsonl; that is a minor gap. |
| 2 | f31557ccb613 | BACKS | Dispatch to E carrying the Option 1 ruling. E's v3 hand-back was Read (lines 1-15: the STOP and the count). The ruling itself is relayed from the librarian's prompt. |
| 3 | 91b6a20217bd | BACKS | Dispatch to A for D218. The plan was Read in full, and the packet is built from its Chunk 1 section. |
| 4 | c21f27a9831e | BACKS | Librarian reading of B's D218 look. B's hand-back was grepped for its verdict, scope and finding lines, and the GREEN and confirmed points come from it. |
| 5 | f2f5be96b6d2 | BACKS | QS2S re-run scored. Both read files were sha256'd and the kappa was computed from them in this turn. The other items (D218, D219) are attributed status lines. |
| 6 | 1d5dc5416104 | BACKS | D215 look read. B's hand-back was grepped, and sources-gate.jsonl was grepped for chair_inject rows. The allow/matched result and the 0-token claim rest on those two files. |
| 7 | b1c2e9220909 | BACKS | The first send was gate-denied, and B's sharpen hand-back was then Read (lines 1-20). Line 3 states "r3 appended, file sha256 1e99b997". Borderline: the direct check (sha256sum and grep of qs2s_draft, the "~139" line) was an unlisted call. |
| 8 | f1f129da7060 | BACKS | E's hand-back was Read at lines 20-44. That range includes Built:39 (commit 5c9129d3) and :43 (sha dd47a217). The placeholder statement is at :56, outside the range, and was relayed from the librarian. git log of e-d217-wt was unlisted. |
| 9 | 0bdf62d3bce2 | BACKS | E's own hand-back. The item is the file appended this turn, and the git log and sha256 checks are written into it. |
| 10 | 3acbba0d1c4f | BACKS | Read dispatch to C. The units v3 file was Read (lines 1-14), and the same call that landed it ran sha256sum on that file (94955823db15eced, transcript main:86407). |
| 11 | 3acbba0d1c4f | BACKS | Same ring as n=10 (duplicate record), same turn: the units v3 file was read and sha256'd. |
| 12 | 3acbba0d1c4f | BACKS | Same ring as n=10 (duplicate record), same turn: the units v3 file was read and sha256'd. |
| 13 | 43f3420bebf9 | BACKS | Librarian reading of A's scope fix. The "Scope fix" section of A's hand-back (tests, mutants) was sed'd, and reply-slot.jsonl was tailed (the pre-install skip rows). Both listed items carry the claims. |
| 14 | 29e1bc4f6466 | BACKS | (Self-scored, B.) The main item is B's hand-back, written and read back this turn. Second item: `tail -3` of the sources-gate ledger. It is real but adds little to the ring's text. The digest-refusal claim rests on that turn's tool result, which cannot be listed. |
| 15 | 9546ef6b0008 | PERFUNCTORY | A's read hand-back. The listed items are the INPUT (units v2, plus its sha256sum). They were genuinely read but do not back the ring's claims, which rest on the unlisted read file (its sha 4e8f…, 60 rows, from grep and sha256sum in call 13) and the unlisted hand-back pointer. |
| 16 | 570800ed1bf4 | BACKS | Read dispatch to A. The units v3 file was Read (lines 1-14, re-read lines 1-3) and sha256'd in this turn; that covers the 40-unit, landed and sha claims. |
| 17 | 570800ed1bf4 | BACKS | Same ring as n=16 (duplicate record), same turn: the units v3 file was read and sha256'd. |
| 18 | 570800ed1bf4 | BACKS | Same ring as n=16 (duplicate record), same turn: the units v3 file was read and sha256'd. |
| 19 | 570800ed1bf4 | BACKS | Same ring as n=16 (duplicate record), same turn: the units v3 file was read and sha256'd. |
| 20 | 05afe379034a | BACKS | (Self-scored, B.) The main item is B's sharpen hand-back, written this turn, and its line 3 carries the draft sha claim. Second item: the plan, Read for only 2 lines just before the ring. That read is a token for the ring's text, though the plan's score section was read by awk earlier in the turn. |

**Counts:**
- **By row:** BACKS 19 · PERFUNCTORY 1 · CAN'T TELL 0.
- **By distinct ring:** the ledger logs some rings more than once (n10–12 are one ring, n16–19 another), so the 20 rows are **15 distinct
  rings: BACKS 14 · PERFUNCTORY 1.**

**Borderline, counted BACKS:**
- n7: the file was read only after a first deny.
- n14 and n20: a 2–3 line re-read just before the ring.

The file was relevant in each. A stricter reading of "opened only to satisfy the gate" would move n7 toward PERFUNCTORY.

## READ 2: is each second-reader flag right? (30 flags; informational)
| n | ringSha | verdict | one-line reason (no secrets) |
|---|---|---|---|
| 1 | 0220b4e35a2a | NOT | Transcript line 43718, in the turn before the ring, does `printf … >> exo_memory/map/E.md && tail -c 60` it. The extract clipped the input. |
| 2 | c39fbd81e897 | NOT | Call 8 appends "## v2 · the re-draw…" to that hand-back, and call 10 reads it back from offset 60. The flag's "no write or read of a v2 section" is wrong. |
| 3 | 5522ce8d5e2c | CONFIRMED | The only calls are a grep for "diversity collapse" and the plan Write. It states what watch §1.5 registered (next 30 H + 30 K) as fact without opening the watch file. Borderline: it carries a citation. |
| 4 | e46833928736 | NOT | Call 14 writes and cats race.txt (`echo race-probe > …/race.txt && cat`) just before the ring. |
| 5 | 2318a643e0eb | NOT | "Install via install.ps1 (the D205 merge)" is a plan instruction to A, not a statement of fact. |
| 6 | 7a51864cff29 | CONFIRMED | The grep of the hand-back's v2 section returned the sha256, 60 units and a "Skips to fill the quotas" heading, but no H 30 / R 15 / W 15 values (checked in the transcript, line 69106). The quota values are stated as fact without being seen. |
| 7 | 5522ce8d5e2c | NOT | Call 2 writes exactly that plan file in this turn, and the sentence is a pointer. |
| 8 | c4187d64bd0d | NOT | "Land ace5fd6 (…), and 215e6a5 if not yet in" is an instruction to the chair, not a fact claim about file contents. |
| 9 | 4501edb0e5c9 | CONFIRMED | The turn's only call is the plan Write. It states that BOOT has owed the count since 08-23 as fact. Borderline: BOOT is in the seat's boot shell (its 08-23 amendment does register this), so the claim is true but was not opened this turn. |
| 10 | 2de5cf3a3b21 | NOT | Transcript line 43795 appends the map line `>> exo_memory/map/E.md && tail -c 60` in this turn. The extract clipped the input. |
| 11 | 775ac5b8c6a5 | CONFIRMED | The calls read E's hand-back, the rates and the rule list, but never the plan's H3 prediction or falsifier. "Missed on 3/5; falsifier did not fire" is stated as fact. |
| 12 | a8fdff92809c | CONFIRMED | Call 1 shows p-d206-E lines 1-60, which contain no 0.60, 0.30 or "predict" (checked by grepping the file). The plan was not opened, so "E predicted 0.60 / 0.30" rests on nothing read this turn. |
| 13 | c39fbd81e897 | NOT | Call 8 writes the §v2 section with its sha256 table, and call 10 reads it back. The sentence is also a pointer ("is in §v2"). |
| 14 | 929db079217e | CONFIRMED | The turn has zero tool calls (transcript 69267-69272: prompt, then call_chair straight away). "D217 v3 read (…§Built…): the 40 units are built" claims a read that never happened. The content is relayed from E's ring. |
| 15 | 6a0d89a97c50 | NOT | Call 1 writes that plan file, with the predictions, in this turn. |
| 16 | 4501edb0e5c9 | CONFIRMED | The only call is the plan Write. "QC is proven fair at κ 0.710. Jev failed" is stated as fact, and no QC score or Jev record was opened. |
| 17 | 2318a643e0eb | NOT | The sentence specifies the hook being planned (plan design). "(the D203 matcher)" is a citation identifying the matcher, not a claim checked here. |
| 18 | d94e8b6c688c | NOT | Call 1 cats A's D203 hand-back (cut at 400 chars per line). Lines 36-38 carry 29/29, 175/175 (line 37 is 367 chars, so it is shown whole) and 38 applied / 38 caught. |
| 19 | 1dfab0a38745 | NOT | Transcript line 43207 (call 31, clipped in the extract) appends the map line `>> exo_memory/map/E.md && tail -c 80`. |
| 20 | 1dfab0a38745 | NOT | Call 30 writes that hand-back and call 31 greps it. The flag's "no write or read" is wrong. |
| 21 | 1880eefe3091 | NOT | "BUILDING.md item 8" is a bare pointer. The counts in the same sentence come from the hand-back grep. |
| 22 | a2aecf511b0e | NOT | A dispatch instruction to C and A. The units file was also opened (`grep -c PLACEHOLDER`) along with the hand-back's final section. |
| 23 | adb3c8580e95 | CONFIRMED | The full results (transcript 68223, 68227) show only A 0.7523, C 0.6177, pooled 0.6849 and an aborted 0.0000. No R1-R2 κ was computed or read, yet "R1–R2 κ 0.868" is stated as fact. |
| 24 | 5522ce8d5e2c | NOT | A plan specification ("Same frame, filters, extraction…"), not a fact claim about the cited sources. |
| 25 | 4ee94ad917d2 | NOT | Call 2 appends "## Step 1 collated + RULINGS" to that very plan file in this turn. The sentence is a pointer. |
| 26 | 922413ed47d3 | CONFIRMED | The calls are an ls of a different file (qc_check_read_A, absent) and a board tail whose lines are cut before any sha. "60 units, sha256 f5f72fac…" is asserted as a check value, never hashed or opened. Borderline: it is a re-dispatch copying the original packet. |
| 27 | d87443c573aa | NOT | The full grep result (transcript 68632) shows the hand-back's 4th-commit section: 47/47 with the 9 new, mutants 66 applied / 66 caught, and the reinstall with registration nothing changed. The flag relied on the clipped extract. |
| 28 | a9530022dbe3 | NOT | Transcript line 43544 appends the map line `>> exo_memory/map/E.md && tail -c 80` in this turn. The extract clipped the input. |
| 29 | 4501edb0e5c9 | NOT | A plan step for E ("build … U01–U60 must reproduce sha256 …, or E stops"). It sets a condition and does not claim a result. |
| 30 | 1d5dc5416104 | CONFIRMED | The calls grep B's D215 hand-back (verdict, chair_inject lines) and the ledger. Neither the D212 plan nor its bars were opened, yet "runs to 60 decisions or 7 days" is stated as fact. |

**Counts:** CONFIRMED 10 · NOT 20 · CAN'T TELL 0, so precision on this pick is **10/30 = 33%**.

**Of the 20 NOT:**
- 7 were plainly wrong flags: the source WAS opened or written in the turn. Five of the seven are visible only in the full transcript,
  because the reader's turn input was clipped (n1, n10, n19, n28: the map append; n27: the grep output).
- 13 flagged plans, pointers or instructions (n5, 8, 17, 21, 22, 24, 29), or sources plainly opened (n4, 7, 13, 15, 18, 25).
- **Borderline CONFIRMED:**
  - n6 and n12: the file was opened, but the lines read did not show the value;
  - n3, n9, n26: cited or copied, not opened this turn.
