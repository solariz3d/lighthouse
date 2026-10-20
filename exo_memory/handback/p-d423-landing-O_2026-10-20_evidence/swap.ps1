# D423 swap (seat O, 2026-10-20): the staged Consonance build (lighthouse 36070cd7) and the letters.json correction, in the keeper's order.
# DRY RUN BY DEFAULT: prints each step and checks, changes nothing. -Apply acts. It NEVER launches Consonance: you reopen it yourself.
#
#   powershell -ExecutionPolicy Bypass -File C:\Consonance\staged\d423-36070cd7\swap.ps1            (dry run)
#   powershell -ExecutionPolicy Bypass -File C:\Consonance\staged\d423-36070cd7\swap.ps1 -Apply     (with Consonance closed)
#
# Order: 1 Consonance is closed (refuses otherwise) - 2 letters.json corrected (d423-letters-swap.js --apply, which backs it up)
#        3 the current exe backed up beside itself - 4 the staged exe put in place, sha256 checked - then YOU reopen Consonance.
# Roll back: copy consonance.exe.bak-d423-<stamp> over consonance.exe, and letters.json.bak-d423-<stamp> over letters.json.
param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$Staged   = Join-Path $PSScriptRoot 'consonance.exe'
$Expected = (Get-Content (Join-Path $PSScriptRoot 'consonance.exe.sha256') -Raw).Split(' ')[0].Trim().ToLower()
$Target   = 'C:\Users\nname\Desktop\lighthouse\consonance\src-tauri\target\release\consonance.exe'
$Letters  = 'C:\Users\nname\Desktop\lighthouse\consonance\tools\d423-letters-swap.js'
$mode = if ($Apply) { 'APPLY' } else { 'DRY RUN (nothing changes; add -Apply to act)' }
Write-Host "D423 swap - $mode"

# the staged file is the one that was built
$have = (Get-FileHash $Staged -Algorithm SHA256).Hash.ToLower()
if ($have -ne $Expected) { throw "the staged exe's sha256 is $have, not ${Expected}: stopping" }
Write-Host "  staged exe sha256 ok: $have"
if (-not (Test-Path $Target)) { throw "no exe at ${Target}: stopping" }
if (-not (Test-Path $Letters)) { throw "no $Letters (lighthouse main must be at 36070cd7 or later): stopping" }

# 1. Consonance must be closed: every pane lives in it, and its backend owns letters.json
$running = @(Get-Process -Name consonance -ErrorAction SilentlyContinue)
if ($running.Count) {
  $msg = "  1. Consonance is RUNNING (pid $($running.Id -join ', ')): close it first"
  if ($Apply) { throw $msg } else { Write-Host $msg }
} else { Write-Host '  1. Consonance is closed' }

# 2. letters.json: the three-row correction (its own dry run unless -Apply; it refuses while Consonance runs)
$letterArgs = @($Letters); if ($Apply) { $letterArgs += '--apply' }
Write-Host "  2. node $($letterArgs -join ' ')"
& node @letterArgs
if ($LASTEXITCODE -ne 0) { throw "  2. the letters step refused (exit $LASTEXITCODE): nothing further done" }

# 3 and 4. back up the current exe, then put the staged one in place
$stamp  = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
$backup = "$Target.bak-d423-$stamp"
if ($Apply) {
  Copy-Item $Target $backup
  Write-Host "  3. backed up the current exe -> $backup"
  Copy-Item $Staged $Target -Force
  $now = (Get-FileHash $Target -Algorithm SHA256).Hash.ToLower()
  if ($now -ne $Expected) { Copy-Item $backup $Target -Force; throw "  4. the copied exe's sha256 is $now, not the staged one: restored the backup" }
  Write-Host "  4. the staged exe is in place, sha256 $now"
  Write-Host ''
  Write-Host 'Done. Reopen Consonance yourself. Then post the board note the letters step printed (also at <data>\d423-letters-note.txt).'
  Write-Host 'Ring labels change for each pane only when that pane is respawned.'
} else {
  Write-Host "  3. would back up $Target -> $backup"
  Write-Host "  4. would put $Staged in place and check sha256 $Expected"
}
