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
#   pwsh dev/shell/install.ps1            # sync files, then print what to register
#   pwsh dev/shell/install.ps1 -Check     # report drift only, change nothing
#
# It deliberately does NOT edit ~/.claude/settings.json. That file is the user's,
# it carries unrelated settings, and a one-time registration is not the thing
# that drifts. The exact block to paste is printed at the end.

[CmdletBinding()]
param([switch]$Check)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)   # …/lighthouse
$dest = Join-Path $env:USERPROFILE '.claude\shell'

# source -> installed name. Flattened on purpose: ambient.js lands beside the
# hook that requires it, so the hook resolves it with no path configuration.
$files = @(
  @{ From = 'dev\shell\lib\ambient.js';                  To = 'ambient.js' }
  @{ From = 'dev\shell\hooks\sessionstart-ambient.js';   To = 'sessionstart-ambient.js' }
  @{ From = 'dev\shell\hooks\userprompt_pulse.py';       To = 'userprompt_pulse.py' }
  @{ From = 'consonance\hooks\board-digest.js';          To = 'board-digest.js' }
  @{ From = 'consonance\hooks\transcript-watch.js';      To = 'transcript-watch.js' }
  @{ From = 'consonance\hooks\dream-watch.js';           To = 'dream-watch.js' }
)

if (-not (Test-Path $dest)) {
  if ($Check) { Write-Host "MISSING dir  $dest" -ForegroundColor Yellow }
  else { New-Item -ItemType Directory -Force -Path $dest | Out-Null; Write-Host "created $dest" }
}

$drift = 0
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
  } elseif ($Check) {
    Write-Host ("DRIFT    {0}" -f $f.To) -ForegroundColor Yellow
    $drift++
  } else {
    # Never overwrite a modified install without keeping the old copy: it may be
    # the only place an un-pushed fix exists.
    if ((Test-Path $dst) -and -not $same) {
      Copy-Item $dst "$dst.bak-$(Get-Date -Format yyyyMMdd-HHmmss)" -Force
    }
    Copy-Item $src $dst -Force
    Write-Host ("synced   {0}" -f $f.To) -ForegroundColor Green
    $drift++
  }
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

Write-Host @"

Files are in sync. Register them once in ~/.claude/settings.json:

  "hooks": {
    "SessionStart": [
      { "hooks": [ { "type": "command", "timeout": 10,
          "command": "\"$node\" \"$dest\sessionstart-ambient.js\"" } ] }
    ],
    "UserPromptSubmit": [
      { "hooks": [
          { "type": "command", "timeout": 10,
            "command": "\"$py\" \"$dest\userprompt_pulse.py\"" },
          { "type": "command", "timeout": 10,
            "command": "\"$node\" \"$dest\board-digest.js\"" },
          { "type": "command", "timeout": 10,
            "command": "\"$node\" \"$dest\transcript-watch.js\"" },
          { "type": "command", "timeout": 10,
            "command": "\"$node\" \"$dest\dream-watch.js\"" }
      ] }
    ]
  }

The pulse has two implementations — userprompt_pulse.py (zero deps) and
dev/shell/hooks/userprompt-submit.js (Node; adds the long-interval block and L3
verdict surfacing). Register one, not both. See dev/shell/README.md.
"@
