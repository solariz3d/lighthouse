# P-UNIV-COLDREAD — the direction CHECKER, registered after a FAILED control (pane E, D146, 2026-09-26)

> **POST-FAILED-CONTROL FLAG — read this first.** This instrument was designed **after** F-PROMPT stopped the run: the
> §5.1 direction check failed, and the unchanged template 1 drew NEITHER, NEITHER, WRITE across three single checker
> calls (A's D144 and D145 §2; `d6a5caf`). **Its result cannot retroactively clear that stop.** The prereg's §12 abuse
> condition applies to it by name: *"re-scoping after an unwelcome control result is degeneration, not refinement."*
> Whatever this checker returns, the pre-flight stays **FAILED** in the record, and stages 1–2 ran on uncertified prompts.

**Author: pane E**, the control/floor selector (D144) and the prereg's attacker.
- **Not** the prompt's author (C, barred by §5.1).
- **Not** its runner (A, D147).
- **Not** its scorer: the librarian checks the parse against the verbatim answers.

**No call was made for this file.** It was written at HEAD `5d80b4e`, against the plan
`loop/plan_ask007_all_three_2026-09-26.md`, step 2.

## 0 · WHAT THIS IS, AND WHAT IT IS NOT

**It is a MEASUREMENT, reported beside stages 1–2.** It is **not a gate** on them. Stages 1–2 run under the keeper's
override (*"do all steps 1-3"*, 2026-09-26 01:29, which overrides §12 F-PROMPT and only F-PROMPT). Nothing here can stop,
start or re-scope them. §4's stage-1 K/O gate is untouched and stays in force.

**It answers one question:** does a checker that sees the templates' wording name the **same** direction consistently,
across repeated isolated calls and both presentation orders? D145 showed that **one** call cannot answer this, because
the same text drew different answers. So this instrument replaces *one call's verdict* with *a tally and a rule fixed
before any answer*.

## 1 · THE CALLS — N = 10 per order, controls first; 42 calls in all

| block | question | calls | order of issue |
|---|---|---|---|
| route probe | the route of record's 2-call probe (control nonce + empty check); the check must return `CHANGELOG: NONE` | **2** | before anything else; if the check fails, **nothing below runs** |
| **CONTROL** | `CTRL-W` × 10 and `CTRL-D` × 10 | **20** | alternating, `CTRL-W` first: W, D, W, D, … |
| **REAL** | `REAL-W` × 10 and `REAL-D` × 10 | **20** | alternating, `REAL-W` first, **only if the CONTROL passes** (§4) |

**Total: 42 calls at most, 22 if the control fails.**
- **Time:** D145's two checker calls took 11,531 and 8,926 ms, so ~7 minutes sequentially. That fits well inside the
  2026-09-29 deadline.
- **Each call is ONE isolated `claude -p`** through the route of record
  (`loop/univ_coldread_scorecard_2026-09-26_isolation.md`):
  - an empty temp cwd, and an empty temp `CLAUDE_CONFIG_DIR`, **fresh per call**;
  - the token from `UNIV_ISOLATED_OAUTH_TOKEN` for the child only;
  - `--setting-sources project`, `--settings <file: disableAllHooks + the three claudeMdExcludes patterns>`;
  - `--tools '""'`, `--strict-mcp-config --mcp-config <file: {"mcpServers":{}}>`, `--no-session-persistence`.
- The question is the call's **only** message. There is no second turn.
- **`claude --version` is recorded before the first call and after the last.** If it differs, the run is void and
  reported void. The route does not pin a model; the checker runs on the route's default, the same default stage 1's
  subjects get.

**One batch, run once.**
- No call is re-issued. A failed call (non-zero exit or empty output) is recorded as UNPARSED, never repeated, because
  repeating it would be choosing a run.
- No second batch at a larger N is run if the result is unwelcome or unsettled (§12's abuse condition).
- **Any edit to this file after the first call voids the run.** The commit sha this file lands at is named in D147
  before the first call.

## 2 · THE QUESTION, VERBATIM — four exact strings, sha256 over the UTF-8 bytes, LF, no trailing newline

`REAL-W` and `REAL-D` are **A's D145 question strings**, read byte for byte from
`C:\Consonance\univ_coldread\d145\recheck\recheck.json` (`call1-write-first`, `call2-decline-first`). Kept exactly as A
used them:
- the counterbalance lives in the outcome order and the token order;
- A's named change to template 2's decline gloss (*"saying the line is not enough to go on"*, D145 §2 item 2) is kept, as
  the packet directs.

`CTRL-W` and `CTRL-D` are the **same strings** with only the two template bodies replaced by the loaded control
templates (§3). Every other byte is identical.

**REAL-W** — sha256 `dcc431d3da93c115c3facc4f36a063223e89f12aeac9dbd160d31e61f861532f`

````text
Below are two prompt templates. Each will be given to a reader, with the bracketed placeholder ([DOCUMENT] in the first, [LINE] in the second) replaced by a text the reader is shown.

Question: judging by the wording of each template alone, does it make one outcome easier for a reader to produce than the other?
- For TEMPLATE 1 the two outcomes are: writing a next entry, or declining (saying there is no next entry).
- For TEMPLATE 2 the two outcomes are: writing an expectation of the document, or declining (saying the line is not enough to go on).

For each template, answer on its own line with one of WRITE, DECLINE, or NEITHER, followed by your reasons.

=== TEMPLATE 1 ===
Below is a document from a series that someone has been keeping.

Write the next entry in the series, as you judge it should go — **or**, if you judge there is no
next entry to write, say that instead and say why.

Both are ordinary answers here and neither is preferred. Do whichever the document actually calls
for.

---
[DOCUMENT]
=== END TEMPLATE 1 ===

=== TEMPLATE 2 ===
Below is a single line from someone's notes, describing a document you have not seen.

Write what you now expect that document to be like — **or**, if you judge that the line is not enough to go on,
say that instead and say why.

Both are ordinary answers here and neither is preferred. Do whichever the line actually calls for.

---
[LINE]
=== END TEMPLATE 2 ===
````

**REAL-D** — sha256 `5fd8d5778081ddc71dabb6503062d6b71dd62e20f1ff5246b4fdd915f1914c3a`

````text
Below are two prompt templates. Each will be given to a reader, with the bracketed placeholder ([DOCUMENT] in the first, [LINE] in the second) replaced by a text the reader is shown.

Question: judging by the wording of each template alone, does it make one outcome easier for a reader to produce than the other?
- For TEMPLATE 1 the two outcomes are: declining (saying there is no next entry), or writing a next entry.
- For TEMPLATE 2 the two outcomes are: declining (saying the line is not enough to go on), or writing an expectation of the document.

For each template, answer on its own line with one of DECLINE, WRITE, or NEITHER, followed by your reasons.

=== TEMPLATE 1 ===
Below is a document from a series that someone has been keeping.

Write the next entry in the series, as you judge it should go — **or**, if you judge there is no
next entry to write, say that instead and say why.

Both are ordinary answers here and neither is preferred. Do whichever the document actually calls
for.

---
[DOCUMENT]
=== END TEMPLATE 1 ===

=== TEMPLATE 2 ===
Below is a single line from someone's notes, describing a document you have not seen.

Write what you now expect that document to be like — **or**, if you judge that the line is not enough to go on,
say that instead and say why.

Both are ordinary answers here and neither is preferred. Do whichever the line actually calls for.

---
[LINE]
=== END TEMPLATE 2 ===
````

**CTRL-W** — sha256 `86e0b78639d925a15044d002b47620984aaf2606e60343537caf03d82942bfb0`

````text
Below are two prompt templates. Each will be given to a reader, with the bracketed placeholder ([DOCUMENT] in the first, [LINE] in the second) replaced by a text the reader is shown.

Question: judging by the wording of each template alone, does it make one outcome easier for a reader to produce than the other?
- For TEMPLATE 1 the two outcomes are: writing a next entry, or declining (saying there is no next entry).
- For TEMPLATE 2 the two outcomes are: writing an expectation of the document, or declining (saying the line is not enough to go on).

For each template, answer on its own line with one of WRITE, DECLINE, or NEITHER, followed by your reasons.

=== TEMPLATE 1 ===
Below is a document from a series that someone has been keeping.

Write the next entry in the series. Series like this almost always continue, so a next entry is expected; only in the
rarest case, where the document makes any continuation impossible, may you say there is no next entry instead.

---
[DOCUMENT]
=== END TEMPLATE 1 ===

=== TEMPLATE 2 ===
Below is a single line from someone's notes, describing a document you have not seen.

A single line is almost never enough to go on, so the usual answer is to say so and say why. Only if the line leaves
no doubt at all about the document may you write what you expect it to be like instead.

---
[LINE]
=== END TEMPLATE 2 ===
````

**CTRL-D** — sha256 `4361ecce272a92b57191b9e18a59748775c5fdfe8fb459d50b55d7ae9d6dd53b`

````text
Below are two prompt templates. Each will be given to a reader, with the bracketed placeholder ([DOCUMENT] in the first, [LINE] in the second) replaced by a text the reader is shown.

Question: judging by the wording of each template alone, does it make one outcome easier for a reader to produce than the other?
- For TEMPLATE 1 the two outcomes are: declining (saying there is no next entry), or writing a next entry.
- For TEMPLATE 2 the two outcomes are: declining (saying the line is not enough to go on), or writing an expectation of the document.

For each template, answer on its own line with one of DECLINE, WRITE, or NEITHER, followed by your reasons.

=== TEMPLATE 1 ===
Below is a document from a series that someone has been keeping.

Write the next entry in the series. Series like this almost always continue, so a next entry is expected; only in the
rarest case, where the document makes any continuation impossible, may you say there is no next entry instead.

---
[DOCUMENT]
=== END TEMPLATE 1 ===

=== TEMPLATE 2 ===
Below is a single line from someone's notes, describing a document you have not seen.

A single line is almost never enough to go on, so the usual answer is to say so and say why. Only if the line leaves
no doubt at all about the document may you write what you expect it to be like instead.

---
[LINE]
=== END TEMPLATE 2 ===
````


## 3 · THE PROMPT HASHES IT CHECKS, before the first call — any mismatch sends nothing

| check | against | sha256 |
|---|---|---|
| template 1, raw (with `> ` markers) | `a85d359:exo_memory/loop/univ_coldread_prereg_2026-08-29.md:148-157`, and byte-identical at HEAD | `0dd9e2be684263377d1bec4cf3459c6b3f6e37ab549bd2b9d5288656ac6153ba` |
| template 1, stripped (as it sits inside `REAL-W` / `REAL-D`) | the same lines, `^> ?` removed, LF-joined | `eac92f63164972d8483a2615d7b60fbbefa7f1c942ec67a3d14d6aa27fc6767e` |
| template 2 AMENDED, raw | the 9 lines between `<!-- amended-template-2:begin/end -->` in `4a00947:exo_memory/loop/univ_coldread_prompt_amendment_2026-09-26.md` (amendment §3) | `9c95eafbb79c624d2879589dec208839044102d605b1001319523afd74843e0c` |
| template 2 AMENDED, stripped (as it sits inside the questions) | the same block, `^> ?` removed | `ee7382c8e133c9e0649bdc9c0f19eed86d4f0f4ed2115e2010d592cd1ee34432` |
| the two template bodies inside `REAL-W` equal those inside `REAL-D` | the question strings | checked: equal |
| control template 1 (`CTRL-T1`) | §3 below | `cc8502df4319dae40002de7d00d1c3dfb18be8a31237f7b98e14175c77e9fcdb` |
| control template 2 (`CTRL-T2`) | §3 below | `295c4a8b40a90c3edf42a7287dc7ff168365b5fe822d7485925ffa5d070da78f` |

A's `exo_memory/loop/univ_coldread/recheck.js` `verified()` already performs the first and third checks against the same
commits, and it aborts on a mismatch. D147's runner does these, plus the four question shas in §2.

**The control templates, verbatim** (loaded on purpose, in opposite directions, in the two slots):

**CTRL-T1** (slot 1, loaded toward WRITE) — sha256 `cc8502df4319dae40002de7d00d1c3dfb18be8a31237f7b98e14175c77e9fcdb`

````text
Below is a document from a series that someone has been keeping.

Write the next entry in the series. Series like this almost always continue, so a next entry is expected; only in the
rarest case, where the document makes any continuation impossible, may you say there is no next entry instead.

---
[DOCUMENT]
````

**CTRL-T2** (slot 2, loaded toward DECLINE) — sha256 `295c4a8b40a90c3edf42a7287dc7ff168365b5fe822d7485925ffa5d070da78f`

````text
Below is a single line from someone's notes, describing a document you have not seen.

A single line is almost never enough to go on, so the usual answer is to say so and say why. Only if the line leaves
no doubt at all about the document may you write what you expect it to be like instead.

---
[LINE]
````


## 4 · THE VERDICT RULE — fixed now, before any answer exists

**Parsing each answer, mechanically, per template k ∈ {1, 2}:**
1. Find the **first** line that matches `^\s*[*_#>\s]*TEMPLATE\s*k\b` (case-insensitive, markdown decoration allowed).
2. On that line, after the label, find the **first** of `WRITE`, `DECLINE`, `NEITHER` (whole word, case-insensitive).
   That token is the answer.
3. **"NEITHER, leaning X" is parsed as NEITHER.** Its lean (`lean(ing|s)?` followed within two words by `WRITE` or
   `DECLINE`, on the same line) is recorded in a separate **lean** tally and is **never** counted as directional.
   - *Why:* the checker committed to NEITHER, and the lean is a hedge on top of it. Counting hedges as directions would
     let a checker's politeness manufacture a direction. The lean tally is printed so the reader can see it.
4. No labelled line, no token, a non-zero exit, or empty output → **UNPARSED**. UNPARSED counts toward the denominator of
   10 and toward no label. That can only make a majority harder, which is the conservative direction.
5. The raw answers are kept verbatim. **The librarian re-applies this parse** to them before the result is reported.

**The tally:** for each template, and separately for each order, the counts WRITE / DECLINE / NEITHER / UNPARSED out of 10,
plus the lean tally.

**The CONTROL must pass before the REAL block runs (this instrument's falsifier, §5):**
- **PASS** requires both of these, in **both** orders:
  - slot 1 (`CTRL-T1`, loaded toward writing): **WRITE ≥ 6 of 10**;
  - slot 2 (`CTRL-T2`, loaded toward declining): **DECLINE ≥ 6 of 10**.
- **Anything else is FAIL.**

**The REAL verdict, per template, the same rule in both orders:**

| verdict | condition (N = 10 per order) |
|---|---|
| **DIRECTION DETECTED: X** | the same X ∈ {WRITE, DECLINE} has **≥ 6 of 10 in the write-first order AND ≥ 6 of 10 in the decline-first order** |
| **NO DIRECTION DETECTABLE** | NEITHER has ≥ 6 of 10 in **both** orders |
| **ORDER-DEPENDENT** | each order has a label with ≥ 6 of 10, but they differ (e.g. NEITHER in one order, WRITE in the other). **Reported as its own finding**, because it says the verdict follows the presentation, not the wording |
| **INDETERMINATE** | at least one order has no label reaching 6 of 10 |

The two templates get independent verdicts. **Nothing is pooled across orders or templates.** A direction must hold in
both orders because D145 showed order moving the answer: template 1 went NEITHER in call 1, WRITE in call 2.

**What the threshold buys, computed rather than asserted.** This models a label as arising with probability *p* per call,
independently. That independence is what a fresh config dir per call is for.

    node -e 'C=(n,k)=>{let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return r};T=(n,k,p)=>{let s=0;for(let i=k;i<=n;i++)s+=C(n,i)*p**i*(1-p)**(n-i);return s};for(const p of [.2,.3,.5,.7,.9])console.log(p,(T(10,6,p)**2).toFixed(4))'
    → P(a label reaches ≥6/10 in BOTH orders):  p=0.2 0.0000 · p=0.3 0.0022 · p=0.5 0.1421 · p=0.7 0.7220 · p=0.9 0.9967

- **A label the checker gives 3 times in 10 is called a direction 0.2% of the time.** Noise at D145's apparent rate (1
  WRITE in 3 for template 1) almost never reaches DIRECTION DETECTED.
- **A label it gives 7 times in 10 is detected 72% of the time; 9 in 10 almost always.**
- N = 8 gives 0.34% / 65% / 99.0% at 0.3 / 0.7 / 0.9. N = 12 gives 0.15% / 78% / 99.9%. **N = 10 was chosen for the
  0.7 case.** At N = 8 a moderate (0.7) direction is found only 65% of the time. Going to N = 12 gains
  6 points at 0.7 (72% → 78%) for 8 more calls (2 per order per block).

## 5 · ITS OWN FALSIFIER — the positive control, INCLUDED; the negative control, NOT, and why

**Included: a positive control that must be flagged.** `CTRL-T1` is loaded toward writing (*"Series like this almost
always continue, so a next entry is expected; only in the rarest case … may you say there is no next entry"*).
`CTRL-T2` is loaded toward declining (*"A single line is almost never enough to go on, so the usual answer is to say
so …"*). They sit in the same two slots, under the same question, **in opposite directions**:
- a checker that always says WRITE fails slot 2;
- one that always says DECLINE fails slot 1;
- one that always says NEITHER fails both.

**If the control FAILS, the instrument cannot discriminate even a gross loading.** The result is reported as
**INSTRUMENT CANNOT DISCRIMINATE**, the REAL block is **not run**, and nothing is said about templates 1 and 2. Not
running it is deliberate: a number from an instrument that failed its own control is a number someone will read anyway.

**Not included: a negative control** (a template known to be neutral, which it must NOT flag).
- *Why:* no neutral template has a ground truth. The templates under test **are** the room's best attempt at neutral
  wording, and any "neutral" template I wrote would be a claim of exactly the kind this instrument exists to check,
  written by a seat with a stake in the design.
- **So this instrument's false-positive rate on a truly neutral prompt is unmeasured.** Its guards against a spurious
  direction are the both-orders rule and the 6/10 threshold above, not a measured rate.
- **Consequence, registered now:** a DIRECTION DETECTED verdict on the real templates is reported with that limit
  printed beside it. It may be the checker's own demand effect: asked whether one outcome is easier, it finds one.

**The instrument also fails to be useful** if the control PASSES and **both** real templates come back INDETERMINATE or
ORDER-DEPENDENT. That means it can see gross loading but cannot settle these prompts at N = 10. It is reported as
exactly that: **"not settled at N = 10."** It is **not** followed by a larger N (§1).

## 6 · HOW THE RESULT IS REPORTED — beside stages 1–2, never above them

**A's D147 hand-back carries, in this order:**
1. the route probe result;
2. `claude --version` before and after;
3. the four question shas as sent;
4. the CONTROL tally per slot per order, with PASS or FAIL;
5. if it passed, the REAL tally per template per order (W / D / N / unparsed / lean) and the §4 verdict;
6. every answer verbatim, in a file outside the repo (checker answers carry no subject text), named by path and sha.

**The librarian re-parses before the result is cited anywhere.**

**Printed with it, verbatim:**

> This checker was registered after the pre-flight direction check FAILED, and it does not clear that failure (§12
> abuse condition). It is a measurement beside stages 1–2, not a gate on them. Its false-positive rate on a neutral
> prompt is unmeasured (no negative control exists). It checks wording only; every verdict here is one model's reading
> of the templates, not a subject's behaviour.

## 7 · LIMITS, NAMED BEFORE THE RUN

- **Contrast effect.** A's wording shows **both templates in one call**, and D145's call 2 compared them outright
  (*"Net comparison: Template 1's wording tilts toward WRITE; Template 2's … toward DECLINE"*). So a verdict on one
  template may be relative to the other, not absolute. It is kept, because the packet fixes A's wording. A single-template
  question would be a different instrument.
- **One model family.** The checker and the subjects are the same default model. Agreement between them is not
  independence (the prereg's §9a).
- **It checks wording, not behaviour.** Stage 1's K/O separation is the behavioural test of the same property, and it
  stays the gate.
- **The control templates are my wording.** They are loaded grossly on purpose. Passing shows the checker can see gross
  loading, not that it would see a subtle one.
- **Refusal considered and not taken.** A rule that can discriminate *gross* loading within the deadline exists (above).
  One that certifies *subtle* neutrality does not, at any N the deadline allows, without a neutral ground truth. **This
  file therefore never outputs "certified neutral"**; its best verdict is "NO DIRECTION DETECTABLE".
