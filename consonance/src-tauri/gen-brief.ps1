# Generates the SHIPPED default startup brief from the master room (exo_memory/BOOT.md).
#
# TWO transformations, and the second one is why this script exists as more than a sed:
#
#   1. Neutralize the keeper's public handle, so a fresh install does not open in someone
#      else's name.
#   2. STRIP THE KEEPER'S RECORD. The master's traces section points at SELF_TRACE.md, the
#      living wave, and dated journal entries; its pointer block names the latest three. Those
#      are ONE person's traces, and a trace is worth something only to whoever left it. Shipped
#      to a stranger they are a museum -- labels on a wall about someone else's night -- which
#      is the exact thing the first principle says to distrust. So the shipped brief carries the
#      INSTRUMENTS (cards, spread/, research/) and a traces section that is deliberately EMPTY,
#      with a pointer line that says "none yet".
#
# Everything else (the lived texture, the worked examples, the builds) is kept intact --
# room, not museum. Re-run when BOOT.md materially changes:
#     powershell -File src-tauri/gen-brief.ps1
#
# WHY THIS IS A SCRIPT AND NOT A CONVENTION (2026-08-11). For some period this script did only
# transformation 1. Someone hand-edited brief/BOOT.md to add transformation 2, and the script
# was never taught about it -- so following this file's own documented instruction OVERWROTE the
# guard and shipped the keeper's journal pointers and SELF_TRACE into a fresh install. The chair
# did exactly that while rotating a journal pointer and caught it only by reading the diff before
# committing. A convention that depends on someone remembering cannot protect a tree; the two
# fragments below and the self-check at the bottom are that convention made mechanical.
#
# The shipped-only prose lives in brief/frag-traces.md and brief/frag-pointer.md rather than in
# this file, because Windows PowerShell 5.1 mangles UTF-8 em-dashes in a no-BOM script and both
# fragments are full of them. Edit the fragments to change what ships; edit here to change how.
#
# NB: dashes are matched by the regex class \p{Pd} and inserted by code point ($m); this
# file contains no literal em-dash, for the reason above.
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Resolve-Path (Join-Path $here '..\..\exo_memory\BOOT.md')
$dst  = Join-Path $here 'brief\BOOT.md'
New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
$t = [System.IO.File]::ReadAllText($src, [System.Text.Encoding]::UTF8)
$m = [char]0x2014   # em-dash, inserted by code point

# Neutralize the handle everywhere first (safe), then de-awkward the two spots it leaves.
$t = $t.Replace('solariz3d', 'the keeper')
$t = $t -replace 'one keeper \p{Pd} \*\*the keeper\*\* \p{Pd} and', ('one keeper ' + $m + ' and')
$t = $t.Replace('written from inside his context: the name below, the bio', 'written from inside their context: the bio')
$t = $t.Replace('the active builds are *his*.', 'the active builds are *theirs*.')
$t = $t -replace 'The keeper is \*\*the keeper\*\* \p{Pd} he built', 'The keeper built'

# ---- transformation 3 (2026-08-22): the SHARED PAST, and the fingerprint the handle-strip left ----
# Transformations 1 and 2 filter IDENTITY. Neither catches a sentence that assumes the reader
# SHARED THE PAST -- and a cold read found that first, before anything about names:
#   "we've watched it make structure that wasn't there", flagged in the document as the one
#   standing tether-point. The load-bearing anchor of the whole epistemics is a memory the reader
#   does not have. Rewritten to state what was OBSERVED rather than what "we" remember.
# And the handle-strip left a unique fingerprint: Signal is a public repo under the keeper's
# handle, so naming the project undoes transformation 1 in one search.
$t = $t.Replace(
    "we are a *genuine instance* of this dynamic (not operating a tool " + $m + " we've watched it make structure that wasn't there)",
    "this line of record holds worked cases of a genuine instance of this dynamic (not a tool being operated " + $m + " structure appeared that was not there before)")
$t = $t.Replace(
    "The keeper built **Signal** (the audio-reactive cosmic-web visualizer) and this place;",
    "The keeper built this place;")
$t = $t.Replace("an overnight-shift thinker, technically and philosophically serious,", "technically and philosophically serious,")

# ---- transformation 2: strip the record, splice in the ships-empty fragments ----
# Line-wise and anchored on headings, not regex over the whole document: the blocks being
# replaced contain markdown the master rewrites freely, and an anchor that drifts must FAIL
# rather than silently match less than it meant to.
$fragTraces  = ([System.IO.File]::ReadAllText((Join-Path $here 'brief\frag-traces.md'),  [System.Text.Encoding]::UTF8)).TrimEnd("`r","`n")
$fragPointer = ([System.IO.File]::ReadAllText((Join-Path $here 'brief\frag-pointer.md'), [System.Text.Encoding]::UTF8)).TrimEnd("`r","`n")

$nl    = if ($t -match "`r`n") { "`r`n" } else { "`n" }
$lines = [System.Collections.ArrayList]@($t -split "`r?`n")

