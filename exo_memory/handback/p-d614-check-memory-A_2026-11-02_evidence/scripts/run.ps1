# run.ps1 <out file> <node args...>: refuses while acs.exe runs; runs node hidden at BelowNormal, stdout and stderr to <out> and <out>.err, waits, prints the exit code
param([string]$Out, [Parameter(ValueFromRemainingArguments = $true)][string[]]$NodeArgs)
if (Get-Process acs -ErrorAction SilentlyContinue) { "acs.exe is running: not started"; exit 3 }
$q = $NodeArgs | ForEach-Object { if ($_ -match '\s') { '"' + $_ + '"' } else { $_ } }
$p = Start-Process -FilePath node -ArgumentList $q -WindowStyle Hidden -PassThru -RedirectStandardOutput $Out -RedirectStandardError "$Out.err"
try { $p.PriorityClass = 'BelowNormal' } catch {}
$p.WaitForExit()
"exit $($p.ExitCode)"
