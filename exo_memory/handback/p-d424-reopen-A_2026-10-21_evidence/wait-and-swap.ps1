# D424 (seat A, 2026-10-21), D423's pattern: waits, hidden, for the keeper to close Consonance, then runs swap.ps1 -Apply once and exits.
# It never launches Consonance and never takes focus. While Consonance is closed but a heavy-run job is still alive it keeps waiting
# (the swap refuses then); if Consonance is reopened first, it waits for the next close. It gives up after 24 h. Log: wait-and-swap.log.
$ErrorActionPreference = 'Stop'
$log = Join-Path $PSScriptRoot 'wait-and-swap.log'
$Locks = @('C:\Consonance\data\heavy-run.lock', 'C:\Consonance\data\heavy-run.2.lock')
function Log($m) { Add-Content -Path $log -Value ("{0:u} {1}" -f (Get-Date).ToUniversalTime(), $m) }
function JobAlive {
  foreach ($l in $Locks) {
    if (Test-Path $l) {
      try { $h = Get-Content $l -Raw | ConvertFrom-Json } catch { continue }
      if ($h.pid -and (Get-Process -Id $h.pid -ErrorAction SilentlyContinue)) { return "$($h.cmd) (pid $($h.pid))" }
    }
  }
  return $null
}
Log "armed, pid $PID"
$deadline = (Get-Date).AddHours(24); $closedFor = 0; $said = $null
while ((Get-Date) -lt $deadline) {
  if (@(Get-Process -Name consonance -ErrorAction SilentlyContinue).Count) { $closedFor = 0 } else { $closedFor++ }
  if ($closedFor -ge 3) {
    $job = JobAlive
    if ($job) { if ($said -ne $job) { Log "Consonance closed, but a job is alive: $job - waiting"; $said = $job } }
    else {
      Log 'Consonance closed for 3 s and no job alive: running swap.ps1 -Apply'
      try { & (Join-Path $PSScriptRoot 'swap.ps1') -Apply *>&1 | ForEach-Object { Log "  $_" }; Log 'done' }
      catch { Log "FAILED: $($_.Exception.Message)" }
      exit
    }
  }
  Start-Sleep -Seconds 1
}
Log 'gave up after 24 h, nothing changed'
