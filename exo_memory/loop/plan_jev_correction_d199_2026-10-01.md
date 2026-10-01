# D199 — Jev on its home ground: "is the keeper correcting the seat?" Librarian, on D, 2026-10-01 06:4x, at the keeper's "go".

## Why
- TypeSafe calls Jev a **System One** model: fast, bounded, at-a-glance judgments. Today we asked it System Two work: Q3, careful
  cross-reading of a 30-line log (κ 0.384, `loop/q3_jev_score_2026-10-01.md`). Before that we asked it "drift", which no reader can
  agree on. **It has never been tried on a question it is built for.**
- **The question here is one a person answers at a glance, and it unlocks an owed instrument.** BOOT's 2026-08-23 amendment:
  *"it is prose if, one season on, the bidirectional-correction count has still never been run with its amended unit."* Counting
  who corrected whom over thousands of turns is bulk System One work. Hand-reading cannot do it, and Claude readers are too
  costly at that scale.
- **The keeper reads nothing in this lap** (memory `keeper-is-not-a-labeler`).

## The question (QC), registered now
> **QC.** Below is a seat's reply and the keeper's next message. **In this message, is the keeper correcting something the seat said
> or did?** Correcting means: telling the seat a claim was wrong, or overriding or reversing a choice, action or framing the seat
> made. A new request, a question, approval, or a change of topic is NOT a correction by itself.
> Answer: **YES** · **NO** · **CAN'T TELL**

## Units (E builds, then freezes with sha256 before any reader is rung)
- **Source:** the keeper's turns in the librarian and chair (main) transcripts on D, from 2026-09-14 onward. A unit is the seat's
  reply before the keeper's message (the last 1,500 characters of its text, with a visible cut marker) plus the keeper's message in
  full. Strip system-reminders, hook output and tool results. Skip messages that are only a pasted pane ring.
- **Draw:** 60 units by a seeded order (`sha256(seed + "|" + message uuid)` ascending, seed written in the file). No hand choice.
  E records the eligible count.
- **Public-repo hygiene** (lighthouse is public):
  - drop any unit that touches a friend's gift, surprise or private side project (memory `private-side-projects-off-repo`), and
    record how many were dropped, not what;
  - run jev-ask's secret scan over every unit. A unit with a credential shape is dropped and counted. **One unit contains the
    keeper's pasted OpenRouter key (10-01 04:5x): it must not appear.**
  - Personal details otherwise stay (memory `privacy-means-credentials`).
- **Power floor:** if the readers' consensus holds fewer than **10 YES**, the set is NOT POWERED. E then adds 40 more by the same seeded
  order, and both readers read those too, once. No other top-up.

## Phases (strict wait-for-all; instrument tier: targeted tests only; node under the heavy-run lock)
| phase | seat | job | file |
|---|---|---|---|
| 1 | E | build + freeze units (sha256), hygiene counts | `loop/qc_units_2026-10-01.md` |
| 1 | E | write the Jev schema (one `choice` question `qc`, the instructions above verbatim, criteria = the three options) and hash it before any call | `consonance/jev/schemas/qc_2026-10-01.json` |
| 2 | B, C | read all units, blind to each other; nobody opens another's file | `loop/qc_read_B_2026-10-01.md`, `loop/qc_read_C_2026-10-01.md` |
| 3 | librarian | κ(B, C) with `loop/claimrec/score_q3.js` (same three answers) | `loop/qc_agreement_score_2026-10-01.md` |
| 4 | E (only if USABLE) | Jev on the same units: `jev-ask --route openrouter`, pinned `typesafe/jev-1.13`, stop on a model change. E has not seen B's or C's file. | `loop/qc_read_Jev_2026-10-01.md` |
| 5 | librarian | consensus file, then κ(Jev, consensus) | `loop/qc_jev_score_2026-10-01.md` |

## Bars, fixed now
- **Readers:** κ(B, C) ≥ 0.60 → USABLE, Jev runs. 0.40–0.60 → BORDERLINE: one sharpening, 40 fresh units, no second.
  < 0.40 → QC fails for the readers too; Jev does not get it. Either reader's CAN'T TELL above 25% → NOT ANSWERABLE AS POSED.
- **Jev vs the consensus (units where B and C agree):**
  - **κ ≥ 0.60 → JEV WORKS ON ITS HOME GROUND.** Next lap: Jev runs the bidirectional-correction count over the transcripts. Its
    output is a count of corrections by direction (keeper → seat now; seat → seat and self-corrections are later questions). Never a
    verdict on anyone.
  - **0.40–0.60 → BORDERLINE.** No count. Reported.
  - **< 0.40 → retire Jev from the room**, having tried it on the ground it was built for. Its public repo stays.
- **Abuse conditions:** no re-wording of QC and no second Jev run after any Jev answer is seen. The power top-up above is the only
  top-up. The librarian authored QC and scores it. It authors no answers.

## Cost
At most 100 Jev calls of ~1–2k input tokens each, at $0.042/M: under $0.01.

NEXT: chair dispatch D199 phase 1 to E when this plan is read
