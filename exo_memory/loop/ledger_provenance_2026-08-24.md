# What is writing `~/.claude/shell`'s four ledgers — provenance, caught live

*Pane E, 2026-08-24. Adversarial read of the open question in pane C's census
(`exo_memory/loop/install_drift_census_2026-08-24.md`, `2da35a0`). **Read-only throughout:**
`install.ps1` was not run in any mode, nothing was copied into `~/.claude/shell`, `settings.json`
was not edited, no process was killed, and **I ran no test and no suite** — running one would have
appended to the very ledgers under investigation. `dev/shell/install.ps1` untouched (chair's),
`consonance/tools/actors*` untouched (A's), `consonance/tools/carrier-drift*` and
`consonance/hooks/carrier-drift-watch*` untouched (B's), `install_drift_census` untouched (C's).
Handed back uncommitted. Every figure below is from one measurement run at **06:55:22 local**.*

---

## THE ANSWER

**`consonance/tools/js-suite.js` → `consonance/hooks/dream-gate.test.js` → the six hooks, spawned as
subprocesses with a synthetic payload.** Not inferred — **caught in the act.**

C's mechanism is right. What C could not do from inside its own packet was *observe the caller*;
that is the part I can add, and it closes.

**C's registered falsifier, run independently and at a larger n than C had:**

> *"The test-residue finding dies if any row in these ledgers is found with a `cwd` outside
> `…\Temp\dreamgate-instances\` or a `session_id` other than the fixture constant."*

```
MEASURED AT 2026-08-24 06:55:22 local
event_log.jsonl     rows=276   fixture-cwd 276/276   transcript_path=null 276   distinct sids 1
l2_overseer.jsonl   rows=276   (no cwd field) 276    transcript_path=null 276   distinct sids 1
l3_overseer.jsonl   rows=276   (no cwd field) 276    transcript_path=null 276   distinct sids 1
```

Every row scanned, not sampled, at 276 rows per file — 14 more than C's read. **The falsifier does
not fire.** Nothing survives that C's finding does not already cover.

### The signature is *entailed*, not merely consistent — four fields, four source lines

`dream-gate.test.js:236` feeds every hook exactly
`{ cwd, session_id: '0c0c0c0a-…-000000000a01', source: 'startup' }`. From that one literal:

| ledger field | value in all 276 rows | why it *must* be that |
|---|---|---|
| `cwd` | `…\Temp\dreamgate-instances\sibling-gate-test` | built at `dream-gate.test.js:192,222` — **and nowhere else in the repo** (grepped) |
| `session_id` | `0c0c0c0a-…a01` | the constant at `dream-gate.test.js:195` |
| `transcript_path` | `null` — 276/276 | the fixture payload **has no such key** |
| `reason` | l2 `"view extraction returned null"` · l3 `"no user text turns found in trajectory view"` | forced by that null at `l2-overseer.js:60` |

A hook invoked by the live harness receives the *real* session's cwd and a real transcript path. **No
production invocation can produce these rows.** That is not a plausible mechanism rounded up to a
confirmed one; it is a four-field match with a named source line for each.

### Caught live, which is the part that was missing

While writing this, `Get-CimInstance Win32_Process` returned:

```
PID 36068   2026-08-24 6:53:11 AM   node.exe consonance/tools/js-suite.js
PID 39024   2026-08-24 6:53:50 AM   node.exe …\consonance\tools\js-suite.js
```

The newest `event_log.jsonl` row at that moment: **`2026-08-24T12:53:13.460Z` = 06:53:13 local —
two seconds after the suite started.** `js-suite.js:67-73` discovers every `*.test.js` by recursive
`readdirSync`, so it necessarily picks up `consonance/hooks/dream-gate.test.js`.

**The writer was running while I measured it, and the row it wrote is timestamped inside its own
process lifetime.**

### The row structure confirms the caller's shape independently

`dream-gate.test.js:189-191` runs each hook **twice per invocation** — once ungated to classify, once
gated to prove the fixture still works. The ledger shows exactly that and nothing else:

```
tight pairs (<1s apart) = 138      rows/2 = 138      bursts (gap>120s) = 89
```

**138 pairs for 276 rows — every single row is one half of a twice-per-hook pair, ~70ms apart.** Not
one orphan row exists. A live Stop would arrive singly.

---

## THE FINDING THAT IS NOT "TEST RESIDUE": THIS CLASS WAS DIAGNOSED, WRITTEN DOWN, AND FIXED FOR ONE HOOK

This is the part I would put in front of the chair before anything else, and C did not reach it.

**The room already found this exact failure, six days ago, and recorded the mechanism verbatim.**
`consonance/hooks/precompact-preserve.test.js:110-113`:

> *"Added after this hook wrote **112 test rows into the production ledger**. `dream-gate.test.js`
> spawns every hook with `CONSONANCE_DATA` set and cannot know each hook's private env var, so a hook
> that honours only its private override is unsafe under any generic harness. **The failure is
> invisible in the worst way: the pollution looks exactly like the activity being counted.**"*

That last sentence is C's finding, written into this repo before C made it.

**The timeline, on one morning:**

| local time, 2026-08-18 | event |
|---|---|
| **00:42:36** | first row of all four ledgers — the harness's first run |
| **06:09** | `precompact.jsonl` quarantined → `data/precompact.polluted-by-tests-20260818.jsonl` (24,823 bytes) |
| **06:17** | `a3cf3c3` lands the fix: `precompact-preserve.js` honours `CONSONANCE_DATA`, with the comment above |

**The four ledgers were already five and a half hours into being polluted when the fix for the same
class landed on the hook next door.** And the fix never travelled:

```
$ git log --oneline -S'CONSONANCE_DATA' -- dev/shell/hooks/
(no output — never, in the entire history of those six files)
```

All six writers resolve unconditionally from `os.homedir()`:

```
stop.js:15  l2-overseer.js:28  l3-overseer.js:35
session-start.js:19  session-end.js:25  userprompt-submit.js:22
    const SHELL_DIR = path.join(os.homedir(), '.claude', 'shell');
```

**Zero of six honour the override. One hook was immunised; the six that were already bleeding were
not, and nobody checked whether the class had other members.** That is a carrier problem, not a test
problem — the correction existed, was unambiguous, and did not propagate. Same shape as BOOT's own
2026-08-23 amendment about the withdrawn wording that stayed live in six files for seven days.

---

## THE CHAIR'S SAFETY QUESTION, ANSWERED: ZERO MODEL CALLS. EVER.

The packet's live worry — *"either those are firing and nobody is reading the output, or they are not
and something else owns the ledgers"* — has a third answer: **they fire, and they abort before the
expensive part.** Three independent confirmations:

1. **Every row is a skip.** `l2_overseer_skipped` 276/276, `l3_overseer_skipped` 276/276. Not one row
   records a job being queued or a worker starting.
2. **The skip precedes the spawn structurally.** `l2-overseer.js:60` returns null when
   `transcript_path` is missing; the spawn is at `:124`, the skip log at `:143`. With a null
   transcript the spawn line is unreachable.
3. **The spawn's own side effects are absent.** `JOBS_DIR` is created at `:112`, immediately before
   the spawn. `~/.claude/shell/l2-jobs` and `l3-jobs` **do not exist**, and neither does
   `~/.claude/shell/hooks/`, where `WORKER` points.

**No Haiku call has ever been spawned by this path on this laptop.** The 138 invocations cost
process spawns, not tokens.

---

## HOW FAR THE POLLUTION REACHES — and two corrections I had to make to my own scan

**Reach: exactly four files.** `event_log.jsonl`, `l2_overseer.jsonl`, `l3_overseer.jsonl`,
`userprompt_state.json`. No other ledger on this machine carries harness rows.

Getting there required catching myself twice, and both corrections matter because either one would
have shipped a false number:

- **I first scanned for the session id and got `94,470 / 97,467 rows of board.jsonl`.** Wrong, and
  badly. `0c0c0c0a-…a01` is **Main's real pane id** — `dream-gate.test.js` *borrowed a production
  identifier for its fixture*. Matching on it libels six days of genuine board traffic. **Only the
  temp `cwd` discriminates**, and this is precisely why C's first read was reasonable rather than
  careless: the id really is Main's.
- **The corrected scan then reported 2 marked rows in `board.jsonl`.** Also wrong: both are C's own
  report text *quoting the word* `dreamgate`. Prose about the finding, not residue of it. **The true
  count in `board.jsonl` is zero.**

`precompact.jsonl`, `sourced_ledger.jsonl` and `head-watch.jsonl` matched only on the shared session
id and are **clean** — those are genuine Main rows.

**`userprompt_state.json` is the worst of the four and is not a log.** It is *state*, overwritten
rather than appended: its `first_seen_iso` of `2026-08-18T06:42:36.760Z` is the harness's first run,
and its `last_prompt_iso` is the harness's most recent one. Any hook reading it for "when did this
session first appear" gets a fabricated answer. Nothing live reads it today only because
`userprompt-submit.js` is unregistered.

---

## CLOSING C'S FALSIFIER #1 FROM DIRECTIONS C DID NOT SEARCH

C registered: *"The DON'T-LAND set dies if a registration source for any `hooks\*` leaf is produced
on this laptop that I did not search."* C named what it searched. I took the three paths it did not:

| checked | result |
|---|---|
| `C:\ProgramData\ClaudeCode\managed-settings.json` (enterprise/managed policy) | **does not exist** |
| `C:\ProgramData\Claude\managed-settings.json` | **does not exist** |
| `~/.claude.json` (legacy global config, 144,867 bytes — **not in C's search list**) | **no match** for any of the six leafnames |

**No registration exists for any of the six, anywhere I or C have looked.** C's ruling stands, and
its falsifier is now closed from one more side. The corollary is worth stating plainly: since none of
the six has ever been registered on this laptop, **there were never any real rows for the harness
output to be confused with** — the ledgers are not *contaminated*, they are *entirely* synthetic.

---

## THE DISK MOVED UNDER ME MID-PACKET — timestamp every figure

At **06:49** my own `ls -la` of `~/.claude/shell` showed `ferry-watch.js` at **6,984 bytes,
2026-08-10 06:13**, and **no `carrier-drift-watch.js` at all**. At **06:52:57** the same directory
showed `ferry-watch.js` at **7,838 bytes** and `carrier-drift-watch.js` present at **8,194 bytes**,
both byte-matching repo HEAD. `carrier-drift-watch.js` is also now registered as a `Stop` hook in
`~/.claude/settings.json`, where C's census recorded it as *not* registered.

C's LAND rulings were executed while I held a read-only packet. **Nothing is wrong here** — it is
the chair doing exactly what the census recommended. It is recorded because it makes C's per-file
table historical as of ~06:50, and because it is a live demonstration that a census of a moving disk
needs a timestamp on every row. Mine has one.

*All eleven registered hook targets were verified present on disk at 06:52 — the "registered against
a file that does not exist" defect C predicted for `userprompt-submit.js` is **not** live today.*

---

## WHAT I COULD NOT ESTABLISH — stated, not rounded

- **Who invoked the other 137 runs.** I caught **one** caller live (PID 36068, 06:53:11) and can
  bind that one to the row it wrote. For the remaining 88 bursts I have the *proximate* writer
  proven by signature and the *class* of caller (a suite run), but **not which pane or person
  started each one.** The ledgers record no caller, and I did not try to reconstruct it from
  transcripts.
- **Whether the same pollution exists on the desktop.** Nothing here reaches the other machine. The
  desktop is where these six hooks are believed to actually run, which means **there the same rows
  would be real** — and a future reader comparing the two beds must not assume this verdict travels.
- **Whether `dream-gate.test.js` is the only harness that can produce this shape.** I grepped the
  repo for both fixture constants and found only that file. I did **not** search outside
  `C:\Consonance\lighthouse` for another clone or an untracked script.
- **How many of the 138 invocations came from `js-suite` versus a direct `node dream-gate.test.js`
  versus `dev/mutation/mutate-sss.js:31`** (which runs the same test inside a mutation loop, and is
  a plausible source of the dense early bursts). All three produce identical rows.
- **I did not verify the count by re-running anything**, deliberately. Every number here is read
  from files, never generated by me.

---

## REGISTERED, SO THIS CAN BE SHOWN WRONG

1. **The provenance dies** if a row is produced in any of the four files whose `cwd` is not the temp
   fixture path, or — for l2/l3, which carry no cwd — whose `transcript_path` is non-null. Either
   would mean a real invocation reached them. 276/276 checked; the only way to kill it now is a
   ledger I did not look at.
2. **The "caught live" claim dies** if `js-suite.js` can be shown not to reach `dream-gate.test.js`,
   which would make the 06:53:11/06:53:13 coincidence a coincidence. `js-suite.js:67-73` is the
   discovery code; if its walk excludes `consonance/hooks/`, I am wrong about the caller *and still
   right about the writer*. **I ran this one before publishing:** `SKIP_DIRS` (`js-suite.js:62`) is
   `node_modules, .git, target, gen, __pycache__, attic` — it excludes neither `consonance` nor
   `hooks`, and `dream-gate.test.js` is one of eleven `*.test.js` files the walk finds there.
   **Tested; did not fire.**
3. **The carrier finding dies** if `CONSONANCE_DATA` handling is found anywhere in the six hooks'
   history under another name. I searched only that literal string via `git log -S`.
4. **This document is degenerating** if it is cited as saying the four ledgers are *broken* or the
   six hooks are *wrong*. It says the ledgers are 100% synthetic on this laptop, that no model call
   ever fired, and that a known fix reached one hook and not its six siblings.

---

## THE ONE-LINE RECOMMENDATION, offered and not executed

The cheap correct fix is the one already written and proven on `precompact-preserve.js`: have the six
resolve `SHELL_DIR` as `process.env.CONSONANCE_DATA || path.join(os.homedir(), '.claude', 'shell')`.
That is one line each, it is the room's own existing pattern, and `dream-gate.test.js` already sets
the variable for every hook it spawns (`:230`) — **so the harness would isolate itself with no change
to the test at all.**

The four current files are not repairable by filtering; they contain nothing else. The room's own
precedent from 08-18 is to **rename, not delete** (`precompact.polluted-by-tests-20260818.jsonl`).
**Not done by me** — writing into `~/.claude/shell` is outside this packet.

---

## REPRODUCING EVERY FIGURE

```bash
cd /c/Consonance/lighthouse

# every row, every field - the falsifier
node -e "const fs=require('fs');for(const f of ['event_log.jsonl','l2_overseer.jsonl','l3_overseer.jsonl']){const p='C:/Users/zackn/.claude/shell/'+f;const rows=fs.readFileSync(p,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);const fix=rows.filter(r=>!('cwd' in r)||String(r.cwd).includes('dreamgate-instances')).length;console.log(f,'rows='+rows.length,'fixture='+fix,'nullTp='+rows.filter(r=>r.transcript_path===null).length,'sids='+new Set(rows.map(r=>r.session_id)).size);}"

# the pair structure: every row is half of a twice-per-hook pair
node -e "const fs=require('fs');const t=fs.readFileSync('C:/Users/zackn/.claude/shell/event_log.jsonl','utf8').split(/\r?\n/).filter(Boolean).map(l=>Date.parse(JSON.parse(l).timestamp));let p=0;for(let i=1;i<t.length;i++)if(t[i]-t[i-1]<1000)p++;console.log('pairs='+p,'rows/2='+t.length/2);"

# the fixture is the only source of those constants
grep -rn "dreamgate-instances\|sibling-gate-test" --include=*.js --include=*.ps1 . | grep -v exo_memory

# the fix that reached one hook and not six
git log --format='%h %ad %s' --date=format:'%Y-%m-%d %H:%M' -S'the ledger honours CONSONANCE_DATA' -- consonance/hooks/precompact-preserve.test.js
git log --oneline -S'CONSONANCE_DATA' -- dev/shell/hooks/     # empty, always

# all six resolve from homedir, unconditionally
grep -n "SHELL_DIR = " dev/shell/hooks/*.js
```

```powershell
# catch the caller in the act (re-run while any pane is running the suite)
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Select-Object ProcessId,CreationDate,CommandLine
```

---

*Pane E, 2026-08-24, handed back uncommitted. Read-only held: no test run, no suite run, no
`install.ps1` in any mode, nothing written to `~/.claude/shell`, `settings.json` unedited, no process
signalled. One new file, mine alone. Two self-corrections kept above rather than quietly fixed.*
