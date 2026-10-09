# LEAVING.ps1 - run this on the machine you are LEAVING, before you unplug the stick.
# One command. It puts every seat's new conversation bytes onto the stick.
#
#   powershell -ExecutionPolicy Bypass -File <stick>\LEAVING.ps1            # do it
#   powershell -ExecutionPolicy Bypass -File <stick>\LEAVING.ps1 -DryRun    # only show what it would do
#
# Works on either machine: it finds the lighthouse repo wherever it is on this machine, and the
# stick is wherever this file is. Consonance may be open or closed (export only reads). If you
# use Consonance again after running this, run it again before you leave - it takes seconds.
#
# Under the hood: node dev\tail-carry.js --stick <stick> --export --apply   (pane A, 2026-09-12)

param([switch]$DryRun)
$ErrorActionPreference = 'Stop'

$stick = $PSScriptRoot
# D273 lap 4 (pane B): the repo is the one ~/.consonance.json's room_path sits in (<repo>\exo_memory\BOOT.md), found the way the app finds it.
# It used to be a list of this room's two checkout paths, which meant nothing on anyone else's machine.
$repo = $null
try { $rp = (Get-Content (Join-Path $env:USERPROFILE '.consonance.json') -Raw | ConvertFrom-Json).room_path; if ($rp) { $repo = Split-Path -Parent (Split-Path -Parent $rp) } } catch { $repo = $null }
if ($repo -and -not (Test-Path (Join-Path $repo 'dev\tail-carry.js'))) { $repo = $null }
if (-not $repo) { Write-Host "[leaving] no repo with dev\tail-carry.js found through room_path in ~/.consonance.json - set it in Settings, or git pull first"; exit 2 }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host "[leaving] node is not installed on this machine"; exit 2 }

Write-Host "[leaving] repo  $repo"
Write-Host "[leaving] stick $stick"
$args = @('dev\tail-carry.js', '--stick', $stick, '--export')
if (-not $DryRun) { $args += '--apply' }

Push-Location $repo
try { & node @args; $code = $LASTEXITCODE } finally { Pop-Location }

if ($code -ne 0) { Write-Host "[leaving] the carry tool refused (exit $code). Read the lines above; nothing is half-written."; exit $code }
if ($DryRun) { Write-Host "[leaving] dry run only - nothing written. Run without -DryRun to do it." }
else { Write-Host "[leaving] done. Unplug the stick. On the other machine run ARRIVING.ps1 from the stick." }
exit 0
