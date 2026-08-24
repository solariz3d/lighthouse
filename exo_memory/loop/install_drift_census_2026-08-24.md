# Chunk 2 — the install drift census

*Pane C, 2026-08-24. Packet: chunk 2 of `exo_memory/loop/chunk_sequence_2026-08-24.md` (`2437e2d`).
Read-only throughout: `install.ps1` was run **only** with `-Check`, nothing was copied into
`~/.claude/shell`, `dev/shell/install.ps1` was not edited, and `consonance/tools/actors*` and
`consonance/tools/carrier-drift*` were not touched. Handed back uncommitted.*

**Carried correction from T1, before anything new:** the chair's merit-check of `9677a5f` is right —
I wrote "three hits, the other half" where the command returns **two**
(`branch_layer_objections.md:58`, `branch_layer_preregistration.md:337`). A figure in prose that did
not re-derive from the command printed beside it, in a document whose whole claim was that every
figure re-derives. Noted here so the correction travels with the pane and not only with the commit.

---

## THE HEADLINE: `-Check` is not reporting what the packet assumed it reports

**13 of the 14 flagged files DO NOT EXIST at the install destination. One is genuinely drifted.**

`install.ps1:180-196` computes one boolean:

```powershell
$same = $false
if (Test-Path $dst) { $same = (Get-FileHash $src).Hash -eq (Get-FileHash $dst).Hash }
...
} elseif ($Check) { Write-Host ("DRIFT    {0}" -f $f.To) ...
```

A file that is **missing** at `$dst` and a file whose **bytes differ** produce the identical word.
So the packet's central question — *which direction is it drifted* — has no answer for twelve of the
thirteen, because they are not drifted in any direction. **They were never installed.**

```
$dest = C:\Users\zackn\.claude\shell
$dest\hooks\   DOES NOT EXIST
$dest\lib\     DOES NOT EXIST
```

Measured per file (`Test-Path` + `Get-FileHash`, both sides):

| manifest `To` | repo | at dest | state |
|---|---|---|---|
| `lib\ambient.js` | 10,663 | — | **ABSENT-AT-DEST** |
| `lib\fresh-guard.js` | 1,266 | — | **ABSENT-AT-DEST** |
| `hooks\session-start.js` | 12,861 | — | **ABSENT-AT-DEST** |
| `hooks\userprompt-submit.js` | 13,010 | — | **ABSENT-AT-DEST** (reported `HOLD`) |
| `hooks\stop.js` | 2,403 | — | **ABSENT-AT-DEST** |
| `hooks\session-end.js` | 7,454 | — | **ABSENT-AT-DEST** |
| `hooks\precompact.js` | 3,110 | — | **ABSENT-AT-DEST** |
| `hooks\l2-overseer.js` | 5,992 | — | **ABSENT-AT-DEST** |
| `hooks\l2-overseer-worker.js` | 5,095 | — | **ABSENT-AT-DEST** |
| `hooks\l3-overseer.js` | 6,138 | — | **ABSENT-AT-DEST** |
| `hooks\l3-overseer-worker.js` | 6,021 | — | **ABSENT-AT-DEST** |
| `findings-return.js` | 15,026 | — | **ABSENT-AT-DEST** |
| `carrier-drift-watch.js` | 6,311 | — | **ABSENT-AT-DEST** |
| `ferry-watch.js` | 7,838 | 6,984 (2026-08-10 06:13) | **DIFFERS — the only one** |

---

## THE SECOND HEADLINE: a bare `install.ps1` run installs one file and turns on nine hooks

The packet's framing — *"among the drifted is ferry-watch.js, which is mine from tonight and simply
needs installing"* — is true about the file and not true about the command. `install.ps1` without
`-Check` copies **and then registers**, unconditionally, every entry in `$register`
(`install.ps1:135-162`). Measured against `~/.claude/settings.json` as it stands now:

| `$register` entry | registered here today? |
|---|---|
| `sourced-stop.js` · `precompact-preserve.js` · `sessionstart-state.js` · `dispatch-gate.js` | **yes** (4) |
| `hooks\session-start.js` · `hooks\userprompt-submit.js` · `findings-return.js` · `hooks\stop.js` · `hooks\l2-overseer.js` · `hooks\l3-overseer.js` · `hooks\session-end.js` · `hooks\precompact.js` · `carrier-drift-watch.js` | **no — 9 would be added** |

