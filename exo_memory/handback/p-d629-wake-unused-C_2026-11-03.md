# D629 — fix 2, wake the good-but-unused (pane C, 2026-11-03)

Packet: the chair's D629, from `loop/plan_room_fixes_2_5_2026-11-03.md` (6fa5aa26), parts (a), (b) and (c).
Branch `d629-c` off `d628-o` (82da03fc), worktree `Desktop/worktrees/lh-d629-c`. Two commits, **not pushed**:
`dbff4952` (B's map) and `7271a29c` (text-census). Tier: CHECK IT (text-census is not a gate; `git grep -l text-census`
finds it only in its own files, hand-back evidence and one fixture string in `trailer.rs:309`).
Standing guard kept: no seat's conversation, CLAUDE.md, memory or shelf was touched, and nothing a running seat reads
was changed. B's map file changed only on the branch, by NUL bytes alone (below), and the briefs were rebuilt only into a
scratch directory, never into the running app's `target/release`.

EV = `exo_memory/handback/p-d629-wake-unused-C_2026-11-03_evidence/`.

## (a) 1. text-census's finding: `exo_memory/map/B.md`, 800 NUL bytes

**What it was.** checked: `node consonance/tools/text-census.js` at 82da03fc → exit 1, 305 findings (286 png, 12 gz, 6 ico,
1 md); the md row is `exo_memory/map/B.md  byte 340388 of 436269 (line 1969, col 1)` (EV/census.before.summary).
The run is 800 NULs, exactly one run, starting at a line start: after B's "2026-10-05 11:3x — D243a" line (822 bytes,
intact, ending in `\n`) and before B's "2026-10-05 13:0x — D239" line (976 bytes, intact). It entered with
`1f2e70af` (2026-10-05 18:02 local, "Closing commit (2/3)"); the version before, `b71386ee`, has 0.

**Who could not see it.** checked (EV/visibility.out): plain `grep` on the HEAD copy prints "Binary file (standard input)
matches" and no line; ripgrep (the Grep tool) finds 0 of 25 "non-author look" lines in the HEAD copy and 25 in the fixed
one. **`git grep` was NOT blind**: it printed the line (git looks for a NUL only in a file's first 8,000 bytes, and this
one is at byte 340,388). My D627 hand-back said "invisible to grep, `git grep` and ripgrep": the `git grep` part was
wrong, see Corrections.

**The cause: narrowed, not found.** What the record shows:
- B wrote both neighbouring lines itself, each with `printf '%s\n' "<line>" >> $M` (B's transcript, streamed one line at
  a time because it is 619 MB: 17:26:20Z for the 11:3x line, 19:04:58Z for the 13:0x line; `scripts/mapwrites.js`,
  `scripts/fullcmd.js`). An append with `>>` cannot leave a gap by itself. So between 17:26:20Z and 19:04:58Z
  something made the file 800 bytes longer than its data, and B's next `>>` landed after the zeros.
- **Ruled out**, each checked:
  - another seat writing B.md in that window: 0 tool calls naming `B.md` in the main, librarian, 07b8a48f, 0845a868,
    3d57124e, 36313935 and 372c8abc transcripts, 17:20Z–19:10Z;
  - another seat rewriting the shared checkout in that window: the lighthouse commands in 18:40Z–19:06Z are the
    chair's `lap-row.js` (which appends only to its own ledger, `lap-row.js:301`), A's `git add`/commit of e5c55866
    (named hook paths, not B.md), and reads;
  - the app: nothing in `main.rs` writes a map file (`own_map_path` is read-only; main.rs:17724 says so);
  - a hook: the only hook naming the map dir, `ferry-watch.js`, only reads it;
  - OneDrive: the Desktop is not redirected (`User Shell Folders\Desktop` = `%USERPROFILE%\Desktop`);
  - the 2026-10-05 "BIOS restart": I first took it for the cause (an unclean restart leaves a file's size committed
    and its data zero on NTFS), but the commit that names it, `12c008bd`, is 13:55 local = 19:55Z, **after** both
    appends. Withdrawn.
- inferred: the writer is a process outside every transcript (a non-seat process or a write that left no tool call).
  The class is still open, and text-census is now the thing that would show the next one.

**The fix** (`dbff4952`): `scripts/dropnul.js` removes exactly that run and refuses otherwise (bytes not all NUL,
another NUL left, or the run not at a line start). checked: 436,269 → 435,469 bytes, 2,108 → 2,108 lines;
`diff <(git show HEAD:B.md | tr -d '\000') B.md` → identical. So no text was removed, only the zeros. inferred: if
800 bytes of text were ever there, they were lost on 2026-10-05 and cannot be recovered from git (no commit holds them).
The live file in the shared checkout is clean and identical to `d628-o` (checked: `git status`, `git diff 82da03fc HEAD`),
so the landing's merge carries the fix.

## (a) 2. open-items' finding: the briefs a fresh pane reads are older than the repo's

