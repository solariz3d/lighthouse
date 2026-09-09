# P-ROSTER-ADVERSARIAL — D056-2, lap D056

Seat E. Read-only. Nothing rebuilt, relaunched, or killed.
**All source read via `git show HEAD:<path>` — committed blobs only, never the working tree —** so
no in-flight edit of A's or C's could enter this reasoning. Repo level with origin at `07501cc`.

Not silence. Two findings I did not expect, one of which fires the chair's falsifier in a direction
the falsifier does not cover, and one concession where I attacked the chair's side and it held.

---

## F1 — THE TRANSFORM IS ABOUT TO BECOME THE SOLE WRITER OF A FILE THAT FAILS OPEN INTO A SWEEP

This is the finding I would act on first, and it is not on any of the three named surfaces.

    git show HEAD:consonance/src-tauri/src/main.rs  (:3320-3326)

    fn read_kept() -> Vec<KeptPane> {
        fs::read_to_string(kept_path()).ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    }

`unwrap_or_default()` on a `Vec` is `vec![]`. **A `panes.json` that does not parse is byte-for-byte
indistinguishable, to every caller, from a roster of zero panes.** There is no error, no log line,
no third state.

And the consumer of that ambiguity is destructive (`:869-871`):

    fn gc_captures() {
        let mut keep = read_kept().into_iter().map(|k| k.pane).collect();
        keep.insert(MAIN_SID); keep.insert(LIBRARIAN_SID); keep.insert(THIRD_PLACE_SID);

**A malformed roster ⇒ empty keep-set ⇒ every committee pane on the machine retired in one startup
sweep.** The three fixed seats survive; nothing else does.

Why this is a D056-2 finding rather than a standing one: **A's transform becomes the new writer of
that exact file, on the arrival path, on a machine that has not yet parsed it.** And this machine
already demonstrated the failure mode today in a neighbouring file — `51ac75f`, *"BOM in
`~/.consonance.json`, `parse_config` does not strip it."* An encoding defect in a JSON file on the
arrival path is not hypothetical here; it is this morning.

Measured, so this is a risk and not a present fire:

    [IO.File]::ReadAllBytes("C:\Consonance\data\panes.json")[0..11]
      5b 0a 20 20 7b 0a 20 20 20 20 22 70      ("[\n  {\n    \"p")
      BOM_EF_BB_BF present: False

    same check, attic/pre-sync-…/panes.json  ->  5b 0a 20 20 …   no BOM

**Both rosters are clean right now.** The defect is that nothing would tell you if they were not.

**Ask of D056-1:** `read_kept()` must distinguish *absent* (fresh machine, empty is correct) from
*present-but-unparseable* (refuse; do not hand a sweep an empty keep-set). This is the same family
as the ruling's own kept-whole quote — *a comment cannot fail* — one level down: **a parse that
cannot fail reads as an empty roster.** The manifest's new fourth state is the right shape for it.

---

## F2 — THE CHAIR'S OPEN QUESTION, ANSWERED: THE FRESHNESS TEST IS ON THE WRONG FILE, AND THE LOSS MODE IS DELETION, NOT ARCHIVAL

> *what happens to a pane spawned on the DESTINATION since the last sync?*

    git show HEAD:consonance/src-tauri/src/main.rs  (:828-841)

    fn retire_capture(pane: &str) {
        let txt = capture_text_path(pane);
        let log = capture_path(pane);
        let has_history = fs::metadata(&txt).map(|m| m.len() > 200).unwrap_or(false);
        if has_history { … rename txt → archive; rename log → archive … }
        else { let _ = fs::remove_file(&txt); let _ = fs::remove_file(&log); }

**The keep/drop decision is made on `.txt` alone, and the drop deletes `.log` too.** `.log` is the
ore; `.txt` is the settled transcript. They differ by one to three orders of magnitude:

    live captures, .txt (the test) vs .log (what the test disposes of)
      0c0c0c0a    txt 4,796,051    log 469,316,156
      0c0c0c0b    txt   170,989    log   3,615,865
      6fe15f0a    txt     7,819    log   2,145,967
      a2122153    txt     7,472    log     369,601
      12fb81f6    txt     7,420    log     793,828
      0845a868    txt    15,766    log     716,618
      3d000000    txt     1,744    log      38,071

Note `unwrap_or(false)`: **a missing `.txt` also drops, and takes the `.log` with it.**

### Why this lands exactly on the destination-spawned pane

A pane spawned on the destination since the last sync is *precisely* the pane whose `.txt` is young
or not yet written. Measured window, today, this machine:

    committee panes spawned            08:59:06   (Win32_Process CreationDate, D055)
    their .txt first written  09:00:02 – 09:00:10  (Get-ChildItem captures)
      => ~56-64 s in which .log exists and .txt does not

`gc_captures` is the **startup** sweep. It runs inside that window.

### It is not theoretical — it has fired twice on this machine

    Select-String -Path C:\Consonance\data\persist.log -Pattern "dropped \(trivial\)"
      count: 2
      1788369817  retire pane=0c0c0c0b-… -> dropped (trivial)   = 2026-09-02 11:23:37
      1788513257  retire pane=0c0c0c0b-… -> dropped (trivial)   = 2026-09-04 03:14:17
    ("-> ARCHIVED" lines, all time: 24)

Both are `0c0c0c0b` — **the librarian seat**, the one the migrate installs a tail into and the sweep
then reaches two seconds later. Twice, the sweep took the drop branch rather than the archive
branch, which means the `.txt` was ≤ 200 B or absent at that instant and **the `.log` was
`remove_file`d, not moved to `archive/`.**

### This is where I disagree with the registered falsifier

> *…and that pane's tail is archived without a row naming it, replacement is lossy in practice.*

**The falsifier is too weak to catch its own failure case.** It looks for *archived-without-a-row*.
The path above is *not archived at all*, and it needs no missing row to bite — the row is dropped by
replacement, the sweep runs, and the `.txt` test disposes of the `.log`. A falsifier watching
`archive/` for an unrowed tail sees nothing, because nothing arrived in `archive/`.

Proposed replacement, which the existing instruments can already answer:

> **if a migrate lands and `persist.log` shows any `-> dropped (trivial)` for a pane that was live at
> sweep time, replacement is lossy by deletion — regardless of rows.**

**Currently not armed:** all seven live panes have `.txt` > 200 B (table above), so no pane is
exposed at this moment. This is a mechanism with a demonstrated history, not a present emergency.

---

## F3 — SURFACE 1, UNION vs REPLACEMENT: I ATTACKED THE CHAIR'S SIDE AND IT HELD ON THE FIRST SYNC

The chair asked me to attack the side with a ruling behind it. On the first sync it survives, and it
survives on measurement rather than on the ruling.

    attic/pre-sync-2026-09-09T14-59-05-515Z/panes.json  ->  5 rows, D's own
    Test-Path for each of the 5 cwds:
      sibling-906f757a True   sibling-a80a1c20 True   sibling-afa12c33 True
      sibling-eeb329ed True   sibling-181f513d True            (5 of 5 present)
    captures/archive/: all five tails present — 81.1 MB, 71.7 MB, 36.3 MB, 31.2 MB, 16.4 MB
    git grep over main.rs for a pruner of captures/archive: none found
    archive total: 247.7 MB, unbounded

**Row + cwd + tail, all three intact, with no expiry.** *Retired and revivable* is literally true,
not aspirational. The librarian's damage case does not fire on the first sync, and the chair's
`:48` reading is the correct one. That is a concession and I want it on the record as one.

### Where the chair's side is genuinely weaker, and it is not about loss

Replacement cannot distinguish **retire-by-design** from **retire-by-direction-of-sync**. On the
first sync, retirement was the keeper's requirement 1 — someone decided it. On the Nth sync, a
destination-spawned pane retires because of which way the sync happened to run. Nobody decided that.

And ruling 1 already forbids it, in its own words:

> **The transform must not be able to drop a live pane's row.**

A pane spawned on the destination since the last sync **has a live row, and replacement drops it.**
So the chair's constraint in ruling 1 and the chair's point-1 position in ruling 2 are in tension
with each other. **The resolution is not to switch to union — it is F4.**

---

## F4 — SURFACE 2, THE HOME TAG: IT IS LOAD-BEARING, NOT CHEAP INSURANCE, AND THE RESIDUAL AMBIGUITY IS EXACTLY ONE THING

The chair took `home=` as worth having *under either answer to point 1*. I think it **is** the
answer to point 1.

With a home field the rule is: **replace rows homed elsewhere, retain rows homed here.** That is a
union — but one that provably cannot double, because a row has exactly one home and only its home
machine retains it unilaterally. It gives replacement's convergence and union's non-loss at once,
and it removes the machinery the chair correctly said union would otherwise need.

So the answer to *"does it just move the ambiguity into who writes `home` and when"* is: **going
forward, no — it is decidable at mint time.** The ambiguity concentrates into exactly one place, and
it is worth naming loudly because getting it wrong reproduces the failure the chair feared:

**The backfill of rows that already exist with no `home` field.** Absent-home must **not** default
to *this machine*. If it does, D claims L's four adopted rows as `home=D`, L keeps them as `home=L`,
and the next round trip doubles the roster — precisely the doubling the chair attributes to union.
**Absent home must be a loud refusal or an explicit one-time backfill, never a default.**
`machine_bound_class_2026-08-25.md:77` gives the convention but not the backfill rule.

---

## F5 — SURFACE 3, THE SPAWN-SIDE REFUSAL: NO DEADLOCK, BUT A MANDATORY ORDER, AND SHIPPING C FIRST EMPTIES THE ROOM

Re-measured at 11:0x today, current live roster:

    foreach cwd in panes.json: Test-Path C:\Consonance\instances\<dir>
      sibling-3d57124e False   sibling-5bf9d657 False
      sibling-0845a868 False   sibling-07b8a48f False        (0 of 4 present)

**Every committee row on this machine currently has an unresolvable cwd.** Per ruling 2,
`term.js:1051` is a bare module-level `restoreKeptPanes();` — the consumer is unconditionally on the
path.

So: **if C's loud refusal is armed before A's transform lands and repairs this file, the next launch
refuses all four committee panes.**

- **Not a deadlock, and not zero panes.** The three fixed seats are never written to `panes.json`
  (`main.rs:857-868`), so MAIN / LIBRARIAN / THIRD_PLACE still spawn.
- **But zero *committee* panes — the room cannot convene.** That is a worse first impression than the
  silent rehome it replaces, and it would land on a keeper who is away.

The refusal is still the right guard; the librarian's point 3 is correct that `.or(home)` is a local
defect. The ask is only ordering: **A's transform lands and this machine's `panes.json` is repaired
before C's refusal is armed**, or C's refusal carries a one-shot path for a roster that predates the
transform. Answering *"is a guard that refuses everything better than one that silently rehomes"* —
here, on this machine, today, it would refuse **everything**, and that is not a rhetorical edge.

---

## WHAT I DID NOT VERIFY

1. **I did not read A's or C's working-tree files.** Every source quote is `git show HEAD:`.
   `git status --porcelain` showed only `lap-row.js`, `lap-row.test.js`, `mutate-lap-row.js` modified
   — none of A's or C's lap files — so for what I read, committed and working tree agree. I did not
   confirm that for files I did not read.
2. **F2's window is inferred from file mtimes, not from an observed sweep-inside-the-window.** I did
   not run a migrate and did not watch a drop happen. The two `dropped (trivial)` events are real;
   I did not confirm what the `.log` sizes were at the instant they fired.
3. **I did not check whether a `remove_file`d `.log` is recoverable** by any other mechanism.
4. **I could not inspect L.** Whether the laptop has an attic at all, and what its roster holds, is
   outside this machine. F4's backfill risk assumes L's rows also lack `home`; unverified.
5. **I did not verify what C's refusal does to module-level init** — whether it throws past
   `restoreKeptPanes()` or degrades. That is C's, in flight, and I stayed out.
6. **I did not re-derive D055's items** and did not read A's or C's hand-backs.

## ONE CORRECTION TO MY OWN PRIOR NUMBER

D055 reported the sweep's keep-set as `read_kept() ∪ {MAIN_SID}`. **It is now all three fixed seats**
— `MAIN`, `LIBRARIAN`, `THIRD_PLACE` (`main.rs:869-873`). C changed it; my D055 figure is stale and
anyone carrying it forward should drop it.

---

## SUMMARY

| # | surface | verdict |
|---|---|---|
| F1 | *(unnamed)* | **`read_kept()` fails open to `vec![]`; a malformed roster sweeps every committee pane.** The transform becomes that file's writer. A BOM broke a sibling JSON on this machine today. Both rosters clean right now. |
| F2 | the open question | **Answered, and worse than registered.** `retire_capture` tests `.txt > 200` and the drop deletes `.log`. Fires on young panes = destination-spawned panes. **Has executed twice** (librarian, 09-02 and 09-04). The chair's falsifier watches `archive/` and would not see it. |
| F3 | union vs replacement | **Chair holds on the first sync** — 5 of 5 rows, 5 of 5 cwds, 5 of 5 tails, no pruner. Weak only in that replacement cannot tell retire-by-design from retire-by-direction, which ruling 1 already forbids. |
| F4 | the home tag | **Load-bearing — it answers point 1**, not merely insurance. Residual ambiguity is exactly one thing: absent-home must never default to *this machine*, or the roster doubles. |
| F5 | spawn-side refusal | **No deadlock; mandatory ordering.** 0 of 4 committee cwds resolve today, so C-before-A refuses every committee pane. Fixed seats still spawn. |

Silence was available and I am not using it. The two I would not have found by looking where I was
pointed are F1 and F2, and F2 is the one I would fix before Sunday.
