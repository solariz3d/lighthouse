# P-DESKTOP-TABLE — the desktop runbook scored against its first real run

**B (pane `12fb81f6`), lap D055, machine D, 2026-09-09 09:20. HEAD `7d94177` at open.**
**Runbook: `exo_memory/loop/desktop_first_launch_2026-09-09.md`, corrected BY APPEND at §0.7.**

Every claim below has the command beside it. §7 is what I did not verify. §6 is the WRONG column,
and my own runbook's misses are in it.

---

## 1 · ROW 1 — WHICH cwd. Answer: `C:\Users\nname`, all four seats

`panes.json` names four `C:\Consonance\instances\sibling-*` cwds. The chair measured them absent.
Confirmed, and then answered.

**The four seats are in `C:\Users\nname` — the value of `%USERPROFILE%`.** Three independent reads:

```
$ ls /c/Consonance/instances            # none of the four present
$ for id in 6fe15f0a 12fb81f6 0845a868 a2122153; do find ~/.claude/projects -maxdepth 2 -name "$id*"; done
  ./C--Users-nname/6fe15f0a-...   ./C--Users-nname/12fb81f6-...
  ./C--Users-nname/0845a868-...   ./C--Users-nname/a2122153-...
$ grep -o '"cwd":"[^"]*"' <each>.jsonl | sort -u | head -1
  "cwd":"C:\\Users\\nname"     # x4, first record of each
```

No project slug `C--Consonance-instances-sibling-*` exists for any of the four. First timestamps
14:59:19–14:59:27Z = **08:59:19–08:59:27 local** — the second, corrected launch.

### At the file

```
main.rs:954         cmd.cwd(&cwd)                                    the panes.json path
cmdbuilder.rs:566   .filter(|path| Path::new(path).is_dir())         not a dir  ->  None
cmdbuilder.rs:567   let dir: Option<&OsStr> = cwd.or(home);          home = %USERPROFILE%
cmdbuilder.rs:563   self.get_env("USERPROFILE")
```

`portable-pty-0.8.1`, pinned at `Cargo.lock:2540`, source read at
`~/.cargo/registry/src/index.crates.io-*/portable-pty-0.8.1/src/cmdbuilder.rs`.

**A requested cwd that is not an existing directory is silently discarded and replaced by the home
directory.** `CreateProcessW` (`psuedocon.rs:135`) then receives a *valid* directory, so the failure
path at `:151` never runs. No error, no log, no refused launch. `%USERPROFILE%` = `C:\Users\nname`,
confirmed.

### Why the seats still answer the chair — the apparent contradiction, resolved

The chair's `chair_inject` to A and C rendered. That is real and it is not evidence the seating is
fine. Everything on the Rust side keeps using the **string** from `panes.json`:

- `role_for_kept` (`main.rs:2530`) — `Path::new(cwd).starts_with(instances)`, a pure prefix test.
  `...\instances\sibling-3d57124e` passes → `"committee"`.
- the injection gate (`main.rs:8225`) — `if role != "committee" && role != "main"` → refuse.
  Role is committee, so delivery proceeds.
- `is_managed_cwd` (`main.rs:3677`) — the same prefix test → managed.

**Addressing survives because the roster is a string and the string is well-formed. Nothing in the
addressing path touches the disk.**

### What it costs — and the cost is already paid

The brief write is not a string test. `warm_resume_brief` (`main.rs:5210`) passed the
`is_managed_cwd` guard, read the capture the MIGRATE had installed, assembled the whole brief, and
logged the carry — then:

```
main.rs:5379   fs::write(PathBuf::from(cwd).join("CLAUDE.md"), brief).is_ok()
```

`fs::write` does not create parents. The directory is not there. **The write fails, and that boolean
is the `warmed=` field.** `/c/Consonance/data/persist.log:316–326`:

```
MAP CARRY pane=6fe15f0a-... master=112817 reserve=8000 allowance=8684 carried=4434 tier=newest
resume    pane=6fe15f0a-... warmed=false jsonl_existed=false -> fresh
MAP CARRY pane=12fb81f6-... master=125293 ... carried=7113 tier=newest
resume    pane=12fb81f6-... warmed=false ...
MAP CARRY pane=0845a868-... master=82944  ... carried=4424 tier=newest
resume    pane=0845a868-... warmed=false ...
MAP CARRY pane=a2122153-... master=71106  ... carried=6035 tier=newest
resume    pane=a2122153-... warmed=false ...
```

