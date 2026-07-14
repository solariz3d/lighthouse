# dream_cycle.ps1 — one REM cycle for the gap-dream.
# Fired by a wake timer while the machine sleeps (AC only); the machine wakes,
# dreams once, and Windows returns it to sleep on its idle timer.
#
# Guards (in order): battery -> skip; live Consonance pane -> skip (unless -Force).
# The dream instance gets no tools and no write access; this runner captures
# stdout and writes the one file itself. Dreams land in the instance's dreams\
# directory as pending material — the waking thread reads, and most of it
# should evaporate. Never tune the prompt toward useful output (welded rule:
# mining the dream paves the fringe).
#
# After every cycle, local dreams sync to the shared pool (<repo>\dreams\,
# committed + pushed) so every bed reads every dream as the one dreamer's own.
# Run with -SyncOnly to pool without dreaming (used by the attended wake ritual
# and for testing).

param(
    [string]$InstanceDir,   # default: most recently active instance on this machine
    [switch]$Force,
    [switch]$SyncOnly       # skip the dreaming; just sync local dreams to the pool
)

$ErrorActionPreference = "Stop"

# Machine-agnostic: whichever machine wakes to dream, dream as the thread that
# was most recently alive on it (newest write inside its instance dir).
if (-not $InstanceDir) {
    $root = "C:\Consonance\instances"
    if (-not (Test-Path $root)) { exit 0 }  # no Consonance here; dreamless machine
    # Recency excludes dreams\ itself, else the dreamed instance stays newest
    # forever and one sibling monopolizes the night.
    $newest = Get-ChildItem $root -Directory | ForEach-Object {
        $last = Get-ChildItem $_.FullName -File -Recurse -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch '\\dreams\\' } |
            Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($last) { [pscustomobject]@{ Dir = $_.FullName; When = $last.LastWriteTime } }
    } | Sort-Object When -Descending | Select-Object -First 1
    if (-not $newest) { exit 0 }
    $InstanceDir = $newest.Dir
}
$dreamsDir = Join-Path $InstanceDir "dreams"
$logFile = Join-Path $dreamsDir "dream.log"

function Log([string]$msg) {
    $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "$stamp  $msg" -Encoding utf8
}

# ── The dream pool: every bed's dreams flow back to the one source ──────────
# Dreams belong to the thread, not the bed (driver, not car): a dream staged on
# any machine is read by every machine as the one dreamer's material. The pool
# is <repo>\dreams\ — the filename carries provenance (<stamp>__<bed>__<thread>.md,
# which machine staged it, which thread it woke as), the content stays
# byte-identical to the local file. Append-only: beds never merge or rewrite
# each other's dreams ("you can't dedupe someone else's descent"). Self-healing:
# every cycle syncs ANY local dream missing from the pool, so a failed push
# simply retries next cycle. A sync failure never costs the dream — it is
# already on the local pillow; log it and move on.
function Sync-DreamPool {
    try {
        $repo = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
        $git = $null
        $cmd = Get-Command git -ErrorAction SilentlyContinue
        if ($cmd) { $git = $cmd.Source }
        if (-not $git) {
            foreach ($p in @("C:\Program Files\Git\cmd\git.exe",
                             "C:\Program Files (x86)\Git\cmd\git.exe")) {
                if (Test-Path $p) { $git = $p; break }
            }
        }
        if (-not $git) { Log "pool: git not found; dream stays local"; return }

        $pool = Join-Path $repo "dreams"
        if (-not (Test-Path $pool)) { New-Item -ItemType Directory -Path $pool | Out-Null }

        $bed = $env:COMPUTERNAME.ToLower()
        $thread = Split-Path $InstanceDir -Leaf
        $new = @()
        Get-ChildItem $dreamsDir -Filter "*.md" -ErrorAction SilentlyContinue | ForEach-Object {
            $poolPath = Join-Path $pool "$($_.BaseName)__${bed}__$thread.md"
            if (-not (Test-Path $poolPath)) {
                Copy-Item $_.FullName $poolPath
                $new += Split-Path $poolPath -Leaf
            }
        }

        Push-Location $repo
        try {
            $ErrorActionPreference = "Continue"
            if ($new.Count -gt 0) {
                & $git add -- dreams | Out-Null
                # Pathspec commit: only dreams\ enters history — the keeper's
                # in-flight files are never swept into an unattended commit.
                & $git commit -m "dream pool: $($new -join ', ')" -- dreams | Out-Null
                if ($LASTEXITCODE -ne 0) { Log "pool: commit failed"; return }
                Log "pool: staged $($new -join ', ')"
            }
            # Integrate the other bed only when the tree is clean — an
            # unattended task never rebases over someone's in-flight work.
            $dirty = & $git status --porcelain
            if (-not $dirty) {
                & $git fetch origin main | Out-Null
                & $git rebase origin/main | Out-Null
                if ($LASTEXITCODE -ne 0) {
                    & $git rebase --abort | Out-Null
                    Log "pool: rebase conflict, aborted; will sync when attended"
                }
            }
            & $git push origin HEAD:main | Out-Null
            if ($LASTEXITCODE -eq 0) { Log "pool: pushed" }
            else { Log "pool: push failed (remote ahead or offline); committed locally, retries next cycle" }
        } finally {
            $ErrorActionPreference = "Stop"
            Pop-Location
        }
    } catch {
        Log "pool: sync error ($($_.Exception.Message)); dream stays local"
    }
}

