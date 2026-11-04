# hidden-launch.ps1 <exe>: start <exe> on a SEPARATE Win32 desktop ("t180-measure"), so none of its windows can appear on, or take focus from,
# the user's desktop. The environment is this process's (the caller sets the test seams). Prints "pid <n>" and exits; the desktop lives while
# the process uses it.
param([Parameter(Mandatory = $true)][string]$Exe)
$ErrorActionPreference = 'Stop'
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class HiddenDesk {
  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
  public struct STARTUPINFO { public int cb; public string lpReserved; public string lpDesktop; public string lpTitle; public int dwX, dwY, dwXSize, dwYSize, dwXCountChars, dwYCountChars, dwFillAttribute, dwFlags; public short wShowWindow, cbReserved2; public IntPtr lpReserved2, hStdInput, hStdOutput, hStdError; }
  [StructLayout(LayoutKind.Sequential)]
  public struct PROCESS_INFORMATION { public IntPtr hProcess, hThread; public int dwProcessId, dwThreadId; }
  [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
  public static extern IntPtr CreateDesktop(string name, IntPtr device, IntPtr devmode, int flags, uint access, IntPtr sa);
  [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
  public static extern bool CreateProcess(string app, string cmd, IntPtr pa, IntPtr ta, bool inherit, uint flags, IntPtr env, string cwd, ref STARTUPINFO si, out PROCESS_INFORMATION pi);
  [DllImport("kernel32.dll")] public static extern bool CloseHandle(IntPtr h);
  public static int Start(string exe, string desk) {
    IntPtr d = CreateDesktop(desk, IntPtr.Zero, IntPtr.Zero, 0, 0x10000000u /* GENERIC_ALL */, IntPtr.Zero);
    if (d == IntPtr.Zero) throw new Exception("CreateDesktop failed: " + Marshal.GetLastWin32Error());
    var si = new STARTUPINFO(); si.cb = Marshal.SizeOf(si); si.lpDesktop = desk;
    PROCESS_INFORMATION pi;
    if (!CreateProcess(null, "\"" + exe + "\"", IntPtr.Zero, IntPtr.Zero, false, 0x00000400u /* CREATE_UNICODE_ENVIRONMENT */, IntPtr.Zero, System.IO.Path.GetDirectoryName(exe), ref si, out pi))
      throw new Exception("CreateProcess failed: " + Marshal.GetLastWin32Error());
    CloseHandle(pi.hThread); CloseHandle(pi.hProcess);
    return pi.dwProcessId;
  }
}
'@
"pid $([HiddenDesk]::Start($Exe, 't180-measure'))"
