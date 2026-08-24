# dev/shell/install.ps1 — put this machine's hook dir in sync with the repo.
#
# WHY. Hooks are copied out of the repo into ~/.claude/shell, so the two can
# drift silently: on 2026-07-25 an audit found sessionstart-ambient.js running on
# one machine and existing nowhere in the repo, hardcoding an absolute path that
# would have been wrong anywhere else. Files that only exist on one disk cannot
# be reviewed, cannot be fixed once, and cannot reach the other bed.
#
# The repo is the master. This script makes a machine match it, and says exactly
# what it changed. Idempotent — safe to re-run after every pull.
#
#   pwsh dev/shell/install.ps1            # sync files + register hooks
#   pwsh dev/shell/install.ps1 -Check     # report drift only, change nothing
#   pwsh dev/shell/install.ps1 -NoRegister  # files only, print the block instead
#
# ── 2026-08-17: WHY THIS NOW EDITS settings.json, REVERSING A DELIBERATE REFUSAL ────────────
#
# The header used to say: "It deliberately does NOT edit ~/.claude/settings.json… a one-time
# registration is not the thing that drifts." That was wrong in the specific way that matters —
# registration IS the thing that drifts, because it is the only step a machine can skip silently.
# Measured on the desktop the morning of 2026-08-17, after two machines had been used in
# alternation for weeks:
#
#   * THIS SCRIPT HAD NEVER BEEN RUN HERE. None of its managed files existed in $dest.
#   * NINE of the hooks actually registered and running were in NO repository at all — including
#     precompact.js, which writes the keeper's checkpoints, and l3-overseer.js, which writes the
#     arc-perceptions he reads every turn. One disk, no review, no way to reach the other machine.
#   * The manifest did not name a single file this machine ran. It was an installer for a set
#     nobody had registered, while the registered set was unmanaged.
#   * THREE conventions were live at once: ~/.claude/shell/hooks/ (registered), ~/.claude/shell/
#     (this script's target, empty), and two hooks pointed straight at repo paths.
#
# Printing a block for a human to paste is what produced that. So this now does the registration,
# and does it the only way that is safe on a file the user also owns:
#   MERGE, never replace — unknown events and unrelated keys are preserved untouched.
#   BACK UP first, timestamped, every run that changes anything.
#   IDEMPOTENT — matching by resolved command path, so re-running adds nothing.
#   NEVER REMOVE a hook this script does not manage. A hook it did not install is not its business.
#
# ── AND WHY lib/ RATHER THAN FLAT ───────────────────────────────────────────────────────────
#
# The old manifest flattened ambient.js to $dest\ambient.js. The RUNNING session-start.js resolves
# it at `SHELL_DIR/lib/ambient.js` (session-start.js:17) and precompact.js and session-start.js
# both require fresh-guard.js from the same place. The live layout was right and the manifest was
# the outlier. The two copies of ambient.js were byte-identical, so this reconciliation had no
# content conflict to settle — only a path one.

[CmdletBinding()]
param([switch]$Check, [switch]$NoRegister)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)   # …/lighthouse
$dest = Join-Path $env:USERPROFILE '.claude\shell'

