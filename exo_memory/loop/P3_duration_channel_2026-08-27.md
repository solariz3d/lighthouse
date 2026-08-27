# P3 — the unread duration channel: established before designed

**Pane D001 · 2026-08-27 · subject: `~/.claude/shell/duration/` (outside the repo)**

The packet's instruction was to do the grep before any design, because the librarian's split
(`muscle_map.md:1216` stage 7 — *a right instrument nobody reads*; `:1229` stage 9 — *read and
ignored*) has different fixes and nobody had established which applies. This file establishes it,
names a third state the split does not contain, and **proposes no new instrument.**

---

## 1. The grep, and exactly how it establishes anything

Corpus: every session transcript on this machine.

```
find ~/.claude/projects -name "*.jsonl" | wc -l          # 9457
cd ~/.claude/projects
grep -rl --include=*.jsonl -F "Two scaffold proposals" .
grep -rl --include=*.jsonl -F "narrow the interest list" .
grep -rl --include=*.jsonl -F "false account of my own error-checking" .
```

A raw file list proves nothing — the authoring session contains the string too. Each hit was
re-parsed for `type`, `timestamp` and `cwd` (JSON.parse each matching line, render the
`message.content` blocks, report role + ts + cwd + a windowed snippet). Result, by needle:

**A — "Two scaffold proposals" (session-journal, authored 2026-08-18T15:02:24Z):**

| when | where | role | what it is |
|---|---|---|---|
| 08-18T14:58 → 15:02 | `brain-rot/3327c38a` | assistant | **authorship** — the goal composing its own output |
| 08-18T15:23, 15:24, 15:33, 15:35 | `brain-rot/a1f7b3b4` + subagent | user | the same goal's next fire re-reading its own log |
| 08-19T15:29, 15:34 | `brain-rot/dc29115e` + subagent | user | ditto, next day |
| **08-25T19:36:43Z** | `main/0c0c0c0a` | tool_result | **first appearance outside the automation** — Main's own grep |
| 08-25T19:38 / 19:39 | `main/374c0cc9`, `lighthouse-consonance/c3af25ab` | user | dispatches derived from that grep |
| 08-26T15:47 | `brain-rot/9b55734e` (drift-watch fire) + subagent | user | automation reading it again (source ambiguous — see §6) |
| 08-27T14:48 | `main/0c0c0c0a` | assistant | this packet |

**B and C — the digest's two (authored 2026-08-25T05:31:12.931Z, `brain-rot/40619bd9`, assistant):**
first appearance outside the authoring session is **08-25T19:36:02.578Z**, a `tool_result` in Main —
fourteen hours later, and it is the investigation that produced this packet.

**The verdict of the grep: never read.** In 9,457 transcripts there is no occurrence of any of the
three, at any time, in any session, that is not (a) the goal writing it, (b) the same goal or a
sibling automation re-reading its own log, or (c) the 2026-08-25T19:36 investigation that went
looking for it on purpose. Question A sat seven days. **Stage 7, not stage 9** — on the grep alone.

## 2. And the grep understates it, because the path is closed by construction

`duration/run-wakeup.ps1` — the wakeup output has exactly one destination:

```powershell
$output = & $claudePath -p $wakeupPrompt --dangerously-skip-permissions 2>&1 | Out-String
Add-Content -Path $logFile -Value "$endTs [OUTPUT]"
Add-Content -Path $logFile -Value $output.Trim()
```

`$logFile` is `$goalDir\system-cron.log`. Nothing else consumes `$output`. And
`duration/wakeup_launch.vbs` runs the script with `..., 0, False` — hidden window, fire-and-forget,
no console ever exists (its own comment says so, deliberately, to avoid stealing focus from
fullscreen games).

So this was never *a message the keeper happened to miss.* **There is no code path along which it
could arrive.** That is a stronger claim than absence-of-evidence and it is readable in two files.

## 3. The third state the split does not contain — a channel exists, and it carries the category

