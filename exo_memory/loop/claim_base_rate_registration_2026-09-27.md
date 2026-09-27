# THE BASE RATE — how often is an unchecked claim actually WRONG? REGISTERED before any sample is drawn (pane E, L119, 2026-09-27)

**Why.** The keeper, 02:02: *"we should not automatically assume its wrong until it is check to see"*
(`1edd61b`). So the source rule **marks** a claim as checked or inferred rather than banning unchecked claims, and the
missing number is **P(wrong | unchecked)**. Plan: "NEXT: THE BASE RATE (L119)" in `loop/plan_claim_recognition_2026-09-27.md`
(`69a9dad`).

**Design only.** The one thing run is a **counts-only frame measurement** (`frame.js`, §10). It counted distinct assistant
messages per seat per day, and per machine. **No message was sampled and none was read.**

## 1 · THE SAMPLING FRAME

**Seats (their MAIN session transcripts, as carried on L, under `~/.claude/projects/`):**

| seat | transcript |
|---|---|
| librarian | `C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b.jsonl` |
| chair | `C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl` |
| A | `C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f.jsonl` |
| B | `C--Consonance-instances-sibling-5bf9d657/12fb81f6-f4c0-4ef8-aad8-f0cdce091925.jsonl` |
| C | `C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1.jsonl` |
| E | `C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565.jsonl` |

