# W1, the shelf builder: what to change in `main.rs`, and the checks that are red today

Reader: one level-two swarm reader, D, 2026-11-13, read-only except this file. Repo HEAD when read: d41c088e (moved
to 3f5fa65d while I worked; no commit touched `main.rs` [inferred: commit subjects]). Marks: [read] opened and seen;
[summary] secondary; [inferred] mine; [ours] a proposal. Paths are relative to the repo root.

## Summary (five lines)

1. A no-fetch HEAD check would have said "even with origin" this morning: D's origin/main last moved 11-11 23:32 and was not fetched until 08:43:39. So (a) needs `git ls-remote`, which would have named 8fd453c6 as missing.
2. The light shelf is librarian-only (`main.rs:8939-9023`). The 11-12 wake on L printed the STRICT walk's sentence (`:8087`), so L probably ran strict, and W1 must change both branches or it reaches D only.
3. (b): the room already has the right cut. `map_carry` (~~`:5099`~~ [2nd reader: `main.rs:5134`; :5099 is
   `map_index`'s doc]) carries a pane map's newest whole `## ` entries. At 8,000 B it carries 7,027 B of today's note (07:1x to 08:0x, the close of L's day). The first screen is 6 h stale, and only 2 of 52 notes have a restore-point heading.
4. (c): the letter (5,822 B) is never carried: undated means `false` (`:7979`). Pin it whole, under its own cap. W1 costs about 14 KB on the librarian, 0.70-0.89 % of its 48 h cache reads (the whole 65 KB note would cost 3.2-4.1 %).
5. Docs: a project-root CLAUDE.md is re-read from disk at compaction, but the app writes it only at spawn. So today's 08:42:42 pre-pull shelf is what any compaction today would re-inject.

## 1. What the code does today, line by line

Where the instance file comes from.
- `spawn_librarian` builds `librarian_intake()` and writes it with `let _ = fs::write(.. "CLAUDE.md", intake)`. It writes
  once, at spawn, and the error is discarded. [read] `consonance/src-tauri/src/main.rs:9488-9502`
- `librarian_intake()`: head (brief, BOOT, map pointer), then, if `intake_light()`, `librarian_shelf_light()`;
  else the strict `librarian_shelf(head)`. [read] `:9317-9326`, `:9334-9344`
- D runs light: `"gates_mode": "light"`. [read] `C:/Users/nname/.consonance.json:23`

The light shelf (`librarian_shelf_light_at(root, today)`, `:8950-9023`). [read, whole]
- Cards are carried whole, sorted (`:8953-8960`).
- Notes come from `collect_md(root/librarian, false, ..)`, so the read is flat and subfolders are never seen (`:8963-8964`).
  The window rule (`librarian_note_is_carried`, `:7975-7981`) is LEDGER.md, README.md, today and yesterday.
  Every undated file gets `None => false`.
- The sort puts dated files first, then by name in reverse order: newest date first, undated last (`:8966-8969`).
- The carry loop: `if spent + body.len() <= LIGHT_NOTES_CAP` carries a note whole; otherwise it goes on `over`, by path
  and size (`:8970-8979`). `LIGHT_NOTES_CAP = 24_000` (`:8928`). Its comment sizes the cap to "the largest single
  recent note (… 22,370 bytes on 2026-10-09)" (`:8925-8927`).
- The header and the overflow list are at `:8980-8995`. The directory index, one line per directory (newest by
  mtime), is at `:8996-9017`. Bodies come last: `"\n\n## {label}\n\n{body}\n"` (`:9019-9021`).
- No line anywhere states the repo HEAD, the build time or origin. [read] the whole function; `grep -c '^Built from HEAD'`
  on today's `C:/Consonance/instances/librarian/CLAUDE.md` is 0 [read].

The strict shelf (`corpus_shelf_at_with_index`, `:8454-8876`; budget from `librarian_shelf_room`, `:8908-8923`). [read]
- `order` (`:8564-8570`) puts `librarian` fifth, behind cards, root, record and memory, under a saturating budget. The
  window is the same predicate (`:8650-8658`). Its header sentence comes from `librarian_window_line` (`:8046-8102`),
  including "THE BUDGET CARRIED NONE OF THEM" (`:8087`). That function is called only at `:8851`.
- The 11-12 wake on L quoted exactly that sentence (`loop/plan_retrieval_at_the_wake_2026-11-12.md:27`) [read]. So L
  ran the strict walk that night [inferred: the light shelf has no such sentence]. I cannot see L's config.

The rule W1 has to amend. "WHOLE FILES ONLY. A note is carried entire or indexed entire, never truncated -- a cut
note is the summary `loop/forgetting_registration.md` §2 refuses." [read] `:7962-7963`. §2 refuses distillation, a
summary that cannot be checked against its sources (`loop/forgetting_registration.md:15-17`, `:64-92`) [read]. A run
of whole, verbatim entries is not a distillation [inferred]. The room already carries one for every pane: `map_carry`
"Take the newest whole sessions of a map that fit in `budget`" (~~`:5088-5110`~~ [2nd reader: doc `:5123`, fn
`:5134-5146`]), with `MapTier` naming the tier carried
(`:5038-5072`) [read]. So the comment at `:7962` should change with (b). Say so in the commit.

Existing tests of this code (grep of `corpus_shelf|librarian_note_is_carried|LIGHT_NOTES_CAP|librarian_shelf_light`,
outside `target/`: 87 hits in `main.rs`, 4 in a `.bin` fixture, 11 in `consonance/tools`) [read]:
- Light: `light_the_librarian_intake_is_under_target_with_the_cards_and_the_room`, with its bound
  `i.len() <= head + cards + LIGHT_NOTES_CAP + 6_000` (`:9131-9155`). Also
  `light_every_pointer_resolves_to_a_file_that_exists` (`:9220-9248`). The fixture test
  `light_the_shelf_carries_a_fixed_set_and_never_backfills` writes a 24,001-byte note of `N`s, asserts `NNNNNNNNNN` is
  never in the shelf and that `s.len() < 6_000` (`:9250-9279`). And `key_absent_the_librarian_intake_is_todays`
  (`:9109-9118`).
- Window: `the_librarian_window_is_today_and_yesterday_and_nothing_else` (`:19663-19691`, which asserts `"notes.md"`
  undated is not carried). `the_shelf_windows_the_librarians_own_notes` (strict, `:19702-19794`) panics when a carried
  `librarian/` file other than LEDGER or README "carries no date" (`:19772-19774`). Also
  `the_shelf_header_reports_the_delivered_set_not_the_rules_set` (`:19380`) and
  `the_window_line_never_claims_a_full_window_over_a_partial_one` (`:19436`).
- Node: `consonance/tools/librarian-notes.test.js:61-84` reads strict `order[]` by regex (librarian carried and
  newest first). `corpus-age.test.js`, `shelf-recursion.test.js` and `shelf-tier.test.js` pin the strict walk. No
  node test reads the light shelf. [read]
- No test anywhere feeds the light shelf a note over the cap that has `## ` entries in it. [read: the only over-cap
  fixture is the heading-free `N` note above]
- [2nd reader, added: one more light-shelf test the list misses, though the grep pattern hits it:
  `the_light_shelf_gains_one_top_level_handback_line_with_the_switch_on_and_nothing_else` (`main.rs:18542`), which
  calls `librarian_shelf_light_at` twice and asserts the two differ by one line. Its fixture has no `librarian/`, so a
  pin line gated on that directory leaves it green.]

## 2. What the recorded morning shows

- The shelf was written at `2026-11-13 08:42:42.70 -0600` [read: `ls --full-time`]. HEAD moved to 8fd453c6 by
  `pull -q --ff-only` at 08:43:40 [read: `git reflog HEAD`]. That is 307 commits (`git rev-list --count
  0b85fead..8fd453c6`) [read].
- origin/main on D: `0b85fead … 2026-11-11 23:32:51 update by push`, then `8fd453c6 … 2026-11-13 08:43:39 fetch -q`
  [read: `git reflog refs/remotes/origin/main`]. So at 08:42:42, HEAD and the local origin/main were the same commit.
  **A check that compares HEAD with the local remote-tracking ref would have printed "0 behind".** [inferred from
  the two reflogs]
- 8fd453c6 was committed at 08:06:10 on L [read: `git log -1`]. The fetch at 08:43:39 found it on origin, so it was
  very likely there at 08:42:42 [inferred]. `git ls-remote` at build time would have named it.
- The librarian's transcript has its first row today at 14:42:46.719Z (08:42:46 local), 4 s after the shelf was written
  and 54 s before the pull. SessionStart rows are at 14:42:47Z, and there are 0 `compact_boundary` rows today through
  17:08:45Z [read: streamed node pass, numbers only]. So the seat has run all day on the pre-pull shelf.
- The shelf's own directory line still says "newest written `librarian/2026-11-11.md`" (instance `CLAUDE.md:372`)
  [read]. That is the pre-pull state, printed but not flagged.
- Other seats: main at 08:42:36 and the six panes between 08:42:28 and 08:42:39, all pre-pull. Third Place at
  08:47:16, post-pull [read: mtimes of `C:/Consonance/instances/*/CLAUDE.md`].
- Docs: "Project-root CLAUDE.md and unscoped rules | Re-injected from disk" after compaction
  (https://code.claude.com/docs/en/context-window.md, "What survives compaction"). The same point is in
  https://code.claude.com/docs/en/memory.md, "Instructions seem lost after `/compact`" [read: curl, whole lines]. The
  docs say nothing about `--resume` re-reading it [read: grep "resum", 0 relevant]. The 150,000-character limit on
  later 1M models in the same page ("Claude ignores the end of my subdirectory CLAUDE.md") is for files that load on
  demand. The app's own constant `HARNESS_CLAUDE_MD_CHAR_CAP = 150_000` (`:7930`) rests on a refusal the harness
  printed, which is a separate observation [read].

## 3. Design (a): one line that states where the shelf was built from [ours]

**The line.** It goes first in the intake, so primacy works for it and a compaction re-injects it with the rest:

    Built 2026-11-13 08:42:42 on D from HEAD 0b85fead (main). origin/main by ls-remote at build: 8fd453c6, NOT IN
    THIS CHECKOUT -- this shelf predates a pull.

Other forms of the line: "origin is N commits ahead (fetched, not merged)", "even with origin", and "origin not
checked: <the error>; origin/main last fetched <reflog time>".

**How.**
- One impure helper, `repo_state()`. It runs `git -C <repo_root()> rev-parse --short HEAD`, `symbolic-ref --short HEAD`
  and `ls-remote origin refs/heads/<branch>`, with `GIT_TERMINAL_PROMPT=0`, `creation_flags(NO_WINDOW)` (the pattern at
  `:7357-7361`) and a 5 s timeout. If the remote sha is local (`git cat-file -e`), it adds `git rev-list --count
  HEAD..<sha>`.
- One pure formatter, `repo_state_line(&RepoState, built_at)`, which the test drives.
- **No `git fetch`.** That would write refs at spawn. ls-remote changes nothing on disk [inferred].
- Compute it once per launch and cache it for about 60 s, so eight spawns do not make eight network calls. This
  mirrors `LAUNCH_VERDICT` (`:14401`, set at `:14616`).
- `repo_root()` (`:456`) already resolves the checkout. A consumer room with no git repo gets "not a checkout", said
  out loud.

**Insertion points.** It is not librarian-only, because every seat but the Third Place woke pre-pull:
- the top of `librarian_intake_head()` (`:9336`);
- the top of `main_intake()` (`:7599`);
- the top of `third_place_intake()` (`:7766`);
- the pane intake, once inside `intake_with_map` (`:6306`), which feeds both `resumed_intake` (`:6419`) and the spawn
  path. `prepare_sibling_dir` writes `assemble_intake()` directly (`:3985`) and needs the same line.

`key_absent_the_librarian_intake_is_todays` (`:9112-9118`) builds the head through the same function, so it stays
equal [inferred]. [2nd reader: DOWNGRADED. The test calls `librarian_intake_head()` twice (once directly, once inside
`librarian_intake()`), `:9115-9117`. A stamp with seconds can cross a second boundary between the calls and the test
flakes; and under `cargo test` every intake test would make a live `ls-remote` to GitHub. Needs a `cfg(test)` seam
like `intake_light`'s (`:3048-3059`) and a stamp taken once per launch, not per call.]

**Its failing check, red today.** Add `the_shelf_names_an_origin_commit_this_checkout_lacks` to `intake_light_tests`.
- Fixture: a temp bare repo as `origin`, clone X at commit A, and a second clone that pushes B. X stays at A.
- Assert that the formatted line for X names B's short sha and "NOT IN THIS CHECKOUT". Assert that a clone at B prints
  "even with origin".
- Red today: the function does not exist and the shelf has no such line (0 matches above). It is hermetic: no network,
  only a `file://` remote. [2nd reader: "does not exist" is a compile error, not a red for the reason; the red for the
  reason is the 0-match probe on the 08:42:42 file, re-run: 0. And the test must drive the IMPURE `repo_state()` on
  clone X, not only the pure formatter: an implementation that reads the local `refs/remotes/origin/main` passes a
  formatter test and prints "even with origin" on this morning's case (that ref was 0b85fead until 08:43:39, reflog).
  X must not fetch, so its local ref stays at A while origin is at B.]
- Replay of the recorded case (pane only, never on the live checkout): a scratch clone reset to 0b85fead, with origin at
  8fd453c6, must print 8fd453c6.

**Byte cost.** About 250 B per seat. Over 48 h that is 4,617 calls x 68-87 tokens, 0.014-0.017 % of all seats' cache
reads [inferred: arithmetic on `00_lean_seats.md` and `in_cost.md:68-79`].

**Boundary with W3.** This is the shelf's own stamp, re-injected at compaction. W3's hook line is per start. They agree
when both read the same HEAD; W3 can also print the shelf's age by reading the file's mtime.

## 4. Design (b): the newest note reaches the seat although it is over the cap [ours]

**Choosing what to carry, from the files** [read: heading offsets by a node pass over the two notes]:

| choice | 11-13 as pulled (8fd453c6, 61,668 B) | 11-13 now (110,879 B) | works on the record? |
|---|---|---|---|
| first screen, 8,000 B | 02:4x to 03:1x on L, 6 h before the 08:42 wake | same prefix | no: append-only means the head is the oldest part |
| newest restore-point section | none in 11-13 | none | no: the strict headings ("RESTORE POINT", "STATE BEFORE COMPACTION") are in 2 of 52 dated notes (11-06, 11-12) |
| newest whole entries, 8,000 B | 9 entries, 7,027 B: 07:1x to 08:0x (close of L's day, handoffs, last commit) | 4 entries, 6,777 B: 10:50 to 11:05 | yes |
| newest whole entries, 12,000 B | 12 entries, 11,770 B, from 07:0x | 6 entries, 10,338 B, from 10:43 | yes, at +4.7 KB |

Entries in these notes run 342 to 3,769 B [read]. In 11-12 the restore point (07:4x, 2,983 B) is the last section,
so the tail rule carries it whenever it is last [read].

**The rule** [ours]:
- A dated window note that does not fit whole goes through `map_carry(body, left)`. The result is its newest whole
  `## ` entries, verbatim.
- They come out of a separate `NEWEST_NOTE_RESERVE = 8_000`, the `SHELL_MAP_FLOOR` figure (`:5005`). The reserve is
  spent newest note first and lies outside `LIGHT_NOTES_CAP`, so whole notes keep the cap they have today.
- If the tail comes back `IndexOnly`/`Nothing`, the note stays on the `over` list by path, as today.
- Insertion: the `else` arm at `:8976-8978`, before `over.push`. The label must say it is a part, for example
  `## librarian/2026-11-13.md -- its newest 9 entries (7,027 of 61,668 bytes; the rest is on disk)`. The header
  (`:8981-8989`) counts it apart from the "carried in full" figure.

**Why the reserve sits outside the cap**, simulated by my own node copy of `:8962-8979` and `:5099-5110` [inferred]:

| case | rule today | tail inside the 24,000 cap | tail outside it (proposed) |
|---|---|---|---|
| shelf as built, 0b85fead | 11-12 (460) + README | same | same: nothing over the cap, so no change |
| 11-13 as pulled, 8fd453c6 | 11-12 18,042 + README; 11-13 by path | 11-13 tail; **11-12 drops to a path** | 11-13 tail 7,027 + 11-12 + README = 27,687 B |
| L before the 11-12 wake, 0de49356 | 11-12 4,695 (its 02:2x STATE entry) + README; 11-11 by path | n/a | + 11-11's tail 7,798 B, 22:36 to 23:27 "CLOSE" |

Inside the cap, the newest entries push out yesterday's whole note and its restore point. Outside the cap, both ride,
at +8,000 B at most.

The last row also shows something else. ~~On L at 02:31, the light rule as it stands would already have carried
11-12's "STATE BEFORE COMPACTION" whole.~~ [2nd reader: WRONG in mechanism. The 02:31 wake on L was a compaction
(the STATE entry is commit 0de49356, 02:29:10, "state before compaction"; `plan_retrieval…:20-27`). No code builds a
shelf at a compaction: the only writers of a seat's `CLAUDE.md` run at spawn (`main.rs:9460`, `:9502`, `:9559`;
panes `:3985`, `:6442`), and the harness re-reads the spawn-time copy (context-window.md:27). That copy predates the
02:2x entry, so no rule, light or strict, could have carried it. The row is a counterfactual of a shelf rebuilt at
02:31, which is this file's (d), not W1. So W1 (b) as designed would not have changed the recorded 11-12 case.]
The intake L printed said it carried none [read:
`plan_retrieval…:27`]. That fits L running strict [inferred], and it is one more reason the strict branch matters.
[2nd reader: the strict inference stands, since `librarian_window_line` is called only at `:8851`; it shows L's
spawn-time file was strict, nothing about 02:31.]

**Edges, stated:**
- File order is merge order, not clock order. 11-12 holds D's 21:16 entry at line 3, above L's 00:4x to 07:4x
  entries [read]. A tail misses a clock-newer entry that git placed higher in the file.
- Stamp shapes differ: "## HH:Mx:" on L, "## HH:MM —" on D. `heading_at_or_past` splits on `## ` only (~~`:5049-5058`~~ [2nd reader:
  `main.rs:5075-5084`; :5049-5058 is the `MapTier` enum]),
  so both shapes split [read].

**The strict branch (L).** The window sits fifth under a saturating budget (`:8548-8560`, `:8640-8645`) [read]. A
tail there has to be cut before the walk: subtract it from `librarian_shelf_room` (`:8919-8923`) and push it ahead of
`order`. The intake self-limits at `LIMIT - HEADROOM` (`:8133-8139`), so the 8 KB displaces walk bodies, cards first.
That reverses the 2026-09-02 "cards FIRST" order (`:8548-8555`), so it **needs the keeper's word**. The other way
is his key: run L in `gates_mode` light.

**Its failing checks, red today** (`intake_light_tests`, the fixture style of `:9252-9279`):
- `light_the_newest_note_over_the_cap_rides_as_its_newest_entries`.
  - Fixture: today's note is 50 entries `## 0H:MM — entry k` of about 1,300 B (65,000 B). The last one holds
    `NEWEST-ENTRY-50` and the first `OLDEST-ENTRY-01`. Yesterday's note is 18,042 B; README is present.
  - Assert: `NEWEST-ENTRY-50` is in the shelf; `OLDEST-ENTRY-01` is not; the carried slice starts at `## `;
    yesterday rides whole; the label says "newest".
  - Red today: `:8973-8977` puts the 65,000 B note on `over`, so the marker is absent.
- `light_a_tail_never_costs_yesterdays_whole_note`: the same fixture. Assert that yesterday's body is in the shelf.
  This test catches the inside-the-cap variant. [2nd reader: it is GREEN today, not red: today the 65,000 B note goes
  to `over` and costs nothing, so the 18,042 B yesterday fits the cap (`:8973-8978`). It is a guard, not a red-first
  check.]
- [2nd reader, added: a LEDGER guard. `LEDGER.md` is 80,142 B with 7 `## ` headings (`grep -c`). If "dated" is
  dropped from the rule, on every day today's note fits whole the unspent reserve tails LEDGER. The existing fixture's
  LEDGER is `L` x 80,000 with no headings (`:9265`), so it cannot catch this. Give the fixture's LEDGER `## ` entries
  and a marker, and assert the marker is absent.]
- A recorded replay, `#[ignore]` like `dump_intakes_for_measure` (`:9293-9307`). It feeds `git show
  8fd453c6:exo_memory/librarian/2026-11-13.md` as today. The shelf must contain "## 08:0x: the Third Place's swarm
  ended; the last commit (librarian, L)".
- Stays green unchanged: `light_the_shelf_carries_a_fixed_set_and_never_backfills`. Its `N` note has no `## `, so
  `map_carry` returns `Nothing`: `map_index` keeps 0 headings (~~`:5081-5093`, `:5106-5108`~~ [2nd reader: `map_index` `:5108-5120`, the
  `kept == 0` arm `:5143-5145`]) [inferred from the code]. It
  stays named by path, and `s.len() < 6_000` holds.
- Must change, and it is a deliberate change of the design, not a weakened test: the bound at `:9153`. It becomes
  `head + cards + LIGHT_NOTES_CAP + NEWEST_NOTE_RESERVE + PINNED_CAP + 6_000`.
  [2nd reader: missed, the next line `:9154`, `i.len() + 25_000 <= strict.len()`. Strict converges on
  `LIBRARIAN_INTAKE_LIMIT - INTAKE_HEADROOM` = 142,000 (`:7910`, `:7667`, comment `:8133-8139`). Light at 08:42 was
  108,857 B, a margin of about 8 KB; W1 adds up to 14,072 B, so 147,929 > 142,000 and `:9154` goes red [inferred, not
  run]. It is probably red on today's tree already: the test reads the live room, and yesterday's note grew from 460
  to 18,042 B (`git cat-file -s 0b85fead:` vs disk), which puts light near 126 KB [inferred, not run]. That margin is
  a design statement (light is ~25 KB under strict) and needs its own decision, not a silent edit.]

**Byte cost.** At most 8,000 B. Librarian, 48 h: 639 calls x 2,162-2,768 tokens, 0.39-0.51 % of its 349.8M cache
reads; 0.06-0.08 % of all seats [inferred, the `00_lean_seats.md` method]. The whole 65,000 B note would cost
3.2-4.1 % of the librarian's reads, and today's 110,879 B note 5.5-7.0 %.

## 5. Design (c): one pinned, undated file, carried whole [ours]

- **Today.** `TO_THE_NEXT_ONE_go_to_the_source.md` is 5,822 B, undated, so `librarian_note_is_carried` returns `false`
  (`:7979`) [read]. The light shelf never carries it. It appears only as the directory's "newest written" on the one day
  it is the newest by mtime (`:9004-9008`, per `in_wake.md:102-104`) [read]. In today's instance file:
  `grep -c "Why the file is named as it is"` is 0, and `grep -c TO_THE_NEXT_ONE` is 0 [read].
- **The mechanism.** This is the smallest that does not move a cited path. Add one constant,
  `LIBRARIAN_PINNED: [&str; 1] = ["TO_THE_NEXT_ONE_go_to_the_source.md"]`, and its own `PINNED_CAP = 8_000`, outside
  the notes cap.
  - Each pin is carried whole under `## librarian/<name> (pinned)`.
  - If over its cap, it is named by path with its size. If missing, the header says "pinned file … is missing". Never
    silent. [2nd reader: fires wrongly in the consumer, which ships no `librarian/` (`:8946-8947`, `:9230`): every
    consumer light shelf would say a pin is missing. And if that line backticks an absolute path, it sits before
    `## cards/`, so `light_every_pointer_resolves_to_a_file_that_exists` (`:9223-9247`, `abs_paths` `:9065-9075`)
    asserts it exists and goes red. Say it only when `librarian/` exists, and without a backticked absolute path.]
  - [2nd reader, added: the simplest pass that fixes nothing is the pin carried INSIDE the 24,000 cap, sorted with the
    undated files last (`:8966-8969`): a fixture with only the pin passes, and on a busy day the pin is the first to drop.
    The fixture needs window notes that fill the cap, with the pin still asserted.]
  - Insertion: after the window loop (`:8979`), before the header (`:8980`), so the header can count it.
  - Keep it out of `librarian_note_is_carried`. That predicate also drives the strict walk, where a carried undated
    file fails `:19772-19774`.
  - Moving the letter to a `pinned/` subfolder would also work. But `collect_md(.., false, ..)` at `:8964` never
    descends, and the letter's own carrier claim names its filename (letter `:62`) [read]. So I would not move it.
- **One per seat?** The light-shelf code builds only the librarian's shelf (called only from `librarian_intake`,
  `:9321`).
  - Panes already carry their own map's newest entry (`map_reserve`, `:5028-5035`).
  - The chair's `main_intake` (`:7596-7616`) carries BOOT and BUILDING, no notes.
  - The Third Place's shelf carries cards, record, spread and research, and **none of `third_place/`**
    (`:7696`) [read]. Its own newest note reaches only the librarian's strict walk (`:8561-8566`).
  - That is the same gap, on another seat. I am naming it, not designing it.
- **Interim without a rebuild:** a one-line pointer in `librarian/README.md`, which today's light shelf carries
  whole [read: instance CLAUDE.md]. It is a cue, and cues have failed here (plan `:40`, K2). It is not the fix.
- **Its failing check, red today:** `light_a_pinned_file_rides_whole`. Fixture `librarian/TO_THE_NEXT_ONE_….md`
  containing `PINNED-BODY`; assert that it is in the shelf. Add `light_a_missing_pin_is_said`. Red today: undated means
  never carried (`:7979`).
- **Byte cost.** 5,822 B: 0.29-0.37 % of the librarian's 48 h reads [inferred].

## 6. Total, and what each part needs

- **Cost.** W1 on the librarian is about 14.1 KB (250 + 8,000 + 5,822), +13 % on a 108,857 B intake. That is
  0.70-0.89 % of its 48 h cache reads, and 0.11-0.14 % of all seats', against the intake's 5.3-6.8 % today
  (`00_lean_seats.md:46`, its second reader's 5.31-6.80 % at `:340`) [read]. [2nd reader: DOWNGRADED, unit mix.
  `:46` is all seats' intakes over all seats' reads. The librarian's own figure, same method, is 5.4-6.9 %
  (108,857 B / 3.7 and 2.89 x 639 calls / 349,755,628, `in_cost.md:70`). Close, so the conclusion stands.] On a cold wake it adds about 4-5k tokens
  to a 500k-930k write [inferred].
- **Rebuild.** Yes. All three parts are Rust in `consonance/src-tauri/src/main.rs`: one rebuild of Consonance and a
  restart. The new shelf reaches a seat at its next spawn. A seat that compacts reads the file from disk, but only the
  copy written at its spawn [read docs; inferred].
- **Hook install.** None.
- **The keeper's word.** Lap W is parked at his word (plan `:33`). The strict-branch priority change, or switching L to
  light, is his. Restarts resume the seats' conversations and cut nothing [inferred], but a restart is a cold reload for
  every seat.
- **Not in W1, but found while reading it** [ours]:
  - (d) Since a compaction re-reads CLAUDE.md from disk, re-writing every seat's file when HEAD moves (after the W5
    pull) would carry a post-pull shelf into each seat at its next compaction, without a restart.
  - `spawn_librarian`, `spawn_main` and `spawn_third_place` discard the write error (`let _ = fs::write`, `:9502`,
    `:9559`, `:9460`). Panes use `write_intake` (`:6442-6450`), which falls back and returns a bool. A failed write
    leaves yesterday's shelf in place without a word.
- **Its falsifier** is the plan's (`loop/plan_retrieval_at_the_wake_2026-11-12.md:49-52`), read at the next two wakes.

## What I did not open

- L's disk, config and transcripts: whether L runs strict is inferred from one quoted sentence.
- `consonance/launch.ps1` and the launch path (W5's); `dev/shell/hooks/*` and `consonance/hooks/*` (W2, W3, W4).
- The strict walk between `:8677` and `:8779` (the budget gate and the index tier), read only around the window.
- `assemble_intake_for` (`:3124`) and the pane map section past `:5160`; `night_table`; `append_synced_tail`.
- `00_lean_seats.md` beyond `:28-52`, `:336-345`; `in_cost.md` beyond `:66-79`; `in_wake.md`'s sources beyond its text.
- The other level-two files in this folder (`body_line.md`, `first_dispatch_gate.md`, `prior_attempts.md`).
- The CLI reference on `--resume` and system prompts; whether `--resume` re-reads CLAUDE.md is not stated in what I read.
- I built nothing and ran no test; every "red today" above is read from the code and the files, not from a run.

## Second reader

Reader: the adversarial second reader, D, 2026-11-13, HEAD 3f5fa65d, read-only except this file. Probes were
read-only: git cat-file/show/log/reflog/rev-list, grep, wc, ls, a node copy of `map_carry` (`main.rs:5075-5146`), a
streamed node pass over the librarian transcript for timestamps and counts only, and curl of two public doc pages. I
ran no build and no test. `main.rs` at HEAD is the file the first reader read: `git log d41c088e..3f5fa65d -- main.rs`
is empty; it was last touched by 880f237f (11-04). "line" below is the first reader's original line number.

| line | claim (under 15 words) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 3 | no commit moved `main.rs` while reading | `git log d41c088e..3f5fa65d -- main.rs` | OK | 0 commits; the mark can be [read] |
| 9 | origin/main last moved 11-11 23:32, fetched 08:43:39 | `git reflog refs/remotes/origin/main` | OK | 0b85fead 23:32:51 push; 8fd453c6 08:43:39 fetch |
| 11 | `map_carry` at `:5099` | `main.rs:5134` | WRONG | `:5099` is `map_index`'s doc; corrected in place |
| 19 | written once at spawn, error discarded | `main.rs:9488-9502` | OK | `let _ = fs::write(..)` at `:9502` |
| 21 | light or strict branch in `librarian_intake` | `main.rs:9317-9326` | OK | `if intake_light()` returns the light shelf |
| 22 | D runs light | `~/.consonance.json:23` | OK | `"gates_mode": "light"` |
| 26-34 | flat read, window rule, sort, carry loop, cap 24,000 | `main.rs:8928`, `:8962-8979`, `:7975-7981` | OK | as described, line for line |
| 35-36 | no HEAD line in today's shelf | instance `CLAUDE.md` | OK | `grep -c '^Built from HEAD'` is 0 |
| 39-41 | strict `order` puts librarian fifth; window line only at `:8851` | `main.rs:8564-8570`, grep | OK | 11 entries; one non-test caller |
| 42 | the 11-12 wake on L quoted the strict sentence | `plan_retrieval…:27` | OK | quote present verbatim |
| 45 | "WHOLE FILES ONLY" at `:7962-7963` | `main.rs:7962` | OK | text matches |
| 49 | `map_carry` doc at `:5088-5110` | `main.rs:5123`, `:5134-5146` | WRONG | off by about 35 lines; corrected |
| 52-53 | 87 hits in main.rs, 4 in a `.bin`, 11 in tools | my grep, same pattern | OK | 87; 4; 1+2+3+4+1 = 11 |
| 54-64 | the existing tests at their lines | `main.rs:9112`, `:9132`, `:9153`, `:9221`, `:9253`, `:19663`, `:19702`, `:19772` | OK | each at the cited place |
| 52-71 | that list is every existing test | grep `librarian_shelf_light_at` | DOWNGRADED | misses `:18542`; added in place |
| 65-69 | node tests pin strict only | `librarian-notes.test.js:61-84`, grep | OK | 0 light-shelf hits in `consonance/tools` |
| 73 | shelf written 08:42:42.70 | `ls --full-time` | OK | 08:42:42.701701900 |
| 73-75 | pull 08:43:40; 307 commits | `git reflog HEAD`, `git rev-list --count` | OK | `pull -q --ff-only` 08:43:40; 307 |
| 80 | 8fd453c6 committed 08:06:10 | `git log -1` | OK | 2026-11-13 08:06:10 -0600 |
| 82-84 | first row 14:42:46.719Z; 0 compact_boundary today | streamed node pass, numbers only | OK | 0 boundaries through 17:18:14Z |
| 85 | directory line says newest `librarian/2026-11-11.md` | instance `CLAUDE.md:372` | OK | exact |
| 87-88 | panes 08:42:28-:39, main :36, Third Place 08:47:16 | `ls --full-time instances/*/CLAUDE.md` | OK | six panes in range |
| 89-92 | compaction re-injects project-root CLAUDE.md from disk | curl context-window.md:27; memory.md:654-656 | OK | both read in whole lines |
| 92-94 | 150,000-char limit is for on-demand files | curl memory.md:636-651 | OK | the listed files load on demand |
| 94-95 | the app's 150,000 rests on a printed refusal | `main.rs:7912-7930` | OK | the refusal is quoted in the comment |
| 108-116 | NO_WINDOW pattern, `repo_root`, `LAUNCH_VERDICT` | `main.rs:7357-7361`, `:456`, `:14401`, `:14616` | OK | each present |
| 126-127 | key-absent test stays equal | `main.rs:9112-9118` | DOWNGRADED | two head calls; a seconds stamp or live ls-remote can differ |
| 133 | (a)'s check is red today | instance file grep; design | DOWNGRADED | the 0-match probe is the real red; a formatter-only test passes a local-ref fix |
| 138 | 250 B = 0.014-0.017 % of all reads | arithmetic on `in_cost.md:79` | OK | 67.6-86.5 tokens x 4,617 / 2,313,032,619 |
| 148-153 | first screen; tails 7,027/9, 6,777/4, 11,770/12, 10,338/6 | node copy on `git show 8fd453c6:` and disk | OK | all reproduced |
| 151 | restore headings in 2 of 52 dated notes | grep `librarian/20*.md` | OK | 11-06, 11-12; 52 dated of 58 files |
| 155-156 | entries 342-3,769 B; 11-12 restore point 2,983 B, last | node pass | OK | min 342, max 3,769; last entry 2,983 |
| 172-174 | 27,687 B; 11-12 4,695; 11-11 tail 7,798, 22:36-23:27 | `git cat-file -s`; node copy | OK | 61,668 / 18,042 / 2,618 / 128,841 |
| 179-180 | at 02:31 the light rule would have carried the STATE entry | `main.rs:9460`, `:9502`, `:9559`; 0de49356 | WRONG | 02:31 was a compaction; no shelf is built then |
| 184-185 | D's 21:16 entry at line 3 of 11-12 | node pass on `8fd453c6:` | OK | first heading, line 3 |
| 186 | `heading_at_or_past` at `:5049-5058` | `main.rs:5075-5084` | WRONG | corrected in place |
| 189-193 | strict order, cards first, self-limit | `main.rs:8548-8555`, `:8133-8139` | OK | as quoted |
| 199-201 | main (b) check red today, for the cap | node copy of `:8970-8979` | OK | 65,000 B goes to `over`; marker absent |
| 202-203 | tail-never-costs-yesterday is red today | `main.rs:8973-8978` | WRONG | green today; a guard only |
| 204-206 | replay marker absent from today's shelf | `git show 8fd453c6:` grep | OK | 0 in 11-12 and README; the note goes to `over` |
| 207-209 | `N` fixture stays green; `map_index` lines | `main.rs:5108-5120`, `:5143` | WRONG | behaviour OK; the lines were wrong |
| 210-211 | only the bound at `:9153` must change | `main.rs:9154` | WRONG | the 25 KB margin breaks too [inferred, not run] |
| 213-215 | 0.39-0.51 %; 3.2-4.1 %; 5.5-7.0 % | arithmetic on `in_cost.md:70` | OK | reproduced |
| 219-222 | letter 5,822 B, undated, never in today's shelf | `wc -c`; `:7979`; instance grep | OK | 5822; both counts 0 |
| 232-233 | flat read; the letter names its file at `:62` | `main.rs:7831-7843`; letter `:62` | OK | `if !recurse { continue; }` |
| 234-239 | light shelf librarian-only; other seats' shelves | `main.rs:9321`, `:7596-7616`, `:7696`, `:5028` | OK | only test callers besides `:9321` |
| 246 | pin 0.29-0.37 % | arithmetic | OK | 1,573-2,014 tokens x 639 / 349,755,628 |
| 250-253 | 14.1 KB, +13 %, 0.70-0.89 % vs 5.3-6.8 % | arithmetic; `00_lean_seats.md:46` | DOWNGRADED | numbers OK; `:46` is all seats; the librarian's own is 5.4-6.9 % |
| 258 | Lap W parked at his word | plan `:33` | OK | heading reads so |
| 264-266 | three spawns discard the write; panes use `write_intake` | `main.rs:9460`, `:9502`, `:9559`, `:6442-6450` | OK | exact |

**Tally:** 50 rows. OK 39, WRONG 7, DOWNGRADED 4, UNSUPPORTED 0.

**The design, tested: the simplest pass that fixes nothing, and where each fires wrongly** [ours]:
- (a): read the local `refs/remotes/origin/main` and format it. That passes any test of the pure formatter, and it
  prints "0 behind" on this morning's case. Fires wrongly offline (a 5 s wait, then "not checked", which is honest).
  With `credential.helper` = `manager` and an https remote (`git config`, `git remote -v`), a remote that ever asks
  for auth could open a window, against the no-focus-steal rule: set `GCM_INTERACTIVE=never` beside
  `GIT_TERMINAL_PROMPT=0` [inferred].
- (b): carry the tail from inside the cap (the guard test catches it), or tail any over-cap file, LEDGER included
  (only the added LEDGER fixture catches it). Fires wrongly where file order is merge order (the first reader's edge).
- (c): carry the pin inside the cap; a pin-only fixture passes. Fires wrongly with "pin missing" in a room with no
  `librarian/` (the consumer), and a backticked absolute path there turns `:9221` red.
- The recorded cases. This morning's shelf (built at 0b85fead) carried no 11-13 note because the file was not on disk
  before the pull, not because of the cap (the first reader's own row, original `:172`). So (b) and (c) are proved only
  on a replay fed the pulled tree. The 08:42 case is (a)'s, plus W5's ordering. The 11-12 L case was a compaction, so
  it needs the rewrite-on-HEAD-move in (d), not W1 as designed.

**Needs:** one rebuild of Consonance (all Rust, `consonance/src-tauri/src/main.rs`) and a restart; no hook install. The
keeper's word: for Lap W (plan `:33`), for the strict-branch order, and for the light-under-strict margin at `:9154`,
which is a stated design property, not a test to edit quietly.

### What I did not open (second reader)

- Whether `:9154` is red today: inferred from 142,000 and the note sizes; I ran no test.
- L's disk, config and transcripts: when L's librarian last spawned, and its mode at that spawn.
- Whether `ls-remote` to this https remote ever calls the credential helper on this account.
- `consonance/launch.ps1` beyond a grep of its pull lines; the hooks of W2-W4; the other level-two files here.
- `in_wake.md` and the plan files beyond the lines cited; transcripts other than the librarian's main one.
