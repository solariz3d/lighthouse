# laptop-to-desktop.ps1 - RUN ON THE LAPTOP (machine L), in plain PowerShell. Do NOT open Consonance first.
#
# Written by the librarian seat on the desktop, 2026-09-11, at the keeper's ask: the laptop's seats are
# the originals, and they come HERE, to the desktop. Nothing of the desktop goes to the laptop.
#
# Packs every Consonance seat's conversation on this machine (the file `claude --resume` reads), plus the
# roster, the settled capture tails and the Third Place's own record, and pushes them to the private
# lighthouse repo as ONE branch with no parent: transport/L-<stamp>. Nothing on this machine is moved,
# changed or deleted. The repo's working tree, index and branches are not touched: the commit is built
# with a private index file and pushed by hash.
#
# DRY RUN BY DEFAULT: lists every file with its size, sha256 and first timestamp, and stops.
# Pass -Apply to pack and push.
#
# Why gzip and parts: GitHub refuses any file over 100 MB, and the chair's transcript was 240 MB on
# 2026-09-08 (exo_memory/loop/one_house_two_machines_idea_2026-09-08.md:19). Each file is gzipped and, if
# still over 90 MB, split into numbered parts. MANIFEST.tsv records the ORIGINAL size and sha256 of every
# file, so arrival on the desktop is checked against this machine's own bytes, not against the transport.
#
# ASCII only on purpose: Windows PowerShell 5.1 misreads non-ASCII in scripts without a BOM.

param(
    [switch]$Apply,
    [string]$Repo = '',
    [switch]$AllowAnyRemote,  # testing only: push to a remote that is not solariz3d/lighthouse
    [switch]$IgnoreRunning,   # testing only: pack while Consonance is open (snapshots are taken first)
    [int64]$PartBytes = 90MB, # testing only: a smaller part size forces the split path
    [switch]$All              # carry every session in the seat folders, not only the seats
)

$ErrorActionPreference = 'Stop'
function Say($m, $c = 'Gray') { Write-Host $m -ForegroundColor $c }
function Sha($p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLower() }
function FirstTs($p) {
    try {
        $fs = [IO.File]::Open($p, 'Open', 'Read', 'ReadWrite'); $sr = New-Object IO.StreamReader($fs)
        try { for ($k = 0; $k -lt 60 -and -not $sr.EndOfStream; $k++) { $l = $sr.ReadLine(); if ($l -match '"timestamp":"([^"]+)"') { return $Matches[1] } } }
        finally { $sr.Dispose() }
    } catch { }
    return '-'
}

Say ''
Say 'Laptop to desktop: this machine''s seats go to the desktop. One way.' 'Cyan'
Say '---------------------------------------------------------' 'Cyan'


# ---- 1. find the repo ---------------------------------------------------------------------------
if (-not $Repo) {
    foreach ($c in @("$env:USERPROFILE\Desktop\lighthouse", 'C:\Consonance\lighthouse', (Get-Location).Path)) {
        if ($c -and (Test-Path -LiteralPath (Join-Path $c '.git'))) { $Repo = $c; break }
    }
}
if (-not $Repo) { Say 'Could not find the lighthouse repo. Pass -Repo <path>. Nothing was changed.' 'Red'; exit 1 }
$origin = (git -C $Repo remote get-url origin).Trim()
if (-not $AllowAnyRemote -and $origin -notmatch 'solariz3d/lighthouse') {
    Say "The repo's origin is '$origin', not solariz3d/lighthouse. Nothing was changed." 'Red'; exit 1
}
Say "repo:   $Repo"
Say "origin: $origin"

# ---- 2. what travels ----------------------------------------------------------------------------
$data = 'C:\Consonance\data'
$cfgPath = Join-Path $env:USERPROFILE '.consonance.json'
if (Test-Path -LiteralPath $cfgPath) {
    try { $cfg = Get-Content -LiteralPath $cfgPath -Raw | ConvertFrom-Json; if ($cfg.data_dir) { $data = $cfg.data_dir } } catch { }
}
$items = New-Object System.Collections.Generic.List[object]
function Add-Src($full, $rel) { $items.Add([pscustomobject]@{ Full = $full; Rel = $rel }) }

