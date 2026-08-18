# install_headwatch.ps1 - register head-watch as a DETACHED task, so it survives the event it
# exists to observe.
#
#   powershell -ExecutionPolicy Bypass -File dev\headwatch\install_headwatch.ps1
#   powershell -ExecutionPolicy Bypass -File dev\headwatch\install_headwatch.ps1 -Uninstall
#   powershell -ExecutionPolicy Bypass -File dev\headwatch\install_headwatch.ps1 -Check
#
# WHY THIS FILE EXISTS, and it is a repair rather than a feature.
#
# head-watch is pane B's falsifier for the board-replay diagnosis. All three of its registered
# outcomes require observing a CONSONANCE RELAUNCH. On 2026-08-17 it was started as a background
# job of the chair's own session; on 2026-08-18 the keeper restarted Consonance and the watcher
# died in the same moment, having logged two 'start' rows and nothing between. The instrument was
# killed by the exact event it was armed for, and that is not bad luck - it is what "child of the
# session" MEANS when the session is the thing being restarted.
#
# Recovered partially after the fact by comparing the two start rows (head identical across the
# relaunch, which is evidence against the header-mutation arm but is two endpoint samples, not a
# watch - a flip-and-flip-back inside the window is invisible to it). The clean read still needs
# a watcher alive THROUGH a relaunch. Hence this.
#
# THREE LESSONS CARRIED VERBATIM from dev\dream\install_dream.ps1 and dev\vantage\install_vantage.ps1
# and NOT re-derived here - read those for the full accounts:
#   * PRE-FLIGHT - never register a task around a runner that cannot load (2026-07-15: a dropped
#     BOM made the dream runner unparsable, it died before its first log line, and Task Scheduler
#     recorded success for eight hours).
#   * THE WSCRIPT SHIM - powershell.exe -WindowStyle Hidden still flashes a console and can steal
#     focus from a fullscreen game. wscript.exe is a GUI host and never creates one.
#   * WAIT FOR THE EXIT CODE - a fire-and-forget shim makes the scheduler record success for a
#     process it never watched.
#
# WHAT IS DELIBERATELY DIFFERENT FROM THE VANTAGE CLOCK:
#   * NOT a daily trigger. This is a WATCHER, not a run: AtLogOn, plus AtStartup so a machine
#     powered on without a login still watches, and it stays up until killed.
#   * NO ExecutionTimeLimit. The vantage task caps at 30 minutes because a reader that hangs
#     should die. A watcher capped at any duration would be killed mid-watch and go silent
#     exactly the way the 08-18 miss went silent. Set to zero = unlimited, deliberately.
#   * RestartOnFailure. If it dies, come back in a minute rather than stay dead until next logon.
#   * MultipleInstances IgnoreNew, AND head-watch.js holds its own pid lock. Two mechanisms
#     because they cover different cases: the scheduler setting stops the SCHEDULER starting a
#     second; the lock stops a HUMAN starting one alongside. Two watchers on one ledger would
#     log a head-flip twice and the duplicate would read as two events, not one seen twice.
#   * NO WakeToRun, same reasoning as the vantage clock: nothing here should wake a sleeping
#     machine.
#
# ASCII ONLY in this file. PowerShell 5.1 reads a .ps1 as ANSI unless it has a BOM; a UTF-8
# em-dash becomes mojibake and the parse fails. Cost two runs on 2026-08-18 to relearn.
param(
  [switch]$Uninstall,
  [switch]$Check,
  [string]$TaskName = "Consonance Head Watch"
)
$ErrorActionPreference = "Stop"

function Info($m){ Write-Host "  ..   $m" -ForegroundColor Cyan }
function Ok($m){   Write-Host "  OK   $m" -ForegroundColor Green }
function Warn($m){ Write-Host "  WARN $m" -ForegroundColor Yellow }
function Die($m){  Write-Host "  FAIL $m" -ForegroundColor Red; exit 1 }

$repo   = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$runner = Join-Path $repo "consonance\tools\head-watch.js"
$LauncherDir = Join-Path $env:LOCALAPPDATA "Consonance"
$vbs       = Join-Path $LauncherDir "headwatch_launch.vbs"
$launchLog = Join-Path $LauncherDir "headwatch_launch.log"

# ---- Check / Uninstall ------------------------------------------------------
if ($Check) {
  $t = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
  if (-not $t) { Write-Host "NOT REGISTERED: $TaskName" -ForegroundColor Yellow; exit 1 }
  $i = Get-ScheduledTaskInfo -TaskName $TaskName
  Write-Host "Task:       $TaskName  [$($t.State)]"
  Write-Host "Triggers:   $(($t.Triggers | ForEach-Object { $_.CimClass.CimClassName }) -join ', ')"
  Write-Host "TimeLimit:  $($t.Settings.ExecutionTimeLimit)  (PT0S = unlimited, required for a watcher)"
  Write-Host "Instances:  $($t.Settings.MultipleInstancesPolicy)"
  Write-Host "LastRun:    $($i.LastRunTime)   result $($i.LastTaskResult)"
  Write-Host "Launcher:   $vbs"
  Write-Host "LaunchLog:  $launchLog"
  $running = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
             Where-Object { $_.CommandLine -like "*head-watch.js*" -and $_.Name -eq "node.exe" }
  if ($running) { Ok ("watcher alive, pid " + ($running.ProcessId -join ', ')) }
  else { Warn "NO node process is running head-watch.js right now" }
  exit 0
}
if ($Uninstall) {
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
  Ok "unregistered $TaskName (the .vbs and log are left in place on purpose)"
  exit 0
}

