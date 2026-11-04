# rmopen.ps1 (D450 verify, B): for each %TEMP% entry in $List, which running processes hold any file under it open (Windows Restart Manager, a
# read-only query), and which processes name it on their command line. BelowNormal, background mode.
param([string]$List, [string]$Out)
Add-Type -Namespace W -Name K -MemberDefinition '[DllImport("kernel32.dll")] public static extern bool SetPriorityClass(IntPtr h, uint c); [DllImport("kernel32.dll")] public static extern IntPtr GetCurrentProcess();'
[void][W.K]::SetPriorityClass([W.K]::GetCurrentProcess(), 0x100000); [void][W.K]::SetPriorityClass([W.K]::GetCurrentProcess(), 0x4000)
Add-Type -TypeDefinition @'
using System; using System.Runtime.InteropServices; using System.Collections.Generic;
public static class RM {
  [StructLayout(LayoutKind.Sequential)] struct UNIQUE { public int pid; public System.Runtime.InteropServices.ComTypes.FILETIME start; }
  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)] struct INFO { public UNIQUE p; [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 256)] public string app;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 64)] public string svc; public int type; public int status; public int session; [MarshalAs(UnmanagedType.Bool)] public bool restartable; }
  [DllImport("rstrtmgr.dll", CharSet = CharSet.Unicode)] static extern int RmStartSession(out uint h, int f, string key);
  [DllImport("rstrtmgr.dll")] static extern int RmEndSession(uint h);
  [DllImport("rstrtmgr.dll", CharSet = CharSet.Unicode)] static extern int RmRegisterResources(uint h, uint n, string[] files, uint a, IntPtr b, uint c, string[] d);
  [DllImport("rstrtmgr.dll")] static extern int RmGetList(uint h, out uint need, ref uint n, [In, Out] INFO[] info, ref uint reasons);
  public static string Holders(string[] files) {
    uint h; var key = Guid.NewGuid().ToString(); if (RmStartSession(out h, 0, key) != 0) return "ERR start";
    try {
      int rc = RmRegisterResources(h, (uint)files.Length, files, 0, IntPtr.Zero, 0, null); if (rc != 0) return "ERR register " + rc;
      uint need = 0, n = 0, reasons = 0; rc = RmGetList(h, out need, ref n, null, ref reasons);
      if (rc == 0) return ""; if (rc != 234) return "ERR list " + rc;
      var info = new INFO[need]; n = need; rc = RmGetList(h, out need, ref n, info, ref reasons); if (rc != 0) return "ERR list2 " + rc;
      var s = new List<string>(); for (int i = 0; i < n; i++) s.Add(info[i].p.pid + ":" + info[i].app); return string.Join("; ", s);
    } finally { RmEndSession(h); }
  }
}
'@
$procs = Get-CimInstance Win32_Process | Select-Object ProcessId, Name, CommandLine
$w = New-Object System.IO.StreamWriter($Out, $false, (New-Object System.Text.UTF8Encoding($false)))
foreach ($p in (Get-Content -LiteralPath $List)) {
  $p = $p.Trim(); if (-not $p) { continue }
  Start-Sleep -Milliseconds 300
  $leaf = Split-Path $p -Leaf
  $files = @(); if (Test-Path -LiteralPath $p -PathType Container) { $files = @(Get-ChildItem -LiteralPath $p -Recurse -File -Force -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName }) } elseif (Test-Path -LiteralPath $p) { $files = @($p) }
  $held = @(); for ($i = 0; $i -lt $files.Count; $i += 500) { $b = $files[$i..([Math]::Min($i + 499, $files.Count - 1))]; $x = [RM]::Holders([string[]]$b); if ($x) { $held += $x } }
  $cmd = @($procs | Where-Object { $_.CommandLine -and $_.CommandLine -notmatch 't180-d450v|scratchpad[\/]d450' -and $_.CommandLine.IndexOf($leaf, [StringComparison]::OrdinalIgnoreCase) -ge 0 } | ForEach-Object { "$($_.ProcessId):$($_.Name)" })
  $w.WriteLine((@{ path = $p; exists = (Test-Path -LiteralPath $p); files = $files.Count; held = ($held -join ' | '); cmdline = ($cmd -join ' | ') } | ConvertTo-Json -Compress)); $w.Flush()
}
$w.Close()
