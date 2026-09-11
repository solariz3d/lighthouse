# desktop-receive.ps1 - RUN ON THE DESKTOP (machine D). The other half of laptop-to-desktop.ps1.
#
# Written by the librarian seat on the desktop, 2026-09-11, at the keeper's ask.
#
# Fetches one transport/L-<stamp> branch, unpacks every file into a STAGING folder, and checks each one
# against the size and sha256 the laptop recorded before packing. It does NOT place anything: no seat is
# retired, no transcript is replaced, nothing under ~/.claude or C:\Consonance\data is touched. Placing is
# a separate, deliberate step, done with Consonance closed and the keeper present.
#
# Binary-safe on purpose: blobs leave git through `git archive -o` (a file, never a PowerShell pipe,
# which would re-encode the bytes), then tar, then gunzip.
#
# ASCII only on purpose: Windows PowerShell 5.1 misreads non-ASCII in scripts without a BOM.

param(
    [Parameter(Mandatory = $true)] [string]$Branch,   # e.g. transport/L-20260911-001500
    [string]$Repo = "$env:USERPROFILE\Desktop\lighthouse",
    [string]$Out = ''                                  # default C:\Consonance\incoming\<branch leaf>
)

$ErrorActionPreference = 'Stop'
function Say($m, $c = 'Gray') { Write-Host $m -ForegroundColor $c }

if (-not $Out) { $Out = Join-Path 'C:\Consonance\incoming' ($Branch -replace '^transport/', '') }
if (Test-Path -LiteralPath $Out) { Say "Staging folder already exists: $Out. Move it aside first. Nothing was changed." 'Red'; exit 1 }

git -C $Repo fetch origin "refs/heads/$($Branch):refs/remotes/origin/$Branch"
if ($LASTEXITCODE -ne 0) { Say "Could not fetch $Branch. Nothing was changed." 'Red'; exit 1 }
$commit = (git -C $Repo rev-parse "refs/remotes/origin/$Branch").Trim()
Say "branch $Branch at $commit"

New-Item -ItemType Directory -Path $Out | Out-Null
$raw = Join-Path $Out '_raw'
New-Item -ItemType Directory -Path $raw | Out-Null
$tar = Join-Path $Out '_payload.tar'
git -C $Repo -c core.autocrlf=false -c core.eol=lf archive --format=tar -o $tar $commit   # no eol conversion on the way out
if ($LASTEXITCODE -ne 0) { throw 'git archive failed' }
tar -xf $tar -C $raw
if ($LASTEXITCODE -ne 0) { throw 'tar failed' }
Remove-Item -LiteralPath $tar

$rows = Get-Content -LiteralPath (Join-Path $raw 'MANIFEST.tsv') | Select-Object -Skip 1 | Where-Object { $_ }
$ok = 0; $bad = 0; $bytes = 0
foreach ($row in $rows) {
    $c = $row -split "`t"
    $rel = $c[0]; $size = [int64]$c[1]; $sha = $c[2]; $parts = $c[3] -split ','
    $dst = Join-Path (Join-Path $Out 'files') ($rel -replace '/', '\')
    New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
    $gz = Join-Path $raw ('joined-' + [IO.Path]::GetRandomFileName())
    $o = [IO.File]::Create($gz)
    try { foreach ($p in $parts) { $in = [IO.File]::OpenRead((Join-Path $raw "payload\$p")); try { $in.CopyTo($o) } finally { $in.Dispose() } } }
    finally { $o.Dispose() }
    $in = [IO.File]::OpenRead($gz)
    try {
        $z = New-Object IO.Compression.GZipStream($in, [IO.Compression.CompressionMode]::Decompress)
        try { $w = [IO.File]::Create($dst); try { $z.CopyTo($w) } finally { $w.Dispose() } } finally { $z.Dispose() }
    } finally { $in.Dispose() }
    Remove-Item -LiteralPath $gz
    $gotSize = (Get-Item -LiteralPath $dst).Length
    $gotSha = (Get-FileHash -LiteralPath $dst -Algorithm SHA256).Hash.ToLower()
    if ($gotSize -eq $size -and $gotSha -eq $sha) { $ok++; $bytes += $size; Say ('  ok    {0,12:N0}  {1}' -f $size, $rel) 'Green' }
    else { $bad++; Say ('  BAD   {0}  (laptop {1} B {2}; here {3} B {4})' -f $rel, $size, $sha.Substring(0, 12), $gotSize, $gotSha.Substring(0, 12)) 'Red' }
}
Copy-Item -LiteralPath (Join-Path $raw 'MANIFEST.tsv') -Destination (Join-Path $Out 'MANIFEST.tsv')   # desktop-place.ps1 re-checks against it
Remove-Item -LiteralPath $raw -Recurse -Force

Say ''
if ($bad -eq 0) { Say ("ALL {0} FILES MATCH THE LAPTOP'S OWN BYTES ({1:N1} MB). Staged at {2}\files" -f $ok, ($bytes / 1MB), $Out) 'Green' }
else { Say "$bad of $($ok + $bad) files DO NOT MATCH. Do not place anything. Staged at $Out for inspection." 'Red'; exit 1 }
Say 'Nothing was placed. Placing the seats is the next step, with Consonance closed.'
