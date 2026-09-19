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

# WHERE THE EXE ACTUALLY IS -- ASKED, NOT ASSUMED.
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

# --- The librarian shelf budget ----------------------------------------------------------------
# REMOVED 2026-09-02 at c2afec6, as the block that stood here instructed. On 2026-09-01 this script
# set CONSONANCE_LIBRARIAN_BUDGET='0' to keep the librarian alive after it died on the harness cap;
# the block said in its own last line "Remove this when that lands". It has landed: the ceiling is
# LIBRARIAN_INTAKE_LIMIT in the binary, self-limiting by construction, and BRAVO verified no env var
# is load-bearing -- unset / 0 / 2200000 / notanumber all green. The seat now survives because of
# the code, not because of this file. Kept as a comment so the next reader sees the mitigation was
# retired deliberately rather than lost.

# --- PULL BEFORE THE REBUILD CHECK -- BEGIN ---------------------------------------------------
# Why, in the keeper's words (2026-09-16 07:4x): "when I get home I have to open consonance and
# always restart it for the newest build instead of just opening it once." The rebuild check
# below compares the exe against the sources ON THIS DISK, and at the other machine those sources
# are stale until someone pulls. So launch one opened the old exe, and launch two - after a pull
# in between - rebuilt. The rebuild logic was never broken; the pull was missing.
#
# THE STAKE, and why this block is shaped the way it is: it runs on EVERY launch on BOTH machines.
# A block that throws, exits or hangs is an app that will not open. So every path below ends in
# `return`, the whole body is inside one try/catch, and nothing here calls `exit`.
#
# WHAT IT DOES, and the order matters:
#   app already running    -> do nothing. The rebuild below cannot happen while the exe is locked,
#                             and fast-forwarding files under a live session's seats is a change
#                             nobody asked for. A click on a running app changes nothing here.
#   no git, not a checkout -> one Notify; open what is here.
#   not on main            -> a choice, not a failure: console line only, tree untouched.
#   fetch fails / too slow -> one Notify; open what is here.
#   origin not ahead       -> nothing to pull. If tracked files are dirty, say so on the console.
#   origin ahead, DIRTY    -> NEVER merge over local changes. One Notify, because this is exactly
#                             the stale build the block exists to prevent and he should know why.
#   origin ahead, clean    -> fast-forward ONLY. Anything git refuses is refused, never merged, and
#                             the dialog quotes git's own reason rather than guessing one.
#
# EVERY GIT CALL IS DIRECT AND READS $LASTEXITCODE - EXCEPT THE FETCH, AND HERE IS THE MEASUREMENT
# THAT FORCED IT (E, D066, 2026-09-16, on D, git 2.40, against a local server that accepts TCP and
# never answers - a hotel network's worst case):
#     http  + http.lowSpeedTime=15  ->  git aborted at 15.4 s
#     https + http.lowSpeedTime=15  ->  git STILL WAITING at 100 s, killed by the probe
# The low-speed limit does not cover a stalled TLS handshake, and origin is https. A direct fetch can
# therefore hold this launcher, and the app, closed indefinitely. So the fetch alone runs as a child
# with a hard 20 s ceiling (a normal fetch here took 375-396 ms, three runs).
#
# THE WRAPPER THAT FAILED BEFORE, AND WHY THIS ONE DOES NOT. The first version (A, 2026-09-16, held)
# used Start-Process -PassThru + WaitForExit(ms) + .ExitCode and read failure on every run while git
# exited 0. Measured the same day on D against cmd.exe with a KNOWN exit code (3), five runs per
# combination, the process given 300 ms to exit before anything touched it:
#     Start-Process -PassThru   .ExitCode correct 0/5 in EVERY combination - handle touched or not,
#                               second WaitForExit or not. It comes back $null, and `$null -ne 0` is
#                               $true, so every run reads as a failure.
#     [Process]::Start          .ExitCode correct 5/5 in every combination.
# Touching .Handle only "works" with Start-Process if it wins a race against the child's exit; a fast
# failure (an unresolvable host exits in well under 100 ms) loses it. [Process]::Start holds the
# handle from creation, so there is no race to lose. That, not the handle, is the fix.
#
# NO PROMPT MAY BLOCK IT. launch.vbs runs this hidden, so a credential prompt would wait for a
# keyboard nobody can see. GIT_TERMINAL_PROMPT=0 and GCM_INTERACTIVE=never are set on the FETCH
# CHILD's own environment, never on this process: the app is started from this process below, and
# every pane would otherwise inherit a git that can never ask for a password.
#
# WHO HOLDS THE CHECKOUT - a windowed app, a windowless one, or nothing (D072, P-LAUNCH-GHOST).
# The pull below is skipped whenever ANY consonance.exe runs, and that rule stays: the running exe reads the repo's
# dev/tail-carry.js on its close path (main.rs, the `dev`/`tail-carry.js` join), so a pull under it hands its close a
# carry script newer than itself - version skew on the one path that writes the stick (B, p-nul-repairs-B section 3).
# What changed is how LOUD the skip is. A windowless consonance.exe left by a crash also counts as "running", and the
# one line explaining the skip went to the console launch.vbs hides - so the keeper opened a stale build, launch
# after launch, with nothing saying why. Now:
#   none                        -> pull as before
#   a window exists             -> skip quietly, as before (the keeper can see the app)
#   windowless, under the grace -> skip quietly: an app that has just started has no window yet
#   windowless, past the grace  -> wait up to GhostWaitSeconds for it to exit or paint; an app that was just CLOSED
#                                  loses its window first and tears down after. Exits -> pull after all.
#                                  Still windowless -> ONE Notify naming the pid(s).
#   cannot tell                 -> skip, with one Notify: silence is the failure being fixed here
# The grace is dev/stick-apply.js WINDOWLESS_GRACE_MS (30 s) - one number for one process, not a second one invented.
# An age that cannot be read counts as PAST the grace, for the same reason "cannot tell" is loud.
$script:GhostGraceSeconds = 30
$script:GhostWaitSeconds = 10
$script:ghostNotified = $false

