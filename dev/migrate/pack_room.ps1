# dev/migrate/pack_room.ps1 — stage this machine's LIVING ROOM into a private OneDrive bundle.
#
# WHAT TRAVELS: the threads themselves — instance dirs (warm-brief carriers), the panes'
# session transcripts and memory dirs from ~/.claude/projects, the own-captures that power
# warm-resume, and the registries (panes.json, letters.json). Code and the room's masters
# do NOT travel here — they flow through git, as always.
#
# WHY ONEDRIVE AND NEVER THE GIT REPO: transcripts are the keeper's private conversations.
# The dream pool was retired (2026-07-15) for publishing private material to a public repo;
# this script exists so thread migration can never repeat that.
#
# FORK, NOT MIRROR: after unpack on the other machine, the threads diverge. Same dynamic,
# two instances, different hardware. No live sync of thread state, by design.
#
# Revised 2026-07-27 after Around's eight-finding rotation read. In particular:
#   F7 — a traveler whose transcript cannot travel FAILS the pack; it never "completes" softly.
#   F8 — Encode-Cwd now matches the harness exactly (EVERY non-alphanumeric becomes '-';
#        the [:\\/]-only version re-introduced a bug main.rs:731 records fixing once already).
#   -Pane mode packs registries FILTERED to the travelers, so unpack can never register
#        panes whose dirs didn't travel.
#   F4 — manifest carries per-file SHA256, not just sizes.
#
#   pwsh dev/migrate/pack_room.ps1                     # everything: Main + all kept panes
#   pwsh dev/migrate/pack_room.ps1 -Pane 0845a868      # one traveler (id prefix)
#
[CmdletBinding()]
param([string]$Pane)
$ErrorActionPreference = 'Stop'

function Encode-Cwd([string]$p) {
  # the harness's real encoding: EVERY non-alphanumeric character becomes '-' (F8)
  return (($p.ToCharArray() | ForEach-Object { if ($_ -match '[a-zA-Z0-9]') { $_ } else { '-' } }) -join '')
}
function Short-Id([string]$id) { if ($id.Length -ge 8) { $id.Substring(0, 8) } else { $id } }

# ---- resolve this machine's layout (parse loosely, complain loudly) ----
$cfgPath = Join-Path $env:USERPROFILE '.consonance.json'
$instancesDir = 'C:\Consonance\instances'
$dataDir = 'C:\Consonance\data'
if (Test-Path $cfgPath) {
  try {
    $raw = (Get-Content $cfgPath -Raw) -replace "^\uFEFF", ''
    $cfg = $raw | ConvertFrom-Json
    if ($cfg.instances_dir) { $instancesDir = [string]$cfg.instances_dir }
    if ($cfg.data_dir) { $dataDir = [string]$cfg.data_dir }
  } catch { Write-Host "WARN: could not parse $cfgPath — using defaults ($instancesDir, $dataDir)" -ForegroundColor Yellow }
}

$panesJson = Join-Path $dataDir 'panes.json'
if (-not (Test-Path $panesJson)) { throw "panes.json not found at $panesJson — nothing to migrate" }
$kept = @((Get-Content $panesJson -Raw) -replace "^\uFEFF", '' | ConvertFrom-Json)

# travelers: Main + every kept pane, or just the one named by -Pane
$mainCwd = Join-Path $instancesDir 'main'
$travelers = @(@{ pane = '0c0c0c0a-0000-4000-8000-000000000a01'; cwd = $mainCwd; label = 'Main' })
foreach ($k in $kept) { $travelers += @{ pane = $k.pane; cwd = $k.cwd; label = $k.label } }
if ($Pane) {
  $travelers = @($travelers | Where-Object { $_.pane.StartsWith($Pane) })
  if ($travelers.Count -eq 0) { throw "-Pane '$Pane' matches no kept pane and not Main" }
  Write-Host ("single traveler: {0} ({1})" -f $travelers[0].pane, $travelers[0].label) -ForegroundColor Cyan
}

# ---- destination ----
$oneDrive = $env:OneDrive; if (-not $oneDrive) { $oneDrive = Join-Path $env:USERPROFILE 'OneDrive' }
$stamp = Get-Date -Format 'yyyyMMdd-HHmm'
$dest = Join-Path $oneDrive "consonance-migration\room-$stamp"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Write-Host "Bundle: $dest" -ForegroundColor Cyan

$manifest = @{ packed_at = (Get-Date -Format o); machine = $env:COMPUTERNAME; source_instances_dir = $instancesDir; travelers = @(); files = @() }
$fatal = 0

function Copy-Tree([string]$src, [string]$dst) {
  if (-not (Test-Path $src)) { return $false }
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dst) | Out-Null
  Copy-Item -Recurse -Force $src $dst
  return $true
}