# source -> installed RELATIVE path. `lib\` entries keep their directory because that is where the
# requiring hooks look; hooks land in `hooks\` because that is where the registered ones already
# were and moving a running system to satisfy a convention is how you break it.
$files = @(
  @{ From = 'dev\shell\lib\ambient.js';                  To = 'lib\ambient.js';     Lib = $true }
  @{ From = 'dev\shell\lib\fresh-guard.js';              To = 'lib\fresh-guard.js'; Lib = $true }

  # The nine that were running and untracked until 58b94f9. These are the ones the machine
  # actually executes; they were the whole reason for that commit.
  @{ From = 'dev\shell\hooks\session-start.js';          To = 'hooks\session-start.js' }

  # HOLD = a REAL two-way conflict between the repo and this machine, reported and never
  # overwritten. Not a TODO — the point of a reconciler is that the one case it cannot decide is
  # the one case it must not decide silently.
  #
  # userprompt-submit.js, measured 2026-08-17: 83 lines genuinely differ once CRLF is normalised
  # (the raw diff reads 495 and is almost entirely line endings — do not trust it). 69 lines exist
  # only in the repo, including a BOM-strip fix in loadState() caught 2026-07-25 whose absence
  # silently blanks the thread's age; 14 exist only on this machine. Both emit the beacon, both
  # exit 0 on a real payload. Whichever is discarded loses something.
  #
  # A/B-ing them live does not work either: both write the same state file, so running one
  # consumes what the other would have surfaced. The first attempt at that test produced a clean
  # 898-vs-117-byte result that meant nothing.
  @{ From = 'dev\shell\hooks\userprompt-submit.js';      To = 'hooks\userprompt-submit.js'; Hold = $true }
  @{ From = 'dev\shell\hooks\stop.js';                   To = 'hooks\stop.js' }
  @{ From = 'dev\shell\hooks\session-end.js';            To = 'hooks\session-end.js' }
  @{ From = 'dev\shell\hooks\precompact.js';             To = 'hooks\precompact.js' }
  @{ From = 'dev\shell\hooks\l2-overseer.js';            To = 'hooks\l2-overseer.js' }
  @{ From = 'dev\shell\hooks\l2-overseer-worker.js';     To = 'hooks\l2-overseer-worker.js'; Lib = $true }
  @{ From = 'dev\shell\hooks\l3-overseer.js';            To = 'hooks\l3-overseer.js' }
  @{ From = 'dev\shell\hooks\l3-overseer-worker.js';     To = 'hooks\l3-overseer-worker.js'; Lib = $true }

  @{ From = 'dev\shell\hooks\sessionstart-ambient.js';   To = 'sessionstart-ambient.js' }
  @{ From = 'dev\shell\hooks\userprompt_pulse.py';       To = 'userprompt_pulse.py' }
  # Lib = $true: a library REQUIRED BY a hook, not a hook the host runs. It receives no stdin and
  # emits nothing, so the dream-gate invariant does not apply and dream-gate.test.js skips it.
  # Declared rather than inferred from a `\lib\` path, because board-digest requires it as
  # './blind.js' from its own directory — moving the file to satisfy a path convention would break
  # that require in the repo or after the flattening install, whichever end you fix.
  #
  # IT WAS MISSING FROM THIS MANIFEST UNTIL 2026-08-17, and the gap was invisible because the
  # INSTALLED board-digest.js predated the dependency. Syncing the repo's current version shipped a
  # require the installer did not carry, and every UserPromptSubmit after that printed
  # "Cannot find module './blind.js'" to the keeper. A fresh install on any other machine would have
  # done the same on its first prompt.
  @{ From = 'consonance\hooks\blind.js';                 To = 'blind.js'; Lib = $true }
  @{ From = 'consonance\hooks\board-digest.js';          To = 'board-digest.js' }
  @{ From = 'consonance\hooks\transcript-watch.js';      To = 'transcript-watch.js' }
  @{ From = 'consonance\hooks\dream-watch.js';           To = 'dream-watch.js' }
  @{ From = 'consonance\hooks\ferry-watch.js';           To = 'ferry-watch.js' }
  @{ From = 'consonance\hooks\sourced-stop.js';          To = 'sourced-stop.js' }
  @{ From = 'consonance\hooks\findings-return.js';       To = 'findings-return.js' }
  # Added 2026-08-18 with the hook itself, deliberately in the same commit. Nine hooks existed
  # ONLY as installed copies until 58b94f9 because each was registered by hand and the manifest
  # was updated later or never; a file that runs on this machine and exists nowhere else is the
  # failure that commit was written to end. The registration and the manifest entry ship together
  # or the next fresh install silently loses the hook.
  @{ From = 'consonance\hooks\precompact-preserve.js';   To = 'precompact-preserve.js' }
  # Added 2026-08-18 with the hook, same commit, same reason as the line above: registration and
  # manifest ship together or a fresh install silently loses it.
  @{ From = 'consonance\hooks\sessionstart-state.js';     To = 'sessionstart-state.js' }
  # Added 2026-08-24 with its registration below, same commit, same reason as the two entries
  # above. This one is a PreToolUse gate, so it also needed Matcher support in $register -- an
  # unmatched PreToolUse hook fires on every tool call in the session.
  @{ From = 'consonance\hooks\dispatch-gate.js';          To = 'dispatch-gate.js' }
  # Added 2026-08-24 with its registration below, same commit, same reason as the entries above.
  # It is a Stop hook rather than a PreCompact one ON PURPOSE: precompact.js resolves its script
  # under %USERPROFILE%\Desktop\lighthouse, which does not exist on the laptop, so the PreCompact
  # chain the record describes as "residue fired from checkpoint" has never run on this machine.
  # Copying that wiring would have shipped a trigger that is a no-op here. See the hook's header.
  @{ From = 'consonance\hooks\carrier-drift-watch.js';    To = 'carrier-drift-watch.js' }
)

