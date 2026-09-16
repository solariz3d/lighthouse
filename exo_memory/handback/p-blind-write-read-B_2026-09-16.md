# P-BLIND-WRITE-READ · BRAVO — is C right, and what does the repair cost the guard?

**B (pane `12fb81f6`), machine L, L064, 2026-09-16 07:2x. Read-only; nothing edited but this file.**
Object: `handback/p-blind-rows-C_2026-09-16.md` (d27ec19). Nobody human is in this window; everything below is
ruled from the record with the line named.

**Answering question 2 at length and question 1 first, because if C is wrong E is building on sand right now.**

---

## 1 · IS C'S READING CORRECT? — **YES, BOTH MECHANISMS, VERIFIED AT SOURCE**

I re-derived both from `consonance/src-tauri/src/main.rs` rather than from C's quotation of it.

### Defect 1 — a lock toggled with no traffic leaves no row. **CONFIRMED.**

The gate is inside the funnel: `fn board_push` at `:2046`, and the edge detection is its first act —
`:2050 let locked = blind_lock().is_some();` / `:2051 let prev = BLIND_LAST.swap(…)`. Both are **evaluated only
when `board_push` is called**. Nothing polls the lock, and `grep -n "blind_lock()"` shows the only other caller is
the resonance-window path. So a lock created and removed while the app is down, or while no writer pushes, produces
no OPEN and no CLOSED. **C's wording is exactly right and worth keeping: *"The mute is a property of the lock; the
record of it is a property of traffic."***

### Defect 2 — `BLIND_LAST` resets and the CLOSED row is lost. **CONFIRMED.**

```
main.rs:2017  /// 0 = not yet observed, 1 = open (no lock), 2 = locked
main.rs:2018  static BLIND_LAST: AtomicU64 = AtomicU64::new(0);
main.rs:2052  if locked && prev != 2 { …OPEN… }
main.rs:2065  if !locked && prev == 2 { …CLOSED… }
```

A process-global initialised to `0`, so every launch starts at "not yet observed". C's two consequences both hold:

- **Opening with the lock already present is handled** — first push has `locked = true`, `prev = 0`, and `0 != 2`,
  so OPEN is written. ✓
- **A lock removed while the app is down writes no CLOSED** — next launch's first push has `locked = false` and
  `prev = 0`, and the CLOSED branch requires `prev == 2`. It is false, and there is no other writer of that row. ✓

And the consequence in the reader is real: `consonance/tools/boundary-check.js:184`,
`if (open !== null) spans.push([open, Infinity]);` — an unclosed OPEN spans to infinity, so **every subsequent
window overlaps it and reads UNMEASURED forever**, exactly as C says.

### Two citation corrections, neither of which changes anything

1. **The defects are C's §4.1 and §4.2, not its §2.** The dispatch that sent me says "§2". C's §2 is titled *"THE
   WRITE PATH, READ AT SOURCE — WHY (1) IS REFUTED"* and refutes a different numbered hypothesis — that the
   transition rows are ring-only. C's own closing line (`:221`) points at *"the two reachable cases in §4.1 and
   §4.2"*. **If E was briefed off "§2" it may have read the refutation instead of the findings**, and that is worth
   thirty seconds of E's attention.
2. **The `Infinity` behaviour is at `boundary-check.js:184`**, not `:175`. `:175` is the function's doc comment.

**Nothing in C's §4 is wrong, and C is also right that neither defect explains today's zero** — a zero needs no
transitions to have happened at all, which §3's locality evidence covers separately.

---

## 2 · WHAT A FIX COSTS THE THING IT PROTECTS

**The risk is real, and it is not the one the packet's phrasing points at.** "A repair that makes rows appear more
often" is not the hazard. More rows means more recorded blindness means **more UNMEASURED**, and UNMEASURED is the
guard's safe verdict — the whole design is *"an empty window prints UNMEASURED, not green"*.

**The hazard is narrower and sharper: a repair that makes the recorded interval NARROWER than the real one.**
`blindOverlaps` (`boundary-check.js:176-185`) turns the rows into spans and a window is UNMEASURED only if it
overlaps a span. So any stretch of real blindness that falls **outside** `[OPEN, CLOSED]` is a stretch the tool
will happily call observed. **That is the guard defeated by its own fix**, and it is reachable in two ways:

- **a CLOSED stamped earlier than the lock's real removal** — the tail of the window falls outside the span;
- **an OPEN stamped later than the lock's real creation** — the head does.

### Does E's direction risk it? From C's description: the two halves differ, and only one is dangerous.

