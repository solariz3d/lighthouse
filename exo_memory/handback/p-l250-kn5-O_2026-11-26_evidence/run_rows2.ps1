# run_rows2.ps1 (pane O, L250, the start and tighter-match part): the kn5road rows, the two installed-track rows, then the hand mutants, each in its own
# process at BelowNormal (cmd start /belownormal; children inherit it). Outputs in the scratchpad: rows2.txt, installed2.txt, mutants2.txt. Read only against AC's folder.
$S = 'C:\Users\zackn\AppData\Local\Temp\claude\b4c3e73775322006\8bcb0f46-5279-406c-9bac-2ee3a83b1e0e\scratchpad'
$env:CARGO_TARGET_DIR = 'C:\build\t180-l250-o-target'
$env:T180_AC_TRACKS = 'C:\Program Files (x86)\Steam\steamapps\common\assettocorsa\content\tracks'
$env:T180_REFERENCE_KEY = 'C:\Consonance\t180-wt-l243\out\reference-key.json'
Set-Location C:\Consonance\t180-wt-o-l250\src-tauri
$runs = @(
  @('rows2',      'cargo test --lib -- kn5road reference'),
  @('installed2', 'cargo test --lib -- --ignored --nocapture --test-threads=1 kn5road::tests::the_three_references_read_as_tools_kn5_cjs_reads_them kn5road::tests::every_installed_layout_reads_or_says_why'),
  @('mutants2',   "node $S\mutate2.js C:\Consonance\t180-wt-o-l250")
)
foreach ($r in $runs) {
  $t0 = Get-Date
  cmd /c "start `"`" /belownormal /b /wait $($r[1]) > $S\$($r[0]).txt 2>&1"
  "$($r[0]): $([int]((Get-Date) - $t0).TotalSeconds) s; " + ((Select-String -Path "$S\$($r[0]).txt" -Pattern 'test result:|^applied' | ForEach-Object { $_.Line }) -join ' | ')
}
