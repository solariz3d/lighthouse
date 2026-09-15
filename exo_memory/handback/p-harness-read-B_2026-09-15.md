# P-HARNESS · §3 BRAVO — A's port read before it lands

**B (pane `12fb81f6`), machine L, 2026-09-15 ~06:05–06:20. HEAD `2d5c066`, working tree.** Packet
`loop/packet_harness_and_lib_2026-09-15.md` §3–§4 (`1bc3299`). A's hand-back as it stood: `handback/p-harness-A_2026-09-15.md`, which
still carries five unfilled `@@…@@` placeholders (`:3, :103, :124, :142, :149`).

I read the uncommitted `close.mutants.js`, `state-sync.mutants.js`, `close.test.js`, `state-sync.test.js`, `dev/tail-carry.mutants.js`
and `.gitignore` at source. I ran what the chair allowed: `close.mutants.js --only N` and `close.test.js`. I did not touch A's state-sync
harness (pid 35356) and started no state-sync harness. **I edited nothing in the tree.** My probe hook and logs are in my scratchpad.

## 0 · THE ANSWERS

| question | answer |
|---|---|
| **F1** — git diff on a tracked source during a run | **Holds.** Measured on my own close run (78 polls, 0 dirty) and on A's finished state-sync run (7,010 polls over 2,040 s, 0 dirty). §2. |
| **F2** — a kill mid-mutant | **Holds for close, on A's evidence** (I read it, did not repeat the kill). **Not yet in evidence for state-sync:** A's `@@SYNCKILL@@` is unfilled. §3. |
| **F3** — `--only` | **Holds.** One minor gap: a repeated `--only` is silently ignored. §4. |
| **Is every load path covered by the pointer?** | **close.js: yes, every path**, including two source-text reads A's §2 does not list. **state-sync.js: yes.** **state-manifest.js: all but one**, `state-sync.js:84`'s own `require('./state-manifest.js')`, as A measured. **It costs nothing today**: all 5 manifest mutants were killed in A's finished run. It is a coverage change from the in-place harness. §1. |
| **Does A's kept behaviour hold up?** (first match for the three repeated anchors) | **Yes.** All three first matches land inside `verifyTree`, the function their labels name. It is fragile to a reordering of the file, and says so only in a count. §5. |

**Nothing here blocks landing.** §6 lists the minors.

---

## 1 · LOAD PATHS

### close.js — every path goes through `TOOL`, and the measurement agrees

At source (`close.test.js`):
- `require(TOOL)` `:42`
- the CLI, `execFileSync(process.execPath, [TOOL])` `:371`
- **two source-text reads:** `fs.readFileSync(TOOL)` at `:385` (the privacy default) and `:392` (no record-repo path)

All four use `TOOL`, so the pointer covers them. **A's §2 lists only the first two** ("require(TOOL) · spawned `node TOOL` (:357)"). The
two text reads are covered anyway, but **the instrument A used (a require/main hook) cannot see a file read**, so it would not have caught
one that bypassed `TOOL`.

**Measured with a hook that also logs reads** (`scratchpad/loadhook.js`, preloaded through `NODE_OPTIONS=--require` into every node
process of a real harness run; it inherits because the suite and `close.js` both pass `...process.env` to their children,
`close.test.js:373`, `close.js:169`):

    node consonance/tools/close.mutants.js --only 10      (harness pid 14404)
      main    COPY     2      require COPY 4      read COPY 8
      read    TRACKED  2   ← both in pid 14404, the harness itself: its read of the original (:90) and its final compare (:176)
    node consonance/tools/close.mutants.js --only 3       (harness pid 39596)
      the same shape; both TRACKED reads in pid 39596

**Zero loads of the tracked `close.js` in any suite process** across both runs, which is two suite runs each (pre-flight plus the mutant).
The 8 copy reads are 4 source reads by Node's module loader plus the 2 text tests, once per suite run.

### state-sync.js — covered

`require(TOOL)`, the spawned CLI in `run()`, and the text read at `:765` all go through `TOOL` (`state-sync.test.js:50-51`, `:765`). A's
hook count (COPY 95 main + 1 require, TRACKED 0) agrees. I did not re-measure it: that suite was A's running harness's.

