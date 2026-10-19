# D418 — the fast lane: small changes on the keeper's machine in under 30 minutes (2026-10-19)

Asked by the keeper, 16:26: "we need to do a rework of what consonance has become because it shouldnt take multiple hours for a small ui refactor … take a turn to research and plan out what we can do to fix this delay but remaining optimized".

## 1. What the record says (measured today, 2026-10-19)

**The pane's own work is fast. The waiting around it is slow.**

| lap | from packet to hand-back | what the time was |
|---|---|---|
| D415 (lighthouse, delivery fix, +458 lines) | 21:34Z → 21:53Z, **19 min** | no lock contention; cargo test 3 min |
| D409 overlap (two labels moved) | 14:41Z → 17:39Z, **2 h 58 min** | core-mutation 44 min (16:54–17:38Z), 26 min waiting for it, a first run that "gave up" on the lock (`p-d409-overlap-C_2026-10-19.md` §3) |
| E's install 2 of that fix | lock taken 18:26:59Z, tests from 18:48Z, ring 19:19Z, **~1.5 h** | waited on A's timing session, then on O's suite holding the tree (`p-d414-local049-m2-E_2026-10-19.md` §1) |
| A's D407 timing table | wanted 16:28Z, ran 19:30Z, **3 h queued** | needed both slots and a quiet machine; never got them first-come (`p-d407-fix-A_2026-10-19.md`) |
| P's L2-R session | 15 min of work, **105 min queued**, killed | its test runs waited on other seats' locks (`p-d411-ponytail-proof-P_2026-10-19.md` §1) |
| B's crisp-sky run | **gave up after 60 min** with both slots held | (`p-d410-crisp-B_2026-10-19.md` §3) |

**The overhead around each hop:**

