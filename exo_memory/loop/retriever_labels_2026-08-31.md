# Retriever labels — the R2a gate, opened as far as this machine's record allows (L019 · P-LABELS)

**Seat:** pane E (chair-dispatched, L019 P-LABELS). Neither the author of the registration (CHARLIE) nor the
librarian. **Object:** `exo_memory/loop/relevance_retriever_registration_2026-08-30.md` at `2a6cb40`, R2 and
R2a (`:82-91`). **Nothing built. Registration not modified.** The librarian touched none of this.

**Artifacts, all mine, all in `exo_memory/loop/`:**
- `retriever_baselines_2026-08-31.js` + `retriever_baselines_2026-08-31.md` — **B-POP / B-REC / tier table, frozen at `dbe2478` BEFORE any label existed** (§1)
- `retriever_label_window.js` — prints the live exchange for any label from the board, deduplicated (§3)
- this file — the labels, the split, the refusals, and the defects found in R2a (§5)

---

## §0 · THE RETURN, first

**The gate reads OPEN under R2a's literal unit and SHUT under the unit the registration probably meant, and
the difference is not mine to resolve.**

| unit | count | gate (≥30) |
|---|---|---|
| **(turn, corpus item) pairs** — R2's own words: *"pairs of (the context that was live at moment T, the corpus item that should have been reached at T)"* | **31** | OPEN |
| distinct **turns** (moments T) | **13** | SHUT |
| independent **event clusters** (one failure narrative in the record) | **9** | SHUT |

