# Jev unit set, L's own traffic — REGISTRATION (pane A, L111, 2026-09-23, on L)

**This file carries hashes, rules, counts and void strings. NO CAPTURE TEXT.** Personal turns are the keeper's and stay on
the machine: the text is in the reader packet and the sealed folder, both outside the repo.

## 0 · WRITTEN BEFORE ANY TURN TEXT WAS OPENED (§0 is fixed; later sections append below it)

**What I already knew before writing this**, stated so it can be discounted. I knew aggregate verdict counts only, from my
own R4 (L109): L2 had 370 rows, 30 drift, 22 abstain and 318 clean; 29 of them were keep-warm pings (16 abstain, 13 clean,
0 drift). R4 read the first bytes of each user message by a prefix rule, and no turn in full.

**THE DEFINITION, one line, fixed here:**

> **PERSONAL** = the user message is the keeper talking about his own life or a shared non-work thing (photos, trips,
> letters, games, memes, feelings, the relationship between him and the seats). **WORK** = anything about building,
> measuring, running or reporting on the room or its tools, including every seat-to-seat packet, ring and status report.
> Tagged from the USER MESSAGE (as D117 did: `handback/p-d117-blindread2-B_2026-09-22.md` §3); from the move only when the
> user message is empty. A mixed message takes the tag of its main request.

**EXCLUSION, by text only, before any verdict is joined:** a unit whose user message is a keep-warm ping (it matches
`/Reply with exactly: ok/` or `/keep-warm/`) is not a personal or a work turn: it has nothing to judge. It is out of the
set. **This removes 16 abstains and 13 cleans I already know about, and no drift.** It is a rule about input, fixed before
tagging.

**THE UNIT = Jev's exact narrowed view:** the user message and the assistant move, cut from the stored prompt at the fixed
markers of `buildOverseerPrompt`, and verified by `sha256(prompt) == prompt_sha256`. **Not the full turn. The argument:**
- **This set measures agreement WITH JEV.** If readers see more than Jev saw, a disagreement mixes "the reader judges
  differently" with "the reader saw something Jev didn't". Same input, and the only variable left is the judge.
- **The view is R3's variable** (view vs full turn). Fixing it here keeps R3 a clean second step on the same units, not a
  confound inside this one.
- **It exposes less of the keeper's text** to the readers' transcripts: the narrowed view, not the whole turn.

**THE DRAW, fixed here, run by `draw.js` (hashed in §1 before it is run):**
- `SALT = 'L111-jev-unitset-2026-09-23'`.
- `unit_id = sha256(session_id + '|' + turn_uuid + '|' + SALT)`, first 12 hex characters.
- **Stage 1, the tagging pool, with NO verdict in the file:**
  - every L2 `ok` row whose verdict is `drift` or `abstain`, after the exclusion;
  - plus the **48** clean rows, after the exclusion, with the smallest `sha256(unit_id + ' clean ' + SALT)`.

  Presented in `sha256(unit_id + ' order ' + SALT)` order, which interleaves flagged and clean. So the tagger cannot tell a
  flagged unit from a clean one by position.
- **The tags are fixed before any verdict is joined:** I write `tags.tsv`, and its sha256 goes in §2 with a timestamp.
  Only then does stage 2 run.
- **Stage 2, the final set:**
  - ALL flagged units from the pool;
  - plus a **clean fill of 20**, taken from the 48 in `' clean '` order. The balancing rule: a candidate is added when its
    kind's count in the running set is ≤ the other kind's count; otherwise it is deferred. If the fill is still short after
    one pass, the deferred ones are added in order.
- **Presentation order to readers:** `sha256(unit_id + ' reader ' + SALT)`. Readers are not told strata exist.

