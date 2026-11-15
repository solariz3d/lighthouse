@echo off
rem landing-train-dz3-check.cmd (B, L194): the landing train's check for dreamzone-3, run by landing-train.js in the train's own worktree
rem (its working directory). Exit 0 only when every suite (build.bat test) and both self-tests are green; exit 3 only when everything else
rem is green and the world self-test's only reds are machine-bound (D675, B: the train re-reads that once). The red lines it prints are the
rem ones landing-train.js names back to a branch's pane: the runner's FAIL rows, CTest's ***Failed, a self-test's FAILED total, and these.
setlocal
rem The build at 4 jobs, the room's rule for heavy runs: build.bat leaves Ninja its default (about 34 here), and that many MSVC
rem compiles at once is the low-memory reaper's case.
set CMAKE_BUILD_PARALLEL_LEVEL=4
if not exist build.bat (echo BUILD FAILED: no build.bat in %CD% & exit /b 2)
rem A merged branch may move a dependency's pin; a merge does not move the dependency's checkout, so this does.
git submodule update --init --recursive
if errorlevel 1 (echo BUILD FAILED: git submodule update & exit /b 2)
rem By its full path: a Claude Code shell sets NoDefaultCurrentDirectoryInExePath, so a bare `call build.bat` is "not
rem recognized" (the train's first real run, 2026-11-13). build\bin\... below has a path in it and is found either way.
rem Each red line reads "not EQU 0", never "if errorlevel 1": that one means 1 OR MORE, and a Windows crash code (0xC0000005, an access
rem violation) is negative as a signed int, so a crashing self-test left this script as CHECK GREEN (D675, B, measured on 2026-11-14).
call "%CD%\build.bat" test
if not %ERRORLEVEL% EQU 0 (echo SUITES RED & exit /b 1)
build\bin\dz-gym.exe --selftest
if not %ERRORLEVEL% EQU 0 (echo SELFTEST RED: dz-gym & exit /b 1)
build\bin\dz-world.exe --selftest
rem Its exit 3 means its ONLY reds are machine-bound (dreamzone-3 modes.h selftest_exit_code); landing-train.js reads that once more in the
rem same hold. An EXACT 3 and first: "if errorlevel 3" is true for 3 or more, and the red line below would take a 3 as an ordinary red.
if %ERRORLEVEL% EQU 3 (echo SELFTEST MACHINE-BOUND: dz-world & exit /b 3)
if not %ERRORLEVEL% EQU 0 (echo SELFTEST RED: dz-world & exit /b 1)
echo CHECK GREEN
exit /b 0