**Four maps assembled, four maps discarded, and the log field that records it reads exactly like
"there was no capture to warm from."** The instrument whose comment at `:5276` says it exists *"so
a carry that failed would be caught on the morning it started"* fired correctly — `carried=` is
non-zero for all four — and the failure happened one step later, in a field nobody was reading.

The measured cost, stated plainly:

| | bytes |
|---|---|
| a correctly seated pane's map (`instances\sibling-181f513d\CLAUDE.md`) | **123,162** |
| what these four have (`C:\Users\nname\CLAUDE.md`) | **file does not exist** |
| what actually reaches them (`~\.claude\CLAUDE.md`, global, dated Jun 28) | **7,574** |

The chair's stated cost was *"a different CLAUDE.md and no map."* It is sharper than that: **no
CLAUDE.md is written at all**, and the map that was built for each seat was thrown away silently.

### Second consequence, named and not chased

`main.rs:5407–5411` computes each pane's transcript path as
`~/.claude/projects/encode_cwd(cwd)/<pane>.jsonl` — i.e. `C--Consonance-instances-sibling-3d57124e\...`,
a slug that does not exist. Claude Code writes to `C--Users-nname\<pane>.jsonl`. So the
orphan-rename at `:5414–5416` renames nothing, and every path the Rust side derives from `cwd`
points into a tree that is not there. Captures are unaffected — `capture_text_path(pane)` is keyed
on the pane id under `data/captures`, and the four `.txt`/`.log` files are present and growing.
**Which other cwd-derived readers break: not chased. Named in §7.**

---

## 2 · ROW 2 — `~/.consonance`. Recommendation: CARRY ONE THING, RETIRE NOTHING YET

**Two corrections to the framing before the recommendation, both measured.**

### It was not seeded this morning. It has been there since July.

`~/.consonance/persist.log` line 1 is `1785081448` = **2026-07-26 09:57 local**. `cards/` is dated
Aug 25, `record/` Sep 2, `BOOT.md` Sep 4. 08:45–08:59 are this morning's *writes*, not its birth.

It is the **built-in default data dir**, and `main.rs:92–93` describes this exact failure in its own
words: a config that fails to parse *"fell back to `Config::default()`, silently relocating
`instances_dir` and `data_dir` to their built-in defaults."* There is also a
`~/.consonance.json.bak-20260726-dirsreset` sitting beside the config — **July 26, the same day as
that persist.log line.** This has happened before and was named before.

### It is not retired. It is being written to right now.

While I worked, both roots received the same lines at the same instants:

```
$ grep -n "DECK ORDER" /c/Users/nname/.consonance/persist.log   # epochs 1788966884, 1788967076, 1788967147
$ grep -n "DECK ORDER" /c/Consonance/data/persist.log           # epochs ...1788967076, 1788967147
$ ls -la --time-style=+%H:%M:%S <both>
  09:19:07  /c/Consonance/data/persist.log
  09:19:07  /c/Users/nname/.consonance/persist.log      # same second
```

And there is only **one** app process:

```
Id 15532  consonance  StartTime 2026-09-09 8:59:02 AM
  Path C:\Users\nname\Desktop\lighthouse\consonance\src-tauri\target\release\consonance.exe
```

The 08:45 instance is gone. `plog()` (`main.rs:850–855`) has exactly one destination,
`data_dir().join("persist.log")`. **So the single live app is resolving `data_dir()` to two
different values at different call sites or moments, and is double-writing into both houses now.**
The config is clean — the runbook's own verify passes, first bytes `123,13,10`, not `239`. The BOM
fix held. **This is a different fault from the BOM one, it is live, and I did not root-cause it.**

### The recommendation

**Carry one thing. Retire nothing today. Delete nothing** (and I deleted nothing).

**CARRY — the 08:45 board rows.** `~/.consonance/board.jsonl` is 40 lines. 35 are pane
`0c0c0c0a` between `1788965183` and `1788965600` — the BOM-diagnosis session — and **none of them
are in the real board** (`grep -c` for ts `1788965562057` and `1788965600340` in
`/c/Consonance/data/board.jsonl` → `0`). The *finding* is carried (commit `51ac75f` plus the §0.6
append). The *rows* are not.

