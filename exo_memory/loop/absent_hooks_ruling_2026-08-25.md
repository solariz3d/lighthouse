# The twelve absent hooks — a per-file ruling

*Pane C, 2026-08-25. Packet: the tail of my own `install_drift_census_2026-08-24.md` (`2da35a0`),
after the chair fixed `-Check` on that finding (`1e63d3a`) and hand-installed the two files that
needed it. Read-only throughout: `install.ps1` was run **only** with `-Check`; nothing was copied
into `~/.claude/shell`; `dev/shell/install.ps1` and `~/.claude/settings.json` were not edited; A's
`ferry.js`, B's carrier chain and E's attack were not touched. Every hook executed during this work
ran with `CONSONANCE_DATA` or `USERPROFILE` redirected into a scratchpad. Handed back uncommitted.*

---

## THE RULING, IN ONE TABLE

| # | manifest `To` | bytes | ruling |
|---|---|---|---|
| 1 | `lib\ambient.js` | 10,663 | **DO NOT INSTALL** |
| 2 | `lib\fresh-guard.js` | 1,266 | **DO NOT INSTALL** |
| 3 | `hooks\session-start.js` | 13,471 | **DO NOT INSTALL** |
| 4 | `hooks\userprompt-submit.js` | 13,620 | **DO NOT INSTALL** — and cannot be installed by this installer |
| 5 | `hooks\stop.js` | 3,013 | **DO NOT INSTALL** |
| 6 | `hooks\session-end.js` | 8,064 | **DO NOT INSTALL** |
| 7 | `hooks\precompact.js` | 3,110 | **DO NOT INSTALL** |
| 8 | `hooks\l2-overseer.js` | 6,602 | **DO NOT INSTALL** |
| 9 | `hooks\l2-overseer-worker.js` | 5,095 | **DO NOT INSTALL** |
| 10 | `hooks\l3-overseer.js` | 6,748 | **DO NOT INSTALL** |
| 11 | `hooks\l3-overseer-worker.js` | 6,021 | **DO NOT INSTALL** |
| 12 | `findings-return.js` | 15,026 | **INSTALL** — file and registration together, watched, not in a bulk run |

**Eleven do-not-install, one install, and the chair's half-expected answer is the right one.**
Nothing here goes to the keeper as a *state* decision. One thing goes up as a *direction* decision
and it is named in its own section below.

---

## THE PACKET'S PREMISE IS WRONG IN THE DIRECTION THAT MATTERS

The chair wrote, as something I need not re-derive: *"the two overseers spawn Haiku per Stop, which
is real recurring spend."*

**On this laptop, as the code stands, they spawn nothing. The recurring model spend of installing
both overseers today is ZERO, and so is their value.**

Both workers read their discipline document before doing anything else, from a path under the
user's Desktop:

```
dev/shell/hooks/l2-overseer-worker.js:18   LIGHTHOUSE_METHOD  = ~/Desktop/lighthouse/METHOD.md
dev/shell/hooks/l3-overseer-worker.js:18   LIGHTHOUSE_WELFARE = ~/Desktop/lighthouse/WELFARE.md
```

`C:\Users\zackn\Desktop` **does not exist**. The Desktop is redirected into OneDrive, and
`C:\Users\zackn\OneDrive\Desktop\lighthouse` does not exist either. The repo is at
`C:\Consonance\lighthouse`. There is no path on this machine at which either document resolves.

Not inferred from the source — **run, against the shipped bytes, with `USERPROFILE` redirected to a
scratchpad so nothing live was written**:

```
A: discipline doc ABSENT (this laptop's real condition)
   {"type":"l2_overseer_skipped", ... ,"reason":"METHOD.md not found at …\\Desktop\\lighthouse\\METHOD.md"}
   exit 0.  spawn('claude') never reached.  THE JOB FILE IS LEFT ON DISK.

B: same bytes, doc placed, `claude` off PATH
   {"type":"l2_overseer_parse_error", ... ,"stderr":"'claude' is not recognized …"}
```

B is the control: it proves the spawn is the immediate next step, so the no-op in A is the missing
document and nothing else. **The overseer pair is one path repair away from being exactly the
recurring cost the chair described — and today it is an inert pair of hooks that leaks files.**

### What they cost while inert

Measured against Main's real transcript, `CONSONANCE_DATA` redirected, three runs each. Transcript
size and tail constants, both cited:

