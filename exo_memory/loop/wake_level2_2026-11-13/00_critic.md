# Critic, wake level two: what still stands wrong, what one source carries, and whether a level three is warranted

Critic, on D, 2026-11-13 about 17:55Z, read-only except this file. HEAD 58e4c196; `git diff --name-only 3f5fa65d HEAD --
consonance dev` prints nothing [read], so every code line the folder cites holds at HEAD. Marks: [read] opened and seen;
[summary] from another swarm file; [inferred] mine; [ours] a proposal. Short names as in the spec: `launch`, `shelf`,
`compact`, `body`, `gate`, `prior`, `cold`, `idle`; `spec` = `00_lap_w_spec.md`; `plan` = `loop/plan_room_stretch_2026-11-13.md`.
Read whole: the eight topic files, the spec, all nine second readers, `wake-level-two.workflow.js`,
`loop/plan_wake_level2_swarm_2026-11-13.md`, `plan`, `room_better_2026-11-13/in_wake.md`, `plan_retrieval_at_the_wake_2026-11-12.md`.
Transcript passes: numbers, timestamps, row types, flags and file paths only; scripts `critic_ss*.js` in my scratchpad.

## 0. The relayed question, "o pane is inactive btw?"

- Pane O (`sibling-36313935`, transcript `c88002b1-….jsonl`) made no request of its own from 11-04T02:09Z until a prompt at
  17:04Z today; before that it answered keep-warm pings only [summary: cold:138-141, idle:137-139]. It is active now: 247
  assistant rows since 17:00Z, newest at 17:53:02Z, newest user row 17:52:59Z, file written 11:53:02 local [read: tail pass].
- The brief records the question as a catch at 11:01: "o pane is inactive btw?" with the note that O "had been given no work
  all morning; the dispatch had counted five panes" (`exo_memory/briefs/lighthouse_the_room.md:116-117`) [read].

## 1. Errors still standing after the second readers

**E1. "A mid-day restart likely rewrites every seat whole" is contradicted by the record.** It stands at cold:269-276
([inferred] there), and the spec builds on it twice: section 1 row "Rebuild and restart" and W1 "Needs" ("Restart when the
seats are cold anyway") [read: spec:46, :218-219]. Primary: on a resume the harness re-attaches the changed instance
`CLAUDE.md` as an `instructions` attachment at the first prompt, and the cached prefix is kept. Four warm resumes on the
librarian, first call after each [read: `critic_ss6.js` over the librarian transcript]:

| resume (attachment) | last call before: cache read / write | first call after: cache read / write |
|---|---|---|
| 11-04T02:58:00Z | 202,794 / 1,058 | 203,852 / 38,455 |
| 11-04T03:21:30Z | 250,180 / 574 | 250,754 / 37,143 |
| 11-09T06:23:35Z | 229,634 / 157 | 229,791 / 38,748 |
| 11-12T05:31:41Z | (synthetic row) | 230,731 / 39,288 |

  Each first call read the whole prior prefix and wrote about 37-39k, the size of one re-attached shelf of 103,492-107,670 characters at
  2.89 B/token [inferred]. So a restart inside the hour costs about one shelf per seat, not a whole rewrite [inferred]. The
  advice to restart when cold may still be fine; the stated reason is wrong.

**E2. F1b is called "the fix for the recorded case" (launch:201, spec:43) and nothing shows it would have fixed it.** The
launcher's fetch received 2,138,111 B between 08:41:38.860 and 08:41:57.664, about 113.7 KB/s [read: `stat` of
`tmp_pack_Hl1ze7`; `git count-objects -v` still warns "garbage found" on it]. At that rate the 120 s cap carries about 13.6 MB
of the 90,516,246 B needed (2,157 objects) [read: `git rev-list --objects --disk-usage 0b85fead..8fd453c6`; arithmetic
inferred]. F1b finishes only if throughput rose to roughly the seat's 19 MB/s (launch:110) before about second 115; that is
not on disk [inferred]. Test (ii) runs against a fast local `file://` origin, so it cannot show this either [read: spec:113-117].