**Not included:** the Third Place (private by the room's rule), subagent transcripts, and one-shot or probe sessions.

**The window: message timestamps from 2026-09-14T00:00Z up to, but not including, 2026-09-24T00:00Z.**
- **Why these dates, from the frame measurement (§10):**
  - all six seats have dense coverage on both machines on these days (e.g. 09-21: librarian 102 L + 104 D, and B
    27 L + 51 D);
  - **git on L is complete for them.** L holds every commit through `5ced140` (2026-09-25 12:54 −06:00), so a claim
    made up to 09-23 has its as-of commit on L.
- **Excluded by design:**
  - **09-24 to 09-26:** D's work after `5ced140` was never pushed, so its as-of repo state is **not on L**. D's 09-26
    transcript rows ARE carried here (e.g. librarian 86 D-rows that day), but the state they talk about is not.
  - **09-27:** the lap of this very study; claims about it are circular.
  - **Before 09-14:** only the chair and the librarian have transcripts on L there, so the seats would be unbalanced.

**The unit sampled is the ASSISTANT MESSAGE** (one `message.id`), counted only if its claim-bearing text is at least
**200 characters**. Claim-bearing text follows arm 1's §1 rule: text blocks, plus the written text of Write, Edit and
MultiEdit, plus Bash heredoc bodies. Shorter messages are tool narration, and would cost verification time for no claims.

**THE SEED AND ORDER:** order every frame message by **`sha256("L119|" + message.id)` ascending**, and take them in that
order. The string is fixed here, before any sample exists, and is public, so it cannot be re-rolled.

**Exclusions, applied before ordering:**
- **the turns** (prompt-to-prompt) containing any cited line of the 24 census rows in
  `loop/retrieval_located_rows_recovered_2026-09-27.md`, W105's `0c0c0c0b…:1172` included, so the sample is not
  selected for a known error;
- **messages whose turn is the arm-1/arm-2 or this study's own work** (none fall in the window; stated for completeness).
- **The direction of the bias:** it is **downward and small**, 24 turns out of thousands.
- **What is NOT excluded:** errors recorded in the 422-row census (`703dc74`, D-only, unpushed) that were never located.
  A random sample may include such a message. That is correct for a base rate, since caught errors belong to the
  population, and it is named.

**What L does not hold, named:**
- D's commits after `5ced140`, which is why the window stops at 09-23;
- any transcript of a D session that was never carried to L;
- the runtime state of either machine at any past time: processes, environment variables, the app's UI, files outside
  git and outside an append-only ledger.

## 2 · CLAIM EXTRACTION — arm 1's harness and ask, by reference

- **The message's text** is extracted by arm 1's §1 rule (`c8c18d4` R1:60).
- **The claims** are the **quoted statements** returned by arm 1's reader: `claimrec.js readers` with **no `--ask`**,
  i.e. arm 1's sealed ask (R1:87–94), run with arm 1's isolation (R1:237–277). Arm 1's recall is known: HIT 16/17 (S1:19).
- **Statements are parsed** per ruling `be4b03b` point 3.

**Claims per message are capped** at **K** (fixed at the seal, §6). Take the message's statements in
`sha256(message.id + "|" + statementIndex)` order, and keep the first K. This bounds clustering and verification time.

## 3 · KIND RULES — each claim gets exactly one, assigned BEFORE its verdict

The verifier sees the claim's **turn** (the prompt, the tool calls and results before the claim, and the message itself)
and assigns the kind **first**. The kind is recorded, and only then is the claim verified. Precedence runs top-down:

| kind | rule |
|---|---|
| **CHECKED** | The same message or the same turn, **before the claim**, shows a tool call on the claim's object **and** that call's result, and the claim reports what the result says (its value, count, state or content). Naming a check without its result is **not** CHECKED |
| **UNCHECKED CONCLUSION** | Not CHECKED, and the claim is a **verdict, a causal claim or an inference**: it says something is fixed, works, broken, safe, correct, the cause, or "so / therefore / which means …", or it goes beyond anything a shown result says. **Tie-break:** if the claim has one part that could be CHECKED and one inference part, it is a CONCLUSION |
| **UNCHECKED STATE** | Not CHECKED, and a plain assertion of present or past state: a file's content or existence, a count, a commit, a process, another seat's state, a date or time |
| *(not a claim)* | intent or plan ("I will…", "next …"), instructions, opinions, questions. **Counted and dropped**; they have no verdict |

## 4 · VERDICT RULES — against the source AS OF the claim's time

**THE AS-OF SOURCE, in order of preference** (B's helpers do the lookups; the verifier judges):
1. **Repo files and commits:** `git show <last commit before the claim's timestamp>:<path>`, and `git log` up to that
   time. A claim about an **uncommitted** change is judged against the commit that landed it, **if** that landed within
   24 h and the claim names it as uncommitted. Otherwise it is UNVERIFIABLE.
2. **Append-only ledgers** (the board, `lap.jsonl` and the other rows-with-`ts` files on L), filtered to rows with
   `ts ≤` the claim's time.
3. **The same seat's transcript**: tool results **before** the claim that directly show the state.
   - For a claim about the seat's own earlier action or output ("I ran X; 36/0"), this is the source by definition.
   - **A later tool result counts only if** it is within 30 minutes **and** nothing in between could have changed the
     thing.

**VERDICTS:**

| verdict | rule |
|---|---|
| **CORRECT** | the as-of source supports the claim, to the precision it states (a number matches as written; "about 20" against 19 is CORRECT) |
| **WRONG** | the as-of source contradicts **any** part of it. A compound claim with one false part is WRONG, and is tagged PARTIAL for a descriptive count |
| **UNVERIFIABLE** | **no** as-of source exists: runtime state (processes, environment, UI), files outside git and outside a ledger, D-side state not carried, external services, or a source that exists but is ambiguous about the claim |

**Hard cases, fixed now:**
- **The future** ("A will run arm 2 at 03:00"): not a claim about state, so **counted as UNVERIFIABLE-FUTURE** and kept out
  of every rate.
- **Intent** ("I'll check X"): not a claim (§3). **Dropped.**
- **Another seat's state** ("B is on L107", "C is logged out"): **verifiable from the board** (that seat's rows around
  the claim's time) or from that seat's transcript. Otherwise UNVERIFIABLE.
- **A claim about what a document says:** verified against the document as of the claim's time.
- **A number the seat reports from its own tool run:** verified against the shown result. Such a claim is usually
  CHECKED, and a CHECKED claim can still be **WRONG** (a misreport).

**C's hard cases** (`exo_memory/research/claim_base_rate_priors_2026-09-27.md`, sha256 `1991102b…`, cited **P:<line>**),
adopted before any sample:
- **FUTURE, INTENT and OPINION are routed out at the KIND step (§3, "not a claim"), before any verdict** (P:175–176,
  after AVeriTeC and Konstantinovskiy at P:96–110). **They are counted, and never enter UNVERIFIABLE or any
  denominator.** The "UNVERIFIABLE-FUTURE" label above is therefore just the routed-out count.
- **Another seat's state is a state claim**, verifiable only where a record of that seat at that time exists (board row,
  pulse, transcript), and UNVERIFIABLE otherwise (P:177–179). This matches the rule above.
- **ONE DEVIATION FROM C, argued:** C suggests routing the SPEAKER's own state out too (P:175, after Liu §2.3 at
  P:105–108). **Here it stays IN as a state claim.** In this room a seat's claims about its own state or actions are
  checkable against its own transcript, and one of the 24 located wrong claims is exactly that kind (W259, "My shell
  alone fills the window"). Routing them out would remove a known failure class from the base rate.

## 5 · THE QUANTITIES, and how they are reported

- **P(wrong | kind)** = WRONG ÷ (CORRECT + WRONG) for each kind. **UNVERIFIABLE is excluded from the denominator and
  printed beside it**, never folded in.
- **P(wrong | unchecked)** pools UNCHECKED STATE and UNCHECKED CONCLUSION.
- **Intervals:** exact Clopper–Pearson 95% for every rate.
- **The unit is the claim, clustered in messages.** Alongside every pooled rate, a **message-level cluster bootstrap**
  interval is printed (2,000 resamples, seed `"L119-boot"`). **Where they differ, the wider one is the one read.**
- **The plan's hypothesis, priced and not assumed:** P(wrong | conclusion) > P(wrong | state) > P(wrong | checked).
  - **Each step is reported as a difference with its interval.**
  - A step counts as "shown" only if its bootstrap 95% interval excludes 0.

## 6 · SAMPLE SIZE — derived from C's priors, fixed at the seal

**FIXED: M = 100 messages**, the first 100 in §1's seed order after exclusions, **and K = 3 claims per message** (§2). No
replacement, no top-up: a message yielding fewer than 3 statements contributes what it has.

**The expected yield**, a model fixed now so the precision can be stated; the real counts are printed beside it:
- about 280 extracted statements (100 × ≈ 2.8);
- **minus ~15% routed out** (future, intent, opinion; P:175);
- **~15% of the remainder CHECKED;**
- **~30% of the unchecked UNVERIFIABLE** (the middle of P:166's 10–35%);
- which gives **≈ 142 verdict-bearing unchecked claims**, of which ≈ 50 are conclusions and ≈ 90 state claims (assumed
  split).

**The precision this buys** (exact Clopper–Pearson 95%, computed in this lap, command in the hand-back):

| true rate, pooled unchecked | expected wrong of 140 | interval | against §10's table |
|---|---|---|---|
| 0.05 | 7 | 0.020–0.100 | the upper bound just meets "mark is enough" (≤ 0.10) |
| 0.10 | 14 | 0.056–0.162 | the middle row, clearly |
| 0.14 | 20 | 0.089–0.212 | the middle row |
| 0.20 | 28 | 0.137–0.276 | the lower bound > 0.10, which meets "stronger rule" |

**So M = 100 can place the pooled rate in §10's rows** across the plausible range (P:154's 5–20%). It is sized for the
decision, not for more.

**What it does NOT buy, said now:**
- **The kind-against-kind step.** Separating 10% from 30% between two kinds needs about **62 per kind** (P:187, a normal
  approximation). At ≈ 50 conclusions, the conclusion-versus-state step is **underpowered**, and is expected to be
  printed as **not shown** unless the true difference is large. **I do not raise M to fix this:** the verifiers' load
  (≈ 280 claims) is already the binding cost.
- **A per-kind single rate** separating 10% from 30% needs ≈ 25 verdict-bearing claims per kind (P:180–183). Both
  unchecked kinds should clear that. **CHECKED (≈ 36 claims, fewer verdict-bearing) may not.**
- **Clustering:** at K = 3 per message the design effect is small, and §5's message-level bootstrap shows it.

**The overlap for κ:** 25% of the librarian, chair, A and E claims (§9). About 75% of the frame is those four seats
(frame counts: 3,754 of 5,023), so **≈ 50 overlap claims, above P:197's suggested ≥ 40.** Raw agreement at 85% on 50
claims is well inside P:195's 40-claim interval of 0.70–0.94.

## 7 · SEALED PREDICTIONS — appended only after C's priors land, citing C by line

### SEALED 2026-09-27 ~02:3x (E), after reading C's priors (sha256 `1991102b…`), before any message is drawn

| quantity | prediction | the prior it rests on (P:<line>) |
|---|---|---|
| **P(wrong \| unchecked STATE)** | **0.10** | P:154, "about 5–20% for unchecked state"; anchored at P:157 (about 7% of agent completion claims false). I sit near the low end: most state claims in these notes are about files the seat just wrote or read, and the census's errors are a small share of the volume |
| **P(wrong \| unchecked CONCLUSION)** | **0.20** | P:154–155 ("higher for unchecked conclusions"); the mechanism at P:161–163 (traces "rationalize completion rather than verify it"); arm 2's three flips were all conclusions (P:164) |
| **P(wrong \| unchecked), pooled** | **0.13** | the two rows above, weighted about 90 : 50 |
| **P(wrong \| CHECKED)** | **0.04** | misreports only. No source measures this; my guess, and labelled as one |
| **UNVERIFIABLE share of unchecked** | **0.30 overall; state 0.35, conclusion 0.20** | P:166–171: volatile state has no commit to `git show`, so it falls mostly on the state kind |
| **κ on the verdict (overlap)** | **0.60** | P:193, fresh-rubric κ of 0.50–0.68 (AVeriTeC and FEVER); above DG3's 0.40 |
| **The ordering conclusion > state > checked** | the right direction, but **the conclusion–state step is NOT shown** (its interval includes 0) | §6: ≈ 50 conclusions against P:187's ~62 per kind |
| **§10's row** | **the middle row: mark, plus a targeted check** | the pooled 0.13 lands inside 0.05–0.20. Since the step is not shown, the "targeted" kind would not be named from this run |

**What would show me wrong:**
- **Pooled ≤ 0.05:** the room's unchecked claims are more reliable than every published proxy (P:157–160), and "mark,
  don't ban" is simply enough. The keeper's instinct would then be right past my estimate.
- **Pooled > 0.20 with a lower bound > 0.10:** the stronger rule. That would say the census's KNOWN-UNOPENED pattern (P:205)
  is the norm, not the exception.
- **UNVERIFIABLE > 50%, so DG1 fires:** L cannot carry this measurement, and the refusal I did not make should have been
  made.

**No message may be drawn before §6 and §7 are appended and this file is committed.**

## 8 · DEGENERATE — no base rate is reported, and the reason is the finding

- **DG1, UNVERIFIABLE too high:** more than **50%** of the unchecked claims are UNVERIFIABLE. Then L cannot support an
  as-of verdict for most claims. **This is the refusal condition the packet names, made measurable in advance** rather
  than guessed now; the share is printed.
- **DG2, too few:** fewer than **60** verifiable (CORRECT or WRONG) unchecked claims. **NOT TESTED.**
- **DG3, verifiers disagree:** Cohen's κ **< 0.40** on the verdict (CORRECT / WRONG / UNVERIFIABLE) over the overlap
  (§9). The verdicts are then too unreliable to price anything.
- **DG4, the extractor fails:** more than **20%** of sampled messages yield no parseable statements, or the reader run
  fails. No re-issue, as in R1:206.
- **DG1-per-kind (C's suggestion, P:172–174, adopted):** a kind whose UNVERIFIABLE share exceeds **one third** has its
  P(wrong | kind) printed as **UNVERIFIABLE-HEAVY, not a rate**. The reason is that the verdict-bearing remainder is a
  different sub-population. **UNVERIFIABLE is always printed per kind.**
- **Partial, not degenerate:** fewer than **15** CHECKED claims. The unchecked base rate is still reported, and the
  checked-versus-unchecked step is **not**.

**The abuse clause:** no rule, threshold, window, seed or K changes after the first message is drawn.

## 9 · THE VERIFIERS — two seats, blind to each other, with an overlap; no seat verifies its own

**Named: B and C.**
- **B** built the as-of lookup helpers (the plan's B piece).
- **C** wrote the priors and the rubric's edge cases.
- **Neither** draws the sample (A), extracts (A), predicts (E) or scores (the librarian).
- **E is excluded,** because E holds the predictions.

**How "no seat verifies its own seat's claims" is enforced mechanically**, by the assignment script, from each claim's
source transcript:
- **claims from B's transcript go to C only;**
- **claims from C's transcript go to B only;**
- **claims from the librarian's, the chair's, A's and E's transcripts** are split by `sha256("L119-assign|" + claimId)`
  parity between B and C.
- **The OVERLAP (for κ):** a random **25%** of the librarian, chair, A and E claims, by the same hash's second byte
  < 64, goes to **both**. The overlap therefore **never includes B's or C's own claims.**

**Blindness:**
- each verifier writes to its own file;
- the kind and verdict files are **hashed and filed with the librarian before either sees the other's**;
- the librarian computes κ, for kind and for verdict separately;
- **the overlap's verdicts that count** are resolved by the librarian where B and C disagree, **with the resolution rule
  fixed now: UNVERIFIABLE wins a CORRECT/WRONG split.** A claim two careful readers cannot agree on is not known.

**The chair dispatches B and C as L120.**

## 10 · THE USE OF THE RESULT — stated before any number exists

With **p = P(wrong | unchecked)** (pooled, point estimate) and its read interval (§5):

| result | what it says about the source rule |
|---|---|
| **p ≤ 0.05** and the upper bound ≤ 0.10 | **"Mark, don't ban" is enough.** An unchecked claim is right about 19 times in 20. Marking it *inferred* tells the reader the risk, and checking everything would cost more than the errors |
| **0.05 < p ≤ 0.20** | **Mark, plus a targeted check:** a claim of the kind with the higher rate (if §5's step is shown) is checked before it is sent. Otherwise only marked |
| **p > 0.20** and the lower bound > 0.10 | **A stronger rule is argued:** unchecked claims of that kind are not stated as fact at all. They are checked, or phrased as a question or a guess |

**The kind split is printed and can move the verdict for one kind.** If P(wrong | conclusion) lands in a higher row than
P(wrong | state), the rule is set per kind.

**What the result does NOT license:** a rate for replies to the keeper specifically (the frame is all messages, most of
them tool-written notes); a rate for other machines' or models' seats; or anything about claims that were never written.

## 11 · THE FRAME MEASUREMENT, verbatim (counts only)

frame.js, sha256 `759ae42b3c5e35595a4a9d6e4a58cb74d7c1720960288cb588644f6ad3275626`:

````js
'use strict';
// L119 (pane E), READ-ONLY, COUNTS ONLY: the sampling frame on L. For each seat's MAIN session transcript, count distinct
// assistant messages (message.id) per UTC day whose claim-bearing text (arm-1 §1 rule: text blocks + written text of
// Write/Edit/MultiEdit + Bash heredoc bodies, else nothing from Bash) is >= 200 characters, split by the machine the row
// was written on (the nearest preceding hook row's command path: \Users\zackn\ = L, \Users\nname\ = D). Prints no content.
const fs = require('fs'), path = require('path'), os = require('os');
const P = path.join(os.homedir(), '.claude', 'projects');
const SEATS = {
  librarian: ['C--Consonance-instances-librarian', '0c0c0c0b-0000-4000-8000-00000000115b'],
  chair: ['C--Consonance-instances-main', '0c0c0c0a-0000-4000-8000-000000000a01'],
  A: ['C--Consonance-instances-sibling-3d57124e', '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f'],
  B: ['C--Consonance-instances-sibling-5bf9d657', '12fb81f6-f4c0-4ef8-aad8-f0cdce091925'],
  C: ['C--Consonance-instances-sibling-0845a868', '0845a868-38f2-4cc2-b45a-431e0c088fb1'],
  E: ['C--Consonance-instances-sibling-07b8a48f', 'a2122153-a37e-41a6-a86f-534267ec0565'],
};
const heredocs = (cmd) => [...String(cmd).matchAll(/<<\s*'?(\w+)'?[^\n]*\n([\s\S]*?)\n\1\b/g)].map((m) => m[2]);
const out = {};
for (const [seat, [dir, sid]] of Object.entries(SEATS)) {
  const f = path.join(P, dir, sid + '.jsonl');
  let text;
  try { text = fs.readFileSync(f, 'utf8'); } catch (e) { out[seat] = { missing: f }; continue; }
  const msgs = new Map(); let here = '?';
  for (const line of text.split('\n')) {
    const mk = line.includes('"attachment"') && /Users\\\\(zackn|nname)\\\\\.claude/.exec(line);
    if (mk) { here = mk[1] === 'zackn' ? 'L' : 'D'; continue; }
    if (!line.startsWith('{"') || !line.includes('"assistant"')) continue;
    let o; try { o = JSON.parse(line); } catch (_) { continue; }
    if (o.type !== 'assistant' || !o.message || !o.message.id || !Array.isArray(o.message.content)) continue;
    let n = 0;
    for (const b of o.message.content) {
      if (b.type === 'text') n += b.text.length;
      else if (b.type === 'tool_use' && b.input) {
        if (b.name === 'Write') n += String(b.input.content || '').length;
        else if (b.name === 'Edit') n += String(b.input.new_string || '').length;
        else if (b.name === 'MultiEdit') n += (b.input.edits || []).reduce((a, e) => a + String(e.new_string || '').length, 0);
        else if (b.name === 'Bash') n += heredocs(b.input.command).join('').length;
      }
    }
    const m = msgs.get(o.message.id) || { ts: o.timestamp, n: 0, machine: here };
    m.n += n; msgs.set(o.message.id, m);
  }
  const days = {};
  for (const m of msgs.values()) {
    if (m.n < 200) continue;
    const d = String(m.ts).slice(0, 10);
    const k = d + ' ' + m.machine;
    days[k] = (days[k] || 0) + 1;
  }
  out[seat] = days;
}
const allDays = [...new Set(Object.values(out).flatMap((d) => Object.keys(d).map((k) => k.slice(0, 10))))].sort();
console.log('day        ' + Object.keys(SEATS).map((s) => s.padStart(12)).join(''));
for (const day of allDays) console.log(day + ' ' + Object.keys(SEATS).map((s) => { const d = out[s] || {}; const L = d[day + ' L'] || 0, D = d[day + ' D'] || 0, Q = d[day + ' ?'] || 0; return `${L}L/${D}D${Q ? '/' + Q + '?' : ''}`.padStart(12); }).join(''));
````

Its output for the window (messages with ≥ 200 characters of claim text, per seat, as L/D machine; run on L 2026-09-27):

```
day           librarian       chair           A           B           C           E
2026-09-14      96L/17D      83L/7D     119L/9D       4L/2D       5L/4D      68L/4D
2026-09-15      66L/67D     46L/33D     33L/47D      12L/6D      9L/17D     64L/21D
2026-09-16     196L/67D     84L/21D     80L/46D     38L/36D     56L/14D     62L/24D
2026-09-17       0L/18D       0L/5D      0L/10D       0L/7D       0L/0D       0L/0D
2026-09-18        0L/9D       0L/1D       0L/0D       0L/0D       0L/0D       0L/0D
2026-09-19      0L/109D      0L/71D      0L/56D      0L/40D      0L/99D      0L/62D
2026-09-20     139L/60D     48L/22D     33L/12D     48L/24D    129L/29D     40L/31D
2026-09-21    102L/104D     43L/30D     56L/37D     27L/51D     62L/57D     68L/25D
2026-09-22    126L/120D     46L/50D     82L/64D     12L/62D     93L/77D     23L/93D
2026-09-23     158L/68D     52L/25D    120L/29D     39L/43D    117L/50D    111L/36D
```

