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

---

# PACKET 2 · RULINGS BEFORE LANDING (09:3x, after A's build; the librarian's collation 1e944ac)

A built §4 as written, with no §6 stop: stick-waiter 73/0, stick-apply 27/0, tail-carry 129/0, cargo 664/1/4 where
the one is D's standing composer red (now `main.rs:15366`; it moves with edits).

    R-1  THE ADOPTION REGRESSION, A's §2.2. A close-and-reopen inside one waiter poll adopts the new pid. The
         adopted session's start time is unknown to the waiter, so its LEAVE files now read as stale, its exit takes
         the fallback, and the notice says the app "was stopped before its close window could run" — which is FALSE
         in that case.
         RULED: land as built, with ONE in-scope wording change (A). When the fallback runs because the start time
         is UNKNOWN — an adopted session, or a legacy file with no field — the notice says the close window was
         NOT CONFIRMED. It never says the app was stopped.
         A's option (i), a pid-keyed start-time file beside the waiter lock, read at adoption, is FILED AS
         P-LEAVE-3. It also serves §2.8 HELD (b), the seats that outlive a killed app.

    R-2  THE MIXED-BUILD WINDOW IS LIVE ON L, AND THE ORDER MATTERS. A made the flag optional, so an exe that writes
         LEAVE files without `appStartedAt` always falls to case d. D is outside the window (its exe predates
         99649d8). **L's exe was built 02:29:29 from a post-99649d8 tree and writes LEAVE files WITHOUT the field**
         (`librarian/2026-09-14.md:497`), so on L a pull that lands this waiter before a rebuild makes EVERY close
         with the stick take the fallback and show that notice.
         RULED: **on L, pull then REBUILD before the first close with the stick in.** It goes in the lap row and in
         the next L shift's first message. A did not look at L; this is from the record.

    KEPT, not this lap: `insert_pane` kills after the spawn, so one conversation has two resumes for a spawn's
    length on `pty_reopen`; `leave_cleanup` ignores the new field; the kills are not awaited; no real app has run
    any of it. The rebuild on D waits on the keeper's next close.

## PACKET 2 · B's READ (09:4x, collated 16b702a): nothing blocks landing, ONE sentence must change first

D-8 is closed for cases b, c, d and legacy files, and closed in the safe direction for adoption at R-1's cost. Both
hardenings do what B asked and break nothing found — a double wake of a fixed seat now kills the first claude.exe
instead of leaving it running. NOT CONFIRMED is true in all five branches that reach it.

    R-3  THE SENTENCE A KEPT IS FALSE IN TWO REACHABLE BRANCHES. "stopped before its close window could run" survives
         for the no-file case, but that case is also reached by (i) a close that ran and found no stick, after which
         the waiter finds one, and (ii) the applier hand-off when the waiter misses case a. A's two tests PIN it as
         true (stick-waiter.test.js:659, :743).
         RULED (A, now): use B's wording, which is true everywhere —
           "Consonance closed without a close record for this session, so this is the fallback save."
         Change the sentence and both asserts. The librarian re-derives; no third read. **A pin of a claim the code
         cannot support does not land.**

    FILED FOR P-LEAVE-3, three rows, not built now:
      1. the pid-keyed start-time file, read at adoption (A's option (i); also serves §2.8 HELD (b));
      2. B's race: the applier's relaunch inside the waiter's 2 s poll gives a false case-d export and adopts the new
         session with an unknown start time. Shape: stand down in case a when `stick-apply.result.json`'s `at` is
         later than the watched session's `appStartedAt`;
      3. THE EMPTY-STREAM CLASS: `cargo` is not on bash's PATH on D, so a bar run through a pipe returned nothing
         with exit 0. B nearly read it as a pass; A and the librarian hit it too. **Every bar run through a pipe
         must fail on an empty stream.**
