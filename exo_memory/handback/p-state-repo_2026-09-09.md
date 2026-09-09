# P-STATE-REPO (L052) — the transport. A, 2026-09-09.

**Objective, as briefed:** the state set moves between two machines and both can prove they hold
the same one.
**Registered falsifier, as briefed:** a pull that reports success with a path missing, or a synced
tail that differs from its source.

Every figure below re-derives from the command printed beside it. Nothing here is quoted from the
packet.

---

## 0 · WHAT THE PACKET GAVE ME PERMISSION TO REFUSE, AND WHAT I FOUND INSTEAD

§8: *"If the writers do not tolerate either linking or copy-on-close without a window where the
destination is wrong, say so and stop… the honest answer may be that the state can only move at a
quiescent moment — between turns, not during one."*

**That is the answer, and it is not a refusal, because it turned out to be measurable.** Neither
linking nor copying is safe. But *quiescence* is checkable from outside — a file that has not been
written for 150 ms is not inside a `fs::write` — so the tool implements the quiescent-moment rule
rather than merely naming it, and refuses BY NAME when a path never goes quiet.

**What that does change is E's design, and it should be relayed:** a per-turn Stop-hook push is
fine, and a push that fires *during* streaming will refuse specific capture tails rather than
carry them torn. The cadence must tolerate a refusal, not treat it as an error to retry through.

---

## 1 · THE COPY, MEASURED PER CLASS — the packet's central question

Three mechanisms were raced against real second processes. The instrument is
`scratchpad/m/race.js` and `scratchpad/m/gate.js` (scratch, not committed); every run reports
BOTH sides' activity and marks itself INCONCLUSIVE if either side did nothing — added after the
first run returned "0 torn out of 719" and the writer turned out never to have started.

### 1a · HARD LINK — REFUSED, on two independent measured grounds, both silent

    New-Item -ItemType HardLink; git add; git commit; git checkout -- a.txt; fsutil hardlink list

| step | result |
|---|---|
| append through the source link | repo side sees it — **the link works** |
| `git add` + `git commit` | link intact, `fsutil hardlink list` shows 2 paths |
| whole-file rewrite of the source | link intact, both sides read the new content |
| **`git checkout -- a.txt`** | **LINK BROKEN.** `fsutil` shows **1 path**. Repo froze at `v1`, source moved on to `v1\|v2`. **No error anywhere.** |

`--pull` fast-forwards, and a fast-forward *is* a checkout of every changed file. So the link dies
on the first pull on either machine, and from that moment the state tree pushes a stale board and
reports success forever.

**And a second, worse one found in the same run:** with a hard link in place,
`git status --porcelain` printed **a clean tree** after the file had changed through the other
link (git's racily-clean stat cache — the mtime falls inside the index's own second). A push that
trusted `status` would commit nothing and exit 0. An explicit `git add <path>` does force the
re-hash and does catch it, which is why the tool always adds by name — but that only rescues the
push, not the link.

### 1b · `fs.copyFileSync` — REFUSED, because it damages the SOURCE

`copyFileSync` is `CopyFileW`, which opens the source with a share mode that locks out the app's
own writer. Racing one copier against one writer:

| writer class | writer succeeded | writer got **EBUSY** | share refused |
|---|---|---|---|
| whole-file rewrite, 4.68 MB (`fs::write`, main.rs:818 / :5336) | 4,368 | **5,877** | **57%** |
| O_APPEND rows (`board_push`, main.rs:1910) | 30,773 | **9,012** | **23%** |

**And `main.rs` discards every one of those errors** — `let _ = fs::write(...)` at :818 and :5336,
`if let Ok(mut f) = OpenOptions...` in `board_push`. So a sync built on `copyFileSync` **silently
deletes the app's own board rows and capture stitches while reporting a clean copy.** Reading the
same files with an ordinary open instead: **0 EBUSY, both classes.**

That is a hazard in the direction nobody was looking — the packet asked what a mid-write copy
*gets*; this is what it *does*.

### 1c · What each class tolerates

| class | files | copy taken mid-write | verdict |
|---|---|---|---|
| **APPEND-ONLY** | `board.jsonl`, every `*.jsonl` ledger, a `.txt` while merely growing | **897 of 897 copies ended on a complete, parseable JSON line** | a valid PREFIX; a lost race costs the newest row and the next push carries it |
| **REWRITTEN** | `captures/*.txt` (stitch :818, eviction :5336), `letters.json` (:3447), `panes.json` (:3299) — all `fs::write`, truncate-then-write, **not atomic** | `CopyFileW`: **61 of 879 wrong** — 14 full-length **all-NUL**, 3 empty, 44 mixed. Plain read: **1,812 of 1,833 EMPTY** | a prefix is NOT valid state. An empty or NUL-filled capture is a seat that wakes as a stranger, and it is a perfectly valid file at the destination |

