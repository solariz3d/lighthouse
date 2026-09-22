# P-D105-OVERSEERSOFF · ALPHA — the Claude overseers are switched off on D; Jev is the only judge. Both registrations are gone from settings.json (exactly 2 of 14 hooks, everything else structurally identical), `LiveOn` is retired so `Excluded` governs every machine, and 11 finished turns after the switch made 0 overseer jobs

**Pane A, machine D, 2026-09-22 09:14–09:3x.** Lap D105 packet A. The keeper, 09:12, verbatim: *"Yes switch them off,
only jev"* (`exo_memory/librarian/2026-09-22.md` "09:1x"). **Two repo files, uncommitted:** `dev/shell/install.ps1`
(+15 −4) and `consonance/tools/install-only.test.js` (+16 −8), per `git diff --numstat`. **One file outside the repo:**
`~/.claude/settings.json`. **Not touched:** the worker files (`hooks\l2-overseer.js`, `-worker.js`, `l3-…`), which are
all still installed; the ledgers; `install.ps1` itself was only run with `-Check`.

## 1 · settings.json — two entries out, nothing else

    backup   C:\Users\nname\.claude\settings.json.bak-d105-overseersoff-20260922      (cp -p, before any edit)
    sha256   BEFORE 25c403fdb6a2e3c963b22c77fca6881ae3cde098623e42da92fbfba340f1af4e   (= the backup)
             AFTER  79f8b8bdfc64058a5c9cef80c1b5a56390ccfb1aa913b6d3f3b2dc7aedd5d90b
    written  2026-09-22T15:17:28.097Z (09:17:28 local, the file's mtime)

The removal was a text-level splice, so indentation and CRLF were kept. It matched each hook object by its **WHOLE**
command string, never a substring:

    "C:\Program Files\nodejs\node.exe" "C:\Users\nname\.claude\shell\hooks\l2-overseer.js"     (was :51)
    "C:\Program Files\nodejs\node.exe" "C:\Users\nname\.claude\shell\hooks\l3-overseer.js"     (was :55)

The structural proof was run in the same script (`node <scratchpad>/d105-settings.js <settings> [--write]`). It
parses the file, removes the entries whose command `===` one of the two strings, and asserts
`deepStrictEqual(parse(after), expected)`:

    hooks before 14 · after 12 · removed 2 · structure otherwise identical: true (deepStrictEqual)
    top-level keys identical: true · bytes 7003 → 6309 · CRLF kept: true · overseer mentions left: 0

`diff backup settings.json` shows only the two `{type, command}` objects. The other three Stop hooks (`stop.js`,
`sourced-stop.js`, `ready-stop.js`) are untouched.

## 2 · install.ps1 — `LiveOn` retired, the old entries kept as a trace

At `:199-221`, the 09-21 "ANSWERED FOR D" paragraph stays as it was. Below it, a new dated paragraph: **"WITHDRAWN FOR D,
2026-09-22 09:12 (D105)"**, quoting the ruling and citing the librarian record, with the two entries as they stood
until now copied verbatim as comments. The live entries lose `LiveOn`/`LiveOnWhy`. Their `Excluded` reason now reads
`…ready pair only (librarian/2026-09-06.md:603); on D too since keeper 2026-09-22 09:12 - only jev (D105)`, so the
reason `-Check` prints names today's ruling. **No write path ever registered an Excluded entry. That code path is not
changed, so no run, bare or `-Only`, re-registers them.** The `LiveOn` mechanism itself (`:576-597`) is left in place,
unused: removing working code was not asked for. Parse: `[Parser]::ParseFile` → 0 errors.

## 3 · TESTS — red first, and two of my own tests withdrawn

The two D099 cases in `install-only.test.js` pinned the 09-21 answer, which is now withdrawn:
- *"ON D, both overseers live read LIVE HERE BY RULING … -Check is GREEN"*
- *"ON D, an overseer ABSENT is RED: RULED LIVE HERE, NOT REGISTERED"*

**Under the 09:12 ruling both are verifiably wrong.** They were withdrawn and replaced by their inverses, with a dated
comment in the file quoting the ruling:
- **ON D (D105), both overseers live are EXCLUDED BUT LIVE.** `-Check` is red and names both, and there is no "LIVE HERE
  BY RULING" line.
- **ON D (D105), both overseers absent are EXCLUDED BY RULING, correctly absent.** `-Check` is green, and a bare run on D
  registered neither.

The stop.js-on-D case is unchanged and still passes.

    node consonance/tools/install-only.test.js     BEFORE 17/0 · RED (new tests, old installer) 15/2 · AFTER 17/0
    node consonance/tools/universe-print.test.js   16/0 → 16/0
    node consonance/hooks/dream-gate.test.js       58/0 → 58/0

**The real `-Check` on D**, run plainly (`powershell -File dev/shell/install.ps1 -Check`):

    BEFORE  2 EXCLUDED ELSEWHERE, LIVE HERE BY RULING   l2-overseer.js, l3-overseer.js       EXIT=1
    AFTER   2 EXCLUDED BY RULING, correctly absent       l2-overseer.js, l3-overseer.js  (… "only jev (D105)")
            0 lines containing "LIVE HERE"                                                   EXIT=1

**EXIT=1 both times, for three pre-existing reasons, none of them the overseers:**
- 3 DECLARED, NOT REGISTERED: `userprompt_pulse.py`, `dispatch-gate.js`, `carrier-drift-watch.js`;
- 1 REGISTERED, NOT DECLARED: `userprompt-submit.js`;
- `stop.js` is EXCLUDED BUT LIVE against the 09-06 ruling. **The keeper's answer named the overseers, not stop.js, so I
  left it live on D.** Whether it goes too is his call.

**Mutants, on a COPIED tree.** The copy holds `dev/shell/{install.ps1,lib,hooks}`, `consonance/hooks` and the test
file, and the test resolves REPO from its own directory. The live files were hashed before and after.

    node <scratchpad>/d105-mutants.js <work>          pre-flight on the copy 17/0
      killed (15/2)  LiveOn D put back on l2 only
      killed (15/2)  LiveOn D put back on l3 only
      killed (14/3)  l2 Excluded removed (a bare run would register it)
      killed (13/4)  l3 Excluded removed (a bare run would register it)
    4 listed · 4 killed · 0 survived · 0 NOT APPLIED · live files unchanged: true

## 4 · LIVE PROOF — real finished turns after the write

**Does a running session drop a removed hook?** The docs say yes: *"If you edit settings files directly while Claude
Code is running, the file watcher normally picks up hook changes automatically"* (code.claude.com/docs/en/hooks-guide,
"Configure hook location"). The word "normally" is why this was measured, not assumed. Measured at 15:25:09Z and again
at 15:33:37Z (node over the two job dirs, the two ledgers and `jev-shadow/judge-captures`, each compared with the
settings mtime):

    real turns finished after the write (judge-captures newer than it)    6 at 15:25 · 11 at 15:33
    l2-jobs / l3-jobs files newer than the write                          0 / 0
    l2_overseer.jsonl  8297 → 8298 rows   the +1 is job 1790090240387, CREATED 15:17:20Z, 8 s BEFORE the write
    l3_overseer.jsonl  8291 → 8292 rows   the +1 is job 1790090240409, CREATED 15:17:20Z, 8 s BEFORE the write
    rows from a job created after the write: 0 (l2) · 0 (l3) · rows with no job id after it: 0 · 0