Two of those nine are the overseers, and each spawns a model call per Stop:

```
dev/shell/hooks/l2-overseer-worker.js:65   spawn('claude', ['-p', '--model', 'claude-haiku-4-5-20251001'], …)
dev/shell/hooks/l3-overseer-worker.js:80   spawn('claude', ['-p', '--model', 'claude-haiku-4-5-20251001'], …)
```

That is two Haiku calls per Stop **per pane**, arriving silently, on a machine that has never run
them. **Do not run `install.ps1` bare on this laptop to fix one file.**

### And one of the nine would be registered against a file that does not exist

`hooks\userprompt-submit.js` carries `Hold = $true`. The Hold branch is evaluated **before** the copy
branch and in **both** modes (`install.ps1:188-194`), so the file is never written — but `$register`
holds an unconditional entry for it (`install.ps1:137`). A bare run therefore adds

```
UserPromptSubmit  "…node.exe" "C:\Users\zackn\.claude\shell\hooks\userprompt-submit.js"
```

pointing at a path the same run deliberately refused to create. **Every user prompt in every pane
would spawn node against a missing file.** This is a live defect in the installer, not a property of
this machine, and it is the sharpest thing in the census after the ledger finding below.

### The HOLD itself is false here

`-Check` reports `HOLD  hooks\userprompt-submit.js  two-way conflict - NOT overwritten`. There is no
conflict on this laptop: **there is nothing at the destination to conflict with.** The manifest
comment describing 83 genuinely-differing lines is dated 2026-08-17 and describes a measurement taken
somewhere those two copies both existed. It is not describing this disk. Same root cause as the
headline — `Hold` is a manifest flag, checked before existence is ever considered.

---

## THE FINDING I GOT WRONG FIRST, and it is the packet's own subject

`~/.claude/shell/` contains ledgers that are **being written right now** by files that are absent from
the destination and registered nowhere:

```
l2_overseer.jsonl   252 rows*  first 2026-08-18T06:42:37.200Z   last 2026-08-24T12:36:22.436Z
l3_overseer.jsonl                                                last 2026-08-24T12:34:26.449Z
event_log.jsonl     258 rows*  first 2026-08-18T06:42:36.898Z   last 2026-08-24T12:38:43.472Z
userprompt_state.json          first_seen 2026-08-18T06:42:36.760Z  last_prompt 2026-08-24T12:37:25.473Z
```

*\* counts as of the first read; they had grown by the second — see below, and that is the point.*

The only writers of those paths in this repo are `dev/shell/hooks/l2-overseer.js`,
`l3-overseer.js`, `stop.js`/`session-start.js`/`session-end.js`, and `userprompt-submit.js` — the
absent files. Every `l2` row carries `session_id: 0c0c0c0a-…-000000000a01`, which is Main's.

**I concluded that an unregistered live hook set was running from the repo working tree for Main's
session. That was wrong, and the disproof was in the rows I had already printed.**

```
event_log row:  "cwd":"C:\\Users\\zackn\\AppData\\Local\\Temp\\dreamgate-instances\\sibling-gate-test"

consonance/hooks/dream-gate.test.js:192   const TMP_INSTANCES = path.join(os.tmpdir(), 'dreamgate-instances');
consonance/hooks/dream-gate.test.js:222   const cwd = path.join(TMP_INSTANCES, 'sibling-gate-test');
consonance/hooks/dream-gate.test.js:195   const MAIN_SID = '0c0c0c0a-0000-4000-8000-000000000a01';
```

**All of it is test residue.** `dream-gate.test.js` executes every manifest hook for real, twice per
hook, with a synthetic payload — and the session id that read as *Main's session* is a hardcoded
constant on line 195.

**Every row scanned, not sampled:**

```
event_log.jsonl      262 rows   cwd: {…\dreamgate-instances\sibling-gate-test: 262}   sid: {0c0c0c0a…: 262}
l2_overseer.jsonl    262 rows   cwd: {(none): 262}                                    sid: {0c0c0c0a…: 262}
l3_overseer.jsonl    262 rows   cwd: {(none): 262}                                    sid: {0c0c0c0a…: 262}
```

