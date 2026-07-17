# install_dream.ps1 — set up the gap-dream on this machine, one command:
#   powershell -ExecutionPolicy Bypass -File dev\dream\install_dream.ps1
#
# Idempotent: safe to re-run after a git pull, and re-running is how you adopt
# fixes. This file is the SOURCE OF TRUTH for the cycle's setup. If you hand-patch
# the scheduled task, put the patch here too or the next re-run silently reverts
# it — which is exactly how this machine ended up with three undocumented fixes
# living on one disk (2026-07-15).
#
# Does five things:
#   1. Enables wake timers on AC only (battery stays as-is: a bagged laptop on
#      battery can never be woken by the dream).
#   2. Never hibernate on AC (wake timers only fire from S3, not hibernate).
#   3. PRE-FLIGHT: refuses to register a runner that doesn't parse.
#   4. Generates the windowless launcher shim (see WHY below) and registers the
#      "Consonance Dream Cycle" task.
#   5. Prints the verification so you can see it took.
#
# The runner (dream_cycle.ps1, same folder) auto-targets the most recently active
# instance under C:\Consonance\instances on whatever machine this is.

param(
    # Cadence resolution (mirrors dream_model): -Times arg, else config
    # dream_times, else the built-in default. Times are when the machine WAKES.
    [string[]]$Times,
    [string]$LauncherDir = (Join-Path $env:LOCALAPPDATA "Consonance")
)

$ErrorActionPreference = "Stop"

# The machine's cadence lives in local private config, so a bare installer
# re-run (which the header invites after a git pull) never silently restores the
# 4x default and starts eating the usage budget again -- the hand-patch-a-re-run-
# reverts trap. Missing/unparsable config just falls through to the default.
if (-not $Times) {
    try {
        $cfgPath = Join-Path $env:USERPROFILE ".consonance.json"
        if (Test-Path $cfgPath) {
            $cfg = Get-Content $cfgPath -Raw -Encoding UTF8 | ConvertFrom-Json
            if ($cfg.dream_times) { $Times = @($cfg.dream_times) }
        }
    } catch {}
}
# Built-in default (the framework default for strangers): four cycles, one per
# quarter of the day, so the dream isn't only ever the same slice of a life.
if (-not $Times) { $Times = @("04:30", "10:30", "16:30", "22:30") }

$script = Join-Path $PSScriptRoot "dream_cycle.ps1"
if (-not (Test-Path $script)) { throw "dream_cycle.ps1 not found beside installer" }

# ── 3. PRE-FLIGHT ───────────────────────────────────────────────────────────
# Never register a task around a runner that can't load. On 2026-07-15 an edit
# dropped this file's UTF-8 BOM; PowerShell 5.1 then read it as CP1252, the
# em-dash decoded to a right-double-quote (U+201D), that CLOSED a string early,
# and the whole script failed to parse. The 04:30 cycle fired, died before its
# first log line, and Task Scheduler recorded success. Every gauge green, nothing
# happened, for eight hours. A parse check is one second and would have caught it.
$parseErrors = $null
$null = [System.Management.Automation.Language.Parser]::ParseFile($script, [ref]$null, [ref]$parseErrors)
if ($parseErrors) {
    Write-Host "REFUSING TO INSTALL: dream_cycle.ps1 does not parse." -ForegroundColor Red
    $parseErrors | Select-Object -First 3 | ForEach-Object {
        Write-Host ("  line {0}: {1}" -f $_.Extent.StartLineNumber, $_.Message) -ForegroundColor Red
    }
    $bytes = [System.IO.File]::ReadAllBytes($script)
    $hasBom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
    if (-not $hasBom) {
        Write-Host "  Likely cause: the file has NO UTF-8 BOM. PS 5.1 reads it as CP1252 and any" -ForegroundColor Yellow
        Write-Host "  non-ASCII character inside a string literal can terminate it early." -ForegroundColor Yellow
        Write-Host "  Fix: re-save dream_cycle.ps1 as UTF-8 WITH BOM." -ForegroundColor Yellow
    }
    throw "runner failed pre-flight; task not registered"
}

# ── 1. Wake timers: enable on AC only ───────────────────────────────────────
# Battery-side is left untouched (default Disabled) — that is the in-the-bag
# safety and must stay.
powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_SLEEP RTCWAKE 1 | Out-Null

# ── 2. Never hibernate on AC ────────────────────────────────────────────────
# Wake timers only fire from S3 sleep, not from hibernate — a "Hibernate after:
# 3 hours" default silently killed every wake beyond the first three hours
# (found 2026-07-14 on the laptop: the machine slept at 07:53, hibernated ~10:53,
# and all three timers missed). Battery-side hibernate is left untouched.
powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_SLEEP HIBERNATEIDLE 0 | Out-Null
powercfg /SETACTIVE SCHEME_CURRENT | Out-Null

