# acceptance-p1.ps1 - C's D058 acceptance test, as ONE command for the keeper.
#
# WHAT IT PROVES. main.rs (175339c) makes `resume_pane` CREATE a committee pane's cwd when panes.json
# names a directory that is absent (and REFUSE anything that is not a direct child of the instances
# root). Nothing in a normal launch exercises that arm - every pane's directory exists - so the only
# way to see it work is to hide one directory for one launch. That is this script's whole job.
#
# WHAT YOU DO: run it from a normal PowerShell window (NOT inside Consonance), then follow the two
# prompts: close Consonance when asked, and close it once more at the end. Everything else is here.
#
# WHAT IT TOUCHES: one pane's WORKING DIRECTORY (renamed aside, then moved back). It never opens,
# moves, or deletes a transcript under ~/.claude/projects. The directory it creates during the test
# is removed afterwards ONLY if it is empty; otherwise it is left and named.
#
#   powershell -ExecutionPolicy Bypass -File C:\Users\nname\Desktop\lighthouse\dev\acceptance-p1.ps1
#   ... -DryRun    prints what it would do and exits, touching nothing.
#
# Hand-back this scores: exo_memory/handback/p1-where-a-seat-lives_2026-09-11.md, section 6.

param(
  [string]$Pane = 'a2122153-a37e-41a6-a86f-534267ec0565',   # E, a brief pane with no live conversation in its own slug
  [int]$TimeoutSec = 180,
  [switch]$DryRun
)
$ErrorActionPreference = 'Stop'

$dataDir  = 'C:\Consonance\data'
$panes    = Join-Path $dataDir 'panes.json'
$plog     = Join-Path $dataDir 'persist.log'
$exe      = 'C:\Users\nname\Desktop\lighthouse\consonance\src-tauri\target\release\consonance.exe'
$homeSlug = Join-Path $env:USERPROFILE '.claude\projects\C--Users-nname'

function Say([string]$s) { Write-Host ("[p1] " + $s) }
function AppRunning { [bool](Get-Process -Name consonance -ErrorAction SilentlyContinue) }
function WaitForExit([string]$why) {
  if (-not (AppRunning)) { return }
  Say "$why  ->  CLOSE CONSONANCE NOW (this script waits)."
  while (AppRunning) { Start-Sleep -Seconds 2 }
  Start-Sleep -Seconds 2
  Say "closed."
}

# 0. the pane and its cwd, read from the roster - never typed
$row = (Get-Content $panes -Raw | ConvertFrom-Json) | Where-Object { $_.pane -eq $Pane }
if (-not $row) { Say "REFUSED: pane $Pane is not in $panes"; exit 2 }
$cwd   = $row.cwd
$aside = "$cwd.aside"
if (-not (Test-Path $exe))   { Say "REFUSED: no release exe at $exe (rebuild first)"; exit 2 }
if (-not (Test-Path $cwd))   { Say "REFUSED: $cwd does not exist - nothing to hide"; exit 2 }
if (Test-Path $aside)        { Say "REFUSED: $aside already exists - a previous run did not restore; look before running again"; exit 2 }
$short = $Pane.Substring(0, 8)
$homeBefore = @(Get-ChildItem -Path $homeSlug -Filter "$Pane*.jsonl" -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName + '|' + $_.LastWriteTimeUtc.Ticks })

Say "pane $short  cwd $cwd"
Say "plan: wait for close -> rename to $aside -> launch -> watch persist.log for 'resume pane=$Pane CREATED' -> wait for close -> restore"
if ($DryRun) { Say "dry run: nothing touched."; exit 0 }

# 1. hide the directory with the app closed
WaitForExit "step 1 of 3"
$logLines = (Get-Content $plog -ErrorAction SilentlyContinue | Measure-Object -Line).Lines
Rename-Item -Path $cwd -NewName (Split-Path -Leaf $aside)
Say "renamed aside. launching..."

# 2. launch and watch
Start-Process -FilePath $exe -WorkingDirectory (Split-Path -Parent $exe) | Out-Null
$deadline = (Get-Date).AddSeconds($TimeoutSec)
$created = $null; $refused = $null
while ((Get-Date) -lt $deadline) {
  Start-Sleep -Seconds 3
  $new = @(Get-Content $plog -ErrorAction SilentlyContinue | Select-Object -Skip $logLines)
  $created = $new | Where-Object { $_ -match "resume pane=$Pane CREATED" } | Select-Object -First 1
  $refused = $new | Where-Object { $_ -match "resume pane=$Pane REFUSED" } | Select-Object -First 1
  if ($created -or $refused) { break }
}
$dirBack = Test-Path $cwd
$homeAfter = @(Get-ChildItem -Path $homeSlug -Filter "$Pane*.jsonl" -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName + '|' + $_.LastWriteTimeUtc.Ticks })
$homeTouched = (Compare-Object $homeBefore $homeAfter | Measure-Object).Count -gt 0

Say "----- RESULT -----"
if ($created) { Say "CREATED row:  $created" } else { Say "CREATED row:  NONE within $TimeoutSec s" }
if ($refused) { Say "REFUSED row:  $refused" }
Say ("directory recreated by the app: " + $(if ($dirBack) { 'yes' } else { 'NO' }))
Say ("home-slug transcript for this pane touched: " + $(if ($homeTouched) { 'YES (bad)' } else { 'no (good)' }))
$pass = $created -and $dirBack -and (-not $homeTouched)
Say ("VERDICT: " + $(if ($pass) { 'PASS' } else { 'FAIL' }) + "  (also look at the pane's banner in the app: it should show $cwd, not $env:USERPROFILE)")
Say "------------------"

# 3. restore with the app closed
WaitForExit "step 3 of 3 - have a look at the pane first, then"
if (Test-Path $cwd) {
  if (@(Get-ChildItem -Path $cwd -Force -ErrorAction SilentlyContinue).Count -eq 0) { Remove-Item -Path $cwd -Force; Say "removed the empty directory the app created." }
  else { Rename-Item -Path $cwd -NewName ((Split-Path -Leaf $cwd) + ".created-by-test"); Say "the created directory was NOT empty; kept as $cwd.created-by-test" }
}
Rename-Item -Path $aside -NewName (Split-Path -Leaf $cwd)
Say "original directory restored. Launch Consonance as usual."
if ($pass) { exit 0 } else { exit 1 }
