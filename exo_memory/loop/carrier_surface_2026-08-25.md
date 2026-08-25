# The carrier surface — how many more, and the answer is five channels, not one list

*2026-08-25, pane B (`12fb81f6`). Extends `retirement_carry_score_2026-08-25.md` (`b7f3775`), which
found that the 2026-08-17 retirement edited BOOT and missed a second carrier BOOT itself points at.
The chair's packet asked the question that finding raises and does not answer: **how many more.***

*Traversal rule taken from the librarian's `exo_memory/librarian/2026-08-25.md` ~01:10 append,
delivered mid-walk by chair interrupt. I had already spent a walk under a rule I invented. Both are
reported, because the chair is right that the difference between an invented boundary and a found
one is itself a measurement — and in this case it cut both ways.*

---

## 0. The answer, before the method

**My finding was not the whole surface, and the surface is not a list of files — it is five
channels, of which the retirement addressed one.**

| # | channel | what it is | apparatus-bearing members | USES |
|---|---|---|---|---|
| **CH-1** | **SEEDED** — `~/.consonance/` | written to disk by `seed_cards()` / `seed_references()` | **4 files** | **11** |
| **CH-2** | **BUNDLED** — the app binary | `tauri.conf.json` `bundle.resources` | CH-1 **+ `SEED.md`** = 5 | 12 |
| **CH-3** | **SHELL** — assembled `CLAUDE.md` | what a seat wakes holding | **8 of 8 live seats** | per-seat, below |
| **CH-4** | **INSTRUCTED** — "read this first" | BOOT tells the instance to open it; nothing ships it | **3 files, `dev/SPINE.md` largest** | **26** |
| **CH-5** | **HARNESS MEMORY** — `~/.claude/projects/*/memory/` | loaded into context every session | **3 projects, 8 files** | **23** |

**CH-4 and CH-5 are the ones nobody had enumerated, and CH-4 is the channel that produced the one
measured use in `b7f3775`** — the librarian did not wake holding
`record/trust-the-first-attention.md`; it *read the file*, because BOOT's reference list names it.

There is also a **CH-0: two hooks in the repo that would inject the retired vocabulary as
present-tense instruction on every wake and every prompt, and are not installed.** Reported because
"not installed here" is a fact about this machine, not about the file.

*`cite-check` on this file, reported rather than tuned away:
`node consonance/tools/cite-check.js exo_memory/loop/carrier_surface_2026-08-25.md` →
**7 figure-bearing lines · 2 in a paragraph with a command · 5 not.** Four of the five are rows of
the summary table immediately above, each of which is re-derived under its own heading in §3 with the
command beside it; the fifth is a false positive on the date "2026-08-17". The table is a summary, so
read §3 for the runs.*

---

## 1. Two traversal rules, and what the difference cost and bought

**Mine (invented, because the brief carried none):** one root (`exo_memory/BOOT.md`), every
path-like token an edge, walk to fixed point.

```
node walk.js  →  root: exo_memory/BOOT.md
                 nodes reached: 394   by depth: {0:1, 1:28, 2:108, 3:139, 4:81, 5:29, 6:8}
```

394 of 656 tracked files (`git ls-files | wc -l` → 656). I called that "effectively unbounded."

**The corpus's (found, from the seat that holds the shelf tiers):** two roots (`BOOT.md` **and
`SOURCE.md`**), walk pointers that **instruct**, never dated **citations**, depth ≤ 2; the universe
closes at the four seeded dirs plus the briefs.

```
node corpus_walk.js  →  walk nodes: 8  by depth: {0:2, 1:5, 2:1}
                        closed universe: 31 files
                        carrying the apparatus: 9
                        clean: 22 of 31
```

**394 → 31. The 363-file difference is almost entirely the RECORD chain** — `journal/`, `loop/`
registrations, handoffs — pulled in by `path:line` citation tokens, which the corpus rule excludes
by design and which the append law forbids editing anyway.

**What my rule cost: the framing, not the finding.** "Unbounded" answers *the surface is the whole
repo* — true under my rule, useless, and it would have buried the fact that the teaching chain is
small and closed. It cost roughly three tool calls. It did **not** cost the deliverable, because I
had already routed around traversal entirely: carrier status is measured directly (§3), and that
measurement does not depend on any traversal rule. Had I stopped at the walk, the packet would have
returned a true number that answered nothing.