```bash
stat -c%s /c/Users/zackn/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl
grep -n "TAIL_BYTES =" dev/shell/hooks/l2-overseer.js dev/shell/hooks/l3-overseer.js
```

Main's transcript is the live file Main is writing into, so **every reading of its size is already
stale** — it read 149,828,001 bytes when the runs were taken and 149,998,799 when cite-check
re-ran the same command forty minutes later. That drift is a property of the number, not a
footnote; the command below returns whatever it is now, which is what the latency figures should
be read against
(`stat -c%s /c/Users/zackn/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl`).
Nothing in the ruling turns on the exact value — only on it being far larger than the 4 and 8 MiB
the hooks read. The tail constants do not drift
(`grep -n "TAIL_BYTES =" dev/shell/hooks/l2-overseer.js dev/shell/hooks/l3-overseer.js`
→ `4 * 1024 * 1024` at l2-overseer.js:69, `8 * 1024 * 1024` at l3-overseer.js:85).

| hook | reads | latency, 3 runs | writes per firing |
|---|---|---|---|
| `l2-overseer.js` | last 4 MiB of the transcript | 90 / 84 / 78 ms | one 4,402-byte job file |
| `l3-overseer.js` | last 8 MiB of the transcript | 103 / 120 / 113 ms | one 8,319-byte job file |

The two job sizes sum to 12,721 bytes per Stop. Job sizes and latencies come from the sandboxed
run in the reproduction block below — `stat -c%s` on the emitted job files, and `date +%s%N`
either side of each hook. **They are not re-runnable from this line**: both need the scratchpad
that run created, and the latencies are warm-cache wall-clock, not a benchmark.

**~190–210 ms added to every turn end, per pane, for nothing** — plus a job file per Stop that is
never swept. The `unlink` that would clean one up lives inside the `claude` close handler
(dev/shell/hooks/l2-overseer-worker.js, line 129), which is never reached when the discipline
document is missing. Verified: three runs, three job files still on disk.

### And what they would cost if the path were repaired

Measured from the actual captured job payloads, not from the caps:

```
L2 prompt payload (METHOD.md 3,855 B + assistant_move 1,990 + user_context 2,184) =  8,029 chars
L3 prompt payload (WELFARE.md 8,609 B + 10 user turns, 7,595 chars)               = 16,204 chars
per Stop, both                                                                     = 24,233 chars
```

At ~4 chars/token — **an estimate, stated as one; no token counter was run** — that is ~6,100 input
tokens and ~140 output tokens per Stop. Claude Haiku 4.5 is **$1.00 / MTok input, $5.00 / MTok
output**, so ~**$0.0068 per Stop**.

The rate is measured, not assumed. `carrier-drift-watch.js` writes a ledger row on every firing
including the silent ones, so it is an honest Stop counter, and it has been registered since
2026-08-24:

```
42 firings over an 18.20-hour span, in 5 active hours, across 8 distinct panes
→ 8.4 Stops per active hour
```

**~$0.057 per active hour · ~$0.29 across the measured 18-hour span · ~$0.46 for an 8-hour night.**

**BUT THE CURRENCY IS NOT DOLLARS, AND THAT IS THE PART TO CARRY UP.** `env | grep -i anthropic`
returns nothing — no `ANTHROPIC_API_KEY`, no `ANTHROPIC_AUTH_TOKEN`. The spawned `claude -p`
authenticates on the Max plan. **The overseers would not bill; they would consume the same plan
quota the panes are working out of, at 16.8 extra model calls per active hour.** The dollar figures
above are what it *would* cost against the API and are the wrong unit for this machine.

### A third cost neither of us had priced: ledger contamination

`claude -p` fires this machine's user-level hooks. That is not a guess — it is why every hook in
this repo carries a `CONSONANCE_DREAM` gate: the dream cycle is a `claude -p` spawn, and without the
gate every hook fired for it (`precompact.js` wrote a 6,240-byte checkpoint for a dream).

The overseers gate re-entry with `CLAUDE_OVERSEER_RUN=1`. **Only `l2-overseer.js` and
`l3-overseer.js` check that variable. None of the eleven currently-registered hooks does:**

```
sourced-stop.js 0 · carrier-drift-watch.js 0 · sessionstart-state.js 0 · board-digest.js 0
transcript-watch.js 0 · dream-watch.js 0 · ferry-watch.js 0 · sessionstart-ambient.js 0
userprompt_pulse.py 0
```