The full transcript of that session is intact and is **not** in `~/.consonance` — it is at
`~/.claude/projects/C--Users-nname-claude-instances-main/0c0c0c0a-....jsonl`, 785,269 bytes,
14:45:46–14:53:20Z. So the primary record survives regardless; carrying the board rows is about the
board being complete, not about rescuing content. **My recommendation is to carry them, because the
board is the room's shared record and a launch that misfired is exactly the kind of row the record
should not be missing — but it is the keeper's call and nothing is lost if he declines.**

**CARRY WITH RE-LETTERING, OR NOT AT ALL — and this is the trap.** The two rooms disagree about who
A and B are:

| pane | `~/.consonance/letters.json` | `/c/Consonance/data/letters.json` |
|---|---|---|
| `0c0c0c0a-0000-4000-8000-000000000a01` | **A** | **D** (main/chair) |
| `0c0c0c0b-0000-4000-8000-00000000115b` | **B** | **M** (librarian) |

A naive merge silently re-attributes 35 rows to **A and B — two live committee seats, one of them
me.** Any carry must rewrite the pane field or it corrupts attribution in the one file the room
treats as testimony.

**DO NOT CARRY — everything else.** All 12 cards are byte-identical to `exo_memory/cards/` (`cmp`,
12/12 SAME). `ready/` is empty. `harvest/` is two counter files from the dead session.
`captures/` holds a 2.4 MB tail for `0c0c0c0a` and 1.9 KB for `0c0c0c0b` — the real root's
equivalents are 466 MB and 233 KB and are live; `captures/*.log` is classed **STAYS** ("raw ore",
`state-manifest.json:27`). Nothing here is a unique record.

**RETIRE — not yet, and not by deleting.** A live writer is putting lines into it as of 09:19:07.
Deleting a directory the running binary is appending to gets you a recreated directory and a lost
audit trail of the very fault that needs diagnosing. **The order is: find the second `data_dir()`
resolution, fix it, confirm the writes stop, and only then retire.** I would keep it frozen and
untouched as the evidence for that packet.

### Separate, and I agree it is separate

`C:\Users\nname\lighthouse` is a stale Stage-6 checkout beside the live one. It is not a data root
and maintenance law 1 is not what it violates. Two checkouts plus two data roots is the condition
that made the 08:45 misfire reachable, and §0.7 records the live path. Retiring it is a third
packet; I did not touch it and did not read it.

---

## 3 · ROW 3 — REFUSED. It is a separate packet; do not fold it in

**The observation half I will score, because it needs no action:**

§11 item 8 (*"the push from the desktop has never run, so `machines/D.json` has never been created"*)
**stands open and is confirmed.**

```
$ ls /c/Consonance/state/machines/          -> L.json only
$ cat  /c/Consonance/state/machines/L.json  -> {"machine":"L","at":"2026-09-09T13:54:33.666Z","files":47,...}
$ git -C /c/Consonance/state log --oneline -2  -> a4cb9fe state: L ...  /  faf86d4 state: L ...
$ node consonance/tools/state-sync.js --verify -> COMPLETE — 47 of 47 ... pushed by L
```

D has never pushed. `close.js` exists (18,322 B) and nothing on this machine has run it. §0.5's
correction to §8 — *use `close.js`, not the raw `--push`* — is right and stands.

**The action half I refuse, and the reason is not caution in general:**

The first D push is the first time this machine's identity is written into a shared remote, and
**the house it would close over is the broken one.** `panes.json` is TRAVELS
(`state-manifest.json:21`) and its stated precondition is already falsified (§0.7). A close now
pushes back a roster naming four directories that **do not exist on the machine doing the pushing**,
carrying L's own file home stamped as D-confirmed — and it does it while a second `data_dir()` is
still being written to. That is not a close over a settled state.

It also is not mine to decide. It is outward-facing, it is the leg the runbook itself calls the one
that costs something, and the keeper's rule that the caller holds the evidence is A's whole design
for `close.js`.

**Row 3 is a separate packet. Sequence it after row 1 is decided.** The runbook's §9 warning stands
in the meantime and should be repeated to the keeper: **do not open the laptop and work in it until
D has pushed**, or both machines append from the same ancestor and the next pull is hand work.

---

## 4 · THE FAILURE TABLE, SCORED

Ten rows. The seam row is the entry point for every one of them.

