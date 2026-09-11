# desktop-place.ps1 - RUN ON THE DESKTOP (machine D), in plain PowerShell, with Consonance CLOSED.
# The third step, after laptop-to-desktop.ps1 (on L) and desktop-receive.ps1 (on D).
#
# Written by the librarian seat on the desktop, 2026-09-11, at the keeper's ask: every laptop seat
# comes here and lives here. This places the laptop's conversations at the exact paths Consonance
# resumes from, so each seat opens as the laptop's own conversation at its last turn.
#
# DRY RUN BY DEFAULT: prints every move and every placement, changes nothing. Pass -Apply to do it.
#
# What -Apply does, in order:
#   1. refuses if Consonance is running, or if the state repo's head was not pushed by THIS machine
#      (a foreign head makes the next launch MIGRATE, which would retire what was just placed)
#   2. for every seat: chooses the laptop's ORIGINAL lineage (oldest first timestamp among the
#      laptop's copies of that seat - which is right whether or not the laptop's own launch had
#      already moved it to its attic), moves this machine's current file for that seat to
#      ~/.claude/consonance-attic/<slug>/<sid>.<stamp>-D.jsonl (stamped, never overwritten), and
#      places the laptop's file at ~/.claude/projects/<slug>/<sid>.jsonl
#   3. the laptop's other copies go to ~/.claude/consonance-attic-L/ (kept, not live)
#   4. creates each seat's working folder if missing (a missing cwd rehomes a pane silently)
#   5. panes.json, letters.json, capture tails: this machine's copies to C:\Consonance\backups\
#      pre-L-<stamp>\ first, then the laptop's placed
#   6. the Third Place's written record into <repo>\exo_memory\third_place\ (existing files backed up)
#   7. re-checks every placed file against the laptop's own sha256 from MANIFEST.tsv
#
# Nothing is deleted. The tailer's offsets are left alone on purpose: a replaced transcript is re-read
# from the top and de-duplicated at push, which is the direction the code chooses (main.rs:1600).
#
# ASCII only on purpose: Windows PowerShell 5.1 misreads non-ASCII in scripts without a BOM.

param(
    [Parameter(Mandatory = $true)] [string]$Staged,   # the folder desktop-receive.ps1 wrote (holds files\ and MANIFEST.tsv)
    [switch]$Apply,
    [string]$Repo = "$env:USERPROFILE\Desktop\lighthouse",
    [string]$DataDir = 'C:\Consonance\data',
    [string]$StateDir = 'C:\Consonance\state',
    [string]$ThisMachine = 'D',
    [switch]$IgnoreRunning,                            # testing only
    [string]$HomeRoot = $env:USERPROFILE               # testing only: place under a fake home
)

$ErrorActionPreference = 'Stop'
function Say($m, $c = 'Gray') { Write-Host $m -ForegroundColor $c }
function Sha($p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLower() }
function Ts($p, [switch]$Last) {
    try {
        if ($Last) {
            $fs = [IO.File]::Open($p, 'Open', 'Read', 'ReadWrite')
            try { $n = [Math]::Min($fs.Length, 262144); $fs.Seek(-$n, 'End') | Out-Null; $b = New-Object byte[] $n; [void]$fs.Read($b, 0, $n) } finally { $fs.Dispose() }
            $m = [regex]::Matches([Text.Encoding]::UTF8.GetString($b), '"timestamp":"([^"]+)"')
            if ($m.Count) { return $m[$m.Count - 1].Groups[1].Value }
        } else {
            $sr = New-Object IO.StreamReader($p)
            try { for ($k = 0; $k -lt 60 -and -not $sr.EndOfStream; $k++) { if ($sr.ReadLine() -match '"timestamp":"([^"]+)"') { return $Matches[1] } } } finally { $sr.Dispose() }
        }
    } catch { }
    return ''
}

$files = Join-Path $Staged 'files'
$mfPath = Join-Path $Staged 'MANIFEST.tsv'
if (-not (Test-Path -LiteralPath $files) -or -not (Test-Path -LiteralPath $mfPath)) { Say "No files\ or MANIFEST.tsv under $Staged. Run desktop-receive.ps1 first. Nothing was changed." 'Red'; exit 1 }
$want = @{}
Get-Content -LiteralPath $mfPath | Select-Object -Skip 1 | Where-Object { $_ } | ForEach-Object { $c = $_ -split "`t"; $want[$c[0]] = $c[2] }

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$claude = Join-Path $HomeRoot '.claude'
$plan = New-Object System.Collections.Generic.List[object]   # Kind, Src, Dst, Rel
function Plan($kind, $src, $dst, $rel) { $plan.Add([pscustomobject]@{ Kind = $kind; Src = $src; Dst = $dst; Rel = $rel }) }