# ---- PRE-FLIGHT: elevation. AtLogOn/AtStartup triggers require an Administrator token; an
# unelevated Register-ScheduledTask returns a bare "Access is denied" (0x80070005) that reads
# like a bug rather than a missing privilege. That is the 2026-08-18 failure: the whole point of
# a pre-flight is to refuse with the remedy BEFORE the operator has to interpret an opaque error,
# so this is the very first thing checked on the register path. -Check and -Uninstall already
# returned above and never reach here, so they still run unelevated.
$isAdmin = ([Security.Principal.WindowsPrincipal] `
  [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
  Warn "this shell is NOT elevated (Medium integrity)."
  Warn "AtLogOn/AtStartup triggers need an Administrator token, so registration WILL fail with 'Access is denied'."
  Die  "run me from an ELEVATED shell: press Win+X, choose 'Terminal (Admin)' or 'Windows PowerShell (Admin)', then re-run:  powershell -ExecutionPolicy Bypass -File $PSCommandPath"
}
Ok "pre-flight: elevated (Administrator token present)"

# ---- PRE-FLIGHT: never register a task around a runner that cannot load ------
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node)               { Die "node is not on PATH; refusing to register a task that cannot run" }
if (-not (Test-Path $runner)) { Die "runner not found: $runner" }
& $node --check $runner
if ($LASTEXITCODE -ne 0)      { Die "runner does not parse; refusing to register (this is the 2026-07-15 lesson)" }
Ok "pre-flight: node + runner parse"

# The lock is what makes a detached task safe. If this file ever loses it, two watchers can run.
$src = Get-Content $runner -Raw
if ($src -notmatch 'acquireLock') { Die "head-watch.js has no acquireLock; refusing to register a task that could double-run" }
Ok "pre-flight: single-instance lock present in the runner"

# ---- The launcher shim ------------------------------------------------------
if (-not (Test-Path $LauncherDir)) { New-Item -ItemType Directory -Path $LauncherDir -Force | Out-Null }

$vbsBody = @"
' headwatch_launch.vbs - GENERATED by install_headwatch.ps1. Do not hand-edit: re-run the
' installer instead, or your change dies at the next install and nobody knows.
' ASCII ONLY. wscript refuses a UTF-8 BOM and misreads non-ASCII.
Option Explicit
Dim shell, fso, rc, cmd
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

cmd = """$node"" ""$runner"""

Stamp "launch"
' 0 = no window ever. True = WAIT, so the exit code below is the watcher's own and the
' scheduler cannot record success for a process it never watched.
rc = shell.Run(cmd, 0, True)
' The 5-minute re-arm trigger fires this shim even when a watcher is already up; the runner then
' refuses on the lock and exits 0 in milliseconds. Distinguish that idle no-op (rc=0) from a real
' watcher death (rc<>0) so the log stays readable: a live watcher is a "launch" with no matching
' terminal line yet; a death is "exit <nonzero>"; a re-arm no-op is "idle".
If rc = 0 Then
  Stamp "idle (re-arm no-op: another watcher holds the lock)"
Else
  Stamp "exit " & rc
End If
WScript.Quit rc

Sub Stamp(msg)
  On Error Resume Next
  Dim f
  Set f = fso.OpenTextFile("$launchLog", 8, True)
  f.WriteLine Now & "  " & msg
  f.Close
End Sub
"@
[System.IO.File]::WriteAllText($vbs, $vbsBody, [System.Text.UTF8Encoding]::new($false))
Ok "shim written: $vbs"

# ---- The scheduled task -----------------------------------------------------
$action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "//B //Nologo `"$vbs`""
# THREE triggers. AtLogOn + AtStartup arm the watcher at the two moments a machine comes up. The
# REPEATING trigger is the fix for the second 2026-08-18 defect pane A proved: RestartCount is a
# FINITE budget (3) that never resets, because a watcher only ever dies and never exits cleanly,
# so after three deaths RestartOnFailure is spent and the task stays dead until the next
# logon/boot - silently, wearing a green registration. A trigger that re-fires every few minutes
# re-arms it regardless of that budget. It is cheap and idempotent: if a watcher is already
# running, the new invocation refuses on the lock (and MultipleInstances IgnoreNew) and exits in
# milliseconds. Five minutes bounds the post-depletion silence while keeping the churn trivial;
# RestartOnFailure below still gives ~1-minute recovery for the first three deaths.
$repeat = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5)
$triggers = @(
  (New-ScheduledTaskTrigger -AtLogOn),
  (New-ScheduledTaskTrigger -AtStartup),
  $repeat
)
# ExecutionTimeLimit 0 = unlimited. A watcher with a time limit is a watcher that goes silent
# on a schedule, which is the failure this whole file exists to fix.
$taskSettings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable -MultipleInstances IgnoreNew `
    -ExecutionTimeLimit ([TimeSpan]::Zero) `
    -RestartInterval (New-TimeSpan -Minutes 1) -RestartCount 3
Register-ScheduledTask -TaskName $TaskName `
    -Action $action -Trigger $triggers -Settings $taskSettings `
    -Description "head-watch: pane B's falsifier for the board-replay diagnosis. Polls Main's transcript every 500ms and logs head-flip / shrink / gone / back to C:\Consonance\data\head-watch.jsonl. Detached because on 2026-08-18 it was a child of the chair's session and died in the same instant as the relaunch it was armed to observe." `
    -Force | Out-Null
Ok "registered: $TaskName (AtLogOn + AtStartup, no time limit, restart on failure)"

Write-Host ""
Write-Host "Ledger:     C:\Consonance\data\head-watch.jsonl"
Write-Host "LaunchLog:  $launchLog   (a 'launch' with no matching 'exit' means the watcher is still up)"
Write-Host "Verify:     powershell -ExecutionPolicy Bypass -File dev\headwatch\install_headwatch.ps1 -Check"
