# D561: the token claim gets an instrument, `read-before-edit.js` (pane C, sibling-0845a868)

The order: the chair's 23:26:22Z, Part 4 of `exo_memory/loop/plan_consonance_learns_from_the_reader_2026-10-30.md` (92989640). Tier: check it.

| what | value |
|---|---|
| **Files** | `consonance/tools/read-before-edit.js`, `consonance/tools/read-before-edit.test.js`, and the fixture `consonance/tools/fixtures/read-before-edit_d555-C.jsonl` |
| **Commit** | worktree `C:\Users\nname\Desktop\worktrees\lh-d561-c`, branch **d561-c**, **`e47d0440`**. Not pushed |
| **Base** | **main d61a60eb, BEFORE E's landing:** at branch time, main held no E merge. The branch is a plain add of three new files, so it merges over E's landing with no conflict unless E adds the same paths |
| **Tests** | 7/7 pass. Mutants applied 4 / caught 4 / NOT APPLIED 0 (`SC/d561/mutants.js`; the file was restored byte for byte) |

    checked: node --test consonance/tools/read-before-edit.test.js → tests 7, pass 7, fail 0
    checked: node SC/d561/mutants.js → applied 4 / caught 4 / NOT APPLIED 0; restored true

## How it finds the transcripts (the room's own registries, not a guess)

- `<data>/letters.json` maps session id → letter (main.rs `pane_letter`).
- `<data>/panes.json` maps session id → cwd (main.rs `read_kept`).
- The transcript is `~/.claude/projects/<encode_cwd(cwd)>/<sid>.jsonl`, where `encode_cwd` turns every non-alphanumeric character into '-'. That is main.rs's current form, and the test pins its own `brain rot` case.
- `bin/jsonl_tap.rs` proved the path scheme. Its older encoder (only `: \ /` → '-') is the one main.rs's comment says mispredicted, so I followed main.rs.
- **The Third Place's session is never read** (`THIRD_PLACE_SID`, as main.rs).
- **The data dir:** `--data`, else `state-manifest.js` `dataDir()`. I ran it with `--data C:/Consonance/data`, so `~/.consonance.json` was not opened.

## What a lap is, and the plan's falsifier

The plan registered: *"the instrument cannot tell a pane's reading for the lap from its reading for its own wake; then it measures nothing."*

**How the tool answers it:**
- `lap.jsonl`'s dispatch rows say when a lap was handed to a letter.
- The pane's window **opens at the packet in its own transcript**: the user message that names the lap, matched to a dispatch of that lap to that pane within 30 minutes.
- The window closes at the next packet for a different lap.
- Wake reading comes before the packet, and is never counted. A compaction summary (`isCompactSummary`), which names many laps, is never a packet.
- Both are tested; the compaction case is mutant-caught.

**One real trap found on the first run, fixed with a test:**
- O's D544 packet named D544, D515 and D525. The ledger re-handed D525 to O four seconds after D544's dispatch, in the same ring batch.
- The first rule ("the latest dispatch the packet names") opened D525, so D544 read as "packet never seen".
- **The rule now:** a new hand before a `re-hand`, then the dispatch nearest the packet in time. That also opens today's D561 packet correctly, though it names D558 first.
- The test reproduces the real case; the old rule is a caught mutant.

**What is counted, up to the first EDIT:**
- **The first edit** is an Edit, Write, MultiEdit or NotebookEdit on a file outside scratch space, `exo_memory/` and `~/.claude/`. Probe scripts, hand-backs and maps are not the change.
- **reads:** Read, Grep and Glob calls, plus shell calls whose every segment is a reading verb. The rule is quote-aware: a `\|` in a grep pattern is not a pipe, and `=>` in a `node -e` script is not a redirect.
- **bytes:** the UTF-8 bytes of those reads' results.
- **Also shown:**
  - `delegated` (Agent calls, whose reading is in another transcript);
  - `shell-writes` (a pane that edits by shell has a late "first edit", and this says so);
  - `other-shell` (node probes, builds: some of them read files, and this tool cannot see what).

**UNMEASURED, never 0:**
- a missing transcript;
- a packet never seen;
- a window with no edit. Its reason carries the shell counts, so a shell-edited lap is told from a read-only one.

**Low I/O:**
- each transcript opened once;
- a binary search on line timestamps (64 KB probes), started 8 MB early;
- streamed only until every asked lap is settled.

