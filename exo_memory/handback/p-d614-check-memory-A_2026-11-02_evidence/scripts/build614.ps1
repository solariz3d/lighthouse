# build614.ps1 <name> <tree>: cargo tauri build --no-bundle of <tree>, hidden and at BelowNormal, into the shared target on G:, then the exe copied to
# G:\Consonance-tools\scratch-A-d614\builds\<name>\ with its sha256. Refuses while acs.exe runs.
param([string]$Name, [string]$Tree)
if (Get-Process acs -ErrorAction SilentlyContinue) { "acs.exe is running: not started"; exit 3 }
$G = 'G:\Consonance-tools\scratch-A-d614'; $env:CARGO_TARGET_DIR = "$G\target"; $env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
New-Item -ItemType Directory -Force "$Tree\src-tauri\dist", "$G\builds\$Name" | Out-Null
$p = Start-Process -FilePath "$env:USERPROFILE\.cargo\bin\cargo.exe" -ArgumentList 'tauri', 'build', '--no-bundle' -WorkingDirectory "$Tree\src-tauri" -WindowStyle Hidden -PassThru -RedirectStandardOutput "$G\builds\$Name.build.out" -RedirectStandardError "$G\builds\$Name.build.err"
$null = $p.Handle; try { $p.PriorityClass = 'BelowNormal' } catch {}
$p.WaitForExit()
"build $Name exit $($p.ExitCode)"
$exe = "$G\target\release\t180-track-builder.exe"
if ($p.ExitCode -eq 0 -and (Test-Path $exe)) { Copy-Item $exe "$G\builds\$Name\t180-track-builder.exe" -Force; (Get-FileHash "$G\builds\$Name\t180-track-builder.exe").Hash.Substring(0, 16) }
else { Get-Content "$G\builds\$Name.build.err" -Tail 15 }

