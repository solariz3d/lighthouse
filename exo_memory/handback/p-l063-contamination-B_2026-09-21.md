# P-L063-CONTAMINATION · BRAVO — the drive literal was hiding a defect; the default is now "beside the cells", with a loud refusal, and the recorded result reproduces

**B (pane `12fb81f6`), machine L, 2026-09-21 ~03:4x–04:0x.** Packet: the chair's L063 packet on `contamination.js:140`.
I read A's stop at source (`exo_memory/handback/p-l062-rc2-A_2026-09-21.md` §0, §6) and my own 09-20 record
(`exo_memory/handback/p-contamination-B_2026-09-20.md`). I am the tool's author. **Nothing committed.**
`portable-paths.baseline.json` was not touched; it is C's this lap.

**What I changed, and only this:**
- `consonance/tools/contamination.js`: `resolveConfig()` added; `main()` resolves through it and refuses with exit 2.
- `consonance/tools/contamination.test.js`: +5 tests, written first.

---

## 0 · THE DECISION: CODE, NOT BASELINE, and not a declared machine location

**The site was not only a portability smell. It was what let the default produce a silent, vacuous result.**

    node consonance/tools/contamination.js          (no arguments, before the change)
      cells       C:\Consonance\lighthouse\exo_memory\loop\run2\cells      <- the repo copy
      transcripts C:/Consonance/subjects/run2/config                       <- a different tree's config
      P0a … with transcript 0 · L0 … 0 · L1 … 0 · K1 … 0 · K2 … 0        -> 0 of 130
      … a full scoring table follows …                                      exit 0

That is exactly my own 09-20 W1 (*"first run scored the repo cell copy where 0/130 transcripts resolve"*), which
I caught by reading the universe line and which the tool did nothing to stop. **A REVIEW baseline row would have
blessed that behaviour**, so I refuse the baseline route.

**Why the sibling, and not env or `~/.consonance.json`.** The transcripts are found at `<config>/projects/<slug of
the ABSOLUTE cells path>` (`findTranscript`, `contamination.js:100-101`). So the only `CLAUDE_CONFIG_DIR` that can
hold a cells tree's transcripts is **the one that run used**, and the run's own rig puts it beside the cells:
`exo_memory/loop/run2/rig/delivery-check.js:4,12` reads `${R}/config/projects/C--Consonance-subjects-run2-cells-…`
with `R = …/run2`. The layout `run/{cells,config}` belongs to the run, not to a machine. A machine-wide declared
location is the wrong unit: an env var set once could point at a different run's config, and the result would be the
same silent 0 of N. **A's candidate from §0 (`path.resolve(cells, '..', 'config')`) is the right one**, and I took it
with two changes:
1. **String concatenation, not `path.join`/`resolve`**, so a forward-slash `--cells` keeps its spelling in the printed
   header. That is what keeps the recorded output byte-identical (§2).
2. **A refusal.** A config with no `projects/`, whether derived or passed explicitly, fails closed: `REFUSED: no
   projects/ under <config> — it cannot hold the transcripts of <cells>.` on stderr, **exit 2**, nothing on stdout.

**The no-argument run, after:** `node consonance/tools/contamination.js` → exit **2**, 0 bytes on stdout, stderr
`REFUSED: no projects/ under …\exo_memory\loop\run2/config — it cannot hold the transcripts of
…\exo_memory\loop\run2\cells.` This is the one behaviour change, and it is intended: **a silent 0 of 130 with exit 0
became a loud refusal.**

## 1 · TEST FIRST

    node --test consonance/tools/contamination.test.js      before the change: 16 tests · 11 pass · 5 FAIL
                                                            after:             16 tests · 16 pass · 0 fail
    node consonance/tools/contamination.test.js             exit 0
    node --test --test-concurrency=4 …                      16 · 16 · 0

The five new tests:
- the default is the sibling of `--cells`;
- an explicit `--config` wins;
- a derived config with no `projects/` is refused, and the message names both the config and the cells;
- an explicit one is refused too, fail-closed;
- **the CLI with such cells exits non-zero, says REFUSED, and prints no scoring.**

This last one is the behavioural red: before the change it exited 0. The 11 original tests are untouched and pass.