**E3. The launch id does not end the stick-apply case it was chosen for.** The spec says `CONSONANCE_LAUNCH_ID` replaces the
300 s window "which names an earlier pull after a stick-apply relaunch" [read: spec:84-86]. The app starts `dev/stick-apply.js`,
which relaunches `consonance.exe` (`main.rs:15386-15391`; `stick-apply.js:16`) [read]. A child inherits the environment unless
it is cleared, and I found no `env_clear` on that path [inferred: grep of `main.rs`]. The relaunched app would then read the old
id and match the old receipt: the same false "pulled at 08:42" line [inferred]. Smallest close [ours]: the app removes the
variable from its own environment after reading it, and a test spawns a child and asserts it is absent.

**E4. W5 "what proves it afterwards" says the next launch "leaves no `tmp_pack_*`" [read: spec:123].** `tmp_pack_Hl1ze7` is
still in `.git/objects/pack` today and stays until a gc [read: `git count-objects -v`]. The check must be "no new `tmp_pack_*`
created inside the launch window", as the cause probe already words it [ours].

No other WRONG survived my reading: the spec's 85-row second reader corrected the four WRONGs it found in place [read: spec:657].

## 2. Where two files disagree, and what the primary supports

| question | one file | other file | primary | supports |
|---|---|---|---|---|
| Does a `--resume` re-read the instance CLAUDE.md? | shelf:98, :320 "docs say nothing" | prior:265, :417 "not checked" | `instructions` attachment carrying `instances\librarian\CLAUDE.md`, `changed: true`, 5-194 s after every resume since 11-01 (12 rows); 14:43:27.254Z today carried 107,984 chars, the 08:42:42 file (108,857 B) [read: `critic_ss4/5.js`]; docs: project context "Changes when: Session starts" (`prompt-caching.md:26`) [read] | yes, it re-reads at the first prompt after the resume |
| Restart cost | cold:269-276 "rewrites every seat whole" | none contests it | E1's table | the record, not cold |
| Does SessionStart output reach the model on a resume (W3's channel)? | body:187-188 left open | compact:11-12 shows it for compact only | a `hook_additional_context` row 1 ms after each `SessionStart:resume` `hook_success` row, e.g. 14:42:47.131Z today, content 965 chars [read: `critic_ss2.js`]; `session-start.js:393-397` prints JSON `hookSpecificOutput` [read] | yes, recorded on every resume since 11-10 |
| Build W4, and how | gate:197 "I would take the hook", refuse | prior:203-219 "most expected to FAIL" | `sources-gate.jsonl` 14:46:27.243Z: the existing gate already fired on this ring and warned [summary: spec:431] | spec's default (build, install, warn in light) is the configuration the record says reaches no seat (1,783, prior:218), and its own afterwards-check cannot pass under it (spec:434-436) [read]; build W4 only with a refuse ruling, else not at all [ours] |
| O's state | cold:138-141 "active since 17:04Z" | spec 2nd reader "active as of 17:45Z" | tail pass | both hold; newest row 17:53:02Z |

## 3. Claims a build would rest on that have one source only

- The 2.1.323 PreCompact handler appends each hook's raw stdout to the compaction's instructions, and the summary prompt
  follows "instructions in the included context": one read of a minified binary (compact:5-10, :144-149) [summary].
- The 08-18 auto probe: one run, one client (2.1.234 by one terminal), another machine (compact:123-125) [summary].
- The window-path count (`third_place/` touched in 20 auto windows, named in 7): compact's second reader only; the spec's
  second reader did not re-run it (spec:635, :697) [read].
- W4's base rate (at most 140 of 154 refused; 3 wakes test (b)): the gate second reader's stand-in `base.js` only (gate:313-326).
- "A hook deny holds under bypass": inferred from 430 deny rows and re-sends; the docs do not say it (gate:106-109, :134-135).
- L runs the strict walk: one quoted sentence (shelf:43-44); L's config is unread.
- Effort from the transcript's top-level `effort`: an undocumented field (body:5-8).
- C3's red: a JS port of `activated_by_use`; the Rust test was not compiled (idle:212-214).
- `main.rs:9154` is red on today's tree before W1: inferred from sizes, not run (shelf:241-246).
- F1b's effect on a slow network: no measurement at all (E2).
- My own finding that a running session re-attaches a changed CLAUDE.md (section 4): three rows, a September client.

## 4. Still unread or untested

Settled by this critic from the record (no longer open):
- A resume re-attaches the instance CLAUDE.md, so W1's new shelf reaches a resumed seat at its first prompt [read: section 2].
- SessionStart `additionalContext` reaches a resumed seat as a `hook_additional_context` row, so W3's channel works on
  resume [read: section 2]. Not yet seen: the same for a NEW hook file beside the two registered ones [inferred: likely].

Open, with the mechanism nobody ran:
- **Does a RUNNING session re-attach a changed CLAUDE.md at its next turn?** Three mid-session `instructions` rows with
  `changed: true` exist, after 94, 29 and 14 replies since the last SessionStart: 2026-09-14T14:42:05Z (the user and the
  instance CLAUDE.md), 09-16T13:04:25Z and 09-26T07:14:28Z (`MEMORY.md`) [read: `critic_ss7.js`]. None since 11-01, because
  the app writes the shelf only at spawn [summary: launch:167-168]. Untested on 2.1.323.
- Whether the root-level JSON from `precompact-preserve.js` still reaches the summariser on 2.1.304-2.1.323 (compact:5-10).
- Whether a `# Compact instructions` section inside a 108 KB CLAUDE.md is followed on an auto pass (compact:148-149).
- Whether a 120 s silence-bounded fetch completes a large catch-up on a waking network (E2).
- Whether a running seat picks up a newly registered hook without a restart; the docs say settings are watched (idle:174).
- Whether the MCP server delivers a `call_chair` from a subagent; the spec refuses it either way (gate:332-336).
- Whether `ls-remote` over https ever opens a credential window under GCM (shelf:388-391).
- Every proposed Rust and node test: none written, compiled or run (spec:700).
- Every L-side claim; the letter's falsifier and the item-6 bar, both still unscored (prior:192-193).

A cost fact the folder does not name [read numbers; inferred mechanism]: every resume appends a whole fresh copy of the
shelf to the carried conversation (about 37-39k tokens, E1), so N resumes between compactions carry N copies. W1's +14 KB
rides each copy.

## 5. THE REGISTERED TEST (`plan_wake_level2_swarm_2026-11-13.md:30-31`)

**Did level two change Lap W?** Yes. No part was dropped. Changes [read: spec:24-47 against plan:76-82]:
- Reordered: W5, W1, W2, W3, W4, with W4 last and behind his ruling (spec:61-63).
- W5, new mechanism: cause found (a 90.5 MB pack cut at the 20 s total ceiling, or by an error in the same second); a pull
  receipt (F1), a silence-bounded wait (F1b, needs `fetch.unpackLimit`), a comment fix. E2 says F1b's effect is unproven.
- W1, new mechanism: "built after the pull" replaced by an `ls-remote` stamp plus the launch receipt; "first screen" replaced
  by the newest whole entries from an 8,000 B reserve outside the cap; the pin under its own cap.
- W2: librarian-only item 0; a third stale line (`:107-108`); a shape probe; a `# Compact instructions` brief section; item-6
  scored first.
- W3: a new hook file, effort from the transcript, origin dated by the reflog entry, plus the librarian's pointer clause.
- W4: a new `sources-gate`-shaped hook with defined "wake", "newest" and "opened whole"; refuse-or-warn is his call.
- Added and named, not built: W1d (rewrite the shelf when HEAD moves); a lap falsifier (spec:558-566).

**Did it add a failing check that runs on a recorded case?** Yes. Re-run by me today, all red [read]:
- W5: `tmp_pack_Hl1ze7` 2,138,111 B, last written 08:41:57.664, against `--disk-usage` 90,516,246; `launch-pull.json` absent.
- W1: `grep -c '^Built .* from HEAD '` on the live librarian CLAUDE.md prints 0.
- W2: `grep -c 'any of the five above'` prints 1 (a probe only; a comment edit turns it).
- W3 and W4: `wake-gate.js` and `sessionstart-body.js` absent (0 of 2).
- From the second readers [summary]: the window-path count (20 touched, 7 named); O's rows 52136-52137 activating on a port
  of `activated_by_use`; 3 of 9 wakes with a second full write after a model switch.
The registered "level two did nothing" falsifier does not fire. The unit tests that would turn green after the build are
designed only; none exists yet [read: spec:700].

## 6. THE STOP RULE (`plan_wake_level2_swarm_2026-11-13.md:32-33`)

There are specific open questions whose answers change what gets built. Each is answered by a probe or a one-line read, not
by more reading. **So the rule's condition is met, and a third READING level is not warranted: run the probes below.**

**Q1. On 2.1.323, does a running session re-attach a changed instance CLAUDE.md at its next turn, with no restart and no
compaction?**
- Yes: W1d becomes the main fix for the recorded case. The app rewrites a seat's shelf after a pull that brings the other
  machine's commits, and the seat gets the post-pull shelf at its next prompt, so the 08:43:40 pull would have reached it
  minutes later with no restart. It also refreshes the shelf before every later compaction (the 11-12 L case). F1b stops being
  load-bearing. Cost: one shelf re-write, about 37-39k tokens per seat per rewrite, so rewrite on other-machine pulls only.
- No: W1d reaches compactions only; W1 needs a restart; W5 stays the only route to a fresh shelf at a wake, and E2 matters.
- Cheapest: ten minutes, one pane, a scratch directory, never a seat. Run one `claude` session with token A in its
  CLAUDE.md. Prompt once, rewrite the file to token B, prompt again. Count `instructions` rows with `changed: true` after the
  second prompt, and check whether the reply names B. Pass `--setting-sources project,local` so no room hook fires.

**Q2. On 2.1.323, does the root-level JSON from `precompact-preserve.js` reach the summariser?**
- Yes: W2 keeps its shape and its tests at `:32-44`.
- No: the output becomes plain text and those tests change. A W2 built on the current shape would be inert.
- Cheapest: the spec's own step 1 (spec:250-262), with the second reader's `--setting-sources project,local`. One manual
  `/compact` in the scratch session already shows "completed successfully" or "failed" (compact:129-132).

**Q3. Is L's `gates_mode` strict?**
- Strict: W1 reaches L only with the strict-branch reorder (his word) or with L switched to light (his key).
- Light: W1 as specced reaches both machines; no strict-branch work.
- Cheapest: one read of `gates_mode` in L's `~/.consonance.json`, by any seat on L. One minute.

**Q4. Would a 120 s silence-bounded fetch have finished this morning's catch-up?** It cannot be replayed from D's disk.
- Yes: F1b as specced, with `fetch.unpackLimit`.
- No: the pull moves off the launch's critical path (fetch with the app open, then Q1's rewrite), or the 85 MB daily
  encrypted transcripts leave the repo (his call, spec:518-520).