- `C:\Consonance\data\sources-gate.jsonl`, today since 06:00Z: 246 rings checked, **37 refused (15%)**. The librarian 14 of 73, the chair 11 of 109. Each refusal costs a resend turn. The ones I read today were all bookkeeping ("item not opened in an earlier message"); none caught a false claim.
- `call_chair` delivery: two rings sat unsubmitted in the keeper's box today, one for 38 min (D415 fixed this; it needs the rebuild).
- The heavy-run lock: `consonance/tools/heavy-run.js:71` `DEFAULT_SLOTS = 2`, shared by 7 seats on a 16-core, 64 GB machine. O measured 11.4 of 16 cores busy at concurrency 4 for the whole suite (`p-d412-part1-O`), so two slots leave most of the machine idle while seats queue.
- Timing sessions (A's ABAB, drag-frame) need BOTH slots and a quiet machine, so one of them blocks everyone else for 40 min, and they themselves wait hours to start.
- A pane's own brief is 98,865 B (`instances/sibling-0845a868/CLAUDE.md`). Today's hand-backs ran 3.4–65.8 KB each.
- The route for one small change: keeper → librarian (plan file) → chair → pane → librarian (check) → chair → E (merge, tests, build, install) → librarian (check) → keeper. That's **seven hops**, each waiting for the next seat to be free.

## 2. What stays (the parts that earn their cost)

- The heavy lane, as it is now, for geometry, export, core maths, data formats and releases: full suite, mutation harnesses, timing sessions, the librarian's check before landing. Those are the invisible, costly bugs (`~/.claude/CLAUDE.md`, Verification).
- Test first, in both lanes.
- The credential scan and the private-project scan on every push.
- The 0.4.9 release still gets the full suite, every harness and the quiet timing stage, once.

## 3. The plan: five parts, each with a pane

**Part 1 — the fast lane, as a rule (pane O, lighthouse briefs; works the moment it's committed, no rebuild).**

- **Scope:** UI layout, copy, colours, a look's styling, menu items; anything that doesn't touch `src/geom`, `src/export`, `app/core/coreshell.js` maths, the saved-file format, or a file whose bug would be invisible. When unsure, it's heavy.
- **Route:** keeper → librarian → chair forwards the packet unchanged, as one `chair_inject` → ONE pane → done. No plan file: the packet is the plan.
- **The pane:**
  - branches from the current `local-0.4.9` head;
  - writes the red test, makes the change;
  - runs ONLY the touched test files, plus any test that pins the moved lines (found by `git grep` of the changed lines in `app/test`);
  - for a file a mutation harness names, runs the anchor count instead of the harness (C's `SC/d409/anchors.js` made a shared tool);
  - merges into `local-0.4.9`, builds and installs to the keeper's machine itself (Part 4);
  - rings back with the hand-back IN the ring, at most 10 lines: what changed, the sha, the test counts, the installed sha256. No hand-back file, no map line, no Corrections section unless there is a correction.
- **The librarian checks AFTER the install,** not before: the diff, the test output, the installed hash. If something's wrong, the backup is one rename away, and the fix is a new fast lap.
- **The 0.4.9 release** still runs the heavy checks over everything the fast lane merged.

**Part 2 — the lock sized to the machine (pane O, `consonance/tools/heavy-run.js` and its tests; no rebuild).**

- `DEFAULT_SLOTS` 2 → **4**. That is the concurrency O's D412 measured comfortable (11.4 of 16 cores).
- **Fast-lane test runs of 3 files or fewer take no heavy lock.** The lock exists so seats don't read each other's half-written files in one checkout (`heavy-run.js:14-15`), and each fast-lane pane is in its own worktree. The only thing they could disturb is a timing session, and those move to Part 3.
- Tests first: the slot default, and the small-run exemption (a fast-lane run with 4 files takes the lock).

**Part 3 — timing sessions out of the day (rule; chair schedules).**

- Timing sessions (any run that needs both slots or a quiet machine: ABAB, drag-frame's frame-time rows, release-frame's timing rows) run only:
  - in a named window the chair opens, with every other heavy run paused, OR
  - at the release, in B's quiet stage.
- During the day, a lap that needs a timing number states its smoke figure and waits for the window. The window is booked like a meeting, not raced for.
- P's D411 measuring and reviews: in the next window, not in the day.

**Part 4 — one install tool any pane can run (pane E, the t180 repo `scripts/`; no rebuild).**

- E's `install.ps1` and stamped compare (`C:\Users\nname\Downloads\t180-d414-e\`) become `scripts/install-local.ps1` in the t180 repo:
  - checks the builder is closed and waits if it's open, never closes it;
  - backs up as `.before-<tag>`;
  - installs silently, does the stamped compare, prints the installed sha256.
- One install at a time: it takes an `install.lock` (not the heavy lock), so two fast laps can't install over each other.
- `local-0.4.9` merges are serialised by the same lock: merge, build, install, release the lock.

**Part 5 — the gates stop blocking (the keeper's call; hooks in `~/.claude/shell`, no rebuild).**

- The SOURCES gate goes from refuse to **warn and log**: the ring is delivered, and the missing items are logged to `sources-gate.jsonl` as they are now.
  - Why: 37 refusals today, every one I read was bookkeeping, and each cost a resend turn. The log keeps the instrument; only the blocking goes.
- The NEXT-trailer gate already delivers anyway (light mode). It stays as it is.
- This is the keeper's room's rule, so it waits for his word, unlike Parts 1–4, which are inside the line of work.

**Later, with the inventory rebuild (pane C, Consonance; needs the rebuild):**

- An address-table row so the librarian can hand a fast-lane packet to a pane directly. That takes the chair out of the fast lane: 3 hops instead of 4.
- D415's delivery fix, and the O/P label fix, come with the same rebuild.

## 4. The test of this plan, registered before it runs

- **Progressive:** across the next 5 fast-lane laps, the median from the keeper's ask to the change installed on his machine is **≤ 30 min**. No fast-lane change is reverted for a bug its touched tests should have caught.
- **Degenerating:** the median is over 60 min, OR 2 or more fast-lane changes break something in the keeper's hands that the old heavy checks would have caught, OR the 0.4.9 release's full suite turns up a fast-lane regression.
- **Null:** neither of the above; the keeper decides.
- The first lap to time is D417 (the button move), already in flight on the old route. Its time is the baseline.

## 5. Order

1. The keeper says go (or vetoes a part).
2. O: Parts 1 and 2 together (briefs and heavy-run.js, test first). They're small, and both are in lighthouse.
3. E: Part 4, in parallel (the t180 repo).
4. The chair: Part 3 from the moment it's agreed (it's a scheduling rule).
5. Part 5 when the keeper says so.
6. The rebuild items at inventory.

---

## AMENDMENT, 16:5x — the keeper widened it: every kind of work, with judgement, and periodic review instead of compulsive testing

The keeper, 16:49: "but not just for track builder, but any type of work. It needs to be understood with nuance what things need that extra time and what just should be good, you can do things good right away without having to test it every single time, however there are things that still need to be tested … Similar to what my friend said about doing code reviews every once and a while instead of the compulsive testing".

### What the record says about why this keeps coming back

The keeper has asked for this before, and each time the room drifted back:

- 2026-09-29 13:43: "wtf are these run locks, taking up so much time to fix something even a person could tweak in 5 mins".
- 2026-10-06, three times in one day: "what is going on taking way too long", "why did it take so long to add these simple changes", "yes lets do it, this is too slow".
- All four are in the librarian's own memory, `match-checking-to-risk.md`. **None of them reached a file the panes read.**
  - `~/.claude/CLAUDE.md` still opens "Verification and testing" with "Run the tests that cover your change before you report success", and adds tests with every new function and for every reported bug.
  - `BUILDING.md:459-461` and `COMMITTEE.md` say a pane runs the tests that cover its change, under the lock, before every hand-back.
  - On 2026-10-17 the librarian added `brief-names-the-mutation-harness.md`: any file a mutation harness names → that harness runs whole. That rule is what put the 44-minute core-mutation run on today's label fix.
- This is the room's own carrier lesson (BOOT, the 2026-08-17 amendment): **the correction lived in a downstream copy; the carriers kept teaching the old rule.** Fixing it in the librarian's memory a fifth time would fail the same way. The carriers have to change.

### The rule, for all work (T-180, Consonance, lighthouse, tools, scripts, anything new)

The question is not "is it UI?", it's **"if this is wrong, will someone see it right away, and is it cheap to undo?"**

- **Just do it.** The bug would be visible at once and is cheap to undo: layout, wording, colours, a look's styling, docs and notes, a one-off script, a config value the keeper will see the effect of.
  - Make the change well, check it loads or compiles, and ship it.
  - No new test, no test run beyond that.
  - It is covered by the periodic review (below) and by the keeper's own hands.
- **Check it.** Behaviour a person would notice, but a mistake shows itself and does no lasting harm: a new button's action, keyboard handling, a menu command, a UI flow.
  - Run the existing tests for the touched file.
  - Write a test only for a bug the keeper reported (reproduce it first), or where the behaviour can't be seen by looking.
- **Prove it.** The bug would be invisible or costly: geometry and the core maths, export to Assetto Corsa, saved-file formats and stored data, anything that deletes, pushes, installs or overwrites, credentials, the room's own delivery and gates, concurrency.
  - Test first, the mutation harnesses that name the file, the full suite at landing. As today, unchanged.
- **Who decides:** whoever hands out the work names the tier in one word in the packet. A pane may raise the tier when it finds the change touches more than expected. It never lowers it on its own.
- **When unsure, "check it",** not "prove it". The cost of a missed visible bug is a quick fix; the cost of over-testing everything is today.

### The periodic review (the friend's point)

- **A review instead of a test for every change.** Once per batch, before each release (and at least weekly when work is flowing), a reviewer reads every "just do it" and "check it" change merged since the last review: the diff, not a re-run.
  - The reviewer is pane P (Fable). That's the role the keeper opened P for.
  - It lists what it would change, ranked. Real findings become fix laps. "Looks fine" is a valid result.
- **The release still gets the full suite, every harness, and the quiet timing stage, once.** That's the net under everything the review didn't catch.

### What this changes in the plan above

- **Part 1** now covers every repo, not only T-180. The fast lane is "just do it" and "check it" work; the heavy lane is "prove it".
- **Part 2 — revised for safety.** The 2026-09-28 record: four concurrent node jobs crashed machine D (BSOD 0xD1, `match-checking-to-risk.md`). So: **keep 2 heavy slots.** Instead, runs of 3 test files or fewer take no heavy lock, and "just do it" work runs nothing heavy at all. That frees the slots without stacking more heavy runs on the machine.
- **Part 6, new — fix the carriers (keeper's files, so his yes):**
  - `~/.claude/CLAUDE.md`, "Verification and testing": replace the first rule's "in proportion to the risk" sentence with the three tiers above, and scope "Add tests with new functionality" and "reproduce it in a test first" to "check it" and "prove it" work.
  - `BUILDING.md` and `COMMITTEE.md`: the same three tiers where they say what a pane runs before handing back; the mutation-harness rule applies to "prove it" only.
  - The librarian retires `brief-names-the-mutation-harness.md` into `match-checking-to-risk.md` as "prove it" only, and that memory points at the briefs as the master.
- **Part 7, new — the periodic review (pane P).** First run: everything merged into `local-0.4.9` today that wasn't "prove it" (D409, D409's overlap fix, D405, D410/D416, D417), before B's 0.4.9 release.

### The registered test, widened

- **Progressive:** over the next 5 "just do it" or "check it" changes in any repo, the median from the ask to done is ≤ 30 min, AND the first periodic review plus the 0.4.9 full suite find no bug a skipped test would have caught that reached the keeper.
- **Degenerating:** 2 or more bugs in "just do it" or "check it" work reach the keeper that the old per-change tests would have caught, OR the median stays over 60 min.