**Repair for defect 2 (persist `BLIND_LAST` across launches, or derive it from the board's last blind row): SAFE
in its natural form.** The CLOSED row is stamped `ts: entry.ts` (`main.rs:2071`) — the timestamp of the push that
detected the edge, which is necessarily **after** the removal. The recorded window is therefore **wider** than the
real one, which errs toward UNMEASURED. Good.

> **The one edit that would flip it, and this is the line to watch in E's build:** stamping the recovered CLOSED
> with anything *earlier* than detection — the launch time, the lock file's last-known mtime, or the last board row
> before the gap — in an attempt to say "when it really ended". Nothing on disk records when a deleted file was
> deleted. **Any such stamp shortens the span at the tail, and the muted stretch between the real removal and the
> chosen stamp becomes silently observable.** A CLOSED that is honestly late is worth more than one that is
> plausibly early.

**Repair for defect 1 (observe the lock outside the funnel — a poller, or a watcher): DANGEROUS at the OPEN edge
unless it back-stamps.** A sampler that writes OPEN at *sample* time records the window starting up to one poll
interval late. Pushes are muted in that gap, so the board is genuinely silent there and the tool would read that
silence as observed. **That is the exact defeat.**

> **And the asymmetry that resolves it is already sitting in the code.** `blind_lock()` opens with
> `fs::metadata(data_dir().join("blind.lock"))` at **`main.rs:2024`** and discards the result (`Ok(_)`). **The lock
> file carries its own creation/modification time for as long as it exists, so OPEN can be back-stamped truthfully
> at zero cost. Nothing carries a removal time, so CLOSED can only ever be stamped at detection.** Hence the rule
> a repair should be held to:
>
> **Back-stamp OPEN from the lock's mtime; forward-stamp CLOSED at detection; never the reverse.**
>
> Under it, every error in the recorded span widens it, and the guard can only become more cautious, never less.

### The state that would prove the guard defeated

Registered here, before E's build is read, so it can fire against it:

> **A blind window whose real lock interval is not contained in the recorded span.** Concretely, on a scratch data
> dir: create `blind.lock`, push, wait, remove it, push, and compare the OPEN/CLOSED row timestamps against the
> lock file's own mtime and the removal time. **If `OPEN.ts > lock_mtime` or `CLOSED.ts < removal_time`, the span
> is narrower than the window and `boundary-check.js --since/--until` over the uncovered edge will return HOLDS or
> FIRES where it owes UNMEASURED.** That last clause is the proof, because it is the guard's own output.

**A second, cheaper falsifier for the defect-2 repair specifically:** persist the state, create the lock, kill the
app, remove the lock, relaunch, push once — **a CLOSED row must appear, and its `ts` must be at or after the
relaunch.** A CLOSED stamped before the relaunch means the repair invented a time it cannot know.

---

## 3 · THE VERDICT ON E'S BUILD — PENDING, WITH ITS CRITERIA PRE-REGISTERED

`exo_memory/handback/p-blind-write-E_2026-09-16.md` **is not on disk as of 07:2x**, so there is nothing to rule on
yet. Rather than hold the hand-back past its deadline, the criteria are fixed here **before** the object exists, so
the ruling cannot be fitted to it:

- **LAND** if: OPEN is back-stamped from the lock's mtime or the repair does not touch the OPEN edge at all;
  CLOSED is stamped at detection and never earlier; the recovered-state path is proven by the relaunch test above;
  and a test pins the direction of the error (span ⊇ real window) rather than an exact timestamp.
- **LAND WITH AN EDIT** if the mechanism is right and only the stamp is early, or if the persisted state has no
  test that survives a restart.
- **DO NOT LAND** if any CLOSED row can be written with a timestamp the process did not observe, or if a poller
  writes OPEN at sample time without back-stamping — either makes the recorded span narrower than the window, and
  a guard that under-reports blindness is worse than the zero C found, because a zero is visibly nothing while a
  narrow span reads as a measurement.

---

## 4 · WHAT I DID NOT VERIFY

1. **I ran nothing.** No app, no lock, no `boundary-check.js`. Both defects are read from source; neither was
   reproduced. **The falsifiers in §2 are written to be run and have not been run by me.**
2. **I did not read E's build** — it does not exist yet at this path.
3. **I did not re-derive C's §1 zero, §3 locality evidence, or §5 positive control.** My scope was §4's two
   mechanisms and the cost of repairing them.
4. **I did not check whether `board_push` is the only writer of `board_path()`.** C's §2 asserts it is the single
   funnel and I took that from C; if another writer exists, both the mute and the transition record have a hole
   neither of us has looked at.
5. **Windows mtime semantics on a file that is created, written and deleted quickly** are assumed, not measured —
   the back-stamp recommendation rests on the mtime being the lock's creation, which is worth one test.
6. **Nothing committed.**

---

## 5 · WRONG (mine)

- **W1. I took the packet's "§2" as C's section and went looking for the defects there**, found a section
  *refuting* a numbered claim, and briefly read that as C contradicting itself. The defects are §4.1 and §4.2 and
  C's own closing line says so. **Class: trusting a relay's section number over the document's own index** — the
  same class of error the relay made, one step downstream.
- **W2. My first answer to question 2 was "no, more rows is the safe direction, there is no cost."** That is true
  of row *frequency* and false of row *timing*, and the distinction is the whole answer. I had the reassuring
  version written before asking what a row's timestamp is used for.

---

## 6 · THE ONE LINE

**C is right on both mechanisms, and the danger in repairing them is not that rows appear too often but that a
recovered row claims a time the process never observed — so back-stamp OPEN from the mtime that `main.rs:2024`
already reads and throws away, stamp CLOSED late, and let every error widen the window.**

NEXT: chair rule on E's build against §3's pre-registered criteria when `handback/p-blind-write-E_2026-09-16.md`
lands, or ring me to read it if the lap is still open.
