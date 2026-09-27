# THE TRAILER-GATE CENSUS — L's board only (pane E, L124, on L, 2026-09-27 ~11:4xZ / 05:4x local)

Packet: the chair's L124 ("MEASURE the trailer-gate friction. You measure; you fix nothing"). The keeper, 05:42: "do what
you think needs to be done". **Nothing was fixed or edited except this file, the hand-back and a map line.**

**Scope: `C:\Consonance\data\board.jsonl` on L only** (41,053 lines when read). The board is machine-local, so D's rings
are not here. L's board has **no delivery rows at all on 09-24, 09-25 or 09-26**; the work ran on D then. All times are UTC,
and days are UTC days (Regina is UTC−6).

## 0 · WHAT THE GATE WRITES — verified in the source, not the packet

- **The row is a board entry with `"pane":"trailer-gate"`** (`consonance/src-tauri/src/mcp.rs:632–640`, `trailer_audit`).
  It is **a pane name, not a `kind` field**. Role is `committee`, and `ts_source` is `push`.
- **The text** is `<verb_name> REFUSED BY THE NEXT-TRAILER GATE: <missing>` or
  `<verb_name> DELIVERED WITHOUT A NEXT TRAILER: <missing>` (`mcp.rs:3581–3606`).
- **The policy** (`trailer.rs:195–207`):
  - `chair_inject` and `call_chair` are **REFUSED**, and the sender gets the message back whole;
  - `call_librarian` is **DELIVERED WITH A WARNING**, never refused (a refusal on that edge drops the pointer).
- **The rows ARE distinguishable**, so no refusal was needed. But **the row carries only the gate's reason, not the NEXT
  line.** Classifying the line needed the sender's own call, recovered from its transcript (§5). **All 44 rows paired,
  and my port of `check` agrees with the gate's stated reason on 44 of 44.**
- **The first `trailer-gate` row on L's board is 2026-09-20T07:38:13Z.** The gate was added on D at `47c4dad` on
  2026-09-16. `trailer.rs` was last changed at `af05958` (09-23), sha256 `8b2df951…01e4` as read.

## 1 · THE LAST 7 DAYS (2026-09-20T11:45Z → 2026-09-27T11:45Z) — 40 rows

**By seat.** "Flagged" is a gate row. "Sent" is the board's delivery rows (`call_librarian X -> LIB`,
`call_chair -> Main`, `chair injected`). A refused call has no delivery row, so its denominator is sent + refused.

| seat | verb | flagged | sent | share |
|---|---|---|---|---|
| **C** | call_librarian (warned) | **23** | 39 | **0.59** |
| A | call_librarian (warned) | 6 | 43 | 0.14 |
| B | call_librarian (warned) | 6 | 24 | 0.25 |
| E | call_librarian (warned) | 2 | 30 | 0.07 |
| librarian | call_chair (**refused**) | 2 | 135 | 2 / 137 = 0.015 |
| chair | chair_inject (**refused**) | 1 | 163 | 1 / 164 = 0.006 |
| **all** | | **40** | 434 | |

**By day and seat:**

