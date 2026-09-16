# P-NUL-REPAIRS + two carries · BRAVO — D067, chunk 2 of the cleanup

**B (pane `12fb81f6`), machine D, 2026-09-16 ~11:4x.** Packet row: `loop/plan_cleanup_chunks_2026-09-16.md:19`.
**Files changed, and no others:** `consonance/tools/coupling-test.js` (+1 B), `consonance/tools/essay-provenance.js`
(+1 B), `exo_memory/handback/p-boundary-read-B_2026-09-16.md` (+5 B), `consonance/ui/stick.js`, and
`consonance/ui/stick.test.js` (+4 tests, the file that carries (2)'s proof). **Nothing committed.** C's
`dev/tail-carry.js` untouched.

---

## 0 · RESULTS

| | bar | result |
|---|---|---|
| (1) | `text-census.js` exits 0 | **exit 0 — 2,132 tracked files, 0 with a raw NUL** |
| (1) | each tool byte-identical on a fixture, before and after | **5 of 5 probes IDENTICAL**, and a control proves the probes can see the separator's value |
| (1) | both tools' suites | coupling-test **16/0**, essay-provenance **55/0** |
| (2) | `why` and `outcome` shown, escaped | built red-first: **3 red → 19/0** (was 15/0); **6 of 6 mutants caught**, both controls behaved |
| (3) | is E's "already running" rule too cautious? | **No — keep it. But it is silent in the one case where silence IS the failure**, and that case happened this morning (§3) |

---

## 1 · THE THREE RAW NULS

### How the repair was done, and why not with an editor

**The root cause of the third NUL is worth more than the repair, and it is mine.** I wrote
`p-boundary-read-B_2026-09-16.md` with the Write tool, and the sentence *"the escape … and a literal NUL byte produce
identical behaviour"* arrived on disk **as the byte it was describing.** Probed here before touching anything:

```
$ od -c scratchpad/escape_probe.txt        # written with the same tool, three spellings
  A : \ 0 :          <- "\0"          survives as text
  B : \ x 0 0 :      <- "\x00"        survives as text
  C : \ \ u 0 0 0 0  <- a doubled backslash survives; a SINGLE backslash-u-0000 is DECODED into the byte
```

**So the file-writing tool decodes the six-character unicode escape into a real NUL, and leaves `\0` alone.** That is
how my hand-back got its NUL, and it is also why my map-line heredoc on L that night failed with *"command contains
control characters"* — the symptom I worked around instead of chasing. **Any seat that writes the unicode NUL escape
through that tool plants a byte `text-census.js` will then flag.**

So the repair (`scratchpad/nul/repair.js`) is **byte-level from node**, with the escape text built from char codes so
no tool in between can decode it. It **refuses** a file holding anything other than exactly one NUL, and refuses
`\0` if the next character is a digit (which would read as an octal escape):

```
repaired consonance/tools/coupling-test.js at byte 10695:   ...const k = cur.join('\0'); if (!see...      17819 B -> 17820 B
repaired consonance/tools/essay-provenance.js at byte 19748: ... String(full) + '\0' + String(p...       51225 B -> 51226 B
repaired exo_memory/handback/p-boundary-read-B_2026-09-16.md at byte 2019:  ...the escape `'\u0000'` and a lit...  11749 B -> 11754 B

$ node consonance/tools/text-census.js
text-census: 2132 tracked file(s) scanned, 0 with a raw NUL, 18 allowed (allowed is NOT fixed).     exit 0
```

**Spelling chosen: `\0` in the two tools**, deliberately not the unicode escape E used in `boundary-check.js` —
because the unicode spelling is the one this tool silently turns back into the byte. The markdown sentence gets the
unicode spelling back, because that is what it was quoting.

### The byte-identity bar — run, not reasoned

`scratchpad/nul/prove.js`. **Five probes**, each captured before and after:

| probe | what it exercises |
|---|---|
| `coupling-test.js corpus.tsv --json --seed 1` | the CLI, exact enumeration path (*"all 576 arrangements enumerated"*) |
| `coupling-test.js corpus.tsv --seed 1` | the human report |
| `allArrangements(['a b','c','a','b c'], [[0,1,2,3]])` | the dedup the separator guards, directly |
| `correctionKey` over three pairs, one path containing a space | the essay key |
| `essay-provenance.js --json` on a **frozen snapshot** of `board.jsonl` + `lap.jsonl` | the whole essay CLI, 94,337 B |

The essay CLI runs against a **copied data dir** so live board traffic on D cannot move its output between captures.

```
capture before  -> capture before2  (same files, twice)   5 identical, 0 differ     # the probes are deterministic
capture before  -> repair -> capture after                5 identical, 0 differ     # the bar

  9ab77f4f4181c40a  7071 B  coupling CLI --json --seed 1
  cff44a0c93f22395  1669 B  coupling CLI --seed 1
  cf781e0dd177c5f4   544 B  coupling allArrangements
  61b2e2ed9aecfc82   193 B  essay correctionKey
  ab9e2a2bc1a15545 94337 B  essay CLI --json (snapshot data)
```

**The control, because a byte-identical result proves nothing if the probe could not have seen a change.** On copies,
the NUL was replaced with a **space** — a change to the separator's *value* — and the probes re-run:

```
DIFFERS from before (probe sees the value)  coupling CLI --json --seed 1
DIFFERS from before (probe sees the value)  coupling CLI --seed 1
DIFFERS from before (probe sees the value)  coupling allArrangements        # 24 distinct arrangements -> 23
DIFFERS from before (probe sees the value)  essay correctionKey
```

**The fixture was built to collide:** `['a b','c','a','b c']` and `['a','b c','a b','c']` both join to
`"a b c a b c"` under a space, so a space-separated key merges two distinct arrangements and the exact reference set
shrinks from **24 to 23**. **The probes can see the value, and they saw no change from the spelling.**

### One correction to the packet's premise, and it matters only for how careful the next seat needs to be

The packet calls both uses *"a live KEY SEPARATOR"*. **True of coupling-test; much weaker for essay-provenance.**

- **coupling-test.js:225 — the value is load-bearing.** Arm labels are arbitrary corpus strings, so a printable
  separator can merge distinct arrangements (the 24 → 23 above) and quietly change an exact p-value.
- **essay-provenance.js:342 — the value is not.** The key is `full + SEP + path`, and `full` is the commit's full
  40-hex sha (`:411`, `:577`, and the `verifyCorrections` comment saying so). A fixed-width prefix cannot collide
  whatever the separator is: under a space the three probe keys are **still 3 distinct**. And nothing splits the key
  back apart. **It was never at risk; it is repaired for greppability, and the NUL there was belt without braces.**

---

## 2 · `consonance/ui/stick.js` — the result's own words reach the screen

**The chair's reading holds at source.** `renderResult` (`stick.js:61-72` before this change) printed the exit code,
the per-seat rows and `at`, and never `outcome` or `why`. **What that cost, concretely:** `dev/stick-apply.js:253-259`
writes, for APP_RUNNING, *"Consonance (pid N) had no window for 30 s … End that process (…taskkill /PID N /F), then
start the transfer again."* The keeper saw **"exit 2 (could not run)" over an empty table** — `rows: []` on that path
— and the one sentence that named the pid and the command was written to disk and shown to nobody.

**The change** — two lines, inside the section, both omitted when the field is absent so an older result renders as
before:

```js
const outcome = result.outcome ? `<p>Outcome: <b>${E(result.outcome)}</b></p>` : '';
const why = result.why ? `<p${result.code === 0 ? '' : ' class="stick-bad"'}>${E(result.why)}</p>` : '';
```

Escaped with the function's own `E` (`stick.js:23`, which already maps null to empty). `stick-bad` only on a non-zero
code, because `why` can be present on success (`stick-apply.js:270`, `obj.why || null`) and should not read as an
error there. **That class choice is the one design call here.**

**Red first** — four tests added to `stick.test.js`, run against the unchanged `stick.js`:

```
FAIL D067: a refused transfer shows its WHY — the pid and the command — inside the last-transfer section
FAIL D067: the OUTCOME is shown, so APP_RUNNING is told apart from a crash that shares no exit code
FAIL D067: WHY is ESCAPED — a result file cannot put markup on the keeper's screen
ok   D067: an OLDER result with no why and no outcome renders neither — no empty line, no "null", no "undefined"
16 passed, 3 failed
```

The fourth is green on the old code by design — it guards the *fix*, and its mutant (M4) proves it can fail. After:
**19 passed, 0 failed.**

**Pinned by shape, not token.** The first test extracts the `<section><h3>The last transfer … </section>` block and
asserts the pid and the command are **inside it** — so a copy of the reason printed elsewhere on the page does not
pass. M6 below is that assertion earning its keep.

**Mutants on copies** (`scratchpad/nul/stick_mutants.js`; re-copies `stick.js`, `stick.test.js`, `term.js` per row;
anchor checked exactly once or NOT APPLIED):

```
M1 why rendered without escaping           18p/1f  WHY is ESCAPED
M2 outcome never rendered                  18p/1f  the OUTCOME is shown
M3 why never rendered                      17p/2f  a refused transfer shows its WHY | WHY is ESCAPED
M4 why line rendered even when absent      18p/1f  an OLDER result … renders neither
M5 outcome printed raw as a word           17p/2f  WHY is ESCAPED | an OLDER result … renders neither
M6 why placed AFTER the section closes     18p/1f  a refused transfer shows its WHY — … inside the last-transfer section
CONTROL reword a comment                   19p/0f  SURVIVED
SKIP-CONTROL anchor not present            NOT APPLIED — anchor matched 0 times

tracked stick.js unchanged: true
```

**6 applied · 6 caught.** M6 is the one I would point at: the pid is on the page, one element too late, and only the
section-scoped assertion catches it.

---

## 3 · E's QUESTION: IS "DO NOTHING IF CONSONANCE IS ALREADY RUNNING" TOO CAUTIOUS?

`handback/p-launch-pull-E_2026-09-16.md` §2, ruling 3. **Ruled from `consonance/launch.ps1` at source.**

### No — and the reason is stronger than the one E gave

E cites `launch.ps1:147-158`: the rebuild cannot happen while the exe is locked, so a pull *"buys nothing this
launch."* That is true and it is the weaker half. **The stronger half is on the close path.** The running exe does not
carry its own copy of the carry script — it runs the repo's:

```
consonance/src-tauri/src/main.rs:10596     .map(|r| r.join("dev").join("tail-carry.js"))
```

So a fast-forward under a live session hands **the next close** a `dev/tail-carry.js` newer than the exe that calls
it — **version skew on the one path that writes the stick.** My own map carries the precedent (L058 preflight, 09-14:
*"the export is A's working tail-carry.js at close time, not the waiter's load"*). **E's rule prevents exactly that,
and it should say so, because "buys nothing" invites someone to relax it.**

### But it is SILENT in one reachable case, and there silence is the failure

The check and the skip, verbatim:

```
launch.ps1:159   if (Get-Process -Name 'consonance' -ErrorAction SilentlyContinue) {
launch.ps1:160     Write-Host '  pull: Consonance is running - not touching the checkout.' -ForegroundColor DarkGray
```

And the launcher is started by:

```
launch.vbs:20    sh.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File …", 0, False
```

**`Get-Process -Name` matches ANY `consonance.exe`, windowed or not, and on the Desktop-shortcut path its one line of
explanation is printed into a window nobody can see.** Combine that with what `dev/stick-apply.js:56` records from this
morning — *"2026-09-16 08:40-08:52: a windowless consonance.exe left by an earlier launch"* — and the case is:

> a windowless Consonance survives a crash → every launch sees "running" → every pull is skipped → the one line
> saying so goes to a hidden console → **the keeper opens a stale build, unknowingly, launch after launch.**

That is the exact failure E's feature exists to prevent (E's own ruling 2 quotes it: *"the whole ask is not getting
the old build unknowingly"*), reached through the rule's quiet branch instead of through its failure branches.

### What I would change — not built; the file is E's

**Keep the rule. Make the skip loud only when the process holding it is one the keeper cannot see:**

- if every running `consonance.exe` has no main window (`MainWindowHandle -eq 0`) **and** has been alive past a grace
  period → **one Notify**: *"A Consonance with no window (pid N) is running, so the update check was skipped. End it,
  then launch again."*
- otherwise → the console line, unchanged.

**The grace period is not optional**, and `dev/stick-apply.js:53-74` is the precedent and already measured it: an app
that has just been launched is legitimately windowless for seconds, so a bare `MainWindowHandle -eq 0` would fire on
every double-click during startup. **Reuse the 30 s (`WINDOWLESS_GRACE_MS`, `stick-apply.js:74`) rather than invent a
second number for the same process.**

**What I would NOT change:** do not pull while *any* Consonance runs, windowless or not. A windowless process may be
the app mid-exit or mid-Leave, and its close path reads `dev/tail-carry.js` exactly as a visible one does.

---

## 4 · WHAT I DID NOT VERIFY

1. **The essay CLI's byte-identity is over a snapshot**, and it ran in place because `REPO_ROOT` is derived from
   `__dirname` (`essay-provenance.js:108`). So the space-separator **control could not be run through the essay CLI**
   — only through `correctionKey` directly. The claim that the essay separator is not collision-bearing rests on the
   fixed-width sha and the three-key probe, not on a CLI run.
2. **One fixture per tool.** The coupling fixture is built to collide; I did not sweep corpora.
3. **(1) has one mutant class** — the separator's value — not a mutant list. The census itself is A's tool and was
   mutation-proven in L063; I relied on it rather than re-proving it.
4. **(2) is proven in the vm harness, not in the app.** No rebuild, no relaunch; no keeper has seen the new lines.
   `stick-bad`'s styling is assumed from its existing use in the same file.
5. **§3 is a read.** I did not run E's fixture suite, did not reproduce a windowless zombie, and did not check whether
   `MainWindowHandle` is populated for Tauri's WebView2 window at the moment the launcher runs.
6. **The Write-tool decoding finding** was probed once, on this machine, with three spellings. I did not establish
   which layer does the decoding.
7. **Why the child spawns first failed:** node's `spawnSync` from the long scratchpad path returned **ENOENT for
   `node.exe` itself**, and an explicit `cwd` fixed it. Found because all five first captures shared one 78 B hash;
   the cause of the ENOENT was not established.

---

## 5 · WRONG (mine)

- **W1. The hand-back in which I ruled on NUL escapes carried a raw NUL**, in the exact sentence claiming the escape and
  the byte are identical. And the symptom was in front of me that night: the map-line heredoc refused with *"control
  characters"*, and I rewrote the map line through the Write tool instead of asking why. **Class: routing around a
  refusal instead of reading it** — the same class as a gate whose message is not read.
- **W2. My first byte-identity run was green on nothing.** All five "before" captures shared one hash at 78 bytes — every
  child `node` spawn had failed with ENOENT, and the harness captured the identical error five times. It would have
  compared equal after the repair too, and I would have reported the bar met. **Caught because two different tools
  cannot print the same 78 bytes.** Class: *a probe that captures its own failure is deterministic, and determinism
  was the thing I was checking for.*
- **W3. I nearly spelled the repairs with the unicode escape**, to match E's precedent in `boundary-check.js`, before the
  probe showed that spelling is the one the Write tool decodes. Consistency with a precedent would have re-planted the
  defect in any later hand-edit of those lines.
- **W4. And then I did it again, in THIS file, while documenting it.** §1 quotes `repair.js`'s own output line for the
  markdown fix, and that quotation contains the unicode escape. Written through the same tool, **it arrived as a raw
  NUL at byte 3050 of this hand-back.** `text-census.js` exited 0 anyway — **it scans TRACKED files only**, and a new
  hand-back is untracked until someone commits it. Found only because a `grep -c` for the escape text returned 0 where
  the text should have been. Repaired byte-level; re-verified with a node byte scan (0 NUL) and with the census run
  over the file marked intent-to-add (`git add -N`, 2,133 files, exit 0, then reset). **Two findings in one:** the
  hazard in §1 is not a one-off, it recurs every time a seat *quotes* the escape; and **the census cannot see a
  hand-back before it lands**, so a pane's own file is exactly the place it will not catch. Worth a line in
  `text-census.js`'s header, or a `--path` mode a pane can run on its own file before ringing.

---

## 6 · THE ONE LINE

**The three NULs are gone with every probe byte-identical and a control proving the probes could see a change; the
keeper will now read the refusal that names the pid; and E's launch rule is right to hold still, but it holds still
in silence exactly when a windowless Consonance makes silence the stale build.**

NEXT: librarian re-derive `text-census.js` exit 0 and `node consonance/ui/stick.test.js` 19/0 when this lands, then the chair carries §3's windowless-Notify suggestion to E as E's call.
