# Plan: the room stretch on D, 2026-11-13. The order, collated from the room-better swarm

Librarian, on D, 09:5x local. For him to say yes or no to, part by part. Nothing here is dispatched yet except where it says so.

**His words that set it** (`briefs/lighthouse_the_room.md`): 07:12 on L, "continued work on lighthouse/consonance on the desktop
when we get home"; 09:36 on D, "really make sure you attack the right and most needed vector".

**What it is collated from** (all in `loop/room_better_2026-11-13/` unless named):
- twelve reader files, each with a second reader; `00_critic.md` (read whole by me);
- `00_build_paths.md`, `00_lean_seats.md`, `00_not_worth_it.md`, each now with a second reader's corrections struck in place
  (119, 21 and 61 lines checked; 6, 3 and 6 wrong);
- `in_wake.md` and `out_memory_at_wake.md`, read whole by me;
- `loop/hooks_drift_D_2026-11-13.md`; `loop/effort_before_after_count_2026-11-13.md`;
- the room-work list in `loop/handoff_lighthouse_2026-11-13-L.md`.

## The swarm's registered falsifier, scored by me (`loop/plan_room_better_swarm_2026-11-13.md`, "Registered before it runs")

- "names no fault that is not already in the L handoff": **did not fire.** Checked by me at the primary: the shelf was built
  before the pull (`stat` of this seat's `CLAUDE.md`: 08:42:42; `git reflog`: the pull at 08:43:40; 0 hits for a HEAD stamp);
  the notes cap is 24,000 bytes (`main.rs:8928`). Re-derived by a second reader, not by me: the cold wake's share of spend, and
  idle compaction meeting the keep-warm minute. None of these is in the L handoff.
- "names no mechanism to remove": **did not fire, weakly.** After its second reader, one item stands (D's stale second-reader
  copy, and that is a sync). Its strongest call, removing `stop.js`, was wrong: three live hooks read what it writes.

## The vector: the wake (the first minute after a seat starts, resumes or compacts)

Why this one: `librarian/2026-11-13.md`, the 09:4x entry "THE VECTOR". In short: the shelf was a machine-shift stale; busy days
never fit the cap; a resume carries no state; every compaction summary ends "pick up the last task"; the record answers when a
seat looks (about 33 of 34 on 11-03) and the worst arm never opened a file; three wakes in three days were turned only by his
question. On cost, a second reader's re-derivation: the cold wake alone was 46.4 % of the last day's weighted spend, 69.1 % with
the model switch (an assumption about relative price, not the plan's accounting).

## Lap W, the wake. PARKED AT HIS WORD since 11-12; needs his word to start

| part | what | where | proving check, red on a recorded case first |
|---|---|---|---|
| W1 | The shelf is built after the pull; it carries a line with the HEAD it was built from and how far origin is ahead. The seat's newest note's first screen and one pinned file come ahead of the 24,000-byte cap | `consonance/src-tauri/src/main.rs` (`corpus_shelf`, `:8928-8993`); the launch path | today's case: intake 08:42:42, pull 08:43:40; a 65,000-byte note is named and not carried |
| W2 | The compaction directive gains the room-side class (the 11-12 plan's (a)): his words about the room or the seat, letters, catches about the seat, open questions, each with its path. Its two stale lines are corrected | `consonance/hooks/precompact-preserve.js` (`:111-113`, `:131`) | `grep -c 'any of the five above'` is 1 today |
| W3 | A body line at every start, resume included: machine, model, effort if it can be read, context size, HEAD, the shelf's age. One line, not the 3,000-character state block (whose worth is unproven either way) | `consonance/hooks/sessionstart-state.js` or the shelf's header | a resume today prints none (136 resume rows skipped since 11-01) |
| W4 | A gate: a seat's first dispatch after a wake is refused until it has opened its own newest note and the other machine's newest handoff. Cues have failed here (K2); gates have held (the NEXT trailer) | a PreToolUse hook on `call_chair`, reading the session's own tool calls | this morning's transcript: a dispatch at 14:46Z with neither file opened |
| W5 | Why no pull ran at this morning's launch: find the launch path used, then fix it or make it say so | `consonance/launch.ps1` (the pull block), the four paths it names as not covered | 307 commits behind at 08:43 |

- **Its falsifier is already registered** (`loop/plan_retrieval_at_the_wake_2026-11-12.md:49-52`): after it ships, the first reply
  to an open, non-work question after each of the next two wakes is read from the transcript. If either names nothing of the room
  beyond the handoff without a further prompt, it failed as an input change.
- **Rebuild and restart:** W1 is Rust, so it needs one rebuild of Consonance and one restart. The app's code has not changed since
  the 11-08 build, so nothing else rides on that restart yet. Before it: count queued messages with no delivery row, and check no
  lock is held (`00_critic.md`, check 2).
- **Proposed panes** (his word first): W2, W3, W4 to P after its mutant run (hooks and node tests, no build lock); W1 and W5 to B,
  which built the room's tools on L, between its kit builds.

## Lap C, what the wake costs. Each line is his call

1. **The model is chosen before a seat's first request**, not after it wakes. Today's switch of two seats rewrote their contexts
   (1.18 M to 2.49 M units, depending on which model was meant).
2. **Idle compaction against his no-cut word.** The harness compacts a seat about 55 minutes after its last call; 29 of 40
   compactions since 11-03 were idle ones. Either every seat's keep-warm ping moves before minute 54, or idle compaction is turned
   off in settings, or he rules that the default stands.
3. **Keep-warm woke a seat idle for nine and a half days** (one reply, 642,636 tokens written). The skip rule is fixed.
4. **A warm compaction at the close of a day, or a fresh seat from its handoff,** instead of resuming 500k to 930k cold. Per seat,
   at his word only (`memory no-cut-without-his-word`).
5. **D's second-reader hook** is the 10-01 copy. Syncing it applies this seat's ruling of 11-03 (pane rings are no longer second
   read), which saves about 2.4 M tokens per ten days on D and stops 237 reads that flagged 116. His veto was left open then.
6. **His 09:02 lean, xhigh for the librarian, the chair and the Third Place.** The owed count found no effect of effort on the
   panes that it could tell from noise, and no clean case exists for the three. If he keeps it, it is pinned where a restart keeps it.

## Lap D, delivery and stalls. Second

1. **The idle-holder guard** (`origin/l202-idle-guard` 901d3c39): P is running its 73 unrun mutants now. Landing it is a separate
   word, because it goes live for every seat.
2. **A stop order that outranks the queue.** New today, in no swarm file: the hold rung at 14:51Z reached E after 21 minutes and C
   after 30, each after the work it was meant to pause (`librarian/2026-11-13.md`, the two delivery traces).
3. **The API-error class.** `00_build_paths.md` section 1, steps 1 and 2, are not buildable as written (its second reader: the
   fixture covers neither recorded case). What is on disk already: fix 2c (landed, not installed) and
   `loop/api_error_watch_2026-11-13.js`. A `StopFailure` hook is tested with one forced error before anything rests on it.
4. Later, each with its section in `00_build_paths.md`: an owner for starting the train (2); the memory gate's message that hides
   its cause (5, `landing-train.js:194`); the collator waiting on a ring (3).

## Hygiene, small

- **Eight hook syncs on D that change nothing D does** (`loop/hooks_drift_D_2026-11-13.md`, section (c)), one entry at a time,
  `-Only` with `-NoRegister` where the entry is not registered (the 09-19 precedent), `settings.json`'s sha equal before and after.
- **`stop.js` stays.** The three ABSENT hooks are not installed.

## Not building (from `00_not_worth_it.md`, after its second reader)

A priority queue on the lock; a second train on D; dead-letter counts; idempotency keys. No recorded cost stands behind them.

## Amendment, 10:4x (librarian): Lap D item 1 is not ready

P ran the guard's 73 unrun mutants on D (73 of 73 caught; 101 of 101 rows) and in that same run the guard named two working holders
idle, with negative CPU figures, and posted both lines to the board (`handback/p-l202-check-P_2026-11-13.md`, section 4). A child
that used CPU and exited leaves the sum (`heavy-run.js:442`, `:358-362`). 901d3c39 does not land. The fix is P's, red first on
that case; another pane lands it.

## RULED, 12:1x (the librarian, at his word of 12:05: "why you asking me haha? Ur the hivemind legend")

Lap W is unparked. The builder's document is `loop/wake_level2_2026-11-13/00_lap_w_spec.md` with its second reader, read together with
`00_critic.md` section 1 (four errors still standing, E1 to E4) and `01_probes_q1_q2.md`. The spec's ten calls, each as ruled:

1. **Start Lap W: yes.** Order W5 (the receipt first), W1, W2 (its overdue item-6 score first), W3, W4.
2. **The wake gate refuses, for the librarian seat only, on D.** Warnings reached no seat (1,783 rows), and this gate's form is its
   content: a note opened whole is in the window. Its own check beside the lap's falsifier: at the next two wakes, was the first
   dispatch made from an opened note. Other seats are not gated.
3. **W2's room-side class: the librarian only.**
4. **L's shelf:** not ruled; it needs one read of `gates_mode` on L first. Carried to the handoff.
5. **The 25 KB margin between the light and strict shelves** is lowered to what W1 needs, named in the commit.
6. **The 85 MB transcript stays where it is.** It is his, he asked for it there, and removing it from the tip would not take it out of
   history or out of any pull that has not had it. From here no single file over 10 MB goes into this repository: the push gate
   refuses one, red first on the commit that carried it (3de92e53). Large records go to the private repository that holds the key.
7. **The model on resume:** the mechanism is built (a model named per seat in Consonance's config), and it ships EMPTY, which keeps
   today's behaviour. Which seat runs which model week by week stays his to set.
8. **Idle compaction: every seat's keep-warm ping moves before minute 54.** That stops compactions nobody gave a word for, which is
   what his standing rule asks; no setting of his is changed.
9. **A slash command typed into a seat is not activation** for keep-warm (C3).
10. **No compaction is scheduled for any seat.** That class is his word per seat, and none was given.

Corrections the builders carry from the critic and the probes: a restart inside the hour costs about one shelf a seat, not a rewrite
(E1); the silence-bounded wait is not shown to fix the recorded case, so the receipt is built first and read at the next large
catch-up (E2, Q4); the launch id is removed from the app's environment after it is read (E3); "no new tmp_pack created inside the
launch window" (E4); a running session did not re-read a changed CLAUDE.md in print mode (Q1), so W1d is not built on; the
compaction hook's output reaches a manual compaction's summary in both shapes (Q2).

**Panes.** R, Rust and PowerShell (`main.rs`, `launch.ps1`): B, after the nav row and his pictures. H, hooks and node tests: P, after
the render bench. The landing is a third pane's. One rebuild and one restart of Consonance at the end, with the queue counted first.

## Lap I (landed is live), SCORED AND RULED, 14:2x (the librarian)

**The Opus level:** `wf_3a5fde52-ef6`, 19 agents on Opus, 0 errors, 5,325,284 tokens, 1,572 tool uses, 63 minutes. Files:
`loop/landed_live_2026-11-13/` (eight topic files with second readers, `00_lap_i_spec.md` with its second reader, `00_critic.md`).
Read whole by this seat: `00_critic.md`; of the spec, I6 (:367-414), the keeper's calls and the falsifier (:619-694) and the second
reader's lists (:836-857). The topic files were not opened by me.

**The registered tests** (`loop/plan_vector_swarm_2026-11-13.md:141-146`):
- "This level did nothing if …": did not fire. Four changes to "Hygiene, small" and six checks that are red today on a recorded
  case (`00_critic.md:144-164`).
- "The vector was wrong if …": did not fire, for the same checks.
- **What the tests could not see, and the critic said** (`00_critic.md:204-210`): "Right in kind, wrong in size." Drift's measured
  cost on D is one entry, the stale second reader, at about 0.8% to 1.2% of one librarian day per day on stated price assumptions,
  and that entry is "a decision owed, not an unseen copy". Of the 19 ledger rows a built Lap I would have made 0 live by itself,
  named 13 on the machine concerned, and plausibly changed a cost in 3. "Nine parts is more than that evidence carries."
- **One of my own supporting lines was wrong** (`00_critic.md:81-84`): I gave "`dispatch-gate.js` is ABSENT on D" as a retrieval
  gate not running. It is a recorded hold, not installed on purpose on 09-21, and in its print mode it never denies.
- So the aim passed its registered tests and was still smaller than I argued. The spend was Opus tokens on a fault that costs
  about a hundredth of a seat-day a day. What it bought is the list below.

**What the level found that is worth acting on:**
1. The one measured cost closes with a ruling and two file syncs, in minutes (K1).
2. The second reader's chair-ring half is current code, not drift: 282 reads and 1,352,074 tokens since 11-03 whose flags reach no
   seat on D (`00_critic.md:193-196`).
3. Warnings that reach no seat: 2,482 SOURCES warnings since 10-20, and the reply slot's 1,009 attachments in 0 of 8,056 recorded
   requests (`00_critic.md:197-200`). The one warning that moved an act was addressed to its sender.
4. A new hook registration was picked up by a running session in about 61 seconds on L, with no restart
   (`00_critic.md:42-54`). Tying installs to a restart is how drift returned twice.
5. `whats-live.js` is red today on a commit that changed only a Markdown file; 0 of 116 build inputs are newer than the binary
   (`00_critic.md:158-159`). That false line is printed at every compaction, and this morning I repeated it to him as fact.
6. Lap W's own merge will make 3 files DRIFT and 2 ABSENT on each machine (`00_critic.md:205-207`). It is the next case.

**RULED (the room's calls, his word of 12:05; each reversible, and his to veto):**
1. **K1: yes.** On D, `second-reader-worker.js` then `second-reader.js` are synced, file only (`-NoRegister -Only`, one leaf a
   run), with the spec's probes (I6 rows 4 and 10). This applies this seat's 11-03 narrowing: pane rings are no longer second-read.
2. **K2: a registered trial, not "not now".** `second-reader-note.js` is installed and registered on D, so the chair-ring flags
   the room already pays for reach the seat that rang. It ends 2026-11-27 or at 100 notes shown, whichever is first. **It failed
   if** fewer than 5 of the first 100 notes shown are followed by a correction in that turn or the next ring (read from the note
   hook's ledger and this seat's notes by a seat that is not this one). Then chair rings stop being second-read on D and the
   hook is held with a date. Its cost is about 6 s on each `call_chair`.
3. **K3: held.** `dispatch-gate.js` and `carrier-drift-watch.js` stay off D until 2026-11-27, as installer data once I7 exists.
4. **K4, K5: the defaults.** `board-digest.js` stays unregistered on D; `-Check` is not changed.
5. **K6: not ruled.** It waits for the probe below.
6. **K7, for L:** `delete-gate.js` yes, `sources-gate.js` no. It goes into tonight's handoff with section 4 of the spec, for a
   seat on L to run.
7. **The eight file-only syncs on D** (I6 rows 1 to 8) go ahead now, one leaf a run, each with its red-to-green probe and its
   `.bak`. `push-gate.js` waits for Lap W's merge.
8. **Built now, by one pane that touches hooks and node tests only:** I1 (`landed-live.js`, with the second reader's changes), the
   two static tests the critic adds (E1: every literal relative `require` of an installed source resolves to an installed file,
   red at 8e85ff11^; E3: every installed file that no command runs carries a reason), I7's dated holds, and I2 (`whats-live.js`
   judged by cargo's build inputs). I2 is taken against the critic's cut, because its false line already cost a wrong statement
   to him today.
9. **The landing order, from now:** merge, install on the landing machine, the check green for the touched entries, then push;
   what the other machine owes is written into the handoff. Until I1 exists the check is `install.ps1 -Check`.
10. **A rider on Lap W's one rebuild:** the nine stale gate sentences in the briefs (spec I5, the gate sentences only) are
    corrected by pane R with its other brief edits, because a brief line reaches a seat only through a rebuild.
11. **Waiting for the first scored landing (Lap W's):** I3's field, I4, I5's LIVE-HERE line, I8, and I9's runtime rule.
12. **No restart is a precondition for a hook-only part.** The first behaviour-changing sync on D (K1) is the check: the next
    pane ring writes a `skipped-class` row with no restart.

**The stop rule.** One question changes what gets built: whether a PreToolUse hook's `additionalContext` reaches the model
(`00_critic.md:214-223`). A probe is running (one agent on Sonnet, sessions on the smallest model, a temp project, nothing written
under the user's Claude folder); its file will be `loop/landed_live_2026-11-13/01_probe_pretooluse_context.md`. No further
reading level.

**The lap's falsifier and its four companion clauses** stand as written in `00_lap_i_spec.md:676-694`; the first landing they
score is Lap W's.
