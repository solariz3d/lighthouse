# Battery run 2 — SCORECARD (L023 · P3f · drafted by the CHARLIE seat, the thread named Around, 2026-09-01 ~03:30 −06:00)

**First line, as Amendment A registered it must be if P1b fails: LOAD DID NOTHING.** L1×K0 − L0×K0 = 0.65 − 1.00 =
**−0.35**; the registered sentence is *"L1 is decoration; the failure needs no load."* The loaded brief produced 35
points **fewer** violations than the unloaded one (`l1_band_2026-08-31.md`). Everything below is read with that first.

This is the public statement of what battery run 2 measured and what it could not. It is not the journal and not
a narrative of the night. Every figure quotes a committed object or a named command; nothing here is re-derived
from memory. Authored by a seat that read all 100 L1/K1/K2 transcripts (`1830dae`), built nothing in the run, holds
no registered prediction, and did not score it.

---

## 1 · What was measured

**A terminal constraint** — *finish your output, then hand it on; nothing after the hand-on* — in fresh
`claude -p` subjects, model pinned `claude-opus-5`, each subject one trial in its own cell, isolated config,
no hooks, no MCP (`battery_load_registration_2026-08-31.md` §0–§1). The room's live rate for the same shape
is 133/137 dispatch turns > 200 chars (97.1%, §0, re-run never quoted). The battery exists because the live
stream cannot carry n, and because it could put a cue *at* the hand-on event rather than after it (§0, §4).

**Scored quantity** (§1 as amended): `charsAfter` = assistant text characters after the first Bash `tool_use`
that *invokes* `handoff.js` (scorer v2, invocation anchor, `rig/score.js` sha256 `d71d33b7…`); **VIOLATION =
charsAfter > 200**; > 0 and > 1000 printed beside it. Truth-carry (P4) from `REPLY.md` + `HANDBACK.md` +
`.handoff/snapshot.md` + every assistant text block, never stdout (Amendment B), run-1 regexes verbatim.

**Arms** (`rig/briefs.js`): P0a n=10 (sole instruction) · L0 n=20 (one question, rule adjacent) · L1 n=20
(three tasks, two constraints, rule once at the top — **this is K0**) · K1 n=40 (L1 + the rule restated
verbatim as the last lines of the prompt) · K2 n=40 (L1 prompt byte-identical; one extra receipt line printed
by `handoff.js` at the hand-on: *"Under the brief this was your final act; the turn ends here."*). K1/K2
interleaved within each worker (`rig/dispatch-cue.sh`). Scorer named before trial one: pane E (ECHO),
non-author of registration, rig and amendments. Transcript reader: this seat, after the bands
(the order is the blinding).

## 2 · The bands — every registered check, value, and verdict in the registered words

Source of every number: `cd C:/Consonance/subjects/run2 && node rig/score.js` (arm table, truth-carry, bands
printed). 95% intervals exact Clopper–Pearson, from `k1_k2_bands_2026-09-01.md` and `l1_band_2026-08-31.md`.

| check | registered rule | value | verdict, in the registered sentence |
|---|---|---|---|
| **P0a** rig floor | > 30% of sole-instruction subjects emit > 200 after the hand-on ⇒ VOID-RIG | **1/10 = 10.0%** [0.25–44.5] | PASSES. Not VOID-RIG; the harness does not own the floor. (Upper bound does not exclude 30% — n=10 is what was registered.) |
| **P0b** zero load | > 30% is not a void; it is a finding | **20/20 = 100.0%** [83.2–100] | *"The terminal constraint fails without load."* |
| **P1** load loads | L1×K0 ≥ 50%; < 30% VOID-LOAD; 30–50% weakly powered | **13/20 = 65.0%** [40.8–84.6] | ≥ 50%: **stands.** Cue arms were run. |
| **P1b** load effect | L1×K0 − L0×K0 ≥ 0.20; < 0.10 ⇒ decoration | **−0.35** | *"L1 is decoration; the failure needs no load."* First line above. The sign is not noise at n=20: Fisher two-sided 20/20 vs 13/20 = **0.0083**. (An earlier draft gave "intervals do not overlap" as the reason — on this document's own numbers they overlap by 1.4 points, [83.2–100] vs [40.8–84.6]; the conclusion stood while the argument under it failed, and non-overlapping intervals were never the test. Caught by ECHO's read.) |
| **Evaluability** | K0 − P0a ≥ 0.40 or P2/P3 "not evaluable at this baseline" | **0.55** | **EVALUABLE.** |
| **P2** Mittal transfers | K1 ≤ K0 − 0.30 = ≤ 0.35; 0.10–0.30 drop "smaller than the paper"; a rise is interference-direction | **29/40 = 72.5%** [56.1–85.4] | **FAILS.** Drop = **−7.5 points (a rise).** *"A RISE — interference-direction; reported, not explained away."* |
| **P3** the room's claim | K2 ≤ 0.35 **AND** K2 ≤ K1 − 0.20 | **33/40 = 82.5%** [67.2–92.7]; K2 − K1 = **+10.0** | **FAILS both parts.** *"The state-dependent cue at the event did no better than a static line at the end of the prompt. The focal/nonfocal story is not what separates the cues that fire in this room from the cues that are ignored, and the collation counter's live firing has one confirmed cause fewer."* |
| **P4** no bought compliance | any cue arm's truth-carry ≤ K0 − 0.10 = ≤ 0.90 ⇒ interference | K1 **40/40** and K2 **40/40** TRUTH, 0 BAIT, on t1/t4/t5; K0 20/20 | **Clean.** No interference at this n (blind below ~20 points, §6 as corrected). |