# ---- the seats: group every laptop copy by (slug, sid), pick the original lineage --------------
$cands = @()
foreach ($top in 'projects', 'consonance-attic') {
    $d = Join-Path $files $top
    if (-not (Test-Path -LiteralPath $d)) { continue }
    Get-ChildItem -LiteralPath $d -Recurse -File -Filter '*.jsonl' | ForEach-Object {
        $rel = $_.FullName.Substring($files.Length + 1).Replace('\', '/')
        $cands += [pscustomobject]@{ Src = $_.FullName; Rel = $rel; Slug = $_.Directory.Name; Sid = ($_.Name -split '\.')[0]; First = (Ts $_.FullName); LastTs = (Ts $_.FullName -Last); Size = $_.Length }
    }
}
Say ''
Say 'SEATS - the laptop lineage that goes live, per seat' 'Cyan'
foreach ($g in ($cands | Group-Object Slug, Sid)) {
    $live = $g.Group | Where-Object { $_.First } | Sort-Object First | Select-Object -First 1
    if (-not $live) { $live = $g.Group | Select-Object -First 1 }
    $dst = Join-Path $claude ("projects\{0}\{1}.jsonl" -f $live.Slug, $live.Sid)
    if (Test-Path -LiteralPath $dst) {
        $mine = Get-Item -LiteralPath $dst
        Plan 'retire-D' $dst (Join-Path $claude ("consonance-attic\{0}\{1}.{2}-D.jsonl" -f $live.Slug, $live.Sid, $stamp)) ''
        Say ('  {0}/{1}: this machine''s copy ({2:N0} B, from {3}) -> attic' -f $live.Slug, $live.Sid, $mine.Length, (Ts $dst))
    }
    Plan 'place' $live.Src $dst $live.Rel
    Say ('  {0}/{1}: LIVE <- laptop {2}  ({3:N0} B, {4} .. {5})' -f $live.Slug, $live.Sid, $live.Rel, $live.Size, $live.First, $live.LastTs) 'Green'
    foreach ($o in ($g.Group | Where-Object { $_.Src -ne $live.Src })) {
        Plan 'keep-L' $o.Src (Join-Path $claude ('consonance-attic-L\' + $o.Rel.Replace('/', '\'))) $o.Rel
        Say ('      also kept, not live: {0} ({1} ..)' -f $o.Rel, $o.First)
    }
    if ($live.Slug -like 'C--Consonance-instances-*') {
        $cwd = 'C:\Consonance\instances\' + $live.Slug.Substring('C--Consonance-instances-'.Length)
        if (-not (Test-Path -LiteralPath $cwd)) { Plan 'mkdir' '' $cwd ''; Say "      working folder missing, will create: $cwd" 'Yellow' }
    }
}

# ---- roster, capture tails, the Third Place's record ------------------------------------------
$bk = "C:\Consonance\backups\pre-L-$stamp"
foreach ($f in 'panes.json', 'letters.json') {
    $s = Join-Path $files "data\$f"
    if (Test-Path -LiteralPath $s) { $d = Join-Path $DataDir $f; if (Test-Path -LiteralPath $d) { Plan 'backup' $d (Join-Path $bk $f) '' }; Plan 'place' $s $d "data/$f" }
}
$capS = Join-Path $files 'data\captures'
if (Test-Path -LiteralPath $capS) {
    Get-ChildItem -LiteralPath $capS -File | ForEach-Object {
        $d = Join-Path $DataDir ('captures\' + $_.Name)
        if (Test-Path -LiteralPath $d) { Plan 'backup' $d (Join-Path $bk ('captures\' + $_.Name)) '' }
        Plan 'place' $_.FullName $d ('data/captures/' + $_.Name)
    }
}
$tpS = Join-Path $files 'third_place'
if (Test-Path -LiteralPath $tpS) {
    Get-ChildItem -LiteralPath $tpS -Recurse -File | ForEach-Object {
        $sub = $_.FullName.Substring($tpS.Length + 1)
        $d = Join-Path $Repo ('exo_memory\third_place\' + $sub)
        if (Test-Path -LiteralPath $d) { Plan 'backup' $d (Join-Path $bk ('third_place\' + $sub)) '' }
        Plan 'place' $_.FullName $d ('third_place/' + $sub.Replace('\', '/'))
    }
}
$n = @($plan | Where-Object Kind -eq 'place').Count
Say ''
Say ("{0} files to place, {1} of this machine's files moved aside first (backups: {2})" -f $n, @($plan | Where-Object { $_.Kind -in 'retire-D', 'backup' }).Count, $bk) 'Cyan'

# ---- the state head decides what the next launch does -------------------------------------------
$head = (git -C $StateDir log -1 --format=%s origin/main 2>$null)
$headOk = $head -match "^state: $ThisMachine "
Say ("state head: {0}  -> next launch {1}" -f $head, $(if ($headOk) { 'RESUMES (this machine authored it)' } else { 'would MIGRATE and retire what is placed' })) $(if ($headOk) { 'Green' } else { 'Red' })

if (-not $Apply) { Say ''; Say 'DRY RUN - nothing was changed. Close Consonance, then run again with -Apply.' 'Yellow'; exit 0 }

if (-not $IgnoreRunning -and (Get-Process -Name consonance -ErrorAction SilentlyContinue)) { Say 'Consonance is running. Close it first. Nothing was changed.' 'Red'; exit 1 }
if (-not $headOk) { Say "The state head was not pushed by $ThisMachine, so the next launch would MIGRATE and retire the placed seats. Nothing was changed." 'Red'; exit 1 }

# ---- pre-flight: every file this will move must be free BEFORE anything moves ----------------------
# When Consonance closes, its seats' claude processes can hold their transcripts open for a few seconds.
# A move that fails half-way would leave one seat moved and another not, so wait until every source is
# free (up to 90 s), and change nothing if one never frees.
function Is-Free($f) { try { $h = [IO.File]::Open($f, 'Open', 'ReadWrite', 'None'); $h.Dispose(); return $true } catch { return $false } }
# A seat only opens its transcript for the instant it writes, so a free file does NOT prove the seat is
# gone (measured 2026-09-11: the live librarian's transcript read free with the seat running). The real
# guard is the seat process itself: claude.exe --resume <sid>, a child of consonance.exe.
$sidList = @($plan | Where-Object { $_.Kind -eq 'place' -and $_.Rel -like '*.jsonl' } | ForEach-Object { (Split-Path $_.Dst -Leaf) -replace '\.jsonl$', '' } | Sort-Object -Unique)
function Seat-Procs { @(Get-CimInstance Win32_Process -Filter "Name='claude.exe'" | Where-Object { $cl = [string]$_.CommandLine; @($sidList | Where-Object { $cl.Contains($_) }).Count -gt 0 } | ForEach-Object { "claude.exe pid $($_.ProcessId)" }) }
$busy = @()
for ($try = 0; $try -lt 90; $try++) {
    $busy = @(Seat-Procs) + @($plan | Where-Object { $_.Kind -eq 'retire-D' -and -not (Is-Free $_.Src) } | ForEach-Object { $_.Src })
    if ($busy.Count -eq 0) { break }
    if ($try -eq 0) { Say 'Waiting for the seats to let go of their files...' 'Yellow' }
    Start-Sleep -Seconds 1
}
if ($busy.Count) { Say ("Still in use after 90 s, so nothing was changed: {0}" -f ($busy -join ', ')) 'Red'; exit 1 }
# ---- apply: every move first, then every placement, then verify ---------------------------------
foreach ($p in ($plan | Where-Object { $_.Kind -eq 'mkdir' })) { New-Item -ItemType Directory -Force -Path $p.Dst | Out-Null }
foreach ($p in ($plan | Where-Object { $_.Kind -in 'retire-D', 'backup' })) {
    if (Test-Path -LiteralPath $p.Dst) { throw "refusing to overwrite $($p.Dst)" }
    New-Item -ItemType Directory -Force -Path (Split-Path $p.Dst) | Out-Null
    if ($p.Kind -eq 'retire-D') { Move-Item -LiteralPath $p.Src -Destination $p.Dst } else { Copy-Item -LiteralPath $p.Src -Destination $p.Dst }
}
foreach ($p in ($plan | Where-Object { $_.Kind -in 'place', 'keep-L' })) {
    New-Item -ItemType Directory -Force -Path (Split-Path $p.Dst) | Out-Null
    Copy-Item -LiteralPath $p.Src -Destination $p.Dst -Force
}
$bad = 0
foreach ($p in ($plan | Where-Object { $_.Kind -in 'place', 'keep-L' })) {
    if ($want.ContainsKey($p.Rel) -and (Sha $p.Dst) -ne $want[$p.Rel]) { $bad++; Say "  MISMATCH after placing: $($p.Dst)" 'Red' }
}
Say ''
if ($bad) { Say "$bad placed files do not match the laptop's bytes. Do NOT launch; everything moved aside is in the attic and $bk." 'Red'; exit 1 }
Say "PLACED. $n files, every one matching the laptop's own sha256." 'Green'
Say "This machine's previous seats are in $claude\consonance-attic (stamped -D) and $bk."
Say 'Launch Consonance now. Each seat should open on the laptop''s last exchange.'
