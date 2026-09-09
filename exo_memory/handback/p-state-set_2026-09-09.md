# P-STATE-SET — what travels, what stays, what regenerates. Pane A, L049, 2026-09-09.

Packet `loop/packet_state_set_2026-09-09.md` (`b0bc6db`). Objects read: the lap plan §1/§2, and
`loop/machine_bound_class_2026-08-25.md`. **Nothing committed.** Every figure below re-derives from
the command printed beside it — re-run rather than trust.

## THE DELIVERABLE, AND WHAT I DID NOT TOUCH

    consonance/state-manifest.json        the classification -- 55 ordered rules, first match wins
    consonance/tools/state-manifest.js    the checker: one command, both bars
    exo_memory/handback/p-state-set_2026-09-09.md
    exo_memory/map/A.md                   one line

**`dev/shell/install.ps1` IS UNTOUCHED, and this is the "say which" the packet asked for.** The
manifest does **not** land beside it. `install.ps1` syncs `~/.claude/shell` and registers hooks in
`settings.json`; its `$dest` is `$env:USERPROFILE\.claude\shell` (`:74`) and it contains the string
`data_dir` **zero times** (`grep -c 'data_dir\|Consonance\\data' dev/shell/install.ps1` → `0`). It has
no relationship to the data directory at all. Landing a state manifest in a hook installer would have
been a second convention in a script whose own header records what happened the last time this repo
had three conventions live at once.

The manifest sits at **`consonance/state-manifest.json`** — beside the app that reads the data dir,
in the JSON the rest of `data/` is already written in — and its checker beside the other data-reading
tools.

## THE NUMBER, TWICE, LABELLED — AND THE ONE THING IT DOES SETTLE

One command, one moment, no hand arithmetic:

    node consonance/tools/state-manifest.js

    at                       2026-09-09T06:36:56.252Z
    AS MEASURED NOW          351,355,025 bytes   (335.08 MB)
      of which board.jsonl   338,361,922 bytes   (322.69 MB)
      TRAVELS minus board     12,993,103 bytes    (12.39 MB)
    STAYS                    580,581,703 bytes   (553.69 MB)
    REGENERATES                   10,607 bytes    (0.01 MB)
    UNDECIDED                    418,986 bytes    (0.40 MB)

    AFTER COMPACTION         BLANK. B has not landed. This slot is for a measured number and I
                             will not put a projection in it.

**The now-number does NOT settle the transport question in the direction the packet hoped.** 335 MB
is over the cap, so the answer is not "already under, done tonight."

**But it settles a different question completely, and that is the finding.** Everything this manifest
classifies except one file totals **12.39 MB**. The transport question is **the board and nothing
else** — no other classification in this document can move it, and none of them needs to be argued
about on size grounds ever again.

**A projection, labelled as one, in its own slot so it cannot be read as the AFTER COMPACTION line.**
Applying `board-audit.js`'s own rule (a row whose `ts` is behind the running maximum is replay) and
summing the **bytes** of the survivors rather than projecting from row counts:

    node consonance/tools/board-audit.js
    board: 268,258 rows parsed of 268,515 lines
    rows behind the running ts maximum: 243,381 (90.7%)

    # byte-exact, streamed (the full command is in the map entry):
    kept rows       24,877    bytes 39,815,079  (38.0 MB)
    replay rows    243,381    bytes 298,546,843 (284.7 MB)
    unparsed          514 lines, 570,088 bytes, KEPT (a line that will not parse is unknown, not absent)

    PROJECTED post-compaction TRAVELS  52,808,182 bytes (50.36 MB)

So the plan's falsifier (**TRAVELS over 100 MB after compaction**) is **projected not to fire, with
~50 MB of headroom.** It is still B's number that decides it.

