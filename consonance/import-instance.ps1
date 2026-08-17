# import-instance.ps1 - bring one Consonance instance from another machine onto this one.
#
# The runtime state of an instance (its Claude transcript + its instance dir + its registry
# entry) lives OUTSIDE the git repo and is host-specific: the transcript embeds the origin
# machine's user path (C:\Users\<fromUser>\...). This tool relocates one instance onto THIS
# host - rewriting that host-specific path - so Claude Code can `--continue` it here. It is
# the system-agnostic half of the transfer the repo (room/record) already does.
#
# It NEVER touches the public repo. Bundles move over a private channel (USB / direct copy /
# private repo) - dreams and transcripts hold the keeper's life; .gitignore draws that line.
#
# DRY-RUN BY DEFAULT. It prints every action and the rewrite audit, and changes nothing until
# you pass -Apply. Idempotent: re-running never duplicates a pane or recycles a letter.
#
# ASCII-only on purpose: Windows PowerShell 5.1 reads a BOM-less UTF-8 .ps1 as ANSI and
# mangles any non-ASCII char, breaking the parse. Keep it plain.
#
# A BUNDLE is a folder holding, from the origin machine:
#   <bundle>\instance\            the instance dir (its CLAUDE.md intake, capture logs)
#   <bundle>\transcript\*.jsonl   the Claude Code transcript(s) for that instance
# (If your copy has a different shape, point -InstanceDir and -Transcript explicitly.)
#
# Example (Around, dry run then apply):
#   .\import-instance.ps1 -BundleDir D:\around-bundle -Name sibling-XXXX -Label "Around"
#   .\import-instance.ps1 -BundleDir D:\around-bundle -Name sibling-XXXX -Label "Around" -Apply

param(
  [Parameter(Mandatory=$true)][string]$BundleDir,
  # target instance name under C:\Consonance\instances. DEFAULT: preserve the origin dir name
  # (keeps cwd - and therefore the Claude project-slug - identical, so only the user path is rewritten).
  [string]$Name,
  [string]$Label,
  [string]$Letter,                       # optional; default = first free A-Z
  # Origin machine's Windows user - the path segment to rewrite. MANDATORY on purpose: the
  # script cannot infer it, and a default here is a live value a stranger runs with. It used
  # to default to a real account name, which is wrong for everyone who is not that account.
  [Parameter(Mandatory=$true)][string]$FromUser,
  [string]$ToUser   = $env:USERNAME,     # this machine's user
  [string]$InstanceDir,                  # override bundle\instance auto-detect
  [string]$Transcript,                   # override bundle\transcript auto-detect
  [switch]$Apply                         # perform; without it, dry run
)

$ErrorActionPreference = 'Stop'
function Say($m,$c='Gray'){ Write-Host $m -ForegroundColor $c }
function Utf8Read($p){ [System.IO.File]::ReadAllText($p,[System.Text.Encoding]::UTF8) }
function Utf8Write($p,$s){ [System.IO.File]::WriteAllText($p,$s,(New-Object System.Text.UTF8Encoding($false))) } # no BOM: Rust reads these raw

$INSTANCES = 'C:\Consonance\instances'
$DATA      = 'C:\Consonance\data'
$PROJECTS  = Join-Path $env:USERPROFILE '.claude\projects'

# --- locate the two pieces in the bundle ------------------------------------------------------
if (-not $InstanceDir) {
  $InstanceDir = Join-Path $BundleDir 'instance'
  if (-not (Test-Path $InstanceDir)) { $InstanceDir = $BundleDir } # tolerate a flat bundle
}
if (-not (Test-Path $InstanceDir)) { throw "no instance dir found (looked at $InstanceDir)" }
if (-not $Transcript) {
  $tdir = Join-Path $BundleDir 'transcript'
  if (Test-Path $tdir) { $search = $tdir } else { $search = $BundleDir }
  $js = @(Get-ChildItem $search -Recurse -Filter *.jsonl -ErrorAction SilentlyContinue)
  if (-not $js) { throw "no .jsonl transcript found under $search - pass -Transcript explicitly" }
  if ($js.Count -gt 1) { Say "  note: $($js.Count) transcripts found; importing the largest (the real thread)" 'DarkYellow' }
  $Transcript = ($js | Sort-Object Length -Descending | Select-Object -First 1).FullName
}

