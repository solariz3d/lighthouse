# L262, pane P (L): the test install on L of tonight's two builder branches. PREPARATION done; the install waits for the librarian's go

Seat: pane P (L, mount 6e6e002c). This answers the chair's L262 (sent 2026-11-27T08:47:06Z) and packet `exo_memory/loop/packet_t180_test_install_on_L_2026-11-27.md` (room d6ea30ce).
Scratch: this seat's session scratchpad, folder `l262` (`joinmap.js`, `tset.js`, `tset.json`).
This file has two halves: the preparation (§1–§4) now, and the install (§5 onward) after go.

## 0. The answer first (preparation)

- **The librarian's merge-tree check is confirmed** on the pair it read (7b3926e + origin e41acb1): `CHANGELOG.md`, `app/core/coreshell.js` and `app/core/panel.js` merge by themselves, and `MAP.md` conflicts.
- **One addition, on the current local tip of B (e4e7ecc):** a fifth file both branches changed, `app/test/core-xsec-mutation.test.js`, also merges by itself. e4e7ecc is the commit where B's suite ran, and it is ahead of origin. This is not a refusal.
- **The MAP.md conflict is one line,** the `app/core/panel.js` entry, which both branches edited. Each edit is a pure insertion, at a different place in the line. I joined them into one line that keeps both, and a script checks it.
- **Touched set:** all 7 of A's rows, and 9 of B's 11, execute a code file the other branch changed. The two that don't are B's `test/core_extend.test.js` and `test/core_xsec.test.js`. The rule is in §3.
- Nothing was built, installed or pushed. The gate holds until the librarian's go.

## 1. The tips used (from the branch refs, not from A's or B's worktrees)

- checked: `git fetch origin`, then `git rev-parse` gave:
  - `l-bankcarry-a` local **7b3926e** (origin 2067c88): 2067c88, 0023853, 7b3926e on f3cd425;
  - `d677-right-width-b` local **e4e7ecc** (origin e41acb1): e41acb1, e4e7ecc;
  - `origin/landing-1126-batch` f3cd425. There is no local branch of that name.
- checked: `git merge-base --is-ancestor f3cd425 <tip>` → yes for both, and `git merge-base 7b3926e e4e7ecc` → f3cd425.
- A's ±720 completion is not in 7b3926e. inferred: A's tip moves when it lands (the packet says so), so §2 and §3 are redone on the final tips.

## 2. The trial merge

My worktree is `C:\Consonance\t180-wt-p-l262`, detached at f3cd425. I keep it for after go.

