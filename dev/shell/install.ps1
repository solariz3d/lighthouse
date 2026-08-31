# dev/shell/install.ps1 — put this machine's hook dir in sync with the repo.
#
# WHY. Hooks are copied out of the repo into ~/.claude/shell, so the two can
# drift silently: on 2026-07-25 an audit found sessionstart-ambient.js running on
# one machine and existing nowhere in the repo, hardcoding an absolute path that
# would have been wrong anywhere else. Files that only exist on one disk cannot
# be reviewed, cannot be fixed once, and cannot reach the other bed.
#
# The repo is the master. This script makes a machine match it, and says exactly
# what it changed. Idempotent — safe to re-run after every pull.
#
#   pwsh dev/shell/install.ps1            # sync files + register hooks
#   pwsh dev/shell/install.ps1 -Check     # report drift only, change nothing
#   pwsh dev/shell/install.ps1 -NoRegister  # files only, print the block instead
#
# ── 2026-08-17: WHY THIS NOW EDITS settings.json, REVERSING A DELIBERATE REFUSAL ────────────
#
# The header used to say: "It deliberately does NOT edit ~/.claude/settings.json… a one-time
# registration is not the thing that drifts." That was wrong in the specific way that matters —
# registration IS the thing that drifts, because it is the only step a machine can skip silently.
# Measured on the desktop the morning of 2026-08-17, after two machines had been used in
# alternation for weeks:
#
#   * THIS SCRIPT HAD NEVER BEEN RUN HERE. None of its managed files existed in $dest.
#   * NINE of the hooks actually registered and running were in NO repository at all — including
#     precompact.js, which writes the keeper's checkpoints, and l3-overseer.js, which writes the
#     arc-perceptions he reads every turn. One disk, no review, no way to reach the other machine.
#   * The manifest did not name a single file this machine ran. It was an installer for a set
#     nobody had registered, while the registered set was unmanaged.
#   * THREE conventions were live at once: ~/.claude/shell/hooks/ (registered), ~/.claude/shell/
#     (this script's target, empty), and two hooks pointed straight at repo paths.
#
# Printing a block for a human to paste is what produced that. So this now does the registration,
# and does it the only way that is safe on a file the user also owns:
#   MERGE, never replace — unknown events and unrelated keys are preserved untouched.
#   BACK UP first, timestamped, every run that changes anything.
#   IDEMPOTENT — matching by resolved command path, so re-running adds nothing.
#   NEVER REMOVE a hook this script does not manage. A hook it did not install is not its business.
#
# ── AND WHY lib/ RATHER THAN FLAT ───────────────────────────────────────────────────────────
#
# The old manifest flattened ambient.js to $dest\ambient.js. The RUNNING session-start.js resolves
# it at `SHELL_DIR/lib/ambient.js` (session-start.js:17) and precompact.js and session-start.js
# both require fresh-guard.js from the same place. The live layout was right and the manifest was
# the outlier. The two copies of ambient.js were byte-identical, so this reconciliation had no
# content conflict to settle — only a path one.

[CmdletBinding()]
param([switch]$Check, [switch]$NoRegister)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)   # …/lighthouse
$dest = Join-Path $env:USERPROFILE '.claude\shell'

