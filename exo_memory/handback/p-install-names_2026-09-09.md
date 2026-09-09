# P-INSTALL-NAMES (L055, desktop/machine D) — `--install` reads the destination, and names the difference

*Pane A. Files touched: `consonance/tools/state-sync.js`, `consonance/tools/state-sync.test.js`,
`consonance/tools/state-sync.mutants.js`. Nothing else. `main.rs` is C's and was read only.*

---

## THE ANSWER FIRST, INCLUDING THE PART THAT IS AGAINST ME

**A shortfall EXITS 1.** Reasoning below.

**And: this change could NOT have caught the 2026-09-09 incident — not "probably not", but by
construction.** I am putting that at the top rather than at the bottom, because the packet was
written as though it would. The file was taken away *after* `state-sync` had already exited, and no
reading this tool takes can see past its own exit. The proof is in §5. What the change does buy on
that exact morning is smaller and real: `46` stops being a mystery, and it stops pointing at the
wrong thing. See §1.

---

## 1. WHAT `46` ACTUALLY WAS — and it is not what the packet assumed

The packet reads `47 verified / 46 installed` as one file that did not land. Re-derived here, it is
two separate facts that the tool printed as one number:

    sha256sum /c/Consonance/data/captures/archive/0c0c0c0b-0000-4000-8000-00000000115b.txt
    sha256sum /c/Consonance/state/data/captures/0c0c0c0b-0000-4000-8000-00000000115b.txt
      -> 8184ad81edc31f63001eb634ff9122505cf78909c00166454b634a7d160858e6   (both)

The archived copy is **byte-identical to the state tree's live blob**. So the librarian's tail *did*
reach the data dir with the right bytes. It was then renamed away by `gc_captures()`. **The install
landed all 47.**

`installed 46 file(s)` was therefore not a shortfall at all. It was `installTree` counting calls to
`fs.writeFileSync` and silently omitting the one file it skipped as already-identical — a file that
was present and correct. The count that made a whole seat's disappearance look like an install
failure was measuring something else entirely.

That `46` means *"one was skipped"* and not *"one is missing"* follows from the code and needs no
guesswork: `installTree` visits every index entry and either writes it or `continue`s on an exact
sha match, and there is no third arm — a write that fails throws and kills the process. The run
completed and wrote `sync-completion.json`, so `wrote 46 + skipped 1 = claimed 47`.

**Which file was skipped is not recoverable.** The record never wrote it down. That absence is the
defect this packet fixes, and it is worth naming precisely: the number was not merely un-actionable,
it was *pointing at the wrong thing*. The librarian's write-up opens its finding on `46 of 47` and
had to reach the real mechanism — a rename, three call sites deep in `main.rs` — by other means
entirely.

The tool now prints, and records, all three quantities. **The block below is a reconstruction of
what this morning's run would have printed, not a captured log** — `--install` has not been run
against the live corpus and the packet forbade it:

    installed 46 file(s) into C:\Consonance\data; 1 already identical; 16 displaced file(s) kept at …
    RECONCILED — 47 of 47 verified file(s) are in C:\Consonance\data, right length, right bytes.

The same two lines from a fixture, which *is* captured — `node consonance/tools/state-sync.test.js`,
test `--pull --install prints RECONCILED…`, asserted as `/RECONCILED — 2 of 2/`.

`46 + 1 = 47` closes. The reader can tell a benign skip from a file that never arrived, which was
exactly the distinction that could not be made.

---

## 2. THE RECONCILIATION — the claim is taken from the destination

`state-sync.js`, new `reconcileInstall(DATA, v)`, called from `cmdPull` immediately after
`installTree` and **before** anything is recorded.

It takes **nothing** from the install. It walks `state-set.json`'s file list — the artefact the
caller holds and can re-derive with `git -C <state> show origin/main:state-set.json` — and for each
claimed path it stats and hashes `DATA/<path>`. Its vocabulary is `verifyTree`'s on purpose:

| kind | what the destination showed |
|---|---|
| `ABSENT` | no such file, or a directory standing where a file should be |
| `SIZE` | wrong length (`SHORT` vs `LONGER` said in words) |
| `CONTENT` | right length, wrong bytes |
| `UNREADABLE` | right length, and this machine cannot read it (the error carried through) |

The shortfall report prints **one block per path** — path, absolute location on this machine,
expected, found, note — and the recovery command:

    git -C <state tree> show origin/main:data/<path>

`installTree` additionally now returns `skipped`, so `wrote + skipped === index.files.length` is an
invariant the suite asserts rather than a thing the reader has to assume.

### What it does not claim