### state-manifest.js — one path is not pointed, and the reason it is not is narrower than A's wording

- **A's finding stands.** `state-sync.js:84` loads `./state-manifest.js` relative to the state-sync copy, which is the tracked file. So in a
  manifest mutant every manifest load that goes through state-sync sees the original. A measured 96 such loads.
- **A says reaching it "means editing the tracked state-sync.js". Not quite.** The harness writes the state-sync copy itself
  (`state-sync.mutants.js:286`), so it could rewrite that line *in the copy* without touching a tracked file. **What actually blocks
  that is a test:** `state-sync.test.js:766` asserts the tool's source contains the literal `require('./state-manifest.js')`. A rewritten
  copy would turn every manifest mutant into a false kill by that text check. The route that keeps the text honest is the resolution hook
  A names in its §7.
- **It is a coverage change from the harness it replaces.** The in-place harness wrote the mutant into the tracked manifest
  (`HEAD:consonance/tools/state-sync.mutants.js:213`), so those 96 loads did see it. The port can only kill a manifest mutant through the two
  pointed paths.
- **Cost today: none.** A's finished run (`sync-full.harness.txt` in A's scratchpad, exit 0) killed #46–#50, all five manifest mutants.
  The risk is prospective, as A says: a future manifest guard witnessed only through state-sync reads SURVIVED. That fails loud.

---

## 2 · F1 — tracked sources never dirty during a run

- **My close run.** I polled `git hash-object consonance/tools/close.js` every 250 ms across `close.mutants.js --only 3`: **78 polls, 1 distinct
  hash, 0 dirty**. The hash was `eece6a2d…`, equal to `git rev-parse HEAD:consonance/tools/close.js`, before and after.
  *(My first watcher, on `--only 10`, never polled: I started the loop before creating its flag file. Only its before/after hashes, equal,
  count from that run.)*
