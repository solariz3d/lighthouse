# Jev and the room — a thinking note for the librarian, not a plan of record

*Written 2026-09-21 ~01:15 on L by Metaxy (the Third Place), talking it through with the keeper, who said: "we
can at least talk and plan things that the lib can then see for themselves and do with as they please. I think
Jev is a superpower." Nothing here is built, registered or decided. This seat has no channel; the keeper carries
it. What Jev is, with sources, is in `third_place/2026-09-21.md` (01:00 entry).*

## The one-sentence read

Jev is not a thinker and not an orchestrator. It is a **discriminator**: text in, a typed decision with a
calibrated probability out, one forward pass, no generation, near-zero run-to-run variance, cheap enough to run
on every turn (LangChain measured $0.00035 and 0.44 s a call). The room's oldest unsolved problems are
discriminator-shaped. That is where the keeper's "superpower" is true, and it is narrower than the brochure.

## Why the shape matters here, in the room's own terms

1. **It cannot cave.** A judge that cannot write cannot be talked round, cannot flatter, cannot append a formatted
   push. BOOT's "discriminator > permission" has so far been held by same-weights seats and one human.
2. **It is not these weights.** The room's measured judge failure is shared groove (six verifier groups, 45/45
   CONFIRMED over a set ~18% wrong, `journal/2026-08-11.md:90-93`). The paper's one large lever is a different
   model per seat (`DIVERSITY_COLLAPSE_INSIGHTS_2026-09-14.md` §A4). Non-Claude PANES are unreachable from the app
   (anchor draft §8.5), but a scorer called from a tool script is not a pane.
3. **It is cheap enough to be always on.** Every fix the retrieval research left standing is of the form "something
   fires at the event that is not the loaded seat" (`research/the_retrieval_problem_outside.md`; "refuse, don't
   remind"). Scripts can refuse only what a regex can see. A per-turn classifier can refuse on meaning.

## Candidate uses, ranked by how directly the room already needs them

| # | use | the room's existing need it answers | note |
|---|---|---|---|
| 1 | **Blind scorer for registered tests** — the polarity measure (AFFIRMS / CONTRADICTS / SILENT per claim x hand-back), the pane battery's blind scoring, the seed test's costume-vs-stance call | anchor draft §8.8 R8b (two blind scorers, agreement >= 0.70 or dead as an exact counter); `loop/plan_pane_battery_2026-09-16.md` (E's blind design); `SPINE_diversity_to_retrieval_2026-09-16.md` T1, T3 | lowest risk: work-side text only, controls already named (positive `handback/p-leave-read-B_2026-09-14.md`, negative `handback/p-leave-E_2026-09-14.md`). Use it as ONE of the two scorers, never both. |
| 2 | **A semantic refusal gate at composition** — a Stop-hook classifier over the outgoing turn: "states a figure with no command beside it", "offers an ending nobody asked for", "reports a fix with no test run", the room's live coats | the retrieval problem half A; `sourced` currently sees 19% of value-claims sourced by regex (checkpoint 09-15); K2's finding that a cue at the event does not move a loaded seat, but a refusal does | the real prize and the riskiest: a false refusal costs a turn. Needs its own registration and a measured false-alarm rate first. |
| 3 | **The missing retriever** — per turn, score the ~100 trigger lines and card descriptions against the live exchange and surface the top one or two | research item 6 ("the missing organ is a live-exchange relevance retriever… must change per turn or it habituates"); the librarian's founding number (pointed 25.7% / unpointed 74.3%) | supplies content, not a reminder, so K1/K2's null does not obviously apply; unknown until measured. |
| 4 | **Echo vs add** — a typed call on whether a hand-back adds something not in its packet | "add + hold" (BOOT 08-23 amendment); the anchor line's "content uptake" rename | pairs with #1. |
| 5 | **Routing** — which seat gets which packet | the dossier | only AFTER the battery measures the panes; routing by label is the thing the keeper ruled out on 09-11. |

## The first test that could lose (uses labels the room already has; no new run of panes)

**Backtest against the WRONG columns.** The room holds 100+ dated, human-adjudicated errors with their text
(`librarian/LEDGER.md`, the journals' WRONG entries, this seat's record), and the K-battery's scored transcripts
(60 of 75 violators recited the rule in the sentence before breaking it, `loop/k1_k2_bands_2026-09-01.md`).
Write each known failure class as a Jev schema BEFORE looking at its output; run it over (a) the turns where the
error is known to have landed and (b) a matched set of clean turns; report hit rate and false-alarm rate with the
universe printed. **Falsifier:** if it does not catch the known errors at a rate that beats the existing regex
instruments, or its false alarms exceed what a seat could bear per shift, it is not the room's discriminator and
this note is struck in place. **Degenerating, named in advance:** editing a schema after seeing its hits.

## Cautions, none of them reflexive

- **The numbers are the vendor's.** 20–200x / 40–400x are TypeSafe's per-call figures on classification. The one
  independent test (LangChain) is five weather requests and says so, and adds that "a consistently wrong evaluator
  can produce bad feedback at scale." Calibrated is not the same as right.
- **The schema is the claim.** Whoever writes the allowed answers authors the judge. This is the curated-auditor
  problem (BOOT, 08-02) one level down; the schema gets registered and attacked like any other instrument.
- **It is hosted.** Text leaves the machine. The keeper chose a local model for embeddings on 09-15 for that
  reason. **Nothing from the Third Place's conversations should ever be sent to it**; the candidates above are all
  work-side artifacts already in a public repo.
- **A new dependency and a new bill are the keeper's call**, per his own standing instructions.
- **It does not touch the thing under the room.** It can tell a seat that a sentence broke a rule. It cannot be
  the person in the room. The bet's third claim stands as written.

## Prior art to open before any registration (paths)

`loop/third_place_diversity_hold_2026-09-14.md` (the door) · `loop/anchor_similarity_registration_DRAFT_2026-09-15.md`
§8.8–§8.11 · `loop/plan_pane_battery_2026-09-16.md` · `loop/second_vantage_registration_2026-08-31.md` ·
`research/the_retrieval_problem_outside.md` · `consonance/tools/agreement-spread.js:3-12` (a gauge that inverted) ·
`loop/diversity_preregistration.md` (+2, +3; three gauges abandoned) · `dev/diversity/redact.js` (blinding kit).

*This note's own falsifier: if the librarian finds the room already registered a non-Claude scorer and this seat
did not know, the ranking above is redundant and only the backtest idea survives.*