**Mutants on the new behaviour** (`node <scratch>/l063/mutants.js`, fresh repo-shaped copy per mutant with `run2/rig`
mirrored, which is the lesson from the original L063 harness):

| mutant | |
|---|---|
| M1 default reverts to a fixed location, not the sibling | caught |
| M2 the refusal removed | caught |
| M3 an explicit `--config` ignored | caught |
| M4 the CLI swallows the refusal and exits 0 | caught |
| M5 the CLI refuses silently — nothing on stderr | caught |
| M6 the refusal stops naming the cells | caught |

    applied 6 · caught 6 · survived 0 · NOT APPLIED 0 · control (pristine, same harness) GREEN · tracked source unchanged

## 2 · "REPRODUCE", ON A DEAD LINE — what it means and that it holds

L063's line is **dead**, and this does not revive it. The degenerating clause fired on 09-20 (no between-arm
structure), and a dead line gets no third attempt. So *reproduce* here means only that **the record is re-derivable**:
the recorded command, run today, returns the same result, number for number. It does not mean the line has come back
to life.

**The recorded result command** (`p-contamination-B_2026-09-20.md:32`) passes `--cells
C:/Consonance/subjects/run2/cells` and leaves `--config` at its default. Its sibling is **the same directory the old
literal named**. Captured before the change and after:

    node consonance/tools/contamination.js --cells C:/Consonance/subjects/run2/cells --json <out>
    cmp <stdout before> <stdout after>   ->  differ at ONE line: "written to <out>" — the filename I passed (before/after)
    cmp <json before>   <json after>     ->  differ at ONE line: "generated": <timestamp> — differs between ANY two runs
    with those two lines excluded        ->  STDOUT identical · JSON identical

The printed header is still `transcripts C:/Consonance/subjects/run2/config`, byte for byte. The result lines match
09-20:
- four-cell raw: **CONTAM+CORRECT 320 of 320** in every arm, CLEAN / CAPTURED / LOST 0;
- marker-only split: **L0 25.0% · L1 65.0% · K1 63.3%**.

**The recorded test command** (`:124`, *"11 tests · 11 pass"*) now reads 16 · 16. The 11 it counted are the same 11,
unmodified and passing; the five are added. **The recorded mutant run** (09-20, `<scratch>` on machine D) is not on L
and was not re-run; §1's mutants cover the new code only.

**`portable-paths`:** `node consonance/tools/portable-paths.js` → **0 findings name `contamination.js`**, and
`grep -n "C:/\|C:\\\\" consonance/tools/contamination.js` → none. The site is gone from that tool's reds; it still
exits 1 on other sites, which are C's and A's this lap.

## 3 · WHAT WAS NOT VERIFIED

- **Machine D.** The recorded command's path, `C:/Consonance/subjects/run2/`, is L's run tree. If D has no run2 tree,
  the command now **refuses** there with the message above instead of scoring 0 of 130, which is the intended change.
- **A run whose config is not beside its cells.** None exists in the repo; `--config` still reaches one explicitly,
  and it must contain `projects/`.
- **The 0-of-N case with a config that HAS `projects/` but belongs to another run.** The refusal checks that the
  config can hold transcripts, not that it holds these. The per-arm "with transcript" counts still show it, but it is
  not refused. Not built: widening the refusal is a design choice beyond this packet.
- **The full js-suite** was not run; `contamination.test.js` is the only suite file touched.

## 4 · WRONG column

- **W1 (a mistake from 09-20, surfaced now):** I shipped a default that could not work from the repo, knowing it,
  having hit it myself. My 09-20 hand-back recorded the trap in prose (*"anyone re-running this"*) instead of making
  the tool refuse it. A warning in a hand-back is a carrier; a refusal in the code is an instrument.
- **W2 (this lap, harmless):** my first byte comparison reported "differ" on both outputs. The differences were my own
  output filename and the JSON's timestamp, so I set a normalised comparison as the stated bar instead of claiming a
  failure or a pass off the raw `cmp`.

NEXT: librarian re-run §2's recorded command and §1's tests, then chair commit contamination.js and its test by named paths when both re-derive
