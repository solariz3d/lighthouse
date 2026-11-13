# The path a change travels from a pane's branch to the copy a seat runs (Opus reader, D, 2026-11-13)

**Summary (five lines).**
1. Every done-word on the path (landed, pushed, read back, closed, all-clear) reads the sender or the remote, ~~never the installed copy~~.
   [2nd reader: three tools do read an installed or built copy: `-Check` `ok` by hash (`dev/shell/install.ps1:429`), the
   train's promote by sha256 (`consonance/tools/landing-train.js:362-363`), and open-items `seed-carrier` (bundled briefs
   vs repo, `consonance/tools/open-items.js:178-182`; my run today: 42 of 44 compared, no drift). What holds: none of
   them is a step of a lighthouse landing, and none runs unasked. This file's own §4 table lists two of them.]
2. The train reads back the remote ref (and promoted dreamzone-3 bytes); close.js reads the STATE repo and is pinned off lighthouse.
3. Cases (a) and (b) stopped at "landed and pushed"; (b) has cost 268 stale reads, 2,799,638 tokens on D; no (c) is on record.
4. The read-back sits in the landing hand-back: a new `landed-live.js --range`, scoped to the landing's diff (-Check is always red).
5. The other machine learns it from the pulse: chain-status.js runs from the repo on both machines, ~~so drift cannot strand it~~.
   [2nd reader: DOWNGRADED. The caller is itself an installed hook. On D it is `userprompt-submit.js`, which -Check
   reports REGISTERED, NOT DECLARED (my -Check run, output line 5019): a fresh install would not wire it. On L the
   Python pulse's registration rests on installer text from 2026-08-31 (`dev/shell/install.ps1:210`, `:1057-1067`), not on a
   read of L today. The clause is install-free; its carrier is not.]

Seat: a read-only Opus reader spawned for the swarm, on D. Lighthouse main checkout at 2c396481 (HEAD when I began, 19:0xZ).
Written about 19:20Z. The only file written in the repo is this one. Scratch files sit in my scratchpad.

Marks: [read] = I opened it or ran it (path:line at 2c396481). [summary] = from another swarm file or a secondary account.
[inferred] = mine. [ours] = a proposal. Digests carry their function. Times are Z unless marked local (-06:00).

Commands I ran (all read-only):
- `powershell.exe -NoProfile -ExecutionPolicy Bypass -File dev/shell/install.ps1 -Check`, after reading that every write sits in a
  non-Check branch (`dev/shell/install.ps1:404`, `:437-446`, `:453-469`) and the Check path exits at `:757`. Exit 1, 5,031 lines.
- `node consonance/tools/whats-live.js --warn` (report only).
- A node probe of my own in the scratchpad (`probe_live.js`): it hashes the 36 manifest entries' repo and installed copies and
  reads `~/.claude/settings.json`. It writes nothing.
- One node readline pass over `C:/Consonance/data/second-reader.jsonl`, numbers and timestamps only.
- `git hash-object`, `git log`, `git show --stat`, `git diff --name-only`, `git merge-base --is-ancestor`, `git reflog`.
- One curl of the public Claude Code hooks page (`code.claude.com/docs/en/hooks.md`, saved to the scratchpad).
- No test file was run.

---

## 1. The rules for landing, installing and pushing, and who does each

- Landings go to a pane: "Merging, conflict fixes, the full suite plus TAP, installs, the credential scan, pushes and releases are
  a landing pane's work" [read: `consonance/src-tauri/brief/BUILDING.md:52-53`]. The same list is at `:129-130`.
- The hand-back the librarian verifies carries "its suite totals, the hashes and the pushed sha" [read: BUILDING.md:53-54, :123-124].
  Success reaches the keeper only in the librarian's all-clear [read: BUILDING.md:155, :530].
- "installs" appears ~~twice~~ in the briefs, ~~both times~~ as a job name only [read: grep over `consonance/src-tauri/brief/*.md`].
  [2nd reader: three times. The third is `consonance/src-tauri/brief/COMMITTEE.md:91`, in the "prove it" tier list
  ("deletes, pushes, installs or overwrites"). It names a tier, not a check, so the point below stands.]
  No brief line says what "installed" means, how to check it, or what the hand-back says about it.
- The push gate has the form this fault lacks: the landing pane "confirms its decision for this push in `<data>/push-gate.jsonl`
  and names it, with the pushed sha, in its hand-back" [read: BUILDING.md:498-500]. "Remember-to-scan rules were followed
  0.000–0.052" is the same line's why [read: BUILDING.md:501].
- A decidable trailer exists for the consumer port, `Source-Sha:` ("a trailer is decidable and prose is not")
  [read: BUILDING.md:465-466].
- COMMITTEE.md has no install rule. Its hand-back section asks for `checked:` / `inferred:` beside a claim about state
  [read: `consonance/src-tauri/brief/COMMITTEE.md:143-149`], and "landed" or "live" is such a claim.
- LIBRARIAN.md has no all-clear rule; it lives in BUILDING.md only [read: grep "all-clear", 5 hits, all in BUILDING.md].

## 2. What each tool on the path reads back

### landing-train.js (L194, pane B, 11-13)

- It lands dreamzone-3 today. The config is per machine, in the data dir [read: `consonance/tools/landing-train.js:13-21`].
  D's data dir holds no `landing-*` file [read: ls `C:/Consonance/data`]; the 2nd reader of `00_build_paths.md` found them on L only
  [summary: 00_build_paths.md, 2nd-reader table row 124].
- `land()` scans, fast-forwards main, pushes, then asks the remote: `ls-remote` must equal the train's sha
  [read: landing-train.js:289-293]. Only then the `landed` log row [read: :296].
- The board line says "pushed and read back" [read: :405]. "Read back" there means the remote ref.
- `stage()` and `promote()` copy the CHECKED build into the main checkout, compare sha256 per file, write a stamp only when all
  match, then run an optional `launch_check` [read: :322-369]. This is ~~the one~~ installed-copy read-back on the whole path
  [2nd reader: one of two. open-items `seed-carrier` also compares built copies with the repo by md5
  (`consonance/tools/open-items.js:178-182`); it reads the app bundle, not hooks, and is not a landing step.], and it
  covers build outputs in the repo's own checkout, not `~/.claude/shell` and not `settings.json` [read].
- No step reads an installed hook or a registration [read: whole file]. The tests assert main, origin, the READY list, the
  promoted bytes and the scans [read: `consonance/tools/landing-train.test.js:67-319`, test names].