- Cheapest: build F1 alone first; its `bytes_received`, `fetch_ms` and `last_progress` at the next large catch-up answer it.
  If Q1 is yes, Q4 matters less.

Not a build question: whether W4 refuses in light, and every compaction option (A, B, B', D, C4). Those are his words, not
unknowns.

## 7. Five checks to run before building anything from this folder

1. **Probe Q1** (section 6). It decides whether W1d joins the lap and whether F1b is still needed. Scratch session only.
2. **Probe Q2** (section 6) before any edit to `precompact-preserve.js`.
3. **Read L's `gates_mode`** (Q3) before W1's strict-branch question goes to him.
4. **Run `light_the_librarian_intake_is_under_target_with_the_cards_and_the_room` on today's tree**, in a pane holding the
   build lock. If `main.rs:9154` (`i.len() + 25_000 <= strict.len()`) is already red, the landing suite is red before W1, and
   his ruling on the 25 KB margin is needed first (shelf:241-246) [read: `main.rs:9153-9154`].
5. **Re-run the red probes at the build's HEAD**, with `git diff --stat 3f5fa65d HEAD -- consonance dev` empty: `--disk-usage`
   against the `tmp_pack_*` sizes, created inside the launch window; the live CLAUDE.md grep; the two absent hook files;
   `launch-pull.json` absent. Then score the item-6 bar with `measure.js --after 2026-10-05T21:09:40Z`, by a non-author, before
   W2 adds a class (spec:247-249).

None of these compacts or cuts a seat, writes `~/.claude` or `C:/Consonance`, or needs a rebuild. The build itself needs his
word to start Lap W (plan:74).

## What I did not open

- L's disk, config and transcripts.
- Any transcript text: only row types, flags, lengths, timestamps, usage numbers and file paths.
- The value of the `reason` field on `instructions` rows (13 characters). I read only its length and the `changed` flag.
- `dev/stick-apply.js` beyond its header and spawn lines. Whether it clears the environment before relaunching is inferred
  from a grep.
- The Claude Code binary; `docs/` pages other than cli-reference, prompt-caching, memory, context-window and hooks
  (downloaded with curl into my scratchpad `critic_docs/`).
- The scratch scripts of the other readers. I re-ran none of them; the counts I give are from my own `critic_ss*.js`.
- `measure.js`, the Rust and node test suites, `install.ps1`: none was run.
- The room-better swarm files other than `in_wake.md`.