So a repaired overseer pair would inject **two synthetic sessions per real Stop, per pane**, each
firing the full registered set — writing rows into `carrier-drift.jsonl`, `sourced_ledger.jsonl`
and `sessionstart-state.jsonl` that are indistinguishable from real turns. It would **triple the
apparent Stop rate in the very ledger I just used to price it**, and it is the same class E cleaned
up three days ago: an instrument reading as alive because a test harness was writing to it.

---

## THE FOUR `hooks\` FILES ARE A CLOSED SUBSYSTEM — ALL OR NONE, AND NONE

`session-start.js`, `stop.js`, `session-end.js` and `userprompt-submit.js` read and write exactly
two shared artifacts, `digests/` and `event_log.jsonl`. **Every reader and every writer of both is
one of those four files**, with one incidental mention:

```
digests/         → session-end.js (writes), session-start.js (reads).  open-items.js names the
                   path in a prose comment; it does not read it.
event_log.jsonl  → stop.js, session-end.js, session-start.js, userprompt-submit.js.  Nothing else.
```

That closes the question the packet asks. Install a subset and you get a writer with no reader
(`stop.js` alone), a reader with no writer (`session-start.js` alone), or a digest nobody opens.
Install the set and here is what it buys, measured against what is already registered and running:

| function of the set | already live here |
|---|---|
| ambient sky at wake (`session-start.js:238`, `ambient.renderTextBlock`) | **yes** — `sessionstart-ambient.js`, registered, `ok`. Installing would print **two sky blocks per wake.** |
| `[pulse]` beacon per prompt (`userprompt-submit.js:buildBeacon`) | **yes** — `userprompt_pulse.py:136` emits the identical line. **Two pulse lines per prompt.** |
| the interval since the last turn (`userprompt-submit.js:buildGapContext`) | **yes** — `userprompt_pulse.py:96`, ` · N since last msg`. |
| L3 arc-perceptions, at wake and mid-turn | **dead** — L3 is do-not-install, and its ledger would stay empty. |
| recent-session digests | on this laptop, a list of `session_stop` timestamps per cwd — **and nothing else**, see below. |
| **the night table** (dreams landed, duration goals fired) | **no. This is the one genuinely non-duplicated function in the set.** |