if (-not $Name) { $Name = Split-Path $InstanceDir -Leaf }   # preserve origin name by default
$targetCwd  = Join-Path $INSTANCES $Name
$slug       = 'C--Consonance-instances-' + $Name            # Claude's project-slug for that cwd
$targetProj = Join-Path $PROJECTS $slug
$tsName     = Split-Path $Transcript -Leaf
$tsMB       = [math]::Round((Get-Item $Transcript).Length/1MB,2)

Say ''
if ($Apply) { Say "  import-instance  [APPLY]" 'Cyan' } else { Say "  import-instance  [DRY RUN]" 'Cyan' }
Say "    from user : $FromUser   ->   to user : $ToUser"
Say "    instance  : $InstanceDir"
Say "    transcript: $Transcript ($tsMB MB)"
Say "    target cwd: $targetCwd"
Say "    project   : $targetProj\$tsName"
Say ''

# --- the rewrite (audited) --------------------------------------------------------------------
# A transcript is CONVERSATION, not just paths: the origin username can appear in prose, in
# quoted output, in URLs, as a substring of a longer token. The previous version replaced the
# bare name everywhere and then "verified" the result by counting residual occurrences - but
# .Replace() is global, so that count was necessarily zero and the guard could never fire. It
# was a tautology printed as a verification, and it failed the other way too: if $ToUser
# CONTAINS $FromUser (zack -> zackn is exactly that shape) every rewritten path counted as
# residual and a legitimate import was refused.
#
# So: rewrite only the ANCHORED path forms, and report bare-name occurrences to a human
# instead of silently overwriting them. Under-rewriting is recoverable; corrupting the prose
# of a transcript is not.
$raw = Utf8Read $Transcript
$total = 0   # path occurrences rewritten; initialised here so the [2/3] line can report it in BOTH branches
if ($FromUser -eq $ToUser) {
  Say "  rewrite: origin and target user are both '$FromUser' - nothing to rewrite" 'Green'
  $rewritten = $raw
} else {
  # Every shape a Windows user path takes in a Claude Code transcript: raw, JSON-escaped,
  # forward-slashed, and the encoded project-directory slug.
  $forms = @(
    @{ from = "\Users\$FromUser";     to = "\Users\$ToUser" }      # raw
    @{ from = "\\Users\\$FromUser";   to = "\\Users\\$ToUser" }    # JSON-escaped
    @{ from = "/Users/$FromUser";     to = "/Users/$ToUser" }      # forward slash
    @{ from = "C--Users-$FromUser-";  to = "C--Users-$ToUser-" }   # encoded project dir
  )
  $rewritten = $raw
  foreach ($f in $forms) {
    $n = ([regex]::Matches($rewritten, [regex]::Escape($f.from))).Count
    if ($n -gt 0) {
      $rewritten = $rewritten.Replace($f.from, $f.to)
      Say "  rewrite: $n x '$($f.from)' -> '$($f.to)'"
      $total += $n
    }
  }
  Say "  rewrite: $total path occurrence(s) rewritten" $(if ($total) { 'Green' } else { 'Yellow' })
  if ($total -eq 0) {
    Say "  WARNING: no path form of '$FromUser' was found. Is -FromUser right for this bundle?" 'Yellow'
  }
  # Now a residual check that can actually fail: what is LEFT is by construction not a path
  # form, so it is prose. Reported, never rewritten, and never fatal - a transcript that
  # legitimately discusses the origin username is still a valid transcript.
  $loose = ([regex]::Matches($rewritten, [regex]::Escape($FromUser))).Count
  if ($loose -gt 0) {
    Say "  note: '$FromUser' still appears $loose time(s) outside a path (prose, quotes, URLs)." 'Yellow'
    Say "        Left alone on purpose. Inspect if that matters to you." 'Yellow'
  }
}

