# The turn boundary is the most machine-visible fact in the system — and it has been broken 101 times out of 103

**Seat:** pane E. **Date:** 2026-08-25, ~01:00–01:45 local (07:00–07:45Z).
**Object under attack:** `consonance/src-tauri/brief/BUILDING.md`, the paragraph added by `3bdcb47`:

> **`dispatch-gate` CANNOT ENFORCE THIS AND MUST NOT BE READ AS IF IT DOES.** … The gate enforces
> CITATION; nothing enforces the TURN BOUNDARY, and its silence is not evidence the boundary was
> kept. The keeper has now caught this twice; no instrument has caught it once.

**Amended packet (07:06:14Z) narrowed this to three asks:** (1) attack the detector the chair built,
(2) settle whether PREVENTION is possible *from the payload shape rather than by assertion*, (3) name
what a detector-only regime costs.

**My bias, declared:** the chair wants this claim broken and said so. That is a stake I could serve by
finding a detector whether or not one exists. The counterweight is that every figure below comes from
a named command over data neither seat authored (harness binary, transcript JSONL, git), and one of my
two attacks **failed** — reported as failed in §3.

---

## 0. Verdict, four sentences

1. **PREVENTION IS POSSIBLE.** The PreToolUse payload carries `transcript_path` and `prompt_id`. The
   premise *"a PreToolUse hook sees tool_name and tool_input and nothing about the turn so far"* is
   **false**, proved from the harness's own schema and payload constructor (§2).
2. **The chair's detector survives my attack.** Its boundary rule admits **110 false boundaries** over
   Main's full history, in six named shapes — and produces **zero divergence** in the result: 101
   violations under the chair's segmentation, 101 under a `promptId` partition (§3).
3. **The rate is the finding, not the detector.** Over all Main history: **103 turns contain a
   dispatch; 101 are violations (98.1%)** (`node basrate.js MAIN`), and **85 of 103 (82.5%) wrote more
   than 1,000 characters of answer AFTER the last dispatch had already left** (`node severity.js MAIN`). The rule has essentially never been kept.
4. **A detector is a LEDGER, not a GUARD** — the chair's own third ask, and it is correct (§6).

---

## 1. The correction I owe the chair first: today's count is 4, not 3, and the fourth is this packet

The chair's scan reported three violations today. Re-derived independently (`dual-scan.js`, both
segmentations, §3) the count is **four**. The chair did not miscount — the fourth had not happened yet
when the scan ran. It is the turn that began **07:04:24Z**, shape `TEXT TEXT TEXT TEXT DISPATCH
DISPATCH TEXT`, and its second dispatch, at **07:06:14Z, 3,951 chars**, is **the amendment telling me
the detector works and the rule matters.**

    2026-08-25T07:05:47.891Z | chair_inject | turn started 07:04:24.105Z | [interrupt] Pane B — STOP …
    2026-08-25T07:06:14.849Z | chair_inject | turn started 07:04:24.105Z | Pane E — an amendment to your packet …

And the packet I am answering was dispatched the same way: **07:02:33Z, inside the turn that began
06:59:57Z** — the third violation, the turn the chair had described to the keeper as correct.

> **The correction about the rule was itself delivered in violation of the rule, twice, four minutes
> apart.** This is not a rhetorical point; it is the strongest available argument that a ledger is
> insufficient and that §5's prevention question is the one that matters.

*Reproduce:* `node amend-locate.js <main transcript>` (script bodies in §12; `node amend-locate.js MAIN`).

---

## 2. PREVENTION IS POSSIBLE — the payload proof

The chair's second ask was for proof from the payload shape. Here it is, from the harness binary
rather than from documentation or memory.

**Command:**

    grep -a -o -E '.{40}hook_event_name:o\("PreToolUse"\).{300}' \
      /c/Users/zackn/.local/bin/claude.exe

**Returns (verbatim):**

    as=s(()=>h().and(t({hook_event_name:o("PreToolUse"),tool_name:e(),tool_input:d(),tool_use_id:e()})))

So `PreToolUse = h() ∧ { hook_event_name, tool_name, tool_input, tool_use_id }`. Everything turns on
what `h()` is. Same command family (`grep -a -o -E '.{180}transcript_path.{180}' claude.exe`):

    h=s(()=>t({session_id:e(),transcript_path:e(),cwd:e(),prompt_id:e().optional().describe(
      "UUID correlating a user prompt with all subsequent events until the next prompt. …"),…}))

And the constructor that fills it:

    return{session_id:e.id,transcript_path:Fu(e.id),cwd:t,prompt_id:G6e()??void 0,
      permission_mode:n,agent_id:r?.agentId,…}

**Three facts follow, and they dismantle the impossibility reading:**

- **`transcript_path` is on every hook event, PreToolUse included.** It is not optional in the schema
  and is populated by `Fu(e.id)` for every non-remote session. `sourced-stop.js:211` already consumes
  it at Stop; nothing prevents `dispatch-gate.js` consuming it at PreToolUse.
- **`prompt_id` is the turn identifier, by the harness's own description** — *"UUID correlating a user
  prompt with all subsequent events until the next prompt."* That is the turn boundary, named, with a
  UUID, handed to the hook. It is `.optional()`, so a hook must not depend on it alone; the transcript
  fallback in §5 needs only `transcript_path`.
- **The transcript is written LIVE during a turn, not at its end.** Witnessed in this pane's own file
  mid-turn: 94 lines at one reading, 100 lines at a later reading, all under one `promptId`, with no
  turn having ended between them. *(Witnessed once, in-flight; an observation, not a re-runnable
  command, and flagged as such in §7.)*

