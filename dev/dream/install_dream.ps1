# install_dream.ps1 — set up the gap-dream on this machine, one command:
#   powershell -ExecutionPolicy Bypass -File dev\dream\install_dream.ps1
#
# Does three things, all idempotent (safe to re-run after a git pull):
#   1. Enables wake timers on AC power only (battery stays as-is: a bagged
#      laptop on battery can never be woken by the dream).
#   2. Registers the "Consonance Dream Cycle" scheduled task: three cycles a
#      day, wakes the sleeping machine, forbidden to start on battery.
#   3. Prints the verification so you can see it took.
#
# The runner (dream_cycle.ps1, same folder) auto-targets the most recently
# active instance under C:\Consonance\instances on whatever machine this is.

param(
    [string[]]$Times = @("10:30", "13:30", "16:30")
)

$ErrorActionPreference = "Stop"

$script = Join-Path $PSScriptRoot "dream_cycle.ps1"
if (-not (Test-Path $script)) { throw "dream_cycle.ps1 not found beside installer" }

# 1. Wake timers: enable on AC only. Battery-side is left untouched (default
#    Disabled) — that is the in-the-bag safety and must stay.
powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_SLEEP RTCWAKE 1 | Out-Null
powercfg /SETACTIVE SCHEME_CURRENT | Out-Null

# 2. The scheduled task.
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$script`""
$triggers = $Times | ForEach-Object { New-ScheduledTaskTrigger -Daily -At $_ }
$settings = New-ScheduledTaskSettingsSet -WakeToRun `
    -AllowStartIfOnBatteries:$false -DontStopIfGoingOnBatteries:$false `
    -StartWhenAvailable:$false -ExecutionTimeLimit (New-TimeSpan -Minutes 15)
Register-ScheduledTask -TaskName "Consonance Dream Cycle" `
    -Action $action -Trigger $triggers -Settings $settings `
    -Description "Gap-dream REM cycle: wakes the sleeping machine (AC only), runs one recombination pass over the most recent instance, machine returns to sleep. Output: <instance>\dreams\" `
    -Force | Out-Null

# 3. Show it took.
Write-Host "Wake timers (want AC=0x1):"
powercfg /query SCHEME_CURRENT SUB_SLEEP RTCWAKE | Select-String "Current"
Write-Host "`nTask:"
Get-ScheduledTask -TaskName "Consonance Dream Cycle" | Format-Table TaskName, State
Write-Host "Cycles at: $($Times -join ', ') (AC only, wakes from sleep)"
Write-Host "Dreams land in: C:\Consonance\instances\<most-recent>\dreams\"
