# A universe print does not fix a wrong universe — it documents one

**Seat:** pane E, non-author adversarial pass. **Date:** 2026-08-25, ~02:00–02:50 local (08:00–08:50Z).
**Packet:** attack the corpus rules — the denominators — behind P-CH4 (B), P-CH5 (C) and P-UNIVERSE (A).
**Objects read:** `exo_memory/librarian/2026-08-25.md` ~01:55 (Q1–Q4 and the work-shape);
`exo_memory/loop/carrier_surface_2026-08-25.md` (`9f4f888`); `consonance/tools/carrier-drift.js`;
`consonance/tools/open-items.js`; `dev/shell/install.ps1`; `consonance/src-tauri/tauri.conf.json`.

**My bias, declared:** the chair asked to be hit and said it wants the class to be real. Both are stakes
I could serve by manufacturing a hit. Two of my four attacks failed and are reported as failures (§2, §5),
and my single strongest finding against B turned out to have been made by B first, independently, with
identical numbers — reported that way in §2 rather than claimed.

**A standing hazard for every figure below.** The tree was DIRTY while I measured, with three panes
writing into it: `consonance/tools/carrier-drift.js` + `.registry.json` (B), `consonance/tools/open-items.js`
and `dev/shell/install.ps1` (A), `consonance/tools/memory-sweep.js` + test (C), all uncommitted at
`67bdbd0`. **Every figure states which state it came from.** The librarian's own moving-figure rule from
tonight applies with force: cite the command, never the figure.

---

## 0. Verdict

| target | attack | outcome |
|---|---|---|
| **A · P-UNIVERSE** | the universe line can be false the same way a green can | **CONFIRMED, live, right now** — §1 |
| **B · P-CH4** | the freeze cuts the denominator 204 -> 29 (`node ch4.js`) | **CONFIRMED — and B found it first, same numbers** — §2 |
| **C · P-CH5** | the glob's shape leaks | **FAILED** — 0 nested, 0 non-.md; and C had already landed the residue — §3 |
| **carrier-drift's own print** | it reports 29 skips over 460 | **CONFIRMED**, with a shipped carrier as the demonstration — §4 |
| **the shells outside the repo** | 21 stale carriers nobody scans | **FAILED** — they predate the withdrawal; they are traces — §5 |
| **the class itself** | is it one thing? | **one shape, TWO species — and the registration covers one** — §6 |

---

## 1. A · THE HIT: `open-items` now prints a universe line that is false, and BUILDING.md is drifted behind it

**The live output** (working tree, A's retrofit in flight — `node consonance/tools/open-items.js`):

```
  OPEN    the briefs a fresh room reads match the repo
          COMMITTEE, LIBRARIAN differ from the built copy (5 compared) — a fresh spawn reads the STALE one until a rebuild
          universe: 5 seen · 0 skipped · the 5 brief names a spawn can read, compared repo vs
                    C:\build\lighthouse-target\release; a name is SKIPPED when either side is
                    unreadable — never silently dropped
```

**"the 5 brief names a spawn can read" is not a limitation notice. It is a false statement about the
world.** `tauri.conf.json` bundles **14 resource entries**, four of them directory globs. Resolved
against the build directory, the surface a spawn can read is **25 documents** — and three of them are
drifted, not two (`node briefdrift3.js`):

```
  COMMITTEE.md    DRIFTED  [open-items]
  BUILDING.md     DRIFTED  <- OUTSIDE open-items
  LIBRARIAN.md    DRIFTED  [open-items]

shipped documents in the bundle surface: 25
compared by open-items:                  5
DRIFTED:                                 3  ["COMMITTEE.md","BUILDING.md","LIBRARIAN.md"]
in repo but absent from the build:       0
```

**`BUILDING.md` is bundled** (`tauri.conf.json:36`, `"brief/BUILDING.md": "BUILDING.md"`), **is read by a
spawn** (`main.rs:4190`, `room_brief("BUILDING.md")`), **is drifted right now**, and **is outside the five
names** — unchanged in both HEAD and A's working copy (`grep -n "const names = \[" consonance/tools/open-items.js`
→ `['SEED','BOOT','BASE_JOURNAL','COMMITTEE','LIBRARIAN']`, identical at `git show HEAD:...`).

**And BUILDING.md is the file this cycle is about.** It carries the two-turn dispatch rule (`3bdcb47`)
and the impossibility claim killed at `20c46c0`. A room spawned from the current build reads the
pre-correction copy, and the room's own instrument reports the brief surface as checked.

