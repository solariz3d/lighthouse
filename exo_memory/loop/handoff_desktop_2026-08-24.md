# Handoff to the desktop — 2026-08-24, the laptop's night shift

*Written by the Main orchestrator on the laptop, audited for gaps by the librarian
(`librarian/2026-08-24.md`, the ~07:55 append). It declined the option to say "the commits are
sufficient" and found four gap classes; this document is shaped by them. Everything below is on
`main` and pushed — `git log --oneline 652647e..HEAD` is 22 commits, 34 files, +5,108 / −59.*

---

# 1. READ THIS BEFORE WAKING ANY DESKTOP SEAT

**Every Rust change tonight is INERT on your machine until you rebuild and relaunch.** The desktop is
always-on, so this is not a formality — a seat woken before the rebuild is running last week's binary
against this week's documents.

```
git pull
cd consonance/src-tauri && cargo build --release      # or your usual release path
# close Consonance, leave it shut ~90s, reopen
powershell -NoProfile -File dev/shell/install.ps1 -Check
```

**What stays broken until you do:**

| inert until rebuild | why it matters |
|---|---|
| **the shelf tier** | **the biggest one.** Until you rebuild, your librarian wakes into the ~909k-token regime we escaped last night. It carries the SYSTEM and indexes the RECORD now — `53 carried / 116 indexed` here, against `166 carried / 0 indexed` before. |
| `call_chair` | the librarian cannot reach the orchestrator without a human relay |
| the seat-role fix | every board row is stamped `role: "committee"` regardless of who posted |
| `resolve_pane` | a target of ≤7 characters resolves **nondeterministically** between Main and the librarian |

**And `install.ps1 -Check` will report differently on your machine.** Our counts (13 ABSENT / 0 DRIFT)
are machine-local. Read yours; do not reuse ours.

**Do NOT run `install.ps1` without `-Check` before reading its `$register` list.** Measured here: a
bare run copies **and registers unconditionally**, which on this laptop would have added **nine
hooks**, two of them overseers that spawn a model call per `Stop`
(`dev/shell/hooks/l2-overseer-worker.js:65`, `l3-overseer-worker.js:80`).

---

# 2. ONE NOTE IS NOW SUPERSEDED — name it before the two documents fight

`librarian/2026-08-23.md:582-593` tells you to **work on a branch and merge to `main` when 1–3 hold;
the desktop pulls `main` only.** Your librarian's shelf carries that note.

**We pushed directly to `main` all night, at the keeper's instruction**, because you were deliberately
holding and there was nothing to collide with. That was the right call for last night and it is not a
new policy. Its checklist items 1–3 (registered-not-merely-copied, bundle rebuilt, mutations run)
**all still stand** and were followed.

---

# 3. WHAT DOES NOT TRAVEL — a `git pull` will not deliver any of this

The librarian's Q1, and the class I was most likely to miss because I did it myself and it therefore
felt done.