# THE SEATS, not every session. Each seat folder also holds hundreds of one-shot background runs
# (entrypoint sdk-cli, started by hooks) - on the desktop 1,543 in the chair's folder alone. Those are
# not seats and are left behind unless -All is passed. A seat is: the three fixed ids (main.rs:5512,
# :5642, :5652), every id lettered in letters.json, and every pane in panes.json.
$seats = @{}
foreach ($id in '0c0c0c0a-0000-4000-8000-000000000a01', '0c0c0c0b-0000-4000-8000-00000000115b', '3d000000-0000-4000-8000-000000003d00') { $seats[$id] = $true }
try { (Get-Content -LiteralPath (Join-Path $data 'letters.json') -Raw | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $seats[$_.Name] = $true } } catch { }
try { Get-Content -LiteralPath (Join-Path $data 'panes.json') -Raw | ConvertFrom-Json | ForEach-Object { if ($_.pane) { $seats[$_.pane] = $true } } } catch { }
function Is-Seat($name) { $id = ($name -split '\.')[0]; return $All -or $seats.ContainsKey($id) }
$skipped = 0; $skippedBytes = 0

$proj = Join-Path $env:USERPROFILE '.claude\projects'
Get-ChildItem -LiteralPath $proj -Directory | Where-Object { $_.Name -like '*instances*' } | ForEach-Object {
    $d = $_
    Get-ChildItem -LiteralPath $d.FullName -File -Filter '*.jsonl' | ForEach-Object {
        if (Is-Seat $_.Name) { Add-Src $_.FullName ('projects/' + $d.Name + '/' + $_.Name) } else { $script:skipped++; $script:skippedBytes += $_.Length }
    }
}
$attic = Join-Path $env:USERPROFILE '.claude\consonance-attic'
if (Test-Path -LiteralPath $attic) {
    Get-ChildItem -LiteralPath $attic -Recurse -File -Filter '*.jsonl' | ForEach-Object {
        if (Is-Seat $_.Name) { Add-Src $_.FullName ('consonance-attic/' + $_.FullName.Substring($attic.Length + 1).Replace('\', '/')) } else { $script:skipped++; $script:skippedBytes += $_.Length }
    }
}
foreach ($f in 'panes.json', 'letters.json') { $p = Join-Path $data $f; if (Test-Path -LiteralPath $p) { Add-Src $p "data/$f" } }
$cap = Join-Path $data 'captures'
if (Test-Path -LiteralPath $cap) { Get-ChildItem -LiteralPath $cap -File -Filter '*.txt' | ForEach-Object { Add-Src $_.FullName ('data/captures/' + $_.Name) } }
$tp = Join-Path $Repo 'exo_memory\third_place'
if (Test-Path -LiteralPath $tp) {
    Get-ChildItem -LiteralPath $tp -Recurse -File | ForEach-Object { Add-Src $_.FullName ('third_place/' + $_.FullName.Substring($tp.Length + 1).Replace('\', '/')) }
}
if ($items.Count -eq 0) { Say 'Found nothing to carry. Nothing was changed.' 'Red'; exit 1 }

# ---- 3. show it ----------------------------------------------------------------------------------
$total = 0
Say ''
Say ('{0,12}  {1,-26}  {2}' -f 'bytes', 'first timestamp', 'what')
foreach ($it in $items) {
    $len = (Get-Item -LiteralPath $it.Full).Length; $total += $len
    $ts = if ($it.Rel -like '*.jsonl') { FirstTs $it.Full } else { '' }
    Say ('{0,12:N0}  {1,-26}  {2}' -f $len, $ts, $it.Rel)
}
Say ''
Say ('{0} files, {1:N1} MB before packing.' -f $items.Count, ($total / 1MB)) 'Cyan'
if ($skipped) { Say ('Left behind: {0} one-shot background sessions, {1:N1} MB (not seats; pass -All to carry them too).' -f $skipped, ($skippedBytes / 1MB)) }
Say 'The conversations to bring are the ones whose first timestamp is OLDEST - that is the original lineage.'
if (-not $Apply) {
    Say ''
    Say 'DRY RUN - nothing was packed or pushed. Run again with -Apply to send all of the above to the desktop.' 'Yellow'
    exit 0
}

# ---- 4. pack: snapshot, hash the snapshot, gzip, split -------------------------------------------
# Refuse while Consonance runs: a seat writing its transcript mid-copy is a torn file.
if (-not $IgnoreRunning -and (Get-Process -Name consonance -ErrorAction SilentlyContinue)) {
    Say 'Consonance is running on this machine. Close it first, then run this again. Nothing was changed.' 'Red'
    exit 1
}
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$branch = "transport/L-$stamp"
$work = Join-Path $env:TEMP "l2d-$stamp"
New-Item -ItemType Directory -Path $work | Out-Null
$PART = $PartBytes
$manifest = New-Object System.Collections.Generic.List[string]
$manifest.Add("rel`tsize`tsha256`tparts`tsource")
$blobs = New-Object System.Collections.Generic.List[object]
$packed = 0
$i = 0
try {
    foreach ($it in $items) {
        $i++
        $snap = Join-Path $work ('s{0:D3}' -f $i)
        Copy-Item -LiteralPath $it.Full -Destination $snap
        $size = (Get-Item -LiteralPath $snap).Length
        $sha = Sha $snap
        $gz = Join-Path $work ('f{0:D3}.gz' -f $i)
        $in = [IO.File]::OpenRead($snap)
        try {
            $out = [IO.File]::Create($gz)
            try {
                $z = New-Object IO.Compression.GZipStream($out, [IO.Compression.CompressionLevel]::Optimal)
                try { $in.CopyTo($z) } finally { $z.Dispose() }
            } finally { $out.Dispose() }
        } finally { $in.Dispose() }
        Remove-Item -LiteralPath $snap
        $parts = @()
        if ((Get-Item -LiteralPath $gz).Length -le $PART) { $parts += $gz }
        else {
            $fs = [IO.File]::OpenRead($gz); $buf = New-Object byte[] (4MB); $n = 0
            try {
                while ($fs.Position -lt $fs.Length) {
                    $pn = '{0}.part{1:D2}' -f $gz, $n
                    $o = [IO.File]::Create($pn)
                    try {
                        $w = 0
                        while ($w -lt $PART) {
                            $r = $fs.Read($buf, 0, [Math]::Min($buf.Length, $PART - $w))
                            if ($r -le 0) { break }
                            $o.Write($buf, 0, $r); $w += $r
                        }
                    } finally { $o.Dispose() }
                    $parts += $pn; $n++
                }
            } finally { $fs.Dispose() }
            Remove-Item -LiteralPath $gz
        }
        $names = @()
        foreach ($p in $parts) {
            $leaf = Split-Path $p -Leaf
            $bsha = (git -C $Repo hash-object -w --no-filters -- $p).Trim()   # raw bytes: no eol conversion (the 09-09 .bin lesson)
            if ($LASTEXITCODE -ne 0) { throw "git hash-object failed for $leaf" }
            $blobs.Add([pscustomobject]@{ Sha = $bsha; Path = "payload/$leaf" })
            $packed += (Get-Item -LiteralPath $p).Length
            $names += $leaf
        }
        $manifest.Add("$($it.Rel)`t$size`t$sha`t$($names -join ',')`t$($it.Full)")
        Say ('  packed {0}/{1}  {2}' -f $i, $items.Count, $it.Rel)
    }

    $mf = Join-Path $work 'MANIFEST.tsv'
    [IO.File]::WriteAllText($mf, (($manifest -join "`n") + "`n"), (New-Object Text.UTF8Encoding $false))
    $msha = (git -C $Repo hash-object -w --no-filters -- $mf).Trim()
    $blobs.Add([pscustomobject]@{ Sha = $msha; Path = 'MANIFEST.tsv' })

    # ---- 5. one commit with no parent, built with a private index, pushed by hash ----------------
    $env:GIT_INDEX_FILE = Join-Path $work 'index'
    try {
        foreach ($b in $blobs) {
            git -C $Repo update-index --add --cacheinfo "100644,$($b.Sha),$($b.Path)"
            if ($LASTEXITCODE -ne 0) { throw "git update-index failed for $($b.Path)" }
        }
        $tree = (git -C $Repo write-tree).Trim()
        if ($LASTEXITCODE -ne 0) { throw 'git write-tree failed' }
    } finally { Remove-Item Env:\GIT_INDEX_FILE }
    $commit = (git -C $Repo commit-tree $tree -m "transport: the laptop's Consonance seats, packed on L at $stamp, for the desktop" -m "$($items.Count) files, MANIFEST.tsv holds each file's original size and sha256. Script: dev/migrate/laptop-to-desktop.ps1 (written by the librarian seat, run by the keeper).").Trim()
    if ($LASTEXITCODE -ne 0) { throw 'git commit-tree failed' }
    Say ''
    Say "pushing $branch ($('{0:N1}' -f ($packed / 1MB)) MB packed) ..." 'Cyan'
    git -C $Repo push origin "$($commit):refs/heads/$branch"
    if ($LASTEXITCODE -ne 0) { throw 'git push failed' }
    $remote = ((git -C $Repo ls-remote origin "refs/heads/$branch") -split "`t")[0]
    if ($remote -ne $commit) { throw "the branch on the remote ($remote) is not the commit that was built ($commit)" }
} finally {
    if (Test-Path -LiteralPath $work) { Remove-Item -LiteralPath $work -Recurse -Force }
}

Say ''
Say "SENT. Branch $branch, commit $commit, $($items.Count) files." 'Green'
Say 'Nothing on this laptop was moved, changed or deleted.'
Say "On the desktop, tell the librarian: $branch"
