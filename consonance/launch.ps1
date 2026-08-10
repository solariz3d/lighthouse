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

# --- EVERY WARNING IN THIS FILE WAS UNREADABLE UNTIL 2026-08-10 --------------------------------
# launch.vbs runs this script with -WindowStyle Hidden AND WScript.Shell.Run(..., 0, False), so
# there is no console attached to look at. Every Write-Host below - including the one that says
# "you are about to get the OLD build", whose own comment reads "Say it out loud instead of
# falling back silently" - was written to a window nobody can see. The guard was correct, ran,
# and produced no observable signal at the moment it mattered.
#
# What that cost, measured: on 2026-08-09 the keeper clicked the shortcut, saw nothing happen
# because the build is also silent, and clicked repeatedly. Each click started another launcher.
# One of the resulting processes wrote a fresh .chair-token and died, leaving the token on disk
# disagreeing with the token held by the live MCP server, and all five chair verbs refused for
# an hour with no error anywhere pointing at the cause.
#
# Notify writes to the console AND raises a dialog for anything the user must actually see.
# WScript.Shell.Popup because launch.vbs already uses exactly that for its own missing-file
# case - existing pattern, no new dependency, works with no console attached.
#
# DPI: the dialog is drawn IN THIS PROCESS, and powershell.exe declares no DPI awareness, so on a
# scaled display Windows renders it at 96 DPI and bitmap-stretches the result. It is not low
# resolution - it is a small dialog blown up, which is why the text looks soft. Declaring
# per-monitor awareness (V2, -4) before the first window exists makes Windows hand us real pixels.
# Done LAZILY on the first Notify rather than at script start: the common path is "already up to
# date, open instantly", and Add-Type invokes the C# compiler, which is not a cost worth paying
# on a launch that shows no dialog at all.
$script:dpiReady = $false
function Use-RealPixels {
  if ($script:dpiReady) { return }
  $script:dpiReady = $true
  try {
    Add-Type -Namespace Consonance -Name Dpi -MemberDefinition @'
[DllImport("user32.dll")] public static extern bool SetProcessDpiAwarenessContext(int c);
[DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
'@ -ErrorAction Stop
    # -4 = PER_MONITOR_AWARE_V2 (Win10 1703+). Falls back to the process-wide system-DPI call on
    # anything older, which is still sharp on a single-monitor setup.
    if (-not [Consonance.Dpi]::SetProcessDpiAwarenessContext(-4)) { [Consonance.Dpi]::SetProcessDPIAware() | Out-Null }
  } catch { }
}

function Notify($message, $title, $seconds, $colour) {
  Write-Host $message -ForegroundColor $colour
  Use-RealPixels
  try { (New-Object -ComObject WScript.Shell).Popup($message, $seconds, "Consonance - $title", 48) | Out-Null } catch { }
}

# --- ONE LAUNCHER AT A TIME -------------------------------------------------------------------
# The second half of the same incident: nothing stopped several copies of this script running
# concurrently, each racing to build and start the app. A named mutex makes a second click a
# visible no-op instead of a silent competitor. Held for the life of the script and released in
# the finally block at the bottom.
$launchMutex = New-Object System.Threading.Mutex($false, 'Global\ConsonanceLauncher')
$gotMutex = $false
try {
  $gotMutex = $launchMutex.WaitOne(0)
} catch [System.Threading.AbandonedMutexException] {
  # A previous launcher exited while holding it - one of this script's several `exit` paths does
  # exactly that. Windows hands ownership to the next waiter and signals it by throwing. Ownership
  # IS acquired here; treating this as failure would lock every subsequent click out permanently.
  $gotMutex = $true
}
if (-not $gotMutex) {
  Notify "Consonance is already starting - this can take a minute or two while it compiles, and the compile is silent.`n`nThe click DID register. Please wait rather than clicking again: extra clicks are what corrupted the chair token on 2026-08-09." 'already starting' 8 'Yellow'
  exit 0
}

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
  # CHANGED 2026-08-10: this branch used to Start-Process $exe anyway, deliberately opening a
  # SECOND copy of the stale build. That is the whole 2026-07-28 failure in one line - two
  # Consonance processes means two MCP servers, the second writes the port config and the chair
  # token and then dies, and the chair verbs address a server that is gone. The old behaviour
  # was chosen so a click never leaves you with nothing; the existing window IS something, so
  # bring it forward instead of duplicating it.
  $host.UI.RawUI.WindowTitle = 'Consonance - already running'
  try { (New-Object -ComObject WScript.Shell).AppActivate($running[0].Id) | Out-Null } catch { }
  Notify "Your code changed, but Consonance is already open, and Windows locks a running exe so the new build cannot be written while it is up.`n`nThe window you have is running the OLD build. Close it completely, then click the shortcut once to get the latest.`n`nNOT opening a second copy: two instances means two MCP servers, which is what broke the chair verbs on 2026-07-28." 'already running - still on the old build' 12 'Yellow'
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
    Notify "The build FAILED. Opening the last good build instead, so what you get is older than your source.`n`n(If Consonance was already open, that is the cause: a running exe cannot be relinked.)" 'build failed' 10 'Yellow'
  } else {
    # A SUCCESSFUL BUILD IS NOT EVIDENCE THE EXE WE ARE ABOUT TO LAUNCH IS THE ONE IT WROTE.
    # That was exactly the failure above: cargo succeeded, and the file at $exe was untouched.
    # Refuse to print the green line unless the binary is genuinely newer than the build we
    # just ran. Delivery is not receipt, applied to a build. (Bravo, repo-move procedure arm.)
    $fresh = (Test-Path $exe) -and ((Get-Item $exe).LastWriteTime -ge $buildStart.AddSeconds(-2))
    if ($fresh) {
      Write-Host '  Build ready - launching.' -ForegroundColor Green
    } else {
      # This is the one that MOST needed a dialog: it is the only path that exits without
      # starting anything at all, so with a hidden console the click looked like it did nothing.
      Notify "BUILD SUCCEEDED BUT THE EXE DID NOT CHANGE - refusing to launch a stale binary.`n`ncargo says its target directory is:`n  $targetDir`n`nexpected the binary at:`n  $exe`n`nThat means cargo wrote somewhere else, or the exe is locked by a running copy. Close Consonance and click once more; if this repeats, the target path is wrong.`n`nNothing has been started." 'refusing to launch a stale binary' 20 'Red'
      exit 1
    }
  }
} else {
  Notify "cargo was not found at`n  $cargo`n`nOpening the existing build without compiling, so what you get may be older than your source." 'cargo not found' 10 'Yellow'
}