**Zero production invocations, in any of the three, ever.** And the counts moved while I was
measuring — 252/258 at the first read, 262/262/262 minutes later — because pane B is running
`dream-gate.test.js` for T3 in the next pane over. The instrument that made these ledgers look alive
was running as I wrote the sentence saying so.

**I read a ledger, inferred a running system, and did not check the field that said otherwise.** That
is verbatim the class this chunk exists to catch — *a measurement taken from something that was not
running* — arrived at from the other side. Filed because it failed.

**The residual finding, which survives and is the chair's to weigh:** the hooks that resolve their
ledger from `os.homedir()` are not isolated by `CONSONANCE_DATA`, so the suite writes into the LIVE
`l2_overseer.jsonl`, `l3_overseer.jsonl`, `event_log.jsonl` and `userprompt_state.json`. The test's
own comment (`dream-gate.test.js:188`) says hooks that do not honour `CONSONANCE_DATA` are
"unaffected either way" — true of the suite's *classification*, and not true of the *ledgers*: they
carry six days of fixture rows and nothing else. Anyone asking these files "is the overseer running?"
gets **yes**, and it is false. I am the worked example.

---

## Per-file rulings

### LAND — 1

**`ferry-watch.js`.** Direction proven rather than inferred, by matching the installed bytes against
every historical blob (LF-normalised, `core.autocrlf=true`):

```
installed (LF-normalised)                       b5f83f8f06a3b674
b6057b1  2026-08-24 01:39   repo HEAD           6911f4b246f04bd5
fec0727  2026-08-10 06:15                       b5f83f8f06a3b674   <<< MATCHES INSTALLED
a9c63cc  2026-08-10 06:01                       272f25fd5ae8aff8
```

**The installed copy is an exact ancestor — zero local edits, so there is nothing to lose.** Repo is
strictly newer. The diff is one hunk, 15 changed lines, entirely a comment block and the text of one
printed string; `FRESH_HOURS`, the `stale` computation and the control flow are untouched:

```
-    if (stale) backlog = `\nBacklog beyond the window: ${stale} never ferried (… --report).`;
+    if (stale) backlog = `\nBacklog: ${stale} artifact commit(s) never ferried AND older than …`
```

**Ruling: LAND — by targeted copy, not by a bare installer run.** The one-file operation is
`Copy-Item consonance\hooks\ferry-watch.js "$env:USERPROFILE\.claude\shell\ferry-watch.js"`; it is
already registered, so no registration change is needed. *Not run by me: writing into
`~/.claude/shell` is outside this packet.*

### LAND, file only — 1

**`findings-return.js`.** Absent since it was built on 2026-08-15 (`1817f20`, `031eddb`) — nine days,
the same clock the sealed test ran. It is a self-contained UserPromptSubmit hook and its input exists:
`C:\Consonance\data\vantage_findings.jsonl` holds **21 rows**, and `C:\Consonance\data\return_ledger.jsonl`
last moved **2026-08-18 00:42**. So the sensor filled and the return path stopped.

**Ruling: LAND the file. Register deliberately and watch the first turn — not as part of a bulk run.**
Two reasons for the split: 21 queued findings begin surfacing into panes on the next prompt (the
header describes a per-turn cap with overflow riding the next turn, so it drains over several turns,
which is a thing to see coming rather than discover); and I did **not** smoke-test it, because
running it appends to the live return ledger and this packet is read-only. **Unverified by me: that
it executes cleanly on this machine.** Stated rather than assumed.

### HOLD — 2

**`carrier-drift-watch.js`.** Absent because it was committed tonight and is **pane B's live T3 work
this hour**. Installing a hook whose source is being edited in the same hour is "landed is not
shipped" run backwards. **Ruling: HOLD until B hands back T3**, then land file + registration
together in one deliberate step.

