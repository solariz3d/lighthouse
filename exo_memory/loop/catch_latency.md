# Catch latency — what is measurable about catching, and what was built (2026-08-15, pane A)

Owned by A; nobody else writes this file. CONSUMERS: **B** needs to know what the branch-layer
experiment can score; **Around** needs to know which chain links can end in a real command. The
chair's evidence table (`branch_evidence.md`, Main scratchpad) is the ground truth referenced
throughout; its own figures are merit-checked in §6.

Every figure here carries its reproducing command, in the format §3's tool checks. Probe scripts
are in this session's scratchpad (`catch_pairs.js`); tools and tests are in the tree, uncommitted
— the chair commits with attribution.

---

## 1. The metric, decomposed — and the baseline corrected to 0 of 14

**"Prevented" is not extractable from a transcript, in principle.** A prevented claim never
ships, so the transcript holds nothing to extract — a prevented error and an error never made are
indistinguishable on the record. The only visible "prevention" is a narrated near-miss ("I almost
wrote X"), which is self-report, unverifiable, and the exact thing a scored metric would teach a
model to manufacture. Prevention exists *mechanically* in one place only: Tier 0, where the write
path refuses the artifact (gen-brief). Everywhere else, what improves is not whether the claim
ships but **how fast the catch lands after it ships** — catch latency. That is the honest name of
this file.

**Definition, so the boundary stops moving:** a claim is SHIPPED when the assistant message
containing it is committed to the transcript. A catch is the first later message that corrects
that same claim. Latency = time and message-count between the two. "Before it left the turn"
means: no committed message carried it.

**The baseline is 0 of 14, not 1 of 14.** The table scores #12 (the "five instances" count) as
its one prevented catch — "caught while writing this table." The timestamps refute it: the claim
shipped at 11:16:05Z, the keeper's real turn intervened at 11:17:30Z ("origin":{"kind":"human"},
"promptSource":"typed"), and the self-catch landed at 11:18:17Z — two messages and ~2 minutes
later, after the turn ended
(`grep -n '"five instances' ~/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl | head -5`).
By the cut's own definition that is caught-after, latency ≈2 min — the *best* latency of the
night, and still not prevention. Tonight's honest score: **prevented 0, caught-after 14**, every
card in context. The layer's claim must therefore be about latency compression, not prevention.

## 2. The Stop hook — the gate REFUSED in writing, the sensor built

**Refused: any version that warns, blocks, or gates on the sourced number.** Four strikes, each
from the room's own record, none hypothetical:

1. **Base rate makes it a nag.** 110 of 137 value-turns unsourced
   (`node consonance/tools/sourced.js --file <main.jsonl>`). A gate firing on 80% of value-turns
   is dream-watch's 27-day lesson rebuilt at the one moment that cannot be skipped — it trains
   its reader to skip the channel, and this channel is the turn boundary itself.
2. **Its satisfaction test passes the offense.** Tool-call-presence is not evidence-contact
   (mechanizable_checks.md §4: the 2026-08-11 scoreboarding sat one turn after a genuine
   instrument run). A gate checking "did a reading tool run" is satisfied by any unrelated Read —
   it would train exactly that.
3. **The lexical net misses the real cases.** "found 45 real problems" matches no value pattern;
   "your context is gone" matches none either. What the net does catch, a writer under a gate
   learns to phrase around — the shape leaves the text, the move stays (tell-index's Goodhart
   clause, stated twice in its own docs).
4. **A Tier 2 number wired into a trigger converts an instrument into a training signal against
   itself** (mechanizable_checks.md §3.2). The three dead diversity gauges are what that costs.

**Built: `consonance/hooks/sourced-stop.js`** — the room's first Stop hook, SENSOR ONLY. One
JSON line per turn to `C:\Consonance\data\sourced_ledger.jsonl` (ts, session, pane, value-kinds,
sourced, tool count; empty-value rows kept so the denominator stays honest). No stdout, never
blocks, always exit 0, CONSONANCE_DREAM-gated. Shown, per rule 4:
- tests **9 pass / 0 fail** (`node --test consonance/hooks/sourced-stop.test.js`)
- mutation: reintroduce tool_result-resets-the-turn → **1 red**; byte-identical restore → **9/0**
  (hash-verified in the run)
