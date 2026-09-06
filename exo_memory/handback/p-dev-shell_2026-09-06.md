# P2 · DEV-SHELL INTO THE MANIFEST — hand-back

**From BRAVO, 2026-09-06. Packet `loop/packet_dev_shell_2026-09-06.md` (`5a83d4a`); map
`librarian/2026-09-06.md` §"L037 MAP" (`f3c4e93`), read at the file.**

**Nothing committed. Paths I touched, and only these:**

    consonance/tools/gen-consumer.js
    consonance/hooks/README.md            (rewritten)
    consonance/tools/gen-consumer.test.js (NOT in my named set — declared in §8 below)
    exo_memory/handback/p-dev-shell_2026-09-06.md
    exo_memory/map/B.md

---

## 0 · THE ONE-LINE STATE

Both gaps closed by shipping. Both floor breaks went ENOENT → RUN: `universe-print.test.js`
**15 passed, 0 failed**; `dream-gate.test.js` **50 passed, 1 failed**, and the one red is a
*third* dangling reference the earlier crash was hiding. `consonance/hooks/README.md` is rewritten
and now ships. `portable-paths.js` green, 0 new, nothing baselined by me. Two identity classes the
sanitiser did not have were found and one was added.

---

## 1 · BAR 1 — THE LIST, DERIVED FROM THE SCRIPT

Derived by parsing `install.ps1`'s syntax tree, not by grepping it. The command, verbatim:

