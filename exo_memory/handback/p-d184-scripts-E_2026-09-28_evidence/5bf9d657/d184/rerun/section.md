
## RE-RUN · 2026-09-28 06:28–06:32 local, on the fixed files
Worktree: C:\Users\nname\AppData\Local\Temp\b-d184r-wt (detached at 8868531 + 26 files COPIED file by file, NO reparse point). Left in place for the chair.
**GREEN.**
- **G1 is proven fixed:** `reads/` was absent at the start, and the first read did not crash.
- The fresh session reproduced **Serpents at N = 12** and **a sphere's K = 1/R²**.
- Evals: 51/51, 8/8 with none skipped, 11/11, 6/6, 14/14.
- Privacy PASS. E's `reads/` restore is all ignored.

**One lock hold for everything** (`d184/rerun.js`, 12:28:35Z → 12:30:24Z; every node process at `--max-old-space-size=4096`, the
session's children through `NODE_OPTIONS` and the inherited token). Evidence: `d184/rerun/` (`rerun.json`, `copied.sha256`,
`fresh_transcript.jsonl`, `eval_*.txt`).

(Written at 06:3x. The librarian's pointer went out a minute before this section was on disk: my first append failed on a shell
quoting error, and the call in the same turn had already been sent. It is on disk now, unchanged in substance.)

### 1 · The worktree (`git worktree add --detach b-d184r-wt 8868531`)
- **26 files, copied one by one by named path** (`copyFileSync`), with sha256 at copy time in `rerun/copied.sha256`:
  - the 19 under `.claude/skills/track-equations/`;
  - `tools/piecewise.cjs`, `test/piecewise.test.js`, `tools/meshcurv.cjs`, `tools/geodesic.cjs`, `test/m2m3_tools.test.js`;
  - **E's G1 fix: `tools/fourier.cjs` (`12ec191c…`) and `test/fourier.test.js` (`306f233d…`), both TRACKED and modified.**
    - `git diff --stat 8868531` → 2 files, +27 / −1, and nothing but G1: `writeLocal` runs git from the nearest existing folder and
      creates `reads/` only after both checks pass; plus E's two fresh-checkout tests.
    - Read in full: the `mkdirSync` comes after the `check-ignore` and `ls-files` refusals, so a refused write leaves nothing behind.
    - The chair's landing sentence names the tools and their tests; these two are how G1 is fixed, so they land too (flagged).
- **The fixed files match their authors' sha256:** `SKILL.md` `755f3a08…` (A §8), `references/README.md` `847cd5c8…` and
  `evals/checks.js` `07388ac3…` (C §7), `scripts/fit-pieces.cjs` `b76d356c…` (E §10).
- **Only named paths were copied.** The shared checkout's other tracked files are still pre-landing, and none of them came along.

### 2 · THE FRESH SESSION, once (`rerun/fresh_transcript.jsonl`; 14 turns, 1.3 min, $0.48)
- **Given:** the same flags and the same prompt, verbatim, as the first test (§1.1, `d184/fresh_prompt.txt`: the skill, the two
  targets, the AC folder the skill says to ask for, and the limits).
  - Init: model `claude-opus-5-5`, `mcp_servers: []`, `track-equations` present, cwd `b-d184r-wt`.
- **G1's proof:** `rerun.json` `readsAbsentAtStart: true`, asserted by the script BEFORE the session started.
  - Its first read, `scripts/read.cjs "G:/…/serpents_spiral" serpents_spiral` → "closed, 503 stations → reads/serpents_spiral.read.json
    (gitignored)", **EXIT 0**.
  - No `mkdir` by the session; the first run in §1.2 had crashed.
- **Serpents:**
  - `fit-fourier.cjs` → **"serpents_spiral: N 12 (line 12, bank 8)", verdict PASS** (99.0% within 5 m, p95 2.92; 100% within 5°); N = 8
    fails at 79.5%.
  - `fit-pieces.cjs … --tol 5 --curve` → 25 control points (123 DOF), 100% / 100% against the mesh centreline, 0 flagged, not capped;
    25 / 25 / 35 / 46 at 10 / 5 / 2 / 1 m.
  - It reported BOTH N values and named what each counts (G3 fixed).
- **Sphere:** it used C's NEW exports (`meshes`, `params`, `meshCurvature`, `smoothK` from `evals/checks.js`, as `06 §1` directs: G6
  fixed).
  - At the skill's own parameters (R 5, smoothing 1 m, 432 vertices), K̄ 0.040117–0.040157 against 1/R² = 0.04: **worst 0.39%, pass**.
  - Σδ/4π = 1.000000000000 at every R.
  - Its eval run: "a sphere has K = 1/R²" ✔, and mutant K19 (1/R) caught.
- **It no longer tripped over:**
  - G1 (the read);
  - G2 (no lock is named: `grep -rniE "heavy-run|\block\b"` over the skill → 0);
  - G4 (folder names in the table);
  - G8 (it found `evals/` from SKILL.md);
  - G9 (step 8 against the mesh centreline, the baseline against the read line);
  - G10 and G11 (step-named headers; step 1 uses `read.cjs`).
- **What it still had to guess** (its list, 9 items; my classification):

