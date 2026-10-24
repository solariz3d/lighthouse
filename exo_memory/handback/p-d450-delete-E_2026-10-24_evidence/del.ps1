# del.ps1 (D450 part 2 step 2, pane E): for each item of items.json in the named phase: re-check it against B's run, back up what the ruling says,
# then remove it. Launched through B's lowio.ps1 (BelowNormal, very low I/O, inherited); this script also enters background mode.
# -Mode dry: re-check and size the backup only, writes nothing outside this folder. -Mode run: re-check, back up, verify the copy, remove.
# Any failed check skips the item and records why; nothing is forced.
param([string]$Phase, [string]$Mode, [string]$Only = '')
$ErrorActionPreference = 'Stop'
Add-Type -Namespace W -Name K -MemberDefinition '[DllImport("kernel32.dll")] public static extern bool SetPriorityClass(IntPtr h, uint c); [DllImport("kernel32.dll")] public static extern IntPtr GetCurrentProcess();'
$bg = [W.K]::SetPriorityClass([W.K]::GetCurrentProcess(), 0x100000)
[void][W.K]::SetPriorityClass([W.K]::GetCurrentProcess(), 0x4000)
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

$Here = 'C:\Users\nname\Downloads\t180-d450-e'
$Backup = 'C:\Users\nname\t180-cleanup-backup-2026-10-24'
$ShaList = Join-Path $Backup 'SHA256SUMS.txt'
$Skip = @{ 'C:/Users/nname/Downloads/t180-wt-e21' = 'my own D402 audition tools (G:\Consonance-tools\b9\render13.js, render13-64.js, trim13.js) read this tree live, and D402 is open' }
$items = Get-Content -LiteralPath (Join-Path $Here 'items.json') -Raw | ConvertFrom-Json
$out = Join-Path $Here ("result-$Phase-$Mode.jsonl")
$w = New-Object System.IO.StreamWriter($out, $true, (New-Object System.Text.UTF8Encoding($false)))
$w.WriteLine((@{ meta = 'start'; at = (Get-Date).ToUniversalTime().ToString('o'); phase = $Phase; mode = $Mode; background = $bg; class = "$((Get-Process -Id $PID).PriorityClass)" } | ConvertTo-Json -Compress)); $w.Flush()