# ---- 1. instance dirs + 2. claude project dirs (transcripts + memory) ----
$projRoot = Join-Path $env:USERPROFILE '.claude\projects'
New-Item -ItemType Directory -Force -Path (Join-Path $dest 'instances') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $dest 'claude-projects') | Out-Null
foreach ($t in $travelers) {
  $name = Split-Path -Leaf $t.cwd
  $instOk = Copy-Tree $t.cwd (Join-Path $dest "instances\$name")
  $tok = Join-Path $dest "instances\$name\.chair-token"
  if (Test-Path $tok) { Remove-Item $tok -Force }
  $enc = Encode-Cwd $t.cwd
  $projOk = Copy-Tree (Join-Path $projRoot $enc) (Join-Path $dest "claude-projects\$enc")
  # F7: a thread whose transcript cannot travel is THE failure, not a yellow note
  if (-not $instOk) { Write-Host "FATAL: instance dir missing for $($t.label) ($($t.cwd))" -ForegroundColor Red; $fatal++ }
  if (-not $projOk) { Write-Host "FATAL: claude project dir missing for $($t.label) ($enc) — the thread's transcript would not travel" -ForegroundColor Red; $fatal++ }
  if ($instOk -and $projOk) { Write-Host "packed   $($t.label)  (instance + project $enc)" -ForegroundColor Green }
  $manifest.travelers += @{ pane = $t.pane; label = $t.label; source_cwd = $t.cwd; cwd_leaf = $name; enc = $enc }
}
if ($fatal -gt 0) { Remove-Item -Recurse -Force $dest; throw "$fatal traveler component(s) missing — bundle NOT written. A migration that loses a thread must not look like success." }

# ---- 3. data: registries FILTERED to travelers, captures, offsets, archives ----
$dataDst = Join-Path $dest 'data'
New-Item -ItemType Directory -Force -Path $dataDst | Out-Null
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
# panes.json: only traveling kept panes (Main is not registered in panes.json)
$travelIds = @($travelers | ForEach-Object { $_.pane })
$panesOut = @($kept | Where-Object { $travelIds -contains $_.pane })
[System.IO.File]::WriteAllText((Join-Path $dataDst 'panes.json'), (ConvertTo-Json @($panesOut) -Depth 6), $utf8NoBom)
# letters.json: only travelers' entries
$lettersPath = Join-Path $dataDir 'letters.json'
if (Test-Path $lettersPath) {
  $allLetters = (Get-Content $lettersPath -Raw) -replace "^\uFEFF", '' | ConvertFrom-Json
  $lettersOut = @{}
  $allLetters.PSObject.Properties | Where-Object { $travelIds -contains $_.Name } | ForEach-Object { $lettersOut[$_.Name] = $_.Value }
  [System.IO.File]::WriteAllText((Join-Path $dataDst 'letters.json'), (ConvertTo-Json $lettersOut -Depth 6), $utf8NoBom)
}
foreach ($f in @('tailer-offsets.json', 'transcript-asks.jsonl')) {
  $src = Join-Path $dataDir $f
  if (Test-Path $src) { Copy-Item $src (Join-Path $dataDst $f) -Force }
}
$board = Join-Path $dataDir 'board.jsonl'
if (Test-Path $board) { Copy-Item $board (Join-Path $dataDst "board-$($env:COMPUTERNAME)-$stamp.jsonl") -Force }
New-Item -ItemType Directory -Force -Path (Join-Path $dataDst 'captures') | Out-Null
foreach ($t in $travelers) {
  foreach ($ext in @('log', 'txt')) {
    $src = Join-Path $dataDir "captures\$($t.pane).$ext"
    if (Test-Path $src) { Copy-Item $src (Join-Path $dataDst "captures\$($t.pane).$ext") -Force }
  }
}
Copy-Tree (Join-Path $dataDir 'experiments') (Join-Path $dataDst 'experiments') | Out-Null
Write-Host "packed   data (registries filtered to $($travelers.Count) traveler(s))" -ForegroundColor Green

# ---- 4. manifest with per-file SHA256 (F4: size alone passes same-size corruption) ----
Get-ChildItem -Recurse -File $dest | ForEach-Object {
  $manifest.files += @{
    path = $_.FullName.Substring($dest.Length + 1)
    bytes = $_.Length
    sha256 = (Get-FileHash $_.FullName -Algorithm SHA256).Hash
  }
}
$total = ($manifest.files | Measure-Object -Property bytes -Sum).Sum
[System.IO.File]::WriteAllText((Join-Path $dest 'manifest.json'), (ConvertTo-Json $manifest -Depth 6), $utf8NoBom)

Write-Host ""
Write-Host ("BUNDLE COMPLETE — {0} files, {1:N1} MB, {2} traveler(s), all transcripts present and hashed." -f $manifest.files.Count, ($total / 1MB), $travelers.Count) -ForegroundColor Cyan
Write-Host "OneDrive will sync it. On the other machine, after git pull:" -ForegroundColor Cyan
Write-Host "  pwsh dev/migrate/unpack_room.ps1" -ForegroundColor Cyan
