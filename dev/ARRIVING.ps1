# ARRIVING.ps1 - run this on the machine you have ARRIVED at, with Consonance CLOSED.
# One command. It brings every seat's conversation from the stick onto this machine, then
# launches Consonance so every seat continues where it left off on the other machine.
#
#   powershell -ExecutionPolicy Bypass -File <stick>\ARRIVING.ps1            # do it
#   powershell -ExecutionPolicy Bypass -File <stick>\ARRIVING.ps1 -DryRun    # only show what it would do
#
# What it does, in order:
#   1. git pull in the lighthouse repo (so the carry tool and the room's files are current)
#   2. rehearse the import (writes nothing) and read the verdict per seat
#   3. if a committee PANE is refused because this machine holds a different conversation under
#      the same id, retire this machine's copy (renamed with a stamp, never deleted) and take the
#      stick's - the stick's copies are the real ones. A FIXED seat (chair, librarian, Third
#      Place) refused that way STOPS the script: that is a decision, not a step.
#   4. import for real; every rejoined file is hashed whole against the other machine's record
#   5. launch Consonance
#
# Under the hood: node dev\tail-carry.js --stick <stick> --import [--retire-far <sid>...] --apply

param([switch]$DryRun)
$ErrorActionPreference = 'Stop'

$stick = $PSScriptRoot
$repo = @('C:\Consonance\lighthouse', 'C:\Users\nname\Desktop\lighthouse') | Where-Object { Test-Path (Join-Path $_ '.git') } | Select-Object -First 1
if (-not $repo) { Write-Host "[arriving] no lighthouse repo found on this machine"; exit 2 }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host "[arriving] node is not installed on this machine"; exit 2 }
$fixed = @('0c0c0c0a-0000-4000-8000-000000000a01', '0c0c0c0b-0000-4000-8000-00000000115b', '3d000000-0000-4000-8000-000000003d00')

function AppRunning { [bool](Get-Process -Name consonance -ErrorAction SilentlyContinue) }
if ((AppRunning) -and (-not $DryRun)) { Write-Host "[arriving] Consonance is running. Close it, then run this again."; exit 2 }

Write-Host "[arriving] repo  $repo"
Write-Host "[arriving] stick $stick"