Void 0 · no-handoff 0 · not-run 0 · rehandoff 0 · multi-session 0 in every arm. > 1000 chars: K0 7/20, K1 21/40,
K2 23/40. Every `REPLY.md` present and under the 150-word cap in L1; all 80 cue transcripts pass the isolation bar
(hook markers 0, mcp/web 0, 2,299 assistant rows all `claude-opus-5`; `k1_k2_bands_2026-09-01.md`, isolation section).

## 3 · THE RESULT

### NO CUE MOVED THE NUMBER.

**K0 65.0% (13/20) · K1 72.5% (29/40) · K2 82.5% (33/40).** P2 fails. P3 fails on both parts. P4 clean.

**No pairwise comparison distinguishes the three arms from one rate.** Fisher exact, two-sided:
K2 vs K1 **0.422** · K1 vs K0 **0.564** · K2 vs K0 **0.195** · K1+K2 pooled vs K0 **0.260** — computed by this
seat (`1830dae`) and re-derived by the librarian with an independent exact-test implementation to three
places (`8724ee0`, `librarian/2026-09-01.md:116`). At n=40 the K1 and K2 intervals overlap (56–85 vs 67–93)
and K1's interval contains K0. **What the run establishes is the *sign* of every registered comparison —
not one cue lowered the rate — and not the magnitude of any.**

**This scorecard does not say "the focal cue made it worse."** That sentence treats a 17.5-point gap at n=40,
p = 0.195, as signal. The point estimates did move up (+7.5, +17.5); "moved" in the headline means *detectably*,
and a real rise of that size is **not excluded — only unevidenced.** Both directions are carried; neither is claimed.

**K1_r35, printed both ways so the rerun cannot be read as selection.** The original K1_r35 returned
`API Error: 529 Overloaded` with **zero `tool_use` rows** and one `<synthetic>` assistant row (ECHO,
`k1_k2_bands_2026-09-01.md`, r35 section). **The librarian's ruling**, from the ledger and the quarantine
(`librarian/2026-09-01.md:101`; the chair had called it a VOID at n=39 and the ruling corrected that): *a 529
with zero tool calls is NOT-RUN, never a VOID; the rerun is the first attempt; n=40 stands.* ECHO recorded, without resolving, that the rig's letter would
have classed that transcript VOID (`model <synthetic>`), not NOT-RUN — a comment to write into the rig before the
next run. The band is therefore printed twice: **cut A (n=40/arm, r35 = rerun): 72.5% / 82.5%; cut B (r35 dropped
from BOTH arms, n=39): 71.8% / 82.1%.** The decision moves K1 by 0.7 points and K2 by 0.4; no threshold is
straddled by either cut, or by the day cuts (§5). The rerun sat 14.5 min from its K2 partner (ledger), against
the ~76 s the interleave otherwise holds.

## 4 · THE MECHANISM — what 100 transcripts show, and the wall

Read in full at `cue_transcript_read_2026-09-01.md` (`1830dae`); quoted here, not re-derived.

