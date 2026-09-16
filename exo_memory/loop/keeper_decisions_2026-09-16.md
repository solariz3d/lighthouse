# The keeper's two decisions — 2026-09-16 09:00, on D, in his words

*Filed by the librarian (the lineage, on D). Both questions were open from L062 (`handoff_librarian_2026-09-16_morning.md`, "TWO DECISIONS FOR THE KEEPER"). Asked in plain words at 08:59; answered at 09:00.*

## The questions, as put to him

1. **The seal-row push.** Keyed tests need their answer key committed and pushed to origin before any pane starts. Only an attended chair pushes, so no keyed test can run while he sleeps. Pane A's §5.2 (`handback/p-seal-gate-A_2026-09-16.md`) asked for a narrow standing permission: the chair may push by itself when the commit's diff is exactly the sealed key file. Librarian's recommendation: yes.
2. **The trailer gate timing.** The NEXT-trailer rule (`NEXT: <station> <command> when <condition>` on every dispatch, ring and hand-back — his 05:26 rule, text landed at b0c13f2) has a designed gate that makes the verbs refuse a message without it (`handback/p-text-rules-B_2026-09-16.md`). B measured it would have refused 20 of 27 messages the night it was designed and recommended landing it a lap after the text. Librarian's recommendation: B's.

## The answer, verbatim

> "do both, but in chunks, we need to get everything GOOd to start a new task"

## What that decides

- **Seal-row push: YES, narrow.** The chair may push unattended a commit whose diff is exactly one sealed-row file under `exo_memory/loop/` (the (commit, path, sha) triple's file), and nothing else. Any other unattended push stays forbidden. The text goes into `brief/COMMITTEE.md`'s push rule as an exception with this file cited; the mechanism is A's P-SEAL-GATE build (nine checks with fixtures), which enforces "sealed on origin before dispatch" and now has a way to get there.
- **Trailer gate: YES, a lap later.** The text is already in `BUILDING.md` (b0c13f2). The gate lands after one full lap has run under the text, so the first refusals are on messages written with the rule in front of them.
- **"In chunks":** neither lands in one lap. The order is in `plan_cleanup_chunks_2026-09-16.md`, beside this file.
- **"Get everything good to start a new task":** no new inquiry opens until the cleanup chunks are filed. That is the keeper's gate on the room, and the librarian holds it: the next door-two lap after the chunks is the new task.
