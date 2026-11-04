# launch-hidden.ps1 (D454 part 3, pane E): start one program on a NEW, never-shown desktop ("zz-headless-test") of this window station, with a
# given environment block, so no window of it can appear on the keeper's screen or take focus. Prints the pid. Nothing is switched to the desktop.
#   launch-hidden.ps1 -Exe <path> -Cwd <dir> -EnvFile <file of NAME=value lines> [-ArgLine "<args>"]
#   launch-hidden.ps1 -List        the windows on that desktop: pid, class, title, and the text of any static control (a message box's words)
param([string]$Exe, [string]$Cwd, [string]$EnvFile, [string]$ArgLine = '', [switch]$List)
$ErrorActionPreference = 'Stop'
Add-Type -TypeDefinition @'
using System; using System.Runtime.InteropServices; using System.Text;
public static class HD {
  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)] public struct STARTUPINFO { public int cb; public string lpReserved; public string lpDesktop; public string lpTitle;
    public int dwX, dwY, dwXSize, dwYSize, dwXCountChars, dwYCountChars, dwFillAttribute, dwFlags; public short wShowWindow, cbReserved2; public IntPtr lpReserved2, hStdInput, hStdOutput, hStdError; }
  [StructLayout(LayoutKind.Sequential)] public struct PI { public IntPtr hProcess, hThread; public int dwProcessId, dwThreadId; }
  [DllImport("user32.dll", CharSet = CharSet.Unicode, SetLastError = true)] public static extern IntPtr CreateDesktopW(string name, IntPtr dev, IntPtr dm, int flags, uint access, IntPtr sa);
  [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)] public static extern bool CreateProcessW(string app, StringBuilder cmd, IntPtr pa, IntPtr ta, bool inherit, uint flags, IntPtr env, string cwd, ref STARTUPINFO si, out PI pi);
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern IntPtr OpenDesktopW(string n, int f, bool inh, uint acc);
  [DllImport("user32.dll")] public static extern bool EnumDesktopWindows(IntPtr d, EnumProc p, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumChildWindows(IntPtr h, EnumProc p, IntPtr l);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetWindowTextW(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetClassNameW(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out int pid);
  public static string List() {
    IntPtr d = OpenDesktopW("zz-headless-test", 0, false, 0x0040u | 0x0001u); if (d == IntPtr.Zero) return "no such desktop";
    var o = new StringBuilder();
    EnumDesktopWindows(d, (h, l) => { int pid; GetWindowThreadProcessId(h, out pid); var t = new StringBuilder(512); GetWindowTextW(h, t, 512); var c = new StringBuilder(256); GetClassNameW(h, c, 256);
      if (t.Length > 0 || c.ToString() == "#32770") { o.Append(pid + " | " + c + " | " + t + Environment.NewLine); EnumChildWindows(h, (ch, l2) => { var ct = new StringBuilder(2048); GetWindowTextW(ch, ct, 2048); var cc = new StringBuilder(256); GetClassNameW(ch, cc, 256); if (ct.Length > 0) o.Append("    " + cc + ": " + ct + Environment.NewLine); return true; }, IntPtr.Zero); }
      return true; }, IntPtr.Zero);
    return o.ToString();
  }
  public static int Start(string exe, string args, string cwd, string envBlock) {
    IntPtr d = CreateDesktopW("zz-headless-test", IntPtr.Zero, IntPtr.Zero, 0, 0x10000000u, IntPtr.Zero);   // GENERIC_ALL; never SwitchDesktop
    if (d == IntPtr.Zero) throw new Exception("CreateDesktop failed " + Marshal.GetLastWin32Error());
    var si = new STARTUPINFO(); si.cb = Marshal.SizeOf(si); si.lpDesktop = "zz-headless-test"; si.dwFlags = 1; si.wShowWindow = 7;   // SW_SHOWMINNOACTIVE, belt and braces
    IntPtr env = Marshal.StringToHGlobalUni(envBlock); PI pi;
    // CREATE_UNICODE_ENVIRONMENT 0x400 | BELOW_NORMAL_PRIORITY_CLASS 0x4000 | CREATE_NEW_PROCESS_GROUP 0x200
    bool ok = CreateProcessW(exe, new StringBuilder("\"" + exe + "\" " + args), IntPtr.Zero, IntPtr.Zero, false, 0x400u | 0x4000u | 0x200u, env, cwd, ref si, out pi);
    if (!ok) throw new Exception("CreateProcess failed " + Marshal.GetLastWin32Error());
    return pi.dwProcessId;
  }
}
'@
if ($List) { [HD]::List(); exit 0 }
$pairs = Get-Content -LiteralPath $EnvFile | Where-Object { $_ -match '^[^=]+=' }
$block = (($pairs | Sort-Object) -join "`0") + "`0`0"
[HD]::Start($Exe, $ArgLine, $Cwd, $block)