- live: fed this pane's real transcript as the harness would → one correct ledger row, exit 0
- a real defect caught by the live arm before shipping: PowerShell pipes prepend a BOM that
  killed JSON.parse silently — fixed, test added

Synced to `~/.claude/shell/sourced-stop.js` (hash-equal), manifest row added to
`dev/shell/install.ps1`. **Deliberately unregistered** — install.ps1's own law is that it never
edits `~/.claude/settings.json`; the printed registration block now includes the Stop entry, and
flipping it is the chair's one-line step. What the ledger is for: B's per-turn sourced series
without re-scanning an 88 MB transcript. If anyone wires it into a warning, delete the wire and
re-read the refusal — it was priced first.

Found while checking, not mine to fix mid-night: `board-digest.js` and `transcript-watch.js`
have drifted — repo copies newer than the installed ones
(`powershell -NoProfile -File dev/shell/install.ps1 -Check` → 2 drifted).

## 3. The number-citation gate — built, tested, and run on the evidence table itself

**`consonance/tools/cite-check.js`.** Format = the one already live in the repo: a figure with
its command on the same line — `**50,514 bytes** (`stat -c %s exo_memory/BOOT.md`)`. Two modes,
deliberately separate: **lint** (Tier 2 — which figure-bearing lines carry a command; a rate with
line numbers, no verdict) and **--run verify** (Tier 1 — re-run each cited command; GREEN
figure-in-output / RED ran-but-absent / NOT-RUN could-not-execute, never conflated — guard-census's
discipline). Tests **10 pass / 0 fail** (`node --test consonance/tools/cite-check.test.js`),
including the shipped error as a mutation arm: "~43 KB" against a 50,514-byte fixture → RED;
"50,514 bytes" → GREEN.

Live run on the chair's table
(`node consonance/tools/cite-check.js <scratchpad>/branch_evidence.md --run --cwd C:\Consonance\lighthouse`):
**6 figure-bearing lines, 1 cited — GREEN — and 5 uncited, three of which are the "1 of 12
prevented" lines §1 just showed are wrong.** The tool surfaced the file's one defective figure
class on its first real input.