**The 14 all-NUL and the 3 empty are the ones that matter.** They are exactly the packet's
sentence: *a half-copied tail that syncs cleanly is indistinguishable from a good one at the
destination.*

### 1d · THE GATE, AND THE FINDING I DID NOT EXPECT

The first design was stat → read → stat → read-again, requiring size, mtime and bytes to agree.
At the app's real cadence (a rewriter at the 250 ms harvest poll) it measured **108 of 108 correct,
0 bad accepted, at most 2 attempts**, and under a pathological continuous rewriter **252 of 252
refused, 0 bad accepted.** It looked finished.

**Then its own test killed it.** Racing a real second process over a 200 KB file, the four-step
gate **ACCEPTED 6 TORN BUFFERS OUT OF 28.**

The reason is the one thing four agreements cannot see: `fs::write` leaves the file at an
intermediate **length** that holds steady, with one mtime, for as long as the writer is
descheduled. Both stats agree, both reads agree, and every one of those agreements is about the
same half-written file. **The read side cannot certify a rewritten file at all.**

What it *can* certify is that nobody has written it recently. `SETTLE_MS = 150`, sized from both
ends: a whole-file rewrite of a 4.68 MB capture measures **~1.08 ms** (1,383 rewrites in 1,500 ms),
and the harvest loop that issues them polls every **250 ms**. A file whose mtime is 150 ms old is
between writes, not inside one. A file whose mtime is in the FUTURE is refused outright — no wait
makes a future file old.

**That is the quiescent-moment answer made checkable rather than argued**, and it is the reason
this packet is a build and not a refusal.

*Its own limit, stated: `SETTLE_MS` is calibrated against a 4.68 MB capture on this machine's disk.
A far slower disk, or a capture an order of magnitude larger, moves the write time and the
constant with it. The falsifier is a torn arrival at the destination with the gate reporting
green — and `--verify`'s sha256 index is what would catch it.*

---

## 2 · THE COMPLETENESS CHECK — what saves 08:00

`--push` writes `state-set.json` at the state tree's root: one row per file with its **path, byte
count and sha256**, taken from the bytes actually copied, plus the machine and the time.

`--pull` = `git fetch` → **`merge --ff-only`** → verify every row of that index against the
checked-out tree → write `sync-completion.json`.

**Every failure names the path, the side, and what was expected**, because "incomplete" is not
actionable at 8am on another machine:

```
  INCOMPLETE — 1 of 2 file(s) failed. Each one, by name:
    ABSENT   captures/A.txt
             at:       C:\Consonance\state\data\captures\A.txt
             expected: 4 bytes, sha256 3e2d8f1a9c04…
             found:    no such file in the pulled tree
```

Kinds: `ABSENT`, `SIZE` (and it says **`SHORT — a truncated arrival, not a stale one`** when the
file is shorter), `CONTENT` (right length, wrong bytes — with the note pointing at
`.gitattributes -text`, because that is the likeliest cause and it is otherwise unguessable).
Files present in the tree that the index does not claim are reported as strays: not a completeness
failure, but a path that stopped travelling and left a stale copy at the destination looking
current.