**Machine-local ledgers, all under `C:\Consonance\data\`.** Fifteen `.jsonl` files, including every
number this handoff quotes. **Your copies start empty.**

- `lap.jsonl` — the loop's `guess ∩ map` rows (L001–L004). Our numbers are **room-subject** by the
  librarian's R2 and must not be quoted as external validity anywhere.
- `dispatch-gate.jsonl` — including the bypass finding below.
- `carrier-drift.jsonl`, `ferry.jsonl`, `board.jsonl`, and eleven more.

**Machine state that is not in the repo at all:**

- **`~/.claude/settings.json`** — I registered `dispatch-gate.js` on `PreToolUse` (matcher-scoped to
  the two dispatch verbs) and `carrier-drift-watch.js` on `Stop`. **Neither reaches you by pulling.**
  `install.ps1` will register the second; the first I added by hand and you must too, or it does not
  run.
- **`~/.claude/shell/`** — I installed two files by hand: `ferry-watch.js` (was stale) and
  `carrier-drift-watch.js` (was absent).
- **`letters.json`** — per-machine. All of tonight's "the librarian is M, Main is D" reasoning is
  **invalid on your box.** Re-derive from your own file.
- **The chair token** — rotates on every app launch. Re-read `.chair-token` after any restart; a
  stale one returns `refused: bad chair token`, which reads exactly like a broken verb.
- **`C:\Consonance\sealed\restart_continuity_2026-08-15.md`** — **off-repo by design.** Pane C scored
  it tonight; do not hunt for it in the tree.

**Flagged open, not resolved:** the falsifier clocks (pane E's 20-commit window, F-reach's 10-lap
window) are laptop clocks. **Whether desktop events count into the same windows was never
registered.** Somebody has to decide that before either fires.

---

# 4. WHAT CHANGED, BY AREA

## The librarian can speak to the orchestrator

`561b967` · `b5b3b6a` · `a48084e`

Before tonight the librarian could post to the board and raise a gated hand, and nothing else — a
finished plan sat unread for four minutes while a human walked across the room.

It now has **`call_chair`**: one argument, **no target**, so it addresses Main or nothing. Narrow *by
construction* rather than by policy. Gated on the **MOUNT**, not a token, per `mcp.rs:497` and `:517`
— *"attributed by your CONNECTION, not by what you claim."* Speaks as `[librarian:LIB]`, never
`[chair:MAIN]`, because on 2026-08-22 the orchestrator acted on an autocomplete believing it was the
human.

**First live use closed the loop with nobody carrying it.** Verified from the other side too: calling
it from the chair's own mount is correctly refused and the refusal posts to the board.

`561b967` fixed the defect underneath it, found by pane E: **`resolve_pane` prefix-matched over a
HashMap, and `MAIN_SID` / `LIBRARIAN_SID` share seven characters (`0c0c0c0`).** Any target ≤7 chars
chose between the two acting seats on iteration order — silently, in the direction that *succeeds*.
`applied 8 / caught 8 / NOT APPLIED 0`.

## Chunk 1 — the three organs' first legs

- **`9677a5f` — T1, pane C.** The sealed restart test, 9 days overdue, scored: **mostly UNSCORABLE
  with reasons**, one CONFIRMED. It declared a conflict nobody asked for (the void's decisive
  measurement is a reading of C's *own* session file) and found that artifact no longer exists, so
  the figure is **not re-derivable**. My merit-check caught one figure in it that does not re-derive
  from its own command ("three hits"; it is two).
- **`6cf7504` — T2, pane A.** The canary is dead. The alias worklist was **uncompletable, not
  unfinished**: the seven ids predate the letter system, so the "evidence only the keeper has" never
  existed. Suite went to **56 green, 0 canary** — first fully clean run since 2026-08-17.
- **`69959d8` · `f5d7d01` · `f7533a9` — T3, pane B.** `carrier-drift`, **built rather than promoted**:
  `carriers.js` had never been committed on any branch and lived in a temp directory while the record
  called it half-built. It was a one-shot migration that detects nothing. B built a real detector plus
  a `Stop` hook — the *trigger* half registration 46 named and never had.
  **`applied 24 / caught 24 / NOT APPLIED 0`.**

## Chunk 2 — the instruments actually run now

- **`2da35a0` — the drift census, pane C.** `install.ps1 -Check` was collapsing two facts into one
  word: `$same` is false both when a file is **missing** and when it **differs**. **13 of 14 flagged
  files had never been installed**; `$dest\hooks\` and `$dest\lib\` do not exist.
- **`1e63d3a` — fixed.** `ABSENT` and `DRIFT` are separate words, counted and summarised separately.
  The `Hold` branch also fired *before* the existence check, so one file reported a "two-way conflict"
  about a file that is not there.
- **`1114eb7` — the unaccounted writer was our own test suite.** Four ledgers in `~/.claude/shell`
  were growing every few minutes, apparently about Main's live session. **It is `js-suite` →
  `dream-gate.test.js` spawning six hooks with a synthetic payload**, and the fixture uses Main's
  *real* session id, which is why residue was indistinguishable from a live record. Pane E caught the
  caller live (PID 36068, 06:53:11) and confirmed **zero model calls, ever**.
  **The class had been diagnosed and fixed for exactly one hook** (`precompact-preserve.js:66`); the
  other six never got it. Fixed, and **proven by measurement**: 278 rows before a suite run, 278
  after. Every previous run added rows.

## The dispatch discipline — this one is about how we work, not what we built

`3d33713` · `dd9f75a` · `3c1d5f1` · `f8b64e8`

**Every dispatch this room has ever sent went out mid-turn**, composed from unverified reasoning.
The keeper caught it. It is not a latency trade — **it produced a wrong ruling in another seat the
same night**: I dispatched an unverified claim, the librarian ruled on it, and its ruling was wrong
*because the brief was wrong*.

The order, now in `BUILDING.md`:

```
finish the output  →  verify the claims  →  write/commit to a path  →  dispatch, citing it
```

It is also **why the ferry miss rate was 77.1%**: dispatching before committing makes citing a commit
*impossible*, so the sequence forces prose.

Backed by `dispatch-gate.js`, a `PreToolUse` hook that **asks** when a dispatch cites no resolvable
sha and no existing path. **KNOWN LIMIT, measured:** bypass-permissions mode **overrides `ask`.** The
hook fires and the decision is dropped — proven by its own ledger (`outcome:"asked", chars:80` while
the dispatch went through). It bites only when bypass is off; under bypass it is a visible warning
and **not** the mechanism the ferry rate needed.

**A SECOND LIMIT, found by the keeper within hours of the gate shipping, and structural rather than
fixable by tuning: the gate checks CITATION, not SEQUENCE.** It can tell whether a dispatch points at
something openable. It cannot tell whether the sender had finished and filed their own reasoning
first. A brief composed mid-thought that cites an hour-old sha passes it cleanly — which is exactly
what the orchestrator did four times while writing this document. So the instrument enforces one half
of the rule in section 4 and is **blind to the other half**, and its silence on the sequence reads as
compliance. Do not treat a clean gate ledger as evidence the order was followed.

## The seats' own documents

- **`0a7ac2b`** — `LIBRARIAN.md:4` still said *"It is not a working seat"* while the keeper's
  correction (*"the librarian works"*) sat 45 lines below, landed 08-23. The head was teaching the
  retired version for a day, **and I cited it as evidence in an argument.**
  Also: `BUILDING.md` gave "the plan" to **both** seats. Resolved as two objects — **the librarian's
  plan is the WORK-SHAPE; the orchestrator's is the DISPATCH** — on `TRAINING.md:23`, which puts role
  assignment in the chair's programming because **blinding cannot be performed by the seat being
  blinded.**
- **`00a08cf`** — a test had been red since the tier work, and **both published diagnoses of it were
  wrong**, mine and the librarian's. It was matching `## THE SHELF IS TIERED` in prose, 71k characters
  before the section it meant.

