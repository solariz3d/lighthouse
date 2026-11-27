@echo off
rem rows-f3.cmd (pane B, L258 F3): the two right-width row files, at BelowNormal, TAP to %2.  usage: rows-f3.cmd <tree> <out.tap>
cd /d "%~1"
start "" /belownormal /b /wait node --test --test-reporter=tap test\core_right_width.test.js app\test\core-right-width-panel.test.js > "%~2" 2>&1
echo exit %errorlevel% >> "%~2"