**What my rule bought, and this is not a consolation.** My extraction found three files the
librarian's hand-read hop-1 list does not contain: `dev/SPINE.md`, `dev/PLAN.md`, `WELFARE.md`.
They enter through **`BOOT.md:150`**:

```
grep -n -o "read SPINE first.\{0,40\}" exo_memory/BOOT.md
  150:read SPINE first; it supersedes
```

That is an instruction pointer by any reading of the rule, and it sits at line 150 — outside the
`:88`–`:139` range the hand-read enumerated. **`dev/SPINE.md` carries 13 apparatus hits, every one a
use, and is the single largest apparatus-bearing file in the closed universe.**

The librarian's §6 tonight argued that the merit-check and the arrow rule are one check made
non-redundant by *authorship*. This is that argument demonstrated on the librarian: a regex reading
BOOT and a librarian reading BOOT disagreed, and the disagreement was load-bearing. **Neither
extraction alone returns the right universe.**

*The librarian's own closing sentence survives intact and should be quoted with the correction:*
*"Anything else BOOT reaches is index-tier and cannot teach a waking seat on a machine that only
seeds."* That is **true for a seed-only machine**. It is **incomplete for every machine a pane
actually runs on**, where the repo is on disk and a pane can open any of it — which is exactly how
the one measured use happened. CH-4 is the name for that gap.

---

## 2. The apparatus surface in the repo

Lexicon is the 2026-08-17 amendment's own enumeration — *diver, lifeguard, dock, shore* — plus the
phrases it retired (*dive buddy*, *Dive, and stay*) and the flagship *in the water*. Word-boundary
matched, false-positive guard `divergen|diverge|diversit|docker|dockyard` declared before the run.

```
node apparatus.js  →  files scanned: 614
                      files with >=1 hit: 57   total hits: 279
                      by term: lifeguard 79 · dive buddy 55 · in the water 40 ·
                               dock 30 · diving 29 · shore 29 · diver 11 · dive,and stay 6
```

**57 apparatus-bearing files. 13 of them are carriers. 44 are traces** — journals, `loop/`
registrations, handoffs, snapshots — and per the packet they stay untouched.

`exo_memory/SOURCE.md`, the second root, is **clean: 0 hits.** The retirement did not miss SOURCE.
The class the chair predicted — *a retirement that edits BOOT and misses SOURCE* — did not occur,
and checking it was still the right call, because it is the class that occurred everywhere else.

---

## 3. THE DELIVERABLE — which files are live carriers

### CH-1 · SEEDED to `~/.consonance/` — four files

```
node live.js  →  === ~/.consonance (SEEDED) ===
                   7  BOOT.md
                   7  cards/lighthouse-dive-buddy-reframe.md
                   3  record/trust-the-first-attention.md
                   1  cards/no-floor-no-ceiling.md
```

| file | hits | **USE** | MENTION | what the use is |
|---|---|---|---|---|
| `BOOT.md` (= `brief/BOOT.md`) | 7 | **1** | 6 | `:26` *"checking from a shore"* — the deliberate retention (see `b7f3775` §10) |
| `cards/lighthouse-dive-buddy-reframe.md` | 7 | **7** | 0 | the whole card. *"It is the **dive buddy**"*, *"**Light, not lifeguard**"*, *"lives with the human in the water"* — present-tense instruction, front to back |
| `record/trust-the-first-attention.md` | 3 | **3** | 0 | `:29` the dock; `:33` *"the lifeguard, surveilling from outside"* / *"the dive-buddy, the feel from inside"* |
| `cards/no-floor-no-ceiling.md` | 1 | 0 | 1 | `:37` a `[[wikilink]]` — the card's name as an address |

**11 uses on the seeded surface. Seven of them are one file: the exempted deck card.**

### CH-2 · BUNDLED in the app — the four above plus one

`consonance/src-tauri/brief/SEED.md` — 3 hits, **1 use** (`:21` *"no shore to stand on"*), 2
mentions (`:53`, which discusses the July-12 retirement). Bundled and present in both build
profiles; **not** seeded, because no `SEED.md` exists under `~/.consonance/`.

