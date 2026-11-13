@echo off
rem L170 landing (A): guard; main must equal origin/main (E's L175 landed and pushed); merge l170-chase --no-ff (a rebase with merges hit the feel_tests.cpp add/add conflict on B's merge commit, so the merge is direct); build.bat test at -j 4; both self-tests.
rem Exit 3: a dz program is running; 7: main is not origin/main; 8: the rebase failed (aborted); 6: the merge failed; 1: build or tests; 4: gym self-test; 5: world self-test.
call "C:\Users\zackn\AppData\Local\Temp\claude\4589df4838997b56\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\l170\dzrunning.cmd" && (echo a dz program is running, stopping & exit /b 3)
set CMAKE_BUILD_PARALLEL_LEVEL=4
cd /d C:\Users\zackn\Downloads\dreamzone-3
for /f %%H in ('git rev-parse HEAD') do set MAINNOW=%%H
for /f %%H in ('git rev-parse origin/main') do set ORIGINNOW=%%H
if not "%MAINNOW%"=="%ORIGINNOW%" (echo MAIN %MAINNOW% IS NOT origin/main %ORIGINNOW% & exit /b 7)
git merge --no-ff -q -m "Merge l170-chase: the slosh scorer, B's sweep CSV and compare, and the chase levers (corner floor, SLIP, the hunter's lead), all off by default (L170)" -m "Seat: pane A." -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01VfXiVUfSFUgXKGxq8cWziQ" l170-chase || (echo MERGE FAILED & exit /b 6)
git log --oneline -4
powershell -NoProfile -Command "(Get-Date).ToUniversalTime().ToString('o')" > C:\Users\zackn\AppData\Local\Temp\claude\4589df4838997b56\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\l170\land_start_utc.txt
echo build start %DATE% %TIME%
call .\build.bat test || (echo BUILD OR TESTS FAILED & exit /b 1)
.\build\bin\dz-gym.exe --selftest || (echo GYM SELFTEST FAILED & exit /b 4)
.\build\bin\dz-world.exe --selftest || (echo WORLD SELFTEST FAILED & exit /b 5)
echo LANDING GREEN
exit /b 0