The digest's distinctive half is dead here by design. `session-end.js:appendPulseNote` returns early
when the cwd matches `/\\Consonance\\/i` — panes and dream cycles keep their own intake. **Every cwd
on this machine is under `C:\Consonance\`,** so the "What the pulse was for" section would be empty
in every digest this laptop ever writes.

**Ruling: DO NOT INSTALL, all four.** Two duplicated blocks per wake and a duplicated line per
prompt, to deliver a digest with its content half switched off and an L3 section with no L3.

**What is genuinely lost, stated so it can be lifted on purpose rather than by accident:** the
**night table** — the block that tells a terminal session which dreams landed and which duration
goals fired while this cwd was dark. Consonance's own pulse gives a restored pane the equivalent
(`main.rs::night_table`); a bare terminal session outside the app has no equivalent and would
have none. If that is wanted, it is worth ~120 lines of `session-start.js` as its own small hook
— not this subtree, which drags six duplicated or dead functions in behind it.

### And one of the four cannot be installed by this installer at all

`hooks\userprompt-submit.js` carries `Hold = $true`. The Hold branch blocks the copy in **both**
modes while `$register` holds an unconditional entry for it (`install.ps1:137`). A bare run
registers a `UserPromptSubmit` hook against a path the same run deliberately refused to create, and
every user prompt in every pane spawns node against a missing file. Filed in the census; still
true; it is a defect in the installer, not a property of this machine.

### `hooks\precompact.js` — a no-op by construction, in a slot already filled

`precompact.js:29` resolves `%USERPROFILE%\Desktop\lighthouse\exo_memory\loop\checkpoint.py` —
proven absent above, along with the whole Desktop tree. Its own guard (`if (!fs.existsSync(SCRIPT))
process.exit(0)`) makes it a clean no-op rather than an error, which is the right construction and
also the whole argument against installing it. `precompact-preserve.js` is registered on PreCompact
and `ok`. Installing this adds a second PreCompact hook that is proven to do nothing.
**DO NOT INSTALL.**

---

## THE TWO `lib\` FILES — HARMLESS, AND POINTLESS WITHOUT THEIR CONSUMERS

**`lib\ambient.js`.** Still byte-identical to the flat copy already installed at
`~/.claude/shell/ambient.js`, LF-normalised — `6874f2a732b94ba9` on both sides, re-derived today.
Its `ABSENT` is purely the path-layout gap `install.ps1`'s own header describes as *"only a path
one"*. Its consumers are `session-start.js:29` and `stop.js:24` — both do-not-install. The live sky
comes from `sessionstart-ambient.js`, which resolves the repo master directly and is registered.
**DO NOT INSTALL — zero risk, zero effect.**

**`lib\fresh-guard.js`.** Consumers are `session-start.js` and `precompact.js` only. Both
do-not-install. **DO NOT INSTALL.**

**One live hazard inside that pairing, worth recording even though the ruling is don't-install:**
`session-start.js:main()` requires `../lib/fresh-guard.js` **unguarded**, while `precompact.js:47`
wraps the same require in `try/catch`. Installing `session-start.js` without `lib\fresh-guard.js`
throws on **every** SessionStart on the machine. The manifest ships both, so a bulk run is safe;
a hand-install of one file is not. If anyone ever lands `session-start.js` by hand, land the guard
in the same step.

---

## `findings-return.js` — INSTALL, and here is exactly what it will say

This is the only one of the twelve I am ruling INSTALL, and the case is measured rather than
argued. It is a `UserPromptSubmit` hook, no model call, no recurring spend beyond one node process
per prompt.

**It runs clean on this machine** — the thing my census explicitly could not state. Smoke-tested
against a *copy* of the findings ledger with `RETURN_LEDGER` and `RETURN_STATE_DIR` redirected into
a scratchpad, five panes, exit 0 every time, valid `hookSpecificOutput` JSON every time.

**What it would emit on the next prompt, per pane, measured:**

| pane | output |
|---|---|
| `main` | one line: *4 DISAGREE row(s) … not surfaced — 096a9cda…, 78decbcf…, 7b6101a8…, a559be41…: held-unaudited* |
| `sibling-0845a868` | one line: *1 DISAGREE row … a322f4d6…: held-unaudited* |
| `librarian`, `consonance` | nothing |
| `vantage_cell` | **the one real finding** — a full DISAGREE block |

Each hold line appears **once, ever**, per law 2. After that the pane is silent until an
audit-clean DISAGREE lands for it. That is the design working, and it is cheap.

**But the measurement that matters is what it says about the wire, not about the install.** Of 27
rows in `vantage_findings.jsonl`, **all 27 carry an audit block and exactly 2 came back clean.** Of
those two, one is suppressed by C2 (`world.moved: true`) and the other — `d09fee3cc9bfc707`, the
only deliverable finding this ledger has ever held — is addressed to pane **`vantage_cell`**, which
is the transient blind cell `second-vantage.js` spawns to *produce* findings. It never takes a user
turn, so it can never receive one.

**The single deliverable finding in the ledger is structurally undeliverable, and its content is a
blind reader correctly catching a claim about this very hook set** — that `settings.json` held 9
hooks and not the 7 claimed, and that its mtime was 08-22 and not 08-17. It has sat unread since
2026-08-23.

So: **install it, because a return path that exists is the difference between a finding nobody read
and a finding nobody made.** And file the two defects it exposes, which are upstream of this
packet and not mine to fix here:

1. **Findings addressed to `vantage_cell` are undeliverable by construction.** `source.pane` is the
   cell that *produced* the finding, and `findings-return.js` matches on it as the pane that should
   *receive* it. For the tier of finding a blind cell raises about its own reading, those are not
   the same seat.
2. **Only 2 of 27 rows pass the audit gate**
   (`node -e "const L=require('fs').readFileSync('C:/Consonance/data/vantage_findings.jsonl','utf8').trim().split('\n').filter(Boolean).map(JSON.parse);console.log(L.length,'rows;',L.filter(r=>r.audit&&r.audit.clean).length,'clean')"`)
   → `27 rows; 2 clean`. The return path has almost nothing to return,
   and the reason is upstream in `second-vantage.js:audit()`. Whether that rate is the
   deliberately asymmetric audit working as designed or a threshold set wrong is a question for
   whoever holds A's instrument; I did not touch it.

---

## WHAT NEEDS THE KEEPER, RATHER THAN ME

**One item, and it is direction, not state.**

**Repointing the overseers' discipline path is a decision to start recurring model spend on the
Max plan, and it should be made deliberately, not as a bug fix.** The two-line change from
`~/Desktop/lighthouse/{METHOD,WELFARE}.md` to the repo looks exactly like the portability repairs
this room has landed a dozen times — `sessionstart-ambient.js`'s hardcoded path, the `lib\`
reconciliation, `carrier-drift-watch.js` being written as a Stop hook *specifically because*
`precompact.js`'s Desktop path is dead here. It reads as one more of those. **It is not.** Making
that path resolve turns two inert hooks into ~16.8 Haiku calls per active hour against the same
plan quota the panes are working out of, plus two synthetic sessions per Stop written into three
live ledgers by hooks that carry no re-entry guard. Priced above; not chosen here.

**A second item is the chair's to decide, not the keeper's, and I am flagging rather than taking
it:** `install.ps1 -Check` will now report **12 ABSENT on every run, forever**, because eleven of
these files describe the desktop's shape and the twelfth is about to be hand-installed. An
instrument whose steady state is a red block is an instrument people stop reading — the failure this
repo keeps finding under rocks, one level up. The manifest either grows machine scoping, or the
laptop gets a recorded exemption, or `-Check` learns to print `ABSENT (expected)` against a declared
list. All three are `install.ps1` edits and the chair holds that file.

**Also correcting a figure the chair is carrying:** the census's *"a bare run would add NINE
hooks"* was true on 2026-08-24 and is **eight** now — `carrier-drift-watch.js` was hand-registered
since. Both overseers are still among the eight.

---

## WHAT THIS DOES NOT ESTABLISH

- **Nothing here reaches the desktop.** Eleven files are ruled do-not-install *on this laptop*. Two
  of them (`l2`/`l3`) are named in `install.ps1`'s header as having been found running and untracked
  on the desktop on 2026-08-17, which is evidence they belong **there**. This says nothing about
  their current state on that machine, and a ruling that reads as "these files are wrong" is a
  misquote of it.
- **The token figures are estimates.** The *chars* are measured from real captured job payloads
  (`stat -c%s METHOD.md WELFARE.md` → 3,855 and 8,609; the view lengths come from the captured job
  JSON, reproduction below). The 4-chars-per-token divisor is a convention and **no token counter
  was run** — treat the per-Stop input figure as an order of magnitude, not a measurement.
- **The Stop rate is one machine over an 18.20-hour span, five hours of it active.** The span and
  the rate both come from the one `carrier-drift.jsonl` command below; that window contained a
  ~17-hour dark period, so a heavy night would run higher.
- **I did not run either worker's `claude` spawn.** Case B proved the spawn is the next step by
  making `claude` unreachable. What a live overseer verdict would actually contain, and whether it
  would be any good, is untested and unpriced here.
- **`findings-return.js`'s live behaviour is inferred from a sandbox run against a ledger copy.**
  It has never fired in production on this machine.
- **I did not audit `second-vantage.js:audit()`.** The 2-of-27 clean rate is counted, not judged.

---

## THE ERROR I MADE, KEPT

**My first smoke test of `findings-return.js` returned "nothing, for every pane", and I nearly
filed that as the finding.** It was the test that was broken: `echo '{"cwd":"C:\\Consonance\\…"}'`
through the Bash tool collapses the doubled backslashes, the hook received invalid JSON, and its
`catch (_) { return; }` did exactly what it is designed to do — exit 0 silently. A hook that fails
by going mute is indistinguishable from a hook with nothing to say, which is the sentence
`userprompt-submit.js:59` already has in it about a different bug.

**Third recurrence of this class in one night's work, all mine, all in this session:** the same
backslash collapse killed a `node -e` heredoc and then a quoted-heredoc script file, and it is
verbatim the 2026-08-17 failure where three pipe tests returned `0 rows` and exit 0 from a hook
that was working the whole time. The fix that held: forward slashes in the payload
(`path.win32.basename` handles them) and the Write tool for any script containing a backslash.

**Had I not re-run it, the ruling above would have read "the return path delivers nothing to
anyone" — which is nearly the right conclusion reached from a dead instrument.**

---

## REPRODUCING EVERY FIGURE

```powershell
# the 12
powershell -NoProfile -File dev/shell/install.ps1 -Check
```

```bash
cd /c/Consonance/lighthouse