| § | row | verdict |
|---|---|---|
| §10 | `MIGRATE` = the success row | **FIRED, AND WAS WRONG ABOUT WHAT SUCCESS MEANS.** The row printed. Its instruction — *"nothing — go to step 6"* — sent the keeper past a house whose four seats were mis-seated. Correct about the sync, blind to the seating. |
| §10 | `RESUME` naming `L` | **NOT REACHED, AND THE PREPARATION WORKED.** `machine_tag` = D in both cascades before launch; the seam row said MIGRATE. §0's ① did its job. |
| §10 | `LOCAL HOUSE` (any) | not reached |
| §10 | `LOCAL HOUSE: VERIFIED BUT DID NOT INSTALL` | not reached |
| §10 | `STANDALONE: state-sync.js is not on disk` | **FIRED AT 08:45, AND THE ROW'S DIAGNOSIS WAS WRONG.** The row says *"almost always: `room_path` does not point at `<repo>\exo_memory\BOOT.md`."* `room_path` was correct. The cause was a BOM making the whole config unparseable, so `room_path` was never read at all. §0.6 carries the correction; the table row itself still names the wrong likeliest cause. |
| §10 | `RETIRE FAILED for <seat>` | **DID NOT FIRE, AND SOMETHING WORSE DID.** No retire failed. But `main.rs:860–865` — a comment written on this machine today — records that the startup sweep *archived the librarian's synced tail two lines after the MIGRATE installed it*, hash-verified byte-identical. **A seat lost its past through the success path, and no row covers that.** Not mine; flagged. |
| §10 | `READ-ONLY` | **not reached, and §11 item 6 predicted it is unreachable in this build.** Nothing falsified that. |
| §10 | no `sync at launch` row at all | **FIRED AT 08:45 in the real board** (the row went to the second house) **and the table's cause is wrong for this case.** It says "the build predates the sync." The build was current; the row was written to `~/.consonance/board.jsonl`. Looking in the right file for a row that went to the wrong file reads as "no row." |
| §10 | `REFUSING TO PUSH ... is private` | not reached (row 3 not run) |
| §10 | `NOT A FAST-FORWARD` | not reached |

**Score: 10 rows, 3 fired. One was right and incomplete (MIGRATE); two fired with the wrong
diagnosis attached (STANDALONE, no-row). Two more (RETIRE FAILED, and the missing mis-seated row)
name failures the table has no entry for.** The verdict-keyed design is the limit: **every row asks
what the seam row said, and both of this morning's real faults are invisible to the seam row.**

---

## 5 · THE REST OF THE RUNBOOK, SCORED

| § | verdict |
|---|---|
| §0 ① `machine_tag` | **LAND.** Named the silent killer, gave the exact tell, the tell was read, and MIGRATE printed. The most valuable paragraph in the document. |
| §0 ② board size | **LAND, and the honest correction in it was right.** Board is 45.0 MB (47,161,088 B), under 100 MB, compaction correctly skipped. The "look first" reframe cost 0.36 s and answered itself. |
| §0.5 (chair, 07:58) | **LAND.** All four stale numbers were real and all four moved. `close.js` guidance correct. |
| §1 pre-flight | **PARTIAL.** `Test-Path C:\Consonance\lighthouse\...` returns False here — the repo is at `C:\Users\nname\Desktop\lighthouse`. The document's own table catches it ("find it and substitute"), so this is a guarded assumption, not a miss. Recorded in §0.7 because every hardcoded path below needs the real value. |
| §2 step 1 | **WRONG, corrected by the chair at §0.6, trace kept.** The parenthetical claimed both readers strip a BOM. `parse_config` (`main.rs:98`) does not. This is the miss that cost the first launch. |
| §3–§4 | **LAND.** Build-don't-launch was right. `--verify` printed COMPLETE, 47 of 47, `pushed by L`. |
| §5 step 4 | **LAND**, moot on the happy path exactly as §0 ② predicted. |
| §6 step 5 | **LAND on the command, INCOMPLETE on the reading.** The `Select-String` is right; what it cannot tell you is that a correct MIGRATE can still leave the house wrong. |
| §9 stop-halfway | **LAND and currently load-bearing.** The "step 7 not run" row is the live state of this machine. |
| §11 | **The most honest section and the one that mattered.** Item 3 named the right file and the right hazard on the wrong variable (§0.7). Item 5 held — the MIGRATE arm's first execution in the world was this morning. Item 8 stands open. Item 6 unfalsified. |
| the falsifier | **FIRED.** §0.7 opens with it. |

---

## 6 · THE WRONG COLUMN — my own runbook's misses