- Neither recorded case went through it: b0be06f0 is a hand merge by pane B, fe69a9fc a hand landing by pane C [read: git log].
  A train step would have caught neither [inferred].

### close.js (P-CLOSE-PUSH, L054)

- The recorded practice says close.js "after a push, the remote is asked what it holds"
  [read: `exo_memory/loop/plan_vector_swarm_2026-11-13.md:38-39`]. Exactly what it reads back:
  - the state-sync receipt, accepted only if its pid is the child close.js spawned and its stamp is after the spawn
    [read: `consonance/tools/close.js:111-124`];
  - the privacy of the STATE repo's remote, through `gh` [read: :243-252];
  - `git ls-remote origin refs/heads/<branch>` in the STATE tree (`state_dir`), before and after its own push
    [read: :127-133, :265, :308-320];
  - each machine's last push, from `machines/<tag>.json` commits in the state tree, "AS OF THIS MACHINE'S LAST FETCH"
    [read: :328-330, :341-346; `consonance/tools/state-sync.js:352-356`].
- It never reads lighthouse: a test pins that no executable line names `lighthouse` or a `REPO` [read:
  `consonance/tools/close.test.js:470-475`]. It runs when the keeper types it before the lid [read: close.js:60-63].
- So close.js is the right SHAPE (ask the target, not the sender) on the wrong object (the state set) at the wrong time (the lid).
  It is not a place for a hook read-back [inferred].

### whats-live.js (Trigger #3)

- It compares the running app's exe mtime with the newest commit under `consonance/src-tauri/src`, and the exe mtime with the
  process start [read: `consonance/tools/whats-live.js:52-69`, `:99-108`]. It also reports dreams, the board and letters.