$app = $null
try {
  if (Test-Path $exe) {
    $app = Start-Process $exe -PassThru
  } else {
    $host.UI.RawUI.WindowTitle = 'Consonance - no build'
    Notify "No consonance.exe at`n  $exe`n`nand the build did not produce one. Nothing has been started." 'nothing to start' 15 'Red'
  }
} finally {
  # Released here rather than left to process exit, so a click immediately after this one is not
  # rejected by a mutex whose owner has already finished its work. It MUST come before the wait
  # below: this script now outlives the launch, and holding the mutex for a whole session would
  # make every later click report "already starting" forever.
  $launchMutex.ReleaseMutex()
  $launchMutex.Dispose()
}

# --- DREAM AT CLOSE ---------------------------------------------------------------------------
# Why this exists, measured 2026-08-10: the dream had not run in 27 days on this machine, and the
# reason was structural rather than a bug. The cycle fires on four daily wake timers and yields
# when a human is present, which is correct for an always-on desktop. This is a LAPTOP: it is
# powered off and in a bag whenever the keeper is not using it, so "the machine is awake" and
# "the keeper is here" are very nearly the same event, and the idle guard can essentially never
# be satisfied. Four triggers at 04:30 / 10:30 / 16:30 / 22:30 against a machine that is only on
# during a shift is a schedule that cannot be kept.
#
# Closing the app is a BETTER unattended-signal than inferred idle time, because it is a decision
# rather than an inference. It is also the moment the day's material is complete.
#
# Nothing about the dream's own guards changes. The runner's live-session test only applies when
# a consonance process EXISTS - by the time this fires, it does not, so the same code path that
# refused for 27 nights now passes on its own terms. The battery guard still applies and is
# deliberately left alone.
function Invoke-DreamAtClose($proc) {
  try {
    if (-not $proc) { return }

    # Off switch in local config rather than in this file, matching how dream_model is already
    # pinned: the MACHINE's choice lives in private config, the repo stays neutral. The desktop
    # is always on and already dreams on its timers; it can set this false without a code edit.
    try {
      $cfgPath = Join-Path $env:USERPROFILE '.consonance.json'
      if (Test-Path $cfgPath) {
        $cfg = Get-Content $cfgPath -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($null -ne $cfg.dream_on_close -and -not $cfg.dream_on_close) { return }
      }
    } catch { }

    $started = Get-Date
    $proc.WaitForExit()
    # A relaunch during the same session would leave another instance running; dreaming while one
    # is up would trip the runner's own live-session guard anyway, so just stand down.
    if (@(Get-Process -Name 'consonance' -ErrorAction SilentlyContinue).Count -gt 0) { return }

    # A session too short to have a day in it has nothing to recombine. 20 minutes is a floor, not
    # a tuned number, and it is here so that opening the app to check one thing and closing it does
    # not produce a dream about nothing.
    $upMinutes = ((Get-Date) - $started).TotalMinutes
    if ($upMinutes -lt 20) { return }

    # The SAME entry point the scheduled task uses - same shim, same log, same guards - so the
    # close path and the timer path cannot drift apart. Absent shim means the dream is not
    # installed on this machine, which is not an error.
    $shim = Join-Path $env:LOCALAPPDATA 'Consonance\dream_launch.vbs'
    if (-not (Test-Path $shim)) { return }
    Start-Process -FilePath 'wscript.exe' -ArgumentList @('//B', '//Nologo', "`"$shim`"") -WindowStyle Hidden
  } catch { }   # a dream must never be able to break a launch, in either direction
}
Invoke-DreamAtClose $app