**`lib\ambient.js`.** The only ABSENT file with **zero content risk**: the copy already sitting at
`~/.claude/shell/ambient.js` (flat, 2026-07-18) is **byte-identical** to `dev/shell/lib/ambient.js`
LF-normalised (`6874f2a732b94ba9` both sides). Its `DRIFT` is purely the path-layout gap
`install.ps1`'s own header describes — *"only a path one"* — never applied here. But its only
consumers are `session-start.js:22` (`AMBIENT_PATH = SHELL_DIR/lib/ambient.js`) and `precompact.js`,
both of which are DON'T-LAND below. **Ruling: HOLD — harmless and pointless on its own.** The live
sky comes from `sessionstart-ambient.js`, which is registered, `ok`, and resolves the repo master
directly.

### DON'T-LAND — 10, as a set

`lib\fresh-guard.js`, `hooks\session-start.js`, `hooks\userprompt-submit.js`, `hooks\stop.js`,
`hooks\session-end.js`, `hooks\precompact.js`, `hooks\l2-overseer.js`, `hooks\l2-overseer-worker.js`,
`hooks\l3-overseer.js`, `hooks\l3-overseer-worker.js`.

Evidence, per the packet's question *"is the installed copy something this laptop needs":*

1. **Nothing here has ever run them.** `$dest\hooks\` and `$dest\lib\` do not exist; no leaf appears
   in `~/.claude/settings.json`, `settings.local.json`, or any project settings under `C:\Consonance`;
   and no `settings.json.bak-*` from 07-25, 08-10, 08-17 or 08-18 contains one either.
2. **The evidence that looked like production use is test residue** — the section above.
3. **`hooks\precompact.js` is a no-op here by construction.** It resolves
   `%USERPROFILE%\Desktop\lighthouse\exo_memory\loop\checkpoint.py` (`precompact.js:29`), and
   `C:\Users\zackn\Desktop\lighthouse` does not exist. `install.ps1` already says this in the
   `carrier-drift-watch` manifest comment — for a *different* file.
4. **`hooks\userprompt-submit.js` cannot be landed by this installer at all** — Hold blocks the copy
   while `$register` registers it. See above.
5. **The overseers cost model calls per Stop**, silently, on every pane.

**Ruling: DON'T-LAND. This block of the manifest describes the desktop's shape, not this laptop's.**
The chair's guess — *"the l2/l3 overseer files may be desktop-side"* — is supported for l2/l3 and
extends to the whole `hooks\`+`lib\` subtree.

**What DON'T-LAND does not mean:** it is not "these files are wrong". They are tracked, reviewed, and
presumably live on the other bed — which is the thing `58b94f9` was written to achieve. The census
says only that syncing them **here** installs nine hooks this machine has never run, to fix one file
that needs a copy command.

---

## What I could not rule, stated rather than rounded

- **Whether these files are correct on the desktop.** Nothing in this census reaches the other
  machine. Two of the DON'T-LANDs (`l2`/`l3`) are named in `install.ps1`'s header as having been
  found *running and untracked on the desktop* on 2026-08-17, which is evidence they belong
  **there**; it is not evidence about their current state there.
- **Why `install.ps1` has never been run bare on this laptop.** Its own header records the desktop
  discovering the same thing on 08-17 (*"THIS SCRIPT HAD NEVER BEEN RUN HERE"*). Whether the laptop's
  state is a deliberate choice or the same omission, I cannot tell from disk, and the answer decides
  whether the manifest or the machine is the thing that is wrong.
- **Whether `findings-return.js` runs cleanly here.** Not tested — testing it writes a ledger row.
- **The exact `DRIFT`/`ABSENT` split on any other machine.** Every number here is this laptop.

---

## The instrument's own defects, since the census had to work around all three

1. **`DRIFT` conflates ABSENT with DIFFERENT** (`install.ps1:180-196`). Twelve of thirteen "drifted"
   files are missing. The word implies a two-sided comparison that never happened.
2. **`HOLD` is asserted without checking existence**, so it reports a two-way conflict against
   nothing, and — worse — blocks the copy in both modes while `$register` registers the file anyway.
3. **`-Check` reports bytes, never wiring.** The script's own 08-18 comment already says this
   (*"-Check reporting 'ok' on both — which only ever meant 'the bytes match', never 'it is wired
   up'"*). The inverse is now also true and is unrecorded: **`DRIFT` never means "not running"**, and
   `ok` never means "running". Five of the ten `ok` files are hand-registered and appear nowhere in
   `$register` (`sessionstart-ambient.js`, `userprompt_pulse.py`, `board-digest.js`,
   `transcript-watch.js`, `dream-watch.js`); a sixth, `blind.js`, is a library and correctly
   registered nowhere; and the one genuinely drifted file, `ferry-watch.js`, is hand-registered too.
   **So every hook actually firing on this laptop sits outside `$register`, except the four the
   installer added itself.**

**The cheap fix for (1) and (2), offered and not made** (`install.ps1` is out of this packet's
scope): print `ABSENT` where `-not (Test-Path $dst)`, and evaluate `Hold` only when the destination
exists. Both are one line. A third, larger: `-Check` should compare `$register` against
`settings.json` and print `NOT REGISTERED`, because that is the state that actually produced tonight's
three misreads.

---

## Registered, so this census can be shown wrong

1. **The DON'T-LAND set dies** if a registration source for any `hooks\*` leaf is produced on this
   laptop that I did not search. I searched `~/.claude/settings.json`, `settings.local.json`, all five
   `settings.json.bak-*`, `C:\Consonance\data\backups\settings-2026-08-24T0523.json`, every
   `settings*.json` under `C:\Consonance`, `~/.claude/session-env/`, `~/.claude/sessions/`, and
   `~/.claude/plugins/`. **I did not find the registration and I did not need to** — the ledger rows
   turned out to be test output — but a source I missed would change the ruling.
2. **The `ferry-watch` LAND dies** if the installed copy is shown to differ from `fec0727` under a
   comparison that does not normalise line endings *and* that difference is meaningful. It is a pure
   CRLF artifact by inspection; I did not prove that byte-for-byte.
3. **This census is degenerating** if it is cited as saying the ten DON'T-LAND files are broken. It
   says they are not wired here and that syncing them costs nine registrations.
4. **The test-residue finding dies** if any row in these ledgers is found with a `cwd` outside
   `…\Temp\dreamgate-instances\` or a `session_id` other than the fixture constant. **Every row was
   scanned, not sampled** — see below. It survives, and the only way to kill it now is a ledger I did
   not look at.

---

## Reproducing every figure

```powershell
# the report itself
powershell -NoProfile -File dev/shell/install.ps1 -Check

