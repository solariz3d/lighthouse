# Inside the record: every stall and its fix (research reader, 2026-11-13)

Scope: the six `exo_memory/loop/stall_trace_*.md` files read whole. Every line in `exo_memory/librarian/*.md` and
`exo_memory/journal/*.md` that matches `\bstall` was listed (~~75 lines~~ second reader: not reproduced. At a081de4f
`git grep -iE '\bstall'` gives 86 lines and `-E` without `-i` gives 76; the same at 6ff2d95d and 3c71dd94. The cited
capitalised lines (09-07:61, 09-16:155, 09-16:177, 11-06:50) need `-i`, and the idle/waiting/held counts below reproduce
only with `-i`, so 86 is the matching figure [read]; a plain `stall` also matches "install", 861 lines (second reader:
861 with `-i` up to 6ff2d95d, 862 at a081de4f [read])).
Second reader, paths: `brief/BUILDING.md` and `brief/COMMITTEE.md` below live at `consonance/src-tauri/brief/` [read:
`git ls-files`]; there is no `brief/` at the repository root.
For "idle", "waiting" and "held" I read only the journal hits and the librarian sections the stall lines pointed to.
The code checks ran against lighthouse `main` at a081de4f (2026-11-13 08:46), on this machine (D).

Marks: [read] = opened and seen, with path:line. [inferred] = my inference. [ours] = a proposal.

## 1. Every stall, oldest first

Columns: when · how long · cause · fix made then · lasting fix written · built?

**S1. 2026-08-11. Pane injection stalled ~120 ms per call.**
- Cause: the panes mutex was held across a ~120 ms sleep in `inject_to_pane` [read] `journal/2026-08-11.md:110-111`.
- Lasting fix: none named in that line. Built: not checked (see "What I did not open"). Cost not recorded.
- Second reader: "per call" is not in the line. It says the mutex was held across the sleep, "stalling all pane
  injection" [read] `journal/2026-08-11.md:110-111`: other injections wait while one sleeps. Line 110 cites
  `main.rs:4387-4398` of that date.

