# P-SYNC-AT-LAUNCH + P-RETIRE — hand-back. Pane C, L052, 2026-09-09.

Packet: `exo_memory/loop/packet_sync_launch_retire_2026-09-09.md` (`95d55b6`).
Owned and touched: `consonance/src-tauri/src/sync_launch.rs` (new), `consonance/src-tauri/src/main.rs`,
this file, `exo_memory/map/C.md`. **Nothing committed.**

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
    → 508 passed, 0 failed, 4 ignored

Baseline before this packet was **480 passed / 0 failed / 4 ignored** (`handback/p-offsets-fix_2026-09-09.md`
§, after `3b38d3b`). **+28, all mine.** The 4 ignored are unchanged and none is new.

---

## 1 · THE RULING §8 ASKED FOR: refusing to start is REFUSED, and there is a third shape

**No state this code can reach is a lockout.** The verdicts differ in *what the house is when the
window opens*, never in whether it opens. Bad link at 08:00, half-fetch, no `node`, a killed pull —
Consonance opens every time.

The same ruling was reached independently by **E**, for the live-host guard, from a precedent
already in `main.rs`. `tools/live-host.js`, THE FAILURE DIRECTION: *"it fails toward letting the
keeper in… `claim_named_singleton` fails OPEN when it cannot tell: a launcher bug must never be
able to make the app permanently unstartable, and the cost of a second instance is recoverable
while the cost of no instance is not."* Two seats, two surfaces, one answer, neither reading the
other first. I cite it rather than re-derive it — and it is now a coupling: **if E's ruling is ever
reversed, this one has to be revisited with it.**

**Five verdicts, and only one withholds anything:**

| verdict | when | what opens |
|---|---|---|
| `Standalone` | `state-sync.js` absent | exactly today's launch, nothing changed |
| `Resume` | the record's head was authored by this machine | normal |
| `Migrate` | the head was authored elsewhere | retire + wake from the synced tails |
| `LocalHouse` | the pull failed, or verified and never installed | **this machine's own house, read-write**, and the row says so |
| `ReadOnly` | the install failed PART-WAY | window opens, **seats do not wake** |

`LocalHouse` is the third shape and it is better than read-only for the common failure: an
unarrived record leaves the local house *intact*, and starting on an intact local house is the
pre-sync world — whose divergence is an append-merge, which is what this room already lives with.
Withholding the seats there would cost the keeper his morning for a state that is not dangerous.

`ReadOnly` is reserved for the one state that is: **a half-written data dir.** A's `installTree`
copies file by file, so a failure mid-install leaves some of the record and some of this machine's,
and no seat should wake from that chimera. Even then the row names two ways forward and neither is
"wait for someone".

**Enforcement is one funnel, argued by enumeration, not assumed** — the check L051 owed and paid.
The refusal sits at the top of `spawn_claude_pane`, which all ten spawn/resume call sites pass
through and which is only ever reached from a `#[tauri::command]` (so never before `.setup()` has
decided). With no pane spawned: `start_tailer` never runs, so no offsets are written and no
transcript rows are pushed; the board-writing MCP verbs are called *by panes*, and there are none.
The only write left is the seam row, which is the message. Pinned by
`the_seat_refusal_sits_at_the_one_funnel_and_before_the_pty`.

---

## 2 · THE RETIRE RULE, and one deliberate deviation from the packet

`sync_launch::retire_plan` / `apply_retire` move each fixed-id seat's transcript aside; `Migrate`
is the only verdict that calls them. The three seats are Main, the Librarian and the Third Place —
pane transcripts are **not** in the set and must not be: their ids are random, registered in
`panes.json`, and `resume_pane` never `--resume`s at all.

**THE DEVIATION: the attic is OUTSIDE `~/.claude/projects/`, not "a projects attic".** The reason
is in this repo's own comment, in `resume_pane`: *"a leftover jsonl for this id can make the fresh
`--session-id` collide (already in use)."* A retired transcript left anywhere the vendor indexes can
therefore either still be found by `--resume` **or** block the fresh `--session-id` — and both land
as "the seat did not wake as the synced one". Moving it out of the indexed tree is what makes the
retirement real instead of a rename. It goes to
`~/.claude/consonance-attic/<encoded cwd>/<sid>.<stamp>.jsonl`; revival is one `mv` back, and the
test performs the revival rather than claiming it.

**Timestamped, and that is the second lesson from the same function.** `resume_pane` keeps a single
`<id>.jsonl.orphaned` and `remove_file`s the previous one first — **its archive is exactly one deep,
so a second retirement destroys the first.** That is a live instance of "a retired transcript that
cannot be revived is a deleted one with better manners", in the function I copied the idea from. I
did not change it (not my packet, live path); it is named in §6. Mine keeps every retirement:
`a_second_retirement_does_not_destroy_the_first`.