- It does not look at hooks. Its header says a pair is added "after it bites" [read: :22-25]. ~~The hook pair has bitten 19 times
  on the ledger (the task's list)~~ [summary: 00_ledger.md].
  [2nd reader: DOWNGRADED. Of the 19 rows, L0256 (track pools), L0448 and L0765 (T-180 installs) and L0472, L0565 (briefs
  read from the build) are not hooks (`exo_memory/loop/vector_swarm_2026-11-13/00_ledger.md`, those rows). About 14 are
  hook rows. The T-180 rows are outside anything this file proposes.]
- **It is red today for the wrong reason.** My run: "the running release binary predates 53bac6a0 ... that commit is NOT live".
  53bac6a0 changes only `consonance/src-tauri/src/MAP.md` [read: `git show --stat 53bac6a0`]. The last `.rs` commit is 880f237f,
  2026-11-04 [read: git log], and the exe is 2026-11-08 23:56 local [read: ls]. The pathspec at :65-66 counts a doc file as Rust.
  A done-state instrument that is red on a doc change teaches readers to skip it [inferred].

### install.ps1 (the installer; another reader has it line by line)

- `-Check` compares the working-tree file with the installed file by hash [read: install.ps1:429], and registration by exact
  leaf in `settings.json` [read: :612-640]. It refuses `-Only` with `-Check`: "Restrict the action, never the audit" [read: :375-380].
- It exits 1 whenever anything anywhere is off [read: :757], and its own text says it "exits 1 until all of that is resolved,
  and it should" [read: :1076]. My run today: 23 ok, 10 DRIFT, 3 ABSENT, 4 declared not registered, 1 registered not declared,
  1 excluded but live; the verdict sits at lines 5,011-5,031 of 5,031 [read: my run, 19:11Z].
- So a red `-Check` carries no information about any one landing [inferred]. That is the core of why a landing pane cannot use it
  as its read-back: it was red before the landing and stays red after a correct install.
- The `Hold` branch exists and is unused: `elseif ($f.Hold)` prints HOLD and overwrites nothing, in both modes [read: :447-452].
  No entry sets it [summary: hooks_drift_D_2026-11-13.md:253-255].

### Two carriers that ARE live at the next pull, with no install

- The pulse runs `chain-status.js` from the repo working tree: on D the installed `userprompt-submit.js` joins it from `room_path`
  and keeps only the FIRST line of its stdout, 3 s timeout [read: `~/.claude/shell/hooks/userprompt-submit.js:263-268`]. The
  Python pulse, which L registers, does the same [read: `dev/shell/hooks/userprompt_pulse.py:322`; that L runs it: summary,
  hooks_drift_D_2026-11-13.md:247-249].
- `open-items.js` already hashes "THE COPY THIS MACHINE IS REGISTERED TO RUN", with settings.json as the only authority and no
  fallback path [read: `consonance/tools/open-items.js:278`, `:303-306`]. That is the right unit for a read-back: the path settings.json
  names, not the path the manifest expects.

## 3. Three recorded landings, end to end

### (a) Fix 2c, lighthouse b0be06f0, "landed and pushed, not installed on L"

| step | when | where | source |
|---|---|---|---|
| a3cefeb9 committed by pane B | 04:29:22 local (10:29:22Z) | L | [read: git log] |
| b0be06f0 merge on main | 04:29:49 local (10:29:49Z) | L, `C:\Consonance\lighthouse` | [read: git log; hand-back :94-95] |
| pushed | about 10:30Z; B rang "landed" at 10:30:41Z | L | [inferred from the ring time, `exo_memory/librarian/2026-11-13.md:143`] [2nd reader: a closer mark is on disk: B's hand-run push-gate allow row at 10:29:54Z, 5 s after the merge (`handback/p-l198-403-stall-B_2026-11-13.md:131-132`); still inferred] |
| install held by the chair | 10:33:47Z, ruling 10:36:52Z | L | [read: `handback/p-l198-403-stall-B_2026-11-13.md:63-64`, :92] |
| push gate installed instead, four checks | 10:37-10:39Z | L | [read: hand-back :92-111] |
| "Fix 2c ... NOT installed on any seat" | 13:5xZ | L | [read: hand-back :3-5] |
| b0be06f0 reaches D's checkout | pull 08:43:40 local (14:43:40Z) | D | [read: git reflog; merge-base] |
| installed on D | never; and it cannot be live on D | D | see below |

- On D the installed `board-digest.js` is git-blob 142a6541, the blob of 2c7b3872 (2026-08-25); HEAD's is 8b504225
  [read: my `git hash-object --path`]. `board-digest.js` is in no `$register` entry and has 0 hits in D's settings.json
  [read: grep]. So on D the fix is DRIFT and NOT RUN HERE: an install would copy it and nothing would run it [inferred].
- On L it is registered by hand ("REGISTERED, NOT DECLARED", `dev/shell/install.ps1:1069-1072`) [read], so on L it is OWED.
  [2nd reader: DOWNGRADED. That text was written on L about 2026-08-31 (`install.ps1:1057`). Dated support from L: "It is
  already wired (`settings.json:39`)" (`handback/p-l096-roster-E_2026-09-23.md:116`), and on 11-13 B wrote that alone it
  would make "the `[panes]` block ... vanish for every seat" (`handback/p-l198-403-stall-B_2026-11-13.md:80-81`). No read of
  L's settings.json today.]
- The trap a bare `-Only board-digest.js` held: the repo copy requires `sealedGate` from `blind.js`, which L's installed `blind.js`
  lacked, so alone it "would throw on every prompt" [read: `librarian/2026-11-13.md:164`; hand-back :6]. L0020 is the same trap on
  2026-08-17 [read: ledger L0020; install.ps1:130-134]. A read-back must check a changed hook's local requires too.
- **What told a seat:** prose only, each written by a seat that looked: the commit body ("Not yet installed on L"), the merge body,
  the hand-back, `map/B.md:2186`, `librarian/2026-11-13.md:143`, `loop/handoff_lighthouse_2026-11-13-L.md:59`; on D, the hooks
  reader's `in_hooks.md` finding 4 and `hooks_drift_D_2026-11-13.md` §3 [read: each]. ~~No instrument printed it to any seat on either
  machine.~~ [2nd reader: WRONG as worded. `-Check` printed `DRIFT    board-digest.js` on L to pane B in its bare run of 10:2xZ
  (`handback/p-l198-403-stall-B_2026-11-13.md:86-90`) and to the librarian at 10:33Z (`librarian/2026-11-13.md:145`); P's
  -Check printed it on D this morning (`hooks_drift_D_2026-11-13.md:12`). What holds: no instrument printed it unasked, or tied
  it to the landing; each print reached only the seat that chose to run -Check, and it was one line among 15 DRIFT.]
  The fix was for a stall that no seat was told about; its own delivery repeated the shape [inferred].
- [2nd reader: a recorded precedent of the same landing, lapsed. D130 (1c0acf7f, 2026-09-24) gave board-digest.js its
  `sealedGate` require; D132's hand-back printed "DRIFT blind.js, board-digest.js ... NOT live on D until someone runs -Only
  on them" (`handback/p-d132-settings-E_2026-09-24.md:92`). D's installed board-digest.js is still 2c7b3872 (08-25) and L's
  blind.js still lacks `sealedGate` on 11-13: that change was told in a hand-back and never became live on either machine.]

### (b) The second-reader narrowing, bd576735, "never reached D" (ledger L0613)

| step | when | where | source |
|---|---|---|---|
| ruling: "The installed hook copy is replaced only at the restart" | 11-03 | — | [read: `loop/plan_room_fixes_2_5_2026-11-03.md:20`] |
| bd576735 committed by pane P (D631) | 09:24:54 local (15:24:54Z) | D, worktree `lh-d631-p` | [read: git log; `handback/p-d631-reader-narrowed-P_2026-11-03.md:3`] |
| P: "Nothing installed ... until the restart"; names `-Only second-reader.js,second-reader-worker.js,second-reader-note.js` | 11-03 | D | [read: p-d631 :125-126] |
| merged in D635 by pane C | 11-03 | D | [read: `handback/p-d635-room-landing-C_2026-11-03.md:1-5`] |
| C: "the restart step should run P's installer path ... I have not read P's install steps" | 11-03 | D | [read: p-d635 :74-78] |
| pushed, origin/main fe69a9fc, push-gate allow | 17:09:36Z | D | [read: `map/C.md:1805`] "no swap" |
| the app rebuilt (exe dated) | 11-08 23:56 local | D | [read: ls] |
| installed second-reader.js still the 10-01 copy | 11-13 | D | [read: git-blob abcbff60 = aadcc10a's blob; HEAD's 2d161fbd] |
| found | 11-13, by `-Check` and the hooks reader | D | [read: ledger L0613; `in_hooks.md:49-57`] |

- The plan tied the hook swap to "the restart". The app's Rust half of that landing (mcp.rs, trailer.rs) became live with a later
  build: exe 11-08 is newer than fe69a9fc [read: whats-live rule; git diff --name-only 82da03fc fe69a9fc] [inferred that this exe was
  built from a tree holding it]. Nothing on the restart path runs `install.ps1` [read: no reference in `consonance/src-tauri/src`
  except a test, main.rs:21628]. So the restart came, and the hook half did not ride on it [inferred].
- Cost so far, my node pass over 4,023 rows of `C:/Consonance/data/second-reader.jsonl` at 19:1xZ: 268 `ok` model reads of
  `call_librarian` rings from 2026-11-03T15:35:53Z to 2026-11-13T18:59:08Z, 2,799,638 tokens (in + out + cacheRead + cacheCreate),
  133 with flags [read]. [2nd reader: re-derived exactly with my own node pass (now 4,024 rows): 268, 2,799,638, 133, same
  first and last stamps. Counted from the push (17:09:36Z), not the branch commit: 266 reads, 2,778,110 tokens.] Earlier counts were 229 / 2,385,722 (in_hooks) and 237 / 2,479,021 at 15:27Z (00_build_paths 2nd reader)
  [summary]. Still growing. The caveat stands: this is cost only if the narrowing was meant for D [summary: in_hooks.md:52].
- D631's own falsifier counts "two weeks of install" [read: p-d631 :20]. Its clock never started on D [inferred].
- **What told a seat:** nothing for ten days. Then a reader who ran `-Check` and compared hashes by hand.

### (c) A hook landing that reached both machines the same day

- **None found.** Searched: every hand-back that records `install.ps1 -Only` (~~28 files~~ [2nd reader: UNSUPPORTED; the
  pattern is not given. Mine: 23 files hold the literal `install.ps1 -Only`, 33 hold `-Only`. Listing the 33 by date and
  machine, I also found no one hook installed on both machines the same day; the same file named on both sides is
  board-digest.js, `-Only` on L 09-23 (`p-l096-roster-E_2026-09-23.md:113`, whether run not checked) and on D 09-24 only as
  owed (`p-d132-settings-E_2026-09-24.md:124`).]), and lines "installed / live / wired on D|L"
  across `map/`, `handback/` and `librarian/`, by date [read: greps]. Dates with installs on both sides: 09-16, 09-21/09-22,
  09-27, 11-06, 11-11. None is one hook landing on both machines.
- Nearest: `session-start.js` and `l2-overseer-worker.js`.
  - D at 2026-09-21T16:06:39Z, with a witness table: installed == repo by CRLF-normalised sha256, `-Check` ok, a guard probe and the
    first verdict after the install [read: `loop/install_D_2026-09-21.md:7-30`].
  - L at 2026-09-23 01:20:31 local, a refresh of L083's 1c5b4f2 [read: `handback/p-l083-carriers-E_2026-09-23.md:3`, :103-108].
  - D never got L083's change: D's installed `l2-overseer-worker.js` is git-blob a589651f = 1a5891af (09-20); HEAD's is 3f01baa9
    [read: my hash-object]. Two days apart, and the second install never came back to D.
- The push gate is the widest gap on record: on D since 10-08 (installed copy = e8f85486 [summary: hooks_drift :149-150]); known
  unwired on L on 11-06 because "The push itself wrote no row" [read: `handback/p-l145-push-B_2026-11-06.md:25-34`]; again on 11-11
  [read: `handback/p-l159-push-B_2026-11-11.md:36`]; installed on L 11-13 10:3xZ [read: L198 hand-back :92-111].
  The tell that worked was a ledger row that did not appear. That is a read-back by effect, and it worked [inferred].
- The receipt shape exists elsewhere: T-180 builder installs carry "installed exe sha256 ... stamped compare equal" and a byte-checked
  backup [read: `map/C.md:1873`; `librarian/2026-11-06.md:63`]. Hooks have it only when a careful pane writes one (install_D 09-21,
  D220, L198) [read].

## 4. The done-words on this path, what each asserts, what it leaves unasked

| word | who says it, where | asserts | leaves unasked |
|---|---|---|---|
| landed | train `landed` row (landing-train.js:296); hand merges | main on the landing machine holds the sha; for the train, the remote too | the other checkout, every installed copy, the running app |
| pushed | train :293; close.js :320 (state repo) | the remote ref equals the sha | anything on any machine |
| read back | train board line :405 | `ls-remote` equals the sha | anything local |
| staged / promoted | train :322-369 (dreamzone-3) | built bytes copied into the checkout, sha256 equal, stamp written | whether the running process is that exe |
| up to date | dreamzone launcher `-Check` (comment at train :38-40) | the stamp names main's commit | the exe behind the stamp (the train guards this by refusing to stamp a moved main) |
| shipped | open-items `seed-carrier` (open-items.js:176-182) | bundled briefs in the build dir equal the repo | whether the running app started from that build |
| installed / synced | install.ps1 :441-444, :467 | bytes copied to the manifest's `To` path | registration, its requires, that it fires |
| ok (-Check) | install.ps1 :591 | "THE BYTES MATCH", by its own words | "It has never meant THE HOOK IS WIRED UP" (:591-592) |
| registered / wired | install.ps1 :716; hand-backs ("NOT wired") | settings.json names the leaf | the reload (install.ps1:1028-1030 vs the docs' "normally picked up automatically by the file watcher", hooks.md:736 [read, curl]); whether the leaf is the managed copy (a repo-path registration passes: L1086) |
| in sync | install.ps1 :745; close.js :341-346 | the listed files' bytes; state heads as of the last fetch | registration; files not on the list; the other machine now |
| closed | close.js :322-323 | the state repo's remote holds this machine's state | the record repo (pinned out), installs |
| live | whats-live (exe vs src commit); p-d220 "LIVE FROM"; L0089 "never live" | three different things | — the room has no single meaning |
| all-clear | the librarian, BUILDING.md:53-55, :123-124 | suite totals, hashes, pushed sha verified | installed copies, the running app, the other machine |

[ours] Keep one meaning for **live here**: on machine X at time T, the installed bytes equal HEAD's, the hook is registered on X
(or required by one that is), read by a tool, not typed. Keep **seen firing** for a ledger row written by the hook after T.
"Landed" and "pushed" stay as they are, and never stand alone in an all-clear for a landing that changed what a seat runs.

## 5. Where the read-back sits, and what it does

### The place: the landing hand-back's checklist, step "LIVE-HERE", run right after the push read-back [ours]

Why there and not in the other two:
- The train lands dreamzone-3, not lighthouse, and is configured on L only; neither recorded case passed through it (§2).
- close.js reads the state repo at the lid, run by the keeper, and a test forbids it the record repo (§2).
- Every lighthouse landing has a hand-back, the librarian reads it, and the all-clear is the done-state that reaches the keeper
  (BUILDING.md:53-55). The push-gate line is the precedent for a tool's verdict named in that hand-back (BUILDING.md:498-500).
- A checklist line alone is "remember-to", which the room measured at 0.000-0.052 (BUILDING.md:501). So the line is a tool's
  output, pasted verbatim, and the same tool runs in the pulse on every machine (below), so a skipped line is still caught.

### The tool: `consonance/tools/landed-live.js` (new, about 150 lines; tier prove it) [ours]

`node consonance/tools/landed-live.js --range <base>..<landed sha>` on the landing machine, after the push:
1. Files the range changed: `git diff --name-only <range>` [read: the form I ran for (a) and (b)].
2. Keep those a seat runs: manifest entries of `dev/shell/install.ps1` (parse whole lines as `dream-gate.test.js:64-78` does,
   reading `Lib` and `Hold`); any file `settings.json` registers by a repo path (ask-surface.js, L1086); `consonance/src-tauri/**/*.rs`
   and `Cargo.toml` (the app); the bundled briefs (open-items' list).
3. For each hook: hash the working-tree file and the copy `settings.json` points at (open-items' rule: the registered path, no
   fallback), line endings normalised; and its local `require('./x')` targets, the same way.
4. Classify, one line each:
   - `LIVE` (bytes equal, registered here, or a Lib whose `By` hook is registered);
   - `OWED` (registered here, bytes differ or a required Lib differs; prints the exact `-Only` list, Lib included);
   - `NEW` (declared in `$register`, absent here: his word first);
   - `HELD <ruling path:line>` (the manifest entry carries ~~`Hold = '<ruling>'`~~);
     [2nd reader: the installer's ruling-as-data form already exists and is a string: `Excluded = '<ruling>'` on a `$register`
     entry (`dev/shell/install.ps1:29-30`, `:231`, `:257`), honoured by every write path and reported by -Check as EXCLUDED
     BY RULING. `Hold` is a file-side two-way-conflict flag tested only AFTER the ABSENT branch (`install.ps1:435-436`,
     `:447`), so it cannot hold an ABSENT entry: a bare run would still copy and register `second-reader-note.js`. Use
     `Excluded` for a held NEW hook; `Hold` only for a drifted file.]
   - `NOT RUN HERE` (no registration on this machine; the landing cannot be live here whatever is installed);
   - `RUNS FROM REPO` (registered at a repo path: live at the pull);
   - `APP NOT LIVE` (a changed `.rs` is newer than the running exe: rebuild and restart, his word).
5. Print `LIVE-HERE <machine_tag> <sha> <n live>/<n run here>; OWED: ...; NEW: ...` last. Exit 1 when anything is OWED, NEW or
   APP NOT LIVE. HELD and NOT RUN HERE print but do not fail.
- Cost: my probe of steps 3-4 over all 36 entries took 6.2 to 13.1 ms in three runs and reproduced `-Check`'s file counts exactly
  (23 ok, 10 DRIFT, 3 ABSENT). It also split the 10 DRIFT: 6 registered here (second-reader, sources-gate, push-gate, delete-gate,
  ask-ending, release-chime), 2 not run here (userprompt_pulse.py, board-digest.js), 2 Lib (l2-overseer-worker, second-reader-worker)
  [read: `probe_live.js` in my scratchpad]. `-Check` cannot make that split.

**When red, on the landing machine:**
- The landing pane pastes the block into its hand-back under `checked:` and puts the `LIVE-HERE` line in its ring.
- An `OWED` line whose hook is already registered and carries no Hold is installed by the landing pane in the same landing
  ("installs" is already its job, BUILDING.md:52), one `-Only` run, with L198's four checks: the settings diff, `-Check`, the hook
  seen firing through the real path, and its own ledger row (`handback/p-l198-403-stall-B_2026-11-13.md:97-111`). Then it re-runs
  `landed-live.js` and pastes the green line.
- A `NEW` line, a `Hold`, or any sync of a hook under an open ruling goes to the librarian, who files it for the keeper.
- The librarian's all-clear quotes the `LIVE-HERE` line. With a red, it reads "landed and pushed; NOT live on <machine>: <items>",
  never "landed" alone.

### The other machine: what is written, and how it is told [ours]

The landing machine cannot see the other one. What travels by the pull:
- the commit itself (`landed-live.js` derives what is owed from the diff and that machine's own disk, so no trailer is needed);
- the manifest data in `install.ps1`: `Hold = '<ruling path:line>'` on a held entry, `By = '<hook leaf>'` on each Lib entry.
  This is the installer's own lesson: "THE RULING WAS PROSE AND THIS SCRIPT WAS DATA, SO THE SCRIPT WON" (install.ps1:26), so a
  hold goes into the data;
- the landing hand-back, which names the machine it checked and says the other was not seen.

How that machine's seats learn it: `chain-status.js` gains one clause, from `landed-live.js --pulse`, in the pulse's FIRST line
(only the first line is kept, userprompt-submit.js:268): `HOOKS OWED HERE <n>: <leaf>, <leaf> +<k> (install.ps1 -Only ...)`.
- It needs no install and no rebuild: the pulse runs `chain-status.js` from the repo working tree on both machines (§2).
  It is the one carrier this fault cannot strand. W3's body line, by contrast, is itself a hook to install on each machine.
- It prints only when the ~~`(HEAD, owed set)` pair~~ changes since it last printed, never every turn.
  [2nd reader: keyed on HEAD it fires after every commit while anything is owed: D's HEAD moved 124 times on 11-13 by its
  reflog, and D has had owed hooks for weeks. That is the nag. Key on the owed set alone. And one shared state file means the
  first seat to prompt consumes the line (a pane mid-build) while the seat that could act never sees it; chain-status writes
  no file today (0 `writeFileSync` in `consonance/tools/chain-status.js`), so this adds its first write and a race between
  seats.] chain-status's own rule is that
  a hook that nags gets uninstalled (chain-status.js:20, :561). The state is one small file in the data dir; it needs a STAYS row
  in `consonance/state-manifest.json`, or `close.js --check` refuses an unplaced data file (`handback/p-d203-A_2026-10-01.md:17`).
- HELD and NOT RUN HERE stay silent in the pulse; `landed-live.js` with no flags prints them.

### What to add to Lap W (not a redesign)

- W3, the body line: one field from the same `classify()`, `hooks <live>/<run here> · owed <n>`. W3's own new entry will show as
  `NEW` on each machine until it is installed there. That is the read-back checking itself [ours].
- W5, W1, W2, W4: nothing to add.

## 6. The failing checks, on recorded cases

**Check 1, case (a), red today on D's real installed bytes** [ours]:
- `node consonance/tools/landed-live.js --range a3cefeb9^..b0be06f0 --settings <fixture registering board-digest.js on UserPromptSubmit
  at ~/.claude/shell/board-digest.js>`: that is L's registration shape (install.ps1:1069-1072), over D's real `~/.claude/shell`.
- Today: `OWED board-digest.js` (installed git-blob 142a6541 = 2c7b3872; HEAD 8b504225) and exit 1 [read: the blobs; the tool does
  not exist yet].
  [2nd reader: blobs re-derived, OK. DOWNGRADED as "red on D's real bytes": it is red only with a fixture settings.json; on D's
  real state it exits 0. And on D's bytes it would print `-Only board-digest.js` alone (D's blind.js equals HEAD, git-blob
  17eb1681), the exact command that is the trap on L. The recorded case's reason (blind.js without `sealedGate`) is reached only
  by the test fixture below; its blind.js (`1c0acf7f^`, exports `blindState, declareLine, setBlind, clearBlind, markBoard, LOCK,
  BOARD`) matches the list B read on L (`handback/p-l198-403-stall-B_2026-11-13.md:78-79`). That fixture is the real check.]
- The same run with D's real settings.json: `NOT RUN HERE board-digest.js`, exit 0. That is the true state on D, not a false green.
- The test fixture, in `landed-live.test.js`, with a temp HOME:
  - installed `board-digest.js` = `git show 2c7b3872:consonance/hooks/board-digest.js`;
  - installed `blind.js` = the copy before 1c0acf7f (no `sealedGate`), as on L
    [summary: hooks_drift_D :86-95; read: librarian/2026-11-13.md:164].
  - Expect: `OWED board-digest.js`, with blind.js named as required, and the `-Only board-digest.js,blind.js` line. Exit 1.
  - After copying HEAD's two files in: `LIVE`, exit 0.
  - Edges, one test each: board-digest.js copied alone, so `blind.js` is still old (still OWED, the L0020 trap); settings.json
    absent or unparseable (UNKNOWN, exit 2, no guess); a `Hold` string (HELD, exit 0); a repo-path registration (RUNS FROM REPO);
    an empty range (nothing to say, exit 0).

**Check 2, case (b), red today on D with no fixture at all** [ours]:
- `node consonance/tools/landed-live.js --range 82da03fc..fe69a9fc` on D.
- The range touches `second-reader.js`, `second-reader-worker.js` and `second-reader-note.js`, plus `mcp.rs` and `trailer.rs`
  [read: git diff ∩ manifest].
- Today: `OWED second-reader.js` (installed abcbff60 = aadcc10a; HEAD 2d161fbd), `OWED second-reader-worker.js`,
  `NEW second-reader-note.js`, and the app LIVE (exe 11-08 > the .rs commits). Exit 1.
  [2nd reader: the three hook states re-derived (hashes; -Check DRIFT, DRIFT, ABSENT), OK. "app LIVE" is DOWNGRADED: it
  compares a commit's author date with the exe's mtime (`consonance/tools/whats-live.js:65`, `%at`). A branch commit dated
  before a build but merged after it reads LIVE. The consonance exe carries no built-from sha, so APP NOT LIVE can be falsely
  green on exactly this kind of landing.]
- Green only by his word, either way: the three installed with `-Only` in that order, or `Hold = '<his ruling>'` on them, which
  then prints HELD. The second-reader sync is his call (hooks_drift_D :116-121).

**Check 3, whats-live's false red, red today** [ours]:
- `node consonance/tools/whats-live.js` exits 1 on 53bac6a0, a MAP.md commit [read: my run].
- Fix: the pathspec at whats-live.js:65-66 becomes `'consonance/src-tauri/src/*.rs'` plus `consonance/src-tauri/Cargo.toml`.
  [2nd reader: red today for the reason given, confirmed by my `--warn` run (53bac6a0, MAP.md only; MAP.md is read at run
  time, `main.rs:3379`, not compiled). But the fix trades a false red for false greens: the app compiles in
  `include_str!("../brief/frag-fork.md")` (grep of `consonance/src-tauri/src`), and `build.rs`, `Cargo.lock` and
  `tauri.conf.json` also change the binary. The pathspec needs those four too, and the test one case for frag-fork.md.]
- Test: a temp repo where the newest change under `src/` is `MAP.md`, so not red. Then a `.rs` change newer than the exe: red.

**The lap's own falsifier** stays the plan's (`plan_vector_swarm_2026-11-13.md`, "Lap I is degenerating if"): at the first two
landings of a hook or app change after these are live, the installed copy is older than the repo and no seat was told. With this
design, "told" is checkable: a `LIVE-HERE` line in the hand-back, and a `HOOKS OWED HERE` pulse line on the other machine after its
pull [ours].
[2nd reader: the simplest way to pass this falsifier without fixing anything is to tell and not install. That is on record:
D132's hand-back told "NOT live on D until someone runs -Only" on 09-24 (`p-d132-settings-E_2026-09-24.md:92`) and the copy
is still stale 50 days later; b0be06f0's own commit body told "Not yet installed on L". Add an age bound: the lap is
degenerating if any OWED item on a landing machine is older than a stated number of days with no `HELD` ruling beside it.]

## 7. What each part needs

| part | rebuild | hook install | restart | his word |
|---|---|---|---|---|
| `landed-live.js`, `.test.js`, mutants in `consonance/tools/` (not `hooks/`: -Check audits hooks dirs, p-d203-A:18) | no | no | no | no; prove it |
| `chain-status.js` clause + its test + chain-status mutants; STAYS row in `state-manifest.json` | no | no; live at the next pull on D and L | no | a pulse change: the librarian's ruling, his veto open (as D633) |
| `whats-live.js` pathspec + test | no | no | no | no; check it |
| `install.ps1`: `By` on Lib entries; HOLD prints its reason string (:451) | no | no (the installer runs from the repo) | no | each `Hold` value is a ruling, his |
| briefs: one bullet in BUILDING.md "Landings go to a pane" and :123-124 (the all-clear quotes `LIVE-HERE`); one in COMMITTEE.md's hand-back section | yes, to reach fresh panes: seats read the bundled briefs (00_build_paths §0, 2nd-reader row 43 OK) | no | yes | the restart is his |
| W3 field | no | rides on W3's own install, on D and on L | — | W3's |
| installing anything that `landed-live.js` lists today on D | — | `-Only`, one entry per run, D | — | yes for second-reader*, dispatch-gate, carrier-drift-watch, any NEW; the six safe syncs follow hooks_drift §c |

Nothing here retires a hook or an instrument. `-Check` stays the whole-machine audit; `landed-live.js` is the per-landing read.

## 8. What would show this design wrong

- `landed-live.js --range` disagrees with `install.ps1 -Check` on any file's bytes on a machine (they must agree, line endings aside).
- The pulse clause fires on more than one prompt in a row with nothing changed, or is trimmed out within two weeks. Then it is
  the nag the pulse trim removed.
- A landing hand-back carries a green `LIVE-HERE`, and within a day a seat finds the same hook stale on the same machine.

## What I did not open

- Machine L: its disk, settings.json, board and data logs. Every L fact is from hand-backs and notes written on L.
- The push time of b0be06f0 (inferred from the ring); D's or L's board rows for it.
- `consonance/tools/landing-train.test.js` bodies beyond the test names; `close.test.js` beyond :470-478 and the names.
- `consonance/tools/chain-status.js` beyond :20, :556-561 and the exports; whether it already keeps a data-dir state file.
- `install.ps1` lines 70-370 (the manifest) beyond the entries cited, and 790-1060 (the registration writer) beyond :984, :1024-1080.
- `consonance/tools/state-sync.js` beyond :109-190 and :345-395.
- The D635 evidence folder; P's D631 evidence; how the 11-08 exe was built and from which tree.
- The other swarm files in this folder (`installer.md`, `entries_on_d.md`, `cost_of_drift.md`): not read, so as not to copy them.
- The Lap W spec beyond W5, W1 and W3's headings and fields; W2 and W4 bodies.
- No test was run; `landed-live.js` does not exist. Its cost figure comes from my probe of the same reads.
- The hooks page: one curl; I read the reload sentence at :736 and the `/hooks` section, not the whole page.

## Second reader

Second reader, Opus, on D, 2026-11-13 about 19:25-20:10Z, lighthouse HEAD baa0aef9 (no code file cited above changed since
2c396481: `git diff --stat 2c396481 baa0aef9` touches only notes, briefs and the workflow script). Read-only except this file.
Every correction above is in place, struck with `~~` and marked "[2nd reader: ...]". "Line" is the line BEFORE my edits.
OK = the primary says it; WRONG = it shows otherwise; UNSUPPORTED = not re-derivable; DOWNGRADED = true but weaker.

Commands I ran, all read-only: `install.ps1 -Check` (after reading that every write at :405, :442-443, :461-466 and :839+
sits in a non-Check branch; exit 1, 5,031 lines, output in my scratchpad); `node consonance/tools/whats-live.js --warn`;
`node consonance/tools/open-items.js` (no write call in the file); `node consonance/tools/chain-status.js` three times
(303-347 ms; no write call in the file); two node readline passes over `C:/Consonance/data/second-reader.jsonl` (field
names and counts only); `git hash-object --path`, `git log`, `git diff --name-only`, `git merge-base`, `git reflog`; one
curl of the public hooks page. No test file was run.

| Line | Claim (short) | Primary opened | Verdict | Evidence |
|---|---|---|---|---|
| 4 | No done-word reads an installed copy | install.ps1:429; landing-train.js:362; open-items.js:178 | WRONG | three tools hash installed or built copies |
| 8 | Pulse carrier cannot be stranded | my -Check line 5019; install.ps1:210 | DOWNGRADED | caller is an undeclared hook on D |
| 31 | Landings-go-to-a-pane list; again :129 | BUILDING.md:52-53, :129-130 | OK | :130 omits "releases" |
| 33 | Hand-back carries totals, hashes, sha | BUILDING.md:53-54, :123-124 | OK | verbatim |
| 34 | Success only in the all-clear | BUILDING.md:155, :530 | OK | verbatim |
| 35 | "installs" twice in the briefs | grep brief/*.md | WRONG | 3: also COMMITTEE.md:91 |
| 37 | Push-gate decision named in hand-back | BUILDING.md:498-501 | OK | verbatim, 0.000-0.052 |
| 40 | Source-Sha trailer decidable | BUILDING.md:465-466 | OK | verbatim |
| 42 | checked:/inferred: rule | COMMITTEE.md:143-149 | OK | |
| 44 | all-clear 5 hits, all BUILDING.md | grep -c | OK | 5, 0 elsewhere |
| 50 | Train config per machine | landing-train.js:13-21 | OK | |
| 51 | No landing-* file in D's data dir | ls C:/Consonance/data | OK | 0 |
| 53 | ls-remote must equal sha, then `landed` | landing-train.js:292-296 | OK | |
| 55 | Board says "pushed and read back" | landing-train.js:405 | OK | |
| 56 | Promote compares sha256, stamps if all match | landing-train.js:322-369 | OK | |
| 57 | Promote is the one installed read-back | open-items.js:178-182 | WRONG | seed-carrier also compares built copies |
| 59 | Tests assert main/origin/READY/bytes/scans | landing-train.test.js names | OK | no installed-hook test |
| 61 | b0be06f0 by B, fe69a9fc by C, by hand | git log; map/C.md:1805 | OK | train lands dreamzone-3 (B.md:2187) |
| 69 | Receipt pid and stamp checked | close.js:111-124 | OK | |
| 71 | ls-remote before and after own push | close.js:127-133, :265, :308 | OK | |
| 73 | Heads as of last fetch | close.js:328; state-sync.js:354 | OK | |
| 75 | Test pins no `lighthouse` in code | close.test.js:470-475 | OK | |
| 76 | Keeper types it before the lid | close.js:60-63 | OK | |
| 82 | whats-live: exe mtime vs src commit | whats-live.js:64-66, :95-104 | OK | author date, `%at` |
| 84 | Header: add a pair "after it bites" | whats-live.js:22-26 | OK | |
| 84 | Hooks bitten 19 times | 00_ledger.md rows | DOWNGRADED | ~5 of 19 are T-180, track or brief rows |
| 86 | Red on MAP.md commit 53bac6a0 | my --warn run; git show --stat | OK | MAP.md read at run time, main.rs:3379 |
| 87 | Last .rs commit 880f237f; exe 11-08 | git log; ls | OK | 23:56:09 local |
| 93 | -Check by hash, by leaf, refuses -Only | install.ps1:429, :612-640, :375-380 | OK | |
| 95 | Exit 1 always; counts 23/10/3/4/1/1 | my -Check run; install.ps1:757, :1076 | OK | same counts, 5,031 lines |
| 100 | Hold branch unused | install.ps1:447; grep | OK | no entry sets it |
| 105 | Pulse keeps first line, 3 s | installed userprompt-submit.js:265-268 | OK | |
| 107 | Python pulse does the same | userprompt_pulse.py:322, :337 | OK | also in D's installed 5889d3cd copy |
| 109 | Registered path, no fallback | open-items.js:278, :303-306 | OK | |
| 119 | a3cefeb9 04:29:22, b0be06f0 04:29:49 | git log | OK | merge parents cd9c91d0, a3cefeb9 |
| 120 | Merged in C:\Consonance\lighthouse | hand-back :94-95 | DOWNGRADED | that line is the push-gate run's cwd |
| 121 | Pushed about 10:30Z | hand-back :131-132 | OK | inferred; allow row 10:29:54Z is closer |
| 122 | Parked 10:33:47Z, ruling 10:36:52Z | hand-back :63, :92 | OK | |
| 124 | NOT installed on any seat | hand-back :3-5 | OK | |
| 125 | Reached D at pull 08:43:40 local | git reflog; merge-base | OK | not in 0b85fead, in 8fd453c6 |
| 128 | board-digest 142a6541 = 2c7b3872 | hash-object | OK | HEAD 8b504225 |
| 129 | board-digest unregistered on D | grep settings.json | OK | 0 |
| 131 | Registered by hand on L | install.ps1:1057, :1069-1072 | DOWNGRADED | 08-31 text; L096 :116 (09-23) |
| 132 | Alone it throws on L | librarian :164; hand-back :78-81 | OK | |
| 133 | L0020 same trap 08-17 | install.ps1:130-134 | OK | |
| 135 | No instrument printed it to a seat | hand-back :86-90; librarian :145 | WRONG | -Check printed DRIFT, when asked |
| 144 | Swap "only at the restart" | plan_room_fixes_2_5:20 | OK | verbatim |
| 145 | bd576735 09:24:54, lh-d631-p | git log; p-d631 :3 | OK | |
| 146 | P names the three -Only | p-d631 :125-126 | OK | the quote stitches :3 and :125 |
| 147 | D635 by C; quote | p-d635 :1-5, :74-78 | OK | |
| 149 | fe69a9fc pushed 17:09:36Z, no swap | map/C.md:1805 | OK | |
| 151 | second-reader abcbff60 = aadcc10a | hash-object | OK | HEAD 2d161fbd |
| 154 | Rust half live with 11-08 exe | whats-live rule | DOWNGRADED | author date vs mtime; no build sha |
| 156 | Restart path never runs install.ps1 | grep src | OK | only main.rs:21628, a test |
| 158 | 268 reads, 2,799,638 tokens, 133 | my node pass | OK | exact; 266 from the push |
| 162 | "two weeks of install" | p-d631 :20 | OK | |
| 167 | 28 hand-backs with -Only | grep handback/ | UNSUPPORTED | 23 or 33 by pattern |
| 171 | 09-21 D install, witness table | install_D_2026-09-21.md:7-30 | OK | |
| 173 | L 09-23 01:20:31 | p-l083 :3, :103-108 | OK | |
| 174 | l2-overseer-worker a589651f = 1a5891af | hash-object | OK | HEAD 3f01baa9 |
| 177 | L145 push wrote no row | p-l145 :25-34 | OK | |
| 178 | L159 again | p-l159 :36 | OK | |
| 180 | T-180 receipt shape | map/C.md:1873; librarian/2026-11-06.md:63 | OK | |
| 196 | Reload: installer vs docs | install.ps1:1027-1029; hooks.md:736 (curl) | OK | installer lines are :1027-1029 |
| 237 | Probe 6.2-13.1 ms | the probe (another scratchpad) | UNSUPPORTED | not re-run |
| 238 | DRIFT split 6 / 2 / 2 | settings.json grep | OK | six registered, two not, two Lib |
| 246 | L198's four checks | hand-back :97-121 | OK | |
| 257 | "THE RULING WAS PROSE ..." | install.ps1:26 | OK | |
| 266 | Nag rule | chain-status.js:20, :561 | OK | :20 is about erroring hooks |
| 267 | STAYS row or close --check refuses | p-d203-A :17 | OK | |
| 272 | W3 is its own new hook | 00_lap_w_spec.md:37 | OK | |
| 281 | Check 1 red on D's real bytes | hash-object; settings grep | DOWNGRADED | red only with fixture settings |
| 283 | On D's settings: NOT RUN HERE, exit 0 | settings grep | OK | |
| 286 | Fixture blind.js = 1c0acf7f^ | git show; hand-back :78-79 | OK | exports match L's |
| 296 | Range touches 3 hooks, mcp.rs, trailer.rs | git diff --name-only | OK | 25 files |
| 298 | Check 2 hook states | -Check; hash-object | OK | DRIFT, DRIFT, ABSENT |
| 299 | Check 2 app LIVE | whats-live.js:65 | DOWNGRADED | same date proxy |
| 304 | whats-live exits 1 on 53bac6a0 | my run | OK | |
| 317 | -Check audits hooks dirs | p-d203-A :18 | OK | |

**Tally.** Checked 79: OK 66, WRONG 4, DOWNGRADED 7, UNSUPPORTED 2. Design faults found in the [ours] parts: 4 (below).

**The proposed failing checks, probed today.**
- Check 1 (case a): its inputs are as stated (blobs; 0 registrations on D). It is red only under a fixture settings.json;
  D's real state gives exit 0. The fixture test with the pre-1c0acf7f blind.js does fail for the recorded reason. That
  test, not the D run, is the failing check on case (a).
- Check 2 (case b): red today on D with no fixture, for the reason given (two DRIFT, one ABSENT in the range). Its app
  line is not a real check (author date against mtime).
- Check 3 (whats-live): red today for the reason given. The proposed pathspec would go false-green on a change to
  `brief/frag-fork.md`, `build.rs`, `Cargo.lock` or `tauri.conf.json`.

**The design, tested.**
- LIVE-HERE in the hand-back. Satisfied without a fix by telling and not installing; D132 did exactly that on 09-24 and the
  copy is still stale. The told-test in §6 needs an age bound on OWED. A Lib whose spawner is unregistered (l2-overseer-worker
  on D) has no class in step 4. Precedents that lapsed: D132's "NOT live on D until someone runs -Only"; b0be06f0's commit
  body; the 09-21 witness table, never repeated; open-items' `seed-carrier`, named "Eighth landed-is-not-shipped"
  (`consonance/tools/open-items.js:180`).
- The pulse clause. Keyed on HEAD it fires after every commit (124 HEAD moves on D on 11-13); one shared state file means one
  random seat sees it once. Key on the owed set, and say which seat is meant.
- `Hold = '<ruling>'`. Cannot hold an ABSENT entry (ABSENT is tested first, install.ps1:435). `Excluded = '<ruling>'` already
  does this job for registration.
- Fires wrongly: APP NOT LIVE / LIVE from the author date; NOT RUN HERE on D for the recorded case, whose state is L's.
- Supports the design: L1044 shows a seat on L writing "the desktop needs its own install" of the push gate, which D has had
  since 10-08 (`hooks_drift_D_2026-11-13.md:149-150`). Deriving what is owed from each machine's own disk, not from a
  trailer written on the other machine, is right.

**What I could not check.** Machine L (its settings, installed copies, board); whether L096's `-Only` was run; the reader's
probe and its timings; the 28-file pattern; the D635 and D631 evidence folders; the hooks page beyond :736.

## What I did not open (second reader)

- Machine L. Every L fact above is from hand-backs and notes written on L.
- Transcripts and the board log: no figure here comes from them.
- `installer.md`, `entries_on_d.md`, `cost_of_drift.md`, `prior_fixes.md`, `two_machines.md` in this folder.
- landing-train.test.js and close.test.js bodies beyond the lines cited; state-sync.js beyond :352-382.
- The Lap W spec beyond its table rows and W3 heading; the reader's scratchpad probe.
