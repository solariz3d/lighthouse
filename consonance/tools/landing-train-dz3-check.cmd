@echo off
rem landing-train-dz3-check.cmd (B, L194): the landing train's check for dreamzone-3, run by landing-train.js in the train's own worktree
rem (its working directory). Exit 0 only when every suite (build.bat test) and both self-tests are green. The red lines it prints are the
rem ones landing-train.js names back to a branch's pane: the runner's FAIL rows, CTest's ***Failed, a self-test's FAILED total, and these.
setlocal
if not exist build.bat (echo BUILD FAILED: no build.bat in %CD% & exit /b 2)
rem A merged branch may move a dependency's pin; a merge does not move the dependency's checkout, so this does.
git submodule update --init --recursive
if errorlevel 1 (echo BUILD FAILED: git submodule update & exit /b 2)
call build.bat test
if errorlevel 1 (echo SUITES RED & exit /b 1)
build\bin\dz-gym.exe --selftest
if errorlevel 1 (echo SELFTEST RED: dz-gym & exit /b 1)
build\bin\dz-world.exe --selftest
if errorlevel 1 (echo SELFTEST RED: dz-world & exit /b 1)
echo CHECK GREEN
exit /b 0
