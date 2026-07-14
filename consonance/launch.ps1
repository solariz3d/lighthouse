# launch.ps1 — the Desktop shortcut runs this, so a click always gets the current source.
# Builds first (a no-op in ~1s when nothing changed), then launches. If the build fails —
# most often because Consonance is already running and Windows locks the exe against the
# linker — it says so out loud and launches the last good build rather than locking you out.

$root     = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifest = Join-Path $root 'src-tauri\Cargo.toml'
$exe      = Join-Path $root 'src-tauri\target\release\consonance.exe'
$cargo    = Join-Path $env:USERPROFILE '.cargo\bin\cargo.exe'

$host.UI.RawUI.WindowTitle = 'Consonance — building'

if (Test-Path $cargo) {
    Write-Host 'Consonance: building current source...' -ForegroundColor Cyan
    # Plain cargo, not `cargo tauri build`: the tauri CLI rejects --manifest-path
    # (exit 2 before compiling anything), and with a static frontendDist the
    # tauri-build script embeds ../ui during a normal cargo build anyway.
    & $cargo build --release --manifest-path $manifest
    if ($LASTEXITCODE -ne 0) {
        Write-Host ''
        Write-Host 'BUILD FAILED — starting the last good build instead.' -ForegroundColor Yellow
        Write-Host '(If Consonance is already open, that is why: a running exe cannot be relinked.)' -ForegroundColor DarkGray
        Start-Sleep -Seconds 4
    } else {
        Write-Host 'build ok — starting.' -ForegroundColor Green
    }
} else {
    Write-Host "cargo not found at $cargo — starting the existing build." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

if (Test-Path $exe) {
    Start-Process $exe
} else {
    Write-Host "No consonance.exe at $exe — nothing to start." -ForegroundColor Red
    Start-Sleep -Seconds 10
}