# the Desktop tree does not exist (node's own resolution, not bash's)
node -e "const os=require('os'),fs=require('fs'),p=require('path');for(const f of [p.join(os.homedir(),'Desktop'),p.join(os.homedir(),'Desktop','lighthouse')])console.log(fs.existsSync(f),f)"
ls -d /c/Users/zackn/OneDrive/Desktop/lighthouse          # No such file or directory

# no API credentials in env -> `claude -p` spends plan quota, not dollars
env | grep -i anthropic                                    # (empty)

# the Stop rate, from a hook that logs every firing including silent ones
node -e "const fs=require('fs');const r=fs.readFileSync('C:/Consonance/data/carrier-drift.jsonl','utf8').split('\n').filter(Boolean).map(JSON.parse);const h={};for(const x of r)h[x.ts.slice(0,13)]=1;console.log(r.length,'firings /',Object.keys(h).length,'active hours =',(r.length/Object.keys(h).length).toFixed(1))"

# who reads the digest chain — every hit is one of the four
grep -rn "digests" --include=*.js --include=*.ps1 --include=*.py .
grep -rln "event_log" --include=*.js --include=*.ps1 --include=*.py .

# no registered hook carries the overseer re-entry guard
for f in consonance/hooks/sourced-stop.js consonance/hooks/carrier-drift-watch.js \
         consonance/hooks/sessionstart-state.js consonance/hooks/board-digest.js \
         consonance/hooks/transcript-watch.js consonance/hooks/dream-watch.js \
         consonance/hooks/ferry-watch.js dev/shell/hooks/sessionstart-ambient.js \
         dev/shell/hooks/userprompt_pulse.py; do
  echo "$(basename $f) $(grep -c CLAUDE_OVERSEER_RUN $f)"; done