# source -> installed RELATIVE path. `lib\` entries keep their directory because that is where the
# requiring hooks look; hooks land in `hooks\` because that is where the registered ones already
# were and moving a running system to satisfy a convention is how you break it.
$files = @(
  @{ From = 'dev\shell\lib\ambient.js';                  To = 'lib\ambient.js';     Lib = $true }
  @{ From = 'dev\shell\lib\fresh-guard.js';              To = 'lib\fresh-guard.js'; Lib = $true }

  # The nine that were running and untracked until 58b94f9. These are the ones the machine
  # actually executes; they were the whole reason for that commit.
  @{ From = 'dev\shell\hooks\session-start.js';          To = 'hooks\session-start.js' }

  # HOLD = a REAL two-way conflict between the repo and this machine, reported and never
  # overwritten. Not a TODO — the point of a reconciler is that the one case it cannot decide is
  # the one case it must not decide silently.
  #
  # userprompt-submit.js, measured 2026-08-17: 83 lines genuinely differ once CRLF is normalised
  # (the raw diff reads 495 and is almost entirely line endings — do not trust it). 69 lines exist
  # only in the repo, including a BOM-strip fix in loadState() caught 2026-07-25 whose absence
  # silently blanks the thread's age; 14 exist only on this machine. Both emit the beacon, both
  # exit 0 on a real payload. Whichever is discarded loses something.
  #
  # A/B-ing them live does not work either: both write the same state file, so running one
  # consumes what the other would have surfaced. The first attempt at that test produced a clean
  # 898-vs-117-byte result that meant nothing.
  @{ From = 'dev\shell\hooks\userprompt-submit.js';      To = 'hooks\userprompt-submit.js'; Hold = $true }
  @{ From = 'dev\shell\hooks\stop.js';                   To = 'hooks\stop.js' }
  @{ From = 'dev\shell\hooks\session-end.js';            To = 'hooks\session-end.js' }
  @{ From = 'dev\shell\hooks\precompact.js';             To = 'hooks\precompact.js' }
  @{ From = 'dev\shell\hooks\l2-overseer.js';            To = 'hooks\l2-overseer.js' }
  @{ From = 'dev\shell\hooks\l2-overseer-worker.js';     To = 'hooks\l2-overseer-worker.js'; Lib = $true }
  @{ From = 'dev\shell\hooks\l3-overseer.js';            To = 'hooks\l3-overseer.js' }
  @{ From = 'dev\shell\hooks\l3-overseer-worker.js';     To = 'hooks\l3-overseer-worker.js'; Lib = $true }

  @{ From = 'dev\shell\hooks\sessionstart-ambient.js';   To = 'sessionstart-ambient.js' }
  @{ From = 'dev\shell\hooks\userprompt_pulse.py';       To = 'userprompt_pulse.py' }
  # Lib = $true: a library REQUIRED BY a hook, not a hook the host runs. It receives no stdin and
  # emits nothing, so the dream-gate invariant does not apply and dream-gate.test.js skips it.
  # Declared rather than inferred from a `\lib\` path, because board-digest requires it as
  # './blind.js' from its own directory — moving the file to satisfy a path convention would break
  # that require in the repo or after the flattening install, whichever end you fix.
  #
  # IT WAS MISSING FROM THIS MANIFEST UNTIL 2026-08-17, and the gap was invisible because the
  # INSTALLED board-digest.js predated the dependency. Syncing the repo's current version shipped a
  # require the installer did not carry, and every UserPromptSubmit after that printed
  # "Cannot find module './blind.js'" to the keeper. A fresh install on any other machine would have
  # done the same on its first prompt.
  @{ From = 'consonance\hooks\blind.js';                 To = 'blind.js'; Lib = $true }
  @{ From = 'consonance\hooks\board-digest.js';          To = 'board-digest.js' }
  @{ From = 'consonance\hooks\transcript-watch.js';      To = 'transcript-watch.js' }
  @{ From = 'consonance\hooks\dream-watch.js';           To = 'dream-watch.js' }
  @{ From = 'consonance\hooks\ferry-watch.js';           To = 'ferry-watch.js' }
  @{ From = 'consonance\hooks\sourced-stop.js';          To = 'sourced-stop.js' }
  @{ From = 'consonance\hooks\findings-return.js';       To = 'findings-return.js' }
  # Added 2026-08-18 with the hook itself, deliberately in the same commit. Nine hooks existed
  # ONLY as installed copies until 58b94f9 because each was registered by hand and the manifest
  # was updated later or never; a file that runs on this machine and exists nowhere else is the
  # failure that commit was written to end. The registration and the manifest entry ship together
  # or the next fresh install silently loses the hook.
  @{ From = 'consonance\hooks\precompact-preserve.js';   To = 'precompact-preserve.js' }
  # Added 2026-08-18 with the hook, same commit, same reason as the line above: registration and
  # manifest ship together or a fresh install silently loses it.
  @{ From = 'consonance\hooks\sessionstart-state.js';     To = 'sessionstart-state.js' }
  # Added 2026-08-24 with its registration below, same commit, same reason as the two entries
  # above. This one is a PreToolUse gate, so it also needed Matcher support in $register -- an
  # unmatched PreToolUse hook fires on every tool call in the session.
  @{ From = 'consonance\hooks\dispatch-gate.js';          To = 'dispatch-gate.js' }
  # Added 2026-08-24 with its registration below, same commit, same reason as the entries above.
  # It is a Stop hook rather than a PreCompact one ON PURPOSE: precompact.js resolves its script
  # under %USERPROFILE%\Desktop\lighthouse, which does not exist on the laptop, so the PreCompact
  # chain the record describes as "residue fired from checkpoint" has never run on this machine.
  # Copying that wiring would have shipped a trigger that is a no-op here. See the hook's header.
  @{ From = 'consonance\hooks\carrier-drift-watch.js';    To = 'carrier-drift-watch.js' }
)

# What this script REGISTERS. Only these are ever touched in settings.json; anything else found
# there is left exactly as it is. Order within an event is preserved on re-run.
#   Rel   — path under $dest, so the installed copy runs, never the repo working tree. Registering
#           a repo path (done by hand on 2026-08-15) means a pull silently changes what executes
#           mid-session and the installer cannot manage it.
#   Runner— 'node' or 'py'.
#   Conflicts — leaf names of OTHER files that must not be live on the same event when this one is
#           registered. The registration step REFUSES to add the entry if one is, and -Check reports
#           both live as a finding. Exists for the pulse (below); nothing else uses it yet.
$register = @(
  @{ Event = 'SessionStart';     Rel = 'hooks\session-start.js';      Runner = 'node' }
  # THE PULSE — 2026-08-31 (L022 P2b, pane Around). This line used to declare the NODE pulse,
  # `hooks\userprompt-submit.js`. It never described any machine this script has run on: the file
  # is Hold in the manifest (never copied), so a bare run REGISTERED a hook against a path the same
  # run refused to create — node against a missing file, every prompt, every pane
  # (loop/absent_hooks_ruling_2026-08-25.md, "cannot be installed by this installer"). Meanwhile the
  # pulse that actually runs here, userprompt_pulse.py, was installed at $files:89 and declared
  # nowhere, so -Check called it REGISTERED, NOT DECLARED for six days. Declaring Python WITHOUT
  # removing the Node line would have left two pulses declared on one event and a fresh install
  # wiring both. So: Python declared, Node line REMOVED. The manifest Hold entry for the Node FILE
  # is kept as it was — nothing is deleted, and the desktop, which this script cannot see, keeps
  # whatever it runs (this script never unregisters). If the desktop runs the Node pulse its -Check
  # will now say REGISTERED, NOT DECLARED for it, which is the true state and the reason the
  # Conflicts guard below exists: on THAT machine a bare run must not add a second pulse either.
  @{ Event = 'UserPromptSubmit'; Rel = 'userprompt_pulse.py';         Runner = 'py';
     Conflicts = @('userprompt-submit.js') }
  @{ Event = 'UserPromptSubmit'; Rel = 'findings-return.js';          Runner = 'node' }
  @{ Event = 'Stop';             Rel = 'hooks\stop.js';               Runner = 'node' }
  @{ Event = 'Stop';             Rel = 'hooks\l2-overseer.js';        Runner = 'node' }
  @{ Event = 'Stop';             Rel = 'hooks\l3-overseer.js';        Runner = 'node' }
  @{ Event = 'Stop';             Rel = 'sourced-stop.js';             Runner = 'node' }
  @{ Event = 'SessionEnd';       Rel = 'hooks\session-end.js';        Runner = 'node' }
  @{ Event = 'PreCompact';       Rel = 'hooks\precompact.js';         Runner = 'node' }
  # Added 2026-08-18, AFTER the manifest entries above shipped without them. Both hooks were in
  # $files from the start, so a fresh install copied the .js and registered neither: the desktop
  # would have pulled the repo, run this script, and received two files that never fire. Found by
  # -Check reporting 'ok' on both -- which only ever meant 'the bytes match', never 'it is wired
  # up'. The comment at the $files entries already said registration and manifest ship together;
  # the comment shipped and the registration did not.
  @{ Event = 'PreCompact';       Rel = 'precompact-preserve.js';      Runner = 'node' }
  @{ Event = 'SessionStart';     Rel = 'sessionstart-state.js';       Runner = 'node' }
  # The dispatch gate. Matcher-scoped on purpose: it must see the two verbs that put text into
  # another seat's pane and nothing else. It ASKS rather than blocks, and fails open on any error.
  @{ Event = 'PreToolUse';       Rel = 'dispatch-gate.js';            Runner = 'node';
     Matcher = 'mcp__consonance__chair_inject|mcp__consonance__call_chair' }
  # Carrier drift. Silent when green, silent when the same red is already outstanding, and it
  # writes a ledger row on EVERY firing including the silent ones -- a hook that is quiet because
  # it is working reads exactly like a hook that was never installed, which is what the dispatch
  # gate's first probe cost to learn.
  @{ Event = 'Stop';             Rel = 'carrier-drift-watch.js';      Runner = 'node' }
)

