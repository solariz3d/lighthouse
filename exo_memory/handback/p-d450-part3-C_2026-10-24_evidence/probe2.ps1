# probe2.ps1: can we make Explorer create one TabProxyWindow, see it, and remove it? Two never-shown windows, ITaskbarList3::RegisterTab,
# count, UnregisterTab, destroy, count. Nothing is shown and nothing takes focus.
Add-Type @"
using System; using System.Text; using System.Threading; using System.Runtime.InteropServices;
[ComImport, Guid("ea1afb91-9e28-4b86-90e9-9e9f8a5eefaf"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
public interface ITaskbarList3 {
  void HrInit(); void AddTab(IntPtr h); void DeleteTab(IntPtr h); void ActivateTab(IntPtr h); void SetActiveAlt(IntPtr h);
  void MarkFullscreenWindow(IntPtr h, [MarshalAs(UnmanagedType.Bool)] bool f);
  void SetProgressValue(IntPtr h, ulong c, ulong t); void SetProgressState(IntPtr h, int f);
  void RegisterTab(IntPtr tab, IntPtr mdi); void UnregisterTab(IntPtr tab); void SetTabOrder(IntPtr tab, IntPtr before);
  void SetTabActive(IntPtr tab, IntPtr mdi, uint r);
}
[ComImport, Guid("56FDF344-FD6D-11d0-958A-006097C9A090")] public class TaskbarListCls {}
public class P2 {
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
  static void Pump(int ms) { var end = DateTime.Now.AddMilliseconds(ms); MSG m; while (DateTime.Now < end) { while (PeekMessage(out m, IntPtr.Zero, 0, 0, 1)) { TranslateMessage(ref m); DispatchMessage(ref m); } Thread.Sleep(20); } }
  public static string Run() {
    string log = "before " + Count() + "\n";
    // WS_OVERLAPPEDWINDOW (0x00CF0000), never shown; class "Static" exists in every process
    IntPtr mdi = CreateWindowEx(0, "Static", "zz-leftovers-control", 0x00CF0000, -32000, -32000, 100, 100, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero);
    IntPtr tab = CreateWindowEx(0, "Static", "zz-leftovers-control-tab", 0x00CF0000, -32000, -32000, 100, 100, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero);
    var tb = (ITaskbarList3)new TaskbarListCls(); tb.HrInit();
    try { tb.RegisterTab(tab, mdi); tb.SetTabOrder(tab, IntPtr.Zero); log += "registered\n"; } catch (Exception e) { log += "register failed: " + e.Message + "\n"; }
    Pump(1500);
    log += "during " + Count() + "\n";
    try { tb.UnregisterTab(tab); log += "unregistered\n"; } catch (Exception e) { log += "unregister failed: " + e.Message + "\n"; }
    DestroyWindow(tab); DestroyWindow(mdi);
    Pump(1500);
    log += "after " + Count() + "\n";
    return log;
  }
}
"@
[P2]::Run()