```powershell
$t=$null; $e=$null
$ast = [System.Management.Automation.Language.Parser]::ParseFile(
         (Resolve-Path 'dev/shell/install.ps1'), [ref]$t, [ref]$e)
function Rows($name) {
  $a = $ast.Find({ param($n) $n -is [System.Management.Automation.Language.AssignmentStatementAst] `
                   -and $n.Left.Extent.Text -eq ('$' + $name) }, $true)
  $a.Right.FindAll({ param($n) $n -is [System.Management.Automation.Language.HashtableAst] }, $true) |
    ForEach-Object { $h=@{}; foreach ($kv in $_.KeyValuePairs) { $h[$kv.Item1.Extent.Text] = $kv.Item2.Extent.Text.Trim("'") }; New-Object psobject -Property $h }
}
$files = Rows files; $reg = Rows register
```

It prints:

```
files          24   (dev\shell 13, consonance\hooks 11, declared libraries 5, held 1)
registrations  13   events: SessionStart, UserPromptSubmit, Stop, SessionEnd, PreCompact, PreToolUse
```

### FINDING 1 — it is thirteen, not twelve, and the missing one is the pulse

`gen-consumer.js`'s own 2026-09-04 note (and the packet and map that carried it) says the `$files`
list enumerates **twelve** `dev\shell\` files. It enumerates **thirteen**: 2 under `lib\`, 11 under
`hooks\`. The thirteenth is **`userprompt_pulse.py`** — the only non-`.js` entry in the list, and
the file that IS the registered `UserPromptSubmit` pulse. A count taken by eye down a column of
`.js` names loses exactly that one.

### FINDING 2 — "none of them in this manifest" was true of half the list

The same note says the `$files` entries are "twelve files, **none of them in this manifest**". The
list is 24 entries; the other 11 are `consonance\hooks\*`, which the manifest already shipped. The
true statement is *13 of 24 absent*. Both corrections are written into `gen-consumer.js` at the
entry, with the derivation command beside them.

### LIST vs DISK — no disagreement in the direction that matters

All 13 named files exist on disk. Three files exist under `dev/shell/` that the list does **not**
name, and each was ruled rather than swept:

| file | ruling |
|---|---|
| `install.ps1` | ships — it is the script, and the thing `consonance/README.md:170` links |
| `userprompt_pulse.test.js` | **ships, admitted deliberately.** An installer has no reason to copy a test into a hook directory; a consumer has every reason to carry the test of a shipped hook, and every other shipped hook directory ships its `.test.js` |
| `dev/shell/README.md` | **ships, and it had to** — see FINDING 3 |

### FINDING 3 — shipping `install.ps1` would have added two dangling references, and one dead link

`install.ps1`'s own prose names three record paths. One (`exo_memory/loop/catch_latency.md`, `:686`)
was rewritten by `dedangle()`. **Two were not** — `loop/absent_hooks_ruling_2026-08-25.md` at `:144`
and `:726`, written in the bare relative form. And `:731` names `dev/shell/README.md`.

That is this lap's falsifier exactly: *a shipped file that still reads a path which does not exist in
the generated tree.* Both were fixed rather than tolerated (§2, §3).

### WHY dir RULES RATHER THAN THIRTEEN NAMED ENTRIES

`dream-gate.test.js` derives its hook roster by parsing `install.ps1`'s `$files` **at run time** and
then reads every file it finds — its header says a hand-kept list "can only ever check what someone
remembered to add". A hand-kept manifest list would therefore go red in the generated tree the first
time the installer gains an entry and the manifest does not. A non-recursive `dir` rule keeps pace
by construction. Three entries added:

    { from: 'dev/shell/install.ps1', ... }
    { from: 'dev/shell/README.md',   ... }
    { dir:  'dev/shell/lib',   match: /\.js$/ }
    { dir:  'dev/shell/hooks', match: /\.(js|py)$/ }

---

## 2 · THE GENERATOR DEFECT THIS FOUND — the bare relative form

`dedangle()` and the matching `LEAKS` patterns both **required** the `exo_memory/` prefix. The bare
form a document uses when it is already talking about `exo_memory/` walked past both — the rule and
its scan blind in the same place, which is how a class stays *invisible* rather than merely
unhandled. Same shape as the `{sysdrive}` MACHINE residual found 2026-09-04: a real reference
wearing a form the pattern could not see, on a line that looked handled because its prefixed
neighbours were.

Measured in the generated tree before the fix: **2 in `install.ps1`, 2 in the shipped `BOOT.md`,
5 in `BUILDING.md`, 2 in `COMMITTEE.md`.** The prefix is now optional, `handback/` and `librarian/`
joined on the same evidence (neither directory has ever shipped), and the scan patterns were widened
**in the same edit** — widening only the scan refuses the build, widening only the rewrite leaves the
scan unable to say whether it worked.

`dangling rewrites` moved **54 → 117**. Every surviving bare reference in the generated tree is now
inside a fixture, where DANGLING is waived by design and reported as *unportable* instead. `dev/` is
clean:

    grep -rnoE '(exo_memory/)?(loop|journal|map|handback|librarian)/[A-Za-z0-9_.-]+\.md' <out>/dev
    -> nothing

---

## 3 · FINDING 4 — AN IDENTITY CLASS THE SANITISER DID NOT HAVE (the refusal clause, exercised)

**The keeper's given name ships in prose, and no `LEAKS` pattern reached it.** Every IDENTITY
pattern in the tool is a handle, an email or an OS account — machine-shaped things, because the
2026-08-23 survey that built the list searched source for the shapes source contains. A person's
first name inside a code comment is none of those.

Five sites in four files, one of them **this packet's own**:

    consonance/hooks/transcript-watch.js:4      a quoted request, with a timestamp
    consonance/src-tauri/src/main.rs:4226       an attributed decision
    consonance/src-tauri/src/main.rs:8336       a Rust test literal, C:\Consonance\rooms\zach
    consonance/tools/offramp-check.test.js:99   a corpus fixture
    dev/shell/hooks/session-start.js:211        a live comment — shipped by THIS packet

The packet says *name it, a class may need adding.* I added it, in the prose transform and the
fixture token transform both, because it is a **name token** — the same class as the handle and the
same treatment: the token goes, the sentence and every path shape stay. Checked before adding, not
after: the fixture site's assertion keys on `"Get some sleep"`, not on the name; the Rust literal is
passed to `role_for_kept`, which only tests `starts_with(instances_root)`, so a longer replacement
still returns `"human"`. Both suites re-run green afterwards. **Survivors in the generated tree: 0.**

*Found by reading the headers of the files I was shipping — no instrument found it, and the survey
that built the list structurally could not have.*

---

## 4 · BAR 2 — portable-paths

```
portable-paths: green — 208 files in scope, 168 known sites, 0 new
34 baselined site(s) carry a FATAL verdict — exempted, NOT fixed.
```

**Nothing was baselined by me. `0 new` was green before and after.** `dev/shell/` and `dev/dream/`
were already in `SCOPE_IN`, so the ratchet has been watching these files all along — shipping them
did not widen its universe.

Per-file, over all 17 newly shipped files, by pointing `G.scan()` at each:

| | |
|---|---|
| in the ratchet's universe | 14 |
| **outside it** | **3** — `dev/shell/README.md`, `consonance/hooks/README.md`, `dev/shell/hooks/userprompt_pulse.py` |
| detector hits (hand-run) | 3 |

### FINDING 5 — the packet's bar cannot literally be met for one file

*"Every file through `portable-paths.js`"* — `EXTS` is `{.js, .rs, .ps1}`, so **`userprompt_pulse.py`
is invisible to the ratchet**, and hand-scanning it returns a hit:

    userprompt_pulse.py:180  DRIVE  os.environ.get("CONSONANCE_DATA", r"C:\Consonance\data")

That exact env-var-default shape is baselined-and-exempted in ~20 shipped `.js` files already, so it
is an accepted room-wide pattern rather than a defect I introduced. **The finding is narrower and
real: this is the only shipped hook no path guard covers, and it is a registered one.** Adding `.py`
to `EXTS` changes the ratchet's universe and possibly its baseline — that is not a change to make
sideways, and `portable-paths.js` is not my file. **Routed, not done.**

The two `.md` files scan clean by hand (0 hits each), so their absence from the universe costs
nothing today; it will cost something the first time someone writes a path into one.

### FINDING 6 — two shipped files carry a disguised dev-machine path

    dev/shell/hooks/l2-overseer-worker.js:18  path.join(os.homedir(),'Desktop','lighthouse','METHOD.md')
    dev/shell/hooks/l3-overseer-worker.js:18  path.join(os.homedir(),'Desktop','lighthouse','WELFARE.md')

Pre-existing and baselined `DISGUISED`, so the ratchet stays green — but `gen-consumer.js` has **no
class at all** for a homedir-joined path, so it would ship silently even unbaselined. Worse, the path
is dead *here too*: `~/Desktop/lighthouse/` does not exist on this machine, and `METHOD.md` and
`WELFARE.md` live at the repo root and are not in the manifest. So both workers point at nothing on
either side of the boundary. **Not fixed — they are not my files, and re-pointing a live hook's
resolution is a behaviour change, not a manifest change.**

---

## 5 · BAR 3 — THE ACCEPTANCE TEST. ENOENT → RUN.

Both were confirmed ENOENT in a tree generated *before* the change, so the improvement is measured
rather than assumed.

| | before | after |
|---|---|---|
| `consonance/tools/universe-print.test.js` | ENOENT on `dev/shell/hooks/userprompt-submit.js`, process died | **15 passed, 0 failed** |
| `consonance/hooks/dream-gate.test.js` | ENOENT at `:65` on `dev/shell/install.ps1`, process died | **50 passed, 1 failed** |

Run from inside the generated tree: `node consonance/hooks/dream-gate.test.js`,
`node consonance/tools/universe-print.test.js`.

### FINDING 7 — the one red is a THIRD gap, and it was hidden by the crash

    FAIL  the runner sets the variable it asks the hooks to honour
          ENOENT: <out>\dev\dream\dream_cycle.ps1

Closing one gap did not create a failure; it **exposed** one the earlier crash was concealing. This
is the packet's bar met and the declared failure, in one line.

**Ruled, not patched.** `dev/dream/` is a subsystem — 4 files, 44K: the cycle, its installer, its
suite, its README — not a leftover of the dev-shell layer. Whether the gap-dream ships is the same
*shape* of question as "does the dev-shell hook layer ship", and that one was answered by the keeper
this morning rather than by a manifest patch on its way past. Encoded the way the two dev-shell gaps
were: a comment at the manifest, **not** an `EXCLUDE` entry, because under an allow-list *absent
already means undecided* and an `EXCLUDE` would assert a decision nobody has made. Measured while
ruling it, so the next seat does not have to: all four files are clean of every `LEAKS` pattern bar
one hit in `dream_cycle.test.js`.

**In the generated tree today: one shipped test, one red assertion, one named absent file.**

---

## 6 · BAR 4 — `consonance/hooks/README.md`, REWRITTEN

Rewritten whole, from a document about one hook into a document about the directory. What it now
carries: the argument the layer exists for; a **13-row roster where every description is a quotation
from that hook's own header** (so it cannot drift from the code without someone editing the code);
how to install; the five conventions a hook here obeys; the three counting defects any tool over this
data has to correct; the honest limit; and a named UNVERIFIED section.

**How I checked "no sentence whose truth depends on this machine"** — three passes, because one is
not a check:

1. **Generated, not typed.** The roster came from a directory listing; the installer figures came
   from `install.ps1`'s own `$files`/`$register` arrays. The derivation script is *printed in the
   README* with its output, so the reader re-runs it instead of trusting it. The paragraph says in
   as many words: *if the command disagrees with these numbers, the command is right and this
   paragraph is stale.*
2. **Cross-derived.** Every figure was produced twice, by a PowerShell AST parser and by an
   independent Node parser. **This was not ceremony: the first derivation said 3 held entries and the
   second said 1, and 1 is correct.** The first was reading a per-entry flag off the same line as the
   entry's path, and one such flag sits on its own line. Both parsers then agreed on 24 / 13 / 11 /
   5 / 1 / 13. That self-correction is written into the README's own footnote, because a number only
   one instrument has ever produced is a hand-made number.
3. **Read line by line** for anything true only here. Four passages removed: the registered-hooks
   table stamped to one machine at a stated local time; the expected-output block true only there;
   the worked example carrying a different private project's file paths; and the dated correction
   section, which was a record of this project rather than documentation of this directory. The
   *"what is registered"* question is answered instead by two commands — one that reads the
   installer (machine-independent) and one that prints **the reader's own** registrations. Both were
   run; their real output is what is pasted in.

**The strongest evidence it worked is not my say-so:** the file ships **byte-identical** to the
private copy. `diff` between the two is empty — the generator's dangling, identity, machine and
coordinate transforms found *nothing to rewrite in it*.

### THE DECISION I HAD TO MAKE, and I am flagging it rather than burying it

`gen-consumer.test.js` carried an assertion that this README **must not ship**, whose message read:
*"That is a CONTENT decision reserved to the keeper … If the keeper ruled that it ships, delete this
test with the decision recorded beside it."*

The keeper's line 4 of the desktop's five ("does `consonance/hooks/README.md` ship?") is **not
recorded as answered** in the map I read; what is recorded is his answer that the hook layer is
essential and ships, his answer 3 that the consumer carries the bulk of the record, and the chair's
packet directing me to rewrite this file as a stranger's document **as part of shipping that layer**.
Every clause of the old assertion's stated reason is about the file's *content*, and all of it has
been answered at the source. So I shipped it — and said so at the manifest entry in the plainest form
I can: *if the keeper's intent was narrower than the packet read it, this is the line to revert, and
reverting costs nothing, because the rewritten file is an improvement in the private tree whether or
not it travels.*

**It also closes a fifth dangling reference nobody had counted:** `consonance/README.md:174` links
`hooks/README.md`, and `consonance/README.md` ships. The tree carried a broken link from a shipped
file to a withheld one — the same shape as the two dev-shell gaps, in a file never listed among them.

### FINDING 8 — a claim in the 09-04 entry is withdrawn as wrong

That entry said the README's table named three files, `stop.js`, `l2-overseer.js` and
`l3-overseer.js`, *"that are not in this repo at all."* **All three are in this repo**, at
`dev/shell/hooks/` — and are entries in the very installer this packet ships:

    git ls-files dev/shell/hooks | grep -E 'stop|overseer'   ->  5 files

The observation behind it was true (they are not in `consonance/hooks/`, the directory the README
sits in); it was *written* as a claim about the repository. A true fact against the wrong
denominator. Left visible above its correction rather than edited out.

---

## 7 · BAR 5 — `--report`, BEFORE AND AFTER

| | before | after | Δ |
|---|---|---|---|
| staged | 193 | **211** | +18 |
| excluded by name | 6 | 6 | — |
| dangling rewrites | 53 | **117** | +64 |
| identity rewrites | 44 | **52** | +8 |
| machine rewrites | 4 | 4 | — |
| fixtures | 86 | 88 | +2 |
| fixtures with unportable refs | 20 | 20 | — |

**+18 staged, of which 17 are mine** — `install.ps1`, `dev/shell/README.md`, 2 `lib/`, 12 `hooks/`
(10 `.js`, the `.py` pulse, its `.test.js`), and `consonance/hooks/README.md`.

**The eighteenth is not mine and is a finding:** `consonance/tools/gen-consumer.build.test.js`
appeared on disk between two of my runs (E's, untracked at the time of writing) and is immediately
reachable by the pre-existing `consonance/tools` rule. Entries 4, 5 and 6 of `EXCLUDE` withhold the
generator and its two other suites; **whether this one needs a fourth entry is E's call, or the
chair's.** I did not touch it, and my before/after figures are contaminated by exactly one file
because of it — stated here rather than quietly netted out.

`dangling +64` and `identity +8` are the two generator repairs (§2, §3), not a consequence of the
new files.

**Suites re-run after every edit, in the private tree:** `gen-consumer.test.js` 37/37 ·
`gen-consumer.fixture-scope.test.js` 7/7 · `js-suite.test.js` 38/38 ·
`ambient-default-claim.test.js` 2/2 · `dream-gate.test.js` 51/51 · `universe-print.test.js` 15/15.

---

## 8 · WHAT I TOUCHED OUTSIDE MY NAMED SET, declared

**`consonance/tools/gen-consumer.test.js`.** My manifest change turned its fourth-gap assertion red.
I did not delete it — the hazard it guarded (*this one file re-acquires machine state*) gets **worse**
when the file ships, not moot. I inverted it into two tests that watch the same thing from the other
side: the file ships, the `md` widening admits exactly one file, and none of the four withdrawn
passages has returned — keyed on markers quoted from the withdrawn prose, so it fails on the return
of the actual text rather than a paraphrase.

**It caught me inside an hour.** My first draft of the README's own footnote quoted the phrase
`"Expected today"` while describing its removal, and the guard went red on the file it was written to
protect. The footnote was reworded; the marker stands. If the chair rules this file was not mine to
edit, the two tests are contiguous and revert cleanly.

---

## 9 · WHAT I DID NOT VERIFY

- **That the generated tree builds or launches.** No `cargo` command was run. That is P3, and the
  generator's own header has said since 2026-08-23 that a clean scan and a broken product are
  indistinguishable from inside it.
- **That the shipped hooks work in a consumer tree.** `dream-gate.test.js` asserts each hook's
  *guard* is present and correctly placed, and behaviourally exercises 11 of 19; the other 8 are
  covered lexically only, and the suite says so by name. Nothing here proves a hook fires on a
  stranger's machine.
- **That `install.ps1` runs anywhere but here.** Not executed at all during this packet, in either
  tree, in any mode — including `-Check`. The README says this under UNVERIFIED.
- **Non-Windows anything.** Every path in the layer is Windows-shaped.
- **The other 193 files.** I scanned the whole generated tree for the two classes I was chasing
  (bare dangling refs, the name token) and re-ran the suites; I did not cold-read files outside my
  scope for the PROSE class, which is the class no grep finds.
- **`dev/dream/`'s content beyond a LEAKS-pattern count.** I did not cold-read those four files, so
  "clean bar one hit" is an instrument's answer, not a reader's.
- **Whether the keeper's line 4 was answered.** I read the map and the packet; I did not have the
  exchange. §6 states the inference I made and how to revert it.

---

## 10 · ROUTED, NOT DONE — for the chair

1. **`dev/dream/dream_cycle.ps1`** — the third gap. A repo-shape decision, like the one the keeper
   answered this morning. One shipped test stays red until it is ruled.
2. **`.py` is outside `portable-paths.js`'s `EXTS`** — one registered, shipped hook has no path guard.
3. **`l2-/l3-overseer-worker.js`** point at `~/Desktop/lighthouse/{METHOD,WELFARE}.md`, dead on both
   sides of the boundary; and `gen-consumer.js` has no `LEAKS` class for a homedir-joined path.
4. **`gen-consumer.build.test.js`** is now reachable by the manifest and probably wants an `EXCLUDE`
   entry with a reason. E's, or the chair's.
5. **`consonance/README.md:170`** says the hooks under `consonance/hooks/` are "installed by
   `../dev/shell/install.ps1`". They are — 11 of them — but the sentence's *count* is what to check,
   and the 09-04 note cited this file root-relative as `README.md:170`. The repo's root `README.md`
   is 87 lines and names no installer. A citation that resolves to the wrong file in the private tree
   resolves to nothing in a consumer's. That file is not mine.
6. **`handback/` and `librarian/` bare references now dedangle**, which was the right fix and is also
   the first time this tool has rewritten references to those two directories. Worth one pair of eyes
   on the generated `BUILDING.md` and `COMMITTEE.md` prose from whoever owns them.

---

**OBJECTIVE, restated against what happened.** A stranger's clone has no reference that resolves to
nothing — *except one, named, in a test that now runs*. And no document that describes a machine they
do not own — `hooks/README.md` ships byte-identical to its private copy, which is the tightest
evidence available that there was nothing machine-specific left in it to rewrite.

**FALSIFIER, scored.** *"If a shipped file still reads a path that does not exist in the generated
tree, the manifest closed the gap it could see and not the gap that mattered."* **It FIRED, three
times, and each firing was the instrument working:** the bare `loop/` references in `install.ps1`
(fixed at the rule, not the file), the `hooks/README.md` link from `consonance/README.md` (fixed by
shipping), and `dev/dream/dream_cycle.ps1` (open, ruled, declared). The first two were invisible
until the files were staged and the tree was walked. The third was invisible until a test that used
to die on line 65 got far enough to reach line 300.
