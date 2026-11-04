# lowio-sweep.ps1 -Root <pid> -Stop <file> -Log <file>: every 5 s, set VERY LOW I/O priority (and BelowNormal) on every descendant of Root not yet set
# (I/O priority is not inherited by children, so a one-time set misses them: E's D577/D588 note). Each minute it also logs free memory, and the count of
# descendants that own a visible main window (the order: never a visible window).
param([int]$Root, [string]$Stop, [string]$Log)
Add-Type -Namespace W -Name N -MemberDefinition @'
[DllImport("ntdll.dll")] public static extern int NtSetInformationProcess(IntPtr h, int cls, ref int info, int len);
[DllImport("kernel32.dll")] public static extern IntPtr OpenProcess(uint access, bool inherit, int pid);
[DllImport("kernel32.dll")] public static extern bool CloseHandle(IntPtr h);
'@
$done = @{}; $set = 0; $fail = 0; $tick = 0; $winSeen = 0; $minFree = 1e12
while (-not (Test-Path $Stop)) {
  $all = Get-CimInstance Win32_Process -Property ProcessId, ParentProcessId, Name
  $kids = @{}; foreach ($p in $all) { $k = [int]$p.ParentProcessId; if (-not $kids.ContainsKey($k)) { $kids[$k] = @() }; $kids[$k] += [int]$p.ProcessId }
  $q = New-Object System.Collections.Queue; $q.Enqueue($Root); $desc = @()
  while ($q.Count) { $x = $q.Dequeue(); if ($kids.ContainsKey($x)) { foreach ($c in $kids[$x]) { if ($c -ne $x) { $desc += $c; $q.Enqueue($c) } } } }
  foreach ($d in $desc) { if ($done.ContainsKey($d)) { continue }; $h = [W.N]::OpenProcess(0x0200 -bor 0x1000, $false, $d)
    if ($h -eq [IntPtr]::Zero) { $fail++; $done[$d] = 1; continue }; $io = 0; $rc = [W.N]::NtSetInformationProcess($h, 33, [ref]$io, 4); [void][W.N]::CloseHandle($h)
    try { $pp = Get-Process -Id $d -ErrorAction Stop; if ($pp.PriorityClass -eq 'Normal') { $pp.PriorityClass = 'BelowNormal' } } catch {}
    if ($rc -eq 0) { $set++ } else { $fail++ }; $done[$d] = 1 }
  $vis = @(Get-Process -Id $desc -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }).Count; if ($vis -gt 0) { $winSeen += $vis; Add-Content $Log ("{0} VISIBLE WINDOW owned by a descendant: {1}" -f (Get-Date).ToUniversalTime().ToString('HH:mm:ssZ'), $vis) }
  $free = (Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1KB; if ($free -lt $minFree) { $minFree = $free }
  if ($tick % 12 -eq 0) { Add-Content $Log ("{0} descendants {1}, io set {2}, failed {3}, free MB {4:N0} (min {5:N0}), windows seen {6}" -f (Get-Date).ToUniversalTime().ToString('HH:mm:ssZ'), $desc.Count, $set, $fail, $free, $minFree, $winSeen) }
  $tick++; Start-Sleep -Seconds 5
}
Add-Content $Log ("{0} stop: io set {1}, failed {2}, min free MB {3:N0}, windows seen {4}" -f (Get-Date).ToUniversalTime().ToString('HH:mm:ssZ'), $set, $fail, $minFree, $winSeen)
