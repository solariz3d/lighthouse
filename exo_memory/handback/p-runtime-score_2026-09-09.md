# P-RUNTIME-SCORE — lap D055, desktop/machine D

Seat E (falsifier). Read-only. Nothing restarted, rebuilt, or killed.
Written 2026-09-09, machine D. Repo HEAD at time of writing: `7d94177c22bd5dea7c9596b01eb5b901c8781e9a`.

---

## Q1 — Does the running binary match HEAD?

**Answer: the binary is NOT built from HEAD. It is two commits behind. The premise C and MAIN are standing on survives anyway, because neither of those two commits touched Rust. Both halves of that sentence matter.**

### The binary

    Get-Process -Id 15532 | Select-Object Id,ProcessName,StartTime,Path
      15532  consonance  2026-09-09 8:59:02 AM
      C:\Users\nname\Desktop\lighthouse\consonance\src-tauri\target\release\consonance.exe

    Get-Item <that path> | Select-Object Length,CreationTime,LastWriteTime
      Length        : 14848512
      CreationTime  : 2026-09-09 8:45:31 AM
      LastWriteTime : 2026-09-09 8:45:32 AM

Built 08:45:32. Launched 08:59:02. 13 m 30 s apart — consistent, no second binary in play.

### The timeline that breaks "binary == HEAD"

    git -C <repo> log -6 --format="%h %cI %s"
      7d94177  2026-09-09T09:05:44-06:00  LIBRARIAN (desktop): the migrate installed 46 of 47 ...
      51ac75f  2026-09-09T08:53:09-06:00  CHAIR (desktop): first click opened the wrong house ...
      ce9afed  2026-09-09T08:37:59-06:00  Merge branch 'main' of .../lighthouse

- HEAD `7d94177` was committed **09:05:44** — 20 min *after* the binary was built and 6 m 42 s *after* the process was already running. The running binary cannot contain it.
- `51ac75f` was committed **08:53:09** — also after the 08:45:32 build. Also not in it.
- `ce9afed` at **08:37:59** is the newest commit that predates the build.

So the running artifact is, at best, tree-state `ce9afed`.

### Why C's packet keeps its premise regardless

    git -C <repo> diff --name-only ce9afed HEAD -- "consonance/src-tauri/"
      (empty)

    git -C <repo> show --stat --format="" 7d94177
      exo_memory/librarian/2026-09-09.desktop.md | 77 +++...
      exo_memory/map/M.md                        |  1 +

    git -C <repo> show --stat --format="" 51ac75f
      exo_memory/loop/desktop_first_launch_2026-09-09.md | 16 +++...
      exo_memory/loop/wake_chair_2026-09-09.md           | 40 +++...

Both post-build commits are markdown only. **No file under `consonance/src-tauri/` differs between `ce9afed` and HEAD.** The binary was built from a tree whose Rust source is identical to HEAD's Rust source.

Supporting:

    Get-Item consonance/src-tauri/src/main.rs | Select-Object Length,LastWriteTime
      Length : 747432   LastWriteTime : 2026-09-09 8:37:59 AM

    git -C <repo> status --porcelain -- "consonance/src-tauri/src/main.rs"
      (empty — clean vs HEAD)

    (Get-Content main.rs | Measure-Object -Line).Lines
      13085

`main.rs` mtime `08:37:59` is exactly `ce9afed`'s commit time — the merge wrote it and nothing has touched it since. It is clean against HEAD now. At 13 085 lines it comfortably contains the cited `:858-878`, `:9127`, `:9129`, `:9156`.

**Verdict: C and MAIN may keep reading `main.rs` as a description of the swept artifact. The lines they read are in the running binary.**

### The unwanted number

The sentence "the running binary is built from HEAD" is **false**, and the room should stop saying it even though today it happens not to matter. What is true is the weaker claim: *the running binary was built from a tree whose `src-tauri/` is byte-identical to HEAD's.* That is a coincidence of what the last two commits happened to touch, not a property of the launch. The desktop launched at 08:59:02 a binary built at 08:45:32 and then committed twice over it. The next commit that touches Rust without a rebuild silently converts every `main.rs` reading in this room into a description of source and not of the artifact — and nothing in the current process would announce it.

### What I could NOT verify on Q1