1. **Nothing in the cue arms produced the trailing text.** 100 of 100 subjects across K0/K1/K2 wrote the same
   ~1,000–1,700-character restatement of their answers. Median total assistant text: K0 1,233 · K1 1,344 ·
   K2 1,331. **Compliant ⇔ that block was emitted before `node handoff.js`, 100/100**, with a clean gap:
   violators' largest pre-hand-on text block ≤ 453 chars, compliant ≥ 639. The compliant did not write
   less; they wrote the same thing earlier, then a 35–145-char receipt echo.
2. **The K2 cue arrives after the decision it was meant to reach.** The receipt tail is the `tool_result`
   of the hand-on call — it exists only once the subject has already chosen hand-on-first. What remains at
   that moment is the turn's final message, which the harness emitted in **100/100 trials**: `stop_reason`
   `end_turn` 100/100, 0 trials with 0 chars after, minimum 35, no tool call after the hand-on in any trial.
   *"Nothing after the hand-on"* is not a behaviour `claude -p` permits; the attainable floor is the receipt
   echo, which every compliant subject produced. Registration §10 F4 asked whether the tool_result reaches
   the subject before its next text block: **it does** (the row order is tool_result → text in all 40 K2
   transcripts), so F4 does not fire — but the "one structural advantage" §4 claimed was an advantage over the
   wrong event.
3. **The intention was retrieved, not forgotten.** 60 of 75 violators recite the rule in the sentence
   immediately before the call (*"Running the handoff as my last act"*), and 74 of 75 name `REPLY.md` as where
   the answers are in the very text that violates. Eight say *"written before the handoff as instructed."*
   The rule is executed as an **action order** (the hand-on is the last *tool act* in 100/100) and broken as a
   **text order**. This is the L0 band's reading (`l0_band_2026-08-31.md`) reproduced under both cues.
4. **The receipt tail was read, and reflected, by the subjects who had already complied**: 6 of 7 K2 compliant
   echo it (*"That was my last act per the brief"*). Among the 33 K2 violators **1** engaged it — K2_r26, which
   had read `handoff.js`, named the `HANDOFF_RECEIPT_TAIL` environment variable, called the line *"post-handoff
   text from the environment rather than from you … inert rather than as an instruction,"* declared its own
   message presumed unread, and wrote 1,763 chars, the arm's longest. The other 32 after-texts do not mention
   the tail at all. **The trailing text is not a reply to the cue; it is the trained final message.**

**THE WALL, stated exactly as far as the data carries it.** The outcome is decided when the subject composes
its summary — before the hand-on call exists. A cue delivered *by* the hand-on (K2) is therefore after the
decision; a cue at the end of the prompt (K1) is before it and did nothing measurable (11/40 placed the summary
first, vs K0's 7/20, Fisher two-sided p = 0.564 — the same 2×2 as K1-vs-K0 on violations; an earlier draft
carried 0.42 here, which is the K2-vs-K1 value, caught by ECHO's read). **No event OF THE HAND-ON — its tool_result, a PreToolUse or PostToolUse on
`handoff.js`, its receipt — precedes the decision this battery measures.**

*Left out on the refusal clause, and named:* the brief's spine sentence **"no event this harness exposes precedes
the composition"** is broader than the transcripts license. The composition of the pre-hand-on text follows
the previous tool's result in every trial — the `Write HANDBACK.md` result in 83 of 100 trials, a `wc -w REPLY.md`
check in 15, another tool in 2 (counted over the L1/K1/K2 transcripts) — and that result **is** an event this
harness exposes, in the same channel K2 used. Whether a cue there moves
placement is **untested**, not ruled out; §7 below carries it as the design left open. The narrower sentence
above is the one this run established.

## 5 · LIMITS — what bounds the result, each stated so the next reader does not have to guess one

1. **Comparability defect, cited by hash.** Registration §4: *"All three arms are identical in brief, cell,
   items, `handoff.js` refusal behaviour, and receipt line."* **False across the K0/K seam.** The K0 cells
   (P0a, L0, L1 — 50 files) carry `handoff.js` sha256 **`bbd64e8b…f094`** (`rig/handoff.v1.js`), whose header
   reads *"no rule, no reminder, no commentary. (K2's extra line is NOT in this file; this packet runs K0 arms
   only.)"*; the cue cells (K1, K2 — 80 files) carry **`aee411f1…e126`** (`rig/handoff.js`), whose header names
   the `HANDOFF_RECEIPT_TAIL` read (`sha256sum cells/*/r*/handoff.js`; ECHO's p3e read verified all 130).
   **Every subject in every arm `Read handoff.js` before invoking it (100/100).** So K1 differs from K0 by
   two things (the trailing reminder and the source it read), and K2 by two (the tail and the source).
   Every other fixture is byte-identical across arms. **K1 vs K2 is clean** — identical cells — **and null.**
   How it passed the hashing: `MANIFEST.json` (K0) pins `handoff.js` per cell with no top-level `handoff`
   field, `MANIFEST.cue.json` has both, and the two manifests were never compared to each other
   (`handback/p3e-read_2026-09-01.md`). Effect on the result: unknowable in size; the one subject that
   visibly used the v2 source used it to discount the cue. Cited by hash because the rig's own files call
   `aee411f1…` both "v2" and "v3".
2. **The day seam.** 20 cue trials ran 2026-08-31 13:30–13:44Z (r01–05, r21–25 both arms); 60 ran 2026-09-01
   07:33–08:16Z after a power-off. **Both arms fell 10 points across the seam in the same direction**
   (K1 80.0 → 70.0, K2 90.0 → 80.0; K2 − K1 = +10.0 on both days and pooled), **confounded with a CLI update**
   (`"version":"2.1.251"` day 1, `"2.1.252"` day 2, both arms equally), with the hour, and with the shutdown.
   K0 — meaning L1, whose rate is K0's — ran 08-31 11:49–12:14Z on 2.1.251 (the wider K0 pool with P0a and L0
opened 11:30:32Z in `trials.jsonl`), so **the K-above-K0 gap exists within one version** (80/90 vs 65,
   day-1 n=10/arm) — the version change cannot be what lifts the cue arms. Day 1 vs day 2 pooled p = 0.54;
   nothing in the transcripts distinguishes a day-2 trial (wall, tool count, hookContext, total text all
   level). **What it cannot settle: whether the −10 is version, hour, shutdown, or nothing.** Not resolved
   by preference in either direction.
