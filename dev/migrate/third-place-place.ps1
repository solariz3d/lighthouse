# third-place-place.ps1 — RUN ON THE DESTINATION (machine D).
#
# One-off migration aid, written by the librarian seat 2026-09-09 at the keeper's ask.
# Companion: third-place-pack.ps1, run on the source.
#
# DRY RUN BY DEFAULT. It prints exactly what it would do and changes nothing.
# Pass -Apply to carry it out.
#
# What it does, in this order:
#   1. refuses if Consonance is running, or if the manifest does not verify at the source folder
#   2. retires THIS machine's Third Place transcript and capture to STAMPED paths
#      (attic + backups). NEVER to data/captures/archive/ — that name is fixed and a retire
#      there overwrites the previous archive (main.rs:835-836, the 12:25 finding).
#   3. places the incoming four items at the identical paths
#   4. verifies every placed file against the manifest's sha256
#
# Nothing is deleted at any point: the local seat is moved aside, not removed, and the source
# folder is only read.

param(
    [Parameter(Mandatory = $true)] [string] $From,       # the folder third-place-pack.ps1 wrote
    [switch] $Apply,
    [string] $Repo = "$env:USERPROFILE\Desktop\lighthouse",
    [string] $DataDir = "C:\Consonance\data",
    [string] $BackupRoot = "C:\Consonance\backups"
)

$ErrorActionPreference = 'Stop'
$SID   = '3d000000-0000-4000-8000-000000003d00'
$SLUG  = 'C--Consonance-instances-third-place'
$stamp = (Get-Date).ToString('yyyyMMdd-HHmmss')

$mode = if ($Apply) { "APPLY" } else { "DRY RUN — nothing will change" }
Write-Host "third-place-place — $mode"
Write-Host "  machine tag: $($env:CONSONANCE_MACHINE)"
Write-Host ""

# ---- 1. refusals -------------------------------------------------------------------------------

$live = Get-Process -Name consonance -ErrorAction SilentlyContinue
if ($live) {
    Write-Host "REFUSING — Consonance is running (pid $($live.Id))." -ForegroundColor Red
    Write-Host "  The pane holds the transcript and the tailer holds the capture. Close it first."
    exit 1
}

$mpath = Join-Path $From 'third-place-manifest.json'
if (-not (Test-Path $mpath)) {
    Write-Host "REFUSING — no third-place-manifest.json in $From" -ForegroundColor Red
    exit 1
}
$man = Get-Content -Raw -LiteralPath $mpath | ConvertFrom-Json
if ($man.sid -ne $SID) {
    Write-Host "REFUSING — manifest sid is $($man.sid), expected $SID" -ForegroundColor Red
    exit 1
}