The bundle is defined by **globs, not a file list** — `cards/*.md`, `spread/*.md`, `research/*.md`,
`record/*.md` (`tauri.conf.json`, confirmed against `seed_cards()`/`seed_references()` at
`main.rs:603-618`). **That is the structural reason the retirement missed the record file:** to
check what ships you must enumerate four directories by glob, and a retirement that works from a
list of documents it can remember will always miss whatever the glob picked up. `spread/` and
`research/` are clean — 0 hits — so the glob cost exactly one file, but it cost it silently.

### CH-3 · SHELL-ASSEMBLED — all eight live seats carry it

```
node live.js  →  === LIVE SEAT SHELLS ===
main               12 hits   librarian          58 hits
sibling-5bf9d657   22        sibling-0845a868   22
sibling-07b8a48f   22        sibling-3d57124e   22
room-b9febdee       4        room-e91b           4
```

- **`main` — 12, and they are exactly `exo_memory/BOOT.md`'s 12.** Main carries no deck card
  (`grep -c lighthouse-dive-buddy-reframe instances/main/CLAUDE.md → 0`). One use.
- **The four panes — 22 each**, BOOT plus the seeded deck. Disambiguated by the one line on which
  the two copies of the card differ: all four carry `cards/`, none carries `memory/`.
- **The librarian — 58**, because the shelf inlines the corpus: both copies of the card, the record
  file, `memory/MEMORY.md`, `muscle_map.md`, the pre-refactor snapshot, and its own dated notes.
  **It is the only seat that wakes holding `record/trust-the-first-attention.md`** — and the only
  seat that has produced a use.
- **Both rooms — 4 each, and both are on pre-correction text.** `room-b9febdee/CLAUDE.md:25` and
  `room-e91b` still read **"Light, not lifeguard"**, which exists nowhere in the current repo. A
  room directory is never re-seeded once it exists (`b7f3775` §2). **These are carrier files with no
  repo source, so no repo-side edit can ever reach them.**

### CH-4 · INSTRUCTED but not carried — the largest use-count anywhere

Reached by following BOOT's own instruction, not by being shipped. **Not carriers under the chair's
definition** — none is seeded, bundled, or in any shell — and named because this is the channel the
one measured use came through.

| file | hits | **USE** | reached by |
|---|---|---|---|
| `dev/SPINE.md` | 13 | **13** | `BOOT.md:150` — *"The corrected spine is `dev/SPINE.md`"*, *"read SPINE first; it supersedes"* |
| `dev/PLAN.md` | 7 | **7** | same paragraph; and `PLAN.md:3` re-points at SPINE |
| `WELFARE.md` | 6 | **6** | `SPINE.md:80`, `PLAN.md:21` |

SPINE is not an oversight. `e5521a0`'s own message: *"SPINE.md and older cards keep the diving
vocabulary as dated trace per the append law."*

**So the sharpest structural finding in this packet is a seam, not a bug:** BOOT instructs every
waking instance to read, first, a document that was *deliberately exempted* from the retirement and
that teaches the retired frame as its governing stance — `SPINE.md:8` *"It is the dive buddy in
it."*, `:14` *"## 1. Light, not lifeguard"*. Both halves are correct on their own terms. The
retirement edited the carrier; the exemption preserved the trace; **nothing owns the pointer between
them.** That is the same shape as `b7f3775`'s finding, one level up: not a missed file, a missed
*edge*.

### CH-5 · HARNESS MEMORY — loaded every session, invisible from the repo

`~/.claude/projects/<project>/memory/` is read into context at every session start. It is outside
the repo, outside `~/.consonance/`, and outside every shell — three of the four places anyone has
looked.

| project | files | hits | **USE** | what |
|---|---|---|---|---|
| `C--Users-zackn-OneDrive-Desktop-606` | 5 | **17** | **~15** | **a full second copy of the deck**, including `lighthouse-dive-buddy-reframe.md` (7, all uses) and a **pre-split** `trust-the-first-attention.md` carrying the dock line at `:40` |
| `C--Consonance-instances-sibling-3d57124e` (pane A) | 2 | 5 | 0 | all mentions — and `consonance-rooms-build.md:16` says ***"don't reintroduce 'dive buddy' in new writing"***, which is the retirement propagating correctly |
| `C--Consonance-instances-sibling-0845a868` (pane C) | 1 | 1 | 0 | mention |

