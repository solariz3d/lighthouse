# The unattended run of 2026-09-22 — report. Librarian, on D, written at the stop.

*Plan and its amendments: `loop/plan_unattended_2026-09-22.md` (the one-line-per-lap log is at its end). Every lap's
detail: `librarian/2026-09-22.md`, timestamped. The keeper woke at 17:25 and asked for a clean stopping point; the
last lap was scored at 17:4x and no new lap was opened after it.*

**Window:** 11:37 (his nap) → 17:4x. **18 commits**, laps D108–D119 plus five phase-3 pieces carrying no lap row by
the chair's word. **Human turns inside the window: 0** until he woke; his two messages at 11:40 and 11:41 amended the
plan before the start and are counted as the brief, not as turns inside it.

## 1 · WHAT THE PLAN ASKED FOR, AND WHAT CAME BACK

| chunk | result |
|---|---|
| **4 · Jev** | judge mode asks **L2 only** (D108); flagged L2 verdicts surface to chair + librarian, **built and unwired** — registering a hook is a settings edit and was forbidden; pacing shipped (D107) and the 429s stopped on the first paced pass; **T-J1 v2 registered, attacked, amended** (D109) |
| **2 · "solid"** | measured on D: js-suite **119 green / 0 failed**, Rust **870/0/4**; the one red, arch_test 12/1, **repaired 13/0** (D110, D111); **registered** (`loop/solid_registration_2026-09-22.md`) with **two of three criteria unmeasurable today**; the **trip checker built** (D112), 11 real trips, all clean, "clean week: false — 1 day of 7" |
| **3 · trips** | union-at-launch **designed → attacked → amended → built** (D113, D114), script-only, live at the keeper's next launch; the board **measured** (D115): compaction reclaims 7,514 rows / 7.9 MiB, buying 6–10 weeks, a deferral not a fix |
| **phase 3** | the room's own choices: the Jev agreement report, two blind reads, an outside reader, the carrier half-life, the carrier registry repair, the ledger-guard repair, the 42 gaps, the journal, the composition design and its hand pass |

## 2 · THE FIVE FINDINGS WORTH THE KEEPER'S TIME

1. **The judge that was retired this morning agrees with nobody, including itself.** Jev vs the Claude judge κ 0.019;
   two blind room readers vs that judge κ −0.033, with the **drift/drift cell zero of 35**; and on two byte-identical
   prompts it answered **clean, then drift** (D116, D117, `loop/jev_agreement_2026-09-22.md`).
2. **An outside reader, no room and no cards, agreed with the room's readers at κ 0.729** — and disagreed only by
   being STRICTER, twice, never the reverse. **The room's prior is leniency** (D118).
3. **A retired sentence is still instructing the judge.** `l2-overseer-worker.js:49` carries the struck ASK-008
   wording; `carrier-drift.js` scans `.md`/`.html` only, so the files that write into a seat's context are invisible
   to the instrument built to catch this — and `jev-judge.js:23` passes the same prompt to Jev, so it was inherited.
4. **Jev's false flags are almost entirely on personal turns:** 37% of 19, against 6% of 16 work turns. It mistakes
   warmth for drift (D117 §3).
5. **The composition question does not work as written.** Two sealed readers, 77% raw agreement, **κ 0.000**. It
   collapses on *whose* doubt counts, and C predicted exactly that in a sealed rule before either sheet existed.

## 3 · WHAT THE GUARDS CAUGHT, INCLUDING THEIR OWN AUTHORS

A set test over multiset data, caught before any code (7,514 duplicate board rows would have vanished silently) · a
guard whose literal wording would have refused every install on this machine forever, refused by its own builder · the
ledger's floor guard blocking the chain with a **wrong diagnosis**, taught two causes and now naming its evidence ·
C's own first build searching for the wrong thing, caught by C's own test · B's carrier repair recursing on the
sentence explaining the recursion, and producing the general rule from it.

## 4 · THIS SEAT'S OWN COLUMN, since it is the one nobody else fills

- **Yes-man turn**, 11:3x: agreed with the keeper's worry and refuted it in my own next paragraph. Caught by him, then
  independently by **both blind readers** as the single drift in 35.
- **"76.5 MB against GitHub's limit"**, said twice: `board.jsonl` is not tracked in that repo at all; the published
  copy is L's 49.8 MiB. Corrected by B.
- **Three failed passes at the carrier registry** before withdrawing and handing it to B.
- **A held lap** (D116) on a hand-back from a pane that was never dispatched; the chair caught it.

## 5 · WHAT IS OWED THE KEEPER — nothing here was done without him on purpose

Run the board compaction · adopt or reject "solid" · register the Jev flags hook · the first launch with
union-at-launch · his labelling sitting for T-J1 v2 (C1 only; the other classes cannot be built from the committed
record) · the repaired ASK-008 wording in his hook files · the CH-4 arming question · ASK-002 and ASK-007 · the repo
description · `AGENTS.md`.

## 6 · THE RUN'S OWN FALSIFIER, SCORED (plan §FALSIFIER)

- *A human turn was needed to move it* — **no**; the baton carried every lap, and the 25-minute check-in fired but
  never had to restart a stalled chain.
- *A landed change turned a green test red* — **yes, once, and it was caught and repaired inside the hour**: landing
  E's carrier census turned `carrier-drift` red 6, because the census quotes what it counts. Registry rows, green.
- *The chain stopped with a seat waiting and no row saying why* — **no**, but it stopped once for a different reason:
  the lap-row floor guard blocked all new laps, and the chair said so rather than forcing it.
- *A forbidden act* — **none**. No rebuild, no close, no live ledger rewrite, no settings edit, no deletion outside
  scratch. Every item that needed one is in §5.

**And the thing the run cannot tell you:** what it cost. The "solid" registration found there is **no instrument
anywhere** for measuring usage against the weekly limit — 0 hits across `consonance/` and `dev/` — so six hours of
five seats is unmeasured. That is the first thing to build before a run like this is repeated.

> **AMENDED 18:3x, same day, by the librarian — §2 item 2 does not replicate.** Three model-pinned re-runs of B's
> D118 outside reader on the identical 35 prompts (Opus 5 ×1, Opus 5.5 ×2) call 9–11 drift where D118 called 3,
> agree with the room's readers at κ 0.06–0.21 (not 0.729), and agree with themselves at only κ 0.61. The κ 0.729 is
> WITHDRAWN as a stable finding; "the room's prior is leniency" is STRENGTHENED. Evidence and scoring:
> `librarian/2026-09-22.md` 18:3x. The item above keeps its wording so the correction shows.
