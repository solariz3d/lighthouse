# P-DIVERSITY-C1 + P-LEAVE-2 §1 · two packets in one lap, on disjoint files

**2026-09-15 ~09:05, on machine D.** The keeper, 08:42: "if you want to try finish the work we were doing you can
restart the loop where we ended or pick up from where we were." Work shape: the librarian's
(`librarian/2026-09-15.md`, 08:5x entry, 1019823).

---

# PACKET 1 · P-DIVERSITY-C1 — CHARLIE measures, ECHO reads. The registration's two pre-registration steps.

**The registration draft was amended BEFORE this packet:** `loop/anchor_similarity_registration_DRAFT_2026-09-15.md` §8
(b8c1113).
- The frozen text policy is 8.2.
- The polarity prediction is 8.3, written before any number.
- Measure against those sections exactly. **If a line of 8.2 cannot be implemented as written, stop and ring the
  librarian. Do not choose a variant.**

## 1 · CHARLIE

**Reinstall your own §4 procedure in your scratchpad on D, never the repo** (`handback/p-diversity-c0-C_2026-09-15.md`):
- `@huggingface/transformers` pinned at 4.2.0.
- `Alibaba-NLP/gte-base-en-v1.5`, q8.
- **The model file must read sha256 `e7f6af7a9457d4fdd3af220c68e9a37325aad7c2d306bbc855fe0d019c326509` at
  146,540,971 B.** That measures the keeper's byte-identical-on-both-machines condition. A different hash stops the
  lap. Report it, and compute nothing.
- Run with the network off (`allowRemoteModels=false`), with network attempts counted.

**P1 · polarity** (§8.1). Every text is read at the commit that landed it; name the sha:

    anchor   loop/packet_leave_window_2026-09-14.md @ed73e76          9,910 B
    B-read   handback/p-leave-read-B_2026-09-14.md                   16,050 B
    A        handback/p-leave-A_2026-09-14.md                        21,298 B
    E        handback/p-leave-E_2026-09-14.md                        35,743 B   (past 8,192 tokens)

For each of the three against the anchor, report:
- the primary score;
- both secondaries;
- the S40 stripped bytes;
- window and token counts;
- |m|.

Then say whether §8.3's prediction fires.

**P2 · scale** (§8.1). The briefed pairs landed this week, 09-14 and 09-15:
- **Pairs:** every packet under `loop/packet_*_2026-09-1[45].md` with the hand-backs its §HAND-BACK names.
- **For each hand-back:** its primary score to its own packet, minus its mean primary score to the other packets in
  the set.
- **Report** the whole distribution (n, min, quartiles, max) and each row with its paths.
- **Name any pair you excluded, and why.**

**Positive and negative controls first** (draft §4). A near-copy of the anchor must score above all three texts, and
an unrelated hand-back below them. If either fails, report INSTRUMENT FAILED and nothing else.

**No repo edits except your hand-back.** Install nothing in the repo.

## 2 · ECHO — read C's numbers before anyone rules on them

E wrote one of P1's texts (`p-leave-E`), but did not write the read that raised the question, did not write the
draft, and does not score.
- Re-run at least one P1 pair and three P2 rows from C's scratch artifacts, using C's own scripts and C's hash.
- Check that §8.2 was applied as frozen: S40 on both sides, the token-weighted window-pair primary, CLS and SEP.
- Say what C's numbers do NOT establish.

**Edit nothing.**

## 3 · HAND-BACKS

`exo_memory/handback/p-diversity-c1-<letter>_2026-09-15.md`, then `call_librarian` with the path.

---

# PACKET 2 · P-LEAVE-2 §1 — ALPHA, alone on these files this lap

**Files, A's this lap only:** `consonance/src-tauri/src/main.rs`, `consonance/src-tauri/src/sync_launch.rs`,
`dev/stick-waiter.js`, and their tests.
- E is on packet 1 as a reader and touches no code.
- The rebuild waits on the keeper's next close. **Do not rebuild or relaunch the app.**

## 4 · WHAT TO BUILD, each red-first

**(a) D-8, pid reuse** (`packet_leave_window_2026-09-14.md` §2.8 HELD (a)). Add an `appStartedAt` field (ISO) to
BOTH `stick-leave.started.json` and `stick-leave.result.json`, written by the app from its own recorded start time.
- The waiter matches a LEAVE file only when BOTH the pid AND `appStartedAt` equal the watched session's.
- The waiter learns the start time at launch: add it to its argv, beside `--app-pid`.
- A file with no `appStartedAt` (written by the old build) is treated as stale, never as a match.
- **Tests:** a surviving session-1 LEAVE_RESULT with the same pid and a different start time is NOT case b; the
  matching session IS case b; a legacy file with no field is stale.

**(b) B's two hardenings** (`handback/p-leave-read2-B_2026-09-14.md` §8, items 1 and 2):
1. In `spawn_claude_pane`, `try_clone_reader()?` and `take_writer()?` (`main.rs:1160-1161`) run after
   `spawn_command` (`:1095`). On either error, kill the child before returning, so no live claude.exe is left outside
   Panes.
2. `insert_pane` (`main.rs:939-945`, the map insert at `:942`): if a live session is already in the map under that
   pane id, kill it before it is replaced. It is reachable from `pty_reopen` (`:8015-8019`).
- **Test each** with the injection style E used for B2-1.

**Not this lap:** §2.8 HELD (b) — seats outliving a killed app. It needs the app to publish seat pids for the waiter,
and that is its own design.

**Bars:**
- `cargo test --bin consonance -- --test-threads=1`, where D's known red is `ready_signal_tests::a_slash_command…`
  (main.rs:15124);
- `node dev/stick-waiter.test.js`;
- mutants on a COPY (`--only` exists now);
- what you did NOT verify.

`exo_memory/handback/p-leave2-A_2026-09-15.md`, then `call_librarian` with the path. **B reads it before landing.**

---

**§6, verbatim from L059:** if a line of your packet cannot be built as written, **STOP building on it, write down
why in your hand-back, and ring the librarian then.** Do not build around it.