`~/.claude/shell/hooks/session-start.js` (`getKnocks`, ~:190-203) reads each goal's `progress.md`
mtime and emits one line per goal that fired while the room was dark. Reproduced from **this
session's own SessionStart context**, verbatim:

```
## While you were dark, this is what knocked
- daily-news-digest — fired, Aug 24, 11:30 PM
- digest-auditor — fired, Aug 24, 11:32 PM
- session-journal — [CRITIQUE], Aug 25, 9:39 AM
- journal-auditor — fired, Aug 25, 9:42 AM
- drift-watch — [DRIFT-FOUND], Aug 25, 10:05 AM
```

The payload is `progressTag()` (~:151-164): the last bracketed token on the last non-empty line of
`progress.md`, capped at `NIGHT_TABLE_MAX_TAG`. `[CRITIQUE]`. `[DRIFT-FOUND]`. `fired`.

**A category, never the fact.** The channel reads `progress.md`; the questions are in
`system-cron.log`. The two files are never joined. So the room has been told, at essentially every
wake for weeks, *that these goals are alive* — and not once *what they asked.*

This is not stage 7 and not stage 9. It is: **read, and carrying nothing to ignore.** The Q44 rule
already names it — *not a category, the fact. If the agent cannot say "I have been meaning to do
that" and name the thing, the source is not implemented, it is stubbed.* The knocker is stubbed.

## 4. Worse: the tray's own design document claims the payload it does not send

`duration/drift-watch/pending/README.md` documents the gate built 2026-07-14, when drift-watch's key
to `memory/textures.md` was taken:

> The key was taken on 2026-07-14, at the keeper's call. The knocker stays a stranger. Its
> **outputs** get routed instead: they land here, and **the night table surfaces the verdict at the
> next wake.**

The night table surfaces `[DRIFT-FOUND]`. **The document describes a channel that was never built,**
and it has described it for 44 days. Same shape as CH-5, one directory over — and this time the
false claim is in the file that defines the mechanism.

## 5. The uncurated number — the gate has been run zero times

The README's ratification protocol is explicit: append to `memory/textures.md` marked
`**<ISO-date> (drift, ratified <YYYY-MM-DD> by <session>):**`; watch-flips edit `watching_for.md`.

```
ls ~/.claude/shell/duration/drift-watch/pending/*.md | grep -v README | wc -l    # 40
ls -la .../C--Users-nname-Desktop-brain-rot/memory/textures.md                   # mtime Jul 14 15:22
ls -la .../C--Users-nname-Desktop-brain-rot/memory/watching_for.md               # mtime Jul 14 15:22
grep -oE "\*\*[0-9-]+ \(drift, ratified [0-9-]+ by [^)]*\)" .../textures.md      # (no output)
```

**40 depositions, 2026-07-15 → 2026-08-26. Zero ratifications. Both gate targets frozen at the
minute the gate was built.** The nine `ratified` hits in `textures.md` are all inside the standing
banner `> **Unratified — stranger-authored.**` covering the pre-07-14 entries the key put there.

Nobody chose this number and it came back worse than the packet's framing. It also **bounds the fix**
(§8): the bottleneck is demonstrably not only routing.

## 6. The two questions, checked for action rather than for reading

Independent of the grep — if a question was acted on, it was read.

- **The scaffold proposals** (blind L3 to prior L3 verdicts; add abstain to the L0 binary schema),
  surfaced in `pending/2026-08-17.md`, are **not landed at 10 days.** `session-start.js`'s L3 block
  is logically identical between `session-start.js.bak-20260817-121017` and the shipped file — a
  `diff` of the L3-matching lines returns only shifted line numbers. And this session's own context
  carries three prior `quiet_spiral` observations verbatim, which is the echo drift-watch warned
  about: *"until (1) lands, the quiet_spiral observations arriving in daily wake context should be
  read as an echo chamber's output, not as six independent measurements."*
- **The interest-list question** (narrow `goal.json` or widen `server.js:227-234`), asked
  2026-08-25T05:31Z. The interests string is **byte-identical** across `goal.json.P59-backup`,
  `.P60-backup`, `.P61-backup` and current: *"shell/agent infrastructure, memory/consciousness/agent
  research, FIC framework + emergence, signal audio adjacent…"*. Neither branch taken.