# What this script REGISTERS. Only these are ever touched in settings.json; anything else found
# there is left exactly as it is. Order within an event is preserved on re-run.
#   Rel   — path under $dest, so the installed copy runs, never the repo working tree. Registering
#           a repo path (done by hand on 2026-08-15) means a pull silently changes what executes
#           mid-session and the installer cannot manage it.
#   Runner— 'node' or 'py'.
$register = @(
  @{ Event = 'SessionStart';     Rel = 'hooks\session-start.js';      Runner = 'node' }
  @{ Event = 'UserPromptSubmit'; Rel = 'hooks\userprompt-submit.js';  Runner = 'node' }
  @{ Event = 'UserPromptSubmit'; Rel = 'findings-return.js';          Runner = 'node' }
  @{ Event = 'Stop';             Rel = 'hooks\stop.js';               Runner = 'node' }
  @{ Event = 'Stop';             Rel = 'hooks\l2-overseer.js';        Runner = 'node' }
  @{ Event = 'Stop';             Rel = 'hooks\l3-overseer.js';        Runner = 'node' }
  @{ Event = 'Stop';             Rel = 'sourced-stop.js';             Runner = 'node' }
  @{ Event = 'SessionEnd';       Rel = 'hooks\session-end.js';        Runner = 'node' }
  @{ Event = 'PreCompact';       Rel = 'hooks\precompact.js';         Runner = 'node' }
  # Added 2026-08-18, AFTER the manifest entries above shipped without them. Both hooks were in
  # $files from the start, so a fresh install copied the .js and registered neither: the desktop
  # would have pulled the repo, run this script, and received two files that never fire. Found by
  # -Check reporting 'ok' on both -- which only ever meant 'the bytes match', never 'it is wired
  # up'. The comment at the $files entries already said registration and manifest ship together;
  # the comment shipped and the registration did not.
  @{ Event = 'PreCompact';       Rel = 'precompact-preserve.js';      Runner = 'node' }
  @{ Event = 'SessionStart';     Rel = 'sessionstart-state.js';       Runner = 'node' }
  # The dispatch gate. Matcher-scoped on purpose: it must see the two verbs that put text into
  # another seat's pane and nothing else. It ASKS rather than blocks, and fails open on any error.
  @{ Event = 'PreToolUse';       Rel = 'dispatch-gate.js';            Runner = 'node';
     Matcher = 'mcp__consonance__chair_inject|mcp__consonance__call_chair' }
  # Carrier drift. Silent when green, silent when the same red is already outstanding, and it
  # writes a ledger row on EVERY firing including the silent ones -- a hook that is quiet because
  # it is working reads exactly like a hook that was never installed, which is what the dispatch
  # gate's first probe cost to learn.
  @{ Event = 'Stop';             Rel = 'carrier-drift-watch.js';      Runner = 'node' }
)

if (-not (Test-Path $dest)) {
  if ($Check) { Write-Host "MISSING dir  $dest" -ForegroundColor Yellow }
  else { New-Item -ItemType Directory -Force -Path $dest | Out-Null; Write-Host "created $dest" }
}