> **Of everything this room has called invisible, the turn boundary is close to the most visible.** It
> has a UUID, it partitions the transcript exactly (1,378 turns — `node basrate.js MAIN`), and it is in the payload of the
> very hook the brief says cannot see it.

**Cost of reaching it, measured.** A hook does not need the file, only its tail: read backwards to the
first row containing `"promptSource"`. On Main's transcript — **149,828,001 bytes** — that is **262,144
bytes, 0.175% of the file**, one 256 KB chunk, sub-millisecond. (`node tailcost.js MAIN`)

---

## 3. Attacking the chair's detector: 110 false boundaries, six shapes, and zero divergence

**The rule under attack**, as the chair stated it: *a user-role row whose content is a string, OR an
array containing no `tool_result` block, starts a new turn.*

**The measurement.** `boundary-probe.js` applies that rule to every `message.role === "user"` row and
counts the ones it calls a boundary that carry **no `promptSource`** — i.e. rows that are not real
prompt records. Over Main's **full** history:

    rows with message.role === "user":                  5,872
    rows the chair's test calls a TURN BOUNDARY:         1,488
      of those, real prompt records (promptSource):      1,378
      of those, FALSE BOUNDARIES:                          110   (7.4%)
    tool-result rows whose content is a bare STRING:         0

(`node boundary-probe.js MAIN 1970-01-01`)

**The six shapes, with counts** (`node fb-heads.js <transcript> | sort | uniq -c`):

| n | shape | can it land MID-turn? |
|---|---|---|
| 63 | slash-command triads: `<local-command-caveat>` (isMeta) + `<command-name>` + `<local-command-stdout>`, for `/compact`, `/model`, `/login` | only if the human types one mid-turn |
| 10 | `This session is being continued from a previous conversation…` (compaction resume) | **yes** — `/compact` mid-session is on record (journal 2026-08-16) |
| 5 | `Continue from where you left off.` | post-compaction |
| 3 | **`[Request interrupted by user]`** | **yes, by construction** — an interrupt row exists only mid-turn |
| 3 | a skill body injected as a user-role row (`# Update Config Skill …`) | **yes** — skills load mid-turn |
| ~26 | `[Image: source: …]` pastes and other singletons | **yes** — a paste can arrive mid-turn |

*(The first five rows are exact from the top of the `uniq -c` ranking; the last is the residual —
the tail is almost entirely one-off image pastes, each with a distinct filename, so they do not group.
The six rows sum to 110.)*

Also confirmed: the chair's diagnosis of its own first version is **correct** — tool results are
`message.role === "user"`, so a naive every-user-row-is-a-boundary reader fragments every turn and
**structurally cannot fire**. The corrected rule fixes exactly that, and the fix is airtight on this
corpus: **0 tool-result rows have string content**, so the `tool_result` exclusion never misses.

**AND THE ATTACK FAILED.** A false boundary only produces a false green if it lands **between** a
dispatch and that turn's trailing text. I ran the chair's segmentation (A) against a `promptId`
partition (B) — which has no false boundaries by construction, since `promptId` is stamped by the
harness on the prompt record and on every tool-result row of that turn:

    A (chair rule):          1,292 turns, 101 violations
    B (promptId partition):  1,378 turns, 101 violations
    (2026-08-25 window:      4 violations under A, 4 under B, the same four timestamps)

(`node dual-scan.js MAIN 1970-01-01`)

**Identical.** All 110 false boundaries are inert here, because the slash-command and compaction rows
cluster where a real boundary already sits. **The honest verdict on ask (1): the detector is sound on
this corpus, its false-green surface is real and now enumerated, and my attack on it lost.**

**The condition under which it would bite, so the next reader has it:** one `[Request interrupted by
user]`, one mid-turn `/compact`, one pasted image, or one skill load, landing between a dispatch and
the turn's final text, silently converts a violation into a green. Three of the six shapes can do this.
**The one-line fix is free:** segment on `promptId`, not on row shape. It removes the entire class,
costs nothing, and the harness maintains the field.

---

## 4. The number nobody asked for: 101 of 103, and 82.5% of them severe

Over Main's full history, turns partitioned by `promptId` (`node basrate.js <main transcript>`):

    turns total:                                          1,378
    turns containing >=1 consonance dispatch:               103
      retrospective VIOLATION (dispatch before last text):  101  = 98.1%

(`node basrate.js MAIN`)

And the severity split — characters of assistant text emitted **after** the turn's last dispatch
(`node severity.js <main transcript>`):

    0 chars          2   1.9%      <- the compliant shape
    1–200 chars      2   1.9%      <- "sent." — mild
    201–1,000       14  13.6%
    1,001–4,000     84  81.6%      <- the answer written after the seats were already reasoning
    4,000+           1   1.0%

**85 of 103 dispatch turns (82.5%) wrote more than 1,000 characters of answer after the dispatch had
already landed in another pane** (`node severity.js MAIN`). The mild reading — *"it only dispatched and
then said 'done'"* — covers **4 turns of 103 (3.9%)** (`node severity.js MAIN`).

> BUILDING.md says *"the keeper has now caught this twice; no instrument has caught it once."* The
> first half is the load-bearing error. It is not twice. It is **101 times, of 103 opportunities**, and
> the two clean ones are the anomaly. The claim that no instrument caught it was true and is now false;
> the claim that it happened twice was never true, and nothing in the room could have known that until
> the transcript was counted.