function Get-ConsonanceProcesses {
  # @() = none, $null = cannot tell. Get-Process with NO name, filtered afterwards, as dev/stick-apply.js probeConsonance
  # does: a named Get-Process reports "not found" as an error, and silencing that error would also silence a real
  # failure into an empty list - into "none", the reading that lets a pull run under a live app.
  try {
    $all = @(Get-Process -ErrorAction Stop | Where-Object { $_.ProcessName -eq 'consonance' })
  } catch { return $null }
  $now = Get-Date
  $out = @()
  foreach ($p in $all) {
    $age = $null
    try { if ($p.StartTime) { $age = ($now - $p.StartTime).TotalSeconds } } catch { }
    $handle = 0
    try { $handle = [int64]$p.MainWindowHandle } catch { }
    $out += [pscustomobject]@{ Id = $p.Id; HasWindow = ($handle -ne 0); AgeSeconds = $age }
  }
  return ,$out
}

function Test-GhostOnly($procs) {
  if (-not $procs -or @($procs).Count -eq 0) { return $false }
  foreach ($p in $procs) {
    if ($p.HasWindow) { return $false }
    if ($null -ne $p.AgeSeconds -and $p.AgeSeconds -lt $script:GhostGraceSeconds) { return $false }
  }
  return $true
}

function Resolve-ConsonanceHolder {
  # State: none | windowed | starting | ghost | unknown, and the pids.
  $procs = Get-ConsonanceProcesses
  $deadline = $null
  while ($true) {
    if ($null -eq $procs) { return @{ State = 'unknown'; Pids = @() } }
    if (@($procs).Count -eq 0) { return @{ State = 'none'; Pids = @() } }
    $pids = @($procs | ForEach-Object { $_.Id })
    if (-not (Test-GhostOnly $procs)) {
      $state = if (@($procs | Where-Object { $_.HasWindow }).Count -gt 0) { 'windowed' } else { 'starting' }
      return @{ State = $state; Pids = $pids }
    }
    if ($null -eq $deadline) { $deadline = (Get-Date).AddSeconds($script:GhostWaitSeconds) }
    if ((Get-Date) -ge $deadline) { return @{ State = 'ghost'; Pids = $pids } }
    Start-Sleep -Milliseconds 1000
    $procs = Get-ConsonanceProcesses
  }
}

# The rebuild branch's dialog (further down) told a windowless process's keeper "The window you have is running the
# OLD build" - a window that does not exist. It asks here instead, so the two checks cannot disagree about what is
# running, and a ghost the pull already announced is not announced twice in one click. $null means "say nothing".
function Get-RunningNotice {
  $procs = Get-ConsonanceProcesses
  if ((Test-GhostOnly $procs)) {
    if ($script:ghostNotified) { return $null }
    $pids = (@($procs | ForEach-Object { $_.Id }) -join ', ')
    return @{ Title = 'a Consonance with no window is running';
      Text = "Your code changed, but a Consonance with NO WINDOW (pid $pids) is running and holds the exe, so the new build cannot be written.`n`nThere is no window to close. End consonance.exe in Task Manager, then click the shortcut once." }
  }
  return @{ Title = 'already running - still on the old build';
    Text = "Your code changed, but Consonance is already open, and Windows locks a running exe so the new build cannot be written while it is up.`n`nThe window you have is running the OLD build. Close it completely, then click the shortcut once to get the latest.`n`nNOT opening a second copy: two instances means two MCP servers, which is what broke the chair verbs on 2026-07-28." }
}