$drift = 0
$held  = 0
foreach ($f in $files) {
  $src = Join-Path $repo $f.From
  $dst = Join-Path $dest $f.To

  if (-not (Test-Path $src)) {
    Write-Host ("ABSENT FROM REPO  {0}" -f $f.From) -ForegroundColor Red
    $drift++
    continue
  }

  $same = $false
  if (Test-Path $dst) {
    $same = (Get-FileHash $src).Hash -eq (Get-FileHash $dst).Hash
  }

  if ($same) {
    Write-Host ("ok       {0}" -f $f.To) -ForegroundColor DarkGray
  } elseif ($f.Hold) {
    # Differs, and declared unresolvable by this script. Say so loudly every run, in both modes,
    # and change nothing. A conflict that stops being mentioned is a conflict that gets resolved
    # by whoever happens to run the installer next, in whichever direction they happen to run it.
    Write-Host ("HOLD     {0}   two-way conflict - NOT overwritten (see the manifest comment)" -f $f.To) -ForegroundColor Magenta
    $held++
  } elseif ($Check) {
    Write-Host ("DRIFT    {0}" -f $f.To) -ForegroundColor Yellow
    $drift++
  } else {
    # Never overwrite a modified install without keeping the old copy: it may be
    # the only place an un-pushed fix exists. This is not hypothetical — nine files
    # existed ONLY as installed copies until 2026-08-17.
    if ((Test-Path $dst) -and -not $same) {
      Copy-Item $dst "$dst.bak-$(Get-Date -Format yyyyMMdd-HHmmss)" -Force
    }
    # `To` may now carry a directory (lib\, hooks\); create it before copying.
    $dstDir = Split-Path -Parent $dst
    if ($dstDir -and -not (Test-Path $dstDir)) { New-Item -ItemType Directory -Force -Path $dstDir | Out-Null }
    Copy-Item $src $dst -Force
    Write-Host ("synced   {0}" -f $f.To) -ForegroundColor Green
    $drift++
  }
}

if ($held -gt 0) {
  Write-Host ("`n{0} file(s) HELD - a real two-way conflict this script refuses to decide." -f $held) -ForegroundColor Magenta
  Write-Host "Resolve by hand, then drop Hold from the manifest entry." -ForegroundColor Magenta
}

if ($Check) {
  if ($drift -eq 0) { Write-Host "`nin sync with the repo." -ForegroundColor Green }
  else { Write-Host "`n$drift file(s) drifted. Re-run without -Check to sync." -ForegroundColor Yellow }
  exit ($(if ($drift -eq 0) { 0 } else { 1 }))
}

$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { $node = '<path to node.exe>' }

# Get-Command python on Windows usually resolves to the Microsoft Store stub
# under WindowsApps, which is an installer shim rather than an interpreter — a
# hook registered against it fails silently every turn. Skip it and find a real
# one, so this script never hands anybody a path that doesn't run.
$py = $null
foreach ($c in @(Get-Command python.exe -All -ErrorAction SilentlyContinue)) {
  if ($c.Source -and $c.Source -notmatch '\\WindowsApps\\') { $py = $c.Source; break }
}
if (-not $py) {
  $py = Get-ChildItem "$env:LOCALAPPDATA\Programs\Python\Python3*\python.exe" -ErrorAction SilentlyContinue |
        Sort-Object FullName -Descending | Select-Object -First 1 -ExpandProperty FullName
}
if (-not $py) { $py = '<path to python.exe — none found outside the Store stub>' }


# ── REGISTRATION ────────────────────────────────────────────────────────────────────────────
#
# The step that used to be a printed block for a human to paste, which is how a machine ended up
# running nine hooks this script had never heard of. See the header for the measurement.

function Resolve-Runner($kind) {
  if ($kind -eq 'py') { return $py }
  return $node
}

# The command string a registration produces. Quoted the way the existing entries are, so a
# re-run of this script against a file it already wrote compares equal and changes nothing.
function New-HookCommand($entry) {
  $exe  = Resolve-Runner $entry.Runner
  $path = Join-Path $dest $entry.Rel
  return ('"{0}" "{1}"' -f $exe, $path)
}