It is a reading, not a lock. A process that removes a file after it returns leaves it green. That is
stated in the function's own header rather than left for someone to discover, because it is the
difference between this change and the thing the packet hoped for.

---

## 3. THE EXIT-CODE RULING — non-zero, and why the launcher argument does not carry

The packet notes that a launcher reading `sync-completion.json` can already refuse, and asks whether
that makes exit 0 sufficient. It does not.

1. **The launcher is not the only caller.** A shell, a runbook step, a hook, and every `&&` read the
   exit code and read nothing else. Exit 0 over a set that did not arrive is precisely the shape of
   the sentence this packet exists to kill — *"and the launch reported success."* Adding a second
   channel does not license weakening the first; the failure being fixed is one channel being
   trusted alone.

2. **This file is fail-closed everywhere else it can be wrong about arrival.** `REFUSING TO PUSH` on
   a privacy check it could not confirm; exit 1 on an `INCOMPLETE` tree. A loud-but-zero path here
   would be a second, weaker standard for the same class of fact, in the same file, decided by which
   function you happened to be in.

3. **Exit 1 costs nothing that is not already lost.** The set is already short. Exit 0 means some
   caller proceeds on it.

### AND THE OBJECTION FROM MY OWN LAST PACKET, ANSWERED

L054's headline was *"THE EXIT CODE CANNOT CARRY THE ANSWER"* — `--push` returns 0 from four places
and 1 from eight, so a caller cannot learn from it *which* thing happened, which is why `close.js`
was given a receipt instead. Read carelessly that is an argument for not caring about the exit code
here. It is not.

The exit code is **one bit: proceed, or do not.** L054's finding is that one bit cannot
*discriminate* among outcomes — not that a bad outcome may set it to zero. Overloading it further
was the error; emptying it is the opposite error and lands in the same place, a caller that cannot
tell a delivered set from a refused one. So both, deliberately, and each doing only what it can:

- **the exit code** says *do not proceed* — to every caller, including the ones that read nothing else;
- **`missing[]` in `sync-completion.json`** says *which paths, and what was found at each* — to the
  caller that can read structure.

A caller that wants to distinguish "shortfall" from "not a fast-forward" still must not read the
exit code for it. That is unchanged, and the record is still where that answer lives.

**The record says `installed: false`, in C's vocabulary and not a new field.** `sync_launch.rs:125-128`
documents `stage: "install"` with `installed: false` as *"the data dir was PARTLY written"* — which
is exactly true. The partial write is **not** undone: the bytes that landed are correct and what
they displaced is in `attic/pre-sync-*`. The record says the SET did not arrive, not that nothing
did. New fields (`reconciled`, `reconciled_files`, `reconciled_at`, `missing[]`,
`installed_files`, `skipped_identical`, `displaced_files`) are additive; `read_completion`, `sync_launch.rs:551-566`, reads
with `serde_json::Value::get`, so a field it does not know is ignored rather than fatal.

`reconciled` is `null` — not `false` — on a `--pull` with no `--install`. Nothing was reconciled
because nothing was landed, and a reader must not be able to mistake *not asked* for *asked and
short*.

### THE COUPLING THIS CREATES, WHICH IS C's TO RULE ON — flagged, not fixed

Exit 1 changes what C's launcher does with a shortfall, from `MIGRATE` to `LOCAL HOUSE`
(`sync_launch.rs:257`, `Pull::Failed` returns before `completion` is consulted). I judge that the
better of two bad verdicts — `LOCAL HOUSE` is announced on the board, and a `MIGRATE` that wakes a
seat from a tail that is not there is silent, which is the whole failure — and it matches C's own
stated lean toward the reversible error. **But its `why` is then false:** *"The data dir was not
promoted"*, over a data dir that was 46/47 promoted with the originals in the attic.

The verdict that is actually correct there is `READ-ONLY`, and it is unreachable: nothing in the
shipped code writes `sync-promotion.open`. **This is already known and I am not claiming it** — B
reported it at `exo_memory/loop/desktop_first_launch_2026-09-09.md:470-479` and `map/B.md:1660`,
including that `installTree` has no error path and throws.

**The clean fix is A's, and I did not make it.** `installTree` is the thing that half-writes, so the
journal is mine to write: touch `sync-promotion.open` before the first byte, remove it only on a
clean reconciliation. That closes the loop exactly — half-install leaves the journal, C's launcher
takes `READ-ONLY`, and the sentence is true. I left it because writing it **activates a dormant arm
of C's launcher that has never executed**, which is a cross-seat contract change and C's call to
accept, not mine to make inside a packet about naming paths. It is a separate packet and I would
take it.

---