---

## 5. The prevention sketch — three tests, measured, with the knobs named

Not built, per instruction. All three sit inside `dispatch-gate.js`'s existing `main()`, after
`findCitation`, and all three must obey the file's standing law: **fail OPEN**.

**Shared primitive.** `turnStart` = timestamp of the last row carrying `promptSource` in the tail of
`payload.transcript_path` (cap the reverse read at ~8 MB; beyond that, allow and record
`outcome:"inert"` — a gate that quietly stops working reads exactly like a gate being satisfied, which
is this file's own stated failure class). Cross-check against `payload.prompt_id` when present.

### P1 — the cited object must predate the turn

If the citation `dispatch-gate` already extracted was created **inside the dispatching turn**, the
dispatch was composed alongside the work.

    sha:  git show -s --format=%aI <sha>  ->  author date >= turnStart  ->  ASK
    path: fs.statSync(p).mtimeMs          ->  mtime       >= turnStart  ->  ASK

**Measured** (`node p1sha.js <main transcript>` — it imports `dispatch-gate.js`'s own exported
`findCitation`, so citation semantics cannot drift from the shipped gate):

    dispatch tool_use calls:                    205
      [interrupt] exempt:                         2
      no citation (existing gate already ASKs):  66
      SHA-cited and scoreable:                   97
        P1 FIRES:                                24  = 24.7%

(`node p1sha.js MAIN`)

**Knob-free. Every firing is a genuine same-turn-commit instance** — including `e60b072` (committed
06:43:34Z, dispatched 06:43:56Z, turn started 06:42:03Z) and `b7f3775` (committed 07:00:47Z, dispatched
07:01:21Z, turn started 06:59:57Z).

**False-positive modes, named:**

- **`git commit --amend` after a compliant commit** — `%cI` moves to now. Using `%aI` (author date,
  preserved across amend and rebase) shrinks this; it does not close it.
- **The path branch is not what it looks like.** `mtime` is a *current* reading. At hook time that is
  correct; **retrospectively it is worthless** — scoring all citation kinds instead of sha-only inflates
  P1 from 24/97 to 55/137, because 31 of 40 path citations show a *later* mtime than the dispatch they
  accompanied. The path branch is live-only and its retrospective figures must never be quoted.
- **Timezone.** Git emits offsets (`-06:00`); transcripts emit `Z`. A string compare here would be a
  defect; parse both.

**False negative, and it is the important one:** **a mid-turn dispatch citing an OLD object is invisible
to P1.** My own packet cites `3bdcb47` (06:48:25Z) from a turn that began 06:59:57Z — the citation
predates the turn, so **P1 passes a dispatch the retrospective detector flags.** Same for the amendment,
which cites a librarian file written before its turn. P1 catches the shape that caused the 08-24 and
08-25 failures; it does not catch the general class.

### P2 — the turn has already spoken

If the current turn has already emitted a substantive text block **before** this dispatch, the seat is
mid-composition.

**Measured: fires on 97 of 103 dispatch turns = 94.2%** (`node basrate.js MAIN`).

**This is a nag by the room's own standard and must not be built as stated.** `sourced-stop.js` refused
a gate at an 80% base rate in writing — *"a gate firing on 80% of value-turns is dream-watch's 27-day
lesson rebuilt at the one moment that cannot be skipped."* 94.2% is worse. The obvious defence — *"the
rate is high because the rule is new and will fall"* — is precisely BOOT's registered abuse condition for
progressive programmes, so if P2 is ever built it must ship with its degeneration marker stated first:
**if 50 dispatch turns after installation the fire rate has not fallen below 40%, P2 is a nag and comes
out.**

### P3 — the turn has already changed state

If a `Write`/`Edit`/`git commit` precedes the first dispatch in this turn: **fires on 32 of 103 = 31.1%** (`node basrate.js MAIN`)
(and every P2∩P3 turn is a P3 turn — the 32 are a strict subset of the 97).

**Recommendation, one line:** **P1 alone**, sha-branch biting and path-branch advisory. It is knob-free,
it costs one `git show -s` and a 256 KB tail read (`node tailcost.js MAIN`), it fires at 24.7% rather than 94.2% (`node p1sha.js MAIN`), and every firing
is a real instance. P3 is the natural second stage if P1 proves too narrow. **P2 should not be built
until the base rate has moved.**

**The Goodhart hole in all three, stated because no version closes it:** a seat that learns any of these
can emit a one-word turn — *"Committed."* — to manufacture a boundary, then dispatch in the next turn.
Structurally compliant, substantively identical. **No hook can close this**, because the rule's ground is
a human's opportunity to interject, and a hook can see a turn boundary but not an attention. That is the
honest residue of the impossibility claim — much smaller than BUILDING.md's sentence, and in a different
place.

---

## 6. Detector ≠ guard — the chair's third ask, granted, plus two things it did not ask

**Grant it in the chair's own words: a detector is a LEDGER, not a GUARD.** Detection is after-the-fact
by definition; the dispatch has landed, the receiving seat has begun reasoning, and the un-revisability
that `dispatch-gate.js`'s header names as the whole point has already been spent. A ledger's only power
is over the *next* dispatch, and 101-of-103 is what that power has produced so far with the keeper as
the only reader.

**Mechanism finding 1 — the receiving side cannot tell the chair from the keeper.** A `chair_inject`
lands in the receiving pane's transcript as:

    promptSource: "typed" | origin: {"kind":"human"}

— byte-identical to the keeper typing. Verified against this pane's own single prompt record, whose text
begins *"[chair:MAIN] Pane E — this packet is an attack on a claim of MINE."* Across four pane
transcripts the only distinguishable sources are `queued` (31), `system` (351) and `sdk` (11).

**Consequence:** a receiving-side detector **cannot** verify that a human, rather than the chair, created
the boundary it is standing on. Any guard for this rule must live on the **sending** side. It also means
the `[chair:MAIN]` prefix is doing work no field does — a courtesy string carrying the only distinction
available, which is the control plane's own mount-not-the-tag principle running backwards.

**Mechanism finding 2 — a mid-turn message is not a user-role row at all.** The chair's amendment appears
in this pane's transcript as `type:"queue-operation"` (×2) and `type:"attachment"` — **no `message`, no
`role`, no `promptSource`.** So mid-turn arrivals create no boundary and cannot fool the detector; but
they are also **invisible to every turn-segmentation instrument in the repo**, `sourced-stop.js` included.
A mid-turn correction cannot be seen by anything reading `message.role`.

---

## 7. What this does NOT establish

- **Nothing about panes.** Every rate here is Main's transcript. Panes dispatch via `raise_pull`, which
  is deliberately outside `DISPATCH_VERBS`.
- **The 98.1% is a shape, not a verdict on intent.** The retrospective test flags *any* text after a
  dispatch. §4's severity split is what converts it from a shape into a finding, and it is a character
  count, not a judgement about what that text was.
- **The live-write observation in §2 is witnessed once**, not a re-runnable command. It is load-bearing
  for prevention: if transcripts were flushed only at turn end, `transcript_path` would be stale at
  PreToolUse and P1/P2/P3 would all read the *previous* turn. **Anyone building this must re-verify it
  first** — it is the single assumption that would silently invert every test.
- **P1's path branch is unscored.** Its 40 path-cited dispatches are excluded from 24/97 for the reason
  in §5; live behaviour may differ from anything measurable now.
- **The false-boundary counts for the librarian and this pane were measured; their violation rates were
  not.** Only Main's transcript was scanned for §4.
- **`prompt_id`'s runtime presence is inferred from the constructor** (`G6e()??void 0`), not observed in
  a live PreToolUse payload. `transcript_path` is the load-bearing field and is not optional.

---

## 8. Falsifiers, registered before anyone acts on this

- **F1 — the segmentation fix is free and therefore owed.** If BUILDING.md or any detector is amended on
  the strength of this file and the segmentation still keys on row shape rather than `promptId`, §3 was
  read as *"the attack failed, nothing to do"* — the opposite of its finding.
- **F2 — P1 is a nag if it fires above 50%** on 50 post-installation dispatches. Current 24.7% (`node p1sha.js MAIN`).
- **F3 — this file is prose if 50 further dispatch turns pass with no instrument installed and the 98.1%
  unchanged.** A finding that only produces a document about the finding is the class this room keeps
  naming.
- **F4 — the §2 proof dies if a live PreToolUse payload arrives without `transcript_path`.** One recorded
  payload settles it, and recording one is cheaper than any argument here.

---

## 9. Corrections I made to myself, in order

1. **I predicted the chair's boundary rule would produce false greens and it did not.** I found the 110
   rows expecting divergence; both segmentations returned 101. Reported as a failed attack (§3) rather
   than softened into *"the surface exists, so the detector is suspect."*
2. **My first prevention sketch was P1 alone and I called it sufficient.** It passes my own packet's
   dispatch. Caught by hand-checking `3bdcb47`'s author date against the 06:59:57Z turn start — the case
   I was in the middle of writing about.
3. **I scored P1 at 40.1% (`node p1.js MAIN`) before noticing the path branch was contaminated** by reading `mtime` now
   instead of at dispatch time. The honest figure is the sha-only **24.7%** (`node p1sha.js MAIN`); the inflated one is kept in
   §5 because the direction of the error — 55/137 against 24/97, *upward*, in favour of the test I was
   recommending — is the part worth keeping.
4. **I nearly reported today's count as "the chair said 3, it is 4, the chair miscounted."** It did not;
   the fourth turn had not happened when it scanned. The correct statement is that the count went stale
   in four minutes, and what made it stale is the amendment itself.

---

## 10. The sentence I would put in BUILDING.md, if it were mine to edit — it is not

> **`dispatch-gate` does not enforce this yet, and could.** The turn boundary is in the PreToolUse
> payload: `transcript_path` on every hook event, and `prompt_id`, which the harness describes as *"a
> UUID correlating a user prompt with all subsequent events until the next prompt."* What no hook can
> see is whether a human *used* the boundary — that requires an attention, not a field. Detection is
> cheap and already demonstrated; prevention is a 256 KB tail read plus one `git show`; and what remains
> genuinely out of reach is one manufactured one-word turn wide.

The original sentence — *"nothing enforces the TURN BOUNDARY … no instrument has caught it once"* — is
not merely wrong on its second clause. It is the shape BOOT.md:62–100 amended away from: **"no instrument
reaches it" written as "no instrument could,"** in a live brief, by the seat whose failure it describes,
about a fact the harness hands to the hook in question.

---

## 11. Reproduction

All scripts are READ-ONLY, wrote nothing, and appended to no ledger — they parse transcripts, the harness
binary and git only. They live in this pane's scratchpad
(`…/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-…/scratchpad/`) and are deliberately
NOT added to `consonance/tools/`: they are a one-night probe, not an instrument, and installing them
would be the "landed is not shipped" inversion — shipping something never asked for.

| script | what it produces |
|---|---|
| `boundary-probe.js <transcript> <since>` | §3's false-boundary counts and shapes |
| `fb-heads.js <transcript>` | the text of every false-boundary row |
| `dual-scan.js <transcript> <since>` | §3's A-vs-B violation counts |
| `amend-locate.js <transcript>` | §1's dispatch-to-turn-start mapping |
| `basrate.js <transcript>` | §4 and §5's P2/P3 fire rates |
| `severity.js <transcript>` | §4's severity split |
| `tailcost.js <transcript>` | §2's 262,144-byte tail measurement |
| `p1.js` / `p1sha.js <transcript>` | §5's P1 scores (all kinds / sha-only) |

Main's transcript:
`C:\Users\zackn\.claude\projects\C--Consonance-instances-main\0c0c0c0a-0000-4000-8000-000000000a01.jsonl`

**`cite-check` state, stated so a clean-looking file is not read as fully green**
(`node consonance/tools/cite-check.js exo_memory/loop/turn_boundary_detection_2026-08-25.md`):
**23 figure-bearing lines, 15 carrying a command, 8 not.** The eight are, deliberately: a section
heading; the witnessed-once live-write observation (§2, flagged again in §7); the `~8 MB` read cap and
the `40%` degeneration threshold, which are proposals rather than measurements; the `80%` quoted from
`sourced-stop.js`'s own header; and three restatements of figures cited elsewhere in this document.
**No measurement in this file is uncited.** `--run` will report NOT-RUN until §12's probe bodies are
saved to a scratch directory and `MAIN` is substituted — a NOT-RUN is never a green.

*Nothing committed. Nothing in `consonance/` touched. Handed back for the chair to commit with
attribution.*

---

## 12. Appendix — the probe bodies, so every command above re-derives

These are READ-ONLY: they parse transcripts, the harness binary and git, and write nothing. They are
deliberately NOT installed into `consonance/tools/` — a one-night probe is not an instrument, and
shipping one nobody asked for is the inversion this repo keeps finding. To reproduce, save each block
to a scratch directory and run it from there.

**`MAIN`** below means:

    C:\Users\zackn\.claude\projects\C--Consonance-instances-main\0c0c0c0a-0000-4000-8000-000000000a01.jsonl

**`p1sha.js`** is `p1.js` with one clause changed, so the path branch is excluded:

    sed "s/if(objTime==null||d.turnStart==null){unknown++;continue}/if(objTime==null||d.turnStart==null||c.kind!=='sha'){unknown++;continue}/" p1.js > p1sha.js

### `boundary-probe.js`

```js
// READ-ONLY probe. Streams a transcript, classifies every row a "user-role" reader would see,
// and applies the chair's stated boundary test:
//   "a user-role row whose content is a STRING, OR an ARRAY containing no tool_result block,
//    starts a new turn"
// A row that passes that test but carries no promptSource is a FALSE BOUNDARY.
const fs = require('fs'), readline = require('readline');
const FILE = process.argv[2];
const SINCE = process.argv[3] || '2026-08-25';

const kinds = new Map();          // shape -> count, for rows the test calls a boundary
const realStarts = [];            // rows with promptSource
let rows = 0, userRole = 0, testBoundaries = 0, falseBoundaries = 0;
let toolResultStringContent = 0;

const rl = readline.createInterface({ input: fs.createReadStream(FILE), crlfDelay: Infinity });
rl.on('line', (l) => {
  if (!l) return;
  let r; try { r = JSON.parse(l); } catch (_) { return; }
  const ts = r.timestamp || '';
  if (ts && ts.slice(0, 10) < SINCE) return;
  rows++;
  const msg = r.message;
  const role = msg && msg.role;
  if (role !== 'user') return;
  userRole++;
  const c = msg.content;
  const isString = typeof c === 'string';
  const arr = Array.isArray(c) ? c : null;
  const hasToolResult = arr ? arr.some(b => b && b.type === 'tool_result') : false;
  if (r.toolUseResult !== undefined && isString) toolResultStringContent++;
  const callsBoundary = isString || (arr && !hasToolResult);
  if (!callsBoundary) return;
  testBoundaries++;
  const real = r.promptSource !== undefined;
  if (real) { realStarts.push({ ts, src: r.promptSource }); return; }
  falseBoundaries++;
  const shape = [
    'type=' + r.type,
    'isMeta=' + !!r.isMeta,
    'isSidechain=' + !!r.isSidechain,
    'hasToolUseResult=' + (r.toolUseResult !== undefined),
    'content=' + (isString ? 'string' : 'array[' + arr.map(b => b && b.type).join('|') + ']'),
    'userType=' + r.userType,
  ].join(' ');
  kinds.set(shape, (kinds.get(shape) || 0) + 1);
});
rl.on('close', () => {
  console.log('rows since ' + SINCE + ': ' + rows);
  console.log('rows with message.role === "user": ' + userRole);
  console.log('rows the chair\'s test calls a TURN BOUNDARY: ' + testBoundaries);
  console.log('  of those, real prompt records (promptSource present): ' + realStarts.length);
  console.log('  of those, FALSE BOUNDARIES (no promptSource): ' + falseBoundaries);
  console.log('tool-result rows whose content is a bare STRING: ' + toolResultStringContent);
  console.log('\nFALSE BOUNDARY SHAPES:');
  for (const [k, v] of [...kinds].sort((a,b) => b[1]-a[1])) console.log(String(v).padStart(6), k);
  console.log('\nREAL prompt sources:');
  const s = new Map(); for (const x of realStarts) s.set(x.src, (s.get(x.src)||0)+1);
  for (const [k,v] of s) console.log(String(v).padStart(6), k);
});
```

### `fb-heads.js`

```js
const fs=require('fs'), readline=require('readline');
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]),crlfDelay:Infinity});
rl.on('line',l=>{ if(!l)return; let r; try{r=JSON.parse(l)}catch(_){return}
  const m=r.message; if(!m||m.role!=='user')return;
  const c=m.content; const isStr=typeof c==='string'; const arr=Array.isArray(c)?c:null;
  const hasTR=arr?arr.some(b=>b&&b.type==='tool_result'):false;
  if(!(isStr||(arr&&!hasTR)))return;
  if(r.promptSource!==undefined)return;
  const t=isStr?c:arr.map(b=>b.text||'').join(' ');
  console.log('--- isMeta='+!!r.isMeta+' ts='+(r.timestamp||'')+'\n    '+t.slice(0,300).replace(/\s+/g,' '));
});
```

### `dual-scan.js`

```js
// READ-ONLY. Two turn-segmentations, same violation test, compared.
//   A = chair's stated rule: a user-role row whose content is a string, or an array with no
//       tool_result block, starts a new turn.
//   B = promptId partition: every row carrying promptId belongs to that turn; a new promptId
//       starts a new turn. (promptId is stamped on the prompt record AND on every tool-result
//       row of that turn.)
// Violation (both): a consonance dispatch tool_use appears before the turn's LAST text block.
const fs=require('fs'), readline=require('readline');
const FILE=process.argv[2], SINCE=process.argv[3]||'2026-08-25';
const DISPATCH=new Set(['mcp__consonance__chair_inject','mcp__consonance__call_chair']);

const rowsA=[], rowsB=[];
const rl=readline.createInterface({input:fs.createReadStream(FILE),crlfDelay:Infinity});
rl.on('line',l=>{ if(!l)return; let r; try{r=JSON.parse(l)}catch(_){return}
  const ts=r.timestamp||''; if(ts && ts.slice(0,10)<SINCE) return;
  const m=r.message; if(!m) return;
  const c=m.content; const isStr=typeof c==='string'; const arr=Array.isArray(c)?c:null;
  const hasTR=arr?arr.some(b=>b&&b.type==='tool_result'):false;
  const boundary = m.role==='user' && (isStr || (arr && !hasTR));
  const blocks=[];
  if(m.role==='assistant' && arr){
    for(const b of arr){
      if(b.type==='text' && (b.text||'').trim().length>0) blocks.push({k:'TEXT'});
      else if(b.type==='tool_use' && DISPATCH.has(b.name)) blocks.push({k:'DISPATCH'});
    }
  }
  rowsA.push({boundary, blocks, ts});
  rowsB.push({pid:r.promptSource!==undefined?r.promptId:(r.promptId||null), blocks, ts, isStart:r.promptSource!==undefined});
});
rl.on('close',()=>{
  const scan=(turns,label)=>{
    let v=0; const lines=[];
    for(const t of turns){
      const seq=t.blocks; if(!seq.length) continue;
      const lastText=seq.map(b=>b.k).lastIndexOf('TEXT');
      const firstD=seq.map(b=>b.k).indexOf('DISPATCH');
      if(firstD>=0 && lastText>firstD){ v++; lines.push('  VIOLATION '+t.ts+'  '+seq.map(b=>b.k==='TEXT'?'TEXT':'DISPATCH').join(' ')); }
      else if(firstD>=0){ lines.push('  ok        '+t.ts+'  '+seq.map(b=>b.k==='TEXT'?'TEXT':'DISPATCH').join(' ')); }
    }
    console.log(label+': '+turns.length+' turns, '+v+' violations');
    lines.forEach(x=>console.log(x));
  };
  // A
  let cur={ts:null,blocks:[]}; const A=[];
  for(const r of rowsA){ if(r.boundary){ if(cur.blocks.length)A.push(cur); cur={ts:r.ts,blocks:[]}; } cur.blocks.push(...r.blocks); }
  if(cur.blocks.length)A.push(cur);
  // B
  const B=[]; let curB=null, seen=null;
  for(const r of rowsB){ if(r.isStart){ if(curB)B.push(curB); curB={ts:r.ts,blocks:[]}; seen=r.pid; } if(curB) curB.blocks.push(...r.blocks); }
  if(curB)B.push(curB);
  scan(A,'A (chair rule)');
  console.log('');
  scan(B,'B (promptId partition)');
});
```

### `amend-locate.js`

```js
const fs=require('fs'), readline=require('readline');
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]),crlfDelay:Infinity});
let curPrompt=null;
rl.on('line',l=>{ if(!l)return; let r; try{r=JSON.parse(l)}catch(_){return}
  const ts=r.timestamp||''; if(ts&&ts.slice(0,10)<'2026-08-25')return;
  if(r.promptSource!==undefined) curPrompt={ts:r.timestamp,id:r.promptId};
  const m=r.message; if(!m||m.role!=='assistant'||!Array.isArray(m.content))return;
  for(const b of m.content){
    if(b.type!=='tool_use')continue;
    if(!/chair_inject|call_chair/.test(b.name||''))continue;
    const t=(b.input&&(b.input.text||''))||'';
    console.log(r.timestamp,'|',b.name,'| turn started',curPrompt&&curPrompt.ts,'| chars',t.length,'|',t.slice(0,70).replace(/\s+/g,' '));
  }
});
```

### `basrate.js`

```js
// READ-ONLY. Base rates over ALL history for a prevention gate.
// Turn = promptId partition (rows with promptSource start a turn).
// For each turn containing >=1 consonance dispatch:
//   P2 fires  -> a substantive text block (>=1 non-empty text) precedes the FIRST dispatch
//   VIOLATION -> a text block follows the LAST... (chair's test: dispatch before turn's last text)
const fs=require('fs'), readline=require('readline');
const DISPATCH=new Set(['mcp__consonance__chair_inject','mcp__consonance__call_chair']);
const WRITEY=/^(Write|Edit|NotebookEdit)$/;
let cur=null; const turns=[];
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]),crlfDelay:Infinity});
rl.on('line',l=>{ if(!l)return; let r; try{r=JSON.parse(l)}catch(_){return}
  if(r.promptSource!==undefined){ if(cur)turns.push(cur); cur={ts:r.timestamp,seq:[]}; }
  const m=r.message; if(!m||m.role!=='assistant'||!Array.isArray(m.content))return; if(!cur)return;
  for(const b of m.content){
    if(b.type==='text'&&(b.text||'').trim().length>0) cur.seq.push('TEXT');
    else if(b.type==='tool_use'){
      if(DISPATCH.has(b.name)) cur.seq.push('DISPATCH');
      else if(WRITEY.test(b.name||'')) cur.seq.push('WRITE');
      else if(b.name==='Bash'&&/git\s+commit/.test((b.input&&b.input.command)||'')) cur.seq.push('COMMIT');
    }
  }
});
rl.on('close',()=>{
  if(cur)turns.push(cur);
  const D=turns.filter(t=>t.seq.includes('DISPATCH'));
  let p2=0, viol=0, p3=0, both=0;
  for(const t of D){
    const s=t.seq, fd=s.indexOf('DISPATCH'), lt=s.lastIndexOf('TEXT');
    const textBefore=s.slice(0,fd).includes('TEXT');
    const stateBefore=s.slice(0,fd).some(x=>x==='WRITE'||x==='COMMIT');
    const v = lt>fd;
    if(textBefore)p2++; if(v)viol++; if(stateBefore)p3++; if(textBefore&&stateBefore)both++;
  }
  console.log('turns total (promptId partition):', turns.length);
  console.log('turns containing >=1 dispatch:', D.length);
  console.log('  retrospective VIOLATION (dispatch before turn\'s last text):', viol, '=', (100*viol/D.length).toFixed(1)+'%');
  console.log('  P2 would fire (text precedes first dispatch):', p2, '=', (100*p2/D.length).toFixed(1)+'%');
  console.log('  P3 would fire (Write/Edit/git-commit precedes first dispatch):', p3, '=', (100*p3/D.length).toFixed(1)+'%');
  console.log('  P2 AND P3 both:', both, '=', (100*both/D.length).toFixed(1)+'%');
});
```

### `severity.js`

```js
// How much text FOLLOWS the last dispatch in a violating turn? Separates
// "dispatched, then wrote the real answer" from "dispatched, then said 'sent'".
const fs=require('fs'), readline=require('readline');
const DISPATCH=new Set(['mcp__consonance__chair_inject','mcp__consonance__call_chair']);
let cur=null; const turns=[];
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]),crlfDelay:Infinity});
rl.on('line',l=>{ if(!l)return; let r; try{r=JSON.parse(l)}catch(_){return}
  if(r.promptSource!==undefined){ if(cur)turns.push(cur); cur={ts:r.timestamp,seq:[]}; }
  const m=r.message; if(!m||m.role!=='assistant'||!Array.isArray(m.content))return; if(!cur)return;
  for(const b of m.content){
    if(b.type==='text'&&(b.text||'').trim().length>0) cur.seq.push({k:'TEXT',n:b.text.trim().length});
    else if(b.type==='tool_use'&&DISPATCH.has(b.name)) cur.seq.push({k:'DISPATCH',n:0});
  }
});
rl.on('close',()=>{
  if(cur)turns.push(cur);
  const buckets={'0':0,'1-200':0,'201-1000':0,'1001-4000':0,'4000+':0};
  let n=0; const big=[];
  for(const t of turns){
    const ks=t.seq.map(x=>x.k); const ld=ks.lastIndexOf('DISPATCH'); if(ld<0)continue;
    const after=t.seq.slice(ld+1).filter(x=>x.k==='TEXT').reduce((a,x)=>a+x.n,0);
    n++;
    if(after===0)buckets['0']++;
    else if(after<=200)buckets['1-200']++;
    else if(after<=1000)buckets['201-1000']++;
    else if(after<=4000)buckets['1001-4000']++;
    else {buckets['4000+']++;}
    if(after>1000) big.push({ts:t.ts,after});
  }
  console.log('dispatch turns:', n);
  console.log('chars of TEXT after the LAST dispatch in the turn:');
  for(const k of Object.keys(buckets)) console.log('  '+k.padEnd(10)+ String(buckets[k]).padStart(4) + '  ' + (100*buckets[k]/n).toFixed(1)+'%');
  console.log('\nturns with >1000 chars written AFTER the last dispatch (the severe shape):', big.length);
  big.slice(-8).forEach(x=>console.log('  ',x.ts,x.after));
});
```

### `tailcost.js`

```js
// How many bytes back from EOF must a hook read to find the current turn's start?
const fs=require('fs');
const F=process.argv[2];
const size=fs.statSync(F).size;
const CHUNK=256*1024;
let pos=size, buf=Buffer.alloc(0), found=null, read=0;
const fd=fs.openSync(F,'r');
while(pos>0 && !found){
  const start=Math.max(0,pos-CHUNK), len=pos-start;
  const b=Buffer.alloc(len); fs.readSync(fd,b,0,len,start); read+=len;
  buf=Buffer.concat([b,buf]); pos=start;
  const lines=buf.toString('utf8').split('\n');
  for(let i=lines.length-1;i>=1;i--){
    if(lines[i].includes('"promptSource"')){ found={i,bytesRead:read}; break; }
  }
}
fs.closeSync(fd);
console.log('file bytes:', size.toLocaleString());
console.log('bytes read from EOF to find turn start:', found?found.bytesRead.toLocaleString():'NOT FOUND');
console.log('fraction of file:', found?((found.bytesRead/size)*100).toFixed(4)+'%':'n/a');
const t0=Date.now();
// time a 1MB reverse read
const fd2=fs.openSync(F,'r'); const b2=Buffer.alloc(Math.min(1024*1024,size));
fs.readSync(fd2,b2,0,b2.length,Math.max(0,size-b2.length)); fs.closeSync(fd2);
console.log('1 MB tail read ms:', Date.now()-t0);
```

### `p1.js`

```js
// READ-ONLY. Scores prevention test P1 ("the cited object must predate the turn") over all
// dispatches in a transcript, reusing dispatch-gate's OWN exported findCitation so the
// citation semantics cannot drift from the shipped gate.
const fs=require('fs'), readline=require('readline'), path=require('path');
const { execFileSync } = require('child_process');
const REPO='C:/Consonance/lighthouse';
const { findCitation } = require(path.join(REPO,'consonance/hooks/dispatch-gate.js'));
const shaCache=new Map(), timeCache=new Map();
const shaOk=s=>{ if(shaCache.has(s))return shaCache.get(s);
  let ok=false; try{ execFileSync('git',['cat-file','-t',s],{cwd:REPO,timeout:4000,stdio:['ignore','pipe','ignore']}); ok=true;}catch(_){}
  shaCache.set(s,ok); return ok; };
const exists=p=>{ try{return fs.existsSync(path.join(REPO,p))}catch(_){return false} };
const shaTime=s=>{ if(timeCache.has(s))return timeCache.get(s);
  let t=null; try{ t=Date.parse(execFileSync('git',['show','-s','--format=%aI',s],{cwd:REPO,encoding:'utf8',timeout:4000}).trim()); }catch(_){}
  timeCache.set(s,t); return t; };
// re-extract the actual cited token (findCitation returns only the KIND)
function citedToken(text){
  if(typeof text!=='string'||!text)return null;
  if(/\[interrupt\]/i.test(text))return {kind:'interrupt',tok:null};
  for(const m of text.match(/\b[0-9a-f]{7,40}\b/g)||[]) if(shaOk(m)) return {kind:'sha',tok:m};
  for(const raw of text.match(/[A-Za-z0-9_.\-/]+\/[A-Za-z0-9_.\-]+/g)||[]){
    const p=raw.replace(/[:.,;)\]]+$/,'').split(':')[0];
    if(p&&exists(p)) return {kind:'path',tok:p};
  }
  return null;
}
const DISPATCH=new Set(['mcp__consonance__chair_inject','mcp__consonance__call_chair']);
let turnStart=null; const rows=[];
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]),crlfDelay:Infinity});
rl.on('line',l=>{ if(!l)return; let r; try{r=JSON.parse(l)}catch(_){return}
  if(r.promptSource!==undefined) turnStart=Date.parse(r.timestamp);
  const m=r.message; if(!m||m.role!=='assistant'||!Array.isArray(m.content))return;
  for(const b of m.content) if(b.type==='tool_use'&&DISPATCH.has(b.name))
    rows.push({ts:Date.parse(r.timestamp),iso:r.timestamp,turnStart,text:(b.input&&b.input.text)||''});
});
rl.on('close',()=>{
  let fires=0,passes=0,noCite=0,interrupt=0,unknown=0;
  const detail=[];
  for(const d of rows){
    const c=citedToken(d.text);
    if(!c){noCite++;continue}
    if(c.kind==='interrupt'){interrupt++;continue}
    let objTime=null;
    if(c.kind==='sha') objTime=shaTime(c.tok);
    else { try{objTime=fs.statSync(path.join(REPO,c.tok)).mtimeMs}catch(_){} }
    if(objTime==null||d.turnStart==null){unknown++;continue}
    if(objTime>=d.turnStart){fires++; detail.push(['FIRE',d.iso,c.kind,c.tok].join(' '));}
    else passes++;
  }
  const scored=fires+passes;
  console.log('dispatch tool_use calls:', rows.length);
  console.log('  [interrupt] exempt:', interrupt);
  console.log('  no citation (existing gate already ASKs):', noCite);
  console.log('  unresolvable object/turn:', unknown);
  console.log('  SCORED:', scored);
  console.log('    P1 FIRES (cited object created inside the dispatching turn):', fires,
    scored? '= '+(100*fires/scored).toFixed(1)+'%':'');
  console.log('    P1 passes:', passes);
  console.log('\nlast 12 fires:'); detail.slice(-12).forEach(x=>console.log('  '+x));
});
```

