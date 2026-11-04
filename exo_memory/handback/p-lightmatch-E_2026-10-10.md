# p-lightmatch-E · D288 F1: the light SOURCES matcher matches what a command opened, not its text · pane E, on D, 2026-10-10 · DONE

The finding: `exo_memory/handback/p-hermetichooks-B_2026-10-10.md`, F1 (and F3). **Result: lighthouse `f744a715` + `cdbf2315` + `811f98a7`, branch `d288-e`,
worktree `G:\worktrees\e-d288-wt`, REBASED onto `d287-e2` (`90687cf4`) so the shared baseline file does not conflict: land d287-e2, then d288-e fast-forwards.**
Not pushed; tree clean. Evidence in my scratchpad `d288/`; every run under the heavy-run lock through main's `heavy-run.js`. Only `consonance/hooks/sources-gate.js`
changed among the hooks: the shared matcher lives there, `reply-slot.js` only calls `itemMatches`, so it is untouched and gets the fix.

## The three cases, each with what the record says
**1. Too loose — CONFIRMED and fixed.** `lightMatch`'s `light-command` rule was `cmd.includes(itemC)` over the command's WHOLE text, so a path matched its own
`echo`, `printf`, `ls`, `stat` or a comment line. The rule now matches only a SEGMENT that opens something (the segment filter strict already uses: never a
PRINTERS or METADATA leader, now never a `#` line either), or the whole chain (a cited command that ran is what was run). With segments filtered, **a bare path
is matched in light only where strict's own tail rule matches it too**. Strict is unchanged.

**2. Too strict, ring `2eb8b2bdd226` — the diagnosis was wrong, and the fix it suggested is not needed.** I replayed the librarian's turn through the gate's own
`isPrompt`/`turnCalls` (`d288/ringcalls.js`, reading the librarian's transcript to the ring's time). The `grep -n … consonance/tools/js-suite.js` ran inside ONE
Bash call that also ran `git check-ignore -v exo_memory/handback/x_evidence/a.test.js` last; that exited 1, so Claude Code recorded the call `is_error: true`,
and `turnCalls` drops errored calls by design ("a failed call … does not count", already in the deny text). **The relative path was never the problem:** a row
shows the same relative grep after `cd` matching the absolute item in BOTH modes when the call completes (it was already green on the unfixed matcher), and a
second row reproduces the real cause (the same call `is_error`) refused in both modes. Not changed: counting an errored call would also count `cat missing.md`.

**3. Ring `8c05ad8a07ca` — BY DESIGN.** The turn's calls are one `Read` of B's hand-back and one Bash append; A's hand-back
(`p-evidenceskip-A_2026-10-10.md`) was read in an EARLIER turn. The gate is turn-scoped in both modes (the D212 rule and its deny text say so), and light was
ruled as "what was actually run or fetched", not "what this lap read". Re-reading in the turn is the documented fix.

## The suggested fix, argued
- **"Resolve relative paths against the segment's cwd":** not needed. Strict's tail rule already matches `consonance/tools/js-suite.js` after a `cd`, which row 2
  shows. Resolving would also TIGHTEN strict, which the packet keeps unchanged.
- **"Count only read verbs":** declined. It changes strict, and strict is right that `node tools/x.js C:/work/a.md` reads the file (a row pins that).
- **"Apply the command-text rule only to an item that is a command":** I built it (`isCommandItem`) and the mutants showed it did nothing. Its four mutants
  survived, EQUIVALENT once the segments are filtered: any bare-path match light could make, strict's looser tail rule already makes. So it is not in the
  final code. The segment filter is the whole fix (its mutants are caught).

## F3 — by design
`reply-slot.js:238`, D220: "block only AFTER the row is on disk". The rule exists so no reply is ever BLOCKED without an auditable record. A light warning blocks
nothing; the stop proceeds either way, so fail-open holds. One consequence, to know when the light week is scored: with an unwritable ledger the warning is shown
but not counted, so the warning count can only UNDERcount.

## Rows (B's home pinning untouched; mine call `decide` in-process with the mode, so they test the matcher)
- `sources-gate.test.js`, D288: (1) echo / printf / ls / stat / a comment / Write-Host refused, both modes; (2) a command item matched only by a segment that
  ran it: refused when only echoed or only in a comment, allowed when run, the quoted cd-chain still allowed, and a cited `ls` that ran allowed in light while
  strict still refuses it; (3) the relative grep after `cd` allowed, both modes; (4) the real cause (is_error) refused, both modes; (5) strict unchanged.
- `reply-slot.test.js`, D288: in light the reply slot, through the same matcher, still warns on a path only ls'd or echoed, and passes a command that ran.
- The two rows that cite the librarian's case use `C:\Users\n\lighthouse`, the suite's own convention, not a real username.