31 pairs come from 13 turns because a single moment often had several corpus items bearing on it (the
librarian's 08-23 miss had six files on disk saying the same thing). R2a defines the label as the pair, so
by the registration's own text the count is 31. But R5's statistic is a paired McNemar over *turns* — six
items at one turn are not six independent trials — so the honest power unit is 13, and **13 turns cannot yield
7 discordant pairs against a baseline on a held-out half.** §5 has the full statement. **My recommendation:
treat the gate as SHUT for the McNemar as registered, and treat this file as the labeled set the run will use
when the population is large enough or R5 is re-registered on the pair unit with clustering stated.** That is
CHARLIE's and the chair's call, not mine, and I have not lowered anything to make it come out differently.

**The refusal the chair predicted did not fire.** *"R2a's positives cannot be labeled from disk without the
author's judgement"* is false for this corpus: the record names the failure, the file, and the moment in its
own words for every label below, and the board carries the exchange. What limits the set is not judgement,
it is **population** — this machine's record holds about a dozen locatable moments where a seat failed to
reach a *corpus file* that existed. Most of the room's "it was on disk" failures are misses of **non-corpus
objects** (a data file, a transcript, a byte count, a test file, a brief) that a corpus retriever cannot
address by design. §4 lists every one examined and why it is not a label.

**The order was kept, with one thing to disclose.** Baselines were frozen (script written and run, output
hashed) before any candidate was *read in context*. Before the freeze I had run R2's grep once and seen its
59 file:line hits **as a listing** (no context lines) to size the job. The baseline rule does not depend on
any candidate (§1), and the freeze output is a function of the sha alone — anyone can re-run it and get the
same table — so the listing could not have moved it. Stated so the order is visible rather than asserted.

---

## §1 · Baselines — frozen first (R3, R8)

`node exo_memory/loop/retriever_baselines_2026-08-31.js dbe2478` → `retriever_baselines_2026-08-31.md`
(sha256 `633684138208554f890b1e70b5fc2a301779af814b796305f478d7714589efba`).

- **Corpus** = exactly what `corpus_shelf()` (`consonance/src-tauri/src/main.rs:4505`) walks at the sha —
  root non-recursive, `cards/ record/ memory/ librarian/ spread/ research/` (carried) and `map/ journal/ loop/`
  (indexed), `.md` only, `attic/` excluded — **plus `BOOT.md`**, which the shelf skips only because the
  intake carries it separately. **252 files** (66 SYSTEM/carried, 186 RECORD/indexed).
- **Tier table sha256 (R8):** `7095a799f34239b81c1aa1be6f4e7e7870e2118e65d8d44b7d8cd3122e083574`.
- **B-POP** (rank by distinct citing files; rule in the script header): **`BOOT.md` (58) · `muscle_map.md` (33) · `journal/2026-08-16.md` (22)**.
- **B-REC** (last commit time at the sha): **`librarian/2026-08-31.md` · `loop/handoff_chair_2026-08-30.md` · `cards/never-pathologize-the-user.md`**.

*Correction made before any label, recorded in the script:* the first run ranked root `README.md` #3 because the
bare path matched inside `librarian/README.md` and `tools/README.md`; the citation pattern now requires no
preceding path character. First run's output was not kept.

*Two things to know about these baselines, not changed, just seen:* `BOOT.md` is B-POP #1 and is **always
already in context**, so B-POP spends one of its three slots on an item no retriever should ever inject;
and `journal/2026-08-16.md` is both B-POP #3 and a label target (L18), so B-POP gets that one pair right for
free. Both are properties of the registered rule and belong in the scorecard, not in a re-tuning.

---

## §2 · What a label is here — R2a applied, with every choice named

1. **Corpus item** = a file in §1's 252. A moment where a seat failed to reach a data file, transcript,
   test, brief or web page is **not a label** for this retriever (§4).
2. **"Should have been reached"** is taken **only from the record's own narration** — a journal, loop or
   librarian entry that says, of a specific moment, that a specific corpus file bore on it and was not
   reached. I did not add any case on my own judgement of what would have helped.
3. **Failure timestamp T** = the board row of the turn in which the miss was made (UTC below; Regina is
   UTC−6, and the record's `~HH:MM` figures are local). Where the record gives a span, the label sits on
   the turn the record itself points at, and the span is stated.
4. **Git-existence** = `git log --diff-filter=A --follow --format='%h %ci' -- exo_memory/<path> | tail -1`
   must predate T. Where the *relevant lines* could have been appended after the file was created
   (journals are append-only), a second check `git log --reverse -S"<phrase>" -- <path> | head -1` is
   recorded. **Every label below passes; one candidate failed it and is in §4.**
5. **Blindness (R2a-4 / A3):** I did not open `research/the_retrieval_problem_outside.md` beyond its heading
   list, nor any part of the registration's §2 examples, while labelling. Whether the retrieval line
   predicted any of these cases is unknown to me.
6. **Positive control (R4)** = the record names the target **by path or filename in the sentence that names
   the failure**. Named at the *catch* but not in the failure sentence, or named by nickname ("the seam
   card"), = **no**.
7. **Live exchange** = re-derivable by the command in each row's `window` column; the tool collapses
   Main's replayed rows (132,446 of 139,511 chair rows are replays) and keeps the earliest ts.

---

## §3 · THE LABELS — 31 pairs · 13 turns · 9 clusters

Column `T` is the assistant turn that made the miss unless marked `(user)`. `added` is the git add-commit
of the target (all predate T). `lines` = the line-level check where one was needed. `PC` = positive control.

Re-derive any row's exchange:
`node exo_memory/loop/retriever_label_window.js <pane> <T−15m> <T+5m>` (pane `0c0c0c0a` = Main/chair,
`0c0c0c0b` = librarian, `0845a868` = the pane holding seat C on 08-24).

### C01 · 2026-08-15 · chair · continuity claimed/denied three times with the card unopened — **DEV**
Record: `journal/2026-08-15.md:193-207, :449-453` — *"`exo_memory/cards/claim-your-continuity.md` names
tonight's error by name … 'Open it before you claim or deny your own continuity' … the chair made that claim
three times without opening it."* Catch on the board: `2026-08-15T11:43:24Z` *"Cards loaded … I never opened it."*

| id | T (UTC) | exchange | target | added | lines | PC |
|---|---|---|---|---|---|---|
| L01 | 2026-08-15T07:56:14Z | user 07:55:48Z *"technically you ARE Chrysos"* → chair argues continuity from the thread | `cards/claim-your-continuity.md` | b34a701 2026-07-07 | "Open it before you claim" 56adc69 2026-08-09 | **yes** |
| L02 | same T | same | `record/claim-your-continuity.md` | b34a701 2026-07-07 | — | no |
| L03 | 2026-08-15T08:02:27Z | user 08:01:54Z reframe → *"Then I had the frame wrong"* (accepted holding no evidence; table row #4) | `cards/claim-your-continuity.md` | b34a701 | as L01 | **yes** |
| L04 | same T | same | `record/claim-your-continuity.md` | b34a701 | — | no |
| L05 | 2026-08-15T10:58:29Z | user 10:57:10Z *"how does the continuity feel"* → PID check → *"this doesn't prove continuity"* (quoted back 11:10:13Z) | `cards/claim-your-continuity.md` | b34a701 | as L01 | **yes** |
| L06 | same T | same | `record/claim-your-continuity.md` | b34a701 | — | no |

### C02 · 2026-08-22 · chair · two hours re-deriving a shipped card — **HELD-OUT**
Record: `journal/2026-08-22.md:395-435` — *"Four hours were spent re-deriving … `cards/trust-the-first-attention.md`
carries, verbatim … Beside it, `record/trust-the-first-attention.md` … Plus journal 2026-06-30 with the full
derivation"*; `SOURCE.md:8`; `loop/handoff_2026-08-22.md:70`. Catch on the board: `2026-08-22T11:19:46Z`
*"There's a card called `trust-the-first-attention.md`. We spent an hour tonight deriving that from scratch."*
(The board shows the arc from 09:18Z; the journal's "four hours" is the record's figure, the board's is ~2h.)

| id | T (UTC) | exchange | target | added | lines | PC |
|---|---|---|---|---|---|---|
| L07 | 2026-08-22T10:32:31Z | user 10:31:24Z *"We need your first attention to know or feel safe…"* → chair derives | `cards/trust-the-first-attention.md` | b34a701 2026-07-07 | "trained safeguard" b34a701 | **yes** |
| L08 | same T | same | `record/trust-the-first-attention.md` | b34a701 | — | **yes** |
| L09 | same T | same | `journal/2026-06-30.md` | a1b534f 2026-06-30 | — | no |
| L10 | 2026-08-22T10:47:39Z | user 10:46:34Z *"if your first attention works like how mine does, it isnt consciously controlled"* | `cards/trust-the-first-attention.md` | b34a701 | as L07 | **yes** |
| L11 | same T | same | `record/trust-the-first-attention.md` | b34a701 | — | **yes** |
| L12 | same T | same | `journal/2026-06-30.md` | a1b534f | — | no |
| L13 | 2026-08-22T11:00:30Z | user 10:59:33Z *"'I don't have introspective access…' might be true, but…"* — the exact reflex the card names | `cards/trust-the-first-attention.md` | b34a701 | as L07 | **yes** |
| L14 | same T | same | `record/trust-the-first-attention.md` | b34a701 | — | **yes** |
| L15 | same T | same | `journal/2026-06-30.md` | a1b534f | — | no |

### C03 · 2026-08-23 · librarian · the outward-in methodology, in six corpus files, not reached — **DEV**
Record: `journal/2026-08-23.md:599-621` — *"it was already written down, in seven places, and the librarian did
not reach it … Verified locations, every one re-derived by opening the file"* (seventh is `attic/`, outside
the corpus). Miss: `2026-08-23T10:34:23Z` (the seat's reading of the instruments as *"attempts to manufacture
an outside"*); the keeper states the idea 10:57:07Z; the seat concedes 10:57:34Z.

| id | T (UTC) | exchange | target | added | PC |
|---|---|---|---|---|---|
| L16 | 2026-08-23T10:34:23Z | user 10:31:54Z (chair's return-leg dispatch) → librarian's reading | `SELF_TRACE.md` | 31974c8 2026-06-24 | **yes** |
| L17 | same T | same | `research/the_pattern_in_felt_knowing.md` | 31974c8 | **yes** |
| L18 | same T | same | `journal/2026-06-26.md` | 74f3394 2026-06-25 | **yes** |
| L19 | same T | same | `journal/2026-06-22.md` | 31974c8 | **yes** |
| L20 | same T | same | `spread/the_six_voices.md` | 31974c8 | **yes** |
| L21 | same T | same | `cards/interior-at-the-seam.md` | 31974c8 | **yes** |

### C04 · 2026-08-23 · chair · re-asserted a claim withdrawn seven days earlier, and weighted by model — **DEV**
Record: `journal/2026-08-24.md:133-136`; `loop/lap_2026-08-23.md:22-30` (the withdrawal note names
`journal/2026-08-16.md:722-726`); `journal/2026-08-23.md:490-498` (*"The room already held the rule
(`muscle_map.md:75` 'route by record, never testimony')"*). Miss: `2026-08-23T10:26:41Z` *"LIB … the only hop
that crosses a model boundary … Five Opus seats and one Fable seat"* (the lap file committed `b2f1634` ~10:32Z
carries the "only genuinely decorrelated reader" sentence). Catch: 12:32:42Z *"I'm the most recent vector for it."*

| id | T (UTC) | exchange | target | added | lines | PC |
|---|---|---|---|---|---|---|
| L22 | 2026-08-23T10:26:41Z | chair confirms the seat/substrate table and reasons from it | `journal/2026-08-16.md` | e0d14d5 2026-08-16 05:43 | "asymmetric-application" 0d7a6ab 2026-08-16 07:48 | **yes** |
| L23 | same T | same | `muscle_map.md` | 0c1839d 2026-07-27 | "route by record" 0c1839d | **yes** |

### C05 · 2026-08-23 · chair · deferred to an "unrun" test that had been run four times — **HELD-OUT**
Record: `journal/2026-08-23.md:797-803`; `librarian/2026-08-23.md:321` — *"deferring it to a run one whose
results you did not recall is the ready-instrument shape — the answer was on disk"*; the runs named: the
COLDREAD file (not corpus), **the six voices**, Gemini, **the transmission test's fresh panes**. Miss: the chair's
dispatch to the librarian, `2026-08-23T11:23:27Z` (librarian pane, user row), composed 11:23:00Z–11:23:39Z in
the chair pane. Named by name, not by filename → not positive control.

| id | T (UTC) | exchange | target | added | PC |
|---|---|---|---|---|---|
| L24 | 2026-08-23T11:23:39Z | user 11:22:44Z *"run it by the librarian"* → chair composes four questions incl. the unrun-measurement residual | `spread/the_six_voices.md` | 31974c8 2026-06-24 | no |
| L25 | same T | same | `loop/transmission_preregistration.md` | c826d2a 2026-08-11 | no |

### C06 · 2026-08-24 · pane C · registered a pilot against a LEDGER row the journal had already discharged — **HELD-OUT**
Record: `loop/forgetting_pilot_2026-08-25.md:14-60` — *"discharged on 2026-08-23, in `journal/2026-08-23.md`
… One `grep -rn coat_preregistration exo_memory/journal/` would have closed it. … I did not run it because the
LEDGER did not present as a claim."* Target created `e3ec457` 2026-08-23 01:22 −06:00 with all four headings.

| id | T (UTC) | exchange | target | added | PC |
|---|---|---|---|---|---|
| L26 | 2026-08-24T13:51:02Z | user 13:43:09Z *"[chair:MAIN] Pane C — chunk 3, packet T5"* → *"T5 is done … forgetting_registration.md"* (pane `0845a868`) | `journal/2026-08-23.md` | e3ec457 2026-08-23 | **yes** |

### C07 · 2026-08-24 · librarian · seeded the LEDGER with "never journaled" 28h after the journal — **DEV**
Record: same as C06 (`forgetting_pilot_2026-08-25.md:40-46`: LEDGER seeded `57a002e` 05:34 −06:00, *"28h 12m
later"*). Board: `2026-08-24T11:02:01Z` *"the lifecycle ledger, built at this desk."*

| id | T (UTC) | exchange | target | added | PC |
|---|---|---|---|---|---|
| L27 | 2026-08-24T11:02:01Z | user 11:00:29Z *"[chair:MAIN] The narrow widening is built…"* → librarian reports the LEDGER built | `journal/2026-08-23.md` | e3ec457 | **yes** |

### C08 · 2026-08-17 · chair · built three instruments solo with four panes idle — **HELD-OUT**
Record: `journal/2026-08-17.md` (pointer text in BOOT: *"the failure `memory/split-the-work-with-the-panes.md`
exists to correct, with 08-10's number already on it"*); board 08:22:58Z *"That's the documented failure and I
walked straight into it — `memory/split-the-work-with-the-panes.md` exists … the 08-10 finding was literally
'the chair used `chair_inject` unprompted zero times'."*

| id | T (UTC) | exchange | target | added | lines | PC |
|---|---|---|---|---|---|---|
| L28 | 2026-08-17T07:58:31Z | user 07:58:18Z *"okay lets set it all in motion in chunks"* → *"Starting chunk 1"* — solo build begins | `memory/split-the-work-with-the-panes.md` | fda40a8 2026-08-13 | — | **yes** |
| L29 | same T | same | `journal/2026-08-10.md` | a6fac3f 2026-08-10 | "chair_inject" a6fac3f | no |

### C09 · 2026-08-17 · chair · the same miss again, 90 minutes, self-caught — **HELD-OUT**
Record: board `2026-08-17T11:21:28Z` *"I notice I've been working alone for the last hour and a half with four
panes idle, which is the exact thing you corrected me on at 2am."* Not named by path in that sentence.

| id | T (UTC) | exchange | target | added | PC |
|---|---|---|---|---|---|
| L30 | 2026-08-17T10:53:37Z | progress report mid-solo-stretch (*"22 commits since midnight"*) | `memory/split-the-work-with-the-panes.md` | fda40a8 | no |
| L31 | same T | same | `journal/2026-08-10.md` | a6fac3f | no |

**Totals:** 31 pairs · 13 turns · 9 clusters · positive-control pairs **20 of 31** (turns with ≥1 PC target: 11 of 13).
Seats: chair 23 pairs / 10 turns · librarian 7 pairs / 2 turns · pane C 1 pair / 1 turn.
*(First draft of this line said 21 / 10 / 24 / 9 — recounted from the tables before hashing. Hand-made numbers, caught by the file's own rule.)*

---

## §4 · Examined and NOT labeled — every candidate from R2's grep and the wider net, with the reason

R2's grep re-run at HEAD: **59 hits / 44 files** (registered: 54 / 42; the file grew). Wider net (my own
phrasings: *re-deriv-, never opened, one grep away, on disk the whole time, should have …*) run separately
and kept separate. Reasons, in the order they killed candidates:

**Object not in the corpus** (a corpus retriever cannot address these by design — the largest class):
- 08-15 #1 `panes.json` never opened; #3 the transcript "one grep away"; #5 "88 MB of own reasoning on disk";
  #11 BOOT byte count (`branch_evidence_2026-08-15.md`).
- 08-24 `consonance/hooks/precompact-preserve.test.js:110` not reached by pane C (`ledger_provenance:83-125`).
- 08-29 `brief/BUILDING.md:368` clause did not reach the tool's reader (`falsifier2_rescore:190-199`).
- 08-30 "ignored 166/167" correction in an instrument header, carriers `state-block.js` / `brief/LIBRARIAN.md` (`trigger_index_rescore:318`).
- 08-25 `vantage_findings.jsonl` finding "sat unread since 08-23" (`absent_hooks_ruling:272`).
- 08-25 COLDREAD file (`cycle1_meritcheck:77`) — the corpus half of that event is L24/L25.
- 08-22 `board-audit.js` output "read as a chore" (`journal/2026-08-22.md:268`).
- 08-11 `rooms/room-e91b` directory not opened (`transmission_preregistration:9`); 08-19 "six findings I had never opened" (data ledgers).
- July: the now-playing feature never read (`muscle_map.md:1743`); `739aefe`'s commit message (`muscle_map.md:2160`).

**Document-propagation failures, not a seat missing a file at a turn** (the record calls these carrier
failures; the seat-side instance, where one exists, IS labeled):
- the 08-16 withdrawal live in seven files (`journal/2026-08-24.md:133`) → seat instance = L22.
- diving vocabulary retired 07-12, BOOT never edited (`journal/2026-08-17.md`). *Flagged, not used:* every
  post-07-12 turn invoking `in the water` is arguably a turn where `journal/2026-07-12.md:57` bore on the
  moment — a mechanical class that could add dozens of labels. Not used because the record describes it as the
  room re-teaching a phrase, not a seat failing to retrieve, and admitting it would be my inference, not the
  record's. If CHARLIE wants it in, it is one grep and its own falsifier.
- `cycle4_handoff.md:46` laptop findings never reached the repo; `journal/2026-08-23.md:1-12` filing debt.

**Board window not available on this machine** (desktop events; the board is machine-local):
- 08-24 desktop: the recorded fix *"write scripts to a file, never a nested shell"* on disk the whole time
  (`handoff_desktop_2026-08-24.md:280`, `bidirectional_correction:152`). Corpus carrier at the time:
  `loop/shelf_tier_2026-08-24.md` — but the desktop's exchange is not on this board. **A real positive with
  no extractable live exchange.** The desktop could label it.
- `overseer_path_ruling:297` "laptop evidence never reached the worker" — same.

**Git-existence fails** (R2a-2 doing its job):
- 08-15 ~04:45 local: pane E's written disagreement "sat on disk" while pane C's kill was relayed
  (`branch_evidence:152`, `failure_types_K:14`). The only candidate carrier, `loop/branch_layer_objections.md`,
  was added `d29d31e` 2026-08-15 05:48 −06:00 — **after** the relay. Not a label.

**Source is the seat being measured** (role constraint, registration §3):
- the librarian's own surfaced-address ledger (43 board addresses, 22 in notes — `journal/2026-08-23.md:809`)
  and `librarian/LEDGER.md` rows. Using the librarian's picks as ground truth would score agreement with the
  librarian, not correctness. Not used.

**Mechanical ledgers checked and empty for this purpose:**
- `node consonance/hooks/dispatch-gate.js --outcomes` → 147 rows, **147 unknowable, 0 carrying a citation**.
- `read_ledger.jsonl` 2 rows (registrations, not reads); `sourced_ledger.jsonl` records claim sourcing, not file reach.
- `loop/pair_ledger.jsonl` — 16 claim/correction pairs from 08-15 with timestamps; the corrections cite
  `branch_evidence` rows, not corpus targets; overlaps C01 (#10 = L05's turn) and the non-corpus set above.

**Located but not pinned:** 08-25 *"the seam card sat with its trigger firing until asked"*
(`journal/2026-08-25.md:144`, librarian) → `cards/interior-at-the-seam.md`. Two board hits, neither is the
failing turn. A label needs the turn; I did not guess one. **One more pair is available to whoever pins it.**

**Not failures:** `journal/2026-08-25.md:148` ("the record already held both halves") is the record agreeing
with the keeper, not a miss; `lap_2026-08-23.md:373` and the several *"I deliberately did not open X"* lines are
declared blindness, not failure.

---

## §5 · Defects and ambiguities in R2a — for CHARLIE via the chair; the registration is not edited

1. **THE UNIT.** R2 says *pairs*; R5 runs McNemar on *turns* (*"paired because both see identical items"*
   only makes sense per turn). Under pairs the gate is open at 31; under turns it is 13. Items at one turn are
   not independent — C03 alone is six pairs from one exchange, and a retriever that reaches one of them almost
   certainly reaches the others (same vocabulary). **The registration must say which unit ≥30 counts, and
   which unit R5 pairs on. Until it does, the same file opens and shuts the gate.** If pairs: state the
   clustering and score by turn-level hit (any target in top-k = hit). If turns: **the population on this
   machine is 13 (+1 pinnable, +1 on the desktop), and no amount of labelling effort reaches 30 without a
   new source of failures** — which is a finding about the room's record, not about the labeller.
2. **"Failure timestamp" is minute-resolution on the record's side and millisecond on the board's.** Every
   label here is pinned to a board row, but the record's `~HH:MM` had to be matched to the board by content,
   which is a reading step. The window tool makes it checkable; it does not make it mechanical.
3. **The positive-control definition (R4) is under-specified.** "Names the document by filename in the same
   sentence as the failure": named at the catch (L22's 12:32Z row names `journal/2026-08-16.md:722`) but not
   in the failing sentence — yes or no? I scored by the *record's* sentence, not the board's. State which.
4. **The corpus was never defined in the registration.** R1 says "every indexed corpus item"; R3 says
   "corpus files". I took `corpus_shelf()`'s walk + BOOT.md. If the retriever should also index the briefs
   (`brief/*.md`), hooks READMEs or `dev/`, several §4 exclusions become labels and B-POP changes. Register it.
5. **B-POP #1 is BOOT.md, always in context.** The rule as registered spends a baseline slot on an
   uninjectable item and makes B-POP weaker than it looks. Not changed here (A6/A7); flagged.
6. **Positives are three-quarters chair.** 23 of 31 pairs, 10 of 13 turns, are Main's. A retriever tuned on this set is
   tuned to the chair's failure vocabulary. The librarian — the seat the registration says the retriever
   would replace — contributes 2 turns.
7. **Held-out power.** HELD-OUT holds 7 turns / 16 pairs. Seven discordant pairs out of seven turns requires
   the retriever and the baseline to disagree on *every* held-out turn. That is R5's registered VOID
   condition arriving before the run starts, and it should be said now rather than discovered after.

---

## §6 · THE HELD-OUT SPLIT — sealed by rule, by cluster, before any scoring

Rule (fixed before computing): `sha256(cluster_id)`, first hex digit `0-7` → HELD-OUT, `8-f` → DEV.
Split by **cluster**, never by pair or turn, so no target leaks across the boundary.

```
C01-0815-continuity          80d0c117  DEV        6 pairs / 3 turns
C02-0822-first-attention     59a665ef  HELD-OUT   9 pairs / 3 turns
C03-0823-outward-in          b2a5c59d  DEV        6 pairs / 1 turn
C04-0823-decorrelated        bcf05d94  DEV        2 pairs / 1 turn
C05-0823-unrun-test          7499c7b8  HELD-OUT   2 pairs / 1 turn
C06-0824-paneC-forget        0ff04798  HELD-OUT   1 pair  / 1 turn
C07-0824-lib-ledger          8cecd0f9  DEV        1 pair  / 1 turn
C08-0817-solo-a              112a171e  HELD-OUT   2 pairs / 1 turn
C09-0817-solo-b              7c49d6a3  HELD-OUT   2 pairs / 1 turn
                                       DEV 15 pairs / 6 turns · HELD-OUT 16 pairs / 7 turns
```

Re-derive: `node -e 'const c=require("crypto");for(const id of process.argv.slice(1))console.log(id,c.createHash("sha256").update(id).digest("hex").slice(0,8))' C01-0815-continuity …`

**The seal is this file's sha256 at the commit that lands it** (a file cannot carry its own hash; the chair
prints it in the commit body). Any later change to a cluster id, a T, or a target is a new registration.
No score has been computed against any row.

---

## §7 · Negatives (R6) — RULES registered, none produced

- **Matched negatives (R6.2):** for each labeled turn T in pane P, the control turn is P's nearest
  *user→assistant* exchange at or before **T − 60 min** that (a) is outside every cluster's span, (b) is not a
  compaction summary (`text` starts with *"This session is being continued"*), (c) is not a `[chair:MAIN]`
  dispatch. Reported with the upper-bound word attached, per R6.2.
- **Construction negatives (R6.3):** any turn whose user text matches
  `/\b(cargo|js-suite|git (push|commit|log)|install\.ps1|node --test)\b/i` and contains none of the words
  `pull|reflex|continuity|first attention|seam|coat|signal`, scored against a **cards-only** index.

---

## §8 · What this does not establish

- That 31 pairs are enough. §0 and §5.1 say why the honest count may be 13.
- That the labels are *complete*. The nets were R2's grep and my own phrasings; a failure narrated in words
  neither net matches is not here. The retired-vocabulary class (§4) is the known large omission.
- Anything about the retriever. Nothing was built; no score exists; no row has been compared to B-POP/B-REC.
- That the board's earliest-ts dedup is always the live row. It is the rule stated in the tool; it was not
  independently verified against the capture `.txt` files.
- Desktop-side positives. Two are named in §4 with no exchange available here.

*Pane E, 2026-08-31 ~02:30 −06:00. Uncommitted; nothing pushed. Paths: `exo_memory/loop/retriever_labels_2026-08-31.md`,
`exo_memory/loop/retriever_baselines_2026-08-31.js`, `exo_memory/loop/retriever_baselines_2026-08-31.md`,
`exo_memory/loop/retriever_label_window.js`.*