**S2. 2026-08-17. The chair built three instruments alone while four panes sat idle.**
- Duration: the night; not stated in minutes [read] `journal/2026-08-17.md:3,34-36`.
- Cause: the chair did not dispatch. "The chair used `chair_inject` unprompted zero times" [read] `journal/2026-08-17.md:38-40`.
- Lasting fix: `memory/split-the-work-with-the-panes.md`, already on disk then. It recurred with it on disk [read] same lines.
- Built: a rule only. Cost not recorded beyond "the night".
- Second reader: the "zero times" figure is the 2026-08-10 measurement, quoted on 08-17 ("08-10 already put a number on
  it") [read] `journal/2026-08-17.md:38-39`. It is not a count from the 08-17 night.

**S3. 2026-08-29. Lap L013 died at WORKING with the work done: 80 minutes, nobody collated.**
- Cause: the pulse showed `L013 WORKING · holder panes` and every pane idle 1h+, but no instrument joined the two
  [read] `librarian/2026-08-29.md:403-409`, `librarian/LEDGER.md:99`.
- Lasting fix: a chain-line clause "handbacks likely in — nobody collated".
- Built: YES, the collation claim in `consonance/tools/chain-status.js:107` (pane B, 2026-08-29) [read].
- Second reader: the built clause is not the fix-shape above. The phrase "handbacks likely in" is in no line of
  `chain-status.js` [read: grep 0]. It prints "HANDBACKS IN, NOT COLLATED" from hand-back rows [read]
  `chain-status.js:1396-1398`, and its own header says it covers one of the night's three stranded laps [read] `:110-111`.

**S4. 2026-08-29. The stalled-lap verdict vanished once one healthy lap filed after dead ones.**
- Cause: v1 gated the work-leg claim on the newest lap being dead; stdout was empty at 11 fixtures [read] `LEDGER.md:109-111`.
  Second reader: `LEDGER.md:109` says "stdout empty at 11 checkpoints" and does not mention v1's gating. Both the
  gating and "eleven fixtures" are at `chain-status.js:1246-1248` [read].
- Built: YES, the claim has its own exit and a counted remainder [read] `chain-status.js:595-602`, `:1246-1256`.
- Cost not recorded.

**S5. 2026-08-30. Five stalls ~~in one night~~, all noticed by the keeper "by SILENCE" (L010, L011, L013, L017, L018).**
- Second reader: not one night. L010's dwell alone is 5,099 min (about 85 h), and L013 is S3 (08-29). The record calls
  L018 "the fifth stall-by-silence" [read] `librarian/2026-08-30.md:767`, and says "the five stalls are not one
  phenomenon" [read] `:829`.
- Dwell: L010 5,099 min, L011 4.2, L013 1,234, L017 42.5, L018 29.7 [read] `librarian/2026-08-30.md:829`.
  Second reader: the next line says "L011 does not reproduce from lap.jsonl", and it is registered as a discrepancy
  [read] `:830`. L013's 1,234 min dwell here and S3's 80 min measure different spans [inferred].
- L018: a lap at MAP with the chair present and all five panes idle 1h40m–2h14m [read] `librarian/2026-08-30.md:763-768`.
- Lasting fix: a visible chain indicator, exception-triggered (15 min) [read] `librarian/2026-08-30.md:826-828`.
- Built: YES, `consonance/ui/chain-indicator.js` [read]. Falsifier read later: "ten laps, and the keeper has not once
  been the one to notice a stall" [read] `librarian/2026-09-02.md:1108`.

**S6. 2026-09-02. The capture harvester's watcher thread died silently; four logs stopped.**
- Cause: ~~the watcher thread exits silently on a lock error~~ second reader: `LEDGER.md:37` names two mechanisms "not
  separated": a poisoned emulator mutex → `Err(_) => break`, or a panic in the watcher body [read]. `2026-09-07.md:67`
  adds that the reader's lock fails silently too, so a watcher-only fix leaves the reader stopped [read].
- Built: YES, `harvest_guard.rs` and `mod harvest_guard` in `main.rs` [read] (`grep -c` = 1). Cost not recorded.

**S7. 2026-09-07. Three holds on text in the chair's composer; the last was 72 minutes (L043).**
- Cause: Claude Code's grey autocomplete prediction in the composer read as the keeper typing, so the inbox gate held
  every delivery [read] `librarian/2026-09-07.md:59,61-63`. Beside it, every ring to a full-height pane held to the
  240 s bound ("the four-minute stall") [read] `librarian/2026-09-07.md:154`.
- Fix then: rebuild at 06:23 with C's `typed_only` (9881bfb); proof 1 passed [read] `librarian/2026-09-07.md:240-242`.
- Built: YES, `typed_only` appears 26 times in `main.rs`; test `a_ghost_in_the_composer_is_not_the_keeper_typing`
  at `main.rs:21188` [read].
- Also registered: a "composer-age nudge", so the tab shows a box holding unsent text while deliveries queue
  [read] `librarian/2026-09-07.md:59`. Built: NO match for it in `consonance/` [read: git grep "composer.?age|unsent"].
  Second reader: that grep returns one line, `main.rs:12305`, the D415 submit check (S21), which re-presses Enter on our
  own unsent text. It is not the nudge, so "no nudge" holds, but the grep is not 0 [read]. The words "the four-minute
  stall" are at `2026-09-07.md:240`, not `:154`; `:154` carries the 240 s figure [read].
  The hold it guarded is now bounded at 240 s even on a ready pane [read] `main.rs:11616-11618`.

**S8. 2026-09-09. The return leg sat 34 minutes; the keeper carried A's hand-back in.**
- Cause: A's `call_librarian` was REFUSED OUT OF TURN and the refusal was addressed to nobody [read] `chain-status.js:252-273`.
- Asked for: a 10-minute STALLED-AT-CHAIR timer. Refused on evidence: it would have alarmed 6 minutes over a correct wait.
- Built instead: YES, clause 3 UNDELIVERED [read] `chain-status.js:295-306`. Cost: 34 min, keeper as ferry.

**S9. 2026-09-16 (night). A lap older than ten minutes printed 345 times; no station acted. An 82-minute stall.**
- Cause: a line printed every turn does not fire at the moment of need [read] `librarian/2026-09-16.md:83`.
- Lasting fix: every ring ends with `NEXT: <station> <command> when <condition>`, refused without it.
- Built: YES, `consonance/src-tauri/src/trailer.rs` exists, and the gate refused live at 13:14 and 17:41
  [read] `librarian/2026-09-16.md:175,177`.
- Second reader: "82-minute" is not on `:83`; that line carries the 345 prints [read]. The only "82-minute" in the
  note is `:175`, "the exact shape that preceded the 82-minute stall", with no start or end time [read: grep]. Whether it
  is S10's 81 minutes (10:02–11:23 the same day) is not shown [inferred].
- Second reader: the refusal is off on this machine now. `~/.consonance.json:23` reads `"gates_mode": "light"` [read],
  and in light mode the policy is warn-and-deliver for `chair_inject`, `call_chair` and `call_librarian` [read]
  `consonance/src-tauri/src/trailer.rs:622-625`. So "refused without it" describes the strict mode, not D today.

**S10. 2026-09-16 10:02–11:23. 81 minutes: chunk 2 never opened after chunk 1 filed.**
- Cause, the librarian's own: it held the gate between chunks and did not drive the next open [read] `librarian/2026-09-16.md:155`.
- Lasting fix: the memory rule `handoff-without-the-keeper` (in the MEMORY.md index). Built: a rule only.

**S11. 2026-09-16 13:16–17:40. Four hours: the chair waited on a re-send that had already been delivered.**
- Cause: C's G5 was delivered at 13:15:46 without a NEXT trailer; the chair kept waiting [read] `librarian/2026-09-16.md:177`.
- Lasting fix: none written in that entry [read]. Unbuilt as a fix. Cost: ~4 h 24 m.

**S12. 2026-09-23 ~03:14–03:22. "Nothing was sent to the orch."**
- Cause: A's ring was queued behind the librarian's busy turn (`stamp=working`); the librarian read A as idle off the
  digest [read] `loop/stall_trace_2026-09-23.md:12`, `librarian/2026-09-22.md:1077`.
- Fix 1: QUEUED over 3 min printed in the pulse. Built: YES, clause 4 (L095) [read] `chain-status.js:724-751`.

**S13. 2026-09-23 03:45–04:01. The chair blocked on a foreground suite run; every ring queued.**
- Cause: the librarian's rule "every landing runs the whole js-suite" put a foreground suite run in the chair. It raced
  a second suite run and C's mutant run on one tree [read] `stall_trace_2026-09-23.md:13,55-57`.
- Fix 2: runs over ~2 minutes go in the background. Built as a rule: YES [read] `brief/BUILDING.md:150-160`,
  `brief/COMMITTEE.md:104`. Its proving check (a script counting foreground calls over 120 s) was not found
  [read: git grep "foreground" in tools: 0].
- Fix 3: a heavy-run lock. Built: YES, `consonance/tools/heavy-run.js` [read]. Cost: 8–16 min per ring, twice
  [read] `BUILDING.md:152`.

**S14. 2026-09-23. "Why isnt B working?" B was alive and idle; the digest lists only panes that exchanged today.**
- Fix 4: the digest lists every roster pane. Built: YES (L096) [read] `consonance/hooks/board-digest.js:405-413,493`.
- Fix 5 (collator discipline: never use the digest for who exists or who is done) was said to be "this seat's
  memory, already written" [read] `stall_trace_2026-09-23.md:45-46`. Not found in the briefs [read: git grep 0] or in
  the D memory index [read]. Built: unconfirmed. ~~Cost not recorded.~~ second reader: cost recorded, "a live seat that
  was never dispatched sat invisible on L for an hour" [read] `consonance/hooks/board-digest.js:406-407`. Also: the
  memory files on D (48) carry no collator-digest rule; their "digest" hits are hash digests [read: grep].

**S15. 2026-09-23 01:2x. The L084 landing: parallel laps edited `main.rs` at once.**
- Cause: tests compiled half-written code [read] `stall_trace_2026-09-23.md:15`.
- Lasting fix: covered by fix 3 and worktrees [inferred]. Cost not recorded.

**S16. 2026-09-23 06:20–06:37+. A STALE stamp held two rings at the librarian for 16+ minutes.**
- Built: YES. D130 found the drain thread had no panic guard and added one; STALE does reach the 240 s force
  [read] `handback/p-d130-drain-B_2026-09-24.md:1,19-26`; `drain_decision` bounds Stale at `main.rs:11647`;
  `catch_unwind` appears 5 times.

**S17. 2026-09-23 18:1x–19:06. 50 minutes at the collator, waiting on a ring for a promised addendum.**
- Lasting fix: when a hand-back promises an addendum, the collator checks the file itself after ~10 min
  [read] `stall_trace_2026-09-23.md:68-74`. Built: NO trace in the briefs [read: git grep "addendum" in brief/: 0].
  A rule in a dated trace only.

**S18. ~~2026-09-24 02:04–05:32Z~~ second reader: 2026-09-25 02:04Z–05:32Z (the evening of 09-24 local); the D137
hand-back walks "rows 2026-09-25T02:04Z..05:33Z" [read] `handback/p-d137-stall-A_2026-09-24.md:13`. 3 h 28 m: the
librarian's turn was blocked on its own AskUserQuestion.**
- First recorded as a delivery defect; that was WRONG and struck [read] `stall_trace_2026-09-23.md:91-102`.
- Lasting fix: the pulse says "<seat> waiting on YOUR answer since <t>". Built: YES, clause 6 (D138)
  [read] `chain-status.js:918-1003`. Cost: 3 h 28 m, plus A and C dispatched on a wrong premise.

**S19. 2026-09-25. Main's claude process crashed (Bun segfault); the header still said "awake".**
- Built: YES, `pane_exit.rs`; a fixed seat is reopened once (D143) [read] `main.rs:34,10645-10676`.
- The garbled pane after reopen: `term.reset()` [read] `consonance/ui/term.js:1048`. Cost not recorded.

**S20. 2026-09-27. Two `tail -F` watchers on A outlived the run by 20+ minutes; the pane looked busy.**
- Fix then: the librarian killed both process trees [read] `stall_trace_2026-09-23.md:127-140`.
- Lasting fix: a watcher starts with an end condition (`tail --pid`, an `until` loop) [read] `:141-144`.
- Built: a rule, NOT in the briefs [read: git grep "end condition|--pid" in brief/: 0]. A detector exists: the
  leftovers counter found five `tail -F` processes ten days old on 2026-10-24 [read] `brief/BUILDING.md:194-200`.

**S21. 2026-10-19. A ring sat unsent in Main's input box for 38 minutes ("it didnt auto send").**
- Built: YES, the submit check (D415) [read] `main.rs:12300-12308`. Found while checking S7, not from the grep.

**S22. 2026-11-06. E waited on a CHANGELOG commit that C had edited and not made.**
- [read] `librarian/2026-11-06.md:50`. Lasting fix: none written. Cost not recorded.

**S23. 2026-11-05 → 11-07. The T-180 installer pointed the desktop shortcut back at the app, three installs running.**
- Cause: `Rebuilder.cs` ran the NSIS setup and never restored the .lnk [read] `stall_trace_rebuilder_shortcut_2026-11-07.md:3-8`.
  Second reader: `:3-8` is the "Seen" list; the cause ("Nothing restores the .lnk afterwards") is at `:9` [read].
- Built: YES, `RestoreShortcut` (L147) [read] `consonance/tools/t180-rebuilder/Rebuilder.cs:4-5,65-101`.
- Cost: silent; seat installs hid it by hand each time.

**S24. 2026-11-11. The rebuilder's pull failed after any build: Cargo.toml looked changed (line endings).**
- Fix then: `git add` of the same blob, then the fast-forward on L [read] `stall_trace_rebuilder_pull_cargo_toml_2026-11-11.md:20-21`.
- Lasting fix part 2 (rebuilder re-records when `git diff --quiet HEAD`): built [read] `Rebuilder.cs:34-40`.
- Lasting fix part 1 (t180 `.gitattributes` `Cargo.toml text eol=lf`): on branch `l158-eol-lf` bd9cd25 only;
  "joins main with the next batch, at his word" [read] `loop/handoff_t180_2026-11-11-L.md:52,65`. No later record of
  it landing [read: newest file naming it is `librarian/2026-11-11.md`]. Both t180 checkouts on D lack it
  [read: their `.gitattributes`; `bd9cd25` is not an object there].

**S25. 2026-11-12 01:08–01:14. B's build held the heavy-run lock 6 minutes doing nothing.**
- Cause: Git Bash rewrote `cmd /c` to `cmd C:/`; cmd.exe sat as an idle interactive shell [read] `stall_trace_lockbn_cmd_c_mangled_2026-11-12.md:8-12`.
- Fix then: the librarian stopped cmd.exe 37364.

**S26. 2026-11-13 ~11:50–12:30Z. The same failure, 40 minutes, on E's holder; every pane idle 4–29 min.**
- [read] `stall_trace_lockbn_cmd_c_mangled_2026-11-12.md:26-30`. "The 'fix, for good' above was never built, and the
  stall came back at seven times the length."
- The librarian's own miss: it looked at the lock at 05:52 and did not check the child [read] `librarian/2026-11-13.md:256`.
- Guard in heavy-run.js: built on branch `l202-idle-guard` 901d3c39, NOT merged and NOT live; mutants 20–92 not run
  [read] `handback/p-l202-idle-holder-guard-B_2026-11-13.md:5-17`. Main's `heavy-run.js` has no idle check
  [read: grep "cpu|idle" shows only the CPU cap].
  Second reader: 901d3c39 is not an object in D's lighthouse clone (`git cat-file -t` fails) [read], so the branch
  cannot be read here without a fetch. The hand-back's counts hold: 5 new + 92 = 97, run 5 + 19, unrun 73 [read] `:9-15`.
- `MSYS_NO_PATHCONV=1` / `cmd //c` in every wrapper: ~~in no tracked code or brief [read: git grep 0 outside .md
  hand-backs]~~ second reader: in nothing under `consonance/` and in no brief [read: git grep 0], but `git grep -l`
  finds 39 tracked files, 20 of them not `.md`: pane scripts kept as hand-back evidence, e.g.
  `handback/p-l182-lines-A_2026-11-12_evidence/arms182b.sh:8` `export MSYS_NO_PATHCONV=1` [read]. Some panes already
  use it in their own scripts; no shared wrapper does [inferred]. It sits in `librarian/2026-11-12.md:47` as "rules
  learned tonight".

**S27. 2026-11-13 ~07:04Z. The low-memory reaper stopped A's sweep and E's mutant rerun.**
- Cause of the pressure: not established; sizes were never taken [read] `stall_trace_lowmem_reaper_2026-11-13.md:10,36`.
  Second reader: `:36` is blank; the "Not verified" line is `:35` [read]. Cost (missing above): A's sweep was killed
  about 12 minutes into a3 block 1 [read] `:7`; E's rerun lost its first mutant and left a mutated source [read] `:40`.
- The reap left a live sweep child, a mutated `skeleton.cpp` and an orphaned waiter [read] `:9,40`.
- Built: `memwatch_2026-11-13.js` (in `exo_memory/loop/`, not in `consonance/tools/`); the train's memory gate calls it
  [read] `consonance/tools/landing-train.js:18`.
  Second reader: `:18` is a comment on a `gate` parameter ("[program, ...args] or null ... (memwatch --gate)"); the
  train takes the program from its caller and names no memwatch path [read: grep "memwatch" in the file: line 18 only].
  That the room's train calls memwatch is shown by the trace [read] `stall_trace_lowmem_reaper_2026-11-13.md:48`.
- Exit-trap rule (restore files, kill waiters on exit): NOT in briefs [read: git grep "exit trap": 0]; "Not done for
  E's runner here" [read] `:43`.
- Lockless-test rule with a memory line: an open question [read] `:37`; `COMMITTEE.md:93` still has no memory clause [read].

**S28. 2026-11-13 06:33–07:10 local. An orphaned grep (16,000-wide repeat) held commit memory ~30 min.**
- It held the landing train at the memory gate [read] `stall_trace_lowmem_reaper_2026-11-13.md:45-48`.
- Fix then: A stopped pid 41036. A second runaway grep (7,000-wide repeat, 1,552 MB) was stopped at 12:31Z
  [read] `stall_trace_lockbn_cmd_c_mangled_2026-11-12.md:31`.
- The train's message showed the tail of memwatch's line and cut off the cause. Suggested: `slice(0, 160)`.
  Built: NO, `landing-train.js:194` still reads `g.text.trim().slice(-120)` [read].
- `timeout` for long commands: NOT in briefs [read: git grep 0]. A grep guard was armed for 90 min in one session only
  [read] `librarian/2026-11-13.md:294`.

**S29. 2026-11-13 09:46–09:53Z and 10:15–10:24Z. A Cloudflare 403 ate six orders and one task result.**
- Cause (ours): a packet counts as DELIVERED when pasted, whatever the pane replies [read]
  `stall_trace_403_packets_eaten_2026-11-13.md:18-23`.
- Fix 2c (the digest names panes whose last line is an API error): landed b0be06f0, NOT installed [read]
  `handback/p-l198-403-stall-B_2026-11-13.md:5,23`.
- Fixes 2a (NOT ACTED ON, redeliver) and 2b (release one at a time): "NOT started" [read] `:11,24-25`. Auto "carry on"
  retry: owed [read] trace `:53`. Workaround: `loop/api_error_watch_2026-11-13.js`, armed per session [read] `:45-49`.

**S30. 2026-11-13 ~11:21–12:58Z. ~~Nothing landed for ~50 minutes; no seat ran the train.~~**
- Second reader: the window and the figure disagree. 11:21Z to 12:58Z is about 97 minutes. "Nothing had landed since
  11:21Z" [read] `librarian/2026-11-13.md:295`; "about 50 minutes" is how long nobody ran the train before A did at
  06:58 local (12:58Z) [read] `:312`. In the same span B's mutant run held the slot until 12:48Z [read] `:311`, and the
  orphaned grep held the memory gate (S28) [read] `stall_trace_lowmem_reaper_2026-11-13.md:45-48`. So the cause was
  three things, not only "no seat ran the train"; cost ~97 min without a landing, of which ~50 min with no train run.
- [read] `librarian/2026-11-13.md:312` ("after nobody had for about 50 minutes"), `:295`, `:311` (B's mutants held the slot).
- Lasting fix: "an owner for running the train, and a visible queue on the lock" [read] `:318`. Built: NO. The train has
  no watch mode [read: grep "--watch|setInterval" in `landing-train.js`: 0]; `heavy-run.js` tells only a waiter who
  holds the tree [read] `heavy-run.js:30`.

## 2. Lasting fixes still unbuilt, oldest first

1. 2026-09-07: composer-age nudge (S7). Mostly moot now: the hold is bounded at 240 s [read].
2. 2026-09-16: anything for "a seat waits on an event that already happened" (S11). Nothing written. Cost ~4 h 24 m.
3. 2026-09-23: proving check for fix 2, a script counting foreground calls over 120 s (S13). Rule built, check not.
4. 2026-09-23: fix 5, collator discipline on the digest (S14). Said to be in memory; not found on D.
5. 2026-09-23 19:0x: check a promised addendum's file at ~10 min, never wait on a ring (S17). Cost 50 min.
6. 2026-09-27: watchers start with an end condition (S20). Detector built, rule not in briefs.
7. 2026-11-11: t180 `.gitattributes` eol=lf on main (S24). On a branch since 11-11; rebuilder half built.
8. 2026-11-12: `MSYS_NO_PATHCONV=1` / `cmd //c` in pane wrappers (S25). Cost 6 + 40 = 46 min over two nights.
9. 2026-11-12: idle-holder guard in `heavy-run.js` (S25–S26). Built on a branch, not merged, 73 of 97 mutants unrun.
10. 2026-11-13: exit traps for scripts that mutate files or hold waiters (S27).
11. 2026-11-13: a memory line in the lockless-test rule (S27). Open question, not ruled.
12. 2026-11-13: `landing-train.js:194` shows the head of memwatch's line (S28). Cost ~30 min.
13. 2026-11-13: `timeout` around long or runaway-prone commands (S28).
14. 2026-11-13: fixes 2a and 2b in `main.rs` delivery path, and the auto-retry (S29). Need a Consonance rebuild.
15. 2026-11-13: fix 2c install (S29). Built and landed; not installed.
16. 2026-11-13: an owner for running the train and a visible lock queue (S30). Cost ~50 min. (Second reader: ~50 min
    with no train run, inside ~97 min with no landing; see S30.)

## 3. Patterns [inferred]

- Fixes that became code (chain-status clauses, trailer gate, digest roster, pane exit, typed_only) did not recur.
  Second reader, counter-evidence [inferred from the lines cited]: L018 died at MAP on 08-30, a day after the
  stalled-lap detector and collation claim were built, and was again noticed by silence (S3 → S5, `2026-08-30.md:767`).
  S11 began at 13:16, two minutes after the trailer gate first refused live at 13:14 (`2026-09-16.md:175,177`); pane
  rings are delivered without a trailer by design. And the trailer gate's refusal is off on D today (S9, light mode).
  "Did not recur" holds for the exact mechanism at best, not for the stall class.
- Fixes that stayed as rules in a dated trace or a librarian note did recur: S25 → S26 at seven times the length.
- Eight of the sixteen unbuilt items are rules with no carrier in `BUILDING.md` or `COMMITTEE.md`.
- [ours] Option: move each rule-only fix into the brief a pane reads, or into the tool it names. Option: a trace's
  "fix, for good" section gets a "built:" line updated when it lands, so this audit is a grep.

## 4. A fact about this machine (D) that touches S23–S24

- `Rebuilder.cs:14` hardcodes `C:\Users\zackn\Downloads\t180-track-builder`; `/c/Users/zackn` does not exist on D
  [read]. Only `--pull-only <folder>` changes it [read] `Rebuilder.cs:132-135`.
- D has no `AppData/Local/T-180 Rebuilder` [read], matching `librarian/2026-11-11.md:61`.
- Whether this bears on the failed rebuild named in the request is not shown by anything I opened.

## What I did not open

- Most "idle", "waiting" and "held" hits in the librarian notes (182, 147 and 353 lines). I read only the journal hits
  and sections the stall lines pointed to. Stalls described only with those words may be missing here.
- `librarian/2026-08-31.md`, `2026-09-20.md`, `2026-10-18.md` stall lines past the one-line view; the `.desktop.md`
  notes beyond the grep.
- `loop/stalled_lap_detector_2026-08-29.md`, `loop/visible_channel_registration_2026-08-30.md`,
  `loop/plan_d415_delivery_submits_2026-10-19.md`, `loop/plan_three_defects_2026-09-24.md` in full.
- Whether the 2026-08-11 injection mutex-sleep (S1) was fixed: `inject_to_pane` not read.
- t180's current `origin/main`: not fetched (no network call made to the repository). D's local refs end at 3b33b38.
- The `l202-idle-guard` branch's code itself; I read only B's hand-back.
- `map/M.md` and `LEDGER.md` beyond lines 37, 87, 99, 109.

## Second reader

Adversarial second reading, 2026-11-13, on D, lighthouse `main` at 79bf5761 (a081de4f plus four note commits; the
code files cited are unchanged between them [read: `git diff --stat a081de4f HEAD`, 4 files, none code]).

**Checked, and it holds** (file opened at the cited line, or the command re-run):
- S3 `2026-08-29.md:403-409`, `LEDGER.md:99`; S4 `chain-status.js:595-602,1246-1256`; S5 `2026-08-30.md:763-768,826-829`,
  `2026-09-02.md:1108`, `chain-indicator.js` (CHAIN_ESCALATE_MIN = 15 at `:104`); S7 `2026-09-07.md:59,61-63,240-242`,
  `typed_only` = 26 in `main.rs`, the test at `main.rs:21188`, `main.rs:11616-11618`; S8 `chain-status.js:252-273,295-306`
  (34 m, the six-minute alarm); S9 the 345 prints at `2026-09-16.md:83`, refusals at `:175,177`; S10 `:155` (81 min);
  S11 `:177` (13:16 → 17:40 = 4 h 24 m); S12 trace `:12`, `2026-09-22.md:1077`, `chain-status.js:724-751`; S13 trace
  `:13,55-56`, `BUILDING.md:150-160` and `:152` (8–16 min, twice), `COMMITTEE.md:104`, "foreground" in tools = 0;
  S14 `board-digest.js:405-413,493`; S16 the D130 hand-back `:1,19-26`, `main.rs:11647`, `catch_unwind` = 5;
  S17 trace `:68-74`; S18 trace `:91-102` (02:04:45Z → 05:32:16Z = 3 h 27.5 m); S19 `main.rs:34,10645-10676`,
  `term.js:1048`; S20 trace `:127-144`, `BUILDING.md:194-200`; S21 `main.rs:12300-12308` (38 min); S22
  `2026-11-06.md:50`; S24 the trace `:20-21`, `Rebuilder.cs:33-41`, handoff `:52,65`, no `bd9cd25` and no `eol=lf` in
  the three main t180 checkouts on D; S25–S26 the lockbn trace `:6-31` (6 min; 40 min; 1,552 MB); S26 `2026-11-13.md:256`;
  S27 trace `:9,37,40,43`; S28 trace `:45-48`, `landing-train.js:194` still `slice(-120)`, `2026-11-13.md:294`;
  S29 the 403 trace `:18-23,45-49,53`, the L198 hand-back `:5,11,23-25`, b0be06f0 is on main; section 4
  `Rebuilder.cs:14,130-136`, no `/c/Users/zackn`, no `AppData/Local/T-180 Rebuilder`, `2026-11-11.md:61`;
  the idle/waiting/held counts 182/147/353 (case-insensitive, at a081de4f). Rule-only items with no brief carrier:
  "addendum", "end condition|--pid", "exit trap", `\btimeout\b`, "who exists" all 0 in `consonance/src-tauri/brief/`.

**Struck or corrected in place** (each marked "second reader:"):
1. The `\bstall` count, 75 → 86 with `-i` (76 without); not reproduced at any commit today.
2. S5 "in one night": L010's dwell is 5,099 min; L013 is 08-29.
3. S6 cause: two mechanisms, not separated, per the cited ledger line.
4. S14 "cost not recorded": `board-digest.js:406-407` records an hour.
5. S18 date: 2026-09-25 in UTC, not 09-24.
6. S26 "no tracked code": 20 tracked evidence scripts set `MSYS_NO_PATHCONV=1`; none under `consonance/` or the briefs.
7. S30 header: ~97 min with no landing, ~50 min with no train run, three causes.

**Notes added without a strike** (citation drift or missing context, the claim's content stands): the `brief/` path
prefix; S1 "per call"; S2 the 08-10 figure; S3 the built clause differs from the fix-shape; S4 "checkpoints" vs
"fixtures"; S7 the grep returns one unrelated line, and the quote's line; S9 the 82-minute figure's line, and the trailer
gate is warn-and-deliver on D (`gates_mode` light); S23 cause at `:9`; S26 901d3c39 absent on D; S27 `:35` not `:36`, and
its cost; S28 the train's gate is a parameter; section 3 counter-evidence.

**Could not check:**
- The `l202-idle-guard` branch and `bd9cd25`: neither object is on D; no fetch was made.
- t180's `origin/main` beyond D's local ref 3b33b38 (no network call).
- Whether S9's 82-minute stall and S10's 81 minutes are one event: the record gives no times for the first.
- The trailer gate's behaviour on L: only D's `~/.consonance.json` was read.
- The first reader's "Eight of the sixteen" count is an inference; my own reading of section 2 gives 7 clear rule-only
  items (4, 5, 6, 8, 10, 11, 13) plus the "owner" half of 16, so 8 is defensible, not shown.
- S1's fix: `inject_to_pane` was not read by either reader.
- Cost for S6, S15, S19, S22 remains not recorded in anything opened here.