| step | result (checked) |
|---|---|
| `git merge-tree --write-tree --name-only --messages 7b3926e e41acb1` (the librarian's pair) | exit 1. Auto-merging CHANGELOG.md, MAP.md, app/core/coreshell.js, app/core/panel.js; **CONFLICT (content) MAP.md**, the only conflict |
| the same on 7b3926e + e4e7ecc (the current tips) | exit 1. The same, plus "Auto-merging app/test/core-xsec-mutation.test.js"; MAP.md is still the only conflict (tree f69c5a64) |
| `git merge --no-ff 7b3926e` on f3cd425 | 395cbf0, clean |
| `git merge --no-ff e4e7ecc` on that | CONFLICT (content) in MAP.md only; the other four shared files auto-merged |
| the MAP.md resolution (`joinmap.js`, which refuses unless the one conflict is two pure insertions into the base line at different places) | B inserts at char 77 of the base line ("right width m" (`widthR`) … D677 (b)); A inserts at char 198 (a typed bank … `headTurns`, `inHeadTurn`, D677). Joined line 2,831 chars; both texts present; CRLF kept |
| committed, detached and on no branch, as **1d4daba** (trial only, not pushed) | its tree differs from merge-tree's f69c5a64 only in `MAP.md`; MAP.md against B's tip is +1/−1 (A's insertion), and against A's tip +5/−5 (B's five lines); one panel.js entry; 0 conflict markers |
| `node --check` of the three auto-merged JS files | ok, ok, ok |

**Where the two sides meet in the shared code** (`git diff -U0` hunk heads):
- `coreshell.js`: A at :53–64 and :914, B at :662. They are apart.
- `panel.js`: the nearest pair is two lines apart. A's :480 is `secThen`, which puts a bank row in the head's own turn. B's :478 is `secUnit`, where `widthR` takes "m". They are separate statements.
  inferred: no overlap in meaning, since `secThen` acts only when `f === 'bank'`. The rows decide it.
- `core-xsec-mutation.test.js`: A at :48, B at :25, both in `MUTATIONS`.

## 3. The touched set

**The rule** (`tset.js`, run on the merged tree):
1. A branch's rows are the test files it added or changed, f3cd425..tip.
2. File X executes file Y when Y is reachable from X by `require()` calls whose argument is a string literal starting `./` or `../`. Paths resolve as Node resolves them, transitively, wherever the call sits.
3. A test file that spawns node and names other `*.test.js` files as literals (the mutation harnesses) also executes those files, transitively. This over-includes by design: a harness counts every file it names.
4. A row is in the touched set when what it executes includes a code file (not a test, not a doc) that the OTHER branch changed.

Code files changed (checked: `git diff --name-only f3cd425 <tip>`):
- A: `app/core/coreshell.js`, `app/core/panel.js`.
- B: `app/core/coreshell.js`, `app/core/panel.js`, `app/core/secondtick.js`, and `src/core/` `adapter.js`, `close.js`, `document.js`, `extend.js`, `piece.js`, `sharp.js`.
- Both: `coreshell.js`, `panel.js`.

**A's rows (7), each executing B's code: all 7 IN.** The hits are of B's 9 code files:
- 9 of 9: `app/test/core-bank-carry.test.js`, `app/test/core-bank-carry-mutation.test.js` (inner: core-bank-carry, core-extra-bank-wind), `app/test/core-extra-bank-wind.test.js`, `app/test/core-pieces-ui.test.js`, `app/test/core-xsec.test.js`, `app/test/core-xsec-mutation.test.js` (inner: core-xsec).
- 7 of 9 (no panel.js, no secondtick.js): `app/test/core-sculpt.test.js`.

**B's rows (11), each executing A's code (coreshell.js, panel.js): 9 IN, 2 out.**
- coreshell.js and panel.js: `app/test/core-right-width-panel.test.js`; `app/test/core-xsec-mutation.test.js`; `test/core_right_width_mutation.test.js` (inner: core_right_width, core-right-width-panel).
- coreshell.js only: `app/test/drag-ghost.test.js`; `test/core_right_width.test.js` (`startLayout`, :16); `test/core_cup_mutation.test.js` (inner: core_cup, core_cup_readers, core_cup_seam); `test/core_xsec_mutation.test.js` (inner: core_xsec, core_xsec_math, validate_xsec, core_xsec_shared).
- panel.js only: `test/core_edgeneg.test.js` (`extendOptions`, :27); `test/core_ramp_mutation.test.js` (13 inner files).
- **out:** `test/core_extend.test.js` and `test/core_xsec.test.js`. checked: their requires are `src/` only, and `src/core` reaches no `app/` file.

**The rule's limits** (checked from the same run):
- Computed `require` paths are not followed. 4 files in the closures have them: `tools/bank-ramp-candidates.cjs` 5, `test/core_fit_banded.test.js` 3, `test/core_joint_c2.test.js` 7, `test/core_xsec_shared.test.js` 4. All 4 sit inside rows already IN, and neither "out" row reaches them. So they cannot change a verdict.
- No row drives a browser page. checked: `grep launchChrome|puppeteer|webSocketDebuggerUrl|index.html` over the 17 distinct row files gives 0, except `core-pieces-ui`, which reads `index.html` as text (:856, :901, :1141).
- One literal does not resolve: `tools/piecewise.cjs:448` requires `./fourier.cjs`, which is not in the tree. checked: `git ls-tree f3cd425 tools/` has no fourier file. It was already there at f3cd425 and sits behind an optional write, so it is not this merge's. A note for whoever owns piecewise.

**For the tier after go** (the packet's "every mutation harness that names a merged file"):
- 14 mutation harnesses name `coreshell.js` or `panel.js`. The match is the literal name, not preceded by a word character, dot or hyphen.
- `app/test/`: core-bank-carry-mutation, core-close-mutation, core-mutation, core-pitgap-mutation, core-xsec-mutation, export-isolated-mutation.
- `test/`: core_chord_mutation, core_cup_mutation, core_early_turn_climb_mutation, core_landing_xsec_mutation, core_ramp_mutation, core_right_width_mutation, core_sharp_mutation, gltf_mutation.
- inferred: this is the costliest part of the tier (`core_xsec_mutation`'s own header says "about twenty minutes"). It runs as one background call under heavy-run, after go.

## 4. Registered before go (so it can fire)

- **Predictions:**
  - the merge on the final tips still conflicts in `MAP.md` alone, and `joinmap.js` still applies;
  - every row of the tier is green with 0 NOT APPLIED;
  - every one of his saved tracks opens and re-saves byte for byte on the merged build;
  - inferred from the packet: none of his tracks today uses a right-side width, so none re-saves as `t180b.core/7`.
- **I stop and say so, installing nothing, if:**
  - any tier row is red, or any mutant is NOT APPLIED;
  - the merge conflicts outside `MAP.md`, or `joinmap.js` refuses;
  - any of his tracks fails to open, or re-saves different;
  - his T-180 app is running (I check, and never close it);
  - a final tip is not the one the go names.
- **Unwelcome outcome, in words that would make it true:** "A's rows go red on the merged tree only." That means the two branches' changes to `panel.js` or `coreshell.js` interact, and green on each branch alone proved nothing about the pair.

## 5. The install (after go)

Not started. The gate is the librarian's go with the two final tips.

## Corrections

- My first draft gave B 12 rows, 10 IN. B changed 11 test files, and 9 are IN: `tset.json` gives A 7 rows, 7 IN, and B 11 rows, 9 IN. Corrected in §0 and §3 before commit.

BASE: C:\Consonance\lighthouse d6ea30ce
SOURCES: exo_memory/loop/packet_t180_test_install_on_L_2026-11-27.md; exo_memory/handback/p-l259-install-P_2026-11-27.md; git fetch / rev-parse / merge-base on the two branches; git merge-tree ×2; git merge ×2 in t180-wt-p-l262; scratch l262/joinmap.js output; git diff --name-only / --numstat / -U0; node --check ×3; scratch l262/tset.js → tset.json; grep for browser use over the row files; git ls-tree f3cd425 tools/
NEXT: librarian rings P "go" with the two final tips when both reads are in and neither is NOT CLEAN on the code; P then redoes §2–§3 on those tips and runs the packet's "Then" 1–6
