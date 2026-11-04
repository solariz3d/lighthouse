# walk.ps1 (D450 verify, B): for each root path in $args[0] (a file, one path per line), a read-only walk that follows no link: files, dirs, apparent
# bytes, every reparse point (junction or symlink) with its target, the newest write. The process runs BelowNormal and in background mode (low I/O), launched by lowio.ps1 (very low I/O, inherited);
# it reads in small batches: a 1 s pause between roots and 150 ms every 2,000 entries.
param([string]$List, [string]$Out)
Add-Type -Namespace W -Name K -MemberDefinition '[DllImport("kernel32.dll")] public static extern bool SetPriorityClass(IntPtr h, uint c); [DllImport("kernel32.dll")] public static extern IntPtr GetCurrentProcess();'
$bg = [W.K]::SetPriorityClass([W.K]::GetCurrentProcess(), 0x100000)    # PROCESS_MODE_BACKGROUND_BEGIN: low I/O and memory priority
[void][W.K]::SetPriorityClass([W.K]::GetCurrentProcess(), 0x4000)      # BELOW_NORMAL_PRIORITY_CLASS
$me = Get-Process -Id $PID
$w = New-Object System.IO.StreamWriter($Out, $false, (New-Object System.Text.UTF8Encoding($false)))
$w.WriteLine((@{ meta = 'priority'; class = "$($me.PriorityClass)"; background = $bg } | ConvertTo-Json -Compress))
$seen = 0
foreach ($root in (Get-Content -LiteralPath $List)) {
  $root = $root.Trim(); if (-not $root) { continue }
  Start-Sleep -Milliseconds 1000   # small batches: one root at a time, a pause between
  $r = [ordered]@{ root = $root; exists = $false; files = 0; dirs = 0; bytes = [int64]0; links = @(); newest = $null; top = @(); errors = 0 }
  $item = Get-Item -LiteralPath $root -Force -ErrorAction SilentlyContinue
  if ($item) {
    $r.exists = $true
    if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { $r.links += "$root -> $($item.Target -join ',')" }
    elseif (-not $item.PSIsContainer) { $r.files = 1; $r.bytes = $item.Length; $r.newest = $item.LastWriteTimeUtc.ToString('o') }
    else {
      $r.top = @(Get-ChildItem -LiteralPath $root -Force -ErrorAction SilentlyContinue | Select-Object -First 12 | ForEach-Object { $_.Name })
      $newest = [datetime]::MinValue; $stack = New-Object System.Collections.Generic.Stack[string]; $stack.Push($root)
      while ($stack.Count) {
        $d = $stack.Pop()
        try { $entries = [IO.DirectoryInfo]::new($d).EnumerateFileSystemInfos() } catch { $r.errors++; continue }
        try {
          foreach ($e in $entries) {
            if ((++$seen % 2000) -eq 0) { Start-Sleep -Milliseconds 150 }
            if ($e.LastWriteTimeUtc -gt $newest) { $newest = $e.LastWriteTimeUtc }
            if ($e.Attributes -band [IO.FileAttributes]::ReparsePoint) { $t = try { (Get-Item -LiteralPath $e.FullName -Force).Target -join ',' } catch { '?' }; $r.links += "$($e.FullName) -> $t"; continue }
            if ($e -is [IO.DirectoryInfo]) { $r.dirs++; $stack.Push($e.FullName) } else { $r.files++; $r.bytes += $e.Length }
          }
        } catch { $r.errors++ }
      }
      if ($newest -gt [datetime]::MinValue) { $r.newest = $newest.ToString('o') }
    }
  }
  $w.WriteLine(($r | ConvertTo-Json -Compress -Depth 4)); $w.Flush()
}
$w.Close()
