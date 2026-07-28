# move_verify.ps1  -  the verdict instrument for the lighthouse OneDrive exit.
#
# WHY THIS FILE LIVES HERE AND NOT IN THE REPO: an instrument inside the artifact
# under test dies with a botched move. C:\Consonance\verify is outside both the
# source tree and OneDrive. Do not "tidy" it into the repo.
#
#   .\move_verify.ps1 -Phase Selftest                       # prove the gates can fail
#   .\move_verify.ps1 -Phase Baseline -Root "<old root>"    # BEFORE anything moves
#   .\move_verify.ps1 -Phase Verify   -Root "<new root>"    # after the move + rename
#
# ---------------------------------------------------------------------------
# REVISION 2 (2026-07-28)  -  written after the chair ran revision 1 and it
# reported a GREEN baseline over a NULL. Both defects are recorded here rather
# than quietly patched, because a fix with no account of the failure is how the
# same bug comes back wearing a different name.
#
# DEFECT 1  -  the helper function was named `Git`. PowerShell function names are
# case-insensitive and functions OUTRANK external applications in command
# resolution, so `& git` inside `function Git` resolved to the function itself.
# It recursed, unwound, and returned an empty string. Every git field in the
# baseline recorded nothing. Run by hand in a shell with no such function
# defined, the identical command line worked  -  which is exactly why this was
# invisible from the outside.
#   FIX: the git executable is resolved ONCE to an absolute path and only ever
#   invoked through that path; the helper is renamed `Invoke-Git`; and
#   `Assert-NoShadowedHelpers` refuses to run if ANY helper name in this file
#   collides with a real application on PATH. That last one fixes the CLASS, not
#   the instance.
#
# DEFECT 2  -  the worse one, and the reason revision 2 exists. The instrument
# accepted an empty answer AS DATA and printed BASELINE RECORDED over it. That
# is NOT-RUN-masquerading-as-GREEN inside the tool built to catch that family,
# and it would have survived to the Verify side invisibly: an empty baseline
# HEAD compared against an empty verify HEAD MATCHES. Two nulls are equal.
#   FIX: no value enters the baseline without passing `Require-Text`, and the
#   baseline REFUSES TO WRITE if any field fails. See the rule below.
#
# THE RULE, stated precisely, because "empty is failure" is too blunt to be
# correct: an empty `git status` is legitimate data (a clean tree) and an empty
# `git rev-parse HEAD` is a broken run. Emptiness alone cannot tell them apart.
#   >> EMPTINESS IS NEVER ACCEPTED AS EVIDENCE UNLESS AN INDEPENDENT SUCCESS
#   >> SIGNAL  -  the process exit code  -  CONFIRMS THE EMPTINESS IS REAL.
# And the exit code is not sufficient either: `rev-parse` on a bogus ref returns
# non-empty text WITH exit 128, so a pure emptiness gate would pass it. Every
# field is therefore gated on exit code AND emptiness AND shape.
# ---------------------------------------------------------------------------

[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][ValidateSet('Baseline','Verify','Selftest')][string]$Phase,
  [string]$Root,
  [string]$StateDir = "C:\Consonance\verify\state",
  [string]$OldRoot  = "C:\Users\zackn\OneDrive\Desktop\projects\lighthouse"
)

$ErrorActionPreference = 'Continue'
$SHA256_OF_EMPTY_STRING = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

# ==============================================================================
# GATES  -  the part that failed in revision 1. Everything else depends on these.
# ==============================================================================

# Every helper function defined in this file. If a name here also exists as an
# application on PATH, `& name` inside this script silently calls the FUNCTION.
$HELPERS = @('Invoke-Git','Get-TreeManifest','Require-Text','Require-Int','Check','Note','Assert-NoShadowedHelpers')

function Assert-NoShadowedHelpers {
  $bad = @()
  foreach ($h in $HELPERS) {
    $app = Get-Command $h -CommandType Application -ErrorAction SilentlyContinue
    if ($app) { $bad += "$h (shadows $($app.Source))" }
  }
  return $bad
}

