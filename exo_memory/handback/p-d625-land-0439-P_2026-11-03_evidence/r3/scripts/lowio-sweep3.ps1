# lowio-sweep3.ps1 (D625 r3): lowio-sweep2.ps1 plus -NameOnly, which leaves priority and I/O alone (the timing files run at NORMAL) and only names windows.
# lowio-sweep2.ps1 -Root <pid> -Stop <file> -Log <file>: as lowio-sweep.ps1 (very low I/O and BelowNormal on every descendant, every 5 s; free memory
# each minute), and EVERY SECOND it enumerates the visible top-level windows (EnumWindows + IsWindowVisible) and, for each window owned by a descendant
# of Root, logs it ONCE with its process name, pid, title, size, parent and command line (D625 r2: "the sweep LOGS the NAMES of every visible window").
# Windows of processes outside the run are not logged (the user's own).
param([int]$Root, [string]$Stop, [string]$Log, [switch]$NameOnly)
Add-Type -Namespace W -Name N -MemberDefinition @'
[DllImport("ntdll.dll")] public static extern int NtSetInformationProcess(IntPtr h, int cls, ref int info, int len);
[DllImport("kernel32.dll")] public static extern IntPtr OpenProcess(uint access, bool inherit, int pid);
[DllImport("kernel32.dll")] public static extern bool CloseHandle(IntPtr h);
public delegate bool EnumProc(IntPtr h, IntPtr l);
[DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr l);
[DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
[DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
[DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetWindowText(IntPtr h, System.Text.StringBuilder s, int n);
[StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
[DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
public static System.Collections.Generic.List<string> Visible() {
  var o = new System.Collections.Generic.List<string>();
  EnumWindows((h, l) => { if (IsWindowVisible(h)) { uint p; GetWindowThreadProcessId(h, out p); var sb = new System.Text.StringBuilder(256); GetWindowText(h, sb, 256); RECT r; GetWindowRect(h, out r);
    o.Add(p + "\t" + h.ToInt64() + "\t" + (r.R - r.L) + "x" + (r.B - r.T) + "\t" + sb.ToString()); } return true; }, IntPtr.Zero);
  return o; }
'@
$ts = { (Get-Date).ToUniversalTime().ToString('HH:mm:ss.fffZ') }
$done = @{}; $set = 0; $fail = 0; $tick = 0; $named = 0; $minFree = 1e12; $desc = @{}; $seenWin = @{}; $notMine = @{}
function Refresh { $all = Get-CimInstance Win32_Process -Property ProcessId, ParentProcessId; $kids = @{}; foreach ($p in $all) { $k = [int]$p.ParentProcessId; if (-not $kids.ContainsKey($k)) { $kids[$k] = @() }; $kids[$k] += [int]$p.ProcessId }
  $q = New-Object System.Collections.Queue; $q.Enqueue($Root); $d = @{}; while ($q.Count) { $x = $q.Dequeue(); if ($kids.ContainsKey($x)) { foreach ($c in $kids[$x]) { if ($c -ne $x -and -not $d.ContainsKey($c)) { $d[$c] = 1; $q.Enqueue($c) } } } }; return $d }
function IsMine([int]$p) { if ($desc.ContainsKey($p)) { return $true }; $x = $p; for ($i = 0; $i -lt 20; $i++) { $w = Get-CimInstance Win32_Process -Filter "ProcessId=$x" -Property ParentProcessId; if (-not $w) { return $false }; $x = [int]$w.ParentProcessId; if ($x -eq $Root) { return $true }; if ($x -le 4) { return $false } }; return $false }
while (-not (Test-Path $Stop)) {
  if ($tick % 5 -eq 0) {
    $desc = Refresh
    if (-not $NameOnly) { foreach ($d in $desc.Keys) { if ($done.ContainsKey($d)) { continue }; $h = [W.N]::OpenProcess(0x0200 -bor 0x1000, $false, $d)
      if ($h -eq [IntPtr]::Zero) { $fail++; $done[$d] = 1; continue }; $io = 0; $rc = [W.N]::NtSetInformationProcess($h, 33, [ref]$io, 4); [void][W.N]::CloseHandle($h)
      try { $pp = Get-Process -Id $d -ErrorAction Stop; if ($pp.PriorityClass -eq 'Normal') { $pp.PriorityClass = 'BelowNormal' } } catch {}
      if ($rc -eq 0) { $set++ } else { $fail++ }; $done[$d] = 1 } }
    $free = (Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1KB; if ($free -lt $minFree) { $minFree = $free }
    if ($tick % 60 -eq 0) { Add-Content $Log ("{0} descendants {1}, io set {2}, failed {3}, free MB {4:N0} (min {5:N0}), visible windows named {6}" -f (& $ts), $desc.Count, $set, $fail, $free, $minFree, $named) }
  }
  foreach ($v in [W.N]::Visible()) { $f = $v.Split("`t"); $p = [int]$f[0]; $key = $f[1]
    if ($seenWin.ContainsKey($key) -or $notMine.ContainsKey("$p")) { continue }
    if (-not (IsMine $p)) { $notMine["$p"] = 1; continue }
    $seenWin[$key] = 1; $named++
    $pr = Get-CimInstance Win32_Process -Filter "ProcessId=$p" -Property Name, ParentProcessId, CommandLine; $par = if ($pr) { Get-CimInstance Win32_Process -Filter "ProcessId=$($pr.ParentProcessId)" -Property Name, CommandLine } else { $null }
    $cl = if ($pr -and $pr.CommandLine) { $pr.CommandLine.Substring(0, [Math]::Min(300, $pr.CommandLine.Length)) } else { '' }
    $pcl = if ($par -and $par.CommandLine) { $par.CommandLine.Substring(0, [Math]::Min(300, $par.CommandLine.Length)) } else { '' }
    Add-Content $Log ("{0} VISIBLE WINDOW: process {1} pid {2}, window {3} size {4}, title '{5}' | cmd: {6} | parent {7} pid {8} cmd: {9}" -f (& $ts), $(if ($pr) { $pr.Name } else { '(gone)' }), $p, $key, $f[2], $f[3], $cl, $(if ($par) { $par.Name } else { '?' }), $(if ($pr) { $pr.ParentProcessId } else { '?' }), $pcl) }
  $tick++; Start-Sleep -Milliseconds 1000
}
Add-Content $Log ("{0} stop: io set {1}, failed {2}, min free MB {3:N0}, visible windows named {4}" -f (& $ts), $set, $fail, $minFree, $named)