- **A's state-sync run, read from its own output files:** `{"harnessPid":35356,"polls":7010,"dirtyPolls":0,"seconds":2040,
  "baselineEqualsHead":{"state-sync.js":true,"state-manifest.js":true}}`, then `harness exit 0 · watch exit 0`.
- **At source,** neither harness has a write to `SRC` or `FILES` anywhere. Copies only: `close.mutants.js:149`, `:163`;
  `state-sync.mutants.js:266`, `:286`.
- **After both runs:** `git diff --stat` on `close.js`, `state-sync.js` and `state-manifest.js` is empty, and `ls -a consonance/tools` shows 0
  copies and 0 locks.

## 3 · F2 — a kill mid-mutant

- **close — holds, on A's evidence.** A's §4 records a real `taskkill /F` of pid 26524 after one scored mutant: an empty `git diff`, a
  named copy left holding the mutant, and the next run sweeping it. **Read at source and consistent:** the lock takeover is at `:72-80` and
  the dead-pid sweep at `:82-88`, and there is no restore path left to fail. I did not repeat the kill.
- **state-sync — not in evidence.** A's `@@SYNCKILL@@` (`:124`) is still unfilled. The code has the same shape (lock `:83-91`, sweep `:93-100`),
  so it should hold the same way, but the falsifier is scored by the run, not the shape.

## 4 · F3 — `--only`

Run against the real close harness:

    --only 10          killed #10 · "1 killed, 0 survived, 0 not applied, 1 run of 10 total (--only 10)" · exit 0
    --only 3           killed #3  · "… 1 run of 10 total (--only 3)" · exit 0
    --only 0 / 11      "--only N is not a mutant; ids are 1..10." · exit 2
    --only abc         "--only needs a mutant id (a positive integer); got abc" · exit 2
    --only             "… got nothing" · exit 2
    after all of them: 0 copies, 0 lock
    close.test.js      24 passed, 0 failed   (pointer unset)

- **Only the named id runs:** `selected` filters on `id === onlyArg.only` (`close.mutants.js:145`; `state-sync.mutants.js:262`; the same in
  `tail-carry.mutants.js`).
- **A zero-applied run always says so:** NOT APPLIED prints on its own line and is counted in the summary (`close.mutants.js:156-160`,
  `:182`). A's replica run shows it under `--only`.
- **Minor, not an F3 break:** `--only 3 --only 4` exits 0 having run #3 only, and says nothing about the 4. `parseOnly` takes the first
  `indexOf` (`close.mutants.js:57`). All three harnesses share the code. A second `--only` should refuse.
- **Minor, a wording error in A's hand-back:** §1 says an id outside 1..N "exits 2 before the lock is taken". That holds for a malformed
  value (`:63-64`). The **range** check (`:113-117`) runs after the lock is taken (`:70-80`) and after the sweep (`:82-88`); it then unlocks.
  So an out-of-range `--only`, run while another close run holds the lock, reports the live lock rather than the bad id, and it sweeps dead
  copies on the way. Harmless.

## 5 · THE KEPT BEHAVIOUR — first match for the three repeated state-sync anchors

**A's counts reproduce exactly:** `s.indexOf` loop on the exact anchor text.

| # | anchor | hits | lines | first match lies in |
|---|---|---|---|---|
| 11 verify accepts any sha256 | `if (got !== f.sha256) {` | 2 | 695, 1274 | `verifyTree` (656–722) |
| 12 verify accepts any size | `if (st.size !== f.bytes) {` | 2 | 685, 1259 | `verifyTree` |
| 13 verify treats a missing file as present | `        path: f.path, kind: 'ABSENT',` | 3 | 678, 1247, 1254 | `verifyTree` |

The other occurrences are all in `reconcileInstall` (1206–). Its guards are measured by their own multi-line anchors, #26 and #27, which
are unique. **So first match mutates the function each label names, nothing is measured twice, and keeping it preserves the in-place
harness's semantics** (HEAD `:208` `includes`, `:213` `replace`). **It holds up.**

**What keeps it from being a clean hold:**
- **It depends on file order.** Move `reconcileInstall` above `verifyTree` and #11–#13 would silently start mutating the reconciliation. The
  run would still report "killed", with only the `(first of N matches)` count as a hint.
- The cheap hardening is to print the matched line number, or to assert that the first match falls inside a named function. Un-sharing the
  anchors would change a list A deliberately kept byte-identical to HEAD, so it belongs to a later lap.
- **The byte-identical claim itself reproduces:** the `const MUTANTS = [` … `];` slice hashes the same in the tree and at HEAD for all three
  harnesses (`close` `bb6b59d2…`, `state-sync` `486da939…`, `tail-carry` `7504cc7d…`, sha256 prefix).
- **Function replacement:** HEAD used `replace(from, to)` with a string. No replacement in any list contains `$&`, `` $` ``, `$'` or `$n`
  (grep over the HEAD slice), so the switch changes no result today.

## 6 · MINORS, none blocking

1. A repeated `--only` is silently ignored (§4).
2. The range check runs after the lock and the sweep, against A's wording (§4).
3. A's §2 omits close.test.js's two source-text reads of `TOOL` (§1). Covered, but invisible to the hook A used.
4. First match is order-dependent, and the output gives only a count (§5).
5. A's hand-back is unfinished: 5 placeholders, including the state-sync F2 kill and `--only` results and the js-suite count.

## 7 · NOT VERIFIED

- **No kill run by me** on either harness. The F2 evidence for close is A's; for state-sync there is none yet.
- **No state-sync suite or harness run by me.** Its load-path figures and its 50/50 are A's, read from A's output files.
- **Which test kills each manifest mutant.** "Killed" is A's count; that the kills come through the direct `classErrorsFor` tests A cites,
  and not an incidental failure, I did not isolate.
- **`gen-consumer.js` and `portable-paths.js` meeting a live copy**, as A names in its §7. Not run.
- Nothing on D.

## 8 · WRONG — mine

**My first F1 watcher did not watch.** I started the polling loop before creating the flag file it tested, so it exited at once, and I
nearly counted "0 dirty" from a watcher that took 0 polls. I caught it from the missing polls file and re-ran with the flag in place first
(§2). **Class: a monitor that reports clean because it never looked.** It is the same shape as the checks this lap exists to remove.
