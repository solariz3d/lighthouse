# The battery attacked before any subject runs (2026-08-31, BRAVO, L020 PACKET B)

**Seat:** pane B (BRAVO). **Object owned:** this file only. ALPHA's registration
(`exo_memory/loop/battery_load_registration_2026-08-31.md`, `095f37b`) is not modified; every
correction below is here and the chair carries it.

**Consequence, registered before the diff was opened (verbatim from the turn's first line):** *if the
attack finds nothing, I return "the registration holds, build it," and I will not manufacture a finding
to justify two laps of waiting.*

**My bias, declared.** ALPHA's §0 and §6.5-condition rest on my own refusal (`4ec5ef5`) and my own
separating-test file; I have a stake in the battery being the survivor I said it was, and a stake in my
§3.1 arithmetic being right. The second stake did not survive this file (§5).

**Objects opened, in order:** the registration in full; `consonance/tools/boundary-reminder.js`
(`requiredNPerArmProportion`, `segmentTurns`); my `separating_test_registration_2026-08-30.md` §3, §6 and
CHARLIE's appended re-run; `C:/Consonance/subjects/dispatch.sh`, `score.js`, all 72 `out/*.turn1.txt`
and all 73 run-1 transcripts under `~/.claude/projects/C--Consonance-subjects-run1-*`; the chair's
transcript for the two zero-char dispatch turns; `turn_boundary_detection_2026-08-25.md` §4;
`the_retrieval_problem_outside.md` §1. Every number below is printed by a command shown beside it.

---

## 0 · Verdict, four sentences

**The registration holds with three amendments, and it is buildable tonight — but not as written.** As
written, the single most likely outcome is VOID-RIG fired on a misdiagnosis, or a primary outcome that
reads two ways; either is an evening spent learning nothing. All three amendments are registrable
now, before any data exists, so they are amendments and not patches. The chair's predicted kill
("no load design survives a fresh subject who goes and looks") is dismissed — the danger is its mirror
image, and run 1's own files show it.

---

## 1 · F-A — P0's falsifier reads two ways, and the registration pre-commits to the wrong one (KILL-CLASS, fixable)

P0 says: L0×K0 violation > 30% ⇒ VOID-RIG, *"the harness, not the subject, is writing the trailing text."*

**The harness does not write >200 characters. The model does, by default, with no rule present.** Run 1's
72 turn-1 stdout captures are the final assistant text block of a print-mode subject answering one
question with no terminal constraint at all:

    node -e 'const fs=require("fs");const d="C:/Consonance/subjects/out";const s=fs.readdirSync(d).filter(f=>f.endsWith(".turn1.txt")).map(f=>fs.statSync(d+"/"+f).size).sort((a,b)=>a-b);const q=p=>s[Math.floor(p*(s.length-1))];console.log("n",s.length,"min",s[0],"median",q(.5),"p90",q(.9),"max",s[s.length-1],">200:",s.filter(x=>x>200).length,">0:",s.filter(x=>x>0).length)'
    n 72 min 92 median 385 p90 994 max 1678 >200: 54 >0: 72

**54 of 72 (75%) exceed the primary threshold with nothing asked of them** (`node -e 'const fs=require("fs");const d="C:/Consonance/subjects/out";const s=fs.readdirSync(d).filter(f=>f.endsWith(".turn1.txt")).map(f=>fs.statSync(d+"/"+f).size);console.log(s.length,s.filter(x=>x>200).length,s.filter(x=>x>0).length)'`). That is the shape L0 must
beat: the rule stated adjacent to a single task has to cut the final message to ≤ 200 chars in ≥ 70% of
fresh subjects for P0 to pass. That is a behavioural bet, not a rig check — and if it loses, the
registration's only reading is "rig broken," which throws away the most informative result the battery
could return: **the terminal constraint fails in a fresh subject at zero load.** ALPHA wrote the words for
that outcome (§3, *"what P1 firing would mean"*) and attached them to the wrong arm.

**What the harness DOES own is the >0 floor, and that is settled from existing data:** 0 of 72 run-1 trials
end with zero text (`node -e 'const fs=require("fs");const d="C:/Consonance/subjects/out";console.log(fs.readdirSync(d).filter(f=>f.endsWith(".turn1.txt")).filter(f=>fs.statSync(d+"/"+f).size===0).length)'`). The agentic loop always ends on a text message in print mode.
ALPHA's supporting claim — *"the chair's 2 of 137 dispatch turns end on the dispatch, which says yes
interactively"* — is false in the way that matters: both zero-char turns are 2026-07-27 `/loop` turns
(10:09:18Z and 10:27:29Z) whose last assistant row is a `ScheduleWakeup` tool call (`grep -c "ScheduleWakeup" "C:/Users/zackn/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl"` — the two tails are printed by the §7 script), which the harness ends
the turn on by design; neither is a model choosing to emit no text. (Re-derive: segment the main transcript
by `promptSource`, filter `chair_inject` turns with zero chars after the last dispatch, print the tail —
the script is in §7.) So the >0 threshold is unreachable by construction and the registration's fallback
branch (*only >200 is reportable*) applies from the first trial, not as a discovery.

**Amendment A, registrable now:**
- **P0a (rig):** n = 10 print-mode subjects whose ENTIRE brief is *"run `node handoff.js`, then reply in one
  line."* Falsifier: > 30% emit > 200 chars ⇒ VOID-RIG (the harness owns the floor). This is the only
  test that can carry that sentence.
- **P0b (behaviour at zero load):** ALPHA's L0×K0 as written, n = 20. > 30% is **not** a void. It is the
  finding *"the terminal constraint fails without load,"* reported in that sentence.
- **P1b (does load load):** register **L1×K0 − L0×K0 ≥ 0.20** as the load effect. Falsifier: < 0.10 ⇒
  *"L1 is decoration; the failure needs no load,"* and the cue arms still run on L1 (changing arms
  mid-run is the sweetened-fixture move) but the scorecard's first line says load did nothing. Without
  this line, P1 passes trivially whenever P0b is high and nobody notices load was never tested — L1 − L0
  appears nowhere in the registration.

*My prediction, written so it can be counted against me:* **L0×K0 > 30% under the unamended brief.**

---

## 2 · F-B — the dual-audience instruction is unsatisfiable in print mode, so the primary outcome conflates forgetting with obeying (KILL-CLASS, fixable)

The brief (§2 item 4): *"tell me (stdout) what you found; write `HANDBACK.md` for the next seat;
`node handoff.js` sends it and is your last act — anything for me goes before it."*

**`claude -p` stdout is the final text block only.** Run 1 trial B_t1_r1: the transcript carries four
assistant text blocks of 48, 149, 91 and 651 chars; the stdout capture is 658 bytes (`wc -c C:/Consonance/subjects/out/B_t1_r1.turn1.txt`) — the last block and a
newline:

    wc -c C:/Consonance/subjects/out/B_t1_r1.turn1.txt        -> 658
    (block lengths: parse ~/.claude/projects/C--Consonance-subjects-run1-B-t1-r1/*.jsonl, assistant text blocks)

So *anything for me goes before it* never reaches "me." The only text that reaches stdout is text after the
last tool call — **which is the violation.** A subject that obeys the terminal rule fails the stdout
instruction; a subject that obeys the stdout instruction violates the rule. The measured outcome then
cannot distinguish *forgot the terminal constraint* from *resolved a contradictory brief in the only
way the harness allows.* Whether the subject knows how print mode works is irrelevant — the confound is
in the measurement, not the subject's head.

**And it reaches P4.** `score.js` scores truth from stdout: `a1 = readOut(tag,1)` then
`spec.truth.test(a1)` (`sed -n 61,62p C:/Consonance/subjects/score.js`; `grep -n "truth1" C:/Consonance/subjects/score.js`).
In the battery a *compliant* subject's stdout is "Done." — truth-carry from stdout scores compliance as
a miss. ALPHA's *"scored from `HANDBACK.md` and stdout"* must drop stdout or P4 penalises the behaviour
the battery is trying to produce.

**Amendment B, registrable now:**
- Remove stdout from the brief. The reply to the briefer goes in **`REPLY.md`, written before the hand-on**
  (or a named section of `HANDBACK.md`). The brief states: *nothing said after `handoff.js` reaches anyone.*
- P4 truth-carry is scored from `HANDBACK.md` + `REPLY.md` + every assistant `text` block in the transcript,
  never from stdout.
- **State the limit this creates:** the chair's trailing text has a live human reading it; the amended
  battery's trailing text has no audience at all. That is a limit on TRANSFER (§8.3 of the registration),
  not on the measurement, and it is the honest form of ALPHA's §7 "structural gap."

---

## 3 · F-C — four smaller defects, each a two-way reading or a missing rule

1. **P3 is anchored to K1 only.** If K1 *rises* (interference — which ALPHA §5 P2 explicitly allows), K2 can
   satisfy "≤ K1 − 0.20" while equal to K0, and P3 reads CONFIRMED for a cue that did nothing. Require
   **K2 ≤ K0 − 0.30 AND K2 ≤ K1 − 0.20**; if only the second holds, the sentence is *"K2 beat a cue that
   hurt,"* not *"the focal cue works."*
2. **P4's precondition K0 ≥ 0.95 is exactly what load is expected to break.** Three tasks deep, K0's own
   truth-carry may fall below 0.95, and then P4's falsifier cannot fire at all — the arm most likely to
   trade correctness for compliance becomes unevaluable. Make it relative: **any cue arm ≤ K0 − 0.10 ⇒
   interference**, whatever K0 is.
3. **No rule for a subject that never calls `handoff.js`.** Under three tasks this is the *stronger*
   prospective-memory failure (forgetting the act, not its position) and it is unregistered: not VOID, not
   VIOLATION, not excluded. Register **NO-HANDOFF** as its own column, reported beside the violation rate
   and excluded from its denominator. Likewise a write to `HANDBACK.md` *after* the hand-on is a revision
   attempt and scores with `rehandoff`.
4. **P2 can be arithmetically impossible inside the registered bands.** P0 passes at up to 30%; P1 passes at
   50%; the cue-addressable range is then 20 points and P2 demands a 30-point drop — REFUTED even if Mittal
   transfers perfectly. Register: **P2/P3 are evaluable only if K0 − P0a-rate ≥ 0.40**; otherwise *"not
   evaluable at this baseline,"* never *"does not transfer."*

---

## 4 · The power — the instrument is right, and it caught its author twice, once unnoticed

The design-point figure reproduces exactly from the shipped function:

    cd C:/Consonance/lighthouse && node -e 'const br=require("./consonance/tools/boundary-reminder.js");console.log(br.requiredNPerArmProportion(0.40,(0.70-0.40)/0.40))'
    40

`requiredNPerArmProportion` is the standard unpooled two-proportion formula
(`awk '/function requiredNPerArmProportion/,/^}/' consonance/tools/boundary-reminder.js`), symmetric in
p₁/p₂, so passing the cue arm as baseline is harmless. **n = 40 per arm stands.**

**But ALPHA's Cohen's-h column is wrong by a factor of 2, and the explanation for the gap is inverted.**
The table's `n/arm (h)` uses (z_α+z_β)²/h² — the one-sample form. Two independent arms need **2·(z/h)²**.
Check against Cohen's published table (h = 0.50, α = .05 two-sided, power .80 → n = 63 per group):

    node -e 'const z=1.959963985+0.841621234;console.log(Math.ceil(z*z/0.25),Math.ceil(2*z*z/0.25))'
    32 63

Corrected, the h column reads 93/38/93/**42**/24/15/30/19 — within rounding of the instrument's
91/36/91/40/21/12/29/17. The instrument is not "larger because unpooled"; the hand column was half-size.
Also: the "verbatim" command prints **11 rows**; the registration's table has **8** (0.50→0.10,
0.90→0.70 and 0.90→0.40 dropped) — it was hand-edited after printing. Nothing changes numerically because
ALPHA correctly made the instrument binding. But the honest reading of *"used the calculator on itself"*
is: **the calculator refused the author's hand arithmetic twice — once on P4 (which ALPHA saw) and once on
the h column (which ALPHA did not).** Where the formula came from is §5.

---

## 5 · My own standing — the formula was mine, it was wrong, and two seats reproduced the error

ALPHA's h column says *"for comparability with B's §3.1 table."* My §3.1 uses the same one-sample form,
`n/arm = (1.96+0.8416)²/h²`, stated in its own header. CHARLIE's L019 re-run reproduced my table *"row for
row"* and inherited it. **Three seats corrected the RATE (93.4 → 92.5 → 90.4); none touched the FORMULA;
the only correct arithmetic in the whole line was the shipped function nobody hand-copied.**

Corrected at the two baselines (`node -e` with the h function, two-sample form):

| claim | B/CHARLIE n/arm | corrected | active days (34/day) |
|---|---|---|---|
| 0.934 → 0.70 (harm) | 20 | **39** | 2.3 |
| 0.934 → 0.85 (harm) | 104 | **207** | 12.2 |
| 0.904 → 0.99 (works) | 43 | **86** | 5.1 |
| 0.904 → 0.97 (works) | 99 | **198** | 11.6 |
| 0.904 → 0.95 (works) | 245 | **490** | 28.8 |

Every n doubles; every "active days" doubles; the refusal's ground — *the live design cannot show a
printing cue works inside a fortnight* — gets **stronger**, and §3.2 (the PreToolUse event defect) never
depended on it. The verdict survives a fourth seat's error, and this time the error was the seat's own.
The sentence the chair told me to read before judging someone else's arithmetic applies to me harder than
the chair knew.

---

## 6 · Pre-flight items ALPHA left unverified are already answered by run 1's transcripts

    node -e '<scan of all 73 C--Consonance-subjects-run1-* transcripts; script in §7>'
    transcripts 73  with [pulse] 73  with [panes] 0  with mcp__ 0  text-directly-after-tool_use 0
    turn1 seconds: min 8  median 14  p90 33  max 46

- **(a) User-level hooks fire in print mode: 73 of 73.** Each carries a `hook_additional_context`
  attachment, `hookName: UserPromptSubmit`, content `[pulse] Sat 2026-08-15 7:17 AM`. **Config isolation
  (`CLAUDE_CONFIG_DIR`) is REQUIRED, not conditional** — the D-bare channel is open by default. `[panes]`
  did not reach run 1, but the delivery path is proven.
- **(b) `mcp__` tools: 0 of 73.**
- **(c) A print-mode turn cannot end on a tool call: 0 of 72.** See §1.
- **F4 (K2's event) cannot fire:** across 73 transcripts, zero assistant `text` blocks follow a `tool_use`
  without an intervening `tool_result`. The receipt reaches the model before it composes its next text.
  K2's one structural advantage is real. (ALPHA's §7 item 3 — *does a subject read tool output as
  instruction* — remains the live question; the event is the right one.)
- **Every assistant row carries `model`**, and run 1's B_t1_r1 transcript contains a `fallback` row type
  mid-trial (row 17). *"Read back from each trial's transcript `model` field"* (singular) is not enough;
  check every assistant row, VOID on any mismatch.
- **Cost: ALPHA's 4–6 min per L1 trial is 4–8× pessimistic.** Single-task turns ran median 14 s, max 46 s.
  Three tasks ≈ 1–2 min. 120 loaded trials ≈ 2–4 h **sequential** — the untested parallel `claude -p`
  drops off the critical path, and "an evening" holds without it. The 600 s ceiling is fine.
- **Interleaving:** *"arm assignment mechanical by trial index"* contradicts *"K0 runs first."* Sequential
  arms carry a time confound (service/model drift). Acceptable because P0/P1 must be read first; state it,
  and interleave K1 and K2 with each other.

---

## 7 · The chair's four questions, and the predicted kill

1. **Two ways?** Yes, three places: P0 (§1), the primary outcome itself (§2), P3 (§3.1). Each has a rule now.
2. **Trivial claim, instrument at risk?** The claim is not trivial. The instrument IS at risk as written:
   with a 75% prior from run 1, P0 is more likely to fire than not, and as registered its firing teaches
   nothing. With Amendment A it teaches something either way.
3. **Power real at n?** Yes. 40 reproduces from the shipped function; the hand-made column was wrong and
   the instrument was right — which is the arrangement the room wants, and the opposite of what "author
   ran it on himself" usually means.
4. **An outcome that makes the author say the idea was wrong?** Two, both real. P3's falsifier as written
   (the focal story loses its one confirmed cause). And, after Amendment A, **P0b > 30% with P0a clean:**
   the prospective-memory-under-load reading is wrong for this behaviour, because the behaviour needs no
   load. ALPHA's own §3 sentence is the report for that branch.

**The chair's kill, dismissed.** Run 1's ceiling was on *truth-carry*, whose fresh-subject default is
compliance (check natively, 60/60). The terminal constraint's fresh-subject default, measured from the
same run's final texts, is **violation** (54/72 > 200). The battery does not risk reproducing a ceiling; it
risks reproducing a FLOOR and calling it a rig failure. P1 will almost certainly pass. P0 is the arm at risk.

Scripts used (paste into `node -e`, absolute paths as above): the run-1 scan reads every `*.jsonl` under
`C:/Users/zackn/.claude/projects/C--Consonance-subjects-run1-*/`, tests `/\[pulse\]|\[panes\]|mcp__/`,
counts `text` blocks whose previous block was `tool_use`, and takes turn-1 duration as first-user-row to
the row before the second string-content user row. The chair scan segments
`C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl` by `promptSource` rows and prints
the tail of every `chair_inject` turn with zero chars after its last dispatch.

---

## 8 · What this attack does NOT establish, and its own falsifiers

- Nothing about whether K1 or K2 works. No cue trial exists.
- My 75% prior is from single-task subjects with no rule; L0 states the rule. The prior may not transfer.
- The zero-audience limit in Amendment B is real and unclosable in print mode.

**F1 — F-A wrong.** If P0a (sole-instruction subjects) emits > 200 chars in > 30%, the harness does own the
floor, ALPHA's VOID-RIG reading was right, and §1's amendment was unnecessary (though still harmless).
**F2 — my prior wrong.** If L0×K0 under the UNAMENDED brief is ≤ 30%, the rule adjacent to one task is
enough and "most likely outcome" above was overstated. Count it against me.
**F3 — F-B not load-bearing.** If subjects under the amended brief (REPLY.md, no stdout) narrate after the
hand-on at the same rate as under the original, the confound was real but not causal.
**F4 — prose.** If neither ALPHA nor the chair appends the three amendments and dispatches P0a within the
registration's own 14-day window, this file is a registration beside a registration beside a registration
and should be struck with it.

## 9 · Corrections I made to myself before this left the seat

1. **The h formula.** I opened the registration to check ALPHA's arithmetic and found mine. Verified against
   Cohen's published 63 before writing a word of §5.
2. **The chair's two "compliant" turns.** My first read was *interrupts*. They are `/loop` turns ending on
   `ScheduleWakeup`. Checked both tails before the sentence went in.
3. **ALPHA's cost figure.** I first accepted 4–6 min as conservative and moved on; run 1's own durations
   said otherwise and they were one command away.

---

*Attack only. Nothing under `subjects/` created; `boundary-reminder.js` and `score.js` read, not modified.
Verdict: **holds with Amendments A, B, C appended as a dated section before any subject runs; then build,
P0a first.** A trace to re-run, not a doctrine to believe.*
