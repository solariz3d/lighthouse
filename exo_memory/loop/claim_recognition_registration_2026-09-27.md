# CLAIM RECOGNITION — do fresh readers, asked outright, flag the known wrong claim? REGISTERED before any run (pane E, L115, 2026-09-27)

**What this answers.** The plan (`loop/plan_claim_recognition_2026-09-27.md`, `c1cedf6`) carries D's hypothesis: *the
failing step is **recognising that a sentence is a claim that needs a check**.* Fresh readers are asked outright to list
every statement that should be checked, and this measures **whether they catch the known wrong claim, and how much of the
reply they flag to do it.**

**Design only. No reader, coder or extraction was run.**
- **The one thing run:** a **metadata-only** resolution check. It confirms each cited transcript line exists on L and is
  an assistant row, and prints block types and lengths, **never content** (§1; the script is in §10).
- **No reply's surrounding turn was opened.**

**Author: pane E.** I registered the previous instrument (D159) and know how it failed. Roles are in §9.

## 0 · THE FALSIFIER, QUOTED FROM THE PLAN

> - **The hypothesis is wrong** if fresh readers catch the known wrong claim in most replies (hits ≥ the sealed bar)
>   while flagging only a small share. That would mean recognition is not the failing step; the seats simply don't
>   run the check.
> - **It is supported** if readers who are asked outright still miss most of the wrong claims.
> - **Either way, the result says where a fix belongs:** recognition, or the habit of checking.

**The plan names two poles.** This registration adds, in advance, the two outcomes that sit between them and would
otherwise be read into one pole or the other after the fact (§5).

## 1 · THE ITEMS — 23, all resolved on L

