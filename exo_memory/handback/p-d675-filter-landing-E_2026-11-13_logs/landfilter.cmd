@echo off
rem The filter landing's check (pane E, D675), in the landing worktree on G:, run at BelowNormal by its caller
rem (start /belownormal). The same steps as consonance/tools/landing-train-dz3-check.cmd, but EACH PROGRAM'S OWN EXIT CODE is printed
rem straight after it (no pipe, no verdict by "if errorlevel 1", which is false for a negative crash code), each program's
rem output to its own log so its own "passed" line can be read. Local file transport is allowed for this run only, so the
rem submodule update can read his clone's module repositories (read only).
setlocal
cd /d G:\consonance-scratch\dz3-e-landfilter || exit /b 2
call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat" >nul 2>nul
set GIT_CONFIG_COUNT=1
set GIT_CONFIG_KEY_0=protocol.file.allow
set GIT_CONFIG_VALUE_0=always
set CMAKE_BUILD_PARALLEL_LEVEL=4
set L=G:\consonance-scratch\e-landfilter-logs
if not exist %L% mkdir %L%
git submodule update --init --recursive > %L%\submodules.log 2>&1
echo EXIT submodules %errorlevel%
call "%CD%\build.bat" test > %L%\build_test.log 2>&1
echo EXIT build.bat-test %errorlevel%
build\bin\dz-gym.exe --selftest > %L%\gym_selftest.log 2>&1
echo EXIT dz-gym-selftest %errorlevel%
build\bin\dz-world.exe --selftest > %L%\world_selftest.log 2>&1
echo EXIT dz-world-selftest %errorlevel%
echo DONE
