# lowio.ps1 (D450 verify, B): run a command with BelowNormal CPU priority and VERY LOW I/O priority, both set on this process first so the
# command and its children inherit them. Also usable to read a process's I/O priority: lowio.ps1 -Query <pid>.
# No param block: every argument passes to the command untouched (a CmdletBinding launcher bound the child's -Out as -OutVariable/-OutBuffer).
$Query = 0; $Cmd = $args; if ($args.Count -ge 2 -and $args[0] -eq '-Query') { $Query = [int]$args[1] }
Add-Type -Namespace W -Name N -MemberDefinition @'
[DllImport("ntdll.dll")] public static extern int NtSetInformationProcess(IntPtr h, int cls, ref int info, int len);
[DllImport("ntdll.dll")] public static extern int NtQueryInformationProcess(IntPtr h, int cls, ref int info, int len, IntPtr ret);
[DllImport("kernel32.dll")] public static extern IntPtr OpenProcess(uint access, bool inherit, int pid);
[DllImport("kernel32.dll")] public static extern IntPtr GetCurrentProcess();
[DllImport("kernel32.dll")] public static extern bool SetPriorityClass(IntPtr h, uint c);
'@
if ($Query) { $h = [W.N]::OpenProcess(0x1000, $false, $Query); $v = 0; $rc = [W.N]::NtQueryInformationProcess($h, 33, [ref]$v, 4, [IntPtr]::Zero); "pid $Query io-priority $v (0 very low, 1 low, 2 normal) rc $rc class $((Get-Process -Id $Query -ErrorAction SilentlyContinue).PriorityClass)"; exit }
$me = [W.N]::GetCurrentProcess(); [void][W.N]::SetPriorityClass($me, 0x4000); $io = 0; $rc = [W.N]::NtSetInformationProcess($me, 33, [ref]$io, 4)
Write-Host "lowio: class $((Get-Process -Id $PID).PriorityClass), io-priority set to 0 rc $rc"
& $Cmd[0] $Cmd[1..($Cmd.Count - 1)]
exit $LASTEXITCODE
