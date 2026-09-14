# TAKE-STICK.ps1 - "revert to the laptop's path": make THIS machine's seats the stick's continuation.
#
# For every seat the stick has a pending tail for, this machine's own continuation since the
# agreed point is RETIRED (the whole file copied to the attic first, stamped, never deleted), the
# file is cut back to exactly the agreed point, and then the normal import appends the stick's
# tail and hashes the rejoined file whole against the other machine's record. Then Consonance
# is launched. That is the DIVERGED door (P-DIVERGED, take-the-stick) done as a keeper script
# with the already-landed carry tool, for the keeper's decision at 871ad66: the laptop wins.
#
#   powershell -ExecutionPolicy Bypass -File <stick>\TAKE-STICK.ps1            # do it (Consonance CLOSED)
#   powershell -ExecutionPolicy Bypass -File <stick>\TAKE-STICK.ps1 -DryRun    # show the plan, touch nothing
#
# Refuses while Consonance runs. Refuses a seat whose live file is SHORTER than the agreed point
# (nothing to cut; something else is wrong). Never deletes. If the import's whole-file hash fails,
# the pre-cut copy is in the attic and its path is printed.

param([switch]$DryRun)
$ErrorActionPreference = 'Stop'

$stick = $PSScriptRoot
$repo = @('C:\Consonance\lighthouse', 'C:\Users\nname\Desktop\lighthouse') | Where-Object { Test-Path (Join-Path $_ 'dev\tail-carry.js') } | Select-Object -First 1
if (-not $repo) { Write-Host "[take-stick] no lighthouse repo with dev\tail-carry.js on this machine - git pull first"; exit 2 }
function AppRunning { [bool](Get-Process -Name consonance -ErrorAction SilentlyContinue) }
if ((AppRunning) -and (-not $DryRun)) { Write-Host "[take-stick] Consonance is running. Close it, then run this again."; exit 2 }

$ledgerPath = Join-Path $stick 'consonance-tails\ledger.json'
if (-not (Test-Path $ledgerPath)) { Write-Host "[take-stick] no consonance-tails\ledger.json on this stick"; exit 2 }
$ledger = Get-Content $ledgerPath -Raw | ConvertFrom-Json
$projects = Join-Path $env:USERPROFILE '.claude\projects'
$atticRoot = Join-Path $env:USERPROFILE '.claude\consonance-attic'
$stamp = (Get-Date).ToUniversalTime().ToString('yyyyMMdd-HHmmss') + 'Z-branch-retired-to-take-stick'

Write-Host "[take-stick] repo  $repo"
Write-Host "[take-stick] stick $stick"
$plan = @()
foreach ($p in $ledger.seats.PSObject.Properties) {
  $sid = $p.Name; $seat = $p.Value
  if (-not $seat.pending) { continue }
  if (-not $seat.agreed) { Write-Host "[take-stick] $sid ($($seat.seat)): pending but nothing agreed - a first carry, not a fork; the normal import handles it"; continue }
  $agreed = [int64]$seat.agreed.offset
  $f = Get-ChildItem -Path $projects -Recurse -Filter "$sid.jsonl" -ErrorAction SilentlyContinue | Where-Object { $_.Directory.Name -ne 'C--Users-nname' } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $f) { Write-Host "[take-stick] $sid ($($seat.seat)): no live file here - the normal import handles it"; continue }
  $size = $f.Length
  if ($size -lt $agreed) { Write-Host "[take-stick] REFUSED $sid ($($seat.seat)): live file $size B is SHORTER than the agreed $agreed B - nothing to cut, something else is wrong"; exit 1 }
  $slug = $f.Directory.Name
  $attic = Join-Path (Join-Path $atticRoot $slug) "$sid.$stamp.jsonl"
  $plan += [pscustomobject]@{ sid = $sid; seat = $seat.seat; file = $f.FullName; size = $size; agreed = $agreed; cut = ($size - $agreed); attic = $attic }
}
foreach ($x in $plan) {
  Write-Host ("[take-stick] {0,-14} {1}  live {2} B  agreed {3} B  -> retire the last {4} B to`n               {5}" -f $x.seat, $x.sid, $x.size, $x.agreed, $x.cut, $x.attic)
}
if ($plan.Count -eq 0) { Write-Host "[take-stick] nothing to cut on this machine." }
if ($DryRun) {
  Write-Host "[take-stick] dry run - nothing touched. The carry tool's own rehearsal (will read DIVERGED until the cut is made):"
  Push-Location $repo; try { & node 'dev\tail-carry.js' '--stick' $stick '--import' | Out-Host } finally { Pop-Location }
  exit 0
}

# 1. retire this machine's continuation: copy whole to the attic, verify the copy, then cut
foreach ($x in $plan) {
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $x.attic) | Out-Null
  Copy-Item -LiteralPath $x.file -Destination $x.attic
  $a = (Get-FileHash -LiteralPath $x.file -Algorithm SHA256).Hash; $b = (Get-FileHash -LiteralPath $x.attic -Algorithm SHA256).Hash
  if ($a -ne $b) { Write-Host "[take-stick] the attic copy of $($x.seat) does not match its source - STOP, nothing cut"; exit 1 }
  $fs = [System.IO.File]::Open($x.file, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
  try { $fs.SetLength($x.agreed) } finally { $fs.Close() }
  Write-Host "[take-stick] $($x.seat): kept whole at $($x.attic); cut to $($x.agreed) B"
}

# 2. the normal import appends the stick's tails and verifies every rejoined file whole
Push-Location $repo
try {
  Write-Host "[take-stick] importing ..."
  & node 'dev\tail-carry.js' '--stick' $stick '--import' '--apply' | Out-Host
  $code = $LASTEXITCODE
} finally { Pop-Location }
if ($code -ne 0) {
  Write-Host "[take-stick] the carry tool did not finish clean (exit $code). Every pre-cut file is whole in the attic:"
  $plan | ForEach-Object { Write-Host "    $($_.attic)" }
  exit $code
}

# 3. launch
$exe = Join-Path $repo 'consonance\src-tauri\target\release\consonance.exe'
if (Test-Path $exe) {
  Start-Process -FilePath $exe -WorkingDirectory (Split-Path -Parent $exe) | Out-Null
  Write-Host "[take-stick] done - every seat here is now the stick's continuation. Consonance launched."
  $onExit = Join-Path $stick 'ON-EXIT.ps1'
  if (Test-Path $onExit) { Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-File', "`"$onExit`"") | Out-Null }
} else { Write-Host "[take-stick] done - imported. No release exe at $exe; launch Consonance the way you usually do." }
exit 0