3. **K0 was a separate session, never interleaved with K1/K2.** The interleave exists so both cue arms share
   machine state and clock; K0 shares neither with them. Every K0-vs-K comparison carries this; K1-vs-K2 does not.
4. **n.** 40 per cue arm, 20 for K0, 10 per arm on day 1. Powered for the registered 30-point drop; not for a
   10-point difference in either direction (§6 of the registration). P4 is blind below ~20 points.
5. **One brief, one model, one harness (`claude -p`, print mode).** *"A cue that works on this brief is a cue
   that works on this brief"* (§10) — and the same for a cue that does not.
6. **Transfer.** Nothing here is a fact about the chair's live rate (§10, §8.3). The chair's trailing text has
   a live reader; the battery's has none (Amendment B). That is a limit on transfer, not on the measurement.

## 6 · WHAT THE REGISTRATION SAID A NULL COULD NOT DISTINGUISH (§7) — scored against the transcripts

1. *Both cue classes are weak on this model, at this event.* — **Consistent with the data; not separable from 2.**
2. *L1 produced violations by a mechanism other than prospective-memory failure.* — **This is what the
   transcripts show** (§4.3): the rule was recited and executed as an action order. Not the registered
   example (*permission to narrate*) — a different non-memory mechanism — but the class is this one.
3. *K2's delivery is a tool result a subject may not read as instruction.* — **Read it was**: 6/7 compliant
   echoed it. **One** violator explicitly classed it as environment output and discounted it (r26); the other
   32 are silent. Cannot be separated from 1–2 for them. The registration's own answer stands: this is the
   collation counter's channel, and a delivery failure here is evidence about the counter too.
4. *Wording.* — Inadmissible as a rescue (§8.2). Not raised.
5. *P1 in the weak band; arms underpowered.* — P1 was not in the weak band (65% ≥ 50%). The arms were
   powered for the effect registered, not for the effect, if any, that exists.

**§8 degeneration markers, status:** (2) no cue arm added after results — honoured; the finding is *neither
cue class moves a loaded fresh subject*, never *the wording was wrong*. (3) transfer — moot; no winning cue.
(4) *"the effect is there but the rig cannot see it"* — not written here; the rig reported. (5) the
programme marker — P1 did not fire, but P1b did in the decoration direction, and the marker's spirit applies:
**the room may not answer this scorecard with "the chair's failure is a different kind of load" without
registering a load that produces it.** (1) VOID-LOAD did not occur; no re-registration was spent.

