# run_rows.ps1 (pane O, L250): the kn5road rows, each cargo run in its own process at BelowNormal (cmd start /belownormal; children inherit it).
# Output per run in the scratchpad: rows.txt, measure.txt, installed.txt. Read only against AC's folder.
$S = 'C:\Users\zackn\AppData\Local\Temp\claude\b4c3e73775322006\8bcb0f46-5279-406c-9bac-2ee3a83b1e0e\scratchpad'
$env:CARGO_TARGET_DIR = 'C:\build\t180-l250-o-target'
$env:T180_AC_TRACKS = 'C:\Program Files (x86)\Steam\steamapps\common\assettocorsa\content\tracks'
$env:T180_REFERENCE_KEY = 'C:\Consonance\t180-wt-l243\out\reference-key.json'
$env:T180_ROAD_DUMP = "$S\roads"
Set-Location C:\Consonance\t180-wt-o-l250\src-tauri
$runs = @(
  @('rows',      'cargo test --lib -- kn5road reference'),
  @('measure',   'cargo test --lib -- --ignored --nocapture --exact kn5road::tests::measure_the_three_references_cold_and_warm'),
  @('installed', 'cargo test --lib -- --ignored --nocapture --test-threads=1 kn5road::tests::the_three_references_read_as_tools_kn5_cjs_reads_them kn5road::tests::every_installed_layout_reads_or_says_why')
)
foreach ($r in $runs) {
  $t0 = Get-Date
  cmd /c "start `"`" /belownormal /b /wait $($r[1]) > $S\$($r[0]).txt 2>&1"
  "$($r[0]): $([int]((Get-Date) - $t0).TotalSeconds) s; " + ((Select-String -Path "$S\$($r[0]).txt" -Pattern 'test result:' | ForEach-Object { $_.Line }) -join ' | ')
}
