# D476 part 2 swap (seat O, 2026-10-26): the staged Consonance build (lighthouse d476-o d5b93f8c), the D423 procedure.
# DRY RUN BY DEFAULT: prints each step and check, changes nothing. -Apply acts. It NEVER launches Consonance: you reopen it yourself.
#
#   powershell -ExecutionPolicy Bypass -File C:\Consonance\staged\d476-d5b93f8c\swap.ps1            (dry run)
#   powershell -ExecutionPolicy Bypass -File C:\Consonance\staged\d476-d5b93f8c\swap.ps1 -Apply     (with Consonance closed)
#
# Order: 1 Consonance is closed (refuses otherwise) - 2 the current exe backed up beside itself - 3 the staged exe put in place,
#        sha256 checked (restores the backup itself if it does not match) - then YOU reopen Consonance.
# Roll back: copy consonance.exe.bak-d476-<stamp> over consonance.exe.
# The Third Place gets its mount when it is next opened (its tab); a seat already open keeps the process it has.
param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$Staged   = Join-Path $PSScriptRoot 'consonance.exe'
$Expected = (Get-Content (Join-Path $PSScriptRoot 'consonance.exe.sha256') -Raw).Split(' ')[0].Trim().ToLower()
$Target   = 'C:\Users\nname\Desktop\lighthouse\consonance\src-tauri\target\release\consonance.exe'
$mode = if ($Apply) { 'APPLY' } else { 'DRY RUN (nothing changes; add -Apply to act)' }
Write-Host "D476 swap - $mode"

# the staged file is the one that was built
$have = (Get-FileHash $Staged -Algorithm SHA256).Hash.ToLower()
if ($have -ne $Expected) { throw "the staged exe's sha256 is $have, not ${Expected}: stopping" }
Write-Host "  staged exe sha256 ok: $have"
if (-not (Test-Path $Target)) { throw "no exe at ${Target}: stopping" }
$current = (Get-FileHash $Target -Algorithm SHA256).Hash.ToLower()
Write-Host "  current exe sha256: $current"

# 1. Consonance must be closed: every pane lives in it
$running = @(Get-Process -Name consonance -ErrorAction SilentlyContinue)
if ($running.Count) {
  $msg = "  1. Consonance is RUNNING (pid $($running.Id -join ', ')): close it first"
  if ($Apply) { throw $msg } else { Write-Host $msg }
} else { Write-Host '  1. Consonance is closed' }

# 2 and 3. back up the current exe, then put the staged one in place
$stamp  = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
$backup = "$Target.bak-d476-$stamp"
if ($Apply) {
  if (Test-Path $backup) { throw "  2. ${backup} already exists: stopping" }
  Copy-Item $Target $backup
  Write-Host "  2. backed up the current exe -> $backup"
  Copy-Item $Staged $Target -Force
  $now = (Get-FileHash $Target -Algorithm SHA256).Hash.ToLower()
  if ($now -ne $Expected) { Copy-Item $backup $Target -Force; throw "  3. the copied exe's sha256 is $now, not the staged one: restored the backup" }
  Write-Host "  3. the staged exe is in place, sha256 $now"
  Write-Host ''
  Write-Host 'Done. Reopen Consonance yourself.'
} else {
  Write-Host "  2. would back up $Target -> $backup"
  Write-Host "  3. would put $Staged in place and check sha256 $Expected"
}