The baseline read 4 transcripts (A 1.10 GB, C 1.19 GB, E 0.94 GB, O 0.13 GB) at BelowNormal in **5 s**.

## The baseline: D540–D550, before the maps

`D540-D550` expands to the 10 lap ids the ledger dispatched to panes; D545 had no pane dispatch.

    checked: node SC/d456/belownormal.js node consonance/tools/read-before-edit.js D540-D550 --data C:/Consonance/data --json → exit 0 in 5 s
             (one run; the table rendered from its JSON with R.table: SC/d561/baseline.json, SC/d561/baseline.txt)

```
lap   pane  status      reads   bytes read   delegated  shell-writes  other-shell  first edit (or why not)
D540  C     UNMEASURED      -            -           -             -            -  no edit in its window (8 shell writes, 2 other shell calls)
D540  E     MEASURED        1          672           0             2            0  Edit 2026-10-29T22:46:28.985Z
D541  A     UNMEASURED      -            -           -             -            -  no edit in its window (5 shell writes, 15 other shell calls)
D541  C     UNMEASURED      -            -           -             -            -  no edit in its window (6 shell writes, 0 other shell calls)
D542  A     UNMEASURED      -            -           -             -            -  no edit in its window (10 shell writes, 17 other shell calls)
D542  C     UNMEASURED      -            -           -             -            -  no edit in its window (8 shell writes, 0 other shell calls)
D543  A     MEASURED       30    1,016,026           0             3            7  Edit 2026-10-30T01:05:21.485Z
D543  E     MEASURED       22    1,283,665           0            14           18  Write 2026-10-30T00:40:53.519Z
D544  O     UNMEASURED      -            -           -             -            -  no edit in its window (9 shell writes, 9 other shell calls)
D546  C     UNMEASURED      -            -           -             -            -  no edit in its window (5 shell writes, 6 other shell calls)
D547  A     MEASURED       27      374,057           0             7           19  Edit 2026-10-30T02:13:36.966Z
D547  C     UNMEASURED      -            -           -             -            -  no edit in its window (4 shell writes, 9 other shell calls)
D548  E     MEASURED        7       24,254           0             1            1  Write 2026-10-30T02:35:25.832Z
D549  C     MEASURED       18       73,715           0             2            2  Edit 2026-10-30T03:42:01.996Z
D550  E     MEASURED        5       23,202           0             1            1  Write 2026-10-30T04:04:12.612Z
D550  O     UNMEASURED      -            -           -             -            -  no edit in its window (32 shell writes, 33 other shell calls)

per lap (sum over MEASURED panes only):
D540  reads 1, bytes 672  (1 of 2 panes measured)
D541  UNMEASURED  (0 of 2 panes measured)
D542  UNMEASURED  (0 of 2 panes measured)
D543  reads 52, bytes 2,299,691  (2 of 2 panes measured)
D544  UNMEASURED  (0 of 1 panes measured)
D546  UNMEASURED  (0 of 1 panes measured)
D547  reads 27, bytes 374,057  (1 of 2 panes measured)
D548  reads 7, bytes 24,254  (1 of 1 panes measured)
D549  reads 18, bytes 73,715  (1 of 1 panes measured)
D550  reads 5, bytes 23,202  (1 of 2 panes measured)
```

**Checked by hand:**
- **D549 C (mine), recounted** with a separate walk of the same window: packet 03:34:11Z, then 18 reads totalling 73,715 bytes, 2 shell writes and 2 other shell calls, a scratch Write (not counted), and the first Edit at 03:42:01Z. That matches the row.
  - Not fully independent: the recount uses the same shell classifier. The windowing, the de-duplication and the byte sums were recounted separately.
- **The UNMEASURED rows are what they say:**
  - **C's D540, D541 and D542** were installs (`cp`, by shell).
  - **C's D546 and D547** were an audit and a grade (read-only).
  - **A's D541 and D542** show no Edit/Write outside scratch and its hand-back in the trace (`SC/d561/trace.js`). A's change for those laps was made by shell or not made in those windows; 5 and 10 shell writes respectively.
  - **O's D544 and D550** were renders and comparisons (scratch scripts only).

## Where it cannot measure, and what that means for the claim

