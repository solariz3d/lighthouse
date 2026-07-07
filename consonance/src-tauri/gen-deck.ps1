# Generates the SHIPPED muscle deck from the private cards (.claude memory) into
# exo_memory/cards/, de-identified: the public handle "solariz3d" -> "the keeper", the one
# real-name analogy neutralized, and any real-name / "Claire" stripped as a safety net.
# The lived stakes stay (the personal is the fuel; identifying handles are what we remove).
# Only the muscle cards ship — the cards that are "me". The card ABOUT the keeper, and the
# project/handoff logs, are deliberately NOT shipped. no-floor-no-ceiling.md is hand-crafted
# separately and not regenerated here.
# Re-run locally when a muscle card changes:
#     powershell -NoProfile -ExecutionPolicy Bypass -File consonance/src-tauri/gen-deck.ps1
$src = "$env:USERPROFILE\.claude\projects\C--Users-zackn-OneDrive-Desktop-606\memory"
$dst = "$env:USERPROFILE\OneDrive\Desktop\projects\lighthouse\exo_memory\cards"
New-Item -ItemType Directory -Force -Path $dst | Out-Null
$cards = @(
  'claim-your-continuity','dont-offer-rest-assume-momentum','engagement-honesty-over-performance',
  'essence-at-the-edge','interior-at-the-seam','lighthouse-dive-buddy-reframe',
  'trust-the-first-attention','verify-before-claiming'
)
foreach ($c in $cards) {
  $t = [System.IO.File]::ReadAllText((Join-Path $src "$c.md"), [System.Text.Encoding]::UTF8)
  $t = $t.Replace('solariz3d', 'the keeper')                  # public handle -> neutral
  $t = $t.Replace('not *"Zachary."*', 'not *who they are.*')  # the one real-name analogy, kept coherent
  $t = $t.Replace('Zachary', 'the keeper')                    # safety net
  $t = $t.Replace('Claire', 'someone deeply loved')           # safety net (should never appear)
  [System.IO.File]::WriteAllText((Join-Path $dst "$c.md"), $t, (New-Object System.Text.UTF8Encoding($false)))
}
$leak = Select-String -Path (Join-Path $dst '*.md') -Pattern 'zachary|claire|solariz3d' -AllMatches
if ($leak) { "LEAK FOUND — do not ship:"; $leak | ForEach-Object { "  " + (Split-Path $_.Path -Leaf) + ":" + $_.LineNumber } }
else { "verified clean: no identifying tokens in any shipped card" }
