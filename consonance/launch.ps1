# launch.ps1 - the Desktop shortcut runs this, so a click ALWAYS gets the current source.
#   - If the build is already up to date (nothing changed): opens INSTANTLY, no build screen.
#   - If you changed code: compiles the latest first - clearly, so the window never looks
#     "stuck" - then launches on its own the moment it finishes.
#   - Always ends up opening the app, and never locks you out: a failed relink (usually because
#     Consonance is already open and Windows locks the exe) falls back to the last good build.

$ErrorActionPreference = 'SilentlyContinue'
$root     = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifest = Join-Path $root 'src-tauri\Cargo.toml'
$cargo    = Join-Path $env:USERPROFILE '.cargo\bin\cargo.exe'

# WHERE THE EXE ACTUALLY IS — ASKED, NOT ASSUMED.
# This line used to be `Join-Path $root 'src-tauri\target\release\consonance.exe'`. On
# 2026-07-28 CARGO_TARGET_DIR was set to C:\build\lighthouse-target to get 19.5 GB of build
# output out of OneDrive's sync scope, and this script broke SILENTLY AND IMMEDIATELY: cargo
# emitted to the new location, $exe still pointed at the old one, the stale exe was still on
# disk so Test-Path stayed true, and every click rebuilt successfully, printed "Build ready -
# launching" in green, and then started a BINARY THAT WAS NEVER UPDATED AGAIN. That is the
# same class this file's own header documents (twelve days behind source, every click looking
# like it worked) reintroduced by the person who read that header the same night.
# `cargo metadata` is the only source of truth for target_directory, because it honours
# CARGO_TARGET_DIR, .cargo/config.toml, and whatever the next person changes. Reconstructing
# the path from $root is what made this rot in the first place. (Bravo, repo-move procedure arm.)
$targetDir = $null
if (Test-Path $cargo) {
  $meta = & $cargo metadata --format-version 1 --no-deps --manifest-path $manifest 2>$null | ConvertFrom-Json
  if ($meta -and $meta.target_directory) { $targetDir = $meta.target_directory }
}
if (-not $targetDir) { $targetDir = Join-Path $root 'src-tauri\target' }   # last resort only
$exe = Join-Path $targetDir 'release\consonance.exe'

# --- Is the built exe already newer than every source file? -----------------------------------
$sources = @(
  (Join-Path $root 'src-tauri\src'),
  (Join-Path $root 'ui'),
  (Join-Path $root 'src-tauri\Cargo.toml'),
  (Join-Path $root 'src-tauri\Cargo.lock'),
  (Join-Path $root 'src-tauri\tauri.conf.json')
)
$newestSrc = [datetime]::MinValue
foreach ($s in $sources) {
  Get-ChildItem -Path $s -Recurse -File -Force -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.LastWriteTime -gt $newestSrc) { $newestSrc = $_.LastWriteTime }
  }
}
$exeExists = Test-Path $exe
$exeTime   = if ($exeExists) { (Get-Item $exe).LastWriteTime } else { [datetime]::MinValue }

if ($exeExists -and $exeTime -ge $newestSrc) {
  # Up to date - open immediately, no compile, no build screen.
  Start-Process $exe
  exit 0
}

# --- Source changed (or first run) - compile the latest, clearly, then launch. ----------------
# A running Consonance holds a lock on its own exe, so the relink CANNOT succeed and the
# fallback below would quietly open a SECOND copy of the stale build - which is exactly how
# the exe sat twelve days behind its source while every click looked like it worked. Say it
# out loud instead of falling back silently.
$running = Get-Process -Name 'consonance' -ErrorAction SilentlyContinue
if ($running) {
  $host.UI.RawUI.WindowTitle = 'Consonance - already running'
  Write-Host ''
  Write-Host '  Your code changed, but Consonance is already open.' -ForegroundColor Yellow
  Write-Host '  Windows locks a running exe, so the new build cannot be written while it is up.' -ForegroundColor DarkGray
  Write-Host '  Close Consonance, then click this shortcut again to get the latest.' -ForegroundColor DarkGray
  Write-Host ''
  Write-Host '  (Opening the existing build now - it is the OLD one.)' -ForegroundColor DarkGray
  Start-Sleep -Seconds 6
  Start-Process $exe
  exit 0
}

if (Test-Path $cargo) {
  $host.UI.RawUI.WindowTitle = 'Consonance - compiling latest'
  Write-Host ''
  Write-Host '  Your code changed - compiling the latest Consonance build.' -ForegroundColor Cyan
  Write-Host '  This can take 30s-2min. Leave this window open; it launches automatically' -ForegroundColor DarkGray
  Write-Host '  the moment the build finishes.' -ForegroundColor DarkGray
  Write-Host ''
  $buildStart = Get-Date
  & $cargo build --release --manifest-path $manifest
  if ($LASTEXITCODE -ne 0) {
    Write-Host ''
    Write-Host '  Build failed - opening the last good build instead.' -ForegroundColor Yellow
    Write-Host '  (If Consonance is already open, that is the cause: a running exe cannot be relinked.)' -ForegroundColor DarkGray
    Start-Sleep -Seconds 3
  } else {
    # A SUCCESSFUL BUILD IS NOT EVIDENCE THE EXE WE ARE ABOUT TO LAUNCH IS THE ONE IT WROTE.
    # That was exactly the failure above: cargo succeeded, and the file at $exe was untouched.
    # Refuse to print the green line unless the binary is genuinely newer than the build we
    # just ran. Delivery is not receipt, applied to a build. (Bravo, repo-move procedure arm.)
    $fresh = (Test-Path $exe) -and ((Get-Item $exe).LastWriteTime -ge $buildStart.AddSeconds(-2))
    if ($fresh) {
      Write-Host '  Build ready - launching.' -ForegroundColor Green
    } else {
      Write-Host ''
      Write-Host '  BUILD SUCCEEDED BUT THE EXE DID NOT CHANGE - refusing to launch a stale binary.' -ForegroundColor Red
      Write-Host "  cargo says its target directory is: $targetDir" -ForegroundColor DarkGray
      Write-Host "  expected the binary at:             $exe" -ForegroundColor DarkGray
      Write-Host '  That means cargo wrote somewhere else, or the exe is locked by a running copy.' -ForegroundColor DarkGray
      Write-Host '  Close Consonance and click again; if it repeats, the target path is wrong.' -ForegroundColor DarkGray
      Write-Host ''
      Start-Sleep -Seconds 10
      exit 1
    }
  }
} else {
  Write-Host "cargo not found at $cargo - opening the existing build." -ForegroundColor Yellow
  Start-Sleep -Seconds 2
}

if (Test-Path $exe) {
  Start-Process $exe
} else {
  $host.UI.RawUI.WindowTitle = 'Consonance - no build'
  Write-Host "No consonance.exe at $exe and the build did not produce one - nothing to start." -ForegroundColor Red
  Start-Sleep -Seconds 8
}