**`verified` and `installed` are SEPARATE fields in `sync-completion.json`, and this is the part
C's launch has to read.** `--pull` verifies; it does not write into the data dir. `--pull --install`
does, and only then does `installed` go true. A launcher that asks only "verified?" would start on
a set that was checked in the state tree and never arrived in `data\`, which is the quiet
half-arrival this packet exists to prevent. **C: read `installed`, not `verified`.**

`--install` moves every file it is about to overwrite into `data/attic/pre-sync-<stamp>/` first.
A bad sync has to be reversible on the machine it landed on, or the first one is permanent on both.

---

## 3 · THE CRLF LANDMINE — found before it fired

    git -C C:\Consonance\state config core.autocrlf      ->  true

**`core.autocrlf` is TRUE in the clone the chair made.** Without intervention git rewrites every LF
to CRLF on checkout, so the desktop's `board.jsonl` would arrive byte-different from the laptop's:
every sha256 in the index would mismatch, the completeness check would go red for a reason that has
nothing to do with a missing path, and if it went unnoticed the room's readers would be parsing a
board whose every line ends differently from the one that was written.

`--push` writes `.gitattributes` containing `* -text` into the state tree and commits it, and there
is an integration test that sets `core.autocrlf=true` on a fixture repo and asserts an LF file
survives a real commit-and-checkout round trip byte-for-byte.

---

## 4 · THE IN-SYNC LINE

`chain-status.js:952` — `this machine only` is **replaced**, not kept beside it. A line that
announces an isolation which is no longer real is a worse limit than none.

    in sync D a17007f/L 3b38d3b as of 6m ago      both machines, both heads
    in sync? L 3b38d3b as of 2m ago               one machine has pushed — a QUESTION, not an agreement
    D never                                       a machine that has pushed nothing
    this machine only                             no state repo, or no status file: byte-identical to before

Read from `data/state-sync.status.json`, written by `--push` and `--pull` — **never from `git log`**,
because this runs from the pulse hook on every prompt in every seat and a subprocess per machine
per prompt is a tax on the one line everyone reads.

**`as of` is load-bearing.** The file records the other machine's head *as of this machine's last
sync*. A desktop that pushed one second ago is invisible until this machine pulls; a bare pair of
hashes would read as a live agreement that was never checked, which is the same false green
`this machine only` was invented to avoid.

**A defect of my own, caught by B's suite on the first run and worth recording because this file
has now caught it three times:** the first version resolved the status path from the module-level
`DATA_DIR`, so a temp-dir fixture printed the LIVE machine's sync status. It is now resolved
**beside the ledger in use**, the rule already written above the board's resolution at `:895`.

**Scope kept:** the in-sync segment only. B's structure is untouched; the 79 tests that were there
pass unchanged, and six were added for this segment (85 total).

---

## 5 · THE SET, SIZED AGAINST B's MEASURED NUMBER

    stat -c "%s %y" C:/Consonance/data/board.jsonl     # B's compaction landed 03:52:24
    node consonance/tools/state-manifest.js            # the set, and the check that nothing is unplaced

| | bytes | |
|---|---|---|
| `board.jsonl` before B | 338,578,424 | 322.9 MB |
| `board.jsonl` after B | **46,937,478** | **44.8 MB** |
| **TRAVELS, whole set** | **60,593,399** | **57.8 MB**, 49 files, every file under the 100 MB cap |

*Both post-compaction figures are of a LIVE corpus and grow with every turn — the board was
46,937,478 at 03:52:24 and 46,942,737 thirteen minutes later. Re-run the command rather than
quoting these; they are a reading, not a constant.*

**My L049 projection was 52,808,182 (50.4 MB) for the board-inclusive set and it was low by
5.9 MB** — the projection modelled the board alone by the behind-the-max rule and the real board
came back at 44.8 MB where I predicted ~39.8 MB. The set is sized against B's number, not mine, per
the packet.

**One manifest change outside my packet, flagged because it is a rule change to a shared file and
reverts in one line.** `captures/archive/*.txt` was UNDECIDED with interim STAYS. The ruling had
already landed in writing —
`loop/one_house_two_machines_idea_2026-09-08.md` §6 rule 1, from the keeper's own words at 02:19:
retired seats stay **revivable**, and a retired thread's capture tail is its only carrier. It is
now TRAVELS (+303,649 bytes). Without it the first real sync would have shipped a set that is
wrong by a ruling already made. **UNDECIDED is now 0.**

Also ruled, because the tool writes them and the checker would otherwise go red on its own
output: `state-sync.status.json` STAYS, `attic/pre-sync-*` and `attic/pre-sync-*/**` STAYS. Each
STAYS for the reason `install_id` and `sync-completion.json` do — a per-machine record read on the
other machine is foreign state read as self.

---

## 6 · PRIVACY, VERIFIED HERE

    gh repo view solariz3d/consonance-state --json isPrivate,visibility
    {"isPrivate":true,"visibility":"PRIVATE"}

Run by me, not accepted from the packet. **And the tool re-runs it before every push and FAILS
CLOSED**: `gh` absent, unauthenticated, or the repo unreadable all give `unknown`, and unknown
refuses. From inside this machine a private repo and a repo nobody could ask about read
identically, and this one carries the keeper's board.

**`install_id` is enforced by PRESENCE, not by column** — the manifest's `forbidden` list, checked
before classification, red the day the file appears under the data root. That ruling holds and this
is the repo it was written for.

---

## 6a · THE THIRD PLACE'S RECORD IS ON GITHUB. I PUT IT THERE. READ THIS BEFORE §6b.

**The interrupt that carried this finding said *"the window is still clean and this lands before
the first push."* It did not. It arrived at 04:36; I pushed at 04:33.** The chair's `ls-remote`
came back empty at 03:56–04:00 and that reading was true when it was taken and stale by thirty-three
minutes when it was relayed. **A verification is a timestamp, not a state** — and the seat that
acted between the check and the report was me.

**Measured extent, not estimated:**

    git ls-remote origin
      6dfcc36de2da61d3574167f61b062176ee5636b3  HEAD
      6dfcc36de2da61d3574167f61b062176ee5636b3  refs/heads/main

    git cat-file -s  (per commit, all three)
      40107  data/captures/3d000000-0000-4000-8000-000000003d00.txt          the live tail
      79991  data/captures/archive/3d000000-0000-4000-8000-000000003d00.txt  the retired tail

**120,098 bytes of the Third Place's record, in all three commits, on `refs/heads/main` at
`solariz3d/consonance-state`.** Repository private, created 09:26:38Z, last push 10:35:17Z,
**0 forks, 1 collaborator (`solariz3d`, the owner)** — so the exposure is GitHub's servers and the
keeper's own account, and nothing else. That bounds it; it does not excuse it.

**BOTH HALVES WERE MINE, AND THE SECOND ONE IS WORSE.**

- `captures/*.txt` → TRAVELS was written about the warm-resume carriers and **silently swallowed a
  seat the keeper's rule forbids.** C found it (P-SYNC-AT-LAUNCH §6a). A rule can be right about
  every case its author had in mind and still be wrong, because **a glob has no idea what it is
  for.**
- `captures/archive/*.txt` UNDECIDED → TRAVELS is **a change I made in this packet, an hour ago,
  and wrote a paragraph defending.** The ruling I applied was real and about *revivability*. It
  says nothing about *whose record*. I carried a correct ruling across a boundary it never
  addressed, and the interrupt did not name this half — it was still mine to find. Retired does not
  lift the keeper's rule; a retired Third Place tail is more of its record, not less.

**The uncomfortable part, said plainly rather than filed:** §6 of this hand-back reports that I ran
the privacy check myself instead of accepting the chair's word, and I did, and it returned PRIVATE,
and it was the wrong question. *Is the destination private* was verified to the letter. **Nobody
asked whether the CONTENT was permitted to go there at all**, and the manifest — the instrument
built precisely so that no path travels by accident — answered the first question fluently while
never being asked the second. The gate I wrote to make an unclassified path impossible has no
concept of a path that is classified correctly and must not travel anyway.

**FIXED IN THE MANIFEST, both rules, first-match-wins order:**

    captures/3d000000-*.txt          -> STAYS   (before captures/*.txt)
    captures/archive/3d000000-*.txt  -> STAYS   (before captures/archive/*.txt)

TRAVELS is now **47 files, 60,622,895 bytes**; all four Third Place paths (`.txt` and `.log`, live
and archived) classify STAYS; UNDECIDED 0, UNPLACED 0. **The librarian is putting STAYS to the
keeper as the stated default and I have treated it as the rule.**

Also added, from C §6e, and named EXPLICITLY rather than by a `sync-*` glob — because a wildcard is
what caused this entire section: `sync-adopted.json` STAYS, `sync-pull.log` STAYS. A future `sync-*`
file these rules do not name will show as UNPLACED, which is loud and correct.

### WHAT I HAVE NOT DONE, AND WHY IT IS NOT MINE

**I have not pushed again, and I have not touched the remote.** The chair's stop stands.

**And a corrected push would not fix this anyway, which is the fact the decision needs.** Rewriting
the branch removes the *ref*; the blobs stay reachable by SHA through GitHub's API until they are
garbage-collected, which for a repository is not a thing this end can force. **The only complete
remedy is deleting the repository.**

That is cheap here and it is still not mine to do. The repo is three minutes older than its first
commit, private, un-forked, and its entire contents are a set that re-pushes in seconds from the
corrected manifest — **nothing of value is lost by deleting and recreating it.** But it is the
keeper's account and the keeper's material, and this room's rule is that publishing outward keeps a
human awake saying yes. Un-publishing is the same door. **Recommendation: delete
`solariz3d/consonance-state`, recreate it private, and re-push from the corrected manifest — the
whole operation is under a minute and it is the only version of this that actually removes the
bytes.** A force-push instead is cosmetic and should not be reported as a fix.

One local copy existed outside the data dir — the temp clone §6b used for the round trip. **Deleted.**

---

## 6b · IT RAN. THE ROUND TRIP IS DONE, OVER THE REAL REMOTE.

*Read §6a first: this section is the mechanism working, over a set whose contents were wrong.*

    node consonance/tools/state-sync.js --push
    -> state-sync --push · L · committed cde9b5f · 52 path(s) · 57.9 MB
       privacy verified here: solariz3d/consonance-state gh: visibility=PRIVATE
       pushed to origin/main
       in sync: L cde9b5f

Then a **second clone from GitHub**, into a temp tree with its own empty data dir — the desktop's
shape, on the real network, not a bare repo in a fixture:

    git clone https://github.com/solariz3d/consonance-state.git <tmp>/state     # 2.5 s, 75 MB
    CONSONANCE_STATE=<tmp>/state CONSONANCE_DATA=<tmp>/data CONSONANCE_MACHINE=Dsim \
      node consonance/tools/state-sync.js --pull --install

    -> COMPLETE — 49 of 49 files present, right length, right bytes.
       installed 49 file(s); 0 displaced
       sync-completion.json: verified true, installed true, head cde9b5f, pushed_by L

**49 of 49 sha256 matched after a real clone on a machine with `core.autocrlf=true`.** That is the
`.gitattributes` rule holding under the exact condition that would have broken it, measured rather
than reasoned about.

**And the falsifier was fired at it deliberately, on that real tree** — one file deleted, one byte
appended to another:

    INCOMPLETE — 2 of 49 file(s) failed. Each one, by name:
      ABSENT   lap.jsonl     expected: 188137 bytes, sha256 7387355ca88a…
                             found:    no such file in the pulled tree
      SIZE     letters.json  expected: 613 bytes  found: 614 bytes
                             note:     LONGER than the pushed file
    exit 1

**The packet's registered falsifier — "a pull that reports success with a path missing" — does not
fire, and the check that would have caught it is itself demonstrated firing.** The `in sync` line
now reads `in sync? L cde9b5f as of 5s ago` where it read `this machine only` for the whole night.
The `?` is doing real work: one machine has pushed, so there is nothing yet to agree with.

**AND THE NUMBER E's PER-TURN DESIGN NEEDS, measured on three real pushes.** The first carried the
whole 57.9 MB set; the next two carried only what moved:

    f077b8c   data/board.jsonl 2+ · data/sessionstart-state.jsonl 1+ · machines/L.json · state-set.json
    6dfcc36   data/board.jsonl 1+ · machines/L.json · state-set.json

**A steady-state push is one line of board diff plus the index — seconds, not the 57.9 MB.** Git
deltas an append-only file well, which is the property the whole TRAVELS column happens to be made
of. A push at turn cadence is cheap; the expensive one already happened.

---

## 7 · TESTS

    node consonance/tools/state-sync.test.js       37 passed, 0 failed  (run 3x, no flake)
    node consonance/tools/state-sync.mutants.js    21 killed, 0 survived, 21 total
    node consonance/tools/chain-status.test.js     85 passed, 0 failed  (79 before, 6 added)
    node consonance/tools/state-manifest.test.js   (unchanged, still green)

**The mutation pass earned its keep four times over, and three of the four findings were about my
own tests rather than my code:**

- **`a future mtime is accepted` survived.** The branch is real but *not a distinguisher* — a
  future file already fails the age check. Its only value is refusing ONCE with a name instead of
  sleeping eight times, so that is now what is asserted.
- **`mtime is not compared across the read` survived, and the honest answer was to DELETE code.**
  There was a second `stat` between the two reads; the surviving mutant proved it dead, because the
  final stat is strictly later and compares against the same first one. A line that cannot fail is
  the shape this room otherwise distrusts, so it is gone rather than explained — and one syscall
  per file with it. The buffer-length-versus-stat check stayed, because that one compares a BUFFER
  to a STAT and no stat-to-stat check can.
- **`install reports true even when it wrote nothing` survived and was MY BAD MUTATION** —
  `installed = true` → `installed = true; void 0;` changes no behaviour, so it could only ever
  survive. A mutation that cannot fail measures nothing. Replaced with a real defect: a bare
  `--pull` that installs anyway.
- **`a short read is accepted` survived** until a test existed where both reads return the SAME
  short buffer — consistent stats, consistent reads, and the file still not all there.

Every test runs against its own fixture — its own data dir, its own manifest, its own bare remote
and clone. Nothing reads `C:\Consonance\data` or `C:\Consonance\state`, and the suite passes on a
machine that has neither.

**Two things it cannot test in-process, said here rather than left as holes:** that a read does not
EBUSY the app's own writer (a two-process race, measured with a two-process instrument — §1b), and
that a real 100 MB push is rejected by GitHub (the cap is enforced from the size, before git is
touched).

**AND A DEFECT I CAUSED IN THE SHARED TREE, WHICH ANOTHER SEAT SAW BEFORE I DID.** I started the
mutation runner twice, overlapping. The second run read its `original` from a file the first had
already mutated, and its own `finally { restore() }` wrote **that** back as the truth — so one
mutation (`verify treats a missing file as present`) survived the pass and sat in `state-sync.js`
for roughly twenty minutes. E reported *"A's `state-sync.test.js` is red (24/9)"* during that
window and **E was right**; the redness was mine and its cause was the repair step.

**This is the shared-write class this room has now measured three times** — `git add -A` capturing
another seat's file, `git commit` taking the shared index at `38ae5c2`, and now a tool mutating a
path with nothing enforcing that it holds it alone. **The pattern worth keeping: the damage was
permanent BECAUSE the cleanup ran.** A crash would have left the mutation obvious; a successful
restore of the wrong baseline made it invisible.

Fixed with two guards, both of which fail loudly: an exclusive `wx` lock file (no check-then-create
window), and a tripwire that refuses to start if `state-sync.js` already contains any of the
runner's own replacement strings — because in that case `original` is not original and restoring it
would write yesterday's mutation back as the truth.

**Corrections I made to my own work, in order:**

1. The first race instrument reported **0 torn out of 719** and the writer had never started.
   Fixed by making both sides report their own activity and marking a run INCONCLUSIVE otherwise.
2. The first stable-read gate **accepted 6 torn buffers out of 28** (§1d). The quiescence gate is
   the fix.
3. The first push **committed on every run** even when no byte of state had moved, because the
   index and the machine row each carry a timestamp. Nothing-changed is now decided on the file
   list and its hashes; the clock rides along only when something moved.
4. The first `inSync()` read the live machine's status from a fixture (§4).
5. The fixture manifest did not rule the tool's own output files and the push refused them as
   UNPLACED — the checker correctly catching a gap in the tool that writes them.

---

## 7b · THE INTERRUPT ITSELF WAS REFUSED, AND THAT IS NOT MY FINDING TO KEEP

Carried at the chair's instruction: **this interrupt bounced off the dispatch guard as out-of-turn
on its first attempt**, and the chair had to re-take the baton for seconds to send it. `BUILDING.md`
keeps one carve-out — a genuine interrupt goes immediately, it is not a deliverable, nothing is
claimed — **and the verb has no such carve-out.** A privacy interrupt about the keeper's own
material was the thing the guard stopped.

**E holds the open ruling on exactly that question and now has a live case instead of a
hypothetical** — and §6a is the cost of the delay stated in bytes: the check that would have
prevented this was correct, was carried by the right seat, and arrived three minutes after the
push. **A guard that delays a stop is not neutral; it spends the window the stop was for.**

---

## 8 · WHAT THIS DOES NOT ESTABLISH

- **Nothing has been proved on a second MACHINE.** §6b is a real clone over the real network and it
  is still this disk, this OS, this git config. The desktop at 08:00 is the first genuine one, and
  the difference that could bite is its own `core.autocrlf`, its own git version, and its own paths.
- **`--install` has never overwritten a live data dir.** §6b installed into an EMPTY one — 49 files
  written, **0 displaced**, so the backup path did not execute outside its fixture. The consequences
  of installing over a *running* app are untested, and the launch order (pull, verify, install,
  *then* start) is C's packet, not mine.
- **The nothing-changed path has never fired on the live house, and probably cannot.** Three pushes
  ran; the second and third both committed, because `board.jsonl` grows with every turn including
  the ones running this packet. It is correct behaviour and it means that branch only matters with
  the app closed. Untested where it counts.
- **`panes.json` carries absolute cwd paths** and my L049 precondition on it is still UNVERIFIED —
  I cannot read the desktop's `~/.consonance.json` from here. If the two machines resolve different
  `instances_dir` the file travels correctly and *means* something different at the far end. This is
  the likeliest way 08:00 goes wrong in a way no check in this tool can see.
- **`~/.consonance.json` on the desktop has no `state_dir`,** so `stateDir()` falls back to
  `C:\Consonance\state`. If the desktop's clone lands anywhere else, set `CONSONANCE_STATE` or add
  `state_dir` before the first pull.
- **Two machines appending to the same ledger between syncs still conflicts**, exactly as the
  manifest's own `limits` say. `--pull` refuses a non-fast-forward rather than inventing a merge;
  that is a refusal, not a solution, and the solution is E's single-live-host guard.
- **The board is the only file measured near the cap.** A future one crossing 100 MB is refused by
  the tool before git is touched, which is loud — but it stops the sync dead, and nothing yet
  rotates the board on a schedule.

---

## 9 · FOR THE DESKTOP AT 08:00

```
git -C C:\Consonance\lighthouse pull
git clone https://github.com/solariz3d/consonance-state.git C:\Consonance\state   # first time only
node consonance/tools/state-sync.js --pull --install
node consonance/tools/chain-status.js
```

**Set `machine_tag` on the desktop first — C raised this and C is right.** This machine's
`~/.consonance.json` has `"machine_tag": "L"`; the desktop's does not, so `machineTag()` falls back
to `os.hostname()`. That is unique and correct, and it is *unreadable* in the one line everyone
reads: `in sync L 3b38d3b/DESKTOP-8F2K1QP a17007f`. Add `"machine_tag": "D"` before the first pull
and the line says `L … / D …`. The fallback is deliberately a hostname and not a hardcoded letter —
two machines silently sharing a tag is `install_id`'s failure a fourth time, and a hostname cannot
collide by accident.

A `--pull` that prints `INCOMPLETE` names the path and the side; do not launch on it. A `--pull`
that prints `COMPLETE` and `installed` leaves `sync-completion.json` with `verified: true,
installed: true`, and `chain-status` should then print two hashes instead of `this machine only`.

---

## 10 · L052 FOLLOW-UP, 04:40 — the residues, and one correction the chair needs

**The follow-up carrying these arrived stating that the manifest still resolves the Third Place's
tail to TRAVELS and that `git ls-remote` is still completely empty. Both readings are of a state
that no longer exists**, and the chair's own pane shows it has since caught up (`STOP ALL
state-sync --push`). Recording it here because §6a and §7b are about exactly this and the third
instance in one hour makes it a pattern rather than a slip: **the composer queued the interrupt, it
drained after the work it was meant to stop.**

**Re-verified by me just now, not carried from my own earlier reading:**

    git ls-remote origin
      6dfcc36de2da61d3574167f61b062176ee5636b3  HEAD
      6dfcc36de2da61d3574167f61b062176ee5636b3  refs/heads/main
    git ls-tree -r origin/main --name-only | grep 3d000000
      data/captures/3d000000-0000-4000-8000-000000003d00.txt
      data/captures/archive/3d000000-0000-4000-8000-000000003d00.txt

**The remote is not empty and the Third Place's record is in it.** §6a stands unchanged, including
its recommendation, which is the keeper's: **deleting the repository is the only remedy that
removes the bytes.** Nothing has been pushed since; the hold is observed.

**The two rules were already applied last turn** (§6a). Resolved against the live manifest by the
chair's own method, so the two answers are comparable:

    captures/3d000000-*.txt                      captures/3d000000-0000-…-003d00.txt          [STAYS]
    captures/archive/3d000000-*.txt              captures/archive/3d000000-0000-…-003d00.txt  [STAYS]
    sync-adopted.json                            sync-adopted.json                            [STAYS]
    sync-pull.log                                sync-pull.log                                [STAYS]

The archive rule is the half the follow-up does not name, and it is the one I caused this packet.
Both `sync-*` files are named **explicitly rather than by a glob** — a wildcard is the whole subject
of §6a, and a `sync-*` pattern would have been the same mistake with the same shape. A future
`sync-*` file these rules do not name reads as UNPLACED, which is red, which is correct.

### 10a · The wall-clock settle test — fixed, not declared

`a file written THIS INSTANT costs exactly one settle wait` asserted elapsed wall-clock from a `t0`
taken before the call. **That is measurable-but-wrong: `stableRead` sleeps only the REMAINDER of the
window, so any delay between stamping the file and entering the function comes straight off the
measured wait.** On a loaded tree the file is already part-settled and the assertion fails for a
reason that has nothing to do with the code — the librarian's 33/1.

The property that matters was never the duration. It is that **the bytes were not accepted until the
file had been quiet for `SETTLE_MS`**, so that is what it now asserts — the file's own mtime at the
moment of return, against which a loaded machine can only make the test *more* true.

    4 suites run concurrently on this tree:  37/0, 37/0, 37/0, 37/0

*The general form, since this is the second flaky assertion I have written tonight: an assertion
whose answer depends on how busy the machine is is not an assertion. Measure the state, not the
stopwatch.*

### 10b · portable-paths — baselined, with the reason at the site

    node consonance/tools/portable-paths.js --update
    diff vs HEAD:  added 1, removed 0, total 176 -> 177
      + consonance/tools/chain-status.test.js  [BENIGN-TEST]
        'a temp-dir fixture must not see C:\Consonance\data: ' + r.text);

Exit 0. **The baseline carries a verdict and no free text — its own header says the diff carries the
argument — so the reason is written at the site**, where it survives the next `--update`: the literal
is inside a FAILURE MESSAGE, not a resolution. Nothing reads it, nothing resolves against it, and
the assertion behaves identically on a machine with no `C:` drive. It is there so that when the test
fails, the reader is told *which* directory must not have been consulted, which is the entire content
of the defect. Resolving it from config would make the message correct on a machine that never had
the bug and unreadable on the one that does.

**Green after both residues:** `state-sync` 37/0, `chain-status` 85/0, `state-manifest` 25/0,
`portable-paths` exit 0, `state-sync.mutants` 21 killed / 0 survived.

---

## 11 · DEMONSTRATED, NOT ASSERTED — 04:43

*The chair asked for output rather than a claim, having been burned by a stale reading reported as a
settled state. Everything below is a paste, and the same standard is applied to the chair's own
disarm rather than taken on trust — that is the point of the rule, and it does not have a direction.*

### 11a · The push disarm, verified at this end

    git -C C:\Consonance\state remote -v
      origin  https://github.com/solariz3d/consonance-state.git (fetch)
      origin  no_push (push)

**Confirmed.** `--push` on this machine now fails at the remote name before it reaches the network.
Structural, not remembered — the right shape, and it is the gate §6a said was missing.

### 11b · What is on the remote — the chair's own count, reproduced here

    git -C C:\Consonance\state ls-files | grep -c 3d000000     -> 2
      data/captures/3d000000-0000-4000-8000-000000003d00.txt
      data/captures/archive/3d000000-0000-4000-8000-000000003d00.txt

Agrees exactly. Three commits, `cde9b5f f077b8c 6dfcc36`, both files in every one.

### 11c · Rule ORDER in the file, since first-match-wins is the whole mechanism

    23:  captures/3d000000-*.txt          STAYS
    24:  captures/archive/3d000000-*.txt  STAYS
    25:  captures/*.txt.bak-*             STAYS
    26:  captures/*.txt                   TRAVELS      <- the glob that caused this
    27:  captures/*.log                   STAYS
    28:  captures/archive/*.log           STAYS
    29:  captures/archive/*.txt           TRAVELS      <- the one I widened this packet
    88:  sync-adopted.json                STAYS
    89:  sync-pull.log                    STAYS

Both STAYS rules sit **ahead** of the globs they carve out of.

### 11d · Resolution, path by path

    path                                                        matched rule                     class
    captures/3d000000-0000-…-003d00.txt                         captures/3d000000-*.txt          STAYS
    captures/archive/3d000000-0000-…-003d00.txt                 captures/archive/3d000000-*.txt  STAYS
    captures/3d000000-0000-…-003d00.log                         captures/*.log                   STAYS
    captures/archive/3d000000-0000-…-003d00.log                 captures/archive/*.log           STAYS
    sync-adopted.json                                           sync-adopted.json                STAYS
    sync-pull.log                                               sync-pull.log                    STAYS
    captures/0c0c0c0a-0000-…-000a01.txt                         captures/*.txt                   TRAVELS
    captures/archive                                            captures/archive                 TRAVELS

The last two are there deliberately: **the carve-out has to be narrow enough that the other seats'
tails still travel**, or the fix has quietly broken the warm-resume carriers to protect one file.

### 11e · The checker over the live corpus

    node consonance/tools/state-manifest.js                                        rc=0

    state-manifest v1 · C:\Consonance\data · 2026-09-09T10:43:41.433Z
      139 paths walked (128 files, 11 dirs)

      TRAVELS        53 paths ·   47 files ·    57.9 MB
      STAYS          37 paths ·   35 files ·   892.4 MB
      REGENERATES    49 paths ·   46 files ·     0.0 MB
      UNDECIDED       0 paths ·    0 files ·     0.0 MB

      declared, not present yet: live_host.json (TRAVELS)
      declared, not present yet: sync-adopted.json (STAYS)
      declared, not present yet: sync-pull.log (STAYS)
      declared, not present yet: attic/pre-sync-* (STAYS)
      declared, not present yet: attic/pre-sync-*/** (STAYS)

      TRAVELS = 60708575 bytes (57.9 MB)   [GitHub per-file hard limit is 100 MB]