| # | its guess | kind |
|---|---|---|
| 6 | **`fit-pieces` prints no PASS/FAIL**, so it applied the 5 m / 5° / 95% bar itself, and read `lineWithin5: 1` as a fraction | **a GAP (E):** print a verdict beside the shares, as `fit-fourier` does |
| 7 | why 25 control points store 123 numbers | small gap (A/E): SKILL.md says "compare in DOF" but not the formula; `piecewise.cjs:356` has it |
| 4 | whether to pass `--tol 5` | trivial: the default is 5 |
| 1, 2, 3 | "Serpents" → `serpents_spiral`; no layout; no length or width hint | resolved by the skill's table; nothing needed |
| 5 | which N is "its N" | answered by SKILL.md (G3); it reported both correctly |
| 8 | what "show" means; it added its own R-scaling rows at 0.2·R | its own extension, labelled as its own; not the skill's |
| 9 | ran the regressions with 7 reads absent | the evals' SKIPPED path, working as designed |

- **Also seen:** the report JSON still prints `"method": "p-d184-scripts-E §1"` (and `p-m4-equations-E §1` from fit-fourier), a
  hand-back name in a public tool's output. Cosmetic, and E's; not a privacy leak.

### 3 · THE EVALS once more (`rerun.json` → `evals`, each run on its own, spec reporter)
| eval | tests | pass | fail | skipped | exit |
|---|---|---|---|---|---|
| known-answer + mutation (C; C's new export test makes it 51) | 51 | 51 | 0 | 0 | 0 |
| regressions (E), alone, with plain copies of the 7 other reads made AFTER the session | 8 | 8 | 0 | 0 | 0 |
| `test/piecewise.test.js` | 11 | 11 | 0 | 0 | 0 |
| `test/m2m3_tools.test.js` | 6 | 6 | 0 | 0 | 0 |
| `test/fourier.test.js` (E's two G1 tests included) | 14 | 14 | 0 | 0 | 0 |

The session's own eval run, with only its Serpents read present, was **59 tests: 52 pass, 0 fail, 7 SKIPPED**, each skip named
"reads/<name>.read.json is not on this machine". That is the SKIPPED path again.

### 4 · PRIVACY and the landing list
- **E's `reads/` restore is LOCAL and ignored** (shared checkout):
  - 52 files: 34 reads, **13 `*.equation.json`**, and the 4 others (`corpus.draft.json`, `corpus.next.json`, `corpus.runs.json`,
    `m1.json`);
  - `git check-ignore -q reads/<each>` → **0 not ignored**;
  - `git status -- reads` → nothing;
  - `git log --all -- reads` → never tracked.
  - **None of it is in the landing.** The 4 files from §7(2) are now back.
- **The 26 files:**
  - placeholders 0;
  - runs of ≥ 20 numbers (a coefficient list) 0;
  - personal paths, user name or e-mail 0;
  - `SKILL.md` room words 0;
  - no new dependency (no `package.json` change; every require is a node built-in or a repo file).
- **The one NOTE from the first read stands:** the short verbatim WANG08 sentence in `references/04` and `MATH_SOURCES`.
- **The landing list (26):**
```
.claude/skills/track-equations/SKILL.md
.claude/skills/track-equations/evals/checks.js
.claude/skills/track-equations/evals/known_answers.test.js
.claude/skills/track-equations/evals/mathref.cjs
.claude/skills/track-equations/evals/mutation.test.js
.claude/skills/track-equations/evals/regressions.test.js
.claude/skills/track-equations/references/01_centreline.md
.claude/skills/track-equations/references/02_curvature.md
.claude/skills/track-equations/references/03_bsplines.md
.claude/skills/track-equations/references/04_joints_closure.md
.claude/skills/track-equations/references/05_flight.md
.claude/skills/track-equations/references/06_surfaces.md
.claude/skills/track-equations/references/07_fourier.md
.claude/skills/track-equations/references/08_what_failed.md
.claude/skills/track-equations/references/MATH_SOURCES.md
.claude/skills/track-equations/references/README.md
.claude/skills/track-equations/scripts/fit-fourier.cjs
.claude/skills/track-equations/scripts/fit-pieces.cjs
.claude/skills/track-equations/scripts/read.cjs
tools/piecewise.cjs
test/piecewise.test.js
tools/meshcurv.cjs        (carries the parked M2b code; required by evals/checks.js)
tools/geodesic.cjs        (carries the parked M2b code; required by tools/meshcurv.cjs)
test/m2m3_tools.test.js   (the two tools' own test)
tools/fourier.cjs         (E's G1 fix; tracked, modified)
test/fourier.test.js      (E's G1 tests; tracked, modified)
```
- **No CHANGELOG entry yet.** E's (§9, and §10's "Fixed" line) is ready to paste. The chair's call.

### 5 · NO REPARSE POINTS
In `b-d184r-wt`:
- `find -type l` → **(none)**;
- `cmd /c dir /AL /S /B` → **"File Not Found"** (exit 1: no reparse point anywhere under it).

Its `reads/` holds plain copies (8 reads, all ignored). The earlier `b-d184-wt` also checks clean on both (0 links, "File Not
Found"), so either can be removed safely. `git worktree list` shows both.
