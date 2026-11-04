# winenum.ps1 <pid>: the top-level windows owned by <pid> or any of its descendant processes, on the USER'S desktop (EnumWindows: the calling
# thread's desktop) and on the "t180-measure" desktop (EnumDesktopWindows), each with visibility and title. Read-only.
param([Parameter(Mandatory = $true)][int]$RootPid)
Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
public static class WinEnum {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc f, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumDesktopWindows(IntPtr d, EnumProc f, IntPtr l);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern IntPtr OpenDesktop(string n, int f, bool i, uint a);
  [DllImport("user32.dll")] public static extern bool CloseDesktop(IntPtr d);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetClassName(IntPtr h, StringBuilder s, int n);
  public static List<string> On(string desk, HashSet<uint> pids) {
    var r = new List<string>();
    EnumProc f = (h, l) => { uint p; GetWindowThreadProcessId(h, out p); if (pids.Contains(p)) { var t = new StringBuilder(256); var c = new StringBuilder(256); GetWindowText(h, t, 256); GetClassName(h, c, 256); r.Add(p + " visible=" + IsWindowVisible(h) + " class=" + c + " title=" + t); } return true; };
    if (string.IsNullOrEmpty(desk)) EnumWindows(f, IntPtr.Zero);
    else { IntPtr d = OpenDesktop(desk, 0, false, 0x0040u /* DESKTOP_ENUMERATE */); if (d == IntPtr.Zero) { r.Add("(no desktop " + desk + ")"); return r; } EnumDesktopWindows(d, f, IntPtr.Zero); CloseDesktop(d); }
    return r;
  }
}
'@
$all = Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId
$set = New-Object 'System.Collections.Generic.HashSet[uint32]'; [void]$set.Add([uint32]$RootPid)
do { $n = $set.Count; foreach ($p in $all) { if ($set.Contains([uint32]$p.ParentProcessId)) { [void]$set.Add([uint32]$p.ProcessId) } } } while ($set.Count -ne $n)
$user = [WinEnum]::On($null, $set); $hid = [WinEnum]::On('t180-measure', $set)
"processes in the tree: $($set.Count)"
"windows on the user's desktop: $($user.Count) (visible $(@($user | Where-Object { $_ -match 'visible=True' }).Count))"; $user | ForEach-Object { "  $_" }
"windows on t180-measure: $($hid.Count) (visible $(@($hid | Where-Object { $_ -match 'visible=True' }).Count))"; $hid | Select-Object -First 8 | ForEach-Object { "  $_" }