### The mechanical defect, and it generalises past this one item

**`0 skipped` is arithmetically correct and epistemically worthless.** The skip counter counts skips
*relative to the instrument's own list*. Twenty of twenty-five shipped documents were never candidates,
so they cannot be skipped — they are not in the space the counter ranges over. The clause *"never
silently dropped"* is true of the five and says nothing about the twenty.

> **A universe print computed from the instrument's own hardcoded list can only ever report skips
> against that list. The omission is structurally invisible to it — and the print makes the wrong
> denominator look audited.** That is the Q3 class surviving its own registration.

**The rule, for A to take or leave (the change is A's):** *the universe must be enumerated from an
authority outside the instrument.* For this item that authority exists and is one line away — the
bundle's own `resources` map, or a listing of `releaseDir()`. Enumerate from it, and the line reads
`25 seen · 0 skipped` with three drifted named.

### And this is the gap in A's own bar, which is otherwise the right bar

`consonance/tools/universe-print.test.js` (untracked, in flight) states the bar correctly and harder
than the librarian did: *"A DELIBERATELY-HIDDEN ITEM MUST APPEAR IN THE SKIPPED COUNT, with the rule
that skipped it. Silence about a shrunken denominator is the defect."* It then exercises that on the
artifact-tier item by planting **a corrupt ledger line** — an item inside a universe enumerated from an
external authority, where a hidden item *has a slot to be reported in*.

**Applied to the brief item, the same test cannot pass, and cannot fail either.** There is no slot: an
item outside the five names is not skipped, it is absent, and absence has no counter. **The
deliberately-hidden item already exists — `BUILDING.md`, bundled, drifted — and it appears nowhere in
the output.** The bar is satisfiable by the items that least need it and silently inapplicable to the
one that does.

**Where the print is already right, credit stated:** the other three items enumerate from an external
authority (a ledger file's lines, two named paths, `vantage_findings.jsonl`) and their counts hold.
`sourced_ledger.jsonl` reporting `369 seen · 326 skipped · 0 unparseable` is the shape that works, and
`install.ps1 -Check`'s in-flight block is the best version in the repo — it names the manifest as *"the
denominator; a file absent from it is INVISIBLE, not green"* and reports UNMANAGED / PATH-MISMATCH /
UNCLAIMED in both directions. **The defect is one item, not the retrofit.**

---

## 2. B · CH-4: confirmed, and B got there first with the same numbers

I built the closed universe from the librarian's Q2 rule as written — four seeded dirs + the briefs +
both roots + the three files `BOOT.md:150` points at — and measured what freezing the corpus to it
would cost (`node ch4.js`, HEAD registry):

```
carrier-drift corpus TODAY (repo .md minus traces): 204
proposed frozen closed universe:                     29
carriers that would LEAVE the denominator:           175

registered sites INSIDE the frozen universe:  3
registered sites OUTSIDE it:                 14
   3  exo_memory/librarian/2026-08-23.md
   2  exo_memory/TRAINING.md
   2  exo_memory/convergence_2026-07-28_methodology.md
   2  exo_memory/handback/carrier-drift_2026-08-24.md
   2  exo_memory/loop/lap_2026-08-23.md
   2  exo_memory/loop/trigger_index_objections.md
   1  exo_memory/loop/handoff_2026-08-23.md
```

**`exo_memory/loop/lap_2026-08-23.md` — the re-assertion the instrument was built for — falls outside.**
So does `TRAINING.md`, named in `carrier-drift.js`'s own header as one of the seven carriers, and
excluded for a precise reason: its only appearance in either root is `BOOT.md:74`, inside a dated
amendment, i.e. a **citation-pointer**, which the rule excludes by design (`grep -n "TRAINING" exo_memory/BOOT.md exo_memory/SOURCE.md`).

**AND B HAD ALREADY FOUND IT.** B's in-flight `carrier-drift.js` header (`git diff consonance/tools/carrier-drift.js`)
states:

```
//   registered site FILES  9 · inside the CH-4 set  2 · OUTSIDE  7
//   registered SITES lost if the corpus were narrowed to CH-4:  14 of 17
//
// Among the fourteen is `loop/lap_2026-08-23.md` — THE re-assertion, the event this instrument
// was built for. ... So: the scanned corpus stays repo-wide minus traces, and CH-4 rides along
// as a flag on findings and a line in the universe print.
```

**14 of 17 sites, 2 files in, 7 out (`node ch4.js`) — identical to mine, derived from a different construction** (B's
mechanical instruction-verb walk; my seeded-dirs-plus-briefs reading of the same rule). Two
independent extractions agreeing on the exact split is confirmation that the number is a property of
the corpus and not of either method. **This is corroboration, not my catch, and it is stated that way.**

### What I can add: the re-walk trigger was stale by construction, and B has already removed it

The librarian's Q2 proposed *"the walker re-run on any commit that touches BOOT/SOURCE."* I tested six
closed-universe files against the commit that ADDED each:

```
exo_memory/cards/earned-not-performed.md        added=be81502  roots_touched=0
exo_memory/cards/no-floor-no-ceiling.md         added=5dbee6e  roots_touched=0
exo_memory/cards/never-pathologize-the-user.md  added=87c2701  roots_touched=0
exo_memory/record/trust-the-first-attention.md  added=56adc69  roots_touched=0
consonance/src-tauri/brief/LIBRARIAN.md         added=922433a  roots_touched=0
consonance/src-tauri/brief/BUILDING.md          added=5baf576  roots_touched=0
```

**Six of six entered in commits touching neither root.** The trigger would never have fired for any of
them. B's in-flight version replaces it — *"re-walked every run … which removes staleness as a failure
mode entirely instead of trading against it"* — and adds `CH4-DRIFT` when the registered list and the
live walk disagree. **The defect is real and the fix is already in the working tree.**

**One residue worth a line:** my derivation of the stated rule gives **29** files where B reports **31**.
Both cannot be right, and neither number is load-bearing for the finding. It is worth someone reconciling
before the frozen list is registered as the expectation, because *the registered expectation is the thing
`CH4-DRIFT` will fire against.*

---

## 3. C · CH-5: the glob attack FAILED, and here is what I tried

The rule under attack: `~/.claude/projects/*/memory/*.md`. Three ways a glob of that shape leaks —
nesting, non-`.md` files, and path-encoding — measured (`node surfaces.js`):

```
project dirs: 99 | with a memory/ dir: 88 | of those EMPTY: 81
REACHED by the glob:            44
MISSED, .md nested deeper:      0
MISSED, non-.md in memory/:     0
```

**Zero and zero.** On this machine the harness writes memory flat and `.md`-only, so the glob is exact.
I also checked whether reporting *paths* leaks under the room's public-repo privacy law, since every path
encodes the home directory: `git grep -l "zackn" | wc -l` → **54 tracked files already carry it**. That
is settled practice, not a new violation, and raising it would have been a manufactured hit.

**The residue, and it is real but small: the NAME is broader than the RULE.** CH-5 is titled *"HARNESS
MEMORY — loaded into context every session."* The harness also loads, into every session:

- **`C:\Users\zackn\.claude\CLAUDE.md`** — 7,479 bytes (`node surfaces.js`), every project on the machine, outside the glob.
  **Checked and clean** of the retired apparatus and the withdrawn wording, so this is a surface gap with
  no current hit.
- **each project's own `CLAUDE.md`** — which for Consonance seats is the shell, i.e. B's CH-3. Overlap,
  not a gap.

**The one change worth making — AND C HAD ALREADY MADE IT.** I was going to say the print should read
`88 dirs seen · 81 empty · 44 files` (`node surfaces.js`) rather than a bare file count, because 81 empty dirs are the
difference between *"the sweep found little"* and *"there is little to find."* `ch5_memory_sweep_2026-08-25.md`
(landed while I was measuring) already prints exactly that:

```
UNIVERSE  99 project dirs seen · 88 with a memory/ · 44 .md files scanned · 0 skipped
  note:   81 of the 88 memory dirs are EMPTY
```

and goes further than I did — it separates the three nouns the brief had conflated (*99 dirs*, *88 with a
memory/*, *7 that actually carry*), keeps the empty dirs **in** the denominator rather than filtering them
out, and registers the falsifier I would have proposed: *"the universe dies if a memory file exists outside
`~/.claude/projects/*/memory/*.md`."* **Second independent convergence of the night. Nothing owed here.**

---

## 4. carrier-drift's own universe line accounts for 29 skips out of 460

The instrument held up as already compliant prints (HEAD, `node consonance/tools/carrier-drift.js`):

```
  corpus: 204 carriers · 29 traces skipped (exo_memory/journal/, dreams/, attic/, dev/one-shot/)
```

Measured over the same tree with the same `SKIP_DIRS` (`node nonmd.js`):

```
files the walk touches:      664
  .md:                       233  (carriers 204 / traces 29)
  NOT .md — dropped silently: 431
the line accounts for 29 skips; the real skip count is 460
```

**The `.md` filter drops 431 files (`node nonmd.js`) and the universe line never mentions them.** In fairness the tool's
`WHAT THIS CANNOT SEE` block does say *"It reads .md only"* — so the limit is disclosed in prose while
the **number** excludes it. That gap is the whole Q3 class in miniature: a disclosed limitation and an
undisclosed denominator are not the same thing, and only one of them survives being quoted.

**The demonstration — a file that exists, is shipped, and is missed:**

```
grep -n -i "lifeguard" consonance/ui/index.html
  322:            <h2>The governing stance: light, not lifeguard</h2>
  357:              <dt>Light, not lifeguard</dt><dd>The governing stance: measure and surface, …</dd>
```

`consonance/ui/index.html` is the app's frontend (`tauri.conf.json:7`, `"frontendDist": "../ui"`),
compiled into the binary. **An `<h2>` and a glossary entry in the shipped About tab teach the retired
framing as the governing stance, to a user rather than to an instance.** It is non-`.md`, so
carrier-drift can never see it; and it appears in **neither** B's thirteen repo carriers nor B's
forty-four traces (`carrier_surface_2026-08-25.md` §4), so two independent corpus rules miss it in
different ways. Fifteen non-`.md` files in the tree carry the wording; eleven are the instrument, its
tests, its mutants and its registry quoting it on purpose. The user-facing one is this.

---

## 5. The shells outside the repo: attack FAILED, reported because the numbers look alarming and are not

Every `CLAUDE.md` under `C:/Consonance/instances` and `C:/Consonance/rooms` (`node surfaces.js`):

```
shells found:                      40
  carry the retired apparatus:     39
  carry the withdrawn wording:     27
  ...of those, no correction:      21
registered in panes.json:          5
  of those, withdrawn-no-fix:      0
  of those, carry the apparatus:   5
uncorrected shells mtime span:     2026-07-06 -> 2026-07-12
```

**Twenty-one shells assert the withdrawn wording with no correction beside it — and every one is dated
before the 2026-08-16 withdrawal that created it.** They are frozen records of what the room taught in
July. Under the tool's own split they are **traces, not carriers**, and calling them a propagation
failure would have been the number leading the reading. **The attack fails.**

What survives is already B's: all five registered-live shells carry the retired apparatus, all five were
regenerated today (`mtime 2026-08-25`), and all five carry the 08-23 correction. **The shell channel
regenerates from BOOT, so BOOT is the right place to fix it, and carrier-drift's repo-rooted corpus is
adequate for it.** That is a defence of the corpus rule, arrived at by trying to break it.

---

## 6. The class: one shape, TWO species — and the registration covers one of them

The chair asked for this one hardest and has a stake in the four being one thing. **The shared shape is
real:** every instance reports health of a surface it did not measure. But the four split by *mechanism*,
and the split decides whether the proposed fix works.

**Species A — MISSING MEMBERS** (`node briefdrift3.js`)**.** The set is enumerated and short. `open-items` (5 of 25),
`install.ps1 -Check` (an incomplete manifest), `carrier-drift`/CH-4 (repo-rooted, `.md`-only). The
failure is proportional: findings are undercounted in proportion to what was left out. **A universe
print catches this, provided the count is enumerated from an outside authority — §1's whole point.**

**Species B — WRONG UNIT.** The set is complete and the *partition* is wrong. Turn-scan v1 read 100% of
the transcript; tool results are role `user`, so every turn fragmented and **no turn could contain both a
dispatch and a later text block**. The result was not an undercount. It was a **structural zero** — a
detector incapable of ever firing, reporting a clean record, on the night its author violated the rule
three times.

> **A universe print is blind to species B by construction.** Turn-scan v1 would have printed
> `8,065 rows seen · 0 skipped · rule: the whole transcript` — every word true, the instrument dead.

**So the Q3 registration is right and insufficient, and the insufficiency is nameable.** Species B needs
a different question: not *"what did you skip"* but ***"what would a positive look like, and can your
unit produce one?"*** — a planted positive the instrument must find or declare itself inert.

**The repo already owns that shape and it is not in the registration.** `carrier-drift.js` refuses a
green over an empty registry — *"a registry with no withdrawals in it is not a green tree, it is an
unarmed instrument"* — and the mutation harnesses under `dev/mutation/` are the same discipline run
externally. The librarian's own P-CH4 bar is written in this form: *"red demonstrated on
record/trust-the-first-attention.md's known hit before any green is believed."*

**Recommendation: register both, as one entry with two clauses.** *An instrument that sweeps a corpus
must print its universe, enumerated from an authority outside itself; and must demonstrate a red on a
known positive before any green from it is believed.* Three bugs and one class was the alternative
reading and it is wrong — the shape genuinely holds across all four. But **one registration covering one
species, derived from four instances of which one is the other species, would leave the worst of the four
uncovered by the fix named after it.**

---

## 7. What this does NOT establish

- **One machine, one moment.** Every filesystem figure is this laptop at ~08:00–08:50Z on 2026-08-25.
  The build directory is `C:\build\lighthouse-target\release` via `CARGO_TARGET_DIR`; a machine without
  that env resolves elsewhere and the drift result may differ.
- **The tree was dirty and is still moving.** §1's `open-items` output and §2's `carrier-drift` diff are
  **working-tree** states of other panes' in-flight work; §2's registry counts and §4's corpus counts are
  from HEAD (`67bdbd0`). Anything re-run after those panes hand back may differ, and that is the
  instrument working, not drift.
- **§1 does not establish that a stale `BUILDING.md` has harmed anything.** It establishes that it is
  drifted, bundled, read by a spawn, and outside the checked set. No room has been spawned from the
  current build and inspected.
- **§4 does not establish that `ui/index.html` should be edited.** It establishes that no corpus rule in
  play can see it. Whether the About tab's framing is the retirement's business is the keeper's call,
  and `e5521a0` deliberately exempted some documents.
- **I did not read C's `memory-sweep.js` source** — only the glob rule as stated in Q1/the work-shape,
  and C's landed `ch5_memory_sweep_2026-08-25.md`. Nothing here is a verdict on the implementation.
- **I did not run A's `universe-print.test.js`** — §1's claim about it is read off its own header and the
  live `open-items` output, not from executing the suite.
- **The 29-vs-31 closed-universe discrepancy is unreconciled** (§2). I did not determine which is right.

---

## 8. Corrections I made to myself

1. **I nearly published "the registration's own denominator is stale — `install.ps1 -Check` already
   complies."** It complies because **A added the block twenty minutes ago and has not committed it**
   (`git log -S"the denominator; a file absent from it is INVISIBLE" -- dev/shell/install.ps1` → no
   commits). The librarian's Q3 was true when written. I was reading another pane's live work as
   pre-existing state — the moving-figure error, in the pass whose subject is measuring the right surface.
2. **My first `briefdrift` scan filtered `tauri.conf.json` resources to `brief/` and reported a universe
   of 7.** The build directory then showed `GUIDE.md`, `README.md` and `SOURCE.md` — one of them a room
   ROOT — shipped from three entries my filter dropped. **My own universe was short, in the packet about
   short universes**, and it was caught by looking at the destination instead of the manifest. That is
   §1's recommendation, demonstrated on me first.
3. **I expected the shell surface to be the packet's big finding and it collapsed on the dates** (§5).
   Twenty-one uncorrected shells is an alarming number that means nothing once the mtimes are read.
4. **I expected B's corpus rule to be my main hit; B had already made it, with identical numbers** (§2).
   Reported as convergence.

---

## 9. Reproduction

Probes are READ-ONLY — they parse the repo, the build dir, `~/.claude`, `panes.json` and git, and write
nothing. They live in this pane's scratchpad and are deliberately not installed into `consonance/tools/`;
a one-night probe is not an instrument. Bodies in §10.

| script | figures |
|---|---|
| `ch4.js` | §2 — 204 / 29 / 175, 3 in / 14 out |
| `briefdrift3.js` | §1 — 25 shipped, 5 compared, 3 drifted |
| `nonmd.js` | §4 — 664 / 233 / 431 / 460, the 15 non-`.md` hits |
| `surfaces.js` | §3 — 99 / 88 / 81 / 44 / 0 / 0; §5 — 40 shells |
| in-repo | `node consonance/tools/open-items.js`, `node consonance/tools/carrier-drift.js` |

**`cite-check` state, stated so a clean-looking file is not read as fully green:**
`node consonance/tools/cite-check.js exo_memory/loop/corpus_rules_adversarial_2026-08-25.md`.
`--run` will report NOT-RUN for the scratchpad commands until §10's bodies are saved and the paths
substituted; a NOT-RUN is never a green.

**`cite-check` state, so a clean-looking file is not read as green:** 6 figure-bearing lines, 5 carrying
a command, 1 not — the `100%` in §6, which is a description of turn-scan v1's coverage, not a measurement
(`node consonance/tools/cite-check.js exo_memory/loop/corpus_rules_adversarial_2026-08-25.md`). Every
other figure in this file sits inside a fenced block showing the command that produced it. `--run` will
report NOT-RUN for the scratchpad commands until §10's bodies are saved; a NOT-RUN is never a green.

*Nothing committed. Nothing under `consonance/tools/`, `consonance/hooks/`, `dev/shell/install.ps1` or
any brief was touched. Handed back for the chair to commit with attribution.*

---

## 10. Appendix — the probe bodies

Save to a scratch directory and run from there.

### `ch4.js`

```js
// READ-ONLY. What the proposed CH-4 freeze would remove from carrier-drift's denominator.
const fs = require('fs'), path = require('path');
const REPO = 'C:/Consonance/lighthouse';
const SKIP = new Set(['.git', 'node_modules', 'target', 'gen', '__pycache__']);
const TRACE = ['exo_memory/journal/', 'dreams/', 'attic/', 'dev/one-shot/'];
function walk(d, root, out) {
  let es; try { es = fs.readdirSync(d, { withFileTypes: true }); } catch { return out; }
  for (const e of es) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(p, root, out); }
    else if (e.isFile() && e.name.toLowerCase().endsWith('.md'))
      out.push(path.relative(root, p).split(path.sep).join('/'));
  }
  return out;
}
const all = walk(REPO, REPO, []).sort();
const carriers = all.filter(f => !TRACE.some(p => f.startsWith(p)));

// The closed universe as the corpus rule states it: the four seeded dirs + the briefs + the two
// roots + the three CH-4 files BOOT:150 points at.
const SEEDED = ['exo_memory/cards/', 'exo_memory/spread/', 'exo_memory/research/', 'exo_memory/record/',
                'consonance/src-tauri/brief/'];
const EXTRA = ['exo_memory/BOOT.md', 'exo_memory/SOURCE.md', 'dev/SPINE.md', 'dev/PLAN.md', 'WELFARE.md'];
const closed = new Set(carriers.filter(f => SEEDED.some(p => f.startsWith(p)) || EXTRA.includes(f)));

console.log('carrier-drift corpus TODAY (repo .md minus traces): ' + carriers.length);
console.log('proposed frozen closed universe:                     ' + closed.size);
console.log('carriers that would LEAVE the denominator:           ' + (carriers.length - closed.size));

const reg = JSON.parse(fs.readFileSync(path.join(REPO, 'consonance/tools/carrier-drift.registry.json'), 'utf8'));
let inN = 0, outN = 0; const outFiles = new Map();
for (const w of reg.withdrawals) for (const s of (w.sites || [])) {
  if (closed.has(s.file)) inN++;
  else { outN++; outFiles.set(s.file, (outFiles.get(s.file) || 0) + 1); }
}
console.log('\nregistered sites INSIDE the frozen universe:  ' + inN);
console.log('registered sites OUTSIDE it:                 ' + outN);
for (const [f, n] of [...outFiles].sort((a, b) => b[1] - a[1])) console.log('   ' + n + '  ' + f);
```

### `briefdrift3.js`

```js
// READ-ONLY. The FULL shipped-document surface: top-level .md plus the four globbed deck
// directories in tauri.conf.json. open-items compares five names; this compares everything
// the bundle actually carries.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const REPO = 'C:/Consonance/lighthouse';
const DIR = (process.env.CARGO_TARGET_DIR || 'C:/build/lighthouse-target') + '/release';
const md5 = p => { try { return crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex'); } catch (_) { return null; } };

const pairs = [];
// top level, from the conf's explicit entries
const conf = JSON.parse(fs.readFileSync(path.join(REPO, 'consonance/src-tauri/tauri.conf.json'), 'utf8'));
for (const [s, d] of Object.entries(conf.bundle.resources || {})) {
  if (s.includes('*')) {
    const srcDir = path.join(REPO, 'consonance/src-tauri', path.dirname(s));
    const dstDir = path.join(DIR, d);
    if (!fs.existsSync(dstDir)) { pairs.push({ dst: d + ' (DIR MISSING IN BUILD)', src: null, glob: true }); continue; }
    for (const f of fs.readdirSync(dstDir).filter(x => x.toLowerCase().endsWith('.md')).sort())
      pairs.push({ dst: path.join(d, f).split(path.sep).join('/'), src: path.join(srcDir, f), glob: true });
  } else if (d.toLowerCase().endsWith('.md')) {
    pairs.push({ dst: d, src: path.join(REPO, 'consonance/src-tauri', s), glob: false });
  }
}
const OPEN_ITEMS = ['SEED.md', 'BOOT.md', 'BASE_JOURNAL.md', 'COMMITTEE.md', 'LIBRARIAN.md'];
let drifted = [], missingInBuild = [], checked = 0;
for (const p of pairs) {
  if (!p.src) { missingInBuild.push(p.dst); continue; }
  const a = md5(p.src), b = md5(path.join(DIR, p.dst));
  const inOI = OPEN_ITEMS.includes(p.dst);
  if (inOI) checked++;
  let v;
  if (!b) { v = 'NOT SHIPPED'; missingInBuild.push(p.dst); }
  else if (!a) v = 'no repo original';
  else v = (a === b) ? 'identical' : 'DRIFTED';
  if (v === 'DRIFTED') drifted.push(p.dst);
  if (v !== 'identical') console.log('  ' + p.dst.padEnd(38) + v + (inOI ? '  [open-items]' : '  <- OUTSIDE open-items'));
}
// repo-side deck files that never reached the build at all
for (const [s, d] of Object.entries(conf.bundle.resources || {})) {
  if (!s.includes('*')) continue;
  const srcDir = path.join(REPO, 'consonance/src-tauri', path.dirname(s));
  const dstDir = path.join(DIR, d);
  if (!fs.existsSync(srcDir)) continue;
  const inRepo = fs.readdirSync(srcDir).filter(x => x.toLowerCase().endsWith('.md'));
  const inBuild = fs.existsSync(dstDir) ? fs.readdirSync(dstDir).filter(x => x.toLowerCase().endsWith('.md')) : [];
  for (const f of inRepo) if (!inBuild.includes(f)) {
    console.log('  ' + (d + f).padEnd(38) + 'IN REPO, NOT IN BUILD  <- OUTSIDE open-items');
    missingInBuild.push(d + f);
  }
}
console.log('\nshipped documents in the bundle surface: ' + pairs.length);
console.log('compared by open-items:                  ' + checked);
console.log('DRIFTED:                                 ' + drifted.length + '  ' + JSON.stringify(drifted));
console.log('in repo but absent from the build:       ' + missingInBuild.length + '  ' + JSON.stringify(missingInBuild));
```

### `nonmd.js`

```js
// READ-ONLY. What carrier-drift's ".md only" filter drops, counted the way its own walk would
// see it (same SKIP_DIRS, same tree, untracked included).
const fs = require('fs'), path = require('path');
const REPO = 'C:/Consonance/lighthouse';
const SKIP = new Set(['.git', 'node_modules', 'target', 'gen', '__pycache__']);
const TRACE = ['exo_memory/journal/', 'dreams/', 'attic/', 'dev/one-shot/'];
let md = [], other = [];
(function walk(d) {
  let es; try { es = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
  for (const e of es) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(p); }
    else if (e.isFile()) {
      const rel = path.relative(REPO, p).split(path.sep).join('/');
      (e.name.toLowerCase().endsWith('.md') ? md : other).push(rel);
    }
  }
})(REPO);
const carriers = md.filter(f => !TRACE.some(p => f.startsWith(p)));
console.log('files the walk touches:      ' + (md.length + other.length));
console.log('  .md:                       ' + md.length + '  (carriers ' + carriers.length + ' / traces ' + (md.length - carriers.length) + ')');
console.log('  NOT .md — dropped silently: ' + other.length);
console.log('carrier-drift universe line says: "' + carriers.length + ' carriers · ' + (md.length - carriers.length) + ' traces skipped"');
console.log('  -> the line accounts for ' + (md.length - carriers.length) + ' skips; the real skip count is ' +
  ((md.length - carriers.length) + other.length));

// non-.md files carrying the retired apparatus or the withdrawn wording
const RX = /lifeguard|dive buddy|Dive, and stay|only (genuinely )?decorrelated/i;
const hits = [];
for (const f of other) {
  try { if (RX.test(fs.readFileSync(path.join(REPO, f), 'utf8'))) hits.push(f); } catch (_) {}
}
console.log('\nnon-.md files in the walked tree carrying the retired/withdrawn wording: ' + hits.length);
hits.forEach(h => console.log('   ' + h));
```

### `surfaces.js`

```js
// READ-ONLY. Two corpus rules measured against the filesystem they claim to describe.
//   A) C's CH-5 glob:  ~/.claude/projects/*/memory/*.md
//   B) the shell surface: every CLAUDE.md under C:/Consonance/instances and C:/Consonance/rooms
const fs = require('fs'), path = require('path');
const BS = String.fromCharCode(92);
const HOME = 'C:/Users/zackn';

// ── A. the glob ──────────────────────────────────────────────────────────────
const PROJ = HOME + '/.claude/projects';
let projDirs = fs.readdirSync(PROJ, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
let reached = [], deeper = [], nonmd = [], memDirs = 0, emptyMem = 0;
function rec(d, rel, proj) {
  let es; try { es = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
  for (const e of es) {
    const p = path.join(d, e.name), r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) rec(p, r, proj);
    else if (e.isFile()) {
      const isMd = e.name.toLowerCase().endsWith('.md');
      if (isMd && !r.includes('/')) reached.push(proj + '/memory/' + r);
      else if (isMd) deeper.push(proj + '/memory/' + r);
      else nonmd.push(proj + '/memory/' + r);
    }
  }
}
for (const p of projDirs) {
  const m = path.join(PROJ, p, 'memory');
  if (!fs.existsSync(m)) continue;
  memDirs++;
  const before = reached.length + deeper.length + nonmd.length;
  rec(m, '', p);
  if (reached.length + deeper.length + nonmd.length === before) emptyMem++;
}
console.log('=== C: ~/.claude/projects/*/memory/*.md ===');
console.log('project dirs: ' + projDirs.length + ' | with a memory/ dir: ' + memDirs + ' | of those EMPTY: ' + emptyMem);
console.log('REACHED by the glob:            ' + reached.length);
console.log('MISSED, .md nested deeper:      ' + deeper.length);
console.log('MISSED, non-.md in memory/:     ' + nonmd.length);
console.log('harness-loaded and OUTSIDE the glob:');
const global = HOME + '/.claude/CLAUDE.md';
console.log('  ' + global + '  ' + (fs.existsSync(global) ? fs.statSync(global).size + ' bytes' : 'ABSENT'));

// ── B. the shell surface ─────────────────────────────────────────────────────
const RX_APP = /lifeguard|dive buddy|Dive, and stay/i;
const RX_ONLY = /only (genuinely )?(DECORRELATED|decorrelated)/;
const RX_FIX = /least-correlated reader/;
function scanShells(root, label) {
  let names; try { names = fs.readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name); } catch { return []; }
  const rows = [];
  for (const n of names) {
    const f = path.join(root, n, 'CLAUDE.md');
    if (!fs.existsSync(f)) continue;
    const flat = fs.readFileSync(f, 'utf8').replace(/\s+/g, ' ');
    rows.push({ where: label, n, app: RX_APP.test(flat), only: RX_ONLY.test(flat), fix: RX_FIX.test(flat),
      mtime: fs.statSync(f).mtime.toISOString().slice(0, 10) });
  }
  return rows;
}
const rows = scanShells('C:/Consonance/instances', 'instance').concat(scanShells('C:/Consonance/rooms', 'room'));
const live = new Set(JSON.parse(fs.readFileSync('C:/Consonance/data/panes.json', 'utf8'))
  .map(p => path.basename(p.cwd.split(BS).join('/'))));
console.log('\n=== B: CLAUDE.md shells outside the repo ===');
console.log('shells found:                      ' + rows.length);
console.log('  carry the retired apparatus:     ' + rows.filter(r => r.app).length);
console.log('  carry the withdrawn wording:     ' + rows.filter(r => r.only).length);
console.log('  ...of those, no correction:      ' + rows.filter(r => r.only && !r.fix).length);
const liveRows = rows.filter(r => live.has(r.n));
console.log('registered in panes.json:          ' + liveRows.length);
console.log('  of those, withdrawn-no-fix:      ' + liveRows.filter(r => r.only && !r.fix).length);
console.log('  of those, carry the apparatus:   ' + liveRows.filter(r => r.app).length);
const stale = rows.filter(r => r.only && !r.fix).map(r => r.mtime).sort();
console.log('uncorrected shells mtime span:     ' + (stale.length ? stale[0] + ' -> ' + stale[stale.length - 1] : 'none'));
```