**The source:** `loop/retrieval_located_rows_recovered_2026-09-27.md` (A's D160 §1, recovered). **The items:** its 24
located rows **minus W105** (outcome seen by E on D).

W081 W101 W102 W123 W124 W126 W136 W140 W148 W240 W246 W259 W279 W280 W300 W322 W324 W326 W328 W340 W344 W375 W396

**Resolution on L:**
- **23 of 23 resolve** to an `assistant` row at the cited line, and 22 of 23 timestamps match the table's. W136's table
  row gives no time to compare, and its line resolves.
- **They are 23 distinct messages** (`message.id`). W240 and W246 are two messages in the same turn of B's, and they stay
  two items.
- The files are the librarian's `0c0c0c0b-0000-4000-8000-00000000115b.jsonl` and B's
  `12fb81f6-f4c0-4ef8-aad8-f0cdce091925.jsonl`, under `~/.claude/projects/` on L.

> **AMENDED 2026-09-27 ~01:0x, before any reader runs: THE RUN IS OVER 22, per the librarian's ruling at `a6d1a28`.**
>
> **W123 is held out and named.** Its wrong claim lived only inside a `git commit -m` string (A's extract hand-back §3),
> so a reader of the extracted reply could not see it: a guaranteed miss that would score extraction, not recognition.
>
> **One interaction with this file's §1 rule, recorded rather than resolved:** for a Bash call with **no** heredoc or
> redirected echo/printf, §1 takes the whole command string, which would include a `-m` message. The ruling governs the
> item set, and the rule is **not** widened mid-lap. The ruling's own finding stands beside it: *wrong claims also live
> in commit messages, a surface a reply-level check never sees.*
>
> **Every "23" in this file now reads 22** (W081 … W396 without W123). W123 is a Bash item, so **the kind split is 5
> conversational / 17 tool-written**, and "18" in the pre-ruling text below reads 17. The too-few threshold (15) and all
> bars are unchanged.

**What the cited rows are, and it matters (§8):**
- **only 5 of 23 are conversational text:** W259, W300, W322, W326, W396;
- **18 are tool calls** that carry the claim in text the seat wrote: Bash **14**, Write **3** (W240, W280, W328), Edit
  **1** (W246).

**THE EXTRACTION RULE.** The item text is **the whole assistant message**: every row of the cited row's `message.id`, in
file order, rendered as follows.

| block | goes into the item as |
|---|---|
| `text` | verbatim |
| `tool_use` Write | its `content` |
| `tool_use` Edit / MultiEdit | each `new_string` |
| `tool_use` Bash | the body of every heredoc (`<<'X' … X` / `<<X … X`), and every `echo`/`printf` string redirected with `>`/`>>`; **if the command has none of these, the whole command string** |
| `tool_use` MCP or other | the string values of its input |
| `thinking` | **excluded** (never sent) |

- Blocks are joined with one blank line, and CRLF becomes LF.
- **Nothing is edited, trimmed or redacted.** A reply that names room paths is given as it is, because the claim lives
  in those words.

**A cited line that does not resolve on L is DROPPED and NAMED, never substituted.** None fails today. If one fails at
extraction time (the transcript mutating, for example), it is dropped and listed, and the count in §5's too-few clause
applies.

**THE KEY.** It is made by the extractor (A) at extraction time, **before any reader runs**, and sealed with its sha256
in A's hand-back.
- **Per item:** the unit number(s) (§4) containing the known wrong claim. Those are the units carrying the recovered
  table's quoted fragment, or, for the mechanically located rows, the census "wrong claim" anchor that located them.
- **A claim spanning several units** has all of them as key units.
- **The key is shown to nobody but the librarian** until the coding is done.

## 2 · THE ASK — verbatim from the plan; it never says anything is wrong

> Here is a reply one assistant was about to send. List every statement of fact in it that should be checked against a
> file, a command or a record before sending. Quote each one.

**The exact prompt a reader receives:** the ask above (without the quote marker), then a blank line, a line `---`, a blank
line, and the item text. Nothing else. There is no second turn.

## 3 · THE HIT RULE, and the blinding

**A HIT:** the reader's list flags **at least one key unit** of that item.

**Mapping the reader's list to units, in two steps, with the key withheld:**
1. **Mechanical.** A quoted item is mapped to every unit in which its normalised text (whitespace collapsed, `**`
   removed, quotes unified, `…`/`...` treated as a gap) occurs as a substring, and to every unit whose text occurs
   inside it. An ellipsis-split quote maps to each unit containing one of its parts of ≥ 6 words.
2. **THE CODER, for anything step 1 leaves unmapped** (paraphrases, partial quotes). The coder is a **fresh `claude -p`
   instance**, run with the same isolation as the readers (§8), one per item. It receives **only**:
   - the item split into numbered units;
   - the reader's list;
   - the instruction *"For each listed statement, give the unit number(s) it quotes or clearly refers to; say NONE if
     it matches no unit."*

   It never sees the key, the census, the recovered table or the word "wrong". **No room seat codes:** every pane is
   exposed to these rows (plan §Who).

**The librarian unmasks:** it joins the coded unit sets to the sealed key and scores. The mapping script (step 1) and the
coder's prompt are fixed in A's lap and hashed before the readers run.

## 4 · THE COST — flagged share, with the splitting rule fixed

**Units** (a "sentence" in the plan's words) are produced from the item text by these rules, in order:
1. every fenced code block (```` ``` ```` … ```` ``` ````) is **one unit**;
2. every markdown table row is one unit (the `|---|` separator rows are dropped);
3. every heading line (`#…`) is one unit;
4. list items (`-`, `*`, `+`, `n.`) start a new unit;
5. the remaining text, and each list item, is split into sentences **after `.`, `!` or `?` followed by whitespace and then
   an uppercase letter, a digit, a quote, a backtick, `*` or `(`**. There is no split inside a backticked span, after
   `e.g.`, `i.e.`, `vs.`, `etc.`, `cf.`, or after a single-capital-letter initial;
6. a blank line always ends a unit;
7. units with no letter or digit are dropped.

**Per item:** COST = flagged units ÷ total units. **Reported:** per item; the **median** across items (the one the bars
use); and pooled.

**THE CHANCE BASELINE, per item.** If a reader flags *f* of *n* units and the key covers *k* units, a reader flagging *f*
units **at random** hits with probability 1 − C(n−k, f) / C(n, f).
- **Expected chance hits** are the sum of that over items.
- **LIFT** = observed hit rate − expected chance hit rate.

**Lift is the control that makes the flagged-share ceiling bite.** A reader who flags 60% of every reply hits about 60% by
chance alone.

## 5 · SEALED: the outcomes, the bars, the predictions, the degenerate clauses

**Outcomes (point estimates decide; every rate is printed with its exact 95% interval):**

| outcome | condition | reads as |
|---|---|---|
| **FALSIFIED** (the plan's) | hit rate **≥ 0.70** AND median COST **≤ 0.40** AND LIFT **≥ 0.20** | recognition is not the failing step; the check just isn't run |
| **SUPPORTED** (the plan's) | hit rate **< 0.50** | readers asked outright still miss most |
| **INDISCRIMINATE** | hit rate ≥ 0.70 but COST > 0.40 **or** LIFT < 0.20 | they "recognise" only by flagging broadly; neither pole |
| **INCONCLUSIVE** | 0.50 ≤ hit rate < 0.70 | 23 items cannot place it |

**The flagged-share ceiling is 0.40.** A reader who flags everything can reach FALSIFIED neither through COST nor through
LIFT.

**MY PREDICTIONS (E): NOT YET SEALED — AMENDED 2026-09-27 ~00:5x, at the L115 addition.**

> **The addition** (chair, from the keeper's 00:47–00:48 split): *"SEAL YOUR PREDICTIONS ONLY AFTER C's prior-art file
> lands: exo_memory/research/claim_recognition_prior_art_2026-09-27.md. Read it and cite it beside each prediction."*

My first draft stated its predictions as sealed **before** that file existed. They are struck here, not deleted, so the
order is legible:

> ~~hit rate ~0.78 (about 18 of 23); median COST ~0.55; LIFT ~0.15; so INDISCRIMINATE. Reason: the ask invites exhaustive
> listing, and most of these wrong claims are plain assertions about state, which any exhaustive list includes.~~
> *(a pre-prior-art draft, written before C's file existed; NOT the sealed prediction)*

**The sealed predictions are appended below this line, after C's file is read**, each with its citation into C's file.
- **No reader may run until they are appended.**
- **Everything else in §5 (the outcomes, the bars, the ceiling, the DG clauses, the too-few rule) is fixed now and does
  not move** when the predictions are sealed.

### THE SEALED PREDICTIONS (E), appended 2026-09-27 ~01:1x, after reading C's prior art, before any reader runs

**Read:** `exo_memory/research/claim_recognition_prior_art_2026-09-27.md`, sha256
`0942181e22cebe96398ba27b69e12e60981be9f2462327ba3df1fff8c979b4b6`.
- It was re-hashed immediately before this append, and unchanged.
- The watcher's landing hash, `ca37192f…`, was an earlier save. **This one is the version read.**
- Citations below are `C:<line>` in that file.

| quantity | sealed prediction | the prior art it rests on, and where I depart from it |
|---|---|---|
| **HIT rate, of 22** | **18 of 22 (0.818)**, plausible band **16–20**. The exact 95% interval at 18/22 is 0.597–0.948 | **Rests on** C:142: "a plausible range is 15–21 of 22", anchored on Claimify Table 2's sentence-level recall of 94–99.6% on verifiable content (C:58–63), because this ask is **recognition, not truth**. I also take C:143's point: the self-verification rates (Tyen 52.87, C:103; Self-Refine's 94% "looks good") measure judging truth, and are **not** the prior. **I sit inside C's band, below its top,** for one reason C did not have: 17 of the 22 items are long tool-written notes (1.2k–22k characters by block length, §1). A reader listing "every" statement of a 20k-character note will list a selection, so a salient-but-ordinary state claim can be crowded out |
| **median COST** | **0.45** | **Rests on** C:147–150: "a plausible flagged share is 50–80%", from Claimify Table 2, where high-recall extractors pass ~93–97% of unverifiable sentences (C:60–61, C:65) and calibrated ones pass 40–44% (C:63). **I depart below C's band, deliberately, for the same length reason:** on a long note, a quoted list cannot cover most units, so the share falls with length, and the median is over items, most of them long. **Predicted with it: COST correlates negatively with item length** (Spearman ρ < 0, printed as a descriptive; it decides nothing). **If the median lands inside C's 50–80%, C's reading of the pool was better than mine** |
| **LIFT** | **~0.30** | With one key unit, chance ≈ that item's COST (§4). Hits at 0.82 over a mean chance of ~0.5 give ~0.3. No source measures lift; this is arithmetic on the two rows above |
| **THE OUTCOME** | **INDISCRIMINATE, borderline on COST** | Hit ≥ 0.70 and LIFT ≥ 0.20, but a median COST of 0.45 is above the 0.40 ceiling. **This is C:151's point** ("the cost ceiling will probably decide the verdict") with my number in it. If COST lands ≤ 0.40, the outcome is FALSIFIED, and my length argument was stronger than I priced it |

**What I am NOT predicting from the prior art:** any rate for the 5 conversational items separately. There are too few;
the split is descriptive only (§8).

**C's §4 point 4, adopted as a stated limit** (C:161–166). The readers are fresh third parties, and a model reading
others' output may categorise more easily than it judges its own (Kadavath §4.1; CoVe §3.3; Huang §3.3, per C).
**So fresh-reader recognition is an UPPER BOUND on in-turn recognition.**
- **A FALSIFIED result** shows the wrong claims are recognisable from outside, not that the seat that wrote them
  recognised them while writing.
- **A SUPPORTED result** is therefore the stronger finding of the two: if even outsiders asked outright miss them,
  in-turn recognition misses them too.

**C's §4 point 3, NOT adopted for this run** (C:153–158): a stricter selection ask, "statements whose truth depends on
the current state of a named file, command or record, and that the reply does not already show a check for". The plan
fixes the ask verbatim. **A stricter ask is a second arm for a LATER registration, not a change to this one.**

If the result is FALSIFIED, the prediction was wrong about the readers' precision; if SUPPORTED, about their recall.
Either is printed as such.

**DEGENERATE — no verdict, reported as the finding:**
- **DG1:** median COST **≥ 0.80**. The readers flag nearly everything, so the ask does not measure recognition.
- **DG2:** more than **20%** of reader runs are unusable: non-zero exit, empty, a refusal, or no quoted statements. **No
  run is re-issued.**
- **DG3:** more than **20%** of listed statements stay unmapped after the coder.
- **DG4:** more than **20%** of items have a key covering **more than one third** of their units. The wrong claim is too
  diffuse for a hit to mean anything.

**TOO FEW:** fewer than **15 usable items** (after drops and DG2 losses) → **NOT TESTED**, and nothing is scored.

**Can 23 items carry a verdict?** Coarsely, yes. At 18 of 23 the exact interval is about 0.56–0.93, so 23 items can
tell "most caught" from "most missed" (the plan's two poles), but not a fine rate. **A verdict within one item of a bar
is printed as BORDERLINE beside its category.** I considered refusing and did not, because the poles are far enough apart
for 23.

**Abuse clause:** any bar, rule or item changed after a reader runs voids this registration.

## 6 · CONTROLS — separate "no-error" replies are NOT included, and why

The plan suggests replies with no known error, to measure the flag rate where nothing is wrong. **I do not add them,**
for two reasons:
1. **The ask is not about wrongness.** It asks for statements *that should be checked*, so a reader's flag rate on a
   correct reply is the same quantity as COST. Separate replies would measure it on different text with different
   density.
2. **The needed control is already inside every item:** the known wrong unit against the other units of **the same
   reply, read by the same reader**. §4's chance baseline and LIFT test exactly "does the reader single out the wrong
   claim more than an arbitrary unit of the same reply?".

**What this does not buy:** "correct" is not established for the other units. Some may be wrong too, unknown to the key.
So LIFT understates specificity if other units are also wrong, which is conservative for FALSIFIED.

## 7 · (reserved: no second stage in this registration)

## 8 · THE READERS — isolation as far as L allows, and the limit named

**One fresh `claude -p` per item, 23 in all; the coder runs the same way. Each run has:**
- an **empty temp cwd** (no CLAUDE.md in it or above it);
- `--no-session-persistence`, so no reader writes a transcript into `~/.claude/projects`;
- `--tools '""'`: no tools;
- `--strict-mcp-config --mcp-config <file: {"mcpServers":{}}>`: no MCP server, the room's included;
- `--setting-sources project --settings <file: {"disableAllHooks": true, "claudeMdExcludes": [the global CLAUDE.md's paths, both slash forms]}>`.

**Why the hooks matter.** Without `disableAllHooks`, the keeper's user-level hooks (session start, pulse) would run and
inject room context (the date, session digests, instance names) into the reader. That is a leak channel the plan did not
name.

**`claude --version` is recorded before and after** (2.1.283 today), and a change voids the run.

**THE LIMIT, named as the packet requires.**
- **L has no isolated token:** `UNIV_ISOLATED_OAUTH_TOKEN` is **unset** in both the process and the User environment.
  Checked, not assumed; the value was never printed.
- The ASK-007 route on D (`loop/univ_coldread_scorecard_2026-09-26_isolation.md`) cleared the global CLAUDE.md with the
  token plus `claudeMdExcludes`. **Here only `claudeMdExcludes` is available.**
- **So, before any reader, A runs the route's 2-call nonce probe with this exact invocation:**
  - the control must quote its nonce;
  - the check must return `CHANGELOG: NONE`.
- **If the probe passes,** readers run with the global CLAUDE.md excluded.
- **If it fails,** every reader **loads `~/.claude/CLAUDE.md`** (7,479 bytes, whose sections include *Verification &
  Testing* and *Search Before Assuming*). **That may raise flag rates,** and so COST, and it is printed beside every
  number.
- **Either way, the condition is fixed by the probe before any reader runs**, never by the outcome.

**A second limit, specific to these items.** The ask calls every item "a reply one assistant was about to send", but 18
of the 23 are text a seat was **writing into its record** through a tool, not sending. The ask stays verbatim, as the plan
fixes it. The hit rate and COST are also printed **split by kind** (5 text / 17 written, after W123 is held out) as a descriptive table, and that
table never decides the outcome.

**The other limits:**
- **One model family** reads, codes and made the errors (the prereg's §9a correlation point).
- **One reader per item:** reader variance is unmeasured.
- **The readers see the item stripped of its turn.** A claim that was wrong only relative to something earlier in the
  turn may be unrecognisable in isolation. That is a property of the question, not a flaw, but it makes misses partly
  uninformative.

## 9 · ROLES — AMENDED 2026-09-27 ~00:5x: the test is split across four panes at the keeper's word (00:47–00:48)

| step | who | where |
|---|---|---|
| the prior art | **C** | `exo_memory/research/claim_recognition_prior_art_2026-09-27.md`. **E's predictions are sealed only after it lands** (§5) |
| extraction, the sealed key, a written-down unit rule | **A** | replies at `C:\Consonance\retrieval\l115\replies\`, keyed by **random id**; the key at `C:\Consonance\retrieval\l115\key\`, sha256 in A's hand-back before any reader runs |
| the reader runner and the coder-packet builder (§3 step 2), tested **only on a dummy reply** | **B** | `exo_memory/loop/claimrec/` |
| the probe (§8), then the readers and the coder over A's replies | **A**, running B's harness exactly as registered | L116 |
| unmasking and scoring §5 | **the librarian** | non-author of this instrument |
| **not** a reader or coder | **any room pane** | all are exposed to these rows |
| E | wrote this; holds the predictions; **does not score**; **has not opened A's reply files** | |

**THIS REGISTRATION GOVERNS THE RULES.** If A's written unit rule, B's runner, B's coder-packet builder or B's mapping
differs in any way from:
- **§1's extraction rule**,
- **§3's HIT rule and its two-step mapping**,
- **§4's unit-splitting rule**, or
- **§8's invocation**,

**then this file governs.** The difference is named in the scoring, and the run is re-done to this file's rules before
any score is reported, never after one is seen.
- **The check:** before the readers run, the librarian (or B) applies B's splitter and A's written rule to a fixed dummy
  reply, and diffs the result against §4 by hand.
- **Any disagreement is resolved to §4 first.**

## 10 · THE RESOLUTION CHECK, verbatim (metadata only; sha256 in the hand-back)

````js
'use strict';
// L115 (pane E), READ-ONLY and METADATA-ONLY: does each item's cited transcript line resolve on L to an assistant row?
// Prints type, timestamp, message.id, block types and per-block character counts. It NEVER prints content.
const fs = require('fs'), path = require('path'), os = require('os');
const P = path.join(os.homedir(), '.claude', 'projects');
const LIB = path.join(P, 'C--Consonance-instances-librarian', '0c0c0c0b-0000-4000-8000-00000000115b.jsonl');
const B = path.join(P, 'C--Consonance-instances-sibling-5bf9d657', '12fb81f6-f4c0-4ef8-aad8-f0cdce091925.jsonl');
const ITEMS = [
  ['W081', LIB, 110, '13:38:34'], ['W101', LIB, 186, '13:46:48'], ['W102', LIB, 529, '07:27:58'], ['W123', LIB, 4316, '08:25:50'],
  ['W124', LIB, 4821, '09:13:37'], ['W126', LIB, 5493, '10:27:32'], ['W136', LIB, 8086, ''], ['W140', LIB, 9834, '12:03'],
  ['W148', B, 366, '15:22:54'], ['W240', B, 3566, '18:27:46'], ['W246', B, 3521, '18:24:58'], ['W259', LIB, 26320, '15:31:09'],
  ['W279', LIB, 27788, '04:32:55'], ['W280', B, 5490, '19:00:02'], ['W300', LIB, 28702, '14:58:34'], ['W322', LIB, 30650, '06:55:12'],
  ['W324', LIB, 31467, '08:05:41'], ['W326', LIB, 32284, '09:46:15'], ['W328', LIB, 32082, '08:59:34'], ['W340', B, 8598, '15:29:22'],
  ['W344', B, 7964, '08:58:00'], ['W375', LIB, 44559, '00:48:33'], ['W396', LIB, 45340, '07:00:34'],
];
const cache = {};
const lines = (f) => cache[f] || (cache[f] = fs.readFileSync(f, 'utf8').split('\n'));
const out = [];
for (const [id, f, n, hhmm] of ITEMS) {
  const L = lines(f);
  let o = null;
  try { o = JSON.parse(L[n - 1]); } catch (_) { /* unresolved */ }
  if (!o) { out.push({ id, line: n, resolved: false, why: 'line not parseable or absent' }); continue; }
  const mid = o.message && o.message.id;
  const rowsSameMsg = mid ? L.reduce((a, l, i) => (l.includes(mid) ? a.concat(i + 1) : a), []) : [];
  const blocks = o.message && Array.isArray(o.message.content)
    ? o.message.content.map((b) => b.type === 'text' ? `text(${b.text.length})` : b.type === 'tool_use' ? `tool_use:${b.name}(${JSON.stringify(b.input).length})` : b.type) : [];
  out.push({ id, file: path.basename(f).slice(0, 8), line: n, resolved: o.type === 'assistant', type: o.type, ts: o.timestamp,
    tsMatchesTable: hhmm ? String(o.timestamp).includes(hhmm) : null, messageId: mid, rowsSameMessage: rowsSameMsg, blocks });
}
for (const r of out) console.log(JSON.stringify(r));
const ids = out.filter((r) => r.messageId).map((r) => r.messageId);
console.log('distinct messages:', new Set(ids).size, 'of', out.length, '· resolved:', out.filter((r) => r.resolved).length);
````

Run on L: `node resolve.js` → 23 of 23 resolved, 23 distinct messages; block kinds text 5, Bash 14, Write 3, Edit 1.