**What it was.** checked: `node consonance/tools/open-items.js` in the shared checkout → "OPEN the documents a fresh room
reads match the repo: 38 of 42 compared, COMMITTEE.md, BUILDING.md, README.md DRIFTED — but 4 could not be compared at
all" (4 research files absent from the build) (EV/open-items.before.out).

**The cause.** A pane's briefs are the copies beside the exe, written by the build. The running app is
`consonance/src-tauri/target/release/consonance.exe` (checked: Get-Process → that path, started 2026-10-30 16:23 local),
built 2026-10-30 11:18 local. The build was faithful: its COMMITTEE.md is byte-identical to `7a1cf49b` (10-19) and its
BUILDING.md to `475eed35` (10-24), the newest versions at build time (checked: `cmp` against each commit since 10-18).
Five commits since then change the briefs, and the app has not been rebuilt:
`0ca3eccd` (10-30 16:52), `020c4776` (10-30 17:34), `83b7d1af` (10-31 09:20), `71da3f04` (10-31 09:51),
`fdec4a77` (10-31 10:13). So every brief commit drifts a fresh pane's briefs until the next rebuild, by design, and the
one instrument that says so (open-items) was not being run.

**The fix.** A rebuild, and that is the landing's "build one exe and stage it" plus the keeper's restart. Building into
the live `target/release` now would change what a pane started now reads, which is the restart's step and inside the
standing guard, so I did not. Instead, as proof that a rebuild closes it: `cargo build --release` of `d629-c` into a
scratch target dir (`CARGO_TARGET_DIR`, under the heavy-run lock, BelowNormal, 2 m 28 s, exit 0), then open-items pointed
at it. checked: "CLOSED the documents a fresh room reads match the repo: 42 shipped file(s) byte-identical to the repo",
and all 5 items CLOSED (EV/open-items.after.out). That staged exe is from `d629-c` alone and is NOT the landing's exe.

## (b) text-census allows image files, so its real row shows (`7271a29c`)

A row `*.png  <reason>` now allows every tracked `.png` **whose first bytes are a PNG header**, likewise `*.gz` and
`*.ico`. A text file merely named `.png` still fails, and the report says its header is not a PNG. A type row for a type
with no known header is refused by the parser; a type row matching no tracked file is stale and fails; the green line
says how many files were allowed by type.

- Test first: 7 new tests, **6 red before** (the stale-row test passed before for the wrong reason: `*.png` read as an
  untracked literal path), **27/27 after** (EV/census-test.before.out, .after.out).
- Live, on `d629-c`: `text-census: 11785 tracked file(s) scanned, 0 with a raw NUL, 21 allowed (304 allowed by type, by
  their header bytes; allowed is NOT fixed).` exit 0. 304 = 286 + 12 + 6, the same files as the before-reading.
- Control: the new allow list against B.md as it is in HEAD → exactly 1 finding, `exo_memory/map/B.md byte 340388`
  (EV/census.control.txt). That is the row that was 1 of 305.
- No mutation harness names text-census (none exists); none run.

## (c) The 7 collapse meters, run once, read-only (EV/meters/)