# The single gate. Returns a result object; NEVER a bare string, so a caller
# cannot accidentally treat a failure as a value.
function Require-Text {
  param(
    [string]$Name,
    $Text,
    [int]$ExitCode = 0,
    [string]$Shape = $null,          # regex the value must match
    [switch]$AllowEmpty              # emptiness is legitimate data for this field
  )
  $t = ''
  if ($null -ne $Text) { $t = [string]$Text }

  if ($ExitCode -ne 0) {
    return @{ ok=$false; value=$t; why="$Name : process exit $ExitCode (text was '$($t -replace "`n",' ' | Select-Object -First 1)')" }
  }
  if ([string]::IsNullOrWhiteSpace($t)) {
    if ($AllowEmpty) { return @{ ok=$true; value=''; why='' } }
    return @{ ok=$false; why="$Name : EMPTY OR NULL and emptiness is not legitimate for this field"; value=$t }
  }
  if ($Shape -and ($t -notmatch $Shape)) {
    return @{ ok=$false; value=$t; why="$Name : value '$t' does not match required shape $Shape" }
  }
  return @{ ok=$true; value=$t; why='' }
}

function Require-Int {
  param([string]$Name, $Text, [int]$ExitCode = 0, [int]$Min = 1)
  $r = Require-Text -Name $Name -Text $Text -ExitCode $ExitCode -Shape '^\d+$'
  if (-not $r.ok) { return $r }
  $n = [int]$r.value
  if ($n -lt $Min) { return @{ ok=$false; value=$n; why="$Name : $n is below the minimum $Min  -  a zero count is not evidence, it is an unrun measurement" } }
  return @{ ok=$true; value=$n; why='' }
}

# ==============================================================================
# GIT  -  resolved once, to an absolute path, and never invoked by bareword.
# ==============================================================================
$script:GitExe = $null
$gc = Get-Command git.exe -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
if ($gc) { $script:GitExe = $gc.Source }

function Invoke-Git {
  param([string]$Path, [string[]]$GitArgs)
  if (-not $script:GitExe) { return @{ text=''; code=127 } }
  $out = & $script:GitExe -C $Path --no-pager @GitArgs 2>$null
  $code = $LASTEXITCODE
  $t = ''
  if ($null -ne $out) { $t = ($out | Out-String).Trim() }
  return @{ text=$t; code=$code }
}

# ==============================================================================
# TREE  -  with the same discipline applied to the file half. In revision 1 an
# unreadable file was recorded as the literal string 'UNREADABLE' in the
# baseline, which would then MATCH an unreadable file at verify time. Same
# defect as the git nulls, in the half that appeared to work.
# ==============================================================================
function Get-TreeManifest {
  param([string]$Path)
  $files = @(Get-ChildItem -LiteralPath $Path -Recurse -Force -File -ErrorAction SilentlyContinue)
  $map = @{}
  $reparse = 0; $offline = 0; $bytes = 0
  $unreadable = New-Object System.Collections.ArrayList
  foreach ($f in $files) {
    $rel = $f.FullName.Substring($Path.Length).TrimStart('\')
    if ($f.Attributes -band [IO.FileAttributes]::ReparsePoint) { $reparse++ }
    if ($f.Attributes -band [IO.FileAttributes]::Offline)      { $offline++ }
    $bytes += $f.Length
    # Get-FileHash forces a FULL CONTENT READ  -  what distinguishes a real file
    # from a placeholder that merely reports a size.
    $h = $null
    try { $h = (Get-FileHash -LiteralPath $f.FullName -Algorithm SHA256 -ErrorAction Stop).Hash } catch { $h = $null }
    if ([string]::IsNullOrWhiteSpace($h)) { [void]$unreadable.Add($rel); continue }
    $map[$rel] = @{ h=$h; n=$f.Length; m=$f.LastWriteTimeUtc.ToString('o') }
  }
  return @{ files=$map; count=$files.Count; hashed=$map.Count; bytes=$bytes; reparse=$reparse; offline=$offline; unreadable=@($unreadable) }
}

if (-not (Test-Path -LiteralPath $StateDir)) { New-Item -ItemType Directory -Force -Path $StateDir | Out-Null }
$BaselineFile = Join-Path $StateDir 'baseline.json'

# ==============================================================================
# PHASE: SELFTEST  -  prove the gates CAN fail. A detector that has never fired is
# not known to work; revision 1 is the standing proof of that. Both directions
# are tested: a gate that rejected everything would be its own failure mode.
# ==============================================================================
if ($Phase -eq 'Selftest') {
  $t = New-Object System.Collections.ArrayList
  function T([string]$name, [bool]$pass, [string]$detail) { [void]$t.Add(@{ n=$name; p=$pass; d=$detail }) }

  $r = Require-Text -Name 'x' -Text $null;              T 'rejects $null'                      (-not $r.ok) $r.why
  $r = Require-Text -Name 'x' -Text '';                 T 'rejects empty string'               (-not $r.ok) $r.why
  $r = Require-Text -Name 'x' -Text "   `n  ";          T 'rejects whitespace only'            (-not $r.ok) $r.why
  $r = Require-Text -Name 'x' -Text 'ok' -ExitCode 128; T 'rejects NONEMPTY text w/ exit 128'  (-not $r.ok) $r.why
  $r = Require-Text -Name 'x' -Text 'zzz' -Shape '^[0-9a-f]{40}$'; T 'rejects bad shape'       (-not $r.ok) $r.why
  $r = Require-Text -Name 'x' -Text '' -AllowEmpty;     T 'ACCEPTS empty when declared legit'  ($r.ok)      'clean tree case'
  $r = Require-Text -Name 'x' -Text 'c31832b0cef3e6960b6d32f6c11513a81490f09c' -Shape '^[0-9a-f]{40}$'
                                                        T 'ACCEPTS a real value'               ($r.ok)      $r.value
  $r = Require-Int  -Name 'x' -Text '0';                T 'rejects a zero count'               (-not $r.ok) $r.why
  $r = Require-Int  -Name 'x' -Text '494';              T 'ACCEPTS a real count'               ($r.ok)      '494'

  $poison = $SHA256_OF_EMPTY_STRING
  T 'knows the empty-string digest' ($poison.Length -eq 64) $poison

  $shadow = Assert-NoShadowedHelpers
  T 'no helper name shadows an application' ($shadow.Count -eq 0) ($shadow -join '; ')

  # the actual revision-1 defect, reproduced and asserted fixed
  $gitok = $false; $gd = 'git.exe not resolved'
  if ($script:GitExe) {
    $probe = Invoke-Git -Path $PWD.Path -GitArgs @('--version')
    $gitok = ($probe.code -eq 0 -and $probe.text -match '^git version')
    $gd = "$($script:GitExe) -> '$($probe.text)' exit $($probe.code)"
  }
  T 'git resolves to an APPLICATION, not a function' $gitok $gd
  $gcmd = Get-Command git -ErrorAction SilentlyContinue
  T 'bareword git is not shadowed in this scope' ($gcmd -and $gcmd.CommandType -eq 'Application') "resolves to $($gcmd.CommandType)"

  Write-Host ""
  Write-Host "================= INSTRUMENT SELFTEST =================" -ForegroundColor Cyan
  $failed = 0
  foreach ($x in $t) {
    if ($x.p) { Write-Host ("  [ ok ] {0}" -f $x.n) -ForegroundColor DarkGreen }
    else { $failed++; Write-Host ("  [FAIL] {0}  -  {1}" -f $x.n, $x.d) -ForegroundColor Red }
  }
  Write-Host ""
  if ($failed -eq 0) { Write-Host "SELFTEST: GREEN  -  $($t.Count)/$($t.Count). The gates reject nulls and accept real values." -ForegroundColor Green; exit 0 }
  Write-Host "SELFTEST: RED  -  $failed of $($t.Count) failed. Do not trust a baseline from this build." -ForegroundColor Red
  exit 1
}

if (-not $Root) { Write-Host "-Root is required for $Phase." -ForegroundColor Red; exit 2 }

# preflight, both real phases
$shadow = Assert-NoShadowedHelpers
if ($shadow.Count) { Write-Host "ABORT: helper name shadows an application: $($shadow -join '; ')" -ForegroundColor Red; exit 2 }
if (-not $script:GitExe) { Write-Host "ABORT: git.exe not found as an Application. Refusing to guess." -ForegroundColor Red; exit 2 }

# ==============================================================================
# PHASE: BASELINE  -  refuses to write anything it could not actually measure.
# ==============================================================================
if ($Phase -eq 'Baseline') {
  if (-not (Test-Path -LiteralPath $Root)) { Write-Host "BASELINE ABORTED: root not found: $Root" -ForegroundColor Red; exit 2 }
  Write-Host "Baselining $Root" -ForegroundColor Cyan
  Write-Host "  git: $($script:GitExe)"
  Write-Host "  full content read of every file  -  that is the point, so it is not fast."

  $tree = Get-TreeManifest -Path $Root

  $g_head   = Invoke-Git $Root @('rev-parse','HEAD')
  $g_branch = Invoke-Git $Root @('rev-parse','--abbrev-ref','HEAD')
  $g_orig   = Invoke-Git $Root @('rev-parse','origin/main')
  $g_count  = Invoke-Git $Root @('rev-list','--all','--count')
  $g_refs   = Invoke-Git $Root @('for-each-ref','--format=%(refname)')
  $g_status = Invoke-Git $Root @('status','--porcelain')
  $g_fsck   = Invoke-Git $Root @('fsck','--full','--strict')
  $g_objs   = Invoke-Git $Root @('rev-list','--objects','--all')
  $g_ver    = Invoke-Git $Root @('--version')

  $sha = [System.Security.Cryptography.SHA256]::Create()
  $fp  = -join ($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($g_objs.text)) | ForEach-Object { $_.ToString('x2') })

  # ---- the gate. Nothing below reaches disk without passing. ----
  $gates = [ordered]@{
    'git_version'  = Require-Text -Name 'git --version'      -Text $g_ver.text    -ExitCode $g_ver.code    -Shape '^git version'
    'head'         = Require-Text -Name 'rev-parse HEAD'     -Text $g_head.text   -ExitCode $g_head.code   -Shape '^[0-9a-f]{40}$'
    'branch'       = Require-Text -Name 'abbrev-ref HEAD'    -Text $g_branch.text -ExitCode $g_branch.code -Shape '^\S+$'
    'origin_main'  = Require-Text -Name 'rev-parse origin/main' -Text $g_orig.text -ExitCode $g_orig.code  -Shape '^[0-9a-f]{40}$'
    'commits'      = Require-Int  -Name 'rev-list --count'   -Text $g_count.text  -ExitCode $g_count.code  -Min 1
    'refs_raw'     = Require-Text -Name 'for-each-ref'       -Text $g_refs.text   -ExitCode $g_refs.code
    'objects_raw'  = Require-Text -Name 'rev-list --objects' -Text $g_objs.text   -ExitCode $g_objs.code
    # status and fsck MAY be legitimately empty  -  gated on exit code only.
    'status'       = Require-Text -Name 'status --porcelain' -Text $g_status.text -ExitCode $g_status.code -AllowEmpty
    'fsck'         = Require-Text -Name 'fsck --full'        -Text $g_fsck.text   -ExitCode $g_fsck.code   -AllowEmpty
    'file_count'   = Require-Int  -Name 'files found'        -Text $tree.count    -Min 1
    'hashed_count' = Require-Int  -Name 'files hashed'       -Text $tree.hashed   -Min 1
  }

  $bad = @()
  foreach ($k in $gates.Keys) { if (-not $gates[$k].ok) { $bad += $gates[$k].why } }
  if ($tree.unreadable.Count -gt 0) { $bad += "unreadable files ($($tree.unreadable.Count)): " + (($tree.unreadable | Select-Object -First 10) -join ', ') }
  if ($tree.hashed -ne $tree.count) { $bad += "hashed $($tree.hashed) of $($tree.count) files  -  a manifest with holes is not a baseline" }
  if ($fp -eq $SHA256_OF_EMPTY_STRING) { $bad += "object fingerprint is the SHA-256 OF THE EMPTY STRING  -  git returned nothing" }

  if ($bad.Count -gt 0) {
    Write-Host ""
    Write-Host "BASELINE REFUSED  -  nothing was written." -ForegroundColor Red
    foreach ($b in $bad) { Write-Host "  * $b" -ForegroundColor Yellow }
    Write-Host ""
    Write-Host "An empty field recorded as a baseline MATCHES an empty field at verify time." -ForegroundColor Red
    Write-Host "Two nulls compare equal. That is why this refuses instead of warning." -ForegroundColor Red
    exit 2
  }

  $b = [ordered]@{
    taken_at    = (Get-Date).ToString('o')
    root        = $Root
    git_exe     = $script:GitExe
    git_version = $gates['git_version'].value
    count       = $tree.count
    bytes       = $tree.bytes
    reparse     = $tree.reparse
    offline     = $tree.offline
    onedrive_running = [bool](Get-Process OneDrive -ErrorAction SilentlyContinue)
    head        = $gates['head'].value
    branch      = $gates['branch'].value
    origin_main = $gates['origin_main'].value
    commits     = $gates['commits'].value
    refs        = @($gates['refs_raw'].value -split "`n").Count
    status      = $gates['status'].value
    fsck        = $gates['fsck'].value
    objects_fp  = $fp
    files       = $tree.files
  }
  $b | ConvertTo-Json -Depth 6 -Compress | Out-File -FilePath $BaselineFile -Encoding utf8
  Copy-Item $BaselineFile (Join-Path $StateDir ("baseline-" + (Get-Date -Format 'yyyyMMdd-HHmmss') + ".json"))

  Write-Host ""
  Write-Host "BASELINE RECORDED -> $BaselineFile" -ForegroundColor Green
  Write-Host ("  every field below passed the gate; none is empty by accident") -ForegroundColor DarkGray
  Write-Host ("  files {0} (all {1} hashed)   bytes {2}   reparse {3}   offline {4}" -f $b.count,$tree.hashed,$b.bytes,$b.reparse,$b.offline)
  Write-Host ("  HEAD  {0}  ({1})" -f $b.head,$b.branch)
  Write-Host ("  origin/main {0}   commits {1}   refs {2}" -f $b.origin_main,$b.commits,$b.refs)
  Write-Host ("  status [{0}]" -f ($b.status -replace "`n",' / '))
  Write-Host ("  objects fingerprint {0}" -f $b.objects_fp)
  if ($b.offline -gt 0)      { Write-Host "  WARNING: $($b.offline) dehydrated files  -  a copy may capture placeholders. Hydrate first." -ForegroundColor Yellow }
  if ($b.onedrive_running)   { Write-Host "  WARNING: OneDrive is RUNNING. Stop it before the copy or this baseline may not hold." -ForegroundColor Yellow }
  exit 0
}

# ==============================================================================
# PHASE: VERIFY
# ==============================================================================
$EXPECTED = @(
  'C01_instrument_is_outside_both_trees','C02_root_is_the_new_root','C03_no_reparse_points_at_destination',
  'C04_no_offline_placeholders','C05_onedrive_not_running','C06_old_tree_renamed_or_absent',
  'C07_file_count_and_bytes','C08_manifest_every_file_byte_identical','C09_nothing_wasted_md',
  'C10_git_toplevel_matches_root','C11_git_head_and_branch','C12_git_origin_agreement',
  'C13_git_commit_and_ref_counts','C14_git_object_set_fingerprint','C15_git_fsck_full_strict',
  'C16_git_status_only_expected_untracked','C17_git_log_fully_reachable',
  'C18_ambient_master_present_and_matches_installed_copy','C19_dream_vbs_target_resolves',
  'C20_scheduled_task_chain_intact','C21_consonance_config_paths_resolve',
  'C22_app_binary_has_no_old_path_baked_in','C23_repo_sources_have_no_old_path',
  'C24_baseline_is_not_hollow'
)
$RESULTS = @{}

function Check([string]$id, [string]$what, [scriptblock]$body) {
  if ($EXPECTED -notcontains $id) { $RESULTS['C00_UNREGISTERED'] = @{ ok=$false; what="check '$id' ran unregistered"; detail='' }; return }
  $ok = $false; $detail = ''
  try { $r = & $body; $ok = [bool]$r.ok; $detail = [string]$r.detail }
  catch { $ok = $false; $detail = "THREW: $($_.Exception.Message)" }
  if ([string]::IsNullOrWhiteSpace($detail)) { $detail = '(no detail produced  -  treated as suspect)' }
  $RESULTS[$id] = @{ ok=$ok; what=$what; detail=$detail }
}

if (-not (Test-Path -LiteralPath $BaselineFile)) {
  Write-Host "VERDICT: RED  -  no baseline at $BaselineFile. A verify with no baseline can only prove files exist." -ForegroundColor Red
  exit 2
}
$B = Get-Content -LiteralPath $BaselineFile -Raw | ConvertFrom-Json

# C24 first: a hollow baseline makes every comparison below meaningless-but-green.
Check 'C24_baseline_is_not_hollow' 'the baseline itself contains real values' {
  $bad = @()
  if ($B.head -notmatch '^[0-9a-f]{40}$')        { $bad += "head='$($B.head)'" }
  if ($B.origin_main -notmatch '^[0-9a-f]{40}$') { $bad += "origin_main='$($B.origin_main)'" }
  if ([int]$B.commits -lt 1)                     { $bad += "commits=$($B.commits)" }
  if ([int]$B.count -lt 1)                       { $bad += "count=$($B.count)" }
  if ($B.objects_fp -eq $SHA256_OF_EMPTY_STRING) { $bad += "objects_fp is the empty-string digest" }
  if (-not $B.files -or $B.files.PSObject.Properties.Name.Count -lt 1) { $bad += "manifest is empty" }
  @{ ok = ($bad.Count -eq 0); detail = $(if ($bad.Count) { "HOLLOW BASELINE: " + ($bad -join ', ') + "  -  every comparison below would pass by matching nothing against nothing" } else { "head/refs/counts/manifest all populated" }) }
}

Check 'C01_instrument_is_outside_both_trees' 'verifier not inside the tree it verifies' {
  $me = $PSCommandPath
  @{ ok = (-not (($me -like "$Root*") -or ($me -like "$OldRoot*"))); detail = $me }
}
Check 'C02_root_is_the_new_root' 'target root exists' { @{ ok = (Test-Path -LiteralPath $Root); detail = $Root } }

$tree = Get-TreeManifest -Path $Root

Check 'C03_no_reparse_points_at_destination' 'zero cloud placeholders at destination' {
  @{ ok = ($tree.reparse -eq 0); detail = "reparse=$($tree.reparse) (baseline had $($B.reparse) inside OneDrive; destination MUST be 0)" }
}
Check 'C04_no_offline_placeholders' 'zero dehydrated files, zero unreadable' {
  @{ ok = (($tree.offline -eq 0) -and ($tree.unreadable.Count -eq 0)); detail = "offline=$($tree.offline) unreadable=$($tree.unreadable.Count) $(($tree.unreadable | Select-Object -First 6) -join ', ')" }
}
Check 'C05_onedrive_not_running' 'syncer stopped during the window' {
  $od = Get-Process OneDrive -ErrorAction SilentlyContinue
  @{ ok = (-not $od); detail = $(if ($od) { "RUNNING pid $($od.Id)" } else { 'stopped' }) }
}
Check 'C06_old_tree_renamed_or_absent' 'old path can no longer answer' {
  $still = Test-Path -LiteralPath $OldRoot
  @{ ok = (-not $still); detail = $(if ($still) { "STILL PRESENT at $OldRoot  -  every hardcoded path can silently resolve here and every check below is meaningless" } else { 'absent/renamed' }) }
}
Check 'C07_file_count_and_bytes' 'file count and total bytes match baseline' {
  @{ ok = (($tree.count -eq $B.count) -and ($tree.bytes -eq $B.bytes)); detail = "now $($tree.count)f/$($tree.bytes)b vs baseline $($B.count)f/$($B.bytes)b" }
}

Check 'C08_manifest_every_file_byte_identical' 'every file hashes identical; churn separated from corruption' {
  $missing = New-Object System.Collections.ArrayList
  $corrupt = New-Object System.Collections.ArrayList   # hash differs, mtime UNCHANGED  -  unambiguous
  $churned = New-Object System.Collections.ArrayList   # hash differs, mtime moved  -  live tree
  foreach ($p in $B.files.PSObject.Properties) {
    $rel = $p.Name
    if (-not $tree.files.ContainsKey($rel)) { [void]$missing.Add($rel); continue }
    if ($tree.files[$rel].h -ne $p.Value.h) {
      if ($tree.files[$rel].m -eq $p.Value.m) { [void]$corrupt.Add($rel) } else { [void]$churned.Add($rel) }
    }
  }
  $extra = @($tree.files.Keys | Where-Object { -not $B.files.PSObject.Properties.Name.Contains($_) })
  $ok = ($missing.Count -eq 0 -and $corrupt.Count -eq 0 -and $churned.Count -eq 0 -and $extra.Count -eq 0)
  $d = "missing=$($missing.Count) corrupted=$($corrupt.Count) churned=$($churned.Count) extra=$($extra.Count)"
  if ($missing.Count) { $d += "`n    MISSING: "   + (($missing | Select-Object -First 12) -join ', ') }
  if ($corrupt.Count) { $d += "`n    CORRUPTED (same mtime, different bytes  -  this is the copy failing): " + (($corrupt | Select-Object -First 12) -join ', ') }
  if ($churned.Count) { $d += "`n    CHANGED SINCE BASELINE (mtime moved  -  live tree, re-baseline or quiesce): " + (($churned | Select-Object -First 12) -join ', ') }
  if ($extra.Count)   { $d += "`n    EXTRA: "     + (($extra   | Select-Object -First 12) -join ', ') }
  @{ ok = $ok; detail = $d }
}

Check 'C09_nothing_wasted_md' 'the one uncommitted artifact, byte-identical' {
  $WANT_H = '615C11A09EEC8CAA51C44BC58A66BE60FA1E097203D3F3832AF701AA92624978'
  $WANT_N = 11236
  $f = Join-Path $Root 'NOTHING_WASTED.md'
  if (-not (Test-Path -LiteralPath $f)) { return @{ ok=$false; detail='ABSENT  -  unrecoverable from git; it was never committed' } }
  $h = $null
  try { $h = (Get-FileHash -LiteralPath $f -Algorithm SHA256 -ErrorAction Stop).Hash } catch { $h = $null }
  if (-not $h) { return @{ ok=$false; detail='UNREADABLE  -  present as a name, no readable content (the placeholder case)' } }
  $n = (Get-Item -LiteralPath $f).Length
  @{ ok = (($h -eq $WANT_H) -and ($n -eq $WANT_N)); detail = "sha256=$h size=$n (want $WANT_H / $WANT_N)" }
}

Check 'C10_git_toplevel_matches_root' 'git commands are running in the NEW tree' {
  $r = Invoke-Git $Root @('rev-parse','--show-toplevel')
  $g = Require-Text -Name 'show-toplevel' -Text $r.text -ExitCode $r.code -Shape '\S'
  if (-not $g.ok) { return @{ ok=$false; detail=$g.why } }
  $top = ($g.value -replace '/','\').TrimEnd('\')
  @{ ok = ($top -ieq $Root.TrimEnd('\')); detail = "toplevel=$top root=$Root" }
}
Check 'C11_git_head_and_branch' 'HEAD and branch unchanged' {
  $h = Invoke-Git $Root @('rev-parse','HEAD'); $b2 = Invoke-Git $Root @('rev-parse','--abbrev-ref','HEAD')
  $gh = Require-Text -Name 'HEAD' -Text $h.text -ExitCode $h.code -Shape '^[0-9a-f]{40}$'
  $gb = Require-Text -Name 'branch' -Text $b2.text -ExitCode $b2.code -Shape '^\S+$'
  if (-not $gh.ok) { return @{ ok=$false; detail=$gh.why } }
  if (-not $gb.ok) { return @{ ok=$false; detail=$gb.why } }
  @{ ok = (($gh.value -eq $B.head) -and ($gb.value -eq $B.branch)); detail = "$($gh.value) ($($gb.value)) vs baseline $($B.head) ($($B.branch))" }
}
Check 'C12_git_origin_agreement' 'origin/main still agrees' {
  $o = Invoke-Git $Root @('rev-parse','origin/main')
  $g = Require-Text -Name 'origin/main' -Text $o.text -ExitCode $o.code -Shape '^[0-9a-f]{40}$'
  if (-not $g.ok) { return @{ ok=$false; detail=$g.why } }
  @{ ok = ($g.value -eq $B.origin_main); detail = "$($g.value) vs $($B.origin_main)" }
}
Check 'C13_git_commit_and_ref_counts' 'commit and ref counts unchanged' {
  $c = Invoke-Git $Root @('rev-list','--all','--count'); $r = Invoke-Git $Root @('for-each-ref','--format=%(refname)')
  $gc2 = Require-Int  -Name 'commits' -Text $c.text -ExitCode $c.code -Min 1
  $gr  = Require-Text -Name 'refs'    -Text $r.text -ExitCode $r.code
  if (-not $gc2.ok) { return @{ ok=$false; detail=$gc2.why } }
  if (-not $gr.ok)  { return @{ ok=$false; detail=$gr.why } }
  $rc = @($gr.value -split "`n").Count
  @{ ok = (([int]$gc2.value -eq [int]$B.commits) -and ($rc -eq [int]$B.refs)); detail = "commits $($gc2.value)/$($B.commits) refs $rc/$($B.refs)" }
}
Check 'C14_git_object_set_fingerprint' 'the full object set is identical' {
  $o = Invoke-Git $Root @('rev-list','--objects','--all')
  $g = Require-Text -Name 'objects' -Text $o.text -ExitCode $o.code
  if (-not $g.ok) { return @{ ok=$false; detail=$g.why } }
  $sha = [System.Security.Cryptography.SHA256]::Create()
  $fp = -join ($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($g.value)) | ForEach-Object { $_.ToString('x2') })
  if ($fp -eq $SHA256_OF_EMPTY_STRING) { return @{ ok=$false; detail='fingerprint is the empty-string digest  -  git produced nothing' } }
  @{ ok = ($fp -eq $B.objects_fp); detail = "$fp vs $($B.objects_fp)" }
}
Check 'C15_git_fsck_full_strict' 'fsck output identical to baseline, not merely "passes"' {
  $f = Invoke-Git $Root @('fsck','--full','--strict')
  if ($f.code -ne 0) { return @{ ok=$false; detail="fsck exit $($f.code): $($f.text)" } }
  @{ ok = ($f.text -eq $B.fsck); detail = $(if ($f.text -eq $B.fsck) { 'identical to baseline' } else { "CHANGED:`n$($f.text)" }) }
}
Check 'C16_git_status_only_expected_untracked' 'working tree state unchanged' {
  $s = Invoke-Git $Root @('status','--porcelain')
  if ($s.code -ne 0) { return @{ ok=$false; detail="status exit $($s.code)" } }
  @{ ok = ($s.text -eq $B.status); detail = "now [$($s.text)] vs baseline [$($B.status)]" }
}
Check 'C17_git_log_fully_reachable' 'the whole history walks from HEAD' {
  $n = Invoke-Git $Root @('rev-list','--count','HEAD')
  $g = Require-Int -Name 'reachable' -Text $n.text -ExitCode $n.code -Min 1
  if (-not $g.ok) { return @{ ok=$false; detail=$g.why } }
  @{ ok = ([int]$g.value -le [int]$B.commits); detail = "reachable from HEAD: $($g.value) (all refs: $($B.commits))" }
}
Check 'C18_ambient_master_present_and_matches_installed_copy' 'one-master-two-beds still holds' {
  $master = Join-Path $Root 'dev\shell\lib\ambient.js'
  $inst   = "C:\Users\zackn\.claude\shell\ambient.js"
  if (-not (Test-Path -LiteralPath $master)) { return @{ ok=$false; detail="MASTER MISSING at $master  -  the sky will still render from the installed copy; that green is a lie" } }
  if (-not (Test-Path -LiteralPath $inst))   { return @{ ok=$false; detail="installed copy missing at $inst" } }
  $a = (Get-FileHash -LiteralPath $master -Algorithm SHA256).Hash
  $b2= (Get-FileHash -LiteralPath $inst   -Algorithm SHA256).Hash
  @{ ok = ($a -eq $b2); detail = "master=$a installed=$b2" }
}
Check 'C19_dream_vbs_target_resolves' 'the dream shim points at a file that exists' {
  $vbs = "C:\Users\zackn\AppData\Local\Consonance\dream_launch.vbs"
  if (-not (Test-Path -LiteralPath $vbs)) { return @{ ok=$false; detail='shim missing' } }
  $txt = Get-Content -LiteralPath $vbs -Raw
  $m = [regex]::Match($txt, '-File\s+""([^"]+)""')
  if (-not $m.Success) { return @{ ok=$false; detail='could not parse the -File target out of the shim  -  unparseable is a failure, not a pass' } }
  $target = $m.Groups[1].Value
  @{ ok = ((Test-Path -LiteralPath $target) -and ($target -notlike '*OneDrive*')); detail = "target=$target exists=$(Test-Path -LiteralPath $target) onedrive_path=$($target -like '*OneDrive*')" }
}
Check 'C20_scheduled_task_chain_intact' 'task -> shim -> script, all three links' {
  $t = Get-ScheduledTask -TaskName 'Consonance Dream Cycle' -ErrorAction SilentlyContinue
  if (-not $t) { return @{ ok=$false; detail='task not registered' } }
  $act = ($t.Actions | ForEach-Object { "$($_.Execute) $($_.Arguments)" }) -join ' | '
  if ([string]::IsNullOrWhiteSpace($act)) { return @{ ok=$false; detail='task registered with no readable action' } }
  $m = [regex]::Match($act, '"([^"]+\.vbs)"')
  $shimOk = $m.Success -and (Test-Path -LiteralPath $m.Groups[1].Value)
  @{ ok = ($shimOk -and $t.State -ne 'Disabled'); detail = "state=$($t.State) action=$act shim_exists=$shimOk" }
}
Check 'C21_consonance_config_paths_resolve' 'every path in ~/.consonance.json resolves' {
  $cfg = "C:\Users\zackn\.consonance.json"
  if (-not (Test-Path -LiteralPath $cfg)) { return @{ ok=$false; detail='config missing' } }
  $raw = Get-Content -LiteralPath $cfg -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) { return @{ ok=$false; detail='config is empty' } }
  $j = $null
  try { $j = $raw | ConvertFrom-Json } catch { return @{ ok=$false; detail="config did not parse: $($_.Exception.Message)" } }
  $bad = New-Object System.Collections.ArrayList
  $seen = 0
  foreach ($p in $j.PSObject.Properties) {
    $v = $p.Value
    if ($v -is [string] -and $v -match '^[A-Za-z]:\\') {
      $seen++
      if (-not (Test-Path -LiteralPath $v)) { [void]$bad.Add("$($p.Name)=$v") }
      elseif ($v -like '*OneDrive*')        { [void]$bad.Add("$($p.Name)=$v (STILL ONEDRIVE)") }
    }
  }
  if ($seen -eq 0) { return @{ ok=$false; detail='no drive-letter paths found in config  -  the check inspected nothing, which is not a pass' } }
  @{ ok = ($bad.Count -eq 0); detail = $(if ($bad.Count) { $bad -join '; ' } else { "$seen paths, all resolve, none in OneDrive" }) }
}
Check 'C22_app_binary_has_no_old_path_baked_in' 'the RUNNING binary, not the source' {
  $cands = @(
    (Join-Path $Root 'consonance\src-tauri\target\release\consonance.exe'),
    (Join-Path $Root 'consonance\src-tauri\target\debug\consonance.exe')
  ) | Where-Object { Test-Path -LiteralPath $_ }
  if (-not $cands) { return @{ ok=$false; detail='no built binary found  -  the app cannot have been rebuilt against the new path' } }
  $hits = New-Object System.Collections.ArrayList
  foreach ($c in $cands) {
    $bytes = [IO.File]::ReadAllBytes($c)
    if ($bytes.Length -eq 0) { [void]$hits.Add("$c (ZERO BYTES  -  unreadable, not clean)"); continue }
    if ([Text.Encoding]::ASCII.GetString($bytes) -match 'OneDrive\\Desktop\\projects\\lighthouse') { [void]$hits.Add($c) }
  }
  @{ ok = ($hits.Count -eq 0); detail = $(if ($hits.Count) { "OLD PATH STILL COMPILED IN: " + ($hits -join ', ') } else { "clean: " + ($cands -join ', ') }) }
}
Check 'C23_repo_sources_have_no_old_path' 'tracked sources no longer name the old path' {
  $r = Invoke-Git $Root @('grep','-lniE','OneDrive.Desktop.projects.lighthouse')
  # git grep exits 1 for "no matches"  -  that is SUCCESS here, and 2+ is a real error.
  if ($r.code -gt 1) { return @{ ok=$false; detail="git grep failed with exit $($r.code)  -  the check did not run" } }
  $lines = @()
  if ($r.text) { $lines = @($r.text -split "`n" | Where-Object { $_ }) }
  $code = @($lines | Where-Object { $_ -match '\.(rs|ps1|js|py|json|vbs)$' })
  @{ ok = ($code.Count -eq 0); detail = "code refs: $($code.Count) [" + ($code -join ', ') + "]  (prose refs ignored: $($lines.Count - $code.Count))" }
}

# ------------------------------- VERDICT --------------------------------------
$ran    = @($RESULTS.Keys)
$unrun  = @($EXPECTED | Where-Object { $ran -notcontains $_ })
$failed = @($EXPECTED | Where-Object { $RESULTS.ContainsKey($_) -and -not $RESULTS[$_].ok })

Write-Host ""
Write-Host "=================== LIGHTHOUSE MOVE VERIFICATION ===================" -ForegroundColor Cyan
Write-Host ("root: {0}    baseline: {1}" -f $Root, $B.taken_at)
Write-Host ""
foreach ($id in $EXPECTED) {
  if (-not $RESULTS.ContainsKey($id)) { Write-Host ("  [NOT RUN] {0}" -f $id) -ForegroundColor Magenta; continue }
  $r = $RESULTS[$id]
  if ($r.ok) { Write-Host ("  [  ok  ] {0}" -f $id) -ForegroundColor DarkGreen }
  else { Write-Host ("  [ FAIL ] {0}  -  {1}" -f $id, $r.what) -ForegroundColor Red; Write-Host ("           {0}" -f $r.detail) -ForegroundColor DarkYellow }
}
if ($RESULTS.ContainsKey('C00_UNREGISTERED')) { Write-Host "  [ FAIL ] an unregistered check ran  -  the surface is not what it claims" -ForegroundColor Red }

$log = Join-Path $StateDir ("verdict-" + (Get-Date -Format 'yyyyMMdd-HHmmss') + ".json")
@{ root=$Root; failed=$failed; unrun=$unrun; results=$RESULTS } | ConvertTo-Json -Depth 6 | Out-File -FilePath $log -Encoding utf8

Write-Host ""
if ($failed.Count -eq 0 -and $unrun.Count -eq 0 -and -not $RESULTS.ContainsKey('C00_UNREGISTERED')) {
  Write-Host "VERDICT: GREEN  -  $($EXPECTED.Count)/$($EXPECTED.Count) checks ran and passed." -ForegroundColor Green
  Write-Host "NOT proven by this script: a full unattended dream cycle (needs a night), and a cold" -ForegroundColor DarkGray
  Write-Host "pane waking on the full brief. Both remain pending. detail: $log" -ForegroundColor DarkGray
  exit 0
} else {
  Write-Host "VERDICT: RED  -  failed: $($failed.Count), NOT RUN: $($unrun.Count) of $($EXPECTED.Count)." -ForegroundColor Red
  if ($unrun.Count) { Write-Host "A check that did not run is a RED, never a pass: $($unrun -join ', ')" -ForegroundColor Red }
  Write-Host "detail: $log" -ForegroundColor DarkGray
  exit 1
}