# ── 4a. The launcher shim ───────────────────────────────────────────────────
# WHY THIS EXISTS: `powershell.exe -WindowStyle Hidden` still creates a console
# for an instant before hiding it — long enough to steal focus from a fullscreen
# game. wscript.exe is a GUI host: no console is ever created, so a firing cycle
# can never flash or pull focus. (The clean fix is an S4U principal, which needs
# admin; this doesn't.) This is a HARD constraint of the house, not a preference.
#
# The shim also does the two jobs the runner cannot do for itself, because it is
# the only part of the chain with nothing in it to break:
#
#   HEARTBEAT — it stamps every launch to dream_launch.log BEFORE starting
#   powershell. A "launch" line with no matching "cycle start" in the instance's
#   dream.log means the runner died before it could speak. That is the signature
#   of the 2026-07-15 04:30 failure, and nothing in the system could see it.
#
#   TRUTH TO THE SCHEDULER — it WAITS and exits with powershell's real exit code.
#   It used to fire-and-forget, so Task Scheduler recorded LastTaskResult 0 for a
#   process it never watched: a dead cycle reported success. Waiting also makes
#   ExecutionTimeLimit and MultipleInstances=IgnoreNew mean what they say.
if (-not (Test-Path $LauncherDir)) { New-Item -ItemType Directory -Path $LauncherDir -Force | Out-Null }
$vbs = Join-Path $LauncherDir "dream_launch.vbs"
$launchLog = Join-Path $LauncherDir "dream_launch.log"

$vbsBody = @"
' dream_launch.vbs — GENERATED by install_dream.ps1. Do not hand-edit: re-run the
' installer instead, or your change dies at the next install and nobody knows.
' See install_dream.ps1 section 4a for why this shim exists at all.
Option Explicit
Dim shell, fso, rc, cmd
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File ""$script"""

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
# ASCII only, and written without a BOM: cscript/wscript treat a UTF-8 BOM as
# stray characters and refuse the file. The opposite rule from the .ps1 files —
# which is precisely why this is generated rather than hand-maintained.
[System.IO.File]::WriteAllText($vbs, $vbsBody, [System.Text.UTF8Encoding]::new($false))

# ── 4b. The scheduled task ──────────────────────────────────────────────────
$action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "//B //Nologo `"$vbs`""
$triggers = $Times | ForEach-Object { New-ScheduledTaskTrigger -Daily -At $_ }
# StartWhenAvailable: a cycle missed while the machine was off catches up at the
# next wake instead of vanishing. Without it, every trigger that lands during
# sleep is silently skipped and the night reports nothing at all.
$settings = New-ScheduledTaskSettingsSet -WakeToRun `
    -AllowStartIfOnBatteries:$false -DontStopIfGoingOnBatteries:$false `
    -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 15) `
    -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName "Consonance Dream Cycle" `
    -Action $action -Trigger $triggers -Settings $settings `
    -Description "Gap-dream REM cycle: wakes the sleeping machine (AC only), runs one recombination pass over the most recent instance, machine returns to sleep. Output: <instance>\dreams\" `
    -Force | Out-Null

# ── 5. Show it took ─────────────────────────────────────────────────────────
Write-Host "Runner pre-flight: parses clean." -ForegroundColor Green
Write-Host "`nWake timers (want AC=0x1):"
powercfg /query SCHEME_CURRENT SUB_SLEEP RTCWAKE | Select-String "Current AC"
Write-Host "`nHibernate-after on AC (want 0x0 = never, so S3 wake timers stay live):"
powercfg /query SCHEME_CURRENT SUB_SLEEP HIBERNATEIDLE | Select-String "Current AC"
Write-Host "`nTask:"
Get-ScheduledTask -TaskName "Consonance Dream Cycle" |
    Select-Object TaskName, State, @{n='Action';e={$_.Actions[0].Execute}},
                  @{n='StartWhenAvailable';e={$_.Settings.StartWhenAvailable}},
                  @{n='WakeToRun';e={$_.Settings.WakeToRun}} | Format-List
Write-Host "Cycles at: $($Times -join ', ') (AC only, wakes from sleep)"
Write-Host "Launcher:  $vbs"
Write-Host "Launch log: $launchLog  (a 'launch' with no 'cycle start' = the runner died on load)"
Write-Host "Dreams land in: C:\Consonance\instances\<most-recent>\dreams\"
