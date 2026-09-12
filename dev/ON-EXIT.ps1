# ON-EXIT.ps1 - the reminder that does the work. ARRIVING.ps1 starts this in its own window after
# launching Consonance. It waits until Consonance is closed, then runs LEAVING.ps1 from the same
# stick, so the export happens the moment you close the app - before you can forget it. The window
# stays open with the result so you see it.
#
#   -DryRun   do not wait for the app; run LEAVING.ps1 -DryRun now (for testing)

param([switch]$DryRun)
$ErrorActionPreference = 'Continue'
$stick = $PSScriptRoot
$leaving = Join-Path $stick 'LEAVING.ps1'

function AppRunning { [bool](Get-Process -Name consonance -ErrorAction SilentlyContinue) }

Write-Host ""
Write-Host "  ==========================================================="
Write-Host "   CONSONANCE IS OPEN. When you close it, this window will"
Write-Host "   copy every seat's new conversation onto the stick for you."
Write-Host "   Do NOT unplug the stick until this window says DONE."
Write-Host "  ==========================================================="
Write-Host ""

if (-not $DryRun) {
  while (AppRunning) { Start-Sleep -Seconds 5 }
  Start-Sleep -Seconds 3
  Write-Host "[on-exit] Consonance closed. Exporting to the stick ..."
}

if (-not (Test-Path $leaving)) {
  Write-Host "[on-exit] the stick is not here any more ($stick). Plug it back in and run LEAVING.ps1 from it yourself."
  exit 2
}

if ($DryRun) { & powershell -ExecutionPolicy Bypass -File $leaving -DryRun }
else { & powershell -ExecutionPolicy Bypass -File $leaving }
$code = $LASTEXITCODE

Write-Host ""
if ($code -eq 0) {
  Write-Host "  ==========================================================="
  Write-Host "   DONE. The stick has everything. You can unplug it now."
  Write-Host "   On the other machine: ARRIVING.ps1 from the stick."
  Write-Host "  ==========================================================="
} else {
  Write-Host "  ==========================================================="
  Write-Host "   NOT DONE (exit $code). Read the lines above before unplugging."
  Write-Host "  ==========================================================="
}
exit $code
