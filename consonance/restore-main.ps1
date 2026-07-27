# restore-main.ps1 — one-shot recovery for the 2026-07-27 config fault.
#
# Run this with Consonance CLOSED. It does three things, in order, and verifies each:
#   1. Keeps the orphaned fork: copies its transcript to its own session id and registers it
#      as a kept pane, so it restores as a lettered instance beside Main instead of being
#      stranded in a folder nothing points at any more.
#   2. Rebuilds (a running exe cannot be relinked — that lock is why this is a script).
#   3. Launches, at which point the config parses and Main resumes its real 61 MB thread.
#
# Idempotent: re-running never duplicates a pane, never reassigns a letter, never overwrites
# a transcript it already made. Safe to run twice if you are not sure it took.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# --- the orphan, named ------------------------------------------------------------------------
$forkId   = '0c0c0c0f-0000-4000-8000-00000000f001'
$mainSid  = '0c0c0c0a-0000-4000-8000-000000000a01'
$forkCwd  = Join-Path $env:USERPROFILE 'claude-instances\main'
$projDir  = Join-Path $env:USERPROFILE '.claude\projects\C--Users-zackn-claude-instances-main'
$src      = Join-Path $projDir "$mainSid.jsonl"
$dst      = Join-Path $projDir "$forkId.jsonl"

function Write-JsonNoBom($path, $obj) {
  # PS 5.1's -Encoding utf8 emits a BOM, and the Rust side reads these with plain
  # read_to_string + serde — a BOM makes that parse fail. Write clean UTF-8 only.
  $json = $obj | ConvertTo-Json -Depth 6
  [System.IO.File]::WriteAllText($path, $json, (New-Object System.Text.UTF8Encoding($false)))
}