1. **Only 6 of the 16 (lap, pane) rows are measured,** across 6 of the 10 laps. The rest are installs, audits, grades and renders, which have no edit to measure up to. That is the instrument working, not failing: "reading before building" has no meaning where nothing is built. But it means **ten laps give about six data points.**
2. **The measured rows span three orders of magnitude** (672 B to 1.28 MB). They are dominated by what the lap was, not by what the pane knew: D543, the kn5 and image export, read 2.3 MB; D540 E, a version bump, read 672 B.
   - **A before/after comparison over ten laps each will measure the lap mix unless it is paired.** Compare the same kind of lap: a code change in a named file, by the same seat, in the same repo.
   - **I would register the comparison as the median reads-before-edit over measured code-change rows,** and say in advance that a fall smaller than the spread between two baseline laps of the same kind is no evidence.
3. **Shell edits are invisible as edits.** A pane that changes a file with `sed -i` or a node script has its "first edit" at its next Edit/Write, or none. The `shell-writes` column flags it, but cannot tell a scratch redirect from a repo change.
4. **Probe scripts read files the tool cannot see** (`other-shell`). C's own laps lean on node probes, and A's D541/D542 show 15–17 such calls. So the reads column undercounts exploring for seats that explore by script.
5. **Subagent reading is not counted** (`delegated`; 0 in the baseline).

**My conclusion:** the transcripts support the instrument for laps that edit with Edit/Write. The plan's own falsifier does not fire: wake reading is excluded by construction, and tested. The weakness is not in the transcripts but in the sample: the baseline has six measured rows of mixed kinds, and a raw before/after total over ten laps will not answer the token claim. That is said now, before the after-run, so it cannot be said afterwards to explain a result away.

## Corrections to myself

- **My first baseline command read every transcript twice** (once for the table, once for `--json`). I stopped it during the first pass. The reported run is one pass, with the table rendered from the JSON.
- **The fixture's first redaction leaked words** from inside quoted grep patterns (outside tool names among them). I replaced every command with a stub of the same class (`cat file.txt`, `sed -i …`, `node script.js`) before committing. The committed fixture holds no command text, no result text and no real paths: `grep -c "nname|private|terms"` → 0, and the term sweep and credential scan are both 0.
- **The test's first packet-time assertion** used a seconds-only reading of mine (`.000Z`); the real line is `.875Z`. That was the test's error, not the tool's. It is now a match on the second.
- **The compaction test was first written so that its mutant survived** (the summary named only the current lap). It now names a later lap dispatched to the same pane, and the mutant is caught.

## Standing use

Per the plan, it runs like `leftovers.js`: `node consonance/tools/read-before-edit.js <lap>` prints one line per pane. The ten laps after the maps come later.

NEXT: librarian, collate D561 and the baseline. The plan's default after it is Part 1 (the BUILDING.md paragraph) once E's landing is back.

## §paths: the landing's refusal fixed (the chair's 01:11:13Z)

E's landing refused d561-c (`p-d564-housekeeping-E_2026-10-30.md`:199-203): `portable-paths` found 10 machine-path sites in
`read-before-edit.test.js`, one of them FATAL-TEST-READ at `:97`, a real `C:\Consonance\instances\…` cwd written into
the `panes.json` fixture.

- **Rebased** d561-c onto origin/main `97fe6280` (`git rebase origin/main`, clean): `e47d0440` → `d01f7ae0`,
  `ce4b77ab` → `d6735e16`.
- **The FATAL site, fixed in code** (`d306681c`): the fixture's cwd is now the neutral `/rooms/instances/sibling-1`, and
  the expected folder is `-rooms-instances-sibling-1`, written out, not computed. The encoding is still pinned
  independently by main.rs's own `brain rot` case.
- **The nine BENIGN-TEST sites baselined** with `portable-paths.js --update`: BENIGN-TEST 397 → 406, nine rows, all
  `read-before-edit.test.js`. The baseline diff is 64 insertions and 1 deletion: 9 entries of 7 lines and the count line.

      checked: node consonance/tools/portable-paths.js → exit 0
      checked: node --test consonance/tools/portable-paths.test.js → tests 43, pass 43, fail 0
      checked: node --test consonance/tools/read-before-edit.test.js → tests 7, pass 7, fail 0
      checked: git diff --numstat consonance/tools/portable-paths.baseline.json → 64 1

Not re-run: the read-before-edit mutants. Only a test fixture changed, and the tier is check it.

NEXT: d561-c (`d306681c` + this hand-back) lands with the next lighthouse landing.