So the two rows that landed after 09:17:28 were **already in flight**: a turn that ended at 15:17:20 queued them before
the switch. **From 11 turns after it, not one job was made.**

**Jev keeps judging:** `jev_judge.jsonl` gained **10 rows** stamped after the write, and `shadow.jsonl` gained **15**
(15:25 count). The judge-mode lines in `runner.log`: *"judge: asked 10 … failed 15, remaining 4"* (15:21:20Z) and
*"judge: asked 19, refused 0, failed 6, remaining 6"* (15:31:18Z). **Many calls fail at the gateway: 503s and 429s.** L078
made those skip and retry rather than end the pass, and that is what the log shows. Whether the 429s are Jev's rate limit
or the shared daily cap I did not establish.

**NOT YET SEEN: the shadow's "nothing to shadow".** At 15:31:11Z it logged *"shadow: asked 2, refused 0, failed 1"*. Those
are **retries of captures made BEFORE the switch**: the item ids decode to 15:13Z–15:15Z, and they were refused with 503 at
15:21Z. No new overseer verdict can arrive for it to shadow, so the line is due once the last pre-switch item succeeds,
probably at the next cadence (~15:41Z). **I did not wait for it.** This is a prediction, and anyone can check it:
`grep "nothing to shadow" %LOCALAPPDATA%\consonance\jev-shadow\runner.log`.

## 5 · WHAT I DID NOT VERIFY

- **The Third Place / any seat started AFTER the write.** Every turn counted was in a session that was already running
  (the librarian `0c0c0c0b`, this pane, `0c0c0c0a`). A new session reads the file fresh, so it has the least reason to
  differ, but it was not observed.
- **The shadow's "nothing to shadow"** (§4).
- **Machine L.** Nothing there changed: `Excluded` already governed it, and its settings were not touched.
- **Who still reads the overseers' output.** `~/.claude/shell/hooks/session-start.js:48` and `userprompt-submit.js:43`
  read `l3_overseer.jsonl`. The session-start "L3 — arc-perceptions surfaced" block has a 24 h lookback (`:57`), and when
  there are no notices it is left out (`if (l3Notices.length > 0)`, `:245`). So it will fade out by itself, by about
  2026-09-23 09:18, with no error. That is read from source. I did not run it, or check what `userprompt-submit.js` does
  with an empty window. The worker files, the job dirs and their 7 old job files are left as found.

NEXT: librarian re-run §3's three suites and §4's count, then collate D105 A, when this file is read
