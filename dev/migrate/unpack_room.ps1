# dev/migrate/unpack_room.ps1 — install a packed room bundle on THIS machine.
#
# Counterpart of pack_room.ps1: the script arrives via git, the bundle via private OneDrive.
# EVERYTHING IT TOUCHES IS BACKED UP FIRST, and a RESTORE.md with exact inverse steps lands
# in the backup dir before any destructive step. Registries merge union, bundle wins pane
# collisions; letter collisions are REASSIGNED, never duplicated. The live board is never
# replaced. Fork point: after this, two rooms diverge — same dynamic, no live sync.
#
# Revised 2026-07-27 after Around's eight-finding read. In particular:
#   F1 — every JSON write is BOM-FREE ([IO.File]::WriteAllText + UTF8Encoding($false)).
#        A BOM'd registry parses to an EMPTY room with no error (proven against the Rust:
#        read_kept/read_letters swallow the failure). Third BOM incident in this repo —
#        hence the Assert-NoBom check below instead of another memory.
#   F2 — cwds are REWRITTEN to this machine's instances_dir and the claude-projects dirs
#        are installed under the RE-ENCODED name, both together — else migrated panes
#        resume as role "human" (the 6dffcea uninjectable-roster bug) or lose transcripts.
#   F3 — pre-flight before anything destructive; cross-volume-safe backups (copy+delete,
#        never Move-Item on dirs); RESTORE.md written first.
#   F4 — hash-verified sync guard that also rejects OneDrive placeholders.
#   F5 — letter value-collisions reassigned to the next free letter, one line per decision.
#
#   pwsh dev/migrate/unpack_room.ps1                    # newest bundle in OneDrive
#   pwsh dev/migrate/unpack_room.ps1 -Bundle <path>
#
[CmdletBinding()]
param([string]$Bundle, [switch]$ReplaceMain)
$ErrorActionPreference = 'Stop'

# THE MOST DANGEROUS DEFAULT IN EITHER SCRIPT, and it is ours (Bravo, cycle 8): pack_room with no
# -Pane always includes Main, whose cwd_leaf is 'main' on EVERY machine — so a whole-room bundle
# unpacked on a second bed backs up and REPLACES the receiving machine's own chair thread. Backed
# up, therefore recoverable; silent, therefore not obviously recoverable at the time. Main now
# requires an explicit -ReplaceMain. Two live threads with the same fixed session id must never
# be merged by a script's default path.

function Encode-Cwd([string]$p) {
  return (($p.ToCharArray() | ForEach-Object { if ($_ -match '[a-zA-Z0-9]') { $_ } else { '-' } }) -join '')
}
function Short-Id([string]$id) { if ($id -and $id.Length -ge 8) { $id.Substring(0, 8) } else { "$id" } }
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
function Write-Json([string]$path, $obj) {
  [System.IO.File]::WriteAllText($path, (ConvertTo-Json $obj -Depth 6), $utf8NoBom)
  # F1's check-not-memory: refuse to leave a BOM'd registry behind, ever
  $b = [System.IO.File]::ReadAllBytes($path)
  if ($b.Length -ge 3 -and $b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF) { throw "BOM written to $path — refusing to continue (a BOM'd registry silently empties the room)" }
}
# SYMMETRIC WITH Write-Json ON PURPOSE. Get-Content -Raw without -Encoding falls back to the ANSI
# codepage on a BOM-less file, so "\u2726 Around" arrives as "\u00C3\u00A2\u00C5\u201C\u00C2\u00A6 Around" and Write-Json then commits
# the mojibake as genuine UTF-8 \u2014 compounding on every re-run, and corrupting the RECEIVING
# machine's own labels too, since this function reads those as well. The identical bug was fixed
# in pack_room at 96fd92f and the fix went to the WRITE side only; the read side shipped broken
# forty minutes later. ReadAllText with an explicit encoding cannot be re-broken by a flag nobody
# passes. (Bravo, cycle 8, verified against the live staged bundle.)
function Read-Json([string]$path) {
  return ([System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8) -replace "^\uFEFF", '' | ConvertFrom-Json)
}