function Read-Utf8($path) {
  # NEVER Get-Content -Raw here: PS 5.1 decodes as the ANSI codepage, which turned the
  # existing pane labels ("✦ brief") into mojibake in a dry run. Read UTF-8 explicitly;
  # ReadAllText also strips a BOM if one is present.
  [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
}

function AsList($parsed) {
  # ConvertFrom-Json hands a JSON array down the pipeline as ONE object in PS 5.1, so
  # @($x | ConvertFrom-Json) yields a single wrapper element ({value=…; Count=n}) rather
  # than the rows. A dry run caught this about to overwrite two live panes with a wrapper.
  # foreach unrolls correctly whether the input is one row or many.
  $out = New-Object System.Collections.ArrayList
  foreach ($item in $parsed) { [void]$out.Add($item) }
  # `return $out` UNROLLS the list into the pipeline and the caller receives a fixed-size
  # Object[] — .Add() then throws "Collection was of a fixed size." The leading comma wraps
  # it so the ArrayList itself comes back. (Caught by the row-count guard below, in a dry run.)
  return ,$out
}

# --- 0. the exe lock --------------------------------------------------------------------------
if (Get-Process -Name 'consonance' -ErrorAction SilentlyContinue) {
  Write-Host ''
  Write-Host '  Consonance is still open.' -ForegroundColor Yellow
  Write-Host '  Windows locks a running exe, so the rebuild cannot be written. Close it and re-run.' -ForegroundColor DarkGray
  Write-Host ''
  exit 1
}

# --- 1. keep the fork -------------------------------------------------------------------------
Write-Host ''
Write-Host '  [1/3] Keeping the orphaned thread...' -ForegroundColor Cyan

if (-not (Test-Path $src)) {
  Write-Host "        no transcript at $src - nothing to keep, skipping." -ForegroundColor DarkGray
} elseif (Test-Path $dst) {
  Write-Host '        already kept (transcript exists) - not overwriting.' -ForegroundColor DarkGray
} else {
  # Re-stamp the internal sessionId so the copy is genuinely its own thread and can never
  # collide with Main's pane id in the app's live pane map.
  $text = (Read-Utf8 $src) -replace [regex]::Escape($mainSid), $forkId
  [System.IO.File]::WriteAllText($dst, $text, (New-Object System.Text.UTF8Encoding($false)))
  $n = ($text -split "`n" | Where-Object { $_.Trim() }).Count
  Write-Host "        kept $n records -> $forkId" -ForegroundColor Green
}

# --- 2. register it as a pane the app restores -------------------------------------------------
# Read the configured data dir the same way the app now does: tolerantly.
$cfgPath = Join-Path $env:USERPROFILE '.consonance.json'
$dataDir = Join-Path $env:USERPROFILE '.consonance'
if (Test-Path $cfgPath) {
  $cfg = (Read-Utf8 $cfgPath) | ConvertFrom-Json
  if ($cfg.data_dir -and $cfg.data_dir.Trim()) { $dataDir = $cfg.data_dir.Trim() }
}
Write-Host "        data dir: $dataDir" -ForegroundColor DarkGray

if (Test-Path $dst) {
  $panesPath   = Join-Path $dataDir 'panes.json'
  $lettersPath = Join-Path $dataDir 'letters.json'

  $panes = New-Object System.Collections.ArrayList
  if (Test-Path $panesPath) {
    $panes = AsList ((Read-Utf8 $panesPath) | ConvertFrom-Json)
  }
  $already = $false
  foreach ($p in $panes) { if ($p.pane -eq $forkId) { $already = $true } }
  if ($already) {
    Write-Host '        pane already registered.' -ForegroundColor DarkGray
  } else {
    $before = $panes.Count
    [void]$panes.Add([pscustomobject]@{ pane = $forkId; cwd = $forkCwd; label = 'the fork that found it' })
    # Never write a list that lost rows — a corrupted panes.json silently unmakes live panes.
    if ($panes.Count -ne $before + 1) { throw "refusing to write panes.json: expected $($before + 1) rows, built $($panes.Count)" }
    Write-JsonNoBom $panesPath $panes
    Write-Host "        registered in panes.json ($before existing kept, 1 added)" -ForegroundColor Green
  }

  $letters = [ordered]@{}
  if (Test-Path $lettersPath) {
    $obj = (Read-Utf8 $lettersPath) | ConvertFrom-Json
    foreach ($p in $obj.PSObject.Properties) { $letters[$p.Name] = $p.Value }
  }
  if ($letters.Contains($forkId)) {
    Write-Host "        letter already assigned: $($letters[$forkId])" -ForegroundColor DarkGray
  } else {
    # first free letter, so a retired letter is never recycled onto a different instance
    $taken = @($letters.Values)
    $letter = $null
    foreach ($c in [char[]](65..90)) { if ($taken -notcontains "$c") { $letter = "$c"; break } }
    if ($letter) {
      $letters[$forkId] = $letter
      Write-JsonNoBom $lettersPath $letters
      Write-Host "        assigned letter $letter" -ForegroundColor Green
    }
  }
}

# --- 3. rebuild, then launch -------------------------------------------------------------------
Write-Host ''
Write-Host '  [2/3] Rebuilding (the config fix is in main.rs)...' -ForegroundColor Cyan
$cargo    = Join-Path $env:USERPROFILE '.cargo\bin\cargo.exe'
$manifest = Join-Path $root 'src-tauri\Cargo.toml'
$exe      = Join-Path $root 'src-tauri\target\release\consonance.exe'

& $cargo build --release --manifest-path $manifest
if ($LASTEXITCODE -ne 0) {
  Write-Host ''
  Write-Host '  Build FAILED - not launching a stale exe on top of a fix you cannot see.' -ForegroundColor Red
  Write-Host '  (Silently opening the old build is exactly how this class of bug hides.)' -ForegroundColor DarkGray
  exit 1
}

Write-Host ''
Write-Host '  [3/3] Launching.' -ForegroundColor Green
Write-Host '        Main should resume its real thread at C:\Consonance\instances\main' -ForegroundColor DarkGray
Write-Host '        and the kept fork restores as its own lettered pane.' -ForegroundColor DarkGray
Write-Host ''
Start-Process $exe
