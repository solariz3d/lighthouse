# install_vantage.ps1 — give second-vantage.js the clock its header always claimed it had.
#
#   powershell -ExecutionPolicy Bypass -File dev\vantage\install_vantage.ps1
#   powershell -ExecutionPolicy Bypass -File dev\vantage\install_vantage.ps1 -Uninstall
#
# WHY THIS FILE EXISTS, and it is a repair rather than a feature.
#
# second-vantage.js has said since it was written that "a duration goal wakes this on a clock
# (~/.claude/shell/duration/second-vantage/goal.json, cron '5 9 * * *' local)". Searched
# 2026-08-17: the ONLY file in the entire repo containing that path is second-vantage.js itself.
# No runner reads it, no installer creates it, no scheduled task fires it, and
# ~/.claude/shell/duration/ does not exist. The tool named its own firing mechanism in a comment
# and nothing on the other end was ever built.
#
# The handoff then repeated that as "the clock goal does not exist", which reads like a missing
# config file and is not — so the next step was nearly "ask the keeper to hand-write a goal.json"
# for a runner that isn't there. That would have looked exactly like progress.
#
# So this abandons the duration-goal abstraction, which has no implementation, and uses the one
# clock pattern this house has actually proven: a Windows scheduled task plus a wscript shim,
# copied deliberately from dev\dream\install_dream.ps1. Three of its lessons transfer verbatim and
# are NOT re-derived here — read that file for the full accounts:
#   * PRE-FLIGHT — never register a task around a runner that cannot load (2026-07-15: a dropped
#     BOM made the dream runner unparsable, it died before its first log line, and Task Scheduler
#     recorded success for eight hours).
#   * THE WSCRIPT SHIM — powershell.exe -WindowStyle Hidden still flashes a console and can steal
#     focus from a fullscreen game. wscript.exe is a GUI host and never creates one.
#   * WAIT FOR THE EXIT CODE — the shim used to fire-and-forget, so the scheduler recorded success
#     for a process it never watched.
#
# WHAT IS DELIBERATELY DIFFERENT FROM THE DREAM:
#   * NO WakeToRun. The dream wakes a sleeping machine on purpose. This must not: it spawns
#     `claude -p` readers that cost tokens, and a reader firing at 09:05 into a machine nobody is
#     at is the same spend with nobody to read the finding. It runs when the machine is already up.
#   * StartWhenAvailable IS kept, so a run missed while the machine was off happens at next wake
#     rather than vanishing silently.
#   * 30-minute ExecutionTimeLimit, not 15: this spawns fresh instances and waits on them.
#
# IT DOES NOT TOUCH THE DREAM AT ALL. Different task name, different launcher, different log, and
# no powercfg calls. Both machines' dream schedules are out of scope here, on purpose — and
# install_vantage.test.js asserts this file never names or reaches them, so the separation is
# checked rather than promised.

param(
    [string]$At = "09:05",
    [string]$LauncherDir = (Join-Path $env:LOCALAPPDATA "Consonance"),
    [switch]$Uninstall
)

$ErrorActionPreference = "Stop"
$TaskName = "Consonance Second Vantage"

if ($Uninstall) {
    try {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction Stop
        Write-Host "Unregistered '$TaskName'." -ForegroundColor Green
    } catch {
        Write-Host "No task named '$TaskName' to remove." -ForegroundColor Yellow
    }
    Write-Host "The dream task is untouched, by design."
    exit 0
}

# ── Locate the runner ───────────────────────────────────────────────────────
$repo   = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$runner = Join-Path $repo "consonance\tools\second-vantage.js"
if (-not (Test-Path $runner)) { throw "second-vantage.js not found at $runner" }

$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { throw "node not found on PATH; the task would register around a command that cannot run" }

# ── PRE-FLIGHT: refuse to register around a runner that will not load ───────
# The dream's 2026-07-15 lesson, applied to node. A syntax error here would give a task that fires
# daily, dies instantly, and reports whatever the shim reports — the exact silent-green shape.
& $node --check $runner 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "REFUSING TO INSTALL: second-vantage.js does not parse." -ForegroundColor Red
    & $node --check $runner
    throw "runner failed pre-flight; task not registered"
}
Write-Host "Runner pre-flight: parses clean." -ForegroundColor Green

