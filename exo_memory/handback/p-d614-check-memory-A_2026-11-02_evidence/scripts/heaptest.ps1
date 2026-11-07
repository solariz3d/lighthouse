# heaptest.ps1: test/finalscene_heap.test.js on the old tree (81b8b25, the test file copied in) and on d614-a, hidden, BelowNormal, acs checked before each
$G = 'G:\Consonance-tools\scratch-A-d614'
foreach ($t in @(@('old', 'C:\Users\nname\Downloads\t180-wt-a614-old'), @('new', 'C:\Users\nname\Downloads\t180-wt-a614'))) {
  if (Get-Process acs -ErrorAction SilentlyContinue) { "acs.exe running: $($t[0]) not run"; continue }
  $t0 = Get-Date
  $p = Start-Process node -ArgumentList '--test', '--test-reporter=tap', 'test/finalscene_heap.test.js' -WorkingDirectory $t[1] -WindowStyle Hidden -PassThru -RedirectStandardOutput "$G\heaptest-$($t[0]).tap" -RedirectStandardError "$G\heaptest-$($t[0]).err"
  try { $p.PriorityClass = 'BelowNormal' } catch {}
  $p.WaitForExit()
  "== $($t[0]) exit $($p.ExitCode) in $([int]((Get-Date) - $t0).TotalSeconds) s"
  Get-Content "$G\heaptest-$($t[0]).tap" | Select-String '^(not )?ok|^# (pass|fail)|out of memory|did not finish|control' | ForEach-Object { $_.Line.Substring(0, [Math]::Min(300, $_.Line.Length)) }
}