if (-not (Test-Path $dest)) {
  if ($Check) { Write-Host "MISSING dir  $dest" -ForegroundColor Yellow }
  else { New-Item -ItemType Directory -Force -Path $dest | Out-Null; Write-Host "created $dest" }
}

$drift  = 0   # exists at the destination and the bytes differ
$absent = 0   # not at the destination at all - a different fact, and it used to print as drift
$held   = 0
foreach ($f in $files) {
  $src = Join-Path $repo $f.From
  $dst = Join-Path $dest $f.To

  if (-not (Test-Path $src)) {
    Write-Host ("ABSENT FROM REPO  {0}" -f $f.From) -ForegroundColor Red
    $drift++
    continue
  }

  # TWO FACTS, NOT ONE. Until 2026-08-24 this computed only $same, which is false both when the
  # destination file is MISSING and when its bytes DIFFER -- so both printed "DRIFT". Pane C
  # measured the cost: 13 of 14 flagged files did not exist at the destination at all, and the
  # chair had asked for a per-file drift DIRECTION, a question twelve of them cannot answer
  # because they are not drifted in any direction. They were never installed.
  $exists = Test-Path $dst
  $same = $false
  if ($exists) {
    $same = (Get-FileHash $src).Hash -eq (Get-FileHash $dst).Hash
  }

  if ($same) {
    Write-Host ("ok       {0}" -f $f.To) -ForegroundColor DarkGray
  } elseif (-not $exists) {
    # NEVER INSTALLED. Deliberately BEFORE the Hold branch: a two-way conflict needs two sides,
    # and userprompt-submit.js was reporting HOLD about a file that is not there.
    if ($Check) {
      Write-Host ("ABSENT   {0}   never installed - nothing to compare" -f $f.To) -ForegroundColor Cyan
      $absent++
    } else {
      $dstDir = Split-Path -Parent $dst
      if ($dstDir -and -not (Test-Path $dstDir)) { New-Item -ItemType Directory -Force -Path $dstDir | Out-Null }
      Copy-Item $src $dst -Force
      Write-Host ("installed {0}" -f $f.To) -ForegroundColor Green
      $absent++
    }
  } elseif ($f.Hold) {
    # Differs, and declared unresolvable by this script. Say so loudly every run, in both modes,
    # and change nothing. A conflict that stops being mentioned is a conflict that gets resolved
    # by whoever happens to run the installer next, in whichever direction they happen to run it.
    Write-Host ("HOLD     {0}   two-way conflict - NOT overwritten (see the manifest comment)" -f $f.To) -ForegroundColor Magenta
    $held++
  } elseif ($Check) {
    Write-Host ("DRIFT    {0}" -f $f.To) -ForegroundColor Yellow
    $drift++
  } else {
    # Never overwrite a modified install without keeping the old copy: it may be
    # the only place an un-pushed fix exists. This is not hypothetical — nine files
    # existed ONLY as installed copies until 2026-08-17.
    if ((Test-Path $dst) -and -not $same) {
      Copy-Item $dst "$dst.bak-$(Get-Date -Format yyyyMMdd-HHmmss)" -Force
    }
    # `To` may now carry a directory (lib\, hooks\); create it before copying.
    $dstDir = Split-Path -Parent $dst
    if ($dstDir -and -not (Test-Path $dstDir)) { New-Item -ItemType Directory -Force -Path $dstDir | Out-Null }
    Copy-Item $src $dst -Force
    Write-Host ("synced   {0}" -f $f.To) -ForegroundColor Green
    $drift++
  }
}