# Does an existing command line refer to this managed FILE, wherever it currently points?
# Matched on the leaf name so a registration aimed at the repo working tree — or at the old flat
# layout — is recognised as the same hook and RE-POINTED rather than duplicated. That case is
# real: sourced-stop.js and findings-return.js were hand-registered at repo paths on 2026-08-15.
# THE SEPARATOR IS LOAD-BEARING. The first version matched the bare leaf name and shipped a real
# defect on its first run, 2026-08-17 11:59: `stop.js` IS A SUBSTRING OF `sourced-stop.js`. So the
# stop.js entry matched the sourced-stop registration too, re-pointed it to stop.js, and then the
# sourced-stop entry found nothing left to match and appended itself — leaving stop.js registered
# TWICE and sourced-stop's original registration destroyed. Restored from the backup this script
# had just written, which is the only reason the backup exists.
#
# Requiring a path separator immediately before the leaf fixes it: `\sourced-stop.js` contains no
# `\stop.js`, because the character before `stop.js` there is a hyphen. Any future pair where one
# managed filename is a suffix of another is now safe by construction rather than by luck.
function Test-SameHook($command, $entry) {
  $leaf = Split-Path -Leaf $entry.Rel
  return ($command -match ('[\\/]' + [regex]::Escape($leaf)))
}

if ($NoRegister) {
  Write-Host "`nFiles are in sync. -NoRegister given; would have registered:" -ForegroundColor Cyan
  foreach ($e in $register) { Write-Host ("  {0,-17} {1}" -f $e.Event, (New-HookCommand $e)) -ForegroundColor DarkGray }
  Write-Host "`nRe-run without -NoRegister to apply." -ForegroundColor Cyan
  exit 0
}

$settingsPath = Join-Path $env:USERPROFILE '.claude\settings.json'
if (-not (Test-Path $settingsPath)) {
  Write-Host "`nNO settings.json at $settingsPath — refusing to create one." -ForegroundColor Red
  Write-Host "This script merges into a file the user owns; it does not invent that file." -ForegroundColor Red
  exit 1
}

# Parse before touching anything. A settings.json that does not parse must not be backed up over
# or written to — the failure is the user's to see, not this script's to paper over.
try   { $settings = Get-Content $settingsPath -Raw | ConvertFrom-Json }
catch { Write-Host "`nsettings.json DOES NOT PARSE — changing nothing. Fix it first:`n  $_" -ForegroundColor Red; exit 1 }

if (-not $settings.hooks) { $settings | Add-Member -NotePropertyName hooks -NotePropertyValue ([pscustomobject]@{}) -Force }

$added = 0; $repointed = 0; $already = 0
$changes = @()

foreach ($e in $register) {
  $want = New-HookCommand $e
  $ev   = $e.Event

  if (-not $settings.hooks.PSObject.Properties[$ev]) {
    $settings.hooks | Add-Member -NotePropertyName $ev -NotePropertyValue @() -Force
  }
  # An event's value is an array of groups, each with its own .hooks array. Normalise to a list so
  # a single group deserialised as a bare object does not read as zero groups — that exact
  # serialisation bug cost a day on the pane list (9e74004).
  $groups = @($settings.hooks.$ev)
  if ($groups.Count -eq 0) {
    $groups = @([pscustomobject]@{ hooks = @() })
  }

  # MATCHER-SCOPED EVENTS (PreToolUse and friends). A group carries the matcher, so a hook
  # appended to whatever group happens to be last would fire on every tool in the session -- a
  # per-call node spawn, and a gate pointed at things it was never meant to see. Entries with no
  # Matcher take the original path untouched.
  $slot = $null
  if ($e.Matcher) {
    foreach ($g in $groups) {
      if ($g.PSObject.Properties['matcher'] -and $g.matcher -eq $e.Matcher) { $slot = $g; break }
    }
    if (-not $slot) {
      $slot = [pscustomobject]@{ matcher = $e.Matcher; hooks = @() }
      $groups = @($groups) + @($slot)
    }
  }

  $found = $false
  foreach ($g in $groups) {
    if (-not $g.hooks) { continue }
    foreach ($h in @($g.hooks)) {
      if ($h.command -and (Test-SameHook $h.command $e)) {
        $found = $true
        if ($h.command -ne $want) {
          $changes += ("  REPOINT  {0,-17} {1}" -f $ev, (Split-Path -Leaf $e.Rel))
          $changes += ("           was: {0}" -f $h.command)
          $changes += ("           now: {0}" -f $want)
          $h.command = $want
          $repointed++
        } else { $already++ }
      }
    }
  }

  if (-not $found) {
    if ($slot) { $target = $slot } else { $target = $groups[$groups.Count - 1] }
    if (-not $target.PSObject.Properties['hooks']) {
      $target | Add-Member -NotePropertyName hooks -NotePropertyValue @() -Force
    }
    $target.hooks = @($target.hooks) + @([pscustomobject]@{ type = 'command'; command = $want; timeout = 10 })
    $changes += ("  ADD      {0,-17} {1}" -f $ev, (Split-Path -Leaf $e.Rel))
    $added++
  }

  $settings.hooks.$ev = $groups
}

