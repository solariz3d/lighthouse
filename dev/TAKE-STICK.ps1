# TAKE-STICK.ps1 - "revert to the laptop's path": every seat on THIS machine becomes the stick's continuation.
#
# For each seat the carry tool reads as DIVERGED (this machine and the stick share a prefix and then
# continued differently), the tool's own door is used: --take-stick <sid>. The tool copies this
# machine's whole file to the attic (stamped, never deleted), cuts the seat back to the shared
# prefix, appends the stick's tail, and hashes the rejoined file whole against the other machine's
# record. Seats that merely APPEND are appended as usual. Then Consonance is launched, with the
# on-exit window that refreshes the stick when you close it.
#
#   powershell -ExecutionPolicy Bypass -File <stick>\TAKE-STICK.ps1            # do it (Consonance CLOSED)
#   powershell -ExecutionPolicy Bypass -File <stick>\TAKE-STICK.ps1 -DryRun    # show the plan, touch nothing
#
# This is the keeper's decision at 871ad66 ("the laptop's wins") carried out with the door landed at
# 862509f (P-DIVERGED, both halves). Nothing here truncates a file by hand.

param([switch]$DryRun)
$ErrorActionPreference = 'Stop'

$stick = $PSScriptRoot
$repo = @('C:\Consonance\lighthouse', 'C:\Users\nname\Desktop\lighthouse') | Where-Object { Test-Path (Join-Path $_ 'dev\tail-carry.js') } | Select-Object -First 1
if (-not $repo) { Write-Host "[take-stick] no lighthouse repo with dev\tail-carry.js on this machine - git pull first"; exit 2 }
function AppRunning { [bool](Get-Process -Name consonance -ErrorAction SilentlyContinue) }
if ((AppRunning) -and (-not $DryRun)) { Write-Host "[take-stick] Consonance is running. Close it, then run this again."; exit 2 }

Push-Location $repo
try {
  $help = & node 'dev\tail-carry.js' '--help' 2>&1 | Out-String
  if ($help -notmatch 'take-stick') { Write-Host "[take-stick] this checkout's carry tool has no --take-stick door - git pull (or merge the stick's files\repo-carry bundle) first"; exit 2 }

  Write-Host "[take-stick] repo  $repo"
  Write-Host "[take-stick] stick $stick"
  Write-Host "[take-stick] rehearsing the import (writes nothing) ..."
  $lines = & node 'dev\tail-carry.js' '--stick' $stick '--import' | ForEach-Object { $_ }
  $lines | Out-Host

  $take = @(); $stop = @()
  foreach ($ln in $lines) {
    $m = [regex]::Match($ln, '^\s*([A-Z_]+)\s+\S.*?\s([0-9a-f]{8}-[0-9a-f-]{27})\s*$')
    if (-not $m.Success) { continue }
    $verdict = $m.Groups[1].Value; $sid = $m.Groups[2].Value
    if ($verdict -eq 'DIVERGED') { $take += $sid }
    elseif ($verdict -in @('REFUSED', 'INTERRUPTED', 'ABSENT_HERE')) { $stop += $sid }
  }
  if ($stop.Count -gt 0) {
    Write-Host "[take-stick] STOP - these seats are not a fork and need a decision, not this script:"
    $stop | ForEach-Object { Write-Host "    $_" }
    exit 1
  }
  if ($take.Count -gt 0) {
    Write-Host "[take-stick] DIVERGED here, will take the stick's (this machine's file goes to the attic whole, stamped, never deleted):"
    $take | ForEach-Object { Write-Host "    $_" }
  } else { Write-Host "[take-stick] nothing diverged; a plain import is enough." }

  $args = @('dev\tail-carry.js', '--stick', $stick, '--import')
  foreach ($sid in $take) { $args += @('--take-stick', $sid) }
  if ($DryRun) {
    Write-Host "[take-stick] dry run - rehearsing with the door, nothing written:"
    & node @args | Out-Host
    exit 0
  }
  $args += '--apply'
  Write-Host "[take-stick] importing ..."
  & node @args | Out-Host
  $code = $LASTEXITCODE
  if ($code -ne 0) { Write-Host "[take-stick] the carry tool did not finish clean (exit $code). Read the lines above; anything retired is whole in ~\.claude\consonance-attic."; exit $code }
} finally { Pop-Location }

$exe = Join-Path $repo 'consonance\src-tauri\target\release\consonance.exe'
if (Test-Path $exe) {
  Start-Process -FilePath $exe -WorkingDirectory (Split-Path -Parent $exe) | Out-Null
  Write-Host "[take-stick] done - every seat here is now the stick's continuation. Consonance launched."
  $onExit = Join-Path $stick 'ON-EXIT.ps1'
  if (Test-Path $onExit) { Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-File', "`"$onExit`"") | Out-Null }
} else { Write-Host "[take-stick] done - imported. No release exe at $exe; launch Consonance the way you usually do." }
exit 0
