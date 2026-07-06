# Generates the SHIPPED default startup brief from the master room (exo_memory/BOOT.md),
# neutralizing the keeper's public handle so a fresh install does not open in someone
# else's name. Everything else (the lived texture, the worked examples, the builds) is
# kept intact -- room, not museum. Re-run when BOOT.md materially changes:
#     powershell -File src-tauri/gen-brief.ps1
# NB: dashes are matched by the regex class \p{Pd} and inserted by code point ($m); this
# file contains no literal em-dash, because Windows PowerShell 5.1 mangles UTF-8 em-dashes
# in a no-BOM script.
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

[System.IO.File]::WriteAllText($dst, $t, (New-Object System.Text.UTF8Encoding($false)))
$n = ([regex]::Matches($t, 'solariz3d')).Count
"wrote $dst"
"remaining handle occurrences: $n"