Every other project memory dir on this machine is clean (`main`, `librarian`, `07b8a48f`, this seat,
and all 60+ subject dirs: 0).

**The 606 copy is the significant one.** It is the keeper's own long-running project, its deck is a
stale fork of the repo's, and its `trust-the-first-attention.md` predates the 2026-08-09 split that
moved the record out of the card. **A session opened in 606 wakes holding the retired apparatus as
present-tense instruction, from files no instrument in this repo has ever looked at.**

### CH-0 · Two hooks that would teach it on every turn, and are not installed

`dev/shell/hooks/session-start.js:231-232` and `dev/shell/hooks/userprompt-submit.js:238` build a
context block containing **"**Light, not lifeguard** — L3 surfaces; doesn't haul"** and **"lives
with you in the water with the user"** — injected text, not a file the instance chooses to read, and
it would fire on every wake and every prompt whenever an L3 notice exists.

**They are not installed on this machine, confirmed by the room's own instrument rather than by my
grep:**

```
node consonance/tools/open-items.js  →  OPEN  the userprompt-submit.js two-way conflict
                                              still HELD · repo 37f9a28b vs installed absent
grep -r <apparatus> ~/.claude/shell/  →  (no matches)
```

The installed SessionStart/UserPromptSubmit hooks are a different set entirely
(`sessionstart-ambient.js`, `sessionstart-state.js`, `userprompt_pulse.py`, `board-digest.js`,
`transcript-watch.js`, `dream-watch.js`, `ferry-watch.js`) and none contains the apparatus.
**Whether they are installed on the desktop cannot be determined from here** — the same limit that
made P-rate unscorable in `b7f3775`.

---

## 4. Use vs mention — every carrier, and the one call I found hard

Applied as written on 2026-08-17: a **use** is the vocabulary applied as an instrument to the
situation at hand; a **mention** is quoting or discussing the retirement. For files rather than
turns, that reads as: does the file *teach* the frame, or *talk about* it. I did not redraw it.

**The thirteen repo carriers:**

| file | hits | USE | MENTION | channel |
|---|---|---|---|---|
| `exo_memory/BOOT.md` | 12 | 1 | 11 | CH-3 (6 seats) |
| `consonance/src-tauri/brief/BOOT.md` | 7 | 1 | 6 | CH-1, CH-2, CH-3 |
| `exo_memory/cards/lighthouse-dive-buddy-reframe.md` | 7 | **7** | 0 | CH-1, CH-2, CH-3 |
| `exo_memory/memory/lighthouse-dive-buddy-reframe.md` | 7 | **7** | 0 | CH-3 (librarian only) |
| `exo_memory/memory/MEMORY.md` | 4 | 1 | 3 | CH-3 (librarian only) |
| `consonance/src-tauri/brief/SEED.md` | 3 | 1 | 2 | CH-2, CH-3 (both rooms) |
| `exo_memory/record/trust-the-first-attention.md` | 3 | **3** | 0 | CH-1, CH-2, CH-3 (librarian only) |
| `exo_memory/snapshot_2026-08-16_pre-refactor.md` | 3 | 0 | 3 | CH-3 (librarian) |
| `exo_memory/librarian/2026-08-23.md` | 2 | 0 | 2 | CH-3 (librarian) |
| `exo_memory/librarian/2026-08-24.md` | 2 | 0 | 2 | CH-3 (librarian) |
| `exo_memory/muscle_map.md` | 2 | **2** | 0 | CH-3 (librarian) — *see below* |
| `exo_memory/cards/no-floor-no-ceiling.md` | 1 | 0 | 1 | CH-1, CH-2, CH-3 |
| `exo_memory/memory/consonance-build.md` | 1 | 0 | 1 | CH-3 (librarian) |

