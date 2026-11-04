# copy.ps1 (D525, O): the four staged folders into AC's content\tracks as NEW folders only, in Windows background mode (low CPU and I/O priority), then every
# copied file's sha256 and size against the staging manifest. Refuses before writing anything if any *_soft_* folder exists. Touches no other folder.
param([string]$Stage, [string]$Tracks)
$ErrorActionPreference = 'Stop'
Add-Type -Namespace W -Name K -MemberDefinition '[DllImport("kernel32.dll")] public static extern bool SetPriorityClass(System.IntPtr h, uint c); [DllImport("kernel32.dll")] public static extern System.IntPtr GetCurrentProcess();'
$bg = [W.K]::SetPriorityClass([W.K]::GetCurrentProcess(), 0x00100000)   # PROCESS_MODE_BACKGROUND_BEGIN
"background mode: $bg"
$names = 'a', 'b', 'c', 'd' | ForEach-Object { "t180b_crazy_test_test_soft_$_" }
$exist = @(Get-ChildItem -LiteralPath $Tracks -Directory -Filter '*_soft_*' -ErrorAction SilentlyContinue)
if ($exist.Count) { "STOP: already present: $($exist.Name -join ', '); nothing copied"; exit 2 }
$man = Get-Content -LiteralPath (Join-Path $Stage 'manifest.json') -Raw | ConvertFrom-Json
foreach ($n in $names) {
  $dst = Join-Path $Tracks $n
  if (Test-Path -LiteralPath $dst) { "STOP: $dst appeared: nothing more copied"; exit 2 }
  Copy-Item -LiteralPath (Join-Path $Stage $n) -Destination $dst -Recurse
  "copied $n"
}
$eq = 0; $diff = 0; $miss = 0; $extra = 0
foreach ($n in $names) {
  $dst = Join-Path $Tracks $n; $want = $man.staged.$n
  $have = @(Get-ChildItem -LiteralPath $dst -Recurse -File | ForEach-Object { $_.FullName.Substring($dst.Length + 1).Replace('\', '/') })
  foreach ($f in $want.PSObject.Properties.Name) {
    $p = Join-Path $dst $f
    if (-not (Test-Path -LiteralPath $p)) { $miss++; "MISSING $n/$f"; continue }
    $h = (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLower(); $sz = (Get-Item -LiteralPath $p).Length
    if ($h -eq $want.$f.sha256 -and $sz -eq $want.$f.size) { $eq++ } else { $diff++; "DIFFERS $n/$f ($h, $sz B)" }
  }
  foreach ($f in $have) { if (-not ($want.PSObject.Properties.Name -contains $f)) { $extra++; "EXTRA $n/$f" } }
  "$n -> $dst"
}
"files equal $eq, differing $diff, missing $miss, extra $extra"