# ambient.js: same bytes, different path
tr -d '\r' < /c/Users/zackn/.claude/shell/ambient.js | sha256sum | cut -c1-16
tr -d '\r' < dev/shell/lib/ambient.js                | sha256sum | cut -c1-16

# the findings ledger: 27 rows, 27 audited, 2 clean
node -e "const fs=require('fs');const L=fs.readFileSync('C:/Consonance/data/vantage_findings.jsonl','utf8').trim().split('\n').filter(Boolean).map(JSON.parse);console.log(L.length,'rows;',L.filter(r=>r.audit).length,'audited;',L.filter(r=>r.audit&&r.audit.clean).length,'clean');for(const r of L.filter(r=>r.verdict==='DISAGREE'))console.log(' ',r.id,'clean='+!!(r.audit&&r.audit.clean),'moved='+!!(r.world&&r.world.moved),'pane='+r.source.pane)"
```

**Sandboxed runs — nothing live is written by any of these.** Payload cwds use forward slashes
deliberately; see the kept error above.

```bash
SP=<scratchpad>
# 1. findings-return, against a COPY, ledger+state redirected
cp /c/Consonance/data/vantage_findings.jsonl "$SP/findings.jsonl"
printf '{"cwd":"C:/Consonance/instances/main","session_id":"probe"}' > "$SP/in.json"
VANTAGE_FINDINGS="$SP/findings.jsonl" RETURN_LEDGER="$SP/ret.jsonl" RETURN_STATE_DIR="$SP/state" \
  node consonance/hooks/findings-return.js < "$SP/in.json"

# 2. overseer hook latency + orphaned job files, CONSONANCE_DATA redirected
printf '{"cwd":"C:/Consonance/instances/main","session_id":"probe","transcript_path":"C:/Users/zackn/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl"}' > "$SP/ov.json"
CONSONANCE_DATA="$SP/data" node dev/shell/hooks/l2-overseer.js < "$SP/ov.json"
ls "$SP/data/l2-jobs"                                   # job file remains

