# probe1.ps1: read-only. Count TabProxyWindow by EnumWindows and by FindWindowEx, and list explorer's top-level window classes.
Add-Type @"
using System; using System.Text; using System.Collections.Generic; using System.Runtime.InteropServices;
public class P1 {
  public delegate bool EP(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EP p, IntPtr l);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetClassName(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern IntPtr FindWindowEx(IntPtr p, IntPtr a, string c, string w);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  public static Dictionary<string,int> ByClass(uint pid) {
    var d = new Dictionary<string,int>();
    EnumWindows((h,l) => { uint p; GetWindowThreadProcessId(h, out p); if (pid == 0 || p == pid) { var s = new StringBuilder(256); GetClassName(h, s, 256); var k = s.ToString(); int v; d.TryGetValue(k, out v); d[k] = v + 1; } return true; }, IntPtr.Zero);
    return d;
  }
  public static int Find(string cls) { int n = 0; IntPtr h = IntPtr.Zero; while ((h = FindWindowEx(IntPtr.Zero, h, cls, null)) != IntPtr.Zero) n++; return n; }
}
"@
$cls = 'Windows.Internal.Shell.TabProxyWindow'
$all = [P1]::ByClass(0)
"top-level windows seen: " + ($all.Values | Measure-Object -Sum).Sum
"EnumWindows TabProxy: " + $(if ($all.ContainsKey($cls)) { $all[$cls] } else { 0 })
"FindWindowEx TabProxy: " + [P1]::Find($cls)
$ex = Get-Process explorer
foreach ($e in $ex) { "explorer $($e.Id) since $($e.StartTime) session $($e.SessionId)"; [P1]::ByClass([uint32]$e.Id).GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 12 | ForEach-Object { "  $($_.Value) $($_.Key)" } }
"this shell: pid $PID session $((Get-Process -Id $PID).SessionId)"