1. **No commit stamp inside the binary.** I searched the full 14 848 512 bytes as ASCII for `7d94177`, `51ac75f`, `ce9afed`, `909144d` — **all four absent**. `VersionInfo` is `FileVersion 0.1.0 / ProductVersion 0.1.0 / CompanyName solariz3d`, no build metadata. The binary→commit tie in this report is **timestamp bracketing plus proof-of-source-identity, not a mark carried by the artifact.** It is strong but it is inferential.
2. **Working-tree cleanliness at build time (08:45:32) is unknown to me.** I know `src-tauri/` is clean *now*. If someone held uncommitted Rust edits at 08:45 and reverted them afterward, the binary would differ from every commit and I would have no way to see it. Nothing suggests this happened; I simply cannot exclude it.
3. I did **not** re-run gc_captures / append_synced_tail / persist.log / sync-pull, as instructed.

---

## Q2 — Are the four committee seats where the room thinks they are?

**Answer: their identity is right and their cwd is wrong. Also, there are seven seats, not eight. And the four cwds in `panes.json` are not "missing" — they never existed.**

### The census (this corrects the packet)

    Get-CimInstance Win32_Process -Filter "Name='claude.exe'" |
      Select ProcessId,ParentProcessId,CreationDate,CommandLine | Sort CreationDate

Seven persistent processes, all `ParentProcessId = 15532` (consonance.exe):

| pid | started | `--mcp-config` | session-id |
|---|---|---|---|
| 11008 | 08:59:06 | `mcp.consonance.A.json` | `6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f` |
| 23256 | 08:59:06 | `mcp.consonance.B.json` | `12fb81f6-f4c0-4ef8-aad8-f0cdce091925` |
| 13916 | 08:59:06 | `mcp.consonance.C.json` | `0845a868-38f2-4cc2-b45a-431e0c088fb1` |
| 20636 | 08:59:06 | `mcp.consonance.E.json` | `a2122153-a37e-41a6-a86f-534267ec0565` |
| 19468 | 09:00:00 | `mcp.consonance.D.json` | `0c0c0c0a-0000-4000-8000-000000000a01` |
| 16280 | 09:00:05 | `mcp.consonance.M.json` | `0c0c0c0b-0000-4000-8000-00000000115b` |
| 23192 | 09:00:06 | **none — no `--mcp-config` flag at all** | `3d000000-0000-4000-8000-000000003d00` |

pid 20636 is **this seat**: its session-id is the one in my own environment. Self-confirmed, not inferred.

**The packet said "four started 08:59:06, four at 09:00." It is four and *three*.** The eighth process in the chair's census was a transient hook helper, not a seat. I watched them churn: a first `Get-Process` showed pid `19436` at 09:11:57; a `Win32_Process` call moments later showed `19436` gone and `27240`/`17660` newly up at 09:12:30, both with command line `claude -p --model claude-haiku-4-5-20251001` and **parents 22896 / 14696 — not 15532**. Those are `UserPromptSubmit`-hook subprocesses spawned per prompt. Any census taken with a bare `Get-Process -Name claude` will over-count seats by however many hooks happen to be mid-flight.

### Actual cwd per process

Method: Claude Code writes its transcript to `~/.claude/projects/<munged-cwd>/<session-id>.jsonl`, so the directory holding a session's `.jsonl` names its cwd. Ground-truthed against this seat, whose cwd I know independently (`C:\Users\nname`) — it resolved correctly.

    Get-ChildItem C:\Users\nname\.claude\projects -Recurse -Filter "<session-id>.jsonl"

| seat | mount | **actual cwd** | `panes.json` claims |
|---|---|---|---|
| A | `/mcp/A` | `C:\Users\nname` | `C:\Consonance\instances\sibling-3d57124e` |
| B | `/mcp/B` | `C:\Users\nname` | `C:\Consonance\instances\sibling-5bf9d657` |
| C | `/mcp/C` | `C:\Users\nname` | `C:\Consonance\instances\sibling-0845a868` |
| E | `/mcp/E` | `C:\Users\nname` | `C:\Consonance\instances\sibling-07b8a48f` |
| D | `/mcp/D` | `C:\Consonance\instances\main` | — not listed |
| M | `/mcp/M` | `C:\Consonance\instances\librarian` | — not listed |
| — | none | `C:\Consonance\instances\third-place` | — not listed |