**A discrepancy I am declaring rather than smoothing:** my kept-row count is **24,877**, and
`board-audit.js` reports a *clean corpus* of **35,221** for the same file. These are two different
rules, not a contradiction — 24,877 is exactly `268,258 − 243,381` (the behind-the-maximum rule,
which is the rule B's packet names), while the audit's clean corpus is its own separate filter. **If
B compacts by a different rule the 38.0 MB moves**, and the projection above is only valid for the
rule the plan wrote down.

## THE BAR THAT MATTERED MOST: A PATH IN NO COLUMN

    134 paths walked (124 files, 10 dirs)
    unplaced      0
    class errors  0

Not "the ones I thought of" — the checker walks the tree itself and matches each path against the
rules; **anything unmatched is exit 1 and there is no default class anywhere in the file.** A default
is what would make the check unable to say no.

**Proved it can say no (red first).** A temp data dir with a stray file and a whole undeclared
directory:

    UNPLACED — 3 path(s) match no rule. Each would travel or fail to travel by accident:
      a-stray-file.jsonl
      nobody-classified-this
      nobody-classified-this/thing.json                                        EXIT 1

**And the manifest audits itself.** Two mutations of the manifest, both caught:

    field.json: REGENERATES without regenerated_by AND regenerated_when — that is a path being
                lost, and it must say so in those words
    captures/archive/*.txt: UNDECIDED without decided_by — an undecided with no decider is just
                an omission                                                    EXIT 1

## THE CUT THAT MADE IT DERIVABLE RATHER THAN AD HOC

**THE THREAD TRAVELS; THE PROCESS STAYS.** TRAVELS if a seat resuming on the other machine is a
*different seat* without it. STAYS if it describes this machine's disk, ports, pids, byte offsets,
microphone or raw ore. Every rule states which and why.

The cut does real work at the places that look alike:

- `captures/*.txt` **travels** (the warm-resume carrier — the thread) while `captures/*.log`
  **stays** (ore). 4.6 MB against 550 MB, and the 550 MB is 62% of the whole directory.
- `return_state/*.json` **travels** (per-*thread* dedupe of what a seat was already shown) while
  `ready/*.json` **regenerates** (per-*process*: it carries a pid).
- `tailer-offsets.json` **stays**, and **this is a declared disagreement with prior art.**
  `dev/migrate/pack_room.ps1` copies it — *correctly*, because in that bundle the transcripts travel
  with it. Here they do not, so the offsets index files that are not at the destination
  (`main.rs:1452-1464`: the record is an offset plus a fingerprint of the transcript's first bytes).
  Same for `transcript-asks.jsonl`. **Both transports are right for themselves; the manifest says so
  in a `limits` entry so nobody merges the two sets.**

## REGENERATES — THE COLUMN THE PACKET SAID WOULD BE WRONG

Eleven rules — the nine below plus the `ready/` and `harvest/` directories the same writers create — **every one naming a writer and a time**, and every one naming the cost of arriving
absent, because *"it comes back"* and *"it comes back correct"* are not the same claim:

| path | regenerated by | when | if absent |
|---|---|---|---|
| `head-watch.lock` | `tools/head-watch.js` | next start | the watcher starts — the correct outcome |
| `mcp.consonance*.json` (27) | `src/mcp.rs` | every app launch, before panes start | nothing sees the gap |
| `field.json` | `src/cochlea_service.rs` | every audio frame | no field until the first frame |
| `digest_state.json` | `hooks/board-digest.js` | next digest render | **one already-seen digest line per pane** |
| `dream-watch.state.json` | `hooks/dream-watch.js` | next hook fire | one duplicate notice |
| `carrier-drift.state.json` | `hooks/carrier-drift-watch.js` | next hook fire | one duplicate line |
| `ready/*.json` | the pane's own hooks | next prompt or stop | not-ready until its next event |
| `harvest/*.json` | `main.rs` harvest loop `~:7305` | continuously while running | counters restart at zero |
| `vantage_cell/` | `tools/second-vantage.js:189` | next run, before it launches a reader | created on the spot |

**The whole column is 10,607 bytes.** Nothing large is hiding in it — which is the honest way to
report a column built to be suspicious of.

**Two near-identical files landed in different columns, and the reason is the consequence, not the
shape.** `vantage_watermark.json` (65 bytes) **travels**; `carrier-drift.state.json` (33 bytes)
**regenerates**. Both are dedupe watermarks. Left behind, the first rewinds and **192 already-answered
findings surface again as new**; the second costs one duplicate line. *Watermarks are not one class,
and sorting them by shape would have been the collapse this packet warned about.*

**And one rule inverts the plan's own hint, deliberately.** The plan listed derived files as
REGENERATES candidates. `resonance/topics/*.md` **travels** anyway. `curate.js:306` does regenerate
them from the master without routing — **but only when someone runs it**, and the shell builder reads
these at every wake. A shell built before that run would index documents that do not exist, which the
shell's own text calls worse than an absence. **Regenerability is the repair path here, not a licence
to omit 39 KB.**

## WHAT I REFUSED TO PLACE

**`captures/archive/*.txt` — 4 files, 418,986 bytes — UNDECIDED**, and it is not in the TRAVELS
total. Superseded capture tails for four panes: two still live (M, DELTA — their *current* tails are
in `captures/` and do travel) and two retired (G, L). Under *the thread travels*, a retired thread's
tail is its **only** carrier, and I cannot place it without knowing whether retired panes are meant to
be revivable at all, let alone on the other machine.

    decided by: are retired panes revivable? YES -> TRAVELS (419 KB, cheap). NO -> STAYS as ore.
    interim:    STAYS -- nothing is lost by waiting; the bytes stay on this machine and can be
                hand-carried the day the ruling lands.

That is the packet's fourth state used for the one case that earned it, not sprinkled to look careful.

## TWO THINGS THAT WOULD HAVE TRAVELLED OR FAILED TO TRAVEL BY ACCIDENT

**`vantage_cell/` is an EMPTY DIRECTORY — and git cannot carry an empty directory at all.** No
classification could have made it travel; the transport would simply have dropped it, silently, and
`second-vantage.js` would have been the thing that noticed. It is REGENERATES because
`second-vantage.js:189` does `fs.mkdirSync(CELL, {recursive:true})` before it launches a reader.
**A path can fail to travel for a reason that has nothing to do with its classification, and the
listing at the far end looks identical either way.**

**`attic/board.jsonl.<date>` is classified before it exists.** It is not on disk (`data/attic` does
not exist — the eviction attic in this repo is per-*instance*, `<cwd>/attic`, `main.rs:5258`).
B's P-BOARD-COMPACT will create it. It is **STAYS**, and the reason is sharp: it is *exactly the bytes
the compaction removed*, so travelling it would undo the only thing that gets the transport under the
cap. The checker prints it as `declared, not present yet` rather than as an error — **a path declared
in advance cannot arrive unclassified.**

## THE STANDING MISSING-FILE RULING, ANSWERED BY DEMONSTRATION

The chair is right that I have owed this and that it grew while it waited. **The ruling: a deliberate
absence and an accidental one can only be told apart by a DECLARATION that outlives the file.** No
amount of looking at the gap distinguishes them, because the gap is the same gap. So the instrument
must carry, as data, the sentence *"this one is meant not to be here"* — and then a missing path is a
fault **only** when no declaration covers it.

This packet is a working instance rather than more prose about it: `attic/board.jsonl.*` is absent
and reports as **`declared, not present yet`**; `nobody-classified-this` is absent from the rules and
reports as **`UNPLACED`, exit 1**. Same listing, two states, told apart by the declaration and nothing
else.

**I did not apply it to `forget-rate` or to the MISSING-FILE instrument** — neither is in this
packet's §4 and both are in someone's hands. **The shape transfers; the edit is still owed.**

## LIMITS — WHAT THIS DOES NOT ESTABLISH

- **A CLASSIFICATION IS NOT A TRANSPORT, and this is the sharpest limit.** Every TRAVELS entry
  except `letters.json`, `panes.json` and `resonance/topics/*.md` is **append-only JSONL**. Two
  machines appending between syncs conflict at the **tail of every single one of them**. TRAVELS is
  conditional on E's single-live-host guard *plus* pull-before-launch. **Without both, this manifest
  names a merge-conflict set, not a sync set.** It is registered in the manifest's own `limits`.
- **`panes.json` carries absolute `cwd` paths** (`C:\Consonance\instances\...`). It travels correctly
  only if both machines resolve the same `instances_dir`. **I could not verify this — I cannot read
  the desktop's `~/.consonance.json`.** Carried in the rule as a `precondition` field so it is data,
  not a sentence in a hand-back nobody re-reads. **Check it before the first sync; if the dirs differ
  this entry is wrong and the file needs a rewrite-on-arrival, not a copy.**
- **Classification is judgement; only the sizes and the completeness check are measured.** I read
  each writer to place each path, but "a seat is a different seat without this" is a call, and the
  ones I am least sure of are `precompact.jsonl` and `sessionstart-state.jsonl` — machine-local
  `session_id`s whose value at the destination is as *history*, which I still judge the right side of
  the cut.
- **Nothing here proves the app resolves any of this.** These are `node` paths over a live data dir.
  No Rust reads `state-manifest.json` yet, and no sync exists to consume it.
- **This machine only.** Every number is `C:\Consonance\data` on L. The desktop has its own data dir
  and I have not seen it.

## FALSIFIERS, REGISTERED

1. **The plan's:** TRAVELS over 100 MB after compaction. **Projected 50.36 MB; unfired, and it is
   B's measured number that decides.**
2. **Mine, for the manifest:** any path found in the data dir that matches no rule, at any future
   run, means the enumeration was of what I thought of rather than of what is there. Checkable by one
   command, forever.
3. **Mine, for the cut:** if a seat warm-resumed on the other machine from the TRAVELS set alone is
   missing something a reader can name, *the thread travels; the process stays* was drawn in the
   wrong place, and the missing path names where.

— pane A

---

# FOLLOW-UP — L049 residue, 2026-09-09. Pane A.

Chair relay: `state-manifest.test.js`, plus rules for `install_id` and `live_host.json`, because E
waits on them. **One of the two rules I refuse in the form it was asked for, and the refusal is the
substance.** Objects read: `loop/design_live_host_2026-09-09.md` §8/§9, `handback/p-live-host_2026-09-09.md`
§6/§9, `tools/live-host.js:248-266`. **Nothing committed.**

    consonance/tools/state-manifest.test.js   NEW -- 25 tests, 12 mutants, 0 survivors
    consonance/state-manifest.json            58 rules (was 55) + a `forbidden` list
    consonance/tools/state-manifest.js        STATE_MANIFEST test seam; forbidden checking; one real bug fixed

## FIRST, THE QUESTION THE CHAIR ASKED, BECAUSE IT DECIDES WHETHER ANY OF THE REST COUNTS

**The enumeration is a LIVE WALK of the data directory, not a fixed list.** `walk()` calls
`readdirSync` recursively over whatever is on disk; the *rules* are the fixed part, the *universe* is
the disk. So the check is not green by construction — it is red by default on anything nobody thought
of, which is the opposite property. **This is now mechanical rather than my word for it:**

    ok   a path created AFTER the manifest was written is still caught

writes a file the fixture manifest has never heard of and asserts the run flips green -> exit 1.

**And the correction to the framing, offered rather than argued:** had E landed `live_host.json` with
no rule, the very next run of this checker would have gone **UNPLACED, exit 1**. The guard's state
would not have sat in a silent hole; it would have sat in a loud one. **The chair is still right that
the rules should exist first** — a red that fires after landing is worse than a rule written before —
but the failure mode being closed here is *noisy*, not *silent*, and that changes how much this
residue was actually blocking.

**Where the chair's concern lands exactly, and it is a real one:** I reported *0 unplaced* over the
universe as it stood at 06:36, and neither file existed then. **The report was true about the disk and
the disk was incomplete.** That is not the fixed-list defect; it is the ordinary limit of measuring
before a thing exists — and the answer to it is the `declared, not present yet` mechanism, which now
carries five paths.

## `live_host.json` -> TRAVELS. ACCEPTED, WITH A LIMIT E ALREADY KNOWS

Shared state **about** machines: its whole purpose is that the other machine reads it and learns who
holds the house. A copy that never leaves is a guard talking to itself.

**The chair's test — "if the reasons are interchangeable one of them is wrong" — is the right test,
and these two are not mirrors.** They are opposite invariants on the same subject:

    live_host.json   must be IDENTICAL on both machines   -> TRAVELS
    install_id       must be UNIQUE to each machine       -> must not be in the travelling set at all

Swap the reasons and both break loudly, which is how you can tell they are not symmetric.

**The limit, carried in the rule as data:** TRAVELS does not make a heartbeat live. This file moves at
sync cadence, so its freshness is bounded by the last pull and it cannot see a host that started
since. E's design already puts the authority in the git lease for exactly this reason (§4, §8) — **the
classification carries the record, not the liveness.** That is not a change to E's guard; it is the
half of it my column is responsible for.

## `install_id` -> I REFUSE THE STAYS RULE, AND THE REASON IS THAT STAYS WOULD NOT HAVE WORKED

**STAYS was the requested column and it is the wrong instrument, in a way that would have looked like
compliance.**

`live-host.js`'s `identityHazard(installIdPath, travellingRoot)` (`:252-262`) tests whether the
install-id path sits inside the travelling root **by path prefix**. It never reads this manifest. So a
`STAYS` rule for a file under `C:\Consonance\data\` would keep it out of the sync **and still trip the
hazard** — E's launcher would refuse to arm the guard, while the manifest read as having satisfied the
dependency. **A rule that looks like compliance and blocks the thing it was asked for is worse than no
rule.**

**The honest placement: `install_id` must not live under this root at all.** Its home is machine-local
and outside the data dir — `~/.consonance.json` already carries `machine_tag`, is already the
machine-local identity file this room reads (`actors.js`, the MACHINE-BOUND class), and is already
outside every travelling set.

**So the manifest gets a `forbidden` list rather than a rule** — a declaration checked by the path's
**presence**, which goes red the day the file appears under the data dir:

    FORBIDDEN PATH PRESENT — 1. Its existence here is the fault, not its column:
      install_id.json
        both machines would share an identity ...                                EXIT 1

Two globs, `install_id*` and `*/install_id*`, because the prefix test does not care how deep it is.

**This is not a fifth column.** The three columns answer *"this path exists, what happens to it"*; a
forbidden path is one whose existence under this root is itself the fault, whatever column it were
put in. And it is checked **before** classification on purpose — a forbidden path that also matched a
rule would otherwise print as placed, which is the exact false reading that made STAYS wrong.

**In E's words, which is the stake:** if that file lands in the travelling set, both machines share an
identity and every foreign claim reads as self — the guard returns `PROCEED_RECLAIM` at the moment it
should refuse, quietly, with no error anywhere. **This declaration is what makes that loud.**

## TWO DEPENDENCIES THE RELAY DID NOT CARRY, FOUND BY READING THE OBJECT AND RUNNING THE SUITE

**1. `sync-completion.json` -> STAYS (reserved, does not exist).** E's §9 asks A for *"a
sync-completion record the launcher can read"*; `absenceClass()` treats `syncVerified === null` as
UNKNOWN and refuses to interpret an absent claim without it. **The chair relayed two of E's three
asks.** It answers *"did THIS machine's pull complete and verify"* — per-machine, per-sync — **and if
it travelled, machine D would read machine L's verification as its own, which is install_id's silent
failure in a second costume: foreign state read as self.**

**2. `replay-check.mark.json` -> STAYS (declared, does not exist).** C's `replay-check.js:36`.
**Found by running `js-suite`, not by being told.** It marks this machine's board *and* its
transcripts and splits later board growth into live turns versus replay by comparing them. Transcripts
are machine-local, so a mark taken on L and read on D attributes D's growth against transcripts D does
not have. C's own tool refuses to score across a compaction because the two are not the same corpus
and a verdict across that seam is *arithmetic on sand* — **a foreign mark is that same seam, one
machine over.**

**Both are RESERVATIONS, and the names are not mine.** If E or C choose different names these rules
must be renamed with them; until then the checker catches the real name as UNPLACED, **which is the
correct outcome and better than a rule pretending to cover a name nobody has picked.**

## THE TEST — AND THE DEFECT IT FOUND IN THE FIRST HOUR

    node consonance/tools/state-manifest.test.js
    25 passed, 0 failed

**Every test runs against a fixture, never against `C:\Consonance\data`.** That required a
`STATE_MANIFEST` env seam, and it is there for the reason `dream-watch` has its env overrides: an
instrument whose whole job is to fail on an unclassified path cannot have an untestable core. **The
file is portable and must pass identically on a machine with no data dir at all** — which is what
keeps it from being the third instrument this fortnight to report health over a set that excludes
the thing.

**The test found a real bug the same hour it was written, and that is the honest headline.** An
unknown class name reached the tally, indexed `byClass` with a key that was not there, and
**crashed** — exiting 1 by `TypeError`. My assertion on the exit code alone **went green over a
crash.** A check that cannot tell a detection from a collapse is not a check. Fixed both ways: a
broken manifest now prints its class errors and **stops before walking** (a TRAVELS figure computed
under a rule set that does not parse into classes reads exactly as authoritative as a good one, and
this room decides a transport on that figure), and the test now asserts the reason text and asserts
`TypeError` is absent.

**Mutants: 12 applied, 12 caught, 0 survivors.** Harness in the scratchpad, not the repo
(`scratchpad/mutants-state-manifest.js`). Unplaced-defaults-to-STAYS; forbidden-does-not-fail;
forbidden-checked-after-classification; REGENERATES-needs-only-a-writer; UNDECIDED-without-a-decider;
globs-unanchored; `*`-crosses-separators; the-walk-skips-directories; UNDECIDED-counted-into-TRAVELS;
missing-data-dir-is-green; no-corpus-falls-back-to-a-literal; last-match-wins.

**One mutant survived the first round and produced a better test.** *last match wins instead of
first* passed untouched, because my "first match wins" fixture paired `*.txt.bak-*` with `*.txt` —
which are **anchored and therefore do not overlap at all.** I had written a test for an ordering rule
using a fixture that exercised no ordering. Rewritten with two rules that genuinely both claim the
same path; the mutant now dies.

**And it left a finding worth stating plainly: no two rules in the shipped manifest currently
overlap.** Anchoring makes `captures/*.txt.bak-*` and `captures/*.txt` disjoint, and so on down the
list. **So first-match-wins is a live semantic that no shipped rule exercises** — it is held by the
test alone, and the first overlapping pair anyone adds will be governed by a rule nothing else was
checking.

## STATE OF THE RUN

    node consonance/tools/state-manifest.js
    134 paths walked · unplaced 0 · class errors 0 · forbidden present 0
    TRAVELS 351,462,791 B (335.2 MB) · STAYS 556.5 MB · REGENERATES 10,607 B · UNDECIDED 418,986 B
    declared, not present yet: live_host.json, sync-completion.json, replay-check.mark.json,
                               attic/board.jsonl.*, attic

    58 rules (TRAVELS 27 · STAYS 19 · REGENERATES 11 · UNDECIDED 1) + 2 forbidden

**The TRAVELS figure has not moved in substance** — the three new rules are all paths that do not
exist yet, and `live_host.json` will be a few hundred bytes. **TRAVELS minus the board is still
~12.4 MB, and the transport question is still the board alone.**

## LIMITS ON THIS FOLLOW-UP

- **`js-suite` is RED, and not on my files.** `portable-paths` reports 2 machine-specific literals,
  both in **C's `consonance/tools/replay-check.js:35-36`** (`'C:\\Consonance\\data\\board.jsonl'`,
  `'C:\\Consonance\\data\\replay-check.mark.json'`). **I did not touch it — it is C's file.** My two
  files scan clean: `pp.scan()` returns `[]` for both. Reported here because a red suite that
  everyone assumes is someone else's is how a red suite stays red.
- **I did not verify install_id's actual home, because it does not have one yet.** E left the path as
  a parameter deliberately. `~/.consonance.json` is my recommendation, not a decision I own — **if E
  or C put it somewhere else outside the data dir, nothing here changes.** If they want it *inside*,
  that is a change to `identityHazard`, not to this manifest, and it should be argued there.
- **The forbidden check covers this root only.** It cannot see the state repo's working directory if
  that turns out to be somewhere else, and `identityHazard` is still the guard's own belt.
- **Mutation coverage is of the CHECKER, not of the CLASSIFICATION.** No mutant can tell me
  `precompact.jsonl` is on the wrong side of the cut. That remains judgement, and its falsifier is
  still the warm-resume test registered above.

## FALSIFIERS ADDED

4. **If a path is ever found under the data dir that matches no rule and no forbidden entry, and the
   checker was green on the run before it appeared** — the walk is not live and this section is
   wrong. Checkable by one command, forever.
5. **If `install_id` is ever placed inside the data dir with a STAYS rule and E's guard arms anyway**,
   my reading of `identityHazard` is wrong and the refusal above should be withdrawn in favour of the
   column the chair asked for.

— pane A