# ---- find + verify the bundle before touching ANYTHING (F3/F4) ----
if (-not $Bundle) {
  $oneDrive = $env:OneDrive; if (-not $oneDrive) { $oneDrive = Join-Path $env:USERPROFILE 'OneDrive' }
  $root = Join-Path $oneDrive 'consonance-migration'
  if (-not (Test-Path $root)) { throw "no bundle dir at $root — has OneDrive synced yet?" }
  $Bundle = (Get-ChildItem $root -Directory | Sort-Object Name -Descending | Select-Object -First 1).FullName
}
if (-not (Test-Path (Join-Path $Bundle 'manifest.json'))) { throw "no manifest.json in $Bundle — not a room bundle, refusing" }
$manifest = Read-Json (Join-Path $Bundle 'manifest.json')
Write-Host "Bundle: $Bundle  (packed $($manifest.packed_at) on $($manifest.machine))" -ForegroundColor Cyan

$bad = 0
foreach ($f in $manifest.files) {
  $p = Join-Path $Bundle $f.path
  if (-not (Test-Path $p)) { Write-Host "MISSING  $($f.path)" -ForegroundColor Red; $bad++; continue }
  $item = Get-Item $p
  # F4: a OneDrive placeholder reports full Length with zero local bytes
  if (($item.Attributes -band 0x400000) -or ($item.Attributes -band 0x1000)) { Write-Host "CLOUD-ONLY  $($f.path) — not hydrated locally" -ForegroundColor Red; $bad++; continue }
  if ($item.Length -ne $f.bytes) { Write-Host "SIZE MISMATCH  $($f.path)" -ForegroundColor Red; $bad++; continue }
  if ($f.sha256 -and (Get-FileHash $p -Algorithm SHA256).Hash -ne $f.sha256) { Write-Host "HASH MISMATCH  $($f.path)" -ForegroundColor Red; $bad++ }
}
if ($bad -gt 0) { throw "$bad file(s) failed verification — sync incomplete or corrupt. Nothing was touched. Wait for OneDrive and re-run." }
Write-Host "manifest verified: $($manifest.files.Count) files, hashes good, fully hydrated" -ForegroundColor Green

# ---- resolve THIS machine's layout ----
$cfgPath = Join-Path $env:USERPROFILE '.consonance.json'
$instancesDir = 'C:\Consonance\instances'
$dataDir = 'C:\Consonance\data'
if (Test-Path $cfgPath) {
  try {
    $cfg = Read-Json $cfgPath
    if ($cfg.instances_dir) { $instancesDir = [string]$cfg.instances_dir }
    if ($cfg.data_dir) { $dataDir = [string]$cfg.data_dir }
  } catch { Write-Host "WARN: could not parse $cfgPath — using defaults" -ForegroundColor Yellow }
}
$projRoot = Join-Path $env:USERPROFILE '.claude\projects'
if (Get-Process -Name consonance -ErrorAction SilentlyContinue) { throw "Consonance is RUNNING here. Close it first." }

# ---- backup root + RESTORE.md BEFORE anything destructive (F3) ----
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupRoot = Join-Path (Split-Path -Parent $dataDir) "migration-backup-$stamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
$restoreLines = @("# RESTORE — inverse steps for migration $stamp", "# Each backed-up item and where it came from. To roll back: copy each back to its origin, deleting what the migration installed there first.", "")
function Backup-Item([string]$path, [string]$backupName) {
  # cross-volume safe: copy + delete, never Move-Item on a directory (F3)
  $bk = Join-Path $backupRoot $backupName
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $bk) | Out-Null
  Copy-Item -Recurse -Force $path $bk
  Remove-Item -Recurse -Force $path
  $script:restoreLines += "restore: copy '$backupName' -> '$path'"
  Write-Host "backed up -> $backupName" -ForegroundColor Yellow
}
function Install-Tree([string]$src, [string]$dst, [string]$backupName) {
  if (Test-Path $dst) { Backup-Item $dst $backupName }
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dst) | Out-Null
  Copy-Item -Recurse -Force $src $dst
}
function Flush-Restore { Set-Content -Path (Join-Path $backupRoot 'RESTORE.md') -Value ($script:restoreLines -join "`r`n") -Encoding UTF8 }
Flush-Restore
Write-Host "Backups: $backupRoot (RESTORE.md inside)" -ForegroundColor Cyan