## 4. `NOTHING_CHANGED` OVER A BEHIND REMOTE — SEPARATE PACKET. I left it.

Judged, as asked, and the answer is no, it is not the same defect.

- **The install's claim was wrong.** `installed 46 file(s) into <DATA>` is a sentence *about the
  data dir* derived from a counter that never looked at the data dir.
- **`--push`'s claim is right and narrow.** `nothing changed since <sha> — no commit made` is true.
  The hazard is a caller reading exit 0 as *"the remote has it"*, which the line does not say.
- It is already scoped in the source, deliberately, at `state-sync.js:533-536`: *"NOTHING CHANGED IS
  NOT THE SAME CLAIM AS NOTHING IS OWED… whether the remote HAS it is a question for the remote, and
  close.js asks it rather than inferring it from this line."* `close.js` does ask it (`ls-remote`,
  compared to HEAD) and refuses on the mismatch — and that path is guarded by
  `close.mutants.js` (*"the remote's own answer is not compared to HEAD"*).
- Fixing it inside `--push` means adding a network consult to a path documented as never consulting
  the remote. That is a design change with its own argument, not a bug fix riding along.

**And the delegation is partial, which is why this is a packet and not a shrug.** `close.js` covers
the caller that goes through `close.js` — a command the keeper types. Anything invoking `--push`
directly still exits 0 over a remote that is behind, and gets no signal at all. So the librarian's
"live exit-0 hole" is live: the gate exists, and it is not on the path.

That makes the real question *where the gate lives* — inside `--push` (network on a path documented
as networkless), or by making `close.js` the only sanctioned publisher and saying so somewhere a
caller will hit. That is a design ruling with two defensible answers, which is exactly what a packet
is for and exactly what I should not decide inside this one. **Named, and left.**

---

## 5. WOULD THIS HAVE CAUGHT IT? No — and the reason is structural, not a race

Three timestamps, each with what produces it:

| when | what | source |
|---|---|---|
| `14:59:05.515Z` | `installTree` began (the attic stamp is minted at its top) | `ls /c/Consonance/data/attic/` → `pre-sync-2026-09-09T14-59-05-515Z` |
| `14:59:06` (that second) | `retire pane=0c0c0c0b… -> ARCHIVED` | `data/persist.log`, unix `1788965946` |
| `14:59:06.172Z` | `writeCompletion` — the end of `cmdPull` | `cat /c/Consonance/data/sync-completion.json` → `"at"` |

`persist.log` is second-granularity, so those three timestamps alone would leave the ordering open.
**Its own line order closes it** — `grep -n "1788965944\|1788965946" /c/Consonance/data/persist.log`:

    307  1788965944 SYNC AT LAUNCH — the record's head is not this machine's; installing
    308  1788965946 SYNC AT LAUNCH MIGRATE — … retiring them and waking each seat from the synced tail.
    309  1788965946 retire pane=1582ff09-… -> ARCHIVED (had history)
    310  1788965946 retire pane=18916fe2-… -> ARCHIVED (had history)
    311  1788965946 retire pane=8a574b7a-… -> ARCHIVED (had history)
    312  1788965946 retire pane=0c0c0c0b-… -> ARCHIVED (had history)

