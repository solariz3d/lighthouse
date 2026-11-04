# probe6.ps1: probe5 with the window shown minimised without activation (SW_SHOWMINNOACTIVE) for about three seconds. Never focused.
# One never-shown window, one WindowTab titled zz-leftovers-control: count before, during, after the tab is removed and the window destroyed.
Add-Type @"
using System; using System.Text; using System.Threading; using System.Runtime.InteropServices;
public class P6 {
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  public delegate bool EP(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EP p, IntPtr l);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetClassName(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern IntPtr CreateWindowEx(int ex, string cls, string name, int style, int x, int y, int w, int h, IntPtr p, IntPtr m, IntPtr i, IntPtr lp);
  [DllImport("user32.dll")] public static extern bool DestroyWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool PeekMessage(out MSG m, IntPtr h, uint a, uint b, uint r);
  [DllImport("user32.dll")] public static extern bool TranslateMessage(ref MSG m);
  [DllImport("user32.dll")] public static extern IntPtr DispatchMessage(ref MSG m);
  [StructLayout(LayoutKind.Sequential)] public struct MSG { public IntPtr h; public uint m; public IntPtr w; public IntPtr l; public uint t; public int x; public int y; }
  public static string Count() { int n = 0; string t = ""; EnumWindows((h,l) => { var s = new StringBuilder(256); GetClassName(h, s, 256); if (s.ToString() == "Windows.Internal.Shell.TabProxyWindow") { n++; var w = new StringBuilder(256); GetWindowText(h, w, 256); t += "[" + w + "]"; } return true; }, IntPtr.Zero); return n + " " + t; }
  public static void Pump(int ms) { var end = DateTime.Now.AddMilliseconds(ms); MSG m; while (DateTime.Now < end) { while (PeekMessage(out m, IntPtr.Zero, 0, 0, 1)) { TranslateMessage(ref m); DispatchMessage(ref m); } Thread.Sleep(20); } }
  public static IntPtr Make() { return CreateWindowEx(0, "Static", "zz-leftovers-control", 0x00CF0000, -32000, -32000, 100, 100, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero); }
}
"@
$null = [Windows.UI.Shell.WindowTabManager, Windows.UI, ContentType = WindowsRuntime]
"supported: " + [Windows.UI.Shell.WindowTabManager]::IsSupported()
"before " + [P6]::Count()
$h = [P6]::Make(); $null = [P6]::ShowWindow($h, 7)
$id = New-Object Windows.UI.WindowId
$id.Value = [uint64]$h.ToInt64()
$m = [Windows.UI.Shell.WindowTabManager]::GetForWindow($id)
$t = New-Object Windows.UI.Shell.WindowTab
$t.Title = 'zz-leftovers-control'
$m.Tabs.Add($t)
[P6]::Pump(2000)
"during " + [P6]::Count()
$m.Tabs.Clear()
[P6]::Pump(1000)
"tab removed " + [P6]::Count()
$null = [P6]::DestroyWindow($h)
[P6]::Pump(1000)
"after " + [P6]::Count()