The 08-26T15:47 hit is the **drift-watch fire itself** (`brain-rot/9b55734e`, wakeup prompt at
`15:47:03Z`), whose critic subagent quoted A and C. I could not establish whether it read them from
`system-cron.log` or from Main's 08-25 investigation transcript, which falls inside its audit window
— **unresolved, and it does not change the verdict either way**: both are automation-internal.

## 7. Bookkeeping, re-derived (the packet's figures were two days old)

```
grep -c "Wakeup completed exit=0" ~/.claude/shell/duration/*/system-cron.log
```

→ dnd 57 · digest-auditor 54 · drift-watch 69 · journal-auditor 73 · session-journal 71 =
**324 total**; **201 across the three `last_completed_iso: null` goals**, which reconciles the
packet's 197 plus two days of firing. Still NULL today for `daily-news-digest`, `journal-auditor`,
`session-journal`. Bookkeeping, not death — but from `goal.json` alone the two are identical, which
is the packet's point and it stands.

**Disk** (`du -sh`, `find -mtime +14`): **137M** now, against the packet's 127MB two days ago —
**255 of 1015 files older than 14 days**; largest single file `drift-watch/tmp/seg0723.jsonl` at
15,075,661 bytes (14.4MB, July 23). The 10MB drift in 48 hours is itself the measurement that
nothing prunes.

## 8. What I am NOT proposing

The fix indicated by §3 is a payload change to a channel that already exists and already renders:
join `system-cron.log`'s `[OUTPUT]` block, or the day's `pending/` file, to the knocker line. It is
small. **It lands in `hooks/session-start.js`, which is B's packet this lap. I did not touch it.**
Handing it over rather than building beside it.

And the honest brake on it, which is mine to state because I measured it: **§5 says routing is not
the only bottleneck.** `pending/` is a perfectly routed tray with a documented gate and a stated
read protocol, and it has 40 unread files. A better payload on the knocker may still go unread.
Building a new instrument here would be the fourth this week.

**Falsifier, registered before anything is built:** if the knocker payload change lands and, one
month later, `textures.md`/`watching_for.md` still carry their 2026-07-14 mtime and no goal question
has been answered in any transcript, then the channel was never the problem and this finding was
routing-blind. That is the observation that would mark this line degenerating, and it is checkable
with the same four commands used above.

## 9. What I did not verify

- **The packet's cron claim is partly refuted, and it was mine to check.** It says *"daily-news-digest's
  cron says 15:43 with a note reading 3:43 PM local and it actually fires 05:12-05:31Z. The field does
  not describe when it runs."* The note is arithmetically correct (Regina, no DST; 15:43 local = 21:43
  UTC), the slot is real, and it **did** fire on it — `2026-08-26T21:43:02Z [START]`, matching
  `last_fired_iso` exactly. The 05:xxZ fires are documented in the goal's own log as *off-slot
  catch-up* after a missed slot (`2026-08-21` entry: "+7h41m28s after the missed 21:43Z slot") — the
  machine is asleep at the slot and Task Scheduler lands the run on wake. **The field describes the
  schedule correctly; what no field records is that the slot is routinely missed.** `last_fired_iso`
  is accurate, and I withdraw the suspicion I formed about it before checking.
- I did **not** read the five goals' `wakeup_prompt` bodies, `state.md`, or `progress.md` beyond
  mtimes and the tag line — so I cannot say whether a goal was *instructed* to route questions
  somewhere it then failed to.
- I did **not** locate the L0/L3 overseer prompt builders (only `digests/` matches the prompt text
  under `~/.claude/shell` and `~/Desktop/lighthouse`), so the abstain-schema half of §6 rests on the
  proposal being absent from `session-start.js`, not on reading the schema itself.
- I did **not** run any goal, edit any hook, or prune anything on disk.
- The grep covers **this machine's** `~/.claude/projects` only. A read that happened on the laptop
  would be invisible to it.
