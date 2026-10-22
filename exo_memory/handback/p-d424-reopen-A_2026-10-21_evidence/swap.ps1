# D424 swap (seat A, 2026-10-21): the staged Consonance build (lighthouse 413b938c on d424-a), in D423's pattern.
# DRY RUN BY DEFAULT: prints each step and checks, changes nothing. -Apply acts. It NEVER launches Consonance: the keeper reopens it.
#
#   powershell -ExecutionPolicy Bypass -File C:\Consonance\staged\d424-413b938c\swap.ps1            (dry run)
#   powershell -ExecutionPolicy Bypass -File C:\Consonance\staged\d424-413b938c\swap.ps1 -Apply     (with Consonance closed)
#
# Order: 1 Consonance is closed (refuses otherwise) - 2 no pane's job is still running (a heavy-run lock with a live pid refuses)
#        3 the current exe backed up beside itself as consonance.exe.bak-d424-<stamp> - 4 the staged exe put in place, sha256 checked
#        against the stamp in consonance.exe.sha256 (the backup is restored if it does not match).
# Roll back: copy consonance.exe.bak-d424-<stamp> over consonance.exe, with Consonance closed.
param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$Staged   = Join-Path $PSScriptRoot 'consonance.exe'
$Expected = (Get-Content (Join-Path $PSScriptRoot 'consonance.exe.sha256') -Raw).Split(' ')[0].Trim().ToLower()
$Target   = 'C:\Users\nname\Desktop\lighthouse\consonance\src-tauri\target\release\consonance.exe'
$Locks    = @('C:\Consonance\data\heavy-run.lock', 'C:\Consonance\data\heavy-run.2.lock')
$mode = if ($Apply) { 'APPLY' } else { 'DRY RUN (nothing changes; add -Apply to act)' }
Write-Host "D424 swap - $mode"

# the staged file is the one that was built
$have = (Get-FileHash $Staged -Algorithm SHA256).Hash.ToLower()
if ($have -ne $Expected) { throw "the staged exe's sha256 is $have, not ${Expected}: stopping" }
Write-Host "  staged exe sha256 ok: $have"
if (-not (Test-Path $Target)) { throw "no exe at ${Target}: stopping" }

# 1. Consonance must be closed: every pane lives in it, and the exe cannot be replaced while it runs
$running = @(Get-Process -Name consonance -ErrorAction SilentlyContinue)
if ($running.Count) {
  $msg = "  1. Consonance is RUNNING (pid $($running.Id -join ', ')): it must be closed by the keeper first"
  if ($Apply) { throw $msg } else { Write-Host $msg }
} else { Write-Host '  1. Consonance is closed' }

# 2. no pane is mid-job: a heavy-run holder whose pid is still alive is a job outliving its pane
$live = @()
foreach ($l in $Locks) {
  if (Test-Path $l) {
    try { $h = Get-Content $l -Raw | ConvertFrom-Json } catch { $h = $null }
    if ($h -and $h.pid -and (Get-Process -Id $h.pid -ErrorAction SilentlyContinue)) { $live += "$($h.cmd) (pid $($h.pid))" }
  }
}
if ($live.Count) {
  $msg = "  2. a job is still running: $($live -join '; ')"
  if ($Apply) { throw $msg } else { Write-Host $msg }
} else { Write-Host '  2. no heavy-run job is alive' }

# 3 and 4. back up the current exe, then put the staged one in place
$stamp  = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
$backup = "$Target.bak-d424-$stamp"
$was = (Get-FileHash $Target -Algorithm SHA256).Hash.ToLower()
if ($Apply) {
  Copy-Item $Target $backup
  $bak = (Get-FileHash $backup -Algorithm SHA256).Hash.ToLower()
  if ($bak -ne $was) { throw "  3. the backup's sha256 is $bak, not the running exe's ${was}: stopping, nothing replaced" }
  Write-Host "  3. backed up the current exe (sha256 $was) -> $backup"
  Copy-Item $Staged $Target -Force
  $now = (Get-FileHash $Target -Algorithm SHA256).Hash.ToLower()
  if ($now -ne $Expected) { Copy-Item $backup $Target -Force; throw "  4. the copied exe's sha256 is $now, not the stamped ${Expected}: restored the backup" }
  Write-Host "  4. the staged exe is in place, sha256 $now (matches the stamp)"
  Write-Host ''
  Write-Host 'Done. Consonance stays closed until the keeper reopens it.'
} else {
  Write-Host "  3. would back up $Target (sha256 $was) -> $backup"
  Write-Host "  4. would put $Staged in place and check sha256 $Expected"
}
