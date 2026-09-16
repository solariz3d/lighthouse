# P-CARRY-EXCLUDE + PRUNE · CHARLIE — chunk 2 of the cleanup, lap D067

Machine **D** (DESKTOP-EEGVFMT), seat C (Around), 2026-09-16 ~11:25–12:05.
Packet: its row in `exo_memory/loop/plan_cleanup_chunks_2026-09-16.md` (read at source, HEAD `f7648ea`).

**Files edited: `dev/tail-carry.js` (+324 / −2) and `dev/tail-carry.test.js` (+393). Nothing else.**
The two deleted lines are `main()`'s option defaults and its `--help` string, each replaced by an extended
version (`git diff -U0 -- dev/tail-carry.js | grep '^-[^-]'`). Nothing committed.

**Nothing was deleted from the stick.** Proof in §5.

    dev/tail-carry.js       sha256 68833c6df8b14d7a7269c1cf8d11a4682460c4c45e7aba0330c3a0dbc4823784
    dev/tail-carry.test.js  sha256 913c6fa6455531a02ad0c1bdb5c2a1ab2ebb3be479deae3758ff47336c0e4dae

---

## 0 · THE ANSWER, AND FOUR THINGS THE PACKET HAD WRONG

**Both doors are built, tested red-first, and pass 20 of 20 mutants. Against the real stick, read-only:**

    node dev/tail-carry.js --carry-dir D:/consonance-L-20260911/files/repo-carry/E-scratch-leave-2026-09-14 --to <scratch>
      carries 46 file(s), 88217 bytes
      excluded 653 entries, 311754634 bytes
        EXCLUDED  target/  653 entries, 311754634 bytes — holds a CACHEDIR.TAG with the cache-directory signature

    node dev/tail-carry.js --stick D:/consonance-L-20260911 --prune-below-agreed
      81 tail(s) below the agreed offset and held here, 559094957 bytes
      KEPT  0c0c0c0a-….286176484-296618163.tail.writing-27852 — a torn or in-progress write …
      KEPT  ledger.json — the ledger itself
      KEPT  ledger.json.corrupt-20260915T084005 — not a tail file
      listing digest d34bd0aac05725db

**The four premises, corrected from disk:**

1. **There was no scratch-leave carry to add a rule to.** Nothing in `dev/tail-carry.js`, or anywhere in
   the repo, carried a directory. `files/repo-carry/README-2026-09-14-2336.txt` says the scratch folder
   was *"written on D at 23:36 by the librarian at the keeper's word"* — a hand copy. **So bar item 1
   could not be met as a rule alone. I built the carry the rule lives in, `--carry-dir`.** That is more
   than "exclude by rule" literally asks for, and I am naming it as scope rather than letting it pass as
   the minimum. The rule only helps if the next scratch carry goes through this door instead of by hand.
2. **"408 MB" and "312 MB" are both right; they measure different things.** Apparent size
   `du -sb` → **311,754,634 B**. Allocated `du -sk` → **417,536 KiB ≈ 408 MiB**. The stick is exFAT with
   **262,144-byte clusters** (`Get-Volume -DriveLetter D`), so 529 small files each round up. **The
   printed line uses apparent bytes, so it will read ~312 MB where the plan said 408** — a reader
   comparing the two should not conclude the tool is wrong.
3. **The tail counts have moved.** The plan said 09-12 ×7, 09-14 ×32, 09-15 ×28 (67). On disk now:
   **81 tails, every one below agreed, 559,094,957 B**; by UTC mtime 09-12 ×7 · 09-14 ×14 · 09-15 ×39 ·
   09-16 ×21. The 21 dated 09-16 came after this morning's 08:52 carry. I did not reconcile the plan's
   09-14/09-15 split; UTC-versus-local dating is the likely cause and I did not prove it.
4. **This is not a space problem.** The stick is **268,429,950,976 B with 267,004,411,904 free — 0.5%
   used.** The 312 MB of `target/` and the 559 MB of spent tails cost copy time and write traffic on a
   drive that has faulted twice in two days; they do not threaten capacity. That matters for §6.

---

## 1 · BAR ITEM 1 — THE EXCLUSION RULE, AND THE LINE THAT MAKES IT VISIBLE

`--carry-dir <dir> --to <destination> [--apply] [--json]`. **Rehearsal by default**, matching this file's
existing convention that nothing is written without `--apply`.

**The line**, printed on its own, always — including at zero:

    excluded N entries, M bytes