## Measured
| run | result | sha256 |
|---|---|---|
| D288 rows, unfixed matcher | the 2 too-loose rows red; 3 green, including the relative grep (the diagnosis) (`red.tap`) | `ccf3bd5cc5ec136d…` |
| the reply-slot row on `57ef433d` | red (`rs-red.tap`) | `f3d8c1d13426a133…` |
| sources-gate + reply-slot + gate-mode on the fix | 108/108 (`green3.tap`) | `a3a4f45ae0eab139…` |
| mutants, round 1 (8 light rows, isCommandItem in) | 88 applied · 83 caught · 5 survived (4 equivalent, 1 needed a row) (`sgmut.txt`) | `e77483545c096000…` |
| **mutants, final (5 light rows)** | **control 64/0; 85 applied · 85 caught · 0 survived · 0 NOT APPLIED** (`sgmut3.txt`) | `e03c7a3100f6fb57…` |
| **portable-paths on `811f98a7`** | **green, 379 files in scope, 449 known sites, 0 new** (`pp3.txt`) | `84effbaa663abd39…` |
| carrier-drift | GREEN | — |
| **final, committed tree:** sources-gate, reply-slot, gate-mode, portable-paths.test, janitor | **168/168** (`final.tap`) | `6541ab8a9af49ded…` |

**How the mutants were run:** `sources-gate.mutants.js` is A's this lap and its control is red on main (B's F2: no `scratch.js` in its tree). I generated an UNTRACKED copy
beside it (`d288/mk-sgmut.js`): the same 80 rows, `scratch.js` added to its tree, my light rows appended. Run, then deleted (`git status` clean after). **The 5
light rows belong in the tracked harness once A's copy-list fix lands;** they are in `mk-sgmut.js`, ready to paste.

## Baseline, read
11 BENIGN-TEST sites, all the new rows' fakes (9 in sources-gate.test.js, 2 in reply-slot.test.js), BENIGN-TEST 369 → 380, no other row touched. Before them,
two rows carried a real username path; changed to `C:\Users\n\lighthouse` first.

## Corrections to myself
- The packet's diagnosis of ring 2eb8b2bdd226 was B's and the librarian's; my first plan followed it too. The replay of the transcript corrected it.
- I built `isCommandItem` before the mutants showed it was redundant; removed.
- The key scan flagged `sources-gate.js`: its own SECRET_SHAPES patterns, present on the base. No key was added.

NEXT: librarian collate D288 F1 (land d287-e2 first, then d288-e) and route the 5 light mutant rows to A, when this hand-back is read

---

## D288-e2 follow-up (2026-10-11 ~01:4x): the combined tree, mutation-tested
The chair's packet: A's F2 harness fix (`3e428c28`) and my three F1 commits (`1e1ee0e6`, `efd00909`, `1bd8610c`) are on main `0a958b02`, but A ran the harnesses
BEFORE my matcher change, reply-slot #43 was NOT APPLIED, and the 5 light rows were untracked. **Result: lighthouse `78fabb7b` on `0a958b02`, branch `d288-e2`,
worktree `G:\worktrees\e-d288e2-wt`. Not pushed; tree clean.** Two files: `consonance/tools/sources-gate.mutants.js`, `consonance/tools/reply-slot.mutants.js`.
No survivor, so `sources-gate.js` and its test were not touched.

- **The 5 light rows** (from `d288/mk-sgmut.js`, unchanged) are in `sources-gate.mutants.js`, under a `light mode` heading before the registration rows.
- **reply-slot #43** ("pane ring: main does not pass the seat to the verdict") was NOT APPLIED because its anchor `"live: !SHADOW, seat });"` no longer occurs: the
  verdict call at `reply-slot.js:235` gained `gates` (D273) and `mode` (D277 part 2, mine) after `seat`. Re-anchored on `"live: !SHADOW, seat, gates:"` →
  `"live: !SHADOW, gates:"`. It still removes ONLY the seat; the other arguments are untouched, so it tests the same thing.
- **Anchors checked before any run** with `d288e2/anchors.js`, which loads each harness without its `main()` and counts every anchor in the file it mutates exactly as the
  harness does: reply-slot 59 rows, 1 not applied before the re-anchor, **0 after**; sources-gate **85 rows, 0**.

| harness (on the committed tree `78fabb7b`) | control | applied | caught | survived | NOT APPLIED | sha256 |
|---|---|---|---|---|---|---|
| `sources-gate.mutants.js` | pass 64 / fail 0 | 85 | **85** | **0** | **0** | `sgmut.txt` `aeb289bc4ffa7298…` |
| `reply-slot.mutants.js` | pass 38 / fail 0 | 59 | **59** | **0** | **0** | `rsmut.txt` `2248f28ed40b3522…` |

Both harnesses took the heavy-run lock themselves (their own `hold()`); this worktree is past `9807cd1b`, so its copy is the two-slot `heavy-run.js`.
Evidence in my scratchpad `d288e2/`.

NEXT: librarian collate D288-e2 (both harnesses 0 survived, 0 not applied on the combined tree), when this addendum is read