# =============================================================================================
# THE UNIVERSE PRINT -- N seen / M skipped / the rule that decided, on every run.
#
# P-UNIVERSE, registered 2026-08-25. This instrument's denominator is the $files manifest above,
# and a manifest is hand-maintained: a file that is not on it is not GREEN, it is INVISIBLE.
# That is measured history here, not a worry. Nine hooks ran untracked until 58b94f9, and one
# manifest entry was missing until 2026-08-17 -- and through both, this script printed a clean
# bill of health, because it can only ever check what somebody remembered to list.
#
# So the counts below are not a summary of the check. They are the check's BLIND SPOT, printed,
# so that a green line above is read as "everything listed is in sync" and never as "everything
# is in sync". carrier-drift.js:73-78 states the same law for its corpus: a rule that silently
# ate half the repo would look exactly like a green tree.
#
# PATH-MISMATCH is the category that pays for this block. 'lib\ambient.js' prints ABSENT above
# while a byte-identical ambient.js sits FLAT at the destination and is the copy actually being
# loaded -- sessionstart-ambient.js resolveAmbient() tries __dirname/ambient.js FIRST, before the
# ..\lib\ candidate. The file is installed, live, and in sync. The ok/ABSENT loop compares exact
# paths, so it is right about the path and wrong about the file, and it had no way to say so.
#
# The rules are printed with the counts on purpose. A skipped count whose rule is not stated is
# the same defect one level up: a denominator you cannot audit.
$mfFrom = @{}
$mfToLeaf = @{}
$mfToRel = @{}
foreach ($f in $files) {
  $mfFrom[$f.From.ToLower()] = $true
  $mfToRel[$f.To.ToLower()] = $true
  $mfToLeaf[(Split-Path -Leaf $f.To).ToLower()] = $f.To
}

# ---- A. THE SOURCE UNIVERSE: every file in the directories the manifest itself draws from.
# The directory list is DERIVED from the manifest rather than written out, so a manifest entry
# pointing somewhere new brings its whole directory under audit automatically. A hardcoded list
# would be a second hand-maintained denominator guarding the first one.
$srcDirs = @()
foreach ($f in $files) {
  $d = Split-Path -Parent $f.From
  if ($d -and ($srcDirs -notcontains $d)) { $srcDirs += $d }
}
$srcSeen = 0
$srcSkipped = 0
$srcClaimed = 0
$srcUnmanaged = @()
foreach ($d in $srcDirs) {
  $full = Join-Path $repo $d
  if (-not (Test-Path $full)) { continue }
  foreach ($file in (Get-ChildItem -Path $full -File -ErrorAction SilentlyContinue)) {
    $srcSeen++
    if ($file.Name -match '\.test\.js$' -or $file.Name -match '\.md$' -or $file.Name -match '\.bak') {
      $srcSkipped++
      continue
    }
    $rel = Join-Path $d $file.Name
    if ($mfFrom.ContainsKey($rel.ToLower())) { $srcClaimed++ }
    else { $srcUnmanaged += $rel }
  }
}