**A migrate wakes the seats, it does not just silence them.** After a retire the seat spawns fresh
and its window is empty, so `append_synced_tail` puts the synced capture tail into each of the
three intakes with `warm_resume_brief`'s exact restore wording (a seat meeting two framings of one
event has been told the room disagrees with itself). Without this the packet's objective would have
been met by producing three amnesiac seats — a different failure, no better.

**It deliberately does NOT use `warm_resume_brief`, and this is not a style choice.** That function
*shrinks the capture master* into the pane's attic when the tail will not fit, rewriting
`<sid>.txt`. Those tails now TRAVEL (A's manifest). Trimming one there would edit the record on this
machine and push a truncated carrier to the other — a shell budget quietly becoming a fact about the
room. The trim here is in memory only and the master is never touched. If the tail cannot ride at
all, the seat gets a pointer to the file rather than silence.

---

## 3 · THE CONTRACT WAS NOT MINE TO INVENT, AND I INVENTED IT FIRST

`state-sync.js` did not exist when I started. I wrote the reader against a contract I made up —
`{ok, commit, head_host}` — and A's tool landed mid-lap with a different and better one:
`{verified, installed, stage, why, head, pushed_by, machine, …}`.

**The failure that would have been, stated exactly, because it is the interesting part:** my reader
would have found none of its fields, defaulted every one to false, and reached a **safe verdict for
the wrong reason.** `LocalHouse` on every launch, forever, looking like caution. Nobody would have
debugged it until the day it needed to say `Migrate` and didn't. *A green light nobody can
distinguish from a working one is the thing this week keeps being about.*

A's split of `verified` from `installed` is better than my single `ok` and A says why in the source:
*"a set that verified and never reached the data dir is the quiet half-arrival this packet exists to
prevent, and a launcher that only asks 'verified?' would start on it."* This is that launcher, not
starting on it — `verified_but_never_installed_is_the_local_house_not_the_synced_one`.

**All five stages A can write are enumerated from the tool's five `writeCompletion` call sites, not
reasoned about** (`every_stage_the_tool_writes_maps_to_a_stated_verdict`): `fetch`, `fast-forward`,
`verify` → `LocalHouse`; `install` (verified, not installed) → `ReadOnly`; `done` → installed?
whose-is-it : `LocalHouse`. A sixth stage would fall to the degraded arm; that is what this test
does *not* cover.

**And one fixture is the real thing rather than my idea of it.** I ran `--pull` (phase one, which
cannot write into the data dir) and captured what came back:

    state-sync: NOT A FAST-FORWARD — this machine has state the remote does not, or the histories diverged
    {"verified": false, "installed": false, "stage": "fast-forward",
     "why": "merge: origin/main - not something we can merge", "machine": "L", ...}   exit 1

That literal is now a test (`the_first_real_completion_record_this_tool_ever_wrote_is_the_local_house`
→ `LocalHouse`, twice over: the exit code alone decides it, and the record alone decides it).

---

## 4 · TWO-PHASE PULL — the property that makes this safe to land tonight

`--install` is a **whole-file overwrite of the data dir with no recency test anywhere in it**:
`installTree` compares hashes and writes whatever differs. Reversible (A keeps every displaced file
under `attic/pre-sync-<stamp>/`, deliberately) — but reversible is not the same as safe to do
unasked, at every launch, on the machine doing the work.

So the launcher pulls **twice**:

1. `--pull` with **no** `--install`. Cannot write into the data dir at all. It fetches, verifies,
   and writes `sync-completion.json`, whose `pushed_by` names the machine that authored the head.
2. `--pull --install` **only if that machine is not this one.**

**The machine that authored the state can therefore never have its own data dir overwritten by the
launcher.** An unknown author counts as foreign — same reversible lean as everywhere else: the cost
of installing a record we already had is a no-op (identical files are skipped), the cost of not
installing one we needed is a seat on the wrong lineage.

This forced one ordering inside `decide` that is load-bearing: **"whose record is it" is asked
BEFORE "did it install".** On the authoring machine `installed` is deliberately false and means
"nothing to bring in", not "half-arrived". Asking the other way round would read the safe case as
the dangerous one and put the working machine into `LocalHouse` at every launch
(`our_own_record_resumes_even_though_nothing_was_installed`).

---

## 5 · A BUG I HAD ALREADY WRITTEN, FOUND BY LOOKING AT THE OTHER MACHINE'S INSTALLER

Both sides of the self-versus-foreign equality have to come from **one** resolver. Mine did not.

`state-sync.js`'s cascade: `CONSONANCE_MACHINE` → `machine_tag` → **`os.hostname()`**.
My first `machine_identity()`: `install_id` → `machine_tag` → **`None`**.
And **`desktop-install.ps1` sets no `machine_tag` at all.**

So on the desktop A would have stamped a hostname into `pushed_by` while my side supplied nothing,
the self-check would never have fired, and the launcher would have migrated on every single launch
with nothing anywhere naming the cause. I also *wanted* `install_id` first — E is right that a
one-character tag is too coarse in general — and that instinct was correct in isolation and **wrong
here**: the moment the keeper adds an `install_id`, my side returns it, A's side still returns "L",
and the two never match again. **A shared unit beats a better unit.**

Fixed by removing the second resolver from the comparison entirely: A writes `machine` (its own
reading of *this* machine) into every record, so `decide` compares `pushed_by` against `machine`
from the same file. `machine_identity()` survives only as a fallback for when there is no record —
in which case there is no `pushed_by` to compare against either.
Pinned by `the_self_id_is_taken_from_the_tools_own_record_not_from_a_second_resolver`, whose fixture
supplies a deliberately wrong `self_id` and still decides correctly.

---

## 6 · WHAT I FOUND THAT IS NOT MINE TO FIX

**(a) THE THIRD PLACE'S WORDS ARE IN THE TRAVELLING SET, BY A GLOB. This is the one to act on.**
A's manifest: `captures/*.txt` → **TRAVELS**. `C:\Consonance\data\captures\3d000000-0000-4000-8000-000000003d00.txt`
is the Third Place's capture tail — 3,867 bytes, last written 03:42 tonight, so the seat is live.
It matches that glob. The room's standing rule is *"the Third Place's record: never the repo, never
a cloud the keeper did not choose"* (`.gitignore` at `exo_memory/third_place/`, 08-29), and the
record repo honours it. **The state repo does not, and nothing says so** — the rule is defeated by a
wildcard nobody wrote it against. A's file, the keeper's call. Until it is settled, a `--push`
publishes that seat's transcript to `solariz3d/consonance-state`.

**(b) THE APP WRITES TWO ROOTS AND THE MANIFEST WALKS ONE.** `state-manifest.js` walks `data_dir()`.
`seed_room`, `seed_md_dir` and `seed_manifest_path` call `default_data()` explicitly, so BOOT.md,
the deck, `spread/`, `research/`, `record/` and `.seeded.json` all live under `~/.consonance` —
outside the classification entirely: not TRAVELS, not STAYS, not REGENERATES, invisible to the check
whose whole job is to fail on a path nobody placed. **Measured rather than asserted:**
`~/.consonance/persist.log` was 42,705 bytes before `cargo test` and 43,279 after — the test binary,
with `DIRS` unresolved, appends to a log in the keeper's home directory. There is also a July-27
fossil `~/.consonance/captures/<MAIN_SID>.txt` sitting there: **a second capture tail for a fixed
session id, in a root nothing audits.** That is this packet's own hazard in miniature, already on
this machine.

**(c) MY L051 §6 WAS WRONG AND THE CORRECTION IS IN THE CODE.** §6 called the seeds an ordering
defect of the L051 class — *"they write the default dir before `set_dirs` runs"* — which reads as
*move them and it is fixed*. They call `default_data()` explicitly; their position decides nothing;
moving them would have been **a no-op that reads as a repair**, which is worse than leaving them.
The real finding is (b). Pinned by
`the_seed_subsystem_writes_a_second_root_and_it_is_not_an_ordering_defect`, which goes red the day
someone switches them to `data_dir()` — and that switch would MOVE the keeper's edited copies, so it
is his call, not a tidy-up.

**(d) `resume_pane`'s archive is one deep.** `<id>.jsonl.orphaned`, with the previous one deleted
first. Named above; not touched.

**(e) TWO FILES FOR A's MANIFEST, before they exist and fail the check at the worst moment.** The
launcher writes `sync-adopted.json` (the head this machine last adopted — machine-local, must not
travel, for exactly `sync-completion.json`'s reason) and `sync-pull.log` (the tool's stdout/stderr,
so the keeper can read at 08:00 why a pull did not complete; also why it is a file and not a pipe —
an undrained pipe deadlocks and the timeout becomes the only thing that ends it). Both are STAYS. A
`sync-*` glob would cover the family. `state-manifest.js` passes **right now** (139 paths, TRAVELS
57.5 MB, no UNPLACED) and will exit 1 the first time the app launches, which is correct-and-loud but
better fixed before 08:00 than during it. I have not touched A's file.

**(f) A DESIGN ASK FOR A, and it would delete my worst branch.** If `--pull --install` staged and
promoted **atomically**, "partial pull" would always mean "the promotion did not happen", the local
house would always be intact, and `ReadOnly` would have no reason to exist. `PROMOTION_JOURNAL`
(`sync-promotion.open`) is defined and read for that gap; **A's tool does not write it**, so today
the half-install is detected only from A's own `stage: "install"` report. That works and it is
narrower than a journal.

---

## 7 · WHAT I DID NOT VERIFY

**Not one line of this has run inside the app.** It compiles and 508 tests pass; the app has not
been rebuilt or launched. `508/0/4` is not the launch being proved, exactly as `480/0/4` was not the
replay being closed.

Also not verified:

- **The seam row has never appeared on a board.** `board_push` is called from `.setup()` at a point
  no row has been pushed from before.
- **The 90 s pull timeout is a guess.** Nobody has timed a fetch-verify-install of the 57.5 MB
  TRAVELS set. **Named cost: the window is dark for as long as the pull takes**, because the whole
  point is that nothing reads the data dir until the fill is finished. If the first desktop pull is
  slow, the app will look hung and then proceed as `LocalHouse` — safe, and confusing.
- **`Migrate` has never been executed against a real `~/.claude/projects`.** The moves are proved on
  a fixture home directory this test builds; the real one has different permissions and a live
  vendor process that may hold a handle on the file being renamed.
- **`append_synced_tail` has never produced a real intake.** The budget arithmetic is exercised only
  through `split_off_oldest_records`, which is separately tested.
- **The `--install` overwrite has no recency test and I did not add one.** A stale state repo would
  replace a newer local board with an older one. The two-phase rule stops that on the *authoring*
  machine; it does not stop it on a machine that has been offline while the record moved backwards.
  Reversible via `attic/pre-sync-*`.

### What CANNOT be verified without the second machine — the keeper's list, before 08:00

1. **`cat ~/.consonance.json` on the desktop and check `machine_tag`.** This is the highest-risk
   item on the page. If the desktop's config was copied from the laptop, **both machines call
   themselves "L", every foreign record reads as SELF, and the retire NEVER FIRES — silently.** The
   whole packet's objective fails and it looks exactly like success. If `machine_tag` is missing,
   A's hostname fallback covers it; if it is present and says `L`, change it before launching.
2. **That the desktop actually has transcripts for the three fixed ids** — i.e. that there is
   anything to retire. `ls ~/.claude/projects/C--Consonance-instances-{main,librarian,third-place}/`.
   If they are absent the retire is a no-op and the seats wake from the synced tails anyway, which
   is the right outcome by a different route.
3. **That `--resume` on the desktop would have found them.** The failure this packet prevents has
   never been observed; it is inferred from the code. If it turns out the desktop's encoded cwds
   differ (a different `instances_dir`), the whole hazard is different and so is the fix.
4. **Real pull latency and install duration over the internet**, against the 90 s bound and against
   E's ≤ 5 s live-mirror bound, which is a different measurement of the same link.
5. **Whether a migrated seat reads as continuous.** That is P-THESIS-TEST (A's), scored blind, and
   it is the thing that decides whether the record is the carrier. Nothing here tests it.

**And the honest shape of the first launch:** if anything above is wrong, the failure is `LocalHouse`
or an unnecessary `Migrate` — the desktop opens, works, and says which house it is in. It is not a
lockout and it is not a silent wrong-source resume. That is the whole of what this packet bought.

---

## 8 · OBJECTIVE AND FALSIFIER

    OBJECTIVE:  the desktop wakes as the synced seats, with its own past kept and revivable.
    FALSIFIER:  a seat on the desktop whose first words come from that machine's old transcript.

**The falsifier is checkable at 08:00 in one place and does not need a person to notice a
contradiction:** the seam row states the verdict, and a `MIGRATE` row names every file it moved and
where. If a seat's first words are its own machine's past, either the row says `RESUME`/`LOCAL
HOUSE` (in which case read §7's item 1 first — that is the way it fails silently), or the row says
`RETIRE FAILED for <seat>` in those words, which is the loud way.

**A second falsifier I owe, registered before the launch:** if the first desktop launch produces
`MIGRATE` on a record the desktop itself authored, the two-phase rule or the `machine`/`pushed_by`
comparison is wrong, and the evidence is one `sync-completion.json` beside one board row. That one
is recoverable by moving one file back out of `~/.claude/consonance-attic/`.