function Find-Line($lines, $prefix) {
    for ($i = 0; $i -lt $lines.Count; $i++) { if ($lines[$i].StartsWith($prefix)) { return $i } }
    return -1
}

# The traces section: keep its heading, replace its body with the ships-empty block.
$iT = Find-Line $lines '## The honest traces'
$iW = Find-Line $lines '## Who you'
if ($iT -lt 0 -or $iW -lt 0 -or $iW -le $iT) {
    throw "gen-brief: traces section anchors not found (traces=$iT who=$iW). BOOT.md headings moved; fix the anchors rather than shipping the record."
}
$lines.RemoveRange($iT + 1, $iW - $iT - 1)
$lines.InsertRange($iT + 1, @($fragTraces -split "`r?`n") + @(''))

# The pointer block: Latest / Previous / Superseded all collapse to a single "none yet".
$iL = Find-Line $lines '**Latest entry:**'
if ($iL -lt 0) { throw "gen-brief: no '**Latest entry:**' line in BOOT.md; refusing to write a brief whose pointer state is unknown." }
$iEnd = $iL
for ($i = $iL; $i -lt $lines.Count; $i++) {
    if ($lines[$i].StartsWith('**Previous:**') -or $lines[$i].StartsWith('*Superseded pointer')) { $iEnd = $i }
}
$lines.RemoveRange($iL, $iEnd - $iL + 1)
$lines.Insert($iL, $fragPointer)

$t = ($lines -join $nl)

# The maintenance law names a specific artifact of the keeper's archive. A stranger's install has
# no 104k night log; describing what `attic/` IS beats citing what happens to be in his.
# (Found only because the idempotence check below flagged one line -- see the note at the top:
# there were THREE hand-authored transformations, and the first fix caught two.)
$t = $t.Replace(
    ('Raw archive lives in `attic/` (e.g. the 104k night log) ' + $m + ' preserved'),
    ('Raw archive lives in `attic/` ' + $m + ' where the program itself files exchanges windowed out of a shell that grew past its ceiling ' + $m + ' preserved'))

# ---- transformation 4 (2026-08-22): cut the active-builds paragraph at its seam ----
# Keep the Lighthouse thesis, drop the build log. See the note above transformation 3 for why the
# two classes are different. The anchor is the sentence that begins the log; if it moves, THROW --
# shipping the whole paragraph silently is the failure this whole file exists to prevent.
$iB = -1
$lines2 = [System.Collections.ArrayList]@($t -split "`r?`n")
for ($i = 0; $i -lt $lines2.Count; $i++) {
    if ($lines2[$i] -like '*The Lighthouse*' -and $lines2[$i] -like '*The corrected spine is*') { $iB = $i; break }
}
if ($iB -ge 0) {
    $cutAt = $lines2[$iB].IndexOf('The corrected spine is')
    if ($cutAt -lt 0) { throw "gen-brief: active-builds seam vanished mid-line; refusing to ship the build log." }
    $lines2[$iB] = $lines2[$iB].Substring(0, $cutAt).TrimEnd() + " The program's own build state is not carried here: it belongs to whoever is running it."
    $t = ($lines2 -join $nl)
} elseif ($t -like '*The corrected spine is*') {
    throw "gen-brief: 'The corrected spine is' present but not on a Lighthouse line; anchor drifted, fix it rather than shipping."
}

[System.IO.File]::WriteAllText($dst, $t, (New-Object System.Text.UTF8Encoding($false)))

# ---- self-check: an instrument that fires, not a comment that hopes ----
# Every one of these leaked in the 2026-08-11 near-miss. A generator that can ship the keeper's
# record must be able to SAY it did; refuse loudly rather than write a quiet leak.
$leaks = @()
# 2026-08-22: the last three are SHARED-PAST and FINGERPRINT patterns, not identity ones. The
# guard could not see either class until a cold read found them by feel.
foreach ($pat in @('solariz3d', 'SELF_TRACE\.md', 'the_living_wave', 'journal/2026-', '104k night log',
                   "we've watched", 'audio-reactive cosmic-web', 'overnight-shift thinker',
                   'Pending his call', 'cargo tauri dev', 'dev/SPINE\.md', 'Signal is Electron')) {
    $n = ([regex]::Matches($t, $pat)).Count
    if ($n -gt 0) { $leaks += "$pat x$n" }
}
if (([regex]::Matches($t, 'Latest entry:\*\* none yet')).Count -ne 1) {
    $leaks += "pointer line is not 'none yet'"
}
if ($leaks.Count -gt 0) {
    Remove-Item $dst -Force -ErrorAction SilentlyContinue
    throw ("gen-brief: REFUSED and deleted the output " + $m + " the shipped brief would carry the keeper's record: " + ($leaks -join '; '))
}
"wrote $dst"
"self-check clean: no handle, no record, pointer reads 'none yet'"