function TimingLock {
  $hit = @(Get-ChildItem 'C:\Consonance\data' -Filter 'heavy-run*.lock' -ErrorAction SilentlyContinue | Where-Object { (Get-Content -LiteralPath $_.FullName -Raw -ErrorAction SilentlyContinue) -match 'timing|sculpt-frame|ABAB' })
  return $hit.Count -gt 0
}
function Walk([string]$root) {
  $r = @{ files = 0; bytes = [int64]0; links = @(); newest = $null; list = New-Object System.Collections.Generic.List[string] }
  $item = Get-Item -LiteralPath $root -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { $r.links += $root; return $r }
  if (-not $item.PSIsContainer) { $r.files = 1; $r.bytes = $item.Length; $r.newest = $item.LastWriteTimeUtc; $r.list.Add($item.FullName); return $r }
  $newest = [datetime]::MinValue; $stack = New-Object System.Collections.Generic.Stack[string]; $stack.Push($root); $seen = 0
  while ($stack.Count) {
    $d = $stack.Pop()
    foreach ($e in [IO.DirectoryInfo]::new($d).EnumerateFileSystemInfos()) {
      if ((++$seen % 2000) -eq 0) { Start-Sleep -Milliseconds 150 }
      if ($e.LastWriteTimeUtc -gt $newest) { $newest = $e.LastWriteTimeUtc }
      if ($e.Attributes -band [IO.FileAttributes]::ReparsePoint) { $r.links += $e.FullName; continue }
      if ($e -is [IO.DirectoryInfo]) { $stack.Push($e.FullName) } else { $r.files++; $r.bytes += $e.Length; $r.list.Add($e.FullName) }
    }
  }
  if ($newest -gt [datetime]::MinValue) { $r.newest = $newest }
  return $r
}
function IsText([string]$f) {
  $fs = [IO.File]::OpenRead($f); try { $buf = New-Object byte[] 8000; $n = $fs.Read($buf, 0, 8000) } finally { $fs.Close() }
  for ($i = 0; $i -lt $n; $i++) { if ($buf[$i] -eq 0) { return $false } }
  return $true
}
function BackupRel([string]$src) {
  $p = $src.Replace('/', '\')
  foreach ($pair in @(@('C:\Users\nname\AppData\Local\Temp\', 'Temp\'), @('C:\Users\nname\Downloads\', 'Downloads\'), @('C:\Users\nname\Documents\', 'Documents\'), @('C:\Users\nname\Desktop\', 'Desktop\'), @('C:\', 'C\'))) {
    if ($p.StartsWith($pair[0], [StringComparison]::OrdinalIgnoreCase)) { return $pair[1] + $p.Substring($pair[0].Length) }
  }
  throw "no backup mapping for $src"
}
function Sha([string]$f) { return (Get-FileHash -LiteralPath $f -Algorithm SHA256).Hash.ToLower() }
function GitRun([string]$dir, [string[]]$a) { $ErrorActionPreference = "Continue"; $o = & git.exe -C $dir --no-optional-locks @a 2>&1; return @{ code = $LASTEXITCODE; out = ($o | Out-String).Trim() } }

$procs = Get-CimInstance Win32_Process | Select-Object ProcessId, Name, CommandLine
$n = 0
foreach ($it in $items) {
  $ph = if ($it.kind -eq 'branch') { 'B' } else { $it.phase }
  if ($ph -ne $Phase) { continue }
  if ($Only -and $it.path -notlike $Only -and $it.name -notlike $Only) { continue }
  $n++; if (($n % 5) -eq 0) { Start-Sleep -Seconds 3; $procs = Get-CimInstance Win32_Process | Select-Object ProcessId, Name, CommandLine }   # small batches, with pauses
  while (TimingLock) { $w.WriteLine((@{ meta = 'paused: a lock names a timing session'; at = (Get-Date).ToUniversalTime().ToString('o') } | ConvertTo-Json -Compress)); $w.Flush(); Start-Sleep -Seconds 60 }
  $res = [ordered]@{ path = $it.path; g = $it.g; kind = $it.kind; ok = $false; skip = $null; backedUp = 0; backupBytes = [int64]0; notBackedUp = 0; du = $null; removed = $false }
  try {
    if ($it.kind -eq 'branch') {
      $repo = 'C:\Users\nname\Downloads\t180-track-builder'
      $sha = (GitRun $repo @('rev-parse', '--verify', "refs/heads/$($it.name)")).out
      if ($sha -ne $it.sha) { throw "branch moved: $sha, B saw $($it.sha)" }
      $wt = (GitRun $repo @('worktree', 'list', '--porcelain')).out
      if ($wt -match [regex]::Escape("branch refs/heads/$($it.name)")) { throw 'branch is checked out in a worktree' }
      if ($Mode -eq 'run') { $g = GitRun $repo @('branch', '-d', $it.name); $res.git = $g.out; if ($g.code -ne 0) { throw "git branch -d refused: $($g.out)" }; $res.removed = $true }
      $res.ok = $true; continue
    }
    $p = $it.path
    if ($Skip.ContainsKey($p)) { $res.skip = $Skip[$p]; continue }
    if (-not (Test-Path -LiteralPath $p)) { $res.skip = 'missing now'; continue }
    $wk = Walk $p
    if ($wk.links.Count) { $res.skip = "link inside now: $($wk.links -join ', ')"; continue }
    $newestNow = if ($wk.newest) { $wk.newest.ToString('o') } else { $null }
    $newestB = if ($it.walkB.newest) { ([datetime]$it.walkB.newest).ToUniversalTime().ToString('o') } else { $null }
    if ($wk.files -ne $it.walkB.files -or $wk.bytes -ne [int64]$it.walkB.bytes -or $newestNow -ne $newestB) { $res.skip = "changed since B's walk: files $($wk.files) vs $($it.walkB.files), bytes $($wk.bytes) vs $($it.walkB.bytes), newest $newestNow vs $newestB"; continue }
    $held = @(); $fl = $wk.list.ToArray(); for ($i = 0; $i -lt $fl.Count; $i += 500) { $b = $fl[$i..([Math]::Min($i + 499, $fl.Count - 1))]; $x = [RM]::Holders([string[]]$b); if ($x) { $held += $x } }
    if ($held.Count) { $res.skip = "held open: $($held -join ' | ')"; continue }
    $pb = $p.Replace('/', [string][char]92); $pf = $p.Replace([string][char]92, '/')
    $cmd = @($procs | Where-Object { $_.CommandLine -and $_.CommandLine -notmatch 't180-d450-e' -and ($_.CommandLine -match ('(?i)(' + [regex]::Escape($pb) + '|' + [regex]::Escape($pf) + ')(?=[' + [regex]::Escape([string][char]92) + '/"'' ]|$)')) } | ForEach-Object { "$($_.ProcessId):$($_.Name)" })
    if ($cmd.Count) { $res.skip = "named on a command line: $($cmd -join ' | ')"; continue }

    # the files to back up
    $nonGit = $fl
    if ($it.kind -eq 'worktree') {
      $gf = (Get-Content -LiteralPath (Join-Path $p '.git') -Raw).Trim()
      if ($gf -notmatch '^gitdir: (.+)[\\/]\.git[\\/]worktrees[\\/]') { throw ".git is not a worktree pointer: $gf" }
      $repo = $Matches[1]; $res.repo = $repo
      $wantRepo = if ($Phase -eq "A") { "C:/Users/nname/Desktop/t180-track-builder" } else { "C:/Users/nname/Downloads/t180-track-builder" }
      if ($repo.Replace([string][char]92, "/") -ne $wantRepo) { $res.skip = "worktree of $repo, not of $wantRepo"; continue }
      $wt = (GitRun $repo @('worktree', 'list', '--porcelain')).out -split "`n"
      $blk = $null; for ($i = 0; $i -lt $wt.Count; $i++) { if ($wt[$i].Trim() -eq "worktree $p") { $blk = $wt[$i..([Math]::Min($i + 5, $wt.Count - 1))] -join "`n"; break } }
      if (-not $blk) { $res.skip = 'not registered in its repo now'; continue }
      if ($blk -match '(?m)^locked') { $res.skip = 'locked'; continue }
      if ($blk -match 'refs/heads/local-0.4.19') { $res.skip = 'its branch is local-0.4.19 (the chair: not ours to touch)'; continue }
      $head = (GitRun $p @('rev-parse', 'HEAD')).out
      if ($head -ne $it.head) { $res.skip = "head moved: $head, B saw $($it.head)"; continue }
      if ((GitRun $p @('rev-parse', '-q', '--verify', 'MERGE_HEAD')).code -eq 0) { $res.skip = 'merge in progress'; continue }
      $st = @((GitRun $p @('status', '--porcelain=v1', '--untracked-files=all')).out -split '\r?\n' | Where-Object { $_ })
      $want = @($it.untracked | ForEach-Object { "?? $_" })
      if ((@($st) -join '|') -ne (@($want) -join '|')) { $res.skip = "status changed: [$($st -join '; ')] vs B's [$($want -join '; ')]"; continue }
      if ($it.whole) { $nonGit = $fl } else {
        $nonGit = @((GitRun $p @('ls-files', '-o', '-z')).out -split "`0" | Where-Object { $_ } | ForEach-Object { Join-Path $p $_ })
      }
    }
    $todo = New-Object System.Collections.Generic.List[string]
    foreach ($f in $nonGit) {
      $f = $f.Replace('/', '\')
      if ($it.whole) { $todo.Add($f); continue }
      if ($it.g -eq 'G5') { continue }                                   # C:\build: cargo target dirs, rebuildable (the ruling)
      if ($f -match '\.(kn5|dds)$') { continue }                          # exported kn5/dds, rebuildable (the ruling)
      $len = (Get-Item -LiteralPath $f -Force).Length
      if ($len -lt 5MB -or (IsText $f)) { $todo.Add($f) }
    }
    $res.notBackedUp = $nonGit.Count - $todo.Count
    $res.du = [int64]((& 'C:\Program Files\Git\usr\bin\du.exe' -s -B1 $p) -split "`t")[0]
    foreach ($f in $todo) { $res.backupBytes += (Get-Item -LiteralPath $f -Force).Length }
    $res.backedUp = $todo.Count
    if ($Mode -ne 'run') { $res.ok = $true; continue }

    # back up, and check each copy against its source
    $lines = New-Object System.Collections.Generic.List[string]
    $k = 0
    foreach ($f in $todo) {
      if ((++$k % 200) -eq 0) { Start-Sleep -Milliseconds 300 }
      $rel = BackupRel $f; $dst = Join-Path $Backup $rel
      [void](New-Item -ItemType Directory -Force -Path (Split-Path $dst -Parent))
      Copy-Item -LiteralPath $f -Destination $dst -Force
      $a = Sha $f; $b2 = Sha $dst
      if ($a -ne $b2) { throw "backup copy differs: $f" }
      $lines.Add("$a  $rel")
    }
    [IO.File]::AppendAllLines($ShaList, [string[]]$lines.ToArray(), (New-Object System.Text.UTF8Encoding($false)))

    # remove
    if ($it.kind -eq 'worktree') {
      foreach ($u in $it.untracked) { Remove-Item -LiteralPath (Join-Path $p $u) -Force }   # released trees: the one stray copy, backed up above
      $g = GitRun $repo @('worktree', 'remove', $p); $res.git = $g.out
      if ($g.code -ne 0) { throw "git worktree remove refused: $($g.out)" }
    } elseif ($it.kind -eq 'dir') {
      & cmd.exe /c rmdir /s /q "$($p.Replace('/', '\'))"
    } else { Remove-Item -LiteralPath $p -Force }
    if (Test-Path -LiteralPath $p) { throw 'still present after remove' }
    $res.removed = $true; $res.ok = $true
  } catch { $res.error = "$_" } finally { $w.WriteLine(($res | ConvertTo-Json -Compress -Depth 4)); $w.Flush() }
}
$w.WriteLine((@{ meta = 'end'; at = (Get-Date).ToUniversalTime().ToString('o') } | ConvertTo-Json -Compress)); $w.Close()
