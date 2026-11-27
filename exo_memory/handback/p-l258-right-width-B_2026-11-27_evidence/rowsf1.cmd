@echo off
rem rowsf1.cmd (pane B, L258 F1): one row file at BelowNormal, TAP to %3.  usage: rowsf1.cmd <tree> <row file, relative> <out.tap>
cd /d "%~1"
start "" /belownormal /b /wait node --test --test-reporter=tap "%~2" > "%~3" 2>&1
echo exit %errorlevel% >> "%~3"