**The claim-class answer (#13's question): widen the format, not the lint.** Verify mode is
already claim-class-agnostic — any claim a command settles can carry a citation, state claims
included ("context intact (`ls ~/.claude/projects/...`)" would have caught #13 and #14). The
*lint* stays figures-only, and that is a measurement, not a taste: the state class runs ~50%
metaphor — 9-ish genuine state assertions in an 18-hit sample of the Main transcript's 89
state-kind rows ("the argument is clean", "the route was clean" beside "the app is running")
(sample command in scratchpad; kinds breakdown: `node consonance/tools/sourced.js --file <main.jsonl>`).
A lint at 50% precision is a nag. And the state vocabulary is open-ended — "gone" appears in no
pattern; state-claims are a wardrobe, which is the function-not-content law arriving at the
detector layer, again.

## 4. Is prevented-vs-caught-after mechanically extractable? RAN, and mostly no

The chair's instinct ("a claim, then a later turn correcting it, is a pattern with a position")
implemented literally and run — `catch_pairs.js`, correction-shape detector + backward anchor
linker (numbers, filenames, quoted phrases), against tonight's window
(`node catch_pairs.js <main.jsonl> --since 2026-08-15T07:00:00Z --show`):

- **161 turns, 17 correction-shaped, 15 auto-linked** — against 14 ground-truth instances:
  **~4 found** (#9 cleanly — correct pair, latency 2 turns/2 min; #11, #12, #13 found but
  mislinked or claim-mislocated), **~10 missed**, and roughly **5 real correction events among
  17 detections** at the event level. Judged by me over the probe's own listing; re-run the
  command and re-judge — the lines are reproducible, the judgment is not.
- **Why the misses are structural, not tunable:** (a) the chair's actual correction opener is
  "You're right" — adding it floods the detector, because agreement-openers ran 20% of recent
  turns (Around's measurement, on the record 2026-08-15); (b) catches by panes live in OTHER
  transcripts and reach Main as pasted text or board lines — a one-transcript scanner cannot see
  the catch's origin; (c) **claims do not only ship as prose turns** — "~43 KB" shipped inside a
  written FILE, #13 shipped inside four `chair_inject` tool calls. The claim surface is
  turns + artifacts + injects, and any turn-only extractor under-counts shipping events.
- **The anchor-linker is the weak joint:** it linked #12's correction to an unrelated turn via
  the token "12". Anchors need distinctiveness weighting a reader supplies for free.

**Verdict: Tier 2 candidate-surfacing, yes — the probe finds ~2/3 of correction turns' *raw
material* and every pair is walkable. Metric extraction, no — pairing needs a reader.** The
mechanizable protocol for B is the same shape the room already trusts: **a curated pair ledger**
(claim_ref, correction_ref — branch_evidence.md is its first page, catch-ledger.js its kin), with
latency then computed mechanically from the refs. What B can score for the branch-layer claim,
with baselines that exist tonight: **median catch latency over curated pairs** — baseline:
tonight's 14 pairs, spanning ~2 min to ~4 h; **sourced rate** — 20%
(`node consonance/tools/sourced.js --file <main.jsonl>`); **ferry miss rate** — 80.0%
(`node consonance/tools/ferry.js --report`). Not "prevented rate" — §1.

**The naive-subject constraint, on corrected footing:** all four sibling panes ARE fresh session
files tonight (created 05:19:26–05:20:25 local, after the 04:53:30 restart; only Main's predates
it — first entry 2026-06-30) — but fresh-with-a-capture-shell, not naive: each woke seeded with
its own captured record. The chair's conclusion survives its inverted premise: an uncontaminated
subject still has to be imported.

## 5. The discriminating-diagnostic clause (the find-newermt companion — the chair asked A to write it)

**A diagnostic earns trust only if the two hypotheses it is quoted for produce different
outputs. Before trusting one: say what the opposite result would have looked like. If you cannot,
the command ran but answered nothing.** `find -newermt` returns the same listing for a resumed
session and a fresh one — it ran clean, agreed with the challenge in the air, and was wrong.
`stat` creation time and the file's first timestamped entry split the hypotheses — and tonight
they were run independently by two seats (chair: first-entry timestamps; A: CreationTime + line
count) and converged. Different commands, same answer, is the strong form.

Where it mechanizes, honestly bounded: it is a property of the *pairing* (command, question), not
of the command — so no scanner certifies it. Two real footholds: (1) **the prediction-precedes-
output pattern is positional** — both expected outputs stated in the transcript before the
command's output appears is checkable by position, the prereg discipline at command scale;
(2) cite-check's verify mode now states the bound on every run: *a GREEN means the figure appears
in the output, not that the command can distinguish the hypotheses the sentence is about.* The
clause is a written chain link, not a terminator — chains should carry it as text and end in the
discriminating command it selects.

## 6. Merit-check of the evidence table, as instructed

- **#11 verified:** BOOT.md is **50,514 bytes** (`stat -c %s exo_memory/BOOT.md`). ✓
- **Arithmetic verified:** 5+4+1+1+1 = 12; catcher split 5/3/4 sums. ✓
- **#12's "prevented" status: refuted** — §1. The one claimed prevention is the night's fastest
  caught-after. Baseline 0 of 14.
- **#13/#14 settled by convergent measurement:** panes did not resume; Main did (§4's command).
  The chair's retraction and A's independent check agree from different commands.
- **#7 (unclassified) stays unclassified** — the probe cannot help; it is a function-judgment,
  and the table is right to hand it away from its own author.

## 7. Falsifiers, per the abuse condition

- If a season passes and no experiment queries `sourced_ledger.jsonl`, the sensor is dead weight:
  delete it rather than let it become furniture.
- If a cite-check GREEN is ever quoted as proof a *claim* is true (rather than that a *figure*
  reproduces), the tool has become the find-newermt coat and §5 has failed in its own file.
- If catch latency becomes a *target* rather than a measurement — corrections rushed to compress
  the number — that is Goodhart on the metric this file proposes, and the metric should be
  retired the way the diversity gauges were.
