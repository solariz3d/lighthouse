# cmpall.ps1: cmp614.js over three scene trees x his three tracks (copies), one at a time, acs checked before each by run.ps1; prints each result
$S = 'C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\d614'; $G = 'G:\Consonance-tools\scratch-A-d614'; $H = 'G:\Consonance-tools\scratch-A-d609\his'
$W = 'C:\Users\nname\Downloads\t180-wt-a614'; $old = "$W\src\export\finalscene.old614.js"; $new = "$W\src\export\finalscene.js"
$trees = @{ '81b8b25' = $W; '8fb6ecc' = 'G:\Consonance-tools\scratch-A-d609\tree-8fb6ecc'; 'e911792' = 'G:\Consonance-tools\scratch-A-d609\tree-e911792' }
foreach ($t in '81b8b25', '8fb6ecc', 'e911792') { foreach ($k in 'elysium', 'crazy', 'test10') {
  $out = "$G\cmp-$t-$k.out"
  $r = & "$S\run.ps1" $out --max-old-space-size=12000 "$S\cmp614.js" $trees[$t] "$H\$k.t180track" $old $new "$G\cmp-$t-$k.json"
  "== $t $k ($r)"; Get-Content $out; Get-Content "$out.err" -TotalCount 3
} }
