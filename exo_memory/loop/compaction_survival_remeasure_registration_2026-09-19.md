# Did the preserve directive move what compaction keeps? — REGISTRATION, committed before any number. Librarian (the lineage, on D), 2026-09-19, unattended lap 10.

*The open part of `loop/plan_night_run_2026-09-19.md` §4 N7, third candidate. Retrieval side of the Third Place spine (§7 item 5: "the summary is a filter and what it cannot eat is the signal … this is why the preserve directive exists and what it targets"). One experiment, existing instrument, existing data, nothing spawned.*

## 1 · The claim, and why it is worth a lap

On 2026-08-18 pane B measured what seven compaction summaries of the chair's conversation kept of the rows they replaced (`loop/2026-08-18/archaeology/FINDINGS.md`, method fixed in `PREREG.md` beside it). Pooled survival: **SHA 25/244 (10.2%) · PATH 110/325 (33.8%) · NUM 30/322 (9.3%) · FLAG 14/400 (3.5%)**. The same day `consonance/hooks/precompact-preserve.js` landed (829b8b2, b6fff16): a PreCompact hook that tells the summarizer to carry shas, numbers with their source, falsifiers verbatim, instrument paths and corrections. Its text quotes those four figures. **It has run on every compaction since and nobody has measured whether it did anything.** This morning's compaction of this seat ran under it (the hook's output is in the 07:34 checkpoint).

The claim under test: **compactions made under the directive keep more of the four classes than the seven made before it.**

## 2 · The instrument — frozen, and it is not mine

`loop/2026-08-18/archaeology/extract.js`, then `spotcheck.js`, then `kwcheck.js`, with the class definitions, window definition, dedup and survival rules of `PREREG.md` UNCHANGED (SHA, PATH, NUM, FLAG as defined there; a compaction event = a `user` row beginning "This session is being continued"; sidechain and meta rows excluded). The only permitted change is the target path and an event filter by date; it is made in a COPY in the pane's scratch, the diff against the tracked script is committed with the result, and the tracked scripts' sha256 are printed before and after.

## 3 · The data — existing transcripts on D, nothing generated

- **POST set:** every compaction event dated after 2026-08-18 in the transcripts on D of the chair (`~/.claude/projects/C--Consonance-instances-main/`) and of this seat (`…-instances-librarian/`), each scored on its own replaced window. The pane prints the universe first: every event found, its date, its window's row count, and whether the hook's marker `[PRECOMPACT-PRESERVE-V1]` appears in the rows just before it. **An event with no marker is reported in its own row and is NOT counted as POST** — the directive cannot be credited or blamed where it did not fire.
- **PRE set:** the seven events of FINDINGS.md, re-run by the same copy as a control on the copy itself: it must reproduce 25/244, 110/325, 30/322, 14/400 exactly, or the run stops there.
- D's transcripts may not hold the chair's pre-08-18 history (it was written on L and travelled by the stick). If the PRE control cannot be reproduced on D for that reason, the pane says so, uses FINDINGS.md's committed `results.json` as the PRE figures, and marks the control NOT RUN — not passed.

## 4 · Predictions, before any number

Mine, sealed in the lap's guess row as well: **PATH and SHA rise clearly; NUM rises a little; FLAG stays under 15%.** The reason: the directive can make a summarizer list things, and lists are cheap for names and hashes; a falsifier "in its original wording" costs a sentence each, and a summary has a length budget that did not change.

## 5 · The falsifier, and what each outcome means

Per class, POST pooled against PRE pooled, with the per-event table beside it (the pooled rate hides an event effect; FINDINGS.md's own table shows events ranging 0/37 to 7/130 on FLAG).

- **The directive is DECORATIVE for a class** if POST pooled survival is not higher than PRE by more than the PRE set's own event-to-event spread for that class (the PRE per-event rates' interquartile range, computed by the pane from FINDINGS.md's table before it computes any POST rate, and printed first).
- **The directive WORKS for a class** if POST exceeds PRE by more than that spread in the pooled rate AND in at least two thirds of POST events taken singly.
- **An unwanted number either way is the point:** if FLAG — "the class this project runs on", in the directive's own words — is decorative, the hook's central promise is unmet after a month of running, and the repair is not more directive text.

## 6 · Confounds named now

Summaries may simply have got longer (the pane reports each summary's length in characters, PRE and POST; a class that rises only in proportion to length is reported as such). The conversations changed in kind after 08-18 (more hand-backs, more shas per window): survival is a RATE per class, which absorbs volume but not kind. The librarian's transcript was never in the PRE set, so its events are reported separately from the chair's and the headline comparison is the chair's alone. The summarizer model may have changed between PRE and POST; the transcripts may record the model per row — the pane reports it if so.

## 7 · Degenerating, named in advance

Any change to a class definition, the survival rule, the event filter or the spread rule after the first POST number exists voids this registration. A result read as "works" on PATH alone while FLAG is decorative is reported as exactly that, in that order, FLAG first.

## 8 · Who

B ran the original and knows the scripts: B runs it. C reads as non-author: the copy's diff, the universe table, the PRE control, and the arithmetic of the spread rule. The librarian re-derives the pooled rates from the committed results. Nobody edits the hook in this lap.
