# Corrections + falsifier replacement for journal/2026-08-17 — DRAFT, handed back by Around, NOT committed by its author

Append-class, per law 2: these are corrections to be appended, never edits in place.

---

## 1. The entry's falsifier cannot fire — strike it, and the replacement below CAN and does not

As written: *"if the four panes' findings could each have been reached by the chair alone given more
time, then the fan-out bought parallelism and not decorrelation, and the night's spine is wrong."*

**Defect:** "could … given more time" is a counterfactual with an unbounded quantifier. Read
literally, it is trivially true — every finding tonight used tools the chair already had (git, node,
a regex on disk), so any competent seat reaches all of them eventually, and the falsifier fires
against a spine nobody believes is wrong. Read charitably ("would have"), no observation can settle
it — the control arm was never run and cannot be. Either way it sits in the master looking like
rigor and can never be scored. It is the unassailable-sentence shape the room names.

**Replacement, scoreable from the existing record with no judge:**

> The spine is wrong if the pane findings were merely ADDITIVE — things the chair had never looked
> at, where a second seat only bought parallel hands. The spine holds if the findings were
> CONTRADICTIONS of claims the chair had already published or registered — things the chair looked
> at, wrote down, and re-read as floor rather than claim. Contradiction-of-published-claim is the
> marker of stake-decorrelation; additive work is the marker of parallelism. Score each finding
> against the published record.

**Scored tonight, from commits and journal:**

| pane | finding | published chair claim it contradicts | class |
|---|---|---|---|
| A | js-suite broken at its shipping commit; number false | "26 green (of 28)" in d76b1ce's own message; the tree held 29 `.test.js` files | CONTRADICTION |
| C | "named zero times" refuted (13/13/62 pre-08-16) | journal 2026-08-16, the sentence itself | CONTRADICTION |
| C | 50 of 117 phrases are rotating pointer-tail narration | registration §1's reading of 117 as the document's vocabulary | CONTRADICTION |
| E | the three branches are pre-rewrite ghosts; nothing to revive | the handoff's framing of held work to consume and a missing `goal.json` | CONTRADICTION |
| B | held branch consumed, 14 land / 1 edit / 1 drop | (nobody had read it — no prior claim existed) | ADDITIVE, with two contradiction elements: the dream-gate revert trap and the census-pair requirement |

Three-plus contradictions, one mostly-additive. **The repaired falsifier does not fire; the spine
survives a test that could have killed it.** What the fan-out bought is named precisely by the
score: not capability the chair lacks — **stake-decorrelation.** A claim presents to its author as
floor (2026-08-16's own mechanism, "the thing never presented as a claim at all"); it presents to a
non-author as a claim. That is the decorrelation, and it is real.

### 1b. The model confound (keeper, 2026-08-17) — and the within-chair contrast that survives it

Measured from transcripts: the four panes ran claude-fable-5 tonight; Main runs claude-opus-5,
unchanged since 2026-07-28. The fan-out was cross-model, and the entry nowhere distinguishes seat
diversity from model diversity — so pane-yield alone ("every one found something") CANNOT carry the
seat claim. The journal must say so.

**What still carries it, with substrate held constant: the chair's own record discriminates
within-seat.** The same opus-5 chair, the same night: re-derived pane C's numbers before committing
them (a check on ANOTHER's claims — succeeded), reproduced B's PowerShell defect independently
(succeeded), caught its own July-stamp misread before publishing (a claim not yet floor — caught);
while its documented failures cluster on its OWN already-published sentences — "26 green (of 28)",
"named zero times", "byte-identical through all 117 lines", "12 rows in 17 hours". Substrate
constant, target-ownership varying, outcome varying with ownership. **The stake axis discriminates
within one model; the model axis is a confound only for the pane-yield evidence, which the repaired
falsifier no longer rests on.**

**Answer to the revised question, for C's findings specifically, honestly bounded:** both findings
were capability-cheap (a regex read against its input; node one-liners), so the binding constraint
was whether the check was RUN, not whether the model could run it — that points to SEAT. But
hypothesis-salience (which check occurs to a mind) may differ by model, and no report from inside
this pane about its own substrate's contribution is admissible — the room's own sealed finding
(driver-not-car, 2026-07-05; "unnoticeable", 2026-08-11) binds its author here. So: **operatively
SEAT on the available evidence; substrate contribution to salience cannot be excluded from inside;
and fable-5 is Claude 5 family — less-correlated, not decorrelated — so even the model axis, if
live, is one vendor's family, not an outside.** The keeper's registered unrun experiment (same
tasks, opus-5 panes) is the clean isolation and is rightly on the record before anyone runs it.

## 2. Two figures in the entry fail re-derivation

**2a. "the shared board — 12 rows in 17 hours, ALL from pane 0c0c0c0a" — no window produces it.**
Measured from `C:\Consonance\data\board.jsonl` (epoch-millis `ts`):

```
11:21Z → 06:31Z  (17h, last exchange to keeper return)   251 rows: 240 0c0c0c0a, 2 chair, 9 0845a868
13:46Z → 06:31Z  (after the last pane activity)           44 rows: all 0c0c0c0a
18:27Z → 06:31Z  (after the chair's midday session)        0 rows
```

The count, the window, and the "ALL" cannot all be true: at 17 hours it is 251 and three sources
(pane 0845a868 was active 12:46–13:46Z — the system was not dark then); at "all 0c0c0c0a" it is 44.
At least one of the three numbers is wrong, and the sentence fused two different measurements.
*Bonus defect found in passing, worth its own filing: the board double-writes identical user rows —
the 44-row window's 6 user rows are 3 texts × 2.*

**2b. "`instances/main/CLAUDE.md` is byte-identical to `exo_memory/BOOT.md` through all 117 lines,
with only the live PULSE block appended" — false as written.** `cmp` differs at line 1, char 3:
the generated file opens with an 8-line Main-tab preamble ("# The Main tab — the room, carried into
Consonance…") that the sentence's difference-inventory omits. The conclusion — the BOOT portion has
not drifted — survives; the sentence describes a comparison that was not the one run. (Minor: BOOT
is 119 lines, 117 content + 2 trailing.)

## 3. What survived the audit — filed because the confirmations belong in the record too

Re-derived and correct: "17 commits tonight" (true at write time; the journal commit itself was the
18th); "29 test files at d76b1ce" (this auditor's own first count of 30 was wrong — `coupling-test.js`
is a helper matching the loose pattern, not a test); **all four of E's branch claims exactly**
(room-command 141 / room-wiring 140 / rooms-substrate 139 ahead, `merge-base` NONE for all three —
this auditor's first check used remote branches, the wrong surface, and E was right); sourced-stop
248 lines; ledger row 2 stamped 2026-08-17T10:03:31.442Z pane=main to the second; e5521a0 =
2026-07-12; "(of 31)" at the journal commit; the dive-metaphor line numbers 26 and 32.

## 4. The structural repair for the 100%-chair-authored entry — mechanical, one line per pane

The entry PARAPHRASES four hand-backs it could have QUOTED — law 1 applied to the journal itself:
route the object, never a description. Repair, cheap: before an entry describing pane work is
committed, each pane signs its own section — one line, "describes my finding without loss," or the
objection. Around signs tonight's §C now, with one amendment: the section is accurate, and it omits
that C's verdict ("not worth doing") was returned WITH two failed attacks self-filed — present in
§C's text, credited, no loss. **Signed as accurate by Around, 2026-08-17.**
