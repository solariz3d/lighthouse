# rebuild-on-close.ps1 - wait for Consonance to exit, rebuild it, flush the icon cache.
#
# WHY THIS EXISTS, and it is funnier than it is clever. The Main orchestrator pane runs INSIDE
# the Consonance app. Rebuilding requires the app closed, because Windows locks a running exe.
# So the chair asked the keeper to close it and then "say go" -- to a pane that closing it
# destroys. A handoff scheduled across its own execution. This needs nobody awake for it.
#
# WHY IT RETRIES, which the first version did not. Run one, 2026-07-29 05:16: the app closed,
# the build started, the keeper reopened the app 19 seconds in, the relaunched exe took the
# lock back, cargo could not replace it, and the script called exit 1 and was gone. One
# transient failure and the watcher was permanently dead -- while the chair went on telling the
# keeper it was "still armed," having never checked. A watcher that gives up on the first
# recoverable error is worse than none, because its silence is indistinguishable from waiting.
#
# So: it loops. A lock failure is not fatal, it is a reason to wait for the app to close again.
# It only stops on success, on a genuine build error, or on the timeout, and it says which.
#
# ASCII only, on purpose: Windows PowerShell 5.1 reads a BOM-less UTF-8 .ps1 as ANSI and
# mangles any non-ASCII character, which breaks the parse. This room has paid for that twice.
#
#   powershell -ExecutionPolicy Bypass -File dev\rebuild-on-close.ps1
param([int]$TimeoutMin = 120)

$ErrorActionPreference = 'Continue'
$root  = Split-Path -Parent $PSScriptRoot
$tauri = Join-Path $root 'consonance\src-tauri'
$exe   = Join-Path $tauri 'target\release\consonance.exe'
$log   = Join-Path $root 'dev\rebuild-on-close.log'
$cargo = Join-Path $env:USERPROFILE '.cargo\bin\cargo.exe'

function Say($m) {
  Add-Content -Path $log -Encoding utf8 -Value ("{0}  {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $m)
}
function AppRunning { [bool](Get-Process -Name consonance -ErrorAction SilentlyContinue) }

Say "watcher armed (timeout ${TimeoutMin}m, retries on lock) - close Consonance and leave it shut ~90s"
$deadline = (Get-Date).AddMinutes($TimeoutMin)
$before = if (Test-Path $exe) { (Get-Item $exe).LastWriteTime } else { $null }
$attempt = 0

while ((Get-Date) -lt $deadline) {
  if (AppRunning) { Start-Sleep -Seconds 3; continue }

  # The process can leave the table a beat before the file handle drops, and the link step
  # fails on the difference. Confirm the lock is actually gone by trying to open it for write.
  Start-Sleep -Seconds 3
  try { $fs = [IO.File]::Open($exe, 'Open', 'Write'); $fs.Close() }
  catch { Say "exe still locked despite no process - waiting"; Start-Sleep -Seconds 5; continue }

  $attempt++
  Say "attempt ${attempt}: building release..."
  Push-Location $tauri
  $out = & $cargo build --release --bins 2>&1
  Pop-Location

  $locked = $out | Where-Object { $_ -match 'Access is denied|used by another process|os error 5' }
  if ($locked) { Say "attempt ${attempt}: lock returned mid-build (app reopened?) - will retry"; continue }
  $err = $out | Where-Object { $_ -match '^error' }
  if ($err) { Say ("attempt ${attempt}: REAL BUILD ERROR - " + ($err | Select-Object -First 1)); exit 1 }

  $after = (Get-Item $exe).LastWriteTime
  Say ("build ok; exe {0} -> {1}" -f $before, $after)
  if ($before -eq $after) {
    # build.rs now declares rerun-if-changed on icons/, so this should not happen. If it does,
    # say it plainly rather than let a no-op read as success -- that failure already shipped
    # once today wearing a green result.
    Say "WARNING: exe timestamp unchanged - the build did nothing and the icon is NOT embedded"
  }
  Say "flushing icon cache (ie4uinit -show)"
  Start-Process -FilePath "$env:SystemRoot\System32\ie4uinit.exe" -ArgumentList '-show' -Wait -NoNewWindow
  Say "DONE - relaunch Consonance from the desktop shortcut"
  exit 0
}
Say "TIMED OUT after ${TimeoutMin}m - app never stayed closed long enough; nothing built"
exit 1