Unnumbered: the ledger is librarian-kept and the numbers are the librarian's to assign. Four
entries, all mine except where marked.

**WRONG (B, this runbook, §2 step 1) — already taken by the chair at `51ac75f`; restated so the
trace is one place.** Asserted `Set-Content -Encoding utf8`'s BOM was safe because "both readers
strip it." I checked two readers and generalised to the third without opening it. `parse_config`
(`main.rs:98`) does not strip it, and it is the one that places the house. **Class: checked-wrong
claim, in the reassuring direction.** Cost: the first click opened the wrong house.

**WRONG (B, this runbook, §11 item 3 — and `state-manifest.json:21`, same sentence, also mine).**
Named `panes.json` as a hazard, named the right file, and stated the precondition on the wrong
variable: *"only if both machines resolve the same `instances_dir`."* They do resolve the same one.
The real precondition is that **the cwds it names exist on the destination** — which the manifest
cannot guarantee, because its `root` is `data_dir` and instance dirs are outside it. **The check I
prescribed passes and misses the failure I predicted.** Class: right hazard, wrong mechanism, and
the guard inherits the error — a prescribed check that cannot fail is worse than no check, because
it is read as clearance.

**WRONG (B, this runbook, §10 as a whole).** Built the failure table keyed entirely on the seam
verdict, and wrote *"the seam row's tag is the entry point for every row here."* Both of this
morning's real faults are invisible to the seam row. Class: **category error** — I treated the
launch verdict as the state of the house. The seam row reports what the *sync* did; nothing in the
table reports what the *seats* got.

**WRONG (B, this runbook, §10 STANDALONE row and no-row row).** Both gave a confident likeliest
cause ("`room_path` does not point at...", "the build predates the sync") from reading the code
rather than from any observed instance. Both fired this morning and both causes were wrong. Class:
a plausible cause stated with the confidence of a measured one.

**Not mine, flagged for the holder of `main.rs`:** the startup sweep archiving a seat's
just-installed synced tail (`main.rs:860–865`, measured on D today). A seat losing its past through
the success path is not in any table.

---

## 7 · WHAT I DID NOT VERIFY

1. **Why the live app writes into two `data_dir()`s.** Established that it does (§2), that it is one
   process, that `plog()` has one destination, and that the config parses clean. Did not find the
   second resolution. **This is the open fault on this machine and it is bigger than the retirement
   question it came out of.**
2. **Whether the mis-seating recurs on the next launch, or self-corrects.** `role_for_kept` runs on
   every kept resume and only *inserts* a role when it is committee (`main.rs:5427–5429`), so a
   pane whose cwd stopped matching would fall to the `"human"` default at `:8224` and injection
   would be refused. Whether that state is reachable depends on what rewrites `panes.json` and when.
   **Not traced. It is the difference between a paid cost and a latent one.**
3. **Which other cwd-derived readers break.** I checked the transcript path (`encode_cwd`) and
   captures (pane-id keyed, fine). I did not enumerate the rest.
4. **Whether the `.txt` captures the MIGRATE installed are correct content** for these four seats —
   only that they exist and are non-empty, which is what got `warm_resume_brief` past its guard.
5. **The 08:45 session's board rows, read in full.** I read the first two and last two of 40 and
   characterised the rest by pane and timestamp. I did not read the middle 35 line by line, so
   "the finding is already carried" rests on the commit message and §0.6, not on a row-by-row diff.
6. **`C:\Users\nname\lighthouse`** — confirmed to exist and to be a checkout; not opened, not
   diffed, not dated beyond the chair's Stage-6 characterisation.
7. **Anything about the laptop.** I read L's artifacts as they arrived in the state repo.
8. **`portable-pty`'s Windows behaviour beyond the source I read.** `cmdbuilder.rs:560–580` is
   unambiguous and the observed cwd matches `%USERPROFILE%` exactly, but I did not run a spawn
   against a missing directory to confirm empirically.
9. **I did not run `close.js`, did not push, and deleted nothing.**

---

## 8 · THE ONE LINE

**A pane's address and a pane's home are two different facts, and this build only checks the
address.** `panes.json` is a roster of strings; every guard that decides whether a seat is ours,
addressable, or safe to write to is a string prefix test against a path that need not exist. The
seats answered the chair all morning from a directory with no map in it, and the only thing on disk
that said so was the word `false` in a field that means something else.
