@echo off
rem landing-train-dz3-guard.cmd (B, L194; the L168 guard): is a Dreamzone program running? Exit 0 and name it when one is (promotion waits);
rem exit 1 when clear. Windows' own tasklist.exe and find.exe by full path, so Git's find on the PATH cannot shadow them (it did, L161-L168).
set "DZR_FOUND="
for %%P in (dz-world.exe dz-gym.exe) do (
  "%SystemRoot%\System32\tasklist.exe" /FI "IMAGENAME eq %%P" /NH | "%SystemRoot%\System32\find.exe" /I "%%P" >nul && (
    echo dz guard: %%P IS RUNNING
    set "DZR_FOUND=1"
  )
)
if defined DZR_FOUND exit /b 0
echo dz guard: clear, no dz-world.exe or dz-gym.exe running
exit /b 1