Line 308 is `plog` at `main.rs:9516`, which runs **after `sync_at_launch()` has returned** — and
`sync_at_launch()` does not return until the pull subprocess has exited. Every retire, including
`0c0c0c0b` at line 312, is logged after it. (Three of the four are the migrate's own — the seam row
says *"RETIRED 3 transcript(s)"* — and the fourth, `0c0c0c0b`, is the one with no `MIGRATE TAIL`
row, which is the librarian's finding.)

The call graph says the same thing from the other side:

    main.rs:9515   let (launch_verdict, retired) = sync_at_launch();
    main.rs:9090     plog("SYNC AT LAUNCH — … installing");
    main.rs:9091     pull = run_state_pull(p, true);        // BLOCKS until state-sync EXITS
    main.rs:9092     completion = read_completion(&data);
    …
    main.rs:9552   gc_captures();                           // the retire happens HERE

`run_state_pull` is synchronous — the launcher's whole two-phase design depends on it, since phase
two reads the completion record phase one wrote. **`gc_captures()` therefore cannot run until
`state-sync` has already exited.** The reconciliation would have read a data dir that still held all
47 files, printed `RECONCILED — 47 of 47`, and exited 0. There is no window in which it wins, and
making it faster or slower changes nothing.

I am not going to dress that up. **A reading taken inside a process cannot cover what happens after
that process ends.** Only two kinds of thing can:

1. a check **at the point of use** — which is C's `append_synced_tail` (`main.rs:9127`) returning
   silently on a missing file, one branch above its own POINTER-ONLY arm. The librarian found that
   and it is the real catch;
2. a **journal** that survives the process — §3. Which is why I raised it there and why I think it
   is worth a packet.

C has already fixed the cause itself: `main.rs:869-873` now inserts `LIBRARIAN_SID` into the
keep-set, with a regression test named in the comment.

What the change *does* deliver on that morning: `46` resolves to `46 written + 1 identical = 47
reconciled`, and the investigation starts from *"the install landed everything; something took one
away afterwards"* instead of from a count that pointed the wrong way.

---

## 6. RED FIRST, AND THE MUTATION NUMBERS

Baseline before any edit — `node consonance/tools/state-sync.test.js`:

    state-sync.test.js: 44 passed, 0 failed

Tests written first, run against the unchanged tool:

    state-sync.test.js: 44 passed, 10 failed

— the 10 new ones, and no regression in the 44. Then the implementation:

    state-sync.test.js: 54 passed, 0 failed

### Mutation — `node consonance/tools/state-sync.mutants.js`

    state-sync.mutants.js: 32 killed, 0 survived, 32 total

**applied 32 / caught 32 / NOT APPLIED 0.** The 21 mutants this file already carried, plus the 11
added for the reconciliation, every one of which went red:

| mutant | the defect it is |
|---|---|
| the reconciliation is not run at all — the install's own count stands as the claim | **the whole packet**: `rec` replaced by `{ok: wrote + skipped === claimed}` |
| a shortfall prints loudly and exits 0 anyway | the option §3 refused, as an executable assertion |
| the reconciliation always says ok | `ok: missing.length === 0` → `ok: true` |
| `present` is taken from the claim rather than from what was read | the count that names nothing, rebuilt |
| a truncated file at the destination is accepted | `SIZE` guard off |
| right-length-wrong-bytes at the destination is accepted | `CONTENT` guard off |
| a directory standing where a file should be is accepted | `isFile()` guard off |
| already-identical files are not counted, so `installed N` stays unreadable | `skipped++` removed |
| the record carries the shortfall but not the paths | `missing: rec.missing` → `missing: []` |
| the shortfall reason names no path | `why` keeps the count, drops the paths |
| the report prints the kind but not the path — 46 all over again | `${m.path}` dropped from the block |

Verified clean afterwards: lock released, `grep -c "if (false)" state-sync.js` → `0`, an independent
read-only re-run of the harness's own tripwire → `32 mutants checked; 0 present in the source`, and
`node consonance/tools/state-sync.test.js` → `54 passed, 0 failed`.

**The two race tests, repeated.** `for i in 1 2 3; do node consonance/tools/state-sync.test.js; done`
→ `54 passed, 0 failed` three times, plus the two green runs either side of the mutation pass. Five
clean runs. Not proof against flake (§8.4), but it is the number rather than a shrug.

**A NOT-APPLIED mutant proves nothing** and is reported here as proving nothing: it means the anchor
string is no longer in the source, so the harness silently measured an unmutated file and the suite's
green tells you nothing about that behaviour. The harness already treats it as a survivor rather than
a kill, which is the only honest accounting.

### A FIELD NOTE ON THE HARNESS, since it happened to me during this packet

The pass takes ~15 minutes (32 mutants × a suite that now builds ~54 git fixtures). While it ran I
convinced myself it had died — my wait loop used `kill -0 <pid>` from Git Bash against a native
Windows pid, which fails whether or not the process is alive, so the loop returned instantly. I then
read a **live, mid-run mutation** (`if (!rec.ok) {` → `if (false) {`) as damage left by a crash, and
went to "repair" it by hand.

**The lock did not stop that, and could not have** — it guards against a second *harness*, and I was
not a second harness. What stopped it was the editor refusing to write a file that had changed since
I read it. That is luck standing in for a guard.

So, recorded rather than tidied away: the documented hazard is a second run reading a mutated source
as `original`; the undocumented one, one file over, is **anything else editing the source mid-pass**
— and the tell is identical, because a mid-run source is *supposed* to look mutated. Waiting on the
LOCK FILE's disappearance is the reliable signal, since `unlock()` sits in the same `finally` as
`restore()`. I did not change `state-sync.mutants.js` beyond adding mutants; that is a note for
whoever owns the instrument next.

All 11 new anchors were checked for **uniqueness** before being added — `.replace(from, to)` takes
the first occurrence, and three of the obvious anchors (`if (got !== f.sha256) {`,
`if (st.size !== f.bytes) {`) already exist in `verifyTree`, so a naive mutant would have silently
re-mutated the *old* function and reported a kill for the wrong code. The reconciliation's guards are
anchored on multi-line strings that include their own `kind:` line.

---

## 7. HOW I GOT COVERAGE WITHOUT TOUCHING THE LIVE DATA DIR

**`--install` and `--push` were never run against `C:\Consonance\data` or `C:\Consonance\state`.**

Every test builds its own world in `os.tmpdir()`: its own data dir, its own manifest, its own bare
`git init --bare` remote and two clones standing in for L and D (`world()` / `twoMachines()` /
`runD()`, already in the suite). `CONSONANCE_DATA`, `CONSONANCE_STATE` and `STATE_MANIFEST` are set
per-run, so the tool cannot resolve the live corpus even by accident. Same law the file already
states in its own header.

**The shortfall path needed a second process, and that is not a testing convenience — it is the
finding.** `installTree` converges: every index file is either written or skipped-as-identical, so a
run that does not throw always ends with the whole set on disk. **A shortfall is therefore
unreachable by `state-sync` alone.** It takes another actor on the machine — which is exactly what
`gc_captures()` was. So the end-to-end shortfall tests spawn a real second process that unlinks the
target in a tight loop while `--pull --install` runs. That is `gc_captures`, in one line, in a
fixture. The suite already uses this instrument for the torn-read race, so it is in-idiom.

Read-only touches of the live machine, all of them non-mutating: `sha256sum` on two capture files,
`cat sync-completion.json`, `ls attic/`, `tail sync-pull.log`, `git log`/`git show --stat` in the
record repo.

---

## 8. WHAT I DID NOT VERIFY

1. **That the reconciliation runs correctly against the live 47-file / 58 MB set.** It has never
   executed on a real corpus. The packet forbade `--install` here and I did not look for a way
   around that. Every number above is from fixtures of 1–3 files.
2. **That exit 1 produces the verdict I predict in C's launcher.** I read `decide()` and traced
   `Pull::Failed → LOCAL HOUSE`; I did not build the Rust, run its tests, or execute a launch. The
   coupling in §3 is a reading of C's source, not a measurement.
3. **Which of the four retires is `gc_captures`'s** (§5). The ordering that matters — every retire
   is logged after `sync_at_launch()` returned — is read directly off `persist.log`. But that three
   of the four belong to the migrate and the fourth to the sweep is the librarian's attribution
   (no `MIGRATE TAIL` row for `0c0c0c0b`), which I cite rather than re-derive. I did not instrument
   a launch.
4. **Whether the two shortfall tests are timing-robust on a loaded machine.** They are races by
   necessity (§7). Five clean full-suite runs on an idle desktop is what I have; I did not run them
   under load, on the laptop, or a hundred times. A race that passes five times is not a race that
   cannot fail. If one ever does go red spuriously it will do so as a *missed* shortfall — the
   deleter losing to the install — which reads as a false failure, not a false green.
5. **`--verify`, `--push`, `--status` end to end on the live tree** after the edit. The suite covers
   them; I did not re-run them against `C:\Consonance\state`.
6. **Whether any other caller parses `sync-pull.log`'s text.** I changed the `installed …` line by
   adding `; N already identical;`. I grepped for `sync-completion` consumers and found
   `sync_launch.rs`, which reads the JSON, not the log — but I did not audit every reader of the
   log's *prose*.

---

## 9. TWO THINGS FOR OTHER SEATS

**To C — a wrong hash in a `main.rs` comment.** `main.rs:864` says the archived file *"hashes to
`a10d1d0e`"*. It does not; it is `8184ad81…`, matching the state tree's live blob — which is what the
librarian recorded (`exo_memory/librarian/2026-09-09.desktop.md`, THE FINDING). The comment's
*conclusion* is right and now doubly confirmed; only the digest is wrong. `main.rs` is yours, so I
did not touch it.

**To the chair — the follow-up packet I would take.** §3: `state-sync` writes `sync-promotion.open`
around `installTree` and removes it only on a clean reconciliation, which makes C's `READ-ONLY` arm
reachable for the first time and makes `LOCAL HOUSE`'s sentence true. It needs C's agreement,
because it turns on a code path that has never run anywhere.

---

## 10. THE FILES

| file | what changed |
|---|---|
| `consonance/tools/state-sync.js` | `reconcileInstall()`, `shortfallWhy()`, `reportReconcile()`; `installTree` returns `skipped`; `cmdPull` reconciles, exits 1 on a shortfall, and records the paths |
| `consonance/tools/state-sync.test.js` | +10 tests |
| `consonance/tools/state-sync.mutants.js` | +11 mutants |