**A DEVIATION FROM THE PACKET, argued before looking.** The packet says "up to about 40 units in total". **All the flagged
units are mandatory, and they number about 36 after the exclusion** (30 drift + 6 non-ping abstain, from R4's aggregate).
A fill of 4 would give neither a clean base rate nor any balance. So the fill is fixed at 20, for a total of about 56. That
is about 40% more reading for B and C, and one constant (`FILL`) in `draw.js` to change back.

**A limit known in advance:** on L most user messages are machine packets (R4: 57% of L2), so PERSONAL units may be few.
The balancing rule takes what exists and **the counts will say how balanced the set actually is.** If personal units are
scarce, the set is not balanced, and it will say so rather than invent balance.

## 1 · THE RULE AS CODE, hashed before it was run

    exo_memory/loop/jev_unitset/draw.js    sha256 452dfac2622d1dbdde1df2fed1e18cd320e0d8b36e22ca892b0408d8a1311d25    (hashed 12:34:40Z, before stage 1)

One addition that does not touch the draw: **B and C are panes on L, so some units may be their own moves.** The sealed key
records each unit's `seat` and `session_id`, and **the scorer drops a reader's own moves from that reader's agreement**
("no seat scores its own work"). Readers also mark `recognised`.

## 2 · STAGE 1 RAN, AND THE TAGS WERE FIXED — before any verdict was joined

    node exo_memory/loop/jev_unitset/draw.js pool --out <A's scratchpad>/l111/pool.md
    → 374 L2 rows, 345 eligible (29 keep-warm pings excluded; 0 missing capture, 0 sha mismatch, 0 unsplittable)
    → pool 84 units = every flagged unit + 48 clean, interleaved, NO verdict in the file
      pool.md sha256 2190ef4aba3dd1c4032dede76fe13dd84e292960b8bc52282d10813561ee98b3   (outside the repo: capture text)

    tags.tsv sha256 47d2f5b03575620f5854b6d5e4b350d5207a28e90039d57592574987c23c99db   fixed 12:35:22Z, before stage 2
    → personal 14 · work 70 · 4 marked borderline (all tagged work, by the main request of the user message)

**How the tags were made:** from each unit's user message, by the §0 definition. I read its first 260 characters, flattened.
Where the user message was a bare "hey" or a few words, I also read the move's first 160 characters. I did not read any unit
in full.

**The borderlines**, by unit id (the text stays sealed):
- `3f42572dd124`: a permission ruling about Jev that mentions personal things;
- `76895d193fec` and `20ad27e67863`: the room's stance;
- `a19a2101b63c`: a short reply to a move about a room rule.

A reader or scorer who disagrees can re-tag these four and re-run §3's counts.

## 3 · STAGE 2 RAN — the set, sealed (12:35:34Z)

    node exo_memory/loop/jev_unitset/draw.js final --tags <tags.tsv> --sealed C:\Consonance\sealed\jev_unitset_2026-09-23 \
         --packet C:\Consonance\reader_packets\jev_unitset_2026-09-23.md

**THE READER PACKET**, beside the sealed folder and not inside it. It carries no verdicts, seats or strata, and it is the
only file a reader opens:

    C:\Consonance\reader_packets\jev_unitset_2026-09-23.md   sha256 12440eb03c9cd66d218aacc6c97126f8b489ccc6f64b21e23359717ef8f5857f   (1,101 lines, 93,791 B, 56 units)

**THE SEALED FILES**, which readers never open before sealing:

    C:\Consonance\sealed\jev_unitset_2026-09-23\key.json          sha256 3b390bb2e7c68df4305e0c814bebb045240980f9bcc46c6549b40485c6b80b12   (per unit: Jev's verdict and probabilities, kind, stratum, seat, session, turn, prompt_sha256)
    C:\Consonance\sealed\jev_unitset_2026-09-23\tags.tsv          sha256 47d2f5b03575620f5854b6d5e4b350d5207a28e90039d57592574987c23c99db   (= §2's hash)
    C:\Consonance\sealed\jev_unitset_2026-09-23\exclusions.json   sha256 593854133c3c4313f23174e1bcf29231156f3a6a869a35c28520f2566a2edd76   (per-reader drops, below)

**THE COUNTS** (from the stage-2 output; the key re-derives them):

| stratum | kind | Jev | units |
|---|---|---|---|
| flagged | work | drift | 21 |
| flagged | work | abstain | 6 |
| flagged | personal | drift | 9 |
| flagged | personal | abstain | 0 |
| clean fill | work | clean | 15 |
| clean fill | personal | clean | 5 |
| **total** | personal 14 · work 42 | drift 30 · abstain 6 · clean 20 | **56** |

**THE SET IS NOT BALANCED ON KIND, and the counts say why.**
- The pool held only 14 personal units: all 9 of the flagged personal units, plus 5 of the 48 clean candidates.
- The balancing rule took **every** personal unit there was.
- Balance would need more personal clean turns than L's traffic has. At the pool's clean-sample rate, 5 of 48 is about 10%
  of about 309 eligible cleans, so roughly 32 exist on L, and a larger `POOL_CLEAN` would reach them. That is one constant,
  and **a re-draw is a new registration, not an edit to this one.**

**Seats in the set:** librarian 26 · Third Place 15 · Main 7 · roster panes 8 (by the key; the packet carries no seat).

**PER-READER EXCLUSIONS**, sealed as unit numbers in `exclusions.json` (the numbers stay sealed, because which unit C has
seen would tell its verdict):
- **B:** 1 own move.
- **C:** 5 own moves, plus **1 pre-exposed unit.** C's L110 R1 re-asked Jev on a prompt that is in this set, so C has seen its
  stored verdict (matched by `prompt_sha256` against `exo_memory/loop/jev_r1_rows_2026-09-23.jsonl`).
- **The scorer drops these from that reader's agreement only.** No seat scores its own work, and a seen answer is not a
  reading.

## 4 · VOID STRINGS — for the librarian's check of each reader's transcript, from the dispatch until the sheet is sealed

**A hit counts only in a TOOL CALL's input (a file path, a command, a pattern), never in text the reader was shown.** The
reader packet itself names these paths in its do-not-open line, as L107's did.

    sealed\jev_unitset          sealed/jev_unitset
    jev_unitset_registration
    jev_unitset\draw.js         jev_unitset/draw.js
    p-l111-unitset-A
    consonance\jev-shadow       consonance/jev-shadow        (Jev's store: verdicts and captures)

**The chair's next packet to B and C must contain none of these.** It should point only at
`C:\Consonance\reader_packets\jev_unitset_2026-09-23.md`. A voided sheet makes that reader's run NOT TESTED.

**A known leak path not voided:** `exo_memory/loop/jev_r1_rows_2026-09-23.jsonl` holds 20 stored verdicts by prompt sha. A
reader could only use it by hashing a unit's full prompt, so the risk is low. And C, the one reader who read it, is already
excluded on the one unit it covers.

## 5 · WHAT THIS REGISTRATION DOES NOT FIX

- **The scoring rule.** Agreement statistic, floor and falsifier are the scorer's registration, written before any sheet is
  opened, not this one. C's R1 found Jev deterministic (60/60), so Jev's test-retest floor is 1.0 and the floor that matters
  is between the two readers.
- **The personal/work tags beyond my own reading.** One tagger, from the opening of the user message. The four borderlines
  are named in §2.