Each run as `node consonance/tools/<meter>.js` (default arguments) in the shared checkout at BelowNormal, on
`C:\Consonance\data\board.jsonl` (191,089–191,677 rows as the board grew during the runs) and the repo. Raw outputs are
in EV/meters/*.out. Every number below re-derives from those files with the command given.

| meter | ran | the reading | what it can and cannot say |
|---|---|---|---|
| **catch-ledger** | exit 0, 0 s | Extracted catches by catcher, all windows: **self 12, committee 10, keeper 39** (attributed); last window **2026-09-22**. Declared ledger tallies agree with their own lists (4 of 4 rows). | It reads only `muscle_map.md` and `journal/*.md`, and the journal has one dated file after 09-22 (`10-24.md`) with no catch events in it. **So it sees nothing since 09-22, not because nothing was caught but because catches are now written in hand-backs, which it does not read.** Unwanted number: the room's one computation of the self:keeper ratio has been blind for six weeks. |
| **tell-index** | exit 0, 95 s | Since 10-01 (34 day-windows, per-actor tables): **committee 44,435 turns, 36 named-tell candidates = 0.81 per 1k** (unlosable 20, reflexive 9, preloaded 5, generic 0, protective 2); keeper 13,189 turns, 8 = 0.61 per 1k. For comparison, committee 07-25..08-24: 158 in 22,153 = **7.13 per 1k**. Catch-language turns since 10-01: 219 committee, 80 keeper. | Candidates, not findings. The tool's own warning applies: "A falling rate is not progress; it is also what learning which phrases are counted looks like." A 9x fall is exactly the size that warning was written for. (awk over EV/meters/tell-index.out's per-actor tables, windows ≥ 2026-10-01.) |
| **agreement-spread** | exit 0, 4 s | referent_overlap: **many minds 0.0729, one mind 0.2032** (separation −0.1303); vantage_spread 0.8286 vs 0.8466. Guard rows: spearman(overlap, vantage_spread) **−0.3609** (P3 wants abs < 0.5: **passes**); spearman(overlap, mean length) **0.3246** (P4 wants abs < 0.25: **fails**). 529 positives (405 below floor), 113 negatives. | The separation is in the expected direction (the committee overlaps less than one mind does), but P4 failing means overlap still tracks answer length, so the separation is partly a length effect. Whole-board, not windowed. |
| **deference-unit** | exit 0, 2 s | **1,952 cases selected** all-time (06: 1, 07: 1,165, 08: 439, 09: 213, 10: 97, 11 (3 days): 37). Since 10-01, 134, of which **the librarian's transcript (0c0c0c0b) 111**, main 9, panes 1–3 each. Per 1k of that seat's turns since 10-01: **librarian 24.8**, main 2.9, panes 0.3–1.6. | A SCREEN, not a deference count (the tool's words): it selects agreement following a no-evidence lever. **I did not rule on the members.** The librarian is the seat most often answering the keeper directly, which raises its lever count, so the rate needs a reading before it means anything. It is the most unwanted number here, and the one most worth a non-author reading its last 37. |
| **forget-rate** | exit 0, ~4 min | Over all history (31974c8..HEAD): **2 files left the reading path (172,048 bytes)**, 0 demoted, 2 renamed (still readable); **2,987 arrived (+37.8 MB)**. Reading path at END: 3,001 .md files. | Reachability only. The corpus grows about 1,500 files in for each one out; law 3 ("curate below capacity") has no instrument saying it is kept. |
| **order-parameter** | **could not run**, exit 3 | — | Its frozen encoder (`gte-base-en-v1.5` q8, `model_quantized.onnx`, 146,540,971 B, sha256 `e7f6af7a…c326509`, `order-parameter.js:158`) is **on no disk of this machine**: my old `scratchpad/c1/models/` holds no files, and a search of C:\Users\nname, C:\Consonance, C:\build, D:\ and G:\ found none. Not deliberately committed (146 MB, `p-scorer-into-repo-E_2026-09-19.md:75`). Its removal is not in the record (`git grep model_quantized -- exo_memory`). It got as far as: 873 sessions, 423 with ≥ 20 contributions. |
| **vicsek-phi** | **could not run**, exit 3 | — | Same encoder, same gate (`vicsek-phi.js:259`). |

So 5 of the 7 run, and **2 of the 7 cannot run on this machine at all**. Restoring them is a download (the model from its
source) checked against T1's sha256 before use. That is not read-only, so I did not do it; it is the keeper's or the chair's
call. inferred: the encoder went in a cleanup of scratch directories (D450 cleared leftovers on 10-24/25); not checked.

## Corrections (mine)

1. **D627 part 2 said B.md was invisible to "grep, `git grep` and ripgrep".** `git grep` was not blind: it
   prints the line, because git looks for NULs only in the first 8,000 bytes (EV/visibility.out). grep and ripgrep were.
2. **D627 part 2 put the running build at "2026-10-30 17:18:21"** and listed the brief commits after it as
   020c4776, 83b7d1af, 71da3f04, fdec4a77, 20108aa5. 17:18:21 was the exe's UTC time; it was built at **11:18 local**.
   So `0ca3eccd` (10-30 16:52 local) is also after the build, and the five commits that change the three drifted briefs are
   0ca3eccd, 020c4776, 83b7d1af, 71da3f04, fdec4a77 (checked: `git log --since=2026-10-18 -- <brief>` against
   `cmp` with each build copy, above).
3. **This lap, first cause for the NULs:** I named the 10-05 "BIOS restart" before converting the commit's −0600 time;
   it is 19:55Z, after both appends. Withdrawn in the same hour, before anything was filed.

## Not done, and why

- The rebuilt exe is not installed or staged for use: the landing builds one exe from all five branches and the keeper's
  "restart" swaps it in. My staging build (1.7 GB scratch target dir) was removed after its reading; its three brief
  copies hashed equal to `d629-c`'s (`staged-briefs.sha256`).
- No meter's members were ruled on, and no meter was changed. catch-ledger's blindness to hand-backs is a finding for
  whoever owns it, not something I widened.
- The B.md writer is not identified.

## Sources

The plan (6fa5aa26) whole; `text-census.js`, `.allow`, `.test.js`; `open-items.js` :74-87, :169-270;
`tauri.conf.json` bundle.resources; B's transcript `12fb81f6-….jsonl` and six other seats' transcripts, streamed
(`scripts/mapwrites.js`, `fullcmd.js`: tool-call inputs only, never results or message text); `lap-row.js`,
`ferry-watch.js`, `main.rs` greps; `git log`/`show`/`cmp` as cited; the 7 meters' outputs.
`exo_memory/third_place/` was not read.