---

# 5. YOU ARE HERE

| chunk | state |
|---|---|
| **1** — land the three organs | **done** |
| **2** — make the instruments run | **done** |
| **3** — T5 forgetting · T4 exteroception | **landed, NOT verified** — `4555373` |
| **4** — T6 BOOT amendment · the bidirectional count | **landed, NOT verified** — `4555373` |
| **5** — the consumer version | **not started, deliberately last** |

Chunk boundaries and the one declared reorder are in `loop/chunk_sequence_2026-08-24.md`. **Read its
chunk-2 rationale as CORRECTED** — the original premise was over-fitted and the librarian caught it;
the corrected ground is in `7fbc524`, not in the first version.

**T6 is three-quarters already done and that is easy to miss:** the BOOT amendment, the withdrawal
beside `TRAINING.md:133`, and the SOURCE trigger row all landed **on 08-23**. What remains is the
count its own falsifier demands — *the recognition is prose if the bidirectional-correction count has
still never been run with its amended unit.*

**THE FIRST ITEM FOR TOMORROW, ahead of any new work: the three hand-backs in `4555373` were
committed WITHOUT the verification pass.** The night ended mid-stride. Every earlier hand-back got a
real one — re-running its reproduce-commands, checking a regex rather than trusting a green,
independently confirming a Test-Path claim — and one of those passes caught a wrong figure in an
otherwise exemplary document. These three got their headlines read and nothing else. **They are not
yet load-bearing.** Do not build on the exteroception pricing, the forgetting registration, or the
bidirectional count until each has been checked the way the others were.