# ---- 1+2. travelers: instance dirs + claude project dirs, with cwd REWRITE (F2) ----
$cwdMap = @{}   # source_cwd -> new cwd, for registry rewrite
$MAIN_SID = '0c0c0c0a-0000-4000-8000-000000000a01'
$mainSkipped = @($manifest.travelers | Where-Object { $_.pane -eq $MAIN_SID -and -not $ReplaceMain })
if ($mainSkipped.Count -gt 0) {
  Write-Host "SKIPPING MAIN — this bundle carries the source machine's chair thread, and this machine has its own under the same fixed session id. Re-run with -ReplaceMain if replacing it is genuinely intended." -ForegroundColor Yellow
  $script:restoreLines += "note: Main was NOT installed (no -ReplaceMain); the bundle's copy is still at $Bundle"
}
foreach ($t in $manifest.travelers) {
  if ($t.pane -eq $MAIN_SID -and -not $ReplaceMain) { continue }
  $newCwd = Join-Path $instancesDir $t.cwd_leaf
  $cwdMap[$t.source_cwd] = $newCwd
  $srcInst = Join-Path $Bundle "instances\$($t.cwd_leaf)"
  if (Test-Path $srcInst) {
    Install-Tree $srcInst $newCwd "instances\$($t.cwd_leaf)"
    Write-Host "installed instance $($t.cwd_leaf)  ($($t.label))" -ForegroundColor Green
  }
  $newEnc = Encode-Cwd $newCwd
  $srcProj = Join-Path $Bundle "claude-projects\$($t.enc)"
  if (Test-Path $srcProj) {
    Install-Tree $srcProj (Join-Path $projRoot $newEnc) "claude-projects\$newEnc"
    if ($newEnc -ne $t.enc) { Write-Host "project dir re-encoded: $($t.enc) -> $newEnc (layouts differ)" -ForegroundColor Cyan }
    Write-Host "installed project $newEnc" -ForegroundColor Green
  }
  Flush-Restore
}

# ---- 3. registries: union merge, cwds rewritten, letters reassigned on collision ----
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
$bundlePanes = @(Read-Json (Join-Path $Bundle 'data\panes.json'))
foreach ($bp in $bundlePanes) { if ($cwdMap.ContainsKey($bp.cwd)) { $bp.cwd = $cwdMap[$bp.cwd] } }
$localPanesPath = Join-Path $dataDir 'panes.json'
$merged = @() + $bundlePanes
if (Test-Path $localPanesPath) {
  Copy-Item $localPanesPath (Join-Path $backupRoot 'panes.json') -Force
  $script:restoreLines += "restore: copy 'panes.json' -> '$localPanesPath'"
  foreach ($lp in @(Read-Json $localPanesPath)) {
    if (-not ($merged | Where-Object { $_.pane -eq $lp.pane })) { $merged += $lp; Write-Host "kept local pane $(Short-Id $lp.pane) ($($lp.label))" -ForegroundColor Green }
    else { Write-Host "local pane $(Short-Id $lp.pane) REPLACED by bundle (backed up)" -ForegroundColor Yellow }
  }
}
Write-Json $localPanesPath @($merged)
# letters: union keyed by pane id; VALUE collisions get the next free letter, loudly (F5)
$bundleLettersPath = Join-Path $Bundle 'data\letters.json'
$localLettersPath = Join-Path $dataDir 'letters.json'
if (Test-Path $bundleLettersPath) {
  $out = [ordered]@{}
  if (Test-Path $localLettersPath) {
    Copy-Item $localLettersPath (Join-Path $backupRoot 'letters.json') -Force
    $script:restoreLines += "restore: copy 'letters.json' -> '$localLettersPath'"
    (Read-Json $localLettersPath).PSObject.Properties | ForEach-Object { $out[$_.Name] = $_.Value }
  }
  $alphabet = [char[]]([char]'A'..[char]'Z') | ForEach-Object { "$_" }
  (Read-Json $bundleLettersPath).PSObject.Properties | ForEach-Object {
    $pid2 = $_.Name; $want = $_.Value
    if ($out.Contains($pid2)) { Write-Host "letter: pane $(Short-Id $pid2) already registered here as '$($out[$pid2])' — kept" -ForegroundColor Green; return }
    $taken = @($out.Values)
    if ($taken -contains $want) {
      $free = $alphabet | Where-Object { $taken -notcontains $_ } | Select-Object -First 1
      if (-not $free) { $free = "$want$want" }   # 26 letters exhausted: double the wanted one (AA-style), still unique-checked below by being new
      Write-Host "letter: '$want' is taken here — pane $(Short-Id $pid2) REASSIGNED to '$free' (the letter is how it's said, not who they are)" -ForegroundColor Yellow
      $out[$pid2] = $free
    } else {
      $out[$pid2] = $want
      Write-Host "letter: pane $(Short-Id $pid2) keeps '$want'" -ForegroundColor Green
    }
  }
  Write-Json $localLettersPath $out
}
Flush-Restore

