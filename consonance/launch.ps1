# launch.ps1 - the Desktop shortcut runs this. It opens Consonance INSTANTLY off the built exe.
#
# It does NOT compile on click. That was the "doesn't auto open": Consonance lives in a synced
# repo, so a sync tool bumping a source file's mtime (with no real code change) made the old
# launcher recompile - up to ~24s of "building" screen - before the window would ever show.
#
# The exe is kept current by building after code changes (like BLACKBOX's launcher). If the exe
# is missing entirely (first run), it builds once and then launches.

$ErrorActionPreference = 'SilentlyContinue'
$root     = Split-Path -Parent $MyInvocation.MyCommand.Path
$exe      = Join-Path $root 'src-tauri\target\release\consonance.exe'
$cargo    = Join-Path $env:USERPROFILE '.cargo\bin\cargo.exe'
$manifest = Join-Path $root 'src-tauri\Cargo.toml'

if (Test-Path $exe) {
  # Normal path: open immediately. No build, no wait, no "building" screen.
  Start-Process $exe
  exit 0
}

# No exe yet (first run only) - build once, clearly, then launch.
if (Test-Path $cargo) {
  $host.UI.RawUI.WindowTitle = 'Consonance - first build'
  Write-Host ''
  Write-Host '  No build yet - compiling Consonance once (can take a couple of minutes).' -ForegroundColor Cyan
  Write-Host '  Leave this window open; it launches automatically the moment it finishes.' -ForegroundColor DarkGray
  Write-Host ''
  & $cargo build --release --manifest-path $manifest
}

if (Test-Path $exe) {
  Start-Process $exe
} else {
  $host.UI.RawUI.WindowTitle = 'Consonance - no build'
  Write-Host "No consonance.exe and it could not be built - nothing to start." -ForegroundColor Red
  Start-Sleep -Seconds 8
}