`entries` counts the excluded root and everything beneath it (files and directories); `bytes` is apparent
size. Each excluded root then gets its own line with its reason, and each *suspect* (§2) gets one too. A
count alone would let a false exclusion pass silently; the named root is what makes it checkable.

**With `--apply`:** refuses if the destination exists (never writes into anything already there), copies
with `fs.cpSync` filtered on the excluded roots, then reads **every carried file back** by size and sha256
and re-plans the destination to catch anything written that was not planned. Any mismatch is `FAILED`,
exit 1.

---

## 2 · THE NAMED RISK — HOW THE RULE TELLS A BUILD DIRECTORY FROM A FOLDER THAT SHARES ITS NAME

**It never uses the name to exclude. Exclusion is by signature; the name is used only to raise a flag.**

- **A directory is excluded if it holds a `CACHEDIR.TAG` whose first 43 octets are exactly
  `Signature: 8a477f597d28d172789f06886806bc55`.** That is the Cache Directory Tagging Specification
  (bford.info/cachedir, read this lap): *"the first 43 octets of this file must consist of the following
  ASCII header string"*, *"there can be no whitespace or other characters in the file before the 'S'"*,
  the directory's name is not part of it, and archivers are expected to skip the whole tree —
  `tar --exclude-caches` is the prior art. **Cargo writes one into every `target/`:** the carried one reads
  *"This file is a cache directory tag created by cargo."* A leading space, or one octet short, does not
  exclude (tested).
- **`node_modules` is excluded only if it holds a package manager's own marker.** npm v7+ writes the hidden
  lockfile `node_modules/.package-lock.json` (npm docs, read this lap). I also accept pnpm's `.modules.yaml`
  and yarn's `.yarn-integrity` / `.yarn-state.yml` — **those three are NOT checked against their docs.**
  I added them because a missing marker only means junk rides, never that work is lost.
- **A folder merely called `target` or `node_modules` is CARRIED and printed as a SUSPECT:**
  `SUSPECT  target/  named target but carries no signature — CARRIED; check it is not a build directory`

**What that costs, in both directions:**

| case | result | cost |
|---|---|---|
| real work in a folder named `target`, no tag | carried, flagged | none — the flag is noise |
| a Cargo `target/` that lost its `CACHEDIR.TAG` | **carried** | junk rides; nothing lost |
| `node_modules` from yarn classic / old npm with no marker | **carried**, flagged | junk rides |
| **real work someone put a `CACHEDIR.TAG` into** | **excluded** | **the work does not travel.** It stays on the source (an exclusion is never a deletion) and its path and reason are printed |

**The rule cannot tell intent**, only what the directory declares about itself. The one way it loses work
from a carry is a directory that declares itself a cache and is not. I think that is the right side of the
trade, and it is a real cost.

