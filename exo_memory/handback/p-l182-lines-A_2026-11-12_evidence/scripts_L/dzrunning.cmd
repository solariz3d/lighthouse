@echo off
rem dzrunning.cmd (B, L168 fix): is a Dreamzone program running? Exit 0 and name it when one is; exit 1 when clear.
rem Windows' own tasklist.exe and find.exe by full path, so Git's find on the PATH cannot shadow them (it did, L161-L168).
rem Use in a landing script:   call "<this file>" && (echo a dz program is running & exit /b 3)
set "DZR_FOUND="
for %%P in (dz-world.exe dz-gym.exe) do (
  "%SystemRoot%\System32\tasklist.exe" /FI "IMAGENAME eq %%P" /NH | "%SystemRoot%\System32\find.exe" /I "%%P" >nul && (
    echo dzrunning: %%P IS RUNNING
    set "DZR_FOUND=1"
  )
)
if defined DZR_FOUND exit /b 0
echo dzrunning: clear, no dz-world.exe or dz-gym.exe running
exit /b 1