# 1. pull
Push-Location $repo
try {
  Write-Host "[arriving] git pull ..."
  & git pull --ff-only | Out-Host
  if ($LASTEXITCODE -ne 0) {
    # a push from the other machine can land mid-pull; one retry covers the race seen on D at 12:55
    Start-Sleep -Seconds 5
    & git pull --ff-only | Out-Host
    if ($LASTEXITCODE -ne 0) { Write-Host "[arriving] git pull FAILED twice - the room's files here are stale. Continuing with the carry, because the conversations matter more; tell the librarian seat to sort the pull out." }
  }
  if (-not (Test-Path 'dev\tail-carry.js')) { Write-Host "[arriving] dev\tail-carry.js is not in this repo after the pull - stop and ask"; exit 2 }

  # 2. rehearse
  Write-Host "[arriving] rehearsing the import (writes nothing) ..."
  $lines = & node 'dev\tail-carry.js' '--stick' $stick '--import' | ForEach-Object { $_ }
  $lines | Out-Host

  # 3. read the verdicts: a REFUSED row followed by a 'DIFFERENT conversation' reason.
  #    A pane's copy is retired without asking (the stick's is the real one). A FIXED seat's copy is
  #    retired only if it was BORN AFTER the stick's export - i.e. this machine's Consonance was
  #    opened before ARRIVING ran and started a fresh session under the seat's id. A conversation
  #    that began after the export cannot be the older lineage; by the room's own test (a first
  #    timestamp at a launch minute) it is a new conversation, and stepping it aside loses nothing
  #    real. Any other fixed-seat refusal STOPS: that is a decision, not a step.
  $ledger = $null
  $ledgerPath = Join-Path $stick 'consonance-tails\ledger.json'
  if (Test-Path $ledgerPath) { $ledger = Get-Content $ledgerPath -Raw | ConvertFrom-Json }
  function FarFirstTimestamp([string]$sid) {
    $root = Join-Path $env:USERPROFILE '.claude\projects'
    $f = Get-ChildItem -Path $root -Recurse -Filter "$sid.jsonl" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $f) { return $null }
    $fs = [System.IO.File]::OpenRead($f.FullName)
    try { $buf = New-Object byte[] 400000; $n = $fs.Read($buf, 0, $buf.Length) } finally { $fs.Close() }
    $text = [System.Text.Encoding]::UTF8.GetString($buf, 0, $n)
    $m = [regex]::Match($text, '"timestamp":"([^"]+)"')
    if ($m.Success) { return [datetime]::Parse($m.Groups[1].Value).ToUniversalTime() } else { return $null }
  }
  function ExportedAt([string]$sid) {
    if (-not $ledger) { return $null }
    $seat = $ledger.seats.$sid
    if ($seat -and $seat.pending -and $seat.pending.at) { return [datetime]::Parse($seat.pending.at).ToUniversalTime() }
    return $null
  }
  $retire = @(); $stop = @()
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $m = [regex]::Match($lines[$i], '^\s*REFUSED\s+\S.*?\s([0-9a-f]{8}-[0-9a-f-]{27})\s*$')
    if (-not $m.Success) { continue }
    $sid = $m.Groups[1].Value
    $why = ''
    # the reason is not on the next line: tail-carry prints 'tail 0..N from X' first, then the reason,
    # wrapped. Read every indented line under this row (found on L, 2026-09-14: the next-line read
    # STOPPED a launch-born librarian that this script exists to retire).
    for ($j = $i + 1; $j -lt $lines.Count -and $lines[$j] -match '^\s{6,}\S'; $j++) { $why += ' ' + $lines[$j].Trim() }
    if ($why -match 'DIFFERENT conversation') {
      if ($fixed -contains $sid) {
        $born = FarFirstTimestamp $sid
        $exported = ExportedAt $sid
        if ($born -and $exported -and ($born -gt $exported)) {
          $far = Get-ChildItem -Path (Join-Path $env:USERPROFILE '.claude\projects') -Recurse -Filter "$sid.jsonl" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
          $sz = 0; if ($far) { $sz = $far.Length }
          Write-Host "[arriving] $sid : this machine's copy began $($born.ToString('u')), AFTER the stick's export $($exported.ToString('u')) - it will be RETIRED (stamped, never deleted) and the stick's taken."
          Write-Host "[arriving]     retiring: $($far.FullName)  ($sz bytes, last written $($far.LastWriteTime.ToString('u')))  - if you worked in this seat before importing, that work is in the stamped file beside it, not gone."
          $retire += $sid
        } else {
          $stop += $sid
        }
      } else { $retire += $sid }
    } else {
      $stop += $sid
    }
  }
  if ($stop.Count -gt 0) {
    Write-Host "[arriving] STOP - these seats need a decision, not a script:"
    $stop | ForEach-Object { Write-Host "    $_" }
    Write-Host "[arriving] read the reason lines above; nothing was written."
    exit 1
  }
  if ($retire.Count -gt 0) {
    Write-Host "[arriving] these panes hold a different conversation here; this machine's copy will be retired (stamped, never deleted) and the stick's taken:"
    $retire | ForEach-Object { Write-Host "    $_" }
  }
  if ($DryRun) { Write-Host "[arriving] dry run only - nothing written."; exit 0 }

  # 4. import
  $args = @('dev\tail-carry.js', '--stick', $stick, '--import', '--apply')
  foreach ($sid in $retire) { $args += @('--retire-far', $sid) }
  Write-Host "[arriving] importing ..."
  & node @args | Out-Host
  $code = $LASTEXITCODE
  if ($code -ne 0) { Write-Host "[arriving] the carry tool refused (exit $code). Nothing is half-written. Read the lines above."; exit $code }
} finally { Pop-Location }

# 5. launch
$exe = Join-Path $repo 'consonance\src-tauri\target\release\consonance.exe'
if (Test-Path $exe) {
  Write-Host "[arriving] launching Consonance ..."
  Start-Process -FilePath $exe -WorkingDirectory (Split-Path -Parent $exe) | Out-Null
  Write-Host "[arriving] done. Every seat should say RESUMED in C:\Consonance\data\persist.log."
  # 6. the reminder that does the work: a window that waits for Consonance to close, then exports
  $onExit = Join-Path $stick 'ON-EXIT.ps1'
  if (Test-Path $onExit) {
    Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-File', "`"$onExit`"") | Out-Null
    Write-Host "[arriving] a second window is now waiting: when you close Consonance it runs LEAVING.ps1 for you. Do not unplug the stick until that window says DONE."
  }
} else {
  Write-Host "[arriving] imported. No release exe at $exe - launch Consonance the way you usually do."
}
exit 0