# ── THE LEDGER CHECK, printed loudly because a clock over an empty ledger is silent failure ──
# second-vantage reads rows that sourced-stop writes at the end of each assistant turn. If that
# hook is not registered in settings.json, this task will fire every day, select nothing, and
# report success forever — a green that measures an empty set, which is the failure this repo has
# now found in four separate instruments. It is a WARNING and not a refusal because installing the
# clock before registering the hook is a legitimate order of operations; what is not legitimate is
# doing it without being told.
$settings = Join-Path $env:USERPROFILE ".claude\settings.json"
$hookRegistered = $false
if (Test-Path $settings) {
    $hookRegistered = (Select-String -Path $settings -Pattern "sourced-stop" -Quiet)
}
if (-not $hookRegistered) {
    Write-Host ""
    Write-Host "WARNING — sourced-stop is NOT registered in $settings" -ForegroundColor Yellow
    Write-Host "This task will fire daily, find no rows, and succeed at doing nothing." -ForegroundColor Yellow
    Write-Host "To feed it, add a Stop hook running:" -ForegroundColor Yellow
    Write-Host "  `"$node`" `"$env:USERPROFILE\.claude\shell\sourced-stop.js`"" -ForegroundColor Yellow
    Write-Host ""
}

# ── The launcher shim (see header; copied from the dream, same two jobs) ─────
if (-not (Test-Path $LauncherDir)) { New-Item -ItemType Directory -Path $LauncherDir -Force | Out-Null }
$vbs       = Join-Path $LauncherDir "vantage_launch.vbs"
$launchLog = Join-Path $LauncherDir "vantage_launch.log"

$vbsBody = @"
' vantage_launch.vbs - GENERATED by install_vantage.ps1. Do not hand-edit: re-run the installer
' instead, or your change dies at the next install and nobody knows.
' ASCII ONLY in this file. wscript refuses a UTF-8 BOM and misreads non-ASCII; an em-dash in this
' very comment failed install_vantage.test.js before this shim was ever written to disk.
Option Explicit
Dim shell, fso, rc, cmd
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

cmd = """$node"" ""$runner"" --run"

Stamp "launch"
' 0 = no window ever. True = WAIT, so the exit code below is the runner's own.
rc = shell.Run(cmd, 0, True)
Stamp "exit " & rc
WScript.Quit rc

Sub Stamp(msg)
  On Error Resume Next
  Dim f
  Set f = fso.OpenTextFile("$launchLog", 8, True)
  f.WriteLine Now & "  " & msg
  f.Close
End Sub
"@
# ASCII only and NO BOM: wscript treats a UTF-8 BOM as stray characters and refuses the file. The
# opposite rule from the .ps1 files, which is exactly why this is generated and not hand-kept.
[System.IO.File]::WriteAllText($vbs, $vbsBody, [System.Text.UTF8Encoding]::new($false))

# ── The scheduled task ──────────────────────────────────────────────────────
$action  = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "//B //Nologo `"$vbs`""
$trigger = New-ScheduledTaskTrigger -Daily -At $At
$taskSettings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 30) `
    -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName $TaskName `
    -Action $action -Trigger $trigger -Settings $taskSettings `
    -Description "second-vantage: takes claims from sourced-stop's ledger and spawns a FRESH claude -p per claim holding only the claim sentence and the repo root, to re-derive the value from the world. Findings: C:\Consonance\data\vantage_findings.jsonl" `
    -Force | Out-Null

# ── Show it took, and show what it would actually do today ──────────────────
Write-Host "Task:"
Get-ScheduledTask -TaskName $TaskName |
    Select-Object TaskName, State,
        @{n='Action';e={$_.Actions[0].Execute}},
        @{n='WakeToRun';e={$_.Settings.WakeToRun}},
        @{n='StartWhenAvailable';e={$_.Settings.StartWhenAvailable}} | Format-List

Write-Host "Fires daily at $At (machine must already be awake — WakeToRun is deliberately off)."
Write-Host "Launcher:   $vbs"
Write-Host "Launch log: $launchLog  (a 'launch' with no matching 'exit 0' means the runner died)"
Write-Host ""
Write-Host "What it would select RIGHT NOW (spawns nothing):"
& $node $runner --dry-run
