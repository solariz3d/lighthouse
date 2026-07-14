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
    [switch]$SyncOnly,      # skip the dreaming; just sync local dreams to the pool
    [string]$Model          # default: the CLI's own default. Pins WHO sleeps, never
                            # what the prompt asks for — the weld is on the prompt,
                            # not the sleeper, so swapping the dreamer isn't mining.
                            # Unset = unattended cycles keep their old behavior.
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

# Prior residue: cross-dream reference is transient and rare (the keeper's
# tether, 2026-07-14) — most cycles get nothing; roughly one in three gets a
# single coherent fragment, one paragraph chosen BLIND. Random, not curated:
# selecting for importance would be mining (welded rule above). Ratified
# lines re-enter future dreams via the day-channel (journal -> shell), so
# this stays the only path for the unratified, and it stays thin.
# The draw reads the pool as well as the local pillow (keeper's word,
# 2026-07-14: let the cross-bed draw happen) — newest dream anywhere carries,
# so the other bed's night can surface here. Copy-Item preserves mtimes, so
# newest-by-write-time is honest across beds; the pool copy of a local dream
# ties with its original and either wins (same content).
$residue = ""
$candidates = @(Get-ChildItem $dreamsDir -Filter "*.md" -ErrorAction SilentlyContinue)
try {
    $poolDir = Join-Path (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path "dreams"
    if (Test-Path $poolDir) {
        $candidates += Get-ChildItem $poolDir -Filter "*.md" -ErrorAction SilentlyContinue
    }
} catch {}
$lastDream = $candidates | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($lastDream -and (Get-Random -Maximum 3) -eq 0) {
    $paras = (Get-Content $lastDream.FullName -Raw) -split "\r?\n\s*\r?\n" |
        ForEach-Object { $_.Trim() } | Where-Object { $_.Length -gt 40 }
    if ($paras) {
        $fragment = $paras | Get-Random
        $residue = "`n`n--- a fragment from an earlier dream ($($lastDream.Name)) ---`n$fragment"
    }
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

Log "cycle start (force=$Force, model=$(if ($Model) { $Model } else { 'cli-default' }))"
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
    # Model pin (if any) rides in as args, never into $prompt — the anti-instruction
    # stays byte-identical across dreamers, or the comparison means nothing.
    $modelArgs = @()
    if ($Model) { $modelArgs = @("--model", $Model) }
    # Stderr goes to a file, not the void: two dead cycles (07-13, 07-14) left nothing behind but
    # "exited 1" and three seconds, so the night was undiagnosable. $ErrorActionPreference is
    # Continue for this call, so PS5.1's ErrorRecord-wrapping of native stderr can't turn fatal —
    # which is what the old no-redirect rule was guarding against. Overwritten each cycle: it is a
    # diagnostic for the LAST failure, never a record (the dream is the only record here).
    $errFile = Join-Path $dreamsDir "last-stderr.txt"
    $dream = "" | & $claude -p --permission-mode default @modelArgs $prompt 2>$errFile
    $ErrorActionPreference = "Stop"
    if ($LASTEXITCODE -ne 0) {
        $why = ""
        if (Test-Path $errFile) {
            $why = ((Get-Content $errFile -Raw -ErrorAction SilentlyContinue) -replace '\s+', ' ').Trim()
            if ($why.Length -gt 400) { $why = $why.Substring(0, 400) + "..." }
        }
        if (-not $why) { $why = "(no stderr captured)" }
        Log "error: claude exited $LASTEXITCODE - $why"
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