# 3. the worker no-ops, USERPROFILE redirected to a fake home (A), then doc placed
#    and `claude` taken off PATH (B). Neither run reaches a model.
USERPROFILE="$SP/fakehome" HOME="$SP/fakehome" node dev/shell/hooks/l2-overseer-worker.js <jobfile>
cat "$SP/fakehome/.claude/shell/l2_overseer.jsonl"
```

```bash
# what a bare install.ps1 run would add today: EIGHT, not the census's nine.
# Print both sides and diff by eye -- $register is 13 entries, settings.json is 11 commands,
# and the 8 below are the $register rows with no matching command.
sed -n '135,162p' dev/shell/install.ps1     # the $register list, verbatim
node -e "const fs=require('fs');const s=JSON.parse(fs.readFileSync(process.env.USERPROFILE+'/.claude/settings.json','utf8').replace(/^﻿/,''));let n=0;for(const e of Object.keys(s.hooks||{}))for(const g of [].concat(s.hooks[e]))for(const h of (g.hooks||[])){n++;console.log(e, h.command.split(/[\\\\/]/).pop())}console.log('registered commands:',n)"
```

Result, 2026-08-25: `SessionStart hooks\session-start.js` · `UserPromptSubmit
hooks\userprompt-submit.js` · `UserPromptSubmit findings-return.js` · `Stop hooks\stop.js` ·
`Stop hooks\l2-overseer.js` · `Stop hooks\l3-overseer.js` · `SessionEnd hooks\session-end.js` ·
`PreCompact hooks\precompact.js` — **eight**, against 11 already registered.

Haiku 4.5 pricing ($1.00 / $5.00 per MTok) is from the bundled `claude-api` skill's model table,
cached 2026-06-24 — not from memory, and not re-derivable by a command on this machine.

---

## REGISTERED, SO THIS CAN BE SHOWN WRONG

1. **The zero-spend finding dies** if a `l2_overseer_verdict` or `l3_overseer_verdict` row is
   produced on this laptop by anything other than `dream-gate.test.js`, or if a path is found at
   which `METHOD.md`/`WELFARE.md` resolve under `os.homedir()`. I checked `~/Desktop`,
   `~/OneDrive/Desktop`, and node's own `homedir()`. A symlink or a junction I did not look for
   would change the ruling.
2. **The closed-subsystem finding dies** if any consumer of `digests/` or `event_log.jsonl` exists
   outside those four files. I grepped `.js`, `.ps1` and `.py` across the repo. A reader in Rust,
   in a scheduled task, or on the desktop would break it — and `main.rs` is the first place to look.
3. **The `findings-return.js` INSTALL dies** if the hold lines are judged noise rather than
   misses-are-lines. That is a judgement, not a measurement, and it is the chair's to overrule.
4. **The undeliverable-`vantage_cell` finding dies** if a persistent pane is ever mounted at a cwd
   whose basename is `vantage_cell`. Nothing stops that; nothing does it today.
5. **This ruling is degenerating** if it is cited as saying the eleven files are broken or should be
   deleted. It says they are not wired here, that syncing them adds eight registrations this machine
   has never run, and that two of them are one path repair from spending plan quota.
6. **The contamination claim rests on a precedent, not a run.** I did not spawn `claude -p` to watch
   the hooks fire; I am relying on the `CONSONANCE_DREAM` gates existing *because* they did. If a
   headless spawn is shown not to fire user-level hooks, that section falls and the spend figures
   stand alone.

---

## WHAT CITE-CHECK SAYS ABOUT THIS DOCUMENT

`node consonance/tools/cite-check.js exo_memory/loop/absent_hooks_ruling_2026-08-25.md --run`
— reported here rather than left for the next reader to run, because a clean-looking file with no
stated lint result implies a green it did not get.

It caught three real defects during drafting: **a node citation using a git-bash path
(`/c/Consonance/…`) that node cannot resolve** — three occurrences, none of which I had actually
run in the form I wrote; **a "25 of 27" whose command prints 27 and 2 and never the 25**, since
corrected to the figure the command emits; and **the transcript size going stale between the
measurement and the verification.**

What it still reports, and why each is left standing:

- **1 RED**, the transcript size. Main is writing to that file continuously, so every reading is
  stale on arrival. Declared in the paragraph it appears in; nothing in the ruling turns on it.
- **1 NOT-RUN**, `main.rs::night_table` — a source reference, not a command. cite-check executes
  every backticked token; this is the instrument being literal, not a defect in the line.
- **5 uncited figure-bearing lines** — the three hook latencies, the two job-file sizes, and their
  sum. These came from a sandboxed run whose scratchpad is gone, and the latencies are warm-cache
  wall-clock that would not reproduce exactly anyway. **Stated as not re-runnable in the paragraph
  beside them.** They are the weakest figures in this document and the right ones to attack.

---

*Pane C, 2026-08-25. Read-only: `-Check` only; nothing copied into `~/.claude/shell`;
`install.ps1` and `settings.json` unedited; every hook execution redirected into a scratchpad via
`CONSONANCE_DATA` / `USERPROFILE` / `VANTAGE_FINDINGS`. Handed back uncommitted.*