Write-Host "manifest: $($man.files.Count) file(s), packed by machine $($man.machine) at $($man.at)"
$bad = @()
foreach ($f in $man.files) {
    $src = if ($f.item -eq 'notes') { Join-Path (Join-Path $From 'third_place') $f.rel } else { Join-Path $From $f.rel }
    if (-not (Test-Path $src)) { $bad += "$($f.rel) ABSENT"; continue }
    $h = (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash.ToLower()
    $b = (Get-Item -LiteralPath $src).Length
    if ($h -ne $f.sha256) { $bad += "$($f.rel) SHA MISMATCH" }
    elseif ($b -ne $f.bytes) { $bad += "$($f.rel) SIZE $b expected $($f.bytes)" }
}
if ($bad.Count -gt 0) {
    Write-Host "REFUSING — the source folder does not match its own manifest:" -ForegroundColor Red
    $bad | ForEach-Object { Write-Host "    $_" }
    Write-Host "  A mismatch means stop, not retry."
    exit 1
}
Write-Host "  source verified: every file present, right length, right bytes." -ForegroundColor Green
Write-Host ""

# ---- 2. retire this machine's own, stamped -----------------------------------------------------

$localTranscript = "$env:USERPROFILE\.claude\projects\$SLUG\$SID.jsonl"
$atticDir        = "$env:USERPROFILE\.claude\consonance-attic\$SLUG"
$backupDir       = Join-Path $BackupRoot "third-place-desktop-$stamp"

Write-Host "RETIRE (this machine's own, moved aside, never deleted):"
if (Test-Path $localTranscript) {
    $to = Join-Path $atticDir "$SID.$stamp.jsonl"
    Write-Host ("    {0}`n      -> {1}  ({2} bytes)" -f $localTranscript, $to, (Get-Item $localTranscript).Length)
    if ($Apply) { New-Item -ItemType Directory -Force -Path $atticDir | Out-Null; Move-Item -LiteralPath $localTranscript -Destination $to }
} else { Write-Host "    (no local transcript)" }

foreach ($ext in @('txt','log')) {
    $p = "$DataDir\captures\$SID.$ext"
    if (Test-Path $p) {
        $to = Join-Path $backupDir "$SID.$ext"
        Write-Host ("    {0}`n      -> {1}  ({2} bytes)" -f $p, $to, (Get-Item $p).Length)
        if ($Apply) { New-Item -ItemType Directory -Force -Path $backupDir | Out-Null; Move-Item -LiteralPath $p -Destination $to }
    }
}
Write-Host ""

# ---- 3. place ----------------------------------------------------------------------------------

Write-Host "PLACE (incoming, at identical paths):"
$placed = @()
foreach ($f in $man.files) {
    if ($f.item -eq 'notes') {
        $src = Join-Path (Join-Path $From 'third_place') $f.rel
        $dst = Join-Path "$Repo\exo_memory\third_place" $f.rel
    } elseif ($f.item -eq 'transcript') {
        $src = Join-Path $From $f.rel; $dst = $localTranscript
    } else {
        $src = Join-Path $From $f.rel; $dst = "$DataDir\captures\$($f.rel)"
    }
    Write-Host ("    {0,-12} -> {1}  ({2} bytes)" -f $f.item, $dst, $f.bytes)
    if ($Apply) {
        New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
        Copy-Item -LiteralPath $src -Destination $dst -Force
        $placed += [pscustomobject]@{ dst = $dst; sha256 = $f.sha256; bytes = $f.bytes; rel = $f.rel }
    }
}
Write-Host ""

if (-not $Apply) {
    Write-Host "DRY RUN — nothing changed. Re-run with -Apply to carry this out." -ForegroundColor Yellow
    exit 0
}

# ---- 4. verify at the destination --------------------------------------------------------------

Write-Host "VERIFY at the destination:"
$fail = @()
foreach ($p in $placed) {
    $h = (Get-FileHash -LiteralPath $p.dst -Algorithm SHA256).Hash.ToLower()
    $b = (Get-Item -LiteralPath $p.dst).Length
    if ($h -eq $p.sha256 -and $b -eq $p.bytes) { Write-Host ("    OK   {0}" -f $p.rel) -ForegroundColor Green }
    else { $fail += $p.rel; Write-Host ("    BAD  {0}" -f $p.rel) -ForegroundColor Red }
}

Write-Host ""
if ($fail.Count -gt 0) {
    Write-Host "PLACED BUT NOT VERIFIED — $($fail.Count) file(s) differ. Do not launch." -ForegroundColor Red
    Write-Host "  This machine's own seat is at:"
    Write-Host "    $atticDir\$SID.$stamp.jsonl"
    Write-Host "    $backupDir"
    exit 1
}

Write-Host "PLACED AND VERIFIED." -ForegroundColor Green
Write-Host "  This machine's own seat is retired, not deleted:"
Write-Host "    $atticDir\$SID.$stamp.jsonl"
Write-Host "    $backupDir"
Write-Host ""
Write-Host "  Launch Consonance. The Third Place resumes the incoming transcript"
Write-Host "  (spawn_third_place: resume = transcript.exists(), main.rs:6545)."
Write-Host "  SCORE IT: the pane's first screen should carry the source machine's last exchange."