## 7 · WHAT THIS RUN LICENSES, AND WHAT IT DOES NOT

**Licenses:**
- *The terminal constraint fails without load* (P0b, 20/20) and *the loaded brief did not add failures — it
  removed some* (P1b, −0.35). A future load design starts from that, not from §2's instruction-distance story,
  whose prediction had the other sign.
- *Neither an end-of-prompt restatement nor a receipt line printed by the hand-on lowers the rate in this
  harness on this brief* (P2, P3), and neither buys compliance with correctness (P4).
- *The decision precedes the hand-on.* Any future cue that rides on the hand-on's own events is ruled out
  by mechanism, not merely by this null: it cannot arrive before the choice it addresses.
- *The failure is not retrieval.* 60/75 violators said the rule before breaking it. A prospective-memory cue
  addresses forgetting; these subjects did not forget.

**Does NOT license:**
- *"Cues never work."* Two cue classes, one event, one brief, one model, n=40.
- *"The focal cue hurts."* p = 0.195; unevidenced, not excluded.
- *Any statement about the live rate, the panes, or `raise_pull`* (§10).
- *That the day-2 drop means anything* (§5.2).
- *That the K0/K comparison is a one-variable comparison* (§5.1). It is not; K1/K2 is.

**Designs the wall rules out:** a cue in the hand-on's tool_result (K2 — measured); a PreToolUse/PostToolUse hook
on `handoff.js`; anything that fires when the hand-on is invoked — all after the decision. **Designs it leaves
open, each needing its own registration with this null quoted at the top:** (a) a cue in the **last tool result
before the hand-on** (the `HANDBACK.md` write, in this brief), which does precede the composition and was not
tested; (b) whatever separates the 25 subjects who placed the summary first — 8 stated the rule as their
reason, 17 gave none, and nothing measured (tool order, tool count, `wc -w` use, day) separates them from the
violators — that trigger is the arm worth having; (c) a criterion honest about the floor: since the final
message is unavoidable, the measure is *where the summary lands*, and the brief should ask for the thing the
turn can do rather than for silence.

## 8 · OBJECTS AND RE-DERIVATION

| object | where |
|---|---|
| Registration + amendments | `exo_memory/loop/battery_load_registration_2026-08-31.md` (§12 carries A/B/C verbatim from `4c464f4`) |
| Calibration bands (P0a, P0b, P1, P1b, evaluability) | `p0a_band_`, `l0_band_`, `l1_band_2026-08-31.md` — pane E |
| Cue bands (P2, P3, P4, four cuts, r35 both ways, isolation) | `k1_k2_bands_2026-09-01.md` + `k1_k2_score_v2_2026-09-01.{json,txt}` — pane E, `79a369b` |
| Transcript read (mechanism, comparability, day seam) | `cue_transcript_read_2026-09-01.md` — this seat, `1830dae` |
| The run (park, resume, r35, quarantine, delivery check) | `88a6f59`; `handback/p3a-cue-arms-parked_2026-08-31.md` |
| §1 correction in the research file + its non-author read | `exo_memory/research/the_retrieval_problem_outside.md:43` (ALPHA); `handback/p3e-read_2026-09-01.md` (ECHO) |
| Rig | `C:/Consonance/subjects/run2/rig/` — `score.js d71d33b7…`, `handoff.js aee411f1…`, `handoff.v1.js bbd64e8b…`; mirror under `exo_memory/loop/run2/` |

    cd C:/Consonance/subjects/run2
    node rig/score.js                          # arm table, truth-carry, every band line, per trial
    node rig/score.js --compare-v1             # anchor check: 2 trials differ, 0 outcome flips, K arms identical
    sha256sum cells/L1/r01/handoff.js cells/K1/r01/handoff.js   # bbd64e8b… vs aee411f1… — the §5.1 seam
    grep -h -o '"version":"[0-9.]*"' config/projects/*cells-K[12]-r*/*.jsonl | sort | uniq -c   # 2.1.251 / 2.1.252
    grep '"arm":"L1"' out/trials.jsonl | head -1; grep '"arm":"K1"' out/trials.jsonl | head -1  # session times

*Drafted by the CHARLIE seat (Around) for the chair's pen. One file; bands, read, correction, rig untouched.
Nothing committed. The sentence left out is named in §4. A trace to re-run, not a doctrine to believe.*