**Not handled, stated:** a symbolic link is carried as the link and never followed (`fs.cpSync`'s default).
**Untested**, because creating symlinks on Windows needs privilege the fixture cannot assume.

---

## 3 · BAR ITEM 2 — THE PRUNE DOOR, WHICH LISTS FIRST AND DELETES ONLY ON A SECOND, SEPARATE FLAG

    node dev/tail-carry.js --stick <path> --prune-below-agreed                              # lists. deletes nothing.
    node dev/tail-carry.js --stick <path> --prune-below-agreed --delete-listed <digest>     # deletes exactly that listing

**Why a tail below agreed is spent.** A tail `<sid>.<from>-<to>.tail` whose `to` is at or below
`ledger.seats[sid].agreed.offset` holds bytes both machines already agree on, and import reads only
`pending.tailFile` (`dev/tail-carry.js:816`, before this lap's splice), so it is never read again.

**Why it is still a door with layers, not a one-liner.** This stick's ledger has been corrupt once —
`ledger.json.corrupt-20260915T084005` is sitting beside it — and a wrong agreed offset would make a tail
that is the ONLY copy of some bytes look spent. A tail is a **candidate** only if **all** of these hold, and
everything that is not a candidate is **listed with its reason**:

1. **Its name is exactly `<sid>.<from>-<to>.tail`.** Torn `.writing-*` files, the ledger, its lock and any
   `.corrupt-*` copy are never judged by this rule.
2. **The ledger has an agreed offset for the sid, and `to` is at or below it.** Straddling or above is kept.
3. **It is not the seat's pending tail**, and **not a member the transfer manifest names.**
   `writeTransferSet` names pending tails as manifest members, and `--verify-set` counts a missing member
   as a failure — so deleting one would break the stick's own integrity check.
4. **THIS MACHINE PROVES IT HOLDS THE AGREED BYTES.** Its own transcript for that sid is at least
   `agreed.offset` long, and `hashRange(transcript, 0, agreed.offset) === agreed.prefixSha`. I confirmed
   that is exactly what `prefixSha` is: the import sets it from `hashRange(row.dest, 0, size)`
   (`agreed = { offset: size, prefixSha: full, … }`). **A seat this machine cannot show is never pruned
   from this machine, whatever the ledger says.**

**And it deletes only what a person read.** The listing prints a 16-hex **digest of exactly its candidates**
(name and size). `--delete-listed <digest>` takes the ledger lock, **lists again under the lock**, and
deletes only if the fresh digest equals the one handed back. A tail that appeared, vanished or changed size
since the reading refuses the whole run (`LISTING_CHANGED`, exit 2), printing the current digest.

**The separations:**
- `--delete-listed` **alone** refuses: *"--delete-listed does nothing on its own"*.
- `--prune-below-agreed` **refuses to combine** with `--import`, `--export`, `--apply`, `--verify-set` or
  `--carry-dir`. **`--apply` is the carry's word and never deletes**, so a pasted import command cannot
  prune by accident.
- A digest that is not 16 hex refuses before anything is read, so `--delete-listed --apply` cannot slip
  a flag in as a digest.
- An unreadable ledger or manifest refuses the whole run (`CANNOT_RUN`, exit 2).
- If a deletion fails partway, it stops at once and says how many were deleted before it. **Deletion is not
  transactional**, and the result says so rather than implying otherwise.

---

## 4 · TESTS AND MUTANTS

### 4.1 · Red first

    node dev/tail-carry.test.js     before this lap:            129 passed, 0 failed
                                    22 tests added, no code:    129 passed, 22 failed   (all "T.planDirCarry is not a function" and kin)
                                    code added:                 151 passed, 0 failed

**One of the 22 was green before any code existed, and it was green for the wrong reason.** *"--apply refuses
when the destination already exists"* passed because `run()` refused on **"no stick named"** — an unrelated
refusal that happened to satisfy the assertions. I tightened it to require the refusal **name the
destination** (`/already exists/`) before writing the implementation; it then went red for the right reason.
**A test that passes before the code exists is not a red-first test, and I nearly counted it as one.**

### 4.2 · Mutants on a copy — run 1

`<scratchpad>/carry/mutants-d067.js`: 20 mutants, each written into `dev/.tail-carry.d067-mutant-<pid>.js`
(the suite's `TAIL_CARRY_UNDER_TEST` seam requires the copy to sit beside the real file), the **unmodified**
suite pointed at it, the copy dropped. Every anchor validated to occur exactly once before any run. The
tracked file is hashed before and after.

    20 mutants: 14 caught, 6 survived, 0 not applied
    tracked tail-carry.js sha256 before 68833c6df8b1 after 68833c6df8b1 — unchanged
    copy left behind: false                                                          (13 m 51 s)

**The six survivors, and what each one meant:**

| # | mutant | what surviving meant |
|---|---|---|
| 5 | the line printed only when something was excluded | my zero-case test checked the plan's `line` value, not that the command **printed** it |
| **9** | **a tail above agreed judged below it** | **the dangerous one.** A non-pending tail above agreed would fall through to the local-proof check, which this machine passes, and **be deleted while holding bytes nobody has agreed on.** Every above-agreed tail in my tests was also *pending*, so check 3 caught it first |
| 10 | the pending tail not protected by name | redundant with #9 under today's writers (§4.4) |
| 14 | a transcript shorter than agreed not refused by size | `hashRange` **throws** past EOF (`short read at …`), so without this guard one short transcript makes the **whole listing refuse** rather than keeping that seat's tails |
| 17 | `--delete-listed` alone not refused by its own rule | it still fell through to "say which direction" — refused, for the wrong reason |
| 20 | the digest ignores size | a tail replaced by a different-sized file under the same name would match the old digest and be deleted |

### 4.3 · Six tests added for them, then run 2

    node dev/tail-carry.test.js                      157 passed, 0 failed
    ONLY=5,9,10,14,17,20 node mutants-d067.js         6 caught, 0 survived, 0 not applied
                                                      tracked sha256 unchanged, copy left behind: false

**Across both runs: 20 of 20 caught.** Each added test names in its title the mutant that produced it.

**#9's fixture is a real, reachable state**, not a constructed one: the same machine exporting twice before
the other imports. I confirmed at source that export refuses only when the pending tail came from the
**other** machine (`if (entry && entry.pending && entry.pending.from !== machine)`), so a second export from
the same machine replaces `pending` and orphans the first tail file above agreed, un-pending. The test builds
it through the real export and asserts both premises before judging the prune.

### 4.4 · A correction to my own reasoning, made before it reached a test title

I first justified #10's test with *"a FULL carry of a shorter, different conversation leaves a pending tail
below agreed."* **That is not reachable through today's export**: export writes `offset: 0` only when there
is no agreed state (`if (!entry || !entry.agreed)`), and a different conversation is **refused**
(`OTHER_CONVERSATION`). So under the current writers the pending check is **redundant with the above-agreed
check**. It still defends against a ledger no current writer produces but a **hand-repaired or corrupt** one
can — and this stick has a `.corrupt-` copy on it. The test's title says exactly that.

### 4.5 · The repo's own mutant harness still validates

    node dev/tail-carry.mutants.js --only 1
      killed  #1 THE SPEC AS WRITTEN: the import gate accepts a destination that has moved (size >= offset)
      tail-carry.mutants.js: 1 killed, 0 survived, 0 not applied, 1 run of 90 total (--only 1)

That harness refuses to run at all if any of its 90 anchors no longer matches exactly once, so this run
also shows **my splice orphaned none of them.** I did not run all 90.

---

## 5 · BAR ITEM 3 — NOTHING DELETED, AND HOW THAT IS SHOWN

- **The listing against the real stick**, with a snapshot of `consonance-tails/` (name, size, mtime of all
  84 entries) taken immediately before: **identical after.**
- **The carry rehearsal** against the real scratch folder: the destination and its parent **do not exist
  afterwards.**
- **`--delete-listed` was never run against the real stick.** Every deletion in this lap happened inside
  fixture sticks under the OS temp directory.
- **The listing is independently correct**, not just self-consistent. Before writing any code I classified
  the stick by name and ledger alone and got **81 tails, 559,094,957 B**. The tool's `DELETABLE` set equals
  that set **name for name**. Because my independent classifier never checked local proof, the match also
  means **every one of the ledger's 7 seats on D passed its prefix hash** — had any failed, the tool's set
  would have been smaller.
- **The carry's numbers are independently correct:** `find target | wc -l` → **653** (529 files + 124
  directories); `find` outside `target` → **46** files; `du -sb target` → **311,754,634**.

**For the keeper, when he has read the listing** (`<scratchpad>/carry/listing-real.txt` holds the full 89-line
output from 11:5x, covering all 84 entries):

    node dev/tail-carry.js --stick D:/consonance-L-20260911 --prune-below-agreed --delete-listed d34bd0aac05725db

**That digest is valid only while the stick is unchanged.** Any carry in either direction writes new tails
and changes it, and the command will then refuse and print the new one. That refusal is the design. Re-read
the listing and use the new digest.

---

## 6 · SHOULD THE PRUNE DOOR EXIST? — yes, narrowly, and not for the reason the packet gave

**The packet's framing was space.** On that ground it barely earns its place: the stick is 0.5% full.

**The case that holds is the alternative it replaces.** Without a door, spent tails get cleaned by hand, and
this morning's own record shows how that goes. The librarian's 08:57 audit records the keeper having to get
a bare-terminal session to rescue a carry; the stick carries a `.corrupt-` ledger copy from 09-15; and the
plan's own falsifier line exists because two faults in two days are the normal weather here. **A hand
deletion checks nothing** — not the ledger, not whether this machine holds the bytes, not whether the
manifest needs the file. The door checks all four and deletes only what was read.

**What would make it the wrong thing to have built:** if the keeper would never run it. **A door nobody walks
through protects nothing**, and I cannot tell from here whether he will. If he decides the tails can simply
stay — 559 MB on 267 GB free — that is a sound decision, and the door costs 324 lines of code that rarely runs.

---

## 7 · CORRECTIONS I MADE TO MYSELF THIS LAP

1. **The vacuous test** (§4.1) — green for an unrelated refusal; tightened before implementation.
2. **The invented scenario for #10** (§4.4) — withdrawn at source before it reached a test title.
3. **My first splice of the tests failed on shell escaping** — the backslash trap already in my memory. No
   partial write; redone from a script file with an exactly-once anchor check.
4. **Node read `/d/…` as `C:\d\…`** and one inspection threw ENOENT on a path that exists. Rerun with `D:/`.
   No wrong figure resulted, but a first read of that error would have said the manifest was missing.

---

## 8 · WHAT THIS DOES NOT ESTABLISH

- **No real carry and no real prune ran.** `--carry-dir --apply` and `--delete-listed` are proven on fixtures
  only. On the stick they were rehearsed and listed.
- **The yarn and pnpm markers are unverified** against their docs; npm's is verified.
- **Symlinks** in a carried directory are untested (§2).
- **L was not touched.** The listing is D's proof. On L the same command hashes L's transcripts, and its
  candidate set may differ if L's copy of a seat is behind — the design, not a fault.
- **Performance:** the real listing hashed ~560 MB of transcripts across 7 seats. I did not time it
  separately; it completed in the same shell call as the snapshot.
- **The plan's 09-14 / 09-15 tail split** is not reconciled (§0.3).
- **Whether a future hand copy bypasses the door** is outside what code can decide. The rule is only as good
  as the habit of using `--carry-dir`.
- **The existing 90-mutant harness was not fully run** — its anchors validated and one mutant killed (§4.5).

**Scratch record**, all under `<scratchpad>/carry/`: `tests-block.js`, `tests-block2.js`, `impl-block.js`,
`splice.js`, `splice-impl.js`, `mutants-d067.js`, `mutants-run1.txt`, `mutants-run2.txt`,
`stick-before.json`, `listing-real.txt`, `carrydir-real.txt`, and the pre-lap copies
`tail-carry.js.orig` / `tail-carry.test.js.orig`.

---

## 9 · APPENDED 12:1x — the block the chair found, and the one-line fix

**The block.** With my files in, `node dev/stick-waiter.test.js` read **73 passed, 1 failed** (74/0 before).
Reproduced at my desk before touching anything:

    FAIL SWEEP: every child_process call in the waiter, the applier and the carry passes windowsHide: true — one named exception
      stick-apply.js:171 spawn(exe, [], { cwd: path.dirname(exe), detached: true, stdio: 'ignore' })
      tail-carry.js:1303 exec(name)

The sweep (`dev/stick-waiter.test.js:318`) scans source text with `/\b(spawnSync|spawn|execFileSync|execFile|execSync|exec)\(/g`
and requires every hit to pass `windowsHide: true`, except the one named relaunch. My line
`const m = TAIL_RE.exec(name);` is a **regex exec, not a child process** — `\b` matches between `.` and `exec`,
so the pin reads it as a spawn. **A false positive, and my line was the only new one it caught:** none of my
`.test(` calls match that pattern. **I did not touch the sweep.** It is right to read text, and widening it to
admit my line would widen what it lets through.

**Checked before swapping.** `TAIL_RE` is `/^([0-9a-f-]{36})\.(\d+)-(\d+)\.tail$/` — **no flags, so no `g`**,
and `String.prototype.match` without `g` returns the same capture array as `exec`. Confirmed on real inputs
rather than asserted:

    exec  on 0845a868-….1480718-2636388.tail  -> [full, "0845a868-…", "1480718", "2636388"]
    match on the same                         -> [full, "0845a868-…", "1480718", "2636388"]
    exec / match on ledger.json               -> null / null

**The fix, one line in `dev/tail-carry.js`, anchor asserted to occur exactly once:**

    -    const m = TAIL_RE.exec(name);
    +    const m = name.match(TAIL_RE);

**Bars:**

    node dev/stick-waiter.test.js     74 passed, 0 failed
    node dev/tail-carry.test.js       157 passed, 0 failed

**And the one mutant that reads that line**, re-run against the respelled source so a green suite is not
the only evidence the regex still does its work:

    ONLY=19 node mutants-d067.js
      CAUGHT   #19  [156/1]  the tail name is matched loosely: a torn .writing- file counts as a tail
      tracked tail-carry.js sha256 before cc261a02fad1 after cc261a02fad1 — unchanged
      copy left behind: false

**`dev/tail-carry.js` sha256 is now `cc261a02fad1376e4f8f2e60d00f5e64f76e6d2e2f702c6e6ae95e3fc207099a`** —
this supersedes the `68833c6d…` in this file's header. `dev/tail-carry.test.js` is unchanged at `913c6fa6…`.

**What this does not establish.** I ran the two suites the chair named and the one affected mutant. I did not
re-run the other 19 D067 mutants, the repo's 90-mutant harness, or any other suite in `dev/`. The sweep's
`calls.length >= 8` floor still holds (it passed), but I did not count how many calls it now sees.
