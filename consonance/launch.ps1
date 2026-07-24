# launch.ps1 - the Desktop shortcut runs this, so a click ALWAYS gets the current source.
#   - If the build is already up to date (nothing changed): opens INSTANTLY, no build screen.
#   - If you changed code: compiles the latest first - clearly, so the window never looks
#     "stuck" - then launches on its own the moment it finishes.
#   - Always ends up opening the app, and never locks you out: a failed relink (usually because
#     Consonance is already open and Windows locks the exe) falls back to the last good build.

$ErrorActionPreference = 'SilentlyContinue'
$root     = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifest = Join-Path $root 'src-tauri\Cargo.toml'
$exe      = Join-Path $root 'src-tauri\target\release\consonance.exe'
$cargo    = Join-Path $env:USERPROFILE '.cargo\bin\cargo.exe'

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
if (Test-Path $cargo) {
  $host.UI.RawUI.WindowTitle = 'Consonance - compiling latest'
  Write-Host ''
  Write-Host '  Your code changed - compiling the latest Consonance build.' -ForegroundColor Cyan
  Write-Host '  This can take 30s-2min. Leave this window open; it launches automatically' -ForegroundColor DarkGray
  Write-Host '  the moment the build finishes.' -ForegroundColor DarkGray
  Write-Host ''
  & $cargo build --release --manifest-path $manifest
  if ($LASTEXITCODE -ne 0) {
    Write-Host ''
    Write-Host '  Build failed - opening the last good build instead.' -ForegroundColor Yellow
    Write-Host '  (If Consonance is already open, that is the cause: a running exe cannot be relinked.)' -ForegroundColor DarkGray
    Start-Sleep -Seconds 3
  } else {
    Write-Host '  Build ready - launching.' -ForegroundColor Green
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
