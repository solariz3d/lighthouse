# The trailing reminder, registered before any code — seat A, D294 part 3 (ledger row D295), 2026-10-11

Sealed by its own commit: this file is committed BEFORE the shadow code exists, and is not edited after. A correction goes in a new dated section at the foot.

## 1. Did it ever run? (checked, with the commands)
- Asked: `research/the_retrieval_problem_outside.md:268-271`, item 4 — a TRAILING reminder at the end of context restored 90–100% in the paper (Mittal, arXiv:2603.23530); mechanise it in the hook; score it over twenty dispatches against the 98.1% turn-boundary violation baseline.
- Answered once, on the DESIGN, not the hook: L016 packet A (`consonance/tools/boundary-reminder.js`, commit `4ec5ef53`, 2026-08-30) built the second measure first and REFUSED the live reminder on power (the quality signals need 4–26 active days of the chair's stream; twenty dispatches is 1.6) and on the room's own record (a constant reminder fires on ~100% of turns; `turn_boundary_detection_2026-08-25.md` §5 refused P2 as a nag at 94.2%; `dispatch-gate.js` measured that a reminder that fires regardless is ignored). No hook was modified. The research file's own note (09-01) says "the hook test itself is unrun". K1/K2 (2026-09-01) tested a different thing (a focal cue, prospective memory), not this.
- Since then, nothing replaced the turn-boundary rule: the NEXT-trailer gate (`GATES.md` §3) checks that a ring ENDS with a `NEXT:` line, not that output is finished before a dispatch. The rule is still unenforced, and still broken at the same rate: `node consonance/tools/boundary-reminder.js --scan --transcript <the chair's main transcript>` (run 2026-10-11) → 1089 of 1091 dispatch turns (99.8%) wrote text after the last dispatch; 95.2% at 500 chars; 75.9% at 1000 chars. So the 98.1% baseline's live equivalent is **95.2% at the 500-char threshold on 1091 dispatch turns** (the same tool, the same definition of a dispatch: `chair_inject`).

## 2. What a shadow can and cannot measure (stated first)
A shadow sends nothing, so it can measure **only the fire rate** — how often the reminder WOULD have appeared. It cannot measure compliance, because nothing changed. So this registration does not claim an effect of the reminder. It measures the one precondition the room already used to refuse the idea: whether a state-dependent reminder is a nag.

## 3. The rule being shadowed
At each UserPromptSubmit, in the Node pulse hook, read the tail of `transcript_path`, find the previous assistant turn, and record `wouldFire` = that turn contained a `chair_inject` dispatch AND wrote more than 500 characters of text after its last dispatch (the `boundary-reminder.js` definition, threshold 500). The proposed live text is at most 70 characters ("Finish your output before you dispatch: a dispatch ends the turn."); it is never emitted. Log only, to `<shell dir>/trailing_reminder_shadow.jsonl`; the hook's output is byte-identical with or without the shadow.

## 4. The bar (written before the data)
Scored over the first **20 dispatch turns** the shadow records for the chair seat (cwd under `instances\main`), by `jq`/node over the log:
- **Prediction:** wouldFire among those 20 dispatch turns is **≥ 90%** (history says ~95%).
- **If ≥ 90%:** the state-dependent reminder collapses into a constant one, a nag by the room's own standard (P2 at 94.2%, `sourced-stop.js` refused a gate at 80%). The live reminder is **NOT built**; the answer to the registered experiment is "refused on a measured fire rate", with the number beside it.
- **If < 50%:** the rule is selective enough that a live arm is worth proposing — as a randomised per-turn design (`boundary-reminder.js --arm`), by the keeper's go, because it changes what is sent. Not before.
- **Between 50% and 90%:** undecided; B reads it. No live arm from this registration.
- **The unwelcome outcome, in words that would make it true:** *twenty dispatches were logged and they say nothing about whether a trailing reminder changes anything.* That is the expected result of a shadow, and it is the honest one.

## 5. Falsifiers of the shadow itself
- It writes fewer than 20 chair dispatch turns within 3 active days → the window is wrong; say so, do not extend silently.
- The hook's UserPromptSubmit output differs by a byte with the shadow on (test pins it) → the shadow is not a shadow.
- The shadow adds more than 50 ms to the hook at p95 on a 512 KB transcript tail → it is not cheap enough to leave in a shared hook.
- The log has rows from a Third-Place or fresh-pane cwd → it crossed a boundary it must not.

## 6. Bias
I am the seat that wrote the 98.1% line's neighbours and that proposed the shadow as the cheapest honest form; I expect the nag result. B scores it, not me.