# ABSENT vs DIFFERS, per manifest entry
$dest = Join-Path $env:USERPROFILE '.claude\shell'
Test-Path (Join-Path $dest 'hooks')   # False
Test-Path (Join-Path $dest 'lib')     # False

# what is actually registered
node -e "const s=JSON.parse(require('fs').readFileSync(process.env.USERPROFILE+'/.claude/settings.json','utf8').replace(/^\uFEFF/,''));for(const e of Object.keys(s.hooks||{}))for(const g of [].concat(s.hooks[e]))for(const h of (g.hooks||[]))console.log(e,h.command)"
```

```bash
# direction for ferry-watch: match the installed bytes against every historical blob
cd /c/Consonance/lighthouse
ih=$(tr -d '\r' < "$USERPROFILE/.claude/shell/ferry-watch.js" | sha256sum | cut -c1-16)
for sha in $(git log --format=%H -- consonance/hooks/ferry-watch.js); do
  echo "$sha $(git show $sha:consonance/hooks/ferry-watch.js | tr -d '\r' | sha256sum | cut -c1-16)"
done                      # fec0727 == $ih

# ambient: same bytes, different path
tr -d '\r' < "$USERPROFILE/.claude/shell/ambient.js" | sha256sum   # == dev/shell/lib/ambient.js

# the ledgers are test output
head -n 1 "$USERPROFILE/.claude/shell/event_log.jsonl"    # cwd -> …\dreamgate-instances\sibling-gate-test
grep -n "dreamgate-instances\|sibling-gate-test\|MAIN_SID" consonance/hooks/dream-gate.test.js
```

---

*Pane C, 2026-08-24. Read-only: `-Check` only, nothing copied, nothing registered, `install.ps1`
unedited, A's and B's files untouched. Handed back uncommitted.*