if ($added -eq 0 -and $repointed -eq 0) {
  Write-Host "`nregistration: already correct ($already hook(s) verified, nothing changed)." -ForegroundColor Green
} else {
  $bak = "$settingsPath.bak-$(Get-Date -Format yyyyMMdd-HHmmss)"
  Copy-Item $settingsPath $bak -Force

  # NO BOM. `Set-Content -Encoding utf8` on PowerShell 5.1 PREPENDS ONE, and JSON.parse rejects a
  # leading BOM outright — so a settings.json written that way is unreadable to every Node consumer
  # while still looking fine to PowerShell. Shipped exactly that on the first real run,
  # 2026-08-17 11:59, and the read-back check below did not catch it because ConvertFrom-Json
  # TOLERATES a BOM. A validator more permissive than the real consumer is not a validator.
  #
  # This room already knew: hooks\userprompt-submit.js carries a BOM-strip in loadState() with the
  # note "anything on this machine that writes the file with PowerShell's -Encoding utf8 prepends
  # one". That comment was read during this very reconciliation, an hour before the bug.
  [IO.File]::WriteAllText($settingsPath, ($settings | ConvertTo-Json -Depth 24), [Text.UTF8Encoding]::new($false))

  # Read it back and parse it TWICE — once with PowerShell, once the way the harness actually reads
  # it. A settings.json this script broke would disable EVERY setting in it silently, and the backup
  # above is only useful if somebody knows to reach for it.
  $bytes = [IO.File]::ReadAllBytes($settingsPath)
  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Copy-Item $bak $settingsPath -Force
    Write-Host "`nWROTE A BOM into settings.json — RESTORED FROM BACKUP. JSON.parse would reject it." -ForegroundColor Red
    exit 1
  }
  try { Get-Content $settingsPath -Raw | ConvertFrom-Json | Out-Null }
  catch {
    Copy-Item $bak $settingsPath -Force
    Write-Host "`nWROTE AN UNPARSEABLE settings.json — RESTORED FROM BACKUP, nothing changed." -ForegroundColor Red
    Write-Host "  backup kept at $bak" -ForegroundColor Red
    exit 1
  }

  Write-Host "`nregistration:" -ForegroundColor Green
  $changes | ForEach-Object { Write-Host $_ -ForegroundColor Green }
  Write-Host ("  {0} added, {1} re-pointed, {2} already correct" -f $added, $repointed, $already) -ForegroundColor Green
  Write-Host ("  backup: {0}" -f $bak) -ForegroundColor DarkGray
}

Write-Host @"

Hooks NOT managed by this script are left exactly as they were — it never removes what it did
not install.

The settings watcher only reloads directories that held a settings file when the session started,
so a newly registered hook may not fire until /hooks is opened once or the session restarts.
Registration and firing are two states.

sourced-stop.js is a SENSOR ONLY - one ledger line per turn, no output, never blocks. The gate
version was refused in writing; the refusal is in the file's own header and
exo_memory/loop/catch_latency.md. Do not wire its ledger into a warning.

The pulse has two implementations - userprompt_pulse.py (zero deps) and hooks/userprompt-submit.js
(Node; adds the long-interval block and L3 verdict surfacing). This registers the Node one, which
is what both machines were already running. See dev/shell/README.md.
"@