# ---- B. THE DESTINATION UNIVERSE: everything actually sitting where the hooks are loaded from.
# Recursive, because the manifest's own 'lib\' and 'hooks\' paths would otherwise fall outside a
# top-level-only sweep -- an audit that cannot see the layout it prescribes.
$dstSeen = 0
$dstState = 0
$dstClaimed = 0
$dstMismatch = @()
$dstUnclaimed = @()
if (Test-Path $dest) {
  foreach ($file in (Get-ChildItem -Path $dest -File -Recurse -ErrorAction SilentlyContinue)) {
    $dstSeen++
    if ($file.Name -match '\.(json|jsonl|log|md|txt)$' -or $file.Name -match '\.bak') {
      $dstState++
      continue
    }
    $rel = $file.FullName.Substring($dest.Length).TrimStart('\')
    $leaf = $file.Name.ToLower()
    if ($mfToRel.ContainsKey($rel.ToLower())) { $dstClaimed++ }
    elseif ($mfToLeaf.ContainsKey($leaf)) { $dstMismatch += ("{0}   manifest expects it at {1}" -f $rel, $mfToLeaf[$leaf]) }
    else { $dstUnclaimed += $rel }
  }
}

Write-Host ""
Write-Host "universe -- what this run could and could not see" -ForegroundColor Cyan
Write-Host ("  manifest      {0,4} entr(ies)   the denominator; a file absent from it is INVISIBLE, not green" -f $files.Count)
Write-Host ("  repo sources  {0,4} file(s) under {1}" -f $srcSeen, ($srcDirs -join ', '))
Write-Host ("                {0,4} skipped     rule: *.test.js, *.md, *.bak*" -f $srcSkipped)
Write-Host ("                {0,4} claimed by a manifest entry" -f $srcClaimed)
Write-Host ("                {0,4} UNMANAGED   in the repo, installable, on no manifest entry" -f $srcUnmanaged.Count) -ForegroundColor $(if ($srcUnmanaged.Count) { 'Yellow' } else { 'DarkGray' })
foreach ($u in $srcUnmanaged) { Write-Host ("                     {0}" -f $u) -ForegroundColor Yellow }
Write-Host ("  destination   {0,4} file(s) under {1}" -f $dstSeen, $dest)
Write-Host ("                {0,4} skipped     rule: *.json, *.jsonl, *.log, *.md, *.txt, *.bak*  (runtime state, not code)" -f $dstState)
Write-Host ("                {0,4} claimed at the exact path the manifest names" -f $dstClaimed)
Write-Host ("                {0,4} PATH-MISMATCH  installed, but under a path the manifest expects elsewhere" -f $dstMismatch.Count) -ForegroundColor $(if ($dstMismatch.Count) { 'Yellow' } else { 'DarkGray' })
foreach ($m in $dstMismatch) { Write-Host ("                     {0}" -f $m) -ForegroundColor Yellow }
Write-Host ("                {0,4} UNCLAIMED   code at the destination no manifest entry owns" -f $dstUnclaimed.Count) -ForegroundColor $(if ($dstUnclaimed.Count) { 'Yellow' } else { 'DarkGray' })
foreach ($u in $dstUnclaimed) { Write-Host ("                     {0}" -f $u) -ForegroundColor Yellow }
# =============================================================================================

if ($held -gt 0) {
  Write-Host ("`n{0} file(s) HELD - a real two-way conflict this script refuses to decide." -f $held) -ForegroundColor Magenta
  Write-Host "Resolve by hand, then drop Hold from the manifest entry." -ForegroundColor Magenta
}

if ($Check) {
  # ---- THE REGISTRATION UNIVERSE -- P-UNIVERSE CLAUSE 2.
  #
  # Clause 2: show a red on a known positive before any green is believed, or declare yourself
  # inert. Until 2026-08-25 this block did not exist, and -Check was INERT on the one class it most
  # needed to catch. `ok` above has only ever meant THE BYTES MATCH. It has never meant THE HOOK IS
  # WIRED UP -- and this file's own header records what that cost, twice:
  #
  #   2026-08-17  nine hooks were registered and running that no repository contained.
  #   2026-08-18  precompact-preserve.js and sessionstart-state.js were in $files from the start,
  #               so a fresh install copied both and registered neither. The comment naming the
  #               lesson shipped in the same commit as the defect; the check for it did not.
  #
  # The positive this block fires on was OBSERVED, not planted. Measured on this laptop the night it
  # was written: six hooks are registered and running, sit in $files, print `ok` above, and appear
  # nowhere in $register. A fresh clone installed on a new machine copies all six and wires none.
  #
  # THE AUTHORITY IS settings.json AND THERE IS NO FALLBACK. If it cannot be read the answer is
  # UNKNOWN and the exit code does not move. A guess about what is registered is worse than a
  # refusal, because a printed guess reads as audited.
  #
  # MATCHED ON EXACT LEAF EQUALITY, never substring. Test-SameHook needs a separator guard because
  # `stop.js` is a substring of `sourced-stop.js` and matching bare cost a destroyed registration on
  # 2026-08-17 11:59. Exact equality cannot reproduce that by construction.
  $regUnknown = $null
  $sj = $null
  $settingsCheck = Join-Path $env:USERPROFILE '.claude\settings.json'
  if (-not (Test-Path $settingsCheck)) { $regUnknown = "no settings.json at $settingsCheck" }
  else {
    try { $sj = Get-Content $settingsCheck -Raw | ConvertFrom-Json }
    catch { $regUnknown = "settings.json does not parse - not guessing" }
  }

  $liveLeaf = @{}
  $liveCount = 0
  $eventCount = 0
  if (-not $regUnknown) {
    if ($sj.hooks) {
      foreach ($p in $sj.hooks.PSObject.Properties) {
        $eventCount++
        # @() twice on purpose: PS 5.1 deserialises a one-item list as a bare object, and a bare
        # object read as a list is ZERO items, silently. That exact serialisation bug cost a day on
        # the pane list (9e74004) and the registration loop below already guards against it.
        foreach ($g in @($p.Value)) {
          foreach ($h in @($g.hooks)) {
            if (-not $h.command) { continue }
            $liveCount++
            $qs = [regex]::Matches($h.command, '"([^"]*)"')
            if ($qs.Count -gt 0) { $sp2 = $qs[$qs.Count - 1].Groups[1].Value } else { $sp2 = $h.command.Trim() }
            $lf = (Split-Path -Leaf $sp2).ToLower()
            if ($lf) { $liveLeaf[$lf] = ("{0,-16} {1}" -f $p.Name, $sp2) }
          }
        }
      }
    }
  }

  $regDeclared = @{}
  foreach ($e in $register) { $regDeclared[(Split-Path -Leaf $e.Rel).ToLower()] = $true }

  $notWired = @()
  $notDeclared = @()
  $conflicts = @()
  if (-not $regUnknown) {
    foreach ($e in $register) {
      if (-not $liveLeaf.ContainsKey((Split-Path -Leaf $e.Rel).ToLower())) {
        $notWired += ("{0,-16} {1}" -f $e.Event, $e.Rel)
      }
    }
    foreach ($k in $liveLeaf.Keys) {
      if ($regDeclared.ContainsKey($k)) { continue }
      # Only files this manifest already carries. A hook pointing at something outside $files is a
      # different finding and the destination sweep above owns it.
      if ($mfToLeaf.ContainsKey($k)) { $notDeclared += ("{0}   installed and running; no `$register entry" -f $liveLeaf[$k]) }
    }
    # Two implementations of one hook live on one event. Found the day the Python pulse was
    # declared (2026-08-31): the Node pulse had been the declared one for six days on a machine
    # running the Python one, and a bare run would have wired both. Reported and counted as red.
    foreach ($e in $register) {
      if (-not $e.Conflicts) { continue }
      $mine = (Split-Path -Leaf $e.Rel).ToLower()
      foreach ($c in @($e.Conflicts)) {
        if ($liveLeaf.ContainsKey($mine) -and $liveLeaf.ContainsKey($c.ToLower())) {
          $conflicts += ("{0,-16} {1}  AND  {2}   two implementations live on one event" -f $e.Event, $mine, $c)
        }
      }
    }
  }

  Write-Host ""
  Write-Host 'registration -- whether the files above are WIRED UP, which "ok" never meant' -ForegroundColor Cyan
  if ($regUnknown) {
    Write-Host ("  UNKNOWN     {0}" -f $regUnknown) -ForegroundColor Yellow
    Write-Host  "              no fallback list - a guess here would read as audited" -ForegroundColor Yellow
  } else {
    Write-Host ("  settings.json {0,3} hook(s) across {1} event(s)   the authority; nothing here is inferred from disk" -f $liveCount, $eventCount)
    Write-Host ("  `$register     {0,3} entr(ies)   what a fresh install of this repo would wire" -f $register.Count)
    Write-Host ("                {0,3} DECLARED, NOT REGISTERED   the file can be byte-perfect and the hook never fires" -f $notWired.Count) -ForegroundColor $(if ($notWired.Count) { 'Yellow' } else { 'DarkGray' })
    foreach ($n in $notWired) { Write-Host ("                     {0}" -f $n) -ForegroundColor Yellow }
    Write-Host ("                {0,3} REGISTERED, NOT DECLARED   runs here; a fresh install copies it and wires nothing" -f $notDeclared.Count) -ForegroundColor $(if ($notDeclared.Count) { 'Yellow' } else { 'DarkGray' })
    foreach ($n in $notDeclared) { Write-Host ("                     {0}" -f $n) -ForegroundColor Yellow }
    if ($conflicts.Count) {
      Write-Host ("                {0,3} CONFLICT   two implementations of one hook live on one event; a bare run adds nothing here, but resolve it by hand" -f $conflicts.Count) -ForegroundColor Magenta
      foreach ($n in $conflicts) { Write-Host ("                     {0}" -f $n) -ForegroundColor Magenta }
    }
  }

  # Reported separately on purpose. Summing them is what produced "13 drifted" for a machine with
  # one drifted file, and a summary that re-folds the distinction undoes the fix above.
  if ($absent -gt 0) {
    Write-Host ("`n{0} file(s) ABSENT - never installed here. Installing them REGISTERS their hooks; read the `$register list before running without -Check." -f $absent) -ForegroundColor Cyan
  }
  if ($drift -eq 0 -and $absent -eq 0) { Write-Host "`nFILES in sync with the repo -- read the registration block above before calling this machine correct." -ForegroundColor Green }
  elseif ($drift -eq 0) { Write-Host "`nno file drifted; see the absent list above." -ForegroundColor Yellow }
  else { Write-Host "`n$drift file(s) drifted (installed copy differs). Re-run without -Check to sync." -ForegroundColor Yellow }
  # The exit code now covers registration too, and deliberately does NOT move on UNKNOWN:
  # an unreadable authority is a refusal to answer, not a finding.
  $regBad = $notWired.Count + $notDeclared.Count + $conflicts.Count
  exit ($(if ($drift -eq 0 -and $absent -eq 0 -and $regBad -eq 0) { 0 } else { 1 }))
}

$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { $node = '<path to node.exe>' }

# Get-Command python on Windows usually resolves to the Microsoft Store stub
# under WindowsApps, which is an installer shim rather than an interpreter — a
# hook registered against it fails silently every turn. Skip it and find a real
# one, so this script never hands anybody a path that doesn't run.
$py = $null
foreach ($c in @(Get-Command python.exe -All -ErrorAction SilentlyContinue)) {
  if ($c.Source -and $c.Source -notmatch '\\WindowsApps\\') { $py = $c.Source; break }
}
if (-not $py) {
  $py = Get-ChildItem "$env:LOCALAPPDATA\Programs\Python\Python3*\python.exe" -ErrorAction SilentlyContinue |
        Sort-Object FullName -Descending | Select-Object -First 1 -ExpandProperty FullName
}
if (-not $py) { $py = '<path to python.exe — none found outside the Store stub>' }


# ── REGISTRATION ────────────────────────────────────────────────────────────────────────────
#
# The step that used to be a printed block for a human to paste, which is how a machine ended up
# running nine hooks this script had never heard of. See the header for the measurement.

function Resolve-Runner($kind) {
  if ($kind -eq 'py') { return $py }
  return $node
}

# The command string a registration produces. Quoted the way the existing entries are, so a
# re-run of this script against a file it already wrote compares equal and changes nothing.
function New-HookCommand($entry) {
  $exe  = Resolve-Runner $entry.Runner
  $path = Join-Path $dest $entry.Rel
  return ('"{0}" "{1}"' -f $exe, $path)
}

# Does an existing command line refer to this managed FILE, wherever it currently points?
# Matched on the leaf name so a registration aimed at the repo working tree — or at the old flat
# layout — is recognised as the same hook and RE-POINTED rather than duplicated. That case is
# real: sourced-stop.js and findings-return.js were hand-registered at repo paths on 2026-08-15.
# THE SEPARATOR IS LOAD-BEARING. The first version matched the bare leaf name and shipped a real
# defect on its first run, 2026-08-17 11:59: `stop.js` IS A SUBSTRING OF `sourced-stop.js`. So the
# stop.js entry matched the sourced-stop registration too, re-pointed it to stop.js, and then the
# sourced-stop entry found nothing left to match and appended itself — leaving stop.js registered
# TWICE and sourced-stop's original registration destroyed. Restored from the backup this script
# had just written, which is the only reason the backup exists.
#
# Requiring a path separator immediately before the leaf fixes it: `\sourced-stop.js` contains no
# `\stop.js`, because the character before `stop.js` there is a hyphen. Any future pair where one
# managed filename is a suffix of another is now safe by construction rather than by luck.
function Test-SameHook($command, $entry) {
  $leaf = Split-Path -Leaf $entry.Rel
  return ($command -match ('[\\/]' + [regex]::Escape($leaf)))
}

if ($NoRegister) {
  Write-Host "`nFiles are in sync. -NoRegister given; would have registered:" -ForegroundColor Cyan
  foreach ($e in $register) { Write-Host ("  {0,-17} {1}" -f $e.Event, (New-HookCommand $e)) -ForegroundColor DarkGray }
  Write-Host "`nRe-run without -NoRegister to apply." -ForegroundColor Cyan
  exit 0
}

$settingsPath = Join-Path $env:USERPROFILE '.claude\settings.json'
if (-not (Test-Path $settingsPath)) {
  Write-Host "`nNO settings.json at $settingsPath — refusing to create one." -ForegroundColor Red
  Write-Host "This script merges into a file the user owns; it does not invent that file." -ForegroundColor Red
  exit 1
}

# Parse before touching anything. A settings.json that does not parse must not be backed up over
# or written to — the failure is the user's to see, not this script's to paper over.
try   { $settings = Get-Content $settingsPath -Raw | ConvertFrom-Json }
catch { Write-Host "`nsettings.json DOES NOT PARSE — changing nothing. Fix it first:`n  $_" -ForegroundColor Red; exit 1 }

if (-not $settings.hooks) { $settings | Add-Member -NotePropertyName hooks -NotePropertyValue ([pscustomobject]@{}) -Force }

$added = 0; $repointed = 0; $already = 0; $refused = 0
$changes = @()

foreach ($e in $register) {
  $want = New-HookCommand $e
  $ev   = $e.Event

  if (-not $settings.hooks.PSObject.Properties[$ev]) {
    $settings.hooks | Add-Member -NotePropertyName $ev -NotePropertyValue @() -Force
  }
  # An event's value is an array of groups, each with its own .hooks array. Normalise to a list so
  # a single group deserialised as a bare object does not read as zero groups — that exact
  # serialisation bug cost a day on the pane list (9e74004).
  $groups = @($settings.hooks.$ev)
  if ($groups.Count -eq 0) {
    $groups = @([pscustomobject]@{ hooks = @() })
  }

  # MATCHER-SCOPED EVENTS (PreToolUse and friends). A group carries the matcher, so a hook
  # appended to whatever group happens to be last would fire on every tool in the session -- a
  # per-call node spawn, and a gate pointed at things it was never meant to see. Entries with no
  # Matcher take the original path untouched.
  $slot = $null
  if ($e.Matcher) {
    foreach ($g in $groups) {
      if ($g.PSObject.Properties['matcher'] -and $g.matcher -eq $e.Matcher) { $slot = $g; break }
    }
    if (-not $slot) {
      $slot = [pscustomobject]@{ matcher = $e.Matcher; hooks = @() }
      $groups = @($groups) + @($slot)
    }
  }

  $found = $false
  foreach ($g in $groups) {
    if (-not $g.hooks) { continue }
    foreach ($h in @($g.hooks)) {
      if ($h.command -and (Test-SameHook $h.command $e)) {
        $found = $true
        if ($h.command -ne $want) {
          $changes += ("  REPOINT  {0,-17} {1}" -f $ev, (Split-Path -Leaf $e.Rel))
          $changes += ("           was: {0}" -f $h.command)
          $changes += ("           now: {0}" -f $want)
          $h.command = $want
          $repointed++
        } else { $already++ }
      }
    }
  }

  # THE CONFLICT GUARD (2026-08-31). Before adding an entry, look for a live registration of any
  # file it declares a conflict with, on the same event. If one is there, REFUSE loudly and add
  # nothing: this script never unregisters, so the only way to avoid two pulses on a machine that
  # already runs the other one is to not add the second. Applies to ADD only — an entry already
  # registered is re-pointed as usual, because that changes what runs, not how many things run.
  if (-not $found -and $e.Conflicts) {
    foreach ($c in @($e.Conflicts)) {
      foreach ($g in $groups) {
        if (-not $g.hooks) { continue }
        foreach ($h in @($g.hooks)) {
          if ($h.command -and ($h.command -match ('[\\/]' + [regex]::Escape($c)))) {
            Write-Host ("  REFUSED  {0,-17} {1}   {2} is already live on this event; two implementations of one hook would run. Resolve by hand, then re-run." -f $ev, (Split-Path -Leaf $e.Rel), $c) -ForegroundColor Magenta
            $found = $true; $refused++
          }
        }
      }
    }
    if ($found) { $settings.hooks.$ev = $groups; continue }
  }

  if (-not $found) {
    if ($slot) { $target = $slot } else { $target = $groups[$groups.Count - 1] }
    if (-not $target.PSObject.Properties['hooks']) {
      $target | Add-Member -NotePropertyName hooks -NotePropertyValue @() -Force
    }
    $target.hooks = @($target.hooks) + @([pscustomobject]@{ type = 'command'; command = $want; timeout = 10 })
    $changes += ("  ADD      {0,-17} {1}" -f $ev, (Split-Path -Leaf $e.Rel))
    $added++
  }

  $settings.hooks.$ev = $groups
}

if ($added -eq 0 -and $repointed -eq 0) {
  if ($refused -gt 0) { Write-Host "`nregistration: nothing changed; $already hook(s) verified, $refused REFUSED above (a conflicting implementation is live). Not 'correct' until the refusal is resolved by hand." -ForegroundColor Magenta }
  else { Write-Host "`nregistration: already correct ($already hook(s) verified, nothing changed)." -ForegroundColor Green }
} else {
  $bak = "$settingsPath.bak-$(Get-Date -Format yyyyMMdd-HHmmss)"
  Copy-Item $settingsPath $bak -Force

  # NO BOM. `Set-Content -Encoding utf8` on PowerShell 5.1 PREPENDS ONE, and JSON.parse rejects a
  # leading BOM outright — so a settings.json written that way is unreadable to every Node consumer
  # while still looking fine to PowerShell. Shipped exactly that on the first real run,
  # 2026-08-17 11:59, and the read-back check below did not catch it because ConvertFrom-Json
  # TOLERATES a BOM. A validator more permissive than the real consumer is not a validator.
  #
  # This room already knew: hooks\userprompt-submit.js carries a BOM-strip in loadState() with the
  # note "anything on this machine that writes the file with PowerShell's -Encoding utf8 prepends
  # one". That comment was read during this very reconciliation, an hour before the bug.
  [IO.File]::WriteAllText($settingsPath, ($settings | ConvertTo-Json -Depth 24), [Text.UTF8Encoding]::new($false))

  # Read it back and parse it TWICE — once with PowerShell, once the way the harness actually reads
  # it. A settings.json this script broke would disable EVERY setting in it silently, and the backup
  # above is only useful if somebody knows to reach for it.
  $bytes = [IO.File]::ReadAllBytes($settingsPath)
  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Copy-Item $bak $settingsPath -Force
    Write-Host "`nWROTE A BOM into settings.json — RESTORED FROM BACKUP. JSON.parse would reject it." -ForegroundColor Red
    exit 1
  }
  try { Get-Content $settingsPath -Raw | ConvertFrom-Json | Out-Null }
  catch {
    Copy-Item $bak $settingsPath -Force
    Write-Host "`nWROTE AN UNPARSEABLE settings.json — RESTORED FROM BACKUP, nothing changed." -ForegroundColor Red
    Write-Host "  backup kept at $bak" -ForegroundColor Red
    exit 1
  }

  Write-Host "`nregistration:" -ForegroundColor Green
  $changes | ForEach-Object { Write-Host $_ -ForegroundColor Green }
  Write-Host ("  {0} added, {1} re-pointed, {2} already correct" -f $added, $repointed, $already) -ForegroundColor Green
  Write-Host ("  backup: {0}" -f $bak) -ForegroundColor DarkGray
}

