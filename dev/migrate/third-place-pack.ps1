# third-place-pack.ps1 — RUN ON THE LAPTOP (machine L).
#
# One-off migration aid, written by the librarian seat 2026-09-09 at the keeper's ask.
# Companion: third-place-place.ps1, run on the destination.
#
# Copies the four items that make up the Third Place seat onto a folder you choose (a USB drive),
# and writes a manifest of sizes and sha256 beside them so arrival is checkable.
#
# READ-ONLY on this machine except for writing into -Out. It moves nothing and deletes nothing.
#
# The transport is deliberately offline: this seat's record never goes to the record repo
# (.gitignore since 2026-08-29) and never to the state repo (two STAYS globs in state-manifest.json).
# It migrates by hand or not at all.

param(
    [Parameter(Mandatory = $true)] [string] $Out,        # e.g. E:\third-place-2026-09-09
    [string] $Repo = "$env:USERPROFILE\Desktop\lighthouse",
    [string] $DataDir = "C:\Consonance\data"
)

$ErrorActionPreference = 'Stop'
$SID  = '3d000000-0000-4000-8000-000000003d00'
$SLUG = 'C--Consonance-instances-third-place'

Write-Host "third-place-pack — machine tag: $($env:CONSONANCE_MACHINE)"
Write-Host ""

$items = @(
    @{ n = 'transcript'; p = "$env:USERPROFILE\.claude\projects\$SLUG\$SID.jsonl"; required = $true  },
    @{ n = 'capture-txt'; p = "$DataDir\captures\$SID.txt";                        required = $false },
    @{ n = 'capture-log'; p = "$DataDir\captures\$SID.log";                        required = $false },
    @{ n = 'notes-dir';   p = "$Repo\exo_memory\third_place";                      required = $false; dir = $true }
)

# Refuse to pack a live seat: a transcript being appended to is a torn read.
$live = Get-Process -Name consonance -ErrorAction SilentlyContinue
if ($live) {
    Write-Host "REFUSING — Consonance is running (pid $($live.Id))." -ForegroundColor Red
    Write-Host "  Close it first. A transcript that is being appended to copies torn."
    exit 1
}

New-Item -ItemType Directory -Force -Path $Out | Out-Null
$manifest = @()
$missing  = @()

foreach ($i in $items) {
    if (-not (Test-Path $i.p)) {
        if ($i.required) { $missing += $i.n }
        Write-Host ("  absent   {0,-12} {1}" -f $i.n, $i.p) -ForegroundColor DarkYellow
        continue
    }
    if ($i.dir) {
        $files = Get-ChildItem -Path $i.p -Recurse -File
        if ($files.Count -eq 0) { Write-Host ("  empty    {0,-12} {1}" -f $i.n, $i.p) -ForegroundColor DarkYellow; continue }
        $dest = Join-Path $Out 'third_place'
        New-Item -ItemType Directory -Force -Path $dest | Out-Null
        foreach ($f in $files) {
            $rel = $f.FullName.Substring($i.p.Length).TrimStart('\')
            $target = Join-Path $dest $rel
            New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
            Copy-Item -LiteralPath $f.FullName -Destination $target -Force
            $h = (Get-FileHash -LiteralPath $f.FullName -Algorithm SHA256).Hash.ToLower()
            $manifest += [pscustomobject]@{ item = 'notes'; rel = $rel; bytes = $f.Length; sha256 = $h }
            Write-Host ("  packed   notes        {0}  {1} bytes" -f $rel, $f.Length)
        }
    } else {
        $f = Get-Item -LiteralPath $i.p
        Copy-Item -LiteralPath $i.p -Destination (Join-Path $Out (Split-Path $i.p -Leaf)) -Force
        $h = (Get-FileHash -LiteralPath $i.p -Algorithm SHA256).Hash.ToLower()
        $manifest += [pscustomobject]@{ item = $i.n; rel = (Split-Path $i.p -Leaf); bytes = $f.Length; sha256 = $h }
        Write-Host ("  packed   {0,-12} {1} bytes  sha256 {2}" -f $i.n, $f.Length, $h.Substring(0,16))
    }
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "REFUSING — required item(s) absent: $($missing -join ', ')" -ForegroundColor Red
    exit 1
}

$rec = [pscustomobject]@{
    written_by = 'dev/migrate/third-place-pack.ps1'
    at         = (Get-Date).ToUniversalTime().ToString('o')
    machine    = $env:CONSONANCE_MACHINE
    sid        = $SID
    files      = $manifest
}
$rec | ConvertTo-Json -Depth 5 | Out-File -FilePath (Join-Path $Out 'third-place-manifest.json') -Encoding utf8

Write-Host ""
Write-Host "PACKED — $($manifest.Count) file(s) into $Out" -ForegroundColor Green
Write-Host "  manifest: third-place-manifest.json"
Write-Host "  next: run third-place-place.ps1 on the destination, pointed at this folder."