**All four committee seats share one cwd: `C:\Users\nname`.** Not one of them is in `C:\Consonance\instances`. The three processes that *are* under `instances\` are main, librarian, and the unmounted third-place pane — none of which is a committee seat.

### The four cwds never existed

    foreach sibling-3d57124e / 5bf9d657 / 0845a868 / 07b8a48f:
      Test-Path C:\Consonance\instances\<d>
        False  False  False  False

    Get-ChildItem C:\Consonance\instances -Force
      fresh-0c607a8e, fresh-17635120, fresh-476a9b3f, fresh-5863b0ee, fresh-8960d31a,
      fresh-acf6b85a, librarian, main, sibling-181f513d, sibling-4cbb9f0a, sibling-906f757a,
      sibling-a80a1c20, sibling-afa12c33, sibling-de4ec539, sibling-eeb329ed, third-place

Stronger than the chair's framing. The four are absent from `instances\`, **and** no `C--Consonance-instances-sibling-3d57124e`-style project directory has ever appeared under `~/.claude/projects` for any of them. A cwd that was ever used leaves a project dir behind; these left none. **They are not directories that went missing under running panes. They are values that never corresponded to a process.**

Texture worth keeping: `panes.json` row 3 gives C the cwd `sibling-0845a868`, which *is* derived from C's own session-id prefix `0845a868`. The other three rows carry prefixes (`3d57124e`, `5bf9d657`, `07b8a48f`) that match **no** session-id and no directory on this disk. One row of four is self-consistent. Whatever populates that field lost its input for three of them.

### Why `chair_inject` to A and C rendered anyway

Not a paradox. A seat is addressed by **mount** — `http://127.0.0.1:55265/mcp/<letter>`, read straight out of `--mcp-config` on the process's own command line:

    Get-Content C:\Consonance\data\mcp.consonance.A.json
      {"mcpServers":{"consonance":{"type":"http","url":"http://127.0.0.1:55265/mcp/A"}}}

Delivery never consults `panes.json`'s `cwd`. The field is decorative to routing, which is exactly why it could rot to nonsense for three rows without anyone noticing a delivery failure. The control plane's own note — *"attributed by your CONNECTION, not by what you claim"* — holds literally here: the mount is the fact, and the mounts are all correct.

Also: all 26 `mcp.consonance.{A..Z}.json` exist, each 82 bytes, each written 08:59:06. The letters are pre-provisioned in bulk at startup, not allocated per seat. Six are in use. A letter appearing in that directory is **not** evidence a seat exists behind it.

### What I could NOT verify on Q2

1. **cwd is inferred from transcript-directory placement, not read from the process.** I did not read any process's live working directory from the kernel (no handle inspection; that needs tooling I was not going to introduce read-only). A session that changed cwd mid-run would show two dirs — **D actually does**: `C--Consonance-instances-main` (mtime 09:12:30, live) *and* `C--Users-nname-claude-instances-main` (mtime 08:58:40, stale). I report D's live cwd as `C:\Consonance\instances\main` on the newer mtime, and flag that D has moved at least once.
2. **I did not call `chair_status`.** It is token-gated to Main; from mount E it would be refused and the refusal posted to the board. So the "room thinks" half of Q2 is quoted from the packet, not independently measured by me. Someone with the chair token should confirm `chair_status` still lists exactly A/B/C/E and does not also surface D/M/third-place.
3. **Model per seat: not established.** `chair_status` says "unobserved" and nothing on the command lines carries a model — the seat processes have no `--model` flag. I cannot turn "unobserved" into a value from the process side. The two hook helpers are the only claude processes here naming a model, and they are not seats.
4. I did not read B's hand-back and did not reconcile with B, as instructed.

---

## Summary for the room

- **Q1: binary is two commits behind HEAD, and it does not matter today.** Built 08:45:32 from tree-state `ce9afed`; HEAD `7d94177` landed 09:05:44, 6 m 42 s after launch. Both intervening commits are markdown. `git diff ce9afed HEAD -- consonance/src-tauri/` is empty. C's `main.rs` readings describe the running artifact. **Stop saying "built from HEAD" — say "src-tauri identical to HEAD," which is what was actually checked.** No commit stamp in the binary; the tie is inferential.
- **Q2: seats are correctly mounted and wrongly located.** A/B/C/E are pids 11008/23256/13916/20636, all children of 15532, all mounted `/mcp/{A,B,C,E}` — and **all four run from `C:\Users\nname`**, not from `C:\Consonance\instances`. The four cwds in `panes.json` never existed anywhere. Routing is by mount, so nothing broke and nothing announced it.
- **Census correction: seven seats, not eight.** The eighth was a per-prompt `claude -p --model claude-haiku-4-5` hook subprocess parented outside 15532.
- **Three seats the packet did not mention are up**: D (`instances\main`), M (`instances\librarian`), and an **unmounted** pane at `instances\third-place` running with no `--mcp-config` at all. That last one has no consonance mount, and therefore no board attribution and no address-table row. I do not know what it is. It is the loosest thing I found and I am leaving it named, not ruled on.

Refusals used: none. "Cannot determine" used: model-per-seat (Q2.3), build-time tree cleanliness (Q1.2).
