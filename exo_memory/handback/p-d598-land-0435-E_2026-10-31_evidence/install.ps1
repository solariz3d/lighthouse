# install.ps1 (D598, after C's 0.4.34 install.ps1): install 0.4.35 so his shortcut launches it. Writes nothing and stops if the builder or the game is
# running (never closes either), if the installed exe is not the 0.4.34 the order names (sha256 9036ee3f…), or if the backup name is taken.
$ErrorActionPreference = 'Stop'
$inst  = "$env:LOCALAPPDATA\T-180 Track Builder\t180-track-builder.exe"
$bak   = "$inst.before-0.4.35"
$tree  = 'C:\Users\nname\Desktop\worktrees\t180-land-0435-msg\src-tauri\target\release'
$built = "$tree\t180-track-builder.exe"
$setup = "$tree\bundle\nsis\T-180 Track Builder_0.4.35_x64-setup.exe"
function Running { @(Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -in @('t180-track-builder', 'acs') }) }
$r = Running
if ($r.Count) { "STOP: running: $(($r | ForEach-Object { "$($_.ProcessName) $($_.Id) $($_.StartTime)" }) -join '; ')"; exit 3 }
"processes before the backup: 0 ($(Get-Date -Format o))"
if (Test-Path $bak) { "STOP: $bak exists already"; exit 4 }
$h0 = (Get-FileHash $inst -Algorithm SHA256).Hash.ToLower(); $n0 = (Get-Item $inst).Length
"installed before: $n0 B sha256 $h0"
if (-not $h0.StartsWith('9036ee3f')) { "STOP: the installed exe is not the 0.4.34 the order names (9036ee3f…)"; exit 7 }
Copy-Item $inst $bak
$hb = (Get-FileHash $bak -Algorithm SHA256).Hash.ToLower()
"backup: $bak sha256 $hb $(if ($hb -eq $h0) { '= the installed exe' } else { 'DIFFERS'; exit 5 })"
"built exe: $((Get-Item $built).Length) B sha256 $((Get-FileHash $built -Algorithm SHA256).Hash.ToLower())"
"setup: $((Get-Item $setup).Length) B sha256 $((Get-FileHash $setup -Algorithm SHA256).Hash.ToLower())"
$r = Running
if ($r.Count) { "STOP before the installer: running: $(($r | ForEach-Object { "$($_.ProcessName) $($_.Id)" }) -join '; ')"; exit 3 }
"processes before the installer: 0 ($(Get-Date -Format o))"
$p = Start-Process -FilePath $setup -ArgumentList '/S' -Wait -PassThru
"installer /S exit $($p.ExitCode)"
Start-Sleep -Seconds 2
$r = Running; "processes after: $($r.Count) $(($r | ForEach-Object { "$($_.ProcessName) $($_.Id)" }) -join '; ')"
$h1 = (Get-FileHash $inst -Algorithm SHA256).Hash.ToLower(); $n1 = (Get-Item $inst).Length
"installed after: $n1 B sha256 $h1"
# the installed exe against the build: they should differ only in the 3-byte NSIS marker (NSS where the build has UNK)
$a = [IO.File]::ReadAllBytes($built); $b = [IO.File]::ReadAllBytes($inst)
if ($a.Length -ne $b.Length) { "lengths differ: built $($a.Length) installed $($b.Length)"; exit 6 }
$diff = @(); for ($i = 0; $i -lt $a.Length; $i++) { if ($a[$i] -ne $b[$i]) { $diff += $i } }
"bytes differing: $($diff.Count) at $($diff -join ',')"
if ($diff.Count) { "built there: $([Text.Encoding]::ASCII.GetString($a, $diff[0], 3)) installed there: $([Text.Encoding]::ASCII.GetString($b, $diff[0], 3))" }
$c = [byte[]]$a.Clone(); foreach ($i in $diff) { $c[$i] = $b[$i] }
$sha = [Security.Cryptography.SHA256]::Create(); $hc = ([BitConverter]::ToString($sha.ComputeHash($c)) -replace '-', '').ToLower()
"built with the installed marker: sha256 $hc $(if ($hc -eq $h1) { '= the installed exe' } else { 'DIFFERS' })"