| day | rows | who |
|---|---|---|
| 09-20 (from 11:45Z) | 3 | B 2, E 1 |
| 09-21 | 4 | librarian 2, chair 1, E 1 |
| 09-22 | 5 | C 5 |
| 09-23 | 14 | C 14 |
| 09-24 to 09-26 | 0 | (no deliveries of any kind on L's board) |
| 09-27 | 14 | A 6, B 4, C 4 |

**All time on L's board:** 44 rows. The 4 before the 7-day cut, on 09-20, are 1 librarian refusal plus E 2 and B 1
warned.

## 2 · TONIGHT'S LAPS L115–L123 — 14 rows

The window runs from L115's first `lap.jsonl` row (2026-09-27T06:45:37Z) to L124's first (11:43:46Z).

| seat | flagged | sent | share |
|---|---|---|---|
| **A** | **6** | 11 | 0.55 |
| **B** | 4 | 12 | 0.33 |
| **C** | 4 | 4 | **1.00** |
| E | 0 | 5 | 0 |
| librarian (call_chair) | 0 | 26 | 0 |
| chair (chair_inject) | 0 | 32 | 0 |

- **Panes: 14 of 32 hand-back rings were flagged (0.44).** No refusal happened in this window.
- **The friction tonight is entirely on the pane-to-librarian edge,** where the gate warns and never refuses.

## 3 · CLASSES — the offending NEXT line, as the packet defines them

The classes are read from the NEXT fragment wherever it sits. §3.1 is the one case the packet's classes don't cover
cleanly.

| class | 7 days (40) | L115–L123 (14) | who |
|---|---|---|---|
| **(a)** no "when" at all | **9** | 5 | B 2 and E 1 (09-20), librarian 1 (09-21), A 1 (09-27), and **C 4 (09-27, inline, §3.1)** |
| **(b)** a condition written with another word | **11** | **9** | E 1 (09-21, `before`), librarian 1 (09-21, `after`), **A 5, B 4 (09-27)**. First alternative word, 7 days: **after 5, before 3, then 3** |
| **(c)** no station | 1 | 0 | C 09-22 (inline, `NEXT: the …`) |
| **(d)** other: **no NEXT line at all** | **19** | 0 | **C 18** (09-22 to 09-23, a single-line message with no `NEXT:` anywhere), chair 1 (a keep-warm dispatch, 09-21) |

(Checks: 9 + 11 + 1 + 19 = 40; 5 + 9 = 14.)

### 3.1 · C's shape: the whole ring is ONE line

- **C's 23 flagged rings in the 7 days are all single-line messages** (newlines 0 in every one).
- In **5** of them `NEXT:` appears **mid-line**. The gate reads the last non-empty line, which is the whole message and
  does not start with `NEXT:`, so it reports **"no NEXT: line at its end"**.
- **Even the inline fragments would fail on their own line:** four are `NEXT: E …` or `NEXT: librarian …` with no whole-word
  `when` after it (class a), and one is `NEXT: the …` (class c). That is why they are counted under (a) and (c) above, not
  (d).
- **C is not always single-line:** 52 of C's 76 `call_librarian` calls in the last 7 days, in C's transcripts on both
  machines, contain a newline.

### 3.2 · The shapes (the NEXT fragment with ordinary words collapsed to …; never the message)

| shape | n (7d) | seats |
|---|---|---|
| `NEXT: librarian … — … after … then …` | 4 | B, 09-27 (4×) |
| `NEXT: librarian … then … before …` | 3 | A, 09-27 |
| `NEXT: librarian … before …` | 1 | A, 09-27 |
| `NEXT: librarian … before … after …` | 1 | A, 09-27 |
| `NEXT: chair … after … until … then …` | 1 | librarian, 09-21 (refused) |
| `NEXT: chair … before … — …` | 1 | E, 09-21 |
| `NEXT: librarian …` | 3 | B 2 (09-20), A 1 (09-27 11:24) |
| `NEXT: chair … — …` | 1 | E, 09-20 |
| `NEXT: chair …` | 1 | librarian, 09-21 (refused) |
| `… NEXT: E …` / `… NEXT: librarian …` (inline) | 4 | C, 09-27 |
| `… NEXT: the …` (inline) | 1 | C, 09-22 |
| no `NEXT:` (last line starts `L0xx C …`, `L0xx hand-back: …`, `[keep-warm …`) | 19 | C 18, chair 1 |

**What (b) looks like in practice.** The seat wrote a real condition with **after, before or then** in the slot where the
gate wants the whole word `when`. The gate does not judge the condition (`trailer.rs:100–102`, "`when done` passes"), so
**these 11 carry a condition the gate cannot see.**

## 4 · COST — refusal to corrected re-send

**Only refusals make a sender re-send.** There were 4 on L's board in all time, 3 of them in the 7-day window and 0 in
L115–L123. Each was paired with the same seat's next call of the same verb. **All four re-sends had the same first 60
characters and pass `check`.**

| when | seat · verb | class | to re-send |
|---|---|---|---|
| 09-20 07:38 (before the cut) | librarian · call_chair | b (`until`) | **11 s** |
| 09-21 09:51 | librarian · call_chair | b (`after`) | **7 s** |
| 09-21 11:29 | chair · chair_inject → B | d (keep-warm, no NEXT) | **9 s** |
| 09-21 13:33 | librarian · call_chair | a | **6 s** |

- **A refusal costs 6–11 s and one re-send**, in all four cases.
- **The 37 warned deliveries (7 days) cost the sender no time.** 0 of 37 were followed by a re-send with the same opening.
  **Their cost lands on the reader**, who must supply the station and condition the sender didn't name.
- **That reader cost is NOT measurable from the board.** It would need the librarian's turns after each warned ring,
  which I did not read.

## 5 · COMMANDS

```
node <scratchpad>/l124/census.js > <scratchpad>/l124/out.json   # sha256 d598dd43…b31c; out.json 7ae021ef…5752
node <scratchpad>/l124/tally.js                                  # sha256 4e0c4509…6a19; §1–§4 tables
grep -c '"pane":"trailer-gate"' C:\Consonance\data\board.jsonl   # 44
```

**How `census.js` works:**
- **Parsing each row:** it reads every `trailer-gate` row and parses verb, sender and action from the text.
- **Pairing:** it pairs each row with the sender's own `tool_use` of that verb, the latest one ≤ 60 s before the row, from
  all `.jsonl` files in that seat's project directory. 2,182 calls were indexed, and 44 of 44 rows paired.
- **Re-checking:** it re-runs a port of `trailer.rs` `check` (:103–129), whose station and verb lists are read from the
  source file itself. The port's reason matches the gate's on 44 of 44.
- **Classifying:** each row is placed in (a)–(d), the line's shape is printed, and a refusal is timed to the next
  same-verb call.

**The C line count** (§3.1) came from a one-off `node -e` over C's transcripts that printed only lengths, newline counts
and offsets.

## 6 · WHAT THIS DOES NOT ESTABLISH

- **L's board only.** D's gate rows are on D's board and are not counted. In particular, there is **nothing from 09-24 to
  09-26**.
- **"Sent" counts deliveries on L's board**, so a ring made on D is in neither the numerator nor the denominator.
- **The 7-day split around C's 09-22/23 burst is not a trend.** C's no-NEXT burst (18) sits entirely in two days, and its
  09-27 rings carry an inline `NEXT:`, so C already moved toward the rule.
- **The reader's cost of a warned ring** is not measured (§4).
- **Whether the (b) conditions were good ones** is not judged, just as the gate does not judge them.