Write-Host @"

Hooks NOT managed by this script are left exactly as they were — it never removes what it did
not install.

The settings watcher only reloads directories that held a settings file when the session started,
so a newly registered hook may not fire until /hooks is opened once or the session restarts.
Registration and firing are two states.

sourced-stop.js is a SENSOR ONLY - one ledger line per turn, no output, never blocks. The gate
version was refused in writing; the refusal is in the file's own header and
exo_memory/loop/catch_latency.md. Do not wire its ledger into a warning.

The pulse has two implementations - userprompt_pulse.py (zero deps) and hooks/userprompt-submit.js
(Node; adds the long-interval block and L3 verdict surfacing).

CORRECTED 2026-08-25. The two sentences that used to follow - "This registers the Node one, which
is what both machines were already running" - are FALSE on this machine, in both halves, and were
checked rather than assumed:
  - what actually runs on UserPromptSubmit here is the PYTHON one. ~/.claude/settings.json
    registers userprompt_pulse.py; five hooks run on that event and -Check calls all of them
    REGISTERED, NOT DECLARED.
  - hooks/userprompt-submit.js is ABSENT here. ~/.claude/shell/hooks/ does not exist. So the
    `$register entry at the UserPromptSubmit line is the ONE declared registration on that event,
    and it points at a file that is not installed.
Declared and actual are therefore DISJOINT on this event: everything running is undeclared, and
the only declared thing is absent. Running this script without -Check installs it and adds a
SECOND pulse alongside the Python one. That is what the absent-list warning above is for.

The Hold flag on that manifest entry protects a machine copy that no longer exists - the same
condition line 197 records having caused a false HOLD, now correctly reported as ABSENT. The
2026-08-17 measurement of 83 differing lines was taken when a machine copy WAS there; it no
longer describes this machine, and the repo file is the only surviving side.

RESOLVED IN PART 2026-08-31 (L022 P2b, pane Around — not the seat that wired row 10). Both pulse
files read before deciding. userprompt_pulse.py is now DECLARED in `$register (Runner 'py'), and the
Node line that declared hooks/userprompt-submit.js on the same event is REMOVED from `$register —
not because the Node file is wrong (it is the fuller one: beacon + long-interval block + L3
surfacing) but because its declaration never described a machine: the manifest Hold blocks the
copy in both modes, so the declaration only ever produced a registration against a missing file,
and beside a Python declaration it produced two pulses. The manifest Hold entry for the FILE is
untouched; nothing is deleted; this script still never unregisters anything. The desktop is still
not visible from here: if it runs the Node pulse, its -Check now reports that as REGISTERED, NOT
DECLARED (true), and the Conflicts guard on the Python entry refuses to add a second pulse there.
That guard is the reason declaring Python is safe on a machine nobody here can see.

OUT OF SCOPE OF THAT CHANGE AND STILL RED on this machine, so nobody reads the pulse line as a
green -Check: five hooks remain REGISTERED, NOT DECLARED — sessionstart-ambient.js (SessionStart),
board-digest.js, transcript-watch.js, dream-watch.js, ferry-watch.js (all UserPromptSubmit). Each
is one `$register line AND a decision about whether a fresh install should wire it; the pulse was
the only one of the six with a same-event twin, which is why it was the one taken alone. The
eleven ABSENT hooks/ and lib/ files are ruled DO NOT INSTALL in loop/absent_hooks_ruling_2026-08-25.md
and stay declared-not-registered until someone acts on that ruling; findings-return.js is absent
for its own reason. -Check exits 1 until all of that is resolved, and it should.

The desktop is NOT verifiable from here, which is why nothing has been deleted. See
dev/shell/README.md.
"@
