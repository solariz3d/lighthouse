# run_l255.ps1 (pane O, L255): (1) row 17 as amended, red against the base page (index.html set aside by git stash, put back after); (2) rows 13 to 18 of
# texture-page, theme.test.js, and menubar-page rows 2 and 17, all against the tip. Each at BelowNormal (cmd start /belownormal). Outputs in this folder.
$S = 'C:\Users\zackn\AppData\Local\Temp\claude\b4c3e73775322006\8bcb0f46-5279-406c-9bac-2ee3a83b1e0e\scratchpad\l255'
Set-Location C:\Consonance\t180-wt-o-l255
git stash push --quiet -- app/index.html
"stashed: " + (git stash list | Select-Object -First 1)
cmd /c "start `"`" /belownormal /b /wait node --test --test-name-pattern=`"row 17 `" app/test/texture-page.test.js > $S\red_row17_amended.txt 2>&1"
git stash pop --quiet
"popped; index.html changed again: " + ((git diff --stat -- app/index.html) -join ' ')
$runs = @(
  @('green_texture_13_18', 'node --test --test-name-pattern="row 1[3-8] " app/test/texture-page.test.js'),
  @('green_theme',         'node --test app/test/theme.test.js'),
  @('green_menubar_2_17',  'node --test --test-name-pattern="row (2|17) " app/test/menubar-page.test.js')
)
foreach ($r in $runs) {
  $t0 = Get-Date
  cmd /c "start `"`" /belownormal /b /wait $($r[1]) > $S\$($r[0]).txt 2>&1"
  "$($r[0]): $([int]((Get-Date) - $t0).TotalSeconds) s; " + ((Select-String -Path "$S\$($r[0]).txt" -Pattern '^# (pass|fail|skipped) ' | ForEach-Object { $_.Line }) -join ' ')
}