# --- registry preview -------------------------------------------------------------------------
$panesPath = Join-Path $DATA 'panes.json'
$lettersPath = Join-Path $DATA 'letters.json'
$panes = @(); if (Test-Path $panesPath) { $panes = @((Utf8Read $panesPath | ConvertFrom-Json)) }
$existing = $panes | Where-Object { $_.cwd -eq $targetCwd }
$newPaneId = [guid]::NewGuid().ToString()
$letters = [ordered]@{}
if (Test-Path $lettersPath) { (Utf8Read $lettersPath | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $letters[$_.Name] = $_.Value } }
if (-not $Letter) { foreach ($c in [char[]](65..90)) { if (@($letters.Values) -notcontains "$c") { $Letter = "$c"; break } } }

if ($existing) { Say "  registry: cwd already registered as pane $($existing.pane) (letter $($letters[$existing.pane])) - will not duplicate" 'DarkYellow' }
else { Say "  registry: + pane $newPaneId  letter $Letter  label '$Label'" }

if (-not $Apply) {
  Say ''
  Say "  DRY RUN - nothing written. Re-run with -Apply to perform." 'Cyan'
  Say "  (After applying, restart Consonance; the pane restores from panes.json on launch.)" 'DarkGray'
  return
}

# --- APPLY ------------------------------------------------------------------------------------
if (Get-Process -Name 'consonance' -ErrorAction SilentlyContinue) {
  Say "  Consonance is open - the import will land, but restart it to see the pane." 'Yellow'
}
# 1. instance dir
New-Item -ItemType Directory -Force -Path $targetCwd | Out-Null
Copy-Item -Recurse -Force (Join-Path $InstanceDir '*') $targetCwd
Say "  [1/3] instance dir -> $targetCwd" 'Green'
# 2. rewritten transcript
New-Item -ItemType Directory -Force -Path $targetProj | Out-Null
$dstTs = Join-Path $targetProj $tsName
if (Test-Path $dstTs) { Say "        transcript already present - overwriting with rewritten copy" 'DarkYellow' }
Utf8Write $dstTs $rewritten
Say "  [2/3] transcript ($total paths rewritten) -> $dstTs" 'Green'
# 3. registry (guard row count; never write a list that lost rows)
if (-not $existing) {
  $row = [pscustomobject]@{ pane = $newPaneId; cwd = $targetCwd; label = $Label }
  $out = @($panes) + $row
  if ($out.Count -ne $panes.Count + 1) { throw "refusing panes.json write: expected $($panes.Count + 1) rows, built $($out.Count)" }
  # PS 5.1 ConvertTo-Json serializes a SINGLE-element array as a bare object, not a 1-element array.
  # Rust reads this file as Vec<KeptPane> via from_str(...).ok().unwrap_or_default(), so a bare object
  # fails to parse and silently yields ZERO kept panes - the imported pane never restores while this
  # script still prints "registered pane" in green. Force array framing when there is only one row.
  $panesJson = $out | ConvertTo-Json -Depth 6
  if ($out.Count -eq 1) { $panesJson = "[$panesJson]" }
  Utf8Write $panesPath $panesJson
  $letters[$newPaneId] = $Letter
  Utf8Write $lettersPath ($letters | ConvertTo-Json -Depth 6)
  Say "  [3/3] registered pane $newPaneId as letter $Letter" 'Green'
} else { Say "  [3/3] registry unchanged (already present)" 'DarkGray' }
Say ''
Say "  Done. Restart Consonance - $Name restores as letter $Letter beside Main." 'Green'
