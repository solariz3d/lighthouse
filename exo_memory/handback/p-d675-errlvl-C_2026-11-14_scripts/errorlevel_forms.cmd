@echo off
REM errorlevel_forms.cmd <code>: how each test form reads a program exiting with <code>, inside a block (each block after a success, as a build step would be) and at top level.
setlocal
set "CODE=%~1"
echo exit code %CODE%:
cmd /c exit %CODE%
if errorlevel 1 ( echo   top level, old "if errorlevel 1": FAIL ) else ( echo   top level, old "if errorlevel 1": success )
cmd /c exit %CODE%
if not %ERRORLEVEL% EQU 0 ( echo   top level, asked "if not %%ERRORLEVEL%% EQU 0": FAIL ) else ( echo   top level, asked "if not %%ERRORLEVEL%% EQU 0": success )
cmd /c exit %CODE%
if errorlevel 1 ( echo   top level, mine: FAIL ) else if not errorlevel 0 ( echo   top level, mine: FAIL ) else ( echo   top level, mine: success )
cmd /c exit 0
if "1"=="1" (
  cmd /c exit %CODE%
  if errorlevel 1 ( echo   in a block, old: FAIL ) else ( echo   in a block, old: success )
)
cmd /c exit 0
if "1"=="1" (
  cmd /c exit %CODE%
  if not %ERRORLEVEL% EQU 0 ( echo   in a block, asked: FAIL ) else ( echo   in a block, asked: success )
)
cmd /c exit 0
if "1"=="1" (
  cmd /c exit %CODE%
  if errorlevel 1 ( echo   in a block, mine: FAIL ) else if not errorlevel 0 ( echo   in a block, mine: FAIL ) else ( echo   in a block, mine: success )
)