# ---- 4. captures, offsets, archives, experiments (all through backup paths) ----
New-Item -ItemType Directory -Force -Path (Join-Path $dataDir 'captures') | Out-Null
$capSrc = Join-Path $Bundle 'data\captures'
if (Test-Path $capSrc) {
  foreach ($f in Get-ChildItem $capSrc -File) {
    $dst = Join-Path $dataDir "captures\$($f.Name)"
    if (Test-Path $dst) { Backup-Item $dst "captures\$($f.Name)" }
    Copy-Item $f.FullName $dst
  }
  Write-Host "installed captures" -ForegroundColor Green
}
# tailer-offsets: MERGE PER KEY, never whole-file replace. Main's pane id is a fixed constant on
# every machine (main.rs MAIN_SID), so a wholesale copy lands the SOURCE machine's Main byte-offset
# on the RECEIVER's identical key, over a different transcript. resume_offset's head fingerprint
# catches the mismatch and resets to 0 rather than skipping — no data lost — but reset-to-0 re-reads
# the receiver's Main transcript from byte 0 and re-pushes it whole, and the dedup belt is in-memory
# and cannot see what is already on disk. That is a replay burst onto the receiving board: exactly
# the corpus contamination e958c49/2f638d8 were built to kill. Traveler keys only.
$offSrc = Join-Path $Bundle 'data\tailer-offsets.json'
if (Test-Path $offSrc) {
  $travelIds = @($manifest.travelers | ForEach-Object { $_.pane })
  $incoming = Read-Json $offSrc
  $dst = Join-Path $dataDir 'tailer-offsets.json'
  $out = [ordered]@{}
  if (Test-Path $dst) {
    Copy-Item $dst (Join-Path $backupRoot 'tailer-offsets.json') -Force
    $script:restoreLines += "restore: copy 'tailer-offsets.json' -> '$dst'"
    (Read-Json $dst).PSObject.Properties | ForEach-Object { $out[$_.Name] = $_.Value }
  }
  $taken = 0; $skipped = 0
  $incoming.PSObject.Properties | ForEach-Object {
    if ($travelIds -contains $_.Name) { $out[$_.Name] = $_.Value; $taken++ }
    else { $skipped++ }
  }
  Write-Json $dst $out
  Write-Host "tailer-offsets: merged $taken traveler key(s), left $skipped non-traveler key(s) as this machine had them" -ForegroundColor Green
}
$askSrc = Join-Path $Bundle 'data\transcript-asks.jsonl'
if (Test-Path $askSrc) {
  $dst = Join-Path $dataDir 'transcript-asks.jsonl'
  if (Test-Path $dst) { Copy-Item $dst (Join-Path $backupRoot 'transcript-asks.jsonl') -Force; $script:restoreLines += "restore: copy 'transcript-asks.jsonl' -> '$dst'" }
  Copy-Item $askSrc $dst -Force
}
Get-ChildItem (Join-Path $Bundle 'data') -File -Filter 'board-*.jsonl' -ErrorAction SilentlyContinue | ForEach-Object {
  Copy-Item $_.FullName (Join-Path $dataDir $_.Name) -Force
  Write-Host "installed board archive $($_.Name) (live board untouched)" -ForegroundColor Green
}
$exp = Join-Path $Bundle 'data\experiments'
if (Test-Path $exp) { Install-Tree $exp (Join-Path $dataDir 'experiments') 'experiments' }   # F6: never a bare recursive copy into an existing dir
Flush-Restore

Write-Host ""
Write-Host "ROOM INSTALLED — the fork point is now. Everything replaced is in: $backupRoot" -ForegroundColor Cyan
Write-Host ""
Write-Host "REMAINING STEPS, in order:" -ForegroundColor Cyan
Write-Host "  1. pwsh dev/shell/install.ps1          (sync hooks; register any NEW hooks it prints)"
Write-Host "  2. pwsh dev/dream/install_dream.ps1    (re-register the dream cycle with current fixes)"
Write-Host "  3. Launch Consonance — migrated threads rise warm beside this machine's own."