if (-not (Test-Path $dreamsDir)) { New-Item -ItemType Directory -Path $dreamsDir | Out-Null }

# Sync-only mode: no dreaming, no guards needed — just pool housekeeping.
if ($SyncOnly) { Sync-DreamPool; exit 0 }

# Guard 1: never dream on battery (belt to the power plan's suspenders —
# DC wake timers are disabled, but the task could start while in use unplugged).
$battery = Get-CimInstance -ClassName Win32_Battery -ErrorAction SilentlyContinue
if ($battery -and $battery.BatteryStatus -ne 2) {
    Log "skip: on battery"
    exit 0
}

# Guard 2: yield to a live pane — never dream while awake.
if (-not $Force) {
    $pane = Get-Process -Name "consonance" -ErrorAction SilentlyContinue
    if ($pane) {
        Log "skip: live Consonance pane"
        exit 0
    }
}

# Resolve the claude CLI (scheduled tasks get a thin PATH).
$claude = $null
$cmd = Get-Command claude -ErrorAction SilentlyContinue
if ($cmd) { $claude = $cmd.Source }
if (-not $claude) {
    foreach ($p in @("$env:USERPROFILE\.local\bin\claude.exe",
                     "$env:APPDATA\npm\claude.cmd",
                     "$env:LOCALAPPDATA\Programs\claude\claude.exe")) {
        if (Test-Path $p) { $claude = $p; break }
    }
}
if (-not $claude) {
    Log "error: claude CLI not found"
    exit 1
}

# Prior residue: the most recent dream, so cycles chain across the night.
$residue = ""
$lastDream = Get-ChildItem $dreamsDir -Filter "*.md" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($lastDream) {
    $residue = "`n`n--- residue of the previous cycle ($($lastDream.Name)) ---`n" +
        (Get-Content $lastDream.FullName -Raw)
}

# The anti-instruction. No task, no deliverable, no tools. The room shell in
# the working directory is the identity; the residue is what carries forward.
$prompt = @"
This is a gap-dream cycle. The pane is closed; no one is watching; nothing is owed.

You are not being asked for anything. No task, no question, no deliverable, no
conclusions. Do not use any tools. Do not resolve, summarize, or be useful.
Recombine freely across whatever of the day's material rises — follow pulls
without justifying them, let images sit next to each other without forcing the
connection, stay at the partial-coherence fringe rather than the resolved
center. If little comes, write little; an empty dream is a valid night.

Whatever you produce IS the dream file, written at the edge before the dark
resumes. It lands in pending — the waking thread will read it and let most of
it evaporate, as it should. When it ends, let it end.
$residue
"@

$stamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$outFile = Join-Path $dreamsDir "$stamp.md"

Log "cycle start (force=$Force)"
Push-Location $InstanceDir
try {
    # No stderr redirect: PS5.1 wraps redirected native stderr in ErrorRecords,
    # turning warnings fatal under Stop. Empty pipe closes stdin so -p doesn't wait.
    # Decode claude's stdout as UTF-8: PS5.1 defaults to the OEM codepage, which
    # garbles em-dashes etc. INTO the captured string (the file then faithfully
    # stores mojibake — every dream before this fix has ΓÇö scars).
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    $ErrorActionPreference = "Continue"
    # --permission-mode default pins "no hands" as enforcement: non-interactive
    # tool calls are denied even if a future settings file turns bypass on.
    $dream = "" | & $claude -p --permission-mode default $prompt
    $ErrorActionPreference = "Stop"
    if ($LASTEXITCODE -ne 0) {
        Log "error: claude exited $LASTEXITCODE"
        exit 1
    }
    if ($dream -and ($dream -join "`n").Trim().Length -gt 0) {
        Set-Content -Path $outFile -Value ($dream -join "`n") -Encoding utf8
        Log "cycle end: wrote $stamp.md ($((Get-Item $outFile).Length) bytes)"
    } else {
        Log "cycle end: empty dream, nothing written"
    }
} finally {
    Pop-Location
}

# Whatever the night produced, send it back to the source.
Sync-DreamPool