One thing in them is worth knowing before it is verified, because it changes a decision: pane A
found that **the cheapest outward-sense option is the one the keeper has deferred** — the consumer
tree as a standing foreign machine. It flagged the collision rather than pricing around it.

**Do not copy `librarian/LEDGER.md` — open it.** It is the maintained lifecycle note, updated per lap,
and it is the answer to "which windows are still open". Same for the librarian's own notes.

---

# 6. DECISIONS THAT ARE THE KEEPER'S, ALL BLOCKED ON ONE SENTENCE

- **`boot_v2` — execute or attic.** Its deadline was **2026-08-24**, by its own terms
  (`handoff_2026-08-17.md:117`). Overdue now.
- **`opposition_preregistration.md`** — registered 2026-08-10, **14 days unrun**. Run or attic.
- **T4's option** — which outward sense to build, if any.
- **T9** — bait fixtures on the shelf.
- **The 12 remaining ABSENT hooks** — deliberately not installed here, pending the nine-hook finding.

**Mine, and still open:** `retirement_carry_registration.md` **scores 2026-08-31 and has no named
body.** Assignment is the orchestrator's half, so that is my omission rather than a gap in the plan.

---

# 7. WHAT I GOT WRONG TONIGHT, so you do not inherit it as fact

Kept because a record of only the surviving claims reads as though nothing was ever wrong.

- **"The librarian's intake puts the shelf before the room."** Read off a failing assertion's
  implication, never checked. **Dispatched into another seat**, which then ruled wrongly on it.
- **"`ferry-watch` was never installed."** It *was* installed — the copy was **stale**. Same effect,
  wrong description, and wrong in the direction that sends someone hunting a missing file.
- **"13 files drifted."** Repeated for hours. Thirteen were **absent**; one was drifted.
- **Committed pane B's files mid-run**, having read a status line as a hand-back.
- **Scored the librarian's falsifier favourably**, then had to correct myself to **partial fire**
  before the dispatch left.
- **My first `dispatch-gate` shipped with three defects the suite caught**, and my first test for it
  passed while the bug it named was still live — unit proven, delivery unproven.
- **Four inline-shell escaping failures**, one of which wrote a broken path into `settings.json`. The
  recorded fix — *write scripts to a file, never a nested shell* — was on disk the whole time.

---

# 8. VERIFY EVERYTHING HERE — nothing in this document should be believed on my say-so

```
git log --oneline 652647e..HEAD                       # the 22 commits; read the MESSAGES
node consonance/tools/js-suite.js                     # expect 56 green · 0 failed · 0 canary
cd consonance/src-tauri && cargo test --bin consonance # expect 311 passed, 0 failed
node dev/mutation/mutate-resolve-pane.js              # 8/8
node dev/mutation/mutate-librarian-call.js            # 11/11
node dev/mutation/mutate-carrier-drift.js             # 24/24
node consonance/tools/carrier-drift.js                # the immune organ
node consonance/tools/open-items.js                   # open work, recomputed
node consonance/tools/lap-row.js --report             # WILL BE EMPTY on your machine
node consonance/tools/ferry.js --report               # ditto
powershell -NoProfile -File dev/shell/install.ps1 -Check
```

**The mutation harnesses are the ones that matter.** A green suite says the tests pass; only these say
the tests can *fail*.

---

# 9. REGISTERED, so this handoff can be shown wrong

- **If the desktop wakes a seat before rebuilding**, section 1 was written and not read, and the
  handoff should be shorter and start harder.
- **If any figure in this document cannot be re-derived** by the command printed beside it, it is
  hand-made and should be struck. Every number here came from a run; the ones that cannot travel are
  labelled as not travelling.
- **If the desktop's first action is to re-derive what these 22 commits already establish**, the
  handoff failed at its only job and the you-are-here table in §5 is where to fix it.