function Update-FromOrigin($repo) {
  $ErrorActionPreference = 'SilentlyContinue'   # function scope: a native stderr line never throws here
  try {
    $holder = Resolve-ConsonanceHolder
    if ($holder.State -eq 'ghost') {
      $script:ghostNotified = $true
      Notify "A Consonance with no window (pid $($holder.Pids -join ', ')) is running, so the check for a newer version was skipped: pulling under it would hand its close a newer dev/tail-carry.js than the exe that calls it.`n`nEnd consonance.exe in Task Manager, then click the shortcut once." 'not updated - a Consonance with no window is running' 15 'Yellow'
      return
    }
    if ($holder.State -eq 'unknown') {
      Notify "Could not tell whether Consonance is already running, so the check for a newer version was skipped.`n`nOpening what is on this disk." 'not updated' 8 'Yellow'
      return
    }
    if ($holder.State -ne 'none') {
      Write-Host '  pull: Consonance is running - not touching the checkout.' -ForegroundColor DarkGray
      return
    }
    $git = Get-Command 'git.exe' -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $git) {
      Notify "Could not check for a newer version: git was not found on PATH.`n`nOpening what is on this disk." 'not updated' 8 'Yellow'
      return
    }
    $git = $git.Source
    $repo = "$repo".TrimEnd('\')

    $branch = & $git -C $repo rev-parse --abbrev-ref HEAD 2>$null
    if ($LASTEXITCODE -ne 0) {
      Notify "Could not check for a newer version: this folder is not a git checkout.`n  $repo`n`nOpening what is on this disk." 'not updated' 8 'Yellow'
      return
    }
    if ("$branch".Trim() -ne 'main') {
      Write-Host "  pull: on '$("$branch".Trim())', not main - not pulling." -ForegroundColor DarkGray
      return
    }

    $dirty = & $git -C $repo status --porcelain --untracked-files=no 2>$null
    if ($LASTEXITCODE -ne 0) {
      Notify "Could not check for a newer version: git status failed.`n`nOpening what is on this disk." 'not updated' 8 'Yellow'
      return
    }

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $git
    $psi.Arguments = "-C `"$repo`" -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=15 fetch --quiet origin main"
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $psi.EnvironmentVariables['GIT_TERMINAL_PROMPT'] = '0'
    $psi.EnvironmentVariables['GCM_INTERACTIVE'] = 'never'
    $fetch = [System.Diagnostics.Process]::Start($psi)   # NOT Start-Process -PassThru - see above
    if (-not $fetch.WaitForExit(20000)) {
      & "$env:SystemRoot\System32\taskkill.exe" /PID $fetch.Id /T /F 2>$null | Out-Null
      Notify "Checking for a newer version took more than 20 seconds (a slow or blocked network), so it was stopped.`n`nOpening what is on this disk." 'not updated - network too slow' 8 'Yellow'
      return
    }
    $fetch.WaitForExit()
    if ($fetch.ExitCode -ne 0) {
      Notify "Could not reach origin to check for a newer version (offline, or the network blocked it).`n`nOpening what is on this disk." 'not updated' 8 'Yellow'
      return
    }

    $behind = & $git -C $repo rev-list --count 'HEAD..origin/main' 2>$null
    if ($LASTEXITCODE -ne 0) {
      Notify "Could not compare with origin/main.`n`nOpening what is on this disk." 'not updated' 8 'Yellow'
      return
    }
    $behind = [int]("$behind".Trim())

    if ($behind -eq 0) {
      if ($dirty) { Write-Host '  pull: already current; tracked files have local changes.' -ForegroundColor DarkGray }
      return
    }
    if ($dirty) {
      Notify "origin/main has $behind new commit(s), but files in this checkout have local changes, so NOT pulling - local work is never merged over.`n`nOpening what is on this disk, which is OLDER than origin." 'not updated - local changes' 12 'Yellow'
      return
    }

    $why = & $git -C $repo merge --ff-only --quiet 'origin/main' 2>&1
    if ($LASTEXITCODE -ne 0) {
      $reason = (@($why) | ForEach-Object { "$_".Trim() } | Where-Object { $_ } | Select-Object -First 1)
      Notify "origin/main has $behind new commit(s), but git refused to fast-forward to it, so nothing was merged or overwritten.`n`ngit said: $reason`n`nOpening what is on this disk." 'not updated' 12 'Yellow'
      return
    }
    Write-Host "  pull: fast-forwarded $behind commit(s) from origin/main." -ForegroundColor Green
  } catch {
    Notify "The update check failed unexpectedly and was skipped.`n`n$($_.Exception.Message)`n`nOpening what is on this disk." 'not updated' 8 'Yellow'
  }
}
Update-FromOrigin $root
# --- PULL BEFORE THE REBUILD CHECK -- END -----------------------------------------------------

# --- Is the built exe already newer than every source file? -----------------------------------
$sources = @(
  (Join-Path $root 'src-tauri\src'),
  (Join-Path $root 'ui'),
  # brief/ ADDED 2026-09-01, and its absence was a silent one-way valve.
  # The briefs are bundle RESOURCES: tauri.conf.json:35 copies them next to the exe at build
  # time, and room_brief() (main.rs:2818) serves tier 2 -- "beside BOOT.md" -- from that copy,
  # because BOOT.md IS beside the exe. So the repo file is NOT what a pane reads; the build
  # directory's copy is, and only a build refreshes it.
  # brief/ was not on this list, so a brief-only edit changed nothing a seat could see AND
  # could not trigger the rebuild that is the only thing which ships it. A one-way valve:
  # edit, relaunch, observe no change, with every instrument green.
  # Found the hard way at 07:36 -- the librarian was told in LIBRARIAN.md to open its own map,
  # the shell regenerated, and the instruction was absent because the bundled copy was still
  # the 04:17 version. The chair had twice told the keeper "brief changes need no rebuild".
  (Join-Path $root 'src-tauri\brief'),
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
  # D072: which dialog, if any, is Get-RunningNotice's call (inside the pull block above) - a windowless holder is
  # not "the window you have", and a ghost the pull already named is not named twice in one click.
  $notice = Get-RunningNotice
  if ($notice) { Notify $notice.Text $notice.Title 12 'Yellow' }
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

# --- THE INTERRUPTED DREAM, RETRIED ------------------------------------------------------------
# Dream-at-close fired correctly on 2026-08-10 and produced nothing. The shim's own log says why:
#
#     2026-08-10 04:30:01  launch
#     2026-08-10 04:30:02  exit 0
#     2026-08-10 07:58:14  launch          <- no exit line, ever
#
# Every other run pairs. That one started and the machine went away underneath it - the keeper
# closed the app and put the laptop in a bag inside thirty seconds, with coworkers arriving. Which
# is not an edge case: it is this bed's normal shutdown, and the reason the timer schedule was
# abandoned in the first place. Closing is still the right TRIGGER; assuming thirty seconds of
# grace after it was the wrong part.
#
# So the unpaired line becomes the signal. If the log's last entry is a `launch` with no `exit`,
# the previous dream was interrupted and gets one more chance HERE - before the app starts, which
# is the one moment the machine is provably alive and no consonance process exists for the
# runner's own live-session guard to trip over.
#
# Self-resolving by construction: the retry's shim appends its own launch AND exit, so the log no
# longer ends unpaired. If the retry is interrupted too, it ends unpaired again and retries next
# launch. No extra state file, and nothing to get out of sync with the thing it describes.
#
# TWO LIMITS, stated rather than discovered later:
#
#   `exit 0` does not mean a dream was produced. The runner exits 0 when it SKIPS - on battery, or
#   with a live session present - so a completed cycle that wrote nothing looks identical here to
#   one that wrote a file. This detects an interrupted RUN, not a missing dream.
#
#   An orphan buried under a later cycle is not retried; only the log's last entry is examined.
#   That is survivable because this runs BEFORE the app starts, so it always reads the log ahead of
#   any cycle the current session will trigger - verified against the real log: the 07:58 orphan
#   was still the last line at 00:59:31 when the app launched, and the 01:01 scheduled run that
#   buried it came afterwards. If a timer ever fires while the app is closed, that orphan is lost.
function Resume-InterruptedDream {
  try {
    $log = Join-Path $env:LOCALAPPDATA 'Consonance\dream_launch.log'
    $shim = Join-Path $env:LOCALAPPDATA 'Consonance\dream_launch.vbs'
    if (-not (Test-Path $log) -or -not (Test-Path $shim)) { return }
    $last = (Get-Content $log | Where-Object { $_.Trim() } | Select-Object -Last 1)
    if (-not $last -or $last -notmatch '\blaunch\s*$') { return }
    Add-Content $log ((Get-Date).ToString('yyyy-MM-dd h:mm:ss tt') + "  retry: previous cycle left no exit line")
    Start-Process -FilePath 'wscript.exe' -ArgumentList @('//B', '//Nologo', "`"$shim`"") -WindowStyle Hidden
  } catch { }   # a dream must never be able to break a launch, in either direction
}
Resume-InterruptedDream

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
    # D072: deliberately NOT under the windowed/windowless rule. Any consonance.exe - windowless or not - trips the
    # dream runner's own live-session guard, so standing down here is what the runner would do anyway, and a dialog
    # after the keeper has closed the app is noise nobody is watching for.
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