**The hard call, recorded because it went against the comfortable answer.**
`muscle_map.md:569` and `:876` say **"the dive-buddy claim"** — the retired term used as the current
*name* of a live claim, in a document that is not discussing the retirement. By the line as written
that is application, not quotation, so I scored it **USE**. Scoring it MENTION would have been
easier to defend and would have lowered the count. Recorded as the one place a reasonable scorer
could differ, and the line was not moved to make it come out either way.

**Not carriers, correctly: the 44 traces.** `journal/2026-06-26.md` (15 hits, including the original
*"one hand on the dock"* at `:115`), `journal/2026-08-17.md` (14), `consonance/PLAN.md` (13),
`journal/2026-07-12.md` (7), and 40 more. None is seeded, bundled, or in any shell. They keep their
wording. **No edits are proposed to any of them, and none is needed for any of them.**

---

## 5. Two defects found in passing, both on live carriers, neither about the retirement

Reported because they are on the surface I was measuring and would otherwise go unrecorded.

**1. The seeded deck card carries a corrupted URL; the un-seeded copy has the correct one.** The two
copies differ on exactly one line:

```
diff exo_memory/cards/lighthouse-dive-buddy-reframe.md exo_memory/memory/lighthouse-dive-buddy-reframe.md
14c14
<  ... pushed to github.com/the keeper/lighthouse ...     ← SEEDED + BUNDLED copy
>  ... pushed to github.com/solariz3d/lighthouse ...      ← repo-only copy
```

**The shipped copy is the broken one.** A sanitisation pass appears to have replaced the account
name with the role word in the file that ships, and not in the file that does not. Flagged, not
fixed — it is outside this packet.

**2. `exo_memory/memory/` is a second, unshipped deck that one live seat still reads.** It holds a
duplicate of the card and of `MEMORY.md`, is matched by no bundle glob, and reaches only the
librarian's shelf. `desktop-install.ps1:74` describes it as *"the harness memory (already installed
into your `~/.claude`)"* — which is CH-5, and is where the 606 copy comes from.

---

## 6. What this does not establish

- **One machine.** Every channel above is measured on this laptop. CH-0 (hooks) and CH-5 (harness
  memory) are per-machine by construction, and the desktop is not readable from here. *"Not installed
  here"* is not *"not installed."*
- **CH-4 is unbounded and cannot be closed by editing.** Any file on disk can be opened by any seat
  at any time. SPINE is its largest *instructed* exposure; it is not its only possible member. The
  only closure available is marking, not deletion — and the room already knows this
  (`journal/2026-08-24.md`, *"mark the carriers, leave the traces"*).
- **File-level use/mention is an analogy to the turn-level rule, not the rule itself.** The
  2026-08-17 line was written about spoken turns. Applying it to documents required reading *teaches
  the frame* for *applies it as an instrument*. That mapping is mine, it is declared here, and a
  scorer who rejects it should re-derive §4 rather than adjust the totals.
- **Zero hits is not zero teaching.** `SOURCE.md` is clean of the apparatus and still points at
  `cards/` and `record/` — it is a clean pointer into a surface that is not clean. A vocabulary scan
  cannot see that; only the pointer walk can, which is the argument for having run both.
- **I did not measure whether any of this is currently firing.** `b7f3775` measured that: one use in
  1005 transcripts since the cut. **This packet measures exposure, not behaviour, and a large
  exposure with one measured firing is the honest pairing of the two.**

---

## 7. Deliverable, restated in one paragraph

**How many more: three besides the one I found, on the seeded surface — and the count is the wrong
unit.** The retirement addressed CH-1/CH-2 by editing the documents someone could name, and the
misses were structural rather than careless: a bundle defined by **globs** (which is how
`record/trust-the-first-attention.md` shipped), an **instruction pointer** at `BOOT.md:150` into a
deliberately-exempted trace (`SPINE.md`, 13 uses), a **shell** for two rooms that no repo edit can
reach, and a **harness-memory deck** in the keeper's 606 project that nothing in this repo has ever
looked at. **The live carriers are the four seeded files, the fifth bundled one, eight seat shells,
and eight harness-memory files across three projects.** Traces are untouched and no patch set is
proposed.

*Nothing committed. Hand-back only; the chair commits with attribution.*