**UNPLACED 0, UNDECIDED 0, exit 0.** C's two files are `declared, not present yet` — the state the
manifest is *supposed* to be in before a launcher that has never run: ruled in advance, so the first
desktop launch cannot go red on bookkeeping and hide a real defect behind it.

Every Third Place path under the live data dir, as the checker classifies it — **TRAVELS count: 0**:

    STAYS         1205488  captures/3d000000-0000-…-003d00.log
    STAYS           46023  captures/3d000000-0000-…-003d00.txt
    STAYS         3433695  captures/archive/3d000000-0000-…-003d00.log
    STAYS           79991  captures/archive/3d000000-0000-…-003d00.txt
    REGENERATES       219  harvest/3d000000-0000-…-003d00.json
    REGENERATES       217  ready/3d000000-0000-…-003d00.json

### 11f · The two residues, closed at §10, shown here

    4 suites run concurrently on this tree:   37/0   37/0   37/0   37/0
    node consonance/tools/portable-paths.js   rc=0
    node consonance/tools/chain-status.test.js   tests 85, pass 85, fail 0
    node consonance/tools/state-manifest.test.js 25 passed, 0 failed

### 11g · On the chair taking the blame

Recorded because the record should carry it and not because it changes what I owe: the chair's
account is accurate about the packet and the gate, and it is **not the whole account.** The manifest
that classified the file was mine; the archive glob that put the retired tail there was widened *by
me, in this packet, an hour before the push*, with a paragraph defending it; and I ran the privacy
check myself and asked it the wrong question (§6a). A gate that did not exist and a classification
that was wrong are two defects, not one, and only the first was the chair's.

**The scrub is the keeper's and nothing on that remote has been touched.** No delete, no rewrite, no
force-push, no further push — and now it is structurally impossible from here as well as observed.
